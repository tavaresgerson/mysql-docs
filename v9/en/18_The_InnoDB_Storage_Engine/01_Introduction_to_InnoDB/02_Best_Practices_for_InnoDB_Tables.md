### 17.1.2 Best Practices for InnoDB Tables

This section describes best practices when using
`InnoDB` tables.

* Specify a primary key for every table using the most
  frequently queried column or columns, or an auto-increment
  value if there is no obvious primary key.

* Use joins wherever data is pulled from multiple tables based
  on identical ID values from those tables. For fast join
  performance, define foreign keys on the join columns, and
  declare those columns with the same data type in each table.
  Adding foreign keys ensures that referenced columns are
  indexed, which can improve performance. Foreign keys also
  propagate deletes and updates to all affected tables, and
  prevent insertion of data in a child table if the
  corresponding IDs are not present in the parent table.

* Turn off autocommit. Committing hundreds of times a second
  puts a cap on performance (limited by the write speed of your
  storage device).

* Group sets of related DML operations into transactions by
  bracketing them with `START TRANSACTION` and
  `COMMIT` statements. While you don't want to
  commit too often, you also don't want to issue huge batches of
  [`INSERT`](insert.html "15.2.7 INSERT Statement"),
  [`UPDATE`](update.html "15.2.17 UPDATE Statement"), or
  [`DELETE`](delete.html "15.2.2 DELETE Statement") statements that run for
  hours without committing.

* Do not use [`LOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements")
  statements. `InnoDB` can handle multiple
  sessions all reading and writing to the same table at once
  without sacrificing reliability or high performance. To get
  exclusive write access to a set of rows, use the
  [`SELECT
  ... FOR UPDATE`](innodb-locking-reads.html "17.7.2.4 Locking Reads") syntax to lock just the rows you
  intend to update.

* Enable the
  [`innodb_file_per_table`](innodb-parameters.html#sysvar_innodb_file_per_table)
  variable or use general tablespaces to put the data and
  indexes for tables into separate files instead of the system
  tablespace. The
  [`innodb_file_per_table`](innodb-parameters.html#sysvar_innodb_file_per_table)
  variable is enabled by default.

* Evaluate whether your data and access patterns benefit from
  the `InnoDB` table or page compression
  features. You can compress `InnoDB` tables
  without sacrificing read/write capability.

* Run the server with the
  [`--sql_mode=NO_ENGINE_SUBSTITUTION`](server-system-variables.html#sysvar_sql_mode)
  option to prevent tables from being created with storage
  engines that you do not want to use.