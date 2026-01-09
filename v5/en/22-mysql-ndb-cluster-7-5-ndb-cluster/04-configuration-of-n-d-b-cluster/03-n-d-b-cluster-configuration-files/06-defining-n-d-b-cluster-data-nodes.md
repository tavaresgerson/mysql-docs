#### 21.4.3.6 Defining NDB Cluster Data Nodes

The `[ndbd]` and `[ndbd default]` sections are used to configure the behavior of the cluster's data nodes.

`[ndbd]` and `[ndbd default]` are always used as the section names whether you are using [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") or [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") binaries for the data node processes.

There are many parameters which control buffer sizes, pool sizes, timeouts, and so forth. The only mandatory parameter is `HostName`; this must be defined in the local `[ndbd]` section.

The parameter [`NoOfReplicas`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-noofreplicas) should be defined in the `[ndbd default]` section, as it is common to all Cluster data nodes. It is not strictly necessary to set [`NoOfReplicas`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-noofreplicas), but it is good practice to set it explicitly.

Most data node parameters are set in the `[ndbd default]` section. Only those parameters explicitly stated as being able to set local values are permitted to be changed in the `[ndbd]` section. Where present, `HostName` and `NodeId` *must* be defined in the local `[ndbd]` section, and not in any other section of `config.ini`. In other words, settings for these parameters are specific to one data node.

For those parameters affecting memory usage or buffer sizes, it is possible to use `K`, `M`, or `G` as a suffix to indicate units of 1024, 1024×1024, or 1024×1024×1024. (For example, `100K` means 100 × 1024 = 102400.)

Parameter names and values are case-insensitive, unless used in a MySQL Server `my.cnf` or `my.ini` file, in which case they are case-sensitive.

