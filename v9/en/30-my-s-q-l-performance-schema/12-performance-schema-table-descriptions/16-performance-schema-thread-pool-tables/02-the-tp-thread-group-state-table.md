#### 29.12.16.2 The tp_thread_group_state Table

The `tp_thread_group_state` table has one row per thread group in the thread pool. Each row provides information about the current state of a group.

The `tp_thread_group_state` table has these columns:

* `TP_GROUP_ID`

  The thread group ID. This is a unique key within the table.

* `CONSUMER THREADS`

  The number of consumer threads. There is at most one thread ready to start executing if the active threads become stalled or blocked.

* `RESERVE_THREADS`

  The number of threads in the reserved state. This means that they are not started until there is a need to wake a new thread and there is no consumer thread. This is where most threads end up when the thread group has created more threads than needed for normal operation. Often a thread group needs additional threads for a short while and then does not need them again for a while. In this case, they go into the reserved state and remain until needed again. They take up some extra memory resources, but no extra computing resources.

* `CONNECT_THREAD_COUNT`

  The number of threads that are processing or waiting to process connection initialization and authentication. There can be a maximum of four connection threads per thread group; these threads expire after a period of inactivity.

* `CONNECTION_COUNT`

  The number of connections using this thread group.

* `QUEUED_QUERIES`

  The number of statements waiting in the high-priority queue.

* `QUEUED_TRANSACTIONS`

  The number of statements waiting in the low-priority queue. These are the initial statements for transactions that have not started, so they also represent queued transactions.

* `STALL_LIMIT`

  The value of the `thread_pool_stall_limit` system variable for the thread group. This is the same value for all thread groups.

* `PRIO_KICKUP_TIMER`

  The value of the `thread_pool_prio_kickup_timer` system variable for the thread group. This is the same value for all thread groups.

* `ALGORITHM`

  The value of the `thread_pool_algorithm` system variable for the thread group. This is the same value for all thread groups.

* `THREAD_COUNT`

  The number of threads started in the thread pool as part of this thread group.

* `ACTIVE_THREAD_COUNT`

  The number of threads active in executing statements.

* `STALLED_THREAD_COUNT`

  The number of stalled statements in the thread group. A stalled statement could be executing, but from a thread pool perspective it is stalled and making no progress. A long-running statement quickly ends up in this category.

* `WAITING_THREAD_NUMBER`

  If there is a thread handling the polling of statements in the thread group, this specifies the thread number within this thread group. It is possible that this thread could be executing a statement.

* `OLDEST_QUEUED`

  How long in milliseconds the oldest queued statement has been waiting for execution.

* `MAX_THREAD_IDS_IN_GROUP`

  The maximum thread ID of the threads in the group. This is the same as `MAX(TP_THREAD_NUMBER)` for the threads when selected from the `tp_thread_state` table. That is, these two queries are equivalent:

  ```
  SELECT TP_GROUP_ID, MAX_THREAD_IDS_IN_GROUP
  FROM tp_thread_group_state;

  SELECT TP_GROUP_ID, MAX(TP_THREAD_NUMBER)
  FROM tp_thread_state GROUP BY TP_GROUP_ID;
  ```

* `EFFECTIVE_MAX_TRANSACTIONS_LIMIT`

  The effective `max_transactions_limit_per_tg` value for the group.

* `NUM_QUERY_THREADS`

  The number of worker threads in the group.

* `TIME_OF_LAST_THREAD_CREATION`

  The point in time when the thread was last created.

* `NUM_CONNECT_HANDLER_THREAD_IN_SLEEP`

  The number of inactive connection handler threads.

* `THREADS_BOUND_TO_TRANSACTION`

  The number of threads in an active transaction, which must be less than `thread_pool_max_transactions_limit`; this is set only when `thread_pool_max_transactions_limit` is not `0`.

* `QUERY_THREADS_COUNT`

  same as num_query_threads, but used for different purposes?

* `TIME_OF_EARLIEST_CON_EXPIRE`

  A timestamp showing the earliest point in time when a connection is expected to expire.

The `tp_thread_group_state` table has one index; this is a unique index on the `TP_GROUP_ID` column.

`TRUNCATE TABLE` is not permitted for the `tp_thread_group_state` table.
