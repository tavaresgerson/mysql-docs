#### 13.1.8.1 ALTER TABLE Partition Operations

Partitioning-related clauses for [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") can be used with partitioned tables for repartitioning, to add, drop, discard, import, merge, and split partitions, and to perform partitioning maintenance.

* Simply using a *`partition_options`* clause with [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") on a partitioned table repartitions the table according to the partitioning scheme defined by the *`partition_options`*. This clause always begins with `PARTITION BY`, and follows the same syntax and other rules as apply to the *`partition_options`* clause for [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") (for more detailed information, see [Section 13.1.18, “CREATE TABLE Statement”](create-table.html "13.1.18 CREATE TABLE Statement")), and can also be used to partition an existing table that is not already partitioned. For example, consider a (nonpartitioned) table defined as shown here:

  ```sql
  CREATE TABLE t1 (
      id INT,
      year_col INT
  );
  ```

  This table can be partitioned by `HASH`, using the `id` column as the partitioning key, into 8 partitions by means of this statement:

  ```sql
  ALTER TABLE t1
      PARTITION BY HASH(id)
      PARTITIONS 8;
  ```

  MySQL supports an `ALGORITHM` option with `[SUB]PARTITION BY [LINEAR] KEY`. `ALGORITHM=1` causes the server to use the same key-hashing functions as MySQL 5.1 when computing the placement of rows in partitions; `ALGORITHM=2` means that the server employs the key-hashing functions implemented and used by default for new `KEY` partitioned tables in MySQL 5.5 and later. (Partitioned tables created with the key-hashing functions employed in MySQL 5.5 and later cannot be used by a MySQL 5.1 server.) Not specifying the option has the same effect as using `ALGORITHM=2`. This option is intended for use chiefly when upgrading or downgrading `[LINEAR] KEY` partitioned tables between MySQL 5.1 and later MySQL versions, or for creating tables partitioned by `KEY` or `LINEAR KEY` on a MySQL 5.5 or later server which can be used on a MySQL 5.1 server.

  To upgrade a `KEY` partitioned table that was created in MySQL 5.1, first execute [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement") and note the exact columns and number of partitions shown. Now execute an `ALTER TABLE` statement using exactly the same column list and number of partitions as in the `CREATE TABLE` statement, while adding `ALGORITHM=2` immediately following the `PARTITION BY` keywords. (You should also include the `LINEAR` keyword if it was used for the original table definition.) An example from a session in the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client is shown here:

  ```sql
  mysql> SHOW CREATE TABLE p\G
  *************************** 1. row ***************************
         Table: p
  Create Table: CREATE TABLE `p` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `cd` datetime NOT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=latin1
  /*!50100 PARTITION BY LINEAR KEY (id)
  PARTITIONS 32 */
  1 row in set (0.00 sec)

  mysql> ALTER TABLE p PARTITION BY LINEAR KEY ALGORITHM=2 (id) PARTITIONS 32;
  Query OK, 0 rows affected (5.34 sec)
  Records: 0  Duplicates: 0  Warnings: 0

  mysql> SHOW CREATE TABLE p\G
  *************************** 1. row ***************************
         Table: p
  Create Table: CREATE TABLE `p` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `cd` datetime NOT NULL,
    PRIMARY KEY (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=latin1
  /*!50100 PARTITION BY LINEAR KEY (id)
  PARTITIONS 32 */
  1 row in set (0.00 sec)
  ```

  Downgrading a table created using the default key-hashing used in MySQL 5.5 and later to enable its use by a MySQL 5.1 server is similar, except in this case you should use `ALGORITHM=1` to force the table's partitions to be rebuilt using the MySQL 5.1 key-hashing functions. It is recommended that you not do this except when necessary for compatibility with a MySQL 5.1 server, as the improved `KEY` hashing functions used by default in MySQL 5.5 and later provide fixes for a number of issues found in the older implementation.

  Note

  A table upgraded by means of `ALTER TABLE ... PARTITION BY ALGORITHM=2 [LINEAR] KEY ...` can no longer be used by a MySQL 5.1 server. (Such a table would need to be downgraded with `ALTER TABLE ... PARTITION BY ALGORITHM=1 [LINEAR] KEY ...` before it could be used again by a MySQL 5.1 server.)

  The table that results from using an `ALTER TABLE ... PARTITION BY` statement must follow the same rules as one created using `CREATE TABLE ... PARTITION BY`. This includes the rules governing the relationship between any unique keys (including any primary key) that the table might have, and the column or columns used in the partitioning expression, as discussed in [Section 22.6.1, “Partitioning Keys, Primary Keys, and Unique Keys”](partitioning-limitations-partitioning-keys-unique-keys.html "22.6.1 Partitioning Keys, Primary Keys, and Unique Keys"). The `CREATE TABLE ... PARTITION BY` rules for specifying the number of partitions also apply to `ALTER TABLE ... PARTITION BY`.

  The *`partition_definition`* clause for `ALTER TABLE ADD PARTITION` supports the same options as the clause of the same name for the [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement. (See [Section 13.1.18, “CREATE TABLE Statement”](create-table.html "13.1.18 CREATE TABLE Statement"), for the syntax and description.) Suppose that you have the partitioned table created as shown here:

  ```sql
  CREATE TABLE t1 (
      id INT,
      year_col INT
  )
  PARTITION BY RANGE (year_col) (
      PARTITION p0 VALUES LESS THAN (1991),
      PARTITION p1 VALUES LESS THAN (1995),
      PARTITION p2 VALUES LESS THAN (1999)
  );
  ```

  You can add a new partition `p3` to this table for storing values less than `2002` as follows:

  ```sql
  ALTER TABLE t1 ADD PARTITION (PARTITION p3 VALUES LESS THAN (2002));
  ```

  `DROP PARTITION` can be used to drop one or more `RANGE` or `LIST` partitions. This statement cannot be used with `HASH` or `KEY` partitions; instead, use `COALESCE PARTITION` (see below). Any data that was stored in the dropped partitions named in the *`partition_names`* list is discarded. For example, given the table `t1` defined previously, you can drop the partitions named `p0` and `p1` as shown here:

  ```sql
  ALTER TABLE t1 DROP PARTITION p0, p1;
  ```

  Note

  `DROP PARTITION` does not work with tables that use the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine. See [Section 22.3.1, “Management of RANGE and LIST Partitions”](partitioning-management-range-list.html "22.3.1 Management of RANGE and LIST Partitions"), and [Section 21.2.7, “Known Limitations of NDB Cluster”](mysql-cluster-limitations.html "21.2.7 Known Limitations of NDB Cluster").

  `ADD PARTITION` and `DROP PARTITION` do not currently support `IF [NOT] EXISTS`.

  [`DISCARD PARTITION ... TABLESPACE`](alter-table.html "13.1.8 ALTER TABLE Statement") and [`IMPORT PARTITION ... TABLESPACE`](alter-table.html "13.1.8 ALTER TABLE Statement") options extend the [Transportable Tablespace](glossary.html#glos_transportable_tablespace "transportable tablespace") feature to individual `InnoDB` table partitions. Each `InnoDB` table partition has its own tablespace file (`.ibd` file). The [Transportable Tablespace](glossary.html#glos_transportable_tablespace "transportable tablespace") feature makes it easy to copy the tablespaces from a running MySQL server instance to another running instance, or to perform a restore on the same instance. Both options take a list of one or more comma-separated partition names. For example:

  ```sql
  ALTER TABLE t1 DISCARD PARTITION p2, p3 TABLESPACE;
  ```

  ```sql
  ALTER TABLE t1 IMPORT PARTITION p2, p3 TABLESPACE;
  ```

  When running [`DISCARD PARTITION ... TABLESPACE`](alter-table.html "13.1.8 ALTER TABLE Statement") and [`IMPORT PARTITION ... TABLESPACE`](alter-table.html "13.1.8 ALTER TABLE Statement") on subpartitioned tables, both partition and subpartition names are allowed. When a partition name is specified, subpartitions of that partition are included.

  The [Transportable Tablespace](glossary.html#glos_transportable_tablespace "transportable tablespace") feature also supports copying or restoring partitioned `InnoDB` tables. For more information, see [Section 14.6.1.3, “Importing InnoDB Tables”](innodb-table-import.html "14.6.1.3 Importing InnoDB Tables").

  Renames of partitioned tables are supported. You can rename individual partitions indirectly using `ALTER TABLE ... REORGANIZE PARTITION`; however, this operation copies the partition's data.

  To delete rows from selected partitions, use the `TRUNCATE PARTITION` option. This option takes a comma-separated list of one or more partition names. For example, consider the table `t1` as defined here:

  ```sql
  CREATE TABLE t1 (
      id INT,
      year_col INT
  )
  PARTITION BY RANGE (year_col) (
      PARTITION p0 VALUES LESS THAN (1991),
      PARTITION p1 VALUES LESS THAN (1995),
      PARTITION p2 VALUES LESS THAN (1999),
      PARTITION p3 VALUES LESS THAN (2003),
      PARTITION p4 VALUES LESS THAN (2007)
  );
  ```

  To delete all rows from partition `p0`, use the following statement:

  ```sql
  ALTER TABLE t1 TRUNCATE PARTITION p0;
  ```

  The statement just shown has the same effect as the following [`DELETE`](delete.html "13.2.2 DELETE Statement") statement:

  ```sql
  DELETE FROM t1 WHERE year_col < 1991;
  ```

  When truncating multiple partitions, the partitions do not have to be contiguous: This can greatly simplify delete operations on partitioned tables that would otherwise require very complex `WHERE` conditions if done with [`DELETE`](delete.html "13.2.2 DELETE Statement") statements. For example, this statement deletes all rows from partitions `p1` and `p3`:

  ```sql
  ALTER TABLE t1 TRUNCATE PARTITION p1, p3;
  ```

  An equivalent [`DELETE`](delete.html "13.2.2 DELETE Statement") statement is shown here:

  ```sql
  DELETE FROM t1 WHERE
      (year_col >= 1991 AND year_col < 1995)
      OR
      (year_col >= 2003 AND year_col < 2007);
  ```

  If you use the `ALL` keyword in place of the list of partition names, the statement acts on all table partitions.

  `TRUNCATE PARTITION` merely deletes rows; it does not alter the definition of the table itself, or of any of its partitions.

  To verify that the rows were dropped, check the `INFORMATION_SCHEMA.PARTITIONS` table, using a query such as this one:

  ```sql
  SELECT PARTITION_NAME, TABLE_ROWS
      FROM INFORMATION_SCHEMA.PARTITIONS
      WHERE TABLE_NAME = 't1';
  ```

  `TRUNCATE PARTITION` is supported only for partitioned tables that use the [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"), [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), or [`MEMORY`](memory-storage-engine.html "15.3 The MEMORY Storage Engine") storage engine. It also works on [`BLACKHOLE`](blackhole-storage-engine.html "15.6 The BLACKHOLE Storage Engine") tables (but has no effect). It is not supported for [`ARCHIVE`](archive-storage-engine.html "15.5 The ARCHIVE Storage Engine") tables.

  `COALESCE PARTITION` can be used with a table that is partitioned by `HASH` or `KEY` to reduce the number of partitions by *`number`*. Suppose that you have created table `t2` as follows:

  ```sql
  CREATE TABLE t2 (
      name VARCHAR (30),
      started DATE
  )
  PARTITION BY HASH( YEAR(started) )
  PARTITIONS 6;
  ```

  To reduce the number of partitions used by `t2` from 6 to 4, use the following statement:

  ```sql
  ALTER TABLE t2 COALESCE PARTITION 2;
  ```

  The data contained in the last *`number`* partitions are merged into the remaining partitions. In this case, partitions 4 and 5 are merged into the first 4 partitions (the partitions numbered 0, 1, 2, and 3).

  To change some but not all the partitions used by a partitioned table, you can use `REORGANIZE PARTITION`. This statement can be used in several ways:

  + To merge a set of partitions into a single partition. This is done by naming several partitions in the *`partition_names`* list and supplying a single definition for *`partition_definition`*.

  + To split an existing partition into several partitions. Accomplish this by naming a single partition for *`partition_names`* and providing multiple *`partition_definitions`*.

  + To change the ranges for a subset of partitions defined using `VALUES LESS THAN` or the value lists for a subset of partitions defined using `VALUES IN`.

  + This statement may also be used without the `partition_names INTO (partition_definitions)` option on tables that are automatically partitioned using `HASH` partitioning to force redistribution of data. (Currently, only [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables are automatically partitioned in this way.) This is useful in NDB Cluster where, after you have added new NDB Cluster data nodes online to an existing NDB Cluster, you wish to redistribute existing NDB Cluster table data to the new data nodes. In such cases, you should invoke the statement with the `ALGORITHM=INPLACE` option; in other words, as shown here:

    ```sql
    ALTER TABLE table ALGORITHM=INPLACE, REORGANIZE PARTITION;
    ```

    You cannot perform other DDL concurrently with online table reorganization—that is, no other DDL statements can be issued while an `ALTER TABLE ... ALGORITHM=INPLACE, REORGANIZE PARTITION` statement is executing. For more information about adding NDB Cluster data nodes online, see [Section 21.6.7, “Adding NDB Cluster Data Nodes Online”](mysql-cluster-online-add-node.html "21.6.7 Adding NDB Cluster Data Nodes Online").

    Note

    `ALTER TABLE ... ALGORITHM=INPLACE, REORGANIZE PARTITION` does not work with tables which were created using the `MAX_ROWS` option, because it uses the constant `MAX_ROWS` value specified in the original [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement to determine the number of partitions required, so no new partitions are created. Instead, you can use `ALTER TABLE ... ALGORITHM=INPLACE, MAX_ROWS=rows` to increase the maximum number of rows for such a table; in this case, `ALTER TABLE ... ALGORITHM=INPLACE, REORGANIZE PARTITION` is not needed (and causes an error if executed). The value of *`rows`* must be greater than the value specified for `MAX_ROWS` in the original `CREATE TABLE` statement for this to work.

    Employing `MAX_ROWS` to force the number of table partitions is deprecated in NDB 7.5.4 and later; use `PARTITION_BALANCE` instead (see [Setting NDB_TABLE options](create-table.html#create-table-comment-ndb-table-options "Setting NDB_TABLE options")).

    Attempting to use `REORGANIZE PARTITION` without the `partition_names INTO (partition_definitions)` option on explicitly partitioned tables results in the error REORGANIZE PARTITION without parameters can only be used on auto-partitioned tables using HASH partitioning.

  Note

  For partitions that have not been explicitly named, MySQL automatically provides the default names `p0`, `p1`, `p2`, and so on. The same is true with regard to subpartitions.

  For more detailed information about and examples of `ALTER TABLE ... REORGANIZE PARTITION` statements, see [Section 22.3.1, “Management of RANGE and LIST Partitions”](partitioning-management-range-list.html "22.3.1 Management of RANGE and LIST Partitions").

* To exchange a table partition or subpartition with a table, use the [`ALTER TABLE ... EXCHANGE PARTITION`](alter-table.html "13.1.8 ALTER TABLE Statement") statement—that is, to move any existing rows in the partition or subpartition to the nonpartitioned table, and any existing rows in the nonpartitioned table to the table partition or subpartition.

  For usage information and examples, see [Section 22.3.3, “Exchanging Partitions and Subpartitions with Tables”](partitioning-management-exchange.html "22.3.3 Exchanging Partitions and Subpartitions with Tables").

* Several options provide partition maintenance and repair functionality analogous to that implemented for nonpartitioned tables by statements such as [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") and [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") (which are also supported for partitioned tables; for more information, see [Section 13.7.2, “Table Maintenance Statements”](table-maintenance-statements.html "13.7.2 Table Maintenance Statements")). These include `ANALYZE PARTITION`, `CHECK PARTITION`, `OPTIMIZE PARTITION`, `REBUILD PARTITION`, and `REPAIR PARTITION`. Each of these options takes a *`partition_names`* clause consisting of one or more names of partitions, separated by commas. The partitions must already exist in the table to be altered. You can also use the `ALL` keyword in place of *`partition_names`*, in which case the statement acts on all table partitions. For more information and examples, see [Section 22.3.4, “Maintenance of Partitions”](partitioning-maintenance.html "22.3.4 Maintenance of Partitions").

  Some MySQL storage engines, such as [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), do not support per-partition optimization. For a partitioned table using such a storage engine, `ALTER TABLE ... OPTIMIZE PARTITION` causes the entire table to rebuilt and analyzed, and an appropriate warning to be issued. (Bug
  #11751825, Bug #42822)

  To work around this problem, use the statements `ALTER TABLE ... REBUILD PARTITION` and `ALTER TABLE ... ANALYZE PARTITION` instead.

  The `ANALYZE PARTITION`, `CHECK PARTITION`, `OPTIMIZE PARTITION`, and `REPAIR PARTITION` options are not permitted for tables which are not partitioned.

* In MySQL 5.7.9 and later, you can use `ALTER TABLE ... UPGRADE PARTITIONING` to upgrade a partitioned [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") table that was created with the old generic partitioning handler to the `InnoDB` native partitioning employed in MySQL 5.7.6 and later. Also beginning with MySQL 5.7.9, the [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") utility checks for such partitioned `InnoDB` tables and attempts to upgrade them to native partitioning as part of its normal operations.

  Important

  Partitioned `InnoDB` tables that do not use the `InnoDB` native partitioning handler cannot be used in MySQL 8.0 or later. `ALTER TABLE ... UPGRADE PARTITIONING` is not supported in MySQL 8.0 or later; therefore, any partitioned `InnoDB` tables that employ the generic handler *must* be upgraded to the InnoDB native handler *before* upgrading your MySQL installation to MySQL 8.0 or later.

* `REMOVE PARTITIONING` enables you to remove a table's partitioning without otherwise affecting the table or its data. This option can be combined with other [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") options such as those used to add, drop, or rename columns or indexes.

* Using the `ENGINE` option with [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") changes the storage engine used by the table without affecting the partitioning.

When `ALTER TABLE ... EXCHANGE PARTITION` or `ALTER TABLE ... TRUNCATE PARTITION` is run against a partitioned table that uses [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") (or another storage engine that makes use of table-level locking), only those partitions that are actually read from are locked. (This does not apply to partitioned tables using a storage enginethat employs row-level locking, such as [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine").) See [Section 22.6.4, “Partitioning and Locking”](partitioning-limitations-locking.html "22.6.4 Partitioning and Locking").

It is possible for an [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement to contain a `PARTITION BY` or `REMOVE PARTITIONING` clause in an addition to other alter specifications, but the `PARTITION BY` or `REMOVE PARTITIONING` clause must be specified last after any other specifications.

The `ADD PARTITION`, `DROP PARTITION`, `COALESCE PARTITION`, `REORGANIZE PARTITION`, `ANALYZE PARTITION`, `CHECK PARTITION`, and `REPAIR PARTITION` options cannot be combined with other alter specifications in a single `ALTER TABLE`, since the options just listed act on individual partitions. For more information, see [Section 13.1.8.1, “ALTER TABLE Partition Operations”](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations").

Only a single instance of any one of the following options can be used in a given [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement: `PARTITION BY`, `ADD PARTITION`, `DROP PARTITION`, `TRUNCATE PARTITION`, `EXCHANGE PARTITION`, `REORGANIZE PARTITION`, or `COALESCE PARTITION`, `ANALYZE PARTITION`, `CHECK PARTITION`, `OPTIMIZE PARTITION`, `REBUILD PARTITION`, `REMOVE PARTITIONING`.

For example, the following two statements are invalid:

```sql
ALTER TABLE t1 ANALYZE PARTITION p1, ANALYZE PARTITION p2;

ALTER TABLE t1 ANALYZE PARTITION p1, CHECK PARTITION p2;
```

In the first case, you can analyze partitions `p1` and `p2` of table `t1` concurrently using a single statement with a single `ANALYZE PARTITION` option that lists both of the partitions to be analyzed, like this:

```sql
ALTER TABLE t1 ANALYZE PARTITION p1, p2;
```

In the second case, it is not possible to perform `ANALYZE` and `CHECK` operations on different partitions of the same table concurrently. Instead, you must issue two separate statements, like this:

```sql
ALTER TABLE t1 ANALYZE PARTITION p1;
ALTER TABLE t1 CHECK PARTITION p2;
```

`REBUILD` operations are currently unsupported for subpartitions. The `REBUILD` keyword is expressly disallowed with subpartitions, and causes `ALTER TABLE` to fail with an error if so used.

`CHECK PARTITION` and `REPAIR PARTITION` operations fail when the partition to be checked or repaired contains any duplicate key errors.

For more information about these statements, see [Section 22.3.4, “Maintenance of Partitions”](partitioning-maintenance.html "22.3.4 Maintenance of Partitions").
