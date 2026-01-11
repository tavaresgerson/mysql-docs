## 1.4 Server and Status Variables and Options Added, Deprecated, or Removed in MySQL 8.0

* Options and Variables Introduced in MySQL 8.0
* Options and Variables Deprecated in MySQL 8.0
* Options and Variables Removed in MySQL 8.0

This section lists server variables, status variables, and options that were added for the first time, have been deprecated, or have been removed in MySQL 8.0.

### Options and Variables Introduced in MySQL 8.0

The following system variables, status variables, and server options have been added in MySQL 8.0.

* `Acl_cache_items_count`: Number of cached privilege objects. Added in MySQL 8.0.0.

* `Audit_log_current_size`: Audit log file current size. Added in MySQL 8.0.11.

* `Audit_log_event_max_drop_size`: Size of largest dropped audited event. Added in MySQL 8.0.11.

* `Audit_log_events`: Number of handled audited events. Added in MySQL 8.0.11.

* `Audit_log_events_filtered`: Number of filtered audited events. Added in MySQL 8.0.11.

* `Audit_log_events_lost`: Number of dropped audited events. Added in MySQL 8.0.11.

* `Audit_log_events_written`: Number of written audited events. Added in MySQL 8.0.11.

* `Audit_log_total_size`: Combined size of written audited events. Added in MySQL 8.0.11.

* `Audit_log_write_waits`: Number of write-delayed audited events. Added in MySQL 8.0.11.

* `Authentication_ldap_sasl_supported_methods`: Supported authentication methods for SASL LDAP authentication. Added in MySQL 8.0.21.

* `Caching_sha2_password_rsa_public_key`: caching_sha2_password authentication plugin RSA public key value. Added in MySQL 8.0.4.

* `Com_alter_resource_group`: Count of ALTER RESOURCE GROUP statements. Added in MySQL 8.0.3.

* `Com_alter_user_default_role`: Count of ALTER USER ... DEFAULT ROLE statements. Added in MySQL 8.0.0.

* `Com_change_replication_source`: Count of CHANGE REPLICATION SOURCE TO and CHANGE MASTER TO statements. Added in MySQL 8.0.23.

* `Com_clone`: Count of CLONE statements. Added in MySQL 8.0.2.

* `Com_create_resource_group`: Count of CREATE RESOURCE GROUP statements. Added in MySQL 8.0.3.

* `Com_create_role`: Count of CREATE ROLE statements. Added in MySQL 8.0.0.

* `Com_drop_resource_group`: Count of DROP RESOURCE GROUP statements. Added in MySQL 8.0.3.

* `Com_drop_role`: Count of DROP ROLE statements. Added in MySQL 8.0.0.

* `Com_grant_roles`: Count of GRANT ROLE statements. Added in MySQL 8.0.0.

* `Com_install_component`: Count of INSTALL COMPONENT statements. Added in MySQL 8.0.0.

* `Com_replica_start`: Count of START REPLICA and START SLAVE statements. Added in MySQL 8.0.22.

* `Com_replica_stop`: Count of STOP REPLICA and STOP SLAVE statements. Added in MySQL 8.0.22.

* `Com_restart`: Count of RESTART statements. Added in MySQL 8.0.4.

* `Com_revoke_roles`: Count of REVOKE ROLES statements. Added in MySQL 8.0.0.

* `Com_set_resource_group`: Count of SET RESOURCE GROUP statements. Added in MySQL 8.0.3.

* `Com_set_role`: Count of SET ROLE statements. Added in MySQL 8.0.0.

* `Com_show_replica_status`: Count of SHOW REPLICA STATUS and SHOW SLAVE STATUS statements. Added in MySQL 8.0.22.

* `Com_show_replicas`: Count of SHOW REPLICAS and SHOW SLAVE HOSTS statements. Added in MySQL 8.0.22.

* `Com_uninstall_component`: Count of UINSTALL COMPONENT statements. Added in MySQL 8.0.0.

* `Compression_algorithm`: Compression algorithm for current connection. Added in MySQL 8.0.18.

* `Compression_level`: Compression level for current connection. Added in MySQL 8.0.18.

* `Connection_control_delay_generated`: How many times server delayed connection request. Added in MySQL 8.0.1.

* `Current_tls_ca`: Current value of ssl_ca system variable. Added in MySQL 8.0.16.

* `Current_tls_capath`: Current value of ssl_capath system variable. Added in MySQL 8.0.16.

* `Current_tls_cert`: Current value of ssl_cert system variable. Added in MySQL 8.0.16.

* `Current_tls_cipher`: Current value of ssl_cipher system variable. Added in MySQL 8.0.16.

* `Current_tls_ciphersuites`: Current value of tsl_ciphersuites system variable. Added in MySQL 8.0.16.

* `Current_tls_crl`: Current value of ssl_crl system variable. Added in MySQL 8.0.16.

* `Current_tls_crlpath`: Current value of ssl_crlpath system variable. Added in MySQL 8.0.16.

* `Current_tls_key`: Current value of ssl_key system variable. Added in MySQL 8.0.16.

* `Current_tls_version`: Current value of tls_version system variable. Added in MySQL 8.0.16.

* `Error_log_buffered_bytes`: Number of bytes used in error_log table. Added in MySQL 8.0.22.

* `Error_log_buffered_events`: Number of events in error_log table. Added in MySQL 8.0.22.

* `Error_log_expired_events`: Number of events discarded from error_log table. Added in MySQL 8.0.22.

* `Error_log_latest_write`: Time of last write to error_log table. Added in MySQL 8.0.22.

* `Firewall_access_denied`: Number of statements rejected by MySQL Enterprise Firewall plugin. Added in MySQL 8.0.11.

* `Firewall_access_granted`: Number of statements accepted by MySQL Enterprise Firewall plugin. Added in MySQL 8.0.11.

* `Firewall_cached_entries`: Number of statements recorded by MySQL Enterprise Firewall plugin. Added in MySQL 8.0.11.

* `Global_connection_memory`: Amount of memory currently used by all user threads. Added in MySQL 8.0.28.

* `Innodb_buffer_pool_resize_status_code`: InnoDB buffer pool resize status code. Added in MySQL 8.0.31.

* `Innodb_buffer_pool_resize_status_progress`: InnoDB buffer pool resize status progress. Added in MySQL 8.0.31.

* `Innodb_redo_log_capacity_resized`: Redo log capacity after the last completed capacity resize operation. Added in MySQL 8.0.30.

* `Innodb_redo_log_checkpoint_lsn`: The redo log checkpoint LSN. Added in MySQL 8.0.30.

* `Innodb_redo_log_current_lsn`: The redo log current LSN. Added in MySQL 8.0.30.

* `Innodb_redo_log_enabled`: InnoDB redo log status. Added in MySQL 8.0.21.

* `Innodb_redo_log_flushed_to_disk_lsn`: The red log flushed-to-disk LSN. Added in MySQL 8.0.30.

* `Innodb_redo_log_logical_size`: The redo log logical size. Added in MySQL 8.0.30.

* `Innodb_redo_log_physical_size`: The redo log physical size. Added in MySQL 8.0.30.

* `Innodb_redo_log_read_only`: Whether the redo log is read-only. Added in MySQL 8.0.30.

* `Innodb_redo_log_resize_status`: The redo log resize status. Added in MySQL 8.0.30.

* `Innodb_redo_log_uuid`: The redo log UUID. Added in MySQL 8.0.30.

* `Innodb_system_rows_deleted`: Number of rows deleted from system schema tables. Added in MySQL 8.0.19.

* `Innodb_system_rows_inserted`: Number of rows inserted into system schema tables. Added in MySQL 8.0.19.

* `Innodb_system_rows_read`: Number of rows read from system schema tables. Added in MySQL 8.0.19.

* `Innodb_system_rows_updated`: Number of rows updated in system schema tables. Added in MySQL 8.0.19.

* `Innodb_undo_tablespaces_active`: Number of active undo tablespaces. Added in MySQL 8.0.14.

* `Innodb_undo_tablespaces_explicit`: Number of user-created undo tablespaces. Added in MySQL 8.0.14.

* `Innodb_undo_tablespaces_implicit`: Number of undo tablespaces created by InnoDB. Added in MySQL 8.0.14.

* `Innodb_undo_tablespaces_total`: Total number of undo tablespaces. Added in MySQL 8.0.14.

* `Mysqlx_bytes_received_compressed_payload`: Number of bytes received as compressed message payloads, measured before decompression. Added in MySQL 8.0.19.

* `Mysqlx_bytes_received_uncompressed_frame`: Number of bytes received as compressed message payloads, measured after decompression. Added in MySQL 8.0.19.

* `Mysqlx_bytes_sent_compressed_payload`: Number of bytes sent as compressed message payloads, measured after compression. Added in MySQL 8.0.19.

* `Mysqlx_bytes_sent_uncompressed_frame`: Number of bytes sent as compressed message payloads, measured before compression. Added in MySQL 8.0.19.

* `Mysqlx_compression_algorithm`: Compression algorithm in use for X Protocol connection for this session. Added in MySQL 8.0.20.

* `Mysqlx_compression_level`: Compression level in use for X Protocol connection for this session. Added in MySQL 8.0.20.

* `Replica_open_temp_tables`: Number of temporary tables that replication SQL thread currently has open. Added in MySQL 8.0.26.

* `Replica_rows_last_search_algorithm_used`: Search algorithm most recently used by this replica to locate rows for row-based replication (index, table, or hash scan). Added in MySQL 8.0.26.

* `Resource_group_supported`: Whether server supports the resource group feature. Added in MySQL 8.0.31.

* `Rpl_semi_sync_replica_status`: Whether semisynchronous replication is operational on replica. Added in MySQL 8.0.26.

* `Rpl_semi_sync_source_clients`: Number of semisynchronous replicas. Added in MySQL 8.0.26.

* `Rpl_semi_sync_source_net_avg_wait_time`: Average time source has waited for replies from replica. Added in MySQL 8.0.26.

* `Rpl_semi_sync_source_net_wait_time`: Total time source has waited for replies from replica. Added in MySQL 8.0.26.

* `Rpl_semi_sync_source_net_waits`: Total number of times source waited for replies from replica. Added in MySQL 8.0.26.

* `Rpl_semi_sync_source_no_times`: Number of times source turned off semisynchronous replication. Added in MySQL 8.0.26.

* `Rpl_semi_sync_source_no_tx`: Number of commits not acknowledged successfully. Added in MySQL 8.0.26.

