#### 10.2.2.6 Optimizing ANY and ALL Subqueries

MySQL 9.5 supports transformation of general quantified comparison predicates to semijoins or antijoins. This includes all `=`, `<>`, `>`, `>=`, `<`, `<=` comparisons with `ANY` or `ALL`.

Transformations to derived tables of such comparisons are supported in both the `SELECT` clause and the `WHERE` clause of the outer query.

(A quantified comparison operator such as `ANY`, `ALL`, or `SOME` compares a value to a set of values. `= ANY` is equivalent to `IN`; `<> ALL` is equivalent to `NOT IN`. See Section 15.2.15.3, “Subqueries with ANY, IN, or SOME”, and Section 15.2.15.4, “Subqueries with ALL”, for more information.)

A subquery which qualifies for the transformation is converted to a derived table as follows:

* For `=ANY` and `<>ALL` predicates:

  1. The subquery is converted into a derived table.
  2. The selected expression from the subquery is converted from *`expr`* to `MIN(expr)` or `MAX(expr)`, depending on the actual predicate.

  3. Select `COUNT(*)` from the subquery.

  4. Select the number of distinct non-null values.
* For other predicates:

  1. The subquery is converted into a derived table.
  2. The selected expression from the subquery is selected from the derived table.

  3. Unless the selected expression is distinct, duplicate elimination is performed.

  4. If the selected expression is nullable, and processing of nulls is necessary, select an indication of whether the subquery contains any nulls.

Note

When the `semijoin` optimizer switch is enabled, that switch takes precedence over `subquery_to_derived` for those queries where either transform is possible.

The outer query block must contain at least one table, and may not contain more than 60 tables.

The quantified comparison predicate must be placed in the `WHERE` clause or the `SELECT` list of the outer query; it cannot be in a `JOIN` clause, a `GROUP BY` clause, a `HAVING` clause, an `ORDER BY` clause, a `QUANTIFY` clause, or a window specification's `ORDER BY` or `PARTITION BY` clause.

The inner query block may contain outer references inside an equality clause in the supported condition, but must be the single predicate of the condition, or be combined with other predicates and conditions with enclosing `AND` operators.

A `<>ALL` or `=ANY` predicate, when placed in the `SELECT` list of the outer query, must not contain any nullable expressions in the left-hand expression or in the selected expression or expressions of the subquery.

A `<>ALL` predicate, when placed in the `WHERE` clause of the outer query, must not contain any nullable expressions in the left-hand expression or in the selected expression or expressions of the subquery.

The query expression for the subquery cannot contain any of the following:

* A set operation (any of `UNION`, `INTERSECT`, or `EXCEPT`).

* An explicit grouping, except when the resolver is able to eliminate grouping.

* Any implicit grouping.
* A `WINDOW` clause.

The inner query block must also reference at least one table, and may contain outer references inside an equality clause in the supported condition. It must be the single predicate of the condition, or be combined with other predicates and conditions with enclosing `AND` operators.

Note

The transformation cannot be applied to a query having a `SELECT` list with a quantified comparison predicate when it also employs a window function referencing the same predicate.
