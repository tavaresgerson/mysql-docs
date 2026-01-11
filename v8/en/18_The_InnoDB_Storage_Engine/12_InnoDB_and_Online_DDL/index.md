## 17.12 InnoDB and Online DDL

17.12.1 Online DDL Operations

17.12.2 Online DDL Performance and Concurrency

17.12.3 Online DDL Space Requirements

17.12.4 Online DDL Memory Management

17.12.5 Configuring Parallel Threads for Online DDL Operations

17.12.6 Simplifying DDL Statements with Online DDL

17.12.7 Online DDL Failure Conditions

17.12.8 Online DDL Limitations

The online DDL feature provides support for instant and in-place table alterations and concurrent DML. Benefits of this feature include:

* Improved responsiveness and availability in busy production environments, where making a table unavailable for minutes or hours is not practical.

* For in-place operations, the ability to adjust the balance between performance and concurrency during DDL operations using the `LOCK` clause. See The LOCK clause.

* Less disk space usage and I/O overhead than the table-copy method.

Note

`ALGORITHM=INSTANT` support is available for `ADD COLUMN` and other operations in MySQL 8.0.12.

Typically, you do not need to do anything special to enable online DDL. By default, MySQL performs the operation instantly or in place, as permitted, with as little locking as possible.

You can control aspects of a DDL operation using the `ALGORITHM` and `LOCK` clauses of the `ALTER TABLE` statement. These clauses are placed at the end of the statement, separated from the table and column specifications by commas. For example:

```
ALTER TABLE tbl_name ADD PRIMARY KEY (column), ALGORITHM=INPLACE;
```

The `LOCK` clause may be used for operations that are performed in place and is useful for fine-tuning the degree of concurrent access to the table during operations. Only `LOCK=DEFAULT` is supported for operations that are performed instantly. The `ALGORITHM` clause is primarily intended for performance comparisons and as a fallback to the older table-copying behavior in case you encounter any issues. For example:

* To avoid accidentally making the table unavailable for reads, writes, or both, during an in-place `ALTER TABLE` operation, specify a clause on the `ALTER TABLE` statement such as `LOCK=NONE` (permit reads and writes) or `LOCK=SHARED` (permit reads). The operation halts immediately if the requested level of concurrency is not available.

* To compare performance between algorithms, run a statement with `ALGORITHM=INSTANT`, `ALGORITHM=INPLACE` and `ALGORITHM=COPY`. You can also run a statement with the `old_alter_table` configuration option enabled to force the use of `ALGORITHM=COPY`.

* To avoid tying up the server with an `ALTER TABLE` operation that copies the table, include `ALGORITHM=INSTANT` or `ALGORITHM=INPLACE`. The statement halts immediately if it cannot use the specified algorithm.
