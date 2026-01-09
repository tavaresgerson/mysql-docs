#### 25.4.2.5 NDB Cluster mysqld Option and Variable Reference

The following list includes command-line options, system variables, and status variables applicable within `mysqld` when it is running as an SQL node in an NDB Cluster. For a reference to *all* command-line options, system variables, and status variables used with or relating to **mysqld**, see Section 7.1.4, “Server Option, System Variable, and Status Variable Reference”.

* `Com_show_ndb_status`: Count of SHOW NDB STATUS statements.

* `Handler_discover`: Number of times that tables have been discovered.

* `ndb-applier-allow-skip-epoch`: Lets replication applier skip epochs.

* `ndb-batch-size`: Size (in bytes) to use for NDB transaction batches.

* `ndb-blob-read-batch-bytes`: Specifies size in bytes that large BLOB reads should be batched into. 0 = no limit.

* `ndb-blob-write-batch-bytes`: Specifies size in bytes that large BLOB writes should be batched into. 0 = no limit.

* `ndb-cluster-connection-pool`: Number of connections to cluster used by MySQL.

* `ndb-cluster-connection-pool-nodeids`: Comma-separated list of node IDs for connections to cluster used by MySQL; number of nodes in list must match value set for --ndb-cluster-connection-pool.

* `ndb-connectstring`: Address of NDB management server distributing configuration information for this cluster.

* `ndb-default-column-format`: Use this value (FIXED or DYNAMIC) by default for COLUMN_FORMAT and ROW_FORMAT options when creating or adding table columns.

* `ndb-deferred-constraints`: Specifies that constraint checks on unique indexes (where these are supported) should be deferred until commit time. Not normally needed or used; for testing purposes only.

* `ndb-distribution`: Default distribution for new tables in NDBCLUSTER (KEYHASH or LINHASH, default is KEYHASH).

* `ndb-log-apply-status`: Cause MySQL server acting as replica to log mysql.ndb_apply_status updates received from its immediate source in its own binary log, using its own server ID. Effective only if server is started with --ndbcluster option.

* `ndb-log-empty-epochs`: When enabled, causes epochs in which there were no changes to be written to ndb_apply_status and ndb_binlog_index tables, even when --log-slave-updates is enabled.

* `ndb-log-empty-update`: When enabled, causes updates that produced no changes to be written to ndb_apply_status and ndb_binlog_index tables, even when --log-slave-updates is enabled.

* `ndb-log-exclusive-reads`: Log primary key reads with exclusive locks; allow conflict resolution based on read conflicts.

* `ndb-log-fail-terminate`: Terminate mysqld process if complete logging of all found row events is not possible.

* `ndb-log-orig`: Log originating server id and epoch in mysql.ndb_binlog_index table.

* `ndb-log-row-slice-count`: Number of slices to be calculated by this server when subscribing to NDB table change event streams used for writing binary logs.

* `ndb-log-row-slice-id`: ID of virtual slice (of NDB table change event streams) subscribed to by this server.

* `ndb-log-transaction-dependency`: Make binary log thread calculate transaction dependencies for every transaction it writes to binary log.

* `ndb-log-transaction-id`: Write NDB transaction IDs in binary log. Requires --log-bin-v1-events=OFF.

* `ndb-log-update-minimal`: Log updates in minimal format.

* `ndb-log-updated-only`: Log updates only (ON) or complete rows (OFF).

* `ndb-log-update-as-write`: Toggles logging of updates on source between updates (OFF) and writes (ON).

* `ndb-mgm-tls`: Whether TLS connection requirements are strict or relaxed.

* `ndb-mgmd-host`: Set host (and port, if desired) for connecting to management server.

* `ndb-nodeid`: NDB Cluster node ID for this MySQL server.

* `ndb-optimized-node-selection`: Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable.

* `ndb-tls-search-path`: Directories to search for NDB TLS CAs and private keys.

* `ndb-transid-mysql-connection-map`: Enable or disable ndb_transid_mysql_connection_map plugin; that is, enable or disable INFORMATION_SCHEMA table having that name.

