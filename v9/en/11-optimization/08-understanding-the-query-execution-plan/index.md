## 10.8 Understanding the Query Execution Plan

10.8.1 Optimizing Queries with EXPLAIN

10.8.2 EXPLAIN Output Format

10.8.3 Extended EXPLAIN Output Format

10.8.4 Obtaining Execution Plan Information for a Named Connection

10.8.5 Estimating Query Performance

Depending on the details of your tables, columns, indexes, and the conditions in your `WHERE` clause, the MySQL optimizer considers many techniques to efficiently perform the lookups involved in an SQL query. A query on a huge table can be performed without reading all the rows; a join involving several tables can be performed without comparing every combination of rows. The set of operations that the optimizer chooses to perform the most efficient query is called the “query execution plan”, also known as the `EXPLAIN` plan. Your goals are to recognize the aspects of the `EXPLAIN` plan that indicate a query is optimized well, and to learn the SQL syntax and indexing techniques to improve the plan if you see some inefficient operations.
