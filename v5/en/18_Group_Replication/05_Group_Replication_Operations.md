## 17.5 Group Replication Operations

This section describes the different modes of deploying Group Replication, explains common operations for managing groups and provides information about how to tune your groups. .


### 17.5.1 Deploying in Multi-Primary or Single-Primary Mode

Group Replication operates in the following different modes:

* single-primary mode
* multi-primary mode

The default mode is single-primary. It is not possible to have members of the group deployed in different modes, for example one configured in multi-primary mode while another one is in single-primary mode. To switch between modes, the group and not the server, needs to be restarted with a different operating configuration. Regardless of the deployed mode, Group Replication does not handle client-side fail-over, that must be handled by the application itself, a connector or a middleware framework such as a proxy or MySQL Router 8.0.

When deployed in multi-primary mode, statements are checked to ensure they are compatible with the mode. The following checks are made when Group Replication is deployed in multi-primary mode:

* If a transaction is executed under the SERIALIZABLE isolation level, then its commit fails when synchronizing itself with the group.

* If a transaction executes against a table that has foreign keys with cascading constraints, then the transaction fails to commit when synchronizing itself with the group.

These checks can be deactivated by setting the option `group_replication_enforce_update_everywhere_checks` to `FALSE`. When deploying in single-primary mode, this option *must* be set to `FALSE`.


#### 17.5.1.1 Single-Primary Mode

In this mode the group has a single-primary server that is set to read-write mode. All the other members in the group are set to read-only mode (with `super-read-only=ON` ). This happens automatically. The primary is typically the first server to bootstrap the group, all other servers that join automatically learn about the primary server and are set to read only.

**Figure 17.5 New Primary Election**

![Five server instances, S1, S2, S3, S4, and S5, are deployed as an interconnected group. Server S1 is the primary. Write clients are communicating with server S1, and a read client is communicating with server S4. Server S1 then fails, breaking communication with the write clients. Server S2 then takes over as the new primary, and the write clients now communicate with server S2.](images/single-primary-election.png)

When in single-primary mode, some of the checks deployed in multi-primary mode are disabled, because the system enforces that only a single server writes to the group. For example, changes to tables that have cascading foreign keys are allowed, whereas in multi-primary mode they are not. Upon primary member failure, an automatic primary election mechanism chooses the new primary member. The election process is performed by looking at the new view, and ordering the potential new primaries based on the value of `group_replication_member_weight`. Assuming the group is operating with all members running the same MySQL version, then the member with the highest value for `group_replication_member_weight` is elected as the new primary. In the event that multiple servers have the same `group_replication_member_weight`, the servers are then prioritized based on their `server_uuid` in lexicographical order and by picking the first one. Once a new primary is elected, it is automatically set to read-write and the other secondaries remain as secondaries, and as such, read-only.

When a new primary is elected, it is only writable once it has processed all of the transactions that came from the old primary. This avoids possible concurrency issues between old transactions from the old primary and the new ones being executed on this member. It is a good practice to wait for the new primary to apply its replication related relay-log before re-routing client applications to it.

If the group is operating with members that are running different versions of MySQL then the election process can be impacted. For example, if any member does not support `group_replication_member_weight`, then the primary is chosen based on `server_uuid` order from the members of the lower major version. Alternatively, if all members running different MySQL versions do support `group_replication_member_weight`, the primary is chosen based on `group_replication_member_weight` from the members of the lower major version.


#### 17.5.1.2 Multi-Primary Mode

In multi-primary mode, there is no notion of a single primary. There is no need to engage an election procedure because there is no server playing any special role.

**Figure 17.6 Client Failover**

![Five server instances, S1, S2, S3, S4, and S5, are deployed as an interconnected group. All of the servers are primaries. Write clients are communicating with servers S1 and S2, and a read client is communicating with server S4. Server S1 then fails, breaking communication with its write client. This client reconnects to server S3.](images/multi-primary.png)

All servers are set to read-write mode when joining the group.


#### 17.5.1.3 Finding the Primary

The following example shows how to find out which server is currently the primary when deployed in single-primary mode.

```sql
mysql> SHOW STATUS LIKE 'group_replication_primary_member';
```


### 17.5.2 Tuning Recovery

