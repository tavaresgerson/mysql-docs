### 29.12.22 Performance Schema Miscellaneous Tables

29.12.22.1 The component_scheduler_tasks Table

29.12.22.2 The connection_control_failed_login_attempts Table

29.12.22.3 The error_log Table

29.12.22.4 The host_cache Table

29.12.22.5 The innodb_redo_log_files Table

29.12.22.6 The log_status Table

29.12.22.7 The mysql_option Table

29.12.22.8 The performance_timers Table

29.12.22.9 The processlist Table

29.12.22.10 The threads Table

29.12.22.11 The tls_channel_status Table

29.12.22.12 The user_defined_functions Table

The following sections describe tables that do not fall into the table categories discussed in the preceding sections:

* `component_scheduler_tasks`: The current status of each scheduled task.

* `connection_control_failed_login_attempts`: The current number of consecutive failed connection attempts per account.

* `error_log`: The most recent events written to the error log.

* `host_cache`: Information from the internal host cache.

* `innodb_redo_log_files`: Information about InnoDB redo log files.

* `log_status`: Information about server logs for backup purposes.

* `mysql_option`: Information about features available in the MySQL Server.

* `performance_timers`: Which event timers are available.

* `processlist`: Information about server processes.

* `threads`: Information about server threads.

* `tls_channel_status`: TLS context properties for connection interfaces.

* `user_defined_functions`: Loadable functions registered by a component, plugin, or `CREATE FUNCTION` statement.
