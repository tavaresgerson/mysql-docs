### 17.4.2 The replication\_group\_members Table

The [`performance_schema.replication_group_members`](performance-schema-replication-group-members-table.html "25.12.11.8 The replication_group_members Table") table is used for monitoring the status of the different server instances that are members of the group. The information in the table is updated whenever there is a view change, for example when the configuration of the group is dynamically changed when a new member joins. At that point, servers exchange some of their metadata to synchronize themselves and continue to cooperate together. The information is shared between all the server instances that are members of the replication group, so information on all the group members can be queried from any member. This table can be used to get a high level view of the state of a replication group, for example by issuing:

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

Based on this result we can see that the group consists of three members, each member's host and port number which clients use to connect to the member, and the [`server_uuid`](replication-options.html#sysvar_server_uuid) of the member. The `MEMBER_STATE` column shows one of the [Section 17.4.1, “Group Replication Server States”](group-replication-server-states.html "17.4.1 Group Replication Server States"), in this case it shows that all three members in this group are `ONLINE`, and the `MEMBER_ROLE` column shows that there are two secondaries, and a single primary. Therefore this group must be running in single-primary mode. The `MEMBER_VERSION` column can be useful when you are upgrading a group and are combining members running different MySQL versions. See [Section 17.4.1, “Group Replication Server States”](group-replication-server-states.html "17.4.1 Group Replication Server States") for more information.

For more information about the `Member_host` value and its impact on the distributed recovery process, see [Section 17.2.1.3, “User Credentials”](group-replication-user-credentials.html "17.2.1.3 User Credentials").
