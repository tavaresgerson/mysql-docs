#### 30.4.3.41 The user_summary and x$user_summary Views

These views summarize statement activity, file I/O, and connections, grouped by user. By default, rows are sorted by descending total latency.

The `user_summary` and `x$user_summary` views have these columns:

* `user`

  The client user name. Rows for which the `USER` column in the underlying Performance Schema table is `NULL` are assumed to be for background threads and are reported with a host name of `background`.

* `statements`

  The total number of statements for the user.

* `statement_latency`

  The total wait time of timed statements for the user.

* `statement_avg_latency`

  The average wait time per timed statement for the user.

* `table_scans`

  The total number of table scans for the user.

* `file_ios`

  The total number of file I/O events for the user.

* `file_io_latency`

  The total wait time of timed file I/O events for the user.

* `current_connections`

  The current number of connections for the user.

* `total_connections`

  The total number of connections for the user.

* `unique_hosts`

  The number of distinct hosts from which connections for the user have originated.

* `current_memory`

  The current amount of allocated memory for the user.

* `total_memory_allocated`

  The total amount of allocated memory for the user.
