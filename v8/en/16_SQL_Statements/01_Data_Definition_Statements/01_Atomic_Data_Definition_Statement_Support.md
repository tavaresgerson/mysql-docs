### 15.1.1 Atomic Data Definition Statement Support

MySQL 8.0 supports atomic Data Definition Language (DDL) statements. This feature is referred to as *atomic DDL*. An atomic DDL statement combines the data dictionary updates, storage engine operations, and binary log writes associated with a DDL operation into a single, atomic operation. The operation is either committed, with applicable changes persisted to the data dictionary, storage engine, and binary log, or is rolled back, even if the server halts during the operation.

Note

*Atomic DDL* is not *transactional DDL*. DDL statements, atomic or otherwise, implicitly end any transaction that is active in the current session, as if you had done a `COMMIT` before executing the statement. This means that DDL statements cannot be performed within another transaction, within transaction control statements such as `START TRANSACTION ... COMMIT`, or combined with other statements within the same transaction.

Atomic DDL is made possible by the introduction of the MySQL data dictionary in MySQL 8.0. In earlier MySQL versions, metadata was stored in metadata files, nontransactional tables, and storage engine-specific dictionaries, which necessitated intermediate commits. Centralized, transactional metadata storage provided by the MySQL data dictionary removed this barrier, making it possible to restructure DDL statement operations to be atomic.

The atomic DDL feature is described under the following topics in this section:

* Supported DDL Statements
* Atomic DDL Characteristics
* Changes in DDL Statement Behavior
* Storage Engine Support
* Viewing DDL Logs

#### Supported DDL Statements

The atomic DDL feature supports both table and non-table DDL statements. Table-related DDL operations require storage engine support, whereas non-table DDL operations do not. Currently, only the `InnoDB` storage engine supports atomic DDL.

* Supported table DDL statements include `CREATE`, `ALTER`, and `DROP` statements for databases, tablespaces, tables, and indexes, and the `TRUNCATE TABLE` statement.

* Supported non-table DDL statements include:

  + `CREATE` and `DROP` statements, and, if applicable, `ALTER` statements for stored programs, triggers, views, and loadable functions.

  + Account management statements: `CREATE`, `ALTER`, `DROP`, and, if applicable, `RENAME` statements for users and roles, as well as `GRANT` and `REVOKE` statements.

The following statements are not supported by the atomic DDL feature:

* Table-related DDL statements that involve a storage engine other than `InnoDB`.

* `INSTALL PLUGIN` and `UNINSTALL PLUGIN` statements.

* `INSTALL COMPONENT` and `UNINSTALL COMPONENT` statements.

* `CREATE SERVER`, `ALTER SERVER`, and `DROP SERVER` statements.

#### Atomic DDL Characteristics

The characteristics of atomic DDL statements include the following:

* Metadata updates, binary log writes, and storage engine operations, where applicable, are combined into a single atomic operation.

* There are no intermediate commits at the SQL layer during the DDL operation.

* Where applicable:

  + The state of data dictionary, routine, event, and loadable function caches is consistent with the status of the DDL operation, meaning that caches are updated to reflect whether or not the DDL operation was completed successfully or rolled back.

  + The storage engine methods involved in a DDL operation do not perform intermediate commits, and the storage engine registers itself as part of the DDL operation.

  + The storage engine supports redo and rollback of DDL operations, which is performed in the *Post-DDL* phase of the DDL operation.

* The visible behaviour of DDL operations is atomic, which changes the behavior of some DDL statements. See Changes in DDL Statement Behavior.

#### Changes in DDL Statement Behavior

This section describes changes in DDL statement behavior due to the introduction of atomic DDL support.

