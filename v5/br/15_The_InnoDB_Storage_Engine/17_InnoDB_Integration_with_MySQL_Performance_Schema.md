## 14.17 Integração InnoDB com o MySQL Performance Schema

Esta seção fornece uma breve introdução à integração do `InnoDB` com o Performance Schema. Para obter documentação abrangente sobre o Performance Schema, consulte o Capítulo 25, *MySQL Performance Schema*.

Você pode perfiliar determinadas operações internas do `InnoDB` usando o recurso do MySQL Performance Schema. Esse tipo de ajuste é principalmente para usuários experientes que avaliam estratégias de otimização para superar gargalos de desempenho. Os DBAs também podem usar esse recurso para planejamento de capacidade, para ver se sua carga de trabalho típica encontra algum gargalo de desempenho com uma combinação específica de CPU, RAM e armazenamento em disco; e, se assim for, para julgar se o desempenho pode ser melhorado aumentando a capacidade de alguma parte do sistema.

Para usar este recurso para examinar o desempenho do `InnoDB`:

* Você deve estar familiarizado com o uso geral do recurso do Schema de Desempenho. Por exemplo, você deve saber como habilitar instrumentos e consumidores e como consultar as tabelas `performance_schema` para recuperar dados. Para uma visão geral introdutória, consulte a Seção 25.1, “Início Rápido do Schema de Desempenho”.

* Você deve estar familiarizado com os instrumentos do Schema de Desempenho disponíveis para `InnoDB`. Para visualizar os instrumentos relacionados ao `InnoDB`, você pode consultar a tabela `setup_instruments` para nomes de instrumentos que contenham '`innodb`'.

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

Para obter informações adicionais sobre os objetos instrumentados `InnoDB`, você pode consultar as tabelas das instâncias do Schema de Desempenho, que fornecem informações adicionais sobre os objetos instrumentados. As tabelas de instância relevantes para `InnoDB` incluem:

+ A tabela `mutex_instances`
+ A tabela `rwlock_instances`
+ A tabela `cond_instances`
+ A tabela `file_instances`

Nota

Os mutexes e bloqueios de escrita relacionados ao conjunto de buffers `InnoDB` não estão incluídos nesta cobertura; o mesmo se aplica à saída do comando `SHOW ENGINE INNODB MUTEX`.

Por exemplo, para visualizar informações sobre os objetos de arquivo instrumentados `InnoDB` vistos pelo Schema de Desempenho ao executar a instrumentação de E/S de arquivo, você pode emitir a seguinte consulta:

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

* Você deve estar familiarizado com as tabelas `performance_schema` que armazenam dados de eventos `InnoDB`. As tabelas relevantes para eventos relacionados a `InnoDB` incluem:

+ As tabelas de eventos de espera, que armazenam eventos de espera.

+ As tabelas de resumo, que fornecem informações agregadas para eventos terminados ao longo do tempo. As tabelas de resumo incluem tabelas de resumo de E/S de arquivo, que agregam informações sobre operações de E/S.

Tabelas de eventos em estágio, que armazenam dados de eventos para `InnoDB` `ALTER TABLE` e operações de carga do pool de buffer. Para mais informações, consulte a Seção 14.17.1, “Monitoramento do progresso da ALTER TABLE para tabelas InnoDB usando o Gerador de desempenho”, e Monitoramento do progresso da carga do pool de buffer usando o Gerador de desempenho.

Se você está interessado apenas em objetos relacionados ao `InnoDB`, use a cláusula `WHERE EVENT_NAME LIKE '%innodb%'` ou `WHERE NAME LIKE '%innodb%'` (conforme necessário) ao fazer consultas nessas tabelas.

### 14.17.1 Monitoramento do progresso da ALTER TABLE para tabelas InnoDB usando o Gerador de desempenho

Você pode monitorar o progresso do `ALTER TABLE` para as tabelas do `InnoDB` usando o Gerador de Desempenho.

