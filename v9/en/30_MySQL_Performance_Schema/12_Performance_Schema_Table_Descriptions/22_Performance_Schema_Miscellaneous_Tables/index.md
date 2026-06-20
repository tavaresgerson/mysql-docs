### 29.12.22 Performance Schema Miscellaneous Tables

The following sections describe tables that do not fall into the
table categories discussed in the preceding sections:

* [`component_scheduler_tasks`](performance-schema-component-scheduler-tasks-table.html "29.12.22.1 The component_scheduler_tasks Table"): The
  current status of each scheduled task.

* [`connection_control_failed_login_attempts`](performance-schema-connection-control-failed-login-attempts-table.html "29.12.22.2 The connection_control_failed_login_attempts Table"):
  The current number of consecutive failed connection attempts
  per account.

* [`error_log`](performance-schema-error-log-table.html "29.12.22.3 The error_log Table"): The most recent
  events written to the error log.

* [`host_cache`](performance-schema-host-cache-table.html "29.12.22.4 The host_cache Table"): Information from
  the internal host cache.

* [`innodb_redo_log_files`](performance-schema-innodb-redo-log-files-table.html "29.12.22.5 The innodb_redo_log_files Table"):
  Information about InnoDB redo log files.

* [`log_status`](performance-schema-log-status-table.html "29.12.22.6 The log_status Table"): Information about
  server logs for backup purposes.

* [`mysql_option`](performance-schema-mysql-option-table.html "29.12.22.7 The mysql_option Table"): Information about
  features available in the MySQL Server.

* [`performance_timers`](performance-schema-performance-timers-table.html "29.12.22.8 The performance_timers Table"): Which event
  timers are available.

* [`processlist`](performance-schema-processlist-table.html "29.12.22.9 The processlist Table"): Information about
  server processes.

* [`threads`](performance-schema-threads-table.html "29.12.22.10 The threads Table"): Information about
  server threads.

* [`tls_channel_status`](performance-schema-tls-channel-status-table.html "29.12.22.11 The tls_channel_status Table"): TLS context
  properties for connection interfaces.

* [`user_defined_functions`](performance-schema-user-defined-functions-table.html "29.12.22.12 The user_defined_functions Table"):
  Loadable functions registered by a component, plugin, or
  [`CREATE
  FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions") statement.