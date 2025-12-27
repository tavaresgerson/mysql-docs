#### 21.2.4.2 What is New in NDB Cluster 7.6

New features and other important changes in NDB Cluster 7.6 which are likely to be of interest are shown in the following list:

* **New Disk Data table file format.** A new file format is used in NDB 7.6 for NDB Disk Data tables, which makes it possible for each Disk Data table to be uniquely identified without reusing any table IDs. This should help resolve issues with page and extent handling that were visible to the user as problems with rapid creating and dropping of Disk Data tables, and for which the old format did not provide a ready means to fix.

  The new format is now used whenever new undo log file groups and tablespace data files are created. Files relating to existing Disk Data tables continue to use the old format until their tablespaces and undo log file groups are re-created.

  Important

  The old and new formats are not compatible; different data files or undo log files that are used by the same Disk Data table or tablespace cannot use a mix of formats.

  To avoid problems relating to the changes in format, you should re-create any existing tablespaces and undo log file groups when upgrading to NDB 7.6. You can do this by performing an initial restart of each data node (that is, using the [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial) option) as part of the upgrade process. You can expect this step to be made mandatory as part of upgrading from NDB 7.5 or an earlier release series to NDB 7.6 or later.

  If you are using Disk Data tables, a downgrade from *any* NDB 7.6 release—without regard to release status—to any NDB 7.5 or earlier release requires that you restart all data nodes with [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial) as part of the downgrade process. This is because NDB 7.5 and earlier release series are not able to read the new Disk Data file format.

  For more information, see [Section 21.3.7, “Upgrading and Downgrading NDB Cluster”](mysql-cluster-upgrade-downgrade.html "21.3.7 Upgrading and Downgrading NDB Cluster").

