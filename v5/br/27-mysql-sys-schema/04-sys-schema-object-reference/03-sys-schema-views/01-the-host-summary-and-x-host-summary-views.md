#### 26.4.3.1 The host_summary and x$host_summary Views

These views summarize statement activity, file I/O, and connections, grouped by host.

The `host_summary` and `x$host_summary` views have these columns:

* `host`

  The host from which the client connected. Rows for which the `HOST` column in the underlying Performance Schema table is `NULL` are assumed to be for background threads and are reported with a host name of `background`.

* `statements`

  The total number of statements for the host.

* `statement_latency`

  The total wait time of timed statements for the host.

* `statement_avg_latency`

  The average wait time per timed statement for the host.

* `table_scans`

  The total number of table scans for the host.

* `file_ios`

  The total number of file I/O events for the host.

* `file_io_latency`

  The total wait time of timed file I/O events for the host.

* `current_connections`

  The current number of connections for the host.

* `total_connections`

  The total number of connections for the host.

* `unique_users`

  The number of distinct users for the host.

* `current_memory`

  The current amount of allocated memory for the host.

* `total_memory_allocated`

  The total amount of allocated memory for the host.
