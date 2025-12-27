### 8.2.2 Optimizing Subqueries, Derived Tables, and View References

8.2.2.1 Optimizing Subqueries, Derived Tables, and View References with Semijoin Transformations

8.2.2.2 Optimizing Subqueries with Materialization

8.2.2.3 Optimizing Subqueries with the EXISTS Strategy

8.2.2.4 Optimizing Derived Tables and View References with Merging or Materialization

The MySQL query optimizer has different strategies available to evaluate subqueries:

* For `IN` (or `=ANY`) subqueries, the optimizer has these choices:

  + Semijoin
  + Materialization
  + `EXISTS` strategy
* For `NOT IN` (or `<>ALL`) subqueries, the optimizer has these choices:

  + Materialization
  + `EXISTS` strategy

For derived tables, the optimizer has these choices (which also apply to view references):

* Merge the derived table into the outer query block
* Materialize the derived table to an internal temporary table

The following discussion provides more information about the preceding optimization strategies.

Note

A limitation on `UPDATE` and `DELETE` statements that use a subquery to modify a single table is that the optimizer does not use semijoin or materialization subquery optimizations. As a workaround, try rewriting them as multiple-table `UPDATE` and `DELETE` statements that use a join rather than a subquery.
