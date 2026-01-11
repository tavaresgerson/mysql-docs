#### 25.2.7.11 Previous NDB Cluster Issues Resolved in NDB Cluster 8.0

A number of limitations and related issues that existed in earlier versions of NDB Cluster have been resolved in NDB 8.0. These are described briefly in the following list:

* **Database and table names.** In NDB 7.6 and earlier, when using the `NDB` storage engine, the maximum allowed length both for database names and for table names was 63 bytes, and a statement using a database name or table name longer than this limit failed with an appropriate error. In NDB 8.0, this restriction is lifted; identifiers for `NDB` databases and tables may now use up to 64 characters, as with other MySQL database and table names.

* **IPv6 support.** Prior to NDB 8.0.22, it was necessary for all network addresses used for connections between nodes within an NDB Cluster to use or to be resolvable to IPv4 addresses. Beginning with NDB 8.0.22, `NDB` supports IPv6 addresses for all types of cluster nodes, as well as for applications that use the NDB API or MGM API.

  For more information, see Known Issues When Upgrading or Downgrading NDB Cluster.

* **Multithreaded replicas.** In NDB 8.0.32 and earlier, multithreaded replicas were not supported for NDB Cluster Replication. This restriction is lifted in NDB Cluster 8.0.33.

  See Section 25.7.3, “Known Issues in NDB Cluster Replication”, for more information.
