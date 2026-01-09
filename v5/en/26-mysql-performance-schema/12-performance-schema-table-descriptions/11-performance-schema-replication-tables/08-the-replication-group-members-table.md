#### 25.12.11.8 The replication_group_members Table

This table shows network and status information for replication group members. The network addresses shown are the addresses used to connect clients to the group, and should not be confused with the member's internal group communication address specified by [`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address).

The `replication_group_members` table has these columns:

* `CHANNEL_NAME`

  Name of the Group Replication channel.

* `MEMBER_ID`

  Identifier for this member; the same as the server UUID.

* `MEMBER_HOST`

  Network address of this member (host name or IP address). Retrieved from the member's [`hostname`](server-system-variables.html#sysvar_hostname) variable.

* `MEMBER_PORT`

  Port on which the server is listening. Retrieved from the member's [`port`](server-system-variables.html#sysvar_port) variable.

* `MEMBER_STATE`

  Current state of this member; can be any one of the following:

  + `OFFLINE`: The Group Replication plugin is installed but has not been started.

  + `RECOVERING`: The server has joined a group from which it is retrieving data.

  + `ONLINE`: The member is in a fully functioning state.

  + `ERROR`: The member has encountered an error, either during applying transactions or during the recovery phase, and is not participating in the group's transactions.

  + `UNREACHABLE`: The failure detection process suspects that this member cannot be contacted, because the group messages have timed out.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is not permitted for the [`replication_group_members`](performance-schema-replication-group-members-table.html "25.12.11.8 The replication_group_members Table") table.
