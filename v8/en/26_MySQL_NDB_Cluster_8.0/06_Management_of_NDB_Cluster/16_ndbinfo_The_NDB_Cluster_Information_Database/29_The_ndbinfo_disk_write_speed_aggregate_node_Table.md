#### 25.6.16.29 The ndbinfo disk_write_speed_aggregate_node Table

The `disk_write_speed_aggregate_node` table provides aggregated information per node about the speed of disk writes during LCP, backup, and restore operations.

The `disk_write_speed_aggregate_node` table contains the following columns:

* `node_id`

  Node ID of this node

* `backup_lcp_speed_last_sec`

  Number of bytes written to disk by backup and LCP processes in the last second

* `redo_speed_last_sec`

  Number of bytes written to the redo log in the last second

* `backup_lcp_speed_last_10sec`

  Number of bytes written to disk by backup and LCP processes per second, averaged over the last 10 seconds

* `redo_speed_last_10sec`

  Number of bytes written to the redo log each second, averaged over the last 10 seconds

* `backup_lcp_speed_last_60sec`

  Number of bytes written to disk by backup and LCP processes per second, averaged over the last 60 seconds

* `redo_speed_last_60sec`

  Number of bytes written to the redo log each second, averaged over the last 60 seconds
