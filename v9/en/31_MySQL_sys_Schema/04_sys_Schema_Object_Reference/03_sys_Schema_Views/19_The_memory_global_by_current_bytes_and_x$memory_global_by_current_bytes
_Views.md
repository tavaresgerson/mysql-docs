#### 30.4.3.19 The memory\_global\_by\_current\_bytes and x$memory\_global\_by\_current\_bytes Views

These views summarize memory use, grouped by allocation type (that is, by event). By default, rows are sorted by descending amount of memory used.

The `memory_global_by_current_bytes` and `x$memory_global_by_current_bytes` views have these columns:

* `event_name`

  The memory event name.

* `current_count`

  The total number of occurrences of the event.

* `current_alloc`

  The current number of allocated bytes that have not been freed yet for the event.

* `current_avg_alloc`

  The current number of allocated bytes per memory block for the event.

* `high_count`

  The high-water mark for number of memory blocks allocated for the event.

* `high_alloc`

  The high-water mark for number of bytes allocated for the event.

* `high_avg_alloc`

  The high-water mark for average number of bytes per memory block allocated for the event.
