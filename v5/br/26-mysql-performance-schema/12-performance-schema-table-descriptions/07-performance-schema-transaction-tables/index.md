### 25.12.7 Tabelas de Transaction do Performance Schema

[25.12.7.1 A Tabela events_transactions_current](performance-schema-events-transactions-current-table.html)

[25.12.7.2 A Tabela events_transactions_history](performance-schema-events-transactions-history-table.html)

[25.12.7.3 A Tabela events_transactions_history_long](performance-schema-events-transactions-history-long-table.html)

O Performance Schema instrumenta Transactions. Dentro da hierarquia de Eventos, os wait events se aninham dentro de stage events, que se aninham dentro de statement events, que, por sua vez, se aninham dentro de transaction events.

Estas tabelas armazenam transaction events:

* [`events_transactions_current`](performance-schema-events-transactions-current-table.html "25.12.7.1 A Tabela events_transactions_current"): O transaction event atual para cada Thread.

* [`events_transactions_history`](performance-schema-events-transactions-history-table.html "25.12.7.2 A Tabela events_transactions_history"): Os transaction events mais recentes que terminaram por Thread.

* [`events_transactions_history_long`](performance-schema-events-transactions-history-long-table.html "25.12.7.3 A Tabela events_transactions_history_long"): Os transaction events mais recentes que terminaram globalmente (em todas as Threads).

