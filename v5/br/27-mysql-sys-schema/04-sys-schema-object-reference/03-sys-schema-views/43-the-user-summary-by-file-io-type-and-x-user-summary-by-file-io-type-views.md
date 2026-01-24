#### 26.4.3.43 The user_summary_by_file_io_type and x$user_summary_by_file_io_type Views

These views summarize file I/O, grouped by user and event type. By default, rows are sorted by user and descending total latency.

The `user_summary_by_file_io_type` and `x$user_summary_by_file_io_type` views have these columns:

* `user`

  The client user name. Rows for which the `USER` column in the underlying Performance Schema table is `NULL` are assumed to be for background threads and are reported with a host name of `background`.

* `event_name`

  The file I/O event name.

* `total`

  The total number of occurrences of the file I/O event for the user.

* `latency`

  The total wait time of timed occurrences of the file I/O event for the user.

* `max_latency`

  The maximum single wait time of timed occurrences of the file I/O event for the user.
