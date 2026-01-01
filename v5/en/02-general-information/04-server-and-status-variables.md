## 1.4 Server and Status Variables and Options Added, Deprecated, or Removed in MySQL 5.7

This section lists server variables, status variables, and options that were added for the first time, have been deprecated, or have been removed in MySQL 5.7.

### Options and Variables Introduced in MySQL 5.7

The following system variables, status variables, and server options have been added in MySQL 5.7.

* `Audit_log_current_size`: Audit log file current size. Added in MySQL 5.7.9.

* `Audit_log_event_max_drop_size`: Size of largest dropped audited event. Added in MySQL 5.7.9.

* `Audit_log_events`: Number of handled audited events. Added in MySQL 5.7.9.

* `Audit_log_events_filtered`: Number of filtered audited events. Added in MySQL 5.7.9.

* `Audit_log_events_lost`: Number of dropped audited events. Added in MySQL 5.7.9.

* `Audit_log_events_written`: Number of written audited events. Added in MySQL 5.7.9.

* `Audit_log_total_size`: Combined size of written audited events. Added in MySQL 5.7.9.

* `Audit_log_write_waits`: Number of write-delayed audited events. Added in MySQL 5.7.9.

* `Com_change_repl_filter`: Count of CHANGE REPLICATION FILTER statements. Added in MySQL 5.7.3.

* `Com_explain_other`: Count of EXPLAIN FOR CONNECTION statements. Added in MySQL 5.7.2.

* `Com_group_replication_start`: Count of START GROUP_REPLICATION statements. Added in MySQL 5.7.6.

* `Com_group_replication_stop`: Count of STOP GROUP_REPLICATION statements. Added in MySQL 5.7.6.

* `Com_show_create_user`: Count of SHOW CREATE USER statements. Added in MySQL 5.7.6.

* `Com_show_slave_status_nonblocking`: Count of SHOW REPLICA | SLAVE STATUS NONBLOCKING statements. Added in MySQL 5.7.0.

* `Com_shutdown`: Count of SHUTDOWN statements. Added in MySQL 5.7.9.

* `Connection_control_delay_generated`: How many times server delayed connection request. Added in MySQL 5.7.17.

* `Firewall_access_denied`: Number of statements rejected by MySQL Enterprise Firewall plugin. Added in MySQL 5.7.9.

* `Firewall_access_granted`: Number of statements accepted by MySQL Enterprise Firewall plugin. Added in MySQL 5.7.9.

* `Firewall_cached_entries`: Number of statements recorded by MySQL Enterprise Firewall plugin. Added in MySQL 5.7.9.

* `Innodb_buffer_pool_resize_status`: Status of dynamic buffer pool resizing operation. Added in MySQL 5.7.5.

* `Locked_connects`: Number of attempts to connect to locked accounts. Added in MySQL 5.7.6.

* `Max_execution_time_exceeded`: Number of statements that exceeded execution timeout value. Added in MySQL 5.7.8.

* `Max_execution_time_set`: Number of statements for which execution timeout was set. Added in MySQL 5.7.8.

* `Max_execution_time_set_failed`: Number of statements for which execution timeout setting failed. Added in MySQL 5.7.8.

* `Max_statement_time_exceeded`: Number of statements that exceeded execution timeout value. Added in MySQL 5.7.4.

* `Max_statement_time_set`: Number of statements for which execution timeout was set. Added in MySQL 5.7.4.

* `Max_statement_time_set_failed`: Number of statements for which execution timeout setting failed. Added in MySQL 5.7.4.

* `Max_used_connections_time`: Time at which Max_used_connections reached its current value. Added in MySQL 5.7.5.

* `Performance_schema_index_stat_lost`: Number of indexes for which statistics were lost. Added in MySQL 5.7.6.

* `Performance_schema_memory_classes_lost`: How many memory instruments could not be loaded. Added in MySQL 5.7.2.

* `Performance_schema_metadata_lock_lost`: Number of metadata locks that could not be recorded. Added in MySQL 5.7.3.

* `Performance_schema_nested_statement_lost`: Number of stored program statements for which statistics were lost. Added in MySQL 5.7.2.

* `Performance_schema_prepared_statements_lost`: Number of prepared statements that could not be instrumented. Added in MySQL 5.7.4.

* `Performance_schema_program_lost`: Number of stored programs for which statistics were lost. Added in MySQL 5.7.2.

* `Performance_schema_table_lock_stat_lost`: Number of tables for which lock statistics were lost. Added in MySQL 5.7.6.

* `Rewriter_number_loaded_rules`: Number of rewrite rules successfully loaded into memory. Added in MySQL 5.7.6.

* `Rewriter_number_reloads`: Number of reloads of rules table into memory. Added in MySQL 5.7.6.

* `Rewriter_number_rewritten_queries`: Number of queries rewritten since plugin was loaded. Added in MySQL 5.7.6.

* `Rewriter_reload_error`: Whether error occurred when last loading rewriting rules into memory. Added in MySQL 5.7.6.

* `audit-log`: Whether to activate audit log plugin. Added in MySQL 5.7.9.

* `audit_log_buffer_size`: Size of audit log buffer. Added in MySQL 5.7.9.

* `audit_log_compression`: Audit log file compression method. Added in MySQL 5.7.21.

* `audit_log_connection_policy`: Audit logging policy for connection-related events. Added in MySQL 5.7.9.

* `audit_log_current_session`: Whether to audit current session. Added in MySQL 5.7.9.

* `audit_log_disable`: Whether to disable the audit log. Added in MySQL 5.7.37.

* `audit_log_encryption`: Audit log file encryption method. Added in MySQL 5.7.21.