As seções a seguir descrevem as tabelas de transaction event. Existem também tabelas de resumo que agregam informações sobre transaction events; veja [Section 25.12.15.4, “Transaction Summary Tables”](performance-schema-transaction-summary-tables.html "25.12.15.4 Transaction Summary Tables”).

Para mais informações sobre o relacionamento entre as três tabelas de transaction event, veja [Section 25.9, “Performance Schema Tables for Current and Historical Events”](performance-schema-event-tables.html "25.9 Performance Schema Tables for Current and Historical Events”).

* [Configurando a Coleta de Transaction Events](performance-schema-transaction-tables.html#performance-schema-transaction-tables-configuration "Configurando a Coleta de Transaction Events")
* [Limites de Transaction](performance-schema-transaction-tables.html#performance-schema-transaction-tables-transaction-boundaries "Limites de Transaction")
* [Instrumentação de Transaction](performance-schema-transaction-tables.html#performance-schema-transaction-tables-instrumentation "Instrumentação de Transaction")
* [Transactions e Eventos Aninhados](performance-schema-transaction-tables.html#performance-schema-transaction-tables-nested-events "Transactions e Eventos Aninhados")
* [Transactions e Stored Programs](performance-schema-transaction-tables.html#performance-schema-transaction-tables-stored-programs "Transactions e Stored Programs")
* [Transactions e Savepoints](performance-schema-transaction-tables.html#performance-schema-transaction-tables-savepoints "Transactions e Savepoints")
* [Transactions e Erros](performance-schema-transaction-tables.html#performance-schema-transaction-tables-errors "Transactions e Erros")

#### Configurando a Coleta de Transaction Events

Para controlar se os transaction events devem ser coletados, defina o estado dos Instruments e Consumers relevantes:

* A tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") contém um Instrument chamado `transaction`. Use este Instrument para habilitar ou desabilitar a coleta de classes individuais de transaction event.

* A tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") contém valores de Consumer com nomes que correspondem aos nomes das tabelas de transaction event atuais e históricas. Use estes Consumers para filtrar a coleta de transaction events.

O Instrument `transaction` e os Consumers de Transaction estão desabilitados por padrão:

```sql
mysql> SELECT *
       FROM performance_schema.setup_instruments
       WHERE NAME = 'transaction';
+-------------+---------+-------+
| NAME        | ENABLED | TIMED |
+-------------+---------+-------+
| transaction | NO      | NO    |
+-------------+---------+-------+
mysql> SELECT *
       FROM performance_schema.setup_consumers
       WHERE NAME LIKE 'events_transactions%';
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| events_transactions_current      | NO      |
| events_transactions_history      | NO      |
| events_transactions_history_long | NO      |
+----------------------------------+---------+
```

Para controlar a coleta de transaction events na inicialização do servidor, use linhas como estas no seu arquivo `my.cnf`:

* Habilitar:

  ```sql
  [mysqld]
  performance-schema-instrument='transaction=ON'
  performance-schema-consumer-events-transactions-current=ON
  performance-schema-consumer-events-transactions-history=ON
  performance-schema-consumer-events-transactions-history-long=ON
  ```

* Desabilitar:

  ```sql
  [mysqld]
  performance-schema-instrument='transaction=OFF'
  performance-schema-consumer-events-transactions-current=OFF
  performance-schema-consumer-events-transactions-history=OFF
  performance-schema-consumer-events-transactions-history-long=OFF
  ```

Para controlar a coleta de transaction events em tempo de execução (runtime), atualize as tabelas [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") e [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table"):

* Habilitar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME = 'transaction';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'YES'
  WHERE NAME LIKE 'events_transactions%';
  ```

* Desabilitar:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME = 'transaction';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'events_transactions%';
  ```

Para coletar transaction events apenas para tabelas específicas de transaction event, habilite o Instrument `transaction`, mas apenas os Consumers de Transaction correspondentes às tabelas desejadas.

A tabela [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table") contém uma linha com um valor `NAME` de `transaction` que indica a unidade para o timing (cronometragem) de transaction event. A unidade padrão é `NANOSECOND`:

```sql
mysql> SELECT *
       FROM performance_schema.setup_timers
       WHERE NAME = 'transaction';
+-------------+------------+
| NAME        | TIMER_NAME |
+-------------+------------+
| transaction | NANOSECOND |
+-------------+------------+
```

Para alterar a unidade de timing, modifique o valor `TIMER_NAME`:

```sql
UPDATE performance_schema.setup_timers
SET TIMER_NAME = 'MICROSECOND'
WHERE NAME = 'transaction';
```

Para informações adicionais sobre a configuração da coleta de Eventos, veja [Section 25.3, “Performance Schema Startup Configuration”](performance-schema-startup-configuration.html "25.3 Performance Schema Startup Configuration") e [Section 25.4, “Performance Schema Runtime Configuration”](performance-schema-runtime-configuration.html "25.4 Performance Schema Runtime Configuration").

#### Limites de Transaction

No MySQL Server, Transactions começam explicitamente com estas Statements:

```sql
START TRANSACTION | BEGIN | XA START | XA BEGIN
```

Transactions também começam implicitamente. Por exemplo, quando a variável de sistema [`autocommit`](server-system-variables.html#sysvar_autocommit) está habilitada, o início de cada Statement inicia uma nova Transaction.

Quando [`autocommit`](server-system-variables.html#sysvar_autocommit) está desabilitada, a primeira Statement após uma Transaction committed marca o início de uma nova Transaction. As Statements subsequentes fazem parte da Transaction até que ela seja committed.

Transactions terminam explicitamente com estas Statements:

```sql
COMMIT | ROLLBACK | XA COMMIT | XA ROLLBACK
```

Transactions também terminam implicitamente, pela execução de Statements DDL, Statements de Lock e Statements de administração de servidor.

Na discussão a seguir, as referências a [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") também se aplicam a [`BEGIN`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), [`XA START`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements") e [`XA BEGIN`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements"). Da mesma forma, as referências a [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") e [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") se aplicam a [`XA COMMIT`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements") e [`XA ROLLBACK`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements"), respectivamente.

O Performance Schema define os limites de Transaction de forma semelhante aos do servidor. O início e o fim de um transaction event correspondem de perto às transições de estado correspondentes no servidor:

* Para uma Transaction iniciada explicitamente, o transaction event começa durante o processamento da Statement [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements").

* Para uma Transaction iniciada implicitamente, o transaction event começa na primeira Statement que usa um engine transacional após o término da Transaction anterior.

* Para qualquer Transaction, seja ela terminada explícita ou implicitamente, o transaction event termina quando o servidor faz a transição para fora do estado de Transaction ativo durante o processamento de [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") ou [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements").

Há implicações sutis nesta abordagem:

* Os transaction events no Performance Schema não incluem totalmente os statement events associados às Statements `START TRANSACTION`, `COMMIT` ou `ROLLBACK` correspondentes. Há uma quantidade trivial de sobreposição de timing entre o transaction event e estas Statements.

* Statements que funcionam com engines não transacionais não têm efeito no estado da Transaction da conexão. Para Transactions implícitas, o transaction event começa com a primeira Statement que usa um engine transacional. Isso significa que Statements que operam exclusivamente em tabelas não transacionais são ignoradas, mesmo após o [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements").

Para ilustrar, considere o seguinte cenário:

```sql
1. SET autocommit = OFF;
2. CREATE TABLE t1 (a INT) ENGINE = InnoDB;
3. START TRANSACTION;                       -- Transaction 1 START
4. INSERT INTO t1 VALUES (1), (2), (3);
5. CREATE TABLE t2 (a INT) ENGINE = MyISAM; -- Transaction 1 COMMIT
                                            -- (implicit; DDL forces commit)
6. INSERT INTO t2 VALUES (1), (2), (3);     -- Update nontransactional table
7. UPDATE t2 SET a = a + 1;                 -- ... and again
8. INSERT INTO t1 VALUES (4), (5), (6);     -- Write to transactional table
                                            -- Transaction 2 START (implicit)
9. COMMIT;                                  -- Transaction 2 COMMIT
```

Na perspectiva do servidor, a Transaction 1 termina quando a tabela `t2` é criada. A Transaction 2 não começa até que uma tabela transacional seja acessada, apesar das atualizações intermediárias em tabelas não transacionais.

Na perspectiva do Performance Schema, a Transaction 2 começa quando o servidor transiciona para um estado de Transaction ativo. As Statements 6 e 7 não são incluídas nos limites da Transaction 2, o que é consistente com a forma como o servidor grava Transactions no Binary Log.

#### Instrumentação de Transaction

Três atributos definem Transactions:

* Modo de acesso (read only, read write)
* Nível de Isolation ([`SERIALIZABLE`](innodb-transaction-isolation-levels.html#isolevel_serializable), [`REPEATABLE READ`](innodb-transaction-isolation-levels.html#isolevel_repeatable-read) e assim por diante)

* Implícita ([`autocommit`](server-system-variables.html#sysvar_autocommit) habilitada) ou explícita ([`autocommit`](server-system-variables.html#sysvar_autocommit) desabilitada)

Para reduzir a complexidade da instrumentação de Transaction e garantir que os dados de Transaction coletados forneçam resultados completos e significativos, todas as Transactions são instrumentadas independentemente do modo de acesso, nível de Isolation ou modo autocommit.

Para examinar seletivamente o histórico de Transaction, use as colunas de atributo nas tabelas de transaction event: `ACCESS_MODE`, `ISOLATION_LEVEL` e `AUTOCOMMIT`.

O custo da instrumentação de Transaction pode ser reduzido de várias maneiras, como habilitar ou desabilitar a instrumentação de Transaction de acordo com user, account, host ou Thread (conexão do cliente).

#### Transactions e Eventos Aninhados

O Parent (Pai) de um transaction event é o Event que iniciou a Transaction. Para uma Transaction iniciada explicitamente, isso inclui as Statements [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") e [`COMMIT AND CHAIN`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"). Para uma Transaction iniciada implicitamente, é a primeira Statement que usa um engine transacional após o término da Transaction anterior.

Em geral, uma Transaction é o Parent de nível superior para todos os Events iniciados durante a Transaction, incluindo Statements que encerram explicitamente a Transaction, como [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") e [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"). As exceções são Statements que encerram uma Transaction implicitamente, como Statements DDL, caso em que a Transaction atual deve ser committed antes que a nova Statement seja executada.

#### Transactions e Stored Programs

Transactions e stored program events estão relacionados da seguinte forma:

* Stored Procedures

  Stored Procedures operam independentemente de Transactions. Uma stored procedure pode ser iniciada dentro de uma Transaction, e uma Transaction pode ser iniciada ou encerrada de dentro de uma stored procedure. Se for chamada de dentro de uma Transaction, uma stored procedure pode executar Statements que forçam um Commit da Transaction Parent e, em seguida, iniciar uma nova Transaction.

  Se uma stored procedure for iniciada dentro de uma Transaction, essa Transaction é o Parent do stored procedure event.

  Se uma Transaction for iniciada por uma stored procedure, a stored procedure é o Parent do transaction event.

* Stored Functions

  Stored Functions são restritas de causar um Commit ou Rollback explícito ou implícito. Stored function events podem residir dentro de um transaction event Parent.

* Triggers

  Triggers são ativados como parte de uma Statement que acessa a tabela à qual está associada, portanto, o Parent de um trigger event é sempre a Statement que o ativa.

  Triggers não podem emitir Statements que causem um Commit ou Rollback explícito ou implícito de uma Transaction.

* Scheduled Events

  A execução das Statements no corpo de um Scheduled Event ocorre em uma nova conexão. O aninhamento de um Scheduled Event dentro de uma Transaction Parent não é aplicável.

#### Transactions e Savepoints

Statements de Savepoint são registradas como statement events separados. Transaction events incluem contadores separados para Statements [`SAVEPOINT`](savepoint.html "13.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements"), [`ROLLBACK TO SAVEPOINT`](savepoint.html "13.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements") e [`RELEASE SAVEPOINT`](savepoint.html "13.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements") emitidas durante a Transaction.

#### Transactions e Erros

Erros e warnings que ocorrem dentro de uma Transaction são registrados em statement events, mas não no transaction event correspondente. Isso inclui erros e warnings específicos de Transaction, como um Rollback em uma tabela não transacional ou erros de consistência GTID.