### 14.7.3 Locks Definidos por Diferentes Instruções SQL no InnoDB

Uma *locking read*, um `UPDATE`, ou um `DELETE` geralmente definem *record locks* em todo *index record* que é escaneado no processamento de uma instrução SQL. Não importa se existem condições `WHERE` na instrução que excluiriam a linha. O `InnoDB` não lembra a condição `WHERE` exata, mas apenas sabe quais *index ranges* foram escaneados. Os *locks* são normalmente *next-key locks* que também bloqueiam *inserts* no “gap” imediatamente antes do registro. No entanto, o *gap locking* pode ser desabilitado explicitamente, o que faz com que o *next-key locking* não seja usado. Para mais informações, consulte a Seção 14.7.1, “InnoDB Locking”. O *transaction isolation level* também pode afetar quais *locks* são definidos; consulte a Seção 14.7.2.1, “Transaction Isolation Levels”.

Se um *secondary index* for usado em uma busca e os *index record locks* a serem definidos forem exclusivos, o `InnoDB` também recupera os *clustered index records* correspondentes e define *locks* neles.

Se você não tiver *indexes* adequados para sua instrução e o MySQL tiver que escanear a tabela inteira para processar a instrução, cada linha da tabela fica bloqueada, o que por sua vez bloqueia todos os *inserts* de outros usuários na tabela. É importante criar bons *indexes* para que seus *queries* não escaneiem mais linhas do que o necessário.

O `InnoDB` define tipos específicos de *locks* da seguinte forma:

*   `SELECT ... FROM` é uma *consistent read*, lendo um *snapshot* do *database* e não definindo *locks*, a menos que o *transaction isolation level* esteja definido como `SERIALIZABLE`. Para o nível `SERIALIZABLE`, a busca define *shared next-key locks* nos *index records* que encontra. No entanto, apenas um *index record lock* é necessário para instruções que bloqueiam linhas usando um *unique index* para buscar uma linha única.

*   Para `SELECT ... FOR UPDATE` ou `SELECT ... LOCK IN SHARE MODE`, *locks* são adquiridos para linhas escaneadas, e espera-se que sejam liberados para linhas que não se qualificam para inclusão no conjunto de resultados (por exemplo, se não atenderem aos critérios fornecidos na cláusula `WHERE`). No entanto, em alguns casos, as linhas podem não ser desbloqueadas imediatamente porque a relação entre uma linha de resultado e sua fonte original é perdida durante a execução do *query*. Por exemplo, em uma `UNION`, linhas escaneadas (e bloqueadas) de uma tabela podem ser inseridas em uma *temporary table* antes de avaliar se elas se qualificam para o conjunto de resultados. Nesta circunstância, a relação das linhas na *temporary table* com as linhas na tabela original é perdida e as últimas linhas não são desbloqueadas até o final da execução do *query*.

*   `SELECT ... LOCK IN SHARE MODE` define *shared next-key locks* em todos os *index records* que a busca encontra. No entanto, apenas um *index record lock* é necessário para instruções que bloqueiam linhas usando um *unique index* para buscar uma linha única.

*   `SELECT ... FOR UPDATE` define um *exclusive next-key lock* em cada registro que a busca encontra. No entanto, apenas um *index record lock* é necessário para instruções que bloqueiam linhas usando um *unique index* para buscar uma linha única.

    Para os *index records* que a busca encontra, `SELECT ... FOR UPDATE` bloqueia outras sessões de realizar `SELECT ... LOCK IN SHARE MODE` ou de ler em certos *transaction isolation levels*. *Consistent reads* ignoram quaisquer *locks* definidos nos registros que existem na *read view*.

*   `UPDATE ... WHERE ...` define um *exclusive next-key lock* em cada registro que a busca encontra. No entanto, apenas um *index record lock* é necessário para instruções que bloqueiam linhas usando um *unique index* para buscar uma linha única.

*   Quando um `UPDATE` modifica um *clustered index record*, *locks* implícitos são tomados nos *secondary index records* afetados. A operação `UPDATE` também toma *shared locks* nos *secondary index records* afetados ao realizar *scans* de verificação de duplicidade antes de inserir novos *secondary index records*, e ao inserir novos *secondary index records*.