* `audit_log_exclude_accounts`: Accounts not to audit. Added in MySQL 5.7.9.

* `audit_log_file`: Name of audit log file. Added in MySQL 5.7.9.

* `audit_log_filter_id`: ID of current audit log filter. Added in MySQL 5.7.13.

* `audit_log_flush`: Close and reopen audit log file. Added in MySQL 5.7.9.

* `audit_log_format`: Audit log file format. Added in MySQL 5.7.9.

* `audit_log_format_unix_timestamp`: Whether to include Unix timestamp in JSON-format audit log. Added in MySQL 5.7.35.

* `audit_log_include_accounts`: Accounts to audit. Added in MySQL 5.7.9.

* `audit_log_policy`: Audit logging policy. Added in MySQL 5.7.9.

* `audit_log_read_buffer_size`: Audit log file read buffer size. Added in MySQL 5.7.21.

* `audit_log_rotate_on_size`: Close and reopen audit log file at this size. Added in MySQL 5.7.9.

* `audit_log_statement_policy`: Audit logging policy for statement-related events. Added in MySQL 5.7.9.

* `audit_log_strategy`: Audit logging strategy. Added in MySQL 5.7.9.

* `authentication_ldap_sasl_auth_method_name`: Authentication method name. Added in MySQL 5.7.19.

* `authentication_ldap_sasl_bind_base_dn`: LDAP server base distinguished name. Added in MySQL 5.7.19.

* `authentication_ldap_sasl_bind_root_dn`: LDAP server root distinguished name. Added in MySQL 5.7.19.

* `authentication_ldap_sasl_bind_root_pwd`: LDAP server root bind password. Added in MySQL 5.7.19.

* `authentication_ldap_sasl_ca_path`: LDAP server certificate authority file name. Added in MySQL 5.7.19.

* `authentication_ldap_sasl_group_search_attr`: LDAP server group search attribute. Added in MySQL 5.7.19.

* `authentication_ldap_sasl_group_search_filter`: LDAP custom group search filter. Added in MySQL 5.7.21.

* `authentication_ldap_sasl_init_pool_size`: LDAP server initial connection pool size. Added in MySQL 5.7.19.

* `authentication_ldap_sasl_log_status`: LDAP server log level. Added in MySQL 5.7.19.

* `authentication_ldap_sasl_max_pool_size`: LDAP server maximum connection pool size. Added in MySQL 5.7.19.

* `authentication_ldap_sasl_server_host`: LDAP server host name or IP address. Added in MySQL 5.7.19.

* `authentication_ldap_sasl_server_port`: LDAP server port number. Added in MySQL 5.7.19.

* `authentication_ldap_sasl_tls`: Whether to use encrypted connections to LDAP server. Added in MySQL 5.7.19.

* `authentication_ldap_sasl_user_search_attr`: LDAP server user search attribute. Added in MySQL 5.7.19.

* `authentication_ldap_simple_auth_method_name`: Authentication method name. Added in MySQL 5.7.19.

* `authentication_ldap_simple_bind_base_dn`: LDAP server base distinguished name. Added in MySQL 5.7.19.

* `authentication_ldap_simple_bind_root_dn`: LDAP server root distinguished name. Added in MySQL 5.7.19.

* `authentication_ldap_simple_bind_root_pwd`: LDAP server root bind password. Added in MySQL 5.7.19.

* `authentication_ldap_simple_ca_path`: LDAP server certificate authority file name. Added in MySQL 5.7.19.

* `authentication_ldap_simple_group_search_attr`: LDAP server group search attribute. Added in MySQL 5.7.19.

* `authentication_ldap_simple_group_search_filter`: LDAP custom group search filter. Added in MySQL 5.7.21.

* `authentication_ldap_simple_init_pool_size`: LDAP server initial connection pool size. Added in MySQL 5.7.19.

* `authentication_ldap_simple_log_status`: LDAP server log level. Added in MySQL 5.7.19.

* `authentication_ldap_simple_max_pool_size`: LDAP server maximum connection pool size. Added in MySQL 5.7.19.

* `authentication_ldap_simple_server_host`: LDAP server host name or IP address. Added in MySQL 5.7.19.

* `authentication_ldap_simple_server_port`: LDAP server port number. Added in MySQL 5.7.19.

* `authentication_ldap_simple_tls`: Whether to use encrypted connections to LDAP server. Added in MySQL 5.7.19.

* `authentication_ldap_simple_user_search_attr`: LDAP server user search attribute. Added in MySQL 5.7.19.

* `authentication_windows_log_level`: Windows authentication plugin logging level. Added in MySQL 5.7.9.

* `authentication_windows_use_principal_name`: Whether to use Windows authentication plugin principal name. Added in MySQL 5.7.9.

* `auto_generate_certs`: Whether to autogenerate SSL key and certificate files. Added in MySQL 5.7.5.

* `avoid_temporal_upgrade`: Whether ALTER TABLE should upgrade pre-5.6.4 temporal columns. Added in MySQL 5.7.6.

* `binlog_error_action`: Controls what happens when server cannot write to binary log. Added in MySQL 5.7.6.

* `binlog_group_commit_sync_delay`: Sets number of microseconds to wait before synchronizing transactions to disk. Added in MySQL 5.7.5.

* `binlog_group_commit_sync_no_delay_count`: Sets maximum number of transactions to wait for before aborting current delay specified by binlog_group_commit_sync_delay. Added in MySQL 5.7.5.

* `binlog_gtid_simple_recovery`: Controls how binary logs are iterated during GTID recovery. Added in MySQL 5.7.6.