* `Rpl_semi_sync_source_status`: Whether semisynchronous replication is operational on source. Added in MySQL 8.0.26.

* `Rpl_semi_sync_source_timefunc_failures`: Number of times source failed when calling time functions. Added in MySQL 8.0.26.

* `Rpl_semi_sync_source_tx_avg_wait_time`: Average time source waited for each transaction. Added in MySQL 8.0.26.

* `Rpl_semi_sync_source_tx_wait_time`: Total time source waited for transactions. Added in MySQL 8.0.26.

* `Rpl_semi_sync_source_tx_waits`: Total number of times source waited for transactions. Added in MySQL 8.0.26.

* `Rpl_semi_sync_source_wait_pos_backtraverse`: Total number of times source has waited for event with binary coordinates lower than events waited for previously. Added in MySQL 8.0.26.

* `Rpl_semi_sync_source_wait_sessions`: Number of sessions currently waiting for replica replies. Added in MySQL 8.0.26.

* `Rpl_semi_sync_source_yes_tx`: Number of commits acknowledged successfully. Added in MySQL 8.0.26.

* `Secondary_engine_execution_count`: Number of queries offloaded to a secondary engine. Added in MySQL 8.0.13.

* `Ssl_session_cache_timeout`: Current SSL session timeout value in cache. Added in MySQL 8.0.29.

* `Telemetry_traces_supported`: Whether server telemetry traces is supported. Added in MySQL 8.0.33.

* `Tls_library_version`: Runtime version of OpenSSL library in use. Added in MySQL 8.0.30.

* `activate_all_roles_on_login`: Whether to activate all user roles at connect time. Added in MySQL 8.0.2.

* `admin-ssl`: Enable connection encryption. Added in MySQL 8.0.21.

* `admin_address`: IP address to bind to for connections on administrative interface. Added in MySQL 8.0.14.

* `admin_port`: TCP/IP number to use for connections on administrative interface. Added in MySQL 8.0.14.

* `admin_ssl_ca`: File that contains list of trusted SSL Certificate Authorities. Added in MySQL 8.0.21.

* `admin_ssl_capath`: Directory that contains trusted SSL Certificate Authority certificate files. Added in MySQL 8.0.21.

* `admin_ssl_cert`: File that contains X.509 certificate. Added in MySQL 8.0.21.

* `admin_ssl_cipher`: Permissible ciphers for connection encryption. Added in MySQL 8.0.21.

* `admin_ssl_crl`: File that contains certificate revocation lists. Added in MySQL 8.0.21.

* `admin_ssl_crlpath`: Directory that contains certificate revocation list files. Added in MySQL 8.0.21.

* `admin_ssl_key`: File that contains X.509 key. Added in MySQL 8.0.21.

* `admin_tls_ciphersuites`: Permissible TLSv1.3 ciphersuites for encrypted connections. Added in MySQL 8.0.21.

* `admin_tls_version`: Permissible TLS protocols for encrypted connections. Added in MySQL 8.0.21.

* `audit-log`: Whether to activate audit log plugin. Added in MySQL 8.0.11.

* `audit_log_buffer_size`: Size of audit log buffer. Added in MySQL 8.0.11.

* `audit_log_compression`: Audit log file compression method. Added in MySQL 8.0.11.

* `audit_log_connection_policy`: Audit logging policy for connection-related events. Added in MySQL 8.0.11.

* `audit_log_current_session`: Whether to audit current session. Added in MySQL 8.0.11.

* `audit_log_database`: Schema where audit tables are stored. Added in MySQL 8.0.33.

* `audit_log_disable`: Whether to disable the audit log. Added in MySQL 8.0.28.

* `audit_log_encryption`: Audit log file encryption method. Added in MySQL 8.0.11.

* `audit_log_exclude_accounts`: Accounts not to audit. Added in MySQL 8.0.11.

* `audit_log_file`: Name of audit log file. Added in MySQL 8.0.11.

* `audit_log_filter_id`: ID of current audit log filter. Added in MySQL 8.0.11.

* `audit_log_flush`: Close and reopen audit log file. Added in MySQL 8.0.11.

* `audit_log_flush_interval_seconds`: Whether to perform a recurring flush of the memory cache. Added in MySQL 8.0.34.

* `audit_log_format`: Audit log file format. Added in MySQL 8.0.11.

* `audit_log_format_unix_timestamp`: Whether to include Unix timestamp in JSON-format audit log. Added in MySQL 8.0.26.

* `audit_log_include_accounts`: Accounts to audit. Added in MySQL 8.0.11.

* `audit_log_max_size`: Limit on combined size of JSON audit log files. Added in MySQL 8.0.26.

* `audit_log_password_history_keep_days`: Number of days to retain archived audit log encryption passwords. Added in MySQL 8.0.17.

* `audit_log_policy`: Audit logging policy. Added in MySQL 8.0.11.

* `audit_log_prune_seconds`: The number of seconds after which audit log files become subject to pruning. Added in MySQL 8.0.24.

* `audit_log_read_buffer_size`: Audit log file read buffer size. Added in MySQL 8.0.11.

* `audit_log_rotate_on_size`: Close and reopen audit log file at this size. Added in MySQL 8.0.11.

* `audit_log_statement_policy`: Audit logging policy for statement-related events. Added in MySQL 8.0.11.

* `audit_log_strategy`: Audit logging strategy. Added in MySQL 8.0.11.

* `authentication_fido_rp_id`: Relying party ID for FIDO multifactor authentication. Added in MySQL 8.0.27.

* `authentication_kerberos_service_key_tab`: File containing Kerberos service keys to authenticate TGS ticket. Added in MySQL 8.0.26.

* `authentication_kerberos_service_principal`: Kerberos service principal name. Added in MySQL 8.0.26.

* `authentication_ldap_sasl_auth_method_name`: Authentication method name. Added in MySQL 8.0.11.

* `authentication_ldap_sasl_bind_base_dn`: LDAP server base distinguished name. Added in MySQL 8.0.11.

* `authentication_ldap_sasl_bind_root_dn`: LDAP server root distinguished name. Added in MySQL 8.0.11.

* `authentication_ldap_sasl_bind_root_pwd`: LDAP server root bind password. Added in MySQL 8.0.11.

* `authentication_ldap_sasl_ca_path`: LDAP server certificate authority file name. Added in MySQL 8.0.11.

* `authentication_ldap_sasl_group_search_attr`: LDAP server group search attribute. Added in MySQL 8.0.11.

* `authentication_ldap_sasl_group_search_filter`: LDAP custom group search filter. Added in MySQL 8.0.11.

* `authentication_ldap_sasl_init_pool_size`: LDAP server initial connection pool size. Added in MySQL 8.0.11.

* `authentication_ldap_sasl_log_status`: LDAP server log level. Added in MySQL 8.0.11.

* `authentication_ldap_sasl_max_pool_size`: LDAP server maximum connection pool size. Added in MySQL 8.0.11.

* `authentication_ldap_sasl_referral`: Whether to enable LDAP search referral. Added in MySQL 8.0.20.

* `authentication_ldap_sasl_server_host`: LDAP server host name or IP address. Added in MySQL 8.0.11.

* `authentication_ldap_sasl_server_port`: LDAP server port number. Added in MySQL 8.0.11.

* `authentication_ldap_sasl_tls`: Whether to use encrypted connections to LDAP server. Added in MySQL 8.0.11.

* `authentication_ldap_sasl_user_search_attr`: LDAP server user search attribute. Added in MySQL 8.0.11.

* `authentication_ldap_simple_auth_method_name`: Authentication method name. Added in MySQL 8.0.11.

* `authentication_ldap_simple_bind_base_dn`: LDAP server base distinguished name. Added in MySQL 8.0.11.

* `authentication_ldap_simple_bind_root_dn`: LDAP server root distinguished name. Added in MySQL 8.0.11.

* `authentication_ldap_simple_bind_root_pwd`: LDAP server root bind password. Added in MySQL 8.0.11.

* `authentication_ldap_simple_ca_path`: LDAP server certificate authority file name. Added in MySQL 8.0.11.

* `authentication_ldap_simple_group_search_attr`: LDAP server group search attribute. Added in MySQL 8.0.11.

* `authentication_ldap_simple_group_search_filter`: LDAP custom group search filter. Added in MySQL 8.0.11.

* `authentication_ldap_simple_init_pool_size`: LDAP server initial connection pool size. Added in MySQL 8.0.11.

* `authentication_ldap_simple_log_status`: LDAP server log level. Added in MySQL 8.0.11.

* `authentication_ldap_simple_max_pool_size`: LDAP server maximum connection pool size. Added in MySQL 8.0.11.

* `authentication_ldap_simple_referral`: Whether to enable LDAP search referral. Added in MySQL 8.0.20.

* `authentication_ldap_simple_server_host`: LDAP server host name or IP address. Added in MySQL 8.0.11.

* `authentication_ldap_simple_server_port`: LDAP server port number. Added in MySQL 8.0.11.

* `authentication_ldap_simple_tls`: Whether to use encrypted connections to LDAP server. Added in MySQL 8.0.11.

* `authentication_ldap_simple_user_search_attr`: LDAP server user search attribute. Added in MySQL 8.0.11.

* `authentication_policy`: Plugins for multifactor authentication; see documentation for syntax. Added in MySQL 8.0.27.

* `authentication_windows_log_level`: Windows authentication plugin logging level. Added in MySQL 8.0.11.

* `authentication_windows_use_principal_name`: Whether to use Windows authentication plugin principal name. Added in MySQL 8.0.11.

* `binlog_encryption`: Enable encryption for binary log files and relay log files on this server. Added in MySQL 8.0.14.

* `binlog_expire_logs_auto_purge`: Controls automatic purging of binary log files; can be overridden when enabled, by setting both binlog_expire_logs_seconds and expire_logs_days to 0. Added in MySQL 8.0.29.

* `binlog_expire_logs_seconds`: Purge binary logs after this many seconds. Added in MySQL 8.0.1.

* `binlog_rotate_encryption_master_key_at_startup`: Rotate binary log master key at server startup. Added in MySQL 8.0.14.

* `binlog_row_metadata`: Whether to record all or only minimal table related metadata to binary log when using row-based logging. Added in MySQL 8.0.1.

* `binlog_row_value_options`: Enables binary logging of partial JSON updates for row-based replication. Added in MySQL 8.0.3.

* `binlog_transaction_compression`: Enable compression for transaction payloads in binary log files. Added in MySQL 8.0.20.

