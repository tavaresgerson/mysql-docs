#### 25.12.6.1 The events_statements_current Table

The [`events_statements_current`](performance-schema-events-statements-current-table.html "25.12.6.1 The events_statements_current Table") table contains current statement events. The table stores one row per thread showing the current status of the thread's most recent monitored statement event, so there is no system variable for configuring the table size.

Of the tables that contain statement event rows, [`events_statements_current`](performance-schema-events-statements-current-table.html "25.12.6.1 The events_statements_current Table") is the most fundamental. Other tables that contain statement event rows are logically derived from the current events. For example, the [`events_statements_history`](performance-schema-events-statements-history-table.html "25.12.6.2 The events_statements_history Table") and [`events_statements_history_long`](performance-schema-events-statements-history-long-table.html "25.12.6.3 The events_statements_history_long Table") tables are collections of the most recent statement events that have ended, up to a maximum number of rows per thread and globally across all threads, respectively.

For more information about the relationship between the three `events_statements_xxx` event tables, see [Section 25.9, “Performance Schema Tables for Current and Historical Events”](performance-schema-event-tables.html "25.9 Performance Schema Tables for Current and Historical Events").

For information about configuring whether to collect statement events, see [Section 25.12.6, “Performance Schema Statement Event Tables”](performance-schema-statement-tables.html "25.12.6 Performance Schema Statement Event Tables").

The [`events_statements_current`](performance-schema-events-statements-current-table.html "25.12.6.1 The events_statements_current Table") table has these columns:

* `THREAD_ID`, `EVENT_ID`

  The thread associated with the event and the thread current event number when the event starts. The `THREAD_ID` and `EVENT_ID` values taken together uniquely identify the row. No two rows have the same pair of values.

* `END_EVENT_ID`

  This column is set to `NULL` when the event starts and updated to the thread current event number when the event ends.

