## 17.16 InnoDB Integration with MySQL Performance Schema

This section provides a brief introduction to `InnoDB` integration with Performance Schema. For comprehensive Performance Schema documentation, see Chapter 29, *MySQL Performance Schema*.

You can profile certain internal `InnoDB` operations using the MySQL [Performance Schema feature](performance-schema.html "Chapter 29 MySQL Performance Schema"). This type of tuning is primarily for expert users who evaluate optimization strategies to overcome performance bottlenecks. DBAs can also use this feature for capacity planning, to see whether their typical workload encounters any performance bottlenecks with a particular combination of CPU, RAM, and disk storage; and if so, to judge whether performance can be improved by increasing the capacity of some part of the system.

To use this feature to examine `InnoDB` performance:

* You must be generally familiar with how to use the [Performance Schema feature](performance-schema.html "Chapter 29 MySQL Performance Schema"). For example, you should know how enable instruments and consumers, and how to query `performance_schema` tables to retrieve data. For an introductory overview, see Section 29.1, “Performance Schema Quick Start”.

* You should be familiar with Performance Schema instruments that are available for `InnoDB`. To view `InnoDB`-related instruments, you can query the `setup_instruments` table for instrument names that contain '`innodb`'.

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

  For additional information about the instrumented `InnoDB` objects, you can query Performance Schema [instances tables](performance-schema-instance-tables.html "29.12.3 Performance Schema Instance Tables"), which provide additional information about instrumented objects. Instance tables relevant to `InnoDB` include:

  + The `mutex_instances` table
  + The `rwlock_instances` table
  + The `cond_instances` table
  + The `file_instances` table

  Note

  Mutexes and RW-locks related to the `InnoDB` buffer pool are not included in this coverage; the same applies to the output of the `SHOW ENGINE INNODB MUTEX` statement.

  For example, to view information about instrumented `InnoDB` file objects seen by the Performance Schema when executing file I/O instrumentation, you might issue the following query:

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

