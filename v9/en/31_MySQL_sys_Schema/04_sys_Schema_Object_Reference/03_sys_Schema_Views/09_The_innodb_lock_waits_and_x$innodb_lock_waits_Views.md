#### 30.4.3.9 The innodb\_lock\_waits and x$innodb\_lock\_waits Views

These views summarize the `InnoDB` locks that transactions are waiting for. By default, rows are sorted by descending lock age.

The `innodb_lock_waits` and `x$innodb_lock_waits` views have these columns:

* `wait_started`

  The time at which the lock wait started.

* `wait_age`

  How long the lock has been waited for, as a `TIME` value.

* `wait_age_secs`

  How long the lock has been waited for, in seconds.

* `locked_table_schema`

  The schema that contains the locked table.

* `locked_table_name`

  The name of the locked table.

* `locked_table_partition`

  The name of the locked partition, if any; `NULL` otherwise.

* `locked_table_subpartition`

  The name of the locked subpartition, if any; `NULL` otherwise.

* `locked_index`

  The name of the locked index.

* `locked_type`

  The type of the waiting lock.

* `waiting_trx_id`

  The ID of the waiting transaction.

* `waiting_trx_started`

  The time at which the waiting transaction started.

* `waiting_trx_age`

  How long the waiting transaction has been waiting, as a `TIME` value.

* `waiting_trx_rows_locked`

  The number of rows locked by the waiting transaction.

* `waiting_trx_rows_modified`

  The number of rows modified by the waiting transaction.

* `waiting_pid`

  The processlist ID of the waiting transaction.

* `waiting_query`

  The statement that is waiting for the lock.

* `waiting_lock_id`

  The ID of the waiting lock.

* `waiting_lock_mode`

  The mode of the waiting lock.

* `blocking_trx_id`

  The ID of the transaction that is blocking the waiting lock.

* `blocking_pid`

  The processlist ID of the blocking transaction.

* `blocking_query`

  The statement the blocking transaction is executing. This field reports NULL if the session that issued the blocking query becomes idle. For more information, see Identifying a Blocking Query After the Issuing Session Becomes Idle.

* `blocking_lock_id`

  The ID of the lock that is blocking the waiting lock.

* `blocking_lock_mode`

  The mode of the lock that is blocking the waiting lock.

* `blocking_trx_started`

  The time at which the blocking transaction started.

* `blocking_trx_age`

  How long the blocking transaction has been executing, as a `TIME` value.

* `blocking_trx_rows_locked`

  The number of rows locked by the blocking transaction.

* `blocking_trx_rows_modified`

  The number of rows modified by the blocking transaction.

* `sql_kill_blocking_query`

  The `KILL` statement to execute to kill the blocking statement.

* `sql_kill_blocking_connection`

  The `KILL` statement to execute to kill the session running the blocking statement.
