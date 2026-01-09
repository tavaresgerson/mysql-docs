#### 30.4.3.10 The io_by_thread_by_latency and x$io_by_thread_by_latency Views

These views summarize I/O consumers to display time waiting for I/O, grouped by thread. By default, rows are sorted by descending total I/O latency.

The `io_by_thread_by_latency` and `x$io_by_thread_by_latency` views have these columns:

* `user`

  For foreground threads, the account associated with the thread. For background threads, the thread name.

* `total`

  The total number of I/O events for the thread.

* `total_latency`

  The total wait time of timed I/O events for the thread.

* `min_latency`

  The minimum single wait time of timed I/O events for the thread.

* `avg_latency`

  The average wait time per timed I/O event for the thread.

* `max_latency`

  The maximum single wait time of timed I/O events for the thread.

* `thread_id`

  The thread ID.

* `processlist_id`

  For foreground threads, the processlist ID of the thread. For background threads, `NULL`.
