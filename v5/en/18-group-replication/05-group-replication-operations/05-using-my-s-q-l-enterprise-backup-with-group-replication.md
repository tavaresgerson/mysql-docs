### 17.5.5 Using MySQL Enterprise Backup with Group Replication

[MySQL Enterprise Backup](/doc/mysql-enterprise-backup/4.1/en/) is a commercially-licensed backup utility for MySQL Server, available with [MySQL Enterprise Edition](https://www.mysql.com/products/enterprise/). This section explains how to back up and subsequently restore a Group Replication member using MySQL Enterprise Backup. The same technique can be used to quickly add a new member to a group.

#### Backing up a Group Replication Member Using MySQL Enterprise Backup

Backing up a Group Replication member is similar to backing up a stand-alone MySQL instance. The following instructions assume that you are already familiar with how to use MySQL Enterprise Backup to perform a backup; if that is not the case, please review the [MySQL Enterprise Backup 4.1 User's Guide](/doc/mysql-enterprise-backup/4.1/en/), especially [Backing Up a Database Server](/doc/mysql-enterprise-backup/4.1/en/backing-up.html). Also note the requirements described in [Grant MySQL Privileges to Backup Administrator](/doc/mysql-enterprise-backup/4.1/en/mysqlbackup.privileges.html) and [Using MySQL Enterprise Backup with Group Replication](/doc/mysql-enterprise-backup/4.1/en/meb-group-replication.html).

Consider the following group with three members, `s1`, `s2`, and `s3`, running on hosts with the same names:

```sql
mysql> SELECT member_host, member_port, member_state FROM performance_schema.replication_group_members;
+-------------+-------------+--------------+
| member_host | member_port | member_state |
+-------------+-------------+--------------+
| s1          |        3306 | ONLINE       |
| s2          |        3306 | ONLINE       |
| s3          |        3306 | ONLINE       |
+-------------+-------------+--------------+
```

Using MySQL Enterprise Backup, create a backup of `s2` by issuing on its host, for example, the following command:

```sql
s2> mysqlbackup --defaults-file=/etc/my.cnf --backup-image=/backups/my.mbi_`date +%d%m_%H%M` \
		      --backup-dir=/backups/backup_`date +%d%m_%H%M` --user=root -p \
--host=127.0.0.1 backup-to-image
```

Note

* When backing up a secondary member, as MySQL Enterprise Backup cannot write backup status and metadata to a read-only server instance, it might issue warnings similar to the following one during the backup operation:

  ```sql
  181113 21:31:08 MAIN WARNING: This backup operation cannot write to backup
  progress. The MySQL server is running with the --super-read-only option.
  ```

  You can avoid the warning by using the `--no-history-logging` option with your backup command.

#### Restoring a Failed Member

Assume one of the members (`s3` in the following example) is irreconcilably corrupted. The most recent backup of group member `s2` can be used to restore `s3`. Here are the steps for performing the restore:

1. *Copy the backup of s2 onto the host for s3.* The exact way to copy the backup depends on the operating system and tools available to you. In this example, we assume the hosts are both Linux servers and use SCP to copy the files between them:

   ```sql
   s2/backups> scp my.mbi_2206_1429 s3:/backups
   ```

2. *Restore the backup.* Connect to the target host (the host for `s3` in this case), and restore the backup using MySQL Enterprise Backup. Here are the steps:

   1. Stop the corrupted server, if it is still running. For example, on Linux distributions that use systemd:

      ```sql
      s3> systemctl stop mysqld
      ```

   2. Preserve the configuration file `auto.cnf`, located in the corrupted server's data directory, by copying it to a safe location outside of the data directory. This is for preserving the [server's UUID](replication-options.html#sysvar_server_uuid), which is needed later.

   3. Delete all contents in the data directory of `s3`. For example:

      ```sql
      s3> rm -rf /var/lib/mysql/*
      ```

      If the system variables [`innodb_data_home_dir`](innodb-parameters.html#sysvar_innodb_data_home_dir), [`innodb_log_group_home_dir`](innodb-parameters.html#sysvar_innodb_log_group_home_dir), and [`innodb_undo_directory`](innodb-parameters.html#sysvar_innodb_undo_directory) point to any directories other than the data directory, they should also be made empty; otherwise, the restore operation fails.

   4. Restore backup of `s2` onto the host for `s3`:

      ```sql
      s3> mysqlbackup --defaults-file=/etc/my.cnf \
        --datadir=/var/lib/mysql \
        --backup-image=/backups/my.mbi_2206_1429  \
      --backup-dir=/tmp/restore_`date +%d%m_%H%M` copy-back-and-apply-log
      ```

      Note

      The command above assumes that the binary logs and relay logs on `s2` and `s3` have the same base name and are at the same location on the two servers. If these conditions are not met, for MySQL Enterprise Backup 4.1.2 and later, you should use the [`--log-bin`](/doc/mysql-enterprise-backup/4.1/en/server-repository-options.html#option_meb_log-bin) and [`--relay-log`](/doc/mysql-enterprise-backup/4.1/en/server-repository-options.html#option_meb_relay-log) options to restore the binary log and relay log to their original file paths on `s3`. For example, if you know that on `s3` the binary log's base name is `s3-bin` and the relay-log's base name is `s3-relay-bin`, your restore command should look like:

      ```sql
      mysqlbackup --defaults-file=/etc/my.cnf \
        --datadir=/var/lib/mysql \
        --backup-image=/backups/my.mbi_2206_1429  \
        --log-bin=s3-bin --relay-log=s3-relay-bin \
        --backup-dir=/tmp/restore_`date +%d%m_%H%M` copy-back-and-apply-log
      ```

      Being able to restore the binary log and relay log to the right file paths makes the restore process easier; if that is impossible for some reason, see [Rebuild the Failed Member to Rejoin as a New Member](group-replication-enterprise-backup.html#group-replication-rebuild-member "Rebuild the Failed Member to Rejoin as a New Member").

3. *Restore the `auto.cnf` file for s3.* To rejoin the replication group, the restored member *must* have the same [`server_uuid`](replication-options.html#sysvar_server_uuid) it used to join the group before. Supply the old server UUID by copying the `auto.cnf` file preserved in step 2 above into the data directory of the restored member.

   Note

   If you cannot supply the failed member's original [`server_uuid`](replication-options.html#sysvar_server_uuid) to the restored member by restoring its old `auto.cnf` file, you must let the restored member join the group as a new member; see instructions in [Rebuild the Failed Member to Rejoin as a New Member](group-replication-enterprise-backup.html#group-replication-rebuild-member "Rebuild the Failed Member to Rejoin as a New Member") below on how to do that.

4. *Start the restored server.* For example, on Linux distributions that use systemd:

   ```sql
   systemctl start mysqld
   ```

   Note

   If the server you are restoring is a primary member, perform the steps described in [Restoring a Primary Member](group-replication-enterprise-backup.html#group-replication-meb-restore-primary "Restoring a Primary Member") *before starting the restored server*.

5. *Restart Group Replication.* Connect to the restarted `s3` using, for example, a [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, and issue the following command:

   ```sql
   mysql> START GROUP_REPLICATION;
   ```

   Before the restored instance can become an online member of the group, it needs to apply any transactions that have happened to the group after the backup was taken; this is achieved using Group Replication's [distributed recovery](group-replication-distributed-recovery.html "17.9.5 Distributed Recovery") mechanism, and the process starts after the [START GROUP\_REPLICATION](start-group-replication.html "13.4.3.1 START GROUP_REPLICATION Statement") statement has been issued. To check the member status of the restored instance, issue:

   ```sql
   mysql> SELECT member_host, member_port, member_state FROM performance_schema.replication_group_members;
   +-------------+-------------+--------------+
   | member_host | member_port | member_state |
   +-------------+-------------+--------------+
   | s1          |        3306 | ONLINE       |
   | s2          |        3306 | ONLINE       |
   | s3          |        3306 | RECOVERING   |
   +-------------+-------------+--------------+
   ```

   This shows that `s3` is applying transactions to catch up with the group. Once it has caught up with the rest of the group, its `member_state` changes to `ONLINE`:

   ```sql
   mysql> SELECT member_host, member_port, member_state FROM performance_schema.replication_group_members;
   +-------------+-------------+--------------+
   | member_host | member_port | member_state |
   +-------------+-------------+--------------+
   | s1          |        3306 | ONLINE       |
   | s2          |        3306 | ONLINE       |
   | s3          |        3306 | ONLINE       |
   +-------------+-------------+--------------+
   ```

   Note

   If the server you are restoring is a primary member, once it has gained synchrony with the group and become `ONLINE`, perform the steps described at the end of [Restoring a Primary Member](group-replication-enterprise-backup.html#group-replication-meb-restore-primary "Restoring a Primary Member") to revert the configuration changes you had made to the server before you started it.

The member has now been fully restored from the backup and functions as a regular member of the group.

#### Rebuild the Failed Member to Rejoin as a New Member

Sometimes, the steps outlined above in [Restoring a Failed Member](group-replication-enterprise-backup.html#group-replication-restore-failed-member "Restoring a Failed Member") cannot be carried out because, for example, the binary log or relay log is corrupted, or it is just missing from the backup. In such a situation, use the backup to rebuild the member, and then add it to the group as a new member. In the steps below, we assume the rebuilt member is named `s3`, like the failed member, and it is run on the same host as `s3` was:

1. *Copy the backup of s2 onto the host for s3 .* The exact way to copy the backup depends on the operating system and tools available to you. In this example we assume the hosts are both Linux servers and use SCP to copy the files between them:

   ```sql
   s2/backups> scp my.mbi_2206_1429 s3:/backups
   ```

2. *Restore the backup.* Connect to the target host (the host for `s3` in this case), and restore the backup using MySQL Enterprise Backup. Here are the steps:

   1. Stop the corrupted server, if it is still running. For example, on Linux distributions that use systemd:

      ```sql
      s3> systemctl stop mysqld
      ```

   2. Delete all contents in the data directory of `s3`. For example:

      ```sql
      s3> rm -rf /var/lib/mysql/*
      ```

      If the system variables [`innodb_data_home_dir`](innodb-parameters.html#sysvar_innodb_data_home_dir), [`innodb_log_group_home_dir`](innodb-parameters.html#sysvar_innodb_log_group_home_dir), and [`innodb_undo_directory`](innodb-parameters.html#sysvar_innodb_undo_directory) point to any directories other than the data directory, they should also be made empty; otherwise, the restore operation fails.

   3. Restore the backup of `s2` onto the host of `s3`. With this approach, we are rebuilding `s3` as a new member, for which we do not need or do not want to use the old binary and relay logs in the backup; therefore, if these logs have been included in your backup, exclude them using the [`--skip-binlog`](/doc/mysql-enterprise-backup/4.1/en/backup-capacity-options.html#option_meb_skip-binlog) and [`--skip-relaylog`](/doc/mysql-enterprise-backup/4.1/en/backup-capacity-options.html#option_meb_skip-relaylog) options:

      ```sql
      s3> mysqlbackup --defaults-file=/etc/my.cnf \
        --datadir=/var/lib/mysql \
        --backup-image=/backups/my.mbi_2206_1429  \
        --backup-dir=/tmp/restore_`date +%d%m_%H%M` \
        --skip-binlog --skip-relaylog \
      copy-back-and-apply-log
      ```

      Notes

      * If you have healthy binary log and relay logs in the backup that you can transfer onto the target host with no issues, you are recommended to follow the easier procedure as described in [Restoring a Failed Member](group-replication-enterprise-backup.html#group-replication-restore-failed-member "Restoring a Failed Member") above.

      * Do NOT restore manually the corrupted server's `auto.cnf` file to the data directory of the new member—when the rebuilt `s3` joins the group as a new member, it is going to be assigned a new server UUID.

3. *Start the restored server.* For example, on Linux distributions that use systemd:

   ```sql
   systemctl start mysqld
   ```

   Note

   If the server you are restoring is a primary member, perform the steps described in [Restoring a Primary Member](group-replication-enterprise-backup.html#group-replication-meb-restore-primary "Restoring a Primary Member") *before starting the restored server*.

4. *Reconfigure the restored member to join Group Replication.* Connect to the restored server with a [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client and reset the source and replica information with the following commands:

   ```sql
   mysql> RESET MASTER;
   ```

   ```sql
   mysql> RESET SLAVE ALL;
   ```

   For the restored server to be able to recover automatically using Group Replication's built-in mechanism for [distributed recovery](group-replication-distributed-recovery.html "17.9.5 Distributed Recovery"), configure the server's [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) variable. To do this, use the `backup_gtid_executed.sql` file included in the backup of `s2`, which is usually restored under the restored member's data directory. Disable binary logging, use the `backup_gtid_executed.sql` file to configure [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed), and then re-enable binary logging by issuing the following statements with your [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client:

   ```sql
   mysql> SET SQL_LOG_BIN=OFF;
   mysql> SOURCE datadir/backup_gtid_executed.sql
   mysql> SET SQL_LOG_BIN=ON;
   ```

   Then, configure the [Group Replication user credentials](group-replication-user-credentials.html "17.2.1.3 User Credentials") on the member:

   ```sql
   mysql> CHANGE MASTER TO MASTER_USER='rpl_user', MASTER_PASSWORD='password' /
   		FOR CHANNEL 'group_replication_recovery';
   ```

5. *Restart Group Replication.* Issue the following command to the restored server with your [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client:

   ```sql
   mysql> START GROUP_REPLICATION;
   ```

   Before the restored instance can become an online member of the group, it needs to apply any transactions that have happened to the group after the backup was taken; this is achieved using Group Replication's [distributed recovery](group-replication-distributed-recovery.html "17.9.5 Distributed Recovery") mechanism, and the process starts after the [START GROUP\_REPLICATION](start-group-replication.html "13.4.3.1 START GROUP_REPLICATION Statement") statement has been issued. To check the member status of the restored instance, issue:

   ```sql
   mysql> SELECT member_host, member_port, member_state FROM performance_schema.replication_group_members;
   +-------------+-------------+--------------+
   | member_host | member_port | member_state |
   +-------------+-------------+--------------+
   | s3          |        3306 | RECOVERING   |
   | s2          |        3306 | ONLINE       |
   | s1          |        3306 | ONLINE       |
   +-------------+-------------+--------------+
   ```

   This shows that `s3` is applying transactions to catch up with the group. Once it has caught up with the rest of the group, its `member_state` changes to `ONLINE`:

   ```sql
   mysql> SELECT member_host, member_port, member_state FROM performance_schema.replication_group_members;
   +-------------+-------------+--------------+
   | member_host | member_port | member_state |
   +-------------+-------------+--------------+
   | s3          |        3306 | ONLINE       |
   | s2          |        3306 | ONLINE       |
   | s1          |        3306 | ONLINE       |
   +-------------+-------------+--------------+
   ```

   Note

   If the server you are restoring is a primary member, once it has gained synchrony with the group and become `ONLINE`, perform the steps described at the end of [Restoring a Primary Member](group-replication-enterprise-backup.html#group-replication-meb-restore-primary "Restoring a Primary Member") to revert the configuration changes you had made to the server before you started it.

The member has now been restored to the group as a new member.

**Restoring a Primary Member.** If the restored member is a primary in the group, care must be taken to prevent writes to the restored database during the Group Replication recovery phase: Depending on how the group is accessed by clients, there is a possibility of DML statements being executed on the restored member once it becomes accessible on the network, prior to the member finishing its catch-up on the activities it has missed while off the group. To avoid this, *before starting the restored server*, configure the following system variables in the server option file:

```sql
group_replication_start_on_boot=OFF
super_read_only=ON
event_scheduler=OFF
```

These settings ensure that the member becomes read-only at startup and that the event scheduler is turned off while the member is catching up with the group during the recovery phase. Adequate error handling must also be configured on the clients, as they are prevented temporarily from performing DML operations during this period on the restored member. Once the restore process is fully completed and the restored member is in-sync with the rest of the group, revert those changes; restart the event scheduler:

```sql
mysql> SET global event_scheduler=ON;
```

Edit the following system variables in the member's option file, so things are correctly configured for the next startup:

```sql
group_replication_start_on_boot=ON
super_read_only=OFF
event_scheduler=ON
```
