### 19.2.3 Replication Threads

MySQL replication capabilities are implemented using the following
types of threads:

* **Binary log dump thread.**
  The source creates a thread to send the binary log contents
  to a replica when the replica connects. This thread can be
  identified in the output of [`SHOW
  PROCESSLIST`](show-processlist.html "15.7.7.32 SHOW PROCESSLIST Statement") on the source as the `Binlog
  Dump` thread.

* **Replication I/O receiver thread.**
  When a [`START REPLICA`](start-replica.html "15.4.2.4 START REPLICA Statement")
  statement is issued on a replica server, the replica creates
  an I/O (receiver) thread, which connects to the source and
  asks it to send the updates recorded in its binary logs.

  The replication receiver thread reads the updates that the
  source's `Binlog Dump` thread sends (see
  previous item) and copies them to local files that comprise
  the replica's relay log.

  The state of this thread is shown as
  `Slave_IO_running` in the output of
  [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement").

* **Replication SQL applier thread.**
  There are *`N`* applier threads and
  one coordinator thread, which reads transactions
  sequentially from the relay log, and schedules them to be
  applied by worker threads. Each worker applies the
  transactions that the coordinator has assigned to it.

The replica creates the specified number of worker threads
specified by `replica_parallel_workers` to apply
transactions, plus a coordinator thread which reads transactions
from the relay log and assigns them to workers. If you are using
multiple replication channels, each channel has the number of
threads specified using this variable.

Multithreaded replicas are also supported by NDB Cluster. See
[Section 25.7.11, “NDB Cluster Replication Using the Multithreaded Applier”](mysql-cluster-replication-mta.html "25.7.11 NDB Cluster Replication Using the Multithreaded Applier"), for more
information.