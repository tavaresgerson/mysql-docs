#### 17.1.1.1 Primary-Secondary Replication

Traditional MySQL Replication provides a simple Primary-Secondary approach to replication. There is a primary (source) and there are one or more secondaries (replicas). The primary executes transactions, commits them and then they are later (thus asynchronously) sent to the secondaries to be either re-executed (in statement-based replication) or applied (in row-based replication). It is a shared-nothing system, where all servers have a full copy of the data by default.

**Figure 17.1 MySQL Asynchronous Replication**

![A transaction received by the source is executed, written to the binary log, then committed, and a response is sent to the client application. The record from the binary log is sent to the relay logs on Replica 1 and Replica 2 before the commit takes place on the source. On each of the replicas, the transaction is applied, written to the replica's binary log, and committed. The commit on the source and the commits on the replicas are all independent and asynchronous.](images/async-replication-diagram.png)

There is also semisynchronous replication, which adds one synchronization step to the protocol. This means that the Primary waits, at commit time, for the secondary to acknowledge that it has *received* the transaction. Only then does the Primary resume the commit operation.

**Figure 17.2 MySQL Semisynchronous Replication**

![A transaction received by the source is executed and written to the binary log. The record from the binary log is sent to the relay logs on Replica 1 and Replica 2. The source then waits for an acknowledgement from the replicas. When both of the replicas have returned the acknowledgement, the source commits the transaction, and a response is sent to the client application. After each replica has returned its acknowlegement, it applies the transaction, writes it to the binary log, and commits it. The commit on the source depends on the acknowledgement from the replicas, but the commits on the replicas are independent from each other and from the commit on the source.](images/semisync-replication-diagram.png)

In the two pictures above, you can see a diagram of the classic asynchronous MySQL Replication protocol (and its semisynchronous variant as well). The arrows between the different instances represent messages exchanged between servers or messages exchanged between servers and the client application.
