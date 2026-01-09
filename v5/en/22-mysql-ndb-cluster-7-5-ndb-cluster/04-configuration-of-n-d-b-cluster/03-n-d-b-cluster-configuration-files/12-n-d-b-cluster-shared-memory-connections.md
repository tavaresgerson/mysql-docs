#### 21.4.3.12 NDB Cluster Shared Memory Connections

Communications between NDB cluster nodes are normally handled using TCP/IP. The shared memory (SHM) transporter is distinguished by the fact that signals are transmitted by writing in memory rather than on a socket. The shared-memory transporter (SHM) can improve performance by negating up to 20% of the overhead required by a TCP connection when running an API node (usually an SQL node) and a data node together on the same host. You can enable a shared memory connection in either of the two ways listed here:

* By setting the [`UseShm`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-useshm) data node configuration parameter to `1`, and setting [`HostName`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-hostname) for the data node and [`HostName`](mysql-cluster-api-definition.html#ndbparam-api-hostname) for the API node to the same value.

* By using `[shm]` sections in the cluster configuration file, each containing settings for [`NodeId1`](mysql-cluster-shm-definition.html#ndbparam-shm-nodeid1) and [`NodeId2`](mysql-cluster-shm-definition.html#ndbparam-shm-nodeid2). This method is described in more detail later in this section.

Suppose a cluster is running a data node which has node ID 1 and an SQL node having node ID 51 on the same host computer at 10.0.0.1. To enable an SHM connection between these two nodes, all that is necessary is to insure that the following entries are included in the cluster configuration file:

```sql
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

* [`ShmSize`](mysql-cluster-shm-definition.html#ndbparam-shm-shmsize): Shared memory size

* [`ShmSpinTime`](mysql-cluster-shm-definition.html#ndbparam-shm-shmspintime): Time in µs to spin before sleeping

* [`SendBufferMemory`](mysql-cluster-shm-definition.html#ndbparam-shm-sendbuffermemory): Size of buffer for signals sent from this node, in bytes.

* [`SendSignalId`](mysql-cluster-shm-definition.html#ndbparam-shm-sendsignalid): Indicates that a signal ID is included in each signal sent through the transporter.

* [`Checksum`](mysql-cluster-shm-definition.html#ndbparam-shm-checksum): Indicates that a checksum is included in each signal sent through the transporter.

* [`PreSendChecksum`](mysql-cluster-shm-definition.html#ndbparam-shm-presendchecksum): Checks of the checksum are made prior to sending the signal; Checksum must also be enabled for this to work

This example shows a simple setup with SHM connections definied on multiple hosts, in an NDB Cluster using 3 computers listed here by host name, hosting the node types shown:

1. `10.0.0.0`: The management server
2. `10.0.0.1`: A data node and an SQL node
3. `10.0.0.2`: A data node and an SQL node

In this scenario, each data node communicates with both the management server and the other data node using TCP transporters; each SQL node uses a shared memory transporter to communicate with the data nodes that is local to it, and a TCP transporter to communicate with the remote data node. A basic configuration reflecting this setup is enabled by the config.ini file whose contents are shown here:

```sql
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

Parameters affecting all shared memory transporters are set in the `[shm default]` section; these can be overridden on a per-connection basis in one or more `[shm]` sections. Each such section must be associated with a given SHM connection using [`NodeId1`](mysql-cluster-shm-definition.html#ndbparam-shm-nodeid1) and [`NodeId2`](mysql-cluster-shm-definition.html#ndbparam-shm-nodeid2); the values required for these parameters are the node IDs of the two nodes connected by the transporter. You can also identify the nodes by host name using [`HostName1`](mysql-cluster-shm-definition.html#ndbparam-shm-hostname1) and [`HostName2`](mysql-cluster-shm-definition.html#ndbparam-shm-hostname2), but these parameters are not required.

The API nodes for which no host names are set use the TCP transporter to communicate with data nodes independent of the hosts on which they are started; the parameters and values set in the `[tcp default]` section of the configuration file apply to all TCP transporters in the cluster.

For optimum performance, you can define a spin time for the SHM transporter ([`ShmSpinTime`](mysql-cluster-shm-definition.html#ndbparam-shm-shmspintime) parameter); this affects both the data node receiver thread and the poll owner (receive thread or user thread) in `NDB`.

* `Checksum`

  <table frame="box" rules="all" summary="Checksum shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>boolean</td> </tr><tr> <th>Default</th> <td>true</td> </tr><tr> <th>Range</th> <td>true, false</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter is a boolean (`Y`/`N`) parameter which is disabled by default. When it is enabled, checksums for all messages are calculated before being placed in the send buffer.

  This feature prevents messages from being corrupted while waiting in the send buffer. It also serves as a check against data being corrupted during transport.

* `Group`

  <table frame="box" rules="all" summary="Group shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Determines the group proximity; a smaller value is interpreted as being closer. The default value is sufficient for most conditions.

* `HostName1`

  <table frame="box" rules="all" summary="HostName1 shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The `HostName1` and [`HostName2`](mysql-cluster-shm-definition.html#ndbparam-shm-hostname2) parameters can be used to specify specific network interfaces to be used for a given SHM connection between two nodes. The values used for these parameters can be host names or IP addresses.

* `HostName2`

  <table frame="box" rules="all" summary="HostName2 shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The [`HostName1`](mysql-cluster-shm-definition.html#ndbparam-shm-hostname1) and `HostName2` parameters can be used to specify specific network interfaces to be used for a given SHM connection between two nodes. The values used for these parameters can be host names or IP addresses.

* `NodeId1`

  <table frame="box" rules="all" summary="NodeId1 shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>numeric</td> </tr><tr> <th>Default</th> <td>[none]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  To identify a connection between two nodes it is necessary to provide node identifiers for each of them, as `NodeId1` and [`NodeId2`](mysql-cluster-shm-definition.html#ndbparam-shm-nodeid2).

* `NodeId2`

  <table frame="box" rules="all" summary="NodeId2 shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>numeric</td> </tr><tr> <th>Default</th> <td>[none]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  To identify a connection between two nodes it is necessary to provide node identifiers for each of them, as [`NodeId1`](mysql-cluster-shm-definition.html#ndbparam-shm-nodeid1) and `NodeId2`.

* `NodeIdServer`

  <table frame="box" rules="all" summary="NodeIdServer shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>numeric</td> </tr><tr> <th>Default</th> <td>[none]</td> </tr><tr> <th>Range</th> <td>1 - 63</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Identify the server end of a shared memory connection. By default, this is the node ID of the data node.

* `OverloadLimit`

  <table frame="box" rules="all" summary="OverloadLimit shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>bytes</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  When more than this many unsent bytes are in the send buffer, the connection is considered overloaded.

  This parameter can be used to determine the amount of unsent data that must be present in the send buffer before the connection is considered overloaded. See [Section 21.4.3.13, “Configuring NDB Cluster Send Buffer Parameters”](mysql-cluster-config-send-buffers.html "21.4.3.13 Configuring NDB Cluster Send Buffer Parameters"), and [Section 21.6.15.44, “The ndbinfo transporters Table”](mysql-cluster-ndbinfo-transporters.html "21.6.15.44 The ndbinfo transporters Table"), for more information.

* [`PortNumber`](mysql-cluster-shm-definition.html#ndbparam-shm-portnumber)

  <table frame="box" rules="all" summary="PortNumber shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 64K</td> </tr><tr> <th>Removed</th> <td>NDB 7.5.1</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Set the port to be used by the SHM transporter.

* [`PreSendChecksum`](mysql-cluster-shm-definition.html#ndbparam-shm-presendchecksum)

  <table frame="box" rules="all" summary="PreSendChecksum shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.6</td> </tr><tr> <th>Type or units</th> <td>boolean</td> </tr><tr> <th>Default</th> <td>false</td> </tr><tr> <th>Range</th> <td>true, false</td> </tr><tr> <th>Added</th> <td>NDB 7.6.6</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  If this parameter and [`Checksum`](mysql-cluster-shm-definition.html#ndbparam-shm-checksum) are both enabled, perform pre-send checksum checks, and check all SHM signals between nodes for errors. Has no effect if `Checksum` is not also enabled.

* [`SendBufferMemory`](mysql-cluster-shm-definition.html#ndbparam-shm-sendbuffermemory)

  <table frame="box" rules="all" summary="Group shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Size (in bytes) of the shared memory buffer for signals sent from this node using a shared memory connection.

* `SendSignalId`

  <table frame="box" rules="all" summary="Group shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  To retrace the path of a distributed message, it is necessary to provide each message with a unique identifier. Setting this parameter to `Y` causes these message IDs to be transported over the network as well. This feature is disabled by default in production builds, and enabled in `-debug` builds.

* [`ShmKey`](mysql-cluster-shm-definition.html#ndbparam-shm-shmkey)

  <table frame="box" rules="all" summary="Group shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  When setting up shared memory segments, a node ID, expressed as an integer, is used to identify uniquely the shared memory segment to use for the communication. There is no default value. If [`UseShm`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-useshm) is enabled, the shared memory key is calculated automatically by `NDB`.

* [`ShmSize`](mysql-cluster-shm-definition.html#ndbparam-shm-shmsize)

  <table frame="box" rules="all" summary="Group shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Each SHM connection has a shared memory segment where messages between nodes are placed by the sender and read by the reader. The size of this segment is defined by [`ShmSize`](mysql-cluster-shm-definition.html#ndbparam-shm-shmsize). The default value in NDB 7.6 is 4MB.

* [`ShmSpinTime`](mysql-cluster-shm-definition.html#ndbparam-shm-shmspintime)

  <table frame="box" rules="all" summary="Group shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  When receiving, the time to wait before sleeping, in microseconds.

* [`SigNum`](mysql-cluster-shm-definition.html#ndbparam-shm-signum)

  <table frame="box" rules="all" summary="Group shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter is no longer used in NDB 7.6, in which any setting for it is ignored.

  The following applies only in NDB 7.5 (and earlier):

  When using the shared memory transporter, a process sends an operating system signal to the other process when there is new data available in the shared memory. Should that signal conflict with an existing signal, this parameter can be used to change it. This is a possibility when using SHM due to the fact that different operating systems use different signal numbers.

  The default value of [`SigNum`](mysql-cluster-shm-definition.html#ndbparam-shm-signum) is 0; therefore, it must be set to avoid errors in the cluster log when using the shared memory transporter. Typically, this parameter is set to 10 in the `[shm default]` section of the `config.ini` file.

**Restart types.** Information about the restart types used by the parameter descriptions in this section is shown in the following table:

**Table 21.20 NDB Cluster restart types**

<table frame="box" rules="all" summary="Group shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>
