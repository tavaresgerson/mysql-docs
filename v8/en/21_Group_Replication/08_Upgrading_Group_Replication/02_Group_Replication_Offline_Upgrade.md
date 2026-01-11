### 20.8.2 Group Replication Offline Upgrade

To perform an offline upgrade of a Group Replication group, you remove each member from the group, perform an upgrade of the member and then restart the group as usual. In a multi-primary group you can shutdown the members in any order. In a single-primary group, shutdown each secondary first and then finally the primary. See Section 20.8.3.2, “Upgrading a Group Replication Member” for how to remove members from a group and shutdown MySQL.

Once the group is offline, upgrade all of the members. See Chapter 3, *Upgrading MySQL* for how to perform an upgrade. When all members have been upgraded, restart the members.

If you upgrade all the members of a replication group when they are offline and then restart the group, the members join using the new release's Group Replication communication protocol version, so that becomes the group's communication protocol version. If you have a requirement to allow members at earlier releases to join, you can use the `group_replication_set_communication_protocol()` function to downgrade the communication protocol version, specifying the MySQL Server version of the prospective group member that has the oldest installed server version.
