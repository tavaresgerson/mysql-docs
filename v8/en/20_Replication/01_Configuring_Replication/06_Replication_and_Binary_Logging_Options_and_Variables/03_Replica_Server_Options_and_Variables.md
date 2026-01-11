#### 19.1.6.3 Replica Server Options and Variables

This section explains the server options and system variables that apply to replica servers and contains the following:

* Startup Options for Replica Servers
* System Variables Used on Replica Servers

Specify the options either on the command line or in an option file. Many of the options can be set while the server is running by using the `CHANGE REPLICATION SOURCE TO` statement (from MySQL 8.0.23) or `CHANGE MASTER TO` statement (before MySQL 8.0.23). Specify system variable values using `SET`.

**Server ID.** On the source and each replica, you must set the `server_id` system variable to establish a unique replication ID in the range from 1 to 232 − 1. “Unique” means that each ID must be different from every other ID in use by any other source or replica in the replication topology. Example `my.cnf` file:

```
[mysqld]
server-id=3
```

##### Startup Options for Replica Servers

This section explains startup options for controlling replica servers. Many of these options can be set while the server is running by using the `CHANGE REPLICATION SOURCE TO` statement (from MySQL 8.0.23) or `CHANGE MASTER TO` statement (before MySQL 8.0.23). Others, such as the `--replicate-*` options, can be set only when the replica server starts. Replication-related system variables are discussed later in this section.

* `--master-info-file=file_name`

  <table summary="Properties for master-info-file"><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>

  The use of this option is now deprecated. It was used to set the file name for the replica's connection metadata repository if `master_info_repository=FILE` was set. `--master-info-file` and the use of the `master_info_repository` system variable are deprecated because the use of a file for the connection metadata repository has been superseded by crash-safe tables. For information about the connection metadata repository, see Section 19.2.4.2, “Replication Metadata Repositories”.

* `--master-retry-count=count`

  <table summary="Properties for master-retry-count"><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>

  The number of times that the replica tries to reconnect to the source before giving up. The default value is 86400 times. A value of 0 means “infinite”, and the replica attempts to connect forever. Reconnection attempts are triggered when the replica reaches its connection timeout (specified by the `replica_net_timeout` or `slave_net_timeout` system variable) without receiving data or a heartbeat signal from the source. Reconnection is attempted at intervals set by the `SOURCE_CONNECT_RETRY` | `MASTER_CONNECT_RETRY` option of the `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` statement (which defaults to every 60 seconds).

  This option is deprecated; expect it to be removed in a future MySQL release. Use the `SOURCE_RETRY_COUNT` | `MASTER_RETRY_COUNT` option of the `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` statement instead.

* `--max-relay-log-size=size`

  <table summary="Properties for max_relay_log_size"><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>

  The size at which the server rotates relay log files automatically. If this value is nonzero, the relay log is rotated automatically when its size exceeds this value. If this value is zero (the default), the size at which relay log rotation occurs is determined by the value of `max_binlog_size`. For more information, see Section 19.2.4.1, “The Relay Log”.

* `--relay-log-purge={0|1}`

  <table summary="Properties for relay_log_purge"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Disable or enable automatic purging of relay logs as soon as they are no longer needed. The default value is 1 (enabled). This is a global variable that can be changed dynamically with `SET GLOBAL relay_log_purge = N`. Disabling purging of relay logs when enabling the `--relay-log-recovery` option risks data consistency and is therefore not crash-safe.

* `--relay-log-space-limit=size`

  <table summary="Properties for relay_log_space_limit"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

  This option places an upper limit on the total size in bytes of all relay logs on the replica. A value of 0 means “no limit”. This is useful for a replica server host that has limited disk space. When the limit is reached, the I/O (receiver) thread stops reading binary log events from the source server until the SQL thread has caught up and deleted some unused relay logs. Note that this limit is not absolute: There are cases where the SQL (applier) thread needs more events before it can delete relay logs. In that case, the receiver thread exceeds the limit until it becomes possible for the applier thread to delete some relay logs because not doing so would cause a deadlock. You should not set `--relay-log-space-limit` to less than twice the value of `--max-relay-log-size` (or `--max-binlog-size` if `--max-relay-log-size` is 0). In that case, there is a chance that the receiver thread waits for free space because `--relay-log-space-limit` is exceeded, but the applier thread has no relay log to purge and is unable to satisfy the receiver thread. This forces the receiver thread to ignore `--relay-log-space-limit` temporarily.

* `--replicate-do-db=db_name`

  <table summary="Properties for replicate-do-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Creates a replication filter using the name of a database. Such filters can also be created using `CHANGE REPLICATION FILTER REPLICATE_DO_DB`.

  This option supports channel specific replication filters, enabling multi-source replicas to use specific filters for different sources. To configure a channel specific replication filter on a channel named *`channel_1`* use `--replicate-do-db:channel_1:db_name`. In this case, the first colon is interpreted as a separator and subsequent colons are literal colons. See Section 19.2.5.4, “Replication Channel Based Filters” for more information.

  Note

  Global replication filters cannot be used on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state. Channel specific replication filters can be used on replication channels that are not directly involved with Group Replication, such as where a group member also acts as a replica to a source that is outside the group. They cannot be used on the `group_replication_applier` or `group_replication_recovery` channels.

  The precise effect of this replication filter depends on whether statement-based or row-based replication is in use.

  **Statement-based replication.** Tell the replication SQL thread to restrict replication to statements where the default database (that is, the one selected by `USE`) is *`db_name`*. To specify more than one database, use this option multiple times, once for each database; however, doing so does *not* replicate cross-database statements such as `UPDATE some_db.some_table SET foo='bar'` while a different database (or no database) is selected.

  Warning

  To specify multiple databases you *must* use multiple instances of this option. Because database names can contain commas, if you supply a comma separated list then the list is treated as the name of a single database.

  An example of what does not work as you might expect when using statement-based replication: If the replica is started with `--replicate-do-db=sales` and you issue the following statements on the source, the `UPDATE` statement is *not* replicated:

  ```
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

  The main reason for this “check just the default database” behavior is that it is difficult from the statement alone to know whether it should be replicated (for example, if you are using multiple-table `DELETE` statements or multiple-table `UPDATE` statements that act across multiple databases). It is also faster to check only the default database rather than all databases if there is no need.

  **Row-based replication.** Tells the replication SQL thread to restrict replication to database *`db_name`*. Only tables belonging to *`db_name`* are changed; the current database has no effect on this. Suppose that the replica is started with `--replicate-do-db=sales` and row-based replication is in effect, and then the following statements are run on the source:

  ```
  USE prices;
  UPDATE sales.february SET amount=amount+100;
  ```

  The `february` table in the `sales` database on the replica is changed in accordance with the `UPDATE` statement; this occurs whether or not the `USE` statement was issued. However, issuing the following statements on the source has no effect on the replica when using row-based replication and `--replicate-do-db=sales`:

  ```
  USE prices;
  UPDATE prices.march SET amount=amount-25;
  ```

  Even if the statement `USE prices` were changed to `USE sales`, the `UPDATE` statement's effects would still not be replicated.

  Another important difference in how `--replicate-do-db` is handled in statement-based replication as opposed to row-based replication occurs with regard to statements that refer to multiple databases. Suppose that the replica is started with `--replicate-do-db=db1`, and the following statements are executed on the source:

  ```
  USE db1;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  If you are using statement-based replication, then both tables are updated on the replica. However, when using row-based replication, only `table1` is affected on the replica; since `table2` is in a different database, `table2` on the replica is not changed by the `UPDATE`. Now suppose that, instead of the `USE db1` statement, a `USE db4` statement had been used:

  ```
  USE db4;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  In this case, the `UPDATE` statement would have no effect on the replica when using statement-based replication. However, if you are using row-based replication, the `UPDATE` would change `table1` on the replica, but not `table2`—in other words, only tables in the database named by `--replicate-do-db` are changed, and the choice of default database has no effect on this behavior.

  If you need cross-database updates to work, use `--replicate-wild-do-table=db_name.%` instead. See Section 19.2.5, “How Servers Evaluate Replication Filtering Rules”.

  Note

  This option affects replication in the same manner that `--binlog-do-db` affects binary logging, and the effects of the replication format on how `--replicate-do-db` affects replication behavior are the same as those of the logging format on the behavior of `--binlog-do-db`.

  This option has no effect on `BEGIN`, `COMMIT`, or `ROLLBACK` statements.

* `--replicate-ignore-db=db_name`

  <table summary="Properties for replicate-ignore-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Creates a replication filter using the name of a database. Such filters can also be created using `CHANGE REPLICATION FILTER REPLICATE_IGNORE_DB`.

  This option supports channel specific replication filters, enabling multi-source replicas to use specific filters for different sources. To configure a channel specific replication filter on a channel named *`channel_1`* use `--replicate-ignore-db:channel_1:db_name`. In this case, the first colon is interpreted as a separator and subsequent colons are literal colons. See Section 19.2.5.4, “Replication Channel Based Filters” for more information.

  Note

  Global replication filters cannot be used on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state. Channel specific replication filters can be used on replication channels that are not directly involved with Group Replication, such as where a group member also acts as a replica to a source that is outside the group. They cannot be used on the `group_replication_applier` or `group_replication_recovery` channels.

  To specify more than one database to ignore, use this option multiple times, once for each database. Because database names can contain commas, if you supply a comma-separated list, it is treated as the name of a single database.

  As with `--replicate-do-db`, the precise effect of this filtering depends on whether statement-based or row-based replication is in use, and are described in the next several paragraphs.

  **Statement-based replication.** Tells the replication SQL thread not to replicate any statement where the default database (that is, the one selected by `USE`) is *`db_name`*.

  **Row-based replication.** Tells the replication SQL thread not to update any tables in the database *`db_name`*. The default database has no effect.

  When using statement-based replication, the following example does not work as you might expect. Suppose that the replica is started with `--replicate-ignore-db=sales` and you issue the following statements on the source:

  ```
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

  The `UPDATE` statement *is* replicated in such a case because `--replicate-ignore-db` applies only to the default database (determined by the `USE` statement). Because the `sales` database was specified explicitly in the statement, the statement has not been filtered. However, when using row-based replication, the `UPDATE` statement's effects are *not* propagated to the replica, and the replica's copy of the `sales.january` table is unchanged; in this instance, `--replicate-ignore-db=sales` causes *all* changes made to tables in the source's copy of the `sales` database to be ignored by the replica.

  You should not use this option if you are using cross-database updates and you do not want these updates to be replicated. See Section 19.2.5, “How Servers Evaluate Replication Filtering Rules”.

  If you need cross-database updates to work, use `--replicate-wild-ignore-table=db_name.%` instead. See Section 19.2.5, “How Servers Evaluate Replication Filtering Rules”.

  Note

  This option affects replication in the same manner that `--binlog-ignore-db` affects binary logging, and the effects of the replication format on how `--replicate-ignore-db` affects replication behavior are the same as those of the logging format on the behavior of `--binlog-ignore-db`.

  This option has no effect on `BEGIN`, `COMMIT`, or `ROLLBACK` statements.

* `--replicate-do-table=db_name.tbl_name`

  <table summary="Properties for replicate-do-table"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Creates a replication filter by telling the replication SQL thread to restrict replication to a given table. To specify more than one table, use this option multiple times, once for each table. This works for both cross-database updates and default database updates, in contrast to `--replicate-do-db`. See Section 19.2.5, “How Servers Evaluate Replication Filtering Rules”. You can also create such a filter by issuing a `CHANGE REPLICATION FILTER REPLICATE_DO_TABLE` statement.

  This option supports channel specific replication filters, enabling multi-source replicas to use specific filters for different sources. To configure a channel specific replication filter on a channel named *`channel_1`* use `--replicate-do-table:channel_1:db_name.tbl_name`. In this case, the first colon is interpreted as a separator and subsequent colons are literal colons. See Section 19.2.5.4, “Replication Channel Based Filters” for more information.

  Note

  Global replication filters cannot be used on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state. Channel specific replication filters can be used on replication channels that are not directly involved with Group Replication, such as where a group member also acts as a replica to a source that is outside the group. They cannot be used on the `group_replication_applier` or `group_replication_recovery` channels.

  This option affects only statements that apply to tables. It does not affect statements that apply only to other database objects, such as stored routines. To filter statements operating on stored routines, use one or more of the `--replicate-*-db` options.

