### 5.4.4 The Binary Log

[5.4.4.1 Binary Logging Formats](binary-log-formats.html)

[5.4.4.2 Setting The Binary Log Format](binary-log-setting.html)

[5.4.4.3 Mixed Binary Logging Format](binary-log-mixed.html)

[5.4.4.4 Logging Format for Changes to mysql Database Tables](binary-log-mysql-database.html)

The binary log contains “events” that describe database changes such as table creation operations or changes to table data. It also contains events for statements that potentially could have made changes (for example, a [`DELETE`](delete.html "13.2.2 DELETE Statement") which matched no rows), unless row-based logging is used. The binary log also contains information about how long each statement took that updated data. The binary log has two important purposes:

* For replication, the binary log on a replication source server provides a record of the data changes to be sent to replicas. The source sends the events contained in its binary log to its replicas, which execute those events to make the same data changes that were made on the source. See [Section 16.2, “Replication Implementation”](replication-implementation.html "16.2 Replication Implementation").

* Certain data recovery operations require use of the binary log. After a backup has been restored, the events in the binary log that were recorded after the backup was made are re-executed. These events bring databases up to date from the point of the backup. See [Section 7.5, “Point-in-Time (Incremental) Recovery”](point-in-time-recovery.html "7.5 Point-in-Time (Incremental) Recovery").

The binary log is not used for statements such as [`SELECT`](select.html "13.2.9 SELECT Statement") or [`SHOW`](show.html "13.7.5 SHOW Statements") that do not modify data. To log all statements (for example, to identify a problem query), use the general query log. See [Section 5.4.3, “The General Query Log”](query-log.html "5.4.3 The General Query Log").

Running a server with binary logging enabled makes performance slightly slower. However, the benefits of the binary log in enabling you to set up replication and for restore operations generally outweigh this minor performance decrement.

The binary log is generally resilient to unexpected halts because only complete transactions are logged or read back. See [Section 16.3.2, “Handling an Unexpected Halt of a Replica”](replication-solutions-unexpected-replica-halt.html "16.3.2 Handling an Unexpected Halt of a Replica") for more information.

Passwords in statements written to the binary log are rewritten by the server not to occur literally in plain text. See also [Section 6.1.2.3, “Passwords and Logging”](password-logging.html "6.1.2.3 Passwords and Logging").

The following discussion describes some of the server options and variables that affect the operation of binary logging. For a complete list, see [Section 16.1.6.4, “Binary Logging Options and Variables”](replication-options-binary-log.html "16.1.6.4 Binary Logging Options and Variables").

