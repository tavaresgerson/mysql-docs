### 10.14.7 Replication Connection Thread States

These thread states occur on a replica server but are associated with connection threads, not with the I/O or SQL threads.

In MySQL 8.0.26, incompatible changes were made to instrumentation names, including the names of thread stages, containing the terms “master”, which is changed to “source”, “slave”, which is changed to “replica”, and “mts” (for “multithreaded slave”), which is changed to “mta” (for “multithreaded applier”). Monitoring tools that work with these instrumentation names might be impacted. If the incompatible changes have an impact for you, set the `terminology_use_previous` system variable to `BEFORE_8_0_26` to make MySQL Server use the old versions of the names for the objects specified in the previous list. This enables monitoring tools that rely on the old names to continue working until they can be updated to use the new names.

Set the `terminology_use_previous` system variable with session scope to support individual functions, or global scope to be a default for all new sessions. When global scope is used, the slow query log contains the old versions of the names.

* `Changing master`

  From MySQL 8.0.26: `Changing replication source`

  The thread is processing a `CHANGE REPLICATION SOURCE TO` statement (from MySQL 8.0.23) or `CHANGE MASTER TO` statement (before MySQL 8.0.23).

* `Killing slave`

  The thread is processing a `STOP REPLICA` statement.

* `Opening master dump table`

  This state occurs after `Creating table from master dump`.

* `Reading master dump table data`

  This state occurs after `Opening master dump table`.

* `Rebuilding the index on master dump table`

  This state occurs after `Reading master dump table data`.
