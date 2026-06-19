## 24.5 INFORMATION\_SCHEMA Thread Pool Tables

The following sections describe the `INFORMATION_SCHEMA` tables associated with the thread pool plugin (see Section 5.5.3, “MySQL Enterprise Thread Pool”). They provide information about thread pool operation:

* `TP_THREAD_GROUP_STATE`: Information about thread pool thread group states

* `TP_THREAD_GROUP_STATS`: Thread group statistics

* `TP_THREAD_STATE`: Information about thread pool thread states

Rows in these tables represent snapshots in time. In the case of `TP_THREAD_STATE`, all rows for a thread group comprise a snapshot in time. Thus, the MySQL server holds the mutex of the thread group while producing the snapshot. But it does not hold mutexes on all thread groups at the same time, to prevent a statement against `TP_THREAD_STATE` from blocking the entire MySQL server.

The thread pool `INFORMATION_SCHEMA` tables are implemented by individual plugins and the decision whether to load one can be made independently of the others (see Section 5.5.3.2, “Thread Pool Installation”). However, the content of all the tables depends on the thread pool plugin being enabled. If a table plugin is enabled but the thread pool plugin is not, the table becomes visible and can be accessed, but is empty.


### 24.5.1 INFORMATION\_SCHEMA Thread Pool Table Reference

The following table summarizes `INFORMATION_SCHEMA` thread pool tables. For greater detail, see the individual table descriptions.

**Table 24.7 INFORMATION\_SCHEMA Thread Pool Tables**

<table frame="box" rules="all" summary="A reference that lists INFORMATION_SCHEMA thread pool tables."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Table Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>TP_THREAD_GROUP_STATE</code></td> <td>Thread pool thread group states</td> </tr><tr><td><code>TP_THREAD_GROUP_STATS</code></td> <td>Thread pool thread group statistics</td> </tr><tr><td><code>TP_THREAD_STATE</code></td> <td>Thread pool thread information</td> </tr></tbody></table>


### 24.5.2 The INFORMATION\_SCHEMA TP\_THREAD\_GROUP\_STATE Table

The `TP_THREAD_GROUP_STATE` table has one row per thread group in the thread pool. Each row provides information about the current state of a group.

The `TP_THREAD_GROUP_STATE` table has these columns:

* `TP_GROUP_ID`

  The thread group ID. This is a unique key within the table.

* `CONSUMER THREADS`

  The number of consumer threads. There is at most one thread ready to start executing if the active threads become stalled or blocked.

* `RESERVE_THREADS`

  The number of threads in the reserved state. This means that they are not started until there is a need to wake a new thread and there is no consumer thread. This is where most threads end up when the thread group has created more threads than needed for normal operation. Often a thread group needs additional threads for a short while and then does not need them again for a while. In this case, they go into the reserved state and remain until needed again. They take up some extra memory resources, but no extra computing resources.

* `CONNECT_THREAD_COUNT`

  The number of threads that are processing or waiting to process connection initialization and authentication. There can be a maximum of four connection threads per thread group; these threads expire after a period of inactivity.

  This column was added in MySQL 5.7.18.

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

  The maximum thread ID of the threads in the group. This is the same as `MAX(TP_THREAD_NUMBER)` for the threads when selected from the `TP_THREAD_STATE` table. That is, these two queries are equivalent:

  ```sql
  SELECT TP_GROUP_ID, MAX_THREAD_IDS_IN_GROUP
  FROM TP_THREAD_GROUP_STATE;

  SELECT TP_GROUP_ID, MAX(TP_THREAD_NUMBER)
  FROM TP_THREAD_STATE GROUP BY TP_GROUP_ID;
  ```


### 24.5.3 The INFORMATION\_SCHEMA TP\_THREAD\_GROUP\_STATS Table

The `TP_THREAD_GROUP_STATS` table reports statistics per thread group. There is one row per group.

The `TP_THREAD_GROUP_STATS` table has these columns:

* `TP_GROUP_ID`

  The thread group ID. This is a unique key within the table.

* `CONNECTIONS_STARTED`

  The number of connections started.

* `CONNECTIONS_CLOSED`

  The number of connections closed.

