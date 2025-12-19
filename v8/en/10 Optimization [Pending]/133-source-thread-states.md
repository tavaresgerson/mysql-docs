--- title: MySQL 8.4 Reference Manual :: 10.14.4 Replication Source Thread States url: https://dev.mysql.com/doc/refman/8.4/en/source-thread-states.html order: 133 ---



### 10.14.4 Replication Source Thread States

The following list shows the most common states you may see in the `State` column for the `Binlog Dump` thread of the replication source. If you see no `Binlog Dump` threads on a source, this means that replication is not running; that is, that no replicas are currently connected.

In MySQL 8.0, incompatible changes were made to instrumentation names. Monitoring tools that work with these instrumentation names might be impacted. If the incompatible changes have an impact for you, set the `terminology_use_previous` system variable to `BEFORE_8_0_26` to make MySQL Server use the old versions of the names for the objects specified in the previous list. This enables monitoring tools that rely on the old names to continue working until they can be updated to use the new names.

Set the `terminology_use_previous` system variable with session scope to support individual functions, or global scope to be a default for all new sessions. When global scope is used, the slow query log contains the old versions of the names.

* `Finished reading one binlog; switching to next binlog`

  The thread has finished reading a binary log file and is opening the next one to send to the replica.
* `Master has sent all binlog to slave; waiting for more updates`

  `Source has sent all binlog to replica; waiting for more updates`

  The thread has read all remaining updates from the binary logs and sent them to the replica. The thread is now idle, waiting for new events to appear in the binary log resulting from new updates occurring on the source.
* `Sending binlog event to slave`

  `Sending binlog event to replica`

  Binary logs consist of *events*, where an event is usually an update plus some other information. The thread has read an event from the binary log and is now sending it to the replica.
* `Waiting to finalize termination`

  A very brief state that occurs as the thread is stopping.

