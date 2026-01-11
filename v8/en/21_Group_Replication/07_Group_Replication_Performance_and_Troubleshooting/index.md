## 20.7 Group Replication Performance and Troubleshooting

20.7.1 Fine Tuning the Group Communication Thread

20.7.2 Flow Control

20.7.3 Single Consensus Leader

20.7.4 Message Compression

20.7.5 Message Fragmentation

20.7.6 XCom Cache Management

20.7.7 Responses to Failure Detection and Network Partitioning

20.7.8 Handling a Network Partition and Loss of Quorum

20.7.9 Monitoring Group Replication Memory Usage with Performance Schema Memory Instrumentation

Group Replication is designed to create fault-tolerant systems with built-in failure detection and automated recovery. If a member server instance leaves voluntarily or stops communicating with the group, the remaining members agree a reconfiguration of the group between themselves, and choose a new primary if needed. Expelled members automatically attempt to rejoin the group, and are brought up to date by distributed recovery. If a group experiences a level of difficulties such that it cannot contact a majority of its members in order to agree on a decision, it identifies itself as having lost quorum and stops processing transactions. Group Replication also has built-in mechanisms and settings to help the group adapt to and manage variations in workload and message size, and stay within the limitations of the underlying system and networking resources.

The default settings for Group Replication’s system variables are designed to maximize a group’s performance and autonomy. The information in this section is to help you configure a replication group to optimize the automatic handling of any recurring issues that you experience on your particular systems, such as transient network outages or workloads and transactions that exceed a server instance’s resources.

If you find that group members are being expelled and rejoining the group more frequently than you would like, it is possible that Group Replication’s default failure detection settings are too sensitive for your system. This might be the case on slower networks or machines, networks with a high rate of unexpected transient outages, or during planned network outages. For advice on dealing with that situation by adjusting the settings, see Section 20.7.7, “Responses to Failure Detection and Network Partitioning”.

You should only need to intervene manually in a Group Replication setup if something happens that the group cannot deal with automatically. Some key issues that can require administrator intervention are when a member is in `ERROR` status and cannot rejoin the group, or when a network partition causes the group to lose quorum.

* If an otherwise correctly functioning and configured member is unable to join or rejoin the group using distributed recovery, and remains in `ERROR` status, Section 20.5.4.4, “Fault Tolerance for Distributed Recovery”, explains the possible issues. One likely cause is that the joining member has extra transactions that are not present on the existing members of the group. For advice on dealing with that situation, see Section 20.4.1, “GTIDs and Group Replication”.

* If a group has lost quorum, this may be due to a network partition that divides the group into two parts, or possibly due to the failure of the majority of the servers. For advice on dealing with that situation, see Section 20.7.8, “Handling a Network Partition and Loss of Quorum”.
