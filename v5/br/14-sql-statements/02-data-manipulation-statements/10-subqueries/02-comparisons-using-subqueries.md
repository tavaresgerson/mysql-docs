#### 13.2.10.2 Comparisons Using Subqueries

The most common use of a subquery is in the form:

```sql
non_subquery_operand comparison_operator (subquery)
```

Where *`comparison_operator`* is one of these operators:

```sql
=  >  <  >=  <=  <>  !=  <=>
```

For example:

```sql
... WHERE 'a' = (SELECT column1 FROM t1)
```

MySQL also permits this construct:

```sql
non_subquery_operand LIKE (subquery)
```

At one time the only legal place for a subquery was on the right side of a comparison, and you might still find some old DBMSs that insist on this.

Here is an example of a common-form subquery comparison that you cannot do with a join. It finds all the rows in table `t1` for which the `column1` value is equal to a maximum value in table `t2`:

```sql
SELECT * FROM t1
  WHERE column1 = (SELECT MAX(column2) FROM t2);
```

Here is another example, which again is impossible with a join because it involves aggregating for one of the tables. It finds all rows in table `t1` containing a value that occurs twice in a given column:

```sql
SELECT * FROM t1 AS t
  WHERE 2 = (SELECT COUNT(*) FROM t1 WHERE t1.id = t.id);
```

For a comparison of the subquery to a scalar, the subquery must return a scalar. For a comparison of the subquery to a row constructor, the subquery must be a row subquery that returns a row with the same number of values as the row constructor. See [Section 13.2.10.5, “Row Subqueries”](row-subqueries.html "13.2.10.5 Row Subqueries").
