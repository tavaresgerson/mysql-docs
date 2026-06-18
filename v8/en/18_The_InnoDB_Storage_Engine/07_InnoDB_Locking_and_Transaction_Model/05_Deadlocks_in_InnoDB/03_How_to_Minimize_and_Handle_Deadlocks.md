#### 17.7.5.3 How to Minimize and Handle Deadlocks

This section builds on the conceptual information about
deadlocks in [Section 17.7.5.2, “Deadlock Detection”](innodb-deadlock-detection.html "17.7.5.2 Deadlock Detection"). It
explains how to organize database operations to minimize
deadlocks and the subsequent error handling required in
applications.

[Deadlocks](glossary.html#glos_deadlock "deadlock") are a classic
problem in transactional databases, but they are not dangerous
unless they are so frequent that you cannot run certain
transactions at all. Normally, you must write your applications
so that they are always prepared to re-issue a transaction if it
gets rolled back because of a deadlock.

`InnoDB` uses automatic row-level locking. You
can get deadlocks even in the case of transactions that just
insert or delete a single row. That is because these operations
are not really “atomic”; they automatically set
locks on the (possibly several) index records of the row
inserted or deleted.

You can cope with deadlocks and reduce the likelihood of their
occurrence with the following techniques:

* At any time, issue
  [`SHOW ENGINE
  INNODB STATUS`](show-engine.html "15.7.7.15 SHOW ENGINE Statement") to determine the cause of the most
  recent deadlock. That can help you to tune your application
  to avoid deadlocks.

* If frequent deadlock warnings cause concern, collect more
  extensive debugging information by enabling the
  [`innodb_print_all_deadlocks`](innodb-parameters.html#sysvar_innodb_print_all_deadlocks)
  variable. Information about each deadlock, not just the
  latest one, is recorded in the MySQL
  [error log](glossary.html#glos_error_log "error log"). Disable
  this option when you are finished debugging.

* Always be prepared to re-issue a transaction if it fails due
  to deadlock. Deadlocks are not dangerous. Just try again.

* Keep transactions small and short in duration to make them
  less prone to collision.

* Commit transactions immediately after making a set of
  related changes to make them less prone to collision. In
  particular, do not leave an interactive
  [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") session open for a long time with
  an uncommitted transaction.

* If you use [locking
  reads](glossary.html#glos_locking_read "locking read") ([`SELECT
  ... FOR UPDATE`](select.html "15.2.13 SELECT Statement") or
  [`SELECT ... FOR
  SHARE`](select.html "15.2.13 SELECT Statement")), try using a lower isolation level such as
  [`READ COMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-committed).

* When modifying multiple tables within a transaction, or
  different sets of rows in the same table, do those
  operations in a consistent order each time. Then
  transactions form well-defined queues and do not deadlock.
  For example, organize database operations into functions
  within your application, or call stored routines, rather
  than coding multiple similar sequences of
  `INSERT`, `UPDATE`, and
  `DELETE` statements in different places.

* Add well-chosen indexes to your tables so that your queries
  scan fewer index records and set fewer locks. Use
  [`EXPLAIN
  SELECT`](explain.html "15.8.2 EXPLAIN Statement") to determine which indexes the MySQL server
  regards as the most appropriate for your queries.

* Use less locking. If you can afford to permit a
  [`SELECT`](select.html "15.2.13 SELECT Statement") to return data from an
  old snapshot, do not add a `FOR UPDATE` or
  `FOR SHARE` clause to it. Using the
  [`READ COMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-committed) isolation
  level is good here, because each consistent read within the
  same transaction reads from its own fresh snapshot.

* If nothing else helps, serialize your transactions with
  table-level locks. The correct way to use
  [`LOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") with
  transactional tables, such as `InnoDB`
  tables, is to begin a transaction with `SET
  autocommit = 0` (not
  [`START
  TRANSACTION`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")) followed by [`LOCK
  TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements"), and to not call
  [`UNLOCK
  TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") until you commit the transaction
  explicitly. For example, if you need to write to table
  `t1` and read from table
  `t2`, you can do this:

  ```
  SET autocommit=0;
  LOCK TABLES t1 WRITE, t2 READ, ...;
  ... do something with tables t1 and t2 here ...
  COMMIT;
  UNLOCK TABLES;
  ```

  Table-level locks prevent concurrent updates to the table,
  avoiding deadlocks at the expense of less responsiveness for
  a busy system.

* Another way to serialize transactions is to create an
  auxiliary “semaphore” table that contains just
  a single row. Have each transaction update that row before
  accessing other tables. In that way, all transactions happen
  in a serial fashion. Note that the `InnoDB`
  instant deadlock detection algorithm also works in this
  case, because the serializing lock is a row-level lock. With
  MySQL table-level locks, the timeout method must be used to
  resolve deadlocks.