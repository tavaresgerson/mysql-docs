### 25.6.7 Adding NDB Cluster Data Nodes Online

25.6.7.1 Adding NDB Cluster Data Nodes Online: General Issues

25.6.7.2 Adding NDB Cluster Data Nodes Online: Basic procedure

25.6.7.3 Adding NDB Cluster Data Nodes Online: Detailed Example

This section describes how to add NDB Cluster data nodes “online”—that is, without needing to shut down the cluster completely and restart it as part of the process.

Important

Currently, you must add new data nodes to an NDB Cluster as part of a new node group. In addition, it is not possible to change the number of fragment replicas (or the number of nodes per node group) online.
