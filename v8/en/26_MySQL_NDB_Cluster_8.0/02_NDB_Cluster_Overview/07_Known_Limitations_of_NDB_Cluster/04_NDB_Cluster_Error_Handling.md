#### 25.2.7.4 NDB Cluster Error Handling

Starting, stopping, or restarting a node may give rise to temporary errors causing some transactions to fail. These include the following cases:

* **Temporary errors.** When first starting a node, it is possible that you may see Error 1204 Temporary failure, distribution changed and similar temporary errors.

* **Errors due to node failure.** The stopping or failure of any data node can result in a number of different node failure errors. (However, there should be no aborted transactions when performing a planned shutdown of the cluster.)

In either of these cases, any errors that are generated must be handled within the application. This should be done by retrying the transaction.

See also Section 25.2.7.2, “Limits and Differences of NDB Cluster from Standard MySQL Limits”.