* `binlog_transaction_compression_level_zstd`: Compression level for transaction payloads in binary log files. Added in MySQL 8.0.20.

* `binlog_transaction_dependency_history_size`: Number of row hashes kept for looking up transaction that last updated some row. Added in MySQL 8.0.1.

* `binlog_transaction_dependency_tracking`: Source of dependency information (commit timestamps or transaction write sets) from which to assess which transactions can be executed in parallel by replica's multithreaded applier. Added in MySQL 8.0.1.

* `build_id`: A unique build ID generated at compile time (Linux only). Added in MySQL 8.0.31.

* `caching_sha2_password_auto_generate_rsa_keys`: Whether to autogenerate RSA key-pair files. Added in MySQL 8.0.4.

* `caching_sha2_password_digest_rounds`: Number of hash rounds for caching_sha2_password authentication plugin. Added in MySQL 8.0.24.

* `caching_sha2_password_private_key_path`: SHA2 authentication plugin private key path name. Added in MySQL 8.0.3.

* `caching_sha2_password_public_key_path`: SHA2 authentication plugin public key path name. Added in MySQL 8.0.3.

* `check-table-functions`: How to proceed when scanning data dictionary for functions used in table constraints and other expressions, and such a function causes an error. Use WARN to log warnings; ABORT (default) also logs warnings, and halts any upgrade in progress. Added in MySQL 8.0.42.

* `clone_autotune_concurrency`: Enables dynamic spawning of threads for remote cloning operations. Added in MySQL 8.0.17.

* `clone_block_ddl`: Enables an exclusive backup lock during clone operations. Added in MySQL 8.0.27.

* `clone_buffer_size`: Defines size of intermediate buffer on donor MySQL server instance. Added in MySQL 8.0.17.

* `clone_ddl_timeout`: Number of seconds cloning operation waits for backup lock. Added in MySQL 8.0.17.

* `clone_delay_after_data_drop`: The time delay in seconds before the clone process starts. Added in MySQL 8.0.29.

* `clone_donor_timeout_after_network_failure`: The time allowed to restart a cloning operation after a network failure. Added in MySQL 8.0.24.

* `clone_enable_compression`: Enables compression of data at network layer during cloning. Added in MySQL 8.0.17.

* `clone_max_concurrency`: Maximum number of concurrent threads used to perform cloning operation. Added in MySQL 8.0.17.

* `clone_max_data_bandwidth`: Maximum data transfer rate in MiB per second for remote cloning operation. Added in MySQL 8.0.17.

* `clone_max_network_bandwidth`: Maximum network transfer rate in MiB per second for remote cloning operation. Added in MySQL 8.0.17.

* `clone_ssl_ca`: Specifies path to certificate authority (CA) file. Added in MySQL 8.0.14.

* `clone_ssl_cert`: Specifies path to public key certificate file. Added in MySQL 8.0.14.

* `clone_ssl_key`: Specifies path to private key file. Added in MySQL 8.0.14.

* `clone_valid_donor_list`: Defines donor host addresses for remote cloning operations. Added in MySQL 8.0.17.

* `component_scheduler.enabled`: Whether the scheduler is actively executing tasks. Added in MySQL 8.0.34.

* `connection_control_failed_connections_threshold`: Consecutive failed connection attempts before delays occur. Added in MySQL 8.0.1.

* `connection_control_max_connection_delay`: Maximum delay (milliseconds) for server response to failed connection attempts. Added in MySQL 8.0.1.

* `connection_control_min_connection_delay`: Minimum delay (milliseconds) for server response to failed connection attempts. Added in MySQL 8.0.1.

* `connection_memory_chunk_size`: Update Global_connection_memory only when user memory usage changes by this amount or more; 0 disables updating. Added in MySQL 8.0.28.

* `connection_memory_limit`: Maximum amount of memory that can be consumed by any one user connection before all queries by this user are rejected. Does not apply to system users such as MySQL root. Added in MySQL 8.0.28.

* `create_admin_listener_thread`: Whether to use dedicated listening thread for connections on administrative interface. Added in MySQL 8.0.14.

* `cte_max_recursion_depth`: Common table expression maximum recursion depth. Added in MySQL 8.0.3.

* `ddl-rewriter`: Whether to activate ddl_rewriter plugin. Added in MySQL 8.0.16.

* `default_collation_for_utf8mb4`: Default collation for utf8mb4 character set; for internal use by MySQL Replication only. Added in MySQL 8.0.11.

* `default_table_encryption`: Default schema and tablespace encryption setting. Added in MySQL 8.0.16.

* `dragnet.Status`: Result of most recent assignment to dragnet.log_error_filter_rules. Added in MySQL 8.0.12.

* `dragnet.log_error_filter_rules`: Filter rules for error logging. Added in MySQL 8.0.4.

* `early-plugin-load`: Specify plugins to load before loading mandatory built-in plugins and before storage engine initialization. Added in MySQL 8.0.0.

* `enterprise_encryption.maximum_rsa_key_size`: Maximum size of RSA keys generated by MySQL Enterprise Encryption. Added in MySQL 8.0.30.

* `enterprise_encryption.rsa_support_legacy_padding`: Decrypt and verify legacy MySQL Enterprise Encryption content. Added in MySQL 8.0.30.

* `explain_format`: Determines default output format used by EXPLAIN statements. Added in MySQL 8.0.32.

* `generated_random_password_length`: Maximum length of generated passwords. Added in MySQL 8.0.18.

* `global_connection_memory_limit`: Maximum total amount of memory that can be consumed by all user connections. When exceeded by Global_connection_memory, all queries from regular users are rejected. Does not apply to system users such as MySQL root. Added in MySQL 8.0.28.

* `global_connection_memory_tracking`: Whether or not to calculate global connection memory usage (as shown by Global_connection_memory); default is disabled. Added in MySQL 8.0.28.

* `group_replication_advertise_recovery_endpoints`: Connections offered for distributed recovery. Added in MySQL 8.0.21.

* `group_replication_autorejoin_tries`: Number of tries that member makes to rejoin group automatically. Added in MySQL 8.0.16.

* `group_replication_clone_threshold`: Transaction number gap between donor and recipient above which remote cloning operation is used for state transfer. Added in MySQL 8.0.17.

* `group_replication_communication_debug_options`: Level of debugging messages for Group Replication components. Added in MySQL 8.0.3.

* `group_replication_communication_max_message_size`: Maximum message size for Group Replication communications, larger messages are fragmented. Added in MySQL 8.0.16.

* `group_replication_communication_stack`: Specifies which communication stack (XCom or MySQL) should be used to establish group communication connections between members. Added in MySQL 8.0.27.

* `group_replication_consistency`: Type of transaction consistency guarantee which group provides. Added in MySQL 8.0.14.

* `group_replication_exit_state_action`: How instance behaves when it leaves group involuntarily. Added in MySQL 8.0.12.

* `group_replication_flow_control_hold_percent`: Percentage of group quota to remain unused. Added in MySQL 8.0.2.

* `group_replication_flow_control_max_quota`: Maximum flow control quota for group. Added in MySQL 8.0.2.

* `group_replication_flow_control_member_quota_percent`: Percentage of quota which member should assume is available for itself when calculating quotas. Added in MySQL 8.0.2.

* `group_replication_flow_control_min_quota`: Lowest flow control quota which can be assigned per member. Added in MySQL 8.0.2.

* `group_replication_flow_control_min_recovery_quota`: Lowest quota which can be assigned per member because another group member is recovering. Added in MySQL 8.0.2.

* `group_replication_flow_control_period`: Defines how many seconds to wait between flow control iterations. Added in MySQL 8.0.2.

* `group_replication_flow_control_release_percent`: How group quota should be released when flow control no longer needs to throttle writer members. Added in MySQL 8.0.2.

* `group_replication_ip_allowlist`: List of hosts permitted to connect to group (MySQL 8.0.22 and later). Added in MySQL 8.0.22.

* `group_replication_member_expel_timeout`: Time between suspected failure of group member and expelling it from group, causing group membership reconfiguration. Added in MySQL 8.0.13.

* `group_replication_member_weight`: Chance of this member being elected as primary. Added in MySQL 8.0.2.

* `group_replication_message_cache_size`: Maximum memory for group communication engine message cache (XCom). Added in MySQL 8.0.16.

* `group_replication_paxos_single_leader`: Use a single consensus leader in single-primary mode. Added in MySQL 8.0.27.

* `group_replication_recovery_compression_algorithms`: Permitted compression algorithms for outgoing recovery connections. Added in MySQL 8.0.18.

* `group_replication_recovery_get_public_key`: Whether to accept preference about fetching public key from donor. Added in MySQL 8.0.4.

* `group_replication_recovery_public_key_path`: To accept public key information. Added in MySQL 8.0.4.

* `group_replication_recovery_tls_ciphersuites`: Permitted cipher suites when TLSv1.3 is used for connection encryption with this instance as client (joining member). Added in MySQL 8.0.19.

* `group_replication_recovery_tls_version`: Permitted TLS protocols for connection encryption as client (joining member). Added in MySQL 8.0.19.

* `group_replication_recovery_zstd_compression_level`: Compression level for recovery connections that use zstd compression. Added in MySQL 8.0.18.

* `group_replication_tls_source`: Source of TLS material for Group Replication. Added in MySQL 8.0.21.

* `group_replication_unreachable_majority_timeout`: How long to wait for network partitions that result in minority to leave group. Added in MySQL 8.0.2.

* `group_replication_view_change_uuid`: UUID for view change event GTIDs. Added in MySQL 8.0.26.

* `histogram_generation_max_mem_size`: Maximum memory for creating histogram statistics. Added in MySQL 8.0.2.

* `immediate_server_version`: MySQL Server release number of server which is immediate replication source. Added in MySQL 8.0.14.

* `information_schema_stats_expiry`: Expiration setting for cached table statistics. Added in MySQL 8.0.3.

* `init_replica`: Statements that are executed when replica connects to source. Added in MySQL 8.0.26.

* `innodb-dedicated-server`: Enables automatic configuration of buffer pool size, log file size, and flush method. Added in MySQL 8.0.3.

* `innodb_buffer_pool_debug`: Permits multiple buffer pool instances when buffer pool is less than 1GB in size. Added in MySQL 8.0.0.

* `innodb_buffer_pool_in_core_file`: Controls writing of buffer pool pages to core files, defaults to OFF (as of 8.4) on systems that support MADV_DONTDUMP. Added in MySQL 8.0.14.