* `ndb-wait-connected`: Time (in seconds) for MySQL server to wait for connection to cluster management and data nodes before accepting MySQL client connections.

* `ndb-wait-setup`: Time (in seconds) for MySQL server to wait for NDB engine setup to complete.

* `ndb-allow-copying-alter-table`: Set to OFF to keep ALTER TABLE from using copying operations on NDB tables.

* `Ndb_api_adaptive_send_deferred_count`: Number of adaptive send calls not actually sent by this MySQL Server (SQL node).

* `Ndb_api_adaptive_send_deferred_count_session`: Number of adaptive send calls not actually sent in this client session.

* `Ndb_api_adaptive_send_deferred_count_replica`: Number of adaptive send calls not actually sent by this replica.

* `Ndb_api_adaptive_send_deferred_count_slave`: Number of adaptive send calls not actually sent by this replica.

* `Ndb_api_adaptive_send_forced_count`: Number of adaptive sends with forced-send set sent by this MySQL Server (SQL node).

* `Ndb_api_adaptive_send_forced_count_session`: Number of adaptive sends with forced-send set in this client session.

* `Ndb_api_adaptive_send_forced_count_replica`: Number of adaptive sends with forced-send set sent by this replica.

* `Ndb_api_adaptive_send_forced_count_slave`: Number of adaptive sends with forced-send set sent by this replica.

* `Ndb_api_adaptive_send_unforced_count`: Number of adaptive sends without forced-send sent by this MySQL Server (SQL node).

* `Ndb_api_adaptive_send_unforced_count_session`: Number of adaptive sends without forced-send in this client session.

* `Ndb_api_adaptive_send_unforced_count_replica`: Number of adaptive sends without forced-send sent by this replica.

* `Ndb_api_adaptive_send_unforced_count_slave`: Number of adaptive sends without forced-send sent by this replica.

* `Ndb_api_bytes_received_count`: Quantity of data (in bytes) received from data nodes by this MySQL Server (SQL node).

* `Ndb_api_bytes_received_count_session`: Quantity of data (in bytes) received from data nodes in this client session.

* `Ndb_api_bytes_received_count_replica`: Quantity of data (in bytes) received from data nodes by this replica.

* `Ndb_api_bytes_received_count_slave`: Quantity of data (in bytes) received from data nodes by this replica.

* `Ndb_api_bytes_sent_count`: Quantity of data (in bytes) sent to data nodes by this MySQL Server (SQL node).

* `Ndb_api_bytes_sent_count_session`: Quantity of data (in bytes) sent to data nodes in this client session.

* `Ndb_api_bytes_sent_count_replica`: Qunatity of data (in bytes) sent to data nodes by this replica.

* `Ndb_api_bytes_sent_count_slave`: Qunatity of data (in bytes) sent to data nodes by this replica.

* `Ndb_api_event_bytes_count`: Number of bytes of events received by this MySQL Server (SQL node).

* `Ndb_api_event_bytes_count_injector`: Number of bytes of event data received by NDB binary log injector thread.

* `Ndb_api_event_data_count`: Number of row change events received by this MySQL Server (SQL node).

* `Ndb_api_event_data_count_injector`: Number of row change events received by NDB binary log injector thread.

* `Ndb_api_event_nondata_count`: Number of events received, other than row change events, by this MySQL Server (SQL node).

* `Ndb_api_event_nondata_count_injector`: Number of events received, other than row change events, by NDB binary log injector thread.

* `Ndb_api_pk_op_count`: Number of operations based on or using primary keys by this MySQL Server (SQL node).

* `Ndb_api_pk_op_count_session`: Number of operations based on or using primary keys in this client session.

* `Ndb_api_pk_op_count_replica`: Number of operations based on or using primary keys by this replica.

* `Ndb_api_pk_op_count_slave`: Number of operations based on or using primary keys by this replica.

* `Ndb_api_pruned_scan_count`: Number of scans that have been pruned to one partition by this MySQL Server (SQL node).