* `--replicate-ignore-table=db_name.tbl_name`

  <table summary="Properties for replicate-ignore-table"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Creates a replication filter by telling the replication SQL thread not to replicate any statement that updates the specified table, even if any other tables might be updated by the same statement. To specify more than one table to ignore, use this option multiple times, once for each table. This works for cross-database updates, in contrast to `--replicate-ignore-db`. See Section 19.2.5, “How Servers Evaluate Replication Filtering Rules”. You can also create such a filter by issuing a `CHANGE REPLICATION FILTER REPLICATE_IGNORE_TABLE` statement.

  This option supports channel specific replication filters, enabling multi-source replicas to use specific filters for different sources. To configure a channel specific replication filter on a channel named *`channel_1`* use `--replicate-ignore-table:channel_1:db_name.tbl_name`. In this case, the first colon is interpreted as a separator and subsequent colons are literal colons. See Section 19.2.5.4, “Replication Channel Based Filters” for more information.

  Note

  Global replication filters cannot be used on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state. Channel specific replication filters can be used on replication channels that are not directly involved with Group Replication, such as where a group member also acts as a replica to a source that is outside the group. They cannot be used on the `group_replication_applier` or `group_replication_recovery` channels.

  This option affects only statements that apply to tables. It does not affect statements that apply only to other database objects, such as stored routines. To filter statements operating on stored routines, use one or more of the `--replicate-*-db` options.

* `--replicate-rewrite-db=from_name->to_name`

  <table summary="Properties for replicate-rewrite-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-rewrite-db=old_name-&gt;new_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Tells the replica to create a replication filter that translates the specified database to *`to_name`* if it was *`from_name`* on the source. Only statements involving tables are affected, not statements such as `CREATE DATABASE`, `DROP DATABASE`, and `ALTER DATABASE`.

  To specify multiple rewrites, use this option multiple times. The server uses the first one with a *`from_name`* value that matches. The database name translation is done *before* the `--replicate-*` rules are tested. You can also create such a filter by issuing a `CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB` statement.

  If you use the `--replicate-rewrite-db` option on the command line and the `>` character is special to your command interpreter, quote the option value. For example:

  ```
  $> mysqld --replicate-rewrite-db="olddb->newdb"
  ```

  The effect of the `--replicate-rewrite-db` option differs depending on whether statement-based or row-based binary logging format is used for the query. With statement-based format, DML statements are translated based on the current database, as specified by the `USE` statement. With row-based format, DML statements are translated based on the database where the modified table exists. DDL statements are always filtered based on the current database, as specified by the `USE` statement, regardless of the binary logging format.

  To ensure that rewriting produces the expected results, particularly in combination with other replication filtering options, follow these recommendations when you use the `--replicate-rewrite-db` option:

  + Create the *`from_name`* and *`to_name`* databases manually on the source and the replica with different names.

  + If you use statement-based or mixed binary logging format, do not use cross-database queries, and do not specify database names in queries. For both DDL and DML statements, rely on the `USE` statement to specify the current database, and use only the table name in queries.

  + If you use row-based binary logging format exclusively, for DDL statements, rely on the `USE` statement to specify the current database, and use only the table name in queries. For DML statements, you can use a fully qualified table name (*`db`*.*`table`*) if you want.

  If these recommendations are followed, it is safe to use the `--replicate-rewrite-db` option in combination with table-level replication filtering options such as `--replicate-do-table`.

  This option supports channel specific replication filters, enabling multi-source replicas to use specific filters for different sources. Specify the channel name followed by a colon, followed by the filter specification. The first colon is interpreted as a separator, and any subsequent colons are interpreted as literal colons. For example, to configure a channel specific replication filter on a channel named *`channel_1`*, use:

  ```
  $> mysqld --replicate-rewrite-db=channel_1:db_name1->db_name2
  ```

  If you use a colon but do not specify a channel name, the option configures the replication filter for the default replication channel. See Section 19.2.5.4, “Replication Channel Based Filters” for more information.

  Note

  Global replication filters cannot be used on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state. Channel specific replication filters can be used on replication channels that are not directly involved with Group Replication, such as where a group member also acts as a replica to a source that is outside the group. They cannot be used on the `group_replication_applier` or `group_replication_recovery` channels.

* `--replicate-same-server-id`

  <table summary="Properties for master-retry-count"><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>0

  This option is for use on replicas. The default is 0 (`FALSE`). With this option set to 1 (`TRUE`), the replica does not skip events that have its own server ID. This setting is normally useful only in rare configurations.

  When binary logging is enabled on a replica, the combination of the `--replicate-same-server-id` and `--log-slave-updates` options on the replica can cause infinite loops in replication if the server is part of a circular replication topology. (In MySQL 8.0, binary logging is enabled by default, and replica update logging is the default when binary logging is enabled.) However, the use of global transaction identifiers (GTIDs) prevents this situation by skipping the execution of transactions that have already been applied. If `gtid_mode=ON` is set on the replica, you can start the server with this combination of options, but you cannot change to any other GTID mode while the server is running. If any other GTID mode is set, the server does not start with this combination of options.

  By default, the replication I/O (receiver) thread does not write binary log events to the relay log if they have the replica's server ID (this optimization helps save disk usage). If you want to use `--replicate-same-server-id`, be sure to start the replica with this option before you make the replica read its own events that you want the replication SQL (applier) thread to execute.

* `--replicate-wild-do-table=db_name.tbl_name`

  <table summary="Properties for master-retry-count"><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>1

  Creates a replication filter by telling the replication SQL (applier) thread to restrict replication to statements where any of the updated tables match the specified database and table name patterns. Patterns can contain the `%` and `_` wildcard characters, which have the same meaning as for the `LIKE` pattern-matching operator. To specify more than one table, use this option multiple times, once for each table. This works for cross-database updates. See Section 19.2.5, “How Servers Evaluate Replication Filtering Rules”. You can also create such a filter by issuing a `CHANGE REPLICATION FILTER REPLICATE_WILD_DO_TABLE` statement.

  This option supports channel specific replication filters, enabling multi-source replicas to use specific filters for different sources. To configure a channel specific replication filter on a channel named *`channel_1`* use `--replicate-wild-do-table:channel_1:db_name.tbl_name`. In this case, the first colon is interpreted as a separator and subsequent colons are literal colons. See Section 19.2.5.4, “Replication Channel Based Filters” for more information.

  Important

  Global replication filters cannot be used on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state. Channel specific replication filters can be used on replication channels that are not directly involved with Group Replication, such as where a group member also acts as a replica to a source that is outside the group. They cannot be used on the `group_replication_applier` or `group_replication_recovery` channels.

  The replication filter specified by the `--replicate-wild-do-table` option applies to tables, views, and triggers. It does not apply to stored procedures and functions, or events. To filter statements operating on the latter objects, use one or more of the `--replicate-*-db` options.

  As an example, `--replicate-wild-do-table=foo%.bar%` replicates only updates that use a table where the database name starts with `foo` and the table name starts with `bar`.

  If the table name pattern is `%`, it matches any table name and the option also applies to database-level statements (`CREATE DATABASE`, `DROP DATABASE`, and `ALTER DATABASE`). For example, if you use `--replicate-wild-do-table=foo%.%`, database-level statements are replicated if the database name matches the pattern `foo%`.

  Important

  Table-level replication filters are only applied to tables that are explicitly mentioned and operated on in the query. They do not apply to tables that are implicitly updated by the query. For example, a `GRANT` statement, which updates the `mysql.user` system table but does not mention that table, is not affected by a filter that specifies `mysql.%` as the wildcard pattern.

  To include literal wildcard characters in the database or table name patterns, escape them with a backslash. For example, to replicate all tables of a database that is named `my_own%db`, but not replicate tables from the `my1ownAABCdb` database, you should escape the `_` and `%` characters like this: `--replicate-wild-do-table=my_own\%db`. If you use the option on the command line, you might need to double the backslashes or quote the option value, depending on your command interpreter. For example, with the **bash** shell, you would need to type `--replicate-wild-do-table=my\_own\\%db`.

* `--replicate-wild-ignore-table=db_name.tbl_name`

  <table summary="Properties for master-retry-count"><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>2

  Creates a replication filter which keeps the replication SQL thread from replicating a statement in which any table matches the given wildcard pattern. To specify more than one table to ignore, use this option multiple times, once for each table. This works for cross-database updates. See Section 19.2.5, “How Servers Evaluate Replication Filtering Rules”. You can also create such a filter by issuing a `CHANGE REPLICATION FILTER REPLICATE_WILD_IGNORE_TABLE` statement.

  This option supports channel specific replication filters, enabling multi-source replicas to use specific filters for different sources. To configure a channel specific replication filter on a channel named *`channel_1`* use `--replicate-wild-ignore:channel_1:db_name.tbl_name`. In this case, the first colon is interpreted as a separator and subsequent colons are literal colons. See Section 19.2.5.4, “Replication Channel Based Filters” for more information.

  Important

  Global replication filters cannot be used on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state. Channel specific replication filters can be used on replication channels that are not directly involved with Group Replication, such as where a group member also acts as a replica to a source that is outside the group. They cannot be used on the `group_replication_applier` or `group_replication_recovery` channels.

  As an example, `--replicate-wild-ignore-table=foo%.bar%` does not replicate updates that use a table where the database name starts with `foo` and the table name starts with `bar`. For information about how matching works, see the description of the `--replicate-wild-do-table` option. The rules for including literal wildcard characters in the option value are the same as for `--replicate-wild-ignore-table` as well.

  Important

  Table-level replication filters are only applied to tables that are explicitly mentioned and operated on in the query. They do not apply to tables that are implicitly updated by the query. For example, a `GRANT` statement, which updates the `mysql.user` system table but does not mention that table, is not affected by a filter that specifies `mysql.%` as the wildcard pattern.

  If you need to filter out `GRANT` statements or other administrative statements, a possible workaround is to use the `--replicate-ignore-db` filter. This filter operates on the default database that is currently in effect, as determined by the `USE` statement. You can therefore create a filter to ignore statements for a database that is not replicated, then issue the `USE` statement to switch the default database to that one immediately before issuing any administrative statements that you want to ignore. In the administrative statement, name the actual database where the statement is applied.

  For example, if `--replicate-ignore-db=nonreplicated` is configured on the replica server, the following sequence of statements causes the `GRANT` statement to be ignored, because the default database `nonreplicated` is in effect:

  ```
  USE nonreplicated;
  GRANT SELECT, INSERT ON replicated.t1 TO 'someuser'@'somehost';
  ```

* `--skip-replica-start`

  <table summary="Properties for master-retry-count"><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>3

  From MySQL 8.0.26, use `--skip-replica-start` in place of `--skip-slave-start`, which is deprecated from that release. In releases before MySQL 8.0.26, use `--skip-slave-start`.

  `--skip-replica-start` tells the replica server not to start the replication I/O (receiver) and SQL (applier) threads when the server starts. To start the threads later, use a `START REPLICA` statement.

  You can use the `skip_replica_start` system variable in place of the command line option to allow access to this feature using MySQL Server’s privilege structure, so that database administrators do not need any privileged access to the operating system.

* `--skip-slave-start`

  <table summary="Properties for master-retry-count"><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>4

  From MySQL 8.0.26, `--skip-slave-start` is deprecated and the alias `--skip-replica-start` should be used instead. In releases before MySQL 8.0.26, use `--skip-slave-start`.

  Tells the replica server not to start the replication I/O (receiver) and SQL (applier) threads when the server starts. To start the threads later, use a `START REPLICA` statement.

  From MySQL 8.0.24, you can use the `skip_slave_start` system variable in place of the command line option to allow access to this feature using MySQL Server’s privilege structure, so that database administrators do not need any privileged access to the operating system.

* `--slave-skip-errors=[err_code1,err_code2,...|all|ddl_exist_errors]`

  <table summary="Properties for master-retry-count"><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>5

  Normally, replication stops when an error occurs on the replica, which gives you the opportunity to resolve the inconsistency in the data manually. This option causes the replication SQL thread to continue replication when a statement returns any of the errors listed in the option value.

  Do not use this option unless you fully understand why you are getting errors. If there are no bugs in your replication setup and client programs, and no bugs in MySQL itself, an error that stops replication should never occur. Indiscriminate use of this option results in replicas becoming hopelessly out of synchrony with the source, with you having no idea why this has occurred.

  For error codes, you should use the numbers provided by the error message in your replica's error log and in the output of `SHOW REPLICA STATUS`. Appendix B, *Error Messages and Common Problems*, lists server error codes.

  The shorthand value `ddl_exist_errors` is equivalent to the error code list `1007,1008,1050,1051,1054,1060,1061,1068,1091,1146`.

  You can also (but should not) use the very nonrecommended value of `all` to cause the replica to ignore all error messages and keeps going regardless of what happens. Needless to say, if you use `all`, there are no guarantees regarding the integrity of your data. Please do not complain (or file bug reports) in this case if the replica's data is not anywhere close to what it is on the source. *You have been warned*.

  This option does not work in the same way when replicating between NDB Clusters, due to the internal `NDB` mechanism for checking epoch sequence numbers; normally, as soon as `NDB` detects an epoch number that is missing or otherwise out of sequence, it immediately stops the replica applier thread. Beginning with NDB 8.0.28, you can override this behavior by also specifying `--ndb-applier-allow-skip-epoch` together with `--slave-skip-errors`; doing so causes `NDB` to ignore skipped epoch transactions.

  Examples:

  ```
  --slave-skip-errors=1062,1053
  --slave-skip-errors=all
  --slave-skip-errors=ddl_exist_errors
  ```