* `binlog_transaction_dependency_history_size`: Number of row hashes kept for looking up transaction that last updated some row. Added in MySQL 5.7.22.

* `binlog_transaction_dependency_tracking`: Source of dependency information (commit timestamps or transaction write sets) from which to assess which transactions can be executed in parallel by replica's multithreaded applier. Added in MySQL 5.7.22.

* `binlogging_impossible_mode`: Deprecated and later removed. Use binlog_error_action instead. Added in MySQL 5.7.5.

* `block_encryption_mode`: Mode for block-based encryption algorithms. Added in MySQL 5.7.4.

* `check_proxy_users`: Whether built-in authentication plugins do proxying. Added in MySQL 5.7.7.

* `connection_control_failed_connections_threshold`: Consecutive failed connection attempts before delays occur. Added in MySQL 5.7.17.

* `connection_control_max_connection_delay`: Maximum delay (milliseconds) for server response to failed connection attempts. Added in MySQL 5.7.17.

* `connection_control_min_connection_delay`: Minimum delay (milliseconds) for server response to failed connection attempts. Added in MySQL 5.7.17.

* `daemonize`: Run as System V daemon. Added in MySQL 5.7.6.

* `default_authentication_plugin`: Default authentication plugin. Added in MySQL 5.7.2.

* `default_password_lifetime`: Age in days when passwords effectively expire. Added in MySQL 5.7.4.

* `disable-partition-engine-check`: Whether to disable startup check for tables without native partitioning. Added in MySQL 5.7.17.

* `disabled_storage_engines`: Storage engines that cannot be used to create tables. Added in MySQL 5.7.8.

* `disconnect_on_expired_password`: Whether server disconnects clients with expired passwords if clients cannot handle such accounts. Added in MySQL 5.7.1.

* `early-plugin-load`: Specify plugins to load before loading mandatory built-in plugins and before storage engine initialization. Added in MySQL 5.7.11.

* `executed_gtids_compression_period`: Renamed to gtid_executed_compression_period. Added in MySQL 5.7.5.

* `group_replication_allow_local_disjoint_gtids_join`: Allow current server to join group even if it has transactions not present in group. Added in MySQL 5.7.17.

* `group_replication_allow_local_lower_version_join`: Allow current server to join group even if it has lower plugin version than group. Added in MySQL 5.7.17.

* `group_replication_auto_increment_increment`: Determines interval between successive column values for transactions executing on this server. Added in MySQL 5.7.17.

* `group_replication_bootstrap_group`: Configure this server to bootstrap group. Added in MySQL 5.7.17.

* `group_replication_components_stop_timeout`: Timeout, in seconds, that plugin waits for each component when shutting down. Added in MySQL 5.7.17.

* `group_replication_compression_threshold`: Value in bytes above which (LZ4) compression is enforced; when set to zero, deactivates compression. Added in MySQL 5.7.17.

* `group_replication_enforce_update_everywhere_checks`: Enable or disable strict consistency checks for multi-source update everywhere. Added in MySQL 5.7.17.

* `group_replication_exit_state_action`: How instance behaves when it leaves group involuntarily. Added in MySQL 5.7.24.

* `group_replication_flow_control_applier_threshold`: Number of waiting transactions in applier queue which trigger flow control. Added in MySQL 5.7.17.

* `group_replication_flow_control_certifier_threshold`: Number of waiting transactions in certifier queue that trigger flow control. Added in MySQL 5.7.17.

* `group_replication_flow_control_mode`: Mode used for flow control. Added in MySQL 5.7.17.

* `group_replication_force_members`: Comma separated list of peer addresses, such as host1:port1,host2:port2. Added in MySQL 5.7.17.

* `group_replication_group_name`: Name of group. Added in MySQL 5.7.17.

* `group_replication_group_seeds`: List of peer addresses, comma separated list such as host1:port1,host2:port2. Added in MySQL 5.7.17.

* `group_replication_gtid_assignment_block_size`: Number of consecutive GTIDs that are reserved for each member; each member consumes its blocks and reserves more when needed. Added in MySQL 5.7.17.

* `group_replication_ip_whitelist`: List of hosts permitted to connect to group. Added in MySQL 5.7.17.

* `group_replication_local_address`: Local address in host:port format. Added in MySQL 5.7.17.

* `group_replication_member_weight`: Chance of this member being elected as primary. Added in MySQL 5.7.20.

* `group_replication_poll_spin_loops`: Number of times group communication thread waits. Added in MySQL 5.7.17.

* `group_replication_recovery_complete_at`: Recovery policies when handling cached transactions after state transfer. Added in MySQL 5.7.17.

* `group_replication_recovery_reconnect_interval`: Sleep time, in seconds, between reconnection attempts when no donor was found in group. Added in MySQL 5.7.17.

* `group_replication_recovery_retry_count`: Number of times that joining member tries to connect to available donors before giving up. Added in MySQL 5.7.17.

* `group_replication_recovery_ssl_ca`: File that contains list of trusted SSL Certificate Authorities. Added in MySQL 5.7.17.

* `group_replication_recovery_ssl_capath`: Directory that contains trusted SSL Certificate Authority certificate files. Added in MySQL 5.7.17.

* `group_replication_recovery_ssl_cert`: Name of SSL certificate file to use for establishing encrypted connection. Added in MySQL 5.7.17.

* `group_replication_recovery_ssl_cipher`: Permissible ciphers for SSL encryption. Added in MySQL 5.7.17.

* `group_replication_recovery_ssl_crl`: File that contains certificate revocation lists. Added in MySQL 5.7.17.

* `group_replication_recovery_ssl_crlpath`: Directory that contains certificate revocation-list files. Added in MySQL 5.7.17.

