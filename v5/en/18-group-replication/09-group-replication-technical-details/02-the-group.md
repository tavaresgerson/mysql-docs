### 17.9.2 The Group

In MySQL Group Replication, a set of servers forms a replication group. A group has a name, which takes the form of a UUID. The group is dynamic and servers can leave (either voluntarily or involuntarily) and join it at any time. The group adjusts itself whenever servers join or leave.

If a server joins the group, it automatically brings itself up to date by fetching the missing state from an existing server. This state is transferred by means of Asynchronous MySQL replication. If a server leaves the group, for instance it was taken down for maintenance, the remaining servers notice that it has left and reconfigure the group automatically. The group membership service described at [Section 17.1.3.1, “Group Membership”](group-replication-group-membership.html "17.1.3.1 Group Membership") powers all of this.
