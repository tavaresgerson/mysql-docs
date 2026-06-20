## 15.3 Transactional and Locking Statements

MySQL supports local transactions (within a given client session)
through statements such as
[`SET autocommit`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"),
[`START TRANSACTION`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"),
[`COMMIT`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), and
[`ROLLBACK`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"). See
[Section 15.3.1, “START TRANSACTION, COMMIT, and ROLLBACK Statements”](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"). XA transaction support enables MySQL to
participate in distributed transactions as well. See
[Section 15.3.8, “XA Transactions”](xa.html "15.3.8 XA Transactions").