* **Data memory pooling and dynamic index memory.** Memory required for indexes on `NDB` table columns is now allocated dynamically from that allocated for [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory). For this reason, the [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory) configuration parameter is now deprecated, and subject to removal in a future release series.

  Important

  In NDB 7.6, if `IndexMemory` is set in the `config.ini` file, the management server issues the warning IndexMemory is deprecated, use Number bytes on each ndbd(DB) node allocated for storing indexes instead on startup, and any memory assigned to this parameter is automatically added to `DataMemory`.

  In addition, the default value for `DataMemory` has been increased to 98M; the default for `IndexMemory` has been decreased to 0.

  The pooling together of index memory with data memory simplifies the configuration of `NDB`; a further benefit of these changes is that scaling up by increasing the number of LDM threads is no longer limited by having set an insufficiently large value for `IndexMemory`.This is because index memory is no longer a static quantity which is allocated only once (when the cluster starts), but can now be allocated and deallocated as required. Previously, it was sometimes the case that increasing the number of LDM threads could lead to index memory exhaustion while large amounts of `DataMemory` remained available.

  As part of this work, a number of instances of [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) usage not directly related to storage of table data now use transaction memory instead.

  For this reason, it may be necessary on some systems to increase [`SharedGlobalMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-sharedglobalmemory) to allow transaction memory to increase when needed, such as when using NDB Cluster Replication, which requires a great deal of buffering on the data nodes. On systems performing initial bulk loads of data, it may be necessary to break up very large transactions into smaller parts.

  In addition, data nodes now generate `MemoryUsage` events (see [Section 21.6.3.2, “NDB Cluster Log Events”](mysql-cluster-log-events.html "21.6.3.2 NDB Cluster Log Events")) and write appropriate messages in the cluster log when resource usage reaches 99%, as well as when it reaches 80%, 90%, or 100%, as before.

  Other related changes are listed here:

  + `IndexMemory` is no longer one of the values displayed in the [`ndbinfo.memoryusage`](mysql-cluster-ndbinfo-memoryusage.html "21.6.15.26 The ndbinfo memoryusage Table") table's `memory_type` column; is also no longer displayed in the output of [**ndb\_config**](mysql-cluster-programs-ndb-config.html "21.5.7 ndb_config — Extract NDB Cluster Configuration Information").

  + [`REPORT MEMORYUSAGE`](mysql-cluster-mgm-client-commands.html#ndbclient-report) and other commands which expose memory consumption now shows index memory consumption using 32K pages (previously these were 8K pages).

  + The [`ndbinfo.resources`](mysql-cluster-ndbinfo-resources.html "21.6.15.31 The ndbinfo resources Table") table now shows the `DISK_OPERATIONS` resource as `TRANSACTION_MEMORY`, and the `RESERVED` resource has been removed.

* **ndbinfo processes and config\_nodes tables.** NDB 7.6 adds two tables to the [`ndbinfo`](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database") information database to provide information about cluster nodes; these tables are listed here:

  + [`config_nodes`](mysql-cluster-ndbinfo-config-nodes.html "21.6.15.7 The ndbinfo config_nodes Table"): This table the node ID, process type, and host name for each node listed in an NDB cluster's configuration file.

  + The [`processes`](mysql-cluster-ndbinfo-processes.html "21.6.15.30 The ndbinfo processes Table") shows information about nodes currently connected to the cluster; this information includes the process name and system process ID; for each data node and SQL node, it also shows the process ID of the node's angel process. In addition, the table shows a service address for each connected node; this address can be set in NDB API applications using the [`Ndb_cluster_connection::set_service_uri()`](/doc/ndbapi/en/ndb-ndb-cluster-connection.html#ndb-ndb-cluster-connection-set-service-uri) method, which is also added in NDB 7.6.

* **System name.** The system name of an NDB cluster can be used to identify a specific cluster. In NDB 7.6, the MySQL Server shows this name as the value of the [`Ndb_system_name`](mysql-cluster-options-variables.html#statvar_Ndb_system_name) status variable; NDB API applications can use the [`Ndb_cluster_connection::get_system_name()`](/doc/ndbapi/en/ndb-ndb-cluster-connection.html#ndb-ndb-cluster-connection-get-system-name) method which is added in the same release.

  A system name based on the time the management server was started is generated automatically>; you can override this value by adding a `[system]` section to the cluster's configuration file and setting the `Name` parameter to a value of your choice in this section, prior to starting the management server.

* **ndb\_import CSV import tool.** [**ndb\_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Import CSV Data Into NDB"), added in NDB Cluster 7.6, loads CSV-formatted data directly into an [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table using the NDB API (a MySQL server is needed only to create the table and database in which it is located). [**ndb\_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Import CSV Data Into NDB") can be regarded as an analog of [**mysqlimport**](mysqlimport.html "4.5.5 mysqlimport — A Data Import Program") or the [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") SQL statement, and supports many of the same or similar options for formatting of the data.

  Assuming that the database and target `NDB` table exist, [**ndb\_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Import CSV Data Into NDB") needs only a connection to the cluster's management server ([**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon")) to perform the importation; for this reason, there must be an `[api]` slot available to the tool in the cluster's `config.ini` file purpose.

  See [Section 21.5.14, “ndb\_import — Import CSV Data Into NDB”](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Import CSV Data Into NDB"), for more information.

* **ndb\_top monitoring tool.** Added the [**ndb\_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads") utility, which shows CPU load and usage information for an `NDB` data node in real time. This information can be displayed in text format, as an ASCII graph, or both. The graph can be shown in color, or using grayscale.

  [**ndb\_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads") connects to an NDB Cluster SQL node (that is, a MySQL Server). For this reason, the program must be able to connect as a MySQL user having the [`SELECT`](privileges-provided.html#priv_select) privilege on tables in the [`ndbinfo`](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database") database.

  [**ndb\_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads") is available for Linux, Solaris, and macOS platforms, but is not currently available for Windows platforms.

  For more information, see [Section 21.5.29, “ndb\_top — View CPU usage information for NDB threads”](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads").

* **Code cleanup.** A significant number of debugging statements and printouts not necessary for normal operations have been moved into code used only when testing or debugging `NDB`, or dispensed with altogether. This removal of overhead should result in a noticeable improvement in the performance of LDM and TC threads on the order of 10% in many cases.

* **LDM thread and LCP improvements.** Previously, when a local data management thread experienced I/O lag, it wrote to local checkpoints more slowly. This could happen, for example, during a disk overload condition. Problems could occur because other LDM threads did not always observe this state, or do likewise. `NDB` now tracks I/O lag mode globally, so that this state is reported as soon as at least one thread is writing in I/O lag mode; it then makes sure that the reduced write speed for this LCP is enforced for all LDM threads for the duration of the slowdown condition. Because the reduction in write speed is now observed by other LDM instances, overall capacity is increased; this enables the disk overload (or other condition inducing I/O lag) to be overcome more quickly in such cases than it was previously.

* **NDB error identification.** Error messages and information can be obtained using the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client in NDB 7.6 from a new [`error_messages`](mysql-cluster-ndbinfo-error-messages.html "21.6.15.21 The ndbinfo error_messages Table") table in the [`ndbinfo`](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database") information database. In addition, NDB 7.6 introduces a new command-line client [**ndb\_perror**](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information") for obtaining information from NDB error codes; this replaces using [**perror**](perror.html "4.8.2 perror — Display MySQL Error Message Information") with [`--ndb`](perror.html#option_perror_ndb), which is now deprecated and subject to removal in a future release.

  For more information, see [Section 21.6.15.21, “The ndbinfo error\_messages Table”](mysql-cluster-ndbinfo-error-messages.html "21.6.15.21 The ndbinfo error_messages Table"), and [Section 21.5.17, “ndb\_perror — Obtain NDB Error Message Information”](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information").

* **SPJ improvements.** When executing a scan as a pushed join (that is, the root of the query is a scan), the [`DBTC`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtc.html) block sends an SPJ request to a [`DBSPJ`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbspj.html) instance on the same node as the fragment to be scanned. Formerly, one such request was sent for each of the node's fragments. As the number of `DBTC` and `DBSPJ` instances is normally set less than the number of LDM instances, this means that all SPJ instances were involved in the execution of a single query, and, in fact, some SPJ instances could (and did) receive multiple requests from the same query. NDB 7.6 makes it possible for a single SPJ request to handle a set of root fragments to be scanned, so that only a single SPJ request (`SCAN_FRAGREQ`) needs to be sent to any given SPJ instance (`DBSPJ` block) on each node.

  Since `DBSPJ` consumes a relatively small amount of the total CPU used when evaluating a pushed join, unlike the LDM block (which is repsonsible for the majority of the CPU usage), introducing multiple SPJ blocks adds some parallelism, but the additional overhead also increases. By enabling a single SPJ request to handle a set of root fragments to be scanned, such that only a single SPJ request is sent to each `DBSPJ` instance on each node and batch sizes are allocated per fragment, the multi-fragment scan can obtain a larger total batch size, allowing for some scheduling optimizations to be done within the SPJ block, which can scan a single fragment at a time (giving it the total batch size allocation), scan all fragments in parallel using smaller sub-batches, or some combination of the two.

  This work is expected to increase performance of pushed-down joins for the following reasons:

  + Since multiple root fragments can be scanned for each SPJ request, it is necessary to request fewer SPJ instances when executing a pushed join

  + Increased available batch size allocation, and for each fragment, should also in most cases result in fewer requests being needed to complete a join

* **Improved O\_DIRECT handling for redo logs.** NDB 7.6 provides a new data node configuration parameter [`ODirectSyncFlag`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-odirectsyncflag) which causes completed redo log writes using `O_DIRECT` to be handled as `fsync` calls. `ODirectSyncFlag` is disabled by default; to enable it, set it to `true`.

  You should bear in mind that the setting for this parameter is ignored when at least one of the following conditions is true:

  + [`ODirect`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-odirect) is not enabled.

  + `InitFragmentLogFiles` is set to `SPARSE`.

* **Locking of CPUs to offline index build threads.** In NDB 7.6, offline index builds by default use all cores available to [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"), instead of being limited to the single core reserved for the I/O thread. It also becomes possible to specify a desired set of cores to be used for I/O threads performing offline multithreaded builds of ordered indexes. This can improve restart and restore times and performance, as well as availability.

  Note

  “Offline” as used here refers to an ordered index build that takes place while a given table is not being written to. Such index builds occur during a node or system restart, or when restoring a cluster from backup using [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") [`--rebuild-indexes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_rebuild-indexes).

  This improvement involves several related changes. The first of these is to change the default value for the [`BuildIndexThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-buildindexthreads) configuration parameter (from 0 to 128), means that offline ordered index builds are now multithreaded by default. The default value for the [`TwoPassInitialNodeRestartCopy`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-twopassinitialnoderestartcopy) is also changed (from `false` to `true`), so that an initial node restart first copies all data without any creation of indexes from a “live” node to the node which is being started, builds the ordered indexes offline after the data has been copied, then again synchronizes with the live node; this can significantly reduce the time required for building indexes. In addition, to facilitate explicit locking of offline index build threads to specific CPUs, a new thread type (`idxbld`) is defined for the [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig) configuration parameter.

  As part of this work, `NDB` can now distinguish between execution thread types and other types of threads, and between types of threads which are permanently assigned to specific tasks, and those whose assignments are merely temporary.

  NDB 7.6 also introduces the `nosend` parameter for [`ThreadCOnfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig). By setting this to 1, you can keep a `main`, `ldm`, `rep`, or `tc` thread from assisting the send threads. This parameter is 0 by default, and cannot be used with I/O threads, send threads, index build threads, or watchdog threads.

  For additonal information, see the descriptions of the parameters.

