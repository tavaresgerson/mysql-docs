#### 25.12.5.2 The events_stages_history Table

The [`events_stages_history`](performance-schema-events-stages-history-table.html "25.12.5.2 The events_stages_history Table") table contains the *`N`* most recent stage events that have ended per thread. Stage events are not added to the table until they have ended. When the table contains the maximum number of rows for a given thread, the oldest thread row is discarded when a new row for that thread is added. When a thread ends, all its rows are discarded.

The Performance Schema autosizes the value of *`N`* during server startup. To set the number of rows per thread explicitly, set the [`performance_schema_events_stages_history_size`](performance-schema-system-variables.html#sysvar_performance_schema_events_stages_history_size) system variable at server startup.

The [`events_stages_history`](performance-schema-events-stages-history-table.html "25.12.5.2 The events_stages_history Table") table has the same columns as [`events_stages_current`](performance-schema-events-stages-current-table.html "25.12.5.1 The events_stages_current Table"). See [Section 25.12.5.1, “The events_stages_current Table”](performance-schema-events-stages-current-table.html "25.12.5.1 The events_stages_current Table").

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is permitted for the [`events_stages_history`](performance-schema-events-stages-history-table.html "25.12.5.2 The events_stages_history Table") table. It removes the rows.

For more information about the relationship between the three stage event tables, see [Section 25.9, “Performance Schema Tables for Current and Historical Events”](performance-schema-event-tables.html "25.9 Performance Schema Tables for Current and Historical Events").

For information about configuring whether to collect stage events, see [Section 25.12.5, “Performance Schema Stage Event Tables”](performance-schema-stage-tables.html "25.12.5 Performance Schema Stage Event Tables").
