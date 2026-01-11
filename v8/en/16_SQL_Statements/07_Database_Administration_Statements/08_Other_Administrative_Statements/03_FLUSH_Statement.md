#### 15.7.8.3 FLUSH Statement

```
FLUSH [NO_WRITE_TO_BINLOG | LOCAL] {
    flush_option [, flush_option] ...
  | tables_option
}

flush_option: {
    BINARY LOGS
  | ENGINE LOGS
  | ERROR LOGS
  | GENERAL LOGS
  | HOSTS
  | LOGS
  | PRIVILEGES
  | OPTIMIZER_COSTS
  | RELAY LOGS [FOR CHANNEL channel]
  | SLOW LOGS
  | STATUS
  | USER_RESOURCES
}

tables_option: {
    table_synonym
  | table_synonym tbl_name [, tbl_name] ...
  | table_synonym WITH READ LOCK
  | table_synonym tbl_name [, tbl_name] ... WITH READ LOCK
  | table_synonym tbl_name [, tbl_name] ... FOR EXPORT
}

table_synonym: {
    TABLE
  | TABLES
}
```

The `FLUSH` statement has several variant forms that clear or reload various internal caches, flush tables, or acquire locks. Each `FLUSH` operation requires the privileges indicated in its description.

Note

It is not possible to issue `FLUSH` statements within stored functions or triggers. However, you may use `FLUSH` in stored procedures, so long as these are not called from stored functions or triggers. See Section 27.8, “Restrictions on Stored Programs”.

By default, the server writes `FLUSH` statements to the binary log so that they replicate to replicas. To suppress logging, specify the optional `NO_WRITE_TO_BINLOG` keyword or its alias `LOCAL`.

Note

`FLUSH LOGS`, `FLUSH BINARY LOGS`, `FLUSH TABLES WITH READ LOCK` (with or without a table list), and `FLUSH TABLES tbl_name ... FOR EXPORT` are not written to the binary log in any case because they would cause problems if replicated to a replica.

The `FLUSH` statement causes an implicit commit. See Section 15.3.3, “Statements That Cause an Implicit Commit”.

The **mysqladmin** utility provides a command-line interface to some flush operations, using commands such as `flush-hosts`, `flush-logs`, `flush-privileges`, `flush-status`, and `flush-tables`. See Section 6.5.2, “mysqladmin — A MySQL Server Administration Program”.

Sending a `SIGHUP` or `SIGUSR1` signal to the server causes several flush operations to occur that are similar to various forms of the `FLUSH` statement. Signals can be sent by the `root` system account or the system account that owns the server process. This enables the flush operations to be performed without having to connect to the server, which requires a MySQL account that has privileges sufficient for those operations. See Section 6.10, “Unix Signal Handling in MySQL”.

The `RESET` statement is similar to `FLUSH`. See Section 15.7.8.6, “RESET Statement”, for information about using `RESET` with replication.

The following list describes the permitted `FLUSH` statement *`flush_option`* values. For descriptions of the permitted *`tables_option`* values, see FLUSH TABLES Syntax.

* `FLUSH BINARY LOGS`

  Closes and reopens any binary log file to which the server is writing. If binary logging is enabled, the sequence number of the binary log file is incremented by one relative to the previous file.

  This operation requires the `RELOAD` privilege.

* `FLUSH ENGINE LOGS`

  Closes and reopens any flushable logs for installed storage engines. This causes `InnoDB` to flush its logs to disk.

  This operation requires the `RELOAD` privilege.

* `FLUSH ERROR LOGS`

  Closes and reopens any error log file to which the server is writing.

  This operation requires the `RELOAD` privilege.

* `FLUSH GENERAL LOGS`

  Closes and reopens any general query log file to which the server is writing.

  This operation requires the `RELOAD` privilege.

  This operation has no effect on tables used for the general query log (see Section 7.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”).

