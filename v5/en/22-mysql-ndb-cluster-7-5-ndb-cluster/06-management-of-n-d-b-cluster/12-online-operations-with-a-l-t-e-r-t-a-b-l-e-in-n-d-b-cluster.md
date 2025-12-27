### 21.6.12 Online Operations with ALTER TABLE in NDB Cluster

MySQL NDB Cluster 7.5 and 7.6 support online table schema changes using [`ALTER TABLE ... ALGORITHM=DEFAULT|INPLACE|COPY`](alter-table.html#alter-table-performance "Performance and Space Requirements"). NDB Cluster handles `COPY` and `INPLACE` as described in the next few paragraphs.

For `ALGORITHM=COPY`, the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") NDB Cluster handler performs the following actions:

* Tells the data nodes to create an empty copy of the table, and to make the required schema changes to this copy.

* Reads rows from the original table, and writes them to the copy.

* Tells the data nodes to drop the original table and then to rename the copy.

We sometimes refer to this as a “copying” or “offline” `ALTER TABLE`.

DML operations are not permitted concurrently with a copying `ALTER TABLE`.

The [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") on which the copying `ALTER TABLE` statement is issued takes a metadata lock, but this is in effect only on that [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). Other `NDB` clients can modify row data during a copying `ALTER TABLE`, resulting in inconsistency.

For `ALGORITHM=INPLACE`, the NDB Cluster handler tells the data nodes to make the required changes, and does not perform any copying of data.

We also refer to this as a “non-copying” or “online” `ALTER TABLE`.

A non-copying `ALTER TABLE` allows concurrent DML operations.

Regardless of the algorithm used, the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") takes a Global Schema Lock (GSL) while executing **ALTER TABLE**; this prevents execution of any (other) DDL or backups concurrently on this or any other SQL node in the cluster. This is normally not problematic, unless the `ALTER TABLE` takes a very long time.

Note

Some older releases of NDB Cluster used a syntax specific to [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") for online `ALTER TABLE` operations. That syntax has since been removed.

Operations that add and drop indexes on variable-width columns of [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables occur online. Online operations are noncopying; that is, they do not require that indexes be re-created. They do not lock the table being altered from access by other API nodes in an NDB Cluster (but see [Limitations of NDB online operations](mysql-cluster-online-operations.html#mysql-cluster-online-limitations "Limitations of NDB online operations"), later in this section). Such operations do not require single user mode for [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table alterations made in an NDB cluster with multiple API nodes; transactions can continue uninterrupted during online DDL operations.

`ALGORITHM=INPLACE` can be used to perform online `ADD COLUMN`, `ADD INDEX` (including `CREATE INDEX` statements), and `DROP INDEX` operations on [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables. Online renaming of [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables is also supported.

Disk-based columns cannot be added to [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables online. This means that, if you wish to add an in-memory column to an [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table that uses a table-level `STORAGE DISK` option, you must declare the new column as using memory-based storage explicitly. For example—assuming that you have already created tablespace `ts1`—suppose that you create table `t1` as follows:

```sql
mysql> CREATE TABLE t1 (
     >     c1 INT NOT NULL PRIMARY KEY,
     >     c2 VARCHAR(30)
     >     )
     >     TABLESPACE ts1 STORAGE DISK
     >     ENGINE NDB;
Query OK, 0 rows affected (1.73 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

You can add a new in-memory column to this table online as shown here:

```sql
mysql> ALTER TABLE t1
     >     ADD COLUMN c3 INT COLUMN_FORMAT DYNAMIC STORAGE MEMORY,
     >     ALGORITHM=INPLACE;
Query OK, 0 rows affected (1.25 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

This statement fails if the `STORAGE MEMORY` option is omitted:

```sql
mysql> ALTER TABLE t1
     >     ADD COLUMN c4 INT COLUMN_FORMAT DYNAMIC,
     >     ALGORITHM=INPLACE;
ERROR 1846 (0A000): ALGORITHM=INPLACE is not supported. Reason:
Adding column(s) or add/reorganize partition not supported online. Try
ALGORITHM=COPY.
```

If you omit the `COLUMN_FORMAT DYNAMIC` option, the dynamic column format is employed automatically, but a warning is issued, as shown here:

```sql
mysql> ALTER ONLINE TABLE t1 ADD COLUMN c4 INT STORAGE MEMORY;
Query OK, 0 rows affected, 1 warning (1.17 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Warning
   Code: 1478
Message: DYNAMIC column c4 with STORAGE DISK is not supported, column will
become FIXED


mysql> SHOW CREATE TABLE t1\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t1` (
  `c1` int(11) NOT NULL,
  `c2` varchar(30) DEFAULT NULL,
  `c3` int(11) /*!50606 STORAGE MEMORY */ /*!50606 COLUMN_FORMAT DYNAMIC */ DEFAULT NULL,
  `c4` int(11) /*!50606 STORAGE MEMORY */ DEFAULT NULL,
  PRIMARY KEY (`c1`)
) /*!50606 TABLESPACE ts_1 STORAGE DISK */ ENGINE=ndbcluster DEFAULT CHARSET=latin1
1 row in set (0.03 sec)
```

Note

The `STORAGE` and `COLUMN_FORMAT` keywords are supported only in NDB Cluster; in any other version of MySQL, attempting to use either of these keywords in a [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") or [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement results in an error.

It is also possible to use the statement `ALTER TABLE ... REORGANIZE PARTITION, ALGORITHM=INPLACE` with no `partition_names INTO (partition_definitions)` option on [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables. This can be used to redistribute NDB Cluster data among new data nodes that have been added to the cluster online. This does *not* perform any defragmentation, which requires an [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") or null [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement. For more information, see [Section 21.6.7, “Adding NDB Cluster Data Nodes Online”](mysql-cluster-online-add-node.html "21.6.7 Adding NDB Cluster Data Nodes Online").

#### Limitations of NDB online operations

Online `DROP COLUMN` operations are not supported.

Online [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), [`CREATE INDEX`](create-index.html "13.1.14 CREATE INDEX Statement"), or [`DROP INDEX`](drop-index.html "13.1.25 DROP INDEX Statement") statements that add columns or add or drop indexes are subject to the following limitations:

* A given online [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") can use only one of `ADD COLUMN`, `ADD INDEX`, or `DROP INDEX`. One or more columns can be added online in a single statement; only one index may be created or dropped online in a single statement.

* The table being altered is not locked with respect to API nodes other than the one on which an online [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") `ADD COLUMN`, `ADD INDEX`, or `DROP INDEX` operation (or [`CREATE INDEX`](create-index.html "13.1.14 CREATE INDEX Statement") or [`DROP INDEX`](drop-index.html "13.1.25 DROP INDEX Statement") statement) is run. However, the table is locked against any other operations originating on the *same* API node while the online operation is being executed.

* The table to be altered must have an explicit primary key; the hidden primary key created by the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine is not sufficient for this purpose.

* The storage engine used by the table cannot be changed online.
* The tablespace used by the table cannot be changed online. (Bug #99269, Bug #31180526)

* When used with NDB Cluster Disk Data tables, it is not possible to change the storage type (`DISK` or `MEMORY`) of a column online. This means, that when you add or drop an index in such a way that the operation would be performed online, and you want the storage type of the column or columns to be changed, you must use `ALGORITHM=COPY` in the statement that adds or drops the index.

Columns to be added online cannot use the [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") or [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") type, and must meet the following criteria:

* The columns must be dynamic; that is, it must be possible to create them using `COLUMN_FORMAT DYNAMIC`. If you omit the `COLUMN_FORMAT DYNAMIC` option, the dynamic column format is employed automatically.

* The columns must permit `NULL` values and not have any explicit default value other than `NULL`. Columns added online are automatically created as `DEFAULT NULL`, as can be seen here:

  ```sql
  mysql> CREATE TABLE t2 (
       >     c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY
       >     ) ENGINE=NDB;
  Query OK, 0 rows affected (1.44 sec)

  mysql> ALTER TABLE t2
       >     ADD COLUMN c2 INT,
       >     ADD COLUMN c3 INT,
       >     ALGORITHM=INPLACE;
  Query OK, 0 rows affected, 2 warnings (0.93 sec)

  mysql> SHOW CREATE TABLE t1\G
  *************************** 1. row ***************************
         Table: t1
  Create Table: CREATE TABLE `t2` (
    `c1` int(11) NOT NULL AUTO_INCREMENT,
    `c2` int(11) DEFAULT NULL,
    `c3` int(11) DEFAULT NULL,
    PRIMARY KEY (`c1`)
  ) ENGINE=ndbcluster DEFAULT CHARSET=latin1
  1 row in set (0.00 sec)
  ```

* The columns must be added following any existing columns. If you attempt to add a column online before any existing columns or using the `FIRST` keyword, the statement fails with an error.

* Existing table columns cannot be reordered online.

For online [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") operations on [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables, fixed-format columns are converted to dynamic when they are added online, or when indexes are created or dropped online, as shown here (repeating the `CREATE TABLE` and `ALTER TABLE` statements just shown for the sake of clarity):

```sql
mysql> CREATE TABLE t2 (
     >     c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY
     >     ) ENGINE=NDB;
Query OK, 0 rows affected (1.44 sec)

mysql> ALTER TABLE t2
     >     ADD COLUMN c2 INT,
     >     ADD COLUMN c3 INT,
     >     ALGORITHM=INPLACE;
Query OK, 0 rows affected, 2 warnings (0.93 sec)

mysql> SHOW WARNINGS;
*************************** 1. row ***************************
  Level: Warning
   Code: 1478
Message: Converted FIXED field 'c2' to DYNAMIC to enable online ADD COLUMN
*************************** 2. row ***************************
  Level: Warning
   Code: 1478
Message: Converted FIXED field 'c3' to DYNAMIC to enable online ADD COLUMN
2 rows in set (0.00 sec)
```

Only the column or columns to be added online must be dynamic. Existing columns need not be; this includes the table's primary key, which may also be `FIXED`, as shown here:

```sql
mysql> CREATE TABLE t3 (
     >     c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY COLUMN_FORMAT FIXED
     >     ) ENGINE=NDB;
Query OK, 0 rows affected (2.10 sec)

mysql> ALTER TABLE t3 ADD COLUMN c2 INT, ALGORITHM=INPLACE;
Query OK, 0 rows affected, 1 warning (0.78 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW WARNINGS;
*************************** 1. row ***************************
  Level: Warning
   Code: 1478
Message: Converted FIXED field 'c2' to DYNAMIC to enable online ADD COLUMN
1 row in set (0.00 sec)
```

Columns are not converted from `FIXED` to `DYNAMIC` column format by renaming operations. For more information about `COLUMN_FORMAT`, see [Section 13.1.18, “CREATE TABLE Statement”](create-table.html "13.1.18 CREATE TABLE Statement").

The `KEY`, `CONSTRAINT`, and `IGNORE` keywords are supported in [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statements using `ALGORITHM=INPLACE`.

Beginning with NDB Cluster 7.5.7, setting `MAX_ROWS` to 0 using an online `ALTER TABLE` statement is disallowed. You must use a copying `ALTER TABLE` to perform this operation. (Bug
#21960004)
