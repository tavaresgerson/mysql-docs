#### 29.12.11.6 The replication\_applier\_progress\_by\_worker Table

This table provides information about the transaction currently being applied by a given worker. If there is no such transaction, this table is empty.

Note

This table requires installation of the `replication_applier_metrics` component, which is available with MySQL Enterprise Edition only. See Section 7.5.6.1, “Replication Applier Metrics Component”, for more information.

The `replication_applier_progress_by_worker` table has these columns:

* `CHANNEL_NAME`

  The name of the replication channel.

* `WORKER_ID`

  The worker ID.

* `THREAD_ID`

  The worker thread ID of the applier thread; this is the same as the worker thread ID shown by the `THREAD_ID` column of the `replication_applier_status_by_worker` table

* `ONGOING_TRANSACTION_TYPE`

  The type of transaction being executed; one of `UNASSIGNED`, `DML`, or `DDL`. The type of a given transaction is known only after its associated GTID event has been processed. Until then, its type is shown as `UNASSIGNED`.

  This information is available only for workers executing transactions.

* `ONGOING_TRANSACTION_FULL_SIZE_BYTES`

  The total size (in bytes) of the transaction currently being executed by this worker. This is set when processing the transaction GTID or (for compressed transactions) the transaction payload event, and is reset to 0 when the transaction is committed.

  This information is available only for workers executing transactions.

* `ONGOING_TRANSACTION_APPLIED_SIZE_BYTES`

  The size (in bytes) of those parts of the worker's ongoing transaction that have already been executed. This increases with each event executed (provided that the event provides a data size), and is reset when the transaction is committed.

  This information is available only for workers executing transactions.
