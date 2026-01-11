## 19.4 Replication Solutions

19.4.1 Using Replication for Backups

19.4.2 Handling an Unexpected Halt of a Replica

19.4.3 Monitoring Row-based Replication

19.4.4 Using Replication with Different Source and Replica Storage Engines

19.4.5 Using Replication for Scale-Out

19.4.6 Replicating Different Databases to Different Replicas

19.4.7 Improving Replication Performance

19.4.8 Switching Sources During Failover

19.4.9 Switching Sources and Replicas with Asynchronous Connection Failover

19.4.10 Semisynchronous Replication

19.4.11 Delayed Replication

Replication can be used in many different environments for a range of purposes. This section provides general notes and advice on using replication for specific solution types.

For information on using replication in a backup environment, including notes on the setup, backup procedure, and files to back up, see Section 19.4.1, “Using Replication for Backups”.

For advice and tips on using different storage engines on the source and replica, see Section 19.4.4, “Using Replication with Different Source and Replica Storage Engines”.

Using replication as a scale-out solution requires some changes in the logic and operation of applications that use the solution. See Section 19.4.5, “Using Replication for Scale-Out”.

For performance or data distribution reasons, you may want to replicate different databases to different replicas. See Section 19.4.6, “Replicating Different Databases to Different Replicas”

As the number of replicas increases, the load on the source can increase and lead to reduced performance (because of the need to replicate the binary log to each replica). For tips on improving your replication performance, including using a single secondary server as the source, see Section 19.4.7, “Improving Replication Performance”.

For guidance on switching sources, or converting replicas into sources as part of an emergency failover solution, see Section 19.4.8, “Switching Sources During Failover”.

For information on security measures specific to servers in a replication topology, see Section 19.3, “Replication Security”.
