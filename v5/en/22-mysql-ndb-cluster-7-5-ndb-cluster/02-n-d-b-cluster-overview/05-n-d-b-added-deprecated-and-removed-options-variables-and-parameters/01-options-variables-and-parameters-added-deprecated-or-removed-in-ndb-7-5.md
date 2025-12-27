#### 21.2.5.1 Options, Variables, and Parameters Added, Deprecated or Removed in NDB 7.5

* [Parameters Introduced in NDB 7.5](mysql-cluster-added-deprecated-removed-7-5.html#params-added-ndb-7.5 "Parameters Introduced in NDB 7.5")
* [Parameters Deprecated in NDB 7.5](mysql-cluster-added-deprecated-removed-7-5.html#params-deprecated-ndb-7.5 "Parameters Deprecated in NDB 7.5")
* [Parameters Removed in NDB 7.5](mysql-cluster-added-deprecated-removed-7-5.html#params-removed-ndb-7.5 "Parameters Removed in NDB 7.5")
* [Options and Variables Introduced in NDB 7.5](mysql-cluster-added-deprecated-removed-7-5.html#optvars-added-ndb-7.5 "Options and Variables Introduced in NDB 7.5")
* [Options and Variables Deprecated in NDB 7.5](mysql-cluster-added-deprecated-removed-7-5.html#optvars-deprecated-ndb-7.5 "Options and Variables Deprecated in NDB 7.5")
* [Options and Variables Removed in NDB 7.5](mysql-cluster-added-deprecated-removed-7-5.html#optvars-removed-ndb-7.5 "Options and Variables Removed in NDB 7.5")

The next few sections contain information about `NDB` node configuration parameters and NDB-specific [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") options and variables that have been added to, deprecated in, or removed from NDB 7.5.

##### Parameters Introduced in NDB 7.5

The following node configuration parameters have been added in NDB 7.5.

* `ApiVerbose`: Enable NDB API debugging; for NDB development. Added in NDB 7.5.2.

##### Parameters Deprecated in NDB 7.5

The following node configuration parameters have been deprecated in NDB 7.5.

* `ExecuteOnComputer`: String referencing earlier defined COMPUTER. Deprecated in NDB 7.5.0.

* `ExecuteOnComputer`: String referencing earlier defined COMPUTER. Deprecated in NDB 7.5.0.

* `ExecuteOnComputer`: String referencing earlier defined COMPUTER. Deprecated in NDB 7.5.0.

##### Parameters Removed in NDB 7.5

The following node configuration parameters have been removed in NDB 7.5.

* `DiskCheckpointSpeed`: Bytes allowed to be written by checkpoint, per second. Removed in NDB 7.5.0.

* `DiskCheckpointSpeedInRestart`: Bytes allowed to be written by checkpoint during restart, per second. Removed in NDB 7.5.0.

* `Id`: Number identifying data node. Now deprecated; use NodeId instead. Removed in NDB 7.5.0.

* `MaxNoOfSavedEvents`: Not used. Removed in NDB 7.5.0.

* `PortNumber`: Port used for SCI transporter. Removed in NDB 7.5.1.

* `PortNumber`: Port used for SHM transporter. Removed in NDB 7.5.1.

* `PortNumber`: Port used for TCP transporter. Removed in NDB 7.5.1.

* `ReservedSendBufferMemory`: This parameter is present in NDB code but is not enabled. Removed in NDB 7.5.2.

##### Options and Variables Introduced in NDB 7.5

The following system variables, status variables, and server options have been added in NDB 7.5.

* `Ndb_system_name`: Configured cluster system name; empty if server not connected to NDB. Added in NDB 5.7.18-ndb-7.5.7.

* `ndb-allow-copying-alter-table`: Set to OFF to keep ALTER TABLE from using copying operations on NDB tables. Added in NDB 5.7.10-ndb-7.5.0.

* `ndb-cluster-connection-pool-nodeids`: Comma-separated list of node IDs for connections to cluster used by MySQL; number of nodes in list must match value set for --ndb-cluster-connection-pool. Added in NDB 5.7.10-ndb-7.5.0.

* `ndb-default-column-format`: Use this value (FIXED or DYNAMIC) by default for COLUMN\_FORMAT and ROW\_FORMAT options when creating or adding table columns. Added in NDB 5.7.11-ndb-7.5.1.

* `ndb-log-fail-terminate`: Terminate mysqld process if complete logging of all found row events is not possible. Added in NDB 5.7.29-ndb-7.5.18.

* `ndb-log-update-minimal`: Log updates in minimal format. Added in NDB 5.7.18-ndb-7.5.7.

* `ndb_data_node_neighbour`: Specifies cluster data node "closest" to this MySQL Server, for transaction hinting and fully replicated tables. Added in NDB 5.7.12-ndb-7.5.2.

* `ndb_default_column_format`: Sets default row format and column format (FIXED or DYNAMIC) used for new NDB tables. Added in NDB 5.7.11-ndb-7.5.1.

* `ndb_fully_replicated`: Whether new NDB tables are fully replicated. Added in NDB 5.7.12-ndb-7.5.2.

* `ndb_read_backup`: Enable read from any replica for all NDB tables; use NDB\_TABLE=READ\_BACKUP={0|1} with CREATE TABLE or ALTER TABLE to enable or disable for individual NDB tables. Added in NDB 5.7.12-ndb-7.5.2.

##### Options and Variables Deprecated in NDB 7.5

No system variables, status variables, or server options have been deprecated in NDB 7.5.

##### Options and Variables Removed in NDB 7.5

No system variables, status variables, or options have been removed in NDB 7.5.
