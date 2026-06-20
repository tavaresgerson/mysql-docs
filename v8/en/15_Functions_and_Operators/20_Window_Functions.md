## 14.20 Window Functions

MySQL supports window functions that, for each row from a query, perform a calculation using rows related to that row. The following sections discuss how to use window functions, including descriptions of the `OVER` and `WINDOW` clauses. The first section provides descriptions of the nonaggregate window functions. For descriptions of the aggregate window functions, see Section 14.19.1, “Aggregate Function Descriptions”.

For information about optimization and window functions, see Section 10.2.1.21, “Window Function Optimization”.


### 14.20.1 Window Function Descriptions

This section describes nonaggregate window functions that, for each row from a query, perform a calculation using rows related to that row. Most aggregate functions also can be used as window functions; see Section 14.19.1, “Aggregate Function Descriptions”.

For window function usage information and examples, and definitions of terms such as the `OVER` clause, window, partition, frame, and peer, see Section 14.20.2, “Window Function Concepts and Syntax”.

**Table 14.30 Window Functions**

<table frame="box" rules="all" summary="A reference that lists window functions."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>CUME_DIST()</code></td> <td> Cumulative distribution value </td> </tr><tr><td><code>DENSE_RANK()</code></td> <td> Rank of current row within its partition, without gaps </td> </tr><tr><td><code>FIRST_VALUE()</code></td> <td> Value of argument from first row of window frame </td> </tr><tr><td><code>LAG()</code></td> <td> Value of argument from row lagging current row within partition </td> </tr><tr><td><code>LAST_VALUE()</code></td> <td> Value of argument from last row of window frame </td> </tr><tr><td><code>LEAD()</code></td> <td> Value of argument from row leading current row within partition </td> </tr><tr><td><code>NTH_VALUE()</code></td> <td> Value of argument from N-th row of window frame </td> </tr><tr><td><code>NTILE()</code></td> <td> Bucket number of current row within its partition. </td> </tr><tr><td><code>PERCENT_RANK()</code></td> <td> Percentage rank value </td> </tr><tr><td><code>RANK()</code></td> <td> Rank of current row within its partition, with gaps </td> </tr><tr><td><code>ROW_NUMBER()</code></td> <td> Number of current row within its partition </td> </tr></tbody></table>

In the following function descriptions, *`over_clause`* represents the `OVER` clause, described in Section 14.20.2, “Window Function Concepts and Syntax”. Some window functions permit a *`null_treatment`* clause that specifies how to handle `NULL` values when calculating results. This clause is optional. It is part of the SQL standard, but the MySQL implementation permits only `RESPECT NULLS` (which is also the default). This means that `NULL` values are considered when calculating results. `IGNORE NULLS` is parsed, but produces an error.

