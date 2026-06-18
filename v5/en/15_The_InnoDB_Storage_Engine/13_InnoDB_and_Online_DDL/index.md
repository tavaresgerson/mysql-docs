## 14.13 InnoDB and Online DDL

[14.13.1 Online DDL Operations](innodb-online-ddl-operations.html)

[14.13.2 Online DDL Performance and Concurrency](innodb-online-ddl-performance.html)

[14.13.3 Online DDL Space Requirements](innodb-online-ddl-space-requirements.html)

[14.13.4 Simplifying DDL Statements with Online DDL](innodb-online-ddl-single-multi.html)

[14.13.5 Online DDL Failure Conditions](innodb-online-ddl-failure-conditions.html)

[14.13.6 Online DDL Limitations](innodb-online-ddl-limitations.html)

The online DDL feature provides support for in-place table
alterations and concurrent DML. Benefits of this feature include:

* Improved responsiveness and availability in busy production
  environments, where making a table unavailable for minutes or
  hours is not practical.

* The ability to adjust the balance between performance and
  concurrency during DDL operations using the
  `LOCK` clause. See
  [The LOCK clause](innodb-online-ddl-performance.html#innodb-online-ddl-locking-options "The LOCK clause").

* Less disk space usage and I/O overhead than the table-copy
  method.

Typically, you do not need to do anything special to enable online
DDL. By default, MySQL performs the operation in place, as
permitted, with as little locking as possible.

You can control aspects of a DDL operation using the
`ALGORITHM` and `LOCK` clauses of
the [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement. These
clauses are placed at the end of the statement, separated from the
table and column specifications by commas. For example:

```sql
ALTER TABLE tbl_name ADD PRIMARY KEY (column), ALGORITHM=INPLACE, LOCK=NONE;
```

The `LOCK` clause is useful for fine-tuning the
degree of concurrent access to the table. The
`ALGORITHM` clause is primarily intended for
performance comparisons and as a fallback to the older table-copying
behavior in case you encounter any issues. For example:

* To avoid accidentally making the table unavailable for reads,
  writes, or both, specify a clause on the
  [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement such as
  `LOCK=NONE` (permit reads and writes) or
  `LOCK=SHARED` (permit reads). The operation
  halts immediately if the requested level of concurrency is not
  available.

* To compare performance between algorithms, run a statement with
  `ALGORITHM=INPLACE` and
  `ALGORITHM=COPY`. Alternatively, run a
  statement with the
  [`old_alter_table`](server-system-variables.html#sysvar_old_alter_table) configuration
  option disabled and enabled.

* To avoid tying up the server with an [`ALTER
  TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") operation that copies the table, include
  `ALGORITHM=INPLACE`. The statement halts
  immediately if it cannot use the in-place mechanism.