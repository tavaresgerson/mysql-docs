#### 16.1.4.4 Verifying Replication of Anonymous Transactions

This section explains how to monitor a replication topology and verify that all anonymous transactions have been replicated. This is helpful when changing the replication mode online as you can verify that it is safe to change to GTID transactions.

There are several possible ways to wait for transactions to replicate:

The simplest method, which works regardless of your topology but relies on timing is as follows: if you are sure that the replica never lags more than N seconds, just wait for a bit more than N seconds. Or wait for a day, or whatever time period you consider safe for your deployment.

A safer method in the sense that it does not depend on timing: if you only have a source with one or more replicas, do the following:

1. On the source, execute:

   ```sql
   SHOW MASTER STATUS;
   ```

   Note down the values in the `File` and `Position` column.

2. On every replica, use the file and position information from the source to execute:

   ```sql
   SELECT MASTER_POS_WAIT(file, position);
   ```

If you have a source and multiple levels of replicas, or in other words you have replicas of replicas, repeat step 2 on each level, starting from the source, then all the direct replicas, then all the replicas of replicas, and so on.

If you use a circular replication topology where multiple servers may have write clients, perform step 2 for each source-replica connection, until you have completed the full circle. Repeat the whole process so that you do the full circle *twice*.

For example, suppose you have three servers A, B, and C, replicating in a circle so that A -> B -> C -> A. The procedure is then:

* Do step 1 on A and step 2 on B.
* Do step 1 on B and step 2 on C.
* Do step 1 on C and step 2 on A.
* Do step 1 on A and step 2 on B.
* Do step 1 on B and step 2 on C.
* Do step 1 on C and step 2 on A.
