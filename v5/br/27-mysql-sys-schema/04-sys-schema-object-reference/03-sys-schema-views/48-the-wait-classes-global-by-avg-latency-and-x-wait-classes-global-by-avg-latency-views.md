#### 26.4.3.48 The wait_classes_global_by_avg_latency and x$wait_classes_global_by_avg_latency Views

These views summarize wait class average latencies, grouped by event class. By default, rows are sorted by descending average latency. Idle events are ignored.

An event class is determined by stripping from the event name everything after the first three components. For example, the class for `wait/io/file/sql/slow_log` is `wait/io/file`.

The `wait_classes_global_by_avg_latency` and `x$wait_classes_global_by_avg_latency` views have these columns:

* `event_class`

  The event class.

* `total`

  The total number of occurrences of events in the class.

* `total_latency`

  The total wait time of timed occurrences of events in the class.

* `min_latency`

  The minimum single wait time of timed occurrences of events in the class.

* `avg_latency`

  The average wait time per timed occurrence of events in the class.

* `max_latency`

  The maximum single wait time of timed occurrences of events in the class.
