#### 25.12.3.1 The cond\_instances Table

The [`cond_instances`](performance-schema-cond-instances-table.html "25.12.3.1 The cond_instances Table") table lists all the conditions seen by the Performance Schema while the server executes. A condition is a synchronization mechanism used in the code to signal that a specific event has happened, so that a thread waiting for this condition can resume work.

When a thread is waiting for something to happen, the condition name is an indication of what the thread is waiting for, but there is no immediate way to tell which other threads cause the condition to happen.

The [`cond_instances`](performance-schema-cond-instances-table.html "25.12.3.1 The cond_instances Table") table has these columns:

* `NAME`

  The instrument name associated with the condition.

* `OBJECT_INSTANCE_BEGIN`

  The address in memory of the instrumented condition.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is not permitted for the [`cond_instances`](performance-schema-cond-instances-table.html "25.12.3.1 The cond_instances Table") table.
