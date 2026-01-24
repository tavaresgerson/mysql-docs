#### 21.2.5.2 Options, Variables, and Parameters Added, Deprecated or Removed in NDB 7.6

* [Parameters Introduced in NDB 7.6](mysql-cluster-added-deprecated-removed-7-6.html#params-added-ndb-7.6 "Parameters Introduced in NDB 7.6")
* [Parameters Deprecated in NDB 7.6](mysql-cluster-added-deprecated-removed-7-6.html#params-deprecated-ndb-7.6 "Parameters Deprecated in NDB 7.6")
* [Parameters Removed in NDB 7.6](mysql-cluster-added-deprecated-removed-7-6.html#params-removed-ndb-7.6 "Parameters Removed in NDB 7.6")
* [Options and Variables Introduced in NDB 7.6](mysql-cluster-added-deprecated-removed-7-6.html#optvars-added-ndb-7.6 "Options and Variables Introduced in NDB 7.6")
* [Options and Variables Deprecated in NDB 7.6](mysql-cluster-added-deprecated-removed-7-6.html#optvars-deprecated-ndb-7.6 "Options and Variables Deprecated in NDB 7.6")
* [Options and Variables Removed in NDB 7.6](mysql-cluster-added-deprecated-removed-7-6.html#optvars-removed-ndb-7.6 "Options and Variables Removed in NDB 7.6")

The next few sections contain information about `NDB` node configuration parameters and NDB-specific [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") options and variables that have been added to, deprecated in, or removed from NDB 7.6.

##### Parameters Introduced in NDB 7.6

The following node configuration parameters have been added in NDB 7.6.

* `ApiFailureHandlingTimeout`: Maximum time for API node failure handling before escalating. 0 means no time limit; minimum usable value is

  10. Added in NDB 7.6.34.
* `EnablePartialLcp`: Enable partial LCP (true); if this is disabled (false), all LCPs write full checkpoints. Added in NDB 7.6.4.

* `EnableRedoControl`: Enable adaptive checkpointing speed for controlling redo log usage. Added in NDB 7.6.7.

* `InsertRecoveryWork`: Percentage of RecoveryWork used for inserted rows; has no effect unless partial local checkpoints are in use. Added in NDB 7.6.5.

* `LocationDomainId`: Assign this API node to specific availability domain or zone. 0 (default) leaves this unset. Added in NDB 7.6.4.

* `LocationDomainId`: Assign this management node to specific availability domain or zone. 0 (default) leaves this unset. Added in NDB 7.6.4.

* `LocationDomainId`: Assign this data node to specific availability domain or zone. 0 (default) leaves this unset. Added in NDB 7.6.4.

* `MaxFKBuildBatchSize`: Maximum scan batch size to use for building foreign keys. Increasing this value may speed up builds of foreign keys but impacts ongoing traffic as well. Added in NDB 7.6.4.

* `MaxReorgBuildBatchSize`: Maximum scan batch size to use for reorganization of table partitions. Increasing this value may speed up table partition reorganization but impacts ongoing traffic as well. Added in NDB 7.6.4.

* `MaxUIBuildBatchSize`: Maximum scan batch size to use for building unique keys. Increasing this value may speed up builds of unique keys but impacts ongoing traffic as well. Added in NDB 7.6.4.

* `ODirectSyncFlag`: O_DIRECT writes are treated as synchronized writes; ignored when ODirect is not enabled, InitFragmentLogFiles is set to SPARSE, or both. Added in NDB 7.6.4.

* `PreSendChecksum`: If this parameter and Checksum are both enabled, perform pre-send checksum checks, and check all SHM signals between nodes for errors. Added in NDB 7.6.6.

* `PreSendChecksum`: If this parameter and Checksum are both enabled, perform pre-send checksum checks, and check all TCP signals between nodes for errors. Added in NDB 7.6.6.

* `RecoveryWork`: Percentage of storage overhead for LCP files: greater value means less work in normal operations, more work during recovery. Added in NDB 7.6.4.

* `SendBufferMemory`: Bytes in shared memory buffer for signals sent from this node. Added in NDB 7.6.6.

* `ShmSpinTime`: When receiving, number of microseconds to spin before sleeping. Added in NDB 7.6.6.

* `UseShm`: Use shared memory connections between this data node and API node also running on this host. Added in NDB 7.6.6.

* `WatchDogImmediateKill`: When true, threads are immediately killed whenever watchdog issues occur; used for testing and debugging. Added in NDB 7.6.7.

##### Parameters Deprecated in NDB 7.6

The following node configuration parameters have been deprecated in NDB 7.6.

* `BackupDataBufferSize`: Default size of databuffer for backup (in bytes). Deprecated in NDB 7.6.4.

* `BackupMaxWriteSize`: Maximum size of file system writes made by backup (in bytes). Deprecated in NDB 7.6.4.

* `BackupWriteSize`: Default size of file system writes made by backup (in bytes). Deprecated in NDB 7.6.4.

* `IndexMemory`: Number of bytes on each data node allocated for storing indexes; subject to available system RAM and size of DataMemory. Deprecated in NDB 7.6.2.

* `Signum`: Signal number to be used for signalling. Deprecated in NDB 7.6.6.

##### Parameters Removed in NDB 7.6

No node configuration parameters have been removed in NDB 7.6.

##### Options and Variables Introduced in NDB 7.6

The following system variables, status variables, and server options have been added in NDB 7.6.

* `Ndb_system_name`: Configured cluster system name; empty if server not connected to NDB. Added in NDB 5.7.18-ndb-7.6.2.

* `ndb-log-fail-terminate`: Terminate mysqld process if complete logging of all found row events is not possible. Added in NDB 5.7.29-ndb-7.6.14.

* `ndb-log-update-minimal`: Log updates in minimal format. Added in NDB 5.7.18-ndb-7.6.3.

* `ndb_row_checksum`: When enabled, set row checksums; enabled by default. Added in NDB 5.7.23-ndb-7.6.8.

##### Options and Variables Deprecated in NDB 7.6

No system variables, status variables, or server options have been deprecated in NDB 7.6.

##### Options and Variables Removed in NDB 7.6

No system variables, status variables, or options have been removed in NDB 7.6.
