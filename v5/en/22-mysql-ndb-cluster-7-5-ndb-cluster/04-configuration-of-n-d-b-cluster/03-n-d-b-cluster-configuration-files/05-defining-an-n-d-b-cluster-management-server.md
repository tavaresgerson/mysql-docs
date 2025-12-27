#### 21.4.3.5 Defining an NDB Cluster Management Server

The `[ndb_mgmd]` section is used to configure the behavior of the management server. If multiple management servers are employed, you can specify parameters common to all of them in an `[ndb_mgmd default]` section. `[mgm]` and `[mgm default]` are older aliases for these, supported for backward compatibility.

All parameters in the following list are optional and assume their default values if omitted.

Note

If neither the `ExecuteOnComputer` nor the `HostName` parameter is present, the default value `localhost` is assumed for both.

* `Id`

  <table frame="box" rules="all" summary="Id management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a <a class="link" href="mysql-cluster-backup.html" title="21.6.8 Online Backup of NDB Cluster">backup</a>, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Each node in the cluster has a unique identity. For a management node, this is represented by an integer value in the range 1 to 255, inclusive. This ID is used by all internal cluster messages for addressing the node, and so must be unique for each NDB Cluster node, regardless of the type of node.

  Note

  Data node IDs must be less than 49. If you plan to deploy a large number of data nodes, it is a good idea to limit the node IDs for management nodes (and API nodes) to values greater than 48.

  The use of the `Id` parameter for identifying management nodes is deprecated in favor of [`NodeId`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-nodeid). Although `Id` continues to be supported for backward compatibility, it now generates a warning and is subject to removal in a future version of NDB Cluster.

* `NodeId`

  <table frame="box" rules="all" summary="NodeId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a <a class="link" href="mysql-cluster-backup.html" title="21.6.8 Online Backup of NDB Cluster">backup</a>, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Each node in the cluster has a unique identity. For a management node, this is represented by an integer value in the range 1 to 255 inclusive. This ID is used by all internal cluster messages for addressing the node, and so must be unique for each NDB Cluster node, regardless of the type of node.

  Note

  Data node IDs must be less than 49. If you plan to deploy a large number of data nodes, it is a good idea to limit the node IDs for management nodes (and API nodes) to values greater than 48.

  `NodeId` is the preferred parameter name to use when identifying management nodes. Although the older [`Id`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-id) continues to be supported for backward compatibility, it is now deprecated and generates a warning when used; it is also subject to removal in a future NDB Cluster release.

* `ExecuteOnComputer`

  <table frame="box" rules="all" summary="ExecuteOnComputer management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This refers to the `Id` set for one of the computers defined in a `[computer]` section of the `config.ini` file.

  Important

  This parameter is deprecated as of NDB 7.5.0, and is subject to removal in a future release. Use the [`HostName`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-hostname) parameter instead.

* `PortNumber`

  <table frame="box" rules="all" summary="PortNumber management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>1186</td> </tr><tr> <th>Range</th> <td>0 - 64K</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This is the port number on which the management server listens for configuration requests and management commands.

* `HostName`

  <table frame="box" rules="all" summary="HostName management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Specifying this parameter defines the hostname of the computer on which the management node is to reside. Use `HostName` to specify a host name other than `localhost`.

* [`LocationDomainId`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-locationdomainid)

  <table frame="box" rules="all" summary="LocationDomainId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Assigns a management node to a specific [availability domain](https://docs.us-phoenix-1.oraclecloud.com/Content/General/Concepts/regions.htm) (also known as an availability zone) within a cloud. By informing `NDB` which nodes are in which availability domains, performance can be improved in a cloud environment in the following ways:

  + If requested data is not found on the same node, reads can be directed to another node in the same availability domain.

  + Communication between nodes in different availability domains are guaranteed to use `NDB` transporters' WAN support without any further manual intervention.

  + The transporter's group number can be based on which availability domain is used, such that also SQL and other API nodes communicate with local data nodes in the same availability domain whenever possible.

  + The arbitrator can be selected from an availability domain in which no data nodes are present, or, if no such availability domain can be found, from a third availability domain.

  `LocationDomainId` takes an integer value between 0 and 16 inclusive, with 0 being the default; using 0 is the same as leaving the parameter unset.

