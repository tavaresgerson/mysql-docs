### 15.3.3 Statements That Cause an Implicit Commit

The statements listed in this section (and any synonyms for them)
implicitly end any transaction active in the current session, as
if you had done a [`COMMIT`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") before
executing the statement.

Most of these statements also cause an implicit commit after
executing. The intent is to handle each such statement in its own
special transaction. Transaction-control and locking statements
are exceptions: If an implicit commit occurs before execution,
another does not occur after.

* **Data definition language (DDL)
  statements that define or modify database objects.**
  [`ALTER EVENT`](alter-event.html "15.1.3 ALTER EVENT Statement"),
  [`ALTER FUNCTION`](alter-function.html "15.1.4 ALTER FUNCTION Statement"),
  [`ALTER PROCEDURE`](alter-procedure.html "15.1.9 ALTER PROCEDURE Statement"),
  [`ALTER SERVER`](alter-server.html "15.1.10 ALTER SERVER Statement"),
  [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement"),
  [`ALTER TABLESPACE`](alter-tablespace.html "15.1.12 ALTER TABLESPACE Statement"),
  [`ALTER VIEW`](alter-view.html "15.1.13 ALTER VIEW Statement"),
  [`CREATE DATABASE`](create-database.html "15.1.14 CREATE DATABASE Statement"),
  [`CREATE EVENT`](create-event.html "15.1.15 CREATE EVENT Statement"),
  [`CREATE FUNCTION`](create-function.html "15.1.16 CREATE FUNCTION Statement"),
  [`CREATE INDEX`](create-index.html "15.1.18 CREATE INDEX Statement"),
  [`CREATE PROCEDURE`](create-procedure.html "15.1.21 CREATE PROCEDURE and CREATE FUNCTION Statements"),
  [`CREATE ROLE`](create-role.html "15.7.1.2 CREATE ROLE Statement"),
  [`CREATE SERVER`](create-server.html "15.1.22 CREATE SERVER Statement"),
  [`CREATE SPATIAL REFERENCE
  SYSTEM`](create-spatial-reference-system.html "15.1.23 CREATE SPATIAL REFERENCE SYSTEM Statement"), [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement"),
  [`CREATE TABLESPACE`](create-tablespace.html "15.1.25 CREATE TABLESPACE Statement"),
  [`CREATE TRIGGER`](create-trigger.html "15.1.26 CREATE TRIGGER Statement"),
  [`CREATE VIEW`](create-view.html "15.1.27 CREATE VIEW Statement"),
  [`DROP DATABASE`](drop-database.html "15.1.28 DROP DATABASE Statement"),
  [`DROP EVENT`](drop-event.html "15.1.29 DROP EVENT Statement"),
  [`DROP FUNCTION`](drop-function.html "15.1.30 DROP FUNCTION Statement"),
  [`DROP INDEX`](drop-index.html "15.1.31 DROP INDEX Statement"),
  [`DROP PROCEDURE`](drop-procedure.html "15.1.34 DROP PROCEDURE and DROP FUNCTION Statements"),
  [`DROP ROLE`](drop-role.html "15.7.1.4 DROP ROLE Statement"),
  [`DROP SERVER`](drop-server.html "15.1.35 DROP SERVER Statement"),
  [`DROP SPATIAL REFERENCE SYSTEM`](drop-spatial-reference-system.html "15.1.36 DROP SPATIAL REFERENCE SYSTEM Statement"),
  [`DROP TABLE`](drop-table.html "15.1.37 DROP TABLE Statement"),
  [`DROP TABLESPACE`](drop-tablespace.html "15.1.38 DROP TABLESPACE Statement"),
  [`DROP TRIGGER`](drop-trigger.html "15.1.39 DROP TRIGGER Statement"),
  [`DROP VIEW`](drop-view.html "15.1.40 DROP VIEW Statement"),
  [`INSTALL PLUGIN`](install-plugin.html "15.7.4.4 INSTALL PLUGIN Statement"),
  [`RENAME TABLE`](rename-table.html "15.1.41 RENAME TABLE Statement"),
  [`TRUNCATE TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement"),
  [`UNINSTALL PLUGIN`](uninstall-plugin.html "15.7.4.6 UNINSTALL PLUGIN Statement").

  [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") and
  [`DROP TABLE`](drop-table.html "15.1.37 DROP TABLE Statement") statements do not
  commit a transaction if the `TEMPORARY`
  keyword is used. (This does not apply to other operations on
  temporary tables such as [`ALTER
  TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") and [`CREATE
  INDEX`](create-index.html "15.1.18 CREATE INDEX Statement"), which do cause a commit.) However, although
  no implicit commit occurs, neither can the statement be rolled
  back, which means that the use of such statements causes
  transactional atomicity to be violated. For example, if you
  use [`CREATE
  TEMPORARY TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") and then roll back the transaction,
  the table remains in existence.

  The [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") statement in
  `InnoDB` is processed as a single
  transaction. This means that a
  [`ROLLBACK`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")
  from the user does not undo [`CREATE
  TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") statements the user made during that
  transaction.

  [`CREATE TABLE ...
  SELECT`](create-table.html "15.1.24 CREATE TABLE Statement") causes an implicit commit before and after
  the statement is executed when you are creating nontemporary
  tables. (No commit occurs for `CREATE TEMPORARY TABLE
  ... SELECT`.)

* **Statements that implicitly use or modify
  tables in the `mysql` database.**
  [`ALTER USER`](alter-user.html "15.7.1.1 ALTER USER Statement"),
  [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement"),
  [`DROP USER`](drop-user.html "15.7.1.5 DROP USER Statement"),
  [`GRANT`](grant.html "15.7.1.6 GRANT Statement"),
  [`RENAME USER`](rename-user.html "15.7.1.7 RENAME USER Statement"),
  [`REVOKE`](revoke.html "15.7.1.8 REVOKE Statement"),
  [`SET PASSWORD`](set-password.html "15.7.1.10 SET PASSWORD Statement").

* **Transaction-control and locking
  statements.**
  [`BEGIN`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"),
  [`LOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements"), `SET
  autocommit = 1` (if the value is not already 1),
  [`START
  TRANSACTION`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"),
  [`UNLOCK
  TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements").

  [`UNLOCK
  TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") commits a transaction only if any tables
  currently have been locked with [`LOCK
  TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") to acquire nontransactional table locks. A
  commit does not occur for
  [`UNLOCK
  TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") following [`FLUSH TABLES
  WITH READ LOCK`](flush.html#flush-tables-with-read-lock) because the latter statement does not
  acquire table-level locks.

  Transactions cannot be nested. This is a consequence of the
  implicit commit performed for any current transaction when you
  issue a [`START
  TRANSACTION`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") statement or one of its synonyms.

  Statements that cause an implicit commit cannot be used in an
  XA transaction while the transaction is in an
  `ACTIVE` state.

  The [`BEGIN`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements")
  statement differs from the use of the `BEGIN`
  keyword that starts a
  [`BEGIN ...
  END`](begin-end.html "15.6.1 BEGIN ... END Compound Statement") compound statement. The latter does not cause an
  implicit commit. See [Section 15.6.1, “BEGIN ... END Compound Statement”](begin-end.html "15.6.1 BEGIN ... END Compound Statement").

* **Data loading statements.**
  [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement").
  [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement") causes an implicit
  commit only for tables using the
  [`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5") storage engine.

* **Administrative statements.**
  [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement"),
  [`CACHE INDEX`](cache-index.html "15.7.8.2 CACHE INDEX Statement"),
  [`CHECK TABLE`](check-table.html "15.7.3.2 CHECK TABLE Statement"),
  [`FLUSH`](flush.html "15.7.8.3 FLUSH Statement"),
  [`LOAD INDEX INTO
  CACHE`](load-index.html "15.7.8.5 LOAD INDEX INTO CACHE Statement"), [`OPTIMIZE
  TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement"), [`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement"),
  [`RESET`](reset.html "15.7.8.6 RESET Statement") (but not
  [`RESET PERSIST`](reset-persist.html "15.7.8.7 RESET PERSIST Statement")).

* **Replication control
  statements**.
  [`START
  REPLICA`](start-replica.html "15.4.2.4 START REPLICA Statement"),
  [`STOP
  REPLICA`](stop-replica.html "15.4.2.5 STOP REPLICA Statement"),
  [`RESET
  REPLICA`](reset-replica.html "15.4.2.3 RESET REPLICA Statement"), [`CHANGE REPLICATION
  SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement").