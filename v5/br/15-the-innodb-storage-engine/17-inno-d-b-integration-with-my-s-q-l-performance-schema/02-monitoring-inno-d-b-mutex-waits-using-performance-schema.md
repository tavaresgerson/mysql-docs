### 14.17.2 Monitoramento das Esperas de Mutex InnoDB Usando o Schema de Desempenho

Um mutex é um mecanismo de sincronização usado no código para garantir que apenas um thread, em um dado momento, possa ter acesso a um recurso comum. Quando dois ou mais threads estão executando no servidor e precisam acessar o mesmo recurso, os threads competem entre si. O primeiro thread a obter um bloqueio no mutex faz com que os outros threads esperem até que o bloqueio seja liberado.

Para os mutexes instrumentados do `InnoDB`, as espera por mutex pode ser monitorada usando o Gerenciamento de Desempenho. Os dados de eventos de espera coletados nas tabelas do Gerenciamento de Desempenho podem ajudar a identificar os mutexes com mais espera ou o maior tempo total de espera, por exemplo.

O exemplo a seguir demonstra como habilitar os instrumentos de espera de mutex do InnoDB, como habilitar os consumidores associados e como consultar os dados do evento de espera.

1. Para visualizar os instrumentos de espera de mutex disponíveis do `InnoDB`, consulte a tabela `setup_instruments` do Gerenciamento de Desempenho, conforme mostrado abaixo. Todos os instrumentos de espera de mutex do `InnoDB` estão desabilitados por padrão.

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

2. Algumas instâncias de mutex do `InnoDB` são criadas no início do servidor e são apenas instrumentadas se o instrumento associado também estiver habilitado no início do servidor. Para garantir que todas as instâncias de mutex do `InnoDB` estejam instrumentadas e habilitadas, adicione a seguinte regra `performance-schema-instrument` ao seu arquivo de configuração do MySQL:

   ```sql
   performance-schema-instrument='wait/synch/mutex/innodb/%=ON'
   ```

   Se você não precisar dos dados de eventos de espera para todos os muts do `InnoDB`, você pode desabilitar instrumentos específicos adicionando regras adicionais de `performance-schema-instrument` ao seu arquivo de configuração do MySQL. Por exemplo, para desabilitar os instrumentos de eventos de espera de muts do `InnoDB` relacionados à pesquisa de texto completo, adicione a seguinte regra:

   ```sql
   performance-schema-instrument='wait/synch/mutex/innodb/fts%=OFF'
   ```

   Nota

   As regras com um prefixo mais longo, como `wait/synch/mutex/innodb/fts%`, têm precedência sobre as regras com prefixos mais curtos, como `wait/synch/mutex/innodb/%`.

   Depois de adicionar as regras `performance-schema-instrument` ao seu arquivo de configuração, reinicie o servidor. Todos os mutexes `InnoDB`, exceto aqueles relacionados à pesquisa de texto completo, estão habilitados. Para verificar, execute a consulta na tabela `setup_instruments`. As colunas `ENABLED` e `TIMED` devem estar definidas como `YES` para os instrumentos que você habilitou.

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

3. Ative os consumidores de eventos de espera atualizando a tabela `setup_consumers`. Os consumidores de eventos de espera são desabilitados por padrão.

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

4. Depois de habilitar os instrumentos e os consumidores, execute a carga de trabalho que você deseja monitorar. Neste exemplo, o cliente de emulação de carga **mysqlslap** é usado para simular uma carga de trabalho.

   ```sql
   $> ./mysqlslap --auto-generate-sql --concurrency=100 --iterations=10
          --number-of-queries=1000 --number-char-cols=6 --number-int-cols=6;
   ```

5. Consulte os dados do evento de espera. Neste exemplo, os dados do evento de espera são consultados da tabela `events_waits_summary_global_by_event_name`, que agrega dados encontrados nas tabelas `events_waits_current`, `events_waits_history` e `events_waits_history_long`. Os dados são resumidos pelo nome do evento (`EVENT_NAME`), que é o nome do instrumento que produziu o evento. Os dados resumidos incluem:

   - `CONTAR_ESTRELAS`

     O número de eventos de espera resumidos.

   - `SUM_TIMER_WAIT`

     O tempo total de espera dos eventos de espera cronometrada resumidos.

   - `MIN_TIMER_WAIT`

     O tempo de espera mínimo dos eventos de espera cronometrados resumidos.

   - `AVG_TIMER_WAIT`

     O tempo médio de espera dos eventos de espera cronometrada resumidos.

   - `MAX_TIMER_WAIT`

     O tempo máximo de espera dos eventos de espera cronometrada resumidos.

   A consulta a seguir retorna o nome do instrumento (`EVENT_NAME`), o número de eventos de espera (`COUNT_STAR`) e o tempo total de espera para os eventos desse instrumento (`SUM_TIMER_WAIT`). Como as espera são temporizadas em picosegundos (trilhésimos de segundo) por padrão, os tempos de espera são divididos por 1.000.000.000 para mostrar os tempos de espera em milissegundos. Os dados são apresentados em ordem decrescente, pelo número de eventos de espera resumidos (`COUNT_STAR`). Você pode ajustar a cláusula `ORDER BY` para ordenar os dados pelo tempo total de espera.

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
