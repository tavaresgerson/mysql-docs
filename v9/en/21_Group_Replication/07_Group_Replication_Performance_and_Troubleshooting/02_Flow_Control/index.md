### 20.7.2 Flow Control

20.7.2.1 Probes and Statistics

20.7.2.2 Group Replication Throttling

MySQL Group Replication ensures that a transaction commits only after a majority of the members in a group have received it and agreed on the relative order amongst all transactions sent concurrently. This approach works well if the total number of writes to the group does not exceed the write capacity of any member in the group. If it does, and some members have less write throughput than others—particularly less than the writer members—these members may start lagging behind the writers.

When some members lag behind the rest of the group, reads on such members may externalize very old data. Depending on why the member is lagging behind, other members in the group may have to save more or less of the replication context to be able to fulfil potential data transfer requests from the slow member.

The replication protocol provides a mechanism to avoid having too much distance, in terms of transactions applied, between fast and slow members. This is known as the flow control mechanism, which has the following objectives:

1. To keep members close, to minimize buffering and desynchronization between them

2. To adapt quickly to changing conditions like different workloads or more writers in the group

3. To give each member a share of the available write capacity
4. Not to reduce throughput more than strictly necessary to avoid wasting resources

Given the design of Group Replication, the decision whether to throttle, or not, may be made taking into account two work queues, the certification queue, and the binary log applier queue. Whenever the size of one of these queues exceeds the user-defined threshold, the throttling mechanism is triggered.

Flow control depends on two basic mechanisms:

1. Monitoring of members to collect statistics on throughput and queue sizes of all group members to make educated guesses concerning the maximum write pressure to which each member should be subjected

2. Throttling of members that are trying to write beyond their alloted shares of the available capacity at each moment in time

Note

The Group Replication Flow Control Statistics Component, available as part of MySQL Enterprise Edition, supports status variables providing information on Group Replication flow control execution. See Section 7.5.6.2, “Group Replication Flow Control Statistics Component”, for more information.
