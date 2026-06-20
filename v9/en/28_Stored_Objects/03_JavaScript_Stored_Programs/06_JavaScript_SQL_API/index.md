### 27.3.6 JavaScript SQL API

This section provides reference information for the SQL and result set API supported by JavaScript stored routines in the MLE Component.

The API supports the top-level objects listed here:

* `Column`: Result set column metadata.

* `PreparedStatement`: Handler for execution of prepared statements.

* `Row`: Row in a result set.
* `Session`: MySQL user session. For information about `Session` transactional methods such as `startTransaction()`, `commit()`, and `rollback()`, see Section 27.3.6.11, “JavaScript Transaction API”.

* `SqlExecute`: Handler for execution of (simple) SQL statements. Its `execute()` method executes an SQL statement.

* `SqlResult`: Result set returned by an SQL statement.

* `Warning`: Warning raised by statement execution.

The SQL API can be used only within JavaScript stored procedures, and cannot be used within JavaScript stored functions.