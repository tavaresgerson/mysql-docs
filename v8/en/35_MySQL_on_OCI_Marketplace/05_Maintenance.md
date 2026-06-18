## 34.5 Maintenance

This product is user-managed, meaning you are responsible for
upgrades and maintenance.

### Upgrading MySQL

The existing installation is RPM-based, to upgrade the MySQL
server, see [Section 3.7, “Upgrading MySQL Binary or Package-based Installations on Unix/Linux”](upgrade-binary-package.html "3.7 Upgrading MySQL Binary or Package-based Installations on Unix/Linux").

You can use `scp` to copy the required RPM to
the OCI Compute Instance, or copy it from OCI Object Storage, if
you have configured access to it. File Storage is also an
option. For more information, see
[File
Storage and NFS](https://docs.cloud.oracle.com/iaas/Content/File/Concepts/filestorageoverview.htm).

### Backup and Restore

MySQL Enterprise Backup is the preferred backup and restore solution. For more
information, see [Backing Up to Cloud Storage](/doc/mysql-enterprise-backup/8.0/en/meb-backup-cloud.html).

For information on MySQL Enterprise Backup, see
[Getting Started with MySQL Enterprise Backup](/doc/mysql-enterprise-backup/8.0/en/meb-getting-started.html).

For information on the default MySQL backup and restore, see
[Chapter 9, *Backup and Recovery*](backup-and-recovery.html "Chapter 9 Backup and Recovery").