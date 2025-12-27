#### 25.12.15.1 Wait Event Summary Tables

The Performance Schema maintains tables for collecting current and recent wait events, and aggregates that information in summary tables. [Section 25.12.4, “Performance Schema Wait Event Tables”](performance-schema-wait-tables.html "25.12.4 Performance Schema Wait Event Tables") describes the events on which wait summaries are based. See that discussion for information about the content of wait events, the current and recent wait event tables, and how to control wait event collection, which is disabled by default.

Example wait event summary information:

```sql
mysql> SELECT *
       FROM performance_schema.events_waits_summary_global_by_event_name\G
...
*************************** 6. row ***************************
    EVENT_NAME: wait/synch/mutex/sql/BINARY_LOG::LOCK_index
    COUNT_STAR: 8
SUM_TIMER_WAIT: 2119302
MIN_TIMER_WAIT: 196092
AVG_TIMER_WAIT: 264912
MAX_TIMER_WAIT: 569421
...
*************************** 9. row ***************************
    EVENT_NAME: wait/synch/mutex/sql/hash_filo::lock
    COUNT_STAR: 69
SUM_TIMER_WAIT: 16848828
MIN_TIMER_WAIT: 0
AVG_TIMER_WAIT: 244185
MAX_TIMER_WAIT: 735345
...
```

Each wait event summary table has one or more grouping columns to indicate how the table aggregates events. Event names refer to names of event instruments in the [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") table:

* [`events_waits_summary_by_account_by_event_name`](performance-schema-stage-summary-tables.html "25.12.15.2 Stage Summary Tables") has `EVENT_NAME`, `USER`, and `HOST` columns. Each row summarizes events for a given account (user and host combination) and event name.

* [`events_waits_summary_by_host_by_event_name`](performance-schema-stage-summary-tables.html "25.12.15.2 Stage Summary Tables") has `EVENT_NAME` and `HOST` columns. Each row summarizes events for a given host and event name.

* [`events_waits_summary_by_instance`](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables") has `EVENT_NAME` and `OBJECT_INSTANCE_BEGIN` columns. Each row summarizes events for a given event name and object. If an instrument is used to create multiple instances, each instance has a unique `OBJECT_INSTANCE_BEGIN` value and is summarized separately in this table.

* [`events_waits_summary_by_thread_by_event_name`](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables") has `THREAD_ID` and `EVENT_NAME` columns. Each row summarizes events for a given thread and event name.

* [`events_waits_summary_by_user_by_event_name`](performance-schema-stage-summary-tables.html "25.12.15.2 Stage Summary Tables") has `EVENT_NAME` and `USER` columns. Each row summarizes events for a given user and event name.

* [`events_waits_summary_global_by_event_name`](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables") has an `EVENT_NAME` column. Each row summarizes events for a given event name. An instrument might be used to create multiple instances of the instrumented object. For example, if there is an instrument for a mutex that is created for each connection, there are as many instances as there are connections. The summary row for the instrument summarizes over all these instances.

Each wait event summary table has these summary columns containing aggregated values:

* `COUNT_STAR`

  The number of summarized events. This value includes all events, whether timed or nontimed.

* `SUM_TIMER_WAIT`

  The total wait time of the summarized timed events. This value is calculated only for timed events because nontimed events have a wait time of `NULL`. The same is true for the other `xxx_TIMER_WAIT` values.

* `MIN_TIMER_WAIT`

  The minimum wait time of the summarized timed events.

* `AVG_TIMER_WAIT`

  The average wait time of the summarized timed events.

* `MAX_TIMER_WAIT`

  The maximum wait time of the summarized timed events.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is permitted for wait summary tables. It has these effects:

* For summary tables not aggregated by account, host, or user, truncation resets the summary columns to zero rather than removing rows.

* For summary tables aggregated by account, host, or user, truncation removes rows for accounts, hosts, or users with no connections, and resets the summary columns to zero for the remaining rows.

In addition, each wait summary table that is aggregated by account, host, user, or thread is implicitly truncated by truncation of the connection table on which it depends, or truncation of [`events_waits_summary_global_by_event_name`](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables"). For details, see [Section 25.12.8, “Performance Schema Connection Tables”](performance-schema-connection-tables.html "25.12.8 Performance Schema Connection Tables").