Whenever a new member joins a replication group, it connects to a suitable donor and fetches the data that it has missed up until the point it is declared online. This critical component in Group Replication is fault tolerant and configurable. The following section explains how recovery works and how to tune the settings

#### Donor Selection

A random donor is selected from the existing online members in the group. This way there is a good chance that the same server is not selected more than once when multiple members enter the group.

If the connection to the selected donor fails, a new connection is automatically attempted to a new candidate donor. Once the connection retry limit is reached the recovery procedure terminates with an error.

Note

A donor is picked randomly from the list of online members in the current view.

#### Enhanced Automatic Donor Switchover

The other main point of concern in recovery as a whole is to make sure that it copes with failures. Hence, Group Replication provides robust error detection mechanisms. In earlier versions of Group Replication, when reaching out to a donor, recovery could only detect connection errors due to authentication issues or some other problem. The reaction to such problematic scenarios was to switch over to a new donor thus a new connection attempt was made to a different member.

This behavior was extended to also cover other failure scenarios:

* *Purged data scenarios* - If the selected donor contains some purged data that is needed for the recovery process then an error occurs. Recovery detects this error and a new donor is selected.

* *Duplicated data* - If a server joining the group already contains some data that conflicts with the data coming from the selected donor during recovery then an error occurs. This could be caused by some errant transactions present in the server joining the group.

  One could argue that recovery should fail instead of switching over to another donor, but in heterogeneous groups there is chance that other members share the conflicting transactions and others do not. For that reason, upon error, recovery selects another donor from the group.

* *Other errors* - If any of the recovery threads fail (receiver or applier threads fail) then an error occurs and recovery switches over to a new donor.

Note

In case of some persistent failures or even transient failures recovery automatically retries connecting to the same or a new donor.

#### Donor Connection Retries

The recovery data transfer relies on the binary log and existing MySQL replication framework, therefore it is possible that some transient errors could cause errors in the receiver or applier threads. In such cases, the donor switch over process has retry functionality, similar to that found in regular replication.

#### Number of Attempts

The number of attempts a server joining the group makes when trying to connect to a donor from the pool of donors is 10. This is configured through the `group_replication_recovery_retry_count` plugin variable . The following command sets the maximum number of attempts to connect to a donor to 10.

```sql
mysql> SET GLOBAL group_replication_recovery_retry_count= 10;
```

Note that this accounts for the global number of attempts that the server joining the group makes connecting to each one of the suitable donors.

#### Sleep Routines

The `group_replication_recovery_reconnect_interval` plugin variable defines how much time the recovery process should sleep between donor connection attempts. This variable has its default set to 60 seconds and you can change this value dynamically. The following command sets the recovery donor connection retry interval to 120 seconds.

```sql
mysql> SET GLOBAL group_replication_recovery_reconnect_interval= 120;
```

Note, however, that recovery does not sleep after every donor connection attempt. As the server joining the group is connecting to different servers and not to the same one over and over again, it can assume that the problem that affects server A does not affect server B. As such, recovery suspends only when it has gone through all the possible donors. Once the server joining the group has tried to connect to all the suitable donors in the group and none remains, the recovery process sleeps for the number of seconds configured by the `group_replication_recovery_reconnect_interval` variable.


### 17.5.3 Network Partitioning

The group needs to achieve consensus whenever a change that needs to be replicated happens. This is the case for regular transactions but is also required for group membership changes and some internal messaging that keeps the group consistent. Consensus requires a majority of group members to agree on a given decision. When a majority of group members is lost, the group is unable to progress and blocks because it cannot secure majority or quorum.

Quorum may be lost when there are multiple involuntary failures, causing a majority of servers to be removed abruptly from the group. For example, in a group of 5 servers, if 3 of them become silent at once, the majority is compromised and thus no quorum can be achieved. In fact, the remaining two are not able to tell if the other 3 servers have crashed or whether a network partition has isolated these 2 alone and therefore the group cannot be reconfigured automatically.

On the other hand, if servers exit the group voluntarily, they instruct the group that it should reconfigure itself. In practice, this means that a server that is leaving tells others that it is going away. This means that other members can reconfigure the group properly, the consistency of the membership is maintained and the majority is recalculated. For example, in the above scenario of 5 servers where 3 leave at once, if the 3 leaving servers warn the group that they are leaving, one by one, then the membership is able to adjust itself from 5 to 2, and at the same time, securing quorum while that happens.

