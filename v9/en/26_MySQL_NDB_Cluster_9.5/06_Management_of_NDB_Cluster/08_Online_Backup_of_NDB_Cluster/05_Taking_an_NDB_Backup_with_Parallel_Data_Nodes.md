#### 25.6.8.5 Taking an NDB Backup with Parallel Data Nodes

It is possible to take a backup with multiple local data
managers (LDMs) acting in parallel on the data nodes. For this
to work, all data nodes in the cluster must use multiple LDMs,
and each data node must use the same number of LDMs. This means
that all data nodes must run [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "25.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)")
([**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") is single-threaded and thus always has
only one LDM) and they must be configured to use multiple LDMs
before taking the backup; [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "25.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") by default
runs in single-threaded mode. You can cause them to use multiple
LDMs by choosing an appropriate setting for one of the
multi-threaded data node configuration parameters
[`MaxNoOfExecutionThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-maxnoofexecutionthreads)
or [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig). Keep
in mind that changing these parameters requires a restart of the
cluster; this can be a rolling restart. In addition, the
[`EnableMultithreadedBackup`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-enablemultithreadedbackup)
parameter must be set to 1 for each data node (this is the
default).

Depending on the number of LDMs and other factors, you may also
need to increase
[`NoOfFragmentLogParts`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-nooffragmentlogparts).
If you are using large Disk Data tables, you may also need to
increase
[`DiskPageBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskpagebuffermemory). As
with single-threaded backups, you may also want or need to make
adjustments to settings for
[`BackupDataBufferSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupdatabuffersize),
[`BackupMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupmemory), and other
configuration parameters relating to backups (see
[Backup parameters](mysql-cluster-ndbd-definition.html#mysql-cluster-backup-parameters "Backup parameters")).

Once all data nodes are using multiple LDMs, you can take the
parallel backup using the [`START
BACKUP`](mysql-cluster-backup-using-management-client.html "25.6.8.2 Using The NDB Cluster Management Client to Create a Backup") command in the NDB management client just as
you would if the data nodes were running [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon")
(or [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "25.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") in single-threaded mode); no
additional or special syntax is required, and you can specify a
backup ID, wait option, or snapshot option in any combination as
needed or desired.

Backups using multiple LDMs create subdirectories, one per LDM,
under the directory
`BACKUP/BACKUP-backup_id/`
(which in turn resides under the
[`BackupDataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupdatadir)) on each
data node; these subdirectories are named
`BACKUP-backup_id-PART-1-OF-N/`,
`BACKUP-backup_id-PART-2-OF-N/`,
and so on, up to
`BACKUP-backup_id-PART-N-OF-N/`,
where *`backup_id`* is the backup ID used
for this backup and *`N`* is the number
of LDMs per data node. Each of these subdirectories contains the
usual backup files
`BACKUP-backup_id-0.node_id.Data`,
`BACKUP-backup_id.node_id.ctl`,
and `BACKUP-backup_id.node_id.log`, where
*`node_id`* is the node ID of this data
node.

[**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup") automatically checks for the
presence of the subdirectories just described; if it finds them,
it attempts to restore the backup in parallel. For information
about restoring backups taken with multiple LDMs, see
[Restoring from a backup taken in parallel](/doc/refman/8.0/en/ndb-restore-parallel-data-node-backup.html).

To force creation of a single-threaded backup, set
[`EnableMultithreadedBackup =
0`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-enablemultithreadedbackup) for all data nodes (you can do this by setting the
parameter in the `[ndbd default]` section of
the `config.ini` global configuration file).
It is also possible to restore a parallel backup to a cluster
running an older version of `NDB`. See
[Restoring an NDB backup to a previous version of NDB Cluster](/doc/refman/8.0/en/ndb-restore-to-different-version.html#ndb-restore-to-previous-version), for more
information.