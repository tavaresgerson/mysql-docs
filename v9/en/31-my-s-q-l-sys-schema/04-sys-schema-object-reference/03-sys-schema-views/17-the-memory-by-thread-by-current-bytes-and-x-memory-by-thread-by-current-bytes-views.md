#### 30.4.3.17 The memory_by_thread_by_current_bytes and x$memory_by_thread_by_current_bytes Views

These views summarize memory use, grouped by thread. By default, rows are sorted by descending amount of memory used.

The `memory_by_thread_by_current_bytes` and `x$memory_by_thread_by_current_bytes` views have these columns:

* `thread_id`

  The thread ID.

* `user`

  The thread user or thread name.

* `current_count_used`

  The current number of allocated memory blocks that have not been freed yet for the thread.

* `current_allocated`

  The current number of allocated bytes that have not been freed yet for the thread.

* `current_avg_alloc`

  The current number of allocated bytes per memory block for the thread.

* `current_max_alloc`

  The largest single current memory allocation in bytes for the thread.

* `total_allocated`

  The total memory allocation in bytes for the thread.
