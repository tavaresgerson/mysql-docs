## 17.9 Group Replication Technical Details

This section provides more technical details about MySQL Group Replication.


### 17.9.1 Group Replication Plugin Architecture

MySQL Group Replication is a MySQL plugin and it builds on the existing MySQL replication infrastructure, taking advantage of features such as the binary log, row-based logging, and global transaction identifiers. It integrates with current MySQL frameworks, such as the performance schema or plugin and service infrastructures. The following figure presents a block diagram depicting the overall architecture of MySQL Group Replication.

**Figure 17.9 Group Replication Plugin Block Diagram**

![The text following the figure describes the content of the diagram.](images/gr-plugin-blocks.png)

The MySQL Group Replication plugin includes a set of APIs for capture, apply, and lifecycle, which control how the plugin interacts with MySQL Server. There are interfaces to make information flow from the server to the plugin and vice versa. These interfaces isolate the MySQL Server core from the Group Replication plugin, and are mostly hooks placed in the transaction execution pipeline. In one direction, from server to the plugin, there are notifications for events such as the server starting, the server recovering, the server being ready to accept connections, and the server being about to commit a transaction. In the other direction, the plugin instructs the server to perform actions such as committing or aborting ongoing transactions, or queuing transactions in the relay log.

The next layer of the Group Replication plugin architecture is a set of components that react when a notification is routed to them. The capture component is responsible for keeping track of context related to transactions that are executing. The applier component is responsible for executing remote transactions on the database. The recovery component manages distributed recovery, and is responsible for getting a server that is joining the group up to date by selecting the donor, orchestrating the catch up procedure and reacting to donor failures.

Continuing down the stack, the replication protocol module contains the specific logic of the replication protocol. It handles conflict detection, and receives and propagates transactions to the group.

The final two layers of the Group Replication plugin architecture are the Group Communication System (GCS) API, and an implementation of a Paxos-based group communication engine (XCom). The GCS API is a high level API that abstracts the properties required to build a replicated state machine (see Section 17.1, “Group Replication Background”). It therefore decouples the implementation of the messaging layer from the remaining upper layers of the plugin. The group communication engine handles communications with the members of the replication group.


### 17.9.2 The Group

In MySQL Group Replication, a set of servers forms a replication group. A group has a name, which takes the form of a UUID. The group is dynamic and servers can leave (either voluntarily or involuntarily) and join it at any time. The group adjusts itself whenever servers join or leave.

If a server joins the group, it automatically brings itself up to date by fetching the missing state from an existing server. This state is transferred by means of Asynchronous MySQL replication. If a server leaves the group, for instance it was taken down for maintenance, the remaining servers notice that it has left and reconfigure the group automatically. The group membership service described at Section 17.1.3.1, “Group Membership” powers all of this.


### 17.9.3 Data Manipulation Statements

As there are no primary servers (sources) for any particular data set, every server in the group is allowed to execute transactions at any time, even transactions that change state (RW transactions).

Any server may execute a transaction without any *a priori* coordination. But, at commit time, it coordinates with the rest of the servers in the group to reach a decision on the fate of that transaction. This coordination serves two purposes: (i) check whether the transaction should commit or not; (ii) and propagate the changes so that other servers can apply the transaction as well.

As a transaction is sent through an atomic broadcast, either all servers in the group receive the transaction or none do. If they receive it, then they all receive it in the same order with respect to other transactions that were sent before. Conflict detection is carried out by inspecting and comparing write sets of transactions. Thus, they are detected at the row level. Conflict resolution follows the first committer wins rule. If t1 and t2 execute concurrently at different sites, because t2 is ordered before t1, and both changed the same row, then t2 wins the conflict and t1 aborts. In other words, t1 was trying to change data that had been rendered stale by t2.

Note

If two transactions are bound to conflict more often than not, then it is a good practice to start them on the same server. They then have a chance to synchronize on the local lock manager instead of aborting later in the replication protocol.


### 17.9.4 Data Definition Statements

In a Group Replication topology, care needs to be taken when executing data definition statements also commonly known as data definition language (DDL). Given that MySQL does not support atomic or transactional DDL, one cannot optimistically execute DDL statements and later roll back if needs be. Consequently, the lack of atomicity does not fit directly into the optimistic replication paradigm that Group Replication is based on.

