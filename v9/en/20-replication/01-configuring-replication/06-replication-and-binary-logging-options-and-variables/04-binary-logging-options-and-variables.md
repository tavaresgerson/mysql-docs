#### 19.1.6.4 Binary Logging Options and Variables

* Startup Options Used with Binary Logging
* System Variables Used with Binary Logging

You can use the **mysqld** options and system variables that are described in this section to affect the operation of the binary log as well as to control which statements are written to the binary log. For additional information about the binary log, see Section 7.4.4, “The Binary Log”. For additional information about using MySQL server options and system variables, see Section 7.1.7, “Server Command Options”, and Section 7.1.8, “Server System Variables”.

##### Startup Options Used with Binary Logging

The following list describes startup options for enabling and configuring the binary log. System variables used with binary logging are discussed later in this section.

* `--binlog-row-event-max-size=N`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binlog-row-event-max-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="replication-options-binary-log.html#sysvar_binlog_row_event_max_size">binlog_row_event_max_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">8192</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">256</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code class="literal">18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code class="literal">4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

  When row-based binary logging is used, this setting is a soft limit on the maximum size of a row-based binary log event, in bytes. Where possible, rows stored in the binary log are grouped into events with a size not exceeding the value of this setting. If an event cannot be split, the maximum size can be exceeded. The value must be (or else gets rounded down to) a multiple of 256. The default is 8192 bytes.

* `--log-bin[=base_name]`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  Specifies the base name to use for binary log files. With binary logging enabled, the server logs all statements that change data to the binary log, which is used for backup and replication. The binary log is a sequence of files with a base name and numeric extension. The `--log-bin` option value is the base name for the log sequence. The server creates binary log files in sequence by adding a numeric suffix to the base name.

  If you do not supply the `--log-bin` option, MySQL uses `binlog` as the default base name for the binary log files. For compatibility with earlier releases, if you supply the `--log-bin` option with no string or with an empty string, the base name defaults to `host_name-bin`, using the name of the host machine.

  The default location for binary log files is the data directory. You can use the `--log-bin` option to specify an alternative location, by adding a leading absolute path name to the base name to specify a different directory. When the server reads an entry from the binary log index file, which tracks the binary log files that have been used, it checks whether the entry contains a relative path. If it does, the relative part of the path is replaced with the absolute path set using the `--log-bin` option. An absolute path recorded in the binary log index file remains unchanged; in such a case, the index file must be edited manually to enable a new path or paths to be used. The binary log file base name and any specified path are available as the `log_bin_basename` system variable.

  In MySQL 9.5, binary logging is enabled by default, whether or not you specify the `--log-bin` option. The exception is if you use **mysqld** to initialize the data directory manually by invoking it with the `--initialize` or `--initialize-insecure` option, when binary logging is disabled by default. It is possible to enable binary logging in this case by specifying the `--log-bin` option. When binary logging is enabled, the `log_bin` system variable, which shows the status of binary logging on the server, is set to ON.

  To disable binary logging, you can specify the `--skip-log-bin` or `--disable-log-bin` option at startup. If either of these options is specified and `--log-bin` is also specified, the option specified later takes precedence. When binary logging is disabled, the `log_bin` system variable is set to OFF.

  When GTIDs are in use on the server, if you disable binary logging when restarting the server after an abnormal shutdown, some GTIDs are likely to be lost, causing replication to fail. In a normal shutdown, the set of GTIDs from the current binary log file is saved in the `mysql.gtid_executed` table. Following an abnormal shutdown where this did not happen, during recovery the GTIDs are added to the table from the binary log file, provided that binary logging is still enabled. If binary logging is disabled for the server restart, the server cannot access the binary log file to recover the GTIDs, so replication cannot be started. Binary logging can be disabled safely after a normal shutdown.

  The `--log-replica-updates` and `--replica-preserve-commit-order` options require binary logging. If you disable binary logging, either omit these options, or specify `--log-replica-updates=OFF` and `--skip-replica-preserve-commit-order`. MySQL disables these options by default when `--skip-log-bin` or `--disable-log-bin` is specified. If you specify `--log-replica-updates` or `--replica-preserve-commit-order` together with `--skip-log-bin` or `--disable-log-bin`, a warning or error message is issued.

  The server can be started with the default server ID when binary logging is enabled, but an informational message is issued if you do not specify a server ID explicitly by setting the `server_id` system variable. For servers that are used in a replication topology, you must specify a unique nonzero server ID for each server.

  For information on the format and management of the binary log, see Section 7.4.4, “The Binary Log”.

* `--log-bin-index[=file_name]`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  The name for the binary log index file, which contains the names of the binary log files. By default, it has the same location and base name as the value specified for the binary log files using the `--log-bin` option, plus the extension `.index`. If you do not specify `--log-bin`, the default binary log index file name is `binlog.index`. If you specify `--log-bin` option with no string or an empty string, the default binary log index file name is `host_name-bin.index`, using the name of the host machine.

  For information on the format and management of the binary log, see Section 7.4.4, “The Binary Log”.

**Statement selection options.** The options in the following list affect which statements are written to the binary log, and thus sent by a replication source server to its replicas. There are also options for replicas that control which statements received from the source should be executed or ignored. For details, see Section 19.1.6.3, “Replica Server Options and Variables”.

