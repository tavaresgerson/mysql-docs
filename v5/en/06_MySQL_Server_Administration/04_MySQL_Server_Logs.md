## 5.4 MySQL Server Logs

MySQL Server has several logs that can help you find out what activity is taking place.

<table summary="MySQL Server log types and the information written to each log.">
  <col style="width: 30%"/>
  <col style="width: 70%"/>
  <thead>
    <tr>
      <th>Log Type</th>
      <th>Information Written to Log</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Error log</td>
      <td>Problems encountered starting, running, or stopping <strong>mysqld</strong></td>
    </tr>
    <tr>
      <td>General query log</td>
      <td>Established client connections and statements received from clients</td>
    </tr>
    <tr>
      <td>Binary log</td>
      <td>Statements that change data (also used for replication)</td>
    </tr>
    <tr>
      <td>Relay log</td>
      <td>Data changes received from a replication source server</td>
    </tr>
    <tr>
      <td>Slow query log</td>
      <td>Queries that took more than <code>long_query_time</code> seconds to execute</td>
    </tr>
    <tr>
      <td>DDL log (metadata log)</td>
      <td>Metadata operations performed by DDL statements</td>
    </tr>
  </tbody>
</table>

By default, no logs are enabled, except the error log on Windows. (The DDL log is always created when required, and has no user-configurable options; see Section 5.4.6, “The DDL Log”.) The following log-specific sections provide information about the server options that enable logging.

By default, the server writes files for all enabled logs in the data directory. You can force the server to close and reopen the log files (or in some cases switch to a new log file) by flushing the logs. Log flushing occurs when you issue a `FLUSH LOGS` statement; execute **mysqladmin** with a `flush-logs` or `refresh` argument; or execute **mysqldump** with a `--flush-logs` option. See Section 13.7.6.3, “FLUSH Statement”, Section 4.5.2, “mysqladmin — A MySQL Server Administration Program”, and Section 4.5.4, “mysqldump — A Database Backup Program”. In addition, the binary log is flushed when its size reaches the value of the `max_binlog_size` system variable.

You can control the general query and slow query logs during runtime. You can enable or disable logging, or change the log file name. You can tell the server to write general query and slow query entries to log tables, log files, or both. For details, see Section 5.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”, Section 5.4.3, “The General Query Log”, and Section 5.4.5, “The Slow Query Log”.

The relay log is used only on replicas, to hold data changes from the replication source server that must also be made on the replica. For discussion of relay log contents and configuration, see Section 16.2.4.1, “The Relay Log”.

For information about log maintenance operations such as expiration of old log files, see Section 5.4.7, “Server Log Maintenance”.

For information about keeping logs secure, see Section 6.1.2.3, “Passwords and Logging”.

### 5.4.1 Selecting General Query Log and Slow Query Log Output Destinations

MySQL Server provides flexible control over the destination of output written to the general query log and the slow query log, if those logs are enabled. Possible destinations for log entries are log files or the `general_log` and `slow_log` tables in the `mysql` system database. File output, table output, or both can be selected.

* Log Control at Server Startup
* Log Control at Runtime
* Log Table Benefits and Characteristics

#### Log Control at Server Startup

The `log_output` system variable specifies the destination for log output. Setting this variable does not in itself enable the logs; they must be enabled separately.

* If `log_output` is not specified at startup, the default logging destination is `FILE`.

* If `log_output` is specified at startup, its value is a list one or more comma-separated words chosen from `TABLE` (log to tables), `FILE` (log to files), or `NONE` (do not log to tables or files). `NONE`, if present, takes precedence over any other specifiers.

The `general_log` system variable controls logging to the general query log for the selected log destinations. If specified at server startup, `general_log` takes an optional argument of 1 or 0 to enable or disable the log. To specify a file name other than the default for file logging, set the `general_log_file` variable. Similarly, the `slow_query_log` variable controls logging to the slow query log for the selected destinations and setting `slow_query_log_file` specifies a file name for file logging. If either log is enabled, the server opens the corresponding log file and writes startup messages to it. However, further logging of queries to the file does not occur unless the `FILE` log destination is selected.

Examples:

* To write general query log entries to the log table and the log file, use `--log_output=TABLE,FILE` to select both log destinations and `--general_log` to enable the general query log.

* To write general and slow query log entries only to the log tables, use `--log_output=TABLE` to select tables as the log destination and `--general_log` and `--slow_query_log` to enable both logs.

* To write slow query log entries only to the log file, use `--log_output=FILE` to select files as the log destination and `--slow_query_log` to enable the slow query log. In this case, because the default log destination is `FILE`, you could omit the `log_output` setting.

#### Log Control at Runtime

The system variables associated with log tables and files enable runtime control over logging:

* The `log_output` variable indicates the current logging destination. It can be modified at runtime to change the destination.

* The `general_log` and `slow_query_log` variables indicate whether the general query log and slow query log are enabled (`ON`) or disabled (`OFF`). You can set these variables at runtime to control whether the logs are enabled.

* The `general_log_file` and `slow_query_log_file` variables indicate the names of the general query log and slow query log files. You can set these variables at server startup or at runtime to change the names of the log files.

* To disable or enable general query logging for the current session, set the session `sql_log_off` variable to `ON` or `OFF`. (This assumes that the general query log itself is enabled.)

#### Log Table Benefits and Characteristics

The use of tables for log output offers the following benefits:

* Log entries have a standard format. To display the current structure of the log tables, use these statements:

  ```sql
  SHOW CREATE TABLE mysql.general_log;
  SHOW CREATE TABLE mysql.slow_log;
  ```

* Log contents are accessible through SQL statements. This enables the use of queries that select only those log entries that satisfy specific criteria. For example, to select log contents associated with a particular client (which can be useful for identifying problematic queries from that client), it is easier to do this using a log table than a log file.

* Logs are accessible remotely through any client that can connect to the server and issue queries (if the client has the appropriate log table privileges). It is not necessary to log in to the server host and directly access the file system.

The log table implementation has the following characteristics:

* In general, the primary purpose of log tables is to provide an interface for users to observe the runtime execution of the server, not to interfere with its runtime execution.

* `CREATE TABLE`, `ALTER TABLE`, and `DROP TABLE` are valid operations on a log table. For `ALTER TABLE` and `DROP TABLE`, the log table cannot be in use and must be disabled, as described later.

* By default, the log tables use the `CSV` storage engine that writes data in comma-separated values format. For users who have access to the `.CSV` files that contain log table data, the files are easy to import into other programs such as spreadsheets that can process CSV input.

  The log tables can be altered to use the `MyISAM` storage engine. You cannot use `ALTER TABLE` to alter a log table that is in use. The log must be disabled first. No engines other than `CSV` or `MyISAM` are legal for the log tables.

  **Log Tables and “Too many open files” Errors.** If you select `TABLE` as a log destination and the log tables use the `CSV` storage engine, you may find that disabling and enabling the general query log or slow query log repeatedly at runtime results in a number of open file descriptors for the `.CSV` file, possibly resulting in a “Too many open files” error. To work around this issue, execute `FLUSH TABLES` or ensure that the value of `open_files_limit` is greater than the value of `table_open_cache_instances`.

* To disable logging so that you can alter (or drop) a log table, you can use the following strategy. The example uses the general query log; the procedure for the slow query log is similar but uses the `slow_log` table and `slow_query_log` system variable.

  ```sql
  SET @old_log_state = @@GLOBAL.general_log;
  SET GLOBAL general_log = 'OFF';
  ALTER TABLE mysql.general_log ENGINE = MyISAM;
  SET GLOBAL general_log = @old_log_state;
  ```

* `TRUNCATE TABLE` is a valid operation on a log table. It can be used to expire log entries.

* `RENAME TABLE` is a valid operation on a log table. You can atomically rename a log table (to perform log rotation, for example) using the following strategy:

  ```sql
  USE mysql;
  DROP TABLE IF EXISTS general_log2;
  CREATE TABLE general_log2 LIKE general_log;
  RENAME TABLE general_log TO general_log_backup, general_log2 TO general_log;
  ```