* `innodb_checkpoint_disabled`: Disables checkpoints so that deliberate server exit always initiates recovery. Added in MySQL 8.0.2.

* `innodb_ddl_buffer_size`: The maximum buffer size for DDL operations. Added in MySQL 8.0.27.

* `innodb_ddl_log_crash_reset_debug`: Debug option that resets DDL log crash injection counters. Added in MySQL 8.0.3.

* `innodb_ddl_threads`: The maximum number of parallel threads for index creation. Added in MySQL 8.0.27.

* `innodb_deadlock_detect`: Enables or disables deadlock detection. Added in MySQL 8.0.0.

* `innodb_directories`: Defines directories to scan at startup for tablespace data files. Added in MySQL 8.0.4.

* `innodb_doublewrite_batch_size`: This functionality was replaced by innodb_doublewrite_pages. Added in MySQL 8.0.20.

* `innodb_doublewrite_dir`: Doublewrite buffer file directory. Added in MySQL 8.0.20.

* `innodb_doublewrite_files`: Number of doublewrite files. Added in MySQL 8.0.20.

* `innodb_doublewrite_pages`: Number of doublewrite pages per thread. Added in MySQL 8.0.20.

* `innodb_extend_and_initialize`: Controls how new tablespace pages are allocated on Linux. Added in MySQL 8.0.22.

* `innodb_fsync_threshold`: Controls how often InnoDB calls fsync when creating new file. Added in MySQL 8.0.13.

* `innodb_idle_flush_pct`: Limits I/0 operations when InnoDB is idle. Added in MySQL 8.0.18.

* `innodb_log_checkpoint_fuzzy_now`: Debug option that forces InnoDB to write fuzzy checkpoint. Added in MySQL 8.0.13.

* `innodb_log_spin_cpu_abs_lwm`: Minimum amount of CPU usage below which user threads no longer spin while waiting for flushed redo. Added in MySQL 8.0.11.

* `innodb_log_spin_cpu_pct_hwm`: Maximum amount of CPU usage above which user threads no longer spin while waiting for flushed redo. Added in MySQL 8.0.11.

* `innodb_log_wait_for_flush_spin_hwm`: Maximum average log flush time beyond which user threads no longer spin while waiting for flushed redo. Added in MySQL 8.0.11.

* `innodb_log_writer_threads`: Enables dedicated log writer threads for writing and flushing redo logs. Added in MySQL 8.0.22.

* `innodb_parallel_read_threads`: Number of threads for parallel index reads. Added in MySQL 8.0.14.

* `innodb_print_ddl_logs`: Whether or not to print DDL logs to error log. Added in MySQL 8.0.3.

* `innodb_redo_log_archive_dirs`: Labeled redo log archive directories. Added in MySQL 8.0.17.

* `innodb_redo_log_capacity`: The size limit for redo log files. Added in MySQL 8.0.30.

* `innodb_redo_log_encrypt`: Controls encryption of redo log data for encrypted tablespaces. Added in MySQL 8.0.1.

* `innodb_scan_directories`: Defines directories to scan for tablespace files during InnoDB recovery. Added in MySQL 8.0.2.

* `innodb_segment_reserve_factor`: The percentage of tablespace file segment pages reserved as empty pages. Added in MySQL 8.0.26.

* `innodb_spin_wait_pause_multiplier`: Multiplier value used to determine number of PAUSE instructions in spin-wait loops. Added in MySQL 8.0.16.

* `innodb_stats_include_delete_marked`: Include delete-marked records when calculating persistent InnoDB statistics. Added in MySQL 8.0.1.

* `innodb_temp_tablespaces_dir`: Session temporary tablespaces path. Added in MySQL 8.0.13.

* `innodb_tmpdir`: Directory location for temporary table files created during online ALTER TABLE operations. Added in MySQL 8.0.0.

* `innodb_undo_log_encrypt`: Controls encryption of undo log data for encrypted tablespaces. Added in MySQL 8.0.1.

* `innodb_use_fdatasync`: Whether InnoDB uses fdatasync() instead of fsync() when flushing data to the operating system. Added in MySQL 8.0.26.

* `innodb_validate_tablespace_paths`: Enables tablespace path validation at startup. Added in MySQL 8.0.21.

* `internal_tmp_mem_storage_engine`: Storage engine to use for internal in-memory temporary tables. Added in MySQL 8.0.2.

* `keyring-migration-destination`: Key migration destination keyring plugin. Added in MySQL 8.0.4.

* `keyring-migration-host`: Host name for connecting to running server for key migration. Added in MySQL 8.0.4.

* `keyring-migration-password`: Password for connecting to running server for key migration. Added in MySQL 8.0.4.

* `keyring-migration-port`: TCP/IP port number for connecting to running server for key migration. Added in MySQL 8.0.4.

* `keyring-migration-socket`: Unix socket file or Windows named pipe for connecting to running server for key migration. Added in MySQL 8.0.4.

* `keyring-migration-source`: Key migration source keyring plugin. Added in MySQL 8.0.4.

* `keyring-migration-to-component`: Keyring migration is from plugin to component. Added in MySQL 8.0.24.

* `keyring-migration-user`: User name for connecting to running server for key migration. Added in MySQL 8.0.4.

* `keyring_aws_cmk_id`: AWS keyring plugin customer master key ID value. Added in MySQL 8.0.11.

* `keyring_aws_conf_file`: AWS keyring plugin configuration file location. Added in MySQL 8.0.11.

* `keyring_aws_data_file`: AWS keyring plugin storage file location. Added in MySQL 8.0.11.

* `keyring_aws_region`: AWS keyring plugin region. Added in MySQL 8.0.11.

* `keyring_encrypted_file_data`: keyring_encrypted_file plugin data file. Added in MySQL 8.0.11.

* `keyring_encrypted_file_password`: keyring_encrypted_file plugin password. Added in MySQL 8.0.11.

* `keyring_hashicorp_auth_path`: HashiCorp Vault AppRole authentication path. Added in MySQL 8.0.18.

* `keyring_hashicorp_ca_path`: Path to keyring_hashicorp CA file. Added in MySQL 8.0.18.

* `keyring_hashicorp_caching`: Whether to enable keyring_hashicorp caching. Added in MySQL 8.0.18.

* `keyring_hashicorp_commit_auth_path`: keyring_hashicorp_auth_path value in use. Added in MySQL 8.0.18.

* `keyring_hashicorp_commit_ca_path`: keyring_hashicorp_ca_path value in use. Added in MySQL 8.0.18.

* `keyring_hashicorp_commit_caching`: keyring_hashicorp_caching value in use. Added in MySQL 8.0.18.

* `keyring_hashicorp_commit_role_id`: keyring_hashicorp_role_id value in use. Added in MySQL 8.0.18.

* `keyring_hashicorp_commit_server_url`: keyring_hashicorp_server_url value in use. Added in MySQL 8.0.18.

* `keyring_hashicorp_commit_store_path`: keyring_hashicorp_store_path value in use. Added in MySQL 8.0.18.

* `keyring_hashicorp_role_id`: HashiCorp Vault AppRole authentication role ID. Added in MySQL 8.0.18.

* `keyring_hashicorp_secret_id`: HashiCorp Vault AppRole authentication secret ID. Added in MySQL 8.0.18.

* `keyring_hashicorp_server_url`: HashiCorp Vault server URL. Added in MySQL 8.0.18.

* `keyring_hashicorp_store_path`: HashiCorp Vault store path. Added in MySQL 8.0.18.

* `keyring_oci_ca_certificate`: CA certificate file for peer authentication. Added in MySQL 8.0.22.

* `keyring_oci_compartment`: OCI compartment OCID. Added in MySQL 8.0.22.

* `keyring_oci_encryption_endpoint`: OCI encryption server endpoint. Added in MySQL 8.0.22.

* `keyring_oci_key_file`: OCI RSA private key file. Added in MySQL 8.0.22.

* `keyring_oci_key_fingerprint`: OCI RSA private key file fingerprint. Added in MySQL 8.0.22.

* `keyring_oci_management_endpoint`: OCI management server endpoint. Added in MySQL 8.0.22.

* `keyring_oci_master_key`: OCI master key OCID. Added in MySQL 8.0.22.

* `keyring_oci_secrets_endpoint`: OCI secrets server endpoint. Added in MySQL 8.0.22.

* `keyring_oci_tenancy`: OCI tenancy OCID. Added in MySQL 8.0.22.

* `keyring_oci_user`: OCI user OCID. Added in MySQL 8.0.22.

* `keyring_oci_vaults_endpoint`: OCI vaults server endpoint. Added in MySQL 8.0.22.

* `keyring_oci_virtual_vault`: OCI vault OCID. Added in MySQL 8.0.22.

* `keyring_okv_conf_dir`: Oracle Key Vault keyring plugin configuration directory. Added in MySQL 8.0.11.

* `keyring_operations`: Whether keyring operations are enabled. Added in MySQL 8.0.4.

* `lock_order`: Whether to enable LOCK_ORDER tool at runtime. Added in MySQL 8.0.17.

* `lock_order_debug_loop`: Whether to cause debug assert when LOCK_ORDER tool encounters dependency flagged as loop. Added in MySQL 8.0.17.

* `lock_order_debug_missing_arc`: Whether to cause debug assert when LOCK_ORDER tool encounters undeclared dependency. Added in MySQL 8.0.17.

* `lock_order_debug_missing_key`: Whether to cause debug assert when LOCK_ORDER tool encounters object not properly instrumented with Performance Schema. Added in MySQL 8.0.17.

* `lock_order_debug_missing_unlock`: Whether to cause debug assert when LOCK_ORDER tool encounters lock that is destroyed while still held. Added in MySQL 8.0.17.

* `lock_order_dependencies`: Path to lock_order_dependencies.txt file. Added in MySQL 8.0.17.

* `lock_order_extra_dependencies`: Path to second dependency file. Added in MySQL 8.0.17.

* `lock_order_output_directory`: Directory where LOCK_ORDER tool writes logs. Added in MySQL 8.0.17.

* `lock_order_print_txt`: Whether to perform lock-order graph analysis and print textual report. Added in MySQL 8.0.17.

* `lock_order_trace_loop`: Whether to print log file trace when LOCK_ORDER tool encounters dependency flagged as loop. Added in MySQL 8.0.17.

* `lock_order_trace_missing_arc`: Whether to print log file trace when LOCK_ORDER tool encounters undeclared dependency. Added in MySQL 8.0.17.