* `group_replication_recovery_ssl_key`: Name of SSL key file to use for establishing encrypted connection. Added in MySQL 5.7.17.

* `group_replication_recovery_ssl_verify_server_cert`: Make recovery process check server Common Name value in certificate sent by donor. Added in MySQL 5.7.17.

* `group_replication_recovery_use_ssl`: Whether Group Replication recovery connection should use SSL. Added in MySQL 5.7.17.

* `group_replication_single_primary_mode`: Instructs group to use single server for read/write workload. Added in MySQL 5.7.17.

* `group_replication_ssl_mode`: Desired security state of connection between Group Replication members. Added in MySQL 5.7.17.

* `group_replication_start_on_boot`: Whether server should start Group Replication during server startup. Added in MySQL 5.7.17.

* `group_replication_transaction_size_limit`: Sets maximum size of transaction in bytes which group accepts. Added in MySQL 5.7.19.

* `group_replication_unreachable_majority_timeout`: How long to wait for network partitions that result in minority to leave group. Added in MySQL 5.7.19.

* `gtid_executed_compression_period`: Compress gtid_executed table each time this many transactions have occurred. 0 means never compress this table. Applies only when binary logging is disabled. Added in MySQL 5.7.6.

* `have_statement_timeout`: Whether statement execution timeout is available. Added in MySQL 5.7.4.

* `initialize`: Whether to run in initialization mode (secure). Added in MySQL 5.7.6.

* `initialize-insecure`: Whether to run in initialization mode (insecure). Added in MySQL 5.7.6.

* `innodb_adaptive_hash_index_parts`: Partitions adaptive hash index search system into n partitions, with each partition protected by separate latch. Each index is bound to specific partition based on space ID and index ID attributes. Added in MySQL 5.7.8.

* `innodb_background_drop_list_empty`: Delays table creation until background drop list is empty (debug). Added in MySQL 5.7.10.

* `innodb_buffer_pool_chunk_size`: Chunk size used when resizing buffer pool. Added in MySQL 5.7.5.

* `innodb_buffer_pool_dump_pct`: Percentage of most recently used pages for each buffer pool to read out and dump. Added in MySQL 5.7.2.

* `innodb_compress_debug`: Compresses all tables using specified compression algorithm. Added in MySQL 5.7.8.

* `innodb_deadlock_detect`: Enables or disables deadlock detection. Added in MySQL 5.7.15.

* `innodb_default_row_format`: Default row format for InnoDB tables. Added in MySQL 5.7.9.

* `innodb_disable_resize_buffer_pool_debug`: Disables resizing of InnoDB buffer pool. Added in MySQL 5.7.6.

* `innodb_fill_factor`: Percentage for B-tree leaf and non-leaf page space to be filled with data. Remaining space is reserved for future growth. Added in MySQL 5.7.5.

* `innodb_flush_sync`: Enable innodb_flush_sync to ignore the innodb_io_capacity and innodb_io_capacity_max settings for bursts of I/O activity that occur at checkpoints. Disable innodb_flush_sync to adhere to limits on I/O activity as defined by innodb_io_capacity and innodb_io_capacity_max. Added in MySQL 5.7.8.

* `innodb_ft_result_cache_limit`: InnoDB FULLTEXT search query result cache limit. Added in MySQL 5.7.2.

* `innodb_ft_total_cache_size`: Total memory allocated for InnoDB FULLTEXT search index cache. Added in MySQL 5.7.2.

* `innodb_log_checkpoint_now`: Debug option that forces InnoDB to write checkpoint. Added in MySQL 5.7.2.

* `innodb_log_checksum_algorithm`: Specifies how to generate and verify checksum stored in each redo log disk block. Added in MySQL 5.7.8.

* `innodb_log_checksums`: Enables or disables checksums for redo log pages. Added in MySQL 5.7.9.

* `innodb_log_write_ahead_size`: Redo log write-ahead block size. Added in MySQL 5.7.4.

* `innodb_max_undo_log_size`: Sets threshold for truncating InnoDB undo log. Added in MySQL 5.7.5.

* `innodb_merge_threshold_set_all_debug`: Overrides current MERGE_THRESHOLD setting with specified value for all indexes that are currently in dictionary cache. Added in MySQL 5.7.6.

* `innodb_numa_interleave`: Enables NUMA MPOL_INTERLEAVE memory policy for allocation of InnoDB buffer pool. Added in MySQL 5.7.9.

* `innodb_optimize_point_storage`: Enable this option to store POINT data as fixed-length data rather than variable-length data. Added in MySQL 5.7.5.

* `innodb_page_cleaners`: Number of page cleaner threads. Added in MySQL 5.7.4.

* `innodb_purge_rseg_truncate_frequency`: Rate at which undo log purge should be invoked as part of purge action. Value = n invokes undo log purge on every nth iteration of purge invocation. Added in MySQL 5.7.5.

* `innodb_stats_include_delete_marked`: Include delete-marked records when calculating persistent InnoDB statistics. Added in MySQL 5.7.17.

* `innodb_status_output`: Used to enable or disable periodic output for standard InnoDB Monitor. Also used in combination with innodb_status_output_locks to enable and disable periodic output for InnoDB Lock Monitor. Added in MySQL 5.7.4.

* `innodb_status_output_locks`: Used to enable or disable periodic output for standard InnoDB Lock Monitor. innodb_status_output must also be enabled to produce periodic output for InnoDB Lock Monitor. Added in MySQL 5.7.4.

* `innodb_sync_debug`: Enables InnoDB sync debug checking. Added in MySQL 5.7.8.

* `innodb_temp_data_file_path`: Path to temporary tablespace data files and their sizes. Added in MySQL 5.7.1.

