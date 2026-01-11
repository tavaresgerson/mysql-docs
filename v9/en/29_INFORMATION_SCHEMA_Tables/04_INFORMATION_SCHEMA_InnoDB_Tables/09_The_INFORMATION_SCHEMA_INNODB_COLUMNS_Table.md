### 28.4.9 The INFORMATION\_SCHEMA INNODB\_COLUMNS Table

The `INNODB_COLUMNS` table provides metadata about `InnoDB` table columns.

For related usage information and examples, see Section 17.15.3, “InnoDB INFORMATION\_SCHEMA Schema Object Tables”.

The `INNODB_COLUMNS` table has these columns:

* `TABLE_ID`

  An identifier representing the table associated with the column; the same value as `INNODB_TABLES.TABLE_ID`.

* `NAME`

  The name of the column. These names can be uppercase or lowercase depending on the `lower_case_table_names` setting. There are no special system-reserved names for columns.

* `POS`

  The ordinal position of the column within the table, starting from 0 and incrementing sequentially. When a column is dropped, the remaining columns are reordered so that the sequence has no gaps. The `POS` value for a virtual generated column encodes the column sequence number and ordinal position of the column. For more information, see the `POS` column description in Section 28.4.29, “The INFORMATION\_SCHEMA INNODB\_VIRTUAL Table”.

* `MTYPE`

  Stands for “main type”. A numeric identifier for the column type. 1 = `VARCHAR`, 2 = `CHAR`, 3 = `FIXBINARY`, 4 = `BINARY`, 5 = `BLOB`, 6 = `INT`, 7 = `SYS_CHILD`, 8 = `SYS`, 9 = `FLOAT`, 10 = `DOUBLE`, 11 = `DECIMAL`, 12 = `VARMYSQL`, 13 = `MYSQL`, 14 = `GEOMETRY`.

* `PRTYPE`

  The `InnoDB` “precise type”, a binary value with bits representing MySQL data type, character set code, and nullability.

* `LEN`

  The column length, for example 4 for `INT` and 8 for `BIGINT`. For character columns in multibyte character sets, this length value is the maximum length in bytes needed to represent a definition such as `VARCHAR(N)`; that is, it might be `2*N`, `3*N`, and so on depending on the character encoding.

* `HAS_DEFAULT`

  A boolean value indicating whether a column that was added instantly using `ALTER TABLE ... ADD COLUMN` with `ALGORITHM=INSTANT` has a default value. All columns added instantly have a default value, which makes this column an indicator of whether the column was added instantly.

* `DEFAULT_VALUE`

  The initial default value of a column that was added instantly using `ALTER TABLE ... ADD COLUMN` with `ALGORITHM=INSTANT`. If the default value is `NULL` or was not specified, this column reports `NULL`. An explicitly specified non-`NULL` default value is shown in an internal binary format. Subsequent modifications of the column default value do not change the value reported by this column.

#### Example

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_COLUMNS where TABLE_ID = 71\G
*************************** 1. row ***************************
     TABLE_ID: 71
         NAME: col1
          POS: 0
        MTYPE: 6
       PRTYPE: 1027
          LEN: 4
  HAS_DEFAULT: 0
DEFAULT_VALUE: NULL
*************************** 2. row ***************************
     TABLE_ID: 71
         NAME: col2
          POS: 1
        MTYPE: 2
       PRTYPE: 524542
          LEN: 10
  HAS_DEFAULT: 0
DEFAULT_VALUE: NULL
*************************** 3. row ***************************
     TABLE_ID: 71
         NAME: col3
          POS: 2
        MTYPE: 1
       PRTYPE: 524303
          LEN: 10
  HAS_DEFAULT: 0
DEFAULT_VALUE: NULL
```

#### Notes

* You must have the `PROCESS` privilege to query this table.

* Use the `INFORMATION_SCHEMA` `COLUMNS` table or the `SHOW COLUMNS` statement to view additional information about the columns of this table, including data types and default values.