* `Ndb_api_pruned_scan_count_session`: Number of scans that have been pruned to one partition in this client session.

* `Ndb_api_pruned_scan_count_replica`: Number of scans that have been pruned to one partition by this replica.

* `Ndb_api_pruned_scan_count_slave`: Number of scans that have been pruned to one partition by this replica.

* `Ndb_api_range_scan_count`: Number of range scans that have been started by this MySQL Server (SQL node).

* `Ndb_api_range_scan_count_session`: Number of range scans that have been started in this client session.

* `Ndb_api_range_scan_count_replica`: Number of range scans that have been started by this replica.

* `Ndb_api_range_scan_count_slave`: Number of range scans that have been started by this replica.

* `Ndb_api_read_row_count`: Total number of rows that have been read by this MySQL Server (SQL node).

* `Ndb_api_read_row_count_session`: Total number of rows that have been read in this client session.

* `Ndb_api_read_row_count_replica`: Total number of rows that have been read by this replica.

* `Ndb_api_read_row_count_slave`: Total number of rows that have been read by this replica.

* `Ndb_api_scan_batch_count`: Number of batches of rows received by this MySQL Server (SQL node).

* `Ndb_api_scan_batch_count_session`: Number of batches of rows received in this client session.

* `Ndb_api_scan_batch_count_replica`: Number of batches of rows received by this replica.

* `Ndb_api_scan_batch_count_slave`: Number of batches of rows received by this replica.

* `Ndb_api_table_scan_count`: Number of table scans that have been started, including scans of internal tables, by this MySQL Server (SQL node).

* `Ndb_api_table_scan_count_session`: Number of table scans that have been started, including scans of internal tables, in this client session.

* `Ndb_api_table_scan_count_replica`: Number of table scans that have been started, including scans of internal tables, by this replica.

* `Ndb_api_table_scan_count_slave`: Number of table scans that have been started, including scans of internal tables, by this replica.

* `Ndb_api_trans_abort_count`: Number of transactions aborted by this MySQL Server (SQL node).

* `Ndb_api_trans_abort_count_session`: Number of transactions aborted in this client session.

* `Ndb_api_trans_abort_count_replica`: Number of transactions aborted by this replica.

* `Ndb_api_trans_abort_count_slave`: Number of transactions aborted by this replica.

* `Ndb_api_trans_close_count`: Number of transactions closed by this MySQL Server (SQL node); may be greater than sum of TransCommitCount and TransAbortCount.

* `Ndb_api_trans_close_count_session`: Number of transactions aborted (may be greater than sum of TransCommitCount and TransAbortCount) in this client session.

* `Ndb_api_trans_close_count_replica`: Number of transactions aborted (may be greater than sum of TransCommitCount and TransAbortCount) by this replica.

* `Ndb_api_trans_close_count_slave`: Number of transactions aborted (may be greater than sum of TransCommitCount and TransAbortCount) by this replica.

* `Ndb_api_trans_commit_count`: Number of transactions committed by this MySQL Server (SQL node).

* `Ndb_api_trans_commit_count_session`: Number of transactions committed in this client session.

* `Ndb_api_trans_commit_count_replica`: Number of transactions committed by this replica.

* `Ndb_api_trans_commit_count_slave`: Number of transactions committed by this replica.

* `Ndb_api_trans_local_read_row_count`: Total number of rows that have been read by this MySQL Server (SQL node).

* `Ndb_api_trans_local_read_row_count_session`: Total number of rows that have been read in this client session.

* `Ndb_api_trans_local_read_row_count_replica`: Total number of rows that have been read by this replica.

* `Ndb_api_trans_local_read_row_count_slave`: Total number of rows that have been read by this replica.

* `Ndb_api_trans_start_count`: Number of transactions started by this MySQL Server (SQL node).

* `Ndb_api_trans_start_count_session`: Number of transactions started in this client session.

* `Ndb_api_trans_start_count_replica`: Number of transactions started by this replica.

* `Ndb_api_trans_start_count_slave`: Number of transactions started by this replica.

