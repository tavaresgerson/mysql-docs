#### 21.4.3.10 NDB Cluster TCP/IP Connections

TCP/IP is the default transport mechanism for all connections between nodes in an NDB Cluster. Normally it is not necessary to define TCP/IP connections; NDB Cluster automatically sets up such connections for all data nodes, management nodes, and SQL or API nodes.

Note

For an exception to this rule, see [Section 21.4.3.11, “NDB Cluster TCP/IP Connections Using Direct Connections”](mysql-cluster-tcp-definition-direct.html "21.4.3.11 NDB Cluster TCP/IP Connections Using Direct Connections").

To override the default connection parameters, it is necessary to define a connection using one or more `[tcp]` sections in the `config.ini` file. Each `[tcp]` section explicitly defines a TCP/IP connection between two NDB Cluster nodes, and must contain at a minimum the parameters [`NodeId1`](mysql-cluster-tcp-definition.html#ndbparam-tcp-nodeid1) and [`NodeId2`](mysql-cluster-tcp-definition.html#ndbparam-tcp-nodeid2), as well as any connection parameters to override.

It is also possible to change the default values for these parameters by setting them in the `[tcp default]` section.

Important

Any `[tcp]` sections in the `config.ini` file should be listed *last*, following all other sections in the file. However, this is not required for a `[tcp default]` section. This requirement is a known issue with the way in which the `config.ini` file is read by the NDB Cluster management server.

Connection parameters which can be set in `[tcp]` and `[tcp default]` sections of the `config.ini` file are listed here:

* `Checksum`

  <table frame="box" rules="all" summary="Checksum TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>boolean</td> </tr><tr> <th>Default</th> <td>false</td> </tr><tr> <th>Range</th> <td>true, false</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter is a boolean parameter (enabled by setting it to `Y` or `1`, disabled by setting it to `N` or `0`). It is disabled by default. When it is enabled, checksums for all messages are calculated before they placed in the send buffer. This feature ensures that messages are not corrupted while waiting in the send buffer, or by the transport mechanism.

* `Group`

  When [`ndb_optimized_node_selection`](mysql-cluster-options-variables.html#sysvar_ndb_optimized_node_selection) is enabled, node proximity is used in some cases to select which node to connect to. This parameter can be used to influence proximity by setting it to a lower value, which is interpreted as “closer”. See the description of the system variable for more information.

* `HostName1`

  <table frame="box" rules="all" summary="HostName1 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The `HostName1` and [`HostName2`](mysql-cluster-tcp-definition.html#ndbparam-tcp-hostname2) parameters can be used to specify specific network interfaces to be used for a given TCP connection between two nodes. The values used for these parameters can be host names or IP addresses.

* `HostName2`

  <table frame="box" rules="all" summary="HostName2 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The [`HostName1`](mysql-cluster-tcp-definition.html#ndbparam-tcp-hostname1) and `HostName2` parameters can be used to specify specific network interfaces to be used for a given TCP connection between two nodes. The values used for these parameters can be host names or IP addresses.

* `NodeId1`

  <table frame="box" rules="all" summary="NodeId1 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>numeric</td> </tr><tr> <th>Default</th> <td>[none]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  To identify a connection between two nodes it is necessary to provide their node IDs in the `[tcp]` section of the configuration file as the values of `NodeId1` and [`NodeId2`](mysql-cluster-tcp-definition.html#ndbparam-tcp-nodeid2). These are the same unique `Id` values for each of these nodes as described in [Section 21.4.3.7, “Defining SQL and Other API Nodes in an NDB Cluster”](mysql-cluster-api-definition.html "21.4.3.7 Defining SQL and Other API Nodes in an NDB Cluster").

* `NodeId2`

  <table frame="box" rules="all" summary="NodeId2 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>numeric</td> </tr><tr> <th>Default</th> <td>[none]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  To identify a connection between two nodes it is necessary to provide their node IDs in the `[tcp]` section of the configuration file as the values of [`NodeId1`](mysql-cluster-tcp-definition.html#ndbparam-tcp-nodeid1) and `NodeId2`. These are the same unique `Id` values for each of these nodes as described in [Section 21.4.3.7, “Defining SQL and Other API Nodes in an NDB Cluster”](mysql-cluster-api-definition.html "21.4.3.7 Defining SQL and Other API Nodes in an NDB Cluster").

* [`NodeIdServer`](mysql-cluster-tcp-definition.html#ndbparam-tcp-nodeidserver)

  <table frame="box" rules="all" summary="NodeIdServer TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>numeric</td> </tr><tr> <th>Default</th> <td>[none]</td> </tr><tr> <th>Range</th> <td>1 - 63</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Set the server side of a TCP connection.

* `OverloadLimit`

  <table frame="box" rules="all" summary="OverloadLimit TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>bytes</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  When more than this many unsent bytes are in the send buffer, the connection is considered overloaded.

  This parameter can be used to determine the amount of unsent data that must be present in the send buffer before the connection is considered overloaded. See [Section 21.4.3.13, “Configuring NDB Cluster Send Buffer Parameters”](mysql-cluster-config-send-buffers.html "21.4.3.13 Configuring NDB Cluster Send Buffer Parameters"), for more information.

* `PortNumber` (*OBSOLETE*)

  This parameter formerly specified the port number to be used for listening for connections from other nodes. It is now deprecated (and removed in NDB Cluster 7.5); use the [`ServerPort`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-serverport) data node configuration parameter for this purpose instead (Bug
  #77405, Bug #21280456).

* [`PreSendChecksum`](mysql-cluster-tcp-definition.html#ndbparam-tcp-presendchecksum)

  <table frame="box" rules="all" summary="PreSendChecksum TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.6</td> </tr><tr> <th>Type or units</th> <td>boolean</td> </tr><tr> <th>Default</th> <td>false</td> </tr><tr> <th>Range</th> <td>true, false</td> </tr><tr> <th>Added</th> <td>NDB 7.6.6</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  If this parameter and [`Checksum`](mysql-cluster-tcp-definition.html#ndbparam-tcp-checksum) are both enabled, perform pre-send checksum checks, and check all TCP signals between nodes for errors. Has no effect if `Checksum` is not also enabled.

* [`Proxy`](mysql-cluster-tcp-definition.html#ndbparam-tcp-proxy)

  <table frame="box" rules="all" summary="Proxy TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Set a proxy for the TCP connection.

* [`ReceiveBufferMemory`](mysql-cluster-tcp-definition.html#ndbparam-tcp-receivebuffermemory)

  <table frame="box" rules="all" summary="ReceiveBufferMemory TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>bytes</td> </tr><tr> <th>Default</th> <td>2M</td> </tr><tr> <th>Range</th> <td>16K - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Specifies the size of the buffer used when receiving data from the TCP/IP socket.

  The default value of this parameter is 2MB. The minimum possible value is 16KB; the theoretical maximum is 4GB.

* [`SendBufferMemory`](mysql-cluster-tcp-definition.html#ndbparam-tcp-sendbuffermemory)

  <table frame="box" rules="all" summary="HostName1 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>0

  TCP transporters use a buffer to store all messages before performing the send call to the operating system. When this buffer reaches 64KB its contents are sent; these are also sent when a round of messages have been executed. To handle temporary overload situations it is also possible to define a bigger send buffer.

  If this parameter is set explicitly, then the memory is not dedicated to each transporter; instead, the value used denotes the hard limit for how much memory (out of the total available memory—that is, `TotalSendBufferMemory`) that may be used by a single transporter. For more information about configuring dynamic transporter send buffer memory allocation in NDB Cluster, see [Section 21.4.3.13, “Configuring NDB Cluster Send Buffer Parameters”](mysql-cluster-config-send-buffers.html "21.4.3.13 Configuring NDB Cluster Send Buffer Parameters").

  The default size of the send buffer is 2MB, which is the size recommended in most situations. The minimum size is 64 KB; the theoretical maximum is 4 GB.

* `SendSignalId`

  <table frame="box" rules="all" summary="HostName1 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>1

  To be able to retrace a distributed message datagram, it is necessary to identify each message. When this parameter is set to `Y`, message IDs are transported over the network. This feature is disabled by default in production builds, and enabled in `-debug` builds.

* `TcpBind_INADDR_ANY`

  Setting this parameter to `TRUE` or `1` binds `IP_ADDR_ANY` so that connections can be made from anywhere (for autogenerated connections). The default is `FALSE` (`0`).

* [`TCP_MAXSEG_SIZE`](mysql-cluster-tcp-definition.html#ndbparam-tcp-tcp_maxseg_size)

  <table frame="box" rules="all" summary="HostName1 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>2

  Determines the size of the memory set during TCP transporter initialization. The default is recommended for most common usage cases.

* [`TCP_RCV_BUF_SIZE`](mysql-cluster-tcp-definition.html#ndbparam-tcp-tcp_rcv_buf_size)

  <table frame="box" rules="all" summary="HostName1 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>3

  Determines the size of the receive buffer set during TCP transporter initialization. The default and minimum value is 0, which allows the operating system or platform to set this value. The default is recommended for most common usage cases.

* [`TCP_SND_BUF_SIZE`](mysql-cluster-tcp-definition.html#ndbparam-tcp-tcp_snd_buf_size)

  <table frame="box" rules="all" summary="HostName1 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>4

  Determines the size of the send buffer set during TCP transporter initialization. The default and minimum value is 0, which allows the operating system or platform to set this value. The default is recommended for most common usage cases.

**Restart types.** Information about the restart types used by the parameter descriptions in this section is shown in the following table:

**Table 21.19 NDB Cluster restart types**

<table frame="box" rules="all" summary="HostName1 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>5
