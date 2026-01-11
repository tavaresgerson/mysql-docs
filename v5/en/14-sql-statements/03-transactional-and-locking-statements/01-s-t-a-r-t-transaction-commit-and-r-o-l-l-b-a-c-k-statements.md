### 13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements

```sql
START TRANSACTION
    [transaction_characteristic [, transaction_characteristic] ...]

transaction_characteristic: {
    WITH CONSISTENT SNAPSHOT
  | READ WRITE
  | READ ONLY
}

BEGIN [WORK]
COMMIT [WORK] [AND [NO] CHAIN] NO] RELEASE]
ROLLBACK [WORK] [AND [NO] CHAIN] NO] RELEASE]
SET autocommit = {0 | 1}
```

These statements provide control over use of [transactions](glossary.html#glos_transaction "transaction"):

* `START TRANSACTION` or `BEGIN` start a new transaction.

* `COMMIT` commits the current transaction, making its changes permanent.

* `ROLLBACK` rolls back the current transaction, canceling its changes.

* `SET autocommit` disables or enables the default autocommit mode for the current session.

By default, MySQL runs with [autocommit](glossary.html#glos_autocommit "autocommit") mode enabled. This means that, when not otherwise inside a transaction, each statement is atomic, as if it were surrounded by `START TRANSACTION` and `COMMIT`. You cannot use `ROLLBACK` to undo the effect; however, if an error occurs during statement execution, the statement is rolled back.

To disable autocommit mode implicitly for a single series of statements, use the `START TRANSACTION` statement:

```sql
START TRANSACTION;
SELECT @A:=SUM(salary) FROM table1 WHERE type=1;
UPDATE table2 SET summary=@A WHERE type=1;
COMMIT;
```

With `START TRANSACTION`, autocommit remains disabled until you end the transaction with `COMMIT` or `ROLLBACK`. The autocommit mode then reverts to its previous state.

`START TRANSACTION` permits several modifiers that control transaction characteristics. To specify multiple modifiers, separate them by commas.

* The `WITH CONSISTENT SNAPSHOT` modifier starts a [consistent read](glossary.html#glos_consistent_read "consistent read") for storage engines that are capable of it. This applies only to `InnoDB`. The effect is the same as issuing a `START TRANSACTION` followed by a [`SELECT`](select.html "13.2.9 SELECT Statement") from any `InnoDB` table. See [Section 14.7.2.3, “Consistent Nonlocking Reads”](innodb-consistent-read.html "14.7.2.3 Consistent Nonlocking Reads"). The `WITH CONSISTENT SNAPSHOT` modifier does not change the current transaction [isolation level](glossary.html#glos_isolation_level "isolation level"), so it provides a consistent snapshot only if the current isolation level is one that permits a consistent read. The only isolation level that permits a consistent read is [`REPEATABLE READ`](innodb-transaction-isolation-levels.html#isolevel_repeatable-read). For all other isolation levels, the `WITH CONSISTENT SNAPSHOT` clause is ignored. As of MySQL 5.7.2, a warning is generated when the `WITH CONSISTENT SNAPSHOT` clause is ignored.

* The `READ WRITE` and `READ ONLY` modifiers set the transaction access mode. They permit or prohibit changes to tables used in the transaction. The `READ ONLY` restriction prevents the transaction from modifying or locking both transactional and nontransactional tables that are visible to other transactions; the transaction can still modify or lock temporary tables.

  MySQL enables extra optimizations for queries on `InnoDB` tables when the transaction is known to be read-only. Specifying `READ ONLY` ensures these optimizations are applied in cases where the read-only status cannot be determined automatically. See [Section 8.5.3, “Optimizing InnoDB Read-Only Transactions”](innodb-performance-ro-txn.html "8.5.3 Optimizing InnoDB Read-Only Transactions") for more information.

  If no access mode is specified, the default mode applies. Unless the default has been changed, it is read/write. It is not permitted to specify both `READ WRITE` and `READ ONLY` in the same statement.

  In read-only mode, it remains possible to change tables created with the `TEMPORARY` keyword using DML statements. Changes made with DDL statements are not permitted, just as with permanent tables.

  For additional information about transaction access mode, including ways to change the default mode, see [Section 13.3.6, “SET TRANSACTION Statement”](set-transaction.html "13.3.6 SET TRANSACTION Statement").

  If the [`read_only`](server-system-variables.html#sysvar_read_only) system variable is enabled, explicitly starting a transaction with `START TRANSACTION READ WRITE` requires the [`SUPER`](privileges-provided.html#priv_super) privilege.

Important

Many APIs used for writing MySQL client applications (such as JDBC) provide their own methods for starting transactions that can (and sometimes should) be used instead of sending a `START TRANSACTION` statement from the client. See [Chapter 27, *Connectors and APIs*](connectors-apis.html "Chapter 27 Connectors and APIs"), or the documentation for your API, for more information.

To disable autocommit mode explicitly, use the following statement:

```sql
SET autocommit=0;
```

After disabling autocommit mode by setting the [`autocommit`](server-system-variables.html#sysvar_autocommit) variable to zero, changes to transaction-safe tables (such as those for [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") or [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6")) are not made permanent immediately. You must use [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") to store your changes to disk or `ROLLBACK` to ignore the changes.

[`autocommit`](server-system-variables.html#sysvar_autocommit) is a session variable and must be set for each session. To disable autocommit mode for each new connection, see the description of the [`autocommit`](server-system-variables.html#sysvar_autocommit) system variable at [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

`BEGIN` and `BEGIN WORK` are supported as aliases of `START TRANSACTION` for initiating a transaction. `START TRANSACTION` is standard SQL syntax, is the recommended way to start an ad-hoc transaction, and permits modifiers that `BEGIN` does not.

The `BEGIN` statement differs from the use of the `BEGIN` keyword that starts a [`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement") compound statement. The latter does not begin a transaction. See [Section 13.6.1, “BEGIN ... END Compound Statement”](begin-end.html "13.6.1 BEGIN ... END Compound Statement").

Note

Within all stored programs (stored procedures and functions, triggers, and events), the parser treats `BEGIN [WORK]` as the beginning of a [`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement") block. Begin a transaction in this context with [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") instead.

The optional `WORK` keyword is supported for `COMMIT` and `ROLLBACK`, as are the `CHAIN` and `RELEASE` clauses. `CHAIN` and `RELEASE` can be used for additional control over transaction completion. The value of the [`completion_type`](server-system-variables.html#sysvar_completion_type) system variable determines the default completion behavior. See [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

The `AND CHAIN` clause causes a new transaction to begin as soon as the current one ends, and the new transaction has the same isolation level as the just-terminated transaction. The new transaction also uses the same access mode (`READ WRITE` or `READ ONLY`) as the just-terminated transaction. The `RELEASE` clause causes the server to disconnect the current client session after terminating the current transaction. Including the `NO` keyword suppresses `CHAIN` or `RELEASE` completion, which can be useful if the [`completion_type`](server-system-variables.html#sysvar_completion_type) system variable is set to cause chaining or release completion by default.

Beginning a transaction causes any pending transaction to be committed. See [Section 13.3.3, “Statements That Cause an Implicit Commit”](implicit-commit.html "13.3.3 Statements That Cause an Implicit Commit"), for more information.

Beginning a transaction also causes table locks acquired with [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") to be released, as though you had executed [`UNLOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements"). Beginning a transaction does not release a global read lock acquired with [`FLUSH TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock).

For best results, transactions should be performed using only tables managed by a single transaction-safe storage engine. Otherwise, the following problems can occur:

* If you use tables from more than one transaction-safe storage engine (such as `InnoDB`), and the transaction isolation level is not [`SERIALIZABLE`](innodb-transaction-isolation-levels.html#isolevel_serializable), it is possible that when one transaction commits, another ongoing transaction that uses the same tables sees only some of the changes made by the first transaction. That is, the atomicity of transactions is not guaranteed with mixed engines and inconsistencies can result. (If mixed-engine transactions are infrequent, you can use [`SET TRANSACTION ISOLATION LEVEL`](set-transaction.html "13.3.6 SET TRANSACTION Statement") to set the isolation level to [`SERIALIZABLE`](innodb-transaction-isolation-levels.html#isolevel_serializable) on a per-transaction basis as necessary.)

* If you use tables that are not transaction-safe within a transaction, changes to those tables are stored at once, regardless of the status of autocommit mode.

* If you issue a [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") statement after updating a nontransactional table within a transaction, an [`ER_WARNING_NOT_COMPLETE_ROLLBACK`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_warning_not_complete_rollback) warning occurs. Changes to transaction-safe tables are rolled back, but not changes to nontransaction-safe tables.

Each transaction is stored in the binary log in one chunk, upon [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"). Transactions that are rolled back are not logged. (**Exception**: Modifications to nontransactional tables cannot be rolled back. If a transaction that is rolled back includes modifications to nontransactional tables, the entire transaction is logged with a [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") statement at the end to ensure that modifications to the nontransactional tables are replicated.) See [Section 5.4.4, “The Binary Log”](binary-log.html "5.4.4 The Binary Log").

You can change the isolation level or access mode for transactions with the [`SET TRANSACTION`](set-transaction.html "13.3.6 SET TRANSACTION Statement") statement. See [Section 13.3.6, “SET TRANSACTION Statement”](set-transaction.html "13.3.6 SET TRANSACTION Statement").

Rolling back can be a slow operation that may occur implicitly without the user having explicitly asked for it (for example, when an error occurs). Because of this, [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") displays `Rolling back` in the `State` column for the session, not only for explicit rollbacks performed with the [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") statement but also for implicit rollbacks.

Note

In MySQL 5.7, `BEGIN`, `COMMIT`, and `ROLLBACK` are not affected by [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db) or [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db) rules.

When `InnoDB` performs a complete rollback of a transaction, all locks set by the transaction are released. If a single SQL statement within a transaction rolls back as a result of an error, such as a duplicate key error, locks set by the statement are preserved while the transaction remains active. This happens because `InnoDB` stores row locks in a format such that it cannot know afterward which lock was set by which statement.

If a [`SELECT`](select.html "13.2.9 SELECT Statement") statement within a transaction calls a stored function, and a statement within the stored function fails, that statement rolls back. If [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") is executed for the transaction subsequently, the entire transaction rolls back.
