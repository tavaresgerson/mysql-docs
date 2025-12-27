### 13.1.21 CREATE VIEW Statement

```sql
CREATE
    [OR REPLACE]
    [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
    [DEFINER = user]
    [SQL SECURITY { DEFINER | INVOKER }]
    VIEW view_name [(column_list)]
    AS select_statement
    [WITH [CASCADED | LOCAL] CHECK OPTION]
```

The [`CREATE VIEW`](create-view.html "13.1.21 CREATE VIEW Statement") statement creates a new view, or replaces an existing view if the `OR REPLACE` clause is given. If the view does not exist, [`CREATE OR REPLACE VIEW`](create-view.html "13.1.21 CREATE VIEW Statement") is the same as [`CREATE VIEW`](create-view.html "13.1.21 CREATE VIEW Statement"). If the view does exist, [`CREATE OR REPLACE VIEW`](create-view.html "13.1.21 CREATE VIEW Statement") replaces it.

For information about restrictions on view use, see [Section 23.9, “Restrictions on Views”](view-restrictions.html "23.9 Restrictions on Views").

The *`select_statement`* is a [`SELECT`](select.html "13.2.9 SELECT Statement") statement that provides the definition of the view. (Selecting from the view selects, in effect, using the [`SELECT`](select.html "13.2.9 SELECT Statement") statement.) The *`select_statement`* can select from base tables or from other views.

The view definition is “frozen” at creation time and is not affected by subsequent changes to the definitions of the underlying tables. For example, if a view is defined as `SELECT *` on a table, new columns added to the table later do not become part of the view, and columns dropped from the table result in an error when selecting from the view.

The `ALGORITHM` clause affects how MySQL processes the view. The `DEFINER` and `SQL SECURITY` clauses specify the security context to be used when checking access privileges at view invocation time. The `WITH CHECK OPTION` clause can be given to constrain inserts or updates to rows in tables referenced by the view. These clauses are described later in this section.

