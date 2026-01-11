#### 19.1.6.1 Replication and Binary Logging Option and Variable Reference

The following two sections provide basic information about the MySQL command-line options and system variables applicable to replication and the binary log.

##### Replication Options and Variables

The command-line options and system variables in the following list relate to replication source servers and replicas. Section 19.1.6.2, “Replication Source Options and Variables” provides more detailed information about options and variables relating to replication source servers. For more information about options and variables relating to replicas, see Section 19.1.6.3, “Replica Server Options and Variables”.

* `auto_increment_increment`: AUTO\_INCREMENT columns are incremented by this value.

* `auto_increment_offset`: Offset added to AUTO\_INCREMENT columns.

* `Com_change_replication_source`: Count of CHANGE REPLICATION SOURCE TO and CHANGE MASTER TO statements.

* `Com_replica_start`: Count of START REPLICA and START SLAVE statements.

* `Com_replica_stop`: Count of STOP REPLICA and STOP SLAVE statements.

* `Com_show_binary_log_status`: Count of SHOW BINARY LOG STATUS statements; use instead of Com\_show\_master\_status.

* `Com_show_replica_status`: Count of SHOW REPLICA STATUS and SHOW SLAVE STATUS statements.

* `Com_show_replicas`: Count of SHOW REPLICAS and SHOW SLAVE HOSTS statements.

* `enforce_gtid_consistency`: Prevents execution of statements that cannot be logged in transactionally safe manner.

* `gtid_executed`: Global: All GTIDs in binary log (global) or current transaction (session). Read-only.

* `gtid_executed_compression_period`: Compress gtid\_executed table each time this many transactions have occurred. 0 means never compress this table. Applies only when binary logging is disabled.

* `gtid_mode`: Controls whether GTID based logging is enabled and what type of transactions logs can contain.

* `gtid_next`: Specifies GTID for subsequent transaction or transactions; see documentation for details.

* `gtid_owned`: Set of GTIDs owned by this client (session), or by all clients, together with thread ID of owner (global). Read-only.

* `gtid_purged`: Set of all GTIDs that have been purged from binary log.

* `immediate_server_version`: MySQL Server release number of server which is immediate replication source.

* `init_replica`: Statements that are executed when replica connects to source.

* `init_slave`: Statements that are executed when replica connects to source.

* `log_bin_trust_function_creators`: If equal to 0 (default), then when --log-bin is used, stored function creation is allowed only to users having SUPER privilege and only if function created does not break binary logging.

* `log_statements_unsafe_for_binlog`: Disables error 1592 warnings being written to error log.

* `master-retry-count`: Number of tries replica makes to connect to source before giving up.

* `max_relay_log_size`: If nonzero, relay log is rotated automatically when its size exceeds this value. If zero, size at which rotation occurs is determined by value of max\_binlog\_size.

* `original_commit_timestamp`: Time when transaction was committed on original source.

* `original_server_version`: MySQL Server release number of server on which transaction was originally committed.

* `relay_log`: Location and base name to use for relay logs.

* `relay_log_basename`: Complete path to relay log, including file name.

* `relay_log_index`: Location and name to use for file that keeps list of last relay logs.

* `relay_log_purge`: Determines whether relay logs are purged.

* `relay_log_recovery`: Whether automatic recovery of relay log files from source at startup is enabled; must be enabled for crash-safe replica.

* `relay_log_space_limit`: Maximum space to use for all relay logs.

* `replica_checkpoint_group`: Maximum number of transactions processed by multithreaded replica before checkpoint operation is called to update progress status. Not supported by NDB Cluster.

* `replica_checkpoint_period`: Update progress status of multithreaded replica and flush relay log info to disk after this number of milliseconds. Not supported by NDB Cluster.

* `replica_compressed_protocol`: Use compression of source/replica protocol.

* `replica_exec_mode`: Allows for switching replication thread between IDEMPOTENT mode (key and some other errors suppressed) and STRICT mode; STRICT mode is default, except for NDB Cluster, where IDEMPOTENT is always used.

* `replica_load_tmpdir`: Location where replica should put its temporary files when replicating LOAD DATA statements.

* `replica_max_allowed_packet`: Maximum size, in bytes, of packet that can be sent from replication source server to replica; overrides max\_allowed\_packet.

