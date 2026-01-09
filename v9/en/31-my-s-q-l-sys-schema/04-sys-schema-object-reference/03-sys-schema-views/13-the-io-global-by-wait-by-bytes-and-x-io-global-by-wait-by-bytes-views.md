#### 30.4.3.13 The io_global_by_wait_by_bytes and x$io_global_by_wait_by_bytes Views

These views summarize global I/O consumers to display amount of I/O and time waiting for I/O, grouped by event. By default, rows are sorted by descending total I/O (bytes read and written).

The `io_global_by_wait_by_bytes` and `x$io_global_by_wait_by_bytes` views have these columns:

* `event_name`

  The I/O event name, with the `wait/io/file/` prefix stripped.

* `total`

  The total number of occurrences of the I/O event.

* `total_latency`

  The total wait time of timed occurrences of the I/O event.

* `min_latency`

  The minimum single wait time of timed occurrences of the I/O event.

* `avg_latency`

  The average wait time per timed occurrence of the I/O event.

* `max_latency`

  The maximum single wait time of timed occurrences of the I/O event.

* `count_read`

  The number of read requests for the I/O event.

* `total_read`

  The number of bytes read for the I/O event.

* `avg_read`

  The average number of bytes per read for the I/O event.

* `count_write`

  The number of write requests for the I/O event.

* `total_written`

  The number of bytes written for the I/O event.

* `avg_written`

  The average number of bytes per write for the I/O event.

* `total_requested`

  The total number of bytes read and written for the I/O event.