The [`CREATE VIEW`](create-view.html "13.1.21 CREATE VIEW Statement") statement requires the [`CREATE VIEW`](privileges-provided.html#priv_create-view) privilege for the view, and some privilege for each column selected by the [`SELECT`](select.html "13.2.9 SELECT Statement") statement. For columns used elsewhere in the [`SELECT`](select.html "13.2.9 SELECT Statement") statement, you must have the [`SELECT`](privileges-provided.html#priv_select) privilege. If the `OR REPLACE` clause is present, you must also have the [`DROP`](privileges-provided.html#priv_drop) privilege for the view. If the `DEFINER` clause is present, the privileges required depend on the *`user`* value, as discussed in [Section 23.6, “Stored Object Access Control”](stored-objects-security.html "23.6 Stored Object Access Control").

When a view is referenced, privilege checking occurs as described later in this section.

A view belongs to a database. By default, a new view is created in the default database. To create the view explicitly in a given database, use *`db_name.view_name`* syntax to qualify the view name with the database name:

```sql
CREATE VIEW test.v AS SELECT * FROM t;
```

Unqualified table or view names in the [`SELECT`](select.html "13.2.9 SELECT Statement") statement are also interpreted with respect to the default database. A view can refer to tables or views in other databases by qualifying the table or view name with the appropriate database name.

Within a database, base tables and views share the same namespace, so a base table and a view cannot have the same name.

Columns retrieved by the [`SELECT`](select.html "13.2.9 SELECT Statement") statement can be simple references to table columns, or expressions that use functions, constant values, operators, and so forth.

A view must have unique column names with no duplicates, just like a base table. By default, the names of the columns retrieved by the [`SELECT`](select.html "13.2.9 SELECT Statement") statement are used for the view column names. To define explicit names for the view columns, specify the optional *`column_list`* clause as a list of comma-separated identifiers. The number of names in *`column_list`* must be the same as the number of columns retrieved by the [`SELECT`](select.html "13.2.9 SELECT Statement") statement.

A view can be created from many kinds of [`SELECT`](select.html "13.2.9 SELECT Statement") statements. It can refer to base tables or other views. It can use joins, [`UNION`](union.html "13.2.9.3 UNION Clause"), and subqueries. The [`SELECT`](select.html "13.2.9 SELECT Statement") need not even refer to any tables:

```sql
CREATE VIEW v_today (today) AS SELECT CURRENT_DATE;
```

The following example defines a view that selects two columns from another table as well as an expression calculated from those columns:

```sql
mysql> CREATE TABLE t (qty INT, price INT);
mysql> INSERT INTO t VALUES(3, 50);
mysql> CREATE VIEW v AS SELECT qty, price, qty*price AS value FROM t;
mysql> SELECT * FROM v;
+------+-------+-------+
| qty  | price | value |
+------+-------+-------+
|    3 |    50 |   150 |
+------+-------+-------+
```

A view definition is subject to the following restrictions:

* The [`SELECT`](select.html "13.2.9 SELECT Statement") statement cannot refer to system variables or user-defined variables.

* Within a stored program, the [`SELECT`](select.html "13.2.9 SELECT Statement") statement cannot refer to program parameters or local variables.

* The [`SELECT`](select.html "13.2.9 SELECT Statement") statement cannot refer to prepared statement parameters.

* Any table or view referred to in the definition must exist. If, after the view has been created, a table or view that the definition refers to is dropped, use of the view results in an error. To check a view definition for problems of this kind, use the [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") statement.

* The definition cannot refer to a `TEMPORARY` table, and you cannot create a `TEMPORARY` view.

* You cannot associate a trigger with a view.
* Aliases for column names in the [`SELECT`](select.html "13.2.9 SELECT Statement") statement are checked against the maximum column length of 64 characters (not the maximum alias length of 256 characters).

`ORDER BY` is permitted in a view definition, but it is ignored if you select from a view using a statement that has its own `ORDER BY`.

For other options or clauses in the definition, they are added to the options or clauses of the statement that references the view, but the effect is undefined. For example, if a view definition includes a `LIMIT` clause, and you select from the view using a statement that has its own `LIMIT` clause, it is undefined which limit applies. This same principle applies to options such as `ALL`, `DISTINCT`, or `SQL_SMALL_RESULT` that follow the [`SELECT`](select.html "13.2.9 SELECT Statement") keyword, and to clauses such as `INTO`, `FOR UPDATE`, `LOCK IN SHARE MODE`, and `PROCEDURE`.

The results obtained from a view may be affected if you change the query processing environment by changing system variables:

```sql
mysql> CREATE VIEW v (mycol) AS SELECT 'abc';
Query OK, 0 rows affected (0.01 sec)

mysql> SET sql_mode = '';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT "mycol" FROM v;
+-------+
| mycol |
+-------+
| mycol |
+-------+
1 row in set (0.01 sec)

mysql> SET sql_mode = 'ANSI_QUOTES';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT "mycol" FROM v;
+-------+
| mycol |
+-------+
| abc   |
+-------+
1 row in set (0.00 sec)
```

The `DEFINER` and `SQL SECURITY` clauses determine which MySQL account to use when checking access privileges for the view when a statement is executed that references the view. The valid `SQL SECURITY` characteristic values are `DEFINER` (the default) and `INVOKER`. These indicate that the required privileges must be held by the user who defined or invoked the view, respectively.

If the `DEFINER` clause is present, the *`user`* value should be a MySQL account specified as `'user_name'@'host_name'`, [`CURRENT_USER`](information-functions.html#function_current-user), or [`CURRENT_USER()`](information-functions.html#function_current-user). The permitted *`user`* values depend on the privileges you hold, as discussed in [Section 23.6, “Stored Object Access Control”](stored-objects-security.html "23.6 Stored Object Access Control"). Also see that section for additional information about view security.

If the `DEFINER` clause is omitted, the default definer is the user who executes the [`CREATE VIEW`](create-view.html "13.1.21 CREATE VIEW Statement") statement. This is the same as specifying `DEFINER = CURRENT_USER` explicitly.

Within a view definition, the [`CURRENT_USER`](information-functions.html#function_current-user) function returns the view's `DEFINER` value by default. For views defined with the `SQL SECURITY INVOKER` characteristic, [`CURRENT_USER`](information-functions.html#function_current-user) returns the account for the view's invoker. For information about user auditing within views, see [Section 6.2.18, “SQL-Based Account Activity Auditing”](account-activity-auditing.html "6.2.18 SQL-Based Account Activity Auditing").

Within a stored routine that is defined with the `SQL SECURITY DEFINER` characteristic, [`CURRENT_USER`](information-functions.html#function_current-user) returns the routine's `DEFINER` value. This also affects a view defined within such a routine, if the view definition contains a `DEFINER` value of [`CURRENT_USER`](information-functions.html#function_current-user).

MySQL checks view privileges like this:

* At view definition time, the view creator must have the privileges needed to use the top-level objects accessed by the view. For example, if the view definition refers to table columns, the creator must have some privilege for each column in the select list of the definition, and the [`SELECT`](privileges-provided.html#priv_select) privilege for each column used elsewhere in the definition. If the definition refers to a stored function, only the privileges needed to invoke the function can be checked. The privileges required at function invocation time can be checked only as it executes: For different invocations, different execution paths within the function might be taken.

* The user who references a view must have appropriate privileges to access it ([`SELECT`](privileges-provided.html#priv_select) to select from it, [`INSERT`](privileges-provided.html#priv_insert) to insert into it, and so forth.)

* When a view has been referenced, privileges for objects accessed by the view are checked against the privileges held by the view `DEFINER` account or invoker, depending on whether the `SQL SECURITY` characteristic is `DEFINER` or `INVOKER`, respectively.

* If reference to a view causes execution of a stored function, privilege checking for statements executed within the function depend on whether the function `SQL SECURITY` characteristic is `DEFINER` or `INVOKER`. If the security characteristic is `DEFINER`, the function runs with the privileges of the `DEFINER` account. If the characteristic is `INVOKER`, the function runs with the privileges determined by the view's `SQL SECURITY` characteristic.

Example: A view might depend on a stored function, and that function might invoke other stored routines. For example, the following view invokes a stored function `f()`:

```sql
CREATE VIEW v AS SELECT * FROM t WHERE t.id = f(t.name);
```

Suppose that `f()` contains a statement such as this:

```sql
IF name IS NULL then
  CALL p1();
ELSE
  CALL p2();
END IF;
```

The privileges required for executing statements within `f()` need to be checked when `f()` executes. This might mean that privileges are needed for `p1()` or `p2()`, depending on the execution path within `f()`. Those privileges must be checked at runtime, and the user who must possess the privileges is determined by the `SQL SECURITY` values of the view `v` and the function `f()`.

The `DEFINER` and `SQL SECURITY` clauses for views are extensions to standard SQL. In standard SQL, views are handled using the rules for `SQL SECURITY DEFINER`. The standard says that the definer of the view, which is the same as the owner of the view's schema, gets applicable privileges on the view (for example, [`SELECT`](privileges-provided.html#priv_select)) and may grant them. MySQL has no concept of a schema “owner”, so MySQL adds a clause to identify the definer. The `DEFINER` clause is an extension where the intent is to have what the standard has; that is, a permanent record of who defined the view. This is why the default `DEFINER` value is the account of the view creator.

The optional `ALGORITHM` clause is a MySQL extension to standard SQL. It affects how MySQL processes the view. `ALGORITHM` takes three values: `MERGE`, `TEMPTABLE`, or `UNDEFINED`. For more information, see [Section 23.5.2, “View Processing Algorithms”](view-algorithms.html "23.5.2 View Processing Algorithms"), as well as [Section 8.2.2.4, “Optimizing Derived Tables and View References with Merging or Materialization”](derived-table-optimization.html "8.2.2.4 Optimizing Derived Tables and View References with Merging or Materialization").

Some views are updatable. That is, you can use them in statements such as [`UPDATE`](update.html "13.2.11 UPDATE Statement"), [`DELETE`](delete.html "13.2.2 DELETE Statement"), or [`INSERT`](insert.html "13.2.5 INSERT Statement") to update the contents of the underlying table. For a view to be updatable, there must be a one-to-one relationship between the rows in the view and the rows in the underlying table. There are also certain other constructs that make a view nonupdatable.

A generated column in a view is considered updatable because it is possible to assign to it. However, if such a column is updated explicitly, the only permitted value is `DEFAULT`. For information about generated columns, see [Section 13.1.18.7, “CREATE TABLE and Generated Columns”](create-table-generated-columns.html "13.1.18.7 CREATE TABLE and Generated Columns").

The `WITH CHECK OPTION` clause can be given for an updatable view to prevent inserts or updates to rows except those for which the `WHERE` clause in the *`select_statement`* is true.

In a `WITH CHECK OPTION` clause for an updatable view, the `LOCAL` and `CASCADED` keywords determine the scope of check testing when the view is defined in terms of another view. The `LOCAL` keyword restricts the `CHECK OPTION` only to the view being defined. `CASCADED` causes the checks for underlying views to be evaluated as well. When neither keyword is given, the default is `CASCADED`.

For more information about updatable views and the `WITH CHECK OPTION` clause, see [Section 23.5.3, “Updatable and Insertable Views”](view-updatability.html "23.5.3 Updatable and Insertable Views"), and [Section 23.5.4, “The View WITH CHECK OPTION Clause”](view-check-option.html "23.5.4 The View WITH CHECK OPTION Clause").

Views created before MySQL 5.7.3 containing `ORDER BY integer` can result in errors at view evaluation time. Consider these view definitions, which use `ORDER BY` with an ordinal number:

```sql
CREATE VIEW v1 AS SELECT x, y, z FROM t ORDER BY 2;
CREATE VIEW v2 AS SELECT x, 1, z FROM t ORDER BY 2;
```

In the first case, `ORDER BY 2` refers to a named column `y`. In the second case, it refers to a constant 1. For queries that select from either view fewer than 2 columns (the number named in the `ORDER BY` clause), an error occurs if the server evaluates the view using the MERGE algorithm. Examples:

```sql
mysql> SELECT x FROM v1;
ERROR 1054 (42S22): Unknown column '2' in 'order clause'
mysql> SELECT x FROM v2;
ERROR 1054 (42S22): Unknown column '2' in 'order clause'
```

As of MySQL 5.7.3, to handle view definitions like this, the server writes them differently into the `.frm` file that stores the view definition. This difference is visible with [`SHOW CREATE VIEW`](show-create-view.html "13.7.5.13 SHOW CREATE VIEW Statement"). Previously, the `.frm` file contained this for the `ORDER BY 2` clause:

```sql
For v1: ORDER BY 2
For v2: ORDER BY 2
```

As of 5.7.3, the `.frm` file contains this:

```sql
For v1: ORDER BY `t`.`y`
For v2: ORDER BY ''
```

That is, for `v1`, 2 is replaced by a reference to the name of the column referred to. For `v2`, 2 is replaced by a constant string expression (ordering by a constant has no effect, so ordering by any constant works).

If you experience view-evaluation errors such as just described, drop and recreate the view so that the `.frm` file contains the updated view representation. Alternatively, for views like `v2` that order by a constant value, drop and recreate the view with no `ORDER BY` clause.
