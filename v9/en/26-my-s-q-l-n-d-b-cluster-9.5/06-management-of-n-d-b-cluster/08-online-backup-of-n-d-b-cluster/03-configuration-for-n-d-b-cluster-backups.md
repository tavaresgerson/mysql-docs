#### 25.6.8.3 Configuration for NDB Cluster Backups

Five configuration parameters are essential for backup:

* `BackupDataBufferSize`

  The amount of memory used to buffer data before it is written to disk.

* `BackupLogBufferSize`

  The amount of memory used to buffer log records before these are written to disk.

* `BackupMemory`

  The total memory allocated in a data node for backups. This should be the sum of the memory allocated for the backup data buffer and the backup log buffer.

* `BackupWriteSize`

  The default size of blocks written to disk. This applies for both the backup data buffer and the backup log buffer.

* `BackupMaxWriteSize`

  The maximum size of blocks written to disk. This applies for both the backup data buffer and the backup log buffer.

In addition, `CompressedBackup` causes `NDB` to use compression when creating and writing to backup files.

More detailed information about these parameters can be found in Backup Parameters.

You can also set a location for the backup files using the `BackupDataDir` configuration parameter. The default is `FileSystemPath``/BACKUP/BACKUP-backup_id`.

You can enforce encryption of backup files by setting `RequireEncryptedBackup` to 1; this prevents the creation of backups without specifying `ENCRYPT PASSWORD=password` as part of a `START BACKUP` command.
