#### 27.7.2.4 Limitations on DML Operations

The following limitations or restrictions apply to all data
modification operations ([`INSERT`](insert.html "15.2.7 INSERT Statement"),
[`UPDATE`](update.html "15.2.17 UPDATE Statement"), and
[`DELETE`](delete.html "15.2.2 DELETE Statement") statements) on JSON
duality views:

* Multiple [`INSERT`](insert.html "15.2.7 INSERT Statement"),
  [`UPDATE`](update.html "15.2.17 UPDATE Statement"), and
  [`DELETE`](delete.html "15.2.2 DELETE Statement") operations on a JSON
  document is not supported.

* Auto-increment column projection is supported, but
  populating generated values is not supported.

* The [`EXPLAIN`](explain.html "15.8.2 EXPLAIN Statement") statement is not
  supported.

* The [`REPLACE`](replace.html "15.2.12 REPLACE Statement") statement is not
  supported.

* [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement") and
  [`LOAD XML`](load-xml.html "15.2.10 LOAD XML Statement") are not supported.

* `INSERT ... FROM SELECT` is not supported.
* Multi-table [`UPDATE`](update.html "15.2.17 UPDATE Statement") and
  [`DELETE`](delete.html "15.2.2 DELETE Statement") statements are not
  allowed.

* `INSERT ... ON DUPLICATE KEY UPDATE` is not
  allowed.

* The `LOW_PRIORITY` and
  `IGNORE` clauses are not supported.

* Data modification operations on an SQL view defined over a
  JSON duality view are not supported.

* Updates of multiple objects is not supported. Updates
  require a `WHERE` clause that identifies a
  single row.