To enable the binary log, start the server with the [`--log-bin[=base_name]`](replication-options-binary-log.html#option_mysqld_log-bin) option. If no *`base_name`* value is given, the default name is the value of the [`--pid-file`](server-system-variables.html#sysvar_pid_file) option (which by default is the name of host machine) followed by `-bin`. If the base name is given, the server writes the file in the data directory unless the base name is given with a leading absolute path name to specify a different directory. It is recommended that you specify a base name explicitly rather than using the default of the host name; see [Section B.3.7, “Known Issues in MySQL”](known-issues.html "B.3.7 Known Issues in MySQL"), for the reason.

If you supply an extension in the log name (for example, [`--log-bin=base_name.extension`](replication-options-binary-log.html#option_mysqld_log-bin)), the extension is silently removed and ignored.

[**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") appends a numeric extension to the binary log base name to generate binary log file names. The number increases each time the server creates a new log file, thus creating an ordered series of files. The server creates a new file in the series each time any of the following events occurs:

* The server is started or restarted
* The server flushes the logs.
* The size of the current log file reaches [`max_binlog_size`](replication-options-binary-log.html#sysvar_max_binlog_size).

A binary log file may become larger than [`max_binlog_size`](replication-options-binary-log.html#sysvar_max_binlog_size) if you are using large transactions because a transaction is written to the file in one piece, never split between files.

To keep track of which binary log files have been used, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") also creates a binary log index file that contains the names of the binary log files. By default, this has the same base name as the binary log file, with the extension `'.index'`. You can change the name of the binary log index file with the [`--log-bin-index[=file_name]`](replication-options-binary-log.html#option_mysqld_log-bin-index) option. You should not manually edit this file while [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") is running; doing so would confuse [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

The term “binary log file” generally denotes an individual numbered file containing database events. The term “binary log” collectively denotes the set of numbered binary log files plus the index file.

A client that has privileges sufficient to set restricted session system variables (see [Section 5.1.8.1, “System Variable Privileges”](system-variable-privileges.html "5.1.8.1 System Variable Privileges")) can disable binary logging of its own statements by using a [`SET sql_log_bin=OFF`](set-sql-log-bin.html "13.4.1.3 SET sql_log_bin Statement") statement.

By default, the server logs the length of the event as well as the event itself and uses this to verify that the event was written correctly. You can also cause the server to write checksums for the events by setting the [`binlog_checksum`](replication-options-binary-log.html#sysvar_binlog_checksum) system variable. When reading back from the binary log, the source uses the event length by default, but can be made to use checksums if available by enabling the [`master_verify_checksum`](replication-options-binary-log.html#sysvar_master_verify_checksum) system variable. The replication I/O thread also verifies events received from the source. You can cause the replication SQL thread to use checksums if available when reading from the relay log by enabling the [`slave_sql_verify_checksum`](replication-options-replica.html#sysvar_slave_sql_verify_checksum) system variable.

The format of the events recorded in the binary log is dependent on the binary logging format. Three format types are supported, row-based logging, statement-based logging and mixed-base logging. The binary logging format used depends on the MySQL version. For general descriptions of the logging formats, see [Section 5.4.4.1, “Binary Logging Formats”](binary-log-formats.html "5.4.4.1 Binary Logging Formats"). For detailed information about the format of the binary log, see [MySQL Internals: The Binary Log](/doc/internals/en/binary-log.html).

The server evaluates the [`--binlog-do-db`](replication-options-binary-log.html#option_mysqld_binlog-do-db) and [`--binlog-ignore-db`](replication-options-binary-log.html#option_mysqld_binlog-ignore-db) options in the same way as it does the [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db) and [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db) options. For information about how this is done, see [Section 16.2.5.1, “Evaluation of Database-Level Replication and Binary Logging Options”](replication-rules-db-options.html "16.2.5.1 Evaluation of Database-Level Replication and Binary Logging Options").

A replica by default does not write to its own binary log any data modifications that are received from the source. To log these modifications, start the replica with the [`--log-slave-updates`](replication-options-binary-log.html#sysvar_log_slave_updates) option in addition to the [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) option (see [Section 16.1.6.3, “Replica Server Options and Variables”](replication-options-replica.html "16.1.6.3 Replica Server Options and Variables")). This is done when a replica is also to act as a source to other replicas in chained replication.

You can delete all binary log files with the [`RESET MASTER`](reset-master.html "13.4.1.2 RESET MASTER Statement") statement, or a subset of them with [`PURGE BINARY LOGS`](purge-binary-logs.html "13.4.1.1 PURGE BINARY LOGS Statement"). See [Section 13.7.6.6, “RESET Statement”](reset.html "13.7.6.6 RESET Statement"), and [Section 13.4.1.1, “PURGE BINARY LOGS Statement”](purge-binary-logs.html "13.4.1.1 PURGE BINARY LOGS Statement").

If you are using replication, you should not delete old binary log files on the source until you are sure that no replica still needs to use them. For example, if your replicas never run more than three days behind, once a day you can execute [**mysqladmin flush-logs binary**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") on the source and then remove any logs that are more than three days old. You can remove the files manually, but it is preferable to use [`PURGE BINARY LOGS`](purge-binary-logs.html "13.4.1.1 PURGE BINARY LOGS Statement"), which also safely updates the binary log index file for you (and which can take a date argument). See [Section 13.4.1.1, “PURGE BINARY LOGS Statement”](purge-binary-logs.html "13.4.1.1 PURGE BINARY LOGS Statement").

You can display the contents of binary log files with the [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") utility. This can be useful when you want to reprocess statements in the log for a recovery operation. For example, you can update a MySQL server from the binary log as follows:

```sql
$> mysqlbinlog log_file | mysql -h server_name
```

[**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") also can be used to display relay log file contents because they are written using the same format as binary log files. For more information on the [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") utility and how to use it, see [Section 4.6.7, “mysqlbinlog — Utility for Processing Binary Log Files”](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files"). For more information about the binary log and recovery operations, see [Section 7.5, “Point-in-Time (Incremental) Recovery”](point-in-time-recovery.html "7.5 Point-in-Time (Incremental) Recovery").

Binary logging is done immediately after a statement or transaction completes but before any locks are released or any commit is done. This ensures that the log is logged in commit order.

Updates to nontransactional tables are stored in the binary log immediately after execution.

Within an uncommitted transaction, all updates ([`UPDATE`](update.html "13.2.11 UPDATE Statement"), [`DELETE`](delete.html "13.2.2 DELETE Statement"), or [`INSERT`](insert.html "13.2.5 INSERT Statement")) that change transactional tables such as `InnoDB` tables are cached until a [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") statement is received by the server. At that point, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") writes the entire transaction to the binary log before the [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") is executed.

Modifications to nontransactional tables cannot be rolled back. If a transaction that is rolled back includes modifications to nontransactional tables, the entire transaction is logged with a [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") statement at the end to ensure that the modifications to those tables are replicated.

When a thread that handles the transaction starts, it allocates a buffer of [`binlog_cache_size`](replication-options-binary-log.html#sysvar_binlog_cache_size) to buffer statements. If a statement is bigger than this, the thread opens a temporary file to store the transaction. The temporary file is deleted when the thread ends.

The [`Binlog_cache_use`](server-status-variables.html#statvar_Binlog_cache_use) status variable shows the number of transactions that used this buffer (and possibly a temporary file) for storing statements. The [`Binlog_cache_disk_use`](server-status-variables.html#statvar_Binlog_cache_disk_use) status variable shows how many of those transactions actually had to use a temporary file. These two variables can be used for tuning [`binlog_cache_size`](replication-options-binary-log.html#sysvar_binlog_cache_size) to a large enough value that avoids the use of temporary files.

The [`max_binlog_cache_size`](replication-options-binary-log.html#sysvar_max_binlog_cache_size) system variable (default 4GB, which is also the maximum) can be used to restrict the total size used to cache a multiple-statement transaction. If a transaction is larger than this many bytes, it fails and rolls back. The minimum value is 4096.

If you are using the binary log and row based logging, concurrent inserts are converted to normal inserts for `CREATE ... SELECT` or [`INSERT ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement") statements. This is done to ensure that you can re-create an exact copy of your tables by applying the log during a backup operation. If you are using statement-based logging, the original statement is written to the log.

The binary log format has some known limitations that can affect recovery from backups. See [Section 16.4.1, “Replication Features and Issues”](replication-features.html "16.4.1 Replication Features and Issues").

Binary logging for stored programs is done as described in [Section 23.7, “Stored Program Binary Logging”](stored-programs-logging.html "23.7 Stored Program Binary Logging").

Note that the binary log format differs in MySQL 5.7 from previous versions of MySQL, due to enhancements in replication. See [Section 16.4.2, “Replication Compatibility Between MySQL Versions”](replication-compatibility.html "16.4.2 Replication Compatibility Between MySQL Versions").

If the server is unable to write to the binary log, flush binary log files, or synchronize the binary log to disk, the binary log on the source can become inconsistent and replicas can lose synchronization with the source. The [`binlog_error_action`](replication-options-binary-log.html#sysvar_binlog_error_action) system variable controls the action taken if an error of this type is encountered with the binary log.

* The default setting, `ABORT_SERVER`, makes the server halt binary logging and shut down. At this point, you can identify and correct the cause of the error. On restart, recovery proceeds as in the case of an unexpected server halt (see [Section 16.3.2, “Handling an Unexpected Halt of a Replica”](replication-solutions-unexpected-replica-halt.html "16.3.2 Handling an Unexpected Halt of a Replica")).

* The setting `IGNORE_ERROR` provides backward compatibility with older versions of MySQL. With this setting, the server continues the ongoing transaction and logs the error, then halts binary logging, but continues to perform updates. At this point, you can identify and correct the cause of the error. To resume binary logging, [`log_bin`](replication-options-binary-log.html#sysvar_log_bin) must be enabled again, which requires a server restart. Only use this option if you require backward compatibility, and the binary log is non-essential on this MySQL server instance. For example, you might use the binary log only for intermittent auditing or debugging of the server, and not use it for replication from the server or rely on it for point-in-time restore operations.

By default, the binary log is synchronized to disk at each write ([`sync_binlog=1`](replication-options-binary-log.html#sysvar_sync_binlog)). If [`sync_binlog`](replication-options-binary-log.html#sysvar_sync_binlog) was not enabled, and the operating system or machine (not only the MySQL server) crashed, there is a chance that the last statements of the binary log could be lost. To prevent this, enable the [`sync_binlog`](replication-options-binary-log.html#sysvar_sync_binlog) system variable to synchronize the binary log to disk after every *`N`* commit groups. See [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables"). The safest value for [`sync_binlog`](replication-options-binary-log.html#sysvar_sync_binlog) is 1 (the default), but this is also the slowest.

For example, if you are using `InnoDB` tables and the MySQL server processes a [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") statement, it writes many prepared transactions to the binary log in sequence, synchronizes the binary log, and then commits this transaction into `InnoDB`. If the server unexpectedly exits between those two operations, the transaction is rolled back by `InnoDB` at restart but still exists in the binary log. Such an issue is resolved assuming [`--innodb_support_xa`](innodb-parameters.html#sysvar_innodb_support_xa) is set to 1, the default. Although this option is related to the support of XA transactions in `InnoDB`, it also ensures that the binary log and InnoDB data files are synchronized. For this option to provide a greater degree of safety, the MySQL server should also be configured to synchronize the binary log and the `InnoDB` logs to disk before committing the transaction. The `InnoDB` logs are synchronized by default, and `sync_binlog=1` can be used to synchronize the binary log. The effect of this option is that at restart after a crash, after doing a rollback of transactions, the MySQL server scans the latest binary log file to collect transaction *`xid`* values and calculate the last valid position in the binary log file. The MySQL server then tells `InnoDB` to complete any prepared transactions that were successfully written to the to the binary log, and truncates the binary log to the last valid position. This ensures that the binary log reflects the exact data of `InnoDB` tables, and therefore the replica remains in synchrony with the source because it does not receive a statement which has been rolled back.

Note

[`innodb_support_xa`](innodb-parameters.html#sysvar_innodb_support_xa) is deprecated; expect it to be removed in a future release. `InnoDB` support for two-phase commit in XA transactions is always enabled as of MySQL 5.7.10.

If the MySQL server discovers at crash recovery that the binary log is shorter than it should have been, it lacks at least one successfully committed `InnoDB` transaction. This should not happen if `sync_binlog=1` and the disk/file system do an actual sync when they are requested to (some do not), so the server prints an error message `The binary log file_name is shorter than its expected size`. In this case, this binary log is not correct and replication should be restarted from a fresh snapshot of the source's data.

The session values of the following system variables are written to the binary log and honored by the replica when parsing the binary log:

* [`sql_mode`](server-system-variables.html#sysvar_sql_mode) (except that the [`NO_DIR_IN_CREATE`](sql-mode.html#sqlmode_no_dir_in_create) mode is not replicated; see [Section 16.4.1.37, “Replication and Variables”](replication-features-variables.html "16.4.1.37 Replication and Variables"))

* [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks)
* [`unique_checks`](server-system-variables.html#sysvar_unique_checks)
* [`character_set_client`](server-system-variables.html#sysvar_character_set_client)
* [`collation_connection`](server-system-variables.html#sysvar_collation_connection)
* [`collation_database`](server-system-variables.html#sysvar_collation_database)
* [`collation_server`](server-system-variables.html#sysvar_collation_server)
* [`sql_auto_is_null`](server-system-variables.html#sysvar_sql_auto_is_null)
