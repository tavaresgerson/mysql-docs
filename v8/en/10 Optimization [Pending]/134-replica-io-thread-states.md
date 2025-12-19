--- title: MySQL 8.4 Reference Manual :: 10.14.5 Replication I/O (Receiver) Thread States url: https://dev.mysql.com/doc/refman/8.4/en/replica-io-thread-states.html order: 134 ---



### 10.14.5 Replication I/O (Receiver) Thread States

The following list shows the most common states you see in the `State` column for a replication I/O (receiver) thread on a replica server. This state also appears in the `Replica_IO_State` column displayed by [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement"), so you can get a good view of what is happening by using that statement.

In MySQL 8.0, incompatible changes were made to instrumentation names. Monitoring tools that work with these instrumentation names might be impacted. If the incompatible changes have an impact for you, set the `terminology_use_previous` system variable to `BEFORE_8_0_26` to make MySQL Server use the old versions of the names for the objects specified in the previous list. This enables monitoring tools that rely on the old names to continue working until they can be updated to use the new names.

Set the `terminology_use_previous` system variable with session scope to support individual functions, or global scope to be a default for all new sessions. When global scope is used, the slow query log contains the old versions of the names.

* `Checking master version`

  `Checking source version`

  A state that occurs very briefly, after the connection to the source is established.
* `Connecting to master`

  `Connecting to source`

  The thread is attempting to connect to the source.
* `Queueing master event to the relay log`

  `Queueing source event to the relay log`

  The thread has read an event and is copying it to the relay log so that the SQL thread can process it.
* `Reconnecting after a failed binlog dump request`

  The thread is trying to reconnect to the source.
* `Reconnecting after a failed master event read`

  `Reconnecting after a failed source event read`

  The thread is trying to reconnect to the source. When connection is established again, the state becomes `Waiting for master to send event`.
* `Registering slave on master`

  `Registering replica on source`

  A state that occurs very briefly after the connection to the source is established.
* `Requesting binlog dump`

  A state that occurs very briefly, after the connection to the source is established. The thread sends to the source a request for the contents of its binary logs, starting from the requested binary log file name and position.
* `Waiting for its turn to commit`

  A state that occurs when the replica thread is waiting for older worker threads to commit if `replica_preserve_commit_order` is enabled.
* `Waiting for master to send event`

  `Waiting for source to send event`

  The thread has connected to the source and is waiting for binary log events to arrive. This can last for a long time if the source is idle. If the wait lasts for `replica_net_timeout` seconds, a timeout occurs. At that point, the thread considers the connection to be broken and makes an attempt to reconnect.
* `Waiting for master update`

  `Waiting for source update`

  The initial state before `Connecting to master` or `Connecting to source`.
* `Waiting for slave mutex on exit`

  `Waiting for replica mutex on exit`

  A state that occurs briefly as the thread is stopping.
* `Waiting for the slave SQL thread to free enough relay log space`

  `Waiting for the replica SQL thread to free enough relay log space`

  You are using a nonzero `relay_log_space_limit` value, and the relay logs have grown large enough that their combined size exceeds this value. The I/O (receiver) thread is waiting until the SQL (applier) thread frees enough space by processing relay log contents so that it can delete some relay log files.
* `Waiting to reconnect after a failed binlog dump request`

  If the binary log dump request failed (due to disconnection), the thread goes into this state while it sleeps, then tries to reconnect periodically. The interval between retries can be specified using the `CHANGE REPLICATION SOURCE TO`.
* `Waiting to reconnect after a failed master event read`

  `Waiting to reconnect after a failed source event read`

  An error occurred while reading (due to disconnection). The thread is sleeping for the number of seconds set by the `CHANGE REPLICATION SOURCE TO` statement before attempting to reconnect.

