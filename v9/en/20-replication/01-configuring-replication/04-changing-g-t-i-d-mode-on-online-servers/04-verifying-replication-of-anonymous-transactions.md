#### 19.1.4.4 Verifying Replication of Anonymous Transactions

This section explains how to monitor a replication topology and verify that all anonymous transactions have been replicated. This is helpful when changing the replication mode online as you can verify that it is safe to change to GTID transactions.

There are several possible ways to wait for transactions to replicate:

The simplest method, which works regardless of your topology but relies on timing is as follows: If you are sure that the replica never lags more than *`N`* seconds, wait any period of time that is longer than *`N`* seconds, which you consider safe for your deployment.

A safer method, in the sense that it does not depend on timing, if you only have a source with one or more replicas, is to perform the following two steps:

1. On the source, execute this statement:

   ```
   SHOW BINARY LOG STATUS;
   ```

   Make a note of the values displayed in the `File` and `Position` columns of the output.

2. On each replica, use the file and position information from the source to perform the statement shown here:

   ```
   SELECT SOURCE_POS_WAIT(file, position);
   ```

If you have a source and multiple levels of replicas (that is, replicas of replicas), repeat the second step on each level, starting from the source, then on all of its replicas, then on all of the replicas of these replicas, and so on.

If you emply a circular replication topology where multiple servers may have write clients, perform the second step for each source-replica connection, until you have completed the full circle. Repeat this process so that you complete the full circle twice.

For example, if there are three servers A, B, and C, replicating in a circle, so that A replicates to B, B replicates to C, and C replicates to A, do as follows, in the order shown:

* Perform Step 1 on A, and Step 2 on B.
* Perform Step 1 on B, and Step 2 on C.
* Perform Step 1 on C, and Step 2 on A.
* Perform Step 1 on A, and Step 2 on B.
* Perform Step 1 on B, and Step 2 on C.
* Perform Step 1 on C, and Step 2 on A.
