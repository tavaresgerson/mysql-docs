#### 29.12.2.5 The setup_threads Table

The `setup_threads` table lists instrumented thread classes. It exposes thread class names and attributes:

```
mysql> SELECT * FROM performance_schema.setup_threads\G
*************************** 1. row ***************************
         NAME: thread/performance_schema/setup
      ENABLED: YES
      HISTORY: YES
   PROPERTIES: singleton
   VOLATILITY: 0
DOCUMENTATION: NULL
...
*************************** 4. row ***************************
         NAME: thread/sql/main
      ENABLED: YES
      HISTORY: YES
   PROPERTIES: singleton
   VOLATILITY: 0
DOCUMENTATION: NULL
*************************** 5. row ***************************
         NAME: thread/sql/one_connection
      ENABLED: YES
      HISTORY: YES
   PROPERTIES: user
   VOLATILITY: 0
DOCUMENTATION: NULL
...
*************************** 10. row ***************************
         NAME: thread/sql/event_scheduler
      ENABLED: YES
      HISTORY: YES
   PROPERTIES: singleton
   VOLATILITY: 0
DOCUMENTATION: NULL
```

The `setup_threads` table has these columns:

* `NAME`

  The instrument name. Thread instruments begin with `thread` (for example, `thread/sql/parser_service` or `thread/performance_schema/setup`).

* `ENABLED`

  Whether the instrument is enabled. The value is `YES` or `NO`. This column can be modified, although setting `ENABLED` has no effect for threads that are already running.

  For background threads, setting the `ENABLED` value controls whether `INSTRUMENTED` is set to `YES` or `NO` for threads that are subsequently created for this instrument and listed in the `threads` table. For foreground threads, this column has no effect; the `setup_actors` table takes precedence.

* `HISTORY`

  Whether to log historical events for the instrument. The value is `YES` or `NO`. This column can be modified, although setting `HISTORY` has no effect for threads that are already running.

  For background threads, setting the `HISTORY` value controls whether `HISTORY` is set to `YES` or `NO` for threads that are subsequently created for this instrument and listed in the `threads` table. For foreground threads, this column has no effect; the `setup_actors` table takes precedence.

* `PROPERTIES`

  The instrument properties. This column uses the `SET` data type, so multiple flags from the following list can be set per instrument:

  + `singleton`: The instrument has a single instance. For example, there is only one thread for the `thread/sql/main` instrument.

  + `user`: The instrument is directly related to user workload (as opposed to system workload). For example, threads such as `thread/sql/one_connection` executing a user session have the `user` property to differentiate them from system threads.

* `VOLATILITY`

  The instrument volatility. This column has the same meaning as in the `setup_instruments` table. See Section 29.12.2.3, “The setup_instruments Table”.

* `DOCUMENTATION`

  A string describing the instrument purpose. The value is `NULL` if no description is available.

The `setup_threads` table has these indexes:

* Primary key on (`NAME`)

`TRUNCATE TABLE` is not permitted for the `setup_threads` table.