Existem sete eventos de estágio que representam diferentes fases do `ALTER TABLE`. Cada evento de estágio reporta um total em andamento de `WORK_COMPLETED` e `WORK_ESTIMATED` para a operação geral de `ALTER TABLE` à medida que ela progride em suas diferentes fases. `WORK_ESTIMATED` é calculado usando uma fórmula que leva em consideração todo o trabalho que o `ALTER TABLE` realiza, e pode ser revisado durante o processamento de `ALTER TABLE`. Os valores de `WORK_COMPLETED` e `WORK_ESTIMATED` são uma representação abstrata de todo o trabalho realizado pelo `ALTER TABLE`.

Em ordem de ocorrência, os eventos do estágio `ALTER TABLE` incluem:

* `stage/innodb/alter table (read PK and internal sort)`: Esta etapa é ativa quando `ALTER TABLE` está na fase de leitura de chave primária. Ela começa com `WORK_COMPLETED=0` e `WORK_ESTIMATED` definidos para o número estimado de páginas na chave primária. Quando a etapa é concluída, `WORK_ESTIMATED` é atualizado para o número real de páginas na chave primária.

* `stage/innodb/alter table (merge sort)`: Esta etapa é repetida para cada índice adicionado pela operação `ALTER TABLE`.

* `stage/innodb/alter table (insert)`: Esta etapa é repetida para cada índice adicionado pela operação `ALTER TABLE`.

* `stage/innodb/alter table (log apply index)`: Esta etapa inclui a aplicação do log de DML gerado enquanto o `ALTER TABLE` estava em execução.

* `stage/innodb/alter table (flush)`: Antes que esta etapa comece, `WORK_ESTIMATED` é atualizado com uma estimativa mais precisa, com base na extensão da lista de limpeza.

* `stage/innodb/alter table (log apply table)`: Esta etapa inclui a aplicação do registro DML concorrente gerado enquanto o `ALTER TABLE` estava em execução. A duração desta fase depende da extensão das alterações na tabela. Esta fase é instantânea se nenhuma DML concorrente foi executada na tabela.

* `stage/innodb/alter table (end)`: Inclui qualquer trabalho restante que apareceu após a fase de limpeza, como a reexecução de DML que foi executada na tabela enquanto o `ALTER TABLE` estava em execução.

Nota

Os eventos de estágio `InnoDB` e `ALTER TABLE` atualmente não incluem a adição de índices espaciais.

#### ALTER TABLE Exemplo de Monitoramento Usando o Gerador de Desempenho

O exemplo a seguir demonstra como habilitar os instrumentos de eventos de estágio `stage/innodb/alter table%` e as tabelas de consumo relacionadas para monitorar o progresso do `ALTER TABLE`. Para informações sobre os instrumentos de eventos de estágio do Schema de Desempenho e os consumidores relacionados, consulte a Seção 25.12.5, “Tabelas de Eventos de Estágio do Schema de Desempenho”.

1. Ative os instrumentos `stage/innodb/alter%`:

   ```sql
   mysql> UPDATE performance_schema.setup_instruments
          SET ENABLED = 'YES'
          WHERE NAME LIKE 'stage/innodb/alter%';
   Query OK, 7 rows affected (0.00 sec)
   Rows matched: 7  Changed: 7  Warnings: 0
   ```

2. Ative as tabelas de consumo de eventos de estágio, que incluem `events_stages_current`, `events_stages_history` e `events_stages_history_long`.

   ```sql
   mysql> UPDATE performance_schema.setup_consumers
          SET ENABLED = 'YES'
          WHERE NAME LIKE '%stages%';
   Query OK, 3 rows affected (0.00 sec)
   Rows matched: 3  Changed: 3  Warnings: 0
   ```

3. Execute uma operação `ALTER TABLE`. Neste exemplo, uma coluna `middle_name` é adicionada à tabela de funcionários do banco de dados de amostra de funcionários.

   ```sql
   mysql> ALTER TABLE employees.employees ADD COLUMN middle_name varchar(14) AFTER first_name;
   Query OK, 0 rows affected (9.27 sec)
   Records: 0  Duplicates: 0  Warnings: 0
   ```

