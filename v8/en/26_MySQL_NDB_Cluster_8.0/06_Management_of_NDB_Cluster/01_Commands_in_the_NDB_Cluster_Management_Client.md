### 25.6.1 Commands in the NDB Cluster Management Client

In addition to the central configuration file, a cluster may also be controlled through a command-line interface available through the management client **ndb_mgm**. This is the primary administrative interface to a running cluster.

Commands for the event logs are given in Section 25.6.3, “Event Reports Generated in NDB Cluster”; commands for creating backups and restoring from them are provided in Section 25.6.8, “Online Backup of NDB Cluster”.

**Using ndb_mgm with MySQL Cluster Manager.**

MySQL Cluster Manager 1.4.8 provides experimental support for NDB 8.0. MySQL Cluster Manager handles starting and stopping processes and tracks their states internally, so it is not necessary to use **ndb_mgm** for these tasks for an NDB Cluster that is under MySQL Cluster Manager control. It is recommended *not* to use the **ndb_mgm** command-line client that comes with the NDB Cluster distribution to perform operations that involve starting or stopping nodes. These include but are not limited to the `START`, `STOP`, `RESTART`, and `SHUTDOWN` commands. For more information, see MySQL Cluster Manager Process Commands.

The management client has the following basic commands. In the listing that follows, *`node_id`* denotes either a data node ID or the keyword `ALL`, which indicates that the command should be applied to all of the cluster's data nodes.

* `CONNECT connection-string`

  Connects to the management server indicated by the connection string. If the client is already connected to this server, the client reconnects.

* `CREATE NODEGROUP nodeid[, nodeid, ...]`

  Creates a new NDB Cluster node group and causes data nodes to join it.

  This command is used after adding new data nodes online to an NDB Cluster, and causes them to join a new node group and thus to begin participating fully in the cluster. The command takes as its sole parameter a comma-separated list of node IDs—these are the IDs of the nodes just added and started, and that are to join the new node group. The list must contain no duplicate IDs; beginning with NDB 8.0.26, the presence of any duplicates causes the command to return an error. The number of nodes in the list must be the same as the number of nodes in each node group that is already part of the cluster (each NDB Cluster node group must have the same number of nodes). In other words, if the NDB Cluster consists of 2 node groups having 2 data nodes each, then the new node group must also have 2 data nodes.

  The node group ID of the new node group created by this command is determined automatically, and always the next highest unused node group ID in the cluster; it is not possible to set it manually.

  For more information, see Section 25.6.7, “Adding NDB Cluster Data Nodes Online”.

* `DROP NODEGROUP nodegroup_id`

  Drops the NDB Cluster node group with the given *`nodegroup_id`*.

  This command can be used to drop a node group from an NDB Cluster. `DROP NODEGROUP` takes as its sole argument the node group ID of the node group to be dropped.

  `DROP NODEGROUP` acts only to remove the data nodes in the effected node group from that node group. It does not stop data nodes, assign them to a different node group, or remove them from the cluster's configuration. A data node that does not belong to a node group is indicated in the output of the management client `SHOW` command with `no nodegroup` in place of the node group ID, like this (indicated using bold text):

  ```
  id=3    @10.100.2.67  (8.0.44-ndb-8.0.44, no nodegroup)
  ```

  `DROP NODEGROUP` works only when all data nodes in the node group to be dropped are completely empty of any table data and table definitions. Since there is currently no way using **ndb_mgm** or the **mysql** client to remove all data from a specific data node or node group, this means that the command succeeds only in the two following cases:

  1. After issuing `CREATE NODEGROUP` in the **ndb_mgm** client, but before issuing any `ALTER TABLE ... REORGANIZE PARTITION` statements in the **mysql** client.

  2. After dropping all `NDBCLUSTER` tables using `DROP TABLE`.

     `TRUNCATE TABLE` does not work for this purpose because this removes only the table data; the data nodes continue to store an `NDBCLUSTER` table's definition until a `DROP TABLE` statement is issued that causes the table metadata to be dropped.

  For more information about `DROP NODEGROUP`, see Section 25.6.7, “Adding NDB Cluster Data Nodes Online”.

* `ENTER SINGLE USER MODE node_id`

  Enters single user mode, whereby only the MySQL server identified by the node ID *`node_id`* is permitted to access the database.

  The **ndb_mgm** client provides a clear acknowledgement that this command has been issued and has taken effect, as shown here:

  ```
  ndb_mgm> ENTER SINGLE USER MODE 100
  Single user mode entered
  Access is granted for API node 100 only.
  ```

  In addition, the API or SQL node having exclusive access when in single user mode is indicated in the output of the `SHOW` command, like this:

  ```
  ndb_mgm> SHOW
  Cluster Configuration
  ---------------------
  [ndbd(NDB)]     2 node(s)
  id=5    @127.0.0.1  (mysql-8.0.44 ndb-8.0.44, single user mode, Nodegroup: 0, *)
  id=6    @127.0.0.1  (mysql-8.0.44 ndb-8.0.44, single user mode, Nodegroup: 0)

  [ndb_mgmd(MGM)] 1 node(s)
  id=50   @127.0.0.1  (mysql-8.0.44 ndb-8.0.44)

  [mysqld(API)]   2 node(s)
  id=100  @127.0.0.1  (mysql-8.0.44 ndb-8.0.44, allowed single user)
  id=101 (not connected, accepting connect from any host)
  ```

