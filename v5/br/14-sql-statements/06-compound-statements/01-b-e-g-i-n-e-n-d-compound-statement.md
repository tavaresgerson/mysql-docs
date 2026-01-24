### 13.6.1 BEGIN ... END Compound Statement

```sql
[begin_label:] BEGIN
    [statement_list]
END [end_label]
```

[`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement") syntax is used for writing compound statements, which can appear within stored programs (stored procedures and functions, triggers, and events). A compound statement can contain multiple statements, enclosed by the `BEGIN` and `END` keywords. *`statement_list`* represents a list of one or more statements, each terminated by a semicolon (`;`) statement delimiter. The *`statement_list`* itself is optional, so the empty compound statement (`BEGIN END`) is legal.

[`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement") blocks can be nested.

Use of multiple statements requires that a client is able to send statement strings containing the `;` statement delimiter. In the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") command-line client, this is handled with the `delimiter` command. Changing the `;` end-of-statement delimiter (for example, to `//`) permit `;` to be used in a program body. For an example, see [Section 23.1, “Defining Stored Programs”](stored-programs-defining.html "23.1 Defining Stored Programs").

A [`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement") block can be labeled. See [Section 13.6.2, “Statement Labels”](statement-labels.html "13.6.2 Statement Labels").

The optional `[NOT] ATOMIC` clause is not supported. This means that no transactional savepoint is set at the start of the instruction block and the `BEGIN` clause used in this context has no effect on the current transaction.

Note

Within all stored programs, the parser treats [`BEGIN [WORK]`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") as the beginning of a [`BEGIN ... END`](begin-end.html "13.6.1 BEGIN ... END Compound Statement") block. To begin a transaction in this context, use [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") instead.
