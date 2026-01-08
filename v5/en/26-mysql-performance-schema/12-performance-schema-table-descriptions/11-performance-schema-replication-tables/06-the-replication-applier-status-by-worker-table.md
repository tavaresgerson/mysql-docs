#### 25.12.11.6 The replication\_applier\_status\_by\_worker Table

If the replica is not multithreaded, this table shows the status of the applier thread. Otherwise, the replica uses multiple worker threads and a coordinator thread to manage them, and this table shows the status of the worker threads. For a multithreaded replica, the [`replication_applier_status_by_coordinator`](performance-schema-replication-applier-status-by-coordinator-table.html "25.12.11.5 The replication_applier_status_by_coordinator Table") table shows the status of the coordinator thread.

The `replication_applier_status_by_worker` table has these columns:

* `CHANNEL_NAME`

  The replication channel which this row is displaying. There is always a default replication channel, and more replication channels can be added. See [Section 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels") for more information.

* `WORKER_ID`

  The worker identifier (same value as the `id` column in the `mysql.slave_worker_info` table). After [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement"), the `THREAD_ID` column becomes `NULL`, but the `WORKER_ID` value is preserved.

* `THREAD_ID`

  The worker thread identifier.

* `SERVICE_STATE`

  `ON` (thread exists and is active or idle) or `OFF` (thread no longer exists).

* `LAST_SEEN_TRANSACTION`

  The transaction that the worker has last seen. The worker has not necessarily applied this transaction because it could still be in the process of doing so.

  If the [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) system variable value is `OFF`, this column is `ANONYMOUS`, indicating that transactions do not have global transaction identifiers (GTIDs) and are identified by file and position only.

  If [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) is `ON`, the column value is defined as follows:

  + If no transaction has executed, the column is empty.
  + When a transaction has executed, the column is set from [`gtid_next`](replication-options-gtids.html#sysvar_gtid_next) as soon as [`gtid_next`](replication-options-gtids.html#sysvar_gtid_next) is set. From this moment, the column always shows a GTID.

  + The GTID is preserved until the next transaction is executed. If an error occurs, the column value is the GTID of the transaction being executed by the worker when the error occurred. The following statement shows whether or not that transaction has been committed:

    ```sql
    SELECT GTID_SUBSET(LAST_SEEN_TRANSACTION, @@GLOBAL.GTID_EXECUTED)
    FROM performance_schema.replication_applier_status_by_worker;
    ```

    If the statement returns zero, the transaction has not yet been committed, either because it is still being processed, or because the worker thread was stopped while it was being processed. If the statement returns nonzero, the transaction has been committed.

* `LAST_ERROR_NUMBER`, `LAST_ERROR_MESSAGE`

  The error number and error message of the most recent error that caused the worker thread to stop. An error number of 0 and message of the empty string mean “no error”. If the `LAST_ERROR_MESSAGE` value is not empty, the error values also appear in the replica's error log.

  Issuing [`RESET MASTER`](reset-master.html "13.4.1.2 RESET MASTER Statement") or [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") resets the values shown in these columns.

  All error codes and messages displayed in the `LAST_ERROR_NUMBER` and `LAST_ERROR_MESSAGE` columns correspond to error values listed in [Server Error Message Reference](/doc/mysql-errors/5.7/en/server-error-reference.html).

* `LAST_ERROR_TIMESTAMP`

  A timestamp in *`YYMMDD hh:mm:ss`* format that shows when the most recent worker error occurred.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is not permitted for the [`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "25.12.11.6 The replication_applier_status_by_worker Table") table.

The following table shows the correspondence between `replication_applier_status_by_worker` columns and [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") columns.

<table summary="Correspondence between replication_applier_status_by_worker columns and SHOW SLAVE STATUS columns"><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th><code>replication_applier_status_by_worker</code> Column</th> <th><code>SHOW SLAVE STATUS</code> Column</th> </tr></thead><tbody><tr> <td><code>WORKER_ID</code></td> <td>None</td> </tr><tr> <td><code>THREAD_ID</code></td> <td>None</td> </tr><tr> <td><code>SERVICE_STATE</code></td> <td>None</td> </tr><tr> <td><code>LAST_SEEN_TRANSACTION</code></td> <td>None</td> </tr><tr> <td><code>LAST_ERROR_NUMBER</code></td> <td><code>Last_SQL_Errno</code></td> </tr><tr> <td><code>LAST_ERROR_MESSAGE</code></td> <td><code>Last_SQL_Error</code></td> </tr><tr> <td><code>LAST_ERROR_TIMESTAMP</code></td> <td><code>Last_SQL_Error_Timestamp</code></td> </tr></tbody></table>
