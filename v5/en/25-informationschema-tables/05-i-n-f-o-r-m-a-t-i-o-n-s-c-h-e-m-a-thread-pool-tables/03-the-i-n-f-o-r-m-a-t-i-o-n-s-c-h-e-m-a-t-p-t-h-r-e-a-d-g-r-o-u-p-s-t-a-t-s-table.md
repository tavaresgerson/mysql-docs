### 24.5.3 The INFORMATION_SCHEMA TP_THREAD_GROUP_STATS Table

The [`TP_THREAD_GROUP_STATS`](information-schema-tp-thread-group-stats-table.html "24.5.3 The INFORMATION_SCHEMA TP_THREAD_GROUP_STATS Table") table reports statistics per thread group. There is one row per group.

The [`TP_THREAD_GROUP_STATS`](information-schema-tp-thread-group-stats-table.html "24.5.3 The INFORMATION_SCHEMA TP_THREAD_GROUP_STATS Table") table has these columns:

* `TP_GROUP_ID`

  The thread group ID. This is a unique key within the table.

* `CONNECTIONS_STARTED`

  The number of connections started.

* `CONNECTIONS_CLOSED`

  The number of connections closed.

* `QUERIES_EXECUTED`

  The number of statements executed. This number is incremented when a statement starts executing, not when it finishes.

* `QUERIES_QUEUED`

  The number of statements received that were queued for execution. This does not count statements that the thread group was able to begin executing immediately without queuing, which can happen under the conditions described in [Section 5.5.3.3, “Thread Pool Operation”](thread-pool-operation.html "5.5.3.3 Thread Pool Operation").

* `THREADS_STARTED`

  The number of threads started.

* `PRIO_KICKUPS`

  The number of statements that have been moved from low-priority queue to high-priority queue based on the value of the [`thread_pool_prio_kickup_timer`](server-system-variables.html#sysvar_thread_pool_prio_kickup_timer) system variable. If this number increases quickly, consider increasing the value of that variable. A quickly increasing counter means that the priority system is not keeping transactions from starting too early. For [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), this most likely means deteriorating performance due to too many concurrent transactions..

* `STALLED_QUERIES_EXECUTED`

  The number of statements that have become defined as stalled due to executing for longer than the value of the [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit) system variable.

* `BECOME_CONSUMER_THREAD`

  The number of times thread have been assigned the consumer thread role.

* `BECOME_RESERVE_THREAD`

  The number of times threads have been assigned the reserve thread role.

* `BECOME_WAITING_THREAD`

  The number of times threads have been assigned the waiter thread role. When statements are queued, this happens very often, even in normal operation, so rapid increases in this value are normal in the case of a highly loaded system where statements are queued up.

* `WAKE_THREAD_STALL_CHECKER`

  The number of times the stall check thread decided to wake or create a thread to possibly handle some statements or take care of the waiter thread role.

* `SLEEP_WAITS`

  The number of `THD_WAIT_SLEEP` waits. These occur when threads go to sleep; for example, by calling the [`SLEEP()`](miscellaneous-functions.html#function_sleep) function.

* `DISK_IO_WAITS`

  The number of `THD_WAIT_DISKIO` waits. These occur when threads perform disk I/O that is likely to not hit the file system cache. Such waits occur when the buffer pool reads and writes data to disk, not for normal reads from and writes to files.

* `ROW_LOCK_WAITS`

  The number of `THD_WAIT_ROW_LOCK` waits for release of a row lock by another transaction.

* `GLOBAL_LOCK_WAITS`

  The number of `THD_WAIT_GLOBAL_LOCK` waits for a global lock to be released.

* `META_DATA_LOCK_WAITS`

  The number of `THD_WAIT_META_DATA_LOCK` waits for a metadata lock to be released.

* `TABLE_LOCK_WAITS`

  The number of `THD_WAIT_TABLE_LOCK` waits for a table to be unlocked that the statement needs to access.

* `USER_LOCK_WAITS`

  The number of `THD_WAIT_USER_LOCK` waits for a special lock constructed by the user thread.

* `BINLOG_WAITS`

  The number of `THD_WAIT_BINLOG_WAITS` waits for the binary log to become free.

* `GROUP_COMMIT_WAITS`

  The number of `THD_WAIT_GROUP_COMMIT` waits. These occur when a group commit must wait for the other parties to complete their part of a transaction.

* `FSYNC_WAITS`

  The number of `THD_WAIT_SYNC` waits for a file sync operation.
