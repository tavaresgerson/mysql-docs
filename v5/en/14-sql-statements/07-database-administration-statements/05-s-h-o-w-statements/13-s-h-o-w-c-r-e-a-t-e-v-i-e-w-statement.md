#### 13.7.5.13 SHOW CREATE VIEW Statement

```sql
SHOW CREATE VIEW view_name
```

This statement shows the [`CREATE VIEW`](create-view.html "13.1.21 CREATE VIEW Statement") statement that creates the named view.

```sql
mysql> SHOW CREATE VIEW v\G
*************************** 1. row ***************************
                View: v
         Create View: CREATE ALGORITHM=UNDEFINED
                      DEFINER=`bob`@`localhost`
                      SQL SECURITY DEFINER VIEW
                      `v` AS select 1 AS `a`,2 AS `b`
character_set_client: utf8
collation_connection: utf8_general_ci
```

`character_set_client` is the session value of the [`character_set_client`](server-system-variables.html#sysvar_character_set_client) system variable when the view was created. `collation_connection` is the session value of the [`collation_connection`](server-system-variables.html#sysvar_collation_connection) system variable when the view was created.

Use of [`SHOW CREATE VIEW`](show-create-view.html "13.7.5.13 SHOW CREATE VIEW Statement") requires the [`SHOW VIEW`](privileges-provided.html#priv_show-view) privilege, and the [`SELECT`](privileges-provided.html#priv_select) privilege for the view in question.

View information is also available from the `INFORMATION_SCHEMA` [`VIEWS`](information-schema-views-table.html "24.3.31 The INFORMATION_SCHEMA VIEWS Table") table. See [Section 24.3.31, “The INFORMATION_SCHEMA VIEWS Table”](information-schema-views-table.html "24.3.31 The INFORMATION_SCHEMA VIEWS Table").

MySQL lets you use different [`sql_mode`](server-system-variables.html#sysvar_sql_mode) settings to tell the server the type of SQL syntax to support. For example, you might use the [`ANSI`](sql-mode.html#sqlmode_ansi) SQL mode to ensure MySQL correctly interprets the standard SQL concatenation operator, the double bar (`||`), in your queries. If you then create a view that concatenates items, you might worry that changing the [`sql_mode`](server-system-variables.html#sysvar_sql_mode) setting to a value different from [`ANSI`](sql-mode.html#sqlmode_ansi) could cause the view to become invalid. But this is not the case. No matter how you write out a view definition, MySQL always stores it the same way, in a canonical form. Here is an example that shows how the server changes a double bar concatenation operator to a [`CONCAT()`](string-functions.html#function_concat) function:

```sql
mysql> SET sql_mode = 'ANSI';
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE VIEW test.v AS SELECT 'a' || 'b' as col1;
Query OK, 0 rows affected (0.01 sec)

mysql> SHOW CREATE VIEW test.v\G
*************************** 1. row ***************************
                View: v
         Create View: CREATE VIEW "v" AS select concat('a','b') AS "col1"
...
1 row in set (0.00 sec)
```

The advantage of storing a view definition in canonical form is that changes made later to the value of [`sql_mode`](server-system-variables.html#sysvar_sql_mode) does not affect the results from the view. However an additional consequence is that comments prior to [`SELECT`](select.html "13.2.9 SELECT Statement") are stripped from the definition by the server.
