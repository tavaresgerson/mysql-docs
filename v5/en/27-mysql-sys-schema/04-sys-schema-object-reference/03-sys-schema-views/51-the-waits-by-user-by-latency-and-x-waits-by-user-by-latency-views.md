#### 26.4.3.51 The waits\_by\_user\_by\_latency and x$waits\_by\_user\_by\_latency Views

These views summarize wait events, grouped by user and event. By default, rows are sorted by user and descending total latency. Idle events are ignored.

The `waits_by_user_by_latency` and `x$waits_by_user_by_latency` views have these columns:

* `user`

  The user associated with the connection.

* `event`

  The event name.

* `total`

  The total number of occurrences of the event for the user.

* `total_latency`

  The total wait time of timed occurrences of the event for the user.

* `avg_latency`

  The average wait time per timed occurrence of the event for the user.

* `max_latency`

  The maximum single wait time of timed occurrences of the event for the user.
