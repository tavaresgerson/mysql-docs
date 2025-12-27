#### 25.12.6.3 The events\_statements\_history\_long Table

The [`events_statements_history_long`](performance-schema-events-statements-history-long-table.html "25.12.6.3 The events_statements_history_long Table") table contains the *`N`* most recent statement events that have ended globally, across all threads. Statement events are not added to the table until they have ended. When the table becomes full, the oldest row is discarded when a new row is added, regardless of which thread generated either row.

The value of *`N`* is autosized at server startup. To set the table size explicitly, set the [`performance_schema_events_statements_history_long_size`](performance-schema-system-variables.html#sysvar_performance_schema_events_statements_history_long_size) system variable at server startup.

The [`events_statements_history_long`](performance-schema-events-statements-history-long-table.html "25.12.6.3 The events_statements_history_long Table") table has the same columns as [`events_statements_current`](performance-schema-events-statements-current-table.html "25.12.6.1 The events_statements_current Table"). See [Section 25.12.6.1, “The events\_statements\_current Table”](performance-schema-events-statements-current-table.html "25.12.6.1 The events_statements_current Table").

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is permitted for the [`events_statements_history_long`](performance-schema-events-statements-history-long-table.html "25.12.6.3 The events_statements_history_long Table") table. It removes the rows.

For more information about the relationship between the three `events_statements_xxx` event tables, see [Section 25.9, “Performance Schema Tables for Current and Historical Events”](performance-schema-event-tables.html "25.9 Performance Schema Tables for Current and Historical Events").

For information about configuring whether to collect statement events, see [Section 25.12.6, “Performance Schema Statement Event Tables”](performance-schema-statement-tables.html "25.12.6 Performance Schema Statement Event Tables").