Information about configuration parameters specific to NDB Cluster Disk Data tables can be found later in this section (see [Disk Data Configuration Parameters](mysql-cluster-ndbd-definition.html#mysql-cluster-ndbd-definition-disk-data-parameters "Disk Data Configuration Parameters")).

All of these parameters also apply to [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") (the multithreaded version of [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon")). Three additional data node configuration parameters—[`MaxNoOfExecutionThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-maxnoofexecutionthreads), [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig), and [`NoOfFragmentLogParts`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-nooffragmentlogparts)—apply to [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") only; these have no effect when used with [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon"). For more information, see [Multi-Threading Configuration Parameters (ndbmtd)](mysql-cluster-ndbd-definition.html#mysql-cluster-ndbd-definition-ndbmtd-parameters "Multi-Threading Configuration Parameters (ndbmtd)"). See also [Section 21.5.3, “ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)”](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)").

**Identifying data nodes.** The `NodeId` or `Id` value (that is, the data node identifier) can be allocated on the command line when the node is started or in the configuration file.

* `NodeId`

  <table frame="box" rules="all" summary="NodeId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 48</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  A unique node ID is used as the node's address for all cluster internal messages. For data nodes, this is an integer in the range 1 to 48 inclusive. Each node in the cluster must have a unique identifier.

  `NodeId` is the only supported parameter name to use when identifying data nodes. (`Id` was removed in NDB 7.5.0.)

* `ExecuteOnComputer`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This refers to the `Id` set for one of the computers defined in a `[computer]` section.

  Important

  This parameter is deprecated as of NDB 7.5.0, and is subject to removal in a future release. Use the [`HostName`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-hostname) parameter instead.

* `HostName`

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Specifying this parameter defines the hostname of the computer on which the data node is to reside. Use `HostName` to specify a host name other than `localhost`.

* [`ServerPort`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-serverport)

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Each node in the cluster uses a port to connect to other nodes. By default, this port is allocated dynamically in such a way as to ensure that no two nodes on the same host computer receive the same port number, so it should normally not be necessary to specify a value for this parameter.

  However, if you need to be able to open specific ports in a firewall to permit communication between data nodes and API nodes (including SQL nodes), you can set this parameter to the number of the desired port in an `[ndbd]` section or (if you need to do this for multiple data nodes) the `[ndbd default]` section of the `config.ini` file, and then open the port having that number for incoming connections from SQL nodes, API nodes, or both.

  Note

  Connections from data nodes to management nodes is done using the [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") management port (the management server's [`PortNumber`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-portnumber)) so outgoing connections to that port from any data nodes should always be permitted.

* `TcpBind_INADDR_ANY`

  Setting this parameter to `TRUE` or `1` binds `IP_ADDR_ANY` so that connections can be made from anywhere (for autogenerated connections). The default is `FALSE` (`0`).

* [`NodeGroup`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nodegroup)

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter can be used to assign a data node to a specific node group. It is read only when the cluster is started for the first time, and cannot be used to reassign a data node to a different node group online. It is generally not desirable to use this parameter in the `[ndbd default]` section of the `config.ini` file, and care must be taken not to assign nodes to node groups in such a way that an invalid numbers of nodes are assigned to any node groups.

  The [`NodeGroup`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nodegroup) parameter is chiefly intended for use in adding a new node group to a running NDB Cluster without having to perform a rolling restart. For this purpose, you should set it to 65536 (the maximum value). You are not required to set a [`NodeGroup`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nodegroup) value for all cluster data nodes, only for those nodes which are to be started and added to the cluster as a new node group at a later time. For more information, see [Section 21.6.7.3, “Adding NDB Cluster Data Nodes Online: Detailed Example”](mysql-cluster-online-add-node-example.html "21.6.7.3 Adding NDB Cluster Data Nodes Online: Detailed Example").

* [`LocationDomainId`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-locationdomainid)

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Assigns a data node to a specific [availability domain](https://docs.us-phoenix-1.oraclecloud.com/Content/General/Concepts/regions.htm) (also known as an availability zone) within a cloud. By informing `NDB` which nodes are in which availability domains, performance can be improved in a cloud environment in the following ways:

  + If requested data is not found on the same node, reads can be directed to another node in the same availability domain.

  + Communication between nodes in different availability domains are guaranteed to use `NDB` transporters' WAN support without any further manual intervention.

  + The transporter's group number can be based on which availability domain is used, such that also SQL and other API nodes communicate with local data nodes in the same availability domain whenever possible.

  + The arbitrator can be selected from an availability domain in which no data nodes are present, or, if no such availability domain can be found, from a third availability domain.

  `LocationDomainId` takes an integer value between 0 and 16 inclusive, with 0 being the default; using 0 is the same as leaving the parameter unset.

* [`NoOfReplicas`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-noofreplicas)

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This global parameter can be set only in the `[ndbd default]` section, and defines the number of fragment replicas for each table stored in the cluster. This parameter also specifies the size of node groups. A node group is a set of nodes all storing the same information.

  Node groups are formed implicitly. The first node group is formed by the set of data nodes with the lowest node IDs, the next node group by the set of the next lowest node identities, and so on. By way of example, assume that we have 4 data nodes and that `NoOfReplicas` is set to 2. The four data nodes have node IDs 2, 3, 4 and

  5. Then the first node group is formed from nodes 2 and 3, and the second node group by nodes 4 and 5. It is important to configure the cluster in such a manner that nodes in the same node groups are not placed on the same computer because a single hardware failure would cause the entire cluster to fail.

  If no node IDs are provided, the order of the data nodes is the determining factor for the node group. Whether or not explicit assignments are made, they can be viewed in the output of the management client's [`SHOW`](mysql-cluster-mgm-client-commands.html#ndbclient-show) command.

  The default and recommended maximum value for `NoOfReplicas` is 2. *This is the recommended value for most production environments*.

  Important

  While it is theoretically possible for the value of this parameter to be 3 or 4, **NDB Cluster 7.5 and NDB Cluster 7.6 do not support setting `NoOfReplicas` to a value greater than 2 in production**.

  Warning

  Setting `NoOfReplicas` to 1 means that there is only a single copy of all Cluster data; in this case, the loss of a single data node causes the cluster to fail because there are no additional copies of the data stored by that node.

  The number of data nodes in the cluster must be evenly divisible by the value of this parameter. For example, if there are two data nodes, then [`NoOfReplicas`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-noofreplicas) must be equal to either 1 or 2, since 2/3 and 2/4 both yield fractional values; if there are four data nodes, then `NoOfReplicas` must be equal to 1, 2, or 4.

* `DataDir`

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter specifies the directory where trace files, log files, pid files and error logs are placed.

  The default is the data node process working directory.

* [`FileSystemPath`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempath)

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter specifies the directory where all files created for metadata, REDO logs, UNDO logs (for Disk Data tables), and data files are placed. The default is the directory specified by `DataDir`.

  Note

  This directory must exist before the [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") process is initiated.

  The recommended directory hierarchy for NDB Cluster includes `/var/lib/mysql-cluster`, under which a directory for the node's file system is created. The name of this subdirectory contains the node ID. For example, if the node ID is 2, this subdirectory is named `ndb_2_fs`.

* [`BackupDataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupdatadir)

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter specifies the directory in which backups are placed.

  Important

  The string '`/BACKUP`' is always appended to this value. For example, if you set the value of [`BackupDataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupdatadir) to `/var/lib/cluster-data`, then all backups are stored under `/var/lib/cluster-data/BACKUP`. This also means that the *effective* default backup location is the directory named `BACKUP` under the location specified by the [`FileSystemPath`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempath) parameter.

##### Data Memory, Index Memory, and String Memory

[`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) and [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory) are `[ndbd]` parameters specifying the size of memory segments used to store the actual records and their indexes. In setting values for these, it is important to understand how [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) and [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory) are used, as they usually need to be updated to reflect actual usage by the cluster.

Note

`IndexMemory` is deprecated in NDB 7.6, and subject to removal in a future version of NDB Cluster. See the descriptions that follow for further information.

* [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter defines the amount of space (in bytes) available for storing database records. The entire amount specified by this value is allocated in memory, so it is extremely important that the machine has sufficient physical memory to accommodate it.

  The memory allocated by [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) is used to store both the actual records and indexes. There is a 16-byte overhead on each record; an additional amount for each record is incurred because it is stored in a 32KB page with 128 byte page overhead (see below). There is also a small amount wasted per page due to the fact that each record is stored in only one page.

  For variable-size table attributes, the data is stored on separate data pages, allocated from [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory). Variable-length records use a fixed-size part with an extra overhead of 4 bytes to reference the variable-size part. The variable-size part has 2 bytes overhead plus 2 bytes per attribute.

  The maximum record size is 14000 bytes.

  In NDB 7.5 (and earlier), the memory space defined by [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) is also used to store ordered indexes, which use about 10 bytes per record. Each table row is represented in the ordered index. A common error among users is to assume that all indexes are stored in the memory allocated by [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory), but this is not the case: Only primary key and unique hash indexes use this memory; ordered indexes use the memory allocated by [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory). However, creating a primary key or unique hash index also creates an ordered index on the same keys, unless you specify `USING HASH` in the index creation statement. This can be verified by running [**ndb_desc -d *`db_name`* *`table_name`***](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables").

  In NDB 7.6, resources assigned to `DataMemory` are used for storing *all* data and indexes; any memory configured as `IndexMemory` is automatically added to that used by `DataMemory` to form a common resource pool.

  The memory space allocated by [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) consists of 32KB pages, which are allocated to table fragments. Each table is normally partitioned into the same number of fragments as there are data nodes in the cluster. Thus, for each node, there are the same number of fragments as are set in [`NoOfReplicas`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-noofreplicas).

  Once a page has been allocated, it is currently not possible to return it to the pool of free pages, except by deleting the table. (This also means that [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) pages, once allocated to a given table, cannot be used by other tables.) Performing a data node recovery also compresses the partition because all records are inserted into empty partitions from other live nodes.

  The [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) memory space also contains UNDO information: For each update, a copy of the unaltered record is allocated in the [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory). There is also a reference to each copy in the ordered table indexes. Unique hash indexes are updated only when the unique index columns are updated, in which case a new entry in the index table is inserted and the old entry is deleted upon commit. For this reason, it is also necessary to allocate enough memory to handle the largest transactions performed by applications using the cluster. In any case, performing a few large transactions holds no advantage over using many smaller ones, for the following reasons:

  + Large transactions are not any faster than smaller ones
  + Large transactions increase the number of operations that are lost and must be repeated in event of transaction failure

  + Large transactions use more memory

  In NDB 7.5 (and earlier), the default value for [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) is 80MB; in NDB 7.6, this is 98MB. The minimum value is 1MB. There is no maximum size, but in reality the maximum size has to be adapted so that the process does not start swapping when the limit is reached. This limit is determined by the amount of physical RAM available on the machine and by the amount of memory that the operating system may commit to any one process. 32-bit operating systems are generally limited to 2−4GB per process; 64-bit operating systems can use more. For large databases, it may be preferable to use a 64-bit operating system for this reason.

* [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  In NDB 7.5 and earlier, this parameter controls the amount of storage used for hash indexes in NDB Cluster. Hash indexes are always used for primary key indexes, unique indexes, and unique constraints. When defining a primary key or a unique index, two indexes are created, one of which is a hash index used for all tuple accesses as well as lock handling. This index is also used to enforce unique constraints.

  In NDB 7.6.2, the `IndexMemory` parameter is deprecated (and subject to future removal); any any memory assigned to `IndexMemory` is allocated instead to the same pool as [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory), which becomes solely responsible for all resources needed for storing data and indexes in memory. In NDB 7.6, the use of `IndexMemory` in the cluster configuration file triggers a warning from the management server.

  You can estimate the size of a hash index using this formula:

  ```sql
    size  = ( (fragments * 32K) + (rows * 18) )
            * fragment_replicas
  ```

  *`fragments`* is the number of fragments, *`fragment_replicas`* is the number of fragment replicas (normally two), and *`rows`* is the number of rows. If a table has one million rows, eight fragments, and two fragment replicas, the expected index memory usage is calculated as shown here:

  ```sql
    ((8 * 32K) + (1000000 * 18)) * 2 = ((8 * 32768) + (1000000 * 18)) * 2
    = (262144 + 18000000) * 2
    = 18262144 * 2 = 36524288 bytes = ~35MB
  ```

  Index statistics for ordered indexes (when these are enabled) are stored in the `mysql.ndb_index_stat_sample` table. Since this table has a hash index, this adds to index memory usage. An upper bound to the number of rows for a given ordered index can be calculated as follows:

  ```sql
    sample_size= key_size + ((key_attributes + 1) * 4)

    sample_rows = IndexStatSaveSize
                  * ((0.01 * IndexStatSaveScale * log2(rows * sample_size)) + 1)
                  / sample_size
  ```

  In the preceding formula, *`key_size`* is the size of the ordered index key in bytes, *`key_attributes`* is the number ot attributes in the ordered index key, and *`rows`* is the number of rows in the base table.

  Assume that table `t1` has 1 million rows and an ordered index named `ix1` on two four-byte integers. Assume in addition that [`IndexStatSaveSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexstatsavesize) and [`IndexStatSaveScale`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexstatsavescale) are set to their default values (32K and 100, respectively). Using the previous 2 formulas, we can calculate as follows:

  ```sql
    sample_size = 8  + ((1 + 2) * 4) = 20 bytes

    sample_rows = 32K
                  * ((0.01 * 100 * log2(1000000*20)) + 1)
                  / 20
                  = 32768 * ( (1 * ~16.811) +1) / 20
                  = 32768 * ~17.811 / 20
                  = ~29182 rows
  ```

  The expected index memory usage is thus 2 \* 18 \* 29182 = ~1050550 bytes.

  Prior to NDB 7.6, the default value for [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory) is 18MB and the minimum is 1 MB; in NDB 7.6, the minimum and default vaue for this parameter is 0 (zero). This has implications for downgrades from NDB 7.6 to earlier versions of NDB Cluster; see [Section 21.3.7, “Upgrading and Downgrading NDB Cluster”](mysql-cluster-upgrade-downgrade.html "21.3.7 Upgrading and Downgrading NDB Cluster"), for more information.

* [`StringMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-stringmemory)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter determines how much memory is allocated for strings such as table names, and is specified in an `[ndbd]` or `[ndbd default]` section of the `config.ini` file. A value between `0` and `100` inclusive is interpreted as a percent of the maximum default value, which is calculated based on a number of factors including the number of tables, maximum table name size, maximum size of `.FRM` files, [`MaxNoOfTriggers`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooftriggers), maximum column name size, and maximum default column value.

  A value greater than `100` is interpreted as a number of bytes.

  The default value is 25—that is, 25 percent of the default maximum.

  Under most circumstances, the default value should be sufficient, but when you have a great many `NDB` tables (1000 or more), it is possible to get Error 773 Out of string memory, please modify StringMemory config parameter: Permanent error: Schema error, in which case you should increase this value. `25` (25 percent) is not excessive, and should prevent this error from recurring in all but the most extreme conditions.

The following example illustrates how memory is used for a table. Consider this table definition:

```sql
CREATE TABLE example (
  a INT NOT NULL,
  b INT NOT NULL,
  c INT NOT NULL,
  PRIMARY KEY(a),
  UNIQUE(b)
) ENGINE=NDBCLUSTER;
```

For each record, there are 12 bytes of data plus 12 bytes overhead. Having no nullable columns saves 4 bytes of overhead. In addition, we have two ordered indexes on columns `a` and `b` consuming roughly 10 bytes each per record. There is a primary key hash index on the base table using roughly 29 bytes per record. The unique constraint is implemented by a separate table with `b` as primary key and `a` as a column. This other table consumes an additional 29 bytes of index memory per record in the `example` table as well 8 bytes of record data plus 12 bytes of overhead.

Thus, for one million records, we need 58MB for index memory to handle the hash indexes for the primary key and the unique constraint. We also need 64MB for the records of the base table and the unique index table, plus the two ordered index tables.

You can see that hash indexes takes up a fair amount of memory space; however, they provide very fast access to the data in return. They are also used in NDB Cluster to handle uniqueness constraints.

Currently, the only partitioning algorithm is hashing and ordered indexes are local to each node. Thus, ordered indexes cannot be used to handle uniqueness constraints in the general case.

An important point for both [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory) and [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) is that the total database size is the sum of all data memory and all index memory for each node group. Each node group is used to store replicated information, so if there are four nodes with two fragment replicas, there are two node groups. Thus, the total data memory available is 2 × [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) for each data node.

It is highly recommended that [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) and [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory) be set to the same values for all nodes. Data distribution is even over all nodes in the cluster, so the maximum amount of space available for any node can be no greater than that of the smallest node in the cluster.

[`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) (and in NDB 7.5 and earlier [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory)) can be changed, but decreasing it can be risky; doing so can easily lead to a node or even an entire NDB Cluster that is unable to restart due to there being insufficient memory space. Increases should be acceptable, but it is recommended that such upgrades are performed in the same manner as a software upgrade, beginning with an update of the configuration file, and then restarting the management server followed by restarting each data node in turn.

**MinFreePct.**

A proportion (5% by default) of data node resources including [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) (and in NDB 7.5 and earlier, [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory)) is kept in reserve to insure that the data node does not exhaust its memory when performing a restart. This can be adjusted using the [`MinFreePct`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-minfreepct "MinFreePct") data node configuration parameter (default 5).

<table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

Updates do not increase the amount of index memory used. Inserts take effect immediately; however, rows are not actually deleted until the transaction is committed.

**Transaction parameters.** The next few `[ndbd]` parameters that we discuss are important because they affect the number of parallel transactions and the sizes of transactions that can be handled by the system. [`MaxNoOfConcurrentTransactions`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrenttransactions) sets the number of parallel transactions possible in a node. [`MaxNoOfConcurrentOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentoperations) sets the number of records that can be in update phase or locked simultaneously.

Both of these parameters (especially [`MaxNoOfConcurrentOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentoperations)) are likely targets for users setting specific values and not using the default value. The default value is set for systems using small transactions, to ensure that these do not use excessive memory.

[`MaxDMLOperationsPerTransaction`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdmloperationspertransaction) sets the maximum number of DML operations that can be performed in a given transaction.

* [`MaxNoOfConcurrentTransactions`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrenttransactions)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Each cluster data node requires a transaction record for each active transaction in the cluster. The task of coordinating transactions is distributed among all of the data nodes. The total number of transaction records in the cluster is the number of transactions in any given node times the number of nodes in the cluster.

  Transaction records are allocated to individual MySQL servers. Each connection to a MySQL server requires at least one transaction record, plus an additional transaction object per table accessed by that connection. This means that a reasonable minimum for the total number of transactions in the cluster can be expressed as

  ```sql
  TotalNoOfConcurrentTransactions =
      (maximum number of tables accessed in any single transaction + 1)
      * number of SQL nodes
  ```

  Suppose that there are 10 SQL nodes using the cluster. A single join involving 10 tables requires 11 transaction records; if there are 10 such joins in a transaction, then 10 \* 11 = 110 transaction records are required for this transaction, per MySQL server, or 110 \* 10 = 1100 transaction records total. Each data node can be expected to handle TotalNoOfConcurrentTransactions / number of data nodes. For an NDB Cluster having 4 data nodes, this would mean setting `MaxNoOfConcurrentTransactions` on each data node to 1100 / 4 = 275. In addition, you should provide for failure recovery by ensuring that a single node group can accommodate all concurrent transactions; in other words, that each data node's MaxNoOfConcurrentTransactions is sufficient to cover a number of transactions equal to TotalNoOfConcurrentTransactions / number of node groups. If this cluster has a single node group, then `MaxNoOfConcurrentTransactions` should be set to 1100 (the same as the total number of concurrent transactions for the entire cluster).

  In addition, each transaction involves at least one operation; for this reason, the value set for `MaxNoOfConcurrentTransactions` should always be no more than the value of [`MaxNoOfConcurrentOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentoperations).

  This parameter must be set to the same value for all cluster data nodes. This is due to the fact that, when a data node fails, the oldest surviving node re-creates the transaction state of all transactions that were ongoing in the failed node.

  It is possible to change this value using a rolling restart, but the amount of traffic on the cluster must be such that no more transactions occur than the lower of the old and new levels while this is taking place.

  The default value is 4096.

* [`MaxNoOfConcurrentOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentoperations)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  It is a good idea to adjust the value of this parameter according to the size and number of transactions. When performing transactions which involve only a few operations and records, the default value for this parameter is usually sufficient. Performing large transactions involving many records usually requires that you increase its value.

  Records are kept for each transaction updating cluster data, both in the transaction coordinator and in the nodes where the actual updates are performed. These records contain state information needed to find UNDO records for rollback, lock queues, and other purposes.

  This parameter should be set at a minimum to the number of records to be updated simultaneously in transactions, divided by the number of cluster data nodes. For example, in a cluster which has four data nodes and which is expected to handle one million concurrent updates using transactions, you should set this value to 1000000 / 4 = 250000. To help provide resiliency against failures, it is suggested that you set this parameter to a value that is high enough to permit an individual data node to handle the load for its node group. In other words, you should set the value equal to `total number of concurrent operations / number of node groups`. (In the case where there is a single node group, this is the same as the total number of concurrent operations for the entire cluster.)

  Because each transaction always involves at least one operation, the value of `MaxNoOfConcurrentOperations` should always be greater than or equal to the value of [`MaxNoOfConcurrentTransactions`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrenttransactions).

  Read queries which set locks also cause operation records to be created. Some extra space is allocated within individual nodes to accommodate cases where the distribution is not perfect over the nodes.

  When queries make use of the unique hash index, there are actually two operation records used per record in the transaction. The first record represents the read in the index table and the second handles the operation on the base table.

  The default value is 32768.

  This parameter actually handles two values that can be configured separately. The first of these specifies how many operation records are to be placed with the transaction coordinator. The second part specifies how many operation records are to be local to the database.

  A very large transaction performed on an eight-node cluster requires as many operation records in the transaction coordinator as there are reads, updates, and deletes involved in the transaction. However, the operation records of the are spread over all eight nodes. Thus, if it is necessary to configure the system for one very large transaction, it is a good idea to configure the two parts separately. [`MaxNoOfConcurrentOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentoperations) is always used to calculate the number of operation records in the transaction coordinator portion of the node.

  It is also important to have an idea of the memory requirements for operation records. These consume about 1KB per record.

* [`MaxNoOfLocalOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooflocaloperations)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  By default, this parameter is calculated as 1.1 × [`MaxNoOfConcurrentOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentoperations). This fits systems with many simultaneous transactions, none of them being very large. If there is a need to handle one very large transaction at a time and there are many nodes, it is a good idea to override the default value by explicitly specifying this parameter.

* [`MaxDMLOperationsPerTransaction`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdmloperationspertransaction)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter limits the size of a transaction. The transaction is aborted if it requires more than this many DML operations.

**Transaction temporary storage.** The next set of `[ndbd]` parameters is used to determine temporary storage when executing a statement that is part of a Cluster transaction. All records are released when the statement is completed and the cluster is waiting for the commit or rollback.

The default values for these parameters are adequate for most situations. However, users with a need to support transactions involving large numbers of rows or operations may need to increase these values to enable better parallelism in the system, whereas users whose applications require relatively small transactions can decrease the values to save memory.

* [`MaxNoOfConcurrentIndexOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentindexoperations)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  For queries using a unique hash index, another temporary set of operation records is used during a query's execution phase. This parameter sets the size of that pool of records. Thus, this record is allocated only while executing a part of a query. As soon as this part has been executed, the record is released. The state needed to handle aborts and commits is handled by the normal operation records, where the pool size is set by the parameter [`MaxNoOfConcurrentOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentoperations).

  The default value of this parameter is 8192. Only in rare cases of extremely high parallelism using unique hash indexes should it be necessary to increase this value. Using a smaller value is possible and can save memory if the DBA is certain that a high degree of parallelism is not required for the cluster.

* [`MaxNoOfFiredTriggers`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooffiredtriggers)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The default value of [`MaxNoOfFiredTriggers`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooffiredtriggers) is 4000, which is sufficient for most situations. In some cases it can even be decreased if the DBA feels certain the need for parallelism in the cluster is not high.

  A record is created when an operation is performed that affects a unique hash index. Inserting or deleting a record in a table with unique hash indexes or updating a column that is part of a unique hash index fires an insert or a delete in the index table. The resulting record is used to represent this index table operation while waiting for the original operation that fired it to complete. This operation is short-lived but can still require a large number of records in its pool for situations with many parallel write operations on a base table containing a set of unique hash indexes.

* [`TransactionBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-transactionbuffermemory)

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The memory affected by this parameter is used for tracking operations fired when updating index tables and reading unique indexes. This memory is used to store the key and column information for these operations. It is only very rarely that the value for this parameter needs to be altered from the default.

  The default value for [`TransactionBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-transactionbuffermemory) is 1MB.

  Normal read and write operations use a similar buffer, whose usage is even more short-lived. The compile-time parameter `ZATTRBUF_FILESIZE` (found in `ndb/src/kernel/blocks/Dbtc/Dbtc.hpp`) set to 4000 × 128 bytes (500KB). A similar buffer for key information, `ZDATABUF_FILESIZE` (also in `Dbtc.hpp`) contains 4000 × 16 = 62.5KB of buffer space. `Dbtc` is the module that handles transaction coordination.

**Scans and buffering.** There are additional `[ndbd]` parameters in the `Dblqh` module (in `ndb/src/kernel/blocks/Dblqh/Dblqh.hpp`) that affect reads and updates. These include `ZATTRINBUF_FILESIZE`, set by default to 10000 × 128 bytes (1250KB) and `ZDATABUF_FILE_SIZE`, set by default to 10000\*16 bytes (roughly 156KB) of buffer space. To date, there have been neither any reports from users nor any results from our own extensive tests suggesting that either of these compile-time limits should be increased.

* [`BatchSizePerLocalScan`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-batchsizeperlocalscan)

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter is used to calculate the number of lock records used to handle concurrent scan operations.

  `BatchSizePerLocalScan` has a strong connection to the [`BatchSize`](mysql-cluster-api-definition.html#ndbparam-api-batchsize) defined in the SQL nodes.

* [`LongMessageBuffer`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-longmessagebuffer)

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This is an internal buffer used for passing messages within individual nodes and between nodes. The default is 64MB.

  This parameter seldom needs to be changed from the default.

* [`MaxFKBuildBatchSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxfkbuildbatchsize)

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Maximum scan batch size used for building foreign keys. Increasing the value set for this parameter may speed up building of foreign key builds at the expense of greater impact to ongoing traffic.

* [`MaxNoOfConcurrentScans`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentscans)

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter is used to control the number of parallel scans that can be performed in the cluster. Each transaction coordinator can handle the number of parallel scans defined for this parameter. Each scan query is performed by scanning all partitions in parallel. Each partition scan uses a scan record in the node where the partition is located, the number of records being the value of this parameter times the number of nodes. The cluster should be able to sustain [`MaxNoOfConcurrentScans`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentscans) scans concurrently from all nodes in the cluster.

  Scans are actually performed in two cases. The first of these cases occurs when no hash or ordered indexes exists to handle the query, in which case the query is executed by performing a full table scan. The second case is encountered when there is no hash index to support the query but there is an ordered index. Using the ordered index means executing a parallel range scan. The order is kept on the local partitions only, so it is necessary to perform the index scan on all partitions.

  The default value of [`MaxNoOfConcurrentScans`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentscans) is 256. The maximum value is 500.

* [`MaxNoOfLocalScans`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooflocalscans)

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Specifies the number of local scan records if many scans are not fully parallelized. When the number of local scan records is not provided, it is calculated as shown here:

  ```sql
  4 * MaxNoOfConcurrentScans * [# data nodes] + 2
  ```

  The minimum value is 32.

* [`MaxParallelCopyInstances`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxparallelcopyinstances)

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter sets the parallelization used in the copy phase of a node restart or system restart, when a node that is currently just starting is synchronised with a node that already has current data by copying over any changed records from the node that is up to date. Because full parallelism in such cases can lead to overload situations, `MaxParallelCopyInstances` provides a means to decrease it. This parameter's default value 0. This value means that the effective parallelism is equal to the number of LDM instances in the node just starting as well as the node updating it.

* [`MaxParallelScansPerFragment`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxparallelscansperfragment)

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  It is possible to configure the maximum number of parallel scans ([`TUP`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtup.html) scans and [`TUX`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtux.html) scans) allowed before they begin queuing for serial handling. You can increase this to take advantage of any unused CPU when performing large number of scans in parallel and improve their performance.

* [`MaxReorgBuildBatchSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxreorgbuildbatchsize)

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Maximum scan batch size used for reorganization of table partitions. Increasing the value set for this parameter may speed up reorganization at the expense of greater impact to ongoing traffic.

* [`MaxUIBuildBatchSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxuibuildbatchsize)

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Node Restart: </strong></span>Requires a rolling restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Maximum scan batch size used for building unique keys. Increasing the value set for this parameter may speed up such builds at the expense of greater impact to ongoing traffic.

##### Memory Allocation

[`MaxAllocate`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxallocate)

<table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

This parameter was used in older versions of NDB Cluster, but has no effect in NDB 7.5 or NDB 7.6.

##### Hash Map Size

[`DefaultHashMapSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-defaulthashmapsize)

<table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

The size of the table hash maps used by [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") is configurable using this parameter. `DefaultHashMapSize` can take any of three possible values (0, 240, 3840).

The original intended use for this parameter was to facilitate upgrades and especially downgrades to and from very old releases with differing default hash map sizes. This is not an issue when upgrading from NDB Cluster 7.3 (or later) to later versions.

Decreasing this parameter online after any tables have been created or modified with `DefaultHashMapSize` equal to 3840 is not supported.

**Logging and checkpointing.** The following `[ndbd]` parameters control log and checkpoint behavior.

* [`FragmentLogFileSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-fragmentlogfilesize)

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Setting this parameter enables you to control directly the size of redo log files. This can be useful in situations when NDB Cluster is operating under a high load and it is unable to close fragment log files quickly enough before attempting to open new ones (only 2 fragment log files can be open at one time); increasing the size of the fragment log files gives the cluster more time before having to open each new fragment log file. The default value for this parameter is 16M.

  For more information about fragment log files, see the description for [`NoOfFragmentLogFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nooffragmentlogfiles).

* [`InitialNoOfOpenFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-initialnoofopenfiles)

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter sets the initial number of internal threads to allocate for open files.

  The default value is 27.

* [`InitFragmentLogFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-initfragmentlogfiles)

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  By default, fragment log files are created sparsely when performing an initial start of a data node—that is, depending on the operating system and file system in use, not all bytes are necessarily written to disk. However, it is possible to override this behavior and force all bytes to be written, regardless of the platform and file system type being used, by means of this parameter. [`InitFragmentLogFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-initfragmentlogfiles) takes either of two values:

  + `SPARSE`. Fragment log files are created sparsely. This is the default value.

  + `FULL`. Force all bytes of the fragment log file to be written to disk.

  Depending on your operating system and file system, setting `InitFragmentLogFiles=FULL` may help eliminate I/O errors on writes to the REDO log.

* [`EnablePartialLcp`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-enablepartiallcp)

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  When `true`, enable partial local checkpoints: This means that each LCP records only part of the full database, plus any records containing rows changed since the last LCP; if no rows have changed, the LCP updates only the LCP control file and does not update any data files.

  If `EnablePartialLcp` is disabled (`false`), each LCP uses only a single file and writes a full checkpoint; this requires the least amount of disk space for LCPs, but increases the write load for each LCP. The default value is enabled (`true`). The proportion of space used by partial LCPS can be modified by the setting for the [`RecoveryWork`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-recoverywork) configuration parameter.

  For more information about files and directories used for full and partial LCPs, see [NDB Cluster Data Node File System Directory](/doc/ndb-internals/en/ndb-internals-ndbd-filesystemdir-files.html).

  In NDB 7.6.7 and later, setting this parameter to `false` also disables the calculation of disk write speed used by the adaptive LCP control mechanism.

* [`LcpScanProgressTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-lcpscanprogresstimeout)

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  A local checkpoint fragment scan watchdog checks periodically for no progress in each fragment scan performed as part of a local checkpoint, and shuts down the node if there is no progress after a given amount of time has elapsed. This interval can be set using the [`LcpScanProgressTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-lcpscanprogresstimeout) data node configuration parameter, which sets the maximum time for which the local checkpoint can be stalled before the LCP fragment scan watchdog shuts down the node.

  The default value is 60 seconds (providing compatibility with previous releases). Setting this parameter to 0 disables the LCP fragment scan watchdog altogether.

* [`MaxNoOfOpenFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofopenfiles)

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter sets a ceiling on how many internal threads to allocate for open files. *Any situation requiring a change in this parameter should be reported as a bug*.

  The default value is 0. However, the minimum value to which this parameter can be set is 20.

* [`MaxNoOfSavedMessages`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofsavedmessages)

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter sets the maximum number of errors written in the error log as well as the maximum number of trace files that are kept before overwriting the existing ones. Trace files are generated when, for whatever reason, the node crashes.

  The default is 25, which sets these maximums to 25 error messages and 25 trace files.

* [`MaxLCPStartDelay`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxlcpstartdelay)

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  In parallel data node recovery, only table data is actually copied and synchronized in parallel; synchronization of metadata such as dictionary and checkpoint information is done in a serial fashion. In addition, recovery of dictionary and checkpoint information cannot be executed in parallel with performing of local checkpoints. This means that, when starting or restarting many data nodes concurrently, data nodes may be forced to wait while a local checkpoint is performed, which can result in longer node recovery times.

  It is possible to force a delay in the local checkpoint to permit more (and possibly all) data nodes to complete metadata synchronization; once each data node's metadata synchronization is complete, all of the data nodes can recover table data in parallel, even while the local checkpoint is being executed. To force such a delay, set [`MaxLCPStartDelay`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxlcpstartdelay), which determines the number of seconds the cluster can wait to begin a local checkpoint while data nodes continue to synchronize metadata. This parameter should be set in the `[ndbd default]` section of the `config.ini` file, so that it is the same for all data nodes. The maximum value is 600; the default is 0.

* [`NoOfFragmentLogFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nooffragmentlogfiles)

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter sets the number of REDO log files for the node, and thus the amount of space allocated to REDO logging. Because the REDO log files are organized in a ring, it is extremely important that the first and last log files in the set (sometimes referred to as the “head” and “tail” log files, respectively) do not meet. When these approach one another too closely, the node begins aborting all transactions encompassing updates due to a lack of room for new log records.

  A `REDO` log record is not removed until both required local checkpoints have been completed since that log record was inserted. Checkpointing frequency is determined by its own set of configuration parameters discussed elsewhere in this chapter.

  The default parameter value is 16, which by default means 16 sets of 4 16MB files for a total of 1024MB. The size of the individual log files is configurable using the [`FragmentLogFileSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-fragmentlogfilesize) parameter. In scenarios requiring a great many updates, the value for [`NoOfFragmentLogFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nooffragmentlogfiles) may need to be set as high as 300 or even higher to provide sufficient space for REDO logs.

  If the checkpointing is slow and there are so many writes to the database that the log files are full and the log tail cannot be cut without jeopardizing recovery, all updating transactions are aborted with internal error code 410 (`Out of log file space temporarily`). This condition prevails until a checkpoint has completed and the log tail can be moved forward.

  Important

  This parameter cannot be changed “on the fly”; you must restart the node using `--initial`. If you wish to change this value for all data nodes in a running cluster, you can do so using a rolling node restart (using `--initial` when starting each data node).

* [`RecoveryWork`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-recoverywork)

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Percentage of storage overhead for LCP files. This parameter has an effect only when [`EnablePartialLcp`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-enablepartiallcp) is true, that is, only when partial local checkpoints are enabled. A higher value means:

  + Fewer records are written for each LCP, LCPs use more space

  + More work is needed during restarts

  A lower value for `RecoveryWork` means:

  + More records are written during each LCP, but LCPs require less space on disk.

  + Less work during restart and thus faster restarts, at the expense of more work during normal operations

  For example, setting `RecoveryWork` to 60 means that the total size of an LCP is roughly 1 + 0.6 = 1.6 times the size of the data to be checkpointed. This means that 60% more work is required during the restore phase of a restart compared to the work done during a restart that uses full checkpoints. (This is more than compensated for during other phases of the restart such that the restart as a whole is still faster when using partial LCPs than when using full LCPs.) In order not to fill up the redo log, it is necessary to write at 1 + (1 / `RecoveryWork`) times the rate of data changes during checkpoints—thus, when `RecoveryWork` = 60, it is necessary to write at approximately 1 + (1 / 0.6 ) = 2.67 times the change rate. In other words, if changes are being written at 10 MByte per second, the checkpoint needs to be written at roughly 26.7 MByte per second.

  Setting `RecoveryWork` = 40 means that only 1.4 times the total LCP size is needed (and thus the restore phase takes 10 to 15 percent less time. In this case, the checkpoint write rate is 3.5 times the rate of change.

  The NDB source distribution includes a test program for simulating LCPs. `lcp_simulator.cc` can be found in `storage/ndb/src/kernel/blocks/backup/`. To compile and run it on Unix platforms, execute the commands shown here:

  ```sql
  $> gcc lcp_simulator.cc
  $> ./a.out
  ```

  This program has no dependencies other than `stdio.h`, and does not require a connection to an NDB cluster or a MySQL server. By default, it simulates 300 LCPs (three sets of 100 LCPs, each consisting of inserts, updates, and deletes, in turn), reporting the size of the LCP after each one. You can alter the simulation by changing the values of `recovery_work`, `insert_work`, and `delete_work` in the source and recompiling. For more information, see the source of the program.

* [`InsertRecoveryWork`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-insertrecoverywork)

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Percentage of [`RecoveryWork`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-recoverywork) used for inserted rows. A higher value increases the number of writes during a local checkpoint, and decreases the total size of the LCP. A lower value decreases the number of writes during an LCP, but results in more space being used for the LCP, which means that recovery takes longer. This parameter has an effect only when [`EnablePartialLcp`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-enablepartiallcp) is true, that is, only when partial local checkpoints are enabled.

* [`EnableRedoControl`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-enableredocontrol)

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Enable adaptive checkpointing speed for controlling redo log usage. Set to `false` to disable (the default). Setting [`EnablePartialLcp`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-enablepartiallcp) to `false` also disables the adaptive calculation.

  When enabled, `EnableRedoControl` allows the data nodes greater flexibility with regard to the rate at which they write LCPs to disk. More specifically, enabling this parameter means that higher write rates can be employed, so that LCPs can complete and Redo logs be trimmed more quickly, thereby reducing recovery time and disk space requirements. This functionality allows data nodes to make better use of the higher rate of I/O and greater bandwidth available from modern solid-state storage devices and protocols, such as solid-state drives (SSDs) using Non-Volatile Memory Express (NVMe).

  The parameter currently defaults to `false` (disabled) due to the fact that `NDB` is still deployed widely on systems whose I/O or bandwidth is constrained relative to those employing solid-state technology, such as those using conventional hard disks (HDDs). In settings such as these, the `EnableRedoControl` mechanism can easily cause the I/O subsystem to become saturated, increasing wait times for data node input and output. In particular, this can cause issues with NDB Disk Data tables which have tablespaces or log file groups sharing a constrained IO subsystem with data node LCP and redo log files; such problems potentially include node or cluster failure due to GCP stop errors.

**Metadata objects.** The next set of `[ndbd]` parameters defines pool sizes for metadata objects, used to define the maximum number of attributes, tables, indexes, and trigger objects used by indexes, events, and replication between clusters.

Note

These act merely as “suggestions” to the cluster, and any that are not specified revert to the default values shown.

* [`MaxNoOfAttributes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofattributes)

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter sets a suggested maximum number of attributes that can be defined in the cluster; like [`MaxNoOfTables`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooftables), it is not intended to function as a hard upper limit.

  (In older NDB Cluster releases, this parameter was sometimes treated as a hard limit for certain operations. This caused problems with NDB Cluster Replication, when it was possible to create more tables than could be replicated, and sometimes led to confusion when it was possible [or not possible, depending on the circumstances] to create more than `MaxNoOfAttributes` attributes.)

  The default value is 1000, with the minimum possible value being 32. The maximum is 4294967039. Each attribute consumes around 200 bytes of storage per node due to the fact that all metadata is fully replicated on the servers.

  When setting [`MaxNoOfAttributes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofattributes), it is important to prepare in advance for any [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statements that you might want to perform in the future. This is due to the fact, during the execution of [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") on a Cluster table, 3 times the number of attributes as in the original table are used, and a good practice is to permit double this amount. For example, if the NDB Cluster table having the greatest number of attributes (*`greatest_number_of_attributes`*) has 100 attributes, a good starting point for the value of [`MaxNoOfAttributes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofattributes) would be `6 * greatest_number_of_attributes = 600`.

  You should also estimate the average number of attributes per table and multiply this by [`MaxNoOfTables`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooftables). If this value is larger than the value obtained in the previous paragraph, you should use the larger value instead.

  Assuming that you can create all desired tables without any problems, you should also verify that this number is sufficient by trying an actual [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") after configuring the parameter. If this is not successful, increase [`MaxNoOfAttributes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofattributes) by another multiple of [`MaxNoOfTables`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooftables) and test it again.

* [`MaxNoOfTables`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooftables)

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  A table object is allocated for each table and for each unique hash index in the cluster. This parameter sets a suggested maximum number of table objects for the cluster as a whole; like [`MaxNoOfAttributes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofattributes), it is not intended to function as a hard upper limit.

  (In older NDB Cluster releases, this parameter was sometimes treated as a hard limit for certain operations. This caused problems with NDB Cluster Replication, when it was possible to create more tables than could be replicated, and sometimes led to confusion when it was possible [or not possible, depending on the circumstances] to create more than `MaxNoOfTables` tables.)

  For each attribute that has a [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") data type an extra table is used to store most of the [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") data. These tables also must be taken into account when defining the total number of tables.

  The default value of this parameter is 128. The minimum is 8 and the maximum is 20320. Each table object consumes approximately 20KB per node.

  Note

  The sum of [`MaxNoOfTables`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooftables), [`MaxNoOfOrderedIndexes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooforderedindexes), and [`MaxNoOfUniqueHashIndexes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofuniquehashindexes) must not exceed `232 − 2` (4294967294).

* [`MaxNoOfOrderedIndexes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooforderedindexes)

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  For each ordered index in the cluster, an object is allocated describing what is being indexed and its storage segments. By default, each index so defined also defines an ordered index. Each unique index and primary key has both an ordered index and a hash index. [`MaxNoOfOrderedIndexes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooforderedindexes) sets the total number of ordered indexes that can be in use in the system at any one time.

  The default value of this parameter is 128. Each index object consumes approximately 10KB of data per node.

  Note

  The sum of [`MaxNoOfTables`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooftables), [`MaxNoOfOrderedIndexes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooforderedindexes), and [`MaxNoOfUniqueHashIndexes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofuniquehashindexes) must not exceed `232 − 2` (4294967294).

* [`MaxNoOfUniqueHashIndexes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofuniquehashindexes)

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  For each unique index that is not a primary key, a special table is allocated that maps the unique key to the primary key of the indexed table. By default, an ordered index is also defined for each unique index. To prevent this, you must specify the `USING HASH` option when defining the unique index.

  The default value is 64. Each index consumes approximately 15KB per node.

  Note

  The sum of [`MaxNoOfTables`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooftables), [`MaxNoOfOrderedIndexes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooforderedindexes), and [`MaxNoOfUniqueHashIndexes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofuniquehashindexes) must not exceed `232 − 2` (4294967294).

* [`MaxNoOfTriggers`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooftriggers)

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Internal update, insert, and delete triggers are allocated for each unique hash index. (This means that three triggers are created for each unique hash index.) However, an *ordered* index requires only a single trigger object. Backups also use three trigger objects for each normal table in the cluster.

  Replication between clusters also makes use of internal triggers.

  This parameter sets the maximum number of trigger objects in the cluster.

  The default value is 768.

* [`MaxNoOfSubscriptions`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofsubscriptions)

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Each [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table in an NDB Cluster requires a subscription in the NDB kernel. For some NDB API applications, it may be necessary or desirable to change this parameter. However, for normal usage with MySQL servers acting as SQL nodes, there is not any need to do so.

  The default value for [`MaxNoOfSubscriptions`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofsubscriptions) is 0, which is treated as equal to [`MaxNoOfTables`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooftables). Each subscription consumes 108 bytes.

* [`MaxNoOfSubscribers`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofsubscribers)

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter is of interest only when using NDB Cluster Replication. The default value is 0, which is treated as `2 * MaxNoOfTables`; that is, there is one subscription per [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table for each of two MySQL servers (one acting as the replication source and the other as the replica). Each subscriber uses 16 bytes of memory.

  When using circular replication, multi-source replication, and other replication setups involving more than 2 MySQL servers, you should increase this parameter to the number of [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") processes included in replication (this is often, but not always, the same as the number of clusters). For example, if you have a circular replication setup using three NDB Cluster s, with one [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") attached to each cluster, and each of these [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") processes acts as a source and as a replica, you should set [`MaxNoOfSubscribers`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofsubscribers) equal to `3 * MaxNoOfTables`.

  For more information, see [Section 21.7, “NDB Cluster Replication”](mysql-cluster-replication.html "21.7 NDB Cluster Replication").

* [`MaxNoOfConcurrentSubOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentsuboperations)

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter sets a ceiling on the number of operations that can be performed by all API nodes in the cluster at one time. The default value (256) is sufficient for normal operations, and might need to be adjusted only in scenarios where there are a great many API nodes each performing a high volume of operations concurrently.

**Boolean parameters.** The behavior of data nodes is also affected by a set of `[ndbd]` parameters taking on boolean values. These parameters can each be specified as `TRUE` by setting them equal to `1` or `Y`, and as `FALSE` by setting them equal to `0` or `N`.

* [`CompressedLCP`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-compressedlcp)

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Setting this parameter to `1` causes local checkpoint files to be compressed. The compression used is equivalent to **gzip --fast**, and can save 50% or more of the space required on the data node to store uncompressed checkpoint files. Compressed LCPs can be enabled for individual data nodes, or for all data nodes (by setting this parameter in the `[ndbd default]` section of the `config.ini` file).

  Important

  You cannot restore a compressed local checkpoint to a cluster running a MySQL version that does not support this feature.

  The default value is `0` (disabled).

  On Windows platforms, this parameter has no effect in NDB 7.5 or NDB 7.6.

* [`CrashOnCorruptedTuple`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-crashoncorruptedtuple)

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  When this parameter is enabled, it forces a data node to shut down whenever it encounters a corrupted tuple. In NDB 7.5, it is enabled by default.

* [`Diskless`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskless)

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  It is possible to specify NDB Cluster tables as diskless, meaning that tables are not checkpointed to disk and that no logging occurs. Such tables exist only in main memory. A consequence of using diskless tables is that neither the tables nor the records in those tables survive a crash. However, when operating in diskless mode, it is possible to run [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") on a diskless computer.

  Important

  This feature causes the *entire* cluster to operate in diskless mode.

  When this feature is enabled, Cluster online backup is disabled. In addition, a partial start of the cluster is not possible.

  [`Diskless`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskless) is disabled by default.

* [`LateAlloc`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-latealloc)

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Allocate memory for this data node after a connection to the management server has been established. Enabled by default.

* [`LockPagesInMainMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-lockpagesinmainmemory)

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  For a number of operating systems, including Solaris and Linux, it is possible to lock a process into memory and so avoid any swapping to disk. This can be used to help guarantee the cluster's real-time characteristics.

  This parameter takes one of the integer values `0`, `1`, or `2`, which act as shown in the following list:

  + `0`: Disables locking. This is the default value.

  + `1`: Performs the lock after allocating memory for the process.

  + `2`: Performs the lock before memory for the process is allocated.

  If the operating system is not configured to permit unprivileged users to lock pages, then the data node process making use of this parameter may have to be run as system root. ([`LockPagesInMainMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-lockpagesinmainmemory) uses the `mlockall` function. From Linux kernel 2.6.9, unprivileged users can lock memory as limited by `max locked memory`. For more information, see **ulimit -l** and <http://linux.die.net/man/2/mlock>).

  Note

  In older NDB Cluster releases, this parameter was a Boolean. `0` or `false` was the default setting, and disabled locking. `1` or `true` enabled locking of the process after its memory was allocated. NDB Cluster 7.5 treats `true` or `false` for the value of this parameter as an error.

  Important

  Beginning with `glibc` 2.10, `glibc` uses per-thread arenas to reduce lock contention on a shared pool, which consumes real memory. In general, a data node process does not need per-thread arenas, since it does not perform any memory allocation after startup. (This difference in allocators does not appear to affect performance significantly.)

  The `glibc` behavior is intended to be configurable via the `MALLOC_ARENA_MAX` environment variable, but a bug in this mechanism prior to `glibc` 2.16 meant that this variable could not be set to less than 8, so that the wasted memory could not be reclaimed. (Bug #15907219; see also <http://sourceware.org/bugzilla/show_bug.cgi?id=13137> for more information concerning this issue.)

  One possible workaround for this problem is to use the `LD_PRELOAD` environment variable to preload a `jemalloc` memory allocation library to take the place of that supplied with `glibc`.

* [`ODirect`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-odirect)

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Enabling this parameter causes [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") to attempt using `O_DIRECT` writes for LCP, backups, and redo logs, often lowering **kswapd** and CPU usage. When using NDB Cluster on Linux, enable [`ODirect`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-odirect) if you are using a 2.6 or later kernel.

  [`ODirect`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-odirect) is disabled by default.

* [`ODirectSyncFlag`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-odirectsyncflag)

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  When this parameter is enabled, redo log writes are performed such that each completed file system write is handled as a call to `fsync`. The setting for this parameter is ignored if at least one of the following conditions is true:

  + [`ODirect`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-odirect) is not enabled.

  + `InitFragmentLogFiles` is set to `SPARSE`.

  Disabled by default.

* [`RestartOnErrorInsert`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-restartonerrorinsert)

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This feature is accessible only when building the debug version where it is possible to insert errors in the execution of individual blocks of code as part of testing.

  This feature is disabled by default.

* [`StopOnError`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-stoponerror)

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter specifies whether a data node process should exit or perform an automatic restart when an error condition is encountered.

  This parameter's default value is 1; this means that, by default, an error causes the data node process to halt.

  When an error is encountered and `StopOnError` is 0, the data node process is restarted.

  Prior to NDB Cluster 7.5.5, if the data node process exits in an uncontrolled fashion (due, for example, to performing [**kill -9**](kill.html "13.7.6.4 KILL Statement") on the data node process while performing a query, or to a segmentation fault), and `StopOnError` is set to 0, the angel process attempts to restart it in exactly the same way as it was started previously—that is, using the same startup options that were employed the last time the node was started. Thus, if the data node process was originally started using the [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial) option, it is also restarted with `--initial`. This means that, in such cases, if the failure occurs on a sufficient number of data nodes in a very short interval, the effect is the same as if you had performed an initial restart of the entire cluster, leading to loss of all data. This issue is resolved in NDB Cluster 7.5.5 and later NDB 7.5 releases (Bug #83510, Bug
  #24945638).

  Users of MySQL Cluster Manager should note that, when `StopOnError` equals 1, this prevents the MySQL Cluster Manager agent from restarting any data nodes after it has performed its own restart and recovery. See [Starting and Stopping the Agent on Linux](/doc/mysql-cluster-manager/1.4/en/mcm-using-start-stop-agent-linux.html), for more information.

* [`UseShm`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-useshm)

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Use shared memory connections between this data node and the API node also running on this host. Set to 1 to enable.

  See [Section 21.4.3.12, “NDB Cluster Shared Memory Connections”](mysql-cluster-shm-definition.html "21.4.3.12 NDB Cluster Shared Memory Connections"), for more information.

##### Controlling Timeouts, Intervals, and Disk Paging

There are a number of `[ndbd]` parameters specifying timeouts and intervals between various actions in Cluster data nodes. Most of the timeout values are specified in milliseconds. Any exceptions to this are mentioned where applicable.

* [`TimeBetweenWatchDogCheck`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenwatchdogcheck)

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  To prevent the main thread from getting stuck in an endless loop at some point, a “watchdog” thread checks the main thread. This parameter specifies the number of milliseconds between checks. If the process remains in the same state after three checks, the watchdog thread terminates it.

  This parameter can easily be changed for purposes of experimentation or to adapt to local conditions. It can be specified on a per-node basis although there seems to be little reason for doing so.

  The default timeout is 6000 milliseconds (6 seconds).

* [`TimeBetweenWatchDogCheckInitial`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenwatchdogcheckinitial)

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This is similar to the [`TimeBetweenWatchDogCheck`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenwatchdogcheck) parameter, except that [`TimeBetweenWatchDogCheckInitial`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenwatchdogcheckinitial) controls the amount of time that passes between execution checks inside a storage node in the early start phases during which memory is allocated.

  The default timeout is 6000 milliseconds (6 seconds).

* [`StartPartialTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startpartialtimeout)

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter specifies how long the Cluster waits for all data nodes to come up before the cluster initialization routine is invoked. This timeout is used to avoid a partial Cluster startup whenever possible.

  This parameter is overridden when performing an initial start or initial restart of the cluster.

  The default value is 30000 milliseconds (30 seconds). 0 disables the timeout, in which case the cluster may start only if all nodes are available.

* [`StartPartitionedTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startpartitionedtimeout)

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  If the cluster is ready to start after waiting for [`StartPartialTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startpartialtimeout) milliseconds but is still possibly in a partitioned state, the cluster waits until this timeout has also passed. If [`StartPartitionedTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startpartitionedtimeout) is set to 0, the cluster waits indefinitely (232−1 ms, or approximately 49.71 days).

  This parameter is overridden when performing an initial start or initial restart of the cluster.

  The default value in NDB 7.6 is 0; previously it was 60000 (60 seconds).

* [`StartFailureTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startfailuretimeout)

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  If a data node has not completed its startup sequence within the time specified by this parameter, the node startup fails. Setting this parameter to 0 (the default value) means that no data node timeout is applied.

  For nonzero values, this parameter is measured in milliseconds. For data nodes containing extremely large amounts of data, this parameter should be increased. For example, in the case of a data node containing several gigabytes of data, a period as long as 10−15 minutes (that is, 600000 to 1000000 milliseconds) might be required to perform a node restart.

* [`StartNoNodeGroupTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startnonodegrouptimeout)

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  When a data node is configured with [`Nodegroup = 65536`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nodegroup), is regarded as not being assigned to any node group. When that is done, the cluster waits `StartNoNodegroupTimeout` milliseconds, then treats such nodes as though they had been added to the list passed to the [`--nowait-nodes`](mysql-cluster-programs-ndbd.html#option_ndbd_nowait-nodes) option, and starts. The default value is `15000` (that is, the management server waits 15 seconds). Setting this parameter equal to `0` means that the cluster waits indefinitely.

  `StartNoNodegroupTimeout` must be the same for all data nodes in the cluster; for this reason, you should always set it in the `[ndbd default]` section of the `config.ini` file, rather than for individual data nodes.

  See [Section 21.6.7, “Adding NDB Cluster Data Nodes Online”](mysql-cluster-online-add-node.html "21.6.7 Adding NDB Cluster Data Nodes Online"), for more information.

* [`HeartbeatIntervalDbDb`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatintervaldbdb)

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  One of the primary methods of discovering failed nodes is by the use of heartbeats. This parameter states how often heartbeat signals are sent and how often to expect to receive them. Heartbeats cannot be disabled.

  After missing four heartbeat intervals in a row, the node is declared dead. Thus, the maximum time for discovering a failure through the heartbeat mechanism is five times the heartbeat interval.

  The default heartbeat interval is 5000 milliseconds (5 seconds). This parameter must not be changed drastically and should not vary widely between nodes. If one node uses 5000 milliseconds and the node watching it uses 1000 milliseconds, obviously the node is declared dead very quickly. This parameter can be changed during an online software upgrade, but only in small increments.

  See also [Network communication and latency](mysql-cluster-overview-requirements.html#mysql-cluster-network-latency-issues "Network communication and latency"), as well as the description of the [`ConnectCheckIntervalDelay`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-connectcheckintervaldelay) configuration parameter.

* [`HeartbeatIntervalDbApi`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatintervaldbapi)

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Each data node sends heartbeat signals to each MySQL server (SQL node) to ensure that it remains in contact. If a MySQL server fails to send a heartbeat in time it is declared “dead,” in which case all ongoing transactions are completed and all resources released. The SQL node cannot reconnect until all activities initiated by the previous MySQL instance have been completed. The three-heartbeat criteria for this determination are the same as described for [`HeartbeatIntervalDbDb`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatintervaldbdb).

  The default interval is 1500 milliseconds (1.5 seconds). This interval can vary between individual data nodes because each data node watches the MySQL servers connected to it, independently of all other data nodes.

  For more information, see [Network communication and latency](mysql-cluster-overview-requirements.html#mysql-cluster-network-latency-issues "Network communication and latency").

* [`HeartbeatOrder`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatorder)

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Data nodes send heartbeats to one another in a circular fashion whereby each data node monitors the previous one. If a heartbeat is not detected by a given data node, this node declares the previous data node in the circle “dead” (that is, no longer accessible by the cluster). The determination that a data node is dead is done globally; in other words; once a data node is declared dead, it is regarded as such by all nodes in the cluster.

  It is possible for heartbeats between data nodes residing on different hosts to be too slow compared to heartbeats between other pairs of nodes (for example, due to a very low heartbeat interval or temporary connection problem), such that a data node is declared dead, even though the node can still function as part of the cluster. .

  In this type of situation, it may be that the order in which heartbeats are transmitted between data nodes makes a difference as to whether or not a particular data node is declared dead. If this declaration occurs unnecessarily, this can in turn lead to the unnecessary loss of a node group and as thus to a failure of the cluster.

  Consider a setup where there are 4 data nodes A, B, C, and D running on 2 host computers `host1` and `host2`, and that these data nodes make up 2 node groups, as shown in the following table:

  **Table 21.9 Four data nodes A, B, C, D running on two host computers host1, host2; each data node belongs to one of two node groups.**

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Suppose the heartbeats are transmitted in the order A->B->C->D->A. In this case, the loss of the heartbeat between the hosts causes node B to declare node A dead and node C to declare node B dead. This results in loss of Node Group 0, and so the cluster fails. On the other hand, if the order of transmission is A->B->D->C->A (and all other conditions remain as previously stated), the loss of the heartbeat causes nodes A and D to be declared dead; in this case, each node group has one surviving node, and the cluster survives.

  The [`HeartbeatOrder`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatorder) configuration parameter makes the order of heartbeat transmission user-configurable. The default value for [`HeartbeatOrder`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatorder) is zero; allowing the default value to be used on all data nodes causes the order of heartbeat transmission to be determined by `NDB`. If this parameter is used, it must be set to a nonzero value (maximum 65535) for every data node in the cluster, and this value must be unique for each data node; this causes the heartbeat transmission to proceed from data node to data node in the order of their [`HeartbeatOrder`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatorder) values from lowest to highest (and then directly from the data node having the highest [`HeartbeatOrder`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatorder) to the data node having the lowest value, to complete the circle). The values need not be consecutive. For example, to force the heartbeat transmission order A->B->D->C->A in the scenario outlined previously, you could set the [`HeartbeatOrder`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatorder) values as shown here:

  **Table 21.10 HeartbeatOrder values to force a heartbeat transition order of A->B->D->C->A.**

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  To use this parameter to change the heartbeat transmission order in a running NDB Cluster, you must first set [`HeartbeatOrder`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatorder) for each data node in the cluster in the global configuration (`config.ini`) file (or files). To cause the change to take effect, you must perform either of the following:

  + A complete shutdown and restart of the entire cluster.
  + 2 rolling restarts of the cluster in succession. *All nodes must be restarted in the same order in both rolling restarts*.

  You can use [`DUMP 908`](/doc/ndb-internals/en/dump-command-908.html) to observe the effect of this parameter in the data node logs.

* [`ConnectCheckIntervalDelay`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-connectcheckintervaldelay)

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter enables connection checking between data nodes after one of them has failed heartbeat checks for 5 intervals of up to [`HeartbeatIntervalDbDb`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-heartbeatintervaldbdb) milliseconds.

  Such a data node that further fails to respond within an interval of `ConnectCheckIntervalDelay` milliseconds is considered suspect, and is considered dead after two such intervals. This can be useful in setups with known latency issues.

  The default value for this parameter is 0 (disabled).

* [`TimeBetweenLocalCheckpoints`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenlocalcheckpoints)

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter is an exception in that it does not specify a time to wait before starting a new local checkpoint; rather, it is used to ensure that local checkpoints are not performed in a cluster where relatively few updates are taking place. In most clusters with high update rates, it is likely that a new local checkpoint is started immediately after the previous one has been completed.

  The size of all write operations executed since the start of the previous local checkpoints is added. This parameter is also exceptional in that it is specified as the base-2 logarithm of the number of 4-byte words, so that the default value 20 means 4MB (4 × 220) of write operations, 21 would mean 8MB, and so on up to a maximum value of 31, which equates to 8GB of write operations.

  All the write operations in the cluster are added together. Setting [`TimeBetweenLocalCheckpoints`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenlocalcheckpoints) to 6 or less means that local checkpoints are executed continuously without pause, independent of the cluster's workload.

* [`TimeBetweenGlobalCheckpoints`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenglobalcheckpoints)

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  When a transaction is committed, it is committed in main memory in all nodes on which the data is mirrored. However, transaction log records are not flushed to disk as part of the commit. The reasoning behind this behavior is that having the transaction safely committed on at least two autonomous host machines should meet reasonable standards for durability.

  It is also important to ensure that even the worst of cases—a complete crash of the cluster—is handled properly. To guarantee that this happens, all transactions taking place within a given interval are put into a global checkpoint, which can be thought of as a set of committed transactions that has been flushed to disk. In other words, as part of the commit process, a transaction is placed in a global checkpoint group. Later, this group's log records are flushed to disk, and then the entire group of transactions is safely committed to disk on all computers in the cluster.

  This parameter defines the interval between global checkpoints. The default is 2000 milliseconds.

* [`TimeBetweenGlobalCheckpointsTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenglobalcheckpointstimeout)

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter defines the minimum timeout between global checkpoints. The default is 120000 milliseconds.

* [`TimeBetweenEpochs`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenepochs)

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter defines the interval between synchronization epochs for NDB Cluster Replication. The default value is 100 milliseconds.

  [`TimeBetweenEpochs`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenepochs) is part of the implementation of “micro-GCPs”, which can be used to improve the performance of NDB Cluster Replication.

* [`TimeBetweenEpochsTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenepochstimeout)

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter defines a timeout for synchronization epochs for NDB Cluster Replication. If a node fails to participate in a global checkpoint within the time determined by this parameter, the node is shut down. The default value is 0; in other words, the timeout is disabled.

  [`TimeBetweenEpochsTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenepochstimeout) is part of the implementation of “micro-GCPs”, which can be used to improve the performance of NDB Cluster Replication.

  The current value of this parameter and a warning are written to the cluster log whenever a GCP save takes longer than 1 minute or a GCP commit takes longer than 10 seconds.

  Setting this parameter to zero has the effect of disabling GCP stops caused by save timeouts, commit timeouts, or both. The maximum possible value for this parameter is 256000 milliseconds.

* [`MaxBufferedEpochs`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxbufferedepochs)

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The number of unprocessed epochs by which a subscribing node can lag behind. Exceeding this number causes a lagging subscriber to be disconnected.

  The default value of 100 is sufficient for most normal operations. If a subscribing node does lag enough to cause disconnections, it is usually due to network or scheduling issues with regard to processes or threads. (In rare circumstances, the problem may be due to a bug in the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") client.) It may be desirable to set the value lower than the default when epochs are longer.

  Disconnection prevents client issues from affecting the data node service, running out of memory to buffer data, and eventually shutting down. Instead, only the client is affected as a result of the disconnect (by, for example gap events in the binary log), forcing the client to reconnect or restart the process.

* [`MaxBufferedEpochBytes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxbufferedepochbytes)

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The total number of bytes allocated for buffering epochs by this node.

* [`TimeBetweenInactiveTransactionAbortCheck`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweeninactivetransactionabortcheck)

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Timeout handling is performed by checking a timer on each transaction once for every interval specified by this parameter. Thus, if this parameter is set to 1000 milliseconds, every transaction is checked for timing out once per second.

  The default value is 1000 milliseconds (1 second).

* [`TransactionInactiveTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-transactioninactivetimeout)

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter states the maximum time that is permitted to lapse between operations in the same transaction before the transaction is aborted.

  The default for this parameter is `4G` (also the maximum). For a real-time database that needs to ensure that no transaction keeps locks for too long, this parameter should be set to a relatively small value. Setting it to 0 means that the application never times out. The unit is milliseconds.

* [`TransactionDeadlockDetectionTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-transactiondeadlockdetectiontimeout)

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  When a node executes a query involving a transaction, the node waits for the other nodes in the cluster to respond before continuing. This parameter sets the amount of time that the transaction can spend executing within a data node, that is, the time that the transaction coordinator waits for each data node participating in the transaction to execute a request.

  A failure to respond can occur for any of the following reasons:

  + The node is “dead”
  + The operation has entered a lock queue
  + The node requested to perform the action could be heavily overloaded.

  This timeout parameter states how long the transaction coordinator waits for query execution by another node before aborting the transaction, and is important for both node failure handling and deadlock detection.

  The default timeout value is 1200 milliseconds (1.2 seconds).

  The minimum for this parameter is 50 milliseconds.

* [`DiskSyncSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-disksyncsize)

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This is the maximum number of bytes to store before flushing data to a local checkpoint file. This is done to prevent write buffering, which can impede performance significantly. This parameter is *not* intended to take the place of [`TimeBetweenLocalCheckpoints`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenlocalcheckpoints).

  Note

  When [`ODirect`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-odirect) is enabled, it is not necessary to set [`DiskSyncSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-disksyncsize); in fact, in such cases its value is simply ignored.

  The default value is 4M (4 megabytes).

* [`MaxDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeed)

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Set the maximum rate for writing to disk, in bytes per second, by local checkpoints and backup operations when no restarts (by this data node or any other data node) are taking place in this NDB Cluster.

  For setting the maximum rate of disk writes allowed while this data node is restarting, use [`MaxDiskWriteSpeedOwnRestart`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeedownrestart). For setting the maximum rate of disk writes allowed while other data nodes are restarting, use [`MaxDiskWriteSpeedOtherNodeRestart`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeedothernoderestart). The minimum speed for disk writes by all LCPs and backup operations can be adjusted by setting [`MinDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-mindiskwritespeed).

* [`MaxDiskWriteSpeedOtherNodeRestart`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeedothernoderestart)

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Set the maximum rate for writing to disk, in bytes per second, by local checkpoints and backup operations when one or more data nodes in this NDB Cluster are restarting, other than this node.

  For setting the maximum rate of disk writes allowed while this data node is restarting, use [`MaxDiskWriteSpeedOwnRestart`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeedownrestart). For setting the maximum rate of disk writes allowed when no data nodes are restarting anywhere in the cluster, use [`MaxDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeed). The minimum speed for disk writes by all LCPs and backup operations can be adjusted by setting [`MinDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-mindiskwritespeed).

* [`MaxDiskWriteSpeedOwnRestart`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeedownrestart)

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Set the maximum rate for writing to disk, in bytes per second, by local checkpoints and backup operations while this data node is restarting.

  For setting the maximum rate of disk writes allowed while other data nodes are restarting, use [`MaxDiskWriteSpeedOtherNodeRestart`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeedothernoderestart). For setting the maximum rate of disk writes allowed when no data nodes are restarting anywhere in the cluster, use [`MaxDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeed). The minimum speed for disk writes by all LCPs and backup operations can be adjusted by setting [`MinDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-mindiskwritespeed).

* [`MinDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-mindiskwritespeed)

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Set the minimum rate for writing to disk, in bytes per second, by local checkpoints and backup operations.

  The maximum rates of disk writes allowed for LCPs and backups under various conditions are adjustable using the parameters [`MaxDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeed), [`MaxDiskWriteSpeedOwnRestart`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeedownrestart), and [`MaxDiskWriteSpeedOtherNodeRestart`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeedothernoderestart). See the descriptions of these parameters for more information.

* [`ApiFailureHandlingTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-apifailurehandlingtimeout)

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Specifies the maximum time (in seconds) that the data node waits for API node failure handling to complete before escalating it to data node failure handling.

  Added in NDB 7.6.34.

* [`ArbitrationTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-arbitrationtimeout)

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter specifies how long data nodes wait for a response from the arbitrator to an arbitration message. If this is exceeded, the network is assumed to have split.

  The default value is 7500 milliseconds (7.5 seconds).

* [`Arbitration`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-arbitration)

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The [`Arbitration`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-arbitration) parameter enables a choice of arbitration schemes, corresponding to one of 3 possible values for this parameter:

  + **Default.** This enables arbitration to proceed normally, as determined by the `ArbitrationRank` settings for the management and API nodes. This is the default value.

  + **Disabled.** Setting `Arbitration = Disabled` in the `[ndbd default]` section of the `config.ini` file to accomplishes the same task as setting `ArbitrationRank` to 0 on all management and API nodes. When `Arbitration` is set in this way, any `ArbitrationRank` settings are ignored.

  + **WaitExternal.** The [`Arbitration`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-arbitration) parameter also makes it possible to configure arbitration in such a way that the cluster waits until after the time determined by [`ArbitrationTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-arbitrationtimeout) has passed for an external cluster manager application to perform arbitration instead of handling arbitration internally. This can be done by setting `Arbitration = WaitExternal` in the `[ndbd default]` section of the `config.ini` file. For best results with the `WaitExternal` setting, it is recommended that [`ArbitrationTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-arbitrationtimeout) be 2 times as long as the interval required by the external cluster manager to perform arbitration.

  Important

  This parameter should be used only in the `[ndbd default]` section of the cluster configuration file. The behavior of the cluster is unspecified when [`Arbitration`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-arbitration) is set to different values for individual data nodes.

* [`RestartSubscriberConnectTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-restartsubscriberconnecttimeout)

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter determines the time that a data node waits for subscribing API nodes to connect. Once this timeout expires, any “missing” API nodes are disconnected from the cluster. To disable this timeout, set `RestartSubscriberConnectTimeout` to 0.

  While this parameter is specified in milliseconds, the timeout itself is resolved to the next-greatest whole second.

The heartbeat interval between management nodes and data nodes is always 100 milliseconds, and is not configurable.

**Buffering and logging.** Several `[ndbd]` configuration parameters enable the advanced user to have more control over the resources used by node processes and to adjust various buffer sizes at need.

These buffers are used as front ends to the file system when writing log records to disk. If the node is running in diskless mode, these parameters can be set to their minimum values without penalty due to the fact that disk writes are “faked” by the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine's file system abstraction layer.

* [`UndoIndexBuffer`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-undoindexbuffer)

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter formerly set the size of the undo index buffer, but has no effect in current versions of NDB Cluster.

* [`UndoDataBuffer`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-undodatabuffer)

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter formerly set the size of the undo data buffer, but has no effect in current versions of NDB Cluster.

* [`RedoBuffer`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-redobuffer)

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  All update activities also need to be logged. The REDO log makes it possible to replay these updates whenever the system is restarted. The NDB recovery algorithm uses a “fuzzy” checkpoint of the data together with the UNDO log, and then applies the REDO log to play back all changes up to the restoration point.

  `RedoBuffer` sets the size of the buffer in which the REDO log is written. The default value is 32MB; the minimum value is 1MB.

  If this buffer is too small, the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine issues error code 1221 (REDO log buffers overloaded). For this reason, you should exercise care if you attempt to decrease the value of `RedoBuffer` as part of an online change in the cluster's configuration.

  [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") allocates a separate buffer for each LDM thread (see [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig)). For example, with 4 LDM threads, an [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") data node actually has 4 buffers and allocates `RedoBuffer` bytes to each one, for a total of `4 * RedoBuffer` bytes.

* [`EventLogBufferSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-eventlogbuffersize)

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Controls the size of the circular buffer used for NDB log events within data nodes.

**Controlling log messages.** In managing the cluster, it is very important to be able to control the number of log messages sent for various event types to `stdout`. For each event category, there are 16 possible event levels (numbered 0 through 15). Setting event reporting for a given event category to level 15 means all event reports in that category are sent to `stdout`; setting it to 0 means that there are no event reports made in that category.

By default, only the startup message is sent to `stdout`, with the remaining event reporting level defaults being set to 0. The reason for this is that these messages are also sent to the management server's cluster log.

An analogous set of levels can be set for the management client to determine which event levels to record in the cluster log.

* [`LogLevelStartup`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-loglevelstartup)

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The reporting level for events generated during startup of the process.

  The default level is 1.

* [`LogLevelShutdown`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-loglevelshutdown)

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The reporting level for events generated as part of graceful shutdown of a node.

  The default level is 0.

* [`LogLevelStatistic`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-loglevelstatistic)

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>Initial Node Restart: </strong></span>Requires a rolling restart of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The reporting level for statistical events such as number of primary key reads, number of updates, number of inserts, information relating to buffer usage, and so on.

  The default level is 0.

* [`LogLevelCheckpoint`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-loglevelcheckpoint)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The reporting level for events generated by local and global checkpoints.

  The default level is 0.

* [`LogLevelNodeRestart`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-loglevelnoderestart)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The reporting level for events generated during node restart.

  The default level is 0.

* [`LogLevelConnection`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-loglevelconnection)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The reporting level for events generated by connections between cluster nodes.

  The default level is 0.

* [`LogLevelError`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-loglevelerror)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The reporting level for events generated by errors and warnings by the cluster as a whole. These errors do not cause any node failure but are still considered worth reporting.

  The default level is 0.

* [`LogLevelCongestion`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-loglevelcongestion)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The reporting level for events generated by congestion. These errors do not cause node failure but are still considered worth reporting.

  The default level is 0.

* [`LogLevelInfo`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-loglevelinfo)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The reporting level for events generated for information about the general state of the cluster.

  The default level is 0.

* [`MemReportFrequency`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-memreportfrequency)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter controls how often data node memory usage reports are recorded in the cluster log; it is an integer value representing the number of seconds between reports.

  Each data node's data memory and index memory usage is logged as both a percentage and a number of 32 KB pages of the [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) and (NDB 7.5 and earlier) [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory), respectively, set in the `config.ini` file. For example, if [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) is equal to 100 MB, and a given data node is using 50 MB for data memory storage, the corresponding line in the cluster log might look like this:

  ```sql
  2006-12-24 01:18:16 [MgmSrvr] INFO -- Node 2: Data usage is 50%(1280 32K pages of total 2560)
  ```

  [`MemReportFrequency`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-memreportfrequency) is not a required parameter. If used, it can be set for all cluster data nodes in the `[ndbd default]` section of `config.ini`, and can also be set or overridden for individual data nodes in the corresponding `[ndbd]` sections of the configuration file. The minimum value—which is also the default value—is 0, in which case memory reports are logged only when memory usage reaches certain percentages (80%, 90%, and 100%), as mentioned in the discussion of statistics events in [Section 21.6.3.2, “NDB Cluster Log Events”](mysql-cluster-log-events.html "21.6.3.2 NDB Cluster Log Events").

* [`StartupStatusReportFrequency`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startupstatusreportfrequency)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  When a data node is started with the [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial), it initializes the redo log file during Start Phase 4 (see [Section 21.6.4, “Summary of NDB Cluster Start Phases”](mysql-cluster-start-phases.html "21.6.4 Summary of NDB Cluster Start Phases")). When very large values are set for [`NoOfFragmentLogFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nooffragmentlogfiles), [`FragmentLogFileSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-fragmentlogfilesize), or both, this initialization can take a long time.You can force reports on the progress of this process to be logged periodically, by means of the [`StartupStatusReportFrequency`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startupstatusreportfrequency) configuration parameter. In this case, progress is reported in the cluster log, in terms of both the number of files and the amount of space that have been initialized, as shown here:

  ```sql
  2009-06-20 16:39:23 [MgmSrvr] INFO -- Node 1: Local redo log file initialization status:
  #Total files: 80, Completed: 60
  #Total MBytes: 20480, Completed: 15557
  2009-06-20 16:39:23 [MgmSrvr] INFO -- Node 2: Local redo log file initialization status:
  #Total files: 80, Completed: 60
  #Total MBytes: 20480, Completed: 15570
  ```

  These reports are logged each [`StartupStatusReportFrequency`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startupstatusreportfrequency) seconds during Start Phase 4. If [`StartupStatusReportFrequency`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startupstatusreportfrequency) is 0 (the default), then reports are written to the cluster log only when at the beginning and at the completion of the redo log file initialization process.

##### Data Node Debugging Parameters

The following parameters are intended for use during testing or debugging of data nodes, and not for use in production.

* [`DictTrace`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-dicttrace)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  It is possible to cause logging of traces for events generated by creating and dropping tables using `DictTrace`. This parameter is useful only in debugging NDB kernel code. `DictTrace` takes an integer value. 0 disables logging; 1 enables it; setting this parameter to 2 enables logging of additional [`DBDICT`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbdict.html) debugging output (Bug #20368450).

* [`WatchDogImmediateKill`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-watchdogimmediatekill)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  In NDB 7.6.7 and later, you can cause threads to be killed immediately whenever watchdog issues occur by enabling the `WatchDogImmediateKill` data node configuration parameter. This parameter should be used only when debugging or troubleshooting, to obtain trace files reporting exactly what was occurring the instant that execution ceased.

**Backup parameters.** The `[ndbd]` parameters discussed in this section define memory buffers set aside for execution of online backups.

* [`BackupDataBufferSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupdatabuffersize)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  In creating a backup, there are two buffers used for sending data to the disk. The backup data buffer is used to fill in data recorded by scanning a node's tables. Once this buffer has been filled to the level specified as [`BackupWriteSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupwritesize), the pages are sent to disk. While flushing data to disk, the backup process can continue filling this buffer until it runs out of space. When this happens, the backup process pauses the scan and waits until some disk writes have completed freeing up memory so that scanning may continue.

* [`BackupDiskWriteSpeedPct`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupdiskwritespeedpct)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  During normal operation, data nodes attempt to maximize the disk write speed used for local checkpoints and backups while remaining within the bounds set by [`MinDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-mindiskwritespeed) and [`MaxDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeed). Disk write throttling gives each LDM thread an equal share of the total budget. This allows parallel LCPs to take place without exceeding the disk I/O budget. Because a backup is executed by only one LDM thread, this effectively caused a budget cut, resulting in longer backup completion times, and—if the rate of change is sufficiently high—in failure to complete the backup when the backup log buffer fill rate is higher than the achievable write rate.

  This problem can be addressed by using the `BackupDiskWriteSpeedPct` configuration parameter, which takes a value in the range 0-90 (inclusive) which is interpreted as the percentage of the node's maximum write rate budget that is reserved prior to sharing out the remainder of the budget among LDM threads for LCPs. The LDM thread running the backup receives the whole write rate budget for the backup, plus its (reduced) share of the write rate budget for local checkpoints. (This makes the disk write rate budget behave similarly to how it was handled in NDB Cluster 7.3 and earlier.)

  The default value for this parameter is 50 (interpreted as 50%).

* [`BackupLogBufferSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backuplogbuffersize)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The backup log buffer fulfills a role similar to that played by the backup data buffer, except that it is used for generating a log of all table writes made during execution of the backup. The same principles apply for writing these pages as with the backup data buffer, except that when there is no more space in the backup log buffer, the backup fails. For that reason, the size of the backup log buffer must be large enough to handle the load caused by write activities while the backup is being made. See [Section 21.6.8.3, “Configuration for NDB Cluster Backups”](mysql-cluster-backup-configuration.html "21.6.8.3 Configuration for NDB Cluster Backups").

  The default value for this parameter should be sufficient for most applications. In fact, it is more likely for a backup failure to be caused by insufficient disk write speed than it is for the backup log buffer to become full. If the disk subsystem is not configured for the write load caused by applications, the cluster is unlikely to be able to perform the desired operations.

  It is preferable to configure cluster nodes in such a manner that the processor becomes the bottleneck rather than the disks or the network connections.

  The default value for this parameter is 16MB.

* [`BackupMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupmemory)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter is deprecated, and subject to removal in a future version of NDB Cluster. Any setting made for it is ignored.

* [`BackupReportFrequency`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupreportfrequency)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter controls how often backup status reports are issued in the management client during a backup, as well as how often such reports are written to the cluster log (provided cluster event logging is configured to permit it—see [Logging and checkpointing](mysql-cluster-ndbd-definition.html#mysql-cluster-logging-and-checkpointing "Logging and checkpointing")). [`BackupReportFrequency`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupreportfrequency) represents the time in seconds between backup status reports.

  The default value is 0.

* [`BackupWriteSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupwritesize)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter specifies the default size of messages written to disk by the backup log and backup data buffers.

  The default value for this parameter is 256KB.

* [`BackupMaxWriteSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupmaxwritesize)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter specifies the maximum size of messages written to disk by the backup log and backup data buffers.

  The default value for this parameter is 1MB.

* [`CompressedBackup`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-compressedbackup)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Enabling this parameter causes backup files to be compressed. The compression used is equivalent to **gzip --fast**, and can save 50% or more of the space required on the data node to store uncompressed backup files. Compressed backups can be enabled for individual data nodes, or for all data nodes (by setting this parameter in the `[ndbd default]` section of the `config.ini` file).

  Important

  You cannot restore a compressed backup to a cluster running a MySQL version that does not support this feature.

  The default value is `0` (disabled).

Note

The location of the backup files is determined by the [`BackupDataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupdatadir) data node configuration parameter.

**Additional requirements.** When specifying these parameters, the following relationships must hold true. Otherwise, the data node cannot start.

* `BackupDataBufferSize >= BackupWriteSize + 188KB`

* `BackupLogBufferSize >= BackupWriteSize + 16KB`

* `BackupMaxWriteSize >= BackupWriteSize`

##### NDB Cluster Realtime Performance Parameters

The `[ndbd]` parameters discussed in this section are used in scheduling and locking of threads to specific CPUs on multiprocessor data node hosts.

Note

To make use of these parameters, the data node process must be run as system root.

* [`BuildIndexThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-buildindexthreads)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter determines the number of threads to create when rebuilding ordered indexes during a system or node start, as well as when running [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") [`--rebuild-indexes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_rebuild-indexes). It is supported only when there is more than one fragment for the table per data node (for example, when `COMMENT="NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_LDM_X_2"` is used with [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement")).

  Setting this parameter to 0 (the default) disables multithreaded building of ordered indexes.

  This parameter is supported when using [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") or [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)").

  You can enable multithreaded builds during data node initial restarts by setting the [`TwoPassInitialNodeRestartCopy`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-twopassinitialnoderestartcopy) data node configuration parameter to `TRUE`.

* [`LockExecuteThreadToCPU`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-lockexecutethreadtocpu)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  When used with [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon"), this parameter (now a string) specifies the ID of the CPU assigned to handle the [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") execution thread. When used with [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"), the value of this parameter is a comma-separated list of CPU IDs assigned to handle execution threads. Each CPU ID in the list should be an integer in the range 0 to 65535 (inclusive).

  The number of IDs specified should match the number of execution threads determined by [`MaxNoOfExecutionThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-maxnoofexecutionthreads). However, there is no guarantee that threads are assigned to CPUs in any given order when using this parameter. You can obtain more finely-grained control of this type using [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig).

  [`LockExecuteThreadToCPU`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-lockexecutethreadtocpu) has no default value.

* [`LockMaintThreadsToCPU`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-lockmaintthreadstocpu)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter specifies the ID of the CPU assigned to handle [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") maintenance threads.

  The value of this parameter is an integer in the range 0 to 65535 (inclusive). *There is no default value*.

* [`Numa`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-numa)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter determines whether Non-Uniform Memory Access (NUMA) is controlled by the operating system or by the data node process, whether the data node uses [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") or [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"). By default, `NDB` attempts to use an interleaved NUMA memory allocation policy on any data node where the host operating system provides NUMA support.

  Setting `Numa = 0` means that the datanode process does not itself attempt to set a policy for memory allocation, and permits this behavior to be determined by the operating system, which may be further guided by the separate **numactl** tool. That is, `Numa = 0` yields the system default behavior, which can be customised by **numactl**. For many Linux systems, the system default behavior is to allocate socket-local memory to any given process at allocation time. This can be problematic when using [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"); this is because **nbdmtd** allocates all memory at startup, leading to an imbalance, giving different access speeds for different sockets, especially when locking pages in main memory.

  Setting `Numa = 1` means that the data node process uses `libnuma` to request interleaved memory allocation. (This can also be accomplished manually, on the operating system level, using **numactl**.) Using interleaved allocation in effect tells the data node process to ignore non-uniform memory access but does not attempt to take any advantage of fast local memory; instead, the data node process tries to avoid imbalances due to slow remote memory. If interleaved allocation is not desired, set `Numa` to 0 so that the desired behavior can be determined on the operating system level.

  The `Numa` configuration parameter is supported only on Linux systems where `libnuma.so` is available.

* [`RealtimeScheduler`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-realtimescheduler)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Setting this parameter to 1 enables real-time scheduling of data node threads.

  The default is 0 (scheduling disabled).

* [`SchedulerExecutionTimer`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-schedulerexecutiontimer)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter specifies the time in microseconds for threads to be executed in the scheduler before being sent. Setting it to 0 minimizes the response time; to achieve higher throughput, you can increase the value at the expense of longer response times.

  The default is 50 μsec, which our testing shows to increase throughput slightly in high-load cases without materially delaying requests.

* [`SchedulerResponsiveness`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-schedulerresponsiveness)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Set the balance in the `NDB` scheduler between speed and throughput. This parameter takes an integer whose value is in the range 0-10 inclusive, with 5 as the default. Higher values provide better response times relative to throughput. Lower values provide increased throughput at the expense of longer response times.

* [`SchedulerSpinTimer`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-schedulerspintimer)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter specifies the time in microseconds for threads to be executed in the scheduler before sleeping.

  The default value is 0.

* [`TwoPassInitialNodeRestartCopy`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-twopassinitialnoderestartcopy)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Multithreaded building of ordered indexes can be enabled for initial restarts of data nodes by setting this configuration parameter to `true`, which enables two-pass copying of data during initial node restarts. In NDB 7.6, this is the default value (Bug #26704312, Bug #27109117).

  You must also set [`BuildIndexThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-buildindexthreads) to a nonzero value.

**Multi-Threading Configuration Parameters (ndbmtd).** [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") runs by default as a single-threaded process and must be configured to use multiple threads, using either of two methods, both of which require setting configuration parameters in the `config.ini` file. The first method is simply to set an appropriate value for the [`MaxNoOfExecutionThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-maxnoofexecutionthreads) configuration parameter. A second method makes it possible to set up more complex rules for [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") multithreading using [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig). The next few paragraphs provide information about these parameters and their use with multithreaded data nodes.

* `MaxNoOfExecutionThreads`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter directly controls the number of execution threads used by [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"), up to a maximum of 72. Although this parameter is set in `[ndbd]` or `[ndbd default]` sections of the `config.ini` file, it is exclusive to [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") and does not apply to [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon").

  Setting `MaxNoOfExecutionThreads` sets the number of threads for each type as determined by a matrix in the file `storage/ndb/src/kernel/vm/mt_thr_config.cpp`. This table shows these numbers of threads for possible values of `MaxNoOfExecutionThreads`.

  **Table 21.11 MaxNoOfExecutionThreads values and the corresponding number of threads by thread type (LQH, TC, Send, Receive).**

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  There is always one SUMA (replication) thread.

  [`NoOfFragmentLogParts`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-nooffragmentlogparts) should be set equal to the number of LDM threads used by [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"), as determined by the setting for this parameter. This ratio should not be any greater than 4:1; beginning with NDB 7.5.7, a configuration in which this is the case is specifically disallowed. (Bug #25333414)

  The number of LDM threads also determines the number of partitions used by an `NDB` table that is not explicitly partitioned; this is the number of LDM threads times the number of data nodes in the cluster. (If [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") is used on the data nodes rather than [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"), then there is always a single LDM thread; in this case, the number of partitions created automatically is simply equal to the number of data nodes. See [Section 21.2.2, “NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions”](mysql-cluster-nodes-groups.html "21.2.2 NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions"), for more information.

  Adding large tablespaces for Disk Data tables when using more than the default number of LDM threads may cause issues with resource and CPU usage if the disk page buffer is insufficiently large; see the description of the [`DiskPageBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskpagebuffermemory) configuration parameter, for more information.

  The thread types are described later in this section (see [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig)).

  Setting this parameter outside the permitted range of values causes the management server to abort on startup with the error Error line *`number`*: Illegal value *`value`* for parameter MaxNoOfExecutionThreads.

  For `MaxNoOfExecutionThreads`, a value of 0 or 1 is rounded up internally by [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") to 2, so that 2 is considered this parameter's default and minimum value.

  `MaxNoOfExecutionThreads` is generally intended to be set equal to the number of CPU threads available, and to allocate a number of threads of each type suitable to typical workloads. It does not assign particular threads to specified CPUs. For cases where it is desirable to vary from the settings provided, or to bind threads to CPUs, you should use [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig) instead, which allows you to allocate each thread directly to a desired type, CPU, or both.

  The multithreaded data node process always spawns, at a minimum, the threads listed here:

  + 1 local query handler (LDM) thread
  + 1 receive thread
  + 1 subscription manager (SUMA or replication) thread

  For a `MaxNoOfExecutionThreads` value of 8 or less, no TC threads are created, and TC handling is instead performed by the main thread.

  Prior to NDB 7.6, changing the number of LDM threads always requires a system restart, whether it is changed using this parameter or [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig). In NDB 7.6 and later it is possible to effect the change using a node initial restart (*NI*) provided the following conditions are met:

  + If, following the change, the number of LDM threads remains the same as before, nothing more than a simple node restart (rolling restart, or *N*) is required to implement the change.

  + Otherwise (that is, if the number of LDM threads changes), it is still possible to effect the change using a node initial restart (*NI*) provided the following two conditions are met:

    1. Each LDM thread handles a maximum of 8 fragments, and

    2. The total number of table fragments is an integer multiple of the number of LDM threads.

  Prior to NDB 7.6, if the cluster's [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory) usage is greater than 50%, changing this requires an initial restart of the cluster. (A maximum of 30-35% `IndexMemory` usage is recommended in such cases.) Otherwise, resource usage and LDM thread allocation cannot be balanced between nodes, which can result in underutilized and overutilized LDM threads, and ultimately data node failures. In NDB 7.6 and later, an initial restart is *not* required to effect a change in this parameter.

* `MaxSendDelay`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter can be used to cause data nodes to wait momentarily before sending data to API nodes; in some circumstances, described in the following paragraphs, this can result in more efficient sending of larger volumes of data and higher overall throughput.

  `MaxSendDelay` can be useful when there are a great many API nodes at saturation point or close to it, which can result in waves of increasing and decreasing performance. This occurs when the data nodes are able to send results back to the API nodes relatively quickly, with many small packets to process, which can take longer to process per byte compared to large packets, thus slowing down the API nodes; later, the data nodes start sending larger packets again.

  To handle this type of scenario, you can set `MaxSendDelay` to a nonzero value, which helps to ensure that responses are not sent back to the API nodes so quickly. When this is done, responses are sent immediately when there is no other competing traffic, but when there is, setting `MaxSendDelay` causes the data nodes to wait long enough to ensure that they send larger packets. In effect, this introduces an artificial bottleneck into the send process, which can actually improve throughput significantly.

* `NoOfFragmentLogParts`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Set the number of log file groups for redo logs belonging to this [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"). The value of this parameter should be set equal to the number of LDM threads used by [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") as determined by the setting for [`MaxNoOfExecutionThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-maxnoofexecutionthreads). Beginning with NDB 7.5.7, a configuration using more than 4 redo log parts per LDM is disallowed. (Bug #25333414)

  See the description of [`MaxNoOfExecutionThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-maxnoofexecutionthreads) for more information.

* `ThreadConfig`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter is used with [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") to assign threads of different types to different CPUs. Its value is a string whose format has the following syntax:

  ```sql
  ThreadConfig := entry[,entry[,...]]

  entry := type={param[,param[,...]]}

  type := ldm | main | recv | send | rep | io | tc | watchdog | idxbld

  param := count=number
    | cpubind=cpu_list
    | cpuset=cpu_list
    | spintime=number
    | realtime={0|1}
    | nosend={0|1}
    | thread_prio={0..10}
    | cpubind_exclusive=cpu_list
    | cpuset_exclusive=cpu_list
  ```

  The curly braces (`{`...`}`) surrounding the list of parameters are required, even if there is only one parameter in the list.

  A *`param`* (parameter) specifies any or all of the following information:

  + The number of threads of the given type (`count`).

  + The set of CPUs to which the threads of the given type are to be nonexclusively bound. This is determined by either one of `cpubind` or `cpuset`). `cpubind` causes each thread to be bound (nonexclusively) to a CPU in the set; `cpuset` means that each thread is bound (nonexclusively) to the set of CPUs specified.

    On Solaris, you can instead specify a set of CPUs to which the threads of the given type are to be bound exclusively. `cpubind_exclusive` causes each thread to be bound exclusively to a CPU in the set; `cpuset_exclsuive` means that each thread is bound exclusively to the set of CPUs specified.

    Only one of `cpubind`, `cpuset`, `cpubind_exclusive`, or `cpuset_exclusive` can be provided in a single configuration.

  + `spintime` determines the wait time in microseconds the thread spins before going to sleep.

    The default value for `spintime` is the value of the [`SchedulerSpinTimer`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-schedulerspintimer) data node configuration parameter.

    `spintime` does not apply to I/O threads, watchdog, or offline index build threads, and so cannot be set for these thread types.

  + `realtime` can be set to 0 or 1. If it is set to 1, the threads run with real-time priority. This also means that `thread_prio` cannot be set.

    The `realtime` parameter is set by default to the value of the [`RealtimeScheduler`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-realtimescheduler) data node configuration parameter.

    `realtime` cannot be set for offline index build threads.

  + By setting `nosend` to 1, you can prevent a `main`, `ldm`, `rep`, or `tc` thread from assisting the send threads. This parameter is 0 by default, and cannot be used with other types of threads.

  + `thread_prio` is a thread priority level that can be set from 0 to 10, with 10 representing the greatest priority. The default is 5. The precise effects of this parameter are platform-specific, and are described later in this section.

    The thread priority level cannot be set for offline index build threads.

  **thread_prio settings and effects by platform.** The implementation of `thread_prio` differs between Linux/FreeBSD, Solaris, and Windows. In the following list, we discuss its effects on each of these platforms in turn:

  + *Linux and FreeBSD*: We map `thread_prio` to a value to be supplied to the `nice` system call. Since a lower niceness value for a process indicates a higher process priority, increasing `thread_prio` has the effect of lowering the `nice` value.

    **Table 21.12 Mapping of thread_prio to nice values on Linux and FreeBSD**

    <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

    Some operating systems may provide for a maximum process niceness level of 20, but this is not supported by all targeted versions; for this reason, we choose 19 as the maximum `nice` value that can be set.

  + *Solaris*: Setting `thread_prio` on Solaris sets the Solaris FX priority, with mappings as shown in the following table:

    **Table 21.13 Mapping of thread_prio to FX priority on Solaris**

    <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

    A `thread_prio` setting of 9 is mapped on Solaris to the special FX priority value 59, which means that the operating system also attempts to force the thread to run alone on its own CPU core.

  + *Windows*: We map `thread_prio` to a Windows thread priority value passed to the Windows API `SetThreadPriority()` function. This mapping is shown in the following table:

    **Table 21.14 Mapping of thread_prio to Windows thread priority**

    <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The *`type`* attribute represents an NDB thread type. The thread types supported, and the range of permitted `count` values for each, are provided in the following list:

  + `ldm`: Local query handler ([`DBLQH`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dblqh.html) kernel block) that handles data. The more LDM threads that are used, the more highly partitioned the data becomes. Each LDM thread maintains its own sets of data and index partitions, as well as its own redo log. The value set for `ldm` must be one of the values 1, 2, 4, 6, 8, 12, 16, 24, or 32.

    Changing the number of LDM threads normally requires an initial system restart to be effective and safe for cluster operations. This requirement is relaxed in NDB 7.6, as explained later in this section. (This is also true when this is done using [`MaxNoOfExecutionThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-maxnoofexecutionthreads).) *NDB 7.5 and earlier*: If [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory) usage is in excess of 50%, an initial restart of the cluster is required; a maximum of 30-35% `IndexMemory` usage is recommended in such cases. Otherwise, allocation of memory and LDM threads cannot be balanced between nodes, which can ultimately lead to data node failures.

    Adding large tablespaces (hundreds of gigabytes or more) for Disk Data tables when using more than the default number of LDMs may cause issues with resource and CPU usage if [`DiskPageBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskpagebuffermemory) is not sufficiently large.

  + `tc`: Transaction coordinator thread ([`DBTC`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtc.html) kernel block) containing the state of an ongoing transaction. The maximum number of TC threads is 32.

    Optimally, every new transaction can be assigned to a new TC thread. In most cases 1 TC thread per 2 LDM threads is sufficient to guarantee that this can happen. In cases where the number of writes is relatively small when compared to the number of reads, it is possible that only 1 TC thread per 4 LQH threads is required to maintain transaction states. Conversely, in applications that perform a great many updates, it may be necessary for the ratio of TC threads to LDM threads to approach 1 (for example, 3 TC threads to 4 LDM threads).

    Setting `tc` to 0 causes TC handling to be done by the main thread. In most cases, this is effectively the same as setting it to 1.

    Range: 0 - 32

  + `main`: Data dictionary and transaction coordinator ([`DBDIH`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbdih.html) and [`DBTC`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtc.html) kernel blocks), providing schema management. This is always handled by a single dedicated thread.

    Range: 1 only.

  + `recv`: Receive thread ([`CMVMI`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-cmvmi.html) kernel block). Each receive thread handles one or more sockets for communicating with other nodes in an NDB Cluster, with one socket per node. NDB Cluster supports multiple receive threads; the maximum is 16 such threads.

    Range: 1 - 16

  + `send`: Send thread ([`CMVMI`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-cmvmi.html) kernel block). To increase throughput, it is possible to perform sends from one or more separate, dedicated threads (maximum 8).

    Previously, all threads handled their own sending directly; this can still be made to happen by setting the number of send threads to 0 (this also happens when [`MaxNoOfExecutionThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-maxnoofexecutionthreads) is set less than 10). While doing so can have an adeverse impact on throughput, it can also in some cases provide decreased latency.

    Range: 0 - 16

  + `rep`: Replication thread ([`SUMA`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-suma.html) kernel block). Asynchronous replication operations are always handled by a single, dedicated thread.

    Range: 1 only.

  + `io`: File system and other miscellaneous operations. These are not demanding tasks, and are always handled as a group by a single, dedicated I/O thread.

    Range: 1 only.

  + `watchdog`: Parameters settings associated with this type are actually applied to several threads, each having a specific use. These threads include the `SocketServer` thread, which receives connection setups from other nodes; the `SocketClient` thread, which attempts to set up connections to other nodes; and the thread watchdog thread that checks that threads are progressing.

    Range: 1 only.

  + `idxbld`: Offline index build threads. Unlike the other thread types listed previously, which are permanent, these are temporary threads which are created and used only during node or system restarts, or when running [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") [`--rebuild-indexes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_rebuild-indexes). They may be bound to CPU sets which overlap with CPU sets bound to permanent thread types.

    `thread_prio`, `realtime`, and `spintime` values cannot be set for offline index build threads. In addition, `count` is ignored for this type of thread.

    If `idxbld` is not specified, the default behavior is as follows:

    - Offline index build threads are not bound if the I/O thread is also not bound, and these threads use any available cores.

    - If the I/O thread is bound, then the offline index build threads are bound to the entire set of bound threads, due to the fact that there should be no other tasks for these threads to perform.

    Range: 0 - 1.

    This thread type was added in NDB 7.6. (Bug #25835748, Bug #26928111)

  Prior to NDB 7.6, changing `ThreadCOnfig` requires a system initial restart. In NDB 7.6 (and later), this requirement can be relaxed under certain circumstances:

  + If, following the change, the number of LDM threads remains the same as before, nothing more than a simple node restart (rolling restart, or *N*) is required to implement the change.

  + Otherwise (that is, if the number of LDM threads changes), it is still possible to effect the change using a node initial restart (*NI*) provided the following two conditions are met:

    1. Each LDM thread handles a maximum of 8 fragments, and

    2. The total number of table fragments is an integer multiple of the number of LDM threads.

  In any other case, a system initial restart is needed to change this parameter.

  NDB 7.6 can distinguish between thread types by both of the following criteria:

  + Whether the thread is an execution thread. Threads of type `main`, `ldm`, `recv`, `rep`, `tc`, and `send` are execution threads; `io`, `watchdog`, and `idxbld` threads are not considered execution threads.

  + Whether the allocation of threads to a given task is permanent or temporary. Currently all thread types except `idxbld` are considered permanent; `idxbld` threads are regarded as temporary threads.

  Simple examples:

  ```sql
  # Example 1.

  ThreadConfig=ldm={count=2,cpubind=1,2},main={cpubind=12},rep={cpubind=11}

  # Example 2.

  Threadconfig=main={cpubind=0},ldm={count=4,cpubind=1,2,5,6},io={cpubind=3}
  ```

  It is usually desirable when configuring thread usage for a data node host to reserve one or more number of CPUs for operating system and other tasks. Thus, for a host machine with 24 CPUs, you might want to use 20 CPU threads (leaving 4 for other uses), with 8 LDM threads, 4 TC threads (half the number of LDM threads), 3 send threads, 3 receive threads, and 1 thread each for schema management, asynchronous replication, and I/O operations. (This is almost the same distribution of threads used when [`MaxNoOfExecutionThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-maxnoofexecutionthreads) is set equal to 20.) The following `ThreadConfig` setting performs these assignments, additionally binding all of these threads to specific CPUs:

  ```sql
  ThreadConfig=ldm{count=8,cpubind=1,2,3,4,5,6,7,8},main={cpubind=9},io={cpubind=9}, \
  rep={cpubind=10},tc{count=4,cpubind=11,12,13,14},recv={count=3,cpubind=15,16,17}, \
  send{count=3,cpubind=18,19,20}
  ```

  It should be possible in most cases to bind the main (schema management) thread and the I/O thread to the same CPU, as we have done in the example just shown.

  The following example incorporates groups of CPUs defined using both `cpuset` and `cpubind`, as well as use of thread prioritization.

  ```sql
  ThreadConfig=ldm={count=4,cpuset=0-3,thread_prio=8,spintime=200}, \
  ldm={count=4,cpubind=4-7,thread_prio=8,spintime=200}, \
  tc={count=4,cpuset=8-9,thread_prio=6},send={count=2,thread_prio=10,cpubind=10-11}, \
  main={count=1,cpubind=10},rep={count=1,cpubind=11}
  ```

  In this case we create two LDM groups; the first uses `cpubind` and the second uses `cpuset`. `thread_prio` and `spintime` are set to the same values for each group. This means there are eight LDM threads in total. (You should ensure that [`NoOfFragmentLogParts`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-nooffragmentlogparts) is also set to 8.) The four TC threads use only two CPUs; it is possible when using `cpuset` to specify fewer CPUs than threads in the group. (This is not true for `cpubind`.) The send threads use two threads using `cpubind` to bind these threads to CPUs 10 and 11. The main and rep threads can reuse these CPUs.

  This example shows how `ThreadConfig` and `NoOfFragmentLogParts` might be set up for a 24-CPU host with hyperthreading, leaving CPUs 10, 11, 22, and 23 available for operating system functions and interrupts:

  ```sql
  NoOfFragmentLogParts=10
  ThreadConfig=ldm={count=10,cpubind=0-4,12-16,thread_prio=9,spintime=200}, \
  tc={count=4,cpuset=6-7,18-19,thread_prio=8},send={count=1,cpuset=8}, \
  recv={count=1,cpuset=20},main={count=1,cpuset=9,21},rep={count=1,cpuset=9,21}, \
  io={count=1,cpuset=9,21,thread_prio=8},watchdog={count=1,cpuset=9,21,thread_prio=9}
  ```

  The next few examples include settings for `idxbld`. The first two of these demonstrate how a CPU set defined for `idxbld` can overlap those specified for other (permanent) thread types, the first using `cpuset` and the second using `cpubind`:

  ```sql
  ThreadConfig=main,ldm={count=4,cpuset=1-4},tc={count=4,cpuset=5,6,7}, \
  io={cpubind=8},idxbld={cpuset=1-8}

  ThreadConfig=main,ldm={count=1,cpubind=1},idxbld={count=1,cpubind=1}
  ```

  The next example specifies a CPU for the I/O thread, but not for the index build threads:

  ```sql
  ThreadConfig=main,ldm={count=4,cpuset=1-4},tc={count=4,cpuset=5,6,7}, \
  io={cpubind=8}
  ```

  Since the `ThreadConfig` setting just shown locks threads to eight cores numbered 1 through 8, it is equivalent to the setting shown here:

  ```sql
  ThreadConfig=main,ldm={count=4,cpuset=1-4},tc={count=4,cpuset=5,6,7}, \
  io={cpubind=8},idxbld={cpuset=1,2,3,4,5,6,7,8}
  ```

  In order to take advantage of the enhanced stability that the use of `ThreadConfig` offers, it is necessary to insure that CPUs are isolated, and that they not subject to interrupts, or to being scheduled for other tasks by the operating system. On many Linux systems, you can do this by setting `IRQBALANCE_BANNED_CPUS` in `/etc/sysconfig/irqbalance` to `0xFFFFF0`, and by using the `isolcpus` boot option in `grub.conf`. For specific information, see your operating system or platform documentation.

**Disk Data Configuration Parameters.** Configuration parameters affecting Disk Data behavior include the following:

* [`DiskPageBufferEntries`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskpagebufferentries)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This is the number of page entries (page references) to allocate. It is specified as a number of 32K pages in [`DiskPageBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskpagebuffermemory). The default is sufficient for most cases but you may need to increase the value of this parameter if you encounter problems with very large transactions on Disk Data tables. Each page entry requires approximately 100 bytes.

* [`DiskPageBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskpagebuffermemory)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This determines the amount of space used for caching pages on disk, and is set in the `[ndbd]` or `[ndbd default]` section of the `config.ini` file. It is measured in bytes. Each page takes up 32 KB. This means that NDB Cluster Disk Data storage always uses *`N`* \* 32 KB memory where *`N`* is some nonnegative integer.

  The default value for this parameter is `64M` (2000 pages of 32 KB each).

  If the value for `DiskPageBufferMemory` is set too low in conjunction with using more than the default number of LDM threads in [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig) (for example `{ldm=6...}`), problems can arise when trying to add a large (for example 500G) data file to a disk-based `NDB` table, wherein the process takes indefinitely long while occupying one of the CPU cores.

  This is due to the fact that, as part of adding a data file to a tablespace, extent pages are locked into memory in an extra PGMAN worker thread, for quick metadata access. When adding a large file, this worker has insufficient memory for all of the data file metadata. In such cases, you should either increase `DiskPageBufferMemory`, or add smaller tablespace files. You may also need to adjust [`DiskPageBufferEntries`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskpagebufferentries).

  You can query the [`ndbinfo.diskpagebuffer`](mysql-cluster-ndbinfo-diskpagebuffer.html "21.6.15.20 The ndbinfo diskpagebuffer Table") table to help determine whether the value for this parameter should be increased to minimize unnecessary disk seeks. See [Section 21.6.15.20, “The ndbinfo diskpagebuffer Table”](mysql-cluster-ndbinfo-diskpagebuffer.html "21.6.15.20 The ndbinfo diskpagebuffer Table"), for more information.

* [`SharedGlobalMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-sharedglobalmemory)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter determines the amount of memory that is used for log buffers, disk operations (such as page requests and wait queues), and metadata for tablespaces, log file groups, `UNDO` files, and data files. The shared global memory pool also provides memory used for satisfying the memory requirements of the `UNDO_BUFFER_SIZE` option used with [`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement") and [`ALTER LOGFILE GROUP`](alter-logfile-group.html "13.1.5 ALTER LOGFILE GROUP Statement") statements, including any default value implied for this options by the setting of the [`InitialLogFileGroup`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-initiallogfilegroup) data node configuration parameter. `SharedGlobalMemory` can be set in the `[ndbd]` or `[ndbd default]` section of the `config.ini` configuration file, and is measured in bytes.

  The default value is `128M`.

* [`DiskIOThreadPool`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskiothreadpool)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter determines the number of unbound threads used for Disk Data file access. Before [`DiskIOThreadPool`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskiothreadpool) was introduced, exactly one thread was spawned for each Disk Data file, which could lead to performance issues, particularly when using very large data files. With [`DiskIOThreadPool`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskiothreadpool), you can—for example—access a single large data file using several threads working in parallel.

  This parameter applies to Disk Data I/O threads only.

  The optimum value for this parameter depends on your hardware and configuration, and includes these factors:

  + **Physical distribution of Disk Data files.** You can obtain better performance by placing data files, undo log files, and the data node file system on separate physical disks. If you do this with some or all of these sets of files, then you can set [`DiskIOThreadPool`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskiothreadpool) higher to enable separate threads to handle the files on each disk.

  + **Disk performance and types.** The number of threads that can be accommodated for Disk Data file handling is also dependent on the speed and throughput of the disks. Faster disks and higher throughput allow for more disk I/O threads. Our test results indicate that solid-state disk drives can handle many more disk I/O threads than conventional disks, and thus higher values for [`DiskIOThreadPool`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskiothreadpool).

  The default value for this parameter is 2.

* **Disk Data file system parameters.** The parameters in the following list make it possible to place NDB Cluster Disk Data files in specific directories without the need for using symbolic links.

  + [`FileSystemPathDD`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempathdd)

    <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

    If this parameter is specified, then NDB Cluster Disk Data data files and undo log files are placed in the indicated directory. This can be overridden for data files, undo log files, or both, by specifying values for [`FileSystemPathDataFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempathdatafiles), [`FileSystemPathUndoFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempathundofiles), or both, as explained for these parameters. It can also be overridden for data files by specifying a path in the `ADD DATAFILE` clause of a [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement") or [`ALTER TABLESPACE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement") statement, and for undo log files by specifying a path in the `ADD UNDOFILE` clause of a [`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement") or [`ALTER LOGFILE GROUP`](alter-logfile-group.html "13.1.5 ALTER LOGFILE GROUP Statement") statement. If [`FileSystemPathDD`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempathdd) is not specified, then [`FileSystemPath`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempath) is used.

    If a [`FileSystemPathDD`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempathdd) directory is specified for a given data node (including the case where the parameter is specified in the `[ndbd default]` section of the `config.ini` file), then starting that data node with `--initial` causes all files in the directory to be deleted.

  + [`FileSystemPathDataFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempathdatafiles)

    <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

    If this parameter is specified, then NDB Cluster Disk Data data files are placed in the indicated directory. This overrides any value set for [`FileSystemPathDD`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempathdd). This parameter can be overridden for a given data file by specifying a path in the `ADD DATAFILE` clause of a [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement") or [`ALTER TABLESPACE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement") statement used to create that data file. If [`FileSystemPathDataFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempathdatafiles) is not specified, then [`FileSystemPathDD`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempathdd) is used (or [`FileSystemPath`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempath), if [`FileSystemPathDD`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempathdd) has also not been set).

    If a [`FileSystemPathDataFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempathdatafiles) directory is specified for a given data node (including the case where the parameter is specified in the `[ndbd default]` section of the `config.ini` file), then starting that data node with `--initial` causes all files in the directory to be deleted.

  + [`FileSystemPathUndoFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempathundofiles)

    <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

    If this parameter is specified, then NDB Cluster Disk Data undo log files are placed in the indicated directory. This overrides any value set for [`FileSystemPathDD`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempathdd). This parameter can be overridden for a given data file by specifying a path in the `ADD UNDO` clause of a [`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement") or [`ALTER LOGFILE GROUP`](alter-logfile-group.html "13.1.5 ALTER LOGFILE GROUP Statement") statement used to create that data file. If [`FileSystemPathUndoFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempathundofiles) is not specified, then [`FileSystemPathDD`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempathdd) is used (or [`FileSystemPath`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempath), if [`FileSystemPathDD`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempathdd) has also not been set).

    If a [`FileSystemPathUndoFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempathundofiles) directory is specified for a given data node (including the case where the parameter is specified in the `[ndbd default]` section of the `config.ini` file), then starting that data node with `--initial` causes all files in the directory to be deleted.

  For more information, see [Section 21.6.11.1, “NDB Cluster Disk Data Objects”](mysql-cluster-disk-data-objects.html "21.6.11.1 NDB Cluster Disk Data Objects").

* **Disk Data object creation parameters.** The next two parameters enable you—when starting the cluster for the first time—to cause a Disk Data log file group, tablespace, or both, to be created without the use of SQL statements.

  + [`InitialLogFileGroup`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-initiallogfilegroup)

    <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

    This parameter can be used to specify a log file group that is created when performing an initial start of the cluster. [`InitialLogFileGroup`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-initiallogfilegroup) is specified as shown here:

    ```sql
    InitialLogFileGroup = [name=name;] [undo_buffer_size=size;] file-specification-list

    file-specification-list:
        file-specification[; file-specification[; ...]]

    file-specification:
        filename:size
    ```

    The `name` of the log file group is optional and defaults to `DEFAULT-LG`. The `undo_buffer_size` is also optional; if omitted, it defaults to `64M`. Each *`file-specification`* corresponds to an undo log file, and at least one must be specified in the *`file-specification-list`*. Undo log files are placed according to any values that have been set for [`FileSystemPath`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempath), [`FileSystemPathDD`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempathdd), and [`FileSystemPathUndoFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempathundofiles), just as if they had been created as the result of a [`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement") or [`ALTER LOGFILE GROUP`](alter-logfile-group.html "13.1.5 ALTER LOGFILE GROUP Statement") statement.

    Consider the following:

    ```sql
    InitialLogFileGroup = name=LG1; undo_buffer_size=128M; undo1.log:250M; undo2.log:150M
    ```

    This is equivalent to the following SQL statements:

    ```sql
    CREATE LOGFILE GROUP LG1
        ADD UNDOFILE 'undo1.log'
        INITIAL_SIZE 250M
        UNDO_BUFFER_SIZE 128M
        ENGINE NDBCLUSTER;

    ALTER LOGFILE GROUP LG1
        ADD UNDOFILE 'undo2.log'
        INITIAL_SIZE 150M
        ENGINE NDBCLUSTER;
    ```

    This logfile group is created when the data nodes are started with `--initial`.

    Resources for the initial log file group are added to the global memory pool along with those indicated by the value of [`SharedGlobalMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-sharedglobalmemory).

    This parameter, if used, should always be set in the `[ndbd default]` section of the `config.ini` file. The behavior of an NDB Cluster when different values are set on different data nodes is not defined.

  + [`InitialTablespace`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-initialtablespace)

    <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

    This parameter can be used to specify an NDB Cluster Disk Data tablespace that is created when performing an initial start of the cluster. [`InitialTablespace`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-initialtablespace) is specified as shown here:

    ```sql
    InitialTablespace = [name=name;] [extent_size=size;] file-specification-list
    ```

    The `name` of the tablespace is optional and defaults to `DEFAULT-TS`. The `extent_size` is also optional; it defaults to `1M`. The *`file-specification-list`* uses the same syntax as shown with the [`InitialLogfileGroup`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-initiallogfilegroup) parameter, the only difference being that each *`file-specification`* used with [`InitialTablespace`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-initialtablespace) corresponds to a data file. At least one must be specified in the *`file-specification-list`*. Data files are placed according to any values that have been set for [`FileSystemPath`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempath), [`FileSystemPathDD`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempathdd), and [`FileSystemPathDataFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempathdatafiles), just as if they had been created as the result of a [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement") or [`ALTER TABLESPACE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement") statement.

    For example, consider the following line specifying [`InitialTablespace`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-initialtablespace) in the `[ndbd default]` section of the `config.ini` file (as with [`InitialLogfileGroup`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-initiallogfilegroup), this parameter should always be set in the `[ndbd default]` section, as the behavior of an NDB Cluster when different values are set on different data nodes is not defined):

    ```sql
    InitialTablespace = name=TS1; extent_size=8M; data1.dat:2G; data2.dat:4G
    ```

    This is equivalent to the following SQL statements:

    ```sql
    CREATE TABLESPACE TS1
        ADD DATAFILE 'data1.dat'
        EXTENT_SIZE 8M
        INITIAL_SIZE 2G
        ENGINE NDBCLUSTER;

    ALTER TABLESPACE TS1
        ADD DATAFILE 'data2.dat'
        INITIAL_SIZE 4G
        ENGINE NDBCLUSTER;
    ```

    This tablespace is created when the data nodes are started with `--initial`, and can be used whenever creating NDB Cluster Disk Data tables thereafter.

**Disk Data and GCP Stop errors.**

Errors encountered when using Disk Data tables such as Node *`nodeid`* killed this node because GCP stop was detected (error 2303) are often referred to as “GCP stop errors”. Such errors occur when the redo log is not flushed to disk quickly enough; this is usually due to slow disks and insufficient disk throughput.

You can help prevent these errors from occurring by using faster disks, and by placing Disk Data files on a separate disk from the data node file system. Reducing the value of [`TimeBetweenGlobalCheckpoints`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenglobalcheckpoints) tends to decrease the amount of data to be written for each global checkpoint, and so may provide some protection against redo log buffer overflows when trying to write a global checkpoint; however, reducing this value also permits less time in which to write the GCP, so this must be done with caution.

In addition to the considerations given for [`DiskPageBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskpagebuffermemory) as explained previously, it is also very important that the [`DiskIOThreadPool`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskiothreadpool) configuration parameter be set correctly; having [`DiskIOThreadPool`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskiothreadpool) set too high is very likely to cause GCP stop errors (Bug #37227).

GCP stops can be caused by save or commit timeouts; the [`TimeBetweenEpochsTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-timebetweenepochstimeout) data node configuration parameter determines the timeout for commits. However, it is possible to disable both types of timeouts by setting this parameter to 0.

**Parameters for configuring send buffer memory allocation.** Send buffer memory is allocated dynamically from a memory pool shared between all transporters, which means that the size of the send buffer can be adjusted as necessary. (Previously, the NDB kernel used a fixed-size send buffer for every node in the cluster, which was allocated when the node started and could not be changed while the node was running.) The [`TotalSendBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-totalsendbuffermemory) and [`OverLoadLimit`](mysql-cluster-tcp-definition.html#ndbparam-tcp-overloadlimit) data node configuration parameters permit the setting of limits on this memory allocation. For more information about the use of these parameters (as well as [`SendBufferMemory`](mysql-cluster-tcp-definition.html#ndbparam-tcp-sendbuffermemory)), see [Section 21.4.3.13, “Configuring NDB Cluster Send Buffer Parameters”](mysql-cluster-config-send-buffers.html "21.4.3.13 Configuring NDB Cluster Send Buffer Parameters").

* [`ExtraSendBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-extrasendbuffermemory)

  This parameter specifies the amount of transporter send buffer memory to allocate in addition to any set using [`TotalSendBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-totalsendbuffermemory), [`SendBufferMemory`](mysql-cluster-tcp-definition.html#ndbparam-tcp-sendbuffermemory), or both.

* [`TotalSendBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-totalsendbuffermemory)

  This parameter is used to determine the total amount of memory to allocate on this node for shared send buffer memory among all configured transporters.

  If this parameter is set, its minimum permitted value is 256KB; 0 indicates that the parameter has not been set. For more detailed information, see [Section 21.4.3.13, “Configuring NDB Cluster Send Buffer Parameters”](mysql-cluster-config-send-buffers.html "21.4.3.13 Configuring NDB Cluster Send Buffer Parameters").

See also [Section 21.6.7, “Adding NDB Cluster Data Nodes Online”](mysql-cluster-online-add-node.html "21.6.7 Adding NDB Cluster Data Nodes Online").

**Redo log over-commit handling.** It is possible to control a data node's handling of operations when too much time is taken flushing redo logs to disk. This occurs when a given redo log flush takes longer than [`RedoOverCommitLimit`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-redoovercommitlimit) seconds, more than [`RedoOverCommitCounter`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-redoovercommitcounter) times, causing any pending transactions to be aborted. When this happens, the API node that sent the transaction can handle the operations that should have been committed either by queuing the operations and re-trying them, or by aborting them, as determined by [`DefaultOperationRedoProblemAction`](mysql-cluster-api-definition.html#ndbparam-api-defaultoperationredoproblemaction). The data node configuration parameters for setting the timeout and number of times it may be exceeded before the API node takes this action are described in the following list:

* [`RedoOverCommitCounter`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-redoovercommitcounter)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  When [`RedoOverCommitLimit`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-redoovercommitlimit) is exceeded when trying to write a given redo log to disk this many times or more, any transactions that were not committed as a result are aborted, and an API node where any of these transactions originated handles the operations making up those transactions according to its value for [`DefaultOperationRedoProblemAction`](mysql-cluster-api-definition.html#ndbparam-api-defaultoperationredoproblemaction) (by either queuing the operations to be re-tried, or aborting them).

* [`RedoOverCommitLimit`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-redoovercommitlimit)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter sets an upper limit in seconds for trying to write a given redo log to disk before timing out. The number of times the data node tries to flush this redo log, but takes longer than `RedoOverCommitLimit`, is kept and compared with [`RedoOverCommitCounter`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-redoovercommitcounter), and when flushing takes too long more times than the value of that parameter, any transactions that were not committed as a result of the flush timeout are aborted. When this occurs, the API node where any of these transactions originated handles the operations making up those transactions according to its [`DefaultOperationRedoProblemAction`](mysql-cluster-api-definition.html#ndbparam-api-defaultoperationredoproblemaction) setting (it either queues the operations to be re-tried, or aborts them).

**Controlling restart attempts.** It is possible to exercise finely-grained control over restart attempts by data nodes when they fail to start using the [`MaxStartFailRetries`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxstartfailretries) and [`StartFailRetryDelay`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startfailretrydelay) data node configuration parameters.

[`MaxStartFailRetries`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxstartfailretries) limits the total number of retries made before giving up on starting the data node, [`StartFailRetryDelay`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startfailretrydelay) sets the number of seconds between retry attempts. These parameters are listed here:

* [`StartFailRetryDelay`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startfailretrydelay)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Use this parameter to set the number of seconds between restart attempts by the data node in the event on failure on startup. The default is 0 (no delay).

  Both this parameter and [`MaxStartFailRetries`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxstartfailretries) are ignored unless [`StopOnError`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-stoponerror) is equal to 0.

* [`MaxStartFailRetries`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxstartfailretries)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Use this parameter to limit the number restart attempts made by the data node in the event that it fails on startup. The default is 3 attempts.

  Both this parameter and [`StartFailRetryDelay`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startfailretrydelay) are ignored unless [`StopOnError`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-stoponerror) is equal to 0.

**NDB index statistics parameters.**

The parameters in the following list relate to NDB index statistics generation.

* [`IndexStatAutoCreate`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexstatautocreate)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Enable (set equal to 1) or disable (set equal to 0) automatic statistics collection when indexes are created.

* [`IndexStatAutoUpdate`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexstatautoupdate)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Enable (set equal to 1) or disable (set equal to 0) monitoring of indexes for changes, and trigger automatic statistics updates when these are detected. The degree of change needed to trigger the updates are determined by the settings for the [`IndexStatTriggerPct`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexstattriggerpct) and [`IndexStatTriggerScale`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexstattriggerscale) options.

* [`IndexStatSaveSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexstatsavesize)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Maximum space in bytes allowed for the saved statistics of any given index in the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") system tables and in the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") memory cache. In NDB 7.5 and earlier, this consumes [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory).

  At least one sample is always produced, regardless of any size limit. This size is scaled by [`IndexStatSaveScale`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexstatsavescale).

  The size specified by [`IndexStatSaveSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexstatsavesize) is scaled by the value of `IndexStatTriggerPct` for a large index, times 0.01. This is further multiplied by the logarithm to the base 2 of the index size. Setting `IndexStatTriggerPct` equal to 0 disables the scaling effect.

* [`IndexStatSaveScale`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexstatsavescale)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The size specified by [`IndexStatSaveSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexstatsavesize) is scaled by the value of `IndexStatTriggerPct` for a large index, times 0.01. This is further multiplied by the logarithm to the base 2 of the index size. Setting `IndexStatTriggerPct` equal to 0 disables the scaling effect.

* [`IndexStatTriggerPct`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexstattriggerpct)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Percentage change in updates that triggers an index statistics update. The value is scaled by [`IndexStatTriggerScale`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexstattriggerscale). You can disable this trigger altogether by setting `IndexStatTriggerPct` to 0.

* [`IndexStatTriggerScale`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexstattriggerscale)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Scale [`IndexStatTriggerPct`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexstattriggerpct) by this amount times 0.01 for a large index. A value of 0 disables scaling.

* [`IndexStatUpdateDelay`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexstatupdatedelay)

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Minimum delay in seconds between automatic index statistics updates for a given index. Setting this variable to 0 disables any delay. The default is 60 seconds.

**Restart types.** Information about the restart types used by the parameter descriptions in this section is shown in the following table:

**Table 21.15 NDB Cluster restart types**

<table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>
