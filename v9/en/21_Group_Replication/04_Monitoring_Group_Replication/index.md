## 20.4 Monitoring Group Replication

20.4.1 GTIDs and Group Replication

20.4.2 Group Replication Server States

20.4.3 The replication\_group\_members Table

20.4.4 The replication\_group\_member\_stats Table

You can use the MySQL Performance Schema to monitor Group Replication. These Performance Schema tables display information specific to Group Replication:

* `replication_group_member_stats`: See Section 20.4.4, “The replication\_group\_member\_stats Table”.

* `replication_group_members`: See Section 20.4.3, “The replication\_group\_members Table”.

* `replication_group_communication_information`: See Section 29.12.11.14, “The replication\_group\_communication\_information Table”.

These Performance Schema replication tables also show information relating to Group Replication:

* `replication_connection_status` shows information regarding Group Replication, such as transactions received from the group and queued in the applier queue (relay log).

* `replication_applier_status` shows the states of channels and threads relating to Group Replication. These can also be used to monitor what individual worker threads are doing.

Replication channels created by the Group Replication plugin are listed here:

* `group_replication_recovery`: Used for replication changes related to distributed recovery.

* `group_replication_applier`: Used for the incoming changes from the group, to apply transactions coming directly from the group.

For information about system variables affecting Group Replication, see Section 20.9.1, “Group Replication System Variables”. See Section 20.9.2, “Group Replication Status Variables”, for status variables providing information about Group Replication.

Messages relating to Group Replication lifecycle events other than errors are classified as system messages; these are always written to the replication group member' error log. You can use this information to review the history of a given server's membership in a replication group.

Some lifecycle events that affect the whole group are logged on every group member, such as a new member entering `ONLINE` status in the group or a primary election. Other events are logged only on the member where they take place, such as super read only mode being enabled or disabled on the member, or the member leaving the group. A number of lifecycle events that can indicate an issue if they occur frequently are logged as warning messages, including a member becoming unreachable and then reachable again, and a member starting distributed recovery by state transfer from the binary log or by a remote cloning operation.

Note

If you are monitoring one or more secondary instances using **mysqladmin**, you should be aware that a `FLUSH STATUS` statement executed by this utility creates a GTID event on the local instance which may impact future group operations.

User of MySQL Enterprise Edition can also use the advanced monitoring capabilities built into the MySQL components listed here:

* *Replication Applier Metrics*: Adds tables to the MySQL Performance Schema (`replication_applier_metrics` and `replication_applier_progress_by_worker`) that contain detailed information about applier and worker performance. See Section 7.5.6.1, “Replication Applier Metrics Component”, as well as the descriptions of the Performance Schema tables, for more information.

* *Group Replication Flow Control Statistics*: Provides additional global status variables which provide information on Group Replication flow control execution, that is, information about transaction throttling. See Section 7.5.6.2, “Group Replication Flow Control Statistics Component”.

* *Group Replication Resource Manager*: Monitors the applier channel, recovery channel, and system memory usage on each group member; expels group members which experience excessive channel lag or memory usage (and allows them to rejoin later). See Section 7.5.6.3, “Group Replication Resource Manager Component”, for more information.
