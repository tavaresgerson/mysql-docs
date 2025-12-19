## 1.5 Server and Status Variables and Options Added, Deprecated, or Removed in MySQL 8.4 since 8.0

*  Options and Variables Introduced in MySQL 8.4
*  Options and Variables Deprecated in MySQL 8.4
*  Options and Variables Removed in MySQL 8.4

This section lists server variables, status variables, and options that were added for the first time, have been deprecated, or have been removed in MySQL 8.4 since 8.0.

### Options and Variables Introduced in MySQL 8.4

The following system variables, status variables, and server options have been added in MySQL 8.4.

* `Audit_log_direct_writes`: Number of direct writes to the audit log file. Added in MySQL 8.1.0.
* `Com_show_binary_log_status`: Count of SHOW BINARY LOG STATUS statements; use instead of Com_show_master_status. Added in MySQL 8.2.0.
* `Deprecated_use_i_s_processlist_count`: Number of times Information Schema processlist table has been accessed. Added in MySQL 8.3.0.
* `Deprecated_use_i_s_processlist_last_timestamp`: Time of most recent access to Information Schema processlist table (timestamp). Added in MySQL 8.3.0.
* `Gr_all_consensus_proposals_count`: Sum of all proposals that were initiated and terminated in this node. Added in MySQL 8.1.0.
* `Gr_all_consensus_time_sum`: The sum of elapsed time of all consensus rounds started and finished in this node. Togheter with count_all_consensus_proposals, we can identify if the individual consensus time has a trend of going up, thus signaling a possible problem. Added in MySQL 8.1.0.
* `Gr_certification_garbage_collector_count`: Number of times certification garbage collection did run. Added in MySQL 8.1.0.
* `Gr_certification_garbage_collector_time_sum`: Sum of the time in micro-seconds that certification garbage collection runs took. Added in MySQL 8.1.0.
* `Gr_consensus_bytes_received_sum`: The sum of all socket-level bytes that were received to from group nodes having as a destination this node. Added in MySQL 8.1.0.
* `Gr_consensus_bytes_sent_sum`: Sum of all socket-level bytes that were sent to all group nodes originating on this node. Socket-level bytes mean that we will report more data here than in the sent messages, because they are multiplexed and sent to each member. As an example, if we have a group with 3 members and we send a 100 bytes message, this value will account for 300 bytes, since we send 100 bytes to each node. Added in MySQL 8.1.0.
* `Gr_control_messages_sent_bytes_sum`: Sum of bytes of control messages sent by this member. The size is the on-the-wire size. Added in MySQL 8.1.0.
* `Gr_control_messages_sent_count`: Number of control messages sent by this member. Added in MySQL 8.1.0.
* `Gr_control_messages_sent_roundtrip_time_sum`: Sum of the roundtrip time in micro-seconds of control messages sent by this member. The time is measured between the send and the delivery of the message on the sender member. This time will measure the time between the send and the delivery of the message on the majority of the members of the group (that includes the sender). Added in MySQL 8.1.0.
* `Gr_data_messages_sent_bytes_sum`: Sum of bytes of data messages sent by this member. The size is the on-the-wire size. Added in MySQL 8.1.0.
* `Gr_data_messages_sent_count`: Number of data messages sent by this member. Counts the number of transaction data messages sent. Added in MySQL 8.1.0.
* `Gr_data_messages_sent_roundtrip_time_sum`: Sum of the roundtrip time in micro-seconds of data messages sent by this member. The time is measured between the send and the delivery of the message on the sender member. This time will measure the time between the send and the delivery of the message on the majority of the members of the group (that includes the sender). Added in MySQL 8.1.0.
* `Gr_empty_consensus_proposals_count`: Sum of all empty proposal rounds that were initiated and terminated in this node. Added in MySQL 8.1.0.
* `Gr_extended_consensus_count`: The number of full 3-Phase PAXOS that this node initiated. If this number grows, it means that at least of the node is having issues answering to Proposals, either by slowliness or network issues. Use togheter with count_member_failure_suspicions to try and do some diagnose. Added in MySQL 8.1.0.
* `Gr_last_consensus_end_timestamp`: The time in which our last consensus proposal was approved. Reported in a timestamp format. This is an indicator if the group is halted or making slow progress. Added in MySQL 8.1.0.
* `Gr_total_messages_sent_count`: The number of high-level messages that this node sent to the group. These messages are the ones the we receive via the API to be proposed to the group. XCom has a batching mechanism, that will gather these messages and propose them all togheter. This will acocunt the number of message before being batched. Added in MySQL 8.1.0.
* `Gr_transactions_consistency_after_sync_count`: Number of transactions on secondaries that waited to start, while waiting for transactions from the primary with group_replication_consistency= AFTER and BEFORE_AND_AFTER to be committed. Added in MySQL 8.1.0.
* `Gr_transactions_consistency_after_sync_time_sum`: Sum of the time in micro-seconds that transactions on secondaries waited to start, while waiting for transactions from the primary with group_replication_consistency= AFTER and BEFORE_AND_AFTER to be committed. Added in MySQL 8.1.0.
* `Gr_transactions_consistency_after_termination_count`: Number of transactions executed with group_replication_consistency= AFTER and BEFORE_AND_AFTER. Added in MySQL 8.1.0.
* `Gr_transactions_consistency_after_termination_time_sum`: Sum of the time in micro-seconds spent between the delivery of the transaction executed with group_replication_consistency=AFTER and BEFORE_AND_AFTER, and the acknowledge of the other group members that the transaction is prepared. It does not include the transaction send roundtrip time. Added in MySQL 8.1.0.
* `Gr_transactions_consistency_before_begin_count`: Number of transactions executed with group_replication_consistency= BEFORE and BEFORE_AND_AFTER. Added in MySQL 8.1.0.
* `Gr_transactions_consistency_before_begin_time_sum`: Sum of the time in micro-seconds that the member waited until its group_replication_applier channel was consumed before execute the transaction with group_replication_consistency= BEFORE and BEFORE_AND_AFTER. Added in MySQL 8.1.0.
* `Performance_schema_meter_lost`: Number of meter instruments that failed to be created. Added in MySQL 8.2.0.
* `Performance_schema_metric_lost`: Number of metric instruments that failed to be created. Added in MySQL 8.2.0.
* `Telemetry_metrics_supported`: Whether server telemetry metrics is supported. Added in MySQL 8.2.0.
* `Tls_sni_server_name`: Server name supplied by the client. Added in MySQL 8.1.0.
* `authentication_ldap_sasl_connect_timeout`: SASL-Based LDAP server connection timeout. Added in MySQL 8.1.0.
* `authentication_ldap_sasl_response_timeout`: Simple LDAP server response timeout. Added in MySQL 8.1.0.
* `authentication_ldap_simple_connect_timeout`: Simple LDAP server connection timeout. Added in MySQL 8.1.0.
* `authentication_ldap_simple_response_timeout`: Simple LDAP server response timeout. Added in MySQL 8.1.0.
* `authentication_webauthn_rp_id`: Relying party ID for multifactor authentication. Added in MySQL 8.2.0.
* `check-table-functions`: How to proceed when scanning data dictionary for functions used in table constraints and other expressions, and such a function causes an error. Use WARN to log warnings; ABORT (default) also logs warnings, and halts any upgrade in progress. Added in MySQL 8.4.5.
* `component_masking.dictionaries_flush_interval_seconds`: How long for scheduler to wait until attempting to schedule next execution, in seconds. Added in MySQL 8.3.0.
* `component_masking.masking_database`: Database to use for masking dictionaries. Added in MySQL 8.3.0.
* `group_replication_preemptive_garbage_collection`: Enable preemptive garbage collection in single-primary mode; no effect in multi-primary mode. Added in MySQL 8.4.0.
* `group_replication_preemptive_garbage_collection_rows_threshold`: Number of rows of certification information required to trigger preemptive garbage collection in single-primary mode when enabled by group_replication_preemptive_garbage_collection. Added in MySQL 8.4.0.
* `keyring-migration-from-component`: Keyring migration is from component to plugin. Added in MySQL 8.4.0.
* `mysql-native-password`: Enable mysql_native_password authentication plugin. Added in MySQL 8.4.0.
* `mysql_firewall_database`: Database from which MySQL Enterprise Firewall plugin sources its tables and stored procedures. Added in MySQL 8.2.0.
* `mysql_firewall_reload_interval_seconds`: Reload MySQL Enterprise Firewall plugin data at specified intervals. Added in MySQL 8.2.0.
* `performance_schema_max_meter_classes`: Maximum number of meter instruments which can be created. Added in MySQL 8.2.0.
* `performance_schema_max_metric_classes`: Maximum number of metric instruments which can be created. Added in MySQL 8.2.0.
* `restrict_fk_on_non_standard_key`: Disallow creation of foreign keys on non-unique or partial keys. Added in MySQL 8.4.0.
* `set_operations_buffer_size`: Amount of memory available for hashing of set operations. Added in MySQL 8.2.0.
* `telemetry.live_sessions`: Displays the current number of sessions instrumented with telemetry. Added in MySQL 8.1.0.
* `telemetry.metrics_enabled`: Controls whether telemetry metrics are collected or not. Added in MySQL 8.3.0.
* `telemetry.metrics_reader_frequency_1`: . Added in MySQL 8.3.0.
* `telemetry.metrics_reader_frequency_2`: . Added in MySQL 8.3.0.
* `telemetry.metrics_reader_frequency_3`: . Added in MySQL 8.3.0.
* `telemetry.otel_bsp_max_export_batch_size`: Maximum batch size. Added in MySQL 8.1.0.
* `telemetry.otel_bsp_max_queue_size`: Maximum queue size. Added in MySQL 8.1.0.
* `telemetry.otel_bsp_schedule_delay`: Delay interval between two consecutive exports in milliseconds. Added in MySQL 8.1.0.
* `telemetry.otel_exporter_otlp_metrics_certificates`: The trusted certificate to use when verifying a server's TLS credentials. Added in MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_metrics_cipher`: TLS cipher to use for metrics (TLS 1.2). Added in MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_metrics_cipher_suite`: TLS cipher to use for metrics (TLS 1.3). Added in MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_metrics_client_certificates`: Client certificate/chain trust for clients private key in PEM format. Added in MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_metrics_client_key`: Client's private key in PEM format. Added in MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_metrics_compression`: Compression used by exporter. Added in MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_metrics_endpoint`: Metrics endpoint URL. Added in MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_metrics_headers`: Key-value pairs to be used as headers associated with HTTP requests. Added in MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_metrics_max_tls`: Maximum TLS version to use for metrics. Added in MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_metrics_min_tls`: Minimum TLS version to use for metrics. Added in MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_metrics_protocol`: Specifies the OTLP transport protocol. Added in MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_metrics_timeout`: Time OLTP exporter waits for each batch export. Added in MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_traces_certificates`: The trusted certificate to use when verifying a server's TLS credentials.. Added in MySQL 8.1.0.
* `telemetry.otel_exporter_otlp_traces_cipher`: TLS cipher to use for traces (TLS 1.2). Added in MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_traces_cipher_suite`: TLS cipher to use for traces (TLS 1.3). Added in MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_traces_client_certificates`: Client certificate/chain trust for clients private key in PEM format.. Added in MySQL 8.1.0.
* `telemetry.otel_exporter_otlp_traces_client_key`: Client's private key in PEM format.. Added in MySQL 8.1.0.
* `telemetry.otel_exporter_otlp_traces_compression`: Compression used by exporter. Added in MySQL 8.1.0.
* `telemetry.otel_exporter_otlp_traces_endpoint`: Target URL to which the exporter sends traces. Added in MySQL 8.1.0.
* `telemetry.otel_exporter_otlp_traces_headers`: Key-value pairs to be used as headers associated with HTTP requests. Added in MySQL 8.1.0.
* `telemetry.otel_exporter_otlp_traces_max_tls`: Maximum TLS version to use for traces. Added in MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_traces_min_tls`: Minimum TLS version to use for traces. Added in MySQL 8.3.0.
* `telemetry.otel_exporter_otlp_traces_protocol`: OTLP transport protocol. Added in MySQL 8.1.0.
* `telemetry.otel_exporter_otlp_traces_timeout`: Time OLTP exporter waits for each batch export. Added in MySQL 8.1.0.
* `telemetry.otel_log_level`: Controls which opentelemetry logs are printed in the server logs (Linux only). Added in MySQL 8.1.0.
* `telemetry.otel_resource_attributes`: See corresponding OpenTelemetry variable OTEL_RESOURCE_ATTRIBUTES.. Added in MySQL 8.1.0.
* `telemetry.query_text_enabled`: Controls whether the SQL query text is included in the trace (Linux only). Added in MySQL 8.1.0.
* `telemetry.trace_enabled`: Controls whether telemetry traces are collected or not (Linux only). Added in MySQL 8.1.0.
* `thread_pool_longrun_trx_limit`: When all threads using thread_pool_max_transactions_limit have been executing longer than this number of milliseconds, limit for group is suspended. Added in MySQL 8.4.0.
* `tls_certificates_enforced_validation`: Whether to validate server and CA certificates. Added in MySQL 8.1.0.

### Options and Variables Deprecated in MySQL 8.4

The following system variables, status variables, and options have been deprecated in MySQL 8.4.

* `Com_show_master_status`: Count of SHOW MASTER STATUS statements. Deprecated in MySQL 8.2.0.
* `authentication_fido_rp_id`: Relying party ID for FIDO multifactor authentication. Deprecated in MySQL 8.2.0.
* `binlog_transaction_dependency_tracking`: Source of dependency information (commit timestamps or transaction write sets) from which to assess which transactions can be executed in parallel by replica's multithreaded applier. Deprecated in MySQL 8.2.0.
* `character-set-client-handshake`: Do not ignore client side character set value sent during handshake. Deprecated in MySQL 8.2.0.
* `group_replication_allow_local_lower_version_join`: Allow current server to join group even if it has lower plugin version than group. Deprecated in MySQL 8.4.0.
* `group_replication_view_change_uuid`: UUID for view change event GTIDs. Deprecated in MySQL 8.3.0.
* `mysql-native-password`: Enable mysql_native_password authentication plugin. Deprecated in MySQL 8.4.0.
* `new`: Use very new, possibly 'unsafe' functions. Deprecated in MySQL 8.2.0.
* `old`: Cause server to revert to certain behaviors present in older versions. Deprecated in MySQL 8.2.0.
* `performance_schema_show_processlist`: Select SHOW PROCESSLIST implementation. Deprecated in MySQL 8.2.0.
* `restrict_fk_on_non_standard_key`: Disallow creation of foreign keys on non-unique or partial keys. Deprecated in MySQL 8.4.0.
* `skip-character-set-client-handshake`: Ignore client side character set value sent during handshake. Deprecated in MySQL 8.2.0.
* `skip-new`: Do not use new, possibly wrong routines. Deprecated in MySQL 8.2.0.

### Options and Variables Removed in MySQL 8.4

The following system variables, status variables, and options have been removed in MySQL 8.4.

* `Com_change_master`: Count of CHANGE REPLICATION SOURCE TO and CHANGE MASTER TO statements. Removed in MySQL 8.4.0.
* `Com_show_master_status`: Count of SHOW MASTER STATUS statements. Removed in MySQL 8.4.0.
* `Com_show_slave_hosts`: Count of SHOW REPLICAS and SHOW SLAVE HOSTS statements. Removed in MySQL 8.4.0.
* `Com_show_slave_status`: Count of SHOW REPLICA STATUS and SHOW SLAVE STATUS statements. Removed in MySQL 8.4.0.
* `Com_slave_start`: Count of START REPLICA and START SLAVE statements. Removed in MySQL 8.4.0.
* `Com_slave_stop`: Count of STOP REPLICA and STOP SLAVE statements. Removed in MySQL 8.4.0.
* `Replica_rows_last_search_algorithm_used`: Search algorithm most recently used by this replica to locate rows for row-based replication (index, table, or hash scan). Removed in MySQL 8.3.0.
* `abort-slave-event-count`: Option used by mysql-test for debugging and testing of replication. Removed in MySQL 8.2.0.
* `admin-ssl`: Enable connection encryption. Removed in MySQL 8.4.0.
* `authentication_fido_rp_id`: Relying party ID for FIDO multifactor authentication. Removed in MySQL 8.4.0.
* `avoid_temporal_upgrade`: Whether ALTER TABLE should upgrade pre-5.6.4 temporal columns. Removed in MySQL 8.4.0.
* `binlog_transaction_dependency_tracking`: Source of dependency information (commit timestamps or transaction write sets) from which to assess which transactions can be executed in parallel by replica's multithreaded applier. Removed in MySQL 8.4.0.
* `character-set-client-handshake`: Do not ignore client side character set value sent during handshake. Removed in MySQL 8.3.0.
* `daemon_memcached_enable_binlog`: . Removed in MySQL 8.3.0.
* `daemon_memcached_engine_lib_name`: Shared library implementing InnoDB memcached plugin. Removed in MySQL 8.3.0.
* `daemon_memcached_engine_lib_path`: Directory which contains shared library implementing InnoDB memcached plugin. Removed in MySQL 8.3.0.
* `daemon_memcached_option`: Space-separated options which are passed to underlying memcached daemon on startup. Removed in MySQL 8.3.0.
* `daemon_memcached_r_batch_size`: Specifies how many memcached read operations to perform before doing COMMIT to start new transaction. Removed in MySQL 8.3.0.
* `daemon_memcached_w_batch_size`: Specifies how many memcached write operations to perform before doing COMMIT to start new transaction. Removed in MySQL 8.3.0.
* `default_authentication_plugin`: Default authentication plugin. Removed in MySQL 8.4.0.
* `disconnect-slave-event-count`: Option used by mysql-test for debugging and testing of replication. Removed in MySQL 8.2.0.
* `expire_logs_days`: Purge binary logs after this many days. Removed in MySQL 8.2.0.
* `group_replication_ip_whitelist`: List of hosts permitted to connect to group. Removed in MySQL 8.3.0.
* `group_replication_primary_member`: Primary member UUID when group operates in single-primary mode. Empty string if group is operating in multi-primary mode. Removed in MySQL 8.3.0.
* `group_replication_recovery_complete_at`: Recovery policies when handling cached transactions after state transfer. Removed in MySQL 8.4.0.
* `have_openssl`: Whether mysqld supports SSL connections. Removed in MySQL 8.4.0.
* `have_ssl`: Whether mysqld supports SSL connections. Removed in MySQL 8.4.0.
* `innodb`: Enable InnoDB (if this version of MySQL supports it). Removed in MySQL 8.3.0.
* `innodb_api_bk_commit_interval`: How often to auto-commit idle connections which use InnoDB memcached interface, in seconds. Removed in MySQL 8.3.0.
* `innodb_api_disable_rowlock`: . Removed in MySQL 8.3.0.
* `innodb_api_enable_binlog`: Allows use of InnoDB memcached plugin with MySQL binary log. Removed in MySQL 8.3.0.
* `innodb_api_enable_mdl`: Locks table used by InnoDB memcached plugin, so that it cannot be dropped or altered by DDL through SQL interface. Removed in MySQL 8.3.0.
* `innodb_api_trx_level`: Allows control of transaction isolation level on queries processed by memcached interface. Removed in MySQL 8.3.0.
* `keyring_encrypted_file_data`: keyring_encrypted_file plugin data file. Removed in MySQL 8.4.0.
* `keyring_encrypted_file_password`: keyring_encrypted_file plugin password. Removed in MySQL 8.4.0.
* `keyring_file_data`: keyring_file plugin data file. Removed in MySQL 8.4.0.
* `keyring_oci_ca_certificate`: CA certificate file for peer authentication. Removed in MySQL 8.4.0.
* `keyring_oci_compartment`: OCI compartment OCID. Removed in MySQL 8.4.0.
* `keyring_oci_encryption_endpoint`: OCI encryption server endpoint. Removed in MySQL 8.4.0.
* `keyring_oci_key_file`: OCI RSA private key file. Removed in MySQL 8.4.0.
* `keyring_oci_key_fingerprint`: OCI RSA private key file fingerprint. Removed in MySQL 8.4.0.
* `keyring_oci_management_endpoint`: OCI management server endpoint. Removed in MySQL 8.4.0.
* `keyring_oci_master_key`: OCI master key OCID. Removed in MySQL 8.4.0.
* `keyring_oci_secrets_endpoint`: OCI secrets server endpoint. Removed in MySQL 8.4.0.
* `keyring_oci_tenancy`: OCI tenancy OCID. Removed in MySQL 8.4.0.
* `keyring_oci_user`: OCI user OCID. Removed in MySQL 8.4.0.
* `keyring_oci_vaults_endpoint`: OCI vaults server endpoint. Removed in MySQL 8.4.0.
* `keyring_oci_virtual_vault`: OCI vault OCID. Removed in MySQL 8.4.0.
* `language`: Client error messages in given language. May be given as full path. Removed in MySQL 8.4.0.
* `log_bin_use_v1_row_events`: Whether server is using version 1 binary log row events. Removed in MySQL 8.3.0.
* `master-info-file`: Location and name of file that remembers source and where I/O replication thread is in source's binary log. Removed in MySQL 8.3.0.
* `master_info_repository`: Whether to write connection metadata repository, containing source information and replication I/O thread location in source's binary log, to file or table. Removed in MySQL 8.3.0.
* `new`: Use very new, possibly 'unsafe' functions. Removed in MySQL 8.4.0.
* `no-dd-upgrade`: Prevent automatic upgrade of data dictionary tables at startup. Removed in MySQL 8.4.0.
* `old`: Cause server to revert to certain behaviors present in older versions. Removed in MySQL 8.4.0.
* `old-style-user-limits`: Enable old-style user limits (before 5.0.3, user resources were counted per each user+host vs. per account). Removed in MySQL 8.3.0.
* `relay_log_info_file`: File name for applier metadata repository in which replica records information about relay logs. Removed in MySQL 8.3.0.
* `relay_log_info_repository`: Whether to write location of replication SQL thread in relay logs to file or table. Removed in MySQL 8.3.0.
* `show_old_temporals`: Whether SHOW CREATE TABLE should indicate pre-5.6.4 temporal columns. Removed in MySQL 8.4.0.
* `skip-character-set-client-handshake`: Ignore client side character set value sent during handshake. Removed in MySQL 8.3.0.
* `skip-host-cache`: Do not cache host names. Removed in MySQL 8.3.0.
* `skip-ssl`: Disable connection encryption. Removed in MySQL 8.4.0.
* `slave_rows_search_algorithms`: Determines search algorithms used for replica update batching. Any 2 or 3 from this list: INDEX_SEARCH, TABLE_SCAN, HASH_SCAN. Removed in MySQL 8.3.0.
* `ssl`: Enable connection encryption. Removed in MySQL 8.4.0.
* `transaction_write_set_extraction`: Defines algorithm used to hash writes extracted during transaction. Removed in MySQL 8.3.0.
