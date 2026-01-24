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

The number of attempts a server joining the group makes when trying to connect to a donor from the pool of donors is 10. This is configured through the [`group_replication_recovery_retry_count`](group-replication-system-variables.html#sysvar_group_replication_recovery_retry_count) plugin variable . The following command sets the maximum number of attempts to connect to a donor to 10.

```sql
mysql> SET GLOBAL group_replication_recovery_retry_count= 10;
```

Note that this accounts for the global number of attempts that the server joining the group makes connecting to each one of the suitable donors.

#### Sleep Routines

The [`group_replication_recovery_reconnect_interval`](group-replication-system-variables.html#sysvar_group_replication_recovery_reconnect_interval) plugin variable defines how much time the recovery process should sleep between donor connection attempts. This variable has its default set to 60 seconds and you can change this value dynamically. The following command sets the recovery donor connection retry interval to 120 seconds.

```sql
mysql> SET GLOBAL group_replication_recovery_reconnect_interval= 120;
```

Note, however, that recovery does not sleep after every donor connection attempt. As the server joining the group is connecting to different servers and not to the same one over and over again, it can assume that the problem that affects server A does not affect server B. As such, recovery suspends only when it has gone through all the possible donors. Once the server joining the group has tried to connect to all the suitable donors in the group and none remains, the recovery process sleeps for the number of seconds configured by the [`group_replication_recovery_reconnect_interval`](group-replication-system-variables.html#sysvar_group_replication_recovery_reconnect_interval) variable.
