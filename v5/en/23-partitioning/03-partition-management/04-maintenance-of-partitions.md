### 22.3.4 Maintenance of Partitions

A number of table and partition maintenance tasks can be carried out using SQL statements intended for such purposes on partitioned tables in MySQL 5.7.

Table maintenance of partitioned tables can be accomplished using the statements [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement"), [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement"), [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement"), and [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement"), which are supported for partitioned tables.

You can use a number of extensions to [`ALTER TABLE`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations") for performing operations of this type on one or more partitions directly, as described in the following list:

* **Rebuilding partitions.** Rebuilds the partition; this has the same effect as dropping all records stored in the partition, then reinserting them. This can be useful for purposes of defragmentation.

  Example:

  ```sql
  ALTER TABLE t1 REBUILD PARTITION p0, p1;
  ```

* **Optimizing partitions.** If you have deleted a large number of rows from a partition or if you have made many changes to a partitioned table with variable-length rows (that is, having [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types"), or [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") columns), you can use [`ALTER TABLE ... OPTIMIZE PARTITION`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations") to reclaim any unused space and to defragment the partition data file.

  Example:

  ```sql
  ALTER TABLE t1 OPTIMIZE PARTITION p0, p1;
  ```

  Using `OPTIMIZE PARTITION` on a given partition is equivalent to running `CHECK PARTITION`, `ANALYZE PARTITION`, and `REPAIR PARTITION` on that partition.

  Some MySQL storage engines, including [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), do not support per-partition optimization; in these cases, [`ALTER TABLE ... OPTIMIZE PARTITION`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations") analyzes and rebuilds the entire table, and causes an appropriate warning to be issued. (Bug #11751825, Bug #42822) Use `ALTER TABLE ... REBUILD PARTITION` and `ALTER TABLE ... ANALYZE PARTITION` instead, to avoid this issue.

* **Analyzing partitions.** This reads and stores the key distributions for partitions.

  Example:

  ```sql
  ALTER TABLE t1 ANALYZE PARTITION p3;
  ```

* **Repairing partitions.** This repairs corrupted partitions.

  Example:

  ```sql
  ALTER TABLE t1 REPAIR PARTITION p0,p1;
  ```

  Normally, `REPAIR PARTITION` fails when the partition contains duplicate key errors. In MySQL 5.7.2 and later, you can use [`ALTER IGNORE TABLE`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations") with this option, in which case all rows that cannot be moved due to the presence of duplicate keys are removed from the partition (Bug #16900947).

* **Checking partitions.** You can check partitions for errors in much the same way that you can use `CHECK TABLE` with nonpartitioned tables.

  Example:

  ```sql
  ALTER TABLE trb3 CHECK PARTITION p1;
  ```

  This command tells you if the data or indexes in partition `p1` of table `t1` are corrupted. If this is the case, use [`ALTER TABLE ... REPAIR PARTITION`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations") to repair the partition.

  Normally, `CHECK PARTITION` fails when the partition contains duplicate key errors. In MySQL 5.7.2 and later, you can use [`ALTER IGNORE TABLE`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations") with this option, in which case the statement returns the contents of each row in the partition where a duplicate key violation is found. Only the values for the columns in the partitioning expression for the table are reported. (Bug #16900947)

Each of the statements in the list just shown also supports the keyword `ALL` in place of the list of partition names. Using `ALL` causes the statement to act on all partitions in the table.

The use of [**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program") and [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") is not supported with partitioned tables.

In MySQL 5.7, you can also truncate partitions using [`ALTER TABLE ... TRUNCATE PARTITION`](alter-table.html "13.1.8 ALTER TABLE Statement"). This statement can be used to delete all rows from one or more partitions in much the same way that [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") deletes all rows from a table.

[`ALTER TABLE ... TRUNCATE PARTITION ALL`](alter-table.html "13.1.8 ALTER TABLE Statement") truncates all partitions in the table.

Prior to MySQL 5.7.2, `ANALYZE`, `CHECK`, `OPTIMIZE`, `REBUILD`, `REPAIR`, and `TRUNCATE` operations were not permitted on subpartitions (Bug #14028340, Bug #65184).
