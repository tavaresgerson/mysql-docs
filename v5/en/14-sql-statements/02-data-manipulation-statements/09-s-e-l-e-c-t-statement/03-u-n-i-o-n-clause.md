#### 13.2.9.3 UNION Clause

```sql
SELECT ...
UNION [ALL | DISTINCT] SELECT ...
[UNION [ALL | DISTINCT] SELECT ...]
```

[`UNION`](union.html "13.2.9.3 UNION Clause") combines the result from multiple [`SELECT`](select.html "13.2.9 SELECT Statement") statements into a single result set. Example:

```sql
mysql> SELECT 1, 2;
+---+---+
| 1 | 2 |
+---+---+
| 1 | 2 |
+---+---+
mysql> SELECT 'a', 'b';
+---+---+
| a | b |
+---+---+
| a | b |
+---+---+
mysql> SELECT 1, 2 UNION SELECT 'a', 'b';
+---+---+
| 1 | 2 |
+---+---+
| 1 | 2 |
| a | b |
+---+---+
```

* [Result Set Column Names and Data Types](union.html#union-result-set "Result Set Column Names and Data Types")
* [UNION DISTINCT and UNION ALL](union.html#union-distinct-all "UNION DISTINCT and UNION ALL")
* [ORDER BY and LIMIT in Unions](union.html#union-order-by-limit "ORDER BY and LIMIT in Unions")
* [UNION Restrictions](union.html#union-restrictions "UNION Restrictions")

##### Result Set Column Names and Data Types

The column names for a [`UNION`](union.html "13.2.9.3 UNION Clause") result set are taken from the column names of the first [`SELECT`](select.html "13.2.9 SELECT Statement") statement.

Selected columns listed in corresponding positions of each [`SELECT`](select.html "13.2.9 SELECT Statement") statement should have the same data type. For example, the first column selected by the first statement should have the same type as the first column selected by the other statements. If the data types of corresponding [`SELECT`](select.html "13.2.9 SELECT Statement") columns do not match, the types and lengths of the columns in the [`UNION`](union.html "13.2.9.3 UNION Clause") result take into account the values retrieved by all the [`SELECT`](select.html "13.2.9 SELECT Statement") statements. For example, consider the following, where the column length is not constrained to the length of the value from the first [`SELECT`](select.html "13.2.9 SELECT Statement"):

```sql
mysql> SELECT REPEAT('a',1) UNION SELECT REPEAT('b',20);
+----------------------+
| REPEAT('a',1)        |
+----------------------+
| a                    |
| bbbbbbbbbbbbbbbbbbbb |
+----------------------+
```

##### UNION DISTINCT and UNION ALL

By default, duplicate rows are removed from [`UNION`](union.html "13.2.9.3 UNION Clause") results. The optional `DISTINCT` keyword has the same effect but makes it explicit. With the optional `ALL` keyword, duplicate-row removal does not occur and the result includes all matching rows from all the [`SELECT`](select.html "13.2.9 SELECT Statement") statements.

You can mix [`UNION ALL`](union.html "13.2.9.3 UNION Clause") and [`UNION DISTINCT`](union.html "13.2.9.3 UNION Clause") in the same query. Mixed [`UNION`](union.html "13.2.9.3 UNION Clause") types are treated such that a `DISTINCT` union overrides any `ALL` union to its left. A `DISTINCT` union can be produced explicitly by using [`UNION DISTINCT`](union.html "13.2.9.3 UNION Clause") or implicitly by using [`UNION`](union.html "13.2.9.3 UNION Clause") with no following `DISTINCT` or `ALL` keyword.

##### ORDER BY and LIMIT in Unions

To apply an `ORDER BY` or `LIMIT` clause to an individual [`SELECT`](select.html "13.2.9 SELECT Statement"), parenthesize the [`SELECT`](select.html "13.2.9 SELECT Statement") and place the clause inside the parentheses:

```sql
(SELECT a FROM t1 WHERE a=10 AND B=1 ORDER BY a LIMIT 10)
UNION
(SELECT a FROM t2 WHERE a=11 AND B=2 ORDER BY a LIMIT 10);
```

Note

Previous versions of MySQL may permit such statements without parentheses. In MySQL 5.7, the requirement for parentheses is enforced.

Use of `ORDER BY` for individual [`SELECT`](select.html "13.2.9 SELECT Statement") statements implies nothing about the order in which the rows appear in the final result because [`UNION`](union.html "13.2.9.3 UNION Clause") by default produces an unordered set of rows. Therefore, `ORDER BY` in this context typically is used in conjunction with `LIMIT`, to determine the subset of the selected rows to retrieve for the [`SELECT`](select.html "13.2.9 SELECT Statement"), even though it does not necessarily affect the order of those rows in the final [`UNION`](union.html "13.2.9.3 UNION Clause") result. If `ORDER BY` appears without `LIMIT` in a [`SELECT`](select.html "13.2.9 SELECT Statement"), it is optimized away because it has no effect.

To use an `ORDER BY` or `LIMIT` clause to sort or limit the entire [`UNION`](union.html "13.2.9.3 UNION Clause") result, parenthesize the individual [`SELECT`](select.html "13.2.9 SELECT Statement") statements and place the `ORDER BY` or `LIMIT` after the last one:

```sql
(SELECT a FROM t1 WHERE a=10 AND B=1)
UNION
(SELECT a FROM t2 WHERE a=11 AND B=2)
ORDER BY a LIMIT 10;
```

A statement without parentheses is equivalent to one parenthesized as just shown.

This kind of `ORDER BY` cannot use column references that include a table name (that is, names in *`tbl_name`*.*`col_name`* format). Instead, provide a column alias in the first [`SELECT`](select.html "13.2.9 SELECT Statement") statement and refer to the alias in the `ORDER BY`. (Alternatively, refer to the column in the `ORDER BY` using its column position. However, use of column positions is deprecated.)

Also, if a column to be sorted is aliased, the `ORDER BY` clause *must* refer to the alias, not the column name. The first of the following statements is permitted, but the second fails with an `Unknown column 'a' in 'order clause'` error:

```sql
(SELECT a AS b FROM t) UNION (SELECT ...) ORDER BY b;
(SELECT a AS b FROM t) UNION (SELECT ...) ORDER BY a;
```

To cause rows in a [`UNION`](union.html "13.2.9.3 UNION Clause") result to consist of the sets of rows retrieved by each [`SELECT`](select.html "13.2.9 SELECT Statement") one after the other, select an additional column in each [`SELECT`](select.html "13.2.9 SELECT Statement") to use as a sort column and add an `ORDER BY` that sorts on that column following the last [`SELECT`](select.html "13.2.9 SELECT Statement"):

```sql
(SELECT 1 AS sort_col, col1a, col1b, ... FROM t1)
UNION
(SELECT 2, col2a, col2b, ... FROM t2) ORDER BY sort_col;
```

To additionally maintain sort order within individual [`SELECT`](select.html "13.2.9 SELECT Statement") results, add a secondary column to the `ORDER BY` clause:

```sql
(SELECT 1 AS sort_col, col1a, col1b, ... FROM t1)
UNION
(SELECT 2, col2a, col2b, ... FROM t2) ORDER BY sort_col, col1a;
```

Use of an additional column also enables you to determine which [`SELECT`](select.html "13.2.9 SELECT Statement") each row comes from. Extra columns can provide other identifying information as well, such as a string that indicates a table name.

[`UNION`](union.html "13.2.9.3 UNION Clause") queries with an aggregate function in an `ORDER BY` clause are rejected with an [`ER_AGGREGATE_ORDER_FOR_UNION`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_aggregate_order_for_union) error. Example:

```sql
SELECT 1 AS foo UNION SELECT 2 ORDER BY MAX(1);
```

##### UNION Restrictions

In a [`UNION`](union.html "13.2.9.3 UNION Clause"), the [`SELECT`](select.html "13.2.9 SELECT Statement") statements are normal select statements, but with the following restrictions:

* `HIGH_PRIORITY` in the first [`SELECT`](select.html "13.2.9 SELECT Statement") has no effect. `HIGH_PRIORITY` in any subsequent [`SELECT`](select.html "13.2.9 SELECT Statement") produces a syntax error.

* Only the last [`SELECT`](select.html "13.2.9 SELECT Statement") statement can use an `INTO` clause. However, the entire [`UNION`](union.html "13.2.9.3 UNION Clause") result is written to the `INTO` output destination.
