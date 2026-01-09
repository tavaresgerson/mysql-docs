### 14.7.3 Lås definidos por diferentes instruções SQL no InnoDB

Uma leitura de bloqueio, uma `UPDATE` ou uma `DELETE` geralmente definem bloqueios de registro em todos os registros de índice que são varridos no processamento de uma instrução SQL. Não importa se existem condições `WHERE` na instrução que excluiriam a linha. O `InnoDB` não lembra a condição `WHERE` exata, mas apenas sabe quais faixas de índice foram varridas. Os bloqueios são normalmente bloqueios de próxima chave que também bloqueiam inserções no "lacuna" imediatamente antes do registro. No entanto, o bloqueio de lacuna pode ser desativado explicitamente, o que faz com que o bloqueio de próxima chave não seja usado. Para mais informações, consulte a Seção 14.7.1, “Bloqueio InnoDB”. O nível de isolamento de transação também pode afetar quais bloqueios são definidos; consulte a Seção 14.7.2.1, “Níveis de Isolamento de Transação”.

Se um índice secundário for usado em uma pesquisa e os registros do índice a serem configurados forem exclusivos, o `InnoDB` também recupera os registros do índice agrupado correspondentes e configura travamentos neles.

Se você não tiver índices adequados para sua consulta e o MySQL precisar percorrer toda a tabela para processá-la, cada linha da tabela será bloqueada, o que, por sua vez, impedirá todas as inserções feitas por outros usuários na tabela. É importante criar bons índices para que suas consultas não percorram mais linhas do que o necessário.

O `InnoDB` define tipos específicos de bloqueios da seguinte forma.

- `SELECT ... FROM` é uma leitura consistente, que lê um instantâneo do banco de dados e não configura nenhum bloqueio, a menos que o nível de isolamento da transação seja definido como `SERIALIZABLE`. Para o nível `SERIALIZABLE`, a pesquisa configura blocos compartilhados de próxima chave nos registros do índice que encontrar. No entanto, apenas um bloqueio de registro de índice é necessário para instruções que bloqueiam linhas usando um índice único para buscar uma linha única.

- Para `SELECT ... FOR UPDATE` ou `SELECT ... LOCK IN SHARE MODE`, os bloqueios são adquiridos para as linhas digitalizadas e devem ser liberados para as linhas que não se qualificam para inclusão no conjunto de resultados (por exemplo, se não atenderem aos critérios fornecidos na cláusula `WHERE`). No entanto, em alguns casos, as linhas podem não ser desbloqueadas imediatamente porque a relação entre uma linha de resultado e sua fonte original é perdida durante a execução da consulta. Por exemplo, em uma `UNION`, as linhas digitalizadas (e bloqueadas) de uma tabela podem ser inseridas em uma tabela temporária antes de avaliar se se qualificam para o conjunto de resultados. Nessa circunstância, a relação das linhas na tabela temporária com as linhas na tabela original é perdida e as últimas linhas não são desbloqueadas até o final da execução da consulta.

- `SELECT ... LOCK IN SHARE MODE` define bloqueios de próxima chave compartilhados em todos os registros de índice que a pesquisa encontra. No entanto, apenas um bloqueio de registro de índice é necessário para instruções que bloqueiam linhas usando um índice único para buscar uma linha única.

- `SELECT ... FOR UPDATE` define um bloqueio de próxima chave exclusivo em cada registro que a pesquisa encontra. No entanto, apenas um bloqueio de registro de índice é necessário para declarações que bloqueiam linhas usando um índice único para pesquisar uma linha única.

  Para registros de índice que o mecanismo de pesquisa encontra, os blocos `SELECT ... FOR UPDATE` impedem que outras sessões realizem `SELECT ... LOCK IN SHARE MODE` ou leiam em certos níveis de isolamento de transação. Leitura consistente ignora quaisquer bloqueios definidos nos registros que existem na visualização de leitura.

- `UPDATE ... WHERE ...` define um bloqueio de próxima chave exclusivo em cada registro que a pesquisa encontra. No entanto, apenas um bloqueio de registro de índice é necessário para declarações que bloqueiam linhas usando um índice único para buscar uma linha única.

- Quando a `UPDATE` modifica um registro de índice agrupado, bloqueios implícitos são tomados em registros de índice secundário afetados. A operação `UPDATE` também toma bloqueios compartilhados em registros de índice secundário afetados ao realizar varreduras de verificação de duplicatas antes de inserir novos registros de índice secundário e ao inserir novos registros de índice secundário.

- `DELETE FROM ... WHERE ...` define um bloqueio exclusivo de próxima chave em cada registro que a pesquisa encontra. No entanto, apenas um bloqueio de registro de índice é necessário para declarações que bloqueiam linhas usando um índice único para buscar uma linha única.

