#### 17.9.1.2 Creating Compressed Tables

Compressed tables can be created in
[file-per-table](glossary.html#glos_file_per_table "file-per-table")
tablespaces or in
[general
tablespaces](glossary.html#glos_general_tablespace "general tablespace"). Table compression is not available for the
InnoDB [system
tablespace](glossary.html#glos_system_tablespace "system tablespace"). The system tablespace (space 0, the
[.ibdata files](glossary.html#glos_ibd_file ".ibd file")) can contain
user-created tables, but it also contains internal system data,
which is never compressed. Thus, compression applies only to
tables (and indexes) stored in file-per-table or general
tablespaces.

##### Creating a Compressed Table in File-Per-Table Tablespace

To create a compressed table in a file-per-table tablespace,
[`innodb_file_per_table`](innodb-parameters.html#sysvar_innodb_file_per_table) must be
enabled (the default). You can set this parameter in the MySQL
configuration file (`my.cnf` or
`my.ini`) or dynamically, using a
[`SET`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment")
statement.

After the [`innodb_file_per_table`](innodb-parameters.html#sysvar_innodb_file_per_table)
option is configured, specify the
`ROW_FORMAT=COMPRESSED` clause or
`KEY_BLOCK_SIZE` clause, or both, in a
[`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") or
[`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement") statement to create a
compressed table in a file-per-table tablespace.

For example, you might use the following statements:

```
SET GLOBAL innodb_file_per_table=1;
CREATE TABLE t1
 (c1 INT PRIMARY KEY)
 ROW_FORMAT=COMPRESSED
 KEY_BLOCK_SIZE=8;
```

##### Creating a Compressed Table in a General Tablespace

To create a compressed table in a general tablespace,
`FILE_BLOCK_SIZE` must be defined for the
general tablespace, which is specified when the tablespace is
created. The `FILE_BLOCK_SIZE` value must be a
valid compressed page size in relation to the
[`innodb_page_size`](innodb-parameters.html#sysvar_innodb_page_size) value, and the
page size of the compressed table, defined by the
[`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") or
[`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement")
`KEY_BLOCK_SIZE` clause, must be equal to
`FILE_BLOCK_SIZE/1024`. For example, if
[`innodb_page_size=16384`](innodb-parameters.html#sysvar_innodb_page_size) and
`FILE_BLOCK_SIZE=8192`, the
`KEY_BLOCK_SIZE` of the table must be 8. For
more information, see [Section 17.6.3.3, “General Tablespaces”](general-tablespaces.html "17.6.3.3 General Tablespaces").

The following example demonstrates creating a general tablespace
and adding a compressed table. The example assumes a default
[`innodb_page_size`](innodb-parameters.html#sysvar_innodb_page_size) of 16K. The
`FILE_BLOCK_SIZE` of 8192 requires that the
compressed table have a `KEY_BLOCK_SIZE` of 8.

```
mysql> CREATE TABLESPACE `ts2` ADD DATAFILE 'ts2.ibd' FILE_BLOCK_SIZE = 8192 Engine=InnoDB;

mysql> CREATE TABLE t4 (c1 INT PRIMARY KEY) TABLESPACE ts2 ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;
```

##### Notes

* As of MySQL 8.0, the tablespace file for a
  compressed table is created using the physical page size
  instead of the `InnoDB` page size, which
  makes the initial size of a tablespace file for an empty
  compressed table smaller than in previous MySQL releases.

* If you specify `ROW_FORMAT=COMPRESSED`, you
  can omit `KEY_BLOCK_SIZE`; the
  `KEY_BLOCK_SIZE` setting defaults to half
  the [`innodb_page_size`](innodb-parameters.html#sysvar_innodb_page_size) value.

* If you specify a valid `KEY_BLOCK_SIZE`
  value, you can omit
  `ROW_FORMAT=COMPRESSED`; compression is
  enabled automatically.

* To determine the best value for
  `KEY_BLOCK_SIZE,` typically you create
  several copies of the same table with different values for
  this clause, then measure the size of the resulting
  `.ibd` files and see how well each
  performs with a realistic
  [workload](glossary.html#glos_workload "workload"). For general
  tablespaces, keep in mind that dropping a table does not
  reduce the size of the general tablespace
  `.ibd` file, nor does it return disk
  space to the operating system. For more information, see
  [Section 17.6.3.3, “General Tablespaces”](general-tablespaces.html "17.6.3.3 General Tablespaces").

* The `KEY_BLOCK_SIZE` value is treated as a
  hint; a different size could be used by
  `InnoDB` if necessary. For file-per-table
  tablespaces, the `KEY_BLOCK_SIZE` can only
  be less than or equal to the
  [`innodb_page_size`](innodb-parameters.html#sysvar_innodb_page_size) value. If
  you specify a value greater than the
  [`innodb_page_size`](innodb-parameters.html#sysvar_innodb_page_size) value, the
  specified value is ignored, a warning is issued, and
  `KEY_BLOCK_SIZE` is set to half of the
  [`innodb_page_size`](innodb-parameters.html#sysvar_innodb_page_size) value. If
  `innodb_strict_mode=ON`, specifying an
  invalid `KEY_BLOCK_SIZE` value returns an
  error. For general tablespaces, valid
  `KEY_BLOCK_SIZE` values depend on the
  `FILE_BLOCK_SIZE` setting of the
  tablespace. For more information, see
  [Section 17.6.3.3, “General Tablespaces”](general-tablespaces.html "17.6.3.3 General Tablespaces").

* `InnoDB` supports 32KB and 64KB page sizes
  but these page sizes do not support compression. For more
  information, refer to the
  [`innodb_page_size`](innodb-parameters.html#sysvar_innodb_page_size)
  documentation.

* The default uncompressed size of `InnoDB`
  data [pages](glossary.html#glos_page "page") is 16KB.
  Depending on the combination of option values, MySQL uses a
  page size of 1KB, 2KB, 4KB, 8KB, or 16KB for the tablespace
  data file (`.ibd` file). The actual
  compression algorithm is not affected by the
  `KEY_BLOCK_SIZE` value; the value
  determines how large each compressed chunk is, which in turn
  affects how many rows can be packed into each compressed
  page.

* When creating a compressed table in a file-per-table
  tablespace, setting `KEY_BLOCK_SIZE` equal
  to the `InnoDB`
  [page size](glossary.html#glos_page_size "page size") does not
  typically result in much compression. For example, setting
  `KEY_BLOCK_SIZE=16` typically would not
  result in much compression, since the normal
  `InnoDB` page size is 16KB. This setting
  may still be useful for tables with many long
  [`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types"),
  [`VARCHAR`](char.html "13.3.2 The CHAR and VARCHAR Types") or
  [`TEXT`](blob.html "13.3.4 The BLOB and TEXT Types") columns, because such
  values often do compress well, and might therefore require
  fewer [overflow
  pages](glossary.html#glos_overflow_page "overflow page") as described in
  [Section 17.9.1.5, “How Compression Works for InnoDB Tables”](innodb-compression-internals.html "17.9.1.5 How Compression Works for InnoDB Tables"). For general
  tablespaces, a `KEY_BLOCK_SIZE` value equal
  to the `InnoDB` page size is not permitted.
  For more information, see
  [Section 17.6.3.3, “General Tablespaces”](general-tablespaces.html "17.6.3.3 General Tablespaces").

* All indexes of a table (including the
  [clustered index](glossary.html#glos_clustered_index "clustered index"))
  are compressed using the same page size, as specified in the
  `CREATE TABLE` or `ALTER
  TABLE` statement. Table attributes such as
  `ROW_FORMAT` and
  `KEY_BLOCK_SIZE` are not part of the
  `CREATE INDEX` syntax for
  `InnoDB` tables, and are ignored if they
  are specified (although, if specified, they appear in the
  output of the [`SHOW CREATE
  TABLE`](show-create-table.html "15.7.7.10 SHOW CREATE TABLE Statement") statement).

* For performance-related configuration options, see
  [Section 17.9.1.3, “Tuning Compression for InnoDB Tables”](innodb-compression-tuning.html "17.9.1.3 Tuning Compression for InnoDB Tables").

##### Restrictions on Compressed Tables

* Compressed tables cannot be stored in the
  `InnoDB` system tablespace.

* General tablespaces can contain multiple tables, but
  compressed and uncompressed tables cannot coexist within the
  same general tablespace.

* Compression applies to an entire table and all its
  associated indexes, not to individual rows, despite the
  clause name `ROW_FORMAT`.

* `InnoDB` does not support compressed
  temporary tables. When
  [`innodb_strict_mode`](innodb-parameters.html#sysvar_innodb_strict_mode) is
  enabled (the default),
  [`CREATE
  TEMPORARY TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") returns errors if
  `ROW_FORMAT=COMPRESSED` or
  `KEY_BLOCK_SIZE` is specified. If
  [`innodb_strict_mode`](innodb-parameters.html#sysvar_innodb_strict_mode) is
  disabled, warnings are issued and the temporary table is
  created using a non-compressed row format. The same
  restrictions apply to [`ALTER
  TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement") operations on temporary tables.