* `EVENT_NAME`

  The name of the instrument from which the event was collected. This is a `NAME` value from the [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") table. Instrument names may have multiple parts and form a hierarchy, as discussed in [Section 25.6, “Performance Schema Instrument Naming Conventions”](performance-schema-instrument-naming.html "25.6 Performance Schema Instrument Naming Conventions").

  For SQL statements, the `EVENT_NAME` value initially is `statement/com/Query` until the statement is parsed, then changes to a more appropriate value, as described in [Section 25.12.6, “Performance Schema Statement Event Tables”](performance-schema-statement-tables.html "25.12.6 Performance Schema Statement Event Tables").

* `SOURCE`

  The name of the source file containing the instrumented code that produced the event and the line number in the file at which the instrumentation occurs. This enables you to check the source to determine exactly what code is involved.

* `TIMER_START`, `TIMER_END`, `TIMER_WAIT`

  Timing information for the event. The unit for these values is picoseconds (trillionths of a second). The `TIMER_START` and `TIMER_END` values indicate when event timing started and ended. `TIMER_WAIT` is the event elapsed time (duration).

  If an event has not finished, `TIMER_END` is the current timer value and `TIMER_WAIT` is the time elapsed so far (`TIMER_END` − `TIMER_START`).

  If an event is produced from an instrument that has `TIMED = NO`, timing information is not collected, and `TIMER_START`, `TIMER_END`, and `TIMER_WAIT` are all `NULL`.

  For discussion of picoseconds as the unit for event times and factors that affect time values, see [Section 25.4.1, “Performance Schema Event Timing”](performance-schema-timing.html "25.4.1 Performance Schema Event Timing").

* `LOCK_TIME`

  The time spent waiting for table locks. This value is computed in microseconds but normalized to picoseconds for easier comparison with other Performance Schema timers.

* `SQL_TEXT`

  The text of the SQL statement. For a command not associated with an SQL statement, the value is `NULL`.

  The maximum space available for statement display is 1024 bytes by default. To change this value, set the [`performance_schema_max_sql_text_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_sql_text_length) system variable at server startup.

* `DIGEST`

  The statement digest MD5 value as a string of 32 hexadecimal characters, or `NULL` if the `statements_digest` consumer is `no`. For more information about statement digesting, see [Section 25.10, “Performance Schema Statement Digests”](performance-schema-statement-digests.html "25.10 Performance Schema Statement Digests").

* `DIGEST_TEXT`

  The normalized statement digest text, or `NULL` if the `statements_digest` consumer is `no`. For more information about statement digesting, see [Section 25.10, “Performance Schema Statement Digests”](performance-schema-statement-digests.html "25.10 Performance Schema Statement Digests").

  The [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length) system variable determines the maximum number of bytes available per session for digest value storage. However, the display length of statement digests may be longer than the available buffer size due to encoding of statement elements such as keywords and literal values in digest buffer. Consequently, values selected from the `DIGEST_TEXT` column of statement event tables may appear to exceed the [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length) value.

* `CURRENT_SCHEMA`

  The default database for the statement, `NULL` if there is none.

* `OBJECT_SCHEMA`, `OBJECT_NAME`, `OBJECT_TYPE`

  For nested statements (stored programs), these columns contain information about the parent statement. Otherwise they are `NULL`.

* `OBJECT_INSTANCE_BEGIN`

  This column identifies the statement. The value is the address of an object in memory.

* `MYSQL_ERRNO`

  The statement error number, from the statement diagnostics area.

* `RETURNED_SQLSTATE`

  The statement SQLSTATE value, from the statement diagnostics area.

* `MESSAGE_TEXT`

  The statement error message, from the statement diagnostics area.

* `ERRORS`

  Whether an error occurred for the statement. The value is 0 if the SQLSTATE value begins with `00` (completion) or `01` (warning). The value is 1 is the SQLSTATE value is anything else.

* `WARNINGS`

  The number of warnings, from the statement diagnostics area.

* `ROWS_AFFECTED`

  The number of rows affected by the statement. For a description of the meaning of “affected,” see [mysql_affected_rows()](/doc/c-api/5.7/en/mysql-affected-rows.html).

* `ROWS_SENT`

  The number of rows returned by the statement.

* `ROWS_EXAMINED`

  The number of rows examined by the server layer (not counting any processing internal to storage engines).

* `CREATED_TMP_DISK_TABLES`

  Like the [`Created_tmp_disk_tables`](server-status-variables.html#statvar_Created_tmp_disk_tables) status variable, but specific to the statement.

* `CREATED_TMP_TABLES`

  Like the [`Created_tmp_tables`](server-status-variables.html#statvar_Created_tmp_tables) status variable, but specific to the statement.

* `SELECT_FULL_JOIN`

  Like the [`Select_full_join`](server-status-variables.html#statvar_Select_full_join) status variable, but specific to the statement.

* `SELECT_FULL_RANGE_JOIN`

  Like the [`Select_full_range_join`](server-status-variables.html#statvar_Select_full_range_join) status variable, but specific to the statement.

* `SELECT_RANGE`

  Like the [`Select_range`](server-status-variables.html#statvar_Select_range) status variable, but specific to the statement.

* `SELECT_RANGE_CHECK`

  Like the [`Select_range_check`](server-status-variables.html#statvar_Select_range_check) status variable, but specific to the statement.

* `SELECT_SCAN`

  Like the [`Select_scan`](server-status-variables.html#statvar_Select_scan) status variable, but specific to the statement.

* `SORT_MERGE_PASSES`

  Like the [`Sort_merge_passes`](server-status-variables.html#statvar_Sort_merge_passes) status variable, but specific to the statement.

* `SORT_RANGE`

  Like the [`Sort_range`](server-status-variables.html#statvar_Sort_range) status variable, but specific to the statement.

* `SORT_ROWS`

  Like the [`Sort_rows`](server-status-variables.html#statvar_Sort_rows) status variable, but specific to the statement.

* `SORT_SCAN`

  Like the [`Sort_scan`](server-status-variables.html#statvar_Sort_scan) status variable, but specific to the statement.

* `NO_INDEX_USED`

  1 if the statement performed a table scan without using an index, 0 otherwise.

* `NO_GOOD_INDEX_USED`

  1 if the server found no good index to use for the statement, 0 otherwise. For additional information, see the description of the `Extra` column from `EXPLAIN` output for the `Range checked for each record` value in [Section 8.8.2, “EXPLAIN Output Format”](explain-output.html "8.8.2 EXPLAIN Output Format").

* `NESTING_EVENT_ID`, `NESTING_EVENT_TYPE`, `NESTING_EVENT_LEVEL`

  These three columns are used with other columns to provide information as follows for top-level (unnested) statements and nested statements (executed within a stored program).

  For top level statements:

  ```sql
  OBJECT_TYPE = NULL
  OBJECT_SCHEMA = NULL
  OBJECT_NAME = NULL
  NESTING_EVENT_ID = NULL
  NESTING_EVENT_TYPE = NULL
  NESTING_LEVEL = 0
  ```

  For nested statements:

  ```sql
  OBJECT_TYPE = the parent statement object type
  OBJECT_SCHEMA = the parent statement object schema
  OBJECT_NAME = the parent statement object name
  NESTING_EVENT_ID = the parent statement EVENT_ID
  NESTING_EVENT_TYPE = 'STATEMENT'
  NESTING_LEVEL = the parent statement NESTING_LEVEL plus one
  ```

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is permitted for the [`events_statements_current`](performance-schema-events-statements-current-table.html "25.12.6.1 The events_statements_current Table") table. It removes the rows.
