# Chapter 18 Alternative Storage Engines

**Table of Contents**

18.1 Setting the Storage Engine

18.2 The MyISAM Storage Engine :   18.2.1 MyISAM Startup Options

    18.2.2 Space Needed for Keys

    18.2.3 MyISAM Table Storage Formats

    18.2.4 MyISAM Table Problems

18.3 The MEMORY Storage Engine

18.4 The CSV Storage Engine :   18.4.1 Repairing and Checking CSV Tables

    18.4.2 CSV Limitations

18.5 The ARCHIVE Storage Engine

18.6 The BLACKHOLE Storage Engine

18.7 The MERGE Storage Engine :   18.7.1 MERGE Table Advantages and Disadvantages

    18.7.2 MERGE Table Problems

18.8 The FEDERATED Storage Engine :   18.8.1 FEDERATED Storage Engine Overview

    18.8.2 How to Create FEDERATED Tables

    18.8.3 FEDERATED Storage Engine Notes and Tips

    18.8.4 FEDERATED Storage Engine Resources

18.9 The EXAMPLE Storage Engine

18.10 Other Storage Engines

18.11 Overview of MySQL Storage Engine Architecture :   18.11.1 Pluggable Storage Engine Architecture

    18.11.2 The Common Database Server Layer

Storage engines are MySQL components that handle the SQL operations for different table types. `InnoDB` is the default and most general-purpose storage engine, and Oracle recommends using it for tables except for specialized use cases. (The `CREATE TABLE` statement in MySQL 9.5 creates `InnoDB` tables by default.)

MySQL Server uses a pluggable storage engine architecture that enables storage engines to be loaded into and unloaded from a running MySQL server.

To determine which storage engines your server supports, use the `SHOW ENGINES` statement. The value in the `Support` column indicates whether an engine can be used. A value of `YES`, `NO`, or `DEFAULT` indicates that an engine is available, not available, or available and currently set as the default storage engine.

```
mysql> SHOW ENGINES\G
*************************** 1. row ***************************
      Engine: PERFORMANCE_SCHEMA
     Support: YES
     Comment: Performance Schema
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 2. row ***************************
      Engine: InnoDB
     Support: DEFAULT
     Comment: Supports transactions, row-level locking, and foreign keys
Transactions: YES
          XA: YES
  Savepoints: YES
*************************** 3. row ***************************
      Engine: MRG_MYISAM
     Support: YES
     Comment: Collection of identical MyISAM tables
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 4. row ***************************
      Engine: BLACKHOLE
     Support: YES
     Comment: /dev/null storage engine (anything you write to it disappears)
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 5. row ***************************
      Engine: MyISAM
     Support: YES
     Comment: MyISAM storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
...
```

This chapter covers use cases for special-purpose MySQL storage engines. It does not cover the default `InnoDB` storage engine or the `NDB` storage engine which are covered in Chapter 17, *The InnoDB Storage Engine* and Chapter 25, *MySQL NDB Cluster 9.5*. For advanced users, it also contains a description of the pluggable storage engine architecture (see Section 18.11, “Overview of MySQL Storage Engine Architecture”).

For information about features offered in commercial MySQL Server binaries, see *MySQL Editions*, on the MySQL website. The storage engines available might depend on which edition of MySQL you are using.

For answers to commonly asked questions about MySQL storage engines, see Section A.2, “MySQL 9.5 FAQ: Storage Engines”.

## MySQL 9.5 Supported Storage Engines

* `InnoDB`: The default storage engine in MySQL 9.5. `InnoDB` is a transaction-safe (ACID compliant) storage engine for MySQL that has commit, rollback, and crash-recovery capabilities to protect user data. `InnoDB` row-level locking (without escalation to coarser granularity locks) and Oracle-style consistent nonlocking reads increase multi-user concurrency and performance. `InnoDB` stores user data in clustered indexes to reduce I/O for common queries based on primary keys. To maintain data integrity, `InnoDB` also supports `FOREIGN KEY` referential-integrity constraints. For more information about `InnoDB`, see Chapter 17, *The InnoDB Storage Engine*.

* `MyISAM`: These tables have a small footprint. Table-level locking limits the performance in read/write workloads, so it is often used in read-only or read-mostly workloads in Web and data warehousing configurations.

* `Memory`: Stores all data in RAM, for fast access in environments that require quick lookups of non-critical data. This engine was formerly known as the `HEAP` engine. Its use cases are decreasing; `InnoDB` with its buffer pool memory area provides a general-purpose and durable way to keep most or all data in memory, and `NDBCLUSTER` provides fast key-value lookups for huge distributed data sets.

* `CSV`: Its tables are really text files with comma-separated values. CSV tables let you import or dump data in CSV format, to exchange data with scripts and applications that read and write that same format. Because CSV tables are not indexed, you typically keep the data in `InnoDB` tables during normal operation, and only use CSV tables during the import or export stage.

