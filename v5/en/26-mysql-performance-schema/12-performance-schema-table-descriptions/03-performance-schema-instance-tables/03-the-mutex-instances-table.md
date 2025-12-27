#### 25.12.3.3 The mutex\_instances Table

The [`mutex_instances`](performance-schema-mutex-instances-table.html "25.12.3.3 The mutex_instances Table") table lists all the mutexes seen by the Performance Schema while the server executes. A mutex is a synchronization mechanism used in the code to enforce that only one thread at a given time can have access to some common resource. The resource is said to be “protected” by the mutex.

When two threads executing in the server (for example, two user sessions executing a query simultaneously) do need to access the same resource (a file, a buffer, or some piece of data), these two threads compete against each other, so that the first query to obtain a lock on the mutex causes the other query to wait until the first is done and unlocks the mutex.

The work performed while holding a mutex is said to be in a “critical section,” and multiple queries do execute this critical section in a serialized way (one at a time), which is a potential bottleneck.

The [`mutex_instances`](performance-schema-mutex-instances-table.html "25.12.3.3 The mutex_instances Table") table has these columns:

* `NAME`

  The instrument name associated with the mutex.

* `OBJECT_INSTANCE_BEGIN`

  The address in memory of the instrumented mutex.

* `LOCKED_BY_THREAD_ID`

  When a thread currently has a mutex locked, `LOCKED_BY_THREAD_ID` is the `THREAD_ID` of the locking thread, otherwise it is `NULL`.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is not permitted for the [`mutex_instances`](performance-schema-mutex-instances-table.html "25.12.3.3 The mutex_instances Table") table.

For every mutex instrumented in the code, the Performance Schema provides the following information.

* The [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") table lists the name of the instrumentation point, with the prefix `wait/synch/mutex/`.

* When some code creates a mutex, a row is added to the [`mutex_instances`](performance-schema-mutex-instances-table.html "25.12.3.3 The mutex_instances Table") table. The `OBJECT_INSTANCE_BEGIN` column is a property that uniquely identifies the mutex.

* When a thread attempts to lock a mutex, the [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table") table shows a row for that thread, indicating that it is waiting on a mutex (in the `EVENT_NAME` column), and indicating which mutex is waited on (in the `OBJECT_INSTANCE_BEGIN` column).

* When a thread succeeds in locking a mutex:

  + [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table") shows that the wait on the mutex is completed (in the `TIMER_END` and `TIMER_WAIT` columns)

  + The completed wait event is added to the [`events_waits_history`](performance-schema-events-waits-history-table.html "25.12.4.2 The events_waits_history Table") and [`events_waits_history_long`](performance-schema-events-waits-history-long-table.html "25.12.4.3 The events_waits_history_long Table") tables

  + [`mutex_instances`](performance-schema-mutex-instances-table.html "25.12.3.3 The mutex_instances Table") shows that the mutex is now owned by the thread (in the `THREAD_ID` column).

* When a thread unlocks a mutex, [`mutex_instances`](performance-schema-mutex-instances-table.html "25.12.3.3 The mutex_instances Table") shows that the mutex now has no owner (the `THREAD_ID` column is `NULL`).

* When a mutex object is destroyed, the corresponding row is removed from [`mutex_instances`](performance-schema-mutex-instances-table.html "25.12.3.3 The mutex_instances Table").

By performing queries on both of the following tables, a monitoring application or a DBA can detect bottlenecks or deadlocks between threads that involve mutexes:

* [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table"), to see what mutex a thread is waiting for

* [`mutex_instances`](performance-schema-mutex-instances-table.html "25.12.3.3 The mutex_instances Table"), to see which other thread currently owns a mutex
