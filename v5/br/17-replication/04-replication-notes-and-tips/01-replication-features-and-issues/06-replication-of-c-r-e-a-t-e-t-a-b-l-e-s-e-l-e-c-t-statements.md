#### 16.4.1.6 Replication of CREATE TABLE ... SELECT Statements

This section discusses how MySQL replicates [`CREATE TABLE ... SELECT`](create-table-select.html "13.1.18.4 CREATE TABLE ... SELECT Statement") statements.

MySQL 5.7 does not allow a [`CREATE TABLE ... SELECT`](create-table-select.html "13.1.18.4 CREATE TABLE ... SELECT Statement") statement to make any changes in tables other than the table that is created by the statement. Some older versions of MySQL permitted these statements to do so; this means that, when using replication between a MySQL 5.6 or later replica and a source running a previous version of MySQL, a [`CREATE TABLE ... SELECT`](create-table-select.html "13.1.18.4 CREATE TABLE ... SELECT Statement") statement causing changes in other tables on the source fails on the replica, causing replication to stop. To prevent this from happening, you should use row-based replication, rewrite the offending statement before running it on the source, or upgrade the source to MySQL 5.7. (If you choose to upgrade the source, keep in mind that such a [`CREATE TABLE ... SELECT`](create-table-select.html "13.1.18.4 CREATE TABLE ... SELECT Statement") statement fails following the upgrade unless it is rewritten to remove any side effects on other tables.)

These behaviors are not dependent on MySQL version:

* [`CREATE TABLE ... SELECT`](create-table-select.html "13.1.18.4 CREATE TABLE ... SELECT Statement") always performs an implicit commit ([Section 13.3.3, “Statements That Cause an Implicit Commit”](implicit-commit.html "13.3.3 Statements That Cause an Implicit Commit")).

* If destination table does not exist, logging occurs as follows. It does not matter whether `IF NOT EXISTS` is present.

  + `STATEMENT` or `MIXED` format: The statement is logged as written.

  + `ROW` format: The statement is logged as a [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement followed by a series of insert-row events.

* If the statement fails, nothing is logged. This includes the case that the destination table exists and `IF NOT EXISTS` is not given.

When the destination table exists and `IF NOT EXISTS` is given, MySQL 5.7 ignores the statement completely; nothing is inserted or logged.
