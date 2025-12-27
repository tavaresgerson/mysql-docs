#### 15.2.15.7 Correlated Subqueries

A *correlated subquery* is a subquery that contains a reference to a table that also appears in the outer query. For example:

```
SELECT * FROM t1
  WHERE column1 = ANY (SELECT column1 FROM t2
                       WHERE t2.column2 = t1.column2);
```

Notice that the subquery contains a reference to a column of `t1`, even though the subquery's `FROM` clause does not mention a table `t1`. So, MySQL looks outside the subquery, and finds `t1` in the outer query.

Suppose that table `t1` contains a row where `column1 = 5` and `column2 = 6`; meanwhile, table `t2` contains a row where `column1 = 5` and `column2 = 7`. The simple expression `... WHERE column1 = ANY (SELECT column1 FROM t2)` would be `TRUE`, but in this example, the `WHERE` clause within the subquery is `FALSE` (because `(5,6)` is not equal to `(5,7)`), so the expression as a whole is `FALSE`.

**Scoping rule:** MySQL evaluates from inside to outside. For example:

```
SELECT column1 FROM t1 AS x
  WHERE x.column1 = (SELECT column1 FROM t2 AS x
    WHERE x.column1 = (SELECT column1 FROM t3
      WHERE x.column2 = t3.column1));
```

In this statement, `x.column2` must be a column in table `t2` because `SELECT column1 FROM t2 AS x ...` renames `t2`. It is not a column in table `t1` because `SELECT column1 FROM t1 ...` is an outer query that is *farther out*.

The optimizer can transform a correlated scalar subquery to a derived table when the `subquery_to_derived` flag of the `optimizer_switch` variable is enabled. Consider the query shown here:

```
SELECT * FROM t1
    WHERE ( SELECT a FROM t2
              WHERE t2.a=t1.a ) > 0;
```

To avoid materializing several times for a given derived table, we can instead materialize—once—a derived table which adds a grouping on the join column from the table referenced in the inner query (`t2.a`) and then an outer join on the lifted predicate (`t1.a = derived.a`) in order to select the correct group to match up with the outer row. (If the subquery already has an explicit grouping, the extra grouping is added to the end of the grouping list.) The query previously shown can thus be rewritten like this:

```
SELECT t1.* FROM t1
    LEFT OUTER JOIN
        (SELECT a, COUNT(*) AS ct FROM t2 GROUP BY a) AS derived
    ON  t1.a = derived.a
        AND
        REJECT_IF(
            (ct > 1),
            "ERROR 1242 (21000): Subquery returns more than 1 row"
            )
    WHERE derived.a > 0;
```

In the rewritten query, `REJECT_IF()` represents an internal function which tests a given condition (here, the comparison `ct > 1`) and raises a given error (in this case, `ER_SUBQUERY_NO_1_ROW`) if the condition is true. This reflects the cardinality check that the optimizer performs as part of evaluating the `JOIN` or `WHERE` clause, prior to evaluating any lifted predicate, which is done only if the subquery does not return more than one row.

This type of transformation can be performed, provided the following conditions are met:

* The subquery can be part of a `SELECT` list, `WHERE` condition, or `HAVING` condition, but cannot be part of a `JOIN` condition, and cannot contain an `OFFSET` clause. The subquery may contain `LIMIT 1` but no other `LIMIT` clause; it must use a literal `1`, and no other value, placeholder (`?`), or variable. In addition, the subquery cannot contain any set operations such as `UNION`.

* The `WHERE` clause may contain one or more predicates, combined with `AND`. If the `WHERE` clause contains an `OR` clause, it cannot be transformed. At least one of the `WHERE` clause predicates must be eligible for transformation, and none of them may reject transformation.

* To be eligible for transformation, a `WHERE` clause predicate must be an equality predicate; other comparison predicates are not eligible for transformation. The predicate must employ the equality operator `=` for making the comparison; the null-safe `<=>` operator is not supported in this context.

  Operands of can be column values, constants, and expressions using these, including deterministic functions called with column values as arguments.

* A `WHERE` clause predicate that contains only inner references is not eligible for transformation, since it can be evaluated before the grouping. A `WHERE` clause predicate that contains only outer references is eligible for transformation, even though it can be lifted up to the outer query block. This is made possible by adding a cardinality check without grouping in the derived table.

* To be eligible, a `WHERE` clause predicate must have one operand that contains only inner references and one operand that contains only outer references. If the predicate is not eligible due to this rule, transformation of the query is rejected.

* A correlated column can be present only in the subquery's `WHERE` clause (and not in the `SELECT` list, a `JOIN` or `ORDER BY` clause, a `GROUP BY` list, or a `HAVING` clause). Nor can there be any correlated column inside a derived table in the subquery's `FROM` list.

* A correlated column can not be contained in an aggregate function's list of arguments.

* A correlated column must be resolved in the query block directly containing the subquery being considered for transformation.

* A correlated column cannot be present in a nested scalar subquery in the `WHERE` clause.

* The subquery cannot contain any window functions, and must not contain any aggregate function which aggregates in a query block outer to the subquery. A `COUNT()` aggregate function, if contained in the `SELECT` list element of the subquery, must be at the topmost level, and cannot be part of an expression.

See also Section 15.2.15.8, “Derived Tables”.
