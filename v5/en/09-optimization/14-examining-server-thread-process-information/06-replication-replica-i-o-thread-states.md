### 8.14.6 Replication Replica I/O Thread States

The following list shows the most common states you see in the `State` column for a replica server I/O thread. This state also appears in the `Slave_IO_State` column displayed by `SHOW SLAVE STATUS`, so you can get a good view of what is happening by using that statement.

* `Checking master version`

  A state that occurs very briefly, after the connection to the source is established.

* `Connecting to master`

  The thread is attempting to connect to the source.

* `Queueing master event to the relay log`

  The thread has read an event and is copying it to the relay log so that the SQL thread can process it.

* `Reconnecting after a failed binlog dump request`

  The thread is trying to reconnect to the source.

* `Reconnecting after a failed master event read`

  The thread is trying to reconnect to the source. When connection is established again, the state becomes `Waiting for master to send event`.

* `Registering slave on master`

  A state that occurs very briefly after the connection to the source is established.

* `Requesting binlog dump`

  A state that occurs very briefly, after the connection to the source is established. The thread sends to the source a request for the contents of its binary logs, starting from the requested binary log file name and position.

* `Waiting for its turn to commit`

  A state that occurs when the replica thread is waiting for older worker threads to commit if `slave_preserve_commit_order` is enabled.

* `Waiting for master to send event`

  The thread has connected to the source and is waiting for binary log events to arrive. This can last for a long time if the source is idle. If the wait lasts for `slave_net_timeout` seconds, a timeout occurs. At that point, the thread considers the connection to be broken and makes an attempt to reconnect.

* `Waiting for master update`

  The initial state before `Connecting to master`.

* `Waiting for slave mutex on exit`

  A state that occurs briefly as the thread is stopping.

* `Waiting for the slave SQL thread to free enough relay log space`

  You are using a nonzero `relay_log_space_limit` value, and the relay logs have grown large enough that their combined size exceeds this value. The I/O thread is waiting until the SQL thread frees enough space by processing relay log contents so that it can delete some relay log files.

* `Waiting to reconnect after a failed binlog dump request`

  If the binary log dump request failed (due to disconnection), the thread goes into this state while it sleeps, then tries to reconnect periodically. The interval between retries can be specified using the `CHANGE MASTER TO` statement.

* `Waiting to reconnect after a failed master event read`

  An error occurred while reading (due to disconnection). The thread is sleeping for the number of seconds set by the `CHANGE MASTER TO` statement (default 60) before attempting to reconnect.
