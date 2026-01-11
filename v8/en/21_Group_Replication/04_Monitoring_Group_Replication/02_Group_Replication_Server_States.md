### 20.4.2 Group Replication Server States

The state of a Group Replication group member shows its current role in the group. The Performance Schema table `replication_group_members` shows the state for each member in a group. If the group is fully functional and all members are communicating properly, all members report the same state for all other members. However, a member that has left the group or is part of a network partition cannot report accurate information on the other servers. In this situation, the member does not attempt to guess the status of the other servers, and instead reports them as unreachable.

A group member can be in the following states:

`ONLINE` :   The server is an active member of a group and in a fully functioning state. Other group members can connect to it, as can clients if applicable. A member is only fully synchronized with the group, and participating in it, when it is in the `ONLINE` state.

`RECOVERING` :   The server has joined a group and is in the process of becoming an active member. Distributed recovery is currently taking place, where the member is receiving state transfer from a donor using a remote cloning operation or the donor's binary log. This state is

    For more information, see Section 20.5.4, “Distributed Recovery”.

`OFFLINE` :   The Group Replication plugin is loaded but the member does not belong to any group. This status may briefly occur while a member is joining or rejoining a group.

`ERROR` :   The member is in an error state and is not functioning correctly as a group member. A member can enter error state either while applying transactions or during the recovery phase. A member in this state does not participate in the group's transactions. For more information on possible reasons for error states, see Section 20.7.7, “Responses to Failure Detection and Network Partitioning”.

    Depending on the exit action set by `group_replication_exit_state_action`, the member is in read-only mode (`super_read_only=ON`) and could also be in offline mode (`offline_mode=ON`). Note that a server in offline mode following the `OFFLINE_MODE` exit action is displayed with `ERROR` status, not `OFFLINE`. A server with the exit action `ABORT_SERVER` shuts down and is removed from the view of the group. For more information, see Section 20.7.7.4, “Exit Action”.

    While a member is joining or rejoining a replication group, its status can be displayed as `ERROR` before the group completes the compatibility checks and accepts it as a member.

`UNREACHABLE` :   The local failure detector suspects that the member cannot be contacted, because the group's messages are timing out. This can happen if a member is disconnected involuntarily, for example. If you see this status for other servers, it can also mean that the member where you query this table is part of a partition, where a subset of the group's servers can contact each other but cannot contact the other servers in the group. For more information, see Section 20.7.8, “Handling a Network Partition and Loss of Quorum”.

See Section 20.4.3, “The replication_group_members Table” for an example of the Performance Schema table contents.
