### 28.4.13 The INFORMATION_SCHEMA INNODB_FOREIGN_COLS Table

The `INNODB_FOREIGN_COLS` table provides status information about `InnoDB` foreign key columns.

For related usage information and examples, see Section 17.15.3, “InnoDB INFORMATION_SCHEMA Schema Object Tables”.

The `INNODB_FOREIGN_COLS` table has these columns:

* `ID`

  The foreign key index associated with this index key field; the same value as `INNODB_FOREIGN.ID`.

* `FOR_COL_NAME`

  The name of the associated column in the child table.

* `REF_COL_NAME`

  The name of the associated column in the parent table.

* `POS`

  The ordinal position of this key field within the foreign key index, starting from 0.

#### Example

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FOREIGN_COLS WHERE ID = 'test/fk1'\G
*************************** 1. row ***************************
          ID: test/fk1
FOR_COL_NAME: parent_id
REF_COL_NAME: id
         POS: 0
```

#### Notes

* You must have the `PROCESS` privilege to query this table.

* Use the `INFORMATION_SCHEMA` `COLUMNS` table or the `SHOW COLUMNS` statement to view additional information about the columns of this table, including data types and default values.
