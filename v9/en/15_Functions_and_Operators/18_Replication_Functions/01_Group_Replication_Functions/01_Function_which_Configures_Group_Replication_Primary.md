#### 14.18.1.1 Function which Configures Group Replication Primary

The following function enables you to set a member of a
single-primary replication group to take over as the primary.
The current primary becomes a read-only secondary, and the
specified group member becomes the read-write primary. The
function can be used on any member of a replication group
running in single-primary mode. This function replaces the
usual primary election process; see
[Section 20.5.1.1, “Changing the Primary”](group-replication-change-primary.html "20.5.1.1 Changing the Primary"), for more
information.

If a standard source to replica replication channel is running
on the existing primary member in addition to the Group
Replication channels, you must stop that replication channel
before you can change the primary member. You can identify the
current primary using the `MEMBER_ROLE`
column in the Performance Schema
[`replication_group_members`](performance-schema-replication-group-members-table.html "29.12.11.18 The replication_group_members Table") table.

Any uncommitted transactions that the group is waiting on must
be committed, rolled back, or terminated before the operation
can complete. You can specify a timeout for transactions that
are running when you use the function. For the timeout to
work, all members of the group must be MySQL version 8.0.29 or
newer.

When the timeout expires, for any transactions that did not
yet reach their commit phase, the client session is
disconnected so that the transaction does not proceed.
Transactions that reached their commit phase are allowed to
complete. When you set a timeout, it also prevents new
transactions starting on the primary from that point on.
Explicitly defined transactions (with a `START
TRANSACTION` or `BEGIN` statement)
are subject to the timeout, disconnection, and incoming
transaction blocking even if they do not modify any data. To
allow inspection of the primary while the function is
operating, single statements that do not modify data, as
listed in [Permitted Queries Under Consistency Rules](group-replication-configuring-consistency-guarantees.html#group-replication-nonblocking "Permitted Queries Under Consistency Rules"), are
permitted to proceed.

* [`group_replication_set_as_primary()`](group-replication-functions-for-new-primary.html#function_group-replication-set-as-primary)

  Appoints a specific member of the group as the new
  primary, overriding any election process.

  Syntax:

  ```
  STRING group_replication_set_as_primary(member_uuid[, timeout])
  ```

  Arguments:

  + *`member_uuid`*: A string
    containing the UUID of the member of the group that
    you want to become the new primary.

  + *`timeout`*: An integer
    specifying a timeout in seconds for transactions that
    are running on the existing primary when you use the
    function. You can set a timeout from 0 seconds
    (immediately) up to 3600 seconds (60 minutes). When
    you set a timeout, new transactions cannot start on
    the primary from that point on. There is no default
    setting for the timeout, so if you do not set it,
    there is no upper limit to the wait time, and new
    transactions can start during that time.

  Return value:

  A string containing the result of the operation, for
  example whether it was successful or not.

  Example:

  ```
  SELECT group_replication_set_as_primary(‘00371d66-3c45-11ea-804b-080027337932’, 300);
  ```

  This function waits for all ongoing transactions and DML
  operations to finish before electing the new primary. In
  MySQL 9.5, it also waits for the completion
  of any ongoing DDL statements such as
  [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement"). Operations
  that are considered DDL statements for this purpose are
  listed here:

  + [`ALTER DATABASE`](alter-database.html "15.1.2 ALTER DATABASE Statement")
  + [`ALTER FUNCTION`](alter-function.html "15.1.4 ALTER FUNCTION Statement")
  + [`ALTER INSTANCE`](alter-instance.html "15.1.5 ALTER INSTANCE Statement")
  + [`ALTER PROCEDURE`](alter-procedure.html "15.1.9 ALTER PROCEDURE Statement")
  + [`ALTER SERVER`](alter-server.html "15.1.10 ALTER SERVER Statement")
  + `ALTER TABLE`
  + [`ALTER TABLESPACE`](alter-tablespace.html "15.1.12 ALTER TABLESPACE Statement")
  + [`ALTER USER`](alter-user.html "15.7.1.1 ALTER USER Statement")
  + [`ALTER VIEW`](alter-view.html "15.1.13 ALTER VIEW Statement")
  + [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement")
  + [`CACHE INDEX`](cache-index.html "15.7.8.2 CACHE INDEX Statement")
  + [`CHECK TABLE`](check-table.html "15.7.3.2 CHECK TABLE Statement")
  + [`CREATE DATABASE`](create-database.html "15.1.14 CREATE DATABASE Statement")
  + [`CREATE FUNCTION`](create-function.html "15.1.16 CREATE FUNCTION Statement")
  + [`CREATE INDEX`](create-index.html "15.1.18 CREATE INDEX Statement")
  + [`CREATE ROLE`](create-role.html "15.7.1.2 CREATE ROLE Statement")
  + [`CREATE PROCEDURE`](create-procedure.html "15.1.21 CREATE PROCEDURE and CREATE FUNCTION Statements")
  + [`CREATE SERVER`](create-server.html "15.1.22 CREATE SERVER Statement")
  + [`CREATE SPATIAL REFERENCE
    SYSTEM`](create-spatial-reference-system.html "15.1.23 CREATE SPATIAL REFERENCE SYSTEM Statement")

  + [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement")
  + [`CREATE TABLESPACE`](create-tablespace.html "15.1.25 CREATE TABLESPACE Statement")
  + [`CREATE TRIGGER`](create-trigger.html "15.1.26 CREATE TRIGGER Statement")
  + [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement")
  + [`CREATE VIEW`](create-view.html "15.1.27 CREATE VIEW Statement")
  + [`DROP DATABASE`](drop-database.html "15.1.28 DROP DATABASE Statement")
  + [`DROP FUNCTION`](drop-function.html "15.1.30 DROP FUNCTION Statement")
  + [`DROP INDEX`](drop-index.html "15.1.31 DROP INDEX Statement")
  + [`DROP PROCEDURE`](drop-procedure.html "15.1.34 DROP PROCEDURE and DROP FUNCTION Statements")
  + [`DROP ROLE`](drop-role.html "15.7.1.4 DROP ROLE Statement")
  + [`DROP SERVER`](drop-server.html "15.1.35 DROP SERVER Statement")
  + [`DROP SPATIAL REFERENCE
    SYSTEM`](drop-spatial-reference-system.html "15.1.36 DROP SPATIAL REFERENCE SYSTEM Statement")

  + [`DROP TABLE`](drop-table.html "15.1.37 DROP TABLE Statement")
  + [`DROP TABLESPACE`](drop-tablespace.html "15.1.38 DROP TABLESPACE Statement")
  + [`DROP TRIGGER`](drop-trigger.html "15.1.39 DROP TRIGGER Statement")
  + [`DROP USER`](drop-user.html "15.7.1.5 DROP USER Statement")
  + [`DROP VIEW`](drop-view.html "15.1.40 DROP VIEW Statement")
  + [`GRANT`](grant.html "15.7.1.6 GRANT Statement")
  + [`LOAD INDEX`](load-index.html "15.7.8.5 LOAD INDEX INTO CACHE Statement")
  + [`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement")
  + [`RENAME TABLE`](rename-table.html "15.1.41 RENAME TABLE Statement")
  + [`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement")
  + [`REVOKE`](revoke.html "15.7.1.8 REVOKE Statement")
  + [`TRUNCATE TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement")

  This also includes any open cursors (see
  [Section 15.6.6, “Cursors”](cursors.html "15.6.6 Cursors")).

  For more information, see
  [Section 20.5.1.1, “Changing the Primary”](group-replication-change-primary.html "20.5.1.1 Changing the Primary").