Note

Loss of quorum is by itself a side-effect of bad planning. Plan the group size for the number of expected failures (regardless whether they are consecutive, happen all at once or are sporadic).

The following sections explain what to do if the system partitions in such a way that no quorum is automatically achieved by the servers in the group.

Tip

A primary that has been excluded from a group after a majority loss followed by a reconfiguration can contain extra transactions that are not included in the new group. If this happens, the attempt to add back the excluded member from the group results in an error with the message This member has more executed transactions than those present in the group.

#### Detecting Partitions

The `replication_group_members` performance schema table presents the status of each server in the current view from the perspective of this server. The majority of the time the system does not run into partitioning, and therefore the table shows information that is consistent across all servers in the group. In other words, the status of each server on this table is agreed by all in the current view. However, if there is network partitioning, and quorum is lost, then the table shows the status `UNREACHABLE` for those servers that it cannot contact. This information is exported by the local failure detector built into Group Replication.

**Figure 17.7 Losing Quorum**

![Five server instances, S1, S2, S3, S4, and S5, are deployed as an interconnected group, which is a stable group. When three of the servers, S3, S4, and S5, fail, the majority is lost and the group can no longer proceed without intervention.](images/gr-majority-lost.png)

To understand this type of network partition the following section describes a scenario where there are initially 5 servers working together correctly, and the changes that then happen to the group once only 2 servers are online. The scenario is depicted in the figure.

As such, lets assume that there is a group with these 5 servers in it:

* Server s1 with member identifier `199b2df7-4aaf-11e6-bb16-28b2bd168d07`

* Server s2 with member identifier `199bb88e-4aaf-11e6-babe-28b2bd168d07`

* Server s3 with member identifier `1999b9fb-4aaf-11e6-bb54-28b2bd168d07`

* Server s4 with member identifier `19ab72fc-4aaf-11e6-bb51-28b2bd168d07`

* Server s5 with member identifier `19b33846-4aaf-11e6-ba81-28b2bd168d07`

Initially the group is running fine and the servers are happily communicating with each other. You can verify this by logging into s1 and looking at its `replication_group_members` performance schema table. For example:

```sql
mysql> SELECT MEMBER_ID,MEMBER_STATE, MEMBER_ROLE FROM performance_schema.replication_group_members;
+--------------------------------------+--------------+-------------+
| MEMBER_ID                            | MEMBER_STATE |-MEMBER_ROLE |
+--------------------------------------+--------------+-------------+
| 1999b9fb-4aaf-11e6-bb54-28b2bd168d07 | ONLINE       | SECONDARY   |
| 199b2df7-4aaf-11e6-bb16-28b2bd168d07 | ONLINE       | PRIMARY     |
| 199bb88e-4aaf-11e6-babe-28b2bd168d07 | ONLINE       | SECONDARY   |
| 19ab72fc-4aaf-11e6-bb51-28b2bd168d07 | ONLINE       | SECONDARY   |
| 19b33846-4aaf-11e6-ba81-28b2bd168d07 | ONLINE       | SECONDARY   |
+--------------------------------------+--------------+-------------+
```

However, moments later there is a catastrophic failure and servers s3, s4 and s5 stop unexpectedly. A few seconds after this, looking again at the `replication_group_members` table on s1 shows that it is still online, but several others members are not. In fact, as seen below they are marked as `UNREACHABLE`. Moreover, the system could not reconfigure itself to change the membership, because the majority has been lost.

```sql
mysql> SELECT MEMBER_ID,MEMBER_STATE FROM performance_schema.replication_group_members;
+--------------------------------------+--------------+
| MEMBER_ID                            | MEMBER_STATE |
+--------------------------------------+--------------+
| 1999b9fb-4aaf-11e6-bb54-28b2bd168d07 | UNREACHABLE  |
| 199b2df7-4aaf-11e6-bb16-28b2bd168d07 | ONLINE       |
| 199bb88e-4aaf-11e6-babe-28b2bd168d07 | ONLINE       |
| 19ab72fc-4aaf-11e6-bb51-28b2bd168d07 | UNREACHABLE  |
| 19b33846-4aaf-11e6-ba81-28b2bd168d07 | UNREACHABLE  |
+--------------------------------------+--------------+
```

