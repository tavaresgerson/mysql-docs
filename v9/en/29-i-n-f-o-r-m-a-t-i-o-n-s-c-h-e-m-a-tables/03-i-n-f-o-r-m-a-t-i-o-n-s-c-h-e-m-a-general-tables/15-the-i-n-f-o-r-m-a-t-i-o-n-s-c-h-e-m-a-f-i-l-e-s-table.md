### 28.3.15 The INFORMATION_SCHEMA FILES Table

The `FILES` table provides information about the files in which MySQL tablespace data is stored.

The `FILES` table provides information about `InnoDB` data files. In NDB Cluster, this table also provides information about the files in which NDB Cluster Disk Data tables are stored. For additional information specific to `InnoDB`, see InnoDB Notes, later in this section; for additional information specific to NDB Cluster, see NDB Notes.

The `FILES` table has these columns:

* `FILE_ID`

  For `InnoDB`: The tablespace ID, also referred to as the `space_id` or `fil_space_t::id`.

  For `NDB`: A file identifier. `FILE_ID` column values are auto-generated.

* `FILE_NAME`

  For `InnoDB`: The name of the data file. File-per-table and general tablespaces have an `.ibd` file name extension. Undo tablespaces are prefixed by `undo`. The system tablespace is prefixed by `ibdata`. The global temporary tablespace is prefixed by `ibtmp`. The file name includes the file path, which may be relative to the MySQL data directory (the value of the `datadir` system variable).

  For `NDB`: The name of an undo log file created by `CREATE LOGFILE GROUP` or `ALTER LOGFILE GROUP`, or of a data file created by `CREATE TABLESPACE` or `ALTER TABLESPACE`. In NDB 9.5, the file name is shown with a relative path; for an undo log file, this path is relative to the directory `DataDir/ndb_NodeId_fs/LG`; for a data file, it is relative to the directory `DataDir/ndb_NodeId_fs/TS`. This means, for example, that the name of a data file created with `ALTER TABLESPACE ts ADD DATAFILE 'data_2.dat' INITIAL SIZE 256M` is shown as `./data_2.dat`.

* `FILE_TYPE`

  For `InnoDB`: The tablespace file type. There are three possible file types for `InnoDB` files. `TABLESPACE` is the file type for any system, general, or file-per-table tablespace file that holds tables, indexes, or other forms of user data. `TEMPORARY` is the file type for temporary tablespaces. `UNDO LOG` is the file type for undo tablespaces, which hold undo records.

  For `NDB`: One of the values `UNDO LOG` or `DATAFILE`.

* `TABLESPACE_NAME`

  The name of the tablespace with which the file is associated.

  For `InnoDB`: General tablespace names are as specified when created. File-per-table tablespace names are shown in the following format: `schema_name/table_name`. The `InnoDB` system tablespace name is `innodb_system`. The global temporary tablespace name is `innodb_temporary`. Default undo tablespace names are `innodb_undo_001` and `innodb_undo_002`. User-created undo tablespace names are as specified when created.

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

  For `NDB`: For a Disk Data undo log file, the auto-generated ID number of the log file group to which the log file belongs. This is the same as the value shown for the `id` column in the `ndbinfo.dict_obj_info` table and the `log_id` column in the `ndbinfo.logspaces` and `ndbinfo.logspaces` tables for this undo log file.

* `ENGINE`

  For `InnoDB`: This value is always `InnoDB`.

  For `NDB`: This value is always `ndbcluster`.

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

  For `InnoDB`: Extent size is 1048576 (1MB) for files with a 4KB, 8KB, or 16KB page size. Extent size is 2097152 bytes (2MB) for files with a 32KB page size, and 4194304 (4MB) for files with a 64KB page size. `FILES` does not report `InnoDB` page size. Page size is defined by the `innodb_page_size` system variable. Extent size information can also be retrieved from the `INNODB_TABLESPACES` table where `FILES.FILE_ID = INNODB_TABLESPACES.SPACE`.

  For `NDB`: The size of an extent for the file in bytes.

* `INITIAL_SIZE`

  For `InnoDB`: The initial size of the file in bytes.

  For `NDB`: The size of the file in bytes. This is the same value that was used in the `INITIAL_SIZE` clause of the `CREATE LOGFILE GROUP`, `ALTER LOGFILE GROUP`, `CREATE TABLESPACE`, or `ALTER TABLESPACE` statement used to create the file.

* `MAXIMUM_SIZE`

  For `InnoDB`: The maximum number of bytes permitted in the file. The value is `NULL` for all data files except for predefined system tablespace data files. Maximum system tablespace file size is defined by `innodb_data_file_path`. Maximum global temporary tablespace file size is defined by `innodb_temp_data_file_path`. A `NULL` value for a predefined system tablespace data file indicates that a file size limit was not defined explicitly.

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

  For `NDB`: For NDB Cluster Disk Data files, this value is always `NORMAL`.

