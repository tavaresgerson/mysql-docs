### 10.2.1 Optimizing SELECT Statements

10.2.1.1 WHERE Clause Optimization

10.2.1.2 Range Optimization

10.2.1.3 Index Merge Optimization

10.2.1.4 Hash Join Optimization

10.2.1.5 Engine Condition Pushdown Optimization

10.2.1.6 Index Condition Pushdown Optimization

10.2.1.7 Nested-Loop Join Algorithms

10.2.1.8 Nested Join Optimization

10.2.1.9 Outer Join Optimization

10.2.1.10 Outer Join Simplification

10.2.1.11 Multi-Range Read Optimization

10.2.1.12 Block Nested-Loop and Batched Key Access Joins

10.2.1.13 Condition Filtering

10.2.1.14 Constant-Folding Optimization

10.2.1.15 IS NULL Optimization

10.2.1.16 ORDER BY Optimization

10.2.1.17 GROUP BY Optimization

10.2.1.18 DISTINCT Optimization

10.2.1.19 LIMIT Query Optimization

10.2.1.20 Function Call Optimization

10.2.1.21 Window Function Optimization

10.2.1.22 Row Constructor Expression Optimization

10.2.1.23 Avoiding Full Table Scans

Queries, in the form of `SELECT` statements, perform all the lookup operations in the database. Tuning these statements is a top priority, whether to achieve sub-second response times for dynamic web pages, or to chop hours off the time to generate huge overnight reports.

Besides `SELECT` statements, the tuning techniques for queries also apply to constructs such as `CREATE TABLE...AS SELECT`, `INSERT INTO...SELECT`, and `WHERE` clauses in `DELETE` statements. Those statements have additional performance considerations because they combine write operations with the read-oriented query operations.

NDB Cluster supports a join pushdown optimization whereby a qualifying join is sent in its entirety to NDB Cluster data nodes, where it can be distributed among them and executed in parallel. For more information about this optimization, see Conditions for NDB pushdown joins.

The main considerations for optimizing queries are:

* To make a slow `SELECT ... WHERE` query faster, the first thing to check is whether you can add an index. Set up indexes on columns used in the `WHERE` clause, to speed up evaluation, filtering, and the final retrieval of results. To avoid wasted disk space, construct a small set of indexes that speed up many related queries used in your application.

  Indexes are especially important for queries that reference different tables, using features such as joins and foreign keys. You can use the `EXPLAIN` statement to determine which indexes are used for a `SELECT`. See Section 10.3.1, “How MySQL Uses Indexes” and Section 10.8.1, “Optimizing Queries with EXPLAIN”.

* Isolate and tune any part of the query, such as a function call, that takes excessive time. Depending on how the query is structured, a function could be called once for every row in the result set, or even once for every row in the table, greatly magnifying any inefficiency.

* Minimize the number of full table scans in your queries, particularly for big tables.

* Keep table statistics up to date by using the `ANALYZE TABLE` statement periodically, so the optimizer has the information needed to construct an efficient execution plan.

* Learn the tuning techniques, indexing techniques, and configuration parameters that are specific to the storage engine for each table. Both `InnoDB` and `MyISAM` have sets of guidelines for enabling and sustaining high performance in queries. For details, see Section 10.5.6, “Optimizing InnoDB Queries” and Section 10.6.1, “Optimizing MyISAM Queries”.

* You can optimize single-query transactions for `InnoDB` tables, using the technique in Section 10.5.3, “Optimizing InnoDB Read-Only Transactions”.

* Avoid transforming the query in ways that make it hard to understand, especially if the optimizer does some of the same transformations automatically.

* If a performance issue is not easily solved by one of the basic guidelines, investigate the internal details of the specific query by reading the `EXPLAIN` plan and adjusting your indexes, `WHERE` clauses, join clauses, and so on. (When you reach a certain level of expertise, reading the `EXPLAIN` plan might be your first step for every query.)

* Adjust the size and properties of the memory areas that MySQL uses for caching. With efficient use of the `InnoDB` buffer pool, `MyISAM` key cache, and the MySQL query cache, repeated queries run faster because the results are retrieved from memory the second and subsequent times.

* Even for a query that runs fast using the cache memory areas, you might still optimize further so that they require less cache memory, making your application more scalable. Scalability means that your application can handle more simultaneous users, larger requests, and so on without experiencing a big drop in performance.

* Deal with locking issues, where the speed of your query might be affected by other sessions accessing the tables at the same time.
