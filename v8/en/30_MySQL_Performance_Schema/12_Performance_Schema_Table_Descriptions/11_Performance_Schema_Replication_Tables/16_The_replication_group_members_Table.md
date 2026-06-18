#### 29.12.11.16 The replication\_group\_members Table

This table shows network and status information for
replication group members. The network addresses shown are the
addresses used to connect clients to the group, and should not
be confused with the member's internal group
communication address specified by
[`group_replication_local_address`](group-replication-system-variables.html#sysvar_group_replication_local_address).

The [`replication_group_members`](performance-schema-replication-group-members-table.html "29.12.11.16 The replication_group_members Table")
table has these columns:

* `CHANNEL_NAME`

  Name of the Group Replication channel.

* `MEMBER_ID`

  The member server UUID. This has a different value for
  each member in the group. This also serves as a key
  because it is unique to each member.

* `MEMBER_HOST`

  Network address of this member (host name or IP address).
  Retrieved from the member's
  [`hostname`](server-system-variables.html#sysvar_hostname) variable. This
  is the address which clients connect to, unlike the
  group\_replication\_local\_address which is used for internal
  group communication.

* `MEMBER_PORT`

  Port on which the server is listening. Retrieved from the
  member's [`port`](server-system-variables.html#sysvar_port)
  variable.

* `MEMBER_STATE`

  Current state of this member; can be any one of the
  following:

  + `ONLINE`: The member is in a fully
    functioning state.

  + `RECOVERING`: The server has joined a
    group from which it is retrieving data.

  + `OFFLINE`: The group replication
    plugin is installed but has not been started.

  + `ERROR`: The member has encountered
    an error, either during applying transactions or
    during the recovery phase, and is not participating in
    the group's transactions.

  + `UNREACHABLE`: The failure detection
    process suspects that this member cannot be contacted,
    because the group messages have timed out.

  See [Section 20.4.2, “Group Replication Server States”](group-replication-server-states.html "20.4.2 Group Replication Server States").

* `MEMBER_ROLE`

  Role of the member in the group, either
  `PRIMARY` or
  `SECONDARY`.

* `MEMBER_VERSION`

  MySQL version of the member.

* `MEMBER_COMMUNICATION_STACK`

  The communication stack used for the group, either the
  `XCOM` communication stack or the
  `MYSQL` communication stack.

  This column was added in MySQL 8.0.27.

The [`replication_group_members`](performance-schema-replication-group-members-table.html "29.12.11.16 The replication_group_members Table")
table has no indexes.

[`TRUNCATE TABLE`](truncate-table.html "15.1.37 TRUNCATE TABLE Statement") is not permitted
for the [`replication_group_members`](performance-schema-replication-group-members-table.html "29.12.11.16 The replication_group_members Table")
table.