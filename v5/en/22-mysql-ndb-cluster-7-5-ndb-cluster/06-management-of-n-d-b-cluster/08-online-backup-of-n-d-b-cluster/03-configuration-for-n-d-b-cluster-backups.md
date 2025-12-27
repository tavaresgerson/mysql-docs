#### 21.6.8.3 Configuration for NDB Cluster Backups

Five configuration parameters are essential for backup:

* [`BackupDataBufferSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupdatabuffersize)

  The amount of memory used to buffer data before it is written to disk.

* [`BackupLogBufferSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backuplogbuffersize)

  The amount of memory used to buffer log records before these are written to disk.

* [`BackupMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupmemory)

  The total memory allocated in a data node for backups. This should be the sum of the memory allocated for the backup data buffer and the backup log buffer.

* [`BackupWriteSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupwritesize)

  The default size of blocks written to disk. This applies for both the backup data buffer and the backup log buffer.

* [`BackupMaxWriteSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupmaxwritesize)

  The maximum size of blocks written to disk. This applies for both the backup data buffer and the backup log buffer.

In addition, [`CompressedBackup`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-compressedbackup) causes `NDB` to use compression when creating and writing to backup files.

More detailed information about these parameters can be found in [Backup Parameters](mysql-cluster-ndbd-definition.html#mysql-cluster-backup-parameters "Backup parameters").

You can also set a location for the backup files using the [`BackupDataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupdatadir) configuration parameter. The default is [`FileSystemPath`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-filesystempath)`/BACKUP/BACKUP-backup_id`.