* `innodb_tmpdir`: Directory location for temporary table files created during online ALTER TABLE operations. Added in MySQL 5.7.11.

* `innodb_undo_log_truncate`: Enable this option to mark InnoDB undo tablespace for truncation. Added in MySQL 5.7.5.

* `internal_tmp_disk_storage_engine`: Storage engine for internal temporary tables. Added in MySQL 5.7.5.

* `keyring-migration-destination`: Key migration destination keyring plugin. Added in MySQL 5.7.21.

* `keyring-migration-host`: Host name for connecting to running server for key migration. Added in MySQL 5.7.21.

* `keyring-migration-password`: Password for connecting to running server for key migration. Added in MySQL 5.7.21.

* `keyring-migration-port`: TCP/IP port number for connecting to running server for key migration. Added in MySQL 5.7.21.

* `keyring-migration-socket`: Unix socket file or Windows named pipe for connecting to running server for key migration. Added in MySQL 5.7.21.

* `keyring-migration-source`: Key migration source keyring plugin. Added in MySQL 5.7.21.

* `keyring-migration-user`: User name for connecting to running server for key migration. Added in MySQL 5.7.21.

* `keyring_aws_cmk_id`: AWS keyring plugin customer master key ID value. Added in MySQL 5.7.19.

* `keyring_aws_conf_file`: AWS keyring plugin configuration file location. Added in MySQL 5.7.19.

* `keyring_aws_data_file`: AWS keyring plugin storage file location. Added in MySQL 5.7.19.

* `keyring_aws_region`: AWS keyring plugin region. Added in MySQL 5.7.19.

* `keyring_encrypted_file_data`: keyring_encrypted_file plugin data file. Added in MySQL 5.7.21.

* `keyring_encrypted_file_password`: keyring_encrypted_file plugin password. Added in MySQL 5.7.21.

* `keyring_file_data`: keyring_file plugin data file. Added in MySQL 5.7.11.

* `keyring_okv_conf_dir`: Oracle Key Vault keyring plugin configuration directory. Added in MySQL 5.7.12.

* `keyring_operations`: Whether keyring operations are enabled. Added in MySQL 5.7.21.

* `log_backward_compatible_user_definitions`: Whether to log CREATE/ALTER USER, GRANT in backward-compatible fashion. Added in MySQL 5.7.6.

* `log_builtin_as_identified_by_password`: Whether to log CREATE/ALTER USER, GRANT in backward-compatible fashion. Added in MySQL 5.7.9.

* `log_error_verbosity`: Error logging verbosity level. Added in MySQL 5.7.2.

* `log_slow_admin_statements`: Log slow OPTIMIZE, ANALYZE, ALTER and other administrative statements to slow query log if it is open. Added in MySQL 5.7.1.

* `log_slow_slave_statements`: Cause slow statements as executed by replica to be written to slow query log. Added in MySQL 5.7.1.

* `log_statements_unsafe_for_binlog`: Disables error 1592 warnings being written to error log. Added in MySQL 5.7.11.

* `log_syslog`: Whether to write error log to syslog. Added in MySQL 5.7.5.

* `log_syslog_facility`: Facility for syslog messages. Added in MySQL 5.7.5.

* `log_syslog_include_pid`: Whether to include server PID in syslog messages. Added in MySQL 5.7.5.

* `log_syslog_tag`: Tag for server identifier in syslog messages. Added in MySQL 5.7.5.

* `log_timestamps`: Log timestamp format. Added in MySQL 5.7.2.

* `max_digest_length`: Maximum digest size in bytes. Added in MySQL 5.7.6.

* `max_execution_time`: Statement execution timeout value. Added in MySQL 5.7.8.

* `max_points_in_geometry`: Maximum number of points in geometry values for ST_Buffer_Strategy(). Added in MySQL 5.7.8.

* `max_statement_time`: Statement execution timeout value. Added in MySQL 5.7.4.

* `mecab_charset`: Character set currently used by MeCab full-text parser plugin. Added in MySQL 5.7.6.

* `mecab_rc_file`: Path to mecabrc configuration file for MeCab parser for full-text search. Added in MySQL 5.7.6.

* `mysql_firewall_mode`: Whether MySQL Enterprise Firewall plugin is operational. Added in MySQL 5.7.9.

* `mysql_firewall_trace`: Whether to enable MySQL Enterprise Firewall plugin trace. Added in MySQL 5.7.9.

* `mysql_native_password_proxy_users`: Whether mysql_native_password authentication plugin does proxying. Added in MySQL 5.7.7.

* `mysqlx`: Whether X Plugin is initialized. Added in MySQL 5.7.12.

* `mysqlx_bind_address`: Network address X Plugin uses for connections. Added in MySQL 5.7.17.

* `mysqlx_connect_timeout`: Maximum permitted waiting time in seconds for a connection to set up a session. Added in MySQL 5.7.12.

* `mysqlx_idle_worker_thread_timeout`: Time in seconds after which idle worker threads are terminated. Added in MySQL 5.7.12.

* `mysqlx_max_allowed_packet`: Maximum size of network packets that can be received by X Plugin. Added in MySQL 5.7.12.

* `mysqlx_max_connections`: Maximum number of concurrent client connections X Plugin can accept. Added in MySQL 5.7.12.

* `mysqlx_min_worker_threads`: Minimum number of worker threads used for handling client requests. Added in MySQL 5.7.12.

* `mysqlx_port`: Port number on which X Plugin accepts TCP/IP connections. Added in MySQL 5.7.12.

* `mysqlx_port_open_timeout`: Time which X Plugin waits when accepting connections. Added in MySQL 5.7.17.

