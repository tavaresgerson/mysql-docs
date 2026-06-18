### 10.2.2 Optimizing Subqueries, Derived Tables, View References, and Common Table Expressions

[10.2.2.1 Optimizing IN and EXISTS Subquery Predicates with Semijoin and Antijoin Transformations](semijoins-antijoins.html)

[10.2.2.2 Optimizing Subqueries with Materialization](subquery-materialization.html)

[10.2.2.3 Optimizing Subqueries with the EXISTS Strategy](subquery-optimization-with-exists.html)

[10.2.2.4 Optimizing Derived Tables, View References, and Common Table Expressions with Merging or Materialization](derived-table-optimization.html)

[10.2.2.5 Derived Condition Pushdown Optimization](derived-condition-pushdown-optimization.html)

[10.2.2.6 Optimizing ANY and ALL Subqueries](optimizing-any-all-subqueries.html)

The MySQL query optimizer has different strategies available to
evaluate subqueries:

* For a subquery used with an `IN`,
  `= ANY`, or `EXISTS`
  predicate, the optimizer has these choices:

  + Semijoin
  + Materialization
  + `EXISTS` strategy
* For a subquery used with a `NOT IN`,
  `<> ALL` or `NOT
  EXISTS` predicate, the optimizer has these choices:

  + Materialization
  + `EXISTS` strategy

For a derived table, the optimizer has these choices (which also
apply to view references and common table expressions):

* Merge the derived table into the outer query block
* Materialize the derived table to an internal temporary table

The following discussion provides more information about the
preceding optimization strategies.

Note

A limitation on [`UPDATE`](update.html "15.2.17 UPDATE Statement") and
[`DELETE`](delete.html "15.2.2 DELETE Statement") statements that use a
subquery to modify a single table is that the optimizer does
not use semijoin or materialization subquery optimizations. As
a workaround, try rewriting them as multiple-table
[`UPDATE`](update.html "15.2.17 UPDATE Statement") and
[`DELETE`](delete.html "15.2.2 DELETE Statement") statements that use a
join rather than a subquery.