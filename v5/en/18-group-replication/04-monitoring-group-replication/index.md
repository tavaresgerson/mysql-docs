## 17.4 Monitoring Group Replication

[17.4.1 Group Replication Server States](group-replication-server-states.html)

[17.4.2 The replication\_group\_members Table](group-replication-replication-group-members.html)

[17.4.3 The replication\_group\_member\_stats Table](group-replication-replication-group-member-stats.html)

You can use the MySQL [Performance Schema](performance-schema.html "Chapter 25 MySQL Performance Schema") to monitor Group Replication. These Performance Schema tables display information specific to Group Replication:

* [`replication_group_member_stats`](performance-schema-replication-group-member-stats-table.html "25.12.11.7 The replication_group_member_stats Table"): See [Section 17.4.3, “The replication\_group\_member\_stats Table”](group-replication-replication-group-member-stats.html "17.4.3 The replication_group_member_stats Table").

* [`replication_group_members`](performance-schema-replication-group-members-table.html "25.12.11.8 The replication_group_members Table"): See [Section 17.4.2, “The replication\_group\_members Table”](group-replication-replication-group-members.html "17.4.2 The replication_group_members Table").

These Performance Schema replication tables also show information relating to Group Replication:

* [`replication_connection_status`](performance-schema-replication-connection-status-table.html "25.12.11.2 The replication_connection_status Table") shows information regarding Group Replication, such as transactions received from the group and queued in the applier queue (relay log).

* [`replication_applier_status`](performance-schema-replication-applier-status-table.html "25.12.11.4 The replication_applier_status Table") shows the states of channels and threads relating to Group Replication. These can also be used to monitor what individual worker threads are doing.

Replication channels created by the Group Replication plugin are listed here:

* `group_replication_recovery`: Used for replication changes related to distributed recovery.

* `group_replication_applier`: Used for the incoming changes from the group, to apply transactions coming directly from the group.

For information about system variables affecting Group Replication, see [Section 17.7.1, “Group Replication System Variables”](group-replication-system-variables.html "17.7.1 Group Replication System Variables"). See [Section 17.7.2, “Group Replication Status Variables”](group-replication-status-variables.html "17.7.2 Group Replication Status Variables"), for status variables providing information about Group Replication.

Note

If you are monitoring one or more secondary instances using [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"), you should be aware that a [`FLUSH STATUS`](flush.html#flush-status) statement executed by this utility creates a GTID event on the local instance which may impact future group operations.
