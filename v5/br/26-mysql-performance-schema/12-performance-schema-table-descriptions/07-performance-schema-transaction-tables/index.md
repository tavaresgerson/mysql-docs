### 25.12.7 Performance Schema Transaction Tables

[25.12.7.1 The events_transactions_current Table](performance-schema-events-transactions-current-table.html)

[25.12.7.2 The events_transactions_history Table](performance-schema-events-transactions-history-table.html)

[25.12.7.3 The events_transactions_history_long Table](performance-schema-events-transactions-history-long-table.html)

The Performance Schema instruments transactions. Within the event hierarchy, wait events nest within stage events, which nest within statement events, which nest within transaction events.

These tables store transaction events:

* [`events_transactions_current`](performance-schema-events-transactions-current-table.html "25.12.7.1 The events_transactions_current Table"): The current transaction event for each thread.

* [`events_transactions_history`](performance-schema-events-transactions-history-table.html "25.12.7.2 The events_transactions_history Table"): The most recent transaction events that have ended per thread.

* [`events_transactions_history_long`](performance-schema-events-transactions-history-long-table.html "25.12.7.3 The events_transactions_history_long Table"): The most recent transaction events that have ended globally (across all threads).

The following sections describe the transaction event tables. There are also summary tables that aggregate information about transaction events; see [Section 25.12.15.4, “Transaction Summary Tables”](performance-schema-transaction-summary-tables.html "25.12.15.4 Transaction Summary Tables").

For more information about the relationship between the three transaction event tables, see [Section 25.9, “Performance Schema Tables for Current and Historical Events”](performance-schema-event-tables.html "25.9 Performance Schema Tables for Current and Historical Events").

