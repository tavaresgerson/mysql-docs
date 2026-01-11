#### 20.1.3.1 Single-Primary Mode

In single-primary mode (`group_replication_single_primary_mode=ON`) the group has a single primary server that is set to read/write mode. All the other members in the group are set to read-only mode (with `super_read_only=ON`). The primary typically bootstraps the entire group. All other servers that join the group learn about the primary server and are automatically set to read-only mode.

In single-primary mode, Group Replication enforces that only a single server writes to the group, so compared to multi-primary mode, consistency checking can be less strict and DDL statements do not need to be handled with any extra care. The option `group_replication_enforce_update_everywhere_checks` enables or disables strict consistency checks for a group. When deploying in single-primary mode, or changing the group to single-primary mode, this system variable must be set to `OFF`.

The member that is designated as the primary server can change in the following ways:

* If the existing primary leaves the group, whether voluntarily or unexpectedly, a new primary is elected automatically.

* You can appoint a specific member as the new primary using the `group_replication_set_as_primary()` function.

* If you use the `group_replication_switch_to_single_primary_mode()` function to change a group that was running in multi-primary mode to run in single-primary mode, a new primary is elected automatically, or you can appoint the new primary by specifying it with the function.

These functions can be used only when all group members are running MySQL 8.0.13 or later.

When a new primary server is elected (automatically or manually), it is automatically set to read/write, and the other group members remain as secondaries, and as such, read-only. The following diagram shows this process:

**Figure 20.4 New Primary Election**

![Five server instances, S1, S2, S3, S4, and S5, are deployed as an interconnected group. Server S1 is the primary. Write clients are communicating with server S1, and a read client is communicating with server S4. Server S1 then fails, breaking communication with the write clients. Server S2 then takes over as the new primary, and the write clients now communicate with server S2.](images/single-primary-election.png)

When a new primary is chosen, it might have a backlog of changes that had been applied on the old primary but have not yet been applied on the new one. In this case, until the new primary catches up with the old one, read/write transactions might result in conflicts and be rolled back, and read-only transactions might result in stale reads. The Group Replication flow control mechanism minimizes the difference between fast and slow members, and so reduces the chances of this happening if it is activated and properly tuned. For more information on flow control, see Section 20.7.2, “Flow Control”. In MySQL 8.0.14 and later, you can also use the `group_replication_consistency` system variable to set the group's level of transaction consistency to prevent this issue. Setting this variable to `BEFORE_ON_PRIMARY_FAILOVER` (the default) or any higher consistency level holds new transactions on a newly elected primary until the backlog has been applied.

For more information on transaction consistency, see Section 20.5.3, “Transaction Consistency Guarantees”. If flow control and transaction consistency guarantees are not used for a group, it is a good practice to wait for the new primary to apply its replication-related relay log before re-routing client applications to it.

##### 20.1.3.1.1 Primary Election Algorithm

The automatic primary member election process involves each member looking at the new view of the group, ordering the potential new primary members, and choosing the member that qualifies as the most suitable. Each member makes its own decision locally, following the primary election algorithm in its MySQL Server release. Because all members must reach the same decision, members adapt their primary election algorithm if other group members are running lower MySQL Server versions, so that they have the same behavior as the member with the lowest MySQL Server version in the group.

The factors considered by members when electing a primary, in order, are as follows:

1. The first factor considered is which member or members are running the lowest MySQL Server version. If all group members are running MySQL 8.0.17 or higher, members are first ordered by the patch version of their release. If any members are running MySQL 5.7, or MySQL 8.0.16 or earlier, members are first ordered by the major version of their release, and the patch version is ignored.

2. If more than one member is running the lowest MySQL Server version, the second factor considered is the member weight of each of those members, as specified by the `group_replication_member_weight` system variable on the member. If any member of the group is running MySQL Server 5.7, where this system variable was not available, this factor is ignored.

   The `group_replication_member_weight` system variable specifies a number in the range 0-100. All members default to a weight of 50, so set a weight below this to lower their ordering, and a weight above it to increase their ordering. You can use this weighting function to prioritize the use of better hardware or to ensure failover to a specific member during scheduled maintenance of the primary.

3. If more than one member is running the lowest MySQL Server version, and more than one of those members has the highest member weight (or member weighting is being ignored), the third factor considered is the lexicographical order of the generated server UUIDs of each member, as specified by the `server_uuid` system variable. The member with the lowest server UUID is chosen as the primary. This factor acts as a guaranteed and predictable tie-breaker so that all group members reach the same decision if it cannot be determined by any important factors.

##### 20.1.3.1.2 Finding the Primary

To find out which server is currently the primary when deployed in single-primary mode, use the `MEMBER_ROLE` column in the `performance_schema.replication_group_members` table. For example:

```
mysql> SELECT MEMBER_HOST, MEMBER_ROLE FROM performance_schema.replication_group_members;
+-------------------------+-------------+
| MEMBER_HOST             | MEMBER_ROLE |
+-------------------------+-------------+
| remote1.example.com     | PRIMARY     |
| remote2.example.com     | SECONDARY   |
| remote3.example.com     | SECONDARY   |
+-------------------------+-------------+
```

Warning

The `group_replication_primary_member` status variable has been deprecated; expect it to be removed in a future version.

Alternatively use the `group_replication_primary_member` status variable, like this:

```
mysql> SHOW STATUS LIKE 'group_replication_primary_member'
```
