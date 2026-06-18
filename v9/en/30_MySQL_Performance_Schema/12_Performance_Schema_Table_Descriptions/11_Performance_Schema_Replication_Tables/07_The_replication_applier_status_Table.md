#### 29.12.11.7 The replication\_applier\_status Table

This table shows the current general transaction execution
status on the replica. The table provides information about
general aspects of transaction applier status that are not
specific to any thread involved. Thread-specific status
information is available in the
[`replication_applier_status_by_coordinator`](performance-schema-replication-applier-status-by-coordinator-table.html "29.12.11.8 The replication_applier_status_by_coordinator Table")
table (and
[`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "29.12.11.9 The replication_applier_status_by_worker Table")
if the replica is multithreaded).

The [`replication_applier_status`](performance-schema-replication-applier-status-table.html "29.12.11.7 The replication_applier_status Table")
table has these columns:

* `CHANNEL_NAME`

  The replication channel which this row is displaying.
  There is always a default replication channel, and more
  replication channels can be added. See
  [Section 19.2.2, “Replication Channels”](replication-channels.html "19.2.2 Replication Channels") for more
  information.

* `SERVICE_STATE`

  Shows `ON` when the replication
  channel's applier threads are active or idle,
  `OFF` means that the applier threads are
  not active.

* `REMAINING_DELAY`

  If the replica is waiting for
  `DESIRED_DELAY` seconds to pass since the
  source applied a transaction, this field contains the
  number of delay seconds remaining. At other times, this
  field is `NULL`. (The
  `DESIRED_DELAY` value is stored in the
  [`replication_applier_configuration`](performance-schema-replication-applier-configuration-table.html "29.12.11.2 The replication_applier_configuration Table")
  table.) See [Section 19.4.11, “Delayed Replication”](replication-delayed.html "19.4.11 Delayed Replication") for more
  information.

* `COUNT_TRANSACTIONS_RETRIES`

  Shows the number of retries that were made because the
  replication SQL thread failed to apply a transaction. The
  maximum number of retries for a given transaction is set
  by the system variable
  [`replica_transaction_retries`](replication-options-replica.html#sysvar_replica_transaction_retries).
  The
  [`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "29.12.11.9 The replication_applier_status_by_worker Table")
  table shows detailed information on transaction retries
  for a single-threaded or multithreaded replica.

The [`replication_applier_status`](performance-schema-replication-applier-status-table.html "29.12.11.7 The replication_applier_status Table")
table has these indexes:

* Primary key on (`CHANNEL_NAME`)

[`TRUNCATE TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement") is not permitted
for the
[`replication_applier_status`](performance-schema-replication-applier-status-table.html "29.12.11.7 The replication_applier_status Table") table.

The following table shows the correspondence between
[`replication_applier_status`](performance-schema-replication-applier-status-table.html "29.12.11.7 The replication_applier_status Table")
columns and
[`SHOW
REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement") columns.

<table summary="Correspondence between replication_applier_status columns and SHOW REPLICA STATUS columns"><col style="width: 60%"/><col style="width: 40%"/><thead><tr>
<th><code class="literal">replication_applier_status</code> Column</th>
<th><code class="literal">SHOW REPLICA STATUS</code> Column</th>
</tr></thead><tbody><tr>
<td><code class="literal">SERVICE_STATE</code></td>
<td>None</td>
</tr><tr>
<td><code class="literal">REMAINING_DELAY</code></td>
<td><code class="literal">SQL_Remaining_Delay</code></td>
</tr></tbody></table>