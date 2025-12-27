## 25.12 Performance Schema Table Descriptions

[25.12.1 Performance Schema Table Reference](performance-schema-table-reference.html)

[25.12.2 Performance Schema Setup Tables](performance-schema-setup-tables.html)

[25.12.3 Performance Schema Instance Tables](performance-schema-instance-tables.html)

[25.12.4 Performance Schema Wait Event Tables](performance-schema-wait-tables.html)

[25.12.5 Performance Schema Stage Event Tables](performance-schema-stage-tables.html)

[25.12.6 Performance Schema Statement Event Tables](performance-schema-statement-tables.html)

[25.12.7 Performance Schema Transaction Tables](performance-schema-transaction-tables.html)

[25.12.8 Performance Schema Connection Tables](performance-schema-connection-tables.html)

[25.12.9 Performance Schema Connection Attribute Tables](performance-schema-connection-attribute-tables.html)

[25.12.10 Performance Schema User-Defined Variable Tables](performance-schema-user-variable-tables.html)

[25.12.11 Performance Schema Replication Tables](performance-schema-replication-tables.html)

[25.12.12 Performance Schema Lock Tables](performance-schema-lock-tables.html)

[25.12.13 Performance Schema System Variable Tables](performance-schema-system-variable-tables.html)

[25.12.14 Performance Schema Status Variable Tables](performance-schema-status-variable-tables.html)

[25.12.15 Performance Schema Summary Tables](performance-schema-summary-tables.html)

[25.12.16 Performance Schema Miscellaneous Tables](performance-schema-miscellaneous-tables.html)

Tables in the `performance_schema` database can be grouped as follows:

* Setup tables. These tables are used to configure and display monitoring characteristics.

* Current events tables. The [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table") table contains the most recent event for each thread. Other similar tables contain current events at different levels of the event hierarchy: [`events_stages_current`](performance-schema-events-stages-current-table.html "25.12.5.1 The events_stages_current Table") for stage events, [`events_statements_current`](performance-schema-events-statements-current-table.html "25.12.6.1 The events_statements_current Table") for statement events, and [`events_transactions_current`](performance-schema-events-transactions-current-table.html "25.12.7.1 The events_transactions_current Table") for transaction events.

* History tables. These tables have the same structure as the current events tables, but contain more rows. For example, for wait events, [`events_waits_history`](performance-schema-events-waits-history-table.html "25.12.4.2 The events_waits_history Table") table contains the most recent 10 events per thread. [`events_waits_history_long`](performance-schema-events-waits-history-long-table.html "25.12.4.3 The events_waits_history_long Table") contains the most recent 10,000 events. Other similar tables exist for stage, statement, and transaction histories.

  To change the sizes of the history tables, set the appropriate system variables at server startup. For example, to set the sizes of the wait event history tables, set [`performance_schema_events_waits_history_size`](performance-schema-system-variables.html#sysvar_performance_schema_events_waits_history_size) and [`performance_schema_events_waits_history_long_size`](performance-schema-system-variables.html#sysvar_performance_schema_events_waits_history_long_size).

* Summary tables. These tables contain information aggregated over groups of events, including those that have been discarded from the history tables.

* Instance tables. These tables document what types of objects are instrumented. An instrumented object, when used by the server, produces an event. These tables provide event names and explanatory notes or status information.

* Miscellaneous tables. These do not fall into any of the other table groups.
