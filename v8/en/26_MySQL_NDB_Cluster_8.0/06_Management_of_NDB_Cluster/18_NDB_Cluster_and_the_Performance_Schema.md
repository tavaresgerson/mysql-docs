### 25.6.18 NDB Cluster and the Performance Schema

NDB 8.0 provides information in the MySQL Performance Schema about threads and transaction memory usage; NDB 8.0.29 adds `ndbcluster` plugin threads, and NDB 8.0.30 adds instrumenting for transaction batch memory. These features are described in greater detail in the sections which follow.

#### ndbcluster Plugin Threads

Beginning with NDB 8.0.29, `ndbcluster` plugin threads are visible in the Performance Schema `threads` table, as shown in the following query:

```
mysql> SELECT name, type, thread_id, thread_os_id
    -> FROM performance_schema.threads
    -> WHERE name LIKE '%ndbcluster%'\G
+----------------------------------+------------+-----------+--------------+
| name                             | type       | thread_id | thread_os_id |
+----------------------------------+------------+-----------+--------------+
| thread/ndbcluster/ndb_binlog     | BACKGROUND |        30 |        11980 |
| thread/ndbcluster/ndb_index_stat | BACKGROUND |        31 |        11981 |
| thread/ndbcluster/ndb_metadata   | BACKGROUND |        32 |        11982 |
+----------------------------------+------------+-----------+--------------+
```

The `threads` table shows all three of the threads listed here:

* `ndb_binlog`: Binary logging thread
* `ndb_index_stat`: Index statistics thread
* `ndb_metadata`: Metadata thread

These threads are also shown by name in the `setup_threads` table.

Thread names are shown in the `name` column of the `threads` and `setup_threads` tables using the format `prefix/plugin_name/thread_name`. *`prefix`*, the object type as determined by the `performance_schema` engine, is `thread` for plugin threads (see Thread Instrument Elements). The *`plugin_name`* is `ndbcluster`. *`thread_name`* is the standalone name of the thread (`ndb_binlog`, `ndb_index_stat`, or `ndb_metadata`).

Using the thread ID or OS thread ID for a given thread in the `threads` or `setup_threads` table, it is possible to obtain considerable information from Performance Schema about plugin execution and resource usage. This example shows how to obtain the amount of memory allocated by the threads created by the `ndbcluster` plugin from the `mem_root` arena by joining the `threads` and `memory_summary_by_thread_by_event_name` tables:

```
mysql> SELECT
    ->   t.name,
    ->   m.sum_number_of_bytes_alloc,
    ->   IF(m.sum_number_of_bytes_alloc > 0, "true", "false") AS 'Has allocated memory'
    -> FROM performance_schema.memory_summary_by_thread_by_event_name m
    -> JOIN performance_schema.threads t
    -> ON m.thread_id = t.thread_id
    -> WHERE t.name LIKE '%ndbcluster%'
    ->   AND event_name LIKE '%THD::main_mem_root%';
+----------------------------------+---------------------------+----------------------+
| name                             | sum_number_of_bytes_alloc | Has allocated memory |
+----------------------------------+---------------------------+----------------------+
| thread/ndbcluster/ndb_binlog     |                     20576 | true                 |
| thread/ndbcluster/ndb_index_stat |                         0 | false                |
| thread/ndbcluster/ndb_metadata   |                      8240 | true                 |
+----------------------------------+---------------------------+----------------------+
```

#### Transaction Memory Usage

Starting with NDB 8.0.30, you can see the amount of memory used for transaction batching by querying the Performance Schema `memory_summary_by_thread_by_event_name` table, similar to what is shown here:

```
mysql> SELECT EVENT_NAME
    ->   FROM performance_schema.memory_summary_by_thread_by_event_name
    ->   WHERE THREAD_ID = PS_CURRENT_THREAD_ID()
    ->     AND EVENT_NAME LIKE 'memory/ndbcluster/%';
+-------------------------------------------+
| EVENT_NAME                                |
+-------------------------------------------+
| memory/ndbcluster/Thd_ndb::batch_mem_root |
+-------------------------------------------+
1 row in set (0.01 sec)
```

The `ndbcluster` transaction memory instrument is also visible in the Performance Schema `setup_instruments` table, as shown here:

```
mysql> SELECT * from performance_schema.setup_instruments
    ->   WHERE NAME LIKE '%ndb%'\G
*************************** 1. row ***************************
         NAME: memory/ndbcluster/Thd_ndb::batch_mem_root
      ENABLED: YES
        TIMED: NULL
   PROPERTIES:
   VOLATILITY: 0
DOCUMENTATION: Memory used for transaction batching
1 row in set (0.01 sec)
```
