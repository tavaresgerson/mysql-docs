## 7.4 MySQL Server Logs

MySQL Server has several logs that can help you find out what activity is taking place.

<table summary="MySQL Server log types and the information written to each log."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Log Type</th> <th>Information Written to Log</th> </tr></thead><tbody><tr> <td>Error log</td> <td>Problems encountered starting, running, or stopping mysqld</td> </tr><tr> <td>General query log</td> <td>Established client connections and statements received from clients</td> </tr><tr> <td>Binary log</td> <td>Statements that change data (also used for replication)</td> </tr><tr> <td>Relay log</td> <td>Data changes received from a replication source server</td> </tr><tr> <td>Slow query log</td> <td>Queries that took more than <code>long_query_time</code> seconds to execute</td> </tr><tr> <td>DDL logs</td> <td>Atomic DDL operations performed by DDL statements</td> </tr></tbody></table>

By default, no logs are enabled, except the error log on Windows. For information about DDL log behavior, see Viewing DDL Logs. The following log-specific sections provide information about the server options that enable logging.

By default, the server writes files for all enabled logs in the data directory. You can force the server to close and reopen the log files (or in some cases switch to a new log file) by flushing the logs. Log flushing occurs when you issue a `FLUSH LOGS` statement; execute **mysqladmin** with a `flush-logs` or `refresh` argument; or execute **mysqldump** with a `--flush-logs` option. See Section 15.7.8.3, “FLUSH Statement”, Section 6.5.2, “mysqladmin — A MySQL Server Administration Program”, and Section 6.5.4, “mysqldump — A Database Backup Program”. In addition, the binary log is flushed when its size reaches the value of the `max_binlog_size` system variable.

You can control the general query and slow query logs during runtime. You can enable or disable logging, or change the log file name. You can tell the server to write general query and slow query entries to log tables, log files, or both. For details, see Section 7.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”, Section 7.4.3, “The General Query Log”, and Section 7.4.5, “The Slow Query Log”.

The relay log is used only on replicas, to hold data changes from the replication source server that must also be made on the replica. For discussion of relay log contents and configuration, see Section 19.2.4.1, “The Relay Log”.

For information about log maintenance operations such as expiration of old log files, see Section 7.4.6, “Server Log Maintenance”.

For information about keeping logs secure, see Section 8.1.2.3, “Passwords and Logging”.


### 7.4.1 Selecting General Query Log and Slow Query Log Output Destinations

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

  ```
  SHOW CREATE TABLE mysql.general_log;
  SHOW CREATE TABLE mysql.slow_log;
  ```

* Log contents are accessible through SQL statements. This enables the use of queries that select only those log entries that satisfy specific criteria. For example, to select log contents associated with a particular client (which can be useful for identifying problematic queries from that client), it is easier to do this using a log table than a log file.

* Logs are accessible remotely through any client that can connect to the server and issue queries (if the client has the appropriate log table privileges). It is not necessary to log in to the server host and directly access the file system.

The log table implementation has the following characteristics:

* In general, the primary purpose of log tables is to provide an interface for users to observe the runtime execution of the server, not to interfere with its runtime execution.