* `EXIT SINGLE USER MODE`

  Exits single user mode, enabling all SQL nodes (that is, all running **mysqld** processes) to access the database.

  Note

  It is possible to use `EXIT SINGLE USER MODE` even when not in single user mode, although the command has no effect in this case.

* `HELP`

  Displays information on all available commands.

* `node_id NODELOG DEBUG {ON|OFF}`

  Toggles debug logging in the node log, as though the effected data node or nodes had been started with the `--verbose` option. `NODELOG DEBUG ON` starts debug logging; `NODELOG DEBUG OFF` switches debug logging off.

* `PROMPT [prompt]`

  Changes the prompt shown by **ndb_mgm** to the string literal *`prompt`*.

  *`prompt`* should not be quoted (unless you want the prompt to include the quotation marks). Unlike the case with the **mysql** client, special character sequences and escapes are not recognized. If called without an argument, the command resets the prompt to the default value (`ndb_mgm>`).

  Some examples are shown here:

  ```
  ndb_mgm> PROMPT mgm#1:
  mgm#1: SHOW
  Cluster Configuration
  ...
  mgm#1: PROMPT mymgm >
  mymgm > PROMPT 'mymgm:'
  'mymgm:' PROMPT  mymgm:
  mymgm: PROMPT
  ndb_mgm> EXIT
  $>
  ```

  Note that leading spaces and spaces within the *`prompt`* string are not trimmed. Trailing spaces are removed.

* `QUIT`, `EXIT`

  Terminates the management client.

  This command does not affect any nodes connected to the cluster.

* `node_id REPORT report-type`

  Displays a report of type *`report-type`* for the data node identified by *`node_id`*, or for all data nodes using `ALL`.

  Currently, there are three accepted values for *`report-type`*:

  + `BackupStatus` provides a status report on a cluster backup in progress

  + `MemoryUsage` displays how much data memory and index memory is being used by each data node as shown in this example:

    ```
    ndb_mgm> ALL REPORT MEMORY

    Node 1: Data usage is 5%(177 32K pages of total 3200)
    Node 1: Index usage is 0%(108 8K pages of total 12832)
    Node 2: Data usage is 5%(177 32K pages of total 3200)
    Node 2: Index usage is 0%(108 8K pages of total 12832)
    ```

    This information is also available from the `ndbinfo.memoryusage` table.

  + `EventLog` reports events from the event log buffers of one or more data nodes.

  *`report-type`* is case-insensitive and “fuzzy”; for `MemoryUsage`, you can use `MEMORY` (as shown in the prior example), `memory`, or even simply `MEM` (or `mem`). You can abbreviate `BackupStatus` in a similar fashion.

* `node_id RESTART [-n] [-i] [-a] [-f]`

  Restarts the data node identified by *`node_id`* (or all data nodes).

  Using the `-i` option with `RESTART` causes the data node to perform an initial restart; that is, the node's file system is deleted and recreated. The effect is the same as that obtained from stopping the data node process and then starting it again using **ndbd** `--initial` from the system shell.

  Note

  Backup files and Disk Data files are not removed when this option is used.

  Using the `-n` option causes the data node process to be restarted, but the data node is not actually brought online until the appropriate `START` command is issued. The effect of this option is the same as that obtained from stopping the data node and then starting it again using **ndbd** `--nostart` or **ndbd** `-n` from the system shell.

  Using the `-a` causes all current transactions relying on this node to be aborted. No GCP check is done when the node rejoins the cluster.

  Normally, `RESTART` fails if taking the node offline would result in an incomplete cluster. The `-f` option forces the node to restart without checking for this. If this option is used and the result is an incomplete cluster, the entire cluster is restarted.