* `mysqlx_socket`: Path to socket where X Plugin listens for connections. Added in MySQL 5.7.15.

* `mysqlx_ssl_ca`: File that contains list of trusted SSL Certificate Authorities. Added in MySQL 5.7.12.

* `mysqlx_ssl_capath`: Directory that contains trusted SSL Certificate Authority certificate files. Added in MySQL 5.7.12.

* `mysqlx_ssl_cert`: File that contains X.509 certificate. Added in MySQL 5.7.12.

* `mysqlx_ssl_cipher`: Permissible ciphers for connection encryption. Added in MySQL 5.7.12.

* `mysqlx_ssl_crl`: File that contains certificate revocation lists. Added in MySQL 5.7.12.

* `mysqlx_ssl_crlpath`: Directory that contains certificate revocation list files. Added in MySQL 5.7.12.

* `mysqlx_ssl_key`: File that contains X.509 key. Added in MySQL 5.7.12.

* `named_pipe_full_access_group`: Name of Windows group granted full access to named pipe. Added in MySQL 5.7.25.

* `ngram_token_size`: Defines n-gram token size for full-text search ngram parser. Added in MySQL 5.7.6.

* `offline_mode`: Whether server is offline. Added in MySQL 5.7.5.

* `parser_max_mem_size`: Maximum amount of memory available to parser. Added in MySQL 5.7.12.

* `performance-schema-consumer-events-transactions-current`: Configure events-transactions-current consumer. Added in MySQL 5.7.3.

* `performance-schema-consumer-events-transactions-history`: Configure events-transactions-history consumer. Added in MySQL 5.7.3.

* `performance-schema-consumer-events-transactions-history-long`: Configure events-transactions-history-long consumer. Added in MySQL 5.7.3.

* `performance_schema_events_transactions_history_long_size`: Number of rows in events_transactions_history_long table. Added in MySQL 5.7.3.

* `performance_schema_events_transactions_history_size`: Number of rows per thread in events_transactions_history table. Added in MySQL 5.7.3.

* `performance_schema_max_digest_length`: Maximum Performance Schema digest size in bytes. Added in MySQL 5.7.8.

* `performance_schema_max_index_stat`: Maximum number of indexes to keep statistics for. Added in MySQL 5.7.6.

* `performance_schema_max_memory_classes`: Maximum number of memory instruments. Added in MySQL 5.7.2.

* `performance_schema_max_metadata_locks`: Maximum number of metadata locks to track. Added in MySQL 5.7.3.

* `performance_schema_max_prepared_statements_instances`: Number of rows in prepared_statements_instances table. Added in MySQL 5.7.4.

* `performance_schema_max_program_instances`: Maximum number of stored programs for statistics. Added in MySQL 5.7.2.

* `performance_schema_max_sql_text_length`: Maximum number of bytes stored from SQL statements. Added in MySQL 5.7.6.

* `performance_schema_max_statement_stack`: Maximum stored program nesting for statistics. Added in MySQL 5.7.2.

* `performance_schema_max_table_lock_stat`: Maximum number of tables to keep lock statistics for. Added in MySQL 5.7.6.

* `performance_schema_show_processlist`: Select SHOW PROCESSLIST implementation. Added in MySQL 5.7.39.

* `range_optimizer_max_mem_size`: Limit on range optimizer memory consumption. Added in MySQL 5.7.9.

* `rbr_exec_mode`: Allows for switching server between IDEMPOTENT mode (key and some other errors suppressed) and STRICT mode; STRICT mode is default. Added in MySQL 5.7.1.

* `replication_optimize_for_static_plugin_config`: Shared locks for semisynchronous replication. Added in MySQL 5.7.33.

* `replication_sender_observe_commit_only`: Limited callbacks for semisynchronous replication. Added in MySQL 5.7.33.

* `require_secure_transport`: Whether client connections must use secure transport. Added in MySQL 5.7.8.

* `rewriter_enabled`: Whether query rewrite plugin is enabled. Added in MySQL 5.7.6.

* `rewriter_verbose`: For internal use. Added in MySQL 5.7.6.

* `rpl_semi_sync_master_wait_for_slave_count`: Number of replica acknowledgments source must receive per transaction before proceeding. Added in MySQL 5.7.3.

* `rpl_semi_sync_master_wait_point`: Wait point for replica transaction receipt acknowledgment. Added in MySQL 5.7.2.

* `rpl_stop_slave_timeout`: Number of seconds that STOP REPLICA or STOP SLAVE waits before timing out. Added in MySQL 5.7.2.

* `session_track_gtids`: Enables tracker which can be set to track different GTIDs. Added in MySQL 5.7.6.

* `session_track_schema`: Whether to track schema changes. Added in MySQL 5.7.4.

* `session_track_state_change`: Whether to track session state changes. Added in MySQL 5.7.4.

* `session_track_system_variables`: Session variables to track changes for. Added in MySQL 5.7.4.

* `session_track_transaction_info`: How to perform transaction tracking. Added in MySQL 5.7.8.

* `sha256_password_auto_generate_rsa_keys`: Whether to generate RSA key-pair files automatically. Added in MySQL 5.7.5.

* `sha256_password_proxy_users`: Whether sha256_password authentication plugin does proxying. Added in MySQL 5.7.7.

* `show_compatibility_56`: Compatibility for SHOW STATUS/VARIABLES. Added in MySQL 5.7.6.

* `show_create_table_verbosity`: Whether to display ROW_FORMAT in SHOW CREATE TABLE even if it has default value. Added in MySQL 5.7.22.

