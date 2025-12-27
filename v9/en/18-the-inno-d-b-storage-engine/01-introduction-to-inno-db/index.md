## 17.1 Introduction to InnoDB

17.1.1 Benefits of Using InnoDB Tables

17.1.2 Best Practices for InnoDB Tables

17.1.3 Verifying that InnoDB is the Default Storage Engine

17.1.4 Testing and Benchmarking with InnoDB

`InnoDB` is a general-purpose storage engine that balances high reliability and high performance. In MySQL 9.5, `InnoDB` is the default MySQL storage engine. Unless you have configured a different default storage engine, issuing a `CREATE TABLE` statement without an `ENGINE` clause creates an `InnoDB` table.

### Key Advantages of InnoDB

* Its DML operations follow the ACID model, with transactions featuring commit, rollback, and crash-recovery capabilities to protect user data. See Section 17.2, “InnoDB and the ACID Model”.

* Row-level locking and Oracle-style consistent reads increase multi-user concurrency and performance. See Section 17.7, “InnoDB Locking and Transaction Model”.

* `InnoDB` tables arrange your data on disk to optimize queries based on primary keys. Each `InnoDB` table has a primary key index called the clustered index that organizes the data to minimize I/O for primary key lookups. See Section 17.6.2.1, “Clustered and Secondary Indexes”.

* To maintain data integrity, `InnoDB` supports `FOREIGN KEY` constraints. With foreign keys, inserts, updates, and deletes are checked to ensure they do not result in inconsistencies across related tables. See Section 15.1.24.5, “FOREIGN KEY Constraints”.

**Table 17.1 InnoDB Storage Engine Features**

<table frame="box" rules="all" summary="Features supported by the InnoDB storage engine."><col style="width: 60%"/><col style="width: 40%"/><thead><tr><th>Feature</th> <th>Support</th> </tr></thead><tbody><tr><td><span class="bold"><strong>B-tree indexes</strong></span></td> <td>Yes</td> </tr><tr><td><span class="bold"><strong>Backup/point-in-time recovery</strong></span> (Implemented in the server, rather than in the storage engine.)</td> <td>Yes</td> </tr><tr><td><span class="bold"><strong>Cluster database support</strong></span></td> <td>No</td> </tr><tr><td><span class="bold"><strong>Clustered indexes</strong></span></td> <td>Yes</td> </tr><tr><td><span class="bold"><strong>Compressed data</strong></span></td> <td>Yes</td> </tr><tr><td><span class="bold"><strong>Data caches</strong></span></td> <td>Yes</td> </tr><tr><td><span class="bold"><strong>Encrypted data</strong></span></td> <td>Yes (Implemented in the server via encryption functions; In MySQL 5.7 and later, data-at-rest encryption is supported.)</td> </tr><tr><td><span class="bold"><strong>Foreign key support</strong></span></td> <td>Yes</td> </tr><tr><td><span class="bold"><strong>Full-text search indexes</strong></span></td> <td>Yes (Support for FULLTEXT indexes is available in MySQL 5.6 and later.)</td> </tr><tr><td><span class="bold"><strong>Geospatial data type support</strong></span></td> <td>Yes</td> </tr><tr><td><span class="bold"><strong>Geospatial indexing support</strong></span></td> <td>Yes (Support for geospatial indexing is available in MySQL 5.7 and later.)</td> </tr><tr><td><span class="bold"><strong>Hash indexes</strong></span></td> <td>No (InnoDB utilizes hash indexes internally for its Adaptive Hash Index feature.)</td> </tr><tr><td><span class="bold"><strong>Index caches</strong></span></td> <td>Yes</td> </tr><tr><td><span class="bold"><strong>Locking granularity</strong></span></td> <td>Row</td> </tr><tr><td><span class="bold"><strong>MVCC</strong></span></td> <td>Yes</td> </tr><tr><td><span class="bold"><strong>Replication support</strong></span> (Implemented in the server, rather than in the storage engine.)</td> <td>Yes</td> </tr><tr><td><span class="bold"><strong>Storage limits</strong></span></td> <td>64TB</td> </tr><tr><td><span class="bold"><strong>T-tree indexes</strong></span></td> <td>No</td> </tr><tr><td><span class="bold"><strong>Transactions</strong></span></td> <td>Yes</td> </tr><tr><td><span class="bold"><strong>Update statistics for data dictionary</strong></span></td> <td>Yes</td> </tr></tbody></table>

To compare the features of `InnoDB` with other storage engines provided with MySQL, see the *Storage Engine Features* table in Chapter 18, *Alternative Storage Engines*.

### InnoDB Enhancements and New Features

For information about `InnoDB` enhancements and new features, refer to:

* The `InnoDB` enhancements list in Section 1.4, “What Is New in MySQL 9.5”.

* The Release Notes.

### Additional InnoDB Information and Resources

* For `InnoDB`-related terms and definitions, see the MySQL Glossary.

* For a forum dedicated to the `InnoDB` storage engine, see MySQL Forums::InnoDB.

* `InnoDB` is published under the same GNU GPL License Version 2 (of June 1991) as MySQL. For more information on MySQL licensing, see <http://www.mysql.com/company/legal/licensing/>.
