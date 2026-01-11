#### 25.4.2.1 NDB Cluster Data Node Configuration Parameters

The listings in this section provide information about parameters used in the `[ndbd]` or `[ndbd default]` sections of a `config.ini` file for configuring NDB Cluster data nodes. For detailed descriptions and other additional information about each of these parameters, see Section 25.4.3.6, “Defining NDB Cluster Data Nodes”.

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

* `BuildIndexThreads`: Number of threads to use for building ordered indexes during system or node restart. Also applies when running ndb_restore --rebuild-indexes. Setting this parameter to 0 disables multithreaded building of ordered indexes.

* `CompressedBackup`: Use zlib to compress backups as they are written.

* `CompressedLCP`: Write compressed LCPs using zlib.

* `ConnectCheckIntervalDelay`: Time between data node connectivity check stages. Data node is considered suspect after 1 interval and dead after 2 intervals with no response.

* `CrashOnCorruptedTuple`: When enabled, forces node to shut down whenever it detects corrupted tuple.

* `DataDir`: Data directory for this node.

* `DataMemory`: Number of bytes on each data node allocated for storing data; subject to available system RAM and size of IndexMemory.

* `DefaultHashMapSize`: Set size (in buckets) to use for table hash maps. Three values are supported: 0, 240, and 3840.

* `DictTrace`: Enable DBDICT debugging; for NDB development.

* `DiskDataUsingSameDisk`: Set to false if Disk Data tablespaces are located on separate physical disks.

* `DiskIOThreadPool`: Number of unbound threads for file access, applies to disk data only.

* `Diskless`: Run without using disk.

* `DiskPageBufferEntries`: Memory to allocate in DiskPageBufferMemory; very large disk transactions may require increasing this value.

* `DiskPageBufferMemory`: Number of bytes on each data node allocated for disk page buffer cache.

* `DiskSyncSize`: Amount of data written to file before synch is forced.

* `EnablePartialLcp`: Enable partial LCP (true); if this is disabled (false), all LCPs write full checkpoints.

* `EnableRedoControl`: Enable adaptive checkpointing speed for controlling redo log usage.

* `EncryptedFileSystem`: Encrypt local checkpoint and tablespace files..

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

* `KeepAliveSendInterval`: Time between keep-alive signals on links between data nodes, in milliseconds. Set to 0 to disable.

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

* `MaxDiskDataLatency`: Maximum allowed mean latency of disk access (ms) before starting to abort transactions.

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

* `NodeGroupTransporters`: Number of transporters to use between nodes in same node group.

* `NodeId`: Number uniquely identifying data node among all nodes in cluster.

* `NoOfFragmentLogFiles`: Number of 16 MB redo log files in each of 4 file sets belonging to data node.

* `NoOfReplicas`: Number of copies of all data in database.

* `Numa`: (Linux only; requires libnuma) Controls NUMA support. Setting to 0 permits system to determine use of interleaving by data node process; 1 means that it is determined by data node.

* `ODirect`: Use O_DIRECT file reads and writes when possible.

* `ODirectSyncFlag`: O_DIRECT writes are treated as synchronized writes; ignored when ODirect is not enabled, InitFragmentLogFiles is set to SPARSE, or both.

* `RealtimeScheduler`: When true, data node threads are scheduled as real-time threads. Default is false.

* `RecoveryWork`: Percentage of storage overhead for LCP files: greater value means less work in normal operations, more work during recovery.

* `RedoBuffer`: Number of bytes on each data node allocated for writing redo logs.

* `RedoOverCommitCounter`: When RedoOverCommitLimit has been exceeded this many times, transactions are aborted, and operations are handled as specified by DefaultOperationRedoProblemAction.

* `RedoOverCommitLimit`: Each time that flushing current redo buffer takes longer than this many seconds, number of times that this has happened is compared to RedoOverCommitCounter.

* `RequireEncryptedBackup`: Whether backups must be encrypted (1 = encryption required, otherwise 0).

* `ReservedConcurrentIndexOperations`: Number of simultaneous index operations having dedicated resources on one data node.

