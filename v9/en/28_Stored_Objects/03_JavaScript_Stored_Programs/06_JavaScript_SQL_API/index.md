### 27.3.6 JavaScript SQL API

27.3.6.1 Session Object

27.3.6.2 SqlExecute Object

27.3.6.3 SqlResult Object

27.3.6.4 Schema Object

27.3.6.5 Table Object

27.3.6.6 Column Object

27.3.6.7 Row Object

27.3.6.8 Warning Object

27.3.6.9 PreparedStatement Object

27.3.6.10 Stored Routine API

27.3.6.11 JavaScript Transaction API

27.3.6.12 MySQL Functions

27.3.6.13 SqlError Object

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
