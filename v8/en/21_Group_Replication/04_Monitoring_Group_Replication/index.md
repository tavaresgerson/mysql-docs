## 20.4 Monitoring Group Replication

20.4.1 GTIDs and Group Replication

20.4.2 Group Replication Server States

20.4.3 The replication_group_members Table

20.4.4 The replication_group_member_stats Table

You can use the MySQL Performance Schema to monitor Group Replication. These Performance Schema tables display information specific to Group Replication:

* `replication_group_member_stats`: See Section 20.4.4, “The replication_group_member_stats Table”.

* `replication_group_members`: See Section 20.4.3, “The replication_group_members Table”.

* `replication_group_communication_information`: See Section 29.12.11.12, “The replication_group_communication_information Table”.

These Performance Schema replication tables also show information relating to Group Replication:

* `replication_connection_status` shows information regarding Group Replication, such as transactions received from the group and queued in the applier queue (relay log).

* `replication_applier_status` shows the states of channels and threads relating to Group Replication. These can also be used to monitor what individual worker threads are doing.

Replication channels created by the Group Replication plugin are listed here:

* `group_replication_recovery`: Used for replication changes related to distributed recovery.

* `group_replication_applier`: Used for the incoming changes from the group, to apply transactions coming directly from the group.

For information about system variables affecting Group Replication, see Section 20.9.1, “Group Replication System Variables”. See Section 20.9.2, “Group Replication Status Variables”, for status variables providing information about Group Replication.

Beginning with MySQL 8.0.21, messages relating to Group Replication lifecycle events other than errors are classified as system messages; these are always written to the replication group member' error log. You can use this information to review the history of a given server's membership in a replication group. (Previously, such events were classified as information messages; for a MySQL server from a release prior to 8.0.21, these can be added to the error log by setting `log_error_verbosity` to `3`.)

Some lifecycle events that affect the whole group are logged on every group member, such as a new member entering `ONLINE` status in the group or a primary election. Other events are logged only on the member where they take place, such as super read only mode being enabled or disabled on the member, or the member leaving the group. A number of lifecycle events that can indicate an issue if they occur frequently are logged as warning messages, including a member becoming unreachable and then reachable again, and a member starting distributed recovery by state transfer from the binary log or by a remote cloning operation.

Note

If you are monitoring one or more secondary instances using **mysqladmin**, you should be aware that a `FLUSH STATUS` statement executed by this utility creates a GTID event on the local instance which may impact future group operations.
