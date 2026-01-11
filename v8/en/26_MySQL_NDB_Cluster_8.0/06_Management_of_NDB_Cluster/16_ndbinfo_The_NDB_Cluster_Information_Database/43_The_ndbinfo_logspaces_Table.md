#### 25.6.16.43 The ndbinfo logspaces Table

This table provides information about NDB Cluster log space usage.

The `logspaces` table contains the following columns:

* `node_id`

  The ID of this data node.

* `log_type`

  Type of log; one of: `REDO` or `DD-UNDO`.

* `node_id`

  The log ID; for Disk Data undo log files, this is the same as the value shown in the `LOGFILE_GROUP_NUMBER` column of the Information Schema `FILES` table, as well as the value shown for the `log_id` column of the `ndbinfo` `logbuffers` table

* `log_part`

  The log part number.

* `total`

  Total space available for this log.

* `used`

  Space used by this log.
