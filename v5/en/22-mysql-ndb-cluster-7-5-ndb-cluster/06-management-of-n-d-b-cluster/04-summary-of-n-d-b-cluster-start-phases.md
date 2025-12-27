### 21.6.4 Summary of NDB Cluster Start Phases

This section provides a simplified outline of the steps involved when NDB Cluster data nodes are started. More complete information can be found in [NDB Cluster Start Phases](/doc/ndb-internals/en/ndb-internals-start-phases.html), in the *`NDB` Internals Guide*.

These phases are the same as those reported in the output from the [`node_id STATUS`](mysql-cluster-mgm-client-commands.html#ndbclient-status) command in the management client (see [Section 21.6.1, “Commands in the NDB Cluster Management Client”](mysql-cluster-mgm-client-commands.html "21.6.1 Commands in the NDB Cluster Management Client")). These start phases are also reported in the `start_phase` column of the [`ndbinfo.nodes`](mysql-cluster-ndbinfo-nodes.html "21.6.15.28 The ndbinfo nodes Table") table.

**Start types.** There are several different startup types and modes, as shown in the following list:

* **Initial start.** The cluster starts with a clean file system on all data nodes. This occurs either when the cluster started for the very first time, or when all data nodes are restarted using the [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial) option.

  Note

  Disk Data files are not removed when restarting a node using [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial).

* **System restart.** The cluster starts and reads data stored in the data nodes. This occurs when the cluster has been shut down after having been in use, when it is desired for the cluster to resume operations from the point where it left off.

* **Node restart.** This is the online restart of a cluster node while the cluster itself is running.

* **Initial node restart.** This is the same as a node restart, except that the node is reinitialized and started with a clean file system.

**Setup and initialization (phase -1).** Prior to startup, each data node ([**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") process) must be initialized. Initialization consists of the following steps:

1. Obtain a node ID
2. Fetch configuration data
3. Allocate ports to be used for inter-node communications
4. Allocate memory according to settings obtained from the configuration file

When a data node or SQL node first connects to the management node, it reserves a cluster node ID. To make sure that no other node allocates the same node ID, this ID is retained until the node has managed to connect to the cluster and at least one [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") reports that this node is connected. This retention of the node ID is guarded by the connection between the node in question and [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon").

After each data node has been initialized, the cluster startup process can proceed. The stages which the cluster goes through during this process are listed here:

* **Phase 0.** The [`NDBFS`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-ndbfs.html) and [`NDBCNTR`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-ndbcntr.html) blocks start. Data node file systems are cleared on those data nodes that were started with [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial) option.

* **Phase 1.** In this stage, all remaining [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") kernel blocks are started. NDB Cluster connections are set up, inter-block communications are established, and heartbeats are started. In the case of a node restart, API node connections are also checked.

  Note

  When one or more nodes hang in Phase 1 while the remaining node or nodes hang in Phase 2, this often indicates network problems. One possible cause of such issues is one or more cluster hosts having multiple network interfaces. Another common source of problems causing this condition is the blocking of TCP/IP ports needed for communications between cluster nodes. In the latter case, this is often due to a misconfigured firewall.

* **Phase 2.** The `NDBCNTR` kernel block checks the states of all existing nodes. The master node is chosen, and the cluster schema file is initialized.

* **Phase 3.** The [`DBLQH`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dblqh.html) and [`DBTC`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtc.html) kernel blocks set up communications between them. The startup type is determined; if this is a restart, the [`DBDIH`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbdih.html) block obtains permission to perform the restart.

* **Phase 4.** For an initial start or initial node restart, the redo log files are created. The number of these files is equal to [`NoOfFragmentLogFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nooffragmentlogfiles).

  For a system restart:

  + Read schema or schemas.
  + Read data from the local checkpoint.
  + Apply all redo information until the latest restorable global checkpoint has been reached.

  For a node restart, find the tail of the redo log.

* **Phase 5.** Most of the database-related portion of a data node start is performed during this phase. For an initial start or system restart, a local checkpoint is executed, followed by a global checkpoint. Periodic checks of memory usage begin during this phase, and any required node takeovers are performed.

* **Phase 6.** In this phase, node groups are defined and set up.

* **Phase 7.** The arbitrator node is selected and begins to function. The next backup ID is set, as is the backup disk write speed. Nodes reaching this start phase are marked as `Started`. It is now possible for API nodes (including SQL nodes) to connect to the cluster.

* **Phase 8.** If this is a system restart, all indexes are rebuilt (by [`DBDIH`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbdih.html)).

* **Phase 9.** The node internal startup variables are reset.

* **Phase 100 (OBSOLETE).** Formerly, it was at this point during a node restart or initial node restart that API nodes could connect to the node and begin to receive events. Currently, this phase is empty.

* **Phase 101.** At this point in a node restart or initial node restart, event delivery is handed over to the node joining the cluster. The newly-joined node takes over responsibility for delivering its primary data to subscribers. This phase is also referred to as [`SUMA`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-suma.html) handover phase.

After this process is completed for an initial start or system restart, transaction handling is enabled. For a node restart or initial node restart, completion of the startup process means that the node may now act as a transaction coordinator.
