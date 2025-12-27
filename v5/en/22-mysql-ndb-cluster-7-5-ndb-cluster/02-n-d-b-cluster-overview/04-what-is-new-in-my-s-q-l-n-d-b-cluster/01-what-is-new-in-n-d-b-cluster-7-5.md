#### 21.2.4.1 What is New in NDB Cluster 7.5

Major changes and new features in NDB Cluster 7.5 which are likely to be of interest are shown in the following list:

* **ndbinfo Enhancements.** A number of changes are made in the [`ndbinfo`](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database") database, chief of which is that it now provides detailed information about NDB Cluster node configuration parameters.

  The [`config_params`](mysql-cluster-ndbinfo-config-params.html "21.6.15.8 The ndbinfo config_params Table") table has been made read-only, and has been enhanced with additional columns providing information about each configuration parameter, including the parameter's type, default value, maximum and minimum values (where applicable), a brief description of the parameter, and whether the parameter is required. This table also provides each parameter with a unique `param_number`.

  A row in the [`config_values`](mysql-cluster-ndbinfo-config-values.html "21.6.15.9 The ndbinfo config_values Table") table shows the current value of a given parameter on the node having a specified ID. The parameter is identified by the value of the `config_param` column, which maps to the `config_params` table's `param_number`.

  Using this relationship you can write a join on these two tables to obtain the default, maximum, minimum, and current values for one or more NDB Cluster configuration parameters by name. An example SQL statement using such a join is shown here:

  ```sql
  SELECT  p.param_name AS Name,
          v.node_id AS Node,
          p.param_type AS Type,
          p.param_default AS 'Default',
          p.param_min AS Minimum,
          p.param_max AS Maximum,
          CASE p.param_mandatory WHEN 1 THEN 'Y' ELSE 'N' END AS 'Required',
          v.config_value AS Current
  FROM    config_params p
  JOIN    config_values v
  ON      p.param_number = v.config_param
  WHERE   p. param_name IN ('NodeId', 'HostName','DataMemory', 'IndexMemory');
  ```

  For more information about these changes, see [Section 21.6.15.8, “The ndbinfo config\_params Table”](mysql-cluster-ndbinfo-config-params.html "21.6.15.8 The ndbinfo config_params Table"). See [Section 21.6.15.9, “The ndbinfo config\_values Table”](mysql-cluster-ndbinfo-config-values.html "21.6.15.9 The ndbinfo config_values Table"), for further information and examples.

  In addition, the `ndbinfo` database no longer depends on the `MyISAM` storage engine. All `ndbinfo` tables and views now use `NDB` (shown as `NDBINFO`).

  Several new `ndbinfo` tables were introduced in NDB 7.5.4. These tables are listed here, with brief descriptions:

  + [`dict_obj_info`](mysql-cluster-ndbinfo-dict-obj-info.html "21.6.15.15 The ndbinfo dict_obj_info Table") provides the names and types of database objects in `NDB`, as well as information about parent obejcts where applicable

  + [`table_distribution_status`](mysql-cluster-ndbinfo-table-distribution-status.html "21.6.15.36 The ndbinfo table_distribution_status Table") provides `NDB` table distribution status information

  + [`table_fragments`](mysql-cluster-ndbinfo-table-fragments.html "21.6.15.37 The ndbinfo table_fragments Table") provides information about the distribution of `NDB` table fragments

  + [`table_info`](mysql-cluster-ndbinfo-table-info.html "21.6.15.38 The ndbinfo table_info Table") provides information about logging, checkpointing, storage, and other options in force for each `NDB` table

  + [`table_replicas`](mysql-cluster-ndbinfo-table-replicas.html "21.6.15.39 The ndbinfo table_replicas Table") provides information about fragment replicas

  See the descriptions of the individual tables for more information.

* **Default row and column format changes.** Starting with NDB 7.5.1, the default value for both the `ROW_FORMAT` option and the `COLUMN_FORMAT` option for [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") can be set to `DYNAMIC` rather than `FIXED`, using a new MySQL server variable [`ndb_default_column_format`](mysql-cluster-options-variables.html#sysvar_ndb_default_column_format) is added as part of this change; set this to `FIXED` or `DYNAMIC` (or start [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") with the equivalent option [`--ndb-default-column-format=FIXED`](mysql-cluster-options-variables.html#option_mysqld_ndb-default-column-format)) to force this value to be used for `COLUMN_FORMAT` and `ROW_FORMAT`. Prior to NDB 7.5.4, the default for this variable was `DYNAMIC`; in this and later versions, the default is `FIXED`, which provides backwards compatibility with prior releases (Bug #24487363).

  The row format and column format used by existing table columns are unaffected by this change. New columns added to such tables use the new defaults for these (possibly overridden by `ndb_default_column_format`), and existing columns are changed to use these as well, provided that the [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement performing this operation specifies `ALGORITHM=COPY`.

  Note

  A copying `ALTER TABLE` cannot be done implicitly if [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") is run with [`--ndb-allow-copying-alter-table=FALSE`](mysql-cluster-options-variables.html#option_mysqld_ndb-allow-copying-alter-table).

* **ndb\_binlog\_index no longer dependent on MyISAM.** As of NDB 7.5.2, the `ndb_binlog_index` table employed in NDB Cluster Replication now uses the [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") storage engine instead of `MyISAM`. When upgrading, you can run [**mysql\_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") with [`--force`](mysql-upgrade.html#option_mysql_upgrade_force) [`--upgrade-system-tables`](mysql-upgrade.html#option_mysql_upgrade_upgrade-system-tables) to cause it to execute [`ALTER TABLE ... ENGINE=INNODB`](alter-table.html "13.1.8 ALTER TABLE Statement") on this table. Use of `MyISAM` for this table remains supported for backward compatibility.

  A benefit of this change is that it makes it possible to depend on transactional behavior and lock-free reads for this table, which can help alleviate concurrency issues during purge operations and log rotation, and improve the availability of this table.

* **ALTER TABLE changes.** NDB Cluster formerly supported an alternative syntax for online [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"). This is no longer supported in NDB Cluster 7.5, which makes exclusive use of `ALGORITHM = DEFAULT|COPY|INPLACE` for table DDL, as in the standard MySQL Server.

  Another change affecting the use of this statement is that `ALTER TABLE ... ALGORITHM=INPLACE RENAME` may now contain DDL operations in addition to the renaming.

* **ExecuteOnComputer parameter deprecated.** The `ExecuteOnComputer` configuration parameter for [management nodes](mysql-cluster-mgm-definition.html#ndbparam-mgmd-executeoncomputer), [data nodes](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-executeoncomputer), and [API nodes](mysql-cluster-api-definition.html#ndbparam-api-executeoncomputer) has been deprecated and is now subject to removal in a future release of NDB Cluster. You should use the equivalent `HostName` parameter for all three types of nodes.

* **records-per-key optimization.** The NDB handler now uses the records-per-key interface for index statistics implemented for the optimizer in MySQL 5.7.5. Some of the benefits from this change include those listed here:

  + The optimizer now chooses better execution plans in many cases where a less optimal join index or table join order would previously have been chosen

  + Row estimates shown by [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") are more accurate

  + Cardinality estimates shown by [`SHOW INDEX`](show-index.html "13.7.5.22 SHOW INDEX Statement") are improved

* **Connection pool node IDs.** NDB 7.5.0 adds the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") [`--ndb-cluster-connection-pool-nodeids`](mysql-cluster-options-variables.html#option_mysqld_ndb-cluster-connection-pool-nodeids) option, which allows a set of node IDs to be set for the connection pool. This setting overrides [`--ndb-nodeid`](mysql-cluster-options-variables.html#option_mysqld_ndb-nodeid), which means that it also overrides both the [`--ndb-connectstring`](mysql-cluster-options-variables.html#option_mysqld_ndb-connectstring) option and the `NDB_CONNECTSTRING` environment variable.

  Note

  You can set the size for the connection pool using the [`--ndb-cluster-connection-pool`](mysql-cluster-options-variables.html#option_mysqld_ndb-cluster-connection-pool) option for [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

* **create\_old\_temporals removed.** The `create_old_temporals` system variable was deprecated in NDB Cluster 7.4, and has now been removed.

* **ndb\_mgm Client PROMPT command.** NDB Cluster 7.5 adds a new command for setting the client's command-line prompt. The following example illustrates the use of the [`PROMPT`](mysql-cluster-mgm-client-commands.html#ndbclient-prompt) command:

  ```sql
  ndb_mgm> PROMPT mgm#1:
  mgm#1: SHOW
  Cluster Configuration
  ---------------------
  [ndbd(NDB)]     4 node(s)
  id=5    @10.100.1.1  (mysql-5.7.44-ndb-7.5.36, Nodegroup: 0, *)
  id=6    @10.100.1.3  (mysql-5.7.44-ndb-7.5.36, Nodegroup: 0)
  id=7    @10.100.1.9  (mysql-5.7.44-ndb-7.5.36, Nodegroup: 1)
  id=8    @10.100.1.11  (mysql-5.7.44-ndb-7.5.36, Nodegroup: 1)

  [ndb_mgmd(MGM)] 1 node(s)
  id=50   @10.100.1.8  (mysql-5.7.44-ndb-7.5.36)

  [mysqld(API)]   2 node(s)
  id=100  @10.100.1.8  (5.7.44-ndb-7.5.36)
  id=101  @10.100.1.10  (5.7.44-ndb-7.5.36)

  mgm#1: PROMPT
  ndb_mgm> EXIT
  jon@valhaj:/usr/local/mysql/bin>
  ```

  For additional information and examples, see [Section 21.6.1, “Commands in the NDB Cluster Management Client”](mysql-cluster-mgm-client-commands.html "21.6.1 Commands in the NDB Cluster Management Client").

* **Increased FIXED column storage per fragment.** NDB Cluster 7.5 and later supports a maximum of 128 TB per fragment of data in `FIXED` columns. In NDB Cluster 7.4 and earlier, this was 16 GB per fragment.

* **Deprecated parameters removed.** The following NDB Cluster data node configuration parameters were deprecated in previous releases of NDB Cluster, and were removed in NDB 7.5.0:

  + `Id`: deprecated in NDB 7.1.9; replaced by [`NodeId`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nodeid).

  + `NoOfDiskPagesToDiskDuringRestartTUP`, `NoOfDiskPagesToDiskDuringRestartACC`: both deprecated, had no effect; replaced in MySQL 5.1.6 by `DiskCheckpointSpeedInRestart`, which itself was later deprecated (in NDB 7.4.1) and is now also removed.

  + `NoOfDiskPagesToDiskAfterRestartACC`, `NoOfDiskPagesToDiskAfterRestartTUP`: both deprecated, and had no effect; replaced in MySQL 5.1.6 by `DiskCheckpointSpeed`, which itself was later deprecated (in NDB 7.4.1) and is now also removed.

  + `ReservedSendBufferMemory`: Deprecated; no longer had any effect.

  + `MaxNoOfIndexes`: archaic (pre-MySQL 4.1), had no effect; long since replaced by [`MaxNoOfOrderedIndexes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooforderedindexes) or [`MaxNoOfUniqueHashIndexes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofuniquehashindexes).

  + `Discless`: archaic (pre-MySQL 4.1) synonym for and long since replaced by [`Diskless`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskless).

  The archaic and unused (and for this reason also previously undocumented) `ByteOrder` computer configuration parameter was also removed in NDB 7.5.0.

  The parameters just described are not supported in NDB 7.5. Attempting to use any of these parameters in an NDB Cluster configuration file now results in an error.

* **DBTC scan enhancements.** Scans have been improved by reducing the number of signals used for communication between the [`DBTC`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtc.html) and [`DBDIH`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbdih.html) kernel blocks in [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), enabling higher scalability of data nodes when used for scan operations by decreasing the use of CPU resources for scan operations, in some cases by an estimated five percent.

  Also as result of these changes response times should be greatly improved, which could help prevent issues with overload of the main threads. In addition, scans made in the [`BACKUP`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-backup.html) kernel block have also been improved and made more efficient than in previous releases.

* **JSON column support.** NDB 7.5.2 and later supports the [`JSON`](json.html "11.5 The JSON Data Type") column type for `NDB` tables and the JSON functions found in the MySQL Server, subject to the limitation that an `NDB` table can have at most 3 `JSON` columns.

* **Read from any fragment replica; specify number of hashmap partition fragments.** Previously, all reads were directed towards the primary fragment replica except for simple reads. (A simple read is a read that locks the row while reading it.) Beginning with NDB 7.5.2, it is possible to enable reads from any fragment replica. This is disabled by default but can be enabled for a given SQL node using the [`ndb_read_backup`](mysql-cluster-options-variables.html#sysvar_ndb_read_backup) system variable added in this release.

  Previously, it was possible to define tables with only one type of partition mapping, with one primary partition on each LDM in each node, but in NDB 7.5.2 it becomes possible to be more flexible about the assignment of partitions by setting a partition balance (fragment count type). Possible balance schemes are one per node, one per node group, one per LDM per node, and one per LDM per node group.

  This setting can be controlled for individual tables by means of a `PARTITION_BALANCE` option (renamed from `FRAGMENT_COUNT_TYPE` in NDB 7.5.4) embedded in `NDB_TABLE` comments in [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") or [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statements. Settings for table-level `READ_BACKUP` are also supported using this syntax. For more information and examples, see [Section 13.1.18.9, “Setting NDB Comment Options”](create-table-ndb-comment-options.html "13.1.18.9 Setting NDB Comment Options").

  In NDB API applications, a table's partition balance can also be get and set using methods supplied for this purpose; see [Table::getPartitionBalance()](/doc/ndbapi/en/ndb-table.html#ndb-table-getpartitionbalance), and [Table::setPartitionBalance()](/doc/ndbapi/en/ndb-table.html#ndb-table-setpartitionbalance), as well as [Object::PartitionBalance](/doc/ndbapi/en/ndb-object.html#ndb-object-partitionbalance), for more information about these.

  As part of this work, NDB 7.5.2 also introduces the [`ndb_data_node_neighbour`](mysql-cluster-options-variables.html#sysvar_ndb_data_node_neighbour) system variable. This is intended for use, in transaction hinting, to provide a “nearby” data node to this SQL node.

  In addition, when restoring table schemas, [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") [`--restore-meta`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_restore-meta) now uses the target cluster's default partitioning, rather than using the same number of partitions as the original cluster from which the backup was taken. See [Section 21.5.24.2.2, “Restoring to More Nodes Than the Original”](ndb-restore-different-number-nodes.html#ndb-restore-to-more-nodes "21.5.24.2.2 Restoring to More Nodes Than the Original"), for more information and an example.

  NDB 7.5.3 adds a further enhancement to `READ_BACKUP`: In this and later versions, it is possible to set `READ_BACKUP` for a given table online as part of [`ALTER TABLE ... ALGORITHM=INPLACE ...`](mysql-cluster-online-operations.html "21.6.12 Online Operations with ALTER TABLE in NDB Cluster").

* **ThreadConfig improvements.** A number of enhancements and feature additions are implemented in NDB 7.5.2 for the `ThreadConfig` multithreaded data node ([**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)")) configuration parameter, including support for an increased number of platforms. These changes are described in the next few paragraphs.

  Non-exclusive CPU locking is now supported on FreeBSD and Windows, using `cpubind` and `cpuset`. Exclusive CPU locking is now supported on Solaris (only) using the `cpubind_exclusive` and `cpuset_exclusive` parameters which are introduced in this release.

  Thread prioritzation is now available, controlled by the new `thread_prio` parameter. `thread_prio` is supported on Linux, FreeBSD, Windows, and Solaris, and varies somewhat by platform. For more information, see the description of [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig).

  The `realtime` parameter is now supported on Windows platforms.

* **Partitions larger than 16 GB.** Due to an improvement in the hash index implementation used by NDB Cluster data nodes, partitions of `NDB` tables may now contain more than 16 GB of data for fixed columns, and the maximum partition size for fixed columns is now raised to 128 TB. The previous limitation was due to the fact that the [`DBACC`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbacc.html) block in the `NDB` kernel used only 32-bit references to the fixed-size part of a row in the [`DBTUP`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtup.html) block, although 45-bit references to this data are used in [`DBTUP`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtup.html) itself and elsewhere in the kernel outside `DBACC`; all such references in to the data handled in the `DBACC` block now use 45 bits instead.

* **Print SQL statements from ndb\_restore.** NDB 7.5.4 adds the [`--print-sql-log`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_print-sql-log) option for the [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") utility provided with the NDB Cluster distribution. This option enables SQL logging to `stdout`. **Important**: Every table to be restored using this option must have an explicitly defined primary key.

  See [Section 21.5.24, “ndb\_restore — Restore an NDB Cluster Backup”](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), for more information.

* **Organization of RPM packages.** Beginning with NDB 7.5.4, the naming and organization of RPM packages provided for NDB Cluster align more closely with those released for the MySQL server. The names of all NDB Cluster RPMs are now prefixed with `mysql-cluster`. Data nodes are now installed using the `data-node` package; management nodes are now installed from the `management-server` package; and SQL nodes require the `server` and `common` packages. MySQL and `NDB` client programs, including the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client and the [**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") management client, are now included in the `client` RPM.

  For a detailed listing of NDB Cluster RPMs and other information, see [Section 21.3.1.2, “Installing NDB Cluster from RPM”](mysql-cluster-install-linux-rpm.html "21.3.1.2 Installing NDB Cluster from RPM").

* **ndbinfo processes and config\_nodes tables.** NDB 7.5.7 adds two tables to the [`ndbinfo`](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database") information database to provide information about cluster nodes; these tables are listed here:

  + [`config_nodes`](mysql-cluster-ndbinfo-config-nodes.html "21.6.15.7 The ndbinfo config_nodes Table"): This table provides the node ID, process type, and host name for each node listed in an NDB cluster's configuration file.

  + The [`processes`](mysql-cluster-ndbinfo-processes.html "21.6.15.30 The ndbinfo processes Table") shows information about nodes currently connected to the cluster; this information includes the process name and system process ID; for each data node and SQL node, it also shows the process ID of the node's angel process. In addition, the table shows a service address for each connected node; this address can be set in NDB API applications using the [`Ndb_cluster_connection::set_service_uri()`](/doc/ndbapi/en/ndb-ndb-cluster-connection.html#ndb-ndb-cluster-connection-set-service-uri) method, which is also added in NDB 7.5.7.

* **System name.** The system name of an NDB cluster can be used to identify a specific cluster. Beginning with NDB 7.5.7, the MySQL Server shows this name as the value of the [`Ndb_system_name`](mysql-cluster-options-variables.html#statvar_Ndb_system_name) status variable; NDB API applications can use the [`Ndb_cluster_connection::get_system_name()`](/doc/ndbapi/en/ndb-ndb-cluster-connection.html#ndb-ndb-cluster-connection-get-system-name) method which is added in the same release.

  A system name based on the time the management server was started is generated automatically; you can override this value by adding a `[system]` section to the cluster's configuration file and setting the `Name` parameter to a value of your choice in this section, prior to starting the management server.

* **ndb\_restore options.** Beginning with NDB 7.5.13, the [`--nodeid`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_nodeid) and [`--backupid`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid) options are both required when invoking [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup").

* **ndb\_blob\_tool enhancements.** Beginning with NDB 7.5.18, the [**ndb\_blob\_tool**](mysql-cluster-programs-ndb-blob-tool.html "21.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables") utility can detect missing blob parts for which inline parts exist and replace these with placeholder blob parts (consisting of space characters) of the correct length. To check whether there are missing blob parts, use the [`--check-missing`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_check-missing) option with this program. To replace any missing blob parts with placeholders, use the [`--add-missing`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_add-missing) option.

  For more information, see [Section 21.5.6, “ndb\_blob\_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables”](mysql-cluster-programs-ndb-blob-tool.html "21.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables").

* **--ndb-log-fail-terminate option.** Beginning with NDB 7.5.18, you can cause the SQL node to terminate whenever it is unable to log all row events fully. This can be done by starting [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") with the [`--ndb-log-fail-terminate`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-fail-terminate) option.

* **NDB programs—NDBT dependency removal.** The dependency of a number of `NDB` utility programs on the `NDBT` library has been removed. This library is used internally for development, and is not required for normal use; its inclusion in these programs could lead to unwanted issues when testing.

  Affected programs are listed here, along with the `NDB` versions in which the dependency was removed:

  + [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), in NDB 7.5.15
  + [**ndb\_show\_tables**](mysql-cluster-programs-ndb-show-tables.html "21.5.27 ndb_show_tables — Display List of NDB Tables"), in NDB 7.5.18
  + [**ndb\_waiter**](mysql-cluster-programs-ndb-waiter.html "21.5.30 ndb_waiter — Wait for NDB Cluster to Reach a Given Status"), in NDB 7.5.18

  The principal effect of this change for users is that these programs no longer print `NDBT_ProgramExit - status` following completion of a run. Applications that depend upon such behavior should be updated to reflect the change when upgrading to the indicated versions.

* **Auto-Installer deprecation and removal.** The MySQL NDB Cluster Auto-Installer web-based installation tool (**ndb\_setup.py**) is deprecated in NDB 7.5.20, and is removed in NDB 7.5.21 and later. It is no longer supported.

* **ndbmemcache deprecation and removal.** `ndbmemcache` is no longer supported. `ndbmemcache` was deprecated in NDB 7.5.20, and removed in NDB 7.5.21.

* **Node.js support removed.** Beginning with the NDB Cluster 7.5.20 release, support for Node.js by NDB 7.5 has been removed.

  Support for Node.js by NDB Cluster is maintained in NDB 8.0 only.

* **Conversion between NULL and NOT NULL during restore operations.** Beginning with NDB 7.5.23, [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") can support restoring of `NULL` columns as `NOT NULL` and the reverse, using the options listed here:

  + To restore a `NULL` column as `NOT NULL`, use the [`--lossy-conversions`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_lossy-conversions) option.

    The column originally declared as `NULL` must not contain any `NULL` rows; if it does, [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") exits with an error.

  + To restore a `NOT NULL` column as `NULL`, use the [`--promote-attributes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_promote-attributes) option.

  For more information, see the descriptions of the indicated [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") options.

* **OpenSSL 3.0 support.** Beginning with NDB 7.5.31, all MySQL server and client binaries included in the `NDB` distribution are compiled with support for Open SSL 3.0

ClusterJPA is no longer supported beginning with NDB 7.5.7; its source code and binary have been removed from the NDB Cluster distribution.

NDB Cluster 7.5 is also supported by MySQL Cluster Manager, which provides an advanced command-line interface that can simplify many complex NDB Cluster management tasks. See [MySQL Cluster Manager 1.4.8 User Manual](/doc/mysql-cluster-manager/1.4/en/), for more information.
