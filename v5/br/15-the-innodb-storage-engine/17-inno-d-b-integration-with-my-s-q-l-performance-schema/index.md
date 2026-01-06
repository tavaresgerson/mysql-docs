## 14.17 Integração InnoDB com o MySQL Performance Schema

14.17.1 Monitoramento do progresso da alteração de tabelas do InnoDB usando o Gerenciador de Desempenho

14.17.2 Monitoramento de Espera de Mutex InnoDB Usando o Schema de Desempenho

Esta seção fornece uma breve introdução à integração do `InnoDB` com o SGBD de Desempenho. Para obter documentação abrangente sobre o SGBD de Desempenho, consulte o Capítulo 25, *MySQL Performance Schema*.

Você pode perfiliar certas operações internas do `InnoDB` usando o recurso do MySQL Performance Schema. Esse tipo de ajuste é principalmente para usuários experientes que avaliam estratégias de otimização para superar gargalos de desempenho. Os administradores de banco de dados também podem usar esse recurso para planejamento de capacidade, para ver se sua carga de trabalho típica encontra algum gargalo de desempenho com uma combinação específica de CPU, RAM e armazenamento em disco; e, se sim, para julgar se o desempenho pode ser melhorado aumentando a capacidade de alguma parte do sistema.

Para usar essa funcionalidade para examinar o desempenho do `InnoDB`:

- Você deve ter uma noção geral de como usar o recurso do Schema de Desempenho. Por exemplo, você deve saber como habilitar instrumentos e consumidores e como consultar as tabelas do `performance_schema` para recuperar dados. Para uma visão geral introdutória, consulte a Seção 25.1, “Início Rápido do Schema de Desempenho”.

- Você deve estar familiarizado com os instrumentos do Schema de Desempenho disponíveis para o `InnoDB`. Para visualizar os instrumentos relacionados ao `InnoDB`, você pode consultar a tabela `setup_instruments` para nomes de instrumentos que contenham `innodb`.

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

  Para obter informações adicionais sobre os objetos instrumentados do `InnoDB`, você pode consultar as tabelas das instâncias do Schema de Desempenho, que fornecem informações adicionais sobre os objetos instrumentados. As tabelas de instâncias relevantes para o `InnoDB` incluem:

  - A tabela `mutex_instances`
  - A tabela `rwlock_instances`
  - A tabela `cond_instances`
  - A tabela `file_instances`

  Nota

  Os mútuos e bloqueios de escrita-leitura relacionados ao pool de buffers do `InnoDB` não estão incluídos nesta cobertura; o mesmo se aplica ao resultado do comando `SHOW ENGINE INNODB MUTEX`.

  Por exemplo, para visualizar informações sobre objetos de arquivo instrumentados `InnoDB` vistos pelo Gerenciamento de Desempenho ao executar a instrumentação de E/S de arquivo, você pode emitir a seguinte consulta:

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

- Você deve estar familiarizado com as tabelas `performance_schema` que armazenam dados de eventos do `InnoDB`. As tabelas relevantes para eventos relacionados ao `InnoDB` incluem:

  - As tabelas de Eventos de Aguardar, que armazenam eventos de espera.

  - As tabelas de resumo, que fornecem informações agregadas para eventos terminados ao longo do tempo. As tabelas de resumo incluem tabelas de resumo de E/S de arquivos, que agregam informações sobre operações de E/S.

  - Tabelas de eventos de estágio, que armazenam dados de eventos para operações de `ALTER TABLE` e carregamento do pool de buffer do `InnoDB`. Para mais informações, consulte a Seção 14.17.1, “Monitoramento do progresso de ALTER TABLE para tabelas InnoDB usando o Gerenciador de Desempenho”, e Monitoramento do progresso de carregamento do pool de buffer usando o Gerenciador de Desempenho.

  Se você estiver interessado apenas nos objetos relacionados ao `InnoDB`, use a cláusula `WHERE EVENT_NAME LIKE '%innodb%'` ou `WHERE NAME LIKE '%innodb%'` (conforme necessário) ao fazer consultas nessas tabelas.
