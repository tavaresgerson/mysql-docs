### 27.3.6 JavaScript SQL API

[27.3.6.1 Session Object](srjsapi-session.html)

[27.3.6.2 SqlExecute Object](srjsapi-sqlexecute.html)

[27.3.6.3 SqlResult Object](srjsapi-sqlresult.html)

[27.3.6.4 Schema Object](srjsapi-schema.html)

[27.3.6.5 Table Object](srjsapi-table.html)

[27.3.6.6 Column Object](srjsapi-column.html)

[27.3.6.7 Row Object](srjsapi-row.html)

[27.3.6.8 Warning Object](srjsapi-warning.html)

[27.3.6.9 PreparedStatement Object](srjsapi-preparedstatement.html)

[27.3.6.10 Stored Routine API](srjsapi-routines.html)

[27.3.6.11 JavaScript Transaction API](srjsapi-transactions.html)

[27.3.6.12 MySQL Functions](srjsapi-mysql.html)

[27.3.6.13 SqlError Object](srjsapi-sqlerror.html)

This section provides reference information for the SQL and result
set API supported by JavaScript stored routines in the MLE
Component.

The API supports the top-level objects listed here:

* [`Column`](srjsapi-column.html "27.3.6.6 Column Object"): Result set column
  metadata.

* [`PreparedStatement`](srjsapi-preparedstatement.html "27.3.6.9 PreparedStatement Object"): Handler
  for execution of prepared statements.

* [`Row`](srjsapi-row.html "27.3.6.7 Row Object"): Row in a result set.
* [`Session`](srjsapi-session.html "27.3.6.1 Session Object"): MySQL user session.
  For information about `Session` transactional
  methods such as
  [`startTransaction()`](srjsapi-transactions.html#srjsapi-session-starttransaction),
  [`commit()`](srjsapi-transactions.html#srjsapi-session-commit), and
  [`rollback()`](srjsapi-transactions.html#srjsapi-session-rollback), see
  [Section 27.3.6.11, “JavaScript Transaction API”](srjsapi-transactions.html "27.3.6.11 JavaScript Transaction API").

* [`SqlExecute`](srjsapi-sqlexecute.html "27.3.6.2 SqlExecute Object"): Handler for
  execution of (simple) SQL statements. Its
  [`execute()`](srjsapi-sqlexecute.html#srjsapi-sqlexecute-execute) method
  executes an SQL statement.

* [`SqlResult`](srjsapi-sqlresult.html "27.3.6.3 SqlResult Object"): Result set
  returned by an SQL statement.

* [`Warning`](srjsapi-warning.html "27.3.6.8 Warning Object"): Warning raised by
  statement execution.

The SQL API can be used only within JavaScript stored procedures,
and cannot be used within JavaScript stored functions.