### 25.4.3 Event Pre-Filtering

Pre-filtering is done by the Performance Schema and has a global effect that applies to all users. Pre-filtering can be applied to either the producer or consumer stage of event processing:

* To configure pre-filtering at the producer stage, several tables can be used:

  + [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") indicates which instruments are available. An instrument disabled in this table produces no events regardless of the contents of the other production-related setup tables. An instrument enabled in this table is permitted to produce events, subject to the contents of the other tables.

  + [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") controls whether the Performance Schema monitors particular table and stored program objects.

  + [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") indicates whether monitoring is enabled for each server thread.

  + [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") determines the initial monitoring state for new foreground threads.

* To configure pre-filtering at the consumer stage, modify the [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") table. This determines the destinations to which events are sent. [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") also implicitly affects event production. If a given event is not e sent to any destination (is not be consumed), the Performance Schema does not produce it.

Modifications to any of these tables affect monitoring immediately, with some exceptions:

* Modifications to some instruments in the [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") table are effective only at server startup; changing them at runtime has no effect. This affects primarily mutexes, conditions, and rwlocks in the server, although there may be other instruments for which this is true. This restriction is lifted as of MySQL 5.7.12.

* Modifications to the [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") table affect only foreground threads created subsequent to the modification, not existing threads.

When you change the monitoring configuration, the Performance Schema does not flush the history tables. Events already collected remain in the current-events and history tables until displaced by newer events. If you disable instruments, you might need to wait a while before events for them are displaced by newer events of interest. Alternatively, use [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") to empty the history tables.

After making instrumentation changes, you might want to truncate the summary tables. Generally, the effect is to reset the summary columns to 0 or `NULL`, not to remove rows. This enables you to clear collected values and restart aggregation. That might be useful, for example, after you have made a runtime configuration change. Exceptions to this truncation behavior are noted in individual summary table sections.

The following sections describe how to use specific tables to control Performance Schema pre-filtering.
