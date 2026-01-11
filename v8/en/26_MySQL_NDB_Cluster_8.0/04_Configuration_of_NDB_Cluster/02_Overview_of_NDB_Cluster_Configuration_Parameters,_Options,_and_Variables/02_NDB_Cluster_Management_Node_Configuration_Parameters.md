#### 25.4.2.2 NDB Cluster Management Node Configuration Parameters

The listing in this section provides information about parameters used in the `[ndb_mgmd]` or `[mgm]` section of a `config.ini` file for configuring NDB Cluster management nodes. For detailed descriptions and other additional information about each of these parameters, see Section 25.4.3.5, “Defining an NDB Cluster Management Server”.

* `ArbitrationDelay`: When asked to arbitrate, arbitrator waits this long before voting (milliseconds).

* `ArbitrationRank`: If 0, then management node is not arbitrator. Kernel selects arbitrators in order 1, 2.

* `DataDir`: Data directory for this node.

* `ExecuteOnComputer`: String referencing earlier defined COMPUTER.

* `ExtraSendBufferMemory`: Memory to use for send buffers in addition to any allocated by TotalSendBufferMemory or SendBufferMemory. Default (0) allows up to 16MB.

* `HeartbeatIntervalMgmdMgmd`: Time between management-node-to-management-node heartbeats; connection between management nodes is considered lost after 3 missed heartbeats.

* `HeartbeatThreadPriority`: Set heartbeat thread policy and priority for management nodes; see manual for allowed values.

* `HostName`: Host name or IP address for this management node.

* `Id`: Number identifying management node. Now deprecated; use NodeId instead.

* `LocationDomainId`: Assign this management node to specific availability domain or zone. 0 (default) leaves this unset.

* `LogDestination`: Where to send log messages: console, system log, or specified log file.

* `NodeId`: Number uniquely identifying management node among all nodes in cluster.

* `PortNumber`: Port number to send commands to and fetch configuration from management server.

* `PortNumberStats`: Port number used to get statistical information from management server.

* `TotalSendBufferMemory`: Total memory to use for all transporter send buffers.

* `wan`: Use WAN TCP setting as default.

Note

After making changes in a management node's configuration, it is necessary to perform a rolling restart of the cluster for the new configuration to take effect. See Section 25.4.3.5, “Defining an NDB Cluster Management Server”, for more information.

To add new management servers to a running NDB Cluster, it is also necessary perform a rolling restart of all cluster nodes after modifying any existing `config.ini` files. For more information about issues arising when using multiple management nodes, see Section 25.2.7.10, “Limitations Relating to Multiple NDB Cluster Nodes”.
