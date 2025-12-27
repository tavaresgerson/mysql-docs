#### 26.4.3.2 The host\_summary\_by\_file\_io and x$host\_summary\_by\_file\_io Views

These views summarize file I/O, grouped by host. By default, rows are sorted by descending total file I/O latency.

The `host_summary_by_file_io` and `x$host_summary_by_file_io` views have these columns:

* `host`

  The host from which the client connected. Rows for which the `HOST` column in the underlying Performance Schema table is `NULL` are assumed to be for background threads and are reported with a host name of `background`.

* `ios`

  The total number of file I/O events for the host.

* `io_latency`

  The total wait time of timed file I/O events for the host.
