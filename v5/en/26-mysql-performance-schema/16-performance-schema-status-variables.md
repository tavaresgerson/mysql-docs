## 25.16 Performance Schema Status Variables

The Performance Schema implements several status variables that provide information about instrumentation that could not be loaded or created due to memory constraints:

```sql
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

For information on using these variables to check Performance Schema status, see [Section 25.7, “Performance Schema Status Monitoring”](performance-schema-status-monitoring.html "25.7 Performance Schema Status Monitoring").

Performance Schema status variables have the following meanings:

* [`Performance_schema_accounts_lost`](performance-schema-status-variables.html#statvar_Performance_schema_accounts_lost)

  The number of times a row could not be added to the [`accounts`](performance-schema-accounts-table.html "25.12.8.1 The accounts Table") table because it was full.

* [`Performance_schema_cond_classes_lost`](performance-schema-status-variables.html#statvar_Performance_schema_cond_classes_lost)

  How many condition instruments could not be loaded.

* [`Performance_schema_cond_instances_lost`](performance-schema-status-variables.html#statvar_Performance_schema_cond_instances_lost)

  How many condition instrument instances could not be created.

* [`Performance_schema_digest_lost`](performance-schema-status-variables.html#statvar_Performance_schema_digest_lost)

  The number of digest instances that could not be instrumented in the [`events_statements_summary_by_digest`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables") table. This can be nonzero if the value of [`performance_schema_digests_size`](performance-schema-system-variables.html#sysvar_performance_schema_digests_size) is too small.

* [`Performance_schema_file_classes_lost`](performance-schema-status-variables.html#statvar_Performance_schema_file_classes_lost)

  How many file instruments could not be loaded.

* [`Performance_schema_file_handles_lost`](performance-schema-status-variables.html#statvar_Performance_schema_file_handles_lost)

  How many file instrument instances could not be opened.

* [`Performance_schema_file_instances_lost`](performance-schema-status-variables.html#statvar_Performance_schema_file_instances_lost)

  How many file instrument instances could not be created.

* [`Performance_schema_hosts_lost`](performance-schema-status-variables.html#statvar_Performance_schema_hosts_lost)

  The number of times a row could not be added to the [`hosts`](performance-schema-hosts-table.html "25.12.8.2 The hosts Table") table because it was full.

* [`Performance_schema_index_stat_lost`](performance-schema-status-variables.html#statvar_Performance_schema_index_stat_lost)

  The number of indexes for which statistics were lost. This can be nonzero if the value of [`performance_schema_max_index_stat`](performance-schema-system-variables.html#sysvar_performance_schema_max_index_stat) is too small.

* [`Performance_schema_locker_lost`](performance-schema-status-variables.html#statvar_Performance_schema_locker_lost)

  How many events are “lost” or not recorded, due to the following conditions:

  + Events are recursive (for example, waiting for A caused a wait on B, which caused a wait on C).

  + The depth of the nested events stack is greater than the limit imposed by the implementation.

  Events recorded by the Performance Schema are not recursive, so this variable should always be 0.

* [`Performance_schema_memory_classes_lost`](performance-schema-status-variables.html#statvar_Performance_schema_memory_classes_lost)

  The number of times a memory instrument could not be loaded.

* [`Performance_schema_metadata_lock_lost`](performance-schema-status-variables.html#statvar_Performance_schema_metadata_lock_lost)

  The number of metadata locks that could not be instrumented in the [`metadata_locks`](performance-schema-metadata-locks-table.html "25.12.12.1 The metadata_locks Table") table. This can be nonzero if the value of [`performance_schema_max_metadata_locks`](performance-schema-system-variables.html#sysvar_performance_schema_max_metadata_locks) is too small.

* [`Performance_schema_mutex_classes_lost`](performance-schema-status-variables.html#statvar_Performance_schema_mutex_classes_lost)

  How many mutex instruments could not be loaded.

* [`Performance_schema_mutex_instances_lost`](performance-schema-status-variables.html#statvar_Performance_schema_mutex_instances_lost)

  How many mutex instrument instances could not be created.

* [`Performance_schema_nested_statement_lost`](performance-schema-status-variables.html#statvar_Performance_schema_nested_statement_lost)

  The number of stored program statements for which statistics were lost. This can be nonzero if the value of [`performance_schema_max_statement_stack`](performance-schema-system-variables.html#sysvar_performance_schema_max_statement_stack) is too small.

* [`Performance_schema_prepared_statements_lost`](performance-schema-status-variables.html#statvar_Performance_schema_prepared_statements_lost)

  The number of prepared statements that could not be instrumented in the [`prepared_statements_instances`](performance-schema-prepared-statements-instances-table.html "25.12.6.4 The prepared_statements_instances Table") table. This can be nonzero if the value of [`performance_schema_max_prepared_statements_instances`](performance-schema-system-variables.html#sysvar_performance_schema_max_prepared_statements_instances) is too small.

* [`Performance_schema_program_lost`](performance-schema-status-variables.html#statvar_Performance_schema_program_lost)

  The number of stored programs for which statistics were lost. This can be nonzero if the value of [`performance_schema_max_program_instances`](performance-schema-system-variables.html#sysvar_performance_schema_max_program_instances) is too small.

* [`Performance_schema_rwlock_classes_lost`](performance-schema-status-variables.html#statvar_Performance_schema_rwlock_classes_lost)

  How many rwlock instruments could not be loaded.

* [`Performance_schema_rwlock_instances_lost`](performance-schema-status-variables.html#statvar_Performance_schema_rwlock_instances_lost)

  How many rwlock instrument instances could not be created.

* [`Performance_schema_session_connect_attrs_lost`](performance-schema-status-variables.html#statvar_Performance_schema_session_connect_attrs_lost)

  The number of connections for which connection attribute truncation has occurred. For a given connection, if the client sends connection attribute key-value pairs for which the aggregate size is larger than the reserved storage permitted by the value of the [`performance_schema_session_connect_attrs_size`](performance-schema-system-variables.html#sysvar_performance_schema_session_connect_attrs_size) system variable, the Performance Schema truncates the attribute data and increments [`Performance_schema_session_connect_attrs_lost`](performance-schema-status-variables.html#statvar_Performance_schema_session_connect_attrs_lost). If this value is nonzero, you may wish to set [`performance_schema_session_connect_attrs_size`](performance-schema-system-variables.html#sysvar_performance_schema_session_connect_attrs_size) to a larger value.

  For more information about connection attributes, see [Section 25.12.9, “Performance Schema Connection Attribute Tables”](performance-schema-connection-attribute-tables.html "25.12.9 Performance Schema Connection Attribute Tables").

* [`Performance_schema_socket_classes_lost`](performance-schema-status-variables.html#statvar_Performance_schema_socket_classes_lost)

  How many socket instruments could not be loaded.

* [`Performance_schema_socket_instances_lost`](performance-schema-status-variables.html#statvar_Performance_schema_socket_instances_lost)

  How many socket instrument instances could not be created.

* [`Performance_schema_stage_classes_lost`](performance-schema-status-variables.html#statvar_Performance_schema_stage_classes_lost)

  How many stage instruments could not be loaded.

* [`Performance_schema_statement_classes_lost`](performance-schema-status-variables.html#statvar_Performance_schema_statement_classes_lost)

  How many statement instruments could not be loaded.

* [`Performance_schema_table_handles_lost`](performance-schema-status-variables.html#statvar_Performance_schema_table_handles_lost)

  How many table instrument instances could not be opened. This can be nonzero if the value of [`performance_schema_max_table_handles`](performance-schema-system-variables.html#sysvar_performance_schema_max_table_handles) is too small.

* [`Performance_schema_table_instances_lost`](performance-schema-status-variables.html#statvar_Performance_schema_table_instances_lost)

  How many table instrument instances could not be created.

* [`Performance_schema_table_lock_stat_lost`](performance-schema-status-variables.html#statvar_Performance_schema_table_lock_stat_lost)

  The number of tables for which lock statistics were lost. This can be nonzero if the value of [`performance_schema_max_table_lock_stat`](performance-schema-system-variables.html#sysvar_performance_schema_max_table_lock_stat) is too small.

* [`Performance_schema_thread_classes_lost`](performance-schema-status-variables.html#statvar_Performance_schema_thread_classes_lost)

  How many thread instruments could not be loaded.

* [`Performance_schema_thread_instances_lost`](performance-schema-status-variables.html#statvar_Performance_schema_thread_instances_lost)

  The number of thread instances that could not be instrumented in the [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") table. This can be nonzero if the value of [`performance_schema_max_thread_instances`](performance-schema-system-variables.html#sysvar_performance_schema_max_thread_instances) is too small.

* [`Performance_schema_users_lost`](performance-schema-status-variables.html#statvar_Performance_schema_users_lost)

  The number of times a row could not be added to the [`users`](performance-schema-users-table.html "25.12.8.3 The users Table") table because it was full.
