#### 30.4.3.44 The user_summary_by_stages and x$user_summary_by_stages Views

These views summarize stages, grouped by user. By default, rows are sorted by user and descending total stage latency.

The `user_summary_by_stages` and `x$user_summary_by_stages` views have these columns:

* `user`

  The client user name. Rows for which the `USER` column in the underlying Performance Schema table is `NULL` are assumed to be for background threads and are reported with a host name of `background`.

* `event_name`

  The stage event name.

* `total`

  The total number of occurrences of the stage event for the user.

* `total_latency`

  The total wait time of timed occurrences of the stage event for the user.

* `avg_latency`

  The average wait time per timed occurrence of the stage event for the user.
