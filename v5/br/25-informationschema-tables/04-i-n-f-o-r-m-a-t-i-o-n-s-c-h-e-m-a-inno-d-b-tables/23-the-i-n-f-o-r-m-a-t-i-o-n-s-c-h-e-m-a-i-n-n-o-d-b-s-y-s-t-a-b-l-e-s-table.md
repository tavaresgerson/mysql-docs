### 24.4.23 The INFORMATION_SCHEMA INNODB_SYS_TABLES Table

The [`INNODB_SYS_TABLES`](information-schema-innodb-sys-tables-table.html "24.4.23 The INFORMATION_SCHEMA INNODB_SYS_TABLES Table") table provides metadata about `InnoDB` tables, equivalent to the information from the `SYS_TABLES` table in the `InnoDB` data dictionary.

For related usage information and examples, see [Section 14.16.3, “InnoDB INFORMATION_SCHEMA System Tables”](innodb-information-schema-system-tables.html "14.16.3 InnoDB INFORMATION_SCHEMA System Tables").

The [`INNODB_SYS_TABLES`](information-schema-innodb-sys-tables-table.html "24.4.23 The INFORMATION_SCHEMA INNODB_SYS_TABLES Table") table has these columns:

* `TABLE_ID`

  An identifier for the `InnoDB` table. This value is unique across all databases in the instance.

* `NAME`

  The name of the table, preceded by the schema (database) name where appropriate (for example, `test/t1`). Names of databases and user tables are in the same case as they were originally defined, possibly influenced by the [`lower_case_table_names`](server-system-variables.html#sysvar_lower_case_table_names) setting.

* `FLAG`

  A numeric value that represents bit-level information about table format and storage characteristics.

* `N_COLS`

  The number of columns in the table. The number reported includes three hidden columns that are created by `InnoDB` (`DB_ROW_ID`, `DB_TRX_ID`, and `DB_ROLL_PTR`). The number reported also includes [virtual generated columns](glossary.html#glos_virtual_generated_column "virtual generated column"), if present.

* `SPACE`

  An identifier for the tablespace where the table resides. 0 means the `InnoDB` [system tablespace](glossary.html#glos_system_tablespace "system tablespace"). Any other number represents either a [file-per-table](glossary.html#glos_file_per_table "file-per-table") tablespace or a general tablespace. This identifier stays the same after a [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") statement. For file-per-table tablespaces, this identifier is unique for tables across all databases in the instance.

* `FILE_FORMAT`

  The table's file format (`Antelope` or `Barracuda`).

* `ROW_FORMAT`

  The table's row format (`Compact`, `Redundant`, `Dynamic`, or `Compressed`).

* `ZIP_PAGE_SIZE`

  The zip page size. Applies only to tables with a row format of `Compressed`.

* `SPACE_TYPE`

  The type of tablespace to which the table belongs. Possible values include `System` for the system tablespace, `General` for general tablespaces, and `Single` for file-per-table tablespaces. Tables assigned to the system tablespace using [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") or [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") `TABLESPACE=innodb_system` have a `SPACE_TYPE` of `General`. For more information, see [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement").

#### Example

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_TABLES WHERE TABLE_ID = 214\G
*************************** 1. row ***************************
     TABLE_ID: 214
         NAME: test/t1
         FLAG: 129
       N_COLS: 4
        SPACE: 233
  FILE_FORMAT: Antelope
   ROW_FORMAT: Compact
ZIP_PAGE_SIZE: 0
   SPACE_TYPE: General
```

#### Notes

* You must have the [`PROCESS`](privileges-provided.html#priv_process) privilege to query this table.

* Use the `INFORMATION_SCHEMA` [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") table or the [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") statement to view additional information about the columns of this table, including data types and default values.
