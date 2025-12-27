### 21.6.17 Quick Reference: NDB Cluster SQL Statements

This section discusses several SQL statements that can prove useful in managing and monitoring a MySQL server that is connected to an NDB Cluster, and in some cases provide information about the cluster itself.

* [`SHOW ENGINE NDB STATUS`](show-engine.html "13.7.5.15 SHOW ENGINE Statement"), [`SHOW ENGINE NDBCLUSTER STATUS`](show-engine.html "13.7.5.15 SHOW ENGINE Statement")

  The output of this statement contains information about the server's connection to the cluster, creation and usage of NDB Cluster objects, and binary logging for NDB Cluster replication.

  See [Section 13.7.5.15, “SHOW ENGINE Statement”](show-engine.html "13.7.5.15 SHOW ENGINE Statement"), for a usage example and more detailed information.

* [`SHOW ENGINES`](show-engines.html "13.7.5.16 SHOW ENGINES Statement")

  This statement can be used to determine whether or not clustering support is enabled in the MySQL server, and if so, whether it is active.

  See [Section 13.7.5.16, “SHOW ENGINES Statement”](show-engines.html "13.7.5.16 SHOW ENGINES Statement"), for more detailed information.

  Note

  This statement does not support a [`LIKE`](string-comparison-functions.html#operator_like) clause. However, you can use [`LIKE`](string-comparison-functions.html#operator_like) to filter queries against the Information Schema [`ENGINES`](information-schema-engines-table.html "24.3.7 The INFORMATION_SCHEMA ENGINES Table") table, as discussed in the next item.

* `SELECT * FROM INFORMATION_SCHEMA.ENGINES [WHERE ENGINE LIKE 'NDB%']`

  This is the equivalent of [`SHOW ENGINES`](show-engines.html "13.7.5.16 SHOW ENGINES Statement"), but uses the [`ENGINES`](information-schema-engines-table.html "24.3.7 The INFORMATION_SCHEMA ENGINES Table") table of the `INFORMATION_SCHEMA` database. Unlike the case with the [`SHOW ENGINES`](show-engines.html "13.7.5.16 SHOW ENGINES Statement") statement, it is possible to filter the results using a [`LIKE`](string-comparison-functions.html#operator_like) clause, and to select specific columns to obtain information that may be of use in scripts. For example, the following query shows whether the server was built with [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") support and, if so, whether it is enabled:

  ```sql
  mysql> SELECT SUPPORT FROM INFORMATION_SCHEMA.ENGINES
      ->   WHERE ENGINE LIKE 'NDB%';
  +---------+
  | support |
  +---------+
  | ENABLED |
  +---------+
  ```

  See [Section 24.3.7, “The INFORMATION\_SCHEMA ENGINES Table”](information-schema-engines-table.html "24.3.7 The INFORMATION_SCHEMA ENGINES Table"), for more information.

* `SHOW VARIABLES LIKE 'NDB%'`

  This statement provides a list of most server system variables relating to the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine, and their values, as shown here, using NDB 7.6:

  ```sql
  mysql> SHOW VARIABLES LIKE 'NDB%';
  +--------------------------------------+---------------------------------------+
  | Variable_name                        | Value                                 |
  +--------------------------------------+---------------------------------------+
  | ndb_allow_copying_alter_table        | ON                                    |
  | ndb_autoincrement_prefetch_sz        | 1                                     |
  | ndb_batch_size                       | 32768                                 |
  | ndb_blob_read_batch_bytes            | 65536                                 |
  | ndb_blob_write_batch_bytes           | 65536                                 |
  | ndb_cache_check_time                 | 0                                     |
  | ndb_clear_apply_status               | ON                                    |
  | ndb_cluster_connection_pool          | 1                                     |
  | ndb_cluster_connection_pool_nodeids  |                                       |
  | ndb_connectstring                    | 127.0.0.1                             |
  | ndb_data_node_neighbour              | 0                                     |
  | ndb_default_column_format            | FIXED                                 |
  | ndb_deferred_constraints             | 0                                     |
  | ndb_distribution                     | KEYHASH                               |
  | ndb_eventbuffer_free_percent         | 20                                    |
  | ndb_eventbuffer_max_alloc            | 0                                     |
  | ndb_extra_logging                    | 1                                     |
  | ndb_force_send                       | ON                                    |
  | ndb_fully_replicated                 | OFF                                   |
  | ndb_index_stat_enable                | ON                                    |
  | ndb_index_stat_option                | loop_enable=1000ms,loop_idle=1000ms,
  loop_busy=100ms,update_batch=1,read_batch=4,idle_batch=32,check_batch=8,
  check_delay=10m,delete_batch=8,clean_delay=1m,error_batch=4,error_delay=1m,
  evict_batch=8,evict_delay=1m,cache_limit=32M,cache_lowpct=90,zero_total=0      |
  | ndb_join_pushdown                    | ON                                    |
  | ndb_log_apply_status                 | OFF                                   |
  | ndb_log_bin                          | ON                                    |
  | ndb_log_binlog_index                 | ON                                    |
  | ndb_log_empty_epochs                 | OFF                                   |
  | ndb_log_empty_update                 | OFF                                   |
  | ndb_log_exclusive_reads              | OFF                                   |
  | ndb_log_orig                         | OFF                                   |
  | ndb_log_transaction_id               | OFF                                   |
  | ndb_log_update_as_write              | ON                                    |
  | ndb_log_update_minimal               | OFF                                   |
  | ndb_log_updated_only                 | ON                                    |
  | ndb_mgmd_host                        | 127.0.0.1                             |
  | ndb_nodeid                           | 0                                     |
  | ndb_optimization_delay               | 10                                    |
  | ndb_optimized_node_selection         | 3                                     |
  | ndb_read_backup                      | OFF                                   |
  | ndb_recv_thread_activation_threshold | 8                                     |
  | ndb_recv_thread_cpu_mask             |                                       |
  | ndb_report_thresh_binlog_epoch_slip  | 10                                    |
  | ndb_report_thresh_binlog_mem_usage   | 10                                    |
  | ndb_row_checksum                     | 1                                     |
  | ndb_show_foreign_key_mock_tables     | OFF                                   |
  | ndb_slave_conflict_role              | NONE                                  |
  | ndb_table_no_logging                 | OFF                                   |
  | ndb_table_temporary                  | OFF                                   |
  | ndb_use_copying_alter_table          | OFF                                   |
  | ndb_use_exact_count                  | OFF                                   |
  | ndb_use_transactions                 | ON                                    |
  | ndb_version                          | 460301                                |
  | ndb_version_string                   | ndb-7.6.36                            |
  | ndb_wait_connected                   | 30                                    |
  | ndb_wait_setup                       | 30                                    |
  | ndbinfo_database                     | ndbinfo                               |
  | ndbinfo_max_bytes                    | 0                                     |
  | ndbinfo_max_rows                     | 10                                    |
  | ndbinfo_offline                      | OFF                                   |
  | ndbinfo_show_hidden                  | OFF                                   |
  | ndbinfo_table_prefix                 | ndb$                                  |
  | ndbinfo_version                      | 460301                                |
  +--------------------------------------+---------------------------------------+
  61 rows in set (0.02 sec)
  ```

  See [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables"), for more information.

* `SELECT * FROM INFORMATION_SCHEMA.GLOBAL_VARIABLES WHERE VARIABLE_NAME LIKE 'NDB%';`

  Although it is deprecated in NDB 7.5 and NDB 7.6, you can use this statement (and others accessing the `INFORMATION_SCHEMA.GLOBAL_VARIABLES` table) if [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) is enabled. (Querying the [`performance_schema.global_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables") table is preferred; see next item.) It is equivalent to the [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") statement described in the previous item, and provides almost identical output, as shown here:

  ```sql
  mysql> SET @@global.show_compatibility_56=ON;
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT * FROM INFORMATION_SCHEMA.GLOBAL_VARIABLES
      ->   WHERE VARIABLE_NAME LIKE 'NDB%';

  mysql> SELECT * FROM INFORMATION_SCHEMA.GLOBAL_VARIABLES WHERE VARIABLE_NAME LIKE 'NDB%';
  +--------------------------------------+---------------------------------------+
  | VARIABLE_NAME                        | VARIABLE_VALUE                        |
  +--------------------------------------+---------------------------------------+
  | NDB_CLUSTER_CONNECTION_POOL_NODEIDS  |                                       |
  | NDB_LOG_BINLOG_INDEX                 | ON                                    |
  | NDB_WAIT_SETUP                       | 30                                    |
  | NDB_ROW_CHECKSUM                     | 1                                     |
  | NDB_WAIT_CONNECTED                   | 30                                    |
  | NDB_USE_EXACT_COUNT                  | OFF                                   |
  | NDB_RECV_THREAD_ACTIVATION_THRESHOLD | 8                                     |
  | NDB_READ_BACKUP                      | OFF                                   |
  | NDB_EVENTBUFFER_MAX_ALLOC            | 0                                     |
  | NDBINFO_DATABASE                     | ndbinfo                               |
  | NDB_LOG_APPLY_STATUS                 | OFF                                   |
  | NDB_JOIN_PUSHDOWN                    | ON                                    |
  | NDB_RECV_THREAD_CPU_MASK             |                                       |
  | NDBINFO_VERSION                      | 460301                                |
  | NDB_CONNECTSTRING                    | 127.0.0.1                             |
  | NDB_TABLE_NO_LOGGING                 | OFF                                   |
  | NDB_LOG_UPDATED_ONLY                 | ON                                    |
  | NDB_VERSION                          | 460301                                |
  | NDB_LOG_UPDATE_MINIMAL               | OFF                                   |
  | NDB_OPTIMIZATION_DELAY               | 10                                    |
  | NDB_DEFAULT_COLUMN_FORMAT            | FIXED                                 |
  | NDB_LOG_UPDATE_AS_WRITE              | ON                                    |
  | NDB_SHOW_FOREIGN_KEY_MOCK_TABLES     | OFF                                   |
  | NDB_VERSION_STRING                   | ndb-7.6.36                            |
  | NDBINFO_OFFLINE                      | OFF                                   |
  | NDB_INDEX_STAT_OPTION                | loop_enable=1000ms,loop_idle=1000ms,
  loop_busy=100ms,update_batch=1,read_batch=4,idle_batch=32,check_batch=8,
  check_delay=10m,delete_batch=8,clean_delay=1m,error_batch=4,error_delay=1m,
  evict_batch=8,evict_delay=1m,cache_limit=32M,cache_lowpct=90,zero_total=0      |
  | NDBINFO_MAX_ROWS                     | 10                                    |
  | NDB_BATCH_SIZE                       | 32768                                 |
  | NDB_USE_TRANSACTIONS                 | ON                                    |
  | NDB_NODEID                           | 0                                     |
  | NDB_ALLOW_COPYING_ALTER_TABLE        | ON                                    |
  | NDB_SLAVE_CONFLICT_ROLE              | NONE                                  |
  | NDB_REPORT_THRESH_BINLOG_MEM_USAGE   | 10                                    |
  | NDB_FULLY_REPLICATED                 | OFF                                   |
  | NDB_MGMD_HOST                        | 127.0.0.1                             |
  | NDB_REPORT_THRESH_BINLOG_EPOCH_SLIP  | 10                                    |
  | NDBINFO_MAX_BYTES                    | 0                                     |
  | NDB_LOG_BIN                          | ON                                    |
  | NDBINFO_TABLE_PREFIX                 | ndb$                                  |
  | NDB_LOG_EMPTY_EPOCHS                 | OFF                                   |
  | NDB_LOG_ORIG                         | OFF                                   |
  | NDB_LOG_EXCLUSIVE_READS              | OFF                                   |
  | NDB_LOG_TRANSACTION_ID               | OFF                                   |
  | NDB_DATA_NODE_NEIGHBOUR              | 0                                     |
  | NDB_CLEAR_APPLY_STATUS               | ON                                    |
  | NDBINFO_SHOW_HIDDEN                  | OFF                                   |
  | NDB_INDEX_STAT_ENABLE                | ON                                    |
  | NDB_DISTRIBUTION                     | KEYHASH                               |
  | NDB_BLOB_WRITE_BATCH_BYTES           | 65536                                 |
  | NDB_DEFERRED_CONSTRAINTS             | 0                                     |
  | NDB_TABLE_TEMPORARY                  | OFF                                   |
  | NDB_EXTRA_LOGGING                    | 1                                     |
  | NDB_AUTOINCREMENT_PREFETCH_SZ        | 1                                     |
  | NDB_FORCE_SEND                       | ON                                    |
  | NDB_OPTIMIZED_NODE_SELECTION         | 3                                     |
  | NDB_CLUSTER_CONNECTION_POOL          | 1                                     |
  | NDB_EVENTBUFFER_FREE_PERCENT         | 20                                    |
  | NDB_USE_COPYING_ALTER_TABLE          | OFF                                   |
  | NDB_CACHE_CHECK_TIME                 | 0                                     |
  | NDB_BLOB_READ_BATCH_BYTES            | 65536                                 |
  | NDB_LOG_EMPTY_UPDATE                 | OFF                                   |
  +--------------------------------------+---------------------------------------+
  61 rows in set, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS;
  +---------+------+-------------------------------------------------------------+
  | Level   | Code | Message                                                     |
  +---------+------+-------------------------------------------------------------+
  | Warning | 1287 | 'INFORMATION_SCHEMA.GLOBAL_VARIABLES' is deprecated and will
  be removed in a future release. Please use performance_schema.global_variables
  instead                                                                        |
  +---------+------+-------------------------------------------------------------+
  ```

  Unlike the case with the [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") statement, it is possible to select individual columns. For example:

  ```sql
  mysql> SELECT VARIABLE_VALUE
      ->   FROM INFORMATION_SCHEMA.GLOBAL_VARIABLES
      ->   WHERE VARIABLE_NAME = 'ndb_force_send';
  +----------------+
  | VARIABLE_VALUE |
  +----------------+
  | ON             |
  +----------------+
  ```

  See [Section 24.3.11, “The INFORMATION\_SCHEMA GLOBAL\_VARIABLES and SESSION\_VARIABLES Tables”](information-schema-variables-table.html "24.3.11 The INFORMATION_SCHEMA GLOBAL_VARIABLES and SESSION_VARIABLES Tables"), and [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables"), for more information. See also [Section 25.20, “Migrating to Performance Schema System and Status Variable Tables”](performance-schema-variable-table-migration.html "25.20 Migrating to Performance Schema System and Status Variable Tables").

* `SELECT * FROM performance_schema.global_variables WHERE VARIABLE_NAME LIKE 'NDB%'`

  This statement is the equivalent of the [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") statement described in the previous item, and is preferred in NDB 7.5 and NDB 7.6 to querying the `INFORMATION_SCHEMA.GLOBAL_VARIABLES` table (now deprecated; see previous item). It provides output almost identical to that produced by `SHOW VARIABLES`, as shown here:

  ```sql
  mysql> SELECT * FROM performance_schema.global_variables
      ->   WHERE VARIABLE_NAME LIKE 'NDB%';
  +--------------------------------------+---------------------------------------+
  | VARIABLE_NAME                        | VARIABLE_VALUE                        |
  +--------------------------------------+---------------------------------------+
  | ndb_allow_copying_alter_table        | ON                                    |
  | ndb_autoincrement_prefetch_sz        | 1                                     |
  | ndb_batch_size                       | 32768                                 |
  | ndb_blob_read_batch_bytes            | 65536                                 |
  | ndb_blob_write_batch_bytes           | 65536                                 |
  | ndb_cache_check_time                 | 0                                     |
  | ndb_clear_apply_status               | ON                                    |
  | ndb_cluster_connection_pool          | 1                                     |
  | ndb_cluster_connection_pool_nodeids  |                                       |
  | ndb_connectstring                    | 127.0.0.1                             |
  | ndb_data_node_neighbour              | 0                                     |
  | ndb_default_column_format            | FIXED                                 |
  | ndb_deferred_constraints             | 0                                     |
  | ndb_distribution                     | KEYHASH                               |
  | ndb_eventbuffer_free_percent         | 20                                    |
  | ndb_eventbuffer_max_alloc            | 0                                     |
  | ndb_extra_logging                    | 1                                     |
  | ndb_force_send                       | ON                                    |
  | ndb_fully_replicated                 | OFF                                   |
  | ndb_index_stat_enable                | ON                                    |
  | ndb_index_stat_option                | loop_enable=1000ms,loop_idle=1000ms,
  loop_busy=100ms,update_batch=1,read_batch=4,idle_batch=32,check_batch=8,
  check_delay=10m,delete_batch=8,clean_delay=1m,error_batch=4,error_delay=1m,
  evict_batch=8,evict_delay=1m,cache_limit=32M,cache_lowpct=90,zero_total=0      |
  | ndb_join_pushdown                    | ON                                    |
  | ndb_log_apply_status                 | OFF                                   |
  | ndb_log_bin                          | ON                                    |
  | ndb_log_binlog_index                 | ON                                    |
  | ndb_log_empty_epochs                 | OFF                                   |
  | ndb_log_empty_update                 | OFF                                   |
  | ndb_log_exclusive_reads              | OFF                                   |
  | ndb_log_orig                         | OFF                                   |
  | ndb_log_transaction_id               | OFF                                   |
  | ndb_log_update_as_write              | ON                                    |
  | ndb_log_update_minimal               | OFF                                   |
  | ndb_log_updated_only                 | ON                                    |
  | ndb_mgmd_host                        | 127.0.0.1                             |
  | ndb_nodeid                           | 0                                     |
  | ndb_optimization_delay               | 10                                    |
  | ndb_optimized_node_selection         | 3                                     |
  | ndb_read_backup                      | OFF                                   |
  | ndb_recv_thread_activation_threshold | 8                                     |
  | ndb_recv_thread_cpu_mask             |                                       |
  | ndb_report_thresh_binlog_epoch_slip  | 10                                    |
  | ndb_report_thresh_binlog_mem_usage   | 10                                    |
  | ndb_row_checksum                     | 1                                     |
  | ndb_show_foreign_key_mock_tables     | OFF                                   |
  | ndb_slave_conflict_role              | NONE                                  |
  | ndb_table_no_logging                 | OFF                                   |
  | ndb_table_temporary                  | OFF                                   |
  | ndb_use_copying_alter_table          | OFF                                   |
  | ndb_use_exact_count                  | OFF                                   |
  | ndb_use_transactions                 | ON                                    |
  | ndb_version                          | 460301                                |
  | ndb_version_string                   | ndb-7.6.36                            |
  | ndb_wait_connected                   | 30                                    |
  | ndb_wait_setup                       | 30                                    |
  | ndbinfo_database                     | ndbinfo                               |
  | ndbinfo_max_bytes                    | 0                                     |
  | ndbinfo_max_rows                     | 10                                    |
  | ndbinfo_offline                      | OFF                                   |
  | ndbinfo_show_hidden                  | OFF                                   |
  | ndbinfo_table_prefix                 | ndb$                                  |
  | ndbinfo_version                      | 460301                                |
  +--------------------------------------+---------------------------------------+
  ```

  Unlike the case with the [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") statement, it is possible to select individual columns. For example:

  ```sql
  mysql> SELECT VARIABLE_VALUE
      ->   FROM performance_schema.global_variables
      ->   WHERE VARIABLE_NAME = 'ndb_force_send';
  +----------------+
  | VARIABLE_VALUE |
  +----------------+
  | ON             |
  +----------------+
  ```

  A more useful query is shown here:

  ```sql
  mysql> SELECT VARIABLE_NAME AS Name, VARIABLE_VALUE AS Value
       >   FROM performance_schema.global_variables
       >   WHERE VARIABLE_NAME
       >     IN ('version', 'ndb_version',
       >       'ndb_version_string', 'ndbinfo_version');

  +--------------------+-------------------+
  | Name               | Value             |
  +--------------------+-------------------+
  | ndb_version        | 460301            |
  | ndb_version_string | ndb-7.6.36        |
  | ndbinfo_version    | 460301            |
  | version            | 5.7.44-ndb-7.6.36 |
  +--------------------+-------------------+
  ```

  See [Section 25.12.13, “Performance Schema System Variable Tables”](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables"), and [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables"), for more information.

* `SHOW STATUS LIKE 'NDB%'`

  This statement shows at a glance whether or not the MySQL server is acting as a cluster SQL node, and if so, it provides the MySQL server's cluster node ID, the host name and port for the cluster management server to which it is connected, and the number of data nodes in the cluster, as shown here:

  ```sql
  mysql> SHOW STATUS LIKE 'NDB%';
  +----------------------------------------------+-------------------------------+
  | Variable_name                                | Value                         |
  +----------------------------------------------+-------------------------------+
  | Ndb_api_wait_exec_complete_count             | 2                             |
  | Ndb_api_wait_scan_result_count               | 5                             |
  | Ndb_api_wait_meta_request_count              | 54                            |
  | Ndb_api_wait_nanos_count                     | 1849442202547                 |
  | Ndb_api_bytes_sent_count                     | 2044                          |
  | Ndb_api_bytes_received_count                 | 81384                         |
  | Ndb_api_trans_start_count                    | 2                             |
  | Ndb_api_trans_commit_count                   | 1                             |
  | Ndb_api_trans_abort_count                    | 0                             |
  | Ndb_api_trans_close_count                    | 2                             |
  | Ndb_api_pk_op_count                          | 1                             |
  | Ndb_api_uk_op_count                          | 0                             |
  | Ndb_api_table_scan_count                     | 1                             |
  | Ndb_api_range_scan_count                     | 0                             |
  | Ndb_api_pruned_scan_count                    | 0                             |
  | Ndb_api_scan_batch_count                     | 2                             |
  | Ndb_api_read_row_count                       | 4                             |
  | Ndb_api_trans_local_read_row_count           | 2                             |
  | Ndb_api_adaptive_send_forced_count           | 0                             |
  | Ndb_api_adaptive_send_unforced_count         | 3                             |
  | Ndb_api_adaptive_send_deferred_count         | 0                             |
  | Ndb_api_event_data_count                     | 0                             |
  | Ndb_api_event_nondata_count                  | 0                             |
  | Ndb_api_event_bytes_count                    | 0                             |
  | Ndb_api_wait_exec_complete_count_slave       | 0                             |
  | Ndb_api_wait_scan_result_count_slave         | 0                             |
  | Ndb_api_wait_meta_request_count_slave        | 0                             |
  | Ndb_api_wait_nanos_count_slave               | 0                             |
  | Ndb_api_bytes_sent_count_slave               | 0                             |
  | Ndb_api_bytes_received_count_slave           | 0                             |
  | Ndb_api_trans_start_count_slave              | 0                             |
  | Ndb_api_trans_commit_count_slave             | 0                             |
  | Ndb_api_trans_abort_count_slave              | 0                             |
  | Ndb_api_trans_close_count_slave              | 0                             |
  | Ndb_api_pk_op_count_slave                    | 0                             |
  | Ndb_api_uk_op_count_slave                    | 0                             |
  | Ndb_api_table_scan_count_slave               | 0                             |
  | Ndb_api_range_scan_count_slave               | 0                             |
  | Ndb_api_pruned_scan_count_slave              | 0                             |
  | Ndb_api_scan_batch_count_slave               | 0                             |
  | Ndb_api_read_row_count_slave                 | 0                             |
  | Ndb_api_trans_local_read_row_count_slave     | 0                             |
  | Ndb_api_adaptive_send_forced_count_slave     | 0                             |
  | Ndb_api_adaptive_send_unforced_count_slave   | 0                             |
  | Ndb_api_adaptive_send_deferred_count_slave   | 0                             |
  | Ndb_slave_max_replicated_epoch               | 0                             |
  | Ndb_api_event_data_count_injector            | 0                             |
  | Ndb_api_event_nondata_count_injector         | 0                             |
  | Ndb_api_event_bytes_count_injector           | 0                             |
  | Ndb_cluster_node_id                          | 100                           |
  | Ndb_config_from_host                         | 127.0.0.1                     |
  | Ndb_config_from_port                         | 1186                          |
  | Ndb_number_of_data_nodes                     | 2                             |
  | Ndb_number_of_ready_data_nodes               | 2                             |
  | Ndb_connect_count                            | 0                             |
  | Ndb_execute_count                            | 0                             |
  | Ndb_scan_count                               | 0                             |
  | Ndb_pruned_scan_count                        | 0                             |
  | Ndb_schema_locks_count                       | 0                             |
  | Ndb_api_wait_exec_complete_count_session     | 0                             |
  | Ndb_api_wait_scan_result_count_session       | 0                             |
  | Ndb_api_wait_meta_request_count_session      | 0                             |
  | Ndb_api_wait_nanos_count_session             | 0                             |
  | Ndb_api_bytes_sent_count_session             | 0                             |
  | Ndb_api_bytes_received_count_session         | 0                             |
  | Ndb_api_trans_start_count_session            | 0                             |
  | Ndb_api_trans_commit_count_session           | 0                             |
  | Ndb_api_trans_abort_count_session            | 0                             |
  | Ndb_api_trans_close_count_session            | 0                             |
  | Ndb_api_pk_op_count_session                  | 0                             |
  | Ndb_api_uk_op_count_session                  | 0                             |
  | Ndb_api_table_scan_count_session             | 0                             |
  | Ndb_api_range_scan_count_session             | 0                             |
  | Ndb_api_pruned_scan_count_session            | 0                             |
  | Ndb_api_scan_batch_count_session             | 0                             |
  | Ndb_api_read_row_count_session               | 0                             |
  | Ndb_api_trans_local_read_row_count_session   | 0                             |
  | Ndb_api_adaptive_send_forced_count_session   | 0                             |
  | Ndb_api_adaptive_send_unforced_count_session | 0                             |
  | Ndb_api_adaptive_send_deferred_count_session | 0                             |
  | Ndb_sorted_scan_count                        | 0                             |
  | Ndb_pushed_queries_defined                   | 0                             |
  | Ndb_pushed_queries_dropped                   | 0                             |
  | Ndb_pushed_queries_executed                  | 0                             |
  | Ndb_pushed_reads                             | 0                             |
  | Ndb_last_commit_epoch_server                 | 29347511533580                |
  | Ndb_last_commit_epoch_session                | 0                             |
  | Ndb_system_name                              | MC_20191209172820             |
  | Ndb_conflict_fn_max                          | 0                             |
  | Ndb_conflict_fn_old                          | 0                             |
  | Ndb_conflict_fn_max_del_win                  | 0                             |
  | Ndb_conflict_fn_epoch                        | 0                             |
  | Ndb_conflict_fn_epoch_trans                  | 0                             |
  | Ndb_conflict_fn_epoch2                       | 0                             |
  | Ndb_conflict_fn_epoch2_trans                 | 0                             |
  | Ndb_conflict_trans_row_conflict_count        | 0                             |
  | Ndb_conflict_trans_row_reject_count          | 0                             |
  | Ndb_conflict_trans_reject_count              | 0                             |
  | Ndb_conflict_trans_detect_iter_count         | 0                             |
  | Ndb_conflict_trans_conflict_commit_count     | 0                             |
  | Ndb_conflict_epoch_delete_delete_count       | 0                             |
  | Ndb_conflict_reflected_op_prepare_count      | 0                             |
  | Ndb_conflict_reflected_op_discard_count      | 0                             |
  | Ndb_conflict_refresh_op_count                | 0                             |
  | Ndb_conflict_last_conflict_epoch             | 0                             |
  | Ndb_conflict_last_stable_epoch               | 0                             |
  | Ndb_index_stat_status                        | allow:1,enable:1,busy:0,
  loop:1000,list:(new:0,update:0,read:0,idle:0,check:0,delete:0,error:0,total:0),
  analyze:(queue:0,wait:0),stats:(nostats:0,wait:0),total:(analyze:(all:0,error:0),
  query:(all:0,nostats:0,error:0),event:(act:0,skip:0,miss:0),
  cache:(refresh:0,clean:0,pinned:0,drop:0,evict:0)),
  cache:(query:0,clean:0,drop:0,evict:0,usedpct:0.00,highpct:0.00)               |
  | Ndb_index_stat_cache_query                   | 0                             |
  | Ndb_index_stat_cache_clean                   | 0                             |
  +----------------------------------------------+-------------------------------+
  ```

  If the MySQL server was built with clustering support, but it is not connected to a cluster, all rows in the output of this statement contain a zero or an empty string.

  See also [Section 13.7.5.35, “SHOW STATUS Statement”](show-status.html "13.7.5.35 SHOW STATUS Statement").

* `SELECT * FROM INFORMATION_SCHEMA.GLOBAL_STATUS WHERE VARIABLE_NAME LIKE 'NDB%';`

  This statement, although deprecated in NDB 7.5 and NDB 7.6, can be used if [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) is enabled to obtain similar output to the [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") statement discussed in the previous item; the preferred method is to query the [`performance_schema.global_status`](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables") table (see next item). Unlike the case with [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is possible using the [`SELECT`](select.html "13.2.9 SELECT Statement") to extract values in SQL for use in scripts for monitoring and automation purposes.

  See [Section 24.3.10, “The INFORMATION\_SCHEMA GLOBAL\_STATUS and SESSION\_STATUS Tables”](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables"), as well as [Section 25.20, “Migrating to Performance Schema System and Status Variable Tables”](performance-schema-variable-table-migration.html "25.20 Migrating to Performance Schema System and Status Variable Tables"), for more information.

* `SELECT * FROM performance_schema.global_status WHERE VARIABLE_NAME LIKE 'NDB%'`

  This statement provides similar output to the [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") statement discussed previously. Unlike the case with [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), it is possible using [`SELECT`](select.html "13.2.9 SELECT Statement") statements to extract values in SQL for use in scripts for monitoring and automation purposes.

  See [Section 25.12.14, “Performance Schema Status Variable Tables”](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables"), for more information.

* `SELECT * FROM INFORMATION_SCHEMA.PLUGINS WHERE PLUGIN_NAME LIKE 'NDB%'`

  This statement displays information from the Information Schema [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") table about plugins associated with NDB Cluster, such as version, author, and license, as shown here:

  ```sql
  mysql> SELECT * FROM INFORMATION_SCHEMA.PLUGINS
       >     WHERE PLUGIN_NAME LIKE 'NDB%'\G
  *************************** 1. row ***************************
             PLUGIN_NAME: ndbcluster
          PLUGIN_VERSION: 1.0
           PLUGIN_STATUS: ACTIVE
             PLUGIN_TYPE: STORAGE ENGINE
     PLUGIN_TYPE_VERSION: 50729.0
          PLUGIN_LIBRARY: NULL
  PLUGIN_LIBRARY_VERSION: NULL
           PLUGIN_AUTHOR: MySQL AB
      PLUGIN_DESCRIPTION: Clustered, fault-tolerant tables
          PLUGIN_LICENSE: GPL
             LOAD_OPTION: ON
  *************************** 2. row ***************************
             PLUGIN_NAME: ndbinfo
          PLUGIN_VERSION: 0.1
           PLUGIN_STATUS: ACTIVE
             PLUGIN_TYPE: STORAGE ENGINE
     PLUGIN_TYPE_VERSION: 50744.0
          PLUGIN_LIBRARY: NULL
  PLUGIN_LIBRARY_VERSION: NULL
           PLUGIN_AUTHOR: Sun Microsystems Inc.
      PLUGIN_DESCRIPTION: MySQL Cluster system information storage engine
          PLUGIN_LICENSE: GPL
             LOAD_OPTION: ON
  *************************** 3. row ***************************
             PLUGIN_NAME: ndb_transid_mysql_connection_map
          PLUGIN_VERSION: 0.1
           PLUGIN_STATUS: ACTIVE
             PLUGIN_TYPE: INFORMATION SCHEMA
     PLUGIN_TYPE_VERSION: 50744.0
          PLUGIN_LIBRARY: NULL
  PLUGIN_LIBRARY_VERSION: NULL
           PLUGIN_AUTHOR: Oracle Corporation
      PLUGIN_DESCRIPTION: Map between mysql connection id and ndb transaction id
          PLUGIN_LICENSE: GPL
             LOAD_OPTION: ON
  ```

  You can also use the [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") statement to display this information, but the output from that statement cannot easily be filtered. See also [The MySQL Plugin API](/doc/extending-mysql/5.7/en/plugin-api.html), which describes where and how the information in the [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") table is obtained.

You can also query the tables in the [`ndbinfo`](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database") information database for real-time data about many NDB Cluster operations. See [Section 21.6.15, “ndbinfo: The NDB Cluster Information Database”](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database").
