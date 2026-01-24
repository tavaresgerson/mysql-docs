#### 21.6.15.18 The ndbinfo disk_write_speed_aggregate Table

The `disk_write_speed_aggregate` table provides aggregated information about the speed of disk writes during LCP, backup, and restore operations.

The `disk_write_speed_aggregate` table contains the following columns:

* `node_id`

  Node ID of this node

* `thr_no`

  Thread ID of this LDM thread

* `backup_lcp_speed_last_sec`

  Number of bytes written to disk by backup and LCP processes in the last second

* `redo_speed_last_sec`

  Number of bytes written to REDO log in the last second

* `backup_lcp_speed_last_10sec`

  Number of bytes written to disk by backup and LCP processes per second, averaged over the last 10 seconds

* `redo_speed_last_10sec`

  Number of bytes written to REDO log per second, averaged over the last 10 seconds

* `std_dev_backup_lcp_speed_last_10sec`

  Standard deviation in number of bytes written to disk by backup and LCP processes per second, averaged over the last 10 seconds

* `std_dev_redo_speed_last_10sec`

  Standard deviation in number of bytes written to REDO log per second, averaged over the last 10 seconds

* `backup_lcp_speed_last_60sec`

  Number of bytes written to disk by backup and LCP processes per second, averaged over the last 60 seconds

* `redo_speed_last_60sec`

  Number of bytes written to REDO log per second, averaged over the last 10 seconds

* `std_dev_backup_lcp_speed_last_60sec`

  Standard deviation in number of bytes written to disk by backup and LCP processes per second, averaged over the last 60 seconds

* `std_dev_redo_speed_last_60sec`

  Standard deviation in number of bytes written to REDO log per second, averaged over the last 60 seconds

* `slowdowns_due_to_io_lag`

  Number of seconds since last node start that disk writes were slowed due to REDO log I/O lag

* `slowdowns_due_to_high_cpu`

  Number of seconds since last node start that disk writes were slowed due to high CPU usage

* `disk_write_speed_set_to_min`

  Number of seconds since last node start that disk write speed was set to minimum

* `current_target_disk_write_speed`

  Actual speed of disk writes per LDM thread (aggregated)
