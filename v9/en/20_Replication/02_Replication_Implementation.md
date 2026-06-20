## 19.2 Replication Implementation

Replication is based on the source server keeping track of all changes to its databases (updates, deletes, and so on) in its binary log. The binary log serves as a written record of all events that modify database structure or content (data) from the moment the server was started. Typically, `SELECT` statements are not recorded because they modify neither database structure nor content.

Each replica that connects to the source requests a copy of the binary log. That is, it pulls the data from the source, rather than the source pushing the data to the replica. The replica also executes the events from the binary log that it receives. This has the effect of repeating the original changes just as they were made on the source. Tables are created or their structure modified, and data is inserted, deleted, and updated according to the changes that were originally made on the source.

Because each replica is independent, the replaying of the changes from the source's binary log occurs independently on each replica that is connected to the source. In addition, because each replica receives a copy of the binary log only by requesting it from the source, the replica is able to read and update the copy of the database at its own pace and can start and stop the replication process at will without affecting the ability to update to the latest database status on either the source or replica side.

For more information on the specifics of the replication implementation, see Section 19.2.3, “Replication Threads”.

Source servers and replicas report their status in respect of the replication process regularly so that you can monitor them. See Section 10.14, “Examining Server Thread (Process) Information” Information"), for descriptions of all replicated-related states.

The source's binary log is written to a local relay log on the replica before it is processed. The replica also records information about the current position with the source's binary log and the local relay log. See Section 19.2.4, “Relay Log and Replication Metadata Repositories”.

Database changes are filtered on the replica according to a set of rules that are applied according to the various configuration options and variables that control event evaluation. For details on how these rules are applied, see Section 19.2.5, “How Servers Evaluate Replication Filtering Rules”.


### 19.2.1 Replication Formats

Replication works because events written to the binary log are read from the source and then processed on the replica. The events are recorded within the binary log in different formats according to the type of event. The different replication formats used correspond to the binary logging format used when the events were recorded in the source's binary log. The correlation between binary logging formats and the terms used during replication are:

* When using statement-based binary logging, the source writes SQL statements to the binary log. Replication of the source to the replica works by executing the SQL statements on the replica. This is called statement-based replication (which can be abbreviated as SBR), which corresponds to the MySQL statement-based binary logging format.

* When using row-based logging, the source writes events to the binary log that indicate how individual table rows are changed. Replication of the source to the replica works by copying the events representing the changes to the table rows to the replica. This is called row-based replication (which can be abbreviated as RBR).

  Row-based logging is the default method.

* You can also configure MySQL to use a mix of both statement-based and row-based logging, depending on which is most appropriate for the change to be logged. This is called mixed-format logging. When using mixed-format logging, a statement-based log is used by default. Depending on certain statements, and also the storage engine being used, the log is automatically switched to row-based in particular cases. Replication using the mixed format is referred to as mixed-based replication or mixed-format replication. For more information, see Section 7.4.4.3, “Mixed Binary Logging Format”.

**NDB Cluster.** The default binary logging format in MySQL NDB Cluster 9.5 is `ROW`. NDB Cluster Replication uses row-based replication; that the `NDB` storage engine is incompatible with statement-based replication. See Section 25.7.2, “General Requirements for NDB Cluster Replication”, for more information.

When using `MIXED` format, the binary logging format is determined in part by the storage engine being used and the statement being executed. For more information on mixed-format logging and the rules governing the support of different logging formats, see Section 7.4.4.3, “Mixed Binary Logging Format”.

The logging format in a running MySQL server is controlled by setting the `binlog_format` server system variable. This variable can be set with session or global scope. The rules governing when and how the new setting takes effect are the same as for other MySQL server system variables. Setting the variable for the current session lasts only until the end of that session, and the change is not visible to other sessions. Setting the variable globally takes effect for clients that connect after the change, but not for any current client sessions, including the session where the variable setting was changed. To make the global system variable setting permanent so that it applies across server restarts, you must set it in an option file. For more information, see Section 15.7.6.1, “SET Syntax for Variable Assignment”.

There are conditions under which you cannot change the binary logging format at runtime or doing so causes replication to fail. See Section 7.4.4.2, “Setting The Binary Log Format”.

Changing the global `binlog_format` value requires privileges sufficient to set global system variables. Changing the session `binlog_format` value requires privileges sufficient to set restricted session system variables. See Section 7.1.9.1, “System Variable Privileges”.

Note

Changing the binary logging format (`binlog_format` system variable) was deprecated in MySQL 8.0; in a future version of MySQL, you can expect `binlog_format` to be removed altogether, and the row-based format to become the only logging format used by MySQL.

The statement-based and row-based replication formats have different issues and limitations. For a comparison of their relative advantages and disadvantages, see [Section 19.2.1.1, “Advantages and Disadvantages of Statement-Based and Row-Based Replication”](replication-sbr-rbr.html "19.2.1.1 Advantages and Disadvantages of Statement-Based and Row-Based Replication").

With statement-based replication, you may encounter issues with replicating stored routines or triggers. You can avoid these issues by using row-based replication instead. For more information, see Section 27.9, “Stored Program Binary Logging”.


#### 19.2.1.1 Advantages and Disadvantages of Statement-Based and Row-Based Replication

Each binary logging format has advantages and disadvantages. For most users, the mixed replication format should provide the best combination of data integrity and performance. If, however, you want to take advantage of the features specific to the statement-based or row-based replication format when performing certain tasks, you can use the information in this section, which provides a summary of their relative advantages and disadvantages, to determine which is best for your needs.

