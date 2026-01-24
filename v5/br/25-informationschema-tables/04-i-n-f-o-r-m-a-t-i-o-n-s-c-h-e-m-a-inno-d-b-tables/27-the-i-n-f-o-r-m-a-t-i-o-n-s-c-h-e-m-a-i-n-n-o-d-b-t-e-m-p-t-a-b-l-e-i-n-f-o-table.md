### 24.4.27 The INFORMATION_SCHEMA INNODB_TEMP_TABLE_INFO Table

The [`INNODB_TEMP_TABLE_INFO`](information-schema-innodb-temp-table-info-table.html "24.4.27 The INFORMATION_SCHEMA INNODB_TEMP_TABLE_INFO Table") table provides information about user-created `InnoDB` temporary tables that are active in an `InnoDB` instance. It does not provide information about internal `InnoDB` temporary tables used by the optimizer. The [`INNODB_TEMP_TABLE_INFO`](information-schema-innodb-temp-table-info-table.html "24.4.27 The INFORMATION_SCHEMA INNODB_TEMP_TABLE_INFO Table") table is created when first queried, exists only in memory, and is not persisted to disk.

For usage information and examples, see [Section 14.16.7, “InnoDB INFORMATION_SCHEMA Temporary Table Info Table”](innodb-information-schema-temp-table-info.html "14.16.7 InnoDB INFORMATION_SCHEMA Temporary Table Info Table").

The [`INNODB_TEMP_TABLE_INFO`](information-schema-innodb-temp-table-info-table.html "24.4.27 The INFORMATION_SCHEMA INNODB_TEMP_TABLE_INFO Table") table has these columns:

* `TABLE_ID`

  The table ID of the temporary table.

* `NAME`

  The name of the temporary table.

* `N_COLS`

  The number of columns in the temporary table. The number includes three hidden columns created by `InnoDB` (`DB_ROW_ID`, `DB_TRX_ID`, and `DB_ROLL_PTR`).

* `SPACE`

  The ID of the temporary tablespace where the temporary table resides. In 5.7, non-compressed `InnoDB` temporary tables reside in a shared temporary tablespace. The data file for the shared temporary tablespace is defined by the [`innodb_temp_data_file_path`](innodb-parameters.html#sysvar_innodb_temp_data_file_path) system variable. By default, there is a single data file for the shared temporary tablespace named `ibtmp1`, which is located in the data directory. Compressed temporary tables reside in separate file-per-table tablespaces located in the temporary file directory defined by [`tmpdir`](server-system-variables.html#sysvar_tmpdir). The temporary tablespace ID is a nonzero value that is dynamically generated on server restart.

* `PER_TABLE_TABLESPACE`

  A value of `TRUE` indicates that the temporary table resides in a separate file-per-table tablespace. A value of `FALSE` indicates that the temporary table resides in the shared temporary tablespace.

* `IS_COMPRESSED`

  A value of `TRUE` indicates that the temporary table is compressed.

#### Example

```sql
mysql> CREATE TEMPORARY TABLE t1 (c1 INT PRIMARY KEY) ENGINE=INNODB;

mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_TEMP_TABLE_INFO\G
*************************** 1. row ***************************
            TABLE_ID: 38
                NAME: #sql26cf_6_0
              N_COLS: 4
               SPACE: 52
PER_TABLE_TABLESPACE: FALSE
       IS_COMPRESSED: FALSE
```

#### Notes

* This table is useful primarily for expert-level monitoring.
* You must have the [`PROCESS`](privileges-provided.html#priv_process) privilege to query this table.

* Use the `INFORMATION_SCHEMA` [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") table or the [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") statement to view additional information about the columns of this table, including data types and default values.
