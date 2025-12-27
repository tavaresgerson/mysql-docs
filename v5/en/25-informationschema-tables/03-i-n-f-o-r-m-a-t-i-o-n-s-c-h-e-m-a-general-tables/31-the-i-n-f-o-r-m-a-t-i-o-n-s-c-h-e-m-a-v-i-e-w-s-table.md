### 24.3.31 The INFORMATION\_SCHEMA VIEWS Table

The [`VIEWS`](information-schema-views-table.html "24.3.31 The INFORMATION_SCHEMA VIEWS Table") table provides information about views in databases. You must have the [`SHOW VIEW`](privileges-provided.html#priv_show-view) privilege to access this table.

The [`VIEWS`](information-schema-views-table.html "24.3.31 The INFORMATION_SCHEMA VIEWS Table") table has these columns:

* `TABLE_CATALOG`

  The name of the catalog to which the view belongs. This value is always `def`.

* `TABLE_SCHEMA`

  The name of the schema (database) to which the view belongs.

* `TABLE_NAME`

  The name of the view.

* `VIEW_DEFINITION`

  The [`SELECT`](select.html "13.2.9 SELECT Statement") statement that provides the definition of the view. This column has most of what you see in the `Create Table` column that [`SHOW CREATE VIEW`](show-create-view.html "13.7.5.13 SHOW CREATE VIEW Statement") produces. Skip the words before [`SELECT`](select.html "13.2.9 SELECT Statement") and skip the words `WITH CHECK OPTION`. Suppose that the original statement was:

  ```sql
  CREATE VIEW v AS
    SELECT s2,s1 FROM t
    WHERE s1 > 5
    ORDER BY s1
    WITH CHECK OPTION;
  ```

  Then the view definition looks like this:

  ```sql
  SELECT s2,s1 FROM t WHERE s1 > 5 ORDER BY s1
  ```

* `CHECK_OPTION`

  The value of the `CHECK_OPTION` attribute. The value is one of `NONE`, `CASCADE`, or `LOCAL`.

* `IS_UPDATABLE`

  MySQL sets a flag, called the view updatability flag, at [`CREATE VIEW`](create-view.html "13.1.21 CREATE VIEW Statement") time. The flag is set to `YES` (true) if [`UPDATE`](update.html "13.2.11 UPDATE Statement") and [`DELETE`](delete.html "13.2.2 DELETE Statement") (and similar operations) are legal for the view. Otherwise, the flag is set to `NO` (false). The `IS_UPDATABLE` column in the [`VIEWS`](information-schema-views-table.html "24.3.31 The INFORMATION_SCHEMA VIEWS Table") table displays the status of this flag.

  If a view is not updatable, statements such [`UPDATE`](update.html "13.2.11 UPDATE Statement"), [`DELETE`](delete.html "13.2.2 DELETE Statement"), and [`INSERT`](insert.html "13.2.5 INSERT Statement") are illegal and are rejected. (Even if a view is updatable, it might not be possible to insert into it; for details, refer to [Section 23.5.3, “Updatable and Insertable Views”](view-updatability.html "23.5.3 Updatable and Insertable Views").)

  The `IS_UPDATABLE` flag may be unreliable if a view depends on one or more other views, and one of these underlying views is updated. Regardless of the `IS_UPDATABLE` value, the server keeps track of the updatability of a view and correctly rejects data change operations to views that are not updatable. If the `IS_UPDATABLE` value for a view has become inaccurate to due to changes to underlying views, the value can be updated by deleting and re-creating the view.

* `DEFINER`

  The account of the user who created the view, in `'user_name'@'host_name'` format.

* `SECURITY_TYPE`

  The view `SQL SECURITY` characteristic. The value is one of `DEFINER` or `INVOKER`.

* `CHARACTER_SET_CLIENT`

  The session value of the [`character_set_client`](server-system-variables.html#sysvar_character_set_client) system variable when the view was created.

* `COLLATION_CONNECTION`

  The session value of the [`collation_connection`](server-system-variables.html#sysvar_collation_connection) system variable when the view was created.

#### Notes

MySQL permits different [`sql_mode`](server-system-variables.html#sysvar_sql_mode) settings to tell the server the type of SQL syntax to support. For example, you might use the [`ANSI`](sql-mode.html#sqlmode_ansi) SQL mode to ensure MySQL correctly interprets the standard SQL concatenation operator, the double bar (`||`), in your queries. If you then create a view that concatenates items, you might worry that changing the [`sql_mode`](server-system-variables.html#sysvar_sql_mode) setting to a value different from [`ANSI`](sql-mode.html#sqlmode_ansi) could cause the view to become invalid. But this is not the case. No matter how you write out a view definition, MySQL always stores it the same way, in a canonical form. Here is an example that shows how the server changes a double bar concatenation operator to a [`CONCAT()`](string-functions.html#function_concat) function:

```sql
mysql> SET sql_mode = 'ANSI';
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE VIEW test.v AS SELECT 'a' || 'b' as col1;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT VIEW_DEFINITION FROM INFORMATION_SCHEMA.VIEWS
       WHERE TABLE_SCHEMA = 'test' AND TABLE_NAME = 'v';
+----------------------------------+
| VIEW_DEFINITION                  |
+----------------------------------+
| select concat('a','b') AS `col1` |
+----------------------------------+
1 row in set (0.00 sec)
```

The advantage of storing a view definition in canonical form is that changes made later to the value of [`sql_mode`](server-system-variables.html#sysvar_sql_mode) do not affect the results from the view. However, an additional consequence is that comments prior to [`SELECT`](select.html "13.2.9 SELECT Statement") are stripped from the definition by the server.
