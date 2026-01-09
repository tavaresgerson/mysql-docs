#### 29.12.11.5 The replication_applier_metrics Table

This table provides replication applier statistics such as wait times, wait counts, transaction counts, event counts, and byte counts for the applier coordinator.

Note

This table requires installation of the `replication_applier_metrics` component, which is available with MySQL Enterprise Edition only. See Section 7.5.6.1, “Replication Applier Metrics Component”, for more information.

The `replication_applier_metrics` table has these columns:

* `CHANNEL_NAME`

  The replication channel. See Section 19.2.2, “Replication Channels”.

* `TOTAL_ACTIVE_TIME_DURATION`

  The coordinator total active time since measurements were restarted. If the applier is stopped and restarted, then all active periods are summed together.

  This information is reset when the replica server is restarted. It is not reset when the applier stops.

* `LAST_APPLIER_START`

  The last time (since server start) that the channel's applier was started. This value is reset each time that the applier for the channel named in the `CHANNEL_NAME` column is started (or restarted).

* `TRANSACTIONS_COMMITTED_COUNT`

  The number of transactions committed since the last time the metrics were reset.

  This information is reset when the replica is restarted, or the user issues `RESET REPLICA`. It is not reset when the applier stops.

* `TRANSACTIONS_ONGOING_COUNT`

  The number of ongoing transactions. A transaction is marked as ongoing when its first event is scheduled on a worker; this counter decreases when the transaction is committed.

* `TRANSACTIONS_PENDING_COUNT`

  The number of pending transactions waiting to be applied. A transaction is considered to be pending when it is queued in the relay log, and is no longer considered pending when it is committed. This number includes any ongoing transactions.

  When the server is restarted with existing relay logs, the number of pending transactions is known only after all old relay logs have been consumed. Until this has taken place, the value shown in this column is `NULL`.

* `TRANSACTIONS_COMMITTED_SIZE_BYTES_SUM`

  The total size, in bytes, of all transactions committed since the last time the metrics were reset.

  This information is reset when the replica is restarted, or the user issues `RESET REPLICA`. It is not reset when the applier stops.

* `TRANSACTIONS_ONGOING_FULL_SIZE_BYTES_SUM`

  The total size (in bytes) of all transactions currently being executed by workers. This increases for the first GTID event or (for compressed transactions) the first transaction payload event scheduled for each transaction, and decreases when a transaction is committed.

* `TRANSACTIONS_ONGOING_PROGRESS_SIZE_BYTES_SUM`

  The size (in bytes) of the parts of transactions that have already been executed for ongoing transactions. This increases as events are processed for each transaction, and decreases whenever a transaction is committed.

* `TRANSACTIONS_PENDING_SIZE_BYTES_SUM`

  The size, in bytes, of all transactions awaiting execution. This increases when a GTID event or (for compressed transactions) the first transaction payload event is queued in the relay log, and decreases whenever a transaction is committed.

  A transaction is considered to be pending when it is queued in the relay log, and is no longer considered pending when it is committed. This number includes any ongoing transactions.

  When the server is restarted with existing relay logs, the number of pending transactions is known only after all old relay logs have been consumed. Until this has taken place, the value shown in this column is `NULL`.

* `EVENTS_COMMITTED_COUNT`

  The number of events committed since the last time the metrics were reset. For compressed transactions, this counts embedded events but not payload events.

  This information is reset when the replica is restarted, or the user issues `RESET REPLICA`. It is not reset when the applier stops.

* `WAITS_FOR_WORK_FROM_SOURCE_COUNT`

  The number of times spent waiting for work from upstream, that is, waiting for the relay log to grow, since the last time the metrics were reset. It is possible for this counter to increase when there is no work to be done; the coordinator executes not one, but rather a continuous series of waiting cycles.

  This information is reset when the replica is restarted, or the user issues `RESET REPLICA`. It is not reset when the applier stops.

* `WAITS_FOR_WORK_FROM_SOURCE_SUM_TIME`

  The time spent waiting for work from upstream, that is, waiting for the relay log to grow since the last time the metrics were reset.

  This information is reset when the replica is restarted, or the user issues `RESET REPLICA`. It is not reset when the applier stops.

* `WAITS_FOR_AVAILABLE_WORKER_COUNT`

  The number of times the coordinator has waited while scheduling a transaction until a worker has become available.

  This information is reset when the replica is restarted, or the user issues `RESET REPLICA`. It is not reset when the applier stops.

* `WAITS_FOR_AVAILABLE_WORKER_SUM_TIME`

  The aggregate time in nanoseconds that the coordinator has waited while scheduling a transaction until a worker has become available.

  This information is reset when the replica is restarted, or the user issues `RESET REPLICA`. It is not reset when the applier stops.

* `WAITS_COMMIT_SCHEDULE_DEPENDENCY_COUNT`

  The number of times the coordinator has waited for a preceding dependent transaction to commit.

  This information is reset when the replica is restarted, or the user issues `RESET REPLICA`. It is not reset when the applier stops.

* `WAITS_COMMIT_SCHEDULE_DEPENDENCY_SUM_TIME`

  The aggregate time that the coordinator has waited for a preceding dependent transaction to commit.

  This information is reset when the replica is restarted, or the user issues `RESET REPLICA`. It is not reset when the applier stops.

* `WAITS_FOR_WORKER_QUEUE_MEMORY_COUNT`

  The number of times the coordinator has waited while scheduling a worker to process an event until the worker has reduced the size of its queue to less than `replica_pending_jobs_size_max` bytes.

  This information is reset when the replica is restarted, or the user issues `RESET REPLICA`. It is not reset when the applier stops.

* `WAITS_FOR_WORKER_QUEUE_MEMORY_SUM_TIME`

  The aggregate time that the coordinator has waited to schedule a worker to process an event until the worker has reduced the size of its queue to less than `replica_pending_jobs_size_max` bytes.

  This information is reset when the replica is restarted or the channel on the replica is deleted. It is not reset when the applier stops.

* `WAITS_WORKER_QUEUES_FULL_COUNT`

  The number of times the coordinator has waited because there were no empty slots for adding more tasks to the worker queue.

  This information is reset when the replica is restarted or the channel on the replica is deleted. It is not reset when the applier stops.

* `WAITS_WORKER_QUEUES_FULL_SUM_TIME`

  The aggregated time the coordinator has waited because there were no empty slots for adding more tasks to the worker queue.

  This information is reset when the replica is restarted or the channel on the replica is deleted. It is not reset when the applier stops.

* `WAITS_DUE_TO_COMMIT_ORDER_COUNT`

  The number of times workers have waited for preceding transactions to commit before they could commit their own transactions.

  This information is reset when the replica is restarted or the channel on the replica is deleted. It is not reset when the applier stops.

* `WAITS_DUE_TO_COMMIT_ORDER_SUM_TIME`

  The time in nanoseconds that workers have waited for preceding transactions to commit before they could commit their own transactions.

  This information is reset when the replica is restarted or the channel on the replica is deleted. It is not reset when the applier stops.

* `TIME_TO_READ_FROM_RELAY_LOG_SUM_TIME`

  The cumulative time spent by the coordinator on reading events from the relay log since the metrics were reset.

  This information is reset when the replica is restarted or the channel on the replica is deleted. It is not reset when the applier stops.