Therefore, more care needs to be taken when replicating data definition statements. Schema changes and changes to the data that the object contains need to be handled through the same server while the schema operation has not yet completed and replicated everywhere. Failure to do so can result in data inconsistency.

Note

If the group is deployed in single-primary mode, then this is not a problem, because all changes are performed through the same server, the primary.

Warning

MySQL DDL execution is not atomic or transactional. The server executes and commits without securing group agreement first. As such, you must route DDL and DML for the same object through the same server, while the DDL is executing and has not replicated everywhere yet.


### 17.9.5 Distributed Recovery

This section describes the process through which a member joining a group catches up with the remaining servers in the group, called distributed recovery. Distributed recovery can be summarized as the process through which a server gets missing transactions from the group so that it can then join the group having processed the same set of transactions as the other group members.


#### 17.9.5.1 Distributed Recovery Basics

Whenever a member joins a replication group, it connects to an existing member to carry out state transfer. The server joining the group transfers all the transactions that took place in the group before it joined, which are provided by the existing member (called the *donor*). Next, the server joining the group applies the transactions that took place in the group while this state transfer was in progress. When the server joining the group has caught up with the remaining servers in the group, it begins to participate normally in the group. This process is called distributed recovery.

##### Phase 1

In the first phase, the server joining the group selects one of the online servers on the group to be the *donor* of the state that it is missing. The donor is responsible for providing the server joining the group all the data it is missing up to the moment it has joined the group. This is achieved by relying on a standard asynchronous replication channel, established between the donor and the server joining the group, see Section 16.2.2, “Replication Channels”. Through this replication channel, the donor's binary logs are replicated until the point that the view change happened when the server joining the group became part of the group. The server joining the group applies the donor's binary logs as it receives them.

While the binary log is being replicated, the server joining the group also caches every transaction that is exchanged within the group. In other words it is listening for transactions that are happening after it joined the group and while it is applying the missing state from the donor. When the first phase ends and the replication channel to the donor is closed, the server joining the group then starts phase two: the catch up.

##### Phase 2

In this phase, the server joining the group proceeds to the execution of the cached transactions. When the number of transactions queued for execution finally reaches zero, the member is declared online.

##### Resilience

The recovery procedure withstands donor failures while the server joining the group is fetching binary logs from it. In such cases, whenever a donor fails during phase 1, the server joining the group fails over to a new donor and resumes from that one. When that happens the server joining the group closes the connection to the failed server joining the group explicitly and opens a connection to a new donor. This happens automatically.


#### 17.9.5.2 Recovering From a Point-in-time

To synchronize the server joining the group with the donor up to a specific point in time, the server joining the group and donor make use of the MySQL Global Transaction Identifiers (GTIDs) mechanism. See Section 16.1.3, “Replication with Global Transaction Identifiers”. However, GTIDS only provide a means to realize which transactions the server joining the group is missing, they do not help marking a specific point in time to which the server joining the group must catch up, nor do they help conveying certification information. This is the job of binary log view markers, which mark view changes in the binary log stream, and also contain additional metadata information, provisioning the server joining the group with missing certification related data.

##### View and View Changes

To explain the concept of view change markers, it is important to understand what a view and a view change are.

A *view* corresponds to a group of members participating actively in the current configuration, in other words at a specific point in time. They are correct and online in the system.

A *view change* occurs when a modification to the group configuration happens, such as a member joining or leaving. Any group membership change results in an independent view change communicated to all members at the same logical point in time.

A *view identifier* uniquely identifies a view. It is generated whenever a view change happens

At the group communication layer, view changes with their associated view ids are then boundaries between the data exchanged before and after a member joins. This concept is implemented through a new binary log event: the"view change log event". The view id thus becomes a marker as well for transactions transmitted before and after changes happen in the group membership.

The view identifier itself is built from two parts: *(i)* one that is randomly generated and *(ii)* a monotonically increasing integer. The first part is generated when the group is created, and remains unchanged while there is at least one member in the group. The second part is incremented every time a view change happens.

The reason for this heterogeneous pair that makes up the view id is the need to unambiguously mark group changes whenever a member joins or leaves but also whenever all members leave the group and no information remains of what view the group was in. In fact, the sole use of monotonic increasing identifiers could lead to the reuse of the same id after full group shutdowns, destroying the uniqueness of the binary log data markers that recovery depends on. To summarize, the first part identifies whenever the group was started from the beginning and the incremental part when the group changed from that point on.


