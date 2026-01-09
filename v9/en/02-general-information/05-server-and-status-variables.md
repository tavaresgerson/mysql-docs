## 1.5 Server and Status Variables and Options Added, Deprecated, or Removed in MySQL 9.5

This section lists server variables, status variables, and options that were added for the first time, have been deprecated, or have been removed in MySQL 9.5.

### Options and Variables Introduced in MySQL 9.5

The following system variables, status variables, and server options have been added in MySQL 9.5.

* `activate_mandatory_roles`: Activates mandatory and granted roles for all users. Added in MySQL 9.5.0.

* `component_connection_control.exempt_unknown_users`: Whether to penalize hosts generating failed TCP connections. Added in MySQL 9.5.0.

* `component_option_tracker.mysql_shell_support`: Whether MySQL Shell support is enabled for the Option Tracker. Added in MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell`: Number of times a MySQL Shell user session was created. Added in MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell - Copy`: Number of times a MySQL Shell copy utility was used. Added in MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell - Dump`: Number of times a MySQL Shell dump utility was used. Added in MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell - Dump - Load`: Number of times a MySQL Shell dump loading utility was used. Added in MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell - MRS`: Number of times a database operation is performed by MySQL REST Service. Added in MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell - Upgrade Checker`: Number of times the MySQL Shell checkForServerUpgrade utility was used. Added in MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell VSC - Dump`: Number of times a MySQL Shell for VS Code dump utility was used. Added in MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell VSC - Dump - Load`: Number of times a MySQL Shell for VS Code dump loading utility was used. Added in MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell VSC - HeatWave Chat`: Number of times the \chat prompt was executed in MySQL Shell for VS Code. Added in MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell VSC - Lakehouse Navigator`: Number of times the data loading process was launched in MySQL HeatWave Navigator. Added in MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell VSC - MRS`: Number of times a database operation is performed by MySQL REST Service. Added in MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell VSC - Natural Language to SQL`: Number of times the \nl command was executed in MySQL Shell for VS Code. Added in MySQL 9.5.0.

* `option_tracker_usage:MySQL Shell for VS Code`: Number of times a MySQL Shell for VS Code user session is created. Added in MySQL 9.5.0.

* `telemetry.otel_exporter_otlp_logs_secret_headers`: Name of a secret that contains the sensitive data for logs headers. Added in MySQL 9.5.0.

* `telemetry.otel_exporter_otlp_metrics_secret_headers`: Name of a secret that contains the sensitive data for metrics headers. Added in MySQL 9.5.0.

* `telemetry.otel_exporter_otlp_traces_secret_headers`: Name of a secret that contains the sensitive data for trace headers. Added in MySQL 9.5.0.

* `telemetry.resource_provider`: Name of the component to invoke that provides an implementation of the resource provider service. Added in MySQL 9.5.0.

* `telemetry.run_level`: Current initialization state of the Telemetry component. Added in MySQL 9.5.0.

* `telemetry.secret_provider`: Name of the component to invoke that provides an implementation of the secret provider service. Added in MySQL 9.5.0.

### Options and Variables Deprecated in MySQL 9.5

No system variables, status variables, or server options have been deprecated in MySQL 9.5.

### Options and Variables Removed in MySQL 9.5

The following system variables, status variables, and options have been removed in MySQL 9.5.

* `Rpl_semi_sync_master_clients`: Number of semisynchronous replicas. Removed in MySQL 9.5.0.

* `Rpl_semi_sync_master_net_avg_wait_time`: Average time source has waited for replies from replica. Removed in MySQL 9.5.0.

* `Rpl_semi_sync_master_net_wait_time`: Total time source has waited for replies from replica. Removed in MySQL 9.5.0.

* `Rpl_semi_sync_master_net_waits`: Total number of times source waited for replies from replica. Removed in MySQL 9.5.0.

* `Rpl_semi_sync_master_no_times`: Number of times source turned off semisynchronous replication. Removed in MySQL 9.5.0.

* `Rpl_semi_sync_master_no_tx`: Number of commits not acknowledged successfully. Removed in MySQL 9.5.0.

* `Rpl_semi_sync_master_status`: Whether semisynchronous replication is operational on source. Removed in MySQL 9.5.0.

* `Rpl_semi_sync_master_timefunc_failures`: Number of times source failed when calling time functions. Removed in MySQL 9.5.0.

* `Rpl_semi_sync_master_tx_avg_wait_time`: Average time source waited for each transaction. Removed in MySQL 9.5.0.

* `Rpl_semi_sync_master_tx_wait_time`: Total time source waited for transactions. Removed in MySQL 9.5.0.

* `Rpl_semi_sync_master_tx_waits`: Total number of times source waited for transactions. Removed in MySQL 9.5.0.

* `Rpl_semi_sync_master_wait_pos_backtraverse`: Total number of times source has waited for event with binary coordinates lower than events waited for previously. Removed in MySQL 9.5.0.

* `Rpl_semi_sync_master_wait_sessions`: Number of sessions currently waiting for replica replies. Removed in MySQL 9.5.0.

* `Rpl_semi_sync_master_yes_tx`: Number of commits acknowledged successfully. Removed in MySQL 9.5.0.

* `Rpl_semi_sync_slave_status`: Whether semisynchronous replication is operational on replica. Removed in MySQL 9.5.0.

* `group_replication_allow_local_lower_version_join`: Allow current server to join group even if it has lower plugin version than group. Removed in MySQL 9.5.0.

* `replica_parallel_type`: Tells replica to use timestamp information (LOGICAL_CLOCK) or database partitioning (DATABASE) to parallelize transactions. Removed in MySQL 9.5.0.

* `rpl_semi_sync_master_enabled`: Whether semisynchronous replication is enabled on source. Removed in MySQL 9.5.0.

* `rpl_semi_sync_master_timeout`: Number of milliseconds to wait for replica acknowledgment. Removed in MySQL 9.5.0.

* `rpl_semi_sync_master_trace_level`: Semisynchronous replication debug trace level on source. Removed in MySQL 9.5.0.

* `rpl_semi_sync_master_wait_for_slave_count`: Number of replica acknowledgments source must receive per transaction before proceeding. Removed in MySQL 9.5.0.

* `rpl_semi_sync_master_wait_point`: Wait point for replica transaction receipt acknowledgment. Removed in MySQL 9.5.0.

* `rpl_semi_sync_slave_enabled`: Whether semisynchronous replication is enabled on replica. Removed in MySQL 9.5.0.

* `rpl_semi_sync_slave_trace_level`: Semisynchronous replication debug trace level on replica. Removed in MySQL 9.5.0.

* `slave_parallel_type`: Tells replica to use timestamp information (LOGICAL_CLOCK) or database partioning (DATABASE) to parallelize transactions. Removed in MySQL 9.5.0.
