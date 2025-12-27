### 17.16.2 Monitoramento das Espera de Mutex do InnoDB Usando o Schema de Desempenho

Um mutex é um mecanismo de sincronização usado no código para garantir que apenas um thread, em um dado momento, possa ter acesso a um recurso comum. Quando dois ou mais threads estão executando no servidor e precisam acessar o mesmo recurso, os threads competem entre si. O primeiro thread a obter um bloqueio no mutex faz com que os outros threads esperem até que o bloqueio seja liberado.

Para mutexes `InnoDB` instrumentados, as espera de mutex podem ser monitoradas usando o Schema de Desempenho. Os dados de eventos de espera coletados nas tabelas do Schema de Desempenho podem ajudar a identificar mutexes com mais espera ou o maior tempo total de espera, por exemplo.

O exemplo a seguir demonstra como habilitar os instrumentos de espera de mutex do `InnoDB`, como habilitar os consumidores associados e como consultar os dados de eventos de espera.

1. Para visualizar os instrumentos de espera de mutex do `InnoDB` disponíveis, execute a consulta na tabela `setup_instruments` do Schema de Desempenho. Todos os instrumentos de espera de mutex `InnoDB` estão desabilitados por padrão.

   ```
   mysql> SELECT *
          FROM performance_schema.setup_instruments
          WHERE NAME LIKE '%wait/synch/mutex/innodb%';
   +---------------------------------------------------------+---------+-------+
   | NAME                                                    | ENABLED | TIMED |
   +---------------------------------------------------------+---------+-------+
   | wait/synch/mutex/innodb/commit_cond_mutex               | NO      | NO    |
   | wait/synch/mutex/innodb/innobase_share_mutex            | NO      | NO    |
   | wait/synch/mutex/innodb/autoinc_mutex                   | NO      | NO    |
   | wait/synch/mutex/innodb/autoinc_persisted_mutex         | NO      | NO    |
   | wait/synch/mutex/innodb/buf_pool_flush_state_mutex      | NO      | NO    |
   | wait/synch/mutex/innodb/buf_pool_LRU_list_mutex         | NO      | NO    |
   | wait/synch/mutex/innodb/buf_pool_free_list_mutex        | NO      | NO    |
   | wait/synch/mutex/innodb/buf_pool_zip_free_mutex         | NO      | NO    |
   | wait/synch/mutex/innodb/buf_pool_zip_hash_mutex         | NO      | NO    |
   | wait/synch/mutex/innodb/buf_pool_zip_mutex              | NO      | NO    |
   | wait/synch/mutex/innodb/cache_last_read_mutex           | NO      | NO    |
   | wait/synch/mutex/innodb/dict_foreign_err_mutex          | NO      | NO    |
   | wait/synch/mutex/innodb/dict_persist_dirty_tables_mutex | NO      | NO    |
   | wait/synch/mutex/innodb/dict_sys_mutex                  | NO      | NO    |
   | wait/synch/mutex/innodb/recalc_pool_mutex               | NO      | NO    |
   | wait/synch/mutex/innodb/fil_system_mutex                | NO      | NO    |
   | wait/synch/mutex/innodb/flush_list_mutex                | NO      | NO    |
   | wait/synch/mutex/innodb/fts_bg_threads_mutex            | NO      | NO    |
   | wait/synch/mutex/innodb/fts_delete_mutex                | NO      | NO    |
   | wait/synch/mutex/innodb/fts_optimize_mutex              | NO      | NO    |
   | wait/synch/mutex/innodb/fts_doc_id_mutex                | NO      | NO    |
   | wait/synch/mutex/innodb/log_flush_order_mutex           | NO      | NO    |
   | wait/synch/mutex/innodb/hash_table_mutex                | NO      | NO    |
   | wait/synch/mutex/innodb/ibuf_bitmap_mutex               | NO      | NO    |
   | wait/synch/mutex/innodb/ibuf_mutex                      | NO      | NO    |
   | wait/synch/mutex/innodb/ibuf_pessimistic_insert_mutex   | NO      | NO    |
   | wait/synch/mutex/innodb/log_sys_mutex                   | NO      | NO    |
   | wait/synch/mutex/innodb/log_sys_write_mutex             | NO      | NO    |
   | wait/synch/mutex/innodb/mutex_list_mutex                | NO      | NO    |
   | wait/synch/mutex/innodb/page_zip_stat_per_index_mutex   | NO      | NO    |
   | wait/synch/mutex/innodb/purge_sys_pq_mutex              | NO      | NO    |
   | wait/synch/mutex/innodb/recv_sys_mutex                  | NO      | NO    |
   | wait/synch/mutex/innodb/recv_writer_mutex               | NO      | NO    |
   | wait/synch/mutex/innodb/redo_rseg_mutex                 | NO      | NO    |
   | wait/synch/mutex/innodb/noredo_rseg_mutex               | NO      | NO    |
   | wait/synch/mutex/innodb/rw_lock_list_mutex              | NO      | NO    |
   | wait/synch/mutex/innodb/rw_lock_mutex                   | NO      | NO    |
   | wait/synch/mutex/innodb/srv_dict_tmpfile_mutex          | NO      | NO    |
   | wait/synch/mutex/innodb/srv_innodb_monitor_mutex        | NO      | NO    |
   | wait/synch/mutex/innodb/srv_misc_tmpfile_mutex          | NO      | NO    |
   | wait/synch/mutex/innodb/srv_monitor_file_mutex          | NO      | NO    |
   | wait/synch/mutex/innodb/buf_dblwr_mutex                 | NO      | NO    |
   | wait/synch/mutex/innodb/trx_undo_mutex                  | NO      | NO    |
   | wait/synch/mutex/innodb/trx_pool_mutex                  | NO      | NO    |
   | wait/synch/mutex/innodb/trx_pool_manager_mutex          | NO      | NO    |
   | wait/synch/mutex/innodb/srv_sys_mutex                   | NO      | NO    |
   | wait/synch/mutex/innodb/lock_mutex                      | NO      | NO    |
   | wait/synch/mutex/innodb/lock_wait_mutex                 | NO      | NO    |
   | wait/synch/mutex/innodb/trx_mutex                       | NO      | NO    |
   | wait/synch/mutex/innodb/srv_threads_mutex               | NO      | NO    |
   | wait/synch/mutex/innodb/rtr_active_mutex                | NO      | NO    |
   | wait/synch/mutex/innodb/rtr_match_mutex                 | NO      | NO    |
   | wait/synch/mutex/innodb/rtr_path_mutex                  | NO      | NO    |
   | wait/synch/mutex/innodb/rtr_ssn_mutex                   | NO      | NO    |
   | wait/synch/mutex/innodb/trx_sys_mutex                   | NO      | NO    |
   | wait/synch/mutex/innodb/zip_pad_mutex                   | NO      | NO    |
   | wait/synch/mutex/innodb/master_key_id_mutex             | NO      | NO    |
   +---------------------------------------------------------+---------+-------+
   ```