4. Verifique o progresso da operação `ALTER TABLE` consultando a tabela do Schema de Desempenho `events_stages_current`. O evento de estágio mostrado difere dependendo da fase `ALTER TABLE` que está atualmente em progresso. A coluna `WORK_COMPLETED` mostra o trabalho concluído. A coluna `WORK_ESTIMATED` fornece uma estimativa do trabalho restante.

   ```sql
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED
          FROM performance_schema.events_stages_current;
   +------------------------------------------------------+----------------+----------------+
   | EVENT_NAME                                           | WORK_COMPLETED | WORK_ESTIMATED |
   +------------------------------------------------------+----------------+----------------+
   | stage/innodb/alter table (read PK and internal sort) |            280 |           1245 |
   +------------------------------------------------------+----------------+----------------+
   1 row in set (0.01 sec)
   ```

A tabela `events_stages_current` retorna um conjunto vazio se a operação `ALTER TABLE` tiver sido concluída. Nesse caso, você pode verificar a tabela `events_stages_history` para visualizar os dados do evento da operação concluída. Por exemplo:

   ```sql
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED
          FROM performance_schema.events_stages_history;
   +------------------------------------------------------+----------------+----------------+
   | EVENT_NAME                                           | WORK_COMPLETED | WORK_ESTIMATED |
   +------------------------------------------------------+----------------+----------------+
   | stage/innodb/alter table (read PK and internal sort) |            886 |           1213 |
   | stage/innodb/alter table (flush)                     |           1213 |           1213 |
   | stage/innodb/alter table (log apply table)           |           1597 |           1597 |
   | stage/innodb/alter table (end)                       |           1597 |           1597 |
   | stage/innodb/alter table (log apply table)           |           1981 |           1981 |
   +------------------------------------------------------+----------------+----------------+
   5 rows in set (0.00 sec)
   ```

Como mostrado acima, o valor `WORK_ESTIMATED` foi revisado durante o processamento do `ALTER TABLE`. O trabalho estimado após a conclusão da etapa inicial é

1213. Quando o processamento de `ALTER TABLE` foi concluído, `WORK_ESTIMATED` foi definido pelo valor real, que é 1981.

### 14.17.2 Monitoramento das esperas de InnoDB Mutex usando o Gerador de Desempenho

Um mutex é um mecanismo de sincronização usado no código para garantir que apenas um thread, em um determinado momento, possa ter acesso a um recurso comum. Quando dois ou mais threads que estão executando no servidor precisam acessar o mesmo recurso, as threads competem entre si. O primeiro thread que obtém um bloqueio no mutex faz com que os outros threads achem em espera até que o bloqueio seja liberado.

Para os mutexes instrumentados do `InnoDB`, as espera dos mutexes podem ser monitoradas usando o Schema de Desempenho. Os dados de eventos de espera coletados nas tabelas do Schema de Desempenho podem ajudar a identificar os mutexes com o maior número de espera ou o maior tempo total de espera, por exemplo.

O exemplo a seguir demonstra como habilitar os instrumentos de espera do mutex `InnoDB`, como habilitar os consumidores associados e como consultar os dados do evento de espera.

