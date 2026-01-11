### 25.2.5 Options, Variables, and Parameters Added, Deprecated or Removed in NDB 8.0

* Parameters Introduced in NDB 8.0
* Parameters Deprecated in NDB 8.0
* Parameters Removed in NDB 8.0
* Options and Variables Introduced in NDB 8.0
* Options and Variables Deprecated in NDB 8.0
* Options and Variables Removed in NDB 8.0

The next few sections contain information about `NDB` node configuration parameters and NDB-specific **mysqld** options and variables that have been added to, deprecated in, or removed from NDB 8.0.

#### Parameters Introduced in NDB 8.0

The following node configuration parameters have been added in NDB 8.0.

* `AllowUnresolvedHostNames`: When false (default), failure by management node to resolve host name results in fatal error; when true, unresolved host names are reported as warnings only. Added in NDB 8.0.22.

* `ApiFailureHandlingTimeout`: Maximum time for API node failure handling before escalating. 0 means no time limit; minimum usable value is 10. Added in NDB 8.0.42.

* `AutomaticThreadConfig`: Use automatic thread configuration; overrides any settings for ThreadConfig and MaxNoOfExecutionThreads, and disables ClassicFragmentation. Added in NDB 8.0.23.

* `ClassicFragmentation`: When true, use traditional table fragmentation; set false to enable flexible distribution of fragments among LDMs. Disabled by AutomaticThreadConfig. Added in NDB 8.0.23.

* `DiskDataUsingSameDisk`: Set to false if Disk Data tablespaces are located on separate physical disks. Added in NDB 8.0.19.

* `EnableMultithreadedBackup`: Enable multi-threaded backup. Added in NDB 8.0.16.

* `EncryptedFileSystem`: Encrypt local checkpoint and tablespace files.. Added in NDB 8.0.29.

* `KeepAliveSendInterval`: Time between keep-alive signals on links between data nodes, in milliseconds. Set to 0 to disable. Added in NDB 8.0.27.

* `MaxDiskDataLatency`: Maximum allowed mean latency of disk access (ms) before starting to abort transactions. Added in NDB 8.0.19.

* `NodeGroupTransporters`: Number of transporters to use between nodes in same node group. Added in NDB 8.0.20.

* `NumCPUs`: Specify number of CPUs to use with AutomaticThreadConfig. Added in NDB 8.0.23.

* `PartitionsPerNode`: Determines the number of table partitions created on each data node; not used if ClassicFragmentation is enabled. Added in NDB 8.0.23.

* `PreferIPVersion`: Indicate DNS resolver preference for IP version 4 or 6. Added in NDB 8.0.26.

* `RequireEncryptedBackup`: Whether backups must be encrypted (1 = encryption required, otherwise 0). Added in NDB 8.0.22.

* `ReservedConcurrentIndexOperations`: Number of simultaneous index operations having dedicated resources on one data node. Added in NDB 8.0.16.

* `ReservedConcurrentOperations`: Number of simultaneous operations having dedicated resources in transaction coordinators on one data node. Added in NDB 8.0.16.

* `ReservedConcurrentScans`: Number of simultaneous scans having dedicated resources on one data node. Added in NDB 8.0.16.

* `ReservedConcurrentTransactions`: Number of simultaneous transactions having dedicated resources on one data node. Added in NDB 8.0.16.

* `ReservedFiredTriggers`: Number of triggers having dedicated resources on one data node. Added in NDB 8.0.16.

* `ReservedLocalScans`: Number of simultaneous fragment scans having dedicated resources on one data node. Added in NDB 8.0.16.

* `ReservedTransactionBufferMemory`: Dynamic buffer space (in bytes) for key and attribute data allocated to each data node. Added in NDB 8.0.16.

* `SpinMethod`: Determines spin method used by data node; see documentation for details. Added in NDB 8.0.20.

* `TcpSpinTime`: Time to spin before going to sleep when receiving. Added in NDB 8.0.20.

* `TransactionMemory`: Memory allocated for transactions on each data node. Added in NDB 8.0.19.

#### Parameters Deprecated in NDB 8.0

The following node configuration parameters have been deprecated in NDB 8.0.

* `BatchSizePerLocalScan`: Used to calculate number of lock records for scan with hold lock. Deprecated in NDB 8.0.19.

* `MaxAllocate`: No longer used; has no effect. Deprecated in NDB 8.0.27.

* `MaxNoOfConcurrentIndexOperations`: Total number of index operations that can execute simultaneously on one data node. Deprecated in NDB 8.0.19.

* `MaxNoOfConcurrentTransactions`: Maximum number of transactions executing concurrently on this data node, total number of transactions that can be executed concurrently is this value times number of data nodes in cluster. Deprecated in NDB 8.0.19.

* `MaxNoOfFiredTriggers`: Total number of triggers that can fire simultaneously on one data node. Deprecated in NDB 8.0.19.

* `MaxNoOfLocalOperations`: Maximum number of operation records defined on this data node. Deprecated in NDB 8.0.19.

