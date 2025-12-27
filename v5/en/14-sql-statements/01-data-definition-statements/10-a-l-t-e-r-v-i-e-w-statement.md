### 13.1.10 ALTER VIEW Statement

```sql
ALTER
    [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
    [DEFINER = user]
    [SQL SECURITY { DEFINER | INVOKER }]
    VIEW view_name [(column_list)]
    AS select_statement
    [WITH [CASCADED | LOCAL] CHECK OPTION]
```

This statement changes the definition of a view, which must exist. The syntax is similar to that for [`CREATE VIEW`](create-view.html "13.1.21 CREATE VIEW Statement") see [Section 13.1.21, “CREATE VIEW Statement”](create-view.html "13.1.21 CREATE VIEW Statement")). This statement requires the [`CREATE VIEW`](privileges-provided.html#priv_create-view) and [`DROP`](privileges-provided.html#priv_drop) privileges for the view, and some privilege for each column referred to in the [`SELECT`](select.html "13.2.9 SELECT Statement") statement. [`ALTER VIEW`](alter-view.html "13.1.10 ALTER VIEW Statement") is permitted only to the definer or users with the [`SUPER`](privileges-provided.html#priv_super) privilege.
