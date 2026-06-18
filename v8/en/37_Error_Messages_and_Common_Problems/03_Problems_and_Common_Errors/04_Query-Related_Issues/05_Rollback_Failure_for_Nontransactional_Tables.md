#### B.3.4.5 Rollback Failure for Nontransactional Tables

If you receive the following message when trying to perform a
[`ROLLBACK`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), it
means that one or more of the tables you used in the
transaction do not support transactions:

```
Warning: Some non-transactional changed tables couldn't be rolled back
```

These nontransactional tables are not affected by the
[`ROLLBACK`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")
statement.

If you were not deliberately mixing transactional and
nontransactional tables within the transaction, the most
likely cause for this message is that a table you thought was
transactional actually is not. This can happen if you try to
create a table using a transactional storage engine that is
not supported by your [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") server (or
that was disabled with a startup option). If
[**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") does not support a storage engine,
it instead creates the table as a `MyISAM`
table, which is nontransactional.

You can check the storage engine for a table by using either
of these statements:

```
SHOW TABLE STATUS LIKE 'tbl_name';
SHOW CREATE TABLE tbl_name;
```

See [Section 15.7.7.38, “SHOW TABLE STATUS Statement”](show-table-status.html "15.7.7.38 SHOW TABLE STATUS Statement"), and
[Section 15.7.7.10, “SHOW CREATE TABLE Statement”](show-create-table.html "15.7.7.10 SHOW CREATE TABLE Statement").

To check which storage engines your [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server")
server supports, use this statement:

```
SHOW ENGINES;
```

See [Section 15.7.7.16, “SHOW ENGINES Statement”](show-engines.html "15.7.7.16 SHOW ENGINES Statement") for full details.