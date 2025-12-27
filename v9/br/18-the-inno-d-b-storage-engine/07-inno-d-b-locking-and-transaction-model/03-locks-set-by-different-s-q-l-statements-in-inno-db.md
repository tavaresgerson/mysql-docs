### 17.7.3 Bloqueios Definidos por Diferentes Declarações SQL no InnoDB

Um bloqueio de leitura, uma `UPDATE` ou uma `DELETE` geralmente definem blocos de registro em todos os registros de índice que são escaneados no processamento de uma declaração SQL. Não importa se há condições `WHERE` na declaração que excluiriam a linha. O `InnoDB` não lembra a condição `WHERE` exata, mas apenas sabe quais faixas de índice foram escaneadas. Os bloqueios são normalmente bloqueios de próxima chave que também bloqueiam inserções no "lacuna" imediatamente antes do registro. No entanto, o bloqueio de lacuna pode ser desativado explicitamente, o que faz com que o bloqueio de próxima chave não seja usado. Para mais informações, consulte a Seção 17.7.1, “Bloqueio do InnoDB”. O nível de isolamento de transação também pode afetar quais blocos são definidos; consulte a Seção 17.7.2.1, “Níveis de Isolamento de Transação”.

Se um índice secundário for usado em uma pesquisa e os registros de índice a serem definidos forem exclusivos, o `InnoDB` também recupera os registros correspondentes de índice agrupado e define blocos neles.

Se você não tiver índices adequados para sua declaração e o MySQL precisar escanear toda a tabela para processar a declaração, cada linha da tabela fica bloqueada, o que, por sua vez, bloqueia todas as inserções por outros usuários na tabela. É importante criar bons índices para que suas consultas não escanem mais linhas do que o necessário.

O `InnoDB` define tipos específicos de bloqueios da seguinte forma.

* `SELECT ... FROM` é uma leitura consistente, lendo um instantâneo do banco de dados e definindo nenhum bloqueio, a menos que o nível de isolamento de transação seja definido como `SERIALIZABLE`. Para o nível `SERIALIZABLE`, a pesquisa define blocos de próxima chave compartilhados nos registros de índice que ela encontrar. No entanto, apenas um bloqueio de registro de índice é necessário para declarações que bloqueiam linhas usando um índice único para buscar uma linha única.

As instruções `SELECT ... FOR UPDATE` e `SELECT ... FOR SHARE` que utilizam um índice único adquirem bloqueios para as linhas digitalizadas e liberam os bloqueios para as linhas que não se qualificam para inclusão no conjunto de resultados (por exemplo, se não atenderem aos critérios fornecidos na cláusula `WHERE`). No entanto, em alguns casos, as linhas podem não ser desbloqueadas imediatamente porque a relação entre uma linha de resultado e sua fonte original é perdida durante a execução da consulta. Por exemplo, em uma `UNION`, as linhas digitalizadas (e bloqueadas) de uma tabela podem ser inseridas em uma tabela temporária antes de avaliar se se qualificam para o conjunto de resultados. Nessa circunstância, a relação das linhas na tabela temporária com as linhas na tabela original é perdida e as últimas linhas não são desbloqueadas até o final da execução da consulta.

* Para bloqueios de leitura (`SELECT` com `FOR UPDATE` ou `FOR SHARE`), instruções `UPDATE` e `DELETE`, os bloqueios que são tomados dependem se a instrução usa um índice único com uma condição de busca única ou uma condição de busca de tipo intervalo.

  + Para um índice único com uma condição de busca única, o `InnoDB` bloqueia apenas o registro do índice encontrado, não o intervalo antes dele.

  + Para outras condições de busca e para índices não únicos, o `InnoDB` bloqueia o intervalo do índice digitalizado, usando bloqueios de intervalo ou bloqueios de próxima chave para bloquear inserções por outras sessões nos intervalos cobertos pelo intervalo. Para informações sobre bloqueios de intervalo e bloqueios de próxima chave, consulte a Seção 17.7.1, “Bloqueio do InnoDB”.

* Para os registros de índice que a busca encontra, as instruções `SELECT ... FOR UPDATE` bloqueiam outras sessões de fazer `SELECT ... FOR SHARE` ou de ler em certos níveis de isolamento de transação. Leitura consistente ignora quaisquer bloqueios definidos nos registros que existem na vista de leitura.

* `UPDATE ... WHERE ...` estabelece um bloqueio exclusivo de próxima chave em cada registro que a pesquisa encontra. No entanto, apenas um bloqueio de registro de índice é necessário para declarações que bloqueiam linhas usando um índice único para buscar uma linha única.

* Quando o `UPDATE` modifica um registro de índice agrupado, bloqueios implícitos são tomados em registros de índice secundário afetados. A operação `UPDATE` também toma bloqueios compartilhados em registros de índice secundário afetados ao realizar varreduras de verificação de duplicatas antes de inserir novos registros de índice secundário e ao inserir novos registros de índice secundário.

