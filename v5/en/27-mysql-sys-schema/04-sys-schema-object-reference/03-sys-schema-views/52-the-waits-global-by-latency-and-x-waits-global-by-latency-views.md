#### 26.4.3.52 The waits\_global\_by\_latency and x$waits\_global\_by\_latency Views

These views summarize wait events, grouped by event. By default, rows are sorted by descending total latency. Idle events are ignored.

The `waits_global_by_latency` and `x$waits_global_by_latency` views have these columns:

* `events`

  The event name.

* `total`

  The total number of occurrences of the event.

* `total_latency`

  The total wait time of timed occurrences of the event.

* `avg_latency`

  The average wait time per timed occurrence of the event.

* `max_latency`

  The maximum single wait time of timed occurrences of the event.
