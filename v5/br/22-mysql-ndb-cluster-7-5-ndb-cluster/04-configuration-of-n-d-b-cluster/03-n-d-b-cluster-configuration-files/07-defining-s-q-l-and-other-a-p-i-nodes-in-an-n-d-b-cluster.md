#### 21.4.3.7 Defining SQL and Other API Nodes in an NDB Cluster

The `[mysqld]` and `[api]` sections in the `config.ini` file define the behavior of the MySQL servers (SQL nodes) and other applications (API nodes) used to access cluster data. None of the parameters shown is required. If no computer or host name is provided, any host can use this SQL or API node.

Generally speaking, a `[mysqld]` section is used to indicate a MySQL server providing an SQL interface to the cluster, and an `[api]` section is used for applications other than [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") processes accessing cluster data, but the two designations are actually synonymous; you can, for instance, list parameters for a MySQL server acting as an SQL node in an `[api]` section.

Note

For a discussion of MySQL server options for NDB Cluster, see [Section 21.4.3.9.1, “MySQL Server Options for NDB Cluster”](mysql-cluster-options-variables.html#mysql-cluster-program-options-mysqld "21.4.3.9.1 MySQL Server Options for NDB Cluster"). For information about MySQL server system variables relating to NDB Cluster, see [Section 21.4.3.9.2, “NDB Cluster System Variables”](mysql-cluster-options-variables.html#mysql-cluster-system-variables "21.4.3.9.2 NDB Cluster System Variables").

* `Id`

  <table frame="box" rules="all" summary="Id API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The `Id` is an integer value used to identify the node in all cluster internal messages. The permitted range of values is 1 to 255 inclusive. This value must be unique for each node in the cluster, regardless of the type of node.

  Note

  Data node IDs must be less than 49, regardless of the NDB Cluster version used. If you plan to deploy a large number of data nodes, it is a good idea to limit the node IDs for API nodes (and management nodes) to values greater than 48.

  [`NodeId`](mysql-cluster-api-definition.html#ndbparam-api-nodeid) is the preferred parameter name to use when identifying API nodes. (`Id` continues to be supported for backward compatibility, but is now deprecated and generates a warning when used. It is also subject to future removal.)

* `ConnectionMap`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Specifies which data nodes to connect.

* `NodeId`

  <table frame="box" rules="all" summary="NodeId API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The `NodeId` is an integer value used to identify the node in all cluster internal messages. The permitted range of values is 1 to 255 inclusive. This value must be unique for each node in the cluster, regardless of the type of node.

  Note

  Data node IDs must be less than 49, regardless of the NDB Cluster version used. If you plan to deploy a large number of data nodes, it is a good idea to limit the node IDs for API nodes (and management nodes) to values greater than 48.

  [`NodeId`](mysql-cluster-api-definition.html#ndbparam-api-nodeid) is the preferred parameter name to use when identifying management nodes. An alias, `Id`, was used for this purpose in very old versions of NDB Cluster, and continues to be supported for backward compatibility; it is now deprecated and generates a warning when used, and is subject to removal in a future release of NDB Cluster.

* `ExecuteOnComputer`

  <table frame="box" rules="all" summary="ExecuteOnComputer API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This refers to the `Id` set for one of the computers (hosts) defined in a `[computer]` section of the configuration file.

  Important

  This parameter is deprecated as of NDB 7.5.0, and is subject to removal in a future release. Use the [`HostName`](mysql-cluster-api-definition.html#ndbparam-api-hostname) parameter instead.

* `HostName`

  <table frame="box" rules="all" summary="HostName API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Specifying this parameter defines the host name of the computer on which the SQL node (API node) is to reside.

  If no `HostName` is specified in a given `[mysql]` or `[api]` section of the `config.ini` file, then an SQL or API node may connect using the corresponding “slot” from any host which can establish a network connection to the management server host machine. *This differs from the default behavior for data nodes, where `localhost` is assumed for `HostName` unless otherwise specified*.

* [`LocationDomainId`](mysql-cluster-api-definition.html#ndbparam-api-locationdomainid)

  <table frame="box" rules="all" summary="LocationDomainId API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Assigns an SQL or other API node to a specific [availability domain](https://docs.us-phoenix-1.oraclecloud.com/Content/General/Concepts/regions.htm) (also known as an availability zone) within a cloud. By informing `NDB` which nodes are in which availability domains, performance can be improved in a cloud environment in the following ways:

  + If requested data is not found on the same node, reads can be directed to another node in the same availability domain.

  + Communication between nodes in different availability domains are guaranteed to use `NDB` transporters' WAN support without any further manual intervention.

  + The transporter's group number can be based on which availability domain is used, such that also SQL and other API nodes communicate with local data nodes in the same availability domain whenever possible.

  + The arbitrator can be selected from an availability domain in which no data nodes are present, or, if no such availability domain can be found, from a third availability domain.

  `LocationDomainId` takes an integer value between 0 and 16 inclusive, with 0 being the default; using 0 is the same as leaving the parameter unset.

* `ArbitrationRank`

  <table frame="box" rules="all" summary="ArbitrationRank API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>0-2</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 2</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter defines which nodes can act as arbitrators. Both management nodes and SQL nodes can be arbitrators. A value of 0 means that the given node is never used as an arbitrator, a value of 1 gives the node high priority as an arbitrator, and a value of 2 gives it low priority. A normal configuration uses the management server as arbitrator, setting its `ArbitrationRank` to 1 (the default for management nodes) and those for all SQL nodes to 0 (the default for SQL nodes).

  By setting `ArbitrationRank` to 0 on all management and SQL nodes, you can disable arbitration completely. You can also control arbitration by overriding this parameter; to do so, set the [`Arbitration`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-arbitration) parameter in the `[ndbd default]` section of the `config.ini` global configuration file.

* `ArbitrationDelay`

  <table frame="box" rules="all" summary="ArbitrationDelay API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>milliseconds</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Setting this parameter to any other value than 0 (the default) means that responses by the arbitrator to arbitration requests are delayed by the stated number of milliseconds. It is usually not necessary to change this value.

* [`BatchByteSize`](mysql-cluster-api-definition.html#ndbparam-api-batchbytesize)

  <table frame="box" rules="all" summary="BatchByteSize API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>bytes</td> </tr><tr> <th>Default</th> <td>16K</td> </tr><tr> <th>Range</th> <td>1K - 1M</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  For queries that are translated into full table scans or range scans on indexes, it is important for best performance to fetch records in properly sized batches. It is possible to set the proper size both in terms of number of records ([`BatchSize`](mysql-cluster-api-definition.html#ndbparam-api-batchsize)) and in terms of bytes (`BatchByteSize`). The actual batch size is limited by both parameters.

  The speed at which queries are performed can vary by more than 40% depending upon how this parameter is set.

  This parameter is measured in bytes. The default value is 16K.

* [`BatchSize`](mysql-cluster-api-definition.html#ndbparam-api-batchsize)

  <table frame="box" rules="all" summary="BatchSize API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>records</td> </tr><tr> <th>Default</th> <td>256</td> </tr><tr> <th>Range</th> <td>1 - 992</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter is measured in number of records and is by default set to 256. The maximum size is 992.

* [`ExtraSendBufferMemory`](mysql-cluster-api-definition.html#ndbparam-api-extrasendbuffermemory)

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter specifies the amount of transporter send buffer memory to allocate in addition to any that has been set using [`TotalSendBufferMemory`](mysql-cluster-api-definition.html#ndbparam-api-totalsendbuffermemory), [`SendBufferMemory`](mysql-cluster-tcp-definition.html#ndbparam-tcp-sendbuffermemory), or both.

* [`HeartbeatThreadPriority`](mysql-cluster-api-definition.html#ndbparam-api-heartbeatthreadpriority)

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Use this parameter to set the scheduling policy and priority of heartbeat threads for management and API nodes. The syntax for setting this parameter is shown here:

  ```sql
  HeartbeatThreadPriority = policy[, priority]

  policy:
    {FIFO | RR}
  ```

  When setting this parameter, you must specify a policy. This is one of `FIFO` (first in, first in) or `RR` (round robin). This followed optionally by the priority (an integer).

* [`MaxScanBatchSize`](mysql-cluster-api-definition.html#ndbparam-api-maxscanbatchsize)

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The batch size is the size of each batch sent from each data node. Most scans are performed in parallel to protect the MySQL Server from receiving too much data from many nodes in parallel; this parameter sets a limit to the total batch size over all nodes.

  The default value of this parameter is set to 256KB. Its maximum size is 16MB.

* `TotalSendBufferMemory`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter is used to determine the total amount of memory to allocate on this node for shared send buffer memory among all configured transporters.

  If this parameter is set, its minimum permitted value is 256KB; 0 indicates that the parameter has not been set. For more detailed information, see [Section 21.4.3.13, “Configuring NDB Cluster Send Buffer Parameters”](mysql-cluster-config-send-buffers.html "21.4.3.13 Configuring NDB Cluster Send Buffer Parameters").

* [`AutoReconnect`](mysql-cluster-api-definition.html#ndbparam-api-autoreconnect)

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter is `false` by default. This forces disconnected API nodes (including MySQL Servers acting as SQL nodes) to use a new connection to the cluster rather than attempting to re-use an existing one, as re-use of connections can cause problems when using dynamically-allocated node IDs. (Bug #45921)

  Note

  This parameter can be overridden using the NDB API. For more information, see [Ndb_cluster_connection::set_auto_reconnect()](/doc/ndbapi/en/ndb-ndb-cluster-connection.html#ndb-ndb-cluster-connection-set-auto-reconnect), and [Ndb_cluster_connection::get_auto_reconnect()](/doc/ndbapi/en/ndb-ndb-cluster-connection.html#ndb-ndb-cluster-connection-get-auto-reconnect).

* [`DefaultOperationRedoProblemAction`](mysql-cluster-api-definition.html#ndbparam-api-defaultoperationredoproblemaction)

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter (along with [`RedoOverCommitLimit`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-redoovercommitlimit) and [`RedoOverCommitCounter`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-redoovercommitcounter)) controls the data node's handling of operations when too much time is taken flushing redo logs to disk. This occurs when a given redo log flush takes longer than [`RedoOverCommitLimit`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-redoovercommitlimit) seconds, more than [`RedoOverCommitCounter`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-redoovercommitcounter) times, causing any pending transactions to be aborted.

  When this happens, the node can respond in either of two ways, according to the value of `DefaultOperationRedoProblemAction`, listed here:

  + `ABORT`: Any pending operations from aborted transactions are also aborted.

  + `QUEUE`: Pending operations from transactions that were aborted are queued up to be re-tried. This the default. Pending operations are still aborted when the redo log runs out of space—that is, when P_TAIL_PROBLEM errors occur.

* [`DefaultHashMapSize`](mysql-cluster-api-definition.html#ndbparam-api-defaulthashmapsize)

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The size of the table hash maps used by [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") is configurable using this parameter. `DefaultHashMapSize` can take any of three possible values (0, 240, 3840).

  The original intended use for this parameter was to facilitate upgrades and especially downgrades to and from very old releases with differing default hash map sizes. This is not an issue when upgrading from NDB Cluster 7.3 (or later) to later versions.

  Decreasing this parameter online after any tables have been created or modified with `DefaultHashMapSize` equal to 3840 is not currently supported.

* [`Wan`](mysql-cluster-api-definition.html#ndbparam-api-wan)

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Use WAN TCP setting as default.

* [`ConnectBackoffMaxTime`](mysql-cluster-api-definition.html#ndbparam-api-connectbackoffmaxtime)

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  In an NDB Cluster with many unstarted data nodes, the value of this parameter can be raised to circumvent connection attempts to data nodes which have not yet begun to function in the cluster, as well as moderate high traffic to management nodes. As long as the API node is not connected to any new data nodes, the value of the [`StartConnectBackoffMaxTime`](mysql-cluster-api-definition.html#ndbparam-api-startconnectbackoffmaxtime) parameter is applied; otherwise, `ConnectBackoffMaxTime` is used to determine the length of time in milliseconds to wait between connection attempts.

  Time elapsed *during* node connection attempts is not taken into account when calculating elapsed time for this parameter. The timeout is applied with approximately 100 ms resolution, starting with a 100 ms delay; for each subsequent attempt, the length of this period is doubled until it reaches `ConnectBackoffMaxTime` milliseconds, up to a maximum of 100000 ms (100s).

  Once the API node is connected to a data node and that node reports (in a heartbeat message) that it has connected to other data nodes, connection attempts to those data nodes are no longer affected by this parameter, and are made every 100 ms thereafter until connected. Once a data node has started, it can take up [`HeartbeatIntervalDbApi`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatintervaldbapi) for the API node to be notified that this has occurred.

* [`StartConnectBackoffMaxTime`](mysql-cluster-api-definition.html#ndbparam-api-startconnectbackoffmaxtime)

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  In an NDB Cluster with many unstarted data nodes, the value of this parameter can be raised to circumvent connection attempts to data nodes which have not yet begun to function in the cluster, as well as moderate high traffic to management nodes. As long as the API node is not connected to any new data nodes, the value of the `StartConnectBackoffMaxTime` parameter is applied; otherwise, [`ConnectBackoffMaxTime`](mysql-cluster-api-definition.html#ndbparam-api-connectbackoffmaxtime) is used to determine the length of time in milliseconds to wait between connection attempts.

  Time elapsed *during* node connection attempts is not taken into account when calculating elapsed time for this parameter. The timeout is applied with approximately 100 ms resolution, starting with a 100 ms delay; for each subsequent attempt, the length of this period is doubled until it reaches `StartConnectBackoffMaxTime` milliseconds, up to a maximum of 100000 ms (100s).

  Once the API node is connected to a data node and that node reports (in a heartbeat message) that it has connected to other data nodes, connection attempts to those data nodes are no longer affected by this parameter, and are made every 100 ms thereafter until connected. Once a data node has started, it can take up [`HeartbeatIntervalDbApi`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatintervaldbapi) for the API node to be notified that this has occurred.

**API Node Debugging Parameters.** You can use the `ApiVerbose` configuration parameter to enable debugging output from a given API node. This parameter takes an integer value. 0 is the default, and disables such debugging; 1 enables debugging output to the cluster log; 2 adds [`DBDICT`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbdict.html) debugging output as well. (Bug #20638450) See also [DUMP 1229](/doc/ndb-internals/en/dump-command-1229.html).

You can also obtain information from a MySQL server running as an NDB Cluster SQL node using [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") in the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, as shown here:

```sql
mysql> SHOW STATUS LIKE 'ndb%';
+-----------------------------+----------------+
| Variable_name               | Value          |
+-----------------------------+----------------+
| Ndb_cluster_node_id         | 5              |
| Ndb_config_from_host        | 198.51.100.112 |
| Ndb_config_from_port        | 1186           |
| Ndb_number_of_storage_nodes | 4              |
+-----------------------------+----------------+
4 rows in set (0.02 sec)
```

For information about the status variables appearing in the output from this statement, see [Section 21.4.3.9.3, “NDB Cluster Status Variables”](mysql-cluster-options-variables.html#mysql-cluster-status-variables "21.4.3.9.3 NDB Cluster Status Variables").

Note

To add new SQL or API nodes to the configuration of a running NDB Cluster, it is necessary to perform a rolling restart of all cluster nodes after adding new `[mysqld]` or `[api]` sections to the `config.ini` file (or files, if you are using more than one management server). This must be done before the new SQL or API nodes can connect to the cluster.

It is *not* necessary to perform any restart of the cluster if new SQL or API nodes can employ previously unused API slots in the cluster configuration to connect to the cluster.

**Restart types.** Information about the restart types used by the parameter descriptions in this section is shown in the following table:

**Table 21.16 NDB Cluster restart types**

<table frame="box" rules="all" summary="NodeId API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>