* `lock_order_trace_missing_key`: Whether to print log file trace when LOCK_ORDER tool encounters object not properly instrumented with Performance Schema. Added in MySQL 8.0.17.

* `lock_order_trace_missing_unlock`: Whether to print log file trace when LOCK_ORDER tool encounters lock that is destroyed while still held. Added in MySQL 8.0.17.

* `log_error_filter_rules`: Filter rules for error logging. Added in MySQL 8.0.2.

* `log_error_services`: Components to use for error logging. Added in MySQL 8.0.2.

* `log_error_suppression_list`: Warning/information error log messages to suppress. Added in MySQL 8.0.13.

* `log_replica_updates`: Whether replica should log updates performed by its replication SQL thread to its own binary log. Added in MySQL 8.0.26.

* `log_slow_extra`: Whether to write extra information to slow query log file. Added in MySQL 8.0.14.

* `log_slow_replica_statements`: Cause slow statements as executed by replica to be written to slow query log. Added in MySQL 8.0.26.

* `mandatory_roles`: Automatically granted roles for all users. Added in MySQL 8.0.2.

* `mysql_firewall_mode`: Whether MySQL Enterprise Firewall plugin is operational. Added in MySQL 8.0.11.

* `mysql_firewall_trace`: Whether to enable MySQL Enterprise Firewall plugin trace. Added in MySQL 8.0.11.

* `mysqlx`: Whether X Plugin is initialized. Added in MySQL 8.0.11.

* `mysqlx_compression_algorithms`: Compression algorithms permitted for X Protocol connections. Added in MySQL 8.0.19.

* `mysqlx_deflate_default_compression_level`: Default compression level for Deflate algorithm on X Protocol connections. Added in MySQL 8.0.20.

* `mysqlx_deflate_max_client_compression_level`: Maximum permitted compression level for Deflate algorithm on X Protocol connections. Added in MySQL 8.0.20.

* `mysqlx_interactive_timeout`: Number of seconds to wait for interactive clients to time out. Added in MySQL 8.0.4.

* `mysqlx_lz4_default_compression_level`: Default compression level for LZ4 algorithm on X Protocol connections. Added in MySQL 8.0.20.

* `mysqlx_lz4_max_client_compression_level`: Maximum permitted compression level for LZ4 algorithm on X Protocol connections. Added in MySQL 8.0.20.

* `mysqlx_read_timeout`: Number of seconds to wait for blocking read operations to complete. Added in MySQL 8.0.4.

* `mysqlx_wait_timeout`: Number of seconds to wait for activity from connection. Added in MySQL 8.0.4.

* `mysqlx_write_timeout`: Number of seconds to wait for blocking write operations to complete. Added in MySQL 8.0.4.

* `mysqlx_zstd_default_compression_level`: Default compression level for zstd algorithm on X Protocol connections. Added in MySQL 8.0.20.

* `mysqlx_zstd_max_client_compression_level`: Maximum permitted compression level for zstd algorithm on X Protocol connections. Added in MySQL 8.0.20.

* `named_pipe_full_access_group`: Name of Windows group granted full access to named pipe. Added in MySQL 8.0.14.

* `no-dd-upgrade`: Prevent automatic upgrade of data dictionary tables at startup. Added in MySQL 8.0.4.

* `no-monitor`: Do not fork monitor process required for RESTART. Added in MySQL 8.0.12.

* `original_commit_timestamp`: Time when transaction was committed on original source. Added in MySQL 8.0.1.

* `original_server_version`: MySQL Server release number of server on which transaction was originally committed. Added in MySQL 8.0.14.

* `partial_revokes`: Whether partial revocation is enabled. Added in MySQL 8.0.16.

* `password_history`: Number of password changes required before password reuse. Added in MySQL 8.0.3.

* `password_require_current`: Whether password changes require current password verification. Added in MySQL 8.0.13.

* `password_reuse_interval`: Number of days elapsed required before password reuse. Added in MySQL 8.0.3.

* `performance-schema-consumer-events-statements-cpu`: Configure statement CPU-usage consumer. Added in MySQL 8.0.28.

* `performance_schema_max_digest_sample_age`: Query resample age in seconds. Added in MySQL 8.0.3.

* `performance_schema_show_processlist`: Select SHOW PROCESSLIST implementation. Added in MySQL 8.0.22.

* `persist_only_admin_x509_subject`: SSL certificate X.509 Subject that enables persisting persist-restricted system variables. Added in MySQL 8.0.14.

* `persist_sensitive_variables_in_plaintext`: Whether the server is permitted to store the values of sensitive system variables in an unencrypted format. Added in MySQL 8.0.29.

* `persisted_globals_load`: Whether to load persisted configuration settings. Added in MySQL 8.0.0.

* `print_identified_with_as_hex`: For SHOW CREATE USER, print hash values containing unprintable characters in hex. Added in MySQL 8.0.17.

* `protocol_compression_algorithms`: Permitted compression algorithms for incoming connections. Added in MySQL 8.0.18.

* `pseudo_replica_mode`: For internal server use. Added in MySQL 8.0.26.

* `regexp_stack_limit`: Regular expression match stack size limit. Added in MySQL 8.0.4.

* `regexp_time_limit`: Regular expression match timeout. Added in MySQL 8.0.4.

* `replica_checkpoint_group`: Maximum number of transactions processed by multithreaded replica before checkpoint operation is called to update progress status. Not supported by NDB Cluster. Added in MySQL 8.0.26.

* `replica_checkpoint_period`: Update progress status of multithreaded replica and flush relay log info to disk after this number of milliseconds. Not supported by NDB Cluster. Added in MySQL 8.0.26.

* `replica_compressed_protocol`: Use compression of source/replica protocol. Added in MySQL 8.0.26.

* `replica_exec_mode`: Allows for switching replication thread between IDEMPOTENT mode (key and some other errors suppressed) and STRICT mode; STRICT mode is default, except for NDB Cluster, where IDEMPOTENT is always used. Added in MySQL 8.0.26.

* `replica_load_tmpdir`: Location where replica should put its temporary files when replicating LOAD DATA statements. Added in MySQL 8.0.26.

* `replica_max_allowed_packet`: Maximum size, in bytes, of packet that can be sent from replication source server to replica; overrides max_allowed_packet. Added in MySQL 8.0.26.

* `replica_net_timeout`: Number of seconds to wait for more data from source/replica connection before aborting read. Added in MySQL 8.0.26.

* `replica_parallel_type`: Tells replica to use timestamp information (LOGICAL_CLOCK) or database partitioning (DATABASE) to parallelize transactions. Added in MySQL 8.0.26.

* `replica_parallel_workers`: Number of applier threads for executing replication transactions. NDB Cluster: see documentation. Added in MySQL 8.0.26.

* `replica_pending_jobs_size_max`: Maximum size of replica worker queues holding events not yet applied. Added in MySQL 8.0.26.

* `replica_preserve_commit_order`: Ensures that all commits by replica workers happen in same order as on source to maintain consistency when using parallel applier threads. Added in MySQL 8.0.26.

* `replica_skip_errors`: Tells replication thread to continue replication when query returns error from provided list. Added in MySQL 8.0.26.

* `replica_sql_verify_checksum`: Cause replica to examine checksums when reading from relay log. Added in MySQL 8.0.26.

* `replica_transaction_retries`: Number of times replication SQL thread retries transaction in case it failed with deadlock or elapsed lock wait timeout, before giving up and stopping. Added in MySQL 8.0.26.

* `replica_type_conversions`: Controls type conversion mode on replica. Value is list of zero or more elements from this list: ALL_LOSSY, ALL_NON_LOSSY. Set to empty string to disallow type conversions between source and replica. Added in MySQL 8.0.26.

* `replication_optimize_for_static_plugin_config`: Shared locks for semisynchronous replication. Added in MySQL 8.0.23.

* `replication_sender_observe_commit_only`: Limited callbacks for semisynchronous replication. Added in MySQL 8.0.23.

* `require_row_format`: For internal server use. Added in MySQL 8.0.19.

* `resultset_metadata`: Whether server returns result set metadata. Added in MySQL 8.0.3.

* `rewriter_enabled_for_threads_without_privilege_checks`: If this is set to OFF, rewrites are skipped for replication threads which execute with privilege checks disabled (PRIVILEGE_CHECKS_USER is NULL). Added in MySQL 8.0.31.

* `rpl_read_size`: Set minimum amount of data in bytes which is read from binary log files and relay log files. Added in MySQL 8.0.11.

* `rpl_semi_sync_replica_enabled`: Whether semisynchronous replication is enabled on replica. Added in MySQL 8.0.26.

* `rpl_semi_sync_replica_trace_level`: Semisynchronous replication debug trace level on replica. Added in MySQL 8.0.26.

* `rpl_semi_sync_source_enabled`: Whether semisynchronous replication is enabled on source. Added in MySQL 8.0.26.

* `rpl_semi_sync_source_timeout`: Number of milliseconds to wait for replica acknowledgment. Added in MySQL 8.0.26.

* `rpl_semi_sync_source_trace_level`: Semisynchronous replication debug trace level on source. Added in MySQL 8.0.26.

* `rpl_semi_sync_source_wait_for_replica_count`: Number of replica acknowledgments source must receive per transaction before proceeding. Added in MySQL 8.0.26.

* `rpl_semi_sync_source_wait_no_replica`: Whether source waits for timeout even with no replicas. Added in MySQL 8.0.26.

* `rpl_semi_sync_source_wait_point`: Wait point for replica transaction receipt acknowledgment. Added in MySQL 8.0.26.

* `rpl_stop_replica_timeout`: Number of seconds that STOP REPLICA waits before timing out. Added in MySQL 8.0.26.

* `schema_definition_cache`: Number of schema definition objects that can be kept in dictionary object cache. Added in MySQL 8.0.0.

* `secondary_engine_cost_threshold`: Optimizer cost threshold for query offload to a secondary engine. Added in MySQL 8.0.16.

* `select_into_buffer_size`: Size of buffer used for OUTFILE or DUMPFILE export file; overrides read_buffer_size. Added in MySQL 8.0.22.

* `select_into_disk_sync`: Synchronize data with storage device after flushing buffer for OUTFILE or DUMPFILE export file; OFF disables synchronization and is default value. Added in MySQL 8.0.22.

* `select_into_disk_sync_delay`: When select_into_sync_disk = ON, sets delay in milliseconds after each synchronization of OUTFILE or DUMPFILE export file buffer, no effect otherwise. Added in MySQL 8.0.22.

