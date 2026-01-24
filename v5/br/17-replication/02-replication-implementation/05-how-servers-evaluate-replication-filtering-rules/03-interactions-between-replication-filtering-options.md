#### 16.2.5.3 Interactions Between Replication Filtering Options

If you use a combination of database-level and table-level replication filtering options, the replica first accepts or ignores events using the database options, then it evaluates all events permitted by those options according to the table options. This can sometimes lead to results that seem counterintuitive. It is also important to note that the results vary depending on whether the operation is logged using statement-based or row-based binary logging format. If you want to be sure that your replication filters always operate in the same way independently of the binary logging format, which is particularly important if you are using mixed binary logging format, follow the guidance in this topic.

The effect of the replication filtering options differs between binary logging formats because of the way the database name is identified. With statement-based format, DML statements are handled based on the current database, as specified by the [`USE`](use.html "13.8.4 USE Statement") statement. With row-based format, DML statements are handled based on the database where the modified table exists. DDL statements are always filtered based on the current database, as specified by the [`USE`](use.html "13.8.4 USE Statement") statement, regardless of the binary logging format.

An operation that involves multiple tables can also be affected differently by replication filtering options depending on the binary logging format. Operations to watch out for include transactions involving multi-table [`UPDATE`](update.html "13.2.11 UPDATE Statement") statements, triggers, cascading foreign keys, stored functions that update multiple tables, and DML statements that invoke stored functions that update one or more tables. If these operations update both filtered-in and filtered-out tables, the results can vary with the binary logging format.

If you need to guarantee that your replication filters operate consistently regardless of the binary logging format, particularly if you are using mixed binary logging format ([`binlog_format=MIXED`](replication-options-binary-log.html#sysvar_binlog_format)), use only table-level replication filtering options, and do not use database-level replication filtering options. Also, do not use multi-table DML statements that update both filtered-in and filtered-out tables.

If you need to use a combination of database-level and table-level replication filters, and want these to operate as consistently as possible, choose one of the following strategies:

1. If you use row-based binary logging format ([`binlog_format=ROW`](replication-options-binary-log.html#sysvar_binlog_format)), for DDL statements, rely on the [`USE`](use.html "13.8.4 USE Statement") statement to set the database and do not specify the database name. You can consider changing to row-based binary logging format for improved consistency with replication filtering. See [Section 5.4.4.2, “Setting The Binary Log Format”](binary-log-setting.html "5.4.4.2 Setting The Binary Log Format") for the conditions that apply to changing the binary logging format.

2. If you use statement-based or mixed binary logging format ([`binlog_format=STATEMENT`](replication-options-binary-log.html#sysvar_binlog_format) or `MIXED`), for both DML and DDL statements, rely on the [`USE`](use.html "13.8.4 USE Statement") statement and do not use the database name. Also, do not use multi-table DML statements that update both filtered-in and filtered-out tables.

**Example 16.7 A [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db) option and a [`--replicate-do-table`](replication-options-replica.html#option_mysqld_replicate-do-table) option**

On the source, the following statements are issued:

```sql
USE db1;
CREATE TABLE t2 LIKE t1;
INSERT INTO db2.t3 VALUES (1);
```

The replica has the following replication filtering options set:

```sql
replicate-ignore-db = db1
replicate-do-table = db2.t3
```

The DDL statement [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") creates the table in `db1`, as specified by the preceding [`USE`](use.html "13.8.4 USE Statement") statement. The replica filters out this statement according to its [`--replicate-ignore-db = db1`](replication-options-replica.html#option_mysqld_replicate-ignore-db) option, because `db1` is the current database. This result is the same whatever the binary logging format is on the source. However, the result of the DML [`INSERT`](insert.html "13.2.5 INSERT Statement") statement is different depending on the binary logging format:

* If row-based binary logging format is in use on the source ([`binlog_format=ROW`](replication-options-binary-log.html#sysvar_binlog_format)), the replica evaluates the [`INSERT`](insert.html "13.2.5 INSERT Statement") operation using the database where the table exists, which is named as `db2`. The database-level option [`--replicate-ignore-db = db1`](replication-options-replica.html#option_mysqld_replicate-ignore-db), which is evaluated first, therefore does not apply. The table-level option [`--replicate-do-table = db2.t3`](replication-options-replica.html#option_mysqld_replicate-do-table) does apply, so the replica applies the change to table `t3`.

* If statement-based binary logging format is in use on the source ([`binlog_format=STATEMENT`](replication-options-binary-log.html#sysvar_binlog_format)), the replica evaluates the [`INSERT`](insert.html "13.2.5 INSERT Statement") operation using the default database, which was set by the [`USE`](use.html "13.8.4 USE Statement") statement to `db1` and has not been changed. According to its database-level [`--replicate-ignore-db = db1`](replication-options-replica.html#option_mysqld_replicate-ignore-db) option, it therefore ignores the operation and does not apply the change to table `t3`. The table-level option [`--replicate-do-table = db2.t3`](replication-options-replica.html#option_mysqld_replicate-do-table) is not checked, because the statement already matched a database-level option and was ignored.

If the [`--replicate-ignore-db = db1`](replication-options-replica.html#option_mysqld_replicate-ignore-db) option on the replica is necessary, and the use of statement-based (or mixed) binary logging format on the source is also necessary, the results can be made consistent by omitting the database name from the [`INSERT`](insert.html "13.2.5 INSERT Statement") statement and relying on a [`USE`](use.html "13.8.4 USE Statement") statement instead, as follows:

```sql
USE db1;
CREATE TABLE t2 LIKE t1;
USE db2;
INSERT INTO t3 VALUES (1);
```

In this case, the replica always evaluates the [`INSERT`](insert.html "13.2.5 INSERT Statement") statement based on the database `db2`. Whether the operation is logged in statement-based or row-based binary format, the results remain the same.
