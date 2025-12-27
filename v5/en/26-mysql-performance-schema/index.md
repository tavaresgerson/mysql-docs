# Chapter 25 MySQL Performance Schema

**Table of Contents**

[25.1 Performance Schema Quick Start](performance-schema-quick-start.html)

[25.2 Performance Schema Build Configuration](performance-schema-build-configuration.html)

[25.3 Performance Schema Startup Configuration](performance-schema-startup-configuration.html)

[25.4 Performance Schema Runtime Configuration](performance-schema-runtime-configuration.html) :   [25.4.1 Performance Schema Event Timing](performance-schema-timing.html)

    [25.4.2 Performance Schema Event Filtering](performance-schema-filtering.html)

    [25.4.3 Event Pre-Filtering](performance-schema-pre-filtering.html)

    [25.4.4 Pre-Filtering by Instrument](performance-schema-instrument-filtering.html)

    [25.4.5 Pre-Filtering by Object](performance-schema-object-filtering.html)

    [25.4.6 Pre-Filtering by Thread](performance-schema-thread-filtering.html)

    [25.4.7 Pre-Filtering by Consumer](performance-schema-consumer-filtering.html)

    [25.4.8 Example Consumer Configurations](performance-schema-consumer-configurations.html)

    [25.4.9 Naming Instruments or Consumers for Filtering Operations](performance-schema-filtering-names.html)

    [25.4.10 Determining What Is Instrumented](performance-schema-instrumentation-checking.html)

[25.5 Performance Schema Queries](performance-schema-queries.html)

[25.6 Performance Schema Instrument Naming Conventions](performance-schema-instrument-naming.html)

[25.7 Performance Schema Status Monitoring](performance-schema-status-monitoring.html)

[25.8 Performance Schema Atom and Molecule Events](performance-schema-atom-molecule-events.html)

[25.9 Performance Schema Tables for Current and Historical Events](performance-schema-event-tables.html)

[25.10 Performance Schema Statement Digests](performance-schema-statement-digests.html)

[25.11 Performance Schema General Table Characteristics](performance-schema-table-characteristics.html)

[25.12 Performance Schema Table Descriptions](performance-schema-table-descriptions.html) :   [25.12.1 Performance Schema Table Reference](performance-schema-table-reference.html)

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

[25.13 Performance Schema Option and Variable Reference](performance-schema-option-variable-reference.html)

[25.14 Performance Schema Command Options](performance-schema-options.html)

[25.15 Performance Schema System Variables](performance-schema-system-variables.html)

[25.16 Performance Schema Status Variables](performance-schema-status-variables.html)

[25.17 The Performance Schema Memory-Allocation Model](performance-schema-memory-model.html)

[25.18 Performance Schema and Plugins](performance-schema-and-plugins.html)

[25.19 Using the Performance Schema to Diagnose Problems](performance-schema-examples.html) :   [25.19.1 Query Profiling Using Performance Schema](performance-schema-query-profiling.html)

[25.20 Migrating to Performance Schema System and Status Variable Tables](performance-schema-variable-table-migration.html)

[25.21 Restrictions on Performance Schema](performance-schema-restrictions.html)

The MySQL Performance Schema is a feature for monitoring MySQL Server execution at a low level. The Performance Schema has these characteristics:

* The Performance Schema provides a way to inspect internal execution of the server at runtime. It is implemented using the [`PERFORMANCE_SCHEMA`](performance-schema.html "Chapter 25 MySQL Performance Schema") storage engine and the `performance_schema` database. The Performance Schema focuses primarily on performance data. This differs from `INFORMATION_SCHEMA`, which serves for inspection of metadata.

* The Performance Schema monitors server events. An “event” is anything the server does that takes time and has been instrumented so that timing information can be collected. In general, an event could be a function call, a wait for the operating system, a stage of an SQL statement execution such as parsing or sorting, or an entire statement or group of statements. Event collection provides access to information about synchronization calls (such as for mutexes) file and table I/O, table locks, and so forth for the server and for several storage engines.

* Performance Schema events are distinct from events written to the server's binary log (which describe data modifications) and Event Scheduler events (which are a type of stored program).

* Performance Schema events are specific to a given instance of the MySQL Server. Performance Schema tables are considered local to the server, and changes to them are not replicated or written to the binary log.

* Current events are available, as well as event histories and summaries. This enables you to determine how many times instrumented activities were performed and how much time they took. Event information is available to show the activities of specific threads, or activity associated with particular objects such as a mutex or file.

* The [`PERFORMANCE_SCHEMA`](performance-schema.html "Chapter 25 MySQL Performance Schema") storage engine collects event data using “instrumentation points” in server source code.

* Collected events are stored in tables in the `performance_schema` database. These tables can be queried using [`SELECT`](select.html "13.2.9 SELECT Statement") statements like other tables.

* Performance Schema configuration can be modified dynamically by updating tables in the `performance_schema` database through SQL statements. Configuration changes affect data collection immediately.

* Tables in the Performance Schema are in-memory tables that use no persistent on-disk storage. The contents are repopulated beginning at server startup and discarded at server shutdown.

* Monitoring is available on all platforms supported by MySQL.

  Some limitations might apply: The types of timers might vary per platform. Instruments that apply to storage engines might not be implemented for all storage engines. Instrumentation of each third-party engine is the responsibility of the engine maintainer. See also [Section 25.21, “Restrictions on Performance Schema”](performance-schema-restrictions.html "25.21 Restrictions on Performance Schema").

* Data collection is implemented by modifying the server source code to add instrumentation. There are no separate threads associated with the Performance Schema, unlike other features such as replication or the Event Scheduler.

The Performance Schema is intended to provide access to useful information about server execution while having minimal impact on server performance. The implementation follows these design goals:

* Activating the Performance Schema causes no changes in server behavior. For example, it does not cause thread scheduling to change, and it does not cause query execution plans (as shown by [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement")) to change.

* Server monitoring occurs continuously and unobtrusively with very little overhead. Activating the Performance Schema does not make the server unusable.

* The parser is unchanged. There are no new keywords or statements.

* Execution of server code proceeds normally even if the Performance Schema fails internally.

* When there is a choice between performing processing during event collection initially or during event retrieval later, priority is given to making collection faster. This is because collection is ongoing whereas retrieval is on demand and might never happen at all.

* It is easy to add new instrumentation points.
* Instrumentation is versioned. If the instrumentation implementation changes, previously instrumented code continues to work. This benefits developers of third-party plugins because it is not necessary to upgrade each plugin to stay synchronized with the latest Performance Schema changes.

Note

The MySQL `sys` schema is a set of objects that provides convenient access to data collected by the Performance Schema. The `sys` schema is installed by default. For usage instructions, see [Chapter 26, *MySQL sys Schema*](sys-schema.html "Chapter 26 MySQL sys Schema").
