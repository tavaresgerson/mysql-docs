## 29.16 Performance Schema Status Variables

The Performance Schema implements several status variables that provide information about instrumentation that could not be loaded or created due to memory constraints:

```
mysql> SHOW STATUS LIKE 'perf%';
+-------------------------------------------+-------+
| Variable_name                             | Value |
+-------------------------------------------+-------+
| Performance_schema_accounts_lost          | 0     |
| Performance_schema_cond_classes_lost      | 0     |
| Performance_schema_cond_instances_lost    | 0     |
| Performance_schema_file_classes_lost      | 0     |
| Performance_schema_file_handles_lost      | 0     |
| Performance_schema_file_instances_lost    | 0     |
| Performance_schema_hosts_lost             | 0     |
| Performance_schema_locker_lost            | 0     |
| Performance_schema_mutex_classes_lost     | 0     |
| Performance_schema_mutex_instances_lost   | 0     |
| Performance_schema_rwlock_classes_lost    | 0     |
| Performance_schema_rwlock_instances_lost  | 0     |
| Performance_schema_socket_classes_lost    | 0     |
| Performance_schema_socket_instances_lost  | 0     |
| Performance_schema_stage_classes_lost     | 0     |
| Performance_schema_statement_classes_lost | 0     |
| Performance_schema_table_handles_lost     | 0     |
| Performance_schema_table_instances_lost   | 0     |
| Performance_schema_thread_classes_lost    | 0     |
| Performance_schema_thread_instances_lost  | 0     |
| Performance_schema_users_lost             | 0     |
+-------------------------------------------+-------+
```

For information on using these variables to check Performance Schema status, see Section 29.7, “Performance Schema Status Monitoring”.

Performance Schema status variables have the following meanings:

* `Performance_schema_accounts_lost`

  The number of times a row could not be added to the `accounts` table because it was full.

* `Performance_schema_cond_classes_lost`

  How many condition instruments could not be loaded.

* `Performance_schema_cond_instances_lost`

  How many condition instrument instances could not be created.

* `Performance_schema_digest_lost`

  The number of digest instances that could not be instrumented in the `events_statements_summary_by_digest` table. This can be nonzero if the value of `performance_schema_digests_size` is too small.

* `Performance_schema_file_classes_lost`

  How many file instruments could not be loaded.

* `Performance_schema_file_handles_lost`

  How many file instrument instances could not be opened.

* `Performance_schema_file_instances_lost`

  How many file instrument instances could not be created.

* `Performance_schema_hosts_lost`

  The number of times a row could not be added to the `hosts` table because it was full.

* `Performance_schema_index_stat_lost`

  The number of indexes for which statistics were lost. This can be nonzero if the value of `performance_schema_max_index_stat` is too small.

* `Performance_schema_locker_lost`

  How many events are “lost” or not recorded, due to the following conditions:

  + Events are recursive (for example, waiting for A caused a wait on B, which caused a wait on C).

  + The depth of the nested events stack is greater than the limit imposed by the implementation.

  Events recorded by the Performance Schema are not recursive, so this variable should always be 0.

* `Performance_schema_memory_classes_lost`

  The number of times a memory instrument could not be loaded.

* `Performance_schema_metadata_lock_lost`

  The number of metadata locks that could not be instrumented in the `metadata_locks` table. This can be nonzero if the value of `performance_schema_max_metadata_locks` is too small.

* `Performance_schema_mutex_classes_lost`

  How many mutex instruments could not be loaded.

* `Performance_schema_mutex_instances_lost`

  How many mutex instrument instances could not be created.

* `Performance_schema_nested_statement_lost`

  The number of stored program statements for which statistics were lost. This can be nonzero if the value of `performance_schema_max_statement_stack` is too small.

* `Performance_schema_prepared_statements_lost`

  The number of prepared statements that could not be instrumented in the `prepared_statements_instances` table. This can be nonzero if the value of `performance_schema_max_prepared_statements_instances` is too small.

* `Performance_schema_program_lost`

  The number of stored programs for which statistics were lost. This can be nonzero if the value of `performance_schema_max_program_instances` is too small.

* `Performance_schema_rwlock_classes_lost`

  How many rwlock instruments could not be loaded.

* `Performance_schema_rwlock_instances_lost`

  How many rwlock instrument instances could not be created.

* `Performance_schema_session_connect_attrs_longest_seen`

  In addition to the connection attribute size-limit check performed by the Performance Schema against the value of the `performance_schema_session_connect_attrs_size` system variable, the server performs a preliminary check, imposing a limit of 64KB on the aggregate size of connection attribute data it accepts. If a client attempts to send more than 64KB of attribute data, the server rejects the connection. Otherwise, the server considers the attribute buffer valid and tracks the size of the longest such buffer in the `Performance_schema_session_connect_attrs_longest_seen` status variable. If this value is larger than `performance_schema_session_connect_attrs_size`, DBAs may wish to increase the latter value, or, alternatively, investigate which clients are sending large amounts of attribute data.

  For more information about connection attributes, see Section 29.12.9, “Performance Schema Connection Attribute Tables”.

* `Performance_schema_session_connect_attrs_lost`

  The number of connections for which connection attribute truncation has occurred. For a given connection, if the client sends connection attribute key-value pairs for which the aggregate size is larger than the reserved storage permitted by the value of the `performance_schema_session_connect_attrs_size` system variable, the Performance Schema truncates the attribute data and increments `Performance_schema_session_connect_attrs_lost`. If this value is nonzero, you may wish to set `performance_schema_session_connect_attrs_size` to a larger value.

  For more information about connection attributes, see Section 29.12.9, “Performance Schema Connection Attribute Tables”.

* `Performance_schema_socket_classes_lost`

  How many socket instruments could not be loaded.

* `Performance_schema_socket_instances_lost`

  How many socket instrument instances could not be created.

* `Performance_schema_stage_classes_lost`

  How many stage instruments could not be loaded.

* `Performance_schema_statement_classes_lost`

  How many statement instruments could not be loaded.

* `Performance_schema_table_handles_lost`

  How many table instrument instances could not be opened. This can be nonzero if the value of `performance_schema_max_table_handles` is too small.

* `Performance_schema_table_instances_lost`

  How many table instrument instances could not be created.

* `Performance_schema_table_lock_stat_lost`

  The number of tables for which lock statistics were lost. This can be nonzero if the value of `performance_schema_max_table_lock_stat` is too small.

* `Performance_schema_thread_classes_lost`

  How many thread instruments could not be loaded.

* `Performance_schema_thread_instances_lost`

  The number of thread instances that could not be instrumented in the `threads` table. This can be nonzero if the value of `performance_schema_max_thread_instances` is too small.

* `Performance_schema_users_lost`

  The number of times a row could not be added to the `users` table because it was full.
