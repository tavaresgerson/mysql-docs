#### 13.1.18.3 CREATE TABLE ... LIKE Statement

Use `CREATE TABLE ... LIKE` to create an empty table based on the definition of another table, including any column attributes and indexes defined in the original table:

```sql
CREATE TABLE new_tbl LIKE orig_tbl;
```

The copy is created using the same version of the table storage format as the original table. The [`SELECT`](privileges-provided.html#priv_select) privilege is required on the original table.

`LIKE` works only for base tables, not for views.

Important

You cannot execute `CREATE TABLE` or `CREATE TABLE ... LIKE` while a [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") statement is in effect.

[`CREATE TABLE ... LIKE`](create-table.html "13.1.18 CREATE TABLE Statement") makes the same checks as [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") and does not just copy the `.frm` file. This means that, if the current SQL mode is different from the mode in effect when the original table was created, the table definition might be considered invalid for the new mode, and the statement fails.

For `CREATE TABLE ... LIKE`, the destination table preserves generated column information from the original table.

`CREATE TABLE ... LIKE` does not preserve any `DATA DIRECTORY` or `INDEX DIRECTORY` table options that were specified for the original table, or any foreign key definitions.

If the original table is a `TEMPORARY` table, `CREATE TABLE ... LIKE` does not preserve `TEMPORARY`. To create a `TEMPORARY` destination table, use `CREATE TEMPORARY TABLE ... LIKE`.