* `--slave-sql-verify-checksum={0|1}`

  <table summary="Properties for master-retry-count"><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>6

  When this option is enabled, the replica examines checksums read from the relay log. In the event of a mismatch, the replica stops with an error.

The following options are used internally by the MySQL test suite for replication testing and debugging. They are not intended for use in a production setting.

* `--abort-slave-event-count`

  <table summary="Properties for master-retry-count"><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>7

  When this option is set to some positive integer *`value`* other than 0 (the default) it affects replication behavior as follows: After the replication SQL thread has started, *`value`* log events are permitted to be executed; after that, the replication SQL thread does not receive any more events, just as if the network connection from the source were cut. The replication SQL thread continues to run, and the output from `SHOW REPLICA STATUS` displays `Yes` in both the `Replica_IO_Running` and the `Replica_SQL_Running` columns, but no further events are read from the relay log.

  This option is used internally by the MySQL test suite for replication testing and debugging. It is not intended for use in a production setting. Beginning with MySQL 8.0.29, it is deprecated, and subject to removal in a future version of MySQL.

* `--disconnect-slave-event-count`

  <table summary="Properties for master-retry-count"><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>8

  This option is used internally by the MySQL test suite for replication testing and debugging. It is not intended for use in a production setting. Beginning with MySQL 8.0.29, it is deprecated, and subject to removal in a future version of MySQL.

##### System Variables Used on Replica Servers

The following list describes system variables for controlling replica servers. They can be set at server startup and some of them can be changed at runtime using `SET`. Server options used with replicas are listed earlier in this section.

* `init_replica`

  <table summary="Properties for master-retry-count"><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>9

  From MySQL 8.0.26, use `init_replica` in place of `init_slave`, which is deprecated from that release. In releases before MySQL 8.0.26, use `init_slave`.

  `init_replica` is similar to `init_connect`, but is a string to be executed by a replica server each time the replication SQL thread starts. The format of the string is the same as for the `init_connect` variable. The setting of this variable takes effect for subsequent `START REPLICA` statements.

  Note

  The replication SQL thread sends an acknowledgment to the client before it executes `init_replica`. Therefore, it is not guaranteed that `init_replica` has been executed when `START REPLICA` returns. See Section 15.4.2.6, “START REPLICA Statement” for more information.

* `init_slave`

  <table summary="Properties for max_relay_log_size"><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>0

  From MySQL 8.0.26, `init_slave` is deprecated and the alias `init_replica` should be used instead. In releases before MySQL 8.0.26, use `init_slave`.

  `init_slave` is similar to `init_connect`, but is a string to be executed by a replica server each time the replication SQL thread starts. The format of the string is the same as for the `init_connect` variable. The setting of this variable takes effect for subsequent `START REPLICA` statements.

  Note

  The replication SQL thread sends an acknowledgment to the client before it executes `init_slave`. Therefore, it is not guaranteed that `init_slave` has been executed when `START REPLICA` returns. See Section 15.4.2.6, “START REPLICA Statement” for more information.

* `log_slow_replica_statements`

  <table summary="Properties for max_relay_log_size"><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>1

  From MySQL 8.0.26, use `log_slow_replica_statements` in place of `log_slow_slave_statements`, which is deprecated from that release. In releases before MySQL 8.0.26, use `log_slow_slave_statements`.

  When the slow query log is enabled, `log_slow_replica_statements` enables logging for queries that have taken more than `long_query_time` seconds to execute on the replica. Note that if row-based replication is in use (`binlog_format=ROW`), `log_slow_replica_statements` has no effect. Queries are only added to the replica's slow query log when they are logged in statement format in the binary log, that is, when `binlog_format=STATEMENT` is set, or when `binlog_format=MIXED` is set and the statement is logged in statement format. Slow queries that are logged in row format when `binlog_format=MIXED` is set, or that are logged when `binlog_format=ROW` is set, are not added to the replica's slow query log, even if `log_slow_replica_statements` is enabled.

  Setting `log_slow_replica_statements` has no immediate effect. The state of the variable applies on all subsequent `START REPLICA` statements. Also note that the global setting for `long_query_time` applies for the lifetime of the SQL thread. If you change that setting, you must stop and restart the replication SQL thread to implement the change there (for example, by issuing `STOP REPLICA` and `START REPLICA` statements with the `SQL_THREAD` option).

* `log_slow_slave_statements`

  <table summary="Properties for max_relay_log_size"><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>2

  From MySQL 8.0.26, `log_slow_slave_statements` is deprecated and the alias `log_slow_replica_statements` should be used instead. In releases before MySQL 8.0.26, use `log_slow_slave_statements`.

  When the slow query log is enabled, `log_slow_slave_statements` enables logging for queries that have taken more than `long_query_time` seconds to execute on the replica. Note that if row-based replication is in use (`binlog_format=ROW`), `log_slow_slave_statements` has no effect. Queries are only added to the replica's slow query log when they are logged in statement format in the binary log, that is, when `binlog_format=STATEMENT` is set, or when `binlog_format=MIXED` is set and the statement is logged in statement format. Slow queries that are logged in row format when `binlog_format=MIXED` is set, or that are logged when `binlog_format=ROW` is set, are not added to the replica's slow query log, even if `log_slow_slave_statements` is enabled.

  Setting `log_slow_slave_statements` has no immediate effect. The state of the variable applies on all subsequent `START REPLICA` statements. Also note that the global setting for `long_query_time` applies for the lifetime of the SQL thread. If you change that setting, you must stop and restart the replication SQL thread to implement the change there (for example, by issuing `STOP REPLICA` and `START REPLICA` statements with the `SQL_THREAD` option).

* `master_info_repository`

  <table summary="Properties for max_relay_log_size"><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>3

  The use of this system variable is now deprecated. The setting `TABLE` is the default, and is required when multiple replication channels are configured. The alternative setting `FILE` was previously deprecated.

  With the default setting, the replica records metadata about the source, consisting of status and connection information, to an `InnoDB` table in the `mysql` system database named `mysql.slave_master_info`. For more information on the connection metadata repository, see Section 19.2.4, “Relay Log and Replication Metadata Repositories”.

  The `FILE` setting wrote the replica's connection metadata repository to a file, which was named `master.info` by default. The name could be changed using the `--master-info-file` option.

* `max_relay_log_size`

  <table summary="Properties for max_relay_log_size"><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>4

  If a write by a replica to its relay log causes the current log file size to exceed the value of this variable, the replica rotates the relay logs (closes the current file and opens the next one). If `max_relay_log_size` is 0, the server uses `max_binlog_size` for both the binary log and the relay log. If `max_relay_log_size` is greater than 0, it constrains the size of the relay log, which enables you to have different sizes for the two logs. You must set `max_relay_log_size` to between 4096 bytes and 1GB (inclusive), or to 0. The default value is 0. See Section 19.2.3, “Replication Threads”.

* `relay_log`

  <table summary="Properties for max_relay_log_size"><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>5

  The base name for relay log files. For the default replication channel, the default base name for relay logs is `host_name-relay-bin`. For non-default replication channels, the default base name for relay logs is `host_name-relay-bin-channel`, where *`channel`* is the name of the replication channel recorded in this relay log.

  The server writes the file in the data directory unless the base name is given with a leading absolute path name to specify a different directory. The server creates relay log files in sequence by adding a numeric suffix to the base name.

  The relay log and relay log index on a replication server cannot be given the same names as the binary log and binary log index, whose names are specified by the `--log-bin` and `--log-bin-index` options. The server issues an error message and does not start if the binary log and relay log file base names would be the same.

  Due to the manner in which MySQL parses server options, if you specify this variable at server startup, you must supply a value; *the default base name is used only if the option is not actually specified*. If you specify the `relay_log` system variable at server startup without specifying a value, unexpected behavior is likely to result; this behavior depends on the other options used, the order in which they are specified, and whether they are specified on the command line or in an option file. For more information about how MySQL handles server options, see Section 6.2.2, “Specifying Program Options”.

  If you specify this variable, the value specified is also used as the base name for the relay log index file. You can override this behavior by specifying a different relay log index file base name using the `relay_log_index` system variable.

  When the server reads an entry from the index file, it checks whether the entry contains a relative path. If it does, the relative part of the path is replaced with the absolute path set using the `relay_log` system variable. An absolute path remains unchanged; in such a case, the index must be edited manually to enable the new path or paths to be used.

  You may find the `relay_log` system variable useful in performing the following tasks:

  + Creating relay logs whose names are independent of host names.

  + If you need to put the relay logs in some area other than the data directory because your relay logs tend to be very large and you do not want to decrease `max_relay_log_size`.

  + To increase speed by using load-balancing between disks.

  You can obtain the relay log file name (and path) from the `relay_log_basename` system variable.

* `relay_log_basename`

  <table summary="Properties for max_relay_log_size"><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>6

  Holds the base name and complete path to the relay log file. The maximum variable length is 256. This variable is set by the server and is read only.

* `relay_log_index`

  <table summary="Properties for max_relay_log_size"><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>7

  The name for the relay log index file. The maximum variable length is 256. If you do not specify this variable, but the `relay_log` system variable is specified, its value is used as the default base name for the relay log index file. If `relay_log` is also not specified, then for the default replication channel, the default name is `host_name-relay-bin.index`, using the name of the host machine. For non-default replication channels, the default name is `host_name-relay-bin-channel.index`, where *`channel`* is the name of the replication channel recorded in this relay log index.

  The default location for relay log files is the data directory, or any other location that was specified using the `relay_log` system variable. You can use the `relay_log_index` system variable to specify an alternative location, by adding a leading absolute path name to the base name to specify a different directory.

  The relay log and relay log index on a replication server cannot be given the same names as the binary log and binary log index, whose names are specified by the `--log-bin` and `--log-bin-index` options. The server issues an error message and does not start if the binary log and relay log file base names would be the same.

  Due to the manner in which MySQL parses server options, if you specify this variable at server startup, you must supply a value; *the default base name is used only if the option is not actually specified*. If you specify the `relay_log_index` system variable at server startup without specifying a value, unexpected behavior is likely to result; this behavior depends on the other options used, the order in which they are specified, and whether they are specified on the command line or in an option file. For more information about how MySQL handles server options, see Section 6.2.2, “Specifying Program Options”.

* `relay_log_info_file`

  <table summary="Properties for max_relay_log_size"><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>8

  The use of this system variable is now deprecated. It was used to set the file name for the replica's applier metadata repository if `relay_log_info_repository=FILE` was set. `relay_log_info_file` and the use of the `relay_log_info_repository` system variable are deprecated because the use of a file for the applier metadata repository has been superseded by crash-safe tables. For information about the applier metadata repository, see Section 19.2.4.2, “Replication Metadata Repositories”.

* `relay_log_info_repository`

  <table summary="Properties for max_relay_log_size"><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>9

  The use of this system variable is now deprecated. The setting `TABLE` is the default, and is required when multiple replication channels are configured. The `TABLE` setting for the replica's applier metadata repository is also required to make replication resilient to unexpected halts. See Section 19.4.2, “Handling an Unexpected Halt of a Replica” for more information. The alternative setting `FILE` was previously deprecated.

  With the default setting, the replica stores its applier metadata repository as an `InnoDB` table in the `mysql` system database named `mysql.slave_relay_log_info`. For more information on the applier metadata repository, see Section 19.2.4, “Relay Log and Replication Metadata Repositories”.

  The `FILE` setting wrote the replica's applier metadata repository to a file, which was named `relay-log.info` by default. The name could be changed using the `relay_log_info_file` system variable.

* `relay_log_purge`

  <table summary="Properties for relay_log_purge"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>0

  Disables or enables automatic purging of relay log files as soon as they are not needed any more. The default value is 1 (`ON`).

* `relay_log_recovery`

  <table summary="Properties for relay_log_purge"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>1

  If enabled, this variable enables automatic relay log recovery immediately following server startup. The recovery process creates a new relay log file, initializes the SQL (applier) thread position to this new relay log, and initializes the I/O (receiver) thread to the applier thread position. Reading of the relay log from the source then continues. If `SOURCE_AUTO_POSITION=1` was set for the replication channel using the `CHANGE REPLICATION SOURCE TO` option, the source position used to start replication might be the one received in the connection and not the ones assigned in this process.

  This global variable is read-only at runtime. Its value can be set with the `--relay-log-recovery` option at replica server startup, which should be used following an unexpected halt of a replica to ensure that no possibly corrupted relay logs are processed, and must be used in order to guarantee a crash-safe replica. The default value is 0 (disabled). For information on the combination of settings on a replica that is most resilient to unexpected halts, see Section 19.4.2, “Handling an Unexpected Halt of a Replica”.

  For a multithreaded replica (where `replica_parallel_workers` or `slave_parallel_workers` is greater than 0), setting `--relay-log-recovery` at startup automatically handles any inconsistencies and gaps in the sequence of transactions that have been executed from the relay log. These gaps can occur when file position based replication is in use. (For more details, see Section 19.5.1.34, “Replication and Transaction Inconsistencies”.) The relay log recovery process deals with gaps using the same method as the `START REPLICA UNTIL SQL_AFTER_MTS_GAPS` statement would. When the replica reaches a consistent gap-free state, the relay log recovery process goes on to fetch further transactions from the source beginning at the SQL (applier) thread position. When GTID-based replication is in use, from MySQL 8.0.18 a multithreaded replica checks first whether `MASTER_AUTO_POSITION` is set to `ON`, and if it is, omits the step of calculating the transactions that should be skipped or not skipped, so that the old relay logs are not required for the recovery process.

  Note

  This variable does not affect the following Group Replication channels:

  + `group_replication_applier`
  + `group_replication_recovery`

  Any other channels running on a group are affected, such as a channel which is replicating from an outside source or another group.

