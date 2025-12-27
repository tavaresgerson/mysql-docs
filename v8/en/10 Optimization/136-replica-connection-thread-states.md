### 10.14.7 Replication Connection Thread States

These thread states occur on a replica server but are associated with connection threads, not with the I/O or SQL threads.

* `Changing master`

  `Changing replication source`

  The thread is processing a `CHANGE REPLICATION SOURCE TO` statement.
* `Killing slave`

  The thread is processing a `STOP REPLICA` statement.
* `Opening master dump table`

  This state occurs after `Creating table from master dump`.
* `Reading master dump table data`

  This state occurs after `Opening master dump table`.
* `Rebuilding the index on master dump table`

  This state occurs after `Reading master dump table data`.

