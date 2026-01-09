#### 29.12.11.14 The replication_group_communication_information Table

This table shows group configuration options for the whole replication group. The table is available only when Group Replication is installed.

The `replication_group_communication_information` table has these columns:

* `WRITE_CONCURRENCY`

  The maximum number of consensus instances that the group can execute in parallel. The default value is 10. See Section 20.5.1.3, “Using Group Replication Group Write Consensus”.

* `PROTOCOL_VERSION`

  The Group Replication communication protocol version, which determines what messaging capabilities are used. This is set to accommodate the oldest MySQL Server version that you want the group to support. See Section 20.5.1.4, “Setting a Group's Communication Protocol Version”.

* `WRITE_CONSENSUS_LEADERS_PREFERRED`

  The leader or leaders that Group Replication has instructed the group communication engine to use to drive consensus. For a group in single-primary mode with the `group_replication_paxos_single_leader` system variable set to `ON` and the communication protocol version set to 8.0.27 or later, the single consensus leader is the group's primary. Otherwise, all group members are used as leaders, so they are all shown here. See Section 20.7.3, “Single Consensus Leader”.

* `WRITE_CONSENSUS_LEADERS_ACTUAL`

  The actual leader or leader that the group communication engine is using to drive consensus. If a single consensus leader is in use for the group, and the primary is currently unhealthy, the group communication selects an alternative consensus leader. In this situation, the group member specified here can differ from the preferred group member.

* `WRITE_CONSENSUS_SINGLE_LEADER_CAPABLE`

  Whether the replication group is capable of using a single consensus leader. 1 means that the group was started with the use of a single leader enabled (`group_replication_paxos_single_leader = ON`), and this is still shown if the value of `group_replication_paxos_single_leader` has since been changed on this group member. 0 means that the group was started with single leader mode disabled (`group_replication_paxos_single_leader = OFF`), or has a Group Replication communication protocol version that does not support the use of a single consensus leader (prior to 8.0.27). This information is only returned for group members in `ONLINE` or `RECOVERING` state.

* `MEMBER_FAILURE_SUSPICIONS_COUNT`

  The address of each group member paired with the number of times this member has been seen as suspect by the local node. This information is displayed in JSON format. For a group with three members, the value of this column should appear similar to what is shown here:

  ```
  {
    "d57da302-e404-4395-83b5-ff7cf9b7e055": 0,
    "6ace9d39-a093-4fe0-b24d-bacbaa34c339": 10,
    "9689c7c5-c71c-402a-a3a1-2f57bfc2ca62": 0
  }
  ```

The `replication_group_communication_information` table has no indexes.

`TRUNCATE TABLE` is not permitted for the `replication_group_communication_information` table.