* `relay_log_space_limit`

  <table summary="Properties for relay_log_purge"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>2

  The maximum amount of space to use for all relay logs.

* `replica_checkpoint_group`

  <table summary="Properties for relay_log_purge"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>3

  From MySQL 8.0.26, use `replica_checkpoint_group` in place of `slave_checkpoint_group`, which is deprecated from that release. In releases before MySQL 8.0.26, use `slave_checkpoint_group`.

  `replica_checkpoint_group` sets the maximum number of transactions that can be processed by a multithreaded replica before a checkpoint operation is called to update its status as shown by `SHOW REPLICA STATUS`. Setting this variable has no effect on replicas for which multithreading is not enabled. Setting this variable has no immediate effect. The state of the variable applies to all subsequent `START REPLICA` statements.

  Previously, multithreaded replicas were not supported by NDB Cluster, which silently ignored the setting for this variable. This restriction was lifted in MySQL 8.0.33.

  This variable works in combination with the `replica_checkpoint_period` system variable in such a way that, when either limit is exceeded, the checkpoint is executed and the counters tracking both the number of transactions and the time elapsed since the last checkpoint are reset.

  The minimum allowed value for this variable is 32, unless the server was built using `-DWITH_DEBUG`, in which case the minimum value is 1. The effective value is always a multiple of 8; you can set it to a value that is not such a multiple, but the server rounds it down to the next lower multiple of 8 before storing the value. (*Exception*: No such rounding is performed by the debug server.) Regardless of how the server was built, the default value is 512, and the maximum allowed value is 524280.

* `replica_checkpoint_period`

  <table summary="Properties for relay_log_purge"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>4

  In MySQL 8.0.26 and later, use `replica_checkpoint_period` in place of `slave_checkpoint_period`, which is deprecated from that release; prior to MySQL 8.0.26, use `slave_checkpoint_period`.

  `replica_checkpoint_period` sets the maximum time (in milliseconds) that is allowed to pass before a checkpoint operation is called to update the status of a multithreaded replica as shown by `SHOW REPLICA STATUS`. Setting this variable has no effect on replicas for which multithreading is not enabled. Setting this variable takes effect for all replication channels immediately, including running channels.

  Previously, multithreaded replicas were not supported by NDB Cluster, which silently ignored the setting for this variable. This restriction was lifted in MySQL 8.0.33.

  This variable works in combination with the `replica_checkpoint_group` system variable in such a way that, when either limit is exceeded, the checkpoint is executed and the counters tracking both the number of transactions and the time elapsed since the last checkpoint are reset.

  The minimum allowed value for this variable is 1, unless the server was built using `-DWITH_DEBUG`, in which case the minimum value is 0. Regardless of how the server was built, the default value is 300 milliseconds, and the maximum possible value is 4294967295 milliseconds (approximately 49.7 days).

* `replica_compressed_protocol`

  <table summary="Properties for relay_log_purge"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>5

  From MySQL 8.0.26, use `replica_compressed_protocol` in place of `slave_compressed_protocol`, which is deprecated. In releases before MySQL 8.0.26, use `slave_compressed_protocol`.

  `replica_compressed_protocol` specifies whether to use compression of the source/replica connection protocol if both source and replica support it. If this variable is disabled (the default), connections are uncompressed. Changes to this variable take effect on subsequent connection attempts; this includes after issuing a `START REPLICA` statement, as well as reconnections made by a running replication I/O (receiver) thread.

  Binary log transaction compression (available as of MySQL 8.0.20), which is activated by the `binlog_transaction_compression` system variable, can also be used to save bandwidth. If you use binary log transaction compression in combination with protocol compression, protocol compression has less opportunity to act on the data, but can still compress headers and those events and transaction payloads that are uncompressed. For more information on binary log transaction compression, see Section 7.4.4.5, “Binary Log Transaction Compression”.

  If `replica_compressed_protocol` is enabled, it takes precedence over any `SOURCE_COMPRESSION_ALGORITHMS` option specified for the `CHANGE REPLICATION SOURCE TO` statement. In this case, connections to the source use `zlib` compression if both the source and replica support that algorithm. If `replica_compressed_protocol` is disabled, the value of `SOURCE_COMPRESSION_ALGORITHMS` applies. For more information, see Section 6.2.8, “Connection Compression Control”.

* `replica_exec_mode`

  <table summary="Properties for relay_log_purge"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>6

  From MySQL 8.0.26, use `replica_exec_mode` in place of `slave_exec_mode`, which is deprecated from that release. In releases before MySQL 8.0.26, use `slave_exec_mode`.

  `replica_exec_mode` controls how a replication thread resolves conflicts and errors during replication. `IDEMPOTENT` mode causes suppression of duplicate-key and no-key-found errors; `STRICT` means no such suppression takes place.

  `IDEMPOTENT` mode is intended for use in multi-source replication, circular replication, and some other special replication scenarios for NDB Cluster Replication. (See Section 25.7.10, “NDB Cluster Replication: Bidirectional and Circular Replication”, and Section 25.7.12, “NDB Cluster Replication Conflict Resolution”, for more information.) NDB Cluster ignores any value explicitly set for `replica_exec_mode`, and always treats it as `IDEMPOTENT`.

  In MySQL Server 8.0, `STRICT` mode is the default value.

  Setting this variable takes immediate effect for all replication channels, including running channels.

  For storage engines other than `NDB`, *`IDEMPOTENT` mode should be used only when you are absolutely sure that duplicate-key errors and key-not-found errors can safely be ignored*. It is meant to be used in fail-over scenarios for NDB Cluster where multi-source replication or circular replication is employed, and is not recommended for use in other cases.

* `replica_load_tmpdir`

  <table summary="Properties for relay_log_purge"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>7

  From MySQL 8.0.26, use `replica_load_tmpdir` in place of `slave_load_tmpdir`, which is deprecated from that release. In releases before MySQL 8.0.26, use `slave_load_tmpdir`.

  `replica_load_tmpdir` specifies the name of the directory where the replica creates temporary files. Setting this variable takes effect for all replication channels immediately, including running channels. The variable value is by default equal to the value of the `tmpdir` system variable, or the default that applies when that system variable is not specified.

  When the replication SQL thread replicates a `LOAD DATA` statement, it extracts the file to be loaded from the relay log into temporary files, and then loads these into the table. If the file loaded on the source is huge, the temporary files on the replica are huge, too. Therefore, it might be advisable to use this option to tell the replica to put temporary files in a directory located in some file system that has a lot of available space. In that case, the relay logs are huge as well, so you might also want to set the `relay_log` system variable to place the relay logs in that file system.

  The directory specified by this option should be located in a disk-based file system (not a memory-based file system) so that the temporary files used to replicate `LOAD DATA` statements can survive machine restarts. The directory also should not be one that is cleared by the operating system during the system startup process. However, replication can now continue after a restart if the temporary files have been removed.

* `replica_max_allowed_packet`

  <table summary="Properties for relay_log_purge"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>8

  From MySQL 8.0.26, use `replica_max_allowed_packet` in place of `slave_max_allowed_packet`, which is deprecated from that release. In releases before MySQL 8.0.26, use `slave_max_allowed_packet`.

  `replica_max_allowed_packet` sets the maximum packet size in bytes that the replication SQL (applier)and I/O (receiver) threads can handle. Setting this variable takes effect for all replication channels immediately, including running channels. It is possible for a source to write binary log events longer than its `max_allowed_packet` setting once the event header is added. The setting for `replica_max_allowed_packet` must be larger than the `max_allowed_packet` setting on the source, so that large updates using row-based replication do not cause replication to fail.

  This global variable always has a value that is a positive integer multiple of 1024; if you set it to some value that is not, the value is rounded down to the next highest multiple of 1024 for it is stored or used; setting `replica_max_allowed_packet` to 0 causes 1024 to be used. (A truncation warning is issued in all such cases.) The default and maximum value is 1073741824 (1 GB); the minimum is 1024.

* `replica_net_timeout`

  <table summary="Properties for relay_log_purge"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>9

  From MySQL 8.0.26, use `replica_net_timeout` in place of `slave_net_timeout`, which is deprecated from that release. In releases before MySQL 8.0.26, use `slave_net_timeout`.

  `replica_net_timeout` specifies the number of seconds to wait for more data or a heartbeat signal from the source before the replica considers the connection broken, aborts the read, and tries to reconnect. Setting this variable has no immediate effect. The state of the variable applies on all subsequent `START REPLICA` commands.

  The default value is 60 seconds (one minute). The first retry occurs immediately after the timeout. The interval between retries is controlled by the `SOURCE_CONNECT_RETRY` option for the `CHANGE REPLICATION SOURCE TO` statement, and the number of reconnection attempts is limited by the `SOURCE_RETRY_COUNT` option.

  The heartbeat interval, which stops the connection timeout occurring in the absence of data if the connection is still good, is controlled by the `SOURCE_HEARTBEAT_PERIOD` option for the `CHANGE REPLICATION SOURCE TO` statement. The heartbeat interval defaults to half the value of `replica_net_timeout`, and it is recorded in the replica's connection metadata repository and shown in the `replication_connection_configuration` Performance Schema table. Note that a change to the value or default setting of `replica_net_timeout` does not automatically change the heartbeat interval, whether that has been set explicitly or is using a previously calculated default. If the connection timeout is changed, you must also issue `CHANGE REPLICATION SOURCE TO` to adjust the heartbeat interval to an appropriate value so that it occurs before the connection timeout.

* `replica_parallel_type`

  <table summary="Properties for relay_log_space_limit"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>0

  From MySQL 8.0.26, use `replica_parallel_type` in place of `slave_parallel_type`, which is deprecated from that release. In releases before MySQL 8.0.26, use `slave_parallel_type`.

  For multithreaded replicas (replicas on which `replica_parallel_workers` or `slave_parallel_workers` is set to a value greater than 0), `replica_parallel_type` specifies the policy used to decide which transactions are allowed to execute in parallel on the replica. The variable has no effect on replicas for which multithreading is not enabled. The possible values are:

  + `LOGICAL_CLOCK`: Transactions are applied in parallel on the replica, based on timestamps which the replication source writes to the binary log. Dependencies between transactions are tracked based on their timestamps to provide additional parallelization where possible.

  + `DATABASE`: Transactions that update different databases are applied in parallel. This value is only appropriate if data is partitioned into multiple databases which are being updated independently and concurrently on the source. There must be no cross-database constraints, as such constraints may be violated on the replica.

  When `replica_preserve_commit_order` or `slave_preserve_commit_order` is enabled, you must use `LOGICAL_CLOCK`. Before MySQL 8.0.27, `DATABASE` is the default. From MySQL 8.0.27, multithreading is enabled by default for replica servers (`replica_parallel_workers=4` by default), and `LOGICAL_CLOCK` is the default. (In MySQL 8.0.27 and later, `replica_preserve_commit_order` is also enabled by default.)

  When the replication topology uses multiple levels of replicas, `LOGICAL_CLOCK` may achieve less parallelization for each level the replica is away from the source. To compensate for this effect, you should set `binlog_transaction_dependency_tracking` to `WRITESET` or `WRITESET_SESSION` on the source *as well as on every intermediate replica* to specify that write sets are used instead of timestamps for parallelization where possible.

  When binary log transaction compression is enabled using the `binlog_transaction_compression` system variable, if `replica_parallel_type` is set to `DATABASE`, all the databases affected by the transaction are mapped before the transaction is scheduled. The use of binary log transaction compression with the `DATABASE` policy can reduce parallelism compared to uncompressed transactions, which are mapped and scheduled for each event.

  `replica_parallel_type` is deprecated beginning with MySQL 8.0.29, as is support for parallelization of transactions using database partitioning. Expect support for these to be removed in a future release, and for `LOGICAL_CLOCK` to be used exclusively thereafter.

