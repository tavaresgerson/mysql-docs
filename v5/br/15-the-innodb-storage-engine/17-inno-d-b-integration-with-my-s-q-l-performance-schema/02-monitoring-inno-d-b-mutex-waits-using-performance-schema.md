### 14.17.2 Monitoring InnoDB Mutex Waits Using Performance Schema

A mutex is a synchronization mechanism used in the code to enforce that only one thread at a given time can have access to a common resource. When two or more threads executing in the server need to access the same resource, the threads compete against each other. The first thread to obtain a lock on the mutex causes the other threads to wait until the lock is released.

For `InnoDB` mutexes that are instrumented, mutex waits can be monitored using Performance Schema. Wait event data collected in Performance Schema tables can help identify mutexes with the most waits or the greatest total wait time, for example.

The following example demonstrates how to enable `InnoDB` mutex wait instruments, how to enable associated consumers, and how to query wait event data.

1. To view available `InnoDB` mutex wait instruments, query the Performance Schema `setup_instruments` table, as shown below. All `InnoDB` mutex wait instruments are disabled by default.

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

2. Some `InnoDB` mutex instances are created at server startup and are only instrumented if the associated instrument is also enabled at server startup. To ensure that all `InnoDB` mutex instances are instrumented and enabled, add the following `performance-schema-instrument` rule to your MySQL configuration file:

   ```sql
   performance-schema-instrument='wait/synch/mutex/innodb/%=ON'
   ```

   If you do not require wait event data for all `InnoDB` mutexes, you can disable specific instruments by adding additional `performance-schema-instrument` rules to your MySQL configuration file. For example, to disable `InnoDB` mutex wait event instruments related to full-text search, add the following rule:

   ```sql
   performance-schema-instrument='wait/synch/mutex/innodb/fts%=OFF'
   ```

   Note

   Rules with a longer prefix such as `wait/synch/mutex/innodb/fts%` take precedence over rules with shorter prefixes such as `wait/synch/mutex/innodb/%`.

   After adding the `performance-schema-instrument` rules to your configuration file, restart the server. All the `InnoDB` mutexes except for those related to full text search are enabled. To verify, query the `setup_instruments` table. The `ENABLED` and `TIMED` columns should be set to `YES` for the instruments that you enabled.

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

3. Enable wait event consumers by updating the `setup_consumers` table. Wait event consumers are disabled by default.

   ```sql
   mysql> UPDATE performance_schema.setup_consumers
          SET enabled = 'YES'
          WHERE name like 'events_waits%';
   Query OK, 3 rows affected (0.00 sec)
   Rows matched: 3  Changed: 3  Warnings: 0
   ```

   You can verify that wait event consumers are enabled by querying the `setup_consumers` table. The `events_waits_current`, `events_waits_history`, and `events_waits_history_long` consumers should be enabled.

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

4. Once instruments and consumers are enabled, run the workload that you want to monitor. In this example, the **mysqlslap** load emulation client is used to simulate a workload.

   ```sql
   $> ./mysqlslap --auto-generate-sql --concurrency=100 --iterations=10
          --number-of-queries=1000 --number-char-cols=6 --number-int-cols=6;
   ```

5. Query the wait event data. In this example, wait event data is queried from the `events_waits_summary_global_by_event_name` table which aggregates data found in the `events_waits_current`, `events_waits_history`, and `events_waits_history_long` tables. Data is summarized by event name (`EVENT_NAME`), which is the name of the instrument that produced the event. Summarized data includes:

   * `COUNT_STAR`

     The number of summarized wait events.

   * `SUM_TIMER_WAIT`

     The total wait time of the summarized timed wait events.

   * `MIN_TIMER_WAIT`

     The minimum wait time of the summarized timed wait events.

   * `AVG_TIMER_WAIT`

     The average wait time of the summarized timed wait events.

   * `MAX_TIMER_WAIT`

     The maximum wait time of the summarized timed wait events.

   The following query returns the instrument name (`EVENT_NAME`), the number of wait events (`COUNT_STAR`), and the total wait time for the events for that instrument (`SUM_TIMER_WAIT`). Because waits are timed in picoseconds (trillionths of a second) by default, wait times are divided by 1000000000 to show wait times in milliseconds. Data is presented in descending order, by the number of summarized wait events (`COUNT_STAR`). You can adjust the `ORDER BY` clause to order the data by total wait time.

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

   Note

   The preceding result set includes wait event data produced during the startup process. To exclude this data, you can truncate the `events_waits_summary_global_by_event_name` table immediately after startup and before running your workload. However, the truncate operation itself may produce a negligible amount wait event data.

   ```sql
   mysql> TRUNCATE performance_schema.events_waits_summary_global_by_event_name;
   ```
