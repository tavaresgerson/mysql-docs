#### 25.4.2.4 Other NDB Cluster Configuration Parameters

The listings in this section provide information about parameters used in the `[computer]`, `[tcp]`, and `[shm]` sections of a `config.ini` file for configuring NDB Cluster. For detailed descriptions and additional information about individual parameters, see Section 25.4.3.10, “NDB Cluster TCP/IP Connections”, or Section 25.4.3.12, “NDB Cluster Shared-Memory Connections”, as appropriate.

The following parameters apply to the `config.ini` file's `[computer]` section:

* `HostName`: Host name or IP address of this computer.

* `Id`: Unique identifier for this computer.

The following parameters apply to the `config.ini` file's `[tcp]` section:

* `AllowUnresolvedHostNames`: When false (default), failure by management node to resolve host name results in fatal error; when true, unresolved host names are reported as warnings only.

* `Checksum`: If checksum is enabled, all signals between nodes are checked for errors.

* `Group`: Used for group proximity; smaller value is interpreted as being closer.

* `HostName1`: Name or IP address of first of two computers joined by TCP connection.

* `HostName2`: Name or IP address of second of two computers joined by TCP connection.

* `NodeId1`: ID of node (data node, API node, or management node) on one side of connection.

* `NodeId2`: ID of node (data node, API node, or management node) on one side of connection.

* `NodeIdServer`: Set server side of TCP connection.

* `OverloadLimit`: When more than this many unsent bytes are in send buffer, connection is considered overloaded.

* `PreferIPVersion`: Indicate DNS resolver preference for IP version 4 or 6.

* `PreSendChecksum`: If this parameter and Checksum are both enabled, perform pre-send checksum checks, and check all TCP signals between nodes for errors.

* `Proxy`: ....

* `ReceiveBufferMemory`: Bytes of buffer for signals received by this node.

* `SendBufferMemory`: Bytes of TCP buffer for signals sent from this node.

* `SendSignalId`: Sends ID in each signal. Used in trace files. Defaults to true in debug builds.

* `TcpSpinTime`: Time to spin before going to sleep when receiving.

* `TCP_MAXSEG_SIZE`: Value used for TCP_MAXSEG.

* `TCP_RCV_BUF_SIZE`: Value used for SO_RCVBUF.

* `TCP_SND_BUF_SIZE`: Value used for SO_SNDBUF.

* `TcpBind_INADDR_ANY`: Bind InAddrAny instead of host name for server part of connection.

The following parameters apply to the `config.ini` file's `[shm]` section:

* `Checksum`: If checksum is enabled, all signals between nodes are checked for errors.

* `Group`: Used for group proximity; smaller value is interpreted as being closer.

* `HostName1`: Name or IP address of first of two computers joined by SHM connection.

* `HostName2`: Name or IP address of second of two computers joined by SHM connection.

* `NodeId1`: ID of node (data node, API node, or management node) on one side of connection.

* `NodeId2`: ID of node (data node, API node, or management node) on one side of connection.

* `NodeIdServer`: Set server side of SHM connection.

* `OverloadLimit`: When more than this many unsent bytes are in send buffer, connection is considered overloaded.

* `PreSendChecksum`: If this parameter and Checksum are both enabled, perform pre-send checksum checks, and check all SHM signals between nodes for errors.

* `SendBufferMemory`: Bytes in shared memory buffer for signals sent from this node.

* `SendSignalId`: Sends ID in each signal. Used in trace files.

* `ShmKey`: Shared memory key; when set to 1, this is calculated by NDB.

* `ShmSpinTime`: When receiving, number of microseconds to spin before sleeping.

* `ShmSize`: Size of shared memory segment.

* `Signum`: Signal number to be used for signalling.
