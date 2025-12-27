#### 5.4.4.2 Setting The Binary Log Format

You can select the binary logging format explicitly by starting the MySQL server with [`--binlog-format=type`](replication-options-binary-log.html#sysvar_binlog_format). The supported values for *`type`* are:

* `STATEMENT` causes logging to be statement based.

* `ROW` causes logging to be row based.
* `MIXED` causes logging to use mixed format.

Setting the binary logging format does not activate binary logging for the server. The setting only takes effect when binary logging is enabled on the server, which is the case when the [`log_bin`](replication-options-binary-log.html#sysvar_log_bin) system variable is set to `ON`. In MySQL 5.7, binary logging is not enabled by default, and you enable it using the [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) option.

The logging format also can be switched at runtime, although note that there are a number of situations in which you cannot do this, as discussed later in this section. Set the global value of the [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) system variable to specify the format for clients that connect subsequent to the change:

```sql
mysql> SET GLOBAL binlog_format = 'STATEMENT';
mysql> SET GLOBAL binlog_format = 'ROW';
mysql> SET GLOBAL binlog_format = 'MIXED';
```

An individual client can control the logging format for its own statements by setting the session value of [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format):

```sql
mysql> SET SESSION binlog_format = 'STATEMENT';
mysql> SET SESSION binlog_format = 'ROW';
mysql> SET SESSION binlog_format = 'MIXED';
```

Changing the global [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) value requires privileges sufficient to set global system variables. Changing the session [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) value requires privileges sufficient to set restricted session system variables. See [Section 5.1.8.1, “System Variable Privileges”](system-variable-privileges.html "5.1.8.1 System Variable Privileges").

There are several reasons why a client might want to set binary logging on a per-session basis:

* A session that makes many small changes to the database might want to use row-based logging.

* A session that performs updates that match many rows in the `WHERE` clause might want to use statement-based logging because it is more efficient to log a few statements than many rows.

* Some statements require a lot of execution time on the source, but result in just a few rows being modified. It might therefore be beneficial to replicate them using row-based logging.

There are exceptions when you cannot switch the replication format at runtime:

* From within a stored function or a trigger.
* If the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine is enabled.

* If the session is currently in row-based replication mode and has open temporary tables.

Trying to switch the format in any of these cases results in an error.

Switching the replication format at runtime is not recommended when any temporary tables exist, because temporary tables are logged only when using statement-based replication, whereas with row-based replication they are not logged. With mixed replication, temporary tables are usually logged; exceptions happen with loadable functions and with the [`UUID()`](miscellaneous-functions.html#function_uuid) function.

Switching the replication format while replication is ongoing can also cause issues. Each MySQL Server can set its own and only its own binary logging format (true whether [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) is set with global or session scope). This means that changing the logging format on a replication source server does not cause a replica to change its logging format to match. When using `STATEMENT` mode, the [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) system variable is not replicated. When using `MIXED` or `ROW` logging mode, it is replicated but is ignored by the replica.

A replica is not able to convert binary log entries received in `ROW` logging format to `STATEMENT` format for use in its own binary log. The replica must therefore use `ROW` or `MIXED` format if the source does. Changing the binary logging format on the source from `STATEMENT` to `ROW` or `MIXED` while replication is ongoing to a replica with `STATEMENT` format can cause replication to fail with errors such as Error executing row event: 'Cannot execute statement: impossible to write to binary log since statement is in row format and BINLOG\_FORMAT = STATEMENT.' Changing the binary logging format on the replica to `STATEMENT` format when the source is still using `MIXED` or `ROW` format also causes the same type of replication failure. To change the format safely, you must stop replication and ensure that the same change is made on both the source and the replica.

If you are using [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") tables and the transaction isolation level is [`READ COMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-committed) or [`READ UNCOMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-uncommitted), only row-based logging can be used. It is *possible* to change the logging format to `STATEMENT`, but doing so at runtime leads very rapidly to errors because `InnoDB` can no longer perform inserts.

With the binary log format set to `ROW`, many changes are written to the binary log using the row-based format. Some changes, however, still use the statement-based format. Examples include all DDL (data definition language) statements such as [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"), [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), or [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement").

The [`--binlog-row-event-max-size`](replication-options-binary-log.html#option_mysqld_binlog-row-event-max-size) option is available for servers that are capable of row-based replication. Rows are stored into the binary log in chunks having a size in bytes not exceeding the value of this option. The value must be a multiple of 256. The default value is 8192.

Warning

When using *statement-based logging* for replication, it is possible for the data on the source and replica to become different if a statement is designed in such a way that the data modification is nondeterministic; that is, it is left to the will of the query optimizer. In general, this is not a good practice even outside of replication. For a detailed explanation of this issue, see [Section B.3.7, “Known Issues in MySQL”](known-issues.html "B.3.7 Known Issues in MySQL").
