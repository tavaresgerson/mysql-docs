## 17.16 Integração do InnoDB com o MySQL Performance Schema

17.16.1 Monitoramento do progresso da alteração de tabela para tabelas InnoDB usando o Performance Schema

17.16.2 Monitoramento das esperas dos mutexes InnoDB usando o Performance Schema

Esta seção fornece uma breve introdução à integração do `InnoDB` com o Performance Schema. Para obter documentação abrangente do Performance Schema, consulte o Capítulo 29, *MySQL Performance Schema*.

Você pode perfiliar certas operações internas do `InnoDB` usando o recurso do MySQL Performance Schema. Esse tipo de ajuste é principalmente para usuários experientes que avaliam estratégias de otimização para superar gargalos de desempenho. Os DBAs também podem usar esse recurso para planejamento de capacidade, para ver se sua carga de trabalho típica encontra algum gargalo de desempenho com uma combinação particular de CPU, RAM e armazenamento em disco; e, se sim, para julgar se o desempenho pode ser melhorado aumentando a capacidade de alguma parte do sistema.

Para usar esse recurso para examinar o desempenho do `InnoDB`:

* Você deve estar geralmente familiarizado com como usar o recurso do Performance Schema. Por exemplo, você deve saber como habilitar instrumentos e consumidores e como consultar as tabelas do `performance_schema` para recuperar dados. Para uma visão geral introdutória, consulte a Seção 29.1, “Início Rápido do Performance Schema”.

* Você deve estar familiarizado com os instrumentos do Performance Schema disponíveis para o `InnoDB`. Para visualizar instrumentos relacionados ao `InnoDB`, você pode consultar a tabela `setup_instruments` para nomes de instrumentos que contenham `innodb'`.

  ```
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

  Para obter informações adicionais sobre os objetos `InnoDB` instrumentados, você pode consultar as tabelas de instâncias do Performance Schema, que fornecem informações adicionais sobre objetos instrumentados. As tabelas de instâncias relevantes para o `InnoDB` incluem:

As tabelas `mutex_instances`, `rwlock_instances` e `cond_instances`
As tabelas `file_instances`

Observação

Os mútuos e blocos de acesso de escrita relacionados ao pool de buffers do `InnoDB` não estão incluídos nesta cobertura; o mesmo se aplica ao resultado da instrução `SHOW ENGINE INNODB MUTEX`.

Por exemplo, para visualizar informações sobre objetos de arquivo instrumentados do `InnoDB` vistos pelo Schema de Desempenho ao executar a instrumentação de E/S de arquivo, você pode emitir a seguinte consulta:

```
  mysql> SELECT *
         FROM performance_schema.file_instances
         WHERE EVENT_NAME LIKE '%innodb%'\G
  *************************** 1. row ***************************
   FILE_NAME: /home/dtprice/mysql-9.5/data/ibdata1
  EVENT_NAME: wait/io/file/innodb/innodb_data_file
  OPEN_COUNT: 3
  *************************** 2. row ***************************
   FILE_NAME: /home/dtprice/mysql-9.5/data/#ib_16384_0.dblwr
  EVENT_NAME: wait/io/file/innodb/innodb_dblwr_file
  OPEN_COUNT: 2
  *************************** 3. row ***************************
   FILE_NAME: /home/dtprice/mysql-9.5/data/#ib_16384_1.dblwr
  EVENT_NAME: wait/io/file/mysql-9.5/innodb_dblwr_file
  OPEN_COUNT: 2
  ...
  ```

* Você deve estar familiarizado com as tabelas `performance_schema` que armazenam dados de eventos do `InnoDB`. As tabelas relevantes para eventos relacionados ao `InnoDB` incluem:

  + As tabelas de Eventos de Espera, que armazenam eventos de espera.

  + As tabelas de Resumo, que fornecem informações agregadas para eventos terminados ao longo do tempo. As tabelas de Resumo incluem tabelas de Resumo de E/S de Arquivo, que agregam informações sobre operações de E/S.

  + As tabelas de Eventos de Estágio, que armazenam dados de eventos para operações de `ALTER TABLE` e carregamento do pool de buffers do `InnoDB`. Para mais informações, consulte a Seção 17.16.1, “Monitoramento do Progresso de ALTER TABLE para Tabelas do InnoDB Usando o Schema de Desempenho” e Monitoramento do Progresso de Carregamento do Pool de Buffers Usando o Schema de Desempenho.

Se você estiver interessado apenas em objetos relacionados ao `InnoDB`, use a cláusula `WHERE EVENT_NAME LIKE '%innodb%'` ou `WHERE NAME LIKE '%innodb%'` (conforme necessário) ao fazer consultas nessas tabelas.