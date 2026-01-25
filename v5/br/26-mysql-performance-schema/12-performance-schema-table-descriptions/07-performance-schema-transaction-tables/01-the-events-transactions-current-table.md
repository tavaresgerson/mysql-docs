#### 25.12.7.1 A Tabela events_transactions_current

A tabela [`events_transactions_current`](performance-schema-events-transactions-current-table.html "25.12.7.1 The events_transactions_current Table") contém eventos de Transaction atuais. A tabela armazena uma linha por Thread, mostrando o status atual do evento de Transaction monitorado mais recente do Thread, portanto, não há uma variável de sistema para configurar o tamanho da tabela. Por exemplo:

```sql
mysql> SELECT *
       FROM performance_schema.events_transactions_current LIMIT 1\G
*************************** 1. row ***************************
                      THREAD_ID: 26
                       EVENT_ID: 7
                   END_EVENT_ID: NULL
                     EVENT_NAME: transaction
                          STATE: ACTIVE
                         TRX_ID: NULL
                           GTID: 3E11FA47-71CA-11E1-9E33-C80AA9429562:56
                            XID: NULL
                       XA_STATE: NULL
                         SOURCE: transaction.cc:150
                    TIMER_START: 420833537900000
                      TIMER_END: NULL
                     TIMER_WAIT: NULL
                    ACCESS_MODE: READ WRITE
                ISOLATION_LEVEL: REPEATABLE READ
                     AUTOCOMMIT: NO
           NUMBER_OF_SAVEPOINTS: 0
NUMBER_OF_ROLLBACK_TO_SAVEPOINT: 0
    NUMBER_OF_RELEASE_SAVEPOINT: 0
          OBJECT_INSTANCE_BEGIN: NULL
               NESTING_EVENT_ID: 6
             NESTING_EVENT_TYPE: STATEMENT
```

Entre as tabelas que contêm linhas de eventos de Transaction, [`events_transactions_current`](performance-schema-events-transactions-current-table.html "25.12.7.1 The events_transactions_current Table") é a mais fundamental. Outras tabelas que contêm linhas de eventos de Transaction são logicamente derivadas dos eventos atuais. Por exemplo, as tabelas [`events_transactions_history`](performance-schema-events-transactions-history-table.html "25.12.7.2 The events_transactions_history Table") e [`events_transactions_history_long`](performance-schema-events-transactions-history-long-table.html "25.12.7.3 The events_transactions_history_long Table") são coleções dos eventos de Transaction mais recentes que foram concluídos, até um número máximo de linhas por Thread e globalmente em todos os Threads, respectivamente.

Para mais informações sobre o relacionamento entre as três tabelas de eventos de Transaction, consulte a [Seção 25.9, “Tabelas do Performance Schema para Eventos Atuais e Históricos”](performance-schema-event-tables.html "25.9 Performance Schema Tables for Current and Historical Events").

Para obter informações sobre como configurar a coleta de eventos de Transaction, consulte a [Seção 25.12.7, “Tabelas de Transaction do Performance Schema”](performance-schema-transaction-tables.html "25.12.7 Performance Schema Transaction Tables").

A tabela [`events_transactions_current`](performance-schema-events-transactions-current-table.html "25.12.7.1 The events_transactions_current Table") possui as seguintes colunas:

* `THREAD_ID`, `EVENT_ID`

  O Thread associado ao evento e o número do evento atual do Thread quando o evento começa. Os valores `THREAD_ID` e `EVENT_ID` juntos identificam a linha de forma exclusiva. Não há duas linhas com o mesmo par de valores.

* `END_EVENT_ID`

  Esta coluna é definida como `NULL` quando o evento começa e é atualizada para o número do evento atual do Thread quando o evento termina.

