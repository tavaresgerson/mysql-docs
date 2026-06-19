## 17.4 Monitoring Group Replication

You can use the MySQL Performance Schema to monitor Group Replication. These Performance Schema tables display information specific to Group Replication:

* `replication_group_member_stats`: See Section 17.4.3, “The replication\_group\_member\_stats Table”.

* `replication_group_members`: See Section 17.4.2, “The replication\_group\_members Table”.

These Performance Schema replication tables also show information relating to Group Replication:

* `replication_connection_status` shows information regarding Group Replication, such as transactions received from the group and queued in the applier queue (relay log).

* `replication_applier_status` shows the states of channels and threads relating to Group Replication. These can also be used to monitor what individual worker threads are doing.

Replication channels created by the Group Replication plugin are listed here:

* `group_replication_recovery`: Used for replication changes related to distributed recovery.

* `group_replication_applier`: Used for the incoming changes from the group, to apply transactions coming directly from the group.

For information about system variables affecting Group Replication, see Section 17.7.1, “Group Replication System Variables”. See Section 17.7.2, “Group Replication Status Variables”, for status variables providing information about Group Replication.

Note

If you are monitoring one or more secondary instances using **mysqladmin**, you should be aware that a `FLUSH STATUS` statement executed by this utility creates a GTID event on the local instance which may impact future group operations.


### 17.4.1 Group Replication Server States

There are various states that a server instance can be in. If servers are communicating properly, all report the same states for all servers. However, if there is a network partition, or a server leaves the group, then different information could be reported, depending on which server is queried. If the server has left the group then it cannot report updated information about the other servers' states. If there is a partition, such that quorum is lost, servers are not able to coordinate between themselves. As a consequence, they cannot guess what the status of different servers is. Therefore, instead of guessing their state they report that some servers are unreachable.

**Table 17.1 Server State**

<table><col style="width: 38%"/><col style="width: 50%"/><col style="width: 12%"/><thead><tr> <th><p> Field </p></th> <th><p> Description </p></th> <th><p> Group Synchronized </p></th> </tr></thead><tbody><tr> <th><p> <code>ONLINE</code> </p></th> <td><p> The member is ready to serve as a fully functional group member, meaning that the client can connect and start executing transactions. </p></td> <td><p> Yes </p></td> </tr><tr> <th><p> <code>RECOVERING</code> </p></th> <td><p> The member is in the process of becoming an active member of the group and is currently going through the recovery process, receiving state information from a donor. </p></td> <td><p> No </p></td> </tr><tr> <th><p> <code>OFFLINE</code> </p></th> <td><p> The plugin is loaded but the member does not belong to any group. </p></td> <td><p> No </p></td> </tr><tr> <th><p> <code>ERROR</code> </p></th> <td><p> The state of the member. Whenever there is an error on the recovery phase or while applying changes, the server enters this state. </p></td> <td><p> No </p></td> </tr><tr> <th><p> <code>UNREACHABLE</code> </p></th> <td><p> Whenever the local failure detector suspects that a given server is not reachable, because for example it was disconnected involuntarily, it shows that server's state as <code>UNREACHABLE</code>. </p></td> <td><p> No </p></td> </tr></tbody></table>

Important

Once an instance enters `ERROR` state, the `super_read_only` option is set to `ON`. To leave the `ERROR` state you must manually configure the instance with `super_read_only=OFF`.

Note that Group Replication is *not* synchronous, but eventually synchronous. More precisely, transactions are delivered to all group members in the same order, but their execution is not synchronized, meaning that after a transaction is accepted to be committed, each member commits at its own pace.


### 17.4.2 The replication\_group\_members Table

The `performance_schema.replication_group_members` table is used for monitoring the status of the different server instances that are members of the group. The information in the table is updated whenever there is a view change, for example when the configuration of the group is dynamically changed when a new member joins. At that point, servers exchange some of their metadata to synchronize themselves and continue to cooperate together. The information is shared between all the server instances that are members of the replication group, so information on all the group members can be queried from any member. This table can be used to get a high level view of the state of a replication group, for example by issuing:

```sql
SELECT * FROM performance_schema.replication_group_members;
+---------------------------+--------------------------------------+--------------+-------------+--------------+
| CHANNEL_NAME              | MEMBER_ID	                           | MEMBER_HOST  | MEMBER_PORT | MEMBER_STATE |
+---------------------------+--------------------------------------+--------------+-------------+--------------+
| group_replication_applier | 041f26d8-f3f3-11e8-adff-080027337932 | example1     |      3306   | ONLINE       |
| group_replication_applier | f60a3e10-f3f2-11e8-8258-080027337932 | example2     |      3306   | ONLINE       |
| group_replication_applier | fc890014-f3f2-11e8-a9fd-080027337932 | example3     |      3306   | ONLINE       |
+---------------------------+--------------------------------------+--------------+-------------+--------------+
```

Based on this result we can see that the group consists of three members, each member's host and port number which clients use to connect to the member, and the `server_uuid` of the member. The `MEMBER_STATE` column shows one of the Section 17.4.1, “Group Replication Server States”, in this case it shows that all three members in this group are `ONLINE`, and the `MEMBER_ROLE` column shows that there are two secondaries, and a single primary. Therefore this group must be running in single-primary mode. The `MEMBER_VERSION` column can be useful when you are upgrading a group and are combining members running different MySQL versions. See Section 17.4.1, “Group Replication Server States” for more information.

For more information about the `Member_host` value and its impact on the distributed recovery process, see Section 17.2.1.3, “User Credentials”.


### 17.4.3 The replication\_group\_member\_stats Table

Each member in a replication group certifies and applies transactions received by the group. Statistics regarding the certifier and applier procedures are useful to understand how the applier queue is growing, how many conflicts have been found, how many transactions were checked, which transactions are committed everywhere, and so on.

The `performance_schema.replication_group_member_stats` table provides group-level information related to the certification process, and also statistics for the transactions received and originated by each individual member of the replication group. The information is shared between all the server instances that are members of the replication group, so information on all the group members can be queried from any member. Note that refreshing of statistics for remote members is controlled by the message period specified in the `group_replication_flow_control_period` option, so these can differ slightly from the locally collected statistics for the member where the query is made. To use this table to monitor a Group Replication member, issue the following statement:

```sql
mysql> SELECT * FROM performance_schema.replication_group_member_stats\G
```

These columns are important for monitoring the performance of the members connected in the group. Suppose that one of the group's members always reports a large number of transactions in its queue compared to other members. This means that the member is delayed and is not able to keep up to date with the other members of the group. Based on this information, you could decide to either remove the member from the group, or delay the processing of transactions on the other members of the group in order to reduce the number of queued transactions. This information can also help you to decide how to adjust the flow control of the Group Replication plugin, see Section 17.9.7.3, “Flow Control”.
