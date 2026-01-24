#### 25.12.15.3 Statement Summary Tables

The Performance Schema maintains tables for collecting current and recent statement events, and aggregates that information in summary tables. [Section 25.12.6, “Performance Schema Statement Event Tables”](performance-schema-statement-tables.html "25.12.6 Performance Schema Statement Event Tables") describes the events on which statement summaries are based. See that discussion for information about the content of statement events, the current and historical statement event tables, and how to control statement event collection, which is partially disabled by default.

Example statement event summary information:

```sql
mysql> SELECT *
       FROM performance_schema.events_statements_summary_global_by_event_name\G
*************************** 1. row ***************************
                 EVENT_NAME: statement/sql/select
                 COUNT_STAR: 25
             SUM_TIMER_WAIT: 1535983999000
             MIN_TIMER_WAIT: 209823000
             AVG_TIMER_WAIT: 61439359000
             MAX_TIMER_WAIT: 1363397650000
              SUM_LOCK_TIME: 20186000000
                 SUM_ERRORS: 0
               SUM_WARNINGS: 0
          SUM_ROWS_AFFECTED: 0
              SUM_ROWS_SENT: 388
          SUM_ROWS_EXAMINED: 370
SUM_CREATED_TMP_DISK_TABLES: 0
     SUM_CREATED_TMP_TABLES: 0
       SUM_SELECT_FULL_JOIN: 0
 SUM_SELECT_FULL_RANGE_JOIN: 0
           SUM_SELECT_RANGE: 0
     SUM_SELECT_RANGE_CHECK: 0
            SUM_SELECT_SCAN: 6
      SUM_SORT_MERGE_PASSES: 0
             SUM_SORT_RANGE: 0
              SUM_SORT_ROWS: 0
              SUM_SORT_SCAN: 0
          SUM_NO_INDEX_USED: 6
     SUM_NO_GOOD_INDEX_USED: 0
...
```

