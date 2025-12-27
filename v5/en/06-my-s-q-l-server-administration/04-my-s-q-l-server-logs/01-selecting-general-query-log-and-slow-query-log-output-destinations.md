### 5.4.1 Selecting General Query Log and Slow Query Log Output Destinations

MySQL Server provides flexible control over the destination of output written to the general query log and the slow query log, if those logs are enabled. Possible destinations for log entries are log files or the `general_log` and `slow_log` tables in the `mysql` system database. File output, table output, or both can be selected.

* [Log Control at Server Startup](log-destinations.html#log-destinations-startup "Log Control at Server Startup")
* [Log Control at Runtime](log-destinations.html#log-destinations-runtime "Log Control at Runtime")
* [Log Table Benefits and Characteristics](log-destinations.html#log-destinations-tables "Log Table Benefits and Characteristics")

#### Log Control at Server Startup

The [`log_output`](server-system-variables.html#sysvar_log_output) system variable specifies the destination for log output. Setting this variable does not in itself enable the logs; they must be enabled separately.

* If [`log_output`](server-system-variables.html#sysvar_log_output) is not specified at startup, the default logging destination is `FILE`.

* If [`log_output`](server-system-variables.html#sysvar_log_output) is specified at startup, its value is a list one or more comma-separated words chosen from `TABLE` (log to tables), `FILE` (log to files), or `NONE` (do not log to tables or files). `NONE`, if present, takes precedence over any other specifiers.

The [`general_log`](server-system-variables.html#sysvar_general_log) system variable controls logging to the general query log for the selected log destinations. If specified at server startup, [`general_log`](server-system-variables.html#sysvar_general_log) takes an optional argument of 1 or 0 to enable or disable the log. To specify a file name other than the default for file logging, set the [`general_log_file`](server-system-variables.html#sysvar_general_log_file) variable. Similarly, the [`slow_query_log`](server-system-variables.html#sysvar_slow_query_log) variable controls logging to the slow query log for the selected destinations and setting [`slow_query_log_file`](server-system-variables.html#sysvar_slow_query_log_file) specifies a file name for file logging. If either log is enabled, the server opens the corresponding log file and writes startup messages to it. However, further logging of queries to the file does not occur unless the `FILE` log destination is selected.

Examples:

* To write general query log entries to the log table and the log file, use [`--log_output=TABLE,FILE`](server-system-variables.html#sysvar_log_output) to select both log destinations and [`--general_log`](server-system-variables.html#sysvar_general_log) to enable the general query log.

* To write general and slow query log entries only to the log tables, use [`--log_output=TABLE`](server-system-variables.html#sysvar_log_output) to select tables as the log destination and [`--general_log`](server-system-variables.html#sysvar_general_log) and [`--slow_query_log`](server-system-variables.html#sysvar_slow_query_log) to enable both logs.

* To write slow query log entries only to the log file, use [`--log_output=FILE`](server-system-variables.html#sysvar_log_output) to select files as the log destination and [`--slow_query_log`](server-system-variables.html#sysvar_slow_query_log) to enable the slow query log. In this case, because the default log destination is `FILE`, you could omit the [`log_output`](server-system-variables.html#sysvar_log_output) setting.

#### Log Control at Runtime

The system variables associated with log tables and files enable runtime control over logging:

* The [`log_output`](server-system-variables.html#sysvar_log_output) variable indicates the current logging destination. It can be modified at runtime to change the destination.

* The [`general_log`](server-system-variables.html#sysvar_general_log) and [`slow_query_log`](server-system-variables.html#sysvar_slow_query_log) variables indicate whether the general query log and slow query log are enabled (`ON`) or disabled (`OFF`). You can set these variables at runtime to control whether the logs are enabled.

* The [`general_log_file`](server-system-variables.html#sysvar_general_log_file) and [`slow_query_log_file`](server-system-variables.html#sysvar_slow_query_log_file) variables indicate the names of the general query log and slow query log files. You can set these variables at server startup or at runtime to change the names of the log files.

* To disable or enable general query logging for the current session, set the session [`sql_log_off`](server-system-variables.html#sysvar_sql_log_off) variable to `ON` or `OFF`. (This assumes that the general query log itself is enabled.)

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

* [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"), [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), and [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") are valid operations on a log table. For [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") and [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement"), the log table cannot be in use and must be disabled, as described later.

* By default, the log tables use the `CSV` storage engine that writes data in comma-separated values format. For users who have access to the `.CSV` files that contain log table data, the files are easy to import into other programs such as spreadsheets that can process CSV input.

  The log tables can be altered to use the `MyISAM` storage engine. You cannot use [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") to alter a log table that is in use. The log must be disabled first. No engines other than `CSV` or `MyISAM` are legal for the log tables.

  **Log Tables and “Too many open files” Errors.** If you select `TABLE` as a log destination and the log tables use the `CSV` storage engine, you may find that disabling and enabling the general query log or slow query log repeatedly at runtime results in a number of open file descriptors for the `.CSV` file, possibly resulting in a “Too many open files” error. To work around this issue, execute [`FLUSH TABLES`](flush.html "13.7.6.3 FLUSH Statement") or ensure that the value of [`open_files_limit`](server-system-variables.html#sysvar_open_files_limit) is greater than the value of [`table_open_cache_instances`](server-system-variables.html#sysvar_table_open_cache_instances).

* To disable logging so that you can alter (or drop) a log table, you can use the following strategy. The example uses the general query log; the procedure for the slow query log is similar but uses the `slow_log` table and [`slow_query_log`](server-system-variables.html#sysvar_slow_query_log) system variable.

  ```sql
  SET @old_log_state = @@GLOBAL.general_log;
  SET GLOBAL general_log = 'OFF';
  ALTER TABLE mysql.general_log ENGINE = MyISAM;
  SET GLOBAL general_log = @old_log_state;
  ```

* [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is a valid operation on a log table. It can be used to expire log entries.

* [`RENAME TABLE`](rename-table.html "13.1.33 RENAME TABLE Statement") is a valid operation on a log table. You can atomically rename a log table (to perform log rotation, for example) using the following strategy:

  ```sql
  USE mysql;
  DROP TABLE IF EXISTS general_log2;
  CREATE TABLE general_log2 LIKE general_log;
  RENAME TABLE general_log TO general_log_backup, general_log2 TO general_log;
  ```

* [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") is a valid operation on a log table.

* [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") cannot be used on a log table.

* [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`DELETE`](delete.html "13.2.2 DELETE Statement"), and [`UPDATE`](update.html "13.2.11 UPDATE Statement") cannot be used on a log table. These operations are permitted only internally to the server itself.

* [`FLUSH TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock) and the state of the [`read_only`](server-system-variables.html#sysvar_read_only) system variable have no effect on log tables. The server can always write to the log tables.

* Entries written to the log tables are not written to the binary log and thus are not replicated to replicas.

* To flush the log tables or log files, use [`FLUSH TABLES`](flush.html#flush-tables) or [`FLUSH LOGS`](flush.html#flush-logs), respectively.

* Partitioning of log tables is not permitted.
* A [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") dump includes statements to recreate those tables so that they are not missing after reloading the dump file. Log table contents are not dumped.
