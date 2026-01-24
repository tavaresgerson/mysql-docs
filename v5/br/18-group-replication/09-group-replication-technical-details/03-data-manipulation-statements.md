### 17.9.3 Data Manipulation Statements

As there are no primary servers (sources) for any particular data set, every server in the group is allowed to execute transactions at any time, even transactions that change state (RW transactions).

Any server may execute a transaction without any *a priori* coordination. But, at commit time, it coordinates with the rest of the servers in the group to reach a decision on the fate of that transaction. This coordination serves two purposes: (i) check whether the transaction should commit or not; (ii) and propagate the changes so that other servers can apply the transaction as well.

As a transaction is sent through an atomic broadcast, either all servers in the group receive the transaction or none do. If they receive it, then they all receive it in the same order with respect to other transactions that were sent before. Conflict detection is carried out by inspecting and comparing write sets of transactions. Thus, they are detected at the row level. Conflict resolution follows the first committer wins rule. If t1 and t2 execute concurrently at different sites, because t2 is ordered before t1, and both changed the same row, then t2 wins the conflict and t1 aborts. In other words, t1 was trying to change data that had been rendered stale by t2.

Note

If two transactions are bound to conflict more often than not, then it is a good practice to start them on the same server. They then have a chance to synchronize on the local lock manager instead of aborting later in the replication protocol.