Each statement summary table has one or more grouping columns to indicate how the table aggregates events. Event names refer to names of event instruments in the [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") table:

* [`events_statements_summary_by_account_by_event_name`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables") has `EVENT_NAME`, `USER`, and `HOST` columns. Each row summarizes events for a given account (user and host combination) and event name.

* [`events_statements_summary_by_digest`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables") has `SCHEMA_NAME` and `DIGEST` columns. Each row summarizes events per schema and digest value. (The `DIGEST_TEXT` column contains the corresponding normalized statement digest text, but is neither a grouping nor a summary column.)

  The maximum number of rows in the table is autosized at server startup. To set this maximum explicitly, set the [`performance_schema_digests_size`](performance-schema-system-variables.html#sysvar_performance_schema_digests_size) system variable at server startup.

* [`events_statements_summary_by_host_by_event_name`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables") has `EVENT_NAME` and `HOST` columns. Each row summarizes events for a given host and event name.

* [`events_statements_summary_by_program`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables") has `OBJECT_TYPE`, `OBJECT_SCHEMA`, and `OBJECT_NAME` columns. Each row summarizes events for a given stored program (stored procedure or function, trigger, or event).

* [`events_statements_summary_by_thread_by_event_name`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables") has `THREAD_ID` and `EVENT_NAME` columns. Each row summarizes events for a given thread and event name.

* [`events_statements_summary_by_user_by_event_name`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables") has `EVENT_NAME` and `USER` columns. Each row summarizes events for a given user and event name.

* [`events_statements_summary_global_by_event_name`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables") has an `EVENT_NAME` column. Each row summarizes events for a given event name.

* [`prepared_statements_instances`](performance-schema-prepared-statements-instances-table.html "25.12.6.4 The prepared_statements_instances Table") has an `OBJECT_INSTANCE_BEGIN` column. Each row summarizes events for a given prepared statement.

Each statement summary table has these summary columns containing aggregated values (with exceptions as noted):

* `COUNT_STAR`, `SUM_TIMER_WAIT`, `MIN_TIMER_WAIT`, `AVG_TIMER_WAIT`, `MAX_TIMER_WAIT`

  These columns are analogous to the columns of the same names in the wait event summary tables (see [Section 25.12.15.1, “Wait Event Summary Tables”](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables")), except that the statement summary tables aggregate events from [`events_statements_current`](performance-schema-events-statements-current-table.html "25.12.6.1 The events_statements_current Table") rather than [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table").

  The [`prepared_statements_instances`](performance-schema-prepared-statements-instances-table.html "25.12.6.4 The prepared_statements_instances Table") table does not have these columns.

* `SUM_xxx`

  The aggregate of the corresponding *`xxx`* column in the [`events_statements_current`](performance-schema-events-statements-current-table.html "25.12.6.1 The events_statements_current Table") table. For example, the `SUM_LOCK_TIME` and `SUM_ERRORS` columns in statement summary tables are the aggregates of the `LOCK_TIME` and `ERRORS` columns in [`events_statements_current`](performance-schema-events-statements-current-table.html "25.12.6.1 The events_statements_current Table") table.

The [`events_statements_summary_by_digest`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables") table has these additional summary columns:

* `FIRST_SEEN`, `LAST_SEEN`

  Timestamps indicating when statements with the given digest value were first seen and most recently seen.

The [`events_statements_summary_by_program`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables") table has these additional summary columns:

* `COUNT_STATEMENTS`, `SUM_STATEMENTS_WAIT`, `MIN_STATEMENTS_WAIT`, `AVG_STATEMENTS_WAIT`, `MAX_STATEMENTS_WAIT`

  Statistics about nested statements invoked during stored program execution.

The [`prepared_statements_instances`](performance-schema-prepared-statements-instances-table.html "25.12.6.4 The prepared_statements_instances Table") table has these additional summary columns:

* `COUNT_EXECUTE`, `SUM_TIMER_EXECUTE`, `MIN_TIMER_EXECUTE`, `AVG_TIMER_EXECUTE`, `MAX_TIMER_EXECUTE`

  Aggregated statistics for executions of the prepared statement.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is permitted for statement summary tables. It has these effects:

* For [`events_statements_summary_by_digest`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables"), it removes the rows.

* For other summary tables not aggregated by account, host, or user, truncation resets the summary columns to zero rather than removing rows.

* For other summary tables aggregated by account, host, or user, truncation removes rows for accounts, hosts, or users with no connections, and resets the summary columns to zero for the remaining rows.

In addition, each statement summary table that is aggregated by account, host, user, or thread is implicitly truncated by truncation of the connection table on which it depends, or truncation of [`events_statements_summary_global_by_event_name`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables"). For details, see [Section 25.12.8, “Performance Schema Connection Tables”](performance-schema-connection-tables.html "25.12.8 Performance Schema Connection Tables").

##### Statement Digest Aggregation Rules

If the `statements_digest` consumer is enabled, aggregation into [`events_statements_summary_by_digest`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables") occurs as follows when a statement completes. Aggregation is based on the `DIGEST` value computed for the statement.

* If a [`events_statements_summary_by_digest`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables") row already exists with the digest value for the statement that just completed, statistics for the statement are aggregated to that row. The `LAST_SEEN` column is updated to the current time.

* If no row has the digest value for the statement that just completed, and the table is not full, a new row is created for the statement. The `FIRST_SEEN` and `LAST_SEEN` columns are initialized with the current time.

* If no row has the statement digest value for the statement that just completed, and the table is full, the statistics for the statement that just completed are added to a special “catch-all” row with `DIGEST` = `NULL`, which is created if necessary. If the row is created, the `FIRST_SEEN` and `LAST_SEEN` columns are initialized with the current time. Otherwise, the `LAST_SEEN` column is updated with the current time.

The row with `DIGEST` = `NULL` is maintained because Performance Schema tables have a maximum size due to memory constraints. The `DIGEST` = `NULL` row permits digests that do not match other rows to be counted even if the summary table is full, using a common “other” bucket. This row helps you estimate whether the digest summary is representative:

* A `DIGEST` = `NULL` row that has a `COUNT_STAR` value that represents 5% of all digests shows that the digest summary table is very representative; the other rows cover 95% of the statements seen.

* A `DIGEST` = `NULL` row that has a `COUNT_STAR` value that represents 50% of all digests shows that the digest summary table is not very representative; the other rows cover only half the statements seen. Most likely the DBA should increase the maximum table size so that more of the rows counted in the `DIGEST` = `NULL` row would be counted using more specific rows instead. By default, the table is autosized, but if this size is too small, set the [`performance_schema_digests_size`](performance-schema-system-variables.html#sysvar_performance_schema_digests_size) system variable to a larger value at server startup.

##### Stored Program Instrumentation Behavior

For stored program types for which instrumentation is enabled in the [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") table, [`events_statements_summary_by_program`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables") maintains statistics for stored programs as follows:

* A row is added for an object when it is first used in the server.

* The row for an object is removed when the object is dropped.

* Statistics are aggregated in the row for an object as it executes.

See also [Section 25.4.3, “Event Pre-Filtering”](performance-schema-pre-filtering.html "25.4.3 Event Pre-Filtering").