* `replica_parallel_workers`

  <table summary="Properties for relay_log_space_limit"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>1

  Beginning with MySQL 8.0.26, `slave_parallel_workers` is deprecated, and you should use `replica_parallel_workers` instead. (Prior to MySQL 8.0.26, you must use `slave_parallel_workers` to set the number of applier threads.)

  `replica_parallel_workers` enables multithreading on the replica and sets the number of applier threads for executing replication transactions in parallel. When the value is greater than or equal to 1, the replica uses the specified number of worker threads to execute transactions, plus a coordinator thread that reads transactions from the relay log and schedules them to workers. When the value is 0, there is only one thread that reads and applies transactions sequentially. If you are using multiple replication channels, the value of this variable applies to the threads used by each channel.

  Prior to MySQL 8.0.27, the default value of this system variable is 0, so replicas use a single worker thread by default. Beginning with MySQL 8.0.27, the default value is 4, which means that replicas are multithreaded by default.

  As of MySQL 8.0.30, setting this variable to 0 is deprecated, raises a warning, and is subject to removal in a future MySQL release. For a single worker, set `replica_parallel_workers` to 1 instead.

  When `replica_preserve_commit_order` (or `slave_preserve_commit_order`) is set to `ON` (the default in MySQL 8.0.27 and later), transactions on a replica are externalized on the replica in the same order as they appear in the replica's relay log. The way in which transactions are distributed among applier threads is determined by `replica_parallel_type` (MySQL 8.0.26 and later) or `slave_parallel_type` (prior to MySQL 8.0.26). Starting with MySQL 8.0.27, these system variables also have appropriate defaults for multithreading.

  To disable parallel execution, set `replica_parallel_workers` to 1, in which case the replica uses one coordinator thread which reads transactions, and one worker thread which applies them, which means that transactions are applied sequentially. When `replica_parallel_workers` is equal to 1, the `replica_parallel_type` (`slave_parallel_type`) and `replica_preserve_commit_order` (`slave_preserve_commit_order`) system variables have no effect and are ignored. If `replica_parallel_workers` is equal to 0 while the `CHANGE REPLICATION SOURCE TO` option `GTID_ONLY` is enabled, the replica has one coordinator thread and one worker thread, exactly as if `replica_parallel_workers` had been set to 1. (`GTID_ONLY` is available in MySQL 8.0.27 and later.) With one parallel worker, the `replica_preserve_commit_order` (`slave_preserve_commit_order`) system variable also has no effect.

  Setting `replica_parallel_workers` has no immediate effect but rather applies to all subsequent `START REPLICA` statements.

  Multithreaded replicas are supported by NDB Cluster beginning with NDB 8.0.33. (Previously, `NDB` silently ignored any setting for `replica_parallel_workers`.) See Section 25.7.11, “NDB Cluster Replication Using the Multithreaded Applier”, for more information.

  Increasing the number of workers improves the potential for parallelism. Typically, this improves performance up to a certain point, beyond which increasing the number of workers reduces performance due to concurrency effects such as lock contention. The ideal number depends on both hardware and workload; it can be difficult to predict and typically has to be found by testing. Tables without primary keys, which always harm performance, may have even greater negative performance impact on replicas having `replica_parallel_workers` > 1; so make sure that all tables have primary keys before enabling this option.

* `replica_pending_jobs_size_max`

  <table summary="Properties for relay_log_space_limit"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>2

  From MySQL 8.0.26, use `replica_pending_jobs_size_max` in place of `slave_pending_jobs_size_max`, which is deprecated from that release. In releases before MySQL 8.0.26, use `slave_pending_jobs_size_max`.

  For multithreaded replicas, this variable sets the maximum amount of memory (in bytes) available to applier queues holding events not yet applied. Setting this variable has no effect on replicas for which multithreading is not enabled. Setting this variable has no immediate effect. The state of the variable applies on all subsequent `START REPLICA` statements.

  The minimum possible value for this variable is 1024 bytes; the default is 128MB. The maximum possible value is 18446744073709551615 (16 exbibytes). Values that are not exact multiples of 1024 bytes are rounded down to the next lower multiple of 1024 bytes prior to being stored.

  The value of this variable is a soft limit and can be set to match the normal workload. If an unusually large event exceeds this size, the transaction is held until all the worker threads have empty queues, and then processed. All subsequent transactions are held until the large transaction has been completed.

* `replica_preserve_commit_order`

  <table summary="Properties for relay_log_space_limit"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>3

  From MySQL 8.0.26, use `replica_preserve_commit_order` in place of `slave_preserve_commit_order`, which is deprecated from that release. In releases before MySQL 8.0.26, use `slave_preserve_commit_order`.

  For multithreaded replicas (replicas on which `replica_parallel_workers` is set to a value greater than 0), setting `replica_preserve_commit_order=ON` ensures that transactions are executed and committed on the replica in the same order as they appear in the replica's relay log. This prevents gaps in the sequence of transactions that have been executed from the replica's relay log, and preserves the same transaction history on the replica as on the source (with the limitations listed below). This variable has no effect on replicas for which multithreading is not enabled.

  Before MySQL 8.0.27, the default for this system variable is `OFF`, meaning that transactions may be committed out of order. From MySQL 8.0.27, multithreading is enabled by default for replica servers (`replica_parallel_workers=4` by default), so `replica_preserve_commit_order=ON` is the default, and the setting `replica_parallel_type=LOGICAL_CLOCK` is also the default. Also from MySQL 8.0.27, the setting for `replica_preserve_commit_order` is ignored if `replica_parallel_workers` is set to 1, because in that situation the order of transactions is preserved anyway.

  Binary logging and replica update logging are not required on the replica to set `replica_preserve_commit_order=ON`, and can be disabled if wanted. Setting `replica_preserve_commit_order=ON` requires that `replica_parallel_type` is set to `LOGICAL_CLOCK`, which is *not* the default setting before MySQL 8.0.27. Before changing the value of `replica_preserve_commit_order` or `replica_parallel_type`, the replication applier thread (for all replication channels if you are using multiple replication channels) must be stopped.

  When `replica_preserve_commit_order=OFF` is set, the transactions that a multithreaded replica applies in parallel may commit out of order. Therefore, checking for the most recently executed transaction does not guarantee that all previous transactions from the source have been executed on the replica. There is a chance of gaps in the sequence of transactions that have been executed from the replica's relay log. This has implications for logging and recovery when using a multithreaded replica. See Section 19.5.1.34, “Replication and Transaction Inconsistencies” for more information.

  When `replica_preserve_commit_order=ON` is set, the executing worker thread waits until all previous transactions are committed before committing. While a given thread is waiting for other worker threads to commit their transactions, it reports its status as `Waiting for preceding transaction to commit`. With this mode, a multithreaded replica never enters a state that the source was not in. This supports the use of replication for read scale-out. See Section 19.4.5, “Using Replication for Scale-Out”.

  Note

  + `replica_preserve_commit_order=ON` does not prevent source binary log position lag, where `Exec_master_log_pos` is behind the position up to which transactions have been executed. See Section 19.5.1.34, “Replication and Transaction Inconsistencies”.

  + `replica_preserve_commit_order=ON` does not preserve the commit order and transaction history if the replica uses filters on its binary log, such as `--binlog-do-db`.

  + `replica_preserve_commit_order=ON` does not preserve the order of non-transactional DML updates. These might commit before transactions that precede them in the relay log, which might result in gaps in the sequence of transactions that have been executed from the replica's relay log.

  + A limitation to preserving the commit order on the replica can occur if statement-based replication is in use, and both transactional and non-transactional storage engines participate in a non-XA transaction that is rolled back on the source. Normally, non-XA transactions that are rolled back on the source are not replicated to the replica, but in this particular situation, the transaction might be replicated to the replica. If this does happen, a multithreaded replica without binary logging does not handle the transaction rollback, so the commit order on the replica diverges from the relay log order of the transactions in that case.

  + *Group Replication—MySQL 9.2.0 and later*: When a group primary is receiving and applying transactions from an external source through an asynchronous channel and a new member joins the group, `replica_preserve_commit_order=ON` is not guaranteed to respect the commit order of non-conflicting transactions. Because of this, there may be temporary states on the secondary that never existed on the source; since this occurs only with regard to non-conflicting transactions, there is no actual divergence.

* `replica_sql_verify_checksum`

  <table summary="Properties for relay_log_space_limit"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>4

  From MySQL 8.0.26, use `replica_sql_verify_checksum` in place of `slave_sql_verify_checksum`, which is deprecated from that release. In releases before MySQL 8.0.26, use `slave_sql_verify_checksum`.

  `slave_sql_verify_checksum` causes the replication SQL (applier) thread to verify data using the checksums read from the relay log. In the event of a mismatch, the replica stops with an error. Setting this variable takes effect for all replication channels immediately, including running channels.

  Note

  The replication I/O (receiver)thread always reads checksums if possible when accepting events from over the network.

* `replica_transaction_retries`

  <table summary="Properties for relay_log_space_limit"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>5

  From MySQL 8.0.26, use `replica_transaction_retries` in place of `slave_transaction_retries`, which is deprecated from that release. In releases before MySQL 8.0.26, use `slave_transaction_retries`.

  `replica_transaction_retries` sets the maximum number of times for replication SQL threads on a single-threaded or multithreaded replica to automatically retry failed transactions before stopping. Setting this variable takes effect for all replication channels immediately, including running channels. The default value is 10. Setting the variable to 0 disables automatic retrying of transactions.

  If a replication SQL thread fails to execute a transaction because of an `InnoDB` deadlock or because the transaction's execution time exceeded `InnoDB`'s `innodb_lock_wait_timeout` or `NDB`'s `TransactionDeadlockDetectionTimeout` or `TransactionInactiveTimeout`, it automatically retries `replica_transaction_retries` times before stopping with an error. Transactions with a non-temporary error are not retried.

  The Performance Schema table `replication_applier_status` shows the number of retries that took place on each replication channel, in the `COUNT_TRANSACTIONS_RETRIES` column. The Performance Schema table `replication_applier_status_by_worker` shows detailed information on transaction retries by individual applier threads on a single-threaded or multithreaded replica, and identifies the errors that caused the last transaction and the transaction currently in progress to be reattempted.

* `replica_type_conversions`

  <table summary="Properties for relay_log_space_limit"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>6

  From MySQL 8.0.26, use `replica_type_conversions` in place of `slave_type_conversions`, which is deprecated from that release. In releases before MySQL 8.0.26, use `slave_type_conversions`.

  `replica_type_conversions` controls the type conversion mode in effect on the replica when using row-based replication. Its value is a comma-delimited set of zero or more elements from the list: `ALL_LOSSY`, `ALL_NON_LOSSY`, `ALL_SIGNED`, `ALL_UNSIGNED`. Set this variable to an empty string to disallow type conversions between the source and the replica. Setting this variable takes effect for all replication channels immediately, including running channels.

  For additional information on type conversion modes applicable to attribute promotion and demotion in row-based replication, see Row-based replication: attribute promotion and demotion.

* `replication_optimize_for_static_plugin_config`

  <table summary="Properties for relay_log_space_limit"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>7

  Use shared locks, and avoid unnecessary lock acquisitions, to improve performance for semisynchronous replication. This setting and `replication_sender_observe_commit_only` help as the number of replicas increases, because contention for locks can slow down performance. While this system variable is enabled, the semisynchronous replication plugin cannot be uninstalled, so you must disable the system variable before the uninstall can complete.

  This system variable can be enabled before or after installing the semisynchronous replication plugin, and can be enabled while replication is running. Semisynchronous replication source servers can also get performance benefits from enabling this system variable, because they use the same locking mechanisms as the replicas.

  `replication_optimize_for_static_plugin_config` can be enabled when Group Replication is in use on a server. In that scenario, it might benefit performance when there is contention for locks due to high workloads.

* `replication_sender_observe_commit_only`

  <table summary="Properties for relay_log_space_limit"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>8

  Limit callbacks to improve performance for semisynchronous replication. This setting and `replication_optimize_for_static_plugin_config` help as the number of replicas increases, because contention for locks can slow down performance.

  This system variable can be enabled before or after installing the semisynchronous replication plugin, and can be enabled while replication is running. Semisynchronous replication source servers can also get performance benefits from enabling this system variable, because they use the same locking mechanisms as the replicas.

* `report_host`

  <table summary="Properties for relay_log_space_limit"><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>9

  The host name or IP address of the replica to be reported to the source during replica registration. This value appears in the output of `SHOW REPLICAS` on the source server. Leave the value unset if you do not want the replica to register itself with the source.

  Note

  It is not sufficient for the source to simply read the IP address of the replica server from the TCP/IP socket after the replica connects. Due to NAT and other routing issues, that IP may not be valid for connecting to the replica from the source or other hosts.

* `report_password`

  <table summary="Properties for replicate-do-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

  The account password of the replica to be reported to the source during replica registration. This value appears in the output of `SHOW REPLICAS` on the source server if the source was started with `--show-replica-auth-info` or `--show-slave-auth-info`.

  Although the name of this variable might imply otherwise, `report_password` is not connected to the MySQL user privilege system and so is not necessarily (or even likely to be) the same as the password for the MySQL replication user account.