* `CUME_DIST()` *`over_clause`*

  Returns the cumulative distribution of a value within a group of values; that is, the percentage of partition values less than or equal to the value in the current row. This represents the number of rows preceding or peer with the current row in the window ordering of the window partition divided by the total number of rows in the window partition. Return values range from 0 to 1.

  This function should be used with `ORDER BY` to sort partition rows into the desired order. Without `ORDER BY`, all rows are peers and have value *`N`*/*`N`* = 1, where *`N`* is the partition size.

  *`over_clause`* is as described in Section 14.20.2, “Window Function Concepts and Syntax”.

  The following query shows, for the set of values in the `val` column, the `CUME_DIST()` value for each row, as well as the percentage rank value returned by the similar `PERCENT_RANK()` function. For reference, the query also displays row numbers using `ROW_NUMBER()`:

  ```
  mysql> SELECT
           val,
           ROW_NUMBER()   OVER w AS 'row_number',
           CUME_DIST()    OVER w AS 'cume_dist',
           PERCENT_RANK() OVER w AS 'percent_rank'
         FROM numbers
         WINDOW w AS (ORDER BY val);
  +------+------------+--------------------+--------------+
  | val  | row_number | cume_dist          | percent_rank |
  +------+------------+--------------------+--------------+
  |    1 |          1 | 0.2222222222222222 |            0 |
  |    1 |          2 | 0.2222222222222222 |            0 |
  |    2 |          3 | 0.3333333333333333 |         0.25 |
  |    3 |          4 | 0.6666666666666666 |        0.375 |
  |    3 |          5 | 0.6666666666666666 |        0.375 |
  |    3 |          6 | 0.6666666666666666 |        0.375 |
  |    4 |          7 | 0.8888888888888888 |         0.75 |
  |    4 |          8 | 0.8888888888888888 |         0.75 |
  |    5 |          9 |                  1 |            1 |
  +------+------------+--------------------+--------------+
  ```

* `DENSE_RANK()` *`over_clause`*

  Returns the rank of the current row within its partition, without gaps. Peers are considered ties and receive the same rank. This function assigns consecutive ranks to peer groups; the result is that groups of size greater than one do not produce noncontiguous rank numbers. For an example, see the `RANK()` function description.

  This function should be used with `ORDER BY` to sort partition rows into the desired order. Without `ORDER BY`, all rows are peers.

  *`over_clause`* is as described in Section 14.20.2, “Window Function Concepts and Syntax”.

* `FIRST_VALUE(expr)` [*`null_treatment`*] *`over_clause`*

  Returns the value of *`expr`* from the first row of the window frame.

  *`over_clause`* is as described in Section 14.20.2, “Window Function Concepts and Syntax”. *`null_treatment`* is as described in the section introduction.

  The following query demonstrates `FIRST_VALUE()`, `LAST_VALUE()`, and two instances of `NTH_VALUE()`:

  ```
  mysql> SELECT
           time, subject, val,
           FIRST_VALUE(val)  OVER w AS 'first',
           LAST_VALUE(val)   OVER w AS 'last',
           NTH_VALUE(val, 2) OVER w AS 'second',
           NTH_VALUE(val, 4) OVER w AS 'fourth'
         FROM observations
         WINDOW w AS (PARTITION BY subject ORDER BY time
                      ROWS UNBOUNDED PRECEDING);
  +----------+---------+------+-------+------+--------+--------+
  | time     | subject | val  | first | last | second | fourth |
  +----------+---------+------+-------+------+--------+--------+
  | 07:00:00 | st113   |   10 |    10 |   10 |   NULL |   NULL |
  | 07:15:00 | st113   |    9 |    10 |    9 |      9 |   NULL |
  | 07:30:00 | st113   |   25 |    10 |   25 |      9 |   NULL |
  | 07:45:00 | st113   |   20 |    10 |   20 |      9 |     20 |
  | 07:00:00 | xh458   |    0 |     0 |    0 |   NULL |   NULL |
  | 07:15:00 | xh458   |   10 |     0 |   10 |     10 |   NULL |
  | 07:30:00 | xh458   |    5 |     0 |    5 |     10 |   NULL |
  | 07:45:00 | xh458   |   30 |     0 |   30 |     10 |     30 |
  | 08:00:00 | xh458   |   25 |     0 |   25 |     10 |     30 |
  +----------+---------+------+-------+------+--------+--------+
  ```

  Each function uses the rows in the current frame, which, per the window definition shown, extends from the first partition row to the current row. For the `NTH_VALUE()` calls, the current frame does not always include the requested row; in such cases, the return value is `NULL`.

* [`LAG(expr [, N[, default]])`](window-function-descriptions.html#function_lag) [*`null_treatment`*] *`over_clause`*

  Returns the value of *`expr`* from the row that lags (precedes) the current row by *`N`* rows within its partition. If there is no such row, the return value is *`default`*. For example, if *`N`* is 3, the return value is *`default`* for the first three rows. If *`N`* or *`default`* are missing, the defaults are 1 and `NULL`, respectively.

  *`N`* must be a literal nonnegative integer. If *`N`* is 0, *`expr`* is evaluated for the current row.

  Beginning with MySQL 8.0.22, *`N`* cannot be `NULL`. In addition, it must now be an integer in the range `0` to `263`, inclusive, in any of the following forms:

  + an unsigned integer constant literal
  + a positional parameter marker (`?`)
  + a user-defined variable
  + a local variable in a stored routine

  *`over_clause`* is as described in Section 14.20.2, “Window Function Concepts and Syntax”. *`null_treatment`* is as described in the section introduction.

  `LAG()` (and the similar `LEAD()` function) are often used to compute differences between rows. The following query shows a set of time-ordered observations and, for each one, the `LAG()` and `LEAD()` values from the adjoining rows, as well as the differences between the current and adjoining rows:

  ```
  mysql> SELECT
           t, val,
           LAG(val)        OVER w AS 'lag',
           LEAD(val)       OVER w AS 'lead',
           val - LAG(val)  OVER w AS 'lag diff',
           val - LEAD(val) OVER w AS 'lead diff'
         FROM series
         WINDOW w AS (ORDER BY t);
  +----------+------+------+------+----------+-----------+
  | t        | val  | lag  | lead | lag diff | lead diff |
  +----------+------+------+------+----------+-----------+
  | 12:00:00 |  100 | NULL |  125 |     NULL |       -25 |
  | 13:00:00 |  125 |  100 |  132 |       25 |        -7 |
  | 14:00:00 |  132 |  125 |  145 |        7 |       -13 |
  | 15:00:00 |  145 |  132 |  140 |       13 |         5 |
  | 16:00:00 |  140 |  145 |  150 |       -5 |       -10 |
  | 17:00:00 |  150 |  140 |  200 |       10 |       -50 |
  | 18:00:00 |  200 |  150 | NULL |       50 |      NULL |
  +----------+------+------+------+----------+-----------+
  ```

  In the example, the `LAG()` and `LEAD()` calls use the default *`N`* and *`default`* values of 1 and `NULL`, respectively.

  The first row shows what happens when there is no previous row for `LAG()`: The function returns the *`default`* value (in this case, `NULL`). The last row shows the same thing when there is no next row for `LEAD()`.

  `LAG()` and `LEAD()` also serve to compute sums rather than differences. Consider this data set, which contains the first few numbers of the Fibonacci series:

  ```
  mysql> SELECT n FROM fib ORDER BY n;
  +------+
  | n    |
  +------+
  |    1 |
  |    1 |
  |    2 |
  |    3 |
  |    5 |
  |    8 |
  +------+
  ```

  The following query shows the `LAG()` and `LEAD()` values for the rows adjacent to the current row. It also uses those functions to add to the current row value the values from the preceding and following rows. The effect is to generate the next number in the Fibonacci series, and the next number after that:

  ```
  mysql> SELECT
           n,
           LAG(n, 1, 0)      OVER w AS 'lag',
           LEAD(n, 1, 0)     OVER w AS 'lead',
           n + LAG(n, 1, 0)  OVER w AS 'next_n',
           n + LEAD(n, 1, 0) OVER w AS 'next_next_n'
         FROM fib
         WINDOW w AS (ORDER BY n);
  +------+------+------+--------+-------------+
  | n    | lag  | lead | next_n | next_next_n |
  +------+------+------+--------+-------------+
  |    1 |    0 |    1 |      1 |           2 |
  |    1 |    1 |    2 |      2 |           3 |
  |    2 |    1 |    3 |      3 |           5 |
  |    3 |    2 |    5 |      5 |           8 |
  |    5 |    3 |    8 |      8 |          13 |
  |    8 |    5 |    0 |     13 |           8 |
  +------+------+------+--------+-------------+
  ```

  One way to generate the initial set of Fibonacci numbers is to use a recursive common table expression. For an example, see Fibonacci Series Generation.

  Beginning with MySQL 8.0.22, you cannot use a negative value for the rows argument of this function.

* `LAST_VALUE(expr)` [*`null_treatment`*] *`over_clause`*

  Returns the value of *`expr`* from the last row of the window frame.

  *`over_clause`* is as described in Section 14.20.2, “Window Function Concepts and Syntax”. *`null_treatment`* is as described in the section introduction.

  For an example, see the `FIRST_VALUE()` function description.

* [`LEAD(expr [, N[, default]])`](window-function-descriptions.html#function_lead) [*`null_treatment`*] *`over_clause`*

  Returns the value of *`expr`* from the row that leads (follows) the current row by *`N`* rows within its partition. If there is no such row, the return value is *`default`*. For example, if *`N`* is 3, the return value is *`default`* for the last three rows. If *`N`* or *`default`* are missing, the defaults are 1 and `NULL`, respectively.

  *`N`* must be a literal nonnegative integer. If *`N`* is 0, *`expr`* is evaluated for the current row.

  Beginning with MySQL 8.0.22, *`N`* cannot be `NULL`. In addition, it must now be an integer in the range `0` to `263`, inclusive, in any of the following forms:

  + an unsigned integer constant literal
  + a positional parameter marker (`?`)
  + a user-defined variable
  + a local variable in a stored routine

  *`over_clause`* is as described in Section 14.20.2, “Window Function Concepts and Syntax”. *`null_treatment`* is as described in the section introduction.

  For an example, see the `LAG()` function description.

  In MySQL 8.0.22 and later, use of a negative value for the rows argument of this function is not permitted.

* [`NTH_VALUE(expr, N)`](window-function-descriptions.html#function_nth-value) [*`from_first_last`*] [*`null_treatment`*] *`over_clause`*

  Returns the value of *`expr`* from the *`N`*-th row of the window frame. If there is no such row, the return value is `NULL`.

  *`N`* must be a literal positive integer.

  *`from_first_last`* is part of the SQL standard, but the MySQL implementation permits only `FROM FIRST` (which is also the default). This means that calculations begin at the first row of the window. `FROM LAST` is parsed, but produces an error. To obtain the same effect as `FROM LAST` (begin calculations at the last row of the window), use `ORDER BY` to sort in reverse order.

  *`over_clause`* is as described in Section 14.20.2, “Window Function Concepts and Syntax”. *`null_treatment`* is as described in the section introduction.

  For an example, see the `FIRST_VALUE()` function description.

  In MySQL 8.0.22 and later, you cannot use `NULL` for the row argument of this function.

* `NTILE(N)` *`over_clause`*

  Divides a partition into *`N`* groups (buckets), assigns each row in the partition its bucket number, and returns the bucket number of the current row within its partition. For example, if *`N`* is 4, `NTILE()` divides rows into four buckets. If *`N`* is 100, `NTILE()` divides rows into 100 buckets.

  *`N`* must be a literal positive integer. Bucket number return values range from 1 to *`N`*.

  Beginning with MySQL 8.0.22, *`N`* cannot be `NULL`, and must be an integer in the range `0` to `263`, inclusive, in any of the following forms:

  + an unsigned integer constant literal
  + a positional parameter marker (`?`)
  + a user-defined variable
  + a local variable in a stored routine

  This function should be used with `ORDER BY` to sort partition rows into the desired order.

  *`over_clause`* is as described in Section 14.20.2, “Window Function Concepts and Syntax”.

  The following query shows, for the set of values in the `val` column, the percentile values resulting from dividing the rows into two or four groups. For reference, the query also displays row numbers using `ROW_NUMBER()`:

  ```
  mysql> SELECT
           val,
           ROW_NUMBER() OVER w AS 'row_number',
           NTILE(2)     OVER w AS 'ntile2',
           NTILE(4)     OVER w AS 'ntile4'
         FROM numbers
         WINDOW w AS (ORDER BY val);
  +------+------------+--------+--------+
  | val  | row_number | ntile2 | ntile4 |
  +------+------------+--------+--------+
  |    1 |          1 |      1 |      1 |
  |    1 |          2 |      1 |      1 |
  |    2 |          3 |      1 |      1 |
  |    3 |          4 |      1 |      2 |
  |    3 |          5 |      1 |      2 |
  |    3 |          6 |      2 |      3 |
  |    4 |          7 |      2 |      3 |
  |    4 |          8 |      2 |      4 |
  |    5 |          9 |      2 |      4 |
  +------+------------+--------+--------+
  ```

  Beginning with MySQL 8.0.22, the construct `NTILE(NULL)` is no longer permitted.

* `PERCENT_RANK()` *`over_clause`*

  Returns the percentage of partition values less than the value in the current row, excluding the highest value. Return values range from 0 to 1 and represent the row relative rank, calculated as the result of this formula, where *`rank`* is the row rank and *`rows`* is the number of partition rows:

  ```
  (rank - 1) / (rows - 1)
  ```

  This function should be used with `ORDER BY` to sort partition rows into the desired order. Without `ORDER BY`, all rows are peers.

  *`over_clause`* is as described in Section 14.20.2, “Window Function Concepts and Syntax”.

  For an example, see the `CUME_DIST()` function description.

* `RANK()` *`over_clause`*

  Returns the rank of the current row within its partition, with gaps. Peers are considered ties and receive the same rank. This function does not assign consecutive ranks to peer groups if groups of size greater than one exist; the result is noncontiguous rank numbers.

  This function should be used with `ORDER BY` to sort partition rows into the desired order. Without `ORDER BY`, all rows are peers.

  *`over_clause`* is as described in Section 14.20.2, “Window Function Concepts and Syntax”.

  The following query shows the difference between `RANK()`, which produces ranks with gaps, and `DENSE_RANK()`, which produces ranks without gaps. The query shows rank values for each member of a set of values in the `val` column, which contains some duplicates. `RANK()` assigns peers (the duplicates) the same rank value, and the next greater value has a rank higher by the number of peers minus one. `DENSE_RANK()` also assigns peers the same rank value, but the next higher value has a rank one greater. For reference, the query also displays row numbers using `ROW_NUMBER()`:

  ```
  mysql> SELECT
           val,
           ROW_NUMBER() OVER w AS 'row_number',
           RANK()       OVER w AS 'rank',
           DENSE_RANK() OVER w AS 'dense_rank'
         FROM numbers
         WINDOW w AS (ORDER BY val);
  +------+------------+------+------------+
  | val  | row_number | rank | dense_rank |
  +------+------------+------+------------+
  |    1 |          1 |    1 |          1 |
  |    1 |          2 |    1 |          1 |
  |    2 |          3 |    3 |          2 |
  |    3 |          4 |    4 |          3 |
  |    3 |          5 |    4 |          3 |
  |    3 |          6 |    4 |          3 |
  |    4 |          7 |    7 |          4 |
  |    4 |          8 |    7 |          4 |
  |    5 |          9 |    9 |          5 |
  +------+------------+------+------------+
  ```

* `ROW_NUMBER()` *`over_clause`*

  Returns the number of the current row within its partition. Rows numbers range from 1 to the number of partition rows.

  `ORDER BY` affects the order in which rows are numbered. Without `ORDER BY`, row numbering is nondeterministic.

  `ROW_NUMBER()` assigns peers different row numbers. To assign peers the same value, use `RANK()` or `DENSE_RANK()`. For an example, see the `RANK()` function description.

  *`over_clause`* is as described in Section 14.20.2, “Window Function Concepts and Syntax”.


### 14.20.2 Window Function Concepts and Syntax

This section describes how to use window functions. Examples use the same sales information data set as found in the discussion of the `GROUPING()` function in Section 14.19.2, “GROUP BY Modifiers”:

```
mysql> SELECT * FROM sales ORDER BY country, year, product;
+------+---------+------------+--------+
| year | country | product    | profit |
+------+---------+------------+--------+
| 2000 | Finland | Computer   |   1500 |
| 2000 | Finland | Phone      |    100 |
| 2001 | Finland | Phone      |     10 |
| 2000 | India   | Calculator |     75 |
| 2000 | India   | Calculator |     75 |
| 2000 | India   | Computer   |   1200 |
| 2000 | USA     | Calculator |     75 |
| 2000 | USA     | Computer   |   1500 |
| 2001 | USA     | Calculator |     50 |
| 2001 | USA     | Computer   |   1500 |
| 2001 | USA     | Computer   |   1200 |
| 2001 | USA     | TV         |    150 |
| 2001 | USA     | TV         |    100 |
+------+---------+------------+--------+
```

A window function performs an aggregate-like operation on a set of query rows. However, whereas an aggregate operation groups query rows into a single result row, a window function produces a result for each query row:

* The row for which function evaluation occurs is called the current row.

* The query rows related to the current row over which function evaluation occurs comprise the window for the current row.

For example, using the sales information table, these two queries perform aggregate operations that produce a single global sum for all rows taken as a group, and sums grouped per country:

```
mysql> SELECT SUM(profit) AS total_profit
       FROM sales;
+--------------+
| total_profit |
+--------------+
|         7535 |
+--------------+
mysql> SELECT country, SUM(profit) AS country_profit
       FROM sales
       GROUP BY country
       ORDER BY country;
+---------+----------------+
| country | country_profit |
+---------+----------------+
| Finland |           1610 |
| India   |           1350 |
| USA     |           4575 |
+---------+----------------+
```

By contrast, window operations do not collapse groups of query rows to a single output row. Instead, they produce a result for each row. Like the preceding queries, the following query uses `SUM()`, but this time as a window function:

```
mysql> SELECT
         year, country, product, profit,
         SUM(profit) OVER() AS total_profit,
         SUM(profit) OVER(PARTITION BY country) AS country_profit
       FROM sales
       ORDER BY country, year, product, profit;
+------+---------+------------+--------+--------------+----------------+
| year | country | product    | profit | total_profit | country_profit |
+------+---------+------------+--------+--------------+----------------+
| 2000 | Finland | Computer   |   1500 |         7535 |           1610 |
| 2000 | Finland | Phone      |    100 |         7535 |           1610 |
| 2001 | Finland | Phone      |     10 |         7535 |           1610 |
| 2000 | India   | Calculator |     75 |         7535 |           1350 |
| 2000 | India   | Calculator |     75 |         7535 |           1350 |
| 2000 | India   | Computer   |   1200 |         7535 |           1350 |
| 2000 | USA     | Calculator |     75 |         7535 |           4575 |
| 2000 | USA     | Computer   |   1500 |         7535 |           4575 |
| 2001 | USA     | Calculator |     50 |         7535 |           4575 |
| 2001 | USA     | Computer   |   1200 |         7535 |           4575 |
| 2001 | USA     | Computer   |   1500 |         7535 |           4575 |
| 2001 | USA     | TV         |    100 |         7535 |           4575 |
| 2001 | USA     | TV         |    150 |         7535 |           4575 |
+------+---------+------------+--------+--------------+----------------+
```

Each window operation in the query is signified by inclusion of an `OVER` clause that specifies how to partition query rows into groups for processing by the window function:

* The first `OVER` clause is empty, which treats the entire set of query rows as a single partition. The window function thus produces a global sum, but does so for each row.

* The second `OVER` clause partitions rows by country, producing a sum per partition (per country). The function produces this sum for each partition row.

Window functions are permitted only in the select list and `ORDER BY` clause. Query result rows are determined from the `FROM` clause, after `WHERE`, `GROUP BY`, and `HAVING` processing, and windowing execution occurs before `ORDER BY`, `LIMIT`, and `SELECT DISTINCT`.

The `OVER` clause is permitted for many aggregate functions, which therefore can be used as window or nonwindow functions, depending on whether the `OVER` clause is present or absent:

```
AVG()
BIT_AND()
BIT_OR()
BIT_XOR()
COUNT()
JSON_ARRAYAGG()
JSON_OBJECTAGG()
MAX()
MIN()
STDDEV_POP(), STDDEV(), STD()
STDDEV_SAMP()
SUM()
VAR_POP(), VARIANCE()
VAR_SAMP()
```

For details about each aggregate function, see Section 14.19.1, “Aggregate Function Descriptions”.

MySQL also supports nonaggregate functions that are used only as window functions. For these, the `OVER` clause is mandatory:

```
CUME_DIST()
DENSE_RANK()
FIRST_VALUE()
LAG()
LAST_VALUE()
LEAD()
NTH_VALUE()
NTILE()
PERCENT_RANK()
RANK()
ROW_NUMBER()
```

For details about each nonaggregate function, see Section 14.20.1, “Window Function Descriptions”.

As an example of one of those nonaggregate window functions, this query uses `ROW_NUMBER()`, which produces the row number of each row within its partition. In this case, rows are numbered per country. By default, partition rows are unordered and row numbering is nondeterministic. To sort partition rows, include an `ORDER BY` clause within the window definition. The query uses unordered and ordered partitions (the `row_num1` and `row_num2` columns) to illustrate the difference between omitting and including `ORDER BY`:

```
mysql> SELECT
         year, country, product, profit,
         ROW_NUMBER() OVER(PARTITION BY country) AS row_num1,
         ROW_NUMBER() OVER(PARTITION BY country ORDER BY year, product) AS row_num2
       FROM sales;
+------+---------+------------+--------+----------+----------+
| year | country | product    | profit | row_num1 | row_num2 |
+------+---------+------------+--------+----------+----------+
| 2000 | Finland | Computer   |   1500 |        2 |        1 |
| 2000 | Finland | Phone      |    100 |        1 |        2 |
| 2001 | Finland | Phone      |     10 |        3 |        3 |
| 2000 | India   | Calculator |     75 |        2 |        1 |
| 2000 | India   | Calculator |     75 |        3 |        2 |
| 2000 | India   | Computer   |   1200 |        1 |        3 |
| 2000 | USA     | Calculator |     75 |        5 |        1 |
| 2000 | USA     | Computer   |   1500 |        4 |        2 |
| 2001 | USA     | Calculator |     50 |        2 |        3 |
| 2001 | USA     | Computer   |   1500 |        3 |        4 |
| 2001 | USA     | Computer   |   1200 |        7 |        5 |
| 2001 | USA     | TV         |    150 |        1 |        6 |
| 2001 | USA     | TV         |    100 |        6 |        7 |
+------+---------+------------+--------+----------+----------+
```

As mentioned previously, to use a window function (or treat an aggregate function as a window function), include an `OVER` clause following the function call. The `OVER` clause has two forms:

```
over_clause:
    {OVER (window_spec) | OVER window_name}
```

Both forms define how the window function should process query rows. They differ in whether the window is defined directly in the `OVER` clause, or supplied by a reference to a named window defined elsewhere in the query:

* In the first case, the window specification appears directly in the `OVER` clause, between the parentheses.

* In the second case, *`window_name`* is the name for a window specification defined by a `WINDOW` clause elsewhere in the query. For details, see Section 14.20.4, “Named Windows”.

For `OVER (window_spec)` syntax, the window specification has several parts, all optional:

```
window_spec:
    [window_name] [partition_clause] [order_clause] [frame_clause]
```

If `OVER()` is empty, the window consists of all query rows and the window function computes a result using all rows. Otherwise, the clauses present within the parentheses determine which query rows are used to compute the function result and how they are partitioned and ordered:

* *`window_name`*: The name of a window defined by a `WINDOW` clause elsewhere in the query. If *`window_name`* appears by itself within the `OVER` clause, it completely defines the window. If partitioning, ordering, or framing clauses are also given, they modify interpretation of the named window. For details, see Section 14.20.4, “Named Windows”.

* *`partition_clause`*: A `PARTITION BY` clause indicates how to divide the query rows into groups. The window function result for a given row is based on the rows of the partition that contains the row. If `PARTITION BY` is omitted, there is a single partition consisting of all query rows.

  Note

  Partitioning for window functions differs from table partitioning. For information about table partitioning, see Chapter 26, *Partitioning*.

  *`partition_clause`* has this syntax:

  ```
  partition_clause:
      PARTITION BY expr [, expr] ...
  ```

  Standard SQL requires `PARTITION BY` to be followed by column names only. A MySQL extension is to permit expressions, not just column names. For example, if a table contains a `TIMESTAMP` column named `ts`, standard SQL permits `PARTITION BY ts` but not `PARTITION BY HOUR(ts)`, whereas MySQL permits both.

* *`order_clause`*: An `ORDER BY` clause indicates how to sort rows in each partition. Partition rows that are equal according to the `ORDER BY` clause are considered peers. If `ORDER BY` is omitted, partition rows are unordered, with no processing order implied, and all partition rows are peers.

  *`order_clause`* has this syntax:

  ```
  order_clause:
      ORDER BY expr [ASC|DESC] [, expr [ASC|DESC]] ...
  ```

  Each `ORDER BY` expression optionally can be followed by `ASC` or `DESC` to indicate sort direction. The default is `ASC` if no direction is specified. `NULL` values sort first for ascending sorts, last for descending sorts.

  An `ORDER BY` in a window definition applies within individual partitions. To sort the result set as a whole, include an `ORDER BY` at the query top level.

* *`frame_clause`*: A frame is a subset of the current partition and the frame clause specifies how to define the subset. The frame clause has many subclauses of its own. For details, see Section 14.20.3, “Window Function Frame Specification”.


### 14.20.3 Window Function Frame Specification

The definition of a window used with a window function can include a frame clause. A frame is a subset of the current partition and the frame clause specifies how to define the subset.

Frames are determined with respect to the current row, which enables a frame to move within a partition depending on the location of the current row within its partition. Examples:

* By defining a frame to be all rows from the partition start to the current row, you can compute running totals for each row.

* By defining a frame as extending *`N`* rows on either side of the current row, you can compute rolling averages.

The following query demonstrates the use of moving frames to compute running totals within each group of time-ordered `level` values, as well as rolling averages computed from the current row and the rows that immediately precede and follow it:

```
mysql> SELECT
         time, subject, val,
         SUM(val) OVER (PARTITION BY subject ORDER BY time
                        ROWS UNBOUNDED PRECEDING)
           AS running_total,
         AVG(val) OVER (PARTITION BY subject ORDER BY time
                        ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING)
           AS running_average
       FROM observations;
+----------+---------+------+---------------+-----------------+
| time     | subject | val  | running_total | running_average |
+----------+---------+------+---------------+-----------------+
| 07:00:00 | st113   |   10 |            10 |          9.5000 |
| 07:15:00 | st113   |    9 |            19 |         14.6667 |
| 07:30:00 | st113   |   25 |            44 |         18.0000 |
| 07:45:00 | st113   |   20 |            64 |         22.5000 |
| 07:00:00 | xh458   |    0 |             0 |          5.0000 |
| 07:15:00 | xh458   |   10 |            10 |          5.0000 |
| 07:30:00 | xh458   |    5 |            15 |         15.0000 |
| 07:45:00 | xh458   |   30 |            45 |         20.0000 |
| 08:00:00 | xh458   |   25 |            70 |         27.5000 |
+----------+---------+------+---------------+-----------------+
```

For the `running_average` column, there is no frame row preceding the first one or following the last. In these cases, `AVG()` computes the average of the rows that are available.

Aggregate functions used as window functions operate on rows in the current row frame, as do these nonaggregate window functions:

```
FIRST_VALUE()
LAST_VALUE()
NTH_VALUE()
```

Standard SQL specifies that window functions that operate on the entire partition should have no frame clause. MySQL permits a frame clause for such functions but ignores it. These functions use the entire partition even if a frame is specified:

```
CUME_DIST()
DENSE_RANK()
LAG()
LEAD()
NTILE()
PERCENT_RANK()
RANK()
ROW_NUMBER()
```

The frame clause, if given, has this syntax:

```
frame_clause:
    frame_units frame_extent

frame_units:
    {ROWS | RANGE}
```

In the absence of a frame clause, the default frame depends on whether an `ORDER BY` clause is present, as described later in this section.

The *`frame_units`* value indicates the type of relationship between the current row and frame rows:

* `ROWS`: The frame is defined by beginning and ending row positions. Offsets are differences in row numbers from the current row number.

* `RANGE`: The frame is defined by rows within a value range. Offsets are differences in row values from the current row value.

The *`frame_extent`* value indicates the start and end points of the frame. You can specify just the start of the frame (in which case the current row is implicitly the end) or use `BETWEEN` to specify both frame endpoints:

```
frame_extent:
    {frame_start | frame_between}

frame_between:
    BETWEEN frame_start AND frame_end

frame_start, frame_end: {
    CURRENT ROW
  | UNBOUNDED PRECEDING
  | UNBOUNDED FOLLOWING
  | expr PRECEDING
  | expr FOLLOWING
}
```

With `BETWEEN` syntax, *`frame_start`* must not occur later than *`frame_end`*.

The permitted *`frame_start`* and *`frame_end`* values have these meanings:

* `CURRENT ROW`: For `ROWS`, the bound is the current row. For `RANGE`, the bound is the peers of the current row.

* `UNBOUNDED PRECEDING`: The bound is the first partition row.

* `UNBOUNDED FOLLOWING`: The bound is the last partition row.

* `expr PRECEDING`: For `ROWS`, the bound is *`expr`* rows before the current row. For `RANGE`, the bound is the rows with values equal to the current row value minus *`expr`*; if the current row value is `NULL`, the bound is the peers of the row.

  For `expr PRECEDING` (and `expr FOLLOWING`), *`expr`* can be a `?` parameter marker (for use in a prepared statement), a nonnegative numeric literal, or a temporal interval of the form `INTERVAL val unit`. For `INTERVAL` expressions, *`val`* specifies nonnegative interval value, and *`unit`* is a keyword indicating the units in which the value should be interpreted. (For details about the permitted *`units`* specifiers, see the description of the `DATE_ADD()` function in Section 14.7, “Date and Time Functions”.)

  `RANGE` on a numeric or temporal *`expr`* requires `ORDER BY` on a numeric or temporal expression, respectively.

  Examples of valid `expr PRECEDING` and `expr FOLLOWING` indicators:

  ```
  10 PRECEDING
  INTERVAL 5 DAY PRECEDING
  5 FOLLOWING
  INTERVAL '2:30' MINUTE_SECOND FOLLOWING
  ```

* `expr FOLLOWING`: For `ROWS`, the bound is *`expr`* rows after the current row. For `RANGE`, the bound is the rows with values equal to the current row value plus *`expr`*; if the current row value is `NULL`, the bound is the peers of the row.

  For permitted values of *`expr`*, see the description of `expr PRECEDING`.

The following query demonstrates `FIRST_VALUE()`, `LAST_VALUE()`, and two instances of `NTH_VALUE()`:

```
mysql> SELECT
         time, subject, val,
         FIRST_VALUE(val)  OVER w AS 'first',
         LAST_VALUE(val)   OVER w AS 'last',
         NTH_VALUE(val, 2) OVER w AS 'second',
         NTH_VALUE(val, 4) OVER w AS 'fourth'
       FROM observations
       WINDOW w AS (PARTITION BY subject ORDER BY time
                    ROWS UNBOUNDED PRECEDING);
+----------+---------+------+-------+------+--------+--------+
| time     | subject | val  | first | last | second | fourth |
+----------+---------+------+-------+------+--------+--------+
| 07:00:00 | st113   |   10 |    10 |   10 |   NULL |   NULL |
| 07:15:00 | st113   |    9 |    10 |    9 |      9 |   NULL |
| 07:30:00 | st113   |   25 |    10 |   25 |      9 |   NULL |
| 07:45:00 | st113   |   20 |    10 |   20 |      9 |     20 |
| 07:00:00 | xh458   |    0 |     0 |    0 |   NULL |   NULL |
| 07:15:00 | xh458   |   10 |     0 |   10 |     10 |   NULL |
| 07:30:00 | xh458   |    5 |     0 |    5 |     10 |   NULL |
| 07:45:00 | xh458   |   30 |     0 |   30 |     10 |     30 |
| 08:00:00 | xh458   |   25 |     0 |   25 |     10 |     30 |
+----------+---------+------+-------+------+--------+--------+
```

Each function uses the rows in the current frame, which, per the window definition shown, extends from the first partition row to the current row. For the `NTH_VALUE()` calls, the current frame does not always include the requested row; in such cases, the return value is `NULL`.

In the absence of a frame clause, the default frame depends on whether an `ORDER BY` clause is present:

* With `ORDER BY`: The default frame includes rows from the partition start through the current row, including all peers of the current row (rows equal to the current row according to the `ORDER BY` clause). The default is equivalent to this frame specification:

  ```
  RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ```

* Without `ORDER BY`: The default frame includes all partition rows (because, without `ORDER BY`, all partition rows are peers). The default is equivalent to this frame specification:

  ```
  RANGE BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  ```

Because the default frame differs depending on presence or absence of `ORDER BY`, adding `ORDER BY` to a query to get deterministic results may change the results. (For example, the values produced by `SUM()` might change.) To obtain the same results but ordered per `ORDER BY`, provide an explicit frame specification to be used regardless of whether `ORDER BY` is present.

The meaning of a frame specification can be nonobvious when the current row value is `NULL`. Assuming that to be the case, these examples illustrate how various frame specifications apply:

* `ORDER BY X ASC RANGE BETWEEN 10 FOLLOWING AND 15 FOLLOWING`

  The frame starts at `NULL` and stops at `NULL`, thus includes only rows with value `NULL`.

* `ORDER BY X ASC RANGE BETWEEN 10 FOLLOWING AND UNBOUNDED FOLLOWING`

  The frame starts at `NULL` and stops at the end of the partition. Because an `ASC` sort puts `NULL` values first, the frame is the entire partition.

* `ORDER BY X DESC RANGE BETWEEN 10 FOLLOWING AND UNBOUNDED FOLLOWING`

  The frame starts at `NULL` and stops at the end of the partition. Because a `DESC` sort puts `NULL` values last, the frame is only the `NULL` values.

* `ORDER BY X ASC RANGE BETWEEN 10 PRECEDING AND UNBOUNDED FOLLOWING`

  The frame starts at `NULL` and stops at the end of the partition. Because an `ASC` sort puts `NULL` values first, the frame is the entire partition.

* `ORDER BY X ASC RANGE BETWEEN 10 PRECEDING AND 10 FOLLOWING`

  The frame starts at `NULL` and stops at `NULL`, thus includes only rows with value `NULL`.

* `ORDER BY X ASC RANGE BETWEEN 10 PRECEDING AND 1 PRECEDING`

  The frame starts at `NULL` and stops at `NULL`, thus includes only rows with value `NULL`.

* `ORDER BY X ASC RANGE BETWEEN UNBOUNDED PRECEDING AND 10 FOLLOWING`

  The frame starts at the beginning of the partition and stops at rows with value `NULL`. Because an `ASC` sort puts `NULL` values first, the frame is only the `NULL` values.


### 14.20.4 Named Windows

Windows can be defined and given names by which to refer to them in `OVER` clauses. To do this, use a `WINDOW` clause. If present in a query, the `WINDOW` clause falls between the positions of the `HAVING` and `ORDER BY` clauses, and has this syntax:

```
WINDOW window_name AS (window_spec)
    [, window_name AS (window_spec)] ...
```

For each window definition, *`window_name`* is the window name, and *`window_spec`* is the same type of window specification as given between the parentheses of an `OVER` clause, as described in Section 14.20.2, “Window Function Concepts and Syntax”:

```
window_spec:
    [window_name] [partition_clause] [order_clause] [frame_clause]
```

A `WINDOW` clause is useful for queries in which multiple `OVER` clauses would otherwise define the same window. Instead, you can define the window once, give it a name, and refer to the name in the `OVER` clauses. Consider this query, which defines the same window multiple times:

```
SELECT
  val,
  ROW_NUMBER() OVER (ORDER BY val) AS 'row_number',
  RANK()       OVER (ORDER BY val) AS 'rank',
  DENSE_RANK() OVER (ORDER BY val) AS 'dense_rank'
FROM numbers;
```

The query can be written more simply by using `WINDOW` to define the window once and referring to the window by name in the `OVER` clauses:

```
SELECT
  val,
  ROW_NUMBER() OVER w AS 'row_number',
  RANK()       OVER w AS 'rank',
  DENSE_RANK() OVER w AS 'dense_rank'
FROM numbers
WINDOW w AS (ORDER BY val);
```

A named window also makes it easier to experiment with the window definition to see the effect on query results. You need only modify the window definition in the `WINDOW` clause, rather than multiple `OVER` clause definitions.

If an `OVER` clause uses `OVER (window_name ...)` rather than `OVER window_name`, the named window can be modified by the addition of other clauses. For example, this query defines a window that includes partitioning, and uses `ORDER BY` in the `OVER` clauses to modify the window in different ways:

```
SELECT
  DISTINCT year, country,
  FIRST_VALUE(year) OVER (w ORDER BY year ASC) AS first,
  FIRST_VALUE(year) OVER (w ORDER BY year DESC) AS last
FROM sales
WINDOW w AS (PARTITION BY country);
```

An `OVER` clause can only add properties to a named window, not modify them. If the named window definition includes a partitioning, ordering, or framing property, the `OVER` clause that refers to the window name cannot also include the same kind of property or an error occurs:

* This construct is permitted because the window definition and the referring `OVER` clause do not contain the same kind of properties:

  ```
  OVER (w ORDER BY country)
  ... WINDOW w AS (PARTITION BY country)
  ```

* This construct is not permitted because the `OVER` clause specifies `PARTITION BY` for a named window that already has `PARTITION BY`:

  ```
  OVER (w PARTITION BY year)
  ... WINDOW w AS (PARTITION BY country)
  ```

The definition of a named window can itself begin with a *`window_name`*. In such cases, forward and backward references are permitted, but not cycles:

* This is permitted; it contains forward and backward references but no cycles:

  ```
  WINDOW w1 AS (w2), w2 AS (), w3 AS (w1)
  ```

* This is not permitted because it contains a cycle:

  ```
  WINDOW w1 AS (w2), w2 AS (w3), w3 AS (w1)
  ```


### 14.20.5 Window Function Restrictions

The SQL standard imposes a constraint on window functions that they cannot be used in `UPDATE` or `DELETE` statements to update rows. Using such functions in a subquery of these statements (to select rows) is permitted.

MySQL does not support these window function features:

* `DISTINCT` syntax for aggregate window functions.

* Nested window functions.
* Dynamic frame endpoints that depend on the value of the current row.

The parser recognizes these window constructs which nevertheless are not supported:

* The `GROUPS` frame units specifier is parsed, but produces an error. Only `ROWS` and `RANGE` are supported.

* The `EXCLUDE` clause for frame specification is parsed, but produces an error.

* `IGNORE NULLS` is parsed, but produces an error. Only `RESPECT NULLS` is supported.

* `FROM LAST` is parsed, but produces an error. Only `FROM FIRST` is supported.

As of MySQL 8.0.28, a maximum of 127 windows is supported for a given `SELECT`. Note that a single query may use multiple `SELECT` clauses, and each of these clauses supports up to 127 windows. The number of distinct windows is defined as the sum of the named windows and any implicit windows specified as part of any window function's `OVER` clause. You should also be aware that queries using very large numbers of windows may require increasing the default thread stack size (`thread_stack` system variable).
