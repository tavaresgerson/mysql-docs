#### 29.12.16.4 The tp\_thread\_state Table

The `tp_thread_state` table has one row per thread created by the thread pool to handle connections.

The `tp_thread_state` table has these columns:

* `TP_GROUP_ID`

  The thread group ID.

* `TP_THREAD_NUMBER`

  The ID of the thread within its thread group. `TP_GROUP_ID` and `TP_THREAD_NUMBER` together provide a unique key within the table.

* `PROCESS_COUNT`

  The 10ms interval in which the statement that uses this thread is currently executing. 0 means no statement is executing, 1 means it is in the first 10ms, and so forth.

* `WAIT_TYPE`

  The type of wait for the thread. `NULL` means the thread is not blocked. Otherwise, the thread is blocked by a call to `thd_wait_begin()` and the value specifies the type of wait. The `xxx_WAIT` columns of the `tp_thread_group_stats` table accumulate counts for each wait type.

  The `WAIT_TYPE` value is a string that describes the type of wait, as shown in the following table.

  **Table 29.4 tp\_thread\_state Table WAIT\_TYPE Values**

  <table summary="tp_thread_state table WAIT_TYPE values. The first column is the wait type. The second column describes the wait type."><thead><tr> <th>Wait Type</th> <th>Meaning</th> </tr></thead><tbody><tr> <td><code>THD_WAIT_SLEEP</code></td> <td>Waiting for sleep</td> </tr><tr> <td><code>THD_WAIT_DISKIO</code></td> <td>Waiting for Disk IO</td> </tr><tr> <td><code>THD_WAIT_ROW_LOCK</code></td> <td>Waiting for row lock</td> </tr><tr> <td><code>THD_WAIT_GLOBAL_LOCK</code></td> <td>Waiting for global lock</td> </tr><tr> <td><code>THD_WAIT_META_DATA_LOCK</code></td> <td>Waiting for metadata lock</td> </tr><tr> <td><code>THD_WAIT_TABLE_LOCK</code></td> <td>Waiting for table lock</td> </tr><tr> <td><code>THD_WAIT_USER_LOCK</code></td> <td>Waiting for user lock</td> </tr><tr> <td><code>THD_WAIT_BINLOG</code></td> <td>Waiting for binlog</td> </tr><tr> <td><code>THD_WAIT_GROUP_COMMIT</code></td> <td>Waiting for group commit</td> </tr><tr> <td><code>THD_WAIT_SYNC</code></td> <td>Waiting for fsync</td> </tr></tbody></table>

* `TP_THREAD_TYPE`

  The type of thread. The value shown in this column is one of `CONNECTION_HANDLER_WORKER_THREAD`, `LISTENER_WORKER_THREAD`, `QUERY_WORKER_THREAD`, or `TIMER_WORKER_THREAD`.

* `THREAD_ID`

  This thread's unique identifier. The value is the same as that used in the `THREAD_ID` column of the Performance Schema `threads` table.

* `TIME_OF_ATTACH`:

  Timestamp showing when the thread was attached, if attached to a connection; otherwise `NULL`.

* `MARKED_STALLED`:

  This is `True` if this thread has been marked as stalled by the stall checker thread.

* `STATE`:

  Possible values depend on the type of thread, as shown by the `TP_THREAD_TYPE` column:

  + For worker threads (`QUERY_WORKER_THREAD`), this is one of `Managing`, `Polling`, `Processing Direct`, `Processing Queued`, `Sleeping Consumer`, or `Sleeping Reserve`.

  + For connection handler threads (`CONNECTION_HANDLER_WORKER_THREAD`), this is one of `CH Processing`, `CH Sleeping Timed`, or `CH Sleeping Indefinite`.

  + For the stall checker thread (`TIMER_WORKER_THREAD`), this is one of `SC Checking`, `SC Sleeping Short`, or `SC Sleeping Long`.

* `EVENT_COUNT`:

  The accumulated number of events processed by this thread.

* `ACCUMULATED_EVENT_TIME`:

  The wall clock time spent processing events.

* `EXEC_COUNT`:

  The accumulated number of queries (statements) passed to the server for execution.

* `ACCUMULATED_EXEC_TIME`:

  The wall clock time spent processing queries by the server.

The `tp_thread_state` table has one index; this is a unique index on the `TP_GROUP_ID` and `TP_THREAD_NUMBER` columns.

`TRUNCATE TABLE` is not permitted for the `tp_thread_state` table.
