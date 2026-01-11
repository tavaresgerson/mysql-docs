#### 30.4.3.50 The waits_by_host_by_latency and x$waits_by_host_by_latency Views

These views summarize wait events, grouped by host and event. By default, rows are sorted by host and descending total latency. Idle events are ignored.

The `waits_by_host_by_latency` and `x$waits_by_host_by_latency` views have these columns:

* `host`

  The host from which the connection originated.

* `event`

  The event name.

* `total`

  The total number of occurrences of the event for the host.

* `total_latency`

  The total wait time of timed occurrences of the event for the host.

* `avg_latency`

  The average wait time per timed occurrence of the event for the host.

* `max_latency`

  The maximum single wait time of timed occurrences of the event for the host.
