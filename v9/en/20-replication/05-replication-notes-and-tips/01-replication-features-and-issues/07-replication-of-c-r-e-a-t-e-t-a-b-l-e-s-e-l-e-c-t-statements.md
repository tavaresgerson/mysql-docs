#### 19.5.1.7 Replication of CREATE TABLE ... SELECT Statements

MySQL applies these rules when `CREATE TABLE ... SELECT` statements are replicated:

* `CREATE TABLE ... SELECT` always performs an implicit commit (Section 15.3.3, “Statements That Cause an Implicit Commit”).

* If the destination table does not exist, logging occurs as follows. It does not matter whether `IF NOT EXISTS` is present.

  + `STATEMENT` or `MIXED` format: The statement is logged as written.

  + `ROW` format: The statement is logged as a `CREATE TABLE` statement followed by a series of insert-row events.

    With storage engines that support atomic DDL, the statement is logged as one transaction. For more information, see Section 15.1.1, “Atomic Data Definition Statement Support”.

* If the `CREATE TABLE ... SELECT` statement fails, nothing is logged. This includes the case that the destination table exists and `IF NOT EXISTS` is not given.

* If the destination table exists and `IF NOT EXISTS` is given, MySQL 9.5 ignores the statement completely; nothing is inserted or logged.

MySQL 9.5 does not allow a `CREATE TABLE ... SELECT` statement to make any changes in tables other than the table that is created by the statement.
