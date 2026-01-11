### 28.4.29 The INFORMATION_SCHEMA INNODB_VIRTUAL Table

The `INNODB_VIRTUAL` table provides metadata about `InnoDB` virtual generated columns and columns upon which virtual generated columns are based.

A row appears in the `INNODB_VIRTUAL` table for each column upon which a virtual generated column is based.

The `INNODB_VIRTUAL` table has these columns:

* `TABLE_ID`

  An identifier representing the table associated with the virtual column; the same value as `INNODB_TABLES.TABLE_ID`.

* `POS`

  The position value of the virtual generated column. The value is large because it encodes the column sequence number and ordinal position. The formula used to calculate the value uses a bitwise operation:

  ```
  ((nth virtual generated column for the InnoDB instance + 1) << 16)
  + the ordinal position of the virtual generated column
  ```

  For example, if the first virtual generated column in the `InnoDB` instance is the third column of the table, the formula is `(0 + 1) << 16) + 2`. The first virtual generated column in the `InnoDB` instance is always number 0. As the third column in the table, the ordinal position of the virtual generated column is 2. Ordinal positions are counted from 0.

* `BASE_POS`

  The ordinal position of the columns upon which a virtual generated column is based.

#### Example

```
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
|       98 | 65538 |        0 |
|       98 | 65538 |        1 |
+----------+-------+----------+
```

#### Notes

* If a constant value is assigned to a virtual generated column, as in the following table, an entry for the column does not appear in the `INNODB_VIRTUAL` table. For an entry to appear, a virtual generated column must have a base column.

  ```
  CREATE TABLE `t1` (
    `a` int(11) DEFAULT NULL,
    `b` int(11) DEFAULT NULL,
    `c` int(11) GENERATED ALWAYS AS (5) VIRTUAL
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  ```

  However, metadata for such a column does appear in the `INNODB_COLUMNS` table.

* You must have the `PROCESS` privilege to query this table.

* Use the `INFORMATION_SCHEMA` `COLUMNS` table or the `SHOW COLUMNS` statement to view additional information about the columns of this table, including data types and default values.
