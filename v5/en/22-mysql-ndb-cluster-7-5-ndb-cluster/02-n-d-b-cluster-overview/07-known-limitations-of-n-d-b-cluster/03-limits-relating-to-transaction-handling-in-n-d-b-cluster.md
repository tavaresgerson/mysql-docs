#### 21.2.7.3 Limits Relating to Transaction Handling in NDB Cluster

A number of limitations exist in NDB Cluster with regard to the handling of transactions. These include the following:

* **Transaction isolation level.**

  The [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine supports only the [`READ COMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-committed) transaction isolation level. (`InnoDB`, for example, supports [`READ COMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-committed), [`READ UNCOMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-uncommitted), [`REPEATABLE READ`](innodb-transaction-isolation-levels.html#isolevel_repeatable-read), and [`SERIALIZABLE`](innodb-transaction-isolation-levels.html#isolevel_serializable).) You should keep in mind that `NDB` implements `READ COMMITTED` on a per-row basis; when a read request arrives at the data node storing the row, what is returned is the last committed version of the row at that time.

  Uncommitted data is never returned, but when a transaction modifying a number of rows commits concurrently with a transaction reading the same rows, the transaction performing the read can observe “before” values, “after” values, or both, for different rows among these, due to the fact that a given row read request can be processed either before or after the commit of the other transaction.

  To ensure that a given transaction reads only before or after values, you can impose row locks using [`SELECT ... LOCK IN SHARE MODE`](select.html "13.2.9 SELECT Statement"). In such cases, the lock is held until the owning transaction is committed. Using row locks can also cause the following issues:

  + Increased frequency of lock wait timeout errors, and reduced concurrency

  + Increased transaction processing overhead due to reads requiring a commit phase

  + Possibility of exhausting the available number of concurrent locks, which is limited by [`MaxNoOfConcurrentOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentoperations)

  `NDB` uses `READ COMMITTED` for all reads unless a modifier such as `LOCK IN SHARE MODE` or `FOR UPDATE` is used. `LOCK IN SHARE MODE` causes shared row locks to be used; `FOR UPDATE` causes exclusive row locks to be used. Unique key reads have their locks upgraded automatically by `NDB` to ensure a self-consistent read; `BLOB` reads also employ extra locking for consistency.

  See [Section 21.6.8.4, “NDB Cluster Backup Troubleshooting”](mysql-cluster-backup-troubleshooting.html "21.6.8.4 NDB Cluster Backup Troubleshooting"), for information on how NDB Cluster's implementation of transaction isolation level can affect backup and restoration of `NDB` databases.

* **Transactions and BLOB or TEXT columns.** [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") stores only part of a column value that uses any of MySQL's [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") or [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") data types in the table visible to MySQL; the remainder of the [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") or [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") is stored in a separate internal table that is not accessible to MySQL. This gives rise to two related issues of which you should be aware whenever executing [`SELECT`](select.html "13.2.9 SELECT Statement") statements on tables that contain columns of these types:

  1. For any [`SELECT`](select.html "13.2.9 SELECT Statement") from an NDB Cluster table: If the [`SELECT`](select.html "13.2.9 SELECT Statement") includes a [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") or [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") column, the [`READ COMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-committed) transaction isolation level is converted to a read with read lock. This is done to guarantee consistency.

  2. For any [`SELECT`](select.html "13.2.9 SELECT Statement") which uses a unique key lookup to retrieve any columns that use any of the [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") or [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") data types and that is executed within a transaction, a shared read lock is held on the table for the duration of the transaction—that is, until the transaction is either committed or aborted.

     This issue does not occur for queries that use index or table scans, even against [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables having [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") or [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") columns.

     For example, consider the table `t` defined by the following [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement:

     ```sql
     CREATE TABLE t (
         a INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
         b INT NOT NULL,
         c INT NOT NULL,
         d TEXT,
         INDEX i(b),
         UNIQUE KEY u(c)
     ) ENGINE = NDB,
     ```

     The following query on `t` causes a shared read lock, because it uses a unique key lookup:

     ```sql
     SELECT * FROM t WHERE c = 1;
     ```

     However, none of the four queries shown here causes a shared read lock:

     ```sql
     SELECT * FROM t WHERE b = 1;

     SELECT * FROM t WHERE d = '1';

     SELECT * FROM t;

     SELECT b,c WHERE a = 1;
     ```

     This is because, of these four queries, the first uses an index scan, the second and third use table scans, and the fourth, while using a primary key lookup, does not retrieve the value of any [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") or [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") columns.

     You can help minimize issues with shared read locks by avoiding queries that use unique key lookups that retrieve [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") or [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") columns, or, in cases where such queries are not avoidable, by committing transactions as soon as possible afterward.

* **Unique key lookups and transaction isolation.** Unique indexes are implemented in `NDB` using a hidden index table which is maintained internally. When a user-created `NDB` table is accessed using a unique index, the hidden index table is first read to find the primary key that is then used to read the user-created table. To avoid modification of the index during this double-read operation, the row found in the hidden index table is locked. When a row referenced by a unique index in the user-created `NDB` table is updated, the hidden index table is subject to an exclusive lock by the transaction in which the update is performed. This means that any read operation on the same (user-created) `NDB` table must wait for the update to complete. This is true even when the transaction level of the read operation is [`READ COMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-committed).

  One workaround which can be used to bypass potentially blocking reads is to force the SQL node to ignore the unique index when performing the read. This can be done by using the `IGNORE INDEX` index hint as part of the [`SELECT`](select.html "13.2.9 SELECT Statement") statement reading the table (see [Section 8.9.4, “Index Hints”](index-hints.html "8.9.4 Index Hints")). Because the MySQL server creates a shadowing ordered index for every unique index created in `NDB`, this lets the ordered index be read instead, and avoids unique index access locking. The resulting read is as consistent as a committed read by primary key, returning the last committed value at the time the row is read.

  Reading via an ordered index makes less efficient use of resources in the cluster, and may have higher latency.

  It is also possible to avoid using the unique index for access by querying for ranges rather than for unique values.

* **Rollbacks.** There are no partial transactions, and no partial rollbacks of transactions. A duplicate key or similar error causes the entire transaction to be rolled back.

  This behavior differs from that of other transactional storage engines such as [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") that may roll back individual statements.

* **Transactions and memory usage.** As noted elsewhere in this chapter, NDB Cluster does not handle large transactions well; it is better to perform a number of small transactions with a few operations each than to attempt a single large transaction containing a great many operations. Among other considerations, large transactions require very large amounts of memory. Because of this, the transactional behavior of a number of MySQL statements is affected as described in the following list:

  + [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is not transactional when used on [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables. If a [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") fails to empty the table, then it must be re-run until it is successful.

  + `DELETE FROM` (even with no `WHERE` clause) *is* transactional. For tables containing a great many rows, you may find that performance is improved by using several `DELETE FROM ... LIMIT ...` statements to “chunk” the delete operation. If your objective is to empty the table, then you may wish to use [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") instead.

  + **LOAD DATA statements.** [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") is not transactional when used on [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables.

    Important

    When executing a [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") statement, the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") engine performs commits at irregular intervals that enable better utilization of the communication network. It is not possible to know ahead of time when such commits take place.

  + **ALTER TABLE and transactions.** When copying an [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table as part of an [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), the creation of the copy is nontransactional. (In any case, this operation is rolled back when the copy is deleted.)

* **Transactions and the COUNT() function.** When using NDB Cluster Replication, it is not possible to guarantee the transactional consistency of the [`COUNT()`](aggregate-functions.html#function_count) function on the replica. In other words, when performing on the source a series of statements ([`INSERT`](insert.html "13.2.5 INSERT Statement"), [`DELETE`](delete.html "13.2.2 DELETE Statement"), or both) that changes the number of rows in a table within a single transaction, executing `SELECT COUNT(*) FROM table` queries on the replica may yield intermediate results. This is due to the fact that `SELECT COUNT(...)` may perform dirty reads, and is not a bug in the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine. (See Bug
  #31321 for more information.)