* `CHECK TABLE` is a valid operation on a log table.

* `LOCK TABLES` cannot be used on a log table.

* `INSERT`, `DELETE`, and `UPDATE` cannot be used on a log table. These operations are permitted only internally to the server itself.

* `FLUSH TABLES WITH READ LOCK` and the state of the `read_only` system variable have no effect on log tables. The server can always write to the log tables.

* Entries written to the log tables are not written to the binary log and thus are not replicated to replicas.

* To flush the log tables or log files, use `FLUSH TABLES` or `FLUSH LOGS`, respectively.

* Partitioning of log tables is not permitted.
  
* A **mysqldump** dump includes statements to recreate those tables so that they are not missing after reloading the dump file. Log table contents are not dumped.

### 5.4.2 The Error Log

This section discusses how to configure the MySQL server for logging of diagnostic messages to the error log. For information about selecting the error message character set and language, see Section 10.6, “Error Message Character Set”, and Section 10.12, “Setting the Error Message Language”.

The error log contains a record of `mysqld` startup and shutdown times. It also contains diagnostic messages such as errors, warnings, and notes that occur during server startup and shutdown, and while the server is running. For example, if `mysqld` notices that a table needs to be automatically checked or repaired, it writes a message to the error log.

On some operating systems, the error log contains a stack trace if `mysqld` exits abnormally. The trace can be used to determine where `mysqld` exited. See Section 5.8, “Debugging MySQL”.

If used to start `mysqld`, `mysqld_safe` may write messages to the error log. For example, when `mysqld_safe` notices abnormal `mysqld` exits, it restarts `mysqld` and writes a `mysqld restarted` message to the error log.

The following sections discuss aspects of configuring error logging. In the discussion, “console” means `stderr`, the standard error output. This is your terminal or console window unless the standard error output has been redirected to a different destination.

The server interprets options that determine where to write error messages somewhat differently for Windows and Unix systems. Be sure to configure error logging using the information appropriate to your platform.

#### 5.4.2.1 Error Logging on Windows

On Windows, `mysqld` uses the `--log-error`, `--pid-file`, and `--console` options to determine whether `mysqld` writes the error log to the console or a file, and, if to a file, the file name:

* If `--console` is given, `mysqld` writes the error log to the console. (`--console` takes precedence over `--log-error` if both are given, and the following items regarding `--log-error` do not apply. Prior to MySQL 5.7, this is reversed: `--log-error` takes precedence over `--console`.)

* If `--log-error` is not given, or is given without naming a file, `mysqld` writes the error log to a file named `host_name.err` in the data directory, unless the `--pid-file` option is specified. In that case, the file name is the PID file base name with a suffix of `.err` in the data directory.

* If `--log-error` is given to name a file, `mysqld` writes the error log to that file (with an `.err` suffix added if the name has no suffix). The file location is under the data directory unless an absolute path name is given to specify a different location.

If the server writes the error log to the console, it sets the `log_error` system variable to `stderr`. Otherwise, the server writes the error log to a file and sets `log_error` to the file name.

In addition, the server by default writes events and error messages to the Windows Event Log within the Application log:

* Entries marked as `Error`, `Warning`, and `Note` are written to the Event Log, but not messages such as information statements from individual storage engines.

* Event Log entries have a source of `MySQL`.
* Information written to the Event Log is controlled using the `log_syslog` system variable, which on Windows is enabled by default. See Section 5.4.2.3, “Error Logging to the System Log”.

#### 5.4.2.2 Error Logging on Unix and Unix-Like Systems

On Unix and Unix-like systems, `mysqld` uses the `--log-error` option to determine whether `mysqld` writes the error log to the console or a file, and, if to a file, the file name:

* If `--log-error` is not given, `mysqld` writes the error log to the console.

* If `--log-error` is given without naming a file, `mysqld` writes the error log to a file named `host_name.err` in the data directory.

* If `--log-error` is given to name a file, `mysqld` writes the error log to that file (with an `.err` suffix added if the name has no suffix). The file location is under the data directory unless an absolute path name is given to specify a different location.

* If `--log-error` is given in an option file in a `[mysqld]`, `[server]`, or `[mysqld_safe]` section, on systems that use `mysqld_safe` to start the server, `mysqld_safe` finds and uses the option, and passes it to `mysqld`.

Note

It is common for Yum or APT package installations to configure an error log file location under `/var/log` with an option like `log-error=/var/log/mysqld.log` in a server configuration file. Removing the path name from the option causes the `host_name.err` file in the data directory to be used.

If the server writes the error log to the console, it sets the `log_error` system variable to `stderr`. Otherwise, the server writes the error log to a file and sets `log_error` to the file name.

#### 5.4.2.3 Error Logging to the System Log

It is possible to have `mysqld` write the error log to the system log (the Event Log on Windows, and `syslog` on Unix and Unix-like systems). To do so, use these system variables:

* `log_syslog`: Enable this variable to send the error log to the system log. (On Windows, `log_syslog` is enabled by default.)

  If `log_syslog` is enabled, the following system variables can also be used for finer control.

* `log_syslog_facility`: The default facility for `syslog` messages is `daemon`. Set this variable to specify a different facility.

* `log_syslog_include_pid`: Whether to include the server process ID in each line of `syslog` output.

* `log_syslog_tag`: This variable defines a tag to add to the server identifier (`mysqld`) in `syslog` messages. If defined, the tag is appended to the identifier with a leading hyphen.

Note

Error logging to the system log may require additional system configuration. Consult the system log documentation for your platform.

On Unix and Unix-like systems, control of output to `syslog` is also available using `mysqld_safe`, which can capture server error output and pass it to `syslog`.

Note

Using `mysqld_safe` for `syslog` error logging is deprecated; you should use the server system variables instead.

`mysqld_safe` has three error-logging options, `--syslog`, `--skip-syslog`, and `--log-error`. The default with no logging options or with `--skip-syslog` is to use the default log file. To explicitly specify use of an error log file, specify `--log-error=file_name` to `mysqld_safe`, which then arranges for `mysqld` to write messages to a log file. To use `syslog`, specify the `--syslog` option. For `syslog` output, a tag can be specified with `--syslog-tag=tag_val`; this is appended to the `mysqld` server identifier with a leading hyphen.

#### 5.4.2.4 Error Log Filtering

The `log_error_verbosity` system variable controls server verbosity for writing error, warning, and note messages to the error log. Permitted values are 1 (errors only), 2 (errors and warnings), 3 (errors, warnings, and notes), with a default of 3. If the value is greater than 2, the server logs aborted connections and access-denied errors for new connection attempts. See Section B.3.2.9, “Communication Errors and Aborted Connections”.

#### 5.4.2.5 Error Log Output Format

The ID included in error log messages is that of the thread within `mysqld` responsible for writing the message. This indicates which part of the server produced the message, and is consistent with general query log and slow query log messages, which include the connection thread ID.

The `log_timestamps` system variable controls the time zone of timestamps in messages written to the error log (as well as to general query log and slow query log files).

Permitted `log_timestamps` values are `UTC` (the default) and `SYSTEM` (the local system time zone). Timestamps are written using ISO 8601 / RFC 3339 format: `YYYY-MM-DDThh:mm:ss.uuuuuu` plus a tail value of `Z` signifying Zulu time (UTC) or `±hh:mm` (an offset that indicates the local system time zone adjustment relative to UTC). For example:

```sql
2020-08-07T15:02:00.832521Z            (UTC)
2020-08-07T10:02:00.832521-05:00       (SYSTEM)
```

#### 5.4.2.6 Error Log File Flushing and Renaming

If you flush the error log using a `FLUSH ERROR LOGS` or `FLUSH LOGS` statment, or a **mysqladmin flush-logs** command, the server closes and reopens any error log file to which it is writing. To rename an error log file, do so manually before flushing. Flushing the logs then opens a new file with the original file name. For example, assuming a log file name of `host_name.err`, use the following commands to rename the file and create a new one:

```sql
mv host_name.err host_name.err-old
mysqladmin flush-logs error
mv host_name.err-old backup-directory
```

On Windows, use **rename** rather than **mv**.

If the location of the error log file is not writable by the server, the log-flushing operation fails to create a new log file. For example, on Linux, the server might write the error log to the `/var/log/mysqld.log` file, where the `/var/log` directory is owned by `root` and is not writable by `mysqld`. For information about handling this case, see Section 5.4.7, “Server Log Maintenance”.

If the server is not writing to a named error log file, no error log file renaming occurs when the error log is flushed.

### 5.4.3 The General Query Log

The general query log is a general record of what `mysqld` is doing. The server writes information to this log when clients connect or disconnect, and it logs each SQL statement received from clients. The general query log can be very useful when you suspect an error in a client and want to know exactly what the client sent to `mysqld`.

Each line that shows when a client connects also includes `using connection_type` to indicate the protocol used to establish the connection. *`connection_type`* is one of `TCP/IP` (TCP/IP connection established without SSL), `SSL/TLS` (TCP/IP connection established with SSL), `Socket` (Unix socket file connection), `Named Pipe` (Windows named pipe connection), or `Shared Memory` (Windows shared memory connection).

`mysqld` writes statements to the query log in the order that it receives them, which might differ from the order in which they are executed. This logging order is in contrast with that of the binary log, for which statements are written after they are executed but before any locks are released. In addition, the query log may contain statements that only select data while such statements are never written to the binary log.

When using statement-based binary logging on a replication source server, statements received by its replicas are written to the query log of each replica. Statements are written to the query log of the source if a client reads events with the **mysqlbinlog** utility and passes them to the server.

However, when using row-based binary logging, updates are sent as row changes rather than SQL statements, and thus these statements are never written to the query log when `binlog_format` is `ROW`. A given update also might not be written to the query log when this variable is set to `MIXED`, depending on the statement used. See Section 16.2.1.1, “Advantages and Disadvantages of Statement-Based and Row-Based Replication”, for more information.

By default, the general query log is disabled. To specify the initial general query log state explicitly, use `--general_log[={0|1}]`. With no argument or an argument of 1, `--general_log` enables the log. With an argument of 0, this option disables the log. To specify a log file name, use `--general_log_file=file_name`. To specify the log destination, use the `log_output` system variable (as described in Section 5.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”).

Note

If you specify the `TABLE` log destination, see Log Tables and “Too many open files” Errors.

If you specify no name for the general query log file, the default name is `host_name.log`. The server creates the file in the data directory unless an absolute path name is given to specify a different directory.

To disable or enable the general query log or change the log file name at runtime, use the global `general_log` and `general_log_file` system variables. Set `general_log` to 0 (or `OFF`) to disable the log or to 1 (or `ON`) to enable it. Set `general_log_file` to specify the name of the log file. If a log file already is open, it is closed and the new file is opened.

When the general query log is enabled, the server writes output to any destinations specified by the `log_output` system variable. If you enable the log, the server opens the log file and writes startup messages to it. However, further logging of queries to the file does not occur unless the `FILE` log destination is selected. If the destination is `NONE`, the server writes no queries even if the general log is enabled. Setting the log file name has no effect on logging if the log destination value does not contain `FILE`.

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

To disable or enable general query logging for the current session, set the session `sql_log_off` variable to `ON` or `OFF`. (This assumes that the general query log itself is enabled.)

Passwords in statements written to the general query log are rewritten by the server not to occur literally in plain text. Password rewriting can be suppressed for the general query log by starting the server with the `--log-raw` option. This option may be useful for diagnostic purposes, to see the exact text of statements as received by the server, but for security reasons is not recommended for production use. See also Section 6.1.2.3, “Passwords and Logging”.

An implication of password rewriting is that statements that cannot be parsed (due, for example, to syntax errors) are not written to the general query log because they cannot be known to be password free. Use cases that require logging of all statements including those with errors should use the `--log-raw` option, bearing in mind that this also bypasses password rewriting.

Password rewriting occurs only when plain text passwords are expected. For statements with syntax that expect a password hash value, no rewriting occurs. If a plain text password is supplied erroneously for such syntax, the password is logged as given, without rewriting. For example, the following statement is logged as shown because a password hash value is expected:

```sql
CREATE USER 'user1'@'localhost' IDENTIFIED BY PASSWORD 'not-so-secret';
```

The `log_timestamps` system variable controls the time zone of timestamps in messages written to the general query log file (as well as to the slow query log file and the error log). It does not affect the time zone of general query log and slow query log messages written to log tables, but rows retrieved from those tables can be converted from the local system time zone to any desired time zone with `CONVERT_TZ()` or by setting the session `time_zone` system variable.

### 5.4.4 The Binary Log

The binary log contains “events” that describe database changes such as table creation operations or changes to table data. It also contains events for statements that potentially could have made changes (for example, a `DELETE` which matched no rows), unless row-based logging is used. The binary log also contains information about how long each statement took that updated data. The binary log has two important purposes:

* For replication, the binary log on a replication source server provides a record of the data changes to be sent to replicas. The source sends the events contained in its binary log to its replicas, which execute those events to make the same data changes that were made on the source. See Section 16.2, “Replication Implementation”.

* Certain data recovery operations require use of the binary log. After a backup has been restored, the events in the binary log that were recorded after the backup was made are re-executed. These events bring databases up to date from the point of the backup. See Section 7.5, “Point-in-Time (Incremental) Recovery” Recovery").

The binary log is not used for statements such as `SELECT` or `SHOW` that do not modify data. To log all statements (for example, to identify a problem query), use the general query log. See Section 5.4.3, “The General Query Log”.

Running a server with binary logging enabled makes performance slightly slower. However, the benefits of the binary log in enabling you to set up replication and for restore operations generally outweigh this minor performance decrement.

The binary log is generally resilient to unexpected halts because only complete transactions are logged or read back. See Section 16.3.2, “Handling an Unexpected Halt of a Replica” for more information.

Passwords in statements written to the binary log are rewritten by the server not to occur literally in plain text. See also Section 6.1.2.3, “Passwords and Logging”.

The following discussion describes some of the server options and variables that affect the operation of binary logging. For a complete list, see Section 16.1.6.4, “Binary Logging Options and Variables”.

To enable the binary log, start the server with the `--log-bin[=base_name]` option. If no *`base_name`* value is given, the default name is the value of the `--pid-file` option (which by default is the name of host machine) followed by `-bin`. If the base name is given, the server writes the file in the data directory unless the base name is given with a leading absolute path name to specify a different directory. It is recommended that you specify a base name explicitly rather than using the default of the host name; see Section B.3.7, “Known Issues in MySQL”, for the reason.

If you supply an extension in the log name (for example, `--log-bin=base_name.extension`), the extension is silently removed and ignored.

`mysqld` appends a numeric extension to the binary log base name to generate binary log file names. The number increases each time the server creates a new log file, thus creating an ordered series of files. The server creates a new file in the series each time any of the following events occurs:

* The server is started or restarted
* The server flushes the logs.
* The size of the current log file reaches `max_binlog_size`.

A binary log file may become larger than `max_binlog_size` if you are using large transactions because a transaction is written to the file in one piece, never split between files.

To keep track of which binary log files have been used, `mysqld` also creates a binary log index file that contains the names of the binary log files. By default, this has the same base name as the binary log file, with the extension `'.index'`. You can change the name of the binary log index file with the `--log-bin-index[=file_name]` option. You should not manually edit this file while `mysqld` is running; doing so would confuse `mysqld`.

The term “binary log file” generally denotes an individual numbered file containing database events. The term “binary log” collectively denotes the set of numbered binary log files plus the index file.

A client that has privileges sufficient to set restricted session system variables (see Section 5.1.8.1, “System Variable Privileges”) can disable binary logging of its own statements by using a `SET sql_log_bin=OFF` statement.