* You should be familiar with `performance_schema` tables that store `InnoDB` event data. Tables relevant to `InnoDB`-related events include:

  + The [Wait Event](performance-schema-wait-tables.html "29.12.4 Performance Schema Wait Event Tables") tables, which store wait events.

  + The Summary tables, which provide aggregated information for terminated events over time. Summary tables include [file I/O summary tables](performance-schema-file-summary-tables.html "29.12.20.7 File I/O Summary Tables"), which aggregate information about I/O operations.

  + [Stage Event](performance-schema-stage-tables.html "29.12.5 Performance Schema Stage Event Tables") tables, which store event data for `InnoDB` [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") and buffer pool load operations. For more information, see [Section 17.16.1, “Monitoring ALTER TABLE Progress for InnoDB Tables Using Performance Schema”](monitor-alter-table-performance-schema.html "17.16.1 Monitoring ALTER TABLE Progress for InnoDB Tables Using Performance Schema"), and Monitoring Buffer Pool Load Progress Using Performance Schema.

  If you are only interested in `InnoDB`-related objects, use the clause `WHERE EVENT_NAME LIKE '%innodb%'` or `WHERE NAME LIKE '%innodb%'` (as required) when querying these tables.


### 17.16.1 Monitoring ALTER TABLE Progress for InnoDB Tables Using Performance Schema

You can monitor `ALTER TABLE` progress for `InnoDB` tables using Performance Schema.

There are seven stage events that represent different phases of `ALTER TABLE`. Each stage event reports a running total of `WORK_COMPLETED` and `WORK_ESTIMATED` for the overall `ALTER TABLE` operation as it progresses through its different phases. `WORK_ESTIMATED` is calculated using a formula that takes into account all of the work that `ALTER TABLE` performs, and may be revised during `ALTER TABLE` processing. `WORK_COMPLETED` and `WORK_ESTIMATED` values are an abstract representation of all of the work performed by `ALTER TABLE`.

In order of occurrence, `ALTER TABLE` stage events include:

* `stage/innodb/alter table (read PK and internal sort)`: This stage is active when `ALTER TABLE` is in the reading-primary-key phase. It starts with `WORK_COMPLETED=0` and `WORK_ESTIMATED` set to the estimated number of pages in the primary key. When the stage is completed, `WORK_ESTIMATED` is updated to the actual number of pages in the primary key.

* `stage/innodb/alter table (merge sort)`: This stage is repeated for each index added by the `ALTER TABLE` operation.

* `stage/innodb/alter table (insert)`: This stage is repeated for each index added by the `ALTER TABLE` operation.

* `stage/innodb/alter table (log apply index)`: This stage includes the application of DML log generated while `ALTER TABLE` was running.

* `stage/innodb/alter table (flush)`: Before this stage begins, `WORK_ESTIMATED` is updated with a more accurate estimate, based on the length of the flush list.

* `stage/innodb/alter table (log apply table)`: This stage includes the application of concurrent DML log generated while `ALTER TABLE` was running. The duration of this phase depends on the extent of table changes. This phase is instant if no concurrent DML was run on the table.

* `stage/innodb/alter table (end)`: Includes any remaining work that appeared after the flush phase, such as reapplying DML that was executed on the table while `ALTER TABLE` was running.

Note

`InnoDB` [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") stage events do not currently account for the addition of spatial indexes.

#### ALTER TABLE Monitoring Example Using Performance Schema

The following example demonstrates how to enable the `stage/innodb/alter table%` stage event instruments and related consumer tables to monitor `ALTER TABLE` progress. For information about Performance Schema stage event instruments and related consumers, see Section 29.12.5, “Performance Schema Stage Event Tables”.

1. Enable the `stage/innodb/alter%` instruments:

   ```
   mysql> UPDATE performance_schema.setup_instruments
          SET ENABLED = 'YES'
          WHERE NAME LIKE 'stage/innodb/alter%';
   Query OK, 7 rows affected (0.00 sec)
   Rows matched: 7  Changed: 7  Warnings: 0
   ```

2. Enable the stage event consumer tables, which include `events_stages_current`, `events_stages_history`, and `events_stages_history_long`.

   ```
   mysql> UPDATE performance_schema.setup_consumers
          SET ENABLED = 'YES'
          WHERE NAME LIKE '%stages%';
   Query OK, 3 rows affected (0.00 sec)
   Rows matched: 3  Changed: 3  Warnings: 0
   ```

3. Run an `ALTER TABLE` operation. In this example, a `middle_name` column is added to the employees table of the employees sample database.

   ```
   mysql> ALTER TABLE employees.employees ADD COLUMN middle_name varchar(14) AFTER first_name;
   Query OK, 0 rows affected (9.27 sec)
   Records: 0  Duplicates: 0  Warnings: 0
   ```

4. Check the progress of the [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") operation by querying the Performance Schema `events_stages_current` table. The stage event shown differs depending on which `ALTER TABLE` phase is currently in progress. The `WORK_COMPLETED` column shows the work completed. The `WORK_ESTIMATED` column provides an estimate of the remaining work.

   ```
   mysql> SELECT EVENT_NAME, WORK_COMPLETED, WORK_ESTIMATED
          FROM performance_schema.events_stages_current;
   +------------------------------------------------------+----------------+----------------+
   | EVENT_NAME                                           | WORK_COMPLETED | WORK_ESTIMATED |
   +------------------------------------------------------+----------------+----------------+
   | stage/innodb/alter table (read PK and internal sort) |            280 |           1245 |
   +------------------------------------------------------+----------------+----------------+
   1 row in set (0.01 sec)
   ```

   The `events_stages_current` table returns an empty set if the [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") operation has completed. In this case, you can check the `events_stages_history` table to view event data for the completed operation. For example:

   ```
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

   As shown above, the `WORK_ESTIMATED` value was revised during `ALTER TABLE` processing. The estimated work after completion of the initial stage is

   1213. When `ALTER TABLE` processing completed, `WORK_ESTIMATED` was set to the actual value, which is 1981.


### 17.16.2 Monitoring InnoDB Mutex Waits Using Performance Schema

A mutex is a synchronization mechanism used in the code to enforce that only one thread at a given time can have access to a common resource. When two or more threads executing in the server need to access the same resource, the threads compete against each other. The first thread to obtain a lock on the mutex causes the other threads to wait until the lock is released.

For `InnoDB` mutexes that are instrumented, mutex waits can be monitored using Performance Schema. Wait event data collected in Performance Schema tables can help identify mutexes with the most waits or the greatest total wait time, for example.

The following example demonstrates how to enable `InnoDB` mutex wait instruments, how to enable associated consumers, and how to query wait event data.

1. To view available `InnoDB` mutex wait instruments, query the Performance Schema `setup_instruments` table. All `InnoDB` mutex wait instruments are disabled by default.

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

2. Some `InnoDB` mutex instances are created at server startup and are only instrumented if the associated instrument is also enabled at server startup. To ensure that all `InnoDB` mutex instances are instrumented and enabled, add the following `performance-schema-instrument` rule to your MySQL configuration file:

   ```
   performance-schema-instrument='wait/synch/mutex/innodb/%=ON'
   ```

   If you do not require wait event data for all `InnoDB` mutexes, you can disable specific instruments by adding additional `performance-schema-instrument` rules to your MySQL configuration file. For example, to disable `InnoDB` mutex wait event instruments related to full-text search, add the following rule:

   ```
   performance-schema-instrument='wait/synch/mutex/innodb/fts%=OFF'
   ```

   Note

   Rules with a longer prefix such as `wait/synch/mutex/innodb/fts%` take precedence over rules with shorter prefixes such as `wait/synch/mutex/innodb/%`.

   After adding the `performance-schema-instrument` rules to your configuration file, restart the server. All the `InnoDB` mutexes except for those related to full text search are enabled. To verify, query the `setup_instruments` table. The `ENABLED` and `TIMED` columns should be set to `YES` for the instruments that you enabled.

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

3. Enable wait event consumers by updating the `setup_consumers` table. Wait event consumers are disabled by default.

   ```
   mysql> UPDATE performance_schema.setup_consumers
          SET enabled = 'YES'
          WHERE name like 'events_waits%';
   Query OK, 3 rows affected (0.00 sec)
   Rows matched: 3  Changed: 3  Warnings: 0
   ```

   You can verify that wait event consumers are enabled by querying the `setup_consumers` table. The `events_waits_current`, `events_waits_history`, and `events_waits_history_long` consumers should be enabled.

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

4. Once instruments and consumers are enabled, run the workload that you want to monitor. In this example, the **mysqlslap** load emulation client is used to simulate a workload.

   ```
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

   Note

   The preceding result set includes wait event data produced during the startup process. To exclude this data, you can truncate the `events_waits_summary_global_by_event_name` table immediately after startup and before running your workload. However, the truncate operation itself may produce a negligible amount wait event data.

   ```
   mysql> TRUNCATE performance_schema.events_waits_summary_global_by_event_name;
   ```
