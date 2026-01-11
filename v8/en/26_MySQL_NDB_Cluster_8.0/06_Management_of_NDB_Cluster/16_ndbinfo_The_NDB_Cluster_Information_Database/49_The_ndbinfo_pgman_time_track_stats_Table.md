#### 25.6.16.49 The ndbinfo pgman_time_track_stats Table

This table provides information regarding the latency of disk operations for NDB Cluster Disk Data tablespaces.

The `pgman_time_track_stats` table contains the following columns:

* `node_id`

  Unique node ID of this node in the cluster

* `block_number`

  Block number (from `blocks` table)

* `block_instance`

  Block instance number

* `upper_bound`

  Upper bound

* `page_reads`

  Page read latency (ms)

* `page_writes`

  Page write latency (ms)

* `log_waits`

  Log wait latency (ms)

* `get_page`

  Latency of `get_page()` calls (ms)

##### Notes

The read latency (`page_reads` column) measures the time from when the read request is sent to the file system thread until the read is complete and has been reported back to the execution thread. The write latency (`page_writes`) is calculated in a similar fashion. The size of the page read to or written from a Disk Data tablespace is always 32 KB.

Log wait latency (`log_waits` column) is the length of time a page write must wait for the undo log to be flushed, which must be done prior to each page write.
