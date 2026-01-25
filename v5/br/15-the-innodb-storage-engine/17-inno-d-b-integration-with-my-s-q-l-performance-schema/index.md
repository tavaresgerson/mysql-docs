## 14.17 Integração do InnoDB com o Performance Schema do MySQL

14.17.1 Monitorando o Progresso de ALTER TABLE para Tabelas InnoDB Usando o Performance Schema

14.17.2 Monitorando Esperas de Mutex do InnoDB Usando o Performance Schema

Esta seção fornece uma breve introdução à integração do `InnoDB` com o Performance Schema. Para documentação abrangente do Performance Schema, consulte o Capítulo 25, *MySQL Performance Schema*.

Você pode fazer o profiling de certas operações internas do `InnoDB` usando o recurso MySQL Performance Schema. Este tipo de tuning é voltado principalmente para usuários especialistas que avaliam estratégias de otimização para superar bottlenecks de performance. DBAs também podem usar esse recurso para capacity planning, para verificar se sua workload típica encontra algum bottleneck de performance com uma combinação específica de CPU, RAM e armazenamento em disco; e, se sim, para avaliar se a performance pode ser melhorada aumentando a capacidade de alguma parte do sistema.

Para usar este recurso para examinar a performance do `InnoDB`:

* Você deve estar familiarizado em geral com o uso do recurso Performance Schema. Por exemplo, você deve saber como habilitar instruments e consumers, e como executar Query em tabelas `performance_schema` para recuperar dados. Para uma visão geral introdutória, consulte a Seção 25.1, “Performance Schema Quick Start”.

