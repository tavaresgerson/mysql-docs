#### 26.4.3.28 The schema\_table\_lock\_waits and x$schema\_table\_lock\_waits Views

These views display which sessions are blocked waiting on metadata locks, and what is blocking them.

The column descriptions here are brief. For additional information, see the description of the Performance Schema `metadata_locks` table at Section 25.12.12.1, “The metadata\_locks Table”.

The `schema_table_lock_waits` and `x$schema_table_lock_waits` views have these columns:

* `object_schema`

  The schema containing the object to be locked.

* `object_name`

  The name of the instrumented object.

* `waiting_thread_id`

  The thread ID of the thread that is waiting for the lock.

* `waiting_pid`

  The processlist ID of the thread that is waiting for the lock.

* `waiting_account`

  The account associated with the session that is waiting for the lock.

* `waiting_lock_type`

  The type of the waiting lock.

* `waiting_lock_duration`

  How long the waiting lock has been waiting.

* `waiting_query`

  The statement that is waiting for the lock.

* `waiting_query_secs`

  How long the statement has been waiting, in seconds.

* `waiting_query_rows_affected`

  The number of rows affected by the statement.

* `waiting_query_rows_examined`

  The number of rows read from storage engines by the statement.

* `blocking_thread_id`

  The thread ID of the thread that is blocking the waiting lock.

* `blocking_pid`

  The processlist ID of the thread that is blocking the waiting lock.

* `blocking_account`

  The account associated with the thread that is blocking the waiting lock.

* `blocking_lock_type`

  The type of lock that is blocking the waiting lock.

* `blocking_lock_duration`

  How long the blocking lock has been held.

* `sql_kill_blocking_query`

  The `KILL` statement to execute to kill the blocking statement.

* `sql_kill_blocking_connection`

  The `KILL` statement to execute to kill the session running the blocking statement.