#### 17.9.5.3 View Changes

This section explains the process which controls how the view change identifier is incorporated into a binary log event and written to the log, The following steps are taken:

##### Begin: Stable Group

All servers are online and processing incoming transactions from the group. Some servers may be a little behind in terms of transactions replicated, but eventually they converge. The group acts as one distributed and replicated database.

**Figure 17.10 Stable Group**

![Servers S1, S2, and S3 are members of the group. The most recent item in all of their binary logs is transaction T20.](images/gr-recovery-1.png)

##### View Change: a Member Joins

Whenever a new member joins the group and therefore a view change is performed, every online server queues a view change log event for execution. This is queued because before the view change, several transactions can be queued on the server to be applied and as such, these belong to the old view. Queuing the view change event after them guarantees a correct marking of when this happened.

Meanwhile, the server joining the group selects the donor from the list of online servers as stated by the membership service through the view abstraction. A member joins on view 4 and the online members write a View change event to the binary log.

**Figure 17.11 A Member Joins**

![Server S4 joins the group and looks for a donor. Servers S1, S2, and S3 each queue the view change entry VC4 for their binary logs. Meanwhile, server S1 is receiving new transaction T21.](images/gr-recovery-2.png)

##### State Transfer: Catching Up

Once the server joining the group has chosen which server in the group is to be the donor, a new asynchronous replication connection is established between the two and the state transfer begins (phase 1). This interaction with the donor continues until the server joining the group's applier thread processes the view change log event that corresponds to the view change triggered when the server joining the group came into the group. In other words, the server joining the group replicates from the donor, until it gets to the marker with the view identifier which matches the view marker it is already in.

**Figure 17.12 State Transfer: Catching Up**

![Server S4 has chosen server S2 as the donor. State transfer is executed from server S2 to server S4 until the view change entry VC4 is reached (view_id = VC4). Server S4 uses a temporary applier buffer for state transfer, and its binary log is currently empty.](images/gr-recovery-3.png)

As view identifiers are transmitted to all members in the group at the same logical time, the server joining the group knows at which view identifier it should stop replicating. This avoids complex GTID set calculations because the view id clearly marks which data belongs to each group view.

While the server joining the group is replicating from the donor, it is also caching incoming transactions from the group. Eventually, it stops replicating from the donor and switches to applying those that are cached.

**Figure 17.13 Queued Transactions**

![State transfer is complete. Server S4 has applied the transactions up to T20 and written them to its binary log. Server S4 has cached transaction T21, which arrived after the view change, in a temporary applier buffer while recovering.](images/gr-recovery-4.png)

##### Finish: Caught Up

When the server joining the group recognizes a view change log event with the expected view identifier, the connection to the donor is terminated and it starts applying the cached transactions. An important point to understand is the final recovery procedure. Although it acts as a marker in the binary log, delimiting view changes, the view change log event also plays another role. It conveys the certification information as perceived by all servers when the server joining the group entered the group, in other words the last view change. Without it, the server joining the group would not have the necessary information to be able to certify (detect conflicts) subsequent transactions.

The duration of the catch up (phase 2) is not deterministic, because it depends on the workload and the rate of incoming transactions to the group. This process is completely online and the server joining the group does not block any other server in the group while it is catching up. Therefore the number of transactions the server joining the group is behind when it moves to phase 2 can, for this reason, vary and thus increase or decrease according to the workload.

When the server joining the group reaches zero queued transactions and its stored data is equal to the other members, its public state changes to online.

**Figure 17.14 Instance Online**

![Server S4 is now an online member of the group. It has applied cached transaction T21, so its binary log shows the same items as the binary logs of the other group members, and it no longer needs the temporary applier buffer. New incoming transaction T22 is now received and applied by all group members.](images/gr-recovery-5.png)


#### 17.9.5.4 Usage Advice and Limitations of Distributed Recovery