* `report_port`

  <table summary="Properties for replicate-do-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

  The TCP/IP port number for connecting to the replica, to be reported to the source during replica registration. Set this only if the replica is listening on a nondefault port or if you have a special tunnel from the source or other clients to the replica. If you are not sure, do not use this option.

  The default value for this option is the port number actually used by the replica. This is also the default value displayed by `SHOW REPLICAS`.

* `report_user`

  <table summary="Properties for replicate-do-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

  The account user name of the replica to be reported to the source during replica registration. This value appears in the output of `SHOW REPLICAS` on the source server if the source was started with `--show-replica-auth-info` or `--show-slave-auth-info`.

  Although the name of this variable might imply otherwise, `report_user` is not connected to the MySQL user privilege system and so is not necessarily (or even likely to be) the same as the name of the MySQL replication user account.

* `rpl_read_size`

  <table summary="Properties for replicate-do-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

  The `rpl_read_size` system variable controls the minimum amount of data in bytes that is read from the binary log files and relay log files. If heavy disk I/O activity for these files is impeding performance for the database, increasing the read size might reduce file reads and I/O stalls when the file data is not currently cached by the operating system.

  The minimum and default value for `rpl_read_size` is 8192 bytes. The value must be a multiple of 4KB. Note that a buffer the size of this value is allocated for each thread that reads from the binary log and relay log files, including dump threads on sources and coordinator threads on replicas. Setting a large value might therefore have an impact on memory consumption for servers.

* `rpl_semi_sync_replica_enabled`

  <table summary="Properties for replicate-do-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

  `rpl_semi_sync_replica_enabled` is available when the `rpl_semi_sync_replica` (`semisync_replica.so` library) plugin was installed on the replica to set up semisynchronous replication. If the `rpl_semi_sync_slave` plugin (`semisync_slave.so` library) was installed, `rpl_semi_sync_slave_enabled` is available instead.

  `rpl_semi_sync_replica_enabled` controls whether semisynchronous replication is enabled on the replica server. To enable or disable the plugin, set this variable to `ON` or `OFF` (or 1 or 0), respectively. The default is `OFF`.

  This variable is available only if the replica-side semisynchronous replication plugin is installed.

* `rpl_semi_sync_replica_trace_level`

  <table summary="Properties for replicate-do-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

  `rpl_semi_sync_replica_trace_level` is available when the `rpl_semi_sync_replica` (`semisync_replica.so` library) plugin was installed on the replica to set up semisynchronous replication. If the `rpl_semi_sync_slave` plugin (`semisync_slave.so` library) was installed, `rpl_semi_sync_slave_trace_level` is available instead.

  `rpl_semi_sync_replica_trace_level` controls the semisynchronous replication debug trace level on the replica server. See `rpl_semi_sync_master_trace_level` for the permissible values.

  This variable is available only if the replica-side semisynchronous replication plugin is installed.

* `rpl_semi_sync_slave_enabled`

  <table summary="Properties for replicate-do-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

  `rpl_semi_sync_slave_enabled` is available when the `rpl_semi_sync_slave` (`semisync_slave.so` library) plugin was installed on the replica to set up semisynchronous replication. If the `rpl_semi_sync_replica` plugin (`semisync_replica.so` library) was installed, `rpl_semi_sync_replica_enabled` is available instead.

  `rpl_semi_sync_slave_enabled` controls whether semisynchronous replication is enabled on the replica server. To enable or disable the plugin, set this variable to `ON` or `OFF` (or 1 or 0), respectively. The default is `OFF`.

  This variable is available only if the replica-side semisynchronous replication plugin is installed.

* `rpl_semi_sync_slave_trace_level`

  <table summary="Properties for replicate-do-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

  `rpl_semi_sync_slave_trace_level` is available when the `rpl_semi_sync_slave` (`semisync_slave.so` library) plugin was installed on the replica to set up semisynchronous replication. If the `rpl_semi_sync_replica` plugin (`semisync_replica.so` library) was installed, `rpl_semi_sync_replica_trace_level` is available instead.

  `rpl_semi_sync_slave_trace_level` controls the semisynchronous replication debug trace level on the replica server. See `rpl_semi_sync_master_trace_level` for the permissible values.

  This variable is available only if the replica-side semisynchronous replication plugin is installed.

* `rpl_stop_replica_timeout`

  <table summary="Properties for replicate-do-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

  From MySQL 8.0.26, use `rpl_stop_replica_timeout` in place of `rpl_stop_slave_timeout`, which is deprecated from that release. In releases before MySQL 8.0.26, use `rpl_stop_slave_timeout`.

  You can control the length of time (in seconds) that `STOP REPLICA` waits before timing out by setting this variable. This can be used to avoid deadlocks between `STOP REPLICA` and other SQL statements using different client connections to the replica.

  The maximum and default value of `rpl_stop_replica_timeout` is 31536000 seconds (1 year). The minimum is 2 seconds. Changes to this variable take effect for subsequent `STOP REPLICA` statements.

  This variable affects only the client that issues a `STOP REPLICA` statement. When the timeout is reached, the issuing client returns an error message stating that the command execution is incomplete. The client then stops waiting for the replication I/O (receiver)and SQL (applier) threads to stop, but the replication threads continue to try to stop, and the `STOP REPLICA` statement remains in effect. Once the replication threads are no longer busy, the `STOP REPLICA` statement is executed and the replica stops.

* `rpl_stop_slave_timeout`

  <table summary="Properties for replicate-do-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>9

  From MySQL 8.0.26, `rpl_stop_slave_timeout` is deprecated and the alias `rpl_stop_replica_timeout` should be used instead. In releases before MySQL 8.0.26, use `rpl_stop_slave_timeout`.

  You can control the length of time (in seconds) that `STOP REPLICA` waits before timing out by setting this variable. This can be used to avoid deadlocks between `STOP REPLICA` and other SQL statements using different client connections to the replica.

  The maximum and default value of `rpl_stop_slave_timeout` is 31536000 seconds (1 year). The minimum is 2 seconds. Changes to this variable take effect for subsequent `STOP REPLICA` statements.

  This variable affects only the client that issues a `STOP REPLICA` statement. When the timeout is reached, the issuing client returns an error message stating that the command execution is incomplete. The client then stops waiting for the replication I/O (receiver) and SQL (applier) threads to stop, but the replication threads continue to try to stop, and the `STOP REPLICA` instruction remains in effect. Once the replication threads are no longer busy, the `STOP REPLICA` statement is executed and the replica stops.

* `skip_replica_start`

  <table summary="Properties for replicate-ignore-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

  From MySQL 8.0.26, use `skip_replica_start` in place of `skip_slave_start`, which is deprecated from that release. In releases before MySQL 8.0.26, use `skip_slave_start`.

  `skip_replica_start` tells the replica server not to start the replication I/O (receiver) and SQL (applier) threads when the server starts. To start the threads later, use a `START REPLICA`  statement.

  This system variable is read-only and can be set by using the `PERSIST_ONLY` keyword or the `@@persist_only` qualifier with the `SET` statement. The `--skip-replica-start` command line option also sets this system variable. You can use the system variable in place of the command line option to allow access to this feature using MySQL Server’s privilege structure, so that database administrators do not need any privileged access to the operating system.

* `skip_slave_start`

  <table summary="Properties for replicate-ignore-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

  From MySQL 8.0.26, `skip_slave_start` is deprecated and the alias `skip_replica_start` should be used instead. In releases before MySQL 8.0.26, use `skip_slave_start`.

  Tells the replica server not to start the replication I/O (receiver) and SQL (applier) threads when the server starts. To start the threads later, use a `START REPLICA` statement.

  This system variable is available from MySQL 8.0.24. It is read-only and can be set by using the `PERSIST_ONLY` keyword or the `@@persist_only` qualifier with the `SET` statement. The `--skip-slave-start` command line option also sets this system variable. You can use the system variable in place of the command line option to allow access to this feature using MySQL Server’s privilege structure, so that database administrators do not need any privileged access to the operating system.

* `slave_checkpoint_group`

  <table summary="Properties for replicate-ignore-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

  From MySQL 8.0.26, `slave_checkpoint_group` is deprecated and the alias `replica_checkpoint_group` should be used instead. In releases before MySQL 8.0.26, use `slave_checkpoint_group`.

  `slave_checkpoint_group` sets the maximum number of transactions that can be processed by a multithreaded replica before a checkpoint operation is called to update its status as shown by `SHOW REPLICA STATUS`. Setting this variable has no effect on replicas for which multithreading is not enabled. Setting this variable has no immediate effect. The state of the variable applies on all subsequent `START REPLICA` statements.

  Previously, multithreaded replicas were not supported by NDB Cluster, which silently ignored the setting for this variable. This restriction was lifted in MySQL 8.0.33.

  This variable works in combination with the `slave_checkpoint_period` system variable in such a way that, when either limit is exceeded, the checkpoint is executed and the counters tracking both the number of transactions and the time elapsed since the last checkpoint are reset.

  The minimum allowed value for this variable is 32, unless the server was built using `-DWITH_DEBUG`, in which case the minimum value is 1. The effective value is always a multiple of 8; you can set it to a value that is not such a multiple, but the server rounds it down to the next lower multiple of 8 before storing the value. (*Exception*: No such rounding is performed by the debug server.) Regardless of how the server was built, the default value is 512, and the maximum allowed value is 524280.

* `slave_checkpoint_period`

  <table summary="Properties for replicate-ignore-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

  As of MySQL 8.0.26, `slave_checkpoint_period` is deprecated, and `replica_checkpoint_period` should be used instead; prior to MySQL 8.0.26, use `slave_checkpoint_period`.

  `slave_checkpoint_period` sets the maximum time (in milliseconds) that is allowed to pass before a checkpoint operation is called to update the status of a multithreaded replica as shown by `SHOW REPLICA STATUS`. Setting this variable has no effect on replicas for which multithreading is not enabled. Setting this variable takes effect for all replication channels immediately, including running channels.

  Previously, multithreaded replicas were not supported by NDB Cluster, which silently ignored the setting for this variable. This restriction was lifted in MySQL 8.0.33.

  This variable works in combination with the `slave_checkpoint_group` system variable in such a way that, when either limit is exceeded, the checkpoint is executed and the counters tracking both the number of transactions and the time elapsed since the last checkpoint are reset.

  The minimum allowed value for this variable is 1, unless the server was built using `-DWITH_DEBUG`, in which case the minimum value is 0. Regardless of how the server was built, the default value is 300 milliseconds, and the maximum possible value is 4294967295 milliseconds (approximately 49.7 days).

* `slave_compressed_protocol`

  <table summary="Properties for replicate-ignore-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

  `slave_compressed_protocol` is deprecated, and from MySQL 8.0.26, the alias `replica_compressed_protocol` should be used instead. In releases before MySQL 8.0.26, use `slave_compressed_protocol`.

  `slave_compressed_protocol` controls whether to use compression of the source/replica connection protocol if both source and replica support it. If this variable is disabled (the default), connections are uncompressed. Changes to this variable take effect on subsequent connection attempts; this includes after issuing a `START REPLICA` statement, as well as reconnections made by a running replication I/O (receiver) thread.

  Binary log transaction compression (available as of MySQL 8.0.20), which is activated by the `binlog_transaction_compression` system variable, can also be used to save bandwidth. If you use binary log transaction compression in combination with protocol compression, protocol compression has less opportunity to act on the data, but can still compress headers and those events and transaction payloads that are uncompressed. For more information on binary log transaction compression, see Section 7.4.4.5, “Binary Log Transaction Compression”.

  As of MySQL 8.0.18, if `slave_compressed_protocol` is enabled, it takes precedence over any `SOURCE_COMPRESSION_ALGORITHMS` | `MASTER_COMPRESSION_ALGORITHMS` option specified for the `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` statement. In this case, connections to the source use `zlib` compression if both the source and replica support that algorithm. If `slave_compressed_protocol` is disabled, the value of `SOURCE_COMPRESSION_ALGORITHMS` | `MASTER_COMPRESSION_ALGORITHMS` applies. For more information, see Section 6.2.8, “Connection Compression Control”.

  As of MySQL 8.0.18, this system variable is deprecated. You should expect it to be removed in a future version of MySQL. See Configuring Legacy Connection Compression.

* `slave_exec_mode`

  <table summary="Properties for replicate-ignore-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

  From MySQL 8.0.26, `slave_exec_mode` is deprecated and the alias `replica_exec_mode` should be used instead. In releases before MySQL 8.0.26, use `slave_exec_mode`.

  `slave_exec_mode` controls how a replication thread resolves conflicts and errors during replication. `IDEMPOTENT` mode causes suppression of duplicate-key and no-key-found errors; `STRICT` means no such suppression takes place.

  `IDEMPOTENT` mode is intended for use in multi-source replication, circular replication, and some other special replication scenarios for NDB Cluster Replication. (See Section 25.7.10, “NDB Cluster Replication: Bidirectional and Circular Replication”, and Section 25.7.12, “NDB Cluster Replication Conflict Resolution”, for more information.) NDB Cluster ignores any value explicitly set for `slave_exec_mode`, and always treats it as `IDEMPOTENT`.

  In MySQL Server 8.0, `STRICT` mode is the default value.

  Setting this variable takes immediate effect for all replication channels, including running channels.

  For storage engines other than `NDB`, *`IDEMPOTENT` mode should be used only when you are absolutely sure that duplicate-key errors and key-not-found errors can safely be ignored*. It is meant to be used in fail-over scenarios for NDB Cluster where multi-source replication or circular replication is employed, and is not recommended for use in other cases.