1. Para visualizar os instrumentos de espera de mutex disponíveis `InnoDB`, consulte a tabela do Schema de Desempenho `setup_instruments`, conforme mostrado abaixo. Todos os instrumentos de espera de mutex `InnoDB` são desativados por padrão.

   ```sql
   mysql> SELECT *
          FROM performance_schema.setup_instruments
          WHERE NAME LIKE '%wait/synch/mutex/innodb%';
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
   | wait/synch/mutex/innodb/fil_system_mutex              | NO      | NO    |
   | wait/synch/mutex/innodb/flush_list_mutex              | NO      | NO    |
   | wait/synch/mutex/innodb/fts_bg_threads_mutex          | NO      | NO    |
   | wait/synch/mutex/innodb/fts_delete_mutex              | NO      | NO    |
   | wait/synch/mutex/innodb/fts_optimize_mutex            | NO      | NO    |
   | wait/synch/mutex/innodb/fts_doc_id_mutex              | NO      | NO    |
   | wait/synch/mutex/innodb/log_flush_order_mutex         | NO      | NO    |
   | wait/synch/mutex/innodb/hash_table_mutex              | NO      | NO    |
   | wait/synch/mutex/innodb/ibuf_bitmap_mutex             | NO      | NO    |
   | wait/synch/mutex/innodb/ibuf_mutex                    | NO      | NO    |
   | wait/synch/mutex/innodb/ibuf_pessimistic_insert_mutex | NO      | NO    |
   | wait/synch/mutex/innodb/log_sys_mutex                 | NO      | NO    |
   | wait/synch/mutex/innodb/page_zip_stat_per_index_mutex | NO      | NO    |
   | wait/synch/mutex/innodb/purge_sys_pq_mutex            | NO      | NO    |
   | wait/synch/mutex/innodb/recv_sys_mutex                | NO      | NO    |
   | wait/synch/mutex/innodb/recv_writer_mutex             | NO      | NO    |
   | wait/synch/mutex/innodb/redo_rseg_mutex               | NO      | NO    |
   | wait/synch/mutex/innodb/noredo_rseg_mutex             | NO      | NO    |
   | wait/synch/mutex/innodb/rw_lock_list_mutex            | NO      | NO    |
   | wait/synch/mutex/innodb/rw_lock_mutex                 | NO      | NO    |
   | wait/synch/mutex/innodb/srv_dict_tmpfile_mutex        | NO      | NO    |
   | wait/synch/mutex/innodb/srv_innodb_monitor_mutex      | NO      | NO    |
   | wait/synch/mutex/innodb/srv_misc_tmpfile_mutex        | NO      | NO    |
   | wait/synch/mutex/innodb/srv_monitor_file_mutex        | NO      | NO    |
   | wait/synch/mutex/innodb/buf_dblwr_mutex               | NO      | NO    |
   | wait/synch/mutex/innodb/trx_undo_mutex                | NO      | NO    |
   | wait/synch/mutex/innodb/trx_pool_mutex                | NO      | NO    |
   | wait/synch/mutex/innodb/trx_pool_manager_mutex        | NO      | NO    |
   | wait/synch/mutex/innodb/srv_sys_mutex                 | NO      | NO    |
   | wait/synch/mutex/innodb/lock_mutex                    | NO      | NO    |
   | wait/synch/mutex/innodb/lock_wait_mutex               | NO      | NO    |
   | wait/synch/mutex/innodb/trx_mutex                     | NO      | NO    |
   | wait/synch/mutex/innodb/srv_threads_mutex             | NO      | NO    |
   | wait/synch/mutex/innodb/rtr_active_mutex              | NO      | NO    |
   | wait/synch/mutex/innodb/rtr_match_mutex               | NO      | NO    |
   | wait/synch/mutex/innodb/rtr_path_mutex                | NO      | NO    |
   | wait/synch/mutex/innodb/rtr_ssn_mutex                 | NO      | NO    |
   | wait/synch/mutex/innodb/trx_sys_mutex                 | NO      | NO    |
   | wait/synch/mutex/innodb/zip_pad_mutex                 | NO      | NO    |
   +-------------------------------------------------------+---------+-------+
   49 rows in set (0.02 sec)
   ```

2. Algumas instâncias do mutex `InnoDB` são criadas no início do servidor e são instrumentadas apenas se o instrumento associado também estiver habilitado no início do servidor. Para garantir que todas as instâncias do mutex `InnoDB` sejam instrumentadas e habilitadas, adicione a seguinte regra `performance-schema-instrument` ao seu arquivo de configuração do MySQL:

   ```sql
   performance-schema-instrument='wait/synch/mutex/innodb/%=ON'
   ```

Se você não precisa de dados de eventos de espera para todos os `InnoDB` mutantes, você pode desabilitar instrumentos específicos adicionando regras adicionais de `performance-schema-instrument` ao seu arquivo de configuração do MySQL. Por exemplo, para desabilitar os instrumentos de eventos de espera de `InnoDB` relacionados à pesquisa de texto completo, adicione a seguinte regra:

   ```sql
   performance-schema-instrument='wait/synch/mutex/innodb/fts%=OFF'
   ```

