### 17.7.5 Deadlocks in InnoDB

[17.7.5.1 An InnoDB Deadlock Example](innodb-deadlock-example.html)

[17.7.5.2 Deadlock Detection](innodb-deadlock-detection.html)

[17.7.5.3 How to Minimize and Handle Deadlocks](innodb-deadlocks-handling.html)

A deadlock is a situation in which multiple transactions are
unable to proceed because each transaction holds a lock that is
needed by another one. Because all transactions involved are
waiting for the same resource to become available, none of them
ever releases the lock it holds.

A deadlock can occur when transactions lock rows in multiple
tables (through statements such as
[`UPDATE`](update.html "15.2.17 UPDATE Statement") or
[`SELECT ... FOR
UPDATE`](select.html "15.2.13 SELECT Statement")), but in the opposite order. A deadlock can also
occur when such statements lock ranges of index records and gaps,
with each transaction acquiring some locks but not others due to a
timing issue. For a deadlock example, see
[Section 17.7.5.1, “An InnoDB Deadlock Example”](innodb-deadlock-example.html "17.7.5.1 An InnoDB Deadlock Example").

To reduce the possibility of deadlocks, use transactions rather
than [`LOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") statements; keep
transactions that insert or update data small enough that they do
not stay open for long periods of time; when different
transactions update multiple tables or large ranges of rows, use
the same order of operations (such as
[`SELECT ... FOR
UPDATE`](select.html "15.2.13 SELECT Statement")) in each transaction; create indexes on the
columns used in [`SELECT ...
FOR UPDATE`](select.html "15.2.13 SELECT Statement") and
[`UPDATE ... WHERE`](update.html "15.2.17 UPDATE Statement")
statements. The possibility of deadlocks is not affected by the
isolation level, because the isolation level changes the behavior
of read operations, while deadlocks occur because of write
operations. For more information about avoiding and recovering
from deadlock conditions, see
[Section 17.7.5.3, “How to Minimize and Handle Deadlocks”](innodb-deadlocks-handling.html "17.7.5.3 How to Minimize and Handle Deadlocks").

When deadlock detection is enabled (the default) and a deadlock
does occur, `InnoDB` detects the condition and
rolls back one of the transactions (the victim). If deadlock
detection is disabled using the
[`innodb_deadlock_detect`](innodb-parameters.html#sysvar_innodb_deadlock_detect) variable,
`InnoDB` relies on the
[`innodb_lock_wait_timeout`](innodb-parameters.html#sysvar_innodb_lock_wait_timeout) setting
to roll back transactions in case of a deadlock. Thus, even if
your application logic is correct, you must still handle the case
where a transaction must be retried. To view the last deadlock in
an `InnoDB` user transaction, use
[`SHOW ENGINE INNODB
STATUS`](show-engine.html "15.7.7.17 SHOW ENGINE Statement"). If frequent deadlocks highlight a problem with
transaction structure or application error handling, enable
[`innodb_print_all_deadlocks`](innodb-parameters.html#sysvar_innodb_print_all_deadlocks) to
print information about all deadlocks to the
[**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") error log. For more information about
how deadlocks are automatically detected and handled, see
[Section 17.7.5.2, “Deadlock Detection”](innodb-deadlock-detection.html "17.7.5.2 Deadlock Detection").