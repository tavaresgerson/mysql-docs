### 29.12.1 Performance Schema Table Reference

The following table summarizes all available Performance Schema
tables. For greater detail, see the individual table
descriptions.

**Table 29.1 Performance Schema Tables**

<table frame="box" rules="all" summary="A reference that lists all Performance Schema tables."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Table Name</th>
<th>Description</th>
<th>Introduced</th>
</tr></thead><tbody><tr><th scope="row"><a class="link" href="performance-schema-accounts-table.html" title="29.12.8.1 The accounts Table"><code class="literal">accounts</code></a></th>
<td>Connection statistics per client account</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-binary-log-transaction-compression-stats-table.html" title="29.12.11.1 The binary_log_transaction_compression_stats Table"><code class="literal">binary_log_transaction_compression_stats</code></a></th>
<td>Binary log transaction compression</td>
<td>8.0.20</td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-clone-progress-table.html" title="29.12.19.2 The clone_progress Table"><code class="literal">clone_progress</code></a></th>
<td>Clone operation progress</td>
<td>8.0.17</td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-clone-status-table.html" title="29.12.19.1 The clone_status Table"><code class="literal">clone_status</code></a></th>
<td>Clone operation status</td>
<td>8.0.17</td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-component-scheduler-tasks-table.html" title="29.12.21.1 The component_scheduler_tasks Table"><code class="literal">component_scheduler_tasks</code></a></th>
<td>Status of scheduled tasks</td>
<td>8.0.34</td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-cond-instances-table.html" title="29.12.3.1 The cond_instances Table"><code class="literal">cond_instances</code></a></th>
<td>Synchronization object instances</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-data-lock-waits-table.html" title="29.12.13.2 The data_lock_waits Table"><code class="literal">data_lock_waits</code></a></th>
<td>Data lock wait relationships</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-data-locks-table.html" title="29.12.13.1 The data_locks Table"><code class="literal">data_locks</code></a></th>
<td>Data locks held and requested</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-error-log-table.html" title="29.12.21.2 The error_log Table"><code class="literal">error_log</code></a></th>
<td>Server error log recent entries</td>
<td>8.0.22</td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-error-summary-tables.html" title="29.12.20.11 Error Summary Tables"><code class="literal">events_errors_summary_by_account_by_error</code></a></th>
<td>Errors per account and error code</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-error-summary-tables.html" title="29.12.20.11 Error Summary Tables"><code class="literal">events_errors_summary_by_host_by_error</code></a></th>
<td>Errors per host and error code</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-error-summary-tables.html" title="29.12.20.11 Error Summary Tables"><code class="literal">events_errors_summary_by_thread_by_error</code></a></th>
<td>Errors per thread and error code</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-error-summary-tables.html" title="29.12.20.11 Error Summary Tables"><code class="literal">events_errors_summary_by_user_by_error</code></a></th>
<td>Errors per user and error code</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-error-summary-tables.html" title="29.12.20.11 Error Summary Tables"><code class="literal">events_errors_summary_global_by_error</code></a></th>
<td>Errors per error code</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-events-stages-current-table.html" title="29.12.5.1 The events_stages_current Table"><code class="literal">events_stages_current</code></a></th>
<td>Current stage events</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-events-stages-history-table.html" title="29.12.5.2 The events_stages_history Table"><code class="literal">events_stages_history</code></a></th>
<td>Most recent stage events per thread</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-events-stages-history-long-table.html" title="29.12.5.3 The events_stages_history_long Table"><code class="literal">events_stages_history_long</code></a></th>
<td>Most recent stage events overall</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-stage-summary-tables.html" title="29.12.20.2 Stage Summary Tables"><code class="literal">events_stages_summary_by_account_by_event_name</code></a></th>
<td>Stage events per account and event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-stage-summary-tables.html" title="29.12.20.2 Stage Summary Tables"><code class="literal">events_stages_summary_by_host_by_event_name</code></a></th>
<td>Stage events per host name and event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-stage-summary-tables.html" title="29.12.20.2 Stage Summary Tables"><code class="literal">events_stages_summary_by_thread_by_event_name</code></a></th>
<td>Stage waits per thread and event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-stage-summary-tables.html" title="29.12.20.2 Stage Summary Tables"><code class="literal">events_stages_summary_by_user_by_event_name</code></a></th>
<td>Stage events per user name and event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-stage-summary-tables.html" title="29.12.20.2 Stage Summary Tables"><code class="literal">events_stages_summary_global_by_event_name</code></a></th>
<td>Stage waits per event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-events-statements-current-table.html" title="29.12.6.1 The events_statements_current Table"><code class="literal">events_statements_current</code></a></th>
<td>Current statement events</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-statement-histogram-summary-tables.html" title="29.12.20.4 Statement Histogram Summary Tables"><code class="literal">events_statements_histogram_by_digest</code></a></th>
<td>Statement histograms per schema and digest value</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-statement-histogram-summary-tables.html" title="29.12.20.4 Statement Histogram Summary Tables"><code class="literal">events_statements_histogram_global</code></a></th>
<td>Statement histogram summarized globally</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-events-statements-history-table.html" title="29.12.6.2 The events_statements_history Table"><code class="literal">events_statements_history</code></a></th>
<td>Most recent statement events per thread</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-events-statements-history-long-table.html" title="29.12.6.3 The events_statements_history_long Table"><code class="literal">events_statements_history_long</code></a></th>
<td>Most recent statement events overall</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-statement-summary-tables.html" title="29.12.20.3 Statement Summary Tables"><code class="literal">events_statements_summary_by_account_by_event_name</code></a></th>
<td>Statement events per account and event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-statement-summary-tables.html" title="29.12.20.3 Statement Summary Tables"><code class="literal">events_statements_summary_by_digest</code></a></th>
<td>Statement events per schema and digest value</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-statement-summary-tables.html" title="29.12.20.3 Statement Summary Tables"><code class="literal">events_statements_summary_by_host_by_event_name</code></a></th>
<td>Statement events per host name and event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-statement-summary-tables.html" title="29.12.20.3 Statement Summary Tables"><code class="literal">events_statements_summary_by_program</code></a></th>
<td>Statement events per stored program</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-statement-summary-tables.html" title="29.12.20.3 Statement Summary Tables"><code class="literal">events_statements_summary_by_thread_by_event_name</code></a></th>
<td>Statement events per thread and event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-statement-summary-tables.html" title="29.12.20.3 Statement Summary Tables"><code class="literal">events_statements_summary_by_user_by_event_name</code></a></th>
<td>Statement events per user name and event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-statement-summary-tables.html" title="29.12.20.3 Statement Summary Tables"><code class="literal">events_statements_summary_global_by_event_name</code></a></th>
<td>Statement events per event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-events-transactions-current-table.html" title="29.12.7.1 The events_transactions_current Table"><code class="literal">events_transactions_current</code></a></th>
<td>Current transaction events</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-events-transactions-history-table.html" title="29.12.7.2 The events_transactions_history Table"><code class="literal">events_transactions_history</code></a></th>
<td>Most recent transaction events per thread</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-events-transactions-history-long-table.html" title="29.12.7.3 The events_transactions_history_long Table"><code class="literal">events_transactions_history_long</code></a></th>
<td>Most recent transaction events overall</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-transaction-summary-tables.html" title="29.12.20.5 Transaction Summary Tables"><code class="literal">events_transactions_summary_by_account_by_event_name</code></a></th>
<td>Transaction events per account and event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-transaction-summary-tables.html" title="29.12.20.5 Transaction Summary Tables"><code class="literal">events_transactions_summary_by_host_by_event_name</code></a></th>
<td>Transaction events per host name and event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-transaction-summary-tables.html" title="29.12.20.5 Transaction Summary Tables"><code class="literal">events_transactions_summary_by_thread_by_event_name</code></a></th>
<td>Transaction events per thread and event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-transaction-summary-tables.html" title="29.12.20.5 Transaction Summary Tables"><code class="literal">events_transactions_summary_by_user_by_event_name</code></a></th>
<td>Transaction events per user name and event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-transaction-summary-tables.html" title="29.12.20.5 Transaction Summary Tables"><code class="literal">events_transactions_summary_global_by_event_name</code></a></th>
<td>Transaction events per event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-events-waits-current-table.html" title="29.12.4.1 The events_waits_current Table"><code class="literal">events_waits_current</code></a></th>
<td>Current wait events</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-events-waits-history-table.html" title="29.12.4.2 The events_waits_history Table"><code class="literal">events_waits_history</code></a></th>
<td>Most recent wait events per thread</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-events-waits-history-long-table.html" title="29.12.4.3 The events_waits_history_long Table"><code class="literal">events_waits_history_long</code></a></th>
<td>Most recent wait events overall</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-wait-summary-tables.html" title="29.12.20.1 Wait Event Summary Tables"><code class="literal">events_waits_summary_by_account_by_event_name</code></a></th>
<td>Wait events per account and event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-wait-summary-tables.html" title="29.12.20.1 Wait Event Summary Tables"><code class="literal">events_waits_summary_by_host_by_event_name</code></a></th>
<td>Wait events per host name and event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-wait-summary-tables.html" title="29.12.20.1 Wait Event Summary Tables"><code class="literal">events_waits_summary_by_instance</code></a></th>
<td>Wait events per instance</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-wait-summary-tables.html" title="29.12.20.1 Wait Event Summary Tables"><code class="literal">events_waits_summary_by_thread_by_event_name</code></a></th>
<td>Wait events per thread and event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-wait-summary-tables.html" title="29.12.20.1 Wait Event Summary Tables"><code class="literal">events_waits_summary_by_user_by_event_name</code></a></th>
<td>Wait events per user name and event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-wait-summary-tables.html" title="29.12.20.1 Wait Event Summary Tables"><code class="literal">events_waits_summary_global_by_event_name</code></a></th>
<td>Wait events per event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-file-instances-table.html" title="29.12.3.2 The file_instances Table"><code class="literal">file_instances</code></a></th>
<td>File instances</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-file-summary-tables.html" title="29.12.20.7 File I/O Summary Tables"><code class="literal">file_summary_by_event_name</code></a></th>
<td>File events per event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-file-summary-tables.html" title="29.12.20.7 File I/O Summary Tables"><code class="literal">file_summary_by_instance</code></a></th>
<td>File events per file instance</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-firewall-group-allowlist-table.html" title="29.12.17.2 The firewall_group_allowlist Table"><code class="literal">firewall_group_allowlist</code></a></th>
<td>Firewall in-memory data for group profile allowlists</td>
<td>8.0.23</td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-firewall-groups-table.html" title="29.12.17.1 The firewall_groups Table"><code class="literal">firewall_groups</code></a></th>
<td>Firewall in-memory data for group profiles</td>
<td>8.0.23</td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-firewall-membership-table.html" title="29.12.17.3 The firewall_membership Table"><code class="literal">firewall_membership</code></a></th>
<td>Firewall in-memory data for group profile members</td>
<td>8.0.23</td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-status-variable-tables.html" title="29.12.15 Performance Schema Status Variable Tables"><code class="literal">global_status</code></a></th>
<td>Global status variables</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-system-variable-tables.html" title="29.12.14 Performance Schema System Variable Tables"><code class="literal">global_variables</code></a></th>
<td>Global system variables</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-host-cache-table.html" title="29.12.21.3 The host_cache Table"><code class="literal">host_cache</code></a></th>
<td>Information from internal host cache</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-hosts-table.html" title="29.12.8.2 The hosts Table"><code class="literal">hosts</code></a></th>
<td>Connection statistics per client host name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-keyring-component-status-table.html" title="29.12.18.1 The keyring_component_status Table"><code class="literal">keyring_component_status</code></a></th>
<td>Status information for installed keyring component</td>
<td>8.0.24</td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-keyring-keys-table.html" title="29.12.18.2 The keyring_keys table"><code class="literal">keyring_keys</code></a></th>
<td>Metadata for keyring keys</td>
<td>8.0.16</td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-log-status-table.html" title="29.12.21.5 The log_status Table"><code class="literal">log_status</code></a></th>
<td>Information about server logs for backup purposes</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-memory-summary-tables.html" title="29.12.20.10 Memory Summary Tables"><code class="literal">memory_summary_by_account_by_event_name</code></a></th>
<td>Memory operations per account and event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-memory-summary-tables.html" title="29.12.20.10 Memory Summary Tables"><code class="literal">memory_summary_by_host_by_event_name</code></a></th>
<td>Memory operations per host and event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-memory-summary-tables.html" title="29.12.20.10 Memory Summary Tables"><code class="literal">memory_summary_by_thread_by_event_name</code></a></th>
<td>Memory operations per thread and event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-memory-summary-tables.html" title="29.12.20.10 Memory Summary Tables"><code class="literal">memory_summary_by_user_by_event_name</code></a></th>
<td>Memory operations per user and event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-memory-summary-tables.html" title="29.12.20.10 Memory Summary Tables"><code class="literal">memory_summary_global_by_event_name</code></a></th>
<td>Memory operations globally per event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-metadata-locks-table.html" title="29.12.13.3 The metadata_locks Table"><code class="literal">metadata_locks</code></a></th>
<td>Metadata locks and lock requests</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-mutex-instances-table.html" title="29.12.3.3 The mutex_instances Table"><code class="literal">mutex_instances</code></a></th>
<td>Mutex synchronization object instances</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-ndb-sync-excluded-objects-table.html" title="29.12.12.2 The ndb_sync_excluded_objects Table"><code class="literal">ndb_sync_excluded_objects</code></a></th>
<td>NDB objects which cannot be synchronized</td>
<td>8.0.21</td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-ndb-sync-pending-objects-table.html" title="29.12.12.1 The ndb_sync_pending_objects Table"><code class="literal">ndb_sync_pending_objects</code></a></th>
<td>NDB objects waiting for synchronization</td>
<td>8.0.21</td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-objects-summary-global-by-type-table.html" title="29.12.20.6 Object Wait Summary Table"><code class="literal">objects_summary_global_by_type</code></a></th>
<td>Object summaries</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-performance-timers-table.html" title="29.12.21.6 The performance_timers Table"><code class="literal">performance_timers</code></a></th>
<td>Which event timers are available</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-system-variable-tables.html" title="29.12.14 Performance Schema System Variable Tables"><code class="literal">persisted_variables</code></a></th>
<td>Contents of mysqld-auto.cnf file</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-prepared-statements-instances-table.html" title="29.12.6.4 The prepared_statements_instances Table"><code class="literal">prepared_statements_instances</code></a></th>
<td>Prepared statement instances and statistics</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-processlist-table.html" title="29.12.21.7 The processlist Table"><code class="literal">processlist</code></a></th>
<td>Process list information</td>
<td>8.0.22</td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-replication-applier-configuration-table.html" title="29.12.11.2 The replication_applier_configuration Table"><code class="literal">replication_applier_configuration</code></a></th>
<td>Configuration parameters for replication applier on replica</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-replication-applier-filters-table.html" title="29.12.11.6 The replication_applier_filters Table"><code class="literal">replication_applier_filters</code></a></th>
<td>Channel-specific replication filters on current replica</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-replication-applier-global-filters-table.html" title="29.12.11.7 The replication_applier_global_filters Table"><code class="literal">replication_applier_global_filters</code></a></th>
<td>Global replication filters on current replica</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-replication-applier-status-table.html" title="29.12.11.3 The replication_applier_status Table"><code class="literal">replication_applier_status</code></a></th>
<td>Current status of replication applier on replica</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-replication-applier-status-by-coordinator-table.html" title="29.12.11.4 The replication_applier_status_by_coordinator Table"><code class="literal">replication_applier_status_by_coordinator</code></a></th>
<td>SQL or coordinator thread applier status</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-replication-applier-status-by-worker-table.html" title="29.12.11.5 The replication_applier_status_by_worker Table"><code class="literal">replication_applier_status_by_worker</code></a></th>
<td>Worker thread applier status</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-replication-asynchronous-connection-failover-table.html" title="29.12.11.8 The replication_asynchronous_connection_failover Table"><code class="literal">replication_asynchronous_connection_failover</code></a></th>
<td>Source lists for asynchronous connection failover mechanism</td>
<td>8.0.22</td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-replication-asynchronous-connection-failover-managed-table.html" title="29.12.11.9 The replication_asynchronous_connection_failover_managed Table"><code class="literal">replication_asynchronous_connection_failover_managed</code></a></th>
<td>Managed source lists for asynchronous connection failover mechanism</td>
<td>8.0.23</td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-replication-connection-configuration-table.html" title="29.12.11.10 The replication_connection_configuration Table"><code class="literal">replication_connection_configuration</code></a></th>
<td>Configuration parameters for connecting to source</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-replication-connection-status-table.html" title="29.12.11.11 The replication_connection_status Table"><code class="literal">replication_connection_status</code></a></th>
<td>Current status of connection to source</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-replication-group-communication-information-table.html" title="29.12.11.12 The replication_group_communication_information Table"><code class="literal">replication_group_communication_information</code></a></th>
<td>Replication group configuration options</td>
<td>8.0.27</td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-replication-group-configuration-version-table.html" title="29.12.11.13 The replication_group_configuration_version Table"><code class="literal">replication_group_configuration_version</code></a></th>
<td>Version of the member actions configuration for replication group members</td>
<td>8.0.26</td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-replication-group-member-actions-table.html" title="29.12.11.14 The replication_group_member_actions Table"><code class="literal">replication_group_member_actions</code></a></th>
<td>Member actions that are included in the member actions configuration for replication group members</td>
<td>8.0.26</td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-replication-group-member-stats-table.html" title="29.12.11.15 The replication_group_member_stats Table"><code class="literal">replication_group_member_stats</code></a></th>
<td>Replication group member statistics</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-replication-group-members-table.html" title="29.12.11.16 The replication_group_members Table"><code class="literal">replication_group_members</code></a></th>
<td>Replication group member network and status</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-rwlock-instances-table.html" title="29.12.3.4 The rwlock_instances Table"><code class="literal">rwlock_instances</code></a></th>
<td>Lock synchronization object instances</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-session-account-connect-attrs-table.html" title="29.12.9.1 The session_account_connect_attrs Table"><code class="literal">session_account_connect_attrs</code></a></th>
<td>Connection attributes per for current session</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-session-connect-attrs-table.html" title="29.12.9.2 The session_connect_attrs Table"><code class="literal">session_connect_attrs</code></a></th>
<td>Connection attributes for all sessions</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-status-variable-tables.html" title="29.12.15 Performance Schema Status Variable Tables"><code class="literal">session_status</code></a></th>
<td>Status variables for current session</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-system-variable-tables.html" title="29.12.14 Performance Schema System Variable Tables"><code class="literal">session_variables</code></a></th>
<td>System variables for current session</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-setup-actors-table.html" title="29.12.2.1 The setup_actors Table"><code class="literal">setup_actors</code></a></th>
<td>How to initialize monitoring for new foreground threads</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-setup-consumers-table.html" title="29.12.2.2 The setup_consumers Table"><code class="literal">setup_consumers</code></a></th>
<td>Consumers for which event information can be stored</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-setup-instruments-table.html" title="29.12.2.3 The setup_instruments Table"><code class="literal">setup_instruments</code></a></th>
<td>Classes of instrumented objects for which events can be collected</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-setup-objects-table.html" title="29.12.2.4 The setup_objects Table"><code class="literal">setup_objects</code></a></th>
<td>Which objects should be monitored</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-setup-threads-table.html" title="29.12.2.5 The setup_threads Table"><code class="literal">setup_threads</code></a></th>
<td>Instrumented thread names and attributes</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-socket-instances-table.html" title="29.12.3.5 The socket_instances Table"><code class="literal">socket_instances</code></a></th>
<td>Active connection instances</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-socket-summary-tables.html" title="29.12.20.9 Socket Summary Tables"><code class="literal">socket_summary_by_event_name</code></a></th>
<td>Socket waits and I/O per event name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-socket-summary-tables.html" title="29.12.20.9 Socket Summary Tables"><code class="literal">socket_summary_by_instance</code></a></th>
<td>Socket waits and I/O per instance</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-status-variable-summary-tables.html" title="29.12.20.12 Status Variable Summary Tables"><code class="literal">status_by_account</code></a></th>
<td>Session status variables per account</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-status-variable-summary-tables.html" title="29.12.20.12 Status Variable Summary Tables"><code class="literal">status_by_host</code></a></th>
<td>Session status variables per host name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-status-variable-tables.html" title="29.12.15 Performance Schema Status Variable Tables"><code class="literal">status_by_thread</code></a></th>
<td>Session status variables per session</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-status-variable-summary-tables.html" title="29.12.20.12 Status Variable Summary Tables"><code class="literal">status_by_user</code></a></th>
<td>Session status variables per user name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-table-handles-table.html" title="29.12.13.4 The table_handles Table"><code class="literal">table_handles</code></a></th>
<td>Table locks and lock requests</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-table-wait-summary-tables.html#performance-schema-table-io-waits-summary-by-index-usage-table" title="29.12.20.8.2 The table_io_waits_summary_by_index_usage Table"><code class="literal">table_io_waits_summary_by_index_usage</code></a></th>
<td>Table I/O waits per index</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-table-wait-summary-tables.html#performance-schema-table-io-waits-summary-by-table-table" title="29.12.20.8.1 The table_io_waits_summary_by_table Table"><code class="literal">table_io_waits_summary_by_table</code></a></th>
<td>Table I/O waits per table</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-table-wait-summary-tables.html#performance-schema-table-lock-waits-summary-by-table-table" title="29.12.20.8.3 The table_lock_waits_summary_by_table Table"><code class="literal">table_lock_waits_summary_by_table</code></a></th>
<td>Table lock waits per table</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-threads-table.html" title="29.12.21.8 The threads Table"><code class="literal">threads</code></a></th>
<td>Information about server threads</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-tls-channel-status-table.html" title="29.12.21.9 The tls_channel_status Table"><code class="literal">tls_channel_status</code></a></th>
<td>TLS status for each connection interface</td>
<td>8.0.21</td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-tp-thread-group-state-table.html" title="29.12.16.1 The tp_thread_group_state Table"><code class="literal">tp_thread_group_state</code></a></th>
<td>Thread pool thread group states</td>
<td>8.0.14</td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-tp-thread-group-stats-table.html" title="29.12.16.2 The tp_thread_group_stats Table"><code class="literal">tp_thread_group_stats</code></a></th>
<td>Thread pool thread group statistics</td>
<td>8.0.14</td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-tp-thread-state-table.html" title="29.12.16.3 The tp_thread_state Table"><code class="literal">tp_thread_state</code></a></th>
<td>Thread pool thread information</td>
<td>8.0.14</td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-user-defined-functions-table.html" title="29.12.21.10 The user_defined_functions Table"><code class="literal">user_defined_functions</code></a></th>
<td>Registered loadable functions</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-user-variable-tables.html" title="29.12.10 Performance Schema User-Defined Variable Tables"><code class="literal">user_variables_by_thread</code></a></th>
<td>User-defined variables per thread</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-users-table.html" title="29.12.8.3 The users Table"><code class="literal">users</code></a></th>
<td>Connection statistics per client user name</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-system-variable-tables.html" title="29.12.14 Performance Schema System Variable Tables"><code class="literal">variables_by_thread</code></a></th>
<td>Session system variables per session</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="performance-schema-system-variable-tables.html" title="29.12.14 Performance Schema System Variable Tables"><code class="literal">variables_info</code></a></th>
<td>How system variables were most recently set</td>
<td></td>
</tr></tbody></table>