* `Ndb_api_uk_op_count`: Number of operations based on or using unique keys by this MySQL Server (SQL node).

* `Ndb_api_uk_op_count_session`: Number of operations based on or using unique keys in this client session.

* `Ndb_api_uk_op_count_replica`: Number of operations based on or using unique keys by this replica.

* `Ndb_api_uk_op_count_slave`: Number of operations based on or using unique keys by this replica.

* `Ndb_api_wait_exec_complete_count`: Number of times thread has been blocked while waiting for operation execution to complete by this MySQL Server (SQL node).

* `Ndb_api_wait_exec_complete_count_session`: Number of times thread has been blocked while waiting for operation execution to complete in this client session.

* `Ndb_api_wait_exec_complete_count_replica`: Number of times thread has been blocked while waiting for operation execution to complete by this replica.

* `Ndb_api_wait_exec_complete_count_slave`: Number of times thread has been blocked while waiting for operation execution to complete by this replica.

* `Ndb_api_wait_meta_request_count`: Number of times thread has been blocked waiting for metadata-based signal by this MySQL Server (SQL node).

* `Ndb_api_wait_meta_request_count_session`: Number of times thread has been blocked waiting for metadata-based signal in this client session.

* `Ndb_api_wait_meta_request_count_replica`: Number of times thread has been blocked waiting for metadata-based signal by this replica.

* `Ndb_api_wait_meta_request_count_slave`: Number of times thread has been blocked waiting for metadata-based signal by this replica.

* `Ndb_api_wait_nanos_count`: Total time (in nanoseconds) spent waiting for some type of signal from data nodes by this MySQL Server (SQL node).

* `Ndb_api_wait_nanos_count_session`: Total time (in nanoseconds) spent waiting for some type of signal from data nodes in this client session.

* `Ndb_api_wait_nanos_count_replica`: Total time (in nanoseconds) spent waiting for some type of signal from data nodes by this replica.

* `Ndb_api_wait_nanos_count_slave`: Total time (in nanoseconds) spent waiting for some type of signal from data nodes by this replica.

* `Ndb_api_wait_scan_result_count`: Number of times thread has been blocked while waiting for scan-based signal by this MySQL Server (SQL node).

* `Ndb_api_wait_scan_result_count_session`: Number of times thread has been blocked while waiting for scan-based signal in this client session.

* `Ndb_api_wait_scan_result_count_replica`: Number of times thread has been blocked while waiting for scan-based signal by this replica.

* `Ndb_api_wait_scan_result_count_slave`: Number of times thread has been blocked while waiting for scan-based signal by this replica.

* `ndb_autoincrement_prefetch_sz`: NDB auto-increment prefetch size.

* `ndb_clear_apply_status`: Causes RESET SLAVE/RESET REPLICA to clear all rows from ndb_apply_status table; ON by default.

* `Ndb_cluster_node_id`: Node ID of this server when acting as NDB Cluster SQL node.

* `Ndb_config_from_host`: NDB Cluster management server host name or IP address.

* `Ndb_config_from_port`: Port for connecting to NDB Cluster management server.

* `Ndb_config_generation`: Generation number of the current configuration of the cluster.

* `Ndb_conflict_fn_epoch`: Number of rows that have been found in conflict by NDB$EPOCH() NDB replication conflict detection function.

* `Ndb_conflict_fn_epoch2`: Number of rows that have been found in conflict by NDB replication NDB$EPOCH2() conflict detection function.

* `Ndb_conflict_fn_epoch2_trans`: Number of rows that have been found in conflict by NDB replication NDB$EPOCH2_TRANS() conflict detection function.

* `Ndb_conflict_fn_epoch_trans`: Number of rows that have been found in conflict by NDB$EPOCH_TRANS() conflict detection function.

* `Ndb_conflict_fn_max`: Number of times that NDB replication conflict resolution based on "greater timestamp wins" has been applied to update and delete operations.

* `Ndb_conflict_fn_max_del_win`: Number of times that NDB replication conflict resolution based on outcome of NDB$MAX_DELETE_WIN() has been applied to update and delete operations.

