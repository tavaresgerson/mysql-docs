### 21.6.8 Online Backup of NDB Cluster

[21.6.8.1 NDB Cluster Backup Concepts](mysql-cluster-backup-concepts.html)

[21.6.8.2 Using The NDB Cluster Management Client to Create a Backup](mysql-cluster-backup-using-management-client.html)

[21.6.8.3 Configuration for NDB Cluster Backups](mysql-cluster-backup-configuration.html)

[21.6.8.4 NDB Cluster Backup Troubleshooting](mysql-cluster-backup-troubleshooting.html)

The next few sections describe how to prepare for and then to create an NDB Cluster backup using the functionality for this purpose found in the [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") management client. To distinguish this type of backup from a backup made using [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"), we sometimes refer to it as a “native” NDB Cluster backup. (For information about the creation of backups with [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"), see [Section 4.5.4, “mysqldump — A Database Backup Program”](mysqldump.html "4.5.4 mysqldump — A Database Backup Program").) Restoration of NDB Cluster backups is done using the [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") utility provided with the NDB Cluster distribution; for information about [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") and its use in restoring NDB Cluster backups, see [Section 21.5.24, “ndb_restore — Restore an NDB Cluster Backup”](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup").
