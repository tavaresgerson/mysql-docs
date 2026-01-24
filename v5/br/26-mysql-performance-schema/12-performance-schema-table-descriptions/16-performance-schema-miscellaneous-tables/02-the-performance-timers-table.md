#### 25.12.16.2 The performance_timers Table

The [`performance_timers`](performance-schema-performance-timers-table.html "25.12.16.2 The performance_timers Table") table shows which event timers are available:

```sql
mysql> SELECT * FROM performance_schema.performance_timers;
+-------------+-----------------+------------------+----------------+
| TIMER_NAME  | TIMER_FREQUENCY | TIMER_RESOLUTION | TIMER_OVERHEAD |
+-------------+-----------------+------------------+----------------+
| CYCLE       |      2389029850 |                1 |             72 |
| NANOSECOND  |      1000000000 |                1 |            112 |
| MICROSECOND |         1000000 |                1 |            136 |
| MILLISECOND |            1036 |                1 |            168 |
| TICK        |             105 |                1 |           2416 |
+-------------+-----------------+------------------+----------------+
```

If the values associated with a given timer name are `NULL`, that timer is not supported on your platform. The rows that do not contain `NULL` indicate which timers you can use in [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table"). For an explanation of how event timing occurs, see [Section 25.4.1, “Performance Schema Event Timing”](performance-schema-timing.html "25.4.1 Performance Schema Event Timing").

Note

As of MySQL 5.7.21, the Performance Schema [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table") table is deprecated and is removed in MySQL 8.0, as is the `TICKS` row in the [`performance_timers`](performance-schema-performance-timers-table.html "25.12.16.2 The performance_timers Table") table.

The [`performance_timers`](performance-schema-performance-timers-table.html "25.12.16.2 The performance_timers Table") table has these columns:

* `TIMER_NAME`

  The name by which to refer to the timer when configuring the [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table") table.

* `TIMER_FREQUENCY`

  The number of timer units per second. For a cycle timer, the frequency is generally related to the CPU speed. For example, on a system with a 2.4GHz processor, the `CYCLE` may be close to 2400000000.

* `TIMER_RESOLUTION`

  Indicates the number of timer units by which timer values increase. If a timer has a resolution of 10, its value increases by 10 each time.

* `TIMER_OVERHEAD`

  The minimal number of cycles of overhead to obtain one timing with the given timer. The Performance Schema determines this value by invoking the timer 20 times during initialization and picking the smallest value. The total overhead really is twice this amount because the instrumentation invokes the timer at the start and end of each event. The timer code is called only for timed events, so this overhead does not apply for nontimed events.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is not permitted for the [`performance_timers`](performance-schema-performance-timers-table.html "25.12.16.2 The performance_timers Table") table.