* **Variable batch sizes for DDL bulk data operations.** As part of work ongoing to optimize bulk DDL performance by [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"), it is now possible to obtain performance improvements by increasing the batch size for the bulk data parts of DDL operations processing data using scans. Batch sizes are now made configurable for unique index builds, foreign key builds, and online reorganization, by setting the respective data node configuration parameters listed here:

  + [`MaxUIBuildBatchSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxuibuildbatchsize): Maximum scan batch size used for building unique keys.

  + [`MaxFKBuildBatchSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxfkbuildbatchsize): Maximum scan batch size used for building foreign keys.

  + [`MaxReorgBuildBatchSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxreorgbuildbatchsize): Maximum scan batch size used for reorganization of table partitions.

  For each of the parameters just listed, the default value is 64, the minimum is 16, and the maximum is 512.

  Increasing the appropriate batch size or sizes can help amortize inter-thread and inter-node latencies and make use of more parallel resources (local and remote) to help scale DDL performance. In each case there can be a tradeoff with ongoing traffic.

* **Partial LCPs.** NDB 7.6 implements partial local checkpoints. Formerly, an LCP always made a copy of the entire database. When working with terabytes of data this process could require a great deal of time, with an adverse impact on node and cluster restarts especially, as well as more space for the redo logs. It is now no longer strictly necessary for LCPs to do this—instead, an LCP now by default saves only a number of records that is based on the quantity of data changed since the previous LCP. This can vary between a full checkpoint and a checkpoint that changes nothing at all. In the event that the checkpoint reflects any changes, the minimum is to write one part of the 2048 making up a local LCP.

  As part of this change, two new data node configuration parameters are inroduced in this release: [`EnablePartialLcp`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-enablepartiallcp) (default `true`, or enabled) enables partial LCPs. [`RecoveryWork`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-recoverywork) controls the percentage of space given over to LCPs; it increases with the amount of work which must be performed on LCPs during restarts as opposed to that performed during normal operations. Raising this value causes LCPs during normal operations to require writing fewer records and so decreases the usual workload. Raising this value also means that restarts can take longer.

  You must disable partial LCPs explicitly by setting `EnablePartialLcp=false`. This uses the least amount of disk, but also tends to maximize the write load for LCPs. To optimize for the lowest workload on LCPs during normal operation, use `EnablePartialLcp=true` and `RecoveryWork=100`. To use the least disk space for partial LCPs, but with bounded writes, use `EnablePartialLcp=true` and `RecoveryWork=25`, which is the minimum for `RecoveryWork`. The default is `EnablePartialLcp=true` with `RecoveryWork=50`, which means LCP files require approximately 1.5 times [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory); using [`CompressedLcp=1`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-compressedlcp), this can be further reduced by half. Recovery times using the default settings should also be much faster than when `EnablePartialLcp` is set to `false`.

  Note

  The default value for `RecoveryWork` was increased from 50 to 60.

  In addition the data node configuration parameters [`BackupDataBufferSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupdatabuffersize), [`BackupWriteSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupwritesize), and [`BackupMaxWriteSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupmaxwritesize) are all now deprecated, and subject to removal in a future release of MySQL NDB Cluster.

  As part of this enhancement, work has been done to correct several issues with node restarts wherein it was possible to run out of undo log in various situations, most often when restoring a node that had been down for a long time during a period of intensive write activity.

  Additional work was done to improve data node survival of long periods of synchronization without timing out, by updating the LCP watchdog during this process, and keeping better track of the progress of disk data synchronization. Previously, there was the possibility of spurious warnings or even node failures if synchronization took longer than the LCP watchdog timeout.

  Important

  When upgrading an NDB Cluster that uses disk data tables to NDB 7.6 or downgrading it from NDB 7.6, it is necessary to restart all data nodes with [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial).

* **Parallel undo log record processing.** Formerly, the data node [`LGMAN`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-lgman.html) kernel block processed undo log records serially; now this is done in parallel. The rep thread, which hands off undo records to LDM threads, waited for an LDM to finish applying a record before fetching the next one; now the rep thread no longer waits, but proceeds immediately to the next record and LDM.

  A count of the number of outstanding log records for each LDM in `LGMAN` is kept, and decremented whenever an LDM has completed the execution of a record. All the records belonging to a page are sent to the same LDM thread but are not guaranteed to be processed in order, so a hash map of pages that have outstanding records maintains a queue for each of these pages. When the page is available in the page cache, all records pending in the queue are applied in order.

  A few types of records continue to be processed serially: `UNDO_LCP`, `UNDO_LCP_FIRST`, `UNDO_LOCAL_LCP`, `UNDO_LOCAL_LCP_FIRST`, `UNDO_DROP`, and `UNDO_END`.

  There are no user-visible changes in functionality directly associated with this performance enhancement; it is part of work done to improve undo long handling in support of partial local checkpoints in NDB Cluster 7.6.

* **Reading table and fragment IDs from extent for undo log applier.** When applying an undo log, it is necessary to obtain the table ID and fragment ID from the page ID. This was done previously by reading the page from the [`PGMAN`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-pgman.html) kernel block using an extra `PGMAN` worker thread, but when applying the undo log it was necessary to read the page again.

  when using `O_DIRECT` this was very inefficient since the page was not cached in the OS kernel. To correct this issue, mapping from page ID to table ID and fragment ID is now done using information from the extent header the table IDs and fragment IDs for the pages used within a given extent. The extent pages are always present in the page cache, so no extra reads from disk are required for performing the mapping. In addition, the information can already be read, using existing [`TSMAN`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-tsman.html) kernel block data structures.

  See the description of the [`ODirect`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-odirect) data node configuration parameter, for more information.

* **Shared memory transporter.** User-defined shared memory (SHM) connections between a data node and an API node on the same host computer are fully supported in NDB 7.6, and are no longer considered experimental. You can enable an explicit shared memory connection by setting the [`UseShm`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-useshm) configuration parameter to `1` for the relevant data node. When explicitly defining shared memory as the connection method, it is also necessary that both the data node and the API node are identified by `HostName`.

  Performance of SHM connections can be enhanced through setting parameters such as [`ShmSize`](mysql-cluster-shm-definition.html#ndbparam-shm-shmsize), [`ShmSpintime`](mysql-cluster-shm-definition.html#ndbparam-shm-shmspintime), and [`SendBufferMemory`](mysql-cluster-shm-definition.html#ndbparam-shm-sendbuffermemory) in an `[shm]` or `[shm default]` section of the cluster configuration file (`config.ini`). Configuration of SHM is otherwise similar to that of the TCP transporter.

  The [`SigNum`](mysql-cluster-shm-definition.html#ndbparam-shm-signum) parameter is not used in the new SHM implementation, and any settings made for it are now ignored. [Section 21.4.3.12, “NDB Cluster Shared Memory Connections”](mysql-cluster-shm-definition.html "21.4.3.12 NDB Cluster Shared Memory Connections"), provides more information about these parameters. In addition, as part of this work, `NDB` code relating to the old SCI transporter has been removed.

  For more information, see [Section 21.4.3.12, “NDB Cluster Shared Memory Connections”](mysql-cluster-shm-definition.html "21.4.3.12 NDB Cluster Shared Memory Connections").

* **SPJ block inner join optimization.** In NDB 7.6, the [`SPJ`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbspj.html) kernel block can take into account when it is evaluating a join request in which at least some of the tables are INNER-joined. This means that it can eliminate requests for row, ranges, or both as soon as it becomes known that one or more of the preceding requests did not return any results for a parent row. This saves both the data nodes and the `SPJ` block from having to handle requests and result rows which never take part in an INNER-joined result row.

  Consider this join query, where `pk` is the primary key on tables t2, t3, and t4, and columns x, y, and z are nonindexed columns:

  ```sql
  SELECT * FROM t1
    JOIN t2 ON t2.pk = t1.x
    JOIN t3 ON t3.pk = t1.y
    JOIN t4 ON t4.pk = t1.z;
  ```

  Previously, this resulted in an `SPJ` request including a scan on table `t1`, and lookups on each of the tables `t2`, `t3`, and `t4`; these were evaluated for every row returned from `t1`. For these, `SPJ` created `LQHKEYREQ` requests for tables `t2`, `t3`, and `t4`. Now `SPJ` takes into consideration the requirement that, to produce any result rows, an inner join must find a match in all tables joined; as soon as no matches are found for one of the tables, any further requests to tables having the same parent or tables are now skipped.

  Note

  This optimization cannot be applied until all of the data nodes and all of the API nodes in the cluster have been upgraded to NDB 7.6.

* **NDB wakeup thread.** `NDB` uses a poll receiver to read from sockets, to execute messages from the sockets, and to wake up other threads. When making only intermittent use of a receive thread, poll ownership is given up before starting to wake up other threads, which provides some degree of parallelism in the receive thread, but, when making constant use of the receive thread, the thread can be overburdened by tasks including wakeup of other threads.

  NDB 7.6 supports offloading by the receiver thread of the task of waking up other threads to a new thread that wakes up other threads on request (and otherwise simply sleeps), making it possible to improve the capacity of a single cluster connection by roughly ten to twenty percent.

* **Adaptive LCP control.**

  NDB 7.6.7 implements an adaptive LCP control mechanism which acts in response to changes in redo log space usage. By controlling LCP disk write speed, you can help protect against a number of resource-related issues, including the following:

  + Insufficient CPU resources for traffic applications
  + Disk overload
  + Insufficient redo log buffer
  + GCP Stop conditions
  + Insufficient redo log space
  + Insufficient undo log space

  This work includes the following changes relating to [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") configuration parameters:

  + The default value of the [`RecoveryWork`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-recoverywork) data node parameter is increased from 50 to 60; that is, `NDB` now uses 1.6 times the size of the data for storage of LCPs.

  + A new data node configuration parameter [`InsertRecoveryWork`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-insertrecoverywork) provides additional tuning capabilities through controlling the percentage of `RecoveryWork` that is reserved for insert operations. The default value is 40 (that is, 40% of the storage space already reserved by `RecoveryWork`); the minimum and maximum are 0 and 70, respectively. Increasing this value allows for more writes to be performed during an LCP, while limiting the total size of the LCP. Decreasing `InsertRecoveryWork` limits the number of writes used during an LCP, but results in more space being used for the LCP, which means that recovery takes longer.

  This work implements control of LCP speed chiefly to minimize the risk of running out of redo log. This is done in adapative fashion, based on the amount of redo log space used, using the alert levels, with the responses taken when these levels are attained, shown here:

  + **Low**: Redo log space usage is greater than 25%, or estimated usage shows insufficient redo log space at a very high transaction rate. In response, use of LCP data buffers is increased during LCP scans, priority of LCP scans is increased, and the amount of data that can be written per real-time break in an LCP scan is also increased.

  + **High**: Redo log space usage is greater than 40%, or estimate to run out of redo log space at a high transaction rate. When this level of usage is reached, [`MaxDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeed) is increased to the value of [`MaxDiskWriteSpeedOtherNodeRestart`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeedothernoderestart). In addition, the minimum speed is doubled, and priority of LCP scans and what can be written per real-time break are both increased further.

  + **Critical**: Redo log space usage is greater than 60%, or estimated usage shows insufficient redo log space at a normal transaction rate. At this level, `MaxDiskWriteSpeed` is increased to the value of [`MaxDiskWriteSpeedOwnRestart`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeedownrestart); [`MinDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-mindiskwritespeed) is also set to this value. Priority of LCP scans and the amount of data that can be written per real-time break are increased further, and the LCP data buffer is completely available during the LCP scan.

  Raising the level also has the effect of increasing the calculated target checkpoint speed.

  LCP control has the following benefits for `NDB` installations:

  + Clusters should now survive very heavy loads using default configurations much better than previously.

  + It should now be possible for `NDB` to run reliably on systems where the available disk space is (at a rough minimum) 2.1 times the amount of memory allocated to it ([`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory)). You should note that this figure does *not* include any disk space used for Disk Data tables.

* **ndb\_restore options.** Beginning with NDB 7.6.9, the [`--nodeid`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_nodeid) and [`--backupid`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid) options are both required when invoking [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup").

* **Restoring by slices.** Beginning with NDB 7.6.13, it is possible to divide a backup into roughly equal portions (slices) and to restore these slices in parallel using two new options implemented for [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"):

  + [`--num-slices`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_num-slices) determines the number of slices into which the backup should be divided.

  + [`--slice-id`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_slice-id) provides the ID of the slice to be restored by the current instance of [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup").

  This makes it possible to employ multiple instances of [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") to restore subsets of the backup in parallel, potentially reducing the amount of time required to perform the restore operation.

  For more information, see the description of the [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") [`--num-slices`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_num-slices) option.

* **ndb\_restore: primary key schema changes.** NDB 7.6.14 (and later) supports different primary key definitions for source and target tables when restoring an `NDB` native backup with [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") when it is run with the [`--allow-pk-changes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_allow-pk-changes) option. Both increasing and decreasing the number of columns making up the original primary key are supported.

  When the primary key is extended with an additional column or columns, any columns added must be defined as `NOT NULL`, and no values in any such columns may be changed during the time that the backup is being taken. Because some applications set all column values in a row when updating it, whether or not all values are actually changed, this can cause a restore operation to fail even if no values in the column to be added to the primary key have changed. You can override this behavior using the [`--ignore-extended-pk-updates`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_ignore-extended-pk-updates) option also added in NDB 7.6.14; in this case, you must ensure that no such values are changed.

  A column can be removed from the table's primary key whether or not this column remains part of the table.

  For more information, see the description of the [`--allow-pk-changes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_allow-pk-changes) option for [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup").

* **ndb\_blob\_tool enhancements.** Beginning with NDB 7.6.14, the [**ndb\_blob\_tool**](mysql-cluster-programs-ndb-blob-tool.html "21.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables") utility can detect missing blob parts for which inline parts exist and replace these with placeholder blob parts (consisting of space characters) of the correct length. To check whether there are missing blob parts, use the [`--check-missing`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_check-missing) option with this program. To replace any missing blob parts with placeholders, use the [`--add-missing`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_add-missing) option.

  For more information, see [Section 21.5.6, “ndb\_blob\_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables”](mysql-cluster-programs-ndb-blob-tool.html "21.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables").

* **Merging backups with ndb\_restore.** In some cases, it may be desirable to consolidate data originally stored in different instances of NDB Cluster (all using the same schema) into a single target NDB Cluster. This is now supported when using backups created in the [**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") client (see [Section 21.6.8.2, “Using The NDB Cluster Management Client to Create a Backup”](mysql-cluster-backup-using-management-client.html "21.6.8.2 Using The NDB Cluster Management Client to Create a Backup")) and restoring them with [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), using the [`--remap-column`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_remap-column) option added in NDB 7.6.14 along with [`--restore-data`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_restore-data) (and possibly additional compatible options as needed or desired). `--remap-column` can be employed to handle cases in which primary and unique key values are overlapping between source clusters, and it is necessary that they do not overlap in the target cluster, as well as to preserve other relationships between tables such as foreign keys.

  [`--remap-column`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_remap-column) takes as its argument a string having the format `db.tbl.col:fn:args`, where *`db`*, *`tbl`*, and *`col`* are, respectively, the names of the database, table, and column, *`fn`* is the name of a remapping function, and *`args`* is one or more arguments to *`fn`*. There is no default value. Only `offset` is supported as the function name, with *`args`* as the integer offset to be applied to the value of the column when inserting it into the target table from the backup. This column must be one of [`INT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") or [`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"); the allowed range of the offset value is the same as the signed version of that type (this allows the offset to be negative if desired).

  The new option can be used multiple times in the same invocation of [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), so that you can remap to new values multiple columns of the same table, different tables, or both. The offset value does not have to be the same for all instances of the option.

  In addition, two new options are provided for [**ndb\_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables"), also beginning in NDB 7.6.14:

  + [`--auto-inc`](mysql-cluster-programs-ndb-desc.html#option_ndb_desc_auto-inc) (short form `-a`): Includes the next auto-increment value in the output, if the table has an `AUTO_INCREMENT` column.

  + [`--context`](mysql-cluster-programs-ndb-desc.html#option_ndb_desc_context) (short form `-x`): Provides extra information about the table, including the schema, database name, table name, and internal ID.

  For more information and examples, see the description of the [`--remap-column`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_remap-column) option.

* **--ndb-log-fail-terminate option.** Beginning with NDB 7.6.14, you can cause the SQL node to terminate whenever it is unable to log all row events fully. This can be done by starting [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") with the [`--ndb-log-fail-terminate`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-fail-terminate) option.

* **NDB programs—NDBT dependency removal.** The dependency of a number of `NDB` utility programs on the `NDBT` library has been removed. This library is used internally for development, and is not required for normal use; its inclusion in these programs could lead to unwanted issues when testing.

  Affected programs are listed here, along with the `NDB` versions in which the dependency was removed:

  + [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), in NDB 7.6.11
  + [**ndb\_show\_tables**](mysql-cluster-programs-ndb-show-tables.html "21.5.27 ndb_show_tables — Display List of NDB Tables"), in NDB 7.6.14
  + [**ndb\_waiter**](mysql-cluster-programs-ndb-waiter.html "21.5.30 ndb_waiter — Wait for NDB Cluster to Reach a Given Status"), in NDB 7.6.14

  The principal effect of this change for users is that these programs no longer print `NDBT_ProgramExit - status` following completion of a run. Applications that depend upon such behavior should be updated to reflect the change when upgrading to the indicated versions.

* **Auto-Installer deprecation and removal.** The MySQL NDB Cluster Auto-Installer web-based installation tool (**ndb\_setup.py**) is deprecated in NDB 7.6.16, and is removed in NDB 7.6.17 and later. It is no longer supported.

* **ndbmemcache deprecation and removal.** `ndbmemcache` is no longer supported. `ndbmemcache` was deprecated in NDB 7.6.16, and removed in NDB 7.6.17.

* **Node.js support removed.** Beginning with the NDB Cluster 7.6.16 release, support for Node.js by NDB 7.6 has been removed.

  Support for Node.js by NDB Cluster is maintained in NDB 8.0 only.

* **Conversion between NULL and NOT NULL during restore operations.** Beginning with NDB 7.6.19, [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") can support restoring of `NULL` columns as `NOT NULL` and the reverse, using the options listed here:

  + To restore a `NULL` column as `NOT NULL`, use the [`--lossy-conversions`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_lossy-conversions) option.

    The column originally declared as `NULL` must not contain any `NULL` rows; if it does, [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") exits with an error.

  + To restore a `NOT NULL` column as `NULL`, use the [`--promote-attributes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_promote-attributes) option.

  For more information, see the descriptions of the indicated [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") options.

* **OpenSSL 3.0 support.** Beginning with NDB 7.6.27, all MySQL server and client binaries included in the `NDB` distribution are compiled with support for Open SSL 3.0

* **mysql client --commands option.** The [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client [`--commands`](mysql-command-options.html#option_mysql_commands) option, added in NDB 7.6.35, enables or disables most [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client commands.

  This option is enabled by default. To disable it, start the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client with [`--commands=OFF`](mysql-command-options.html#option_mysql_commands) or [`--skip-commands`](mysql-command-options.html#option_mysql_commands).

  For more information, see [Section 4.5.1.1, “mysql Client Options”](mysql-command-options.html "4.5.1.1 mysql Client Options").
