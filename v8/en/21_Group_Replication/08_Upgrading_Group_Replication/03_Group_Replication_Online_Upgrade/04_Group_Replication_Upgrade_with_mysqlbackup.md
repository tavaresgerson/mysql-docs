#### 20.8.3.4 Group Replication Upgrade with mysqlbackup

As part of a provisioning approach you can use MySQL Enterprise Backup to copy and restore the data from a group member to new members. However you cannot use this technique to directly restore a backup taken from a member running an older version of MySQL to a member running a newer version of MySQL. The solution is to restore the backup to a new server instance which is running the same version of MySQL as the member which the backup was taken from, and then upgrade the instance. This process consists of:

* Take a backup from a member of the older group using **mysqlbackup**. See Section 20.5.6, “Using MySQL Enterprise Backup with Group Replication”.

* Deploy a new server instance, which must be running the same version of MySQL as the older member where the backup was taken.

* Restore the backup from the older member to the new instance using **mysqlbackup**.

* Upgrade MySQL on the new instance, see Chapter 3, *Upgrading MySQL*.

Repeat this process to create a suitable number of new instances, for example to be able to handle a failover. Then join the instances to a group based on the Section 20.8.3.3, “Group Replication Online Upgrade Methods”.`
