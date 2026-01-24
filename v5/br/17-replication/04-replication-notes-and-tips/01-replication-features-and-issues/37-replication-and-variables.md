#### 16.4.1.37 Replication and Variables

System variables are not replicated correctly when using `STATEMENT` mode, except for the following variables when they are used with session scope:

* [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment)
* [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset)
* [`character_set_client`](server-system-variables.html#sysvar_character_set_client)
* [`character_set_connection`](server-system-variables.html#sysvar_character_set_connection)
* [`character_set_database`](server-system-variables.html#sysvar_character_set_database)
* [`character_set_server`](server-system-variables.html#sysvar_character_set_server)
* [`collation_connection`](server-system-variables.html#sysvar_collation_connection)
* [`collation_database`](server-system-variables.html#sysvar_collation_database)
* [`collation_server`](server-system-variables.html#sysvar_collation_server)
* [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks)
* [`identity`](server-system-variables.html#sysvar_identity)
* [`last_insert_id`](server-system-variables.html#sysvar_last_insert_id)
* [`lc_time_names`](server-system-variables.html#sysvar_lc_time_names)
* [`pseudo_thread_id`](server-system-variables.html#sysvar_pseudo_thread_id)
* [`sql_auto_is_null`](server-system-variables.html#sysvar_sql_auto_is_null)
* [`time_zone`](server-system-variables.html#sysvar_time_zone)
* [`timestamp`](server-system-variables.html#sysvar_timestamp)
* [`unique_checks`](server-system-variables.html#sysvar_unique_checks)

When `MIXED` mode is used, the variables in the preceding list, when used with session scope, cause a switch from statement-based to row-based logging. See [Section 5.4.4.3, “Mixed Binary Logging Format”](binary-log-mixed.html "5.4.4.3 Mixed Binary Logging Format").

[`sql_mode`](server-system-variables.html#sysvar_sql_mode) is also replicated except for the [`NO_DIR_IN_CREATE`](sql-mode.html#sqlmode_no_dir_in_create) mode; the replica always preserves its own value for [`NO_DIR_IN_CREATE`](sql-mode.html#sqlmode_no_dir_in_create), regardless of changes to it on the source. This is true for all replication formats.

However, when [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") parses a `SET @@sql_mode = mode` statement, the full *`mode`* value, including [`NO_DIR_IN_CREATE`](sql-mode.html#sqlmode_no_dir_in_create), is passed to the receiving server. For this reason, replication of such a statement may not be safe when `STATEMENT` mode is in use.

The [`default_storage_engine`](server-system-variables.html#sysvar_default_storage_engine) system variable is not replicated, regardless of the logging mode; this is intended to facilitate replication between different storage engines.

The [`read_only`](server-system-variables.html#sysvar_read_only) system variable is not replicated. In addition, the enabling this variable has different effects with regard to temporary tables, table locking, and the [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement") statement in different MySQL versions.

The [`max_heap_table_size`](server-system-variables.html#sysvar_max_heap_table_size) system variable is not replicated. Increasing the value of this variable on the source without doing so on the replica can lead eventually to Table is full errors on the replica when trying to execute [`INSERT`](insert.html "13.2.5 INSERT Statement") statements on a [`MEMORY`](memory-storage-engine.html "15.3 The MEMORY Storage Engine") table on the source that is thus permitted to grow larger than its counterpart on the replica. For more information, see [Section 16.4.1.20, “Replication and MEMORY Tables”](replication-features-memory.html "16.4.1.20 Replication and MEMORY Tables").

In statement-based replication, session variables are not replicated properly when used in statements that update tables. For example, the following sequence of statements do not insert the same data on the source and the replica:

```sql
SET max_join_size=1000;
INSERT INTO mytable VALUES(@@max_join_size);
```

This does not apply to the common sequence:

```sql
SET time_zone=...;
INSERT INTO mytable VALUES(CONVERT_TZ(..., ..., @@time_zone));
```

Replication of session variables is not a problem when row-based replication is being used, in which case, session variables are always replicated safely. See [Section 16.2.1, “Replication Formats”](replication-formats.html "16.2.1 Replication Formats").

The following session variables are written to the binary log and honored by the replica when parsing the binary log, regardless of the logging format:

* [`sql_mode`](server-system-variables.html#sysvar_sql_mode)
* [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks)
* [`unique_checks`](server-system-variables.html#sysvar_unique_checks)
* [`character_set_client`](server-system-variables.html#sysvar_character_set_client)
* [`collation_connection`](server-system-variables.html#sysvar_collation_connection)
* [`collation_database`](server-system-variables.html#sysvar_collation_database)
* [`collation_server`](server-system-variables.html#sysvar_collation_server)
* [`sql_auto_is_null`](server-system-variables.html#sysvar_sql_auto_is_null)

Important

Even though session variables relating to character sets and collations are written to the binary log, replication between different character sets is not supported.

To help reduce possible confusion, we recommend that you always use the same setting for the [`lower_case_table_names`](server-system-variables.html#sysvar_lower_case_table_names) system variable on both source and replica, especially when you are running MySQL on platforms with case-sensitive file systems.
