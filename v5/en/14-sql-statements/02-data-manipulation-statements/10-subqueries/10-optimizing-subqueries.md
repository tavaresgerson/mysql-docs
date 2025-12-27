#### 13.2.10.10 Optimizing Subqueries

Development is ongoing, so no optimization tip is reliable for the long term. The following list provides some interesting tricks that you might want to play with. See also [Section 8.2.2, “Optimizing Subqueries, Derived Tables, and View References”](subquery-optimization.html "8.2.2 Optimizing Subqueries, Derived Tables, and View References").

* Use subquery clauses that affect the number or order of the rows in the subquery. For example:

  ```sql
  SELECT * FROM t1 WHERE t1.column1 IN
    (SELECT column1 FROM t2 ORDER BY column1);
  SELECT * FROM t1 WHERE t1.column1 IN
    (SELECT DISTINCT column1 FROM t2);
  SELECT * FROM t1 WHERE EXISTS
    (SELECT * FROM t2 LIMIT 1);
  ```

* Replace a join with a subquery. For example, try this:

  ```sql
  SELECT DISTINCT column1 FROM t1 WHERE t1.column1 IN (
    SELECT column1 FROM t2);
  ```

  Instead of this:

  ```sql
  SELECT DISTINCT t1.column1 FROM t1, t2
    WHERE t1.column1 = t2.column1;
  ```

* Some subqueries can be transformed to joins for compatibility with older versions of MySQL that do not support subqueries. However, in some cases, converting a subquery to a join may improve performance. See [Section 13.2.10.11, “Rewriting Subqueries as Joins”](rewriting-subqueries.html "13.2.10.11 Rewriting Subqueries as Joins").

* Move clauses from outside to inside the subquery. For example, use this query:

  ```sql
  SELECT * FROM t1
    WHERE s1 IN (SELECT s1 FROM t1 UNION ALL SELECT s1 FROM t2);
  ```

  Instead of this query:

  ```sql
  SELECT * FROM t1
    WHERE s1 IN (SELECT s1 FROM t1) OR s1 IN (SELECT s1 FROM t2);
  ```

  For another example, use this query:

  ```sql
  SELECT (SELECT column1 + 5 FROM t1) FROM t2;
  ```

  Instead of this query:

  ```sql
  SELECT (SELECT column1 FROM t1) + 5 FROM t2;
  ```

* Use a row subquery instead of a correlated subquery. For example, use this query:

  ```sql
  SELECT * FROM t1
    WHERE (column1,column2) IN (SELECT column1,column2 FROM t2);
  ```

  Instead of this query:

  ```sql
  SELECT * FROM t1
    WHERE EXISTS (SELECT * FROM t2 WHERE t2.column1=t1.column1
                  AND t2.column2=t1.column2);
  ```

* Use `NOT (a = ANY (...))` rather than `a <> ALL (...)`.

* Use `x = ANY (table containing (1,2))` rather than `x=1 OR x=2`.

* Use `= ANY` rather than `EXISTS`.

* For uncorrelated subqueries that always return one row, `IN` is always slower than `=`. For example, use this query:

  ```sql
  SELECT * FROM t1
    WHERE t1.col_name = (SELECT a FROM t2 WHERE b = some_const);
  ```

  Instead of this query:

  ```sql
  SELECT * FROM t1
    WHERE t1.col_name IN (SELECT a FROM t2 WHERE b = some_const);
  ```

These tricks might cause programs to go faster or slower. Using MySQL facilities like the [`BENCHMARK()`](information-functions.html#function_benchmark) function, you can get an idea about what helps in your own situation. See [Section 12.15, “Information Functions”](information-functions.html "12.15 Information Functions").

Some optimizations that MySQL itself makes are:

* MySQL executes uncorrelated subqueries only once. Use [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") to make sure that a given subquery really is uncorrelated.

* MySQL rewrites `IN`, `ALL`, `ANY`, and `SOME` subqueries in an attempt to take advantage of the possibility that the select-list columns in the subquery are indexed.

* MySQL replaces subqueries of the following form with an index-lookup function, which [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") describes as a special join type ([`unique_subquery`](explain-output.html#jointype_unique_subquery) or [`index_subquery`](explain-output.html#jointype_index_subquery)):

  ```sql
  ... IN (SELECT indexed_column FROM single_table ...)
  ```

* MySQL enhances expressions of the following form with an expression involving [`MIN()`](aggregate-functions.html#function_min) or [`MAX()`](aggregate-functions.html#function_max), unless `NULL` values or empty sets are involved:

  ```sql
  value {ALL|ANY|SOME} {> | < | >= | <=} (uncorrelated subquery)
  ```

  For example, this `WHERE` clause:

  ```sql
  WHERE 5 > ALL (SELECT x FROM t)
  ```

  might be treated by the optimizer like this:

  ```sql
  WHERE 5 > (SELECT MAX(x) FROM t)
  ```

See also [MySQL Internals: How MySQL Transforms Subqueries](/doc/internals/en/transformations.html).
