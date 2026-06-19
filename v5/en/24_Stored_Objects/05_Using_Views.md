## 23.5 Using Views

MySQL supports views, including updatable views. Views are stored queries that when invoked produce a result set. A view acts as a virtual table.

The following discussion describes the syntax for creating and dropping views, and shows some examples of how to use them.

### Additional Resources

* You may find the [MySQL User Forums](https://forums.mysql.com/list.php?20) helpful when working with views.

* For answers to some commonly asked questions regarding views in MySQL, see Section A.6, “MySQL 5.7 FAQ: Views”.

* There are some restrictions on the use of views; see Section 23.9, “Restrictions on Views”.


### 23.5.1 View Syntax

The `CREATE VIEW` statement creates a new view (see Section 13.1.21, “CREATE VIEW Statement”). To alter the definition of a view or drop a view, use `ALTER VIEW` (see Section 13.1.10, “ALTER VIEW Statement”), or `DROP VIEW` (see Section 13.1.32, “DROP VIEW Statement”).

A view can be created from many kinds of `SELECT` statements. It can refer to base tables or other views. It can use joins, `UNION`, and subqueries. The `SELECT` need not even refer to any tables. The following example defines a view that selects two columns from another table, as well as an expression calculated from those columns:

```sql
mysql> CREATE TABLE t (qty INT, price INT);
mysql> INSERT INTO t VALUES(3, 50), (5, 60);
mysql> CREATE VIEW v AS SELECT qty, price, qty*price AS value FROM t;
mysql> SELECT * FROM v;
+------+-------+-------+
| qty  | price | value |
+------+-------+-------+
|    3 |    50 |   150 |
|    5 |    60 |   300 |
+------+-------+-------+
mysql> SELECT * FROM v WHERE qty = 5;
+------+-------+-------+
| qty  | price | value |
+------+-------+-------+
|    5 |    60 |   300 |
+------+-------+-------+
```


### 23.5.2 View Processing Algorithms

The optional `ALGORITHM` clause for `CREATE VIEW` or `ALTER VIEW` is a MySQL extension to standard SQL. It affects how MySQL processes the view. `ALGORITHM` takes three values: `MERGE`, `TEMPTABLE`, or `UNDEFINED`.

* For `MERGE`, the text of a statement that refers to the view and the view definition are merged such that parts of the view definition replace corresponding parts of the statement.

* For `TEMPTABLE`, the results from the view are retrieved into a temporary table, which then is used to execute the statement.

* For `UNDEFINED`, MySQL chooses which algorithm to use. It prefers `MERGE` over `TEMPTABLE` if possible, because `MERGE` is usually more efficient and because a view cannot be updated if a temporary table is used.

* If no `ALGORITHM` clause is present, the default algorithm is determined by the value of the `derived_merge` flag of the `optimizer_switch` system variable. For additional discussion, see Section 8.2.2.4, “Optimizing Derived Tables and View References with Merging or Materialization”.

A reason to specify `TEMPTABLE` explicitly is that locks can be released on underlying tables after the temporary table has been created and before it is used to finish processing the statement. This might result in quicker lock release than the `MERGE` algorithm so that other clients that use the view are not blocked as long.

A view algorithm can be `UNDEFINED` for three reasons:

* No `ALGORITHM` clause is present in the `CREATE VIEW` statement.

* The `CREATE VIEW` statement has an explicit `ALGORITHM = UNDEFINED` clause.

* `ALGORITHM = MERGE` is specified for a view that can be processed only with a temporary table. In this case, MySQL generates a warning and sets the algorithm to `UNDEFINED`.

As mentioned earlier, `MERGE` is handled by merging corresponding parts of a view definition into the statement that refers to the view. The following examples briefly illustrate how the `MERGE` algorithm works. The examples assume that there is a view `v_merge` that has this definition:

```sql
CREATE ALGORITHM = MERGE VIEW v_merge (vc1, vc2) AS
SELECT c1, c2 FROM t WHERE c3 > 100;
```

Example 1: Suppose that we issue this statement:

```sql
SELECT * FROM v_merge;
```

MySQL handles the statement as follows:

* `v_merge` becomes `t`
* `*` becomes `vc1, vc2`, which corresponds to `c1, c2`

* The view `WHERE` clause is added

The resulting statement to be executed becomes:

```sql
SELECT c1, c2 FROM t WHERE c3 > 100;
```

Example 2: Suppose that we issue this statement:

```sql
SELECT * FROM v_merge WHERE vc1 < 100;
```

This statement is handled similarly to the previous one, except that `vc1 < 100` becomes `c1 < 100` and the view `WHERE` clause is added to the statement `WHERE` clause using an `AND` connective (and parentheses are added to make sure the parts of the clause are executed with correct precedence). The resulting statement to be executed becomes:

```sql
SELECT c1, c2 FROM t WHERE (c3 > 100) AND (c1 < 100);
```

Effectively, the statement to be executed has a `WHERE` clause of this form:

```sql
WHERE (select WHERE) AND (view WHERE)
```

If the `MERGE` algorithm cannot be used, a temporary table must be used instead. Constructs that prevent merging are the same as those that prevent merging in derived tables. Examples are `SELECT DISTINCT` or `LIMIT` in the subquery. For details, see Section 8.2.2.4, “Optimizing Derived Tables and View References with Merging or Materialization”.


### 23.5.3 Updatable and Insertable Views

Some views are updatable and references to them can be used to specify tables to be updated in data change statements. That is, you can use them in statements such as `UPDATE`, `DELETE`, or `INSERT` to update the contents of the underlying table. Derived tables can also be specified in multiple-table `UPDATE` and `DELETE` statements, but can only be used for reading data to specify rows to be updated or deleted. Generally, the view references must be updatable, meaning that they may be merged and not materialized. Composite views have more complex rules.

For a view to be updatable, there must be a one-to-one relationship between the rows in the view and the rows in the underlying table. There are also certain other constructs that make a view nonupdatable. To be more specific, a view is not updatable if it contains any of the following:

* Aggregate functions (`SUM()`, `MIN()`, `MAX()`, `COUNT()`, and so forth)

* `DISTINCT`
* `GROUP BY`
* `HAVING`
* `UNION` or `UNION ALL`

* Subquery in the select list

  Before MySQL 5.7.11, subqueries in the select list fail for `INSERT`, but are okay for `UPDATE`, `DELETE`. As of MySQL 5.7.11, that is still true for nondependent subqueries. For dependent subqueries in the select list, no data change statements are permitted.

* Certain joins (see additional join discussion later in this section)

* Reference to nonupdatable view in the `FROM` clause

* Subquery in the `WHERE` clause that refers to a table in the `FROM` clause

* Refers only to literal values (in this case, there is no underlying table to update)

* `ALGORITHM = TEMPTABLE` (use of a temporary table always makes a view nonupdatable)

* Multiple references to any column of a base table (fails for `INSERT`, okay for `UPDATE`, `DELETE`)

A generated column in a view is considered updatable because it is possible to assign to it. However, if such a column is updated explicitly, the only permitted value is `DEFAULT`. For information about generated columns, see Section 13.1.18.7, “CREATE TABLE and Generated Columns”.

It is sometimes possible for a multiple-table view to be updatable, assuming that it can be processed with the `MERGE` algorithm. For this to work, the view must use an inner join (not an outer join or a `UNION`). Also, only a single table in the view definition can be updated, so the `SET` clause must name only columns from one of the tables in the view. Views that use `UNION ALL` are not permitted even though they might be theoretically updatable.

With respect to insertability (being updatable with `INSERT` statements), an updatable view is insertable if it also satisfies these additional requirements for the view columns:

* There must be no duplicate view column names.
* The view must contain all columns in the base table that do not have a default value.

* The view columns must be simple column references. They must not be expressions, such as these:

  ```sql
  3.14159
  col1 + 3
  UPPER(col2)
  col3 / col4
  (subquery)
  ```

MySQL sets a flag, called the view updatability flag, at `CREATE VIEW` time. The flag is set to `YES` (true) if `UPDATE` and `DELETE` (and similar operations) are legal for the view. Otherwise, the flag is set to `NO` (false). The `IS_UPDATABLE` column in the Information Schema `VIEWS` table displays the status of this flag.

If a view is not updatable, statements such `UPDATE`, `DELETE`, and `INSERT` are illegal and are rejected. (Even if a view is updatable, it might not be possible to insert into it, as described elsewhere in this section.)

The `IS_UPDATABLE` flag may be unreliable if a view depends on one or more other views, and one of these underlying views is updated. Regardless of the `IS_UPDATABLE` value, the server keeps track of the updatability of a view and correctly rejects data change operations to views that are not updatable. If the `IS_UPDATABLE` value for a view has become inaccurate to due to changes to underlying views, the value can be updated by deleting and re-creating the view.

The updatability of views may be affected by the value of the `updatable_views_with_limit` system variable. See Section 5.1.7, “Server System Variables”.

For the following discussion, suppose that these tables and views exist:

```sql
CREATE TABLE t1 (x INTEGER);
CREATE TABLE t2 (c INTEGER);
CREATE VIEW vmat AS SELECT SUM(x) AS s FROM t1;
CREATE VIEW vup AS SELECT * FROM t2;
CREATE VIEW vjoin AS SELECT * FROM vmat JOIN vup ON vmat.s=vup.c;
```

`INSERT`, `UPDATE`, and `DELETE` statements are permitted as follows:

* `INSERT`: The insert table of an `INSERT` statement may be a view reference that is merged. If the view is a join view, all components of the view must be updatable (not materialized). For a multiple-table updatable view, `INSERT` can work if it inserts into a single table.

  This statement is invalid because one component of the join view is nonupdatable:

  ```sql
  INSERT INTO vjoin (c) VALUES (1);
  ```

  This statement is valid; the view contains no materialized components:

  ```sql
  INSERT INTO vup (c) VALUES (1);
  ```

* `UPDATE`: The table or tables to be updated in an `UPDATE` statement may be view references that are merged. If a view is a join view, at least one component of the view must be updatable (this differs from `INSERT`).

  In a multiple-table `UPDATE` statement, the updated table references of the statement must be base tables or updatable view references. Nonupdated table references may be materialized views or derived tables.

  This statement is valid; column `c` is from the updatable part of the join view:

  ```sql
  UPDATE vjoin SET c=c+1;
  ```

  This statement is invalid; column `x` is from the nonupdatable part:

  ```sql
  UPDATE vjoin SET x=x+1;
  ```

  This statement is valid; the updated table reference of the multiple-table `UPDATE` is an updatable view (`vup`):

  ```sql
  UPDATE vup JOIN (SELECT SUM(x) AS s FROM t1) AS dt ON ...
  SET c=c+1;
  ```

  This statement is invalid; it tries to update a materialized derived table:

  ```sql
  UPDATE vup JOIN (SELECT SUM(x) AS s FROM t1) AS dt ON ...
  SET s=s+1;
  ```

* `DELETE`: The table or tables to be deleted from in a `DELETE` statement must be merged views. Join views are not allowed (this differs from `INSERT` and `UPDATE`).

  This statement is invalid because the view is a join view:

  ```sql
  DELETE vjoin WHERE ...;
  ```

  This statement is valid because the view is a merged (updatable) view:

  ```sql
  DELETE vup WHERE ...;
  ```

  This statement is valid because it deletes from a merged (updatable) view:

  ```sql
  DELETE vup FROM vup JOIN (SELECT SUM(x) AS s FROM t1) AS dt ON ...;
  ```

Additional discussion and examples follow.

Earlier discussion in this section pointed out that a view is not insertable if not all columns are simple column references (for example, if it contains columns that are expressions or composite expressions). Although such a view is not insertable, it can be updatable if you update only columns that are not expressions. Consider this view:

```sql
CREATE VIEW v AS SELECT col1, 1 AS col2 FROM t;
```

This view is not insertable because `col2` is an expression. But it is updatable if the update does not try to update `col2`. This update is permissible:

```sql
UPDATE v SET col1 = 0;
```

This update is not permissible because it attempts to update an expression column:

```sql
UPDATE v SET col2 = 0;
```

If a table contains an `AUTO_INCREMENT` column, inserting into an insertable view on the table that does not include the `AUTO_INCREMENT` column does not change the value of `LAST_INSERT_ID()`, because the side effects of inserting default values into columns not part of the view should not be visible.


### 23.5.4 The View WITH CHECK OPTION Clause

The `WITH CHECK OPTION` clause can be given for an updatable view to prevent inserts to rows for which the `WHERE` clause in the *`select_statement`* is not true. It also prevents updates to rows for which the `WHERE` clause is true but the update would cause it to be not true (in other words, it prevents visible rows from being updated to nonvisible rows).

In a `WITH CHECK OPTION` clause for an updatable view, the `LOCAL` and `CASCADED` keywords determine the scope of check testing when the view is defined in terms of another view. When neither keyword is given, the default is `CASCADED`.

Before MySQL 5.7.6, `WITH CHECK OPTION` testing works like this:

* With `LOCAL`, the view `WHERE` clause is checked, but no underlying views are checked.

* With `CASCADED`, the view `WHERE` clause is checked, then checking recurses to underlying views, adds `WITH CASCADED CHECK OPTION` to them (for purposes of the check; their definitions remain unchanged), and applies the same rules.

* With no check option, the view `WHERE` clause is not checked, and no underlying views are checked.

As of MySQL 5.7.6, `WITH CHECK OPTION` testing is standard-compliant (with changed semantics from previously for `LOCAL` and no check clause):

* With `LOCAL`, the view `WHERE` clause is checked, then checking recurses to underlying views and applies the same rules.

* With `CASCADED`, the view `WHERE` clause is checked, then checking recurses to underlying views, adds `WITH CASCADED CHECK OPTION` to them (for purposes of the check; their definitions remain unchanged), and applies the same rules.

* With no check option, the view `WHERE` clause is not checked, then checking recurses to underlying views, and applies the same rules.

Consider the definitions for the following table and set of views:

```sql
CREATE TABLE t1 (a INT);
CREATE VIEW v1 AS SELECT * FROM t1 WHERE a < 2
WITH CHECK OPTION;
CREATE VIEW v2 AS SELECT * FROM v1 WHERE a > 0
WITH LOCAL CHECK OPTION;
CREATE VIEW v3 AS SELECT * FROM v1 WHERE a > 0
WITH CASCADED CHECK OPTION;
```

Here the `v2` and `v3` views are defined in terms of another view, `v1`. Before MySQL 5.7.6, because `v2` has a `LOCAL` check option, inserts are tested only against the `v2` check. `v3` has a `CASCADED` check option, so inserts are tested not only against the `v3` check, but against those of underlying views. The following statements illustrate these differences:

```sql
mysql> INSERT INTO v2 VALUES (2);
Query OK, 1 row affected (0.00 sec)
mysql> INSERT INTO v3 VALUES (2);
ERROR 1369 (HY000): CHECK OPTION failed 'test.v3'
```

As of MySQL 5.7.6, the semantics for `LOCAL` differ from previously: Inserts for `v2` are checked against its `LOCAL` check option, then (unlike before 5.7.6), the check recurses to `v1` and the rules are applied again. The rules for `v1` cause a check failure. The check for `v3` fails as before:

```sql
mysql> INSERT INTO v2 VALUES (2);
ERROR 1369 (HY000): CHECK OPTION failed 'test.v2'
mysql> INSERT INTO v3 VALUES (2);
ERROR 1369 (HY000): CHECK OPTION failed 'test.v3'
```


### 23.5.5 View Metadata

To obtain metadata about views:

* Query the `VIEWS` table of the `INFORMATION_SCHEMA` database. See Section 24.3.31, “The INFORMATION\_SCHEMA VIEWS Table”.

* Use the `SHOW CREATE VIEW` statement. See Section 13.7.5.13, “SHOW CREATE VIEW Statement”.
