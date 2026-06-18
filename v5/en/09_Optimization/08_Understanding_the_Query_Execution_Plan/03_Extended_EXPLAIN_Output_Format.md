### 8.8.3 Extended EXPLAIN Output Format

For [`SELECT`](select.html "13.2.9 SELECT Statement") statements, the
[`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") statement produces extra
(“extended”) information that is not part of
[`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") output but can be viewed
by issuing a [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement")
statement following [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement"). The
`Message` value in [`SHOW
WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement") output displays how the optimizer qualifies
table and column names in the
[`SELECT`](select.html "13.2.9 SELECT Statement") statement, what the
[`SELECT`](select.html "13.2.9 SELECT Statement") looks like after the
application of rewriting and optimization rules, and possibly
other notes about the optimization process.

The extended information displayable with a
[`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement") statement following
[`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") is produced only for
[`SELECT`](select.html "13.2.9 SELECT Statement") statements.
[`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement") displays an empty
result for other explainable statements
([`DELETE`](delete.html "13.2.2 DELETE Statement"),
[`INSERT`](insert.html "13.2.5 INSERT Statement"),
[`REPLACE`](replace.html "13.2.8 REPLACE Statement"), and
[`UPDATE`](update.html "13.2.11 UPDATE Statement")).

Note

In older MySQL releases, extended information was produced
using [`EXPLAIN
EXTENDED`](explain.html "13.8.2 EXPLAIN Statement"). That syntax is still recognized for
backward compatibility but extended output is now enabled by
default, so the `EXTENDED` keyword is
superfluous and deprecated. Its use results in a warning;
expect it to be removed from
[`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") syntax in a future
MySQL release.

Here is an example of extended
[`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") output:

```sql
mysql> EXPLAIN
       SELECT t1.a, t1.a IN (SELECT t2.a FROM t2) FROM t1\G
*************************** 1. row ***************************
           id: 1
  select_type: PRIMARY
        table: t1
         type: index
possible_keys: NULL
          key: PRIMARY
      key_len: 4
          ref: NULL
         rows: 4
     filtered: 100.00
        Extra: Using index
*************************** 2. row ***************************
           id: 2
  select_type: SUBQUERY
        table: t2
         type: index
possible_keys: a
          key: a
      key_len: 5
          ref: NULL
         rows: 3
     filtered: 100.00
        Extra: Using index
2 rows in set, 1 warning (0.00 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1003
Message: /* select#1 */ select `test`.`t1`.`a` AS `a`,
         <in_optimizer>(`test`.`t1`.`a`,`test`.`t1`.`a` in
         ( <materialize> (/* select#2 */ select `test`.`t2`.`a`
         from `test`.`t2` where 1 having 1 ),
         <primary_index_lookup>(`test`.`t1`.`a` in
         <temporary table> on <auto_key>
         where ((`test`.`t1`.`a` = `materialized-subquery`.`a`))))) AS `t1.a
         IN (SELECT t2.a FROM t2)` from `test`.`t1`
1 row in set (0.00 sec)
```

Because the statement displayed by [`SHOW
WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement") may contain special markers to provide
information about query rewriting or optimizer actions, the
statement is not necessarily valid SQL and is not intended to be
executed. The output may also include rows with
`Message` values that provide additional
non-SQL explanatory notes about actions taken by the optimizer.

The following list describes special markers that can appear in
the extended output displayed by [`SHOW
WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement"):

* `<auto_key>`

  An automatically generated key for a temporary table.

* `<cache>(expr)`

  The expression (such as a scalar subquery) is executed once
  and the resulting value is saved in memory for later use.
  For results consisting of multiple values, a temporary table
  may be created and you might see `<temporary
  table>` instead.

* `<exists>(query
  fragment)`

  The subquery predicate is converted to an
  `EXISTS` predicate and the subquery is
  transformed so that it can be used together with the
  `EXISTS` predicate.

* `<in_optimizer>(query
  fragment)`

  This is an internal optimizer object with no user
  significance.

* `<index_lookup>(query
  fragment)`

  The query fragment is processed using an index lookup to
  find qualifying rows.

* `<if>(condition,
  expr1,
  expr2)`

  If the condition is true, evaluate to
  *`expr1`*, otherwise
  *`expr2`*.

* `<is_not_null_test>(expr)`

  A test to verify that the expression does not evaluate to
  `NULL`.

* `<materialize>(query
  fragment)`

  Subquery materialization is used.

* `` `materialized-subquery`.col_name ``

  A reference to the column
  *`col_name`* in an internal temporary
  table materialized to hold the result from evaluating a
  subquery.

* `<primary_index_lookup>(query
  fragment)`

  The query fragment is processed using a primary key lookup
  to find qualifying rows.

* `<ref_null_helper>(expr)`

  This is an internal optimizer object with no user
  significance.

* `/* select#N */
  select_stmt`

  The `SELECT` is associated with the row in
  non-extended [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") output
  that has an `id` value of
  *`N`*.

* `outer_tables semi join
  (inner_tables)`

  A semijoin operation.
  *`inner_tables`* shows the tables
  that were not pulled out. See [Section 8.2.2.1, “Optimizing Subqueries, Derived Tables, and View References with Semijoin
  Transformations”](semijoins.html "8.2.2.1 Optimizing Subqueries, Derived Tables, and View References with Semijoin Transformations").

* `<temporary table>`

  This represents an internal temporary table created to cache
  an intermediate result.

When some tables are of [`const`](explain-output.html#jointype_const)
or [`system`](explain-output.html#jointype_system) type, expressions
involving columns from these tables are evaluated early by the
optimizer and are not part of the displayed statement. However,
with `FORMAT=JSON`, some
[`const`](explain-output.html#jointype_const) table accesses are
displayed as a [`ref`](explain-output.html#jointype_ref) access
that uses a const value.