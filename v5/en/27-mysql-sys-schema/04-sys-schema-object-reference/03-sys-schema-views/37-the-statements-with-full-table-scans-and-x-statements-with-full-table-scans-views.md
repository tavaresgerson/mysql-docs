#### 26.4.3.37 The statements_with_full_table_scans and x$statements_with_full_table_scans Views

These views display normalized statements that have done full table scans. By default, rows are sorted by descending percentage of time a full scan was done and descending total latency.

The `statements_with_full_table_scans` and `x$statements_with_full_table_scans` views have these columns:

* `query`

  The normalized statement string.

* `db`

  The default database for the statement, or `NULL` if there is none.

* `exec_count`

  The total number of times the statement has executed.

* `total_latency`

  The total wait time of timed statement events for the statement.

* `no_index_used_count`

  The total number of times no index was used to scan the table.

* `no_good_index_used_count`

  The total number of times no good index was used to scan the table.

* `no_index_used_pct`

  The percentage of the time no index was used to scan the table.

* `rows_sent`

  The total number of rows returned from the table.

* `rows_examined`

  The total number of rows read from the storage engine for the table.

* `rows_sent_avg`

  The average number of rows returned from the table.

* `rows_examined_avg`

  The average number of rows read from the storage engine for the table.

* `first_seen`

  The time at which the statement was first seen.

* `last_seen`

  The time at which the statement was most recently seen.

* `digest`

  The statement digest.
