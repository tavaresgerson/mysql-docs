#### 29.12.11.13 The replication_connection_status Table

This table shows the current status of the I/O thread that handles the replica's connection to the source, information on the last transaction queued in the relay log, and information on the transaction currently being queued in the relay log.

Compared to the `replication_connection_configuration` table, `replication_connection_status` changes more frequently. It contains values that change during the connection, whereas `replication_connection_configuration` contains values which define how the replica connects to the source and that remain constant during the connection.

The `replication_connection_status` table has these columns:

* `CHANNEL_NAME`

  The replication channel which this row is displaying. There is always a default replication channel, and more replication channels can be added. See Section 19.2.2, “Replication Channels” for more information.

* `GROUP_NAME`

  If this server is a member of a group, shows the name of the group the server belongs to.

* `SOURCE_UUID`

  The `server_uuid` value from the source.

* `THREAD_ID`

  The I/O thread ID.

* `SERVICE_STATE`

  `ON` (thread exists and is active or idle), `OFF` (thread no longer exists), or `CONNECTING` (thread exists and is connecting to the source).

* `RECEIVED_TRANSACTION_SET`

  The set of global transaction IDs (GTIDs) corresponding to all transactions received by this replica. Empty if GTIDs are not in use. See GTID Sets for more information.

* `LAST_ERROR_NUMBER`, `LAST_ERROR_MESSAGE`

  The error number and error message of the most recent error that caused the I/O thread to stop. An error number of 0 and message of the empty string mean “no error.” If the `LAST_ERROR_MESSAGE` value is not empty, the error values also appear in the replica's error log.

  Issuing `RESET BINARY LOGS AND GTIDS` or `RESET REPLICA` resets the values shown in these columns.

* `LAST_ERROR_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when the most recent I/O error took place.

* `LAST_HEARTBEAT_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when the most recent heartbeat signal was received by a replica.

* `COUNT_RECEIVED_HEARTBEATS`

  The total number of heartbeat signals that a replica received since the last time it was restarted or reset, or a `CHANGE REPLICATION SOURCE TO` statement was issued.

* `LAST_QUEUED_TRANSACTION`

  The global transaction ID (GTID) of the last transaction that was queued to the relay log.

* `LAST_QUEUED_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when the last transaction queued in the relay log was committed on the original source.

* `LAST_QUEUED_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when the last transaction queued in the relay log was committed on the immediate source.

* `LAST_QUEUED_TRANSACTION_START_QUEUE_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when the last transaction was placed in the relay log queue by this I/O thread.

* `LAST_QUEUED_TRANSACTION_END_QUEUE_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when the last transaction was queued to the relay log files.

* `QUEUEING_TRANSACTION`

  The global transaction ID (GTID) of the currently queueing transaction in the relay log.

* `QUEUEING_TRANSACTION_ORIGINAL_COMMIT_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when the currently queueing transaction was committed on the original source.

* `QUEUEING_TRANSACTION_IMMEDIATE_COMMIT_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when the currently queueing transaction was committed on the immediate source.

* `QUEUEING_TRANSACTION_START_QUEUE_TIMESTAMP`

  A timestamp in `'YYYY-MM-DD hh:mm:ss[.fraction]'` format that shows when the first event of the currently queueing transaction was written to the relay log by this I/O thread.

When the Performance Schema is disabled, local timing information is not collected, so the fields showing the start and end timestamps for queued transactions are zero.

The `replication_connection_status` table has these indexes:

* Primary key on (`CHANNEL_NAME`)
* Index on (`THREAD_ID`)

The following table shows the correspondence between `replication_connection_status` columns and `SHOW REPLICA STATUS` columns.

<table summary="Correspondence between replication_connection_status columns and SHOW REPLICA STATUS columns"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th><code class="literal">replication_connection_status</code> Column</th> <th><code class="literal">SHOW REPLICA STATUS</code> Column</th> </tr></thead><tbody><tr> <td><code class="literal">SOURCE_UUID</code></td> <td><code class="literal">Master_UUID</code></td> </tr><tr> <td><code class="literal">THREAD_ID</code></td> <td>None</td> </tr><tr> <td><code class="literal">SERVICE_STATE</code></td> <td><code class="literal">Replica_IO_Running</code></td> </tr><tr> <td><code class="literal">RECEIVED_TRANSACTION_SET</code></td> <td><code class="literal">Retrieved_Gtid_Set</code></td> </tr><tr> <td><code class="literal">LAST_ERROR_NUMBER</code></td> <td><code class="literal">Last_IO_Errno</code></td> </tr><tr> <td><code class="literal">LAST_ERROR_MESSAGE</code></td> <td><code class="literal">Last_IO_Error</code></td> </tr><tr> <td><code class="literal">LAST_ERROR_TIMESTAMP</code></td> <td><code class="literal">Last_IO_Error_Timestamp</code></td> </tr></tbody></table>
