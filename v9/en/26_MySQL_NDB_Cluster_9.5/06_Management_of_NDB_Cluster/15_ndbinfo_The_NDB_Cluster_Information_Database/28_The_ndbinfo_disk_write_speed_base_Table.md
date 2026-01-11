#### 25.6.15.28 The ndbinfo disk\_write\_speed\_base Table

The `disk_write_speed_base` table provides base information about the speed of disk writes during LCP, backup, and restore operations.

The `disk_write_speed_base` table contains the following columns:

* `node_id`

  Node ID of this node

* `thr_no`

  Thread ID of this LDM thread

* `millis_ago`

  Milliseconds since this reporting period ended

* `millis_passed`

  Milliseconds elapsed in this reporting period

* `backup_lcp_bytes_written`

  Number of bytes written to disk by local checkpoints and backup processes during this period

* `redo_bytes_written`

  Number of bytes written to REDO log during this period

* `target_disk_write_speed`

  Actual speed of disk writes per LDM thread (base data)