* `DROP TABLE` operations are fully atomic if all named tables use a storage engine which supports atomic DDL. The statement either drops all tables successfully or is rolled back.

  `DROP TABLE` fails with an error if a named table does not exist, and no changes are made, regardless of the storage engine. This change in behavior is demonstrated in the following example, where the `DROP TABLE` statement fails because a named table does not exist:

  ```
  mysql> CREATE TABLE t1 (c1 INT);
  mysql> DROP TABLE t1, t2;
  ERROR 1051 (42S02): Unknown table 'test.t2'
  mysql> SHOW TABLES;
  +----------------+
  | Tables_in_test |
  +----------------+
  | t1             |
  +----------------+
  ```

  Prior to the introduction of atomic DDL, `DROP TABLE` reports an error for the named table that does not exist but succeeds for the named table that does exist:

  ```
  mysql> CREATE TABLE t1 (c1 INT);
  mysql> DROP TABLE t1, t2;
  ERROR 1051 (42S02): Unknown table 'test.t2'
  mysql> SHOW TABLES;
  Empty set (0.00 sec)
  ```

  Note

  Due to this change in behavior, a partially completed `DROP TABLE` statement on a MySQL 5.7 replication source server fails when replicated on a MySQL 8.0 replica. To avoid this failure scenario, use `IF EXISTS` syntax in `DROP TABLE` statements to prevent errors from occurring for tables that do not exist.

* `DROP DATABASE` is atomic if all tables use a storage engine which supports atomic DDL. The statement either drops all objects successfully or is rolled back. However, removal of the database directory from the file system occurs last and is not part of the atomic operation. If removal of the database directory fails due to a file system error or server halt, the `DROP DATABASE` transaction is not rolled back.

* For tables that do not use a storage engine which supports atomic DDL, table deletion occurs outside of the atomic `DROP TABLE` or `DROP DATABASE` transaction. Such table deletions are written to the binary log individually, which limits the discrepancy between the storage engine, data dictionary, and binary log to one table at most in the case of an interrupted `DROP TABLE` or `DROP DATABASE` operation. For operations that drop multiple tables, the tables that do not use a storage engine which supports atomic DDL are dropped before tables that do.

* `CREATE TABLE`, `ALTER TABLE`, `RENAME TABLE`, `TRUNCATE TABLE`, `CREATE TABLESPACE`, and `DROP TABLESPACE` operations for tables that use a storage engine which supports atomic DDL are either fully committed or rolled back if the server halts during their operation. In earlier MySQL releases, interruption of these operations could cause discrepancies between the storage engine, data dictionary, and binary log, or leave behind orphan files. `RENAME TABLE` operations are only atomic if all named tables use a storage engine which supports atomic DDL.

* As of MySQL 8.0.21, on storage engines that support atomic DDL, the `CREATE TABLE ... SELECT` statement is logged as one transaction in the binary log when row-based replication is in use. Previously, it was logged as two transactions, one to create the table, and the other to insert data. A server failure between the two transactions or while inserting data could result in replication of an empty table. With the introduction of atomic DDL support, `CREATE TABLE ... SELECT` statements are now safe for row-based replication and permitted for use with GTID-based replication.

  On storage engines that support both atomic DDL and foreign key constraints, creation of foreign keys is not permitted in `CREATE TABLE ... SELECT` statements when row-based replication is in use. Foreign key constraints can be added later using `ALTER TABLE`.

  When `CREATE TABLE ... SELECT` is applied as an atomic operation, a metadata lock is held on the table while data is inserted, which prevents concurrent access to the table for the duration of the operation.

* `DROP VIEW` fails if a named view does not exist, and no changes are made. The change in behavior is demonstrated in this example, where the `DROP VIEW` statement fails because a named view does not exist:

  ```
  mysql> CREATE VIEW test.viewA AS SELECT * FROM t;
  mysql> DROP VIEW test.viewA, test.viewB;
  ERROR 1051 (42S02): Unknown table 'test.viewB'
  mysql> SHOW FULL TABLES IN test WHERE TABLE_TYPE LIKE 'VIEW';
  +----------------+------------+
  | Tables_in_test | Table_type |
  +----------------+------------+
  | viewA          | VIEW       |
  +----------------+------------+
  ```

  Prior to the introduction of atomic DDL, `DROP VIEW` returns an error for the named view that does not exist but succeeds for the named view that does exist:

  ```
  mysql> CREATE VIEW test.viewA AS SELECT * FROM t;
  mysql> DROP VIEW test.viewA, test.viewB;
  ERROR 1051 (42S02): Unknown table 'test.viewB'
  mysql> SHOW FULL TABLES IN test WHERE TABLE_TYPE LIKE 'VIEW';
  Empty set (0.00 sec)
  ```

  Note

  Due to this change in behavior, a partially completed `DROP VIEW` operation on a MySQL 5.7 replication source server fails when replicated on a MySQL 8.0 replica. To avoid this failure scenario, use `IF EXISTS` syntax in `DROP VIEW` statements to prevent an error from occurring for views that do not exist.

