#### 7.5.6.1 Replication Applier Metrics Component

The Replication Applier Metrics component implements two
Performance Schema tables, listed here:

* [`replication_applier_metrics`](performance-schema-replication-applier-metrics-table.html "29.12.11.5 The replication_applier_metrics Table"):
  Shows statistics for the replication applier, for a given
  replication channel.

* [`replication_applier_progress_by_worker`](performance-schema-replication-applier-progress-by-worker-table.html "29.12.11.6 The replication_applier_progress_by_worker Table"):
  Shows statistics for the replication applier, for the worker
  with the given ID and channel name.

* Purpose: Provide replication applier statistics tables in
  the MySQL Performance Schema.

* URN:
  `file://component_replication_applier_metrics`

For installation instructions, see
[Section 7.5.1, “Installing and Uninstalling Components”](component-loading.html "7.5.1 Installing and Uninstalling Components").

This component is available only as part of MySQL Enterprise Edition.

Important

The `replication_applier_metrics` component
does not function when
[`replica_parallel_workers=0`](replication-options-replica.html#sysvar_replica_parallel_workers).