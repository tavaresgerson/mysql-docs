## 21.4 Configuration of NDB Cluster

A MySQL server that is part of an NDB Cluster differs in one chief respect from a normal (nonclustered) MySQL server, in that it employs the `NDB` storage engine. This engine is also referred to sometimes as `NDBCLUSTER`, although `NDB` is preferred.

To avoid unnecessary allocation of resources, the server is configured by default with the `NDB` storage engine disabled. To enable `NDB`, you must modify the server's `my.cnf` configuration file, or start the server with the `--ndbcluster` option.

This MySQL server is a part of the cluster, so it also must know how to access a management node to obtain the cluster configuration data. The default behavior is to look for the management node on `localhost`. However, should you need to specify that its location is elsewhere, this can be done in `my.cnf`, or with the **mysql** client. Before the `NDB` storage engine can be used, at least one management node must be operational, as well as any desired data nodes.

For more information about `--ndbcluster` and other `mysqld` options specific to NDB Cluster, see Section 21.4.3.9.1, “MySQL Server Options for NDB Cluster”.

For general information about installing NDB Cluster, see Section 21.3, “NDB Cluster Installation”.


### 21.4.1 Quick Test Setup of NDB Cluster

To familiarize you with the basics, we describe the simplest possible configuration for a functional NDB Cluster. After this, you should be able to design your desired setup from the information provided in the other relevant sections of this chapter.

First, you need to create a configuration directory such as `/var/lib/mysql-cluster`, by executing the following command as the system `root` user:

```sql
$> mkdir /var/lib/mysql-cluster
```

In this directory, create a file named `config.ini` that contains the following information. Substitute appropriate values for `HostName` and `DataDir` as necessary for your system.

```sql
# file "config.ini" - showing minimal setup consisting of 1 data node,
# 1 management server, and 3 MySQL servers.
# The empty default sections are not required, and are shown only for
# the sake of completeness.
# Data nodes must provide a hostname but MySQL Servers are not required
# to do so.
# If you do not know the hostname for your machine, use localhost.
# The DataDir parameter also has a default value, but it is recommended to
# set it explicitly.
# [api] and [mgm] are aliases for [mysqld] and [ndb_mgmd], respectively.

[ndbd default]
NoOfReplicas= 1

[mysqld  default]
[ndb_mgmd default]
[tcp default]

[ndb_mgmd]
HostName= myhost.example.com

[ndbd]
HostName= myhost.example.com
DataDir= /var/lib/mysql-cluster

[mysqld]
[mysqld]
[mysqld]
```

You can now start the **ndb\_mgmd** management server. By default, it attempts to read the `config.ini` file in its current working directory, so change location into the directory where the file is located and then invoke **ndb\_mgmd**:

```sql
$> cd /var/lib/mysql-cluster
$> ndb_mgmd
```

Then start a single data node by running **ndbd**:

```sql
$> ndbd
```

By default, **ndbd** looks for the management server at `localhost` on port 1186.

Note

If you have installed MySQL from a binary tarball, you must specify the path of the **ndb\_mgmd** and **ndbd** servers explicitly. (Normally, these can be found in `/usr/local/mysql/bin`.)

Finally, change location to the MySQL data directory (usually `/var/lib/mysql` or `/usr/local/mysql/data`), and make sure that the `my.cnf` file contains the option necessary to enable the NDB storage engine:

```sql
[mysqld]
ndbcluster
```

You can now start the MySQL server as usual:

```sql
$> mysqld_safe --user=mysql &
```

Wait a moment to make sure the MySQL server is running properly. If you see the notice `mysql ended`, check the server's `.err` file to find out what went wrong.

If all has gone well so far, you now can start using the cluster. Connect to the server and verify that the `NDBCLUSTER` storage engine is enabled:

```sql
$> mysql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 1 to server version: 5.7.44

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql> SHOW ENGINES\G
...
*************************** 12. row ***************************
Engine: NDBCLUSTER
Support: YES
Comment: Clustered, fault-tolerant, memory-based tables
*************************** 13. row ***************************
Engine: NDB
Support: YES
Comment: Alias for NDBCLUSTER
...
```

The row numbers shown in the preceding example output may be different from those shown on your system, depending upon how your server is configured.

Try to create an `NDBCLUSTER` table:

```sql
$> mysql
mysql> USE test;
Database changed

mysql> CREATE TABLE ctest (i INT) ENGINE=NDBCLUSTER;
Query OK, 0 rows affected (0.09 sec)

mysql> SHOW CREATE TABLE ctest \G
*************************** 1. row ***************************
       Table: ctest
Create Table: CREATE TABLE `ctest` (
  `i` int(11) default NULL
) ENGINE=ndbcluster DEFAULT CHARSET=latin1
1 row in set (0.00 sec)
```

To check that your nodes were set up properly, start the management client:

```sql
$> ndb_mgm
```

Use the **SHOW** command from within the management client to obtain a report on the cluster's status:

```sql
ndb_mgm> SHOW
Cluster Configuration
---------------------
[ndbd(NDB)]     1 node(s)
id=2    @127.0.0.1  (Version: 5.7.44-ndb-7.5.36, Nodegroup: 0, *)

[ndb_mgmd(MGM)] 1 node(s)
id=1    @127.0.0.1  (Version: 5.7.44-ndb-7.5.36)

[mysqld(API)]   3 node(s)
id=3    @127.0.0.1  (Version: 5.7.44-ndb-7.5.36)
id=4 (not connected, accepting connect from any host)
id=5 (not connected, accepting connect from any host)
```

At this point, you have successfully set up a working NDB Cluster . You can now store data in the cluster by using any table created with `ENGINE=NDBCLUSTER` or its alias `ENGINE=NDB`.


### 21.4.2 Overview of NDB Cluster Configuration Parameters, Options, and Variables

The next several sections provide summary tables of NDB Cluster node configuration parameters used in the `config.ini` file to govern various aspects of node behavior, as well as of options and variables read by `mysqld` from a `my.cnf` file or from the command line when run as an NDB Cluster process. Each of the node parameter tables lists the parameters for a given type (`ndbd`, `ndb_mgmd`, `mysqld`, `computer`, `tcp`, or `shm`). All tables include the data type for the parameter, option, or variable, as well as its default, mimimum, and maximum values as applicable.

**Considerations when restarting nodes.** For node parameters, these tables also indicate what type of restart is required (node restart or system restart)—and whether the restart must be done with `--initial`—to change the value of a given configuration parameter. When performing a node restart or an initial node restart, all of the cluster's data nodes must be restarted in turn (also referred to as a rolling restart). It is possible to update cluster configuration parameters marked as `node` online—that is, without shutting down the cluster—in this fashion. An initial node restart requires restarting each **ndbd** process with the `--initial` option.

A system restart requires a complete shutdown and restart of the entire cluster. An initial system restart requires taking a backup of the cluster, wiping the cluster file system after shutdown, and then restoring from the backup following the restart.

In any cluster restart, all of the cluster's management servers must be restarted for them to read the updated configuration parameter values.

Important

Values for numeric cluster parameters can generally be increased without any problems, although it is advisable to do so progressively, making such adjustments in relatively small increments. Many of these can be increased online, using a rolling restart.

However, decreasing the values of such parameters—whether this is done using a node restart, node initial restart, or even a complete system restart of the cluster—is not to be undertaken lightly; it is recommended that you do so only after careful planning and testing. This is especially true with regard to those parameters that relate to memory usage and disk space, such as `MaxNoOfTables`, `MaxNoOfOrderedIndexes`, and `MaxNoOfUniqueHashIndexes`. In addition, it is the generally the case that configuration parameters relating to memory and disk usage can be raised using a simple node restart, but they require an initial node restart to be lowered.

Because some of these parameters can be used for configuring more than one type of cluster node, they may appear in more than one of the tables.

Note

`4294967039` often appears as a maximum value in these tables. This value is defined in the `NDBCLUSTER` sources as `MAX_INT_RNIL` and is equal to `0xFFFFFEFF`, or `232 − 28 − 1`.


#### 21.4.2.1 NDB Cluster Data Node Configuration Parameters

The listings in this section provide information about parameters used in the `[ndbd]` or `[ndbd default]` sections of a `config.ini` file for configuring NDB Cluster data nodes. For detailed descriptions and other additional information about each of these parameters, see Section 21.4.3.6, “Defining NDB Cluster Data Nodes”.

These parameters also apply to **ndbmtd**"), the multithreaded version of **ndbd**. A separate listing of parameters specific to **ndbmtd**") follows.

* `ApiFailureHandlingTimeout`: Maximum time for API node failure handling before escalating. 0 means no time limit; minimum usable value is 10.

* `Arbitration`: How arbitration should be performed to avoid split-brain issues in event of node failure.

* `ArbitrationTimeout`: Maximum time (milliseconds) database partition waits for arbitration signal.

* `BackupDataBufferSize`: Default size of databuffer for backup (in bytes).

* `BackupDataDir`: Path to where to store backups. Note that string '/BACKUP' is always appended to this setting, so that \*effective\* default is FileSystemPath/BACKUP.

* `BackupDiskWriteSpeedPct`: Sets percentage of data node's allocated maximum write speed (MaxDiskWriteSpeed) to reserve for LCPs when starting backup.

* `BackupLogBufferSize`: Default size of log buffer for backup (in bytes).

* `BackupMaxWriteSize`: Maximum size of file system writes made by backup (in bytes).

* `BackupMemory`: Total memory allocated for backups per node (in bytes).

* `BackupReportFrequency`: Frequency of backup status reports during backup in seconds.

* `BackupWriteSize`: Default size of file system writes made by backup (in bytes).

* `BatchSizePerLocalScan`: Used to calculate number of lock records for scan with hold lock.

* `BuildIndexThreads`: Number of threads to use for building ordered indexes during system or node restart. Also applies when running ndb\_restore --rebuild-indexes. Setting this parameter to 0 disables multithreaded building of ordered indexes.

* `CompressedBackup`: Use zlib to compress backups as they are written.

* `CompressedLCP`: Write compressed LCPs using zlib.

* `ConnectCheckIntervalDelay`: Time between data node connectivity check stages. Data node is considered suspect after 1 interval and dead after 2 intervals with no response.

* `CrashOnCorruptedTuple`: When enabled, forces node to shut down whenever it detects corrupted tuple.

* `DataDir`: Data directory for this node.

* `DataMemory`: Number of bytes on each data node allocated for storing data; subject to available system RAM and size of IndexMemory.

* `DefaultHashMapSize`: Set size (in buckets) to use for table hash maps. Three values are supported: 0, 240, and 3840.

* `DictTrace`: Enable DBDICT debugging; for NDB development.

* `DiskIOThreadPool`: Number of unbound threads for file access, applies to disk data only.

* `Diskless`: Run without using disk.

* `DiskPageBufferEntries`: Memory to allocate in DiskPageBufferMemory; very large disk transactions may require increasing this value.

* `DiskPageBufferMemory`: Number of bytes on each data node allocated for disk page buffer cache.

* `DiskSyncSize`: Amount of data written to file before synch is forced.

* `EnablePartialLcp`: Enable partial LCP (true); if this is disabled (false), all LCPs write full checkpoints.

* `EnableRedoControl`: Enable adaptive checkpointing speed for controlling redo log usage.

* `EventLogBufferSize`: Size of circular buffer for NDB log events within data nodes.

* `ExecuteOnComputer`: String referencing earlier defined COMPUTER.

* `ExtraSendBufferMemory`: Memory to use for send buffers in addition to any allocated by TotalSendBufferMemory or SendBufferMemory. Default (0) allows up to 16MB.

* `FileSystemPath`: Path to directory where data node stores its data (directory must exist).

* `FileSystemPathDataFiles`: Path to directory where data node stores its Disk Data files. Default value is FilesystemPathDD, if set; otherwise, FilesystemPath is used if it is set; otherwise, value of DataDir is used.

* `FileSystemPathDD`: Path to directory where data node stores its Disk Data and undo files. Default value is FileSystemPath, if set; otherwise, value of DataDir is used.

* `FileSystemPathUndoFiles`: Path to directory where data node stores its undo files for Disk Data. Default value is FilesystemPathDD, if set; otherwise, FilesystemPath is used if it is set; otherwise, value of DataDir is used.

* `FragmentLogFileSize`: Size of each redo log file.

* `HeartbeatIntervalDbApi`: Time between API node-data node heartbeats. (API connection closed after 3 missed heartbeats).

* `HeartbeatIntervalDbDb`: Time between data node-to-data node heartbeats; data node considered dead after 3 missed heartbeats.

* `HeartbeatOrder`: Sets order in which data nodes check each others' heartbeats for determining whether given node is still active and connected to cluster. Must be zero for all data nodes or distinct nonzero values for all data nodes; see documentation for further guidance.

* `HostName`: Host name or IP address for this data node.

* `IndexMemory`: Number of bytes on each data node allocated for storing indexes; subject to available system RAM and size of DataMemory.

* `IndexStatAutoCreate`: Enable/disable automatic statistics collection when indexes are created.

* `IndexStatAutoUpdate`: Monitor indexes for changes and trigger automatic statistics updates.

* `IndexStatSaveScale`: Scaling factor used in determining size of stored index statistics.

* `IndexStatSaveSize`: Maximum size in bytes for saved statistics per index.

* `IndexStatTriggerPct`: Threshold percent change in DML operations for index statistics updates. Value is scaled down by IndexStatTriggerScale.

* `IndexStatTriggerScale`: Scale down IndexStatTriggerPct by this amount, multiplied by base 2 logarithm of index size, for large index. Set to 0 to disable scaling.

* `IndexStatUpdateDelay`: Minimum delay between automatic index statistics updates for given index. 0 means no delay.

* `InitFragmentLogFiles`: Initialize fragment log files, using sparse or full format.

* `InitialLogFileGroup`: Describes log file group that is created during initial start. See documentation for format.

* `InitialNoOfOpenFiles`: Initial number of files open per data node. (One thread is created per file).

* `InitialTablespace`: Describes tablespace that is created during initial start. See documentation for format.

* `InsertRecoveryWork`: Percentage of RecoveryWork used for inserted rows; has no effect unless partial local checkpoints are in use.

* `LateAlloc`: Allocate memory after connection to management server has been established.

* `LcpScanProgressTimeout`: Maximum time that local checkpoint fragment scan can be stalled before node is shut down to ensure systemwide LCP progress. Use 0 to disable.

* `LocationDomainId`: Assign this data node to specific availability domain or zone. 0 (default) leaves this unset.

* `LockExecuteThreadToCPU`: Comma-delimited list of CPU IDs.

* `LockMaintThreadsToCPU`: CPU ID indicating which CPU runs maintenance threads.

* `LockPagesInMainMemory`: 0=disable locking, 1=lock after memory allocation, 2=lock before memory allocation.

* `LogLevelCheckpoint`: Log level of local and global checkpoint information printed to stdout.

* `LogLevelCongestion`: Level of congestion information printed to stdout.

* `LogLevelConnection`: Level of node connect/disconnect information printed to stdout.

* `LogLevelError`: Transporter, heartbeat errors printed to stdout.

* `LogLevelInfo`: Heartbeat and log information printed to stdout.

* `LogLevelNodeRestart`: Level of node restart and node failure information printed to stdout.

* `LogLevelShutdown`: Level of node shutdown information printed to stdout.

* `LogLevelStartup`: Level of node startup information printed to stdout.

* `LogLevelStatistic`: Level of transaction, operation, and transporter information printed to stdout.

* `LongMessageBuffer`: Number of bytes allocated on each data node for internal long messages.

* `MaxAllocate`: No longer used; has no effect.

* `MaxBufferedEpochs`: Allowed numbered of epochs that subscribing node can lag behind (unprocessed epochs). Exceeding causes lagging subscribers to be disconnected.

* `MaxBufferedEpochBytes`: Total number of bytes allocated for buffering epochs.

* `MaxDiskWriteSpeed`: Maximum number of bytes per second that can be written by LCP and backup when no restarts are ongoing.

* `MaxDiskWriteSpeedOtherNodeRestart`: Maximum number of bytes per second that can be written by LCP and backup when another node is restarting.

* `MaxDiskWriteSpeedOwnRestart`: Maximum number of bytes per second that can be written by LCP and backup when this node is restarting.

* `MaxFKBuildBatchSize`: Maximum scan batch size to use for building foreign keys. Increasing this value may speed up builds of foreign keys but impacts ongoing traffic as well.

* `MaxDMLOperationsPerTransaction`: Limit size of transaction; aborts transaction if it requires more than this many DML operations.

* `MaxLCPStartDelay`: Time in seconds that LCP polls for checkpoint mutex (to allow other data nodes to complete metadata synchronization), before putting itself in lock queue for parallel recovery of table data.

* `MaxNoOfAttributes`: Suggests total number of attributes stored in database (sum over all tables).

* `MaxNoOfConcurrentIndexOperations`: Total number of index operations that can execute simultaneously on one data node.

* `MaxNoOfConcurrentOperations`: Maximum number of operation records in transaction coordinator.

* `MaxNoOfConcurrentScans`: Maximum number of scans executing concurrently on data node.

* `MaxNoOfConcurrentSubOperations`: Maximum number of concurrent subscriber operations.

* `MaxNoOfConcurrentTransactions`: Maximum number of transactions executing concurrently on this data node, total number of transactions that can be executed concurrently is this value times number of data nodes in cluster.

* `MaxNoOfFiredTriggers`: Total number of triggers that can fire simultaneously on one data node.

* `MaxNoOfLocalOperations`: Maximum number of operation records defined on this data node.

* `MaxNoOfLocalScans`: Maximum number of fragment scans in parallel on this data node.

* `MaxNoOfOpenFiles`: Maximum number of files open per data node.(One thread is created per file).

* `MaxNoOfOrderedIndexes`: Total number of ordered indexes that can be defined in system.

* `MaxNoOfSavedMessages`: Maximum number of error messages to write in error log and maximum number of trace files to retain.

* `MaxNoOfSubscribers`: Maximum number of subscribers.

* `MaxNoOfSubscriptions`: Maximum number of subscriptions (default 0 = MaxNoOfTables).

* `MaxNoOfTables`: Suggests total number of NDB tables stored in database.

* `MaxNoOfTriggers`: Total number of triggers that can be defined in system.

* `MaxNoOfUniqueHashIndexes`: Total number of unique hash indexes that can be defined in system.

* `MaxParallelCopyInstances`: Number of parallel copies during node restarts. Default is 0, which uses number of LDMs on both nodes, to maximum of 16.

* `MaxParallelScansPerFragment`: Maximum number of parallel scans per fragment. Once this limit is reached, scans are serialized.

* `MaxReorgBuildBatchSize`: Maximum scan batch size to use for reorganization of table partitions. Increasing this value may speed up table partition reorganization but impacts ongoing traffic as well.

* `MaxStartFailRetries`: Maximum retries when data node fails on startup, requires StopOnError = 0. Setting to 0 causes start attempts to continue indefinitely.

* `MaxUIBuildBatchSize`: Maximum scan batch size to use for building unique keys. Increasing this value may speed up builds of unique keys but impacts ongoing traffic as well.

* `MemReportFrequency`: Frequency of memory reports in seconds; 0 = report only when exceeding percentage limits.

* `MinDiskWriteSpeed`: Minimum number of bytes per second that can be written by LCP and backup.

* `MinFreePct`: Percentage of memory resources to keep in reserve for restarts.

* `NodeGroup`: Node group to which data node belongs; used only during initial start of cluster.

* `NodeId`: Number uniquely identifying data node among all nodes in cluster.

* `NoOfFragmentLogFiles`: Number of 16 MB redo log files in each of 4 file sets belonging to data node.

* `NoOfReplicas`: Number of copies of all data in database.

* `Numa`: (Linux only; requires libnuma) Controls NUMA support. Setting to 0 permits system to determine use of interleaving by data node process; 1 means that it is determined by data node.

* `ODirect`: Use O\_DIRECT file reads and writes when possible.

* `ODirectSyncFlag`: O\_DIRECT writes are treated as synchronized writes; ignored when ODirect is not enabled, InitFragmentLogFiles is set to SPARSE, or both.

* `RealtimeScheduler`: When true, data node threads are scheduled as real-time threads. Default is false.

* `RecoveryWork`: Percentage of storage overhead for LCP files: greater value means less work in normal operations, more work during recovery.

* `RedoBuffer`: Number of bytes on each data node allocated for writing redo logs.

* `RedoOverCommitCounter`: When RedoOverCommitLimit has been exceeded this many times, transactions are aborted, and operations are handled as specified by DefaultOperationRedoProblemAction.

* `RedoOverCommitLimit`: Each time that flushing current redo buffer takes longer than this many seconds, number of times that this has happened is compared to RedoOverCommitCounter.

* `ReservedSendBufferMemory`: This parameter is present in NDB code but is not enabled.

* `RestartOnErrorInsert`: Control type of restart caused by inserting error (when StopOnError is enabled).

* `RestartSubscriberConnectTimeout`: Amount of time for data node to wait for subscribing API nodes to connect. Set to 0 to disable timeout, which is always resolved to nearest full second.

* `SchedulerExecutionTimer`: Number of microseconds to execute in scheduler before sending.

* `SchedulerResponsiveness`: Set NDB scheduler response optimization 0-10; higher values provide better response time but lower throughput.

* `SchedulerSpinTimer`: Number of microseconds to execute in scheduler before sleeping.

* `ServerPort`: Port used to set up transporter for incoming connections from API nodes.

* `SharedGlobalMemory`: Total number of bytes on each data node allocated for any use.

* `StartFailRetryDelay`: Delay in seconds after start failure prior to retry; requires StopOnError = 0.

* `StartFailureTimeout`: Milliseconds to wait before terminating. (0=Wait forever).

* `StartNoNodeGroupTimeout`: Time to wait for nodes without nodegroup before trying to start (0=forever).

* `StartPartialTimeout`: Milliseconds to wait before trying to start without all nodes. (0=Wait forever).

* `StartPartitionedTimeout`: Milliseconds to wait before trying to start partitioned. (0=Wait forever).

* `StartupStatusReportFrequency`: Frequency of status reports during startup.

* `StopOnError`: When set to 0, data node automatically restarts and recovers following node failures.

* `StringMemory`: Default size of string memory (0 to 100 = % of maximum, 101+ = actual bytes).

* `TcpBind_INADDR_ANY`: Bind IP\_ADDR\_ANY so that connections can be made from anywhere (for autogenerated connections).

* `TimeBetweenEpochs`: Time between epochs (synchronization used for replication).

* `TimeBetweenEpochsTimeout`: Timeout for time between epochs. Exceeding causes node shutdown.

* `TimeBetweenGlobalCheckpoints`: Time between group commits of transactions to disk.

* `TimeBetweenGlobalCheckpointsTimeout`: Minimum timeout for group commit of transactions to disk.

* `TimeBetweenInactiveTransactionAbortCheck`: Time between checks for inactive transactions.

* `TimeBetweenLocalCheckpoints`: Time between taking snapshots of database (expressed in base-2 logarithm of bytes).

* `TimeBetweenWatchDogCheck`: Time between execution checks inside data node.

* `TimeBetweenWatchDogCheckInitial`: Time between execution checks inside data node (early start phases when memory is allocated).

* `TotalSendBufferMemory`: Total memory to use for all transporter send buffers..

* `TransactionBufferMemory`: Dynamic buffer space (in bytes) for key and attribute data allocated for each data node.

* `TransactionDeadlockDetectionTimeout`: Time transaction can spend executing within data node. This is time that transaction coordinator waits for each data node participating in transaction to execute request. If data node takes more than this amount of time, transaction is aborted.

* `TransactionInactiveTimeout`: Milliseconds that application waits before executing another part of transaction. This is time transaction coordinator waits for application to execute or send another part (query, statement) of transaction. If application takes too much time, then transaction is aborted. Timeout = 0 means that application never times out.

* `TwoPassInitialNodeRestartCopy`: Copy data in 2 passes during initial node restart, which enables multithreaded building of ordered indexes for such restarts.

* `UndoDataBuffer`: Unused; has no effect.

* `UndoIndexBuffer`: Unused; has no effect.

* `UseShm`: Use shared memory connections between this data node and API node also running on this host.

* `WatchDogImmediateKill`: When true, threads are immediately killed whenever watchdog issues occur; used for testing and debugging.

The following parameters are specific to **ndbmtd**"):

* `MaxNoOfExecutionThreads`: For ndbmtd only, specify maximum number of execution threads.

* `MaxSendDelay`: Maximum number of microseconds to delay sending by ndbmtd.

* `NoOfFragmentLogParts`: Number of redo log file groups belonging to this data node.

* `ThreadConfig`: Used for configuration of multithreaded data nodes (ndbmtd). Default is empty string; see documentation for syntax and other information.


#### 21.4.2.2 NDB Cluster Management Node Configuration Parameters

The listing in this section provides information about parameters used in the `[ndb_mgmd]` or `[mgm]` section of a `config.ini` file for configuring NDB Cluster management nodes. For detailed descriptions and other additional information about each of these parameters, see Section 21.4.3.5, “Defining an NDB Cluster Management Server”.

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

After making changes in a management node's configuration, it is necessary to perform a rolling restart of the cluster for the new configuration to take effect. See Section 21.4.3.5, “Defining an NDB Cluster Management Server”, for more information.

To add new management servers to a running NDB Cluster, it is also necessary perform a rolling restart of all cluster nodes after modifying any existing `config.ini` files. For more information about issues arising when using multiple management nodes, see Section 21.2.7.10, “Limitations Relating to Multiple NDB Cluster Nodes”.


#### 21.4.2.3 NDB Cluster SQL Node and API Node Configuration Parameters

The listing in this section provides information about parameters used in the `[mysqld]` and `[api]` sections of a `config.ini` file for configuring NDB Cluster SQL nodes and API nodes. For detailed descriptions and other additional information about each of these parameters, see Section 21.4.3.7, “Defining SQL and Other API Nodes in an NDB Cluster”.

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

For a discussion of MySQL server options for NDB Cluster, see Section 21.4.3.9.1, “MySQL Server Options for NDB Cluster”. For information about MySQL server system variables relating to NDB Cluster, see Section 21.4.3.9.2, “NDB Cluster System Variables”.

Note

To add new SQL or API nodes to the configuration of a running NDB Cluster, it is necessary to perform a rolling restart of all cluster nodes after adding new `[mysqld]` or `[api]` sections to the `config.ini` file (or files, if you are using more than one management server). This must be done before the new SQL or API nodes can connect to the cluster.

It is *not* necessary to perform any restart of the cluster if new SQL or API nodes can employ previously unused API slots in the cluster configuration to connect to the cluster.


#### 21.4.2.4 Other NDB Cluster Configuration Parameters

The listings in this section provide information about parameters used in the `[computer]`, `[tcp]`, and `[shm]` sections of a `config.ini` file for configuring NDB Cluster. For detailed descriptions and additional information about individual parameters, see Section 21.4.3.10, “NDB Cluster TCP/IP Connections”, or Section 21.4.3.12, “NDB Cluster Shared Memory Connections”, as appropriate.

The following parameters apply to the `config.ini` file's `[computer]` section:

* `HostName`: Host name or IP address of this computer.

* `Id`: Unique identifier for this computer.

The following parameters apply to the `config.ini` file's `[tcp]` section:

* `Checksum`: If checksum is enabled, all signals between nodes are checked for errors.

* `Group`: Used for group proximity; smaller value is interpreted as being closer.

* `HostName1`: Name or IP address of first of two computers joined by TCP connection.

* `HostName2`: Name or IP address of second of two computers joined by TCP connection.

* `NodeId1`: ID of node (data node, API node, or management node) on one side of connection.

* `NodeId2`: ID of node (data node, API node, or management node) on one side of connection.

* `NodeIdServer`: Set server side of TCP connection.

* `OverloadLimit`: When more than this many unsent bytes are in send buffer, connection is considered overloaded.

* `PortNumber`: Port used for TCP transporter.

* `PreSendChecksum`: If this parameter and Checksum are both enabled, perform pre-send checksum checks, and check all TCP signals between nodes for errors.

* `Proxy`: ....

* `ReceiveBufferMemory`: Bytes of buffer for signals received by this node.

* `SendBufferMemory`: Bytes of TCP buffer for signals sent from this node.

* `SendSignalId`: Sends ID in each signal. Used in trace files. Defaults to true in debug builds.

* `TCP_MAXSEG_SIZE`: Value used for TCP\_MAXSEG.

* `TCP_RCV_BUF_SIZE`: Value used for SO\_RCVBUF.

* `TCP_SND_BUF_SIZE`: Value used for SO\_SNDBUF.

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

* `PortNumber`: Port used for SHM transporter.

* `PreSendChecksum`: If this parameter and Checksum are both enabled, perform pre-send checksum checks, and check all SHM signals between nodes for errors.

* `SendBufferMemory`: Bytes in shared memory buffer for signals sent from this node.

* `SendSignalId`: Sends ID in each signal. Used in trace files.

* `ShmKey`: Shared memory key; when set to 1, this is calculated by NDB.

* `ShmSpinTime`: When receiving, number of microseconds to spin before sleeping.

* `ShmSize`: Size of shared memory segment.

* `Signum`: Signal number to be used for signalling.


#### 21.4.2.5 NDB Cluster mysqld Option and Variable Reference

The following list includes command-line options, system variables, and status variables applicable within `mysqld` when it is running as an SQL node in an NDB Cluster. For a reference to *all* command-line options, system variables, and status variables used with or relating to `mysqld`, see Section 5.1.3, “Server Option, System Variable, and Status Variable Reference”.

* `Com_show_ndb_status`: Count of SHOW NDB STATUS statements.

* `Handler_discover`: Number of times that tables have been discovered.

* `ndb-batch-size`: Size (in bytes) to use for NDB transaction batches.

* `ndb-blob-read-batch-bytes`: Specifies size in bytes that large BLOB reads should be batched into. 0 = no limit.

* `ndb-blob-write-batch-bytes`: Specifies size in bytes that large BLOB writes should be batched into. 0 = no limit.

* `ndb-cluster-connection-pool`: Number of connections to cluster used by MySQL.

* `ndb-cluster-connection-pool-nodeids`: Comma-separated list of node IDs for connections to cluster used by MySQL; number of nodes in list must match value set for --ndb-cluster-connection-pool.

* `ndb-connectstring`: Address of NDB management server distributing configuration information for this cluster.

* `ndb-default-column-format`: Use this value (FIXED or DYNAMIC) by default for COLUMN\_FORMAT and ROW\_FORMAT options when creating or adding table columns.

* `ndb-deferred-constraints`: Specifies that constraint checks on unique indexes (where these are supported) should be deferred until commit time. Not normally needed or used; for testing purposes only.

* `ndb-distribution`: Default distribution for new tables in NDBCLUSTER (KEYHASH or LINHASH, default is KEYHASH).

* `ndb-log-apply-status`: Cause MySQL server acting as replica to log mysql.ndb\_apply\_status updates received from its immediate source in its own binary log, using its own server ID. Effective only if server is started with --ndbcluster option.

* `ndb-log-empty-epochs`: When enabled, causes epochs in which there were no changes to be written to ndb\_apply\_status and ndb\_binlog\_index tables, even when --log-slave-updates is enabled.

* `ndb-log-empty-update`: When enabled, causes updates that produced no changes to be written to ndb\_apply\_status and ndb\_binlog\_index tables, even when --log-slave-updates is enabled.

* `ndb-log-exclusive-reads`: Log primary key reads with exclusive locks; allow conflict resolution based on read conflicts.

* `ndb-log-fail-terminate`: Terminate mysqld process if complete logging of all found row events is not possible.

* `ndb-log-orig`: Log originating server id and epoch in mysql.ndb\_binlog\_index table.

* `ndb-log-transaction-id`: Write NDB transaction IDs in binary log. Requires --log-bin-v1-events=OFF.

* `ndb-log-update-minimal`: Log updates in minimal format.

* `ndb-log-updated-only`: Log updates only (ON) or complete rows (OFF).

* `ndb-log-update-as-write`: Toggles logging of updates on source between updates (OFF) and writes (ON).

* `ndb-mgmd-host`: Set host (and port, if desired) for connecting to management server.

* `ndb-nodeid`: NDB Cluster node ID for this MySQL server.

* `ndb-optimized-node-selection`: Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable.

* `ndb-transid-mysql-connection-map`: Enable or disable ndb\_transid\_mysql\_connection\_map plugin; that is, enable or disable INFORMATION\_SCHEMA table having that name.

* `ndb-wait-connected`: Time (in seconds) for MySQL server to wait for connection to cluster management and data nodes before accepting MySQL client connections.

* `ndb-wait-setup`: Time (in seconds) for MySQL server to wait for NDB engine setup to complete.

* `ndb-allow-copying-alter-table`: Set to OFF to keep ALTER TABLE from using copying operations on NDB tables.

* `Ndb_api_adaptive_send_deferred_count`: Number of adaptive send calls not actually sent by this MySQL Server (SQL node).

* `Ndb_api_adaptive_send_deferred_count_session`: Number of adaptive send calls not actually sent in this client session.

* `Ndb_api_adaptive_send_deferred_count_slave`: Number of adaptive send calls not actually sent by this replica.

* `Ndb_api_adaptive_send_forced_count`: Number of adaptive sends with forced-send set sent by this MySQL Server (SQL node).

* `Ndb_api_adaptive_send_forced_count_session`: Number of adaptive sends with forced-send set in this client session.

* `Ndb_api_adaptive_send_forced_count_slave`: Number of adaptive sends with forced-send set sent by this replica.

* `Ndb_api_adaptive_send_unforced_count`: Number of adaptive sends without forced-send sent by this MySQL Server (SQL node).

* `Ndb_api_adaptive_send_unforced_count_session`: Number of adaptive sends without forced-send in this client session.

* `Ndb_api_adaptive_send_unforced_count_slave`: Number of adaptive sends without forced-send sent by this replica.

* `Ndb_api_bytes_received_count`: Quantity of data (in bytes) received from data nodes by this MySQL Server (SQL node).

* `Ndb_api_bytes_received_count_session`: Quantity of data (in bytes) received from data nodes in this client session.

* `Ndb_api_bytes_received_count_slave`: Quantity of data (in bytes) received from data nodes by this replica.

* `Ndb_api_bytes_sent_count`: Quantity of data (in bytes) sent to data nodes by this MySQL Server (SQL node).

* `Ndb_api_bytes_sent_count_session`: Quantity of data (in bytes) sent to data nodes in this client session.

* `Ndb_api_bytes_sent_count_slave`: Qunatity of data (in bytes) sent to data nodes by this replica.

* `Ndb_api_event_bytes_count`: Number of bytes of events received by this MySQL Server (SQL node).

* `Ndb_api_event_bytes_count_injector`: Number of bytes of event data received by NDB binary log injector thread.

* `Ndb_api_event_data_count`: Number of row change events received by this MySQL Server (SQL node).

* `Ndb_api_event_data_count_injector`: Number of row change events received by NDB binary log injector thread.

