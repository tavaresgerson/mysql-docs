#### 26.4.3.5 The host\_summary\_by\_statement\_latency and x$host\_summary\_by\_statement\_latency Views

These views summarize overall statement statistics, grouped by host. By default, rows are sorted by descending total latency.

The `host_summary_by_statement_latency` and `x$host_summary_by_statement_latency` views have these columns:

* `host`

  The host from which the client connected. Rows for which the `HOST` column in the underlying Performance Schema table is `NULL` are assumed to be for background threads and are reported with a host name of `background`.

* `total`

  The total number of statements for the host.

* `total_latency`

  The total wait time of timed statements for the host.

* `max_latency`

  The maximum single wait time of timed statements for the host.

* `lock_latency`

  The total time waiting for locks by timed statements for the host.

* `rows_sent`

  The total number of rows returned by statements for the host.

* `rows_examined`

  The total number of rows read from storage engines by statements for the host.

* `rows_affected`

  The total number of rows affected by statements for the host.

* `full_scans`

  The total number of full table scans by statements for the host.
