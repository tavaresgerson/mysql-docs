#### 20.1.1.1 Source to Replica Replication

Traditional MySQL Replication provides a simple source to replica approach to replication. The source is the primary, and there are one or more replicas, which are secondaries. The source applies transactions, commits them and then they are later (thus asynchronously) sent to the replicas to be either re-executed (in statement-based replication) or applied (in row-based replication). It is a shared-nothing system, where all servers have a full copy of the data by default.

**Figure 20.1 MySQL Asynchronous Replication**

![A transaction received by the source is executed, written to the binary log, then committed, and a response is sent to the client application. The record from the binary log is sent to the relay logs on Replica 1 and Replica 2 before the commit takes place on the source. On each of the replicas, the transaction is applied, written to the replica's binary log, and committed. The commit on the source and the commits on the replicas are all independent and asynchronous.](images/async-replication-diagram.png)

There is also semisynchronous replication, which adds one synchronization step to the protocol. This means that the primary waits, at apply time, for the secondary to acknowledge that it has *received* the transaction. Only then does the primary resume the commit operation.

**Figure 20.2 MySQL Semisynchronous Replication**

![A transaction received by the source is executed and written to the binary log. The record from the binary log is sent to the relay logs on Replica 1 and Replica 2. The source then waits for an acknowledgement from the replicas. When both of the replicas have returned the acknowledgement, the source commits the transaction, and a response is sent to the client application. After each replica has returned its acknowledgement, it applies the transaction, writes it to the binary log, and commits it. The commit on the source depends on the acknowledgement from the replicas, but the commits on the replicas are independent from each other and from the commit on the source.](images/semisync-replication-diagram.png)

In the two pictures there is a diagram of the classic asynchronous MySQL Replication protocol (and its semisynchronous variant as well). The arrows between the different instances represent messages exchanged between servers or messages exchanged between servers and the client application.
