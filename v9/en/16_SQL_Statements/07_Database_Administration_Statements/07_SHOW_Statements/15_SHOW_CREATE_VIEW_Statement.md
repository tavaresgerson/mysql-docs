#### 15.7.7.15 SHOW CREATE VIEW Statement

```
SHOW CREATE VIEW view_name
```

This statement shows the `CREATE VIEW` statement that creates the named view.

```
mysql> SHOW CREATE VIEW v\G
*************************** 1. row ***************************
                View: v
         Create View: CREATE ALGORITHM=UNDEFINED
                      DEFINER=`bob`@`localhost`
                      SQL SECURITY DEFINER VIEW
                      `v` AS select 1 AS `a`,2 AS `b`
character_set_client: utf8mb4
collation_connection: utf8mb4_0900_ai_ci
```

`character_set_client` is the session value of the `character_set_client` system variable when the view was created. `collation_connection` is the session value of the `collation_connection` system variable when the view was created.

Use of `SHOW CREATE VIEW` requires the `SHOW VIEW` privilege, and the `SELECT` privilege for the view in question.

View information is also available from the `INFORMATION_SCHEMA` `VIEWS` table. See Section 28.3.53, “The INFORMATION\_SCHEMA VIEWS Table”.

This statement also works to show the `CREATE JSON DUALITY VIEW` statement required to create a JSON duality view. You can also obtain information about JSON duality views from the `INFORMATION_SCHEMA` tables `JSON_DUALITY_VIEWS`, `JSON_DUALITY_VIEW_COLUMNS`, `JSON_DUALITY_VIEW_LINKS`, and `JSON_DUALITY_VIEW_TABLES`. See also Section 27.7.3, “JSON Duality View Metadata”.

The following example shows the `SHOW CREATE VIEW` statement used to create a JSON duality view:

```
mysql> SHOW CREATE VIEW order_dv\G
*************************** 1. row ***************************
                View: order_dv
         Create View: CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER JSON RELATIONAL DUALITY VIEW `order_dv`
                      AS select json_duality_object( WITH (INSERT,UPDATE,DELETE) '_id':`orders`.`order_id`,'product':`orders`.`product`,'amount':`orders`.`amount`,'customer':
                      (select json_duality_object( WITH (INSERT,UPDATE) 'customer_id':`customers`.`customer_id`,'customer_name':`customers`.`name`)
                      from `customers` where (`customers`.`customer_id` = `orders`.`customer_id`))) AS `Name_exp_1` from `orders`
character_set_client: utf8mb4
collation_connection: utf8mb4_0900_ai_ci
1 row in set (0.002 sec)
```

MySQL lets you use different `sql_mode` settings to tell the server the type of SQL syntax to support. For example, you might use the `ANSI` SQL mode to ensure MySQL correctly interprets the standard SQL concatenation operator, the double bar (`||`), in your queries. If you then create a view that concatenates items, you might worry that changing the `sql_mode` setting to a value different from `ANSI` could cause the view to become invalid. But this is not the case. No matter how you write out a view definition, MySQL always stores it the same way, in a canonical form. Here is an example that shows how the server changes a double bar concatenation operator to a `CONCAT()` function:

```
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

The advantage of storing a view definition in canonical form is that changes made later to the value of `sql_mode` do not affect the results from the view. However an additional consequence is that comments prior to `SELECT` are stripped from the definition by the server.
