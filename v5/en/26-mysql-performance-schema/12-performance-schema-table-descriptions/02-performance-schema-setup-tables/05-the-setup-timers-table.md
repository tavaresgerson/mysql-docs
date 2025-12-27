#### 25.12.2.5 The setup\_timers Table

The [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table") table shows the currently selected event timers:

```sql
mysql> SELECT * FROM performance_schema.setup_timers;
+-------------+-------------+
| NAME        | TIMER_NAME  |
+-------------+-------------+
| idle        | MICROSECOND |
| wait        | CYCLE       |
| stage       | NANOSECOND  |
| statement   | NANOSECOND  |
| transaction | NANOSECOND  |
+-------------+-------------+
```

Note

As of MySQL 5.7.21, the Performance Schema [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table") table is deprecated and is removed in MySQL 8.0, as is the `TICKS` row in the [`performance_timers`](performance-schema-performance-timers-table.html "25.12.16.2 The performance_timers Table") table.

The `setup_timers.TIMER_NAME` value can be changed to select a different timer. The value can be any of the values in the `performance_timers.TIMER_NAME` column. For an explanation of how event timing occurs, see [Section 25.4.1, “Performance Schema Event Timing”](performance-schema-timing.html "25.4.1 Performance Schema Event Timing").

Modifications to the [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table") table affect monitoring immediately. Events already in progress may use the original timer for the begin time and the new timer for the end time. To avoid unpredictable results after you make timer changes, use [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") to reset Performance Schema statistics.

The [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table") table has these columns:

* `NAME`

  The type of instrument the timer is used for.

* `TIMER_NAME`

  The timer that applies to the instrument type. This column can be modified.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is not permitted for the [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table") table.
