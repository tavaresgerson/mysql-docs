#### 17.9.5.1 Distributed Recovery Basics

Whenever a member joins a replication group, it connects to an existing member to carry out state transfer. The server joining the group transfers all the transactions that took place in the group before it joined, which are provided by the existing member (called the *donor*). Next, the server joining the group applies the transactions that took place in the group while this state transfer was in progress. When the server joining the group has caught up with the remaining servers in the group, it begins to participate normally in the group. This process is called distributed recovery.

##### Phase 1

In the first phase, the server joining the group selects one of the online servers on the group to be the *donor* of the state that it is missing. The donor is responsible for providing the server joining the group all the data it is missing up to the moment it has joined the group. This is achieved by relying on a standard asynchronous replication channel, established between the donor and the server joining the group, see [Section 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels"). Through this replication channel, the donor's binary logs are replicated until the point that the view change happened when the server joining the group became part of the group. The server joining the group applies the donor's binary logs as it receives them.

While the binary log is being replicated, the server joining the group also caches every transaction that is exchanged within the group. In other words it is listening for transactions that are happening after it joined the group and while it is applying the missing state from the donor. When the first phase ends and the replication channel to the donor is closed, the server joining the group then starts phase two: the catch up.

##### Phase 2

In this phase, the server joining the group proceeds to the execution of the cached transactions. When the number of transactions queued for execution finally reaches zero, the member is declared online.

##### Resilience

The recovery procedure withstands donor failures while the server joining the group is fetching binary logs from it. In such cases, whenever a donor fails during phase 1, the server joining the group fails over to a new donor and resumes from that one. When that happens the server joining the group closes the connection to the failed server joining the group explicitly and opens a connection to a new donor. This happens automatically.
