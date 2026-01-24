#### 26.4.3.12 The io_global_by_file_by_latency and x$io_global_by_file_by_latency Views

These views summarize global I/O consumers to display time waiting for I/O, grouped by file. By default, rows are sorted by descending total latency.

The `io_global_by_file_by_latency` and `x$io_global_by_file_by_latency` views have these columns:

* `file`

  The file path name.

* `total`

  The total number of I/O events for the file.

* `total_latency`

  The total wait time of timed I/O events for the file.

* `count_read`

  The total number of read I/O events for the file.

* `read_latency`

  The total wait time of timed read I/O events for the file.

* `count_write`

  The total number of write I/O events for the file.

* `write_latency`

  The total wait time of timed write I/O events for the file.

* `count_misc`

  The total number of other I/O events for the file.

* `misc_latency`

  The total wait time of timed other I/O events for the file.
