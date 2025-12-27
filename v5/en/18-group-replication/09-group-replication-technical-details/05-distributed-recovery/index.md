### 17.9.5 Distributed Recovery

[17.9.5.1 Distributed Recovery Basics](group-replication-distributed-recovery-basics.html)

[17.9.5.2 Recovering From a Point-in-time](group-replication-recovering-from-a-point-in-time.html)

[17.9.5.3 View Changes](group-replication-view-changes.html)

[17.9.5.4 Usage Advice and Limitations of Distributed Recovery](group-replication-usage-advice-and-limitations-of-distributed-recovery.html)

This section describes the process through which a member joining a group catches up with the remaining servers in the group, called distributed recovery. Distributed recovery can be summarized as the process through which a server gets missing transactions from the group so that it can then join the group having processed the same set of transactions as the other group members.
