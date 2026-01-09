#### 25.12.11.5 The replication_applier_status_by_coordinator Table

For a multithreaded replica, the replica uses multiple worker threads and a coordinator thread to manage them, and this table shows the status of the coordinator thread. For a single-threaded replica, this table is empty. For a multithreaded replica, the [`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "25.12.11.6 The replication_applier_status_by_worker Table") table shows the status of the worker threads.

The [`replication_applier_status_by_coordinator`](performance-schema-replication-applier-status-by-coordinator-table.html "25.12.11.5 The replication_applier_status_by_coordinator Table") table has these columns:

* `CHANNEL_NAME`

  The replication channel which this row is displaying. There is always a default replication channel, and more replication channels can be added. See [Section 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels") for more information.

* `THREAD_ID`

  The SQL/coordinator thread ID.

* `SERVICE_STATE`

  `ON` (thread exists and is active or idle) or `OFF` (thread no longer exists).

* `LAST_ERROR_NUMBER`, `LAST_ERROR_MESSAGE`

  The error number and error message of the most recent error that caused the SQL/coordinator thread to stop. An error number of 0 and message which is an empty string means “no error”. If the `LAST_ERROR_MESSAGE` value is not empty, the error values also appear in the replica's error log.

  Issuing [`RESET MASTER`](reset-master.html "13.4.1.2 RESET MASTER Statement") or [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") resets the values shown in these columns.

  All error codes and messages displayed in the `LAST_ERROR_NUMBER` and `LAST_ERROR_MESSAGE` columns correspond to error values listed in [Server Error Message Reference](/doc/mysql-errors/5.7/en/server-error-reference.html).

* `LAST_ERROR_TIMESTAMP`

  A timestamp in *`YYMMDD hh:mm:ss`* format that shows when the most recent SQL/coordinator error occurred.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is not permitted for the [`replication_applier_status_by_coordinator`](performance-schema-replication-applier-status-by-coordinator-table.html "25.12.11.5 The replication_applier_status_by_coordinator Table") table.

The following table shows the correspondence between [`replication_applier_status_by_coordinator`](performance-schema-replication-applier-status-by-coordinator-table.html "25.12.11.5 The replication_applier_status_by_coordinator Table") columns and [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") columns.

<table summary="Correspondence between replication_applier_status_by_coordinator columns and SHOW SLAVE STATUS columns"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th><code>replication_applier_status_by_coordinator</code> Column</th> <th><code>SHOW SLAVE STATUS</code> Column</th> </tr></thead><tbody><tr> <td><code>THREAD_ID</code></td> <td>None</td> </tr><tr> <td><code>SERVICE_STATE</code></td> <td><code>Slave_SQL_Running</code></td> </tr><tr> <td><code>LAST_ERROR_NUMBER</code></td> <td><code>Last_SQL_Errno</code></td> </tr><tr> <td><code>LAST_ERROR_MESSAGE</code></td> <td><code>Last_SQL_Error</code></td> </tr><tr> <td><code>LAST_ERROR_TIMESTAMP</code></td> <td><code>Last_SQL_Error_Timestamp</code></td> </tr></tbody></table>