Nota

As regras com um prefixo mais longo, como `wait/synch/mutex/innodb/fts%`, têm precedência sobre as regras com prefixos mais curtos, como `wait/synch/mutex/innodb/%`.

Depois de adicionar as regras `performance-schema-instrument` ao seu arquivo de configuração, reinicie o servidor. Todos os mutxes `InnoDB`, exceto aqueles relacionados à pesquisa de texto completo, estão habilitados. Para verificar, consulte a tabela `setup_instruments`. As colunas `ENABLED` e `TIMED` devem ser definidas como `YES` para os instrumentos que você habilitou.

   ```sql
   mysql> SELECT *
          FROM performance_schema.setup_instruments
          WHERE NAME LIKE '%wait/synch/mutex/innodb%';
   +-------------------------------------------------------+---------+-------+
   | NAME                                                  | ENABLED | TIMED |
   +-------------------------------------------------------+---------+-------+
   | wait/synch/mutex/innodb/commit_cond_mutex             | YES     | YES   |
   | wait/synch/mutex/innodb/innobase_share_mutex          | YES     | YES   |
   | wait/synch/mutex/innodb/autoinc_mutex                 | YES     | YES   |
   ...
   | wait/synch/mutex/innodb/zip_pad_mutex                 | YES     | YES   |
   +-------------------------------------------------------+---------+-------+
   49 rows in set (0.00 sec)
   ```

3. Ative os consumidores de eventos de espera atualizando a tabela `setup_consumers`. Os consumidores de eventos de espera são desativados por padrão.

   ```sql
   mysql> UPDATE performance_schema.setup_consumers
          SET enabled = 'YES'
          WHERE name like 'events_waits%';
   Query OK, 3 rows affected (0.00 sec)
   Rows matched: 3  Changed: 3  Warnings: 0
   ```

