### 15.1.11 ALTER VIEW Statement

```
ALTER
    [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
    [DEFINER = user]
    [SQL SECURITY { DEFINER | INVOKER }]
    VIEW view_name [(column_list)]
    AS select_statement
    [WITH [CASCADED | LOCAL] CHECK OPTION]
```

This statement changes the definition of a view, which must exist.
The syntax is similar to that for [`CREATE
VIEW`](create-view.html "15.1.23 CREATE VIEW Statement") see [Section 15.1.23, “CREATE VIEW Statement”](create-view.html "15.1.23 CREATE VIEW Statement")). This statement
requires the [`CREATE VIEW`](privileges-provided.html#priv_create-view) and
[`DROP`](privileges-provided.html#priv_drop) privileges for the view, and
some privilege for each column referred to in the
[`SELECT`](select.html "15.2.13 SELECT Statement") statement.
[`ALTER VIEW`](alter-view.html "15.1.11 ALTER VIEW Statement") is permitted only to the
definer or users with the
[`SET_USER_ID`](privileges-provided.html#priv_set-user-id) privilege (or the
deprecated [`SUPER`](privileges-provided.html#priv_super) privilege).