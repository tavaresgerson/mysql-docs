#### 21.6.8.4 NDB Cluster Backup Troubleshooting

If an error code is returned when issuing a backup request, the most likely cause is insufficient memory or disk space. You should check that there is enough memory allocated for the backup.

Important

If you have set [`BackupDataBufferSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupdatabuffersize) and [`BackupLogBufferSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backuplogbuffersize) and their sum is greater than 4MB, then you must also set [`BackupMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupmemory) as well.

You should also make sure that there is sufficient space on the hard drive partition of the backup target.

[`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") does not support repeatable reads, which can cause problems with the restoration process. Although the backup process is “hot”, restoring an NDB Cluster from backup is not a 100% “hot” process. This is due to the fact that, for the duration of the restore process, running transactions get nonrepeatable reads from the restored data. This means that the state of the data is inconsistent while the restore is in progress.
