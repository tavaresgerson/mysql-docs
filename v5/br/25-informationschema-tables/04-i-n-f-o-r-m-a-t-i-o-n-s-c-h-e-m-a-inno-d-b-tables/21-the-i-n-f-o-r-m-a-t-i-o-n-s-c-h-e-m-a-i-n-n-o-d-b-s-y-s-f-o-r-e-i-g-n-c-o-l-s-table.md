### 24.4.21 The INFORMATION_SCHEMA INNODB_SYS_FOREIGN_COLS Table

The [`INNODB_SYS_FOREIGN_COLS`](information-schema-innodb-sys-foreign-cols-table.html "24.4.21 The INFORMATION_SCHEMA INNODB_SYS_FOREIGN_COLS Table") table provides status information about the columns of `InnoDB` foreign keys, equivalent to the information from the `SYS_FOREIGN_COLS` table in the `InnoDB` data dictionary.

For related usage information and examples, see [Section 14.16.3, “InnoDB INFORMATION_SCHEMA System Tables”](innodb-information-schema-system-tables.html "14.16.3 InnoDB INFORMATION_SCHEMA System Tables").

The [`INNODB_SYS_FOREIGN_COLS`](information-schema-innodb-sys-foreign-cols-table.html "24.4.21 The INFORMATION_SCHEMA INNODB_SYS_FOREIGN_COLS Table") table has these columns:

* `ID`

  The foreign key index associated with this index key field, using the same value as `INNODB_SYS_FOREIGN.ID`.

* `FOR_COL_NAME`

  The name of the associated column in the child table.

* `REF_COL_NAME`

  The name of the associated column in the parent table.

* `POS`

  The ordinal position of this key field within the foreign key index, starting from 0.

#### Example

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN_COLS WHERE ID = 'test/fk1'\G
*************************** 1. row ***************************
          ID: test/fk1
FOR_COL_NAME: parent_id
REF_COL_NAME: id
         POS: 0
```

#### Notes

* You must have the [`PROCESS`](privileges-provided.html#priv_process) privilege to query this table.

* Use the `INFORMATION_SCHEMA` [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") table or the [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") statement to view additional information about the columns of this table, including data types and default values.
