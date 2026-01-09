### 24.4.26 The INFORMATION_SCHEMA INNODB_SYS_VIRTUAL Table

The [`INNODB_SYS_VIRTUAL`](information-schema-innodb-sys-virtual-table.html "24.4.26 The INFORMATION_SCHEMA INNODB_SYS_VIRTUAL Table") table provides metadata about `InnoDB` [virtual generated columns](glossary.html#glos_virtual_generated_column "virtual generated column") and columns upon which virtual generated columns are based, equivalent to information in the `SYS_VIRTUAL` table in the `InnoDB` data dictionary.

A row appears in the `INNODB_SYS_VIRTUAL` table for each column upon which a virtual generated column is based.

The [`INNODB_SYS_VIRTUAL`](information-schema-innodb-sys-virtual-table.html "24.4.26 The INFORMATION_SCHEMA INNODB_SYS_VIRTUAL Table") table has these columns:

* `TABLE_ID`

  An identifier representing the table associated with the virtual column; the same value as `INNODB_SYS_TABLES.TABLE_ID`.

* `POS`

  The position value of the [virtual generated column](glossary.html#glos_virtual_generated_column "virtual generated column"). The value is large because it encodes the column sequence number and ordinal position. The formula used to calculate the value uses a bitwise operation:

  ```sql
  ((nth virtual generated column for the InnoDB instance + 1) << 16)
  + the ordinal position of the virtual generated column
  ```

  For example, if the first virtual generated column in the `InnoDB` instance is the third column of the table, the formula is `(0 + 1) << 16) + 2`. The first virtual generated column in the `InnoDB` instance is always number 0. As the third column in the table, the ordinal position of the virtual generated column is 2. Ordinal positions are counted from 0.

* `BASE_POS`

  The ordinal position of the columns upon which a virtual generated column is based.

#### Example

```sql
mysql> CREATE TABLE `t1` (
         `a` int(11) DEFAULT NULL,
         `b` int(11) DEFAULT NULL,
         `c` int(11) GENERATED ALWAYS AS (a+b) VIRTUAL,
         `h` varchar(10) DEFAULT NULL
       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_VIRTUAL
       WHERE TABLE_ID IN
         (SELECT TABLE_ID FROM INFORMATION_SCHEMA.INNODB_TABLES
          WHERE NAME LIKE "test/t1");
+----------+-------+----------+
| TABLE_ID | POS   | BASE_POS |
+----------+-------+----------+
|       95 | 65538 |        0 |
|       95 | 65538 |        1 |
+----------+-------+----------+
```

#### Notes

* If a constant value is assigned to a [virtual generated column](glossary.html#glos_virtual_generated_column "virtual generated column"), as in the following table, an entry for the column does not appear in the `INNODB_SYS_VIRTUAL` table. For an entry to appear, a virtual generated column must have a base column.

  ```sql
  CREATE TABLE `t1` (
    `a` int(11) DEFAULT NULL,
    `b` int(11) DEFAULT NULL,
    `c` int(11) GENERATED ALWAYS AS (5) VIRTUAL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  ```

  However, metadata for such a column does appear in the [`INNODB_SYS_COLUMNS`](information-schema-innodb-sys-columns-table.html "24.4.17 The INFORMATION_SCHEMA INNODB_SYS_COLUMNS Table") table.

* You must have the [`PROCESS`](privileges-provided.html#priv_process) privilege to query this table.

* Use the `INFORMATION_SCHEMA` [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") table or the [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") statement to view additional information about the columns of this table, including data types and default values.
