#### 21.2.7.1 Noncompliance with SQL Syntax in NDB Cluster

Some SQL statements relating to certain MySQL features produce errors when used with [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables, as described in the following list:

* **Temporary tables.** Temporary tables are not supported. Trying either to create a temporary table that uses the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine or to alter an existing temporary table to use [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") fails with the error Table storage engine 'ndbcluster' does not support the create option 'TEMPORARY'.

* **Indexes and keys in NDB tables.** Keys and indexes on NDB Cluster tables are subject to the following limitations:

  + **Column width.** Attempting to create an index on an `NDB` table column whose width is greater than 3072 bytes is rejected with [`ER_TOO_LONG_KEY`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_too_long_key): Specified key was too long; max key length is 3072 bytes.

    Attempting to create an index on an `NDB` table column whose width is greater than 3056 bytes succeeds with a warning. In such cases, statistical information is not generated, which means a nonoptimal execution plan may be selected. For this reason, you should consider making the index length shorter than 3056 bytes if possible.

  + **TEXT and BLOB columns.** You cannot create indexes on [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table columns that use any of the [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") or [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") data types.

  + **FULLTEXT indexes.** The [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine does not support `FULLTEXT` indexes, which are possible for [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") and [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") tables only.

    However, you can create indexes on [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") columns of [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables.

  + **USING HASH keys and NULL.** Using nullable columns in unique keys and primary keys means that queries using these columns are handled as full table scans. To work around this issue, make the column `NOT NULL`, or re-create the index without the `USING HASH` option.

  + **Prefixes.** There are no prefix indexes; only entire columns can be indexed. (The size of an `NDB` column index is always the same as the width of the column in bytes, up to and including 3072 bytes, as described earlier in this section. Also see [Section 21.2.7.6, “Unsupported or Missing Features in NDB Cluster”](mysql-cluster-limitations-unsupported.html "21.2.7.6 Unsupported or Missing Features in NDB Cluster"), for additional information.)

  + **BIT columns.** A [`BIT`](bit-type.html "11.1.5 Bit-Value Type - BIT") column cannot be a primary key, unique key, or index, nor can it be part of a composite primary key, unique key, or index.

  + **AUTO\_INCREMENT columns.** Like other MySQL storage engines, the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine can handle a maximum of one `AUTO_INCREMENT` column per table, and this column must be indexed. However, in the case of an NDB table with no explicit primary key, an `AUTO_INCREMENT` column is automatically defined and used as a “hidden” primary key. For this reason, you cannot create an `NDB` table having an `AUTO_INCREMENT` column and no explicit primary key.

    The following [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statements do not work, as shown here:

    ```sql
    # No index on AUTO_INCREMENT column; table has no primary key
    # Raises ER_WRONG_AUTO_KEY
    mysql> CREATE TABLE n (
        ->     a INT,
        ->     b INT AUTO_INCREMENT
        ->     )
        -> ENGINE=NDB;
    ERROR 1075 (42000): Incorrect table definition; there can be only one auto
    column and it must be defined as a key

    # Index on AUTO_INCREMENT column; table has no primary key
    # Raises NDB error 4335
    mysql> CREATE TABLE n (
        ->     a INT,
        ->     b INT AUTO_INCREMENT,
        ->     KEY k (b)
        ->     )
        -> ENGINE=NDB;
    ERROR 1296 (HY000): Got error 4335 'Only one autoincrement column allowed per
    table. Having a table without primary key uses an autoincr' from NDBCLUSTER
    ```

    The following statement creates a table with a primary key, an `AUTO_INCREMENT` column, and an index on this column, and succeeds:

    ```sql
    # Index on AUTO_INCREMENT column; table has a primary key
    mysql> CREATE TABLE n (
        ->     a INT PRIMARY KEY,
        ->     b INT AUTO_INCREMENT,
        ->     KEY k (b)
        ->     )
        -> ENGINE=NDB;
    Query OK, 0 rows affected (0.38 sec)
    ```

* **Restrictions on foreign keys.** Support for foreign key constraints in NDB 7.5 is comparable to that provided by [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), subject to the following restrictions:

  + Every column referenced as a foreign key requires an explicit unique key, if it is not the table's primary key.

  + `ON UPDATE CASCADE` is not supported when the reference is to the parent table's primary key.

    This is because an update of a primary key is implemented as a delete of the old row (containing the old primary key) plus an insert of the new row (with a new primary key). This is not visible to the `NDB` kernel, which views these two rows as being the same, and thus has no way of knowing that this update should be cascaded.

  + As of NDB 7.5.14 and NDB 7.6.10: `ON DELETE CASCADE` is not supported where the child table contains one or more columns of any of the [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") or [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") types. (Bug #89511, Bug #27484882)

  + `SET DEFAULT` is not supported. (Also not supported by [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine").)

  + The `NO ACTION` keywords are accepted but treated as `RESTRICT`. (Also the same as with `InnoDB`.)

  + In earlier versions of NDB Cluster, when creating a table with foreign key referencing an index in another table, it sometimes appeared possible to create the foreign key even if the order of the columns in the indexes did not match, due to the fact that an appropriate error was not always returned internally. A partial fix for this issue improved the error used internally to work in most cases; however, it remains possible for this situation to occur in the event that the parent index is a unique index. (Bug #18094360)

  + Prior to NDB 7.5.6, when adding or dropping a foreign key using [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), the parent table's metadata is not updated, which makes it possible subsequently to execute `ALTER TABLE` statements on the parent that should be invalid. To work around this issue, execute [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement") on the parent table immediately after adding or dropping the foreign key; this forces the parent's metadata to be reloaded.

    This issue is fixed in NDB 7.5.6. (Bug #82989, Bug
    #24666177)

  For more information, see [Section 13.1.18.5, “FOREIGN KEY Constraints”](create-table-foreign-keys.html "13.1.18.5 FOREIGN KEY Constraints"), and [Section 1.6.3.2, “FOREIGN KEY Constraints”](constraint-foreign-key.html "1.6.3.2 FOREIGN KEY Constraints").

* **NDB Cluster and geometry data types.** Geometry data types (`WKT` and `WKB`) are supported for [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables. However, spatial indexes are not supported.

* **Character sets and binary log files.** Currently, the `ndb_apply_status` and `ndb_binlog_index` tables are created using the `latin1` (ASCII) character set. Because names of binary logs are recorded in this table, binary log files named using non-Latin characters are not referenced correctly in these tables. This is a known issue, which we are working to fix. (Bug #50226)

  To work around this problem, use only Latin-1 characters when naming binary log files or setting any the [`--basedir`](server-system-variables.html#sysvar_basedir), [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin), or [`--log-bin-index`](replication-options-binary-log.html#option_mysqld_log-bin-index) options.

* **Creating NDB tables with user-defined partitioning.**

  Support for user-defined partitioning in NDB Cluster is restricted to [`LINEAR`] `KEY` partitioning. Using any other partitioning type with `ENGINE=NDB` or `ENGINE=NDBCLUSTER` in a [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement results in an error.

  It is possible to override this restriction, but doing so is not supported for use in production settings. For details, see [User-defined partitioning and the NDB storage engine (NDB Cluster)](partitioning-limitations-storage-engines.html#partitioning-limitations-ndb "User-defined partitioning and the NDB storage engine (NDB Cluster)").

  **Default partitioning scheme.** All NDB Cluster tables are by default partitioned by `KEY` using the table's primary key as the partitioning key. If no primary key is explicitly set for the table, the “hidden” primary key automatically created by the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine is used instead. For additional discussion of these and related issues, see [Section 22.2.5, “KEY Partitioning”](partitioning-key.html "22.2.5 KEY Partitioning").

  [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") and [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statements that would cause a user-partitioned [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table not to meet either or both of the following two requirements are not permitted, and fail with an error:

  1. The table must have an explicit primary key.
  2. All columns listed in the table's partitioning expression must be part of the primary key.

  **Exception.** If a user-partitioned [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table is created using an empty column-list (that is, using `PARTITION BY [LINEAR] KEY()`), then no explicit primary key is required.

  **Maximum number of partitions for NDBCLUSTER tables.** The maximum number of partitions that can defined for a [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table when employing user-defined partitioning is 8 per node group. (See [Section 21.2.2, “NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions”](mysql-cluster-nodes-groups.html "21.2.2 NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions"), for more information about NDB Cluster node groups.

  **DROP PARTITION not supported.** It is not possible to drop partitions from [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables using `ALTER TABLE ... DROP PARTITION`. The other partitioning extensions to [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement")—`ADD PARTITION`, `REORGANIZE PARTITION`, and `COALESCE PARTITION`—are supported for NDB tables, but use copying and so are not optimized. See [Section 22.3.1, “Management of RANGE and LIST Partitions”](partitioning-management-range-list.html "22.3.1 Management of RANGE and LIST Partitions") and [Section 13.1.8, “ALTER TABLE Statement”](alter-table.html "13.1.8 ALTER TABLE Statement").

  **Partition selection.** Partition selection is not supported for `NDB` tables. See [Section 22.5, “Partition Selection”](partitioning-selection.html "22.5 Partition Selection"), for more information.

* **JSON data type.** The MySQL [`JSON`](json.html "11.5 The JSON Data Type") data type is supported for `NDB` tables in the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") supplied with NDB 7.5.2 and later.

  An `NDB` table can have a maximum of 3 `JSON` columns.

  The NDB API has no special provision for working with `JSON` data, which it views simply as `BLOB` data. Handling data as `JSON` must be performed by the application.

* **CPU and thread info ndbinfo tables.** NDB 7.5.2 adds several new tables to the [`ndbinfo`](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database") information database providing information about CPU and thread activity by node, thread ID, and thread type. The tables are listed here:

  + [`cpustat`](mysql-cluster-ndbinfo-cpustat.html "21.6.15.11 The ndbinfo cpustat Table"): Provides per-second, per-thread CPU statistics

  + [`cpustat_50ms`](mysql-cluster-ndbinfo-cpustat-50ms.html "21.6.15.12 The ndbinfo cpustat_50ms Table"): Raw per-thread CPU statistics data, gathered every 50ms

  + [`cpustat_1sec`](mysql-cluster-ndbinfo-cpustat-1sec.html "21.6.15.13 The ndbinfo cpustat_1sec Table"): Raw per-thread CPU statistics data, gathered each second

  + [`cpustat_20sec`](mysql-cluster-ndbinfo-cpustat-20sec.html "21.6.15.14 The ndbinfo cpustat_20sec Table"): Raw per-thread CPU statistics data, gathered every 20 seconds

  + [`threads`](mysql-cluster-ndbinfo-threads.html "21.6.15.42 The ndbinfo threads Table"): Names and descriptions of thread types

  For more information about these tables, see [Section 21.6.15, “ndbinfo: The NDB Cluster Information Database”](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database").

* **Lock info ndbinfo tables.** NDB 7.5.3 adds new tables to the [`ndbinfo`](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database") information database providing information about locks and lock attempts in a running NDB Cluster. These tables are listed here:

  + [`cluster_locks`](mysql-cluster-ndbinfo-cluster-locks.html "21.6.15.4 The ndbinfo cluster_locks Table"): Current lock requests which are waiting for or holding locks; this information can be useful when investigating stalls and deadlocks. Analogous to `cluster_operations`.

  + [`locks_per_fragment`](mysql-cluster-ndbinfo-locks-per-fragment.html "21.6.15.22 The ndbinfo locks_per_fragment Table"): Counts of lock claim requests, and their outcomes per fragment, as well as total time spent waiting for locks successfully and unsuccessfully. Analogous to [`operations_per_fragment`](mysql-cluster-ndbinfo-operations-per-fragment.html "21.6.15.29 The ndbinfo operations_per_fragment Table") and [`memory_per_fragment`](mysql-cluster-ndbinfo-memory-per-fragment.html "21.6.15.27 The ndbinfo memory_per_fragment Table").

  + [`server_locks`](mysql-cluster-ndbinfo-server-locks.html "21.6.15.33 The ndbinfo server_locks Table"): Subset of cluster transactions—those running on the local [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), showing a connection id per transaction. Analogous to [`server_operations`](mysql-cluster-ndbinfo-server-operations.html "21.6.15.34 The ndbinfo server_operations Table").
