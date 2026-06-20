## 25.2 NDB Cluster Overview

NDB Cluster is a technology that enables clustering of in-memory databases in a shared-nothing system. The shared-nothing architecture enables the system to work with very inexpensive hardware, and with a minimum of specific requirements for hardware or software.

NDB Cluster is designed not to have any single point of failure. In a shared-nothing system, each component is expected to have its own memory and disk, and the use of shared storage mechanisms such as network shares, network file systems, and SANs is not recommended or supported.

NDB Cluster integrates the standard MySQL server with an in-memory clustered storage engine called `NDB` (which stands for “*N*etwork *D*ata*B*ase”). In our documentation, the term `NDB` refers to the part of the setup that is specific to the storage engine, whereas “MySQL NDB Cluster” refers to the combination of one or more MySQL servers with the `NDB` storage engine.

An NDB Cluster consists of a set of computers, known as hosts, each running one or more processes. These processes, known as nodes, may include MySQL servers (for access to NDB data), data nodes (for storage of the data), one or more management servers, and possibly other specialized data access programs. The relationship of these components in an NDB Cluster is shown here:

**Figure 25.1 NDB Cluster Components**

![In this cluster, three MySQL servers (mysqld program) are SQL nodes that provide access to four data nodes (ndbd program) that store data. The SQL nodes and data nodes are under the control of an NDB management server (ndb_mgmd program). Various clients and APIs can interact with the SQL nodes - the mysql client, the MySQL C API, PHP, Connector/J, and Connector/NET. Custom clients can also be created using the NDB API to interact with the data nodes or the NDB management server. The NDB management client (ndb_mgm program) interacts with the NDB management server.](images/cluster-components-1.png)

All these programs work together to form an NDB Cluster (see Section 25.5, “NDB Cluster Programs”. When data is stored by the `NDB` storage engine, the tables (and table data) are stored in the data nodes. Such tables are directly accessible from all other MySQL servers (SQL nodes) in the cluster. Thus, in a payroll application storing data in a cluster, if one application updates the salary of an employee, all other MySQL servers that query this data can see this change immediately.

As of NDB 8.0.31, an NDB Cluster 8.0 SQL node uses the **mysqld** server daemon which is the same as the **mysqld** supplied with MySQL Server 8.0 distributions. In NDB 8.0.30 and previous releases, it differed in a number of critical respects from the **mysqld** binary supplied with MySQL Server, and the two versions of **mysqld** were not interchangeable. You should keep in mind that *an instance of **mysqld**, regardless of version, that is not connected to an NDB Cluster cannot use the `NDB` storage engine and cannot access any NDB Cluster data*.

The data stored in the data nodes for NDB Cluster can be mirrored; the cluster can handle failures of individual data nodes with no other impact than that a small number of transactions are aborted due to losing the transaction state. Because transactional applications are expected to handle transaction failure, this should not be a source of problems.

Individual nodes can be stopped and restarted, and can then rejoin the system (cluster). Rolling restarts (in which all nodes are restarted in turn) are used in making configuration changes and software upgrades (see Section 25.6.5, “Performing a Rolling Restart of an NDB Cluster”). Rolling restarts are also used as part of the process of adding new data nodes online (see Section 25.6.7, “Adding NDB Cluster Data Nodes Online”). For more information about data nodes, how they are organized in an NDB Cluster, and how they handle and store NDB Cluster data, see Section 25.2.2, “NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions”.

Backing up and restoring NDB Cluster databases can be done using the `NDB`-native functionality found in the NDB Cluster management client and the **ndb_restore** program included in the NDB Cluster distribution. For more information, see Section 25.6.8, “Online Backup of NDB Cluster”, and Section 25.5.23, “ndb_restore — Restore an NDB Cluster Backup”. You can also use the standard MySQL functionality provided for this purpose in **mysqldump** and the MySQL server. See Section 6.5.4, “mysqldump — A Database Backup Program”, for more information.

NDB Cluster nodes can employ different transport mechanisms for inter-node communications; TCP/IP over standard 100 Mbps or faster Ethernet hardware is used in most real-world deployments.


### 25.2.1 NDB Cluster Core Concepts

`NDBCLUSTER` (also known as `NDB`) is an in-memory storage engine offering high-availability and data-persistence features.

The `NDBCLUSTER` storage engine can be configured with a range of failover and load-balancing options, but it is easiest to start with the storage engine at the cluster level. NDB Cluster's `NDB` storage engine contains a complete set of data, dependent only on other data within the cluster itself.

The “Cluster” portion of NDB Cluster is configured independently of the MySQL servers. In an NDB Cluster, each part of the cluster is considered to be a node.

Note

In many contexts, the term “node” is used to indicate a computer, but when discussing NDB Cluster it means a *process*. It is possible to run multiple nodes on a single computer; for a computer on which one or more cluster nodes are being run we use the term cluster host.

There are three types of cluster nodes, and in a minimal NDB Cluster configuration, there are at least three nodes, one of each of these types:

* Management node: The role of this type of node is to manage the other nodes within the NDB Cluster, performing such functions as providing configuration data, starting and stopping nodes, and running backups. Because this node type manages the configuration of the other nodes, a node of this type should be started first, before any other node. A management node is started with the command **ndb_mgmd**.

* Data node: This type of node stores cluster data. There are as many data nodes as there are fragment replicas, times the number of fragments (see Section 25.2.2, “NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions”). For example, with two fragment replicas, each having two fragments, you need four data nodes. One fragment replica is sufficient for data storage, but provides no redundancy; therefore, it is recommended to have two (or more) fragment replicas to provide redundancy, and thus high availability. A data node is started with the command **ndbd** (see Section 25.5.1, “ndbd — The NDB Cluster Data Node Daemon”) or **ndbmtd**") (see Section 25.5.3, “ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)”")).

  NDB Cluster tables are normally stored completely in memory rather than on disk (this is why we refer to NDB Cluster as an in-memory database). However, some NDB Cluster data can be stored on disk; see Section 25.6.11, “NDB Cluster Disk Data Tables”, for more information.

* SQL node: This is a node that accesses the cluster data. In the case of NDB Cluster, an SQL node is a traditional MySQL server that uses the `NDBCLUSTER` storage engine. An SQL node is a **mysqld** process started with the `--ndbcluster` and `--ndb-connectstring` options, which are explained elsewhere in this chapter, possibly with additional MySQL server options as well.

  An SQL node is actually just a specialized type of API node, which designates any application which accesses NDB Cluster data. Another example of an API node is the **ndb_restore** utility that is used to restore a cluster backup. It is possible to write such applications using the NDB API. For basic information about the NDB API, see Getting Started with the NDB API.

Important

It is not realistic to expect to employ a three-node setup in a production environment. Such a configuration provides no redundancy; to benefit from NDB Cluster's high-availability features, you must use multiple data and SQL nodes. The use of multiple management nodes is also highly recommended.

For a brief introduction to the relationships between nodes, node groups, fragment replicas, and partitions in NDB Cluster, see Section 25.2.2, “NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions”.

Configuration of a cluster involves configuring each individual node in the cluster and setting up individual communication links between nodes. NDB Cluster is currently designed with the intention that data nodes are homogeneous in terms of processor power, memory space, and bandwidth. In addition, to provide a single point of configuration, all configuration data for the cluster as a whole is located in one configuration file.

The management server manages the cluster configuration file and the cluster log. Each node in the cluster retrieves the configuration data from the management server, and so requires a way to determine where the management server resides. When interesting events occur in the data nodes, the nodes transfer information about these events to the management server, which then writes the information to the cluster log.

In addition, there can be any number of cluster client processes or applications. These include standard MySQL clients, `NDB`-specific API programs, and management clients. These are described in the next few paragraphs.

**Standard MySQL clients.** NDB Cluster can be used with existing MySQL applications written in PHP, Perl, C, C++, Java, Python, and so on. Such client applications send SQL statements to and receive responses from MySQL servers acting as NDB Cluster SQL nodes in much the same way that they interact with standalone MySQL servers.

MySQL clients using an NDB Cluster as a data source can be modified to take advantage of the ability to connect with multiple MySQL servers to achieve load balancing and failover. For example, Java clients using Connector/J 5.0.6 and later can use `jdbc:mysql:loadbalance://` URLs (improved in Connector/J 5.1.7) to achieve load balancing transparently; for more information about using Connector/J with NDB Cluster, see Using Connector/J with NDB Cluster.

**NDB client programs.** Client programs can be written that access NDB Cluster data directly from the `NDBCLUSTER` storage engine, bypassing any MySQL Servers that may be connected to the cluster, using the NDB API, a high-level C++ API. Such applications may be useful for specialized purposes where an SQL interface to the data is not needed. For more information, see The NDB API.

`NDB`-specific Java applications can also be written for NDB Cluster using the NDB Cluster Connector for Java. This NDB Cluster Connector includes ClusterJ, a high-level database API similar to object-relational mapping persistence frameworks such as Hibernate and JPA that connect directly to `NDBCLUSTER`, and so does not require access to a MySQL Server. See Java and NDB Cluster, and The ClusterJ API and Data Object Model, for more information.

NDB Cluster also supports applications written in JavaScript using Node.js. The MySQL Connector for JavaScript includes adapters for direct access to the `NDB` storage engine and as well as for the MySQL Server. Applications using this Connector are typically event-driven and use a domain object model similar in many ways to that employed by ClusterJ. For more information, see MySQL NoSQL Connector for JavaScript.

**Management clients.** These clients connect to the management server and provide commands for starting and stopping nodes gracefully, starting and stopping message tracing (debug versions only), showing node versions and status, starting and stopping backups, and so on. An example of this type of program is the **ndb_mgm** management client supplied with NDB Cluster (see Section 25.5.5, “ndb_mgm — The NDB Cluster Management Client”). Such applications can be written using the MGM API, a C-language API that communicates directly with one or more NDB Cluster management servers. For more information, see The MGM API.

Oracle also makes available MySQL Cluster Manager, which provides an advanced command-line interface simplifying many complex NDB Cluster management tasks, such restarting an NDB Cluster with a large number of nodes. The MySQL Cluster Manager client also supports commands for getting and setting the values of most node configuration parameters as well as **mysqld** server options and variables relating to NDB Cluster. MySQL Cluster Manager 8.0 provides support for NDB 8.0. See MySQL Cluster Manager 8.0.43 User Manual, for more information.

**Event logs.** NDB Cluster logs events by category (startup, shutdown, errors, checkpoints, and so on), priority, and severity. A complete listing of all reportable events may be found in Section 25.6.3, “Event Reports Generated in NDB Cluster”. Event logs are of the two types listed here:

* Cluster log: Keeps a record of all desired reportable events for the cluster as a whole.

* Node log: A separate log which is also kept for each individual node.

Note

Under normal circumstances, it is necessary and sufficient to keep and examine only the cluster log. The node logs need be consulted only for application development and debugging purposes.

**Checkpoint.** Generally speaking, when data is saved to disk, it is said that a checkpoint has been reached. More specific to NDB Cluster, a checkpoint is a point in time where all committed transactions are stored on disk. With regard to the `NDB` storage engine, there are two types of checkpoints which work together to ensure that a consistent view of the cluster's data is maintained. These are shown in the following list:

* Local Checkpoint (LCP): This is a checkpoint that is specific to a single node; however, LCPs take place for all nodes in the cluster more or less concurrently. An LCP usually occurs every few minutes; the precise interval varies, and depends upon the amount of data stored by the node, the level of cluster activity, and other factors.

  NDB 8.0 supports partial LCPs, which can significantly improve performance under some conditions. See the descriptions of the `EnablePartialLcp` and `RecoveryWork` configuration parameters which enable partial LCPs and control the amount of storage they use.

* Global Checkpoint (GCP): A GCP occurs every few seconds, when transactions for all nodes are synchronized and the redo-log is flushed to disk.

For more information about the files and directories created by local checkpoints and global checkpoints, see NDB Cluster Data Node File System Directory.

**Transporter.** We use the term transporter for the data transport mechanism employed between data nodes. MySQL NDB Cluster 8.0 supports three of these, which are listed here:

* *TCP/IP over Ethernet*. See Section 25.4.3.10, “NDB Cluster TCP/IP Connections”.

* *Direct TCP/IP*. Uses machine-to-machine connections. See Section 25.4.3.11, “NDB Cluster TCP/IP Connections Using Direct Connections”.

  Although this transporter uses the same TCP/IP protocol as mentioned in the previous item, it requires setting up the hardware differently and is configured differently as well. For this reason, it is considered a separate transport mechanism for NDB Cluster.

* *Shared memory (SHM)*. See Section 25.4.3.12, “NDB Cluster Shared-Memory Connections”.

Because it is ubiquitous, most users employ TCP/IP over Ethernet for NDB Cluster.

Regardless of the transporter used, `NDB` attempts to make sure that communication between data node processes is performed using chunks that are as large as possible since this benefits all types of data transmission.


### 25.2.2 NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions

This section discusses the manner in which NDB Cluster divides and duplicates data for storage.

A number of concepts central to an understanding of this topic are discussed in the next few paragraphs.

**Data node.** An **ndbd** or **ndbmtd**") process, which stores one or more fragment replicas—that is, copies of the partitions (discussed later in this section) assigned to the node group of which the node is a member.

Each data node should be located on a separate computer. While it is also possible to host multiple data node processes on a single computer, such a configuration is not usually recommended.

It is common for the terms “node” and “data node” to be used interchangeably when referring to an **ndbd** or **ndbmtd**") process; where mentioned, management nodes (**ndb_mgmd** processes) and SQL nodes (**mysqld** processes) are specified as such in this discussion.

**Node group.** A node group consists of one or more nodes, and stores partitions, or sets of fragment replicas (see next item).

The number of node groups in an NDB Cluster is not directly configurable; it is a function of the number of data nodes and of the number of fragment replicas (`NoOfReplicas` configuration parameter), as shown here:

```
[# of node groups] = [# of data nodes] / NoOfReplicas
```

Thus, an NDB Cluster with 4 data nodes has 4 node groups if `NoOfReplicas` is set to 1 in the `config.ini` file, 2 node groups if `NoOfReplicas` is set to 2, and 1 node group if `NoOfReplicas` is set to 4. Fragment replicas are discussed later in this section; for more information about `NoOfReplicas`, see Section 25.4.3.6, “Defining NDB Cluster Data Nodes”.

Note

All node groups in an NDB Cluster must have the same number of data nodes.

You can add new node groups (and thus new data nodes) online, to a running NDB Cluster; see Section 25.6.7, “Adding NDB Cluster Data Nodes Online”, for more information.

**Partition.** This is a portion of the data stored by the cluster. Each node is responsible for keeping at least one copy of any partitions assigned to it (that is, at least one fragment replica) available to the cluster.

The number of partitions used by default by NDB Cluster depends on the number of data nodes and the number of LDM threads in use by the data nodes, as shown here:

```
[# of partitions] = [# of data nodes] * [# of LDM threads]
```

When using data nodes running **ndbmtd**"), the number of LDM threads is controlled by the setting for `MaxNoOfExecutionThreads`. When using **ndbd** there is a single LDM thread, which means that there are as many cluster partitions as nodes participating in the cluster. This is also the case when using **ndbmtd**") with `MaxNoOfExecutionThreads` set to 3 or less. (You should be aware that the number of LDM threads increases with the value of this parameter, but not in a strictly linear fashion, and that there are additional constraints on setting it; see the description of `MaxNoOfExecutionThreads` for more information.)

**NDB and user-defined partitioning.** NDB Cluster normally partitions `NDBCLUSTER` tables automatically. However, it is also possible to employ user-defined partitioning with `NDBCLUSTER` tables. This is subject to the following limitations:

1. Only the `KEY` and `LINEAR KEY` partitioning schemes are supported in production with `NDB` tables.

2. The maximum number of partitions that may be defined explicitly for any `NDB` table is `8 * [number of LDM threads] * [number of node groups]`, the number of node groups in an NDB Cluster being determined as discussed previously in this section. When running **ndbd** for data node processes, setting the number of LDM threads has no effect (since `ThreadConfig` applies only to **ndbmtd**")); in such cases, this value can be treated as though it were equal to 1 for purposes of performing this calculation.

   See Section 25.5.3, “ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)”"), for more information.

For more information relating to NDB Cluster and user-defined partitioning, see Section 25.2.7, “Known Limitations of NDB Cluster”, and Section 26.6.2, “Partitioning Limitations Relating to Storage Engines”.

**Fragment replica.** This is a copy of a cluster partition. Each node in a node group stores a fragment replica. Also sometimes known as a partition replica. The number of fragment replicas is equal to the number of nodes per node group.

A fragment replica belongs entirely to a single node; a node can (and usually does) store several fragment replicas.

The following diagram illustrates an NDB Cluster with four data nodes running **ndbd**, arranged in two node groups of two nodes each; nodes 1 and 2 belong to node group 0, and nodes 3 and 4 belong to node group 1.

Note

Only data nodes are shown here; although a working NDB Cluster requires an **ndb_mgmd** process for cluster management and at least one SQL node to access the data stored by the cluster, these have been omitted from the figure for clarity.

**Figure 25.2 NDB Cluster with Two Node Groups**

![Content is described in the surrounding text.](images/fragment-replicas-groups-1-1.png)

The data stored by the cluster is divided into four partitions, numbered 0, 1, 2, and 3. Each partition is stored—in multiple copies—on the same node group. Partitions are stored on alternate node groups as follows:

* Partition 0 is stored on node group 0; a primary fragment replica (primary copy) is stored on node 1, and a backup fragment replica (backup copy of the partition) is stored on node 2.

* Partition 1 is stored on the other node group (node group 1); this partition's primary fragment replica is on node 3, and its backup fragment replica is on node 4.

* Partition 2 is stored on node group 0. However, the placing of its two fragment replicas is reversed from that of Partition 0; for Partition 2, the primary fragment replica is stored on node 2, and the backup on node 1.

* Partition 3 is stored on node group 1, and the placement of its two fragment replicas are reversed from those of partition

  1. That is, its primary fragment replica is located on node 4, with the backup on node 3.

What this means regarding the continued operation of an NDB Cluster is this: so long as each node group participating in the cluster has at least one node operating, the cluster has a complete copy of all data and remains viable. This is illustrated in the next diagram.

**Figure 25.3 Nodes Required for a 2x2 NDB Cluster**

![Content is described in the surrounding text.](images/replicas-groups-1-2.png)

In this example, the cluster consists of two node groups each consisting of two data nodes. Each data node is running an instance of **ndbd**. Any combination of at least one node from node group 0 and at least one node from node group 1 is sufficient to keep the cluster “alive”. However, if both nodes from a single node group fail, the combination consisting of the remaining two nodes in the other node group is not sufficient. In this situation, the cluster has lost an entire partition and so can no longer provide access to a complete set of all NDB Cluster data.

The maximum number of node groups supported for a single NDB Cluster instance is 48.


### 25.2.3 NDB Cluster Hardware, Software, and Networking Requirements

One of the strengths of NDB Cluster is that it can be run on commodity hardware and has no unusual requirements in this regard, other than for large amounts of RAM, due to the fact that all live data storage is done in memory. (It is possible to reduce this requirement using Disk Data tables—see Section 25.6.11, “NDB Cluster Disk Data Tables”, for more information about these.) Naturally, multiple and faster CPUs can enhance performance. Memory requirements for other NDB Cluster processes are relatively small.

Increasing the number of CPUs, using faster CPUs, or both, on the computers hosting data nodes can generally be expected to enhance the performance of NDB Cluster. Memory requirements for cluster processes other than the data nodes are relatively small.

The software requirements for NDB Cluster are also modest. Host operating systems do not require any unusual modules, services, applications, or configuration to support NDB Cluster. For supported operating systems, a standard installation should be sufficient. The MySQL software requirements are simple: all that is needed is a production release of NDB Cluster. It is not strictly necessary to compile MySQL yourself merely to be able to use NDB Cluster. We assume that you are using the binaries appropriate to your platform, available from the NDB Cluster software downloads page at <https://dev.mysql.com/downloads/cluster/>.

For communication between nodes, NDB Cluster supports TCP/IP networking in any standard topology, and the minimum expected for each host is a standard 100 Mbps Ethernet card, plus a switch, hub, or router to provide network connectivity for the cluster as a whole. We strongly recommend that an NDB Cluster be run on its own subnet which is not shared with machines not forming part of the cluster for the following reasons:

* **Security.** Communications between NDB Cluster nodes are not encrypted or shielded in any way. The only means of protecting transmissions within an NDB Cluster is to run your NDB Cluster on a protected network. If you intend to use NDB Cluster for Web applications, the cluster should definitely reside behind your firewall and not in your network's De-Militarized Zone (DMZ) or elsewhere.

  See Section 25.6.20.1, “NDB Cluster Security and Networking Issues”, for more information.