* Partial execution of account management statements is no longer permitted. Account management statements either succeed for all named users or roll back and have no effect if an error occurs. In earlier MySQL versions, account management statements that name multiple users could succeed for some users and fail for others.

  The change in behavior is demonstrated in this example, where the second `CREATE USER` statement returns an error but fails because it cannot succeed for all named users.

  ```
  mysql> CREATE USER userA;
  mysql> CREATE USER userA, userB;
  ERROR 1396 (HY000): Operation CREATE USER failed for 'userA'@'%'
  mysql> SELECT User FROM mysql.user WHERE User LIKE 'user%';
  +-------+
  | User  |
  +-------+
  | userA |
  +-------+
  ```

  Prior to the introduction of atomic DDL, the second `CREATE USER` statement returns an error for the named user that does not exist but succeeds for the named user that does exist:

  ```
  mysql> CREATE USER userA;
  mysql> CREATE USER userA, userB;
  ERROR 1396 (HY000): Operation CREATE USER failed for 'userA'@'%'
  mysql> SELECT User FROM mysql.user WHERE User LIKE 'user%';
  +-------+
  | User  |
  +-------+
  | userA |
  | userB |
  +-------+
  ```

  Note

  Due to this change in behavior, partially completed account management statements on a MySQL 5.7 replication source server fail when replicated on a MySQL 8.0 replica. To avoid this failure scenario, use `IF EXISTS` or `IF NOT EXISTS` syntax, as appropriate, in account management statements to prevent errors related to named users.

#### Storage Engine Support

Currently, only the `InnoDB` storage engine supports atomic DDL. Storage engines that do not support atomic DDL are exempted from DDL atomicity. DDL operations involving exempted storage engines remain capable of introducing inconsistencies that can occur when operations are interrupted or only partially completed.

To support redo and rollback of DDL operations, `InnoDB` writes DDL logs to the `mysql.innodb_ddl_log` table, which is a hidden data dictionary table that resides in the `mysql.ibd` data dictionary tablespace.

To view DDL logs that are written to the `mysql.innodb_ddl_log` table during a DDL operation, enable the `innodb_print_ddl_logs` configuration option. For more information, see Viewing DDL Logs.

Note

The redo logs for changes to the `mysql.innodb_ddl_log` table are flushed to disk immediately regardless of the `innodb_flush_log_at_trx_commit` setting. Flushing the redo logs immediately avoids situations where data files are modified by DDL operations but the redo logs for changes to the `mysql.innodb_ddl_log` table resulting from those operations are not persisted to disk. Such a situation could cause errors during rollback or recovery.

The `InnoDB` storage engine executes DDL operations in phases. DDL operations such as `ALTER TABLE` may perform the *Prepare* and *Perform* phases multiple times prior to the *Commit* phase.

1. *Prepare*: Create the required objects and write the DDL logs to the `mysql.innodb_ddl_log` table. The DDL logs define how to roll forward and roll back the DDL operation.

2. *Perform*: Perform the DDL operation. For example, perform a create routine for a `CREATE TABLE` operation.

3. *Commit*: Update the data dictionary and commit the data dictionary transaction.

4. *Post-DDL*: Replay and remove DDL logs from the `mysql.innodb_ddl_log` table. To ensure that rollback can be performed safely without introducing inconsistencies, file operations such as renaming or removing data files are performed in this final phase. This phase also removes dynamic metadata from the `mysql.innodb_dynamic_metadata` data dictionary table for `DROP TABLE`, `TRUNCATE TABLE`, and other DDL operations that rebuild the table.

