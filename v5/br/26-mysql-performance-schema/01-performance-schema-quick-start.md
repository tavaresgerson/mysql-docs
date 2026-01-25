## 25.1 Início Rápido do Performance Schema

Esta seção apresenta brevemente o Performance Schema com exemplos que mostram como utilizá-lo. Para exemplos adicionais, consulte [Seção 25.19, “Usando o Performance Schema para Diagnosticar Problemas”](performance-schema-examples.html "25.19 Usando o Performance Schema para Diagnosticar Problemas").

O Performance Schema é ativado por padrão. Para ativá-lo ou desativá-lo explicitamente, inicie o servidor com a variável [`performance_schema`](performance-schema-system-variables.html#sysvar_performance_schema) definida com um valor apropriado. Por exemplo, use estas linhas no arquivo `my.cnf` do servidor:

```sql
[mysqld]
performance_schema=ON
```

Quando o servidor inicia, ele detecta [`performance_schema`](performance-schema-system-variables.html#sysvar_performance_schema) e tenta inicializar o Performance Schema. Para verificar a inicialização bem-sucedida, use esta instrução:

```sql
mysql> SHOW VARIABLES LIKE 'performance_schema';
+--------------------+-------+
| Variable_name      | Value |
+--------------------+-------+
| performance_schema | ON    |
+--------------------+-------+
```

Um valor `ON` significa que o Performance Schema foi inicializado com sucesso e está pronto para uso. Um valor `OFF` significa que ocorreu algum erro. Verifique o log de erros do servidor para obter informações sobre o que deu errado.

O Performance Schema é implementado como um Storage Engine. Se este engine estiver disponível (o que você já deve ter verificado anteriormente), ele deverá aparecer listado com um valor `SUPPORT` de `YES` na saída da tabela [`ENGINES`](information-schema-engines-table.html "24.3.7 A Tabela INFORMATION_SCHEMA ENGINES") do Information Schema ou da instrução [`SHOW ENGINES`](show-engines.html "13.7.5.16 Instrução SHOW ENGINES"):

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.ENGINES
       WHERE ENGINE='PERFORMANCE_SCHEMA'\G
*************************** 1. row ***************************
      ENGINE: PERFORMANCE_SCHEMA
     SUPPORT: YES
     COMMENT: Performance Schema
TRANSACTIONS: NO
          XA: NO
  SAVEPOINTS: NO

mysql> SHOW ENGINES\G
...
      Engine: PERFORMANCE_SCHEMA
     Support: YES
     Comment: Performance Schema
Transactions: NO
          XA: NO
  Savepoints: NO
...
```

O Storage Engine [`PERFORMANCE_SCHEMA`](performance-schema.html "Capítulo 25 MySQL Performance Schema") opera em tabelas no Database `performance_schema`. Você pode definir `performance_schema` como o Database padrão para que as referências às suas tabelas não precisem ser qualificadas com o nome do Database:

```sql
mysql> USE performance_schema;
```

As tabelas do Performance Schema são armazenadas no Database `performance_schema`. Informações sobre a estrutura deste Database e suas tabelas podem ser obtidas, assim como para qualquer outro Database, selecionando a partir do Database `INFORMATION_SCHEMA` ou usando instruções [`SHOW`](show.html "13.7.5 Instruções SHOW"). Por exemplo, use qualquer uma destas instruções para ver quais tabelas do Performance Schema existem:

```sql
mysql> SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
       WHERE TABLE_SCHEMA = 'performance_schema';
+------------------------------------------------------+
| TABLE_NAME                                           |
+------------------------------------------------------+
| accounts                                             |
| cond_instances                                       |
...
| events_stages_current                                |
| events_stages_history                                |
| events_stages_history_long                           |
| events_stages_summary_by_account_by_event_name       |
| events_stages_summary_by_host_by_event_name          |
| events_stages_summary_by_thread_by_event_name        |
| events_stages_summary_by_user_by_event_name          |
| events_stages_summary_global_by_event_name           |
| events_statements_current                            |
| events_statements_history                            |
| events_statements_history_long                       |
...
| file_instances                                       |
| file_summary_by_event_name                           |
| file_summary_by_instance                             |
| host_cache                                           |
| hosts                                                |
| memory_summary_by_account_by_event_name              |
| memory_summary_by_host_by_event_name                 |
| memory_summary_by_thread_by_event_name               |
| memory_summary_by_user_by_event_name                 |
| memory_summary_global_by_event_name                  |
| metadata_locks                                       |
| mutex_instances                                      |
| objects_summary_global_by_type                       |
| performance_timers                                   |
| replication_connection_configuration                 |
| replication_connection_status                        |
| replication_applier_configuration                    |
| replication_applier_status                           |
| replication_applier_status_by_coordinator            |
| replication_applier_status_by_worker                 |
| rwlock_instances                                     |
| session_account_connect_attrs                        |
| session_connect_attrs                                |
| setup_actors                                         |
| setup_consumers                                      |
| setup_instruments                                    |
| setup_objects                                        |
| setup_timers                                         |
| socket_instances                                     |
| socket_summary_by_event_name                         |
| socket_summary_by_instance                           |
| table_handles                                        |
| table_io_waits_summary_by_index_usage                |
| table_io_waits_summary_by_table                      |
| table_lock_waits_summary_by_table                    |
| threads                                              |
| users                                                |
+------------------------------------------------------+

mysql> SHOW TABLES FROM performance_schema;
+------------------------------------------------------+
| Tables_in_performance_schema                         |
+------------------------------------------------------+
| accounts                                             |
| cond_instances                                       |
| events_stages_current                                |
| events_stages_history                                |
| events_stages_history_long                           |
...
```

O número de tabelas do Performance Schema aumenta com o tempo à medida que a implementação de instrumentação adicional prossegue.

O nome do Database `performance_schema` é em minúsculas, assim como os nomes das tabelas dentro dele. As Queries devem especificar os nomes em minúsculas.

Para ver a estrutura de tabelas individuais, use [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 Instrução SHOW CREATE TABLE"):

```sql
mysql> SHOW CREATE TABLE performance_schema.setup_consumers\G
*************************** 1. row ***************************
       Table: setup_consumers
Create Table: CREATE TABLE `setup_consumers` (
  `NAME` varchar(64) NOT NULL,
  `ENABLED` enum('YES','NO') NOT NULL
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8
```

A estrutura da tabela também está disponível selecionando a partir de tabelas como [`INFORMATION_SCHEMA.COLUMNS`](information-schema-columns-table.html "24.3.5 A Tabela INFORMATION_SCHEMA COLUMNS") ou usando instruções como [`SHOW COLUMNS`](show-columns.html "13.7.5.5 Instrução SHOW COLUMNS").

As tabelas no Database `performance_schema` podem ser agrupadas de acordo com o tipo de informação que contêm: Eventos atuais, históricos e resumos de eventos, instâncias de objetos e informações de setup (configuração). Os exemplos a seguir ilustram alguns usos para estas tabelas. Para informações detalhadas sobre as tabelas em cada grupo, consulte [Seção 25.12, “Descrições das Tabelas do Performance Schema”](performance-schema-table-descriptions.html "25.12 Performance Schema Table Descriptions").

Inicialmente, nem todos os *instruments* e *consumers* estão ativados, portanto, o Performance Schema não coleta todos os eventos. Para ativar todos eles e habilitar o *timing* de eventos, execute duas instruções (a contagem de linhas pode diferir dependendo da versão do MySQL):

```sql
mysql> UPDATE performance_schema.setup_instruments
       SET ENABLED = 'YES', TIMED = 'YES';
Query OK, 560 rows affected (0.04 sec)
mysql> UPDATE performance_schema.setup_consumers
       SET ENABLED = 'YES';
Query OK, 10 rows affected (0.00 sec)
```

Para ver o que o servidor está fazendo no momento, examine a tabela [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 A Tabela events_waits_current"). Ela contém uma linha por Thread, mostrando o evento monitorado mais recente de cada Thread:

```sql
mysql> SELECT *
       FROM performance_schema.events_waits_current\G
*************************** 1. row ***************************
            THREAD_ID: 0
             EVENT_ID: 5523
         END_EVENT_ID: 5523
           EVENT_NAME: wait/synch/mutex/mysys/THR_LOCK::mutex
               SOURCE: thr_lock.c:525
          TIMER_START: 201660494489586
            TIMER_END: 201660494576112
           TIMER_WAIT: 86526
                SPINS: NULL
        OBJECT_SCHEMA: NULL
          OBJECT_NAME: NULL
           INDEX_NAME: NULL
          OBJECT_TYPE: NULL
OBJECT_INSTANCE_BEGIN: 142270668
     NESTING_EVENT_ID: NULL
   NESTING_EVENT_TYPE: NULL
            OPERATION: lock
      NUMBER_OF_BYTES: NULL
                FLAGS: 0
...
```

Este evento indica que o Thread 0 estava esperando por 86.526 picoseconds para adquirir um Lock em `THR_LOCK::mutex`, um Mutex no subsistema `mysys`. As primeiras colunas fornecem as seguintes informações:

* As colunas ID indicam de qual Thread o evento se origina e o número do evento.

* `EVENT_NAME` indica o que foi instrumentado e `SOURCE` indica qual arquivo fonte contém o código instrumentado.

* As colunas do timer mostram quando o evento começou e parou, e quanto tempo durou. Se um evento ainda estiver em andamento, os valores `TIMER_END` e `TIMER_WAIT` serão `NULL`. Os valores do timer são aproximados e expressos em picoseconds. Para obter informações sobre timers e coleta de tempo de evento, consulte [Seção 25.4.1, “Timing de Eventos do Performance Schema”](performance-schema-timing.html "25.4.1 Performance Schema Event Timing").

As tabelas de histórico contêm o mesmo tipo de linhas que a tabela de eventos atuais, mas têm mais linhas e mostram o que o servidor tem feito “recentemente” em vez de “atualmente”. As tabelas [`events_waits_history`](performance-schema-events-waits-history-table.html "25.12.4.2 A Tabela events_waits_history") e [`events_waits_history_long`](performance-schema-events-waits-history-long-table.html "25.12.4.3 A Tabela events_waits_history_long") contêm os 10 eventos mais recentes por Thread e os 10.000 eventos mais recentes, respectivamente. Por exemplo, para ver informações sobre eventos recentes produzidos pelo Thread 13, faça o seguinte:

```sql
mysql> SELECT EVENT_ID, EVENT_NAME, TIMER_WAIT
       FROM performance_schema.events_waits_history
       WHERE THREAD_ID = 13
       ORDER BY EVENT_ID;
+----------+-----------------------------------------+------------+
| EVENT_ID | EVENT_NAME                              | TIMER_WAIT |
+----------+-----------------------------------------+------------+
|       86 | wait/synch/mutex/mysys/THR_LOCK::mutex  |     686322 |
|       87 | wait/synch/mutex/mysys/THR_LOCK_malloc  |     320535 |
|       88 | wait/synch/mutex/mysys/THR_LOCK_malloc  |     339390 |
|       89 | wait/synch/mutex/mysys/THR_LOCK_malloc  |     377100 |
|       90 | wait/synch/mutex/sql/LOCK_plugin        |     614673 |
|       91 | wait/synch/mutex/sql/LOCK_open          |     659925 |
|       92 | wait/synch/mutex/sql/THD::LOCK_thd_data |     494001 |
|       93 | wait/synch/mutex/mysys/THR_LOCK_malloc  |     222489 |
|       94 | wait/synch/mutex/mysys/THR_LOCK_malloc  |     214947 |
|       95 | wait/synch/mutex/mysys/LOCK_alarm       |     312993 |
+----------+-----------------------------------------+------------+
```

À medida que novos eventos são adicionados a uma tabela de histórico, eventos mais antigos são descartados se a tabela estiver cheia.

As tabelas de resumo fornecem informações agregadas para todos os eventos ao longo do tempo. As tabelas neste grupo resumem dados de eventos de diferentes maneiras. Para ver quais *instruments* foram executados mais vezes ou consumiram mais tempo de Wait, classifique a tabela [`events_waits_summary_global_by_event_name`](performance-schema-wait-summary-tables.html "25.12.15.1 Tabelas de Resumo de Eventos de Wait") pela coluna `COUNT_STAR` ou `SUM_TIMER_WAIT`, que correspondem a um valor `COUNT(*)` ou `SUM(TIMER_WAIT)`, respectivamente, calculado sobre todos os eventos:

```sql
mysql> SELECT EVENT_NAME, COUNT_STAR
       FROM performance_schema.events_waits_summary_global_by_event_name
       ORDER BY COUNT_STAR DESC LIMIT 10;
+---------------------------------------------------+------------+
| EVENT_NAME                                        | COUNT_STAR |
+---------------------------------------------------+------------+
| wait/synch/mutex/mysys/THR_LOCK_malloc            |       6419 |
| wait/io/file/sql/FRM                              |        452 |
| wait/synch/mutex/sql/LOCK_plugin                  |        337 |
| wait/synch/mutex/mysys/THR_LOCK_open              |        187 |
| wait/synch/mutex/mysys/LOCK_alarm                 |        147 |
| wait/synch/mutex/sql/THD::LOCK_thd_data           |        115 |
| wait/io/file/myisam/kfile                         |        102 |
| wait/synch/mutex/sql/LOCK_global_system_variables |         89 |
| wait/synch/mutex/mysys/THR_LOCK::mutex            |         89 |
| wait/synch/mutex/sql/LOCK_open                    |         88 |
+---------------------------------------------------+------------+

mysql> SELECT EVENT_NAME, SUM_TIMER_WAIT
       FROM performance_schema.events_waits_summary_global_by_event_name
       ORDER BY SUM_TIMER_WAIT DESC LIMIT 10;
+----------------------------------------+----------------+
| EVENT_NAME                             | SUM_TIMER_WAIT |
+----------------------------------------+----------------+
| wait/io/file/sql/MYSQL_LOG             |     1599816582 |
| wait/synch/mutex/mysys/THR_LOCK_malloc |     1530083250 |
| wait/io/file/sql/binlog_index          |     1385291934 |
| wait/io/file/sql/FRM                   |     1292823243 |
| wait/io/file/myisam/kfile              |      411193611 |
| wait/io/file/myisam/dfile              |      322401645 |
| wait/synch/mutex/mysys/LOCK_alarm      |      145126935 |
| wait/io/file/sql/casetest              |      104324715 |
| wait/synch/mutex/sql/LOCK_plugin       |       86027823 |
| wait/io/file/sql/pid                   |       72591750 |
+----------------------------------------+----------------+
```

Estes resultados mostram que o Mutex `THR_LOCK_malloc` está “quente” (*hot*), tanto em termos de frequência de uso quanto na quantidade de tempo que os Threads esperam tentando adquiri-lo.

Nota

O Mutex `THR_LOCK_malloc` é usado apenas em *builds* de debug. Em *builds* de produção ele não está "quente" porque é inexistente.

Tabelas de instância documentam quais tipos de objetos são instrumentados. Um objeto instrumentado, quando usado pelo servidor, produz um evento. Estas tabelas fornecem nomes de eventos e notas explicativas ou informações de status. Por exemplo, a tabela [`file_instances`](performance-schema-file-instances-table.html "25.12.3.2 A Tabela file_instances") lista instâncias de *instruments* para operações de I/O de arquivo e seus arquivos associados:

```sql
mysql> SELECT *
       FROM performance_schema.file_instances\G
*************************** 1. row ***************************
 FILE_NAME: /opt/mysql-log/60500/binlog.000007
EVENT_NAME: wait/io/file/sql/binlog
OPEN_COUNT: 0
*************************** 2. row ***************************
 FILE_NAME: /opt/mysql/60500/data/mysql/tables_priv.MYI
EVENT_NAME: wait/io/file/myisam/kfile
OPEN_COUNT: 1
*************************** 3. row ***************************
 FILE_NAME: /opt/mysql/60500/data/mysql/columns_priv.MYI
EVENT_NAME: wait/io/file/myisam/kfile
OPEN_COUNT: 1
...
```

Tabelas de Setup são usadas para configurar e exibir características de monitoramento. Por exemplo, [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 A Tabela setup_instruments") lista o conjunto de *instruments* para os quais eventos podem ser coletados e mostra quais deles estão ativados:

```sql
mysql> SELECT * FROM performance_schema.setup_instruments;
+---------------------------------------------------+---------+-------+
| NAME                                              | ENABLED | TIMED |
+---------------------------------------------------+---------+-------+
...
| stage/sql/end                                     | NO      | NO    |
| stage/sql/executing                               | NO      | NO    |
| stage/sql/init                                    | NO      | NO    |
| stage/sql/insert                                  | NO      | NO    |
...
| statement/sql/load                                | YES     | YES   |
| statement/sql/grant                               | YES     | YES   |
| statement/sql/check                               | YES     | YES   |
| statement/sql/flush                               | YES     | YES   |
...
| wait/synch/mutex/sql/LOCK_global_read_lock        | YES     | YES   |
| wait/synch/mutex/sql/LOCK_global_system_variables | YES     | YES   |
| wait/synch/mutex/sql/LOCK_lock_db                 | YES     | YES   |
| wait/synch/mutex/sql/LOCK_manager                 | YES     | YES   |
...
| wait/synch/rwlock/sql/LOCK_grant                  | YES     | YES   |
| wait/synch/rwlock/sql/LOGGER::LOCK_logger         | YES     | YES   |
| wait/synch/rwlock/sql/LOCK_sys_init_connect       | YES     | YES   |
| wait/synch/rwlock/sql/LOCK_sys_init_slave         | YES     | YES   |
...
| wait/io/file/sql/binlog                           | YES     | YES   |
| wait/io/file/sql/binlog_index                     | YES     | YES   |
| wait/io/file/sql/casetest                         | YES     | YES   |
| wait/io/file/sql/dbopt                            | YES     | YES   |
...
```

Para entender como interpretar os nomes dos *instruments*, consulte [Seção 25.6, “Convenções de Nomenclatura de Instruments do Performance Schema”](performance-schema-instrument-naming.html "25.6 Performance Schema Instrument Naming Conventions").

Para controlar se os eventos são coletados para um *instrument*, defina seu valor `ENABLED` como `YES` ou `NO`. Por exemplo:

```sql
mysql> UPDATE performance_schema.setup_instruments
       SET ENABLED = 'NO'
       WHERE NAME = 'wait/synch/mutex/sql/LOCK_mysql_create_db';
```

O Performance Schema usa eventos coletados para atualizar tabelas no Database `performance_schema`, que funcionam como “consumers” (consumidores) de informações de eventos. A tabela [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 A Tabela setup_consumers") lista os *consumers* disponíveis e quais estão ativados:

```sql
mysql> SELECT * FROM performance_schema.setup_consumers;
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| events_stages_current            | NO      |
| events_stages_history            | NO      |
| events_stages_history_long       | NO      |
| events_statements_current        | YES     |
| events_statements_history        | YES     |
| events_statements_history_long   | NO      |
| events_transactions_current      | NO      |
| events_transactions_history      | NO      |
| events_transactions_history_long | NO      |
| events_waits_current             | NO      |
| events_waits_history             | NO      |
| events_waits_history_long        | NO      |
| global_instrumentation           | YES     |
| thread_instrumentation           | YES     |
| statements_digest                | YES     |
+----------------------------------+---------+
```

Para controlar se o Performance Schema mantém um *consumer* como destino para informações de eventos, defina seu valor `ENABLED`.

Para mais informações sobre as tabelas de setup e como usá-las para controlar a coleta de eventos, consulte [Seção 25.4.2, “Filtragem de Eventos do Performance Schema”](performance-schema-filtering.html "25.4.2 Performance Schema Event Filtering").

Existem algumas tabelas diversas (*miscellaneous*) que não se enquadram em nenhum dos grupos anteriores. Por exemplo, [`performance_timers`](performance-schema-performance-timers-table.html "25.12.16.2 A Tabela performance_timers") lista os *timers* de eventos disponíveis e suas características. Para obter informações sobre *timers*, consulte [Seção 25.4.1, “Timing de Eventos do Performance Schema”](performance-schema-timing.html "25.4.1 Performance Schema Event Timing").