* `show-replica-auth-info`: Show user name and password in SHOW REPLICAS on this source. Added in MySQL 8.0.26.

* `show_create_table_skip_secondary_engine`: Whether to exclude the SECONDARY ENGINE clause from SHOW CREATE TABLE output. Added in MySQL 8.0.18.

* `show_create_table_verbosity`: Whether to display ROW_FORMAT in SHOW CREATE TABLE even if it has default value. Added in MySQL 8.0.11.

* `show_gipk_in_create_table_and_information_schema`: Whether generated invisible primary keys are displayed in SHOW statements and INFORMATION_SCHEMA tables. Added in MySQL 8.0.30.

* `skip-replica-start`: If set, replication is not autostarted when replica server starts. Added in MySQL 8.0.26.

* `source_verify_checksum`: Cause source to examine checksums when reading from binary log. Added in MySQL 8.0.26.

* `sql_generate_invisible_primary_key`: Whether to generate invisible primary keys for any InnoDB tables which were created on this server and which have no explicit PKs. Added in MySQL 8.0.30.

* `sql_replica_skip_counter`: Number of events from source that replica should skip. Not compatible with GTID replication. Added in MySQL 8.0.26.

* `sql_require_primary_key`: Whether tables must have primary key. Added in MySQL 8.0.13.

* `ssl_fips_mode`: Whether to enable FIPS mode on server side. Added in MySQL 8.0.11.

* `ssl_session_cache_mode`: Whether to enable session ticket generation by server. Added in MySQL 8.0.29.

* `ssl_session_cache_timeout`: SSL Session timeout value in seconds. Added in MySQL 8.0.29.

* `sync_source_info`: Synchronize source information after every #th event. Added in MySQL 8.0.26.

* `syseventlog.facility`: Facility for syslog messages. Added in MySQL 8.0.13.

* `syseventlog.include_pid`: Whether to include server PID in syslog messages. Added in MySQL 8.0.13.

* `syseventlog.tag`: Tag for server identifier in syslog messages. Added in MySQL 8.0.13.

* `table_encryption_privilege_check`: Enables TABLE_ENCRYPTION_ADMIN privilege check. Added in MySQL 8.0.16.

* `tablespace_definition_cache`: Number of tablespace definition objects that can be kept in dictionary object cache. Added in MySQL 8.0.0.

* `temptable_max_mmap`: The maximum amount of memory the TempTable storage engine can allocate from memory-mapped temporary files. Added in MySQL 8.0.23.

* `temptable_max_ram`: Defines maximum amount of memory that can occupied by TempTable storage engine before data is stored on disk. Added in MySQL 8.0.2.

* `temptable_use_mmap`: Defines whether TempTable storage engine allocates memory-mapped files when the temptable_max_ram threshold is reached. Added in MySQL 8.0.16.

* `terminology_use_previous`: Use terminology from before specified version where changes are incompatible. Added in MySQL 8.0.26.

* `thread_pool_algorithm`: Thread pool algorithm. Added in MySQL 8.0.11.

* `thread_pool_dedicated_listeners`: Dedicates a listener thread in each thread group to listen for network events. Added in MySQL 8.0.23.

* `thread_pool_high_priority_connection`: Whether current session is high priority. Added in MySQL 8.0.11.

* `thread_pool_max_active_query_threads`: Maximum permissible number of active query threads per group. Added in MySQL 8.0.19.

* `thread_pool_max_transactions_limit`: Maximum number of transactions permitted during thread pool operation. Added in MySQL 8.0.23.

* `thread_pool_max_unused_threads`: Maximum permissible number of unused threads. Added in MySQL 8.0.11.

* `thread_pool_prio_kickup_timer`: How long before statement is moved to high-priority execution. Added in MySQL 8.0.11.

* `thread_pool_query_threads_per_group`: Maximum number of query threads for a thread group. Added in MySQL 8.0.31.

* `thread_pool_size`: Number of thread groups in thread pool. Added in MySQL 8.0.11.

* `thread_pool_stall_limit`: How long before statement is defined as stalled. Added in MySQL 8.0.11.

* `thread_pool_transaction_delay`: Delay period before thread pool executes a new transaction. Added in MySQL 8.0.31.

* `tls_ciphersuites`: Permissible TLSv1.3 ciphersuites for encrypted connections. Added in MySQL 8.0.16.

* `upgrade`: Control automatic upgrade at startup. Added in MySQL 8.0.16.

* `use_secondary_engine`: Whether to execute queries using a secondary engine. Added in MySQL 8.0.13.

* `validate-config`: Validate server configuration. Added in MySQL 8.0.16.

* `validate_password.changed_characters_percentage`: Minimum percentage of changed characters required for new passwords. Added in MySQL 8.0.34.

* `validate_password.check_user_name`: Whether to check passwords against user name. Added in MySQL 8.0.4.

* `validate_password.dictionary_file`: validate_password dictionary file. Added in MySQL 8.0.4.

* `validate_password.dictionary_file_last_parsed`: When dictionary file was last parsed. Added in MySQL 8.0.4.

* `validate_password.dictionary_file_words_count`: Number of words in dictionary file. Added in MySQL 8.0.4.

* `validate_password.length`: validate_password required password length. Added in MySQL 8.0.4.

* `validate_password.mixed_case_count`: validate_password required number of uppercase/lowercase characters. Added in MySQL 8.0.4.

* `validate_password.number_count`: validate_password required number of digit characters. Added in MySQL 8.0.4.

* `validate_password.policy`: validate_password password policy. Added in MySQL 8.0.4.

* `validate_password.special_char_count`: validate_password required number of special characters. Added in MySQL 8.0.4.

* `version_compile_zlib`: Version of compiled-in zlib library. Added in MySQL 8.0.11.

* `windowing_use_high_precision`: Whether to compute window functions to high precision. Added in MySQL 8.0.2.

### Options and Variables Deprecated in MySQL 8.0

The following system variables, status variables, and options have been deprecated in MySQL 8.0.

* `Compression`: Whether client connection uses compression in client/server protocol. Deprecated in MySQL 8.0.18.

* `Rpl_semi_sync_master_clients`: Number of semisynchronous replicas. Deprecated in MySQL 8.0.26.

* `Rpl_semi_sync_master_net_avg_wait_time`: Average time source has waited for replies from replica. Deprecated in MySQL 8.0.26.

* `Rpl_semi_sync_master_net_wait_time`: Total time source has waited for replies from replica. Deprecated in MySQL 8.0.26.

* `Rpl_semi_sync_master_net_waits`: Total number of times source waited for replies from replica. Deprecated in MySQL 8.0.26.

* `Rpl_semi_sync_master_no_times`: Number of times source turned off semisynchronous replication. Deprecated in MySQL 8.0.26.

* `Rpl_semi_sync_master_no_tx`: Number of commits not acknowledged successfully. Deprecated in MySQL 8.0.26.

* `Rpl_semi_sync_master_status`: Whether semisynchronous replication is operational on source. Deprecated in MySQL 8.0.26.

* `Rpl_semi_sync_master_timefunc_failures`: Number of times source failed when calling time functions. Deprecated in MySQL 8.0.26.

* `Rpl_semi_sync_master_tx_avg_wait_time`: Average time source waited for each transaction. Deprecated in MySQL 8.0.26.

* `Rpl_semi_sync_master_tx_wait_time`: Total time source waited for transactions. Deprecated in MySQL 8.0.26.

* `Rpl_semi_sync_master_tx_waits`: Total number of times source waited for transactions. Deprecated in MySQL 8.0.26.

* `Rpl_semi_sync_master_wait_pos_backtraverse`: Total number of times source has waited for event with binary coordinates lower than events waited for previously. Deprecated in MySQL 8.0.26.

* `Rpl_semi_sync_master_wait_sessions`: Number of sessions currently waiting for replica replies. Deprecated in MySQL 8.0.26.

* `Rpl_semi_sync_master_yes_tx`: Number of commits acknowledged successfully. Deprecated in MySQL 8.0.26.

* `Rpl_semi_sync_slave_status`: Whether semisynchronous replication is operational on replica. Deprecated in MySQL 8.0.26.

* `Rsa_public_key`: sha256_password authentication plugin RSA public key value. Deprecated in MySQL 8.0.16.

* `Slave_open_temp_tables`: Number of temporary tables that replication SQL thread currently has open. Deprecated in MySQL 8.0.26.

* `Slave_rows_last_search_algorithm_used`: Search algorithm most recently used by this replica to locate rows for row-based replication (index, table, or hash scan). Deprecated in MySQL 8.0.26.

* `abort-slave-event-count`: Option used by mysql-test for debugging and testing of replication. Deprecated in MySQL 8.0.29.

* `admin-ssl`: Enable connection encryption. Deprecated in MySQL 8.0.26.

* `audit_log_connection_policy`: Audit logging policy for connection-related events. Deprecated in MySQL 8.0.34.

* `audit_log_exclude_accounts`: Accounts not to audit. Deprecated in MySQL 8.0.34.

* `audit_log_include_accounts`: Accounts to audit. Deprecated in MySQL 8.0.34.

* `audit_log_policy`: Audit logging policy. Deprecated in MySQL 8.0.34.

* `audit_log_statement_policy`: Audit logging policy for statement-related events. Deprecated in MySQL 8.0.34.

* `authentication_fido_rp_id`: Relying party ID for FIDO multifactor authentication. Deprecated in MySQL 8.0.35.

* `binlog_format`: Specifies format of binary log. Deprecated in MySQL 8.0.34.

* `binlog_transaction_dependency_tracking`: Source of dependency information (commit timestamps or transaction write sets) from which to assess which transactions can be executed in parallel by replica's multithreaded applier. Deprecated in MySQL 8.0.35.

* `character-set-client-handshake`: Do not ignore client side character set value sent during handshake. Deprecated in MySQL 8.0.35.

* `daemon_memcached_enable_binlog`: . Deprecated in MySQL 8.0.22.

* `daemon_memcached_engine_lib_name`: Shared library implementing InnoDB memcached plugin. Deprecated in MySQL 8.0.22.

* `daemon_memcached_engine_lib_path`: Directory which contains shared library implementing InnoDB memcached plugin. Deprecated in MySQL 8.0.22.

* `daemon_memcached_option`: Space-separated options which are passed to underlying memcached daemon on startup. Deprecated in MySQL 8.0.22.

