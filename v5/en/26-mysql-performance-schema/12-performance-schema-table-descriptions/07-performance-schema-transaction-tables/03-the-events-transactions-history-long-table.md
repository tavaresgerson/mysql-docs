#### 25.12.7.3 The events\_transactions\_history\_long Table

The [`events_transactions_history_long`](performance-schema-events-transactions-history-long-table.html "25.12.7.3 The events_transactions_history_long Table") table contains the *`N`* most recent transaction events that have ended globally, across all threads. Transaction events are not added to the table until they have ended. When the table becomes full, the oldest row is discarded when a new row is added, regardless of which thread generated either row.

The Performance Schema autosizes the value of *`N`* is autosized at server startup. To set the table size explicitly, set the [`performance_schema_events_transactions_history_long_size`](performance-schema-system-variables.html#sysvar_performance_schema_events_transactions_history_long_size) system variable at server startup.

The [`events_transactions_history_long`](performance-schema-events-transactions-history-long-table.html "25.12.7.3 The events_transactions_history_long Table") table has the same columns as [`events_transactions_current`](performance-schema-events-transactions-current-table.html "25.12.7.1 The events_transactions_current Table"). See [Section 25.12.7.1, “The events\_transactions\_current Table”](performance-schema-events-transactions-current-table.html "25.12.7.1 The events_transactions_current Table").

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is permitted for the [`events_transactions_history_long`](performance-schema-events-transactions-history-long-table.html "25.12.7.3 The events_transactions_history_long Table") table. It removes the rows.

For more information about the relationship between the three transaction event tables, see [Section 25.9, “Performance Schema Tables for Current and Historical Events”](performance-schema-event-tables.html "25.9 Performance Schema Tables for Current and Historical Events").

For information about configuring whether to collect transaction events, see [Section 25.12.7, “Performance Schema Transaction Tables”](performance-schema-transaction-tables.html "25.12.7 Performance Schema Transaction Tables").
