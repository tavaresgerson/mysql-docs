## 25.1 Início Rápido do Schema de Desempenho

Esta seção apresenta brevemente o Schema de Desempenho com exemplos que mostram como usá-lo. Para exemplos adicionais, consulte Seção 25.19, “Usando o Schema de Desempenho para Diagnosticar Problemas”.

O Schema de Desempenho é ativado por padrão. Para ativá-lo ou desativá-lo explicitamente, inicie o servidor com a variável `performance_schema` definida para um valor apropriado. Por exemplo, use essas linhas no arquivo `my.cnf` do servidor:

```sql
[mysqld]
performance_schema=ON
```

Quando o servidor for iniciado, ele verá `performance_schema` e tentará inicializar o Schema de Desempenho. Para verificar a inicialização bem-sucedida, use esta instrução:

```sql
mysql> SHOW VARIABLES LIKE 'performance_schema';
+--------------------+-------+
| Variable_name      | Value |
+--------------------+-------+
| performance_schema | ON    |
+--------------------+-------+
```

Um valor de `ON` significa que o Schema de Desempenho foi inicializado com sucesso e está pronto para uso. Um valor de `OFF` significa que ocorreu algum erro. Verifique o log de erros do servidor para obter informações sobre o que deu errado.

O Schema de Desempenho é implementado como um mecanismo de armazenamento. Se este mecanismo estiver disponível (o que você já deve ter verificado anteriormente), você deve vê-lo listado com um valor `SUPPORT` de `YES` na saída da tabela do Schema de Informações `ENGINES` ou na declaração `SHOW ENGINES`:

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

O mecanismo de armazenamento `PERFORMANCE_SCHEMA` opera em tabelas no banco de dados `performance_schema`. Você pode tornar o `performance_schema` o banco de dados padrão, para que as referências a suas tabelas não precisem ser qualificadas com o nome do banco de dados:

```sql
mysql> USE performance_schema;
```

As tabelas do Schema de Desempenho são armazenadas no banco de dados `performance_schema`. Informações sobre a estrutura desse banco de dados e suas tabelas podem ser obtidas, assim como em qualquer outro banco de dados, selecionando o banco de dados `INFORMATION_SCHEMA` ou usando as instruções `[`SHOW\`]\(show\.html). Por exemplo, use uma dessas instruções para ver quais tabelas do Schema de Desempenho existem:

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

O número de tabelas do Schema de Desempenho aumenta ao longo do tempo à medida que a implementação de instrumentação adicional prossegue.

O nome do banco de dados `performance_schema` é minúsculo, assim como os nomes das tabelas nele contidas. As consultas devem especificar os nomes em minúsculas.

Para ver a estrutura de tabelas individuais, use `SHOW CREATE TABLE`:

```sql
mysql> SHOW CREATE TABLE performance_schema.setup_consumers\G
*************************** 1. row ***************************
       Table: setup_consumers
Create Table: CREATE TABLE `setup_consumers` (
  `NAME` varchar(64) NOT NULL,
  `ENABLED` enum('YES','NO') NOT NULL
) ENGINE=PERFORMANCE_SCHEMA DEFAULT CHARSET=utf8
```

A estrutura da tabela também está disponível ao selecionar tabelas como `INFORMATION_SCHEMA.COLUMNS` ou usando instruções como `SHOW COLUMNS`.

As tabelas no banco de dados `performance_schema` podem ser agrupadas de acordo com o tipo de informação que contêm: eventos atuais, históricos e resumos de eventos, instâncias de objetos e informações de configuração (configuração). Os seguintes exemplos ilustram alguns usos dessas tabelas. Para informações detalhadas sobre as tabelas de cada grupo, consulte Seção 25.12, “Descrição das Tabelas do Schema de Desempenho”.

Inicialmente, nem todos os instrumentos e consumidores estão habilitados, portanto, o esquema de desempenho não coleta todos os eventos. Para ativar todos esses recursos e habilitar o cronometramento de eventos, execute duas instruções (os números de linhas podem variar dependendo da versão do MySQL):

```sql
mysql> UPDATE performance_schema.setup_instruments
       SET ENABLED = 'YES', TIMED = 'YES';
Query OK, 560 rows affected (0.04 sec)
mysql> UPDATE performance_schema.setup_consumers
       SET ENABLED = 'YES';
