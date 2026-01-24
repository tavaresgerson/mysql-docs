#### 25.12.15.2 Stage Summary Tables

The Performance Schema maintains tables for collecting current and recent stage events, and aggregates that information in summary tables. [Section 25.12.5, “Performance Schema Stage Event Tables”](performance-schema-stage-tables.html "25.12.5 Performance Schema Stage Event Tables") describes the events on which stage summaries are based. See that discussion for information about the content of stage events, the current and historical stage event tables, and how to control stage event collection, which is disabled by default.

Example stage event summary information:

```sql
mysql> SELECT *
       FROM performance_schema.events_stages_summary_global_by_event_name\G
...
*************************** 5. row ***************************
    EVENT_NAME: stage/sql/checking permissions
    COUNT_STAR: 57
SUM_TIMER_WAIT: 26501888880
MIN_TIMER_WAIT: 7317456
AVG_TIMER_WAIT: 464945295
MAX_TIMER_WAIT: 12858936792
...
*************************** 9. row ***************************
    EVENT_NAME: stage/sql/closing tables
    COUNT_STAR: 37
SUM_TIMER_WAIT: 662606568
MIN_TIMER_WAIT: 1593864
AVG_TIMER_WAIT: 17907891
MAX_TIMER_WAIT: 437977248
...
```

Each stage summary table has one or more grouping columns to indicate how the table aggregates events. Event names refer to names of event instruments in the [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") table:

* [`events_stages_summary_by_account_by_event_name`](performance-schema-stage-summary-tables.html "25.12.15.2 Stage Summary Tables") has `EVENT_NAME`, `USER`, and `HOST` columns. Each row summarizes events for a given account (user and host combination) and event name.

* [`events_stages_summary_by_host_by_event_name`](performance-schema-stage-summary-tables.html "25.12.15.2 Stage Summary Tables") has `EVENT_NAME` and `HOST` columns. Each row summarizes events for a given host and event name.

* [`events_stages_summary_by_thread_by_event_name`](performance-schema-stage-summary-tables.html "25.12.15.2 Stage Summary Tables") has `THREAD_ID` and `EVENT_NAME` columns. Each row summarizes events for a given thread and event name.

* [`events_stages_summary_by_user_by_event_name`](performance-schema-stage-summary-tables.html "25.12.15.2 Stage Summary Tables") has `EVENT_NAME` and `USER` columns. Each row summarizes events for a given user and event name.

* [`events_stages_summary_global_by_event_name`](performance-schema-stage-summary-tables.html "25.12.15.2 Stage Summary Tables") has an `EVENT_NAME` column. Each row summarizes events for a given event name.

Each stage summary table has these summary columns containing aggregated values: `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, and `MAX_TIMER_WAIT`. These columns are analogous to the columns of the same names in the wait event summary tables (see [Section 25.12.15.1, “Wait Event Summary Tables”](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables")), except that the stage summary tables aggregate events from [`events_stages_current`](performance-schema-events-stages-current-table.html "25.12.5.1 The events_stages_current Table") rather than [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table").

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is permitted for stage summary tables. It has these effects:

* For summary tables not aggregated by account, host, or user, truncation resets the summary columns to zero rather than removing rows.

* For summary tables aggregated by account, host, or user, truncation removes rows for accounts, hosts, or users with no connections, and resets the summary columns to zero for the remaining rows.

In addition, each stage summary table that is aggregated by account, host, user, or thread is implicitly truncated by truncation of the connection table on which it depends, or truncation of [`events_stages_summary_global_by_event_name`](performance-schema-stage-summary-tables.html "25.12.15.2 Stage Summary Tables"). For details, see [Section 25.12.8, “Performance Schema Connection Tables”](performance-schema-connection-tables.html "25.12.8 Performance Schema Connection Tables").
