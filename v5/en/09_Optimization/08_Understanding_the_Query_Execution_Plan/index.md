## 8.8 Understanding the Query Execution Plan

[8.8.1 Optimizing Queries with EXPLAIN](using-explain.html)

[8.8.2 EXPLAIN Output Format](explain-output.html)

[8.8.3 Extended EXPLAIN Output Format](explain-extended.html)

[8.8.4 Obtaining Execution Plan Information for a Named Connection](explain-for-connection.html)

[8.8.5 Estimating Query Performance](estimating-performance.html)

Depending on the details of your tables, columns, indexes, and the
conditions in your `WHERE` clause, the MySQL
optimizer considers many techniques to efficiently perform the
lookups involved in an SQL query. A query on a huge table can be
performed without reading all the rows; a join involving several
tables can be performed without comparing every combination of
rows. The set of operations that the optimizer chooses to perform
the most efficient query is called the “query execution
plan”, also known as the
[`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") plan. Your goals are to
recognize the aspects of the
[`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") plan that indicate a query
is optimized well, and to learn the SQL syntax and indexing
techniques to improve the plan if you see some inefficient
operations.