## 25.17 The Performance Schema Memory-Allocation Model

The Performance Schema uses this memory allocation model:

* May allocate memory at server startup
* May allocate additional memory during server operation
* Never free memory during server operation (although it might be recycled)

* Free all memory used at shutdown

The result is to relax memory constraints so that the Performance Schema can be used with less configuration, and to decrease the memory footprint so that consumption scales with server load. Memory used depends on the load actually seen, not the load estimated or explicitly configured for.

Several Performance Schema sizing parameters are autoscaled and need not be configured explicitly unless you want to establish an explicit limit on memory allocation:

```sql
performance_schema_accounts_size
performance_schema_hosts_size
performance_schema_max_cond_instances
performance_schema_max_file_instances
performance_schema_max_index_stat
performance_schema_max_metadata_locks
performance_schema_max_mutex_instances
performance_schema_max_prepared_statements_instances
performance_schema_max_program_instances
performance_schema_max_rwlock_instances
performance_schema_max_socket_instances
performance_schema_max_table_handles
performance_schema_max_table_instances
performance_schema_max_table_lock_stat
performance_schema_max_thread_instances
performance_schema_users_size
```

For an autoscaled parameter, configuration works like this:

* With the value set to -1 (the default), the parameter is autoscaled:

  + The corresponding internal buffer is empty initially and no memory is allocated.

  + As the Performance Schema collects data, memory is allocated in the corresponding buffer. The buffer size is unbounded, and may grow with the load.

* With the value set to 0:

  + The corresponding internal buffer is empty initially and no memory is allocated.

* With the value set to *`N`* > 0:

  + The corresponding internal buffer is empty initially and no memory is allocated.

  + As the Performance Schema collects data, memory is allocated in the corresponding buffer, until the buffer size reaches *`N`*.

  + Once the buffer size reaches *`N`*, no more memory is allocated. Data collected by the Performance Schema for this buffer is lost, and any corresponding “lost instance” counters are incremented.

To see how much memory the Performance Schema is using, check the instruments designed for that purpose. The Performance Schema allocates memory internally and associates each buffer with a dedicated instrument so that memory consumption can be traced to individual buffers. Instruments named with the prefix `memory/performance_schema/` expose how much memory is allocated for these internal buffers. The buffers are global to the server, so the instruments are displayed only in the [`memory_summary_global_by_event_name`](performance-schema-memory-summary-tables.html "25.12.15.9 Memory Summary Tables") table, and not in other `memory_summary_by_xxx_by_event_name` tables.

This query shows the information associated with the memory instruments:

```sql
SELECT * FROM performance_schema.memory_summary_global_by_event_name
WHERE EVENT_NAME LIKE 'memory/performance_schema/%';
```