Distributed recovery does have some limitations. It is based on classic asynchronous replication and as such it may be slow if the server joining the group is not provisioned at all or is provisioned with a very old backup image. This means that if the data to transfer is too big at phase 1, the server may take a very long time to recover. As such, the recommendation is that before adding a server to the group, one should provision it with a fairly recent snapshot of a server already in the group. This minimizes the length of phase 1 and reduces the impact on the donor server, since it has to save and transfer less binary logs.

Warning

It is recommended that a server is provisioned before it is added to a group. That way, one minimizes the time spent on the recovery step.


### 17.9.6 Observability

There is a lot of automation built into the Group Replication plugin. Nonetheless, you might sometimes need to understand what is happening behind the scenes. This is where the instrumentation of Group Replication and Performance Schema becomes important. The entire state of the system (including the view, conflict statistics and service states) can be queried through performance\_schema tables. The distributed nature of the replication protocol and the fact that server instances agree and thus synchronize on transactions and metadata makes it simpler to inspect the state of the group. For example, you can connect to a single server in the group and obtain both local and global information by issuing select statements on the Group Replication related Performance Schema tables. For more information, see Section 17.4, “Monitoring Group Replication”.


### 17.9.7 Group Replication Performance

This section explains how to use the available configuration options to gain the best performance from your group.


#### 17.9.7.1 Fine Tuning the Group Communication Thread

The group communication thread (GCT) runs in a loop while the Group Replication plugin is loaded. The GCT receives messages from the group and from the plugin, handles quorum and failure detection related tasks, sends out some keep alive messages and also handles the incoming and outgoing transactions from/to the server/group. The GCT waits for incoming messages in a queue. When there are no messages, the GCT waits. By configuring this wait to be a little longer (doing an active wait) before actually going to sleep can prove to be beneficial in some cases. This is because the alternative is for the operating system to switch out the GCT from the processor and do a context switch.

To force the GCT do an active wait, use the `group_replication_poll_spin_loops` option, which makes the GCT loop, doing nothing relevant for the configured number of loops, before actually polling the queue for the next message.

For example:

```sql
mysql> SET GLOBAL group_replication_poll_spin_loops= 10000;
```


#### 17.9.7.2 Message Compression

For messages sent between online group members, Group Replication enables message compression by default. Whether a specific message is compressed depends on the threshold that you configure using the `group_replication_compression_threshold` system variable. Messages that have a payload larger than the specified number of bytes are compressed.

The default compression threshold is 1000000 bytes. You could use the following statements to increase the compression threshold to 2MB, for example:

```sql
STOP GROUP_REPLICATION;
SET GLOBAL group_replication_compression_threshold = 2097152;
START GROUP_REPLICATION;
```

If you set `group_replication_compression_threshold` to zero, message compression is disabled.

Group Replication uses the LZ4 compression algorithm to compress messages sent in the group. Note that the maximum supported input size for the LZ4 compression algorithm is 2113929216 bytes. This limit is lower than the maximum possible value for the `group_replication_compression_threshold` system variable, which is matched to the maximum message size accepted by XCom. The LZ4 maximum input size is therefore a practical limit for message compression, and transactions above this size cannot be committed when message compression is enabled. With the LZ4 compression algorithm, do not set a value greater than 2113929216 bytes for `group_replication_compression_threshold`.

The value of `group_replication_compression_threshold` is not required by Group Replication to be the same on all group members. However, it is advisable to set the same value on all group members in order to avoid unnecessary rollback of transactions, failure of message delivery, or failure of message recovery.

Compression for messages sent in the group happens at the group communication engine level, before the data is handed over to the group communication thread, so it takes place within the context of the `mysql` user session thread. If the message payload size exceeds the threshold set by `group_replication_compression_threshold`, the transaction payload is compressed before being sent out to the group, and decompressed when it is received. Upon receiving a message, the member checks the message envelope to verify whether it is compressed or not. If needed, then the member decompresses the transaction, before delivering it to the upper layer. This process is shown in the following figure.

**Figure 17.15 Compression Support**

![The MySQL Group Replication plugin architecture is shown as described in an earlier topic, with the five layers of the plugin positioned between the MySQL server and the replication group. Compression and decompression are handled by the Group Communication System API, which is the fourth layer of the Group Replication plugin. The group communication engine (the fifth layer of the plugin) and the group members use the compressed transactions with the smaller data size. The MySQL Server core and the three higher layers of the Group Replication plugin (the APIs, the capture, applier, and recovery components, and the replication protocol module) use the original transactions with the larger data size.](images/gr-compress-decompress.png)

