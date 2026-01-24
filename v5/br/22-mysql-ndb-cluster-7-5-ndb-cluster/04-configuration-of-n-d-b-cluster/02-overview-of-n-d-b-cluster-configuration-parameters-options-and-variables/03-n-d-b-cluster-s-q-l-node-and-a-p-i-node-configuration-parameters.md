#### 21.4.2.3 NDB Cluster SQL Node and API Node Configuration Parameters

The listing in this section provides information about parameters used in the `[mysqld]` and `[api]` sections of a `config.ini` file for configuring NDB Cluster SQL nodes and API nodes. For detailed descriptions and other additional information about each of these parameters, see [Section 21.4.3.7, “Defining SQL and Other API Nodes in an NDB Cluster”](mysql-cluster-api-definition.html "21.4.3.7 Defining SQL and Other API Nodes in an NDB Cluster").

* `ApiVerbose`: Enable NDB API debugging; for NDB development.

* `ArbitrationDelay`: When asked to arbitrate, arbitrator waits this many milliseconds before voting.

* `ArbitrationRank`: If 0, then API node is not arbitrator. Kernel selects arbitrators in order 1, 2.

* `AutoReconnect`: Specifies whether an API node should reconnect fully when disconnected from cluster.

* `BatchByteSize`: Default batch size in bytes.

* `BatchSize`: Default batch size in number of records.

* `ConnectBackoffMaxTime`: Specifies longest time in milliseconds (~100ms resolution) to allow between connection attempts to any given data node by this API node. Excludes time elapsed while connection attempts are ongoing, which in worst case can take several seconds. Disable by setting to 0. If no data nodes are currently connected to this API node, StartConnectBackoffMaxTime is used instead.

* `ConnectionMap`: Specifies which data nodes to connect.

* `DefaultHashMapSize`: Set size (in buckets) to use for table hash maps. Three values are supported: 0, 240, and 3840.

* `DefaultOperationRedoProblemAction`: How operations are handled in event that RedoOverCommitCounter is exceeded.

* `ExecuteOnComputer`: String referencing earlier defined COMPUTER.

* `ExtraSendBufferMemory`: Memory to use for send buffers in addition to any allocated by TotalSendBufferMemory or SendBufferMemory. Default (0) allows up to 16MB.

* `HeartbeatThreadPriority`: Set heartbeat thread policy and priority for API nodes; see manual for allowed values.

* `HostName`: Host name or IP address for this SQL or API node.

* `Id`: Number identifying MySQL server or API node (Id). Now deprecated; use NodeId instead.

* `LocationDomainId`: Assign this API node to specific availability domain or zone. 0 (default) leaves this unset.

* `MaxScanBatchSize`: Maximum collective batch size for one scan.

* `NodeId`: Number uniquely identifying SQL node or API node among all nodes in cluster.

* `StartConnectBackoffMaxTime`: Same as ConnectBackoffMaxTime except that this parameter is used in its place if no data nodes are connected to this API node.

* `TotalSendBufferMemory`: Total memory to use for all transporter send buffers.

* `wan`: Use WAN TCP setting as default.

For a discussion of MySQL server options for NDB Cluster, see [Section 21.4.3.9.1, “MySQL Server Options for NDB Cluster”](mysql-cluster-options-variables.html#mysql-cluster-program-options-mysqld "21.4.3.9.1 MySQL Server Options for NDB Cluster"). For information about MySQL server system variables relating to NDB Cluster, see [Section 21.4.3.9.2, “NDB Cluster System Variables”](mysql-cluster-options-variables.html#mysql-cluster-system-variables "21.4.3.9.2 NDB Cluster System Variables").

Note

To add new SQL or API nodes to the configuration of a running NDB Cluster, it is necessary to perform a rolling restart of all cluster nodes after adding new `[mysqld]` or `[api]` sections to the `config.ini` file (or files, if you are using more than one management server). This must be done before the new SQL or API nodes can connect to the cluster.

It is *not* necessary to perform any restart of the cluster if new SQL or API nodes can employ previously unused API slots in the cluster configuration to connect to the cluster.