- `INSERT` define um bloqueio exclusivo na linha inserida. Esse bloqueio é um bloqueio de registro de índice, não um bloqueio de próxima chave (ou seja, não há bloqueio de lacuna) e não impede que outras sessões insiram na lacuna antes da linha inserida.

  Antes de inserir a linha, um tipo de bloqueio de lacuna chamado bloqueio de intenção de inserção é definido. Esse bloqueio sinaliza a intenção de inserir de tal forma que múltiplas transações que inserem no mesmo intervalo de índice não precisam esperar umas pelas outras se não estiverem inserindo na mesma posição dentro da lacuna. Suponha que existam registros de índice com valores de 4 e 7. Transações separadas que tentam inserir valores de 5 e 6 bloqueiam cada vez a lacuna entre 4 e 7 com bloqueios de intenção de inserção antes de obter o bloqueio exclusivo da linha inserida, mas não se bloqueiam umas às outras porque as linhas não são conflitantes.

  Se ocorrer um erro de chave duplicada, um bloqueio compartilhado no registro do índice duplicado é definido. Esse uso de um bloqueio compartilhado pode resultar em um impasse se houver várias sessões tentando inserir a mesma linha, caso outra sessão já tenha um bloqueio exclusivo. Isso pode ocorrer se outra sessão excluir a linha. Suponha que uma tabela `t1` do `InnoDB` tenha a seguinte estrutura:

  ```sql
  CREATE TABLE t1 (i INT, PRIMARY KEY (i)) ENGINE = InnoDB;
  ```

  Agora, suponha que três sessões realizem as seguintes operações em ordem:

  Sessão 1:

  ```sql
  START TRANSACTION;
  INSERT INTO t1 VALUES(1);
  ```

  Sessão 2:

  ```sql
  START TRANSACTION;
  INSERT INTO t1 VALUES(1);
  ```

  Sessão 3:

  ```sql
  START TRANSACTION;
  INSERT INTO t1 VALUES(1);
  ```

  Sessão 1:

  ```sql
  ROLLBACK;
  ```

  A primeira operação da sessão 1 adquire um bloqueio exclusivo para a linha. As operações das sessões 2 e 3 resultam em um erro de chave duplicada e ambas solicitam um bloqueio compartilhado para a linha. Quando a sessão 1 é revertida, ela libera seu bloqueio exclusivo na linha e os pedidos de bloqueio compartilhado em fila para as sessões 2 e 3 são concedidos. Neste ponto, as sessões 2 e 3 entram em um impasse: nenhuma pode adquirir um bloqueio exclusivo para a linha devido ao bloqueio compartilhado mantido pela outra.

  Uma situação semelhante ocorre se a tabela já contiver uma linha com o valor da chave 1 e três sessões executarem as seguintes operações em ordem:

  Sessão 1:

  ```sql
  START TRANSACTION;
  DELETE FROM t1 WHERE i = 1;
  ```

  Sessão 2:

  ```sql
  START TRANSACTION;
  INSERT INTO t1 VALUES(1);
  ```

  Sessão 3:

  ```sql
  START TRANSACTION;
  INSERT INTO t1 VALUES(1);
  ```

  Sessão 1:

  ```sql
  COMMIT;
  ```

  A primeira operação da sessão 1 adquire um bloqueio exclusivo para a linha. As operações das sessões 2 e 3 resultam em um erro de chave duplicada e ambas solicitam um bloqueio compartilhado para a linha. Quando a sessão 1 confirma, libera seu bloqueio exclusivo na linha e os pedidos de bloqueio compartilhado em fila para as sessões 2 e 3 são concedidos. Neste ponto, as sessões 2 e 3 entram em um impasse: nenhuma pode adquirir um bloqueio exclusivo para a linha devido ao bloqueio compartilhado mantido pela outra.

- `INSERT ... ON DUPLICATE KEY UPDATE` difere de um simples `INSERT` porque, quando ocorre um erro de chave duplicada, é colocado um bloqueio exclusivo, em vez de um bloqueio compartilhado, na linha a ser atualizada. Um bloqueio de registro de índice exclusivo é tomado para um valor de chave primária duplicada. Um bloqueio de próxima chave exclusivo é tomado para um valor de chave única duplicada.

- A operação `REPLACE` é realizada como uma `INSERT` se não houver colisão em uma chave única. Caso contrário, uma trava exclusiva de próxima chave é colocada na linha a ser substituída.

