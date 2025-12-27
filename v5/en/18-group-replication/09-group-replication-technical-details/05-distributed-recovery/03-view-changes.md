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