DDL logs are replayed and removed from the `mysql.innodb_ddl_log` table during the *Post-DDL* phase, regardless of whether the DDL operation is committed or rolled back. DDL logs should only remain in the `mysql.innodb_ddl_log` table if the server is halted during a DDL operation. In this case, the DDL logs are replayed and removed after recovery.

In a recovery situation, a DDL operation may be committed or rolled back when the server is restarted. If the data dictionary transaction that was performed during the *Commit* phase of a DDL operation is present in the redo log and binary log, the operation is considered successful and is rolled forward. Otherwise, the incomplete data dictionary transaction is rolled back when `InnoDB` replays data dictionary redo logs, and the DDL operation is rolled back.

#### Viewing DDL Logs

To view DDL logs that are written to the `mysql.innodb_ddl_log` data dictionary table during atomic DDL operations that involve the `InnoDB` storage engine, enable `innodb_print_ddl_logs` to have MySQL write the DDL logs to `stderr`. Depending on the host operating system and MySQL configuration, `stderr` may be the error log, terminal, or console window. See Section 7.4.2.2, “Default Error Log Destination Configuration”.

`InnoDB` writes DDL logs to the `mysql.innodb_ddl_log` table to support redo and rollback of DDL operations. The `mysql.innodb_ddl_log` table is a hidden data dictionary table that resides in the `mysql.ibd` data dictionary tablespace. Like other hidden data dictionary tables, the `mysql.innodb_ddl_log` table cannot be accessed directly in non-debug versions of MySQL. (See Section 16.1, “Data Dictionary Schema”.) The structure of the `mysql.innodb_ddl_log` table corresponds to this definition:

```
CREATE TABLE mysql.innodb_ddl_log (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  thread_id BIGINT UNSIGNED NOT NULL,
  type INT UNSIGNED NOT NULL,
  space_id INT UNSIGNED,
  page_no INT UNSIGNED,
  index_id BIGINT UNSIGNED,
  table_id BIGINT UNSIGNED,
  old_file_path VARCHAR(512) COLLATE utf8mb4_bin,
  new_file_path VARCHAR(512) COLLATE utf8mb4_bin,
  KEY(thread_id)
);
```

* `id`: A unique identifier for a DDL log record.

* `thread_id`: Each DDL log record is assigned a `thread_id`, which is used to replay and remove DDL logs that belong to a particular DDL operation. DDL operations that involve multiple data file operations generate multiple DDL log records.

* `type`: The DDL operation type. Types include `FREE` (drop an index tree), `DELETE` (delete a file), `RENAME` (rename a file), or `DROP` (drop metadata from the `mysql.innodb_dynamic_metadata` data dictionary table).

* `space_id`: The tablespace ID.
* `page_no`: A page that contains allocation information; an index tree root page, for example.

* `index_id`: The index ID.
* `table_id`: The table ID.
* `old_file_path`: The old tablespace file path. Used by DDL operations that create or drop tablespace files; also used by DDL operations that rename a tablespace.

* `new_file_path`: The new tablespace file path. Used by DDL operations that rename tablespace files.

This example demonstrates enabling `innodb_print_ddl_logs` to view DDL logs written to `strderr` for a `CREATE TABLE` operation.

```
mysql> SET GLOBAL innodb_print_ddl_logs=1;
mysql> CREATE TABLE t1 (c1 INT) ENGINE = InnoDB;
```

```
[Note] [000000] InnoDB: DDL log insert : [DDL record: DELETE SPACE, id=18, thread_id=7,
space_id=5, old_file_path=./test/t1.ibd]
[Note] [000000] InnoDB: DDL log delete : by id 18
[Note] [000000] InnoDB: DDL log insert : [DDL record: REMOVE CACHE, id=19, thread_id=7,
table_id=1058, new_file_path=test/t1]
[Note] [000000] InnoDB: DDL log delete : by id 19
[Note] [000000] InnoDB: DDL log insert : [DDL record: FREE, id=20, thread_id=7,
space_id=5, index_id=132, page_no=4]
[Note] [000000] InnoDB: DDL log delete : by id 20
[Note] [000000] InnoDB: DDL log post ddl : begin for thread id : 7
[Note] [000000] InnoDB: DDL log post ddl : end for thread id : 7
```
