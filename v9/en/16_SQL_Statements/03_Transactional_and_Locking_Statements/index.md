## 15.3 Transactional and Locking Statements

[15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements](commit.html)

[15.3.2 Statements That Cannot Be Rolled Back](cannot-roll-back.html)

[15.3.3 Statements That Cause an Implicit Commit](implicit-commit.html)

[15.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements](savepoint.html)

[15.3.5 LOCK INSTANCE FOR BACKUP and UNLOCK INSTANCE Statements](lock-instance-for-backup.html)

[15.3.6 LOCK TABLES and UNLOCK TABLES Statements](lock-tables.html)

[15.3.7 SET TRANSACTION Statement](set-transaction.html)

[15.3.8 XA Transactions](xa.html)

MySQL supports local transactions (within a given client session)
through statements such as
[`SET autocommit`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"),
[`START TRANSACTION`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"),
[`COMMIT`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), and
[`ROLLBACK`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"). See
[Section 15.3.1, “START TRANSACTION, COMMIT, and ROLLBACK Statements”](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"). XA transaction support enables MySQL to
participate in distributed transactions as well. See
[Section 15.3.8, “XA Transactions”](xa.html "15.3.8 XA Transactions").