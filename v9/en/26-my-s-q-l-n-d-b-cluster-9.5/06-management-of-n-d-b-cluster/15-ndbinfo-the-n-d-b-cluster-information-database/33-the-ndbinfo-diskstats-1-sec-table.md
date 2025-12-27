#### 25.6.15.33 The ndbinfo diskstats\_1sec Table

The `diskstats_1sec` table provides information about writes to Disk Data tablespaces over the past 20 seconds.

The `diskstat` table contains the following columns:

* `node_id`

  Node ID of this node

* `block_instance`

  ID of reporting instance of `PGMAN`

* `pages_made_dirty`

  Pages made dirty during the designated 1-second interval

* `reads_issued`

  Reads issued during the designated 1-second interval

* `reads_completed`

  Reads completed during the designated 1-second interval

* `writes_issued`

  Writes issued during the designated 1-second interval

* `writes_completed`

  Writes completed during the designated 1-second interval

* `log_writes_issued`

  Number of times a page write has required a log write during the designated 1-second interval

* `log_writes_completed`

  Number of log writes completed during the designated 1-second interval

* `get_page_calls_issued`

  Number of `get_page()` calls issued during the designated 1-second interval

* `get_page_reqs_issued`

  Number of times that a `get_page()` call has resulted in a wait for I/O or completion of I/O already begun during the designated 1-second interval

* `get_page_reqs_completed`

  Number of `get_page()` calls waiting for I/O or I/O completion that have completed during the designated 1-second interval

* `seconds_ago`

  Number of 1-second intervals in the past of the interval to which this row applies

##### Notes

Each row in this table corresponds to an instance of `PGMAN` during a 1-second interval occurring from 0 to 19 seconds ago; there is one such instance per LDM thread plus an additional instance for each data node.