When network bandwidth is a bottleneck, message compression can provide up to 30-40% throughput improvement at the group communication level. This is especially important within the context of large groups of servers under load. The TCP peer-to-peer nature of the interconnections between *N* participants in the group makes the sender send the same amount of data *N* times. Furthermore, binary logs are likely to exhibit a high compression ratio. This makes compression a compelling feature for Group Replication workloads that contain large transactions.


#### 17.9.7.3 Flow Control

Group Replication ensures that a transaction only commits after a majority of the members in a group have received it and agreed on the relative order between all transactions that were sent concurrently.

This approach works well if the total number of writes to the group does not exceed the write capacity of any member in the group. If it does and some of the members have less write throughput than others, particularly less than the writer members, those members can start lagging behind of the writers.

Having some members lagging behind the group brings some problematic consequences, particularly, the reads on such members may externalize very old data. Depending on why the member is lagging behind, other members in the group may have to save more or less replication context to be able to fulfil potential data transfer requests from the slow member.

There is however a mechanism in the replication protocol to avoid having too much distance, in terms of transactions applied, between fast and slow members. This is known as the flow control mechanism. It tries to address several goals:

1. to keep the members close enough to make buffering and de-synchronization between members a small problem;

2. to adapt quickly to changing conditions like different workloads or more writers in the group;

3. to give each member a fair share of the available write capacity;

4. to not reduce throughput more than strictly necessary to avoid wasting resources.

Given the design of Group Replication, the decision whether to throttle or not may be decided taking into account two work queues: *(i)* the *certification* queue; *(ii)* and on the binary log *applier* queue. Whenever the size of one of these queues exceeds the user-defined threshold, the throttling mechanism is triggered. Only configure: *(i)* whether to do flow control at the certifier or at the applier level, or both; and *(ii)* what is the threshold for each queue.

The flow control depends on two basic mechanisms:

1. the monitoring of members to collect some statistics on throughput and queue sizes of all group members to make educated guesses on what is the maximum write pressure each member should be subjected to;

2. the throttling of members that are trying to write beyond their fair-share of the available capacity at each moment in time.

##### 17.9.7.3.1 Probes and Statistics

The monitoring mechanism works by having each member deploying a set of probes to collect information about its work queues and throughput. It then propagates that information to the group periodically to share that data with the other members.

Such probes are scattered throughout the plugin stack and allow one to establish metrics, such as:

* the certifier queue size;
* the replication applier queue size;
* the total number of transactions certified;
* the total number of remote transactions applied in the member;

* the total number of local transactions.

Once a member receives a message with statistics from another member, it calculates additional metrics regarding how many transactions were certified, applied and locally executed in the last monitoring period.

Monitoring data is shared with others in the group periodically. The monitoring period must be high enough to allow the other members to decide on the current write requests, but low enough that it has minimal impact on group bandwidth. The information is shared every second, and this period is sufficient to address both concerns.

##### 17.9.7.3.2 Group Replication Throttling

Based on the metrics gathered across all servers in the group, a throttling mechanism kicks in and decides whether to limit the rate a member is able to execute/commit new transactions.

Therefore, metrics acquired from all members are the basis for calculating the capacity of each member: if a member has a large queue (for certification or the applier thread), then the capacity to execute new transactions should be close to ones certified or applied in the last period.

The lowest capacity of all the members in the group determines the real capacity of the group, while the number of local transactions determines how many members are writing to it, and, consequently, how many members should that available capacity be shared with.

This means that every member has an established write quota based on the available capacity, in other words a number of transactions it can safely issue for the next period. The writer quota is enforced by the throttling mechanism if the queue size of the certifier or the binary log applier exceeds a user defined threshold.

The quota is reduced by the number of transactions that were delayed in the last period, and then also further reduced by 10% to allow the queue that triggered the problem to reduce its size. In order to avoid large jumps in throughput once the queue size goes beyond the threshold, the throughput is only allowed to grow by the same 10% per period after that.

The current throttling mechanism does not penalize transactions below quota, but delays finishing those transactions that exceed it until the end of the monitoring period. As a consequence, if the quota is very small for the write requests issued some transactions may have latencies close to the monitoring period.
