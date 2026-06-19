## 21.2 NDB Cluster Overview

NDB Cluster is a technology that enables clustering of in-memory databases in a shared-nothing system. The shared-nothing architecture enables the system to work with very inexpensive hardware, and with a minimum of specific requirements for hardware or software.

NDB Cluster is designed not to have any single point of failure. In a shared-nothing system, each component is expected to have its own memory and disk, and the use of shared storage mechanisms such as network shares, network file systems, and SANs is not recommended or supported.

NDB Cluster integrates the standard MySQL server with an in-memory clustered storage engine called `NDB` (which stands for “*N*etwork *D*ata*B*ase”). In our documentation, the term `NDB` refers to the part of the setup that is specific to the storage engine, whereas “MySQL NDB Cluster” refers to the combination of one or more MySQL servers with the `NDB` storage engine.

An NDB Cluster consists of a set of computers, known as hosts, each running one or more processes. These processes, known as nodes, may include MySQL servers (for access to NDB data), data nodes (for storage of the data), one or more management servers, and possibly other specialized data access programs. The relationship of these components in an NDB Cluster is shown here:

**Figure 21.1 NDB Cluster Components**

![In this cluster, three MySQL servers (mysqld program) are SQL nodes that provide access to four data nodes (ndbd program) that store data. The SQL nodes and data nodes are under the control of an NDB management server (ndb_mgmd program). Various clients and APIs can interact with the SQL nodes - the mysql client, the MySQL C API, PHP, Connector/J, and Connector/NET. Custom clients can also be created using the NDB API to interact with the data nodes or the NDB management server. The NDB management client (ndb_mgm program) interacts with the NDB management server.](images/cluster-components-1.png)

All these programs work together to form an NDB Cluster (see Section 21.5, “NDB Cluster Programs”. When data is stored by the `NDB` storage engine, the tables (and table data) are stored in the data nodes. Such tables are directly accessible from all other MySQL servers (SQL nodes) in the cluster. Thus, in a payroll application storing data in a cluster, if one application updates the salary of an employee, all other MySQL servers that query this data can see this change immediately.

Although an NDB Cluster SQL node uses the `mysqld` server daemon, it differs in a number of critical respects from the `mysqld` binary supplied with the MySQL 5.7 distributions, and the two versions of `mysqld` are not interchangeable.

In addition, a MySQL server that is not connected to an NDB Cluster cannot use the `NDB` storage engine and cannot access any NDB Cluster data.

The data stored in the data nodes for NDB Cluster can be mirrored; the cluster can handle failures of individual data nodes with no other impact than that a small number of transactions are aborted due to losing the transaction state. Because transactional applications are expected to handle transaction failure, this should not be a source of problems.

Individual nodes can be stopped and restarted, and can then rejoin the system (cluster). Rolling restarts (in which all nodes are restarted in turn) are used in making configuration changes and software upgrades (see Section 21.6.5, “Performing a Rolling Restart of an NDB Cluster”). Rolling restarts are also used as part of the process of adding new data nodes online (see Section 21.6.7, “Adding NDB Cluster Data Nodes Online”). For more information about data nodes, how they are organized in an NDB Cluster, and how they handle and store NDB Cluster data, see Section 21.2.2, “NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions”.

Backing up and restoring NDB Cluster databases can be done using the `NDB`-native functionality found in the NDB Cluster management client and the **ndb\_restore** program included in the NDB Cluster distribution. For more information, see Section 21.6.8, “Online Backup of NDB Cluster”, and Section 21.5.24, “ndb\_restore — Restore an NDB Cluster Backup”. You can also use the standard MySQL functionality provided for this purpose in **mysqldump** and the MySQL server. See Section 4.5.4, “mysqldump — A Database Backup Program”, for more information.

NDB Cluster nodes can employ different transport mechanisms for inter-node communications; TCP/IP over standard 100 Mbps or faster Ethernet hardware is used in most real-world deployments.


### 21.2.1 NDB Cluster Core Concepts

`NDBCLUSTER` (also known as `NDB`) is an in-memory storage engine offering high-availability and data-persistence features.

The `NDBCLUSTER` storage engine can be configured with a range of failover and load-balancing options, but it is easiest to start with the storage engine at the cluster level. NDB Cluster's `NDB` storage engine contains a complete set of data, dependent only on other data within the cluster itself.

The “Cluster” portion of NDB Cluster is configured independently of the MySQL servers. In an NDB Cluster, each part of the cluster is considered to be a node.

Note

In many contexts, the term “node” is used to indicate a computer, but when discussing NDB Cluster it means a *process*. It is possible to run multiple nodes on a single computer; for a computer on which one or more cluster nodes are being run we use the term cluster host.

There are three types of cluster nodes, and in a minimal NDB Cluster configuration, there must be at least three nodes, one of each of these types:

* Management node: The role of this type of node is to manage the other nodes within the NDB Cluster, performing such functions as providing configuration data, starting and stopping nodes, and running backups. Because this node type manages the configuration of the other nodes, a node of this type should be started first, before any other node. A management node is started with the command **ndb\_mgmd**.

* Data node: This type of node stores cluster data. There are as many data nodes as there are fragment replicas, times the number of fragments (see Section 21.2.2, “NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions”). For example, with two fragment replicas, each having two fragments, you need four data nodes. One fragment replica is sufficient for data storage, but provides no redundancy; therefore, it is recommended to have two (or more) fragment replicas to provide redundancy, and thus high availability. A data node is started with the command **ndbd** (see Section 21.5.1, “ndbd — The NDB Cluster Data Node Daemon”) or **ndbmtd**") (see Section 21.5.3, “ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)”")).

  NDB Cluster tables are normally stored completely in memory rather than on disk (this is why we refer to NDB Cluster as an in-memory database). However, some NDB Cluster data can be stored on disk; see Section 21.6.11, “NDB Cluster Disk Data Tables”, for more information.

* SQL node: This is a node that accesses the cluster data. In the case of NDB Cluster, an SQL node is a traditional MySQL server that uses the `NDBCLUSTER` storage engine. An SQL node is a `mysqld` process started with the `--ndbcluster` and `--ndb-connectstring` options, which are explained elsewhere in this chapter, possibly with additional MySQL server options as well.

  An SQL node is actually just a specialized type of API node, which designates any application which accesses NDB Cluster data. Another example of an API node is the **ndb\_restore** utility that is used to restore a cluster backup. It is possible to write such applications using the NDB API. For basic information about the NDB API, see Getting Started with the NDB API.

Important

It is not realistic to expect to employ a three-node setup in a production environment. Such a configuration provides no redundancy; to benefit from NDB Cluster's high-availability features, you must use multiple data and SQL nodes. The use of multiple management nodes is also highly recommended.

For a brief introduction to the relationships between nodes, node groups, fragment replicas, and partitions in NDB Cluster, see Section 21.2.2, “NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions”.

Configuration of a cluster involves configuring each individual node in the cluster and setting up individual communication links between nodes. NDB Cluster is currently designed with the intention that data nodes are homogeneous in terms of processor power, memory space, and bandwidth. In addition, to provide a single point of configuration, all configuration data for the cluster as a whole is located in one configuration file.

The management server manages the cluster configuration file and the cluster log. Each node in the cluster retrieves the configuration data from the management server, and so requires a way to determine where the management server resides. When interesting events occur in the data nodes, the nodes transfer information about these events to the management server, which then writes the information to the cluster log.

In addition, there can be any number of cluster client processes or applications. These include standard MySQL clients, `NDB`-specific API programs, and management clients. These are described in the next few paragraphs.

**Standard MySQL clients.** NDB Cluster can be used with existing MySQL applications written in PHP, Perl, C, C++, Java, Python, and so on. Such client applications send SQL statements to and receive responses from MySQL servers acting as NDB Cluster SQL nodes in much the same way that they interact with standalone MySQL servers.

MySQL clients using an NDB Cluster as a data source can be modified to take advantage of the ability to connect with multiple MySQL servers to achieve load balancing and failover. For example, Java clients using Connector/J 5.0.6 and later can use `jdbc:mysql:loadbalance://` URLs (improved in Connector/J 5.1.7) to achieve load balancing transparently; for more information about using Connector/J with NDB Cluster, see Using Connector/J with NDB Cluster.

**NDB client programs.** Client programs can be written that access NDB Cluster data directly from the `NDBCLUSTER` storage engine, bypassing any MySQL Servers that may be connected to the cluster, using the NDB API, a high-level C++ API. Such applications may be useful for specialized purposes where an SQL interface to the data is not needed. For more information, see The NDB API.

`NDB`-specific Java applications can also be written for NDB Cluster using the NDB Cluster Connector for Java. This NDB Cluster Connector includes ClusterJ, a high-level database API similar to object-relational mapping persistence frameworks such as Hibernate and JPA that connect directly to `NDBCLUSTER`, and so does not require access to a MySQL Server. See Java and NDB Cluster, and The ClusterJ API and Data Object Model, for more information.

**Management clients.** These clients connect to the management server and provide commands for starting and stopping nodes gracefully, starting and stopping message tracing (debug versions only), showing node versions and status, starting and stopping backups, and so on. An example of this type of program is the **ndb\_mgm** management client supplied with NDB Cluster (see Section 21.5.5, “ndb\_mgm — The NDB Cluster Management Client”). Such applications can be written using the MGM API, a C-language API that communicates directly with one or more NDB Cluster management servers. For more information, see The MGM API.

Oracle also makes available MySQL Cluster Manager, which provides an advanced command-line interface simplifying many complex NDB Cluster management tasks, such restarting an NDB Cluster with a large number of nodes. The MySQL Cluster Manager client also supports commands for getting and setting the values of most node configuration parameters as well as `mysqld` server options and variables relating to NDB Cluster. See MySQL Cluster Manager 1.4.8 User Manual, for more information.

**Event logs.** NDB Cluster logs events by category (startup, shutdown, errors, checkpoints, and so on), priority, and severity. A complete listing of all reportable events may be found in Section 21.6.3, “Event Reports Generated in NDB Cluster”. Event logs are of the two types listed here:

* Cluster log: Keeps a record of all desired reportable events for the cluster as a whole.

* Node log: A separate log which is also kept for each individual node.

Note

Under normal circumstances, it is necessary and sufficient to keep and examine only the cluster log. The node logs need be consulted only for application development and debugging purposes.

**Checkpoint.** Generally speaking, when data is saved to disk, it is said that a checkpoint has been reached. More specific to NDB Cluster, a checkpoint is a point in time where all committed transactions are stored on disk. With regard to the `NDB` storage engine, there are two types of checkpoints which work together to ensure that a consistent view of the cluster's data is maintained. These are shown in the following list:

* Local Checkpoint (LCP): This is a checkpoint that is specific to a single node; however, LCPs take place for all nodes in the cluster more or less concurrently. An LCP usually occurs every few minutes; the precise interval varies, and depends upon the amount of data stored by the node, the level of cluster activity, and other factors.

  Previously, an LCP involved saving all of a node's data to disk. NDB 7.6 introduces support for partial LCPs, which can significantly improve recovery time under some conditions. See Section 21.2.4.2, “What is New in NDB Cluster 7.6”, for more information, as well as the descriptions of the `EnablePartialLcp` and `RecoveryWork` configuration parameters which enable partial LCPs and control the amount of storage they use.

* Global Checkpoint (GCP): A GCP occurs every few seconds, when transactions for all nodes are synchronized and the redo-log is flushed to disk.

For more information about the files and directories created by local checkpoints and global checkpoints, see NDB Cluster Data Node File System Directory.

**Transporter.** We use the term transporter for the data transport mechanism employed between data nodes. MySQL NDB Cluster 7.5 and 7.6 support three of these, which are listed here:

* *TCP/IP over Ethernet*. See Section 21.4.3.10, “NDB Cluster TCP/IP Connections”.

* *Direct TCP/IP*. Uses machine-to-machine connections. See Section 21.4.3.11, “NDB Cluster TCP/IP Connections Using Direct Connections”.

  Although this transporter uses the same TCP/IP protocol as mentioned in the previous item, it requires setting up the hardware differently and is configured differently as well. For this reason, it is considered a separate transport mechanism for NDB Cluster.

* *Shared memory (SHM)*. See Section 21.4.3.12, “NDB Cluster Shared Memory Connections”.

Because it is ubiquitous, most users employ TCP/IP over Ethernet for NDB Cluster.

Regardless of the transporter used, `NDB` attempts to make sure that communication between data node processes is performed using chunks that are as large as possible since this benefits all types of data transmission.


### 21.2.2 NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions

This section discusses the manner in which NDB Cluster divides and duplicates data for storage.

A number of concepts central to an understanding of this topic are discussed in the next few paragraphs.

**Data node.** An **ndbd** or **ndbmtd**") process, which stores one or more fragment replicas—that is, copies of the partitions (discussed later in this section) assigned to the node group of which the node is a member.

Each data node should be located on a separate computer. While it is also possible to host multiple data node processes on a single computer, such a configuration is not usually recommended.

It is common for the terms “node” and “data node” to be used interchangeably when referring to an **ndbd** or **ndbmtd**") process; where mentioned, management nodes (**ndb\_mgmd** processes) and SQL nodes (`mysqld` processes) are specified as such in this discussion.

**Node group.** A node group consists of one or more nodes, and stores partitions, or sets of fragment replicas (see next item).

The number of node groups in an NDB Cluster is not directly configurable; it is a function of the number of data nodes and of the number of fragment replicas (`NoOfReplicas` configuration parameter), as shown here:

```sql
[# of node groups] = [# of data nodes] / NoOfReplicas
```

Thus, an NDB Cluster with 4 data nodes has 4 node groups if `NoOfReplicas` is set to 1 in the `config.ini` file, 2 node groups if `NoOfReplicas` is set to 2, and 1 node group if `NoOfReplicas` is set to 4. Fragment replicas are discussed later in this section; for more information about `NoOfReplicas`, see Section 21.4.3.6, “Defining NDB Cluster Data Nodes”.

Note

All node groups in an NDB Cluster must have the same number of data nodes.

You can add new node groups (and thus new data nodes) online, to a running NDB Cluster; see Section 21.6.7, “Adding NDB Cluster Data Nodes Online”, for more information.

**Partition.** This is a portion of the data stored by the cluster. Each node is responsible for keeping at least one copy of any partitions assigned to it (that is, at least one fragment replica) available to the cluster.

The number of partitions used by default by NDB Cluster depends on the number of data nodes and the number of LDM threads in use by the data nodes, as shown here:

```sql
[# of partitions] = [# of data nodes] * [# of LDM threads]
```

When using data nodes running **ndbmtd**"), the number of LDM threads is controlled by the setting for `MaxNoOfExecutionThreads`. When using **ndbd** there is a single LDM thread, which means that there are as many cluster partitions as nodes participating in the cluster. This is also the case when using **ndbmtd**") with `MaxNoOfExecutionThreads` set to 3 or less. (You should be aware that the number of LDM threads increases with the value of this parameter, but not in a strictly linear fashion, and that there are additional constraints on setting it; see the description of `MaxNoOfExecutionThreads` for more information.)

**NDB and user-defined partitioning.** NDB Cluster normally partitions `NDBCLUSTER` tables automatically. However, it is also possible to employ user-defined partitioning with `NDBCLUSTER` tables. This is subject to the following limitations:

