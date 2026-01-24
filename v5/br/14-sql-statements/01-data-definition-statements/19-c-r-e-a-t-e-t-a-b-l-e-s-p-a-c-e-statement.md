### 13.1.19 CREATE TABLESPACE Statement

```sql
CREATE TABLESPACE tablespace_name

  InnoDB and NDB:
    ADD DATAFILE 'file_name'

  InnoDB only:
    [FILE_BLOCK_SIZE = value]

  NDB only:
    USE LOGFILE GROUP logfile_group
    [EXTENT_SIZE [=] extent_size]
    [INITIAL_SIZE [=] initial_size]
    [AUTOEXTEND_SIZE [=] autoextend_size]
    [MAX_SIZE [=] max_size]
    [NODEGROUP [=] nodegroup_id]
    [WAIT]
    [COMMENT [=] 'string']

  InnoDB and NDB:
    [ENGINE [=] engine_name]
```

This statement is used to create a tablespace. The precise syntax and semantics depend on the storage engine used. In standard MySQL 5.7 releases, this is always an [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") tablespace. MySQL NDB Cluster 7.5 also supports tablespaces using the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine in addition to those using `InnoDB`.

* [Considerations for InnoDB](create-tablespace.html#create-tablespace-innodb "Considerations for InnoDB")
* [Considerations for NDB Cluster](create-tablespace.html#create-tablespace-ndb "Considerations for NDB Cluster")
* [Options](create-tablespace.html#create-tablespace-options "Options")
* [Notes](create-tablespace.html#create-tablespace-notes "Notes")
* [InnoDB Examples](create-tablespace.html#create-tablespace-innodb-examples "InnoDB Examples")
* [NDB Example](create-tablespace.html#create-tablespace-ndb-examples "NDB Example")

#### Considerations for InnoDB

[`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement") syntax is used to create general tablespaces. A general tablespace is a shared tablespace. It can hold multiple tables, and supports all table row formats. General tablespaces can be created in a location relative to or independent of the data directory.

After creating an `InnoDB` general tablespace, you can use [`CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name`](create-table.html "13.1.18 CREATE TABLE Statement") or [`ALTER TABLE tbl_name TABLESPACE [=] tablespace_name`](alter-table.html "13.1.8 ALTER TABLE Statement") to add tables to the tablespace. For more information, see [Section 14.6.3.3, “General Tablespaces”](general-tablespaces.html "14.6.3.3 General Tablespaces").

#### Considerations for NDB Cluster

This statement is used to create a tablespace, which can contain one or more data files, providing storage space for NDB Cluster Disk Data tables (see [Section 21.6.11, “NDB Cluster Disk Data Tables”](mysql-cluster-disk-data.html "21.6.11 NDB Cluster Disk Data Tables")). One data file is created and added to the tablespace using this statement. Additional data files may be added to the tablespace by using the [`ALTER TABLESPACE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement") statement (see [Section 13.1.9, “ALTER TABLESPACE Statement”](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement")).

Note

All NDB Cluster Disk Data objects share the same namespace. This means that *each Disk Data object* must be uniquely named (and not merely each Disk Data object of a given type). For example, you cannot have a tablespace and a log file group with the same name, or a tablespace and a data file with the same name.

A log file group of one or more `UNDO` log files must be assigned to the tablespace to be created with the `USE LOGFILE GROUP` clause. *`logfile_group`* must be an existing log file group created with [`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement") (see [Section 13.1.15, “CREATE LOGFILE GROUP Statement”](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement")). Multiple tablespaces may use the same log file group for `UNDO` logging.

When setting `EXTENT_SIZE` or `INITIAL_SIZE`, you may optionally follow the number with a one-letter abbreviation for an order of magnitude, similar to those used in `my.cnf`. Generally, this is one of the letters `M` (for megabytes) or `G` (for gigabytes).

`INITIAL_SIZE` and `EXTENT_SIZE` are subject to rounding as follows:

* `EXTENT_SIZE` is rounded up to the nearest whole multiple of 32K.

* `INITIAL_SIZE` is rounded *down* to the nearest whole multiple of 32K; this result is rounded up to the nearest whole multiple of `EXTENT_SIZE` (after any rounding).

Note

[`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") reserves 4% of a tablespace for data node restart operations. This reserved space cannot be used for data storage. This restriction applies beginning with NDB 7.6.

The rounding just described is done explicitly, and a warning is issued by the MySQL Server when any such rounding is performed. The rounded values are also used by the NDB kernel for calculating Information Schema [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") column values and other purposes. However, to avoid an unexpected result, we suggest that you always use whole multiples of 32K in specifying these options.

When [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement") is used with `ENGINE [=] NDB`, a tablespace and associated data file are created on each Cluster data node. You can verify that the data files were created and obtain information about them by querying the Information Schema [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") table. (See the example later in this section.)

(See [Section 24.3.9, “The INFORMATION_SCHEMA FILES Table”](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table").)

#### Options

* `ADD DATAFILE`: Defines the name of a tablespace data file; this option is always required. The `file_name`, including any specified path, must be quoted with single or double quotation marks. File names (not counting the file extension) and directory names must be at least one byte in length. Zero length file names and directory names are not supported.

  Because there are considerable differences in how `InnoDB` and `NDB` treat data files, the two storage engines are covered separately in the discussion that follows.

  **InnoDB data files.** An `InnoDB` tablespace supports only a single data file, whose name must include a `.ibd` extension.

  For an `InnoDB` tablespace, the data file is created by default in the MySQL data directory ([`datadir`](server-system-variables.html#sysvar_datadir)). To place the data file in a location other than the default, include an absolute directory path or a path relative to the default location.

  When an `InnoDB` tablespace is created outside of the data directory, an [isl](glossary.html#glos_isl_file ".isl file") file is created in the data directory. To avoid conflicts with implicitly created file-per-table tablespaces, creating an `InnoDB` general tablespace in a subdirectory under the data directory is not supported. When creating an `InnoDB` general tablespace outside of the data directory, the directory must exist prior to creating the tablespace.

  Note

  In MySQL 5.7, `ALTER TABLESPACE` is not supported by `InnoDB`.

  **NDB data files.** An `NDB` tablespace supports multiple data files which can have any legal file names; more data files can be added to an NDB Cluster tablespace following its creation by using an [`ALTER TABLESPACE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement") statement.

  An `NDB` tablespace data file is created by default in the data node file system directory—that is, the directory named `ndb_nodeid_fs/TS` under the data node's data directory ([`DataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datadir)), where *`nodeid`* is the data node's [`NodeId`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nodeid). To place the data file in a location other than the default, include an absolute directory path or a path relative to the default location. If the directory specified does not exist, `NDB` attempts to create it; the system user account under which the data node process is running must have the appropriate permissions to do so.

  Note

  When determining the path used for a data file, `NDB` does not expand the `~` (tilde) character.

  When multiple data nodes are run on the same physical host, the following considerations apply:

  + You cannot specify an absolute path when creating a data file.

  + It is not possible to create tablespace data files outside the data node file system directory, unless each data node has a separate data directory.

  + If each data node has its own data directory, data files can be created anywhere within this directory.

  + If each data node has its own data directory, it may also be possible to create a data file outside the node's data directory using a relative path, as long as this path resolves to a unique location on the host file system for each data node running on that host.

* `FILE_BLOCK_SIZE`: This option—which is specific to `InnoDB`, and is ignored by `NDB`—defines the block size for the tablespace data file. Values can be specified in bytes or kilobytes. For example, an 8 kilobyte file block size can be specified as 8192 or 8K. If you do not specify this option, `FILE_BLOCK_SIZE` defaults to the [`innodb_page_size`](innodb-parameters.html#sysvar_innodb_page_size) value. `FILE_BLOCK_SIZE` is required when you intend to use the tablespace for storing compressed `InnoDB` tables (`ROW_FORMAT=COMPRESSED`). In this case, you must define the tablespace `FILE_BLOCK_SIZE` when creating the tablespace.

  If `FILE_BLOCK_SIZE` is equal the [`innodb_page_size`](innodb-parameters.html#sysvar_innodb_page_size) value, the tablespace can contain only tables having an uncompressed row format (`COMPACT`, `REDUNDANT`, and `DYNAMIC`). Tables with a `COMPRESSED` row format have a different physical page size than uncompressed tables. Therefore, compressed tables cannot coexist in the same tablespace as uncompressed tables.

  For a general tablespace to contain compressed tables, `FILE_BLOCK_SIZE` must be specified, and the `FILE_BLOCK_SIZE` value must be a valid compressed page size in relation to the [`innodb_page_size`](innodb-parameters.html#sysvar_innodb_page_size) value. Also, the physical page size of the compressed table (`KEY_BLOCK_SIZE`) must be equal to `FILE_BLOCK_SIZE/1024`. For example, if [`innodb_page_size=16K`](innodb-parameters.html#sysvar_innodb_page_size), and `FILE_BLOCK_SIZE=8K`, the `KEY_BLOCK_SIZE` of the table must be 8. For more information, see [Section 14.6.3.3, “General Tablespaces”](general-tablespaces.html "14.6.3.3 General Tablespaces").

* `USE LOGFILE GROUP`: Required for `NDB`, this is the name of a log file group previously created using [`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement"). Not supported for `InnoDB`, where it fails with an error.

* `EXTENT_SIZE`: This option is specific to NDB, and is not supported by InnoDB, where it fails with an error. `EXTENT_SIZE` sets the size, in bytes, of the extents used by any files belonging to the tablespace. The default value is 1M. The minimum size is 32K, and theoretical maximum is 2G, although the practical maximum size depends on a number of factors. In most cases, changing the extent size does not have any measurable effect on performance, and the default value is recommended for all but the most unusual situations.

  An extent is a unit of disk space allocation. One extent is filled with as much data as that extent can contain before another extent is used. In theory, up to 65,535 (64K) extents may used per data file; however, the recommended maximum is 32,768 (32K). The recommended maximum size for a single data file is 32G—that is, 32K extents × 1 MB per extent. In addition, once an extent is allocated to a given partition, it cannot be used to store data from a different partition; an extent cannot store data from more than one partition. This means, for example that a tablespace having a single datafile whose `INITIAL_SIZE` (described in the following item) is 256 MB and whose `EXTENT_SIZE` is 128M has just two extents, and so can be used to store data from at most two different disk data table partitions.

  You can see how many extents remain free in a given data file by querying the Information Schema [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") table, and so derive an estimate for how much space remains free in the file. For further discussion and examples, see [Section 24.3.9, “The INFORMATION_SCHEMA FILES Table”](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table").

* `INITIAL_SIZE`: This option is specific to `NDB`, and is not supported by `InnoDB`, where it fails with an error.

  The `INITIAL_SIZE` parameter sets the total size in bytes of the data file that was specific using `ADD DATATFILE`. Once this file has been created, its size cannot be changed; however, you can add more data files to the tablespace using [`ALTER TABLESPACE ... ADD DATAFILE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement").

  `INITIAL_SIZE` is optional; its default value is 134217728 (128 MB).

  On 32-bit systems, the maximum supported value for `INITIAL_SIZE` is 4294967296 (4 GB).

* `AUTOEXTEND_SIZE`: Currently ignored by MySQL; reserved for possible future use. Has no effect in any release of MySQL 5.7 or MySQL NDB Cluster 7.5, regardless of the storage engine used.

* `MAX_SIZE`: Currently ignored by MySQL; reserved for possible future use. Has no effect in any release of MySQL 5.7 or MySQL NDB Cluster 7.5, regardless of the storage engine used.

* `NODEGROUP`: Currently ignored by MySQL; reserved for possible future use. Has no effect in any release of MySQL 5.7 or MySQL NDB Cluster 7.5, regardless of the storage engine used.

* `WAIT`: Currently ignored by MySQL; reserved for possible future use. Has no effect in any release of MySQL 5.7 or MySQL NDB Cluster 7.5, regardless of the storage engine used.

* `COMMENT`: Currently ignored by MySQL; reserved for possible future use. Has no effect in any release of MySQL 5.7 or MySQL NDB Cluster 7.5, regardless of the storage engine used.

* `ENGINE`: Defines the storage engine which uses the tablespace, where *`engine_name`* is the name of the storage engine. Currently, only the `InnoDB` storage engine is supported by standard MySQL 5.7 releases. MySQL NDB Cluster 7.5 supports both `NDB` and `InnoDB` tablespaces. The value of the [`default_storage_engine`](server-system-variables.html#sysvar_default_storage_engine) system variable is used for `ENGINE` if the option is not specified.

#### Notes

* For the rules covering the naming of MySQL tablespaces, see [Section 9.2, “Schema Object Names”](identifiers.html "9.2 Schema Object Names"). In addition to these rules, the slash character (“/”) is not permitted, nor can you use names beginning with `innodb_`, as this prefix is reserved for system use.

* Tablespaces do not support temporary tables.
* [`innodb_file_per_table`](innodb-parameters.html#sysvar_innodb_file_per_table), [`innodb_file_format`](innodb-parameters.html#sysvar_innodb_file_format), and [`innodb_file_format_max`](innodb-parameters.html#sysvar_innodb_file_format_max) settings have no influence on `CREATE TABLESPACE` operations. [`innodb_file_per_table`](innodb-parameters.html#sysvar_innodb_file_per_table) does not need to be enabled. General tablespaces support all table row formats regardless of file format settings. Likewise, general tablespaces support the addition of tables of any row format using [`CREATE TABLE ... TABLESPACE`](create-table.html "13.1.18 CREATE TABLE Statement"), regardless of file format settings.

* [`innodb_strict_mode`](innodb-parameters.html#sysvar_innodb_strict_mode) is not applicable to general tablespaces. Tablespace management rules are strictly enforced independently of [`innodb_strict_mode`](innodb-parameters.html#sysvar_innodb_strict_mode). If `CREATE TABLESPACE` parameters are incorrect or incompatible, the operation fails regardless of the [`innodb_strict_mode`](innodb-parameters.html#sysvar_innodb_strict_mode) setting. When a table is added to a general tablespace using [`CREATE TABLE ... TABLESPACE`](create-table.html "13.1.18 CREATE TABLE Statement") or [`ALTER TABLE ... TABLESPACE`](alter-table.html "13.1.8 ALTER TABLE Statement"), [`innodb_strict_mode`](innodb-parameters.html#sysvar_innodb_strict_mode) is ignored but the statement is evaluated as if [`innodb_strict_mode`](innodb-parameters.html#sysvar_innodb_strict_mode) is enabled.

* Use `DROP TABLESPACE` to remove a tablespace. All tables must be dropped from a tablespace using [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") prior to dropping the tablespace. Before dropping an NDB Cluster tablespace you must also remove all its data files using one or more [`ALTER TABLESPACE ... DROP DATATFILE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement") statements. See [Section 21.6.11.1, “NDB Cluster Disk Data Objects”](mysql-cluster-disk-data-objects.html "21.6.11.1 NDB Cluster Disk Data Objects").

* All parts of an `InnoDB` table added to an `InnoDB` general tablespace reside in the general tablespace, including indexes and [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") pages.

  For an `NDB` table assigned to a tablespace, only those columns which are not indexed are stored on disk, and actually use the tablespace data files. Indexes and indexed columns for all `NDB` tables are always kept in memory.

* Similar to the system tablespace, truncating or dropping tables stored in a general tablespace creates free space internally in the general tablespace [.ibd data file](glossary.html#glos_ibd_file ".ibd file") which can only be used for new `InnoDB` data. Space is not released back to the operating system as it is for file-per-table tablespaces.

* A general tablespace is not associated with any database or schema.

* [`ALTER TABLE ... DISCARD TABLESPACE`](alter-table.html "13.1.8 ALTER TABLE Statement") and [`ALTER TABLE ...IMPORT TABLESPACE`](alter-table.html "13.1.8 ALTER TABLE Statement") are not supported for tables that belong to a general tablespace.

* The server uses tablespace-level metadata locking for DDL that references general tablespaces. By comparison, the server uses table-level metadata locking for DDL that references file-per-table tablespaces.

* A generated or existing tablespace cannot be changed to a general tablespace.

* Tables stored in a general tablespace can only be opened in MySQL 5.7.6 or later due to the addition of new table flags.

* There is no conflict between general tablespace names and file-per-table tablespace names. The “/” character, which is present in file-per-table tablespace names, is not permitted in general tablespace names.

* [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") and [**mysqlpump**](mysqlpump.html "4.5.6 mysqlpump — A Database Backup Program") do not dump `InnoDB` [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement") statements.

#### InnoDB Examples

This example demonstrates creating a general tablespace and adding three uncompressed tables of different row formats.

```sql
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' ENGINE=INNODB;

mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=REDUNDANT;

mysql> CREATE TABLE t2 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=COMPACT;

mysql> CREATE TABLE t3 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=DYNAMIC;
```

This example demonstrates creating a general tablespace and adding a compressed table. The example assumes a default [`innodb_page_size`](innodb-parameters.html#sysvar_innodb_page_size) value of 16K. The `FILE_BLOCK_SIZE` of 8192 requires that the compressed table have a `KEY_BLOCK_SIZE` of 8.

```sql
mysql> CREATE TABLESPACE `ts2` ADD DATAFILE 'ts2.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

mysql> CREATE TABLE t4 (c1 INT PRIMARY KEY) TABLESPACE ts2 ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;
```

#### NDB Example

Suppose that you wish to create an NDB Cluster Disk Data tablespace named `myts` using a datafile named `mydata-1.dat`. An `NDB` tablespace always requires the use of a log file group consisting of one or more undo log files. For this example, we first create a log file group named `mylg` that contains one undo long file named `myundo-1.dat`, using the [`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement") statement shown here:

```sql
mysql> CREATE LOGFILE GROUP myg1
    ->     ADD UNDOFILE 'myundo-1.dat'
    ->     ENGINE=NDB;
Query OK, 0 rows affected (3.29 sec)
```

Now you can create the tablespace previously described using the following statement:

```sql
mysql> CREATE TABLESPACE myts
    ->     ADD DATAFILE 'mydata-1.dat'
    ->     USE LOGFILE GROUP mylg
    ->     ENGINE=NDB;
Query OK, 0 rows affected (2.98 sec)
```

You can now create a Disk Data table using a [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement with the `TABLESPACE` and `STORAGE DISK` options, similar to what is shown here:

```sql
mysql> CREATE TABLE mytable (
    ->     id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ->     lname VARCHAR(50) NOT NULL,
    ->     fname VARCHAR(50) NOT NULL,
    ->     dob DATE NOT NULL,
    ->     joined DATE NOT NULL,
    ->     INDEX(last_name, first_name)
    -> )
    ->     TABLESPACE myts STORAGE DISK
    ->     ENGINE=NDB;
Query OK, 0 rows affected (1.41 sec)
```

It is important to note that only the `dob` and `joined` columns from `mytable` are actually stored on disk, due to the fact that the `id`, `lname`, and `fname` columns are all indexed.

As mentioned previously, when `CREATE TABLESPACE` is used with `ENGINE [=] NDB`, a tablespace and associated data file are created on each NDB Cluster data node. You can verify that the data files were created and obtain information about them by querying the Information Schema [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") table, as shown here:

```sql
mysql> SELECT FILE_NAME, FILE_TYPE, LOGFILE_GROUP_NAME, STATUS, EXTRA
    ->     FROM INFORMATION_SCHEMA.FILES
    ->     WHERE TABLESPACE_NAME = 'myts';

+--------------+------------+--------------------+--------+----------------+
| file_name    | file_type  | logfile_group_name | status | extra          |
+--------------+------------+--------------------+--------+----------------+
| mydata-1.dat | DATAFILE   | mylg               | NORMAL | CLUSTER_NODE=5 |
| mydata-1.dat | DATAFILE   | mylg               | NORMAL | CLUSTER_NODE=6 |
| NULL         | TABLESPACE | mylg               | NORMAL | NULL           |
+--------------+------------+--------------------+--------+----------------+
3 rows in set (0.01 sec)
```

For additional information and examples, see [Section 21.6.11.1, “NDB Cluster Disk Data Objects”](mysql-cluster-disk-data-objects.html "21.6.11.1 NDB Cluster Disk Data Objects").