* `Ndb_conflict_fn_max_ins`: Number of times that NDB replication conflict resolution based on "greater timestamp wins" has been applied to insert operations.

* `Ndb_conflict_fn_max_del_win_ins`: Number of times that NDB replication conflict resolution based on outcome of NDB$MAX_DEL_WIN_INS() has been applied to insert operations.

* `Ndb_conflict_fn_old`: Number of times that NDB replication "same timestamp wins" conflict resolution has been applied.

* `Ndb_conflict_last_conflict_epoch`: Most recent NDB epoch on this replica in which some conflict was detected.

* `Ndb_conflict_last_stable_epoch`: Most recent epoch containing no conflicts.

* `Ndb_conflict_reflected_op_discard_count`: Number of reflected operations that were not applied due error during execution.

* `Ndb_conflict_reflected_op_prepare_count`: Number of reflected operations received that have been prepared for execution.

* `Ndb_conflict_refresh_op_count`: Number of refresh operations that have been prepared.

* `ndb_conflict_role`: Role for replica to play in conflict detection and resolution. Value is one of PRIMARY, SECONDARY, PASS, or NONE (default). Can be changed only when replication SQL thread is stopped. See documentation for further information.

* `Ndb_conflict_trans_conflict_commit_count`: Number of epoch transactions committed after requiring transactional conflict handling.

* `Ndb_conflict_trans_detect_iter_count`: Number of internal iterations required to commit epoch transaction. Should be (slightly) greater than or equal to Ndb_conflict_trans_conflict_commit_count.

* `Ndb_conflict_trans_reject_count`: Number of transactions rejected after being found in conflict by transactional conflict function.

* `Ndb_conflict_trans_row_conflict_count`: Number of rows found in conflict by transactional conflict function. Includes any rows included in or dependent on conflicting transactions.

* `Ndb_conflict_trans_row_reject_count`: Total number of rows realigned after being found in conflict by transactional conflict function. Includes Ndb_conflict_trans_row_conflict_count and any rows included in or dependent on conflicting transactions.

* `ndb_data_node_neighbour`: Specifies cluster data node "closest" to this MySQL Server, for transaction hinting and fully replicated tables.

* `ndb_default_column_format`: Sets default row format and column format (FIXED or DYNAMIC) used for new NDB tables.

* `ndb_deferred_constraints`: Specifies that constraint checks should be deferred (where these are supported). Not normally needed or used; for testing purposes only.

* `ndb_dbg_check_shares`: Check for any lingering shares (debug builds only).

* `ndb-schema-dist-timeout`: How long to wait before detecting timeout during schema distribution.

* `ndb_distribution`: Default distribution for new tables in NDBCLUSTER (KEYHASH or LINHASH, default is KEYHASH).

* `Ndb_epoch_delete_delete_count`: Number of delete-delete conflicts detected (delete operation is applied, but row does not exist).

* `ndb_eventbuffer_free_percent`: Percentage of free memory that should be available in event buffer before resumption of buffering, after reaching limit set by ndb_eventbuffer_max_alloc.

* `ndb_eventbuffer_max_alloc`: Maximum memory that can be allocated for buffering events by NDB API. Defaults to 0 (no limit).

* `ndb_extra_logging`: Controls logging of NDB Cluster schema, connection, and data distribution events in MySQL error log.

* `Ndb_fetch_table_stats`: Number of times table statistics were fetched from tables rather than cache.

* `ndb_force_send`: Forces sending of buffers to NDB immediately, without waiting for other threads.

* `ndb_fully_replicated`: Whether new NDB tables are fully replicated.

* `ndb_index_stat_enable`: Use NDB index statistics in query optimization.

* `ndb_index_stat_option`: Comma-separated list of tunable options for NDB index statistics; list should contain no spaces.

* `ndb_join_pushdown`: Enables pushing down of joins to data nodes.

* `Ndb_last_commit_epoch_server`: Epoch most recently committed by NDB.