* `show_old_temporals`: Whether SHOW CREATE TABLE should indicate pre-5.6.4 temporal columns. Added in MySQL 5.7.6.

* `simplified_binlog_gtid_recovery`: Renamed to binlog_gtid_simple_recovery. Added in MySQL 5.7.5.

* `slave_parallel_type`: Tells replica to use timestamp information (LOGICAL_CLOCK) or database partioning (DATABASE) to parallelize transactions. Added in MySQL 5.7.2.

* `slave_preserve_commit_order`: Ensures that all commits by replica workers happen in same order as on source to maintain consistency when using parallel applier threads. Added in MySQL 5.7.5.

* `super_read_only`: Whether to ignore SUPER exceptions to read-only mode. Added in MySQL 5.7.8.

* `thread_pool_algorithm`: Thread pool algorithm. Added in MySQL 5.7.9.

* `thread_pool_high_priority_connection`: Whether current session is high priority. Added in MySQL 5.7.9.

* `thread_pool_max_unused_threads`: Maximum permissible number of unused threads. Added in MySQL 5.7.9.

* `thread_pool_prio_kickup_timer`: How long before statement is moved to high-priority execution. Added in MySQL 5.7.9.

* `thread_pool_size`: Number of thread groups in thread pool. Added in MySQL 5.7.9.

* `thread_pool_stall_limit`: How long before statement is defined as stalled. Added in MySQL 5.7.9.

* `tls_version`: Permissible TLS protocols for encrypted connections. Added in MySQL 5.7.10.

* `transaction_write_set_extraction`: Defines algorithm used to hash writes extracted during transaction. Added in MySQL 5.7.6.

* `validate_password_check_user_name`: Whether to check passwords against user name. Added in MySQL 5.7.15.

* `validate_password_dictionary_file_last_parsed`: When dictionary file was last parsed. Added in MySQL 5.7.8.

* `validate_password_dictionary_file_words_count`: Number of words in dictionary file. Added in MySQL 5.7.8.

* `version_tokens_session`: Client token list for Version Tokens. Added in MySQL 5.7.8.

* `version_tokens_session_number`: For internal use. Added in MySQL 5.7.8.

### Options and Variables Deprecated in MySQL 5.7

The following system variables, status variables, and options have been deprecated in MySQL 5.7.

* `Innodb_available_undo_logs`: Total number of InnoDB rollback segments; different from innodb_rollback_segments, which displays number of active rollback segments. Deprecated in MySQL 5.7.19.

* `Qcache_free_blocks`: Number of free memory blocks in query cache. Deprecated in MySQL 5.7.20.

* `Qcache_free_memory`: Amount of free memory for query cache. Deprecated in MySQL 5.7.20.

* `Qcache_hits`: Number of query cache hits. Deprecated in MySQL 5.7.20.

* `Qcache_inserts`: Number of query cache inserts. Deprecated in MySQL 5.7.20.

* `Qcache_lowmem_prunes`: Number of queries which were deleted from query cache due to lack of free memory in cache. Deprecated in MySQL 5.7.20.

* `Qcache_not_cached`: Number of noncached queries (not cacheable, or not cached due to query_cache_type setting). Deprecated in MySQL 5.7.20.

* `Qcache_queries_in_cache`: Number of queries registered in query cache. Deprecated in MySQL 5.7.20.

* `Qcache_total_blocks`: Total number of blocks in query cache. Deprecated in MySQL 5.7.20.

* `Slave_heartbeat_period`: Replica's replication heartbeat interval, in seconds. Deprecated in MySQL 5.7.6.

* `Slave_last_heartbeat`: Shows when latest heartbeat signal was received, in TIMESTAMP format. Deprecated in MySQL 5.7.6.

* `Slave_received_heartbeats`: Number of heartbeats received by replica since previous reset. Deprecated in MySQL 5.7.6.

* `Slave_retried_transactions`: Total number of times since startup that replication SQL thread has retried transactions. Deprecated in MySQL 5.7.6.

* `Slave_running`: State of this server as replica (replication I/O thread status). Deprecated in MySQL 5.7.6.

* `avoid_temporal_upgrade`: Whether ALTER TABLE should upgrade pre-5.6.4 temporal columns. Deprecated in MySQL 5.7.6.

* `binlog_max_flush_queue_time`: How long to read transactions before flushing to binary log. Deprecated in MySQL 5.7.9.

* `bootstrap`: Used by mysql installation scripts. Deprecated in MySQL 5.7.6.

* `des-key-file`: Load keys for des_encrypt() and des_encrypt from given file. Deprecated in MySQL 5.7.6.

* `disable-partition-engine-check`: Whether to disable startup check for tables without native partitioning. Deprecated in MySQL 5.7.17.

* `group_replication_allow_local_disjoint_gtids_join`: Allow current server to join group even if it has transactions not present in group. Deprecated in MySQL 5.7.21.

* `have_crypt`: Availability of crypt() system call. Deprecated in MySQL 5.7.6.

* `have_query_cache`: Whether mysqld supports query cache. Deprecated in MySQL 5.7.20.

* `ignore-db-dir`: Treat directory as nondatabase directory. Deprecated in MySQL 5.7.16.

* `ignore_db_dirs`: Directories treated as nondatabase directories. Deprecated in MySQL 5.7.16.

* `innodb`: Enable InnoDB (if this version of MySQL supports it). Deprecated in MySQL 5.7.5.

* `innodb_file_format`: Format for new InnoDB tables. Deprecated in MySQL 5.7.7.

* `innodb_file_format_check`: Whether InnoDB performs file format compatibility checking. Deprecated in MySQL 5.7.7.

