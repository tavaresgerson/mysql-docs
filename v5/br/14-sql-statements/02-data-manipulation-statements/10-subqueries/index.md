### 13.2.10 Subqueries

[13.2.10.1 The Subquery as Scalar Operand](scalar-subqueries.html)

[13.2.10.2 Comparisons Using Subqueries](comparisons-using-subqueries.html)

[13.2.10.3 Subqueries with ANY, IN, or SOME](any-in-some-subqueries.html)

[13.2.10.4 Subqueries with ALL](all-subqueries.html)

[13.2.10.5 Row Subqueries](row-subqueries.html)

[13.2.10.6 Subqueries with EXISTS or NOT EXISTS](exists-and-not-exists-subqueries.html)

[13.2.10.7 Correlated Subqueries](correlated-subqueries.html)

[13.2.10.8 Derived Tables](derived-tables.html)

[13.2.10.9 Subquery Errors](subquery-errors.html)

[13.2.10.10 Optimizing Subqueries](optimizing-subqueries.html)

[13.2.10.11 Rewriting Subqueries as Joins](rewriting-subqueries.html)

[13.2.10.12 Restrictions on Subqueries](subquery-restrictions.html)

A subquery is a [`SELECT`](select.html "13.2.9 SELECT Statement") statement within another statement.

All subquery forms and operations that the SQL standard requires are supported, as well as a few features that are MySQL-specific.

Here is an example of a subquery:

```sql
SELECT * FROM t1 WHERE column1 = (SELECT column1 FROM t2);
```

In this example, `SELECT * FROM t1 ...` is the *outer query* (or *outer statement*), and `(SELECT column1 FROM t2)` is the *subquery*. We say that the subquery is *nested* within the outer query, and in fact it is possible to nest subqueries within other subqueries, to a considerable depth. A subquery must always appear within parentheses.

The main advantages of subqueries are:

* They allow queries that are *structured* so that it is possible to isolate each part of a statement.

* They provide alternative ways to perform operations that would otherwise require complex joins and unions.

* Many people find subqueries more readable than complex joins or unions. Indeed, it was the innovation of subqueries that gave people the original idea of calling the early SQL “Structured Query Language.”

Here is an example statement that shows the major points about subquery syntax as specified by the SQL standard and supported in MySQL:

```sql
DELETE FROM t1
WHERE s11 > ANY
 (SELECT COUNT(*) /* no hint */ FROM t2
  WHERE NOT EXISTS
   (SELECT * FROM t3
    WHERE ROW(5*t2.s1,77)=
     (SELECT 50,11*s1 FROM t4 UNION SELECT 50,77 FROM
      (SELECT * FROM t5) AS t5)));
```

A subquery can return a scalar (a single value), a single row, a single column, or a table (one or more rows of one or more columns). These are called scalar, column, row, and table subqueries. Subqueries that return a particular kind of result often can be used only in certain contexts, as described in the following sections.

There are few restrictions on the type of statements in which subqueries can be used. A subquery can contain many of the keywords or clauses that an ordinary [`SELECT`](select.html "13.2.9 SELECT Statement") can contain: `DISTINCT`, `GROUP BY`, `ORDER BY`, `LIMIT`, joins, index hints, [`UNION`](union.html "13.2.9.3 UNION Clause") constructs, comments, functions, and so on.

A subquery's outer statement can be any one of: [`SELECT`](select.html "13.2.9 SELECT Statement"), [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement"), [`DELETE`](delete.html "13.2.2 DELETE Statement"), [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment"), or [`DO`](do.html "13.2.3 DO Statement").

In MySQL, you cannot modify a table and select from the same table in a subquery. This applies to statements such as [`DELETE`](delete.html "13.2.2 DELETE Statement"), [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`REPLACE`](replace.html "13.2.8 REPLACE Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement"), and (because subqueries can be used in the `SET` clause) [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement").

For information about how the optimizer handles subqueries, see [Section 8.2.2, “Optimizing Subqueries, Derived Tables, and View References”](subquery-optimization.html "8.2.2 Optimizing Subqueries, Derived Tables, and View References"). For a discussion of restrictions on subquery use, including performance issues for certain forms of subquery syntax, see [Section 13.2.10.12, “Restrictions on Subqueries”](subquery-restrictions.html "13.2.10.12 Restrictions on Subqueries").