* `EVENT_NAME`

  O nome do instrument a partir do qual o evento foi coletado. Este é um valor `NAME` da tabela [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table"). Nomes de instruments podem ter múltiplas partes e formar uma hierarquia, conforme discutido na [Seção 25.6, “Convenções de Nomenclatura de Instrumentos do Performance Schema”](performance-schema-instrument-naming.html "25.6 Performance Schema Instrument Naming Conventions").

* `STATE`

  O estado atual da Transaction. O valor é `ACTIVE` (após [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") ou [`BEGIN`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")), `COMMITTED` (após [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")), ou `ROLLED BACK` (após [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")).

* `TRX_ID`

  Não utilizado.

* `GTID`

  A coluna `GTID` contém o valor de [`gtid_next`](replication-options-gtids.html#sysvar_gtid_next), que pode ser `ANONYMOUS`, `AUTOMATIC`, ou um GTID usando o formato `UUID:NUMBER`. Para Transactions que usam [`gtid_next=AUTOMATIC`](replication-options-gtids.html#sysvar_gtid_next), que são todas as Transactions normais do cliente, a coluna GTID muda quando a Transaction faz o Commit e o GTID real é atribuído. Se [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) for `ON` ou `ON_PERMISSIVE`, a coluna GTID muda para o GTID da Transaction. Se `gtid_mode` for `OFF` ou `OFF_PERMISSIVE`, a coluna GTID muda para `ANONYMOUS`.

* `XID_FORMAT_ID`, `XID_GTRID`, and `XID_BQUAL`

  Os elementos do identificador da Transaction XA. Eles possuem o formato descrito na [Seção 13.3.7.1, “Instruções SQL de Transaction XA”](xa-statements.html "13.3.7.1 XA Transaction SQL Statements").

* `XA_STATE`

  O estado da Transaction XA. O valor é `ACTIVE` (após [`XA START`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements")), `IDLE` (após [`XA END`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements")), `PREPARED` (após [`XA PREPARE`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements")), `ROLLED BACK` (após [`XA ROLLBACK`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements")), ou `COMMITTED` (após [`XA COMMIT`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements")).

  Em uma réplica, a mesma Transaction XA pode aparecer na tabela [`events_transactions_current`](performance-schema-events-transactions-current-table.html "25.12.7.1 The events_transactions_current Table") com estados diferentes em diferentes Threads. Isso ocorre porque, imediatamente após a Transaction XA ser preparada, ela é desvinculada do Thread aplicador de replicação e pode ser Committada ou sofrer Rollback por qualquer Thread na réplica. A tabela [`events_transactions_current`](performance-schema-events-transactions-current-table.html "25.12.7.1 The events_transactions_current Table") exibe o status atual do evento de Transaction monitorado mais recente no Thread e não atualiza esse status quando o Thread está ocioso. Portanto, a Transaction XA ainda pode ser exibida no estado `PREPARED` para o Thread aplicador original, depois de ter sido processada por outro Thread. Para identificar positivamente Transactions XA que ainda estão no estado `PREPARED` e precisam ser recuperadas, use a instrução [`XA RECOVER`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements") em vez das tabelas de Transaction do Performance Schema.

* `SOURCE`

  O nome do arquivo de origem que contém o código instrumentado que produziu o evento e o número da linha no arquivo onde a instrumentação ocorre. Isso permite que você verifique a origem para determinar exatamente qual código está envolvido.

* `TIMER_START`, `TIMER_END`, `TIMER_WAIT`

  Informações de tempo (Timing) para o evento. A unidade para esses valores é picosegundos (trilionésimos de segundo). Os valores `TIMER_START` e `TIMER_END` indicam quando o timing do evento começou e terminou. `TIMER_WAIT` é o tempo decorrido (duração) do evento.

  Se um evento não foi concluído, `TIMER_END` é o valor atual do timer e `TIMER_WAIT` é o tempo decorrido até agora (`TIMER_END` − `TIMER_START`).

  Se um evento é produzido a partir de um instrument que tem `TIMED = NO`, as informações de timing não são coletadas e `TIMER_START`, `TIMER_END` e `TIMER_WAIT` são todos `NULL`.

  Para discussão sobre picosegundos como a unidade para tempos de evento e fatores que afetam os valores de tempo, consulte a [Seção 25.4.1, “Timing de Eventos do Performance Schema”](performance-schema-timing.html "25.4.1 Performance Schema Event Timing").

* `ACCESS_MODE`

  O modo de acesso da Transaction. O valor é `READ WRITE` ou `READ ONLY`.

* `ISOLATION_LEVEL`

  O nível de Isolation da Transaction. O valor é [`REPEATABLE READ`](innodb-transaction-isolation-levels.html#isolevel_repeatable-read), [`READ COMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-committed), [`READ UNCOMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-uncommitted), ou [`SERIALIZABLE`](innodb-transaction-isolation-levels.html#isolevel_serializable).

* `AUTOCOMMIT`

  Indica se o modo Autocommit estava habilitado quando a Transaction foi iniciada.

* `NUMBER_OF_SAVEPOINTS`, `NUMBER_OF_ROLLBACK_TO_SAVEPOINT`, `NUMBER_OF_RELEASE_SAVEPOINT`

  O número de instruções [`SAVEPOINT`](savepoint.html "13.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements"), [`ROLLBACK TO SAVEPOINT`](savepoint.html "13.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements") e [`RELEASE SAVEPOINT`](savepoint.html "13.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements") emitidas durante a Transaction.

* `OBJECT_INSTANCE_BEGIN`

  Não utilizado.

* `NESTING_EVENT_ID`

  O valor `EVENT_ID` do evento dentro do qual este evento está aninhado.

* `NESTING_EVENT_TYPE`

  O tipo de evento de aninhamento (nesting). O valor é `TRANSACTION`, `STATEMENT`, `STAGE`, ou `WAIT`. (`TRANSACTION` não aparece porque Transactions não podem ser aninhadas.)

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é permitido para a tabela [`events_transactions_current`](performance-schema-events-transactions-current-table.html "25.12.7.1 The events_transactions_current Table"). Ele remove as linhas.