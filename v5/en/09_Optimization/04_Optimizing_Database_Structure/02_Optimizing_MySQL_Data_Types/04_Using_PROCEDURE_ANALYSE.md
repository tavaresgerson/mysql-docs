#### 8.4.2.4 Using PROCEDURE ANALYSE

`ANALYSE([max_elements[,max_memory]])`

Note

`PROCEDURE ANALYSE()` is deprecated as of
MySQL 5.7.18, and is removed in MySQL 8.0.

`ANALYSE()` examines the result from a query
and returns an analysis of the results that suggests optimal
data types for each column that may help reduce table sizes.
To obtain this analysis, append `PROCEDURE
ANALYSE` to the end of a
[`SELECT`](select.html "13.2.9 SELECT Statement") statement:

```sql
SELECT ... FROM ... WHERE ... PROCEDURE ANALYSE([max_elements,[max_memory]])
```

For example:

```sql
SELECT col1, col2 FROM table1 PROCEDURE ANALYSE(10, 2000);
```

The results show some statistics for the values returned by
the query, and propose an optimal data type for the columns.
This can be helpful for checking your existing tables, or
after importing new data. You may need to try different
settings for the arguments so that `PROCEDURE
ANALYSE()` does not suggest the
[`ENUM`](enum.html "11.3.5 The ENUM Type") data type when it is not
appropriate.

The arguments are optional and are used as follows:

* *`max_elements`* (default 256) is
  the maximum number of distinct values that
  `ANALYSE()` notices per column. This is
  used by `ANALYSE()` to check whether the
  optimal data type should be of type
  [`ENUM`](enum.html "11.3.5 The ENUM Type"); if there are more
  than *`max_elements`* distinct
  values, then [`ENUM`](enum.html "11.3.5 The ENUM Type") is not a
  suggested type.

* *`max_memory`* (default 8192) is
  the maximum amount of memory that
  `ANALYSE()` should allocate per column
  while trying to find all distinct values.

A `PROCEDURE` clause is not permitted in a
[`UNION`](union.html "13.2.9.3 UNION Clause") statement.