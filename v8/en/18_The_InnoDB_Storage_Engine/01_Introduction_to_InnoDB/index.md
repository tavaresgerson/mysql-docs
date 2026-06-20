## 17.1 Introduction to InnoDB

`InnoDB` is a general-purpose storage engine that balances high reliability and high performance. In MySQL 8.0, `InnoDB` is the default MySQL storage engine. Unless you have configured a different default storage engine, issuing a [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") statement without an `ENGINE` clause creates an `InnoDB` table.

### Key Advantages of InnoDB

* Its DML operations follow the ACID model, with transactions featuring commit, rollback, and crash-recovery capabilities to protect user data. See Section 17.2, “InnoDB and the ACID Model”.

* Row-level locking and Oracle-style consistent reads increase multi-user concurrency and performance. See Section 17.7, “InnoDB Locking and Transaction Model”.

* `InnoDB` tables arrange your data on disk to optimize queries based on primary keys. Each `InnoDB` table has a primary key index called the clustered index that organizes the data to minimize I/O for primary key lookups. See Section 17.6.2.1, “Clustered and Secondary Indexes”.

* To maintain data integrity, `InnoDB` supports `FOREIGN KEY` constraints. With foreign keys, inserts, updates, and deletes are checked to ensure they do not result in inconsistencies across related tables. See Section 15.1.20.5, “FOREIGN KEY Constraints”.

**Table 17.1 InnoDB Storage Engine Features**

<table frame="box" rules="all" summary="Features supported by the InnoDB storage engine."><col style="width: 60%"/><col style="width: 40%"/><thead><tr><th>Feature</th> <th>Support</th> </tr></thead><tbody><tr><td>B-tree indexes</td> <td>Yes</td> </tr><tr><td>Backup/point-in-time recovery (Implemented in the server, rather than in the storage engine.)</td> <td>Yes</td> </tr><tr><td>Cluster database support</td> <td>No</td> </tr><tr><td>Clustered indexes</td> <td>Yes</td> </tr><tr><td>Compressed data</td> <td>Yes</td> </tr><tr><td>Data caches</td> <td>Yes</td> </tr><tr><td>Encrypted data</td> <td>Yes (Implemented in the server via encryption functions; In MySQL 5.7 and later, data-at-rest encryption is supported.)</td> </tr><tr><td>Foreign key support</td> <td>Yes</td> </tr><tr><td>Full-text search indexes</td> <td>Yes (Support for FULLTEXT indexes is available in MySQL 5.6 and later.)</td> </tr><tr><td>Geospatial data type support</td> <td>Yes</td> </tr><tr><td>Geospatial indexing support</td> <td>Yes (Support for geospatial indexing is available in MySQL 5.7 and later.)</td> </tr><tr><td>Hash indexes</td> <td>No (InnoDB utilizes hash indexes internally for its Adaptive Hash Index feature.)</td> </tr><tr><td>Index caches</td> <td>Yes</td> </tr><tr><td>Locking granularity</td> <td>Row</td> </tr><tr><td>MVCC</td> <td>Yes</td> </tr><tr><td>Replication support (Implemented in the server, rather than in the storage engine.)</td> <td>Yes</td> </tr><tr><td>Storage limits</td> <td>64TB</td> </tr><tr><td>T-tree indexes</td> <td>No</td> </tr><tr><td>Transactions</td> <td>Yes</td> </tr><tr><td>Update statistics for data dictionary</td> <td>Yes</td> </tr></tbody></table>

To compare the features of `InnoDB` with other storage engines provided with MySQL, see the *Storage Engine Features* table in Chapter 18, *Alternative Storage Engines*.

### InnoDB Enhancements and New Features

For information about `InnoDB` enhancements and new features, refer to:

* The `InnoDB` enhancements list in Section 1.3, “What Is New in MySQL 8.0”.

* The [Release Notes](/doc/relnotes/mysql/8.0/en/).

### Additional InnoDB Information and Resources

* For `InnoDB`-related terms and definitions, see the MySQL Glossary.

* For a forum dedicated to the `InnoDB` storage engine, see [MySQL Forums::InnoDB](http://forums.mysql.com/list.php?22).

* `InnoDB` is published under the same GNU GPL License Version 2 (of June 1991) as MySQL. For more information on MySQL licensing, see <http://www.mysql.com/company/legal/licensing/>.