* `DELETE FROM ... WHERE ...` estabelece um bloqueio exclusivo de próxima chave em cada registro que a pesquisa encontra. No entanto, apenas um bloqueio de registro de índice é necessário para declarações que bloqueiam linhas usando um índice único para buscar uma linha única.

* `INSERT` estabelece um bloqueio exclusivo na linha inserida. Esse bloqueio é um bloqueio de registro de índice, não um bloqueio de próxima chave (ou seja, não há bloqueio de lacuna) e não impede que outras sessões insiram na lacuna antes da linha inserida.

Antes de inserir a linha, um tipo de bloqueio de lacuna chamado bloqueio de intenção de inserção é estabelecido. Esse bloqueio sinaliza a intenção de inserir de tal forma que múltiplas transações que inserem na mesma lacuna do índice não precisam esperar umas pelas outras se não estiverem inserindo na mesma posição dentro da lacuna. Suponha que existam registros de índice com valores de 4 e 7. Transações separadas que tentam inserir valores de 5 e 6 cada vez bloqueiam a lacuna entre 4 e 7 com bloqueios de intenção de inserção antes de obter o bloqueio exclusivo na linha inserida, mas não se bloqueiam umas às outras porque as linhas não são conflitantes.

Se ocorrer um erro de chave duplicada, um bloqueio compartilhado no registro do índice duplicado é definido. Esse uso de um bloqueio compartilhado pode resultar em um impasse se houver várias sessões tentando inserir a mesma linha, caso outra sessão já tenha um bloqueio exclusivo. Isso pode ocorrer se outra sessão excluir a linha. Suponha que uma tabela `InnoDB` `t1` tenha a seguinte estrutura:

  ```
  CREATE TABLE t1 (i INT, PRIMARY KEY (i)) ENGINE = InnoDB;
  ```

  Agora, suponha que três sessões realizem as seguintes operações em ordem:

  Sessão 1:

  ```
  START TRANSACTION;
  INSERT INTO t1 VALUES(1);
  ```

  Sessão 2:

  ```
  START TRANSACTION;
  INSERT INTO t1 VALUES(1);
  ```

  Sessão 3:

  ```
  START TRANSACTION;
  INSERT INTO t1 VALUES(1);
  ```

  Sessão 1:

  ```
  ROLLBACK;
  ```

  A primeira operação da sessão 1 adquire um bloqueio exclusivo para a linha. As operações das sessões 2 e 3 resultam em um erro de chave duplicada e ambas solicitam um bloqueio compartilhado para a linha. Quando a sessão 1 retorna, ela libera seu bloqueio exclusivo na linha e os pedidos de bloqueio compartilhado em fila para as sessões 2 e 3 são concedidos. Neste ponto, as sessões 2 e 3 entram em um impasse: Nenhuma pode adquirir um bloqueio exclusivo para a linha devido ao bloqueio compartilhado mantido pela outra.

Uma situação semelhante ocorre se a tabela já contiver uma linha com o valor da chave 1 e três sessões realizarem as seguintes operações em ordem:

Sessão 1:

```
  START TRANSACTION;
  DELETE FROM t1 WHERE i = 1;
  ```

Sessão 2:

```
  START TRANSACTION;
  INSERT INTO t1 VALUES(1);
  ```

Sessão 3:

```
  START TRANSACTION;
  INSERT INTO t1 VALUES(1);
  ```

Sessão 1:

```
  COMMIT;
  ```

A primeira operação da sessão 1 adquire um bloqueio exclusivo para a linha. As operações das sessões 2 e 3 resultam em um erro de chave duplicada e ambas solicitam um bloqueio compartilhado para a linha. Quando a sessão 1 confirma, libera seu bloqueio exclusivo na linha e os pedidos de bloqueio compartilhado em fila para as sessões 2 e 3 são concedidos. Neste ponto, as sessões 2 e 3 entram em um impasse: nenhuma pode adquirir um bloqueio exclusivo para a linha devido ao bloqueio compartilhado mantido pelo outro.

* `INSERT ... ON DUPLICATE KEY UPDATE` difere de um simples `INSERT` porque um bloqueio exclusivo, em vez de um bloqueio compartilhado, é colocado na linha a ser atualizada quando ocorre um erro de chave duplicada. Um bloqueio de registro de índice exclusivo é tomado para um valor de chave primária duplicada. Um bloqueio de próximo índice exclusivo é tomado para um valor de chave única duplicada.

* `REPLACE` é feito como um `INSERT` se não houver colisão em uma chave única. Caso contrário, um bloqueio de próximo índice exclusivo é colocado na linha a ser substituída.