* `Ndb_last_commit_epoch_session`: Epoch most recently committed by this NDB client.

* `ndb_log_apply_status`: Whether or not MySQL server acting as replica logs mysql.ndb_apply_status updates received from its immediate source in its own binary log, using its own server ID.

* `ndb_log_bin`: Write updates to NDB tables in binary log. Effective only if binary logging is enabled with --log-bin.

* `ndb_log_binlog_index`: Insert mapping between epochs and binary log positions into ndb_binlog_index table. Defaults to ON. Effective only if binary logging is enabled.

* `ndb_log_cache_size`: Set size of transaction cache used for recording NDB binary log.

* `ndb_log_empty_epochs`: When enabled, epochs in which there were no changes are written to ndb_apply_status and ndb_binlog_index tables, even when log_replica_updates or log_slave_updates is enabled.

* `ndb_log_empty_update`: When enabled, updates which produce no changes are written to ndb_apply_status and ndb_binlog_index tables, even when log_replica_updates or log_slave_updates is enabled.

* `ndb_log_exclusive_reads`: Log primary key reads with exclusive locks; allow conflict resolution based on read conflicts.

* `ndb_log_orig`: Whether id and epoch of originating server are recorded in mysql.ndb_binlog_index table. Set using --ndb-log-orig option when starting mysqld.

* `ndb_log_transaction_id`: Whether NDB transaction IDs are written into binary log (Read-only).

* `ndb_log_transaction_compression`: Whether to compress NDB binary log; can also be enabled on startup by enabling --binlog-transaction-compression option.

* `ndb_log_transaction_compression_level_zstd`: The ZSTD compression level to use when writing compressed transactions to the NDB binary log.

* `ndb_metadata_check`: Enable auto-detection of NDB metadata changes with respect to MySQL data dictionary; enabled by default.

* `ndb_metadata_check_interval`: Interval in seconds to perform check for NDB metadata changes with respect to MySQL data dictionary.

* `Ndb_metadata_detected_count`: Number of times NDB metadata change monitor thread has detected changes.

* `Ndb_metadata_excluded_count`: Number of NDB metadata objects that NDB binlog thread has failed to synchronize.

* `ndb_metadata_sync`: Triggers immediate synchronization of all changes between NDB dictionary and MySQL data dictionary; causes ndb_metadata_check and ndb_metadata_check_interval values to be ignored. Resets to false when synchronization is complete.

* `Ndb_metadata_synced_count`: Number of NDB metadata objects which have been synchronized.

* `Ndb_number_of_data_nodes`: Number of data nodes in this NDB cluster; set only if server participates in cluster.

* `ndb-optimization-delay`: Number of milliseconds to wait between processing sets of rows by OPTIMIZE TABLE on NDB tables.

* `ndb_optimized_node_selection`: Determines how SQL node chooses cluster data node to use as transaction coordinator.

* `Ndb_pruned_scan_count`: Number of scans executed by NDB since cluster was last started where partition pruning could be used.

* `Ndb_pushed_queries_defined`: Number of joins that API nodes have attempted to push down to data nodes.

* `Ndb_pushed_queries_dropped`: Number of joins that API nodes have tried to push down, but failed.

* `Ndb_pushed_queries_executed`: Number of joins successfully pushed down and executed on data nodes.

* `Ndb_pushed_reads`: Number of reads executed on data nodes by pushed-down joins.

* `ndb_read_backup`: Enable read from any replica for all NDB tables; use NDB_TABLE=READ_BACKUP={0|1} with CREATE TABLE or ALTER TABLE to enable or disable for individual NDB tables.

* `ndb_recv_thread_activation_threshold`: Activation threshold when receive thread takes over polling of cluster connection (measured in concurrently active threads).

* `ndb_recv_thread_cpu_mask`: CPU mask for locking receiver threads to specific CPUs; specified as hexadecimal. See documentation for details.

* `Ndb_replica_max_replicated_epoch`: Most recently committed NDB epoch on this replica. When this value is greater than or equal to Ndb_conflict_last_conflict_epoch, no conflicts have yet been detected.