* `SHOW`

  Displays basic information about the cluster and cluster nodes. For all nodes, the output includes the node's ID, type, and `NDB` software version. If the node is connected, its IP address is also shown; otherwise the output shows `not connected, accepting connect from ip_address`, with `any host` used for nodes that are permitted to connect from any address.

  In addition, for data nodes, the output includes `starting` if the node has not yet started, and shows the node group of which the node is a member. If the data node is acting as the master node, this is indicated with an asterisk (`*`).

  Consider a cluster whose configuration file includes the information shown here (possible additional settings are omitted for clarity):

  ```
  [ndbd default]
  DataMemory= 128G
  NoOfReplicas= 2

  [ndb_mgmd]
  NodeId=50
  HostName=198.51.100.150

  [ndbd]
  NodeId=5
  HostName=198.51.100.10
  DataDir=/var/lib/mysql-cluster

  [ndbd]
  NodeId=6
  HostName=198.51.100.20
  DataDir=/var/lib/mysql-cluster

  [ndbd]
  NodeId=7
  HostName=198.51.100.30
  DataDir=/var/lib/mysql-cluster

  [ndbd]
  NodeId=8
  HostName=198.51.100.40
  DataDir=/var/lib/mysql-cluster

  [mysqld]
  NodeId=100
  HostName=198.51.100.100

  [api]
  NodeId=101
  ```

  After this cluster (including one SQL node) has been started, `SHOW` displays the following output:

  ```
  ndb_mgm> SHOW
  Connected to Management Server at: localhost:1186
  Cluster Configuration
  ---------------------
  [ndbd(NDB)]     4 node(s)
  id=5    @198.51.100.10  (mysql-8.0.44 ndb-8.0.44, Nodegroup: 0, *)
  id=6    @198.51.100.20  (mysql-8.0.44 ndb-8.0.44, Nodegroup: 0)
  id=7    @198.51.100.30  (mysql-8.0.44 ndb-8.0.44, Nodegroup: 1)
  id=8    @198.51.100.40  (mysql-8.0.44 ndb-8.0.44, Nodegroup: 1)

  [ndb_mgmd(MGM)] 1 node(s)
  id=50   @198.51.100.150  (mysql-8.0.44 ndb-8.0.44)

  [mysqld(API)]   2 node(s)
  id=100  @198.51.100.100  (mysql-8.0.44 ndb-8.0.44)
  id=101 (not connected, accepting connect from any host)
  ```

  The output from this command also indicates when the cluster is in single user mode (see the description of the `ENTER SINGLE USER MODE` command, as well as Section 25.6.6, “NDB Cluster Single User Mode”). In NDB 8.0, it also indicates which API or SQL node has exclusive access when this mode is in effect; this works only when all data nodes and management nodes connected to the cluster are running NDB 8.0.

* `SHUTDOWN`

  Shuts down all cluster data nodes and management nodes. To exit the management client after this has been done, use `EXIT` or `QUIT`.

  This command does *not* shut down any SQL nodes or API nodes that are connected to the cluster.

* `node_id START`

  Brings online the data node identified by *`node_id`* (or all data nodes).

  `ALL START` works on all data nodes only, and does not affect management nodes.

  Important

  To use this command to bring a data node online, the data node must have been started using `--nostart` or `-n`.

* `node_id STATUS`

  Displays status information for the data node identified by *`node_id`* (or for all data nodes).

  Possible node status values include `UNKNOWN`, `NO_CONTACT`, `NOT_STARTED`, `STARTING`, `STARTED`, `SHUTTING_DOWN`, and `RESTARTING`.

  The output from this command also indicates when the cluster is in single user mode.

* `node_id STOP [-a] [-f]`

  Stops the data or management node identified by *`node_id`*.

  Note

  `ALL STOP` works to stop all data nodes only, and does not affect management nodes.

  A node affected by this command disconnects from the cluster, and its associated **ndbd** or **ndb_mgmd** process terminates.

  The `-a` option causes the node to be stopped immediately, without waiting for the completion of any pending transactions.

  Normally, `STOP` fails if the result would cause an incomplete cluster. The `-f` option forces the node to shut down without checking for this. If this option is used and the result is an incomplete cluster, the cluster immediately shuts down.

  Warning

  Use of the `-a` option also disables the safety check otherwise performed when `STOP` is invoked to insure that stopping the node does not cause an incomplete cluster. In other words, you should exercise extreme care when using the `-a` option with the `STOP` command, due to the fact that this option makes it possible for the cluster to undergo a forced shutdown because it no longer has a complete copy of all data stored in `NDB`.

**Additional commands.** A number of other commands available in the **ndb_mgm** client are described elsewhere, as shown in the following list:

* `START BACKUP` is used to perform an online backup in the **ndb_mgm** client; the `ABORT BACKUP` command is used to cancel a backup already in progress. For more information, see Section 25.6.8, “Online Backup of NDB Cluster”.

* The `CLUSTERLOG` command is used to perform various logging functions. See Section 25.6.3, “Event Reports Generated in NDB Cluster”, for more information and examples. `NODELOG DEBUG` activates or deactivates debug printouts in node logs, as described previously in this section.

* For testing and diagnostics work, the client supports a `DUMP` command which can be used to execute internal commands on the cluster. It should never be used in a production setting unless directed to do so by MySQL Support. For more information, see NDB Cluster Management Client DUMP Commands.