1. Only the `KEY` and `LINEAR KEY` partitioning schemes are supported in production with `NDB` tables.

2. The maximum number of partitions that may be defined explicitly for any `NDB` table is `8 * [number of LDM threads] * [number of node groups]`, the number of node groups in an NDB Cluster being determined as discussed previously in this section. When running **ndbd** for data node processes, setting the number of LDM threads has no effect (since `ThreadConfig` applies only to **ndbmtd**")); in such cases, this value can be treated as though it were equal to 1 for purposes of performing this calculation.

   See Section 21.5.3, “ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)”"), for more information.

For more information relating to NDB Cluster and user-defined partitioning, see Section 21.2.7, “Known Limitations of NDB Cluster”, and Section 22.6.2, “Partitioning Limitations Relating to Storage Engines”.

**Fragment replica.** This is a copy of a cluster partition. Each node in a node group stores a fragment replica. Also sometimes known as a partition replica. The number of fragment replicas is equal to the number of nodes per node group.

A fragment replica belongs entirely to a single node; a node can (and usually does) store several fragment replicas.

The following diagram illustrates an NDB Cluster with four data nodes running **ndbd**, arranged in two node groups of two nodes each; nodes 1 and 2 belong to node group 0, and nodes 3 and 4 belong to node group 1.

Note

Only data nodes are shown here; although a working NDB Cluster requires an **ndb\_mgmd** process for cluster management and at least one SQL node to access the data stored by the cluster, these have been omitted from the figure for clarity.

**Figure 21.2 NDB Cluster with Two Node Groups**

![Content is described in the surrounding text.](images/fragment-replicas-groups-1-1.png)

The data stored by the cluster is divided into four partitions, numbered 0, 1, 2, and 3. Each partition is stored—in multiple copies—on the same node group. Partitions are stored on alternate node groups as follows:

* Partition 0 is stored on node group 0; a primary fragment replica (primary copy) is stored on node 1, and a backup fragment replica (backup copy of the partition) is stored on node 2.

* Partition 1 is stored on the other node group (node group 1); this partition's primary fragment replica is on node 3, and its backup fragment replica is on node 4.

* Partition 2 is stored on node group 0. However, the placing of its two fragment replicas is reversed from that of Partition 0; for Partition 2, the primary fragment replica is stored on node 2, and the backup on node 1.

* Partition 3 is stored on node group 1, and the placement of its two fragment replicas are reversed from those of partition

  1. That is, its primary fragment replica is located on node 4, with the backup on node 3.

What this means regarding the continued operation of an NDB Cluster is this: so long as each node group participating in the cluster has at least one node operating, the cluster has a complete copy of all data and remains viable. This is illustrated in the next diagram.

**Figure 21.3 Nodes Required for a 2x2 NDB Cluster**

![Content is described in the surrounding text.](images/replicas-groups-1-2.png)

In this example, the cluster consists of two node groups each consisting of two data nodes. Each data node is running an instance of **ndbd**. Any combination of at least one node from node group 0 and at least one node from node group 1 is sufficient to keep the cluster “alive”. However, if both nodes from a single node group fail, the combination consisting of the remaining two nodes in the other node group is not sufficient. In this situation, the cluster has lost an entire partition and so can no longer provide access to a complete set of all NDB Cluster data.