* `EXTRA`

  For `InnoDB`: This is always `NULL`.

  For `NDB`: For undo log files, this column shows the undo log buffer size; for data files, it is always *NULL*. A more detailed explanation is provided in the next few paragraphs.

  `NDB` stores a copy of each data file and each undo log file on each data node in the cluster. The `FILES` table contains one row for each such file. Suppose that you run the following two statements on an NDB Cluster with four data nodes:

  ```
  CREATE LOGFILE GROUP mygroup
      ADD UNDOFILE 'new_undo.dat'
      INITIAL_SIZE 2G
      ENGINE NDBCLUSTER;

  CREATE TABLESPACE myts
      ADD DATAFILE 'data_1.dat'
      USE LOGFILE GROUP mygroup
      INITIAL_SIZE 256M
      ENGINE NDBCLUSTER;
  ```

  After running these two statements successfully, you should see a result similar to the one shown here for this query against the `FILES` table:

  ```
  mysql> SELECT LOGFILE_GROUP_NAME, FILE_TYPE, EXTRA
      ->     FROM INFORMATION_SCHEMA.FILES
      ->     WHERE ENGINE = 'ndbcluster';

  +--------------------+-----------+--------------------------+
  | LOGFILE_GROUP_NAME | FILE_TYPE | EXTRA                    |
  +--------------------+-----------+--------------------------+
  | mygroup            | UNDO LOG  | UNDO_BUFFER_SIZE=8388608 |
  | mygroup            | DATAFILE  | NULL                     |
  +--------------------+-----------+--------------------------+
  ```

#### Notes

* `FILES` is a nonstandard `INFORMATION_SCHEMA` table.

* You must have the `PROCESS` privilege to query this table.

#### InnoDB Notes

The following notes apply to `InnoDB` data files.

* Information reported by `FILES` is obtained from the `InnoDB` in-memory cache for open files, whereas `INNODB_DATAFILES` gets its data from the `InnoDB` `SYS_DATAFILES` internal data dictionary table.

* The information provided by `FILES` includes global temporary tablespace information which is not available in the `InnoDB` `SYS_DATAFILES` internal data dictionary table, and is therefore not included in `INNODB_DATAFILES`.

* Undo tablespace information is shown in `FILES` when separate undo tablespaces are present, as they are by default in MySQL 9.5.

* The following query returns all `FILES` table information relating to `InnoDB` tablespaces.

  ```
  SELECT
    FILE_ID, FILE_NAME, FILE_TYPE, TABLESPACE_NAME, FREE_EXTENTS,
    TOTAL_EXTENTS, EXTENT_SIZE, INITIAL_SIZE, MAXIMUM_SIZE,
    AUTOEXTEND_SIZE, DATA_FREE, STATUS
  FROM INFORMATION_SCHEMA.FILES
  WHERE ENGINE='InnoDB'\G
  ```

#### NDB Notes

* The `FILES` table provides information about Disk Data *files* only; you cannot use it for determining disk space allocation or availability for individual `NDB` tables. However, it is possible to see how much space is allocated for each `NDB` table having data stored on disk—as well as how much remains available for storage of data on disk for that table—using **ndb_desc**.

* Much of the information contained in the `FILES` table can also be found in the `ndbinfo` `files` table.

* The `CREATION_TIME`, `LAST_UPDATE_TIME`, and `LAST_ACCESSED` values are as reported by the operating system, and are not supplied by the `NDB` storage engine. Where no value is provided by the operating system, these columns display `NULL`.

* The difference between the `TOTAL EXTENTS` and `FREE_EXTENTS` columns is the number of extents currently in use by the file:

  ```
  SELECT TOTAL_EXTENTS - FREE_EXTENTS AS extents_used
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = './myfile.dat';
  ```

  To approximate the amount of disk space in use by the file, multiply that difference by the value of the `EXTENT_SIZE` column, which gives the size of an extent for the file in bytes:

  ```
  SELECT (TOTAL_EXTENTS - FREE_EXTENTS) * EXTENT_SIZE AS bytes_used
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = './myfile.dat';
  ```

  Similarly, you can estimate the amount of space that remains available in a given file by multiplying `FREE_EXTENTS` by `EXTENT_SIZE`:

  ```
  SELECT FREE_EXTENTS * EXTENT_SIZE AS bytes_free
      FROM INFORMATION_SCHEMA.FILES
      WHERE FILE_NAME = './myfile.dat';
  ```

  Important

  The byte values produced by the preceding queries are approximations only, and their precision is inversely proportional to the value of `EXTENT_SIZE`. That is, the larger `EXTENT_SIZE` becomes, the less accurate the approximations are.

  It is also important to remember that once an extent is used, it cannot be freed again without dropping the data file of which it is a part. This means that deletes from a Disk Data table do *not* release disk space.

  The extent size can be set in a `CREATE TABLESPACE` statement. For more information, see Section 15.1.25, “CREATE TABLESPACE Statement”.

* You can obtain information about Disk Data tablespaces using the **ndb_desc** utility. For more information, see Section 25.6.11.1, “NDB Cluster Disk Data Objects”, as well as the description of **ndb_desc**.

* For additional information, and examples of creating, dropping, and obtaining information about NDB Cluster Disk Data objects, see Section 25.6.11, “NDB Cluster Disk Data Tables”.
