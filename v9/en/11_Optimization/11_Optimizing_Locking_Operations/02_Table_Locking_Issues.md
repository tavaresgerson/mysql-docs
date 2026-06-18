### 10.11.2 Table Locking Issues

`InnoDB` tables use row-level locking so that
multiple sessions and applications can read from and write to
the same table simultaneously, without making each other wait or
producing inconsistent results. For this storage engine, avoid
using the [`LOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") statement,
because it does not offer any extra protection, but instead
reduces concurrency. The automatic row-level locking makes these
tables suitable for your busiest databases with your most
important data, while also simplifying application logic since
you do not need to lock and unlock tables. Consequently, the
`InnoDB` storage engine is the default in
MySQL.

MySQL uses table locking (instead of page, row, or column
locking) for all storage engines except
`InnoDB`. The locking operations themselves do
not have much overhead. But because only one session can write
to a table at any one time, for best performance with these
other storage engines, use them primarily for tables that are
queried often and rarely inserted into or updated.

* [Performance Considerations Favoring InnoDB](table-locking.html#table-locking-innodb "Performance Considerations Favoring InnoDB")
* [Workarounds for Locking Performance Issues](table-locking.html#table-locking-workarounds "Workarounds for Locking Performance Issues")

#### Performance Considerations Favoring InnoDB

When choosing whether to create a table using
`InnoDB` or a different storage engine, keep
in mind the following disadvantages of table locking:

* Table locking enables many sessions to read from a table
  at the same time, but if a session wants to write to a
  table, it must first get exclusive access, meaning it
  might have to wait for other sessions to finish with the
  table first. During the update, all other sessions that
  want to access this particular table must wait until the
  update is done.

* Table locking causes problems when a session is waiting
  because the disk is full and free space needs to become
  available before the session can proceed. In this case,
  all sessions that want to access the problem table are
  also put in a waiting state until more disk space is made
  available.

* A [`SELECT`](select.html "15.2.13 SELECT Statement") statement that
  takes a long time to run prevents other sessions from
  updating the table in the meantime, making the other
  sessions appear slow or unresponsive. While a session is
  waiting to get exclusive access to the table for updates,
  other sessions that issue
  [`SELECT`](select.html "15.2.13 SELECT Statement") statements queue up
  behind it, reducing concurrency even for read-only
  sessions.

#### Workarounds for Locking Performance Issues

The following items describe some ways to avoid or reduce
contention caused by table locking:

* Consider switching the table to the
  `InnoDB` storage engine, either using
  `CREATE TABLE ... ENGINE=INNODB` during
  setup, or using `ALTER TABLE ...
  ENGINE=INNODB` for an existing table. See
  [Chapter 17, *The InnoDB Storage Engine*](innodb-storage-engine.html "Chapter 17 The InnoDB Storage Engine") for more details
  about this storage engine.

* Optimize [`SELECT`](select.html "15.2.13 SELECT Statement") statements
  to run faster so that they lock tables for a shorter time.
  You might have to create some summary tables to do this.

* Start [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") with
  [`--low-priority-updates`](server-system-variables.html#sysvar_low_priority_updates). For
  storage engines that use only table-level locking (such as
  `MyISAM`, `MEMORY`, and
  `MERGE`), this gives all statements that
  update (modify) a table lower priority than
  [`SELECT`](select.html "15.2.13 SELECT Statement") statements. In this
  case, the second [`SELECT`](select.html "15.2.13 SELECT Statement")
  statement in the preceding scenario would execute before
  the [`UPDATE`](update.html "15.2.17 UPDATE Statement") statement, and
  would not wait for the first
  [`SELECT`](select.html "15.2.13 SELECT Statement") to finish.

* To specify that all updates issued in a specific
  connection should be done with low priority, set the
  [`low_priority_updates`](server-system-variables.html#sysvar_low_priority_updates)
  server system variable equal to 1.

* To give a specific [`INSERT`](insert.html "15.2.7 INSERT Statement"),
  [`UPDATE`](update.html "15.2.17 UPDATE Statement"), or
  [`DELETE`](delete.html "15.2.2 DELETE Statement") statement lower
  priority, use the `LOW_PRIORITY`
  attribute.

* To give a specific [`SELECT`](select.html "15.2.13 SELECT Statement")
  statement higher priority, use the
  `HIGH_PRIORITY` attribute. See
  [Section 15.2.13, “SELECT Statement”](select.html "15.2.13 SELECT Statement").

* Start [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") with a low value for the
  [`max_write_lock_count`](server-system-variables.html#sysvar_max_write_lock_count)
  system variable to force MySQL to temporarily elevate the
  priority of all [`SELECT`](select.html "15.2.13 SELECT Statement")
  statements that are waiting for a table after a specific
  number of write locks to the table occur (for example, for
  insert operations). This permits read locks after a
  certain number of write locks.

* If you have problems with mixed
  [`SELECT`](select.html "15.2.13 SELECT Statement") and
  [`DELETE`](delete.html "15.2.2 DELETE Statement") statements, the
  `LIMIT` option to
  [`DELETE`](delete.html "15.2.2 DELETE Statement") may help. See
  [Section 15.2.2, “DELETE Statement”](delete.html "15.2.2 DELETE Statement").

* Using `SQL_BUFFER_RESULT` with
  [`SELECT`](select.html "15.2.13 SELECT Statement") statements can help
  to make the duration of table locks shorter. See
  [Section 15.2.13, “SELECT Statement”](select.html "15.2.13 SELECT Statement").

* Splitting table contents into separate tables may help, by
  allowing queries to run against columns in one table,
  while updates are confined to columns in a different
  table.

* You could change the locking code in
  `mysys/thr_lock.c` to use a single
  queue. In this case, write locks and read locks would have
  the same priority, which might help some applications.