Query OK, 10 rows affected (0.00 sec)
```

Para ver o que o servidor está fazendo no momento, examine a tabela `events_waits_current`. Ela contém uma linha por thread, mostrando o evento mais recente monitorado de cada thread:

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

Esse evento indica que o thread 0 estava esperando por 86.526 picosegundos para adquirir um bloqueio no `THR_LOCK::mutex`, um mutex no subsistema `mysys`. As primeiras colunas fornecem as seguintes informações:

- As colunas ID indicam de qual thread o evento vem e o número do evento.

- `EVENT_NAME` indica o que foi instrumentado e `SOURCE` indica qual arquivo de origem contém o código instrumentado.

- As colunas do temporizador mostram quando o evento começou e parou e quanto tempo levou. Se um evento ainda estiver em andamento, os valores `TIMER_END` e `TIMER_WAIT` são `NULL`. Os valores do temporizador são aproximados e expressos em picosegundos. Para informações sobre temporizadores e coleta de tempo de eventos, consulte Seção 25.4.1, “Cronometragem de Eventos do Schema de Desempenho”.

As tabelas de histórico contêm o mesmo tipo de linhas que a tabela de eventos atuais, mas têm mais linhas e mostram o que o servidor tem feito "recentemente" em vez de "atualmente". As tabelas `events_waits_history` e `events_waits_history_long` contêm os 10 eventos mais recentes por thread e, respectivamente, os 10.000 eventos mais recentes. Por exemplo, para ver informações sobre eventos recentes produzidos pelo thread 13, faça o seguinte:

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

À medida que novos eventos são adicionados a uma tabela de histórico, os eventos mais antigos são descartados se a tabela estiver cheia.

As tabelas de resumo fornecem informações agregadas para todos os eventos ao longo do tempo. As tabelas deste grupo resumem os dados dos eventos de diferentes maneiras. Para ver quais instrumentos foram executados mais vezes ou tiveram mais tempo de espera, organize a tabela `events_waits_summary_global_by_event_name` na coluna `COUNT_STAR` ou `SUM_TIMER_WAIT`, que correspondem a um valor `COUNT(*)` ou `SUM(TIMER_WAIT)`, respectivamente, calculado para todos os eventos:

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

Esses resultados mostram que o mutex `THR_LOCK_malloc` é "quente", tanto em termos de quantas vezes ele é usado quanto do tempo que os threads esperam para adquiri-lo.

Nota

O mutex `THR_LOCK_malloc` é usado apenas em compilações de depuração. Em compilações de produção, ele não é usado porque não existe.

As tabelas de instâncias documentam quais tipos de objetos estão instrumentados. Um objeto instrumentado, quando utilizado pelo servidor, gera um evento. Essas tabelas fornecem nomes de eventos e notas explicativas ou informações de status. Por exemplo, a tabela `file_instances` lista as instâncias de instrumentos para operações de E/S de arquivos e seus arquivos associados:

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

As tabelas de configuração são usadas para configurar e exibir características de monitoramento. Por exemplo, `setup_instruments` lista o conjunto de instrumentos para os quais eventos podem ser coletados e mostra quais deles estão habilitados:

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

Para entender como interpretar os nomes dos instrumentos, consulte Seção 25.6, "Convenções de Nomenclatura de Instrumentos do Schema de Desempenho".

Para controlar se os eventos são coletados para um instrumento, defina o valor `ENABLED` para `YES` ou `NO`. Por exemplo:

```sql
mysql> UPDATE performance_schema.setup_instruments
       SET ENABLED = 'NO'
       WHERE NAME = 'wait/synch/mutex/sql/LOCK_mysql_create_db';
```

O Schema de Desempenho usa eventos coletados para atualizar tabelas no banco de dados `performance_schema`, que atuam como "consumidores" de informações de eventos. A tabela `setup_consumers` lista os consumidores disponíveis e quais estão habilitados:

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

Para controlar se o Schema de Desempenho mantém um consumidor como destino para as informações dos eventos, defina o valor `ENABLED`.

Para obter mais informações sobre as tabelas de configuração e como usá-las para controlar a coleta de eventos, consulte Seção 25.4.2, “Filtragem de Eventos do Schema de Desempenho”.

Existem algumas tabelas variadas que não se enquadram em nenhum dos grupos anteriores. Por exemplo, `performance_timers` lista os temporizadores de eventos disponíveis e suas características. Para informações sobre temporizadores, consulte Seção 25.4.1, “Temporização de Eventos do Schema de Desempenho”.
