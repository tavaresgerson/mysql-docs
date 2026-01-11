## 17.7 InnoDB Locking and Transaction Model

17.7.1 InnoDB Locking

17.7.2 InnoDB Transaction Model

17.7.3 Locks Set by Different SQL Statements in InnoDB

17.7.4 Phantom Rows

17.7.5 Deadlocks in InnoDB

17.7.6 Transaction Scheduling

To implement a large-scale, busy, or highly reliable database application, to port substantial code from a different database system, or to tune MySQL performance, it is important to understand `InnoDB` locking and the `InnoDB` transaction model.

This section discusses several topics related to `InnoDB` locking and the `InnoDB` transaction model with which you should be familiar.

* Section 17.7.1, “InnoDB Locking” describes lock types used by `InnoDB`.

* Section 17.7.2, “InnoDB Transaction Model” describes transaction isolation levels and the locking strategies used by each. It also discusses the use of `autocommit`, consistent non-locking reads, and locking reads.

* Section 17.7.3, “Locks Set by Different SQL Statements in InnoDB” discusses specific types of locks set in `InnoDB` for various statements.

* Section 17.7.4, “Phantom Rows” describes how `InnoDB` uses next-key locking to avoid phantom rows.

* Section 17.7.5, “Deadlocks in InnoDB” provides a deadlock example, discusses deadlock detection, and provides tips for minimizing and handling deadlocks in `InnoDB`.
