#### 26.4.3.36 The statements\_with\_errors\_or\_warnings and x$statements\_with\_errors\_or\_warnings Views

These views display normalized statements that have produced errors or warnings. By default, rows are sorted by descending error and warning counts.

The `statements_with_errors_or_warnings` and `x$statements_with_errors_or_warnings` views have these columns:

* `query`

  The normalized statement string.

* `db`

  The default database for the statement, or `NULL` if there is none.

* `exec_count`

  The total number of times the statement has executed.

* `errors`

  The total number of errors produced by occurrences of the statement.

* `error_pct`

  The percentage of statement occurrences that produced errors.

* `warnings`

  The total number of warnings produced by occurrences of the statement.

* `warning_pct`

  The percentage of statement occurrences that produced warnings.

* `first_seen`

  The time at which the statement was first seen.

* `last_seen`

  The time at which the statement was most recently seen.

* `digest`

  The statement digest.
