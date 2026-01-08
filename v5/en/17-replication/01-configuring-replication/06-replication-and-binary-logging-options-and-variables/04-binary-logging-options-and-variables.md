#### 16.1.6.4 Binary Logging Options and Variables

* [Startup Options Used with Binary Logging](replication-options-binary-log.html#replication-optvars-binlog "Startup Options Used with Binary Logging")
* [System Variables Used with Binary Logging](replication-options-binary-log.html#replication-sysvars-binlog "System Variables Used with Binary Logging")

You can use the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") options and system variables that are described in this section to affect the operation of the binary log as well as to control which statements are written to the binary log. For additional information about the binary log, see [Section 5.4.4, “The Binary Log”](binary-log.html "5.4.4 The Binary Log"). For additional information about using MySQL server options and system variables, see [Section 5.1.6, “Server Command Options”](server-options.html "5.1.6 Server Command Options"), and [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

##### Startup Options Used with Binary Logging

The following list describes startup options for enabling and configuring the binary log. System variables used with binary logging are discussed later in this section.

* [`--binlog-row-event-max-size=N`](replication-options-binary-log.html#option_mysqld_binlog-row-event-max-size)

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>8192</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

  Specify the maximum size of a row-based binary log event, in bytes. Rows are grouped into events smaller than this size if possible. The value should be a multiple of 256. The default is 8192. See [Section 16.2.1, “Replication Formats”](replication-formats.html "16.2.1 Replication Formats").

* [`--log-bin[=base_name]`](replication-options-binary-log.html#option_mysqld_log-bin)

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  Enables binary logging. With binary logging enabled, the server logs all statements that change data to the binary log, which is used for backup and replication. The binary log is a sequence of files with a base name and numeric extension. For information on the format and management of the binary log, see [Section 5.4.4, “The Binary Log”](binary-log.html "5.4.4 The Binary Log").

  If you supply a value for the `--log-bin` option, the value is used as the base name for the log sequence. The server creates binary log files in sequence by adding a numeric suffix to the base name. In MySQL 5.7, the base name defaults to `host_name-bin`, using the name of the host machine. It is recommended that you specify a base name, so that you can continue to use the same binary log file names regardless of changes to the default name.

  The default location for binary log files is the data directory. You can use the `--log-bin` option to specify an alternative location, by adding a leading absolute path name to the base name to specify a different directory. When the server reads an entry from the binary log index file, which tracks the binary log files that have been used, it checks whether the entry contains a relative path. If it does, the relative part of the path is replaced with the absolute path set using the `--log-bin` option. An absolute path recorded in the binary log index file remains unchanged; in such a case, the index file must be edited manually to enable a new path or paths to be used. (In older versions of MySQL, manual intervention was required whenever relocating the binary log or relay log files.) (Bug #11745230, Bug #12133)

  Setting this option causes the [`log_bin`](replication-options-binary-log.html#sysvar_log_bin) system variable to be set to `ON` (or `1`), and not to the base name. The binary log file base name and any specified path are available as the [`log_bin_basename`](replication-options-binary-log.html#sysvar_log_bin_basename) system variable.

  If you specify the `--log-bin` option without also specifying the [`server_id`](replication-options.html#sysvar_server_id) system variable, the server is not allowed to start. (Bug #11763963, Bug
  #56739)

  When GTIDs are in use on the server, if binary logging is not enabled when restarting the server after an abnormal shutdown, some GTIDs are likely to be lost, causing replication to fail. In a normal shutdown, the set of GTIDs from the current binary log file is saved in the `mysql.gtid_executed` table. Following an abnormal shutdown where this did not happen, during recovery the GTIDs are added to the table from the binary log file, provided that binary logging is still enabled. If binary logging is disabled for the server restart, the server cannot access the binary log file to recover the GTIDs, so replication cannot be started. Binary logging can be disabled safely after a normal shutdown.

  If you want to disable binary logging for a server start but keep the `--log-bin` setting intact, you can specify the [`--skip-log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) or [`--disable-log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) option at startup. Specify the option after the `--log-bin` option, so that it takes precedence. When binary logging is disabled, the [`log_bin`](replication-options-binary-log.html#sysvar_log_bin) system variable is set to OFF.

* [`--log-bin-index[=file_name]`](replication-options-binary-log.html#option_mysqld_log-bin-index)

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  The name for the binary log index file, which contains the names of the binary log files. By default, it has the same location and base name as the value specified for the binary log files using the [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) option, plus the extension `.index`. If you do not specify [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin), the default binary log index file name is `binlog.index`. If you omit the file name and do not specify one with [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin), the default binary log index file name is `host_name-bin.index`, using the name of the host machine.

  For information on the format and management of the binary log, see [Section 5.4.4, “The Binary Log”](binary-log.html "5.4.4 The Binary Log").

**Statement selection options.** The options in the following list affect which statements are written to the binary log, and thus sent by a replication source server to its replicas. There are also options for replica servers that control which statements received from the source should be executed or ignored. For details, see [Section 16.1.6.3, “Replica Server Options and Variables”](replication-options-replica.html "16.1.6.3 Replica Server Options and Variables").

* [`--binlog-do-db=db_name`](replication-options-binary-log.html#option_mysqld_binlog-do-db)

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  This option affects binary logging in a manner similar to the way that [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db) affects replication.

  The effects of this option depend on whether the statement-based or row-based logging format is in use, in the same way that the effects of [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db) depend on whether statement-based or row-based replication is in use. You should keep in mind that the format used to log a given statement may not necessarily be the same as that indicated by the value of [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format). For example, DDL statements such as [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") and [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") are always logged as statements, without regard to the logging format in effect, so the following statement-based rules for `--binlog-do-db` always apply in determining whether or not the statement is logged.

  **Statement-based logging.** Only those statements are written to the binary log where the default database (that is, the one selected by [`USE`](use.html "13.8.4 USE Statement")) is *`db_name`*. To specify more than one database, use this option multiple times, once for each database; however, doing so does *not* cause cross-database statements such as `UPDATE some_db.some_table SET foo='bar'` to be logged while a different database (or no database) is selected.

  Warning

  To specify multiple databases you *must* use multiple instances of this option. Because database names can contain commas, the list is treated as the name of a single database if you supply a comma-separated list.

  An example of what does not work as you might expect when using statement-based logging: If the server is started with [`--binlog-do-db=sales`](replication-options-binary-log.html#option_mysqld_binlog-do-db) and you issue the following statements, the [`UPDATE`](update.html "13.2.11 UPDATE Statement") statement is *not* logged:

  ```sql
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

  The main reason for this “just check the default database” behavior is that it is difficult from the statement alone to know whether it should be replicated (for example, if you are using multiple-table [`DELETE`](delete.html "13.2.2 DELETE Statement") statements or multiple-table [`UPDATE`](update.html "13.2.11 UPDATE Statement") statements that act across multiple databases). It is also faster to check only the default database rather than all databases if there is no need.

  Another case which may not be self-evident occurs when a given database is replicated even though it was not specified when setting the option. If the server is started with `--binlog-do-db=sales`, the following [`UPDATE`](update.html "13.2.11 UPDATE Statement") statement is logged even though `prices` was not included when setting `--binlog-do-db`:

  ```sql
  USE sales;
  UPDATE prices.discounts SET percentage = percentage + 10;
  ```

  Because `sales` is the default database when the [`UPDATE`](update.html "13.2.11 UPDATE Statement") statement is issued, the [`UPDATE`](update.html "13.2.11 UPDATE Statement") is logged.

  **Row-based logging.** Logging is restricted to database *`db_name`*. Only changes to tables belonging to *`db_name`* are logged; the default database has no effect on this. Suppose that the server is started with [`--binlog-do-db=sales`](replication-options-binary-log.html#option_mysqld_binlog-do-db) and row-based logging is in effect, and then the following statements are executed:

  ```sql
  USE prices;
  UPDATE sales.february SET amount=amount+100;
  ```

  The changes to the `february` table in the `sales` database are logged in accordance with the [`UPDATE`](update.html "13.2.11 UPDATE Statement") statement; this occurs whether or not the [`USE`](use.html "13.8.4 USE Statement") statement was issued. However, when using the row-based logging format and [`--binlog-do-db=sales`](replication-options-binary-log.html#option_mysqld_binlog-do-db), changes made by the following [`UPDATE`](update.html "13.2.11 UPDATE Statement") are not logged:

  ```sql
  USE prices;
  UPDATE prices.march SET amount=amount-25;
  ```

  Even if the `USE prices` statement were changed to `USE sales`, the [`UPDATE`](update.html "13.2.11 UPDATE Statement") statement's effects would still not be written to the binary log.

  Another important difference in [`--binlog-do-db`](replication-options-binary-log.html#option_mysqld_binlog-do-db) handling for statement-based logging as opposed to the row-based logging occurs with regard to statements that refer to multiple databases. Suppose that the server is started with [`--binlog-do-db=db1`](replication-options-binary-log.html#option_mysqld_binlog-do-db), and the following statements are executed:

  ```sql
  USE db1;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  If you are using statement-based logging, the updates to both tables are written to the binary log. However, when using the row-based format, only the changes to `table1` are logged; `table2` is in a different database, so it is not changed by the [`UPDATE`](update.html "13.2.11 UPDATE Statement"). Now suppose that, instead of the `USE db1` statement, a `USE db4` statement had been used:

  ```sql
  USE db4;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  In this case, the [`UPDATE`](update.html "13.2.11 UPDATE Statement") statement is not written to the binary log when using statement-based logging. However, when using row-based logging, the change to `table1` is logged, but not that to `table2`—in other words, only changes to tables in the database named by [`--binlog-do-db`](replication-options-binary-log.html#option_mysqld_binlog-do-db) are logged, and the choice of default database has no effect on this behavior.

* [`--binlog-ignore-db=db_name`](replication-options-binary-log.html#option_mysqld_binlog-ignore-db)

  <table frame="box" rules="all" summary="Properties for binlog-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  This option affects binary logging in a manner similar to the way that [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db) affects replication.

  The effects of this option depend on whether the statement-based or row-based logging format is in use, in the same way that the effects of [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db) depend on whether statement-based or row-based replication is in use. You should keep in mind that the format used to log a given statement may not necessarily be the same as that indicated by the value of [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format). For example, DDL statements such as [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") and [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") are always logged as statements, without regard to the logging format in effect, so the following statement-based rules for `--binlog-ignore-db` always apply in determining whether or not the statement is logged.

  **Statement-based logging.** Tells the server to not log any statement where the default database (that is, the one selected by [`USE`](use.html "13.8.4 USE Statement")) is *`db_name`*.

  Prior to MySQL 5.7.2, this option caused any statements containing fully qualified table names not to be logged if there was no default database specified (that is, when [`SELECT`](select.html "13.2.9 SELECT Statement") [`DATABASE()`](information-functions.html#function_database) returned `NULL`). In MySQL 5.7.2 and higher, when there is no default database, no `--binlog-ignore-db` options are applied, and such statements are always logged. (Bug #11829838, Bug
  #60188)

  **Row-based format.** Tells the server not to log updates to any tables in the database *`db_name`*. The current database has no effect.

  When using statement-based logging, the following example does not work as you might expect. Suppose that the server is started with [`--binlog-ignore-db=sales`](replication-options-binary-log.html#option_mysqld_binlog-ignore-db) and you issue the following statements:

  ```sql
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

  The [`UPDATE`](update.html "13.2.11 UPDATE Statement") statement *is* logged in such a case because [`--binlog-ignore-db`](replication-options-binary-log.html#option_mysqld_binlog-ignore-db) applies only to the default database (determined by the [`USE`](use.html "13.8.4 USE Statement") statement). Because the `sales` database was specified explicitly in the statement, the statement has not been filtered. However, when using row-based logging, the [`UPDATE`](update.html "13.2.11 UPDATE Statement") statement's effects are *not* written to the binary log, which means that no changes to the `sales.january` table are logged; in this instance, [`--binlog-ignore-db=sales`](replication-options-binary-log.html#option_mysqld_binlog-ignore-db) causes *all* changes made to tables in the source's copy of the `sales` database to be ignored for purposes of binary logging.

  To specify more than one database to ignore, use this option multiple times, once for each database. Because database names can contain commas, the list is treated as the name of a single database if you supply a comma-separated list.

  You should not use this option if you are using cross-database updates and you do not want these updates to be logged.

**Checksum options.** MySQL supports reading and writing of binary log checksums. These are enabled using the two options listed here:

* [`--binlog-checksum={NONE|CRC32}`](replication-options-binary-log.html#option_mysqld_binlog-checksum)

  <table frame="box" rules="all" summary="Properties for binlog-checksum"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-checksum=type</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>CRC32</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>NONE</code></p><p class="valid-value"><code>CRC32</code></p></td> </tr></tbody></table>

  Enabling this option causes the source to write checksums for events written to the binary log. Set to `NONE` to disable, or the name of the algorithm to be used for generating checksums; currently, only CRC32 checksums are supported, and CRC32 is the default. You cannot change the setting for this option within a transaction.

To control reading of checksums by the replica (from the relay log), use the [`--slave-sql-verify-checksum`](replication-options-replica.html#option_mysqld_slave-sql-verify-checksum) option.

**Testing and debugging options.** The following binary log options are used in replication testing and debugging. They are not intended for use in normal operations.

* [`--max-binlog-dump-events=N`](replication-options-binary-log.html#option_mysqld_max-binlog-dump-events)

  <table frame="box" rules="all" summary="Properties for max-binlog-dump-events"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-binlog-dump-events=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr></tbody></table>

  This option is used internally by the MySQL test suite for replication testing and debugging.

* [`--sporadic-binlog-dump-fail`](replication-options-binary-log.html#option_mysqld_sporadic-binlog-dump-fail)

  <table frame="box" rules="all" summary="Properties for sporadic-binlog-dump-fail"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--sporadic-binlog-dump-fail[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  This option is used internally by the MySQL test suite for replication testing and debugging.

##### System Variables Used with Binary Logging

The following list describes system variables for controlling binary logging. They can be set at server startup and some of them can be changed at runtime using [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment"). Server options used to control binary logging are listed earlier in this section.

* [`binlog_cache_size`](replication-options-binary-log.html#sysvar_binlog_cache_size)

  <table frame="box" rules="all" summary="Properties for binlog_cache_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-cache-size=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-binary-log.html#sysvar_binlog_cache_size">binlog_cache_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294963200</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code>4096</code></td> </tr></tbody></table>

  The size of the cache to hold changes to the binary log during a transaction.

  A binary log cache is allocated for each client if the server supports any transactional storage engines and if the server has the binary log enabled ([`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) option). If you often use large transactions, you can increase this cache size to get better performance. The [`Binlog_cache_use`](server-status-variables.html#statvar_Binlog_cache_use) and [`Binlog_cache_disk_use`](server-status-variables.html#statvar_Binlog_cache_disk_use) status variables can be useful for tuning the size of this variable. See [Section 5.4.4, “The Binary Log”](binary-log.html "5.4.4 The Binary Log").

  `binlog_cache_size` sets the size for the transaction cache only; the size of the statement cache is governed by the [`binlog_stmt_cache_size`](replication-options-binary-log.html#sysvar_binlog_stmt_cache_size) system variable.

* [`binlog_checksum`](replication-options-binary-log.html#sysvar_binlog_checksum)

  <table frame="box" rules="all" summary="Properties for binlog_checksum"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-checksum=type</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-binary-log.html#sysvar_binlog_checksum">binlog_checksum</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>CRC32</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>NONE</code></p><p class="valid-value"><code>CRC32</code></p></td> </tr></tbody></table>

  When enabled, this variable causes the source to write a checksum for each event in the binary log. `binlog_checksum` supports the values `NONE` (disabled) and `CRC32`. The default is `CRC32`. You cannot change the value of `binlog_checksum` within a transaction.

  When `binlog_checksum` is disabled (value `NONE`), the server verifies that it is writing only complete events to the binary log by writing and checking the event length (rather than a checksum) for each event.

  Changing the value of this variable causes the binary log to be rotated; checksums are always written to an entire binary log file, and never to only part of one.

  Setting this variable on the source to a value unrecognized by the replica causes the replica to set its own `binlog_checksum` value to `NONE`, and to stop replication with an error. (Bug #13553750, Bug #61096) If backward compatibility with older replicas is a concern, you may want to set the value explicitly to `NONE`.

* [`binlog_direct_non_transactional_updates`](replication-options-binary-log.html#sysvar_binlog_direct_non_transactional_updates)

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>0

  Due to concurrency issues, a replica can become inconsistent when a transaction contains updates to both transactional and nontransactional tables. MySQL tries to preserve causality among these statements by writing nontransactional statements to the transaction cache, which is flushed upon commit. However, problems arise when modifications done to nontransactional tables on behalf of a transaction become immediately visible to other connections because these changes may not be written immediately into the binary log.

  The [`binlog_direct_non_transactional_updates`](replication-options-binary-log.html#sysvar_binlog_direct_non_transactional_updates) variable offers one possible workaround to this issue. By default, this variable is disabled. Enabling [`binlog_direct_non_transactional_updates`](replication-options-binary-log.html#sysvar_binlog_direct_non_transactional_updates) causes updates to nontransactional tables to be written directly to the binary log, rather than to the transaction cache.

  *[`binlog_direct_non_transactional_updates`](replication-options-binary-log.html#sysvar_binlog_direct_non_transactional_updates) works only for statements that are replicated using the statement-based binary logging format*; that is, it works only when the value of [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) is `STATEMENT`, or when [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) is `MIXED` and a given statement is being replicated using the statement-based format. This variable has no effect when the binary log format is `ROW`, or when [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) is set to `MIXED` and a given statement is replicated using the row-based format.

  Important

  Before enabling this variable, you must make certain that there are no dependencies between transactional and nontransactional tables; an example of such a dependency would be the statement `INSERT INTO myisam_table SELECT * FROM innodb_table`. Otherwise, such statements are likely to cause the replica to diverge from the source.

  This variable has no effect when the binary log format is `ROW` or `MIXED`.

* [`binlog_error_action`](replication-options-binary-log.html#sysvar_binlog_error_action)

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>1

  Controls what happens when the server encounters an error such as not being able to write to, flush or synchronize the binary log, which can cause the source's binary log to become inconsistent and replicas to lose synchronization.

  In MySQL 5.7.7 and higher, this variable defaults to `ABORT_SERVER`, which makes the server halt logging and shut down whenever it encounters such an error with the binary log. On restart, recovery proceeds as in the case of an unexpected server halt (see [Section 16.3.2, “Handling an Unexpected Halt of a Replica”](replication-solutions-unexpected-replica-halt.html "16.3.2 Handling an Unexpected Halt of a Replica")).

  When `binlog_error_action` is set to `IGNORE_ERROR`, if the server encounters such an error it continues the ongoing transaction, logs the error then halts logging, and continues performing updates. To resume binary logging [`log_bin`](replication-options-binary-log.html#sysvar_log_bin) must be enabled again, which requires a server restart. This setting provides backward compatibility with older versions of MySQL.

  In previous releases this variable was named `binlogging_impossible_mode`.

* [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format)

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>2

  This system variable sets the binary logging format, and can be any one of `STATEMENT`, `ROW`, or `MIXED`. See [Section 16.2.1, “Replication Formats”](replication-formats.html "16.2.1 Replication Formats"). The setting takes effect when binary logging is enabled on the server, which is the case when the [`log_bin`](replication-options-binary-log.html#sysvar_log_bin) system variable is set to `ON`. In MySQL 5.7, binary logging is not enabled by default, and you enable it using the [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) option.

  [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) can be set at startup or at runtime, except that under some conditions, changing this variable at runtime is not possible or causes replication to fail, as described later.

  Prior to MySQL 5.7.7, the default format was `STATEMENT`. In MySQL 5.7.7 and higher, the default is `ROW`. *Exception*: In NDB Cluster, the default is `MIXED`; statement-based replication is not supported for NDB Cluster.

  Setting the session value of this system variable is a restricted operation. The session user must have privileges sufficient to set restricted session variables. See [Section 5.1.8.1, “System Variable Privileges”](system-variable-privileges.html "5.1.8.1 System Variable Privileges").

  The rules governing when changes to this variable take effect and how long the effect lasts are the same as for other MySQL server system variables. For more information, see [Section 13.7.4.1, “SET Syntax for Variable Assignment”](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment").

  When `MIXED` is specified, statement-based replication is used, except for cases where only row-based replication is guaranteed to lead to proper results. For example, this happens when statements contain loadable functions or the [`UUID()`](miscellaneous-functions.html#function_uuid) function.

  For details of how stored programs (stored procedures and functions, triggers, and events) are handled when each binary logging format is set, see [Section 23.7, “Stored Program Binary Logging”](stored-programs-logging.html "23.7 Stored Program Binary Logging").

  There are exceptions when you cannot switch the replication format at runtime:

  + From within a stored function or a trigger.
  + If the session is currently in row-based replication mode and has open temporary tables.

  + From within a transaction.

  Trying to switch the format in those cases results in an error.

  Changing the logging format on a replication source server does not cause a replica to change its logging format to match. Switching the replication format while replication is ongoing can cause issues if a replica has binary logging enabled, and the change results in the replica using `STATEMENT` format logging while the source is using `ROW` or `MIXED` format logging. A replica is not able to convert binary log entries received in `ROW` logging format to `STATEMENT` format for use in its own binary log, so this situation can cause replication to fail. For more information, see [Section 5.4.4.2, “Setting The Binary Log Format”](binary-log-setting.html "5.4.4.2 Setting The Binary Log Format").

  The binary log format affects the behavior of the following server options:

  + [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db)
  + [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db)
  + [`--binlog-do-db`](replication-options-binary-log.html#option_mysqld_binlog-do-db)
  + [`--binlog-ignore-db`](replication-options-binary-log.html#option_mysqld_binlog-ignore-db)

  These effects are discussed in detail in the descriptions of the individual options.

* [`binlog_group_commit_sync_delay`](replication-options-binary-log.html#sysvar_binlog_group_commit_sync_delay)

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>3

  Controls how many microseconds the binary log commit waits before synchronizing the binary log file to disk. By default [`binlog_group_commit_sync_delay`](replication-options-binary-log.html#sysvar_binlog_group_commit_sync_delay) is set to 0, meaning that there is no delay. Setting [`binlog_group_commit_sync_delay`](replication-options-binary-log.html#sysvar_binlog_group_commit_sync_delay) to a microsecond delay enables more transactions to be synchronized together to disk at once, reducing the overall time to commit a group of transactions because the larger groups require fewer time units per group.

  When [`sync_binlog=0`](replication-options-binary-log.html#sysvar_sync_binlog) or [`sync_binlog=1`](replication-options-binary-log.html#sysvar_sync_binlog) is set, the delay specified by [`binlog_group_commit_sync_delay`](replication-options-binary-log.html#sysvar_binlog_group_commit_sync_delay) is applied for every binary log commit group before synchronization (or in the case of [`sync_binlog=0`](replication-options-binary-log.html#sysvar_sync_binlog), before proceeding). When [`sync_binlog`](replication-options-binary-log.html#sysvar_sync_binlog) is set to a value *n* greater than 1, the delay is applied after every *n* binary log commit groups.

  Setting [`binlog_group_commit_sync_delay`](replication-options-binary-log.html#sysvar_binlog_group_commit_sync_delay) can increase the number of parallel committing transactions on any server that has (or might have after a failover) a replica, and therefore can increase parallel execution on the replicas. To benefit from this effect, the replica servers must have [`slave_parallel_type=LOGICAL_CLOCK`](replication-options-replica.html#sysvar_slave_parallel_type) set, and the effect is more significant when [`binlog_transaction_dependency_tracking=COMMIT_ORDER`](replication-options-binary-log.html#sysvar_binlog_transaction_dependency_tracking) is also set. It is important to take into account both the source's throughput and the replicas' throughput when you are tuning the setting for [`binlog_group_commit_sync_delay`](replication-options-binary-log.html#sysvar_binlog_group_commit_sync_delay).

  Setting [`binlog_group_commit_sync_delay`](replication-options-binary-log.html#sysvar_binlog_group_commit_sync_delay) can also reduce the number of `fsync()` calls to the binary log on any server (source or replica) that has a binary log.

  Note that setting [`binlog_group_commit_sync_delay`](replication-options-binary-log.html#sysvar_binlog_group_commit_sync_delay) increases the latency of transactions on the server, which might affect client applications. Also, on highly concurrent workloads, it is possible for the delay to increase contention and therefore reduce throughput. Typically, the benefits of setting a delay outweigh the drawbacks, but tuning should always be carried out to determine the optimal setting.

* [`binlog_group_commit_sync_no_delay_count`](replication-options-binary-log.html#sysvar_binlog_group_commit_sync_no_delay_count)

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>4

  The maximum number of transactions to wait for before aborting the current delay as specified by [`binlog_group_commit_sync_delay`](replication-options-binary-log.html#sysvar_binlog_group_commit_sync_delay). If [`binlog_group_commit_sync_delay`](replication-options-binary-log.html#sysvar_binlog_group_commit_sync_delay) is set to 0, then this option has no effect.

* [`binlog_max_flush_queue_time`](replication-options-binary-log.html#sysvar_binlog_max_flush_queue_time)

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>5

  Formerly, this controlled the time in microseconds to continue reading transactions from the flush queue before proceeding with group commit. In MySQL 5.7, this variable no longer has any effect.

  `binlog_max_flush_queue_time` is deprecated as of MySQL 5.7.9, and is marked for eventual removal in a future MySQL release.

* [`binlog_order_commits`](replication-options-binary-log.html#sysvar_binlog_order_commits)

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>6

  When this variable is enabled on a replication source server (which is the default), transaction commit instructions issued to storage engines are serialized on a single thread, so that transactions are always committed in the same order as they are written to the binary log. Disabling this variable permits transaction commit instructions to be issued using multiple threads. Used in combination with binary log group commit, this prevents the commit rate of a single transaction being a bottleneck to throughput, and might therefore produce a performance improvement.

  Transactions are written to the binary log at the point when all the storage engines involved have confirmed that the transaction is prepared to commit. The binary log group commit logic then commits a group of transactions after their binary log write has taken place. When [`binlog_order_commits`](replication-options-binary-log.html#sysvar_binlog_order_commits) is disabled, because multiple threads are used for this process, transactions in a commit group might be committed in a different order from their order in the binary log. (Transactions from a single client always commit in chronological order.) In many cases this does not matter, as operations carried out in separate transactions should produce consistent results, and if that is not the case, a single transaction ought to be used instead.

  If you want to ensure that the transaction history on the source and on a multithreaded replica remains identical, set [`slave_preserve_commit_order=1`](replication-options-replica.html#sysvar_slave_preserve_commit_order) on the replica.

* [`binlog_row_image`](replication-options-binary-log.html#sysvar_binlog_row_image)

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>7

  For MySQL row-based replication, this variable determines how row images are written to the binary log.

  In MySQL row-based replication, each row change event contains two images, a “before” image whose columns are matched against when searching for the row to be updated, and an “after” image containing the changes. Normally, MySQL logs full rows (that is, all columns) for both the before and after images. However, it is not strictly necessary to include every column in both images, and we can often save disk, memory, and network usage by logging only those columns which are actually required.

  Note

  When deleting a row, only the before image is logged, since there are no changed values to propagate following the deletion. When inserting a row, only the after image is logged, since there is no existing row to be matched. Only when updating a row are both the before and after images required, and both written to the binary log.

  For the before image, it is necessary only that the minimum set of columns required to uniquely identify rows is logged. If the table containing the row has a primary key, then only the primary key column or columns are written to the binary log. Otherwise, if the table has a unique key all of whose columns are `NOT NULL`, then only the columns in the unique key need be logged. (If the table has neither a primary key nor a unique key without any `NULL` columns, then all columns must be used in the before image, and logged.) In the after image, it is necessary to log only the columns which have actually changed.

  You can cause the server to log full or minimal rows using the `binlog_row_image` system variable. This variable actually takes one of three possible values, as shown in the following list:

  + `full`: Log all columns in both the before image and the after image.

  + `minimal`: Log only those columns in the before image that are required to identify the row to be changed; log only those columns in the after image where a value was specified by the SQL statement, or generated by auto-increment.

  + `noblob`: Log all columns (same as `full`), except for [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") and [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") columns that are not required to identify rows, or that have not changed.

  Note

  This variable is not supported by NDB Cluster; setting it has no effect on the logging of [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables.

  The default value is `full`.

  When using `minimal` or `noblob`, deletes and updates are guaranteed to work correctly for a given table if and only if the following conditions are true for both the source and destination tables:

  + All columns must be present and in the same order; each column must use the same data type as its counterpart in the other table.

  + The tables must have identical primary key definitions.

  (In other words, the tables must be identical with the possible exception of indexes that are not part of the tables' primary keys.)

  If these conditions are not met, it is possible that the primary key column values in the destination table may prove insufficient to provide a unique match for a delete or update. In this event, no warning or error is issued; the source and replica silently diverge, thus breaking consistency.

  Setting this variable has no effect when the binary logging format is `STATEMENT`. When [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) is `MIXED`, the setting for `binlog_row_image` is applied to changes that are logged using row-based format, but this setting has no effect on changes logged as statements.

  Setting `binlog_row_image` on either the global or session level does not cause an implicit commit; this means that this variable can be changed while a transaction is in progress without affecting the transaction.

* `binlog_rows_query_log_events`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>8

  This system variable affects row-based logging only. When enabled, it causes the server to write informational log events such as row query log events into its binary log. This information can be used for debugging and related purposes, such as obtaining the original query issued on the source when it cannot be reconstructed from the row updates.

  These informational events are normally ignored by MySQL programs reading the binary log and so cause no issues when replicating or restoring from backup. To view them, increase the verbosity level by using mysqlbinlog's [`--verbose`](mysqlbinlog.html#option_mysqlbinlog_verbose) option twice, either as `-vv` or `--verbose --verbose`.

* [`binlog_stmt_cache_size`](replication-options-binary-log.html#sysvar_binlog_stmt_cache_size)

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>9

  This variable determines the size of the cache for the binary log to hold nontransactional statements issued during a transaction.

  Separate binary log transaction and statement caches are allocated for each client if the server supports any transactional storage engines and if the server has the binary log enabled ([`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) option). If you often use large nontransactional statements during transactions, you can increase this cache size to get better performance. The [`Binlog_stmt_cache_use`](server-status-variables.html#statvar_Binlog_stmt_cache_use) and [`Binlog_stmt_cache_disk_use`](server-status-variables.html#statvar_Binlog_stmt_cache_disk_use) status variables can be useful for tuning the size of this variable. See [Section 5.4.4, “The Binary Log”](binary-log.html "5.4.4 The Binary Log").

  The [`binlog_cache_size`](replication-options-binary-log.html#sysvar_binlog_cache_size) system variable sets the size for the transaction cache.

* [`binlog_transaction_dependency_tracking`](replication-options-binary-log.html#sysvar_binlog_transaction_dependency_tracking)

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>0

  The source of dependency information that the source uses to determine which transactions can be executed in parallel by the replica's multithreaded applier. This variable can take one of the three values described in the following list:

  + `COMMIT_ORDER`: Dependency information is generated from the source's commit timestamps. This is the default.

  + `WRITESET`: Dependency information is generated from the source's write set, and any transactions which write different tuples can be parallelized.

  + `WRITESET_SESSION`: Dependency information is generated from the source's write set, and any transactions that write different tuples can be parallelized, with the exception that no two updates from the same session can be reordered.

  In `WRITESET` or `WRITESET_SESSION` mode, transactions can commit out of order unless you also set [`slave_preserve_commit_order=1`](replication-options-replica.html#sysvar_slave_preserve_commit_order).

  For some transactions, the `WRITESET` and `WRITESET_SESSION` modes cannot improve on the results that would have been returned in `COMMIT_ORDER` mode. This is the case for transactions that have empty or partial write sets, transactions that update tables without primary or unique keys, and transactions that update parent tables in a foreign key relationship. In these situations, the source uses `COMMIT_ORDER` mode to generate the dependency information instead.

  The value of this variable cannot be set to anything other than `COMMIT_ORDER` if [`transaction_write_set_extraction`](replication-options-binary-log.html#sysvar_transaction_write_set_extraction) is `OFF`. You should also note that the value of `transaction_write_set_extraction` cannot be changed if the current value of `binlog_transaction_dependency_tracking` is `WRITESET` or `WRITESET_SESSION`. If you change the value, the new value does not take effect on replicas until after the replica has been stopped and restarted with [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") and [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statements.

  The number of row hashes to be kept and checked for the latest transaction to have changed a given row is determined by the value of [`binlog_transaction_dependency_history_size`](replication-options-binary-log.html#sysvar_binlog_transaction_dependency_history_size).

* [`binlog_transaction_dependency_history_size`](replication-options-binary-log.html#sysvar_binlog_transaction_dependency_history_size)

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>1

  Sets an upper limit on the number of row hashes which are kept in memory and used for looking up the transaction that last modified a given row. Once this number of hashes has been reached, the history is purged.

* [`expire_logs_days`](replication-options-binary-log.html#sysvar_expire_logs_days)

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>2

  The number of days for automatic binary log file removal. The default is 0, which means “no automatic removal.” Possible removals happen at startup and when the binary log is flushed. Log flushing occurs as indicated in [Section 5.4, “MySQL Server Logs”](server-logs.html "5.4 MySQL Server Logs").

  To remove binary log files manually, use the [`PURGE BINARY LOGS`](purge-binary-logs.html "13.4.1.1 PURGE BINARY LOGS Statement") statement. See [Section 13.4.1.1, “PURGE BINARY LOGS Statement”](purge-binary-logs.html "13.4.1.1 PURGE BINARY LOGS Statement").

* [`log_bin`](replication-options-binary-log.html#sysvar_log_bin)

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>3

  Whether the binary log is enabled. If the [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) option is used, then the value of this variable is `ON`; otherwise it is `OFF`. This variable reports only on the status of binary logging (enabled or disabled); it does not actually report the value to which [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) is set.

  See [Section 5.4.4, “The Binary Log”](binary-log.html "5.4.4 The Binary Log").

* [`log_bin_basename`](replication-options-binary-log.html#sysvar_log_bin_basename)

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>4

  Holds the base name and path for the binary log files, which can be set with the [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) server option. The maximum variable length is 256. In MySQL 5.7, the default base name is the name of the host machine with the suffix `-bin`. The default location is the data directory.

* [`log_bin_index`](replication-options-binary-log.html#sysvar_log_bin_index)

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>5

  Holds the base name and path for the binary log index file, which can be set with the [`--log-bin-index`](replication-options-binary-log.html#option_mysqld_log-bin-index) server option. The maximum variable length is 256.

* [`log_bin_trust_function_creators`](replication-options-binary-log.html#sysvar_log_bin_trust_function_creators)

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>6

  This variable applies when binary logging is enabled. It controls whether stored function creators can be trusted not to create stored functions that causes unsafe events to be written to the binary log. If set to 0 (the default), users are not permitted to create or alter stored functions unless they have the [`SUPER`](privileges-provided.html#priv_super) privilege in addition to the [`CREATE ROUTINE`](privileges-provided.html#priv_create-routine) or [`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine) privilege. A setting of 0 also enforces the restriction that a function must be declared with the `DETERMINISTIC` characteristic, or with the `READS SQL DATA` or `NO SQL` characteristic. If the variable is set to 1, MySQL does not enforce these restrictions on stored function creation. This variable also applies to trigger creation. See [Section 23.7, “Stored Program Binary Logging”](stored-programs-logging.html "23.7 Stored Program Binary Logging").

* [`log_bin_use_v1_row_events`](replication-options-binary-log.html#sysvar_log_bin_use_v1_row_events)

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>7

  Whether Version 2 binary logging is in use. If this variable is 0 (disabled, the default), Version 2 binary log events are in use. If this variable is 1 (enabled), the server writes the binary log using Version 1 logging events (the only version of binary log events used in previous releases), and thus produces a binary log that can be read by older replicas.

  MySQL 5.7 uses Version 2 binary log row events by default. However, Version 2 events cannot be read by MySQL Server releases prior to MySQL 5.6.6. Enabling [`log_bin_use_v1_row_events`](replication-options-binary-log.html#sysvar_log_bin_use_v1_row_events) causes [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") to write the binary log using Version 1 logging events.

  This variable is read-only at runtime. To switch between Version 1 and Version 2 binary event binary logging, it is necessary to set [`log_bin_use_v1_row_events`](replication-options-binary-log.html#sysvar_log_bin_use_v1_row_events) at server startup.

  Other than when performing upgrades of NDB Cluster Replication, [`log_bin_use_v1_row_events`](replication-options-binary-log.html#sysvar_log_bin_use_v1_row_events) is chiefly of interest when setting up replication conflict detection and resolution using `NDB$EPOCH_TRANS()` as the conflict detection function, which requires Version 2 binary log row events. Thus, this variable and [`--ndb-log-transaction-id`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-transaction-id) are not compatible.

  Note

  MySQL NDB Cluster 7.5 uses Version 2 binary log row events by default. You should keep this mind when planning upgrades or downgrades, and for setups using NDB Cluster Replication.

  For more information, see [Section 21.7.11, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "21.7.11 NDB Cluster Replication Conflict Resolution").

* [`log_builtin_as_identified_by_password`](replication-options-binary-log.html#sysvar_log_builtin_as_identified_by_password)

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>8

  This variable affects binary logging of user-management statements. When enabled, the variable has the following effects:

  + Binary logging for [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") statements involving built-in authentication plugins rewrites the statements to include an `IDENTIFIED BY PASSWORD` clause.

  + [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement") statements are logged as [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement") statements, rather than being rewritten to [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") statements.

  + [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement") statements are changed to log the hash of the password instead of the supplied cleartext (unencrypted) password.

  Enabling this variable ensures better compatibility for cross-version replication with 5.6 and pre-5.7.6 replicas, and for applications that expect this syntax in the binary log.

* [`log_slave_updates`](replication-options-binary-log.html#sysvar_log_slave_updates)

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>9

  Whether updates received by a replica server from a source server should be logged to the replica's own binary log.

  Normally, a replica does not log to its own binary log any updates that are received from a source server. Enabling this variable causes the replica to write the updates performed by its replication SQL thread to its own binary log. For this option to have any effect, the replica must also be started with the [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) option to enable binary logging. See [Section 16.1.6, “Replication and Binary Logging Options and Variables”](replication-options.html "16.1.6 Replication and Binary Logging Options and Variables").

  [`log_slave_updates`](replication-options-binary-log.html#sysvar_log_slave_updates) is enabled when you want to chain replication servers. For example, you might want to set up replication servers using this arrangement:

  ```sql
  A -> B -> C
  ```

  Here, `A` serves as the source for the replica `B`, and `B` serves as the source for the replica `C`. For this to work, `B` must be both a source *and* a replica. You must start both `A` and `B` with [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) to enable binary logging, and `B` with [`log_slave_updates`](replication-options-binary-log.html#sysvar_log_slave_updates) enabled so that updates received from `A` are logged by `B` to its binary log.

* [`log_statements_unsafe_for_binlog`](replication-options-binary-log.html#sysvar_log_statements_unsafe_for_binlog)

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

  If error 1592 is encountered, controls whether the generated warnings are added to the error log or not.

* [`master_verify_checksum`](replication-options-binary-log.html#sysvar_master_verify_checksum)

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

  Enabling this variable causes the source to verify events read from the binary log by examining checksums, and to stop with an error in the event of a mismatch. [`master_verify_checksum`](replication-options-binary-log.html#sysvar_master_verify_checksum) is disabled by default; in this case, the source uses the event length from the binary log to verify events, so that only complete events are read from the binary log.

* [`max_binlog_cache_size`](replication-options-binary-log.html#sysvar_max_binlog_cache_size)

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

  If a transaction requires more than this many bytes, the server generates a Multi-statement transaction required more than 'max\_binlog\_cache\_size' bytes of storage error. When [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) is not `ON`, the maximum recommended value is 4GB, due to the fact that, in this case, MySQL cannot work with binary log positions greater than 4GB; when `gtid_mode` is `ON`, this limitation does not apply, and the server can work with binary log positions of arbitrary size.

  If, because [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) is not `ON`, or for some other reason, you need to guarantee that the binary log does not exceed a given size *`maxsize`*, you should set this variable according to the formula shown here:

  ```sql
  max_binlog_cache_size <
    (((maxsize - max_binlog_size) / max_connections) - 1000) / 1.2
  ```

  This calculation takes into account the following conditions:

  + The server writes to the binary log as long as the size before it begins to write is less than [`max_binlog_size`](replication-options-binary-log.html#sysvar_max_binlog_size).

  + The server does not write single transactions, but rather groups of transactions. The maximum possible number of transactions in a group is equal to [`max_connections`](server-system-variables.html#sysvar_max_connections).

  + The server writes data that is not included in the cache. This includes a 4-byte checksum for each event; while this adds less than 20% to the transaction size, this amount is non-negible. In addition, the server writes a `Gtid_log_event` for each transaction; each of these events can add another 1 KB to what is written to the binary log.

  `max_binlog_cache_size` sets the size for the transaction cache only; the upper limit for the statement cache is governed by the [`max_binlog_stmt_cache_size`](replication-options-binary-log.html#sysvar_max_binlog_stmt_cache_size) system variable.

  The visibility to sessions of `max_binlog_cache_size` matches that of the [`binlog_cache_size`](replication-options-binary-log.html#sysvar_binlog_cache_size) system variable; in other words, changing its value affects only new sessions that are started after the value is changed.

* [`max_binlog_size`](replication-options-binary-log.html#sysvar_max_binlog_size)

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

  If a write to the binary log causes the current log file size to exceed the value of this variable, the server rotates the binary logs (closes the current file and opens the next one). The minimum value is 4096 bytes. The maximum and default value is 1GB.

  A transaction is written in one chunk to the binary log, so it is never split between several binary logs. Therefore, if you have big transactions, you might see binary log files larger than [`max_binlog_size`](replication-options-binary-log.html#sysvar_max_binlog_size).

  If [`max_relay_log_size`](replication-options-replica.html#sysvar_max_relay_log_size) is 0, the value of [`max_binlog_size`](replication-options-binary-log.html#sysvar_max_binlog_size) applies to relay logs as well.

* [`max_binlog_stmt_cache_size`](replication-options-binary-log.html#sysvar_max_binlog_stmt_cache_size)

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

  If nontransactional statements within a transaction require more than this many bytes of memory, the server generates an error. The minimum value is 4096. The maximum and default values are 4GB on 32-bit platforms and 16EB (exabytes) on 64-bit platforms.

  `max_binlog_stmt_cache_size` sets the size for the statement cache only; the upper limit for the transaction cache is governed exclusively by the [`max_binlog_cache_size`](replication-options-binary-log.html#sysvar_max_binlog_cache_size) system variable.

* [`sql_log_bin`](replication-options-binary-log.html#sysvar_sql_log_bin)

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

  This variable controls whether logging to the binary log is enabled for the current session (assuming that the binary log itself is enabled). The default value is `ON`. To disable or enable binary logging for the current session, set the session [`sql_log_bin`](replication-options-binary-log.html#sysvar_sql_log_bin) variable to `OFF` or `ON`.

  Set this variable to `OFF` for a session to temporarily disable binary logging while making changes to the source you do not want replicated to the replica.

  Setting the session value of this system variable is a restricted operation. The session user must have privileges sufficient to set restricted session variables. See [Section 5.1.8.1, “System Variable Privileges”](system-variable-privileges.html "5.1.8.1 System Variable Privileges").

  It is not possible to set the session value of [`sql_log_bin`](replication-options-binary-log.html#sysvar_sql_log_bin) within a transaction or subquery.

  *Setting this variable to `OFF` prevents GTIDs from being assigned to transactions in the binary log*. If you are using GTIDs for replication, this means that even when binary logging is later enabled again, the GTIDs written into the log from this point do not account for any transactions that occurred in the meantime, so in effect those transactions are lost.

  The global [`sql_log_bin`](replication-options-binary-log.html#sysvar_sql_log_bin) variable is read only and cannot be modified. The global scope is deprecated; expect it to be removed in a future MySQL release.

* [`sync_binlog`](replication-options-binary-log.html#sysvar_sync_binlog)

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

  Controls how often the MySQL server synchronizes the binary log to disk.

  + [`sync_binlog=0`](replication-options-binary-log.html#sysvar_sync_binlog): Disables synchronization of the binary log to disk by the MySQL server. Instead, the MySQL server relies on the operating system to flush the binary log to disk from time to time as it does for any other file. This setting provides the best performance, but in the event of a power failure or operating system crash, it is possible that the server has committed transactions that have not been synchronized to the binary log.

  + [`sync_binlog=1`](replication-options-binary-log.html#sysvar_sync_binlog): Enables synchronization of the binary log to disk before transactions are committed. This is the safest setting but can have a negative impact on performance due to the increased number of disk writes. In the event of a power failure or operating system crash, transactions that are missing from the binary log are only in a prepared state. This permits the automatic recovery routine to roll back the transactions, which guarantees that no transaction is lost from the binary log.

  + [`sync_binlog=N`](replication-options-binary-log.html#sysvar_sync_binlog), where *`N`* is a value other than 0 or 1: The binary log is synchronized to disk after `N` binary log commit groups have been collected. In the event of a power failure or operating system crash, it is possible that the server has committed transactions that have not been flushed to the binary log. This setting can have a negative impact on performance due to the increased number of disk writes. A higher value improves performance, but with an increased risk of data loss.

  For the greatest possible durability and consistency in a replication setup that uses `InnoDB` with transactions, use these settings:

  + [`sync_binlog=1`](replication-options-binary-log.html#sysvar_sync_binlog).
  + [`innodb_flush_log_at_trx_commit=1`](innodb-parameters.html#sysvar_innodb_flush_log_at_trx_commit).

  Caution

  Many operating systems and some disk hardware fool the flush-to-disk operation. They may tell [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") that the flush has taken place, even though it has not. In this case, the durability of transactions is not guaranteed even with the recommended settings, and in the worst case, a power outage can corrupt `InnoDB` data. Using a battery-backed disk cache in the SCSI disk controller or in the disk itself speeds up file flushes, and makes the operation safer. You can also try to disable the caching of disk writes in hardware caches.

* [`transaction_write_set_extraction`](replication-options-binary-log.html#sysvar_transaction_write_set_extraction)

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

  Defines the algorithm used to generate a hash identifying the writes associated with a transaction. If you are using Group Replication, the hash value is used for distributed conflict detection and handling. On 64-bit systems running Group Replication, we recommend setting this to `XXHASH64` in order to avoid unnecessary hash collisions which result in certification failures and the roll back of user transactions. See [Section 17.3.1, “Group Replication Requirements”](group-replication-requirements.html "17.3.1 Group Replication Requirements"). [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) must be set to `ROW` to change the value of this variable. If you change the value, the new value does not take effect on replicas until after the replica has been stopped and restarted with [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") and [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statements.

  Note

  When `WRITESET` or `WRITESET_SESSION` is set as the value for [`binlog_transaction_dependency_tracking`](replication-options-binary-log.html#sysvar_binlog_transaction_dependency_tracking), [`transaction_write_set_extraction`](replication-options-binary-log.html#sysvar_transaction_write_set_extraction) must be set to specify an algorithm (not set to `OFF`). While the current value of [`binlog_transaction_dependency_tracking`](replication-options-binary-log.html#sysvar_binlog_transaction_dependency_tracking) is `WRITESET` or `WRITESET_SESSION`, you cannot change the value of [`transaction_write_set_extraction`](replication-options-binary-log.html#sysvar_transaction_write_set_extraction).
