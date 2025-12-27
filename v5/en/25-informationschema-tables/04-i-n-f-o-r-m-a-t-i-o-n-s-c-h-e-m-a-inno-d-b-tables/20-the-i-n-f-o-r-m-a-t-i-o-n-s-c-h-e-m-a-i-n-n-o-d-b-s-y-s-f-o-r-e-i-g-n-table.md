### 24.4.20 The INFORMATION\_SCHEMA INNODB\_SYS\_FOREIGN Table

The [`INNODB_SYS_FOREIGN`](information-schema-innodb-sys-foreign-table.html "24.4.20 The INFORMATION_SCHEMA INNODB_SYS_FOREIGN Table") table provides metadata about `InnoDB` [foreign keys](glossary.html#glos_foreign_key "foreign key"), equivalent to the information from the `SYS_FOREIGN` table in the `InnoDB` data dictionary.

For related usage information and examples, see [Section 14.16.3, “InnoDB INFORMATION\_SCHEMA System Tables”](innodb-information-schema-system-tables.html "14.16.3 InnoDB INFORMATION_SCHEMA System Tables").

The [`INNODB_SYS_FOREIGN`](information-schema-innodb-sys-foreign-table.html "24.4.20 The INFORMATION_SCHEMA INNODB_SYS_FOREIGN Table") table has these columns:

* `ID`

  The name (not a numeric value) of the foreign key index, preceded by the schema (database) name (for example, `test/products_fk`).

* `FOR_NAME`

  The name of the [child table](glossary.html#glos_child_table "child table") in this foreign key relationship.

* `REF_NAME`

  The name of the [parent table](glossary.html#glos_parent_table "parent table") in this foreign key relationship.

* `N_COLS`

  The number of columns in the foreign key index.

* `TYPE`

  A collection of bit flags with information about the foreign key column, ORed together. 0 = `ON DELETE/UPDATE RESTRICT`, 1 = `ON DELETE CASCADE`, 2 = `ON DELETE SET NULL`, 4 = `ON UPDATE CASCADE`, 8 = `ON UPDATE SET NULL`, 16 = `ON DELETE NO ACTION`, 32 = `ON UPDATE NO ACTION`.

#### Example

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_SYS_FOREIGN\G
*************************** 1. row ***************************
      ID: test/fk1
FOR_NAME: test/child
REF_NAME: test/parent
  N_COLS: 1
    TYPE: 1
```

#### Notes

* You must have the [`PROCESS`](privileges-provided.html#priv_process) privilege to query this table.

* Use the `INFORMATION_SCHEMA` [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") table or the [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") statement to view additional information about the columns of this table, including data types and default values.
