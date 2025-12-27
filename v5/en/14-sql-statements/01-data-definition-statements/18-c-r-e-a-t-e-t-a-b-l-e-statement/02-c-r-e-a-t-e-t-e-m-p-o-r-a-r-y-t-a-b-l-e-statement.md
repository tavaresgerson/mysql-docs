#### 13.1.18.2 CREATE TEMPORARY TABLE Statement

You can use the `TEMPORARY` keyword when creating a table. A `TEMPORARY` table is visible only within the current session, and is dropped automatically when the session is closed. This means that two different sessions can use the same temporary table name without conflicting with each other or with an existing non-`TEMPORARY` table of the same name. (The existing table is hidden until the temporary table is dropped.)

[`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") causes an implicit commit, except when used with the `TEMPORARY` keyword. See [Section 13.3.3, “Statements That Cause an Implicit Commit”](implicit-commit.html "13.3.3 Statements That Cause an Implicit Commit").

`TEMPORARY` tables have a very loose relationship with databases (schemas). Dropping a database does not automatically drop any `TEMPORARY` tables created within that database. Also, you can create a `TEMPORARY` table in a nonexistent database if you qualify the table name with the database name in the `CREATE TABLE` statement. In this case, all subsequent references to the table must be qualified with the database name.

To create a temporary table, you must have the [`CREATE TEMPORARY TABLES`](privileges-provided.html#priv_create-temporary-tables) privilege. After a session has created a temporary table, the server performs no further privilege checks on the table. The creating session can perform any operation on the table, such as [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement"), [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement"), or [`SELECT`](select.html "13.2.9 SELECT Statement").

One implication of this behavior is that a session can manipulate its temporary tables even if the current user has no privilege to create them. Suppose that the current user does not have the [`CREATE TEMPORARY TABLES`](privileges-provided.html#priv_create-temporary-tables) privilege but is able to execute a definer-context stored procedure that executes with the privileges of a user who does have [`CREATE TEMPORARY TABLES`](privileges-provided.html#priv_create-temporary-tables) and that creates a temporary table. While the procedure executes, the session uses the privileges of the defining user. After the procedure returns, the effective privileges revert to those of the current user, which can still see the temporary table and perform any operation on it.

Note

Support for `TABLESPACE = innodb_file_per_table` and `TABLESPACE = innodb_temporary` clauses with [`CREATE TEMPORARY TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") is deprecated as of MySQL 5.7.24; expect it to be removed in a future version of MySQL.
