### 28.4.25 The INFORMATION\_SCHEMA INNODB\_TABLESPACES\_BRIEF Table

The [`INNODB_TABLESPACES_BRIEF`](information-schema-innodb-tablespaces-brief-table.html "28.4.25 The INFORMATION_SCHEMA INNODB_TABLESPACES_BRIEF Table") table
provides space ID, name, path, flag, and space type metadata for
file-per-table, general, undo, and system tablespaces.

[`INNODB_TABLESPACES`](information-schema-innodb-tablespaces-table.html "28.4.24 The INFORMATION_SCHEMA INNODB_TABLESPACES Table") provides the same
metadata but loads more slowly because other metadata provided by
the table, such as `FS_BLOCK_SIZE`,
`FILE_SIZE`, and
`ALLOCATED_SIZE`, must be loaded dynamically.

Space and path metadata is also provided by the
[`INNODB_DATAFILES`](information-schema-innodb-datafiles-table.html "28.4.10 The INFORMATION_SCHEMA INNODB_DATAFILES Table") table.

The [`INNODB_TABLESPACES_BRIEF`](information-schema-innodb-tablespaces-brief-table.html "28.4.25 The INFORMATION_SCHEMA INNODB_TABLESPACES_BRIEF Table") table
has these columns:

* `SPACE`

  The tablespace ID.

* `NAME`

  The tablespace name. For file-per-table tablespaces, the name
  is in the form of
  *`schema/table_name`*.

* `PATH`

  The tablespace data file path. If a
  [file-per-table](glossary.html#glos_file_per_table "file-per-table")
  tablespace is created in a location outside the MySQL data
  directory, the path value is a fully qualified directory path.
  Otherwise, the path is relative to the data directory.

* `FLAG`

  A numeric value that represents bit-level information about
  tablespace format and storage characteristics.

* `SPACE_TYPE`

  The type of tablespace. Possible values include
  `General` for `InnoDB`
  general tablespaces, `Single` for
  `InnoDB` file-per-table tablespaces, and
  `System` for the `InnoDB`
  system tablespace.

#### Example

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TABLESPACES_BRIEF WHERE SPACE = 7;
+-------+---------+---------------+-------+------------+
| SPACE | NAME    | PATH          | FLAG  | SPACE_TYPE |
+-------+---------+---------------+-------+------------+
| 7     | test/t1 | ./test/t1.ibd | 16417 | Single     |
+-------+---------+---------------+-------+------------+
```

#### Notes

* You must have the [`PROCESS`](privileges-provided.html#priv_process)
  privilege to query this table.

* Use the `INFORMATION_SCHEMA`
  [`COLUMNS`](information-schema-columns-table.html "28.3.8 The INFORMATION_SCHEMA COLUMNS Table") table or the
  [`SHOW COLUMNS`](show-columns.html "15.7.7.6 SHOW COLUMNS Statement") statement to view
  additional information about the columns of this table,
  including data types and default values.