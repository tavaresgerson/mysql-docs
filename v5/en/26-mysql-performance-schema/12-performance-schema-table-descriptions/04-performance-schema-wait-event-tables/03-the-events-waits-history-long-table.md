#### 25.12.4.3 The events\_waits\_history\_long Table

The [`events_waits_history_long`](performance-schema-events-waits-history-long-table.html "25.12.4.3 The events_waits_history_long Table") table contains *`N`* the most recent wait events that have ended globally, across all threads. Wait events are not added to the table until they have ended. When the table becomes full, the oldest row is discarded when a new row is added, regardless of which thread generated either row.

The Performance Schema autosizes the value of *`N`* during server startup. To set the table size explicitly, set the [`performance_schema_events_waits_history_long_size`](performance-schema-system-variables.html#sysvar_performance_schema_events_waits_history_long_size) system variable at server startup.

The [`events_waits_history_long`](performance-schema-events-waits-history-long-table.html "25.12.4.3 The events_waits_history_long Table") table has the same columns as [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table"). See [Section 25.12.4.1, “The events\_waits\_current Table”](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table").

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is permitted for the [`events_waits_history_long`](performance-schema-events-waits-history-long-table.html "25.12.4.3 The events_waits_history_long Table") table. It removes the rows.

For more information about the relationship between the three wait event tables, see [Section 25.9, “Performance Schema Tables for Current and Historical Events”](performance-schema-event-tables.html "25.9 Performance Schema Tables for Current and Historical Events").

For information about configuring whether to collect wait events, see [Section 25.12.4, “Performance Schema Wait Event Tables”](performance-schema-wait-tables.html "25.12.4 Performance Schema Wait Event Tables").
