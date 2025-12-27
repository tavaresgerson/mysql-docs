#### 26.4.3.16 The memory\_by\_host\_by\_current\_bytes and x$memory\_by\_host\_by\_current\_bytes Views

These views summarize memory use, grouped by host. By default, rows are sorted by descending amount of memory used.

The `memory_by_host_by_current_bytes` and `x$memory_by_host_by_current_bytes` views have these columns:

* `host`

  The host from which the client connected. Rows for which the `HOST` column in the underlying Performance Schema table is `NULL` are assumed to be for background threads and are reported with a host name of `background`.

* `current_count_used`

  The current number of allocated memory blocks that have not been freed yet for the host.

* `current_allocated`

  The current number of allocated bytes that have not been freed yet for the host.

* `current_avg_alloc`

  The current number of allocated bytes per memory block for the host.

* `current_max_alloc`

  The largest single current memory allocation in bytes for the host.

* `total_allocated`

  The total memory allocation in bytes for the host.