* `daemon_memcached_r_batch_size`: Specifies how many memcached read operations to perform before doing COMMIT to start new transaction. Deprecated in MySQL 8.0.22.

* `daemon_memcached_w_batch_size`: Specifies how many memcached write operations to perform before doing COMMIT to start new transaction. Deprecated in MySQL 8.0.22.

* `default_authentication_plugin`: Default authentication plugin. Deprecated in MySQL 8.0.27.

* `disconnect-slave-event-count`: Option used by mysql-test for debugging and testing of replication. Deprecated in MySQL 8.0.29.

* `expire_logs_days`: Purge binary logs after this many days. Deprecated in MySQL 8.0.3.

* `group_replication_ip_whitelist`: List of hosts permitted to connect to group. Deprecated in MySQL 8.0.22.

* `group_replication_primary_member`: Primary member UUID when group operates in single-primary mode. Empty string if group is operating in multi-primary mode. Deprecated in MySQL 8.0.4.

* `group_replication_recovery_complete_at`: Recovery policies when handling cached transactions after state transfer. Deprecated in MySQL 8.0.34.

* `have_openssl`: Whether mysqld supports SSL connections. Deprecated in MySQL 8.0.26.

* `have_ssl`: Whether mysqld supports SSL connections. Deprecated in MySQL 8.0.26.

* `init_slave`: Statements that are executed when replica connects to source. Deprecated in MySQL 8.0.26.

* `innodb_api_bk_commit_interval`: How often to auto-commit idle connections which use InnoDB memcached interface, in seconds. Deprecated in MySQL 8.0.22.

* `innodb_api_disable_rowlock`: . Deprecated in MySQL 8.0.22.

* `innodb_api_enable_binlog`: Allows use of InnoDB memcached plugin with MySQL binary log. Deprecated in MySQL 8.0.22.

* `innodb_api_enable_mdl`: Locks table used by InnoDB memcached plugin, so that it cannot be dropped or altered by DDL through SQL interface. Deprecated in MySQL 8.0.22.

* `innodb_api_trx_level`: Allows control of transaction isolation level on queries processed by memcached interface. Deprecated in MySQL 8.0.22.

* `innodb_log_file_size`: Size of each log file in log group. Deprecated in MySQL 8.0.30.

* `innodb_log_files_in_group`: Number of InnoDB log files in log group. Deprecated in MySQL 8.0.30.

* `innodb_undo_tablespaces`: Number of tablespace files that rollback segments are divided between. Deprecated in MySQL 8.0.4.

* `keyring_encrypted_file_data`: keyring_encrypted_file plugin data file. Deprecated in MySQL 8.0.34.

* `keyring_encrypted_file_password`: keyring_encrypted_file plugin password. Deprecated in MySQL 8.0.34.

* `keyring_file_data`: keyring_file plugin data file. Deprecated in MySQL 8.0.34.

* `keyring_oci_ca_certificate`: CA certificate file for peer authentication. Deprecated in MySQL 8.0.31.

* `keyring_oci_compartment`: OCI compartment OCID. Deprecated in MySQL 8.0.31.

* `keyring_oci_encryption_endpoint`: OCI encryption server endpoint. Deprecated in MySQL 8.0.31.

* `keyring_oci_key_file`: OCI RSA private key file. Deprecated in MySQL 8.0.31.

* `keyring_oci_key_fingerprint`: OCI RSA private key file fingerprint. Deprecated in MySQL 8.0.31.

* `keyring_oci_management_endpoint`: OCI management server endpoint. Deprecated in MySQL 8.0.31.

* `keyring_oci_master_key`: OCI master key OCID. Deprecated in MySQL 8.0.31.

* `keyring_oci_secrets_endpoint`: OCI secrets server endpoint. Deprecated in MySQL 8.0.31.

* `keyring_oci_tenancy`: OCI tenancy OCID. Deprecated in MySQL 8.0.31.

* `keyring_oci_user`: OCI user OCID. Deprecated in MySQL 8.0.31.

* `keyring_oci_vaults_endpoint`: OCI vaults server endpoint. Deprecated in MySQL 8.0.31.

* `keyring_oci_virtual_vault`: OCI vault OCID. Deprecated in MySQL 8.0.31.

* `log_bin_trust_function_creators`: If equal to 0 (default), then when --log-bin is used, stored function creation is allowed only to users having SUPER privilege and only if function created does not break binary logging. Deprecated in MySQL 8.0.34.

* `log_bin_use_v1_row_events`: Whether server is using version 1 binary log row events. Deprecated in MySQL 8.0.18.

* `log_slave_updates`: Whether replica should log updates performed by its replication SQL thread to its own binary log. Deprecated in MySQL 8.0.26.

* `log_slow_slave_statements`: Cause slow statements as executed by replica to be written to slow query log. Deprecated in MySQL 8.0.26.

* `log_statements_unsafe_for_binlog`: Disables error 1592 warnings being written to error log. Deprecated in MySQL 8.0.34.

* `log_syslog`: Whether to write error log to syslog. Deprecated in MySQL 8.0.2.

* `master-info-file`: Location and name of file that remembers source and where I/O replication thread is in source's binary log. Deprecated in MySQL 8.0.18.

* `master_info_repository`: Whether to write connection metadata repository, containing source information and replication I/O thread location in source's binary log, to file or table. Deprecated in MySQL 8.0.23.

* `master_verify_checksum`: Cause source to examine checksums when reading from binary log. Deprecated in MySQL 8.0.26.

* `max_length_for_sort_data`: Max number of bytes in sorted records. Deprecated in MySQL 8.0.20.

* `myisam_repair_threads`: Number of threads to use when repairing MyISAM tables. 1 disables parallel repair. Deprecated in MySQL 8.0.29.

* `mysql_native_password_proxy_users`: Whether mysql_native_password authentication plugin does proxying. Deprecated in MySQL 8.0.16.

* `new`: Use very new, possibly 'unsafe' functions. Deprecated in MySQL 8.0.35.

* `no-dd-upgrade`: Prevent automatic upgrade of data dictionary tables at startup. Deprecated in MySQL 8.0.16.

* `old`: Cause server to revert to certain behaviors present in older versions. Deprecated in MySQL 8.0.35.

* `old-style-user-limits`: Enable old-style user limits (before 5.0.3, user resources were counted per each user+host vs. per account). Deprecated in MySQL 8.0.30.

* `performance_schema_show_processlist`: Select SHOW PROCESSLIST implementation. Deprecated in MySQL 8.0.35.

* `pseudo_slave_mode`: For internal server use. Deprecated in MySQL 8.0.26.

* `query_prealloc_size`: Persistent buffer for query parsing and execution. Deprecated in MySQL 8.0.29.

* `relay_log_info_file`: File name for applier metadata repository in which replica records information about relay logs. Deprecated in MySQL 8.0.18.

* `relay_log_info_repository`: Whether to write location of replication SQL thread in relay logs to file or table. Deprecated in MySQL 8.0.23.

* `replica_parallel_type`: Tells replica to use timestamp information (LOGICAL_CLOCK) or database partitioning (DATABASE) to parallelize transactions. Deprecated in MySQL 8.0.29.

* `rpl_semi_sync_master_enabled`: Whether semisynchronous replication is enabled on source. Deprecated in MySQL 8.0.26.

* `rpl_semi_sync_master_timeout`: Number of milliseconds to wait for replica acknowledgment. Deprecated in MySQL 8.0.26.

* `rpl_semi_sync_master_trace_level`: Semisynchronous replication debug trace level on source. Deprecated in MySQL 8.0.26.

* `rpl_semi_sync_master_wait_for_slave_count`: Number of replica acknowledgments source must receive per transaction before proceeding. Deprecated in MySQL 8.0.26.

* `rpl_semi_sync_master_wait_point`: Wait point for replica transaction receipt acknowledgment. Deprecated in MySQL 8.0.26.

* `rpl_semi_sync_slave_enabled`: Whether semisynchronous replication is enabled on replica. Deprecated in MySQL 8.0.26.

* `rpl_semi_sync_slave_trace_level`: Semisynchronous replication debug trace level on replica. Deprecated in MySQL 8.0.26.

* `rpl_stop_slave_timeout`: Number of seconds that STOP REPLICA or STOP SLAVE waits before timing out. Deprecated in MySQL 8.0.26.

* `safe-user-create`: Do not allow new user creation by user who has no write privileges to mysql.user table; this option is deprecated and ignored. Deprecated in MySQL 8.0.11.

* `sha256_password_auto_generate_rsa_keys`: Whether to generate RSA key-pair files automatically. Deprecated in MySQL 8.0.16.

* `sha256_password_private_key_path`: SHA256 authentication plugin private key path name. Deprecated in MySQL 8.0.16.

* `sha256_password_proxy_users`: Whether sha256_password authentication plugin does proxying. Deprecated in MySQL 8.0.16.

* `sha256_password_public_key_path`: SHA256 authentication plugin public key path name. Deprecated in MySQL 8.0.16.

* `show-slave-auth-info`: Show user name and password in SHOW REPLICAS and SHOW SLAVE HOSTS on this source. Deprecated in MySQL 8.0.26.

* `skip-character-set-client-handshake`: Ignore client side character set value sent during handshake. Deprecated in MySQL 8.0.35.

* `skip-host-cache`: Do not cache host names. Deprecated in MySQL 8.0.30.

* `skip-new`: Do not use new, possibly wrong routines. Deprecated in MySQL 8.0.35.

* `skip-slave-start`: If set, replication is not autostarted when replica server starts. Deprecated in MySQL 8.0.26.

* `skip-ssl`: Disable connection encryption. Deprecated in MySQL 8.0.26.

* `slave-skip-errors`: Tells replication thread to continue replication when query returns error from provided list. Deprecated in MySQL 8.0.26.

* `slave_checkpoint_group`: Maximum number of transactions processed by multithreaded replica before checkpoint operation is called to update progress status. Not supported by NDB Cluster. Deprecated in MySQL 8.0.26.

* `slave_checkpoint_period`: Update progress status of multithreaded replica and flush relay log info to disk after this number of milliseconds. Not supported by NDB Cluster. Deprecated in MySQL 8.0.26.

* `slave_compressed_protocol`: Use compression of source/replica protocol. Deprecated in MySQL 8.0.18.

* `slave_exec_mode`: Allows for switching replication thread between IDEMPOTENT mode (key and some other errors suppressed) and STRICT mode; STRICT mode is default, except for NDB Cluster, where IDEMPOTENT is always used. Deprecated in MySQL 8.0.26.