* `CREATE TABLE`, `ALTER TABLE`, and `DROP TABLE` are valid operations on a log table. For [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") and [`DROP TABLE`](drop-table.html "15.1.37 DROP TABLE Statement"), the log table cannot be in use and must be disabled, as described later.

* By default, the log tables use the `CSV` storage engine that writes data in comma-separated values format. For users who have access to the `.CSV` files that contain log table data, the files are easy to import into other programs such as spreadsheets that can process CSV input.

  The log tables can be altered to use the `MyISAM` storage engine. You cannot use `ALTER TABLE` to alter a log table that is in use. The log must be disabled first. No engines other than `CSV` or `MyISAM` are legal for the log tables.

  **Log Tables and “Too many open files” Errors.**

  If you select `TABLE` as a log destination and the log tables use the `CSV` storage engine, you may find that disabling and enabling the general query log or slow query log repeatedly at runtime results in a number of open file descriptors for the `.CSV` file, possibly resulting in a “Too many open files” error. To work around this issue, execute [`FLUSH TABLES`](flush.html "15.7.8.3 FLUSH Statement") or ensure that the value of `open_files_limit` is greater than the value of `table_open_cache_instances`.

* To disable logging so that you can alter (or drop) a log table, you can use the following strategy. The example uses the general query log; the procedure for the slow query log is similar but uses the `slow_log` table and `slow_query_log` system variable.

  ```
  SET @old_log_state = @@GLOBAL.general_log;
  SET GLOBAL general_log = 'OFF';
  ALTER TABLE mysql.general_log ENGINE = MyISAM;
  SET GLOBAL general_log = @old_log_state;
  ```

* `TRUNCATE TABLE` is a valid operation on a log table. It can be used to expire log entries.

* `RENAME TABLE` is a valid operation on a log table. You can atomically rename a log table (to perform log rotation, for example) using the following strategy:

  ```
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


### 7.4.2 The Error Log

This section discusses how to configure the MySQL server for logging of diagnostic messages to the error log. For information about selecting the error message character set and language, see Section 12.6, “Error Message Character Set”, and Section 12.12, “Setting the Error Message Language”.

The error log contains a record of **mysqld** startup and shutdown times. It also contains diagnostic messages such as errors, warnings, and notes that occur during server startup and shutdown, and while the server is running. For example, if **mysqld** notices that a table needs to be automatically checked or repaired, it writes a message to the error log.

Depending on error log configuration, error messages may also populate the Performance Schema `error_log` table, to provide an SQL interface to the log and enable its contents to be queried. See Section 29.12.22.3, “The error_log Table”.

On some operating systems, the error log contains a stack trace if **mysqld** exits abnormally. The trace can be used to determine where **mysqld** exited. See Section 7.9, “Debugging MySQL”.

If used to start **mysqld**, **mysqld_safe** may write messages to the error log. For example, when **mysqld_safe** notices abnormal **mysqld** exits, it restarts **mysqld** and writes a `mysqld restarted` message to the error log.

The following sections discuss aspects of configuring error logging.


#### 7.4.2.1 Error Log Configuration

In MySQL 9.5, error logging uses the MySQL component architecture described at Section 7.5, “MySQL Components”. The error log subsystem consists of components that perform log event filtering and writing, as well as a system variable that configures which components to load and enable to achieve the desired logging result.

This section discusses how to load and enable components for error logging. For instructions specific to log filters, see Section 7.4.2.4, “Types of Error Log Filtering”. For instructions specific to the JSON and system log sinks, see Section 7.4.2.7, “Error Logging in JSON Format”, and Section 7.4.2.8, “Error Logging to the System Log”. For additional details about all available log components, see Section 7.5.3, “Error Log Components”.

Component-based error logging offers these features:

* Log events that can be filtered by filter components to affect the information available for writing.

* Log events that are output by sink (writer) components. Multiple sink components can be enabled, to write error log output to multiple destinations.

* Built-in filter and sink components that implement the default error log format.

* A loadable sink that enables logging in JSON format.
* A loadable sink that enables logging to the system log.
* System variables that control which log components to load and enable and how each component operates.

Error log configuration is described under the following topics in this section:

* The Default Error Log Configuration
* Error Log Configuration Methods
* Implicit Error Log Configuration
* Explicit Error Log Configuration
* Changing the Error Log Configuration Method
* Troubleshooting Configuration Issues
* Configuring Multiple Log Sinks
* Log Sink Performance Schema Support

##### The Default Error Log Configuration

The `log_error_services` system variable controls which loadable log components to load, and which log components to enable for error logging. By default, `log_error_services` has the value shown here:

```
mysql> SELECT @@GLOBAL.log_error_services;
+----------------------------------------+
| @@GLOBAL.log_error_services            |
+----------------------------------------+
| log_filter_internal; log_sink_internal |
+----------------------------------------+
```

That value indicates that log events first pass through the `log_filter_internal` filter component, then through the `log_sink_internal` sink component, both of which are built-in components. A filter modifies log events seen by components named later in the `log_error_services` value. A sink is a destination for log events. Typically, a sink processes log events into log messages that have a particular format and writes these messages to its associated output, such as a file or the system log.

The combination of `log_filter_internal` and `log_sink_internal` implements the default error log filtering and output behavior. The action of these components is affected by other server options and system variables:

* The output destination is determined by the `--log-error` option (and, on Windows, `--pid-file` and `--console`). These determine whether to write error messages to the console or a file and, if to a file, the error log file name. See Section 7.4.2.2, “Default Error Log Destination Configuration”.

* The `log_error_verbosity` and `log_error_suppression_list` system variables affect which types of log events `log_filter_internal` permits or suppresses. See Section 7.4.2.5, “Priority-Based Error Log Filtering (log_filter_internal)”").

When configuring `log_error_services`, be aware of the following characteristics:

* A list of log components may be delimited by semicolons or commas, optionally followed by spaces. A given setting cannot use both semicolon and comma separators. Component order is significant because the server executes components in the order listed.

* The final component in the `log_error_services` value cannot be a filter. This is an error because any changes it has on events would have no effect on output:

  ```
  mysql> SET GLOBAL log_error_services = 'log_filter_internal';
  ERROR 1231 (42000): Variable 'log_error_services' can't be set to the value
  of 'log_filter_internal'
  ```

  To correct the problem, include a sink at the end of the value:

  ```
  mysql> SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal';
  ```

* The order of components named in `log_error_services` is significant, particularly with respect to the relative order of filters and sinks. Consider this `log_error_services` value:

  ```
  log_filter_internal; log_sink_1; log_sink_2
  ```

  In this case, log events pass to the built-in filter, then to the first sink, then to the second sink. Both sinks receive the filtered log events.

  Compare that to this `log_error_services` value:

  ```
  log_sink_1; log_filter_internal; log_sink_2
  ```

  In this case, log events pass to the first sink, then to the built-in filter, then to the second sink. The first sink receives unfiltered events. The second sink receives filtered events. You might configure error logging this way if you want one log that contains messages for all log events, and another log that contains messages only for a subset of log events.

##### Error Log Configuration Methods

Error log configuration involves loading and enabling error log components as necessary and performing component-specific configuration.

There are two error log configuration methods, *implicit* and *explicit*. It is recommended that one configuration method is selected and used exclusively. Using both methods can result in warnings at startup. For more information, see Troubleshooting Configuration Issues.

* *Implicit Error Log Configuration*

  This configuration method loads and enables the log components defined by the `log_error_services` variable. Loadable components that are not already loaded are loaded implicitly at startup before the `InnoDB` storage engine is fully available. This configuration method has the following advantages:

  + Log components are loaded early in the startup sequence, before the `InnoDB` storage engine, making logged information available sooner.

  + It avoids loss of buffered log information should a failure occur during startup.

  + Installing error log components using `INSTALL COMPONENT` is not required, simplifying error log configuration.

  To use this method, see Implicit Error Log Configuration.

* *Explicit Error Log Configuration*

  Note

  This configuration method is supported for backward compatibility. The implicit configuration method is recommended.

  This configuration method requires loading error log components using [`INSTALL COMPONENT`](install-component.html "15.7.4.3 INSTALL COMPONENT Statement") and then configuring `log_error_services` to enable the log components. [`INSTALL COMPONENT`](install-component.html "15.7.4.3 INSTALL COMPONENT Statement") adds the component to the `mysql.component` table (an `InnoDB` table), and the components to load at startup are read from this table, which is only accessible after `InnoDB` is initialized.

  Logged information is buffered during the startup sequence while the `InnoDB` storage engine is initialized, which is sometimes prolonged by operations such as recovery and data dictionary upgrade that occur during the `InnoDB` startup sequence.

  To use this method, see Explicit Error Log Configuration.

##### Implicit Error Log Configuration

This procedure describes how to load and enable error logging components implicitly using `log_error_services`. For a discussion of error log configuration methods, see Error Log Configuration Methods.

To load and enable error logging components implicitly:

1. List the error log components in the `log_error_services` value.

   To load and enable the error log components at server startup, set `log_error_services` in an option file. The following example configures the use of the JSON log sink (`log_sink_json`) in addition to the built-in log filter and sink (`log_filter_internal`, `log_sink_internal`).

   ```
   [mysqld]
   log_error_services='log_filter_internal; log_sink_internal; log_sink_json'
   ```

   Note

   To use the JSON log sink (`log_sink_syseventlog`) instead of the default sink (`log_sink_internal`), you would replace `log_sink_internal` with `log_sink_json`.

   To load and enable the component immediately and for subsequent restarts, set `log_error_services` using [`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment"):

   ```
   SET PERSIST log_error_services = 'log_filter_internal; log_sink_internal; log_sink_json';
   ```

2. If the error log component exposes any system variables that must be set for component initialization to succeed, assign those variables appropriate values. You can set these variables in an option file or using [`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment").

   Important

   When implementing an implicit configuration, set `log_error_services` first to load a component and expose its system variables, and then set component system variables afterward. This configuration order is required regardless of whether variable assignment is performed on the command-line, in an option file, or using [`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment").

To disable a log component, remove it from the `log_error_services` value. Also remove any associated component variables settings that you have defined.

Note

Loading a log component implicitly using `log_error_services` has no effect on the `mysql.component` table. It does not add the component to the `mysql.component` table, nor does it remove a component previously installed using `INSTALL COMPONENT` from the `mysql.component` table.

##### Explicit Error Log Configuration

This procedure describes how to load and enable error logging components explicitly by loading components using `INSTALL COMPONENT` and then enabling using `log_error_services`. For a discussion of error log configuration methods, see Error Log Configuration Methods.

To load and enable error logging components explicitly:

1. Load the component using [`INSTALL COMPONENT`](install-component.html "15.7.4.3 INSTALL COMPONENT Statement") (unless it is built in or already loaded). For example, to load the JSON log sink, issue the following statement:

   ```
   INSTALL COMPONENT 'file://component_log_sink_json';
   ```

   Loading a component using [`INSTALL COMPONENT`](install-component.html "15.7.4.3 INSTALL COMPONENT Statement") registers it in the `mysql.component` system table so that the server loads it automatically for subsequent startups, after `InnoDB` is initialized.

   The URN to use when loading a log component with `INSTALL COMPONENT` is the component name prefixed with `file://component_`. For example, for the `log_sink_json` component, the corresponding URN is `file://component_log_sink_json`. For error log component URNs, see Section 7.5.3, “Error Log Components”.

2. If the error log component exposes any system variables that must be set for component initialization to succeed, assign those variables appropriate values. You can set these variables in an option file or using [`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment").

3. Enable the component by listing it in the `log_error_services` value.

   Important

   When loading log components explicitly using `INSTALL COMPONENT`, do not persist or set `log_error_services` in an option file, which loads log components implicitly at startup. Instead, enable log components at runtime using a `SET GLOBAL` statement.

   The following example configures the use of the JSON log sink (`log_sink_json`) in addition to the built-in log filter and sink (`log_filter_internal`, `log_sink_internal`).

   ```
   SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal; log_sink_json';
   ```

   Note

   To use the JSON log sink (`log_sink_syseventlog`) instead of the default sink (`log_sink_internal`), you would replace `log_sink_internal` with `log_sink_json`.

To disable a log component, remove it from the `log_error_services` value. Then, if the component is loadable and you also want to unload it, use `UNINSTALL COMPONENT`. Also remove any associated component variables settings that you have defined.

Attempts to use [`UNINSTALL COMPONENT`](uninstall-component.html "15.7.4.5 UNINSTALL COMPONENT Statement") to unload a loadable component that is still named in the `log_error_services` value produce an error.

##### Changing the Error Log Configuration Method

If you have previously loaded error log components explicitly using `INSTALL COMPONENT` and want to switch to an implicit configuration, as described in Implicit Error Log Configuration, the following steps are recommended:

1. Set `log_error_services` back to its default configuration.

   ```
   SET GLOBAL log_error_services = 'log_filter_internal,log_sink_internal';
   ```

2. Use `UNINSTALL COMPONENT` to uninstall any loadable logging components that you installed previously. For example, if you installed the JSON log sink previously, uninstall it as shown:

   ```
   UNINSTALL COMPONENT 'file://component_log_sink_json';
   ```

3. Remove any component variable settings for the uninstalled component. For example, if component variables were set in an option file, remove the settings from the option file. If component variables were set using [`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment"), use [`RESET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") to clear the settings.

4. Follow the steps in Implicit Error Log Configuration to reimplement your configuration.

If you need to revert from an implicit configuration to an explicit configuration, perform the following steps:

1. Set `log_error_services` back to its default configuration to unload implicitly loaded log components.

   ```
   SET GLOBAL log_error_services = 'log_filter_internal,log_sink_internal';
   ```

2. Remove any component variable settings associated with the uninstalled components. For example, if component variables were set in an option file, remove the settings from the option file. If component variables were set using [`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment"), use [`RESET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") to clear the settings.

3. Restart the server to uninstall the log components that were implicitly loaded.

4. Follow the steps in Explicit Error Log Configuration to reimplement your configuration.

##### Troubleshooting Configuration Issues

Log components listed in the `log_error_services` value at startup are loaded implicitly early in the MySQL Server startup sequence. If the log component was loaded previously using `INSTALL COMPONENT`, the server attempts to load the component again later in the startup sequence, which produces the warning Cannot load component from specified URN: 'file://component_*`component_name`*'.

You can check for this warning in the error log or by querying the Performance Schema `error_log` table using the following query:

```
SELECT error_code, data
  FROM performance_schema.error_log
 WHERE data LIKE "%'file://component_%"
   AND error_code="MY-013129" AND data LIKE "%MY-003529%";
```

To prevent this warning, follow the instructions in Changing the Error Log Configuration Method to adjust your error log configuration. Either an implicit or explicit error log configuration should be used, but not both.

A similar error occurs when attempting to explicitly load a component that was implicitly loaded at startup. For example, if `log_error_services` lists the JSON log sink component, that component is implicitly loaded at startup. Attempting to explicitly load the same component later returns this error:

```
mysql> INSTALL COMPONENT 'file://component_log_sink_json';
ERROR 3529 (HY000): Cannot load component from specified URN: 'file://component_log_sink_json'.
```

##### Configuring Multiple Log Sinks

It is possible to configure multiple log sinks, which enables sending output to multiple destinations. To enable the JSON log sink in addition to (rather than instead of) the default sink, set the `log_error_services` value like this:

```
SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal; log_sink_json';
```

To revert to using only the default sink and unload the system log sink, execute these statements:

```
SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal;
UNINSTALL COMPONENT 'file://component_log_sink_json';
```

##### Log Sink Performance Schema Support

If enabled log components include a sink that provides Performance Schema support, events written to the error log are also written to the Performance Schema `error_log` table. This enables examining error log contents using SQL queries. Currently, the traditional-format `log_sink_internal` and JSON-format `log_sink_json` sinks support this capability. See Section 29.12.22.3, “The error_log Table”.


#### 7.4.2.2 Default Error Log Destination Configuration

This section describes which server options configure the default error log destination, which can be the console or a named file. It also indicates which log sink components base their own output destination on the default destination.

In this discussion, “console” means `stderr`, the standard error output. This is your terminal or console window unless the standard error output has been redirected to a different destination.

The server interprets options that determine the default error log destination somewhat differently for Windows and Unix systems. Be sure to configure the destination using the information appropriate to your platform. After the server interprets the default error log destination options, it sets the `log_error` system variable to indicate the default destination, which affects where several log sink components write error messages. The following sections address these topics.

* Default Error Log Destination on Windows
* Default Error Log Destination on Unix and Unix-Like Systems
* How the Default Error Log Destination Affects Log Sinks

##### Default Error Log Destination on Windows

On Windows, **mysqld** uses the `--log-error`, `--pid-file`, and `--console` options to determine whether the default error log destination is the console or a file, and, if a file, the file name:

* If `--console` is given, the default destination is the console. (`--console` takes precedence over `--log-error` if both are given, and the following items regarding `--log-error` do not apply.)

* If `--log-error` is not given, or is given without naming a file, the default destination is a file named `host_name.err` in the data directory, unless the `--pid-file` option is specified. In that case, the file name is the PID file base name with a suffix of `.err` in the data directory.

* If `--log-error` is given to name a file, the default destination is that file (with an `.err` suffix added if the name has no suffix). The file location is under the data directory unless an absolute path name is given to specify a different location.

If the default error log destination is the console, the server sets the `log_error` system variable to `stderr`. Otherwise, the default destination is a file and the server sets `log_error` to the file name.

##### Default Error Log Destination on Unix and Unix-Like Systems

On Unix and Unix-like systems, **mysqld** uses the `--log-error` option to determine whether the default error log destination is the console or a file, and, if a file, the file name:

* If `--log-error` is not given, the default destination is the console.

* If `--log-error` is given without naming a file, the default destination is a file named `host_name.err` in the data directory.

* If `--log-error` is given to name a file, the default destination is that file (with an `.err` suffix added if the name has no suffix). The file location is under the data directory unless an absolute path name is given to specify a different location.

* If `--log-error` is given in an option file in a `[mysqld]`, `[server]`, or `[mysqld_safe]` section, on systems that use **mysqld_safe** to start the server, **mysqld_safe** finds and uses the option, and passes it to **mysqld**.

Note

It is common for Yum or APT package installations to configure an error log file location under `/var/log` with an option like `log-error=/var/log/mysqld.log` in a server configuration file. Removing the path name from the option causes the `host_name.err` file in the data directory to be used.

If the default error log destination is the console, the server sets the `log_error` system variable to `stderr`. Otherwise, the default destination is a file and the server sets `log_error` to the file name.

##### How the Default Error Log Destination Affects Log Sinks

After the server interprets the error log destination configuration options, it sets the `log_error` system variable to indicate the default error log destination. Log sink components may base their own output destination on the `log_error` value, or determine their destination independently of `log_error`

If `log_error` is `stderr`, the default error log destination is the console, and log sinks that base their output destination on the default destination also write to the console:

* `log_sink_internal`, `log_sink_json`, `log_sink_test`: These sinks write to the console. This is true even for sinks such as `log_sink_json` that can be enabled multiple times; all instances write to the console.

* `log_sink_syseventlog`: This sink writes to the system log, regardless of the `log_error` value.

If `log_error` is not `stderr`, the default error log destination is a file and `log_error` indicates the file name. Log sinks that base their output destination on the default destination base output file naming on that file name. (A sink might use exactly that name, or it might use some variant thereof.) Suppose that the `log_error` value *`file_name`*. Then log sinks use the name like this:

* `log_sink_internal`, `log_sink_test`: These sinks write to *`file_name`*.

* `log_sink_json`: Successive instances of this sink named in the `log_error_services` value write to files named *`file_name`* plus a numbered `.NN.json` suffix: `file_name.00.json`, `file_name.01.json`, and so forth.

* `log_sink_syseventlog`: This sink writes to the system log, regardless of the `log_error` value.


#### 7.4.2.3 Error Event Fields

Error events intended for the error log contain a set of fields, each of which consists of a key/value pair. An event field may be classified as core, optional, or user-defined:

* A core field is set up automatically for error events. However, its presence in the event during event processing is not guaranteed because a core field, like any type of field, may be unset by a log filter. If this happens, the field cannot be found by subsequent processing within that filter and by components that execute after the filter (such as log sinks).

* An optional field is normally absent but may be present for certain event types. When present, an optional field provides additional event information as appropriate and available.

* A user-defined field is any field with a name that is not already defined as a core or optional field. A user-defined field does not exist until created by a log filter.

As implied by the preceding description, any given field may be absent during event processing, either because it was not present in the first place, or was discarded by a filter. For log sinks, the effect of field absence is sink specific. For example, a sink might omit the field from the log message, indicate that the field is missing, or substitute a default. When in doubt, test: use a filter that unsets the field, then check what the log sink does with it.

The following sections describe the core and optional error event fields. For individual log filter components, there may be additional filter-specific considerations for these fields, or filters may add user-defined fields not listed here. For details, see the documentation for specific filters.

* Core Error Event Fields
* Optional Error Event Fields

##### Core Error Event Fields

These error event fields are core fields:

* `time`

  The event timestamp, with microsecond precision.

* `msg`

  The event message string.

* `prio`

  The event priority, to indicate a system, error, warning, or note/information event. This field corresponds to severity in `syslog`. The following table shows the possible priority levels.

  <table summary="Error event priority levels."><col style="width: 35%"/><col style="width: 35%"/><thead><tr> <th>Event Type</th> <th>Numeric Priority</th> </tr></thead><tbody><tr> <td>System event</td> <td>0</td> </tr><tr> <td>Error event</td> <td>1</td> </tr><tr> <td>Warning event</td> <td>2</td> </tr><tr> <td>Note/information event</td> <td>3</td> </tr></tbody></table>

  The `prio` value is numeric. Related to it, an error event may also include an optional `label` field representing the priority as a string. For example, an event with a `prio` value of 2 may have a `label` value of `'Warning'`.

  Filter components may include or drop error events based on priority, except that system events are mandatory and cannot be dropped.

  In general, message priorities are determined as follows:

  Is the situation or event actionable?

  + Yes: Is the situation or event ignorable?

    - Yes: Priority is warning.
    - No: Priority is error.
  + No: Is the situation or event mandatory?

    - Yes: Priority is system.
    - No: Priority is note/information.
* `err_code`

  The event error code, as a number (for example, `1022`).

* `err_symbol`

  The event error symbol, as a string (for example, `'ER_DUP_KEY'`).

* `SQL_state`

  The event SQLSTATE value, as a string (for example, `'23000'`).

* `subsystem`

  The subsystem in which the event occurred. Possible values are `InnoDB` (the `InnoDB` storage engine), `Repl` (the replication subsystem), `Server` (otherwise).

##### Optional Error Event Fields

Optional error event fields fall into the following categories:

* Additional information about the error, such as the error signaled by the operating system or the error label:

  + `OS_errno`

    The operating system error number.

  + `OS_errmsg`

    The operating system error message.

  + `label`

    The label corresponding to the `prio` value, as a string.

* Identification of the client for which the event occurred:

  + `user`

    The client user.

  + `host`

    The client host.

  + `thread`

    The ID of the thread within **mysqld** responsible for producing the error event. This ID indicates which part of the server produced the event, and is consistent with general query log and slow query log messages, which include the connection thread ID.

  + `query_id`

    The query ID.

* Debugging information:

  + `source_file`

    The source file in which the event occurred, without any leading path.

  + `source_line`

    The line within the source file at which the event occurred.

  + `function`

    The function in which the event occurred.

  + `component`

    The component or plugin in which the event occurred.


#### 7.4.2.4 Types of Error Log Filtering

Error log configuration normally includes one log filter component and one or more log sink components. For error log filtering, MySQL offers a choice of components:

* `log_filter_internal`: This filter component provides error log filtering based on log event priority and error code, in combination with the `log_error_verbosity` and `log_error_suppression_list` system variables. `log_filter_internal` is built in and enabled by default. See Section 7.4.2.5, “Priority-Based Error Log Filtering (log_filter_internal)”").

* `log_filter_dragnet`: This filter component provides error log filtering based on user-supplied rules, in combination with the `dragnet.log_error_filter_rules` system variable. See Section 7.4.2.6, “Rule-Based Error Log Filtering (log_filter_dragnet)”").


#### 7.4.2.5 Priority-Based Error Log Filtering (log_filter_internal)

The `log_filter_internal` log filter component implements a simple form of log filtering based on error event priority and error code. To affect how `log_filter_internal` permits or suppresses error, warning, and information events intended for the error log, set the `log_error_verbosity` and `log_error_suppression_list` system variables.

`log_filter_internal` is built in and enabled by default. If this filter is disabled, `log_error_verbosity` and `log_error_suppression_list` have no effect, so filtering must be performed using another filter service instead where desired (for example, with individual filter rules when using `log_filter_dragnet`). For information about filter configuration, see Section 7.4.2.1, “Error Log Configuration”.

* Verbosity Filtering
* Suppression-List Filtering
* Verbosity and Suppression-List Interaction

##### Verbosity Filtering

Events intended for the error log have a priority of `ERROR`, `WARNING`, or `INFORMATION`. The `log_error_verbosity` system variable controls verbosity based on which priorities to permit for messages written to the log, as shown in the following table.

<table summary="Permitted log_error_verbosity values and corresponding permitted message priorities."><col style="width: 40%"/><col style="width: 40%"/><thead><tr> <th>log_error_verbosity Value</th> <th>Permitted Message Priorities</th> </tr></thead><tbody><tr> <td>1</td> <td><code>ERROR</code></td> </tr><tr> <td>2</td> <td><code>ERROR</code>, <code>WARNING</code></td> </tr><tr> <td>3</td> <td><code>ERROR</code>, <code>WARNING</code>, <code>INFORMATION</code></td> </tr></tbody></table>

If `log_error_verbosity` is 2 or greater, the server logs messages about statements that are unsafe for statement-based logging. If the value is 3, the server logs aborted connections and access-denied errors for new connection attempts. See Section B.3.2.9, “Communication Errors and Aborted Connections”.

If you use replication, a `log_error_verbosity` value of 2 or greater is recommended, to obtain more information about what is happening, such as messages about network failures and reconnections.

If `log_error_verbosity` is 2 or greater on a replica, the replica prints messages to the error log to provide information about its status, such as the binary log and relay log coordinates where it starts its job, when it is switching to another relay log, when it reconnects after a disconnect, and so forth.

There is also a message priority of `SYSTEM` that is not subject to verbosity filtering. System messages about non-error situations are printed to the error log regardless of the `log_error_verbosity` value. These messages include startup and shutdown messages, and some significant changes to settings.

In the MySQL error log, system messages are labeled as “System”. Other log sinks might or might not follow the same convention, and in the resulting logs, system messages might be assigned the label used for the information priority level, such as “Note” or “Information”. If you apply any additional filtering or redirection for logging based on the labeling of messages, system messages do not override your filter, but are handled by it in the same way as other messages.

##### Suppression-List Filtering

The `log_error_suppression_list` system variable applies to events intended for the error log and specifies which events to suppress when they occur with a priority of `WARNING` or `INFORMATION`. For example, if a particular type of warning is considered undesirable “noise” in the error log because it occurs frequently but is not of interest, it can be suppressed. `log_error_suppression_list` does not suppress messages with a priority of `ERROR` or `SYSTEM`.

The `log_error_suppression_list` value may be the empty string for no suppression, or a list of one or more comma-separated values indicating the error codes to suppress. Error codes may be specified in symbolic or numeric form. A numeric code may be specified with or without the `MY-` prefix. Leading zeros in the numeric part are not significant. Examples of permitted code formats:

```
ER_SERVER_SHUTDOWN_COMPLETE
MY-000031
000031
MY-31
31
```

For readability and portability, symbolic values are preferable to numeric values.

Although codes to be suppressed can be expressed in symbolic or numeric form, the numeric value of each code must be in a permitted range:

* 1 to 999: Global error codes that are used by the server as well as by clients.

* 10000 and higher: Server error codes intended to be written to the error log (not sent to clients).

In addition, each error code specified must actually be used by MySQL. Attempts to specify a code not within a permitted range or within a permitted range but not used by MySQL produce an error and the `log_error_suppression_list` value remains unchanged.

For information about error code ranges and the error symbols and numbers defined within each range, see Section B.1, “Error Message Sources and Elements”, and MySQL 9.5 Error Message Reference.

The server can generate messages for a given error code at differing priorities, so suppression of a message associated with an error code listed in `log_error_suppression_list` depends on its priority. Suppose that the variable has a value of `'ER_PARSER_TRACE,MY-010001,10002'`. Then `log_error_suppression_list` has these effects on messages for those codes:

* Messages generated with a priority of `WARNING` or `INFORMATION` are suppressed.

* Messages generated with a priority of `ERROR` or `SYSTEM` are not suppressed.

##### Verbosity and Suppression-List Interaction

The effect of `log_error_verbosity` combines with that of `log_error_suppression_list`. Consider a server started with these settings:

```
[mysqld]
log_error_verbosity=2     # error and warning messages only
log_error_suppression_list='ER_PARSER_TRACE,MY-010001,10002'
```

In this case, `log_error_verbosity` permits messages with `ERROR` or `WARNING` priority and discards messages with `INFORMATION` priority. Of the nondiscarded messages, `log_error_suppression_list` discards messages with `WARNING` priority and any of the named error codes.

Note

The `log_error_verbosity` value of 2 shown in the example is also its default value, so the effect of this variable on `INFORMATION` messages is as just described by default, without an explicit setting. You must set `log_error_verbosity` to 3 if you want `log_error_suppression_list` to affect messages with `INFORMATION` priority.

Consider a server started with this setting:

```
[mysqld]
log_error_verbosity=1     # error messages only
```

In this case, `log_error_verbosity` permits messages with `ERROR` priority and discards messages with `WARNING` or `INFORMATION` priority. Setting `log_error_suppression_list` has no effect because all error codes it might suppress are already discarded due to the `log_error_verbosity` setting.


#### 7.4.2.6 Rule-Based Error Log Filtering (log_filter_dragnet)

The `log_filter_dragnet` log filter component enables log filtering based on user-defined rules.

To enable the `log_filter_dragnet` filter, first load the filter component, then modify the `log_error_services` value. The following example enables `log_filter_dragnet` in combination with the built-in log sink:

```
INSTALL COMPONENT 'file://component_log_filter_dragnet';
SET GLOBAL log_error_services = 'log_filter_dragnet; log_sink_internal';
```

To set `log_error_services` to take effect at server startup, use the instructions at Section 7.4.2.1, “Error Log Configuration”. Those instructions apply to other error-logging system variables as well.

With `log_filter_dragnet` enabled, define its filter rules by setting the `dragnet.log_error_filter_rules` system variable. A rule set consists of zero or more rules, where each rule is an `IF` statement terminated by a period (`.`) character. If the variable value is empty (zero rules), no filtering occurs.

Example 1. This rule set drops information events, and, for other events, removes the `source_line` field:

```
SET GLOBAL dragnet.log_error_filter_rules =
  'IF prio>=INFORMATION THEN drop. IF EXISTS source_line THEN unset source_line.';
```

The effect is similar to the filtering performed by the `log_sink_internal` filter with a setting of `log_error_verbosity=2`.

For readability, you might find it preferable to list the rules on separate lines. For example:

```
SET GLOBAL dragnet.log_error_filter_rules = '
  IF prio>=INFORMATION THEN drop.
  IF EXISTS source_line THEN unset source_line.
';
```

Example 2: This rule limits information events to no more than one per 60 seconds:

```
SET GLOBAL dragnet.log_error_filter_rules =
  'IF prio>=INFORMATION THEN throttle 1/60.';
```

Once you have the filtering configuration set up as you desire, consider assigning `dragnet.log_error_filter_rules` using [`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") rather than [`SET GLOBAL`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") to make the setting persist across server restarts. Alternatively, add the setting to the server option file.

When using `log_filter_dragnet`, `log_error_suppression_list` is ignored.

To stop using the filtering language, first remove it from the set of error logging components. Usually this means using a different filter component rather than no filter component. For example:

```
SET GLOBAL log_error_services = 'log_filter_internal; log_sink_internal';
```

Again, consider using [`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") rather than [`SET GLOBAL`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") to make the setting persist across server restarts.

Then uninstall the filter `log_filter_dragnet` component:

```
UNINSTALL COMPONENT 'file://component_log_filter_dragnet';
```

The following sections describe aspects of `log_filter_dragnet` operation in more detail:

* Grammar for log_filter_dragnet Rule Language
* Actions for log_filter_dragnet Rules
* Field References in log_filter_dragnet Rules

##### Grammar for log_filter_dragnet Rule Language

The following grammar defines the language for `log_filter_dragnet` filter rules. Each rule is an `IF` statement terminated by a period (`.`) character. The language is not case-sensitive.

```
rule:
    IF condition THEN action
    [ELSEIF condition THEN action] ...
    [ELSE action]
    .

condition: {
    field comparator value
  | [NOT] EXISTS field
  | condition {AND | OR}  condition
}

action: {
    drop
  | throttle {count | count / window_size}
  | set field [:= | =] value
  | unset [field]
}

field: {
    core_field
  | optional_field
  | user_defined_field
}

core_field: {
    time
  | msg
  | prio
  | err_code
  | err_symbol
  | SQL_state
  | subsystem
}

optional_field: {
    OS_errno
  | OS_errmsg
  | label
  | user
  | host
  | thread
  | query_id
  | source_file
  | source_line
  | function
  | component
}

user_defined_field:
    sequence of characters in [a-zA-Z0-9_] class

comparator: {== | != | <> | >= | => | <= | =< | < | >}

value: {
    string_literal
  | integer_literal
  | float_literal
  | error_symbol
  | priority
}

count: integer_literal
window_size: integer_literal

string_literal:
    sequence of characters quoted as '...' or "..."

integer_literal:
    sequence of characters in [0-9] class

float_literal:
    integer_literal[.integer_literal]

error_symbol:
    valid MySQL error symbol such as ER_ACCESS_DENIED_ERROR or ER_STARTUP

priority: {
    ERROR
  | WARNING
  | INFORMATION
}
```

Simple conditions compare a field to a value or test field existence. To construct more complex conditions, use the `AND` and `OR` operators. Both operators have the same precedence and evaluate left to right.

To escape a character within a string, precede it by a backslash (`\`). A backslash is required to include backslash itself or the string-quoting character, optional for other characters.

For convenience, `log_filter_dragnet` supports symbolic names for comparisons to certain fields. For readability and portability, symbolic values are preferable (where applicable) to numeric values.

* Event priority values 1, 2, and 3 can be specified as `ERROR`, `WARNING`, and `INFORMATION`. Priority symbols are recognized only in comparisons with the `prio` field. These comparisons are equivalent:

  ```
  IF prio == INFORMATION THEN ...
  IF prio == 3 THEN ...
  ```

* Error codes can be specified in numeric form or as the corresponding error symbol. For example, `ER_STARTUP` is the symbolic name for error `1408`, so these comparisons are equivalent:

  ```
  IF err_code == ER_STARTUP THEN ...
  IF err_code == 1408 THEN ...
  ```

  Error symbols are recognized only in comparisons with the `err_code` field and user-defined fields.

  To find the error symbol corresponding to a given error code number, use one of these methods:

  + Check the list of server errors at Server Error Message Reference.

  + Use the **perror** command. Given an error number argument, **perror** displays information about the error, including its symbol.

  Suppose that a rule set with error numbers looks like this:

  ```
  IF err_code == 10927 OR err_code == 10914 THEN drop.
  IF err_code == 1131 THEN drop.
  ```

  Using **perror**, determine the error symbols:

  ```
  $> perror 10927 10914 1131
  MySQL error code MY-010927 (ER_ACCESS_DENIED_FOR_USER_ACCOUNT_LOCKED):
  Access denied for user '%-.48s'@'%-.64s'. Account is locked.
  MySQL error code MY-010914 (ER_ABORTING_USER_CONNECTION):
  Aborted connection %u to db: '%-.192s' user: '%-.48s' host:
  '%-.64s' (%-.64s).
  MySQL error code MY-001131 (ER_PASSWORD_ANONYMOUS_USER):
  You are using MySQL as an anonymous user and anonymous users
  are not allowed to change passwords
  ```

  Substituting error symbols for numbers, the rule set becomes:

  ```
  IF err_code == ER_ACCESS_DENIED_FOR_USER_ACCOUNT_LOCKED
    OR err_code == ER_ABORTING_USER_CONNECTION THEN drop.
  IF err_code == ER_PASSWORD_ANONYMOUS_USER THEN drop.
  ```

Symbolic names can be specified as quoted strings for comparison with string fields, but in such cases the names are strings that have no special meaning and `log_filter_dragnet` does not resolve them to the corresponding numeric value. Also, typos may go undetected, whereas an error occurs immediately on `SET` for attempts to use an unquoted symbol unknown to the server.

##### Actions for log_filter_dragnet Rules

`log_filter_dragnet` supports these actions in filter rules:

* `drop`: Drop the current log event (do not log it).

* `throttle`: Apply rate limiting to reduce log verbosity for events matching particular conditions. The argument indicates a rate, in the form *`count`* or *`count`*/*`window_size`*. The *`count`* value indicates the permitted number of event occurrences to log per time window. The *`window_size`* value is the time window in seconds; if omitted, the default window is 60 seconds. Both values must be integer literals.

  This rule throttles plugin-shutdown messages to 5 occurrences per 60 seconds:

  ```
  IF err_code == ER_PLUGIN_SHUTTING_DOWN_PLUGIN THEN throttle 5.
  ```

  This rule throttles errors and warnings to 1000 occurrences per hour and information messages to 100 occurrences per hour:

  ```
  IF prio <= INFORMATION THEN throttle 1000/3600 ELSE throttle 100/3600.
  ```

* `set`: Assign a value to a field (and cause the field to exist if it did not already). In subsequent rules, `EXISTS` tests against the field name are true, and the new value can be tested by comparison conditions.

* `unset`: Discard a field. In subsequent rules, `EXISTS` tests against the field name are false, and comparisons of the field against any value are false.

  In the special case that the condition refers to exactly one field name, the field name following `unset` is optional and `unset` discards the named field. These rules are equivalent:

  ```
  IF myfield == 2 THEN unset myfield.
  IF myfield == 2 THEN unset.
  ```

##### Field References in log_filter_dragnet Rules

`log_filter_dragnet` rules support references to core, optional, and user-defined fields in error events.

* Core Field References
* Optional Field References
* User-Defined Field References

###### Core Field References

The `log_filter_dragnet` grammar at Grammar for log_filter_dragnet Rule Language names the core fields that filter rules recognize. For general descriptions of these fields, see Section 7.4.2.3, “Error Event Fields”, with which you are assumed to be familiar. The following remarks provide additional information only as it pertains specifically to core field references as used within `log_filter_dragnet` rules.

* `prio`

  The event priority, to indicate an error, warning, or note/information event. In comparisons, each priority can be specified as a symbolic priority name or an integer literal. Priority symbols are recognized only in comparisons with the `prio` field. These comparisons are equivalent:

  ```
  IF prio == INFORMATION THEN ...
  IF prio == 3 THEN ...
  ```

  The following table shows the permitted priority levels.

  <table summary="Error event priority levels."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th scope="col">Event Type</th> <th scope="col">Priority Symbol</th> <th scope="col">Numeric Priority</th> </tr></thead><tbody><tr> <th align="left" scope="row">Error event</th> <td><code>ERROR</code></td> <td>1</td> </tr><tr> <th align="left" scope="row">Warning event</th> <td><code>WARNING</code></td> <td>2</td> </tr><tr> <th align="left" scope="row">Note/information event</th> <td><code>INFORMATION</code></td> <td>3</td> </tr></tbody></table>

  There is also a message priority of `SYSTEM`, but system messages cannot be filtered and are always written to the error log.

  Priority values follow the principle that higher priorities have lower values, and vice versa. Priority values begin at 1 for the most severe events (errors) and increase for events with decreasing priority. For example, to discard events with priority lower than warnings, test for priority values higher than `WARNING`:

  ```
  IF prio > WARNING THEN drop.
  ```

  The following examples show the `log_filter_dragnet` rules to achieve an effect similar to each `log_error_verbosity` value permitted by the `log_filter_internal` filter:

  + Errors only (`log_error_verbosity=1`):

    ```
    IF prio > ERROR THEN drop.
    ```

  + Errors and warnings (`log_error_verbosity=2`):

    ```
    IF prio > WARNING THEN drop.
    ```

  + Errors, warnings, and notes (`log_error_verbosity=3`):

    ```
    IF prio > INFORMATION THEN drop.
    ```

    This rule can actually be omitted because there are no `prio` values greater than `INFORMATION`, so effectively it drops nothing.

* `err_code`

  The numeric event error code. In comparisons, the value to test can be specified as a symbolic error name or an integer literal. Error symbols are recognized only in comparisons with the `err_code` field and user-defined fields. These comparisons are equivalent:

  ```
  IF err_code == ER_ACCESS_DENIED_ERROR THEN ...
  IF err_code == 1045 THEN ...
  ```

* `err_symbol`

  The event error symbol, as a string (for example, `'ER_DUP_KEY'`). `err_symbol` values are intended more for identifying particular lines in log output than for use in filter rule comparisons because `log_filter_dragnet` does not resolve comparison values specified as strings to the equivalent numeric error code. (For that to occur, an error must be specified using its unquoted symbol.)

###### Optional Field References

The `log_filter_dragnet` grammar at Grammar for log_filter_dragnet Rule Language names the optional fields that filter rules recognize. For general descriptions of these fields, see Section 7.4.2.3, “Error Event Fields”, with which you are assumed to be familiar. The following remarks provide additional information only as it pertains specifically to optional field references as used within `log_filter_dragnet` rules.

* `label`

  The label corresponding to the `prio` value, as a string. Filter rules can change the label for log sinks that support custom labels. `label` values are intended more for identifying particular lines in log output than for use in filter rule comparisons because `log_filter_dragnet` does not resolve comparison values specified as strings to the equivalent numeric priority.

* `source_file`

  The source file in which the event occurred, without any leading path. For example, to test for the `sql/gis/distance.cc` file, write the comparison like this:

  ```
  IF source_file == "distance.cc" THEN ...
  ```

###### User-Defined Field References

Any field name in a `log_filter_dragnet` filter rule not recognized as a core or optional field name is taken to refer to a user-defined field.


#### 7.4.2.7 Error Logging in JSON Format

This section describes how to configure error logging using the built-in filter, `log_filter_internal`, and the JSON sink, `log_sink_json`, to take effect immediately and for subsequent server startups. For general information about configuring error logging, see Section 7.4.2.1, “Error Log Configuration”.

To enable the JSON sink, first load the sink component, then modify the `log_error_services` value:

```
INSTALL COMPONENT 'file://component_log_sink_json';
SET PERSIST log_error_services = 'log_filter_internal; log_sink_json';
```

To set `log_error_services` to take effect at server startup, use the instructions at Section 7.4.2.1, “Error Log Configuration”. Those instructions apply to other error-logging system variables as well.

It is permitted to name `log_sink_json` multiple times in the `log_error_services` value. For example, to write unfiltered events with one instance and filtered events with another instance, you could set `log_error_services` like this:

```
SET PERSIST log_error_services = 'log_sink_json; log_filter_internal; log_sink_json';
```

The JSON sink determines its output destination based on the default error log destination, which is given by the `log_error` system variable. If `log_error` names a file, the JSON sink bases output file naming on that file name, plus a numbered `.NN.json` suffix, with *`NN`* starting at 00. For example, if `log_error` is *`file_name`*, successive instances of `log_sink_json` named in the `log_error_services` value write to `file_name.00.json`, `file_name.01.json`, and so forth.

If `log_error` is `stderr`, the JSON sink writes to the console. If `log_sink_json` is named multiple times in the `log_error_services` value, they all write to the console, which is likely not useful.


#### 7.4.2.8 Error Logging to the System Log

It is possible to have **mysqld** write the error log to the system log (the Event Log on Windows, and `syslog` on Unix and Unix-like systems).

This section describes how to configure error logging using the built-in filter, `log_filter_internal`, and the system log sink, `log_sink_syseventlog`, to take effect immediately and for subsequent server startups. For general information about configuring error logging, see Section 7.4.2.1, “Error Log Configuration”.

To enable the system log sink, first load the sink component, then modify the `log_error_services` value:

```
INSTALL COMPONENT 'file://component_log_sink_syseventlog';
SET PERSIST log_error_services = 'log_filter_internal; log_sink_syseventlog';
```

To set `log_error_services` to take effect at server startup, use the instructions at Section 7.4.2.1, “Error Log Configuration”. Those instructions apply to other error-logging system variables as well.

Note

Error logging to the system log may require additional system configuration. Consult the system log documentation for your platform.

On Windows, error messages written to the Event Log within the Application log have these characteristics:

* Entries marked as `Error`, `Warning`, and `Note` are written to the Event Log, but not messages such as information statements from individual storage engines.

* Event Log entries have a source of `MySQL` (or `MySQL-tag` if `syseventlog.tag` is defined as *`tag`*).

On Unix and Unix-like systems, logging to the system log uses `syslog`. The following system variables affect `syslog` messages:

* `syseventlog.facility`: The default facility for `syslog` messages is `daemon`. Set this variable to specify a different facility.

* `syseventlog.include_pid`: Whether to include the server process ID in each line of `syslog` output.

* `syseventlog.tag`: This variable defines a tag to add to the server identifier (`mysqld`) in `syslog` messages. If defined, the tag is appended to the identifier with a leading hyphen.

MySQL uses the custom label “System” for important system messages about non-error situations, such as startup, shutdown, and some significant changes to settings. In logs that do not support custom labels, including the Event Log on Windows, and `syslog` on Unix and Unix-like systems, system messages are assigned the label used for the information priority level. However, these messages are printed to the log even if the MySQL `log_error_verbosity` setting normally excludes messages at the information level.

When a log sink must fall back to a label of “Information” instead of “System” in this way, and the log event is further processed outside of the MySQL server (for example, filtered or forwarded by a `syslog` configuration), these events may by default be processed by the secondary application as being of “Information” priority rather than “System” priority.


#### 7.4.2.9 Error Log Output Format

Each error log sink (writer) component has a characteristic output format it uses to write messages to its destination, but other factors may influence the content of the messages:

* The information available to the log sink. If a log filter component executed prior to execution of the sink component removes a log event field, that field is not available for writing. For information about log filtering, see Section 7.4.2.4, “Types of Error Log Filtering”.

* The information relevant to the log sink. Not every sink writes all fields available in error events.

* System variables may affect log sinks. See System Variables That Affect Error Log Format.

For names and descriptions of the fields in error events, see Section 7.4.2.3, “Error Event Fields”. For all log sinks, the thread ID included in error log messages is that of the thread within **mysqld** responsible for writing the message. This ID indicates which part of the server produced the message, and is consistent with general query log and slow query log messages, which include the connection thread ID.

* log_sink_internal Output Format
* log_sink_json Output Format
* log_sink_syseventlog Output Format
* Early-Startup Logging Output Format
* System Variables That Affect Error Log Format

##### log_sink_internal Output Format

The internal log sink produces traditional error log output. For example:

```
2020-08-06T14:25:02.835618Z 0 [Note] [MY-012487] [InnoDB] DDL log recovery : begin
2020-08-06T14:25:02.936146Z 0 [Warning] [MY-010068] [Server] CA certificate /var/mysql/sslinfo/cacert.pem is self signed.
2020-08-06T14:25:02.963127Z 0 [Note] [MY-010253] [Server] IPv6 is available.
2020-08-06T14:25:03.109022Z 5 [Note] [MY-010051] [Server] Event Scheduler: scheduler thread started with id 5
```

Traditional-format messages have these fields:

```
time thread [label] [err_code] [subsystem] msg
```

The `[` and `]` square bracket characters are literal characters in the message format. They do not indicate that fields are optional.

The `label` value corresponds to the string form of the `prio` error event priority field.

##### log_sink_json Output Format

The JSON-format log sink produces messages as JSON objects that contain key-value pairs. For example:

```
{
  "prio": 3,
  "err_code": 10051,
  "source_line": 561,
  "source_file": "event_scheduler.cc",
  "function": "run",
  "msg": "Event Scheduler: scheduler thread started with id 5",
  "time": "2020-08-06T14:25:03.109022Z",
  "ts": 1596724012005,
  "thread": 5,
  "err_symbol": "ER_SCHEDULER_STARTED",
  "SQL_state": "HY000",
  "subsystem": "Server",
  "buffered": 1596723903109022,
  "label": "Note"
}
```

The message shown is reformatted for readability. Events written to the error log appear one message per line.

The `ts` (timestamp) key is unique to the JSON-format log sink. The value is an integer indicating milliseconds since the epoch (`'1970-01-01 00:00:00'` UTC).

The `ts` and `buffered` values are Unix timestamp values and can be converted using `FROM_UNIXTIME()` and an appropriate divisor:

```
mysql> SET time_zone = '+00:00';
mysql> SELECT FROM_UNIXTIME(1596724012005/1000.0);
+-------------------------------------+
| FROM_UNIXTIME(1596724012005/1000.0) |
+-------------------------------------+
| 2020-08-06 14:26:52.0050            |
+-------------------------------------+
mysql> SELECT FROM_UNIXTIME(1596723903109022/1000000.0);
+-------------------------------------------+
| FROM_UNIXTIME(1596723903109022/1000000.0) |
+-------------------------------------------+
| 2020-08-06 14:25:03.1090                  |
+-------------------------------------------+
```

##### log_sink_syseventlog Output Format

The system log sink produces output that conforms to the system log format used on the local platform.

##### Early-Startup Logging Output Format

The server generates some error log messages before startup options have been processed, and thus before it knows error log settings such as the `log_error_verbosity` and `log_timestamps` system variable values, and before it knows which log components are to be used. The server handles error log messages that are generated early in the startup process as follows:

* The server buffers log events (rather than formatted log messages), which enables it to apply configuration settings to those events retroactively, after the settings are known, with the result that flushed messages use the configured settings, not the defaults. Also, messages are flushed to all configured sinks, not just the default sink.

  If a fatal error occurs before log configuration is known and the server must exit, the server formats buffered messages using the logging defaults so they are not lost. If no fatal error occurs but startup is excessively slow prior to processing startup options, the server periodically formats and flushes buffered messages using the logging defaults so as not to appear unresponsive. Although this behavior uses the defaults, it is preferable to losing messages when exceptional conditions occur.

##### System Variables That Affect Error Log Format

The `log_timestamps` system variable controls the time zone of timestamps in messages written to the error log (as well as to general query log and slow query log files). The server applies `log_timestamps` to error events before they reach any log sink; it thus affects error message output from all sinks.

Permitted `log_timestamps` values are `UTC` (the default) and `SYSTEM` (the local system time zone). Timestamps are written using ISO 8601 / RFC 3339 format: `YYYY-MM-DDThh:mm:ss.uuuuuu` plus a tail value of `Z` signifying Zulu time (UTC) or `±hh:mm` (an offset that indicates the local system time zone adjustment relative to UTC). For example:

```
2020-08-07T15:02:00.832521Z            (UTC)
2020-08-07T10:02:00.832521-05:00       (SYSTEM)
```


#### 7.4.2.10 Error Log File Flushing and Renaming

If you flush the error log using a [`FLUSH ERROR LOGS`](flush.html#flush-error-logs) or [`FLUSH LOGS`](flush.html#flush-logs) statement, or a [**mysqladmin flush-logs**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") command, the server closes and reopens any error log file to which it is writing. To rename an error log file, do so manually before flushing. Flushing the logs then opens a new file with the original file name. For example, assuming a log file name of `host_name.err`, use the following commands to rename the file and create a new one:

```
mv host_name.err host_name.err-old
mysqladmin flush-logs error
mv host_name.err-old backup-directory
```

On Windows, use **rename** rather than **mv**.

If the location of the error log file is not writable by the server, the log-flushing operation fails to create a new log file. For example, on Linux, the server might write the error log to the `/var/log/mysqld.log` file, where the `/var/log` directory is owned by `root` and is not writable by **mysqld**. For information about handling this case, see Section 7.4.6, “Server Log Maintenance”.

If the server is not writing to a named error log file, no error log file renaming occurs when the error log is flushed.


### 7.4.3 The General Query Log

The general query log is a general record of what **mysqld** is doing. The server writes information to this log when clients connect or disconnect, and it logs each SQL statement received from clients. The general query log can be very useful when you suspect an error in a client and want to know exactly what the client sent to **mysqld**.

Each line that shows when a client connects also includes `using connection_type` to indicate the protocol used to establish the connection. *`connection_type`* is one of `TCP/IP` (TCP/IP connection established without SSL), `SSL/TLS` (TCP/IP connection established with SSL), `Socket` (Unix socket file connection), `Named Pipe` (Windows named pipe connection), or `Shared Memory` (Windows shared memory connection).

**mysqld** writes statements to the query log in the order that it receives them, which might differ from the order in which they are executed. This logging order is in contrast with that of the binary log, for which statements are written after they are executed but before any locks are released. In addition, the query log may contain statements that only select data while such statements are never written to the binary log.

When using statement-based binary logging on a replication source server, statements received by its replicas are written to the query log of each replica. Statements are written to the query log of the source if a client reads events with the **mysqlbinlog** utility and passes them to the server.

However, when using row-based binary logging, updates are sent as row changes rather than SQL statements, and thus these statements are never written to the query log when `binlog_format` is `ROW`. A given update also might not be written to the query log when this variable is set to `MIXED`, depending on the statement used. See [Section 19.2.1.1, “Advantages and Disadvantages of Statement-Based and Row-Based Replication”](replication-sbr-rbr.html "19.2.1.1 Advantages and Disadvantages of Statement-Based and Row-Based Replication"), for more information.

By default, the general query log is disabled. To specify the initial general query log state explicitly, use `--general_log[={0|1}]`. With no argument or an argument of 1, `--general_log` enables the log. With an argument of 0, this option disables the log. To specify a log file name, use `--general_log_file=file_name`. To specify the log destination, use the `log_output` system variable (as described in Section 7.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”).

Note

If you specify the `TABLE` log destination, see Log Tables and “Too many open files” Errors.

If you specify no name for the general query log file, the default name is `host_name.log`. The server creates the file in the data directory unless an absolute path name is given to specify a different directory.

To disable or enable the general query log or change the log file name at runtime, use the global `general_log` and `general_log_file` system variables. Set `general_log` to 0 (or `OFF`) to disable the log or to 1 (or `ON`) to enable it. Set `general_log_file` to specify the name of the log file. If a log file already is open, it is closed and the new file is opened.

When the general query log is enabled, the server writes output to any destinations specified by the `log_output` system variable. If you enable the log, the server opens the log file and writes startup messages to it. However, further logging of queries to the file does not occur unless the `FILE` log destination is selected. If the destination is `NONE`, the server writes no queries even if the general log is enabled. Setting the log file name has no effect on logging if the log destination value does not contain `FILE`.

Server restarts and log flushing do not cause a new general query log file to be generated (although flushing closes and reopens it). To rename the file and create a new one, use the following commands:

```
$> mv host_name.log host_name-old.log
$> mysqladmin flush-logs general
$> mv host_name-old.log backup-directory
```

On Windows, use **rename** rather than **mv**.

You can also rename the general query log file at runtime by disabling the log:

```
SET GLOBAL general_log = 'OFF';
```

With the log disabled, rename the log file externally (for example, from the command line). Then enable the log again:

```
SET GLOBAL general_log = 'ON';
```

This method works on any platform and does not require a server restart.

To disable or enable general query logging for the current session, set the session `sql_log_off` variable to `ON` or `OFF`. (This assumes that the general query log itself is enabled.)

Passwords in statements written to the general query log are rewritten by the server not to occur literally in plain text. Password rewriting can be suppressed for the general query log by starting the server with the `--log-raw` option. This option may be useful for diagnostic purposes, to see the exact text of statements as received by the server, but for security reasons is not recommended for production use. See also Section 8.1.2.3, “Passwords and Logging”.

An implication of password rewriting is that statements that cannot be parsed (due, for example, to syntax errors) are not written to the general query log because they cannot be known to be password free. Use cases that require logging of all statements including those with errors should use the `--log-raw` option, bearing in mind that this also bypasses password rewriting.

Password rewriting occurs only when plain text passwords are expected. For statements with syntax that expect a password hash value, no rewriting occurs. If a plain text password is supplied erroneously for such syntax, the password is logged as given, without rewriting.

The `log_timestamps` system variable controls the time zone of timestamps in messages written to the general query log file (as well as to the slow query log file and the error log). It does not affect the time zone of general query log and slow query log messages written to log tables, but rows retrieved from those tables can be converted from the local system time zone to any desired time zone with `CONVERT_TZ()` or by setting the session `time_zone` system variable.


### 7.4.4 The Binary Log

The binary log contains “events” that describe database changes such as table creation operations or changes to table data. It also contains events for statements that potentially could have made changes (for example, a `DELETE` which matched no rows), unless row-based logging is used. The binary log also contains information about how long each statement took that updated data. The binary log has two important purposes:

* For replication, the binary log on a replication source server provides a record of the data changes to be sent to replicas. The source sends the information contained in its binary log to its replicas, which reproduce those transactions to make the same data changes that were made on the source. See Section 19.2, “Replication Implementation”.

* Certain data recovery operations require use of the binary log. After a backup has been restored, the events in the binary log that were recorded after the backup was made are re-executed. These events bring databases up to date from the point of the backup. See Section 9.5, “Point-in-Time (Incremental) Recovery” Recovery").

The binary log is not used for statements such as `SELECT` or `SHOW` that do not modify data. To log all statements (for example, to identify a problem query), use the general query log. See Section 7.4.3, “The General Query Log”.

Running a server with binary logging enabled makes performance slightly slower. However, the benefits of the binary log in enabling you to set up replication and for restore operations generally outweigh this minor performance decrement.

The binary log is resilient to unexpected halts. Only complete events or transactions are logged or read back.

Passwords in statements written to the binary log are rewritten by the server not to occur literally in plain text. See also Section 8.1.2.3, “Passwords and Logging”.

MySQL binary log files and relay log files can be encrypted, helping to protect these files and the potentially sensitive data contained in them from being misused by outside attackers, and also from unauthorized viewing by users of the operating system where they are stored. You enable encryption on a MySQL server by setting the `binlog_encryption` system variable to `ON`. For more information, see Section 19.3.2, “Encrypting Binary Log Files and Relay Log Files”.

The following discussion describes some of the server options and variables that affect the operation of binary logging. For a complete list, see Section 19.1.6.4, “Binary Logging Options and Variables”.

Binary logging is enabled by default (the `log_bin` system variable is set to ON). The exception is if you use **mysqld** to initialize the data directory manually by invoking it with the `--initialize` or `--initialize-insecure` option, when binary logging is disabled by default, but can be enabled by specifying the `--log-bin` option.

To disable binary logging, you can specify the `--skip-log-bin` or `--disable-log-bin` option at startup. If either of these options is specified and `--log-bin` is also specified, the option specified later takes precedence.

The `--log-replica-updates` and `--replica-preserve-commit-order` options require binary logging. If you disable binary logging, either omit these options, or specify `--log-replica-updates=OFF` and `--skip-replica-preserve-commit-order`. MySQL disables these options by default when `--skip-log-bin` or `--disable-log-bin` is specified. If you specify `--log-replica-updates` or `--replica-preserve-commit-order` together with `--skip-log-bin` or `--disable-log-bin`, a warning or error message is issued.

The `--log-bin[=base_name]` option is used to specify the base name for binary log files. If you do not supply the `--log-bin` option, MySQL uses `binlog` as the default base name for the binary log files. For compatibility with earlier releases, if you supply the `--log-bin` option with no string or with an empty string, the base name defaults to `host_name-bin`, using the name of the host machine. It is recommended that you specify a base name, so that if the host name changes, you can easily continue to use the same binary log file names (see Section B.3.7, “Known Issues in MySQL”). If you supply an extension in the log name (for example, `--log-bin=base_name.extension`), the extension is silently removed and ignored.

**mysqld** appends a numeric extension to the binary log base name to generate binary log file names. The number increases each time the server creates a new log file, thus creating an ordered series of files. The server creates a new file in the series each time any of the following events occurs:

* The server is started or restarted
* The server flushes the logs.
* The size of the current log file reaches `max_binlog_size`.

A binary log file may become larger than `max_binlog_size` if you are using large transactions because a transaction is written to the file in one piece, never split between files.

To keep track of which binary log files have been used, **mysqld** also creates a binary log index file that contains the names of the binary log files. By default, this has the same base name as the binary log file, with the extension `'.index'`. You can change the name of the binary log index file with the `--log-bin-index[=file_name]` option. You should not manually edit this file while **mysqld** is running; doing so would confuse **mysqld**.

The term “binary log file” generally denotes an individual numbered file containing database events. The term “binary log” collectively denotes the set of numbered binary log files plus the index file.

The default location for binary log files and the binary log index file is the data directory. You can use the `--log-bin` option to specify an alternative location, by adding a leading absolute path name to the base name to specify a different directory. When the server reads an entry from the binary log index file, which tracks the binary log files that have been used, it checks whether the entry contains a relative path. If it does, the relative part of the path is replaced with the absolute path set using the `--log-bin` option. An absolute path recorded in the binary log index file remains unchanged; in such a case, the index file must be edited manually to enable a new path or paths to be used. The binary log file base name and any specified path are available as the `log_bin_basename` system variable.

The server can be started with the default server ID when binary logging is enabled, but an informational message is issued if you do not specify a server ID explicitly using the `server_id` system variable. For servers that are used in a replication topology, you must specify a unique nonzero server ID for each server.

A client that has privileges sufficient to set restricted session system variables (see Section 7.1.9.1, “System Variable Privileges”) can disable binary logging of its own statements by using a [`SET sql_log_bin=OFF`](set-sql-log-bin.html "15.4.1.3 SET sql_log_bin Statement") statement.

By default, the server logs the length of the event as well as the event itself and uses this to verify that the event was written correctly. You can also cause the server to write checksums for the events by setting the `binlog_checksum` system variable. When reading back from the binary log, the source uses the event length by default, but can be made to use checksums if available by enabling `source_verify_checksum`. The replication I/O (receiver) thread on the replica also verifies events received from the source. You can cause the replication SQL (applier) thread to use checksums if available when reading from the relay log by enabling `replica_sql_verify_checksum`.

The format of the events recorded in the binary log is dependent on the binary logging format. Three format types are supported: row-based logging, statement-based logging and mixed-base logging. The binary logging format used depends on the MySQL version. For descriptions of the logging formats, see Section 7.4.4.1, “Binary Logging Formats”.

The server evaluates the `--binlog-do-db` and `--binlog-ignore-db` options in the same way as it does the `--replicate-do-db` and `--replicate-ignore-db` options. For information about how this is done, see Section 19.2.5.1, “Evaluation of Database-Level Replication and Binary Logging Options”.

A replica is started with `log_replica_updates` enabled by default, meaning that the replica writes to its own binary log any data modifications that are received from the source. The binary log must be enabled for this setting to work (see Section 19.1.6.3, “Replica Server Options and Variables”). This setting enables the replica to act as a source to other replicas.

You can delete all binary log files with the `RESET BINARY LOGS AND GTIDS` statement, or a subset of them with [`PURGE BINARY LOGS`](purge-binary-logs.html "15.4.1.1 PURGE BINARY LOGS Statement"). See Section 15.7.8.6, “RESET Statement”, and Section 15.4.1.1, “PURGE BINARY LOGS Statement”.

If you are using MySQL Replication, you should not delete old binary log files on the source until you are sure that no replica still needs to use them. For example, if your replicas never run more than three days behind, once a day you can execute **mysqladmin flush-logs binary** on the source and then remove any logs that are more than three days old. You can remove the files manually, but it is preferable to use `PURGE BINARY LOGS`, which also safely updates the binary log index file for you (and which can take a date argument). See Section 15.4.1.1, “PURGE BINARY LOGS Statement”.

You can display the contents of binary log files with the **mysqlbinlog** utility. This can be useful when you want to reprocess statements in the log for a recovery operation. For example, you can update a MySQL server from the binary log as follows:

```
$> mysqlbinlog log_file | mysql -h server_name
```

**mysqlbinlog** also can be used to display the contents of the relay log file on a replica, because they are written using the same format as binary log files. For more information on the **mysqlbinlog** utility and how to use it, see Section 6.6.9, “mysqlbinlog — Utility for Processing Binary Log Files”. For more information about the binary log and recovery operations, see Section 9.5, “Point-in-Time (Incremental) Recovery” Recovery").

Binary logging is done immediately after a statement or transaction completes but before any locks are released or any commit is done. This ensures that the log is logged in commit order.

Updates to nontransactional tables are stored in the binary log immediately after execution.

Within an uncommitted transaction, all updates (`UPDATE`, `DELETE`, or `INSERT`) that change transactional tables such as `InnoDB` tables are cached until a `COMMIT` statement is received by the server. At that point, **mysqld** writes the entire transaction to the binary log before the `COMMIT` is executed.

Modifications to nontransactional tables cannot be rolled back. If a transaction that is rolled back includes modifications to nontransactional tables, the entire transaction is logged with a `ROLLBACK` statement at the end to ensure that the modifications to those tables are replicated.

When a thread that handles the transaction starts, it allocates a buffer of `binlog_cache_size` to buffer statements. If a statement is bigger than this, the thread opens a temporary file to store the transaction. The temporary file is deleted when the thread ends. If binary log encryption is active on the server, the temporary file is encrypted.

The `Binlog_cache_use` status variable shows the number of transactions that used this buffer (and possibly a temporary file) for storing statements. The `Binlog_cache_disk_use` status variable shows how many of those transactions actually had to use a temporary file. These two variables can be used for tuning `binlog_cache_size` to a large enough value that avoids the use of temporary files.

The `max_binlog_cache_size` system variable (default 4GB, which is also the maximum) can be used to restrict the total size used to cache a multiple-statement transaction. If a transaction is larger than this many bytes, it fails and rolls back. The minimum value is 4096.

If you are using the binary log and row based logging, concurrent inserts are converted to normal inserts for `CREATE ... SELECT` or [`INSERT ... SELECT`](insert-select.html "15.2.7.1 INSERT ... SELECT Statement") statements. This is done to ensure that you can re-create an exact copy of your tables by applying the log during a backup operation. If you are using statement-based logging, the original statement is written to the log.

The binary log format has some known limitations that can affect recovery from backups. See Section 19.5.1, “Replication Features and Issues”.

Binary logging for stored programs is done as described in Section 27.9, “Stored Program Binary Logging”.

Note that the binary log format differs in MySQL 9.5 from previous versions of MySQL, due to enhancements in replication. See Section 19.5.2, “Replication Compatibility Between MySQL Versions”.

If the server is unable to write to the binary log, flush binary log files, or synchronize the binary log to disk, the binary log on the replication source server can become inconsistent and replicas can lose synchronization with the source. The `binlog_error_action` system variable controls the action taken if an error of this type is encountered with the binary log.

* The default setting, `ABORT_SERVER`, makes the server halt binary logging and shut down. At this point, you can identify and correct the cause of the error. On restart, recovery proceeds as in the case of an unexpected server halt (see Section 19.4.2, “Handling an Unexpected Halt of a Replica”).

* The setting `IGNORE_ERROR` provides backward compatibility with older versions of MySQL. With this setting, the server continues the ongoing transaction and logs the error, then halts binary logging, but continues to perform updates. At this point, you can identify and correct the cause of the error. To resume binary logging, `log_bin` must be enabled again, which requires a server restart. Only use this option if you require backward compatibility, and the binary log is non-essential on this MySQL server instance. For example, you might use the binary log only for intermittent auditing or debugging of the server, and not use it for replication from the server or rely on it for point-in-time restore operations.

By default, the binary log is synchronized to disk at each write (`sync_binlog=1`). If `sync_binlog` was not enabled, and the operating system or machine (not only the MySQL server) crashed, there is a chance that the last statements of the binary log could be lost. To prevent this, enable the `sync_binlog` system variable to synchronize the binary log to disk after every *`N`* commit groups. See Section 7.1.8, “Server System Variables”. The safest value for `sync_binlog` is 1 (the default), but this is also the slowest.

In earlier MySQL releases, there was a chance of inconsistency between the table content and binary log content if a crash occurred, even with `sync_binlog` set to 1. For example, if you are using `InnoDB` tables and the MySQL server processes a `COMMIT` statement, it writes many prepared transactions to the binary log in sequence, synchronizes the binary log, and then commits the transaction into `InnoDB`. If the server unexpectedly exited between those two operations, the transaction would be rolled back by `InnoDB` at restart but still exist in the binary log. Such an issue was resolved in previous releases by enabling `InnoDB` support for two-phase commit in XA transactions. In MySQL 9.5, `InnoDB` support for two-phase commit in XA transactions is always enabled.

`InnoDB` support for two-phase commit in XA transactions ensures that the binary log and `InnoDB` data files are synchronized. However, the MySQL server should also be configured to synchronize the binary log and the `InnoDB` logs to disk before committing the transaction. The `InnoDB` logs are synchronized by default, and `sync_binlog=1` ensures the binary log is synchronized. The effect of implicit `InnoDB` support for two-phase commit in XA transactions and `sync_binlog=1` is that at restart after a crash, after doing a rollback of transactions, the MySQL server scans the latest binary log file to collect transaction *`xid`* values and calculate the last valid position in the binary log file. The MySQL server then tells `InnoDB` to complete any prepared transactions that were successfully written to the to the binary log, and truncates the binary log to the last valid position. This ensures that the binary log reflects the exact data of `InnoDB` tables, and therefore the replica remains in synchrony with the source because it does not receive a statement which has been rolled back.

If the MySQL server discovers at crash recovery that the binary log is shorter than it should have been, it lacks at least one successfully committed `InnoDB` transaction. This should not happen if `sync_binlog=1` and the disk/file system do an actual sync when they are requested to (some do not), so the server prints an error message `The binary log file_name is shorter than its expected size`. In this case, this binary log is not correct and replication should be restarted from a fresh snapshot of the source's data.

The session values of the following system variables are written to the binary log and honored by the replica when parsing the binary log:

* `sql_mode` (except that the `NO_DIR_IN_CREATE` mode is not replicated; see Section 19.5.1.40, “Replication and Variables”)

* `foreign_key_checks`
* `unique_checks`
* `character_set_client`
* `collation_connection`
* `collation_database`
* `collation_server`
* `sql_auto_is_null`


#### 7.4.4.1 Binary Logging Formats

The server uses several logging formats to record information in the binary log:

* Replication capabilities in MySQL originally were based on propagation of SQL statements from source to replica. This is called *statement-based logging*. You can cause this format to be used by starting the server with `--binlog-format=STATEMENT`.

* In *row-based logging* (the default), the source writes events to the binary log that indicate how individual table rows are affected. You can cause the server to use row-based logging by starting it with `--binlog-format=ROW`.

* A third option is also available: *mixed logging*. With mixed logging, statement-based logging is used by default, but the logging mode switches automatically to row-based in certain cases as described below. You can cause MySQL to use mixed logging explicitly by starting **mysqld** with the option `--binlog-format=MIXED`.

The logging format can also be set or limited by the storage engine being used. This helps to eliminate issues when replicating certain statements between a source and replica which are using different storage engines.

With statement-based replication, there may be issues with replicating nondeterministic statements. In deciding whether or not a given statement is safe for statement-based replication, MySQL determines whether it can guarantee that the statement can be replicated using statement-based logging. If MySQL cannot make this guarantee, it marks the statement as potentially unreliable and issues the warning, Statement may not be safe to log in statement format.

You can avoid these issues by using MySQL's row-based replication instead.


#### 7.4.4.2 Setting The Binary Log Format

You can select the binary logging format explicitly by starting the MySQL server with `--binlog-format=type`. The supported values for *`type`* are:

* `STATEMENT` causes logging to be statement based.

* `ROW` causes logging to be row based. This is the default.

* `MIXED` causes logging to use mixed format.

Setting the binary logging format does not activate binary logging for the server. The setting only takes effect when binary logging is enabled on the server, which is the case when the `log_bin` system variable is set to `ON`. In MySQL 9.5, binary logging is enabled by default, and is disabled only if you start the server with `--skip-log-bin` or `--disable-log-bin`.

The logging format also can be switched at runtime, although note that there are a number of situations in which you cannot do this, as discussed later in this section. Set the global value of the `binlog_format` system variable to specify the format for clients that connect subsequent to the change:

```
mysql> SET GLOBAL binlog_format = 'STATEMENT';
mysql> SET GLOBAL binlog_format = 'ROW';
mysql> SET GLOBAL binlog_format = 'MIXED';
```

An individual client can control the logging format for its own statements by setting the session value of `binlog_format`:

```
mysql> SET SESSION binlog_format = 'STATEMENT';
mysql> SET SESSION binlog_format = 'ROW';
mysql> SET SESSION binlog_format = 'MIXED';
```

Changing the global `binlog_format` value requires privileges sufficient to set global system variables. Changing the session `binlog_format` value requires privileges sufficient to set restricted session system variables. See Section 7.1.9.1, “System Variable Privileges”.

There are several reasons why a client might want to set binary logging on a per-session basis:

* A session that makes many small changes to the database might want to use row-based logging.

* A session that performs updates that match many rows in the `WHERE` clause might want to use statement-based logging because it is more efficient to log a few statements than many rows.

* Some statements require a lot of execution time on the source, but result in just a few rows being modified. It might therefore be beneficial to replicate them using row-based logging.

There are exceptions when you cannot switch the replication format at runtime:

* The replication format cannot be changed from within a stored function or a trigger.

* If the `NDB` storage engine is enabled.

* If a session has open temporary tables, the replication format cannot be changed for the session (`SET @@SESSION.binlog_format`).

* If any replication channel has open temporary tables, the replication format cannot be changed globally (`SET @@GLOBAL.binlog_format` or `SET @@PERSIST.binlog_format`).

* If any replication channel applier thread is currently running, the replication format cannot be changed globally (`SET @@GLOBAL.binlog_format` or `SET @@PERSIST.binlog_format`).

Trying to switch the replication format in any of these cases (or attempting to set the current replication format) results in an error. You can, however, use `PERSIST_ONLY` (`SET @@PERSIST_ONLY.binlog_format`) to change the replication format at any time, because this action does not modify the runtime global system variable value, and takes effect only after a server restart.

Switching the replication format at runtime is not recommended when any temporary tables exist, because temporary tables are logged only when using statement-based replication, whereas with row-based replication and mixed replication, they are not logged.

Switching the replication format while replication is ongoing can also cause issues. Each MySQL Server can set its own and only its own binary logging format (true whether `binlog_format` is set with global or session scope). This means that changing the logging format on a replication source server does not cause a replica to change its logging format to match. When using `STATEMENT` mode, the `binlog_format` system variable is not replicated. When using `MIXED` or `ROW` logging mode, it is replicated but is ignored by the replica.

A replica is not able to convert binary log entries received in `ROW` logging format to `STATEMENT` format for use in its own binary log. The replica must therefore use `ROW` or `MIXED` format if the source does. Changing the binary logging format on the source from `STATEMENT` to `ROW` or `MIXED` while replication is ongoing to a replica with `STATEMENT` format can cause replication to fail with errors such as Error executing row event: 'Cannot execute statement: impossible to write to binary log since statement is in row format and BINLOG_FORMAT = STATEMENT.' Changing the binary logging format on the replica to `STATEMENT` format when the source is still using `MIXED` or `ROW` format also causes the same type of replication failure. To change the format safely, you must stop replication and ensure that the same change is made on both the source and the replica.

If you are using `InnoDB` tables and the transaction isolation level is [`READ COMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-committed) or [`READ UNCOMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-uncommitted), only row-based logging can be used. It is *possible* to change the logging format to `STATEMENT`, but doing so at runtime leads very rapidly to errors because `InnoDB` can no longer perform inserts.

With the binary log format set to `ROW`, many changes are written to the binary log using the row-based format. Some changes, however, still use the statement-based format. Examples include all DDL (data definition language) statements such as `CREATE TABLE`, `ALTER TABLE`, or `DROP TABLE`.

When row-based binary logging is used, the `binlog_row_event_max_size` system variable and its corresponding startup option `--binlog-row-event-max-size` set a soft limit on the maximum size of row events. The default value is 8192 bytes, and the value can only be changed at server startup. Where possible, rows stored in the binary log are grouped into events with a size not exceeding the value of this setting. If an event cannot be split, the maximum size can be exceeded.

The `--binlog-row-event-max-size` option is available for servers that are capable of row-based replication. Rows are stored into the binary log in chunks having a size in bytes not exceeding the value of this option. The value must be a multiple of 256. The default value is 8192.

Warning

When using *statement-based logging* for replication, it is possible for the data on the source and replica to become different if a statement is designed in such a way that the data modification is nondeterministic; that is, it is left up to the query optimizer. In general, this is not a good practice even outside of replication. For a detailed explanation of this issue, see Section B.3.7, “Known Issues in MySQL”.


#### 7.4.4.3 Mixed Binary Logging Format

When running in `MIXED` logging format, the server automatically switches from statement-based to row-based logging under the following conditions:

* When a function contains `UUID()`.

* When one or more tables with `AUTO_INCREMENT` columns are updated and a trigger or stored function is invoked. Like all other unsafe statements, this generates a warning if `binlog_format = STATEMENT`.

  For more information, see Section 19.5.1.1, “Replication and AUTO_INCREMENT”.

* When the body of a view requires row-based replication, the statement creating the view also uses it. For example, this occurs when the statement creating a view uses the `UUID()` function.

* When a call to a loadable function is involved.
* When `FOUND_ROWS()` or `ROW_COUNT()` is used. (Bug #12092, Bug #30244)

* When `USER()`, `CURRENT_USER()`, or `CURRENT_USER` is used. (Bug #28086)

* When one of the tables involved is a log table in the `mysql` database.

* When the `LOAD_FILE()` function is used. (Bug #39701)

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

  For information about determining system variable scope, see Section 7.1.9, “Using System Variables”.

  For information about how replication treats `sql_mode`, see Section 19.5.1.40, “Replication and Variables”.

In releases prior to MySQL 8.0, when mixed binary logging format was in use, if a statement was logged by row and the session that executed the statement had any temporary tables, all subsequent statements were treated as unsafe and logged in row-based format until all temporary tables in use by that session were dropped. In MySQL 9.5, operations on temporary tables are not logged in mixed binary logging format, and the presence of temporary tables in the session has no impact on the logging mode used for each statement.

Note

A warning is generated if you try to execute a statement using statement-based logging that should be written using row-based logging. The warning is shown both in the client (in the output of `SHOW WARNINGS`) and through the **mysqld** error log. A warning is added to the `SHOW WARNINGS` table each time such a statement is executed. However, only the first statement that generated the warning for each client session is written to the error log to prevent flooding the log.

In addition to the decisions above, individual engines can also determine the logging format used when information in a table is updated. The logging capabilities of an individual engine can be defined as follows:

* If an engine supports row-based logging, the engine is said to be row-logging capable.

* If an engine supports statement-based logging, the engine is said to be statement-logging capable.

A given storage engine can support either or both logging formats. The following table lists the formats supported by each engine.

<table summary="Logging formats supported by each storage engine."><col style="width: 50%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th scope="col">Storage Engine</th> <th scope="col">Row Logging Supported</th> <th scope="col">Statement Logging Supported</th> </tr></thead><tbody><tr> <th scope="row"><code>ARCHIVE</code></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row"><code>BLACKHOLE</code></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row"><code>CSV</code></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row"><code>EXAMPLE</code></th> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row"><code>FEDERATED</code></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row"><code>HEAP</code></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row"><code>InnoDB</code></th> <td>Yes</td> <td>Yes when the transaction isolation level is <code>REPEATABLE READ</code> or <code>SERIALIZABLE</code>; No otherwise.</td> </tr><tr> <th scope="row"><code>MyISAM</code></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row"><code>MERGE</code></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row"><code>NDB</code></th> <td>Yes</td> <td>No</td> </tr></tbody></table>

Whether a statement is to be logged and the logging mode to be used is determined according to the type of statement (safe, unsafe, or binary injected), the binary logging format (`STATEMENT`, `ROW`, or `MIXED`), and the logging capabilities of the storage engine (statement capable, row capable, both, or neither). (Binary injection refers to logging a change that must be logged using `ROW` format.)

Statements may be logged with or without a warning; failed statements are not logged, but generate errors in the log. This is shown in the following decision table. **Type**, **binlog_format**, **SLC**, and **RLC** columns outline the conditions, and **Error / Warning** and **Logged as** columns represent the corresponding actions. **SLC** stands for “statement-logging capable”, and **RLC** stands for “row-logging capable”.

<table summary="The information in this table is used to determine if a statement is to be logged and the logging mode to be used. The table outlines conditions (Safe/unsafe, binlog_format, SLC, RLR) and corresponding actions."><col style="width: 10%"/><col style="width: 25%"/><col style="width: 10%"/><col style="width: 10%"/><col style="width: 20%"/><col style="width: 25%"/><thead><tr> <th scope="col">Type</th> <th scope="col"><code>binlog_format</code></th> <th scope="col">SLC</th> <th scope="col">RLC</th> <th scope="col">Error / Warning</th> <th scope="col">Logged as</th> </tr></thead><tbody><tr> <th scope="row">*</th> <td><code>*</code></td> <td>No</td> <td>No</td> <td>Error: Cannot execute statement: Binary logging is impossible since at least one engine is involved that is both row-incapable and statement-incapable.</td> <td><code>-</code></td> </tr><tr> <th scope="row">Safe</th> <td><code>STATEMENT</code></td> <td>Yes</td> <td>No</td> <td>-</td> <td><code>STATEMENT</code></td> </tr><tr> <th scope="row">Safe</th> <td><code>MIXED</code></td> <td>Yes</td> <td>No</td> <td>-</td> <td><code>STATEMENT</code></td> </tr><tr> <th scope="row">Safe</th> <td><code>ROW</code></td> <td>Yes</td> <td>No</td> <td>Error: Cannot execute statement: Binary logging is impossible since <code>BINLOG_FORMAT = ROW</code> and at least one table uses a storage engine that is not capable of row-based logging.</td> <td><code>-</code></td> </tr><tr> <th scope="row">Unsafe</th> <td><code>STATEMENT</code></td> <td>Yes</td> <td>No</td> <td>Warning: Unsafe statement binlogged in statement format, since <code>BINLOG_FORMAT = STATEMENT</code></td> <td><code>STATEMENT</code></td> </tr><tr> <th scope="row">Unsafe</th> <td><code>MIXED</code></td> <td>Yes</td> <td>No</td> <td>Error: Cannot execute statement: Binary logging of an unsafe statement is impossible when the storage engine is limited to statement-based logging, even if <code>BINLOG_FORMAT = MIXED</code>.</td> <td><code>-</code></td> </tr><tr> <th scope="row">Unsafe</th> <td><code>ROW</code></td> <td>Yes</td> <td>No</td> <td>Error: Cannot execute statement: Binary logging is impossible since <code>BINLOG_FORMAT = ROW</code> and at least one table uses a storage engine that is not capable of row-based logging.</td> <td>-</td> </tr><tr> <th scope="row">Row Injection</th> <td><code>STATEMENT</code></td> <td>Yes</td> <td>No</td> <td>Error: Cannot execute row injection: Binary logging is not possible since at least one table uses a storage engine that is not capable of row-based logging.</td> <td>-</td> </tr><tr> <th scope="row">Row Injection</th> <td><code>MIXED</code></td> <td>Yes</td> <td>No</td> <td>Error: Cannot execute row injection: Binary logging is not possible since at least one table uses a storage engine that is not capable of row-based logging.</td> <td>-</td> </tr><tr> <th scope="row">Row Injection</th> <td><code>ROW</code></td> <td>Yes</td> <td>No</td> <td>Error: Cannot execute row injection: Binary logging is not possible since at least one table uses a storage engine that is not capable of row-based logging.</td> <td>-</td> </tr><tr> <th scope="row">Safe</th> <td><code>STATEMENT</code></td> <td>No</td> <td>Yes</td> <td>Error: Cannot execute statement: Binary logging is impossible since <code>BINLOG_FORMAT = STATEMENT</code> and at least one table uses a storage engine that is not capable of statement-based logging.</td> <td><code>-</code></td> </tr><tr> <th scope="row">Safe</th> <td><code>MIXED</code></td> <td>No</td> <td>Yes</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th scope="row">Safe</th> <td><code>ROW</code></td> <td>No</td> <td>Yes</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th scope="row">Unsafe</th> <td><code>STATEMENT</code></td> <td>No</td> <td>Yes</td> <td>Error: Cannot execute statement: Binary logging is impossible since <code>BINLOG_FORMAT = STATEMENT</code> and at least one table uses a storage engine that is not capable of statement-based logging.</td> <td>-</td> </tr><tr> <th scope="row">Unsafe</th> <td><code>MIXED</code></td> <td>No</td> <td>Yes</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th scope="row">Unsafe</th> <td><code>ROW</code></td> <td>No</td> <td>Yes</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th scope="row">Row Injection</th> <td><code>STATEMENT</code></td> <td>No</td> <td>Yes</td> <td>Error: Cannot execute row injection: Binary logging is not possible since <code>BINLOG_FORMAT = STATEMENT</code>.</td> <td><code>-</code></td> </tr><tr> <th scope="row">Row Injection</th> <td><code>MIXED</code></td> <td>No</td> <td>Yes</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th scope="row">Row Injection</th> <td><code>ROW</code></td> <td>No</td> <td>Yes</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th scope="row">Safe</th> <td><code>STATEMENT</code></td> <td>Yes</td> <td>Yes</td> <td>-</td> <td><code>STATEMENT</code></td> </tr><tr> <th scope="row">Safe</th> <td><code>MIXED</code></td> <td>Yes</td> <td>Yes</td> <td>-</td> <td><code>STATEMENT</code></td> </tr><tr> <th scope="row">Safe</th> <td><code>ROW</code></td> <td>Yes</td> <td>Yes</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th scope="row">Unsafe</th> <td><code>STATEMENT</code></td> <td>Yes</td> <td>Yes</td> <td>Warning: Unsafe statement binlogged in statement format since <code>BINLOG_FORMAT = STATEMENT</code>.</td> <td><code>STATEMENT</code></td> </tr><tr> <th scope="row">Unsafe</th> <td><code>MIXED</code></td> <td>Yes</td> <td>Yes</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th scope="row">Unsafe</th> <td><code>ROW</code></td> <td>Yes</td> <td>Yes</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th scope="row">Row Injection</th> <td><code>STATEMENT</code></td> <td>Yes</td> <td>Yes</td> <td>Error: Cannot execute row injection: Binary logging is not possible because <code>BINLOG_FORMAT = STATEMENT</code>.</td> <td>-</td> </tr><tr> <th scope="row">Row Injection</th> <td><code>MIXED</code></td> <td>Yes</td> <td>Yes</td> <td>-</td> <td><code>ROW</code></td> </tr><tr> <th scope="row">Row Injection</th> <td><code>ROW</code></td> <td>Yes</td> <td>Yes</td> <td>-</td> <td><code>ROW</code></td> </tr></tbody></table>

When a warning is produced by the determination, a standard MySQL warning is produced (and is available using `SHOW WARNINGS`). The information is also written to the **mysqld** error log. Only one error for each error instance per client connection is logged to prevent flooding the log. The log message includes the SQL statement that was attempted.

If a replica has `log_error_verbosity` set to display warnings, the replica prints messages to the error log to provide information about its status, such as the binary log and relay log coordinates where it starts its job, when it is switching to another relay log, when it reconnects after a disconnect, statements that are unsafe for statement-based logging, and so forth.


#### 7.4.4.4 Logging Format for Changes to mysql Database Tables

The contents of the grant tables in the `mysql` database can be modified directly (for example, with `INSERT` or `DELETE`) or indirectly (for example, with `GRANT` or `CREATE USER`). Statements that affect `mysql` database tables are written to the binary log using the following rules:

* Data manipulation statements that change data in `mysql` database tables directly are logged according to the setting of the `binlog_format` system variable. This pertains to statements such as `INSERT`, `UPDATE`, `DELETE`, `REPLACE`, `DO`, [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement"), `SELECT`, and `TRUNCATE TABLE`.

* Statements that change the `mysql` database indirectly are logged as statements regardless of the value of `binlog_format`. This pertains to statements such as `GRANT`, `REVOKE`, `SET PASSWORD`, `RENAME USER`, `CREATE` (all forms except [`CREATE TABLE ... SELECT`](create-table.html "15.1.24 CREATE TABLE Statement")), `ALTER` (all forms), and `DROP` (all forms).

[`CREATE TABLE ... SELECT`](create-table.html "15.1.24 CREATE TABLE Statement") is a combination of data definition and data manipulation. The `CREATE TABLE` part is logged using statement format and the `SELECT` part is logged according to the value of `binlog_format`.


#### 7.4.4.5 Binary Log Transaction Compression

MySQL supports binary log transaction compression; when this is enabled, transaction payloads are compressed using the `zstd` algorithm, and then written to the server's binary log file as a single event (a `Transaction_payload_event`).

Compressed transaction payloads remain in a compressed state while they are sent in the replication stream to replicas, other Group Replication group members, or clients such as **mysqlbinlog**. They are not decompressed by receiver threads, and are written to the relay log still in their compressed state. Binary log transaction compression therefore saves storage space both on the originator of the transaction and on the recipient (and for their backups), and saves network bandwidth when the transactions are sent between server instances.

Compressed transaction payloads are decompressed when the individual events contained in them need to be inspected. For example, the `Transaction_payload_event` is decompressed by an applier thread in order to apply the events it contains on the recipient. Decompression is also carried out during recovery, by **mysqlbinlog** when replaying transactions, and by the [`SHOW BINLOG EVENTS`](show-binlog-events.html "15.7.7.3 SHOW BINLOG EVENTS Statement") and [`SHOW RELAYLOG EVENTS`](show-relaylog-events.html "15.7.7.35 SHOW RELAYLOG EVENTS Statement") statements.

You can enable binary log transaction compression on a MySQL server instance using the `binlog_transaction_compression` system variable, which defaults to `OFF`. You can also use the `binlog_transaction_compression_level_zstd` system variable to set the level for the zstd algorithm that is used for compression. This value determines the compression effort, from 1 (the lowest effort) to 22 (the highest effort). As the compression level increases, the compression ratio increases, which reduces the storage space and network bandwidth required for the transaction payload. However, the effort required for data compression also increases, taking time and CPU and memory resources on the originating server. Increases in the compression effort do not have a linear relationship to increases in the compression ratio.

Setting `binlog_transaction_compression` or `binlog_transaction_compression_level_zstd` (or both) has no immediate effect but rather applies to all subsequent `START REPLICA` statements.

Note

You can enable binary logging of compressed transactions for tables using the `NDB` storage engine at run time using the `ndb_log_transaction_compression` system variable, and control the level of compression using `ndb_log_transaction_compression_level_zstd`. Starting **mysqld** with `--binlog-transaction-compression` on the command line or in a `my.cnf` file causes `ndb_log_transaction_compression` to be enabled automatically and any setting for the `--ndb-log-transaction-compression` option to be ignored; to disable binary log transaction compression for the `NDB` storage engine *only*, set `ndb_log_transaction_compression=OFF` in a client session after starting **mysqld**.

The following types of event are excluded from binary log transaction compression, so are always written uncompressed to the binary log:

* Events relating to the GTID for the transaction (including anonymous GTID events).

* Other types of control event, such as view change events and heartbeat events.

* Incident events and the whole of any transactions that contain them.

* Non-transactional events and the whole of any transactions that contain them. A transaction involving a mix of non-transactional and transactional storage engines does not have its payload compressed.

* Events that are logged using statement-based binary logging. Binary log transaction compression is only applied for the row-based binary logging format.

Binary log encryption can be used on binary log files that contain compressed transactions.

##### 7.4.4.5.1 Behaviors When Binary Log Transaction Compression is Enabled

Transactions with payloads that are compressed can be rolled back like any other transaction, and they can also be filtered out on a replica by the usual filtering options. Binary log transaction compression can be applied to XA transactions.

When binary log transaction compression is enabled, the `max_allowed_packet` and `replica_max_allowed_packet` limits for the server still apply, and are measured on the compressed size of the `Transaction_payload_event`, plus the bytes used for the event header.

Important

Compressed transaction payloads are sent as a single packet, rather than each event of the transaction being sent in an individual packet, as is the case when binary log transaction compression is not in use. In case the compressed transaction packet exceeds the maximum packet size used in replication, which is 1 GiB, the source server writes the transaction uncompressed, so that it can be sent in smaller pieces.

For multithreaded workers, each transaction (including its GTID event and `Transaction_payload_event`) is assigned to a worker thread. The worker thread decompresses the transaction payload and applies the individual events in it one by one. If an error is found applying any event within the `Transaction_payload_event`, the complete transaction is reported to the co-ordinator as having failed.

For semisynchronous replication (see Section 19.4.10, “Semisynchronous Replication”), the replica acknowledges the transaction when the complete `Transaction_payload_event` has been received.

When binary log checksums are enabled (which is the default), the replication source server does not write checksums for individual events in a compressed transaction payload. Instead, a checksum is written for the complete `Transaction_payload_event`, and individual checksums are written for any events that were not compressed, such as events relating to GTIDs.

For the `SHOW BINLOG EVENTS` and `SHOW RELAYLOG EVENTS` statements, the `Transaction_payload_event` is first printed as a single unit, then it is unpacked and each event inside it is printed.

For operations that reference the end position of an event, such as [`START REPLICA`](start-replica.html "15.4.2.4 START REPLICA Statement") with the `UNTIL` clause, `SOURCE_POS_WAIT()`, and `sql_replica_skip_counter`, you must specify the end position of the compressed transaction payload (the `Transaction_payload_event`). When skipping events using `sql_replica_skip_counter`, a compressed transaction payload is counted as a single counter value, so all the events inside it are skipped as a unit.

##### 7.4.4.5.2 Combining Compressed and Uncompressed Transaction Payloads

MySQL Server releases that support binary log transaction compression can handle a mix of compressed and uncompressed transaction payloads.

* The system variables relating to binary log transaction compression do not need to be set the same on all Group Replication group members, and are not replicated from sources to replicas in a replication topology. You can decide whether or not binary log transaction compression is appropriate for each MySQL Server instance that has a binary log.

* If transaction compression is enabled then disabled on a server, compression is not applied to future transactions originated on that server, but transaction payloads that have been compressed can still be handled and displayed.

* If transaction compression is specified for individual sessions by setting the session value of `binlog_transaction_compression`, the binary log can contain a mix of compressed and uncompressed transaction payloads.

When a source in a replication topology and its replica both have binary log transaction compression enabled, the replica receives compressed transaction payloads and writes them compressed to its relay log. It decompresses the transaction payloads to apply the transactions, and then compresses them again after applying for writing to its binary log. Any downstream replicas receive the compressed transaction payloads.

When a source in a replication topology has binary log transaction compression enabled but its replica does not, the replica receives compressed transaction payloads and writes them compressed to its relay log. It decompresses the transaction payloads to apply the transactions, and then writes them uncompressed to its own binary log, if it has one. Any downstream replicas receive the uncompressed transaction payloads.

When a source in a replication topology does not have binary log transaction compression enabled but its replica does, if the replica has a binary log, it compresses the transaction payloads after applying them, and writes the compressed transaction payloads to its binary log. Any downstream replicas receive the compressed transaction payloads.

When a MySQL server instance has no binary log, it can receive, handle, and display compressed transaction payloads regardless of its value for `binlog_transaction_compression`. Compressed transaction payloads received by such server instances are written in their compressed state to the relay log, so they benefit indirectly from compression that was carried out by other servers in the replication topology.

##### 7.4.4.5.3 Monitoring Binary Log Transaction Compression

You can monitor the effects of binary log transaction compression using the Performance Schema table `binary_log_transaction_compression_stats`. The statistics include the data compression ratio for the monitored period, and you can also view the effect of compression on the last transaction on the server. You can reset the statistics by truncating the table. Statistics for binary logs and relay logs are split out so you can see the impact of compression for each log type. The MySQL server instance must have a binary log to produce these statistics.

The Performance Schema table `events_stages_current` shows when a transaction is in the stage of decompression or compression for its transaction payload, and displays its progress for this stage. Compression is carried out by the worker thread handling the transaction, just before the transaction is committed, provided that there are no events in the finalized capture cache that exclude the transaction from binary log transaction compression (for example, incident events). When decompression is required, it is carried out for one event from the payload at a time.

**mysqlbinlog** with the `--verbose` option includes comments stating the compressed size and the uncompressed size for compressed transaction payloads, and the compression algorithm that was used.

You can enable connection compression at the protocol level for replication connections, using the `SOURCE_COMPRESSION_ALGORITHMS` and `SOURCE_ZSTD_COMPRESSION_LEVEL` options of the [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement, or the `replica_compressed_protocol` system variable. If you enable binary log transaction compression in a system where connection compression is also enabled, the impact of connection compression is reduced, as there might be little opportunity to further compress the compressed transaction payloads. However, connection compression can still operate on uncompressed events and on message headers. Binary log transaction compression can be enabled in combination with connection compression if you need to save storage space as well as network bandwidth. For more information on connection compression for replication connections, see Section 6.2.8, “Connection Compression Control”.

For Group Replication, compression is enabled by default for messages that exceed the threshold set by the `group_replication_compression_threshold` system variable. You can also configure compression for messages sent for distributed recovery by the method of state transfer from a donor's binary log, using the `group_replication_recovery_compression_algorithms` and `group_replication_recovery_zstd_compression_level` system variables. If you enable binary log transaction compression in a system where these are configured, Group Replication's message compression can still operate on uncompressed events and on message headers, but its impact is reduced. For more information on message compression for Group Replication, see Section 20.7.4, “Message Compression”.


### 7.4.5 The Slow Query Log

The slow query log consists of SQL statements that take more than `long_query_time` seconds to execute and require at least `min_examined_row_limit` rows to be examined. The slow query log can be used to find queries that take a long time to execute and are therefore candidates for optimization. However, examining a long slow query log can be a time-consuming task. To make this easier, you can use the **mysqldumpslow** command to process a slow query log file and summarize its contents. See Section 6.6.10, “mysqldumpslow — Summarize Slow Query Log Files”.

The time to acquire the initial locks is not counted as execution time. **mysqld** writes a statement to the slow query log after it has been executed and after all locks have been released, so log order might differ from execution order.

* Slow Query Log Parameters
* Slow Query Log Contents

#### Slow Query Log Parameters

The minimum and default values of `long_query_time` are 0 and 10, respectively. The value can be specified to a resolution of microseconds.

By default, administrative statements are not logged, nor are queries that do not use indexes for lookups. This behavior can be changed using `log_slow_admin_statements` and `log_queries_not_using_indexes`, as described later.

By default, the slow query log is disabled. To specify the initial slow query log state explicitly, use `--slow_query_log[={0|1}]`. With no argument or an argument of 1, `--slow_query_log` enables the log. With an argument of 0, this option disables the log. To specify a log file name, use `--slow_query_log_file=file_name`. To specify the log destination, use the `log_output` system variable (as described in Section 7.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”).

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

By default, a replica does not write replicated queries to the slow query log. To change this, enable the `log_slow_replica_statements` system variable. Note that if row-based replication is in use (`binlog_format=ROW`), these system variables have no effect. Queries are only added to the replica's slow query log when they are logged in statement format in the binary log, that is, when `binlog_format=STATEMENT` is set, or when `binlog_format=MIXED` is set and the statement is logged in statement format. Slow queries that are logged in row format when `binlog_format=MIXED` is set, or that are logged when `binlog_format=ROW` is set, are not added to the replica's slow query log, even if `log_slow_replica_statements` is enabled.

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

Enabling the `log_slow_extra` system variable causes the server to write the following extra fields to `FILE` output in addition to those just listed (`TABLE` output is unaffected). Some field descriptions refer to status variable names. Consult the status variable descriptions for more information. However, in the slow query log, the counters are per-statement values, not cumulative per-session values.

* `Thread_id: ID`

  The statement thread identifier.

* `Errno: error_number`

  The statement error number, or 0 if no error occurred.

* `Killed: N`

  If the statement was terminated, the error number indicating why, or 0 if the statement terminated normally.

* `Bytes_received: N`

  The `Bytes_received` value for the statement.

* `Bytes_sent: N`

  The `Bytes_sent` value for the statement.

* `Read_first: N`

  The `Handler_read_first` value for the statement.

* `Read_last: N`

  The `Handler_read_last` value for the statement.

* `Read_key: N`

  The `Handler_read_key` value for the statement.

* `Read_next: N`

  The `Handler_read_next` value for the statement.

* `Read_prev: N`

  The `Handler_read_prev` value for the statement.

* `Read_rnd: N`

  The `Handler_read_rnd` value for the statement.

* `Read_rnd_next: N`

  The `Handler_read_rnd_next` value for the statement.

* `Sort_merge_passes: N`

  The `Sort_merge_passes` value for the statement.

* `Sort_range_count: N`

  The `Sort_range` value for the statement.

* `Sort_rows: N`

  The `Sort_rows` value for the statement.

* `Sort_scan_count: N`

  The `Sort_scan` value for the statement.

* `Created_tmp_disk_tables: N`

  The `Created_tmp_disk_tables` value for the statement.

* `Created_tmp_tables: N`

  The `Created_tmp_tables` value for the statement.

* `Start: timestamp`

  The statement execution start time.

* `End: timestamp`

  The statement execution end time.

A given slow query log file may contain a mix of lines with and without the extra fields added by enabling `log_slow_extra`. Log file analyzers can determine whether a line contains the additional fields by the field count.

Each statement written to the slow query log file is preceded by a `SET` statement that includes a timestamp, which indicates when the slow statement began executing.

Passwords in statements written to the slow query log are rewritten by the server not to occur literally in plain text. See Section 8.1.2.3, “Passwords and Logging”.

Statements that cannot be parsed (due, for example, to syntax errors) are not written to the slow query log.


### 7.4.6 Server Log Maintenance

As described in Section 7.4, “MySQL Server Logs”, MySQL Server can create several different log files to help you see what activity is taking place. However, you must clean up these files regularly to ensure that the logs do not take up too much disk space.

When using MySQL with logging enabled, you may want to back up and remove old log files from time to time and tell MySQL to start logging to new files. See Section 9.2, “Database Backup Methods”.

On a Linux (Red Hat) installation, you can use the `mysql-log-rotate` script for log maintenance. If you installed MySQL from an RPM distribution, this script should have been installed automatically. Be careful with this script if you are using the binary log for replication. You should not remove binary logs until you are certain that their contents have been processed by all replicas.

On other systems, you must install a short script yourself that you start from **cron** (or its equivalent) for handling log files.

Binary log files are automatically removed after the server's binary log expiration period. Removal of the files can take place at startup and when the binary log is flushed. The default binary log expiration period is 30 days. To specify an alternative expiration period, use the `binlog_expire_logs_seconds` system variable. If you are using replication, you should specify an expiration period that is no lower than the maximum amount of time your replicas might lag behind the source. To remove binary logs on demand, use the [`PURGE BINARY LOGS`](purge-binary-logs.html "15.4.1.1 PURGE BINARY LOGS Statement") statement (see Section 15.4.1.1, “PURGE BINARY LOGS Statement”).

To force MySQL to start using new log files, flush the logs. Log flushing occurs when you execute a [`FLUSH LOGS`](flush.html#flush-logs) statement or a [**mysqladmin flush-logs**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program"), **mysqladmin refresh**, **mysqldump** `--flush-logs`, or **mysqldump** `--source-data` command. See Section 15.7.8.3, “FLUSH Statement”, Section 6.5.2, “mysqladmin — A MySQL Server Administration Program”, and Section 6.5.4, “mysqldump — A Database Backup Program”. In addition, the server flushes the binary log automatically when current binary log file size reaches the value of the `max_binlog_size` system variable.

`FLUSH LOGS` supports optional modifiers to enable selective flushing of individual logs (for example, `FLUSH BINARY LOGS`). See Section 15.7.8.3, “FLUSH Statement”.

A log-flushing operation has the following effects:

* If binary logging is enabled, the server closes the current binary log file and opens a new log file with the next sequence number.

* If general query logging or slow query logging to a log file is enabled, the server closes and reopens the log file.

* If the server was started with the `--log-error` option to cause the error log to be written to a file, the server closes and reopens the log file.

Execution of log-flushing statements or commands requires connecting to the server using an account that has the `RELOAD` privilege. On Unix and Unix-like systems, another way to flush the logs is to send a signal to the server, which can be done by `root` or the account that owns the server process. (See Section 6.10, “Unix Signal Handling in MySQL”.) Signals enable log flushing to be performed without having to connect to the server:

* A `SIGHUP` signal flushes all the logs. However, `SIGHUP` has additional effects other than log flushing that might be undesirable.

* `SIGUSR1` causes the server to flush the error log, general query log, and slow query log. If you are interested in flushing only those logs, `SIGUSR1` can be used as a more “lightweight” signal that does not have the `SIGHUP` effects that are unrelated to logs.

As mentioned previously, flushing the binary log creates a new binary log file, whereas flushing the general query log, slow query log, or error log just closes and reopens the log file. For the latter logs, to cause a new log file to be created on Unix, rename the current log file first before flushing it. At flush time, the server opens the new log file with the original name. For example, if the general query log, slow query log, and error log files are named `mysql.log`, `mysql-slow.log`, and `err.log`, you can use a series of commands like this from the command line:

```
cd mysql-data-directory
mv mysql.log mysql.log.old
mv mysql-slow.log mysql-slow.log.old
mv err.log err.log.old
mysqladmin flush-logs
```

On Windows, use **rename** rather than **mv**.

At this point, you can make a backup of `mysql.log.old`, `mysql-slow.log.old`, and `err.log.old`, then remove them from disk.

To rename the general query log or slow query log at runtime, first connect to the server and disable the log:

```
SET GLOBAL general_log = 'OFF';
SET GLOBAL slow_query_log = 'OFF';
```

With the logs disabled, rename the log files externally (for example, from the command line). Then enable the logs again:

```
SET GLOBAL general_log = 'ON';
SET GLOBAL slow_query_log = 'ON';
```

This method works on any platform and does not require a server restart.

Note

For the server to recreate a given log file after you have renamed the file externally, the file location must be writable by the server. This may not always be the case. For example, on Linux, the server might write the error log as `/var/log/mysqld.log`, where `/var/log` is owned by `root` and not writable by **mysqld**. In this case, log-flushing operations fail to create a new log file.

To handle this situation, you must manually create the new log file with the proper ownership after renaming the original log file. For example, execute these commands as `root`:

```
mv /var/log/mysqld.log /var/log/mysqld.log.old
install -omysql -gmysql -m0644 /dev/null /var/log/mysqld.log
```
