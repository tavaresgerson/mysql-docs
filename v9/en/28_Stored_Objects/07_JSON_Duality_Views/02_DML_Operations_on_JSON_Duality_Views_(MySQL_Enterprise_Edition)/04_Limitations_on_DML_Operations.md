#### 27.7.2.4 Limitations on DML Operations

The following limitations or restrictions apply to all data modification operations (`INSERT`, `UPDATE`, and `DELETE` statements) on JSON duality views:

* Multiple `INSERT`, `UPDATE`, and `DELETE` operations on a JSON document is not supported.

* Auto-increment column projection is supported, but populating generated values is not supported.

* The `EXPLAIN` statement is not supported.

* The `REPLACE` statement is not supported.

* `LOAD DATA` and `LOAD XML` are not supported.

* `INSERT ... FROM SELECT` is not supported.
* Multi-table `UPDATE` and `DELETE` statements are not allowed.

* `INSERT ... ON DUPLICATE KEY UPDATE` is not allowed.

* The `LOW_PRIORITY` and `IGNORE` clauses are not supported.

* Data modification operations on an SQL view defined over a JSON duality view are not supported.

* Updates of multiple objects is not supported. Updates require a `WHERE` clause that identifies a single row.