* [`LogDestination`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-logdestination)

  <table frame="box" rules="all" summary="LogDestination management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>{CONSOLE|SYSLOG|FILE}</td> </tr><tr> <th>Default</th> <td>FILE: filename=ndb_nodeid_cluster.log, maxsize=1000000, maxfiles=6</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter specifies where to send cluster logging information. There are three options in this regard—`CONSOLE`, `SYSLOG`, and `FILE`—with `FILE` being the default:

  + `CONSOLE` outputs the log to `stdout`:

    ```sql
    CONSOLE
    ```

  + `SYSLOG` sends the log to a `syslog` facility, possible values being one of `auth`, `authpriv`, `cron`, `daemon`, `ftp`, `kern`, `lpr`, `mail`, `news`, `syslog`, `user`, `uucp`, `local0`, `local1`, `local2`, `local3`, `local4`, `local5`, `local6`, or `local7`.

    Note

    Not every facility is necessarily supported by every operating system.

    ```sql
    SYSLOG:facility=syslog
    ```

  + `FILE` pipes the cluster log output to a regular file on the same machine. The following values can be specified:

    - `filename`: The name of the log file.

      The default log file name used in such cases is `ndb_nodeid_cluster.log`.

    - `maxsize`: The maximum size (in bytes) to which the file can grow before logging rolls over to a new file. When this occurs, the old log file is renamed by appending *`.N`* to the file name, where *`N`* is the next number not yet used with this name.

    - `maxfiles`: The maximum number of log files.

    ```sql
    FILE:filename=cluster.log,maxsize=1000000,maxfiles=6
    ```

    The default value for the `FILE` parameter is `FILE:filename=ndb_node_id_cluster.log,maxsize=1000000,maxfiles=6`, where *`node_id`* is the ID of the node.

  It is possible to specify multiple log destinations separated by semicolons as shown here:

  ```sql
  CONSOLE;SYSLOG:facility=local0;FILE:filename=/var/log/mgmd
  ```

* `ArbitrationRank`

  <table frame="box" rules="all" summary="ArbitrationRank management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>0-2</td> </tr><tr> <th>Default</th> <td>1</td> </tr><tr> <th>Range</th> <td>0 - 2</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter is used to define which nodes can act as arbitrators. Only management nodes and SQL nodes can be arbitrators. `ArbitrationRank` can take one of the following values:

  + `0`: The node is never used as an arbitrator.

  + `1`: The node has high priority; that is, it is preferred as an arbitrator over low-priority nodes.

  + `2`: Indicates a low-priority node which is used as an arbitrator only if a node with a higher priority is not available for that purpose.

  Normally, the management server should be configured as an arbitrator by setting its `ArbitrationRank` to 1 (the default for management nodes) and those for all SQL nodes to 0 (the default for SQL nodes).

  You can disable arbitration completely either by setting `ArbitrationRank` to 0 on all management and SQL nodes, or by setting the [`Arbitration`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-arbitration) parameter in the `[ndbd default]` section of the `config.ini` global configuration file. Setting [`Arbitration`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-arbitration) causes any settings for `ArbitrationRank` to be disregarded.

* `ArbitrationDelay`

  <table frame="box" rules="all" summary="ArbitrationDelay management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>milliseconds</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  An integer value which causes the management server's responses to arbitration requests to be delayed by that number of milliseconds. By default, this value is 0; it is normally not necessary to change it.

