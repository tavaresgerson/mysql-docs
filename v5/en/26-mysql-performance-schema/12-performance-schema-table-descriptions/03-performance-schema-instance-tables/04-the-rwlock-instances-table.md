#### 25.12.3.4 The rwlock\_instances Table

The [`rwlock_instances`](performance-schema-rwlock-instances-table.html "25.12.3.4 The rwlock_instances Table") table lists all the [rwlock](glossary.html#glos_rw_lock "rw-lock") (read write lock) instances seen by the Performance Schema while the server executes. An `rwlock` is a synchronization mechanism used in the code to enforce that threads at a given time can have access to some common resource following certain rules. The resource is said to be “protected” by the `rwlock`. The access is either shared (many threads can have a read lock at the same time), exclusive (only one thread can have a write lock at a given time), or shared-exclusive (a thread can have a write lock while permitting inconsistent reads by other threads). Shared-exclusive access is otherwise known as an `sxlock` and optimizes concurrency and improves scalability for read-write workloads.

Depending on how many threads are requesting a lock, and the nature of the locks requested, access can be either granted in shared mode, exclusive mode, shared-exclusive mode or not granted at all, waiting for other threads to finish first.

The [`rwlock_instances`](performance-schema-rwlock-instances-table.html "25.12.3.4 The rwlock_instances Table") table has these columns:

* `NAME`

  The instrument name associated with the lock.

* `OBJECT_INSTANCE_BEGIN`

  The address in memory of the instrumented lock.

* `WRITE_LOCKED_BY_THREAD_ID`

  When a thread currently has an `rwlock` locked in exclusive (write) mode, `WRITE_LOCKED_BY_THREAD_ID` is the `THREAD_ID` of the locking thread, otherwise it is `NULL`.

* `READ_LOCKED_BY_COUNT`

  When a thread currently has an `rwlock` locked in shared (read) mode, `READ_LOCKED_BY_COUNT` is incremented by

  1. This is a counter only, so it cannot be used directly to find which thread holds a read lock, but it can be used to see whether there is a read contention on an `rwlock`, and see how many readers are currently active.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is not permitted for the [`rwlock_instances`](performance-schema-rwlock-instances-table.html "25.12.3.4 The rwlock_instances Table") table.

By performing queries on both of the following tables, a monitoring application or a DBA may detect some bottlenecks or deadlocks between threads that involve locks:

* [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table"), to see what `rwlock` a thread is waiting for

* [`rwlock_instances`](performance-schema-rwlock-instances-table.html "25.12.3.4 The rwlock_instances Table"), to see which other thread currently owns an `rwlock`

There is a limitation: The [`rwlock_instances`](performance-schema-rwlock-instances-table.html "25.12.3.4 The rwlock_instances Table") can be used only to identify the thread holding a write lock, but not the threads holding a read lock.
