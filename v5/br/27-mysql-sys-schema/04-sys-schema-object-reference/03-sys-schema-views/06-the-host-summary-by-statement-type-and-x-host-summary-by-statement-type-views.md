#### 26.4.3.6 The host_summary_by_statement_type and x$host_summary_by_statement_type Views

These views summarize informaion about statements executed, grouped by host and statement type. By default, rows are sorted by host and descending total latency.

The `host_summary_by_statement_type` and `x$host_summary_by_statement_type` views have these columns:

* `host`

  The host from which the client connected. Rows for which the `HOST` column in the underlying Performance Schema table is `NULL` are assumed to be for background threads and are reported with a host name of `background`.

* `statement`

  The final component of the statement event name.

* `total`

  The total number of occurrences of the statement event for the host.

* `total_latency`

  The total wait time of timed occurrences of the statement event for the host.

* `max_latency`

  The maximum single wait time of timed occurrences of the statement event for the host.

* `lock_latency`

  The total time waiting for locks by timed occurrences of the statement event for the host.

* `rows_sent`

  The total number of rows returned by occurrences of the statement event for the host.

* `rows_examined`

  The total number of rows read from storage engines by occurrences of the statement event for the host.

* `rows_affected`

  The total number of rows affected by occurrences of the statement event for the host.

* `full_scans`

  The total number of full table scans by occurrences of the statement event for the host.