* `DataDir`

  <table frame="box" rules="all" summary="DataDir management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This specifies the directory where output files from the management server are placed. These files include cluster log files, process output files, and the daemon's process ID (PID) file. (For log files, this location can be overridden by setting the `FILE` parameter for [`LogDestination`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-logdestination) as discussed previously in this section.)

  The default value for this parameter is the directory in which [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") is located.

* `PortNumberStats`

  <table frame="box" rules="all" summary="NodeId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a <a class="link" href="mysql-cluster-backup.html" title="21.6.8 Online Backup of NDB Cluster">backup</a>, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>0

  This parameter specifies the port number used to obtain statistical information from an NDB Cluster management server. It has no default value.

* [`Wan`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-wan)

  <table frame="box" rules="all" summary="NodeId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a <a class="link" href="mysql-cluster-backup.html" title="21.6.8 Online Backup of NDB Cluster">backup</a>, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>1

  Use WAN TCP setting as default.

* `HeartbeatThreadPriority`

  <table frame="box" rules="all" summary="NodeId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a <a class="link" href="mysql-cluster-backup.html" title="21.6.8 Online Backup of NDB Cluster">backup</a>, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>2

  Set the scheduling policy and priority of heartbeat threads for management and API nodes.

  The syntax for setting this parameter is shown here:

  ```sql
  HeartbeatThreadPriority = policy[, priority]

  policy:
    {FIFO | RR}
  ```

  When setting this parameter, you must specify a policy. This is one of `FIFO` (first in, first out) or `RR` (round robin). The policy value is followed optionally by the priority (an integer).

* `ExtraSendBufferMemory`

  <table frame="box" rules="all" summary="NodeId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a <a class="link" href="mysql-cluster-backup.html" title="21.6.8 Online Backup of NDB Cluster">backup</a>, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>3

  This parameter specifies the amount of transporter send buffer memory to allocate in addition to any that has been set using [`TotalSendBufferMemory`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-totalsendbuffermemory), [`SendBufferMemory`](mysql-cluster-tcp-definition.html#ndbparam-tcp-sendbuffermemory), or both.

* `TotalSendBufferMemory`

  <table frame="box" rules="all" summary="NodeId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a <a class="link" href="mysql-cluster-backup.html" title="21.6.8 Online Backup of NDB Cluster">backup</a>, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>4

  This parameter is used to determine the total amount of memory to allocate on this node for shared send buffer memory among all configured transporters.

  If this parameter is set, its minimum permitted value is 256KB; 0 indicates that the parameter has not been set. For more detailed information, see [Section 21.4.3.13, “Configuring NDB Cluster Send Buffer Parameters”](mysql-cluster-config-send-buffers.html "21.4.3.13 Configuring NDB Cluster Send Buffer Parameters").

* `HeartbeatIntervalMgmdMgmd`

  <table frame="box" rules="all" summary="NodeId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a <a class="link" href="mysql-cluster-backup.html" title="21.6.8 Online Backup of NDB Cluster">backup</a>, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>5

  Specify the interval between heartbeat messages used to determine whether another management node is on contact with this one. The management node waits after 3 of these intervals to declare the connection dead; thus, the default setting of 1500 milliseconds causes the management node to wait for approximately 1600 ms before timing out.

Note

After making changes in a management node's configuration, it is necessary to perform a rolling restart of the cluster for the new configuration to take effect.

To add new management servers to a running NDB Cluster, it is also necessary to perform a rolling restart of all cluster nodes after modifying any existing `config.ini` files. For more information about issues arising when using multiple management nodes, see [Section 21.2.7.10, “Limitations Relating to Multiple NDB Cluster Nodes”](mysql-cluster-limitations-multiple-nodes.html "21.2.7.10 Limitations Relating to Multiple NDB Cluster Nodes").

**Restart types.** Information about the restart types used by the parameter descriptions in this section is shown in the following table:

**Table 21.8 NDB Cluster restart types**

<table frame="box" rules="all" summary="NodeId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a <a class="link" href="mysql-cluster-backup.html" title="21.6.8 Online Backup of NDB Cluster">backup</a>, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>6