*   `DELETE FROM ... WHERE ...` define um *exclusive next-key lock* em cada registro que a busca encontra. No entanto, apenas um *index record lock* é necessário para instruções que bloqueiam linhas usando um *unique index* para buscar uma linha única.

*   `INSERT` define um *exclusive lock* na linha inserida. Este *lock* é um *index-record lock*, não um *next-key lock* (ou seja, não há *gap lock*) e não impede que outras sessões insiram no *gap* antes da linha inserida.

    Antes de inserir a linha, é definido um tipo de *gap lock* chamado *insert intention gap lock*. Este *lock* sinaliza a intenção de inserir de tal forma que múltiplas *transactions* inserindo no mesmo *index gap* não precisam esperar umas pelas outras se não estiverem inserindo na mesma posição dentro do *gap*. Suponha que existam *index records* com valores 4 e 7. *Transactions* separadas que tentam inserir os valores 5 e 6 bloqueiam o *gap* entre 4 e 7 com *insert intention locks* antes de obter o *exclusive lock* na linha inserida, mas não se bloqueiam mutuamente porque as linhas não estão em conflito.

    Se ocorrer um erro de chave duplicada (*duplicate-key error*), um *shared lock* no *duplicate index record* é definido. Este uso de um *shared lock* pode resultar em *deadlock* caso haja múltiplas sessões tentando inserir a mesma linha se outra sessão já tiver um *exclusive lock*. Isso pode ocorrer se outra sessão excluir a linha. Suponha que uma tabela `t1` do `InnoDB` tenha a seguinte estrutura:

    ```sql
  CREATE TABLE t1 (i INT, PRIMARY KEY (i)) ENGINE = InnoDB;
  ```

    Agora suponha que três sessões executem as seguintes operações em ordem:

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

    A primeira operação pela Sessão 1 adquire um *exclusive lock* para a linha. As operações pelas Sessões 2 e 3 resultam em um *duplicate-key error* e ambas solicitam um *shared lock* para a linha. Quando a Sessão 1 realiza *rollback*, ela libera seu *exclusive lock* na linha e as solicitações de *shared lock* enfileiradas para as Sessões 2 e 3 são concedidas. Neste ponto, as Sessões 2 e 3 entram em *deadlock*: Nenhuma pode adquirir um *exclusive lock* para a linha devido ao *shared lock* mantido pela outra.

    Uma situação semelhante ocorre se a tabela já contiver uma linha com valor de chave 1 e três sessões executarem as seguintes operações em ordem:

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

    A primeira operação pela Sessão 1 adquire um *exclusive lock* para a linha. As operações pelas Sessões 2 e 3 resultam em um *duplicate-key error* e ambas solicitam um *shared lock* para a linha. Quando a Sessão 1 realiza *commit*, ela libera seu *exclusive lock* na linha e as solicitações de *shared lock* enfileiradas para as Sessões 2 e 3 são concedidas. Neste ponto, as Sessões 2 e 3 entram em *deadlock*: Nenhuma pode adquirir um *exclusive lock* para a linha devido ao *shared lock* mantido pela outra.

*   `INSERT ... ON DUPLICATE KEY UPDATE` difere de um `INSERT` simples, pois um *exclusive lock*, em vez de um *shared lock*, é colocado na linha a ser atualizada quando ocorre um *duplicate-key error*. Um *exclusive index-record lock* é tomado para um valor de chave primária duplicado. Um *exclusive next-key lock* é tomado para um valor de chave única duplicado.

*   `REPLACE` é feito como um `INSERT` se não houver colisão em uma chave única. Caso contrário, um *exclusive next-key lock* é colocado na linha a ser substituída.

