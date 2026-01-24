## 13.3 Transactional and Locking Statements

[13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements](commit.html)

[13.3.2 Statements That Cannot Be Rolled Back](cannot-roll-back.html)

[13.3.3 Statements That Cause an Implicit Commit](implicit-commit.html)

[13.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements](savepoint.html)

[13.3.5 LOCK TABLES and UNLOCK TABLES Statements](lock-tables.html)

[13.3.6 SET TRANSACTION Statement](set-transaction.html)

[13.3.7 XA Transactions](xa.html)

MySQL supports local transactions (within a given client session) through statements such as [`SET autocommit`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), and [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"). See [Section 13.3.1, “START TRANSACTION, COMMIT, and ROLLBACK Statements”](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"). XA transaction support enables MySQL to participate in distributed transactions as well. See [Section 13.3.7, “XA Transactions”](xa.html "13.3.7 XA Transactions").
