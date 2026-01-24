#### 13.7.6.3 FLUSH Statement

```sql
FLUSH [NO_WRITE_TO_BINLOG | LOCAL] {
    flush_option [, flush_option] ...
  | tables_option
}

flush_option: {
    BINARY LOGS
  | DES_KEY_FILE
  | ENGINE LOGS
  | ERROR LOGS
  | GENERAL LOGS
  | HOSTS
  | LOGS
  | PRIVILEGES
  | OPTIMIZER_COSTS
  | QUERY CACHE
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

The [`FLUSH`](flush.html "13.7.6.3 FLUSH Statement") statement has several variant forms that clear or reload various internal caches, flush tables, or acquire locks. To execute [`FLUSH`](flush.html "13.7.6.3 FLUSH Statement"), you must have the [`RELOAD`](privileges-provided.html#priv_reload) privilege. Specific flush options might require additional privileges, as indicated in the option descriptions.

Note

It is not possible to issue [`FLUSH`](flush.html "13.7.6.3 FLUSH Statement") statements within stored functions or triggers. However, you may use [`FLUSH`](flush.html "13.7.6.3 FLUSH Statement") in stored procedures, so long as these are not called from stored functions or triggers. See [Section 23.8, “Restrictions on Stored Programs”](stored-program-restrictions.html "23.8 Restrictions on Stored Programs").

By default, the server writes [`FLUSH`](flush.html "13.7.6.3 FLUSH Statement") statements to the binary log so that they replicate to replicas. To suppress logging, specify the optional `NO_WRITE_TO_BINLOG` keyword or its alias `LOCAL`.

Note

[`FLUSH LOGS`](flush.html#flush-logs), [`FLUSH BINARY LOGS`](flush.html#flush-binary-logs), [`FLUSH TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock) (with or without a table list), and [`FLUSH TABLES tbl_name ... FOR EXPORT`](flush.html#flush-tables-for-export-with-list) are not written to the binary log in any case because they would cause problems if replicated to a replica.

The [`FLUSH`](flush.html "13.7.6.3 FLUSH Statement") statement causes an implicit commit. See [Section 13.3.3, “Statements That Cause an Implicit Commit”](implicit-commit.html "13.3.3 Statements That Cause an Implicit Commit").

The [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") utility provides a command-line interface to some flush operations, using commands such as `flush-hosts`, `flush-logs`, `flush-privileges`, `flush-status`, and `flush-tables`. See [Section 4.5.2, “mysqladmin — A MySQL Server Administration Program”](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program").

Sending a `SIGHUP` signal to the server causes several flush operations to occur that are similar to various forms of the [`FLUSH`](flush.html "13.7.6.3 FLUSH Statement") statement. Signals can be sent by the `root` system account or the system account that owns the server process. This enables the flush operations to be performed without having to connect to the server, which requires a MySQL account that has privileges sufficient for those operations. See [Section 4.10, “Unix Signal Handling in MySQL”](unix-signal-response.html "4.10 Unix Signal Handling in MySQL").

The [`RESET`](reset.html "13.7.6.6 RESET Statement") statement is similar to [`FLUSH`](flush.html "13.7.6.3 FLUSH Statement"). See [Section 13.7.6.6, “RESET Statement”](reset.html "13.7.6.6 RESET Statement"), for information about using [`RESET`](reset.html "13.7.6.6 RESET Statement") with replication.

The following list describes the permitted [`FLUSH`](flush.html "13.7.6.3 FLUSH Statement") statement *`flush_option`* values. For descriptions of the permitted *`tables_option`* values, see [FLUSH TABLES Syntax](flush.html#flush-tables-variants "FLUSH TABLES Syntax").

* [`FLUSH BINARY LOGS`](flush.html#flush-binary-logs)

  Closes and reopens any binary log file to which the server is writing. If binary logging is enabled, the sequence number of the binary log file is incremented by one relative to the previous file.

  This operation has no effect on tables used for the binary and relay logs (as controlled by the [`master_info_repository`](replication-options-replica.html#sysvar_master_info_repository) and [`relay_log_info_repository`](replication-options-replica.html#sysvar_relay_log_info_repository) system variables).

* [`FLUSH DES_KEY_FILE`](flush.html#flush-des-key-file)

  Reloads the DES keys from the file that was specified with the [`--des-key-file`](server-options.html#option_mysqld_des-key-file) option at server startup time.

  Note

  The [`DES_ENCRYPT()`](encryption-functions.html#function_des-encrypt) and [`DES_DECRYPT()`](encryption-functions.html#function_des-decrypt) functions are deprecated in MySQL 5.7, are removed in MySQL 8.0, and should no longer be used. Consequently, [`--des-key-file`](server-options.html#option_mysqld_des-key-file) and `DES_KEY_FILE` also are deprecated and are removed in MySQL 8.0.

* [`FLUSH ENGINE LOGS`](flush.html#flush-engine-logs)

  Closes and reopens any flushable logs for installed storage engines. This causes `InnoDB` to flush its logs to disk.

* [`FLUSH ERROR LOGS`](flush.html#flush-error-logs)

  Closes and reopens any error log file to which the server is writing.

* [`FLUSH GENERAL LOGS`](flush.html#flush-general-logs)

  Closes and reopens any general query log file to which the server is writing.

  This operation has no effect on tables used for the general query log (see [Section 5.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”](log-destinations.html "5.4.1 Selecting General Query Log and Slow Query Log Output Destinations")).

* [`FLUSH HOSTS`](flush.html#flush-hosts)

  Empties the host cache and the Performance Schema [`host_cache`](performance-schema-host-cache-table.html "25.12.16.1 The host_cache Table") table that exposes the cache contents, and unblocks any blocked hosts.

  For information about why host cache flushing might be advisable or desirable, see [Section 5.1.11.2, “DNS Lookups and the Host Cache”](host-cache.html "5.1.11.2 DNS Lookups and the Host Cache").

  Note

  The statement [`TRUNCATE TABLE performance_schema.host_cache`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement"), unlike `FLUSH HOSTS`, is not written to the binary log. To obtain the same behavior from the latter, specify `NO_WRITE_TO_BINLOG` or `LOCAL` as part of the `FLUSH HOSTS` statement.

* [`FLUSH LOGS`](flush.html#flush-logs)

  Closes and reopens any log file to which the server is writing.

  The effect of this operation is equivalent to the combined effects of these operations:

  ```sql
  FLUSH BINARY LOGS
  FLUSH ENGINE LOGS
  FLUSH ERROR LOGS
  FLUSH GENERAL LOGS
  FLUSH RELAY LOGS
  FLUSH SLOW LOGS
  ```

* [`FLUSH OPTIMIZER_COSTS`](flush.html#flush-optimizer-costs)

  Re-reads the cost model tables so that the optimizer starts using the current cost estimates stored in them.

  The server writes a warning to the error log for any unrecognized cost model table entries. For information about these tables, see [Section 8.9.5, “The Optimizer Cost Model”](cost-model.html "8.9.5 The Optimizer Cost Model"). This operation affects only sessions that begin subsequent to the flush. Existing sessions continue to use the cost estimates that were current when they began.

* [`FLUSH PRIVILEGES`](flush.html#flush-privileges)

  Re-reads the privileges from the grant tables in the `mysql` system database.

  Reloading the grant tables is necessary to enable updates to MySQL privileges and users only if you make such changes directly to the grant tables; it is not needed for account management statements such as [`GRANT`](grant.html "13.7.1.4 GRANT Statement") or [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement"), which take effect immediately. See [Section 6.2.9, “When Privilege Changes Take Effect”](privilege-changes.html "6.2.9 When Privilege Changes Take Effect"), for more information.

  If the [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) option was specified at server startup to disable the MySQL privilege system, [`FLUSH PRIVILEGES`](flush.html#flush-privileges) provides a way to enable the privilege system at runtime.

  Frees memory cached by the server as a result of [`GRANT`](grant.html "13.7.1.4 GRANT Statement"), [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), [`CREATE SERVER`](create-server.html "13.1.17 CREATE SERVER Statement"), and [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") statements. This memory is not released by the corresponding [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement"), [`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement"), [`DROP SERVER`](drop-server.html "13.1.28 DROP SERVER Statement"), and [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement") statements, so for a server that executes many instances of the statements that cause caching, cached memory use increases unless it is freed with [`FLUSH PRIVILEGES`](flush.html#flush-privileges).

* [`FLUSH QUERY CACHE`](flush.html#flush-query-cache)

  Defragment the query cache to better utilize its memory. [`FLUSH QUERY CACHE`](flush.html#flush-query-cache) does not remove any queries from the cache, unlike [`FLUSH TABLES`](flush.html#flush-tables) or `RESET QUERY CACHE`.

  Note

  The query cache is deprecated as of MySQL 5.7.20, and is removed in MySQL 8.0. Deprecation includes [`FLUSH QUERY CACHE`](flush.html#flush-query-cache).

* [`FLUSH RELAY LOGS [FOR CHANNEL channel]`](flush.html#flush-relay-logs)

  Closes and reopens any relay log file to which the server is writing. If relay logging is enabled, the sequence number of the relay log file is incremented by one relative to the previous file.

  The `FOR CHANNEL channel` clause enables you to name which replication channel the operation applies to. Execute [`FLUSH RELAY LOGS FOR CHANNEL channel`](flush.html#flush-relay-logs) to flush the relay log for a specific replication channel. If no channel is named and no extra replication channels exist, the operation applies to the default channel. If no channel is named and multiple replication channels exist, the operation applies to all replication channels, with the exception of the `group_replication_applier` channel. For more information, see [Section 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels").

  This operation has no effect on tables used for the binary and relay logs (as controlled by the [`master_info_repository`](replication-options-replica.html#sysvar_master_info_repository) and [`relay_log_info_repository`](replication-options-replica.html#sysvar_relay_log_info_repository) system variables).

* [`FLUSH SLOW LOGS`](flush.html#flush-slow-logs)

  Closes and reopens any slow query log file to which the server is writing.

  This operation has no effect on tables used for the slow query log (see [Section 5.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”](log-destinations.html "5.4.1 Selecting General Query Log and Slow Query Log Output Destinations")).

* [`FLUSH STATUS`](flush.html#flush-status)

  Flushes status indicators.

  This operation adds the current thread's session status variable values to the global values and resets the session values to zero. Some global variables may be reset to zero as well. It also resets the counters for key caches (default and named) to zero and sets [`Max_used_connections`](server-status-variables.html#statvar_Max_used_connections) to the current number of open connections. This information may be of use when debugging a query. See [Section 1.5, “How to Report Bugs or Problems”](bug-reports.html "1.5 How to Report Bugs or Problems").

  `FLUSH STATUS` is unaffected by [`read_only`](server-system-variables.html#sysvar_read_only) or [`super_read_only`](server-system-variables.html#sysvar_super_read_only), and is always written to the binary log.

  Note

  The value of the [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) system variable affects the operation of this `FLUSH` option. For details, see the description of that variable in [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

* [`FLUSH USER_RESOURCES`](flush.html#flush-user-resources)

  Resets all per-hour user resource indicators to zero.

  Resetting resource indicators enables clients that have reached their hourly connection, query, or update limits to resume activity immediately. [`FLUSH USER_RESOURCES`](flush.html#flush-user-resources) does not apply to the limit on maximum simultaneous connections that is controlled by the [`max_user_connections`](server-system-variables.html#sysvar_max_user_connections) system variable. See [Section 6.2.16, “Setting Account Resource Limits”](user-resources.html "6.2.16 Setting Account Resource Limits").

##### FLUSH TABLES Syntax

[`FLUSH TABLES`](flush.html#flush-tables) flushes tables, and, depending on the variant used, acquires locks. Any `TABLES` variant used in a [`FLUSH`](flush.html "13.7.6.3 FLUSH Statement") statement must be the only option used. [`FLUSH TABLE`](flush.html#flush-tables) is a synonym for [`FLUSH TABLES`](flush.html#flush-tables).

Note

The descriptions here that indicate tables are flushed by closing them apply differently for `InnoDB`, which flushes table contents to disk but leaves them open. This still permits table files to be copied while the tables are open, as long as other activity does not modify them.

* [`FLUSH TABLES`](flush.html#flush-tables)

  Closes all open tables, forces all tables in use to be closed, and flushes the query cache and prepared statement cache. [`FLUSH TABLES`](flush.html#flush-tables) also removes all query results from the query cache, like the `RESET QUERY CACHE` statement. For information about query caching and prepared statement caching, see [Section 8.10.3, “The MySQL Query Cache”](query-cache.html "8.10.3 The MySQL Query Cache"). and [Section 8.10.4, “Caching of Prepared Statements and Stored Programs”](statement-caching.html "8.10.4 Caching of Prepared Statements and Stored Programs").

  [`FLUSH TABLES`](flush.html#flush-tables) is not permitted when there is an active [`LOCK TABLES ... READ`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements"). To flush and lock tables, use [`FLUSH TABLES tbl_name ... WITH READ LOCK`](flush.html#flush-tables-with-read-lock-with-list) instead.

* [`FLUSH TABLES tbl_name [, tbl_name] ...`](flush.html#flush-tables-with-list)

  With a list of one or more comma-separated table names, this operation is like [`FLUSH TABLES`](flush.html#flush-tables) with no names except that the server flushes only the named tables. If a named table does not exist, no error occurs.

* [`FLUSH TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock)

  Closes all open tables and locks all tables for all databases with a global read lock.

  This operation is a very convenient way to get backups if you have a file system such as Veritas or ZFS that can take snapshots in time. Use [`UNLOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") to release the lock.

  [`FLUSH TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock) acquires a global read lock rather than table locks, so it is not subject to the same behavior as [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") and [`UNLOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") with respect to table locking and implicit commits:

  + [`UNLOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") implicitly commits any active transaction only if any tables currently have been locked with [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements"). The commit does not occur for [`UNLOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") following [`FLUSH TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock) because the latter statement does not acquire table locks.

  + Beginning a transaction causes table locks acquired with [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") to be released, as though you had executed [`UNLOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements"). Beginning a transaction does not release a global read lock acquired with [`FLUSH TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock).

  Prior to MySQL 5.7.19, [`FLUSH TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock) is not compatible with XA transactions.

  [`FLUSH TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock) does not prevent the server from inserting rows into the log tables (see [Section 5.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”](log-destinations.html "5.4.1 Selecting General Query Log and Slow Query Log Output Destinations")).

* [`FLUSH TABLES tbl_name [, tbl_name] ... WITH READ LOCK`](flush.html#flush-tables-with-read-lock-with-list)

  Flushes and acquires read locks for the named tables.

  Because this operation acquires table locks, it requires the [`LOCK TABLES`](privileges-provided.html#priv_lock-tables) privilege for each table, in addition to the [`RELOAD`](privileges-provided.html#priv_reload) privilege.

  The operation first acquires exclusive metadata locks for the tables, so it waits for transactions that have those tables open to complete. Then the operation flushes the tables from the table cache, reopens the tables, acquires table locks (like [`LOCK TABLES ... READ`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements")), and downgrades the metadata locks from exclusive to shared. After the operation acquires locks and downgrades the metadata locks, other sessions can read but not modify the tables.

  This operation applies only to existing base (non-`TEMPORARY)` tables. If a name refers to a base table, that table is used. If it refers to a `TEMPORARY` table, it is ignored. If a name applies to a view, an [`ER_WRONG_OBJECT`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_wrong_object) error occurs. Otherwise, an [`ER_NO_SUCH_TABLE`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_no_such_table) error occurs.

  Use [`UNLOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") to release the locks, [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") to release the locks and acquire other locks, or [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") to release the locks and begin a new transaction.

  This [`FLUSH TABLES`](flush.html#flush-tables) variant enables tables to be flushed and locked in a single operation. It provides a workaround for the restriction that [`FLUSH TABLES`](flush.html#flush-tables) is not permitted when there is an active [`LOCK TABLES ... READ`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements").

  This operation does not perform an implicit [`UNLOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements"), so an error results if you perform the operation while there is any active [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") or use it a second time without first releasing the locks acquired.

  If a flushed table was opened with [`HANDLER`](handler.html "13.2.4 HANDLER Statement"), the handler is implicitly flushed and loses its position.

* [`FLUSH TABLES tbl_name [, tbl_name] ... FOR EXPORT`](flush.html#flush-tables-for-export-with-list)

  This [`FLUSH TABLES`](flush.html#flush-tables) variant applies to `InnoDB` tables. It ensures that changes to the named tables have been flushed to disk so that binary table copies can be made while the server is running.

  Because the [`FLUSH TABLES ... FOR EXPORT`](flush.html#flush-tables-for-export-with-list) operation acquires locks on tables in preparation for exporting them, it requires the [`LOCK TABLES`](privileges-provided.html#priv_lock-tables) and [`SELECT`](privileges-provided.html#priv_select) privileges for each table, in addition to the [`RELOAD`](privileges-provided.html#priv_reload) privilege.

  The operation works like this:

  1. It acquires shared metadata locks for the named tables. The operation blocks as long as other sessions have active transactions that have modified those tables or hold table locks for them. When the locks have been acquired, the operation blocks transactions that attempt to update the tables, while permitting read-only operations to continue.

  2. It checks whether all storage engines for the tables support `FOR EXPORT`. If any do not, an [`ER_ILLEGAL_HA`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_illegal_ha) error occurs and the operation fails.

  3. The operation notifies the storage engine for each table to make the table ready for export. The storage engine must ensure that any pending changes are written to disk.

  4. The operation puts the session in lock-tables mode so that the metadata locks acquired earlier are not released when the `FOR EXPORT` operation completes.

  This operation applies only to existing base (non-`TEMPORARY`) tables. If a name refers to a base table, that table is used. If it refers to a `TEMPORARY` table, it is ignored. If a name applies to a view, an [`ER_WRONG_OBJECT`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_wrong_object) error occurs. Otherwise, an [`ER_NO_SUCH_TABLE`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_no_such_table) error occurs.

  `InnoDB` supports `FOR EXPORT` for tables that have their own [`.ibd` file](glossary.html#glos_ibd_file ".ibd file") file (that is, tables created with the [`innodb_file_per_table`](innodb-parameters.html#sysvar_innodb_file_per_table) setting enabled). `InnoDB` ensures when notified by the `FOR EXPORT` operation that any changes have been flushed to disk. This permits a binary copy of table contents to be made while the `FOR EXPORT` operation is in effect because the `.ibd` file is transaction consistent and can be copied while the server is running. `FOR EXPORT` does not apply to `InnoDB` system tablespace files, or to `InnoDB` tables that have `FULLTEXT` indexes.

  [`FLUSH TABLES ...FOR EXPORT`](flush.html#flush-tables-for-export-with-list) is supported for partitioned `InnoDB` tables.

  When notified by `FOR EXPORT`, `InnoDB` writes to disk certain kinds of data that is normally held in memory or in separate disk buffers outside the tablespace files. For each table, `InnoDB` also produces a file named `table_name.cfg` in the same database directory as the table. The `.cfg` file contains metadata needed to reimport the tablespace files later, into the same or different server.

  When the `FOR EXPORT` operation completes, `InnoDB` has flushed all [dirty pages](glossary.html#glos_dirty_page "dirty page") to the table data files. Any [change buffer](glossary.html#glos_change_buffer "change buffer") entries are merged prior to flushing. At this point, the tables are locked and quiescent: The tables are in a transactionally consistent state on disk and you can copy the `.ibd` tablespace files along with the corresponding `.cfg` files to get a consistent snapshot of those tables.

  For the procedure to reimport the copied table data into a MySQL instance, see [Section 14.6.1.3, “Importing InnoDB Tables”](innodb-table-import.html "14.6.1.3 Importing InnoDB Tables").

  After you are done with the tables, use [`UNLOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") to release the locks, [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") to release the locks and acquire other locks, or [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") to release the locks and begin a new transaction.

  While any of these statements is in effect within the session, attempts to use [`FLUSH TABLES ... FOR EXPORT`](flush.html#flush-tables-for-export-with-list) produce an error:

  ```sql
  FLUSH TABLES ... WITH READ LOCK
  FLUSH TABLES ... FOR EXPORT
  LOCK TABLES ... READ
  LOCK TABLES ... WRITE
  ```

  While [`FLUSH TABLES ... FOR EXPORT`](flush.html#flush-tables-for-export-with-list) is in effect within the session, attempts to use any of these statements produce an error:

  ```sql
  FLUSH TABLES WITH READ LOCK
  FLUSH TABLES ... WITH READ LOCK
  FLUSH TABLES ... FOR EXPORT
  ```