* `--binlog-do-db=db_name`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  This option affects binary logging in a manner similar to the way that `--replicate-do-db` affects replication.

  The effects of this option depend on whether the statement-based or row-based logging format is in use, in the same way that the effects of `--replicate-do-db` depend on whether statement-based or row-based replication is in use. You should keep in mind that the format used to log a given statement may not necessarily be the same as that indicated by the value of `binlog_format`. For example, DDL statements such as `CREATE TABLE` and `ALTER TABLE` are always logged as statements, without regard to the logging format in effect, so the following statement-based rules for `--binlog-do-db` always apply in determining whether or not the statement is logged.

  **Statement-based logging.** Only those statements are written to the binary log where the default database (that is, the one selected by `USE`) is *`db_name`*. To specify more than one database, use this option multiple times, once for each database; however, doing so does *not* cause cross-database statements such as `UPDATE some_db.some_table SET foo='bar'` to be logged while a different database (or no database) is selected.

  Warning

  To specify multiple databases you *must* use multiple instances of this option. Because database names can contain commas, the list is treated as the name of a single database if you supply a comma-separated list.

  An example of what does not work as you might expect when using statement-based logging: If the server is started with `--binlog-do-db=sales` and you issue the following statements, the `UPDATE` statement is *not* logged:

  ```
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

  The main reason for this “just check the default database” behavior is that it is difficult from the statement alone to know whether it should be replicated (for example, if you are using multiple-table `DELETE` statements or multiple-table `UPDATE` statements that act across multiple databases). It is also faster to check only the default database rather than all databases if there is no need.

  Another case which may not be self-evident occurs when a given database is replicated even though it was not specified when setting the option. If the server is started with `--binlog-do-db=sales`, the following `UPDATE` statement is logged even though `prices` was not included when setting `--binlog-do-db`:

  ```
  USE sales;
  UPDATE prices.discounts SET percentage = percentage + 10;
  ```

  Because `sales` is the default database when the `UPDATE` statement is issued, the `UPDATE` is logged.

  **Row-based logging.** Logging is restricted to database *`db_name`*. Only changes to tables belonging to *`db_name`* are logged; the default database has no effect on this. Suppose that the server is started with `--binlog-do-db=sales` and row-based logging is in effect, and then the following statements are executed:

  ```
  USE prices;
  UPDATE sales.february SET amount=amount+100;
  ```

  The changes to the `february` table in the `sales` database are logged in accordance with the `UPDATE` statement; this occurs whether or not the `USE` statement was issued. However, when using the row-based logging format and `--binlog-do-db=sales`, changes made by the following `UPDATE` are not logged:

  ```
  USE prices;
  UPDATE prices.march SET amount=amount-25;
  ```

  Even if the `USE prices` statement were changed to `USE sales`, the `UPDATE` statement's effects would still not be written to the binary log.

  Another important difference in `--binlog-do-db` handling for statement-based logging as opposed to the row-based logging occurs with regard to statements that refer to multiple databases. Suppose that the server is started with `--binlog-do-db=db1`, and the following statements are executed:

  ```
  USE db1;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  If you are using statement-based logging, the updates to both tables are written to the binary log. However, when using the row-based format, only the changes to `table1` are logged; `table2` is in a different database, so it is not changed by the `UPDATE`. Now suppose that, instead of the `USE db1` statement, a `USE db4` statement had been used:

  ```
  USE db4;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  In this case, the `UPDATE` statement is not written to the binary log when using statement-based logging. However, when using row-based logging, the change to `table1` is logged, but not that to `table2`—in other words, only changes to tables in the database named by `--binlog-do-db` are logged, and the choice of default database has no effect on this behavior.

* `--binlog-ignore-db=db_name`

  <table frame="box" rules="all" summary="Properties for binlog-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binlog-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  This option affects binary logging in a manner similar to the way that `--replicate-ignore-db` affects replication.

  The effects of this option depend on whether the statement-based or row-based logging format is in use, in the same way that the effects of `--replicate-ignore-db` depend on whether statement-based or row-based replication is in use. You should keep in mind that the format used to log a given statement may not necessarily be the same as that indicated by the value of `binlog_format`. For example, DDL statements such as `CREATE TABLE` and `ALTER TABLE` are always logged as statements, without regard to the logging format in effect, so the following statement-based rules for `--binlog-ignore-db` always apply in determining whether or not the statement is logged.

  **Statement-based logging.** Tells the server to not log any statement where the default database (that is, the one selected by `USE`) is *`db_name`*.

  When there is no default database, no `--binlog-ignore-db` options are applied, and such statements are always logged. (Bug #11829838, Bug
  #60188)

  **Row-based format.** Tells the server not to log updates to any tables in the database *`db_name`*. The current database has no effect.

  When using statement-based logging, the following example does not work as you might expect. Suppose that the server is started with `--binlog-ignore-db=sales` and you issue the following statements:

  ```
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

  The `UPDATE` statement *is* logged in such a case because `--binlog-ignore-db` applies only to the default database (determined by the `USE` statement). Because the `sales` database was specified explicitly in the statement, the statement has not been filtered. However, when using row-based logging, the `UPDATE` statement's effects are *not* written to the binary log, which means that no changes to the `sales.january` table are logged; in this instance, `--binlog-ignore-db=sales` causes *all* changes made to tables in the source's copy of the `sales` database to be ignored for purposes of binary logging.

  To specify more than one database to ignore, use this option multiple times, once for each database. Because database names can contain commas, the list is treated as the name of a single database if you supply a comma-separated list.

  You should not use this option if you are using cross-database updates and you do not want these updates to be logged.

**Checksum options.** MySQL supports reading and writing of binary log checksums. These are enabled using the two options listed here:

* `--binlog-checksum={NONE|CRC32}`

  <table frame="box" rules="all" summary="Properties for binlog-checksum"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binlog-checksum=type</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">CRC32</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">NONE</code></p><p class="valid-value"><code class="literal">CRC32</code></p></td> </tr></tbody></table>

  Enabling this option causes the source to write checksums for events written to the binary log. Set to `NONE` to disable, or the name of the algorithm to be used for generating checksums; currently, only CRC32 checksums are supported, and CRC32 is the default. You cannot change the setting for this option within a transaction.

To control reading of checksums by the replica (from the relay log), use the `--replica-sql-verify-checksum` option.

**Testing and debugging options.** The following binary log options are used in replication testing and debugging. They are not intended for use in normal operations.

* `--max-binlog-dump-events=N`

  <table frame="box" rules="all" summary="Properties for max-binlog-dump-events"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--max-binlog-dump-events=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">0</code></td> </tr></tbody></table>

  This option is used internally by the MySQL test suite for replication testing and debugging.