* `ReservedConcurrentOperations`: Number of simultaneous operations having dedicated resources in transaction coordinators on one data node.

* `ReservedConcurrentScans`: Number of simultaneous scans having dedicated resources on one data node.

* `ReservedConcurrentTransactions`: Number of simultaneous transactions having dedicated resources on one data node.

* `ReservedFiredTriggers`: Number of triggers having dedicated resources on one data node.

* `ReservedLocalScans`: Number of simultaneous fragment scans having dedicated resources on one data node.

* `ReservedTransactionBufferMemory`: Dynamic buffer space (in bytes) for key and attribute data allocated to each data node.

* `RestartOnErrorInsert`: Control type of restart caused by inserting error (when StopOnError is enabled).

* `RestartSubscriberConnectTimeout`: Amount of time for data node to wait for subscribing API nodes to connect. Set to 0 to disable timeout, which is always resolved to nearest full second.

* `SchedulerExecutionTimer`: Number of microseconds to execute in scheduler before sending.

* `SchedulerResponsiveness`: Set NDB scheduler response optimization 0-10; higher values provide better response time but lower throughput.

* `SchedulerSpinTimer`: Number of microseconds to execute in scheduler before sleeping.

* `ServerPort`: Port used to set up transporter for incoming connections from API nodes.

* `SharedGlobalMemory`: Total number of bytes on each data node allocated for any use.

* `SpinMethod`: Determines spin method used by data node; see documentation for details.

* `StartFailRetryDelay`: Delay in seconds after start failure prior to retry; requires StopOnError = 0.

* `StartFailureTimeout`: Milliseconds to wait before terminating. (0=Wait forever).

* `StartNoNodeGroupTimeout`: Time to wait for nodes without nodegroup before trying to start (0=forever).

* `StartPartialTimeout`: Milliseconds to wait before trying to start without all nodes. (0=Wait forever).

* `StartPartitionedTimeout`: Milliseconds to wait before trying to start partitioned. (0=Wait forever).

* `StartupStatusReportFrequency`: Frequency of status reports during startup.

* `StopOnError`: When set to 0, data node automatically restarts and recovers following node failures.

* `StringMemory`: Default size of string memory (0 to 100 = % of maximum, 101+ = actual bytes).

* `TcpBind_INADDR_ANY`: Bind IP_ADDR_ANY so that connections can be made from anywhere (for autogenerated connections).

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

* `TransactionMemory`: Memory allocated for transactions on each data node.

* `TwoPassInitialNodeRestartCopy`: Copy data in 2 passes during initial node restart, which enables multithreaded building of ordered indexes for such restarts.

* `UndoDataBuffer`: Unused; has no effect.

* `UndoIndexBuffer`: Unused; has no effect.

* `UseShm`: Use shared memory connections between this data node and API node also running on this host.

* `WatchDogImmediateKill`: When true, threads are immediately killed whenever watchdog issues occur; used for testing and debugging.

The following parameters are specific to **ndbmtd**"):

* `AutomaticThreadConfig`: Use automatic thread configuration; overrides any settings for ThreadConfig and MaxNoOfExecutionThreads, and disables ClassicFragmentation.

* `ClassicFragmentation`: When true, use traditional table fragmentation; set false to enable flexible distribution of fragments among LDMs. Disabled by AutomaticThreadConfig.

* `EnableMultithreadedBackup`: Enable multi-threaded backup.

* `MaxNoOfExecutionThreads`: For ndbmtd only, specify maximum number of execution threads.

* `MaxSendDelay`: Maximum number of microseconds to delay sending by ndbmtd.

* `NoOfFragmentLogParts`: Number of redo log file groups belonging to this data node.

* `NumCPUs`: Specify number of CPUs to use with AutomaticThreadConfig.

* `PartitionsPerNode`: Determines the number of table partitions created on each data node; not used if ClassicFragmentation is enabled.

* `ThreadConfig`: Used for configuration of multithreaded data nodes (ndbmtd). Default is empty string; see documentation for syntax and other information.