* `Ndb_api_event_nondata_count`: Number of events received, other than row change events, by this MySQL Server (SQL node).

* `Ndb_api_event_nondata_count_injector`: Number of events received, other than row change events, by NDB binary log injector thread.

* `Ndb_api_pk_op_count`: Number of operations based on or using primary keys by this MySQL Server (SQL node).

* `Ndb_api_pk_op_count_session`: Number of operations based on or using primary keys in this client session.

* `Ndb_api_pk_op_count_slave`: Number of operations based on or using primary keys by this replica.

* `Ndb_api_pruned_scan_count`: Number of scans that have been pruned to one partition by this MySQL Server (SQL node).

* `Ndb_api_pruned_scan_count_session`: Number of scans that have been pruned to one partition in this client session.

* `Ndb_api_pruned_scan_count_slave`: Number of scans that have been pruned to one partition by this replica.

* `Ndb_api_range_scan_count`: Number of range scans that have been started by this MySQL Server (SQL node).

* `Ndb_api_range_scan_count_session`: Number of range scans that have been started in this client session.

* `Ndb_api_range_scan_count_slave`: Number of range scans that have been started by this replica.

* `Ndb_api_read_row_count`: Total number of rows that have been read by this MySQL Server (SQL node).

* `Ndb_api_read_row_count_session`: Total number of rows that have been read in this client session.

* `Ndb_api_read_row_count_slave`: Total number of rows that have been read by this replica.

* `Ndb_api_scan_batch_count`: Number of batches of rows received by this MySQL Server (SQL node).

* `Ndb_api_scan_batch_count_session`: Number of batches of rows received in this client session.

* `Ndb_api_scan_batch_count_slave`: Number of batches of rows received by this replica.

* `Ndb_api_table_scan_count`: Number of table scans that have been started, including scans of internal tables, by this MySQL Server (SQL node).

* `Ndb_api_table_scan_count_session`: Number of table scans that have been started, including scans of internal tables, in this client session.

* `Ndb_api_table_scan_count_slave`: Number of table scans that have been started, including scans of internal tables, by this replica.

* `Ndb_api_trans_abort_count`: Number of transactions aborted by this MySQL Server (SQL node).

* `Ndb_api_trans_abort_count_session`: Number of transactions aborted in this client session.

* `Ndb_api_trans_abort_count_slave`: Number of transactions aborted by this replica.

* `Ndb_api_trans_close_count`: Number of transactions closed by this MySQL Server (SQL node); may be greater than sum of TransCommitCount and TransAbortCount.

* `Ndb_api_trans_close_count_session`: Number of transactions aborted (may be greater than sum of TransCommitCount and TransAbortCount) in this client session.

* `Ndb_api_trans_close_count_slave`: Number of transactions aborted (may be greater than sum of TransCommitCount and TransAbortCount) by this replica.

* `Ndb_api_trans_commit_count`: Number of transactions committed by this MySQL Server (SQL node).

* `Ndb_api_trans_commit_count_session`: Number of transactions committed in this client session.

* `Ndb_api_trans_commit_count_slave`: Number of transactions committed by this replica.

* `Ndb_api_trans_local_read_row_count`: Total number of rows that have been read by this MySQL Server (SQL node).

* `Ndb_api_trans_local_read_row_count_session`: Total number of rows that have been read in this client session.

* `Ndb_api_trans_local_read_row_count_slave`: Total number of rows that have been read by this replica.

* `Ndb_api_trans_start_count`: Number of transactions started by this MySQL Server (SQL node).

* `Ndb_api_trans_start_count_session`: Number of transactions started in this client session.

* `Ndb_api_trans_start_count_slave`: Number of transactions started by this replica.

* `Ndb_api_uk_op_count`: Number of operations based on or using unique keys by this MySQL Server (SQL node).

* `Ndb_api_uk_op_count_session`: Number of operations based on or using unique keys in this client session.

* `Ndb_api_uk_op_count_slave`: Number of operations based on or using unique keys by this replica.

* `Ndb_api_wait_exec_complete_count`: Number of times thread has been blocked while waiting for operation execution to complete by this MySQL Server (SQL node).

* `Ndb_api_wait_exec_complete_count_session`: Number of times thread has been blocked while waiting for operation execution to complete in this client session.

* `Ndb_api_wait_exec_complete_count_slave`: Number of times thread has been blocked while waiting for operation execution to complete by this replica.

* `Ndb_api_wait_meta_request_count`: Number of times thread has been blocked waiting for metadata-based signal by this MySQL Server (SQL node).

* `Ndb_api_wait_meta_request_count_session`: Number of times thread has been blocked waiting for metadata-based signal in this client session.

* `Ndb_api_wait_meta_request_count_slave`: Number of times thread has been blocked waiting for metadata-based signal by this replica.

* `Ndb_api_wait_nanos_count`: Total time (in nanoseconds) spent waiting for some type of signal from data nodes by this MySQL Server (SQL node).

* `Ndb_api_wait_nanos_count_session`: Total time (in nanoseconds) spent waiting for some type of signal from data nodes in this client session.

* `Ndb_api_wait_nanos_count_slave`: Total time (in nanoseconds) spent waiting for some type of signal from data nodes by this replica.

* `Ndb_api_wait_scan_result_count`: Number of times thread has been blocked while waiting for scan-based signal by this MySQL Server (SQL node).

* `Ndb_api_wait_scan_result_count_session`: Number of times thread has been blocked while waiting for scan-based signal in this client session.

* `Ndb_api_wait_scan_result_count_slave`: Number of times thread has been blocked while waiting for scan-based signal by this replica.

* `ndb_autoincrement_prefetch_sz`: NDB auto-increment prefetch size.

* `ndb_cache_check_time`: Number of milliseconds between checks of cluster SQL nodes made by MySQL query cache.

* `ndb_clear_apply_status`: Causes RESET SLAVE/RESET REPLICA to clear all rows from ndb\_apply\_status table; ON by default.

* `Ndb_cluster_node_id`: Node ID of this server when acting as NDB Cluster SQL node.

* `Ndb_config_from_host`: NDB Cluster management server host name or IP address.

* `Ndb_config_from_port`: Port for connecting to NDB Cluster management server.

* `Ndb_conflict_fn_epoch`: Number of rows that have been found in conflict by NDB$EPOCH() NDB replication conflict detection function.

* `Ndb_conflict_fn_epoch2`: Number of rows that have been found in conflict by NDB replication NDB$EPOCH2() conflict detection function.

* `Ndb_conflict_fn_epoch2_trans`: Number of rows that have been found in conflict by NDB replication NDB$EPOCH2\_TRANS() conflict detection function.

* `Ndb_conflict_fn_epoch_trans`: Number of rows that have been found in conflict by NDB$EPOCH\_TRANS() conflict detection function.

* `Ndb_conflict_fn_max`: Number of times that NDB replication conflict resolution based on "greater timestamp wins" has been applied to update and delete operations.

* `Ndb_conflict_fn_max_del_win`: Number of times that NDB replication conflict resolution based on outcome of NDB$MAX\_DELETE\_WIN() has been applied to update and delete operations.

* `Ndb_conflict_fn_old`: Number of times that NDB replication "same timestamp wins" conflict resolution has been applied.

* `Ndb_conflict_last_conflict_epoch`: Most recent NDB epoch on this replica in which some conflict was detected.

* `Ndb_conflict_last_stable_epoch`: Most recent epoch containing no conflicts.

* `Ndb_conflict_reflected_op_discard_count`: Number of reflected operations that were not applied due error during execution.

* `Ndb_conflict_reflected_op_prepare_count`: Number of reflected operations received that have been prepared for execution.

* `Ndb_conflict_refresh_op_count`: Number of refresh operations that have been prepared.

* `Ndb_conflict_trans_conflict_commit_count`: Number of epoch transactions committed after requiring transactional conflict handling.

* `Ndb_conflict_trans_detect_iter_count`: Number of internal iterations required to commit epoch transaction. Should be (slightly) greater than or equal to Ndb\_conflict\_trans\_conflict\_commit\_count.

* `Ndb_conflict_trans_reject_count`: Number of transactions rejected after being found in conflict by transactional conflict function.

* `Ndb_conflict_trans_row_conflict_count`: Number of rows found in conflict by transactional conflict function. Includes any rows included in or dependent on conflicting transactions.

* `Ndb_conflict_trans_row_reject_count`: Total number of rows realigned after being found in conflict by transactional conflict function. Includes Ndb\_conflict\_trans\_row\_conflict\_count and any rows included in or dependent on conflicting transactions.

* `ndb_data_node_neighbour`: Specifies cluster data node "closest" to this MySQL Server, for transaction hinting and fully replicated tables.

* `ndb_default_column_format`: Sets default row format and column format (FIXED or DYNAMIC) used for new NDB tables.

* `ndb_deferred_constraints`: Specifies that constraint checks should be deferred (where these are supported). Not normally needed or used; for testing purposes only.

* `ndb_distribution`: Default distribution for new tables in NDBCLUSTER (KEYHASH or LINHASH, default is KEYHASH).

* `Ndb_epoch_delete_delete_count`: Number of delete-delete conflicts detected (delete operation is applied, but row does not exist).

* `ndb_eventbuffer_free_percent`: Percentage of free memory that should be available in event buffer before resumption of buffering, after reaching limit set by ndb\_eventbuffer\_max\_alloc.

* `ndb_eventbuffer_max_alloc`: Maximum memory that can be allocated for buffering events by NDB API. Defaults to 0 (no limit).

* `Ndb_execute_count`: Number of round trips to NDB kernel made by operations.

* `ndb_extra_logging`: Controls logging of NDB Cluster schema, connection, and data distribution events in MySQL error log.

* `ndb_force_send`: Forces sending of buffers to NDB immediately, without waiting for other threads.

* `ndb_fully_replicated`: Whether new NDB tables are fully replicated.

* `ndb_index_stat_enable`: Use NDB index statistics in query optimization.

* `ndb_index_stat_option`: Comma-separated list of tunable options for NDB index statistics; list should contain no spaces.

* `ndb_join_pushdown`: Enables pushing down of joins to data nodes.

* `Ndb_last_commit_epoch_server`: Epoch most recently committed by NDB.

* `Ndb_last_commit_epoch_session`: Epoch most recently committed by this NDB client.

* `ndb_log_apply_status`: Whether or not MySQL server acting as replica logs mysql.ndb\_apply\_status updates received from its immediate source in its own binary log, using its own server ID.

* `ndb_log_bin`: Write updates to NDB tables in binary log. Effective only if binary logging is enabled with --log-bin.

* `ndb_log_binlog_index`: Insert mapping between epochs and binary log positions into ndb\_binlog\_index table. Defaults to ON. Effective only if binary logging is enabled.

* `ndb_log_empty_epochs`: When enabled, epochs in which there were no changes are written to ndb\_apply\_status and ndb\_binlog\_index tables, even when log\_replica\_updates or log\_slave\_updates is enabled.

* `ndb_log_empty_update`: When enabled, updates which produce no changes are written to ndb\_apply\_status and ndb\_binlog\_index tables, even when log\_replica\_updates or log\_slave\_updates is enabled.

* `ndb_log_exclusive_reads`: Log primary key reads with exclusive locks; allow conflict resolution based on read conflicts.

* `ndb_log_orig`: Whether id and epoch of originating server are recorded in mysql.ndb\_binlog\_index table. Set using --ndb-log-orig option when starting mysqld.

* `ndb_log_transaction_id`: Whether NDB transaction IDs are written into binary log (Read-only).

* `Ndb_number_of_data_nodes`: Number of data nodes in this NDB cluster; set only if server participates in cluster.

* `ndb-optimization-delay`: Number of milliseconds to wait between processing sets of rows by OPTIMIZE TABLE on NDB tables.

* `ndb_optimized_node_selection`: Determines how SQL node chooses cluster data node to use as transaction coordinator.

* `Ndb_pruned_scan_count`: Number of scans executed by NDB since cluster was last started where partition pruning could be used.

* `Ndb_pushed_queries_defined`: Number of joins that API nodes have attempted to push down to data nodes.

* `Ndb_pushed_queries_dropped`: Number of joins that API nodes have tried to push down, but failed.

* `Ndb_pushed_queries_executed`: Number of joins successfully pushed down and executed on data nodes.

* `Ndb_pushed_reads`: Number of reads executed on data nodes by pushed-down joins.

* `ndb_read_backup`: Enable read from any replica for all NDB tables; use NDB\_TABLE=READ\_BACKUP={0|1} with CREATE TABLE or ALTER TABLE to enable or disable for individual NDB tables.

* `ndb_recv_thread_activation_threshold`: Activation threshold when receive thread takes over polling of cluster connection (measured in concurrently active threads).

* `ndb_recv_thread_cpu_mask`: CPU mask for locking receiver threads to specific CPUs; specified as hexadecimal. See documentation for details.

* `ndb_report_thresh_binlog_epoch_slip`: NDB 7.5 and later: Threshold for number of epochs completely buffered, but not yet consumed by binlog injector thread which when exceeded generates BUFFERED\_EPOCHS\_OVER\_THRESHOLD event buffer status message; prior to NDB 7.5: Threshold for number of epochs to lag behind before reporting binary log status.

* `ndb_report_thresh_binlog_mem_usage`: Threshold for percentage of free memory remaining before reporting binary log status.

* `ndb_row_checksum`: When enabled, set row checksums; enabled by default.

* `Ndb_scan_count`: Total number of scans executed by NDB since cluster was last started.

* `ndb_show_foreign_key_mock_tables`: Show mock tables used to support foreign\_key\_checks=0.

* `ndb_slave_conflict_role`: Role for replica to play in conflict detection and resolution. Value is one of PRIMARY, SECONDARY, PASS, or NONE (default). Can be changed only when replication SQL thread is stopped. See documentation for further information.

* `Ndb_slave_max_replicated_epoch`: Most recently committed NDB epoch on this replica. When this value is greater than or equal to Ndb\_conflict\_last\_conflict\_epoch, no conflicts have yet been detected.

* `Ndb_system_name`: Configured cluster system name; empty if server not connected to NDB.

* `ndb_table_no_logging`: NDB tables created when this setting is enabled are not checkpointed to disk (although table schema files are created). Setting in effect when table is created with or altered to use NDBCLUSTER persists for table's lifetime.

* `ndb_table_temporary`: NDB tables are not persistent on disk: no schema files are created and tables are not logged.

* `ndb_use_copying_alter_table`: Use copying ALTER TABLE operations in NDB Cluster.

* `ndb_use_exact_count`: Forces NDB to use a count of records during SELECT COUNT(\*) query planning to speed up this type of query.

* `ndb_use_transactions`: Set to OFF, to disable transaction support by NDB. Not recommended except in certain special cases; see documentation for details.

* `ndb_version`: Shows build and NDB engine version as an integer.

* `ndb_version_string`: Shows build information including NDB engine version in ndb-x.y.z format.

* `ndbcluster`: Enable NDB Cluster (if this version of MySQL supports it). Disabled by `--skip-ndbcluster`.

* `ndbinfo_database`: Name used for NDB information database; read only.

* `ndbinfo_max_bytes`: Used for debugging only.

* `ndbinfo_max_rows`: Used for debugging only.

* `ndbinfo_offline`: Put ndbinfo database into offline mode, in which no rows are returned from tables or views.

* `ndbinfo_show_hidden`: Whether to show ndbinfo internal base tables in mysql client; default is OFF.

* `ndbinfo_table_prefix`: Prefix to use for naming ndbinfo internal base tables; read only.

* `ndbinfo_version`: ndbinfo engine version; read only.

* `server_id_bits`: Number of least significant bits in server\_id actually used for identifying server, permitting NDB API applications to store application data in most significant bits. server\_id must be less than 2 to power of this value.

* `skip-ndbcluster`: Disable NDB Cluster storage engine.

* `slave_allow_batching`: Turns update batching on and off for replica.

* `transaction_allow_batching`: Allows batching of statements within one transaction. Disable AUTOCOMMIT to use.


### 21.4.3 NDB Cluster Configuration Files

Configuring NDB Cluster requires working with two files:

* `my.cnf`: Specifies options for all NDB Cluster executables. This file, with which you should be familiar with from previous work with MySQL, must be accessible by each executable running in the cluster.

* `config.ini`: This file, sometimes known as the global configuration file, is read only by the NDB Cluster management server, which then distributes the information contained therein to all processes participating in the cluster. `config.ini` contains a description of each node involved in the cluster. This includes configuration parameters for data nodes and configuration parameters for connections between all nodes in the cluster. For a quick reference to the sections that can appear in this file, and what sorts of configuration parameters may be placed in each section, see Sections of the `config.ini` File.

**Caching of configuration data.** `NDB` uses stateful configuration. Rather than reading the global configuration file every time the management server is restarted, the management server caches the configuration the first time it is started, and thereafter, the global configuration file is read only when one of the following conditions is true:

* **The management server is started using the --initial option.** When `--initial` is used, the global configuration file is re-read, any existing cache files are deleted, and the management server creates a new configuration cache.

* **The management server is started using the --reload option.** The `--reload` option causes the management server to compare its cache with the global configuration file. If they differ, the management server creates a new configuration cache; any existing configuration cache is preserved, but not used. If the management server's cache and the global configuration file contain the same configuration data, then the existing cache is used, and no new cache is created.

* **The management server is started using --config-cache=FALSE.** This disables `--config-cache` (enabled by default), and can be used to force the management server to bypass configuration caching altogether. In this case, the management server ignores any configuration files that may be present, always reading its configuration data from the `config.ini` file instead.

* **No configuration cache is found.** In this case, the management server reads the global configuration file and creates a cache containing the same configuration data as found in the file.

**Configuration cache files.** The management server by default creates configuration cache files in a directory named `mysql-cluster` in the MySQL installation directory. (If you build NDB Cluster from source on a Unix system, the default location is `/usr/local/mysql-cluster`.) This can be overridden at runtime by starting the management server with the `--configdir` option. Configuration cache files are binary files named according to the pattern `ndb_node_id_config.bin.seq_id`, where *`node_id`* is the management server's node ID in the cluster, and *`seq_id`* is a cache idenitifer. Cache files are numbered sequentially using *`seq_id`*, in the order in which they are created. The management server uses the latest cache file as determined by the *`seq_id`*.

Note

It is possible to roll back to a previous configuration by deleting later configuration cache files, or by renaming an earlier cache file so that it has a higher *`seq_id`*. However, since configuration cache files are written in a binary format, you should not attempt to edit their contents by hand.

For more information about the `--configdir`, `--config-cache`, `--initial`, and `--reload` options for the NDB Cluster management server, see Section 21.5.4, “ndb\_mgmd — The NDB Cluster Management Server Daemon”.

We are continuously making improvements in Cluster configuration and attempting to simplify this process. Although we strive to maintain backward compatibility, there may be times when introduce an incompatible change. In such cases we try to let NDB Cluster users know in advance if a change is not backward compatible. If you find such a change and we have not documented it, please report it in the MySQL bugs database using the instructions given in Section 1.5, “How to Report Bugs or Problems”.


#### 21.4.3.1 NDB Cluster Configuration: Basic Example

To support NDB Cluster, you must to update `my.cnf` as shown in the following example. You may also specify these parameters on the command line when invoking the executables.

Note

The options shown here should not be confused with those that are used in `config.ini` global configuration files. Global configuration options are discussed later in this section.

```sql
# my.cnf
# example additions to my.cnf for NDB Cluster
# (valid in MySQL 5.7)

# enable ndbcluster storage engine, and provide connection string for
# management server host (default port is 1186)
[mysqld]
ndbcluster
ndb-connectstring=ndb_mgmd.mysql.com


# provide connection string for management server host (default port: 1186)
[ndbd]
connect-string=ndb_mgmd.mysql.com

# provide connection string for management server host (default port: 1186)
[ndb_mgm]
connect-string=ndb_mgmd.mysql.com

# provide location of cluster configuration file
# IMPORTANT: When starting the management server with this option in the
# configuration file, the use of --initial or --reload on the command line when
# invoking ndb_mgmd is also required.
[ndb_mgmd]
config-file=/etc/config.ini
```

(For more information on connection strings, see Section 21.4.3.3, “NDB Cluster Connection Strings”.)

```sql
# my.cnf
# example additions to my.cnf for NDB Cluster
# (works on all versions)

# enable ndbcluster storage engine, and provide connection string for management
# server host to the default port 1186
[mysqld]
ndbcluster
ndb-connectstring=ndb_mgmd.mysql.com:1186
```

Important

Once you have started a `mysqld` process with the `NDBCLUSTER` and `ndb-connectstring` parameters in the `[mysqld]` in the `my.cnf` file as shown previously, you cannot execute any `CREATE TABLE` or `ALTER TABLE` statements without having actually started the cluster. Otherwise, these statements fail with an error. *This is by design*.

You may also use a separate `[mysql_cluster]` section in the cluster `my.cnf` file for settings to be read and used by all executables:

```sql
# cluster-specific settings
[mysql_cluster]
ndb-connectstring=ndb_mgmd.mysql.com:1186
```

For additional `NDB` variables that can be set in the `my.cnf` file, see Section 21.4.3.9.2, “NDB Cluster System Variables”.

The NDB Cluster global configuration file is by convention named `config.ini` (but this is not required). If needed, it is read by **ndb\_mgmd** at startup and can be placed in any location that can be read by it. The location and name of the configuration are specified using `--config-file=path_name` with **ndb\_mgmd** on the command line. This option has no default value, and is ignored if **ndb\_mgmd** uses the configuration cache.

The global configuration file for NDB Cluster uses INI format, which consists of sections preceded by section headings (surrounded by square brackets), followed by the appropriate parameter names and values. One deviation from the standard INI format is that the parameter name and value can be separated by a colon (`:`) as well as the equal sign (`=`); however, the equal sign is preferred. Another deviation is that sections are not uniquely identified by section name. Instead, unique sections (such as two different nodes of the same type) are identified by a unique ID specified as a parameter within the section.

Default values are defined for most parameters, and can also be specified in `config.ini`. To create a default value section, simply add the word `default` to the section name. For example, an `[ndbd]` section contains parameters that apply to a particular data node, whereas an `[ndbd default]` section contains parameters that apply to all data nodes. Suppose that all data nodes should use the same data memory size. To configure them all, create an `[ndbd default]` section that contains a `DataMemory` line to specify the data memory size.

If used, the `[ndbd default]` section must precede any `[ndbd]` sections in the configuration file. This is also true for `default` sections of any other type.

Note

In some older releases of NDB Cluster, there was no default value for `NoOfReplicas`, which always had to be specified explicitly in the `[ndbd default]` section. Although this parameter now has a default value of 2, which is the recommended setting in most common usage scenarios, it is still recommended practice to set this parameter explicitly.

The global configuration file must define the computers and nodes involved in the cluster and on which computers these nodes are located. An example of a simple configuration file for a cluster consisting of one management server, two data nodes and two MySQL servers is shown here:

```sql
# file "config.ini" - 2 data nodes and 2 SQL nodes
# This file is placed in the startup directory of ndb_mgmd (the
# management server)
# The first MySQL Server can be started from any host. The second
# can be started only on the host mysqld_5.mysql.com

[ndbd default]
NoOfReplicas= 2
DataDir= /var/lib/mysql-cluster

[ndb_mgmd]
Hostname= ndb_mgmd.mysql.com
DataDir= /var/lib/mysql-cluster

[ndbd]
HostName= ndbd_2.mysql.com

[ndbd]
HostName= ndbd_3.mysql.com

[mysqld]
[mysqld]
HostName= mysqld_5.mysql.com
```

Note

The preceding example is intended as a minimal starting configuration for purposes of familiarization with NDB Cluster , and is almost certain not to be sufficient for production settings. See Section 21.4.3.2, “Recommended Starting Configuration for NDB Cluster”, which provides a more complete example starting configuration.

Each node has its own section in the `config.ini` file. For example, this cluster has two data nodes, so the preceding configuration file contains two `[ndbd]` sections defining these nodes.

Note

Do not place comments on the same line as a section heading in the `config.ini` file; this causes the management server not to start because it cannot parse the configuration file in such cases.

##### Sections of the config.ini File

There are six different sections that you can use in the `config.ini` configuration file, as described in the following list:

* `[computer]`: Defines cluster hosts. This is not required to configure a viable NDB Cluster, but be may used as a convenience when setting up a large cluster. See Section 21.4.3.4, “Defining Computers in an NDB Cluster”, for more information.

* `[ndbd]`: Defines a cluster data node (**ndbd** process). See Section 21.4.3.6, “Defining NDB Cluster Data Nodes”, for details.

* `[mysqld]`: Defines the cluster's MySQL server nodes (also called SQL or API nodes). For a discussion of SQL node configuration, see Section 21.4.3.7, “Defining SQL and Other API Nodes in an NDB Cluster”.

* `[mgm]` or `[ndb_mgmd]`: Defines a cluster management server (MGM) node. For information concerning the configuration of management nodes, see Section 21.4.3.5, “Defining an NDB Cluster Management Server”.

* `[tcp]`: Defines a TCP/IP connection between cluster nodes, with TCP/IP being the default transport protocol. Normally, `[tcp]` or `[tcp default]` sections are not required to set up an NDB Cluster, as the cluster handles this automatically; however, it may be necessary in some situations to override the defaults provided by the cluster. See Section 21.4.3.10, “NDB Cluster TCP/IP Connections”, for information about available TCP/IP configuration parameters and how to use them. (You may also find Section 21.4.3.11, “NDB Cluster TCP/IP Connections Using Direct Connections” to be of interest in some cases.)

* `[shm]`: Defines shared-memory connections between nodes. In MySQL 5.7, it is enabled by default, but should still be considered experimental. For a discussion of SHM interconnects, see Section 21.4.3.12, “NDB Cluster Shared Memory Connections”.

* `[sci]`: Defines Scalable Coherent Interface connections between cluster data nodes. Not supported in NDB 7.5 or 7.6.

You can define `default` values for each section. If used, a `default` section should come before any other sections of that type. For example, an `[ndbd default]` section should appear in the configuration file before any `[ndbd]` sections.

NDB Cluster parameter names are case-insensitive, unless specified in MySQL Server `my.cnf` or `my.ini` files.


#### 21.4.3.2 Recommended Starting Configuration for NDB Cluster

Achieving the best performance from an NDB Cluster depends on a number of factors including the following:

* NDB Cluster software version
* Numbers of data nodes and SQL nodes
* Hardware
* Operating system
* Amount of data to be stored
* Size and type of load under which the cluster is to operate

Therefore, obtaining an optimum configuration is likely to be an iterative process, the outcome of which can vary widely with the specifics of each NDB Cluster deployment. Changes in configuration are also likely to be indicated when changes are made in the platform on which the cluster is run, or in applications that use the NDB Cluster 's data. For these reasons, it is not possible to offer a single configuration that is ideal for all usage scenarios. However, in this section, we provide a recommended base configuration.

**Starting config.ini file.** The following `config.ini` file is a recommended starting point for configuring a cluster running NDB Cluster 7.5:

```sql
# TCP PARAMETERS

[tcp default]
SendBufferMemory=2M
ReceiveBufferMemory=2M

# Increasing the sizes of these 2 buffers beyond the default values
# helps prevent bottlenecks due to slow disk I/O.

# MANAGEMENT NODE PARAMETERS

[ndb_mgmd default]
DataDir=path/to/management/server/data/directory

# It is possible to use a different data directory for each management
# server, but for ease of administration it is preferable to be
# consistent.

[ndb_mgmd]
HostName=management-server-A-hostname
# NodeId=management-server-A-nodeid

[ndb_mgmd]
HostName=management-server-B-hostname
# NodeId=management-server-B-nodeid

# Using 2 management servers helps guarantee that there is always an
# arbitrator in the event of network partitioning, and so is
# recommended for high availability. Each management server must be
# identified by a HostName. You may for the sake of convenience specify
# a NodeId for any management server, although one is allocated
# for it automatically; if you do so, it must be in the range 1-255
# inclusive and must be unique among all IDs specified for cluster
# nodes.

# DATA NODE PARAMETERS

[ndbd default]
NoOfReplicas=2

# Using two fragment replicas is recommended to guarantee availability of data;
# using only one fragment replica does not provide any redundancy, which means
# that the failure of a single data node causes the entire cluster to
# shut down. We do not recommend using more than two fragment replicas, since
# two are sufficient to provide high availability, and we do not currently test
# with greater values for this parameter.

LockPagesInMainMemory=1

# On Linux and Solaris systems, setting this parameter locks data node
# processes into memory. Doing so prevents them from swapping to disk,
# which can severely degrade cluster performance.

DataMemory=3072M
IndexMemory=384M

# The values provided for DataMemory and IndexMemory assume 4 GB RAM
# per data node. However, for best results, you should first calculate
# the memory that would be used based on the data you actually plan to
# store (you may find the ndb_size.pl utility helpful in estimating
# this), then allow an extra 20% over the calculated values. Naturally,
# you should ensure that each data node host has at least as much
# physical memory as the sum of these two values.
# NOTE: IndexMemory is deprecated in NDB 7.6 and later.

# ODirect=1

# Enabling this parameter causes NDBCLUSTER to try using O_DIRECT
# writes for local checkpoints and redo logs; this can reduce load on
# CPUs. We recommend doing so when using NDB Cluster on systems running
# Linux kernel 2.6 or later.

NoOfFragmentLogFiles=300
DataDir=path/to/data/node/data/directory
MaxNoOfConcurrentOperations=100000

SchedulerSpinTimer=400
SchedulerExecutionTimer=100
RealTimeScheduler=1
# Setting these parameters allows you to take advantage of real-time scheduling
# of NDB threads to achieve increased throughput when using ndbd. They
# are not needed when using ndbmtd; in particular, you should not set
# RealTimeScheduler for ndbmtd data nodes.

TimeBetweenGlobalCheckpoints=1000
TimeBetweenEpochs=200
RedoBuffer=32M

# CompressedLCP=1
# CompressedBackup=1
# Enabling CompressedLCP and CompressedBackup causes, respectively, local
checkpoint files and backup files to be compressed, which can result in a space
savings of up to 50% over noncompressed LCPs and backups.

# MaxNoOfLocalScans=64
MaxNoOfTables=1024
MaxNoOfOrderedIndexes=256

[ndbd]
HostName=data-node-A-hostname
# NodeId=data-node-A-nodeid

LockExecuteThreadToCPU=1
LockMaintThreadsToCPU=0
# On systems with multiple CPUs, these parameters can be used to lock NDBCLUSTER
# threads to specific CPUs

[ndbd]
HostName=data-node-B-hostname
# NodeId=data-node-B-nodeid

LockExecuteThreadToCPU=1
LockMaintThreadsToCPU=0

# You must have an [ndbd] section for every data node in the cluster;
# each of these sections must include a HostName. Each section may
# optionally include a NodeId for convenience, but in most cases, it is
# sufficient to allow the cluster to allocate node IDs dynamically. If
# you do specify the node ID for a data node, it must be in the range 1
# to 48 inclusive and must be unique among all IDs specified for
# cluster nodes.

# SQL NODE / API NODE PARAMETERS

[mysqld]
# HostName=sql-node-A-hostname
# NodeId=sql-node-A-nodeid

[mysqld]

[mysqld]

# Each API or SQL node that connects to the cluster requires a [mysqld]
# or [api] section of its own. Each such section defines a connection
# “slot”; you should have at least as many of these sections in the
# config.ini file as the total number of API nodes and SQL nodes that
# you wish to have connected to the cluster at any given time. There is
# no performance or other penalty for having extra slots available in
# case you find later that you want or need more API or SQL nodes to
# connect to the cluster at the same time.
# If no HostName is specified for a given [mysqld] or [api] section,
# then any API or SQL node may use that slot to connect to the
# cluster. You may wish to use an explicit HostName for one connection slot
# to guarantee that an API or SQL node from that host can always
# connect to the cluster. If you wish to prevent API or SQL nodes from
# connecting from other than a desired host or hosts, then use a
# HostName for every [mysqld] or [api] section in the config.ini file.
# You can if you wish define a node ID (NodeId parameter) for any API or
# SQL node, but this is not necessary; if you do so, it must be in the
# range 1 to 255 inclusive and must be unique among all IDs specified
# for cluster nodes.
```

**Required my.cnf options for SQL nodes.** MySQL servers acting as NDB Cluster SQL nodes must always be started with the `--ndbcluster` and `--ndb-connectstring` options, either on the command line or in `my.cnf`.


#### 21.4.3.3 NDB Cluster Connection Strings

With the exception of the NDB Cluster management server (**ndb\_mgmd**), each node that is part of an NDB Cluster requires a connection string that points to the management server's location. This connection string is used in establishing a connection to the management server as well as in performing other tasks depending on the node's role in the cluster. The syntax for a connection string is as follows:

```sql
[nodeid=node_id, ]host-definition[, host-definition[, ...]]

host-definition:
    host_name[:port_number]
```

`node_id` is an integer greater than or equal to 1 which identifies a node in `config.ini`. *`host_name`* is a string representing a valid Internet host name or IP address. *`port_number`* is an integer referring to a TCP/IP port number.

```sql
example 1 (long):    "nodeid=2,myhost1:1100,myhost2:1100,198.51.100.3:1200"
example 2 (short):   "myhost1"
```