* **Efficiency.** Setting up an NDB Cluster on a private or protected network enables the cluster to make exclusive use of bandwidth between cluster hosts. Using a separate switch for your NDB Cluster not only helps protect against unauthorized access to NDB Cluster data, it also ensures that NDB Cluster nodes are shielded from interference caused by transmissions between other computers on the network. For enhanced reliability, you can use dual switches and dual cards to remove the network as a single point of failure; many device drivers support failover for such communication links.

**Network communication and latency.** NDB Cluster requires communication between data nodes and API nodes (including SQL nodes), as well as between data nodes and other data nodes, to execute queries and updates. Communication latency between these processes can directly affect the observed performance and latency of user queries. In addition, to maintain consistency and service despite the silent failure of nodes, NDB Cluster uses heartbeating and timeout mechanisms which treat an extended loss of communication from a node as node failure. This can lead to reduced redundancy. Recall that, to maintain data consistency, an NDB Cluster shuts down when the last node in a node group fails. Thus, to avoid increasing the risk of a forced shutdown, breaks in communication between nodes should be avoided wherever possible.

The failure of a data or API node results in the abort of all uncommitted transactions involving the failed node. Data node recovery requires synchronization of the failed node's data from a surviving data node, and re-establishment of disk-based redo and checkpoint logs, before the data node returns to service. This recovery can take some time, during which the Cluster operates with reduced redundancy.

Heartbeating relies on timely generation of heartbeat signals by all nodes. This may not be possible if the node is overloaded, has insufficient machine CPU due to sharing with other programs, or is experiencing delays due to swapping. If heartbeat generation is sufficiently delayed, other nodes treat the node that is slow to respond as failed.

This treatment of a slow node as a failed one may or may not be desirable in some circumstances, depending on the impact of the node's slowed operation on the rest of the cluster. When setting timeout values such as `HeartbeatIntervalDbDb` and `HeartbeatIntervalDbApi` for NDB Cluster, care must be taken care to achieve quick detection, failover, and return to service, while avoiding potentially expensive false positives.

Where communication latencies between data nodes are expected to be higher than would be expected in a LAN environment (on the order of 100 µs), timeout parameters must be increased to ensure that any allowed periods of latency periods are well within configured timeouts. Increasing timeouts in this way has a corresponding effect on the worst-case time to detect failure and therefore time to service recovery.

LAN environments can typically be configured with stable low latency, and such that they can provide redundancy with fast failover. Individual link failures can be recovered from with minimal and controlled latency visible at the TCP level (where NDB Cluster normally operates). WAN environments may offer a range of latencies, as well as redundancy with slower failover times. Individual link failures may require route changes to propagate before end-to-end connectivity is restored. At the TCP level this can appear as large latencies on individual channels. The worst-case observed TCP latency in these scenarios is related to the worst-case time for the IP layer to reroute around the failures.


### 25.2.4 What is New in MySQL NDB Cluster 8.0

The following sections describe changes in the implementation of MySQL NDB Cluster in NDB Cluster 8.0 through 8.0.44, as compared to earlier release series.

NDB Cluster 8.4 is also available for production; while NDB 8.0 is still supported, we suggest that you use NDB 8.4 for new deployments; for more information, see MySQL NDB Cluster 8.4. NDB Cluster 9.3 is available as a Development release for preview and testing of new features currently under development; see What is New in NDB Cluster 9.4.

NDB Cluster 7.6 (see What is New in NDB Cluster 7.6) is a previous GA release which is still supported in production, although we recommend that new deployments for production use MySQL NDB Cluster 8.4. NDB Cluster 7.5, 7.4, and 7.3 were previous GA releases which have reached their end of life, and are no longer supported or maintained. We recommend that new deployments for production use MySQL NDB Cluster 8.4.

#### What is New in NDB Cluster 8.0

Major changes and new features in NDB Cluster 8.0 which are likely to be of interest are shown in the following list:

* **Compatibility enhancements.** The following changes reduce longstanding nonessential differences in `NDB` behavior as compared to that of other MySQL storage engines:

  + **Development in parallel with MySQL server.** Beginning with this release, MySQL NDB Cluster is being developed in parallel with the standard MySQL 8.0 server under a new unified release model with the following features:

    - NDB 8.0 is developed in, built from, and released with the MySQL 8.0 source code tree.

    - The numbering scheme for NDB Cluster 8.0 releases follows the scheme for MySQL 8.0.

    - Building the source with `NDB` support appends `-cluster` to the version string returned by **mysql** `-V`, as shown here:

      ```
      $> mysql -V
      mysql  Ver 8.0.44-cluster for Linux on x86_64 (Source distribution)
      ```

      `NDB` binaries continue to display both the MySQL Server version and the `NDB` engine version, like this:

      ```
      $> ndb_mgm -V
      MySQL distrib mysql-8.0.44 ndb-8.0.44, for Linux (x86_64)
      ```

      In MySQL Cluster NDB 8.0, these two version numbers are always the same.

    To build the MySQL source with NDB Cluster support, use the CMake option `-DWITH_NDB` (NDB 8.0.31 and later; for earlier releases, use `-DWITH_NDBCLUSTER` instead).

  + **Platform support notes.** NDB 8.0 makes the following changes in platform support:

    - `NDBCLUSTER` no longer supports 32-bit platforms. Beginning with NDB 8.0.21, the NDB build process checks the system architecture and aborts if it is not a 64-bit platform.

    - It is now possible to build `NDB` from source for 64-bit `ARM` CPUs. Currently, this support is source-only, and we do not provide any precompiled binaries for this platform.

  + **Database and table names.** NDB 8.0 removes the previous 63-byte limit on identifiers for databases and tables. These identifiers can now use up to 64 bytes, as for such objects using other MySQL storage engines. See Section 25.2.7.11, “Previous NDB Cluster Issues Resolved in NDB Cluster 8.0”.

  + **Generated names for foreign keys.** `NDB` now uses the pattern `tbl_name_fk_N` for naming internally generated foreign keys. This is similar to the pattern used by `InnoDB`.

* **Schema and metadata distribution and synchronization.** NDB 8.0 makes use of the MySQL data dictionary to distribute schema information to SQL nodes joining a cluster and to synchronize new schema changes between existing SQL nodes. The following list describes individual enhancements relating to this integration work:

  + **Schema distribution enhancements.** The `NDB` schema distribution coordinator, which handles schema operations and tracks their progress, has been extended in NDB 8.0 to ensure that resources used during a schema operation are released at its conclusion. Previously, some of this work was done by the schema distribution client; this has been changed due to the fact that the client did not always have all needed state information, which could lead to resource leaks when the client decided to abandon the schema operation prior to completion and without informing the coordinator.

    To help fix this issue, schema operation timeout detection has been moved from the schema distribution client to the coordinator, providing the coordinator with an opportunity to clean up any resources used during the schema operation. The coordinator now checks ongoing schema operations for timeout at regular intervals, and marks participants that have not yet completed a given schema operation as failed when detecting timeout. It also provides suitable warnings whenever a schema operation timeout occurs. (It should be noted that, after such a timeout is detected, the schema operation itself continues.) Additional reporting is done by printing a list of active schema operations at regular intervals whenever one or more of these operations is ongoing.

    As an additional part of this work, a new **mysqld** option `--ndb-schema-dist-timeout` makes it possible to set the length of time to wait until a schema operation is marked as having timed out.

  + **Disk data file distribution.** NDB Cluster 8.0.14, uses the MySQL data dictionary to make sure that disk data files and related constructs such as tablespaces and log file groups are correctly distributed between all connected SQL nodes.

  + **Schema synchronization of tablespace objects.** When a MySQL Server connects as an SQL node to an NDB cluster, it checks its data dictionary against the information found in the `NDB` dictionary.

    Previously, the only `NDB` objects synchronized on connection of a new SQL node were databases and tables; MySQL NDB Cluster 8.0 also implements schema synchronization of disk data objects including tablespaces and log file groups. Among other benefits, this eliminates the possibility of a mismatch between the MySQL data dictionary and the `NDB` dictionary following a native backup and restore, in which tablespaces and log file groups were restored to the `NDB` dictionary, but not to the MySQL Server's data dictionary.

    It is also no longer possible to issue a `CREATE TABLE` statement that refers to a nonexistent tablespace. Such a statement now fails with an error.

  + **Database DDL synchronization enhancements.** Work done for NDB 8.0 insures that synchronization of databases by newly joined (or rejoined) SQL nodes with those on existing SQL nodes now makes proper use of the data dictionary so that any database-level operations (`CREATE DATABASE`, `ALTER DATABASE`, or `DROP DATABASE`) that may have been missed by this SQL node are now correctly duplicated on it when it connects (or reconnects) to the cluster.

    As part of the schema synchronization procedure performed when starting, an SQL node now compares all databases on the cluster's data nodes with those in its own data dictionary, and if any of these is found to be missing from the SQL node's data dictionary, the SQL Node installs it locally by executing a `CREATE DATABASE` statement. A database thus created uses the default MySQL Server database properties (such as those as determined by `character_set_database` and `collation_database`) that are in effect on this SQL node at the time the statement is executed.

  + **NDB metadata change detection and synchronization.** NDB 8.0 implements a new mechanism for detection of updates to metadata for data objects such as tables, tablespaces, and log file groups with the MySQL data dictionary. This is done using a thread, the `NDB` metadata change monitor thread, which runs in the background and checks periodically for inconsistencies between the `NDB` dictionary and the MySQL data dictionary.

    The monitor performs metadata checks every 60 seconds by default. The polling interval can be adjusted by setting the value of the `ndb_metadata_check_interval` system variable; polling can be disabled altogether by setting the `ndb_metadata_check` system variable to `OFF`. The status variable `Ndb_metadata_detected_count` shows the number of times since **mysqld** was last started that inconsistencies have been detected.

    `NDB` ensures that `NDB` database, table, log file group, and tablespace objects submitted by the metadata change monitor thread during operations following startup are automatically checked for mismatches and synchronized by the `NDB` binlog thread.

    NDB 8.0 adds two status variables relating to automatic synchronization: `Ndb_metadata_synced_count` shows the number of objects synchronized automatically; `Ndb_metadata_excluded_count` indicates the number of objects for which synchronization has failed (prior to NDB 8.0.22, this variable was named `Ndb_metadata_blacklist_size`). In addition, you can see which objects have been synchronized by inspecting the cluster log.

    Setting the `ndb_metadata_sync` system variable to `true` overrides any settings that have been made for `ndb_metadata_check_interval` and `ndb_metadata_check`, causing the change monitor thread to begin continuous metadata change detection.

    In NDB 8.0.22 and later, setting `ndb_metadata_sync` to `true` clears the list of objects for which synchronization has failed previously, which means it is no longer necessary to discover individual tables or to re-trigger synchronization by reconnecting the SQL node to the cluster. In addition, setting this variable to `false` clears the list of objects waiting to be retried.

    Beginning with NDB 8.0.21, more detailed information about the current state of automatic synchronization than can be obtained from log messages or status variables is provided by two new tables added to the MySQL Performance Schema. The tables are listed here:

    - `ndb_sync_pending_objects`: Contains information about database objects for which mismatches have been detected between the `NDB` dictionary and the MySQL data dictionary (and which have not been excluded from automatic synchronization).

    - `ndb_sync_excluded_objects`: Contains information about `NDB` database objects which have been excluded because they cannot be synchronized between the `NDB` dictionary and the MySQL data dictionary, and thus require manual intervention.

    A row in one of these tables provides the database object's parent schema, name, and type. Types of objects include schemas, tablespaces, log file groups, and tables. (If the object is a log file group or tablespace, the parent schema is `NULL`.) In addition, the `ndb_sync_excluded_objects` table shows the reason for which the object has been excluded.

    These tables are present only if `NDBCLUSTER` storage engine support is enabled. For more information about these tables, see Section 29.12.12, “Performance Schema NDB Cluster Tables”.

  + **Changes in NDB table extra metadata.** The extra metadata property of an `NDB` table is used for storing serialized metadata from the MySQL data dictionary, rather than storing the binary representation of the table as in previous versions. (This was a `.frm` file, no longer used by the MySQL Server—see Chapter 16, *MySQL Data Dictionary*.) As part of the work to support this change, the available size of the table's extra metadata has been increased. This means that `NDB` tables created in NDB Cluster 8.0 are not compatible with previous NDB Cluster releases. Tables created in previous releases can be used with NDB 8.0, but cannot be opened afterwards by an earlier version.

    This metadata is accessible using the NDB API methods `getExtraMetadata()` and `setExtraMetadata()`.

    For more information, see Section 25.3.7, “Upgrading and Downgrading NDB Cluster”.

  + **On-the-fly upgrades of tables using .frm files.** A table created in NDB 7.6 and earlier contains metadata in the form of a compressed `.frm` file, which is no longer supported in MySQL 8.0. To facilitate online upgrades to NDB 8.0, `NDB` performs on-the-fly translation of this metadata and writes it into the MySQL Server's data dictionary, which enables the **mysqld** in NDB Cluster 8.0 to work with the table without preventing subsequent use of the table by a previous version of the `NDB` software.

    Important

    Once a table's structure has been modified in NDB 8.0, its metadata is stored using the data dictionary, and it can no longer be accessed by NDB 7.6 and earlier.

    This enhancement also makes it possible to restore an `NDB` backup made using an earlier version to a cluster running NDB 8.0 (or later).

  + **Metadata consistency check error logging.** As part of work previously done in NDB 8.0, the metadata check performed as part of auto-synchronization between the representation of an `NDB` table in the NDB dictionary and its counterpart in the MySQL data dictionary includes the table's name, storage engine, and internal ID. Beginning with NDB 8.0.23, the range of properties checked is expanded to include properties of the following data objects:

    - Columns
    - Indexes
    - Foreign keys

    In addition, details of any mismatches in metadata properties are now written to the MySQL server error log. The formats used for the error log messages differ slightly depending on whether the discrepancy is found on the table level or on the level of a column, index, or foreign key. The format for a log error resulting from a table-level property mismatch is shown here, where *`property`* is the property name, *`ndb_value`* is the property value as stored in the NDB dictionary, and *`mysqld_value`* is the value of the property as stored in the MySQL data dictionary:

    ```
    Diff in 'property' detected, 'ndb_value' != 'mysqld_value'
    ```

    For mismatches in properties of columns, indexes, and foreign keys, the format is as follows, where *`obj_type`* is one of `column`, `index`, or `foreign key`, and *`obj_name`* is the name of the object:

    ```
    Diff in obj_type 'obj_name.property' detected, 'ndb_value' != 'mysqld_value'
    ```

    Metadata checks are performed during automatic synchronization of `NDB` tables when they are installed in the data dictionary of any **mysqld** acting as an SQL node in an NDB Cluster. If the **mysqld** is debug-compiled, checks are also made whenever a `CREATE TABLE` statement is executed, and whenever an `NDB` table is opened.

* **Synchronization of user privileges with NDB_STORED_USER.** A new mechanism for sharing and synchronizing users, roles, and privileges between SQL nodes is available in NDB 8.0, using the `NDB_STORED_USER` privilege. Distributed privileges as implemented in NDB 7.6 and earlier (see Distributed Privileges Using Shared Grant Tables) are no longer supported.

  Once a user account is created on an SQL node, the user and its privileges can be stored in `NDB` and thus shared between all SQL nodes in the cluster by issuing a `GRANT` statement such as this one:

  ```
  GRANT NDB_STORED_USER ON *.* TO 'jon'@'localhost';
  ```

  `NDB_STORED_USER` always has global scope and must be granted using `ON *.*`. System reserved accounts such as `mysql.session@localhost` or `mysql.infoschema@localhost` cannot be assigned this privilege.

  Roles can also be shared between SQL nodes by issuing the appropriate `GRANT NDB_STORED_USER` statement. Assigning such a role to a user does not cause the user to be shared; the `NDB_STORED_USER` privilege must be granted to each user explicitly.

  A user or role having `NDB_STORED_USER`, along with its privileges, is shared with all SQL nodes as soon as they join a given NDB Cluster. It is possible to make such changes from any connected SQL node, but recommended practice is to do so from a designated SQL node only, since the order of execution of statements affecting privileges from different SQL nodes cannot be guaranteed to be the same on all SQL nodes.

  Prior to NDB 8.0.27, changes to the privileges of a user or role were synchronized immediately with all connected SQL nodes. Beginning with MySQL 8.0.27, an SQL node takes a global read lock when updating privileges, which keeps concurrent changes executed by multiple SQL nodes from causing a deadlock.

  **Implications for upgrades.** Due to changes in the MySQL server's privilege system (see Section 8.2.3, “Grant Tables”), privilege tables using the `NDB` storage engine do not function correctly in NDB 8.0. It is safe but not necessary to retain such privilege tables created in NDB 7.6 or earlier, but they are no longer used for access control. In NDB 8.0, a **mysqld** acting as an SQL node and detecting such tables in `NDB` writes a warning to the MySQL server log, and creates `InnoDB` shadow tables local to itself; such shadow tables are created on each MySQL server connected to the cluster. When performing an upgrade from NDB 7.6 or earlier, the privilege tables using `NDB` can be removed safely using **ndb_drop_table** once all MySQL servers acting as SQL nodes have been upgraded (see Section 25.3.7, “Upgrading and Downgrading NDB Cluster”).

  The **ndb_restore** utility's `--restore-privilege-tables` option is deprecated but continues to be honored in NDB 8.0, and can still be used to restore distributed privilege tables present in a backup taken from a previous release of NDB Cluster to a cluster running NDB 8.0. These tables are handled as described in the preceding paragraph.

  Shared users and grants are stored in the `ndb_sql_metadata` table, which **ndb_restore** by default does not restore in NDB 8.0; you can specify the `--include-stored-grants` option to cause it to do so.

  See Section 25.6.13, “Privilege Synchronization and NDB_STORED_USER”, for more information.

