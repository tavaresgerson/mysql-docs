### 24.4.17 The INFORMATION\_SCHEMA INNODB\_SYS\_COLUMNS Table

The [`INNODB_SYS_COLUMNS`](information-schema-innodb-sys-columns-table.html "24.4.17 The INFORMATION_SCHEMA INNODB_SYS_COLUMNS Table") table provides metadata about `InnoDB` table columns, equivalent to the information from the `SYS_COLUMNS` table in the `InnoDB` data dictionary.

For related usage information and examples, see [Section 14.16.3, “InnoDB INFORMATION\_SCHEMA System Tables”](innodb-information-schema-system-tables.html "14.16.3 InnoDB INFORMATION_SCHEMA System Tables").

The [`INNODB_SYS_COLUMNS`](information-schema-innodb-sys-columns-table.html "24.4.17 The INFORMATION_SCHEMA INNODB_SYS_COLUMNS Table") table has these columns:

* `TABLE_ID`

  An identifier representing the table associated with the column; the same value as `INNODB_SYS_TABLES.TABLE_ID`.

* `NAME`

  The name of the column. These names can be uppercase or lowercase depending on the [`lower_case_table_names`](server-system-variables.html#sysvar_lower_case_table_names) setting. There are no special system-reserved names for columns.

* `POS`

  The ordinal position of the column within the table, starting from 0 and incrementing sequentially. When a column is dropped, the remaining columns are reordered so that the sequence has no gaps. The `POS` value for a virtual generated column encodes the column sequence number and ordinal position of the column. For more information, see the `POS` column description in [Section 24.4.26, “The INFORMATION\_SCHEMA INNODB\_SYS\_VIRTUAL Table”](information-schema-innodb-sys-virtual-table.html "24.4.26 The INFORMATION_SCHEMA INNODB_SYS_VIRTUAL Table").

* `MTYPE`

  Stands for “main type”. A numeric identifier for the column type. 1 = `VARCHAR`, 2 = `CHAR`, 3 = `FIXBINARY`, 4 = `BINARY`, 5 = `BLOB`, 6 = `INT`, 7 = `SYS_CHILD`, 8 = `SYS`, 9 = `FLOAT`, 10 = `DOUBLE`, 11 = `DECIMAL`, 12 = `VARMYSQL`, 13 = `MYSQL`, 14 = `GEOMETRY`.

* `PRTYPE`

  The `InnoDB` “precise type”, a binary value with bits representing MySQL data type, character set code, and nullability.

* `LEN`

  The column length, for example 4 for `INT` and 8 for `BIGINT`. For character columns in multibyte character sets, this length value is the maximum length in bytes needed to represent a definition such as `VARCHAR(N)`; that is, it might be `2*N`, `3*N`, and so on depending on the character encoding.

#### Example

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_COLUMNS where TABLE_ID = 71\G
*************************** 1. row ***************************
TABLE_ID: 71
    NAME: col1
     POS: 0
   MTYPE: 6
  PRTYPE: 1027
     LEN: 4
*************************** 2. row ***************************
TABLE_ID: 71
    NAME: col2
     POS: 1
   MTYPE: 2
  PRTYPE: 524542
     LEN: 10
*************************** 3. row ***************************
TABLE_ID: 71
    NAME: col3
     POS: 2
   MTYPE: 1
  PRTYPE: 524303
     LEN: 10
```

#### Notes

* You must have the [`PROCESS`](privileges-provided.html#priv_process) privilege to query this table.

* Use the `INFORMATION_SCHEMA` [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") table or the [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") statement to view additional information about the columns of this table, including data types and default values.
