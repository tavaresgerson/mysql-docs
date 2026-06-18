### 28.4.24 The INFORMATION\_SCHEMA INNODB\_TABLESPACES Table

The [`INNODB_TABLESPACES`](information-schema-innodb-tablespaces-table.html "28.4.24 The INFORMATION_SCHEMA INNODB_TABLESPACES Table") table provides
metadata about `InnoDB` file-per-table, general,
and undo tablespaces.

For related usage information and examples, see
[Section 17.15.3, “InnoDB INFORMATION\_SCHEMA Schema Object Tables”](innodb-information-schema-system-tables.html "17.15.3 InnoDB INFORMATION_SCHEMA Schema Object Tables").

Note

The `INFORMATION_SCHEMA`
[`FILES`](information-schema-files-table.html "28.3.15 The INFORMATION_SCHEMA FILES Table") table reports metadata for
`InnoDB` tablespace types including
file-per-table tablespaces, general tablespaces, the system
tablespace, the global temporary tablespace, and undo
tablespaces.

The [`INNODB_TABLESPACES`](information-schema-innodb-tablespaces-table.html "28.4.24 The INFORMATION_SCHEMA INNODB_TABLESPACES Table") table has
these columns:

* `SPACE`

  The tablespace ID.

* `NAME`

  The schema (database) and table name.

* `FLAG`

  A numeric value that represents bit-level information about
  tablespace format and storage characteristics.

* `ROW_FORMAT`

  The tablespace row format (`Compact or
  Redundant`, `Dynamic` or
  `Compressed`, or `Undo`).
  The data in this column is interpreted from the tablespace
  flag information that resides in the data file.

  There is no way to determine from this flag information if the
  tablespace row format is `Redundant` or
  `Compact`, which is why one of the possible
  `ROW_FORMAT` values is `Compact or
  Redundant`.

* `PAGE_SIZE`

  The tablespace page size. The data in this column is
  interpreted from the tablespace flags information that resides
  in the [`.ibd`
  file](glossary.html#glos_ibd_file ".ibd file").

* `ZIP_PAGE_SIZE`

  The tablespace zip page size. The data in this column is
  interpreted from the tablespace flags information that resides
  in the [`.ibd`
  file](glossary.html#glos_ibd_file ".ibd file").

* `SPACE_TYPE`

  The type of tablespace. Possible values include
  `General` for general tablespaces,
  `Single` for file-per-table tablespaces,
  `System` for the system tablespace, and
  `Undo` for undo tablespaces.

* `FS_BLOCK_SIZE`

  The file system block size, which is the unit size used for
  hole punching. This column pertains to the
  `InnoDB`
  [transparent page
  compression](innodb-page-compression.html "17.9.2 InnoDB Page Compression") feature.

* `FILE_SIZE`

  The apparent size of the file, which represents the maximum
  size of the file, uncompressed. This column pertains to the
  `InnoDB`
  [transparent page
  compression](innodb-page-compression.html "17.9.2 InnoDB Page Compression") feature.

* `ALLOCATED_SIZE`

  The actual size of the file, which is the amount of space
  allocated on disk. This column pertains to the
  `InnoDB`
  [transparent page
  compression](innodb-page-compression.html "17.9.2 InnoDB Page Compression") feature.

* `AUTOEXTEND_SIZE`

  The auto-extend size of the tablespace. This column was added
  in MySQL 8.0.23.

* `SERVER_VERSION`

  The MySQL version that created the tablespace, or the MySQL
  version into which the tablespace was imported, or the version
  of the last major MySQL version upgrade. The value is
  unchanged by a release series upgrade, such as an upgrade from
  MySQL 8.0.*`x`* to
  8.0.*`y`*. The value can be considered
  a “creation” marker or “certified”
  marker for the tablespace.

* `SPACE_VERSION`

  The tablespace version, used to track changes to the
  tablespace format.

* `ENCRYPTION`

  Whether the tablespace is encrypted. This column was added in
  MySQL 8.0.13.

* `STATE`

  The tablespace state. This column was added in MySQL 8.0.14.

  For file-per-table and general tablespaces, states include:

  + `normal`: The tablespace is normal and
    active.

  + `discarded`: The tablespace was discarded
    by an [`ALTER
    TABLE ... DISCARD TABLESPACE`](alter-table.html "15.1.9 ALTER TABLE Statement") statement.

  + `corrupted`: The tablespace is identified
    by `InnoDB` as corrupted.

  For undo tablespaces, states include:

  + `active`: Rollback segments in the undo
    tablespace can be allocated to new transactions.

  + `inactive`: Rollback segments in the undo
    tablespace are no longer used by new transactions. The
    truncate process is in progress. The undo tablespace was
    either selected by the purge thread implicitly or was made
    inactive by an
    [`ALTER
    UNDO TABLESPACE ... SET INACTIVE`](alter-tablespace.html "15.1.10 ALTER TABLESPACE Statement") statement.

  + `empty`: The undo tablespace was
    truncated and is no longer active. It is ready to be
    dropped or made active again by an
    [`ALTER
    UNDO TABLESPACE ... SET INACTIVE`](alter-tablespace.html "15.1.10 ALTER TABLESPACE Statement") statement.

#### Example

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TABLESPACES WHERE SPACE = 26\G
*************************** 1. row ***************************
         SPACE: 26
          NAME: test/t1
          FLAG: 0
    ROW_FORMAT: Compact or Redundant
     PAGE_SIZE: 16384
 ZIP_PAGE_SIZE: 0
    SPACE_TYPE: Single
 FS_BLOCK_SIZE: 4096
     FILE_SIZE: 98304
ALLOCATED_SIZE: 65536
AUTOEXTEND_SIZE: 0
SERVER_VERSION: 8.0.23
 SPACE_VERSION: 1
    ENCRYPTION: N
         STATE: normal
```

#### Notes

* You must have the [`PROCESS`](privileges-provided.html#priv_process)
  privilege to query this table.

* Use the `INFORMATION_SCHEMA`
  [`COLUMNS`](information-schema-columns-table.html "28.3.8 The INFORMATION_SCHEMA COLUMNS Table") table or the
  [`SHOW COLUMNS`](show-columns.html "15.7.7.5 SHOW COLUMNS Statement") statement to view
  additional information about the columns of this table,
  including data types and default values.