The table shows that s1 is now in a group that has no means of progressing without external intervention, because a majority of the servers are unreachable. In this particular case, the group membership list needs to be reset to allow the system to proceed, which is explained in this section. Alternatively, you could also choose to stop Group Replication on s1 and s2 (or stop completely s1 and s2), figure out what happened with s3, s4 and s5 and then restart Group Replication (or the servers).

#### Unblocking a Partition

Group replication enables you to reset the group membership list by forcing a specific configuration. For instance in the case above, where s1 and s2 are the only servers online, you could chose to force a membership configuration consisting of only s1 and s2. This requires checking some information about s1 and s2 and then using the `group_replication_force_members` variable.

**Figure 17.8 Forcing a New Membership**

![Three of the servers in a group, S3, S4, and S5, have failed, so the majority is lost and the group can no longer proceed without intervention. With the intervention described in the following text, S1 and S2 are able to form a stable group by themselves.](images/gr-majority-lost-to-stable-group.png)

Suppose that you are back in the situation where s1 and s2 are the only servers left in the group. Servers s3, s4 and s5 have left the group unexpectedly. To make servers s1 and s2 continue, you want to force a membership configuration that contains only s1 and s2.

Warning

This procedure uses `group_replication_force_members` and should be considered a last resort remedy. It *must* be used with extreme care and only for overriding loss of quorum. If misused, it could create an artificial split-brain scenario or block the entire system altogether.

Recall that the system is blocked and the current configuration is the following (as perceived by the local failure detector on s1):

```sql
mysql> SELECT MEMBER_ID,MEMBER_STATE FROM performance_schema.replication_group_members;
+--------------------------------------+--------------+
| MEMBER_ID                            | MEMBER_STATE |
+--------------------------------------+--------------+
| 1999b9fb-4aaf-11e6-bb54-28b2bd168d07 | UNREACHABLE  |
| 199b2df7-4aaf-11e6-bb16-28b2bd168d07 | ONLINE       |
| 199bb88e-4aaf-11e6-babe-28b2bd168d07 | ONLINE       |
| 19ab72fc-4aaf-11e6-bb51-28b2bd168d07 | UNREACHABLE  |
| 19b33846-4aaf-11e6-ba81-28b2bd168d07 | UNREACHABLE  |
+--------------------------------------+--------------+
```

The first thing to do is to check what is the local address (group communication identifier) for s1 and s2. Log in to s1 and s2 and get that information as follows.

```sql
mysql> SELECT @@group_replication_local_address;
```

Once you know the group communication addresses of s1 (`127.0.0.1:10000`) and s2 (`127.0.0.1:10001`), you can use that on one of the two servers to inject a new membership configuration, thus overriding the existing one that has lost quorum. To do that on s1:

```sql
mysql> SET GLOBAL group_replication_force_members="127.0.0.1:10000,127.0.0.1:10001";
```

This unblocks the group by forcing a different configuration. Check `replication_group_members` on both s1 and s2 to verify the group membership after this change. First on s1.

```sql
mysql> SELECT MEMBER_ID,MEMBER_STATE FROM performance_schema.replication_group_members;
+--------------------------------------+--------------+
| MEMBER_ID                            | MEMBER_STATE |
+--------------------------------------+--------------+
| b5ffe505-4ab6-11e6-b04b-28b2bd168d07 | ONLINE       |
| b60907e7-4ab6-11e6-afb7-28b2bd168d07 | ONLINE       |
+--------------------------------------+--------------+
```

And then on s2.

```sql
mysql> SELECT * FROM performance_schema.replication_group_members;
+--------------------------------------+--------------+
| MEMBER_ID                            | MEMBER_STATE |
+--------------------------------------+--------------+
| b5ffe505-4ab6-11e6-b04b-28b2bd168d07 | ONLINE       |
| b60907e7-4ab6-11e6-afb7-28b2bd168d07 | ONLINE       |
+--------------------------------------+--------------+
```

When forcing a new membership configuration, make sure that any servers are going to be forced out of the group are indeed stopped. In the scenario depicted above, if s3, s4 and s5 are not really unreachable but instead are online, they may have formed their own functional partition (they are 3 out of 5, hence they have the majority). In that case, forcing a group membership list with s1 and s2 could create an artificial split-brain situation. Therefore it is important before forcing a new membership configuration to ensure that the servers to be excluded are indeed shutdown and if they are not, shut them down before proceeding.