* [Advantages of statement-based replication](replication-sbr-rbr.html#replication-sbr-rbr-sbr-advantages "Advantages of statement-based replication")

* [Disadvantages of statement-based replication](replication-sbr-rbr.html#replication-sbr-rbr-sbr-disadvantages "Disadvantages of statement-based replication")

* [Advantages of row-based replication](replication-sbr-rbr.html#replication-sbr-rbr-rbr-advantages "Advantages of row-based replication")

* [Disadvantages of row-based replication](replication-sbr-rbr.html#replication-sbr-rbr-rbr-disadvantages "Disadvantages of row-based replication")

##### Advantages of statement-based replication

* Proven technology.
* Less data written to log files. When updates or deletes affect many rows, this results in *much* less storage space required for log files. This also means that taking and restoring from backups can be accomplished more quickly.

* Log files contain all statements that made any changes, so they can be used to audit the database.

##### Disadvantages of statement-based replication

* **Statements that are unsafe for SBR.** Not all statements which modify data (such as `INSERT` `DELETE`, `UPDATE`, and `REPLACE` statements) can be replicated using statement-based replication. Any nondeterministic behavior is difficult to replicate when using statement-based replication. Examples of such Data Modification Language (DML) statements include the following:

  + A statement that depends on a loadable function or stored program that is nondeterministic, since the value returned by such a function or stored program depends on factors other than the parameters supplied to it. (Row-based replication, however, simply replicates the value returned by the function or stored program, so its effect on table rows and data is the same on both the source and replica.) See Section 19.5.1.16, “Replication of Invoked Features”, for more information.

  + `DELETE` and `UPDATE` statements that use a `LIMIT` clause without an `ORDER BY` are nondeterministic. See Section 19.5.1.19, “Replication and LIMIT”.

  + Locking read statements ([`SELECT ... FOR UPDATE`](select.html "15.2.13 SELECT Statement") and [`SELECT ... FOR SHARE`](select.html "15.2.13 SELECT Statement")) that use `NOWAIT` or `SKIP LOCKED` options. See Locking Read Concurrency with NOWAIT and SKIP LOCKED.

  + Deterministic loadable functions must be applied on the replicas.

  + Statements using any of the following functions cannot be replicated properly using statement-based replication:

    - `LOAD_FILE()`
    - `UUID()`, `UUID_SHORT()`

    - `USER()`
    - `FOUND_ROWS()`
    - `SYSDATE()` (unless both the source and the replica are started with the `--sysdate-is-now` option)

    - `GET_LOCK()`
    - `IS_FREE_LOCK()`
    - `IS_USED_LOCK()`
    - `RAND()`
    - `RELEASE_LOCK()`
    - `SOURCE_POS_WAIT()`
    - `SLEEP()`
    - `VERSION()`

    However, all other functions are replicated correctly using statement-based replication, including `NOW()` and so forth.

    For more information, see Section 19.5.1.14, “Replication and System Functions”.

  Statements that cannot be replicated correctly using statement-based replication are logged with a warning like the one shown here:

  ```
  [Warning] Statement is not safe to log in statement format.
  ```

  A similar warning is also issued to the client in such cases. The client can display it using `SHOW WARNINGS`.

* [`INSERT ... SELECT`](insert.html "15.2.7 INSERT Statement") requires a greater number of row-level locks than with row-based replication.

* `UPDATE` statements that require a table scan (because no index is used in the `WHERE` clause) must lock a greater number of rows than with row-based replication.

* For `InnoDB`: An `INSERT` statement that uses `AUTO_INCREMENT` blocks other nonconflicting `INSERT` statements.

* For complex statements, the statement must be evaluated and executed on the replica before the rows are updated or inserted. With row-based replication, the replica only has to modify the affected rows, not execute the full statement.

* If there is an error in evaluation on the replica, particularly when executing complex statements, statement-based replication may slowly increase the margin of error across the affected rows over time. See Section 19.5.1.30, “Replica Errors During Replication”.

* Stored functions execute with the same `NOW()` value as the calling statement. However, this is not true of stored procedures.

* Table definitions must be (nearly) identical on source and replica. See Section 19.5.1.9, “Replication with Differing Table Definitions on Source and Replica”, for more information.

* DML operations that read data from MySQL grant tables (through a join list or subquery) but do not modify them are performed as non-locking reads on the MySQL grant tables and are therefore not safe for statement-based replication. For more information, see Grant Table Concurrency.

##### Advantages of row-based replication

* All changes can be replicated. This is the safest form of replication.

  Note

  Statements that update the information in the `mysql` system schema, such as `GRANT`, `REVOKE` and the manipulation of triggers, stored routines (including stored procedures), and views, are all replicated to replicas using statement-based replication.

  For statements such as [`CREATE TABLE ... SELECT`](create-table.html "15.1.24 CREATE TABLE Statement"), a `CREATE` statement is generated from the table definition and replicated using statement-based format, while the row insertions are replicated using row-based format.

* Fewer row locks are required on the source, which thus achieves higher concurrency, for the following types of statements:

  + [`INSERT ... SELECT`](insert-select.html "15.2.7.1 INSERT ... SELECT Statement")

  + `INSERT` statements with `AUTO_INCREMENT`

  + `UPDATE` or `DELETE` statements with `WHERE` clauses that do not use keys or do not change most of the examined rows.

* Fewer row locks are required on the replica for any `INSERT`, `UPDATE`, or `DELETE` statement.

##### Disadvantages of row-based replication

* RBR can generate more data that must be logged. To replicate a DML statement (such as an `UPDATE` or `DELETE` statement), statement-based replication writes only the statement to the binary log. By contrast, row-based replication writes each changed row to the binary log. If the statement changes many rows, row-based replication may write significantly more data to the binary log; this is true even for statements that are rolled back. This also means that making and restoring a backup can require more time. In addition, the binary log is locked for a longer time to write the data, which may cause concurrency problems. Use `binlog_row_image=minimal` to reduce the disadvantage considerably.

* Deterministic loadable functions that generate large `BLOB` values take longer to replicate with row-based replication than with statement-based replication. This is because the `BLOB` column value is logged, rather than the statement generating the data.

* You cannot see on the replica what statements were received from the source and executed. However, you can see what data was changed using **mysqlbinlog** with the options `--base64-output=DECODE-ROWS` and `--verbose`.

  Alternatively, use the `binlog_rows_query_log_events` variable, which if enabled adds a `Rows_query` event with the statement to **mysqlbinlog** output when the `-vv` option is used.

* For tables using the `MyISAM` storage engine, a stronger lock is required on the replica for `INSERT` statements when applying them as row-based events to the binary log than when applying them as statements. This means that concurrent inserts on `MyISAM` tables are not supported when using row-based replication.


#### 19.2.1.2 Usage of Row-Based Logging and Replication

MySQL uses statement-based logging (SBL), row-based logging (RBL) or mixed-format logging. The type of binary log used impacts the size and efficiency of logging. Therefore the choice between row-based replication (RBR) or statement-based replication (SBR) depends on your application and environment. This section describes known issues when using a row-based format log, and describes some best practices using it in replication.

For additional information, see Section 19.2.1, “Replication Formats”, and [Section 19.2.1.1, “Advantages and Disadvantages of Statement-Based and Row-Based Replication”](replication-sbr-rbr.html "19.2.1.1 Advantages and Disadvantages of Statement-Based and Row-Based Replication").

For information about issues specific to NDB Cluster Replication (which depends on row-based replication), see Section 25.7.3, “Known Issues in NDB Cluster Replication”.

* **Row-based logging of temporary tables.** As noted in Section 19.5.1.32, “Replication and Temporary Tables”, temporary tables are not replicated when using row-based or mixed format. For more information, see [Section 19.2.1.1, “Advantages and Disadvantages of Statement-Based and Row-Based Replication”](replication-sbr-rbr.html "19.2.1.1 Advantages and Disadvantages of Statement-Based and Row-Based Replication").

  Temporary tables are not replicated when using row-based or mixed format because there is no need. In addition, because temporary tables can be read only from the thread which created them, there is seldom if ever any benefit obtained from replicating them, even when using statement-based format.

  You can switch from statement-based to row-based binary logging format at runtime even when temporary tables have been created, but you cannot switch from row-based or mixed format for binary logging to statement-based format at runtime, due to any `CREATE TEMPORARY TABLE` statements having been omitted from the binary log in the previous mode.

  The MySQL server tracks the logging mode that was in effect when each temporary table was created. When a given client session ends, the server logs a `DROP TEMPORARY TABLE IF EXISTS` statement for each temporary table that still exists and was created when statement-based binary logging was in use. If row-based or mixed format binary logging was in use when the table was created, the `DROP TEMPORARY TABLE IF EXISTS` statement is not logged.

  Nontransactional DML statements involving temporary tables are allowed when using `binlog_format=ROW`, as long as any nontransactional tables affected by the statements are temporary tables.

* **RBL and synchronization of nontransactional tables.** When many rows are affected, the set of changes is split into several events; when the statement commits, all of these events are written to the binary log. When executing on the replica, a table lock is taken on all tables involved, and then the rows are applied in batch mode. Depending on the engine used for the replica's copy of the table, this may or may not be effective.

* **Latency and binary log size.** RBL writes changes for each row to the binary log and so its size can increase quite rapidly. This can significantly increase the time required to make changes on the replica that match those on the source. You should be aware of the potential for this delay in your applications.

* **Reading the binary log.** **mysqlbinlog** displays row-based events in the binary log using the `BINLOG` statement. This statement displays an event as a base 64-encoded string, the meaning of which is not evident. When invoked with the `--base64-output=DECODE-ROWS` and `--verbose` options, **mysqlbinlog** formats the contents of the binary log to be human readable. When binary log events were written in row-based format and you want to read or recover from a replication or database failure you can use this command to read contents of the binary log. For more information, see Section 6.6.9.2, “mysqlbinlog Row Event Display”.

* **Binary log execution errors and replica execution mode.** Using `replica_exec_mode=IDEMPOTENT` is generally only useful with MySQL NDB Cluster replication, for which `IDEMPOTENT` is the default value. (See Section 25.7.10, “NDB Cluster Replication: Bidirectional and Circular Replication”). When `replica_exec_mode` is `IDEMPOTENT`, a failure to apply changes from RBL because the original row cannot be found does not trigger an error or cause replication to fail. This means that it is possible that updates are not applied on the replica, so that the source and replica are no longer synchronized. Latency issues and use of nontransactional tables with RBR when `replica_exec_mode` is `IDEMPOTENT` can cause the source and replica to diverge even further. For more information about `replica_exec_mode`, see Section 7.1.8, “Server System Variables”.

  For other scenarios, setting `replica_exec_mode` to `STRICT` is normally sufficient; this is the default value for storage engines other than `NDB`.

* **Filtering based on server ID not supported.** You can filter based on server ID using the `IGNORE_SERVER_IDS` option for [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement"). This option works with both the statement-based and row-based logging formats, but cannot be used when `gtid_mode=ON`. Another method to filter out changes on some replicas is to use a `WHERE` clause that includes the relation `@@server_id <> id_value` clause with `UPDATE` and `DELETE` statements. For example, `WHERE @@server_id <> 1`. However, this does not work correctly with row-based logging. To use the `server_id` system variable for statement filtering, use statement-based logging.

* **RBL, nontransactional tables, and stopped replicas.** When using row-based logging, if the replica server is stopped while a replica thread is updating a nontransactional table, the replica database can reach an inconsistent state. For this reason, it is recommended that you use a transactional storage engine such as `InnoDB` for all tables replicated using the row-based format. Use of `STOP REPLICA` or [`STOP REPLICA SQL_THREAD`](stop-replica.html "15.4.2.5 STOP REPLICA Statement") prior to shutting down the replica MySQL server helps prevent issues from occurring, and is always recommended regardless of the logging format or storage engine you use.


#### 19.2.1.3 Determination of Safe and Unsafe Statements in Binary Logging

The “safeness” of a statement in MySQL replication refers to whether the statement and its effects can be replicated correctly using statement-based format. If this is true of the statement, we refer to the statement as safe; otherwise, we refer to it as unsafe.

In general, a statement is safe if it deterministic, and unsafe if it is not. However, certain nondeterministic functions are *not* considered unsafe (see Nondeterministic functions not considered unsafe, later in this section). In addition, statements using results from floating-point math functions—which are hardware-dependent—are always considered unsafe (see Section 19.5.1.12, “Replication and Floating-Point Values”).

**Handling of safe and unsafe statements.** A statement is treated differently depending on whether the statement is considered safe, and with respect to the binary logging format (that is, the current value of `binlog_format`).

* When using row-based logging, no distinction is made in the treatment of safe and unsafe statements.

* When using mixed-format logging, statements flagged as unsafe are logged using the row-based format; statements regarded as safe are logged using the statement-based format.

* When using statement-based logging, statements flagged as being unsafe generate a warning to this effect. Safe statements are logged normally.

Each statement flagged as unsafe generates a warning. If a large number of such statements were executed on the source, this could lead to excessively large error log files. To prevent this, MySQL has a warning suppression mechanism. Whenever the 50 most recent `ER_BINLOG_UNSAFE_STATEMENT` warnings have been generated more than 50 times in any 50-second period, warning suppression is enabled. When activated, this causes such warnings not to be written to the error log; instead, for each 50 warnings of this type, a note `The last warning was repeated N times in last S seconds` is written to the error log. This continues as long as the 50 most recent such warnings were issued in 50 seconds or less; once the rate has decreased below this threshold, the warnings are once again logged normally. Warning suppression has no effect on how the safety of statements for statement-based logging is determined, nor on how warnings are sent to the client. MySQL clients still receive one warning for each such statement.

For more information, see Section 19.2.1, “Replication Formats”.

**Statements considered unsafe.** Statements with the following characteristics are considered unsafe:

* **Statements containing system functions that may return a different value on the replica.** These functions include `FOUND_ROWS()`, `GET_LOCK()`, `IS_FREE_LOCK()`, `IS_USED_LOCK()`, `LOAD_FILE()`, `RAND()`, `RELEASE_LOCK()`, `ROW_COUNT()`, `SESSION_USER()`, `SLEEP()`, `SOURCE_POS_WAIT()`, `SYSDATE()`, `SYSTEM_USER()`, `USER()`, `UUID()`, and `UUID_SHORT()`.

  **Nondeterministic functions not considered unsafe.** Although these functions are not deterministic, they are treated as safe for purposes of logging and replication: `CONNECTION_ID()`, `CURDATE()`, `CURRENT_DATE()`, `CURRENT_TIME()`, `CURRENT_TIMESTAMP()`, `CURTIME()`, `LAST_INSERT_ID()`, `LOCALTIME()`, `LOCALTIMESTAMP()`, `NOW()`, `UNIX_TIMESTAMP()`, `UTC_DATE()`, `UTC_TIME()`, and `UTC_TIMESTAMP()`.

  For more information, see Section 19.5.1.14, “Replication and System Functions”.

* **References to system variables.** Most system variables are not replicated correctly using the statement-based format. See Section 19.5.1.40, “Replication and Variables”. For exceptions, see Section 7.4.4.3, “Mixed Binary Logging Format”.

* **Loadable Functions.** Since we have no control over what a loadable function does, we must assume that it is executing unsafe statements.

* **Fulltext plugin.** This plugin may behave differently on different MySQL servers; therefore, statements depending on it could have different results. For this reason, all statements relying on the fulltext plugin are treated as unsafe in MySQL.

* **Trigger or stored program updates a table having an AUTO\_INCREMENT column.** This is unsafe because the order in which the rows are updated may differ on the source and the replica.

  In addition, an `INSERT` into a table that has a composite primary key containing an `AUTO_INCREMENT` column that is not the first column of this composite key is unsafe.

  For more information, see Section 19.5.1.1, “Replication and AUTO\_INCREMENT”.

* **INSERT ... ON DUPLICATE KEY UPDATE statements on tables with multiple primary or unique keys.** When executed against a table that contains more than one primary or unique key, this statement is considered unsafe, being sensitive to the order in which the storage engine checks the keys, which is not deterministic, and on which the choice of rows updated by the MySQL Server depends.

  An [`INSERT ... ON DUPLICATE KEY UPDATE`](insert-on-duplicate.html "15.2.7.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") statement against a table having more than one unique or primary key is marked as unsafe for statement-based replication. (Bug #11765650, Bug #58637)

* **Updates using LIMIT.** The order in which rows are retrieved is not specified, and is therefore considered unsafe. See Section 19.5.1.19, “Replication and LIMIT”.

* **Accesses or references log tables.** The contents of the system log table may differ between source and replica.

* **Nontransactional operations after transactional operations.** Within a transaction, allowing any nontransactional reads or writes to execute after any transactional reads or writes is considered unsafe.

  For more information, see Section 19.5.1.36, “Replication and Transactions”.

* **Accesses or references self-logging tables.** All reads and writes to self-logging tables are considered unsafe. Within a transaction, any statement following a read or write to self-logging tables is also considered unsafe.

* **LOAD DATA statements.** `LOAD DATA` is treated as unsafe and when `binlog_format=MIXED` the statement is logged in row-based format. When `binlog_format=STATEMENT` `LOAD DATA` does not generate a warning, unlike other unsafe statements.

* **XA transactions.** If two XA transactions committed in parallel on the source are being prepared on the replica in the inverse order, locking dependencies can occur with statement-based replication that cannot be safely resolved, and it is possible for replication to fail with deadlock on the replica. When `binlog_format=STATEMENT` is set, DML statements inside XA transactions are flagged as being unsafe and generate a warning. When `binlog_format=MIXED` or `binlog_format=ROW` is set, DML statements inside XA transactions are logged using row-based replication, and the potential issue is not present.

* **`DEFAULT` clause that refers to a nondeterministic function.** If an expression default value refers to a nondeterministic function, any statement that causes the expression to be evaluated is unsafe for statement-based replication. This includes statements such as `INSERT`, `UPDATE`, and `ALTER TABLE`. Unlike most other unsafe statements, this category of statement cannot be replicated safely in row-based format. When `binlog_format` is set to `STATEMENT`, the statement is logged and executed but a warning message is written to the error log. When `binlog_format` is set to `MIXED` or `ROW`, the statement is not executed and an error message is written to the error log. For more information on the handling of explicit defaults, see Explicit Default Handling.

For additional information, see Section 19.5.1, “Replication Features and Issues”.


### 19.2.2 Replication Channels

In MySQL multi-source replication, a replica opens multiple replication channels, one for each source server. The replication channels represent the path of transactions flowing from a source to the replica. Each replication channel has its own receiver (I/O) thread, one or more applier (SQL) threads, and relay log. When transactions from a source are received by a channel's receiver thread, they are added to the channel's relay log file and passed through to the channel's applier threads. This enables each channel to function independently.

This section describes how channels can be used in a replication topology, and the impact they have on single-source replication. For instructions to configure sources and replicas for multi-source replication, to start, stop and reset multi-source replicas, and to monitor multi-source replication, see Section 19.1.5, “MySQL Multi-Source Replication”.

The maximum number of channels that can be created on one replica server in a multi-source replication topology is 256. Each replication channel must have a unique (nonempty) name, as explained in Section 19.2.2.4, “Replication Channel Naming Conventions”. The error codes and messages that are issued when multi-source replication is enabled specify the channel that generated the error.

Note

Each channel on a multi-source replica must replicate from a different source. You cannot set up multiple replication channels from a single replica to a single source. This is because the server IDs of replicas must be unique in a replication topology. The source distinguishes replicas only by their server IDs, not by the names of the replication channels, so it cannot recognize different replication channels from the same replica.

When a multi-source replica is also set up as a multi-threaded replica, each channel on the replica has the specified number of applier threads, plus a coordinator thread to manage them. You cannot configure the number of applier threads for individual channels.

Multi-source replicas can be configured with replication filters on specific replication channels. Channel specific replication filters can be used when the same database or table is present on multiple sources, and you only need the replica to replicate it from one source. For GTID-based replication, if the same transaction might arrive from multiple sources (such as in a diamond topology), you must ensure the filtering setup is the same on all channels. For more information, see Section 19.2.5.4, “Replication Channel Based Filters”.

To provide compatibility with previous versions, the MySQL server automatically creates on startup a default channel whose name is the empty string (`""`). This channel is always present; it cannot be created or destroyed by the user. If no other channels (having nonempty names) have been created, replication statements act on the default channel only, so that all replication statements from older replicas function as expected (see Section 19.2.2.2, “Compatibility with Previous Replication Statements”. Statements applying to replication channels as described in this section can be used only when there is at least one named channel.


#### 19.2.2.1 Commands for Operations on a Single Channel

To enable MySQL replication operations to act on individual replication channels, use the `FOR CHANNEL channel` clause with the following replication statements:

* `CHANGE REPLICATION SOURCE TO`
* `START REPLICA`
* `STOP REPLICA`
* `SHOW RELAYLOG EVENTS`
* [`FLUSH RELAY LOGS`](flush.html "15.7.8.3 FLUSH Statement")

* `SHOW REPLICA STATUS`
* `RESET REPLICA`

The `SOURCE_POS_WAIT()` function has a `channel` parameter.

`START REPLICA` and `STOP REPLICA`are disallowed for the `group_replication_recovery` and `group_replication_applier` channels. `SHOW REPLICA STATUS` is also not allowed with the `group_replication_applier` channel.

`FLUSH RELAY LOGS` is allowed for the `group_replication_applier` channel, but if the request is received while a transaction is being applied, the request is not performed until after the transaction ends. The requester must wait while the transaction is completed and the rotation takes place. This prevents transactions from being split, which is not allowed for Group Replication.


#### 19.2.2.2 Compatibility with Previous Replication Statements

When a replica has multiple channels and a `FOR CHANNEL channel` option is not specified, a valid statement generally acts on all available channels, with some specific exceptions.

For example, the following statements behave as expected for all except certain Group Replication channels:

* `START REPLICA` starts replication threads for all channels, except the `group_replication_recovery` and `group_replication_applier` channels.

* `STOP REPLICA` stops replication threads for all channels, except the `group_replication_recovery` and `group_replication_applier` channels.

* `SHOW REPLICA STATUS` reports the status for all channels, except the `group_replication_applier` channel.

* `RESET REPLICA` resets all channels.

Warning

Use `RESET REPLICA` with caution as this statement deletes all existing channels, purges their relay log files, and recreates only the default channel.

Some replication statements cannot operate on all channels. In this case, error 1964 Multiple channels exist on the replica. Please provide channel name as an argument. is generated. The following statements and functions generate this error when used in a multi-source replication topology and a `FOR CHANNEL channel` option is not used to specify which channel to act on:

* `SHOW RELAYLOG EVENTS`
* `CHANGE REPLICATION SOURCE TO`
* `SOURCE_POS_WAIT()`

Note that a default channel always exists in a single source replication topology, where statements and functions behave as in previous versions of MySQL.


#### 19.2.2.3 Startup Options and Replication Channels

This section describes startup options which are impacted by the addition of replication channels.

The following startup options now affect *all* channels in a replication topology.

* `--log-replica-updates`

  All transactions received by the replica (even from multiple sources) are written in the binary log.

* `--relay-log-purge`

  When set, each channel purges its own relay log automatically.

* `--replica-transaction-retries`

  The specified number of transaction retries can take place on all applier threads of all channels.

* `--skip-replica-start`

  No replication threads start on any channels.

* `--replica-skip-errors`

  Execution continues and errors are skipped for all channels.

The values set for the following startup options apply on each channel; since these are **mysqld** startup options, they are applied on every channel.

* `--max-relay-log-size=size`

  Maximum size of the individual relay log file for each channel; after reaching this limit, the file is rotated.

* `--relay-log-space-limit=size`

  Upper limit for the total size of all relay logs combined, for each individual channel. For *`N`* channels, the combined size of these logs is limited to [`relay_log_space_limit * N`](replication-options-replica.html#sysvar_relay_log_space_limit).

* `--replica-parallel-workers=value`

  Number of replication applier threads per channel.

* `replica_checkpoint_group`

  Waiting time by an receiver thread for each source.

* `--relay-log-index=filename`

  Base name for each channel's relay log index file. See Section 19.2.2.4, “Replication Channel Naming Conventions”.

* `--relay-log=filename`

  Denotes the base name of each channel's relay log file. See Section 19.2.2.4, “Replication Channel Naming Conventions”.

* `--replica-net-timeout=N`

  This value is set per channel, so that each channel waits for *`N`* seconds to check for a broken connection.

* `--replica-skip-counter=N`

  This value is set per channel, so that each channel skips *`N`* events from its source.


#### 19.2.2.4 Replication Channel Naming Conventions

This section describes how naming conventions are impacted by replication channels.

Each replication channel has a unique name which is a string with a maximum length of 64 characters and is case-insensitive. Because channel names are used in the replica's applier metadata repository table, the character set used for these is always UTF-8. Although you are generally free to use any name for channels, the following names are reserved:

* `group_replication_applier`
* `group_replication_recovery`

The name you choose for a replication channel also influences the file names used by a multi-source replica. The relay log files and index files for each channel are named `relay_log_basename-channel.xxxxxx`, where *`relay_log_basename`* is a base name specified using the `relay_log` system variable, and *`channel`* is the name of the channel logged to this file. If you do not specify the `relay_log` system variable, a default file name is used that also includes the name of the channel.


### 19.2.3 Replication Threads

MySQL replication capabilities are implemented using the following types of threads:

* **Binary log dump thread.** The source creates a thread to send the binary log contents to a replica when the replica connects. This thread can be identified in the output of [`SHOW PROCESSLIST`](show-processlist.html "15.7.7.32 SHOW PROCESSLIST Statement") on the source as the `Binlog Dump` thread.

* **Replication I/O receiver thread.** When a `START REPLICA` statement is issued on a replica server, the replica creates an I/O (receiver) thread, which connects to the source and asks it to send the updates recorded in its binary logs.

  The replication receiver thread reads the updates that the source's `Binlog Dump` thread sends (see previous item) and copies them to local files that comprise the replica's relay log.

  The state of this thread is shown as `Slave_IO_running` in the output of `SHOW REPLICA STATUS`.

* **Replication SQL applier thread.** There are *`N`* applier threads and one coordinator thread, which reads transactions sequentially from the relay log, and schedules them to be applied by worker threads. Each worker applies the transactions that the coordinator has assigned to it.

The replica creates the specified number of worker threads specified by `replica_parallel_workers` to apply transactions, plus a coordinator thread which reads transactions from the relay log and assigns them to workers. If you are using multiple replication channels, each channel has the number of threads specified using this variable.

Multithreaded replicas are also supported by NDB Cluster. See Section 25.7.11, “NDB Cluster Replication Using the Multithreaded Applier”, for more information.


#### 19.2.3.1 Monitoring Replication Main Threads

The `SHOW PROCESSLIST` statement provides information that tells you what is happening on the source and on the replica regarding replication. For information on source states, see Section 10.14.4, “Replication Source Thread States”. For replica states, see Section 10.14.5, “Replication I/O (Receiver) Thread States” Thread States"), and Section 10.14.6, “Replication SQL Thread States”.

The following example illustrates how the three main replication threads, the binary log dump thread, replication I/O (receiver) thread, and replication SQL (applier) thread, show up in the output from `SHOW PROCESSLIST`.

On the source server, the output from [`SHOW PROCESSLIST`](show-processlist.html "15.7.7.32 SHOW PROCESSLIST Statement") looks like this:

```
mysql> SHOW PROCESSLIST\G
*************************** 1. row ***************************
     Id: 2
   User: root
   Host: localhost:32931
     db: NULL
Command: Binlog Dump
   Time: 94
  State: Has sent all binlog to slave; waiting for binlog to
         be updated
   Info: NULL
```

Here, thread 2 is a `Binlog Dump` thread that services a connected replica. The `State` information indicates that all outstanding updates have been sent to the replica and that the source is waiting for more updates to occur. If you see no `Binlog Dump` threads on a source server, this means that replication is not running; that is, no replicas are currently connected.

On a replica server, the output from [`SHOW PROCESSLIST`](show-processlist.html "15.7.7.32 SHOW PROCESSLIST Statement") looks like this:

```
mysql> SHOW PROCESSLIST\G
*************************** 1. row ***************************
     Id: 10
   User: system user
   Host:
     db: NULL
Command: Connect
   Time: 11
  State: Waiting for master to send event
   Info: NULL
*************************** 2. row ***************************
     Id: 11
   User: system user
   Host:
     db: NULL
Command: Connect
   Time: 11
  State: Has read all relay log; waiting for the slave I/O
         thread to update it
   Info: NULL
```

The `State` information indicates that thread 10 is the replication I/O (receiver) thread that is communicating with the source server, and thread 11 is the replication SQL (applier) thread that is processing the updates stored in the relay logs. At the time that `SHOW PROCESSLIST` was run, both threads were idle, waiting for further updates.

The value in the `Time` column can show how late the replica is compared to the source. See Section A.14, “MySQL 9.5 FAQ: Replication”. If sufficient time elapses on the source side without activity on the `Binlog Dump` thread, the source determines that the replica is no longer connected. As for any other client connection, the timeouts for this depend on the values of `net_write_timeout` and `net_retry_count`; for more information about these, see Section 7.1.8, “Server System Variables”.

The `SHOW REPLICA STATUS` statement provides additional information about replication processing on a replica server. See Section 19.1.7.1, “Checking Replication Status”.

You can also retrieve information on the source's `Binlog Dump` threads with the following:

```
        SELECT * FROM performance_schema.threads WHERE PROCESSLIST_COMMAND LIKE "Binlog Dump%"
```

`Binlog Dump%` is used to retrieve either `Binlog Dump` or `Binlog Dump GTID`, depending on which mode binlog dumping is in.


#### 19.2.3.2 Monitoring Replication Applier Worker Threads

On a multithreaded replica, the Performance Schema tables `replication_applier_status_by_coordinator` and `replication_applier_status_by_worker` show status information for the replica's coordinator thread and applier worker threads respectively. For a replica with multiple channels, the threads for each channel are identified.

A multithreaded replica's coordinator thread also prints statistics to the replica's error log on a regular basis if the verbosity setting is set to display informational messages. The statistics are printed depending on the volume of events that the coordinator thread has assigned to applier worker threads, with a maximum frequency of once every 120 seconds. The message lists the following statistics for the relevant replication channel, or the default replication channel (which is not named):

Seconds elapsed :   The difference in seconds between the current time and the last time this information was printed to the error log.

Events assigned :   The total number of events that the coordinator thread has queued to all applier worker threads since the coordinator thread was started.

Worker queues filled over overrun level :   The current number of events that are queued to any of the applier worker threads in excess of the overrun level, which is set at 90% of the maximum queue length of 16384 events. If this value is zero, no applier worker threads are operating at the upper limit of their capacity.

Waited due to worker queue full :   The number of times that the coordinator thread had to wait to schedule an event because an applier worker thread's queue was full. If this value is zero, no applier worker threads exhausted their capacity.

Waited due to the total size :   The number of times that the coordinator thread had to wait to schedule an event because the `replica_pending_jobs_size_max` limit had been reached. This system variable sets the maximum amount of memory (in bytes) available to applier worker thread queues holding events not yet applied. If an unusually large event exceeds this size, the transaction is held until all the applier worker threads have empty queues, and then processed. All subsequent transactions are held until the large transaction has been completed.

Waited at clock conflicts :   The number of nanoseconds that the coordinator thread had to wait to schedule an event because a transaction that the event depended on had not yet been committed.

Waited (count) when workers occupied :   The number of times that the coordinator thread slept for a short period, which it might do if the coordinator thread assigns an event and finds the applier worker thread's queue is filled beyond the underrun level of 10% of the maximum queue length, in which case it sleeps for a maximum of 1 millisecond.


### 19.2.4 Relay Log and Replication Metadata Repositories

A replica server creates several repositories of information to use for the replication process:

* The replica's *relay log*, which is written by the replication I/O (receiver) thread, contains the transactions read from the replication source server's binary log. The transactions in the relay log are applied on the replica by the replication SQL (applier) thread. For information about the relay log, see Section 19.2.4.1, “The Relay Log”.

* The replica's *connection metadata repository* contains information that the replication receiver thread needs to connect to the replication source server and retrieve transactions from the source's binary log. The connection metadata repository is written to the `mysql.slave_master_info` table.

* The replica's *applier metadata repository* contains information that the replication applier thread needs to read and apply transactions from the replica's relay log. The applier metadata repository is written to the `mysql.slave_relay_log_info` table.

The replica's connection metadata repository and applier metadata repository are collectively known as the replication metadata repositories. For information about these, see Section 19.2.4.2, “Replication Metadata Repositories”.

**Making replication resilient to unexpected halts.** The `mysql.slave_master_info` and `mysql.slave_relay_log_info` tables are created using the transactional storage engine `InnoDB`. Updates to the replica's applier metadata repository table are committed together with the transactions, meaning that the replica's progress information recorded in that repository is always consistent with what has been applied to the database, even in the event of an unexpected server halt. For information on the combination of settings on the replica that is most resilient to unexpected halts, see Section 19.4.2, “Handling an Unexpected Halt of a Replica”.


#### 19.2.4.1 The Relay Log

The relay log, like the binary log, consists of a set of numbered files containing events that describe database changes, and an index file that contains the names of all used relay log files. The default location for relay log files is the data directory.

The term “relay log file” generally denotes an individual numbered file containing database events. The term “relay log” collectively denotes the set of numbered relay log files plus the index file.

Relay log files have the same format as binary log files and can be read using **mysqlbinlog** (see Section 6.6.9, “mysqlbinlog — Utility for Processing Binary Log Files”). If binary log transaction compression is in use, transaction payloads written to the relay log are compressed in the same way as for the binary log. For more information on binary log transaction compression, see Section 7.4.4.5, “Binary Log Transaction Compression”.

For the default replication channel, relay log file names have the default form `host_name-relay-bin.nnnnnn`, where *`host_name`* is the name of the replica server host and *`nnnnnn`* is a sequence number. Successive relay log files are created using successive sequence numbers, beginning with `000001`. For non-default replication channels, the default base name is `host_name-relay-bin-channel`, where *`channel`* is the name of the replication channel recorded in the relay log.

The replica uses an index file to track the relay log files currently in use. The default relay log index file name is `host_name-relay-bin.index` for the default channel, and `host_name-relay-bin-channel.index` for non-default replication channels.

The default relay log file and relay log index file names and locations can be overridden with, respectively, the `relay_log` and `relay_log_index` system variables (see Section 19.1.6, “Replication and Binary Logging Options and Variables”).

If a replica uses the default host-based relay log file names, changing a replica's host name after replication has been set up can cause replication to fail with the errors Failed to open the relay log and Could not find target log during relay log initialization. This is a known issue (see Bug #2122). If you anticipate that a replica's host name might change in the future (for example, if networking is set up on the replica such that its host name can be modified using DHCP), you can avoid this issue entirely by using the `relay_log` and `relay_log_index` system variables to specify relay log file names explicitly when you initially set up the replica. This causes the names to be independent of server host name changes.

If you encounter the issue after replication has already begun, one way to work around it is to stop the replica server, prepend the contents of the old relay log index file to the new one, and then restart the replica. On a Unix system, this can be done as shown here:

```
$> cat new_relay_log_name.index >> old_relay_log_name.index
$> mv old_relay_log_name.index new_relay_log_name.index
```

A replica server creates a new relay log file under the following conditions:

* Each time the replication I/O (receiver) thread starts.
* When the logs are flushed (for example, with `FLUSH LOGS` or **mysqladmin flush-logs**).

* When the size of the current relay log file becomes too large, which is determined as follows:

  + If the value of `max_relay_log_size` is greater than 0, that is the maximum relay log file size.

  + If the value of `max_relay_log_size` is 0, `max_binlog_size` determines the maximum relay log file size.

The replication SQL (applier) thread automatically deletes each relay log file after it has executed all events in the file and no longer needs it. There is no explicit mechanism for deleting relay logs because the replication SQL thread takes care of doing so. However, `FLUSH LOGS` rotates relay logs, which influences when the replication SQL thread deletes them.


#### 19.2.4.2 Replication Metadata Repositories

A replica server creates two replication metadata repositories, the connection metadata repository and the applier metadata repository. The replication metadata repositories survive a replica server's shutdown. If binary log file position based replication is in use, when the replica restarts, it reads the two repositories to determine how far it previously proceeded in reading the binary log from the source and in processing its own relay log. If GTID-based replication is in use, the replica does not use the replication metadata repositories for that purpose, but does need them for the other metadata that they contain.

* The replica's *connection metadata repository* contains information that the replication I/O (receiver) thread needs to connect to the replication source server and retrieve transactions from the source's binary log. The metadata in this repository includes the connection configuration, the replication user account details, the SSL settings for the connection, and the file name and position where the replication receiver thread is currently reading from the source's binary log.

* The replica's *applier metadata repository* contains information that the replication SQL (applier) thread needs to read and apply transactions from the replica's relay log. The metadata in this repository includes the file name and position up to which the replication applier thread has executed the transactions in the relay log, and the equivalent position in the source's binary log. It also includes metadata for the process of applying transactions, such as the number of worker threads and the `PRIVILEGE_CHECKS_USER` account for the channel.

The connection metadata repository is written to the `slave_master_info` table in the `mysql` system schema, and the applier metadata repository is written to the `slave_relay_log_info` table in the `mysql` system schema. A warning message is issued if **mysqld** is unable to initialize the tables for the replication metadata repositories, but the replica is allowed to continue starting. This situation is most likely to occur when upgrading from a version of MySQL that does not support the use of tables for the repositories to one in which they are supported.

Important

1. Do not attempt to update or insert rows in the `mysql.slave_master_info` or `mysql.slave_relay_log_info` tables manually. Doing so can cause undefined behavior, and is not supported. Execution of any statement requiring a write lock on either or both of the `slave_master_info` and `slave_relay_log_info` tables is disallowed while replication is ongoing (although statements that perform only reads are permitted at any time).

2. Access privileges for the connection metadata repository table `mysql.slave_master_info` should be restricted to the database administrator, because it contains the replication user account name and password for connecting to the source. Use a restricted access mode to protect database backups that include this table. You can clear the replication user account credentials from the connection metadata repository, and instead always provide them using a [`START REPLICA`](start-replica.html "15.4.2.4 START REPLICA Statement") statement to start the replication channel. This approach means that the replication channel always needs operator intervention to restart, but the account name and password are not recorded in the replication metadata repositories.

`RESET REPLICA` clears the data in the replication metadata repositories, with the exception of the replication connection parameters (depending on the MySQL Server release). For details, see the description for `RESET REPLICA`.

You can set the `GTID_ONLY` option of the `CHANGE REPLICATION SOURCE TO` statement to stop a replication channel from persisting file names and file positions in the replication metadata repositories. This avoids writes and reads to the tables in situations where GTID-based replication does not actually require them. With the `GTID_ONLY` setting, the connection metadata repository and the applier metadata repository are not updated when the replica queues and applies events in a transaction, or when the replication threads are stopped and started. File positions are tracked in memory, and can be viewed using [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement") if they are needed. The replication metadata repositories are only synchronized in the following situations:

* When a [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement is issued.

* When a `RESET REPLICA` statement is issued. `RESET REPLICA ALL` deletes rather than updates the repositories, so they are synchronized implicitly.

* When a replication channel is initialized.
* If the replication metadata repositories are moved from files to tables.

Creating the replication metadata repositories as tables is the default; the use of files is deprecated.

The `mysql.slave_master_info` and `mysql.slave_relay_log_info` tables are created using the `InnoDB` transactional storage engine. Updates to the applier metadata repository table are committed together with the transactions, meaning that the replica's progress information recorded in that repository is always consistent with what has been applied to the database, even in the event of an unexpected server halt. For information on the combination of settings on a replica that is most resilient to unexpected halts, see Section 19.4.2, “Handling an Unexpected Halt of a Replica”.

When you back up the replica's data or transfer a snapshot of its data to create a new replica, ensure that you include the `mysql.slave_master_info` and `mysql.slave_relay_log_info` tables containing the replication metadata repositories. For cloning operations, note that when the replication metadata repositories are created as tables, they are copied to the recipient during a cloning operation, but when they are created as files, they are not copied. When binary log file position based replication is in use, the replication metadata repositories are needed to resume replication after restarting the restored, copied, or cloned replica. If you do not have the relay log files, but still have the applier metadata repository, you can check it to determine how far the replication SQL thread has executed in the source's binary log. Then you can use a [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement with the `SOURCE_LOG_FILE` and `SOURCE_LOG_POS` options to tell the replica to re-read the binary logs from the source from that point (provided that the required binary logs still exist on the source).

One additional repository, the applier worker metadata repository, is created primarily for internal use, and holds status information about worker threads on a multithreaded replica. The applier worker metadata repository includes the names and positions for the relay log file and the source's binary log file for each worker thread. If the applier metadata repository is created as a table, which is the default, the applier worker metadata repository is written to the `mysql.slave_worker_info` table. If the applier metadata repository is written to a file, the applier worker metadata repository is written to the `worker-relay-log.info` file. For external use, status information for worker threads is presented in the Performance Schema `replication_applier_status_by_worker` table.

The replication metadata repositories originally contained information similar to that shown in the output of the `SHOW REPLICA STATUS` statement, which is discussed in Section 15.4.2, “SQL Statements for Controlling Replica Servers”. Further information has since been added to the replication metadata repositories which is not displayed by the `SHOW REPLICA STATUS` statement.

For the connection metadata repository, the following table shows the correspondence between the columns in the `mysql.slave_master_info` table, the columns displayed by `SHOW REPLICA STATUS`, and the lines in the deprecated `master.info` file.

<table summary="The correspondence between the columns in the mysql.slave_master_info table, the columns displayed by SHOW REPLICA STATUS, and the lines in the deprecated master.info file."><col style="width: 31%"/><col style="width: 40%"/><col style="width: 16%"/><col style="width: 18%"/><thead><tr> <th scope="col"><code class="literal">slave_master_info</code> Table Column</th> <th scope="col"><code class="literal">SHOW REPLICA STATUS</code> Column</th> <th scope="col"><code class="filename">master.info</code> File Line</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">Number_of_lines</code></th> <td>[None]</td> <td>1</td> <td>Number of columns in the table (or lines in the file)</td> </tr><tr> <th scope="row"><code class="literal">Master_log_name</code></th> <td><code class="literal">Source_Log_File</code></td> <td>2</td> <td>The name of the binary log currently being read from the source</td> </tr><tr> <th scope="row"><code class="literal">Master_log_pos</code></th> <td><code class="literal">Read_Source_Log_Pos</code></td> <td>3</td> <td>The current position within the binary log that has been read from the source</td> </tr><tr> <th scope="row"><code class="literal">Host</code></th> <td><code class="literal">Source_Host</code></td> <td>4</td> <td>The host name of the replication source server</td> </tr><tr> <th scope="row"><code class="literal">User_name</code></th> <td><code class="literal">Source_User</code></td> <td>5</td> <td>The replication user account name used to connect to the source</td> </tr><tr> <th scope="row"><code class="literal">User_password</code></th> <td>Password (not shown by <a class="link" href="show-replica-status.html" title="15.7.7.36 SHOW REPLICA STATUS Statement"><code class="literal">SHOW REPLICA STATUS</code></a>)</td> <td>6</td> <td>The replication user account password used to connect to the source</td> </tr><tr> <th scope="row"><code class="literal">Port</code></th> <td><code class="literal">Source_Port</code></td> <td>7</td> <td>The network port used to connect to the replication source server</td> </tr><tr> <th scope="row"><code class="literal">Connect_retry</code></th> <td><code class="literal">Connect_Retry</code></td> <td>8</td> <td>The period (in seconds) that the replica waits before trying to reconnect to the source</td> </tr><tr> <th scope="row"><code class="literal">Enabled_ssl</code></th> <td><code class="literal">Source_SSL_Allowed</code></td> <td>9</td> <td>Whether the replica supports SSL connections</td> </tr><tr> <th scope="row"><code class="literal">Ssl_ca</code></th> <td><code class="literal">Source_SSL_CA_File</code></td> <td>10</td> <td>The file used for the Certificate Authority (CA) certificate</td> </tr><tr> <th scope="row"><code class="literal">Ssl_capath</code></th> <td><code class="literal">Source_SSL_CA_Path</code></td> <td>11</td> <td>The path to the Certificate Authority (CA) certificate</td> </tr><tr> <th scope="row"><code class="literal">Ssl_cert</code></th> <td><code class="literal">Source_SSL_Cert</code></td> <td>12</td> <td>The name of the SSL certificate file</td> </tr><tr> <th scope="row"><code class="literal">Ssl_cipher</code></th> <td><code class="literal">Source_SSL_Cipher</code></td> <td>13</td> <td>The list of possible ciphers used in the handshake for the SSL connection</td> </tr><tr> <th scope="row"><code class="literal">Ssl_key</code></th> <td><code class="literal">Source_SSL_Key</code></td> <td>14</td> <td>The name of the SSL key file</td> </tr><tr> <th scope="row"><code class="literal">Ssl_verify_server_cert</code></th> <td><code class="literal">Source_SSL_Verify_Server_Cert</code></td> <td>15</td> <td>Whether to verify the server certificate</td> </tr><tr> <th scope="row"><code class="literal">Heartbeat</code></th> <td>[None]</td> <td>16</td> <td>Interval between replication heartbeats, in seconds</td> </tr><tr> <th scope="row"><code class="literal">Bind</code></th> <td><code class="literal">Source_Bind</code></td> <td>17</td> <td>Which of the replica's network interfaces should be used for connecting to the source</td> </tr><tr> <th scope="row"><code class="literal">Ignored_server_ids</code></th> <td><code class="literal">Replicate_Ignore_Server_Ids</code></td> <td>18</td> <td>The list of server IDs to be ignored. Note that for <code class="literal">Ignored_server_ids</code> the list of server IDs is preceded by the total number of server IDs to ignore.</td> </tr><tr> <th scope="row"><code class="literal">Uuid</code></th> <td><code class="literal">Source_UUID</code></td> <td>19</td> <td>The source's unique ID</td> </tr><tr> <th scope="row"><code class="literal">Retry_count</code></th> <td><code class="literal">Source_Retry_Count</code></td> <td>20</td> <td>Maximum number of reconnection attempts permitted</td> </tr><tr> <th scope="row"><code class="literal">Ssl_crl</code></th> <td>[None]</td> <td>21</td> <td>Path to an SSL certificate revocation-list file</td> </tr><tr> <th scope="row"><code class="literal">Ssl_crlpath</code></th> <td>[None]</td> <td>22</td> <td>Path to a directory containing SSL certificate revocation-list files</td> </tr><tr> <th scope="row"><code class="literal">Enabled_auto_position</code></th> <td><code class="literal">Auto_position</code></td> <td>23</td> <td>Whether GTID auto-positioning is in use or not</td> </tr><tr> <th scope="row"><code class="literal">Channel_name</code></th> <td><code class="literal">Channel_name</code></td> <td>24</td> <td>The name of the replication channel</td> </tr><tr> <th scope="row"><code class="literal">Tls_version</code></th> <td><code class="literal">Source_TLS_Version</code></td> <td>25</td> <td>TLS version on the source</td> </tr><tr> <th scope="row"><code class="literal">Public_key_path</code></th> <td><code class="literal">Source_public_key_path</code></td> <td>26</td> <td>Name of the RSA public key file</td> </tr><tr> <th scope="row"><code class="literal">Get_public_key</code></th> <td><code class="literal">Get_source_public_key</code></td> <td>27</td> <td>Whether to request RSA public key from source</td> </tr><tr> <th scope="row"><code class="literal">Network_namespace</code></th> <td><code class="literal">Network_namespace</code></td> <td>28</td> <td>Network namespace</td> </tr><tr> <th scope="row"><code class="literal">Master_compression_algorithm</code></th> <td>[None]</td> <td>29</td> <td>Permitted compression algorithms for the connection to the source</td> </tr><tr> <th scope="row"><code class="literal">Master_zstd_compression_level</code></th> <td>[None]</td> <td>30</td> <td><code class="literal">zstd</code> compression level</td> </tr><tr> <th scope="row"><code class="literal">Tls_ciphersuites</code></th> <td>[None]</td> <td>31</td> <td>Permitted ciphersuites for TLSv1.3</td> </tr><tr> <th scope="row"><code class="literal">Source_connection_auto_failover</code></th> <td>[None]</td> <td>32</td> <td>Whether the asynchronous connection failover mechanism is activated</td> </tr><tr> <th scope="row"><code class="literal">Gtid_only</code></th> <td>[None]</td> <td>33</td> <td>Whether the channel uses only GTIDs and does not persist positions</td> </tr></tbody></table>

For the applier metadata repository, the following table shows the correspondence between the columns in the `mysql.slave_relay_log_info` table, the columns displayed by `SHOW REPLICA STATUS`, and the lines in the deprecated `relay-log.info` file.

<table summary="The correspondence between the columns in the mysql.slave_relay_log_info table, the columns displayed by SHOW REPLICA STATUS, and the lines in the deprecated relay-log.info file."><col style="width: 30%"/><col style="width: 40%"/><col style="width: 15%"/><col style="width: 20%"/><thead><tr> <th scope="col"><code class="literal">slave_relay_log_info</code> Table Column</th> <th scope="col"><code class="literal">SHOW REPLICA STATUS</code> Column</th> <th scope="col">Line in <code class="filename">relay-log.info</code> File</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">Number_of_lines</code></th> <td>[None]</td> <td>1</td> <td>Number of columns in the table or lines in the file</td> </tr><tr> <th scope="row"><code class="literal">Relay_log_name</code></th> <td><code class="literal">Relay_Log_File</code></td> <td>2</td> <td>The name of the current relay log file</td> </tr><tr> <th scope="row"><code class="literal">Relay_log_pos</code></th> <td><code class="literal">Relay_Log_Pos</code></td> <td>3</td> <td>The current position within the relay log file; events up to this position have been executed on the replica database</td> </tr><tr> <th scope="row"><code class="literal">Master_log_name</code></th> <td><code class="literal">Relay_Source_Log_File</code></td> <td>4</td> <td>The name of the source's binary log file from which the events in the relay log file were read</td> </tr><tr> <th scope="row"><code class="literal">Master_log_pos</code></th> <td><code class="literal">Exec_Source_Log_Pos</code></td> <td>5</td> <td>The equivalent position within the source's binary log file of the events that have been executed on the replica</td> </tr><tr> <th scope="row"><code class="literal">Sql_delay</code></th> <td><code class="literal">SQL_Delay</code></td> <td>6</td> <td>The number of seconds that the replica must lag the source</td> </tr><tr> <th scope="row"><code class="literal">Number_of_workers</code></th> <td>[None]</td> <td>7</td> <td>The number of worker threads for applying replication transactions in parallel</td> </tr><tr> <th scope="row"><code class="literal">Id</code></th> <td>[None]</td> <td>8</td> <td>ID used for internal purposes; currently this is always 1</td> </tr><tr> <th scope="row"><code class="literal">Channel_name</code></th> <td><code class="literal">Channel_name</code></td> <td>9</td> <td>The name of the replication channel</td> </tr><tr> <th scope="row"><code class="literal">Privilege_checks_username</code></th> <td>[None]</td> <td>10</td> <td>The user name for the <code class="literal">PRIVILEGE_CHECKS_USER</code> account for the channel</td> </tr><tr> <th scope="row"><code class="literal">Privilege_checks_hostname</code></th> <td>[None]</td> <td>11</td> <td>The host name for the <code class="literal">PRIVILEGE_CHECKS_USER</code> account for the channel</td> </tr><tr> <th scope="row"><code class="literal">Require_row_format</code></th> <td>[None]</td> <td>12</td> <td>Whether the channel accepts only row-based events</td> </tr><tr> <th scope="row"><code class="literal">Require_table_primary_key_check</code></th> <td>[None]</td> <td>13</td> <td>The channel's policy on whether tables must have primary keys for <code class="literal">CREATE TABLE</code> and <code class="literal">ALTER TABLE</code> operations</td> </tr><tr> <th scope="row"><code class="literal">Assign_gtids_to_anonymous_transactions_type </code></th> <td>[None]</td> <td>14</td> <td>If the channel assigns a GTID to replicated transactions that do not already have one, using the replica's local UUID, this value is <code class="literal">LOCAL</code>; if the channel does so using instead a UUID which has been set manually, the value is <code class="literal">UUID</code>. If the channel does not assign a GTID in such cases, the value is <code class="literal">OFF</code>.</td> </tr><tr> <th scope="row"><code class="literal">Assign_gtids_to_anonymous_transactions_value </code></th> <td>[None]</td> <td>15</td> <td>The UUID used in the GTIDs assigned to anonymous transactions</td> </tr></tbody></table>


### 19.2.5 How Servers Evaluate Replication Filtering Rules

If a replication source server does not write a statement to its binary log, the statement is not replicated. If the server does log the statement, the statement is sent to all replicas and each replica determines whether to execute it or ignore it.

On the source, you can control which databases to log changes for by using the `--binlog-do-db` and `--binlog-ignore-db` options to control binary logging. For a description of the rules that servers use in evaluating these options, see Section 19.2.5.1, “Evaluation of Database-Level Replication and Binary Logging Options”. You should not use these options to control which databases and tables are replicated. Instead, use filtering on the replica to control the events that are executed on the replica.

On the replica side, decisions about whether to execute or ignore statements received from the source are made according to the `--replicate-*` options that the replica was started with. (See Section 19.1.6, “Replication and Binary Logging Options and Variables”.) The filters governed by these options can also be set dynamically using the `CHANGE REPLICATION FILTER` statement. The rules governing such filters are the same whether they are created on startup using `--replicate-*` options or while the replica server is running by `CHANGE REPLICATION FILTER`. Note that replication filters cannot be used on Group Replication-specific channels on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state.

In the simplest case, when there are no `--replicate-*` options, the replica executes all statements that it receives from the source. Otherwise, the result depends on the particular options given.

Database-level options (`--replicate-do-db`, `--replicate-ignore-db`) are checked first; see Section 19.2.5.1, “Evaluation of Database-Level Replication and Binary Logging Options”, for a description of this process. If no database-level options are used, option checking proceeds to any table-level options that may be in use (see Section 19.2.5.2, “Evaluation of Table-Level Replication Options”, for a discussion of these). If one or more database-level options are used but none are matched, the statement is not replicated.

For statements affecting databases only (that is, `CREATE DATABASE`, `DROP DATABASE`, and `ALTER DATABASE`), database-level options always take precedence over any `--replicate-wild-do-table` options. In other words, for such statements, `--replicate-wild-do-table` options are checked if and only if there are no database-level options that apply.

To make it easier to determine what effect a given set of options has, it is recommended that you avoid mixing `do-*` and `ignore-*` options, or options containing wildcards with options which do not.

If any `--replicate-rewrite-db` options were specified, they are applied before the `--replicate-*` filtering rules are tested.

Note

All replication filtering options follow the same rules for case sensitivity that apply to names of databases and tables elsewhere in the MySQL server, including the effects of the `lower_case_table_names` system variable.

Filtering rules are applied before performing any privilege checks; if a transaction is filtered out, no privilege check is performed for that transaction, and thus no error can be raised by it. See Section 19.5.1.30, “Replica Errors During Replication”, for more information.


#### 19.2.5.1 Evaluation of Database-Level Replication and Binary Logging Options

When evaluating replication options, the replica begins by checking to see whether there are any `--replicate-do-db` or `--replicate-ignore-db` options that apply. When using `--binlog-do-db` or `--binlog-ignore-db`, the process is similar, but the options are checked on the source.

The database that is checked for a match depends on the binary log format of the statement that is being handled. If the statement has been logged using the row format, the database where data is to be changed is the database that is checked. If the statement has been logged using the statement format, the default database (specified with a `USE` statement) is the database that is checked.

Note

Only DML statements can be logged using the row format. DDL statements are always logged as statements, even when `binlog_format=ROW`. All DDL statements are therefore always filtered according to the rules for statement-based replication. This means that you must select the default database explicitly with a `USE` statement in order for a DDL statement to be applied.

For replication, the steps involved are listed here:

1. Which logging format is used?

   * **STATEMENT.** Test the default database.

   * **ROW.** Test the database affected by the changes.

2. Are there any `--replicate-do-db` options?

   * **Yes.** Does the database match any of them?

     + **Yes.** Continue to Step 4.

     + **No.** Ignore the update and exit.

   * **No.** Continue to step 3.

3. Are there any `--replicate-ignore-db` options?

   * **Yes.** Does the database match any of them?

     + **Yes.** Ignore the update and exit.

     + **No.** Continue to step 4.

   * **No.** Continue to step 4.

4. Proceed to checking the table-level replication options, if there are any. For a description of how these options are checked, see Section 19.2.5.2, “Evaluation of Table-Level Replication Options”.

   Important

   A statement that is still permitted at this stage is not yet actually executed. The statement is not executed until all table-level options (if any) have also been checked, and the outcome of that process permits execution of the statement.

For binary logging, the steps involved are listed here:

1. Are there any `--binlog-do-db` or `--binlog-ignore-db` options?

   * **Yes.** Continue to step 2.

   * **No.** Log the statement and exit.

2. Is there a default database (has any database been selected by `USE`)?

   * **Yes.** Continue to step 3.

   * **No.** Ignore the statement and exit.

3. There is a default database. Are there any `--binlog-do-db` options?

   * **Yes.** Do any of them match the database?

     + **Yes.** Log the statement and exit.

     + **No.** Ignore the statement and exit.

   * **No.** Continue to step 4.

4. Do any of the `--binlog-ignore-db` options match the database?

   * **Yes.** Ignore the statement and exit.

   * **No.** Log the statement and exit.

Important

For statement-based logging, an exception is made in the rules just given for the [`CREATE DATABASE`](create-database.html "15.1.14 CREATE DATABASE Statement"), [`ALTER DATABASE`](alter-database.html "15.1.2 ALTER DATABASE Statement"), and [`DROP DATABASE`](drop-database.html "15.1.28 DROP DATABASE Statement") statements. In those cases, the database being *created, altered, or dropped* replaces the default database when determining whether to log or ignore updates.

`--binlog-do-db` can sometimes mean “ignore other databases”. For example, when using statement-based logging, a server running with only `--binlog-do-db=sales` does not write to the binary log statements for which the default database differs from `sales`. When using row-based logging with the same option, the server logs only those updates that change data in `sales`.


#### 19.2.5.2 Evaluation of Table-Level Replication Options

The replica checks for and evaluates table options only if either of the following two conditions is true:

* No matching database options were found.
* One or more database options were found, and were evaluated to arrive at an “execute” condition according to the rules described in the previous section (see Section 19.2.5.1, “Evaluation of Database-Level Replication and Binary Logging Options”).

First, as a preliminary condition, the replica checks whether statement-based replication is enabled. If so, and the statement occurs within a stored function, the replica executes the statement and exits. If row-based replication is enabled, the replica does not know whether a statement occurred within a stored function on the source, so this condition does not apply.

Note

For statement-based replication, replication events represent statements (all changes making up a given event are associated with a single SQL statement); for row-based replication, each event represents a change in a single table row (thus a single statement such as `UPDATE mytable SET mycol = 1` may yield many row-based events). When viewed in terms of events, the process of checking table options is the same for both row-based and statement-based replication.

Having reached this point, if there are no table options, the replica simply executes all events. If there are any `--replicate-do-table` or `--replicate-wild-do-table` options, the event must match one of these if it is to be executed; otherwise, it is ignored. If there are any `--replicate-ignore-table` or `--replicate-wild-ignore-table` options, all events are executed except those that match any of these options.

Important

Table-level replication filters are only applied to tables that are explicitly mentioned and operated on in the query. They do not apply to tables that are implicitly updated by the query. For example, a `GRANT` statement, which updates the `mysql.user` system table but does not mention that table, is not affected by a filter that specifies `mysql.%` as the wildcard pattern.

The following steps describe this evaluation in more detail. The starting point is the end of the evaluation of the database-level options, as described in Section 19.2.5.1, “Evaluation of Database-Level Replication and Binary Logging Options”.

1. Are there any table replication options?

   * **Yes.** Continue to step 2.

   * **No.** Execute the update and exit.

2. Which logging format is used?

   * **STATEMENT.** Carry out the remaining steps for each statement that performs an update.

   * **ROW.** Carry out the remaining steps for each update of a table row.

3. Are there any `--replicate-do-table` options?

   * **Yes.** Does the table match any of them?

     + **Yes.** Execute the update and exit.

     + **No.** Continue to step 4.

   * **No.** Continue to step 4.

4. Are there any `--replicate-ignore-table` options?

   * **Yes.** Does the table match any of them?

     + **Yes.** Ignore the update and exit.

     + **No.** Continue to step 5.

   * **No.** Continue to step 5.

5. Are there any `--replicate-wild-do-table` options?

   * **Yes.** Does the table match any of them?

     + **Yes.** Execute the update and exit.

     + **No.** Continue to step 6.

   * **No.** Continue to step 6.

6. Are there any `--replicate-wild-ignore-table` options?

   * **Yes.** Does the table match any of them?

     + **Yes.** Ignore the update and exit.

     + **No.** Continue to step 7.

   * **No.** Continue to step 7.

7. Is there another table to be tested?

   * **Yes.** Go back to step 3.

   * **No.** Continue to step 8.

8. Are there any `--replicate-do-table` or `--replicate-wild-do-table` options?

   * **Yes.** Ignore the update and exit.

   * **No.** Execute the update and exit.

Note

Statement-based replication stops if a single SQL statement operates on both a table that is included by a `--replicate-do-table` or `--replicate-wild-do-table` option, and another table that is ignored by a `--replicate-ignore-table` or `--replicate-wild-ignore-table` option. The replica must either execute or ignore the complete statement (which forms a replication event), and it cannot logically do this. This also applies to row-based replication for DDL statements, because DDL statements are always logged as statements, without regard to the logging format in effect. The only type of statement that can update both an included and an ignored table and still be replicated successfully is a DML statement that has been logged with `binlog_format=ROW`.


#### 19.2.5.3 Interactions Between Replication Filtering Options

If you use a combination of database-level and table-level replication filtering options, the replica first accepts or ignores events using the database options, then it evaluates all events permitted by those options according to the table options. This can sometimes lead to results that seem counterintuitive. It is also important to note that the results vary depending on whether the operation is logged using statement-based or row-based binary logging format. If you want to be sure that your replication filters always operate in the same way independently of the binary logging format, which is particularly important if you are using mixed binary logging format, follow the guidance in this topic.

The effect of the replication filtering options differs between binary logging formats because of the way the database name is identified. With statement-based format, DML statements are handled based on the current database, as specified by the `USE` statement. With row-based format, DML statements are handled based on the database where the modified table exists. DDL statements are always filtered based on the current database, as specified by the `USE` statement, regardless of the binary logging format.

An operation that involves multiple tables can also be affected differently by replication filtering options depending on the binary logging format. Operations to watch out for include transactions involving multi-table `UPDATE` statements, triggers, cascading foreign keys, stored functions that update multiple tables, and DML statements that invoke stored functions that update one or more tables. If these operations update both filtered-in and filtered-out tables, the results can vary with the binary logging format.

If you need to guarantee that your replication filters operate consistently regardless of the binary logging format, particularly if you are using mixed binary logging format (`binlog_format=MIXED`), use only table-level replication filtering options, and do not use database-level replication filtering options. Also, do not use multi-table DML statements that update both filtered-in and filtered-out tables.

If you need to use a combination of database-level and table-level replication filters, and want these to operate as consistently as possible, choose one of the following strategies:

1. If you use row-based binary logging format (`binlog_format=ROW`), for DDL statements, rely on the `USE` statement to set the database and do not specify the database name. You can consider changing to row-based binary logging format for improved consistency with replication filtering. See Section 7.4.4.2, “Setting The Binary Log Format” for the conditions that apply to changing the binary logging format.

2. If you use statement-based or mixed binary logging format (`binlog_format=STATEMENT` or `MIXED`), for both DML and DDL statements, rely on the `USE` statement and do not use the database name. Also, do not use multi-table DML statements that update both filtered-in and filtered-out tables.

**Example 19.7 A `--replicate-ignore-db` option and a `--replicate-do-table` option**

On the replication source server, the following statements are issued:

```
USE db1;
CREATE TABLE t2 LIKE t1;
INSERT INTO db2.t3 VALUES (1);
```

The replica has the following replication filtering options set:

```
replicate-ignore-db = db1
replicate-do-table = db2.t3
```

The DDL statement `CREATE TABLE` creates the table in `db1`, as specified by the preceding `USE` statement. The replica filters out this statement according to its `--replicate-ignore-db = db1` option, because `db1` is the current database. This result is the same whatever the binary logging format is on the replication source server. However, the result of the DML `INSERT` statement is different depending on the binary logging format:

* If row-based binary logging format is in use on the source (`binlog_format=ROW`), the replica evaluates the `INSERT` operation using the database where the table exists, which is named as `db2`. The database-level option [`--replicate-ignore-db = db1`](replication-options-replica.html#option_mysqld_replicate-ignore-db), which is evaluated first, therefore does not apply. The table-level option [`--replicate-do-table = db2.t3`](replication-options-replica.html#option_mysqld_replicate-do-table) does apply, so the replica applies the change to table `t3`.

* If statement-based binary logging format is in use on the source (`binlog_format=STATEMENT`), the replica evaluates the `INSERT` operation using the default database, which was set by the `USE` statement to `db1` and has not been changed. According to its database-level `--replicate-ignore-db = db1` option, it therefore ignores the operation and does not apply the change to table `t3`. The table-level option [`--replicate-do-table = db2.t3`](replication-options-replica.html#option_mysqld_replicate-do-table) is not checked, because the statement already matched a database-level option and was ignored.

If the [`--replicate-ignore-db = db1`](replication-options-replica.html#option_mysqld_replicate-ignore-db) option on the replica is necessary, and the use of statement-based (or mixed) binary logging format on the source is also necessary, the results can be made consistent by omitting the database name from the `INSERT` statement and relying on a `USE` statement instead, as follows:

```
USE db1;
CREATE TABLE t2 LIKE t1;
USE db2;
INSERT INTO t3 VALUES (1);
```

In this case, the replica always evaluates the `INSERT` statement based on the database `db2`. Whether the operation is logged in statement-based or row-based binary format, the results remain the same.


#### 19.2.5.4 Replication Channel Based Filters

This section explains how to work with replication filters when multiple replication channels exist, for example in a multi-source replication topology. Replication filters can be global or specific to a channel, enabling you to configure multi-source replicas with replication filters on specific replication channels. Channel specific replication filters are particularly useful in a multi-source replication topology when the same database or table is present on multiple sources, and the replica is only required to replicate it from one source.

For instructions to set up replication channels, see Section 19.1.5, “MySQL Multi-Source Replication”, and for more information on how they work, see Section 19.2.2, “Replication Channels”.

Important

Each channel on a multi-source replica must replicate from a different source. You cannot set up multiple replication channels from a single replica to a single source, even if you use replication filters to select different data to replicate on each channel. This is because the server IDs of replicas must be unique in a replication topology. The source distinguishes replicas only by their server IDs, not by the names of the replication channels, so it cannot recognize different replication channels from the same replica.

Important

On a MySQL server instance that is configured for Group Replication, channel specific replication filters can be used on replication channels that are not directly involved with Group Replication, such as where a group member also acts as a replica to a source that is outside the group. They cannot be used on the `group_replication_applier` or `group_replication_recovery` channels. Filtering on these channels would make the group unable to reach agreement on a consistent state.

Important

For a multi-source replica in a diamond topology (where the replica replicates from two or more sources, which in turn replicate from a common source), when GTID-based replication is in use, ensure that any replication filters or other channel configuration are identical on all channels on the multi-source replica. With GTID-based replication, filters are applied only to the transaction data, and GTIDs are not filtered out. This happens so that a replica’s GTID set stays consistent with the source’s, meaning GTID auto-positioning can be used without re-acquiring filtered out transactions each time. In the case where the downstream replica is multi-source and receives the same transaction from multiple sources in a diamond topology, the downstream replica now has multiple versions of the transaction, and the result depends on which channel applies the transaction first. The second channel to attempt it skips the transaction using GTID auto-skip, because the transaction’s GTID was added to the `gtid_executed` set by the first channel. With identical filtering on the channels, there is no problem because all versions of the transaction contain the same data, so the results are the same. However, with different filtering on the channels, the database can become inconsistent and replication can hang.

##### Overview of Replication Filters and Channels

When multiple replication channels exist, for example in a multi-source replication topology, replication filters are applied as follows:

* Any global replication filter specified is added to the global replication filters of the filter type (`do_db`, `do_ignore_table`, and so on).

* Any channel specific replication filter adds the filter to the specified channel’s replication filters for the specified filter type.

* Each replication channel copies global replication filters to its channel specific replication filters if no channel specific replication filter of this type is configured.

* Each channel uses its channel specific replication filters to filter the replication stream.

The syntax to create channel specific replication filters extends the existing SQL statements and command options. When a replication channel is not specified the global replication filter is configured to ensure backwards compatibility. The `CHANGE REPLICATION FILTER` statement supports the `FOR CHANNEL` clause to configure channel specific filters online. The `--replicate-*` command options to configure filters can specify a replication channel using the form `--replicate-filter_type=channel_name:filter_details`. Suppose channels `channel_1` and `channel_2` exist before the server starts; in this case, starting the replica with the command line options `--replicate-do-db=db1` `--replicate-do-db=channel_1:db2` `--replicate-do-db=db3` `--replicate-ignore-db=db4` `--replicate-ignore-db=channel_2:db5` `--replicate-wild-do-table=channel_1:db6.t1%` would result in:

* *Global replication filters*: `do_db=db1,db3`; `ignore_db=db4`

* *Channel specific filters on channel\_1*: `do_db=db2`; `ignore_db=db4`; `wild-do-table=db6.t1%`

* *Channel specific filters on channel\_2*: `do_db=db1,db3`; `ignore_db=db5`

These same rules could be applied at startup when included in the replica's `my.cnf` file, like this:

```
replicate-do-db=db1
replicate-do-db=channel_1:db2
replicate-ignore-db=db4
replicate-ignore-db=channel_2:db5
replicate-wild-do-table=channel_1:db6.t1%
```

To monitor the replication filters in such a setup use the `replication_applier_global_filters` and `replication_applier_filters` tables.

##### Configuring Channel Specific Replication Filters at Startup

The replication filter related command options can take an optional *`channel`* followed by a colon, followed by the filter specification. The first colon is interpreted as a separator, subsequent colons are interpreted as literal colons. The following command options support channel specific replication filters using this format:

* `--replicate-do-db=channel:database_id`
* `--replicate-ignore-db=channel:database_id`
* `--replicate-do-table=channel:table_id`
* `--replicate-ignore-table=channel:table_id`
* `--replicate-rewrite-db=channel:db1-db2`
* `--replicate-wild-do-table=channel:table pattern`

* `--replicate-wild-ignore-table=channel:table pattern`

All of the options just listed can be used in the replica's `my.cnf` file, as with most other MySQL server startup options, by omitting the two leading dashes. See Overview of Replication Filters and Channels, for a brief example, as well as Section 6.2.2.2, “Using Option Files”.

If you use a colon but do not specify a *`channel`* for the filter option, for example `--replicate-do-db=:database_id`, the option configures the replication filter for the default replication channel. The default replication channel is the replication channel which always exists once replication has been started, and differs from multi-source replication channels which you create manually. When neither the colon nor a *`channel`* is specified the option configures the global replication filters, for example `--replicate-do-db=database_id` configures the global `--replicate-do-db` filter.

If you configure multiple `rewrite-db=from_name->to_name` options with the same *`from_name`* database, all filters are added together (put into the `rewrite_do` list) and the first one takes effect.

The *`pattern`* used for the `--replicate-wild-*-table` options can include any characters allowed in identifiers as well as the wildcards `%` and `_`. These work the same way as when used with the `LIKE` operator; for example, `tbl%` matches any table name beginning with `tbl`, and `tbl_` matches any table name matching `tbl` plus one additional character.

##### Changing Channel Specific Replication Filters Online

In addition to the `--replicate-*` options, replication filters can be configured using the `CHANGE REPLICATION FILTER` statement. This removes the need to restart the server, but the replication SQL thread must be stopped while making the change. To make this statement apply the filter to a specific channel, use the `FOR CHANNEL channel` clause. For example:

```
CHANGE REPLICATION FILTER REPLICATE_DO_DB=(db1) FOR CHANNEL channel_1;
```

When a `FOR CHANNEL` clause is provided, the statement acts on the specified channel's replication filters. If multiple types of filters (`do_db`, `do_ignore_table`, `wild_do_table`, and so on) are specified, only the specified filter types are replaced by the statement. In a replication topology with multiple channels, for example on a multi-source replica, when no `FOR CHANNEL` clause is provided, the statement acts on the global replication filters and all channels’ replication filters, using a similar logic as the `FOR CHANNEL` case. For more information see Section 15.4.2.1, “CHANGE REPLICATION FILTER Statement”.

##### Removing Channel Specific Replication Filters

When channel specific replication filters have been configured, you can remove the filter by issuing an empty filter type statement. For example to remove all `REPLICATE_REWRITE_DB` filters from a replication channel named `channel_1` issue:

```
CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB=() FOR CHANNEL channel_1;
```

Any `REPLICATE_REWRITE_DB` filters previously configured, using either command options or `CHANGE REPLICATION FILTER`, are removed.

The [`RESET REPLICA ALL`](reset-replica.html "15.4.2.3 RESET REPLICA Statement") statement removes channel specific replication filters that were set on channels deleted by the statement. When the deleted channel or channels are recreated, any global replication filters specified for the replica are copied to them, and no channel specific replication filters are applied.
