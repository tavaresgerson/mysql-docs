### 14.1.1 Benefits of Using InnoDB Tables

`InnoDB` tables have the following benefits:

* If the server unexpectedly exits because of a hardware or software issue, regardless of what was happening in the database at the time, you don't need to do anything special after restarting the database. `InnoDB` crash recovery automatically finalizes changes that were committed before the time of the crash, and undoes changes that were in process but not committed, permitting you to restart and continue from where you left off. See Section 14.19.2, “InnoDB Recovery”.

* The `InnoDB` storage engine maintains its own buffer pool that caches table and index data in main memory as data is accessed. Frequently used data is processed directly from memory. This cache applies to many types of information and speeds up processing. On dedicated database servers, up to 80% of physical memory is often assigned to the buffer pool. See Section 14.5.1, “Buffer Pool”.

* If you split up related data into different tables, you can set up foreign keys that enforce referential integrity. See Section 13.1.18.5, “FOREIGN KEY Constraints”.

* If data becomes corrupted on disk or in memory, a checksum mechanism alerts you to the bogus data before you use it. The `innodb_checksum_algorithm` variable defines the checksum algorithm used by `InnoDB`.

* When you design a database with appropriate primary key columns for each table, operations involving those columns are automatically optimized. It is very fast to reference the primary key columns in `WHERE` clauses, `ORDER BY` clauses, `GROUP BY` clauses, and join operations. See Section 14.6.2.1, “Clustered and Secondary Indexes”.

* Inserts, updates, and deletes are optimized by an automatic mechanism called change buffering. `InnoDB` not only allows concurrent read and write access to the same table, it caches changed data to streamline disk I/O. See Section 14.5.2, “Change Buffer”.

* Performance benefits are not limited to large tables with long-running queries. When the same rows are accessed over and over from a table, the Adaptive Hash Index takes over to make these lookups even faster, as if they came out of a hash table. See Section 14.5.3, “Adaptive Hash Index”.

* You can compress tables and associated indexes. See Section 14.9, “InnoDB Table and Page Compression”.

* You can encrypt your data. See Section 14.14, “InnoDB Data-at-Rest Encryption”.

* You can create and drop indexes and perform other DDL operations with much less impact on performance and availability. See Section 14.13.1, “Online DDL Operations”.

* Truncating a file-per-table tablespace is very fast and can free up disk space for the operating system to reuse rather than only `InnoDB`. See Section 14.6.3.2, “File-Per-Table Tablespaces”.

* The storage layout for table data is more efficient for `BLOB` and long text fields, with the `DYNAMIC` row format. See Section 14.11, “InnoDB Row Formats”.

* You can monitor the internal workings of the storage engine by querying `INFORMATION_SCHEMA` tables. See Section 14.16, “InnoDB INFORMATION\_SCHEMA Tables”.

* You can monitor the performance details of the storage engine by querying Performance Schema tables. See Section 14.17, “InnoDB Integration with MySQL Performance Schema”.

* You can mix `InnoDB` tables with tables from other MySQL storage engines, even within the same statement. For example, you can use a join operation to combine data from `InnoDB` and `MEMORY` tables in a single query.

* `InnoDB` has been designed for CPU efficiency and maximum performance when processing large data volumes.

* `InnoDB` tables can handle large quantities of data, even on operating systems where file size is limited to 2GB.

For `InnoDB`-specific tuning techniques you can apply to your MySQL server and application code, see Section 8.5, “Optimizing for InnoDB Tables”.