In NDB 7.5.4 and later, the maximum number of node groups supported for a single NDB Cluster instance is 48 (Bug#80845, Bug #22996305).


### 21.2.3 NDB Cluster Hardware, Software, and Networking Requirements

One of the strengths of NDB Cluster is that it can be run on commodity hardware and has no unusual requirements in this regard, other than for large amounts of RAM, due to the fact that all live data storage is done in memory. (It is possible to reduce this requirement using Disk Data tables—see Section 21.6.11, “NDB Cluster Disk Data Tables”, for more information about these.) Naturally, multiple and faster CPUs can enhance performance. Memory requirements for other NDB Cluster processes are relatively small.

The software requirements for NDB Cluster are also modest. Host operating systems do not require any unusual modules, services, applications, or configuration to support NDB Cluster. For supported operating systems, a standard installation should be sufficient. The MySQL software requirements are simple: all that is needed is a production release of NDB Cluster. It is not strictly necessary to compile MySQL yourself merely to be able to use NDB Cluster. We assume that you are using the binaries appropriate to your platform, available from the NDB Cluster software downloads page at <https://dev.mysql.com/downloads/cluster/>.

For communication between nodes, NDB Cluster supports TCP/IP networking in any standard topology, and the minimum expected for each host is a standard 100 Mbps Ethernet card, plus a switch, hub, or router to provide network connectivity for the cluster as a whole. We strongly recommend that an NDB Cluster be run on its own subnet which is not shared with machines not forming part of the cluster for the following reasons:

* **Security.** Communications between NDB Cluster nodes are not encrypted or shielded in any way. The only means of protecting transmissions within an NDB Cluster is to run your NDB Cluster on a protected network. If you intend to use NDB Cluster for Web applications, the cluster should definitely reside behind your firewall and not in your network's De-Militarized Zone (DMZ) or elsewhere.

  See Section 21.6.18.1, “NDB Cluster Security and Networking Issues”, for more information.

* **Efficiency.** Setting up an NDB Cluster on a private or protected network enables the cluster to make exclusive use of bandwidth between cluster hosts. Using a separate switch for your NDB Cluster not only helps protect against unauthorized access to NDB Cluster data, it also ensures that NDB Cluster nodes are shielded from interference caused by transmissions between other computers on the network. For enhanced reliability, you can use dual switches and dual cards to remove the network as a single point of failure; many device drivers support failover for such communication links.

**Network communication and latency.** NDB Cluster requires communication between data nodes and API nodes (including SQL nodes), as well as between data nodes and other data nodes, to execute queries and updates. Communication latency between these processes can directly affect the observed performance and latency of user queries. In addition, to maintain consistency and service despite the silent failure of nodes, NDB Cluster uses heartbeating and timeout mechanisms which treat an extended loss of communication from a node as node failure. This can lead to reduced redundancy. Recall that, to maintain data consistency, an NDB Cluster shuts down when the last node in a node group fails. Thus, to avoid increasing the risk of a forced shutdown, breaks in communication between nodes should be avoided wherever possible.

The failure of a data or API node results in the abort of all uncommitted transactions involving the failed node. Data node recovery requires synchronization of the failed node's data from a surviving data node, and re-establishment of disk-based redo and checkpoint logs, before the data node returns to service. This recovery can take some time, during which the Cluster operates with reduced redundancy.

Heartbeating relies on timely generation of heartbeat signals by all nodes. This may not be possible if the node is overloaded, has insufficient machine CPU due to sharing with other programs, or is experiencing delays due to swapping. If heartbeat generation is sufficiently delayed, other nodes treat the node that is slow to respond as failed.

This treatment of a slow node as a failed one may or may not be desirable in some circumstances, depending on the impact of the node's slowed operation on the rest of the cluster. When setting timeout values such as `HeartbeatIntervalDbDb` and `HeartbeatIntervalDbApi` for NDB Cluster, care must be taken care to achieve quick detection, failover, and return to service, while avoiding potentially expensive false positives.

Where communication latencies between data nodes are expected to be higher than would be expected in a LAN environment (on the order of 100 µs), timeout parameters must be increased to ensure that any allowed periods of latency periods are well within configured timeouts. Increasing timeouts in this way has a corresponding effect on the worst-case time to detect failure and therefore time to service recovery.

LAN environments can typically be configured with stable low latency, and such that they can provide redundancy with fast failover. Individual link failures can be recovered from with minimal and controlled latency visible at the TCP level (where NDB Cluster normally operates). WAN environments may offer a range of latencies, as well as redundancy with slower failover times. Individual link failures may require route changes to propagate before end-to-end connectivity is restored. At the TCP level this can appear as large latencies on individual channels. The worst-case observed TCP latency in these scenarios is related to the worst-case time for the IP layer to reroute around the failures.


### 21.2.4 What is New in MySQL NDB Cluster

The following sections describe changes in the implementation of MySQL NDB Cluster in NDB Cluster 7.6 through 5.7.44-ndb-7.6.36 and NDB Cluster 7.5 through 5.7.44-ndb-7.5.36 as compared to earlier release series. NDB Cluster 8.0 is available as a General Availability (GA) release, beginning with NDB 8.0.19; see What is New in MySQL NDB Cluster 8.0, for more information about new features and other changes in NDB 8.0. NDB Cluster 7.6 and 7.5 are previous GA releases still supported in production; for information about NDB Cluster 7.6, see Section 21.2.4.2, “What is New in NDB Cluster 7.6”. For information about NDB Cluster 7.5, see Section 21.2.4.1, “What is New in NDB Cluster 7.5”. NDB Cluster 7.4 and 7.3 were previous GA releases which have reached their end of life, and which are no longer supported or maintained. We recommend that new deployments for production use MySQL NDB Cluster 8.0.


#### 21.2.4.1 What is New in NDB Cluster 7.5

Major changes and new features in NDB Cluster 7.5 which are likely to be of interest are shown in the following list:

* **ndbinfo Enhancements.** A number of changes are made in the `ndbinfo` database, chief of which is that it now provides detailed information about NDB Cluster node configuration parameters.

  The `config_params` table has been made read-only, and has been enhanced with additional columns providing information about each configuration parameter, including the parameter's type, default value, maximum and minimum values (where applicable), a brief description of the parameter, and whether the parameter is required. This table also provides each parameter with a unique `param_number`.

  A row in the `config_values` table shows the current value of a given parameter on the node having a specified ID. The parameter is identified by the value of the `config_param` column, which maps to the `config_params` table's `param_number`.

  Using this relationship you can write a join on these two tables to obtain the default, maximum, minimum, and current values for one or more NDB Cluster configuration parameters by name. An example SQL statement using such a join is shown here:

  ```sql
  SELECT  p.param_name AS Name,
          v.node_id AS Node,
          p.param_type AS Type,
          p.param_default AS 'Default',
          p.param_min AS Minimum,
          p.param_max AS Maximum,
          CASE p.param_mandatory WHEN 1 THEN 'Y' ELSE 'N' END AS 'Required',
          v.config_value AS Current
  FROM    config_params p
  JOIN    config_values v
  ON      p.param_number = v.config_param
  WHERE   p. param_name IN ('NodeId', 'HostName','DataMemory', 'IndexMemory');
  ```

  For more information about these changes, see Section 21.6.15.8, “The ndbinfo config\_params Table”. See Section 21.6.15.9, “The ndbinfo config\_values Table”, for further information and examples.

  In addition, the `ndbinfo` database no longer depends on the `MyISAM` storage engine. All `ndbinfo` tables and views now use `NDB` (shown as `NDBINFO`).

  Several new `ndbinfo` tables were introduced in NDB 7.5.4. These tables are listed here, with brief descriptions:

  + `dict_obj_info` provides the names and types of database objects in `NDB`, as well as information about parent obejcts where applicable

  + `table_distribution_status` provides `NDB` table distribution status information

  + `table_fragments` provides information about the distribution of `NDB` table fragments

  + `table_info` provides information about logging, checkpointing, storage, and other options in force for each `NDB` table

  + `table_replicas` provides information about fragment replicas

  See the descriptions of the individual tables for more information.

* **Default row and column format changes.** Starting with NDB 7.5.1, the default value for both the `ROW_FORMAT` option and the `COLUMN_FORMAT` option for `CREATE TABLE` can be set to `DYNAMIC` rather than `FIXED`, using a new MySQL server variable `ndb_default_column_format` is added as part of this change; set this to `FIXED` or `DYNAMIC` (or start `mysqld` with the equivalent option `--ndb-default-column-format=FIXED`) to force this value to be used for `COLUMN_FORMAT` and `ROW_FORMAT`. Prior to NDB 7.5.4, the default for this variable was `DYNAMIC`; in this and later versions, the default is `FIXED`, which provides backwards compatibility with prior releases (Bug #24487363).

  The row format and column format used by existing table columns are unaffected by this change. New columns added to such tables use the new defaults for these (possibly overridden by `ndb_default_column_format`), and existing columns are changed to use these as well, provided that the `ALTER TABLE` statement performing this operation specifies `ALGORITHM=COPY`.

  Note

  A copying `ALTER TABLE` cannot be done implicitly if `mysqld` is run with `--ndb-allow-copying-alter-table=FALSE`.

* **ndb\_binlog\_index no longer dependent on MyISAM.** As of NDB 7.5.2, the `ndb_binlog_index` table employed in NDB Cluster Replication now uses the `InnoDB` storage engine instead of `MyISAM`. When upgrading, you can run `mysqld_upgrade` with `--force` `--upgrade-system-tables` to cause it to execute `ALTER TABLE ... ENGINE=INNODB` on this table. Use of `MyISAM` for this table remains supported for backward compatibility.

  A benefit of this change is that it makes it possible to depend on transactional behavior and lock-free reads for this table, which can help alleviate concurrency issues during purge operations and log rotation, and improve the availability of this table.

* **ALTER TABLE changes.** NDB Cluster formerly supported an alternative syntax for online `ALTER TABLE`. This is no longer supported in NDB Cluster 7.5, which makes exclusive use of `ALGORITHM = DEFAULT|COPY|INPLACE` for table DDL, as in the standard MySQL Server.

  Another change affecting the use of this statement is that `ALTER TABLE ... ALGORITHM=INPLACE RENAME` may now contain DDL operations in addition to the renaming.

* **ExecuteOnComputer parameter deprecated.** The `ExecuteOnComputer` configuration parameter for management nodes, data nodes, and API nodes has been deprecated and is now subject to removal in a future release of NDB Cluster. You should use the equivalent `HostName` parameter for all three types of nodes.

* **records-per-key optimization.** The NDB handler now uses the records-per-key interface for index statistics implemented for the optimizer in MySQL 5.7.5. Some of the benefits from this change include those listed here:

  + The optimizer now chooses better execution plans in many cases where a less optimal join index or table join order would previously have been chosen

  + Row estimates shown by `EXPLAIN` are more accurate

  + Cardinality estimates shown by `SHOW INDEX` are improved

* **Connection pool node IDs.** NDB 7.5.0 adds the `mysqld` `--ndb-cluster-connection-pool-nodeids` option, which allows a set of node IDs to be set for the connection pool. This setting overrides `--ndb-nodeid`, which means that it also overrides both the `--ndb-connectstring` option and the `NDB_CONNECTSTRING` environment variable.

  Note

  You can set the size for the connection pool using the `--ndb-cluster-connection-pool` option for `mysqld`.

* **create\_old\_temporals removed.** The `create_old_temporals` system variable was deprecated in NDB Cluster 7.4, and has now been removed.

* **ndb\_mgm Client PROMPT command.** NDB Cluster 7.5 adds a new command for setting the client's command-line prompt. The following example illustrates the use of the `PROMPT` command:

  ```sql
  ndb_mgm> PROMPT mgm#1:
  mgm#1: SHOW
  Cluster Configuration
  ---------------------
  [ndbd(NDB)]     4 node(s)
  id=5    @10.100.1.1  (mysql-5.7.44-ndb-7.5.36, Nodegroup: 0, *)
  id=6    @10.100.1.3  (mysql-5.7.44-ndb-7.5.36, Nodegroup: 0)
  id=7    @10.100.1.9  (mysql-5.7.44-ndb-7.5.36, Nodegroup: 1)
  id=8    @10.100.1.11  (mysql-5.7.44-ndb-7.5.36, Nodegroup: 1)

  [ndb_mgmd(MGM)] 1 node(s)
  id=50   @10.100.1.8  (mysql-5.7.44-ndb-7.5.36)

  [mysqld(API)]   2 node(s)
  id=100  @10.100.1.8  (5.7.44-ndb-7.5.36)
  id=101  @10.100.1.10  (5.7.44-ndb-7.5.36)

  mgm#1: PROMPT
  ndb_mgm> EXIT
  jon@valhaj:/usr/local/mysql/bin>
  ```

  For additional information and examples, see Section 21.6.1, “Commands in the NDB Cluster Management Client”.

* **Increased FIXED column storage per fragment.** NDB Cluster 7.5 and later supports a maximum of 128 TB per fragment of data in `FIXED` columns. In NDB Cluster 7.4 and earlier, this was 16 GB per fragment.

* **Deprecated parameters removed.** The following NDB Cluster data node configuration parameters were deprecated in previous releases of NDB Cluster, and were removed in NDB 7.5.0:

  + `Id`: deprecated in NDB 7.1.9; replaced by `NodeId`.

  + `NoOfDiskPagesToDiskDuringRestartTUP`, `NoOfDiskPagesToDiskDuringRestartACC`: both deprecated, had no effect; replaced in MySQL 5.1.6 by `DiskCheckpointSpeedInRestart`, which itself was later deprecated (in NDB 7.4.1) and is now also removed.

  + `NoOfDiskPagesToDiskAfterRestartACC`, `NoOfDiskPagesToDiskAfterRestartTUP`: both deprecated, and had no effect; replaced in MySQL 5.1.6 by `DiskCheckpointSpeed`, which itself was later deprecated (in NDB 7.4.1) and is now also removed.

  + `ReservedSendBufferMemory`: Deprecated; no longer had any effect.

  + `MaxNoOfIndexes`: archaic (pre-MySQL 4.1), had no effect; long since replaced by `MaxNoOfOrderedIndexes` or `MaxNoOfUniqueHashIndexes`.

  + `Discless`: archaic (pre-MySQL 4.1) synonym for and long since replaced by `Diskless`.

  The archaic and unused (and for this reason also previously undocumented) `ByteOrder` computer configuration parameter was also removed in NDB 7.5.0.

  The parameters just described are not supported in NDB 7.5. Attempting to use any of these parameters in an NDB Cluster configuration file now results in an error.

* **DBTC scan enhancements.** Scans have been improved by reducing the number of signals used for communication between the `DBTC` and `DBDIH` kernel blocks in `NDB`, enabling higher scalability of data nodes when used for scan operations by decreasing the use of CPU resources for scan operations, in some cases by an estimated five percent.

  Also as result of these changes response times should be greatly improved, which could help prevent issues with overload of the main threads. In addition, scans made in the `BACKUP` kernel block have also been improved and made more efficient than in previous releases.

* **JSON column support.** NDB 7.5.2 and later supports the `JSON` column type for `NDB` tables and the JSON functions found in the MySQL Server, subject to the limitation that an `NDB` table can have at most 3 `JSON` columns.

* **Read from any fragment replica; specify number of hashmap partition fragments.** Previously, all reads were directed towards the primary fragment replica except for simple reads. (A simple read is a read that locks the row while reading it.) Beginning with NDB 7.5.2, it is possible to enable reads from any fragment replica. This is disabled by default but can be enabled for a given SQL node using the `ndb_read_backup` system variable added in this release.

  Previously, it was possible to define tables with only one type of partition mapping, with one primary partition on each LDM in each node, but in NDB 7.5.2 it becomes possible to be more flexible about the assignment of partitions by setting a partition balance (fragment count type). Possible balance schemes are one per node, one per node group, one per LDM per node, and one per LDM per node group.

  This setting can be controlled for individual tables by means of a `PARTITION_BALANCE` option (renamed from `FRAGMENT_COUNT_TYPE` in NDB 7.5.4) embedded in `NDB_TABLE` comments in `CREATE TABLE` or `ALTER TABLE` statements. Settings for table-level `READ_BACKUP` are also supported using this syntax. For more information and examples, see Section 13.1.18.9, “Setting NDB Comment Options”.

  In NDB API applications, a table's partition balance can also be get and set using methods supplied for this purpose; see Table::getPartitionBalance(), and Table::setPartitionBalance(), as well as Object::PartitionBalance, for more information about these.

  As part of this work, NDB 7.5.2 also introduces the `ndb_data_node_neighbour` system variable. This is intended for use, in transaction hinting, to provide a “nearby” data node to this SQL node.

  In addition, when restoring table schemas, **ndb\_restore** `--restore-meta` now uses the target cluster's default partitioning, rather than using the same number of partitions as the original cluster from which the backup was taken. See Section 21.5.24.2.2, “Restoring to More Nodes Than the Original”, for more information and an example.

  NDB 7.5.3 adds a further enhancement to `READ_BACKUP`: In this and later versions, it is possible to set `READ_BACKUP` for a given table online as part of `ALTER TABLE ... ALGORITHM=INPLACE ...`.

* **ThreadConfig improvements.** A number of enhancements and feature additions are implemented in NDB 7.5.2 for the `ThreadConfig` multithreaded data node (**ndbmtd**")) configuration parameter, including support for an increased number of platforms. These changes are described in the next few paragraphs.

  Non-exclusive CPU locking is now supported on FreeBSD and Windows, using `cpubind` and `cpuset`. Exclusive CPU locking is now supported on Solaris (only) using the `cpubind_exclusive` and `cpuset_exclusive` parameters which are introduced in this release.

  Thread prioritzation is now available, controlled by the new `thread_prio` parameter. `thread_prio` is supported on Linux, FreeBSD, Windows, and Solaris, and varies somewhat by platform. For more information, see the description of `ThreadConfig`.

  The `realtime` parameter is now supported on Windows platforms.

* **Partitions larger than 16 GB.** Due to an improvement in the hash index implementation used by NDB Cluster data nodes, partitions of `NDB` tables may now contain more than 16 GB of data for fixed columns, and the maximum partition size for fixed columns is now raised to 128 TB. The previous limitation was due to the fact that the `DBACC` block in the `NDB` kernel used only 32-bit references to the fixed-size part of a row in the `DBTUP` block, although 45-bit references to this data are used in `DBTUP` itself and elsewhere in the kernel outside `DBACC`; all such references in to the data handled in the `DBACC` block now use 45 bits instead.

* **Print SQL statements from ndb\_restore.** NDB 7.5.4 adds the `--print-sql-log` option for the **ndb\_restore** utility provided with the NDB Cluster distribution. This option enables SQL logging to `stdout`. **Important**: Every table to be restored using this option must have an explicitly defined primary key.

  See Section 21.5.24, “ndb\_restore — Restore an NDB Cluster Backup”, for more information.

* **Organization of RPM packages.** Beginning with NDB 7.5.4, the naming and organization of RPM packages provided for NDB Cluster align more closely with those released for the MySQL server. The names of all NDB Cluster RPMs are now prefixed with `mysql-cluster`. Data nodes are now installed using the `data-node` package; management nodes are now installed from the `management-server` package; and SQL nodes require the `server` and `common` packages. MySQL and `NDB` client programs, including the **mysql** client and the **ndb\_mgm** management client, are now included in the `client` RPM.

  For a detailed listing of NDB Cluster RPMs and other information, see Section 21.3.1.2, “Installing NDB Cluster from RPM”.

* **ndbinfo processes and config\_nodes tables.** NDB 7.5.7 adds two tables to the `ndbinfo` information database to provide information about cluster nodes; these tables are listed here:

  + `config_nodes`: This table provides the node ID, process type, and host name for each node listed in an NDB cluster's configuration file.

  + The `processes` shows information about nodes currently connected to the cluster; this information includes the process name and system process ID; for each data node and SQL node, it also shows the process ID of the node's angel process. In addition, the table shows a service address for each connected node; this address can be set in NDB API applications using the `Ndb_cluster_connection::set_service_uri()` method, which is also added in NDB 7.5.7.

* **System name.** The system name of an NDB cluster can be used to identify a specific cluster. Beginning with NDB 7.5.7, the MySQL Server shows this name as the value of the `Ndb_system_name` status variable; NDB API applications can use the `Ndb_cluster_connection::get_system_name()` method which is added in the same release.

  A system name based on the time the management server was started is generated automatically; you can override this value by adding a `[system]` section to the cluster's configuration file and setting the `Name` parameter to a value of your choice in this section, prior to starting the management server.

* **ndb\_restore options.** Beginning with NDB 7.5.13, the `--nodeid` and `--backupid` options are both required when invoking **ndb\_restore**.

* **ndb\_blob\_tool enhancements.** Beginning with NDB 7.5.18, the **ndb\_blob\_tool** utility can detect missing blob parts for which inline parts exist and replace these with placeholder blob parts (consisting of space characters) of the correct length. To check whether there are missing blob parts, use the `--check-missing` option with this program. To replace any missing blob parts with placeholders, use the `--add-missing` option.

  For more information, see Section 21.5.6, “ndb\_blob\_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables”.

* **--ndb-log-fail-terminate option.** Beginning with NDB 7.5.18, you can cause the SQL node to terminate whenever it is unable to log all row events fully. This can be done by starting `mysqld` with the `--ndb-log-fail-terminate` option.

* **NDB programs—NDBT dependency removal.** The dependency of a number of `NDB` utility programs on the `NDBT` library has been removed. This library is used internally for development, and is not required for normal use; its inclusion in these programs could lead to unwanted issues when testing.

  Affected programs are listed here, along with the `NDB` versions in which the dependency was removed:

  + **ndb\_restore**, in NDB 7.5.15
  + **ndb\_show\_tables**, in NDB 7.5.18
  + **ndb\_waiter**, in NDB 7.5.18

  The principal effect of this change for users is that these programs no longer print `NDBT_ProgramExit - status` following completion of a run. Applications that depend upon such behavior should be updated to reflect the change when upgrading to the indicated versions.

* **Auto-Installer deprecation and removal.** The MySQL NDB Cluster Auto-Installer web-based installation tool (**ndb\_setup.py**) is deprecated in NDB 7.5.20, and is removed in NDB 7.5.21 and later. It is no longer supported.

* **ndbmemcache deprecation and removal.** `ndbmemcache` is no longer supported. `ndbmemcache` was deprecated in NDB 7.5.20, and removed in NDB 7.5.21.

* **Node.js support removed.** Beginning with the NDB Cluster 7.5.20 release, support for Node.js by NDB 7.5 has been removed.

  Support for Node.js by NDB Cluster is maintained in NDB 8.0 only.

* **Conversion between NULL and NOT NULL during restore operations.** Beginning with NDB 7.5.23, **ndb\_restore** can support restoring of `NULL` columns as `NOT NULL` and the reverse, using the options listed here:

  + To restore a `NULL` column as `NOT NULL`, use the `--lossy-conversions` option.

    The column originally declared as `NULL` must not contain any `NULL` rows; if it does, **ndb\_restore** exits with an error.

  + To restore a `NOT NULL` column as `NULL`, use the `--promote-attributes` option.

  For more information, see the descriptions of the indicated **ndb\_restore** options.

* **OpenSSL 3.0 support.** Beginning with NDB 7.5.31, all MySQL server and client binaries included in the `NDB` distribution are compiled with support for Open SSL 3.0

ClusterJPA is no longer supported beginning with NDB 7.5.7; its source code and binary have been removed from the NDB Cluster distribution.

NDB Cluster 7.5 is also supported by MySQL Cluster Manager, which provides an advanced command-line interface that can simplify many complex NDB Cluster management tasks. See MySQL Cluster Manager 1.4.8 User Manual, for more information.


#### 21.2.4.2 What is New in NDB Cluster 7.6

New features and other important changes in NDB Cluster 7.6 which are likely to be of interest are shown in the following list:

* **New Disk Data table file format.** A new file format is used in NDB 7.6 for NDB Disk Data tables, which makes it possible for each Disk Data table to be uniquely identified without reusing any table IDs. This should help resolve issues with page and extent handling that were visible to the user as problems with rapid creating and dropping of Disk Data tables, and for which the old format did not provide a ready means to fix.

  The new format is now used whenever new undo log file groups and tablespace data files are created. Files relating to existing Disk Data tables continue to use the old format until their tablespaces and undo log file groups are re-created.

  Important

  The old and new formats are not compatible; different data files or undo log files that are used by the same Disk Data table or tablespace cannot use a mix of formats.

  To avoid problems relating to the changes in format, you should re-create any existing tablespaces and undo log file groups when upgrading to NDB 7.6. You can do this by performing an initial restart of each data node (that is, using the `--initial` option) as part of the upgrade process. You can expect this step to be made mandatory as part of upgrading from NDB 7.5 or an earlier release series to NDB 7.6 or later.

  If you are using Disk Data tables, a downgrade from *any* NDB 7.6 release—without regard to release status—to any NDB 7.5 or earlier release requires that you restart all data nodes with `--initial` as part of the downgrade process. This is because NDB 7.5 and earlier release series are not able to read the new Disk Data file format.

  For more information, see Section 21.3.7, “Upgrading and Downgrading NDB Cluster”.

* **Data memory pooling and dynamic index memory.** Memory required for indexes on `NDB` table columns is now allocated dynamically from that allocated for `DataMemory`. For this reason, the `IndexMemory` configuration parameter is now deprecated, and subject to removal in a future release series.

  Important

  In NDB 7.6, if `IndexMemory` is set in the `config.ini` file, the management server issues the warning IndexMemory is deprecated, use Number bytes on each ndbd(DB) node allocated for storing indexes instead on startup, and any memory assigned to this parameter is automatically added to `DataMemory`.

  In addition, the default value for `DataMemory` has been increased to 98M; the default for `IndexMemory` has been decreased to 0.

  The pooling together of index memory with data memory simplifies the configuration of `NDB`; a further benefit of these changes is that scaling up by increasing the number of LDM threads is no longer limited by having set an insufficiently large value for `IndexMemory`.This is because index memory is no longer a static quantity which is allocated only once (when the cluster starts), but can now be allocated and deallocated as required. Previously, it was sometimes the case that increasing the number of LDM threads could lead to index memory exhaustion while large amounts of `DataMemory` remained available.

  As part of this work, a number of instances of `DataMemory` usage not directly related to storage of table data now use transaction memory instead.

  For this reason, it may be necessary on some systems to increase `SharedGlobalMemory` to allow transaction memory to increase when needed, such as when using NDB Cluster Replication, which requires a great deal of buffering on the data nodes. On systems performing initial bulk loads of data, it may be necessary to break up very large transactions into smaller parts.

  In addition, data nodes now generate `MemoryUsage` events (see Section 21.6.3.2, “NDB Cluster Log Events”) and write appropriate messages in the cluster log when resource usage reaches 99%, as well as when it reaches 80%, 90%, or 100%, as before.

  Other related changes are listed here:

  + `IndexMemory` is no longer one of the values displayed in the `ndbinfo.memoryusage` table's `memory_type` column; is also no longer displayed in the output of **ndb\_config**.

  + `REPORT MEMORYUSAGE` and other commands which expose memory consumption now shows index memory consumption using 32K pages (previously these were 8K pages).

  + The `ndbinfo.resources` table now shows the `DISK_OPERATIONS` resource as `TRANSACTION_MEMORY`, and the `RESERVED` resource has been removed.

* **ndbinfo processes and config\_nodes tables.** NDB 7.6 adds two tables to the `ndbinfo` information database to provide information about cluster nodes; these tables are listed here:

  + `config_nodes`: This table the node ID, process type, and host name for each node listed in an NDB cluster's configuration file.

  + The `processes` shows information about nodes currently connected to the cluster; this information includes the process name and system process ID; for each data node and SQL node, it also shows the process ID of the node's angel process. In addition, the table shows a service address for each connected node; this address can be set in NDB API applications using the `Ndb_cluster_connection::set_service_uri()` method, which is also added in NDB 7.6.

* **System name.** The system name of an NDB cluster can be used to identify a specific cluster. In NDB 7.6, the MySQL Server shows this name as the value of the `Ndb_system_name` status variable; NDB API applications can use the `Ndb_cluster_connection::get_system_name()` method which is added in the same release.

  A system name based on the time the management server was started is generated automatically>; you can override this value by adding a `[system]` section to the cluster's configuration file and setting the `Name` parameter to a value of your choice in this section, prior to starting the management server.

* **ndb\_import CSV import tool.** **ndb\_import**, added in NDB Cluster 7.6, loads CSV-formatted data directly into an `NDB` table using the NDB API (a MySQL server is needed only to create the table and database in which it is located). **ndb\_import** can be regarded as an analog of **mysqlimport** or the `LOAD DATA` SQL statement, and supports many of the same or similar options for formatting of the data.

  Assuming that the database and target `NDB` table exist, **ndb\_import** needs only a connection to the cluster's management server (**ndb\_mgmd**) to perform the importation; for this reason, there must be an `[api]` slot available to the tool in the cluster's `config.ini` file purpose.

  See Section 21.5.14, “ndb\_import — Import CSV Data Into NDB”, for more information.

* **ndb\_top monitoring tool.** Added the **ndb\_top** utility, which shows CPU load and usage information for an `NDB` data node in real time. This information can be displayed in text format, as an ASCII graph, or both. The graph can be shown in color, or using grayscale.

  **ndb\_top** connects to an NDB Cluster SQL node (that is, a MySQL Server). For this reason, the program must be able to connect as a MySQL user having the `SELECT` privilege on tables in the `ndbinfo` database.

  **ndb\_top** is available for Linux, Solaris, and macOS platforms, but is not currently available for Windows platforms.

  For more information, see Section 21.5.29, “ndb\_top — View CPU usage information for NDB threads”.

* **Code cleanup.** A significant number of debugging statements and printouts not necessary for normal operations have been moved into code used only when testing or debugging `NDB`, or dispensed with altogether. This removal of overhead should result in a noticeable improvement in the performance of LDM and TC threads on the order of 10% in many cases.

* **LDM thread and LCP improvements.** Previously, when a local data management thread experienced I/O lag, it wrote to local checkpoints more slowly. This could happen, for example, during a disk overload condition. Problems could occur because other LDM threads did not always observe this state, or do likewise. `NDB` now tracks I/O lag mode globally, so that this state is reported as soon as at least one thread is writing in I/O lag mode; it then makes sure that the reduced write speed for this LCP is enforced for all LDM threads for the duration of the slowdown condition. Because the reduction in write speed is now observed by other LDM instances, overall capacity is increased; this enables the disk overload (or other condition inducing I/O lag) to be overcome more quickly in such cases than it was previously.

* **NDB error identification.** Error messages and information can be obtained using the **mysql** client in NDB 7.6 from a new `error_messages` table in the `ndbinfo` information database. In addition, NDB 7.6 introduces a new command-line client **ndb\_perror** for obtaining information from NDB error codes; this replaces using **perror** with `--ndb`, which is now deprecated and subject to removal in a future release.

  For more information, see Section 21.6.15.21, “The ndbinfo error\_messages Table”, and Section 21.5.17, “ndb\_perror — Obtain NDB Error Message Information”.

* **SPJ improvements.** When executing a scan as a pushed join (that is, the root of the query is a scan), the `DBTC` block sends an SPJ request to a `DBSPJ` instance on the same node as the fragment to be scanned. Formerly, one such request was sent for each of the node's fragments. As the number of `DBTC` and `DBSPJ` instances is normally set less than the number of LDM instances, this means that all SPJ instances were involved in the execution of a single query, and, in fact, some SPJ instances could (and did) receive multiple requests from the same query. NDB 7.6 makes it possible for a single SPJ request to handle a set of root fragments to be scanned, so that only a single SPJ request (`SCAN_FRAGREQ`) needs to be sent to any given SPJ instance (`DBSPJ` block) on each node.

  Since `DBSPJ` consumes a relatively small amount of the total CPU used when evaluating a pushed join, unlike the LDM block (which is repsonsible for the majority of the CPU usage), introducing multiple SPJ blocks adds some parallelism, but the additional overhead also increases. By enabling a single SPJ request to handle a set of root fragments to be scanned, such that only a single SPJ request is sent to each `DBSPJ` instance on each node and batch sizes are allocated per fragment, the multi-fragment scan can obtain a larger total batch size, allowing for some scheduling optimizations to be done within the SPJ block, which can scan a single fragment at a time (giving it the total batch size allocation), scan all fragments in parallel using smaller sub-batches, or some combination of the two.

  This work is expected to increase performance of pushed-down joins for the following reasons:

  + Since multiple root fragments can be scanned for each SPJ request, it is necessary to request fewer SPJ instances when executing a pushed join

  + Increased available batch size allocation, and for each fragment, should also in most cases result in fewer requests being needed to complete a join

* **Improved O\_DIRECT handling for redo logs.** NDB 7.6 provides a new data node configuration parameter `ODirectSyncFlag` which causes completed redo log writes using `O_DIRECT` to be handled as `fsync` calls. `ODirectSyncFlag` is disabled by default; to enable it, set it to `true`.

  You should bear in mind that the setting for this parameter is ignored when at least one of the following conditions is true:

  + `ODirect` is not enabled.

  + `InitFragmentLogFiles` is set to `SPARSE`.

* **Locking of CPUs to offline index build threads.** In NDB 7.6, offline index builds by default use all cores available to **ndbmtd**"), instead of being limited to the single core reserved for the I/O thread. It also becomes possible to specify a desired set of cores to be used for I/O threads performing offline multithreaded builds of ordered indexes. This can improve restart and restore times and performance, as well as availability.

  Note

  “Offline” as used here refers to an ordered index build that takes place while a given table is not being written to. Such index builds occur during a node or system restart, or when restoring a cluster from backup using **ndb\_restore** `--rebuild-indexes`.

  This improvement involves several related changes. The first of these is to change the default value for the `BuildIndexThreads` configuration parameter (from 0 to 128), means that offline ordered index builds are now multithreaded by default. The default value for the `TwoPassInitialNodeRestartCopy` is also changed (from `false` to `true`), so that an initial node restart first copies all data without any creation of indexes from a “live” node to the node which is being started, builds the ordered indexes offline after the data has been copied, then again synchronizes with the live node; this can significantly reduce the time required for building indexes. In addition, to facilitate explicit locking of offline index build threads to specific CPUs, a new thread type (`idxbld`) is defined for the `ThreadConfig` configuration parameter.

  As part of this work, `NDB` can now distinguish between execution thread types and other types of threads, and between types of threads which are permanently assigned to specific tasks, and those whose assignments are merely temporary.

  NDB 7.6 also introduces the `nosend` parameter for `ThreadCOnfig`. By setting this to 1, you can keep a `main`, `ldm`, `rep`, or `tc` thread from assisting the send threads. This parameter is 0 by default, and cannot be used with I/O threads, send threads, index build threads, or watchdog threads.

  For additonal information, see the descriptions of the parameters.

* **Variable batch sizes for DDL bulk data operations.** As part of work ongoing to optimize bulk DDL performance by **ndbmtd**"), it is now possible to obtain performance improvements by increasing the batch size for the bulk data parts of DDL operations processing data using scans. Batch sizes are now made configurable for unique index builds, foreign key builds, and online reorganization, by setting the respective data node configuration parameters listed here:

  + `MaxUIBuildBatchSize`: Maximum scan batch size used for building unique keys.

  + `MaxFKBuildBatchSize`: Maximum scan batch size used for building foreign keys.

  + `MaxReorgBuildBatchSize`: Maximum scan batch size used for reorganization of table partitions.

  For each of the parameters just listed, the default value is 64, the minimum is 16, and the maximum is 512.

  Increasing the appropriate batch size or sizes can help amortize inter-thread and inter-node latencies and make use of more parallel resources (local and remote) to help scale DDL performance. In each case there can be a tradeoff with ongoing traffic.

* **Partial LCPs.** NDB 7.6 implements partial local checkpoints. Formerly, an LCP always made a copy of the entire database. When working with terabytes of data this process could require a great deal of time, with an adverse impact on node and cluster restarts especially, as well as more space for the redo logs. It is now no longer strictly necessary for LCPs to do this—instead, an LCP now by default saves only a number of records that is based on the quantity of data changed since the previous LCP. This can vary between a full checkpoint and a checkpoint that changes nothing at all. In the event that the checkpoint reflects any changes, the minimum is to write one part of the 2048 making up a local LCP.

  As part of this change, two new data node configuration parameters are inroduced in this release: `EnablePartialLcp` (default `true`, or enabled) enables partial LCPs. `RecoveryWork` controls the percentage of space given over to LCPs; it increases with the amount of work which must be performed on LCPs during restarts as opposed to that performed during normal operations. Raising this value causes LCPs during normal operations to require writing fewer records and so decreases the usual workload. Raising this value also means that restarts can take longer.

  You must disable partial LCPs explicitly by setting `EnablePartialLcp=false`. This uses the least amount of disk, but also tends to maximize the write load for LCPs. To optimize for the lowest workload on LCPs during normal operation, use `EnablePartialLcp=true` and `RecoveryWork=100`. To use the least disk space for partial LCPs, but with bounded writes, use `EnablePartialLcp=true` and `RecoveryWork=25`, which is the minimum for `RecoveryWork`. The default is `EnablePartialLcp=true` with `RecoveryWork=50`, which means LCP files require approximately 1.5 times `DataMemory`; using `CompressedLcp=1`, this can be further reduced by half. Recovery times using the default settings should also be much faster than when `EnablePartialLcp` is set to `false`.

  Note

  The default value for `RecoveryWork` was increased from 50 to 60.

  In addition the data node configuration parameters `BackupDataBufferSize`, `BackupWriteSize`, and `BackupMaxWriteSize` are all now deprecated, and subject to removal in a future release of MySQL NDB Cluster.

  As part of this enhancement, work has been done to correct several issues with node restarts wherein it was possible to run out of undo log in various situations, most often when restoring a node that had been down for a long time during a period of intensive write activity.

  Additional work was done to improve data node survival of long periods of synchronization without timing out, by updating the LCP watchdog during this process, and keeping better track of the progress of disk data synchronization. Previously, there was the possibility of spurious warnings or even node failures if synchronization took longer than the LCP watchdog timeout.

  Important

  When upgrading an NDB Cluster that uses disk data tables to NDB 7.6 or downgrading it from NDB 7.6, it is necessary to restart all data nodes with `--initial`.

* **Parallel undo log record processing.** Formerly, the data node `LGMAN` kernel block processed undo log records serially; now this is done in parallel. The rep thread, which hands off undo records to LDM threads, waited for an LDM to finish applying a record before fetching the next one; now the rep thread no longer waits, but proceeds immediately to the next record and LDM.

  A count of the number of outstanding log records for each LDM in `LGMAN` is kept, and decremented whenever an LDM has completed the execution of a record. All the records belonging to a page are sent to the same LDM thread but are not guaranteed to be processed in order, so a hash map of pages that have outstanding records maintains a queue for each of these pages. When the page is available in the page cache, all records pending in the queue are applied in order.

  A few types of records continue to be processed serially: `UNDO_LCP`, `UNDO_LCP_FIRST`, `UNDO_LOCAL_LCP`, `UNDO_LOCAL_LCP_FIRST`, `UNDO_DROP`, and `UNDO_END`.

  There are no user-visible changes in functionality directly associated with this performance enhancement; it is part of work done to improve undo long handling in support of partial local checkpoints in NDB Cluster 7.6.

* **Reading table and fragment IDs from extent for undo log applier.** When applying an undo log, it is necessary to obtain the table ID and fragment ID from the page ID. This was done previously by reading the page from the `PGMAN` kernel block using an extra `PGMAN` worker thread, but when applying the undo log it was necessary to read the page again.

  when using `O_DIRECT` this was very inefficient since the page was not cached in the OS kernel. To correct this issue, mapping from page ID to table ID and fragment ID is now done using information from the extent header the table IDs and fragment IDs for the pages used within a given extent. The extent pages are always present in the page cache, so no extra reads from disk are required for performing the mapping. In addition, the information can already be read, using existing `TSMAN` kernel block data structures.

  See the description of the `ODirect` data node configuration parameter, for more information.

* **Shared memory transporter.** User-defined shared memory (SHM) connections between a data node and an API node on the same host computer are fully supported in NDB 7.6, and are no longer considered experimental. You can enable an explicit shared memory connection by setting the `UseShm` configuration parameter to `1` for the relevant data node. When explicitly defining shared memory as the connection method, it is also necessary that both the data node and the API node are identified by `HostName`.

  Performance of SHM connections can be enhanced through setting parameters such as `ShmSize`, `ShmSpintime`, and `SendBufferMemory` in an `[shm]` or `[shm default]` section of the cluster configuration file (`config.ini`). Configuration of SHM is otherwise similar to that of the TCP transporter.

  The `SigNum` parameter is not used in the new SHM implementation, and any settings made for it are now ignored. Section 21.4.3.12, “NDB Cluster Shared Memory Connections”, provides more information about these parameters. In addition, as part of this work, `NDB` code relating to the old SCI transporter has been removed.

  For more information, see Section 21.4.3.12, “NDB Cluster Shared Memory Connections”.

* **SPJ block inner join optimization.** In NDB 7.6, the `SPJ` kernel block can take into account when it is evaluating a join request in which at least some of the tables are INNER-joined. This means that it can eliminate requests for row, ranges, or both as soon as it becomes known that one or more of the preceding requests did not return any results for a parent row. This saves both the data nodes and the `SPJ` block from having to handle requests and result rows which never take part in an INNER-joined result row.

  Consider this join query, where `pk` is the primary key on tables t2, t3, and t4, and columns x, y, and z are nonindexed columns:

  ```sql
  SELECT * FROM t1
    JOIN t2 ON t2.pk = t1.x
    JOIN t3 ON t3.pk = t1.y
    JOIN t4 ON t4.pk = t1.z;
  ```

  Previously, this resulted in an `SPJ` request including a scan on table `t1`, and lookups on each of the tables `t2`, `t3`, and `t4`; these were evaluated for every row returned from `t1`. For these, `SPJ` created `LQHKEYREQ` requests for tables `t2`, `t3`, and `t4`. Now `SPJ` takes into consideration the requirement that, to produce any result rows, an inner join must find a match in all tables joined; as soon as no matches are found for one of the tables, any further requests to tables having the same parent or tables are now skipped.

  Note

  This optimization cannot be applied until all of the data nodes and all of the API nodes in the cluster have been upgraded to NDB 7.6.

* **NDB wakeup thread.** `NDB` uses a poll receiver to read from sockets, to execute messages from the sockets, and to wake up other threads. When making only intermittent use of a receive thread, poll ownership is given up before starting to wake up other threads, which provides some degree of parallelism in the receive thread, but, when making constant use of the receive thread, the thread can be overburdened by tasks including wakeup of other threads.

  NDB 7.6 supports offloading by the receiver thread of the task of waking up other threads to a new thread that wakes up other threads on request (and otherwise simply sleeps), making it possible to improve the capacity of a single cluster connection by roughly ten to twenty percent.

* **Adaptive LCP control.**

  NDB 7.6.7 implements an adaptive LCP control mechanism which acts in response to changes in redo log space usage. By controlling LCP disk write speed, you can help protect against a number of resource-related issues, including the following:

  + Insufficient CPU resources for traffic applications
  + Disk overload
  + Insufficient redo log buffer
  + GCP Stop conditions
  + Insufficient redo log space
  + Insufficient undo log space

  This work includes the following changes relating to `NDB` configuration parameters:

  + The default value of the `RecoveryWork` data node parameter is increased from 50 to 60; that is, `NDB` now uses 1.6 times the size of the data for storage of LCPs.

  + A new data node configuration parameter `InsertRecoveryWork` provides additional tuning capabilities through controlling the percentage of `RecoveryWork` that is reserved for insert operations. The default value is 40 (that is, 40% of the storage space already reserved by `RecoveryWork`); the minimum and maximum are 0 and 70, respectively. Increasing this value allows for more writes to be performed during an LCP, while limiting the total size of the LCP. Decreasing `InsertRecoveryWork` limits the number of writes used during an LCP, but results in more space being used for the LCP, which means that recovery takes longer.

  This work implements control of LCP speed chiefly to minimize the risk of running out of redo log. This is done in adapative fashion, based on the amount of redo log space used, using the alert levels, with the responses taken when these levels are attained, shown here:

  + **Low**: Redo log space usage is greater than 25%, or estimated usage shows insufficient redo log space at a very high transaction rate. In response, use of LCP data buffers is increased during LCP scans, priority of LCP scans is increased, and the amount of data that can be written per real-time break in an LCP scan is also increased.

  + **High**: Redo log space usage is greater than 40%, or estimate to run out of redo log space at a high transaction rate. When this level of usage is reached, `MaxDiskWriteSpeed` is increased to the value of `MaxDiskWriteSpeedOtherNodeRestart`. In addition, the minimum speed is doubled, and priority of LCP scans and what can be written per real-time break are both increased further.

  + **Critical**: Redo log space usage is greater than 60%, or estimated usage shows insufficient redo log space at a normal transaction rate. At this level, `MaxDiskWriteSpeed` is increased to the value of `MaxDiskWriteSpeedOwnRestart`; `MinDiskWriteSpeed` is also set to this value. Priority of LCP scans and the amount of data that can be written per real-time break are increased further, and the LCP data buffer is completely available during the LCP scan.

  Raising the level also has the effect of increasing the calculated target checkpoint speed.

  LCP control has the following benefits for `NDB` installations:

  + Clusters should now survive very heavy loads using default configurations much better than previously.

  + It should now be possible for `NDB` to run reliably on systems where the available disk space is (at a rough minimum) 2.1 times the amount of memory allocated to it (`DataMemory`). You should note that this figure does *not* include any disk space used for Disk Data tables.

* **ndb\_restore options.** Beginning with NDB 7.6.9, the `--nodeid` and `--backupid` options are both required when invoking **ndb\_restore**.

* **Restoring by slices.** Beginning with NDB 7.6.13, it is possible to divide a backup into roughly equal portions (slices) and to restore these slices in parallel using two new options implemented for **ndb\_restore**:

  + `--num-slices` determines the number of slices into which the backup should be divided.

  + `--slice-id` provides the ID of the slice to be restored by the current instance of **ndb\_restore**.

  This makes it possible to employ multiple instances of **ndb\_restore** to restore subsets of the backup in parallel, potentially reducing the amount of time required to perform the restore operation.

  For more information, see the description of the **ndb\_restore** `--num-slices` option.

* **ndb\_restore: primary key schema changes.** NDB 7.6.14 (and later) supports different primary key definitions for source and target tables when restoring an `NDB` native backup with **ndb\_restore** when it is run with the `--allow-pk-changes` option. Both increasing and decreasing the number of columns making up the original primary key are supported.

  When the primary key is extended with an additional column or columns, any columns added must be defined as `NOT NULL`, and no values in any such columns may be changed during the time that the backup is being taken. Because some applications set all column values in a row when updating it, whether or not all values are actually changed, this can cause a restore operation to fail even if no values in the column to be added to the primary key have changed. You can override this behavior using the `--ignore-extended-pk-updates` option also added in NDB 7.6.14; in this case, you must ensure that no such values are changed.

  A column can be removed from the table's primary key whether or not this column remains part of the table.

  For more information, see the description of the `--allow-pk-changes` option for **ndb\_restore**.

* **ndb\_blob\_tool enhancements.** Beginning with NDB 7.6.14, the **ndb\_blob\_tool** utility can detect missing blob parts for which inline parts exist and replace these with placeholder blob parts (consisting of space characters) of the correct length. To check whether there are missing blob parts, use the `--check-missing` option with this program. To replace any missing blob parts with placeholders, use the `--add-missing` option.

  For more information, see Section 21.5.6, “ndb\_blob\_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables”.

* **Merging backups with ndb\_restore.** In some cases, it may be desirable to consolidate data originally stored in different instances of NDB Cluster (all using the same schema) into a single target NDB Cluster. This is now supported when using backups created in the **ndb\_mgm** client (see Section 21.6.8.2, “Using The NDB Cluster Management Client to Create a Backup”) and restoring them with **ndb\_restore**, using the `--remap-column` option added in NDB 7.6.14 along with `--restore-data` (and possibly additional compatible options as needed or desired). `--remap-column` can be employed to handle cases in which primary and unique key values are overlapping between source clusters, and it is necessary that they do not overlap in the target cluster, as well as to preserve other relationships between tables such as foreign keys.

  `--remap-column` takes as its argument a string having the format `db.tbl.col:fn:args`, where *`db`*, *`tbl`*, and *`col`* are, respectively, the names of the database, table, and column, *`fn`* is the name of a remapping function, and *`args`* is one or more arguments to *`fn`*. There is no default value. Only `offset` is supported as the function name, with *`args`* as the integer offset to be applied to the value of the column when inserting it into the target table from the backup. This column must be one of `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") or `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"); the allowed range of the offset value is the same as the signed version of that type (this allows the offset to be negative if desired).

  The new option can be used multiple times in the same invocation of **ndb\_restore**, so that you can remap to new values multiple columns of the same table, different tables, or both. The offset value does not have to be the same for all instances of the option.

  In addition, two new options are provided for **ndb\_desc**, also beginning in NDB 7.6.14:

  + `--auto-inc` (short form `-a`): Includes the next auto-increment value in the output, if the table has an `AUTO_INCREMENT` column.

  + `--context` (short form `-x`): Provides extra information about the table, including the schema, database name, table name, and internal ID.

  For more information and examples, see the description of the `--remap-column` option.

* **--ndb-log-fail-terminate option.** Beginning with NDB 7.6.14, you can cause the SQL node to terminate whenever it is unable to log all row events fully. This can be done by starting `mysqld` with the `--ndb-log-fail-terminate` option.

* **NDB programs—NDBT dependency removal.** The dependency of a number of `NDB` utility programs on the `NDBT` library has been removed. This library is used internally for development, and is not required for normal use; its inclusion in these programs could lead to unwanted issues when testing.

  Affected programs are listed here, along with the `NDB` versions in which the dependency was removed:

  + **ndb\_restore**, in NDB 7.6.11
  + **ndb\_show\_tables**, in NDB 7.6.14
  + **ndb\_waiter**, in NDB 7.6.14

  The principal effect of this change for users is that these programs no longer print `NDBT_ProgramExit - status` following completion of a run. Applications that depend upon such behavior should be updated to reflect the change when upgrading to the indicated versions.

* **Auto-Installer deprecation and removal.** The MySQL NDB Cluster Auto-Installer web-based installation tool (**ndb\_setup.py**) is deprecated in NDB 7.6.16, and is removed in NDB 7.6.17 and later. It is no longer supported.

* **ndbmemcache deprecation and removal.** `ndbmemcache` is no longer supported. `ndbmemcache` was deprecated in NDB 7.6.16, and removed in NDB 7.6.17.

* **Node.js support removed.** Beginning with the NDB Cluster 7.6.16 release, support for Node.js by NDB 7.6 has been removed.

  Support for Node.js by NDB Cluster is maintained in NDB 8.0 only.

* **Conversion between NULL and NOT NULL during restore operations.** Beginning with NDB 7.6.19, **ndb\_restore** can support restoring of `NULL` columns as `NOT NULL` and the reverse, using the options listed here:

  + To restore a `NULL` column as `NOT NULL`, use the `--lossy-conversions` option.

    The column originally declared as `NULL` must not contain any `NULL` rows; if it does, **ndb\_restore** exits with an error.

  + To restore a `NOT NULL` column as `NULL`, use the `--promote-attributes` option.

  For more information, see the descriptions of the indicated **ndb\_restore** options.

* **OpenSSL 3.0 support.** Beginning with NDB 7.6.27, all MySQL server and client binaries included in the `NDB` distribution are compiled with support for Open SSL 3.0

* **mysql client --commands option.** The **mysql** client `--commands` option, added in NDB 7.6.35, enables or disables most **mysql** client commands.

  This option is enabled by default. To disable it, start the **mysql** client with `--commands=OFF` or `--skip-commands`.

  For more information, see Section 4.5.1.1, “mysql Client Options”.


### 21.2.5 NDB: Added, Deprecated, and Removed Options, Variables, and Parameters


#### 21.2.5.1 Options, Variables, and Parameters Added, Deprecated or Removed in NDB 7.5

* Parameters Introduced in NDB 7.5
* Parameters Deprecated in NDB 7.5
* Parameters Removed in NDB 7.5
* Options and Variables Introduced in NDB 7.5
* Options and Variables Deprecated in NDB 7.5
* Options and Variables Removed in NDB 7.5

The next few sections contain information about `NDB` node configuration parameters and NDB-specific `mysqld` options and variables that have been added to, deprecated in, or removed from NDB 7.5.

##### Parameters Introduced in NDB 7.5

The following node configuration parameters have been added in NDB 7.5.

* `ApiVerbose`: Enable NDB API debugging; for NDB development. Added in NDB 7.5.2.

##### Parameters Deprecated in NDB 7.5

The following node configuration parameters have been deprecated in NDB 7.5.

* `ExecuteOnComputer`: String referencing earlier defined COMPUTER. Deprecated in NDB 7.5.0.

* `ExecuteOnComputer`: String referencing earlier defined COMPUTER. Deprecated in NDB 7.5.0.

* `ExecuteOnComputer`: String referencing earlier defined COMPUTER. Deprecated in NDB 7.5.0.

##### Parameters Removed in NDB 7.5

The following node configuration parameters have been removed in NDB 7.5.

* `DiskCheckpointSpeed`: Bytes allowed to be written by checkpoint, per second. Removed in NDB 7.5.0.

* `DiskCheckpointSpeedInRestart`: Bytes allowed to be written by checkpoint during restart, per second. Removed in NDB 7.5.0.

* `Id`: Number identifying data node. Now deprecated; use NodeId instead. Removed in NDB 7.5.0.

* `MaxNoOfSavedEvents`: Not used. Removed in NDB 7.5.0.

* `PortNumber`: Port used for SCI transporter. Removed in NDB 7.5.1.

* `PortNumber`: Port used for SHM transporter. Removed in NDB 7.5.1.

* `PortNumber`: Port used for TCP transporter. Removed in NDB 7.5.1.

* `ReservedSendBufferMemory`: This parameter is present in NDB code but is not enabled. Removed in NDB 7.5.2.

##### Options and Variables Introduced in NDB 7.5

The following system variables, status variables, and server options have been added in NDB 7.5.

* `Ndb_system_name`: Configured cluster system name; empty if server not connected to NDB. Added in NDB 5.7.18-ndb-7.5.7.

* `ndb-allow-copying-alter-table`: Set to OFF to keep ALTER TABLE from using copying operations on NDB tables. Added in NDB 5.7.10-ndb-7.5.0.

* `ndb-cluster-connection-pool-nodeids`: Comma-separated list of node IDs for connections to cluster used by MySQL; number of nodes in list must match value set for --ndb-cluster-connection-pool. Added in NDB 5.7.10-ndb-7.5.0.

* `ndb-default-column-format`: Use this value (FIXED or DYNAMIC) by default for COLUMN\_FORMAT and ROW\_FORMAT options when creating or adding table columns. Added in NDB 5.7.11-ndb-7.5.1.

* `ndb-log-fail-terminate`: Terminate mysqld process if complete logging of all found row events is not possible. Added in NDB 5.7.29-ndb-7.5.18.

* `ndb-log-update-minimal`: Log updates in minimal format. Added in NDB 5.7.18-ndb-7.5.7.

* `ndb_data_node_neighbour`: Specifies cluster data node "closest" to this MySQL Server, for transaction hinting and fully replicated tables. Added in NDB 5.7.12-ndb-7.5.2.

* `ndb_default_column_format`: Sets default row format and column format (FIXED or DYNAMIC) used for new NDB tables. Added in NDB 5.7.11-ndb-7.5.1.

* `ndb_fully_replicated`: Whether new NDB tables are fully replicated. Added in NDB 5.7.12-ndb-7.5.2.

* `ndb_read_backup`: Enable read from any replica for all NDB tables; use NDB\_TABLE=READ\_BACKUP={0|1} with CREATE TABLE or ALTER TABLE to enable or disable for individual NDB tables. Added in NDB 5.7.12-ndb-7.5.2.

##### Options and Variables Deprecated in NDB 7.5

No system variables, status variables, or server options have been deprecated in NDB 7.5.

##### Options and Variables Removed in NDB 7.5

No system variables, status variables, or options have been removed in NDB 7.5.


#### 21.2.5.2 Options, Variables, and Parameters Added, Deprecated or Removed in NDB 7.6

* Parameters Introduced in NDB 7.6
* Parameters Deprecated in NDB 7.6
* Parameters Removed in NDB 7.6
* Options and Variables Introduced in NDB 7.6
* Options and Variables Deprecated in NDB 7.6
* Options and Variables Removed in NDB 7.6

The next few sections contain information about `NDB` node configuration parameters and NDB-specific `mysqld` options and variables that have been added to, deprecated in, or removed from NDB 7.6.

##### Parameters Introduced in NDB 7.6

The following node configuration parameters have been added in NDB 7.6.

* `ApiFailureHandlingTimeout`: Maximum time for API node failure handling before escalating. 0 means no time limit; minimum usable value is

  10. Added in NDB 7.6.34.
* `EnablePartialLcp`: Enable partial LCP (true); if this is disabled (false), all LCPs write full checkpoints. Added in NDB 7.6.4.

* `EnableRedoControl`: Enable adaptive checkpointing speed for controlling redo log usage. Added in NDB 7.6.7.

* `InsertRecoveryWork`: Percentage of RecoveryWork used for inserted rows; has no effect unless partial local checkpoints are in use. Added in NDB 7.6.5.

* `LocationDomainId`: Assign this API node to specific availability domain or zone. 0 (default) leaves this unset. Added in NDB 7.6.4.

* `LocationDomainId`: Assign this management node to specific availability domain or zone. 0 (default) leaves this unset. Added in NDB 7.6.4.

* `LocationDomainId`: Assign this data node to specific availability domain or zone. 0 (default) leaves this unset. Added in NDB 7.6.4.

* `MaxFKBuildBatchSize`: Maximum scan batch size to use for building foreign keys. Increasing this value may speed up builds of foreign keys but impacts ongoing traffic as well. Added in NDB 7.6.4.

* `MaxReorgBuildBatchSize`: Maximum scan batch size to use for reorganization of table partitions. Increasing this value may speed up table partition reorganization but impacts ongoing traffic as well. Added in NDB 7.6.4.

* `MaxUIBuildBatchSize`: Maximum scan batch size to use for building unique keys. Increasing this value may speed up builds of unique keys but impacts ongoing traffic as well. Added in NDB 7.6.4.

* `ODirectSyncFlag`: O\_DIRECT writes are treated as synchronized writes; ignored when ODirect is not enabled, InitFragmentLogFiles is set to SPARSE, or both. Added in NDB 7.6.4.

* `PreSendChecksum`: If this parameter and Checksum are both enabled, perform pre-send checksum checks, and check all SHM signals between nodes for errors. Added in NDB 7.6.6.

* `PreSendChecksum`: If this parameter and Checksum are both enabled, perform pre-send checksum checks, and check all TCP signals between nodes for errors. Added in NDB 7.6.6.

* `RecoveryWork`: Percentage of storage overhead for LCP files: greater value means less work in normal operations, more work during recovery. Added in NDB 7.6.4.

* `SendBufferMemory`: Bytes in shared memory buffer for signals sent from this node. Added in NDB 7.6.6.

* `ShmSpinTime`: When receiving, number of microseconds to spin before sleeping. Added in NDB 7.6.6.

* `UseShm`: Use shared memory connections between this data node and API node also running on this host. Added in NDB 7.6.6.

* `WatchDogImmediateKill`: When true, threads are immediately killed whenever watchdog issues occur; used for testing and debugging. Added in NDB 7.6.7.

##### Parameters Deprecated in NDB 7.6

The following node configuration parameters have been deprecated in NDB 7.6.

* `BackupDataBufferSize`: Default size of databuffer for backup (in bytes). Deprecated in NDB 7.6.4.

* `BackupMaxWriteSize`: Maximum size of file system writes made by backup (in bytes). Deprecated in NDB 7.6.4.

* `BackupWriteSize`: Default size of file system writes made by backup (in bytes). Deprecated in NDB 7.6.4.

* `IndexMemory`: Number of bytes on each data node allocated for storing indexes; subject to available system RAM and size of DataMemory. Deprecated in NDB 7.6.2.

* `Signum`: Signal number to be used for signalling. Deprecated in NDB 7.6.6.

##### Parameters Removed in NDB 7.6

No node configuration parameters have been removed in NDB 7.6.

##### Options and Variables Introduced in NDB 7.6

The following system variables, status variables, and server options have been added in NDB 7.6.

* `Ndb_system_name`: Configured cluster system name; empty if server not connected to NDB. Added in NDB 5.7.18-ndb-7.6.2.

* `ndb-log-fail-terminate`: Terminate mysqld process if complete logging of all found row events is not possible. Added in NDB 5.7.29-ndb-7.6.14.

* `ndb-log-update-minimal`: Log updates in minimal format. Added in NDB 5.7.18-ndb-7.6.3.

* `ndb_row_checksum`: When enabled, set row checksums; enabled by default. Added in NDB 5.7.23-ndb-7.6.8.

##### Options and Variables Deprecated in NDB 7.6

No system variables, status variables, or server options have been deprecated in NDB 7.6.

##### Options and Variables Removed in NDB 7.6

No system variables, status variables, or options have been removed in NDB 7.6.


### 21.2.6 MySQL Server Using InnoDB Compared with NDB Cluster

MySQL Server offers a number of choices in storage engines. Since both `NDB` and `InnoDB` can serve as transactional MySQL storage engines, users of MySQL Server sometimes become interested in NDB Cluster. They see `NDB` as a possible alternative or upgrade to the default `InnoDB` storage engine in MySQL 5.7. While `NDB` and `InnoDB` share common characteristics, there are differences in architecture and implementation, so that some existing MySQL Server applications and usage scenarios can be a good fit for NDB Cluster, but not all of them.

In this section, we discuss and compare some characteristics of the `NDB` storage engine used by NDB 7.5 with `InnoDB` used in MySQL 5.7. The next few sections provide a technical comparison. In many instances, decisions about when and where to use NDB Cluster must be made on a case-by-case basis, taking all factors into consideration. While it is beyond the scope of this documentation to provide specifics for every conceivable usage scenario, we also attempt to offer some very general guidance on the relative suitability of some common types of applications for `NDB` as opposed to `InnoDB` back ends.

NDB Cluster 7.5 uses a `mysqld` based on MySQL 5.7, including support for `InnoDB` 1.1. While it is possible to use `InnoDB` tables with NDB Cluster, such tables are not clustered. It is also not possible to use programs or libraries from an NDB Cluster 7.5 distribution with MySQL Server 5.7, or the reverse.

While it is also true that some types of common business applications can be run either on NDB Cluster or on MySQL Server (most likely using the `InnoDB` storage engine), there are some important architectural and implementation differences. Section 21.2.6.1, “Differences Between the NDB and InnoDB Storage Engines”, provides a summary of the these differences. Due to the differences, some usage scenarios are clearly more suitable for one engine or the other; see Section 21.2.6.2, “NDB and InnoDB Workloads”. This in turn has an impact on the types of applications that better suited for use with `NDB` or `InnoDB`. See Section 21.2.6.3, “NDB and InnoDB Feature Usage Summary”, for a comparison of the relative suitability of each for use in common types of database applications.

For information about the relative characteristics of the `NDB` and `MEMORY` storage engines, see When to Use MEMORY or NDB Cluster.

See Chapter 15, *Alternative Storage Engines*, for additional information about MySQL storage engines.


#### 21.2.6.1 Differences Between the NDB and InnoDB Storage Engines

The `NDB` storage engine is implemented using a distributed, shared-nothing architecture, which causes it to behave differently from `InnoDB` in a number of ways. For those unaccustomed to working with `NDB`, unexpected behaviors can arise due to its distributed nature with regard to transactions, foreign keys, table limits, and other characteristics. These are shown in the following table:

**Table 21.1 Differences between InnoDB and NDB storage engines**

<table><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Feature</th> <th><code>InnoDB</code> (MySQL 5.7)</th> <th><code>NDB</code> 7.5/7.6</th> </tr></thead><tbody><tr> <th><em>MySQL Server Version</em></th> <td>5.7</td> <td>5.7</td> </tr><tr> <th><em><code>InnoDB</code> Version </em></th> <td><code>InnoDB</code> 5.7.44</td> <td><code>InnoDB</code> 5.7.44</td> </tr><tr> <th><em>NDB Cluster Version</em></th> <td>N/A</td> <td><code>NDB</code> 7.5.36/7.6.36</td> </tr><tr> <th><em>Storage Limits</em></th> <td>64TB</td> <td>128TB (as of NDB 7.5.2)</td> </tr><tr> <th><em>Foreign Keys</em></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th><em>Transactions</em></th> <td>All standard types</td> <td><code>READ COMMITTED</code></td> </tr><tr> <th><em>MVCC</em></th> <td>Yes</td> <td>No</td> </tr><tr> <th><em>Data Compression</em></th> <td>Yes</td> <td>No (NDB checkpoint and backup files can be compressed)</td> </tr><tr> <th><em>Large Row Support (&gt; 14K)</em></th> <td>Supported for <code>VARBINARY</code>, <code>VARCHAR</code>, <code>BLOB</code>, and <code>TEXT</code> columns</td> <td>Supported for <code>BLOB</code> and <code>TEXT</code> columns only (Using these types to store very large amounts of data can lower NDB performance)</td> </tr><tr> <th><em>Replication Support</em></th> <td>Asynchronous and semisynchronous replication using MySQL Replication; MySQL <a class="link" href="group-replication.html" title="Chapter 17 Group Replication">Group Replication</a></td> <td>Automatic synchronous replication within an NDB Cluster; asynchronous replication between NDB Clusters, using MySQL Replication (Semisynchronous replication is not supported)</td> </tr><tr> <th><em>Scaleout for Read Operations</em></th> <td>Yes (MySQL Replication)</td> <td>Yes (Automatic partitioning in NDB Cluster; NDB Cluster Replication)</td> </tr><tr> <th><em>Scaleout for Write Operations</em></th> <td>Requires application-level partitioning (sharding)</td> <td>Yes (Automatic partitioning in NDB Cluster is transparent to applications)</td> </tr><tr> <th><em>High Availability (HA)</em></th> <td>Built-in, from InnoDB cluster</td> <td>Yes (Designed for 99.999% uptime)</td> </tr><tr> <th><em>Node Failure Recovery and Failover</em></th> <td>From MySQL Group Replication</td> <td>Automatic (Key element in NDB architecture)</td> </tr><tr> <th><em>Time for Node Failure Recovery</em></th> <td>30 seconds or longer</td> <td>Typically &lt; 1 second</td> </tr><tr> <th><em>Real-Time Performance</em></th> <td>No</td> <td>Yes</td> </tr><tr> <th><em>In-Memory Tables</em></th> <td>No</td> <td>Yes (Some data can optionally be stored on disk; both in-memory and disk data storage are durable)</td> </tr><tr> <th><em>NoSQL Access to Storage Engine</em></th> <td>Yes</td> <td>Yes (Multiple APIs, including Memcached, Node.js/JavaScript, Java, JPA, C++, and HTTP/REST)</td> </tr><tr> <th><em>Concurrent and Parallel Writes</em></th> <td>Yes</td> <td>Up to 48 writers, optimized for concurrent writes</td> </tr><tr> <th><span class="emphasis"><em>Conflict Detection and Resolution (Multiple Replication Surces)</em></span></th> <td>Yes (MySQL Group Replication)</td> <td>Yes</td> </tr><tr> <th><em>Hash Indexes</em></th> <td>No</td> <td>Yes</td> </tr><tr> <th><em>Online Addition of Nodes</em></th> <td>Read/write replicas using MySQL Group Replication</td> <td>Yes (all node types)</td> </tr><tr> <th><em>Online Upgrades</em></th> <td>Yes (using replication)</td> <td>Yes</td> </tr><tr> <th><em>Online Schema Modifications</em></th> <td>Yes, as part of MySQL 5.7</td> <td>Yes</td> </tr></tbody></table>


#### 21.2.6.2 NDB and InnoDB Workloads

NDB Cluster has a range of unique attributes that make it ideal to serve applications requiring high availability, fast failover, high throughput, and low latency. Due to its distributed architecture and multi-node implementation, NDB Cluster also has specific constraints that may keep some workloads from performing well. A number of major differences in behavior between the `NDB` and `InnoDB` storage engines with regard to some common types of database-driven application workloads are shown in the following table::

**Table 21.2 Differences between InnoDB and NDB storage engines, common types of data-driven application workloads.**

<table><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Workload</th> <th><code>InnoDB</code></th> <th>NDB Cluster (<code>NDB</code>)</th> </tr></thead><tbody><tr> <th><em>High-Volume OLTP Applications</em></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th><em>DSS Applications (data marts, analytics)</em></th> <td>Yes</td> <td>Limited (Join operations across OLTP datasets not exceeding 3TB in size)</td> </tr><tr> <th><em>Custom Applications</em></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th><em>Packaged Applications</em></th> <td>Yes</td> <td>Limited (should be mostly primary key access); NDB Cluster 7.5 supports foreign keys</td> </tr><tr> <th><em>In-Network Telecoms Applications (HLR, HSS, SDP)</em></th> <td>No</td> <td>Yes</td> </tr><tr> <th><em>Session Management and Caching</em></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th><em>E-Commerce Applications</em></th> <td>Yes</td> <td>Yes</td> </tr><tr> <th><em>User Profile Management, AAA Protocol</em></th> <td>Yes</td> <td>Yes</td> </tr></tbody></table>


#### 21.2.6.3 NDB and InnoDB Feature Usage Summary

When comparing application feature requirements to the capabilities of `InnoDB` with `NDB`, some are clearly more compatible with one storage engine than the other.

The following table lists supported application features according to the storage engine to which each feature is typically better suited.

**Table 21.3 Supported application features according to the storage engine to which each feature is typically better suited**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Preferred application requirements for <code>InnoDB</code></th> <th>Preferred application requirements for <code>NDB</code></th> </tr></thead><tbody><tr> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> Foreign keys </p> <div class="note" style="margin-left: 0.5in; margin-right: 0.5in;"> <div class="admon-title"> Note </div> <p> NDB Cluster 7.5 supports foreign keys </p> </div> </li><li class="listitem"><p> Full table scans </p></li><li class="listitem"><p> Very large databases, rows, or transactions </p></li><li class="listitem"><p> Transactions other than <code>READ COMMITTED</code> </p></li></ul> </div> </td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> Write scaling </p></li><li class="listitem"><p> 99.999% uptime </p></li><li class="listitem"><p> Online addition of nodes and online schema operations </p></li><li class="listitem"><p> Multiple SQL and NoSQL APIs (see NDB Cluster APIs: Overview and Concepts) </p></li><li class="listitem"><p> Real-time performance </p></li><li class="listitem"><p> Limited use of <code>BLOB</code> columns </p></li><li class="listitem"><p> Foreign keys are supported, although their use may have an impact on performance at high throughput </p></li></ul> </div> </td> </tr></tbody></table>


### 21.2.7 Known Limitations of NDB Cluster

In the sections that follow, we discuss known limitations in current releases of NDB Cluster as compared with the features available when using the `MyISAM` and `InnoDB` storage engines. If you check the “Cluster” category in the MySQL bugs database at <http://bugs.mysql.com>, you can find known bugs in the following categories under “MySQL Server:” in the MySQL bugs database at <http://bugs.mysql.com>, which we intend to correct in upcoming releases of NDB Cluster:

* NDB Cluster
* Cluster Direct API (NDBAPI)
* Cluster Disk Data
* Cluster Replication
* ClusterJ

This information is intended to be complete with respect to the conditions just set forth. You can report any discrepancies that you encounter to the MySQL bugs database using the instructions given in Section 1.5, “How to Report Bugs or Problems”. Any problem which we do not plan to fix in NDB Cluster 7.5 is added to the list.

See Previous NDB Cluster Issues Resolved in NDB Cluster 8.0 for a list of issues in earlier releases that have been resolved in NDB Cluster 7.5.

Note

Limitations and other issues specific to NDB Cluster Replication are described in Section 21.7.3, “Known Issues in NDB Cluster Replication”.


#### 21.2.7.1 Noncompliance with SQL Syntax in NDB Cluster

Some SQL statements relating to certain MySQL features produce errors when used with `NDB` tables, as described in the following list:

* **Temporary tables.** Temporary tables are not supported. Trying either to create a temporary table that uses the `NDB` storage engine or to alter an existing temporary table to use `NDB` fails with the error Table storage engine 'ndbcluster' does not support the create option 'TEMPORARY'.

* **Indexes and keys in NDB tables.** Keys and indexes on NDB Cluster tables are subject to the following limitations:

  + **Column width.** Attempting to create an index on an `NDB` table column whose width is greater than 3072 bytes is rejected with `ER_TOO_LONG_KEY`: Specified key was too long; max key length is 3072 bytes.

    Attempting to create an index on an `NDB` table column whose width is greater than 3056 bytes succeeds with a warning. In such cases, statistical information is not generated, which means a nonoptimal execution plan may be selected. For this reason, you should consider making the index length shorter than 3056 bytes if possible.

  + **TEXT and BLOB columns.** You cannot create indexes on `NDB` table columns that use any of the `TEXT` or `BLOB` data types.

  + **FULLTEXT indexes.** The `NDB` storage engine does not support `FULLTEXT` indexes, which are possible for `MyISAM` and `InnoDB` tables only.

    However, you can create indexes on `VARCHAR` columns of `NDB` tables.

  + **USING HASH keys and NULL.** Using nullable columns in unique keys and primary keys means that queries using these columns are handled as full table scans. To work around this issue, make the column `NOT NULL`, or re-create the index without the `USING HASH` option.

  + **Prefixes.** There are no prefix indexes; only entire columns can be indexed. (The size of an `NDB` column index is always the same as the width of the column in bytes, up to and including 3072 bytes, as described earlier in this section. Also see Section 21.2.7.6, “Unsupported or Missing Features in NDB Cluster”, for additional information.)

  + **BIT columns.** A `BIT` column cannot be a primary key, unique key, or index, nor can it be part of a composite primary key, unique key, or index.

  + **AUTO\_INCREMENT columns.** Like other MySQL storage engines, the `NDB` storage engine can handle a maximum of one `AUTO_INCREMENT` column per table, and this column must be indexed. However, in the case of an NDB table with no explicit primary key, an `AUTO_INCREMENT` column is automatically defined and used as a “hidden” primary key. For this reason, you cannot create an `NDB` table having an `AUTO_INCREMENT` column and no explicit primary key.

    The following `CREATE TABLE` statements do not work, as shown here:

    ```sql
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

    ```sql
    # Index on AUTO_INCREMENT column; table has a primary key
    mysql> CREATE TABLE n (
        ->     a INT PRIMARY KEY,
        ->     b INT AUTO_INCREMENT,
        ->     KEY k (b)
        ->     )
        -> ENGINE=NDB;
    Query OK, 0 rows affected (0.38 sec)
    ```

* **Restrictions on foreign keys.** Support for foreign key constraints in NDB 7.5 is comparable to that provided by `InnoDB`, subject to the following restrictions:

  + Every column referenced as a foreign key requires an explicit unique key, if it is not the table's primary key.

  + `ON UPDATE CASCADE` is not supported when the reference is to the parent table's primary key.

    This is because an update of a primary key is implemented as a delete of the old row (containing the old primary key) plus an insert of the new row (with a new primary key). This is not visible to the `NDB` kernel, which views these two rows as being the same, and thus has no way of knowing that this update should be cascaded.

  + As of NDB 7.5.14 and NDB 7.6.10: `ON DELETE CASCADE` is not supported where the child table contains one or more columns of any of the `TEXT` or `BLOB` types. (Bug #89511, Bug #27484882)

  + `SET DEFAULT` is not supported. (Also not supported by `InnoDB`.)

  + The `NO ACTION` keywords are accepted but treated as `RESTRICT`. (Also the same as with `InnoDB`.)

  + In earlier versions of NDB Cluster, when creating a table with foreign key referencing an index in another table, it sometimes appeared possible to create the foreign key even if the order of the columns in the indexes did not match, due to the fact that an appropriate error was not always returned internally. A partial fix for this issue improved the error used internally to work in most cases; however, it remains possible for this situation to occur in the event that the parent index is a unique index. (Bug #18094360)

  + Prior to NDB 7.5.6, when adding or dropping a foreign key using `ALTER TABLE`, the parent table's metadata is not updated, which makes it possible subsequently to execute `ALTER TABLE` statements on the parent that should be invalid. To work around this issue, execute `SHOW CREATE TABLE` on the parent table immediately after adding or dropping the foreign key; this forces the parent's metadata to be reloaded.

    This issue is fixed in NDB 7.5.6. (Bug #82989, Bug #24666177)

  For more information, see Section 13.1.18.5, “FOREIGN KEY Constraints”, and Section 1.6.3.2, “FOREIGN KEY Constraints”.

* **NDB Cluster and geometry data types.** Geometry data types (`WKT` and `WKB`) are supported for `NDB` tables. However, spatial indexes are not supported.

* **Character sets and binary log files.** Currently, the `ndb_apply_status` and `ndb_binlog_index` tables are created using the `latin1` (ASCII) character set. Because names of binary logs are recorded in this table, binary log files named using non-Latin characters are not referenced correctly in these tables. This is a known issue, which we are working to fix. (Bug #50226)

  To work around this problem, use only Latin-1 characters when naming binary log files or setting any the `--basedir`, `--log-bin`, or `--log-bin-index` options.

* **Creating NDB tables with user-defined partitioning.**

  Support for user-defined partitioning in NDB Cluster is restricted to [`LINEAR`] `KEY` partitioning. Using any other partitioning type with `ENGINE=NDB` or `ENGINE=NDBCLUSTER` in a `CREATE TABLE` statement results in an error.

  It is possible to override this restriction, but doing so is not supported for use in production settings. For details, see User-defined partitioning and the NDB storage engine (NDB Cluster)").

  **Default partitioning scheme.** All NDB Cluster tables are by default partitioned by `KEY` using the table's primary key as the partitioning key. If no primary key is explicitly set for the table, the “hidden” primary key automatically created by the `NDB` storage engine is used instead. For additional discussion of these and related issues, see Section 22.2.5, “KEY Partitioning”.

  `CREATE TABLE` and `ALTER TABLE` statements that would cause a user-partitioned `NDBCLUSTER` table not to meet either or both of the following two requirements are not permitted, and fail with an error:

  1. The table must have an explicit primary key.
  2. All columns listed in the table's partitioning expression must be part of the primary key.

  **Exception.** If a user-partitioned `NDBCLUSTER` table is created using an empty column-list (that is, using `PARTITION BY [LINEAR] KEY()`), then no explicit primary key is required.

  **Maximum number of partitions for NDBCLUSTER tables.** The maximum number of partitions that can defined for a `NDBCLUSTER` table when employing user-defined partitioning is 8 per node group. (See Section 21.2.2, “NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions”, for more information about NDB Cluster node groups.

  **DROP PARTITION not supported.** It is not possible to drop partitions from `NDB` tables using `ALTER TABLE ... DROP PARTITION`. The other partitioning extensions to `ALTER TABLE`—`ADD PARTITION`, `REORGANIZE PARTITION`, and `COALESCE PARTITION`—are supported for NDB tables, but use copying and so are not optimized. See Section 22.3.1, “Management of RANGE and LIST Partitions” and Section 13.1.8, “ALTER TABLE Statement”.

  **Partition selection.** Partition selection is not supported for `NDB` tables. See Section 22.5, “Partition Selection”, for more information.

* **JSON data type.** The MySQL `JSON` data type is supported for `NDB` tables in the `mysqld` supplied with NDB 7.5.2 and later.

  An `NDB` table can have a maximum of 3 `JSON` columns.

  The NDB API has no special provision for working with `JSON` data, which it views simply as `BLOB` data. Handling data as `JSON` must be performed by the application.

* **CPU and thread info ndbinfo tables.** NDB 7.5.2 adds several new tables to the `ndbinfo` information database providing information about CPU and thread activity by node, thread ID, and thread type. The tables are listed here:

  + `cpustat`: Provides per-second, per-thread CPU statistics

  + `cpustat_50ms`: Raw per-thread CPU statistics data, gathered every 50ms

  + `cpustat_1sec`: Raw per-thread CPU statistics data, gathered each second

  + `cpustat_20sec`: Raw per-thread CPU statistics data, gathered every 20 seconds

  + `threads`: Names and descriptions of thread types

  For more information about these tables, see Section 21.6.15, “ndbinfo: The NDB Cluster Information Database”.

* **Lock info ndbinfo tables.** NDB 7.5.3 adds new tables to the `ndbinfo` information database providing information about locks and lock attempts in a running NDB Cluster. These tables are listed here:

  + `cluster_locks`: Current lock requests which are waiting for or holding locks; this information can be useful when investigating stalls and deadlocks. Analogous to `cluster_operations`.

  + `locks_per_fragment`: Counts of lock claim requests, and their outcomes per fragment, as well as total time spent waiting for locks successfully and unsuccessfully. Analogous to `operations_per_fragment` and `memory_per_fragment`.

  + `server_locks`: Subset of cluster transactions—those running on the local `mysqld`, showing a connection id per transaction. Analogous to `server_operations`.


#### 21.2.7.2 Limits and Differences of NDB Cluster from Standard MySQL Limits

In this section, we list limits found in NDB Cluster that either differ from limits found in, or that are not found in, standard MySQL.

**Memory usage and recovery.** Memory consumed when data is inserted into an `NDB` table is not automatically recovered when deleted, as it is with other storage engines. Instead, the following rules hold true:

* A `DELETE` statement on an `NDB` table makes the memory formerly used by the deleted rows available for re-use by inserts on the same table only. However, this memory can be made available for general re-use by performing `OPTIMIZE TABLE`.

  A rolling restart of the cluster also frees any memory used by deleted rows. See Section 21.6.5, “Performing a Rolling Restart of an NDB Cluster”.

* A `DROP TABLE` or `TRUNCATE TABLE` operation on an `NDB` table frees the memory that was used by this table for re-use by any `NDB` table, either by the same table or by another `NDB` table.

  Note

  Recall that `TRUNCATE TABLE` drops and re-creates the table. See Section 13.1.34, “TRUNCATE TABLE Statement”.

* **Limits imposed by the cluster's configuration.** A number of hard limits exist which are configurable, but available main memory in the cluster sets limits. See the complete list of configuration parameters in Section 21.4.3, “NDB Cluster Configuration Files”. Most configuration parameters can be upgraded online. These hard limits include:

  + Database memory size and index memory size (`DataMemory` and `IndexMemory`, respectively).

    `DataMemory` is allocated as 32KB pages. As each `DataMemory` page is used, it is assigned to a specific table; once allocated, this memory cannot be freed except by dropping the table.

    See Section 21.4.3.6, “Defining NDB Cluster Data Nodes”, for more information.

  + The maximum number of operations that can be performed per transaction is set using the configuration parameters `MaxNoOfConcurrentOperations` and `MaxNoOfLocalOperations`.

    Note

    Bulk loading, `TRUNCATE TABLE`, and `ALTER TABLE` are handled as special cases by running multiple transactions, and so are not subject to this limitation.

  + Different limits related to tables and indexes. For example, the maximum number of ordered indexes in the cluster is determined by `MaxNoOfOrderedIndexes`, and the maximum number of ordered indexes per table is 16.

* **Node and data object maximums.** The following limits apply to numbers of cluster nodes and metadata objects:

  + The maximum number of data nodes is 48.

    A data node must have a node ID in the range of 1 to 48, inclusive. (Management and API nodes may use node IDs in the range 1 to 255, inclusive.)

  + The total maximum number of nodes in an NDB Cluster is
    255. This number includes all SQL nodes (MySQL Servers), API nodes (applications accessing the cluster other than MySQL servers), data nodes, and management servers.

  + The maximum number of metadata objects in current versions of NDB Cluster is 20320. This limit is hard-coded.

  See Previous NDB Cluster Issues Resolved in NDB Cluster 8.0, for more information.


#### 21.2.7.3 Limits Relating to Transaction Handling in NDB Cluster

A number of limitations exist in NDB Cluster with regard to the handling of transactions. These include the following:

* **Transaction isolation level.**

  The `NDBCLUSTER` storage engine supports only the `READ COMMITTED` transaction isolation level. (`InnoDB`, for example, supports `READ COMMITTED`, `READ UNCOMMITTED`, `REPEATABLE READ`, and `SERIALIZABLE`.) You should keep in mind that `NDB` implements `READ COMMITTED` on a per-row basis; when a read request arrives at the data node storing the row, what is returned is the last committed version of the row at that time.

  Uncommitted data is never returned, but when a transaction modifying a number of rows commits concurrently with a transaction reading the same rows, the transaction performing the read can observe “before” values, “after” values, or both, for different rows among these, due to the fact that a given row read request can be processed either before or after the commit of the other transaction.

  To ensure that a given transaction reads only before or after values, you can impose row locks using `SELECT ... LOCK IN SHARE MODE`. In such cases, the lock is held until the owning transaction is committed. Using row locks can also cause the following issues:

  + Increased frequency of lock wait timeout errors, and reduced concurrency

  + Increased transaction processing overhead due to reads requiring a commit phase

  + Possibility of exhausting the available number of concurrent locks, which is limited by `MaxNoOfConcurrentOperations`

  `NDB` uses `READ COMMITTED` for all reads unless a modifier such as `LOCK IN SHARE MODE` or `FOR UPDATE` is used. `LOCK IN SHARE MODE` causes shared row locks to be used; `FOR UPDATE` causes exclusive row locks to be used. Unique key reads have their locks upgraded automatically by `NDB` to ensure a self-consistent read; `BLOB` reads also employ extra locking for consistency.

  See Section 21.6.8.4, “NDB Cluster Backup Troubleshooting”, for information on how NDB Cluster's implementation of transaction isolation level can affect backup and restoration of `NDB` databases.

* **Transactions and BLOB or TEXT columns.** `NDBCLUSTER` stores only part of a column value that uses any of MySQL's `BLOB` or `TEXT` data types in the table visible to MySQL; the remainder of the `BLOB` or `TEXT` is stored in a separate internal table that is not accessible to MySQL. This gives rise to two related issues of which you should be aware whenever executing `SELECT` statements on tables that contain columns of these types:

  1. For any `SELECT` from an NDB Cluster table: If the `SELECT` includes a `BLOB` or `TEXT` column, the `READ COMMITTED` transaction isolation level is converted to a read with read lock. This is done to guarantee consistency.

  2. For any `SELECT` which uses a unique key lookup to retrieve any columns that use any of the `BLOB` or `TEXT` data types and that is executed within a transaction, a shared read lock is held on the table for the duration of the transaction—that is, until the transaction is either committed or aborted.

     This issue does not occur for queries that use index or table scans, even against `NDB` tables having `BLOB` or `TEXT` columns.

     For example, consider the table `t` defined by the following `CREATE TABLE` statement:

     ```sql
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

     ```sql
     SELECT * FROM t WHERE c = 1;
     ```

     However, none of the four queries shown here causes a shared read lock:

     ```sql
     SELECT * FROM t WHERE b = 1;

     SELECT * FROM t WHERE d = '1';

     SELECT * FROM t;

     SELECT b,c WHERE a = 1;
     ```

     This is because, of these four queries, the first uses an index scan, the second and third use table scans, and the fourth, while using a primary key lookup, does not retrieve the value of any `BLOB` or `TEXT` columns.

     You can help minimize issues with shared read locks by avoiding queries that use unique key lookups that retrieve `BLOB` or `TEXT` columns, or, in cases where such queries are not avoidable, by committing transactions as soon as possible afterward.

* **Unique key lookups and transaction isolation.** Unique indexes are implemented in `NDB` using a hidden index table which is maintained internally. When a user-created `NDB` table is accessed using a unique index, the hidden index table is first read to find the primary key that is then used to read the user-created table. To avoid modification of the index during this double-read operation, the row found in the hidden index table is locked. When a row referenced by a unique index in the user-created `NDB` table is updated, the hidden index table is subject to an exclusive lock by the transaction in which the update is performed. This means that any read operation on the same (user-created) `NDB` table must wait for the update to complete. This is true even when the transaction level of the read operation is `READ COMMITTED`.

  One workaround which can be used to bypass potentially blocking reads is to force the SQL node to ignore the unique index when performing the read. This can be done by using the `IGNORE INDEX` index hint as part of the `SELECT` statement reading the table (see Section 8.9.4, “Index Hints”). Because the MySQL server creates a shadowing ordered index for every unique index created in `NDB`, this lets the ordered index be read instead, and avoids unique index access locking. The resulting read is as consistent as a committed read by primary key, returning the last committed value at the time the row is read.

  Reading via an ordered index makes less efficient use of resources in the cluster, and may have higher latency.

  It is also possible to avoid using the unique index for access by querying for ranges rather than for unique values.

* **Rollbacks.** There are no partial transactions, and no partial rollbacks of transactions. A duplicate key or similar error causes the entire transaction to be rolled back.

  This behavior differs from that of other transactional storage engines such as `InnoDB` that may roll back individual statements.

* **Transactions and memory usage.** As noted elsewhere in this chapter, NDB Cluster does not handle large transactions well; it is better to perform a number of small transactions with a few operations each than to attempt a single large transaction containing a great many operations. Among other considerations, large transactions require very large amounts of memory. Because of this, the transactional behavior of a number of MySQL statements is affected as described in the following list:

  + `TRUNCATE TABLE` is not transactional when used on `NDB` tables. If a `TRUNCATE TABLE` fails to empty the table, then it must be re-run until it is successful.

  + `DELETE FROM` (even with no `WHERE` clause) *is* transactional. For tables containing a great many rows, you may find that performance is improved by using several `DELETE FROM ... LIMIT ...` statements to “chunk” the delete operation. If your objective is to empty the table, then you may wish to use `TRUNCATE TABLE` instead.

  + **LOAD DATA statements.** `LOAD DATA` is not transactional when used on `NDB` tables.

    Important

    When executing a `LOAD DATA` statement, the `NDB` engine performs commits at irregular intervals that enable better utilization of the communication network. It is not possible to know ahead of time when such commits take place.

  + **ALTER TABLE and transactions.** When copying an `NDB` table as part of an `ALTER TABLE`, the creation of the copy is nontransactional. (In any case, this operation is rolled back when the copy is deleted.)

* **Transactions and the COUNT() function.** When using NDB Cluster Replication, it is not possible to guarantee the transactional consistency of the `COUNT()` function on the replica. In other words, when performing on the source a series of statements (`INSERT`, `DELETE`, or both) that changes the number of rows in a table within a single transaction, executing `SELECT COUNT(*) FROM table` queries on the replica may yield intermediate results. This is due to the fact that `SELECT COUNT(...)` may perform dirty reads, and is not a bug in the `NDB` storage engine. (See Bug #31321 for more information.)


#### 21.2.7.4 NDB Cluster Error Handling

Starting, stopping, or restarting a node may give rise to temporary errors causing some transactions to fail. These include the following cases:

* **Temporary errors.** When first starting a node, it is possible that you may see Error 1204 Temporary failure, distribution changed and similar temporary errors.

* **Errors due to node failure.** The stopping or failure of any data node can result in a number of different node failure errors. (However, there should be no aborted transactions when performing a planned shutdown of the cluster.)

In either of these cases, any errors that are generated must be handled within the application. This should be done by retrying the transaction.

See also Section 21.2.7.2, “Limits and Differences of NDB Cluster from Standard MySQL Limits”.


#### 21.2.7.5 Limits Associated with Database Objects in NDB Cluster

Some database objects such as tables and indexes have different limitations when using the `NDBCLUSTER` storage engine:

* **Database and table names.** When using the `NDB` storage engine, the maximum allowed length both for database names and for table names is 63 characters. A statement using a database name or table name longer than this limit fails with an appropriate error.

* **Number of database objects.** The maximum number of *all* `NDB` database objects in a single NDB Cluster—including databases, tables, and indexes—is limited to 20320.

* **Attributes per table.** The maximum number of attributes (that is, columns and indexes) that can belong to a given table is 512.

* **Attributes per key.** The maximum number of attributes per key is 32.

* **Row size.** The maximum permitted size of any one row is 14000 bytes.

  Each `BLOB` or `TEXT` column contributes 256 + 8 = 264 bytes to this total; this includes `JSON` columns. See String Type Storage Requirements, as well as JSON Storage Requirements, for more information relating to these types.

  In addition, the maximum offset for a fixed-width column of an `NDB` table is 8188 bytes; attempting to create a table that violates this limitation fails with NDB error 851 Maximum offset for fixed-size columns exceeded. For memory-based columns, you can work around this limitation by using a variable-width column type such as `VARCHAR` or defining the column as `COLUMN_FORMAT=DYNAMIC`; this does not work with columns stored on disk. For disk-based columns, you may be able to do so by reordering one or more of the table's disk-based columns such that the combined width of all but the disk-based column defined last in the `CREATE TABLE` statement used to create the table does not exceed 8188 bytes, less any possible rounding performed for some data types such as `CHAR` or `VARCHAR`; otherwise it is necessary to use memory-based storage for one or more of the offending column or columns instead.

* **BIT column storage per table.** The maximum combined width for all `BIT` columns used in a given `NDB` table is 4096.

* **FIXED column storage.** NDB Cluster 7.5 and later supports a maximum of 128 TB per fragment of data in `FIXED` columns. (Previously, this was 16 GB.)


#### 21.2.7.6 Unsupported or Missing Features in NDB Cluster

A number of features supported by other storage engines are not supported for `NDB` tables. Trying to use any of these features in NDB Cluster does not cause errors in or of itself; however, errors may occur in applications that expects the features to be supported or enforced. Statements referencing such features, even if effectively ignored by `NDB`, must be syntactically and otherwise valid.

* **Index prefixes.** Prefixes on indexes are not supported for `NDB` tables. If a prefix is used as part of an index specification in a statement such as `CREATE TABLE`, `ALTER TABLE`, or `CREATE INDEX`, the prefix is not created by `NDB`.

  A statement containing an index prefix, and creating or modifying an `NDB` table, must still be syntactically valid. For example, the following statement always fails with Error 1089 Incorrect prefix key; the used key part isn't a string, the used length is longer than the key part, or the storage engine does not support unique prefix keys, regardless of storage engine:

  ```sql
  CREATE TABLE t1 (
      c1 INT NOT NULL,
      c2 VARCHAR(100),
      INDEX i1 (c2(500))
  );
  ```

  This happens on account of the SQL syntax rule that no index may have a prefix larger than itself.

* **Savepoints and rollbacks.** Savepoints and rollbacks to savepoints are ignored as in `MyISAM`.

* **Durability of commits.** There are no durable commits on disk. Commits are replicated, but there is no guarantee that logs are flushed to disk on commit.

* **Replication.** Statement-based replication is not supported. Use `--binlog-format=ROW` (or `--binlog-format=MIXED`) when setting up cluster replication. See Section 21.7, “NDB Cluster Replication”, for more information.

  Replication using global transaction identifiers (GTIDs) is not compatible with NDB Cluster, and is not supported in NDB Cluster 7.5 or NDB CLuster 7.6. Do not enable GTIDs when using the `NDB` storage engine, as this is very likely to cause problems up to and including failure of NDB Cluster Replication.

  Semisynchronous replication is not supported in NDB Cluster.

  When replicating between clusters, it is possible to use IPv6 addresses between SQL nodes in different clusters, but all connections within a given cluster must use IPv4 addressing. For more information, see NDB Cluster Replication and IPv6.

* **Generated columns.** The `NDB` storage engine does not support indexes on virtual generated columns.

  As with other storage engines, you can create an index on a stored generated column, but you should bear in mind that `NDB` uses `DataMemory` for storage of the generated column as well as `IndexMemory` for the index. See JSON columns and indirect indexing in NDB Cluster, for an example.

  NDB Cluster writes changes in stored generated columns to the binary log, but does log not those made to virtual columns. This should not effect NDB Cluster Replication or replication between `NDB` and other MySQL storage engines.

Note

See Section 21.2.7.3, “Limits Relating to Transaction Handling in NDB Cluster”, for more information relating to limitations on transaction handling in `NDB`.


#### 21.2.7.7 Limitations Relating to Performance in NDB Cluster

The following performance issues are specific to or especially pronounced in NDB Cluster:

* **Range scans.** There are query performance issues due to sequential access to the `NDB` storage engine; it is also relatively more expensive to do many range scans than it is with either `MyISAM` or `InnoDB`.

* **Reliability of Records in range.** The `Records in range` statistic is available but is not completely tested or officially supported. This may result in nonoptimal query plans in some cases. If necessary, you can employ `USE INDEX` or `FORCE INDEX` to alter the execution plan. See Section 8.9.4, “Index Hints”, for more information on how to do this.

* **Unique hash indexes.** Unique hash indexes created with `USING HASH` cannot be used for accessing a table if `NULL` is given as part of the key.


#### 21.2.7.8 Issues Exclusive to NDB Cluster

The following are limitations specific to the `NDB` storage engine:

* **Machine architecture.** All machines used in the cluster must have the same architecture. That is, all machines hosting nodes must be either big-endian or little-endian, and you cannot use a mixture of both. For example, you cannot have a management node running on a PowerPC which directs a data node that is running on an x86 machine. This restriction does not apply to machines simply running **mysql** or other clients that may be accessing the cluster's SQL nodes.

* **Binary logging.** NDB Cluster has the following limitations or restrictions with regard to binary logging:

  + NDB Cluster cannot produce a binary log for tables having `BLOB` columns but no primary key.

  + Only the following schema operations are logged in a cluster binary log which is *not* on the `mysqld` executing the statement:

    - `CREATE TABLE`
    - `ALTER TABLE`
    - `DROP TABLE`
    - `CREATE DATABASE` / `CREATE SCHEMA`

    - `DROP DATABASE` / `DROP SCHEMA`

    - `CREATE TABLESPACE`
    - `ALTER TABLESPACE`
    - `DROP TABLESPACE`
    - `CREATE LOGFILE GROUP`
    - `ALTER LOGFILE GROUP`
    - `DROP LOGFILE GROUP`
* **Schema operations.** Schema operations (DDL statements) are rejected while any data node restarts. Schema operations are also not supported while performing an online upgrade or downgrade.

* **Number of fragment replicas.** The number of fragment replicas, as determined by the `NoOfReplicas` data node configuration parameter, is the number of copies of all data stored by NDB Cluster. Setting this parameter to 1 means there is only a single copy; in this case, no redundancy is provided, and the loss of a data node entails loss of data. To guarantee redundancy, and thus preservation of data even if a data node fails, set this parameter to 2, which is the default and recommended value in production.

  Setting `NoOfReplicas` to a value greater than 2 is possible (to a maximum of 4) but unnecessary to guard against loss of data. In addition, *values greater than 2 for this parameter are not supported in production*.

See also Section 21.2.7.10, “Limitations Relating to Multiple NDB Cluster Nodes”.


#### 21.2.7.9 Limitations Relating to NDB Cluster Disk Data Storage

**Disk Data object maximums and minimums.** Disk data objects are subject to the following maximums and minimums:

* Maximum number of tablespaces: 232 (4294967296)

* Maximum number of data files per tablespace: 216 (65536)

* The minimum and maximum possible sizes of extents for tablespace data files are 32K and 2G, respectively. See Section 13.1.19, “CREATE TABLESPACE Statement”, for more information.

In addition, when working with NDB Disk Data tables, you should be aware of the following issues regarding data files and extents:

* Data files use `DataMemory`. Usage is the same as for in-memory data.

* Data files use file descriptors. It is important to keep in mind that data files are always open, which means the file descriptors are always in use and cannot be re-used for other system tasks.

* Extents require sufficient `DiskPageBufferMemory`; you must reserve enough for this parameter to account for all memory used by all extents (number of extents times size of extents).

**Disk Data tables and diskless mode.** Use of Disk Data tables is not supported when running the cluster in diskless mode.


#### 21.2.7.10 Limitations Relating to Multiple NDB Cluster Nodes

**Multiple SQL nodes.** The following are issues relating to the use of multiple MySQL servers as NDB Cluster SQL nodes, and are specific to the `NDBCLUSTER` storage engine:

* **Stored programs not distributed.** Stored procedures, stored functions, triggers, and scheduled events are all supported by tables using the `NDB` storage engine, but these do *not* propagate automatically between MySQL Servers acting as Cluster SQL nodes, and must be re-created separately on each SQL node. See Stored Programs in NDB Cluster.

* **No distributed table locks.** A `LOCK TABLES` statement or `GET_LOCK()` call works only for the SQL node on which the lock is issued; no other SQL node in the cluster “sees” this lock. This is true for a lock issued by any statement that locks tables as part of its operations. (See next item for an example.)

  Implementing table locks in `NDBCLUSTER` can be done in an API application, and ensuring that all applications start by setting `LockMode` to `LM_Read` or `LM_Exclusive`. For more information about how to do this, see the description of `NdbOperation::getLockHandle()` in the *NDB Cluster API Guide*.

* **ALTER TABLE operations.** `ALTER TABLE` is not fully locking when running multiple MySQL servers (SQL nodes). (As discussed in the previous item, NDB Cluster does not support distributed table locks.)

**Multiple management nodes.** When using multiple management servers:

* If any of the management servers are running on the same host, you must give nodes explicit IDs in connection strings because automatic allocation of node IDs does not work across multiple management servers on the same host. This is not required if every management server resides on a different host.

* When a management server starts, it first checks for any other management server in the same NDB Cluster, and upon successful connection to the other management server uses its configuration data. This means that the management server `--reload` and `--initial` startup options are ignored unless the management server is the only one running. It also means that, when performing a rolling restart of an NDB Cluster with multiple management nodes, the management server reads its own configuration file if (and only if) it is the only management server running in this NDB Cluster. See Section 21.6.5, “Performing a Rolling Restart of an NDB Cluster”, for more information.

**Multiple network addresses.** Multiple network addresses per data node are not supported. Use of these is liable to cause problems: In the event of a data node failure, an SQL node waits for confirmation that the data node went down but never receives it because another route to that data node remains open. This can effectively make the cluster inoperable.

Note

It is possible to use multiple network hardware *interfaces* (such as Ethernet cards) for a single data node, but these must be bound to the same address. This also means that it not possible to use more than one `[tcp]` section per connection in the `config.ini` file. See Section 21.4.3.10, “NDB Cluster TCP/IP Connections”, for more information.