By default, the server logs the length of the event as well as the event itself and uses this to verify that the event was written correctly. You can also cause the server to write checksums for the events by setting the `binlog_checksum` system variable. When reading back from the binary log, the source uses the event length by default, but can be made to use checksums if available by enabling the `master_verify_checksum` system variable. The replication I/O thread also verifies events received from the source. You can cause the replication SQL thread to use checksums if available when reading from the relay log by enabling the `slave_sql_verify_checksum` system variable.

The format of the events recorded in the binary log is dependent on the binary logging format. Three format types are supported, row-based logging, statement-based logging and mixed-base logging. The binary logging format used depends on the MySQL version. For general descriptions of the logging formats, see Section 5.4.4.1, “Binary Logging Formats”. For detailed information about the format of the binary log, see MySQL Internals: The Binary Log.

The server evaluates the `--binlog-do-db` and `--binlog-ignore-db` options in the same way as it does the `--replicate-do-db` and `--replicate-ignore-db` options. For information about how this is done, see Section 16.2.5.1, “Evaluation of Database-Level Replication and Binary Logging Options”.

A replica by default does not write to its own binary log any data modifications that are received from the source. To log these modifications, start the replica with the `--log-slave-updates` option in addition to the `--log-bin` option (see Section 16.1.6.3, “Replica Server Options and Variables”). This is done when a replica is also to act as a source to other replicas in chained replication.

You can delete all binary log files with the `RESET MASTER` statement, or a subset of them with `PURGE BINARY LOGS`. See Section 13.7.6.6, “RESET Statement”, and Section 13.4.1.1, “PURGE BINARY LOGS Statement”.

If you are using replication, you should not delete old binary log files on the source until you are sure that no replica still needs to use them. For example, if your replicas never run more than three days behind, once a day you can execute **mysqladmin flush-logs binary** on the source and then remove any logs that are more than three days old. You can remove the files manually, but it is preferable to use `PURGE BINARY LOGS`, which also safely updates the binary log index file for you (and which can take a date argument). See Section 13.4.1.1, “PURGE BINARY LOGS Statement”.

You can display the contents of binary log files with the **mysqlbinlog** utility. This can be useful when you want to reprocess statements in the log for a recovery operation. For example, you can update a MySQL server from the binary log as follows:

```sql
$> mysqlbinlog log_file | mysql -h server_name
```

**mysqlbinlog** also can be used to display relay log file contents because they are written using the same format as binary log files. For more information on the **mysqlbinlog** utility and how to use it, see Section 4.6.7, “mysqlbinlog — Utility for Processing Binary Log Files”. For more information about the binary log and recovery operations, see Section 7.5, “Point-in-Time (Incremental) Recovery” Recovery").

Binary logging is done immediately after a statement or transaction completes but before any locks are released or any commit is done. This ensures that the log is logged in commit order.

Updates to nontransactional tables are stored in the binary log immediately after execution.

Within an uncommitted transaction, all updates (`UPDATE`, `DELETE`, or `INSERT`) that change transactional tables such as `InnoDB` tables are cached until a `COMMIT` statement is received by the server. At that point, `mysqld` writes the entire transaction to the binary log before the `COMMIT` is executed.

Modifications to nontransactional tables cannot be rolled back. If a transaction that is rolled back includes modifications to nontransactional tables, the entire transaction is logged with a `ROLLBACK` statement at the end to ensure that the modifications to those tables are replicated.

When a thread that handles the transaction starts, it allocates a buffer of `binlog_cache_size` to buffer statements. If a statement is bigger than this, the thread opens a temporary file to store the transaction. The temporary file is deleted when the thread ends.

The `Binlog_cache_use` status variable shows the number of transactions that used this buffer (and possibly a temporary file) for storing statements. The `Binlog_cache_disk_use` status variable shows how many of those transactions actually had to use a temporary file. These two variables can be used for tuning `binlog_cache_size` to a large enough value that avoids the use of temporary files.

The `max_binlog_cache_size` system variable (default 4GB, which is also the maximum) can be used to restrict the total size used to cache a multiple-statement transaction. If a transaction is larger than this many bytes, it fails and rolls back. The minimum value is 4096.

If you are using the binary log and row based logging, concurrent inserts are converted to normal inserts for `CREATE ... SELECT` or `INSERT ... SELECT` statements. This is done to ensure that you can re-create an exact copy of your tables by applying the log during a backup operation. If you are using statement-based logging, the original statement is written to the log.

The binary log format has some known limitations that can affect recovery from backups. See Section 16.4.1, “Replication Features and Issues”.

Binary logging for stored programs is done as described in Section 23.7, “Stored Program Binary Logging”.

Note that the binary log format differs in MySQL 5.7 from previous versions of MySQL, due to enhancements in replication. See Section 16.4.2, “Replication Compatibility Between MySQL Versions”.

If the server is unable to write to the binary log, flush binary log files, or synchronize the binary log to disk, the binary log on the source can become inconsistent and replicas can lose synchronization with the source. The `binlog_error_action` system variable controls the action taken if an error of this type is encountered with the binary log.

* The default setting, `ABORT_SERVER`, makes the server halt binary logging and shut down. At this point, you can identify and correct the cause of the error. On restart, recovery proceeds as in the case of an unexpected server halt (see Section 16.3.2, “Handling an Unexpected Halt of a Replica”).

* The setting `IGNORE_ERROR` provides backward compatibility with older versions of MySQL. With this setting, the server continues the ongoing transaction and logs the error, then halts binary logging, but continues to perform updates. At this point, you can identify and correct the cause of the error. To resume binary logging, `log_bin` must be enabled again, which requires a server restart. Only use this option if you require backward compatibility, and the binary log is non-essential on this MySQL server instance. For example, you might use the binary log only for intermittent auditing or debugging of the server, and not use it for replication from the server or rely on it for point-in-time restore operations.

By default, the binary log is synchronized to disk at each write (`sync_binlog=1`). If `sync_binlog` was not enabled, and the operating system or machine (not only the MySQL server) crashed, there is a chance that the last statements of the binary log could be lost. To prevent this, enable the `sync_binlog` system variable to synchronize the binary log to disk after every *`N`* commit groups. See Section 5.1.7, “Server System Variables”. The safest value for `sync_binlog` is 1 (the default), but this is also the slowest.

For example, if you are using `InnoDB` tables and the MySQL server processes a `COMMIT` statement, it writes many prepared transactions to the binary log in sequence, synchronizes the binary log, and then commits this transaction into `InnoDB`. If the server unexpectedly exits between those two operations, the transaction is rolled back by `InnoDB` at restart but still exists in the binary log. Such an issue is resolved assuming `--innodb_support_xa` is set to 1, the default. Although this option is related to the support of XA transactions in `InnoDB`, it also ensures that the binary log and InnoDB data files are synchronized. For this option to provide a greater degree of safety, the MySQL server should also be configured to synchronize the binary log and the `InnoDB` logs to disk before committing the transaction. The `InnoDB` logs are synchronized by default, and `sync_binlog=1` can be used to synchronize the binary log. The effect of this option is that at restart after a crash, after doing a rollback of transactions, the MySQL server scans the latest binary log file to collect transaction *`xid`* values and calculate the last valid position in the binary log file. The MySQL server then tells `InnoDB` to complete any prepared transactions that were successfully written to the to the binary log, and truncates the binary log to the last valid position. This ensures that the binary log reflects the exact data of `InnoDB` tables, and therefore the replica remains in synchrony with the source because it does not receive a statement which has been rolled back.

Note

`innodb_support_xa` is deprecated; expect it to be removed in a future release. `InnoDB` support for two-phase commit in XA transactions is always enabled as of MySQL 5.7.10.

If the MySQL server discovers at crash recovery that the binary log is shorter than it should have been, it lacks at least one successfully committed `InnoDB` transaction. This should not happen if `sync_binlog=1` and the disk/file system do an actual sync when they are requested to (some do not), so the server prints an error message `The binary log file_name is shorter than its expected size`. In this case, this binary log is not correct and replication should be restarted from a fresh snapshot of the source's data.