After you have used the `group_replication_force_members` system variable to successfully force a new group membership and unblock the group, ensure that you clear the system variable. `group_replication_force_members` must be empty in order to issue a `START GROUP_REPLICATION` statement.


### 17.5.4 Restarting a Group

Group Replication is designed to ensure that the database service is continuously available, even if some of the servers that form the group are currently unable to participate in it due to planned maintenance or unplanned issues. As long as the remaining members are a majority of the group they can elect a new primary and continue to function as a group. However, if every member of a replication group leaves the group, and Group Replication is stopped on every member by a `STOP GROUP_REPLICATION` statement or system shutdown, the group now only exists in theory, as a configuration on the members. In that situation, to re-create the group, it must be started by bootstrapping as if it was being started for the first time.

The difference between bootstrapping a group for the first time and doing it for the second or subsequent times is that in the latter situation, the members of a group that was shut down might have different transaction sets from each other, depending on the order in which they were stopped or failed. A member cannot join a group if it has transactions that are not present on the other group members. For Group Replication, this includes both transactions that have been committed and applied, which are in the `gtid_executed` GTID set, and transactions that have been certified but not yet applied, which are in the `group_replication_applier` channel. A Group Replication group member never removes a transaction that has been certified, which is a declaration of the member’s intent to commit the transaction.

The replication group must therefore be restarted beginning with the most up to date member, that is, the member that has the most transactions executed and certified. The members with fewer transactions can then join and catch up with the transactions they are missing through distributed recovery. It is not correct to assume that the last known primary member of the group is the most up to date member of the group, because a member that was shut down later than the primary might have more transactions. You must therefore restart each member to check the transactions, compare all the transaction sets, and identify the most up to date member. This member can then be used to bootstrap the group.

Follow this procedure to restart a replication group safely after every member shuts down.

1. For each group member in turn, in any order:

   1. Connect a client to the group member. If Group Replication is not already stopped, issue a `STOP GROUP_REPLICATION` statement and wait for Group Replication to stop.

   2. Edit the MySQL Server configuration file (typically named `my.cnf` on Linux and Unix systems, or `my.ini` on Windows systems) and set the system variable `group_replication_start_on_boot=OFF`. This setting prevents Group Replication from starting when MySQL Server is started, which is the default.

      If you cannot change that setting on the system, you can just allow the server to attempt to start Group Replication, which will fail because the group has been fully shut down and not yet bootstrapped. If you take that approach, do not set `group_replication_bootstrap_group=ON` on any server at this stage.

   3. Start the MySQL Server instance, and verify that Group Replication has not been started (or has failed to start). Do not start Group Replication at this stage.

   4. Collect the following information from the group member:

      * The contents of the `gtid_executed` GTID set. You can get this by issuing the following statement:

        ```sql
        mysql> SELECT @@GLOBAL.GTID_EXECUTED
        ```

      * The set of certified transactions on the `group_replication_applier` channel. You can get this by issuing the following statement:

        ```sql
        mysql> SELECT received_transaction_set FROM \
                performance_schema.replication_connection_status WHERE \
                channel_name="group_replication_applier";
        ```

2. When you have collected the transaction sets from all the group members, compare them to find which member has the biggest transaction set overall, including both the executed transactions (`gtid_executed`) and the certified transactions (on the `group_replication_applier` channel). You can do this manually by looking at the GTIDs, or you can compare the GTID sets using stored functions, as described in Section 16.1.3.7, “Stored Function Examples to Manipulate GTIDs”.

3. Use the member that has the biggest transaction set to bootstrap the group, by connecting a client to the group member and issuing the following statements:

   ```sql
   mysql> SET GLOBAL group_replication_bootstrap_group=ON;
   mysql> START GROUP_REPLICATION;
   mysql> SET GLOBAL group_replication_bootstrap_group=OFF;
   ```

   It is important not to store the setting `group_replication_bootstrap_group=ON` in the configuration file, otherwise when the server is restarted again, a second group with the same name is set up.