* `INSERT INTO T SELECT ... FROM S WHERE ...` define um bloqueio de registro de índice exclusivo (sem bloqueio de lacuna) em cada linha inserida em `T`. Se o nível de isolamento de transação for `READ COMMITTED`, o `InnoDB` faz a busca em `S` como uma leitura consistente (sem bloqueios). Caso contrário, o `InnoDB` define blocos de próximo índice compartilhados em linhas de `S`. O `InnoDB` tem que definir blocos no último caso: Durante a recuperação por avanço progressivo usando um log binário baseado em instruções, cada instrução SQL deve ser executada exatamente da mesma maneira que foi feita originalmente.

`CREATE TABLE ... SELECT` realiza a `SELECT` com blocos de próximo índice compartilhados ou como uma leitura consistente, como para `INSERT ... SELECT`.

Quando um `SELECT` é usado nas construções `REPLACE INTO t SELECT ... FROM s WHERE ...` ou `UPDATE t ... WHERE col IN (SELECT ... FROM s ...)`, o `InnoDB` define bloqueios compartilhados de próxima chave em linhas da tabela `s`.

* O `InnoDB` define um bloqueio exclusivo no final do índice associado à coluna `AUTO_INCREMENT` ao inicializar uma coluna `AUTO_INCREMENT` especificada anteriormente em uma tabela.

  Com `innodb_autoinc_lock_mode=0`, o `InnoDB` usa um modo especial de bloqueio de tabela `AUTO-INC` onde o bloqueio é obtido e mantido até o final da declaração SQL atual (não até o final de toda a transação) enquanto acessa o contador de autoincremento. Outros clientes não podem inserir na tabela enquanto o bloqueio de tabela `AUTO-INC` estiver sendo mantido. O mesmo comportamento ocorre para "inserções em massa" com `innodb_autoinc_lock_mode=1`. Bloqueios de `AUTO-INC` em nível de tabela não são usados com `innodb_autoinc_lock_mode=2`. Para mais informações, consulte a Seção 17.6.1.6, “Tratamento de `AUTO\_INCREMENT` no `InnoDB’”.

* O `InnoDB` obtém o valor de uma coluna `AUTO_INCREMENT` previamente inicializada sem definir nenhum bloqueio.

* Se uma restrição `FOREIGN KEY` for definida em uma tabela, qualquer inserção, atualização ou exclusão que exija que a condição da restrição seja verificada define bloqueios compartilhados em nível de registro nos registros que ela examina para verificar a restrição. O `InnoDB` também define esses bloqueios no caso de a restrição falhar.

* `LOCK TABLES` define bloqueios de tabela, mas é a camada superior do MySQL acima da camada `InnoDB` que define esses bloqueios. O `InnoDB` está ciente dos bloqueios de tabela se `innodb_table_locks = 1` (o padrão) e `autocommit = 0`, e a camada superior do MySQL sabe sobre bloqueios em nível de linha.

Caso contrário, a detecção automática de transtornos por bloqueio do `InnoDB` não consegue detectar transtornos em que tais bloqueios de tabela estejam envolvidos. Além disso, como, neste caso, a camada superior do MySQL não conhece os bloqueios de nível de linha, é possível obter um bloqueio de tabela em uma tabela onde outra sessão atualmente tem bloqueios de nível de linha. No entanto, isso não coloca em risco a integridade da transação, conforme discutido na Seção 17.7.5.2, “Detecção de Transtornos”.

* `LOCK TABLES` adquire dois bloqueios em cada tabela se `innodb_table_locks=1` (o padrão). Além de um bloqueio de tabela na camada MySQL, também adquire um bloqueio de tabela `InnoDB`. Para evitar adquirir bloqueios de tabela `InnoDB`, defina `innodb_table_locks=0`. Se nenhum bloqueio de tabela `InnoDB` for adquirido, `LOCK TABLES` é concluído mesmo se alguns registros das tabelas estiverem sendo bloqueados por outras transações.

  No MySQL 9.5, `innodb_table_locks=0` não tem efeito para tabelas bloqueadas explicitamente com `LOCK TABLES ... WRITE`. Tem efeito para tabelas bloqueadas para leitura ou escrita com `LOCK TABLES ... WRITE` implicitamente (por exemplo, por meio de gatilhos) ou com `LOCK TABLES ... READ`.

* Todos os bloqueios `InnoDB` mantidos por uma transação são liberados quando a transação é concluída ou abortada. Assim, não faz muito sentido invocar `LOCK TABLES` em tabelas `InnoDB` no modo `autocommit=1` porque os bloqueios de tabela `InnoDB` adquiridos seriam liberados imediatamente.

* Você não pode bloquear tabelas adicionais no meio de uma transação porque `LOCK TABLES` realiza um `COMMIT` implícito e `UNLOCK TABLES`.