* `FLUSH HOSTS`

  Empties the host cache and the Performance Schema `host_cache` table that exposes the cache contents, and unblocks any blocked hosts.

  This operation requires the `RELOAD` privilege.

  For information about why host cache flushing might be advisable or desirable, see Section 7.1.12.3, “DNS Lookups and the Host Cache”.

  Note

  `FLUSH HOSTS` is deprecated as of MySQL 8.0.23; expect it to be removed in a future MySQL release. Instead, truncate the Performance Schema `host_cache` table:

  ```
  TRUNCATE TABLE performance_schema.host_cache;
  ```

  The `TRUNCATE TABLE` operation requires the `DROP` privilege for the table rather than the `RELOAD` privilege. You should be aware that the `TRUNCATE TABLE` statement is not written to the binary log. To obtain the same behavior from `FLUSH HOSTS`, specify `NO_WRITE_TO_BINLOG` or `LOCAL` as part of the statement.

* `FLUSH LOGS`

  Closes and reopens any log file to which the server is writing.

  This operation requires the `RELOAD` privilege.

  The effect of this operation is equivalent to the combined effects of these operations:

  ```
  FLUSH BINARY LOGS
  FLUSH ENGINE LOGS
  FLUSH ERROR LOGS
  FLUSH GENERAL LOGS
  FLUSH RELAY LOGS
  FLUSH SLOW LOGS
  ```

* `FLUSH OPTIMIZER_COSTS`

  Re-reads the cost model tables so that the optimizer starts using the current cost estimates stored in them.

  This operation requires the `FLUSH_OPTIMIZER_COSTS` or `RELOAD` privilege.

  The server writes a warning to the error log for any unrecognized cost model table entries. For information about these tables, see Section 10.9.5, “The Optimizer Cost Model”. This operation affects only sessions that begin subsequent to the flush. Existing sessions continue to use the cost estimates that were current when they began.

* `FLUSH PRIVILEGES`

  Re-reads the privileges from the grant tables in the `mysql` system schema. As part of this operation, the server reads the `global_grants` table containing dynamic privilege assignments and registers any unregistered privileges found there.

  Reloading the grant tables is necessary to enable updates to MySQL privileges and users only if you make such changes directly to the grant tables; it is not needed for account management statements such as `GRANT` or `REVOKE`, which take effect immediately. See Section 8.2.13, “When Privilege Changes Take Effect”, for more information.

  This operation requires the `RELOAD` privilege.

  If the `--skip-grant-tables` option was specified at server startup to disable the MySQL privilege system, `FLUSH PRIVILEGES` provides a way to enable the privilege system at runtime.

  Resets failed-login tracking (or enables it if the server was started with `--skip-grant-tables`) and unlocks any temporarily locked accounts. See Section 8.2.15, “Password Management”.

  Frees memory cached by the server as a result of `GRANT`, `CREATE USER`, `CREATE SERVER`, and `INSTALL PLUGIN` statements. This memory is not released by the corresponding `REVOKE`, `DROP USER`, `DROP SERVER`, and `UNINSTALL PLUGIN` statements, so for a server that executes many instances of the statements that cause caching, there is an increase in cached memory use unless it is freed with `FLUSH PRIVILEGES`.

  Clears the in-memory cache used by the `caching_sha2_password` authentication plugin. See Cache Operation for SHA-2 Pluggable Authentication.

* `FLUSH RELAY LOGS [FOR CHANNEL channel]`

  Closes and reopens any relay log file to which the server is writing. If relay logging is enabled, the sequence number of the relay log file is incremented by one relative to the previous file.

  This operation requires the `RELOAD` privilege.

  The `FOR CHANNEL channel` clause enables you to name which replication channel the operation applies to. Execute `FLUSH RELAY LOGS FOR CHANNEL channel` to flush the relay log for a specific replication channel. If no channel is named and no extra replication channels exist, the operation applies to the default channel. If no channel is named and multiple replication channels exist, the operation applies to all replication channels. For more information, see Section 19.2.2, “Replication Channels”.

* `FLUSH SLOW LOGS`

  Closes and reopens any slow query log file to which the server is writing.

  This operation requires the `RELOAD` privilege.

  This operation has no effect on tables used for the slow query log (see Section 7.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”).

* `FLUSH STATUS`

  Flushes status indicators.

  This operation adds the current thread's session status variable values to the global values and resets the session values to zero. Some global variables may be reset to zero as well. It also resets the counters for key caches (default and named) to zero and sets `Max_used_connections` to the current number of open connections. This information may be of use when debugging a query. See Section 1.5, “How to Report Bugs or Problems”.

  `FLUSH STATUS` is unaffected by `read_only` or `super_read_only`, and is always written to the binary log.

  This operation requires the `FLUSH_STATUS` or `RELOAD` privilege.

