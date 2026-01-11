### 15.2.18 UNION Clause

```
query_expression_body UNION [ALL | DISTINCT] query_block
    [UNION [ALL | DISTINCT] query_expression_body]
    [...]

query_expression_body:
    See Section 15.2.14, “Set Operations with UNION, INTERSECT, and EXCEPT”
```

`UNION` combines the result from multiple query blocks into a single result set. This example uses `SELECT` statements:

```
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

#### UNION Handing in MySQL 8.0 Compared to MySQL 5.7

In MySQL 8.0, the parser rules for `SELECT` and `UNION` were refactored to be more consistent (the same `SELECT` syntax applies uniformly in each such context) and reduce duplication. Compared to MySQL 5.7, several user-visible effects resulted from this work, which may require rewriting of certain statements:

* `NATURAL JOIN` permits an optional `INNER` keyword (`NATURAL INNER JOIN`), in compliance with standard SQL.

* Right-deep joins without parentheses are permitted (for example, `... JOIN ... JOIN ... ON ... ON`), in compliance with standard SQL.

* `STRAIGHT_JOIN` now permits a `USING` clause, similar to other inner joins.

* The parser accepts parentheses around query expressions. For example, `(SELECT ... UNION SELECT ...)` is permitted. See also Section 15.2.11, “Parenthesized Query Expressions”.

* The parser better conforms to the documented permitted placement of the `SQL_CACHE` and `SQL_NO_CACHE` query modifiers.

* Left-hand nesting of unions, previously permitted only in subqueries, is now permitted in top-level statements. For example, this statement is now accepted as valid:

  ```
  (SELECT 1 UNION SELECT 1) UNION SELECT 1;
  ```

* Locking clauses (`FOR UPDATE`, `LOCK IN SHARE MODE`) are allowed only in non-`UNION` queries. This means that parentheses must be used for `SELECT` statements containing locking clauses. This statement is no longer accepted as valid:

  ```
  SELECT 1 FOR UPDATE UNION SELECT 1 FOR UPDATE;
  ```

  Instead, write the statement like this:

  ```
  (SELECT 1 FOR UPDATE) UNION (SELECT 1 FOR UPDATE);
  ```