* `slave_load_tmpdir`

  <table summary="Properties for replicate-ignore-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

  From MySQL 8.0.26, `slave_load_tmpdir` is deprecated and the alias `replica_load_tmpdir` should be used instead. In releases before MySQL 8.0.26, use `slave_load_tmpdir`.

  `slave_load_tmpdir` specifies the name of the directory where the replica creates temporary files. Setting this variable takes effect for all replication channels immediately, including running channels. The variable value is by default equal to the value of the `tmpdir` system variable, or the default that applies when that system variable is not specified.

  When the replication SQL thread replicates a `LOAD DATA` statement, it extracts the file to be loaded from the relay log into temporary files, and then loads these into the table. If the file loaded on the source is huge, the temporary files on the replica are huge, too. Therefore, it might be advisable to use this option to tell the replica to put temporary files in a directory located in some file system that has a lot of available space. In that case, the relay logs are huge as well, so you might also want to set the `relay_log` system variable to place the relay logs in that file system.

  The directory specified by this option should be located in a disk-based file system (not a memory-based file system) so that the temporary files used to replicate `LOAD DATA` statements can survive machine restarts. The directory also should not be one that is cleared by the operating system during the system startup process. However, replication can now continue after a restart if the temporary files have been removed.

* `slave_max_allowed_packet`

  <table summary="Properties for replicate-ignore-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

  From MySQL 8.0.26, `slave_max_allowed_packet` is deprecated and the alias `replica_max_allowed_packet` should be used instead. In releases before MySQL 8.0.26, use `slave_max_allowed_packet`.

  `slave_max_allowed_packet` sets the maximum packet size in bytes that the replication SQL (applier) and I/O (receiver) threads can handle. Setting this variable takes effect for all replication channels immediately, including running channels. It is possible for a source to write binary log events longer than its `max_allowed_packet` setting once the event header is added. The setting for `slave_max_allowed_packet` must be larger than the `max_allowed_packet` setting on the source, so that large updates using row-based replication do not cause replication to fail.

  This global variable always has a value that is a positive integer multiple of 1024; if you set it to some value that is not, the value is rounded down to the next highest multiple of 1024 for it is stored or used; setting `slave_max_allowed_packet` to 0 causes 1024 to be used. (A truncation warning is issued in all such cases.) The default and maximum value is 1073741824 (1 GB); the minimum is 1024.

* `slave_net_timeout`

  <table summary="Properties for replicate-ignore-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

  From MySQL 8.0.26, `slave_net_timeout` is deprecated and the alias `replica_net_timeout` should be used instead. In releases before MySQL 8.0.26, use `slave_net_timeout`.

  `slave_net_timeout` specifies the number of seconds to wait for more data or a heartbeat signal from the source before the replica considers the connection broken, aborts the read, and tries to reconnect. Setting this variable has no immediate effect. The state of the variable applies on all subsequent `START REPLICA` commands.

  The default value is 60 seconds (one minute). The first retry occurs immediately after the timeout. The interval between retries is controlled by the `SOURCE_CONNECT_RETRY` | `MASTER_CONNECT_RETRY` option for the `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` statement, and the number of reconnection attempts is limited by the `SOURCE_RETRY_COUNT` | `MASTER_RETRY_COUNT` option.

  The heartbeat interval, which stops the connection timeout occurring in the absence of data if the connection is still good, is controlled by the `SOURCE_HEARTBEAT_PERIOD` | `MASTER_HEARTBEAT_PERIOD` option for the `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` statement. The heartbeat interval defaults to half the value of `slave_net_timeout`, and it is recorded in the replica's connection metadata repository and shown in the `replication_connection_configuration` Performance Schema table. Note that a change to the value or default setting of `slave_net_timeout` does not automatically change the heartbeat interval, whether that has been set explicitly or is using a previously calculated default. If the connection timeout is changed, you must also issue `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` to adjust the heartbeat interval to an appropriate value so that it occurs before the connection timeout.

* `slave_parallel_type`

  <table summary="Properties for replicate-ignore-db"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>9

  From MySQL 8.0.26, `slave_parallel_type` is deprecated and the alias `replica_parallel_type` should be used instead. In releases before MySQL 8.0.26, use `slave_parallel_type`.

  For multithreaded replicas (replicas on which `replica_parallel_workers` or `slave_parallel_workers` is set to a value greater than 0), `slave_parallel_type` specifies the policy used to decide which transactions are allowed to execute in parallel on the replica. The variable has no effect on replicas for which multithreading is not enabled. The possible values are:

  + `LOGICAL_CLOCK`: Transactions that are part of the same binary log group commit on a source are applied in parallel on a replica. The dependencies between transactions are tracked based on their timestamps to provide additional parallelization where possible. When this value is set, the `binlog_transaction_dependency_tracking` system variable can be used on the source to specify that write sets are used for parallelization in place of timestamps, if a write set is available for the transaction and gives improved results compared to timestamps.

  + `DATABASE`: Transactions that update different databases are applied in parallel. This value is only appropriate if data is partitioned into multiple databases which are being updated independently and concurrently on the source. There must be no cross-database constraints, as such constraints may be violated on the replica.

  When `replica_preserve_commit_order=ON` or `slave_preserve_commit_order` is `ON`, you must use `LOGICAL_CLOCK`. Before MySQL 8.0.27, `DATABASE` is the default. From MySQL 8.0.27, multithreading is enabled by default for replica servers (`replica_parallel_workers=4` by default), so `LOGICAL_CLOCK` is the default, and the setting `replica_preserve_commit_order=ON` is also the default.

  All replication applier threads must be stopped prior to setting `slave_parallel_type`.

  When your replication topology uses multiple levels of replicas, `LOGICAL_CLOCK` may achieve less parallelization for each level the replica is away from the source. You can reduce this effect by using `binlog_transaction_dependency_tracking` on the source to specify that write sets are used instead of timestamps for parallelization where possible.

  When binary log transaction compression is enabled using the `binlog_transaction_compression` system variable, if `replica_parallel_type` or `slave_parallel_type` is set to `DATABASE`, all the databases affected by the transaction are mapped before the transaction is scheduled. The use of binary log transaction compression with the `DATABASE` policy can reduce parallelism compared to uncompressed transactions, which are mapped and scheduled for each event.

* `slave_parallel_workers`

  <table summary="Properties for replicate-do-table"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

  From MySQL 8.0.26, `slave_parallel_workers` is deprecated and the alias `replica_parallel_workers` should be used instead. In releases before MySQL 8.0.26, use `slave_parallel_workers`.

  `slave_parallel_workers` enables multithreading on the replica and sets the number of applier threads for executing replication transactions in parallel. When the value is a number greater than 0, the replica is a multithreaded replica with the specified number of applier threads, plus a coordinator thread to manage them. If you are using multiple replication channels, each channel has this number of threads.

  Before MySQL 8.0.27, the default for this system variable is 0, so replicas are not multithreaded by default. From MySQL 8.0.27, the default is 4, so replicas are multithreaded by default.

  Retrying of transactions is supported when multithreading is enabled on a replica. When `replica_preserve_commit_order=ON` or `slave_preserve_commit_order=ON` is set, transactions on a replica are externalized on the replica in the same order as they appear in the replica's relay log. The way in which transactions are distributed among applier threads is configured by `replica_parallel_type` (from MySQL 8.0.26) or `slave_parallel_type` (before MySQL 8.0.26). From MySQL 8.0.27, these system variables also have appropriate defaults for multithreading.

  To disable parallel execution, set `replica_parallel_workers` to 0, which gives the replica a single applier thread and no coordinator thread. With this setting, the `replica_parallel_type` or `slave_parallel_type` and `replica_preserve_commit_order` or `slave_preserve_commit_order` system variables have no effect and are ignored. From MySQL 8.0.27, if parallel execution is disabled when the `CHANGE REPLICATION SOURCE TO` option `GTID_ONLY` is enabled on a replica, the replica actually uses one parallel worker to take advantage of the method for retrying transactions without accessing the file positions. With one parallel worker, the `replica_preserve_commit_order` (`slave_preserve_commit_order`) system variable also has no effect.

  Setting `replica_parallel_workers` has no immediate effect. The state of the variable applies on all subsequent `START REPLICA` statements.

  Previously, multithreaded replicas were not supported by NDB Cluster, which silently ignored the setting for this variable. This restriction was lifted in MySQL 8.0.33.

* `slave_pending_jobs_size_max`

  <table summary="Properties for replicate-do-table"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

  From MySQL 8.0.26, `slave_pending_jobs_size_max` is deprecated and the alias `replica_pending_jobs_size_max` should be used instead. In releases before MySQL 8.0.26, use `slave_pending_jobs_size_max`.

  For multithreaded replicas, this variable sets the maximum amount of memory (in bytes) available to applier queues holding events not yet applied. Setting this variable has no effect on replicas for which multithreading is not enabled. Setting this variable has no immediate effect. The state of the variable applies on all subsequent `START REPLICA` commands.

  The minimum possible value for this variable is 1024 bytes; the default is 128MB. The maximum possible value is 18446744073709551615 (16 exbibytes). Values that are not exact multiples of 1024 bytes are rounded down to the next lower multiple of 1024 bytes prior to being stored.

  The value of this variable is a soft limit and can be set to match the normal workload. If an unusually large event exceeds this size, the transaction is held until all the worker threads have empty queues, and then processed. All subsequent transactions are held until the large transaction has been completed.

* `slave_preserve_commit_order`

  <table summary="Properties for replicate-do-table"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

  From MySQL 8.0.26, `slave_preserve_commit_order` is deprecated and the alias `replica_preserve_commit_order` should be used instead. In releases before MySQL 8.0.26, use `slave_preserve_commit_order`.

  For multithreaded replicas (replicas on which `replica_parallel_workers` or `slave_parallel_workers` is set to a value greater than 0), setting `slave_preserve_commit_order=1` ensures that transactions are executed and committed on the replica in the same order as they appear in the replica's relay log. This prevents gaps in the sequence of transactions that have been executed from the replica's relay log, and preserves the same transaction history on the replica as on the source (with the limitations listed below). This variable has no effect on replicas for which multithreading is not enabled.

  Before MySQL 8.0.27, the default for this system variable is `OFF`, meaning that transactions may be committed out of order. From MySQL 8.0.27, multithreading is enabled by default for replica servers (`replica_parallel_workers=4` by default), so `slave_preserve_commit_order=ON` is the default, and the setting `slave_parallel_type=LOGICAL_CLOCK` is also the default. Also from MySQL 8.0.27, the setting for `slave_preserve_commit_order` is ignored if `slave_parallel_workers` is set to 1, because in that situation the order of transactions is preserved anyway.

  Up to and including MySQL 8.0.18, setting `slave_preserve_commit_order=ON` requires that binary logging (`log_bin`) and replica update logging (`log_slave_updates`) are enabled on the replica, which are the default settings from MySQL 8.0. From MySQL 8.0.19, binary logging and replica update logging are not required on the replica to set `slave_preserve_commit_order=ON`, and can be disabled if wanted. In all releases, setting `slave_preserve_commit_order=ON` requires that `slave_parallel_type` is set to `LOGICAL_CLOCK`, which is *not* the default setting before MySQL 8.0.27. Before changing the value of `slave_preserve_commit_order` or `slave_parallel_type`, the replication applier thread (for all replication channels if you are using multiple replication channels) must be stopped.

  When `slave_preserve_commit_order=OFF` is set, which is the default, the transactions that a multithreaded replica applies in parallel may commit out of order. Therefore, checking for the most recently executed transaction does not guarantee that all previous transactions from the source have been executed on the replica. There is a chance of gaps in the sequence of transactions that have been executed from the replica's relay log. This has implications for logging and recovery when using a multithreaded replica. See Section 19.5.1.34, “Replication and Transaction Inconsistencies” for more information.

  When `slave_preserve_commit_order` is `ON`, the executing worker thread waits until all previous transactions are committed before committing. While a given thread is waiting for other worker threads to commit their transactions, it reports its status as `Waiting for preceding transaction to commit`. With this mode, a multithreaded replica never enters a state that the source was not in. This supports the use of replication for read scale-out. See Section 19.4.5, “Using Replication for Scale-Out”.

  Note

  + `slave_preserve_commit_order=ON` does not prevent source binary log position lag, where `Exec_master_log_pos` is behind the position up to which transactions have been executed. See Section 19.5.1.34, “Replication and Transaction Inconsistencies”.

  + `slave_preserve_commit_order=ON` does not preserve the commit order and transaction history if the replica uses filters on its binary log, such as `--binlog-do-db`.

  + `slave_preserve_commit_order=ON` does not preserve the order of non-transactional DML updates. These might commit before transactions that precede them in the relay log, which might result in gaps in the sequence of transactions that have been executed from the replica's relay log.

  + In releases before MySQL 8.0.19, `slave_preserve_commit_order=ON` does not preserve the order of statements with an `IF EXISTS` clause when the object concerned does not exist. These might commit before transactions that precede them in the relay log, which might result in gaps in the sequence of transactions that have been executed from the replica's relay log.

  + A limitation to preserving the commit order on the replica can occur if statement-based replication is in use, and both transactional and non-transactional storage engines participate in a non-XA transaction that is rolled back on the source. Normally, non-XA transactions that are rolled back on the source are not replicated to the replica, but in this particular situation, the transaction might be replicated to the replica. If this does happen, a multithreaded replica without binary logging does not handle the transaction rollback, so the commit order on the replica diverges from the relay log order of the transactions in that case.

