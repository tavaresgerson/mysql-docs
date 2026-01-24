### 25.4.8 Example Consumer Configurations

The consumer settings in the [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") table form a hierarchy from higher levels to lower. The following discussion describes how consumers work, showing specific configurations and their effects as consumer settings are enabled progressively from high to low. The consumer values shown are representative. The general principles described here apply to other consumer values that may be available.

The configuration descriptions occur in order of increasing functionality and overhead. If you do not need the information provided by enabling lower-level settings, disable them and the Performance Schema executes less code on your behalf and you have less information to sift through.

The [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") table contains the following hierarchy of values:

```sql
global_instrumentation
 thread_instrumentation
   events_waits_current
     events_waits_history
     events_waits_history_long
   events_stages_current
     events_stages_history
     events_stages_history_long
   events_statements_current
     events_statements_history
     events_statements_history_long
   events_transactions_current
     events_transactions_history
     events_transactions_history_long
 statements_digest
```

Note

In the consumer hierarchy, the consumers for waits, stages, statements, and transactions are all at the same level. This differs from the event nesting hierarchy, for which wait events nest within stage events, which nest within statement events, which nest within transaction events.

If a given consumer setting is `NO`, the Performance Schema disables the instrumentation associated with the consumer and ignores all lower-level settings. If a given setting is `YES`, the Performance Schema enables the instrumentation associated with it and checks the settings at the next lowest level. For a description of the rules for each consumer, see [Section 25.4.7, “Pre-Filtering by Consumer”](performance-schema-consumer-filtering.html "25.4.7 Pre-Filtering by Consumer").

For example, if `global_instrumentation` is enabled, `thread_instrumentation` is checked. If `thread_instrumentation` is enabled, the `events_xxx_current` consumers are checked. If of these `events_waits_current` is enabled, `events_waits_history` and `events_waits_history_long` are checked.

Each of the following configuration descriptions indicates which setup elements the Performance Schema checks and which output tables it maintains (that is, for which tables it collects information).

* [No Instrumentation](performance-schema-consumer-configurations.html#performance-schema-consumer-configurations-no-instrumentation "No Instrumentation")
* [Global Instrumentation Only](performance-schema-consumer-configurations.html#performance-schema-consumer-configurations-global-instrumentation-only "Global Instrumentation Only")
* [Global and Thread Instrumentation Only](performance-schema-consumer-configurations.html#performance-schema-consumer-configurations-global-and-thread-instrumentation-only "Global and Thread Instrumentation Only")
* [Global, Thread, and Current-Event Instrumentation](performance-schema-consumer-configurations.html#performance-schema-consumer-configurations-global-thread-and-current-event-instrumentation "Global, Thread, and Current-Event Instrumentation")
* [Global, Thread, Current-Event, and Event-History instrumentation](performance-schema-consumer-configurations.html#performance-schema-consumer-configurations-global-thread-current-event-and-event-history-instrumentation "Global, Thread, Current-Event, and Event-History instrumentation")

#### No Instrumentation

Server configuration state:

```sql
mysql> SELECT * FROM performance_schema.setup_consumers;
+---------------------------+---------+
| NAME                      | ENABLED |
+---------------------------+---------+
| global_instrumentation    | NO      |
...
+---------------------------+---------+
```

In this configuration, nothing is instrumented.

Setup elements checked:

* Table [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table"), consumer `global_instrumentation`

Output tables maintained:

* None

#### Global Instrumentation Only

Server configuration state:

```sql
mysql> SELECT * FROM performance_schema.setup_consumers;
+---------------------------+---------+
| NAME                      | ENABLED |
+---------------------------+---------+
| global_instrumentation    | YES     |
| thread_instrumentation    | NO      |
...
+---------------------------+---------+
```

In this configuration, instrumentation is maintained only for global states. Per-thread instrumentation is disabled.

Additional setup elements checked, relative to the preceding configuration:

* Table [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table"), consumer `thread_instrumentation`

* Table [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table")
* Table [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table")
* Table [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table")

Additional output tables maintained, relative to the preceding configuration:

* [`mutex_instances`](performance-schema-mutex-instances-table.html "25.12.3.3 The mutex_instances Table")
* [`rwlock_instances`](performance-schema-rwlock-instances-table.html "25.12.3.4 The rwlock_instances Table")
* [`cond_instances`](performance-schema-cond-instances-table.html "25.12.3.1 The cond_instances Table")
* [`file_instances`](performance-schema-file-instances-table.html "25.12.3.2 The file_instances Table")
* [`users`](performance-schema-users-table.html "25.12.8.3 The users Table")
* [`hosts`](performance-schema-hosts-table.html "25.12.8.2 The hosts Table")
* [`accounts`](performance-schema-accounts-table.html "25.12.8.1 The accounts Table")
* [`socket_summary_by_event_name`](performance-schema-socket-summary-tables.html "25.12.15.8 Socket Summary Tables")
* [`file_summary_by_instance`](performance-schema-file-summary-tables.html "25.12.15.6 File I/O Summary Tables")
* [`file_summary_by_event_name`](performance-schema-file-summary-tables.html "25.12.15.6 File I/O Summary Tables")
* [`objects_summary_global_by_type`](performance-schema-objects-summary-global-by-type-table.html "25.12.15.5 Object Wait Summary Table")
* [`memory_summary_global_by_event_name`](performance-schema-memory-summary-tables.html "25.12.15.9 Memory Summary Tables")
* [`table_lock_waits_summary_by_table`](performance-schema-table-wait-summary-tables.html#performance-schema-table-lock-waits-summary-by-table-table "25.12.15.7.3 The table_lock_waits_summary_by_table Table")
* [`table_io_waits_summary_by_index_usage`](performance-schema-table-wait-summary-tables.html#performance-schema-table-io-waits-summary-by-index-usage-table "25.12.15.7.2 The table_io_waits_summary_by_index_usage Table")
* [`table_io_waits_summary_by_table`](performance-schema-table-wait-summary-tables.html#performance-schema-table-io-waits-summary-by-table-table "25.12.15.7.1 The table_io_waits_summary_by_table Table")
* [`events_waits_summary_by_instance`](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables")
* [`events_waits_summary_global_by_event_name`](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables")
* [`events_stages_summary_global_by_event_name`](performance-schema-stage-summary-tables.html "25.12.15.2 Stage Summary Tables")
* [`events_statements_summary_global_by_event_name`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables")
* [`events_transactions_summary_global_by_event_name`](performance-schema-transaction-summary-tables.html "25.12.15.4 Transaction Summary Tables")

#### Global and Thread Instrumentation Only

Server configuration state:

```sql
mysql> SELECT * FROM performance_schema.setup_consumers;
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| global_instrumentation           | YES     |
| thread_instrumentation           | YES     |
| events_waits_current             | NO      |
...
| events_stages_current            | NO      |
...
| events_statements_current        | NO      |
...
| events_transactions_current      | NO      |
...
+----------------------------------+---------+
```

In this configuration, instrumentation is maintained globally and per thread. No individual events are collected in the current-events or event-history tables.

Additional setup elements checked, relative to the preceding configuration:

* Table [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table"), consumers `events_xxx_current`, where *`xxx`* is `waits`, `stages`, `statements`, `transactions`

* Table [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table")
* Column `threads.instrumented`

Additional output tables maintained, relative to the preceding configuration:

* `events_xxx_summary_by_yyy_by_event_name`, where *`xxx`* is `waits`, `stages`, `statements`, `transactions`; and *`yyy`* is `thread`, `user`, `host`, `account`

#### Global, Thread, and Current-Event Instrumentation

Server configuration state:

```sql
mysql> SELECT * FROM performance_schema.setup_consumers;
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| global_instrumentation           | YES     |
| thread_instrumentation           | YES     |
| events_waits_current             | YES     |
| events_waits_history             | NO      |
| events_waits_history_long        | NO      |
| events_stages_current            | YES     |
| events_stages_history            | NO      |
| events_stages_history_long       | NO      |
| events_statements_current        | YES     |
| events_statements_history        | NO      |
| events_statements_history_long   | NO      |
| events_transactions_current      | YES     |
| events_transactions_history      | NO      |
| events_transactions_history_long | NO      |
...
+----------------------------------+---------+
```

In this configuration, instrumentation is maintained globally and per thread. Individual events are collected in the current-events table, but not in the event-history tables.

Additional setup elements checked, relative to the preceding configuration:

* Consumers `events_xxx_history`, where *`xxx`* is `waits`, `stages`, `statements`, `transactions`

* Consumers `events_xxx_history_long`, where *`xxx`* is `waits`, `stages`, `statements`, `transactions`

Additional output tables maintained, relative to the preceding configuration:

* `events_xxx_current`, where *`xxx`* is `waits`, `stages`, `statements`, `transactions`

#### Global, Thread, Current-Event, and Event-History instrumentation

The preceding configuration collects no event history because the `events_xxx_history` and `events_xxx_history_long` consumers are disabled. Those consumers can be enabled separately or together to collect event history per thread, globally, or both.

This configuration collects event history per thread, but not globally:

```sql
mysql> SELECT * FROM performance_schema.setup_consumers;
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| global_instrumentation           | YES     |
| thread_instrumentation           | YES     |
| events_waits_current             | YES     |
| events_waits_history             | YES     |
| events_waits_history_long        | NO      |
| events_stages_current            | YES     |
| events_stages_history            | YES     |
| events_stages_history_long       | NO      |
| events_statements_current        | YES     |
| events_statements_history        | YES     |
| events_statements_history_long   | NO      |
| events_transactions_current      | YES     |
| events_transactions_history      | YES     |
| events_transactions_history_long | NO      |
...
+----------------------------------+---------+
```

Event-history tables maintained for this configuration:

* `events_xxx_history`, where *`xxx`* is `waits`, `stages`, `statements`, `transactions`

This configuration collects event history globally, but not per thread:

```sql
mysql> SELECT * FROM performance_schema.setup_consumers;
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| global_instrumentation           | YES     |
| thread_instrumentation           | YES     |
| events_waits_current             | YES     |
| events_waits_history             | NO      |
| events_waits_history_long        | YES     |
| events_stages_current            | YES     |
| events_stages_history            | NO      |
| events_stages_history_long       | YES     |
| events_statements_current        | YES     |
| events_statements_history        | NO      |
| events_statements_history_long   | YES     |
| events_transactions_current      | YES     |
| events_transactions_history      | NO      |
| events_transactions_history_long | YES     |
...
+----------------------------------+---------+
```

Event-history tables maintained for this configuration:

* `events_xxx_history_long`, where *`xxx`* is `waits`, `stages`, `statements`, `transactions`

This configuration collects event history per thread and globally:

```sql
mysql> SELECT * FROM performance_schema.setup_consumers;
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| global_instrumentation           | YES     |
| thread_instrumentation           | YES     |
| events_waits_current             | YES     |
| events_waits_history             | YES     |
| events_waits_history_long        | YES     |
| events_stages_current            | YES     |
| events_stages_history            | YES     |
| events_stages_history_long       | YES     |
| events_statements_current        | YES     |
| events_statements_history        | YES     |
| events_statements_history_long   | YES     |
| events_transactions_current      | YES     |
| events_transactions_history      | YES     |
| events_transactions_history_long | YES     |
...
+----------------------------------+---------+
```

Event-history tables maintained for this configuration:

* `events_xxx_history`, where *`xxx`* is `waits`, `stages`, `statements`, `transactions`

* `events_xxx_history_long`, where *`xxx`* is `waits`, `stages`, `statements`, `transactions`