* `MaxNoOfLocalScans`: Maximum number of fragment scans in parallel on this data node. Deprecated in NDB 8.0.19.

* `ReservedTransactionBufferMemory`: Dynamic buffer space (in bytes) for key and attribute data allocated to each data node. Deprecated in NDB 8.0.19.

* `UndoDataBuffer`: Unused; has no effect. Deprecated in NDB 8.0.27.

* `UndoIndexBuffer`: Unused; has no effect. Deprecated in NDB 8.0.27.

#### Parameters Removed in NDB 8.0

No node configuration parameters have been removed in NDB 8.0.

#### Options and Variables Introduced in NDB 8.0

The following system variables, status variables, and server options have been added in NDB 8.0.

* `Ndb_api_adaptive_send_deferred_count_replica`: Number of adaptive send calls not actually sent by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_adaptive_send_forced_count_replica`: Number of adaptive sends with forced-send set sent by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_adaptive_send_unforced_count_replica`: Number of adaptive sends without forced-send sent by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_bytes_received_count_replica`: Quantity of data (in bytes) received from data nodes by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_bytes_sent_count_replica`: Qunatity of data (in bytes) sent to data nodes by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_pk_op_count_replica`: Number of operations based on or using primary keys by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_pruned_scan_count_replica`: Number of scans that have been pruned to one partition by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_range_scan_count_replica`: Number of range scans that have been started by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_read_row_count_replica`: Total number of rows that have been read by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_scan_batch_count_replica`: Number of batches of rows received by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_table_scan_count_replica`: Number of table scans that have been started, including scans of internal tables, by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_abort_count_replica`: Number of transactions aborted by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_close_count_replica`: Number of transactions aborted (may be greater than sum of TransCommitCount and TransAbortCount) by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_commit_count_replica`: Number of transactions committed by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_local_read_row_count_replica`: Total number of rows that have been read by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_start_count_replica`: Number of transactions started by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_uk_op_count_replica`: Number of operations based on or using unique keys by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_wait_exec_complete_count_replica`: Number of times thread has been blocked while waiting for operation execution to complete by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_wait_meta_request_count_replica`: Number of times thread has been blocked waiting for metadata-based signal by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_wait_nanos_count_replica`: Total time (in nanoseconds) spent waiting for some type of signal from data nodes by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_wait_scan_result_count_replica`: Number of times thread has been blocked while waiting for scan-based signal by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_config_generation`: Generation number of the current configuration of the cluster. Added in NDB 8.0.24-ndb-8.0.24.

* `Ndb_conflict_fn_max_del_win_ins`: Number of times that NDB replication conflict resolution based on outcome of NDB$MAX_DEL_WIN_INS() has been applied to insert operations. Added in NDB 8.0.30-ndb-8.0.30.

* `Ndb_conflict_fn_max_ins`: Number of times that NDB replication conflict resolution based on "greater timestamp wins" has been applied to insert operations. Added in NDB 8.0.30-ndb-8.0.30.

* `Ndb_fetch_table_stats`: Number of times table statistics were fetched from tables rather than cache. Added in NDB 8.0.27-ndb-8.0.27.

* `Ndb_metadata_blacklist_size`: Number of NDB metadata objects that NDB binlog thread has failed to synchronize; renamed in NDB 8.0.22 as Ndb_metadata_excluded_count. Added in NDB 8.0.18-ndb-8.0.18.

* `Ndb_metadata_detected_count`: Number of times NDB metadata change monitor thread has detected changes. Added in NDB 8.0.16-ndb-8.0.16.

* `Ndb_metadata_excluded_count`: Number of NDB metadata objects that NDB binlog thread has failed to synchronize. Added in NDB 8.0.18-ndb-8.0.22.

* `Ndb_metadata_synced_count`: Number of NDB metadata objects which have been synchronized. Added in NDB 8.0.18-ndb-8.0.18.

* `Ndb_trans_hint_count_session`: Number of transactions using hints that have been started in this session. Added in NDB 8.0.17-ndb-8.0.17.

* `ndb-applier-allow-skip-epoch`: Lets replication applier skip epochs. Added in NDB 8.0.28-ndb-8.0.28.

* `ndb-log-fail-terminate`: Terminate mysqld process if complete logging of all found row events is not possible. Added in NDB 8.0.21-ndb-8.0.21.

* `ndb-log-transaction-dependency`: Make binary log thread calculate transaction dependencies for every transaction it writes to binary log. Added in NDB 8.0.33-ndb-8.0.33.

* `ndb-schema-dist-timeout`: How long to wait before detecting timeout during schema distribution. Added in NDB 8.0.17-ndb-8.0.17.

* `ndb_conflict_role`: Role for replica to play in conflict detection and resolution. Value is one of PRIMARY, SECONDARY, PASS, or NONE (default). Can be changed only when replication SQL thread is stopped. See documentation for further information. Added in NDB 8.0.23-ndb-8.0.23.

* `ndb_dbg_check_shares`: Check for any lingering shares (debug builds only). Added in NDB 8.0.13-ndb-8.0.13.

* `ndb_log_transaction_compression`: Whether to compress NDB binary log; can also be enabled on startup by enabling --binlog-transaction-compression option. Added in NDB 8.0.31-ndb-8.0.31.

* `ndb_log_transaction_compression_level_zstd`: The ZSTD compression level to use when writing compressed transactions to the NDB binary log. Added in NDB 8.0.31-ndb-8.0.31.

* `ndb_metadata_check`: Enable auto-detection of NDB metadata changes with respect to MySQL data dictionary; enabled by default. Added in NDB 8.0.16-ndb-8.0.16.

* `ndb_metadata_check_interval`: Interval in seconds to perform check for NDB metadata changes with respect to MySQL data dictionary. Added in NDB 8.0.16-ndb-8.0.16.

* `ndb_metadata_sync`: Triggers immediate synchronization of all changes between NDB dictionary and MySQL data dictionary; causes ndb_metadata_check and ndb_metadata_check_interval values to be ignored. Resets to false when synchronization is complete. Added in NDB 8.0.19-ndb-8.0.19.

* `ndb_replica_batch_size`: Batch size in bytes for replica applier. Added in NDB 8.0.30-ndb-8.0.30.

* `ndb_schema_dist_lock_wait_timeout`: Time during schema distribution to wait for lock before returning error. Added in NDB 8.0.18-ndb-8.0.18.

* `ndb_schema_dist_timeout`: Time to wait before detecting timeout during schema distribution. Added in NDB 8.0.16-ndb-8.0.16.

* `ndb_schema_dist_upgrade_allowed`: Allow schema distribution table upgrade when connecting to NDB. Added in NDB 8.0.17-ndb-8.0.17.

* `ndbinfo`: Enable ndbinfo plugin, if supported. Added in NDB 8.0.13-ndb-8.0.13.

* `replica_allow_batching`: Turns update batching on and off for replica. Added in NDB 8.0.26-ndb-8.0.26.

#### Options and Variables Deprecated in NDB 8.0

The following system variables, status variables, and options have been deprecated in NDB 8.0.

* `Ndb_api_adaptive_send_deferred_count_slave`: Number of adaptive send calls not actually sent by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_adaptive_send_forced_count_slave`: Number of adaptive sends with forced-send set sent by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_adaptive_send_unforced_count_slave`: Number of adaptive sends without forced-send sent by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_bytes_received_count_slave`: Quantity of data (in bytes) received from data nodes by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_bytes_sent_count_slave`: Qunatity of data (in bytes) sent to data nodes by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_pk_op_count_slave`: Number of operations based on or using primary keys by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_pruned_scan_count_slave`: Number of scans that have been pruned to one partition by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_range_scan_count_slave`: Number of range scans that have been started by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_read_row_count_slave`: Total number of rows that have been read by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_scan_batch_count_slave`: Number of batches of rows received by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_table_scan_count_slave`: Number of table scans that have been started, including scans of internal tables, by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_abort_count_slave`: Number of transactions aborted by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_close_count_slave`: Number of transactions aborted (may be greater than sum of TransCommitCount and TransAbortCount) by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_commit_count_slave`: Number of transactions committed by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_local_read_row_count_slave`: Total number of rows that have been read by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_start_count_slave`: Number of transactions started by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_uk_op_count_slave`: Number of operations based on or using unique keys by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_wait_exec_complete_count_slave`: Number of times thread has been blocked while waiting for operation execution to complete by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_wait_meta_request_count_slave`: Number of times thread has been blocked waiting for metadata-based signal by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_wait_nanos_count_slave`: Total time (in nanoseconds) spent waiting for some type of signal from data nodes by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_wait_scan_result_count_slave`: Number of times thread has been blocked while waiting for scan-based signal by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_metadata_blacklist_size`: Number of NDB metadata objects that NDB binlog thread has failed to synchronize; renamed in NDB 8.0.22 as Ndb_metadata_excluded_count. Deprecated in NDB 8.0.21-ndb-8.0.21.

* `Ndb_replica_max_replicated_epoch`: Most recently committed NDB epoch on this replica. When this value is greater than or equal to Ndb_conflict_last_conflict_epoch, no conflicts have yet been detected. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `ndb_slave_conflict_role`: Role for replica to play in conflict detection and resolution. Value is one of PRIMARY, SECONDARY, PASS, or NONE (default). Can be changed only when replication SQL thread is stopped. See documentation for further information. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `slave_allow_batching`: Turns update batching on and off for replica. Deprecated in NDB 8.0.26-ndb-8.0.26.

#### Options and Variables Removed in NDB 8.0

The following system variables, status variables, and options have been removed in NDB 8.0.

* `Ndb_metadata_blacklist_size`: Number of NDB metadata objects that NDB binlog thread has failed to synchronize; renamed in NDB 8.0.22 as Ndb_metadata_excluded_count. Removed in NDB 8.0.22-ndb-8.0.22.