* `replica_net_timeout`: Number of seconds to wait for more data from source/replica connection before aborting read.

* `Replica_open_temp_tables`: Number of temporary tables that replication SQL thread currently has open.

* `replica_parallel_workers`: Number of applier threads for executing replication transactions. NDB Cluster: see documentation.

* `replica_pending_jobs_size_max`: Maximum size of replica worker queues holding events not yet applied.

* `replica_preserve_commit_order`: Ensures that all commits by replica workers happen in same order as on source to maintain consistency when using parallel applier threads.

* `replica_skip_errors`: Tells replication thread to continue replication when query returns error from provided list.

* `replica_transaction_retries`: Number of times replication SQL thread retries transaction in case it failed with deadlock or elapsed lock wait timeout, before giving up and stopping.

* `replica_type_conversions`: Controls type conversion mode on replica. Value is list of zero or more elements from this list: ALL\_LOSSY, ALL\_NON\_LOSSY. Set to empty string to disallow type conversions between source and replica.

* `replicate-do-db`: Tells replication SQL thread to restrict replication to specified database.

* `replicate-do-table`: Tells replication SQL thread to restrict replication to specified table.

* `replicate-ignore-db`: Tells replication SQL thread not to replicate to specified database.

* `replicate-ignore-table`: Tells replication SQL thread not to replicate to specified table.

* `replicate-rewrite-db`: Updates to database with different name from original.

* `replicate-same-server-id`: In replication, if enabled, do not skip events having our server id.

* `replicate-wild-do-table`: Tells replication SQL thread to restrict replication to tables that match specified wildcard pattern.

* `replicate-wild-ignore-table`: Tells replication SQL thread not to replicate to tables that match given wildcard pattern.

* `replication_optimize_for_static_plugin_config`: Shared locks for semisynchronous replication.

* `replication_sender_observe_commit_only`: Limited callbacks for semisynchronous replication.

* `report_host`: Host name or IP of replica to be reported to source during replica registration.

* `report_password`: Arbitrary password which replica server should report to source; not same as password for replication user account.

* `report_port`: Port for connecting to replica reported to source during replica registration.

* `report_user`: Arbitrary user name which replica server should report to source; not same as name used for replication user account.

* `rpl_read_size`: Set minimum amount of data in bytes which is read from binary log files and relay log files.

* `rpl_semi_sync_master_wait_no_slave`: Whether source waits for timeout even with no replicas.

* `rpl_semi_sync_replica_enabled`: Whether semisynchronous replication is enabled on replica.

* `Rpl_semi_sync_replica_status`: Whether semisynchronous replication is operational on replica.

* `rpl_semi_sync_replica_trace_level`: Semisynchronous replication debug trace level on replica.

* `Rpl_semi_sync_source_clients`: Number of semisynchronous replicas.

* `rpl_semi_sync_source_enabled`: Whether semisynchronous replication is enabled on source.

* `Rpl_semi_sync_source_net_avg_wait_time`: Average time source has waited for replies from replica.

* `Rpl_semi_sync_source_net_wait_time`: Total time source has waited for replies from replica.

* `Rpl_semi_sync_source_net_waits`: Total number of times source waited for replies from replica.

* `Rpl_semi_sync_source_no_times`: Number of times source turned off semisynchronous replication.

* `Rpl_semi_sync_source_no_tx`: Number of commits not acknowledged successfully.

* `Rpl_semi_sync_source_status`: Whether semisynchronous replication is operational on source.

* `Rpl_semi_sync_source_timefunc_failures`: Number of times source failed when calling time functions.

* `rpl_semi_sync_source_timeout`: Number of milliseconds to wait for replica acknowledgment.

* `rpl_semi_sync_source_trace_level`: Semisynchronous replication debug trace level on source.

* `Rpl_semi_sync_source_tx_avg_wait_time`: Average time source waited for each transaction.

* `Rpl_semi_sync_source_tx_wait_time`: Total time source waited for transactions.

* `Rpl_semi_sync_source_tx_waits`: Total number of times source waited for transactions.

* `rpl_semi_sync_source_wait_for_replica_count`: Number of replica acknowledgments source must receive per transaction before proceeding.

* `rpl_semi_sync_source_wait_no_replica`: Whether source waits for timeout even with no replicas.

* `rpl_semi_sync_source_wait_point`: Wait point for replica transaction receipt acknowledgment.