`localhost:1186` is used as the default connection string value if none is provided. If *`port_num`* is omitted from the connection string, the default port is 1186. This port should always be available on the network because it has been assigned by IANA for this purpose (see <http://www.iana.org/assignments/port-numbers> for details).

By listing multiple host definitions, it is possible to designate several redundant management servers. An NDB Cluster data or API node attempts to contact successive management servers on each host in the order specified, until a successful connection has been established.

It is also possible to specify in a connection string one or more bind addresses to be used by nodes having multiple network interfaces for connecting to management servers. A bind address consists of a hostname or network address and an optional port number. This enhanced syntax for connection strings is shown here:

```sql
[nodeid=node_id, ]
    [bind-address=host-definition, ]
    host-definition[; bind-address=host-definition]
    host-definition[; bind-address=host-definition]
    [, ...]]

host-definition:
    host_name[:port_number]
```

If a single bind address is used in the connection string *prior* to specifying any management hosts, then this address is used as the default for connecting to any of them (unless overridden for a given management server; see later in this section for an example). For example, the following connection string causes the node to use `198.51.100.242` regardless of the management server to which it connects:

```sql
bind-address=198.51.100.242, poseidon:1186, perch:1186
```

If a bind address is specified *following* a management host definition, then it is used only for connecting to that management node. Consider the following connection string:

```sql
poseidon:1186;bind-address=localhost, perch:1186;bind-address=198.51.100.242
```

In this case, the node uses `localhost` to connect to the management server running on the host named `poseidon` and `198.51.100.242` to connect to the management server running on the host named `perch`.

You can specify a default bind address and then override this default for one or more specific management hosts. In the following example, `localhost` is used for connecting to the management server running on host `poseidon`; since `198.51.100.242` is specified first (before any management server definitions), it is the default bind address and so is used for connecting to the management servers on hosts `perch` and `orca`:

```sql
bind-address=198.51.100.242,poseidon:1186;bind-address=localhost,perch:1186,orca:2200
```

There are a number of different ways to specify the connection string:

* Each executable has its own command-line option which enables specifying the management server at startup. (See the documentation for the respective executable.)

* It is also possible to set the connection string for all nodes in the cluster at once by placing it in a `[mysql_cluster]` section in the management server's `my.cnf` file.

* For backward compatibility, two other options are available, using the same syntax:

  1. Set the `NDB_CONNECTSTRING` environment variable to contain the connection string.

  2. Write the connection string for each executable into a text file named `Ndb.cfg` and place this file in the executable's startup directory.

  These should be considered deprecated, and not used for new installations.

The recommended method for specifying the connection string is to set it on the command line or in the `my.cnf` file for each executable.


#### 21.4.3.4 Defining Computers in an NDB Cluster

The `[computer]` section has no real significance other than serving as a way to avoid the need of defining host names for each node in the system. All parameters mentioned here are required.

* `Id`

  <table frame="box" rules="all" summary="Id computer configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This is a unique identifier, used to refer to the host computer elsewhere in the configuration file.

  Important

  The computer ID is *not* the same as the node ID used for a management, API, or data node. Unlike the case with node IDs, you cannot use `NodeId` in place of `Id` in the `[computer]` section of the `config.ini` file.

* `HostName`

  <table frame="box" rules="all" summary="HostName computer configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This is the computer's hostname or IP address.

**Restart types.** Information about the restart types used by the parameter descriptions in this section is shown in the following table:

**Table 21.7 NDB Cluster restart types**

<table><col style="width: 10%"/><col style="width: 30%"/><col style="width: 60%"/><thead><tr> <th>Symbol</th> <th>Restart Type</th> <th>Description</th> </tr></thead><tbody><tr> <th>N</th> <td>Node</td> <td>The parameter can be updated using a rolling restart (see Section 21.6.5, “Performing a Rolling Restart of an NDB Cluster”)</td> </tr><tr> <th>S</th> <td>System</td> <td>All cluster nodes must be shut down completely, then restarted, to effect a change in this parameter</td> </tr><tr> <th>I</th> <td>Initial</td> <td>Data nodes must be restarted using the <code>--initial</code> option</td> </tr></tbody></table>


#### 21.4.3.5 Defining an NDB Cluster Management Server

The `[ndb_mgmd]` section is used to configure the behavior of the management server. If multiple management servers are employed, you can specify parameters common to all of them in an `[ndb_mgmd default]` section. `[mgm]` and `[mgm default]` are older aliases for these, supported for backward compatibility.

All parameters in the following list are optional and assume their default values if omitted.

Note

If neither the `ExecuteOnComputer` nor the `HostName` parameter is present, the default value `localhost` is assumed for both.

* `Id`

  <table frame="box" rules="all" summary="Id management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Each node in the cluster has a unique identity. For a management node, this is represented by an integer value in the range 1 to 255, inclusive. This ID is used by all internal cluster messages for addressing the node, and so must be unique for each NDB Cluster node, regardless of the type of node.

  Note

  Data node IDs must be less than 49. If you plan to deploy a large number of data nodes, it is a good idea to limit the node IDs for management nodes (and API nodes) to values greater than 48.

  The use of the `Id` parameter for identifying management nodes is deprecated in favor of `NodeId`. Although `Id` continues to be supported for backward compatibility, it now generates a warning and is subject to removal in a future version of NDB Cluster.

* `NodeId`

  <table frame="box" rules="all" summary="NodeId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Each node in the cluster has a unique identity. For a management node, this is represented by an integer value in the range 1 to 255 inclusive. This ID is used by all internal cluster messages for addressing the node, and so must be unique for each NDB Cluster node, regardless of the type of node.

  Note

  Data node IDs must be less than 49. If you plan to deploy a large number of data nodes, it is a good idea to limit the node IDs for management nodes (and API nodes) to values greater than 48.

  `NodeId` is the preferred parameter name to use when identifying management nodes. Although the older `Id` continues to be supported for backward compatibility, it is now deprecated and generates a warning when used; it is also subject to removal in a future NDB Cluster release.

* `ExecuteOnComputer`

  <table frame="box" rules="all" summary="ExecuteOnComputer management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This refers to the `Id` set for one of the computers defined in a `[computer]` section of the `config.ini` file.

  Important

  This parameter is deprecated as of NDB 7.5.0, and is subject to removal in a future release. Use the `HostName` parameter instead.

* `PortNumber`

  <table frame="box" rules="all" summary="PortNumber management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>1186</td> </tr><tr> <th>Range</th> <td>0 - 64K</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This is the port number on which the management server listens for configuration requests and management commands.

* `HostName`

  <table frame="box" rules="all" summary="HostName management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Specifying this parameter defines the hostname of the computer on which the management node is to reside. Use `HostName` to specify a host name other than `localhost`.

* `LocationDomainId`

  <table frame="box" rules="all" summary="LocationDomainId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Assigns a management node to a specific [availability domain](https://docs.us-phoenix-1.oraclecloud.com/Content/General/Concepts/regions.htm) (also known as an availability zone) within a cloud. By informing `NDB` which nodes are in which availability domains, performance can be improved in a cloud environment in the following ways:

  + If requested data is not found on the same node, reads can be directed to another node in the same availability domain.

  + Communication between nodes in different availability domains are guaranteed to use `NDB` transporters' WAN support without any further manual intervention.

  + The transporter's group number can be based on which availability domain is used, such that also SQL and other API nodes communicate with local data nodes in the same availability domain whenever possible.

  + The arbitrator can be selected from an availability domain in which no data nodes are present, or, if no such availability domain can be found, from a third availability domain.

  `LocationDomainId` takes an integer value between 0 and 16 inclusive, with 0 being the default; using 0 is the same as leaving the parameter unset.

* `LogDestination`

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

  You can disable arbitration completely either by setting `ArbitrationRank` to 0 on all management and SQL nodes, or by setting the `Arbitration` parameter in the `[ndbd default]` section of the `config.ini` global configuration file. Setting `Arbitration` causes any settings for `ArbitrationRank` to be disregarded.

* `ArbitrationDelay`

  <table frame="box" rules="all" summary="ArbitrationDelay management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>milliseconds</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  An integer value which causes the management server's responses to arbitration requests to be delayed by that number of milliseconds. By default, this value is 0; it is normally not necessary to change it.

* `DataDir`

  <table frame="box" rules="all" summary="DataDir management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This specifies the directory where output files from the management server are placed. These files include cluster log files, process output files, and the daemon's process ID (PID) file. (For log files, this location can be overridden by setting the `FILE` parameter for `LogDestination` as discussed previously in this section.)

  The default value for this parameter is the directory in which **ndb\_mgmd** is located.

* `PortNumberStats`

  <table frame="box" rules="all" summary="NodeId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>0

  This parameter specifies the port number used to obtain statistical information from an NDB Cluster management server. It has no default value.

* `Wan`

  <table frame="box" rules="all" summary="NodeId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>1

  Use WAN TCP setting as default.

* `HeartbeatThreadPriority`

  <table frame="box" rules="all" summary="NodeId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>2

  Set the scheduling policy and priority of heartbeat threads for management and API nodes.

  The syntax for setting this parameter is shown here:

  ```sql
  HeartbeatThreadPriority = policy[, priority]

  policy:
    {FIFO | RR}
  ```

  When setting this parameter, you must specify a policy. This is one of `FIFO` (first in, first out) or `RR` (round robin). The policy value is followed optionally by the priority (an integer).

* `ExtraSendBufferMemory`

  <table frame="box" rules="all" summary="NodeId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>3

  This parameter specifies the amount of transporter send buffer memory to allocate in addition to any that has been set using `TotalSendBufferMemory`, `SendBufferMemory`, or both.

* `TotalSendBufferMemory`

  <table frame="box" rules="all" summary="NodeId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>4

  This parameter is used to determine the total amount of memory to allocate on this node for shared send buffer memory among all configured transporters.

  If this parameter is set, its minimum permitted value is 256KB; 0 indicates that the parameter has not been set. For more detailed information, see Section 21.4.3.13, “Configuring NDB Cluster Send Buffer Parameters”.

* `HeartbeatIntervalMgmdMgmd`

  <table frame="box" rules="all" summary="NodeId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>5

  Specify the interval between heartbeat messages used to determine whether another management node is on contact with this one. The management node waits after 3 of these intervals to declare the connection dead; thus, the default setting of 1500 milliseconds causes the management node to wait for approximately 1600 ms before timing out.

Note

After making changes in a management node's configuration, it is necessary to perform a rolling restart of the cluster for the new configuration to take effect.

To add new management servers to a running NDB Cluster, it is also necessary to perform a rolling restart of all cluster nodes after modifying any existing `config.ini` files. For more information about issues arising when using multiple management nodes, see Section 21.2.7.10, “Limitations Relating to Multiple NDB Cluster Nodes”.

**Restart types.** Information about the restart types used by the parameter descriptions in this section is shown in the following table:

**Table 21.8 NDB Cluster restart types**

<table frame="box" rules="all" summary="NodeId management node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>6


#### 21.4.3.6 Defining NDB Cluster Data Nodes

The `[ndbd]` and `[ndbd default]` sections are used to configure the behavior of the cluster's data nodes.

`[ndbd]` and `[ndbd default]` are always used as the section names whether you are using **ndbd** or **ndbmtd**") binaries for the data node processes.

There are many parameters which control buffer sizes, pool sizes, timeouts, and so forth. The only mandatory parameter is `HostName`; this must be defined in the local `[ndbd]` section.

The parameter `NoOfReplicas` should be defined in the `[ndbd default]` section, as it is common to all Cluster data nodes. It is not strictly necessary to set `NoOfReplicas`, but it is good practice to set it explicitly.

Most data node parameters are set in the `[ndbd default]` section. Only those parameters explicitly stated as being able to set local values are permitted to be changed in the `[ndbd]` section. Where present, `HostName` and `NodeId` *must* be defined in the local `[ndbd]` section, and not in any other section of `config.ini`. In other words, settings for these parameters are specific to one data node.

For those parameters affecting memory usage or buffer sizes, it is possible to use `K`, `M`, or `G` as a suffix to indicate units of 1024, 1024×1024, or 1024×1024×1024. (For example, `100K` means 100 × 1024 = 102400.)

Parameter names and values are case-insensitive, unless used in a MySQL Server `my.cnf` or `my.ini` file, in which case they are case-sensitive.

Information about configuration parameters specific to NDB Cluster Disk Data tables can be found later in this section (see Disk Data Configuration Parameters).

All of these parameters also apply to **ndbmtd**") (the multithreaded version of **ndbd**). Three additional data node configuration parameters—`MaxNoOfExecutionThreads`, `ThreadConfig`, and `NoOfFragmentLogParts`—apply to **ndbmtd**") only; these have no effect when used with **ndbd**. For more information, see Multi-Threading Configuration Parameters (ndbmtd)"). See also Section 21.5.3, “ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)”").

**Identifying data nodes.** The `NodeId` or `Id` value (that is, the data node identifier) can be allocated on the command line when the node is started or in the configuration file.

* `NodeId`

  <table frame="box" rules="all" summary="NodeId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 48</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  A unique node ID is used as the node's address for all cluster internal messages. For data nodes, this is an integer in the range 1 to 48 inclusive. Each node in the cluster must have a unique identifier.

  `NodeId` is the only supported parameter name to use when identifying data nodes. (`Id` was removed in NDB 7.5.0.)

* `ExecuteOnComputer`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This refers to the `Id` set for one of the computers defined in a `[computer]` section.

  Important

  This parameter is deprecated as of NDB 7.5.0, and is subject to removal in a future release. Use the `HostName` parameter instead.

* `HostName`

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Specifying this parameter defines the hostname of the computer on which the data node is to reside. Use `HostName` to specify a host name other than `localhost`.

