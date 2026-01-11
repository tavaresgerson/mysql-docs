## 17.16 InnoDB Integration with MySQL Performance Schema

17.16.1 Monitoring ALTER TABLE Progress for InnoDB Tables Using Performance Schema

17.16.2 Monitoring InnoDB Mutex Waits Using Performance Schema

This section provides a brief introduction to `InnoDB` integration with Performance Schema. For comprehensive Performance Schema documentation, see Chapter 29, *MySQL Performance Schema*.

You can profile certain internal `InnoDB` operations using the MySQL Performance Schema feature. This type of tuning is primarily for expert users who evaluate optimization strategies to overcome performance bottlenecks. DBAs can also use this feature for capacity planning, to see whether their typical workload encounters any performance bottlenecks with a particular combination of CPU, RAM, and disk storage; and if so, to judge whether performance can be improved by increasing the capacity of some part of the system.

To use this feature to examine `InnoDB` performance:

* You must be generally familiar with how to use the Performance Schema feature. For example, you should know how enable instruments and consumers, and how to query `performance_schema` tables to retrieve data. For an introductory overview, see Section 29.1, “Performance Schema Quick Start”.

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

  For additional information about the instrumented `InnoDB` objects, you can query Performance Schema instances tables, which provide additional information about instrumented objects. Instance tables relevant to `InnoDB` include:

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

  + The Wait Event tables, which store wait events.

  + The Summary tables, which provide aggregated information for terminated events over time. Summary tables include file I/O summary tables, which aggregate information about I/O operations.

  + Stage Event tables, which store event data for `InnoDB` `ALTER TABLE` and buffer pool load operations. For more information, see Section 17.16.1, “Monitoring ALTER TABLE Progress for InnoDB Tables Using Performance Schema”, and Monitoring Buffer Pool Load Progress Using Performance Schema.

  If you are only interested in `InnoDB`-related objects, use the clause `WHERE EVENT_NAME LIKE '%innodb%'` or `WHERE NAME LIKE '%innodb%'` (as required) when querying these tables.
