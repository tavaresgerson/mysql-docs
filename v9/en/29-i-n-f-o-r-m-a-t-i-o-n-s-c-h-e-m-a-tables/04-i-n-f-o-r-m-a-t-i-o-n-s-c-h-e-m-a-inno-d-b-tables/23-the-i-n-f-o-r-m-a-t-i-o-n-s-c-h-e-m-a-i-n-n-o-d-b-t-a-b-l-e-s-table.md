### 28.4.23 The INFORMATION\_SCHEMA INNODB\_TABLES Table

The `INNODB_TABLES` table provides metadata about `InnoDB` tables.

For related usage information and examples, see Section 17.15.3, “InnoDB INFORMATION\_SCHEMA Schema Object Tables”.

The `INNODB_TABLES` table has these columns:

* `TABLE_ID`

  An identifier for the `InnoDB` table. This value is unique across all databases in the instance.

* `NAME`

  The name of the table, preceded by the schema (database) name where appropriate (for example, `test/t1`). Names of databases and user tables are in the same case as they were originally defined, possibly influenced by the `lower_case_table_names` setting.

* `FLAG`

  A numeric value that represents bit-level information about table format and storage characteristics.

* `N_COLS`

  The number of columns in the table. The number reported includes three hidden columns that are created by `InnoDB` (`DB_ROW_ID`, `DB_TRX_ID`, and `DB_ROLL_PTR`). The number reported also includes virtual generated columns, if present.

* `SPACE`

  An identifier for the tablespace where the table resides. 0 means the `InnoDB` system tablespace. Any other number represents either a file-per-table tablespace or a general tablespace. This identifier stays the same after a `TRUNCATE TABLE` statement. For file-per-table tablespaces, this identifier is unique for tables across all databases in the instance.

* `ROW_FORMAT`

  The table's row format (`Compact`, `Redundant`, `Dynamic`, or `Compressed`).

* `ZIP_PAGE_SIZE`

  The zip page size. Applies only to tables with a row format of `Compressed`.

* `SPACE_TYPE`

  The type of tablespace to which the table belongs. Possible values include `System` for the system tablespace, `General` for general tablespaces, and `Single` for file-per-table tablespaces. Tables assigned to the system tablespace using `CREATE TABLE` or `ALTER TABLE` `TABLESPACE=innodb_system` have a `SPACE_TYPE` of `General`. For more information, see `CREATE TABLESPACE`.

* `INSTANT_COLS`

  The number of columns that existed before the first instant column was added using `ALTER TABLE ... ADD COLUMN` with `ALGORITHM=INSTANT`. This column is no longer used.

* `TOTAL_ROW_VERSIONS`

  The number of row versions for the table. The initial value is

  0. The value is incremented by `ALTER TABLE ... ALGORITHM=INSTANT` operations that add or remove columns. When a table with instantly added or dropped columns is rebuilt due to a table-rebuilding `ALTER TABLE` or `OPTIMIZE TABLE` operation, the value is reset to 0. For more information, see Column Operations.

  The maximum `TOTAL_ROW_VERSIONS` value is 255.

#### Example

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TABLES WHERE TABLE_ID = 214\G
*************************** 1. row ***************************
          TABLE_ID: 1064
              NAME: test/t1
              FLAG: 33
            N_COLS: 6
             SPACE: 3
        ROW_FORMAT: Dynamic
     ZIP_PAGE_SIZE: 0
        SPACE_TYPE: Single
      INSTANT_COLS: 0
TOTAL_ROW_VERSIONS: 3
```

#### Notes

* You must have the `PROCESS` privilege to query this table.

* Use the `INFORMATION_SCHEMA` `COLUMNS` table or the `SHOW COLUMNS` statement to view additional information about the columns of this table, including data types and default values.
