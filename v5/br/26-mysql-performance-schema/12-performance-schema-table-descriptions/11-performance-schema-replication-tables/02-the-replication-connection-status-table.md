#### 25.12.11.2 The replication_connection_status Table

This table shows the current status of the replication I/O thread that handles the replica's connection to the source.

Compared to the [`replication_connection_configuration`](performance-schema-replication-connection-configuration-table.html "25.12.11.1 The replication_connection_configuration Table") table, [`replication_connection_status`](performance-schema-replication-connection-status-table.html "25.12.11.2 The replication_connection_status Table") changes more frequently. It contains values that change during the connection, whereas [`replication_connection_configuration`](performance-schema-replication-connection-configuration-table.html "25.12.11.1 The replication_connection_configuration Table") contains values which define how the replica connects to the source and that remain constant during the connection.

The [`replication_connection_status`](performance-schema-replication-connection-status-table.html "25.12.11.2 The replication_connection_status Table") table has these columns:

* `CHANNEL_NAME`

  The replication channel which this row is displaying. There is always a default replication channel, and more replication channels can be added. See [Section 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels") for more information.

* `GROUP_NAME`

  If this server is a member of a group, shows the name of the group the server belongs to.

* `SOURCE_UUID`

  The [`server_uuid`](replication-options.html#sysvar_server_uuid) value from the source.

* `THREAD_ID`

  The I/O thread ID.

* `SERVICE_STATE`

  `ON` (thread exists and is active or idle), `OFF` (thread no longer exists), or `CONNECTING` (thread exists and is connecting to the source).

* `RECEIVED_TRANSACTION_SET`

  The set of global transaction IDs (GTIDs) corresponding to all transactions received by this replica. Empty if GTIDs are not in use. See [GTID Sets](replication-gtids-concepts.html#replication-gtids-concepts-gtid-sets "GTID Sets") for more information.

* `LAST_ERROR_NUMBER`, `LAST_ERROR_MESSAGE`

  The error number and error message of the most recent error that caused the I/O thread to stop. An error number of 0 and message of the empty string mean “no error.” If the `LAST_ERROR_MESSAGE` value is not empty, the error values also appear in the replica's error log.

  Issuing [`RESET MASTER`](reset-master.html "13.4.1.2 RESET MASTER Statement") or [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") resets the values shown in these columns.

* `LAST_ERROR_TIMESTAMP`

  A timestamp in *`YYMMDD hh:mm:ss`* format that shows when the most recent I/O error took place.

* `LAST_HEARTBEAT_TIMESTAMP`

  A timestamp in *`YYMMDD hh:mm:ss`* format that shows when the most recent heartbeat signal was received by a replica.

* `COUNT_RECEIVED_HEARTBEATS`

  The total number of heartbeat signals that a replica received since the last time it was restarted or reset, or a `CHANGE MASTER TO` statement was issued.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is not permitted for the [`replication_connection_status`](performance-schema-replication-connection-status-table.html "25.12.11.2 The replication_connection_status Table") table.

The following table shows the correspondence between [`replication_connection_status`](performance-schema-replication-connection-status-table.html "25.12.11.2 The replication_connection_status Table") columns and [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") columns.

<table summary="Correspondence between replication_connection_status columns and SHOW SLAVE STATUS columns"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th><code>replication_connection_status</code> Column</th> <th><code>SHOW SLAVE STATUS</code> Column</th> </tr></thead><tbody><tr> <td><code>SOURCE_UUID</code></td> <td><code>Master_UUID</code></td> </tr><tr> <td><code>THREAD_ID</code></td> <td>None</td> </tr><tr> <td><code>SERVICE_STATE</code></td> <td><code>Slave_IO_Running</code></td> </tr><tr> <td><code>RECEIVED_TRANSACTION_SET</code></td> <td><code>Retrieved_Gtid_Set</code></td> </tr><tr> <td><code>LAST_ERROR_NUMBER</code></td> <td><code>Last_IO_Errno</code></td> </tr><tr> <td><code>LAST_ERROR_MESSAGE</code></td> <td><code>Last_IO_Error</code></td> </tr><tr> <td><code>LAST_ERROR_TIMESTAMP</code></td> <td><code>Last_IO_Error_Timestamp</code></td> </tr></tbody></table>
