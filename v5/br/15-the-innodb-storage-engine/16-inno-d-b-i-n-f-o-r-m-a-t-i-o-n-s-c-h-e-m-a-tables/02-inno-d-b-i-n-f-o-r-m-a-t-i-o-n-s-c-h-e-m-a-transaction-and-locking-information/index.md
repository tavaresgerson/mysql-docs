### 14.16.2 InnoDB INFORMATION_SCHEMA Transaction and Locking Information

14.16.2.1 Using InnoDB Transaction and Locking Information

14.16.2.2 InnoDB Lock and Lock-Wait Information

14.16.2.3 Persistence and Consistency of InnoDB Transaction and Locking Information

Three `InnoDB` `INFORMATION_SCHEMA` tables enable you to monitor transactions and diagnose potential locking problems:

* `INNODB_TRX`: Provides information about every transaction currently executing inside `InnoDB`, including the transaction state (for example, whether it is running or waiting for a lock), when the transaction started, and the particular SQL statement the transaction is executing.

* `INNODB_LOCKS`: Each transaction in InnoDB that is waiting for another transaction to release a lock (`INNODB_TRX.TRX_STATE` is `LOCK WAIT`) is blocked by exactly one blocking lock request. That blocking lock request is for a row or table lock held by another transaction in an incompatible mode. A lock that blocks a transaction is always held in a mode incompatible with the mode of requested lock (read vs. write, shared vs. exclusive). The blocked transaction cannot proceed until the other transaction commits or rolls back, thereby releasing the requested lock. For every blocked transaction, `INNODB_LOCKS` contains one row that describes each lock the transaction has requested, and for which it is waiting. `INNODB_LOCKS` also contains one row for each lock that is blocking another transaction, whatever the state of the transaction that holds the lock (`INNODB_TRX.TRX_STATE` is `RUNNING`, `LOCK WAIT`, `ROLLING BACK` or `COMMITTING`).

* `INNODB_LOCK_WAITS`: This table indicates which transactions are waiting for a given lock, or for which lock a given transaction is waiting. This table contains one or more rows for each blocked transaction, indicating the lock it has requested and any locks that are blocking that request. The `REQUESTED_LOCK_ID` value refers to the lock requested by a transaction, and the `BLOCKING_LOCK_ID` value refers to the lock (held by another transaction) that prevents the first transaction from proceeding. For any given blocked transaction, all rows in `INNODB_LOCK_WAITS` have the same value for `REQUESTED_LOCK_ID` and different values for `BLOCKING_LOCK_ID`.

For more information about the preceding tables, see Section 24.4.28, “The INFORMATION_SCHEMA INNODB_TRX Table”, Section 24.4.14, “The INFORMATION_SCHEMA INNODB_LOCKS Table”, and Section 24.4.15, “The INFORMATION_SCHEMA INNODB_LOCK_WAITS Table”.
