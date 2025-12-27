#### 30.4.3.18 The memory\_by\_user\_by\_current\_bytes and x$memory\_by\_user\_by\_current\_bytes Views

These views summarize memory use, grouped by user. By default, rows are sorted by descending amount of memory used.

The `memory_by_user_by_current_bytes` and `x$memory_by_user_by_current_bytes` views have these columns:

* `user`

  The client user name. Rows for which the `USER` column in the underlying Performance Schema table is `NULL` are assumed to be for background threads and are reported with a host name of `background`.

* `current_count_used`

  The current number of allocated memory blocks that have not been freed yet for the user.

* `current_allocated`

  The current number of allocated bytes that have not been freed yet for the user.

* `current_avg_alloc`

  The current number of allocated bytes per memory block for the user.

* `current_max_alloc`

  The largest single current memory allocation in bytes for the user.

* `total_allocated`

  The total memory allocation in bytes for the user.
