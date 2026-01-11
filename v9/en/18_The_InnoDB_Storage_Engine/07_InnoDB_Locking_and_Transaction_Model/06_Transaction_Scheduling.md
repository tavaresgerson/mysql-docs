### 17.7.6 Transaction Scheduling

`InnoDB` uses the Contention-Aware Transaction Scheduling (CATS) algorithm to prioritize transactions that are waiting for locks. When multiple transactions are waiting for a lock on the same object, the CATS algorithm determines which transaction receives the lock first.

The CATS algorithm prioritizes waiting transactions by assigning a scheduling weight, which is computed based on the number of transactions that a transaction blocks. For example, if two transactions are waiting for a lock on the same object, the transaction that blocks the most transactions is assigned a greater scheduling weight. If weights are equal, priority is given to the longest waiting transaction.

You can view transaction scheduling weights by querying the `TRX_SCHEDULE_WEIGHT` column in the Information Schema `INNODB_TRX` table. Weights are computed for waiting transactions only. Waiting transactions are those in a `LOCK WAIT` transaction execution state, as reported by the `TRX_STATE` column. A transaction that is not waiting for a lock reports a NULL `TRX_SCHEDULE_WEIGHT` value.

`INNODB_METRICS` counters are provided for monitoring of code-level transaction scheduling events. For information about using `INNODB_METRICS` counters, see Section 17.15.6, “InnoDB INFORMATION\_SCHEMA Metrics Table”.

* `lock_rec_release_attempts`

  The number of attempts to release record locks. A single attempt may lead to zero or more record locks being released, as there may be zero or more record locks in a single structure.

* `lock_rec_grant_attempts`

  The number of attempts to grant record locks. A single attempt may result in zero or more record locks being granted.

* `lock_schedule_refreshes`

  The number of times the wait-for graph was analyzed to update the scheduled transaction weights.
