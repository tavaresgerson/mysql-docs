### 10.15.3 Traceable Statements

Statements which are traceable are listed here:

* [`SELECT`](select.html "15.2.13 SELECT Statement")
* [`INSERT`](insert.html "15.2.7 INSERT Statement")
* [`REPLACE`](replace.html "15.2.12 REPLACE Statement")
* [`UPDATE`](update.html "15.2.17 UPDATE Statement")
* [`DELETE`](delete.html "15.2.2 DELETE Statement")
* [`EXPLAIN`](explain.html "15.8.2 EXPLAIN Statement") with any of the
  preceding statements

* [`SET`](set-statement.html "15.7.6 SET Statements")
* [`DO`](do.html "15.2.3 DO Statement")
* [`DECLARE`](declare.html "15.6.3 DECLARE Statement"),
  [`CASE`](case.html "15.6.5.1 CASE Statement"),
  [`IF`](if.html "15.6.5.2 IF Statement"), and
  [`RETURN`](return.html "15.6.5.7 RETURN Statement") as used in stored
  routines

* [`CALL`](call.html "15.2.1 CALL Statement")

Tracing is supported for both `INSERT` and
`REPLACE` statements using
`VALUES`, `VALUES ROW`, or
`SELECT`.

Traces of multi-table `UPDATE` and
`DELETE` statements are supported.

Tracing of `SET optimizer_trace` is not
supported.

For statements which are prepared and executed in separate steps,
preparation and execution are traced separately.