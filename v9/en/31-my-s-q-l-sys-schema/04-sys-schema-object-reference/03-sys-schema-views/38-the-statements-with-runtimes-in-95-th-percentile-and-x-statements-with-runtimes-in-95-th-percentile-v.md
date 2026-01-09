#### 30.4.3.38 The statements_with_runtimes_in_95th_percentile and x$statements_with_runtimes_in_95th_percentile Views

These views list statements with runtimes in the 95th percentile. By default, rows are sorted by descending average latency.

Both views use two helper views, `x$ps_digest_avg_latency_distribution` and `x$ps_digest_95th_percentile_by_avg_us`.

The `statements_with_runtimes_in_95th_percentile` and `x$statements_with_runtimes_in_95th_percentile` views have these columns:

* `query`

  The normalized statement string.

* `db`

  The default database for the statement, or `NULL` if there is none.

* `full_scan`

  The total number of full table scans performed by occurrences of the statement.

* `exec_count`

  The total number of times the statement has executed.

* `err_count`

  The total number of errors produced by occurrences of the statement.

* `warn_count`

  The total number of warnings produced by occurrences of the statement.

* `total_latency`

  The total wait time of timed occurrences of the statement.

* `max_latency`

  The maximum single wait time of timed occurrences of the statement.

* `avg_latency`

  The average wait time per timed occurrence of the statement.

* `rows_sent`

  The total number of rows returned by occurrences of the statement.

* `rows_sent_avg`

  The average number of rows returned per occurrence of the statement.

* `rows_examined`

  The total number of rows read from storage engines by occurrences of the statement.

* `rows_examined_avg`

  The average number of rows read from storage engines per occurrence of the statement.

* `first_seen`

  The time at which the statement was first seen.

* `last_seen`

  The time at which the statement was most recently seen.

* `digest`

  The statement digest.
