### 25.6.5 Performing a Rolling Restart of an NDB Cluster

This section discusses how to perform a rolling restart of an NDB Cluster installation, so called because it involves stopping and starting (or restarting) each node in turn, so that the cluster itself remains operational. This is often done as part of a rolling upgrade or rolling downgrade, where high availability of the cluster is mandatory and no downtime of the cluster as a whole is permissible. Where we refer to upgrades, the information provided here also generally applies to downgrades as well.

There are a number of reasons why a rolling restart might be desirable. These are described in the next few paragraphs.

**Configuration change.** To make a change in the cluster's configuration, such as adding an SQL node to the cluster, or setting a configuration parameter to a new value.

**NDB Cluster software upgrade or downgrade.** To upgrade the cluster to a newer version of the NDB Cluster software (or to downgrade it to an older version). This is usually referred to as a “rolling upgrade” (or “rolling downgrade”, when reverting to an older version of NDB Cluster).

**Change on node host.** To make changes in the hardware or operating system on which one or more NDB Cluster node processes are running.

**System reset (cluster reset).** To reset the cluster because it has reached an undesirable state. In such cases it is often desirable to reload the data and metadata of one or more data nodes. This can be done in any of three ways:

* Start each data node process (**ndbd** or possibly **ndbmtd**")) with the `--initial` option, which forces the data node to clear its file system and to reload all NDB Cluster data and metadata from the other data nodes. This also forces the removal of all Disk Data objects and files associated with those objects.

* Create a backup using the **ndb_mgm** client `START BACKUP` command prior to performing the restart. Following the upgrade, restore the node or nodes using **ndb_restore**.

  See Section 25.6.8, “Online Backup of NDB Cluster”, and Section 25.5.23, “ndb_restore — Restore an NDB Cluster Backup”, for more information.

* Use **mysqldump** to create a backup prior to the upgrade; afterward, restore the dump using `LOAD DATA`.

**Resource Recovery.** To free memory previously allocated to a table by successive `INSERT` and `DELETE` operations, for re-use by other NDB Cluster tables.

The process for performing a rolling restart may be generalized as follows:

1. Stop all cluster management nodes (**ndb_mgmd** processes), reconfigure them, then restart them. (See Rolling restarts with multiple management servers.)

2. Stop, reconfigure, then restart each cluster data node (**ndbd** process) in turn.

   Some node configuration parameters can be updated by issuing `RESTART` for each of the data nodes in the **ndb_mgm** client following the previous step. Other parameters require that the data node be stopped completely using the management client `STOP` command, then started again from a system shell by invoking the **ndbd** or **ndbmtd**") executable as appropriate. (A shell command such as **kill** can also be used on most Unix systems to stop a data node process, but the `STOP` command is preferred and usually simpler.)

   Note

   On Windows, you can also use **SC STOP** and **SC START** commands, `NET STOP` and `NET START` commands, or the Windows Service Manager to stop and start nodes which have been installed as Windows services (see Section 25.3.2.4, “Installing NDB Cluster Processes as Windows Services”).

   The type of restart required is indicated in the documentation for each node configuration parameter. See Section 25.4.3, “NDB Cluster Configuration Files”.

3. Stop, reconfigure, then restart each cluster SQL node (**mysqld** process) in turn.

NDB Cluster supports a somewhat flexible order for upgrading nodes. When upgrading an NDB Cluster, you may upgrade API nodes (including SQL nodes) before upgrading the management nodes, data nodes, or both. In other words, you are permitted to upgrade the API and SQL nodes in any order. This is subject to the following provisions:

* This functionality is intended for use as part of an online upgrade only. A mix of node binaries from different NDB Cluster releases is neither intended nor supported for continuous, long-term use in a production setting.

* You must upgrade all nodes of the same type (management, data, or API node) before upgrading any nodes of a different type. This remains true regardless of the order in which the nodes are upgraded.

* You must upgrade all management nodes before upgrading any data nodes. This remains true regardless of the order in which you upgrade the cluster's API and SQL nodes.

* Features specific to the “new” version must not be used until all management nodes and data nodes have been upgraded.

  This also applies to any MySQL Server version change that may apply, in addition to the NDB engine version change, so do not forget to take this into account when planning the upgrade. (This is true for online upgrades of NDB Cluster in general.)

It is not possible for any API node to perform schema operations (such as data definition statements) during a node restart. Due in part to this limitation, schema operations are also not supported during an online upgrade or downgrade. In addition, it is not possible to perform native backups while an upgrade or downgrade is ongoing.

**Rolling restarts with multiple management servers.**

When performing a rolling restart of an NDB Cluster with multiple management nodes, you should keep in mind that **ndb_mgmd** checks to see if any other management node is running, and, if so, tries to use that node's configuration data. To keep this from occurring, and to force **ndb_mgmd** to re-read its configuration file, perform the following steps:

1. Stop all NDB Cluster **ndb_mgmd** processes.
2. Update all `config.ini` files.
3. Start a single **ndb_mgmd** with `--reload`, `--initial`, or both options as desired.

4. If you started the first **ndb_mgmd** with the `--initial` option, you must also start any remaining **ndb_mgmd** processes using `--initial`.

   Regardless of any other options used when starting the first **ndb_mgmd**, you should not start any remaining **ndb_mgmd** processes after the first one using `--reload`.

5. Complete the rolling restarts of the data nodes and API nodes as normal.

When performing a rolling restart to update the cluster's configuration, you can use the `config_generation` column of the `ndbinfo.nodes` table to keep track of which data nodes have been successfully restarted with the new configuration. See Section 25.6.15.48, “The ndbinfo nodes Table”.
