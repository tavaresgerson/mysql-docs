### 8.15.3 Traceable Statements

Statements which are traceable are listed here:

* [`SELECT`](select.html "13.2.9 SELECT Statement")
* [`INSERT`](insert.html "13.2.5 INSERT Statement")
* [`REPLACE`](replace.html "13.2.8 REPLACE Statement")
* [`UPDATE`](update.html "13.2.11 UPDATE Statement")
* [`DELETE`](delete.html "13.2.2 DELETE Statement")
* [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") with any of the
  preceding statements

* [`SET`](set-statement.html "13.7.4 SET Statements")
* [`DO`](do.html "13.2.3 DO Statement")
* [`DECLARE`](declare.html "13.6.3 DECLARE Statement"),
  [`CASE`](case.html "13.6.5.1 CASE Statement"),
  [`IF`](if.html "13.6.5.2 IF Statement"), and
  [`RETURN`](return.html "13.6.5.7 RETURN Statement") as used in stored
  routines

* [`CALL`](call.html "13.2.1 CALL Statement")

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