* `slave_rows_search_algorithms`

  <table summary="Properties for replicate-do-table"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

  When preparing batches of rows for row-based logging and replication, this system variable controls how the rows are searched for matches, in particular whether hash scans are used. The use of this system variable is now deprecated. The default setting `INDEX_SCAN,HASH_SCAN` is optimal for performance and works correctly in all scenarios. See Section 19.5.1.27, “Replication and Row Searches”.

* `slave_skip_errors`

  <table summary="Properties for replicate-do-table"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

  From MySQL 8.0.26, `slave_skip_errors` is deprecated and the alias `replica_skip_errors` should be used instead. In releases before MySQL 8.0.26, use `slave_skip_errors`.

  Normally, replication stops when an error occurs on the replica, which gives you the opportunity to resolve the inconsistency in the data manually. This variable causes the replication SQL thread to continue replication when a statement returns any of the errors listed in the variable value.

* `replica_skip_errors`

  <table summary="Properties for replicate-do-table"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

  From MySQL 8.0.26, use `replica_skip_errors` in place of `slave_skip_errors`, which is deprecated from that release. In releases before MySQL 8.0.26, use `slave_skip_errors`.

  Normally, replication stops when an error occurs on the replica, which gives you the opportunity to resolve the inconsistency in the data manually. This variable causes the replication SQL thread to continue replication when a statement returns any of the errors listed in the variable value.

* `slave_sql_verify_checksum`

  <table summary="Properties for replicate-do-table"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

  From MySQL 8.0.26, `slave_sql_verify_checksum` is deprecated and the alias `replica_sql_verify_checksum` should be used instead. In releases before MySQL 8.0.26, use `slave_sql_verify_checksum`.

  `slave_sql_verify_checksum` causes the replication SQL thread to verify data using the checksums read from the relay log. In the event of a mismatch, the replica stops with an error. Setting this variable takes effect for all replication channels immediately, including running channels.

  Note

  The replication I/O (receiver) thread always reads checksums if possible when accepting events from over the network.

* `slave_transaction_retries`

  <table summary="Properties for replicate-do-table"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

  From MySQL 8.0.26, `slave_transaction_retries` is deprecated and the alias `replica_transaction_retries` should be used instead. In releases before MySQL 8.0.26, use `slave_transaction_retries`.

  `slave_transaction_retries` sets the maximum number of times for replication SQL threads on a single-threaded or multithreaded replica to automatically retry failed transactions before stopping. Setting this variable takes effect for all replication channels immediately, including running channels. The default value is 10. Setting the variable to 0 disables automatic retrying of transactions.

  If a replication SQL thread fails to execute a transaction because of an `InnoDB` deadlock or because the transaction's execution time exceeded `InnoDB`'s `innodb_lock_wait_timeout` or `NDB`'s `TransactionDeadlockDetectionTimeout` or `TransactionInactiveTimeout`, it automatically retries `slave_transaction_retries` times before stopping with an error. Transactions with a non-temporary error are not retried.

  The Performance Schema table `replication_applier_status` shows the number of retries that took place on each replication channel, in the `COUNT_TRANSACTIONS_RETRIES` column. The Performance Schema table `replication_applier_status_by_worker` shows detailed information on transaction retries by individual applier threads on a single-threaded or multithreaded replica, and identifies the errors that caused the last transaction and the transaction currently in progress to be reattempted.

* `slave_type_conversions`

  <table summary="Properties for replicate-do-table"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

  From MySQL 8.0.26, `slave_type_conversions` is deprecated and the alias `replica_type_conversions` should be used instead. In releases before MySQL 8.0.26, use `slave_type_conversions`.

  `slave_type_conversions` controls the type conversion mode in effect on the replica when using row-based replication. Its value is a comma-delimited set of zero or more elements from the list: `ALL_LOSSY`, `ALL_NON_LOSSY`, `ALL_SIGNED`, `ALL_UNSIGNED`. Set this variable to an empty string to disallow type conversions between the source and the replica. Setting this variable takes effect for all replication channels immediately, including running channels.

  For additional information on type conversion modes applicable to attribute promotion and demotion in row-based replication, see Row-based replication: attribute promotion and demotion.

* `sql_replica_skip_counter`

  <table summary="Properties for replicate-do-table"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>9

  From MySQL 8.0.26, use `sql_replica_skip_counter` in place of `sql_slave_skip_counter`, which is deprecated from that release. In releases before MySQL 8.0.26, use `sql_slave_skip_counter`.

  `sql_replica_skip_counter` specifies the number of events from the source that a replica should skip. Setting the option has no immediate effect. The variable applies to the next `START REPLICA` statement; the next `START REPLICA` statement also changes the value back to 0. When this variable is set to a nonzero value and there are multiple replication channels configured, the `START REPLICA` statement can only be used with the `FOR CHANNEL channel` clause.

  This option is incompatible with GTID-based replication, and must not be set to a nonzero value when `gtid_mode=ON` is set. If you need to skip transactions when employing GTIDs, use `gtid_executed` from the source instead. If you have enabled GTID assignment on a replication channel using the `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` option of the `CHANGE REPLICATION SOURCE TO` statement, `sql_replica_skip_counter` is available. See Section 19.1.7.3, “Skipping Transactions”.

  Important

  If skipping the number of events specified by setting this variable would cause the replica to begin in the middle of an event group, the replica continues to skip until it finds the beginning of the next event group and begins from that point. For more information, see Section 19.1.7.3, “Skipping Transactions”.

* `sql_slave_skip_counter`

  <table summary="Properties for replicate-ignore-table"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

  From MySQL 8.0.26, `sql_slave_skip_counter` is deprecated and the alias `sql_replica_skip_counter` should be used instead. In releases before MySQL 8.0.26, use `sql_slave_skip_counter`.

  `sql_slave_skip_counter` specifies the number of events from the source that a replica should skip. Setting the option has no immediate effect. The variable applies to the next `START REPLICA` statement; the next `START REPLICA` statement also changes the value back to 0. When this variable is set to a nonzero value and there are multiple replication channels configured, the `START REPLICA` statement can only be used with the `FOR CHANNEL channel` clause.

  This option is incompatible with GTID-based replication, and must not be set to a nonzero value when `gtid_mode=ON` is set. If you need to skip transactions when employing GTIDs, use `gtid_executed` from the source instead. If you have enabled GTID assignment on a replication channel using the `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` option of the `CHANGE REPLICATION SOURCE TO` statement, `sql_slave_skip_counter` is available. See Section 19.1.7.3, “Skipping Transactions”.

  Important

  If skipping the number of events specified by setting this variable would cause the replica to begin in the middle of an event group, the replica continues to skip until it finds the beginning of the next event group and begins from that point. For more information, see Section 19.1.7.3, “Skipping Transactions”.

* `sync_master_info`

  <table summary="Properties for replicate-ignore-table"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

  From MySQL 8.0.26, `sync_master_info` is deprecated and the alias `sync_source_info` should be used instead. In releases before MySQL 8.0.26, use `sync_master_info`.

  `sync_master_info` specifies the number of events after which the replica updates the connection metadata repository. When the connection metadata repository is stored as an `InnoDB` table, which is the default from MySQL 8.0, it is updated after this number of events. If the connection metadata repository is stored as a file, which is deprecated from MySQL 8.0, the replica synchronizes its `master.info` file to disk (using `fdatasync()`) after this number of events. The default value is 10000, and a zero value means that the repository is never updated. Setting this variable takes effect for all replication channels immediately, including running channels.

* `sync_relay_log`

  <table summary="Properties for replicate-ignore-table"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

  If the value of this variable is greater than 0, the MySQL server synchronizes its relay log to disk (using `fdatasync()`) after every `sync_relay_log` events are written to the relay log. Setting this variable takes effect for all replication channels immediately, including running channels.

  Setting `sync_relay_log` to 0 causes no synchronization to be done to disk; in this case, the server relies on the operating system to flush the relay log's contents from time to time as for any other file.

  A value of 1 is the safest choice because in the event of an unexpected halt you lose at most one event from the relay log. However, it is also the slowest choice (unless the disk has a battery-backed cache, which makes synchronization very fast). For information on the combination of settings on a replica that is most resilient to unexpected halts, see Section 19.4.2, “Handling an Unexpected Halt of a Replica”.

* `sync_relay_log_info`

  <table summary="Properties for replicate-ignore-table"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

  The number of transactions after which the replica updates the applier metadata repository. When the applier metadata repository is stored as an `InnoDB` table (the default in MySQL 8.0 and later), it is updated after every transaction and this system variable is ignored. If the applier metadata repository is stored as a file (deprecated in MySQL 8.0), the replica synchronizes its `relay-log.info` file to disk (using `fdatasync()`) after this many transactions. `0` (zero) means that the file contents are flushed by the operating system only. Setting this variable takes effect for all replication channels immediately, including running channels.

  Since storing applier metadata as a file is deprecated, this variable is also deprecated; as of MySQL 8.0.34, the server raises a warning whenever you set it or read its value. You should expect `sync_relay_log_info` to be removed in a future version of MySQL, and migrate applications now that may depend on it.

* `sync_source_info`

  <table summary="Properties for replicate-ignore-table"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

  From MySQL 8.0.26, use `sync_source_info` in place of `sync_master_info`, which is deprecated from that release. In releases before MySQL 8.0.26, use `sync_source_info`.

  `sync_source_info` specifies the number of events after which the replica updates the connection metadata repository. When the connection metadata repository is stored as an `InnoDB` table, which is the default from MySQL 8.0, it is updated after this number of events. If the connection metadata repository is stored as a file, which is deprecated from MySQL 8.0, the replica synchronizes its `master.info` file to disk (using `fdatasync()`) after this number of events. The default value is 10000, and a zero value means that the repository is never updated. Setting this variable takes effect for all replication channels immediately, including running channels.

* `terminology_use_previous`

  <table summary="Properties for replicate-ignore-table"><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

  In MySQL 8.0.26, incompatible changes were made to instrumentation names containing the terms `master`, `slave`, and `mts` (for “Multi-Threaded Slave”), which were changed respectively to `source`, `replica`, and `mta` (for “Multi-Threaded Applier”). If these incompatible changes impact your applications, set the `terminology_use_previous` system variable to `BEFORE_8_0_26` to make MySQL Server use the old versions of the names for the objects specified in the previous list. This enables monitoring tools that rely on the old names to continue working until they can be updated to use the new names.

  Set the `terminology_use_previous` system variable with session scope to support individual users, or with global scope to be the default for all new sessions. When global scope is used, the slow query log contains the old versions of the names.

  The affected instrumentation names are given in the following list. The `terminology_use_previous` system variable only affects these items. It does not affect the new aliases for system variables, status variables, and command-line options that were also introduced in MySQL 8.0.26, and these can still be used when it is set.

  + Instrumented locks (mutexes), visible in the `mutex_instances` and `events_waits_*` Performance Schema tables with the prefix `wait/synch/mutex/`

  + Read/write locks, visible in the `rwlock_instances` and `events_waits_*` Performance Schema tables with the prefix `wait/synch/rwlock/`

  + Instrumented condition variables, visible in the `cond_instances` and `events_waits_*` Performance Schema tables with the prefix `wait/synch/cond/`

  + Instrumented memory allocations, visible in the `memory_summary_*` Performance Schema tables with the prefix `memory/sql/`

  + Thread names, visible in the `threads` Performance Schema table with the prefix `thread/sql/`

  + Thread stages, visible in the `events_stages_*` Performance Schema tables with the prefix `stage/sql/`, and without the prefix in the `threads` and `processlist` Performance Schema tables, the output from the `SHOW PROCESSLIST` statement, the Information Schema `processlist` table, and the slow query log

  + Thread commands, visible in the `events_statements_history*` and `events_statements_summary_*_by_event_name` Performance Schema tables with the prefix `statement/com/`, and without the prefix in the `threads` and `processlist` Performance Schema tables, the output from the `SHOW PROCESSLIST` statement, the Information Schema `processlist` table, and the output from the `SHOW REPLICA STATUS` statement
