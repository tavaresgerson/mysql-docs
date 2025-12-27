#### 26.4.3.39 The statements\_with\_sorting and x$statements\_with\_sorting Views

These views list normalized statements that have performed sorts. By default, rows are sorted by descending total latency.

The `statements_with_sorting` and `x$statements_with_sorting` views have these columns:

* `query`

  The normalized statement string.

* `db`

  The default database for the statement, or `NULL` if there is none.

* `exec_count`

  The total number of times the statement has executed.

* `total_latency`

  The total wait time of timed occurrences of the statement.

* `sort_merge_passes`

  The total number of sort merge passes by occurrences of the statement.

* `avg_sort_merges`

  The average number of sort merge passes per occurrence of the statement.

* `sorts_using_scans`

  The total number of sorts using table scans by occurrences of the statement.

* `sort_using_range`

  The total number of sorts using range accesses by occurrences of the statement.

* `rows_sorted`

  The total number of rows sorted by occurrences of the statement.

* `avg_rows_sorted`

  The average number of rows sorted per occurrence of the statement.

* `first_seen`

  The time at which the statement was first seen.

* `last_seen`

  The time at which the statement was most recently seen.

* `digest`

  The statement digest.
