#### 30.4.3.45 The user\_summary\_by\_statement\_latency and x$user\_summary\_by\_statement\_latency Views

These views summarize overall statement statistics, grouped by user. By default, rows are sorted by descending total latency.

The `user_summary_by_statement_latency` and `x$user_summary_by_statement_latency` views have these columns:

* `user`

  The client user name. Rows for which the `USER` column in the underlying Performance Schema table is `NULL` are assumed to be for background threads and are reported with a host name of `background`.

* `total`

  The total number of statements for the user.

* `total_latency`

  The total wait time of timed statements for the user.

* `max_latency`

  The maximum single wait time of timed statements for the user.

* `lock_latency`

  The total time waiting for locks by timed statements for the user.

* `cpu_latency`

  The time spent on CPU for the current thread.

* `rows_sent`

  The total number of rows returned by statements for the user.

* `rows_examined`

  The total number of rows read from storage engines by statements for the user.

* `rows_affected`

  The total number of rows affected by statements for the user.

* `full_scans`

  The total number of full table scans by statements for the user.
