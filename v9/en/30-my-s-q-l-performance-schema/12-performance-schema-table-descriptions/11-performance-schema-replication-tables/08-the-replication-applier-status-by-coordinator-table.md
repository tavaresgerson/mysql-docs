#### 29.12.11.8 The replication_applier_status_by_coordinator Table

For a multithreaded replica, the replica uses multiple worker threads and a coordinator thread to manage them, and this table shows the status of the coordinator thread. For a single-threaded replica, this table is empty. For a multithreaded replica, the `replication_applier_status_by_worker` table shows the status of the worker threads. This table provides information about the last transaction which was buffered by the coordinator thread to a worker’s queue, as well as the transaction it is currently buffering. The start timestamp refers to when this thread read the first event of the transaction from the relay log to buffer it to a worker’s queue, while the end timestamp refers to when the last event finished buffering to the worker’s queue.

The `replication_applier_status_by_coordinator` table has these columns:

* `CHANNEL_NAME`

  The replication channel which this row is displaying. There is always a default replication channel, and more replication channels can be added. See Section 19.2.2, “Replication Channels” for more information.

* `THREAD_ID`

  The SQL/coordinator thread ID.

* `SERVICE_STATE`

  `ON` (thread exists and is active or idle) or `OFF` (thread no longer exists).

* `LAST_ERROR_NUMBER`, `LAST_ERROR_MESSAGE`

  The error number and error message of the most recent error that caused the SQL/coordinator thread to stop. An error number of 0 and message which is an empty string means “no error”. If the `LAST_ERROR_MESSAGE` value is not empty, the error values also appear in the replica's error log.

  Issuing `RESET BINARY LOGS AND GTIDS` or `RESET REPLICA` resets the values shown in these columns.

  All error codes and messages displayed in the `LAST_ERROR_NUMBER` and `LAST_ERROR_MESSAGE` columns correspond to error values listed in Server Error Message Reference.

* `LAST_ERROR_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when the most recent SQL/coordinator error occurred.

* `LAST_PROCESSED_TRANSACTION`

  The global transaction ID (GTID) of the last transaction processed by this coordinator.

* `LAST_PROCESSED_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when the last transaction processed by this coordinator was committed on the original source.

* `LAST_PROCESSED_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when the last transaction processed by this coordinator was committed on the immediate source.

* `LAST_PROCESSED_TRANSACTION_START_BUFFER_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when this coordinator thread started writing the last transaction to the buffer of a worker thread.

* `LAST_PROCESSED_TRANSACTION_END_BUFFER_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when the last transaction was written to the buffer of a worker thread by this coordinator thread.

* `PROCESSING_TRANSACTION`

  The global transaction ID (GTID) of the transaction that this coordinator thread is currently processing.

* `PROCESSING_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when the currently processing transaction was committed on the original source.

* `PROCESSING_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when the currently processing transaction was committed on the immediate source.

* `PROCESSING_TRANSACTION_START_BUFFER_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when this coordinator thread started writing the currently processing transaction to the buffer of a worker thread.

When the Performance Schema is disabled, local timing information is not collected, so the fields showing the start and end timestamps for buffered transactions are zero.

The `replication_applier_status_by_coordinator` table has these indexes:

* Primary key on (`CHANNEL_NAME`)
* Index on (`THREAD_ID`)

The following table shows the correspondence between `replication_applier_status_by_coordinator` columns and `SHOW REPLICA STATUS` columns.

<table summary="Correspondence between replication_applier_status_by_coordinator columns and SHOW REPLICA STATUS columns"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th><code class="literal">replication_applier_status_by_coordinator</code> Column</th> <th><code class="literal">SHOW REPLICA STATUS</code> Column</th> </tr></thead><tbody><tr> <td><code class="literal">THREAD_ID</code></td> <td>None</td> </tr><tr> <td><code class="literal">SERVICE_STATE</code></td> <td><code class="literal">Replica_SQL_Running</code></td> </tr><tr> <td><code class="literal">LAST_ERROR_NUMBER</code></td> <td><code class="literal">Last_SQL_Errno</code></td> </tr><tr> <td><code class="literal">LAST_ERROR_MESSAGE</code></td> <td><code class="literal">Last_SQL_Error</code></td> </tr><tr> <td><code class="literal">LAST_ERROR_TIMESTAMP</code></td> <td><code class="literal">Last_SQL_Error_Timestamp</code></td> </tr></tbody></table>
