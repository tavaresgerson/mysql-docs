#### 29.12.11.9 The replication\_applier\_status\_by\_worker Table

This table provides details of the transactions handled by applier threads on a replica or Group Replication group member. For a single-threaded replica, data is shown for the replica's single applier thread. For a multithreaded replica, data is shown individually for each applier thread. The applier threads on a multithreaded replica are sometimes called workers. The number of applier threads on a replica or Group Replication group member is set by the `replica_parallel_workers` system variable. A multithreaded replica also has a coordinator thread to manage the applier threads, and the status of this thread is shown in the `replication_applier_status_by_coordinator` table.

All error codes and messages displayed in the columns relating to errors correspond to error values listed in Server Error Message Reference.

When the Performance Schema is disabled, local timing information is not collected, so the fields showing the start and end timestamps for applied transactions are zero. The start timestamps in this table refer to when the worker started applying the first event, and the end timestamps refer to when the last event of the transaction was applied.

When a replica is restarted by a `START REPLICA` statement, the columns beginning `APPLYING_TRANSACTION` are reset.

The `replication_applier_status_by_worker` table has these columns:

* `CHANNEL_NAME`

  The replication channel which this row is displaying. There is always a default replication channel, and more replication channels can be added. See Section 19.2.2, “Replication Channels” for more information.

* `WORKER_ID`

  The worker identifier (same value as the `id` column in the `mysql.slave_worker_info` table). After `STOP REPLICA`, the `THREAD_ID` column becomes `NULL`, but the `WORKER_ID` value is preserved.

* `THREAD_ID`

  The worker thread ID.

* `SERVICE_STATE`

  `ON` (thread exists and is active or idle) or `OFF` (thread no longer exists).

* `LAST_ERROR_NUMBER`, `LAST_ERROR_MESSAGE`

  The error number and error message of the most recent error that caused the worker thread to stop. An error number of 0 and message of the empty string mean “no error”. If the `LAST_ERROR_MESSAGE` value is not empty, the error values also appear in the replica's error log.

  Issuing `RESET BINARY LOGS AND GTIDS` or `RESET REPLICA` resets the values shown in these columns.

* `LAST_ERROR_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when the most recent worker error occurred.

* `LAST_APPLIED_TRANSACTION`

  The global transaction ID (GTID) of the last transaction applied by this worker.

* `LAST_APPLIED_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when the last transaction applied by this worker was committed on the original source.

* `LAST_APPLIED_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when the last transaction applied by this worker was committed on the immediate source.

* `LAST_APPLIED_TRANSACTION_START_APPLY_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when this worker started applying the last applied transaction.

* `LAST_APPLIED_TRANSACTION_END_APPLY_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when this worker finished applying the last applied transaction.

* `APPLYING_TRANSACTION`

  The global transaction ID (GTID) of the transaction this worker is currently applying.

* `APPLYING_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when the transaction this worker is currently applying was committed on the original source.

* `APPLYING_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when the transaction this worker is currently applying was committed on the immediate source.

* `APPLYING_TRANSACTION_START_APPLY_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when this worker started its first attempt to apply the transaction that is currently being applied.

* `LAST_APPLIED_TRANSACTION_RETRIES_COUNT`

  The number of times the last applied transaction was retried by the worker after the first attempt. If the transaction was applied at the first attempt, this number is zero.

* `LAST_APPLIED_TRANSACTION_LAST_TRANSIENT_ERROR_NUMBER`

  The error number of the last transient error that caused the transaction to be retried.

* `LAST_APPLIED_TRANSACTION_LAST_TRANSIENT_ERROR_MESSAGE`

  The message text for the last transient error that caused the transaction to be retried.

* `LAST_APPLIED_TRANSACTION_LAST_TRANSIENT_ERROR_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format for the last transient error that caused the transaction to be retried.

* `APPLYING_TRANSACTION_RETRIES_COUNT`

  The number of times the transaction that is currently being applied was retried until this moment. If the transaction was applied at the first attempt, this number is zero.

* `APPLYING_TRANSACTION_LAST_TRANSIENT_ERROR_NUMBER`

  The error number of the last transient error that caused the current transaction to be retried.

* `APPLYING_TRANSACTION_LAST_TRANSIENT_ERROR_MESSAGE`

  The message text for the last transient error that caused the current transaction to be retried.

* `APPLYING_TRANSACTION_LAST_TRANSIENT_ERROR_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format for the last transient error that caused the current transaction to be retried.

The `replication_applier_status_by_worker` table has these indexes:

* Primary key on (`CHANNEL_NAME`, `WORKER_ID`)

* Index on (`THREAD_ID`)

The following table shows the correspondence between `replication_applier_status_by_worker` columns and `SHOW REPLICA STATUS` columns.

<table summary="Correspondence between replication_applier_status_by_worker columns and SHOW REPLICA STATUS columns"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th><code class="literal">replication_applier_status_by_worker</code> Column</th> <th><code class="literal">SHOW REPLICA STATUS</code> Column</th> </tr></thead><tbody><tr> <td><code class="literal">WORKER_ID</code></td> <td>None</td> </tr><tr> <td><code class="literal">THREAD_ID</code></td> <td>None</td> </tr><tr> <td><code class="literal">SERVICE_STATE</code></td> <td>None</td> </tr><tr> <td><code class="literal">LAST_ERROR_NUMBER</code></td> <td><code class="literal">Last_SQL_Errno</code></td> </tr><tr> <td><code class="literal">LAST_ERROR_MESSAGE</code></td> <td><code class="literal">Last_SQL_Error</code></td> </tr><tr> <td><code class="literal">LAST_ERROR_TIMESTAMP</code></td> <td><code class="literal">Last_SQL_Error_Timestamp</code></td> </tr></tbody></table>
