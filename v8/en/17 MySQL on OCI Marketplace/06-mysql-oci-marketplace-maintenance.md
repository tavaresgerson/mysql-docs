## 34.5 Maintenance

This product is user-managed, meaning you are responsible for upgrades and maintenance.

### Upgrading MySQL

The existing installation is RPM-based, to upgrade the MySQL server, see  Section 3.7, “Upgrading MySQL Binary or Package-based Installations on Unix/Linux”.

You can use `scp` to copy the required RPM to the OCI Compute Instance, or copy it from OCI Object Storage, if you have configured access to it. File Storage is also an option. For more information, see  File Storage and NFS.

### Backup and Restore

MySQL Enterprise Backup is the preferred backup and restore solution. For more information, see  Backing Up to Cloud Storage.

For information on MySQL Enterprise Backup, see  Getting Started with MySQL Enterprise Backup.

For information on the default MySQL backup and restore, see  Chapter 9, *Backup and Recovery*.


