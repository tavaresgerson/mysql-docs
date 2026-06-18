### 29.12.21 Performance Schema Miscellaneous Tables

[29.12.21.1 The component\_scheduler\_tasks Table](performance-schema-component-scheduler-tasks-table.html)

[29.12.21.2 The error\_log Table](performance-schema-error-log-table.html)

[29.12.21.3 The host\_cache Table](performance-schema-host-cache-table.html)

[29.12.21.4 The innodb\_redo\_log\_files Table](performance-schema-innodb-redo-log-files-table.html)

[29.12.21.5 The log\_status Table](performance-schema-log-status-table.html)

[29.12.21.6 The performance\_timers Table](performance-schema-performance-timers-table.html)

[29.12.21.7 The processlist Table](performance-schema-processlist-table.html)

[29.12.21.8 The threads Table](performance-schema-threads-table.html)

[29.12.21.9 The tls\_channel\_status Table](performance-schema-tls-channel-status-table.html)

[29.12.21.10 The user\_defined\_functions Table](performance-schema-user-defined-functions-table.html)

The following sections describe tables that do not fall into the
table categories discussed in the preceding sections:

* [`component_scheduler_tasks`](performance-schema-component-scheduler-tasks-table.html "29.12.21.1 The component_scheduler_tasks Table"): The
  current status of each scheduled task.

* [`error_log`](performance-schema-error-log-table.html "29.12.21.2 The error_log Table"): The most recent
  events written to the error log.

* [`host_cache`](performance-schema-host-cache-table.html "29.12.21.3 The host_cache Table"): Information from
  the internal host cache.

* [`innodb_redo_log_files`](performance-schema-innodb-redo-log-files-table.html "29.12.21.4 The innodb_redo_log_files Table"):
  Information about InnoDB redo log files.

* [`log_status`](performance-schema-log-status-table.html "29.12.21.5 The log_status Table"): Information about
  server logs for backup purposes.

* [`performance_timers`](performance-schema-performance-timers-table.html "29.12.21.6 The performance_timers Table"): Which event
  timers are available.

* [`processlist`](performance-schema-processlist-table.html "29.12.21.7 The processlist Table"): Information about
  server processes.

* [`threads`](performance-schema-threads-table.html "29.12.21.8 The threads Table"): Information about
  server threads.

* [`tls_channel_status`](performance-schema-tls-channel-status-table.html "29.12.21.9 The tls_channel_status Table"): TLS context
  properties for connection interfaces.

* [`user_defined_functions`](performance-schema-user-defined-functions-table.html "29.12.21.10 The user_defined_functions Table"):
  Loadable functions registered by a component, plugin, or
  [`CREATE
  FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions") statement.