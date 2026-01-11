### 20.7.3 Single Consensus Leader

By default, the group communication engine for Group Replication (XCom, a Paxos variant) operates using every member of the replication group as a leader. From MySQL 8.0.27, the group communication engine can use a single leader to drive consensus when the group is in single-primary mode. Operating with a single consensus leader improves performance and resilience in single-primary mode, particularly when some of the group’s secondary members are currently unreachable.

To use a single consensus leader, the group must be configured as follows:

* The group must be in single-primary mode.
* The `group_replication_paxos_single_leader` system variable must be set to `ON`. With the default setting `OFF`, the behavior is disabled. You must carry out a full reboot of the replication group (bootstrap) for Group Replication to pick up a change to this setting.

* The Group Replication communication protocol version must be set to 8.0.27 or later. Use the `group_replication_get_communication_protocol()` function to view the group's communication protocol version. If a lower version is in use, the group cannot use this behavior. You can use the `group_replication_set_communication_protocol()` function to set the group's communication protocol to a higher version if all group members support it. MySQL InnoDB Cluster manages the communication protocol version automatically. For more information, see Section 20.5.1.4, “Setting a Group's Communication Protocol Version”.

When this configuration is in place, Group Replication instructs the group communication engine to use the group’s primary as the single leader to drive consensus. When a new primary is elected, Group Replication tells the group communication engine to use it instead. If the primary is currently unhealthy, the group communication engine uses an alternative member as the consensus leader. The Performance Schema table `replication_group_communication_information` shows the current preferred and actual consensus leader, with the preferred leader being Group Replication’s choice, and the actual leader being the one selected by the group communication engine.

If the group is in multi-primary mode, has a lower communication protocol version, or the behavior is disabled by the `group_replication_paxos_single_leader` setting, all members are used as leaders to drive consensus. In this situation, the Performance Schema table `replication_group_communication_information` shows all of the members as both the preferred and actual leaders.

The `WRITE_CONSENSUS_SINGLE_LEADER_CAPABLE` column of the Performance Schema table `replication_group_communication_information` table shows whether the group supports the use of a single leader, even if `group_replication_paxos_single_leader` is currently set to `OFF` on the queried member. The column value is 1 if the group was started with `group_replication_paxos_single_leader` set to `ON`, and its communication protocol version is MySQL 8.0.27 or above. This information is only returned for group members in `ONLINE` or `RECOVERING` state.
