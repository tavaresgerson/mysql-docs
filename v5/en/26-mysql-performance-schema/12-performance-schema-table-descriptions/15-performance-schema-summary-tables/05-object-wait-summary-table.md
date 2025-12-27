#### 25.12.15.5 Object Wait Summary Table

The Performance Schema maintains the [`objects_summary_global_by_type`](performance-schema-objects-summary-global-by-type-table.html "25.12.15.5 Object Wait Summary Table") table for aggregating object wait events.

Example object wait event summary information:

```sql
mysql> SELECT * FROM performance_schema.objects_summary_global_by_type\G
...
*************************** 3. row ***************************
   OBJECT_TYPE: TABLE
 OBJECT_SCHEMA: test
   OBJECT_NAME: t
    COUNT_STAR: 3
SUM_TIMER_WAIT: 263126976
MIN_TIMER_WAIT: 1522272
AVG_TIMER_WAIT: 87708678
MAX_TIMER_WAIT: 258428280
...
*************************** 10. row ***************************
   OBJECT_TYPE: TABLE
 OBJECT_SCHEMA: mysql
   OBJECT_NAME: user
    COUNT_STAR: 14
SUM_TIMER_WAIT: 365567592
MIN_TIMER_WAIT: 1141704
AVG_TIMER_WAIT: 26111769
MAX_TIMER_WAIT: 334783032
...
```

The [`objects_summary_global_by_type`](performance-schema-objects-summary-global-by-type-table.html "25.12.15.5 Object Wait Summary Table") table has these grouping columns to indicate how the table aggregates events: `OBJECT_TYPE`, `OBJECT_SCHEMA`, and `OBJECT_NAME`. Each row summarizes events for the given object.

[`objects_summary_global_by_type`](performance-schema-objects-summary-global-by-type-table.html "25.12.15.5 Object Wait Summary Table") has the same summary columns as the `events_waits_summary_by_xxx` tables. See [Section 25.12.15.1, “Wait Event Summary Tables”](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables").

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is permitted for the object summary table. It resets the summary columns to zero rather than removing rows.
