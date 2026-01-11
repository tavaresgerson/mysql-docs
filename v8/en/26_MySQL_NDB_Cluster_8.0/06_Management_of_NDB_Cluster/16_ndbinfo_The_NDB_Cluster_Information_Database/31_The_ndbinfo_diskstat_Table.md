#### 25.6.16.31 The ndbinfo diskstat Table

The `diskstat` table provides information about writes to Disk Data tablespaces during the past 1 second.

The `diskstat` table contains the following columns:

* `node_id`

  Node ID of this node

* `block_instance`

  ID of reporting instance of `PGMAN`

* `pages_made_dirty`

  Number of pages made dirty during the past second

* `reads_issued`

  Reads issued during the past second

* `reads_completed`

  Reads completed during the past second

* `writes_issued`

  Writes issued during the past second

* `writes_completed`

  Writes completed during the past second

* `log_writes_issued`

  Number of times a page write has required a log write during the past second

* `log_writes_completed`

  Number of log writes completed during the last second

* `get_page_calls_issued`

  Number of `get_page()` calls issued during the past second

* `get_page_reqs_issued`

  Number of times that a `get_page()` call has resulted in a wait for I/O or completion of I/O already begun during the past second

* `get_page_reqs_completed`

  Number of `get_page()` calls waiting for I/O or I/O completion that have completed during the past second

##### Notes

Each row in this table corresponds to an instance of `PGMAN`; there is one such instance per LDM thread plus an additional instance for each data node.
