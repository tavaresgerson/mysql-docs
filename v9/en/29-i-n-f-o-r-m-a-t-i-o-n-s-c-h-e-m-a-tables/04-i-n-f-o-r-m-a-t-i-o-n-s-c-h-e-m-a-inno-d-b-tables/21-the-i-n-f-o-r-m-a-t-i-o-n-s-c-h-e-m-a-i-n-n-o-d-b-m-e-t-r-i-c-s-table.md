### 28.4.21 The INFORMATION_SCHEMA INNODB_METRICS Table

The `INNODB_METRICS` table provides a wide variety of `InnoDB` performance information, complementing the specific focus areas of the Performance Schema tables for `InnoDB`. With simple queries, you can check the overall health of the system. With more detailed queries, you can diagnose issues such as performance bottlenecks, resource shortages, and application issues.

Each monitor represents a point within the `InnoDB` source code that is instrumented to gather counter information. Each counter can be started, stopped, and reset. You can also perform these actions for a group of counters using their common module name.

By default, relatively little data is collected. To start, stop, and reset counters, set one of the system variables `innodb_monitor_enable`, `innodb_monitor_disable`, `innodb_monitor_reset`, or `innodb_monitor_reset_all`, using the name of the counter, the name of the module, a wildcard match for such a name using the “%” character, or the special keyword `all`.

For usage information, see Section 17.15.6, “InnoDB INFORMATION_SCHEMA Metrics Table”.

The `INNODB_METRICS` table has these columns:

* `NAME`

  A unique name for the counter.

* `SUBSYSTEM`

  The aspect of `InnoDB` that the metric applies to.

* `COUNT`

  The value since the counter was enabled.

* `MAX_COUNT`

  The maximum value since the counter was enabled.

* `MIN_COUNT`

  The minimum value since the counter was enabled.

* `AVG_COUNT`

  The average value since the counter was enabled.

* `COUNT_RESET`

  The counter value since it was last reset. (The `_RESET` columns act like the lap counter on a stopwatch: you can measure the activity during some time interval, while the cumulative figures are still available in `COUNT`, `MAX_COUNT`, and so on.)

* `MAX_COUNT_RESET`

  The maximum counter value since it was last reset.

* `MIN_COUNT_RESET`

  The minimum counter value since it was last reset.

* `AVG_COUNT_RESET`

  The average counter value since it was last reset.

* `TIME_ENABLED`

  The timestamp of the last start.

* `TIME_DISABLED`

  The timestamp of the last stop.

* `TIME_ELAPSED`

  The elapsed time in seconds since the counter started.

* `TIME_RESET`

  The timestamp of the last reset.

* `STATUS`

  Whether the counter is still running (`enabled`) or stopped (`disabled`).

* `TYPE`

  Whether the item is a cumulative counter, or measures the current value of some resource.

* `COMMENT`

  The counter description.

#### Example

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME='dml_inserts'\G
*************************** 1. row ***************************
           NAME: dml_inserts
      SUBSYSTEM: dml
          COUNT: 3
      MAX_COUNT: 3
      MIN_COUNT: NULL
      AVG_COUNT: 0.046153846153846156
    COUNT_RESET: 3
MAX_COUNT_RESET: 3
MIN_COUNT_RESET: NULL
AVG_COUNT_RESET: NULL
   TIME_ENABLED: 2014-12-04 14:18:28
  TIME_DISABLED: NULL
   TIME_ELAPSED: 65
     TIME_RESET: NULL
         STATUS: enabled
           TYPE: status_counter
        COMMENT: Number of rows inserted
```

#### Notes

* You must have the `PROCESS` privilege to query this table.

* Use the `INFORMATION_SCHEMA` `COLUMNS` table or the `SHOW COLUMNS` statement to view additional information about the columns of this table, including data types and default values.

* Transaction counter `COUNT` values may differ from the number of transaction events reported in Performance Schema `EVENTS_TRANSACTIONS_SUMMARY` tables. `InnoDB` counts only those transactions that it executes, whereas Performance Schema collects events for all non-aborted transactions initiated by the server, including empty transactions.
