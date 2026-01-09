#### 30.4.3.40 The statements_with_temp_tables and x$statements_with_temp_tables Views

These views list normalized statements that have used temporary tables. By default, rows are sorted by descending number of on-disk temporary tables used and descending number of in-memory temporary tables used.

The `statements_with_temp_tables` and `x$statements_with_temp_tables` views have these columns:

* `query`

  The normalized statement string.

* `db`

  The default database for the statement, or `NULL` if there is none.

* `exec_count`

  The total number of times the statement has executed.

* `total_latency`

  The total wait time of timed occurrences of the statement.

* `memory_tmp_tables`

  The total number of internal in-memory temporary tables created by occurrences of the statement.

* `disk_tmp_tables`

  The total number of internal on-disk temporary tables created by occurrences of the statement.

* `avg_tmp_tables_per_query`

  The average number of internal temporary tables created per occurrence of the statement.

* `tmp_tables_to_disk_pct`

  The percentage of internal in-memory temporary tables that were converted to on-disk tables.

* `first_seen`

  The time at which the statement was first seen.

* `last_seen`

  The time at which the statement was most recently seen.

* `digest`

  The statement digest.
