## 20.8 Upgrading Group Replication

20.8.1 Combining Different Member Versions in a Group

20.8.2 Group Replication Offline Upgrade

20.8.3 Group Replication Online Upgrade

This section explains how to upgrade a Group Replication setup. The basic process of upgrading members of a group is the same as upgrading stand-alone instances, see Chapter 3, *Upgrading MySQL* for the actual process of doing upgrade and types available. Choosing between an in-place or logical upgrade depends on the amount of data stored in the group. Usually an in-place upgrade is faster, and therefore is recommended. You should also consult Section 19.5.3, “Upgrading or Downgrading a Replication Topology”.

Note

Before MySQL 8.4, a server would not join a group if it was running a lower MySQL Server version than the lowest group member's version. For example, for a group with S1 (8.0.30), S2 (8.0.31), and S3 (8.0.32), the joining member needs to be 8.0.30 or higher. MySQL 8.4 allows all versions within the 8.4 series to join. For example, an 8.4.0 server could join a group consisting of S1 (8.4.1) and S2 (8.4.2).

While you are in the process of upgrading an online group, in order to maximize availability, you might need to have members with different MySQL Server versions running at the same time. Group Replication includes compatibility policies that enable you to safely combine members running different versions of MySQL in the same group during the upgrade procedure. Depending on your group, the effects of these policies might affect the order in which you should upgrade group members. For details, see Section 20.8.1, “Combining Different Member Versions in a Group”.

If your group can be taken fully offline see Section 20.8.2, “Group Replication Offline Upgrade”. If your group needs to remain online, as is common with production deployments, see Section 20.8.3, “Group Replication Online Upgrade” for the different approaches available for upgrading a group with minimal downtime.