* `innodb_file_format_max`: File format tag in shared tablespace. Deprecated in MySQL 5.7.7.

* `innodb_large_prefix`: Enables longer keys for column prefix indexes. Deprecated in MySQL 5.7.7.

* `innodb_support_xa`: Enable InnoDB support for XA two-phase commit. Deprecated in MySQL 5.7.10.

* `innodb_undo_logs`: Number of undo logs (rollback segments) used by InnoDB; alias for innodb_rollback_segments. Deprecated in MySQL 5.7.19.

* `innodb_undo_tablespaces`: Number of tablespace files that rollback segments are divided between. Deprecated in MySQL 5.7.21.

* `log-warnings`: Write some noncritical warnings to log file. Deprecated in MySQL 5.7.2.

* `metadata_locks_cache_size`: Size of metadata locks cache. Deprecated in MySQL 5.7.4.

* `metadata_locks_hash_instances`: Number of metadata lock hashes. Deprecated in MySQL 5.7.4.

* `myisam_repair_threads`: Number of threads to use when repairing MyISAM tables. 1 disables parallel repair. Deprecated in MySQL 5.7.38.

* `old_passwords`: Selects password hashing method for PASSWORD(). Deprecated in MySQL 5.7.6.

* `partition`: Enable (or disable) partitioning support. Deprecated in MySQL 5.7.16.

* `query_cache_limit`: Do not cache results that are bigger than this. Deprecated in MySQL 5.7.20.

* `query_cache_min_res_unit`: Minimal size of unit in which space for results is allocated (last unit is trimmed after writing all result data). Deprecated in MySQL 5.7.20.

* `query_cache_size`: Memory allocated to store results from old queries. Deprecated in MySQL 5.7.20.

* `query_cache_type`: Query cache type. Deprecated in MySQL 5.7.20.

* `query_cache_wlock_invalidate`: Invalidate queries in query cache on LOCK for write. Deprecated in MySQL 5.7.20.

* `secure_auth`: Disallow authentication for accounts that have old (pre-4.1) passwords. Deprecated in MySQL 5.7.5.

* `show_compatibility_56`: Compatibility for SHOW STATUS/VARIABLES. Deprecated in MySQL 5.7.6.

* `show_old_temporals`: Whether SHOW CREATE TABLE should indicate pre-5.6.4 temporal columns. Deprecated in MySQL 5.7.6.

* `skip-partition`: Do not enable user-defined partitioning. Deprecated in MySQL 5.7.16.

* `sync_frm`: Sync .frm to disk on create. Enabled by default. Deprecated in MySQL 5.7.6.

* `temp-pool`: Using this option causes most temporary files created to use small set of names, rather than unique name for each new file. Deprecated in MySQL 5.7.18.

* `tx_isolation`: Default transaction isolation level. Deprecated in MySQL 5.7.20.

* `tx_read_only`: Default transaction access mode. Deprecated in MySQL 5.7.20.

### Options and Variables Removed in MySQL 5.7

The following system variables, status variables, and options have been removed in MySQL 5.7.

* `Com_show_slave_status_nonblocking`: Count of SHOW REPLICA | SLAVE STATUS NONBLOCKING statements. Removed in MySQL 5.7.6.

* `Max_statement_time_exceeded`: Number of statements that exceeded execution timeout value. Removed in MySQL 5.7.8.

* `Max_statement_time_set`: Number of statements for which execution timeout was set. Removed in MySQL 5.7.8.

* `Max_statement_time_set_failed`: Number of statements for which execution timeout setting failed. Removed in MySQL 5.7.8.

* `binlogging_impossible_mode`: Deprecated and later removed. Use binlog_error_action instead. Removed in MySQL 5.7.6.

* `default-authentication-plugin`: Default authentication plugin. Removed in MySQL 5.7.2.

* `executed_gtids_compression_period`: Renamed to gtid_executed_compression_period. Removed in MySQL 5.7.6.

* `innodb_additional_mem_pool_size`: Size of memory pool InnoDB uses to store data dictionary information and other internal data structures. Removed in MySQL 5.7.4.

* `innodb_log_checksum_algorithm`: Specifies how to generate and verify checksum stored in each redo log disk block. Removed in MySQL 5.7.9.

* `innodb_optimize_point_storage`: Enable this option to store POINT data as fixed-length data rather than variable-length data. Removed in MySQL 5.7.6.

* `innodb_use_sys_malloc`: Whether InnoDB uses OS or own memory allocator. Removed in MySQL 5.7.4.

* `log-slow-admin-statements`: Log slow OPTIMIZE, ANALYZE, ALTER and other administrative statements to slow query log if it is open. Removed in MySQL 5.7.1.

* `log-slow-slave-statements`: Cause slow statements as executed by replica to be written to slow query log. Removed in MySQL 5.7.1.

* `log_backward_compatible_user_definitions`: Whether to log CREATE/ALTER USER, GRANT in backward-compatible fashion. Removed in MySQL 5.7.9.

* `max_statement_time`: Statement execution timeout value. Removed in MySQL 5.7.8.

* `myisam_repair_threads`: Number of threads to use when repairing MyISAM tables. 1 disables parallel repair. Removed in MySQL 5.7.39.

* `simplified_binlog_gtid_recovery`: Renamed to binlog_gtid_simple_recovery. Removed in MySQL 5.7.6.

* `storage_engine`: Default storage engine. Removed in MySQL 5.7.5.

* `thread_concurrency`: Permits application to provide hint to threads system for desired number of threads which should be run at one time. Removed in MySQL 5.7.2.

* `timed_mutexes`: Specify whether to time mutexes (only InnoDB mutexes are currently supported). Removed in MySQL 5.7.5.