* Você deve estar familiarizado com os instruments do Performance Schema que estão disponíveis para o `InnoDB`. Para visualizar instruments relacionados ao `InnoDB`, você pode executar Query na tabela `setup_instruments` por nomes de instrument que contenham '`innodb`'.

  ```sql
  mysql> SELECT *
         FROM performance_schema.setup_instruments
         WHERE NAME LIKE '%innodb%';
  +-------------------------------------------------------+---------+-------+
  | NAME                                                  | ENABLED | TIMED |
  +-------------------------------------------------------+---------+-------+
  | wait/synch/mutex/innodb/commit_cond_mutex             | NO      | NO    |
  | wait/synch/mutex/innodb/innobase_share_mutex          | NO      | NO    |
  | wait/synch/mutex/innodb/autoinc_mutex                 | NO      | NO    |
  | wait/synch/mutex/innodb/buf_pool_mutex                | NO      | NO    |
  | wait/synch/mutex/innodb/buf_pool_zip_mutex            | NO      | NO    |
  | wait/synch/mutex/innodb/cache_last_read_mutex         | NO      | NO    |
  | wait/synch/mutex/innodb/dict_foreign_err_mutex        | NO      | NO    |
  | wait/synch/mutex/innodb/dict_sys_mutex                | NO      | NO    |
  | wait/synch/mutex/innodb/recalc_pool_mutex             | NO      | NO    |
  | wait/synch/mutex/innodb/file_format_max_mutex         | NO      | NO    |
  ...
  | wait/io/file/innodb/innodb_data_file                  | YES     | YES   |
  | wait/io/file/innodb/innodb_log_file                   | YES     | YES   |
  | wait/io/file/innodb/innodb_temp_file                  | YES     | YES   |
  | stage/innodb/alter table (end)                        | YES     | YES   |
  | stage/innodb/alter table (flush)                      | YES     | YES   |
  | stage/innodb/alter table (insert)                     | YES     | YES   |
  | stage/innodb/alter table (log apply index)            | YES     | YES   |
  | stage/innodb/alter table (log apply table)            | YES     | YES   |
  | stage/innodb/alter table (merge sort)                 | YES     | YES   |
  | stage/innodb/alter table (read PK and internal sort)  | YES     | YES   |
  | stage/innodb/buffer pool load                         | YES     | YES   |
  | memory/innodb/buf_buf_pool                            | NO      | NO    |
  | memory/innodb/dict_stats_bg_recalc_pool_t             | NO      | NO    |
  | memory/innodb/dict_stats_index_map_t                  | NO      | NO    |
  | memory/innodb/dict_stats_n_diff_on_level              | NO      | NO    |
  | memory/innodb/other                                   | NO      | NO    |
  | memory/innodb/row_log_buf                             | NO      | NO    |
  | memory/innodb/row_merge_sort                          | NO      | NO    |
  | memory/innodb/std                                     | NO      | NO    |
  | memory/innodb/sync_debug_latches                      | NO      | NO    |
  | memory/innodb/trx_sys_t::rw_trx_ids                   | NO      | NO    |
  ...
  +-------------------------------------------------------+---------+-------+
  155 rows in set (0.00 sec)
  ```

  Para informações adicionais sobre os objetos instrumentados do `InnoDB`, você pode executar Query nas tabelas de instâncias do Performance Schema, que fornecem informações adicionais sobre os objetos instrumentados. As tabelas de instâncias relevantes para o `InnoDB` incluem:

  + A tabela `mutex_instances`
  + A tabela `rwlock_instances`
  + A tabela `cond_instances`
  + A tabela `file_instances`

  Nota

  Mutexes e RW-locks relacionados ao Buffer Pool do `InnoDB` não estão incluídos nesta cobertura; o mesmo se aplica à saída do comando `SHOW ENGINE INNODB MUTEX`.

  Por exemplo, para visualizar informações sobre objetos de arquivo `InnoDB` instrumentados vistos pelo Performance Schema ao executar a instrumentação de I/O de arquivo, você pode emitir a seguinte Query:

  ```sql
  mysql> SELECT *
         FROM performance_schema.file_instances
         WHERE EVENT_NAME LIKE '%innodb%'\G
  *************************** 1. row ***************************
   FILE_NAME: /path/to/mysql-5.7/data/ibdata1
  EVENT_NAME: wait/io/file/innodb/innodb_data_file
  OPEN_COUNT: 3
  *************************** 2. row ***************************
   FILE_NAME: /path/to/mysql-5.7/data/ib_logfile0
  EVENT_NAME: wait/io/file/innodb/innodb_log_file
  OPEN_COUNT: 2
  *************************** 3. row ***************************
   FILE_NAME: /path/to/mysql-5.7/data/ib_logfile1
  EVENT_NAME: wait/io/file/innodb/innodb_log_file
  OPEN_COUNT: 2
  *************************** 4. row ***************************
   FILE_NAME: /path/to/mysql-5.7/data/mysql/engine_cost.ibd
  EVENT_NAME: wait/io/file/innodb/innodb_data_file
  OPEN_COUNT: 3
  ...
  ```

* Você deve estar familiarizado com as tabelas `performance_schema` que armazenam dados de eventos do `InnoDB`. As tabelas relevantes para eventos relacionados ao `InnoDB` incluem:

  + As tabelas Wait Event, que armazenam eventos de espera.

  + As tabelas Summary, que fornecem informações agregadas para eventos encerrados ao longo do tempo. As tabelas Summary incluem tabelas Summary de I/O de arquivo, que agregam informações sobre operações de I/O.

  + As tabelas Stage Event, que armazenam dados de eventos para operações `ALTER TABLE` do `InnoDB` e operações de load do Buffer Pool. Para mais informações, consulte a Seção 14.17.1, “Monitorando o Progresso de ALTER TABLE para Tabelas InnoDB Usando o Performance Schema”, e Monitorando o Progresso de Load do Buffer Pool Usando o Performance Schema.

  Se você estiver interessado apenas em objetos relacionados ao `InnoDB`, use a cláusula `WHERE EVENT_NAME LIKE '%innodb%'` ou `WHERE NAME LIKE '%innodb%'` (conforme necessário) ao executar Query nessas tabelas.