* `FLUSH USER_RESOURCES`

  Resets all per-hour user resource indicators to zero.

  This operation requires the `FLUSH_USER_RESOURCES` or `RELOAD` privilege.

  Resetting resource indicators enables clients that have reached their hourly connection, query, or update limits to resume activity immediately. `FLUSH USER_RESOURCES` does not apply to the limit on maximum simultaneous connections that is controlled by the `max_user_connections` system variable. See Section 8.2.21, “Setting Account Resource Limits”.

##### FLUSH TABLES Syntax

`FLUSH TABLES` flushes tables, and, depending on the variant used, acquires locks. Any `TABLES` variant used in a `FLUSH` statement must be the only option used. `FLUSH TABLE` is a synonym for `FLUSH TABLES`.

Note

The descriptions here that indicate tables are flushed by closing them apply differently for `InnoDB`, which flushes table contents to disk but leaves them open. This still permits table files to be copied while the tables are open, as long as other activity does not modify them.

* `FLUSH TABLES`

  Closes all open tables, forces all tables in use to be closed, and flushes the prepared statement cache.

  This operation requires the `FLUSH_TABLES` or `RELOAD` privilege.

  For information about prepared statement caching, see Section 10.10.3, “Caching of Prepared Statements and Stored Programs”.

  `FLUSH TABLES` is not permitted when there is an active `LOCK TABLES ... READ`. To flush and lock tables, use `FLUSH TABLES tbl_name ... WITH READ LOCK` instead.

* `FLUSH TABLES tbl_name [, tbl_name] ...`

  With a list of one or more comma-separated table names, this operation is like `FLUSH TABLES` with no names except that the server flushes only the named tables. If a named table does not exist, no error occurs.

  This operation requires the `FLUSH_TABLES` or `RELOAD` privilege.

* `FLUSH TABLES WITH READ LOCK`

  Closes all open tables and locks all tables for all databases with a global read lock.

  This operation requires the `FLUSH_TABLES` or `RELOAD` privilege.

  This operation is a very convenient way to get backups if you have a file system such as Veritas or ZFS that can take snapshots in time. Use `UNLOCK TABLES` to release the lock.

  `FLUSH TABLES WITH READ LOCK` acquires a global read lock rather than table locks, so it is not subject to the same behavior as `LOCK TABLES` and `UNLOCK TABLES` with respect to table locking and implicit commits:

  + `UNLOCK TABLES` implicitly commits any active transaction only if any tables currently have been locked with `LOCK TABLES`. The commit does not occur for `UNLOCK TABLES` following `FLUSH TABLES WITH READ LOCK` because the latter statement does not acquire table locks.

  + Beginning a transaction causes table locks acquired with `LOCK TABLES` to be released, as though you had executed `UNLOCK TABLES`. Beginning a transaction does not release a global read lock acquired with `FLUSH TABLES WITH READ LOCK`.

  `FLUSH TABLES WITH READ LOCK` does not prevent the server from inserting rows into the log tables (see Section 7.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”).

