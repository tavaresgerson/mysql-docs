#### 13.3.7.2 XA Transaction States

An XA transaction progresses through the following states:

1. Use [`XA START`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements") to start an XA transaction and put it in the `ACTIVE` state.

2. For an `ACTIVE` XA transaction, issue the SQL statements that make up the transaction, and then issue an [`XA END`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements") statement. [`XA END`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements") puts the transaction in the `IDLE` state.

3. For an `IDLE` XA transaction, you can issue either an [`XA PREPARE`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements") statement or an `XA COMMIT ... ONE PHASE` statement:

   * [`XA PREPARE`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements") puts the transaction in the `PREPARED` state. An [`XA RECOVER`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements") statement at this point includes the transaction's *`xid`* value in its output, because [`XA RECOVER`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements") lists all XA transactions that are in the `PREPARED` state.

   * `XA COMMIT ... ONE PHASE` prepares and commits the transaction. The *`xid`* value is not listed by [`XA RECOVER`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements") because the transaction terminates.

4. For a `PREPARED` XA transaction, you can issue an [`XA COMMIT`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements") statement to commit and terminate the transaction, or [`XA ROLLBACK`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements") to roll back and terminate the transaction.

Here is a simple XA transaction that inserts a row into a table as part of a global transaction:

```sql
mysql> XA START 'xatest';
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO mytable (i) VALUES(10);
Query OK, 1 row affected (0.04 sec)

mysql> XA END 'xatest';
Query OK, 0 rows affected (0.00 sec)

mysql> XA PREPARE 'xatest';
Query OK, 0 rows affected (0.00 sec)

mysql> XA COMMIT 'xatest';
Query OK, 0 rows affected (0.00 sec)
```

Within the context of a given client connection, XA transactions and local (non-XA) transactions are mutually exclusive. For example, if [`XA START`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements") has been issued to begin an XA transaction, a local transaction cannot be started until the XA transaction has been committed or rolled back. Conversely, if a local transaction has been started with [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), no XA statements can be used until the transaction has been committed or rolled back.

If an XA transaction is in the `ACTIVE` state, you cannot issue any statements that cause an implicit commit. That would violate the XA contract because you could not roll back the XA transaction. The following error is raised if you try to execute such a statement:

```sql
ERROR 1399 (XAE07): XAER_RMFAIL: The command cannot be executed
when global transaction is in the ACTIVE state
```

Statements to which the preceding remark applies are listed at [Section 13.3.3, “Statements That Cause an Implicit Commit”](implicit-commit.html "13.3.3 Statements That Cause an Implicit Commit").
