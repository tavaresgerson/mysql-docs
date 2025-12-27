### 5.4.3 The General Query Log

The general query log is a general record of what [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") is doing. The server writes information to this log when clients connect or disconnect, and it logs each SQL statement received from clients. The general query log can be very useful when you suspect an error in a client and want to know exactly what the client sent to [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

Each line that shows when a client connects also includes `using connection_type` to indicate the protocol used to establish the connection. *`connection_type`* is one of `TCP/IP` (TCP/IP connection established without SSL), `SSL/TLS` (TCP/IP connection established with SSL), `Socket` (Unix socket file connection), `Named Pipe` (Windows named pipe connection), or `Shared Memory` (Windows shared memory connection).

[**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") writes statements to the query log in the order that it receives them, which might differ from the order in which they are executed. This logging order is in contrast with that of the binary log, for which statements are written after they are executed but before any locks are released. In addition, the query log may contain statements that only select data while such statements are never written to the binary log.

When using statement-based binary logging on a replication source server, statements received by its replicas are written to the query log of each replica. Statements are written to the query log of the source if a client reads events with the [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") utility and passes them to the server.

However, when using row-based binary logging, updates are sent as row changes rather than SQL statements, and thus these statements are never written to the query log when [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) is `ROW`. A given update also might not be written to the query log when this variable is set to `MIXED`, depending on the statement used. See [Section 16.2.1.1, “Advantages and Disadvantages of Statement-Based and Row-Based Replication”](replication-sbr-rbr.html "16.2.1.1 Advantages and Disadvantages of Statement-Based and Row-Based Replication"), for more information.

By default, the general query log is disabled. To specify the initial general query log state explicitly, use [`--general_log[={0|1}]`](server-system-variables.html#sysvar_general_log). With no argument or an argument of 1, [`--general_log`](server-system-variables.html#sysvar_general_log) enables the log. With an argument of 0, this option disables the log. To specify a log file name, use [`--general_log_file=file_name`](server-system-variables.html#sysvar_general_log_file). To specify the log destination, use the [`log_output`](server-system-variables.html#sysvar_log_output) system variable (as described in [Section 5.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”](log-destinations.html "5.4.1 Selecting General Query Log and Slow Query Log Output Destinations")).

Note

If you specify the `TABLE` log destination, see [Log Tables and “Too many open files” Errors](log-destinations.html#log-destinations-tables-open-files "Log Tables and “Too many open files” Errors").

If you specify no name for the general query log file, the default name is `host_name.log`. The server creates the file in the data directory unless an absolute path name is given to specify a different directory.

To disable or enable the general query log or change the log file name at runtime, use the global [`general_log`](server-system-variables.html#sysvar_general_log) and [`general_log_file`](server-system-variables.html#sysvar_general_log_file) system variables. Set [`general_log`](server-system-variables.html#sysvar_general_log) to 0 (or `OFF`) to disable the log or to 1 (or `ON`) to enable it. Set [`general_log_file`](server-system-variables.html#sysvar_general_log_file) to specify the name of the log file. If a log file already is open, it is closed and the new file is opened.

When the general query log is enabled, the server writes output to any destinations specified by the [`log_output`](server-system-variables.html#sysvar_log_output) system variable. If you enable the log, the server opens the log file and writes startup messages to it. However, further logging of queries to the file does not occur unless the `FILE` log destination is selected. If the destination is `NONE`, the server writes no queries even if the general log is enabled. Setting the log file name has no effect on logging if the log destination value does not contain `FILE`.

Server restarts and log flushing do not cause a new general query log file to be generated (although flushing closes and reopens it). To rename the file and create a new one, use the following commands:

```sql
$> mv host_name.log host_name-old.log
$> mysqladmin flush-logs general
$> mv host_name-old.log backup-directory
```

On Windows, use **rename** rather than **mv**.

You can also rename the general query log file at runtime by disabling the log:

```sql
SET GLOBAL general_log = 'OFF';
```

With the log disabled, rename the log file externally (for example, from the command line). Then enable the log again:

```sql
SET GLOBAL general_log = 'ON';
```

This method works on any platform and does not require a server restart.

To disable or enable general query logging for the current session, set the session [`sql_log_off`](server-system-variables.html#sysvar_sql_log_off) variable to `ON` or `OFF`. (This assumes that the general query log itself is enabled.)

Passwords in statements written to the general query log are rewritten by the server not to occur literally in plain text. Password rewriting can be suppressed for the general query log by starting the server with the [`--log-raw`](server-options.html#option_mysqld_log-raw) option. This option may be useful for diagnostic purposes, to see the exact text of statements as received by the server, but for security reasons is not recommended for production use. See also [Section 6.1.2.3, “Passwords and Logging”](password-logging.html "6.1.2.3 Passwords and Logging").

An implication of password rewriting is that statements that cannot be parsed (due, for example, to syntax errors) are not written to the general query log because they cannot be known to be password free. Use cases that require logging of all statements including those with errors should use the [`--log-raw`](server-options.html#option_mysqld_log-raw) option, bearing in mind that this also bypasses password rewriting.

Password rewriting occurs only when plain text passwords are expected. For statements with syntax that expect a password hash value, no rewriting occurs. If a plain text password is supplied erroneously for such syntax, the password is logged as given, without rewriting. For example, the following statement is logged as shown because a password hash value is expected:

```sql
CREATE USER 'user1'@'localhost' IDENTIFIED BY PASSWORD 'not-so-secret';
```

The [`log_timestamps`](server-system-variables.html#sysvar_log_timestamps) system variable controls the time zone of timestamps in messages written to the general query log file (as well as to the slow query log file and the error log). It does not affect the time zone of general query log and slow query log messages written to log tables, but rows retrieved from those tables can be converted from the local system time zone to any desired time zone with [`CONVERT_TZ()`](date-and-time-functions.html#function_convert-tz) or by setting the session [`time_zone`](server-system-variables.html#sysvar_time_zone) system variable.
