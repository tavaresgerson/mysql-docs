#### 25.4.3.12 NDB Cluster Shared-Memory Connections

Communications between NDB cluster nodes are normally handled using TCP/IP. The shared memory (SHM) transporter is distinguished by the fact that signals are transmitted by writing in memory rather than on a socket. The shared-memory transporter (SHM) can improve performance by negating up to 20% of the overhead required by a TCP connection when running an API node (usually an SQL node) and a data node together on the same host. You can enable a shared memory connection in either of the two ways listed here:

* By setting the `UseShm` data node configuration parameter to `1`, and setting `HostName` for the data node and `HostName` for the API node to the same value.

* By using `[shm]` sections in the cluster configuration file, each containing settings for `NodeId1` and `NodeId2`. This method is described in more detail later in this section.

Suppose a cluster is running a data node which has node ID 1 and an SQL node having node ID 51 on the same host computer at 10.0.0.1. To enable an SHM connection between these two nodes, all that is necessary is to insure that the following entries are included in the cluster configuration file:

```
[ndbd]
NodeId=1
HostName=10.0.0.1
UseShm=1

[mysqld]
NodeId=51
HostName=10.0.0.1
```

Important

The two entries just shown are in addition to any other entries and parameter settings needed by the cluster. A more complete example is shown later in this section.

Before starting data nodes that use SHM connections, it is also necessary to make sure that the operating system on each computer hosting such a data node has sufficient memory allocated to shared memory segments. See the documentation for your operating platform for information regarding this. In setups where multiple hosts are each running a data node and an API node, it is possible to enable shared memory on all such hosts by setting `UseShm` in the `[ndbd default]` section of the configuration file. This is shown in the example later in this section.

While not strictly required, tuning for all SHM connections in the cluster can be done by setting one or more of the following parameters in the `[shm default]` section of the cluster configuration (`config.ini`) file:

* `ShmSize`: Shared memory size

* `ShmSpinTime`: Time in µs to spin before sleeping

* `SendBufferMemory`: Size of buffer for signals sent from this node, in bytes.

* `SendSignalId`: Indicates that a signal ID is included in each signal sent through the transporter.

* `Checksum`: Indicates that a checksum is included in each signal sent through the transporter.

* `PreSendChecksum`: Checks of the checksum are made prior to sending the signal; Checksum must also be enabled for this to work

This example shows a simple setup with SHM connections defined on multiple hosts, in an NDB Cluster using 3 computers listed here by host name, hosting the node types shown:

1. `10.0.0.0`: The management server
2. `10.0.0.1`: A data node and an SQL node
3. `10.0.0.2`: A data node and an SQL node

In this scenario, each data node communicates with both the management server and the other data node using TCP transporters; each SQL node uses a shared memory transporter to communicate with the data nodes that is local to it, and a TCP transporter to communicate with the remote data node. A basic configuration reflecting this setup is enabled by the config.ini file whose contents are shown here:

```
[ndbd default]
DataDir=/path/to/datadir
UseShm=1

[shm default]
ShmSize=8M
ShmSpintime=200
SendBufferMemory=4M

[tcp default]
SendBufferMemory=8M

[ndb_mgmd]
NodeId=49
Hostname=10.0.0.0
DataDir=/path/to/datadir

[ndbd]
NodeId=1
Hostname=10.0.0.1
DataDir=/path/to/datadir

[ndbd]
NodeId=2
Hostname=10.0.0.2
DataDir=/path/to/datadir

[mysqld]
NodeId=51
Hostname=10.0.0.1

[mysqld]
NodeId=52
Hostname=10.0.0.2

[api]
[api]
```

Parameters affecting all shared memory transporters are set in the `[shm default]` section; these can be overridden on a per-connection basis in one or more `[shm]` sections. Each such section must be associated with a given SHM connection using `NodeId1` and `NodeId2`; the values required for these parameters are the node IDs of the two nodes connected by the transporter. You can also identify the nodes by host name using `HostName1` and `HostName2`, but these parameters are not required.

The API nodes for which no host names are set use the TCP transporter to communicate with data nodes independent of the hosts on which they are started; the parameters and values set in the `[tcp default]` section of the configuration file apply to all TCP transporters in the cluster.

For optimum performance, you can define a spin time for the SHM transporter (`ShmSpinTime` parameter); this affects both the data node receiver thread and the poll owner (receive thread or user thread) in `NDB`.

* `Checksum`

  <table summary="Checksum shared memory configuration parameter type and value information" width="35%"><tbody><tr> <th>Version (or later)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Type or units</th> <td>boolean</td> </tr><tr> <th>Default</th> <td>true</td> </tr><tr> <th>Range</th> <td>true, false</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 8.0.13) </p></td> </tr></tbody></table>

  This parameter is a boolean (`Y`/`N`) parameter which is disabled by default. When it is enabled, checksums for all messages are calculated before being placed in the send buffer.

  This feature prevents messages from being corrupted while waiting in the send buffer. It also serves as a check against data being corrupted during transport.

* `Group`

  <table summary="Group shared memory configuration parameter type and value information" width="35%"><tbody><tr> <th>Version (or later)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 8.0.13) </p></td> </tr></tbody></table>

  Determines the group proximity; a smaller value is interpreted as being closer. The default value is sufficient for most conditions.

