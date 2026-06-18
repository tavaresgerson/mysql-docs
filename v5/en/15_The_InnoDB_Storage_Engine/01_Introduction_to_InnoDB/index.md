## 14.1 Introduction to InnoDB

[14.1.1 Benefits of Using InnoDB Tables](innodb-benefits.html)

[14.1.2 Best Practices for InnoDB Tables](innodb-best-practices.html)

[14.1.3 Verifying that InnoDB is the Default Storage Engine](innodb-check-availability.html)

[14.1.4 Testing and Benchmarking with InnoDB](innodb-benchmarking.html)

[14.1.5 Turning Off InnoDB](innodb-turning-off.html)

`InnoDB` is a general-purpose storage engine that
balances high reliability and high performance. In MySQL
5.7, `InnoDB` is the default MySQL
storage engine. Unless you have configured a different default
storage engine, issuing a [`CREATE
TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement without an `ENGINE`
clause creates an `InnoDB` table.

### Key Advantages of InnoDB

* Its DML operations follow the ACID model, with transactions
  featuring commit, rollback, and crash-recovery capabilities to
  protect user data. See [Section 14.2, “InnoDB and the ACID Model”](mysql-acid.html "14.2 InnoDB and the ACID Model").

* Row-level locking and Oracle-style consistent reads increase
  multi-user concurrency and performance. See
  [Section 14.7, “InnoDB Locking and Transaction Model”](innodb-locking-transaction-model.html "14.7 InnoDB Locking and Transaction Model").

* `InnoDB` tables arrange your data on disk to
  optimize queries based on primary keys. Each
  `InnoDB` table has a primary key index called
  the clustered index that organizes the data to minimize I/O for
  primary key lookups. See [Section 14.6.2.1, “Clustered and Secondary Indexes”](innodb-index-types.html "14.6.2.1 Clustered and Secondary Indexes").

* To maintain data integrity, `InnoDB` supports
  `FOREIGN KEY` constraints. With foreign keys,
  inserts, updates, and deletes are checked to ensure they do not
  result in inconsistencies across related tables. See
  [Section 13.1.18.5, “FOREIGN KEY Constraints”](create-table-foreign-keys.html "13.1.18.5 FOREIGN KEY Constraints").

**Table 14.1 InnoDB Storage Engine Features**

<table frame="box" rules="all" summary="Features supported by the InnoDB storage engine."><col style="width: 60%"/><col style="width: 40%"/><thead><tr><th>Feature</th>
<th>Support</th>
</tr></thead><tbody><tr><td><strong>B-tree indexes</strong></td>
<td>Yes</td>
</tr><tr><td><strong>Backup/point-in-time recovery</strong> (Implemented in the server, rather than in the storage engine.)</td>
<td>Yes</td>
</tr><tr><td><strong>Cluster database support</strong></td>
<td>No</td>
</tr><tr><td><strong>Clustered indexes</strong></td>
<td>Yes</td>
</tr><tr><td><strong>Compressed data</strong></td>
<td>Yes</td>
</tr><tr><td><strong>Data caches</strong></td>
<td>Yes</td>
</tr><tr><td><strong>Encrypted data</strong></td>
<td>Yes (Implemented in the server via encryption functions; In MySQL 5.7 and later, data-at-rest encryption is supported.)</td>
</tr><tr><td><strong>Foreign key support</strong></td>
<td>Yes</td>
</tr><tr><td><strong>Full-text search indexes</strong></td>
<td>Yes (Support for FULLTEXT indexes is available in MySQL 5.6 and later.)</td>
</tr><tr><td><strong>Geospatial data type support</strong></td>
<td>Yes</td>
</tr><tr><td><strong>Geospatial indexing support</strong></td>
<td>Yes (Support for geospatial indexing is available in MySQL 5.7 and later.)</td>
</tr><tr><td><strong>Hash indexes</strong></td>
<td>No (InnoDB utilizes hash indexes internally for its Adaptive Hash Index feature.)</td>
</tr><tr><td><strong>Index caches</strong></td>
<td>Yes</td>
</tr><tr><td><strong>Locking granularity</strong></td>
<td>Row</td>
</tr><tr><td><strong>MVCC</strong></td>
<td>Yes</td>
</tr><tr><td><strong>Replication support</strong> (Implemented in the server, rather than in the storage engine.)</td>
<td>Yes</td>
</tr><tr><td><strong>Storage limits</strong></td>
<td>64TB</td>
</tr><tr><td><strong>T-tree indexes</strong></td>
<td>No</td>
</tr><tr><td><strong>Transactions</strong></td>
<td>Yes</td>
</tr><tr><td><strong>Update statistics for data dictionary</strong></td>
<td>Yes</td>
</tr></tbody></table>

To compare the features of `InnoDB` with other
storage engines provided with MySQL, see the *Storage
Engine Features* table in
[Chapter 15, *Alternative Storage Engines*](storage-engines.html "Chapter 15 Alternative Storage Engines").

### InnoDB Enhancements and New Features

For information about `InnoDB` enhancements and new
features, refer to:

* The `InnoDB` enhancements list in
  [Section 1.3, “What Is New in MySQL 5.7”](mysql-nutshell.html "1.3 What Is New in MySQL 5.7").

* The
  [Release
  Notes](/doc/relnotes/mysql/5.7/en/).

### Additional InnoDB Information and Resources

* For `InnoDB`-related terms and definitions, see
  the [MySQL Glossary](glossary.html "MySQL Glossary").

* For a forum dedicated to the `InnoDB` storage
  engine, see
  [MySQL
  Forums::InnoDB](http://forums.mysql.com/list.php?22).

* `InnoDB` is published under the same GNU GPL
  License Version 2 (of June 1991) as MySQL. For more information
  on MySQL licensing, see
  <http://www.mysql.com/company/legal/licensing/>.