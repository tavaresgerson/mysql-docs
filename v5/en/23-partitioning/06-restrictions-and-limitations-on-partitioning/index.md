## 22.6 Restrictions and Limitations on Partitioning

[22.6.1 Partitioning Keys, Primary Keys, and Unique Keys](partitioning-limitations-partitioning-keys-unique-keys.html)

[22.6.2 Partitioning Limitations Relating to Storage Engines](partitioning-limitations-storage-engines.html)

[22.6.3 Partitioning Limitations Relating to Functions](partitioning-limitations-functions.html)

[22.6.4 Partitioning and Locking](partitioning-limitations-locking.html)

This section discusses current restrictions and limitations on MySQL partitioning support.

**Prohibited constructs.** The following constructs are not permitted in partitioning expressions:

* Stored procedures, stored functions, loadable functions, or plugins.

* Declared variables or user variables.

For a list of SQL functions which are permitted in partitioning expressions, see [Section 22.6.3, “Partitioning Limitations Relating to Functions”](partitioning-limitations-functions.html "22.6.3 Partitioning Limitations Relating to Functions").

**Arithmetic and logical operators.**

Use of the arithmetic operators [`+`](arithmetic-functions.html#operator_plus), [`-`](arithmetic-functions.html#operator_minus), and [`*`](arithmetic-functions.html#operator_times) is permitted in partitioning expressions. However, the result must be an integer value or `NULL` (except in the case of `[LINEAR] KEY` partitioning, as discussed elsewhere in this chapter; see [Section 22.2, “Partitioning Types”](partitioning-types.html "22.2 Partitioning Types"), for more information).

The [`DIV`](arithmetic-functions.html#operator_div) operator is also supported, and the [`/`](arithmetic-functions.html#operator_divide) operator is not permitted. (Bug #30188, Bug #33182)

The bit operators [`|`](bit-functions.html#operator_bitwise-or), [`&`](bit-functions.html#operator_bitwise-and), [`^`](bit-functions.html#operator_bitwise-xor), [`<<`](bit-functions.html#operator_left-shift), [`>>`](bit-functions.html#operator_right-shift), and [`~`](bit-functions.html#operator_bitwise-invert) are not permitted in partitioning expressions.

**HANDLER statements.** Previously, the [`HANDLER`](handler.html "13.2.4 HANDLER Statement") statement was not supported with partitioned tables. This limitation is removed beginning with MySQL 5.7.1.

**Server SQL mode.**

Tables employing user-defined partitioning do not preserve the SQL mode in effect at the time that they were created. As discussed in [Section 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes"), the results of many MySQL functions and operators may change according to the server SQL mode. Therefore, a change in the SQL mode at any time after the creation of partitioned tables may lead to major changes in the behavior of such tables, and could easily lead to corruption or loss of data. For these reasons, *it is strongly recommended that you never change the server SQL mode after creating partitioned tables*.

**Examples.** The following examples illustrate some changes in behavior of partitioned tables due to a change in the server SQL mode:

1. **Error handling.** Suppose that you create a partitioned table whose partitioning expression is one such as `column DIV 0` or `column MOD 0`, as shown here:

   ```sql
   mysql> CREATE TABLE tn (c1 INT)
       ->     PARTITION BY LIST(1 DIV c1) (
       ->       PARTITION p0 VALUES IN (NULL),
       ->       PARTITION p1 VALUES IN (1)
       -> );
   Query OK, 0 rows affected (0.05 sec)
   ```

   The default behavior for MySQL is to return `NULL` for the result of a division by zero, without producing any errors:

   ```sql
   mysql> SELECT @@sql_mode;
   +------------+
   | @@sql_mode |
   +------------+
   |            |
   +------------+
   1 row in set (0.00 sec)


   mysql> INSERT INTO tn VALUES (NULL), (0), (1);
   Query OK, 3 rows affected (0.00 sec)
   Records: 3  Duplicates: 0  Warnings: 0
   ```

   However, changing the server SQL mode to treat division by zero as an error and to enforce strict error handling causes the same [`INSERT`](insert.html "13.2.5 INSERT Statement") statement to fail, as shown here:

   ```sql
   mysql> SET sql_mode='STRICT_ALL_TABLES,ERROR_FOR_DIVISION_BY_ZERO';
   Query OK, 0 rows affected (0.00 sec)

   mysql> INSERT INTO tn VALUES (NULL), (0), (1);
   ERROR 1365 (22012): Division by 0
   ```

2. **Table accessibility.** Sometimes a change in the server SQL mode can make partitioned tables unusable. The following [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement can be executed successfully only if the [`NO_UNSIGNED_SUBTRACTION`](sql-mode.html#sqlmode_no_unsigned_subtraction) mode is in effect:

   ```sql
   mysql> SELECT @@sql_mode;
   +------------+
   | @@sql_mode |
   +------------+
   |            |
   +------------+
   1 row in set (0.00 sec)

   mysql> CREATE TABLE tu (c1 BIGINT UNSIGNED)
       ->   PARTITION BY RANGE(c1 - 10) (
       ->     PARTITION p0 VALUES LESS THAN (-5),
       ->     PARTITION p1 VALUES LESS THAN (0),
       ->     PARTITION p2 VALUES LESS THAN (5),
       ->     PARTITION p3 VALUES LESS THAN (10),
       ->     PARTITION p4 VALUES LESS THAN (MAXVALUE)
       -> );
   ERROR 1563 (HY000): Partition constant is out of partition function domain

   mysql> SET sql_mode='NO_UNSIGNED_SUBTRACTION';
   Query OK, 0 rows affected (0.00 sec)

   mysql> SELECT @@sql_mode;
   +-------------------------+
   | @@sql_mode              |
   +-------------------------+
   | NO_UNSIGNED_SUBTRACTION |
   +-------------------------+
   1 row in set (0.00 sec)

   mysql> CREATE TABLE tu (c1 BIGINT UNSIGNED)
       ->   PARTITION BY RANGE(c1 - 10) (
       ->     PARTITION p0 VALUES LESS THAN (-5),
       ->     PARTITION p1 VALUES LESS THAN (0),
       ->     PARTITION p2 VALUES LESS THAN (5),
       ->     PARTITION p3 VALUES LESS THAN (10),
       ->     PARTITION p4 VALUES LESS THAN (MAXVALUE)
       -> );
   Query OK, 0 rows affected (0.05 sec)
   ```

   If you remove the [`NO_UNSIGNED_SUBTRACTION`](sql-mode.html#sqlmode_no_unsigned_subtraction) server SQL mode after creating `tu`, you may no longer be able to access this table:

   ```sql
   mysql> SET sql_mode='';
   Query OK, 0 rows affected (0.00 sec)

   mysql> SELECT * FROM tu;
   ERROR 1563 (HY000): Partition constant is out of partition function domain
   mysql> INSERT INTO tu VALUES (20);
   ERROR 1563 (HY000): Partition constant is out of partition function domain
   ```

   See also [Section 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes").

Server SQL modes also impact replication of partitioned tables. Disparate SQL modes on source and replica can lead to partitioning expressions being evaluated differently; this can cause the distribution of data among partitions to be different in the source's and replica's copies of a given table, and may even cause inserts into partitioned tables that succeed on the source to fail on the replica. For best results, you should always use the same server SQL mode on the source and on the replica.

**Performance considerations.** Some effects of partitioning operations on performance are given in the following list:

* **File system operations.** Partitioning and repartitioning operations (such as [`ALTER TABLE`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations") with `PARTITION BY ...`, `REORGANIZE PARTITION`, or `REMOVE PARTITIONING`) depend on file system operations for their implementation. This means that the speed of these operations is affected by such factors as file system type and characteristics, disk speed, swap space, file handling efficiency of the operating system, and MySQL server options and variables that relate to file handling. In particular, you should make sure that [`large_files_support`](server-system-variables.html#sysvar_large_files_support) is enabled and that [`open_files_limit`](server-system-variables.html#sysvar_open_files_limit) is set properly. For partitioned tables using the `MyISAM` storage engine, increasing [`myisam_max_sort_file_size`](server-system-variables.html#sysvar_myisam_max_sort_file_size) may improve performance; partitioning and repartitioning operations involving `InnoDB` tables may be made more efficient by enabling [`innodb_file_per_table`](innodb-parameters.html#sysvar_innodb_file_per_table).

  See also [Maximum number of partitions](partitioning-limitations.html#partitioning-limitations-max-partitions "Maximum number of partitions").

* **MyISAM and partition file descriptor usage.** For a partitioned [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") table, MySQL uses 2 file descriptors for each partition, for each such table that is open. This means that you need many more file descriptors to perform operations on a partitioned `MyISAM` table than on a table which is identical to it except that the latter table is not partitioned, particularly when performing [`ALTER TABLE`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations") operations.

  Assume a `MyISAM` table `t` with 100 partitions, such as the table created by this SQL statement:

  ```sql
  CREATE TABLE t (c1 VARCHAR(50))
  PARTITION BY KEY (c1) PARTITIONS 100
  ENGINE=MYISAM;
  ```

  Note

  For brevity, we use `KEY` partitioning for the table shown in this example, but file descriptor usage as described here applies to all partitioned `MyISAM` tables, regardless of the type of partitioning that is employed. Partitioned tables using other storage engines such as [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") are not affected by this issue.

  Now assume that you wish to repartition `t` so that it has 101 partitions, using the statement shown here:

  ```sql
  ALTER TABLE t PARTITION BY KEY (c1) PARTITIONS 101;
  ```

  To process this `ALTER TABLE` statement, MySQL uses 402 file descriptors—that is, two for each of the 100 original partitions, plus two for each of the 101 new partitions. This is because all partitions (old and new) must be opened concurrently during the reorganization of the table data. It is recommended that, if you expect to perform such operations, you should make sure that the [`open_files_limit`](server-system-variables.html#sysvar_open_files_limit) system variable is not set too low to accommodate them.

* **Table locks.** Generally, the process executing a partitioning operation on a table takes a write lock on the table. Reads from such tables are relatively unaffected; pending [`INSERT`](insert.html "13.2.5 INSERT Statement") and [`UPDATE`](update.html "13.2.11 UPDATE Statement") operations are performed as soon as the partitioning operation has completed. For `InnoDB`-specific exceptions to this limitation, see [Partitioning Operations](innodb-online-ddl-operations.html#online-ddl-partitioning "Partitioning Operations").

* **Storage engine.** Partitioning operations, queries, and update operations generally tend to be faster with `MyISAM` tables than with `InnoDB` or [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables.

* **Indexes; partition pruning.** As with nonpartitioned tables, proper use of indexes can speed up queries on partitioned tables significantly. In addition, designing partitioned tables and queries on these tables to take advantage of partition pruning can improve performance dramatically. See [Section 22.4, “Partition Pruning”](partitioning-pruning.html "22.4 Partition Pruning"), for more information.

  Previously, index condition pushdown was not supported for partitioned tables. This limitation was removed in MySQL 5.7.3. See [Section 8.2.1.5, “Index Condition Pushdown Optimization”](index-condition-pushdown-optimization.html "8.2.1.5 Index Condition Pushdown Optimization").

* **Performance with LOAD DATA.** In MySQL 5.7, [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") uses buffering to improve performance. You should be aware that the buffer uses 130 KB memory per partition to achieve this.

**Maximum number of partitions.** The maximum possible number of partitions for a given table not using the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine is

8192. This number includes subpartitions.

The maximum possible number of user-defined partitions for a table using the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine is determined according to the version of the NDB Cluster software being used, the number of data nodes, and other factors. See [NDB and user-defined partitioning](mysql-cluster-nodes-groups.html#mysql-cluster-nodes-groups-user-partitioning "NDB and user-defined partitioning"), for more information.

If, when creating tables with a large number of partitions (but less than the maximum), you encounter an error message such as Got error ... from storage engine: Out of resources when opening file, you may be able to address the issue by increasing the value of the [`open_files_limit`](server-system-variables.html#sysvar_open_files_limit) system variable. However, this is dependent on the operating system, and may not be possible or advisable on all platforms; see [Section B.3.2.16, “File Not Found and Similar Errors”](not-enough-file-handles.html "B.3.2.16 File Not Found and Similar Errors"), for more information. In some cases, using large numbers (hundreds) of partitions may also not be advisable due to other concerns, so using more partitions does not automatically lead to better results.

See also [File system operations](partitioning-limitations.html#partitioning-limitations-file-system-ops "File system operations").

**Query cache not supported.** The query cache is not supported for partitioned tables, and is automatically disabled for queries involving partitioned tables. The query cache cannot be enabled for such queries.

**Per-partition key caches.** In MySQL 5.7, key caches are supported for partitioned [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") tables, using the [`CACHE INDEX`](cache-index.html "13.7.6.2 CACHE INDEX Statement") and [`LOAD INDEX INTO CACHE`](load-index.html "13.7.6.5 LOAD INDEX INTO CACHE Statement") statements. Key caches may be defined for one, several, or all partitions, and indexes for one, several, or all partitions may be preloaded into key caches.

**Foreign keys not supported for partitioned InnoDB tables.** Partitioned tables using the [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") storage engine do not support foreign keys. More specifically, this means that the following two statements are true:

1. No definition of an `InnoDB` table employing user-defined partitioning may contain foreign key references; no `InnoDB` table whose definition contains foreign key references may be partitioned.

2. No `InnoDB` table definition may contain a foreign key reference to a user-partitioned table; no `InnoDB` table with user-defined partitioning may contain columns referenced by foreign keys.

The scope of the restrictions just listed includes all tables that use the `InnoDB` storage engine. [`CREATE TABLE`](create-table-foreign-keys.html "13.1.18.5 FOREIGN KEY Constraints") and [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statements that would result in tables violating these restrictions are not allowed.

**ALTER TABLE ... ORDER BY.** An `ALTER TABLE ... ORDER BY column` statement run against a partitioned table causes ordering of rows only within each partition.

**Effects on REPLACE statements by modification of primary keys.** It can be desirable in some cases (see [Section 22.6.1, “Partitioning Keys, Primary Keys, and Unique Keys”](partitioning-limitations-partitioning-keys-unique-keys.html "22.6.1 Partitioning Keys, Primary Keys, and Unique Keys")) to modify a table's primary key. Be aware that, if your application uses [`REPLACE`](replace.html "13.2.8 REPLACE Statement") statements and you do this, the results of these statements can be drastically altered. See [Section 13.2.8, “REPLACE Statement”](replace.html "13.2.8 REPLACE Statement"), for more information and an example.

**FULLTEXT indexes.** Partitioned tables do not support `FULLTEXT` indexes or searches, even for partitioned tables employing the [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") or [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") storage engine.

**Spatial columns.** Columns with spatial data types such as `POINT` or `GEOMETRY` cannot be used in partitioned tables.

**Temporary tables.** Temporary tables cannot be partitioned. (Bug #17497)

**Log tables.** It is not possible to partition the log tables; an [`ALTER TABLE ... PARTITION BY ...`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations") statement on such a table fails with an error.

**Data type of partitioning key.** A partitioning key must be either an integer column or an expression that resolves to an integer. Expressions employing [`ENUM`](enum.html "11.3.5 The ENUM Type") columns cannot be used. The column or expression value may also be `NULL`. (See [Section 22.2.7, “How MySQL Partitioning Handles NULL”](partitioning-handling-nulls.html "22.2.7 How MySQL Partitioning Handles NULL").)

There are two exceptions to this restriction:

1. When partitioning by [`LINEAR`] `KEY`, it is possible to use columns of any valid MySQL data type other than [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") or [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") as partitioning keys, because MySQL's internal key-hashing functions produce the correct data type from these types. For example, the following two [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statements are valid:

   ```sql
   CREATE TABLE tkc (c1 CHAR)
   PARTITION BY KEY(c1)
   PARTITIONS 4;

   CREATE TABLE tke
       ( c1 ENUM('red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet') )
   PARTITION BY LINEAR KEY(c1)
   PARTITIONS 6;
   ```

2. When partitioning by `RANGE COLUMNS` or `LIST COLUMNS`, it is possible to use string, [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), and [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") columns. For example, each of the following [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statements is valid:

   ```sql
   CREATE TABLE rc (c1 INT, c2 DATE)
   PARTITION BY RANGE COLUMNS(c2) (
       PARTITION p0 VALUES LESS THAN('1990-01-01'),
       PARTITION p1 VALUES LESS THAN('1995-01-01'),
       PARTITION p2 VALUES LESS THAN('2000-01-01'),
       PARTITION p3 VALUES LESS THAN('2005-01-01'),
       PARTITION p4 VALUES LESS THAN(MAXVALUE)
   );

   CREATE TABLE lc (c1 INT, c2 CHAR(1))
   PARTITION BY LIST COLUMNS(c2) (
       PARTITION p0 VALUES IN('a', 'd', 'g', 'j', 'm', 'p', 's', 'v', 'y'),
       PARTITION p1 VALUES IN('b', 'e', 'h', 'k', 'n', 'q', 't', 'w', 'z'),
       PARTITION p2 VALUES IN('c', 'f', 'i', 'l', 'o', 'r', 'u', 'x', NULL)
   );
   ```

Neither of the preceding exceptions applies to [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") or [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") column types.

**Subqueries.** A partitioning key may not be a subquery, even if that subquery resolves to an integer value or `NULL`.

**Column index prefixes not supported for key partitioning.** When creating a table that is partitioned by key, any columns in the partitioning key which use column prefixes are not used in the table's partitioning function. Consider the following [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement, which has three [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") columns, and whose primary key uses all three columns and specifies prefixes for two of them:

```sql
CREATE TABLE t1 (
    a VARCHAR(10000),
    b VARCHAR(25),
    c VARCHAR(10),
    PRIMARY KEY (a(10), b, c(2))
) PARTITION BY KEY() PARTITIONS 2;
```

This statement is accepted, but the resulting table is actually created as if you had issued the following statement, using only the primary key column which does not include a prefix (column `b`) for the partitioning key:

```sql
CREATE TABLE t1 (
    a VARCHAR(10000),
    b VARCHAR(25),
    c VARCHAR(10),
    PRIMARY KEY (a(10), b, c(2))
) PARTITION BY KEY(b) PARTITIONS 2;
```

No warning is issued or any other indication provided that this has occurred, except in the event that all columns specified for the partitioning key use prefixes, in which case the statement fails with the error message shown here:

```sql
mysql> CREATE TABLE t2 (
    ->     a VARCHAR(10000),
    ->     b VARCHAR(25),
    ->     c VARCHAR(10),
    ->     PRIMARY KEY (a(10), b(5), c(2))
    -> ) PARTITION BY KEY() PARTITIONS 2;
ERROR 1503 (HY000): A PRIMARY KEY must include all columns in the
table's partitioning function
```

This also occurs when altering or upgrading such tables, and includes cases in which the columns used in the partitioning function are defined implicitly as those in the table's primary key by employing an empty `PARTITION BY KEY()` clause.

This is a known issue which is addressed in MySQL 8.0 by deprecating the permissive behavior; in MYSQL 8.0, if any columns using prefixes are included in a table's partitioning function, the server logs an appropriate warning for each such column, or raises a descriptive error if necessary. (Allowing the use of columns with prefixes in partitioning keys is subject to removal altogether in a future version of MySQL.)

For general information about partitioning tables by key, see [Section 22.2.5, “KEY Partitioning”](partitioning-key.html "22.2.5 KEY Partitioning").

**Issues with subpartitions.** Subpartitions must use `HASH` or `KEY` partitioning. Only `RANGE` and `LIST` partitions may be subpartitioned; `HASH` and `KEY` partitions cannot be subpartitioned.

`SUBPARTITION BY KEY` requires that the subpartitioning column or columns be specified explicitly, unlike the case with `PARTITION BY KEY`, where it can be omitted (in which case the table's primary key column is used by default). Consider the table created by this statement:

```sql
CREATE TABLE ts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
);
```

You can create a table having the same columns, partitioned by `KEY`, using a statement such as this one:

```sql
CREATE TABLE ts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
)
PARTITION BY KEY()
PARTITIONS 4;
```

The previous statement is treated as though it had been written like this, with the table's primary key column used as the partitioning column:

```sql
CREATE TABLE ts (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30)
)
PARTITION BY KEY(id)
PARTITIONS 4;
```

However, the following statement that attempts to create a subpartitioned table using the default column as the subpartitioning column fails, and the column must be specified for the statement to succeed, as shown here:

```sql
mysql> CREATE TABLE ts (
    ->     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ->     name VARCHAR(30)
    -> )
    -> PARTITION BY RANGE(id)
    -> SUBPARTITION BY KEY()
    -> SUBPARTITIONS 4
    -> (
    ->     PARTITION p0 VALUES LESS THAN (100),
    ->     PARTITION p1 VALUES LESS THAN (MAXVALUE)
    -> );
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that
corresponds to your MySQL server version for the right syntax to use near ')

mysql> CREATE TABLE ts (
    ->     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ->     name VARCHAR(30)
    -> )
    -> PARTITION BY RANGE(id)
    -> SUBPARTITION BY KEY(id)
    -> SUBPARTITIONS 4
    -> (
    ->     PARTITION p0 VALUES LESS THAN (100),
    ->     PARTITION p1 VALUES LESS THAN (MAXVALUE)
    -> );
Query OK, 0 rows affected (0.07 sec)
```

This is a known issue (see Bug #51470).

**DATA DIRECTORY and INDEX DIRECTORY options.** `DATA DIRECTORY` and `INDEX DIRECTORY` are subject to the following restrictions when used with partitioned tables:

* Table-level `DATA DIRECTORY` and `INDEX DIRECTORY` options are ignored (see Bug #32091).

* On Windows, the `DATA DIRECTORY` and `INDEX DIRECTORY` options are not supported for individual partitions or subpartitions of [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") tables. However, you can use `DATA DIRECTORY` for individual partitions or subpartitions of [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") tables.

**Repairing and rebuilding partitioned tables.** The statements [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement"), [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement"), [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement"), and [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") are supported for partitioned tables.

In addition, you can use `ALTER TABLE ... REBUILD PARTITION` to rebuild one or more partitions of a partitioned table; `ALTER TABLE ... REORGANIZE PARTITION` also causes partitions to be rebuilt. See [Section 13.1.8, “ALTER TABLE Statement”](alter-table.html "13.1.8 ALTER TABLE Statement"), for more information about these two statements.

Starting in MySQL 5.7.2, `ANALYZE`, `CHECK`, `OPTIMIZE`, `REPAIR`, and `TRUNCATE` operations are supported with subpartitions. `REBUILD` was also accepted syntax prior to MySQL 5.7.5, although this had no effect. (Bug #19075411, Bug #73130) See also [Section 13.1.8.1, “ALTER TABLE Partition Operations”](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations").

[**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program"), [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility"), and [**myisampack**](myisampack.html "4.6.5 myisampack — Generate Compressed, Read-Only MyISAM Tables") are not supported with partitioned tables.

**FOR EXPORT option (FLUSH TABLES).** The [`FLUSH TABLES`](flush.html#flush-tables-for-export-with-list) statement's `FOR EXPORT` option is not supported for partitioned `InnoDB` tables in MySQL 5.7.4 and earlier. (Bug #16943907)

**File name delimiters for partitions and subpartitions.** Table partition and subpartition file names include generated delimiters such as `#P#` and `#SP#`. The lettercase of such delimiters can vary and should not be depended upon.
