## 17.1 Introduction to InnoDB

`InnoDB` is a general-purpose storage engine that balances high reliability and high performance. In MySQL 9.5, `InnoDB` is the default MySQL storage engine. Unless you have configured a different default storage engine, issuing a [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") statement without an `ENGINE` clause creates an `InnoDB` table.

### Key Advantages of InnoDB

* Its DML operations follow the ACID model, with transactions featuring commit, rollback, and crash-recovery capabilities to protect user data. See Section 17.2, “InnoDB and the ACID Model”.

* Row-level locking and Oracle-style consistent reads increase multi-user concurrency and performance. See Section 17.7, “InnoDB Locking and Transaction Model”.

* `InnoDB` tables arrange your data on disk to optimize queries based on primary keys. Each `InnoDB` table has a primary key index called the clustered index that organizes the data to minimize I/O for primary key lookups. See Section 17.6.2.1, “Clustered and Secondary Indexes”.

* To maintain data integrity, `InnoDB` supports `FOREIGN KEY` constraints. With foreign keys, inserts, updates, and deletes are checked to ensure they do not result in inconsistencies across related tables. See Section 15.1.24.5, “FOREIGN KEY Constraints”.

**Table 17.1 InnoDB Storage Engine Features**

<table frame="box" rules="all" summary="Features supported by the InnoDB storage engine."><col style="width: 60%"/><col style="width: 40%"/><thead><tr><th>Feature</th> <th>Support</th> </tr></thead><tbody><tr><td>B-tree indexes</td> <td>Yes</td> </tr><tr><td>Backup/point-in-time recovery (Implemented in the server, rather than in the storage engine.)</td> <td>Yes</td> </tr><tr><td>Cluster database support</td> <td>No</td> </tr><tr><td>Clustered indexes</td> <td>Yes</td> </tr><tr><td>Compressed data</td> <td>Yes</td> </tr><tr><td>Data caches</td> <td>Yes</td> </tr><tr><td>Encrypted data</td> <td>Yes (Implemented in the server via encryption functions; In MySQL 5.7 and later, data-at-rest encryption is supported.)</td> </tr><tr><td>Foreign key support</td> <td>Yes</td> </tr><tr><td>Full-text search indexes</td> <td>Yes (Support for FULLTEXT indexes is available in MySQL 5.6 and later.)</td> </tr><tr><td>Geospatial data type support</td> <td>Yes</td> </tr><tr><td>Geospatial indexing support</td> <td>Yes (Support for geospatial indexing is available in MySQL 5.7 and later.)</td> </tr><tr><td>Hash indexes</td> <td>No (InnoDB utilizes hash indexes internally for its Adaptive Hash Index feature.)</td> </tr><tr><td>Index caches</td> <td>Yes</td> </tr><tr><td>Locking granularity</td> <td>Row</td> </tr><tr><td>MVCC</td> <td>Yes</td> </tr><tr><td>Replication support (Implemented in the server, rather than in the storage engine.)</td> <td>Yes</td> </tr><tr><td>Storage limits</td> <td>64TB</td> </tr><tr><td>T-tree indexes</td> <td>No</td> </tr><tr><td>Transactions</td> <td>Yes</td> </tr><tr><td>Update statistics for data dictionary</td> <td>Yes</td> </tr></tbody></table>

To compare the features of `InnoDB` with other storage engines provided with MySQL, see the *Storage Engine Features* table in Chapter 18, *Alternative Storage Engines*.

### InnoDB Enhancements and New Features

For information about `InnoDB` enhancements and new features, refer to:

* The `InnoDB` enhancements list in Section 1.4, “What Is New in MySQL 9.5”.

* The [Release Notes](/doc/relnotes/mysql/9.5/en/).

### Additional InnoDB Information and Resources

* For `InnoDB`-related terms and definitions, see the MySQL Glossary.

* For a forum dedicated to the `InnoDB` storage engine, see [MySQL Forums::InnoDB](http://forums.mysql.com/list.php?22).

* `InnoDB` is published under the same GNU GPL License Version 2 (of June 1991) as MySQL. For more information on MySQL licensing, see <http://www.mysql.com/company/legal/licensing/>.


### 17.1.1 Benefits of Using InnoDB Tables

`InnoDB` tables have the following benefits:

* If the server unexpectedly exits because of a hardware or software issue, regardless of what was happening in the database at the time, you don't need to do anything special after restarting the database. `InnoDB` crash recovery automatically finalizes changes that were committed before the time of the crash, and undoes changes that were in process but not committed, permitting you to restart and continue from where you left off. See Section 17.18.2, “InnoDB Recovery”.

* The `InnoDB` storage engine maintains its own buffer pool that caches table and index data in main memory as data is accessed. Frequently used data is processed directly from memory. This cache applies to many types of information and speeds up processing. On dedicated database servers, up to 80% of physical memory is often assigned to the buffer pool. See Section 17.5.1, “Buffer Pool”.

* If you split up related data into different tables, you can set up foreign keys that enforce referential integrity. See Section 15.1.24.5, “FOREIGN KEY Constraints”.

* If data becomes corrupted on disk or in memory, a checksum mechanism alerts you to the bogus data before you use it. The `innodb_checksum_algorithm` variable defines the checksum algorithm used by `InnoDB`.

* When you design a database with appropriate primary key columns for each table, operations involving those columns are automatically optimized. It is very fast to reference the primary key columns in `WHERE` clauses, [`ORDER BY`](select.html "15.2.13 SELECT Statement") clauses, `GROUP BY` clauses, and join operations. See Section 17.6.2.1, “Clustered and Secondary Indexes”.

* Inserts, updates, and deletes are optimized by an automatic mechanism called change buffering. `InnoDB` not only allows concurrent read and write access to the same table, it caches changed data to streamline disk I/O. See Section 17.5.2, “Change Buffer”.

* Performance benefits are not limited to large tables with long-running queries. When the same rows are accessed over and over from a table, the Adaptive Hash Index takes over to make these lookups even faster, as if they came out of a hash table. See Section 17.5.3, “Adaptive Hash Index”.

* You can compress tables and associated indexes. See Section 17.9, “InnoDB Table and Page Compression”.

* You can encrypt your data. See Section 17.13, “InnoDB Data-at-Rest Encryption”.

* You can create and drop indexes and perform other DDL operations with much less impact on performance and availability. See Section 17.12.1, “Online DDL Operations”.

* Truncating a file-per-table tablespace is very fast and can free up disk space for the operating system to reuse rather than only `InnoDB`. See Section 17.6.3.2, “File-Per-Table Tablespaces”.

* The storage layout for table data is more efficient for `BLOB` and long text fields, with the `DYNAMIC` row format. See Section 17.10, “InnoDB Row Formats”.

* You can monitor the internal workings of the storage engine by querying `INFORMATION_SCHEMA` tables. See Section 17.15, “InnoDB INFORMATION_SCHEMA Tables”.

* You can monitor the performance details of the storage engine by querying Performance Schema tables. See Section 17.16, “InnoDB Integration with MySQL Performance Schema”.

* You can mix `InnoDB` tables with tables from other MySQL storage engines, even within the same statement. For example, you can use a join operation to combine data from `InnoDB` and `MEMORY` tables in a single query.

* `InnoDB` has been designed for CPU efficiency and maximum performance when processing large data volumes.

* `InnoDB` tables can handle large quantities of data, even on operating systems where file size is limited to 2GB.

For `InnoDB`-specific tuning techniques you can apply to your MySQL server and application code, see Section 10.5, “Optimizing for InnoDB Tables”.


### 17.1.2 Best Practices for InnoDB Tables

This section describes best practices when using `InnoDB` tables.

* Specify a primary key for every table using the most frequently queried column or columns, or an auto-increment value if there is no obvious primary key.

* Use joins wherever data is pulled from multiple tables based on identical ID values from those tables. For fast join performance, define foreign keys on the join columns, and declare those columns with the same data type in each table. Adding foreign keys ensures that referenced columns are indexed, which can improve performance. Foreign keys also propagate deletes and updates to all affected tables, and prevent insertion of data in a child table if the corresponding IDs are not present in the parent table.

* Turn off autocommit. Committing hundreds of times a second puts a cap on performance (limited by the write speed of your storage device).

* Group sets of related DML operations into transactions by bracketing them with `START TRANSACTION` and `COMMIT` statements. While you don't want to commit too often, you also don't want to issue huge batches of `INSERT`, `UPDATE`, or `DELETE` statements that run for hours without committing.

* Do not use `LOCK TABLES` statements. `InnoDB` can handle multiple sessions all reading and writing to the same table at once without sacrificing reliability or high performance. To get exclusive write access to a set of rows, use the [`SELECT ... FOR UPDATE`](innodb-locking-reads.html "17.7.2.4 Locking Reads") syntax to lock just the rows you intend to update.

* Enable the `innodb_file_per_table` variable or use general tablespaces to put the data and indexes for tables into separate files instead of the system tablespace. The `innodb_file_per_table` variable is enabled by default.

* Evaluate whether your data and access patterns benefit from the `InnoDB` table or page compression features. You can compress `InnoDB` tables without sacrificing read/write capability.

* Run the server with the `--sql_mode=NO_ENGINE_SUBSTITUTION` option to prevent tables from being created with storage engines that you do not want to use.


### 17.1.3 Verifying that InnoDB is the Default Storage Engine

Issue a `SHOW ENGINES` statement to view the available MySQL storage engines. Look for `DEFAULT` in the `SUPPORT` column.

```
mysql> SHOW ENGINES;
```

Alternatively, query the Information Schema `ENGINES` table.

```
mysql> SELECT * FROM INFORMATION_SCHEMA.ENGINES;
```


### 17.1.4 Testing and Benchmarking with InnoDB

If `InnoDB` is not the default storage engine, you can determine if your database server and applications work correctly with `InnoDB` by restarting the server with `--default-storage-engine=InnoDB` defined on the command line or with `default-storage-engine=innodb` defined in the `[mysqld]` section of the MySQL server option file.

Since changing the default storage engine only affects newly created tables, run your application installation and setup steps to confirm that everything installs properly, then exercise the application features to make sure the data loading, editing, and querying features work. If a table relies on a feature that is specific to another storage engine, you receive an error. In this case, add the `ENGINE=other_engine_name` clause to the `CREATE TABLE` statement to avoid the error.

If you did not make a deliberate decision about the storage engine, and you want to preview how certain tables work when created using `InnoDB`, issue the command [`ALTER TABLE table_name ENGINE=InnoDB;`](alter-table.html "15.1.11 ALTER TABLE Statement") for each table. Alternatively, to run test queries and other statements without disturbing the original table, make a copy:

```
CREATE TABLE ... ENGINE=InnoDB AS SELECT * FROM other_engine_table;
```

To assess performance with a full application under a realistic workload, install the latest MySQL server and run benchmarks.

Test the full application lifecycle, from installation, through heavy usage, and server restart. Kill the server process while the database is busy to simulate a power failure, and verify that the data is recovered successfully when you restart the server.

Test any replication configurations, especially if you use different MySQL versions and options on the source server and replicas.