* `HostName1`

  <table summary="HostName1 shared memory configuration parameter type and value information" width="35%"><tbody><tr> <th>Version (or later)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 8.0.13) </p></td> </tr></tbody></table>

  The `HostName1` and `HostName2` parameters can be used to specify specific network interfaces to be used for a given SHM connection between two nodes. The values used for these parameters can be host names or IP addresses.

* `HostName2`

  <table summary="HostName2 shared memory configuration parameter type and value information" width="35%"><tbody><tr> <th>Version (or later)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 8.0.13) </p></td> </tr></tbody></table>

  The `HostName1` and `HostName2` parameters can be used to specify specific network interfaces to be used for a given SHM connection between two nodes. The values used for these parameters can be host names or IP addresses.

* `NodeId1`

  <table summary="NodeId1 shared memory configuration parameter type and value information" width="35%"><tbody><tr> <th>Version (or later)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Type or units</th> <td>numeric</td> </tr><tr> <th>Default</th> <td>[none]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 8.0.13) </p></td> </tr></tbody></table>

  To identify a connection between two nodes it is necessary to provide node identifiers for each of them, as `NodeId1` and `NodeId2`.

* `NodeId2`

  <table summary="NodeId2 shared memory configuration parameter type and value information" width="35%"><tbody><tr> <th>Version (or later)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Type or units</th> <td>numeric</td> </tr><tr> <th>Default</th> <td>[none]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 8.0.13) </p></td> </tr></tbody></table>

  To identify a connection between two nodes it is necessary to provide node identifiers for each of them, as `NodeId1` and `NodeId2`.

* `NodeIdServer`

  <table summary="NodeIdServer shared memory configuration parameter type and value information" width="35%"><tbody><tr> <th>Version (or later)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Type or units</th> <td>numeric</td> </tr><tr> <th>Default</th> <td>[none]</td> </tr><tr> <th>Range</th> <td>1 - 63</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 8.0.13) </p></td> </tr></tbody></table>

  Identify the server end of a shared memory connection. By default, this is the node ID of the data node.

* `OverloadLimit`

  <table summary="OverloadLimit shared memory configuration parameter type and value information" width="35%"><tbody><tr> <th>Version (or later)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Type or units</th> <td>bytes</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 8.0.13) </p></td> </tr></tbody></table>

  When more than this many unsent bytes are in the send buffer, the connection is considered overloaded. See Section 25.4.3.14, “Configuring NDB Cluster Send Buffer Parameters”, and Section 25.6.16.65, “The ndbinfo transporters Table”, for more information.

* `PreSendChecksum`

  <table summary="PreSendChecksum shared memory configuration parameter type and value information" width="35%"><tbody><tr> <th>Version (or later)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Type or units</th> <td>boolean</td> </tr><tr> <th>Default</th> <td>false</td> </tr><tr> <th>Range</th> <td>true, false</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 8.0.13) </p></td> </tr></tbody></table>

  If this parameter and `Checksum` are both enabled, perform pre-send checksum checks, and check all SHM signals between nodes for errors. Has no effect if `Checksum` is not also enabled.

* `SendBufferMemory`

  <table summary="SendBufferMemory shared memory configuration parameter type and value information" width="35%"><tbody><tr> <th>Version (or later)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2M</td> </tr><tr> <th>Range</th> <td>256K - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 8.0.13) </p></td> </tr></tbody></table>

  Size (in bytes) of the shared memory buffer for signals sent from this node using a shared memory connection.

* `SendSignalId`

  <table summary="Group shared memory configuration parameter type and value information" width="35%"><tbody><tr> <th>Version (or later)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 8.0.13) </p></td> </tr></tbody></table>0

  To retrace the path of a distributed message, it is necessary to provide each message with a unique identifier. Setting this parameter to `Y` causes these message IDs to be transported over the network as well. This feature is disabled by default in production builds, and enabled in `-debug` builds.

* `ShmKey`

  <table summary="Group shared memory configuration parameter type and value information" width="35%"><tbody><tr> <th>Version (or later)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 8.0.13) </p></td> </tr></tbody></table>1

  When setting up shared memory segments, a node ID, expressed as an integer, is used to identify uniquely the shared memory segment to use for the communication. There is no default value. If `UseShm` is enabled, the shared memory key is calculated automatically by `NDB`.

* `ShmSize`

  <table summary="Group shared memory configuration parameter type and value information" width="35%"><tbody><tr> <th>Version (or later)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 8.0.13) </p></td> </tr></tbody></table>2

  Each SHM connection has a shared memory segment where messages between nodes are placed by the sender and read by the reader. The size of this segment is defined by `ShmSize`. The default value is 4MB.

* `ShmSpinTime`

  <table summary="Group shared memory configuration parameter type and value information" width="35%"><tbody><tr> <th>Version (or later)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 8.0.13) </p></td> </tr></tbody></table>3

  When receiving, the time to wait before sleeping, in microseconds.

* `SigNum`

  <table summary="Group shared memory configuration parameter type and value information" width="35%"><tbody><tr> <th>Version (or later)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 8.0.13) </p></td> </tr></tbody></table>4

  This parameter was used formerly to override operating system signal numbers; in NDB 8.0, it is no longer used, and any setting for it is ignored.

**Restart types.** Information about the restart types used by the parameter descriptions in this section is shown in the following table:

**Table 25.22 NDB Cluster restart types**

<table summary="Group shared memory configuration parameter type and value information" width="35%"><tbody><tr> <th>Version (or later)</th> <td>NDB 8.0.13</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 8.0.13) </p></td> </tr></tbody></table>5
