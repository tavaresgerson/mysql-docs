#### 17.7.2.2 autocommit, Commit, and Rollback

In `InnoDB`, all user activity occurs inside a
transaction. If [`autocommit`](server-system-variables.html#sysvar_autocommit) mode
is enabled, each SQL statement forms a single transaction on its
own. By default, MySQL starts the session for each new
connection with [`autocommit`](server-system-variables.html#sysvar_autocommit)
enabled, so MySQL does a commit after each SQL statement if that
statement did not return an error. If a statement returns an
error, the commit or rollback behavior depends on the error. See
[Section 17.21.5, “InnoDB Error Handling”](innodb-error-handling.html "17.21.5 InnoDB Error Handling").

A session that has [`autocommit`](server-system-variables.html#sysvar_autocommit)
enabled can perform a multiple-statement transaction by starting
it with an explicit
[`START
TRANSACTION`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") or
[`BEGIN`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")
statement and ending it with a
[`COMMIT`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") or
[`ROLLBACK`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")
statement. See [Section 15.3.1, “START TRANSACTION, COMMIT, and ROLLBACK Statements”](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements").

If [`autocommit`](server-system-variables.html#sysvar_autocommit) mode is disabled
within a session with `SET autocommit = 0`, the
session always has a transaction open. A
[`COMMIT`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") or
[`ROLLBACK`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")
statement ends the current transaction and a new one starts.

If a session that has
[`autocommit`](server-system-variables.html#sysvar_autocommit) disabled ends
without explicitly committing the final transaction, MySQL rolls
back that transaction.

Some statements implicitly end a transaction, as if you had done
a [`COMMIT`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") before executing the
statement. For details, see [Section 15.3.3, “Statements That Cause an Implicit Commit”](implicit-commit.html "15.3.3 Statements That Cause an Implicit Commit").

A [`COMMIT`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") means that the changes
made in the current transaction are made permanent and become
visible to other sessions. A
[`ROLLBACK`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")
statement, on the other hand, cancels all modifications made by
the current transaction. Both
[`COMMIT`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") and
[`ROLLBACK`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")
release all `InnoDB` locks that were set during
the current transaction.

##### Grouping DML Operations with Transactions

By default, connection to the MySQL server begins with
[autocommit](glossary.html#glos_autocommit "autocommit") mode
enabled, which automatically commits every SQL statement as
you execute it. This mode of operation might be unfamiliar if
you have experience with other database systems, where it is
standard practice to issue a sequence of
[DML](glossary.html#glos_dml "DML") statements and commit them
or roll them back all together.

To use multiple-statement
[transactions](glossary.html#glos_transaction "transaction"), switch
autocommit off with the SQL statement `SET autocommit
= 0` and end each transaction with
[`COMMIT`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") or
[`ROLLBACK`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") as
appropriate. To leave autocommit on, begin each transaction
with [`START
TRANSACTION`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") and end it with
[`COMMIT`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") or
[`ROLLBACK`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements").
The following example shows two transactions. The first is
committed; the second is rolled back.

```
$> mysql test
```

```
mysql> CREATE TABLE customer (a INT, b CHAR (20), INDEX (a));
Query OK, 0 rows affected (0.00 sec)
mysql> -- Do a transaction with autocommit turned on.
mysql> START TRANSACTION;
Query OK, 0 rows affected (0.00 sec)
mysql> INSERT INTO customer VALUES (10, 'Heikki');
Query OK, 1 row affected (0.00 sec)
mysql> COMMIT;
Query OK, 0 rows affected (0.00 sec)
mysql> -- Do another transaction with autocommit turned off.
mysql> SET autocommit=0;
Query OK, 0 rows affected (0.00 sec)
mysql> INSERT INTO customer VALUES (15, 'John');
Query OK, 1 row affected (0.00 sec)
mysql> INSERT INTO customer VALUES (20, 'Paul');
Query OK, 1 row affected (0.00 sec)
mysql> DELETE FROM customer WHERE b = 'Heikki';
Query OK, 1 row affected (0.00 sec)
mysql> -- Now we undo those last 2 inserts and the delete.
mysql> ROLLBACK;
Query OK, 0 rows affected (0.00 sec)
mysql> SELECT * FROM customer;
+------+--------+
| a    | b      |
+------+--------+
|   10 | Heikki |
+------+--------+
1 row in set (0.00 sec)
mysql>
```

###### Transactions in Client-Side Languages

In APIs such as PHP, Perl DBI, JDBC, ODBC, or the standard C
call interface of MySQL, you can send transaction control
statements such as [`COMMIT`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") to
the MySQL server as strings just like any other SQL statements
such as [`SELECT`](select.html "15.2.13 SELECT Statement") or
[`INSERT`](insert.html "15.2.7 INSERT Statement"). Some APIs also offer
separate special transaction commit and rollback functions or
methods.