2. Algumas instâncias de mutex `InnoDB` são criadas no início do servidor e só são instrumentadas se o instrumento associado também estiver habilitado no início do servidor. Para garantir que todas as instâncias de mutex `InnoDB` estejam instrumentadas e habilitadas, adicione a seguinte regra `performance-schema-instrument` ao seu arquivo de configuração do MySQL:

   ```
   performance-schema-instrument='wait/synch/mutex/innodb/%=ON'
   ```

   Se você não precisar dos dados de eventos de espera para todos os mutexes `InnoDB`, pode desabilitar instrumentos específicos adicionando regras adicionais `performance-schema-instrument` ao seu arquivo de configuração do MySQL. Por exemplo, para desabilitar os instrumentos de evento de espera do mutex `InnoDB` relacionados à pesquisa full-text, adicione a seguinte regra:

   ```
   performance-schema-instrument='wait/synch/mutex/innodb/fts%=OFF'
   ```

   Observação

As regras com um prefixo mais longo, como `wait/synch/mutex/innodb/fts%`, têm precedência sobre regras com prefixos mais curtos, como `wait/synch/mutex/innodb/%`.

Após adicionar as regras do `performance-schema-instrument` ao seu arquivo de configuração, reinicie o servidor. Todos os mutexes do `InnoDB`, exceto aqueles relacionados à pesquisa de texto completo, estão habilitados. Para verificar, execute uma consulta na tabela `setup_instruments`. As colunas `ENABLED` e `TIMED` devem estar definidas como `YES` para os instrumentos que você habilitou.