- `INSERT INTO T SELECT ... FROM S WHERE ...` define um bloqueio de registro de índice exclusivo (sem bloqueio de lacuna) em cada linha inserida em `T`. Se o nível de isolamento de transação for `READ COMMITTED` ou `innodb_locks_unsafe_for_binlog` estiver habilitado e o nível de isolamento de transação não for `SERIALIZABLE`, o `InnoDB` realiza a busca em `S` como uma leitura consistente (sem bloqueios). Caso contrário, o `InnoDB` define bloqueios compartilhados de próximo chave em linhas de `S`. O `InnoDB` deve definir bloqueios no último caso: Durante a recuperação de avanço progressivo usando um log binário baseado em instruções, cada instrução SQL deve ser executada exatamente da mesma maneira que foi feita originalmente.

  `CREATE TABLE ... SELECT ...` executa a consulta `SELECT` com bloqueios de chave compartilhada ou como leitura consistente, assim como na consulta `INSERT ... SELECT`.

  Quando um `SELECT` é usado nas construções `REPLACE INTO t SELECT ... FROM s WHERE ...` ou `UPDATE t ... WHERE col IN (SELECT ... FROM s ...)`, o `InnoDB` define bloqueios compartilhados de próxima chave nas linhas da tabela `s`.

- O `InnoDB` define um bloqueio exclusivo no final do índice associado à coluna `AUTO_INCREMENT` durante a inicialização de uma coluna `AUTO_INCREMENT` especificada anteriormente em uma tabela.

  Com `innodb_autoinc_lock_mode=0`, o `InnoDB` usa um modo especial de bloqueio da tabela `AUTO-INC`, onde o bloqueio é obtido e mantido até o final da instrução SQL atual (e não até o final de toda a transação) ao acessar o contador de autoincremento. Outros clientes não podem inserir na tabela enquanto o bloqueio da tabela `AUTO-INC` estiver sendo mantido. O mesmo comportamento ocorre para as inserções em lote com `innodb_autoinc_lock_mode=1`. Os bloqueios de `AUTO-INC` a nível de tabela não são usados com `innodb_autoinc_lock_mode=2`. Para mais informações, consulte a Seção 14.6.1.6, “Tratamento de AUTO_INCREMENT no InnoDB”.

  O `InnoDB` recupera o valor de uma coluna `AUTO_INCREMENT` previamente inicializada sem definir nenhum bloqueio.

- Se uma restrição `FOREIGN KEY` for definida em uma tabela, qualquer inserção, atualização ou exclusão que exija que a condição da restrição seja verificada estabelece bloqueios compartilhados em nível de registro nos registros que ela examina para verificar a restrição. O `InnoDB` também estabelece esses bloqueios no caso de a restrição falhar.

- `LOCK TABLES` define bloqueios de tabela, mas é a camada superior do MySQL, acima da camada `InnoDB`, que define esses bloqueios. O `InnoDB` está ciente dos bloqueios de tabela se `innodb_table_locks = 1` (o padrão) e `autocommit = 0`, e a camada superior do MySQL, acima do `InnoDB`, sabe sobre bloqueios de nível de linha.

  Caso contrário, a detecção automática de trancos do `InnoDB` não consegue detectar trancos quando essas bloqueadoras de tabela estão envolvidas. Além disso, como, neste caso, a camada superior do MySQL não conhece as bloqueadoras de nível de linha, é possível obter uma bloqueadora de tabela em uma tabela onde outra sessão atualmente tem bloqueadoras de nível de linha. No entanto, isso não coloca em risco a integridade da transação, conforme discutido na Seção 14.7.5.2, “Detecção de Trancos”.

- `LOCK TABLES` adquire dois bloqueios em cada tabela se `innodb_table_locks=1` (o padrão). Além de um bloqueio de tabela na camada MySQL, ele também adquire um bloqueio de tabela `InnoDB`. Para evitar a aquisição de bloqueios de tabela `InnoDB`, defina `innodb_table_locks=0`. Se nenhum bloqueio de tabela `InnoDB` for adquirido, `LOCK TABLES` conclui mesmo se alguns registros das tabelas estiverem sendo bloqueados por outras transações.

  No MySQL 5.7, `innodb_table_locks=0` não tem efeito para tabelas bloqueadas explicitamente com `LOCK TABLES ... WRITE`. Ele tem efeito para tabelas bloqueadas para leitura ou escrita por `LOCK TABLES ... WRITE` implicitamente (por exemplo, por meio de gatilhos) ou por `LOCK TABLES ... READ`.

- Todos os bloqueios `InnoDB` mantidos por uma transação são liberados quando a transação é confirmada ou abortada. Assim, não faz muito sentido invocar `LOCK TABLES` em tabelas `InnoDB` no modo `autocommit=1` porque os bloqueios de tabela `InnoDB` adquiridos seriam liberados imediatamente.

- Você não pode bloquear tabelas adicionais no meio de uma transação, porque `LOCK TABLES` realiza um `COMMIT` implícito e `UNLOCK TABLES`.
