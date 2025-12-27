### 10.2.2 Optimizing Subqueries, Derived Tables, View References, and Common Table Expressions

The MySQL query optimizer has different strategies available to evaluate subqueries:

* For a subquery used with an `IN`, `= ANY`, or `EXISTS` predicate, the optimizer has these choices:

  + Semijoin
  + Materialization
  + `EXISTS` strategy
* For a subquery used with a `NOT IN`, `<> ALL` or `NOT EXISTS` predicate, the optimizer has these choices:

  + Materialization
  + `EXISTS` strategy

For a derived table, the optimizer has these choices (which also apply to view references and common table expressions):

* Merge the derived table into the outer query block
* Materialize the derived table to an internal temporary table

The following discussion provides more information about the preceding optimization strategies.

::: info Note

A limitation on  `UPDATE` and `DELETE` statements that use a subquery to modify a single table is that the optimizer does not use semijoin or materialization subquery optimizations. As a workaround, try rewriting them as multiple-table `UPDATE` and `DELETE` statements that use a join rather than a subquery.

:::