* `ServerPort`

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Each node in the cluster uses a port to connect to other nodes. By default, this port is allocated dynamically in such a way as to ensure that no two nodes on the same host computer receive the same port number, so it should normally not be necessary to specify a value for this parameter.

  However, if you need to be able to open specific ports in a firewall to permit communication between data nodes and API nodes (including SQL nodes), you can set this parameter to the number of the desired port in an `[ndbd]` section or (if you need to do this for multiple data nodes) the `[ndbd default]` section of the `config.ini` file, and then open the port having that number for incoming connections from SQL nodes, API nodes, or both.

  Note

  Connections from data nodes to management nodes is done using the **ndb\_mgmd** management port (the management server's `PortNumber`) so outgoing connections to that port from any data nodes should always be permitted.

* `TcpBind_INADDR_ANY`

  Setting this parameter to `TRUE` or `1` binds `IP_ADDR_ANY` so that connections can be made from anywhere (for autogenerated connections). The default is `FALSE` (`0`).

* `NodeGroup`

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter can be used to assign a data node to a specific node group. It is read only when the cluster is started for the first time, and cannot be used to reassign a data node to a different node group online. It is generally not desirable to use this parameter in the `[ndbd default]` section of the `config.ini` file, and care must be taken not to assign nodes to node groups in such a way that an invalid numbers of nodes are assigned to any node groups.

  The `NodeGroup` parameter is chiefly intended for use in adding a new node group to a running NDB Cluster without having to perform a rolling restart. For this purpose, you should set it to 65536 (the maximum value). You are not required to set a `NodeGroup` value for all cluster data nodes, only for those nodes which are to be started and added to the cluster as a new node group at a later time. For more information, see Section 21.6.7.3, “Adding NDB Cluster Data Nodes Online: Detailed Example”.

* `LocationDomainId`

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Assigns a data node to a specific [availability domain](https://docs.us-phoenix-1.oraclecloud.com/Content/General/Concepts/regions.htm) (also known as an availability zone) within a cloud. By informing `NDB` which nodes are in which availability domains, performance can be improved in a cloud environment in the following ways:

  + If requested data is not found on the same node, reads can be directed to another node in the same availability domain.

  + Communication between nodes in different availability domains are guaranteed to use `NDB` transporters' WAN support without any further manual intervention.

  + The transporter's group number can be based on which availability domain is used, such that also SQL and other API nodes communicate with local data nodes in the same availability domain whenever possible.

  + The arbitrator can be selected from an availability domain in which no data nodes are present, or, if no such availability domain can be found, from a third availability domain.

  `LocationDomainId` takes an integer value between 0 and 16 inclusive, with 0 being the default; using 0 is the same as leaving the parameter unset.

* `NoOfReplicas`

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This global parameter can be set only in the `[ndbd default]` section, and defines the number of fragment replicas for each table stored in the cluster. This parameter also specifies the size of node groups. A node group is a set of nodes all storing the same information.

  Node groups are formed implicitly. The first node group is formed by the set of data nodes with the lowest node IDs, the next node group by the set of the next lowest node identities, and so on. By way of example, assume that we have 4 data nodes and that `NoOfReplicas` is set to 2. The four data nodes have node IDs 2, 3, 4 and

  5. Then the first node group is formed from nodes 2 and 3, and the second node group by nodes 4 and 5. It is important to configure the cluster in such a manner that nodes in the same node groups are not placed on the same computer because a single hardware failure would cause the entire cluster to fail.

  If no node IDs are provided, the order of the data nodes is the determining factor for the node group. Whether or not explicit assignments are made, they can be viewed in the output of the management client's `SHOW` command.

  The default and recommended maximum value for `NoOfReplicas` is 2. *This is the recommended value for most production environments*.

  Important

  While it is theoretically possible for the value of this parameter to be 3 or 4, **NDB Cluster 7.5 and NDB Cluster 7.6 do not support setting `NoOfReplicas` to a value greater than 2 in production**.

  Warning

  Setting `NoOfReplicas` to 1 means that there is only a single copy of all Cluster data; in this case, the loss of a single data node causes the cluster to fail because there are no additional copies of the data stored by that node.

  The number of data nodes in the cluster must be evenly divisible by the value of this parameter. For example, if there are two data nodes, then `NoOfReplicas` must be equal to either 1 or 2, since 2/3 and 2/4 both yield fractional values; if there are four data nodes, then `NoOfReplicas` must be equal to 1, 2, or 4.

* `DataDir`

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter specifies the directory where trace files, log files, pid files and error logs are placed.

  The default is the data node process working directory.

* `FileSystemPath`

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter specifies the directory where all files created for metadata, REDO logs, UNDO logs (for Disk Data tables), and data files are placed. The default is the directory specified by `DataDir`.

  Note

  This directory must exist before the **ndbd** process is initiated.

  The recommended directory hierarchy for NDB Cluster includes `/var/lib/mysql-cluster`, under which a directory for the node's file system is created. The name of this subdirectory contains the node ID. For example, if the node ID is 2, this subdirectory is named `ndb_2_fs`.

* `BackupDataDir`

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter specifies the directory in which backups are placed.

  Important

  The string '`/BACKUP`' is always appended to this value. For example, if you set the value of `BackupDataDir` to `/var/lib/cluster-data`, then all backups are stored under `/var/lib/cluster-data/BACKUP`. This also means that the *effective* default backup location is the directory named `BACKUP` under the location specified by the `FileSystemPath` parameter.

##### Data Memory, Index Memory, and String Memory

`DataMemory` and `IndexMemory` are `[ndbd]` parameters specifying the size of memory segments used to store the actual records and their indexes. In setting values for these, it is important to understand how `DataMemory` and `IndexMemory` are used, as they usually need to be updated to reflect actual usage by the cluster.

Note

`IndexMemory` is deprecated in NDB 7.6, and subject to removal in a future version of NDB Cluster. See the descriptions that follow for further information.

* `DataMemory`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>0

  This parameter defines the amount of space (in bytes) available for storing database records. The entire amount specified by this value is allocated in memory, so it is extremely important that the machine has sufficient physical memory to accommodate it.

  The memory allocated by `DataMemory` is used to store both the actual records and indexes. There is a 16-byte overhead on each record; an additional amount for each record is incurred because it is stored in a 32KB page with 128 byte page overhead (see below). There is also a small amount wasted per page due to the fact that each record is stored in only one page.

  For variable-size table attributes, the data is stored on separate data pages, allocated from `DataMemory`. Variable-length records use a fixed-size part with an extra overhead of 4 bytes to reference the variable-size part. The variable-size part has 2 bytes overhead plus 2 bytes per attribute.

  The maximum record size is 14000 bytes.

  In NDB 7.5 (and earlier), the memory space defined by `DataMemory` is also used to store ordered indexes, which use about 10 bytes per record. Each table row is represented in the ordered index. A common error among users is to assume that all indexes are stored in the memory allocated by `IndexMemory`, but this is not the case: Only primary key and unique hash indexes use this memory; ordered indexes use the memory allocated by `DataMemory`. However, creating a primary key or unique hash index also creates an ordered index on the same keys, unless you specify `USING HASH` in the index creation statement. This can be verified by running **ndb\_desc -d *`db_name`* *`table_name`***.

  In NDB 7.6, resources assigned to `DataMemory` are used for storing *all* data and indexes; any memory configured as `IndexMemory` is automatically added to that used by `DataMemory` to form a common resource pool.

  The memory space allocated by `DataMemory` consists of 32KB pages, which are allocated to table fragments. Each table is normally partitioned into the same number of fragments as there are data nodes in the cluster. Thus, for each node, there are the same number of fragments as are set in `NoOfReplicas`.

  Once a page has been allocated, it is currently not possible to return it to the pool of free pages, except by deleting the table. (This also means that `DataMemory` pages, once allocated to a given table, cannot be used by other tables.) Performing a data node recovery also compresses the partition because all records are inserted into empty partitions from other live nodes.

  The `DataMemory` memory space also contains UNDO information: For each update, a copy of the unaltered record is allocated in the `DataMemory`. There is also a reference to each copy in the ordered table indexes. Unique hash indexes are updated only when the unique index columns are updated, in which case a new entry in the index table is inserted and the old entry is deleted upon commit. For this reason, it is also necessary to allocate enough memory to handle the largest transactions performed by applications using the cluster. In any case, performing a few large transactions holds no advantage over using many smaller ones, for the following reasons:

  + Large transactions are not any faster than smaller ones
  + Large transactions increase the number of operations that are lost and must be repeated in event of transaction failure

  + Large transactions use more memory

  In NDB 7.5 (and earlier), the default value for `DataMemory` is 80MB; in NDB 7.6, this is 98MB. The minimum value is 1MB. There is no maximum size, but in reality the maximum size has to be adapted so that the process does not start swapping when the limit is reached. This limit is determined by the amount of physical RAM available on the machine and by the amount of memory that the operating system may commit to any one process. 32-bit operating systems are generally limited to 2−4GB per process; 64-bit operating systems can use more. For large databases, it may be preferable to use a 64-bit operating system for this reason.

* `IndexMemory`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>1

  In NDB 7.5 and earlier, this parameter controls the amount of storage used for hash indexes in NDB Cluster. Hash indexes are always used for primary key indexes, unique indexes, and unique constraints. When defining a primary key or a unique index, two indexes are created, one of which is a hash index used for all tuple accesses as well as lock handling. This index is also used to enforce unique constraints.

  In NDB 7.6.2, the `IndexMemory` parameter is deprecated (and subject to future removal); any any memory assigned to `IndexMemory` is allocated instead to the same pool as `DataMemory`, which becomes solely responsible for all resources needed for storing data and indexes in memory. In NDB 7.6, the use of `IndexMemory` in the cluster configuration file triggers a warning from the management server.

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

  Assume that table `t1` has 1 million rows and an ordered index named `ix1` on two four-byte integers. Assume in addition that `IndexStatSaveSize` and `IndexStatSaveScale` are set to their default values (32K and 100, respectively). Using the previous 2 formulas, we can calculate as follows:

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

  Prior to NDB 7.6, the default value for `IndexMemory` is 18MB and the minimum is 1 MB; in NDB 7.6, the minimum and default vaue for this parameter is 0 (zero). This has implications for downgrades from NDB 7.6 to earlier versions of NDB Cluster; see Section 21.3.7, “Upgrading and Downgrading NDB Cluster”, for more information.

* `StringMemory`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>2

  This parameter determines how much memory is allocated for strings such as table names, and is specified in an `[ndbd]` or `[ndbd default]` section of the `config.ini` file. A value between `0` and `100` inclusive is interpreted as a percent of the maximum default value, which is calculated based on a number of factors including the number of tables, maximum table name size, maximum size of `.FRM` files, `MaxNoOfTriggers`, maximum column name size, and maximum default column value.

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

An important point for both `IndexMemory` and `DataMemory` is that the total database size is the sum of all data memory and all index memory for each node group. Each node group is used to store replicated information, so if there are four nodes with two fragment replicas, there are two node groups. Thus, the total data memory available is 2 × `DataMemory` for each data node.

It is highly recommended that `DataMemory` and `IndexMemory` be set to the same values for all nodes. Data distribution is even over all nodes in the cluster, so the maximum amount of space available for any node can be no greater than that of the smallest node in the cluster.

`DataMemory` (and in NDB 7.5 and earlier `IndexMemory`) can be changed, but decreasing it can be risky; doing so can easily lead to a node or even an entire NDB Cluster that is unable to restart due to there being insufficient memory space. Increases should be acceptable, but it is recommended that such upgrades are performed in the same manner as a software upgrade, beginning with an update of the configuration file, and then restarting the management server followed by restarting each data node in turn.

**MinFreePct.**

A proportion (5% by default) of data node resources including `DataMemory` (and in NDB 7.5 and earlier, `IndexMemory`) is kept in reserve to insure that the data node does not exhaust its memory when performing a restart. This can be adjusted using the `MinFreePct` data node configuration parameter (default 5).

<table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>3

Updates do not increase the amount of index memory used. Inserts take effect immediately; however, rows are not actually deleted until the transaction is committed.

**Transaction parameters.** The next few `[ndbd]` parameters that we discuss are important because they affect the number of parallel transactions and the sizes of transactions that can be handled by the system. `MaxNoOfConcurrentTransactions` sets the number of parallel transactions possible in a node. `MaxNoOfConcurrentOperations` sets the number of records that can be in update phase or locked simultaneously.

Both of these parameters (especially `MaxNoOfConcurrentOperations`) are likely targets for users setting specific values and not using the default value. The default value is set for systems using small transactions, to ensure that these do not use excessive memory.

`MaxDMLOperationsPerTransaction` sets the maximum number of DML operations that can be performed in a given transaction.

* `MaxNoOfConcurrentTransactions`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>4

  Each cluster data node requires a transaction record for each active transaction in the cluster. The task of coordinating transactions is distributed among all of the data nodes. The total number of transaction records in the cluster is the number of transactions in any given node times the number of nodes in the cluster.

  Transaction records are allocated to individual MySQL servers. Each connection to a MySQL server requires at least one transaction record, plus an additional transaction object per table accessed by that connection. This means that a reasonable minimum for the total number of transactions in the cluster can be expressed as

  ```sql
  TotalNoOfConcurrentTransactions =
      (maximum number of tables accessed in any single transaction + 1)
      * number of SQL nodes
  ```

  Suppose that there are 10 SQL nodes using the cluster. A single join involving 10 tables requires 11 transaction records; if there are 10 such joins in a transaction, then 10 \* 11 = 110 transaction records are required for this transaction, per MySQL server, or 110 \* 10 = 1100 transaction records total. Each data node can be expected to handle TotalNoOfConcurrentTransactions / number of data nodes. For an NDB Cluster having 4 data nodes, this would mean setting `MaxNoOfConcurrentTransactions` on each data node to 1100 / 4 = 275. In addition, you should provide for failure recovery by ensuring that a single node group can accommodate all concurrent transactions; in other words, that each data node's MaxNoOfConcurrentTransactions is sufficient to cover a number of transactions equal to TotalNoOfConcurrentTransactions / number of node groups. If this cluster has a single node group, then `MaxNoOfConcurrentTransactions` should be set to 1100 (the same as the total number of concurrent transactions for the entire cluster).

  In addition, each transaction involves at least one operation; for this reason, the value set for `MaxNoOfConcurrentTransactions` should always be no more than the value of `MaxNoOfConcurrentOperations`.

  This parameter must be set to the same value for all cluster data nodes. This is due to the fact that, when a data node fails, the oldest surviving node re-creates the transaction state of all transactions that were ongoing in the failed node.

  It is possible to change this value using a rolling restart, but the amount of traffic on the cluster must be such that no more transactions occur than the lower of the old and new levels while this is taking place.

  The default value is 4096.

* `MaxNoOfConcurrentOperations`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>5

  It is a good idea to adjust the value of this parameter according to the size and number of transactions. When performing transactions which involve only a few operations and records, the default value for this parameter is usually sufficient. Performing large transactions involving many records usually requires that you increase its value.

  Records are kept for each transaction updating cluster data, both in the transaction coordinator and in the nodes where the actual updates are performed. These records contain state information needed to find UNDO records for rollback, lock queues, and other purposes.

  This parameter should be set at a minimum to the number of records to be updated simultaneously in transactions, divided by the number of cluster data nodes. For example, in a cluster which has four data nodes and which is expected to handle one million concurrent updates using transactions, you should set this value to 1000000 / 4 = 250000. To help provide resiliency against failures, it is suggested that you set this parameter to a value that is high enough to permit an individual data node to handle the load for its node group. In other words, you should set the value equal to `total number of concurrent operations / number of node groups`. (In the case where there is a single node group, this is the same as the total number of concurrent operations for the entire cluster.)

  Because each transaction always involves at least one operation, the value of `MaxNoOfConcurrentOperations` should always be greater than or equal to the value of `MaxNoOfConcurrentTransactions`.

  Read queries which set locks also cause operation records to be created. Some extra space is allocated within individual nodes to accommodate cases where the distribution is not perfect over the nodes.

  When queries make use of the unique hash index, there are actually two operation records used per record in the transaction. The first record represents the read in the index table and the second handles the operation on the base table.

  The default value is 32768.

  This parameter actually handles two values that can be configured separately. The first of these specifies how many operation records are to be placed with the transaction coordinator. The second part specifies how many operation records are to be local to the database.

  A very large transaction performed on an eight-node cluster requires as many operation records in the transaction coordinator as there are reads, updates, and deletes involved in the transaction. However, the operation records of the are spread over all eight nodes. Thus, if it is necessary to configure the system for one very large transaction, it is a good idea to configure the two parts separately. `MaxNoOfConcurrentOperations` is always used to calculate the number of operation records in the transaction coordinator portion of the node.

  It is also important to have an idea of the memory requirements for operation records. These consume about 1KB per record.

* `MaxNoOfLocalOperations`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>6

  By default, this parameter is calculated as 1.1 × `MaxNoOfConcurrentOperations`. This fits systems with many simultaneous transactions, none of them being very large. If there is a need to handle one very large transaction at a time and there are many nodes, it is a good idea to override the default value by explicitly specifying this parameter.

* `MaxDMLOperationsPerTransaction`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>7

  This parameter limits the size of a transaction. The transaction is aborted if it requires more than this many DML operations.

**Transaction temporary storage.** The next set of `[ndbd]` parameters is used to determine temporary storage when executing a statement that is part of a Cluster transaction. All records are released when the statement is completed and the cluster is waiting for the commit or rollback.

The default values for these parameters are adequate for most situations. However, users with a need to support transactions involving large numbers of rows or operations may need to increase these values to enable better parallelism in the system, whereas users whose applications require relatively small transactions can decrease the values to save memory.

* `MaxNoOfConcurrentIndexOperations`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>8

  For queries using a unique hash index, another temporary set of operation records is used during a query's execution phase. This parameter sets the size of that pool of records. Thus, this record is allocated only while executing a part of a query. As soon as this part has been executed, the record is released. The state needed to handle aborts and commits is handled by the normal operation records, where the pool size is set by the parameter `MaxNoOfConcurrentOperations`.

  The default value of this parameter is 8192. Only in rare cases of extremely high parallelism using unique hash indexes should it be necessary to increase this value. Using a smaller value is possible and can save memory if the DBA is certain that a high degree of parallelism is not required for the cluster.

* `MaxNoOfFiredTriggers`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>9

  The default value of `MaxNoOfFiredTriggers` is 4000, which is sufficient for most situations. In some cases it can even be decreased if the DBA feels certain the need for parallelism in the cluster is not high.

  A record is created when an operation is performed that affects a unique hash index. Inserting or deleting a record in a table with unique hash indexes or updating a column that is part of a unique hash index fires an insert or a delete in the index table. The resulting record is used to represent this index table operation while waiting for the original operation that fired it to complete. This operation is short-lived but can still require a large number of records in its pool for situations with many parallel write operations on a base table containing a set of unique hash indexes.

* `TransactionBufferMemory`

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>0

  The memory affected by this parameter is used for tracking operations fired when updating index tables and reading unique indexes. This memory is used to store the key and column information for these operations. It is only very rarely that the value for this parameter needs to be altered from the default.

  The default value for `TransactionBufferMemory` is 1MB.

  Normal read and write operations use a similar buffer, whose usage is even more short-lived. The compile-time parameter `ZATTRBUF_FILESIZE` (found in `ndb/src/kernel/blocks/Dbtc/Dbtc.hpp`) set to 4000 × 128 bytes (500KB). A similar buffer for key information, `ZDATABUF_FILESIZE` (also in `Dbtc.hpp`) contains 4000 × 16 = 62.5KB of buffer space. `Dbtc` is the module that handles transaction coordination.

**Scans and buffering.** There are additional `[ndbd]` parameters in the `Dblqh` module (in `ndb/src/kernel/blocks/Dblqh/Dblqh.hpp`) that affect reads and updates. These include `ZATTRINBUF_FILESIZE`, set by default to 10000 × 128 bytes (1250KB) and `ZDATABUF_FILE_SIZE`, set by default to 10000\*16 bytes (roughly 156KB) of buffer space. To date, there have been neither any reports from users nor any results from our own extensive tests suggesting that either of these compile-time limits should be increased.

* `BatchSizePerLocalScan`

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>1

  This parameter is used to calculate the number of lock records used to handle concurrent scan operations.

  `BatchSizePerLocalScan` has a strong connection to the `BatchSize` defined in the SQL nodes.

* `LongMessageBuffer`

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>2

  This is an internal buffer used for passing messages within individual nodes and between nodes. The default is 64MB.

  This parameter seldom needs to be changed from the default.

* `MaxFKBuildBatchSize`

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>3

  Maximum scan batch size used for building foreign keys. Increasing the value set for this parameter may speed up building of foreign key builds at the expense of greater impact to ongoing traffic.

* `MaxNoOfConcurrentScans`

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>4

  This parameter is used to control the number of parallel scans that can be performed in the cluster. Each transaction coordinator can handle the number of parallel scans defined for this parameter. Each scan query is performed by scanning all partitions in parallel. Each partition scan uses a scan record in the node where the partition is located, the number of records being the value of this parameter times the number of nodes. The cluster should be able to sustain `MaxNoOfConcurrentScans` scans concurrently from all nodes in the cluster.

  Scans are actually performed in two cases. The first of these cases occurs when no hash or ordered indexes exists to handle the query, in which case the query is executed by performing a full table scan. The second case is encountered when there is no hash index to support the query but there is an ordered index. Using the ordered index means executing a parallel range scan. The order is kept on the local partitions only, so it is necessary to perform the index scan on all partitions.

  The default value of `MaxNoOfConcurrentScans` is 256. The maximum value is 500.

* `MaxNoOfLocalScans`

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>5

  Specifies the number of local scan records if many scans are not fully parallelized. When the number of local scan records is not provided, it is calculated as shown here:

  ```sql
  4 * MaxNoOfConcurrentScans * [# data nodes] + 2
  ```

  The minimum value is 32.

* `MaxParallelCopyInstances`

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>6

  This parameter sets the parallelization used in the copy phase of a node restart or system restart, when a node that is currently just starting is synchronised with a node that already has current data by copying over any changed records from the node that is up to date. Because full parallelism in such cases can lead to overload situations, `MaxParallelCopyInstances` provides a means to decrease it. This parameter's default value 0. This value means that the effective parallelism is equal to the number of LDM instances in the node just starting as well as the node updating it.

* `MaxParallelScansPerFragment`

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>7

  It is possible to configure the maximum number of parallel scans (`TUP` scans and `TUX` scans) allowed before they begin queuing for serial handling. You can increase this to take advantage of any unused CPU when performing large number of scans in parallel and improve their performance.

* `MaxReorgBuildBatchSize`

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>8

  Maximum scan batch size used for reorganization of table partitions. Increasing the value set for this parameter may speed up reorganization at the expense of greater impact to ongoing traffic.

* `MaxUIBuildBatchSize`

  <table frame="box" rules="all" summary="HostName data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>localhost</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>9

  Maximum scan batch size used for building unique keys. Increasing the value set for this parameter may speed up such builds at the expense of greater impact to ongoing traffic.

##### Memory Allocation

`MaxAllocate`

<table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>0

This parameter was used in older versions of NDB Cluster, but has no effect in NDB 7.5 or NDB 7.6.

##### Hash Map Size

`DefaultHashMapSize`

<table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>1

The size of the table hash maps used by `NDB` is configurable using this parameter. `DefaultHashMapSize` can take any of three possible values (0, 240, 3840).

The original intended use for this parameter was to facilitate upgrades and especially downgrades to and from very old releases with differing default hash map sizes. This is not an issue when upgrading from NDB Cluster 7.3 (or later) to later versions.

Decreasing this parameter online after any tables have been created or modified with `DefaultHashMapSize` equal to 3840 is not supported.

**Logging and checkpointing.** The following `[ndbd]` parameters control log and checkpoint behavior.

* `FragmentLogFileSize`

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>2

  Setting this parameter enables you to control directly the size of redo log files. This can be useful in situations when NDB Cluster is operating under a high load and it is unable to close fragment log files quickly enough before attempting to open new ones (only 2 fragment log files can be open at one time); increasing the size of the fragment log files gives the cluster more time before having to open each new fragment log file. The default value for this parameter is 16M.

  For more information about fragment log files, see the description for `NoOfFragmentLogFiles`.

* `InitialNoOfOpenFiles`

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>3

  This parameter sets the initial number of internal threads to allocate for open files.

  The default value is 27.

* `InitFragmentLogFiles`

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>4

  By default, fragment log files are created sparsely when performing an initial start of a data node—that is, depending on the operating system and file system in use, not all bytes are necessarily written to disk. However, it is possible to override this behavior and force all bytes to be written, regardless of the platform and file system type being used, by means of this parameter. `InitFragmentLogFiles` takes either of two values:

  + `SPARSE`. Fragment log files are created sparsely. This is the default value.

  + `FULL`. Force all bytes of the fragment log file to be written to disk.

  Depending on your operating system and file system, setting `InitFragmentLogFiles=FULL` may help eliminate I/O errors on writes to the REDO log.

* `EnablePartialLcp`

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>5

  When `true`, enable partial local checkpoints: This means that each LCP records only part of the full database, plus any records containing rows changed since the last LCP; if no rows have changed, the LCP updates only the LCP control file and does not update any data files.

  If `EnablePartialLcp` is disabled (`false`), each LCP uses only a single file and writes a full checkpoint; this requires the least amount of disk space for LCPs, but increases the write load for each LCP. The default value is enabled (`true`). The proportion of space used by partial LCPS can be modified by the setting for the `RecoveryWork` configuration parameter.

  For more information about files and directories used for full and partial LCPs, see NDB Cluster Data Node File System Directory.

  In NDB 7.6.7 and later, setting this parameter to `false` also disables the calculation of disk write speed used by the adaptive LCP control mechanism.

* `LcpScanProgressTimeout`

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>6

  A local checkpoint fragment scan watchdog checks periodically for no progress in each fragment scan performed as part of a local checkpoint, and shuts down the node if there is no progress after a given amount of time has elapsed. This interval can be set using the `LcpScanProgressTimeout` data node configuration parameter, which sets the maximum time for which the local checkpoint can be stalled before the LCP fragment scan watchdog shuts down the node.

  The default value is 60 seconds (providing compatibility with previous releases). Setting this parameter to 0 disables the LCP fragment scan watchdog altogether.

* `MaxNoOfOpenFiles`

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>7

  This parameter sets a ceiling on how many internal threads to allocate for open files. *Any situation requiring a change in this parameter should be reported as a bug*.

  The default value is 0. However, the minimum value to which this parameter can be set is 20.

* `MaxNoOfSavedMessages`

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>8

  This parameter sets the maximum number of errors written in the error log as well as the maximum number of trace files that are kept before overwriting the existing ones. Trace files are generated when, for whatever reason, the node crashes.

  The default is 25, which sets these maximums to 25 error messages and 25 trace files.

* `MaxLCPStartDelay`

  <table frame="box" rules="all" summary="ServerPort data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 64K</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>9

  In parallel data node recovery, only table data is actually copied and synchronized in parallel; synchronization of metadata such as dictionary and checkpoint information is done in a serial fashion. In addition, recovery of dictionary and checkpoint information cannot be executed in parallel with performing of local checkpoints. This means that, when starting or restarting many data nodes concurrently, data nodes may be forced to wait while a local checkpoint is performed, which can result in longer node recovery times.

  It is possible to force a delay in the local checkpoint to permit more (and possibly all) data nodes to complete metadata synchronization; once each data node's metadata synchronization is complete, all of the data nodes can recover table data in parallel, even while the local checkpoint is being executed. To force such a delay, set `MaxLCPStartDelay`, which determines the number of seconds the cluster can wait to begin a local checkpoint while data nodes continue to synchronize metadata. This parameter should be set in the `[ndbd default]` section of the `config.ini` file, so that it is the same for all data nodes. The maximum value is 600; the default is 0.

* `NoOfFragmentLogFiles`

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>0

  This parameter sets the number of REDO log files for the node, and thus the amount of space allocated to REDO logging. Because the REDO log files are organized in a ring, it is extremely important that the first and last log files in the set (sometimes referred to as the “head” and “tail” log files, respectively) do not meet. When these approach one another too closely, the node begins aborting all transactions encompassing updates due to a lack of room for new log records.

  A `REDO` log record is not removed until both required local checkpoints have been completed since that log record was inserted. Checkpointing frequency is determined by its own set of configuration parameters discussed elsewhere in this chapter.

  The default parameter value is 16, which by default means 16 sets of 4 16MB files for a total of 1024MB. The size of the individual log files is configurable using the `FragmentLogFileSize` parameter. In scenarios requiring a great many updates, the value for `NoOfFragmentLogFiles` may need to be set as high as 300 or even higher to provide sufficient space for REDO logs.

  If the checkpointing is slow and there are so many writes to the database that the log files are full and the log tail cannot be cut without jeopardizing recovery, all updating transactions are aborted with internal error code 410 (`Out of log file space temporarily`). This condition prevails until a checkpoint has completed and the log tail can be moved forward.

  Important

  This parameter cannot be changed “on the fly”; you must restart the node using `--initial`. If you wish to change this value for all data nodes in a running cluster, you can do so using a rolling node restart (using `--initial` when starting each data node).

* `RecoveryWork`

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>1

  Percentage of storage overhead for LCP files. This parameter has an effect only when `EnablePartialLcp` is true, that is, only when partial local checkpoints are enabled. A higher value means:

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

* `InsertRecoveryWork`

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>2

  Percentage of `RecoveryWork` used for inserted rows. A higher value increases the number of writes during a local checkpoint, and decreases the total size of the LCP. A lower value decreases the number of writes during an LCP, but results in more space being used for the LCP, which means that recovery takes longer. This parameter has an effect only when `EnablePartialLcp` is true, that is, only when partial local checkpoints are enabled.

* `EnableRedoControl`

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>3

  Enable adaptive checkpointing speed for controlling redo log usage. Set to `false` to disable (the default). Setting `EnablePartialLcp` to `false` also disables the adaptive calculation.

  When enabled, `EnableRedoControl` allows the data nodes greater flexibility with regard to the rate at which they write LCPs to disk. More specifically, enabling this parameter means that higher write rates can be employed, so that LCPs can complete and Redo logs be trimmed more quickly, thereby reducing recovery time and disk space requirements. This functionality allows data nodes to make better use of the higher rate of I/O and greater bandwidth available from modern solid-state storage devices and protocols, such as solid-state drives (SSDs) using Non-Volatile Memory Express (NVMe).

  The parameter currently defaults to `false` (disabled) due to the fact that `NDB` is still deployed widely on systems whose I/O or bandwidth is constrained relative to those employing solid-state technology, such as those using conventional hard disks (HDDs). In settings such as these, the `EnableRedoControl` mechanism can easily cause the I/O subsystem to become saturated, increasing wait times for data node input and output. In particular, this can cause issues with NDB Disk Data tables which have tablespaces or log file groups sharing a constrained IO subsystem with data node LCP and redo log files; such problems potentially include node or cluster failure due to GCP stop errors.

**Metadata objects.** The next set of `[ndbd]` parameters defines pool sizes for metadata objects, used to define the maximum number of attributes, tables, indexes, and trigger objects used by indexes, events, and replication between clusters.

Note

These act merely as “suggestions” to the cluster, and any that are not specified revert to the default values shown.

* `MaxNoOfAttributes`

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>4

  This parameter sets a suggested maximum number of attributes that can be defined in the cluster; like `MaxNoOfTables`, it is not intended to function as a hard upper limit.

  (In older NDB Cluster releases, this parameter was sometimes treated as a hard limit for certain operations. This caused problems with NDB Cluster Replication, when it was possible to create more tables than could be replicated, and sometimes led to confusion when it was possible [or not possible, depending on the circumstances] to create more than `MaxNoOfAttributes` attributes.)

  The default value is 1000, with the minimum possible value being 32. The maximum is 4294967039. Each attribute consumes around 200 bytes of storage per node due to the fact that all metadata is fully replicated on the servers.

  When setting `MaxNoOfAttributes`, it is important to prepare in advance for any `ALTER TABLE` statements that you might want to perform in the future. This is due to the fact, during the execution of `ALTER TABLE` on a Cluster table, 3 times the number of attributes as in the original table are used, and a good practice is to permit double this amount. For example, if the NDB Cluster table having the greatest number of attributes (*`greatest_number_of_attributes`*) has 100 attributes, a good starting point for the value of `MaxNoOfAttributes` would be `6 * greatest_number_of_attributes = 600`.

  You should also estimate the average number of attributes per table and multiply this by `MaxNoOfTables`. If this value is larger than the value obtained in the previous paragraph, you should use the larger value instead.

  Assuming that you can create all desired tables without any problems, you should also verify that this number is sufficient by trying an actual `ALTER TABLE` after configuring the parameter. If this is not successful, increase `MaxNoOfAttributes` by another multiple of `MaxNoOfTables` and test it again.

* `MaxNoOfTables`

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>5

  A table object is allocated for each table and for each unique hash index in the cluster. This parameter sets a suggested maximum number of table objects for the cluster as a whole; like `MaxNoOfAttributes`, it is not intended to function as a hard upper limit.

  (In older NDB Cluster releases, this parameter was sometimes treated as a hard limit for certain operations. This caused problems with NDB Cluster Replication, when it was possible to create more tables than could be replicated, and sometimes led to confusion when it was possible [or not possible, depending on the circumstances] to create more than `MaxNoOfTables` tables.)

  For each attribute that has a `BLOB` data type an extra table is used to store most of the `BLOB` data. These tables also must be taken into account when defining the total number of tables.

  The default value of this parameter is 128. The minimum is 8 and the maximum is 20320. Each table object consumes approximately 20KB per node.

  Note

  The sum of `MaxNoOfTables`, `MaxNoOfOrderedIndexes`, and `MaxNoOfUniqueHashIndexes` must not exceed `232 − 2` (4294967294).

* `MaxNoOfOrderedIndexes`

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>6

  For each ordered index in the cluster, an object is allocated describing what is being indexed and its storage segments. By default, each index so defined also defines an ordered index. Each unique index and primary key has both an ordered index and a hash index. `MaxNoOfOrderedIndexes` sets the total number of ordered indexes that can be in use in the system at any one time.

  The default value of this parameter is 128. Each index object consumes approximately 10KB of data per node.

  Note

  The sum of `MaxNoOfTables`, `MaxNoOfOrderedIndexes`, and `MaxNoOfUniqueHashIndexes` must not exceed `232 − 2` (4294967294).

* `MaxNoOfUniqueHashIndexes`

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>7

  For each unique index that is not a primary key, a special table is allocated that maps the unique key to the primary key of the indexed table. By default, an ordered index is also defined for each unique index. To prevent this, you must specify the `USING HASH` option when defining the unique index.

  The default value is 64. Each index consumes approximately 15KB per node.

  Note

  The sum of `MaxNoOfTables`, `MaxNoOfOrderedIndexes`, and `MaxNoOfUniqueHashIndexes` must not exceed `232 − 2` (4294967294).

* `MaxNoOfTriggers`

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>8

  Internal update, insert, and delete triggers are allocated for each unique hash index. (This means that three triggers are created for each unique hash index.) However, an *ordered* index requires only a single trigger object. Backups also use three trigger objects for each normal table in the cluster.

  Replication between clusters also makes use of internal triggers.

  This parameter sets the maximum number of trigger objects in the cluster.

  The default value is 768.

* `MaxNoOfSubscriptions`

  <table frame="box" rules="all" summary="NodeGroup data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 65536</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>9

  Each `NDB` table in an NDB Cluster requires a subscription in the NDB kernel. For some NDB API applications, it may be necessary or desirable to change this parameter. However, for normal usage with MySQL servers acting as SQL nodes, there is not any need to do so.

  The default value for `MaxNoOfSubscriptions` is 0, which is treated as equal to `MaxNoOfTables`. Each subscription consumes 108 bytes.

* `MaxNoOfSubscribers`

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>0

  This parameter is of interest only when using NDB Cluster Replication. The default value is 0, which is treated as `2 * MaxNoOfTables`; that is, there is one subscription per `NDB` table for each of two MySQL servers (one acting as the replication source and the other as the replica). Each subscriber uses 16 bytes of memory.

  When using circular replication, multi-source replication, and other replication setups involving more than 2 MySQL servers, you should increase this parameter to the number of `mysqld` processes included in replication (this is often, but not always, the same as the number of clusters). For example, if you have a circular replication setup using three NDB Cluster s, with one `mysqld` attached to each cluster, and each of these `mysqld` processes acts as a source and as a replica, you should set `MaxNoOfSubscribers` equal to `3 * MaxNoOfTables`.

  For more information, see Section 21.7, “NDB Cluster Replication”.

* `MaxNoOfConcurrentSubOperations`

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>1

  This parameter sets a ceiling on the number of operations that can be performed by all API nodes in the cluster at one time. The default value (256) is sufficient for normal operations, and might need to be adjusted only in scenarios where there are a great many API nodes each performing a high volume of operations concurrently.

**Boolean parameters.** The behavior of data nodes is also affected by a set of `[ndbd]` parameters taking on boolean values. These parameters can each be specified as `TRUE` by setting them equal to `1` or `Y`, and as `FALSE` by setting them equal to `0` or `N`.

* `CompressedLCP`

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>2

  Setting this parameter to `1` causes local checkpoint files to be compressed. The compression used is equivalent to **gzip --fast**, and can save 50% or more of the space required on the data node to store uncompressed checkpoint files. Compressed LCPs can be enabled for individual data nodes, or for all data nodes (by setting this parameter in the `[ndbd default]` section of the `config.ini` file).

  Important

  You cannot restore a compressed local checkpoint to a cluster running a MySQL version that does not support this feature.

  The default value is `0` (disabled).

  On Windows platforms, this parameter has no effect in NDB 7.5 or NDB 7.6.

* `CrashOnCorruptedTuple`

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>3

  When this parameter is enabled, it forces a data node to shut down whenever it encounters a corrupted tuple. In NDB 7.5, it is enabled by default.

* `Diskless`

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>4

  It is possible to specify NDB Cluster tables as diskless, meaning that tables are not checkpointed to disk and that no logging occurs. Such tables exist only in main memory. A consequence of using diskless tables is that neither the tables nor the records in those tables survive a crash. However, when operating in diskless mode, it is possible to run **ndbd** on a diskless computer.

  Important

  This feature causes the *entire* cluster to operate in diskless mode.

  When this feature is enabled, Cluster online backup is disabled. In addition, a partial start of the cluster is not possible.

  `Diskless` is disabled by default.

* `LateAlloc`

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>5

  Allocate memory for this data node after a connection to the management server has been established. Enabled by default.

* `LockPagesInMainMemory`

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>6

  For a number of operating systems, including Solaris and Linux, it is possible to lock a process into memory and so avoid any swapping to disk. This can be used to help guarantee the cluster's real-time characteristics.

  This parameter takes one of the integer values `0`, `1`, or `2`, which act as shown in the following list:

  + `0`: Disables locking. This is the default value.

  + `1`: Performs the lock after allocating memory for the process.

  + `2`: Performs the lock before memory for the process is allocated.

  If the operating system is not configured to permit unprivileged users to lock pages, then the data node process making use of this parameter may have to be run as system root. (`LockPagesInMainMemory` uses the `mlockall` function. From Linux kernel 2.6.9, unprivileged users can lock memory as limited by `max locked memory`. For more information, see **ulimit -l** and <http://linux.die.net/man/2/mlock>).

  Note

  In older NDB Cluster releases, this parameter was a Boolean. `0` or `false` was the default setting, and disabled locking. `1` or `true` enabled locking of the process after its memory was allocated. NDB Cluster 7.5 treats `true` or `false` for the value of this parameter as an error.

  Important

  Beginning with `glibc` 2.10, `glibc` uses per-thread arenas to reduce lock contention on a shared pool, which consumes real memory. In general, a data node process does not need per-thread arenas, since it does not perform any memory allocation after startup. (This difference in allocators does not appear to affect performance significantly.)

  The `glibc` behavior is intended to be configurable via the `MALLOC_ARENA_MAX` environment variable, but a bug in this mechanism prior to `glibc` 2.16 meant that this variable could not be set to less than 8, so that the wasted memory could not be reclaimed. (Bug #15907219; see also <http://sourceware.org/bugzilla/show_bug.cgi?id=13137> for more information concerning this issue.)

  One possible workaround for this problem is to use the `LD_PRELOAD` environment variable to preload a `jemalloc` memory allocation library to take the place of that supplied with `glibc`.

* `ODirect`

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>7

  Enabling this parameter causes `NDB` to attempt using `O_DIRECT` writes for LCP, backups, and redo logs, often lowering **kswapd** and CPU usage. When using NDB Cluster on Linux, enable `ODirect` if you are using a 2.6 or later kernel.

  `ODirect` is disabled by default.

* `ODirectSyncFlag`

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>8

  When this parameter is enabled, redo log writes are performed such that each completed file system write is handled as a call to `fsync`. The setting for this parameter is ignored if at least one of the following conditions is true:

  + `ODirect` is not enabled.

  + `InitFragmentLogFiles` is set to `SPARSE`.

  Disabled by default.

* `RestartOnErrorInsert`

  <table frame="box" rules="all" summary="LocationDomainId data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>9

  This feature is accessible only when building the debug version where it is possible to insert errors in the execution of individual blocks of code as part of testing.

  This feature is disabled by default.

* `StopOnError`

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>0

  This parameter specifies whether a data node process should exit or perform an automatic restart when an error condition is encountered.

  This parameter's default value is 1; this means that, by default, an error causes the data node process to halt.

  When an error is encountered and `StopOnError` is 0, the data node process is restarted.

  Prior to NDB Cluster 7.5.5, if the data node process exits in an uncontrolled fashion (due, for example, to performing **kill -9** on the data node process while performing a query, or to a segmentation fault), and `StopOnError` is set to 0, the angel process attempts to restart it in exactly the same way as it was started previously—that is, using the same startup options that were employed the last time the node was started. Thus, if the data node process was originally started using the `--initial` option, it is also restarted with `--initial`. This means that, in such cases, if the failure occurs on a sufficient number of data nodes in a very short interval, the effect is the same as if you had performed an initial restart of the entire cluster, leading to loss of all data. This issue is resolved in NDB Cluster 7.5.5 and later NDB 7.5 releases (Bug #83510, Bug #24945638).

  Users of MySQL Cluster Manager should note that, when `StopOnError` equals 1, this prevents the MySQL Cluster Manager agent from restarting any data nodes after it has performed its own restart and recovery. See Starting and Stopping the Agent on Linux, for more information.

* `UseShm`

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>1

  Use shared memory connections between this data node and the API node also running on this host. Set to 1 to enable.

  See Section 21.4.3.12, “NDB Cluster Shared Memory Connections”, for more information.

##### Controlling Timeouts, Intervals, and Disk Paging

There are a number of `[ndbd]` parameters specifying timeouts and intervals between various actions in Cluster data nodes. Most of the timeout values are specified in milliseconds. Any exceptions to this are mentioned where applicable.

* `TimeBetweenWatchDogCheck`

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>2

  To prevent the main thread from getting stuck in an endless loop at some point, a “watchdog” thread checks the main thread. This parameter specifies the number of milliseconds between checks. If the process remains in the same state after three checks, the watchdog thread terminates it.

  This parameter can easily be changed for purposes of experimentation or to adapt to local conditions. It can be specified on a per-node basis although there seems to be little reason for doing so.

  The default timeout is 6000 milliseconds (6 seconds).

* `TimeBetweenWatchDogCheckInitial`

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>3

  This is similar to the `TimeBetweenWatchDogCheck` parameter, except that `TimeBetweenWatchDogCheckInitial` controls the amount of time that passes between execution checks inside a storage node in the early start phases during which memory is allocated.

  The default timeout is 6000 milliseconds (6 seconds).

* `StartPartialTimeout`

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>4

  This parameter specifies how long the Cluster waits for all data nodes to come up before the cluster initialization routine is invoked. This timeout is used to avoid a partial Cluster startup whenever possible.

  This parameter is overridden when performing an initial start or initial restart of the cluster.

  The default value is 30000 milliseconds (30 seconds). 0 disables the timeout, in which case the cluster may start only if all nodes are available.

* `StartPartitionedTimeout`

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>5

  If the cluster is ready to start after waiting for `StartPartialTimeout` milliseconds but is still possibly in a partitioned state, the cluster waits until this timeout has also passed. If `StartPartitionedTimeout` is set to 0, the cluster waits indefinitely (232−1 ms, or approximately 49.71 days).

  This parameter is overridden when performing an initial start or initial restart of the cluster.

  The default value in NDB 7.6 is 0; previously it was 60000 (60 seconds).

* `StartFailureTimeout`

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>6

  If a data node has not completed its startup sequence within the time specified by this parameter, the node startup fails. Setting this parameter to 0 (the default value) means that no data node timeout is applied.

  For nonzero values, this parameter is measured in milliseconds. For data nodes containing extremely large amounts of data, this parameter should be increased. For example, in the case of a data node containing several gigabytes of data, a period as long as 10−15 minutes (that is, 600000 to 1000000 milliseconds) might be required to perform a node restart.

* `StartNoNodeGroupTimeout`

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>7

  When a data node is configured with `Nodegroup = 65536`, is regarded as not being assigned to any node group. When that is done, the cluster waits `StartNoNodegroupTimeout` milliseconds, then treats such nodes as though they had been added to the list passed to the `--nowait-nodes` option, and starts. The default value is `15000` (that is, the management server waits 15 seconds). Setting this parameter equal to `0` means that the cluster waits indefinitely.

  `StartNoNodegroupTimeout` must be the same for all data nodes in the cluster; for this reason, you should always set it in the `[ndbd default]` section of the `config.ini` file, rather than for individual data nodes.

  See Section 21.6.7, “Adding NDB Cluster Data Nodes Online”, for more information.

* `HeartbeatIntervalDbDb`

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>8

  One of the primary methods of discovering failed nodes is by the use of heartbeats. This parameter states how often heartbeat signals are sent and how often to expect to receive them. Heartbeats cannot be disabled.

  After missing four heartbeat intervals in a row, the node is declared dead. Thus, the maximum time for discovering a failure through the heartbeat mechanism is five times the heartbeat interval.

  The default heartbeat interval is 5000 milliseconds (5 seconds). This parameter must not be changed drastically and should not vary widely between nodes. If one node uses 5000 milliseconds and the node watching it uses 1000 milliseconds, obviously the node is declared dead very quickly. This parameter can be changed during an online software upgrade, but only in small increments.

  See also Network communication and latency, as well as the description of the `ConnectCheckIntervalDelay` configuration parameter.

* `HeartbeatIntervalDbApi`

  <table frame="box" rules="all" summary="NoOfReplicas data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>2</td> </tr><tr> <th>Range</th> <td>1 - 2</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>9

  Each data node sends heartbeat signals to each MySQL server (SQL node) to ensure that it remains in contact. If a MySQL server fails to send a heartbeat in time it is declared “dead,” in which case all ongoing transactions are completed and all resources released. The SQL node cannot reconnect until all activities initiated by the previous MySQL instance have been completed. The three-heartbeat criteria for this determination are the same as described for `HeartbeatIntervalDbDb`.

  The default interval is 1500 milliseconds (1.5 seconds). This interval can vary between individual data nodes because each data node watches the MySQL servers connected to it, independently of all other data nodes.

  For more information, see Network communication and latency.

* `HeartbeatOrder`

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>0

  Data nodes send heartbeats to one another in a circular fashion whereby each data node monitors the previous one. If a heartbeat is not detected by a given data node, this node declares the previous data node in the circle “dead” (that is, no longer accessible by the cluster). The determination that a data node is dead is done globally; in other words; once a data node is declared dead, it is regarded as such by all nodes in the cluster.

  It is possible for heartbeats between data nodes residing on different hosts to be too slow compared to heartbeats between other pairs of nodes (for example, due to a very low heartbeat interval or temporary connection problem), such that a data node is declared dead, even though the node can still function as part of the cluster. .

  In this type of situation, it may be that the order in which heartbeats are transmitted between data nodes makes a difference as to whether or not a particular data node is declared dead. If this declaration occurs unnecessarily, this can in turn lead to the unnecessary loss of a node group and as thus to a failure of the cluster.

  Consider a setup where there are 4 data nodes A, B, C, and D running on 2 host computers `host1` and `host2`, and that these data nodes make up 2 node groups, as shown in the following table:

  **Table 21.9 Four data nodes A, B, C, D running on two host computers host1, host2; each data node belongs to one of two node groups.**

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>1

  Suppose the heartbeats are transmitted in the order A->B->C->D->A. In this case, the loss of the heartbeat between the hosts causes node B to declare node A dead and node C to declare node B dead. This results in loss of Node Group 0, and so the cluster fails. On the other hand, if the order of transmission is A->B->D->C->A (and all other conditions remain as previously stated), the loss of the heartbeat causes nodes A and D to be declared dead; in this case, each node group has one surviving node, and the cluster survives.

  The `HeartbeatOrder` configuration parameter makes the order of heartbeat transmission user-configurable. The default value for `HeartbeatOrder` is zero; allowing the default value to be used on all data nodes causes the order of heartbeat transmission to be determined by `NDB`. If this parameter is used, it must be set to a nonzero value (maximum 65535) for every data node in the cluster, and this value must be unique for each data node; this causes the heartbeat transmission to proceed from data node to data node in the order of their `HeartbeatOrder` values from lowest to highest (and then directly from the data node having the highest `HeartbeatOrder` to the data node having the lowest value, to complete the circle). The values need not be consecutive. For example, to force the heartbeat transmission order A->B->D->C->A in the scenario outlined previously, you could set the `HeartbeatOrder` values as shown here:

  **Table 21.10 HeartbeatOrder values to force a heartbeat transition order of A->B->D->C->A.**

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>2

  To use this parameter to change the heartbeat transmission order in a running NDB Cluster, you must first set `HeartbeatOrder` for each data node in the cluster in the global configuration (`config.ini`) file (or files). To cause the change to take effect, you must perform either of the following:

  + A complete shutdown and restart of the entire cluster.
  + 2 rolling restarts of the cluster in succession. *All nodes must be restarted in the same order in both rolling restarts*.

  You can use `DUMP 908` to observe the effect of this parameter in the data node logs.

* `ConnectCheckIntervalDelay`

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>3

  This parameter enables connection checking between data nodes after one of them has failed heartbeat checks for 5 intervals of up to `HeartbeatIntervalDbDb` milliseconds.

  Such a data node that further fails to respond within an interval of `ConnectCheckIntervalDelay` milliseconds is considered suspect, and is considered dead after two such intervals. This can be useful in setups with known latency issues.

  The default value for this parameter is 0 (disabled).

* `TimeBetweenLocalCheckpoints`

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>4

  This parameter is an exception in that it does not specify a time to wait before starting a new local checkpoint; rather, it is used to ensure that local checkpoints are not performed in a cluster where relatively few updates are taking place. In most clusters with high update rates, it is likely that a new local checkpoint is started immediately after the previous one has been completed.

  The size of all write operations executed since the start of the previous local checkpoints is added. This parameter is also exceptional in that it is specified as the base-2 logarithm of the number of 4-byte words, so that the default value 20 means 4MB (4 ×
  220) of write operations, 21 would mean 8MB, and so on up to a maximum value of 31, which equates to 8GB of write operations.

  All the write operations in the cluster are added together. Setting `TimeBetweenLocalCheckpoints` to 6 or less means that local checkpoints are executed continuously without pause, independent of the cluster's workload.

* `TimeBetweenGlobalCheckpoints`

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>5

  When a transaction is committed, it is committed in main memory in all nodes on which the data is mirrored. However, transaction log records are not flushed to disk as part of the commit. The reasoning behind this behavior is that having the transaction safely committed on at least two autonomous host machines should meet reasonable standards for durability.

  It is also important to ensure that even the worst of cases—a complete crash of the cluster—is handled properly. To guarantee that this happens, all transactions taking place within a given interval are put into a global checkpoint, which can be thought of as a set of committed transactions that has been flushed to disk. In other words, as part of the commit process, a transaction is placed in a global checkpoint group. Later, this group's log records are flushed to disk, and then the entire group of transactions is safely committed to disk on all computers in the cluster.

  This parameter defines the interval between global checkpoints. The default is 2000 milliseconds.

* `TimeBetweenGlobalCheckpointsTimeout`

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>6

  This parameter defines the minimum timeout between global checkpoints. The default is 120000 milliseconds.

* `TimeBetweenEpochs`

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>7

  This parameter defines the interval between synchronization epochs for NDB Cluster Replication. The default value is 100 milliseconds.

  `TimeBetweenEpochs` is part of the implementation of “micro-GCPs”, which can be used to improve the performance of NDB Cluster Replication.

* `TimeBetweenEpochsTimeout`

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>8

  This parameter defines a timeout for synchronization epochs for NDB Cluster Replication. If a node fails to participate in a global checkpoint within the time determined by this parameter, the node is shut down. The default value is 0; in other words, the timeout is disabled.

  `TimeBetweenEpochsTimeout` is part of the implementation of “micro-GCPs”, which can be used to improve the performance of NDB Cluster Replication.

  The current value of this parameter and a warning are written to the cluster log whenever a GCP save takes longer than 1 minute or a GCP commit takes longer than 10 seconds.

  Setting this parameter to zero has the effect of disabling GCP stops caused by save timeouts, commit timeouts, or both. The maximum possible value for this parameter is 256000 milliseconds.

* `MaxBufferedEpochs`

  <table frame="box" rules="all" summary="DataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>.</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>9

  The number of unprocessed epochs by which a subscribing node can lag behind. Exceeding this number causes a lagging subscriber to be disconnected.

  The default value of 100 is sufficient for most normal operations. If a subscribing node does lag enough to cause disconnections, it is usually due to network or scheduling issues with regard to processes or threads. (In rare circumstances, the problem may be due to a bug in the `NDB` client.) It may be desirable to set the value lower than the default when epochs are longer.

  Disconnection prevents client issues from affecting the data node service, running out of memory to buffer data, and eventually shutting down. Instead, only the client is affected as a result of the disconnect (by, for example gap events in the binary log), forcing the client to reconnect or restart the process.

* `MaxBufferedEpochBytes`

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>0

  The total number of bytes allocated for buffering epochs by this node.

* `TimeBetweenInactiveTransactionAbortCheck`

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>1

  Timeout handling is performed by checking a timer on each transaction once for every interval specified by this parameter. Thus, if this parameter is set to 1000 milliseconds, every transaction is checked for timing out once per second.

  The default value is 1000 milliseconds (1 second).

* `TransactionInactiveTimeout`

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>2

  This parameter states the maximum time that is permitted to lapse between operations in the same transaction before the transaction is aborted.

  The default for this parameter is `4G` (also the maximum). For a real-time database that needs to ensure that no transaction keeps locks for too long, this parameter should be set to a relatively small value. Setting it to 0 means that the application never times out. The unit is milliseconds.

* `TransactionDeadlockDetectionTimeout`

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>3

  When a node executes a query involving a transaction, the node waits for the other nodes in the cluster to respond before continuing. This parameter sets the amount of time that the transaction can spend executing within a data node, that is, the time that the transaction coordinator waits for each data node participating in the transaction to execute a request.

  A failure to respond can occur for any of the following reasons:

  + The node is “dead”
  + The operation has entered a lock queue
  + The node requested to perform the action could be heavily overloaded.

  This timeout parameter states how long the transaction coordinator waits for query execution by another node before aborting the transaction, and is important for both node failure handling and deadlock detection.

  The default timeout value is 1200 milliseconds (1.2 seconds).

  The minimum for this parameter is 50 milliseconds.

* `DiskSyncSize`

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>4

  This is the maximum number of bytes to store before flushing data to a local checkpoint file. This is done to prevent write buffering, which can impede performance significantly. This parameter is *not* intended to take the place of `TimeBetweenLocalCheckpoints`.

  Note

  When `ODirect` is enabled, it is not necessary to set `DiskSyncSize`; in fact, in such cases its value is simply ignored.

  The default value is 4M (4 megabytes).

* `MaxDiskWriteSpeed`

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>5

  Set the maximum rate for writing to disk, in bytes per second, by local checkpoints and backup operations when no restarts (by this data node or any other data node) are taking place in this NDB Cluster.

  For setting the maximum rate of disk writes allowed while this data node is restarting, use `MaxDiskWriteSpeedOwnRestart`. For setting the maximum rate of disk writes allowed while other data nodes are restarting, use `MaxDiskWriteSpeedOtherNodeRestart`. The minimum speed for disk writes by all LCPs and backup operations can be adjusted by setting `MinDiskWriteSpeed`.

* `MaxDiskWriteSpeedOtherNodeRestart`

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>6

  Set the maximum rate for writing to disk, in bytes per second, by local checkpoints and backup operations when one or more data nodes in this NDB Cluster are restarting, other than this node.

  For setting the maximum rate of disk writes allowed while this data node is restarting, use `MaxDiskWriteSpeedOwnRestart`. For setting the maximum rate of disk writes allowed when no data nodes are restarting anywhere in the cluster, use `MaxDiskWriteSpeed`. The minimum speed for disk writes by all LCPs and backup operations can be adjusted by setting `MinDiskWriteSpeed`.

* `MaxDiskWriteSpeedOwnRestart`

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>7

  Set the maximum rate for writing to disk, in bytes per second, by local checkpoints and backup operations while this data node is restarting.

  For setting the maximum rate of disk writes allowed while other data nodes are restarting, use `MaxDiskWriteSpeedOtherNodeRestart`. For setting the maximum rate of disk writes allowed when no data nodes are restarting anywhere in the cluster, use `MaxDiskWriteSpeed`. The minimum speed for disk writes by all LCPs and backup operations can be adjusted by setting `MinDiskWriteSpeed`.

* `MinDiskWriteSpeed`

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>8

  Set the minimum rate for writing to disk, in bytes per second, by local checkpoints and backup operations.

  The maximum rates of disk writes allowed for LCPs and backups under various conditions are adjustable using the parameters `MaxDiskWriteSpeed`, `MaxDiskWriteSpeedOwnRestart`, and `MaxDiskWriteSpeedOtherNodeRestart`. See the descriptions of these parameters for more information.

* `ApiFailureHandlingTimeout`

  <table frame="box" rules="all" summary="FileSystemPath data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>DataDir</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>9

  Specifies the maximum time (in seconds) that the data node waits for API node failure handling to complete before escalating it to data node failure handling.

  Added in NDB 7.6.34.

* `ArbitrationTimeout`

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>0

  This parameter specifies how long data nodes wait for a response from the arbitrator to an arbitration message. If this is exceeded, the network is assumed to have split.

  The default value is 7500 milliseconds (7.5 seconds).

* `Arbitration`

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>1

  The `Arbitration` parameter enables a choice of arbitration schemes, corresponding to one of 3 possible values for this parameter:

  + **Default.** This enables arbitration to proceed normally, as determined by the `ArbitrationRank` settings for the management and API nodes. This is the default value.

  + **Disabled.** Setting `Arbitration = Disabled` in the `[ndbd default]` section of the `config.ini` file to accomplishes the same task as setting `ArbitrationRank` to 0 on all management and API nodes. When `Arbitration` is set in this way, any `ArbitrationRank` settings are ignored.

  + **WaitExternal.** The `Arbitration` parameter also makes it possible to configure arbitration in such a way that the cluster waits until after the time determined by `ArbitrationTimeout` has passed for an external cluster manager application to perform arbitration instead of handling arbitration internally. This can be done by setting `Arbitration = WaitExternal` in the `[ndbd default]` section of the `config.ini` file. For best results with the `WaitExternal` setting, it is recommended that `ArbitrationTimeout` be 2 times as long as the interval required by the external cluster manager to perform arbitration.

  Important

  This parameter should be used only in the `[ndbd default]` section of the cluster configuration file. The behavior of the cluster is unspecified when `Arbitration` is set to different values for individual data nodes.

* `RestartSubscriberConnectTimeout`

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>2

  This parameter determines the time that a data node waits for subscribing API nodes to connect. Once this timeout expires, any “missing” API nodes are disconnected from the cluster. To disable this timeout, set `RestartSubscriberConnectTimeout` to 0.

  While this parameter is specified in milliseconds, the timeout itself is resolved to the next-greatest whole second.

The heartbeat interval between management nodes and data nodes is always 100 milliseconds, and is not configurable.

**Buffering and logging.** Several `[ndbd]` configuration parameters enable the advanced user to have more control over the resources used by node processes and to adjust various buffer sizes at need.

These buffers are used as front ends to the file system when writing log records to disk. If the node is running in diskless mode, these parameters can be set to their minimum values without penalty due to the fact that disk writes are “faked” by the `NDB` storage engine's file system abstraction layer.

* `UndoIndexBuffer`

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>3

  This parameter formerly set the size of the undo index buffer, but has no effect in current versions of NDB Cluster.

* `UndoDataBuffer`

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>4

  This parameter formerly set the size of the undo data buffer, but has no effect in current versions of NDB Cluster.

* `RedoBuffer`

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>5

  All update activities also need to be logged. The REDO log makes it possible to replay these updates whenever the system is restarted. The NDB recovery algorithm uses a “fuzzy” checkpoint of the data together with the UNDO log, and then applies the REDO log to play back all changes up to the restoration point.

  `RedoBuffer` sets the size of the buffer in which the REDO log is written. The default value is 32MB; the minimum value is 1MB.

  If this buffer is too small, the `NDB` storage engine issues error code 1221 (REDO log buffers overloaded). For this reason, you should exercise care if you attempt to decrease the value of `RedoBuffer` as part of an online change in the cluster's configuration.

  **ndbmtd**") allocates a separate buffer for each LDM thread (see `ThreadConfig`). For example, with 4 LDM threads, an **ndbmtd**") data node actually has 4 buffers and allocates `RedoBuffer` bytes to each one, for a total of `4 * RedoBuffer` bytes.

* `EventLogBufferSize`

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>6

  Controls the size of the circular buffer used for NDB log events within data nodes.

**Controlling log messages.** In managing the cluster, it is very important to be able to control the number of log messages sent for various event types to `stdout`. For each event category, there are 16 possible event levels (numbered 0 through 15). Setting event reporting for a given event category to level 15 means all event reports in that category are sent to `stdout`; setting it to 0 means that there are no event reports made in that category.

By default, only the startup message is sent to `stdout`, with the remaining event reporting level defaults being set to 0. The reason for this is that these messages are also sent to the management server's cluster log.

An analogous set of levels can be set for the management client to determine which event levels to record in the cluster log.

* `LogLevelStartup`

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>7

  The reporting level for events generated during startup of the process.

  The default level is 1.

* `LogLevelShutdown`

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>8

  The reporting level for events generated as part of graceful shutdown of a node.

  The default level is 0.

* `LogLevelStatistic`

  <table frame="box" rules="all" summary="BackupDataDir data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>path</td> </tr><tr> <th>Default</th> <td>FileSystemPath</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster; each data node must be restarted with <code>--initial</code>. (NDB 7.5.0) </p></td> </tr></tbody></table>9

  The reporting level for statistical events such as number of primary key reads, number of updates, number of inserts, information relating to buffer usage, and so on.

  The default level is 0.

* `LogLevelCheckpoint`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>00

  The reporting level for events generated by local and global checkpoints.

  The default level is 0.

* `LogLevelNodeRestart`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>01

  The reporting level for events generated during node restart.

  The default level is 0.

* `LogLevelConnection`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>02

  The reporting level for events generated by connections between cluster nodes.

  The default level is 0.

* `LogLevelError`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>03

  The reporting level for events generated by errors and warnings by the cluster as a whole. These errors do not cause any node failure but are still considered worth reporting.

  The default level is 0.

* `LogLevelCongestion`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>04

  The reporting level for events generated by congestion. These errors do not cause node failure but are still considered worth reporting.

  The default level is 0.

* `LogLevelInfo`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>05

  The reporting level for events generated for information about the general state of the cluster.

  The default level is 0.

* `MemReportFrequency`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>06

  This parameter controls how often data node memory usage reports are recorded in the cluster log; it is an integer value representing the number of seconds between reports.

  Each data node's data memory and index memory usage is logged as both a percentage and a number of 32 KB pages of the `DataMemory` and (NDB 7.5 and earlier) `IndexMemory`, respectively, set in the `config.ini` file. For example, if `DataMemory` is equal to 100 MB, and a given data node is using 50 MB for data memory storage, the corresponding line in the cluster log might look like this:

  ```sql
  2006-12-24 01:18:16 [MgmSrvr] INFO -- Node 2: Data usage is 50%(1280 32K pages of total 2560)
  ```

  `MemReportFrequency` is not a required parameter. If used, it can be set for all cluster data nodes in the `[ndbd default]` section of `config.ini`, and can also be set or overridden for individual data nodes in the corresponding `[ndbd]` sections of the configuration file. The minimum value—which is also the default value—is 0, in which case memory reports are logged only when memory usage reaches certain percentages (80%, 90%, and 100%), as mentioned in the discussion of statistics events in Section 21.6.3.2, “NDB Cluster Log Events”.

* `StartupStatusReportFrequency`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>07

  When a data node is started with the `--initial`, it initializes the redo log file during Start Phase 4 (see Section 21.6.4, “Summary of NDB Cluster Start Phases”). When very large values are set for `NoOfFragmentLogFiles`, `FragmentLogFileSize`, or both, this initialization can take a long time.You can force reports on the progress of this process to be logged periodically, by means of the `StartupStatusReportFrequency` configuration parameter. In this case, progress is reported in the cluster log, in terms of both the number of files and the amount of space that have been initialized, as shown here:

  ```sql
  2009-06-20 16:39:23 [MgmSrvr] INFO -- Node 1: Local redo log file initialization status:
  #Total files: 80, Completed: 60
  #Total MBytes: 20480, Completed: 15557
  2009-06-20 16:39:23 [MgmSrvr] INFO -- Node 2: Local redo log file initialization status:
  #Total files: 80, Completed: 60
  #Total MBytes: 20480, Completed: 15570
  ```

  These reports are logged each `StartupStatusReportFrequency` seconds during Start Phase 4. If `StartupStatusReportFrequency` is 0 (the default), then reports are written to the cluster log only when at the beginning and at the completion of the redo log file initialization process.

##### Data Node Debugging Parameters

The following parameters are intended for use during testing or debugging of data nodes, and not for use in production.

* `DictTrace`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>08

  It is possible to cause logging of traces for events generated by creating and dropping tables using `DictTrace`. This parameter is useful only in debugging NDB kernel code. `DictTrace` takes an integer value. 0 disables logging; 1 enables it; setting this parameter to 2 enables logging of additional `DBDICT` debugging output (Bug #20368450).

* `WatchDogImmediateKill`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>09

  In NDB 7.6.7 and later, you can cause threads to be killed immediately whenever watchdog issues occur by enabling the `WatchDogImmediateKill` data node configuration parameter. This parameter should be used only when debugging or troubleshooting, to obtain trace files reporting exactly what was occurring the instant that execution ceased.

**Backup parameters.** The `[ndbd]` parameters discussed in this section define memory buffers set aside for execution of online backups.

* `BackupDataBufferSize`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>10

  In creating a backup, there are two buffers used for sending data to the disk. The backup data buffer is used to fill in data recorded by scanning a node's tables. Once this buffer has been filled to the level specified as `BackupWriteSize`, the pages are sent to disk. While flushing data to disk, the backup process can continue filling this buffer until it runs out of space. When this happens, the backup process pauses the scan and waits until some disk writes have completed freeing up memory so that scanning may continue.

* `BackupDiskWriteSpeedPct`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>11

  During normal operation, data nodes attempt to maximize the disk write speed used for local checkpoints and backups while remaining within the bounds set by `MinDiskWriteSpeed` and `MaxDiskWriteSpeed`. Disk write throttling gives each LDM thread an equal share of the total budget. This allows parallel LCPs to take place without exceeding the disk I/O budget. Because a backup is executed by only one LDM thread, this effectively caused a budget cut, resulting in longer backup completion times, and—if the rate of change is sufficiently high—in failure to complete the backup when the backup log buffer fill rate is higher than the achievable write rate.

  This problem can be addressed by using the `BackupDiskWriteSpeedPct` configuration parameter, which takes a value in the range 0-90 (inclusive) which is interpreted as the percentage of the node's maximum write rate budget that is reserved prior to sharing out the remainder of the budget among LDM threads for LCPs. The LDM thread running the backup receives the whole write rate budget for the backup, plus its (reduced) share of the write rate budget for local checkpoints. (This makes the disk write rate budget behave similarly to how it was handled in NDB Cluster 7.3 and earlier.)

  The default value for this parameter is 50 (interpreted as 50%).

* `BackupLogBufferSize`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>12

  The backup log buffer fulfills a role similar to that played by the backup data buffer, except that it is used for generating a log of all table writes made during execution of the backup. The same principles apply for writing these pages as with the backup data buffer, except that when there is no more space in the backup log buffer, the backup fails. For that reason, the size of the backup log buffer must be large enough to handle the load caused by write activities while the backup is being made. See Section 21.6.8.3, “Configuration for NDB Cluster Backups”.

  The default value for this parameter should be sufficient for most applications. In fact, it is more likely for a backup failure to be caused by insufficient disk write speed than it is for the backup log buffer to become full. If the disk subsystem is not configured for the write load caused by applications, the cluster is unlikely to be able to perform the desired operations.

  It is preferable to configure cluster nodes in such a manner that the processor becomes the bottleneck rather than the disks or the network connections.

  The default value for this parameter is 16MB.

* `BackupMemory`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>13

  This parameter is deprecated, and subject to removal in a future version of NDB Cluster. Any setting made for it is ignored.

* `BackupReportFrequency`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>14

  This parameter controls how often backup status reports are issued in the management client during a backup, as well as how often such reports are written to the cluster log (provided cluster event logging is configured to permit it—see Logging and checkpointing). `BackupReportFrequency` represents the time in seconds between backup status reports.

  The default value is 0.

* `BackupWriteSize`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>15

  This parameter specifies the default size of messages written to disk by the backup log and backup data buffers.

  The default value for this parameter is 256KB.

* `BackupMaxWriteSize`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>16

  This parameter specifies the maximum size of messages written to disk by the backup log and backup data buffers.

  The default value for this parameter is 1MB.

* `CompressedBackup`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>17

  Enabling this parameter causes backup files to be compressed. The compression used is equivalent to **gzip --fast**, and can save 50% or more of the space required on the data node to store uncompressed backup files. Compressed backups can be enabled for individual data nodes, or for all data nodes (by setting this parameter in the `[ndbd default]` section of the `config.ini` file).

  Important

  You cannot restore a compressed backup to a cluster running a MySQL version that does not support this feature.

  The default value is `0` (disabled).

Note

The location of the backup files is determined by the `BackupDataDir` data node configuration parameter.

**Additional requirements.** When specifying these parameters, the following relationships must hold true. Otherwise, the data node cannot start.

* `BackupDataBufferSize >= BackupWriteSize + 188KB`

* `BackupLogBufferSize >= BackupWriteSize + 16KB`

* `BackupMaxWriteSize >= BackupWriteSize`

##### NDB Cluster Realtime Performance Parameters

The `[ndbd]` parameters discussed in this section are used in scheduling and locking of threads to specific CPUs on multiprocessor data node hosts.

Note

To make use of these parameters, the data node process must be run as system root.

* `BuildIndexThreads`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>18

  This parameter determines the number of threads to create when rebuilding ordered indexes during a system or node start, as well as when running **ndb\_restore** `--rebuild-indexes`. It is supported only when there is more than one fragment for the table per data node (for example, when `COMMENT="NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_LDM_X_2"` is used with `CREATE TABLE`).

  Setting this parameter to 0 (the default) disables multithreaded building of ordered indexes.

  This parameter is supported when using **ndbd** or **ndbmtd**").

  You can enable multithreaded builds during data node initial restarts by setting the `TwoPassInitialNodeRestartCopy` data node configuration parameter to `TRUE`.

* `LockExecuteThreadToCPU`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>19

  When used with **ndbd**, this parameter (now a string) specifies the ID of the CPU assigned to handle the `NDBCLUSTER` execution thread. When used with **ndbmtd**"), the value of this parameter is a comma-separated list of CPU IDs assigned to handle execution threads. Each CPU ID in the list should be an integer in the range 0 to 65535 (inclusive).

  The number of IDs specified should match the number of execution threads determined by `MaxNoOfExecutionThreads`. However, there is no guarantee that threads are assigned to CPUs in any given order when using this parameter. You can obtain more finely-grained control of this type using `ThreadConfig`.

  `LockExecuteThreadToCPU` has no default value.

* `LockMaintThreadsToCPU`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>20

  This parameter specifies the ID of the CPU assigned to handle `NDBCLUSTER` maintenance threads.

  The value of this parameter is an integer in the range 0 to 65535 (inclusive). *There is no default value*.

* `Numa`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>21

  This parameter determines whether Non-Uniform Memory Access (NUMA) is controlled by the operating system or by the data node process, whether the data node uses **ndbd** or **ndbmtd**"). By default, `NDB` attempts to use an interleaved NUMA memory allocation policy on any data node where the host operating system provides NUMA support.

  Setting `Numa = 0` means that the datanode process does not itself attempt to set a policy for memory allocation, and permits this behavior to be determined by the operating system, which may be further guided by the separate **numactl** tool. That is, `Numa = 0` yields the system default behavior, which can be customised by **numactl**. For many Linux systems, the system default behavior is to allocate socket-local memory to any given process at allocation time. This can be problematic when using **ndbmtd**"); this is because **nbdmtd** allocates all memory at startup, leading to an imbalance, giving different access speeds for different sockets, especially when locking pages in main memory.

  Setting `Numa = 1` means that the data node process uses `libnuma` to request interleaved memory allocation. (This can also be accomplished manually, on the operating system level, using **numactl**.) Using interleaved allocation in effect tells the data node process to ignore non-uniform memory access but does not attempt to take any advantage of fast local memory; instead, the data node process tries to avoid imbalances due to slow remote memory. If interleaved allocation is not desired, set `Numa` to 0 so that the desired behavior can be determined on the operating system level.

  The `Numa` configuration parameter is supported only on Linux systems where `libnuma.so` is available.

* `RealtimeScheduler`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>22

  Setting this parameter to 1 enables real-time scheduling of data node threads.

  The default is 0 (scheduling disabled).

* `SchedulerExecutionTimer`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>23

  This parameter specifies the time in microseconds for threads to be executed in the scheduler before being sent. Setting it to 0 minimizes the response time; to achieve higher throughput, you can increase the value at the expense of longer response times.

  The default is 50 μsec, which our testing shows to increase throughput slightly in high-load cases without materially delaying requests.

* `SchedulerResponsiveness`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>24

  Set the balance in the `NDB` scheduler between speed and throughput. This parameter takes an integer whose value is in the range 0-10 inclusive, with 5 as the default. Higher values provide better response times relative to throughput. Lower values provide increased throughput at the expense of longer response times.

* `SchedulerSpinTimer`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>25

  This parameter specifies the time in microseconds for threads to be executed in the scheduler before sleeping.

  The default value is 0.

* `TwoPassInitialNodeRestartCopy`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>26

  Multithreaded building of ordered indexes can be enabled for initial restarts of data nodes by setting this configuration parameter to `true`, which enables two-pass copying of data during initial node restarts. In NDB 7.6, this is the default value (Bug #26704312, Bug #27109117).

  You must also set `BuildIndexThreads` to a nonzero value.

**Multi-Threading Configuration Parameters (ndbmtd).** **ndbmtd**") runs by default as a single-threaded process and must be configured to use multiple threads, using either of two methods, both of which require setting configuration parameters in the `config.ini` file. The first method is simply to set an appropriate value for the `MaxNoOfExecutionThreads` configuration parameter. A second method makes it possible to set up more complex rules for **ndbmtd**") multithreading using `ThreadConfig`. The next few paragraphs provide information about these parameters and their use with multithreaded data nodes.

* `MaxNoOfExecutionThreads`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>27

  This parameter directly controls the number of execution threads used by **ndbmtd**"), up to a maximum of 72. Although this parameter is set in `[ndbd]` or `[ndbd default]` sections of the `config.ini` file, it is exclusive to **ndbmtd**") and does not apply to **ndbd**.

  Setting `MaxNoOfExecutionThreads` sets the number of threads for each type as determined by a matrix in the file `storage/ndb/src/kernel/vm/mt_thr_config.cpp`. This table shows these numbers of threads for possible values of `MaxNoOfExecutionThreads`.

  **Table 21.11 MaxNoOfExecutionThreads values and the corresponding number of threads by thread type (LQH, TC, Send, Receive).**

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>28

  There is always one SUMA (replication) thread.

  `NoOfFragmentLogParts` should be set equal to the number of LDM threads used by **ndbmtd**"), as determined by the setting for this parameter. This ratio should not be any greater than 4:1; beginning with NDB 7.5.7, a configuration in which this is the case is specifically disallowed. (Bug #25333414)

  The number of LDM threads also determines the number of partitions used by an `NDB` table that is not explicitly partitioned; this is the number of LDM threads times the number of data nodes in the cluster. (If **ndbd** is used on the data nodes rather than **ndbmtd**"), then there is always a single LDM thread; in this case, the number of partitions created automatically is simply equal to the number of data nodes. See Section 21.2.2, “NDB Cluster Nodes, Node Groups, Fragment Replicas, and Partitions”, for more information.

  Adding large tablespaces for Disk Data tables when using more than the default number of LDM threads may cause issues with resource and CPU usage if the disk page buffer is insufficiently large; see the description of the `DiskPageBufferMemory` configuration parameter, for more information.

  The thread types are described later in this section (see `ThreadConfig`).

  Setting this parameter outside the permitted range of values causes the management server to abort on startup with the error Error line *`number`*: Illegal value *`value`* for parameter MaxNoOfExecutionThreads.

  For `MaxNoOfExecutionThreads`, a value of 0 or 1 is rounded up internally by `NDB` to 2, so that 2 is considered this parameter's default and minimum value.

  `MaxNoOfExecutionThreads` is generally intended to be set equal to the number of CPU threads available, and to allocate a number of threads of each type suitable to typical workloads. It does not assign particular threads to specified CPUs. For cases where it is desirable to vary from the settings provided, or to bind threads to CPUs, you should use `ThreadConfig` instead, which allows you to allocate each thread directly to a desired type, CPU, or both.

  The multithreaded data node process always spawns, at a minimum, the threads listed here:

  + 1 local query handler (LDM) thread
  + 1 receive thread
  + 1 subscription manager (SUMA or replication) thread

  For a `MaxNoOfExecutionThreads` value of 8 or less, no TC threads are created, and TC handling is instead performed by the main thread.

  Prior to NDB 7.6, changing the number of LDM threads always requires a system restart, whether it is changed using this parameter or `ThreadConfig`. In NDB 7.6 and later it is possible to effect the change using a node initial restart (*NI*) provided the following conditions are met:

  + If, following the change, the number of LDM threads remains the same as before, nothing more than a simple node restart (rolling restart, or *N*) is required to implement the change.

  + Otherwise (that is, if the number of LDM threads changes), it is still possible to effect the change using a node initial restart (*NI*) provided the following two conditions are met:

    1. Each LDM thread handles a maximum of 8 fragments, and

    2. The total number of table fragments is an integer multiple of the number of LDM threads.

  Prior to NDB 7.6, if the cluster's `IndexMemory` usage is greater than 50%, changing this requires an initial restart of the cluster. (A maximum of 30-35% `IndexMemory` usage is recommended in such cases.) Otherwise, resource usage and LDM thread allocation cannot be balanced between nodes, which can result in underutilized and overutilized LDM threads, and ultimately data node failures. In NDB 7.6 and later, an initial restart is *not* required to effect a change in this parameter.

* `MaxSendDelay`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>29

  This parameter can be used to cause data nodes to wait momentarily before sending data to API nodes; in some circumstances, described in the following paragraphs, this can result in more efficient sending of larger volumes of data and higher overall throughput.

  `MaxSendDelay` can be useful when there are a great many API nodes at saturation point or close to it, which can result in waves of increasing and decreasing performance. This occurs when the data nodes are able to send results back to the API nodes relatively quickly, with many small packets to process, which can take longer to process per byte compared to large packets, thus slowing down the API nodes; later, the data nodes start sending larger packets again.

  To handle this type of scenario, you can set `MaxSendDelay` to a nonzero value, which helps to ensure that responses are not sent back to the API nodes so quickly. When this is done, responses are sent immediately when there is no other competing traffic, but when there is, setting `MaxSendDelay` causes the data nodes to wait long enough to ensure that they send larger packets. In effect, this introduces an artificial bottleneck into the send process, which can actually improve throughput significantly.

* `NoOfFragmentLogParts`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>30

  Set the number of log file groups for redo logs belonging to this **ndbmtd**"). The value of this parameter should be set equal to the number of LDM threads used by **ndbmtd**") as determined by the setting for `MaxNoOfExecutionThreads`. Beginning with NDB 7.5.7, a configuration using more than 4 redo log parts per LDM is disallowed. (Bug #25333414)

  See the description of `MaxNoOfExecutionThreads` for more information.

* `ThreadConfig`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>31

  This parameter is used with **ndbmtd**") to assign threads of different types to different CPUs. Its value is a string whose format has the following syntax:

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

    The default value for `spintime` is the value of the `SchedulerSpinTimer` data node configuration parameter.

    `spintime` does not apply to I/O threads, watchdog, or offline index build threads, and so cannot be set for these thread types.

  + `realtime` can be set to 0 or 1. If it is set to 1, the threads run with real-time priority. This also means that `thread_prio` cannot be set.

    The `realtime` parameter is set by default to the value of the `RealtimeScheduler` data node configuration parameter.

    `realtime` cannot be set for offline index build threads.

  + By setting `nosend` to 1, you can prevent a `main`, `ldm`, `rep`, or `tc` thread from assisting the send threads. This parameter is 0 by default, and cannot be used with other types of threads.

  + `thread_prio` is a thread priority level that can be set from 0 to 10, with 10 representing the greatest priority. The default is 5. The precise effects of this parameter are platform-specific, and are described later in this section.

    The thread priority level cannot be set for offline index build threads.

  **thread\_prio settings and effects by platform.** The implementation of `thread_prio` differs between Linux/FreeBSD, Solaris, and Windows. In the following list, we discuss its effects on each of these platforms in turn:

  + *Linux and FreeBSD*: We map `thread_prio` to a value to be supplied to the `nice` system call. Since a lower niceness value for a process indicates a higher process priority, increasing `thread_prio` has the effect of lowering the `nice` value.

    **Table 21.12 Mapping of thread\_prio to nice values on Linux and FreeBSD**

    <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>32

    Some operating systems may provide for a maximum process niceness level of 20, but this is not supported by all targeted versions; for this reason, we choose 19 as the maximum `nice` value that can be set.

  + *Solaris*: Setting `thread_prio` on Solaris sets the Solaris FX priority, with mappings as shown in the following table:

    **Table 21.13 Mapping of thread\_prio to FX priority on Solaris**

    <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>33

    A `thread_prio` setting of 9 is mapped on Solaris to the special FX priority value 59, which means that the operating system also attempts to force the thread to run alone on its own CPU core.

  + *Windows*: We map `thread_prio` to a Windows thread priority value passed to the Windows API `SetThreadPriority()` function. This mapping is shown in the following table:

    **Table 21.14 Mapping of thread\_prio to Windows thread priority**

    <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>34

  The *`type`* attribute represents an NDB thread type. The thread types supported, and the range of permitted `count` values for each, are provided in the following list:

  + `ldm`: Local query handler (`DBLQH` kernel block) that handles data. The more LDM threads that are used, the more highly partitioned the data becomes. Each LDM thread maintains its own sets of data and index partitions, as well as its own redo log. The value set for `ldm` must be one of the values 1, 2, 4, 6, 8, 12, 16, 24, or 32.

    Changing the number of LDM threads normally requires an initial system restart to be effective and safe for cluster operations. This requirement is relaxed in NDB 7.6, as explained later in this section. (This is also true when this is done using `MaxNoOfExecutionThreads`.) *NDB 7.5 and earlier*: If `IndexMemory` usage is in excess of 50%, an initial restart of the cluster is required; a maximum of 30-35% `IndexMemory` usage is recommended in such cases. Otherwise, allocation of memory and LDM threads cannot be balanced between nodes, which can ultimately lead to data node failures.

    Adding large tablespaces (hundreds of gigabytes or more) for Disk Data tables when using more than the default number of LDMs may cause issues with resource and CPU usage if `DiskPageBufferMemory` is not sufficiently large.

  + `tc`: Transaction coordinator thread (`DBTC` kernel block) containing the state of an ongoing transaction. The maximum number of TC threads is 32.

    Optimally, every new transaction can be assigned to a new TC thread. In most cases 1 TC thread per 2 LDM threads is sufficient to guarantee that this can happen. In cases where the number of writes is relatively small when compared to the number of reads, it is possible that only 1 TC thread per 4 LQH threads is required to maintain transaction states. Conversely, in applications that perform a great many updates, it may be necessary for the ratio of TC threads to LDM threads to approach 1 (for example, 3 TC threads to 4 LDM threads).

    Setting `tc` to 0 causes TC handling to be done by the main thread. In most cases, this is effectively the same as setting it to 1.

    Range: 0 - 32

  + `main`: Data dictionary and transaction coordinator (`DBDIH` and `DBTC` kernel blocks), providing schema management. This is always handled by a single dedicated thread.

    Range: 1 only.

  + `recv`: Receive thread (`CMVMI` kernel block). Each receive thread handles one or more sockets for communicating with other nodes in an NDB Cluster, with one socket per node. NDB Cluster supports multiple receive threads; the maximum is 16 such threads.

    Range: 1 - 16

  + `send`: Send thread (`CMVMI` kernel block). To increase throughput, it is possible to perform sends from one or more separate, dedicated threads (maximum 8).

    Previously, all threads handled their own sending directly; this can still be made to happen by setting the number of send threads to 0 (this also happens when `MaxNoOfExecutionThreads` is set less than 10). While doing so can have an adeverse impact on throughput, it can also in some cases provide decreased latency.

    Range: 0 - 16

  + `rep`: Replication thread (`SUMA` kernel block). Asynchronous replication operations are always handled by a single, dedicated thread.

    Range: 1 only.

  + `io`: File system and other miscellaneous operations. These are not demanding tasks, and are always handled as a group by a single, dedicated I/O thread.

    Range: 1 only.

  + `watchdog`: Parameters settings associated with this type are actually applied to several threads, each having a specific use. These threads include the `SocketServer` thread, which receives connection setups from other nodes; the `SocketClient` thread, which attempts to set up connections to other nodes; and the thread watchdog thread that checks that threads are progressing.

    Range: 1 only.

  + `idxbld`: Offline index build threads. Unlike the other thread types listed previously, which are permanent, these are temporary threads which are created and used only during node or system restarts, or when running **ndb\_restore** `--rebuild-indexes`. They may be bound to CPU sets which overlap with CPU sets bound to permanent thread types.

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

  It is usually desirable when configuring thread usage for a data node host to reserve one or more number of CPUs for operating system and other tasks. Thus, for a host machine with 24 CPUs, you might want to use 20 CPU threads (leaving 4 for other uses), with 8 LDM threads, 4 TC threads (half the number of LDM threads), 3 send threads, 3 receive threads, and 1 thread each for schema management, asynchronous replication, and I/O operations. (This is almost the same distribution of threads used when `MaxNoOfExecutionThreads` is set equal to 20.) The following `ThreadConfig` setting performs these assignments, additionally binding all of these threads to specific CPUs:

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

  In this case we create two LDM groups; the first uses `cpubind` and the second uses `cpuset`. `thread_prio` and `spintime` are set to the same values for each group. This means there are eight LDM threads in total. (You should ensure that `NoOfFragmentLogParts` is also set to 8.) The four TC threads use only two CPUs; it is possible when using `cpuset` to specify fewer CPUs than threads in the group. (This is not true for `cpubind`.) The send threads use two threads using `cpubind` to bind these threads to CPUs 10 and 11. The main and rep threads can reuse these CPUs.

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

* `DiskPageBufferEntries`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>35

  This is the number of page entries (page references) to allocate. It is specified as a number of 32K pages in `DiskPageBufferMemory`. The default is sufficient for most cases but you may need to increase the value of this parameter if you encounter problems with very large transactions on Disk Data tables. Each page entry requires approximately 100 bytes.

* `DiskPageBufferMemory`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>36

  This determines the amount of space used for caching pages on disk, and is set in the `[ndbd]` or `[ndbd default]` section of the `config.ini` file. It is measured in bytes. Each page takes up 32 KB. This means that NDB Cluster Disk Data storage always uses *`N`* \* 32 KB memory where *`N`* is some nonnegative integer.

  The default value for this parameter is `64M` (2000 pages of 32 KB each).

  If the value for `DiskPageBufferMemory` is set too low in conjunction with using more than the default number of LDM threads in `ThreadConfig` (for example `{ldm=6...}`), problems can arise when trying to add a large (for example 500G) data file to a disk-based `NDB` table, wherein the process takes indefinitely long while occupying one of the CPU cores.

  This is due to the fact that, as part of adding a data file to a tablespace, extent pages are locked into memory in an extra PGMAN worker thread, for quick metadata access. When adding a large file, this worker has insufficient memory for all of the data file metadata. In such cases, you should either increase `DiskPageBufferMemory`, or add smaller tablespace files. You may also need to adjust `DiskPageBufferEntries`.

  You can query the `ndbinfo.diskpagebuffer` table to help determine whether the value for this parameter should be increased to minimize unnecessary disk seeks. See Section 21.6.15.20, “The ndbinfo diskpagebuffer Table”, for more information.

* `SharedGlobalMemory`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>37

  This parameter determines the amount of memory that is used for log buffers, disk operations (such as page requests and wait queues), and metadata for tablespaces, log file groups, `UNDO` files, and data files. The shared global memory pool also provides memory used for satisfying the memory requirements of the `UNDO_BUFFER_SIZE` option used with `CREATE LOGFILE GROUP` and `ALTER LOGFILE GROUP` statements, including any default value implied for this options by the setting of the `InitialLogFileGroup` data node configuration parameter. `SharedGlobalMemory` can be set in the `[ndbd]` or `[ndbd default]` section of the `config.ini` configuration file, and is measured in bytes.

  The default value is `128M`.

* `DiskIOThreadPool`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>38

  This parameter determines the number of unbound threads used for Disk Data file access. Before `DiskIOThreadPool` was introduced, exactly one thread was spawned for each Disk Data file, which could lead to performance issues, particularly when using very large data files. With `DiskIOThreadPool`, you can—for example—access a single large data file using several threads working in parallel.

  This parameter applies to Disk Data I/O threads only.

  The optimum value for this parameter depends on your hardware and configuration, and includes these factors:

  + **Physical distribution of Disk Data files.** You can obtain better performance by placing data files, undo log files, and the data node file system on separate physical disks. If you do this with some or all of these sets of files, then you can set `DiskIOThreadPool` higher to enable separate threads to handle the files on each disk.

  + **Disk performance and types.** The number of threads that can be accommodated for Disk Data file handling is also dependent on the speed and throughput of the disks. Faster disks and higher throughput allow for more disk I/O threads. Our test results indicate that solid-state disk drives can handle many more disk I/O threads than conventional disks, and thus higher values for `DiskIOThreadPool`.

  The default value for this parameter is 2.

* **Disk Data file system parameters.** The parameters in the following list make it possible to place NDB Cluster Disk Data files in specific directories without the need for using symbolic links.

  + `FileSystemPathDD`

    <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>39

    If this parameter is specified, then NDB Cluster Disk Data data files and undo log files are placed in the indicated directory. This can be overridden for data files, undo log files, or both, by specifying values for `FileSystemPathDataFiles`, `FileSystemPathUndoFiles`, or both, as explained for these parameters. It can also be overridden for data files by specifying a path in the `ADD DATAFILE` clause of a `CREATE TABLESPACE` or `ALTER TABLESPACE` statement, and for undo log files by specifying a path in the `ADD UNDOFILE` clause of a `CREATE LOGFILE GROUP` or `ALTER LOGFILE GROUP` statement. If `FileSystemPathDD` is not specified, then `FileSystemPath` is used.

    If a `FileSystemPathDD` directory is specified for a given data node (including the case where the parameter is specified in the `[ndbd default]` section of the `config.ini` file), then starting that data node with `--initial` causes all files in the directory to be deleted.

  + `FileSystemPathDataFiles`

    <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>40

    If this parameter is specified, then NDB Cluster Disk Data data files are placed in the indicated directory. This overrides any value set for `FileSystemPathDD`. This parameter can be overridden for a given data file by specifying a path in the `ADD DATAFILE` clause of a `CREATE TABLESPACE` or `ALTER TABLESPACE` statement used to create that data file. If `FileSystemPathDataFiles` is not specified, then `FileSystemPathDD` is used (or `FileSystemPath`, if `FileSystemPathDD` has also not been set).

    If a `FileSystemPathDataFiles` directory is specified for a given data node (including the case where the parameter is specified in the `[ndbd default]` section of the `config.ini` file), then starting that data node with `--initial` causes all files in the directory to be deleted.

  + `FileSystemPathUndoFiles`

    <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>41

    If this parameter is specified, then NDB Cluster Disk Data undo log files are placed in the indicated directory. This overrides any value set for `FileSystemPathDD`. This parameter can be overridden for a given data file by specifying a path in the `ADD UNDO` clause of a `CREATE LOGFILE GROUP` or `ALTER LOGFILE GROUP` statement used to create that data file. If `FileSystemPathUndoFiles` is not specified, then `FileSystemPathDD` is used (or `FileSystemPath`, if `FileSystemPathDD` has also not been set).

    If a `FileSystemPathUndoFiles` directory is specified for a given data node (including the case where the parameter is specified in the `[ndbd default]` section of the `config.ini` file), then starting that data node with `--initial` causes all files in the directory to be deleted.

  For more information, see Section 21.6.11.1, “NDB Cluster Disk Data Objects”.

* **Disk Data object creation parameters.** The next two parameters enable you—when starting the cluster for the first time—to cause a Disk Data log file group, tablespace, or both, to be created without the use of SQL statements.

  + `InitialLogFileGroup`

    <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>42

    This parameter can be used to specify a log file group that is created when performing an initial start of the cluster. `InitialLogFileGroup` is specified as shown here:

    ```sql
    InitialLogFileGroup = [name=name;] [undo_buffer_size=size;] file-specification-list

    file-specification-list:
        file-specification[; file-specification[; ...]]

    file-specification:
        filename:size
    ```

    The `name` of the log file group is optional and defaults to `DEFAULT-LG`. The `undo_buffer_size` is also optional; if omitted, it defaults to `64M`. Each *`file-specification`* corresponds to an undo log file, and at least one must be specified in the *`file-specification-list`*. Undo log files are placed according to any values that have been set for `FileSystemPath`, `FileSystemPathDD`, and `FileSystemPathUndoFiles`, just as if they had been created as the result of a `CREATE LOGFILE GROUP` or `ALTER LOGFILE GROUP` statement.

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

    Resources for the initial log file group are added to the global memory pool along with those indicated by the value of `SharedGlobalMemory`.

    This parameter, if used, should always be set in the `[ndbd default]` section of the `config.ini` file. The behavior of an NDB Cluster when different values are set on different data nodes is not defined.

  + `InitialTablespace`

    <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>43

    This parameter can be used to specify an NDB Cluster Disk Data tablespace that is created when performing an initial start of the cluster. `InitialTablespace` is specified as shown here:

    ```sql
    InitialTablespace = [name=name;] [extent_size=size;] file-specification-list
    ```

    The `name` of the tablespace is optional and defaults to `DEFAULT-TS`. The `extent_size` is also optional; it defaults to `1M`. The *`file-specification-list`* uses the same syntax as shown with the `InitialLogfileGroup` parameter, the only difference being that each *`file-specification`* used with `InitialTablespace` corresponds to a data file. At least one must be specified in the *`file-specification-list`*. Data files are placed according to any values that have been set for `FileSystemPath`, `FileSystemPathDD`, and `FileSystemPathDataFiles`, just as if they had been created as the result of a `CREATE TABLESPACE` or `ALTER TABLESPACE` statement.

    For example, consider the following line specifying `InitialTablespace` in the `[ndbd default]` section of the `config.ini` file (as with `InitialLogfileGroup`, this parameter should always be set in the `[ndbd default]` section, as the behavior of an NDB Cluster when different values are set on different data nodes is not defined):

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

You can help prevent these errors from occurring by using faster disks, and by placing Disk Data files on a separate disk from the data node file system. Reducing the value of `TimeBetweenGlobalCheckpoints` tends to decrease the amount of data to be written for each global checkpoint, and so may provide some protection against redo log buffer overflows when trying to write a global checkpoint; however, reducing this value also permits less time in which to write the GCP, so this must be done with caution.

In addition to the considerations given for `DiskPageBufferMemory` as explained previously, it is also very important that the `DiskIOThreadPool` configuration parameter be set correctly; having `DiskIOThreadPool` set too high is very likely to cause GCP stop errors (Bug #37227).

GCP stops can be caused by save or commit timeouts; the `TimeBetweenEpochsTimeout` data node configuration parameter determines the timeout for commits. However, it is possible to disable both types of timeouts by setting this parameter to 0.

**Parameters for configuring send buffer memory allocation.** Send buffer memory is allocated dynamically from a memory pool shared between all transporters, which means that the size of the send buffer can be adjusted as necessary. (Previously, the NDB kernel used a fixed-size send buffer for every node in the cluster, which was allocated when the node started and could not be changed while the node was running.) The `TotalSendBufferMemory` and `OverLoadLimit` data node configuration parameters permit the setting of limits on this memory allocation. For more information about the use of these parameters (as well as `SendBufferMemory`), see Section 21.4.3.13, “Configuring NDB Cluster Send Buffer Parameters”.

* `ExtraSendBufferMemory`

  This parameter specifies the amount of transporter send buffer memory to allocate in addition to any set using `TotalSendBufferMemory`, `SendBufferMemory`, or both.

* `TotalSendBufferMemory`

  This parameter is used to determine the total amount of memory to allocate on this node for shared send buffer memory among all configured transporters.

  If this parameter is set, its minimum permitted value is 256KB; 0 indicates that the parameter has not been set. For more detailed information, see Section 21.4.3.13, “Configuring NDB Cluster Send Buffer Parameters”.

See also Section 21.6.7, “Adding NDB Cluster Data Nodes Online”.

**Redo log over-commit handling.** It is possible to control a data node's handling of operations when too much time is taken flushing redo logs to disk. This occurs when a given redo log flush takes longer than `RedoOverCommitLimit` seconds, more than `RedoOverCommitCounter` times, causing any pending transactions to be aborted. When this happens, the API node that sent the transaction can handle the operations that should have been committed either by queuing the operations and re-trying them, or by aborting them, as determined by `DefaultOperationRedoProblemAction`. The data node configuration parameters for setting the timeout and number of times it may be exceeded before the API node takes this action are described in the following list:

* `RedoOverCommitCounter`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>44

  When `RedoOverCommitLimit` is exceeded when trying to write a given redo log to disk this many times or more, any transactions that were not committed as a result are aborted, and an API node where any of these transactions originated handles the operations making up those transactions according to its value for `DefaultOperationRedoProblemAction` (by either queuing the operations to be re-tried, or aborting them).

* `RedoOverCommitLimit`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>45

  This parameter sets an upper limit in seconds for trying to write a given redo log to disk before timing out. The number of times the data node tries to flush this redo log, but takes longer than `RedoOverCommitLimit`, is kept and compared with `RedoOverCommitCounter`, and when flushing takes too long more times than the value of that parameter, any transactions that were not committed as a result of the flush timeout are aborted. When this occurs, the API node where any of these transactions originated handles the operations making up those transactions according to its `DefaultOperationRedoProblemAction` setting (it either queues the operations to be re-tried, or aborts them).

**Controlling restart attempts.** It is possible to exercise finely-grained control over restart attempts by data nodes when they fail to start using the `MaxStartFailRetries` and `StartFailRetryDelay` data node configuration parameters.

`MaxStartFailRetries` limits the total number of retries made before giving up on starting the data node, `StartFailRetryDelay` sets the number of seconds between retry attempts. These parameters are listed here:

* `StartFailRetryDelay`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>46

  Use this parameter to set the number of seconds between restart attempts by the data node in the event on failure on startup. The default is 0 (no delay).

  Both this parameter and `MaxStartFailRetries` are ignored unless `StopOnError` is equal to 0.

* `MaxStartFailRetries`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>47

  Use this parameter to limit the number restart attempts made by the data node in the event that it fails on startup. The default is 3 attempts.

  Both this parameter and `StartFailRetryDelay` are ignored unless `StopOnError` is equal to 0.

**NDB index statistics parameters.**

The parameters in the following list relate to NDB index statistics generation.

* `IndexStatAutoCreate`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>48

  Enable (set equal to 1) or disable (set equal to 0) automatic statistics collection when indexes are created.

* `IndexStatAutoUpdate`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>49

  Enable (set equal to 1) or disable (set equal to 0) monitoring of indexes for changes, and trigger automatic statistics updates when these are detected. The degree of change needed to trigger the updates are determined by the settings for the `IndexStatTriggerPct` and `IndexStatTriggerScale` options.

* `IndexStatSaveSize`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>50

  Maximum space in bytes allowed for the saved statistics of any given index in the `NDB` system tables and in the `mysqld` memory cache. In NDB 7.5 and earlier, this consumes `IndexMemory`.

  At least one sample is always produced, regardless of any size limit. This size is scaled by `IndexStatSaveScale`.

  The size specified by `IndexStatSaveSize` is scaled by the value of `IndexStatTriggerPct` for a large index, times 0.01. This is further multiplied by the logarithm to the base 2 of the index size. Setting `IndexStatTriggerPct` equal to 0 disables the scaling effect.

* `IndexStatSaveScale`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>51

  The size specified by `IndexStatSaveSize` is scaled by the value of `IndexStatTriggerPct` for a large index, times 0.01. This is further multiplied by the logarithm to the base 2 of the index size. Setting `IndexStatTriggerPct` equal to 0 disables the scaling effect.

* `IndexStatTriggerPct`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>52

  Percentage change in updates that triggers an index statistics update. The value is scaled by `IndexStatTriggerScale`. You can disable this trigger altogether by setting `IndexStatTriggerPct` to 0.

* `IndexStatTriggerScale`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>53

  Scale `IndexStatTriggerPct` by this amount times 0.01 for a large index. A value of 0 disables scaling.

* `IndexStatUpdateDelay`

  <table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>54

  Minimum delay in seconds between automatic index statistics updates for a given index. Setting this variable to 0 disables any delay. The default is 60 seconds.

**Restart types.** Information about the restart types used by the parameter descriptions in this section is shown in the following table:

**Table 21.15 NDB Cluster restart types**

<table frame="box" rules="all" summary="ExecuteOnComputer data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>55


#### 21.4.3.7 Defining SQL and Other API Nodes in an NDB Cluster

The `[mysqld]` and `[api]` sections in the `config.ini` file define the behavior of the MySQL servers (SQL nodes) and other applications (API nodes) used to access cluster data. None of the parameters shown is required. If no computer or host name is provided, any host can use this SQL or API node.

Generally speaking, a `[mysqld]` section is used to indicate a MySQL server providing an SQL interface to the cluster, and an `[api]` section is used for applications other than `mysqld` processes accessing cluster data, but the two designations are actually synonymous; you can, for instance, list parameters for a MySQL server acting as an SQL node in an `[api]` section.

Note

For a discussion of MySQL server options for NDB Cluster, see Section 21.4.3.9.1, “MySQL Server Options for NDB Cluster”. For information about MySQL server system variables relating to NDB Cluster, see Section 21.4.3.9.2, “NDB Cluster System Variables”.

* `Id`

  <table frame="box" rules="all" summary="Id API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The `Id` is an integer value used to identify the node in all cluster internal messages. The permitted range of values is 1 to 255 inclusive. This value must be unique for each node in the cluster, regardless of the type of node.

  Note

  Data node IDs must be less than 49, regardless of the NDB Cluster version used. If you plan to deploy a large number of data nodes, it is a good idea to limit the node IDs for API nodes (and management nodes) to values greater than 48.

  `NodeId` is the preferred parameter name to use when identifying API nodes. (`Id` continues to be supported for backward compatibility, but is now deprecated and generates a warning when used. It is also subject to future removal.)

* `ConnectionMap`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Specifies which data nodes to connect.

* `NodeId`

  <table frame="box" rules="all" summary="NodeId API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The `NodeId` is an integer value used to identify the node in all cluster internal messages. The permitted range of values is 1 to 255 inclusive. This value must be unique for each node in the cluster, regardless of the type of node.

  Note

  Data node IDs must be less than 49, regardless of the NDB Cluster version used. If you plan to deploy a large number of data nodes, it is a good idea to limit the node IDs for API nodes (and management nodes) to values greater than 48.

  `NodeId` is the preferred parameter name to use when identifying management nodes. An alias, `Id`, was used for this purpose in very old versions of NDB Cluster, and continues to be supported for backward compatibility; it is now deprecated and generates a warning when used, and is subject to removal in a future release of NDB Cluster.

* `ExecuteOnComputer`

  <table frame="box" rules="all" summary="ExecuteOnComputer API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Deprecated</th> <td>NDB 7.5.0</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This refers to the `Id` set for one of the computers (hosts) defined in a `[computer]` section of the configuration file.

  Important

  This parameter is deprecated as of NDB 7.5.0, and is subject to removal in a future release. Use the `HostName` parameter instead.

* `HostName`

  <table frame="box" rules="all" summary="HostName API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Specifying this parameter defines the host name of the computer on which the SQL node (API node) is to reside.

  If no `HostName` is specified in a given `[mysql]` or `[api]` section of the `config.ini` file, then an SQL or API node may connect using the corresponding “slot” from any host which can establish a network connection to the management server host machine. *This differs from the default behavior for data nodes, where `localhost` is assumed for `HostName` unless otherwise specified*.

* `LocationDomainId`

  <table frame="box" rules="all" summary="LocationDomainId API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.4</td> </tr><tr> <th>Type or units</th> <td>integer</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 16</td> </tr><tr> <th>Added</th> <td>NDB 7.6.4</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Assigns an SQL or other API node to a specific [availability domain](https://docs.us-phoenix-1.oraclecloud.com/Content/General/Concepts/regions.htm) (also known as an availability zone) within a cloud. By informing `NDB` which nodes are in which availability domains, performance can be improved in a cloud environment in the following ways:

  + If requested data is not found on the same node, reads can be directed to another node in the same availability domain.

  + Communication between nodes in different availability domains are guaranteed to use `NDB` transporters' WAN support without any further manual intervention.

  + The transporter's group number can be based on which availability domain is used, such that also SQL and other API nodes communicate with local data nodes in the same availability domain whenever possible.

  + The arbitrator can be selected from an availability domain in which no data nodes are present, or, if no such availability domain can be found, from a third availability domain.

  `LocationDomainId` takes an integer value between 0 and 16 inclusive, with 0 being the default; using 0 is the same as leaving the parameter unset.

* `ArbitrationRank`

  <table frame="box" rules="all" summary="ArbitrationRank API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>0-2</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 2</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter defines which nodes can act as arbitrators. Both management nodes and SQL nodes can be arbitrators. A value of 0 means that the given node is never used as an arbitrator, a value of 1 gives the node high priority as an arbitrator, and a value of 2 gives it low priority. A normal configuration uses the management server as arbitrator, setting its `ArbitrationRank` to 1 (the default for management nodes) and those for all SQL nodes to 0 (the default for SQL nodes).

  By setting `ArbitrationRank` to 0 on all management and SQL nodes, you can disable arbitration completely. You can also control arbitration by overriding this parameter; to do so, set the `Arbitration` parameter in the `[ndbd default]` section of the `config.ini` global configuration file.

* `ArbitrationDelay`

  <table frame="box" rules="all" summary="ArbitrationDelay API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>milliseconds</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Setting this parameter to any other value than 0 (the default) means that responses by the arbitrator to arbitration requests are delayed by the stated number of milliseconds. It is usually not necessary to change this value.

* `BatchByteSize`

  <table frame="box" rules="all" summary="BatchByteSize API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>bytes</td> </tr><tr> <th>Default</th> <td>16K</td> </tr><tr> <th>Range</th> <td>1K - 1M</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  For queries that are translated into full table scans or range scans on indexes, it is important for best performance to fetch records in properly sized batches. It is possible to set the proper size both in terms of number of records (`BatchSize`) and in terms of bytes (`BatchByteSize`). The actual batch size is limited by both parameters.

  The speed at which queries are performed can vary by more than 40% depending upon how this parameter is set.

  This parameter is measured in bytes. The default value is 16K.

* `BatchSize`

  <table frame="box" rules="all" summary="BatchSize API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>records</td> </tr><tr> <th>Default</th> <td>256</td> </tr><tr> <th>Range</th> <td>1 - 992</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter is measured in number of records and is by default set to 256. The maximum size is 992.

* `ExtraSendBufferMemory`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>0

  This parameter specifies the amount of transporter send buffer memory to allocate in addition to any that has been set using `TotalSendBufferMemory`, `SendBufferMemory`, or both.

* `HeartbeatThreadPriority`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>1

  Use this parameter to set the scheduling policy and priority of heartbeat threads for management and API nodes. The syntax for setting this parameter is shown here:

  ```sql
  HeartbeatThreadPriority = policy[, priority]

  policy:
    {FIFO | RR}
  ```

  When setting this parameter, you must specify a policy. This is one of `FIFO` (first in, first in) or `RR` (round robin). This followed optionally by the priority (an integer).

* `MaxScanBatchSize`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>2

  The batch size is the size of each batch sent from each data node. Most scans are performed in parallel to protect the MySQL Server from receiving too much data from many nodes in parallel; this parameter sets a limit to the total batch size over all nodes.

  The default value of this parameter is set to 256KB. Its maximum size is 16MB.

* `TotalSendBufferMemory`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>3

  This parameter is used to determine the total amount of memory to allocate on this node for shared send buffer memory among all configured transporters.

  If this parameter is set, its minimum permitted value is 256KB; 0 indicates that the parameter has not been set. For more detailed information, see Section 21.4.3.13, “Configuring NDB Cluster Send Buffer Parameters”.

* `AutoReconnect`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>4

  This parameter is `false` by default. This forces disconnected API nodes (including MySQL Servers acting as SQL nodes) to use a new connection to the cluster rather than attempting to re-use an existing one, as re-use of connections can cause problems when using dynamically-allocated node IDs. (Bug #45921)

  Note

  This parameter can be overridden using the NDB API. For more information, see Ndb\_cluster\_connection::set\_auto\_reconnect(), and Ndb\_cluster\_connection::get\_auto\_reconnect().

* `DefaultOperationRedoProblemAction`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>5

  This parameter (along with `RedoOverCommitLimit` and `RedoOverCommitCounter`) controls the data node's handling of operations when too much time is taken flushing redo logs to disk. This occurs when a given redo log flush takes longer than `RedoOverCommitLimit` seconds, more than `RedoOverCommitCounter` times, causing any pending transactions to be aborted.

  When this happens, the node can respond in either of two ways, according to the value of `DefaultOperationRedoProblemAction`, listed here:

  + `ABORT`: Any pending operations from aborted transactions are also aborted.

  + `QUEUE`: Pending operations from transactions that were aborted are queued up to be re-tried. This the default. Pending operations are still aborted when the redo log runs out of space—that is, when P\_TAIL\_PROBLEM errors occur.

* `DefaultHashMapSize`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>6

  The size of the table hash maps used by `NDB` is configurable using this parameter. `DefaultHashMapSize` can take any of three possible values (0, 240, 3840).

  The original intended use for this parameter was to facilitate upgrades and especially downgrades to and from very old releases with differing default hash map sizes. This is not an issue when upgrading from NDB Cluster 7.3 (or later) to later versions.

  Decreasing this parameter online after any tables have been created or modified with `DefaultHashMapSize` equal to 3840 is not currently supported.

* `Wan`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>7

  Use WAN TCP setting as default.

* `ConnectBackoffMaxTime`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>8

  In an NDB Cluster with many unstarted data nodes, the value of this parameter can be raised to circumvent connection attempts to data nodes which have not yet begun to function in the cluster, as well as moderate high traffic to management nodes. As long as the API node is not connected to any new data nodes, the value of the `StartConnectBackoffMaxTime` parameter is applied; otherwise, `ConnectBackoffMaxTime` is used to determine the length of time in milliseconds to wait between connection attempts.

  Time elapsed *during* node connection attempts is not taken into account when calculating elapsed time for this parameter. The timeout is applied with approximately 100 ms resolution, starting with a 100 ms delay; for each subsequent attempt, the length of this period is doubled until it reaches `ConnectBackoffMaxTime` milliseconds, up to a maximum of 100000 ms (100s).

  Once the API node is connected to a data node and that node reports (in a heartbeat message) that it has connected to other data nodes, connection attempts to those data nodes are no longer affected by this parameter, and are made every 100 ms thereafter until connected. Once a data node has started, it can take up `HeartbeatIntervalDbApi` for the API node to be notified that this has occurred.

* `StartConnectBackoffMaxTime`

  <table frame="box" rules="all" summary="ConnectionMap API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>9

  In an NDB Cluster with many unstarted data nodes, the value of this parameter can be raised to circumvent connection attempts to data nodes which have not yet begun to function in the cluster, as well as moderate high traffic to management nodes. As long as the API node is not connected to any new data nodes, the value of the `StartConnectBackoffMaxTime` parameter is applied; otherwise, `ConnectBackoffMaxTime` is used to determine the length of time in milliseconds to wait between connection attempts.

  Time elapsed *during* node connection attempts is not taken into account when calculating elapsed time for this parameter. The timeout is applied with approximately 100 ms resolution, starting with a 100 ms delay; for each subsequent attempt, the length of this period is doubled until it reaches `StartConnectBackoffMaxTime` milliseconds, up to a maximum of 100000 ms (100s).

  Once the API node is connected to a data node and that node reports (in a heartbeat message) that it has connected to other data nodes, connection attempts to those data nodes are no longer affected by this parameter, and are made every 100 ms thereafter until connected. Once a data node has started, it can take up `HeartbeatIntervalDbApi` for the API node to be notified that this has occurred.

**API Node Debugging Parameters.** You can use the `ApiVerbose` configuration parameter to enable debugging output from a given API node. This parameter takes an integer value. 0 is the default, and disables such debugging; 1 enables debugging output to the cluster log; 2 adds `DBDICT` debugging output as well. (Bug #20638450) See also DUMP 1229.

You can also obtain information from a MySQL server running as an NDB Cluster SQL node using `SHOW STATUS` in the **mysql** client, as shown here:

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

For information about the status variables appearing in the output from this statement, see Section 21.4.3.9.3, “NDB Cluster Status Variables”.

Note

To add new SQL or API nodes to the configuration of a running NDB Cluster, it is necessary to perform a rolling restart of all cluster nodes after adding new `[mysqld]` or `[api]` sections to the `config.ini` file (or files, if you are using more than one management server). This must be done before the new SQL or API nodes can connect to the cluster.

It is *not* necessary to perform any restart of the cluster if new SQL or API nodes can employ previously unused API slots in the cluster configuration to connect to the cluster.

**Restart types.** Information about the restart types used by the parameter descriptions in this section is shown in the following table:

**Table 21.16 NDB Cluster restart types**

<table frame="box" rules="all" summary="NodeId API node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Initial System Restart: </strong></span>Requires a complete shutdown of the cluster, wiping and restoring the cluster file system from a backup, and then restarting the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>0


#### 21.4.3.8 Defining the System

The `[system]` section is used for parameters applying to the cluster as a whole. The `Name` system parameter is used with MySQL Enterprise Monitor; `ConfigGenerationNumber` and `PrimaryMGMNode` are not used in production environments. Except when using NDB Cluster with MySQL Enterprise Monitor, is not necessary to have a `[system]` section in the `config.ini` file.

More information about these parameters can be found in the following list:

* `ConfigGenerationNumber`

  <table frame="box" rules="all" summary="ConfigGenerationNumber system configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Configuration generation number. This parameter is currently unused.

* `Name`

  <table frame="box" rules="all" summary="Name system configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Set a name for the cluster. This parameter is required for deployments with MySQL Enterprise Monitor; it is otherwise unused.

  You can obtain the value of this parameter by checking the `Ndb_system_name` status variable. In NDB API applications, you can also retrieve it using `get_system_name()`.

* `PrimaryMGMNode`

  <table frame="box" rules="all" summary="PrimaryMGMNode system configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Node ID of the primary management node. This parameter is currently unused.

**Restart types.** Information about the restart types used by the parameter descriptions in this section is shown in the following table:

**Table 21.17 NDB Cluster restart types**

<table><col style="width: 10%"/><col style="width: 30%"/><col style="width: 60%"/><thead><tr> <th>Symbol</th> <th>Restart Type</th> <th>Description</th> </tr></thead><tbody><tr> <th>N</th> <td>Node</td> <td>The parameter can be updated using a rolling restart (see Section 21.6.5, “Performing a Rolling Restart of an NDB Cluster”)</td> </tr><tr> <th>S</th> <td>System</td> <td>All cluster nodes must be shut down completely, then restarted, to effect a change in this parameter</td> </tr><tr> <th>I</th> <td>Initial</td> <td>Data nodes must be restarted using the <code>--initial</code> option</td> </tr></tbody></table>


#### 21.4.3.9 MySQL Server Options and Variables for NDB Cluster

This section provides information about MySQL server options, server and status variables that are specific to NDB Cluster. For general information on using these, and for other options and variables not specific to NDB Cluster, see Section 5.1, “The MySQL Server”.

For NDB Cluster configuration parameters used in the cluster configuration file (usually named `config.ini`), see Section 21.4, “Configuration of NDB Cluster”.

##### 21.4.3.9.1 MySQL Server Options for NDB Cluster

This section provides descriptions of `mysqld` server options relating to NDB Cluster. For information about `mysqld` options not specific to NDB Cluster, and for general information about the use of options with `mysqld`, see Section 5.1.6, “Server Command Options”.

For information about command-line options used with other NDB Cluster processes, see Section 21.5, “NDB Cluster Programs”.

* `--ndbcluster`

  <table frame="box" rules="all" summary="Properties for ndbcluster"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndbcluster[=value]</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-ndbcluster</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  The `NDBCLUSTER` storage engine is necessary for using NDB Cluster. If a `mysqld` binary includes support for the `NDBCLUSTER` storage engine, the engine is disabled by default. Use the `--ndbcluster` option to enable it. Use `--skip-ndbcluster` to explicitly disable the engine.

  It is not necessary or desirable to use this option together with `--initialize`. Beginning with NDB 7.5.4, `--ndbcluster` is ignored (and the `NDB` storage engine is *not* enabled) if `--initialize` is also used. (Bug #81689, Bug #23518923)

* `--ndb-allow-copying-alter-table=[ON|OFF]`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Let `ALTER TABLE` and other DDL statements use copying operations on `NDB` tables. Set to `OFF` to keep this from happening; doing so may improve performance of critical applications.

* `--ndb-batch-size=#`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

  This sets the size in bytes that is used for NDB transaction batches.

* `--ndb-cluster-connection-pool=#`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>63</code></td> </tr></tbody></table>

  By setting this option to a value greater than 1 (the default), a `mysqld` process can use multiple connections to the cluster, effectively mimicking several SQL nodes. Each connection requires its own `[api]` or `[mysqld]` section in the cluster configuration (`config.ini`) file, and counts against the maximum number of API connections supported by the cluster.

  Suppose that you have 2 cluster host computers, each running an SQL node whose `mysqld` process was started with `--ndb-cluster-connection-pool=4`; this means that the cluster must have 8 API slots available for these connections (instead of 2). All of these connections are set up when the SQL node connects to the cluster, and are allocated to threads in a round-robin fashion.

  This option is useful only when running `mysqld` on host machines having multiple CPUs, multiple cores, or both. For best results, the value should be smaller than the total number of cores available on the host machine. Setting it to a value greater than this is likely to degrade performance severely.

  Important

  Because each SQL node using connection pooling occupies multiple API node slots—each slot having its own node ID in the cluster—you must *not* use a node ID as part of the cluster connection string when starting any `mysqld` process that employs connection pooling.

  Setting a node ID in the connection string when using the `--ndb-cluster-connection-pool` option causes node ID allocation errors when the SQL node attempts to connect to the cluster.

* `--ndb-cluster-connection-pool-nodeids=list`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable (≥ 5.7.10-ndb-7.5.0)</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  Specifies a comma-separated list of node IDs for connections to the cluster used by an SQL node. The number of nodes in this list must be the same as the value set for the `--ndb-cluster-connection-pool` option.

  `--ndb-cluster-connection-pool-nodeids` was added in NDB 7.5.0.

* `--ndb-blob-read-batch-bytes=bytes`

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  This option can be used to set the size (in bytes) for batching of `BLOB` data reads in NDB Cluster applications. When this batch size is exceeded by the amount of `BLOB` data to be read within the current transaction, any pending `BLOB` read operations are immediately executed.

  The maximum value for this option is 4294967295; the default is 65536. Setting it to 0 has the effect of disabling `BLOB` read batching.

  Note

  In NDB API applications, you can control `BLOB` write batching with the `setMaxPendingBlobReadBytes()` and `getMaxPendingBlobReadBytes()` methods.

* `--ndb-blob-write-batch-bytes=bytes`

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

  This option can be used to set the size (in bytes) for batching of `BLOB` data writes in NDB Cluster applications. When this batch size is exceeded by the amount of `BLOB` data to be written within the current transaction, any pending `BLOB` write operations are immediately executed.

  The maximum value for this option is 4294967295; the default is 65536. Setting it to 0 has the effect of disabling `BLOB` write batching.

  Note

  In NDB API applications, you can control `BLOB` write batching with the `setMaxPendingBlobWriteBytes()` and `getMaxPendingBlobWriteBytes()` methods.

* `--ndb-connectstring=connection_string`

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  When using the `NDBCLUSTER` storage engine, this option specifies the management server that distributes cluster configuration data. See Section 21.4.3.3, “NDB Cluster Connection Strings”, for syntax.

* `--ndb-default-column-format=[FIXED|DYNAMIC]`

  <table frame="box" rules="all" summary="Properties for ndb-default-column-format"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-default-column-format={FIXED|DYNAMIC}</code></td> </tr><tr><th>Introduced</th> <td>5.7.11-ndb-7.5.1</td> </tr><tr><th>System Variable</th> <td><code>ndb_default_column_format</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value (≥ 5.7.16-ndb-7.5.4)</th> <td><code>FIXED</code></td> </tr><tr><th>Default Value (≥ 5.7.11-ndb-7.5.1, ≤ 5.7.13-ndb-7.5.3)</th> <td><code>DYNAMIC</code></td> </tr><tr><th>Valid Values</th> <td><code>FIXED</code><code>DYNAMIC</code></td> </tr></tbody></table>

  In NDB 7.5.1 and later, sets the default `COLUMN_FORMAT` and `ROW_FORMAT` for new tables (see Section 13.1.18, “CREATE TABLE Statement”).

  In NDB 7.5.1, the default for this option was `DYNAMIC`; in NDB 7.5.4, the default was changed to `FIXED` to maintain backwards compatibility with older release series (Bug #24487363).

* `--ndb-deferred-constraints=[0|1]`

  <table frame="box" rules="all" summary="Properties for ndb-deferred-constraints"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-deferred-constraints</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_deferred_constraints</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>

  Controls whether or not constraint checks on unique indexes are deferred until commit time, where such checks are supported. `0` is the default.

  This option is not normally needed for operation of NDB Cluster or NDB Cluster Replication, and is intended primarily for use in testing.

* `--ndb-distribution=[KEYHASH|LINHASH]`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>0

  Controls the default distribution method for `NDB` tables. Can be set to either of `KEYHASH` (key hashing) or `LINHASH` (linear hashing). `KEYHASH` is the default.

* `--ndb-log-apply-status`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>1

  Causes a replica `mysqld` to log any updates received from its immediate source to the `mysql.ndb_apply_status` table in its own binary log using its own server ID rather than the server ID of the source. In a circular or chain replication setting, this allows such updates to propagate to the `mysql.ndb_apply_status` tables of any MySQL servers configured as replicas of the current `mysqld`.

  In a chain replication setup, using this option allows downstream (replica) clusters to be aware of their positions relative to all of their upstream contributors (sources).

  In a circular replication setup, this option causes changes to `ndb_apply_status` tables to complete the entire circuit, eventually propagating back to the originating NDB Cluster. This also allows a cluster acting as a source to see when its changes (epochs) have been applied to the other clusters in the circle.

  This option has no effect unless the MySQL server is started with the `--ndbcluster` option.

* `--ndb-log-empty-epochs=[ON|OFF]`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>2

  Causes epochs during which there were no changes to be written to the `ndb_apply_status` and `ndb_binlog_index` tables, even when `log_slave_updates` is enabled.

  By default this option is disabled. Disabling `--ndb-log-empty-epochs` causes epoch transactions with no changes not to be written to the binary log, although a row is still written even for an empty epoch in `ndb_binlog_index`.

  Because `--ndb-log-empty-epochs=1` causes the size of the `ndb_binlog_index` table to increase independently of the size of the binary log, users should be prepared to manage the growth of this table, even if they expect the cluster to be idle a large part of the time.

* `--ndb-log-empty-update=[ON|OFF]`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>3

  Causes updates that produced no changes to be written to the `ndb_apply_status` and `ndb_binlog_index` tables, when when `log_slave_updates` is enabled.

  By default this option is disabled (`OFF`). Disabling `--ndb-log-empty-update` causes updates with no changes not to be written to the binary log.

* `--ndb-log-exclusive-reads=[0|1]`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>4

  Starting the server with this option causes primary key reads to be logged with exclusive locks, which allows for NDB Cluster Replication conflict detection and resolution based on read conflicts. You can also enable and disable these locks at runtime by setting the value of the `ndb_log_exclusive_reads` system variable to 1 or 0, respectively. 0 (disable locking) is the default.

  For more information, see Read conflict detection and resolution.

* `--ndb-log-fail-terminate`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>5

  When this option is specified, and complete logging of all found row events is not possible, the `mysqld` process is terminated.

* `--ndb-log-orig`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>6

  Log the originating server ID and epoch in the `ndb_binlog_index` table.

  Note

  This makes it possible for a given epoch to have multiple rows in `ndb_binlog_index`, one for each originating epoch.

  For more information, see Section 21.7.4, “NDB Cluster Replication Schema and Tables”.

* `--ndb-log-transaction-id`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>7

  Causes a replica `mysqld` to write the NDB transaction ID in each row of the binary log. Such logging requires the use of the Version 2 event format for the binary log; thus, the `log_bin_use_v1_row_events` system variable must be disabled to use this option.

  `--ndb-log-transaction-id` is required to enable NDB Cluster Replication conflict detection and resolution using the `NDB$EPOCH_TRANS()` function (see NDB$EPOCH\_TRANS()")).

  For more information, see Section 21.7.11, “NDB Cluster Replication Conflict Resolution”.

* `--ndb-log-update-as-write`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>8

  Whether updates on the source are written to the binary log as updates (`OFF`) or writes (`ON`). When this option is enabled, and both `--ndb-log-updated-only` and `--ndb-log-update-minimal` are disabled, operations of different types are loǵged as described in the following list:

  + `INSERT`: Logged as a `WRITE_ROW` event with no before image; the after image is logged with all columns.

    `UPDATE`: Logged as a `WRITE_ROW` event with no before image; the after image is logged with all columns.

    `DELETE`: Logged as a `DELETE_ROW` event with all columns logged in the before image; the after image is not logged.

  This option can be used for NDB Replication conflict resolution in combination with the other two NDB logging options mentioned previously; see ndb\_replication Table, for more information.

* `--ndb-log-updated-only`

  <table frame="box" rules="all" summary="Properties for ndb-allow-copying-alter-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-allow-copying-alter-table[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable</th> <td><code>ndb_allow_copying_alter_table</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>9

  Whether `mysqld` writes updates only (`ON`) or complete rows (`OFF`) to the binary log. When this option is enabled, and both `--ndb-log-update-as-write` and `--ndb-log-update-minimal` are disabled, operations of different types are loǵged as described in the following list

  + `INSERT`: Logged as a `WRITE_ROW` event with no before image; the after image is logged with all columns.

  + `UPDATE`: Logged as an `UPDATE_ROW` event with primary key columns and updated columns present in both the before and after images.

  + `DELETE`: Logged as a `DELETE_ROW` event with primary key columns incuded in the before image; the after image is not logged.

  This option can be used for NDB Replication conflict resolution in combination with the other two NDB logging options mentioned previously; see ndb\_replication Table, for more information about how these options interact with one another.

* `--ndb-log-update-minimal`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>0

  Log updates in a minimal fashion, by writing only the primary key values in the before image, and only the changed columns in the after image. This may cause compatibility problems if replicating to storage engines other than `NDB`. When this option is enabled, and both `--ndb-log-updated-only` and `--ndb-log-update-as-write` are disabled, operations of different types are loǵged as described in the following list:

  + `INSERT`: Logged as a `WRITE_ROW` event with no before image; the after image is logged with all columns.

  + `UPDATE`: Logged as an `UPDATE_ROW` event with primary key columns in the before image; all columns *except* primary key columns are logged in the after image.

  + `DELETE`: Logged as a `DELETE_ROW` event with all columns in the before image; the after image is not logged.

  This option can be used for NDB Replication conflict resolution in combination with the other two NDB logging options mentioned previously; see ndb\_replication Table, for more information.

* `--ndb-mgmd-host=host[:port]`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>1

  Can be used to set the host and port number of a single management server for the program to connect to. If the program requires node IDs or references to multiple management servers (or both) in its connection information, use the `--ndb-connectstring` option instead.

* `--ndb-nodeid=#`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>2

  Set this MySQL server's node ID in an NDB Cluster.

  The `--ndb-nodeid` option overrides any node ID set with `--ndb-connectstring`, regardless of the order in which the two options are used.

  In addition, if `--ndb-nodeid` is used, then either a matching node ID must be found in a `[mysqld]` or `[api]` section of `config.ini`, or there must be an “open” `[mysqld]` or `[api]` section in the file (that is, a section without a `NodeId` or `Id` parameter specified). This is also true if the node ID is specified as part of the connection string.

  Regardless of how the node ID is determined, its is shown as the value of the global status variable `Ndb_cluster_node_id` in the output of `SHOW STATUS`, and as `cluster_node_id` in the `connection` row of the output of `SHOW ENGINE NDBCLUSTER STATUS`.

  For more information about node IDs for NDB Cluster SQL nodes, see Section 21.4.3.7, “Defining SQL and Other API Nodes in an NDB Cluster”.

* `--ndb-optimization-delay=milliseconds`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>3

  Set the number of milliseconds to wait between sets of rows by `OPTIMIZE TABLE` statements on `NDB` tables. The default is 10.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>4

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--ndb-transid-mysql-connection-map=state`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>5

  Enables or disables the plugin that handles the `ndb_transid_mysql_connection_map` table in the `INFORMATION_SCHEMA` database. Takes one of the values `ON`, `OFF`, or `FORCE`. `ON` (the default) enables the plugin. `OFF` disables the plugin, which makes `ndb_transid_mysql_connection_map` inaccessible. `FORCE` keeps the MySQL Server from starting if the plugin fails to load and start.

  You can see whether the `ndb_transid_mysql_connection_map` table plugin is running by checking the output of `SHOW PLUGINS`.

* `--ndb-wait-connected=seconds`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>6

  This option sets the period of time that the MySQL server waits for connections to NDB Cluster management and data nodes to be established before accepting MySQL client connections. The time is specified in seconds. The default value is `30`.

* `--ndb-wait-setup=seconds`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>7

  This variable shows the period of time that the MySQL server waits for the `NDB` storage engine to complete setup before timing out and treating `NDB` as unavailable. The time is specified in seconds. The default value is `30`.

* `--skip-ndbcluster`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>8

  Disable the `NDBCLUSTER` storage engine. This is the default for binaries that were built with `NDBCLUSTER` storage engine support; the server allocates memory and other resources for this storage engine only if the `--ndbcluster` option is given explicitly. See Section 21.4.1, “Quick Test Setup of NDB Cluster”, for an example.

##### 21.4.3.9.2 NDB Cluster System Variables

This section provides detailed information about MySQL server system variables that are specific to NDB Cluster and the `NDB` storage engine. For system variables not specific to NDB Cluster, see Section 5.1.7, “Server System Variables”. For general information on using system variables, see Section 5.1.8, “Using System Variables”.

* `ndb_autoincrement_prefetch_sz`

  <table frame="box" rules="all" summary="Properties for ndb-batch-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-batch-size</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_batch_size</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.6.22)</th> <td><code>2147483648</code></td> </tr><tr><th>Maximum Value (≥ 5.7.37-ndb-7.5.26)</th> <td><code>2147483648</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.5.25)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value (≤ 5.7.37-ndb-7.6.21)</th> <td><code>31536000</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>9

  Determines the probability of gaps in an autoincremented column. Set it to `1` to minimize this. Setting it to a high value for optimization makes inserts faster, but decreases the likelihood that consecutive autoincrement numbers are used in a batch of inserts.

  This variable affects only the number of `AUTO_INCREMENT` IDs that are fetched between statements; within a given statement, at least 32 IDs are obtained at a time.

  Important

  This variable does not affect inserts performed using `INSERT ... SELECT`.

* `ndb_cache_check_time`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>63</code></td> </tr></tbody></table>0

  The number of milliseconds that elapse between checks of NDB Cluster SQL nodes by the MySQL query cache. Setting this to 0 (the default and minimum value) means that the query cache checks for validation on every query.

  The recommended maximum value for this variable is 1000, which means that the check is performed once per second. A larger value means that the check is performed and possibly invalidated due to updates on different SQL nodes less often. It is generally not desirable to set this to a value greater than 2000.

  Note

  The query cache is deprecated as of MySQL 5.7.20, and is removed in MySQL 8.0. Deprecation includes `ndb_cache_check_time`.

* `ndb_clear_apply_status`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>63</code></td> </tr></tbody></table>1

  By the default, executing `RESET SLAVE` causes an NDB Cluster replica to purge all rows from its `ndb_apply_status` table. You can disable this by setting `ndb_clear_apply_status=OFF`.

* `ndb_data_node_neighbour`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>63</code></td> </tr></tbody></table>2

  Sets the ID of a “nearest” data node—that is, a preferred nonlocal data node is chosen to execute the transaction, rather than one running on the same host as the SQL or API node. This used to ensure that when a fully replicated table is accessed, we access it on this data node, to ensure that the local copy of the table is always used whenever possible. This can also be used for providing hints for transactions.

  This can improve data access times in the case of a node that is physically closer than and thus has higher network throughput than others on the same host.

  See Section 13.1.18.9, “Setting NDB Comment Options”, for further information.

  Added in NDB 7.5.2.

  Note

  An equivalent method `set_data_node_neighbour()` is provided for use in NDB API applications.

* `ndb_default_column_format`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>63</code></td> </tr></tbody></table>3

  In NDB 7.5.1 and later, sets the default `COLUMN_FORMAT` and `ROW_FORMAT` for new tables (see Section 13.1.18, “CREATE TABLE Statement”).

  In NDB 7.5.1, the default for this variable was `DYNAMIC`; in NDB 7.5.4, the default was changed to `FIXED` to maintain backwards compatibility with older release series (Bug #24487363).

* `ndb_deferred_constraints`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>63</code></td> </tr></tbody></table>4

  Controls whether or not constraint checks are deferred, where these are supported. `0` is the default.

  This variable is not normally needed for operation of NDB Cluster or NDB Cluster Replication, and is intended primarily for use in testing.

* `ndb_distribution`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>63</code></td> </tr></tbody></table>5

  Controls the default distribution method for `NDB` tables. Can be set to either of `KEYHASH` (key hashing) or `LINHASH` (linear hashing). `KEYHASH` is the default.

* `ndb_eventbuffer_free_percent`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>63</code></td> </tr></tbody></table>6

  Sets the percentage of the maximum memory allocated to the event buffer (ndb\_eventbuffer\_max\_alloc) that should be available in event buffer after reaching the maximum, before starting to buffer again.

* `ndb_eventbuffer_max_alloc`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>63</code></td> </tr></tbody></table>7

  Sets the maximum amount memory (in bytes) that can be allocated for buffering events by the NDB API. 0 means that no limit is imposed, and is the default.

* `ndb_extra_logging`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>63</code></td> </tr></tbody></table>8

  This variable enables recording in the MySQL error log of information specific to the `NDB` storage engine.

  When this variable is set to 0, the only information specific to `NDB` that is written to the MySQL error log relates to transaction handling. If it set to a value greater than 0 but less than 10, `NDB` table schema and connection events are also logged, as well as whether or not conflict resolution is in use, and other `NDB` errors and information. If the value is set to 10 or more, information about `NDB` internals, such as the progress of data distribution among cluster nodes, is also written to the MySQL error log. The default is 1.

* `ndb_force_send`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_cluster_connection_pool</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>63</code></td> </tr></tbody></table>9

  Forces sending of buffers to `NDB` immediately, without waiting for other threads. Defaults to `ON`.

* `ndb_fully_replicated`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable (≥ 5.7.10-ndb-7.5.0)</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>0

  Determines whether new `NDB` tables are fully replicated. This setting can be overridden for an individual table using `COMMENT="NDB_TABLE=FULLY_REPLICATED=..."` in a `CREATE TABLE` or `ALTER TABLE` statement; see Section 13.1.18.9, “Setting NDB Comment Options”, for syntax and other information.

  Added in NDB 7.5.2.

* `ndb_index_stat_enable`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable (≥ 5.7.10-ndb-7.5.0)</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>1

  Use `NDB` index statistics in query optimization. The default is `ON`.

* `ndb_index_stat_option`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable (≥ 5.7.10-ndb-7.5.0)</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>2

  This variable is used for providing tuning options for NDB index statistics generation. The list consist of comma-separated name-value pairs of option names and values, and this list must not contain any space characters.

  Options not used when setting `ndb_index_stat_option` are not changed from their default values. For example, you can set `ndb_index_stat_option = 'loop_idle=1000ms,cache_limit=32M'`.

  Time values can be optionally suffixed with `h` (hours), `m` (minutes), or `s` (seconds). Millisecond values can optionally be specified using `ms`; millisecond values cannot be specified using `h`, `m`, or `s`.) Integer values can be suffixed with `K`, `M`, or `G`.

  The names of the options that can be set using this variable are shown in the table that follows. The table also provides brief descriptions of the options, their default values, and (where applicable) their minimum and maximum values.

  **Table 21.18 ndb\_index\_stat\_option options and values**

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable (≥ 5.7.10-ndb-7.5.0)</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>3

* `ndb_join_pushdown`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable (≥ 5.7.10-ndb-7.5.0)</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>4

  This variable controls whether joins on `NDB` tables are pushed down to the NDB kernel (data nodes). Previously, a join was handled using multiple accesses of `NDB` by the SQL node; however, when `ndb_join_pushdown` is enabled, a pushable join is sent in its entirety to the data nodes, where it can be distributed among the data nodes and executed in parallel on multiple copies of the data, with a single, merged result being returned to `mysqld`. This can reduce greatly the number of round trips between an SQL node and the data nodes required to handle such a join.

  By default, `ndb_join_pushdown` is enabled.

  **Conditions for NDB pushdown joins.** In order for a join to be pushable, it must meet the following conditions:

  1. Only columns can be compared, and all columns to be joined must use *exactly* the same data type.

     This means that expressions such as `t1.a = t2.a + constant` cannot be pushed down, and that (for example) a join on an `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") column and a `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") column also cannot be pushed down.

  2. Queries referencing `BLOB` or `TEXT` columns are not supported.

  3. Explicit locking is not supported; however, the `NDB` storage engine's characteristic implicit row-based locking is enforced.

     This means that a join using `FOR UPDATE` cannot be pushed down.

  4. In order for a join to be pushed down, child tables in the join must be accessed using one of the `ref`, `eq_ref`, or `const` access methods, or some combination of these methods.

     Outer joined child tables can only be pushed using `eq_ref`.

     If the root of the pushed join is an `eq_ref` or `const`, only child tables joined by `eq_ref` can be appended. (A table joined by `ref` is likely to become the root of another pushed join.)

     If the query optimizer decides on `Using join cache` for a candidate child table, that table cannot be pushed as a child. However, it may be the root of another set of pushed tables.

  5. Joins referencing tables explicitly partitioned by `[LINEAR] HASH`, `LIST`, or `RANGE` currently cannot be pushed down.

  You can see whether a given join can be pushed down by checking it with `EXPLAIN`; when the join can be pushed down, you can see references to the `pushed join` in the `Extra` column of the output, as shown in this example:

  ```sql
  mysql> EXPLAIN
      ->     SELECT e.first_name, e.last_name, t.title, d.dept_name
      ->         FROM employees e
      ->         JOIN dept_emp de ON e.emp_no=de.emp_no
      ->         JOIN departments d ON d.dept_no=de.dept_no
      ->         JOIN titles t ON e.emp_no=t.emp_no\G
  *************************** 1. row ***************************
             id: 1
    select_type: SIMPLE
          table: d
           type: ALL
  possible_keys: PRIMARY
            key: NULL
        key_len: NULL
            ref: NULL
           rows: 9
          Extra: Parent of 4 pushed join@1
  *************************** 2. row ***************************
             id: 1
    select_type: SIMPLE
          table: de
           type: ref
  possible_keys: PRIMARY,emp_no,dept_no
            key: dept_no
        key_len: 4
            ref: employees.d.dept_no
           rows: 5305
          Extra: Child of 'd' in pushed join@1
  *************************** 3. row ***************************
             id: 1
    select_type: SIMPLE
          table: e
           type: eq_ref
  possible_keys: PRIMARY
            key: PRIMARY
        key_len: 4
            ref: employees.de.emp_no
           rows: 1
          Extra: Child of 'de' in pushed join@1
  *************************** 4. row ***************************
             id: 1
    select_type: SIMPLE
          table: t
           type: ref
  possible_keys: PRIMARY,emp_no
            key: emp_no
        key_len: 4
            ref: employees.de.emp_no
           rows: 19
          Extra: Child of 'e' in pushed join@1
  4 rows in set (0.00 sec)
  ```

  Note

  If inner joined child tables are joined by `ref`, *and* the result is ordered or grouped by a sorted index, this index cannot provide sorted rows, which forces writing to a sorted tempfile.

  Two additional sources of information about pushed join performance are available:

  1. The status variables `Ndb_pushed_queries_defined`, `Ndb_pushed_queries_dropped`, `Ndb_pushed_queries_executed`, and `Ndb_pushed_reads`.

  2. The counters in the `ndbinfo.counters` table that belong to the `DBSPJ` kernel block.

* `ndb_log_apply_status`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable (≥ 5.7.10-ndb-7.5.0)</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>5

  A read-only variable which shows whether the server was started with the `--ndb-log-apply-status` option.

* `ndb_log_bin`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable (≥ 5.7.10-ndb-7.5.0)</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>6

  Causes updates to `NDB` tables to be written to the binary log. Setting this variable has no effect if binary logging is not already enabled for the server using `log_bin`. `ndb_log_bin` defaults to 1 (ON); normally, there is never any need to change this value in a production environment.

* `ndb_log_binlog_index`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable (≥ 5.7.10-ndb-7.5.0)</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>7

  Causes a mapping of epochs to positions in the binary log to be inserted into the `ndb_binlog_index` table. Setting this variable has no effect if binary logging is not already enabled for the server using `log_bin`. (In addition, `ndb_log_bin` must not be disabled.) `ndb_log_binlog_index` defaults to `1` (`ON`); normally, there is never any need to change this value in a production environment.

* `ndb_log_empty_epochs`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable (≥ 5.7.10-ndb-7.5.0)</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>8

  When this variable is set to 0, epoch transactions with no changes are not written to the binary log, although a row is still written even for an empty epoch in `ndb_binlog_index`.

* `ndb_log_empty_update`

  <table frame="box" rules="all" summary="Properties for ndb-cluster-connection-pool-nodeids"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-cluster-connection-pool-nodeids</code></td> </tr><tr><th>Introduced</th> <td>5.7.10-ndb-7.5.0</td> </tr><tr><th>System Variable (≥ 5.7.10-ndb-7.5.0)</th> <td><code>ndb_cluster_connection_pool_nodeids</code></td> </tr><tr><th>Scope (≥ 5.7.10-ndb-7.5.0)</th> <td>Global</td> </tr><tr><th>Dynamic (≥ 5.7.10-ndb-7.5.0)</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>9

  When this variable is set to `ON` (`1`), update transactions with no changes are written to the binary log, even when `log_slave_updates` is enabled.

* `ndb_log_exclusive_reads`

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>0

  This variable determines whether primary key reads are logged with exclusive locks, which allows for NDB Cluster Replication conflict detection and resolution based on read conflicts. To enable these locks, set the value of `ndb_log_exclusive_reads` to 1. 0, which disables such locking, is the default.

  For more information, see Read conflict detection and resolution.

* `ndb_log_orig`

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>1

  Shows whether the originating server ID and epoch are logged in the `ndb_binlog_index` table. Set using the `--ndb-log-orig` server option.

* `ndb_log_transaction_id`

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>2

  This read-only, Boolean system variable shows whether a replica `mysqld` writes NDB transaction IDs in the binary log (required to use “active-active” NDB Cluster Replication with `NDB$EPOCH_TRANS()` conflict detection). To change the setting, use the `--ndb-log-transaction-id` option.

  `ndb_log_transaction_id` is not supported in mainline MySQL Server 5.7.

  For more information, see Section 21.7.11, “NDB Cluster Replication Conflict Resolution”.

* `ndb_optimized_node_selection`

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>3

  There are two forms of optimized node selection, described here:

  1. The SQL node uses promixity to determine the transaction coordinator; that is, the “closest” data node to the SQL node is chosen as the transaction coordinator. For this purpose, a data node having a shared memory connection with the SQL node is considered to be “closest” to the SQL node; the next closest (in order of decreasing proximity) are: TCP connection to `localhost`, followed by TCP connection from a host other than `localhost`.

  2. The SQL thread uses distribution awareness to select the data node. That is, the data node housing the cluster partition accessed by the first statement of a given transaction is used as the transaction coordinator for the entire transaction. (This is effective only if the first statement of the transaction accesses no more than one cluster partition.)

  This option takes one of the integer values `0`, `1`, `2`, or `3`. `3` is the default. These values affect node selection as follows:

  + `0`: Node selection is not optimized. Each data node is employed as the transaction coordinator 8 times before the SQL thread proceeds to the next data node.

  + `1`: Proximity to the SQL node is used to determine the transaction coordinator.

  + `2`: Distribution awareness is used to select the transaction coordinator. However, if the first statement of the transaction accesses more than one cluster partition, the SQL node reverts to the round-robin behavior seen when this option is set to `0`.

  + `3`: If distribution awareness can be employed to determine the transaction coordinator, then it is used; otherwise proximity is used to select the transaction coordinator. (This is the default behavior.)

  Proximity is determined as follows:

  1. Start with the value set for the `Group` parameter (default 55).

  2. For an API node sharing the same host with other API nodes, decrement the value by 1. Assuming the default value for `Group`, the effective value for data nodes on same host as the API node is 54, and for remote data nodes 55.

  3. (*NDB 7.5.2 and later:*) Setting `ndb_data_node_neighbour` further decreases the effective `Group` value by 50, causing this node to be regarded as the nearest node. This is needed only when all data nodes are on hosts other than that hosts the API node and it is desirable to dedicate one of them to the API node. In normal cases, the default adjustment described previously is sufficient.

  Frequent changes in `ndb_data_node_neighbour` are not advisable, since this changes the state of the cluster connection and thus may disrupt the selection algorithm for new transactions from each thread until it stablilizes.

* `ndb_read_backup`

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>4

  Enable read from any fragment replica for any `NDB` table subsequently created; doing so greatly improves the table read performance at a relatively small cost to writes.

  If the SQL node and the data node use the same host name or IP address, this fact is detected automatically, so that the preference is to send reads to the same host. If these nodes are on the same host but use different IP addresses, you can tell the SQL node to use the correct data node by setting the value of `ndb_data_node_neighbour` on the SQL node to the node ID of the data node.

  To enable or disable read from any fragment replica for an individual table, you can set the `NDB_TABLE` option `READ_BACKUP` for the table accordingly, in a `CREATE TABLE` or `ALTER TABLE` statement; see Section 13.1.18.9, “Setting NDB Comment Options”, for more information.

  Added in NDB 7.5.2.

* `ndb_recv_thread_activation_threshold`

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>5

  When this number of concurrently active threads is reached, the receive thread takes over polling of the cluster connection.

  This variable is global in scope. It can also be set at startup.

* `ndb_recv_thread_cpu_mask`

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>6

  CPU mask for locking receiver threads to specific CPUs. This is specified as a hexadecimal bitmask. For example, `0x33` means that one CPU is used per receiver thread. An empty string is the default; setting `ndb_recv_thread_cpu_mask` to this value removes any receiver thread locks previously set.

  This variable is global in scope. It can also be set at startup.

* `ndb_report_thresh_binlog_epoch_slip`

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>7

  In NDB 7.5.4 and later, this represents the threshold for the number of epochs completely buffered in the event buffer, but not yet consumed by the binlog injector thread. When this degree of slippage (lag) is exceeded, an event buffer status message is reported, with `BUFFERED_EPOCHS_OVER_THRESHOLD` supplied as the reason (see Section 21.6.2.3, “Event Buffer Reporting in the Cluster Log”). Slip is increased when an epoch is received from data nodes and buffered completely in the event buffer; it is decreased when an epoch is consumed by the binlog injector thread, it is reduced. Empty epochs are buffered and queued, and so included in this calculation only when this is enabled using the `Ndb::setEventBufferQueueEmptyEpoch()` method from the NDB API.

  Prior to NDB 7.5.4, the value of this vairable served as a threshold for the number of epochs to be behind before reporting binary log status. In these previous releases, a value of `3`—the default—means that if the difference between which epoch has been received from the storage nodes and which epoch has been applied to the binary log is 3 or more, a status message is then sent to the cluster log.

* `ndb_report_thresh_binlog_mem_usage`

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>8

  This is a threshold on the percentage of free memory remaining before reporting binary log status. For example, a value of `10` (the default) means that if the amount of available memory for receiving binary log data from the data nodes falls below 10%, a status message is sent to the cluster log.

* `ndb_row_checksum`

  <table frame="box" rules="all" summary="Properties for ndb-blob-read-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-read-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_read_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>9

  Traditionally, `NDB` has created tables with row checksums, which checks for hardware issues at the expense of performance. Setting `ndb_row_checksum` to 0 means that row checksums are *not* used for new or altered tables, which has a significant impact on performance for all types of queries. This variable is set to 1 by default, to provide backward-compatible behavior.

* `ndb_show_foreign_key_mock_tables`

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>0

  Show the mock tables used by `NDB` to support `foreign_key_checks=0`. When this is enabled, extra warnings are shown when creating and dropping the tables. The real (internal) name of the table can be seen in the output of `SHOW CREATE TABLE`.

* `ndb_slave_conflict_role`

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>1

  Determine the role of this SQL node (and NDB Cluster) in a circular (“active-active”) replication setup. `ndb_slave_conflict_role` can take any one of the values `PRIMARY`, `SECONDARY`, `PASS`, or `NULL` (the default). The replica SQL thread must be stopped before you can change `ndb_slave_conflict_role`. In addition, it is not possible to change directly between `PASS` and either of `PRIMARY` or `SECONDARY` directly; in such cases, you must ensure that the SQL thread is stopped, then execute `SET @@GLOBAL.ndb_slave_conflict_role = 'NONE'` first.

  For more information, see Section 21.7.11, “NDB Cluster Replication Conflict Resolution”.

* `ndb_table_no_logging`

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>2

  When this variable is set to `ON` or `1`, it causes all tables created or altered using `ENGINE NDB` to be nonlogging; that is, no data changes for this table are written to the redo log or checkpointed to disk, just as if the table had been created or altered using the `NOLOGGING` option for `CREATE TABLE` or `ALTER TABLE`.

  For more information about nonlogging `NDB` tables, see NDB\_TABLE Options.

  `ndb_table_no_logging` has no effect on the creation of `NDB` table schema files; to suppress these, use `ndb_table_temporary` instead.

* `ndb_table_temporary`

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>3

  When set to `ON` or `1`, this variable causes `NDB` tables not to be written to disk: This means that no table schema files are created, and that the tables are not logged.

  Note

  Setting this variable currently has no effect. This is a known issue; see Bug #34036.

* `ndb_use_copying_alter_table`

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>4

  Forces `NDB` to use copying of tables in the event of problems with online `ALTER TABLE` operations. The default value is `OFF`.

* `ndb_use_exact_count`

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>5

  Forces `NDB` to use a count of records during `SELECT COUNT(*)` query planning to speed up this type of query. The default value is `OFF`, which allows for faster queries overall.

* `ndb_use_transactions`

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>6

  You can disable `NDB` transaction support by setting this variable's value to `OFF`. This is generally not recommended, although it may be useful to disable transaction support within a given client session when that session is used to import one or more dump files with large transactions; this allows a multi-row insert to be executed in parts, rather than as a single transaction. In such cases, once the import has been completed, you should either reset the variable value for this session to `ON`, or simply terminate the session.

* `ndb_version`

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>7

  `NDB` engine version, as a composite integer.

* `ndb_version_string`

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>8

  `NDB` engine version in `ndb-x.y.z` format.

* `server_id_bits`

  <table frame="box" rules="all" summary="Properties for ndb-blob-write-batch-bytes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-blob-write-batch-bytes</code></td> </tr><tr><th>System Variable</th> <td><code>ndb_blob_write_batch_bytes</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>65536</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>9

  This variable indicates the number of least significant bits within the 32-bit `server_id` which actually identify the server. Indicating that the server is actually identified by fewer than 32 bits makes it possible for some of the remaining bits to be used for other purposes, such as storing user data generated by applications using the NDB API's Event API within the `AnyValue` of an `OperationOptions` structure (NDB Cluster uses the `AnyValue` to store the server ID).

  When extracting the effective server ID from `server_id` for purposes such as detection of replication loops, the server ignores the remaining bits. The `server_id_bits` variable is used to mask out any irrelevant bits of `server_id` in the I/O and SQL threads when deciding whether an event should be ignored based on the server ID.

  This data can be read from the binary log by **mysqlbinlog**, provided that it is run with its own `server_id_bits` variable set to 32 (the default).

  If the value of `server_id` greater than or equal to 2 to the power of `server_id_bits`; otherwise, `mysqld` refuses to start.

  This system variable is supported only by NDB Cluster. It is not supported in the standard MySQL 5.7 Server.

* `slave_allow_batching`

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

  Whether or not batched updates are enabled on NDB Cluster replicas.

  Allowing batched updates on the replica greatly improves performance, particularly when replicating `TEXT`, `BLOB`, and `JSON` columns. For this reason, you should always enable `slave_allow_batching` when using NDB replication. Beginning with NDB 7.6.23, a warning is issued whenever this variable is set to `OFF`.

  Setting this variable has an effect only when using replication with the `NDB` storage engine; in MySQL Server 5.7, it is present but does nothing. For more information, see Section 21.7.6, “Starting NDB Cluster Replication (Single Replication Channel)”").

* `transaction_allow_batching`

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

  When set to `1` or `ON`, this variable enables batching of statements within the same transaction. To use this variable, `autocommit` must first be disabled by setting it to `0` or `OFF`; otherwise, setting `transaction_allow_batching` has no effect.

  It is safe to use this variable with transactions that performs writes only, as having it enabled can lead to reads from the “before” image. You should ensure that any pending transactions are committed (using an explicit `COMMIT` if desired) before issuing a `SELECT`.

  Important

  `transaction_allow_batching` should not be used whenever there is the possibility that the effects of a given statement depend on the outcome of a previous statement within the same transaction.

  This variable is currently supported for NDB Cluster only.

The system variables in the following list all relate to the `ndbinfo` information database.

* `ndbinfo_database`

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

  Shows the name used for the `NDB` information database; the default is `ndbinfo`. This is a read-only variable whose value is determined at compile time.

* `ndbinfo_max_bytes`

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

  Used in testing and debugging only.

* `ndbinfo_max_rows`

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

  Used in testing and debugging only.

* `ndbinfo_offline`

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

  Place the `ndbinfo` database into offline mode, in which tables and views can be opened even when they do not actually exist, or when they exist but have different definitions in `NDB`. No rows are returned from such tables (or views).

* `ndbinfo_show_hidden`

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

  Whether or not the `ndbinfo` database's underlying internal tables are shown in the **mysql** client. The default is `OFF`.

  Note

  When `ndbinfo_show_hidden` is enabled, the internal tables are shown in the `ndbinfo` database only; they are not visible in `TABLES` or other `INFORMATION_SCHEMA` tables, regardless of the variable's setting.

* `ndbinfo_table_prefix`

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

  The prefix used in naming the ndbinfo database's base tables (normally hidden, unless exposed by setting `ndbinfo_show_hidden`). This is a read-only variable whose default value is `ndb$`; the prefix itself is determined at compile time.

* `ndbinfo_version`

  <table frame="box" rules="all" summary="Properties for ndb-connectstring"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb-connectstring</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

  Shows the version of the `ndbinfo` engine in use; read-only.

##### 21.4.3.9.3 NDB Cluster Status Variables

This section provides detailed information about MySQL server status variables that relate to NDB Cluster and the `NDB` storage engine. For status variables not specific to NDB Cluster, and for general information on using status variables, see Section 5.1.9, “Server Status Variables”.

* `Handler_discover`

  The MySQL server can ask the `NDBCLUSTER` storage engine if it knows about a table with a given name. This is called discovery. `Handler_discover` indicates the number of times that tables have been discovered using this mechanism.

* `Ndb_api_adaptive_send_deferred_count`

  Number of adaptive send calls that were not actually sent.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_adaptive_send_deferred_count_session`

  Number of adaptive send calls that were not actually sent.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_adaptive_send_deferred_count_slave`

  Number of adaptive send calls that were not actually sent by this replica.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_adaptive_send_forced_count`

  Number of adaptive send calls using forced-send sent by this MySQL Server (SQL node).

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_adaptive_send_forced_count_session`

  Number of adaptive send calls using forced-send sent in this client session.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_adaptive_send_forced_count_slave`

  Number of adaptive send calls using forced-send sent by this replica.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_adaptive_send_unforced_count`

  Number of adaptive send calls without forced-send sent by this MySQL server (SQL node).

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_adaptive_send_unforced_count_session`

  Number of adaptive send calls without forced-send sent in this client session.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_adaptive_send_unforced_count_slave`

  Number of adaptive send calls without forced-send sent by this replica.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_bytes_sent_count_session`

  Amount of data (in bytes) sent to the data nodes in this client session.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it relates to the current session only, and is not affected by any other clients of this `mysqld`.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_bytes_sent_count_slave`

  Amount of data (in bytes) sent to the data nodes by this replica.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_bytes_sent_count`

  Amount of data (in bytes) sent to the data nodes by this MySQL Server (SQL node).

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_bytes_received_count_session`

  Amount of data (in bytes) received from the data nodes in this client session.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it relates to the current session only, and is not affected by any other clients of this `mysqld`.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_bytes_received_count_slave`

  Amount of data (in bytes) received from the data nodes by this replica.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_bytes_received_count`

  Amount of data (in bytes) received from the data nodes by this MySQL Server (SQL node).

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_event_data_count_injector`

  The number of row change events received by the NDB binlog injector thread.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_event_data_count`

  The number of row change events received by this MySQL Server (SQL node).

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_event_nondata_count_injector`

  The number of events received, other than row change events, by the NDB binary log injector thread.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_event_nondata_count`

  The number of events received, other than row change events, by this MySQL Server (SQL node).

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_event_bytes_count_injector`

  The number of bytes of events received by the NDB binlog injector thread.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_event_bytes_count`

  The number of bytes of events received by this MySQL Server (SQL node).

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_pk_op_count_session`

  The number of operations in this client session based on or using primary keys. This includes operations on blob tables, implicit unlock operations, and auto-increment operations, as well as user-visible primary key operations.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it relates to the current session only, and is not affected by any other clients of this `mysqld`.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_pk_op_count_slave`

  The number of operations by this replica based on or using primary keys. This includes operations on blob tables, implicit unlock operations, and auto-increment operations, as well as user-visible primary key operations.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_pk_op_count`

  The number of operations by this MySQL Server (SQL node) based on or using primary keys. This includes operations on blob tables, implicit unlock operations, and auto-increment operations, as well as user-visible primary key operations.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_pruned_scan_count_session`

  The number of scans in this client session that have been pruned to a single partition.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it relates to the current session only, and is not affected by any other clients of this `mysqld`.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_pruned_scan_count_slave`

  The number of scans by this replica that have been pruned to a single partition.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_pruned_scan_count`

  The number of scans by this MySQL Server (SQL node) that have been pruned to a single partition.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_range_scan_count_session`

  The number of range scans that have been started in this client session.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it relates to the current session only, and is not affected by any other clients of this `mysqld`.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_range_scan_count_slave`

  The number of range scans that have been started by this replica.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_range_scan_count`

  The number of range scans that have been started by this MySQL Server (SQL node).

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_read_row_count_session`

  The total number of rows that have been read in this client session. This includes all rows read by any primary key, unique key, or scan operation made in this client session.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it relates to the current session only, and is not affected by any other clients of this `mysqld`.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_read_row_count_slave`

  The total number of rows that have been read by this replica. This includes all rows read by any primary key, unique key, or scan operation made by this replica.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_read_row_count`

  The total number of rows that have been read by this MySQL Server (SQL node). This includes all rows read by any primary key, unique key, or scan operation made by this MySQL Server (SQL node).

  You should be aware that this value may not be completely accurate with regard to rows read by `SELECT` `COUNT(*)` queries, due to the fact that, in this case, the MySQL server actually reads pseudo-rows in the form `[table fragment ID]:[number of rows in fragment]` and sums the rows per fragment for all fragments in the table to derive an estimated count for all rows. `Ndb_api_read_row_count` uses this estimate and not the actual number of rows in the table.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_scan_batch_count_session`

  The number of batches of rows received in this client session. 1 batch is defined as 1 set of scan results from a single fragment.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it relates to the current session only, and is not affected by any other clients of this `mysqld`.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_scan_batch_count_slave`

  The number of batches of rows received by this replica. 1 batch is defined as 1 set of scan results from a single fragment.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_scan_batch_count`

  The number of batches of rows received by this MySQL Server (SQL node). 1 batch is defined as 1 set of scan results from a single fragment.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_table_scan_count_session`

  The number of table scans that have been started in this client session, including scans of internal tables,.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it relates to the current session only, and is not affected by any other clients of this `mysqld`.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_table_scan_count_slave`

  The number of table scans that have been started by this replica, including scans of internal tables,.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_table_scan_count`

  The number of table scans that have been started by this MySQL Server (SQL node), including scans of internal tables,.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_trans_abort_count_session`

  The number of transactions aborted in this client session.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it relates to the current session only, and is not affected by any other clients of this `mysqld`.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_trans_abort_count_slave`

  The number of transactions aborted by this replica.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_trans_abort_count`

  The number of transactions aborted by this MySQL Server (SQL node).

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_trans_close_count_session`

  The number of transactions closed in this client session. This value may be greater than the sum of `Ndb_api_trans_commit_count_session` and `Ndb_api_trans_abort_count_session`, since some transactions may have been rolled back.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it relates to the current session only, and is not affected by any other clients of this `mysqld`.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_trans_close_count_slave`

  The number of transactions closed by this replica. This value may be greater than the sum of `Ndb_api_trans_commit_count_slave` and `Ndb_api_trans_abort_count_slave`, since some transactions may have been rolled back.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_trans_close_count`

  The number of transactions closed by this MySQL Server (SQL node). This value may be greater than the sum of `Ndb_api_trans_commit_count` and `Ndb_api_trans_abort_count`, since some transactions may have been rolled back.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_trans_commit_count_session`

  The number of transactions committed in this client session.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it relates to the current session only, and is not affected by any other clients of this `mysqld`.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_trans_commit_count_slave`

  The number of transactions committed by this replica.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_trans_commit_count`

  The number of transactions committed by this MySQL Server (SQL node).

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_trans_local_read_row_count_session`

  The total number of rows that have been read in this client session. This includes all rows read by any primary key, unique key, or scan operation made in this client session.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it relates to the current session only, and is not affected by any other clients of this `mysqld`.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_trans_local_read_row_count_slave`

  The total number of rows that have been read by this replica. This includes all rows read by any primary key, unique key, or scan operation made by this replica.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_trans_local_read_row_count`

  The total number of rows that have been read by this MySQL Server (SQL node). This includes all rows read by any primary key, unique key, or scan operation made by this MySQL Server (SQL node).

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_trans_start_count_session`

  The number of transactions started in this client session.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it relates to the current session only, and is not affected by any other clients of this `mysqld`.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_trans_start_count_slave`

  The number of transactions started by this replica.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_trans_start_count`

  The number of transactions started by this MySQL Server (SQL node).

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_uk_op_count_session`

  The number of operations in this client session based on or using unique keys.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it relates to the current session only, and is not affected by any other clients of this `mysqld`.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_uk_op_count_slave`

  The number of operations by this replica based on or using unique keys.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_uk_op_count`

  The number of operations by this MySQL Server (SQL node) based on or using unique keys.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_wait_exec_complete_count_session`

  The number of times a thread has been blocked in this client session while waiting for execution of an operation to complete. This includes all `execute()` calls as well as implicit executes for blob and auto-increment operations not visible to clients.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it relates to the current session only, and is not affected by any other clients of this `mysqld`.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_wait_exec_complete_count_slave`

  The number of times a thread has been blocked by this replica while waiting for execution of an operation to complete. This includes all `execute()` calls as well as implicit executes for blob and auto-increment operations not visible to clients.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_wait_exec_complete_count`

  The number of times a thread has been blocked by this MySQL Server (SQL node) while waiting for execution of an operation to complete. This includes all `execute()` calls as well as implicit executes for blob and auto-increment operations not visible to clients.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_wait_meta_request_count_session`

  The number of times a thread has been blocked in this client session waiting for a metadata-based signal, such as is expected for DDL requests, new epochs, and seizure of transaction records.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it relates to the current session only, and is not affected by any other clients of this `mysqld`.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_wait_meta_request_count_slave`

  The number of times a thread has been blocked by this replica waiting for a metadata-based signal, such as is expected for DDL requests, new epochs, and seizure of transaction records.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_wait_meta_request_count`

  The number of times a thread has been blocked by this MySQL Server (SQL node) waiting for a metadata-based signal, such as is expected for DDL requests, new epochs, and seizure of transaction records.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_wait_nanos_count_session`

  Total time (in nanoseconds) spent in this client session waiting for any type of signal from the data nodes.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it relates to the current session only, and is not affected by any other clients of this `mysqld`.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_wait_nanos_count_slave`

  Total time (in nanoseconds) spent by this replica waiting for any type of signal from the data nodes.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_wait_nanos_count`

  Total time (in nanoseconds) spent by this MySQL Server (SQL node) waiting for any type of signal from the data nodes.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_wait_scan_result_count_session`

  The number of times a thread has been blocked in this client session while waiting for a scan-based signal, such as when waiting for more results from a scan, or when waiting for a scan to close.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it relates to the current session only, and is not affected by any other clients of this `mysqld`.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_wait_scan_result_count_slave`

  The number of times a thread has been blocked by this replica while waiting for a scan-based signal, such as when waiting for more results from a scan, or when waiting for a scan to close.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope. If this MySQL server does not act as a replica, or does not use NDB tables, this value is always 0.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_api_wait_scan_result_count`

  The number of times a thread has been blocked by this MySQL Server (SQL node) while waiting for a scan-based signal, such as when waiting for more results from a scan, or when waiting for a scan to close.

  Although this variable can be read using either `SHOW GLOBAL STATUS` or `SHOW SESSION STATUS`, it is effectively global in scope.

  For more information, see Section 21.6.14, “NDB API Statistics Counters and Variables”.

* `Ndb_cluster_node_id`

  If the server is acting as an NDB Cluster node, then the value of this variable its node ID in the cluster.

  If the server is not part of an NDB Cluster, then the value of this variable is 0.

* `Ndb_config_from_host`

  If the server is part of an NDB Cluster, the value of this variable is the host name or IP address of the Cluster management server from which it gets its configuration data.

  If the server is not part of an NDB Cluster, then the value of this variable is an empty string.

* `Ndb_config_from_port`

  If the server is part of an NDB Cluster, the value of this variable is the number of the port through which it is connected to the Cluster management server from which it gets its configuration data.

  If the server is not part of an NDB Cluster, then the value of this variable is 0.

* `Ndb_conflict_fn_epoch`

  Used in NDB Cluster Replication conflict resolution, this variable shows the number of rows found to be in conflict using `NDB$EPOCH()` conflict resolution on a given `mysqld` since the last time it was restarted.

  For more information, see Section 21.7.11, “NDB Cluster Replication Conflict Resolution”.

* `Ndb_conflict_fn_epoch_trans`

  Used in NDB Cluster Replication conflict resolution, this variable shows the number of rows found to be in conflict using `NDB$EPOCH_TRANS()` conflict resolution on a given `mysqld` since the last time it was restarted.

  For more information, see Section 21.7.11, “NDB Cluster Replication Conflict Resolution”.

* `Ndb_conflict_fn_epoch2`

  Shows the number of rows found to be in conflict in NDB Cluster Replication conflict resolution, when using `NDB$EPOCH2()`, on the source designated as the primary since the last time it was restarted.

  For more information, see NDB$EPOCH2()").

* `Ndb_conflict_fn_epoch2_trans`

  Used in NDB Cluster Replication conflict resolution, this variable shows the number of rows found to be in conflict using `NDB$EPOCH_TRANS2()` conflict resolution on a given `mysqld` since the last time it was restarted.

  For more information, see NDB$EPOCH2\_TRANS()").

* `Ndb_conflict_fn_max`

  Used in NDB Cluster Replication conflict resolution, this variable shows the number of times that a row was not applied on the current SQL node due to “greatest timestamp wins” conflict resolution since the last time that this `mysqld` was started.

  For more information, see Section 21.7.11, “NDB Cluster Replication Conflict Resolution”.

* `Ndb_conflict_fn_max_del_win`

  Shows the number of times that a row was rejected on the current SQL node due to NDB Cluster Replication conflict resolution using `NDB$MAX_DELETE_WIN()`, since the last time that this `mysqld` was started.

  For more information, see Section 21.7.11, “NDB Cluster Replication Conflict Resolution”.

* `Ndb_conflict_fn_old`

  Used in NDB Cluster Replication conflict resolution, this variable shows the number of times that a row was not applied as the result of “same timestamp wins” conflict resolution on a given `mysqld` since the last time it was restarted.

  For more information, see Section 21.7.11, “NDB Cluster Replication Conflict Resolution”.

* `Ndb_conflict_last_conflict_epoch`

  The most recent epoch in which a conflict was detected on this replica. You can compare this value with `Ndb_slave_max_replicated_epoch`; if `Ndb_slave_max_replicated_epoch` is greater than `Ndb_conflict_last_conflict_epoch`, no conflicts have yet been detected.

  See Section 21.7.11, “NDB Cluster Replication Conflict Resolution”, for more information.

* `Ndb_conflict_reflected_op_discard_count`

  When using NDB Cluster Replication conflict resolution, this is the number of reflected operations that were not applied on the secondary, due to encountering an error during execution.

  See Section 21.7.11, “NDB Cluster Replication Conflict Resolution”, for more information.

* `Ndb_conflict_reflected_op_prepare_count`

  When using conflict resolution with NDB Cluster Replication, this status variable contains the number of reflected operations that have been defined (that is, prepared for execution on the secondary).

  See Section 21.7.11, “NDB Cluster Replication Conflict Resolution”.

* `Ndb_conflict_refresh_op_count`

  When using conflict resolution with NDB Cluster Replication, this gives the number of refresh operations that have been prepared for execution on the secondary.

  See Section 21.7.11, “NDB Cluster Replication Conflict Resolution”, for more information.

* `Ndb_conflict_last_stable_epoch`

  Number of rows found to be in conflict by a transactional conflict function

  See Section 21.7.11, “NDB Cluster Replication Conflict Resolution”, for more information.

* `Ndb_conflict_trans_row_conflict_count`

  Used in NDB Cluster Replication conflict resolution, this status variable shows the number of rows found to be directly in-conflict by a transactional conflict function on a given `mysqld` since the last time it was restarted.

  Currently, the only transactional conflict detection function supported by NDB Cluster is NDB$EPOCH\_TRANS(), so this status variable is effectively the same as `Ndb_conflict_fn_epoch_trans`.

  For more information, see Section 21.7.11, “NDB Cluster Replication Conflict Resolution”.

* `Ndb_conflict_trans_row_reject_count`

  Used in NDB Cluster Replication conflict resolution, this status variable shows the total number of rows realigned due to being determined as conflicting by a transactional conflict detection function. This includes not only `Ndb_conflict_trans_row_conflict_count`, but any rows in or dependent on conflicting transactions.

  For more information, see Section 21.7.11, “NDB Cluster Replication Conflict Resolution”.

* `Ndb_conflict_trans_reject_count`

  Used in NDB Cluster Replication conflict resolution, this status variable shows the number of transactions found to be in conflict by a transactional conflict detection function.

  For more information, see Section 21.7.11, “NDB Cluster Replication Conflict Resolution”.

* `Ndb_conflict_trans_detect_iter_count`

  Used in NDB Cluster Replication conflict resolution, this shows the number of internal iterations required to commit an epoch transaction. Should be (slightly) greater than or equal to `Ndb_conflict_trans_conflict_commit_count`.

  For more information, see Section 21.7.11, “NDB Cluster Replication Conflict Resolution”.

* `Ndb_conflict_trans_conflict_commit_count`

  Used in NDB Cluster Replication conflict resolution, this shows the number of epoch transactions committed after they required transactional conflict handling.

  For more information, see Section 21.7.11, “NDB Cluster Replication Conflict Resolution”.

* `Ndb_epoch_delete_delete_count`

  When using delete-delete conflict detection, this is the number of delete-delete conflicts detected, where a delete operation is applied, but the indicated row does not exist.

* `Ndb_execute_count`

  Provides the number of round trips to the `NDB` kernel made by operations.

* `Ndb_last_commit_epoch_server`

  The epoch most recently committed by `NDB`.

* `Ndb_last_commit_epoch_session`

  The epoch most recently committed by this `NDB` client.

* `Ndb_number_of_data_nodes`

  If the server is part of an NDB Cluster, the value of this variable is the number of data nodes in the cluster.

  If the server is not part of an NDB Cluster, then the value of this variable is 0.

* `Ndb_pushed_queries_defined`

  The total number of joins pushed down to the NDB kernel for distributed handling on the data nodes.

  Note

  Joins tested using `EXPLAIN` that can be pushed down contribute to this number.

* `Ndb_pushed_queries_dropped`

  The number of joins that were pushed down to the NDB kernel but that could not be handled there.

* `Ndb_pushed_queries_executed`

  The number of joins successfully pushed down to `NDB` and executed there.

* `Ndb_pushed_reads`

  The number of rows returned to `mysqld` from the NDB kernel by joins that were pushed down.

  Note

  Executing `EXPLAIN` on joins that can be pushed down to `NDB` does not add to this number.

* `Ndb_pruned_scan_count`

  This variable holds a count of the number of scans executed by `NDBCLUSTER` since the NDB Cluster was last started where `NDBCLUSTER` was able to use partition pruning.

  Using this variable together with `Ndb_scan_count` can be helpful in schema design to maximize the ability of the server to prune scans to a single table partition, thereby involving only a single data node.

* `Ndb_scan_count`

  This variable holds a count of the total number of scans executed by `NDBCLUSTER` since the NDB Cluster was last started.

* `Ndb_slave_max_replicated_epoch`

  The most recently committed epoch on this replica. You can compare this value with `Ndb_conflict_last_conflict_epoch`; if `Ndb_slave_max_replicated_epoch` is the greater of the two, no conflicts have yet been detected.

  For more information, see Section 21.7.11, “NDB Cluster Replication Conflict Resolution”.

* `Ndb_system_name`

  If this MySQL Server is connected to an NDB cluster, this read-only variable shows the cluster system name. Otherwise, the value is an empty string.


#### 21.4.3.10 NDB Cluster TCP/IP Connections

TCP/IP is the default transport mechanism for all connections between nodes in an NDB Cluster. Normally it is not necessary to define TCP/IP connections; NDB Cluster automatically sets up such connections for all data nodes, management nodes, and SQL or API nodes.

Note

For an exception to this rule, see Section 21.4.3.11, “NDB Cluster TCP/IP Connections Using Direct Connections”.

To override the default connection parameters, it is necessary to define a connection using one or more `[tcp]` sections in the `config.ini` file. Each `[tcp]` section explicitly defines a TCP/IP connection between two NDB Cluster nodes, and must contain at a minimum the parameters `NodeId1` and `NodeId2`, as well as any connection parameters to override.

It is also possible to change the default values for these parameters by setting them in the `[tcp default]` section.

Important

Any `[tcp]` sections in the `config.ini` file should be listed *last*, following all other sections in the file. However, this is not required for a `[tcp default]` section. This requirement is a known issue with the way in which the `config.ini` file is read by the NDB Cluster management server.

Connection parameters which can be set in `[tcp]` and `[tcp default]` sections of the `config.ini` file are listed here:

* `Checksum`

  <table frame="box" rules="all" summary="Checksum TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>boolean</td> </tr><tr> <th>Default</th> <td>false</td> </tr><tr> <th>Range</th> <td>true, false</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter is a boolean parameter (enabled by setting it to `Y` or `1`, disabled by setting it to `N` or `0`). It is disabled by default. When it is enabled, checksums for all messages are calculated before they placed in the send buffer. This feature ensures that messages are not corrupted while waiting in the send buffer, or by the transport mechanism.

* `Group`

  When `ndb_optimized_node_selection` is enabled, node proximity is used in some cases to select which node to connect to. This parameter can be used to influence proximity by setting it to a lower value, which is interpreted as “closer”. See the description of the system variable for more information.

* `HostName1`

  <table frame="box" rules="all" summary="HostName1 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The `HostName1` and `HostName2` parameters can be used to specify specific network interfaces to be used for a given TCP connection between two nodes. The values used for these parameters can be host names or IP addresses.

* `HostName2`

  <table frame="box" rules="all" summary="HostName2 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The `HostName1` and `HostName2` parameters can be used to specify specific network interfaces to be used for a given TCP connection between two nodes. The values used for these parameters can be host names or IP addresses.

* `NodeId1`

  <table frame="box" rules="all" summary="NodeId1 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>numeric</td> </tr><tr> <th>Default</th> <td>[none]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  To identify a connection between two nodes it is necessary to provide their node IDs in the `[tcp]` section of the configuration file as the values of `NodeId1` and `NodeId2`. These are the same unique `Id` values for each of these nodes as described in Section 21.4.3.7, “Defining SQL and Other API Nodes in an NDB Cluster”.

* `NodeId2`

  <table frame="box" rules="all" summary="NodeId2 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>numeric</td> </tr><tr> <th>Default</th> <td>[none]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  To identify a connection between two nodes it is necessary to provide their node IDs in the `[tcp]` section of the configuration file as the values of `NodeId1` and `NodeId2`. These are the same unique `Id` values for each of these nodes as described in Section 21.4.3.7, “Defining SQL and Other API Nodes in an NDB Cluster”.

* `NodeIdServer`

  <table frame="box" rules="all" summary="NodeIdServer TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>numeric</td> </tr><tr> <th>Default</th> <td>[none]</td> </tr><tr> <th>Range</th> <td>1 - 63</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Set the server side of a TCP connection.

* `OverloadLimit`

  <table frame="box" rules="all" summary="OverloadLimit TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>bytes</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  When more than this many unsent bytes are in the send buffer, the connection is considered overloaded.

  This parameter can be used to determine the amount of unsent data that must be present in the send buffer before the connection is considered overloaded. See Section 21.4.3.13, “Configuring NDB Cluster Send Buffer Parameters”, for more information.

* `PortNumber` (*OBSOLETE*)

  This parameter formerly specified the port number to be used for listening for connections from other nodes. It is now deprecated (and removed in NDB Cluster 7.5); use the `ServerPort` data node configuration parameter for this purpose instead (Bug #77405, Bug #21280456).

* `PreSendChecksum`

  <table frame="box" rules="all" summary="PreSendChecksum TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.6</td> </tr><tr> <th>Type or units</th> <td>boolean</td> </tr><tr> <th>Default</th> <td>false</td> </tr><tr> <th>Range</th> <td>true, false</td> </tr><tr> <th>Added</th> <td>NDB 7.6.6</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  If this parameter and `Checksum` are both enabled, perform pre-send checksum checks, and check all TCP signals between nodes for errors. Has no effect if `Checksum` is not also enabled.

* `Proxy`

  <table frame="box" rules="all" summary="Proxy TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>string</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Set a proxy for the TCP connection.

* `ReceiveBufferMemory`

  <table frame="box" rules="all" summary="ReceiveBufferMemory TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>bytes</td> </tr><tr> <th>Default</th> <td>2M</td> </tr><tr> <th>Range</th> <td>16K - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Specifies the size of the buffer used when receiving data from the TCP/IP socket.

  The default value of this parameter is 2MB. The minimum possible value is 16KB; the theoretical maximum is 4GB.

* `SendBufferMemory`

  <table frame="box" rules="all" summary="HostName1 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>0

  TCP transporters use a buffer to store all messages before performing the send call to the operating system. When this buffer reaches 64KB its contents are sent; these are also sent when a round of messages have been executed. To handle temporary overload situations it is also possible to define a bigger send buffer.

  If this parameter is set explicitly, then the memory is not dedicated to each transporter; instead, the value used denotes the hard limit for how much memory (out of the total available memory—that is, `TotalSendBufferMemory`) that may be used by a single transporter. For more information about configuring dynamic transporter send buffer memory allocation in NDB Cluster, see Section 21.4.3.13, “Configuring NDB Cluster Send Buffer Parameters”.

  The default size of the send buffer is 2MB, which is the size recommended in most situations. The minimum size is 64 KB; the theoretical maximum is 4 GB.

* `SendSignalId`

  <table frame="box" rules="all" summary="HostName1 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>1

  To be able to retrace a distributed message datagram, it is necessary to identify each message. When this parameter is set to `Y`, message IDs are transported over the network. This feature is disabled by default in production builds, and enabled in `-debug` builds.

* `TcpBind_INADDR_ANY`

  Setting this parameter to `TRUE` or `1` binds `IP_ADDR_ANY` so that connections can be made from anywhere (for autogenerated connections). The default is `FALSE` (`0`).

* `TCP_MAXSEG_SIZE`

  <table frame="box" rules="all" summary="HostName1 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>2

  Determines the size of the memory set during TCP transporter initialization. The default is recommended for most common usage cases.

* `TCP_RCV_BUF_SIZE`

  <table frame="box" rules="all" summary="HostName1 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>3

  Determines the size of the receive buffer set during TCP transporter initialization. The default and minimum value is 0, which allows the operating system or platform to set this value. The default is recommended for most common usage cases.

* `TCP_SND_BUF_SIZE`

  <table frame="box" rules="all" summary="HostName1 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>4

  Determines the size of the send buffer set during TCP transporter initialization. The default and minimum value is 0, which allows the operating system or platform to set this value. The default is recommended for most common usage cases.

**Restart types.** Information about the restart types used by the parameter descriptions in this section is shown in the following table:

**Table 21.19 NDB Cluster restart types**

<table frame="box" rules="all" summary="HostName1 TCP configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>5


#### 21.4.3.11 NDB Cluster TCP/IP Connections Using Direct Connections

Setting up a cluster using direct connections between data nodes requires specifying explicitly the crossover IP addresses of the data nodes so connected in the `[tcp]` section of the cluster `config.ini` file.

In the following example, we envision a cluster with at least four hosts, one each for a management server, an SQL node, and two data nodes. The cluster as a whole resides on the `172.23.72.*` subnet of a LAN. In addition to the usual network connections, the two data nodes are connected directly using a standard crossover cable, and communicate with one another directly using IP addresses in the `1.1.0.*` address range as shown:

```sql
# Management Server
[ndb_mgmd]
Id=1
HostName=172.23.72.20

# SQL Node
[mysqld]
Id=2
HostName=172.23.72.21

# Data Nodes
[ndbd]
Id=3
HostName=172.23.72.22

[ndbd]
Id=4
HostName=172.23.72.23

# TCP/IP Connections
[tcp]
NodeId1=3
NodeId2=4
HostName1=1.1.0.1
HostName2=1.1.0.2
```

The `HostName1` and `HostName2` parameters are used only when specifying direct connections.

The use of direct TCP connections between data nodes can improve the cluster's overall efficiency by enabling the data nodes to bypass an Ethernet device such as a switch, hub, or router, thus cutting down on the cluster's latency.

Note

To take the best advantage of direct connections in this fashion with more than two data nodes, you must have a direct connection between each data node and every other data node in the same node group.


#### 21.4.3.12 NDB Cluster Shared Memory Connections

Communications between NDB cluster nodes are normally handled using TCP/IP. The shared memory (SHM) transporter is distinguished by the fact that signals are transmitted by writing in memory rather than on a socket. The shared-memory transporter (SHM) can improve performance by negating up to 20% of the overhead required by a TCP connection when running an API node (usually an SQL node) and a data node together on the same host. You can enable a shared memory connection in either of the two ways listed here:

* By setting the `UseShm` data node configuration parameter to `1`, and setting `HostName` for the data node and `HostName` for the API node to the same value.

* By using `[shm]` sections in the cluster configuration file, each containing settings for `NodeId1` and `NodeId2`. This method is described in more detail later in this section.

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

* `ShmSize`: Shared memory size

* `ShmSpinTime`: Time in µs to spin before sleeping

* `SendBufferMemory`: Size of buffer for signals sent from this node, in bytes.

* `SendSignalId`: Indicates that a signal ID is included in each signal sent through the transporter.

* `Checksum`: Indicates that a checksum is included in each signal sent through the transporter.

* `PreSendChecksum`: Checks of the checksum are made prior to sending the signal; Checksum must also be enabled for this to work

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

Parameters affecting all shared memory transporters are set in the `[shm default]` section; these can be overridden on a per-connection basis in one or more `[shm]` sections. Each such section must be associated with a given SHM connection using `NodeId1` and `NodeId2`; the values required for these parameters are the node IDs of the two nodes connected by the transporter. You can also identify the nodes by host name using `HostName1` and `HostName2`, but these parameters are not required.

The API nodes for which no host names are set use the TCP transporter to communicate with data nodes independent of the hosts on which they are started; the parameters and values set in the `[tcp default]` section of the configuration file apply to all TCP transporters in the cluster.

For optimum performance, you can define a spin time for the SHM transporter (`ShmSpinTime` parameter); this affects both the data node receiver thread and the poll owner (receive thread or user thread) in `NDB`.

* `Checksum`

  <table frame="box" rules="all" summary="Checksum shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>boolean</td> </tr><tr> <th>Default</th> <td>true</td> </tr><tr> <th>Range</th> <td>true, false</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  This parameter is a boolean (`Y`/`N`) parameter which is disabled by default. When it is enabled, checksums for all messages are calculated before being placed in the send buffer.

  This feature prevents messages from being corrupted while waiting in the send buffer. It also serves as a check against data being corrupted during transport.

* `Group`

  <table frame="box" rules="all" summary="Group shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Determines the group proximity; a smaller value is interpreted as being closer. The default value is sufficient for most conditions.

* `HostName1`

  <table frame="box" rules="all" summary="HostName1 shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The `HostName1` and `HostName2` parameters can be used to specify specific network interfaces to be used for a given SHM connection between two nodes. The values used for these parameters can be host names or IP addresses.

* `HostName2`

  <table frame="box" rules="all" summary="HostName2 shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>name or IP address</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>...</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  The `HostName1` and `HostName2` parameters can be used to specify specific network interfaces to be used for a given SHM connection between two nodes. The values used for these parameters can be host names or IP addresses.

* `NodeId1`

  <table frame="box" rules="all" summary="NodeId1 shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>numeric</td> </tr><tr> <th>Default</th> <td>[none]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  To identify a connection between two nodes it is necessary to provide node identifiers for each of them, as `NodeId1` and `NodeId2`.

* `NodeId2`

  <table frame="box" rules="all" summary="NodeId2 shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>numeric</td> </tr><tr> <th>Default</th> <td>[none]</td> </tr><tr> <th>Range</th> <td>1 - 255</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  To identify a connection between two nodes it is necessary to provide node identifiers for each of them, as `NodeId1` and `NodeId2`.

* `NodeIdServer`

  <table frame="box" rules="all" summary="NodeIdServer shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>numeric</td> </tr><tr> <th>Default</th> <td>[none]</td> </tr><tr> <th>Range</th> <td>1 - 63</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Identify the server end of a shared memory connection. By default, this is the node ID of the data node.

* `OverloadLimit`

  <table frame="box" rules="all" summary="OverloadLimit shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>bytes</td> </tr><tr> <th>Default</th> <td>0</td> </tr><tr> <th>Range</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  When more than this many unsent bytes are in the send buffer, the connection is considered overloaded.

  This parameter can be used to determine the amount of unsent data that must be present in the send buffer before the connection is considered overloaded. See Section 21.4.3.13, “Configuring NDB Cluster Send Buffer Parameters”, and Section 21.6.15.44, “The ndbinfo transporters Table”, for more information.

* `PortNumber`

  <table frame="box" rules="all" summary="PortNumber shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>[...]</td> </tr><tr> <th>Range</th> <td>0 - 64K</td> </tr><tr> <th>Removed</th> <td>NDB 7.5.1</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>System Restart: </strong></span>Requires a complete shutdown and restart of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Set the port to be used by the SHM transporter.

* `PreSendChecksum`

  <table frame="box" rules="all" summary="PreSendChecksum shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.6.6</td> </tr><tr> <th>Type or units</th> <td>boolean</td> </tr><tr> <th>Default</th> <td>false</td> </tr><tr> <th>Range</th> <td>true, false</td> </tr><tr> <th>Added</th> <td>NDB 7.6.6</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  If this parameter and `Checksum` are both enabled, perform pre-send checksum checks, and check all SHM signals between nodes for errors. Has no effect if `Checksum` is not also enabled.

* `SendBufferMemory`

  <table frame="box" rules="all" summary="Group shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>0

  Size (in bytes) of the shared memory buffer for signals sent from this node using a shared memory connection.

* `SendSignalId`

  <table frame="box" rules="all" summary="Group shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>1

  To retrace the path of a distributed message, it is necessary to provide each message with a unique identifier. Setting this parameter to `Y` causes these message IDs to be transported over the network as well. This feature is disabled by default in production builds, and enabled in `-debug` builds.

* `ShmKey`

  <table frame="box" rules="all" summary="Group shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>2

  When setting up shared memory segments, a node ID, expressed as an integer, is used to identify uniquely the shared memory segment to use for the communication. There is no default value. If `UseShm` is enabled, the shared memory key is calculated automatically by `NDB`.

* `ShmSize`

  <table frame="box" rules="all" summary="Group shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>3

  Each SHM connection has a shared memory segment where messages between nodes are placed by the sender and read by the reader. The size of this segment is defined by `ShmSize`. The default value in NDB 7.6 is 4MB.

* `ShmSpinTime`

  <table frame="box" rules="all" summary="Group shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>4

  When receiving, the time to wait before sleeping, in microseconds.

* `SigNum`

  <table frame="box" rules="all" summary="Group shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>5

  This parameter is no longer used in NDB 7.6, in which any setting for it is ignored.

  The following applies only in NDB 7.5 (and earlier):

  When using the shared memory transporter, a process sends an operating system signal to the other process when there is new data available in the shared memory. Should that signal conflict with an existing signal, this parameter can be used to change it. This is a possibility when using SHM due to the fact that different operating systems use different signal numbers.

  The default value of `SigNum` is 0; therefore, it must be set to avoid errors in the cluster log when using the shared memory transporter. Typically, this parameter is set to 10 in the `[shm default]` section of the `config.ini` file.

**Restart types.** Information about the restart types used by the parameter descriptions in this section is shown in the following table:

**Table 21.20 NDB Cluster restart types**

<table frame="box" rules="all" summary="Group shared memory configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>unsigned</td> </tr><tr> <th>Default</th> <td>35</td> </tr><tr> <th>Range</th> <td>0 - 200</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>6


#### 21.4.3.13 Configuring NDB Cluster Send Buffer Parameters

The `NDB` kernel employs a unified send buffer whose memory is allocated dynamically from a pool shared by all transporters. This means that the size of the send buffer can be adjusted as necessary. Configuration of the unified send buffer can accomplished by setting the following parameters:

* **TotalSendBufferMemory.** This parameter can be set for all types of NDB Cluster nodes—that is, it can be set in the `[ndbd]`, `[mgm]`, and `[api]` (or `[mysql]`) sections of the `config.ini` file. It represents the total amount of memory (in bytes) to be allocated by each node for which it is set for use among all configured transporters. If set, its minimum is 256KB; the maximum is 4294967039.

  To be backward-compatible with existing configurations, this parameter takes as its default value the sum of the maximum send buffer sizes of all configured transporters, plus an additional 32KB (one page) per transporter. The maximum depends on the type of transporter, as shown in the following table:

  **Table 21.21 Transporter types with maximum send buffer sizes**

  <table><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Transporter</th> <th>Maximum Send Buffer Size (bytes)</th> </tr></thead><tbody><tr> <td>TCP</td> <td><code>SendBufferMemory</code> (default = 2M)</td> </tr><tr> <td>SHM</td> <td>20K</td> </tr></tbody></table>

  This enables existing configurations to function in close to the same way as they did with NDB Cluster 6.3 and earlier, with the same amount of memory and send buffer space available to each transporter. However, memory that is unused by one transporter is not available to other transporters.

* **OverloadLimit.** This parameter is used in the `config.ini` file `[tcp]` section, and denotes the amount of unsent data (in bytes) that must be present in the send buffer before the connection is considered overloaded. When such an overload condition occurs, transactions that affect the overloaded connection fail with NDB API Error 1218 (Send Buffers overloaded in NDB kernel) until the overload status passes. The default value is 0, in which case the effective overload limit is calculated as `SendBufferMemory * 0.8` for a given connection. The maximum value for this parameter is 4G.

* **SendBufferMemory.** This value denotes a hard limit for the amount of memory that may be used by a single transporter out of the entire pool specified by `TotalSendBufferMemory`. However, the sum of `SendBufferMemory` for all configured transporters may be greater than the `TotalSendBufferMemory` that is set for a given node. This is a way to save memory when many nodes are in use, as long as the maximum amount of memory is never required by all transporters at the same time.

* **ReservedSendBufferMemory.** Removed prior to NDB 7.5 GA.

  <table frame="box" rules="all" summary="ReservedSendBufferMemory data node configuration parameter type and value information" width="35%"><col style="width: 50%"/><col style="width: 50%"/><tbody><tr> <th>Version (or later)</th> <td>NDB 7.5.0</td> </tr><tr> <th>Type or units</th> <td>bytes</td> </tr><tr> <th>Default</th> <td>256K</td> </tr><tr> <th>Range</th> <td>0 - 4294967039 (0xFFFFFEFF)</td> </tr><tr> <th>Removed</th> <td>NDB 7.5.2</td> </tr><tr> <th>Restart Type</th> <td><p> <span class="bold"><strong>Node Restart: </strong></span>Requires a <a class="link" href="mysql-cluster-rolling-restart.html" title="21.6.5 Performing a Rolling Restart of an NDB Cluster">rolling restart</a> of the cluster. (NDB 7.5.0) </p></td> </tr></tbody></table>

  Previously, this data node parameter was present, but not actually used (Bug #77404, Bug #21280428).

You can use the `ndbinfo.transporters` table to monitor send buffer memory usage, and to detect slowdown and overload conditions that can adversely affect performance.


### 21.4.4 Using High-Speed Interconnects with NDB Cluster

Even before design of `NDBCLUSTER` began in 1996, it was evident that one of the major problems to be encountered in building parallel databases would be communication between the nodes in the network. For this reason, `NDBCLUSTER` was designed from the very beginning to permit the use of a number of different data transport mechanisms, or transporters.

NDB Cluster 7.5 and 7.6 support three of these (see Section 21.2.1, “NDB Cluster Core Concepts”). A fourth transporter, Scalable Coherent Interface (SCI), was also supported in very old versions of `NDB`. This required specialized hardware, software, and MySQL binaries that are no longer available.