4. To verify that the group now exists with this founder member in it, issue this statement on the member that bootstrapped it:

   ```sql
   mysql> SELECT * FROM performance_schema.replication_group_members;
   ```

5. Add each of the other members back into the group, in any order, by issuing a `START GROUP_REPLICATION` statement on each of them:

   ```sql
   mysql> START GROUP_REPLICATION;
   ```

6. To verify that each member has joined the group, issue this statement on any member:

   ```sql
   mysql> SELECT * FROM performance_schema.replication_group_members;
   ```

7. When the members have rejoined the group, if you edited their configuration files to set `group_replication_start_on_boot=OFF`, you can edit them again to set `ON` (or remove the system variable, since `ON` is the default).


### 17.5.5 Using MySQL Enterprise Backup with Group Replication

MySQL Enterprise Backup is a commercially-licensed backup utility for MySQL Server, available with [MySQL Enterprise Edition](https://www.mysql.com/products/enterprise/). This section explains how to back up and subsequently restore a Group Replication member using MySQL Enterprise Backup. The same technique can be used to quickly add a new member to a group.

#### Backing up a Group Replication Member Using MySQL Enterprise Backup

Backing up a Group Replication member is similar to backing up a stand-alone MySQL instance. The following instructions assume that you are already familiar with how to use MySQL Enterprise Backup to perform a backup; if that is not the case, please review the MySQL Enterprise Backup 4.1 User's Guide, especially Backing Up a Database Server. Also note the requirements described in Grant MySQL Privileges to Backup Administrator and Using MySQL Enterprise Backup with Group Replication.

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

   2. Preserve the configuration file `auto.cnf`, located in the corrupted server's data directory, by copying it to a safe location outside of the data directory. This is for preserving the server's UUID, which is needed later.

   3. Delete all contents in the data directory of `s3`. For example:

      ```sql
      s3> rm -rf /var/lib/mysql/*
      ```

      If the system variables `innodb_data_home_dir`, `innodb_log_group_home_dir`, and `innodb_undo_directory` point to any directories other than the data directory, they should also be made empty; otherwise, the restore operation fails.

   4. Restore backup of `s2` onto the host for `s3`:

      ```sql
      s3> mysqlbackup --defaults-file=/etc/my.cnf \
        --datadir=/var/lib/mysql \
        --backup-image=/backups/my.mbi_2206_1429  \
      --backup-dir=/tmp/restore_`date +%d%m_%H%M` copy-back-and-apply-log
      ```

      Note

      The command above assumes that the binary logs and relay logs on `s2` and `s3` have the same base name and are at the same location on the two servers. If these conditions are not met, for MySQL Enterprise Backup 4.1.2 and later, you should use the `--log-bin` and `--relay-log` options to restore the binary log and relay log to their original file paths on `s3`. For example, if you know that on `s3` the binary log's base name is `s3-bin` and the relay-log's base name is `s3-relay-bin`, your restore command should look like:

      ```sql
      mysqlbackup --defaults-file=/etc/my.cnf \
        --datadir=/var/lib/mysql \
        --backup-image=/backups/my.mbi_2206_1429  \
        --log-bin=s3-bin --relay-log=s3-relay-bin \
        --backup-dir=/tmp/restore_`date +%d%m_%H%M` copy-back-and-apply-log
      ```

      Being able to restore the binary log and relay log to the right file paths makes the restore process easier; if that is impossible for some reason, see Rebuild the Failed Member to Rejoin as a New Member.

3. *Restore the `auto.cnf` file for s3.* To rejoin the replication group, the restored member *must* have the same `server_uuid` it used to join the group before. Supply the old server UUID by copying the `auto.cnf` file preserved in step 2 above into the data directory of the restored member.

   Note

   If you cannot supply the failed member's original `server_uuid` to the restored member by restoring its old `auto.cnf` file, you must let the restored member join the group as a new member; see instructions in Rebuild the Failed Member to Rejoin as a New Member below on how to do that.

4. *Start the restored server.* For example, on Linux distributions that use systemd:

   ```sql
   systemctl start mysqld
   ```

   Note

   If the server you are restoring is a primary member, perform the steps described in Restoring a Primary Member *before starting the restored server*.

5. *Restart Group Replication.* Connect to the restarted `s3` using, for example, a **mysql** client, and issue the following command:

   ```sql
   mysql> START GROUP_REPLICATION;
   ```

   Before the restored instance can become an online member of the group, it needs to apply any transactions that have happened to the group after the backup was taken; this is achieved using Group Replication's distributed recovery mechanism, and the process starts after the START GROUP\_REPLICATION statement has been issued. To check the member status of the restored instance, issue:

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

   If the server you are restoring is a primary member, once it has gained synchrony with the group and become `ONLINE`, perform the steps described at the end of Restoring a Primary Member to revert the configuration changes you had made to the server before you started it.

The member has now been fully restored from the backup and functions as a regular member of the group.

#### Rebuild the Failed Member to Rejoin as a New Member

Sometimes, the steps outlined above in Restoring a Failed Member cannot be carried out because, for example, the binary log or relay log is corrupted, or it is just missing from the backup. In such a situation, use the backup to rebuild the member, and then add it to the group as a new member. In the steps below, we assume the rebuilt member is named `s3`, like the failed member, and it is run on the same host as `s3` was:

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

      If the system variables `innodb_data_home_dir`, `innodb_log_group_home_dir`, and `innodb_undo_directory` point to any directories other than the data directory, they should also be made empty; otherwise, the restore operation fails.

   3. Restore the backup of `s2` onto the host of `s3`. With this approach, we are rebuilding `s3` as a new member, for which we do not need or do not want to use the old binary and relay logs in the backup; therefore, if these logs have been included in your backup, exclude them using the `--skip-binlog` and `--skip-relaylog` options:

      ```sql
      s3> mysqlbackup --defaults-file=/etc/my.cnf \
        --datadir=/var/lib/mysql \
        --backup-image=/backups/my.mbi_2206_1429  \
        --backup-dir=/tmp/restore_`date +%d%m_%H%M` \
        --skip-binlog --skip-relaylog \
      copy-back-and-apply-log
      ```

      Notes

      * If you have healthy binary log and relay logs in the backup that you can transfer onto the target host with no issues, you are recommended to follow the easier procedure as described in Restoring a Failed Member above.

      * Do NOT restore manually the corrupted server's `auto.cnf` file to the data directory of the new member—when the rebuilt `s3` joins the group as a new member, it is going to be assigned a new server UUID.

3. *Start the restored server.* For example, on Linux distributions that use systemd:

   ```sql
   systemctl start mysqld
   ```

   Note

   If the server you are restoring is a primary member, perform the steps described in Restoring a Primary Member *before starting the restored server*.

4. *Reconfigure the restored member to join Group Replication.* Connect to the restored server with a **mysql** client and reset the source and replica information with the following commands:

   ```sql
   mysql> RESET MASTER;
   ```

   ```sql
   mysql> RESET SLAVE ALL;
   ```

   For the restored server to be able to recover automatically using Group Replication's built-in mechanism for distributed recovery, configure the server's `gtid_executed` variable. To do this, use the `backup_gtid_executed.sql` file included in the backup of `s2`, which is usually restored under the restored member's data directory. Disable binary logging, use the `backup_gtid_executed.sql` file to configure `gtid_executed`, and then re-enable binary logging by issuing the following statements with your **mysql** client:

   ```sql
   mysql> SET SQL_LOG_BIN=OFF;
   mysql> SOURCE datadir/backup_gtid_executed.sql
   mysql> SET SQL_LOG_BIN=ON;
   ```

   Then, configure the Group Replication user credentials on the member:

   ```sql
   mysql> CHANGE MASTER TO MASTER_USER='rpl_user', MASTER_PASSWORD='password' /
   		FOR CHANNEL 'group_replication_recovery';
   ```

5. *Restart Group Replication.* Issue the following command to the restored server with your **mysql** client:

   ```sql
   mysql> START GROUP_REPLICATION;
   ```

   Before the restored instance can become an online member of the group, it needs to apply any transactions that have happened to the group after the backup was taken; this is achieved using Group Replication's distributed recovery mechanism, and the process starts after the START GROUP\_REPLICATION statement has been issued. To check the member status of the restored instance, issue:

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

   If the server you are restoring is a primary member, once it has gained synchrony with the group and become `ONLINE`, perform the steps described at the end of Restoring a Primary Member to revert the configuration changes you had made to the server before you started it.

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