* `ndb_replica_batch_size`: Batch size in bytes for replica applier.

* `ndb_report_thresh_binlog_epoch_slip`: NDB 7.5 and later: Threshold for number of epochs completely buffered, but not yet consumed by binlog injector thread which when exceeded generates BUFFERED_EPOCHS_OVER_THRESHOLD event buffer status message; prior to NDB 7.5: Threshold for number of epochs to lag behind before reporting binary log status.

* `ndb_report_thresh_binlog_mem_usage`: Threshold for percentage of free memory remaining before reporting binary log status.

* `ndb_row_checksum`: When enabled, set row checksums; enabled by default.

* `Ndb_scan_count`: Total number of scans executed by NDB since cluster was last started.

* `ndb_schema_dist_lock_wait_timeout`: Time during schema distribution to wait for lock before returning error.

* `ndb_schema_dist_timeout`: Time to wait before detecting timeout during schema distribution.

* `ndb_schema_dist_upgrade_allowed`: Allow schema distribution table upgrade when connecting to NDB.

* `Ndb_schema_participant_count`: Number of MySQL servers participating in NDB schema change distribution.

* `ndb_show_foreign_key_mock_tables`: Show mock tables used to support foreign_key_checks=0.

* `ndb_slave_conflict_role`: Role for replica to play in conflict detection and resolution. Value is one of PRIMARY, SECONDARY, PASS, or NONE (default). Can be changed only when replication SQL thread is stopped. See documentation for further information.

* `Ndb_slave_max_replicated_epoch`: Most recently committed NDB epoch on this replica. When this value is greater than or equal to Ndb_conflict_last_conflict_epoch, no conflicts have yet been detected.

* `Ndb_system_name`: Configured cluster system name; empty if server not connected to NDB.

* `ndb_table_no_logging`: NDB tables created when this setting is enabled are not checkpointed to disk (although table schema files are created). Setting in effect when table is created with or altered to use NDBCLUSTER persists for table's lifetime.

* `ndb_table_temporary`: NDB tables are not persistent on disk: no schema files are created and tables are not logged.

* `Ndb_trans_hint_count_session`: Number of transactions using hints that have been started in this session.

* `ndb_use_copying_alter_table`: Use copying ALTER TABLE operations in NDB Cluster.

* `ndb_use_exact_count`: Forces NDB to use a count of records during SELECT COUNT(\*) query planning to speed up this type of query.

* `ndb_use_transactions`: Set to OFF, to disable transaction support by NDB. Not recommended except in certain special cases; see documentation for details.

* `ndb_version`: Shows build and NDB engine version as an integer.

* `ndb_version_string`: Shows build information including NDB engine version in ndb-x.y.z format.

* `ndbcluster`: Enable NDB Cluster (if this version of MySQL supports it). Disabled by `--skip-ndbcluster`.

* `ndbinfo`: Enable ndbinfo plugin, if supported.

* `ndbinfo_database`: Name used for NDB information database; read only.

* `ndbinfo_max_bytes`: Used for debugging only.

* `ndbinfo_max_rows`: Used for debugging only.

* `ndbinfo_offline`: Put ndbinfo database into offline mode, in which no rows are returned from tables or views.

* `ndbinfo_show_hidden`: Whether to show ndbinfo internal base tables in mysql client; default is OFF.

* `ndbinfo_table_prefix`: Prefix to use for naming ndbinfo internal base tables; read only.

* `ndbinfo_version`: ndbinfo engine version; read only.

* `replica_allow_batching`: Turns update batching on and off for replica.

* `server_id_bits`: Number of least significant bits in server_id actually used for identifying server, permitting NDB API applications to store application data in most significant bits. server_id must be less than 2 to power of this value.

* `skip-ndbcluster`: Disable NDB Cluster storage engine.

* `slave_allow_batching`: Turns update batching on and off for replica.

* `transaction_allow_batching`: Allows batching of statements within one transaction. Disable AUTOCOMMIT to use.