The session values of the following system variables are written to the binary log and honored by the replica when parsing the binary log:

* `sql_mode` (except that the `NO_DIR_IN_CREATE` mode is not replicated; see Section 16.4.1.37, “Replication and Variables”)

* `foreign_key_checks`
* `unique_checks`
* `character_set_client`
* `collation_connection`
* `collation_database`
* `collation_server`
* `sql_auto_is_null`

#### 5.4.4.1 Binary Logging Formats

The server uses several logging formats to record information in the binary log. The exact format employed depends on the version of MySQL being used. There are three logging formats:

* Replication capabilities in MySQL originally were based on propagation of SQL statements from source to replica. This is called *statement-based logging*. You can cause this format to be used by starting the server with `--binlog-format=STATEMENT`.

* In *row-based logging*, the source writes events to the binary log that indicate how individual table rows are affected. It is important therefore that tables always use a primary key to ensure rows can be efficiently identified. You can cause the server to use row-based logging by starting it with `--binlog-format=ROW`.

* A third option is also available: *mixed logging*. With mixed logging, statement-based logging is used by default, but the logging mode switches automatically to row-based in certain cases as described below. You can cause MySQL to use mixed logging explicitly by starting `mysqld` with the option `--binlog-format=MIXED`.

The logging format can also be set or limited by the storage engine being used. This helps to eliminate issues when replicating certain statements between a source and replica which are using different storage engines.

With statement-based replication, there may be issues with replicating nondeterministic statements. In deciding whether or not a given statement is safe for statement-based replication, MySQL determines whether it can guarantee that the statement can be replicated using statement-based logging. If MySQL cannot make this guarantee, it marks the statement as potentially unreliable and issues the warning, Statement may not be safe to log in statement format.

You can avoid these issues by using MySQL's row-based replication instead.

#### 5.4.4.2 Setting The Binary Log Format

You can select the binary logging format explicitly by starting the MySQL server with `--binlog-format=type`. The supported values for *`type`* are:

* `STATEMENT` causes logging to be statement based.

* `ROW` causes logging to be row based.
* `MIXED` causes logging to use mixed format.

Setting the binary logging format does not activate binary logging for the server. The setting only takes effect when binary logging is enabled on the server, which is the case when the `log_bin` system variable is set to `ON`. In MySQL 5.7, binary logging is not enabled by default, and you enable it using the `--log-bin` option.

The logging format also can be switched at runtime, although note that there are a number of situations in which you cannot do this, as discussed later in this section. Set the global value of the `binlog_format` system variable to specify the format for clients that connect subsequent to the change:

```sql
mysql> SET GLOBAL binlog_format = 'STATEMENT';
mysql> SET GLOBAL binlog_format = 'ROW';
mysql> SET GLOBAL binlog_format = 'MIXED';
```

An individual client can control the logging format for its own statements by setting the session value of `binlog_format`:

```sql
mysql> SET SESSION binlog_format = 'STATEMENT';
mysql> SET SESSION binlog_format = 'ROW';
mysql> SET SESSION binlog_format = 'MIXED';
```

Changing the global `binlog_format` value requires privileges sufficient to set global system variables. Changing the session `binlog_format` value requires privileges sufficient to set restricted session system variables. See Section 5.1.8.1, “System Variable Privileges”.

There are several reasons why a client might want to set binary logging on a per-session basis:

* A session that makes many small changes to the database might want to use row-based logging.

* A session that performs updates that match many rows in the `WHERE` clause might want to use statement-based logging because it is more efficient to log a few statements than many rows.

* Some statements require a lot of execution time on the source, but result in just a few rows being modified. It might therefore be beneficial to replicate them using row-based logging.

There are exceptions when you cannot switch the replication format at runtime:

* From within a stored function or a trigger.
* If the `NDB` storage engine is enabled.

* If the session is currently in row-based replication mode and has open temporary tables.

Trying to switch the format in any of these cases results in an error.

Switching the replication format at runtime is not recommended when any temporary tables exist, because temporary tables are logged only when using statement-based replication, whereas with row-based replication they are not logged. With mixed replication, temporary tables are usually logged; exceptions happen with loadable functions and with the `UUID()` function.

Switching the replication format while replication is ongoing can also cause issues. Each MySQL Server can set its own and only its own binary logging format (true whether `binlog_format` is set with global or session scope). This means that changing the logging format on a replication source server does not cause a replica to change its logging format to match. When using `STATEMENT` mode, the `binlog_format` system variable is not replicated. When using `MIXED` or `ROW` logging mode, it is replicated but is ignored by the replica.

A replica is not able to convert binary log entries received in `ROW` logging format to `STATEMENT` format for use in its own binary log. The replica must therefore use `ROW` or `MIXED` format if the source does. Changing the binary logging format on the source from `STATEMENT` to `ROW` or `MIXED` while replication is ongoing to a replica with `STATEMENT` format can cause replication to fail with errors such as Error executing row event: 'Cannot execute statement: impossible to write to binary log since statement is in row format and BINLOG\_FORMAT = STATEMENT.' Changing the binary logging format on the replica to `STATEMENT` format when the source is still using `MIXED` or `ROW` format also causes the same type of replication failure. To change the format safely, you must stop replication and ensure that the same change is made on both the source and the replica.

If you are using `InnoDB` tables and the transaction isolation level is `READ COMMITTED` or `READ UNCOMMITTED`, only row-based logging can be used. It is *possible* to change the logging format to `STATEMENT`, but doing so at runtime leads very rapidly to errors because `InnoDB` can no longer perform inserts.

With the binary log format set to `ROW`, many changes are written to the binary log using the row-based format. Some changes, however, still use the statement-based format. Examples include all DDL (data definition language) statements such as `CREATE TABLE`, `ALTER TABLE`, or `DROP TABLE`.

The `--binlog-row-event-max-size` option is available for servers that are capable of row-based replication. Rows are stored into the binary log in chunks having a size in bytes not exceeding the value of this option. The value must be a multiple of 256. The default value is 8192.

Warning

When using *statement-based logging* for replication, it is possible for the data on the source and replica to become different if a statement is designed in such a way that the data modification is nondeterministic; that is, it is left to the will of the query optimizer. In general, this is not a good practice even outside of replication. For a detailed explanation of this issue, see Section B.3.7, “Known Issues in MySQL”.

#### 5.4.4.3 Mixed Binary Logging Format

When running in `MIXED` logging format, the server automatically switches from statement-based to row-based logging under the following conditions:

* When a DML statement updates an `NDBCLUSTER` table.

* When a function contains `UUID()`.

* When one or more tables with `AUTO_INCREMENT` columns are updated and a trigger or stored function is invoked. Like all other unsafe statements, this generates a warning if `binlog_format = STATEMENT`.

  For more information, see Section 16.4.1.1, “Replication and AUTO\_INCREMENT”.

* When the body of a view requires row-based replication, the statement creating the view also uses it. For example, this occurs when the statement creating a view uses the `UUID()` function.

* When a call to a loadable function is involved.
* If a statement is logged by row and the session that executed the statement has any temporary tables, logging by row is used for all subsequent statements (except for those accessing temporary tables) until all temporary tables in use by that session are dropped.

  This is true whether or not any temporary tables are actually logged.

  Temporary tables cannot be logged using row-based format; thus, once row-based logging is used, all subsequent statements using that table are unsafe. The server approximates this condition by treating all statements executed during the session as unsafe until the session no longer holds any temporary tables.