* `Rpl_semi_sync_source_wait_pos_backtraverse`: Total number of times source has waited for event with binary coordinates lower than events waited for previously.

* `Rpl_semi_sync_source_wait_sessions`: Number of sessions currently waiting for replica replies.

* `Rpl_semi_sync_source_yes_tx`: Number of commits acknowledged successfully.

* `rpl_stop_replica_timeout`: Number of seconds that STOP REPLICA waits before timing out.

* `rpl_stop_slave_timeout`: Number of seconds that STOP REPLICA or STOP SLAVE waits before timing out.

* `server_uuid`: Server's globally unique ID, automatically (re)generated at server start.

* `show-replica-auth-info`: Show user name and password in SHOW REPLICAS on this source.

* `show-slave-auth-info`: Show user name and password in SHOW REPLICAS and SHOW SLAVE HOSTS on this source.

* `skip-replica-start`: If set, replication is not autostarted when replica server starts.

* `skip-slave-start`: If set, replication is not autostarted when replica server starts.

* `slave-skip-errors`: Tells replication thread to continue replication when query returns error from provided list.

* `slave_checkpoint_group`: Maximum number of transactions processed by multithreaded replica before checkpoint operation is called to update progress status. Not supported by NDB Cluster.

* `slave_checkpoint_period`: Update progress status of multithreaded replica and flush relay log info to disk after this number of milliseconds. Not supported by NDB Cluster.

* `slave_compressed_protocol`: Use compression of source/replica protocol.

* `slave_exec_mode`: Allows for switching replication thread between IDEMPOTENT mode (key and some other errors suppressed) and STRICT mode; STRICT mode is default, except for NDB Cluster, where IDEMPOTENT is always used.

* `slave_load_tmpdir`: Location where replica should put its temporary files when replicating LOAD DATA statements.

* `slave_max_allowed_packet`: Maximum size, in bytes, of packet that can be sent from replication source server to replica; overrides max\_allowed\_packet.

* `slave_net_timeout`: Number of seconds to wait for more data from source/replica connection before aborting read.

* `Slave_open_temp_tables`: Number of temporary tables that replication SQL thread currently has open.

* `slave_parallel_workers`: Number of applier threads for executing replication transactions in parallel; 0 or 1 disables replica multithreading. NDB Cluster: see documentation.

* `slave_pending_jobs_size_max`: Maximum size of replica worker queues holding events not yet applied.

* `slave_preserve_commit_order`: Ensures that all commits by replica workers happen in same order as on source to maintain consistency when using parallel applier threads.

* `Slave_rows_last_search_algorithm_used`: Search algorithm most recently used by this replica to locate rows for row-based replication (index, table, or hash scan).

* `slave_transaction_retries`: Number of times replication SQL thread retries transaction in case it failed with deadlock or elapsed lock wait timeout, before giving up and stopping.

* `slave_type_conversions`: Controls type conversion mode on replica. Value is list of zero or more elements from this list: ALL\_LOSSY, ALL\_NON\_LOSSY. Set to empty string to disallow type conversions between source and replica.

* `sql_log_bin`: Controls binary logging for current session.

* `sql_replica_skip_counter`: Number of events from source that replica should skip. Not compatible with GTID replication.

* `sql_slave_skip_counter`: Number of events from source that replica should skip. Not compatible with GTID replication.

* `sync_master_info`: Synchronize source information after every #th event.

* `sync_relay_log`: Synchronize relay log to disk after every #th event.

* `sync_relay_log_info`: Synchronize relay.info file to disk after every #th event.

* `sync_source_info`: Synchronize source information after every #th event.

* `terminology_use_previous`: Use terminology from before specified version where changes are incompatible.

For a listing of all command-line options, system variables, and status variables used with **mysqld**, see Section 7.1.4, “Server Option, System Variable, and Status Variable Reference”.

##### Binary Logging Options and Variables

The command-line options and system variables in the following list relate to the binary log. Section 19.1.6.4, “Binary Logging Options and Variables”, provides more detailed information about options and variables relating to binary logging. For additional general information about the binary log, see Section 7.4.4, “The Binary Log”.

* `binlog-checksum`: Enable or disable binary log checksums.

* `binlog-do-db`: Limits binary logging to specific databases.

