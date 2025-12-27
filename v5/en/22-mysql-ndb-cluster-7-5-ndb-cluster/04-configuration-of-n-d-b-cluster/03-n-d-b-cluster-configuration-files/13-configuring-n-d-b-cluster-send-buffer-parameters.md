#### 21.4.3.13 Configuring NDB Cluster Send Buffer Parameters

The `NDB` kernel employs a unified send buffer whose memory is allocated dynamically from a pool shared by all transporters. This means that the size of the send buffer can be adjusted as necessary. Configuration of the unified send buffer can accomplished by setting the following parameters:

* **TotalSendBufferMemory.** This parameter can be set for all types of NDB Cluster nodes—that is, it can be set in the `[ndbd]`, `[mgm]`, and `[api]` (or `[mysql]`) sections of the `config.ini` file. It represents the total amount of memory (in bytes) to be allocated by each node for which it is set for use among all configured transporters. If set, its minimum is 256KB; the maximum is 4294967039.

  To be backward-compatible with existing configurations, this parameter takes as its default value the sum of the maximum send buffer sizes of all configured transporters, plus an additional 32KB (one page) per transporter. The maximum depends on the type of transporter, as shown in the following table:

  **Table 21.21 Transporter types with maximum send buffer sizes**

  <table><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Transporter</th> <th>Maximum Send Buffer Size (bytes)</th> </tr></thead><tbody><tr> <td>TCP</td> <td><a class="link" href="mysql-cluster-tcp-definition.html#ndbparam-tcp-sendbuffermemory"><code class="literal">SendBufferMemory</code></a> (default = 2M)</td> </tr><tr> <td>SHM</td> <td>20K</td> </tr></tbody></table>

  This enables existing configurations to function in close to the same way as they did with NDB Cluster 6.3 and earlier, with the same amount of memory and send buffer space available to each transporter. However, memory that is unused by one transporter is not available to other transporters.

* **OverloadLimit.** This parameter is used in the `config.ini` file `[tcp]` section, and denotes the amount of unsent data (in bytes) that must be present in the send buffer before the connection is considered overloaded. When such an overload condition occurs, transactions that affect the overloaded connection fail with NDB API Error 1218 (Send Buffers overloaded in NDB kernel) until the overload status passes. The default value is 0, in which case the effective overload limit is calculated as `SendBufferMemory * 0.8` for a given connection. The maximum value for this parameter is 4G.

* **SendBufferMemory.** This value denotes a hard limit for the amount of memory that may be used by a single transporter out of the entire pool specified by [`TotalSendBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-totalsendbuffermemory). However, the sum of `SendBufferMemory` for all configured transporters may be greater than the [`TotalSendBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-totalsendbuffermemory) that is set for a given node. This is a way to save memory when many nodes are in use, as long as the maximum amount of memory is never required by all transporters at the same time.

* **ReservedSendBufferMemory.** Removed prior to NDB 7.5 GA.

  <table frame="box" rules="all" summary="ReservedSendBufferMemory data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>bytes</td> </tr><tr> <th>Default</th> <td>256K</td> </tr><tr> <th>Range</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Removed</th> <td>NDB 7.5.2</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Previously, this data node parameter was present, but not actually used (Bug #77404, Bug #21280428).

You can use the [`ndbinfo.transporters`](mysql-cluster-ndbinfo-transporters.html "21.6.15.44 The ndbinfo transporters Table") table to monitor send buffer memory usage, and to detect slowdown and overload conditions that can adversely affect performance.
