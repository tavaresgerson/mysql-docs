### 24.3.9 The INFORMATION\_SCHEMA FILES Table

The [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") table provides information about the files in which MySQL tablespace data is stored.

The [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") table provides information about `InnoDB` data files. In NDB Cluster, this table also provides information about the files in which NDB Cluster Disk Data tables are stored. For additional information specific to `InnoDB`, see [InnoDB Notes](information-schema-files-table.html#files-table-innodb-notes "InnoDB Notes"), later in this section; for additional information specific to NDB Cluster, see [NDB Notes](information-schema-files-table.html#files-table-ndb-notes "NDB Notes").

The [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") table has these columns:

* `FILE_ID`

  For `InnoDB`: The tablespace ID, also referred to as the `space_id` or `fil_space_t::id`.

  For `NDB`: A file identifier. `FILE_ID` column values are auto-generated.

* `FILE_NAME`

  For `InnoDB`: The name of the data file. File-per-table and general tablespaces have an `.ibd` file name extension. Undo tablespaces are prefixed by `undo`. The system tablespace is prefixed by `ibdata`. Temporary tablespaces are prefixed by `ibtmp`. The file name includes the file path, which may be relative to the MySQL data directory (the value of the [`datadir`](server-system-variables.html#sysvar_datadir) system variable).

  For `NDB`: The name of an `UNDO` log file created by [`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement") or [`ALTER LOGFILE GROUP`](alter-logfile-group.html "13.1.5 ALTER LOGFILE GROUP Statement"), or of a data file created by [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement") or [`ALTER TABLESPACE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement").

* `FILE_TYPE`

  For `InnoDB`: The tablespace file type. There are three possible file types for `InnoDB` files. `TABLESPACE` is the file type for any system, general, or file-per-table tablespace file that holds tables, indexes, or other forms of user data. `TEMPORARY` is the file type for temporary tablespaces. `UNDO LOG` is the file type for undo tablespaces, which hold undo records.

  For `NDB`: One of the values `UNDO LOG`, `DATAFILE`, or `TABLESPACE`.

* `TABLESPACE_NAME`

  The name of the tablespace with which the file is associated.

* `TABLE_CATALOG`

  This value is always empty.

* `TABLE_SCHEMA`

  This is always `NULL`.

* `TABLE_NAME`

  This is always `NULL`.

* `LOGFILE_GROUP_NAME`

  For `InnoDB`: This is always `NULL`.

  For `NDB`: The name of the log file group to which the log file or data file belongs.

* `LOGFILE_GROUP_NUMBER`

  For `InnoDB`: This is always `NULL`.

  For `NDB`: For a Disk Data undo log file, the auto-generated ID number of the log file group to which the log file belongs. This is the same as the value shown for the `id` column in the [`ndbinfo.dict_obj_info`](mysql-cluster-ndbinfo-dict-obj-info.html "21.6.15.15 The ndbinfo dict_obj_info Table") table and the `log_id` column in the [`ndbinfo.logspaces`](mysql-cluster-ndbinfo-logspaces.html "21.6.15.24 The ndbinfo logspaces Table") and [`ndbinfo.logspaces`](mysql-cluster-ndbinfo-logspaces.html "21.6.15.24 The ndbinfo logspaces Table") tables for this undo log file.

* `ENGINE`

  For `InnoDB`: This is always `InnoDB`.

  For `NDB`: This is always `ndbcluster`.

* `FULLTEXT_KEYS`

  This is always `NULL`.

* `DELETED_ROWS`

  This is always `NULL`.

* `UPDATE_COUNT`

  This is always `NULL`.

* `FREE_EXTENTS`

  For `InnoDB`: The number of fully free extents in the current data file.

  For `NDB`: The number of extents which have not yet been used by the file.

* `TOTAL_EXTENTS`

  For `InnoDB`: The number of full extents used in the current data file. Any partial extent at the end of the file is not counted.

  For `NDB`: The total number of extents allocated to the file.

* `EXTENT_SIZE`

  For `InnoDB`: Extent size is 1048576 (1MB) for files with a 4KB, 8KB, or 16KB page size. Extent size is 2097152 bytes (2MB) for files with a 32KB page size, and 4194304 (4MB) for files with a 64KB page size. [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") does not report `InnoDB` page size. Page size is defined by the [`innodb_page_size`](innodb-parameters.html#sysvar_innodb_page_size) system variable. Extent size information can also be retrieved from the [`INNODB_SYS_TABLESPACES`](information-schema-innodb-sys-tablespaces-table.html "24.4.24 The INFORMATION_SCHEMA INNODB_SYS_TABLESPACES Table") table where `FILES.FILE_ID = INNODB_SYS_TABLESPACES.SPACE`.

  For `NDB`: The size of an extent for the file in bytes.

* `INITIAL_SIZE`

  For `InnoDB`: The initial size of the file in bytes.

  For `NDB`: The size of the file in bytes. This is the same value that was used in the `INITIAL_SIZE` clause of the [`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement"), [`ALTER LOGFILE GROUP`](alter-logfile-group.html "13.1.5 ALTER LOGFILE GROUP Statement"), [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement"), or [`ALTER TABLESPACE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement") statement used to create the file.

* `MAXIMUM_SIZE`

  For `InnoDB`: The maximum number of bytes permitted in the file. The value is `NULL` for all data files except for predefined system tablespace data files. Maximum system tablespace file size is defined by [`innodb_data_file_path`](innodb-parameters.html#sysvar_innodb_data_file_path). Maximum temporary tablespace file size is defined by [`innodb_temp_data_file_path`](innodb-parameters.html#sysvar_innodb_temp_data_file_path). A `NULL` value for a predefined system tablespace data file indicates that a file size limit was not defined explicitly.

  For `NDB`: This value is always the same as the `INITIAL_SIZE` value.

* `AUTOEXTEND_SIZE`

  The auto-extend size of the tablespace. For `NDB`, `AUTOEXTEND_SIZE` is always `NULL`.

* `CREATION_TIME`

  This is always `NULL`.

* `LAST_UPDATE_TIME`

  This is always `NULL`.

* `LAST_ACCESS_TIME`

  This is always `NULL`.

* `RECOVER_TIME`

  This is always `NULL`.

* `TRANSACTION_COUNTER`

  This is always `NULL`.

* `VERSION`

  For `InnoDB`: This is always `NULL`.

  For `NDB`: The version number of the file.

* `ROW_FORMAT`

  For `InnoDB`: This is always `NULL`.

  For `NDB`: One of `FIXED` or `DYNAMIC`.

* `TABLE_ROWS`

  This is always `NULL`.

* `AVG_ROW_LENGTH`

  This is always `NULL`.

* `DATA_LENGTH`

  This is always `NULL`.

* `MAX_DATA_LENGTH`

  This is always `NULL`.

* `INDEX_LENGTH`

  This is always `NULL`.

* `DATA_FREE`

  For `InnoDB`: The total amount of free space (in bytes) for the entire tablespace. Predefined system tablespaces, which include the system tablespace and temporary table tablespaces, may have one or more data files.

  For `NDB`: This is always `NULL`.

* `CREATE_TIME`

  This is always `NULL`.

* `UPDATE_TIME`

  This is always `NULL`.

* `CHECK_TIME`

  This is always `NULL`.

* `CHECKSUM`

  This is always `NULL`.

* `STATUS`

  For `InnoDB`: This value is `NORMAL` by default. `InnoDB` file-per-table tablespaces may report `IMPORTING`, which indicates that the tablespace is not yet available.

  For `NDB`: This is always `NORMAL`.

* `EXTRA`

  For `InnoDB`: This is always `NULL`.

  For `NDB`: This column shows which data node the data file or undo log file belongs to (each data node having its own copy of each file); for an undo log files, it also shows the size of the undo log buffer. Suppose that you use this statement on an NDB Cluster with four data nodes:

  ```sql
  CREATE LOGFILE GROUP mygroup
      ADD UNDOFILE 'new_undo.dat'
      INITIAL_SIZE 2G
      ENGINE NDB;
  ```

  After running the [`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement") statement successfully, you should see a result similar to the one shown here for this query against the [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") table:

  ```sql
  mysql> SELECT LOGFILE_GROUP_NAME, FILE_TYPE, EXTRA
           FROM INFORMATION_SCHEMA.FILES
           WHERE FILE_NAME = 'new_undo.dat';

  +--------------------+-----------+-----------------------------------------+
  | LOGFILE_GROUP_NAME | FILE_TYPE | EXTRA                                   |
  +--------------------+-----------+-----------------------------------------+
  | mygroup            | UNDO LOG  | CLUSTER_NODE=5;UNDO_BUFFER_SIZE=8388608 |
  | mygroup            | UNDO LOG  | CLUSTER_NODE=6;UNDO_BUFFER_SIZE=8388608 |
  | mygroup            | UNDO LOG  | CLUSTER_NODE=7;UNDO_BUFFER_SIZE=8388608 |
  | mygroup            | UNDO LOG  | CLUSTER_NODE=8;UNDO_BUFFER_SIZE=8388608 |
  +--------------------+-----------+-----------------------------------------+
  ```

#### Notes

* [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") is a nonstandard `INFORMATION_SCHEMA` table.

#### InnoDB Notes

The following notes apply to `InnoDB` data files.

* Data reported by [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") is reported from the `InnoDB` in-memory cache for open files. By comparison, [`INNODB_SYS_DATAFILES`](information-schema-innodb-sys-datafiles-table.html "24.4.18 The INFORMATION_SCHEMA INNODB_SYS_DATAFILES Table") reports data from the `InnoDB` `SYS_DATAFILES` internal data dictionary table.

* The data reported by [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") includes temporary tablespace data. This data is not available in the `InnoDB` `SYS_DATAFILES` internal data dictionary table, and is therefore not reported by [`INNODB_SYS_DATAFILES`](information-schema-innodb-sys-datafiles-table.html "24.4.18 The INFORMATION_SCHEMA INNODB_SYS_DATAFILES Table").

* Undo tablespace data is reported by [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table").

* The following query returns all data pertinent to `InnoDB` tablespaces.

  ```sql
  SELECT
    FILE_ID, FILE_NAME, FILE_TYPE, TABLESPACE_NAME, FREE_EXTENTS,
    TOTAL_EXTENTS, EXTENT_SIZE, INITIAL_SIZE, MAXIMUM_SIZE,
    AUTOEXTEND_SIZE, DATA_FREE, STATUS
  FROM INFORMATION_SCHEMA.FILES WHERE ENGINE='InnoDB'\G
  ```

#### NDB Notes

* The `FILES` table provides information about Disk Data *files* only; you cannot use it for determining disk space allocation or availability for individual `NDB` tables. However, it is possible to see how much space is allocated for each [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table having data stored on disk—as well as how much remains available for storage of data on disk for that table—using [**ndb\_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables").

* The `CREATION_TIME`, `LAST_UPDATE_TIME`, and `LAST_ACCESSED` values are as reported by the operating system, and are not supplied by the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine. Where no value is provided by the operating system, these columns display `NULL`.

* The difference between the `TOTAL EXTENTS` and `FREE_EXTENTS` columns is the number of extents currently in use by the file:

  ```sql
  SELECT TOTAL_EXTENTS - FREE_EXTENTS AS extents_used
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = 'myfile.dat';
  ```

  To approximate the amount of disk space in use by the file, multiply that difference by the value of the `EXTENT_SIZE` column, which gives the size of an extent for the file in bytes:

  ```sql
  SELECT (TOTAL_EXTENTS - FREE_EXTENTS) * EXTENT_SIZE AS bytes_used
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = 'myfile.dat';
  ```

  Similarly, you can estimate the amount of space that remains available in a given file by multiplying `FREE_EXTENTS` by `EXTENT_SIZE`:

  ```sql
  SELECT FREE_EXTENTS * EXTENT_SIZE AS bytes_free
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = 'myfile.dat';
  ```

  Important

  The byte values produced by the preceding queries are approximations only, and their precision is inversely proportional to the value of `EXTENT_SIZE`. That is, the larger `EXTENT_SIZE` becomes, the less accurate the approximations are.

  It is also important to remember that once an extent is used, it cannot be freed again without dropping the data file of which it is a part. This means that deletes from a Disk Data table do *not* release disk space.

  The extent size can be set in a [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement") statement. For more information, see [Section 13.1.19, “CREATE TABLESPACE Statement”](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement").

* An additional row is present in the [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") table following the creation of a logfile group. This row has `NULL` for the value of the `FILE_NAME` column and `0` for the value of the `FILE_ID` column; the value of the `FILE_TYPE` column is always `UNDO LOG`, and that of the `STATUS` column is always `NORMAL`. The value of the `ENGINE` column for this row is always `ndbcluster`.

  The `FREE_EXTENTS` column in this row shows the total number of free extents available to all undo files belonging to a given log file group whose name and number are shown in the `LOGFILE_GROUP_NAME` and `LOGFILE_GROUP_NUMBER` columns, respectively.

  Suppose there are no existing log file groups on your NDB Cluster, and you create one using the following statement:

  ```sql
  mysql> CREATE LOGFILE GROUP lg1
           ADD UNDOFILE 'undofile.dat'
           INITIAL_SIZE = 16M
           UNDO_BUFFER_SIZE = 1M
           ENGINE = NDB;
  ```

  You can now see this `NULL` row when you query the [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") table:

  ```sql
  mysql> SELECT DISTINCT
           FILE_NAME AS File,
           FREE_EXTENTS AS Free,
           TOTAL_EXTENTS AS Total,
           EXTENT_SIZE AS Size,
           INITIAL_SIZE AS Initial
           FROM INFORMATION_SCHEMA.FILES;
  +--------------+---------+---------+------+----------+
  | File         | Free    | Total   | Size | Initial  |
  +--------------+---------+---------+------+----------+
  | undofile.dat |    NULL | 4194304 |    4 | 16777216 |
  | NULL         | 4184068 |    NULL |    4 |     NULL |
  +--------------+---------+---------+------+----------+
  ```

  The total number of free extents available for undo logging is always somewhat less than the sum of the `TOTAL_EXTENTS` column values for all undo files in the log file group due to overhead required for maintaining the undo files. This can be seen by adding a second undo file to the log file group, then repeating the previous query against the [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") table:

  ```sql
  mysql> ALTER LOGFILE GROUP lg1
           ADD UNDOFILE 'undofile02.dat'
           INITIAL_SIZE = 4M
           ENGINE = NDB;

  mysql> SELECT DISTINCT
           FILE_NAME AS File,
           FREE_EXTENTS AS Free,
           TOTAL_EXTENTS AS Total,
           EXTENT_SIZE AS Size,
           INITIAL_SIZE AS Initial
           FROM INFORMATION_SCHEMA.FILES;
  +----------------+---------+---------+------+----------+
  | File           | Free    | Total   | Size | Initial  |
  +----------------+---------+---------+------+----------+
  | undofile.dat   |    NULL | 4194304 |    4 | 16777216 |
  | undofile02.dat |    NULL | 1048576 |    4 |  4194304 |
  | NULL           | 5223944 |    NULL |    4 |     NULL |
  +----------------+---------+---------+------+----------+
  ```

  The amount of free space in bytes which is available for undo logging by Disk Data tables using this log file group can be approximated by multiplying the number of free extents by the initial size:

  ```sql
  mysql> SELECT
           FREE_EXTENTS AS 'Free Extents',
           FREE_EXTENTS * EXTENT_SIZE AS 'Free Bytes'
           FROM INFORMATION_SCHEMA.FILES
           WHERE LOGFILE_GROUP_NAME = 'lg1'
           AND FILE_NAME IS NULL;
  +--------------+------------+
  | Free Extents | Free Bytes |
  +--------------+------------+
  |      5223944 |   20895776 |
  +--------------+------------+
  ```

  If you create an NDB Cluster Disk Data table and then insert some rows into it, you can see approximately how much space remains for undo logging afterward, for example:

  ```sql
  mysql> CREATE TABLESPACE ts1
           ADD DATAFILE 'data1.dat'
           USE LOGFILE GROUP lg1
           INITIAL_SIZE 512M
           ENGINE = NDB;

  mysql> CREATE TABLE dd (
           c1 INT NOT NULL PRIMARY KEY,
           c2 INT,
           c3 DATE
           )
           TABLESPACE ts1 STORAGE DISK
           ENGINE = NDB;

  mysql> INSERT INTO dd VALUES
           (NULL, 1234567890, '2007-02-02'),
           (NULL, 1126789005, '2007-02-03'),
           (NULL, 1357924680, '2007-02-04'),
           (NULL, 1642097531, '2007-02-05');

  mysql> SELECT
           FREE_EXTENTS AS 'Free Extents',
           FREE_EXTENTS * EXTENT_SIZE AS 'Free Bytes'
           FROM INFORMATION_SCHEMA.FILES
           WHERE LOGFILE_GROUP_NAME = 'lg1'
           AND FILE_NAME IS NULL;
  +--------------+------------+
  | Free Extents | Free Bytes |
  +--------------+------------+
  |      5207565 |   20830260 |
  +--------------+------------+
  ```

* An additional row is present in the [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") table for any NDB Cluster tablespace, whether or not any data files are associated with the tablespace. This row has `NULL` for the value of the `FILE_NAME` column, and the value of the `FILE_ID` column is always `0`. The value shown in the `FILE_TYPE` column is always `TABLESPACE`, and that of the `STATUS` column is always `NORMAL`. The value of the `ENGINE` column for this row is always `ndbcluster`.

* For additional information, and examples of creating and dropping NDB Cluster Disk Data objects, see [Section 21.6.11, “NDB Cluster Disk Data Tables”](mysql-cluster-disk-data.html "21.6.11 NDB Cluster Disk Data Tables").

* As of MySQL 5.7.31, you must have the [`PROCESS`](privileges-provided.html#priv_process) privilege to query this table.