* `slave_load_tmpdir`: Location where replica should put its temporary files when replicating LOAD DATA statements. Deprecated in MySQL 8.0.26.

* `slave_max_allowed_packet`: Maximum size, in bytes, of packet that can be sent from replication source server to replica; overrides max_allowed_packet. Deprecated in MySQL 8.0.26.

* `slave_net_timeout`: Number of seconds to wait for more data from source/replica connection before aborting read. Deprecated in MySQL 8.0.26.

* `slave_parallel_type`: Tells replica to use timestamp information (LOGICAL_CLOCK) or database partioning (DATABASE) to parallelize transactions. Deprecated in MySQL 8.0.26.

* `slave_parallel_workers`: Number of applier threads for executing replication transactions in parallel; 0 or 1 disables replica multithreading. NDB Cluster: see documentation. Deprecated in MySQL 8.0.26.

* `slave_pending_jobs_size_max`: Maximum size of replica worker queues holding events not yet applied. Deprecated in MySQL 8.0.26.

* `slave_preserve_commit_order`: Ensures that all commits by replica workers happen in same order as on source to maintain consistency when using parallel applier threads. Deprecated in MySQL 8.0.26.

* `slave_rows_search_algorithms`: Determines search algorithms used for replica update batching. Any 2 or 3 from this list: INDEX_SEARCH, TABLE_SCAN, HASH_SCAN. Deprecated in MySQL 8.0.18.

* `slave_sql_verify_checksum`: Cause replica to examine checksums when reading from relay log. Deprecated in MySQL 8.0.26.

* `slave_transaction_retries`: Number of times replication SQL thread retries transaction in case it failed with deadlock or elapsed lock wait timeout, before giving up and stopping. Deprecated in MySQL 8.0.26.

* `slave_type_conversions`: Controls type conversion mode on replica. Value is list of zero or more elements from this list: ALL_LOSSY, ALL_NON_LOSSY. Set to empty string to disallow type conversions between source and replica. Deprecated in MySQL 8.0.26.

* `sql_slave_skip_counter`: Number of events from source that replica should skip. Not compatible with GTID replication. Deprecated in MySQL 8.0.26.

* `ssl`: Enable connection encryption. Deprecated in MySQL 8.0.26.

* `ssl_fips_mode`: Whether to enable FIPS mode on server side. Deprecated in MySQL 8.0.34.

* `symbolic-links`: Permit symbolic links for MyISAM tables. Deprecated in MySQL 8.0.2.

* `sync_master_info`: Synchronize source information after every #th event. Deprecated in MySQL 8.0.26.

* `sync_relay_log_info`: Synchronize relay.info file to disk after every #th event. Deprecated in MySQL 8.0.34.

* `temptable_use_mmap`: Defines whether TempTable storage engine allocates memory-mapped files when the temptable_max_ram threshold is reached. Deprecated in MySQL 8.0.26.

* `transaction_prealloc_size`: Persistent buffer for transactions to be stored in binary log. Deprecated in MySQL 8.0.29.

* `transaction_write_set_extraction`: Defines algorithm used to hash writes extracted during transaction. Deprecated in MySQL 8.0.26.

### Options and Variables Removed in MySQL 8.0

The following system variables, status variables, and options have been removed in MySQL 8.0.

* `Com_alter_db_upgrade`: Count of ALTER DATABASE ... UPGRADE DATA DIRECTORY NAME statements. Removed in MySQL 8.0.0.

* `Innodb_available_undo_logs`: Total number of InnoDB rollback segments; different from innodb_rollback_segments, which displays number of active rollback segments. Removed in MySQL 8.0.2.

* `Qcache_free_blocks`: Number of free memory blocks in query cache. Removed in MySQL 8.0.3.

* `Qcache_free_memory`: Amount of free memory for query cache. Removed in MySQL 8.0.3.

* `Qcache_hits`: Number of query cache hits. Removed in MySQL 8.0.3.

* `Qcache_inserts`: Number of query cache inserts. Removed in MySQL 8.0.3.

* `Qcache_lowmem_prunes`: Number of queries which were deleted from query cache due to lack of free memory in cache. Removed in MySQL 8.0.3.

* `Qcache_not_cached`: Number of noncached queries (not cacheable, or not cached due to query_cache_type setting). Removed in MySQL 8.0.3.

* `Qcache_queries_in_cache`: Number of queries registered in query cache. Removed in MySQL 8.0.3.

* `Qcache_total_blocks`: Total number of blocks in query cache. Removed in MySQL 8.0.3.

* `Slave_heartbeat_period`: Replica's replication heartbeat interval, in seconds. Removed in MySQL 8.0.1.

* `Slave_last_heartbeat`: Shows when latest heartbeat signal was received, in TIMESTAMP format. Removed in MySQL 8.0.1.

* `Slave_received_heartbeats`: Number of heartbeats received by replica since previous reset. Removed in MySQL 8.0.1.

* `Slave_retried_transactions`: Total number of times since startup that replication SQL thread has retried transactions. Removed in MySQL 8.0.1.

* `Slave_running`: State of this server as replica (replication I/O thread status). Removed in MySQL 8.0.1.

* `bootstrap`: Used by mysql installation scripts. Removed in MySQL 8.0.0.

* `date_format`: DATE format (unused). Removed in MySQL 8.0.3.

* `datetime_format`: DATETIME/TIMESTAMP format (unused). Removed in MySQL 8.0.3.

* `des-key-file`: Load keys for des_encrypt() and des_encrypt from given file. Removed in MySQL 8.0.3.

* `group_replication_allow_local_disjoint_gtids_join`: Allow current server to join group even if it has transactions not present in group. Removed in MySQL 8.0.4.

* `have_crypt`: Availability of crypt() system call. Removed in MySQL 8.0.3.

* `ignore-db-dir`: Treat directory as nondatabase directory. Removed in MySQL 8.0.0.

* `ignore_builtin_innodb`: Ignore built-in InnoDB. Removed in MySQL 8.0.3.

* `ignore_db_dirs`: Directories treated as nondatabase directories. Removed in MySQL 8.0.0.

* `innodb_checksums`: Enable InnoDB checksums validation. Removed in MySQL 8.0.0.

* `innodb_disable_resize_buffer_pool_debug`: Disables resizing of InnoDB buffer pool. Removed in MySQL 8.0.0.

* `innodb_file_format`: Format for new InnoDB tables. Removed in MySQL 8.0.0.

* `innodb_file_format_check`: Whether InnoDB performs file format compatibility checking. Removed in MySQL 8.0.0.

* `innodb_file_format_max`: File format tag in shared tablespace. Removed in MySQL 8.0.0.

* `innodb_large_prefix`: Enables longer keys for column prefix indexes. Removed in MySQL 8.0.0.

* `innodb_locks_unsafe_for_binlog`: Force InnoDB not to use next-key locking. Instead use only row-level locking. Removed in MySQL 8.0.0.

* `innodb_scan_directories`: Defines directories to scan for tablespace files during InnoDB recovery. Removed in MySQL 8.0.4.

* `innodb_stats_sample_pages`: Number of index pages to sample for index distribution statistics. Removed in MySQL 8.0.0.

* `innodb_support_xa`: Enable InnoDB support for XA two-phase commit. Removed in MySQL 8.0.0.

* `innodb_undo_logs`: Number of undo logs (rollback segments) used by InnoDB; alias for innodb_rollback_segments. Removed in MySQL 8.0.2.

* `internal_tmp_disk_storage_engine`: Storage engine for internal temporary tables. Removed in MySQL 8.0.16.

* `log-warnings`: Write some noncritical warnings to log file. Removed in MySQL 8.0.3.

* `log_builtin_as_identified_by_password`: Whether to log CREATE/ALTER USER, GRANT in backward-compatible fashion. Removed in MySQL 8.0.11.

* `log_error_filter_rules`: Filter rules for error logging. Removed in MySQL 8.0.4.

* `log_syslog`: Whether to write error log to syslog. Removed in MySQL 8.0.13.

* `log_syslog_facility`: Facility for syslog messages. Removed in MySQL 8.0.13.

* `log_syslog_include_pid`: Whether to include server PID in syslog messages. Removed in MySQL 8.0.13.

* `log_syslog_tag`: Tag for server identifier in syslog messages. Removed in MySQL 8.0.13.

* `max_tmp_tables`: Unused. Removed in MySQL 8.0.3.

* `metadata_locks_cache_size`: Size of metadata locks cache. Removed in MySQL 8.0.13.

* `metadata_locks_hash_instances`: Number of metadata lock hashes. Removed in MySQL 8.0.13.

* `multi_range_count`: Maximum number of ranges to send to table handler at once during range selects. Removed in MySQL 8.0.3.

* `myisam_repair_threads`: Number of threads to use when repairing MyISAM tables. 1 disables parallel repair. Removed in MySQL 8.0.30.

* `old_passwords`: Selects password hashing method for PASSWORD(). Removed in MySQL 8.0.11.

* `partition`: Enable (or disable) partitioning support. Removed in MySQL 8.0.0.

* `query_cache_limit`: Do not cache results that are bigger than this. Removed in MySQL 8.0.3.

* `query_cache_min_res_unit`: Minimal size of unit in which space for results is allocated (last unit is trimmed after writing all result data). Removed in MySQL 8.0.3.

* `query_cache_size`: Memory allocated to store results from old queries. Removed in MySQL 8.0.3.

* `query_cache_type`: Query cache type. Removed in MySQL 8.0.3.

* `query_cache_wlock_invalidate`: Invalidate queries in query cache on LOCK for write. Removed in MySQL 8.0.3.

* `secure_auth`: Disallow authentication for accounts that have old (pre-4.1) passwords. Removed in MySQL 8.0.3.

* `show_compatibility_56`: Compatibility for SHOW STATUS/VARIABLES. Removed in MySQL 8.0.1.

* `skip-partition`: Do not enable user-defined partitioning. Removed in MySQL 8.0.0.

* `sync_frm`: Sync .frm to disk on create. Enabled by default. Removed in MySQL 8.0.0.

* `temp-pool`: Using this option causes most temporary files created to use small set of names, rather than unique name for each new file. Removed in MySQL 8.0.1.

* `time_format`: TIME format (unused). Removed in MySQL 8.0.3.

* `tx_isolation`: Default transaction isolation level. Removed in MySQL 8.0.3.

* `tx_read_only`: Default transaction access mode. Removed in MySQL 8.0.3.
