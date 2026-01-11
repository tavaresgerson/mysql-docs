#### 30.4.3.4 The host_summary_by_stages and x$host_summary_by_stages Views

These views summarize statement stages, grouped by host. By default, rows are sorted by host and descending total latency.

The `host_summary_by_stages` and `x$host_summary_by_stages` views have these columns:

* `host`

  The host from which the client connected. Rows for which the `HOST` column in the underlying Performance Schema table is `NULL` are assumed to be for background threads and are reported with a host name of `background`.

* `event_name`

  The stage event name.

* `total`

  The total number of occurrences of the stage event for the host.

* `total_latency`

  The total wait time of timed occurrences of the stage event for the host.

* `avg_latency`

  The average wait time per timed occurrence of the stage event for the host.