* `FLUSH TABLES tbl_name [, tbl_name] ... WITH READ LOCK`

  Flushes and acquires read locks for the named tables.

  This operation requires the `FLUSH_TABLES` or `RELOAD` privilege. Because it acquires table locks, it also requires the `LOCK TABLES` privilege for each table.

  The operation first acquires exclusive metadata locks for the tables, so it waits for transactions that have those tables open to complete. Then the operation flushes the tables from the table cache, reopens the tables, acquires table locks (like `LOCK TABLES ... READ`), and downgrades the metadata locks from exclusive to shared. After the operation acquires locks and downgrades the metadata locks, other sessions can read but not modify the tables.

  This operation applies only to existing base (non-`TEMPORARY)` tables. If a name refers to a base table, that table is used. If it refers to a `TEMPORARY` table, it is ignored. If a name applies to a view, an `ER_WRONG_OBJECT` error occurs. Otherwise, an `ER_NO_SUCH_TABLE` error occurs.

  Use `UNLOCK TABLES` to release the locks, `LOCK TABLES` to release the locks and acquire other locks, or `START TRANSACTION` to release the locks and begin a new transaction.

  This `FLUSH TABLES` variant enables tables to be flushed and locked in a single operation. It provides a workaround for the restriction that `FLUSH TABLES` is not permitted when there is an active `LOCK TABLES ... READ`.

  This operation does not perform an implicit `UNLOCK TABLES`, so an error results if you perform the operation while there is any active `LOCK TABLES` or use it a second time without first releasing the locks acquired.

  If a flushed table was opened with `HANDLER`, the handler is implicitly flushed and loses its position.

* `FLUSH TABLES tbl_name [, tbl_name] ... FOR EXPORT`

  This `FLUSH TABLES` variant applies to `InnoDB` tables. It ensures that changes to the named tables have been flushed to disk so that binary table copies can be made while the server is running.

  This operation requires the `FLUSH_TABLES` or `RELOAD` privilege. Because it acquires locks on tables in preparation for exporting them, it also requires the `LOCK TABLES` and `SELECT` privileges for each table.

  The operation works like this:

  1. It acquires shared metadata locks for the named tables. The operation blocks as long as other sessions have active transactions that have modified those tables or hold table locks for them. When the locks have been acquired, the operation blocks transactions that attempt to update the tables, while permitting read-only operations to continue.

  2. It checks whether all storage engines for the tables support `FOR EXPORT`. If any do not, an `ER_ILLEGAL_HA` error occurs and the operation fails.

  3. The operation notifies the storage engine for each table to make the table ready for export. The storage engine must ensure that any pending changes are written to disk.

  4. The operation puts the session in lock-tables mode so that the metadata locks acquired earlier are not released when the `FOR EXPORT` operation completes.

  This operation applies only to existing base (non-`TEMPORARY`) tables. If a name refers to a base table, that table is used. If it refers to a `TEMPORARY` table, it is ignored. If a name applies to a view, an `ER_WRONG_OBJECT` error occurs. Otherwise, an `ER_NO_SUCH_TABLE` error occurs.

  `InnoDB` supports `FOR EXPORT` for tables that have their own `.ibd` file file (that is, tables created with the `innodb_file_per_table` setting enabled). `InnoDB` ensures when notified by the `FOR EXPORT` operation that any changes have been flushed to disk. This permits a binary copy of table contents to be made while the `FOR EXPORT` operation is in effect because the `.ibd` file is transaction consistent and can be copied while the server is running. `FOR EXPORT` does not apply to `InnoDB` system tablespace files, or to `InnoDB` tables that have `FULLTEXT` indexes.

  `FLUSH TABLES ...FOR EXPORT` is supported for partitioned `InnoDB` tables.

  When notified by `FOR EXPORT`, `InnoDB` writes to disk certain kinds of data that is normally held in memory or in separate disk buffers outside the tablespace files. For each table, `InnoDB` also produces a file named `table_name.cfg` in the same database directory as the table. The `.cfg` file contains metadata needed to reimport the tablespace files later, into the same or different server.

  When the `FOR EXPORT` operation completes, `InnoDB` has flushed all dirty pages to the table data files. Any change buffer entries are merged prior to flushing. At this point, the tables are locked and quiescent: The tables are in a transactionally consistent state on disk and you can copy the `.ibd` tablespace files along with the corresponding `.cfg` files to get a consistent snapshot of those tables.

  For the procedure to reimport the copied table data into a MySQL instance, see Section 17.6.1.3, “Importing InnoDB Tables”.

  After you are done with the tables, use `UNLOCK TABLES` to release the locks, `LOCK TABLES` to release the locks and acquire other locks, or `START TRANSACTION` to release the locks and begin a new transaction.

  While any of these statements is in effect within the session, attempts to use `FLUSH TABLES ... FOR EXPORT` produce an error:

  ```
  FLUSH TABLES ... WITH READ LOCK
  FLUSH TABLES ... FOR EXPORT
  LOCK TABLES ... READ
  LOCK TABLES ... WRITE
  ```

  While `FLUSH TABLES ... FOR EXPORT` is in effect within the session, attempts to use any of these statements produce an error:

  ```
  FLUSH TABLES WITH READ LOCK
  FLUSH TABLES ... WITH READ LOCK
  FLUSH TABLES ... FOR EXPORT
  ```
