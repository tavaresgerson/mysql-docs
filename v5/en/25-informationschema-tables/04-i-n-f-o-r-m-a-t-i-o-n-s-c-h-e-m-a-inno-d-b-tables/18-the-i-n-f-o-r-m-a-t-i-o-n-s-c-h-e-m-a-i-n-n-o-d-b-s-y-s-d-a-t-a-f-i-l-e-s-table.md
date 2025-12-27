### 24.4.18 The INFORMATION\_SCHEMA INNODB\_SYS\_DATAFILES Table

The [`INNODB_SYS_DATAFILES`](information-schema-innodb-sys-datafiles-table.html "24.4.18 The INFORMATION_SCHEMA INNODB_SYS_DATAFILES Table") table provides data file path information for `InnoDB` file-per-table and general tablespaces, equivalent to the information in the `SYS_DATAFILES` table in the `InnoDB` data dictionary.

For related usage information and examples, see [Section 14.16.3, “InnoDB INFORMATION\_SCHEMA System Tables”](innodb-information-schema-system-tables.html "14.16.3 InnoDB INFORMATION_SCHEMA System Tables").

Note

The `INFORMATION_SCHEMA` [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") table reports metadata for all `InnoDB` tablespace types including file-per-table tablespaces, general tablespaces, the system tablespace, the temporary tablespace, and undo tablespaces, if present.

The [`INNODB_SYS_DATAFILES`](information-schema-innodb-sys-datafiles-table.html "24.4.18 The INFORMATION_SCHEMA INNODB_SYS_DATAFILES Table") table has these columns:

* `SPACE`

  The tablespace ID.

* `PATH`

  The tablespace data file path. If a [file-per-table](glossary.html#glos_file_per_table "file-per-table") tablespace is created in a location outside the MySQL data directory, the path value is a fully qualified directory path. Otherwise, the path is relative to the data directory.

#### Example

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_DATAFILES WHERE SPACE = 57\G
*************************** 1. row ***************************
SPACE: 57
 PATH: ./test/t1.ibd
```

#### Notes

* You must have the [`PROCESS`](privileges-provided.html#priv_process) privilege to query this table.

* Use the `INFORMATION_SCHEMA` [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") table or the [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") statement to view additional information about the columns of this table, including data types and default values.
