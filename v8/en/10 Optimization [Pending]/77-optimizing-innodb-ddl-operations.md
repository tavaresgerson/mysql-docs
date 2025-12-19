--- title: MySQL 8.4 Reference Manual :: 10.5.7 Optimizing InnoDB DDL Operations url: https://dev.mysql.com/doc/refman/8.4/en/optimizing-innodb-ddl-operations.html order: 77 ---



### 10.5.7 Optimizing InnoDB DDL Operations

* Many DDL operations on tables and indexes (`CREATE`, `ALTER`, and `DROP` statements) can be performed online. See  Section 17.12, “InnoDB and Online DDL” for details.
* Online DDL support for adding secondary indexes means that you can generally speed up the process of creating and loading a table and associated indexes by creating the table without secondary indexes, then adding secondary indexes after the data is loaded.
* Use  `TRUNCATE TABLE` to empty a table, not `DELETE FROM tbl_name`. Foreign key constraints can make a `TRUNCATE` statement work like a regular `DELETE` statement, in which case a sequence of commands like `DROP TABLE` and `CREATE TABLE` might be fastest.
* Because the primary key is integral to the storage layout of each `InnoDB` table, and changing the definition of the primary key involves reorganizing the whole table, always set up the primary key as part of the `CREATE TABLE` statement, and plan ahead so that you do not need to `ALTER` or `DROP` the primary key afterward.