* **INFORMATION_SCHEMA changes.** The following changes are made in the display of information regarding Disk Data files in the Information Schema `FILES` table:

  + Tablespaces and log file groups are no longer represented in the `FILES` table. (These constructs are not actually files.)

  + Each data file is now represented by a single row in the `FILES` table. Each undo log file is also now represented in this table by one row only. (Previously, a row was displayed for each copy of each of these files on each data node.)

  In addition, `INFORMATION_SCHEMA` tables are now populated with tablespace statistics for MySQL Cluster tables. (Bug #27167728)

* **Error information with ndb_perror.** The deprecated `--ndb` option for **perror** has been removed. Instead, use **ndb_perror** to obtain error message information from `NDB` error codes. (Bug #81704, Bug #81705, Bug #23523926, Bug #23523957)

* **Condition pushdown enhancements.** Previously, condition pushdown was limited to predicate terms referring to column values from the same table to which the condition was being pushed. In NDB 8.0, this restriction is removed such that column values from tables earlier in the query plan can also be referred to from pushed conditions. NDB 8.0 supports joins comparing column expressions, as well as comparisons between columns in the same table. Columns and column expressions to be compared must be of exactly the same type; this means they must also be of the same signedness, length, character set, precision, and scale, whenever these attributes apply. Conditions being pushed could not be part of pushed joins prior to NDB 8.0.27, when this restriction is lifted.

  Pushing down larger parts of a condition allows more rows to be filtered out by the data nodes, thereby reducing the number of rows which **mysqld** must handle during join processing. Another benefit of these enhancements is that filtering can be performed in parallel in the LDM threads, rather than in a single mysqld process on an SQL node; this has the potential to improve query performance significantly.

  Existing rules for type compatibility between column values being compared continue to apply (see Section 10.2.1.5, “Engine Condition Pushdown Optimization”).

  **Pushdown of outer joins and semijoins.** Work done in NDB 8.0.20 allows many outer joins and semijoins, and not only those using a primary key or unique key lookup, to be pushed down to the data nodes (see Section 10.2.1.5, “Engine Condition Pushdown Optimization”).

  Outer joins using scans which can now be pushed include those which meet the following conditions:

  + There are no unpushed conditions on the table
  + There are no unpushed conditions on other tables in the same join nest, or in upper join nests on which it depends

  + All other tables in the same join nest, or in upper join nests on which it depends, are also pushed

  A semijoin that uses an index scan can now be pushed if it meets the conditions just noted for a pushed outer join, and it uses the `firstMatch` strategy (see [Section 10.2.2.1, “Optimizing IN and EXISTS Subquery Predicates with Semijoin Transformations”](semijoins.html "10.2.2.1 Optimizing IN and EXISTS Subquery Predicates with Semijoin Transformations")).

  These additional improvements are made in NDB 8.0.21:

  + Antijoins produced by the MySQL Optimizer through the transformation of `NOT EXISTS` and `NOT IN` queries (see [Section 10.2.2.1, “Optimizing IN and EXISTS Subquery Predicates with Semijoin Transformations”](semijoins.html "10.2.2.1 Optimizing IN and EXISTS Subquery Predicates with Semijoin Transformations")) can be pushed down to the data nodes by `NDB`.

    This can be done when there is no unpushed condition on the table, and the query fulfills any other conditions which must be met for an outer join to be pushed down.

  + `NDB` attempts to identify and evaluate a non-dependent scalar subquery before trying to retrieve any rows from the table to which it is attached. When it can do so, the value obtained is used as part of a pushed condition, instead of using the subquery which provided the value.

  Beginning with NDB 8.0.27, conditions pushed as part of a pushed query can now refer to columns from ancestor tables within the same pushed query, subject to the following conditions:

  + Pushed conditions may include any of the comparison operators `<`, `<=`, `>`, `>=`, `=`, and `<>`.

  + Values being compared must be of the same type, including length, precision, and scale.

  + `NULL` handling is performed according to the comparison semantics specified by the ISO SQL standard; any comparison with `NULL` returns `NULL`.

  Consider the table created using the statement shown here:

  ```
  CREATE TABLE t (
      x INT PRIMARY KEY,
      y INT
  ) ENGINE=NDB;
  ```

  A query such as [`SELECT

  * FROM t AS m JOIN t AS n ON m.x >= n.y`](select.html "15.2.13 SELECT Statement") can now use the engine condition pushdown optimization to push down the condition column `y`.

  When a join cannot be pushed, `EXPLAIN` should provide the reason or reasons.

  See Section 10.2.1.5, “Engine Condition Pushdown Optimization”, for more information.

  The NDB API methods `branch_col_eq_param()`, `branch_col_ne_param()`, `branch_col_lt_param()`, `branch_col_le_param()`, `branch_col_gt_param()`, and `branch_col_ge_param()` were added in NDB 8.0.27 as part of this work. These `NdbInterpretedCode` can be used to compare column values with values of parameters.

  In addition, `NdbScanFilter::cmp_param()`, also added in NDB 8.0.27, makes it possible to define comparisons between column values and parameter values for use in performing scans.

* **Increase in maximum row size.** NDB 8.0 increases the maximum number of bytes that can be stored in an `NDBCLUSTER` table from 14000 to 30000 bytes.

  A `BLOB` or `TEXT` column continues to use 264 bytes of this total, as before.

  The maximum offset for a fixed-width column of an `NDB` table is 8188 bytes; this is also unchanged from previous releases.

  See Section 25.2.7.5, “Limits Associated with Database Objects in NDB Cluster”, for more information.

* **ndb_mgm SHOW command and single user mode.** In NDB 8.0, when the cluster in single user mode, the output of the management client `SHOW` command indicates which API or SQL node has exclusive access while this mode is in effect.

* **Online column renames.** Columns of `NDB` tables can now be renamed online, using `ALGORITHM=INPLACE`. See Section 25.6.12, “Online Operations with ALTER TABLE in NDB Cluster”, for more information.

* **Improved ndb_mgmd startup times.** Start times for management nodes daemon have been significantly improved in NDB 8.0, in the following ways:

  + Due to replacing the list data structure formerly used by `ndb_mgmd` for handling node properties from configuration data with a hash table, overall startup times for the management server have been decreased by a factor of 6 or more.

  + In addition, in cases where data and SQL node host names not present in the management server's `hosts` file are used in the cluster configuration file, **ndb_mgmd** start times can be up to 20 times shorter than was previously the case.

* **NDB API enhancements.** `NdbScanFilter::cmp()` and several comparison methods of `NdbInterpretedCode` can now be used to compare table column values with each other. The affected `NdbInterpretedCode` methods are listed here:

  + `branch_col_eq()`
  + `branch_col_ge()`
  + `branch_col_gt()`
  + `branch_col_le()`
  + `branch_col_lt()`
  + `branch_col_ne()`

  For all of the methods just listed, table column values to be compared much be of exactly matching types, including with respect to length, precision, signedness, scale, character set, and collation, as applicable.

  See the descriptions of the individual API methods for more information.

* **Offline multithreaded index builds.** It is now possible to specify a set of cores to be used for I/O threads performing offline multithreaded builds of ordered indexes, as opposed to normal I/O duties such as file I/O， compression， or decompression. “Offline” in this context refers to building of ordered indexes performed when the parent table is not being written to; such building takes place when an `NDB` cluster performs a node or system restart, or as part of restoring a cluster from backup using **ndb_restore** `--rebuild-indexes`.

  In addition, the default behavior for offline index build work is modified to use all cores available to **ndbmtd**"), rather limiting itself to the core reserved for the I/O thread. Doing so can improve restart and restore times and performance, availability, and the user experience.

  This enhancement is implemented as follows:

  1. The default value for `BuildIndexThreads` is changed from 0 to 128. This means that offline ordered index builds are now multithreaded by default.

  2. The default value for `TwoPassInitialNodeRestartCopy` is changed from `false` to `true`. This means that an initial node restart first copies all data from a “live” node to one that is starting—without creating any indexes—builds ordered indexes offline, and then again synchronizes its data with the live node, that is, synchronizing twice and building indexes offline between the two synchronizations. This causes an initial node restart to behave more like the normal restart of a node, and reduces the time required for building indexes.

  3. A new thread type (`idxbld`) is defined for the `ThreadConfig` configuration parameter, to allow locking of offline index build threads to specific CPUs.

  In addition, `NDB` now distinguishes the thread types that are accessible to `ThreadConfig` by these two criteria:

  1. Whether the thread is an execution thread. Threads of types `main`, `ldm`, `recv`, `rep`, `tc`, and `send` are execution threads; thread types `io`, `watchdog`, and `idxbld` are not.

  2. Whether the allocation of the thread to a given task is permanent or temporary. Currently all thread types except `idxbld` are permanent.

  For additional information, see the descriptions of the indicated parameters in the Manual. (Bug #25835748, Bug #26928111)

* **logbuffers table backup process information.** When performing an NDB backup, the `ndbinfo.logbuffers` table now displays information regarding buffer usage by the backup process on each data node. This is implemented as rows reflecting two new log types in addition to `REDO` and `DD-UNDO`. One of these rows has the log type `BACKUP-DATA`, which shows the amount of data buffer used during backup to copy fragments to backup files. The other row has the log type `BACKUP-LOG`, which displays the amount of log buffer used during the backup to record changes made after the backup has started. One each of these `log_type` rows is shown in the `logbuffers` table for each data node in the cluster. Rows having these two log types are present in the table only while an NDB backup is currently in progress. (Bug #25822988)

* **ndbinfo.processes table on Windows.** The process ID of the monitor process used on Windows platforms by `RESTART` to spawn and restart a **mysqld** is now shown in the `processes` table as an `angel_pid`.

* **String hashing improvements.** Prior to NDB 8.0, all string hashing was based on first transforming the string into a normalized form, then MD5-hashing the resulting binary image. This could give rise to some performance problems, for the following reasons:

  + The normalized string is always space padded to its full length. For a `VARCHAR`, this often involved adding more spaces than there were characters in the original string.

  + The string libraries were not optimized for this space padding, which added considerable overhead in some use cases.

  + The padding semantics varied between character sets, some of which were not padded to their full length.

  + The transformed string could become quite large, even without space padding; some Unicode 9.0 collations can transform a single code point into 100 bytes or more of character data.

  + Subsequent MD5 hashing consisted mainly of padding with spaces, and was not particularly efficient, possibly causing additional performance penalties by flushing significant portions of the L1 cache.

  A collation provides its own hash function, which hashes the string directly without first creating a normalized string. In addition, for a Unicode 9.0 collation, the hash is computed without padding. `NDB` now takes advantage of this built-in function whenever hashing a string identified as using a Unicode 9.0 collation.

  Since, for other collations, there are existing databases which are hash partitioned on the transformed string, `NDB` continues to employ the previous method for hashing strings that use these, to maintain compatibility. (Bug #89590, Bug #89604, Bug #89609, Bug #27515000, Bug #27523758, Bug #27522732)

* **RESET MASTER changes.** Because the MySQL Server now executes `RESET MASTER` with a global read lock, the behavior of this statement when used with NDB Cluster has changed in the following two respects:

  + It is no longer guaranteed to be synchronous; that is, it is now possible that a read coming immediately before `RESET MASTER` is issued may not be logged until after the binary log has been rotated.

  + It now behaves in exactly the same fashion, whether the statement is issued on the same SQL node that is writing the binary log, or on a different SQL node in the same cluster.

  Note

  `SHOW BINLOG EVENTS`, `FLUSH LOGS`, and most data definition statements continue, as they did in previous `NDB` versions, to operate in a synchronous fashion.

* **ndb_restore option usage.** The `--nodeid` and `--backupid` options are now both required when invoking **ndb_restore**.

* **ndb_log_bin default.** NDB 8.0 changes the default value of the `ndb_log_bin` system variable from `TRUE` to `FALSE`.

* **Dynamic transactional resource allocation.** Allocation of resources in the transaction coordinator is now performed using dynamic memory pools. This means that resource allocation determined by data node configuration parameters such as `MaxDMLOperationsPerTransaction`, `MaxNoOfConcurrentIndexOperations`, `MaxNoOfConcurrentOperations`, `MaxNoOfConcurrentScans`, `MaxNoOfConcurrentTransactions`, `MaxNoOfFiredTriggers`, `MaxNoOfLocalScans`, and `TransactionBufferMemory` is now done in such a way that, if the load represented by each of these parameters is within the target load for all such resources, others of these resources can be limited so as not to exceed the total resources available.

  As part of this work, several new data node parameters controlling transactional resources in `DBTC`, listed here, have been added:

  + `ReservedConcurrentIndexOperations`
  + `ReservedConcurrentOperations`
  + `ReservedConcurrentScans`
  + `ReservedConcurrentTransactions`
  + `ReservedFiredTriggers`
  + `ReservedLocalScans`
  + `ReservedTransactionBufferMemory`.

  See the descriptions of the parameters just listed for further information.

* **Backups using multiple LDMs per data node.** `NDB` backups can now be performed in a parallel fashion on individual data nodes using multiple local data managers (LDMs). (Previously, backups were done in parallel across data nodes, but were always serial within data node processes.) No special syntax is required for the `START BACKUP` command in the **ndb_mgm** client to enable this feature, but all data nodes must be using multiple LDMs. This means that data nodes must be running **ndbmtd**") (**ndbd** is single-threaded and thus always has only one LDM) and they must be configured to use multiple LDMs before taking the backup; you can do this by choosing an appropriate setting for one of the multi-threaded data node configuration parameters `MaxNoOfExecutionThreads` or `ThreadConfig`.

  Backups using multiple LDMs create subdirectories, one per LDM, under the `BACKUP/BACKUP-backup_id/` directory. **ndb_restore** now detects these subdirectories automatically, and if they exist, attempts to restore the backup in parallel; see Section 25.5.23.3, “Restoring from a backup taken in parallel”, for details. (Single-threaded backups are restored as in previous versions of `NDB`.) It is also possible to restore backups taken in parallel using an **ndb_restore** binary from a previous version of NDB Cluster by modifying the usual restore procedure; Section 25.5.23.3.2, “Restoring a parallel backup serially”, provides information on how to do this.

  You can force the creation of single-threaded backups by setting the `EnableMultithreadedBackup` data node parameter to 0 for all data nodes in the `[ndbd default]` section of the cluster's global configuration file (`config.ini`).

* **Binary configuration file enhancements.** NDB 8.0 uses a new format for the management server's binary configuration file. Previously, a maximum of 16381 sections could appear in the cluster configuration file; now the maximum number of sections is 4G. This is intended to support larger numbers of nodes in a cluster than was possible before this change.

  Upgrades to the new format are relatively seamless, and should seldom if ever require manual intervention, as the management server continues to be able to read the old format without issue. A downgrade from NDB 8.0 to an older version of the NDB Cluster software requires manual removal of any binary configuration files or, alternatively, starting the older management server binary with the `--initial` option.

  For more information, see Section 25.3.7, “Upgrading and Downgrading NDB Cluster”.

* **Increased number of data nodes.** NDB 8.0 increases the maximum number of data nodes supported per cluster to 144 (previously, this was 48). Data nodes can now use node IDs in the range 1 to 144, inclusive.

  Previously, the recommended node IDs for management nodes were 49 and 50. These are still supported for management nodes, but using them as such limits the maximum number of data nodes to 142; for this reason, it is now recommended that node IDs 145 and 146 are used for management nodes.

  As part of this work, the format used for the data node `sysfile` has been updated to version 2. This file records information such as the last global checkpoint index, restart status, and node group membership of each node (see NDB Cluster Data Node File System Directory).

* **RedoOverCommitCounter and RedoOverCommitLimit changes.** Due to ambiguities in the semantics for setting them to 0, the minimum value for each of the data node configuration parameters `RedoOverCommitCounter` and `RedoOverCommitLimit` has been increased to 1.

* **ndb_autoincrement_prefetch_sz changes.** The default value of the `ndb_autoincrement_prefetch_sz` server system variable is increased to 512.

* **Changes in parameter maximums and defaults.** NDB 8.0 makes the following changes in configuration parameter maximum and default values:

  + The maximum for `DataMemory` is increased to 16 terabytes.

  + The maximum for `DiskPageBufferMemory` is also increased to 16 terabytes.

  + The default value for `StringMemory` is increased to 25%.

  + The default for `LcpScanProgressTimeout` is increased to 180 seconds.

* **Disk Data checkpointing improvements.** NDB Cluster 8.0 provides a number of new enhancements which help to reduce the latency of checkpoints of Disk Data tables and tablespaces when using non-volatile memory devices such as solid-state drives and the NVMe specification for such devices. These improvements include those in the following list:

  + Avoiding bursts of checkpoint disk writes
  + Speeding up checkpoints for disk data tablespaces when the redo log or the undo log becomes full

  + Balancing checkpoints to disk and in-memory checkpoints against one other, when necessary

  + Protecting disk devices from overload to help ensure low latency under high loads

  As part of this work, two data node configuration parameters have been added. `MaxDiskDataLatency` places a ceiling on the degree of latency permitted for disk access and causes transactions taking longer than this length of time to be aborted. `DiskDataUsingSameDisk` makes it possible to take advantage of housing Disk Data tablespaces on separate disks by increasing the rate at which checkpoints of such tablespaces can be performed.

  In addition, three new tables in the `ndbinfo` database provide information about Disk Data performance:

  + The `diskstat` table reports on writes to Disk Data tablespaces during the past second

  + The `diskstats_1sec` table reports on writes to Disk Data tablespaces for each of the last 20 seconds

  + The `pgman_time_track_stats` table reports on the latency of disk operations relating to Disk Data tablespaces

* **Memory allocation and TransactionMemory.** A new `TransactionMemory` parameter simplifies allocation of data node memory for transactions as part of the work done to pool transactional and Local Data Manager (LDM) memory. This parameter is intended to replace several older transactional memory parameters which have been deprecated.

  Transaction memory can now be set in any of the three ways listed here:

  + Several configuration parameters are incompatible with `TransactionMemory`. If any of these are set, `TransactionMemory` cannot be set (see Parameters incompatible with TransactionMemory), and the data node's transaction memory is determined as it was previous to NDB 8.0.

    Note

    Attempting to set `TransactionMemory` and any of these parameters concurrently in the `config.ini` file prevents the management server from starting.

  + If `TransactionMemory` is set, this value is used for determining transaction memory. `TransactionMemory` cannot be set if any of the incompatible parameters mentioned in the previous item have also been set.

  + If none of the incompatible parameters are set and `TransactionMemory` is also not set, transaction memory is set by `NDB`.

  For more information, see the description of `TransactionMemory`, as well as Section 25.4.3.13, “Data Node Memory Management”.

* **Support for additional fragment replicas.** NDB 8.0 increases the maximum number of fragment replicas supported in production from two to four. (Previously, it was possible to set `NoOfReplicas` to 3 or 4, but this was not officially supported or verified in testing.)

* **Restoring by slices.** Beginning with NDB 8.0.20, it is possible to divide a backup into roughly equal portions (slices) and to restore these slices in parallel using two new options implemented for **ndb_restore**:

  + `--num-slices` determines the number of slices into which the backup should be divided.

  + `--slice-id` provides the ID of the slice to be restored by the current instance of **ndb_restore**.

  This makes it possible to employ multiple instances of **ndb_restore** to restore subsets of the backup in parallel, potentially reducing the amount of time required to perform the restore operation.

  For more information, see the description of the **ndb_restore** `--num-slices` option.

* **Read from any fragment replica enabled.** Read from any fragment replica is enabled by default for all `NDB` tables. This means that the default value for the `ndb_read_backup` system variable is now ON, and that the value of the `NDB_TABLE` comment option `READ_BACKUP` is 1 when creating a new `NDB` table. Enabling read from any fragment replica significantly improves performance for reads from `NDB` tables, with minimal impact on writes.

  For more information, see the description of the `ndb_read_backup` system variable, and Section 15.1.20.12, “Setting NDB Comment Options”.

* **ndb_blob_tool enhancements.** Beginning with NDB 8.0.20, the **ndb_blob_tool** utility can detect missing blob parts for which inline parts exist and replace these with placeholder blob parts (consisting of space characters) of the correct length. To check whether there are missing blob parts, use the `--check-missing` option with this program. To replace any missing blob parts with placeholders, use the `--add-missing` option.

  For more information, see [Section 25.5.6, “ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables”](mysql-cluster-programs-ndb-blob-tool.html "25.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables").

* **ndbinfo versioning.** `NDB` 8.0.20 and later supports versioning for `ndbinfo` tables, and maintains the current definitions for its tables internally. At startup, `NDB` compares its supported `ndbinfo` version with the version stored in the data dictionary. If the versions differ, `NDB` drops any old `ndbinfo` tables and recreates them using the current definitions.

* **Support for Fedora Linux.** Beginning with NDB 8.0.20, Fedora Linux is a supported platform for NDB Cluster Community releases and can be installed using the RPMs supplied for this purpose by Oracle. These can be obtained from the [NDB Cluster downloads page](https://dev.mysql.com/downloads/cluster/).

* **NDB programs—NDBT dependency removal.** The dependency of a number of `NDB` utility programs on the `NDBT` library has been removed. This library is used internally for development, and is not required for normal use; its inclusion in these programs could lead to unwanted issues when testing.

  Affected programs are listed here, along with the `NDB` versions in which the dependency was removed:

  + **ndb_restore**
  + **ndb_delete_all**
  + **ndb_show_tables** (NDB 8.0.20)
  + **ndb_waiter** (NDB 8.0.20)

  The principal effect of this change for users is that these programs no longer print `NDBT_ProgramExit - status` following completion of a run. Applications that depend upon such behavior should be updated to reflect the change when upgrading to the indicated versions.

* **Foreign keys and lettercasing.** `NDB` stores the names of foreign keys using the case with which they were defined. Formerly, when the value of the `lower_case_table_names` system variable was set to 0, it performed case-sensitive comparisons of foreign key names as used in `SELECT` and other SQL statements with the names as stored. Beginning with NDB 8.0.20, such comparisons are now always performed in a case-insensitive fashion, regardless of the value of `lower_case_table_names`.

* **Multiple transporters.** NDB 8.0.20 introduces support for multiple transporters to handle node-to-node communication between pairs of data nodes. This facilitates higher rates of update operations for each node group in the cluster, and helps avoid constraints imposed by system or other limitations on inter-node communications using a single socket.

  By default, `NDB` now uses a number of transporters based on the number of local data management (LDM) threads or the number of transaction coordinator (TC) threads, whichever is greater. By default, the number of transporters is equal to half of this number. While the default should perform well for most workloads, it is possible to adjust the number of transporters employed by each node group by setting the `NodeGroupTransporters` data node configuration parameter (also introduced in NDB 8.0.20), up a maximum of the greater of the number of LDM threads or the number of TC threads. Setting it to 0 causes the number of transporters to be the same as the number of LDM threads.

* **ndb_restore: primary key schema changes.** NDB 8.0.21 (and later) supports different primary key definitions for source and target tables when restoring an `NDB` native backup with **ndb_restore** when it is run with the `--allow-pk-changes` option. Both increasing and decreasing the number of columns making up the original primary key are supported.

  When the primary key is extended with an additional column or columns, any columns added must be defined as `NOT NULL`, and no values in any such columns may be changed during the time that the backup is being taken. Because some applications set all column values in a row when updating it, whether or not all values are actually changed, this can cause a restore operation to fail even if no values in the column to be added to the primary key have changed. You can override this behavior using the `--ignore-extended-pk-updates` option also added in NDB 8.0.21; in this case, you must ensure that no such values are changed.

  A column can be removed from the table's primary key whether or not this column remains part of the table.

  For more information, see the description of the `--allow-pk-changes` option for **ndb_restore**.

* **Merging backups with ndb_restore.** In some cases, it may be desirable to consolidate data originally stored in different instances of NDB Cluster (all using the same schema) into a single target NDB Cluster. This is now supported when using backups created in the **ndb_mgm** client (see Section 25.6.8.2, “Using The NDB Cluster Management Client to Create a Backup”) and restoring them with **ndb_restore**, using the `--remap-column` option added in NDB 8.0.21 along with `--restore-data` (and possibly additional compatible options as needed or desired). `--remap-column` can be employed to handle cases in which primary and unique key values are overlapping between source clusters, and it is necessary that they do not overlap in the target cluster, as well as to preserve other relationships between tables such as foreign keys.

  `--remap-column` takes as its argument a string having the format `db.tbl.col:fn:args`, where *`db`*, *`tbl`*, and *`col`* are, respectively, the names of the database, table, and column, *`fn`* is the name of a remapping function, and *`args`* is one or more arguments to *`fn`*. There is no default value. Only `offset` is supported as the function name, with *`args`* as the integer offset to be applied to the value of the column when inserting it into the target table from the backup. This column must be one of `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") or `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"); the allowed range of the offset value is the same as the signed version of that type (this allows the offset to be negative if desired).

  The new option can be used multiple times in the same invocation of **ndb_restore**, so that you can remap to new values multiple columns of the same table, different tables, or both. The offset value does not have to be the same for all instances of the option.

  In addition, two new options are provided for **ndb_desc**, also beginning in NDB 8.0.21:

  + `--auto-inc` (short form `-a`): Includes the next auto-increment value in the output, if the table has an `AUTO_INCREMENT` column.

  + `--context` (short form `-x`): Provides extra information about the table, including the schema, database name, table name, and internal ID.

  For more information and examples, see the description of the `--remap-column` option.

* **Send thread improvements.** As of NDB 8.0.20, each send thread now handles sends to a subset of transporters, and each block thread now assists only one send thread, resulting in more send threads, and thus better performance and data node scalability.

* **Adaptive spin control using SpinMethod.** A simple interface for setting up adaptive CPU spin on platforms supporting it, using the `SpinMethod` data node parameter. This parameter (added in NDB 8.0.20, functional beginning with NDB 8.0.24) has four settings, one each for static spinning, cost-based adaptive spinning, latency-optimized adaptive spinning, and adaptive spinning optimized for database machines on which each thread has its own CPU. Each of these settings causes the data node to use a set of predetermined values for one or more spin parameters which enable adaptive spinning, set spin timing, and set spin overhead, as appropriate to a given scenario, thus obviating the need to set these directly for common use cases.

  For fine-tuning spin behavior, it is also possible to set these and additional spin parameters directly, using the existing `SchedulerSpinTimer` data node configuration parameter as well as the following `DUMP` commands in the **ndb_mgm** client:

  + [`DUMP 104000 (SetSchedulerSpinTimerAll)`](/doc/ndb-internals/en/dump-command-104000.html): Sets spin time for all threads

  + [`DUMP 104001 (SetSchedulerSpinTimerThread)`](/doc/ndb-internals/en/dump-command-104001.html): Sets spin time for a specified thread

  + [`DUMP 104002 (SetAllowedSpinOverhead)`](/doc/ndb-internals/en/dump-command-104002.html): Sets spin overhead as the number of units of CPU time allowed to gain 1 unit of latency

  + [`DUMP 104003 (SetSpintimePerCall)`](/doc/ndb-internals/en/dump-command-104003.html): Sets the time for a call to spin

  + [`DUMP 104004 (EnableAdaptiveSpinning)`](/doc/ndb-internals/en/dump-command-104004.html): Enables or disables adaptive spinning

  NDB 8.0.20 also adds a new TCP configuration parameter `TcpSpinTime` which sets the time to spin for a given TCP connection.

  The **ndb_top** tool is also enhanced to provide spin time information per thread.

  For additional information, see the description of the `SpinMethod` parameter, the listed `DUMP` commands, and Section 25.5.29, “ndb_top — View CPU usage information for NDB threads”.

* **Disk Data and cluster restarts.** Beginning with NDB 8.0.21, an initial restart of the cluster forces the removal of all Disk Data objects such as tablespaces and log file groups, including any data files and undo log files associated with these objects.

  See Section 25.6.11, “NDB Cluster Disk Data Tables”, for more information.

* **Disk Data extent allocation.** Beginning with NDB 8.0.20, allocation of extents in data files is done in a round-robin fashion among all data files used by a given tablespace. This is expected to improve distribution of data in cases where multiple storage devices are used for Disk Data storage.

  For more information, see Section 25.6.11.1, “NDB Cluster Disk Data Objects”.

* **--ndb-log-fail-terminate option.** Beginning with NDB 8.0.21, you can cause the SQL node to terminate whenever it is unable to log all row events fully. This can be done by starting **mysqld** with the `--ndb-log-fail-terminate` option.

* **AllowUnresolvedHostNames parameter.** By default, a management node refuses to start when it cannot resolve a host name present in the global configuration file, which can be problematic in some environments such as Kubernetes. Beginning with NDB 8.0.22, it is possible to override this behavior by setting `AllowUnresolvedHostNames` to `true` in the `[tcp default]` section of the cluster global configuration file (`config.ini` file). Doing so causes such errors to be treated as warnings instead, and to permit **ndb_mgmd** to continue starting

* **Blob write performance enhancements.** NDB 8.0.22 implements a number of improvements which allow more efficient batching when modifying multiple blob columns in the same row, or when modifying multiple rows containing blob columns in the same statement, by reducing the number of round trips required between an SQL or other API node and the data nodes when applying these modifications. The performance of many `INSERT`, `UPDATE`, and `DELETE` statements can thus be improved. Examples of such statements are listed here, where *`table`* is an `NDB` table containing one or more Blob columns:

  + `INSERT INTO table VALUES ROW(1, blob_value1, blob_value2, ...)`, that is, insertion of a row containing one or more Blob columns

  + `INSERT INTO table VALUES ROW(1, blob_value1), ROW(2, blob_value2), ROW(3, blob_value3), ...`, that is, insertion of multiple rows containing one or more Blob columns

  + `UPDATE table SET blob_column1 = blob_value1, blob_column2 = blob_value2, ...`

  + `UPDATE table SET blob_column = blob_value WHERE primary_key_column in (value_list)`, where the primary key column is not a Blob type

  + `DELETE FROM table WHERE primary_key_column = value`, where the primary key column is not a Blob type

  + `DELETE FROM table WHERE primary_key_column IN (value_list)`, where the primary key column is not a Blob type

  Other SQL statements may benefit from these improvements as well. These include [`LOAD DATA INFILE`](load-data.html "15.2.9 LOAD DATA Statement") and [`CREATE TABLE ... SELECT ...`](create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement"). In addition, [`ALTER TABLE table ENGINE = NDB`](alter-table.html "15.1.9 ALTER TABLE Statement"), where *`table`* uses a storage engine other than `NDB` prior to execution of the statement, may also execute more efficiently.

  This enhancement applies to statements affecting columns of MySQL type `BLOB`, `MEDIUMBLOB`, `LONGBLOB`, `TEXT`, `MEDIUMTEXT`, and `LONGTEXT`. Statements which update `TINYBLOB` or `TINYTEXT` columns (or both types) only are not affected by this work, and no changes in their performance should be expected.

  The performance of some SQL statements is not noticeably improved by this enhancement, due to the fact that they require scans of table Blob columns, which breaks up batching. Such statements include those of the types listed here:

  + [`SELECT FROM table [WHERE key_column IN (blob_value_list)]`](select.html "15.2.13 SELECT Statement"), where rows are selected by matching on a primary key or unique key column which uses a Blob type

  + `UPDATE table SET blob_column = blob_value WHERE condition`, using a *`condition`* which does not depend on a unique value

  + `DELETE FROM table WHERE condition` to delete rows containing one or more Blob columns, using a *`condition`* which does not depend on a unique value

  + A copying `ALTER TABLE` statement on a table which already used the `NDB` storage engine prior to executing the statement, and whose rows contain one or more Blob columns before or after the statement is executed (or both)

  To take advantage of this improvement to its fullest extent, you may wish to increase the values used for the `--ndb-batch-size` and `--ndb-blob-write-batch-bytes` options for **mysqld**, to minimize the number of round trips required to modify blobs. For replication, it is also recommended that you enable the `slave_allow_batching` system variable, which minimizes the number of round trips required by the replica cluster to apply epoch transactions.

  Note

  Beginning with NDB 8.0.30, you should also use `ndb_replica_batch_size` instead of `--ndb-batch-size`, and `ndb_replica_blob_write_batch_bytes` rather than `--ndb-blob-write-batch-bytes`. See the descriptions of these variables, as well as Section 25.7.5, “Preparing the NDB Cluster for Replication”, for more information.

* **Node.js update.** Beginning with NDB 8.0.22, the `NDB` adapter for Node.js is built using version 12.18.3, and only that version (or a later version of Node.js) is now supported.

* **Encrypted backups.** NDB 8.0.22 adds support for backup files encrypted using AES-256-CBC; this is intended to protect against recovery of data from backups that have been accessed by unauthorized parties. When encrypted, backup data is protected by a user-supplied password. The password can be any string consisting of up to 256 characters from the range of printable ASCII characters other than `!`, `'`, `"`, `$`, `%`, `\`, and `^`. Retention of the password used to encrypt any given NDB Cluster backup must be performed by the user or application; `NDB` does not save the password. The password can be empty, although this is not recommended.

  When taking an NDB Cluster backup, you can encrypt it by using `ENCRYPT PASSWORD=password` with the management client [`START BACKUP`](mysql-cluster-backup-using-management-client.html "25.6.8.2 Using The NDB Cluster Management Client to Create a Backup") command. Users of the MGM API can also initiate an encrypted backup by calling `ndb_mgm_start_backup4()`.

  You can encrypt existing backup files using the **ndbxfrm** utility which is added to the NDB Cluster distribution in the 8.0.22 release; this program can also be employed for decrypting encrypted backup files. In addition, **ndbxfrm** can compress backup files and decompress compressed backup files using the same method that is employed by NDB Cluster for creating backups when the `CompressedBackup` configuration parameter is set to 1.

  To restore from an encrypted backup, use **ndb_restore** with the options `--decrypt` and `--backup-password`. Both options are required, along with any others that would be needed to restore the same backup if it were not encrypted. **ndb_print_backup_file** and **ndbxfrm** can also read encrypted files using, respectively, `-P` *`password`* and `--decrypt-password=password`.

  In all cases in which a password is supplied together with an option for encryption or decryption, the password must be quoted; you can use either single or double quotation marks to delimit the password.

  Beginning with NDB 8.0.24, several `NDB` programs, listed here, also support input of the password from standard input, similarly to how this is done when logging in interactively with the **mysql** client using the `--password` option (without including the password on the command line):

  + For **ndb_restore** and **ndb_print_backup_file**, the `--backup-password-from-stdin` option enables input of the password in a secure fashion, similar to how it is done by the **mysql** client' `--password` option. For **ndb_restore**, use the option together with the `--decrypt` option; for **ndb_print_backup_file**, use the option in place of the `-P` option.

  + For **ndb_mgm** the option `--backup-password-from-stdin`, is supported together with [`--execute "START BACKUP [options]"`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_execute) for starting a cluster backup from the system shell.

  + Two **ndbxfrm** options, `--encrypt-password-from-stdin` and `--decrypt-password-from-stdin`, cause similar behavior when using that program to encrypt or to decrypt a backup file.

  See the descriptions of the programs just listed for more information.

  It is also possible, beginning with NDB 8.0.22, to enforce encryption of backups by setting `RequireEncryptedBackup=1` in the `[ndbd default]` section of the cluster global configuration file. When this is done, the **ndb_mgm** client rejects any attempt to perform a backup that is not encrypted.

  Beginning with NDB 8.0.24, you can cause **ndb_mgm** to use encryption whenever it creates a backup by starting it with `--encrypt-backup`. In this case, the user is prompted for a password when invoking `START BACKUP` if none is supplied.

* **IPv6 support.** Beginning with NDB 8.0.22, IPv6 addressing is supported for connections to management and data nodes; this includes connections between management and data nodes with SQL nodes. When configuring a cluster, you can use numeric IPv6 addresses, host names which resolve to IPv6 addresses or both.

  For IPv6 addressing to work, the operating platform and network on which the cluster is deployed must support IPv6. As when using IPv4 addressing, hostname resolution to IPv6 addresses must be provided by the operating platform.

  A known issue on Linux platforms when running NDB 8.0.22 and later was that the operating system kernel was required to provide IPv6 support, even when no IPv6 addresses were in use. This issue is fixed in NDB 8.0.34 and later, where it is safe to disable IPv6 support in the Linux kernel if you do not intend to use IPv6 addressing (Bug #33324817, Bug #33870642).

  IPv4 addressing continues to be supported by `NDB`. Using IPv4 and IPv6 addresses concurrently is not recommended, but can be made to work in the following cases:

  + When the management node is configured with IPv6 and data nodes are configured with IPv4 addresses in the `config.ini` file: This works if `--bind-address` is not used with **mgmd**, and data nodes are started with `--ndb-connectstring` set to the IPv4 address of the management nodes.

  + When the management node is configured with IPv4 and data nodes are configured with IPv6 addresses in `config.ini`: Similarly to the other case, this works if `--bind-address` is not passed to **mgmd** and data nodes are started with `--ndb-connectstring` set to the IPv6 address of the management node.

  These cases work because **ndb_mgmd** does not bind to any IP address by default.

  To perform an upgrade from a version of `NDB` that does not support IPv6 addressing to one that does, provided that the network supports IPv4 and IPv6, first perform the software upgrade; after this has been done, you can update IPv4 addresses used in the `config.ini` file with IPv6 addresses. After this, to cause the configuration changes to take effect and to make the cluster start using the IPv6 addresses, it is necessary to perform a system restart of the cluster.

* **Auto-Installer deprecation and removal.** The MySQL NDB Cluster Auto-Installer web-based installation tool (**ndb_setup.py**) is deprecated in NDB 8.0.22, and is removed in NDB 8.0.23 and later. It is no longer supported.

* **ndbmemcache deprecation and removal.** `ndbmemcache` is no longer supported. `ndbmemcache` was deprecated in NDB 8.0.22, and removed in NDB 8.0.23.

* **ndbinfo backup_id table.** NDB 8.0.24 adds a `backup_id` table to the `ndbinfo` information database. This is intended to serve as a replacement for obtaining this information by using **ndb_select_all** to dump the contents of the internal `SYSTAB_0` table, which is error-prone and takes an excessively long time to perform.

  This table has a single column and row containing the ID of the most recent backup of the cluster taken using the `START BACKUP` management client command. In the event that no backup of this cluster can be found, the table contains a single row whose column value is `0`.

* **Table partitioning enhancements.** NDB 8.0.23 introduces a new method for handling table partitions and fragments, which can determine the number of local data managers (LDMs) for a given data node independently of the number of redo log parts. This means that the number of LDMs can now be highly variable. `NDB` can employ this method when the `ClassicFragmentation` data node configuration parameter, also implemented in NDB 8.0.23, is set to `false`; when this is the case, the number of LDMs is no longer used to determine how many partitions to create for a table per data node, and the value of the `PartitionsPerNode` parameter (also introduced in NDB 8.0.23) determines this number instead, which is also used for calculating the number of fragments used for a table.

  When `ClassicFragmentation` has its default value `true`, then the traditional method of using the number of LDMs is used to determine the number of fragments that a table should have.

  For more information, see the descriptions of the new parameters referenced previously, in Multi-Threading Configuration Parameters (ndbmtd)").

* **Terminology updates.** To align with work begun in MySQL 8.0.21 and NDB 8.0.21, NDB 8.0.23 implements a number of changes in terminology, listed here:

  + The system variable `ndb_slave_conflict_role` is now deprecated. It is replaced by `ndb_conflict_role`.

  + Many `NDB` status variables are deprecated. These variables, and their replacements, are shown in the following table:

    **Table 25.1 Deprecated NDB status variables and their replacements**

    <table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Deprecated variable</th> <th>Replacement</th> </tr></thead><tbody><tr> <td><code>Ndb_api_adaptive_send_deferred_count_slave</code></td> <td><code>Ndb_api_adaptive_send_deferred_count_replica</code></td> </tr><tr> <td><code>Ndb_api_adaptive_send_forced_count_slave</code></td> <td><code>Ndb_api_adaptive_send_forced_count_replica</code></td> </tr><tr> <td><code>Ndb_api_adaptive_send_unforced_count_slave</code></td> <td><code>Ndb_api_adaptive_send_unforced_count_replica</code></td> </tr><tr> <td><code>Ndb_api_bytes_received_count_slave</code></td> <td><code>Ndb_api_bytes_received_count_replica</code></td> </tr><tr> <td><code>Ndb_api_bytes_sent_count_slave</code></td> <td><code>Ndb_api_bytes_sent_count_replica</code></td> </tr><tr> <td><code>Ndb_api_pk_op_count_slave</code></td> <td><code>Ndb_api_pk_op_count_replica</code></td> </tr><tr> <td><code>Ndb_api_pruned_scan_count_slave</code></td> <td><code>Ndb_api_pruned_scan_count_replica</code></td> </tr><tr> <td><code>Ndb_api_range_scan_count_slave</code></td> <td><code>Ndb_api_range_scan_count_replica</code></td> </tr><tr> <td><code>Ndb_api_read_row_count_slave</code></td> <td><code>Ndb_api_read_row_count_replica</code></td> </tr><tr> <td><code>Ndb_api_scan_batch_count_slave</code></td> <td><code>Ndb_api_scan_batch_count_replica</code></td> </tr><tr> <td><code>Ndb_api_table_scan_count_slave</code></td> <td><code>Ndb_api_table_scan_count_replica</code></td> </tr><tr> <td><code>Ndb_api_trans_abort_count_slave</code></td> <td><code>Ndb_api_trans_abort_count_replica</code></td> </tr><tr> <td><code>Ndb_api_trans_close_count_slave</code></td> <td><code>Ndb_api_trans_close_count_replica</code></td> </tr><tr> <td><code>Ndb_api_trans_commit_count_slave</code></td> <td><code>Ndb_api_trans_commit_count_replica</code></td> </tr><tr> <td><code>Ndb_api_trans_local_read_row_count_slave</code></td> <td><code>Ndb_api_trans_local_read_row_count_replica</code></td> </tr><tr> <td><code>Ndb_api_trans_start_count_slave</code></td> <td><code>Ndb_api_trans_start_count_replica</code></td> </tr><tr> <td><code>Ndb_api_uk_op_count_slave</code></td> <td><code>Ndb_api_uk_op_count_replica</code></td> </tr><tr> <td><code>Ndb_api_wait_exec_complete_count_slave</code></td> <td><code>Ndb_api_wait_exec_complete_count_replica</code></td> </tr><tr> <td><code>Ndb_api_wait_meta_request_count_slave</code></td> <td><code>Ndb_api_wait_meta_request_count_replica</code></td> </tr><tr> <td><code>Ndb_api_wait_nanos_count_slave</code></td> <td><code>Ndb_api_wait_nanos_count_replica</code></td> </tr><tr> <td><code>Ndb_api_wait_scan_result_count_slave</code></td> <td><code>Ndb_api_wait_scan_result_count_replica</code></td> </tr><tr> <td><code>Ndb_slave_max_replicated_epoch</code></td> <td><code>Ndb_replica_max_replicated_epoch</code></td> </tr></tbody></table>

    The deprecated status variables continue to be shown in the output of `SHOW STATUS`, but applications should be updated as soon as possible not to rely upon them any longer, since their availability in future release series is not guaranteed.

  + The values `ADD_TABLE_MASTER` and `ADD_TABLE_SLAVE` previously shown in the `tab_copy_status` column of the `ndbinfo` `ndbinfo.table_distribution_status` table are deprecated. These are replaced by, respectively, the values `ADD_TABLE_COORDINATOR` and `ADD_TABLE_PARTICIPANT`.

  + The `--help` output of some `NDB` client and utility programs such as **ndb_restore** has been modified.

* **ThreadConfig enhancements.** As of NDB 8.0.23, the configurability of the `ThreadConfig` parameter has been extended with two new thread types, listed here:

  + `query`: A query thread works (only) on `READ COMMITTED` queries. A query thread also acts as a recovery thread. The number of query threads must be 0, 1, 2, or 3 times the number of LDM threads. 0 (the default, unless using `ThreadConfig`, or `AutomaticThreadConfig` is enabled) causes LDMs to behave as they did prior to NDB 8.0.23.

  + `recover`: A recovery thread retrieves data from a local checkpoint. A recovery thread specified as such never acts as a query thread.

  It is also possible to combine the existing `main` and `rep` threads in either of two ways:

  + Into a single thread by setting either one of these arguments to 0. When this is done, the resulting combined thread is shown with the name `main_rep` in the `ndbinfo.threads` table.

  + Together with the `recv` thread by setting both `ldm` and `tc` to 0, and setting `recv` to 1. In this case, the combined thread is named `main_rep_recv`.

  In addition, the maximum numbers of a number of existing thread types have been increased. The new maximums, including those for query threads and recovery threads, are listed here:

  + LDM: 332
  + Query: 332
  + Recovery: 332
  + TC: 128
  + Receive: 64
  + Send: 64
  + Main: 2

  Maximums for other thread types remain unchanged.

  Also, as the result of work done relating to this task, `NDB` now employs mutexes to protect job buffers when using more than 32 block threads. While this can cause a slight decrease in performance (1 to 2 percent in most cases), it also significantly reduces the amount of memory required by very large configurations. For example, a setup with 64 threads which used 2 GB of job buffer memory prior to NDB 8.0.23 should require only about 1 GB instead in NDB 8.0.23 and later. In our testing this has resulted in an overall improvement on the order of 5 percent in the execution of very complex queries.

  For further information, see the descriptions of the `ThreadConfig` parameter and the `ndbinfo.threads` table.

* **ThreadConfig thread count changes.** As the result of work done in NDB 8.0.30, setting the value of `ThreadConfig` requires including `main`, `rep`, `recv`, and `ldm` in the `ThreadConfig` value string explicitly, in this and subsequent NDB Cluster releases. In addition, `count=0` must be set explicitly for each thread type (of `main`, `rep`, or `ldm`) that is not to be used, and setting `count=1` for replication threads (`rep`) requires also setting `count=1` for `main`.

  These changes can have a significant impact on upgrades of NDB clusters where this parameter is in use; see Section 25.3.7, “Upgrading and Downgrading NDB Cluster”, for more information.

* **ndbmtd Thread Auto-Configuration.** Beginning with NDB 8.0.23, it is possible to employ automatic configuration of threads for multi-threaded data nodes using the **ndbmtd**") configuration parameter `AutomaticThreadConfig`. When this parameter is set to 1, `NDB` sets up thread assignments automatically, based on the number of processors available to applications, for all thread supported thread types, including the new `query` and `recover` thread types described in the previous item. If the system does not limit the number of processors, you can do so if desired by setting `NumCPUs` (also added in NDB 8.0.23). Otherwise, automatic thread configuration accommodates up to 1024 CPUs.

  Automatic thread configuration occurs regardless of any values set for `ThreadConfig` or `MaxNoOfExecutionThreads` in `config.ini`; this means that it is not necessary to set either of these parameters.

  In addition, NDB 8.0.23 implements a number of new `ndbinfo` information database tables providing information about hardware and CPU availability, as well as CPU usage by `NDB` data nodes. These tables are listed here:

  + `cpudata`
  + `cpudata_1sec`
  + `cpudata_20sec`
  + `cpudata_50ms`
  + `cpuinfo`
  + `hwinfo`

  Some of these tables are not available on every platform supported by NDB Cluster; see the individual descriptions of them for more information.

* **Hierarchical views of NDB database objects.** The `dict_obj_tree` table, added to the `ndbinfo` information database in NDB 8.0.24, can provide hierarchical and tree-like views of many `NDB` database objects, including the following:

  + Tables and associated indexes
  + Tablespaces and associated data files
  + Logfile groups and associated undo log files

  For more information and examples, see Section 25.6.16.25, “The ndbinfo dict_obj_tree Table”.

* **Index statistics enhancements.** NDB 8.0.24 implements the following improvements in calculation of index statistics:

  + Index statistics were previously collected from one fragment only; this is changed such that this extrapolation is extended to additional fragments.

  + The algorithm used for very small tables, such as those having very few rows where results are discarded, has been improved, so that estimates for such tables should be more accurate than previously.

  As of NDB 8.0.27, the index statistics tables are created and updated automatically by default, `IndexStatAutoCreate` and `IndexStatAutoUpdate` both default to `1` (enabled) rather than `0` (disabled), and it is no longer necessary to run `ANALYZE TABLE` to update the statistics.

  For additional information, see Section 25.6.15, “NDB API Statistics Counters and Variables”.

* **Conversion between NULL and NOT NULL during restore operations.** Beginning with NDB 8.0.26, **ndb_restore** can support restoring of `NULL` columns as `NOT NULL` and the reverse, using the options listed here:

  + To restore a `NULL` column as `NOT NULL`, use the `--lossy-conversions` option.

    The column originally declared as `NULL` must not contain any `NULL` rows; if it does, **ndb_restore** exits with an error.

  + To restore a `NOT NULL` column as `NULL`, use the `--promote-attributes` option.

  For more information, see the descriptions of the indicated **ndb_restore** options.

* **SQL-compliant NULL comparison mode for NdbScanFilter.** Traditionally, when making comparisons involving `NULL`, `NdbScanFilter` treats `NULL` as equal to `NULL` (and thus considers `NULL == NULL` to be `TRUE`). This is not the same as specified by the SQL Standard, which requires that any comparison with `NULL` return `NULL`, including `NULL == NULL`.

  Previously, it was not possible for an NDB API application to override this behavior; beginning with NDB 8.0.26, you can do so by calling `NdbScanFilter::setSqlCmpSemantics()` prior to creating a scan filter. (Thus, this method is always invoked as a class method and not as an instance method.) Doing so causes the next `NdbScanFilter` object to be created to employ SQL-compliant `NULL` comparison for all comparison operations performed over the lifetime of the instance. You must invoke the method for each `NdbScanFilter` object that should use SQL-compliant comparisons.

  For more information, see NdbScanFilter::setSqlCmpSemantics().

* **Deprecation of NDB API .FRM file methods.** MySQL 8.0 and NDB 8.0 no longer use `.FRM` files for storing table metadata. For this reason, the NDB API methods `getFrmData()`, `getFrmLength()`, and `setFrm()` are deprecated as of NDB 8.0.27, and subject to removal in a future release. For reading and writing table metadata, use `getExtraMetadata()` and `setExtraMetadata()` instead.

* **Preference for IPv4 or IPv6 addressing.** NDB 8.0.26 adds the `PreferIPVersion` configuration parameter, which controls the addressing preference for DNS resolution. IPv4 (`PreferIPVersion=4`) is the default. Because configuration retrieval in NDB requires that this preference be the same for all TCP connections, you should set it only in the `[tcp default]` section of the cluster global configuration (`config.ini`) file.

  See Section 25.4.3.10, “NDB Cluster TCP/IP Connections”, for more information.

* **Logging enhancements.** Previously, analysis of NDB Cluster data node and management node logs could be hampered by the fact that different log messages used different formats, and that not all log messages included timestamps. Such issues were due in part to the fact that logging was performed by a number of different mechanisms, such as the functions `printf`, `fprintf`, `ndbout`, and `ndbout_c`, overloading of the `<<` operator, and so on.

  We fix these problems by standardizing on the `EventLogger` mechanism, which is already present in `NDB`, and which begins each log message with a timestamp in `YYYY-MM-DD HH:MM:SS` format.

  See Section 25.6.3, “Event Reports Generated in NDB Cluster”, for more information about NDB Cluster event logs and the `EventLogger` log message format.

* **Copying ALTER TABLE improvements.** Beginning with NDB 8.0.27, a copying `ALTER TABLE` on an `NDB` table compares the fragment commit counts for the source table before and after performing the copy. This allows the SQL node executing this statement to determine whether there has been any concurrent write activity to the table being altered; if so, the SQL node can then terminate the operation.

  When concurrent writes are detected being made to the table being altered, the `ALTER TABLE` statement is rejected with the error Detected change to data in source table during copying ALTER TABLE. Alter aborted to avoid inconsistency (`ER_TABLE_DEF_CHANGED`). Stopping the alter operation, rather than allowing it to proceed with concurrent writes taking place, can help prevent silent data loss or corruption.

* **ndbinfo index_stats table.** NDB 8.0.28 adds the `index_stats` table, which provides basic information about NDB index statistics. It is intended primarily for internal testing, but may be useful as a supplement to **ndb_index_stat**.

* **ndb_import --table option.** Prior to NDB 8.0.28, **ndb_import** always imported the data read from a CSV file into a table whose name was derived from the name of the file being read. NDB 8.0.28 adds a `--table` option (short form: `-t`) for this program to specify the name of the target table directly, and override the previous behavior.

  The default behavior for **ndb_import** remains to use the base name of the input file as the name of the target table.

* **ndb_import --missing-ai-column option.** Beginning with NDB 8.0.29, **ndb_import** can import data from a CSV file that contains empty values for an `AUTO_INCREMENT` column, using the `--missing-ai-column` option introduced in that release. The option can be used with one or more tables containing such a column.

  In order for this option to work, the `AUTO_INCREMENT` column in the CSV file must not contain any values. Otherwise, the import operation cannot proceed.

* **ndb_import and empty lines.** **ndb_import** has always rejected any empty lines encountered in an incoming CSV file. NDB 8.0.30 adds support for importing empty lines into a single column, provided that it is possible to convert the empty value into a column value.

* **ndb_restore --with-apply-status option.** Beginning with NDB 8.0.29, it is possible to restore the `ndb_apply_status` table from an `NDB` backup, using **ndb_restore** with the `--with-apply-status` option added in that release. To use this option, you must also use `--restore-data` when invoking **ndb_restore**.

  `--with-apply-status` restores all rows of the `ndb_apply_status` table except for the row having `server_id = 0`; to restore this row, use `--restore-epoch`. For more information, see ndb_apply_status Table, as the description of the `--with-apply-status` option.

* **SQL access to tables with missing indexes.** Prior to NDB 8.0.29, when a user query attempted to open an `NDB` table with a missing or broken index, the MySQL server raised `NDB` error `4243` (Index not found). This situation could arise when constraint violations or missing data make it impossible to restore an index on an `NDB` table, and **ndb_restore** `--disable-indexes` was used to restore the data without the index.

  Beginning with NDB 8.0.29, an SQL query against an `NDB` table which has missing indexes succeeds if the query does not use any of the missing indexes. Otherwise, the query is rejected with `ER_NOT_KEYFILE`. In this case, you can use [`ALTER TABLE ... ALTER INDEX ... INVISIBLE`](alter-table.html#alter-table-index "Primary Keys and Indexes") to keep the MySQL Optimizer from trying to use the index, or drop the index (and then possibly re-create it) using the appropriate SQL statements.

* **NDB API List::clear() method.** The NDB API `Dictionary` methods `listEvents()`, `listIndexes()`, and `listObjects()` each require a reference to a `List` object which is empty. Previously, reusing an existing `List` with any of these methods was problematic for this reason. NDB 8.0.29 makes this easier by implementing a `clear()` method which removes all data from the list.

  As part of this work, the `List` class destructor now calls `List::clear()` before removing any elements or attributes from the list.

* **NDB dictionary tables in ndbinfo.** NDB 8.0.29 introduces several new tables in the `ndbinfo` database providing information from `NdbDictionary` that previously required the use of **ndb_desc**, **ndb_select_all**, and other **NDB** utility programs.

  Two of these tables are actually views. The `hash_maps` table provides information about hash maps used by `NDB`; the `files` table shows information regarding files used for storing data on disk (see Section 25.6.11, “NDB Cluster Disk Data Tables”).

  The remaining six `ndbinfo` tables added in NDB 8.0.29 are base tables. These tables are not hidden and are not named using the prefix `ndb$`. These tables are listed here, with descriptions of the objects represented in each table:

  + `blobs`: Blob tables used to store the variable-size parts of `BLOB` and `TEXT` columns

  + `dictionary_columns`: Columns of `NDB` tables

  + `dictionary_tables`: `NDB` tables

  + `events`: Event subscriptions in the NDB API

  + `foreign_keys`: Foreign keys on `NDB` tables

  + `index_columns`: Indexes on `NDB` tables

  NDB 8.0.29 also makes changes in the `ndbinfo` storage engine's implementation of primary keys to improve compatibility with `NdbDictionary`.

* **ndbcluster plugin and Performance Schema.** As of NDB 8.0.29, `ndbcluster` plugin threads are shown in the Performance Schema `threads` and `setup_threads` tables, making it possible to obtain information about the performance of these threads. The three threads exposed in `performance_schema` tables are listed here:

  + `ndb_binlog`: Binary logging thread
  + `ndb_index_stat`: Index statistics thread
  + `ndb_metadata`: Metadata thread

  See ndbcluster Plugin Threads, for more information and examples.

  In NDB 8.0.30 and later, transaction batching memory usage is visible as `memory/ndbcluster/Thd_ndb::batch_mem_root` in the Performance Schema `memory_summary_by_thread_by_event_name` and `setup_instruments` tables. You can use this information to see how much memory is being used by transactions. For additional information, see Transaction Memory Usage.

* **Configurable blob inline size.** Beginning with NDB 8.0.30, it is possible to set a blob column's inline size as part of `CREATE TABLE` or `ALTER TABLE`. The maximum inline size supported by NDB Cluster is 29980 bytes.

  For additional information and examples, see NDB_COLUMN Options, as well as String Type Storage Requirements.

* **replica_allow_batching enabled by default.** Replica write batching improves NDB Cluster Replication performance greatly, especially when replicating blob-type columns (`TEXT`, `BLOB`, and `JSON`), and so generally should be enabled whenever using replication with NDB Cluster. For this reason, beginning with NDB 8.0.30, the `replica_allow_batching` system variable is enabled by default, and setting it to `OFF` raises a warning.

* **Conflict resolution insert operation support.** Prior to NDB 8.0.30, there were only two strategies available for resolving primary key conflicts for update and delete operations, implemented as the functions `NDB$MAX()` and `NDB$MAX_DELETE_WIN()`. Neither of these has any effect on write operations, other than that a write operation with the same primary key as a previous write is always rejected, and accepted and applied only if no operation having the same primary key already exists. NDB 8.0.30 introduces two new conflict resolution functions `NDB$MAX_INS()` and `NDB$MAX_DEL_WIN_INS()` that handle primary key conflicts between insert operations. These functions handle conflicting writes as follows:

  1. If there is no conflicting write, apply this one (this is the same as `NDB$MAX()`).

  2. Otherwise, apply “greatest timestamp wins” conflict resolution, as follows:

     1. If the timestamp for the incoming write is greater than that of the conflicting write, apply the incoming operation.

     2. If the timestamp for the incoming write is *not* greater, reject the incoming write operation.

  For conflicting update and delete operations, `NDB$MAX_INS()` behaves as `NDB$MAX()` does, and `NDB$MAX_DEL_WIN_INS()` behaves in the same way as `NDB$MAX_DELETE_WIN()`.

  This enhancement provides support for configuring conflict detection when handling conflicting replicated write operations, so that a replicated `INSERT` with a higher timestamp column value is applied idempotently, while a replicated `INSERT` with a lower timestamp column value is rejected.

  As with the other conflict resolution functions, rejected operations can optionally be logged in an exceptions table; rejected operations increment a counter (status variables `Ndb_conflict_fn_max` for “greatest timestamp wins” and `Ndb_conflict_fn_old` for “same timestamp wins”).

  For more information, see the descriptions of the new conflict resolution functions, and as well as Section 25.7.12, “NDB Cluster Replication Conflict Resolution”.

* **Replication applier batch size control.** Previously, the size of batches used when writing to a replica NDB Cluster was controlled by `--ndb-batch-size`, and the batch size used for writing blob data to the replica was determined by `ndb-blob-write-batch-bytes`. One problem with this arrangement was that the replica used the global values of these variables which meant that changing either of them for the replica also affected the value used by all other sessions. In addition, it was not possible to set different defaults for these values exclusive to the replica, which should preferably have a higher default value than other sessions.

  NDB 8.0.30 adds two new system variables which are specific to the replica applier. `ndb_replica_batch_size` now controls the batch size used for the replica applier, and `ndb_replica_blob_write_batch_bytes` variable now determines the blob write batch size used to perform batch blob writes on the replica.

  This change should improve the behavior of MySQL NDB Cluster Replication using default settings, and lets the user fine tune NDB replication performance without affecting user threads, such as those performing processing of SQL queries.

  For more information, see the descriptions of the new variables. See also Section 25.7.5, “Preparing the NDB Cluster for Replication”.

* **Binary Log Transaction Compression.** NDB 8.0.31 adds support for binary logs using compressed transactions with `ZSTD` compression. To enable this feature, set the `ndb_log_transaction_compression` system variable introduced in this release to `ON`. The level of compression used can be controlled using the `ndb_log_transaction_compression_level_zstd` system variable, which is also added in that release; the default compression level is 3.

  Although the `binlog_transaction_compression` and `binlog_transaction_compression_level_zstd` server system variables have no effect on binary logging of `NDB` tables, starting **mysqld** with `--binlog-transaction-compression=ON` causes `ndb_log_transaction_compression` to be enabled automatically. You can disable it in a MySQL client session using `SET @@global.ndb_log_transaction_compression=OFF` after server startup has completed.

  See the description of `ndb_log_transaction_compression` as well as Section 7.4.4.5, “Binary Log Transaction Compression”, for more information.

* **NDB Replication: Multithreaded Applier.** As of NDB 8.0.33, NDB Cluster replication supports the MySQL multithreaded applier (MTA) on replica servers (and nonzero values of `replica_parallel_workers`), which enables the application of binary log transactions in parallel on the replica and thereby increasing throughput. (For more information about the multithreaded applier in the MySQL server, see Section 19.2.3, “Replication Threads”.)

  Enabling this feature on the replica requires that the source be started with `--ndb-log-transaction-dependency` set to `ON` (this option is also implemented in NDB 8.0.33). It is also necessary on the source to set `binlog_transaction_dependency_tracking` to `WRITESET`. In addition, you must ensure that `replica_parallel_workers` has a value greater than 1 on the replica, and thus, that the replica uses multiple worker threads.

  For additional information and requirements, see Section 25.7.11, “NDB Cluster Replication Using the Multithreaded Applier”.

* **Changes in build options.** NDB 8.0.31 makes the following changes in CMake options used for building MySQL Cluster.

  + The `WITH_NDBCLUSTER` option is deprecated, and `WITH_PLUGIN_NDBCLUSTER` is removed.

  + To build MySQL Cluster from source, use the newly-added `WITH_NDB` option.

  + `WITH_NDBCLUSTER_STORAGE_ENGINE` continues to be supported, but is no longer needed for most builds.

  See CMake Options for Compiling NDB Cluster, for more information.

* **File system encryption.** Transparent Data Encryption (TDE) provides protection by encryption of `NDB` data at rest, that is, of all `NDB` table data and log files which are persisted to disk. This is intended to protect against recovering data after obtaining unauthorized access to NDB Cluster data files such as tablespace files or logs.

  Encryption is implemented transparently by the NDB file system layer (`NDBFS`) on the data nodes; data is encrypted and decrypted as it is read from and written to the file, and `NDBFS` internal client blocks operate on files as normal.

  `NDBFS` can transparently encrypt a file directly from a user provided password, but decoupling the encryption and decryption of individual files from the user provided password can be advantageous for reasons of efficiency, usability, security, and flexibility. See Section 25.6.14.2, “NDB File System Encryption Implementation”.

  TDE uses two types of keys. A secret key is used to encrypt the actual data and log files stored on disk (including LCP, redo, undo, and tablespace files). A master key is then used to encrypt the secret key.

  The `EncryptedFileSystem` data node configuration parameter, available beginning with NDB 8.0.29, when set to `1`, enforces encryption on files storing table data. This includes LCP data files, redo log files, tablespace files, and undo log files.

  It is also necessary to provide a password to each data node when starting or restarting it, using one of the options `--filesystem-password` or `--filesystem-password-from-stdin`. See Section 25.6.14.1, “NDB File System Encryption Setup and Usage”. This password uses the same format and is subject to the same constraints as the password used for an encrypted `NDB` backup (see the description of the **ndb_restore** `--backup-password` option for details).

  Only tables using the `NDB` storage engine are subject to encryption by this feature; see Section 25.6.14.3, “NDB File System Encryption Limitations”. Other tables, such as those used for `NDB` schema distribution, replication, and binary logging, typically use `InnoDB`; see Section 17.13, “InnoDB Data-at-Rest Encryption”. For information about encryption of binary log files, see Section 19.3.2, “Encrypting Binary Log Files and Relay Log Files”.

  Files generated or used by `NDB` processes, such as operating system logs, crash logs, and core dumps, are not encrypted. Files used by `NDB` but not containing any user table data are also not encrypted; these include LCP control files, schema files, and system files (see NDB Cluster Data Node File System). The management server configuration cache is also not encrypted.

  In addition, NDB 8.0.31 adds a new utility **ndb_secretsfile_reader** for extracting key information from a secrets file (`S0.sysfile`).

  This enhancement builds on work done in NDB 8.0.22 to implement encrypted `NDB` backups. For more information about encrypted backups, see the description of the `RequireEncryptedBackup` configuration parameter, as well as Section 25.6.8.2, “Using The NDB Cluster Management Client to Create a Backup”.

* **Removal of unneeded program options.** A number of “junk” command-line options for NDB utility and other programs which had never been implemented were removed in NDB Cluster 8.0.31. The options and the programs from which they have been dropped are listed here:

  + `--ndb-optimized-node-selection`:

    **ndbd**, **ndbmtd**"), **ndb_mgm**, **ndb_delete_all**, **ndb_desc**, **ndb_drop_index**, **ndb_drop_table**, **ndb_show_table**, **ndb_blob_tool**, **ndb_config**, **ndb_index_stat**, **ndb_move_data**, **ndbinfo_select_all**, **ndb_select_count**

  + `--character-sets-dir`:

    **ndb_mgm**, **ndb_mgmd**, **ndb_config**, **ndb_delete_all**, **ndb_desc**, **ndb_drop_index**, **ndb_drop_table**, **ndb_show_table**, **ndb_blob_tool**, **ndb_config**, **ndb_index_stat**, **ndb_move_data**, **ndbinfo_select_all**, **ndb_select_count**, **ndb_waiter**

  + `--core-file`:

    **ndb_mgm**, **ndb_mgmd**, **ndb_config**, **ndb_delete_all**, **ndb_desc**, **ndb_drop_index**, **ndb_drop_table**, **ndb_show_table**, **ndb_blob_tool**, **ndb_config**, **ndb_index_stat**, **ndb_move_data**, **ndbinfo_select_all**, **ndb_select_count**, **ndb_waiter**

  + `--connect-retries` and `--connect-retry-delay`:

    **ndb_mgmd**

  + `--ndb-nodeid`:

    **ndb_config**

  For more information, see the relevant program and option descriptions in Section 25.5, “NDB Cluster Programs”.

* **Reading Configuration Cache Files.** Beginning with NDB 8.0.32, it is possible to read binary configuration cache files created by **ndb_mgmd** using the **ndb_config** option `--config-binary-file` introduced in that release. This can simplify the process of determining whether the settings in a given configuration file have been applied to the cluster, or of recovery of settings from the binary cache after the `config.ini` file has somehow been damaged or lost.

  For more information and examples, see the description of this option in Section 25.5.7, “ndb_config — Extract NDB Cluster Configuration Information”.

* **ndbinfo transporter_details table.** This `ndbinfo` table provides information about individual transporters used in an NDB cluster. Added in NDB 8.0.37, it is otherwise similar to the `ndbinfo` `transporters` table.

  Several additional columns were added to this table in NDB 8.0.38. These are listed here:

  + `sendbuffer_used_bytes`
  + `sendbuffer_max_used_bytes`
  + `sendbuffer_alloc_bytes`
  + `sendbuffer_max_alloc_bytes`
  + `type`

  See Section 25.6.16.64, “The ndbinfo transporter_details Table”, for more information.

* **Binary log transaction cache sizing.** `NDB` 8.0.40 adds the `ndb_log_cache_size` server system variable, which makes it possible to set the size of the transaction cache used for writing the binary log. This enables use of a large cache for logging NDB transactions, and (using `binlog_cache_size`) a smaller cache for logging other transactions, thus making more efficient use of resources.

* **Ndb.cfg file deprecation.** Use of an `Ndb.cfg` file for setting the connection string for an NDB process was not well documented or supported. As of NDB 8.0.40, use of this file is now formally deprecated; you should expect support for it to be removed in a future release of MySQL Cluster.

MySQL Cluster Manager provides support for NDB Cluster 8.0. MySQL Cluster Manager has an advanced command-line interface that can simplify many complex NDB Cluster management tasks. See MySQL Cluster Manager 8.0.43 User Manual, for more information.


### 25.2.5 Options, Variables, and Parameters Added, Deprecated or Removed in NDB 8.0

* Parameters Introduced in NDB 8.0
* Parameters Deprecated in NDB 8.0
* Parameters Removed in NDB 8.0
* Options and Variables Introduced in NDB 8.0
* Options and Variables Deprecated in NDB 8.0
* Options and Variables Removed in NDB 8.0

The next few sections contain information about `NDB` node configuration parameters and NDB-specific **mysqld** options and variables that have been added to, deprecated in, or removed from NDB 8.0.

#### Parameters Introduced in NDB 8.0

The following node configuration parameters have been added in NDB 8.0.

* `AllowUnresolvedHostNames`: When false (default), failure by management node to resolve host name results in fatal error; when true, unresolved host names are reported as warnings only. Added in NDB 8.0.22.

* `ApiFailureHandlingTimeout`: Maximum time for API node failure handling before escalating. 0 means no time limit; minimum usable value is 10. Added in NDB 8.0.42.

* `AutomaticThreadConfig`: Use automatic thread configuration; overrides any settings for ThreadConfig and MaxNoOfExecutionThreads, and disables ClassicFragmentation. Added in NDB 8.0.23.

* `ClassicFragmentation`: When true, use traditional table fragmentation; set false to enable flexible distribution of fragments among LDMs. Disabled by AutomaticThreadConfig. Added in NDB 8.0.23.

* `DiskDataUsingSameDisk`: Set to false if Disk Data tablespaces are located on separate physical disks. Added in NDB 8.0.19.

* `EnableMultithreadedBackup`: Enable multi-threaded backup. Added in NDB 8.0.16.

* `EncryptedFileSystem`: Encrypt local checkpoint and tablespace files.. Added in NDB 8.0.29.

* `KeepAliveSendInterval`: Time between keep-alive signals on links between data nodes, in milliseconds. Set to 0 to disable. Added in NDB 8.0.27.

* `MaxDiskDataLatency`: Maximum allowed mean latency of disk access (ms) before starting to abort transactions. Added in NDB 8.0.19.

* `NodeGroupTransporters`: Number of transporters to use between nodes in same node group. Added in NDB 8.0.20.

* `NumCPUs`: Specify number of CPUs to use with AutomaticThreadConfig. Added in NDB 8.0.23.

* `PartitionsPerNode`: Determines the number of table partitions created on each data node; not used if ClassicFragmentation is enabled. Added in NDB 8.0.23.

* `PreferIPVersion`: Indicate DNS resolver preference for IP version 4 or 6. Added in NDB 8.0.26.

* `RequireEncryptedBackup`: Whether backups must be encrypted (1 = encryption required, otherwise 0). Added in NDB 8.0.22.

* `ReservedConcurrentIndexOperations`: Number of simultaneous index operations having dedicated resources on one data node. Added in NDB 8.0.16.

* `ReservedConcurrentOperations`: Number of simultaneous operations having dedicated resources in transaction coordinators on one data node. Added in NDB 8.0.16.

* `ReservedConcurrentScans`: Number of simultaneous scans having dedicated resources on one data node. Added in NDB 8.0.16.

* `ReservedConcurrentTransactions`: Number of simultaneous transactions having dedicated resources on one data node. Added in NDB 8.0.16.

* `ReservedFiredTriggers`: Number of triggers having dedicated resources on one data node. Added in NDB 8.0.16.

* `ReservedLocalScans`: Number of simultaneous fragment scans having dedicated resources on one data node. Added in NDB 8.0.16.

* `ReservedTransactionBufferMemory`: Dynamic buffer space (in bytes) for key and attribute data allocated to each data node. Added in NDB 8.0.16.

* `SpinMethod`: Determines spin method used by data node; see documentation for details. Added in NDB 8.0.20.

* `TcpSpinTime`: Time to spin before going to sleep when receiving. Added in NDB 8.0.20.

* `TransactionMemory`: Memory allocated for transactions on each data node. Added in NDB 8.0.19.

#### Parameters Deprecated in NDB 8.0

The following node configuration parameters have been deprecated in NDB 8.0.

* `BatchSizePerLocalScan`: Used to calculate number of lock records for scan with hold lock. Deprecated in NDB 8.0.19.

* `MaxAllocate`: No longer used; has no effect. Deprecated in NDB 8.0.27.

* `MaxNoOfConcurrentIndexOperations`: Total number of index operations that can execute simultaneously on one data node. Deprecated in NDB 8.0.19.

* `MaxNoOfConcurrentTransactions`: Maximum number of transactions executing concurrently on this data node, total number of transactions that can be executed concurrently is this value times number of data nodes in cluster. Deprecated in NDB 8.0.19.

* `MaxNoOfFiredTriggers`: Total number of triggers that can fire simultaneously on one data node. Deprecated in NDB 8.0.19.

* `MaxNoOfLocalOperations`: Maximum number of operation records defined on this data node. Deprecated in NDB 8.0.19.

* `MaxNoOfLocalScans`: Maximum number of fragment scans in parallel on this data node. Deprecated in NDB 8.0.19.

* `ReservedTransactionBufferMemory`: Dynamic buffer space (in bytes) for key and attribute data allocated to each data node. Deprecated in NDB 8.0.19.

* `UndoDataBuffer`: Unused; has no effect. Deprecated in NDB 8.0.27.

* `UndoIndexBuffer`: Unused; has no effect. Deprecated in NDB 8.0.27.

#### Parameters Removed in NDB 8.0

No node configuration parameters have been removed in NDB 8.0.

#### Options and Variables Introduced in NDB 8.0

The following system variables, status variables, and server options have been added in NDB 8.0.

* `Ndb_api_adaptive_send_deferred_count_replica`: Number of adaptive send calls not actually sent by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_adaptive_send_forced_count_replica`: Number of adaptive sends with forced-send set sent by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_adaptive_send_unforced_count_replica`: Number of adaptive sends without forced-send sent by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_bytes_received_count_replica`: Quantity of data (in bytes) received from data nodes by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_bytes_sent_count_replica`: Qunatity of data (in bytes) sent to data nodes by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_pk_op_count_replica`: Number of operations based on or using primary keys by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_pruned_scan_count_replica`: Number of scans that have been pruned to one partition by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_range_scan_count_replica`: Number of range scans that have been started by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_read_row_count_replica`: Total number of rows that have been read by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_scan_batch_count_replica`: Number of batches of rows received by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_table_scan_count_replica`: Number of table scans that have been started, including scans of internal tables, by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_abort_count_replica`: Number of transactions aborted by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_close_count_replica`: Number of transactions aborted (may be greater than sum of TransCommitCount and TransAbortCount) by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_commit_count_replica`: Number of transactions committed by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_local_read_row_count_replica`: Total number of rows that have been read by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_start_count_replica`: Number of transactions started by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_uk_op_count_replica`: Number of operations based on or using unique keys by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_wait_exec_complete_count_replica`: Number of times thread has been blocked while waiting for operation execution to complete by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_wait_meta_request_count_replica`: Number of times thread has been blocked waiting for metadata-based signal by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_wait_nanos_count_replica`: Total time (in nanoseconds) spent waiting for some type of signal from data nodes by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_wait_scan_result_count_replica`: Number of times thread has been blocked while waiting for scan-based signal by this replica. Added in NDB 8.0.23-ndb-8.0.23.

* `Ndb_config_generation`: Generation number of the current configuration of the cluster. Added in NDB 8.0.24-ndb-8.0.24.

* `Ndb_conflict_fn_max_del_win_ins`: Number of times that NDB replication conflict resolution based on outcome of NDB$MAX_DEL_WIN_INS() has been applied to insert operations. Added in NDB 8.0.30-ndb-8.0.30.

* `Ndb_conflict_fn_max_ins`: Number of times that NDB replication conflict resolution based on "greater timestamp wins" has been applied to insert operations. Added in NDB 8.0.30-ndb-8.0.30.

* `Ndb_fetch_table_stats`: Number of times table statistics were fetched from tables rather than cache. Added in NDB 8.0.27-ndb-8.0.27.

* `Ndb_metadata_blacklist_size`: Number of NDB metadata objects that NDB binlog thread has failed to synchronize; renamed in NDB 8.0.22 as Ndb_metadata_excluded_count. Added in NDB 8.0.18-ndb-8.0.18.

* `Ndb_metadata_detected_count`: Number of times NDB metadata change monitor thread has detected changes. Added in NDB 8.0.16-ndb-8.0.16.

* `Ndb_metadata_excluded_count`: Number of NDB metadata objects that NDB binlog thread has failed to synchronize. Added in NDB 8.0.18-ndb-8.0.22.

* `Ndb_metadata_synced_count`: Number of NDB metadata objects which have been synchronized. Added in NDB 8.0.18-ndb-8.0.18.

* `Ndb_trans_hint_count_session`: Number of transactions using hints that have been started in this session. Added in NDB 8.0.17-ndb-8.0.17.

* `ndb-applier-allow-skip-epoch`: Lets replication applier skip epochs. Added in NDB 8.0.28-ndb-8.0.28.

* `ndb-log-fail-terminate`: Terminate mysqld process if complete logging of all found row events is not possible. Added in NDB 8.0.21-ndb-8.0.21.

* `ndb-log-transaction-dependency`: Make binary log thread calculate transaction dependencies for every transaction it writes to binary log. Added in NDB 8.0.33-ndb-8.0.33.

* `ndb-schema-dist-timeout`: How long to wait before detecting timeout during schema distribution. Added in NDB 8.0.17-ndb-8.0.17.

* `ndb_conflict_role`: Role for replica to play in conflict detection and resolution. Value is one of PRIMARY, SECONDARY, PASS, or NONE (default). Can be changed only when replication SQL thread is stopped. See documentation for further information. Added in NDB 8.0.23-ndb-8.0.23.

* `ndb_dbg_check_shares`: Check for any lingering shares (debug builds only). Added in NDB 8.0.13-ndb-8.0.13.

* `ndb_log_transaction_compression`: Whether to compress NDB binary log; can also be enabled on startup by enabling --binlog-transaction-compression option. Added in NDB 8.0.31-ndb-8.0.31.

* `ndb_log_transaction_compression_level_zstd`: The ZSTD compression level to use when writing compressed transactions to the NDB binary log. Added in NDB 8.0.31-ndb-8.0.31.

* `ndb_metadata_check`: Enable auto-detection of NDB metadata changes with respect to MySQL data dictionary; enabled by default. Added in NDB 8.0.16-ndb-8.0.16.

* `ndb_metadata_check_interval`: Interval in seconds to perform check for NDB metadata changes with respect to MySQL data dictionary. Added in NDB 8.0.16-ndb-8.0.16.

* `ndb_metadata_sync`: Triggers immediate synchronization of all changes between NDB dictionary and MySQL data dictionary; causes ndb_metadata_check and ndb_metadata_check_interval values to be ignored. Resets to false when synchronization is complete. Added in NDB 8.0.19-ndb-8.0.19.

* `ndb_replica_batch_size`: Batch size in bytes for replica applier. Added in NDB 8.0.30-ndb-8.0.30.

* `ndb_schema_dist_lock_wait_timeout`: Time during schema distribution to wait for lock before returning error. Added in NDB 8.0.18-ndb-8.0.18.

* `ndb_schema_dist_timeout`: Time to wait before detecting timeout during schema distribution. Added in NDB 8.0.16-ndb-8.0.16.

* `ndb_schema_dist_upgrade_allowed`: Allow schema distribution table upgrade when connecting to NDB. Added in NDB 8.0.17-ndb-8.0.17.

* `ndbinfo`: Enable ndbinfo plugin, if supported. Added in NDB 8.0.13-ndb-8.0.13.

* `replica_allow_batching`: Turns update batching on and off for replica. Added in NDB 8.0.26-ndb-8.0.26.

#### Options and Variables Deprecated in NDB 8.0

The following system variables, status variables, and options have been deprecated in NDB 8.0.

* `Ndb_api_adaptive_send_deferred_count_slave`: Number of adaptive send calls not actually sent by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_adaptive_send_forced_count_slave`: Number of adaptive sends with forced-send set sent by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_adaptive_send_unforced_count_slave`: Number of adaptive sends without forced-send sent by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_bytes_received_count_slave`: Quantity of data (in bytes) received from data nodes by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_bytes_sent_count_slave`: Qunatity of data (in bytes) sent to data nodes by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_pk_op_count_slave`: Number of operations based on or using primary keys by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_pruned_scan_count_slave`: Number of scans that have been pruned to one partition by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_range_scan_count_slave`: Number of range scans that have been started by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_read_row_count_slave`: Total number of rows that have been read by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_scan_batch_count_slave`: Number of batches of rows received by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_table_scan_count_slave`: Number of table scans that have been started, including scans of internal tables, by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_abort_count_slave`: Number of transactions aborted by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_close_count_slave`: Number of transactions aborted (may be greater than sum of TransCommitCount and TransAbortCount) by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_commit_count_slave`: Number of transactions committed by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_local_read_row_count_slave`: Total number of rows that have been read by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_trans_start_count_slave`: Number of transactions started by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_uk_op_count_slave`: Number of operations based on or using unique keys by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_wait_exec_complete_count_slave`: Number of times thread has been blocked while waiting for operation execution to complete by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_wait_meta_request_count_slave`: Number of times thread has been blocked waiting for metadata-based signal by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_wait_nanos_count_slave`: Total time (in nanoseconds) spent waiting for some type of signal from data nodes by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_api_wait_scan_result_count_slave`: Number of times thread has been blocked while waiting for scan-based signal by this replica. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `Ndb_metadata_blacklist_size`: Number of NDB metadata objects that NDB binlog thread has failed to synchronize; renamed in NDB 8.0.22 as Ndb_metadata_excluded_count. Deprecated in NDB 8.0.21-ndb-8.0.21.

* `Ndb_replica_max_replicated_epoch`: Most recently committed NDB epoch on this replica. When this value is greater than or equal to Ndb_conflict_last_conflict_epoch, no conflicts have yet been detected. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `ndb_slave_conflict_role`: Role for replica to play in conflict detection and resolution. Value is one of PRIMARY, SECONDARY, PASS, or NONE (default). Can be changed only when replication SQL thread is stopped. See documentation for further information. Deprecated in NDB 8.0.23-ndb-8.0.23.

* `slave_allow_batching`: Turns update batching on and off for replica. Deprecated in NDB 8.0.26-ndb-8.0.26.

#### Options and Variables Removed in NDB 8.0

The following system variables, status variables, and options have been removed in NDB 8.0.

* `Ndb_metadata_blacklist_size`: Number of NDB metadata objects that NDB binlog thread has failed to synchronize; renamed in NDB 8.0.22 as Ndb_metadata_excluded_count. Removed in NDB 8.0.22-ndb-8.0.22.


### 25.2.6 MySQL Server Using InnoDB Compared with NDB Cluster

MySQL Server offers a number of choices in storage engines. Since both `NDB` and `InnoDB` can serve as transactional MySQL storage engines, users of MySQL Server sometimes become interested in NDB Cluster. They see `NDB` as a possible alternative or upgrade to the default `InnoDB` storage engine in MySQL 8.0. While `NDB` and `InnoDB` share common characteristics, there are differences in architecture and implementation, so that some existing MySQL Server applications and usage scenarios can be a good fit for NDB Cluster, but not all of them.

In this section, we discuss and compare some characteristics of the `NDB` storage engine used by NDB 8.0 with `InnoDB` used in MySQL 8.0. The next few sections provide a technical comparison. In many instances, decisions about when and where to use NDB Cluster must be made on a case-by-case basis, taking all factors into consideration. While it is beyond the scope of this documentation to provide specifics for every conceivable usage scenario, we also attempt to offer some very general guidance on the relative suitability of some common types of applications for `NDB` as opposed to `InnoDB` back ends.

NDB Cluster 8.0 uses a **mysqld** based on MySQL 8.0, including support for `InnoDB` 1.1. While it is possible to use `InnoDB` tables with NDB Cluster, such tables are not clustered. It is also not possible to use programs or libraries from an NDB Cluster 8.0 distribution with MySQL Server 8.0, or the reverse.

While it is also true that some types of common business applications can be run either on NDB Cluster or on MySQL Server (most likely using the `InnoDB` storage engine), there are some important architectural and implementation differences. Section 25.2.6.1, “Differences Between the NDB and InnoDB Storage Engines”, provides a summary of the these differences. Due to the differences, some usage scenarios are clearly more suitable for one engine or the other; see Section 25.2.6.2, “NDB and InnoDB Workloads”. This in turn has an impact on the types of applications that better suited for use with `NDB` or `InnoDB`. See Section 25.2.6.3, “NDB and InnoDB Feature Usage Summary”, for a comparison of the relative suitability of each for use in common types of database applications.

For information about the relative characteristics of the `NDB` and `MEMORY` storage engines, see When to Use MEMORY or NDB Cluster.

See Chapter 18, *Alternative Storage Engines*, for additional information about MySQL storage engines.


#### 25.2.6.1 Differences Between the NDB and InnoDB Storage Engines

The `NDB` storage engine is implemented using a distributed, shared-nothing architecture, which causes it to behave differently from `InnoDB` in a number of ways. For those unaccustomed to working with `NDB`, unexpected behaviors can arise due to its distributed nature with regard to transactions, foreign keys, table limits, and other characteristics. These are shown in the following table:

**Table 25.2 Differences between InnoDB and NDB storage engines**

<table><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Feature</th> <th scope="col"><code>InnoDB</code> (MySQL 8.0)</th> <th scope="col"><code>NDB</code> 8.0</th> </tr></thead><tbody><tr> <th scope="row">MySQL Server Version</th> <td>8.0</td> <td>8.0</td> </tr><tr> <th scope="row"><code>InnoDB</code> Version</th> <td><code>InnoDB</code> 8.0.44</td> <td><code>InnoDB</code> 8.0.44</td> </tr><tr> <th scope="row">NDB Cluster Version</th> <td>N/A</td> <td><code>NDB</code> 8.0.44/8.0.44</td> </tr><tr> <th scope="row">Storage Limits</th> <td>64TB</td> <td>128TB</td> </tr><tr> <th scope="row">Foreign Keys</th> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row">Transactions</th> <td>All standard types</td> <td><code>READ COMMITTED</code></td> </tr><tr> <th scope="row">MVCC</th> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row">Data Compression</th> <td>Yes</td> <td>No (NDB checkpoint and backup files can be compressed)</td> </tr><tr> <th scope="row">Large Row Support (&gt; 14K)</th> <td>Supported for <code>VARBINARY</code>, <code>VARCHAR</code>, <code>BLOB</code>, and <code>TEXT</code> columns</td> <td>Supported for <code>BLOB</code> and <code>TEXT</code> columns only (Using these types to store very large amounts of data can lower NDB performance)</td> </tr><tr> <th scope="row">Replication Support</th> <td>Asynchronous and semisynchronous replication using MySQL Replication; MySQL <a class="link" href="group-replication.html" title="Chapter 20 Group Replication">Group Replication</a></td> <td>Automatic synchronous replication within an NDB Cluster; asynchronous replication between NDB Clusters, using MySQL Replication (Semisynchronous replication is not supported)</td> </tr><tr> <th scope="row">Scaleout for Read Operations</th> <td>Yes (MySQL Replication)</td> <td>Yes (Automatic partitioning in NDB Cluster; NDB Cluster Replication)</td> </tr><tr> <th scope="row">Scaleout for Write Operations</th> <td>Requires application-level partitioning (sharding)</td> <td>Yes (Automatic partitioning in NDB Cluster is transparent to applications)</td> </tr><tr> <th scope="row">High Availability (HA)</th> <td>Built-in, from InnoDB cluster</td> <td>Yes (Designed for 99.999% uptime)</td> </tr><tr> <th scope="row">Node Failure Recovery and Failover</th> <td>From MySQL Group Replication</td> <td>Automatic (Key element in NDB architecture)</td> </tr><tr> <th scope="row">Time for Node Failure Recovery</th> <td>30 seconds or longer</td> <td>Typically &lt; 1 second</td> </tr><tr> <th scope="row">Real-Time Performance</th> <td>No</td> <td>Yes</td> </tr><tr> <th scope="row">In-Memory Tables</th> <td>No</td> <td>Yes (Some data can optionally be stored on disk; both in-memory and disk data storage are durable)</td> </tr><tr> <th scope="row">NoSQL Access to Storage Engine</th> <td>Yes</td> <td>Yes (Multiple APIs, including Memcached, Node.js/JavaScript, Java, JPA, C++, and HTTP/REST)</td> </tr><tr> <th scope="row">Concurrent and Parallel Writes</th> <td>Yes</td> <td>Up to 48 writers, optimized for concurrent writes</td> </tr><tr> <th scope="row">Conflict Detection and Resolution (Multiple Sources)</th> <td>Yes (MySQL Group Replication)</td> <td>Yes</td> </tr><tr> <th scope="row">Hash Indexes</th> <td>No</td> <td>Yes</td> </tr><tr> <th scope="row">Online Addition of Nodes</th> <td>Read/write replicas using MySQL Group Replication</td> <td>Yes (all node types)</td> </tr><tr> <th scope="row">Online Upgrades</th> <td>Yes (using replication)</td> <td>Yes</td> </tr><tr> <th scope="row">Online Schema Modifications</th> <td>Yes, as part of MySQL 8.0</td> <td>Yes</td> </tr></tbody></table>


#### 25.2.6.2 NDB and InnoDB Workloads

NDB Cluster has a range of unique attributes that make it ideal to serve applications requiring high availability, fast failover, high throughput, and low latency. Due to its distributed architecture and multi-node implementation, NDB Cluster also has specific constraints that may keep some workloads from performing well. A number of major differences in behavior between the `NDB` and `InnoDB` storage engines with regard to some common types of database-driven application workloads are shown in the following table::

**Table 25.3 Differences between InnoDB and NDB storage engines, common types of data-driven application workloads.**

<table><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Workload</th> <th scope="col"><code>InnoDB</code></th> <th scope="col">NDB Cluster (<code>NDB</code>)</th> </tr></thead><tbody><tr> <th scope="row">High-Volume OLTP Applications</th> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row">DSS Applications (data marts, analytics)</th> <td>Yes</td> <td>Limited (Join operations across OLTP datasets not exceeding 3TB in size)</td> </tr><tr> <th scope="row">Custom Applications</th> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row">Packaged Applications</th> <td>Yes</td> <td>Limited (should be mostly primary key access); NDB Cluster 8.0 supports foreign keys</td> </tr><tr> <th scope="row">In-Network Telecoms Applications (HLR, HSS, SDP)</th> <td>No</td> <td>Yes</td> </tr><tr> <th scope="row">Session Management and Caching</th> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row">E-Commerce Applications</th> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row">User Profile Management, AAA Protocol</th> <td>Yes</td> <td>Yes</td> </tr></tbody></table>


#### 25.2.6.3 NDB and InnoDB Feature Usage Summary

When comparing application feature requirements to the capabilities of `InnoDB` with `NDB`, some are clearly more compatible with one storage engine than the other.

The following table lists supported application features according to the storage engine to which each feature is typically better suited.

**Table 25.4 Supported application features according to the storage engine to which each feature is typically better suited**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Preferred application requirements for <code>InnoDB</code></th> <th>Preferred application requirements for <code>NDB</code></th> </tr></thead><tbody><tr> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> Foreign keys </p> <div class="note" style="margin-left: 0.5in; margin-right: 0.5in;"> <div class="admon-title"> Note </div> <p> NDB Cluster 8.0 supports foreign keys </p> </div> </li><li class="listitem"><p> Full table scans </p></li><li class="listitem"><p> Very large databases, rows, or transactions </p></li><li class="listitem"><p> Transactions other than <code>READ COMMITTED</code> </p></li></ul> </div> </td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> Write scaling </p></li><li class="listitem"><p> 99.999% uptime </p></li><li class="listitem"><p> Online addition of nodes and online schema operations </p></li><li class="listitem"><p> Multiple SQL and NoSQL APIs (see NDB Cluster APIs: Overview and Concepts) </p></li><li class="listitem"><p> Real-time performance </p></li><li class="listitem"><p> Limited use of <code>BLOB</code> columns </p></li><li class="listitem"><p> Foreign keys are supported, although their use may have an impact on performance at high throughput </p></li></ul> </div> </td> </tr></tbody></table>


### 25.2.7 Known Limitations of NDB Cluster

In the sections that follow, we discuss known limitations in current releases of NDB Cluster as compared with the features available when using the `MyISAM` and `InnoDB` storage engines. If you check the “Cluster” category in the MySQL bugs database at <http://bugs.mysql.com>, you can find known bugs in the following categories under “MySQL Server:” in the MySQL bugs database at <http://bugs.mysql.com>, which we intend to correct in upcoming releases of NDB Cluster:

* NDB Cluster
* Cluster Direct API (NDBAPI)
* Cluster Disk Data
* Cluster Replication
* ClusterJ

This information is intended to be complete with respect to the conditions just set forth. You can report any discrepancies that you encounter to the MySQL bugs database using the instructions given in Section 1.5, “How to Report Bugs or Problems”. Any problem which we do not plan to fix in NDB Cluster 8.0, is added to the list.

See Section 25.2.7.11, “Previous NDB Cluster Issues Resolved in NDB Cluster 8.0” for a list of issues in earlier releases that have been resolved in NDB Cluster 8.0.

Note

Limitations and other issues specific to NDB Cluster Replication are described in Section 25.7.3, “Known Issues in NDB Cluster Replication”.


#### 25.2.7.1 Noncompliance with SQL Syntax in NDB Cluster

Some SQL statements relating to certain MySQL features produce errors when used with `NDB` tables, as described in the following list:

* **Temporary tables.** Temporary tables are not supported. Trying either to create a temporary table that uses the `NDB` storage engine or to alter an existing temporary table to use `NDB` fails with the error Table storage engine 'ndbcluster' does not support the create option 'TEMPORARY'.

* **Indexes and keys in NDB tables.** Keys and indexes on NDB Cluster tables are subject to the following limitations:

  + **Column width.** Attempting to create an index on an `NDB` table column whose width is greater than 3072 bytes is rejected with `ER_TOO_LONG_KEY`: Specified key was too long; max key length is 3072 bytes.

    Attempting to create an index on an `NDB` table column whose width is greater than 3056 bytes succeeds with a warning. In such cases, statistical information is not generated, which means a nonoptimal execution plan may be selected. For this reason, you should consider making the index length shorter than 3056 bytes if possible.

  + **TEXT and BLOB columns.** You cannot create indexes on `NDB` table columns that use any of the `TEXT` or `BLOB` data types.

  + **FULLTEXT indexes.** The `NDB` storage engine does not support `FULLTEXT` indexes, which are possible for `MyISAM` and `InnoDB` tables only.

    However, you can create indexes on `VARCHAR` columns of `NDB` tables.

  + **USING HASH keys and NULL.** Using nullable columns in unique keys and primary keys means that queries using these columns are handled as full table scans. To work around this issue, make the column `NOT NULL`, or re-create the index without the `USING HASH` option.

  + **Prefixes.** There are no prefix indexes; only entire columns can be indexed. (The size of an `NDB` column index is always the same as the width of the column in bytes, up to and including 3072 bytes, as described earlier in this section. Also see Section 25.2.7.6, “Unsupported or Missing Features in NDB Cluster”, for additional information.)

  + **BIT columns.** A `BIT` column cannot be a primary key, unique key, or index, nor can it be part of a composite primary key, unique key, or index.

  + **AUTO_INCREMENT columns.** Like other MySQL storage engines, the `NDB` storage engine can handle a maximum of one `AUTO_INCREMENT` column per table, and this column must be indexed. However, in the case of an NDB table with no explicit primary key, an `AUTO_INCREMENT` column is automatically defined and used as a “hidden” primary key. For this reason, you cannot create an `NDB` table having an `AUTO_INCREMENT` column and no explicit primary key.

    The following [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") statements do not work, as shown here:

    ```
    # No index on AUTO_INCREMENT column; table has no primary key
    # Raises ER_WRONG_AUTO_KEY
    mysql> CREATE TABLE n (
        ->     a INT,
        ->     b INT AUTO_INCREMENT
        ->     )
        -> ENGINE=NDB;
    ERROR 1075 (42000): Incorrect table definition; there can be only one auto
    column and it must be defined as a key

    # Index on AUTO_INCREMENT column; table has no primary key
    # Raises NDB error 4335
    mysql> CREATE TABLE n (
        ->     a INT,
        ->     b INT AUTO_INCREMENT,
        ->     KEY k (b)
        ->     )
        -> ENGINE=NDB;
    ERROR 1296 (HY000): Got error 4335 'Only one autoincrement column allowed per
    table. Having a table without primary key uses an autoincr' from NDBCLUSTER
    ```

    The following statement creates a table with a primary key, an `AUTO_INCREMENT` column, and an index on this column, and succeeds:

    ```
    # Index on AUTO_INCREMENT column; table has a primary key
    mysql> CREATE TABLE n (
        ->     a INT PRIMARY KEY,
        ->     b INT AUTO_INCREMENT,
        ->     KEY k (b)
        ->     )
        -> ENGINE=NDB;
    Query OK, 0 rows affected (0.38 sec)
    ```

* **Restrictions on foreign keys.** Support for foreign key constraints in NDB 8.0 is comparable to that provided by `InnoDB`, subject to the following restrictions:

  + Every column referenced as a foreign key requires an explicit unique key, if it is not the table's primary key.

  + `ON UPDATE CASCADE` is not supported when the reference is to the parent table's primary key.

    This is because an update of a primary key is implemented as a delete of the old row (containing the old primary key) plus an insert of the new row (with a new primary key). This is not visible to the `NDB` kernel, which views these two rows as being the same, and thus has no way of knowing that this update should be cascaded.

  + `ON DELETE CASCADE` is also not supported where the child table contains one or more columns of any of the `TEXT` or `BLOB` types. (Bug #89511, Bug #27484882)

  + `SET DEFAULT` is not supported. (Also not supported by `InnoDB`.)

  + The `NO ACTION` keyword is accepted but treated as `RESTRICT`. `NO ACTION`, which is a standard SQL keyword, is the default in MySQL 8.0. (Also the same as with `InnoDB`.)

  + In earlier versions of NDB Cluster, when creating a table with foreign key referencing an index in another table, it sometimes appeared possible to create the foreign key even if the order of the columns in the indexes did not match, due to the fact that an appropriate error was not always returned internally. A partial fix for this issue improved the error used internally to work in most cases; however, it remains possible for this situation to occur in the event that the parent index is a unique index. (Bug #18094360)

  For more information, see Section 15.1.20.5, “FOREIGN KEY Constraints”, and Section 1.6.3.2, “FOREIGN KEY Constraints”.

* **NDB Cluster and geometry data types.** Geometry data types (`WKT` and `WKB`) are supported for `NDB` tables. However, spatial indexes are not supported.

* **Character sets and binary log files.** Currently, the `ndb_apply_status` and `ndb_binlog_index` tables are created using the `latin1` (ASCII) character set. Because names of binary logs are recorded in this table, binary log files named using non-Latin characters are not referenced correctly in these tables. This is a known issue, which we are working to fix. (Bug #50226)

  To work around this problem, use only Latin-1 characters when naming binary log files or setting any the `--basedir`, `--log-bin`, or `--log-bin-index` options.

* **Creating NDB tables with user-defined partitioning.**

  Support for user-defined partitioning in NDB Cluster is restricted to [`LINEAR`] `KEY` partitioning. Using any other partitioning type with `ENGINE=NDB` or `ENGINE=NDBCLUSTER` in a `CREATE TABLE` statement results in an error.

  It is possible to override this restriction, but doing so is not supported for use in production settings. For details, see User-defined partitioning and the NDB storage engine (NDB Cluster)").

  **Default partitioning scheme.** All NDB Cluster tables are by default partitioned by `KEY` using the table's primary key as the partitioning key. If no primary key is explicitly set for the table, the “hidden” primary key automatically created by the `NDB` storage engine is used instead. For additional discussion of these and related issues, see Section 26.2.5, “KEY Partitioning”.

  `CREATE TABLE` and `ALTER TABLE` statements that would cause a user-partitioned `NDBCLUSTER` table not to meet either or both of the following two requirements are not permitted, and fail with an error:

  1. The table must have an explicit primary key.
  2. All columns listed in the table's partitioning expression must be part of the primary key.

  **Exception.** If a user-partitioned `NDBCLUSTER` table is created using an empty column-list (that is, using `PARTITION BY [LINEAR] KEY()`), then no explicit primary key is required.

  **Maximum number of partitions for NDBCLUSTER tables.** The maximum number of partitions that can defined for a `NDBCLUSTER` table when employing user-defined partitioning is 8 per node group. (See Section 25.2.2, “NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions”, for more information about NDB Cluster node groups.

  **DROP PARTITION not supported.** It is not possible to drop partitions from `NDB` tables using `ALTER TABLE ... DROP PARTITION`. The other partitioning extensions to [`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement")—`ADD PARTITION`, `REORGANIZE PARTITION`, and `COALESCE PARTITION`—are supported for NDB tables, but use copying and so are not optimized. See Section 26.3.1, “Management of RANGE and LIST Partitions” and Section 15.1.9, “ALTER TABLE Statement”.

  **Partition selection.** Partition selection is not supported for `NDB` tables. See Section 26.5, “Partition Selection”, for more information.

* **JSON data type.** The MySQL `JSON` data type is supported for `NDB` tables in the **mysqld** supplied with NDB 8.0.

  An `NDB` table can have a maximum of 3 `JSON` columns.

  The NDB API has no special provision for working with `JSON` data, which it views simply as `BLOB` data. Handling data as `JSON` must be performed by the application.

* **DEFAULT value expressions.** Explicit default value expressions (as implemented in MySQL 8.0.34 and later) for `NDB` table column definitions are not supported. This means that, for example, the following [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") statement is rejected with an error:

  ```
  mysql> CREATE TABLE t (
      ->   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      ->   cf FLOAT DEFAULT (RAND() * 10)
      -> ) ENGINE=NDBCLUSTER;
  ERROR 3774 (HY000): 'Specified storage engine' is not supported for default value expressions.
  ```

  NDB Cluster does support literal default column values, as shown here:

  ```
  mysql> CREATE TABLE t3 (
      ->   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      ->   ci INT DEFAULT 0,
      ->   cv VARCHAR(20) DEFAULT ''
      -> ) ENGINE=NDBCLUSTER;
  Query OK, 0 rows affected (0.17 sec)
  ```

  For more information, see Section 13.6, “Data Type Default Values”.


#### 25.2.7.2 Limits and Differences of NDB Cluster from Standard MySQL Limits

In this section, we list limits found in NDB Cluster that either differ from limits found in, or that are not found in, standard MySQL.

**Memory usage and recovery.** Memory consumed when data is inserted into an `NDB` table is not automatically recovered when deleted, as it is with other storage engines. Instead, the following rules hold true:

* A `DELETE` statement on an `NDB` table makes the memory formerly used by the deleted rows available for re-use by inserts on the same table only. However, this memory can be made available for general re-use by performing `OPTIMIZE TABLE`.

  A rolling restart of the cluster also frees any memory used by deleted rows. See Section 25.6.5, “Performing a Rolling Restart of an NDB Cluster”.

* A `DROP TABLE` or `TRUNCATE TABLE` operation on an `NDB` table frees the memory that was used by this table for re-use by any `NDB` table, either by the same table or by another `NDB` table.

  Note

  Recall that `TRUNCATE TABLE` drops and re-creates the table. See Section 15.1.37, “TRUNCATE TABLE Statement”.

* **Limits imposed by the cluster's configuration.** A number of hard limits exist which are configurable, but available main memory in the cluster sets limits. See the complete list of configuration parameters in Section 25.4.3, “NDB Cluster Configuration Files”. Most configuration parameters can be upgraded online. These hard limits include:

  + Database memory size and index memory size (`DataMemory` and `IndexMemory`, respectively).

    `DataMemory` is allocated as 32KB pages. As each `DataMemory` page is used, it is assigned to a specific table; once allocated, this memory cannot be freed except by dropping the table.

    See Section 25.4.3.6, “Defining NDB Cluster Data Nodes”, for more information.

  + The maximum number of operations that can be performed per transaction is set using the configuration parameters `MaxNoOfConcurrentOperations` and `MaxNoOfLocalOperations`.

    Note

    Bulk loading, [`TRUNCATE TABLE`](truncate-table.html "15.1.37 TRUNCATE TABLE Statement"), and [`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement") are handled as special cases by running multiple transactions, and so are not subject to this limitation.

  + Different limits related to tables and indexes. For example, the maximum number of ordered indexes in the cluster is determined by `MaxNoOfOrderedIndexes`, and the maximum number of ordered indexes per table is 16.

* **Node and data object maximums.** The following limits apply to numbers of cluster nodes and metadata objects:

  + The maximum number of data nodes is 144. (In NDB 7.6 and earlier, this was 48.)

    A data node must have a node ID in the range of 1 to 144, inclusive.

    Management and API nodes may use node IDs in the range 1 to 255, inclusive.

  + The total maximum number of nodes in an NDB Cluster is
    255. This number includes all SQL nodes (MySQL Servers), API nodes (applications accessing the cluster other than MySQL servers), data nodes, and management servers.

  + The maximum number of metadata objects in current versions of NDB Cluster is 20320. This limit is hard-coded.

  See Section 25.2.7.11, “Previous NDB Cluster Issues Resolved in NDB Cluster 8.0”, for more information.


#### 25.2.7.3 Limits Relating to Transaction Handling in NDB Cluster

A number of limitations exist in NDB Cluster with regard to the handling of transactions. These include the following:

* **Transaction isolation level.**

  The `NDBCLUSTER` storage engine supports only the [`READ COMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-committed) transaction isolation level. (`InnoDB`, for example, supports `READ COMMITTED`, `READ UNCOMMITTED`, `REPEATABLE READ`, and `SERIALIZABLE`.) You should keep in mind that `NDB` implements `READ COMMITTED` on a per-row basis; when a read request arrives at the data node storing the row, what is returned is the last committed version of the row at that time.

  Uncommitted data is never returned, but when a transaction modifying a number of rows commits concurrently with a transaction reading the same rows, the transaction performing the read can observe “before” values, “after” values, or both, for different rows among these, due to the fact that a given row read request can be processed either before or after the commit of the other transaction.

  To ensure that a given transaction reads only before or after values, you can impose row locks using [`SELECT ... LOCK IN SHARE MODE`](select.html "15.2.13 SELECT Statement"). In such cases, the lock is held until the owning transaction is committed. Using row locks can also cause the following issues:

  + Increased frequency of lock wait timeout errors, and reduced concurrency

  + Increased transaction processing overhead due to reads requiring a commit phase

  + Possibility of exhausting the available number of concurrent locks, which is limited by `MaxNoOfConcurrentOperations`

  `NDB` uses `READ COMMITTED` for all reads unless a modifier such as `LOCK IN SHARE MODE` or `FOR UPDATE` is used. `LOCK IN SHARE MODE` causes shared row locks to be used; `FOR UPDATE` causes exclusive row locks to be used. Unique key reads have their locks upgraded automatically by `NDB` to ensure a self-consistent read; `BLOB` reads also employ extra locking for consistency.

  See Section 25.6.8.4, “NDB Cluster Backup Troubleshooting”, for information on how NDB Cluster's implementation of transaction isolation level can affect backup and restoration of `NDB` databases.

* **Transactions and BLOB or TEXT columns.** `NDBCLUSTER` stores only part of a column value that uses any of MySQL's `BLOB` or `TEXT` data types in the table visible to MySQL; the remainder of the `BLOB` or `TEXT` is stored in a separate internal table that is not accessible to MySQL. This gives rise to two related issues of which you should be aware whenever executing `SELECT` statements on tables that contain columns of these types:

  1. For any `SELECT` from an NDB Cluster table: If the `SELECT` includes a `BLOB` or `TEXT` column, the `READ COMMITTED` transaction isolation level is converted to a read with read lock. This is done to guarantee consistency.

  2. For any `SELECT` which uses a unique key lookup to retrieve any columns that use any of the `BLOB` or `TEXT` data types and that is executed within a transaction, a shared read lock is held on the table for the duration of the transaction—that is, until the transaction is either committed or aborted.

     This issue does not occur for queries that use index or table scans, even against `NDB` tables having `BLOB` or `TEXT` columns.

     For example, consider the table `t` defined by the following [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") statement:

     ```
     CREATE TABLE t (
         a INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
         b INT NOT NULL,
         c INT NOT NULL,
         d TEXT,
         INDEX i(b),
         UNIQUE KEY u(c)
     ) ENGINE = NDB,
     ```

     The following query on `t` causes a shared read lock, because it uses a unique key lookup:

     ```
     SELECT * FROM t WHERE c = 1;
     ```

     However, none of the four queries shown here causes a shared read lock:

     ```
     SELECT * FROM t WHERE b = 1;

     SELECT * FROM t WHERE d = '1';

     SELECT * FROM t;

     SELECT b,c WHERE a = 1;
     ```

     This is because, of these four queries, the first uses an index scan, the second and third use table scans, and the fourth, while using a primary key lookup, does not retrieve the value of any `BLOB` or `TEXT` columns.

     You can help minimize issues with shared read locks by avoiding queries that use unique key lookups that retrieve `BLOB` or `TEXT` columns, or, in cases where such queries are not avoidable, by committing transactions as soon as possible afterward.

* **Unique key lookups and transaction isolation.** Unique indexes are implemented in `NDB` using a hidden index table which is maintained internally. When a user-created `NDB` table is accessed using a unique index, the hidden index table is first read to find the primary key that is then used to read the user-created table. To avoid modification of the index during this double-read operation, the row found in the hidden index table is locked. When a row referenced by a unique index in the user-created `NDB` table is updated, the hidden index table is subject to an exclusive lock by the transaction in which the update is performed. This means that any read operation on the same (user-created) `NDB` table must wait for the update to complete. This is true even when the transaction level of the read operation is `READ COMMITTED`.

  One workaround which can be used to bypass potentially blocking reads is to force the SQL node to ignore the unique index when performing the read. This can be done by using the `IGNORE INDEX` index hint as part of the `SELECT` statement reading the table (see Section 10.9.4, “Index Hints”). Because the MySQL server creates a shadowing ordered index for every unique index created in `NDB`, this lets the ordered index be read instead, and avoids unique index access locking. The resulting read is as consistent as a committed read by primary key, returning the last committed value at the time the row is read.

  Reading via an ordered index makes less efficient use of resources in the cluster, and may have higher latency.

  It is also possible to avoid using the unique index for access by querying for ranges rather than for unique values.

* **Rollbacks.** There are no partial transactions, and no partial rollbacks of transactions. A duplicate key or similar error causes the entire transaction to be rolled back.

  This behavior differs from that of other transactional storage engines such as `InnoDB` that may roll back individual statements.

* **Transactions and memory usage.** As noted elsewhere in this chapter, NDB Cluster does not handle large transactions well; it is better to perform a number of small transactions with a few operations each than to attempt a single large transaction containing a great many operations. Among other considerations, large transactions require very large amounts of memory. Because of this, the transactional behavior of a number of MySQL statements is affected as described in the following list:

  + `TRUNCATE TABLE` is not transactional when used on `NDB` tables. If a `TRUNCATE TABLE` fails to empty the table, then it must be re-run until it is successful.

  + `DELETE FROM` (even with no `WHERE` clause) *is* transactional. For tables containing a great many rows, you may find that performance is improved by using several `DELETE FROM ... LIMIT ...` statements to “chunk” the delete operation. If your objective is to empty the table, then you may wish to use [`TRUNCATE TABLE`](truncate-table.html "15.1.37 TRUNCATE TABLE Statement") instead.

  + **LOAD DATA statements.** `LOAD DATA` is not transactional when used on `NDB` tables.

    Important

    When executing a [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement") statement, the `NDB` engine performs commits at irregular intervals that enable better utilization of the communication network. It is not possible to know ahead of time when such commits take place.

  + **ALTER TABLE and transactions.** When copying an `NDB` table as part of an [`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement"), the creation of the copy is nontransactional. (In any case, this operation is rolled back when the copy is deleted.)

* **Transactions and the COUNT() function.** When using NDB Cluster Replication, it is not possible to guarantee the transactional consistency of the `COUNT()` function on the replica. In other words, when performing on the source a series of statements (`INSERT`, `DELETE`, or both) that changes the number of rows in a table within a single transaction, executing `SELECT COUNT(*) FROM table` queries on the replica may yield intermediate results. This is due to the fact that `SELECT COUNT(...)` may perform dirty reads, and is not a bug in the `NDB` storage engine. (See Bug #31321 for more information.)


#### 25.2.7.4 NDB Cluster Error Handling

Starting, stopping, or restarting a node may give rise to temporary errors causing some transactions to fail. These include the following cases:

* **Temporary errors.** When first starting a node, it is possible that you may see Error 1204 Temporary failure, distribution changed and similar temporary errors.

* **Errors due to node failure.** The stopping or failure of any data node can result in a number of different node failure errors. (However, there should be no aborted transactions when performing a planned shutdown of the cluster.)

In either of these cases, any errors that are generated must be handled within the application. This should be done by retrying the transaction.

See also Section 25.2.7.2, “Limits and Differences of NDB Cluster from Standard MySQL Limits”.


#### 25.2.7.5 Limits Associated with Database Objects in NDB Cluster

Some database objects such as tables and indexes have different limitations when using the `NDBCLUSTER` storage engine:

* **Number of database objects.** The maximum number of *all* `NDB` database objects in a single NDB Cluster—including databases, tables, and indexes—is limited to 20320.

* **Attributes per table.** The maximum number of attributes (that is, columns and indexes) that can belong to a given table is 512.

* **Attributes per key.** The maximum number of attributes per key is 32.

* **Row size.** In NDB 8.0, the maximum permitted size of any one row is 30000 bytes (increased from 14000 bytes in previous releases).

  Each `BLOB` or `TEXT` column contributes 256 + 8 = 264 bytes to this total; this includes `JSON` columns. See String Type Storage Requirements, as well as JSON Storage Requirements, for more information relating to these types.

  In addition, the maximum offset for a fixed-width column of an `NDB` table is 8188 bytes; attempting to create a table that violates this limitation fails with NDB error 851 Maximum offset for fixed-size columns exceeded. For memory-based columns, you can work around this limitation by using a variable-width column type such as `VARCHAR` or defining the column as `COLUMN_FORMAT=DYNAMIC`; this does not work with columns stored on disk. For disk-based columns, you may be able to do so by reordering one or more of the table's disk-based columns such that the combined width of all but the disk-based column defined last in the `CREATE TABLE` statement used to create the table does not exceed 8188 bytes, less any possible rounding performed for some data types such as `CHAR` or `VARCHAR`; otherwise it is necessary to use memory-based storage for one or more of the offending column or columns instead.

* **BIT column storage per table.** The maximum combined width for all `BIT` columns used in a given `NDB` table is 4096.

* **FIXED column storage.** NDB Cluster 8.0 supports a maximum of 128 TB per fragment of data in `FIXED` columns.


#### 25.2.7.6 Unsupported or Missing Features in NDB Cluster

A number of features supported by other storage engines are not supported for `NDB` tables. Trying to use any of these features in NDB Cluster does not cause errors in or of itself; however, errors may occur in applications that expects the features to be supported or enforced. Statements referencing such features, even if effectively ignored by `NDB`, must be syntactically and otherwise valid.

* **Index prefixes.** Prefixes on indexes are not supported for `NDB` tables. If a prefix is used as part of an index specification in a statement such as `CREATE TABLE`, `ALTER TABLE`, or `CREATE INDEX`, the prefix is not created by `NDB`.

  A statement containing an index prefix, and creating or modifying an `NDB` table, must still be syntactically valid. For example, the following statement always fails with Error 1089 Incorrect prefix key; the used key part is not a string, the used length is longer than the key part, or the storage engine doesn't support unique prefix keys, regardless of storage engine:

  ```
  CREATE TABLE t1 (
      c1 INT NOT NULL,
      c2 VARCHAR(100),
      INDEX i1 (c2(500))
  );
  ```

  This happens on account of the SQL syntax rule that no index may have a prefix larger than itself.

* **Savepoints and rollbacks.** Savepoints and rollbacks to savepoints are ignored as in `MyISAM`.

* **Durability of commits.** There are no durable commits on disk. Commits are replicated, but there is no guarantee that logs are flushed to disk on commit.

* **Replication.** Statement-based replication is not supported. Use `--binlog-format=ROW` (or `--binlog-format=MIXED`) when setting up cluster replication. See Section 25.7, “NDB Cluster Replication”, for more information.

  Replication using global transaction identifiers (GTIDs) is not compatible with NDB Cluster, and is not supported in NDB Cluster 8.0. Do not enable GTIDs when using the `NDB` storage engine, as this is very likely to cause problems up to and including failure of NDB Cluster Replication.

  Semisynchronous replication is not supported in NDB Cluster.

* **Generated columns.** The `NDB` storage engine does not support indexes on virtual generated columns.

  As with other storage engines, you can create an index on a stored generated column, but you should bear in mind that `NDB` uses `DataMemory` for storage of the generated column as well as `IndexMemory` for the index. See JSON columns and indirect indexing in NDB Cluster, for an example.

  NDB Cluster writes changes in stored generated columns to the binary log, but does log not those made to virtual columns. This should not effect NDB Cluster Replication or replication between `NDB` and other MySQL storage engines.

Note

See Section 25.2.7.3, “Limits Relating to Transaction Handling in NDB Cluster”, for more information relating to limitations on transaction handling in `NDB`.


#### 25.2.7.7 Limitations Relating to Performance in NDB Cluster

The following performance issues are specific to or especially pronounced in NDB Cluster:

* **Range scans.** There are query performance issues due to sequential access to the `NDB` storage engine; it is also relatively more expensive to do many range scans than it is with either `MyISAM` or `InnoDB`.

* **Reliability of Records in range.** The `Records in range` statistic is available but is not completely tested or officially supported. This may result in nonoptimal query plans in some cases. If necessary, you can employ `USE INDEX` or `FORCE INDEX` to alter the execution plan. See Section 10.9.4, “Index Hints”, for more information on how to do this.

* **Unique hash indexes.** Unique hash indexes created with `USING HASH` cannot be used for accessing a table if `NULL` is given as part of the key.


#### 25.2.7.8 Issues Exclusive to NDB Cluster

The following are limitations specific to the `NDB` storage engine:

* **Machine architecture.** All machines used in the cluster must have the same architecture. That is, all machines hosting nodes must be either big-endian or little-endian, and you cannot use a mixture of both. For example, you cannot have a management node running on a PowerPC which directs a data node that is running on an x86 machine. This restriction does not apply to machines simply running **mysql** or other clients that may be accessing the cluster's SQL nodes.

* **Binary logging.** NDB Cluster has the following limitations or restrictions with regard to binary logging:

  + NDB Cluster cannot produce a binary log for tables having `BLOB` columns but no primary key.

  + Only the following schema operations are logged in a cluster binary log which is *not* on the **mysqld** executing the statement:

    - `CREATE TABLE`
    - `ALTER TABLE`
    - `DROP TABLE`
    - `CREATE DATABASE` / [`CREATE SCHEMA`](create-database.html "15.1.12 CREATE DATABASE Statement")

    - `DROP DATABASE` / [`DROP SCHEMA`](drop-database.html "15.1.24 DROP DATABASE Statement")

    - `CREATE TABLESPACE`
    - `ALTER TABLESPACE`
    - `DROP TABLESPACE`
    - `CREATE LOGFILE GROUP`
    - `ALTER LOGFILE GROUP`
    - `DROP LOGFILE GROUP`
* **Schema operations.** Schema operations (DDL statements) are rejected while any data node restarts. Schema operations are also not supported while performing an online upgrade or downgrade.

* **Number of fragment replicas.** The number of fragment replicas, as determined by the `NoOfReplicas` data node configuration parameter, is the number of copies of all data stored by NDB Cluster. Setting this parameter to 1 means there is only a single copy; in this case, no redundancy is provided, and the loss of a data node entails loss of data. To guarantee redundancy, and thus preservation of data even if a data node fails, set this parameter to 2, which is the default and recommended value in production.

  Setting `NoOfReplicas` to a value greater than 2 is supported (to a maximum of 4) but unnecessary to guard against loss of data.

See also Section 25.2.7.10, “Limitations Relating to Multiple NDB Cluster Nodes”.


#### 25.2.7.9 Limitations Relating to NDB Cluster Disk Data Storage

**Disk Data object maximums and minimums.** Disk data objects are subject to the following maximums and minimums:

* Maximum number of tablespaces: 232 (4294967296)

* Maximum number of data files per tablespace: 216 (65536)

* The minimum and maximum possible sizes of extents for tablespace data files are 32K and 2G, respectively. See Section 15.1.21, “CREATE TABLESPACE Statement”, for more information.

In addition, when working with NDB Disk Data tables, you should be aware of the following issues regarding data files and extents:

* Data files use `DataMemory`. Usage is the same as for in-memory data.

* Data files use file descriptors. It is important to keep in mind that data files are always open, which means the file descriptors are always in use and cannot be re-used for other system tasks.

* Extents require sufficient `DiskPageBufferMemory`; you must reserve enough for this parameter to account for all memory used by all extents (number of extents times size of extents).

**Disk Data tables and diskless mode.** Use of Disk Data tables is not supported when running the cluster in diskless mode.


#### 25.2.7.10 Limitations Relating to Multiple NDB Cluster Nodes

**Multiple SQL nodes.** The following are issues relating to the use of multiple MySQL servers as NDB Cluster SQL nodes, and are specific to the `NDBCLUSTER` storage engine:

* **Stored programs not distributed.** Stored procedures, stored functions, triggers, and scheduled events are all supported by tables using the `NDB` storage engine, but these do *not* propagate automatically between MySQL Servers acting as Cluster SQL nodes, and must be re-created separately on each SQL node. See Stored routines and triggers in NDB Cluster.

* **No distributed table locks.** A `LOCK TABLES` statement or `GET_LOCK()` call works only for the SQL node on which the lock is issued; no other SQL node in the cluster “sees” this lock. This is true for a lock issued by any statement that locks tables as part of its operations. (See next item for an example.)

  Implementing table locks in `NDBCLUSTER` can be done in an API application, and ensuring that all applications start by setting `LockMode` to `LM_Read` or `LM_Exclusive`. For more information about how to do this, see the description of `NdbOperation::getLockHandle()` in the *NDB Cluster API Guide*.

* **ALTER TABLE operations.** `ALTER TABLE` is not fully locking when running multiple MySQL servers (SQL nodes). (As discussed in the previous item, NDB Cluster does not support distributed table locks.)

**Multiple management nodes.** When using multiple management servers:

* If any of the management servers are running on the same host, you must give nodes explicit IDs in connection strings because automatic allocation of node IDs does not work across multiple management servers on the same host. This is not required if every management server resides on a different host.

* When a management server starts, it first checks for any other management server in the same NDB Cluster, and upon successful connection to the other management server uses its configuration data. This means that the management server `--reload` and `--initial` startup options are ignored unless the management server is the only one running. It also means that, when performing a rolling restart of an NDB Cluster with multiple management nodes, the management server reads its own configuration file if (and only if) it is the only management server running in this NDB Cluster. See Section 25.6.5, “Performing a Rolling Restart of an NDB Cluster”, for more information.

**Multiple network addresses.** Multiple network addresses per data node are not supported. Use of these is liable to cause problems: In the event of a data node failure, an SQL node waits for confirmation that the data node went down but never receives it because another route to that data node remains open. This can effectively make the cluster inoperable.

Note

It is possible to use multiple network hardware *interfaces* (such as Ethernet cards) for a single data node, but these must be bound to the same address. This also means that it not possible to use more than one `[tcp]` section per connection in the `config.ini` file. See Section 25.4.3.10, “NDB Cluster TCP/IP Connections”, for more information.


#### 25.2.7.11 Previous NDB Cluster Issues Resolved in NDB Cluster 8.0

A number of limitations and related issues that existed in earlier versions of NDB Cluster have been resolved in NDB 8.0. These are described briefly in the following list:

* **Database and table names.** In NDB 7.6 and earlier, when using the `NDB` storage engine, the maximum allowed length both for database names and for table names was 63 bytes, and a statement using a database name or table name longer than this limit failed with an appropriate error. In NDB 8.0, this restriction is lifted; identifiers for `NDB` databases and tables may now use up to 64 characters, as with other MySQL database and table names.

* **IPv6 support.** Prior to NDB 8.0.22, it was necessary for all network addresses used for connections between nodes within an NDB Cluster to use or to be resolvable to IPv4 addresses. Beginning with NDB 8.0.22, `NDB` supports IPv6 addresses for all types of cluster nodes, as well as for applications that use the NDB API or MGM API.

  For more information, see Known Issues When Upgrading or Downgrading NDB Cluster.

* **Multithreaded replicas.** In NDB 8.0.32 and earlier, multithreaded replicas were not supported for NDB Cluster Replication. This restriction is lifted in NDB Cluster 8.0.33.

  See Section 25.7.3, “Known Issues in NDB Cluster Replication”, for more information.
