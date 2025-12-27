### 21.6.5 Performing a Rolling Restart of an NDB Cluster

This section discusses how to perform a rolling restart of an NDB Cluster installation, so called because it involves stopping and starting (or restarting) each node in turn, so that the cluster itself remains operational. This is often done as part of a rolling upgrade or rolling downgrade, where high availability of the cluster is mandatory and no downtime of the cluster as a whole is permissible. Where we refer to upgrades, the information provided here also generally applies to downgrades as well.

There are a number of reasons why a rolling restart might be desirable. These are described in the next few paragraphs.

**Configuration change.** To make a change in the cluster's configuration, such as adding an SQL node to the cluster, or setting a configuration parameter to a new value.

**NDB Cluster software upgrade or downgrade.** To upgrade the cluster to a newer version of the NDB Cluster software (or to downgrade it to an older version). This is usually referred to as a “rolling upgrade” (or “rolling downgrade”, when reverting to an older version of NDB Cluster).

**Change on node host.** To make changes in the hardware or operating system on which one or more NDB Cluster node processes are running.

**System reset (cluster reset).** To reset the cluster because it has reached an undesirable state. In such cases it is often desirable to reload the data and metadata of one or more data nodes. This can be done in any of three ways:

* Start each data node process ([**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") or possibly [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)")) with the [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial) option, which forces the data node to clear its file system and to reload all NDB Cluster data and metadata from the other data nodes.

* Create a backup using the [**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") client [`START BACKUP`](mysql-cluster-backup-using-management-client.html "21.6.8.2 Using The NDB Cluster Management Client to Create a Backup") command prior to performing the restart. Following the upgrade, restore the node or nodes using [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup").

  See [Section 21.6.8, “Online Backup of NDB Cluster”](mysql-cluster-backup.html "21.6.8 Online Backup of NDB Cluster"), and [Section 21.5.24, “ndb\_restore — Restore an NDB Cluster Backup”](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), for more information.

* Use [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") to create a backup prior to the upgrade; afterward, restore the dump using [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement").

**Resource Recovery.** To free memory previously allocated to a table by successive [`INSERT`](insert.html "13.2.5 INSERT Statement") and [`DELETE`](delete.html "13.2.2 DELETE Statement") operations, for re-use by other NDB Cluster tables.

The process for performing a rolling restart may be generalized as follows:

1. Stop all cluster management nodes ([**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") processes), reconfigure them, then restart them. (See [Rolling restarts with multiple management servers](mysql-cluster-rolling-restart.html#mysql-cluster-rolling-restart-multiple-ndb-mgmd "Rolling restarts with multiple management servers").)

2. Stop, reconfigure, then restart each cluster data node ([**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") process) in turn.

   Some node configuration parameters can be updated by issuing [`RESTART`](mysql-cluster-mgm-client-commands.html#ndbclient-restart) for each of the data nodes in the [**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") client following the previous step. Other parameters require that the data node be stopped completely using the management client [`STOP`](mysql-cluster-mgm-client-commands.html#ndbclient-stop) command, then started again from a system shell by invoking the [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") or [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") executable as appropriate. (A shell command such as [**kill**](kill.html "13.7.6.4 KILL Statement") can also be used on most Unix systems to stop a data node process, but the `STOP` command is preferred and usually simpler.)

   Note

   On Windows, you can also use **SC STOP** and **SC START** commands, `NET STOP` and `NET START` commands, or the Windows Service Manager to stop and start nodes which have been installed as Windows services (see [Section 21.3.2.4, “Installing NDB Cluster Processes as Windows Services”](mysql-cluster-install-windows-service.html "21.3.2.4 Installing NDB Cluster Processes as Windows Services")).

   The type of restart required is indicated in the documentation for each node configuration parameter. See [Section 21.4.3, “NDB Cluster Configuration Files”](mysql-cluster-config-file.html "21.4.3 NDB Cluster Configuration Files").

3. Stop, reconfigure, then restart each cluster SQL node ([**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") process) in turn.

NDB Cluster supports a somewhat flexible order for upgrading nodes. When upgrading an NDB Cluster, you may upgrade API nodes (including SQL nodes) before upgrading the management nodes, data nodes, or both. In other words, you are permitted to upgrade the API and SQL nodes in any order. This is subject to the following provisions:

* This functionality is intended for use as part of an online upgrade only. A mix of node binaries from different NDB Cluster releases is neither intended nor supported for continuous, long-term use in a production setting.

* You must upgrade all nodes of the same type (management, data, or API node) before upgrading any nodes of a different type. This remains true regardless of the order in which the nodes are upgraded.

* You must upgrade all management nodes before upgrading any data nodes. This remains true regardless of the order in which you upgrade the cluster's API and SQL nodes.

* Features specific to the “new” version must not be used until all management nodes and data nodes have been upgraded.

  This also applies to any MySQL Server version change that may apply, in addition to the NDB engine version change, so do not forget to take this into account when planning the upgrade. (This is true for online upgrades of NDB Cluster in general.)

It is not possible for any API node to perform schema operations (such as data definition statements) during a node restart. Due in part to this limitation, schema operations are also not supported during an online upgrade or downgrade. In addition, it is not possible to perform native backups while an upgrade or downgrade is ongoing.

**Rolling restarts with multiple management servers.**

When performing a rolling restart of an NDB Cluster with multiple management nodes, you should keep in mind that [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") checks to see if any other management node is running, and, if so, tries to use that node's configuration data. To keep this from occurring, and to force [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") to re-read its configuration file, perform the following steps:

1. Stop all NDB Cluster [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") processes.
2. Update all `config.ini` files.
3. Start a single [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") with [`--reload`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_reload), [`--initial`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial), or both options as desired.

4. If you started the first [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") with the [`--initial`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial) option, you must also start any remaining [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") processes using `--initial`.

   Regardless of any other options used when starting the first [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"), you should not start any remaining [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") processes after the first one using [`--reload`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_reload).

5. Complete the rolling restarts of the data nodes and API nodes as normal.

When performing a rolling restart to update the cluster's configuration, you can use the `config_generation` column of the [`ndbinfo.nodes`](mysql-cluster-ndbinfo-nodes.html "21.6.15.28 The ndbinfo nodes Table") table to keep track of which data nodes have been successfully restarted with the new configuration. See [Section 21.6.15.28, “The ndbinfo nodes Table”](mysql-cluster-ndbinfo-nodes.html "21.6.15.28 The ndbinfo nodes Table").