* [Configuring Transaction Event Collection](performance-schema-transaction-tables.html#performance-schema-transaction-tables-configuration "Configuring Transaction Event Collection")
* [Transaction Boundaries](performance-schema-transaction-tables.html#performance-schema-transaction-tables-transaction-boundaries "Transaction Boundaries")
* [Transaction Instrumentation](performance-schema-transaction-tables.html#performance-schema-transaction-tables-instrumentation "Transaction Instrumentation")
* [Transactions and Nested Events](performance-schema-transaction-tables.html#performance-schema-transaction-tables-nested-events "Transactions and Nested Events")
* [Transactions and Stored Programs](performance-schema-transaction-tables.html#performance-schema-transaction-tables-stored-programs "Transactions and Stored Programs")
* [Transactions and Savepoints](performance-schema-transaction-tables.html#performance-schema-transaction-tables-savepoints "Transactions and Savepoints")
* [Transactions and Errors](performance-schema-transaction-tables.html#performance-schema-transaction-tables-errors "Transactions and Errors")

#### Configuring Transaction Event Collection

To control whether to collect transaction events, set the state of the relevant instruments and consumers:

* The [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") table contains an instrument named `transaction`. Use this instrument to enable or disable collection of individual transaction event classes.

* The [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") table contains consumer values with names corresponding to the current and historical transaction event table names. Use these consumers to filter collection of transaction events.

The `transaction` instrument and the transaction consumers are disabled by default:

```sql
mysql> SELECT *
       FROM performance_schema.setup_instruments
       WHERE NAME = 'transaction';
+-------------+---------+-------+
| NAME        | ENABLED | TIMED |
+-------------+---------+-------+
| transaction | NO      | NO    |
+-------------+---------+-------+
mysql> SELECT *
       FROM performance_schema.setup_consumers
       WHERE NAME LIKE 'events_transactions%';
+----------------------------------+---------+
| NAME                             | ENABLED |
+----------------------------------+---------+
| events_transactions_current      | NO      |
| events_transactions_history      | NO      |
| events_transactions_history_long | NO      |
+----------------------------------+---------+
```

To control transaction event collection at server startup, use lines like these in your `my.cnf` file:

* Enable:

  ```sql
  [mysqld]
  performance-schema-instrument='transaction=ON'
  performance-schema-consumer-events-transactions-current=ON
  performance-schema-consumer-events-transactions-history=ON
  performance-schema-consumer-events-transactions-history-long=ON
  ```

* Disable:

  ```sql
  [mysqld]
  performance-schema-instrument='transaction=OFF'
  performance-schema-consumer-events-transactions-current=OFF
  performance-schema-consumer-events-transactions-history=OFF
  performance-schema-consumer-events-transactions-history-long=OFF
  ```

To control transaction event collection at runtime, update the [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") and [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") tables:

* Enable:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME = 'transaction';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'YES'
  WHERE NAME LIKE 'events_transactions%';
  ```

* Disable:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME = 'transaction';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'events_transactions%';
  ```

To collect transaction events only for specific transaction event tables, enable the `transaction` instrument but only the transaction consumers corresponding to the desired tables.

The [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table") table contains a row with a `NAME` value of `transaction` that indicates the unit for transaction event timing. The default unit is `NANOSECOND`:

```sql
mysql> SELECT *
       FROM performance_schema.setup_timers
       WHERE NAME = 'transaction';
+-------------+------------+
| NAME        | TIMER_NAME |
+-------------+------------+
| transaction | NANOSECOND |
+-------------+------------+
```

To change the timing unit, modify the `TIMER_NAME` value:

```sql
UPDATE performance_schema.setup_timers
SET TIMER_NAME = 'MICROSECOND'
WHERE NAME = 'transaction';
```

For additional information about configuring event collection, see [Section 25.3, “Performance Schema Startup Configuration”](performance-schema-startup-configuration.html "25.3 Performance Schema Startup Configuration"), and [Section 25.4, “Performance Schema Runtime Configuration”](performance-schema-runtime-configuration.html "25.4 Performance Schema Runtime Configuration").

#### Transaction Boundaries

In MySQL Server, transactions start explicitly with these statements:

```sql
START TRANSACTION | BEGIN | XA START | XA BEGIN
```

Transactions also start implicitly. For example, when the [`autocommit`](server-system-variables.html#sysvar_autocommit) system variable is enabled, the start of each statement starts a new transaction.

When [`autocommit`](server-system-variables.html#sysvar_autocommit) is disabled, the first statement following a committed transaction marks the start of a new transaction. Subsequent statements are part of the transaction until it is committed.

Transactions explicitly end with these statements:

```sql
COMMIT | ROLLBACK | XA COMMIT | XA ROLLBACK
```

Transactions also end implicitly, by execution of DDL statements, locking statements, and server administration statements.

In the following discussion, references to [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") also apply to [`BEGIN`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), [`XA START`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements"), and [`XA BEGIN`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements"). Similarly, references to [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") and [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") apply to [`XA COMMIT`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements") and [`XA ROLLBACK`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements"), respectively.

The Performance Schema defines transaction boundaries similarly to that of the server. The start and end of a transaction event closely match the corresponding state transitions in the server:

* For an explicitly started transaction, the transaction event starts during processing of the [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") statement.

* For an implicitly started transaction, the transaction event starts on the first statement that uses a transactional engine after the previous transaction has ended.

* For any transaction, whether explicitly or implicitly ended, the transaction event ends when the server transitions out of the active transaction state during the processing of [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") or [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements").

There are subtle implications to this approach:

* Transaction events in the Performance Schema do not fully include the statement events associated with the corresponding [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), or [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") statements. There is a trivial amount of timing overlap between the transaction event and these statements.

* Statements that work with nontransactional engines have no effect on the transaction state of the connection. For implicit transactions, the transaction event begins with the first statement that uses a transactional engine. This means that statements operating exclusively on nontransactional tables are ignored, even following [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements").

To illustrate, consider the following scenario:

```sql
1. SET autocommit = OFF;
2. CREATE TABLE t1 (a INT) ENGINE = InnoDB;
3. START TRANSACTION;                       -- Transaction 1 START
4. INSERT INTO t1 VALUES (1), (2), (3);
5. CREATE TABLE t2 (a INT) ENGINE = MyISAM; -- Transaction 1 COMMIT
                                            -- (implicit; DDL forces commit)
6. INSERT INTO t2 VALUES (1), (2), (3);     -- Update nontransactional table
7. UPDATE t2 SET a = a + 1;                 -- ... and again
8. INSERT INTO t1 VALUES (4), (5), (6);     -- Write to transactional table
                                            -- Transaction 2 START (implicit)
9. COMMIT;                                  -- Transaction 2 COMMIT
```

From the perspective of the server, Transaction 1 ends when table `t2` is created. Transaction 2 does not start until a transactional table is accessed, despite the intervening updates to nontransactional tables.

From the perspective of the Performance Schema, Transaction 2 starts when the server transitions into an active transaction state. Statements 6 and 7 are not included within the boundaries of Transaction 2, which is consistent with how the server writes transactions to the binary log.

#### Transaction Instrumentation

Three attributes define transactions:

* Access mode (read only, read write)
* Isolation level ([`SERIALIZABLE`](innodb-transaction-isolation-levels.html#isolevel_serializable), [`REPEATABLE READ`](innodb-transaction-isolation-levels.html#isolevel_repeatable-read), and so forth)

* Implicit ([`autocommit`](server-system-variables.html#sysvar_autocommit) enabled) or explicit ([`autocommit`](server-system-variables.html#sysvar_autocommit) disabled)

To reduce complexity of the transaction instrumentation and to ensure that the collected transaction data provides complete, meaningful results, all transactions are instrumented independently of access mode, isolation level, or autocommit mode.

To selectively examine transaction history, use the attribute columns in the transaction event tables: `ACCESS_MODE`, `ISOLATION_LEVEL`, and `AUTOCOMMIT`.

The cost of transaction instrumentation can be reduced various ways, such as enabling or disabling transaction instrumentation according to user, account, host, or thread (client connection).

#### Transactions and Nested Events

The parent of a transaction event is the event that initiated the transaction. For an explicitly started transaction, this includes the [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") and [`COMMIT AND CHAIN`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") statements. For an implicitly started transaction, it is the first statement that uses a transactional engine after the previous transaction ends.

In general, a transaction is the top-level parent to all events initiated during the transaction, including statements that explicitly end the transaction such as [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") and [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"). Exceptions are statements that implicitly end a transaction, such as DDL statements, in which case the current transaction must be committed before the new statement is executed.

#### Transactions and Stored Programs

Transactions and stored program events are related as follows:

* Stored Procedures

  Stored procedures operate independently of transactions. A stored procedure can be started within a transaction, and a transaction can be started or ended from within a stored procedure. If called from within a transaction, a stored procedure can execute statements that force a commit of the parent transaction and then start a new transaction.

  If a stored procedure is started within a transaction, that transaction is the parent of the stored procedure event.

  If a transaction is started by a stored procedure, the stored procedure is the parent of the transaction event.

* Stored Functions

  Stored functions are restricted from causing an explicit or implicit commit or rollback. Stored function events can reside within a parent transaction event.

* Triggers

  Triggers activate as part of a statement that accesses the table with which it is associated, so the parent of a trigger event is always the statement that activates it.

  Triggers cannot issue statements that cause an explicit or implicit commit or rollback of a transaction.

* Scheduled Events

  The execution of the statements in the body of a scheduled event takes place in a new connection. Nesting of a scheduled event within a parent transaction is not applicable.

#### Transactions and Savepoints

Savepoint statements are recorded as separate statement events. Transaction events include separate counters for [`SAVEPOINT`](savepoint.html "13.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements"), [`ROLLBACK TO SAVEPOINT`](savepoint.html "13.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements"), and [`RELEASE SAVEPOINT`](savepoint.html "13.3.4 SAVEPOINT, ROLLBACK TO SAVEPOINT, and RELEASE SAVEPOINT Statements") statements issued during the transaction.

#### Transactions and Errors

Errors and warnings that occur within a transaction are recorded in statement events, but not in the corresponding transaction event. This includes transaction-specific errors and warnings, such as a rollback on a nontransactional table or GTID consistency errors.