* `QUERIES_EXECUTED`

  The number of statements executed. This number is incremented when a statement starts executing, not when it finishes.

* `QUERIES_QUEUED`

  The number of statements received that were queued for execution. This does not count statements that the thread group was able to begin executing immediately without queuing, which can happen under the conditions described in Section 5.5.3.3, “Thread Pool Operation”.

* `THREADS_STARTED`

  The number of threads started.

* `PRIO_KICKUPS`

  The number of statements that have been moved from low-priority queue to high-priority queue based on the value of the `thread_pool_prio_kickup_timer` system variable. If this number increases quickly, consider increasing the value of that variable. A quickly increasing counter means that the priority system is not keeping transactions from starting too early. For `InnoDB`, this most likely means deteriorating performance due to too many concurrent transactions..

* `STALLED_QUERIES_EXECUTED`

  The number of statements that have become defined as stalled due to executing for longer than the value of the `thread_pool_stall_limit` system variable.

* `BECOME_CONSUMER_THREAD`

  The number of times thread have been assigned the consumer thread role.

* `BECOME_RESERVE_THREAD`

  The number of times threads have been assigned the reserve thread role.

* `BECOME_WAITING_THREAD`

  The number of times threads have been assigned the waiter thread role. When statements are queued, this happens very often, even in normal operation, so rapid increases in this value are normal in the case of a highly loaded system where statements are queued up.

* `WAKE_THREAD_STALL_CHECKER`

  The number of times the stall check thread decided to wake or create a thread to possibly handle some statements or take care of the waiter thread role.

* `SLEEP_WAITS`

  The number of `THD_WAIT_SLEEP` waits. These occur when threads go to sleep; for example, by calling the `SLEEP()` function.

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


### 24.5.4 The INFORMATION\_SCHEMA TP\_THREAD\_STATE Table

The `TP_THREAD_STATE` table has one row per thread created by the thread pool to handle connections.

The `TP_THREAD_STATE` table has these columns:

* `TP_GROUP_ID`

  The thread group ID.

* `TP_THREAD_NUMBER`

  The ID of the thread within its thread group. `TP_GROUP_ID` and `TP_THREAD_NUMBER` together provide a unique key within the table.

* `PROCESS_COUNT`

  The 10ms interval in which the statement that uses this thread is currently executing. 0 means no statement is executing, 1 means it is in the first 10ms, and so forth.

* `WAIT_TYPE`

  The type of wait for the thread. `NULL` means the thread is not blocked. Otherwise, the thread is blocked by a call to `thd_wait_begin()` and the value specifies the type of wait. The `xxx_WAIT` columns of the `TP_THREAD_GROUP_STATS` table accumulate counts for each wait type.

  The `WAIT_TYPE` value is a string that describes the type of wait, as shown in the following table.

  **Table 24.8 TP\_THREAD\_STATE Table WAIT\_TYPE Values**

  <table summary="TP_THREAD_STATE table WAIT_TYPE values. The first column is the wait type. The second column describes the wait type."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Wait Type</th> <th>Meaning</th> </tr></thead><tbody><tr> <td><code>THD_WAIT_SLEEP</code></td> <td>Waiting for sleep</td> </tr><tr> <td><code>THD_WAIT_DISKIO</code></td> <td>Waiting for Disk IO</td> </tr><tr> <td><code>THD_WAIT_ROW_LOCK</code></td> <td>Waiting for row lock</td> </tr><tr> <td><code>THD_WAIT_GLOBAL_LOCK</code></td> <td>Waiting for global lock</td> </tr><tr> <td><code>THD_WAIT_META_DATA_LOCK</code></td> <td>Waiting for metadata lock</td> </tr><tr> <td><code>THD_WAIT_TABLE_LOCK</code></td> <td>Waiting for table lock</td> </tr><tr> <td><code>THD_WAIT_USER_LOCK</code></td> <td>Waiting for user lock</td> </tr><tr> <td><code>THD_WAIT_BINLOG</code></td> <td>Waiting for binlog</td> </tr><tr> <td><code>THD_WAIT_GROUP_COMMIT</code></td> <td>Waiting for group commit</td> </tr><tr> <td><code>THD_WAIT_SYNC</code></td> <td>Waiting for fsync</td> </tr></tbody></table>
