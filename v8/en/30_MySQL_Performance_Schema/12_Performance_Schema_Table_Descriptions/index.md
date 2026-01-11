## 29.12 Performance Schema Table Descriptions

29.12.1 Performance Schema Table Reference

29.12.2 Performance Schema Setup Tables

29.12.3 Performance Schema Instance Tables

29.12.4 Performance Schema Wait Event Tables

29.12.5 Performance Schema Stage Event Tables

29.12.6 Performance Schema Statement Event Tables

29.12.7 Performance Schema Transaction Tables

29.12.8 Performance Schema Connection Tables

29.12.9 Performance Schema Connection Attribute Tables

29.12.10 Performance Schema User-Defined Variable Tables

29.12.11 Performance Schema Replication Tables

29.12.12 Performance Schema NDB Cluster Tables

29.12.13 Performance Schema Lock Tables

29.12.14 Performance Schema System Variable Tables

29.12.15 Performance Schema Status Variable Tables

29.12.16 Performance Schema Thread Pool Tables

29.12.17 Performance Schema Firewall Tables

29.12.18 Performance Schema Keyring Tables

29.12.19 Performance Schema Clone Tables

29.12.20 Performance Schema Summary Tables

29.12.21 Performance Schema Miscellaneous Tables

Tables in the `performance_schema` database can be grouped as follows:

* Setup tables. These tables are used to configure and display monitoring characteristics.

* Current events tables. The `events_waits_current` table contains the most recent event for each thread. Other similar tables contain current events at different levels of the event hierarchy: `events_stages_current` for stage events, `events_statements_current` for statement events, and `events_transactions_current` for transaction events.

* History tables. These tables have the same structure as the current events tables, but contain more rows. For example, for wait events, `events_waits_history` table contains the most recent 10 events per thread. `events_waits_history_long` contains the most recent 10,000 events. Other similar tables exist for stage, statement, and transaction histories.

  To change the sizes of the history tables, set the appropriate system variables at server startup. For example, to set the sizes of the wait event history tables, set `performance_schema_events_waits_history_size` and `performance_schema_events_waits_history_long_size`.

* Summary tables. These tables contain information aggregated over groups of events, including those that have been discarded from the history tables.

* Instance tables. These tables document what types of objects are instrumented. An instrumented object, when used by the server, produces an event. These tables provide event names and explanatory notes or status information.

* Miscellaneous tables. These do not fall into any of the other table groups.
