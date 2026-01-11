### 10.2.2 Optimizing Subqueries, Derived Tables, View References, and Common Table Expressions

10.2.2.1 Optimizing IN and EXISTS Subquery Predicates with Semijoin Transformations

10.2.2.2 Optimizing Subqueries with Materialization

10.2.2.3 Optimizing Subqueries with the EXISTS Strategy

10.2.2.4 Optimizing Derived Tables, View References, and Common Table Expressions with Merging or Materialization

10.2.2.5 Derived Condition Pushdown Optimization

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

Note

A limitation on `UPDATE` and `DELETE` statements that use a subquery to modify a single table is that the optimizer does not use semijoin or materialization subquery optimizations. As a workaround, try rewriting them as multiple-table `UPDATE` and `DELETE` statements that use a join rather than a subquery.