*   `INSERT INTO T SELECT ... FROM S WHERE ...` define um *exclusive index record lock* (sem um *gap lock*) em cada linha inserida em `T`. Se o *transaction isolation level* for `READ COMMITTED`, ou se `innodb_locks_unsafe_for_binlog` estiver habilitado e o *transaction isolation level* não for `SERIALIZABLE`, o `InnoDB` faz a busca em `S` como uma *consistent read* (sem *locks*). Caso contrário, o `InnoDB` define *shared next-key locks* nas linhas de `S`. O `InnoDB` tem que definir *locks* neste último caso: Durante a recuperação *roll-forward* usando um *binary log* baseado em instrução, cada instrução SQL deve ser executada exatamente da mesma maneira que foi feita originalmente.

    `CREATE TABLE ... SELECT ...` executa o `SELECT` com *shared next-key locks* ou como uma *consistent read*, assim como em `INSERT ... SELECT`.

    Quando um `SELECT` é usado nas construções `REPLACE INTO t SELECT ... FROM s WHERE ...` ou `UPDATE t ... WHERE col IN (SELECT ... FROM s ...)`, o `InnoDB` define *shared next-key locks* nas linhas da tabela `s`.

*   O `InnoDB` define um *exclusive lock* no final do *index* associado à coluna `AUTO_INCREMENT` ao inicializar uma coluna `AUTO_INCREMENT` previamente especificada em uma tabela.

    Com `innodb_autoinc_lock_mode=0`, o `InnoDB` usa um modo especial de *AUTO-INC table lock* onde o *lock* é obtido e mantido até o final da instrução SQL atual (não até o final da *transaction* inteira) enquanto acessa o contador de *auto-increment*. Outros clientes não podem inserir na tabela enquanto o *AUTO-INC table lock* estiver sendo mantido. O mesmo comportamento ocorre para “*bulk inserts*” com `innodb_autoinc_lock_mode=1`. *Table-level AUTO-INC locks* não são usados com `innodb_autoinc_lock_mode=2`. Para mais informações, consulte a Seção 14.6.1.6, “AUTO_INCREMENT Handling in InnoDB”.

    O `InnoDB` busca o valor de uma coluna `AUTO_INCREMENT` previamente inicializada sem definir *locks*.

*   Se uma restrição `FOREIGN KEY` for definida em uma tabela, qualquer *insert*, *update* ou *delete* que exija a verificação da condição de restrição define *shared record-level locks* nos registros que examina para verificar a restrição. O `InnoDB` também define esses *locks* no caso em que a restrição falha.

*   `LOCK TABLES` define *table locks*, mas é a camada superior do MySQL, acima da camada `InnoDB`, que define esses *locks*. O `InnoDB` está ciente dos *table locks* se `innodb_table_locks = 1` (o padrão) e `autocommit = 0`, e a camada do MySQL acima do `InnoDB` souber sobre os *row-level locks*.

    Caso contrário, a detecção automática de *deadlocks* do `InnoDB` não pode detectar *deadlocks* onde tais *table locks* estão envolvidos. Além disso, como neste caso a camada superior do MySQL não sabe sobre *row-level locks*, é possível obter um *table lock* em uma tabela onde outra sessão atualmente possui *row-level locks*. No entanto, isso não coloca em risco a integridade da *transaction*, conforme discutido na Seção 14.7.5.2, “Deadlock Detection”.

*   `LOCK TABLES` adquire dois *locks* em cada tabela se `innodb_table_locks=1` (o padrão). Além de um *table lock* na camada MySQL, ele também adquire um *InnoDB table lock*. Para evitar a aquisição de *InnoDB table locks*, defina `innodb_table_locks=0`. Se nenhum *InnoDB table lock* for adquirido, `LOCK TABLES` é concluído mesmo se alguns registros das tabelas estiverem sendo bloqueados por outras *transactions*.

    No MySQL 5.7, `innodb_table_locks=0` não tem efeito para tabelas bloqueadas explicitamente com `LOCK TABLES ... WRITE`. Tem efeito para tabelas bloqueadas para leitura ou escrita por `LOCK TABLES ... WRITE` implicitamente (por exemplo, através de *triggers*) ou por `LOCK TABLES ... READ`.

*   Todos os *InnoDB locks* mantidos por uma *transaction* são liberados quando a *transaction* é *committed* ou abortada. Assim, não faz muito sentido invocar `LOCK TABLES` em tabelas `InnoDB` no modo `autocommit=1`, pois os *InnoDB table locks* adquiridos seriam liberados imediatamente.

*   Você não pode bloquear tabelas adicionais no meio de uma *transaction* porque `LOCK TABLES` executa um `COMMIT` implícito e `UNLOCK TABLES`.