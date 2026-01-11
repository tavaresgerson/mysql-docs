#### 29.12.11.3 The replication_applier_status Table

This table shows the current general transaction execution status on the replica. The table provides information about general aspects of transaction applier status that are not specific to any thread involved. Thread-specific status information is available in the `replication_applier_status_by_coordinator` table (and `replication_applier_status_by_worker` if the replica is multithreaded).

The `replication_applier_status` table has these columns:

* `CHANNEL_NAME`

  The replication channel which this row is displaying. There is always a default replication channel, and more replication channels can be added. See Section 19.2.2, “Replication Channels” for more information.

* `SERVICE_STATE`

  Shows `ON` when the replication channel's applier threads are active or idle, `OFF` means that the applier threads are not active.

* `REMAINING_DELAY`

  If the replica is waiting for `DESIRED_DELAY` seconds to pass since the source applied a transaction, this field contains the number of delay seconds remaining. At other times, this field is `NULL`. (The `DESIRED_DELAY` value is stored in the `replication_applier_configuration` table.) See Section 19.4.11, “Delayed Replication” for more information.

* `COUNT_TRANSACTIONS_RETRIES`

  Shows the number of retries that were made because the replication SQL thread failed to apply a transaction. The maximum number of retries for a given transaction is set by the system variable `replica_transaction_retries` and `slave_transaction_retries`. The `replication_applier_status_by_worker` table shows detailed information on transaction retries for a single-threaded or multithreaded replica.

The `replication_applier_status` table has these indexes:

* Primary key on (`CHANNEL_NAME`)

`TRUNCATE TABLE` is not permitted for the `replication_applier_status` table.

The following table shows the correspondence between `replication_applier_status` columns and `SHOW REPLICA STATUS` columns.

<table summary="Correspondence between replication_applier_status columns and SHOW REPLICA STATUS columns"><thead><tr> <th><code>replication_applier_status</code> Column</th> <th><code>SHOW REPLICA STATUS</code> Column</th> </tr></thead><tbody><tr> <td><code>SERVICE_STATE</code></td> <td>None</td> </tr><tr> <td><code>REMAINING_DELAY</code></td> <td><code>SQL_Remaining_Delay</code></td> </tr></tbody></table>
