#### 26.4.3.3 The host_summary_by_file_io_type and x$host_summary_by_file_io_type Views

These views summarize file I/O, grouped by host and event type. By default, rows are sorted by host and descending total I/O latency.

The `host_summary_by_file_io_type` and `x$host_summary_by_file_io_type` views have these columns:

* `host`

  The host from which the client connected. Rows for which the `HOST` column in the underlying Performance Schema table is `NULL` are assumed to be for background threads and are reported with a host name of `background`.

* `event_name`

  The file I/O event name.

* `total`

  The total number of occurrences of the file I/O event for the host.

* `total_latency`

  The total wait time of timed occurrences of the file I/O event for the host.

* `max_latency`

  The maximum single wait time of timed occurrences of the file I/O event for the host.