```
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
   | wait/synch/mutex/innodb/master_key_id_mutex           | YES     | YES   |
   +-------------------------------------------------------+---------+-------+
   49 rows in set (0.00 sec)
   ```

3. Habilite os consumidores de eventos de espera atualizando a tabela `setup_consumers`. Os consumidores de eventos de espera são desabilitados por padrão.

```
   mysql> UPDATE performance_schema.setup_consumers
          SET enabled = 'YES'
          WHERE name like 'events_waits%';
   Query OK, 3 rows affected (0.00 sec)
   Rows matched: 3  Changed: 3  Warnings: 0
   ```

Você pode verificar se os consumidores de eventos de espera estão habilitados executando uma consulta na tabela `setup_consumers`. Os consumidores `events_waits_current`, `events_waits_history` e `events_waits_history_long` devem estar habilitados.

```
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

4. Uma vez que os instrumentos e consumidores estejam habilitados, execute a carga de trabalho que você deseja monitorar. Neste exemplo, o cliente de emulação de carga de trabalho **mysqlslap** é usado para simular uma carga de trabalho.

```
   $> ./mysqlslap --auto-generate-sql --concurrency=100 --iterations=10
          --number-of-queries=1000 --number-char-cols=6 --number-int-cols=6;
   ```

5. Execute os dados do evento de espera. Neste exemplo, os dados do evento de espera são obtidos da tabela `events_waits_summary_global_by_event_name`, que agrega dados encontrados nas tabelas `events_waits_current`, `events_waits_history` e `events_waits_history_long`. Os dados são resumidos pelo nome do evento (`EVENT_NAME`), que é o nome do instrumento que produziu o evento. Os dados resumidos incluem:

   * `COUNT_STAR`

     O número de eventos de espera resumidos.

   * `SUM_TIMER_WAIT`

     O tempo total de espera dos eventos de espera resumidos com temporização.

   * `MIN_TIMER_WAIT`

     O tempo mínimo de espera dos eventos de espera resumidos com temporização.

   * `AVG_TIMER_WAIT`

     O tempo médio de espera dos eventos de espera resumidos com temporização.

* `MAX_TIMER_WAIT`

O tempo máximo de espera dos eventos de espera temporizada resumidos.

A consulta a seguir retorna o nome do instrumento (`EVENT_NAME`), o número de eventos de espera (`COUNT_STAR`) e o tempo total de espera para os eventos desse instrumento (`SUM_TIMER_WAIT`). Como as esperas são temporizadas em picosegundos (trilhésimos de segundo) por padrão, os tempos de espera são divididos por 1.000.000.000 para mostrar os tempos de espera em milissegundos. Os dados são apresentados em ordem decrescente, pelo número de eventos de espera resumidos (`COUNT_STAR`). Você pode ajustar a cláusula `ORDER BY` para ordenar os dados pelo tempo total de espera.

```
   mysql> SELECT EVENT_NAME, COUNT_STAR, SUM_TIMER_WAIT/1000000000 SUM_TIMER_WAIT_MS
          FROM performance_schema.events_waits_summary_global_by_event_name
          WHERE SUM_TIMER_WAIT > 0 AND EVENT_NAME LIKE 'wait/synch/mutex/innodb/%'
          ORDER BY COUNT_STAR DESC;
   +---------------------------------------------------------+------------+-------------------+
   | EVENT_NAME                                              | COUNT_STAR | SUM_TIMER_WAIT_MS |
   +---------------------------------------------------------+------------+-------------------+
   | wait/synch/mutex/innodb/trx_mutex                       |     201111 |           23.4719 |
   | wait/synch/mutex/innodb/fil_system_mutex                |      62244 |            9.6426 |
   | wait/synch/mutex/innodb/redo_rseg_mutex                 |      48238 |            3.1135 |
   | wait/synch/mutex/innodb/log_sys_mutex                   |      46113 |            2.0434 |
   | wait/synch/mutex/innodb/trx_sys_mutex                   |      35134 |         1068.1588 |
   | wait/synch/mutex/innodb/lock_mutex                      |      34872 |         1039.2589 |
   | wait/synch/mutex/innodb/log_sys_write_mutex             |      17805 |         1526.0490 |
   | wait/synch/mutex/innodb/dict_sys_mutex                  |      14912 |         1606.7348 |
   | wait/synch/mutex/innodb/trx_undo_mutex                  |      10634 |            1.1424 |
   | wait/synch/mutex/innodb/rw_lock_list_mutex              |       8538 |            0.1960 |
   | wait/synch/mutex/innodb/buf_pool_free_list_mutex        |       5961 |            0.6473 |
   | wait/synch/mutex/innodb/trx_pool_mutex                  |       4885 |         8821.7496 |
   | wait/synch/mutex/innodb/buf_pool_LRU_list_mutex         |       4364 |            0.2077 |
   | wait/synch/mutex/innodb/innobase_share_mutex            |       3212 |            0.2650 |
   | wait/synch/mutex/innodb/flush_list_mutex                |       3178 |            0.2349 |
   | wait/synch/mutex/innodb/trx_pool_manager_mutex          |       2495 |            0.1310 |
   | wait/synch/mutex/innodb/buf_pool_flush_state_mutex      |       1318 |            0.2161 |
   | wait/synch/mutex/innodb/log_flush_order_mutex           |       1250 |            0.0893 |
   | wait/synch/mutex/innodb/buf_dblwr_mutex                 |        951 |            0.0918 |
   | wait/synch/mutex/innodb/recalc_pool_mutex               |        670 |            0.0942 |
   | wait/synch/mutex/innodb/dict_persist_dirty_tables_mutex |        345 |            0.0414 |
   | wait/synch/mutex/innodb/lock_wait_mutex                 |        303 |            0.1565 |
   | wait/synch/mutex/innodb/autoinc_mutex                   |        196 |            0.0213 |
   | wait/synch/mutex/innodb/autoinc_persisted_mutex         |        196 |            0.0175 |
   | wait/synch/mutex/innodb/purge_sys_pq_mutex              |        117 |            0.0308 |
   | wait/synch/mutex/innodb/srv_sys_mutex                   |         94 |            0.0077 |
   | wait/synch/mutex/innodb/ibuf_mutex                      |         22 |            0.0086 |
   | wait/synch/mutex/innodb/recv_sys_mutex                  |         12 |            0.0008 |
   | wait/synch/mutex/innodb/srv_innodb_monitor_mutex        |          4 |            0.0009 |
   | wait/synch/mutex/innodb/recv_writer_mutex               |          1 |            0.0005 |
   +---------------------------------------------------------+------------+-------------------+
   ```

Nota

O conjunto de resultados anterior inclui dados de eventos de espera produzidos durante o processo de inicialização. Para excluir esses dados, você pode truncar a tabela `events_waits_summary_global_by_event_name` imediatamente após a inicialização e antes de executar sua carga de trabalho. No entanto, a própria operação de truncar pode produzir uma quantidade negligenciável de dados de eventos de espera.

```
   mysql> TRUNCATE performance_schema.events_waits_summary_global_by_event_name;
   ```