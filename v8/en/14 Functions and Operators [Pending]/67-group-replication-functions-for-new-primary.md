--- title: MySQL 8.4 Reference Manual :: 14.18.1.1 Function which Configures Group Replication Primary url: https://dev.mysql.com/doc/refman/8.4/en/group-replication-functions-for-new-primary.html order: 67 ---



#### 14.18.1.1 Function which Configures Group Replication Primary

The following function enables you to set a member of a single-primary replication group to take over as the primary. The current primary becomes a read-only secondary, and the specified group member becomes the read-write primary. The function can be used on any member of a replication group running in single-primary mode. This function replaces the usual primary election process; see Section 20.5.1.1, “Changing the Primary”, for more information.

If a standard source to replica replication channel is running on the existing primary member in addition to the Group Replication channels, you must stop that replication channel before you can change the primary member. You can identify the current primary using the `MEMBER_ROLE` column in the Performance Schema `replication_group_members` table.

Any uncommitted transactions that the group is waiting on must be committed, rolled back, or terminated before the operation can complete. You can specify a timeout for transactions that are running when you use the function. For the timeout to work, all members of the group must be MySQL version 8.0.29 or newer.

When the timeout expires, for any transactions that did not yet reach their commit phase, the client session is disconnected so that the transaction does not proceed. Transactions that reached their commit phase are allowed to complete. When you set a timeout, it also prevents new transactions starting on the primary from that point on. Explicitly defined transactions (with a `START TRANSACTION` or `BEGIN` statement) are subject to the timeout, disconnection, and incoming transaction blocking even if they do not modify any data. To allow inspection of the primary while the function is operating, single statements that do not modify data, as listed in  Permitted Queries Under Consistency Rules, are permitted to proceed.

*  `group_replication_set_as_primary()`

  Appoints a specific member of the group as the new primary, overriding any election process.

  Syntax:

  ```
  STRING group_replication_set_as_primary(member_uuid[, timeout])
  ```

  Arguments:

  + *`member_uuid`*: A string containing the UUID of the member of the group that you want to become the new primary.
  + *`timeout`*: An integer specifying a timeout in seconds for transactions that are running on the existing primary when you use the function. You can set a timeout from 0 seconds (immediately) up to 3600 seconds (60 minutes). When you set a timeout, new transactions cannot start on the primary from that point on. There is no default setting for the timeout, so if you do not set it, there is no upper limit to the wait time, and new transactions can start during that time.

  Return value:

  A string containing the result of the operation, for example whether it was successful or not.

  Example:

  ```
  SELECT group_replication_set_as_primary(‘00371d66-3c45-11ea-804b-080027337932’, 300);
  ```

  This function waits for all ongoing transactions and DML operations to finish before electing the new primary. In MySQL 8.4, it also waits for the completion of any ongoing DDL statements such as `ALTER TABLE`. Operations that are considered DDL statements for this purpose are listed here:

  +  `ALTER DATABASE`
  +  `ALTER FUNCTION`
  +  `ALTER INSTANCE`
  +  `ALTER PROCEDURE`
  +  `ALTER SERVER`
  + `ALTER TABLE`
  +  `ALTER TABLESPACE`
  +  `ALTER USER`
  +  `ALTER VIEW`
  +  `ANALYZE TABLE`
  +  `CACHE INDEX`
  +  `CHECK TABLE`
  +  `CREATE DATABASE`
  +  `CREATE FUNCTION`
  +  `CREATE INDEX`
  +  `CREATE ROLE`
  +  `CREATE PROCEDURE`
  +  `CREATE SERVER`
  + [`CREATE SPATIAL REFERENCE SYSTEM`](create-spatial-reference-system.html "15.1.19 CREATE SPATIAL REFERENCE SYSTEM Statement")
  +  `CREATE TABLE`
  +  `CREATE TABLESPACE`
  +  `CREATE TRIGGER`
  +  `CREATE USER`
  +  `CREATE VIEW`
  +  `DROP DATABASE`
  +  `DROP FUNCTION`
  +  `DROP INDEX`
  +  `DROP PROCEDURE`
  +  `DROP ROLE`
  +  `DROP SERVER`
  + [`DROP SPATIAL REFERENCE SYSTEM`](drop-spatial-reference-system.html "15.1.31 DROP SPATIAL REFERENCE SYSTEM Statement")
  +  `DROP TABLE`
  +  `DROP TABLESPACE`
  +  `DROP TRIGGER`
  +  `DROP USER`
  +  `DROP VIEW`
  +  `GRANT`
  +  `LOAD INDEX`
  +  `OPTIMIZE TABLE`
  +  `RENAME TABLE`
  +  `REPAIR TABLE`
  +  `REVOKE`
  +  `TRUNCATE TABLE`

  This also includes any open cursors (see Section 15.6.6, “Cursors”).

  For more information, see Section 20.5.1.1, “Changing the Primary”.

