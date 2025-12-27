### 24.5.4 The INFORMATION\_SCHEMA TP\_THREAD\_STATE Table

The [`TP_THREAD_STATE`](information-schema-tp-thread-state-table.html "24.5.4 The INFORMATION_SCHEMA TP_THREAD_STATE Table") table has one row per thread created by the thread pool to handle connections.

The [`TP_THREAD_STATE`](information-schema-tp-thread-state-table.html "24.5.4 The INFORMATION_SCHEMA TP_THREAD_STATE Table") table has these columns:

* `TP_GROUP_ID`

  The thread group ID.

* `TP_THREAD_NUMBER`

  The ID of the thread within its thread group. `TP_GROUP_ID` and `TP_THREAD_NUMBER` together provide a unique key within the table.

* `PROCESS_COUNT`

  The 10ms interval in which the statement that uses this thread is currently executing. 0 means no statement is executing, 1 means it is in the first 10ms, and so forth.

* `WAIT_TYPE`

  The type of wait for the thread. `NULL` means the thread is not blocked. Otherwise, the thread is blocked by a call to `thd_wait_begin()` and the value specifies the type of wait. The `xxx_WAIT` columns of the [`TP_THREAD_GROUP_STATS`](information-schema-tp-thread-group-stats-table.html "24.5.3 The INFORMATION_SCHEMA TP_THREAD_GROUP_STATS Table") table accumulate counts for each wait type.

  The `WAIT_TYPE` value is a string that describes the type of wait, as shown in the following table.

  **Table 24.8 TP\_THREAD\_STATE Table WAIT\_TYPE Values**

  <table summary="TP_THREAD_STATE table WAIT_TYPE values. The first column is the wait type. The second column describes the wait type."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th>Wait Type</th> <th>Meaning</th> </tr></thead><tbody><tr> <td><code class="literal">THD_WAIT_SLEEP</code></td> <td>Waiting for sleep</td> </tr><tr> <td><code class="literal">THD_WAIT_DISKIO</code></td> <td>Waiting for Disk IO</td> </tr><tr> <td><code class="literal">THD_WAIT_ROW_LOCK</code></td> <td>Waiting for row lock</td> </tr><tr> <td><code class="literal">THD_WAIT_GLOBAL_LOCK</code></td> <td>Waiting for global lock</td> </tr><tr> <td><code class="literal">THD_WAIT_META_DATA_LOCK</code></td> <td>Waiting for metadata lock</td> </tr><tr> <td><code class="literal">THD_WAIT_TABLE_LOCK</code></td> <td>Waiting for table lock</td> </tr><tr> <td><code class="literal">THD_WAIT_USER_LOCK</code></td> <td>Waiting for user lock</td> </tr><tr> <td><code class="literal">THD_WAIT_BINLOG</code></td> <td>Waiting for binlog</td> </tr><tr> <td><code class="literal">THD_WAIT_GROUP_COMMIT</code></td> <td>Waiting for group commit</td> </tr><tr> <td><code class="literal">THD_WAIT_SYNC</code></td> <td>Waiting for fsync</td> </tr></tbody></table>