* When `FOUND_ROWS()` or `ROW_COUNT()` is used. (Bug #12092, Bug #30244)

* When `USER()`, `CURRENT_USER()`, or `CURRENT_USER` is used. (Bug #28086)

* When a statement refers to one or more system variables. (Bug #31168)

  **Exception.** The following system variables, when used with session scope (only), do not cause the logging format to switch:

  + `auto_increment_increment`
  + `auto_increment_offset`
  + `character_set_client`
  + `character_set_connection`
  + `character_set_database`
  + `character_set_server`
  + `collation_connection`
  + `collation_database`
  + `collation_server`
  + `foreign_key_checks`
  + `identity`
  + `last_insert_id`
  + `lc_time_names`
  + `pseudo_thread_id`
  + `sql_auto_is_null`
  + `time_zone`
  + `timestamp`
  + `unique_checks`

  For information about determining system variable scope, see Section 5.1.8, “Using System Variables”.

  For information about how replication treats `sql_mode`, see Section 16.4.1.37, “Replication and Variables”.

* When one of the tables involved is a log table in the `mysql` database.

* When the `LOAD_FILE()` function is used. (Bug #39701)

Note

A warning is generated if you try to execute a statement using statement-based logging that should be written using row-based logging. The warning is shown both in the client (in the output of `SHOW WARNINGS`) and through the `mysqld` error log. A warning is added to the `SHOW WARNINGS` table each time such a statement is executed. However, only the first statement that generated the warning for each client session is written to the error log to prevent flooding the log.

In addition to the decisions above, individual engines can also determine the logging format used when information in a table is updated. The logging capabilities of an individual engine can be defined as follows:

* If an engine supports row-based logging, the engine is said to be row-logging capable.

* If an engine supports statement-based logging, the engine is said to be statement-logging capable.

A given storage engine can support either or both logging formats. The following table lists the formats supported by each engine.

<table>
  <thead>
    <tr>
      <th>Storage Engine</th>
      <th>Row Logging Supported</th>
      <th>Statement Logging Supported</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>ARCHIVE</code></th>
      <td>Yes</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>BLACKHOLE</code></th>
      <td>Yes</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>CSV</code></th>
      <td>Yes</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>EXAMPLE</code></th>
      <td>Yes</td>
      <td>No</td>
    </tr>
    <tr>
      <th><code>FEDERATED</code></th>
      <td>Yes</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>HEAP</code></th>
      <td>Yes</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>InnoDB</code></th>
      <td>Yes</td>
      <td>Yes when the transaction isolation level is <code>REPEATABLE READ</code> or <code>SERIALIZABLE</code>; No otherwise.</td>
    </tr>
    <tr>
      <th><code>MyISAM</code></th>
      <td>Yes</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>MERGE</code></th>
      <td>Yes</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>NDB</code></th>
      <td>Yes</td>
      <td>No</td>
    </tr>
  </tbody>
</table>

Whether a statement is to be logged and the logging mode to be used is determined according to the type of statement (safe, unsafe, or binary injected), the binary logging format (`STATEMENT`, `ROW`, or `MIXED`), and the logging capabilities of the storage engine (statement capable, row capable, both, or neither). (Binary injection refers to logging a change that must be logged using `ROW` format.)

Statements may be logged with or without a warning; failed statements are not logged, but generate errors in the log. This is shown in the following decision table. **Type**, **binlog\_format**, **SLC**, and **RLC** columns outline the conditions, and **Error / Warning** and **Logged as** columns represent the corresponding actions. **SLC** stands for “statement-logging capable”, and **RLC** stands for “row-logging capable”.

<table>
  <thead>
    <tr>
      <th>Type</th>
      <th><code>binlog_format</code></th>
      <th>SLC</th>
      <th>RLC</th>
      <th>Error / Warning</th>
      <th>Logged as</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>*</th>
      <td><code>*</code></td>
      <td>No</td>
      <td>No</td>
      <td>Error: Cannot execute statement: Binary logging is impossible since at least one engine is involved that is both row-incapable and statement-incapable.</td>
      <td><code>-</code></td>
    </tr>
    <tr>
      <th>Safe</th>
      <td><code>STATEMENT</code></td>
      <td>Yes</td>
      <td>No</td>
      <td>-</td>
      <td><code>STATEMENT</code></td>
    </tr>
    <tr>
      <th>Safe</th>
      <td><code>MIXED</code></td>
      <td>Yes</td>
      <td>No</td>
      <td>-</td>
      <td><code>STATEMENT</code></td>
    </tr>
    <tr>
      <th>Safe</th>
      <td><code>ROW</code></td>
      <td>Yes</td>
      <td>No</td>
      <td>Error: Cannot execute statement: Binary logging is impossible since <code>BINLOG_FORMAT = ROW</code> and at least one table uses a storage engine that is not capable of row-based logging.</td>
      <td><code>-</code></td>
    </tr>
    <tr>
      <th>Unsafe</th>
      <td><code>STATEMENT</code></td>
      <td>Yes</td>
      <td>No</td>
      <td>Warning: Unsafe statement binlogged in statement format, since <code>BINLOG_FORMAT = STATEMENT</code></td>
      <td><code>STATEMENT</code></td>
    </tr>
    <tr>
      <th>Unsafe</th>
      <td><code>MIXED</code></td>
      <td>Yes</td>
      <td>No</td>
      <td>Error: Cannot execute statement: Binary logging of an unsafe statement is impossible when the storage engine is limited to statement-based logging, even if <code>BINLOG_FORMAT = MIXED</code>.</td>
      <td><code>-</code></td>
    </tr>
    <tr>
      <th>Unsafe</th>
      <td><code>ROW</code></td>
      <td>Yes</td>
      <td>No</td>
      <td>Error: Cannot execute statement: Binary logging is impossible since <code>BINLOG_FORMAT = ROW</code> and at least one table uses a storage engine that is not capable of row-based logging.</td>
      <td>-</td>
    </tr>
    <tr>
      <th>Row Injection</th>
      <td><code>STATEMENT</code></td>
      <td>Yes</td>
      <td>No</td>
      <td>Error: Cannot execute row injection: Binary logging is not possible since at least one table uses a storage engine that is not capable of row-based logging.</td>
      <td>-</td>
    </tr>
    <tr>
      <th>Row Injection</th>
      <td><code>MIXED</code></td>
      <td>Yes</td>
      <td>No</td>
      <td>Error: Cannot execute row injection: Binary logging is not possible since at least one table uses a storage engine that is not capable of row-based logging.</td>
      <td>-</td>
    </tr>
    <tr>
      <th>Row Injection</th>
      <td><code>ROW</code></td>
      <td>Yes</td>
      <td>No</td>
      <td>Error: Cannot execute row injection: Binary logging is not possible since at least one table uses a storage engine that is not capable of row-based logging.</td>
      <td>-</td>
    </tr>
    <tr>
      <th>Safe</th>
      <td><code>STATEMENT</code></td>
      <td>No</td>
      <td>Yes</td>
      <td>Error: Cannot execute statement: Binary logging is impossible since <code>BINLOG_FORMAT = STATEMENT</code> and at least one table uses a storage engine that is not capable of statement-based logging.</td>
      <td><code>-</code></td>
    </tr>
    <tr>
      <th>Safe</th>
      <td><code>MIXED</code></td>
      <td>No</td>
      <td>Yes</td>
      <td>-</td>
      <td><code>ROW</code></td>
    </tr>
    <tr>
      <th>Safe</th>
      <td><code>ROW</code></td>
      <td>No</td>
      <td>Yes</td>
      <td>-</td>
      <td><code>ROW</code></td>
    </tr>
    <tr>
      <th>Unsafe</th>
      <td><code>STATEMENT</code></td>
      <td>No</td>
      <td>Yes</td>
      <td>Error: Cannot execute statement: Binary logging is impossible since <code>BINLOG_FORMAT = STATEMENT</code> and at least one table uses a storage engine that is not capable of statement-based logging.</td>
      <td>-</td>
    </tr>
    <tr>
      <th>Unsafe</th>
      <td><code>MIXED</code></td>
      <td>No</td>
      <td>Yes</td>
      <td>-</td>
      <td><code>ROW</code></td>
    </tr>
    <tr>
      <th>Unsafe</th>
      <td><code>ROW</code></td>
      <td>No</td>
      <td>Yes</td>
      <td>-</td>
      <td><code>ROW</code></td>
    </tr>
    <tr>
      <th>Row Injection</th>
      <td><code>STATEMENT</code></td>
      <td>No</td>
      <td>Yes</td>
      <td>Error: Cannot execute row injection: Binary logging is not possible since <code>BINLOG_FORMAT = STATEMENT</code>.</td>
      <td><code>-</code></td>
    </tr>
    <tr>
      <th>Row Injection</th>
      <td><code>MIXED</code></td>
      <td>No</td>
      <td>Yes</td>
      <td>-</td>
      <td><code>ROW</code></td>
    </tr>
    <tr>
      <th>Row Injection</th>
      <td><code>ROW</code></td>
      <td>No</td>
      <td>Yes</td>
      <td>-</td>
      <td><code>ROW</code></td>
    </tr>
    <tr>
      <th>Safe</th>
      <td><code>STATEMENT</code></td>
      <td>Yes</td>
      <td>Yes</td>
      <td>-</td>
      <td><code>STATEMENT</code></td>
    </tr>
    <tr>
      <th>Safe</th>
      <td><code>MIXED</code></td>
      <td>Yes</td>
      <td>Yes</td>
      <td>-</td>
      <td><code>STATEMENT</code></td>
    </tr>
    <tr>
      <th>Safe</th>
      <td><code>ROW</code></td>
      <td>Yes</td>
      <td>Yes</td>
      <td>-</td>
      <td><code>ROW</code></td>
    </tr>
    <tr>
      <th>Unsafe</th>
      <td><code>STATEMENT</code></td>
      <td>Yes</td>
      <td>Yes</td>
      <td>Warning: Unsafe statement binlogged in statement format since <code>BINLOG_FORMAT = STATEMENT</code>.</td>
      <td><code>STATEMENT</code></td>
    </tr>
    <tr>
      <th>Unsafe</th>
      <td><code>MIXED</code></td>
      <td>Yes</td>
      <td>Yes</td>
      <td>-</td>
      <td><code>ROW</code></td>
    </tr>
    <tr>
      <th>Unsafe</th>
      <td><code>ROW</code></td>
      <td>Yes</td>
      <td>Yes</td>
      <td>-</td>
      <td><code>ROW</code></td>
    </tr>
    <tr>
      <th>Row Injection</th>
      <td><code>STATEMENT</code></td>
      <td>Yes</td>
      <td>Yes</td>
      <td>Error: Cannot execute row injection: Binary logging is not possible because <code>BINLOG_FORMAT = STATEMENT</code>.</td>
      <td>-</td>
    </tr>
    <tr>
      <th>Row Injection</th>
      <td><code>MIXED</code></td>
      <td>Yes</td>
      <td>Yes</td>
      <td>-</td>
      <td><code>ROW</code></td>
    </tr>
    <tr>
      <th>Row Injection</th>
      <td><code>ROW</code></td>
      <td>Yes</td>
      <td>Yes</td>
      <td>-</td>
      <td><code>ROW</code></td>
    </tr>
  </tbody>
</table>

When a warning is produced by the determination, a standard MySQL warning is produced (and is available using `SHOW WARNINGS`). The information is also written to the `mysqld` error log. Only one error for each error instance per client connection is logged to prevent flooding the log. The log message includes the SQL statement that was attempted.

If `log_error_verbosity` is 2 or greater on a replica, the replica prints messages to the error log to provide information about its status, such as the binary log and relay log coordinates where it starts its job, when it is switching to another relay log, when it reconnects after a disconnect, statements that are unsafe for statement-based logging, and so forth.

#### 5.4.4.4 Logging Format for Changes to mysql Database Tables

The contents of the grant tables in the `mysql` database can be modified directly (for example, with `INSERT` or `DELETE`) or indirectly (for example, with `GRANT` or `CREATE USER`). Statements that affect `mysql` database tables are written to the binary log using the following rules:

* Data manipulation statements that change data in `mysql` database tables directly are logged according to the setting of the `binlog_format` system variable. This pertains to statements such as `INSERT`, `UPDATE`, `DELETE`, `REPLACE`, `DO`, `LOAD DATA`, `SELECT`, and `TRUNCATE TABLE`.

* Statements that change the `mysql` database indirectly are logged as statements regardless of the value of `binlog_format`. This pertains to statements such as `GRANT`, `REVOKE`, `SET PASSWORD`, `RENAME USER`, `CREATE` (all forms except `CREATE TABLE ... SELECT`), `ALTER` (all forms), and `DROP` (all forms).

`CREATE TABLE ... SELECT` is a combination of data definition and data manipulation. The `CREATE TABLE` part is logged using statement format and the `SELECT` part is logged according to the value of `binlog_format`.

### 5.4.5 The Slow Query Log

The slow query log consists of SQL statements that take more than `long_query_time` seconds to execute and require at least `min_examined_row_limit` rows to be examined. The slow query log can be used to find queries that take a long time to execute and are therefore candidates for optimization. However, examining a long slow query log can be a time-consuming task. To make this easier, you can use the **mysqldumpslow** command to process a slow query log file and summarize its contents. See Section 4.6.8, “mysqldumpslow — Summarize Slow Query Log Files”.

The time to acquire the initial locks is not counted as execution time. `mysqld` writes a statement to the slow query log after it has been executed and after all locks have been released, so log order might differ from execution order.

* Slow Query Log Parameters
* Slow Query Log Contents

#### Slow Query Log Parameters

The minimum and default values of `long_query_time` are 0 and 10, respectively. The value can be specified to a resolution of microseconds.

By default, administrative statements are not logged, nor are queries that do not use indexes for lookups. This behavior can be changed using `log_slow_admin_statements` and `log_queries_not_using_indexes`, as described later.

By default, the slow query log is disabled. To specify the initial slow query log state explicitly, use `--slow_query_log[={0|1}]`. With no argument or an argument of 1, `--slow_query_log` enables the log. With an argument of 0, this option disables the log. To specify a log file name, use `--slow_query_log_file=file_name`. To specify the log destination, use the `log_output` system variable (as described in Section 5.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”).

Note

If you specify the `TABLE` log destination, see Log Tables and “Too many open files” Errors.

If you specify no name for the slow query log file, the default name is `host_name-slow.log`. The server creates the file in the data directory unless an absolute path name is given to specify a different directory.

To disable or enable the slow query log or change the log file name at runtime, use the global `slow_query_log` and `slow_query_log_file` system variables. Set `slow_query_log` to 0 to disable the log or to 1 to enable it. Set `slow_query_log_file` to specify the name of the log file. If a log file already is open, it is closed and the new file is opened.

The server writes less information to the slow query log if you use the `--log-short-format` option.

To include slow administrative statements in the slow query log, enable the `log_slow_admin_statements` system variable. Administrative statements include `ALTER TABLE`, `ANALYZE TABLE`, `CHECK TABLE`, `CREATE INDEX`, `DROP INDEX`, `OPTIMIZE TABLE`, and `REPAIR TABLE`.

To include queries that do not use indexes for row lookups in the statements written to the slow query log, enable the `log_queries_not_using_indexes` system variable. (Even with that variable enabled, the server does not log queries that would not benefit from the presence of an index due to the table having fewer than two rows.)

When queries that do not use an index are logged, the slow query log may grow quickly. It is possible to put a rate limit on these queries by setting the `log_throttle_queries_not_using_indexes` system variable. By default, this variable is 0, which means there is no limit. Positive values impose a per-minute limit on logging of queries that do not use indexes. The first such query opens a 60-second window within which the server logs queries up to the given limit, then suppresses additional queries. If there are suppressed queries when the window ends, the server logs a summary that indicates how many there were and the aggregate time spent in them. The next 60-second window begins when the server logs the next query that does not use indexes.

The server uses the controlling parameters in the following order to determine whether to write a query to the slow query log:

1. The query must either not be an administrative statement, or `log_slow_admin_statements` must be enabled.

2. The query must have taken at least `long_query_time` seconds, or `log_queries_not_using_indexes` must be enabled and the query used no indexes for row lookups.

3. The query must have examined at least `min_examined_row_limit` rows.

4. The query must not be suppressed according to the `log_throttle_queries_not_using_indexes` setting.

The `log_timestamps` system variable controls the time zone of timestamps in messages written to the slow query log file (as well as to the general query log file and the error log). It does not affect the time zone of general query log and slow query log messages written to log tables, but rows retrieved from those tables can be converted from the local system time zone to any desired time zone with `CONVERT_TZ()` or by setting the session `time_zone` system variable.

The server does not log queries handled by the query cache.

By default, a replica does not write replicated queries to the slow query log. To change this, enable the `log_slow_slave_statements` system variable. Note that if row-based replication is in use (`binlog_format=ROW`), `log_slow_slave_statements` has no effect. Queries are only added to the replica's slow query log when they are logged in statement format in the binary log, that is, when `binlog_format=STATEMENT` is set, or when `binlog_format=MIXED` is set and the statement is logged in statement format. Slow queries that are logged in row format when `binlog_format=MIXED` is set, or that are logged when `binlog_format=ROW` is set, are not added to the replica's slow query log, even if `log_slow_slave_statements` is enabled.

#### Slow Query Log Contents

When the slow query log is enabled, the server writes output to any destinations specified by the `log_output` system variable. If you enable the log, the server opens the log file and writes startup messages to it. However, further logging of queries to the file does not occur unless the `FILE` log destination is selected. If the destination is `NONE`, the server writes no queries even if the slow query log is enabled. Setting the log file name has no effect on logging if `FILE` is not selected as an output destination.

If the slow query log is enabled and `FILE` is selected as an output destination, each statement written to the log is preceded by a line that begins with a `#` character and has these fields (with all fields on a single line):

* `Query_time: duration`

  The statement execution time in seconds.

* `Lock_time: duration`

  The time to acquire locks in seconds.

* `Rows_sent: N`

  The number of rows sent to the client.

* `Rows_examined:`

  The number of rows examined by the server layer (not counting any processing internal to storage engines).

Each statement written to the slow query log file is preceded by a `SET` statement that includes a timestamp indicating when the slow statement was logged (which occurs after the statement finishes executing).

Passwords in statements written to the slow query log are rewritten by the server not to occur literally in plain text. See Section 6.1.2.3, “Passwords and Logging”.

From MySQL 5.7.38, statements that cannot be parsed (due, for example, to syntax errors) are not written to the slow query log.

### 5.4.6 The DDL Log

The DDL log, or metadata log, records metadata operations generated by data definition statements affecting table partitioning, such as `ALTER TABLE t3 DROP PARTITION p2`, where we must make certain that the partition is completely dropped and that its definition is removed from the list of partitions for table `t3`. MySQL uses this log to recover from a crash occurring in the middle of a partitioning metadata operation.

A record of partitioning metadata operations is written to the file `ddl_log.log`, in the MySQL data directory. This is a binary file; it is not intended to be human-readable, and you should not attempt to modify its contents in any way.

`ddl_log.log` is not created until it is actually needed for recording metadata statements, and is removed following a successful start of `mysqld`. Thus, it is possible for this file not to be present on a MySQL server that is functioning in a completely normal manner.

`ddl_log.log` can hold up to 1048573 entries, equivalent to 4 GB in size. Once this limit is exceeded, you must rename or remove the file before it is possible to execute any additional DDL statements. This is a known issue (Bug #83708).

There are no user-configurable server options or variables associated with this file.

### 5.4.7 Server Log Maintenance

As described in Section 5.4, “MySQL Server Logs”, MySQL Server can create several different log files to help you see what activity is taking place. However, you must clean up these files regularly to ensure that the logs do not take up too much disk space.

When using MySQL with logging enabled, you may want to back up and remove old log files from time to time and tell MySQL to start logging to new files. See Section 7.2, “Database Backup Methods”.

On a Linux (Red Hat) installation, you can use the `mysql-log-rotate` script for log maintenance. If you installed MySQL from an RPM distribution, this script should have been installed automatically. Be careful with this script if you are using the binary log for replication. You should not remove binary logs until you are certain that their contents have been processed by all replicas.

On other systems, you must install a short script yourself that you start from **cron** (or its equivalent) for handling log files.

For the binary log, you can set the `expire_logs_days` system variable to expire binary log files automatically after a given number of days (see Section 5.1.7, “Server System Variables”). If you are using replication, you should set the variable no lower than the maximum number of days your replicas might lag behind the source. To remove binary logs on demand, use the `PURGE BINARY LOGS` statement (see Section 13.4.1.1, “PURGE BINARY LOGS Statement”).

To force MySQL to start using new log files, flush the logs. Log flushing occurs when you execute a `FLUSH LOGS` statement or a **mysqladmin flush-logs**, **mysqladmin refresh**, **mysqldump --flush-logs**, or **mysqldump --master-data** command. See Section 13.7.6.3, “FLUSH Statement”, Section 4.5.2, “mysqladmin — A MySQL Server Administration Program”, and Section 4.5.4, “mysqldump — A Database Backup Program”. In addition, the server flushes the binary log automatically when current binary log file size reaches the value of the `max_binlog_size` system variable.

`FLUSH LOGS` supports optional modifiers to enable selective flushing of individual logs (for example, `FLUSH BINARY LOGS`). See Section 13.7.6.3, “FLUSH Statement”.

A log-flushing operation has the following effects:

* If binary logging is enabled, the server closes the current binary log file and opens a new log file with the next sequence number.

* If general query logging or slow query logging to a log file is enabled, the server closes and reopens the log file.

* If the server was started with the `--log-error` option to cause the error log to be written to a file, the server closes and reopens the log file.

Execution of log-flushing statements or commands requires connecting to the server using an account that has the `RELOAD` privilege. On Unix and Unix-like systems, another way to flush the logs is to send a `SIGHUP` signal to the server, which can be done by `root` or the account that owns the server process. Signals enable log flushing to be performed without having to connect to the server. However, `SIGHUP` has additional effects other than log flushing that might be undesirable. For details, see Section 4.10, “Unix Signal Handling in MySQL”.

As mentioned previously, flushing the binary log creates a new binary log file, whereas flushing the general query log, slow query log, or error log just closes and reopens the log file. For the latter logs, to cause a new log file to be created on Unix, rename the current log file first before flushing it. At flush time, the server opens the new log file with the original name. For example, if the general query log, slow query log, and error log files are named `mysql.log`, `mysql-slow.log`, and `err.log`, you can use a series of commands like this from the command line:

```sql
cd mysql-data-directory
mv mysql.log mysql.log.old
mv mysql-slow.log mysql-slow.log.old
mv err.log err.log.old
mysqladmin flush-logs
```

On Windows, use **rename** rather than **mv**.

At this point, you can make a backup of `mysql.log.old`, `mysql-slow.log.old`, and `err.log.old`, then remove them from disk.

To rename the general query log or slow query log at runtime, first connect to the server and disable the log:

```sql
SET GLOBAL general_log = 'OFF';
SET GLOBAL slow_query_log = 'OFF';
```

With the logs disabled, rename the log files externally (for example, from the command line). Then enable the logs again:

```sql
SET GLOBAL general_log = 'ON';
SET GLOBAL slow_query_log = 'ON';
```

This method works on any platform and does not require a server restart.

Note

For the server to recreate a given log file after you have renamed the file externally, the file location must be writable by the server. This may not always be the case. For example, on Linux, the server might write the error log as `/var/log/mysqld.log`, where `/var/log` is owned by `root` and not writable by `mysqld`. In this case, log-flushing operations fail to create a new log file.

To handle this situation, you must manually create the new log file with the proper ownership after renaming the original log file. For example, execute these commands as `root`:

```sql
mv /var/log/mysqld.log /var/log/mysqld.log.old
install -omysql -gmysql -m0644 /dev/null /var/log/mysqld.log
```

