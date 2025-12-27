#### 8.12.4.2 Monitoring MySQL Memory Usage

The following example demonstrates how to use Performance Schema and sys schema to monitor MySQL memory usage.

Most Performance Schema memory instrumentation is disabled by default. Instruments can be enabled by updating the `ENABLED` column of the Performance Schema `setup_instruments` table. Memory instruments have names in the form of `memory/code_area/instrument_name`, where *`code_area`* is a value such as `sql` or `innodb`, and *`instrument_name`* is the instrument detail.

1. To view available MySQL memory instruments, query the Performance Schema `setup_instruments` table. The following query returns hundreds of memory instruments for all code areas.

   ```sql
   mysql> SELECT * FROM performance_schema.setup_instruments
          WHERE NAME LIKE '%memory%';
   ```

   You can narrow results by specifying a code area. For example, you can limit results to `InnoDB` memory instruments by specifying `innodb` as the code area.

   ```sql
   mysql> SELECT * FROM performance_schema.setup_instruments
          WHERE NAME LIKE '%memory/innodb%';
   +-------------------------------------------+---------+-------+
   | NAME                                      | ENABLED | TIMED |
   +-------------------------------------------+---------+-------+
   | memory/innodb/adaptive hash index         | NO      | NO    |
   | memory/innodb/buf_buf_pool                | NO      | NO    |
   | memory/innodb/dict_stats_bg_recalc_pool_t | NO      | NO    |
   | memory/innodb/dict_stats_index_map_t      | NO      | NO    |
   | memory/innodb/dict_stats_n_diff_on_level  | NO      | NO    |
   | memory/innodb/other                       | NO      | NO    |
   | memory/innodb/row_log_buf                 | NO      | NO    |
   | memory/innodb/row_merge_sort              | NO      | NO    |
   | memory/innodb/std                         | NO      | NO    |
   | memory/innodb/trx_sys_t::rw_trx_ids       | NO      | NO    |
   ...
   ```

   Depending on your MySQL installation, code areas may include `performance_schema`, `sql`, `client`, `innodb`, `myisam`, `csv`, `memory`, `blackhole`, `archive`, `partition`, and others.

2. To enable memory instruments, add a `performance-schema-instrument` rule to your MySQL configuration file. For example, to enable all memory instruments, add this rule to your configuration file and restart the server:

   ```sql
   performance-schema-instrument='memory/%=COUNTED'
   ```

   Note

   Enabling memory instruments at startup ensures that memory allocations that occur at startup are counted.

   After restarting the server, the `ENABLED` column of the Performance Schema `setup_instruments` table should report `YES` for memory instruments that you enabled. The `TIMED` column in the `setup_instruments` table is ignored for memory instruments because memory operations are not timed.

   ```sql
   mysql> SELECT * FROM performance_schema.setup_instruments
          WHERE NAME LIKE '%memory/innodb%';
   +-------------------------------------------+---------+-------+
   | NAME                                      | ENABLED | TIMED |
   +-------------------------------------------+---------+-------+
   | memory/innodb/adaptive hash index         | NO      | NO    |
   | memory/innodb/buf_buf_pool                | NO      | NO    |
   | memory/innodb/dict_stats_bg_recalc_pool_t | NO      | NO    |
   | memory/innodb/dict_stats_index_map_t      | NO      | NO    |
   | memory/innodb/dict_stats_n_diff_on_level  | NO      | NO    |
   | memory/innodb/other                       | NO      | NO    |
   | memory/innodb/row_log_buf                 | NO      | NO    |
   | memory/innodb/row_merge_sort              | NO      | NO    |
   | memory/innodb/std                         | NO      | NO    |
   | memory/innodb/trx_sys_t::rw_trx_ids       | NO      | NO    |
   ...
   ```

3. Query memory instrument data. In this example, memory instrument data is queried in the Performance Schema `memory_summary_global_by_event_name` table, which summarizes data by `EVENT_NAME`. The `EVENT_NAME` is the name of the instrument.

   The following query returns memory data for the `InnoDB` buffer pool. For column descriptions, see Section 25.12.15.9, “Memory Summary Tables”.

   ```sql
   mysql> SELECT * FROM performance_schema.memory_summary_global_by_event_name
          WHERE EVENT_NAME LIKE 'memory/innodb/buf_buf_pool'\G
                     EVENT_NAME: memory/innodb/buf_buf_pool
                    COUNT_ALLOC: 1
                     COUNT_FREE: 0
      SUM_NUMBER_OF_BYTES_ALLOC: 137428992
       SUM_NUMBER_OF_BYTES_FREE: 0
                 LOW_COUNT_USED: 0
             CURRENT_COUNT_USED: 1
                HIGH_COUNT_USED: 1
       LOW_NUMBER_OF_BYTES_USED: 0
   CURRENT_NUMBER_OF_BYTES_USED: 137428992
      HIGH_NUMBER_OF_BYTES_USED: 137428992
   ```

   The same underlying data can be queried using the `sys` schema `memory_global_by_current_bytes` table, which shows current memory usage within the server globally, broken down by allocation type.

   ```sql
   mysql> SELECT * FROM sys.memory_global_by_current_bytes
          WHERE event_name LIKE 'memory/innodb/buf_buf_pool'\G
   *************************** 1. row ***************************
          event_name: memory/innodb/buf_buf_pool
       current_count: 1
       current_alloc: 131.06 MiB
   current_avg_alloc: 131.06 MiB
          high_count: 1
          high_alloc: 131.06 MiB
      high_avg_alloc: 131.06 MiB
   ```

   This `sys` schema query aggregates currently allocated memory (`current_alloc`) by code area:

   ```sql
   mysql> SELECT SUBSTRING_INDEX(event_name,'/',2) AS
          code_area, sys.format_bytes(SUM(current_alloc))
          AS current_alloc
          FROM sys.x$memory_global_by_current_bytes
          GROUP BY SUBSTRING_INDEX(event_name,'/',2)
          ORDER BY SUM(current_alloc) DESC;
   +---------------------------+---------------+
   | code_area                 | current_alloc |
   +---------------------------+---------------+
   | memory/innodb             | 843.24 MiB    |
   | memory/performance_schema | 81.29 MiB     |
   | memory/mysys              | 8.20 MiB      |
   | memory/sql                | 2.47 MiB      |
   | memory/memory             | 174.01 KiB    |
   | memory/myisam             | 46.53 KiB     |
   | memory/blackhole          | 512 bytes     |
   | memory/federated          | 512 bytes     |
   | memory/csv                | 512 bytes     |
   | memory/vio                | 496 bytes     |
   +---------------------------+---------------+
   ```

   For more information about `sys` schema, see Chapter 26, *MySQL sys Schema*.
