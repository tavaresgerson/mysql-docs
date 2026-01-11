### 10.14.6 Replication SQL Thread States

The following list shows the most common states you may see in the `State` column for a replication SQL thread on a replica server.

In MySQL 8.0.26, incompatible changes were made to instrumentation names, including the names of thread stages, containing the terms “master”, which is changed to “source”, “slave”, which is changed to “replica”, and “mts” (for “multithreaded slave”), which is changed to “mta” (for “multithreaded applier”). Monitoring tools that work with these instrumentation names might be impacted. If the incompatible changes have an impact for you, set the `terminology_use_previous` system variable to `BEFORE_8_0_26` to make MySQL Server use the old versions of the names for the objects specified in the previous list. This enables monitoring tools that rely on the old names to continue working until they can be updated to use the new names.

Set the `terminology_use_previous` system variable with session scope to support individual functions, or global scope to be a default for all new sessions. When global scope is used, the slow query log contains the old versions of the names.

* `Making temporary file (append) before replaying LOAD DATA INFILE`

  The thread is executing a `LOAD DATA` statement and is appending the data to a temporary file containing the data from which the replica reads rows.

* `Making temporary file (create) before replaying LOAD DATA INFILE`

  The thread is executing a `LOAD DATA` statement and is creating a temporary file containing the data from which the replica reads rows. This state can only be encountered if the original `LOAD DATA` statement was logged by a source running a version of MySQL lower than MySQL 5.0.3.

* `Reading event from the relay log`

  The thread has read an event from the relay log so that the event can be processed.

* `Slave has read all relay log; waiting for more updates`

  From MySQL 8.0.26: `Replica has read all relay log; waiting for more updates`

  The thread has processed all events in the relay log files, and is now waiting for the I/O (receiver) thread to write new events to the relay log.

* `Waiting for an event from Coordinator`

  Using the multithreaded replica (`replica_parallel_workers` or `slave_parallel_workers` is greater than 1), one of the replica worker threads is waiting for an event from the coordinator thread.

* `Waiting for slave mutex on exit`

  From MySQL 8.0.26: `Waiting for replica mutex on exit`

  A very brief state that occurs as the thread is stopping.

* `Waiting for Slave Workers to free pending events`

  From MySQL 8.0.26: `Waiting for Replica Workers to free pending events`

  This waiting action occurs when the total size of events being processed by Workers exceeds the size of the `replica_pending_jobs_size_max` or `slave_pending_jobs_size_max` system variable. The Coordinator resumes scheduling when the size drops below this limit. This state occurs only when `replica_parallel_workers` or `slave_parallel_workers` is set greater than 0.

* `Waiting for the next event in relay log`

  The initial state before `Reading event from the relay log`.

* `Waiting until MASTER_DELAY seconds after master executed event`

  From MySQL 8.0.26: `Waiting until SOURCE_DELAY seconds after master executed event`

  The SQL thread has read an event but is waiting for the replica delay to lapse. This delay is set with the `SOURCE_DELAY` | `MASTER_DELAY` option of the `CHANGE REPLICATION SOURCE TO` statement (from MySQL 8.0.23) or `CHANGE MASTER TO` statement (before MySQL 8.0.23).

The `Info` column for the SQL thread may also show the text of a statement. This indicates that the thread has read an event from the relay log, extracted the statement from it, and may be executing it.
