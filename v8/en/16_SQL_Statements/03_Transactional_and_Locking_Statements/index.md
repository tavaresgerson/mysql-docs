## 15.3 Transactional and Locking Statements

15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements

15.3.2 Statements That Cannot Be Rolled Back

15.3.3 Statements That Cause an Implicit Commit

15.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements

15.3.5 LOCK INSTANCE FOR BACKUP and UNLOCK INSTANCE Statements

15.3.6 LOCK TABLES and UNLOCK TABLES Statements

15.3.7 SET TRANSACTION Statement

15.3.8 XA Transactions

MySQL supports local transactions (within a given client session) through statements such as `SET autocommit`, `START TRANSACTION`, `COMMIT`, and `ROLLBACK`. See Section 15.3.1, “START TRANSACTION, COMMIT, and ROLLBACK Statements”. XA transaction support enables MySQL to participate in distributed transactions as well. See Section 15.3.8, “XA Transactions”.