Você pode verificar se os consumidores de eventos de espera estão habilitados consultando a tabela `setup_consumers`. Os consumidores `events_waits_current`, `events_waits_history` e `events_waits_history_long` devem estar habilitados.

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
   | events_transactions_current      | YES     |
   | events_transactions_history      | YES     |
   | events_transactions_history_long | NO      |
   | events_waits_current             | YES     |
   | events_waits_history             | YES     |
   | events_waits_history_long        | YES     |
   | global_instrumentation           | YES     |
   | thread_instrumentation           | YES     |
   | statements_digest                | YES     |
   +----------------------------------+---------+
   15 rows in set (0.00 sec)
   ```

4. Uma vez que os instrumentos e os consumidores estejam habilitados, execute a carga de trabalho que você deseja monitorar. Neste exemplo, o cliente de emulação de carga **mysqlslap** é usado para simular uma carga de trabalho.

   ```sql
   $> ./mysqlslap --auto-generate-sql --concurrency=100 --iterations=10
          --number-of-queries=1000 --number-char-cols=6 --number-int-cols=6;
   ```

5. Consultar os dados do evento de espera. Neste exemplo, os dados do evento de espera são consultados da tabela `events_waits_summary_global_by_event_name`, que agrega dados encontrados nas tabelas `events_waits_current`, `events_waits_history` e `events_waits_history_long`. Os dados são resumidos por nome do evento (`EVENT_NAME`), que é o nome do instrumento que produziu o evento. Os dados resumidos incluem:

* `COUNT_STAR`

O número de eventos de espera resumidos.

* `SUM_TIMER_WAIT`

O tempo total de espera dos eventos de espera cronometrada resumidos.

* `MIN_TIMER_WAIT`

O tempo mínimo de espera dos eventos de espera cronometrada resumidos.

* `AVG_TIMER_WAIT`

O tempo médio de espera dos eventos de espera cronometrada resumidos.

* `MAX_TIMER_WAIT`

O tempo máximo de espera dos eventos de espera cronometrada resumidos.

A seguinte consulta retorna o nome do instrumento (`EVENT_NAME`), o número de eventos de espera (`COUNT_STAR`), e o tempo total de espera para os eventos desse instrumento (`SUM_TIMER_WAIT`). Como as esperas são temporizadas em picosegundos (trilhões de um segundo) por padrão, os tempos de espera são divididos por 1000000000 para mostrar os tempos de espera em milissegundos. Os dados são apresentados em ordem decrescente, pelo número de eventos de espera resumidos (`COUNT_STAR`). Você pode ajustar a cláusula `ORDER BY` para ordenar os dados pelo tempo total de espera.

   ```sql
   mysql> SELECT EVENT_NAME, COUNT_STAR, SUM_TIMER_WAIT/1000000000 SUM_TIMER_WAIT_MS
          FROM performance_schema.events_waits_summary_global_by_event_name
          WHERE SUM_TIMER_WAIT > 0 AND EVENT_NAME LIKE 'wait/synch/mutex/innodb/%'
          ORDER BY COUNT_STAR DESC;
   +--------------------------------------------------+------------+-------------------+
   | EVENT_NAME                                       | COUNT_STAR | SUM_TIMER_WAIT_MS |
   +--------------------------------------------------+------------+-------------------+
   | wait/synch/mutex/innodb/os_mutex                 |      78831 |           10.3283 |
   | wait/synch/mutex/innodb/log_sys_mutex            |      41488 |         6510.3233 |
   | wait/synch/mutex/innodb/trx_sys_mutex            |      29770 |         1107.9687 |
   | wait/synch/mutex/innodb/lock_mutex               |      24212 |          104.0724 |
   | wait/synch/mutex/innodb/trx_mutex                |      22756 |            1.9421 |
   | wait/synch/mutex/innodb/rseg_mutex               |      20333 |            3.6220 |
   | wait/synch/mutex/innodb/dict_sys_mutex           |      13422 |            2.2284 |
   | wait/synch/mutex/innodb/mutex_list_mutex         |      12694 |          344.1164 |
   | wait/synch/mutex/innodb/fil_system_mutex         |       9208 |            0.9542 |
   | wait/synch/mutex/innodb/rw_lock_list_mutex       |       8304 |            0.1794 |
   | wait/synch/mutex/innodb/trx_undo_mutex           |       6190 |            0.6801 |
   | wait/synch/mutex/innodb/buf_pool_mutex           |       2869 |           29.4623 |
   | wait/synch/mutex/innodb/innobase_share_mutex     |       2005 |            0.1349 |
   | wait/synch/mutex/innodb/flush_list_mutex         |       1274 |            0.1300 |
   | wait/synch/mutex/innodb/file_format_max_mutex    |       1016 |            0.0469 |
   | wait/synch/mutex/innodb/purge_sys_bh_mutex       |       1004 |            0.0326 |
   | wait/synch/mutex/innodb/buf_dblwr_mutex          |        640 |            0.0437 |
   | wait/synch/mutex/innodb/log_flush_order_mutex    |        437 |            0.0510 |
   | wait/synch/mutex/innodb/recv_sys_mutex           |        394 |            0.0202 |
   | wait/synch/mutex/innodb/srv_sys_mutex            |        169 |            0.5259 |
   | wait/synch/mutex/innodb/lock_wait_mutex          |        154 |            0.1172 |
   | wait/synch/mutex/innodb/ibuf_mutex               |          9 |            0.0027 |
   | wait/synch/mutex/innodb/srv_innodb_monitor_mutex |          2 |            0.0009 |
   | wait/synch/mutex/innodb/ut_list_mutex            |          1 |            0.0001 |
   | wait/synch/mutex/innodb/recv_writer_mutex        |          1 |            0.0005 |
   +--------------------------------------------------+------------+-------------------+
   25 rows in set (0.01 sec)
   ```

Nota

O conjunto de resultados anterior inclui dados de eventos de espera produzidos durante o processo de inicialização. Para excluir esses dados, você pode truncar a tabela `events_waits_summary_global_by_event_name` imediatamente após a inicialização e antes de executar sua carga de trabalho. No entanto, a própria operação de truncar pode produzir uma quantidade negligenciável de dados de eventos de espera.

   ```sql
   mysql> TRUNCATE performance_schema.events_waits_summary_global_by_event_name;
   ```