* `Archive`: These compact, unindexed tables are intended for storing and retrieving large amounts of seldom-referenced historical, archived, or security audit information.

* `Blackhole`: The Blackhole storage engine accepts but does not store data, similar to the Unix `/dev/null` device. Queries always return an empty set. These tables can be used in replication configurations where DML statements are sent to replica servers, but the source server does not keep its own copy of the data.

* `NDB` (also known as `NDBCLUSTER`): This clustered database engine is particularly suited for applications that require the highest possible degree of uptime and availability.

* `Merge`: Enables a MySQL DBA or developer to logically group a series of identical `MyISAM` tables and reference them as one object. Good for VLDB environments such as data warehousing.

* `Federated`: Offers the ability to link separate MySQL servers to create one logical database from many physical servers. Very good for distributed or data mart environments.

* `Example`: This engine serves as an example in the MySQL source code that illustrates how to begin writing new storage engines. It is primarily of interest to developers. The storage engine is a “stub” that does nothing. You can create tables with this engine, but no data can be stored in them or retrieved from them.

You are not restricted to using the same storage engine for an entire server or schema. You can specify the storage engine for any table. For example, an application might use mostly `InnoDB` tables, with one `CSV` table for exporting data to a spreadsheet and a few `MEMORY` tables for temporary workspaces.

**Choosing a Storage Engine**

The various storage engines provided with MySQL are designed with different use cases in mind. The following table provides an overview of some storage engines provided with MySQL, with clarifying notes following the table.

**Table 18.1 Storage Engines Feature Summary**

<table frame="box" rules="all" summary="Summary of features supported per storage engine."><thead><tr><th>Feature</th> <th>MyISAM</th> <th>Memory</th> <th>InnoDB</th> <th>Archive</th> <th>NDB</th> </tr></thead><tbody><tr><th>B-tree indexes</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr><th>Backup/point-in-time recovery (note 1)</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> </tr><tr><th>Cluster database support</th> <td>No</td> <td>No</td> <td>No</td> <td>No</td> <td>Yes</td> </tr><tr><th>Clustered indexes</th> <td>No</td> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr><th>Compressed data</th> <td>Yes (note 2)</td> <td>No</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr><th>Data caches</th> <td>No</td> <td>N/A</td> <td>Yes</td> <td>No</td> <td>Yes</td> </tr><tr><th>Encrypted data</th> <td>Yes (note 3)</td> <td>Yes (note 3)</td> <td>Yes (note 4)</td> <td>Yes (note 3)</td> <td>Yes (note 5)</td> </tr><tr><th>Foreign key support</th> <td>No</td> <td>No</td> <td>Yes</td> <td>No</td> <td>Yes</td> </tr><tr><th>Full-text search indexes</th> <td>Yes</td> <td>No</td> <td>Yes (note 6)</td> <td>No</td> <td>No</td> </tr><tr><th>Geospatial data type support</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> </tr><tr><th>Geospatial indexing support</th> <td>Yes</td> <td>No</td> <td>Yes (note 7)</td> <td>No</td> <td>No</td> </tr><tr><th>Hash indexes</th> <td>No</td> <td>Yes</td> <td>No (note 8)</td> <td>No</td> <td>Yes</td> </tr><tr><th>Index caches</th> <td>Yes</td> <td>N/A</td> <td>Yes</td> <td>No</td> <td>Yes</td> </tr><tr><th>Locking granularity</th> <td>Table</td> <td>Table</td> <td>Row</td> <td>Row</td> <td>Row</td> </tr><tr><th>MVCC</th> <td>No</td> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr><th>Replication support (note 1)</th> <td>Yes</td> <td>Limited (note 9)</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> </tr><tr><th>Storage limits</th> <td>256TB</td> <td>RAM</td> <td>64TB</td> <td>None</td> <td>384EB</td> </tr><tr><th>T-tree indexes</th> <td>No</td> <td>No</td> <td>No</td> <td>No</td> <td>Yes</td> </tr><tr><th>Transactions</th> <td>No</td> <td>No</td> <td>Yes</td> <td>No</td> <td>Yes</td> </tr><tr><th>Update statistics for data dictionary</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

**Notes:**

1. Implemented in the server, rather than in the storage engine.

2. Compressed MyISAM tables are supported only when using the compressed row format. Tables using the compressed row format with MyISAM are read only.

3. Implemented in the server via encryption functions.

4. Implemented in the server via encryption functions; In MySQL 5.7 and later, data-at-rest encryption is supported.

5. Implemented in the server via encryption functions; encrypted NDB backups as of NDB 8.0.22; transparent NDB file system encryption supported in NDB 8.0.29 and later.

6. Support for FULLTEXT indexes is available in MySQL 5.6 and later.

7. Support for geospatial indexing is available in MySQL 5.7 and later.

8. InnoDB utilizes hash indexes internally for its Adaptive Hash Index feature.

9. See the discussion later in this section.
