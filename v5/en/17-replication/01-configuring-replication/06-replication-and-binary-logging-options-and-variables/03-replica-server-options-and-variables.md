#### 16.1.6.3 Replica Server Options and Variables

This section explains the server options and system variables that apply to replicas and contains the following:

* [Startup Options for Replicas](replication-options-replica.html#replication-optvars-slaves "Startup Options for Replicas")
* [Options for Logging Replica Status to Tables](replication-options-replica.html#replication-options-replica-log-tables "Options for Logging Replica Status to Tables")
* [System Variables Used on Replicas](replication-options-replica.html#replication-sysvars-slaves "System Variables Used on Replicas")

Specify the options either on the [command line](command-line-options.html "4.2.2.1 Using Options on the Command Line") or in an [option file](option-files.html "4.2.2.2 Using Option Files"). Many of the options can be set while the server is running by using the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement. Specify system variable values using [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment").

**Server ID.** On the source and each replica, you must set the [`server_id`](replication-options.html#sysvar_server_id) system variable to establish a unique replication ID in the range from 1 to 232 − 1. “Unique” means that each ID must be different from every other ID in use by any other source or replica in the replication topology. Example `my.cnf` file:

```sql
[mysqld]
server-id=3
```

##### Startup Options for Replicas

This section explains startup options for controlling replica servers. Many of these options can be set while the server is running by using the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement. Others, such as the `--replicate-*` options, can be set only when the replica server starts. Replication-related system variables are discussed later in this section.

* [`--log-warnings[=level]`](server-options.html#option_mysqld_log-warnings)

  <table frame="box" rules="all" summary="Properties for log-warnings"><tbody><tr><th>Command-Line Format</th> <td><code>--log-warnings[=#]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_log_warnings">log_warnings</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>2</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Note

  The [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity) system variable is preferred over, and should be used instead of, the [`--log-warnings`](server-options.html#option_mysqld_log-warnings) option or [`log_warnings`](server-system-variables.html#sysvar_log_warnings) system variable. For more information, see the descriptions of [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity) and [`log_warnings`](server-system-variables.html#sysvar_log_warnings). The [`--log-warnings`](server-options.html#option_mysqld_log-warnings) command-line option and [`log_warnings`](server-system-variables.html#sysvar_log_warnings) system variable are deprecated; expect them to be removed in a future MySQL release.

  Causes the server to record more messages to the error log about what it is doing. With respect to replication, the server generates warnings that it succeeded in reconnecting after a network or connection failure, and provides information about how each replication thread started. This variable is set to 2 by default. To disable it, set it to 0. The server logs messages about statements that are unsafe for statement-based logging if the value is greater than 0. Aborted connections and access-denied errors for new connection attempts are logged if the value is greater than

  1. See [Section B.3.2.9, “Communication Errors and Aborted Connections”](communication-errors.html "B.3.2.9 Communication Errors and Aborted Connections").

  Note

  The effects of this option are not limited to replication. It affects diagnostic messages across a spectrum of server activities.

* [`--master-info-file=file_name`](replication-options-replica.html#option_mysqld_master-info-file)

  <table frame="box" rules="all" summary="Properties for master-info-file"><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>

  The name to use for the file in which the replica records information about the source. The default name is `master.info` in the data directory. For information about the format of this file, see [Section 16.2.4.2, “Replication Metadata Repositories”](replica-logs-status.html "16.2.4.2 Replication Metadata Repositories").

* [`--master-retry-count=count`](replication-options-replica.html#option_mysqld_master-retry-count)

  <table frame="box" rules="all" summary="Properties for master-retry-count"><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>

  The number of times that the replica tries to reconnect to the source before giving up. The default value is 86400 times. A value of 0 means “infinite”, and the replica attempts to connect forever. Reconnection attempts are triggered when the replica reaches its connection timeout (specified by the [`slave_net_timeout`](replication-options-replica.html#sysvar_slave_net_timeout) system variable) without receiving data or a heartbeat signal from the source. Reconnection is attempted at intervals set by the `MASTER_CONNECT_RETRY` option of the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement (which defaults to every 60 seconds).

  This option is deprecated; expect it to be removed in a future MySQL release. Use the `MASTER_RETRY_COUNT` option of the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement instead.

* [`--max-relay-log-size=size`](replication-options-replica.html#option_mysqld_max-relay-log-size)

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_max_relay_log_size">max_relay_log_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code>4096</code></td> </tr></tbody></table>

  The size at which the server rotates relay log files automatically. If this value is nonzero, the relay log is rotated automatically when its size exceeds this value. If this value is zero (the default), the size at which relay log rotation occurs is determined by the value of [`max_binlog_size`](replication-options-binary-log.html#sysvar_max_binlog_size). For more information, see [Section 16.2.4.1, “The Relay Log”](replica-logs-relaylog.html "16.2.4.1 The Relay Log").

* [`--relay-log-purge={0|1}`](replication-options-replica.html#option_mysqld_relay-log-purge)

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_relay_log_purge">relay_log_purge</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Disable or enable automatic purging of relay logs as soon as they are no longer needed. The default value is 1 (enabled). This is a global variable that can be changed dynamically with `SET GLOBAL relay_log_purge = N`. Disabling purging of relay logs when enabling the [`--relay-log-recovery`](replication-options-replica.html#sysvar_relay_log_recovery) option puts data consistency at risk.

* [`--relay-log-space-limit=size`](replication-options-replica.html#option_mysqld_relay-log-space-limit)

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_relay_log_space_limit">relay_log_space_limit</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

  This option places an upper limit on the total size in bytes of all relay logs on the replica. A value of 0 means “no limit”. This is useful for a replica server host that has limited disk space. When the limit is reached, the replication I/O thread stops reading binary log events from the source until the replication SQL thread has caught up and deleted some unused relay logs. Note that this limit is not absolute: There are cases where the SQL thread needs more events before it can delete relay logs. In that case, the I/O thread exceeds the limit until it becomes possible for the SQL thread to delete some relay logs because not doing so would cause a deadlock. You should not set [`--relay-log-space-limit`](replication-options-replica.html#option_mysqld_relay-log-space-limit) to less than twice the value of [`--max-relay-log-size`](replication-options-replica.html#option_mysqld_max-relay-log-size) (or [`--max-binlog-size`](replication-options-binary-log.html#sysvar_max_binlog_size) if [`--max-relay-log-size`](replication-options-replica.html#option_mysqld_max-relay-log-size) is 0). In that case, there is a chance that the I/O thread waits for free space because [`--relay-log-space-limit`](replication-options-replica.html#option_mysqld_relay-log-space-limit) is exceeded, but the SQL thread has no relay log to purge and is unable to satisfy the I/O thread. This forces the I/O thread to ignore [`--relay-log-space-limit`](replication-options-replica.html#option_mysqld_relay-log-space-limit) temporarily.

* [`--replicate-do-db=db_name`](replication-options-replica.html#option_mysqld_replicate-do-db)

  <table frame="box" rules="all" summary="Properties for replicate-do-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Creates a replication filter using the name of a database. Such filters can also be created using [`CHANGE REPLICATION FILTER REPLICATE_DO_DB`](change-replication-filter.html "13.4.2.2 CHANGE REPLICATION FILTER Statement"). The precise effect of this filtering depends on whether statement-based or row-based replication is in use, and are described in the next several paragraphs.

  Important

  Replication filters cannot be used on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state.

  **Statement-based replication.** Tell the replication SQL thread to restrict replication to statements where the default database (that is, the one selected by [`USE`](use.html "13.8.4 USE Statement")) is *`db_name`*. To specify more than one database, use this option multiple times, once for each database; however, doing so does *not* replicate cross-database statements such as `UPDATE some_db.some_table SET foo='bar'` while a different database (or no database) is selected.

  Warning

  To specify multiple databases you *must* use multiple instances of this option. Because database names can contain commas, if you supply a comma separated list then the list is treated as the name of a single database.

  An example of what does not work as you might expect when using statement-based replication: If the replica is started with [`--replicate-do-db=sales`](replication-options-replica.html#option_mysqld_replicate-do-db) and you issue the following statements on the source, the [`UPDATE`](update.html "13.2.11 UPDATE Statement") statement is *not* replicated:

  ```sql
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

  The main reason for this “check just the default database” behavior is that it is difficult from the statement alone to know whether it should be replicated (for example, if you are using multiple-table [`DELETE`](delete.html "13.2.2 DELETE Statement") statements or multiple-table [`UPDATE`](update.html "13.2.11 UPDATE Statement") statements that act across multiple databases). It is also faster to check only the default database rather than all databases if there is no need.

  **Row-based replication.** Tells the replication SQL thread to restrict replication to database *`db_name`*. Only tables belonging to *`db_name`* are changed; the current database has no effect on this. Suppose that the replica is started with [`--replicate-do-db=sales`](replication-options-replica.html#option_mysqld_replicate-do-db) and row-based replication is in effect, and then the following statements are run on the source:

  ```sql
  USE prices;
  UPDATE sales.february SET amount=amount+100;
  ```

  The `february` table in the `sales` database on the replica is changed in accordance with the [`UPDATE`](update.html "13.2.11 UPDATE Statement") statement; this occurs whether or not the [`USE`](use.html "13.8.4 USE Statement") statement was issued. However, issuing the following statements on the source has no effect on the replica when using row-based replication and [`--replicate-do-db=sales`](replication-options-replica.html#option_mysqld_replicate-do-db):

  ```sql
  USE prices;
  UPDATE prices.march SET amount=amount-25;
  ```

  Even if the statement `USE prices` were changed to `USE sales`, the [`UPDATE`](update.html "13.2.11 UPDATE Statement") statement's effects would still not be replicated.

  Another important difference in how [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db) is handled in statement-based replication as opposed to row-based replication occurs with regard to statements that refer to multiple databases. Suppose that the replica is started with [`--replicate-do-db=db1`](replication-options-replica.html#option_mysqld_replicate-do-db), and the following statements are executed on the source:

  ```sql
  USE db1;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  If you are using statement-based replication, then both tables are updated on the replica. However, when using row-based replication, only `table1` is affected on the replica; since `table2` is in a different database, `table2` on the replica is not changed by the [`UPDATE`](update.html "13.2.11 UPDATE Statement"). Now suppose that, instead of the `USE db1` statement, a `USE db4` statement had been used:

  ```sql
  USE db4;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  In this case, the [`UPDATE`](update.html "13.2.11 UPDATE Statement") statement would have no effect on the replica when using statement-based replication. However, if you are using row-based replication, the [`UPDATE`](update.html "13.2.11 UPDATE Statement") would change `table1` on the replica, but not `table2`—in other words, only tables in the database named by [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db) are changed, and the choice of default database has no effect on this behavior.

  If you need cross-database updates to work, use [`--replicate-wild-do-table=db_name.%`](replication-options-replica.html#option_mysqld_replicate-wild-do-table) instead. See [Section 16.2.5, “How Servers Evaluate Replication Filtering Rules”](replication-rules.html "16.2.5 How Servers Evaluate Replication Filtering Rules").

  Note

  This option affects replication in the same manner that [`--binlog-do-db`](replication-options-binary-log.html#option_mysqld_binlog-do-db) affects binary logging, and the effects of the replication format on how [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db) affects replication behavior are the same as those of the logging format on the behavior of [`--binlog-do-db`](replication-options-binary-log.html#option_mysqld_binlog-do-db).

  This option has no effect on [`BEGIN`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), or [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") statements.

* [`--replicate-ignore-db=db_name`](replication-options-replica.html#option_mysqld_replicate-ignore-db)

  <table frame="box" rules="all" summary="Properties for replicate-ignore-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Creates a replication filter using the name of a database. Such filters can also be created using [`CHANGE REPLICATION FILTER REPLICATE_IGNORE_DB`](change-replication-filter.html "13.4.2.2 CHANGE REPLICATION FILTER Statement"). As with [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db), the precise effect of this filtering depends on whether statement-based or row-based replication is in use, and are described in the next several paragraphs.

  Important

  Replication filters cannot be used on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state.

  **Statement-based replication.** Tells the replication SQL thread not to replicate any statement where the default database (that is, the one selected by [`USE`](use.html "13.8.4 USE Statement")) is *`db_name`*.

  **Row-based replication.** Tells the replication SQL thread not to update any tables in the database *`db_name`*. The default database has no effect.

  When using statement-based replication, the following example does not work as you might expect. Suppose that the replica is started with [`--replicate-ignore-db=sales`](replication-options-replica.html#option_mysqld_replicate-ignore-db) and you issue the following statements on the source:

  ```sql
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

  The [`UPDATE`](update.html "13.2.11 UPDATE Statement") statement *is* replicated in such a case because [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db) applies only to the default database (determined by the [`USE`](use.html "13.8.4 USE Statement") statement). Because the `sales` database was specified explicitly in the statement, the statement has not been filtered. However, when using row-based replication, the [`UPDATE`](update.html "13.2.11 UPDATE Statement") statement's effects are *not* propagated to the replica, and the replica's copy of the `sales.january` table is unchanged; in this instance, [`--replicate-ignore-db=sales`](replication-options-replica.html#option_mysqld_replicate-ignore-db) causes *all* changes made to tables in the source's copy of the `sales` database to be ignored by the replica.

  To specify more than one database to ignore, use this option multiple times, once for each database. Because database names can contain commas, if you supply a comma separated list then the list is treated as the name of a single database.

  You should not use this option if you are using cross-database updates and you do not want these updates to be replicated. See [Section 16.2.5, “How Servers Evaluate Replication Filtering Rules”](replication-rules.html "16.2.5 How Servers Evaluate Replication Filtering Rules").

  If you need cross-database updates to work, use [`--replicate-wild-ignore-table=db_name.%`](replication-options-replica.html#option_mysqld_replicate-wild-ignore-table) instead. See [Section 16.2.5, “How Servers Evaluate Replication Filtering Rules”](replication-rules.html "16.2.5 How Servers Evaluate Replication Filtering Rules").

  Note

  This option affects replication in the same manner that [`--binlog-ignore-db`](replication-options-binary-log.html#option_mysqld_binlog-ignore-db) affects binary logging, and the effects of the replication format on how [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db) affects replication behavior are the same as those of the logging format on the behavior of [`--binlog-ignore-db`](replication-options-binary-log.html#option_mysqld_binlog-ignore-db).

  This option has no effect on [`BEGIN`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), or [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") statements.

* [`--replicate-do-table=db_name.tbl_name`](replication-options-replica.html#option_mysqld_replicate-do-table)

  <table frame="box" rules="all" summary="Properties for replicate-do-table"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Creates a replication filter by telling the replication SQL thread to restrict replication to a given table. To specify more than one table, use this option multiple times, once for each table. This works for both cross-database updates and default database updates, in contrast to [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db). See [Section 16.2.5, “How Servers Evaluate Replication Filtering Rules”](replication-rules.html "16.2.5 How Servers Evaluate Replication Filtering Rules"). You can also create such a filter by issuing a [`CHANGE REPLICATION FILTER REPLICATE_DO_TABLE`](change-replication-filter.html "13.4.2.2 CHANGE REPLICATION FILTER Statement") statement.

  Important

  Replication filters cannot be used on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state.

  This option affects only statements that apply to tables. It does not affect statements that apply only to other database objects, such as stored routines. To filter statements operating on stored routines, use one or more of the `--replicate-*-db` options.

* [`--replicate-ignore-table=db_name.tbl_name`](replication-options-replica.html#option_mysqld_replicate-ignore-table)

  <table frame="box" rules="all" summary="Properties for replicate-ignore-table"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Creates a replication filter by telling the replication SQL thread not to replicate any statement that updates the specified table, even if any other tables might be updated by the same statement. To specify more than one table to ignore, use this option multiple times, once for each table. This works for cross-database updates, in contrast to [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db). See [Section 16.2.5, “How Servers Evaluate Replication Filtering Rules”](replication-rules.html "16.2.5 How Servers Evaluate Replication Filtering Rules"). You can also create such a filter by issuing a [`CHANGE REPLICATION FILTER REPLICATE_IGNORE_TABLE`](change-replication-filter.html "13.4.2.2 CHANGE REPLICATION FILTER Statement") statement.

  Note

  Replication filters cannot be used on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state.

  This option affects only statements that apply to tables. It does not affect statements that apply only to other database objects, such as stored routines. To filter statements operating on stored routines, use one or more of the `--replicate-*-db` options.

* [`--replicate-rewrite-db=from_name->to_name`](replication-options-replica.html#option_mysqld_replicate-rewrite-db)

  <table frame="box" rules="all" summary="Properties for master-info-file"><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>0

  Tells the replica to create a replication filter that translates the specified database to *`to_name`* if it was *`from_name`* on the source. Only statements involving tables are affected, not statements such as [`CREATE DATABASE`](create-database.html "13.1.11 CREATE DATABASE Statement"), [`DROP DATABASE`](drop-database.html "13.1.22 DROP DATABASE Statement"), and [`ALTER DATABASE`](alter-database.html "13.1.1 ALTER DATABASE Statement").

  To specify multiple rewrites, use this option multiple times. The server uses the first one with a *`from_name`* value that matches. The database name translation is done *before* the `--replicate-*` rules are tested. You can also create such a filter by issuing a [`CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB`](change-replication-filter.html "13.4.2.2 CHANGE REPLICATION FILTER Statement") statement.

  If you use the [`--replicate-rewrite-db`](replication-options-replica.html#option_mysqld_replicate-rewrite-db) option on the command line and the `>` character is special to your command interpreter, quote the option value. For example:

  ```sql
  $> mysqld --replicate-rewrite-db="olddb->newdb"
  ```

  The effect of the [`--replicate-rewrite-db`](replication-options-replica.html#option_mysqld_replicate-rewrite-db) option differs depending on whether statement-based or row-based binary logging format is used for the query. With statement-based format, DML statements are translated based on the current database, as specified by the [`USE`](use.html "13.8.4 USE Statement") statement. With row-based format, DML statements are translated based on the database where the modified table exists. DDL statements are always filtered based on the current database, as specified by the [`USE`](use.html "13.8.4 USE Statement") statement, regardless of the binary logging format.

  To ensure that rewriting produces the expected results, particularly in combination with other replication filtering options, follow these recommendations when you use the [`--replicate-rewrite-db`](replication-options-replica.html#option_mysqld_replicate-rewrite-db) option:

  + Create the *`from_name`* and *`to_name`* databases manually on the source and the replica with different names.

  + If you use statement-based or mixed binary logging format, do not use cross-database queries, and do not specify database names in queries. For both DDL and DML statements, rely on the [`USE`](use.html "13.8.4 USE Statement") statement to specify the current database, and use only the table name in queries.

  + If you use row-based binary logging format exclusively, for DDL statements, rely on the [`USE`](use.html "13.8.4 USE Statement") statement to specify the current database, and use only the table name in queries. For DML statements, you can use a fully qualified table name (*`db`*.*`table`*) if you want.

  If these recommendations are followed, it is safe to use the [`--replicate-rewrite-db`](replication-options-replica.html#option_mysqld_replicate-rewrite-db) option in combination with table-level replication filtering options such as [`--replicate-do-table`](replication-options-replica.html#option_mysqld_replicate-do-table).

  Note

  Global replication filters cannot be used on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state.

* [`--replicate-same-server-id`](replication-options-replica.html#option_mysqld_replicate-same-server-id)

  <table frame="box" rules="all" summary="Properties for master-info-file"><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>1

  To be used on replica servers. Usually you should use the default setting of 0, to prevent infinite loops caused by circular replication. If set to 1, the replica does not skip events having its own server ID. Normally, this is useful only in rare configurations. Cannot be set to 1 if [`log_slave_updates`](replication-options-binary-log.html#sysvar_log_slave_updates) is enabled. By default, the replication I/O thread does not write binary log events to the relay log if they have the replica's server ID (this optimization helps save disk usage). If you want to use [`--replicate-same-server-id`](replication-options-replica.html#option_mysqld_replicate-same-server-id), be sure to start the replica with this option before you make the replica read its own events that you want the replication SQL thread to execute.

* [`--replicate-wild-do-table=db_name.tbl_name`](replication-options-replica.html#option_mysqld_replicate-wild-do-table)

  <table frame="box" rules="all" summary="Properties for master-info-file"><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>2

  Creates a replication filter by telling the replication SQL thread to restrict replication to statements where any of the updated tables match the specified database and table name patterns. Patterns can contain the `%` and `_` wildcard characters, which have the same meaning as for the [`LIKE`](string-comparison-functions.html#operator_like) pattern-matching operator. To specify more than one table, use this option multiple times, once for each table. This works for cross-database updates. See [Section 16.2.5, “How Servers Evaluate Replication Filtering Rules”](replication-rules.html "16.2.5 How Servers Evaluate Replication Filtering Rules"). You can also create such a filter by issuing a [`CHANGE REPLICATION FILTER REPLICATE_WILD_DO_TABLE`](change-replication-filter.html "13.4.2.2 CHANGE REPLICATION FILTER Statement") statement.

  Note

  Replication filters cannot be used on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state.

  This option applies to tables, views, and triggers. It does not apply to stored procedures and functions, or events. To filter statements operating on the latter objects, use one or more of the `--replicate-*-db` options.

  As an example, [`--replicate-wild-do-table=foo%.bar%`](replication-options-replica.html#option_mysqld_replicate-wild-do-table) replicates only updates that use a table where the database name starts with `foo` and the table name starts with `bar`.

  If the table name pattern is `%`, it matches any table name and the option also applies to database-level statements ([`CREATE DATABASE`](create-database.html "13.1.11 CREATE DATABASE Statement"), [`DROP DATABASE`](drop-database.html "13.1.22 DROP DATABASE Statement"), and [`ALTER DATABASE`](alter-database.html "13.1.1 ALTER DATABASE Statement")). For example, if you use [`--replicate-wild-do-table=foo%.%`](replication-options-replica.html#option_mysqld_replicate-wild-do-table), database-level statements are replicated if the database name matches the pattern `foo%`.

  Important

  Table-level replication filters are only applied to tables that are explicitly mentioned and operated on in the query. They do not apply to tables that are implicitly updated by the query. For example, a [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statement, which updates the `mysql.user` system table but does not mention that table, is not affected by a filter that specifies `mysql.%` as the wildcard pattern.

  To include literal wildcard characters in the database or table name patterns, escape them with a backslash. For example, to replicate all tables of a database that is named `my_own%db`, but not replicate tables from the `my1ownAABCdb` database, you should escape the `_` and `%` characters like this: [`--replicate-wild-do-table=my\_own\%db`](replication-options-replica.html#option_mysqld_replicate-wild-do-table). If you use the option on the command line, you might need to double the backslashes or quote the option value, depending on your command interpreter. For example, with the **bash** shell, you would need to type [`--replicate-wild-do-table=my\\_own\\%db`](replication-options-replica.html#option_mysqld_replicate-wild-do-table).

* [`--replicate-wild-ignore-table=db_name.tbl_name`](replication-options-replica.html#option_mysqld_replicate-wild-ignore-table)

  <table frame="box" rules="all" summary="Properties for master-info-file"><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>3

  Creates a replication filter which keeps the replication SQL thread from replicating a statement in which any table matches the given wildcard pattern. To specify more than one table to ignore, use this option multiple times, once for each table. This works for cross-database updates. See [Section 16.2.5, “How Servers Evaluate Replication Filtering Rules”](replication-rules.html "16.2.5 How Servers Evaluate Replication Filtering Rules"). You can also create such a filter by issuing a [`CHANGE REPLICATION FILTER REPLICATE_WILD_IGNORE_TABLE`](change-replication-filter.html "13.4.2.2 CHANGE REPLICATION FILTER Statement") statement.

  Important

  Replication filters cannot be used on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state.

  As an example, [`--replicate-wild-ignore-table=foo%.bar%`](replication-options-replica.html#option_mysqld_replicate-wild-ignore-table) does not replicate updates that use a table where the database name starts with `foo` and the table name starts with `bar`.

  For information about how matching works, see the description of the [`--replicate-wild-do-table`](replication-options-replica.html#option_mysqld_replicate-wild-do-table) option. The rules for including literal wildcard characters in the option value are the same as for [`--replicate-wild-ignore-table`](replication-options-replica.html#option_mysqld_replicate-wild-ignore-table) as well.

  Important

  Table-level replication filters are only applied to tables that are explicitly mentioned and operated on in the query. They do not apply to tables that are implicitly updated by the query. For example, a [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statement, which updates the `mysql.user` system table but does not mention that table, is not affected by a filter that specifies `mysql.%` as the wildcard pattern.

  If you need to filter out [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statements or other administrative statements, a possible workaround is to use the [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db) filter. This filter operates on the default database that is currently in effect, as determined by the [`USE`](use.html "13.8.4 USE Statement") statement. You can therefore create a filter to ignore statements for a database that is not replicated, then issue the [`USE`](use.html "13.8.4 USE Statement") statement to switch the default database to that one immediately before issuing any administrative statements that you want to ignore. In the administrative statement, name the actual database where the statement is applied.

  For example, if [`--replicate-ignore-db=nonreplicated`](replication-options-replica.html#option_mysqld_replicate-ignore-db) is configured on the replica server, the following sequence of statements causes the [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statement to be ignored, because the default database `nonreplicated` is in effect:

  ```sql
  USE nonreplicated;
  GRANT SELECT, INSERT ON replicated.t1 TO 'someuser'@'somehost';
  ```

* [`--skip-slave-start`](replication-options-replica.html#option_mysqld_skip-slave-start)

  <table frame="box" rules="all" summary="Properties for master-info-file"><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>4

  Tells the replica server not to start the replication threads when the server starts. To start the threads later, use a [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statement.

* [`--slave-skip-errors=[err_code1,err_code2,...|all|ddl_exist_errors]`](replication-options-replica.html#option_mysqld_slave-skip-errors)

  <table frame="box" rules="all" summary="Properties for master-info-file"><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>5

  Normally, replication stops when an error occurs on the replica, which gives you the opportunity to resolve the inconsistency in the data manually. This option causes the replication SQL thread to continue replication when a statement returns any of the errors listed in the option value.

  Do not use this option unless you fully understand why you are getting errors. If there are no bugs in your replication setup and client programs, and no bugs in MySQL itself, an error that stops replication should never occur. Indiscriminate use of this option results in replicas becoming hopelessly out of synchrony with the source, with you having no idea why this has occurred.

  For error codes, you should use the numbers provided by the error message in the replica's error log and in the output of [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement"). [Appendix B, *Error Messages and Common Problems*](error-handling.html "Appendix B Error Messages and Common Problems"), lists server error codes.

  The shorthand value `ddl_exist_errors` is equivalent to the error code list `1007,1008,1050,1051,1054,1060,1061,1068,1091,1146`.

  You can also (but should not) use the very nonrecommended value of `all` to cause the replica to ignore all error messages and keeps going regardless of what happens. Needless to say, if you use `all`, there are no guarantees regarding the integrity of your data. Please do not complain (or file bug reports) in this case if the replica's data is not anywhere close to what it is on the source. *You have been warned*.

  This option does not work in the same way when replicating between NDB Clusters, due to the internal [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") mechanism for checking epoch sequence numbers; as soon as `NDB` detects an epoch number that is missing or otherwise out of sequence, it immediately stops the replica applier thread.

  Examples:

  ```sql
  --slave-skip-errors=1062,1053
  --slave-skip-errors=all
  --slave-skip-errors=ddl_exist_errors
  ```

* [`--slave-sql-verify-checksum={0|1}`](replication-options-replica.html#option_mysqld_slave-sql-verify-checksum)

  <table frame="box" rules="all" summary="Properties for master-info-file"><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>6

  When this option is enabled, the replica examines checksums read from the relay log,. In the event of a mismatch, the replica stops with an error.

The following options are used internally by the MySQL test suite for replication testing and debugging. They are not intended for use in a production setting.

* [`--abort-slave-event-count`](replication-options-replica.html#option_mysqld_abort-slave-event-count)

  <table frame="box" rules="all" summary="Properties for master-info-file"><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>7

  When this option is set to some positive integer *`value`* other than 0 (the default) it affects replication behavior as follows: After the replication SQL thread has started, *`value`* log events are permitted to be executed; after that, the replication SQL thread does not receive any more events, just as if the network connection from the source were cut. The replication SQL thread continues to run, and the output from [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") displays `Yes` in both the `Slave_IO_Running` and the `Slave_SQL_Running` columns, but no further events are read from the relay log.

  This option is used internally by the MySQL test suite for replication testing and debugging. It is not intended for use in a production setting.

* [`--disconnect-slave-event-count`](replication-options-replica.html#option_mysqld_disconnect-slave-event-count)

  <table frame="box" rules="all" summary="Properties for master-info-file"><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>8

  This option is used internally by the MySQL test suite for replication testing and debugging. It is not intended for use in a production setting.

##### Options for Logging Replica Status to Tables

MySQL 5.7 supports logging of replication metadata to tables rather than files. Writing of the replica's connection metadata repository and applier metadata repository can be configured separately using these two system variables:

* [`master_info_repository`](replication-options-replica.html#sysvar_master_info_repository)
* [`relay_log_info_repository`](replication-options-replica.html#sysvar_relay_log_info_repository)

For information about these variables, see [Section 16.1.6.3, “Replica Server Options and Variables”](replication-options-replica.html "16.1.6.3 Replica Server Options and Variables").

These variables can be used to make a replica resilient to unexpected halts. See [Section 16.3.2, “Handling an Unexpected Halt of a Replica”](replication-solutions-unexpected-replica-halt.html "16.3.2 Handling an Unexpected Halt of a Replica"), for more information.

The info log tables and their contents are considered local to a given MySQL Server. They are not replicated, and changes to them are not written to the binary log.

For more information, see [Section 16.2.4, “Relay Log and Replication Metadata Repositories”](replica-logs.html "16.2.4 Relay Log and Replication Metadata Repositories").

##### System Variables Used on Replicas

The following list describes system variables for controlling replica servers. They can be set at server startup and some of them can be changed at runtime using [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment"). Server options used with replicas are listed earlier in this section.

* [`init_slave`](replication-options-replica.html#sysvar_init_slave)

  <table frame="box" rules="all" summary="Properties for master-info-file"><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>9

  This variable is similar to [`init_connect`](server-system-variables.html#sysvar_init_connect), but is a string to be executed by a replica server each time the replication SQL thread starts. The format of the string is the same as for the [`init_connect`](server-system-variables.html#sysvar_init_connect) variable. The setting of this variable takes effect for subsequent [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statements.

  Note

  The replication SQL thread sends an acknowledgment to the client before it executes [`init_slave`](replication-options-replica.html#sysvar_init_slave). Therefore, it is not guaranteed that [`init_slave`](replication-options-replica.html#sysvar_init_slave) has been executed when [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") returns. See [Section 13.4.2.5, “START SLAVE Statement”](start-slave.html "13.4.2.5 START SLAVE Statement"), for more information.

* [`log_slow_slave_statements`](replication-options-replica.html#sysvar_log_slow_slave_statements)

  <table frame="box" rules="all" summary="Properties for master-retry-count"><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>0

  When the slow query log is enabled, this variable enables logging for queries that have taken more than [`long_query_time`](server-system-variables.html#sysvar_long_query_time) seconds to execute on the replica. Note that if row-based replication is in use ([`binlog_format=ROW`](replication-options-binary-log.html#sysvar_binlog_format)), [`log_slow_slave_statements`](replication-options-replica.html#sysvar_log_slow_slave_statements) has no effect. Queries are only added to the replica's slow query log when they are logged in statement format in the binary log, that is, when [`binlog_format=STATEMENT`](replication-options-binary-log.html#sysvar_binlog_format) is set, or when [`binlog_format=MIXED`](replication-options-binary-log.html#sysvar_binlog_format) is set and the statement is logged in statement format. Slow queries that are logged in row format when [`binlog_format=MIXED`](replication-options-binary-log.html#sysvar_binlog_format) is set, or that are logged when [`binlog_format=ROW`](replication-options-binary-log.html#sysvar_binlog_format) is set, are not added to the replica's slow query log, even if [`log_slow_slave_statements`](replication-options-replica.html#sysvar_log_slow_slave_statements) is enabled.

  Setting [`log_slow_slave_statements`](replication-options-replica.html#sysvar_log_slow_slave_statements) has no immediate effect. The state of the variable applies on all subsequent [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statements. Also note that the global setting for [`long_query_time`](server-system-variables.html#sysvar_long_query_time) applies for the lifetime of the SQL thread. If you change that setting, you must stop and restart the replication SQL thread to implement the change there (for example, by issuing [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") and [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statements with the `SQL_THREAD` option).

* [`master_info_repository`](replication-options-replica.html#sysvar_master_info_repository)

  <table frame="box" rules="all" summary="Properties for master-retry-count"><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>1

  The setting of this variable determines whether the replica records metadata about the source, consisting of status and connection information, to an `InnoDB` table in the `mysql` system database, or as a file in the data directory. For more information on the connection metadata repository, see [Section 16.2.4, “Relay Log and Replication Metadata Repositories”](replica-logs.html "16.2.4 Relay Log and Replication Metadata Repositories").

  The default setting is `FILE`. As a file, the replica's connection metadata repository is named `master.info` by default. You can change this name using the [`--master-info-file`](replication-options-replica.html#option_mysqld_master-info-file) option.

  The alternative setting is `TABLE`. As an `InnoDB` table, the replica's connection metadata repository is named `mysql.slave_master_info`. The `TABLE` setting is required when multiple replication channels are configured.

  This variable must be set to `TABLE` before configuring multiple replication channels. If you are using multiple replication channels, you cannot set the value back to `FILE`.

  The setting for the location of the connection metadata repository has a direct influence on the effect had by the setting of the [`sync_master_info`](replication-options-replica.html#sysvar_sync_master_info) system variable. You can change the setting only when no replication threads are executing.

* [`max_relay_log_size`](replication-options-replica.html#sysvar_max_relay_log_size)

  <table frame="box" rules="all" summary="Properties for master-retry-count"><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>2

  If a write by a replica to its relay log causes the current log file size to exceed the value of this variable, the replica rotates the relay logs (closes the current file and opens the next one). If [`max_relay_log_size`](replication-options-replica.html#sysvar_max_relay_log_size) is 0, the server uses [`max_binlog_size`](replication-options-binary-log.html#sysvar_max_binlog_size) for both the binary log and the relay log. If [`max_relay_log_size`](replication-options-replica.html#sysvar_max_relay_log_size) is greater than 0, it constrains the size of the relay log, which enables you to have different sizes for the two logs. You must set [`max_relay_log_size`](replication-options-replica.html#sysvar_max_relay_log_size) to between 4096 bytes and 1GB (inclusive), or to 0. The default value is 0. See [Section 16.2.3, “Replication Threads”](replication-threads.html "16.2.3 Replication Threads").

* [`relay_log`](replication-options-replica.html#sysvar_relay_log)

  <table frame="box" rules="all" summary="Properties for master-retry-count"><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>3

  The base name for relay log files. For the default replication channel, the default base name for relay logs is `host_name-relay-bin`. For non-default replication channels, the default base name for relay logs is `host_name-relay-bin-channel`, where *`channel`* is the name of the replication channel recorded in this relay log.

  The server writes the file in the data directory unless the base name is given with a leading absolute path name to specify a different directory. The server creates relay log files in sequence by adding a numeric suffix to the base name.

  Due to the manner in which MySQL parses server options, if you specify this variable at server startup, you must supply a value; *the default base name is used only if the option is not actually specified*. If you specify the [`relay_log`](replication-options-replica.html#sysvar_relay_log) system variable at server startup without specifying a value, unexpected behavior is likely to result; this behavior depends on the other options used, the order in which they are specified, and whether they are specified on the command line or in an option file. For more information about how MySQL handles server options, see [Section 4.2.2, “Specifying Program Options”](program-options.html "4.2.2 Specifying Program Options").

  If you specify this variable, the value specified is also used as the base name for the relay log index file. You can override this behavior by specifying a different relay log index file base name using the [`relay_log_index`](replication-options-replica.html#sysvar_relay_log_index) system variable.

  When the server reads an entry from the index file, it checks whether the entry contains a relative path. If it does, the relative part of the path is replaced with the absolute path set using the [`relay_log`](replication-options-replica.html#sysvar_relay_log) system variable. An absolute path remains unchanged; in such a case, the index must be edited manually to enable the new path or paths to be used.

  You may find the [`relay_log`](replication-options-replica.html#sysvar_relay_log) system variable useful in performing the following tasks:

  + Creating relay logs whose names are independent of host names.

  + If you need to put the relay logs in some area other than the data directory because your relay logs tend to be very large and you do not want to decrease [`max_relay_log_size`](replication-options-replica.html#sysvar_max_relay_log_size).

  + To increase speed by using load-balancing between disks.

  You can obtain the relay log file name (and path) from the [`relay_log_basename`](replication-options-replica.html#sysvar_relay_log_basename) system variable.

* [`relay_log_basename`](replication-options-replica.html#sysvar_relay_log_basename)

  <table frame="box" rules="all" summary="Properties for master-retry-count"><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>4

  Holds the base name and complete path to the relay log file. The maximum variable length is 256. This variable is set by the server and is read only.

* [`relay_log_index`](replication-options-replica.html#sysvar_relay_log_index)

  <table frame="box" rules="all" summary="Properties for master-retry-count"><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>5

  The name for the relay log index file. The maximum variable length is 256. For the default replication channel, the default name is `host_name-relay-bin.index`. For non-default replication channels, the default name is `host_name-relay-bin-channel.index`, where *`channel`* is the name of the replication channel recorded in this relay log index.

  The server writes the file in the data directory unless the name is given with a leading absolute path name to specify a different directory. name.

  Due to the manner in which MySQL parses server options, if you specify this variable at server startup, you must supply a value; *the default base name is used only if the option is not actually specified*. If you specify the [`relay_log_index`](replication-options-replica.html#sysvar_relay_log_index) system variable at server startup without specifying a value, unexpected behavior is likely to result; this behavior depends on the other options used, the order in which they are specified, and whether they are specified on the command line or in an option file. For more information about how MySQL handles server options, see [Section 4.2.2, “Specifying Program Options”](program-options.html "4.2.2 Specifying Program Options").

* [`relay_log_info_file`](replication-options-replica.html#sysvar_relay_log_info_file)

  <table frame="box" rules="all" summary="Properties for master-retry-count"><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>6

  The name of the file in which the replica records information about the relay logs, when [`relay_log_info_repository=FILE`](replication-options-replica.html#sysvar_relay_log_info_repository). If [`relay_log_info_repository=TABLE`](replication-options-replica.html#sysvar_relay_log_info_repository), it is the file name that would be used in case the repository was changed to `FILE`). The default name is `relay-log.info` in the data directory. For information about the applier metadata repository, see [Section 16.2.4.2, “Replication Metadata Repositories”](replica-logs-status.html "16.2.4.2 Replication Metadata Repositories").

* [`relay_log_info_repository`](replication-options-replica.html#sysvar_relay_log_info_repository)

  <table frame="box" rules="all" summary="Properties for master-retry-count"><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>7

  The setting of this variable determines whether the replica server stores its applier metadata repository as an `InnoDB` table in the `mysql` system database, or as a file in the data directory. For more information on the applier metadata repository, see [Section 16.2.4, “Relay Log and Replication Metadata Repositories”](replica-logs.html "16.2.4 Relay Log and Replication Metadata Repositories").

  The default setting is `FILE`. As a file, the replica's applier metadata repository is named `relay-log.info` by default, and you can change this name using the [`relay_log_info_file`](replication-options-replica.html#sysvar_relay_log_info_file) system variable.

  With the setting `TABLE`, as an `InnoDB` table, the replica's applier metadata repository is named `mysql.slave_relay_log_info`. The `TABLE` setting is required when multiple replication channels are configured. The `TABLE` setting for the replica's applier metadata repository is also required to make replication resilient to unexpected halts. See [Section 16.3.2, “Handling an Unexpected Halt of a Replica”](replication-solutions-unexpected-replica-halt.html "16.3.2 Handling an Unexpected Halt of a Replica") for more information.

  This variable must be set to `TABLE` before configuring multiple replication channels. If you are using multiple replication channels then you cannot set the value back to `FILE`.

  The setting for the location of the applier metadata repository has a direct influence on the effect had by the setting of the [`sync_relay_log_info`](replication-options-replica.html#sysvar_sync_relay_log_info) system variable. You can change the setting only when no replication threads are executing.

* [`relay_log_purge`](replication-options-replica.html#sysvar_relay_log_purge)

  <table frame="box" rules="all" summary="Properties for master-retry-count"><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>8

  Disables or enables automatic purging of relay log files as soon as they are not needed any more. The default value is 1 (`ON`).

* [`relay_log_recovery`](replication-options-replica.html#sysvar_relay_log_recovery)

  <table frame="box" rules="all" summary="Properties for master-retry-count"><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>9

  If enabled, this variable enables automatic relay log recovery immediately following server startup. The recovery process creates a new relay log file, initializes the SQL thread position to this new relay log, and initializes the I/O thread to the SQL thread position. Reading of the relay log from the source then continues.

  This global variable is read-only at runtime. Its value can be set with the [`--relay-log-recovery`](replication-options-replica.html#sysvar_relay_log_recovery) option at replica server startup, which should be used following an unexpected halt of a replica to ensure that no possibly corrupted relay logs are processed, and must be used in order to guarantee a crash-safe replica. The default value is 0 (disabled). For information on the combination of settings on a replica that is most resilient to unexpected halts, see [Section 16.3.2, “Handling an Unexpected Halt of a Replica”](replication-solutions-unexpected-replica-halt.html "16.3.2 Handling an Unexpected Halt of a Replica").

  This variable also interacts with the [`relay_log_purge`](replication-options-replica.html#sysvar_relay_log_purge) variable, which controls purging of logs when they are no longer needed. Enabling [`relay_log_recovery`](replication-options-replica.html#sysvar_relay_log_recovery) when [`relay_log_purge`](replication-options-replica.html#sysvar_relay_log_purge) is disabled risks reading the relay log from files that were not purged, leading to data inconsistency.

  For a multithreaded replica (where [`slave_parallel_workers`](replication-options-replica.html#sysvar_slave_parallel_workers) is greater than 0), from MySQL 5.7.13, setting [`relay_log_recovery = ON`](replication-options-replica.html#sysvar_relay_log_recovery) automatically handles any inconsistencies and gaps in the sequence of transactions that have been executed from the relay log. These gaps can occur when file position based replication is in use. (For more details, see [Section 16.4.1.32, “Replication and Transaction Inconsistencies”](replication-features-transaction-inconsistencies.html "16.4.1.32 Replication and Transaction Inconsistencies").) The relay log recovery process deals with gaps using the same method as the [`START SLAVE UNTIL SQL_AFTER_MTS_GAPS`](start-slave.html "13.4.2.5 START SLAVE Statement") statement would. When the replica reaches a consistent gap-free state, the relay log recovery process goes on to fetch further transactions from the source beginning at the replication SQL thread position. In MySQL versions prior to MySQL 5.7.13, this process was not automatic and required starting the server with [`relay_log_recovery=0`](replication-options-replica.html#sysvar_relay_log_recovery), starting the replica with [`START SLAVE UNTIL SQL_AFTER_MTS_GAPS`](start-slave.html "13.4.2.5 START SLAVE Statement") to fix any transaction inconsistencies, and then restarting the replica with [`relay_log_recovery=1`](replication-options-replica.html#sysvar_relay_log_recovery). When GTID-based replication is in use, from MySQL 5.7.28 a multithreaded replica checks first whether `MASTER_AUTO_POSITION` is set to `ON`, and if it is, omits the step of calculating the transactions that should be skipped or not skipped, so that the old relay logs are not required for the recovery process.

  Note

  This variable does not affect the following Group Replication channels:

  + `group_replication_applier`
  + `group_replication_recovery`

  Any other channels running on a group are affected, such as a channel which is replicating from an outside source or another group.

* [`relay_log_space_limit`](replication-options-replica.html#sysvar_relay_log_space_limit)

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_max_relay_log_size">max_relay_log_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code>4096</code></td> </tr></tbody></table>0

  The maximum amount of space to use for all relay logs.

* [`replication_optimize_for_static_plugin_config`](replication-options-replica.html#sysvar_replication_optimize_for_static_plugin_config)

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_max_relay_log_size">max_relay_log_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code>4096</code></td> </tr></tbody></table>1

  Use shared locks, and avoid unnecessary lock acquisitions, to improve performance for semisynchronous replication. While this system variable is enabled, the semisynchronous replication plugin cannot be uninstalled, so you must disable the system variable before the uninstall can complete.

  This system variable can be enabled before or after installing the semisynchronous replication plugin, and can be enabled while replication is running. Semisynchronous replication source servers can also get performance benefits from enabling this system variable, because they use the same locking mechanisms as the replicas.

  [`replication_optimize_for_static_plugin_config`](replication-options-replica.html#sysvar_replication_optimize_for_static_plugin_config) can be enabled when Group Replication is in use on a server. In that scenario, it might benefit performance when there is contention for locks due to high workloads.

* [`replication_sender_observe_commit_only`](replication-options-replica.html#sysvar_replication_sender_observe_commit_only)

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_max_relay_log_size">max_relay_log_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code>4096</code></td> </tr></tbody></table>2

  Limit callbacks to improve performance for semisynchronous replication. This system variable can be enabled before or after installing the semisynchronous replication plugin, and can be enabled while replication is running. Semisynchronous replication source servers can also get performance benefits from enabling this system variable, because they use the same locking mechanisms as the replicas.

* [`report_host`](replication-options-replica.html#sysvar_report_host)

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_max_relay_log_size">max_relay_log_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code>4096</code></td> </tr></tbody></table>3

  The host name or IP address of the replica to be reported to the source during replica registration. This value appears in the output of [`SHOW SLAVE HOSTS`](show-slave-hosts.html "13.7.5.33 SHOW SLAVE HOSTS Statement") on the source server. Leave the value unset if you do not want the replica to register itself with the source.

  Note

  It is not sufficient for the source to simply read the IP address of the replica from the TCP/IP socket after the replica connects. Due to NAT and other routing issues, that IP may not be valid for connecting to the replica from the source or other hosts.

* [`report_password`](replication-options-replica.html#sysvar_report_password)

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_max_relay_log_size">max_relay_log_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code>4096</code></td> </tr></tbody></table>4

  The replication user account password of the replica to be reported to the source during replica registration. This value appears in the output of [`SHOW SLAVE HOSTS`](show-slave-hosts.html "13.7.5.33 SHOW SLAVE HOSTS Statement") on the source server if the source was started with [`--show-slave-auth-info`](replication-options-source.html#option_mysqld_show-slave-auth-info).

  Although the name of this variable might imply otherwise, [`report_password`](replication-options-replica.html#sysvar_report_password) is not connected to the MySQL user privilege system and so is not necessarily (or even likely to be) the same as the password for the MySQL replication user account.

* [`report_port`](replication-options-replica.html#sysvar_report_port)

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_max_relay_log_size">max_relay_log_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code>4096</code></td> </tr></tbody></table>5

  The TCP/IP port number for connecting to the replica, to be reported to the source during replica registration. Set this only if the replica is listening on a nondefault port or if you have a special tunnel from the source or other clients to the replica. If you are not sure, do not use this option.

  The default value for this option is the port number actually used by the replica. This is also the default value displayed by [`SHOW SLAVE HOSTS`](show-slave-hosts.html "13.7.5.33 SHOW SLAVE HOSTS Statement").

* [`report_user`](replication-options-replica.html#sysvar_report_user)

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_max_relay_log_size">max_relay_log_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code>4096</code></td> </tr></tbody></table>6

  The account user name of the replica to be reported to the source during replica registration. This value appears in the output of [`SHOW SLAVE HOSTS`](show-slave-hosts.html "13.7.5.33 SHOW SLAVE HOSTS Statement") on the source server if the source was started with [`--show-slave-auth-info`](replication-options-source.html#option_mysqld_show-slave-auth-info).

  Although the name of this variable might imply otherwise, [`report_user`](replication-options-replica.html#sysvar_report_user) is not connected to the MySQL user privilege system and so is not necessarily (or even likely to be) the same as the name of the MySQL replication user account.

* [`rpl_semi_sync_slave_enabled`](replication-options-replica.html#sysvar_rpl_semi_sync_slave_enabled)

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_max_relay_log_size">max_relay_log_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code>4096</code></td> </tr></tbody></table>7

  Controls whether semisynchronous replication is enabled on the replica. To enable or disable the plugin, set this variable to `ON` or `OFF` (or 1 or 0), respectively. The default is `OFF`.

  This variable is available only if the replica-side semisynchronous replication plugin is installed.

* [`rpl_semi_sync_slave_trace_level`](replication-options-replica.html#sysvar_rpl_semi_sync_slave_trace_level)

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_max_relay_log_size">max_relay_log_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code>4096</code></td> </tr></tbody></table>8

  The semisynchronous replication debug trace level on the replica. See [`rpl_semi_sync_master_trace_level`](replication-options-source.html#sysvar_rpl_semi_sync_master_trace_level) for the permissible values.

  This variable is available only if the replica-side semisynchronous replication plugin is installed.

* [`rpl_stop_slave_timeout`](replication-options-replica.html#sysvar_rpl_stop_slave_timeout)

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_max_relay_log_size">max_relay_log_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code>4096</code></td> </tr></tbody></table>9

  You can control the length of time (in seconds) that [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") waits before timing out by setting this variable. This can be used to avoid deadlocks between `STOP SLAVE` and other SQL statements using different client connections to the replica.

  The maximum and default value of `rpl_stop_slave_timeout` is 31536000 seconds (1 year). The minimum is 2 seconds. Changes to this variable take effect for subsequent [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") statements.

  This variable affects only the client that issues a `STOP SLAVE` statement. When the timeout is reached, the issuing client returns an error message stating that the command execution is incomplete. The client then stops waiting for the replication threads to stop, but the replication threads continue to try to stop, and the `STOP SLAVE` instruction remains in effect. Once the replication threads are no longer busy, the `STOP SLAVE` statement is executed and the replica stops.

* [`slave_checkpoint_group`](replication-options-replica.html#sysvar_slave_checkpoint_group)

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_relay_log_purge">relay_log_purge</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>0

  Sets the maximum number of transactions that can be processed by a multithreaded replica before a checkpoint operation is called to update its status as shown by [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement"). Setting this variable has no effect on replicas for which multithreading is not enabled. Setting this variable has no immediate effect. The state of the variable applies on all subsequent [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") commands.

  Note

  Multithreaded replicas are not currently supported by NDB Cluster, which silently ignores the setting for this variable. See [Section 21.7.3, “Known Issues in NDB Cluster Replication”](mysql-cluster-replication-issues.html "21.7.3 Known Issues in NDB Cluster Replication"), for more information.

  This variable works in combination with the [`slave_checkpoint_period`](replication-options-replica.html#sysvar_slave_checkpoint_period) system variable in such a way that, when either limit is exceeded, the checkpoint is executed and the counters tracking both the number of transactions and the time elapsed since the last checkpoint are reset.

  The minimum allowed value for this variable is 32, unless the server was built using [`-DWITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug), in which case the minimum value is 1. The effective value is always a multiple of 8; you can set it to a value that is not such a multiple, but the server rounds it down to the next lower multiple of 8 before storing the value. (*Exception*: No such rounding is performed by the debug server.) Regardless of how the server was built, the default value is 512, and the maximum allowed value is 524280.

* [`slave_checkpoint_period`](replication-options-replica.html#sysvar_slave_checkpoint_period)

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_relay_log_purge">relay_log_purge</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>1

  Sets the maximum time (in milliseconds) that is allowed to pass before a checkpoint operation is called to update the status of a multithreaded replica as shown by [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement"). Setting this variable has no effect on replicas for which multithreading is not enabled. Setting this variable takes effect for all replication channels immediately, including running channels.

  Note

  Multithreaded replicas are not currently supported by NDB Cluster, which silently ignores the setting for this variable. See [Section 21.7.3, “Known Issues in NDB Cluster Replication”](mysql-cluster-replication-issues.html "21.7.3 Known Issues in NDB Cluster Replication"), for more information.

  This variable works in combination with the [`slave_checkpoint_group`](replication-options-replica.html#sysvar_slave_checkpoint_group) system variable in such a way that, when either limit is exceeded, the checkpoint is executed and the counters tracking both the number of transactions and the time elapsed since the last checkpoint are reset.

  The minimum allowed value for this variable is 1, unless the server was built using [`-DWITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug), in which case the minimum value is 0. Regardless of how the server was built, the default value is 300 milliseconds, and the maximum possible value is 4294967295 milliseconds (approximately 49.7 days).

* [`slave_compressed_protocol`](replication-options-replica.html#sysvar_slave_compressed_protocol)

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_relay_log_purge">relay_log_purge</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>2

  Whether to use compression of the source/replica protocol if both source and replica support it. If this variable is disabled (the default), connections are uncompressed. Changes to this variable take effect on subsequent connection attempts; this includes after issuing a [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statement, as well as reconnections made by a running replication I/O thread (for example, after setting the `MASTER_RETRY_COUNT` option for the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement). See also [Section 4.2.6, “Connection Compression Control”](connection-compression-control.html "4.2.6 Connection Compression Control").

* [`slave_exec_mode`](replication-options-replica.html#sysvar_slave_exec_mode)

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_relay_log_purge">relay_log_purge</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>3

  Controls how a replication thread resolves conflicts and errors during replication. `IDEMPOTENT` mode causes suppression of duplicate-key and no-key-found errors; `STRICT` means no such suppression takes place.

  `IDEMPOTENT` mode is intended for use in multi-source replication, circular replication, and some other special replication scenarios for NDB Cluster Replication. (See [Section 21.7.10, “NDB Cluster Replication: Bidirectional and Circular Replication”](mysql-cluster-replication-multi-source.html "21.7.10 NDB Cluster Replication: Bidirectional and Circular Replication"), and [Section 21.7.11, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "21.7.11 NDB Cluster Replication Conflict Resolution"), for more information.) NDB Cluster ignores any value explicitly set for [`slave_exec_mode`](replication-options-replica.html#sysvar_slave_exec_mode), and always treats it as `IDEMPOTENT`.

  In MySQL Server 5.7, `STRICT` mode is the default value.

  For storage engines other than [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), *`IDEMPOTENT` mode should be used only when you are absolutely sure that duplicate-key errors and key-not-found errors can safely be ignored*. It is meant to be used in fail-over scenarios for NDB Cluster where multi-source replication or circular replication is employed, and is not recommended for use in other cases.

* [`slave_load_tmpdir`](replication-options-replica.html#sysvar_slave_load_tmpdir)

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_relay_log_purge">relay_log_purge</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>4

  The name of the directory where the replica creates temporary files. Setting this variable takes effect for all replication channels immediately, including running channels. The variable value is by default equal to the value of the [`tmpdir`](server-system-variables.html#sysvar_tmpdir) system variable, or the default that applies when that system variable is not specified.

  When the replication SQL thread replicates a [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") statement, it extracts the file to be loaded from the relay log into temporary files, and then loads these into the table. If the file loaded on the source is huge, the temporary files on the replica are huge, too. Therefore, it might be advisable to use this option to tell the replica to put temporary files in a directory located in some file system that has a lot of available space. In that case, the relay logs are huge as well, so you might also want to set the [`relay_log`](replication-options-replica.html#sysvar_relay_log) system variable to place the relay logs in that file system.

  The directory specified by this option should be located in a disk-based file system (not a memory-based file system) so that the temporary files used to replicate [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") statements can survive machine restarts. The directory also should not be one that is cleared by the operating system during the system startup process. However, replication can now continue after a restart if the temporary files have been removed.

* [`slave_max_allowed_packet`](replication-options-replica.html#sysvar_slave_max_allowed_packet)

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_relay_log_purge">relay_log_purge</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>5

  This variable sets the maximum packet size for the replication SQL and I/O threads, so that large updates using row-based replication do not cause replication to fail because an update exceeded [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet). Setting this variable takes effect for all replication channels immediately, including running channels.

  This global variable always has a value that is a positive integer multiple of 1024; if you set it to some value that is not, the value is rounded down to the next highest multiple of 1024 for it is stored or used; setting `slave_max_allowed_packet` to 0 causes 1024 to be used. (A truncation warning is issued in all such cases.) The default and maximum value is 1073741824 (1 GB); the minimum is 1024.

* [`slave_net_timeout`](replication-options-replica.html#sysvar_slave_net_timeout)

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_relay_log_purge">relay_log_purge</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>6

  The number of seconds to wait for more data or a heartbeat signal from the source before the replica considers the connection broken, aborts the read, and tries to reconnect. Setting this variable has no immediate effect. The state of the variable applies on all subsequent [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") commands.

  The first retry occurs immediately after the timeout. The interval between retries is controlled by the `MASTER_CONNECT_RETRY` option for the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement, and the number of reconnection attempts is limited by the `MASTER_RETRY_COUNT` option for the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement.

  The heartbeat interval, which stops the connection timeout occurring in the absence of data if the connection is still good, is controlled by the `MASTER_HEARTBEAT_PERIOD` option for the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement. The heartbeat interval defaults to half the value of [`slave_net_timeout`](replication-options-replica.html#sysvar_slave_net_timeout), and it is recorded in the replica's connection metadata repository and shown in the [`replication_connection_configuration`](performance-schema-replication-connection-configuration-table.html "25.12.11.1 The replication_connection_configuration Table") Performance Schema table. Note that a change to the value or default setting of [`slave_net_timeout`](replication-options-replica.html#sysvar_slave_net_timeout) does not automatically change the heartbeat interval, whether that has been set explicitly or is using a previously calculated default. If the connection timeout is changed, you must also issue [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") to adjust the heartbeat interval to an appropriate value so that it occurs before the connection timeout.

* [`slave_parallel_type`](replication-options-replica.html#sysvar_slave_parallel_type)

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_relay_log_purge">relay_log_purge</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>7

  When using a multithreaded replica ([`slave_parallel_workers`](replication-options-replica.html#sysvar_slave_parallel_workers) is greater than 0), this variable specifies the policy used to decide which transactions are allowed to execute in parallel on the replica. The variable has no effect on replicas for which multithreading is not enabled. The possible values are:

  + `LOGICAL_CLOCK`: Transactions that are part of the same binary log group commit on a source are applied in parallel on a replica. The dependencies between transactions are tracked based on their timestamps to provide additional parallelization where possible. When this value is set, the [`binlog_transaction_dependency_tracking`](replication-options-binary-log.html#sysvar_binlog_transaction_dependency_tracking) system variable can be used on the source to specify that write sets are used for parallelization in place of timestamps, if a write set is available for the transaction and gives improved results compared to timestamps.

  + `DATABASE`: Transactions that update different databases are applied in parallel. This value is only appropriate if data is partitioned into multiple databases which are being updated independently and concurrently on the source. There must be no cross-database constraints, as such constraints may be violated on the replica.

  When [`slave_preserve_commit_order`](replication-options-replica.html#sysvar_slave_preserve_commit_order) is `1`, [`slave_parallel_type`](replication-options-replica.html#sysvar_slave_parallel_type) must be `LOGICAL_CLOCK`.

  All replication applier threads must be stopped prior to setting [`slave_parallel_type`](replication-options-replica.html#sysvar_slave_parallel_type).

  When your replication topology uses multiple levels of replicas, `LOGICAL_CLOCK` may achieve less parallelization for each level the replica is away from the source. You can reduce this effect by using [`binlog_transaction_dependency_tracking`](replication-options-binary-log.html#sysvar_binlog_transaction_dependency_tracking) on the source to specify that write sets are used instead of timestamps for parallelization where possible.

* [`slave_parallel_workers`](replication-options-replica.html#sysvar_slave_parallel_workers)

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_relay_log_purge">relay_log_purge</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>8

  Sets the number of applier threads for executing replication transactions in parallel. Setting this variable to a number greater than 0 creates a multithreaded replica with this number of applier threads. When set to 0 (the default) parallel execution is disabled and the replica uses a single applier thread. Setting [`slave_parallel_workers`](replication-options-replica.html#sysvar_slave_parallel_workers) has no immediate effect. The state of the variable applies on all subsequent [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statements.

  Note

  Multithreaded replicas are not currently supported by NDB Cluster, which silently ignores the setting for this variable. See [Section 21.7.3, “Known Issues in NDB Cluster Replication”](mysql-cluster-replication-issues.html "21.7.3 Known Issues in NDB Cluster Replication"), for more information.

  A multithreaded replica provides parallel execution by using a coordinator thread and the number of applier threads configured by this variable. The way which transactions are distributed among applier threads is configured by [`slave_parallel_type`](replication-options-replica.html#sysvar_slave_parallel_type). The transactions that the replica applies in parallel may commit out of order, unless [`slave_preserve_commit_order=1`](replication-options-replica.html#sysvar_slave_preserve_commit_order). Therefore, checking for the most recently executed transaction does not guarantee that all previous transactions from the source have been executed on the replica. This has implications for logging and recovery when using a multithreaded replica. For example, on a multithreaded replica the [`START SLAVE UNTIL`](start-slave.html "13.4.2.5 START SLAVE Statement") statement only supports using `SQL_AFTER_MTS_GAPS`.

  In MySQL 5.7, retrying of transactions is supported when multithreading is enabled on a replica. In previous versions, [`slave_transaction_retries`](replication-options-replica.html#sysvar_slave_transaction_retries) was treated as equal to 0 when using multithreaded replicas.

  Multithreaded replicas are not currently supported by NDB Cluster. See [Section 21.7.3, “Known Issues in NDB Cluster Replication”](mysql-cluster-replication-issues.html "21.7.3 Known Issues in NDB Cluster Replication"), for more information about how [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") handles settings for this variable.

* [`slave_pending_jobs_size_max`](replication-options-replica.html#sysvar_slave_pending_jobs_size_max)

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_relay_log_purge">relay_log_purge</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>9

  For multithreaded replicas, this variable sets the maximum amount of memory (in bytes) available to worker queues holding events not yet applied. Setting this variable has no effect on replicas for which multithreading is not enabled. Setting this variable has no immediate effect. The state of the variable applies on all subsequent [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") commands.

  The minimum possible value for this variable is 1024; the default is 16MB. The maximum possible value is 18446744073709551615 (16 exabytes). Values that are not exact multiples of 1024 are rounded down to the next-highest multiple of 1024 prior to being stored.

  The value of this variable is a soft limit and can be set to match the normal workload. If an unusually large event exceeds this size, the transaction is held until all the worker threads have empty queues, and then processed. All subsequent transactions are held until the large transaction has been completed.

* [`slave_preserve_commit_order`](replication-options-replica.html#sysvar_slave_preserve_commit_order)

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_relay_log_space_limit">relay_log_space_limit</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>0

  For multithreaded replicas, the setting 1 for this variable ensures that transactions are externalized on the replica in the same order as they appear in the replica's relay log, and prevents gaps in the sequence of transactions that have been executed from the relay log. This variable has no effect on replicas for which multithreading is not enabled. Note that [`slave_preserve_commit_order=1`](replication-options-replica.html#sysvar_slave_preserve_commit_order) does not preserve the order of non-transactional DML updates, so these might commit before transactions that precede them in the relay log, which might result in gaps.

  [`slave_preserve_commit_order=1`](replication-options-replica.html#sysvar_slave_preserve_commit_order) requires that [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) and [`--log-slave-updates`](replication-options-binary-log.html#sysvar_log_slave_updates) are enabled on the replica, and [`slave_parallel_type`](replication-options-replica.html#sysvar_slave_parallel_type) is set to `LOGICAL_CLOCK`. Before changing this variable, all replication applier threads (for all replication channels if you are using multiple replication channels) must be stopped.

  With [`slave_preserve_commit_order`](replication-options-replica.html#sysvar_slave_preserve_commit_order) enabled, the executing thread waits until all previous transactions are committed before committing. While the thread is waiting for other workers to commit their transactions it reports its status as `Waiting for preceding transaction to commit`. (Prior to MySQL 5.7.8, this was shown as `Waiting for its turn to commit`.) Enabling this mode on a multithreaded replica ensures that it never enters a state that the source was not in. This supports the use of replication for read scale-out. See [Section 16.3.4, “Using Replication for Scale-Out”](replication-solutions-scaleout.html "16.3.4 Using Replication for Scale-Out").

  If [`slave_preserve_commit_order`](replication-options-replica.html#sysvar_slave_preserve_commit_order) is `0`, the transactions that the replica applies in parallel may commit out of order. Therefore, checking for the most recently executed transaction does not guarantee that all previous transactions from the source have been executed on the replica. There is a chance of gaps in the sequence of transactions that have been executed from the replica's relay log. This has implications for logging and recovery when using a multithreaded replica. Note that the setting [`slave_preserve_commit_order=1`](replication-options-replica.html#sysvar_slave_preserve_commit_order) prevents gaps, but does not prevent source binary log position lag (where `Exec_master_log_pos` is behind the position up to which transactions have been executed). See [Section 16.4.1.32, “Replication and Transaction Inconsistencies”](replication-features-transaction-inconsistencies.html "16.4.1.32 Replication and Transaction Inconsistencies") for more information.

* [`slave_rows_search_algorithms`](replication-options-replica.html#sysvar_slave_rows_search_algorithms)

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_relay_log_space_limit">relay_log_space_limit</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>1

  When preparing batches of rows for row-based logging and replication, this variable controls how the rows are searched for matches, in particular whether hash scans are used. Setting this variable takes effect for all replication channels immediately, including running channels.

  Specify a comma-separated list of the following combinations of 2 values from the list `INDEX_SCAN`, `TABLE_SCAN`, `HASH_SCAN`. The value is expected as a string, so if set at runtime rather than at server startup, the value must be quoted. In addition, the value must not contain any spaces. The recommended combinations (lists) and their effects are shown in the following table:

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_relay_log_space_limit">relay_log_space_limit</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>2

  + The default value is `INDEX_SCAN,TABLE_SCAN`, which means that all searches that can use indexes do use them, and searches without any indexes use table scans.

  + To use hashing for any searches that do not use a primary or unique key, set `INDEX_SCAN,HASH_SCAN`. Specifying `INDEX_SCAN,HASH_SCAN` has the same effect as specifying `INDEX_SCAN,TABLE_SCAN,HASH_SCAN`, which is allowed.

  + Do not use the combination `TABLE_SCAN,HASH_SCAN`. This setting forces hashing for all searches. It has no advantage over `INDEX_SCAN,HASH_SCAN`, and it can lead to “record not found” errors or duplicate key errors in the case of a single event containing multiple updates to the same row, or updates that are order-dependent.

  The order in which the algorithms are specified in the list makes no difference to the order in which they are displayed by a [`SELECT`](select.html "13.2.9 SELECT Statement") or [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") statement.

  It is possible to specify a single value, but this is not optimal, because setting a single value limits searches to using only that algorithm. In particular, setting `INDEX_SCAN` alone is not recommended, as in that case searches are unable to find rows at all if no index is present.

* [`slave_skip_errors`](replication-options-replica.html#sysvar_slave_skip_errors)

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_relay_log_space_limit">relay_log_space_limit</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>3

  Normally, replication stops when an error occurs on the replica, which gives you the opportunity to resolve the inconsistency in the data manually. This variable causes the replication SQL thread to continue replication when a statement returns any of the errors listed in the variable value.

* [`slave_sql_verify_checksum`](replication-options-replica.html#sysvar_slave_sql_verify_checksum)

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_relay_log_space_limit">relay_log_space_limit</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>4

  Cause the replication SQL thread to verify data using the checksums read from the relay log. In the event of a mismatch, the replica stops with an error. Setting this variable takes effect for all replication channels immediately, including running channels.

  Note

  The replication I/O thread always reads checksums if possible when accepting events from over the network.

* [`slave_transaction_retries`](replication-options-replica.html#sysvar_slave_transaction_retries)

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_relay_log_space_limit">relay_log_space_limit</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>5

  If a replication SQL thread fails to execute a transaction because of an [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") deadlock or because the transaction's execution time exceeded [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine")'s [`innodb_lock_wait_timeout`](innodb-parameters.html#sysvar_innodb_lock_wait_timeout) or [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6")'s [`TransactionDeadlockDetectionTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-transactiondeadlockdetectiontimeout) or [`TransactionInactiveTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-transactioninactivetimeout), it automatically retries [`slave_transaction_retries`](replication-options-replica.html#sysvar_slave_transaction_retries) times before stopping with an error. Transactions with a non-temporary error are not retried.

  The default value for [`slave_transaction_retries`](replication-options-replica.html#sysvar_slave_transaction_retries) is 10. Setting the variable to 0 disables automatic retrying of transactions. Setting the variable takes effect for all replication channels immediately, including running channels.

  As of MySQL 5.7.5, retrying of transactions is supported when multithreading is enabled on a replica. In previous versions, [`slave_transaction_retries`](replication-options-replica.html#sysvar_slave_transaction_retries) was treated as equal to 0 when using multithreaded replicas.

  The Performance Schema table [`replication_applier_status`](performance-schema-replication-applier-status-table.html "25.12.11.4 The replication_applier_status Table") shows the number of retries that took place on each replication channel, in the `COUNT_TRANSACTIONS_RETRIES` column.

* [`slave_type_conversions`](replication-options-replica.html#sysvar_slave_type_conversions)

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_relay_log_space_limit">relay_log_space_limit</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>6

  Controls the type conversion mode in effect on the replica when using row-based replication. In MySQL 5.7.2 and higher, its value is a comma-delimited set of zero or more elements from the list: `ALL_LOSSY`, `ALL_NON_LOSSY`, `ALL_SIGNED`, `ALL_UNSIGNED`. Set this variable to an empty string to disallow type conversions between the source and the replica. Setting this variable takes effect for all replication channels immediately, including running channels.

  `ALL_SIGNED` and `ALL_UNSIGNED` were added in MySQL 5.7.2 (Bug#15831300). For additional information on type conversion modes applicable to attribute promotion and demotion in row-based replication, see [Row-based replication: attribute promotion and demotion](replication-features-differing-tables.html#replication-features-attribute-promotion "Row-based replication: attribute promotion and demotion").

* [`sql_slave_skip_counter`](replication-options-replica.html#sysvar_sql_slave_skip_counter)

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_relay_log_space_limit">relay_log_space_limit</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>7

  The number of events from the source that a replica should skip. Setting the option has no immediate effect. The variable applies to the next [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statement; the next [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statement also changes the value back to 0. When this variable is set to a nonzero value and there are multiple replication channels configured, the [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statement can only be used with the `FOR CHANNEL channel` clause.

  This option is incompatible with GTID-based replication, and must not be set to a nonzero value when [`gtid_mode=ON`](replication-options-gtids.html#sysvar_gtid_mode). If you need to skip transactions when employing GTIDs, use [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) from the source instead. See [Section 16.1.7.3, “Skipping Transactions”](replication-administration-skip.html "16.1.7.3 Skipping Transactions").

  Important

  If skipping the number of events specified by setting this variable would cause the replica to begin in the middle of an event group, the replica continues to skip until it finds the beginning of the next event group and begins from that point. For more information, see [Section 16.1.7.3, “Skipping Transactions”](replication-administration-skip.html "16.1.7.3 Skipping Transactions").

* [`sync_master_info`](replication-options-replica.html#sysvar_sync_master_info)

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_relay_log_space_limit">relay_log_space_limit</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>8

  The effects of this variable on a replica depend on whether the replica's [`master_info_repository`](replication-options-replica.html#sysvar_master_info_repository) is set to `FILE` or `TABLE`, as explained in the following paragraphs.

  **master\_info\_repository = FILE.** If the value of `sync_master_info` is greater than 0, the replica synchronizes its `master.info` file to disk (using `fdatasync()`) after every `sync_master_info` events. If it is 0, the MySQL server performs no synchronization of the `master.info` file to disk; instead, the server relies on the operating system to flush its contents periodically as with any other file.

  **master\_info\_repository = TABLE.** If the value of `sync_master_info` is greater than 0, the replica updates its connection metadata repository table after every `sync_master_info` events. If it is 0, the table is never updated.

  The default value for `sync_master_info` is

  10000. Setting this variable takes effect for all replication channels immediately, including running channels.

* [`sync_relay_log`](replication-options-replica.html#sysvar_sync_relay_log)

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-replica.html#sysvar_relay_log_space_limit">relay_log_space_limit</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>9

  If the value of this variable is greater than 0, the MySQL server synchronizes its relay log to disk (using `fdatasync()`) after every `sync_relay_log` events are written to the relay log. Setting this variable takes effect for all replication channels immediately, including running channels.

  Setting `sync_relay_log` to 0 causes no synchronization to be done to disk; in this case, the server relies on the operating system to flush the relay log's contents from time to time as for any other file.

  A value of 1 is the safest choice because in the event of an unexpected halt you lose at most one event from the relay log. However, it is also the slowest choice (unless the disk has a battery-backed cache, which makes synchronization very fast). For information on the combination of settings on a replica that is most resilient to unexpected halts, see [Section 16.3.2, “Handling an Unexpected Halt of a Replica”](replication-solutions-unexpected-replica-halt.html "16.3.2 Handling an Unexpected Halt of a Replica").

* [`sync_relay_log_info`](replication-options-replica.html#sysvar_sync_relay_log_info)

  <table frame="box" rules="all" summary="Properties for replicate-do-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

  The default value for `sync_relay_log_info` is 10000. Setting this variable takes effect for all replication channels immediately, including running channels.

  The effects of this variable on the replica depend on the server's [`relay_log_info_repository`](replication-options-replica.html#sysvar_relay_log_info_repository) setting (`FILE` or `TABLE`). If the setting is `TABLE`, the effects of the variable also depend on whether the storage engine used by the relay log info table is transactional (such as [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine")) or not transactional ([`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine")). The effects of these factors on the behavior of the server for `sync_relay_log_info` values of zero and greater than zero are as follows:

  `sync_relay_log_info = 0` :   + If [`relay_log_info_repository`](replication-options-replica.html#sysvar_relay_log_info_repository) is set to `FILE`, the MySQL server performs no synchronization of the `relay-log.info` file to disk; instead, the server relies on the operating system to flush its contents periodically as with any other file.

      + If [`relay_log_info_repository`](replication-options-replica.html#sysvar_relay_log_info_repository) is set to `TABLE`, and the storage engine for that table is transactional, the table is updated after each transaction. (The `sync_relay_log_info` setting is effectively ignored in this case.)

      + If [`relay_log_info_repository`](replication-options-replica.html#sysvar_relay_log_info_repository) is set to `TABLE`, and the storage engine for that table is not transactional, the table is never updated.

  `sync_relay_log_info = N > 0` :   + If [`relay_log_info_repository`](replication-options-replica.html#sysvar_relay_log_info_repository) is set to `FILE`, the replica synchronizes its `relay-log.info` file to disk (using `fdatasync()`) after every *`N`* transactions.

      + If [`relay_log_info_repository`](replication-options-replica.html#sysvar_relay_log_info_repository) is set to `TABLE`, and the storage engine for that table is transactional, the table is updated after each transaction. (The `sync_relay_log_info` setting is effectively ignored in this case.)

      + If [`relay_log_info_repository`](replication-options-replica.html#sysvar_relay_log_info_repository) is set to `TABLE`, and the storage engine for that table is not transactional, the table is updated after every *`N`* events.
