### 14.22.4 InnoDB Error Handling

The following items describe how `InnoDB`
performs error handling. `InnoDB` sometimes rolls
back only the statement that failed, other times it rolls back the
entire transaction.

* If you run out of file space in a
  [tablespace](glossary.html#glos_tablespace "tablespace"), a MySQL
  `Table is full` error occurs and
  `InnoDB` rolls back the SQL statement.

* A transaction [deadlock](glossary.html#glos_deadlock "deadlock")
  causes `InnoDB` to
  [roll back](glossary.html#glos_rollback "rollback") the entire
  [transaction](glossary.html#glos_transaction "transaction"). Retry the
  entire transaction when this happens.

  A lock wait timeout causes `InnoDB` to roll
  back the current statement (the statement that was waiting for
  the lock and encountered the timeout). To have the entire
  transaction roll back, start the server with
  [`--innodb-rollback-on-timeout`](innodb-parameters.html#sysvar_innodb_rollback_on_timeout)
  enabled. Retry the statement if using the default behavior, or
  the entire transaction if
  [`--innodb-rollback-on-timeout`](innodb-parameters.html#sysvar_innodb_rollback_on_timeout) is
  enabled.

  Both deadlocks and lock wait timeouts are normal on busy
  servers and it is necessary for applications to be aware that
  they may happen and handle them by retrying. You can make them
  less likely by doing as little work as possible between the
  first change to data during a transaction and the commit, so
  the locks are held for the shortest possible time and for the
  smallest possible number of rows. Sometimes splitting work
  between different transactions may be practical and helpful.

* A duplicate-key error rolls back the SQL statement, if you
  have not specified the `IGNORE` option in
  your statement.

* A `row too long error` rolls back the SQL
  statement.

* Other errors are mostly detected by the MySQL layer of code
  (above the `InnoDB` storage engine level),
  and they roll back the corresponding SQL statement. Locks are
  not released in a rollback of a single SQL statement.

During implicit rollbacks, as well as during the execution of an
explicit
[`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") SQL
statement, [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement")
displays `Rolling back` in the
`State` column for the relevant connection.