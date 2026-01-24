#### 26.4.3.35 The statement_analysis and x$statement_analysis Views

These views list normalized statements with aggregated statistics. The content mimics the MySQL Enterprise Monitor Query Analysis view. By default, rows are sorted by descending total latency.

The `statement_analysis` and `x$statement_analysis` views have these columns:

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

* `lock_latency`

  The total time waiting for locks by timed occurrences of the statement.

* `rows_sent`

  The total number of rows returned by occurrences of the statement.

* `rows_sent_avg`

  The average number of rows returned per occurrence of the statement.

* `rows_examined`

  The total number of rows read from storage engines by occurrences of the statement.

* `rows_examined_avg`

  The average number of rows read from storage engines per occurrence of the statement.

* `rows_affected`

  The total number of rows affected by occurrences of the statement.

* `rows_affected_avg`

  The average number of rows affected per occurrence of the statement.

* `tmp_tables`

  The total number of internal in-memory temporary tables created by occurrences of the statement.

* `tmp_disk_tables`

  The total number of internal on-disk temporary tables created by occurrences of the statement.

* `rows_sorted`

  The total number of rows sorted by occurrences of the statement.

* `sort_merge_passes`

  The total number of sort merge passes by occurrences of the statement.

* `digest`

  The statement digest.

* `first_seen`

  The time at which the statement was first seen.

* `last_seen`

  The time at which the statement was most recently seen.
