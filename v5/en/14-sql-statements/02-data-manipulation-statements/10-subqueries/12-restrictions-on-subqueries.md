#### 13.2.10.12 Restrictions on Subqueries

* In general, you cannot modify a table and select from the same table in a subquery. For example, this limitation applies to statements of the following forms:

  ```sql
  DELETE FROM t WHERE ... (SELECT ... FROM t ...);
  UPDATE t ... WHERE col = (SELECT ... FROM t ...);
  {INSERT|REPLACE} INTO t (SELECT ... FROM t ...);
  ```

  Exception: The preceding prohibition does not apply if for the modified table you are using a derived table and that derived table is materialized rather than merged into the outer query. (See [Section 8.2.2.4, “Optimizing Derived Tables and View References with Merging or Materialization”](derived-table-optimization.html "8.2.2.4 Optimizing Derived Tables and View References with Merging or Materialization").) Example:

  ```sql
  UPDATE t ... WHERE col = (SELECT * FROM (SELECT ... FROM t...) AS dt ...);
  ```

  Here the result from the derived table is materialized as a temporary table, so the relevant rows in `t` have already been selected by the time the update to `t` takes place.

* Row comparison operations are only partially supported:

  + For `expr [NOT] IN subquery`, *`expr`* can be an *`n`*-tuple (specified using row constructor syntax) and the subquery can return rows of *`n`*-tuples. The permitted syntax is therefore more specifically expressed as `row_constructor [NOT] IN table_subquery`

  + For `expr op {ALL|ANY|SOME} subquery`, *`expr`* must be a scalar value and the subquery must be a column subquery; it cannot return multiple-column rows.

  In other words, for a subquery that returns rows of *`n`*-tuples, this is supported:

  ```sql
  (expr_1, ..., expr_n) [NOT] IN table_subquery
  ```

  But this is not supported:

  ```sql
  (expr_1, ..., expr_n) op {ALL|ANY|SOME} subquery
  ```

  The reason for supporting row comparisons for `IN` but not for the others is that `IN` is implemented by rewriting it as a sequence of [`=`](comparison-operators.html#operator_equal) comparisons and [`AND`](logical-operators.html#operator_and) operations. This approach cannot be used for `ALL`, `ANY`, or `SOME`.

* Subqueries in the `FROM` clause cannot be correlated subqueries. They are materialized in whole (evaluated to produce a result set) during query execution, so they cannot be evaluated per row of the outer query. The optimizer delays materialization until the result is needed, which may permit materialization to be avoided. See [Section 8.2.2.4, “Optimizing Derived Tables and View References with Merging or Materialization”](derived-table-optimization.html "8.2.2.4 Optimizing Derived Tables and View References with Merging or Materialization").

* MySQL does not support `LIMIT` in subqueries for certain subquery operators:

  ```sql
  mysql> SELECT * FROM t1
         WHERE s1 IN (SELECT s2 FROM t2 ORDER BY s1 LIMIT 1);
  ERROR 1235 (42000): This version of MySQL does not yet support
   'LIMIT & IN/ALL/ANY/SOME subquery'
  ```

* MySQL permits a subquery to refer to a stored function that has data-modifying side effects such as inserting rows into a table. For example, if `f()` inserts rows, the following query can modify data:

  ```sql
  SELECT ... WHERE x IN (SELECT f() ...);
  ```

  This behavior is an extension to the SQL standard. In MySQL, it can produce nondeterministic results because `f()` might be executed a different number of times for different executions of a given query depending on how the optimizer chooses to handle it.

  For statement-based or mixed-format replication, one implication of this indeterminism is that such a query can produce different results on the source and its replicas.