* `--sporadic-binlog-dump-fail`

  <table frame="box" rules="all" summary="Properties for sporadic-binlog-dump-fail"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--sporadic-binlog-dump-fail[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  This option is used internally by the MySQL test suite for replication testing and debugging.

##### System Variables Used with Binary Logging

The following list describes system variables for controlling binary logging. They can be set at server startup and some of them can be changed at runtime using `SET`. Server options used to control binary logging are listed earlier in this section.

* `binlog_cache_size`

  <table frame="box" rules="all" summary="Properties for binlog_cache_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binlog-cache-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="replication-options-binary-log.html#sysvar_binlog_cache_size">binlog_cache_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">32768</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code class="literal">18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code class="literal">4294963200</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code class="literal">4096</code></td> </tr></tbody></table>

  The size of the memory buffer to hold changes to the binary log during a transaction.

  When binary logging is enabled on the server (with the `log_bin` system variable set to ON), a binary log cache is allocated for each client if the server supports any transactional storage engines. If the data for the transaction exceeds the space in the memory buffer, the excess data is stored in a temporary file. When binary log encryption is active on the server, the memory buffer is not encrypted, but any temporary file used to hold the binary log cache is encrypted. After each transaction is committed, the binary log cache is reset by clearing the memory buffer and truncating the temporary file if used.

  If you often use large transactions, you can increase this cache size to get better performance by reducing or eliminating the need to write to temporary files. The `Binlog_cache_use` and `Binlog_cache_disk_use` status variables can be useful for tuning the size of this variable. See Section 7.4.4, “The Binary Log”.

  `binlog_cache_size` sets the size for the transaction cache only; the size of the statement cache is governed by the `binlog_stmt_cache_size` system variable.

* `binlog_checksum`

  <table frame="box" rules="all" summary="Properties for binlog_checksum"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binlog-checksum=type</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="replication-options-binary-log.html#sysvar_binlog_checksum">binlog_checksum</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">CRC32</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">NONE</code></p><p class="valid-value"><code class="literal">CRC32</code></p></td> </tr></tbody></table>

  When enabled, this variable causes the source to write a checksum for each event in the binary log. `binlog_checksum` supports the values `NONE` (which disables checksums) and `CRC32`. The default is `CRC32`. When `binlog_checksum` is disabled (value `NONE`), the server verifies that it is writing only complete events to the binary log by writing and checking the event length (rather than a checksum) for each event.

  Setting this variable on the source to a value unrecognized by the replica causes the replica to set its own `binlog_checksum` value to `NONE`, and to stop replication with an error. If backward compatibility with older replicas is a concern, you may want to set the value explicitly to `NONE`.

  Group Replication in MySQL 9.5 supports checksums, so group members may use the default setting.

  Changing the value of `binlog_checksum` causes the binary log to be rotated, because checksums must be written for an entire binary log file, and never for only part of one. You cannot change the value of `binlog_checksum` within a transaction.

  When binary log transaction compression is enabled using the `binlog_transaction_compression` system variable, checksums are not written for individual events in a compressed transaction payload. Instead a checksum is written for the GTID event, and a checksum for the compressed `Transaction_payload_event`.

* `binlog_direct_non_transactional_updates`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>0

  Due to concurrency issues, a replica can become inconsistent when a transaction contains updates to both transactional and nontransactional tables. MySQL tries to preserve causality among these statements by writing nontransactional statements to the transaction cache, which is flushed upon commit. However, problems arise when modifications done to nontransactional tables on behalf of a transaction become immediately visible to other connections because these changes may not be written immediately into the binary log.

  The `binlog_direct_non_transactional_updates` variable offers one possible workaround to this issue. By default, this variable is disabled. Enabling `binlog_direct_non_transactional_updates` causes updates to nontransactional tables to be written directly to the binary log, rather than to the transaction cache.

  Setting the session value of this system variable is a restricted operation. The session user must have privileges sufficient to set restricted session variables. See Section 7.1.9.1, “System Variable Privileges”.

  *`binlog_direct_non_transactional_updates` works only for statements that are replicated using the statement-based binary logging format*; that is, it works only when the value of `binlog_format` is `STATEMENT`, or when `binlog_format` is `MIXED` and a given statement is being replicated using the statement-based format. This variable has no effect when the binary log format is `ROW`, or when `binlog_format` is set to `MIXED` and a given statement is replicated using the row-based format.

  Important

  Before enabling this variable, you must make certain that there are no dependencies between transactional and nontransactional tables; an example of such a dependency would be the statement `INSERT INTO myisam_table SELECT * FROM innodb_table`. Otherwise, such statements are likely to cause the replica to diverge from the source.

  This variable has no effect when the binary log format is `ROW` or `MIXED`.

* `binlog_encryption`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>1

  Enables encryption for binary log files and relay log files on this server. `OFF` is the default. `ON` sets encryption on for binary log files and relay log files. Binary logging does not need to be enabled on the server to enable encryption, so you can encrypt the relay log files on a replica that has no binary log. To use encryption, a keyring plugin must be installed and configured to supply MySQL Server's keyring service. For instructions to do this, see Section 8.4.5, “The MySQL Keyring”. Any supported keyring plugin can be used to store binary log encryption keys.

  When you first start the server with binary log encryption enabled, a new binary log encryption key is generated before the binary log and relay logs are initialized. This key is used to encrypt a file password for each binary log file (if the server has binary logging enabled) and relay log file (if the server has replication channels), and further keys generated from the file passwords are used to encrypt the data in the files. Relay log files are encrypted for all channels, including Group Replication applier channels and new channels that are created after encryption is activated. The binary log index file and relay log index file are never encrypted.

  If you activate encryption while the server is running, a new binary log encryption key is generated at that time. The exception is if encryption was active previously on the server and was then disabled, in which case the binary log encryption key that was in use before is used again. The binary log file and relay log files are rotated immediately, and file passwords for the new files and all subsequent binary log files and relay log files are encrypted using this binary log encryption key. Existing binary log files and relay log files still present on the server are not automatically encrypted, but you can purge them if they are no longer needed.

  If you deactivate encryption by changing the `binlog_encryption` system variable to `OFF`, the binary log file and relay log files are rotated immediately and all subsequent logging is unencrypted. Previously encrypted files are not automatically decrypted, but the server is still able to read them. The `BINLOG_ENCRYPTION_ADMIN` privilege (or the deprecated `SUPER` privilege) is required to activate or deactivate encryption while the server is running. Group Replication applier channels are not included in the relay log rotation request, so unencrypted logging for these channels does not start until their logs are rotated in normal use.

  For more information on binary log file and relay log file encryption, see Section 19.3.2, “Encrypting Binary Log Files and Relay Log Files”.

* `binlog_error_action`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>2

  Controls what happens when the server encounters an error such as not being able to write to, flush or synchronize the binary log, which can cause the source's binary log to become inconsistent and replicas to lose synchronization.

  This variable defaults to `ABORT_SERVER`, which makes the server halt logging and shut down whenever it encounters such an error with the binary log. On restart, recovery proceeds as in the case of an unexpected server halt (see Section 19.4.2, “Handling an Unexpected Halt of a Replica”).

  When `binlog_error_action` is set to `IGNORE_ERROR`, if the server encounters such an error it continues the ongoing transaction, logs the error then halts logging, and continues performing updates. To resume binary logging `log_bin` must be enabled again, which requires a server restart. This setting provides backward compatibility with older versions of MySQL.

* `binlog_expire_logs_seconds`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>3

  Sets the binary log expiration period in seconds. After their expiration period ends, binary log files can be automatically removed. Possible removals happen at startup and when the binary log is flushed. Log flushing occurs as indicated in Section 7.4, “MySQL Server Logs”.

  The default binary log expiration period is 2592000 seconds, which equals 30 days (30\*24\*60\*60 seconds).

  Automatic purging of the binary log can be disabled by setting the `binlog_expire_logs_auto_purge` system variable to `OFF`. This takes precedence over any setting for `binlog_expire_logs_seconds`.

  To remove binary log files manually, use the `PURGE BINARY LOGS` statement. See Section 15.4.1.1, “PURGE BINARY LOGS Statement”.

* `binlog_expire_logs_auto_purge`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>4

  Enables or disables automatic purging of binary log files. Setting this variable to `ON` (the default) enables automatic purging; setting it to `OFF` disables automatic purging. The interval to wait before purging is controlled by `binlog_expire_logs_seconds`.

  Note

  Even if `binlog_expire_logs_auto_purge` is `ON`, setting `binlog_expire_logs_seconds` to `0` stops automatic purging from taking place.

  This variable has no effect on `PURGE BINARY LOGS`.

* `binlog_format`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>5

  This system variable sets the binary logging format, and can be any one of `STATEMENT`, `ROW`, or `MIXED`. (See Section 19.2.1, “Replication Formats”.) The setting takes effect when binary logging is enabled on the server, which is the case when the `log_bin` system variable is set to `ON`. In MySQL 9.5, binary logging is enabled by default, and by default uses the row-based format.

  Note

  `binlog_format` is deprecated, and subject to removal in a future version of MySQL. This implies that support for logging formats other than row-based is also subject to removal in a future release. Thus, only row-based logging should be employed for any new MySQL Replication setups.

  `binlog_format` can be set at startup or at runtime, except that under some conditions, changing this variable at runtime is not possible or causes replication to fail, as described later.

  The default is `ROW`. *Exception*: In NDB Cluster, the default is `MIXED`; statement-based replication is not supported for NDB Cluster.

  Setting the session value of this system variable is a restricted operation. The session user must have privileges sufficient to set restricted session variables. See Section 7.1.9.1, “System Variable Privileges”.

  The rules governing when changes to this variable take effect and how long the effect lasts are the same as for other MySQL server system variables. For more information, see Section 15.7.6.1, “SET Syntax for Variable Assignment”.

  When `MIXED` is specified, statement-based replication is used, except for cases where only row-based replication is guaranteed to lead to proper results. For example, this happens when statements contain loadable functions or the `UUID()` function.

  For details of how stored programs (stored procedures and functions, triggers, and events) are handled when each binary logging format is set, see Section 27.9, “Stored Program Binary Logging”.

  There are exceptions when you cannot switch the replication format at runtime:

  + The replication format cannot be changed from within a stored function or a trigger.

  + If a session has open temporary tables, the replication format cannot be changed for the session (`SET @@SESSION.binlog_format`).

  + If any replication channel has open temporary tables, the replication format cannot be changed globally (`SET @@GLOBAL.binlog_format` or `SET @@PERSIST.binlog_format`).

  + If any replication channel applier thread is currently running, the replication format cannot be changed globally (`SET @@GLOBAL.binlog_format` or `SET @@PERSIST.binlog_format`).

  Trying to switch the replication format in any of these cases (or attempting to set the current replication format) results in an error. You can, however, use `PERSIST_ONLY` (`SET @@PERSIST_ONLY.binlog_format`) to change the replication format at any time, because this action does not modify the runtime global system variable value, and takes effect only after a server restart.

  Switching the replication format at runtime is not recommended when any temporary tables exist, because temporary tables are logged only when using statement-based replication, whereas with row-based replication and mixed replication, they are not logged.

  Changing the logging format on a replication source server does not cause a replica to change its logging format to match. Switching the replication format while replication is ongoing can cause issues if a replica has binary logging enabled, and the change results in the replica using `STATEMENT` format logging while the source is using `ROW` or `MIXED` format logging. A replica is not able to convert binary log entries received in `ROW` logging format to `STATEMENT` format for use in its own binary log, so this situation can cause replication to fail. For more information, see Section 7.4.4.2, “Setting The Binary Log Format”.

  The binary log format affects the behavior of the following server options:

  + `--replicate-do-db`
  + `--replicate-ignore-db`
  + `--binlog-do-db`
  + `--binlog-ignore-db`

  These effects are discussed in detail in the descriptions of the individual options.

* `binlog_group_commit_sync_delay`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>6

  Controls how many microseconds the binary log commit waits before synchronizing the binary log file to disk. By default `binlog_group_commit_sync_delay` is set to 0, meaning that there is no delay. Setting `binlog_group_commit_sync_delay` to a microsecond delay enables more transactions to be synchronized together to disk at once, reducing the overall time to commit a group of transactions because the larger groups require fewer time units per group.

  When `sync_binlog=0` or `sync_binlog=1` is set, the delay specified by `binlog_group_commit_sync_delay` is applied for every binary log commit group before synchronization (or in the case of `sync_binlog=0`, before proceeding). When `sync_binlog` is set to a value *n* greater than 1, the delay is applied after every *n* binary log commit groups.

  Setting `binlog_group_commit_sync_delay` can increase the number of parallel committing transactions on any server that has (or might have after a failover) a replica, and therefore can increase parallel execution on the replicas. It is important to take into account both source and replica throughput when you are setting `binlog_group_commit_sync_delay`.

  Setting `binlog_group_commit_sync_delay` can also reduce the number of `fsync()` calls to the binary log on any server (source or replica) that has a binary log.

  Note that setting `binlog_group_commit_sync_delay` increases the latency of transactions on the server, which might affect client applications. Also, on highly concurrent workloads, it is possible for the delay to increase contention and therefore reduce throughput. Typically, the benefits of setting a delay outweigh the drawbacks, but tuning should always be carried out to determine the optimal setting.

* `binlog_group_commit_sync_no_delay_count`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>7

  The maximum number of transactions to wait for before aborting the current delay as specified by `binlog_group_commit_sync_delay`. If `binlog_group_commit_sync_delay` is set to 0, then this option has no effect.

* `binlog_max_flush_queue_time`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>8

  `binlog_max_flush_queue_time` is deprecated, and is marked for eventual removal in a future MySQL release. Formerly, this system variable controlled the time in microseconds to continue reading transactions from the flush queue before proceeding with group commit. It no longer has any effect.

* `binlog_order_commits`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>9

  When this variable is enabled on a replication source server (which is the default), transaction commit instructions issued to storage engines are serialized on a single thread, so that transactions are always committed in the same order as they are written to the binary log. Disabling this variable permits transaction commit instructions to be issued using multiple threads. Used in combination with binary log group commit, this prevents the commit rate of a single transaction being a bottleneck to throughput, and might therefore produce a performance improvement.

  Transactions are written to the binary log at the point when all the storage engines involved have confirmed that the transaction is prepared to commit. The binary log group commit logic then commits a group of transactions after their binary log write has taken place. When `binlog_order_commits` is disabled, because multiple threads are used for this process, transactions in a commit group might be committed in a different order from their order in the binary log. (Transactions from a single client always commit in chronological order.) In many cases this does not matter, as operations carried out in separate transactions should produce consistent results, and if that is not the case, a single transaction ought to be used instead.

  If you want to ensure that the transaction history on the source and on a multithreaded replica remains identical, set `replica_preserve_commit_order=1` on the replica.

* `binlog_rotate_encryption_master_key_at_startup`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>0

  Specifies whether or not the binary log master key is rotated at server startup. The binary log master key is the binary log encryption key that is used to encrypt file passwords for the binary log files and relay log files on the server. When a server is started for the first time with binary log encryption enabled (`binlog_encryption=ON`), a new binary log encryption key is generated and used as the binary log master key. If the `binlog_rotate_encryption_master_key_at_startup` system variable is also set to `ON`, whenever the server is restarted, a further binary log encryption key is generated and used as the binary log master key for all subsequent binary log files and relay log files. If the `binlog_rotate_encryption_master_key_at_startup` system variable is set to `OFF`, which is the default, the existing binary log master key is used again after the server restarts. For more information on binary log encryption keys and the binary log master key, see Section 19.3.2, “Encrypting Binary Log Files and Relay Log Files”.

* `binlog_row_event_max_size`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>1

  When row-based binary logging is used, this setting is a soft limit on the maximum size of a row-based binary log event, in bytes. Where possible, rows stored in the binary log are grouped into events with a size not exceeding the value of this setting. If an event cannot be split, the maximum size can be exceeded. The default is 8192 bytes.

  This global system variable is read-only and can be set only at server startup. Its value can therefore only be modified by using the `PERSIST_ONLY` keyword or the `@@persist_only` qualifier with the `SET` statement.

* `binlog_row_image`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>2

  For MySQL row-based replication, this variable determines how row images are written to the binary log.

  Setting the session value of this system variable is a restricted operation. The session user must have privileges sufficient to set restricted session variables. See Section 7.1.9.1, “System Variable Privileges”.

  In MySQL row-based replication, each row change event contains two images, a “before” image whose columns are matched against when searching for the row to be updated, and an “after” image containing the changes. Normally, MySQL logs full rows (that is, all columns) for both the before and after images. However, it is not strictly necessary to include every column in both images, and we can often save disk, memory, and network usage by logging only those columns which are actually required.

  Note

  When deleting a row, only the before image is logged, since there are no changed values to propagate following the deletion. When inserting a row, only the after image is logged, since there is no existing row to be matched. Only when updating a row are both the before and after images required, and both written to the binary log.

  For the before image, it is necessary only that the minimum set of columns required to uniquely identify rows is logged. If the table containing the row has a primary key, then only the primary key column or columns are written to the binary log. Otherwise, if the table has a unique key all of whose columns are `NOT NULL`, then only the columns in the unique key need be logged. (If the table has neither a primary key nor a unique key without any `NULL` columns, then all columns must be used in the before image, and logged.) In the after image, it is necessary to log only the columns which have actually changed.

  You can cause the server to log full or minimal rows using the `binlog_row_image` system variable. This variable actually takes one of three possible values, as shown in the following list:

  + `full`: Log all columns in both the before image and the after image.

  + `minimal`: Log only those columns in the before image that are required to identify the row to be changed; log only those columns in the after image where a value was specified by the SQL statement, or generated by auto-increment.

  + `noblob`: Log all columns (same as `full`), except for `BLOB` and `TEXT` columns that are not required to identify rows, or that have not changed.

  Note

  This variable is not supported by NDB Cluster; setting it has no effect on the logging of `NDB` tables.

  The default value is `full`.

  Note

  If `binlog_row_image` is set to `full` on the source and `minimal` on the replica, the replica's binary log event contains the full row after-image, even if only one column value changes.

  When using `minimal` or `noblob`, deletes and updates are guaranteed to work correctly for a given table if and only if the following conditions are true for both the source and destination tables:

  + All columns must be present and in the same order; each column must use the same data type as its counterpart in the other table.

  + The tables must have identical primary key definitions.

  (In other words, the tables must be identical with the possible exception of indexes that are not part of the tables' primary keys.)

  If these conditions are not met, it is possible that the primary key column values in the destination table may prove insufficient to provide a unique match for a delete or update. In this event, no warning or error is issued; the source and replica silently diverge, thus breaking consistency.

  Setting this variable has no effect when the binary logging format is `STATEMENT`. When `binlog_format` is `MIXED`, the setting for `binlog_row_image` is applied to changes that are logged using row-based format, but this setting has no effect on changes logged as statements.

  Setting `binlog_row_image` on either the global or session level does not cause an implicit commit; this means that this variable can be changed while a transaction is in progress without affecting the transaction.

* `binlog_row_metadata`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>3

  Configures the amount of table metadata added to the binary log when using row-based logging. When set to `MINIMAL`, the default, only metadata related to `SIGNED` flags, column character set and geometry types are logged. When set to `FULL` complete metadata for tables is logged, such as column name, `ENUM` or `SET` string values, `PRIMARY KEY` information, and so on.

  The extended metadata serves the following purposes:

  + Replicas use the metadata to transfer data when its table structure is different from the source's.

  + External software can use the metadata to decode row events and store the data into external databases, such as a data warehouse.

* `binlog_row_value_options`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>4

  When set to `PARTIAL_JSON`, this enables use of a space-efficient binary log format for updates that modify only a small portion of a JSON document, which causes row-based replication to write only the modified parts of the JSON document to the after-image for the update in the binary log, rather than writing the full document (see Partial Updates of JSON Values). This works for an `UPDATE` statement which modifies a JSON column using any sequence of `JSON_SET()`, `JSON_REPLACE()`, and `JSON_REMOVE()`. If the server is unable to generate a partial update, the full document is used instead.

  The default value is an empty string, which disables use of the format. To unset `binlog_row_value_options` and revert to writing the full JSON document, set its value to the empty string.

  Setting the session value of this system variable is a restricted operation. The session user must have privileges sufficient to set restricted session variables. See Section 7.1.9.1, “System Variable Privileges”.

  `binlog_row_value_options=PARTIAL_JSON` takes effect only when binary logging is enabled and `binlog_format` is set to `ROW` or `MIXED`. Statement-based replication *always* logs only the modified parts of the JSON document, regardless of any value set for `binlog_row_value_options`. To maximize the amount of space saved, use `binlog_row_image=NOBLOB` or `binlog_row_image=MINIMAL` together with this option. `binlog_row_image=FULL` saves less space than either of these, since the full JSON document is stored in the before-image, and the partial update is stored only in the after-image.

  **mysqlbinlog** output includes partial JSON updates in the form of events encoded as base-64 strings using `BINLOG` statements. If the `--verbose` option is specified, **mysqlbinlog** displays the partial JSON updates as readable JSON using pseudo-SQL statements.

  MySQL Replication generates an error if a modification cannot be applied to the JSON document on the replica. This includes a failure to find the path. Be aware that, even with this and other safety checks, if a JSON document on a replica has diverged from that on the source and a partial update is applied, it remains theoretically possible to produce a valid but unexpected JSON document on the replica.

* `binlog_rows_query_log_events`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>5

  This system variable affects row-based logging only. When enabled, it causes the server to write informational log events such as row query log events into its binary log. This information can be used for debugging and related purposes, such as obtaining the original query issued on the source when it cannot be reconstructed from the row updates.

  Setting the session value of this system variable is a restricted operation. The session user must have privileges sufficient to set restricted session variables. See Section 7.1.9.1, “System Variable Privileges”.

  These informational events are normally ignored by MySQL programs reading the binary log and so cause no issues when replicating or restoring from backup. To view them, increase the verbosity level by using mysqlbinlog's `--verbose` option twice, either as `-vv` or `--verbose --verbose`.

* `binlog_stmt_cache_size`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>6

  The size of the memory buffer for the binary log to hold nontransactional statements issued during a transaction.

  When binary logging is enabled on the server (with the `log_bin` system variable set to ON), separate binary log transaction and statement caches are allocated for each client if the server supports any transactional storage engines. If the data for the nontransactional statements used in the transaction exceeds the space in the memory buffer, the excess data is stored in a temporary file. When binary log encryption is active on the server, the memory buffer is not encrypted, but any temporary file used to hold the binary log cache is encrypted. After each transaction is committed, the binary log statement cache is reset by clearing the memory buffer and truncating the temporary file if used.

  If you often use large nontransactional statements during transactions, you can increase this cache size to get better performance by reducing or eliminating the need to write to temporary files. The `Binlog_stmt_cache_use` and `Binlog_stmt_cache_disk_use` status variables can be useful for tuning the size of this variable. See Section 7.4.4, “The Binary Log”.

  The `binlog_cache_size` system variable sets the size for the transaction cache.

* `binlog_transaction_compression`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>7

  Enables compression for transactions that are written to binary log files on this server. `OFF` is the default. Use the `binlog_transaction_compression_level_zstd` system variable to set the level for the `zstd` algorithm that is used for compression.

  Setting `binlog_transaction_compression` has no immediate effect but rather applies to all subsequent `START REPLICA` statements.

  When binary log transaction compression is enabled, transaction payloads are compressed and then written to the binary log file as a single event (`Transaction_payload_event`). Compressed transaction payloads remain in a compressed state while they are sent in the replication stream to replicas, other Group Replication group members, or clients such as **mysqlbinlog**, and are written to the relay log still in their compressed state. Binary log transaction compression therefore saves storage space both on the originator of the transaction and on the recipient (and for their backups), and saves network bandwidth when the transactions are sent between server instances.

  For `binlog_transaction_compression=ON` to have a direct effect, binary logging must be enabled on the server. When a MySQL 9.5 server instance has no binary log, it can receive, handle, and display compressed transaction payloads regardless of its value for `binlog_transaction_compression`. Compressed transaction payloads received by such server instances are written in their compressed state to the relay log, so they benefit indirectly from compression carried out by other servers in the replication topology.

  This system variable cannot be changed within the context of a transaction. Setting the session value of this system variable is a restricted operation. The session user must have privileges sufficient to set restricted session variables. See Section 7.1.9.1, “System Variable Privileges”.

  For more information on binary log transaction compression, including details of what events are and are not compressed, and changes in behavior when transaction compression is in use, see Section 7.4.4.5, “Binary Log Transaction Compression”.

  You can use the `ndb_log_transaction_compression` system variable to enable this feature for `NDB`. In addition, setting `--binlog-transaction-compression=ON` on the command line or in a `my.cnf` file causes `ndb_log_transaction_compression` to be enabled on server startup. See the description of the variable for further information.

* `binlog_transaction_compression_level_zstd`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>8

  Sets the compression level for binary log transaction compression on this server, which is enabled by the `binlog_transaction_compression` system variable. The value is an integer that determines the compression effort, from 1 (the lowest effort) to 22 (the highest effort). If you do not specify this system variable, the compression level is set to 3.

  Setting `binlog_transaction_compression_level_zstd` has no immediate effect but rather applies to all subsequent `START REPLICA` statements.

  As the compression level increases, the data compression ratio increases, which reduces the storage space and network bandwidth required for the transaction payload. However, the effort required for data compression also increases, taking time and CPU and memory resources on the originating server. Increases in the compression effort do not have a linear relationship to increases in the data compression ratio.

  This system variable cannot be changed within the context of a transaction. Setting the session value of this system variable is a restricted operation. The session user must have privileges sufficient to set restricted session variables. See Section 7.1.9.1, “System Variable Privileges”.

  This variable has no effect on logging of transactions on `NDB` tables; use `ndb_log_transaction_compression_level_zstd` instead.

* `binlog_transaction_dependency_history_size`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="replication-options-binary-log.html#sysvar_log_bin_index">log_bin_index</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>9

  Sets an upper limit on the number of row hashes which are kept in memory and used for looking up the transaction that last modified a given row. Once this number of hashes has been reached, the history is purged.

* `log_bin`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

  Shows the status of binary logging on the server, either enabled (`ON`) or disabled (`OFF`). With binary logging enabled, the server logs all statements that change data to the binary log, which is used for backup and replication. `ON` means that the binary log is available, `OFF` means that it is not in use. The `--log-bin` option can be used to specify a base name and location for the binary log.

  In earlier MySQL versions, binary logging was disabled by default, and was enabled if you specified the `--log-bin` option. Binary logging is enabled by default, with the `log_bin` system variable set to `ON`, whether or not you specify the `--log-bin` option. The exception is if you use **mysqld** to initialize the data directory manually by invoking it with the `--initialize` or `--initialize-insecure` option, when binary logging is disabled by default. It is possible to enable binary logging in this case by specifying the `--log-bin` option.

  If the `--skip-log-bin` or `--disable-log-bin` option is specified at startup, binary logging is disabled, with the `log_bin` system variable set to `OFF`. If either of these options is specified and `--log-bin` is also specified, the option specified later takes precedence.

  For information on the format and management of the binary log, see Section 7.4.4, “The Binary Log”.

* `log_bin_basename`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

  Holds the base name and path for the binary log files, which can be set with the `--log-bin` server option. The maximum variable length is 256. In MySQL 9.5, if the `--log-bin` option is not supplied, the default base name is `binlog`. For compatibility with MySQL 5.7, if the `--log-bin` option is supplied with no string or with an empty string, the default base name is `host_name-bin`, using the name of the host machine. The default location is the data directory.

* `log_bin_index`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

  Holds the base name and path for the binary log index file, which can be set with the `--log-bin-index` server option. The maximum variable length is 256.

* `log_bin_trust_function_creators`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

  This variable applies when binary logging is enabled. It controls whether stored function creators can be trusted not to create stored functions that may cause unsafe events to be written to the binary log. If set to 0 (the default), users are not permitted to create or alter stored functions unless they have the `SUPER` privilege in addition to the `CREATE ROUTINE` or `ALTER ROUTINE` privilege. A setting of 0 also enforces the restriction that a function must be declared with the `DETERMINISTIC` characteristic, or with the `READS SQL DATA` or `NO SQL` characteristic. If the variable is set to 1, MySQL does not enforce these restrictions on stored function creation. This variable also applies to trigger creation. See Section 27.9, “Stored Program Binary Logging”.

* `log_replica_updates`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

  `log_replica_updates` specifies whether updates received by a replica server from a replication source server should be logged to the replica's own binary log.

  Enabling this variable causes the replica to write the updates that are received from a source and performed by the replication SQL thread to the replica's own binary log. Binary logging, which is controlled by the `--log-bin` option and is enabled by default, must also be enabled on the replica for updates to be logged. See Section 19.1.6, “Replication and Binary Logging Options and Variables”. `log_replica_updates` is enabled by default, unless you specify `--skip-log-bin` to disable binary logging, in which case MySQL also disables replica update logging by default. If you need to disable replica update logging when binary logging is enabled, specify `--log-replica-updates=OFF` at replica server startup.

  Enabling `log_replica_updates` enables replication servers to be chained. For example, you might want to set up replication servers using this arrangement:

  ```
  A -> B -> C
  ```

  Here, `A` serves as the source for the replica `B`, and `B` serves as the source for the replica `C`. For this to work, `B` must be both a source *and* a replica. With binary logging enabled and `log_replica_updates` enabled, which are the default settings, updates received from `A` are logged by `B` to its binary log, and can therefore be passed on to `C`.

* `log_slave_updates`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

  Deprecated alias for `log_replica_updates`.

* `log_statements_unsafe_for_binlog`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

  If error 1592 is encountered, controls whether the generated warnings are added to the error log or not.

* `master_verify_checksum`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

  Deprecated alias for `source_verify_checksum`.

* `max_binlog_cache_size`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

  If a transaction requires more than this many bytes, the server generates a Multi-statement transaction required more than 'max\_binlog\_cache\_size' bytes of storage error. When `gtid_mode` is not `ON`, the maximum recommended value is 4GB, due to the fact that, in this case, MySQL cannot work with binary log positions greater than 4GB; when `gtid_mode` is `ON`, this limitation does not apply, and the server can work with binary log positions of arbitrary size.

  If, because `gtid_mode` is not `ON`, or for some other reason, you need to guarantee that the binary log does not exceed a given size *`maxsize`*, you should set this variable according to the formula shown here:

  ```
  max_binlog_cache_size <
    (((maxsize - max_binlog_size) / max_connections) - 1000) / 1.2
  ```

  This calculation takes into account the following conditions:

  + The server writes to the binary log as long as the size before it begins to write is less than `max_binlog_size`.

  + The server does not write single transactions, but rather groups of transactions. The maximum possible number of transactions in a group is equal to `max_connections`.

  + The server writes data that is not included in the cache. This includes a 4-byte checksum for each event; while this adds less than 20% to the transaction size, this amount is non-negible. In addition, the server writes a `Gtid_log_event` for each transaction; each of these events can add another 1 KB to what is written to the binary log.

  `max_binlog_cache_size` sets the size for the transaction cache only; the upper limit for the statement cache is governed by the `max_binlog_stmt_cache_size` system variable.

  The visibility to sessions of `max_binlog_cache_size` matches that of the `binlog_cache_size` system variable; in other words, changing its value affects only new sessions that are started after the value is changed.

* `max_binlog_size`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>9

  If a write to the binary log causes the current log file size to exceed the value of this variable, the server rotates the binary logs (closes the current file and opens the next one). The minimum value is 4096 bytes. The maximum and default value is 1GB. Encrypted binary log files have an additional 512-byte header, which is included in `max_binlog_size`.

  A transaction is written in one chunk to the binary log, so it is never split between several binary logs. Therefore, if you have big transactions, you might see binary log files larger than `max_binlog_size`.

  If `max_relay_log_size` is 0, the value of `max_binlog_size` applies to relay logs as well.

  With GTIDs in use on the server, when `max_binlog_size` is reached, if the system table `mysql.gtid_executed` cannot be accessed to write the GTIDs from the current binary log file, the binary log cannot be rotated. In this situation, the server responds according to its `binlog_error_action` setting. If `IGNORE_ERROR` is set, an error is logged on the server and binary logging is halted, or if `ABORT_SERVER` is set, the server shuts down.

* `max_binlog_stmt_cache_size`

  <table frame="box" rules="all" summary="Properties for binlog-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binlog-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

  If nontransactional statements within a transaction require more than this many bytes of memory, the server generates an error. The minimum value is 4096. The maximum and default values are 4GB on 32-bit platforms and 16EB (exabytes) on 64-bit platforms.

  `max_binlog_stmt_cache_size` sets the size for the statement cache only; the upper limit for the transaction cache is governed exclusively by the `max_binlog_cache_size` system variable.

* `original_commit_timestamp`

  <table frame="box" rules="all" summary="Properties for binlog-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binlog-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

  For internal use by replication. When re-executing a transaction on a replica, this is set to the time when the transaction was committed on the original source, measured in microseconds since the epoch. This allows the original commit timestamp to be propagated throughout a replication topology.

  Setting the session value of this system variable is a restricted operation. The session user must have either the `REPLICATION_APPLIER` privilege (see Section 19.3.3, “Replication Privilege Checks”), or privileges sufficient to set restricted session variables (see Section 7.1.9.1, “System Variable Privileges”). However, note that the variable is not intended for users to set; it is set automatically by the replication infrastructure.

* `source_verify_checksum`

  <table frame="box" rules="all" summary="Properties for binlog-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binlog-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

  Enabling `source_verify_checksum` causes the source to verify events read from the binary log by examining checksums, and to stop with an error in the event of a mismatch. `source_verify_checksum` is disabled by default; in this case, the source uses the event length from the binary log to verify events, so that only complete events are read from the binary log.

* `sql_log_bin`

  <table frame="box" rules="all" summary="Properties for binlog-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binlog-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

  This variable controls whether logging to the binary log is enabled for the current session (assuming that the binary log itself is enabled). The default value is `ON`. To disable or enable binary logging for the current session, set the session `sql_log_bin` variable to `OFF` or `ON`.

  Set this variable to `OFF` for a session to temporarily disable binary logging while making changes to the source you do not want replicated to the replica.

  Setting the session value of this system variable is a restricted operation. The session user must have privileges sufficient to set restricted session variables. See Section 7.1.9.1, “System Variable Privileges”.

  It is not possible to set the session value of `sql_log_bin` within a transaction or subquery.

  *Setting this variable to `OFF` prevents GTIDs from being assigned to transactions in the binary log*. If you are using GTIDs for replication, this means that even when binary logging is later enabled again, the GTIDs written into the log from this point do not account for any transactions that occurred in the meantime, so in effect those transactions are lost.

* `sync_binlog`

  <table frame="box" rules="all" summary="Properties for binlog-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--binlog-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

  Controls how often the MySQL server synchronizes the binary log to disk.

  + `sync_binlog=0`: Disables synchronization of the binary log to disk by the MySQL server. Instead, the MySQL server relies on the operating system to flush the binary log to disk from time to time as it does for any other file. This setting provides the best performance, but in the event of a power failure or operating system crash, it is possible that the server has committed transactions that have not been synchronized to the binary log.

  + `sync_binlog=1`: Enables synchronization of the binary log to disk before transactions are committed. This is the safest setting but can have a negative impact on performance due to the increased number of disk writes. In the event of a power failure or operating system crash, transactions that are missing from the binary log are only in a prepared state. This permits the automatic recovery routine to roll back the transactions, which guarantees that no transaction is lost from the binary log.

  + `sync_binlog=N`, where *`N`* is a value other than 0 or 1: The binary log is synchronized to disk after `N` binary log commit groups have been collected. In the event of a power failure or operating system crash, it is possible that the server has committed transactions that have not been flushed to the binary log. This setting can have a negative impact on performance due to the increased number of disk writes. A higher value improves performance, but with an increased risk of data loss.

  For the greatest possible durability and consistency in a replication setup that uses `InnoDB` with transactions, use these settings:

  + `sync_binlog=1`.
  + `innodb_flush_log_at_trx_commit=1`.

  Caution

  Many operating systems and some disk hardware fool the flush-to-disk operation. They may tell **mysqld** that the flush has taken place, even though it has not. In this case, the durability of transactions is not guaranteed even with the recommended settings, and in the worst case, a power outage can corrupt `InnoDB` data. Using a battery-backed disk cache in the SCSI disk controller or in the disk itself speeds up file flushes, and makes the operation safer. You can also try to disable the caching of disk writes in hardware caches.
