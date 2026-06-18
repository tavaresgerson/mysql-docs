### 8.8.1 Optimizing Queries with EXPLAIN

The [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") statement provides
information about how MySQL executes statements:

* [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") works with
  [`SELECT`](select.html "13.2.9 SELECT Statement"),
  [`DELETE`](delete.html "13.2.2 DELETE Statement"),
  [`INSERT`](insert.html "13.2.5 INSERT Statement"),
  [`REPLACE`](replace.html "13.2.8 REPLACE Statement"), and
  [`UPDATE`](update.html "13.2.11 UPDATE Statement") statements.

* When [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") is used with an
  explainable statement, MySQL displays information from the
  optimizer about the statement execution plan. That is, MySQL
  explains how it would process the statement, including
  information about how tables are joined and in which order.
  For information about using
  [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") to obtain execution
  plan information, see [Section 8.8.2, “EXPLAIN Output Format”](explain-output.html "8.8.2 EXPLAIN Output Format").

* When [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") is used with
  `FOR CONNECTION
  connection_id` rather
  than an explainable statement, it displays the execution
  plan for the statement executing in the named connection.
  See [Section 8.8.4, “Obtaining Execution Plan Information for a Named Connection”](explain-for-connection.html "8.8.4 Obtaining Execution Plan Information for a Named Connection").

* For [`SELECT`](select.html "13.2.9 SELECT Statement") statements,
  [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") produces additional
  execution plan information that can be displayed using
  [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement"). See
  [Section 8.8.3, “Extended EXPLAIN Output Format”](explain-extended.html "8.8.3 Extended EXPLAIN Output Format").

* [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") is useful for
  examining queries involving partitioned tables. See
  [Section 22.3.5, “Obtaining Information About Partitions”](partitioning-info.html "22.3.5 Obtaining Information About Partitions").

* The `FORMAT` option can be used to select
  the output format. `TRADITIONAL` presents
  the output in tabular format. This is the default if no
  `FORMAT` option is present.
  `JSON` format displays the information in
  JSON format.

With the help of [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement"), you can
see where you should add indexes to tables so that the statement
executes faster by using indexes to find rows. You can also use
[`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") to check whether the
optimizer joins the tables in an optimal order. To give a hint
to the optimizer to use a join order corresponding to the order
in which the tables are named in a
[`SELECT`](select.html "13.2.9 SELECT Statement") statement, begin the
statement with `SELECT STRAIGHT_JOIN` rather
than just [`SELECT`](select.html "13.2.9 SELECT Statement"). (See
[Section 13.2.9, “SELECT Statement”](select.html "13.2.9 SELECT Statement").) However,
`STRAIGHT_JOIN` may prevent indexes from being
used because it disables semijoin transformations. See
[Section 8.2.2.1, “Optimizing Subqueries, Derived Tables, and View References with Semijoin
Transformations”](semijoins.html "8.2.2.1 Optimizing Subqueries, Derived Tables, and View References with Semijoin Transformations").

The optimizer trace may sometimes provide information
complementary to that of [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement").
However, the optimizer trace format and content are subject to
change between versions. For details, see
[Section 8.15, “Tracing the Optimizer”](optimizer-tracing.html "8.15 Tracing the Optimizer").

If you have a problem with indexes not being used when you
believe that they should be, run [`ANALYZE
TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") to update table statistics, such as cardinality
of keys, that can affect the choices the optimizer makes. See
[Section 13.7.2.1, “ANALYZE TABLE Statement”](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement").

Note

[`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") can also be used to
obtain information about the columns in a table.
[`EXPLAIN
tbl_name`](explain.html "13.8.2 EXPLAIN Statement") is synonymous
with `DESCRIBE
tbl_name` and
`SHOW COLUMNS FROM
tbl_name`. For more
information, see [Section 13.8.1, “DESCRIBE Statement”](describe.html "13.8.1 DESCRIBE Statement"), and
[Section 13.7.5.5, “SHOW COLUMNS Statement”](show-columns.html "13.7.5.5 SHOW COLUMNS Statement").