* `binlog-ignore-db`: Tells source that updates to given database should not be written to binary log.

* `binlog-row-event-max-size`: Binary log max event size.

* `Binlog_cache_disk_use`: Number of transactions which used temporary file instead of binary log cache.

* `binlog_cache_size`: Size of cache to hold SQL statements for binary log during transaction.

* `Binlog_cache_use`: Number of transactions that used temporary binary log cache.

* `binlog_checksum`: Enable or disable binary log checksums.

* `binlog_direct_non_transactional_updates`: Causes updates using statement format to nontransactional engines to be written directly to binary log. See documentation before using.

* `binlog_encryption`: Enable encryption for binary log files and relay log files on this server.

* `binlog_error_action`: Controls what happens when server cannot write to binary log.

* `binlog_expire_logs_auto_purge`: Controls automatic purging of binary log files; can be overridden when enabled, by setting both binlog\_expire\_logs\_seconds and expire\_logs\_days to 0.

* `binlog_expire_logs_seconds`: Purge binary logs after this many seconds.

* `binlog_format`: Specifies format of binary log.

* `binlog_group_commit_sync_delay`: Sets number of microseconds to wait before synchronizing transactions to disk.

* `binlog_group_commit_sync_no_delay_count`: Sets maximum number of transactions to wait for before aborting current delay specified by binlog\_group\_commit\_sync\_delay.

* `binlog_max_flush_queue_time`: How long to read transactions before flushing to binary log.

* `binlog_order_commits`: Whether to commit in same order as writes to binary log.

* `binlog_rotate_encryption_master_key_at_startup`: Rotate binary log master key at server startup.

* `binlog_row_image`: Use full or minimal images when logging row changes.

* `binlog_row_metadata`: Whether to record all or only minimal table related metadata to binary log when using row-based logging.

* `binlog_row_value_options`: Enables binary logging of partial JSON updates for row-based replication.

* `binlog_rows_query_log_events`: When enabled, enables logging of rows query log events when using row-based logging. Disabled by default..

* `Binlog_stmt_cache_disk_use`: Number of nontransactional statements that used temporary file instead of binary log statement cache.

* `binlog_stmt_cache_size`: Size of cache to hold nontransactional statements for binary log during transaction.

* `Binlog_stmt_cache_use`: Number of statements that used temporary binary log statement cache.

* `binlog_transaction_compression`: Enable compression for transaction payloads in binary log files.

* `binlog_transaction_compression_level_zstd`: Compression level for transaction payloads in binary log files.

* `binlog_transaction_dependency_history_size`: Number of row hashes kept for looking up transaction that last updated some row.

* `Com_show_binlog_events`: Count of SHOW BINLOG EVENTS statements.

* `Com_show_binlogs`: Count of SHOW BINLOGS statements.

* `log-bin`: Base name for binary log files.

* `log-bin-index`: Name of binary log index file.

* `log_bin`: Whether binary log is enabled.

* `log_bin_basename`: Path and base name for binary log files.

* `log_replica_updates`: Whether replica should log updates performed by its replication SQL thread to its own binary log.

* `log_slave_updates`: Whether replica should log updates performed by its replication SQL thread to its own binary log.

* `master_verify_checksum`: Cause source to examine checksums when reading from binary log.

* `max-binlog-dump-events`: Option used by mysql-test for debugging and testing of replication.

* `max_binlog_cache_size`: Can be used to restrict total size in bytes used to cache multi-statement transactions.

* `max_binlog_size`: Binary log is rotated automatically when size exceeds this value.

* `max_binlog_stmt_cache_size`: Can be used to restrict total size used to cache all nontransactional statements during transaction.

* `replica_sql_verify_checksum`: Cause replica to examine checksums when reading from relay log.

* `slave-sql-verify-checksum`: Cause replica to examine checksums when reading from relay log.

* `slave_sql_verify_checksum`: Cause replica to examine checksums when reading from relay log.

* `source_verify_checksum`: Cause source to examine checksums when reading from binary log.

* `sporadic-binlog-dump-fail`: Option used by mysql-test for debugging and testing of replication.

* `sync_binlog`: Synchronously flush binary log to disk after every #th event.

For a listing of all command-line options, system and status variables used with **mysqld**, see Section 7.1.4, “Server Option, System Variable, and Status Variable Reference”.
