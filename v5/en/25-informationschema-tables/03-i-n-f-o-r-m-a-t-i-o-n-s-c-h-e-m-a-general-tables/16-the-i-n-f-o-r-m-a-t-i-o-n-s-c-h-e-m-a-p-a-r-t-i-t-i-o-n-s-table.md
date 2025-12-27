### 24.3.16 The INFORMATION\_SCHEMA PARTITIONS Table

The [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table") table provides information about table partitions. Each row in this table corresponds to an individual partition or subpartition of a partitioned table. For more information about partitioning tables, see [Chapter 22, *Partitioning*](partitioning.html "Chapter 22 Partitioning").

The [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table") table has these columns:

* `TABLE_CATALOG`

  The name of the catalog to which the table belongs. This value is always `def`.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the table belongs.

* `TABLE_NAME`

  The name of the table containing the partition.

* `PARTITION_NAME`

  The name of the partition.

* `SUBPARTITION_NAME`

  If the [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table") table row represents a subpartition, the name of subpartition; otherwise `NULL`.

* `PARTITION_ORDINAL_POSITION`

  All partitions are indexed in the same order as they are defined, with `1` being the number assigned to the first partition. The indexing can change as partitions are added, dropped, and reorganized; the number shown is this column reflects the current order, taking into account any indexing changes.

* `SUBPARTITION_ORDINAL_POSITION`

  Subpartitions within a given partition are also indexed and reindexed in the same manner as partitions are indexed within a table.

* `PARTITION_METHOD`

  One of the values `RANGE`, `LIST`, `HASH`, `LINEAR HASH`, `KEY`, or `LINEAR KEY`; that is, one of the available partitioning types as discussed in [Section 22.2, “Partitioning Types”](partitioning-types.html "22.2 Partitioning Types").

* `SUBPARTITION_METHOD`

  One of the values `HASH`, `LINEAR HASH`, `KEY`, or `LINEAR KEY`; that is, one of the available subpartitioning types as discussed in [Section 22.2.6, “Subpartitioning”](partitioning-subpartitions.html "22.2.6 Subpartitioning").

* `PARTITION_EXPRESSION`

  The expression for the partitioning function used in the [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") or [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement that created the table's current partitioning scheme.

  For example, consider a partitioned table created in the `test` database using this statement:

  ```sql
  CREATE TABLE tp (
      c1 INT,
      c2 INT,
      c3 VARCHAR(25)
  )
  PARTITION BY HASH(c1 + c2)
  PARTITIONS 4;
  ```

  The `PARTITION_EXPRESSION` column in a [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table") table row for a partition from this table displays `c1 + c2`, as shown here:

  ```sql
  mysql> SELECT DISTINCT PARTITION_EXPRESSION
         FROM INFORMATION_SCHEMA.PARTITIONS
         WHERE TABLE_NAME='tp' AND TABLE_SCHEMA='test';
  +----------------------+
  | PARTITION_EXPRESSION |
  +----------------------+
  | c1 + c2              |
  +----------------------+
  ```

  For an [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table that is not explicitly partitioned, this column is empty. For tables using other storage engines and which are not partitioned, this column is `NULL`.

* `SUBPARTITION_EXPRESSION`

  This works in the same fashion for the subpartitioning expression that defines the subpartitioning for a table as `PARTITION_EXPRESSION` does for the partitioning expression used to define a table's partitioning.

  If the table has no subpartitions, this column is `NULL`.

* `PARTITION_DESCRIPTION`

  This column is used for RANGE and LIST partitions. For a `RANGE` partition, it contains the value set in the partition's `VALUES LESS THAN` clause, which can be either an integer or `MAXVALUE`. For a `LIST` partition, this column contains the values defined in the partition's `VALUES IN` clause, which is a list of comma-separated integer values.

  For partitions whose `PARTITION_METHOD` is other than `RANGE` or `LIST`, this column is always `NULL`.

* `TABLE_ROWS`

  The number of table rows in the partition.

  For partitioned [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") tables, the row count given in the `TABLE_ROWS` column is only an estimated value used in SQL optimization, and may not always be exact.

  For [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables, you can also obtain this information using the [**ndb\_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables") utility.

* `AVG_ROW_LENGTH`

  The average length of the rows stored in this partition or subpartition, in bytes. This is the same as `DATA_LENGTH` divided by `TABLE_ROWS`.

  For [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables, you can also obtain this information using the [**ndb\_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables") utility.

* `DATA_LENGTH`

  The total length of all rows stored in this partition or subpartition, in bytes; that is, the total number of bytes stored in the partition or subpartition.

  For [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables, you can also obtain this information using the [**ndb\_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables") utility.

* `MAX_DATA_LENGTH`

  The maximum number of bytes that can be stored in this partition or subpartition.

  For [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables, you can also obtain this information using the [**ndb\_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables") utility.

* `INDEX_LENGTH`

  The length of the index file for this partition or subpartition, in bytes.

  For partitions of [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables, whether the tables use implicit or explicit partitioning, the `INDEX_LENGTH` column value is always 0. However, you can obtain equivalent information using the [**ndb\_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables") utility.

* `DATA_FREE`

  The number of bytes allocated to the partition or subpartition but not used.

  For [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables, you can also obtain this information using the [**ndb\_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables") utility.

* `CREATE_TIME`

  The time that the partition or subpartition was created.

* `UPDATE_TIME`

  The time that the partition or subpartition was last modified.

* `CHECK_TIME`

  The last time that the table to which this partition or subpartition belongs was checked.

  For partitioned [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") tables, the value is always `NULL`.

* `CHECKSUM`

  The checksum value, if any; otherwise `NULL`.

* `PARTITION_COMMENT`

  The text of the comment, if the partition has one. If not, this value is empty.

  The maximum length for a partition comment is defined as 1024 characters, and the display width of the `PARTITION_COMMENT` column is also 1024, characters to match this limit.

* `NODEGROUP`

  This is the nodegroup to which the partition belongs. For NDB Cluster tables, this is always `default`. For partitioned tables using storage engines other than [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), the value is also `default`. Otherwise, this column is empty.

* `TABLESPACE_NAME`

  The name of the tablespace to which the partition belongs. The value is always `DEFAULT`, unless the table uses the `NDB` storage engine (see the *Notes* at the end of this section).

#### Notes

* [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table") is a nonstandard `INFORMATION_SCHEMA` table.

* A table using any storage engine other than [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") and which is not partitioned has one row in the [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table") table. However, the values of the `PARTITION_NAME`, `SUBPARTITION_NAME`, `PARTITION_ORDINAL_POSITION`, `SUBPARTITION_ORDINAL_POSITION`, `PARTITION_METHOD`, `SUBPARTITION_METHOD`, `PARTITION_EXPRESSION`, `SUBPARTITION_EXPRESSION`, and `PARTITION_DESCRIPTION` columns are all `NULL`. Also, the `PARTITION_COMMENT` column in this case is blank.

* An `NDB` table which is not explicitly partitioned has one row in the `PARTITIONS` table for each data node in the NDB cluster. For each such row:

  + The `SUBPARTITION_NAME`, `SUBPARTITION_ORDINAL_POSITION`, `SUBPARTITION_METHOD`, `SUBPARTITION_EXPRESSION`, `CREATE_TIME`, `UPDATE_TIME`, `CHECK_TIME`, `CHECKSUM`, and `TABLESPACE_NAME` columns are all `NULL`.

  + The `PARTITION_METHOD` is always `KEY`.

  + The `NODEGROUP` column is `default`.

  + The `PARTITION_EXPRESSION` and `PARTITION_COMMENT` columns are empty.
