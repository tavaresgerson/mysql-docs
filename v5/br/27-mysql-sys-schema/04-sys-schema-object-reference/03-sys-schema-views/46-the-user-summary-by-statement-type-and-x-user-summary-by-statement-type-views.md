#### 26.4.3.46 The user_summary_by_statement_type and x$user_summary_by_statement_type Views

These views summarize informaion about statements executed, grouped by user and statement type. By default, rows are sorted by user and descending total latency.

The `user_summary_by_statement_type` and `x$user_summary_by_statement_type` views have these columns:

* `user`

  The client user name. Rows for which the `USER` column in the underlying Performance Schema table is `NULL` are assumed to be for background threads and are reported with a host name of `background`.

* `statement`

  The final component of the statement event name.

* `total`

  The total number of occurrences of the statement event for the user.

* `total_latency`

  The total wait time of timed occurrences of the statement event for the user.

* `max_latency`

  The maximum single wait time of timed occurrences of the statement event for the user.

* `lock_latency`

  The total time waiting for locks by timed occurrences of the statement event for the user.

* `rows_sent`

  The total number of rows returned by occurrences of the statement event for the user.

* `rows_examined`

  The total number of rows read from storage engines by occurrences of the statement event for the user.

* `rows_affected`

  The total number of rows affected by occurrences of the statement event for the user.

* `full_scans`

  The total number of full table scans by occurrences of the statement event for the user.
