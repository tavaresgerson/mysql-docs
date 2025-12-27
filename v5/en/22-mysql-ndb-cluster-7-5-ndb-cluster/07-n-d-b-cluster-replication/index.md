## 21.7 NDB Cluster Replication

[21.7.1 NDB Cluster Replication: Abbreviations and Symbols](mysql-cluster-replication-abbreviations.html)

[21.7.2 General Requirements for NDB Cluster Replication](mysql-cluster-replication-general.html)

[21.7.3 Known Issues in NDB Cluster Replication](mysql-cluster-replication-issues.html)

[21.7.4 NDB Cluster Replication Schema and Tables](mysql-cluster-replication-schema.html)

[21.7.5 Preparing the NDB Cluster for Replication](mysql-cluster-replication-preparation.html)

[21.7.6 Starting NDB Cluster Replication (Single Replication Channel)](mysql-cluster-replication-starting.html)

[21.7.7 Using Two Replication Channels for NDB Cluster Replication](mysql-cluster-replication-two-channels.html)

[21.7.8 Implementing Failover with NDB Cluster Replication](mysql-cluster-replication-failover.html)

[21.7.9 NDB Cluster Backups With NDB Cluster Replication](mysql-cluster-replication-backups.html)

[21.7.10 NDB Cluster Replication: Bidirectional and Circular Replication](mysql-cluster-replication-multi-source.html)

[21.7.11 NDB Cluster Replication Conflict Resolution](mysql-cluster-replication-conflict-resolution.html)

NDB Cluster supports asynchronous replication, more usually referred to simply as “replication”. This section explains how to set up and manage a configuration in which one group of computers operating as an NDB Cluster replicates to a second computer or group of computers. We assume some familiarity on the part of the reader with standard MySQL replication as discussed elsewhere in this Manual. (See [Chapter 16, *Replication*](replication.html "Chapter 16 Replication")).

Note

NDB Cluster does not support replication using GTIDs; semisynchronous replication and group replication are also not supported by the `NDB` storage engine.

Normal (non-clustered) replication involves a source server (formerly called a “master”) and a replica server (formerly referred to as a “slave”), the source being so named because operations and data to be replicated originate with it, and the replica being the recipient of these. In NDB Cluster, replication is conceptually very similar but can be more complex in practice, as it may be extended to cover a number of different configurations including replicating between two complete clusters. Although an NDB Cluster itself depends on the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine for clustering functionality, it is not necessary to use [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") as the storage engine for the replica's copies of the replicated tables (see [Replication from NDB to other storage engines](mysql-cluster-replication-issues.html#mysql-cluster-replication-ndb-to-non-ndb "Replication from NDB to other storage engines")). However, for maximum availability, it is possible (and preferable) to replicate from one NDB Cluster to another, and it is this scenario that we discuss, as shown in the following figure:

**Figure 21.12 NDB Cluster-to-Cluster Replication Layout**

![Much of the content is described in the surrounding text. It visualizes how a MySQL source is replicated. The replica differs in that it shows an I/O thread pointing to a relay binary log which points to an SQL thread. In addition, while the binary log points to and from the NDBCLUSTER engine on the source server, on the replica it points directly to an SQL node (MySQL server).](images/cluster-replication-overview.png)

In this scenario, the replication process is one in which successive states of a source cluster are logged and saved to a replica cluster. This process is accomplished by a special thread known as the NDB binary log injector thread, which runs on each MySQL server and produces a binary log (`binlog`). This thread ensures that all changes in the cluster producing the binary log—and not just those changes that are effected through the MySQL Server—are inserted into the binary log with the correct serialization order. We refer to the MySQL source and replica servers as replication servers or replication nodes, and the data flow or line of communication between them as a replication channel.

For information about performing point-in-time recovery with NDB Cluster and NDB Cluster Replication, see [Section 21.7.9.2, “Point-In-Time Recovery Using NDB Cluster Replication”](mysql-cluster-replication-pitr.html "21.7.9.2 Point-In-Time Recovery Using NDB Cluster Replication").

**NDB API replica status variables.** NDB API counters can provide enhanced monitoring capabilities on replica clusters. These counters are implemented as NDB statistics `_slave` status variables, as seen in the output of [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), or in the results of queries against the [`SESSION_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables") or [`GLOBAL_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables") table in a [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client session connected to a MySQL Server that is acting as a replica in NDB Cluster Replication. By comparing the values of these status variables before and after the execution of statements affecting replicated [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables, you can observe the corresponding actions taken on the NDB API level by the replica, which can be useful when monitoring or troubleshooting NDB Cluster Replication. [Section 21.6.14, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "21.6.14 NDB API Statistics Counters and Variables"), provides additional information.

**Replication from NDB to non-NDB tables.** It is possible to replicate [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables from an NDB Cluster acting as the replication source to tables using other MySQL storage engines such as [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") or [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") on a replica [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). This is subject to a number of conditions; see [Replication from NDB to other storage engines](mysql-cluster-replication-issues.html#mysql-cluster-replication-ndb-to-non-ndb "Replication from NDB to other storage engines"), and [Replication from NDB to a nontransactional storage engine](mysql-cluster-replication-issues.html#mysql-cluster-replication-ndb-to-nontransactional "Replication from NDB to a nontransactional storage engine"), for more information.
