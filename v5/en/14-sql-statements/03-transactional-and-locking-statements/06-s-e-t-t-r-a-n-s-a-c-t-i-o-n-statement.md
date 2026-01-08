### 13.3.6 SET TRANSACTION Statement

```sql
SET [GLOBAL | SESSION] TRANSACTION
    transaction_characteristic [, transaction_characteristic] ...

transaction_characteristic: {
    ISOLATION LEVEL level
  | access_mode
}

level: {
     REPEATABLE READ
   | READ COMMITTED
   | READ UNCOMMITTED
   | SERIALIZABLE
}

access_mode: {
     READ WRITE
   | READ ONLY
}
```

This statement specifies [transaction](glossary.html#glos_transaction "transaction") characteristics. It takes a list of one or more characteristic values separated by commas. Each characteristic value sets the transaction [isolation level](glossary.html#glos_isolation_level "isolation level") or access mode. The isolation level is used for operations on [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") tables. The access mode specifies whether transactions operate in read/write or read-only mode.

In addition, [`SET TRANSACTION`](set-transaction.html "13.3.6 SET TRANSACTION Statement") can include an optional `GLOBAL` or `SESSION` keyword to indicate the scope of the statement.

* [Transaction Isolation Levels](set-transaction.html#set-transaction-isolation-level "Transaction Isolation Levels")
* [Transaction Access Mode](set-transaction.html#set-transaction-access-mode "Transaction Access Mode")
* [Transaction Characteristic Scope](set-transaction.html#set-transaction-scope "Transaction Characteristic Scope")

#### Transaction Isolation Levels

To set the transaction isolation level, use an `ISOLATION LEVEL level` clause. It is not permitted to specify multiple `ISOLATION LEVEL` clauses in the same [`SET TRANSACTION`](set-transaction.html "13.3.6 SET TRANSACTION Statement") statement.

The default isolation level is [`REPEATABLE READ`](innodb-transaction-isolation-levels.html#isolevel_repeatable-read). Other permitted values are [`READ COMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-committed), [`READ UNCOMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-uncommitted), and [`SERIALIZABLE`](innodb-transaction-isolation-levels.html#isolevel_serializable). For information about these isolation levels, see [Section 14.7.2.1, “Transaction Isolation Levels”](innodb-transaction-isolation-levels.html "14.7.2.1 Transaction Isolation Levels").

#### Transaction Access Mode

To set the transaction access mode, use a `READ WRITE` or `READ ONLY` clause. It is not permitted to specify multiple access-mode clauses in the same [`SET TRANSACTION`](set-transaction.html "13.3.6 SET TRANSACTION Statement") statement.

By default, a transaction takes place in read/write mode, with both reads and writes permitted to tables used in the transaction. This mode may be specified explicitly using [`SET TRANSACTION`](set-transaction.html "13.3.6 SET TRANSACTION Statement") with an access mode of `READ WRITE`.

If the transaction access mode is set to `READ ONLY`, changes to tables are prohibited. This may enable storage engines to make performance improvements that are possible when writes are not permitted.

In read-only mode, it remains possible to change tables created with the `TEMPORARY` keyword using DML statements. Changes made with DDL statements are not permitted, just as with permanent tables.

The `READ WRITE` and `READ ONLY` access modes also may be specified for an individual transaction using the [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") statement.

#### Transaction Characteristic Scope

You can set transaction characteristics globally, for the current session, or for the next transaction only:

* With the `GLOBAL` keyword:

  + The statement applies globally for all subsequent sessions.

  + Existing sessions are unaffected.
* With the `SESSION` keyword:

  + The statement applies to all subsequent transactions performed within the current session.

  + The statement is permitted within transactions, but does not affect the current ongoing transaction.

  + If executed between transactions, the statement overrides any preceding statement that sets the next-transaction value of the named characteristics.

* Without any `SESSION` or `GLOBAL` keyword:

  + The statement applies only to the next single transaction performed within the session.

  + Subsequent transactions revert to using the session value of the named characteristics.

  + The statement is not permitted within transactions:

    ```sql
    mysql> START TRANSACTION;
    Query OK, 0 rows affected (0.02 sec)

    mysql> SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    ERROR 1568 (25001): Transaction characteristics can't be changed
    while a transaction is in progress
    ```

A change to global transaction characteristics requires the [`SUPER`](privileges-provided.html#priv_super) privilege. Any session is free to change its session characteristics (even in the middle of a transaction), or the characteristics for its next transaction (prior to the start of that transaction).

To set the global isolation level at server startup, use the [`--transaction-isolation=level`](server-options.html#option_mysqld_transaction-isolation) option on the command line or in an option file. Values of *`level`* for this option use dashes rather than spaces, so the permissible values are [`READ-UNCOMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-uncommitted), [`READ-COMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-committed), [`REPEATABLE-READ`](innodb-transaction-isolation-levels.html#isolevel_repeatable-read), or [`SERIALIZABLE`](innodb-transaction-isolation-levels.html#isolevel_serializable).

Similarly, to set the global transaction access mode at server startup, use the [`--transaction-read-only`](server-options.html#option_mysqld_transaction-read-only) option. The default is `OFF` (read/write mode) but the value can be set to `ON` for a mode of read only.

For example, to set the isolation level to [`REPEATABLE READ`](innodb-transaction-isolation-levels.html#isolevel_repeatable-read) and the access mode to `READ WRITE`, use these lines in the `[mysqld]` section of an option file:

```sql
[mysqld]
transaction-isolation = REPEATABLE-READ
transaction-read-only = OFF
```

At runtime, characteristics at the global, session, and next-transaction scope levels can be set indirectly using the [`SET TRANSACTION`](set-transaction.html "13.3.6 SET TRANSACTION Statement") statement, as described previously. They can also be set directly using the [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statement to assign values to the [`transaction_isolation`](server-system-variables.html#sysvar_transaction_isolation) and [`transaction_read_only`](server-system-variables.html#sysvar_transaction_read_only) system variables:

* [`SET TRANSACTION`](set-transaction.html "13.3.6 SET TRANSACTION Statement") permits optional `GLOBAL` and `SESSION` keywords for setting transaction characteristics at different scope levels.

* The [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statement for assigning values to the [`transaction_isolation`](server-system-variables.html#sysvar_transaction_isolation) and [`transaction_read_only`](server-system-variables.html#sysvar_transaction_read_only) system variables has syntaxes for setting these variables at different scope levels.

The following tables show the characteristic scope level set by each [`SET TRANSACTION`](set-transaction.html "13.3.6 SET TRANSACTION Statement") and variable-assignment syntax.

**Table 13.6 SET TRANSACTION Syntax for Transaction Characteristics**

<table summary="Syntax for setting transaction characteristics using SET TRANSACTION and affected scope."><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th>Syntax</th> <th>Affected Characteristic Scope</th> </tr></thead><tbody><tr> <td><code>SET GLOBAL TRANSACTION <em class="replaceable"><code>transaction_characteristic</code></em></code></td> <td>Global</td> </tr><tr> <td><code>SET SESSION TRANSACTION <em class="replaceable"><code>transaction_characteristic</code></em></code></td> <td>Session</td> </tr><tr> <td><code>SET TRANSACTION <em class="replaceable"><code>transaction_characteristic</code></em></code></td> <td>Next transaction only</td> </tr></tbody></table>

**Table 13.7 SET Syntax for Transaction Characteristics**

<table summary="Syntax for setting transaction characteristics using SET and affected scope."><col style="width: 60%"/><col style="width: 40%"/><thead><tr> <th>Syntax</th> <th>Affected Characteristic Scope</th> </tr></thead><tbody><tr> <td><code>SET GLOBAL <em class="replaceable"><code>var_name</code></em> = <em class="replaceable"><code>value</code></em></code></td> <td>Global</td> </tr><tr> <td><code>SET @@GLOBAL.<em class="replaceable"><code>var_name</code></em> = <em class="replaceable"><code>value</code></em></code></td> <td>Global</td> </tr><tr> <td><code>SET SESSION <em class="replaceable"><code>var_name</code></em> = <em class="replaceable"><code>value</code></em></code></td> <td>Session</td> </tr><tr> <td><code>SET @@SESSION.<em class="replaceable"><code>var_name</code></em> = <em class="replaceable"><code>value</code></em></code></td> <td>Session</td> </tr><tr> <td><code>SET <em class="replaceable"><code>var_name</code></em> = <em class="replaceable"><code>value</code></em></code></td> <td>Session</td> </tr><tr> <td><code>SET @@<em class="replaceable"><code>var_name</code></em> = <em class="replaceable"><code>value</code></em></code></td> <td>Next transaction only</td> </tr></tbody></table>

It is possible to check the global and session values of transaction characteristics at runtime:

```sql
SELECT @@GLOBAL.transaction_isolation, @@GLOBAL.transaction_read_only;
SELECT @@SESSION.transaction_isolation, @@SESSION.transaction_read_only;
```

Prior to MySQL 5.7.20, use [`tx_isolation`](server-system-variables.html#sysvar_tx_isolation) and [`tx_read_only`](server-system-variables.html#sysvar_tx_read_only) rather than [`transaction_isolation`](server-system-variables.html#sysvar_transaction_isolation) and [`transaction_read_only`](server-system-variables.html#sysvar_transaction_read_only).
