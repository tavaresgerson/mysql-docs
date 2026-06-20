## 15.1 Data Definition Statements


### 15.1.1 Atomic Data Definition Statement Support

MySQL 9.5 supports atomic Data Definition Language (DDL) statements. This feature is referred to as *atomic DDL*. An atomic DDL statement combines the data dictionary updates, storage engine operations, and binary log writes associated with a DDL operation into a single, atomic operation. The operation is either committed, with applicable changes persisted to the data dictionary, storage engine, and binary log, or is rolled back, even if the server halts during the operation.

Note

*Atomic DDL* is not *transactional DDL*. DDL statements, atomic or otherwise, implicitly end any transaction that is active in the current session, as if you had done a `COMMIT` before executing the statement. This means that DDL statements cannot be performed within another transaction, within transaction control statements such as [`START TRANSACTION ... COMMIT`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"), or combined with other statements within the same transaction.

Atomic DDL is made possible by the MySQL data dictionary, which provides centralized, transactional metadata storage.

The atomic DDL feature is described under the following topics in this section:

* Supported DDL Statements
* Atomic DDL Characteristics
* DDL Statement Behavior
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

* The visible behaviour of DDL operations is atomic.

#### DDL Statement Behavior

This section describes some important aspects of DDL statement behavior when using a storage engine that support atomic DDL, such as `InnoDB`.

* `DROP TABLE` operations are fully atomic if all named tables use a storage engine which supports atomic DDL. The statement either drops all tables successfully or is rolled back.

  `DROP TABLE` fails with an error if a named table does not exist, and no changes are made, regardless of the storage engine.

* `CREATE DATABASE` and `DROP DATABASE` are fully atomic and crash-safe, provided that all tables in the named database use a storage engine which supports atomic DDL, in which case the statement either adds or drops all objects successfully, or is rolled back.

* For tables that do not use a storage engine which supports atomic DDL, table deletion occurs outside of the atomic `DROP TABLE` or `DROP DATABASE` transaction. Such table deletions are written to the binary log individually, which limits the discrepancy between the storage engine, data dictionary, and binary log to one table at most in the case of an interrupted `DROP TABLE` or `DROP DATABASE` operation. For operations that drop multiple tables, any tables that do not use a storage engine which supports atomic DDL are dropped before tables that do so.

* `CREATE TABLE`, `ALTER TABLE`, `RENAME TABLE`, `TRUNCATE TABLE`, `CREATE TABLESPACE`, and `DROP TABLESPACE` operations for tables that use a storage engine which supports atomic DDL are either fully committed or rolled back if the server halts during their operation. [`RENAME TABLE`](rename-table.html "15.1.41 RENAME TABLE Statement") operations are atomic only if all named tables use a storage engine which supports atomic DDL.

* For storage engines that support atomic DDL, the [`CREATE TABLE ... SELECT`](create-table-select.html "15.1.24.4 CREATE TABLE ... SELECT Statement") statement is logged as one transaction in the binary log when row-based replication is in use.

  On storage engines that support both atomic DDL and foreign key constraints, creation of foreign keys is not permitted in [`CREATE TABLE ... SELECT`](create-table-select.html "15.1.24.4 CREATE TABLE ... SELECT Statement") statements when row-based replication is in use. Foreign key constraints can be added later using `ALTER TABLE`.

  When [`CREATE TABLE ... SELECT`](create-table-select.html "15.1.24.4 CREATE TABLE ... SELECT Statement") is applied as an atomic operation, a metadata lock is held on the table while data is inserted, which prevents concurrent access to the table for the duration of the operation.

* `DROP VIEW` fails if a named view does not exist, and no changes are made.

* Account management statements either succeed for all named users or roll back and have no effect if an error occurs.

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

4. *Post-DDL*: Replay and remove DDL logs from the `mysql.innodb_ddl_log` table. To ensure that rollback can be performed safely without introducing inconsistencies, file operations such as renaming or removing data files are performed in this final phase. This phase also removes dynamic metadata from the `mysql.innodb_dynamic_metadata` data dictionary table for [`DROP TABLE`](drop-table.html "15.1.37 DROP TABLE Statement"), [`TRUNCATE TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement"), and other DDL operations that rebuild the table.

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


### 15.1.2 ALTER DATABASE Statement

```
ALTER {DATABASE | SCHEMA} [db_name]
    alter_option ...

alter_option: {
    [DEFAULT] CHARACTER SET [=] charset_name
  | [DEFAULT] COLLATE [=] collation_name
  | [DEFAULT] ENCRYPTION [=] {'Y' | 'N'}
  | READ ONLY [=] {DEFAULT | 0 | 1}
}
```

`ALTER DATABASE` enables you to change the overall characteristics of a database. These characteristics are stored in the data dictionary. This statement requires the `ALTER` privilege on the database. [`ALTER SCHEMA`](alter-database.html "15.1.2 ALTER DATABASE Statement") is a synonym for [`ALTER DATABASE`](alter-database.html "15.1.2 ALTER DATABASE Statement").

If the database name is omitted, the statement applies to the default database. In that case, an error occurs if there is no default database.

For any *`alter_option`* omitted from the statement, the database retains its current option value, with the exception that changing the character set may change the collation and vice versa.

* Character Set and Collation Options
* Encryption Option
* Read Only Option

#### Character Set and Collation Options

The `CHARACTER SET` option changes the default database character set. The `COLLATE` option changes the default database collation. For information about character set and collation names, see Chapter 12, *Character Sets, Collations, Unicode*.

To see the available character sets and collations, use the `SHOW CHARACTER SET` and `SHOW COLLATION` statements, respectively. See Section 15.7.7.4, “SHOW CHARACTER SET Statement”, and Section 15.7.7.5, “SHOW COLLATION Statement”.

A stored routine that uses the database defaults when the routine is created includes those defaults as part of its definition. (In a stored routine, variables with character data types use the database defaults if the character set or collation are not specified explicitly. See Section 15.1.21, “CREATE PROCEDURE and CREATE FUNCTION Statements”.) If you change the default character set or collation for a database, any stored routines that are to use the new defaults must be dropped and recreated.

#### Encryption Option

The `ENCRYPTION` option, defines the default database encryption, which is inherited by tables created in the database. The permitted values are `'Y'` (encryption enabled) and `'N'` (encryption disabled).

The `mysql` system schema cannot be set to default encryption. The existing tables within it are part of the general `mysql` tablespace, which may be encrypted. The `information_schema` contains only views. It is not possible to create any tables within it. There is nothing on the disk to encrypt. All tables in the `performance_schema` use the `PERFORMANCE_SCHEMA` engine, which is purely in-memory. It is not possible to create any other tables in it. There is nothing on the disk to encrypt.

Only newly created tables inherit the default database encryption. For existing tables associated with the database, their encryption remains unchanged. If the `table_encryption_privilege_check` system variable is enabled, the `TABLE_ENCRYPTION_ADMIN` privilege is required to specify a default encryption setting that differs from the value of the `default_table_encryption` system variable. For more information, see Defining an Encryption Default for Schemas and General Tablespaces.

#### Read Only Option

The `READ ONLY` option controls whether to permit modification of the database and objects within it. The permitted values are `DEFAULT` or `0` (not read only) and `1` (read only). This option is useful for database migration because a database for which `READ ONLY` is enabled can be migrated to another MySQL instance without concern that the database might be changed during the operation.

With NDB Cluster, making a database read only on one **mysqld** server is synchronized to other **mysqld** servers in the same cluster, so that the database becomes read only on all **mysqld** servers.

The `READ ONLY` option, if enabled, is displayed in the `INFORMATION_SCHEMA` `SCHEMATA_EXTENSIONS` table. See Section 28.3.38, “The INFORMATION_SCHEMA SCHEMATA_EXTENSIONS Table”.

The `READ ONLY` option cannot be enabled for these system schemas: `mysql`, `information_schema`, `performance_schema`.

In `ALTER DATABASE` statements, the `READ ONLY` option interacts with other instances of itself and with other options as follows:

* An error occurs if multiple instances of `READ ONLY` conflict (for example, `READ ONLY = 1 READ ONLY = 0`).

* An `ALTER DATABASE` statement that contains only (nonconflicting) `READ ONLY` options is permitted even for a read-only database.

* A mix of (nonconflicting) `READ ONLY` options with other options is permitted if the read-only state of the database either before or after the statement permits modifications. If the read-only state both before and after prohibits changes, an error occurs.

  This statement succeeds whether or not the database is read only:

  ```
  ALTER DATABASE mydb READ ONLY = 0 DEFAULT COLLATE utf8mb4_bin;
  ```

  This statement succeeds if the database is not read only, but fails if it is already read only:

  ```
  ALTER DATABASE mydb READ ONLY = 1 DEFAULT COLLATE utf8mb4_bin;
  ```

Enabling `READ ONLY` affects all users of the database, with these exceptions that are not subject to read-only checks:

* Statements executed by the server as part of server initialization, restart, upgrade, or replication.

* Statements in a file named at server startup by the `init_file` system variable.

* `TEMPORARY` tables; it is possible to create, alter, drop, and write to `TEMPORARY` tables in a read-only database.

* NDB Cluster non-SQL inserts and updates.

Other than for the excepted operations just listed, enabling `READ ONLY` prohibits write operations to the database and its objects, including their definitions, data, and metadata. The following list details affected SQL statements and operations:

* The database itself:

  + `CREATE DATABASE`
  + `ALTER DATABASE` (except to change the `READ ONLY` option)

  + `DROP DATABASE`
* Views:

  + `CREATE VIEW`
  + `ALTER VIEW`
  + `DROP VIEW`
  + Selecting from views that invoke functions with side effects.

  + Updating updatable views.
  + Statements that create or drop objects in a writable database are rejected if they affect metadata of a view in a read-only database (for example, by making the view valid or invalid).

* Stored routines:

  + `CREATE PROCEDURE`
  + `DROP PROCEDURE`
  + `CALL` (of procedures with side effects)

  + `CREATE FUNCTION`
  + `DROP FUNCTION`
  + `SELECT` (of functions with side effects)

  + For procedures and functions, read-only checks follow prelocking behavior. For `CALL` statements, read-only checks are done on a per-statement basis, so if some conditionally executed statement writing to a read-only database does not actually execute, the call still succeeds. On the other hand, for a function called within a `SELECT`, execution of the function body happens in prelocked mode. As long as a some statement within the function writes to a read-only database, execution of the function fails with an error regardless of whether the statement actually executes.

* Triggers:

  + `CREATE TRIGGER`
  + `DROP TRIGGER`
  + Trigger invocation.
* Events:

  + `CREATE EVENT`
  + `ALTER EVENT`
  + `DROP EVENT`
  + Event execution:

    - Executing an event in the database fails because that would change the last-execution timestamp, which is event metadata stored in the data dictionary. Failure of event execution also has the effect of causing the event scheduler to stop.

    - If an event writes to an object in a read-only database, execution of the event fails with an error, but the event scheduler is not stopped.

* Tables:

  + `CREATE TABLE`
  + `ALTER TABLE`
  + `CREATE INDEX`
  + `DROP INDEX`
  + `RENAME TABLE`
  + `TRUNCATE TABLE`
  + `DROP TABLE`
  + `DELETE`
  + `INSERT`
  + `IMPORT TABLE`
  + `LOAD DATA`
  + `LOAD XML`
  + `REPLACE`
  + `UPDATE`
  + For cascading foreign keys where the child table is in a read-only database, updates and deletes on the parent are rejected even if the child table is not directly affected.

  + For a `MERGE` table such as `CREATE TABLE s1.t(i int) ENGINE MERGE UNION (s2.t, s3.t), INSERT_METHOD=...`, the following behavior applies:

    - Inserting into the `MERGE` table (`INSERT into s1.t`) fails if at least one of `s1`, `s2`, `s3` is read only, regardless of insert method. The insert is refused even if it would actually end up in a writable table.

    - Dropping the `MERGE` table (`DROP TABLE s1.t`) succeeds as long as `s1` is not read only. It is permitted to drop a `MERGE` table that refers to a read-only database.

An `ALTER DATABASE` statement blocks until all concurrent transactions that have already accessed an object in the database being altered have committed. Conversely, a write transaction accessing an object in a database being altered in a concurrent `ALTER DATABASE` blocks until the `ALTER DATABASE` has committed.

If the Clone plugin is used to clone a local or remote data directory, the databases in the clone retain the read-only state they had in the source data directory. The read-only state does not affect the cloning process itself. If it is not desirable to have the same database read-only state in the clone, the option must be changed explicitly for the clone after the cloning process has finished, using `ALTER DATABASE` operations on the clone.

When cloning from a donor to a recipient, if the recipient has a user database that is read only, cloning fails with an error message. Cloning may be retried after making the database writable.

`READ ONLY` is permitted for `ALTER DATABASE`, but not for `CREATE DATABASE`. However, for a read-only database, the statement produced by `SHOW CREATE DATABASE` does include `READ ONLY=1` within a comment to indicate its read-only status:

```
mysql> ALTER DATABASE mydb READ ONLY = 1;
mysql> SHOW CREATE DATABASE mydb\G
*************************** 1. row ***************************
       Database: mydb
Create Database: CREATE DATABASE `mydb`
                 /*!40100 DEFAULT CHARACTER SET utf8mb4
                          COLLATE utf8mb4_0900_ai_ci */
                 /*!80016 DEFAULT ENCRYPTION='N' */
                 /* READ ONLY = 1 */
```

If the server executes a [`CREATE DATABASE`](create-database.html "15.1.14 CREATE DATABASE Statement") statement containing such a comment, the server ignores the comment and the `READ ONLY` option is not processed. This has implications for **mysqldump**, which uses [`SHOW CREATE DATABASE`](show-create-database.html "15.7.7.7 SHOW CREATE DATABASE Statement") to produce [`CREATE DATABASE`](create-database.html "15.1.14 CREATE DATABASE Statement") statements in dump output:

* In a dump file, the [`CREATE DATABASE`](create-database.html "15.1.14 CREATE DATABASE Statement") statement for a read-only database contains the commented `READ ONLY` option.

* The dump file can be restored as usual, but because the server ignores the commented `READ ONLY` option, the restored database is *not* read only. If the database is to be read only after being restored, you must execute `ALTER DATABASE` manually to make it so.

Suppose that `mydb` is read only and you dump it as follows:

```
$> mysqldump --databases mydb > mydb.sql
```

A restore operation later must be followed by `ALTER DATABASE` if `mydb` should still be read only:

```
$> mysql
mysql> SOURCE mydb.sql;
mysql> ALTER DATABASE mydb READ ONLY = 1;
```

MySQL Enterprise Backup is not subject to this issue. It backs up and restores a read-only database like any other, but enables the `READ ONLY` option at restore time if it was enabled at backup time.

`ALTER DATABASE` is written to the binary log, so a change to the `READ ONLY` option on a replication source server also affects replicas. To prevent this from happening, binary logging must be disabled prior to execution of the `ALTER DATABASE` statement. For example, to prepare for migrating a database without affecting replicas, perform these operations:

1. Within a single session, disable binary logging and enable `READ ONLY` for the database:

   ```
   mysql> SET sql_log_bin = OFF;
   mysql> ALTER DATABASE mydb READ ONLY = 1;
   ```

2. Dump the database, for example, with **mysqldump**:

   ```
   $> mysqldump --databases mydb > mydb.sql
   ```

3. Within a single session, disable binary logging and disable `READ ONLY` for the database:

   ```
   mysql> SET sql_log_bin = OFF;
   mysql> ALTER DATABASE mydb READ ONLY = 0;
   ```


### 15.1.3 ALTER EVENT Statement

```
ALTER
    [DEFINER = user]
    EVENT event_name
    [ON SCHEDULE schedule]
    [ON COMPLETION [NOT] PRESERVE]
    [RENAME TO new_event_name]
    [ENABLE | DISABLE | DISABLE ON {REPLICA | SLAVE}]
    [COMMENT 'string']
    [DO event_body]
```

The `ALTER EVENT` statement changes one or more of the characteristics of an existing event without the need to drop and recreate it. The syntax for each of the `DEFINER`, `ON SCHEDULE`, `ON COMPLETION`, `COMMENT`, `ENABLE` / `DISABLE`, and `DO` clauses is exactly the same as when used with `CREATE EVENT`. (See Section 15.1.15, “CREATE EVENT Statement”.)

Any user can alter an event defined on a database for which that user has the `EVENT` privilege. When a user executes a successful [`ALTER EVENT`](alter-event.html "15.1.3 ALTER EVENT Statement") statement, that user becomes the definer for the affected event.

`ALTER EVENT` works only with an existing event:

```
mysql> ALTER EVENT no_such_event
     >     ON SCHEDULE
     >       EVERY '2:3' DAY_HOUR;
ERROR 1517 (HY000): Unknown event 'no_such_event'
```

In each of the following examples, assume that the event named `myevent` is defined as shown here:

```
CREATE EVENT myevent
    ON SCHEDULE
      EVERY 6 HOUR
    COMMENT 'A sample comment.'
    DO
      UPDATE myschema.mytable SET mycol = mycol + 1;
```

The following statement changes the schedule for `myevent` from once every six hours starting immediately to once every twelve hours, starting four hours from the time the statement is run:

```
ALTER EVENT myevent
    ON SCHEDULE
      EVERY 12 HOUR
    STARTS CURRENT_TIMESTAMP + INTERVAL 4 HOUR;
```

It is possible to change multiple characteristics of an event in a single statement. This example changes the SQL statement executed by `myevent` to one that deletes all records from `mytable`; it also changes the schedule for the event such that it executes once, one day after this `ALTER EVENT` statement is run.

```
ALTER EVENT myevent
    ON SCHEDULE
      AT CURRENT_TIMESTAMP + INTERVAL 1 DAY
    DO
      TRUNCATE TABLE myschema.mytable;
```

Specify the options in an [`ALTER EVENT`](alter-event.html "15.1.3 ALTER EVENT Statement") statement only for those characteristics that you want to change; omitted options keep their existing values. This includes any default values for [`CREATE EVENT`](create-event.html "15.1.15 CREATE EVENT Statement") such as `ENABLE`.

To disable `myevent`, use this `ALTER EVENT` statement:

```
ALTER EVENT myevent
    DISABLE;
```

The `ON SCHEDULE` clause may use expressions involving built-in MySQL functions and user variables to obtain any of the *`timestamp`* or *`interval`* values which it contains. You cannot use stored routines or loadable functions in such expressions, and you cannot use any table references; however, you can use `SELECT FROM DUAL`. This is true for both `ALTER EVENT` and `CREATE EVENT` statements. References to stored routines, loadable functions, and tables in such cases are specifically not permitted, and fail with an error (see Bug #22830).

Although an `ALTER EVENT` statement that contains another `ALTER EVENT` statement in its `DO` clause appears to succeed, when the server attempts to execute the resulting scheduled event, the execution fails with an error.

To rename an event, use the [`ALTER EVENT`](alter-event.html "15.1.3 ALTER EVENT Statement") statement's `RENAME TO` clause. This statement renames the event `myevent` to `yourevent`:

```
ALTER EVENT myevent
    RENAME TO yourevent;
```

You can also move an event to a different database using `ALTER EVENT ... RENAME TO ...` and `db_name.event_name` notation, as shown here:

```
ALTER EVENT olddb.myevent
    RENAME TO newdb.myevent;
```

To execute the previous statement, the user executing it must have the `EVENT` privilege on both the `olddb` and `newdb` databases.

Note

There is no `RENAME EVENT` statement.

The value `DISABLE ON REPLICA` is used on a replica instead of `ENABLE` or `DISABLE` to indicate an event that was created on the replication source server and replicated to the replica, but that is not executed on the replica. Normally, `DISABLE ON REPLICA` is set automatically as required; however, there are some circumstances under which you may want or need to change it manually. See Section 19.5.1.16, “Replication of Invoked Features”, for more information.

`DISABLE ON REPLICA` replaces `DISABLE ON SLAVE`, which is deprecated, and subject to removal in a future version of MySQL.


### 15.1.4 ALTER FUNCTION Statement

```
ALTER FUNCTION func_name [characteristic ...]

characteristic: {
    COMMENT 'string'
  | LANGUAGE {SQL | JAVASCRIPT}
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }
  | USING([library_reference][, library_reference][, ...])
}
```

This statement can be used to change the characteristics of a stored function. More than one change may be specified in an `ALTER FUNCTION` statement. However, you cannot change the parameters or body of a stored function using this statement; to make such changes, you must drop and re-create the function using [`DROP FUNCTION`](drop-function.html "15.1.30 DROP FUNCTION Statement") and [`CREATE FUNCTION`](create-function.html "15.1.16 CREATE FUNCTION Statement").

You must have the `ALTER ROUTINE` privilege for the function. (That privilege is granted automatically to the function creator.) If binary logging is enabled, the `ALTER FUNCTION` statement might also require the `SUPER` privilege, as described in Section 27.9, “Stored Program Binary Logging”.

The `USING` clause is specific to stored programs written in JavaScript (see Section 27.3, “JavaScript Stored Programs”), and allows you to specify a list of zero or more libraries to be imported by the stored function, causing any previous such list to be removed, just as it does with [`ALTER PROCEDURE`](alter-procedure.html "15.1.9 ALTER PROCEDURE Statement"). See Section 15.1.9, “ALTER PROCEDURE Statement”, for more detailed information.


### 15.1.5 ALTER INSTANCE Statement

```
ALTER INSTANCE instance_action

instance_action: {
  | {ENABLE|DISABLE} INNODB REDO_LOG
  | ROTATE INNODB MASTER KEY
  | ROTATE BINLOG MASTER KEY
  | RELOAD TLS
      [FOR CHANNEL {mysql_main | mysql_admin}]
      [NO ROLLBACK ON ERROR]
  | RELOAD KEYRING
}
```

`ALTER INSTANCE` defines actions applicable to a MySQL server instance. The statement supports these actions:

* `ALTER INSTANCE {ENABLE | DISABLE} INNODB REDO_LOG`

  This action enables or disables `InnoDB` redo logging. Redo logging is enabled by default. This feature is intended only for loading data into a new MySQL instance. The statement is not written to the binary log.

  Warning

  *Do not disable redo logging on a production system.* While it is permitted to shut down and restart the server while redo logging is disabled, an unexpected server stoppage while redo logging is disabled can cause data loss and instance corruption.

  An [`ALTER INSTANCE [ENABLE|DISABLE] INNODB REDO_LOG`](alter-instance.html "15.1.5 ALTER INSTANCE Statement") operation requires an exclusive backup lock, which prevents other `ALTER INSTANCE` operations from executing concurrently. Other [`ALTER INSTANCE`](alter-instance.html "15.1.5 ALTER INSTANCE Statement") operations must wait for the lock to be released before executing.

  For more information, see Disabling Redo Logging.

* `ALTER INSTANCE ROTATE INNODB MASTER KEY`

  This action rotates the master encryption key used for `InnoDB` tablespace encryption. Key rotation requires the `ENCRYPTION_KEY_ADMIN` or `SUPER` privilege. To perform this action, a keyring plugin must be installed and configured. For instructions, see Section 8.4.5, “The MySQL Keyring”.

  `ALTER INSTANCE ROTATE INNODB MASTER KEY` supports concurrent DML. However, it cannot be run concurrently with [`CREATE TABLE ... ENCRYPTION`](create-table.html "15.1.24 CREATE TABLE Statement") or [`ALTER TABLE ... ENCRYPTION`](alter-table.html "15.1.11 ALTER TABLE Statement") operations, and locks are taken to prevent conflicts that could arise from concurrent execution of these statements. If one of the conflicting statements is running, it must complete before another can proceed.

  `ALTER INSTANCE ROTATE INNODB MASTER KEY` statements are written to the binary log so that they can be executed on replicated servers.

  For additional `ALTER INSTANCE ROTATE INNODB MASTER KEY` usage information, see Section 17.13, “InnoDB Data-at-Rest Encryption”.

* `ALTER INSTANCE ROTATE BINLOG MASTER KEY`

  This action rotates the binary log master key used for binary log encryption. Key rotation for the binary log master key requires the `BINLOG_ENCRYPTION_ADMIN` or `SUPER` privilege. The statement cannot be used if the `binlog_encryption` system variable is set to `OFF`. To perform this action, a keyring plugin must be installed and configured. For instructions, see Section 8.4.5, “The MySQL Keyring”.

  `ALTER INSTANCE ROTATE BINLOG MASTER KEY` actions are not written to the binary log and are not executed on replicas. Binary log master key rotation can therefore be carried out in replication environments including a mix of MySQL versions. To schedule regular rotation of the binary log master key on all applicable source and replica servers, you can enable the MySQL Event Scheduler on each server and issue the `ALTER INSTANCE ROTATE BINLOG MASTER KEY` statement using a `CREATE EVENT` statement. If you rotate the binary log master key because you suspect that the current or any of the previous binary log master keys might have been compromised, issue the statement on every applicable source and replica server, which enables you to verify immediate compliance.

  For additional `ALTER INSTANCE ROTATE BINLOG MASTER KEY` usage information, including what to do if the process does not complete correctly or is interrupted by an unexpected server halt, see Section 19.3.2, “Encrypting Binary Log Files and Relay Log Files”.

* `ALTER INSTANCE RELOAD TLS`

  This action reconfigures a TLS context from the current values of the system variables that define the context. It also updates the status variables that reflect the active context values. This action requires the `CONNECTION_ADMIN` privilege. For additional information about reconfiguring the TLS context, including which system and status variables are context-related, see [Server-Side Runtime Configuration and Monitoring for Encrypted Connections](using-encrypted-connections.html#using-encrypted-connections-server-side-runtime-configuration "Server-Side Runtime Configuration and Monitoring for Encrypted Connections").

  By default, the statement reloads the TLS context for the main connection interface. If the `FOR CHANNEL` clause is given, the statement reloads the TLS context for the named channel: `mysql_main` for the main connection interface, `mysql_admin` for the administrative connection interface. For information about the different interfaces, see Section 7.1.12.1, “Connection Interfaces”. The updated TLS context properties are exposed in the Performance Schema `tls_channel_status` table. See Section 29.12.22.11, “The tls_channel_status Table”.

  Updating the TLS context for the main interface may also affect the administrative interface because unless some nondefault TLS value is configured for that interface, it uses the same TLS context as the main interface.

  Note

  When you reload the TLS context, OpenSSL reloads the file containing the CRL (certificate revocation list) as part of the process. If the CRL file is large, the server allocates a large chunk of memory (ten times the file size), which is doubled while the new instance is being loaded and the old one has not yet been released. The process resident memory is not immediately reduced after a large allocation is freed, so if you issue the `ALTER INSTANCE RELOAD TLS` statement repeatedly with a large CRL file, the process resident memory usage may grow as a result of this.

  By default, the `RELOAD TLS` action rolls back with an error and has no effect if the configuration values do not permit creation of the new TLS context. The previous context values continue to be used for new connections. If the optional `NO ROLLBACK ON ERROR` clause is given and the new context cannot be created, rollback does not occur. Instead, a warning is generated and encryption is disabled for new connections on the interface to which the statement applies.

  `ALTER INSTANCE RELOAD TLS` statements are not written to the binary log (and thus are not replicated). TLS configuration is local and depends on local files not necessarily present on all servers involved.

* `ALTER INSTANCE RELOAD KEYRING`

  If a keyring component is installed, this action tells the component to re-read its configuration file and reinitialize any keyring in-memory data. If you modify the component configuration at runtime, the new configuration does not take effect until you perform this action. Keyring reloading requires the `ENCRYPTION_KEY_ADMIN` privilege.

  This action enables reconfiguring only the currently installed keyring component. It does not enable changing which component is installed. For example, if you change the configuration for the installed keyring component, [`ALTER INSTANCE RELOAD KEYRING`](alter-instance.html#alter-instance-reload-keyring) causes the new configuration to take effect. On the other hand, if you change the keyring component named in the server manifest file, `ALTER INSTANCE RELOAD KEYRING` has no effect and the current component remains installed.

  `ALTER INSTANCE RELOAD KEYRING` statements are not written to the binary log (and thus are not replicated).


### 15.1.6 ALTER JSON DUALITY VIEW Statement

```
ALTER
    [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
    [DEFINER = user]
    [SQL SECURITY { DEFINER | INVOKER }]
    JSON DUALITY VIEW view_name
    AS json_duality_select_statement
    [WITH [CASCADED | LOCAL] CHECK OPTON]

json_duality_select_statement:
    SELECT json_duality_object_expression
    FROM [schema_name .] root_table_name [AS table_alias_name]
```

This statement updates a JSON duality view.

*`json_duality_select_statement`* follows the same rules as for [`CREATE JSON DUALITY VIEW`](create-json-duality-view.html "15.1.17 CREATE JSON DUALITY VIEW Statement"). *`json_duality_object_expression`* is a value returned by `JSON_DUALITY_OBJECT()`. See the description of that function for information about its arguments.

For more information, see Section 27.7, “JSON Duality Views”.


### 15.1.7 ALTER LIBRARY Statement

```
ALTER LIBRARY library_name
    COMMENT "comment_text"
```

This statement adds a comment to the named JavaScript library, or replaces the existing comment if there is one. Following execution of this statement, the updated comment can be viewed in the output of `SHOW CREATE LIBRARY` and in the `ROUTINE_COMMENT` column of the Information Schema `LIBRARIES` table. The comment text must be quoted.

To remove a comment from a library without replacing it, specify an empty comment string (`COMMENT ""` or `COMMENT ''`).


### 15.1.8 ALTER LOGFILE GROUP Statement

```
ALTER LOGFILE GROUP logfile_group
    ADD UNDOFILE 'file_name'
    [INITIAL_SIZE [=] size]
    [WAIT]
    ENGINE [=] engine_name
```

This statement adds an `UNDO` file named '*`file_name`*' to an existing log file group *`logfile_group`*. An `ALTER LOGFILE GROUP` statement has one and only one `ADD UNDOFILE` clause. No `DROP UNDOFILE` clause is currently supported.

Note

All NDB Cluster Disk Data objects share the same namespace. This means that *each Disk Data object* must be uniquely named (and not merely each Disk Data object of a given type). For example, you cannot have a tablespace and an undo log file with the same name, or an undo log file and a data file with the same name.

The optional `INITIAL_SIZE` parameter sets the `UNDO` file's initial size in bytes; if not specified, the initial size defaults to 134217728 (128 MB). You may optionally follow *`size`* with a one-letter abbreviation for an order of magnitude, similar to those used in `my.cnf`. Generally, this is one of the letters `M` (megabytes) or `G` (gigabytes). (Bug #13116514, Bug #16104705, Bug #62858)

On 32-bit systems, the maximum supported value for `INITIAL_SIZE` is 4294967296 (4 GB). (Bug #29186)

The minimum allowed value for `INITIAL_SIZE` is 1048576 (1 MB). (Bug #29574)

Note

`WAIT` is parsed but otherwise ignored. This keyword currently has no effect, and is intended for future expansion.

The `ENGINE` clause (required) determines the storage engine which is used by this log file group, with *`engine_name`* being the name of the storage engine. Currently, the only accepted values for *`engine_name`* are “`NDBCLUSTER`” and “`NDB`”. The two values are equivalent.

Here is an example, which assumes that the log file group `lg_3` has already been created using `CREATE LOGFILE GROUP` (see Section 15.1.20, “CREATE LOGFILE GROUP Statement”):

```
ALTER LOGFILE GROUP lg_3
    ADD UNDOFILE 'undo_10.dat'
    INITIAL_SIZE=32M
    ENGINE=NDBCLUSTER;
```

When `ALTER LOGFILE GROUP` is used with `ENGINE = NDBCLUSTER` (alternatively, `ENGINE = NDB`), an undo log file is created on each NDB Cluster data node. You can verify that the undo files were created and obtain information about them by querying the Information Schema `FILES` table. For example:

```
mysql> SELECT FILE_NAME, LOGFILE_GROUP_NUMBER, EXTRA
    -> FROM INFORMATION_SCHEMA.FILES
    -> WHERE LOGFILE_GROUP_NAME = 'lg_3';
+-------------+----------------------+----------------+
| FILE_NAME   | LOGFILE_GROUP_NUMBER | EXTRA          |
+-------------+----------------------+----------------+
| newdata.dat |                    0 | CLUSTER_NODE=3 |
| newdata.dat |                    0 | CLUSTER_NODE=4 |
| undo_10.dat |                   11 | CLUSTER_NODE=3 |
| undo_10.dat |                   11 | CLUSTER_NODE=4 |
+-------------+----------------------+----------------+
4 rows in set (0.01 sec)
```

(See Section 28.3.15, “The INFORMATION_SCHEMA FILES Table”.)

Memory used for `UNDO_BUFFER_SIZE` comes from the global pool whose size is determined by the value of the `SharedGlobalMemory` data node configuration parameter. This includes any default value implied for this option by the setting of the `InitialLogFileGroup` data node configuration parameter.

`ALTER LOGFILE GROUP` is useful only with Disk Data storage for NDB Cluster. For more information, see Section 25.6.11, “NDB Cluster Disk Data Tables”.


### 15.1.9 ALTER PROCEDURE Statement

```
ALTER PROCEDURE proc_name [characteristic ...]

characteristic: {
    COMMENT 'string'
  | LANGUAGE {SQL | JAVASCRIPT}
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }
  | USING([library_reference][, library_reference][, ...])
}
```

This statement can be used to change the characteristics of a stored procedure. More than one change may be specified in an `ALTER PROCEDURE` statement. However, you cannot change the parameters or body of a stored procedure using this statement; to make such changes, you must drop and re-create the procedure using [`DROP PROCEDURE`](drop-procedure.html "15.1.34 DROP PROCEDURE and DROP FUNCTION Statements") and [`CREATE PROCEDURE`](create-procedure.html "15.1.21 CREATE PROCEDURE and CREATE FUNCTION Statements").

You must have the `ALTER ROUTINE` privilege for the procedure. By default, that privilege is granted automatically to the procedure creator. This behavior can be changed by disabling the `automatic_sp_privileges` system variable. See Section 27.2.2, “Stored Routines and MySQL Privileges”.

The `USING` clause is specific to stored programs written in JavaScript (see Section 27.3, “JavaScript Stored Programs”), and allows you to specify a list of zero or more libraries to be imported by the stored procedure, causing any previous such list to be removed (just as it does with [`ALTER FUNCTION`](alter-function.html "15.1.4 ALTER FUNCTION Statement")). Possible results are listed here:

* *A `USING` clause is employed, and lists one or more libraries*: Following execution of the `ALTER PROCEDURE` statement, the procedure imports only those libraries listed in the `ALTER FUNCTION` statement; any libraries listed previously are removed from the list and no longer imported.

* *The statement includes an empty `USING` clause*: All libraries previously imported are removed from the list; the function no longer imports any libraries.

* *`USING` is not used*: No changes are made to the list of libraries specified when the procedure was created.

Examples:

* `ALTER PROCEDURE myproc USING(lib1, lib2);`

  (`USING` with a non-empty list:) Following execution, `myproc` imports *only* the libraries `lib1` and `lib2`, and no other libraries.

* `ALTER PROCEDURE myproc USING();`

  (`USING` with an empty list:) Following execution, `myproc` no longer imports any libraries at all.

* `ALTER PROCEDURE myproc COMMENT "This procedure was altered";`

  (No `USING` clause:) The procedure continues to import the same libraries as it did before this was issued.


### 15.1.10 ALTER SERVER Statement

```
ALTER SERVER  server_name
    OPTIONS (option[, option] ...)
```

Alters the server information for `server_name`, adjusting any of the options permitted in the `CREATE SERVER` statement. The corresponding fields in the `mysql.servers` table are updated accordingly. This statement requires the `SUPER` privilege.

For example, to update the `USER` option:

```
ALTER SERVER s OPTIONS (USER 'sally');
```

`ALTER SERVER` causes an implicit commit. See Section 15.3.3, “Statements That Cause an Implicit Commit”.

`ALTER SERVER` is not written to the binary log, regardless of the logging format that is in use.


### 15.1.11 ALTER TABLE Statement

```
ALTER TABLE tbl_name
    [alter_option [, alter_option] ...]
    [partition_options]

alter_option: {
    table_options
  | ADD [COLUMN] col_name column_definition
        [FIRST | AFTER col_name]
  | ADD [COLUMN] (col_name column_definition,...)
  | ADD {INDEX | KEY} [index_name]
        [index_type] (key_part,...) [index_option] ...
  | ADD {FULLTEXT | SPATIAL} [INDEX | KEY] [index_name]
        (key_part,...) [index_option] ...
  | ADD [CONSTRAINT [symbol]] PRIMARY KEY
        [index_type] (key_part,...)
        [index_option] ...
  | ADD [CONSTRAINT [symbol]] UNIQUE [INDEX | KEY]
        [index_name] [index_type] (key_part,...)
        [index_option] ...
  | ADD [CONSTRAINT [symbol]] FOREIGN KEY
        [index_name] (col_name,...)
        reference_definition
  | ADD [CONSTRAINT [symbol]] CHECK (expr) [[NOT] ENFORCED]
  | DROP {CHECK | CONSTRAINT} symbol
  | ALTER {CHECK | CONSTRAINT} symbol [NOT] ENFORCED
  | ALGORITHM [=] {DEFAULT | INSTANT | INPLACE | COPY}
  | ALTER [COLUMN] col_name {
        SET DEFAULT {literal | (expr)}
      | SET {VISIBLE | INVISIBLE}
      | DROP DEFAULT
    }
  | ALTER INDEX index_name {VISIBLE | INVISIBLE}
  | CHANGE [COLUMN] old_col_name new_col_name column_definition
        [FIRST | AFTER col_name]
  | [DEFAULT] CHARACTER SET [=] charset_name [COLLATE [=] collation_name]
  | CONVERT TO CHARACTER SET charset_name [COLLATE collation_name]
  | {DISABLE | ENABLE} KEYS
  | {DISCARD | IMPORT} TABLESPACE
  | DROP [COLUMN] col_name
  | DROP {INDEX | KEY} index_name
  | DROP PRIMARY KEY
  | DROP FOREIGN KEY fk_symbol
  | FORCE
  | LOCK [=] {DEFAULT | NONE | SHARED | EXCLUSIVE}
  | MODIFY [COLUMN] col_name column_definition
        [FIRST | AFTER col_name]
  | ORDER BY col_name [, col_name] ...
  | RENAME COLUMN old_col_name TO new_col_name
  | RENAME {INDEX | KEY} old_index_name TO new_index_name
  | RENAME [TO | AS] new_tbl_name
  | {WITHOUT | WITH} VALIDATION
}

partition_options:
    partition_option [partition_option] ...

partition_option: {
    ADD PARTITION (partition_definition)
  | DROP PARTITION partition_names
  | DISCARD PARTITION {partition_names | ALL} TABLESPACE
  | IMPORT PARTITION {partition_names | ALL} TABLESPACE
  | TRUNCATE PARTITION {partition_names | ALL}
  | COALESCE PARTITION number
  | REORGANIZE PARTITION partition_names INTO (partition_definitions)
  | EXCHANGE PARTITION partition_name WITH TABLE tbl_name [{WITH | WITHOUT} VALIDATION]
  | ANALYZE PARTITION {partition_names | ALL}
  | CHECK PARTITION {partition_names | ALL}
  | OPTIMIZE PARTITION {partition_names | ALL}
  | REBUILD PARTITION {partition_names | ALL}
  | REPAIR PARTITION {partition_names | ALL}
  | REMOVE PARTITIONING
}

key_part: {col_name [(length)] | (expr)} [ASC | DESC]

index_type:
    USING {BTREE | HASH}

index_option: {
    KEY_BLOCK_SIZE [=] value
  | index_type
  | WITH PARSER parser_name
  | COMMENT 'string'
  | {VISIBLE | INVISIBLE}
}

table_options:
    table_option [[,] table_option] ...

table_option: {
    AUTOEXTEND_SIZE [=] value
  | AUTO_INCREMENT [=] value
  | AVG_ROW_LENGTH [=] value
  | [DEFAULT] CHARACTER SET [=] charset_name
  | CHECKSUM [=] {0 | 1}
  | [DEFAULT] COLLATE [=] collation_name
  | COMMENT [=] 'string'
  | COMPRESSION [=] {'ZLIB' | 'LZ4' | 'NONE'}
  | CONNECTION [=] 'connect_string'
  | {DATA | INDEX} DIRECTORY [=] 'absolute path to directory'
  | DELAY_KEY_WRITE [=] {0 | 1}
  | ENCRYPTION [=] {'Y' | 'N'}
  | ENGINE [=] engine_name
  | ENGINE_ATTRIBUTE [=] 'string'
  | INSERT_METHOD [=] { NO | FIRST | LAST }
  | KEY_BLOCK_SIZE [=] value
  | MAX_ROWS [=] value
  | MIN_ROWS [=] value
  | PACK_KEYS [=] {0 | 1 | DEFAULT}
  | PASSWORD [=] 'string'
  | ROW_FORMAT [=] {DEFAULT | DYNAMIC | FIXED | COMPRESSED | REDUNDANT | COMPACT}
  | SECONDARY_ENGINE_ATTRIBUTE [=] 'string'
  | STATS_AUTO_RECALC [=] {DEFAULT | 0 | 1}
  | STATS_PERSISTENT [=] {DEFAULT | 0 | 1}
  | STATS_SAMPLE_PAGES [=] value
  | TABLESPACE tablespace_name [STORAGE {DISK | MEMORY}]
  | UNION [=] (tbl_name[,tbl_name]...)
}

partition_options:
    (see CREATE TABLE options)
```

`ALTER TABLE` changes the structure of a table. For example, you can add or delete columns, create or destroy indexes, change the type of existing columns, or rename columns or the table itself. You can also change characteristics such as the storage engine used for the table or the table comment.

* To use `ALTER TABLE`, you need `ALTER`, `CREATE`, and `INSERT` privileges for the table. Renaming a table requires `ALTER` and `DROP` on the old table, `ALTER`, `CREATE`, and `INSERT` on the new table.

* Following the table name, specify the alterations to be made. If none are given, `ALTER TABLE` does nothing.

* The syntax for many of the permissible alterations is similar to clauses of the `CREATE TABLE` statement. *`column_definition`* clauses use the same syntax for `ADD` and `CHANGE` as for [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement"). For more information, see Section 15.1.24, “CREATE TABLE Statement”.

* The word `COLUMN` is optional and can be omitted, except for `RENAME COLUMN` (to distinguish a column-renaming operation from the `RENAME` table-renaming operation).

* Multiple `ADD`, `ALTER`, `DROP`, and `CHANGE` clauses are permitted in a single [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") statement, separated by commas. This is a MySQL extension to standard SQL, which permits only one of each clause per `ALTER TABLE` statement. For example, to drop multiple columns in a single statement, do this:

  ```
  ALTER TABLE t2 DROP COLUMN c, DROP COLUMN d;
  ```

* If a storage engine does not support an attempted `ALTER TABLE` operation, a warning may result. Such warnings can be displayed with `SHOW WARNINGS`. See Section 15.7.7.43, “SHOW WARNINGS Statement”. For information on troubleshooting `ALTER TABLE`, see Section B.3.6.1, “Problems with ALTER TABLE”.

* For information about generated columns, see Section 15.1.11.2, “ALTER TABLE and Generated Columns”.

* For usage examples, see Section 15.1.11.3, “ALTER TABLE Examples”.

* `InnoDB` supports addition of multi-valued indexes on JSON columns using a *`key_part`* specification can take the form `(CAST json_path AS type ARRAY)`. See Multi-Valued Indexes, for detailed information regarding multi-valued index creation and usage of, as well as restrictions and limitations on multi-valued indexes.

* With the `mysql_info()` C API function, you can find out how many rows were copied by `ALTER TABLE`. See mysql_info().

There are several additional aspects to the `ALTER TABLE` statement, described under the following topics in this section:

* Table Options
* Performance and Space Requirements
* Concurrency Control
* Adding and Dropping Columns
* Renaming, Redefining, and Reordering Columns
* Primary Keys and Indexes
* Foreign Keys and Other Constraints
* Changing the Character Set
* Importing InnoDB Tables
* Row Order for MyISAM Tables
* Partitioning Options

#### Table Options

*`table_options`* signifies table options of the kind that can be used in the [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") statement, such as `ENGINE`, `AUTO_INCREMENT`, `AVG_ROW_LENGTH`, `MAX_ROWS`, `ROW_FORMAT`, or `TABLESPACE`.

For descriptions of all table options, see Section 15.1.24, “CREATE TABLE Statement”. However, `ALTER TABLE` ignores `DATA DIRECTORY` and `INDEX DIRECTORY` when given as table options. `ALTER TABLE` permits them only as partitioning options, and requires that you have the `FILE` privilege.

Use of table options with [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") provides a convenient way of altering single table characteristics. For example:

* If `t1` is currently not an `InnoDB` table, this statement changes its storage engine to `InnoDB`:

  ```
  ALTER TABLE t1 ENGINE = InnoDB;
  ```

  + See Section 17.6.1.5, “Converting Tables from MyISAM to InnoDB” for considerations when switching tables to the `InnoDB` storage engine.

  + When you specify an `ENGINE` clause, `ALTER TABLE` rebuilds the table. This is true even if the table already has the specified storage engine.

  + Running [`ALTER TABLE tbl_name ENGINE=INNODB`](alter-table.html "15.1.11 ALTER TABLE Statement") on an existing `InnoDB` table performs a “null” [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") operation, which can be used to defragment an `InnoDB` table, as described in Section 17.11.4, “Defragmenting a Table”. Running [`ALTER TABLE tbl_name FORCE`](alter-table.html "15.1.11 ALTER TABLE Statement") on an `InnoDB` table performs the same function.

  + [`ALTER TABLE tbl_name ENGINE=INNODB`](alter-table.html "15.1.11 ALTER TABLE Statement") and [`ALTER TABLE tbl_name FORCE`](alter-table.html "15.1.11 ALTER TABLE Statement") use online DDL. For more information, see Section 17.12, “InnoDB and Online DDL”.

  + The outcome of attempting to change the storage engine of a table is affected by whether the desired storage engine is available and the setting of the `NO_ENGINE_SUBSTITUTION` SQL mode, as described in Section 7.1.11, “Server SQL Modes”.

  + To prevent inadvertent loss of data, `ALTER TABLE` cannot be used to change the storage engine of a table to `MERGE` or `BLACKHOLE`.

* To change the `InnoDB` table to use compressed row-storage format:

  ```
  ALTER TABLE t1 ROW_FORMAT = COMPRESSED;
  ```

* The `ENCRYPTION` clause enables or disables page-level data encryption for an `InnoDB` table. A keyring plugin must be installed and configured to enable encryption.

  If the `table_encryption_privilege_check` variable is enabled, the `TABLE_ENCRYPTION_ADMIN` privilege is required to use an `ENCRYPTION` clause with a setting that differs from the default schema encryption setting.

  `ENCRYPTION` is also supported for tables residing in general tablespaces.

  For tables that reside in general tablespaces, table and tablespace encryption must match.

  The `ENCRYPTION` option is supported only by the `InnoDB` storage engine; thus it works only if the table already uses `InnoDB` (and you do not change the table's storage engine), or if the `ALTER TABLE` statement also specifies `ENGINE=InnoDB`. Otherwise the statement is rejected with `ER_CHECK_NOT_IMPLEMENTED`.

  Altering table encryption by moving a table to a different tablespace or changing the storage engine is not permitted without explicitly specifying an `ENCRYPTION` clause.

  Specifying an `ENCRYPTION` clause with a value other than `'N'` or `''` is not permitted if the table uses a storage engine that does not support encryption. Attempting to create a table without an `ENCRYPTION` clause in an encryption-enabled schema using a storage engine that does not support encryption is also not permitted.

  For more information, see Section 17.13, “InnoDB Data-at-Rest Encryption”.

* To reset the current auto-increment value:

  ```
  ALTER TABLE t1 AUTO_INCREMENT = 13;
  ```

  You cannot reset the counter to a value less than or equal to the value that is currently in use. For both `InnoDB` and `MyISAM`, if the value is less than or equal to the maximum value currently in the `AUTO_INCREMENT` column, the value is reset to the current maximum `AUTO_INCREMENT` column value plus one.

* To change the default table character set:

  ```
  ALTER TABLE t1 CHARACTER SET = utf8mb4;
  ```

  See also Changing the Character Set.

* To add (or change) a table comment:

  ```
  ALTER TABLE t1 COMMENT = 'New table comment';
  ```

* Use `ALTER TABLE` with the `TABLESPACE` option to move `InnoDB` tables between existing [general tablespaces](glossary.html#glos_general_tablespace "general tablespace"), file-per-table tablespaces, and the [system tablespace](/doc/refman/8.4/en/glossary.html#glos_system_tablespace). See Moving Tables Between Tablespaces Using ALTER TABLE.

  + `ALTER TABLE ... TABLESPACE` operations always cause a full table rebuild, even if the `TABLESPACE` attribute has not changed from its previous value.

  + `ALTER TABLE ... TABLESPACE` syntax does not support moving a table from a temporary tablespace to a persistent tablespace.

  + The `DATA DIRECTORY` clause, which is supported with [`CREATE TABLE ... TABLESPACE`](create-table.html "15.1.24 CREATE TABLE Statement"), is not supported with `ALTER TABLE ... TABLESPACE`, and is ignored if specified.

  + For more information about the capabilities and limitations of the `TABLESPACE` option, see `CREATE TABLE`.

* MySQL NDB Cluster 9.5 supports setting `NDB_TABLE` options for controlling a table's partition balance (fragment count type), read-from-any-replica capability, full replication, or any combination of these, as part of the table comment for an `ALTER TABLE` statement in the same manner as for `CREATE TABLE`, as shown in this example:

  ```
  ALTER TABLE t1 COMMENT = "NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RA_BY_NODE";
  ```

  It is also possible to set `NDB_COMMENT` options for columns of `NDB` tables as part of an `ALTER TABLE` statement, like this one:

  ```
  ALTER TABLE t1
    CHANGE COLUMN c1 c1 BLOB
      COMMENT = 'NDB_COLUMN=BLOB_INLINE_SIZE=4096,MAX_BLOB_PART_SIZE';
  ```

  Bear in mind that `ALTER TABLE ... COMMENT ...` discards any existing comment for the table. See Setting NDB_TABLE options, for additional information and examples.

* `ENGINE_ATTRIBUTE` and `SECONDARY_ENGINE_ATTRIBUTE` options are used to specify table, column, and index attributes for primary and secondary storage engines. These options are reserved for future use. Index attributes cannot be altered. An index must be dropped and added back with the desired change, which can be performed in a single [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") statement.

To verify that the table options were changed as intended, use `SHOW CREATE TABLE`, or query the Information Schema `TABLES` table.

#### Performance and Space Requirements

`ALTER TABLE` operations are processed using one of the following algorithms:

* `COPY`: Operations are performed on a copy of the original table, and table data is copied from the original table to the new table row by row. Concurrent DML is not permitted.

* `INPLACE`: Operations avoid copying table data but may rebuild the table in place. An exclusive metadata lock on the table may be taken briefly during preparation and execution phases of the operation. Typically, concurrent DML is supported.

* `INSTANT`: Operations only modify metadata in the data dictionary. An exclusive metadata lock on the table may be taken briefly during the execution phase of the operation. Table data is unaffected, making operations instantaneous. Concurrent DML is permitted.

For tables using the `NDB` storage engine, these algorithms work as follows:

* `COPY`: `NDB` creates a copy of the table and alters it; the NDB Cluster handler then copies the data between the old and new versions of the table. Subsequently, `NDB` deletes the old table and renames the new one.

  This is sometimes also referred to as a “copying” or “offline” `ALTER TABLE`.

* `INPLACE`: The data nodes make the required changes; the NDB Cluster handler does not copy data or otherwise take part.

  This is sometimes also referred to as a “non-copying” or “online” `ALTER TABLE`.

* `INSTANT`: Not supported by `NDB`.

See Section 25.6.12, “Online Operations with ALTER TABLE in NDB Cluster”, for more information.

The `ALGORITHM` clause is optional. If the `ALGORITHM` clause is omitted, MySQL uses `ALGORITHM=INSTANT` for storage engines and `ALTER TABLE` clauses that support it. Otherwise, `ALGORITHM=INPLACE` is used. If `ALGORITHM=INPLACE` is not supported, `ALGORITHM=COPY` is used.

Note

After adding a column to a partitioned table using `ALGORITHM=INSTANT`, it is no longer possible to perform [`ALTER TABLE ... EXCHANGE PARTITION`](alter-table-partition-operations.html "15.1.11.1 ALTER TABLE Partition Operations") on the table.

Specifying an `ALGORITHM` clause requires the operation to use the specified algorithm for clauses and storage engines that support it, or fail with an error otherwise. Specifying `ALGORITHM=DEFAULT` is the same as omitting the `ALGORITHM` clause.

`ALTER TABLE` operations that use the `COPY` algorithm wait for other operations that are modifying the table to complete. After alterations are applied to the table copy, data is copied over, the original table is deleted, and the table copy is renamed to the name of the original table. While the `ALTER TABLE` operation executes, the original table is readable by other sessions (with the exception noted shortly). Updates and writes to the table started after the [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") operation begins are stalled until the new table is ready, then are automatically redirected to the new table. The temporary copy of the table is created in the database directory of the original table unless it is a `RENAME TO` operation that moves the table to a database that resides in a different directory.

The exception referred to earlier is that `ALTER TABLE` blocks reads (not just writes) at the point where it is ready to clear outdated table structures from the table and table definition caches. At this point, it must acquire an exclusive lock. To do so, it waits for current readers to finish, and blocks new reads and writes.

An `ALTER TABLE` operation that uses the `COPY` algorithm prevents concurrent DML operations. Concurrent queries are still allowed. That is, a table-copying operation always includes at least the concurrency restrictions of `LOCK=SHARED` (allow queries but not DML). You can further restrict concurrency for operations that support the `LOCK` clause by specifying `LOCK=EXCLUSIVE`, which prevents DML and queries. For more information, see Concurrency Control.

To force use of the `COPY` algorithm for an `ALTER TABLE` operation that would otherwise not use it, specify `ALGORITHM=COPY` or enable the `old_alter_table` system variable. If there is a conflict between the `old_alter_table` setting and an `ALGORITHM` clause with a value other than `DEFAULT`, the `ALGORITHM` clause takes precedence.

For `InnoDB` tables, an `ALTER TABLE` operation that uses the `COPY` algorithm on a table that resides in a shared tablespace can increase the amount of space used by the tablespace. Such operations require as much additional space as the data in the table plus indexes. For a table residing in a shared tablespace, the additional space used during the operation is not released back to the operating system as it is for a table that resides in a file-per-table tablespace.

For information about space requirements for online DDL operations, see Section 17.12.3, “Online DDL Space Requirements”.

`ALTER TABLE` operations that support the `INPLACE` algorithm include:

* `ALTER TABLE` operations supported by the `InnoDB` online DDL feature. See Section 17.12.1, “Online DDL Operations”.

* Renaming a table. MySQL renames files that correspond to the table *`tbl_name`* without making a copy. (You can also use the [`RENAME TABLE`](rename-table.html "15.1.41 RENAME TABLE Statement") statement to rename tables. See Section 15.1.41, “RENAME TABLE Statement”.) Privileges granted specifically for the renamed table are not migrated to the new name. They must be changed manually.

* Operations that modify table metadata only. These operations are immediate because the server does not touch table contents. Metadata-only operations include:

  + Renaming a column. In NDB Cluster, this operation can also be performed online.

  + Changing the default value of a column (except for `NDB` tables).

  + Modifying the definition of an `ENUM` or `SET` column by adding new enumeration or set members to the *end* of the list of valid member values, as long as the storage size of the data type does not change. For example, adding a member to a `SET` column that has 8 members changes the required storage per value from 1 byte to 2 bytes; this requires a table copy. Adding members in the middle of the list causes renumbering of existing members, which requires a table copy.

  + Changing the definition of a spatial column to remove the `SRID` attribute. (Adding or changing an `SRID` attribute requires a rebuild, and cannot be done in place, because the server must verify that all values have the specified `SRID` value.)

  + Changing a column character set, when these conditions apply:

    - The column data type is `CHAR`, `VARCHAR`, a `TEXT` type, or `ENUM`.

    - The character set change is from `utf8mb3` to `utf8mb4`, or any character set to `binary`.

    - There is no index on the column.
  + Changing a generated column, when these conditions apply:

    - For `InnoDB` tables, statements that modify generated stored columns but do not change their type, expression, or nullability.

    - For non-`InnoDB` tables, statements that modify generated stored or virtual columns but do not change their type, expression, or nullability.

    An example of such a change is a change to the column comment.

* Renaming an index.
* Adding or dropping a secondary index, for `InnoDB` and `NDB` tables. See Section 17.12.1, “Online DDL Operations”.

* For `NDB` tables, operations that add and drop indexes on variable-width columns. These operations occur online, without table copying and without blocking concurrent DML actions for most of their duration. See Section 25.6.12, “Online Operations with ALTER TABLE in NDB Cluster”.

* Modifying index visibility with an `ALTER INDEX` operation.

* Column modifications of tables containing generated columns that depend on columns with a `DEFAULT` value if the modified columns are not involved in the generated column expressions. For example, changing the `NULL` property of a separate column can be done in place without a table rebuild.

`ALTER TABLE` operations that support the `INSTANT` algorithm include:

* Adding a column. This feature is referred to as “Instant `ADD COLUMN`”. Limitations apply. See Section 17.12.1, “Online DDL Operations”.

* Dropping a column. This feature is referred to as “Instant `DROP COLUMN`”. Limitations apply. See Section 17.12.1, “Online DDL Operations”.

* Adding or dropping a virtual column.
* Adding or dropping a column default value.
* Modifying the definition of an `ENUM` or `SET` column. The same restrictions apply as described above for `ALGORITHM=INSTANT`.

* Changing the index type.
* Renaming a table. The same restrictions apply as described above for `ALGORITHM=INSTANT`.

For more information about operations that support `ALGORITHM=INSTANT`, see Section 17.12.1, “Online DDL Operations”.

`ALTER TABLE` upgrades MySQL 5.5 temporal columns to 5.6 format for `ADD COLUMN`, `CHANGE COLUMN`, `MODIFY COLUMN`, `ADD INDEX`, and `FORCE` operations. This conversion cannot be done using the `INPLACE` algorithm because the table must be rebuilt, so specifying `ALGORITHM=INPLACE` in these cases results in an error. Specify `ALGORITHM=COPY` if necessary.

If an `ALTER TABLE` operation on a multicolumn index used to partition a table by `KEY` changes the order of the columns, it can only be performed using `ALGORITHM=COPY`.

The `WITHOUT VALIDATION` and `WITH VALIDATION` clauses affect whether `ALTER TABLE` performs an in-place operation for [virtual generated column](/doc/refman/8.4/en/glossary.html#glos_virtual_generated_column) modifications. See Section 15.1.11.2, “ALTER TABLE and Generated Columns”.

NDB Cluster 9.5 supports online operations using the same `ALGORITHM=INPLACE` syntax used with the standard MySQL Server. `NDB` does not allow changing a tablespace online. See Section 25.6.12, “Online Operations with ALTER TABLE in NDB Cluster”, for more information.

When performing a copying `ALTER TABLE`, `NDB` checks to ensure that no concurrent writes have been made to the affected table. If it finds that any have been made, `NDB` rejects the `ALTER TABLE` statement and raises `ER_TABLE_DEF_CHANGED`.

`ALTER TABLE` with `DISCARD ... PARTITION ... TABLESPACE` or `IMPORT ... PARTITION ... TABLESPACE` does not create any temporary tables or temporary partition files.

`ALTER TABLE` with `ADD PARTITION`, `DROP PARTITION`, `COALESCE PARTITION`, `REBUILD PARTITION`, or `REORGANIZE PARTITION` does not create temporary tables (except when used with `NDB` tables); however, these operations can and do create temporary partition files.

`ADD` or `DROP` operations for `RANGE` or `LIST` partitions are immediate operations or nearly so. `ADD` or `COALESCE` operations for `HASH` or `KEY` partitions copy data between all partitions, unless `LINEAR HASH` or `LINEAR KEY` was used; this is effectively the same as creating a new table, although the `ADD` or `COALESCE` operation is performed partition by partition. `REORGANIZE` operations copy only changed partitions and do not touch unchanged ones.

For `MyISAM` tables, you can speed up index re-creation (the slowest part of the alteration process) by setting the `myisam_sort_buffer_size` system variable to a high value.

#### Concurrency Control

For `ALTER TABLE` operations that support it, you can use the `LOCK` clause to control the level of concurrent reads and writes on a table while it is being altered. Specifying a non-default value for this clause enables you to require a certain amount of concurrent access or exclusivity during the alter operation, and halts the operation if the requested degree of locking is not available.

Only `LOCK = DEFAULT` is permitted for operations that use `ALGORITHM=INSTANT`. The other `LOCK` clause parameters are not applicable.

The parameters for the `LOCK` clause are:

* `LOCK = DEFAULT`

  Maximum level of concurrency for the given `ALGORITHM` clause (if any) and `ALTER TABLE` operation: Permit concurrent reads and writes if supported. If not, permit concurrent reads if supported. If not, enforce exclusive access.

* `LOCK = NONE`

  If supported, permit concurrent reads and writes. Otherwise, an error occurs.

* `LOCK = SHARED`

  If supported, permit concurrent reads but block writes. Writes are blocked even if concurrent writes are supported by the storage engine for the given `ALGORITHM` clause (if any) and `ALTER TABLE` operation. If concurrent reads are not supported, an error occurs.

* `LOCK = EXCLUSIVE`

  Enforce exclusive access. This is done even if concurrent reads/writes are supported by the storage engine for the given `ALGORITHM` clause (if any) and `ALTER TABLE` operation.

#### Adding and Dropping Columns

Use `ADD` to add new columns to a table, and `DROP` to remove existing columns. `DROP col_name` is a MySQL extension to standard SQL.

To add a column at a specific position within a table row, use `FIRST` or `AFTER col_name`. The default is to add the column last.

If a table contains only one column, the column cannot be dropped. If what you intend is to remove the table, use the `DROP TABLE` statement instead.

If columns are dropped from a table, the columns are also removed from any index of which they are a part. If all columns that make up an index are dropped, the index is dropped as well. If you use `CHANGE` or `MODIFY` to shorten a column for which an index exists on the column, and the resulting column length is less than the index length, MySQL shortens the index automatically.

For `ALTER TABLE ... ADD`, if the column has an expression default value that uses a nondeterministic function, the statement may produce a warning or error. For further information, see Section 13.6, “Data Type Default Values”, and Section 19.1.3.7, “Restrictions on Replication with GTIDs”.

#### Renaming, Redefining, and Reordering Columns

The `CHANGE`, `MODIFY`, `RENAME COLUMN`, and `ALTER` clauses enable the names and definitions of existing columns to be altered. They have these comparative characteristics:

* `CHANGE`:

  + Can rename a column and change its definition, or both.
  + Has more capability than `MODIFY` or `RENAME COLUMN`, but at the expense of convenience for some operations. `CHANGE` requires naming the column twice if not renaming it, and requires respecifying the column definition if only renaming it.

  + With `FIRST` or `AFTER`, can reorder columns.

* `MODIFY`:

  + Can change a column definition but not its name.
  + More convenient than `CHANGE` to change a column definition without renaming it.

  + With `FIRST` or `AFTER`, can reorder columns.

* `RENAME COLUMN`:

  + Can change a column name but not its definition.
  + More convenient than `CHANGE` to rename a column without changing its definition.

* `ALTER`: Used only to change a column default value.

`CHANGE` is a MySQL extension to standard SQL. `MODIFY` and `RENAME COLUMN` are MySQL extensions for Oracle compatibility.

To alter a column to change both its name and definition, use `CHANGE`, specifying the old and new names and the new definition. For example, to rename an `INT NOT NULL` column from `a` to `b` and change its definition to use the `BIGINT` data type while retaining the `NOT NULL` attribute, do this:

```
ALTER TABLE t1 CHANGE a b BIGINT NOT NULL;
```

To change a column definition but not its name, use `CHANGE` or `MODIFY`. With `CHANGE`, the syntax requires two column names, so you must specify the same name twice to leave the name unchanged. For example, to change the definition of column `b`, do this:

```
ALTER TABLE t1 CHANGE b b INT NOT NULL;
```

`MODIFY` is more convenient to change the definition without changing the name because it requires the column name only once:

```
ALTER TABLE t1 MODIFY b INT NOT NULL;
```

To change a column name but not its definition, use `CHANGE` or `RENAME COLUMN`. With `CHANGE`, the syntax requires a column definition, so to leave the definition unchanged, you must respecify the definition the column currently has. For example, to rename an `INT NOT NULL` column from `b` to `a`, do this:

```
ALTER TABLE t1 CHANGE b a INT NOT NULL;
```

`RENAME COLUMN` is more convenient to change the name without changing the definition because it requires only the old and new names:

```
ALTER TABLE t1 RENAME COLUMN b TO a;
```

In general, you cannot rename a column to a name that already exists in the table. However, this is sometimes not the case, such as when you swap names or move them through a cycle. If a table has columns named `a`, `b`, and `c`, these are valid operations:

```
-- swap a and b
ALTER TABLE t1 RENAME COLUMN a TO b,
               RENAME COLUMN b TO a;
-- "rotate" a, b, c through a cycle
ALTER TABLE t1 RENAME COLUMN a TO b,
               RENAME COLUMN b TO c,
               RENAME COLUMN c TO a;
```

For column definition changes using `CHANGE` or `MODIFY`, the definition must include the data type and all attributes that should apply to the new column, other than index attributes such as `PRIMARY KEY` or `UNIQUE`. Attributes present in the original definition but not specified for the new definition are not carried forward. Suppose that a column `col1` is defined as `INT UNSIGNED DEFAULT 1 COMMENT 'my column'` and you modify the column as follows, intending to change only `INT` to `BIGINT`:

```
ALTER TABLE t1 MODIFY col1 BIGINT;
```

That statement changes the data type from `INT` to `BIGINT`, but it also drops the `UNSIGNED`, `DEFAULT`, and `COMMENT` attributes. To retain them, the statement must include them explicitly:

```
ALTER TABLE t1 MODIFY col1 BIGINT UNSIGNED DEFAULT 1 COMMENT 'my column';
```

For data type changes using `CHANGE` or `MODIFY`, MySQL tries to convert existing column values to the new type as well as possible.

Warning

This conversion may result in alteration of data. For example, if you shorten a string column, values may be truncated. To prevent the operation from succeeding if conversions to the new data type would result in loss of data, enable strict SQL mode before using `ALTER TABLE` (see Section 7.1.11, “Server SQL Modes”).

If you use `CHANGE` or `MODIFY` to shorten a column for which an index exists on the column, and the resulting column length is less than the index length, MySQL shortens the index automatically.

For columns renamed by `CHANGE` or `RENAME COLUMN`, MySQL automatically renames these references to the renamed column:

* Indexes that refer to the old column, including invisible indexes and disabled `MyISAM` indexes.

* Foreign keys that refer to the old column.

For columns renamed by `CHANGE` or `RENAME COLUMN`, MySQL does not automatically rename these references to the renamed column:

* Generated column and partition expressions that refer to the renamed column. You must use `CHANGE` to redefine such expressions in the same `ALTER TABLE` statement as the one that renames the column.

* Views and stored programs that refer to the renamed column. You must manually alter the definition of these objects to refer to the new column name.

To reorder columns within a table, use `FIRST` and `AFTER` in `CHANGE` or `MODIFY` operations.

`ALTER ... SET DEFAULT` or `ALTER ... DROP DEFAULT` specify a new default value for a column or remove the old default value, respectively. If the old default is removed and the column can be `NULL`, the new default is `NULL`. If the column cannot be `NULL`, MySQL assigns a default value as described in Section 13.6, “Data Type Default Values”.

`ALTER ... SET VISIBLE` and `ALTER ... SET INVISIBLE` enable column visibility to be changed. See Section 15.1.24.10, “Invisible Columns”.

#### Primary Keys and Indexes

`DROP PRIMARY KEY` drops the primary key. If there is no primary key, an error occurs. For information about the performance characteristics of primary keys, especially for `InnoDB` tables, see Section 10.3.2, “Primary Key Optimization”.

If the `sql_require_primary_key` system variable is enabled, attempting to drop a primary key produces an error.

If you add a `UNIQUE INDEX` or `PRIMARY KEY` to a table, MySQL stores it before any nonunique index to permit detection of duplicate keys as early as possible.

`DROP INDEX` removes an index. This is a MySQL extension to standard SQL. See Section 15.1.31, “DROP INDEX Statement”. To determine index names, use `SHOW INDEX FROM tbl_name`.

Some storage engines permit you to specify an index type when creating an index. The syntax for the *`index_type`* specifier is `USING type_name`. For details about `USING`, see Section 15.1.18, “CREATE INDEX Statement”. The preferred position is after the column list. Expect support for use of the option before the column list to be removed in a future MySQL release.

*`index_option`* values specify additional options for an index. `USING` is one such option. For details about permissible *`index_option`* values, see Section 15.1.18, “CREATE INDEX Statement”.

`RENAME INDEX old_index_name TO new_index_name` renames an index. This is a MySQL extension to standard SQL. The content of the table remains unchanged. *`old_index_name`* must be the name of an existing index in the table that is not dropped by the same `ALTER TABLE` statement. *`new_index_name`* is the new index name, which cannot duplicate the name of an index in the resulting table after changes have been applied. Neither index name can be `PRIMARY`.

If you use `ALTER TABLE` on a `MyISAM` table, all nonunique indexes are created in a separate batch (as for [`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement")). This should make [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") much faster when you have many indexes.

For `MyISAM` tables, key updating can be controlled explicitly. Use `ALTER TABLE ... DISABLE KEYS` to tell MySQL to stop updating nonunique indexes. Then use `ALTER TABLE ... ENABLE KEYS` to re-create missing indexes. `MyISAM` does this with a special algorithm that is much faster than inserting keys one by one, so disabling keys before performing bulk insert operations should give a considerable speedup. Using `ALTER TABLE ... DISABLE KEYS` requires the `INDEX` privilege in addition to the privileges mentioned earlier.

While the nonunique indexes are disabled, they are ignored for statements such as `SELECT` and `EXPLAIN` that otherwise would use them.

After an `ALTER TABLE` statement, it may be necessary to run [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") to update index cardinality information. See Section 15.7.7.24, “SHOW INDEX Statement”.

The `ALTER INDEX` operation permits an index to be made visible or invisible. An invisible index is not used by the optimizer. Modification of index visibility applies to indexes other than primary keys (either explicit or implicit), and cannot be performed using `ALGORITHM=INSTANT`. This feature is storage engine neutral (supported for any engine). For more information, see Section 10.3.12, “Invisible Indexes”.

#### Foreign Keys and Other Constraints

The `FOREIGN KEY` and `REFERENCES` clauses are supported by the `InnoDB` and `NDB` storage engines, which implement `ADD [CONSTRAINT [symbol]] FOREIGN KEY [index_name] (...) REFERENCES ... (...)`. See Section 15.1.24.5, “FOREIGN KEY Constraints”. For other storage engines, the clauses are parsed but ignored.

For `ALTER TABLE`, unlike `CREATE TABLE`, `ADD FOREIGN KEY` ignores *`index_name`* if given and uses an automatically generated foreign key name. As a workaround, include the `CONSTRAINT` clause to specify the foreign key name:

```
ADD CONSTRAINT name FOREIGN KEY (....) ...
```

Important

MySQL silently ignores inline `REFERENCES` specifications, where the references are defined as part of the column specification. MySQL accepts only `REFERENCES` clauses defined as part of a separate `FOREIGN KEY` specification.

Note

Partitioned `InnoDB` tables do not support foreign keys. This restriction does not apply to `NDB` tables, including those explicitly partitioned by `[LINEAR] KEY`. For more information, see Section 26.6.2, “Partitioning Limitations Relating to Storage Engines”.

MySQL Server and NDB Cluster both support the use of `ALTER TABLE` to drop foreign keys:

```
ALTER TABLE tbl_name DROP FOREIGN KEY fk_symbol;
```

Adding and dropping a foreign key in the same `ALTER TABLE` statement is supported for [`ALTER TABLE ... ALGORITHM=INPLACE`](alter-table.html "15.1.11 ALTER TABLE Statement") but not for [`ALTER TABLE ... ALGORITHM=COPY`](alter-table.html "15.1.11 ALTER TABLE Statement").

The server prohibits changes to foreign key columns that have the potential to cause loss of referential integrity. A workaround is to use [`ALTER TABLE ... DROP FOREIGN KEY`](alter-table.html "15.1.11 ALTER TABLE Statement") before changing the column definition and [`ALTER TABLE ... ADD FOREIGN KEY`](alter-table.html "15.1.11 ALTER TABLE Statement") afterward. Examples of prohibited changes include:

* Changes to the data type of foreign key columns that may be unsafe. For example, changing `VARCHAR(20)` to `VARCHAR(30)` is permitted, but changing it to `VARCHAR(1024)` is not because that alters the number of length bytes required to store individual values.

* Changing a `NULL` column to `NOT NULL` in non-strict mode is prohibited to prevent converting `NULL` values to default non-`NULL` values, for which there are no corresponding values in the referenced table. The operation is permitted in strict mode, but an error is returned if any such conversion is required.

`ALTER TABLE tbl_name RENAME new_tbl_name` changes internally generated foreign key constraint names and user-defined foreign key constraint names that begin with the string “*`tbl_name`*_ibfk_” to reflect the new table name. `InnoDB` interprets foreign key constraint names that begin with the string “*`tbl_name`*_ibfk_” as internally generated names.

`ALTER TABLE` permits `CHECK` constraints for existing tables to be added, dropped, or altered:

* Add a new `CHECK` constraint:

  ```
  ALTER TABLE tbl_name
      ADD [CONSTRAINT [symbol]] CHECK (expr) [[NOT] ENFORCED];
  ```

  The meaning of constraint syntax elements is the same as for `CREATE TABLE`. See Section 15.1.24.6, “CHECK Constraints”.

* Drop an existing `CHECK` constraint named *`symbol`*:

  ```
  ALTER TABLE tbl_name
      DROP CHECK symbol;
  ```

* Alter whether an existing `CHECK` constraint named *`symbol`* is enforced:

  ```
  ALTER TABLE tbl_name
      ALTER CHECK symbol [NOT] ENFORCED;
  ```

The `DROP CHECK` and `ALTER CHECK` clauses are MySQL extensions to standard SQL.

`ALTER TABLE` permits more general (and SQL standard) syntax for dropping and altering existing constraints of any type, where the constraint type is determined from the constraint name:

* Drop an existing constraint named *`symbol`*:

  ```
  ALTER TABLE tbl_name
      DROP CONSTRAINT symbol;
  ```

  If the `sql_require_primary_key` system variable is enabled, attempting to drop a primary key produces an error.

* Alter whether an existing constraint named *`symbol`* is enforced:

  ```
  ALTER TABLE tbl_name
      ALTER CONSTRAINT symbol [NOT] ENFORCED;
  ```

  Only `CHECK` constraints can be altered to be unenforced. All other constraint types are always enforced.

The SQL standard specifies that all types of constraints (primary key, unique index, foreign key, check) belong to the same namespace. In MySQL, each constraint type has its own namespace per schema. Consequently, names for each type of constraint must be unique per schema, but constraints of different types can have the same name. When multiple constraints have the same name, `DROP CONSTRAINT` and `ADD CONSTRAINT` are ambiguous and an error occurs. In such cases, constraint-specific syntax must be used to modify the constraint. For example, use `DROP PRIMARY KEY` or DROP FOREIGN KEY to drop a primary key or foreign key.

If a table alteration causes a violation of an enforced `CHECK` constraint, an error occurs and the table is not modified. Examples of operations for which an error occurs:

* Attempts to add the `AUTO_INCREMENT` attribute to a column that is used in a `CHECK` constraint.

* Attempts to add an enforced `CHECK` constraint or enforce a nonenforced `CHECK` constraint for which existing rows violate the constraint condition.

* Attempts to modify, rename, or drop a column that is used in a `CHECK` constraint, unless that constraint is also dropped in the same statement. Exception: If a `CHECK` constraint refers only to a single column, dropping the column automatically drops the constraint.

`ALTER TABLE tbl_name RENAME new_tbl_name` changes internally generated and user-defined `CHECK` constraint names that begin with the string “*`tbl_name`*_chk_” to reflect the new table name. MySQL interprets `CHECK` constraint names that begin with the string “*`tbl_name`*_chk_” as internally generated names.

#### Changing the Character Set

To change the table default character set and all character columns (`CHAR`, `VARCHAR`, `TEXT`) to a new character set, use a statement like this:

```
ALTER TABLE tbl_name CONVERT TO CHARACTER SET charset_name;
```

The statement also changes the collation of all character columns. If you specify no `COLLATE` clause to indicate which collation to use, the statement uses default collation for the character set. If this collation is inappropriate for the intended table use (for example, if it would change from a case-sensitive collation to a case-insensitive collation), specify a collation explicitly.

For a column that has a data type of `VARCHAR` or one of the `TEXT` types, `CONVERT TO CHARACTER SET` changes the data type as necessary to ensure that the new column is long enough to store as many characters as the original column. For example, a `TEXT` column has two length bytes, which store the byte-length of values in the column, up to a maximum of 65,535. For a `latin1` `TEXT` column, each character requires a single byte, so the column can store up to 65,535 characters. If the column is converted to `utf8mb4`, each character might require up to 4 bytes, for a maximum possible length of 4 × 65,535 = 262,140 bytes. That length does not fit in a `TEXT` column's length bytes, so MySQL converts the data type to `MEDIUMTEXT`, which is the smallest string type for which the length bytes can record a value of 262,140. Similarly, a `VARCHAR` column might be converted to `MEDIUMTEXT`.

To avoid data type changes of the type just described, do not use `CONVERT TO CHARACTER SET`. Instead, use `MODIFY` to change individual columns. For example:

```
ALTER TABLE t MODIFY latin1_text_col TEXT CHARACTER SET utf8mb4;
ALTER TABLE t MODIFY latin1_varchar_col VARCHAR(M) CHARACTER SET utf8mb4;
```

If you specify `CONVERT TO CHARACTER SET binary`, the `CHAR`, `VARCHAR`, and `TEXT` columns are converted to their corresponding binary string types (`BINARY`, `VARBINARY`, `BLOB`). This means that the columns no longer have a character set and a subsequent `CONVERT TO` operation does not apply to them.

If *`charset_name`* is `DEFAULT` in a `CONVERT TO CHARACTER SET` operation, the character set named by the `character_set_database` system variable is used.

Warning

The `CONVERT TO` operation converts column values between the original and named character sets. This is *not* what you want if you have a column in one character set (like `latin1`) but the stored values actually use some other, incompatible character set (like `utf8mb4`). In this case, you have to do the following for each such column:

```
ALTER TABLE t1 CHANGE c1 c1 BLOB;
ALTER TABLE t1 CHANGE c1 c1 TEXT CHARACTER SET utf8mb4;
```

The reason this works is that there is no conversion when you convert to or from `BLOB` columns.

To change only the *default* character set for a table, use this statement:

```
ALTER TABLE tbl_name DEFAULT CHARACTER SET charset_name;
```

The word `DEFAULT` is optional. The default character set is the character set that is used if you do not specify the character set for columns that you add to a table later (for example, with `ALTER TABLE ... ADD column`).

When the `foreign_key_checks` system variable is enabled, which is the default setting, character set conversion is not permitted on tables that include a character string column used in a foreign key constraint. The workaround is to disable `foreign_key_checks` before performing the character set conversion. You must perform the conversion on both tables involved in the foreign key constraint before re-enabling `foreign_key_checks`. If you re-enable `foreign_key_checks` after converting only one of the tables, an `ON DELETE CASCADE` or `ON UPDATE CASCADE` operation could corrupt data in the referencing table due to implicit conversion that occurs during these operations (Bug #45290, Bug #74816).

#### Importing InnoDB Tables

An `InnoDB` table created in its own file-per-table tablespace can be imported from a backup or from another MySQL server instance using `DISCARD TABLEPACE` and `IMPORT TABLESPACE` clauses. See Section 17.6.1.3, “Importing InnoDB Tables”.

#### Row Order for MyISAM Tables

`ORDER BY` enables you to create the new table with the rows in a specific order. This option is useful primarily when you know that you query the rows in a certain order most of the time. By using this option after major changes to the table, you might be able to get higher performance. In some cases, it might make sorting easier for MySQL if the table is in order by the column that you want to order it by later.

Note

The table does not remain in the specified order after inserts and deletes.

`ORDER BY` syntax permits one or more column names to be specified for sorting, each of which optionally can be followed by `ASC` or `DESC` to indicate ascending or descending sort order, respectively. The default is ascending order. Only column names are permitted as sort criteria; arbitrary expressions are not permitted. This clause should be given last after any other clauses.

`ORDER BY` does not make sense for `InnoDB` tables because `InnoDB` always orders table rows according to the clustered index.

When used on a partitioned table, `ALTER TABLE ... ORDER BY` orders rows within each partition only.

#### Partitioning Options

*`partition_options`* signifies options that can be used with partitioned tables for repartitioning, to add, drop, discard, import, merge, and split partitions, and to perform partitioning maintenance.

It is possible for an `ALTER TABLE` statement to contain a `PARTITION BY` or `REMOVE PARTITIONING` clause in an addition to other alter specifications, but the `PARTITION BY` or `REMOVE PARTITIONING` clause must be specified last after any other specifications. The `ADD PARTITION`, `DROP PARTITION`, `DISCARD PARTITION`, `IMPORT PARTITION`, `COALESCE PARTITION`, `REORGANIZE PARTITION`, `EXCHANGE PARTITION`, `ANALYZE PARTITION`, `CHECK PARTITION`, and `REPAIR PARTITION` options cannot be combined with other alter specifications in a single `ALTER TABLE`, since the options just listed act on individual partitions.

For more information about partition options, see Section 15.1.24, “CREATE TABLE Statement”, and Section 15.1.11.1, “ALTER TABLE Partition Operations”. For information about and examples of `ALTER TABLE ... EXCHANGE PARTITION` statements, see Section 26.3.3, “Exchanging Partitions and Subpartitions with Tables”.


#### 15.1.11.1 ALTER TABLE Partition Operations

Partitioning-related clauses for [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") can be used with partitioned tables for repartitioning, to add, drop, discard, import, merge, and split partitions, and to perform partitioning maintenance.

* Simply using a *`partition_options`* clause with `ALTER TABLE` on a partitioned table repartitions the table according to the partitioning scheme defined by the *`partition_options`*. This clause always begins with `PARTITION BY`, and follows the same syntax and other rules as apply to the *`partition_options`* clause for `CREATE TABLE` (for more detailed information, see Section 15.1.24, “CREATE TABLE Statement”), and can also be used to partition an existing table that is not already partitioned. For example, consider a (nonpartitioned) table defined as shown here:

  ```
  CREATE TABLE t1 (
      id INT,
      year_col INT
  );
  ```

  This table can be partitioned by `HASH`, using the `id` column as the partitioning key, into 8 partitions by means of this statement:

  ```
  ALTER TABLE t1
      PARTITION BY HASH(id)
      PARTITIONS 8;
  ```

  MySQL supports an `ALGORITHM` option with `[SUB]PARTITION BY [LINEAR] KEY`. `ALGORITHM=1` causes the server to use the same key-hashing functions as MySQL 5.1 when computing the placement of rows in partitions; `ALGORITHM=2` means that the server employs the key-hashing functions implemented and used by default for new `KEY` partitioned tables in MySQL 5.5 and later. (Partitioned tables created with the key-hashing functions employed in MySQL 5.5 and later cannot be used by a MySQL 5.1 server.) Not specifying the option has the same effect as using `ALGORITHM=2`. This option is intended for use chiefly when upgrading or downgrading `[LINEAR] KEY` partitioned tables between MySQL 5.1 and later MySQL versions, or for creating tables partitioned by `KEY` or `LINEAR KEY` on a MySQL 5.5 or later server which can be used on a MySQL 5.1 server.

  The table that results from using an `ALTER TABLE ... PARTITION BY` statement must follow the same rules as one created using `CREATE TABLE ... PARTITION BY`. This includes the rules governing the relationship between any unique keys (including any primary key) that the table might have, and the column or columns used in the partitioning expression, as discussed in Section 26.6.1, “Partitioning Keys, Primary Keys, and Unique Keys”. The `CREATE TABLE ... PARTITION BY` rules for specifying the number of partitions also apply to `ALTER TABLE ... PARTITION BY`.

  The *`partition_definition`* clause for `ALTER TABLE ADD PARTITION` supports the same options as the clause of the same name for the `CREATE TABLE` statement. (See Section 15.1.24, “CREATE TABLE Statement”, for the syntax and description.) Suppose that you have the partitioned table created as shown here:

  ```
  CREATE TABLE t1 (
      id INT,
      year_col INT
  )
  PARTITION BY RANGE (year_col) (
      PARTITION p0 VALUES LESS THAN (1991),
      PARTITION p1 VALUES LESS THAN (1995),
      PARTITION p2 VALUES LESS THAN (1999)
  );
  ```

  You can add a new partition `p3` to this table for storing values less than `2002` as follows:

  ```
  ALTER TABLE t1 ADD PARTITION (PARTITION p3 VALUES LESS THAN (2002));
  ```

  `DROP PARTITION` can be used to drop one or more `RANGE` or `LIST` partitions. This statement cannot be used with `HASH` or `KEY` partitions; instead, use `COALESCE PARTITION` (see later in this section). Any data that was stored in the dropped partitions named in the *`partition_names`* list is discarded. For example, given the table `t1` defined previously, you can drop the partitions named `p0` and `p1` as shown here:

  ```
  ALTER TABLE t1 DROP PARTITION p0, p1;
  ```

  Note

  `DROP PARTITION` does not work with tables that use the `NDB` storage engine. See Section 26.3.1, “Management of RANGE and LIST Partitions”, and Section 25.2.7, “Known Limitations of NDB Cluster”.

  `ADD PARTITION` and `DROP PARTITION` do not currently support `IF [NOT] EXISTS`.

  The [`DISCARD PARTITION ... TABLESPACE`](alter-table.html "15.1.11 ALTER TABLE Statement") and [`IMPORT PARTITION ... TABLESPACE`](alter-table.html "15.1.11 ALTER TABLE Statement") options extend the [Transportable Tablespace](glossary.html#glos_transportable_tablespace "transportable tablespace") feature to individual `InnoDB` table partitions. Each `InnoDB` table partition has its own tablespace file (`.ibd` file). The [Transportable Tablespace](glossary.html#glos_transportable_tablespace "transportable tablespace") feature makes it easy to copy the tablespaces from a running MySQL server instance to another running instance, or to perform a restore on the same instance. Both options take a comma-separated list of one or more partition names. For example:

  ```
  ALTER TABLE t1 DISCARD PARTITION p2, p3 TABLESPACE;
  ```

  ```
  ALTER TABLE t1 IMPORT PARTITION p2, p3 TABLESPACE;
  ```

  When running [`DISCARD PARTITION ... TABLESPACE`](alter-table.html "15.1.11 ALTER TABLE Statement") and [`IMPORT PARTITION ... TABLESPACE`](alter-table.html "15.1.11 ALTER TABLE Statement") on subpartitioned tables, both partition and subpartition names are allowed. When a partition name is specified, subpartitions of that partition are included.

  The [Transportable Tablespace](glossary.html#glos_transportable_tablespace "transportable tablespace") feature also supports copying or restoring partitioned `InnoDB` tables. For more information, see Section 17.6.1.3, “Importing InnoDB Tables”.

  Renames of partitioned tables are supported. You can rename individual partitions indirectly using `ALTER TABLE ... REORGANIZE PARTITION`; however, this operation copies the partition's data.

  To delete rows from selected partitions, use the `TRUNCATE PARTITION` option. This option takes a list of one or more comma-separated partition names. Consider the table `t1` created by this statement:

  ```
  CREATE TABLE t1 (
      id INT,
      year_col INT
  )
  PARTITION BY RANGE (year_col) (
      PARTITION p0 VALUES LESS THAN (1991),
      PARTITION p1 VALUES LESS THAN (1995),
      PARTITION p2 VALUES LESS THAN (1999),
      PARTITION p3 VALUES LESS THAN (2003),
      PARTITION p4 VALUES LESS THAN (2007)
  );
  ```

  To delete all rows from partition `p0`, use the following statement:

  ```
  ALTER TABLE t1 TRUNCATE PARTITION p0;
  ```

  The statement just shown has the same effect as the following `DELETE` statement:

  ```
  DELETE FROM t1 WHERE year_col < 1991;
  ```

  When truncating multiple partitions, the partitions do not have to be contiguous: This can greatly simplify delete operations on partitioned tables that would otherwise require very complex `WHERE` conditions if done with `DELETE` statements. For example, this statement deletes all rows from partitions `p1` and `p3`:

  ```
  ALTER TABLE t1 TRUNCATE PARTITION p1, p3;
  ```

  An equivalent `DELETE` statement is shown here:

  ```
  DELETE FROM t1 WHERE
      (year_col >= 1991 AND year_col < 1995)
      OR
      (year_col >= 2003 AND year_col < 2007);
  ```

  If you use the `ALL` keyword in place of the list of partition names, the statement acts on all table partitions.

  `TRUNCATE PARTITION` merely deletes rows; it does not alter the definition of the table itself, or of any of its partitions.

  To verify that the rows were dropped, check the `INFORMATION_SCHEMA.PARTITIONS` table, using a query such as this one:

  ```
  SELECT PARTITION_NAME, TABLE_ROWS
      FROM INFORMATION_SCHEMA.PARTITIONS
      WHERE TABLE_NAME = 't1';
  ```

  `COALESCE PARTITION` can be used with a table that is partitioned by `HASH` or `KEY` to reduce the number of partitions by *`number`*. Suppose that you have created table `t2` as follows:

  ```
  CREATE TABLE t2 (
      name VARCHAR (30),
      started DATE
  )
  PARTITION BY HASH( YEAR(started) )
  PARTITIONS 6;
  ```

  To reduce the number of partitions used by `t2` from 6 to 4, use the following statement:

  ```
  ALTER TABLE t2 COALESCE PARTITION 2;
  ```

  The data contained in the last *`number`* partitions is merged into the remaining partitions. In this case, partitions 4 and 5 are merged into the first 4 partitions (the partitions numbered 0, 1, 2, and 3).

  To change some but not all the partitions used by a partitioned table, you can use `REORGANIZE PARTITION`. This statement can be used in several ways:

  + To merge a set of partitions into a single partition. This is done by naming several partitions in the *`partition_names`* list and supplying a single definition for *`partition_definition`*.

  + To split an existing partition into several partitions. Accomplish this by naming a single partition for *`partition_names`* and providing multiple *`partition_definitions`*.

  + To change the ranges for a subset of partitions defined using `VALUES LESS THAN` or the value lists for a subset of partitions defined using `VALUES IN`.

  Note

  For partitions that have not been explicitly named, MySQL automatically provides the default names `p0`, `p1`, `p2`, and so on. The same is true with regard to subpartitions.

  For more detailed information about and examples of `ALTER TABLE ... REORGANIZE PARTITION` statements, see Section 26.3.1, “Management of RANGE and LIST Partitions”.

* To exchange a table partition or subpartition with a table, use the `ALTER TABLE ... EXCHANGE PARTITION` statement—that is, to move any existing rows in the partition or subpartition to the nonpartitioned table, and any existing rows in the nonpartitioned table to the table partition or subpartition.

  Once one or more columns have been added to a partitioned table using `ALGORITHM=INSTANT`, it is no longer possible to exchange partitions with that table.

  For usage information and examples, see Section 26.3.3, “Exchanging Partitions and Subpartitions with Tables”.

* Several options provide partition maintenance and repair functionality analogous to that implemented for nonpartitioned tables by statements such as `CHECK TABLE` and `REPAIR TABLE` (which are also supported for partitioned tables; for more information, see Section 15.7.3, “Table Maintenance Statements”). These include `ANALYZE PARTITION`, `CHECK PARTITION`, `OPTIMIZE PARTITION`, `REBUILD PARTITION`, and `REPAIR PARTITION`. Each of these options takes a *`partition_names`* clause consisting of one or more names of partitions, separated by commas. The partitions must already exist in the target table. You can also use the `ALL` keyword in place of *`partition_names`*, in which case the statement acts on all table partitions. For more information and examples, see Section 26.3.4, “Maintenance of Partitions”.

  `InnoDB` does not currently support per-partition optimization; `ALTER TABLE ... OPTIMIZE PARTITION` causes the entire table to rebuilt and analyzed, and an appropriate warning to be issued. (Bug #11751825, Bug #42822) To work around this problem, use `ALTER TABLE ... REBUILD PARTITION` and `ALTER TABLE ... ANALYZE PARTITION` instead.

  The `ANALYZE PARTITION`, `CHECK PARTITION`, `OPTIMIZE PARTITION`, and `REPAIR PARTITION` options are not supported for tables which are not partitioned.

* `REMOVE PARTITIONING` enables you to remove a table's partitioning without otherwise affecting the table or its data. This option can be combined with other `ALTER TABLE` options such as those used to add, drop, or rename columns or indexes.

* Using the `ENGINE` option with `ALTER TABLE` changes the storage engine used by the table without affecting the partitioning. The target storage engine must provide its own partitioning handler. Only the `InnoDB` and `NDB` storage engines have native partitioning handlers.

It is possible for an `ALTER TABLE` statement to contain a `PARTITION BY` or `REMOVE PARTITIONING` clause in an addition to other alter specifications, but the `PARTITION BY` or `REMOVE PARTITIONING` clause must be specified last after any other specifications.

The `ADD PARTITION`, `DROP PARTITION`, `COALESCE PARTITION`, `REORGANIZE PARTITION`, `ANALYZE PARTITION`, `CHECK PARTITION`, and `REPAIR PARTITION` options cannot be combined with other alter specifications in a single `ALTER TABLE`, since the options just listed act on individual partitions. For more information, see Section 15.1.11.1, “ALTER TABLE Partition Operations”.

Only a single instance of any one of the following options can be used in a given `ALTER TABLE` statement: `PARTITION BY`, `ADD PARTITION`, `DROP PARTITION`, `TRUNCATE PARTITION`, `EXCHANGE PARTITION`, `REORGANIZE PARTITION`, or `COALESCE PARTITION`, `ANALYZE PARTITION`, `CHECK PARTITION`, `OPTIMIZE PARTITION`, `REBUILD PARTITION`, `REMOVE PARTITIONING`.

For example, the following two statements are invalid:

```
ALTER TABLE t1 ANALYZE PARTITION p1, ANALYZE PARTITION p2;

ALTER TABLE t1 ANALYZE PARTITION p1, CHECK PARTITION p2;
```

In the first case, you can analyze partitions `p1` and `p2` of table `t1` concurrently using a single statement with a single `ANALYZE PARTITION` option that lists both of the partitions to be analyzed, like this:

```
ALTER TABLE t1 ANALYZE PARTITION p1, p2;
```

In the second case, it is not possible to perform `ANALYZE` and `CHECK` operations on different partitions of the same table concurrently. Instead, you must issue two separate statements, like this:

```
ALTER TABLE t1 ANALYZE PARTITION p1;
ALTER TABLE t1 CHECK PARTITION p2;
```

`REBUILD` operations are currently unsupported for subpartitions. The `REBUILD` keyword is expressly disallowed with subpartitions, and causes `ALTER TABLE` to fail with an error if so used.

`CHECK PARTITION` and `REPAIR PARTITION` operations fail when the partition to be checked or repaired contains any duplicate key errors.

For more information about these statements, see Section 26.3.4, “Maintenance of Partitions”.


#### 15.1.11.2 ALTER TABLE and Generated Columns

`ALTER TABLE` operations permitted for generated columns are `ADD`, `MODIFY`, and `CHANGE`.

* Generated columns can be added.

  ```
  CREATE TABLE t1 (c1 INT);
  ALTER TABLE t1 ADD COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ```

* The data type and expression of generated columns can be modified.

  ```
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) STORED);
  ALTER TABLE t1 MODIFY COLUMN c2 TINYINT GENERATED ALWAYS AS (c1 + 5) STORED;
  ```

* Generated columns can be renamed or dropped, if no other column refers to them.

  ```
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) STORED);
  ALTER TABLE t1 CHANGE c2 c3 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ALTER TABLE t1 DROP COLUMN c3;
  ```

* Virtual generated columns cannot be altered to stored generated columns, or vice versa. To work around this, drop the column, then add it with the new definition.

  ```
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) VIRTUAL);
  ALTER TABLE t1 DROP COLUMN c2;
  ALTER TABLE t1 ADD COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ```

* Nongenerated columns can be altered to stored but not virtual generated columns.

  ```
  CREATE TABLE t1 (c1 INT, c2 INT);
  ALTER TABLE t1 MODIFY COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED;
  ```

* Stored but not virtual generated columns can be altered to nongenerated columns. The stored generated values become the values of the nongenerated column.

  ```
  CREATE TABLE t1 (c1 INT, c2 INT GENERATED ALWAYS AS (c1 + 1) STORED);
  ALTER TABLE t1 MODIFY COLUMN c2 INT;
  ```

* `ADD COLUMN` is not an in-place operation for stored columns (done without using a temporary table) because the expression must be evaluated by the server. For stored columns, indexing changes are done in place, and expression changes are not done in place. Changes to column comments are done in place.

* For non-partitioned tables, `ADD COLUMN` and `DROP COLUMN` are in-place operations for virtual columns. However, adding or dropping a virtual column cannot be performed in place in combination with other `ALTER TABLE` operations.

  For partitioned tables, `ADD COLUMN` and `DROP COLUMN` are not in-place operations for virtual columns.

* `InnoDB` supports secondary indexes on virtual generated columns. Adding or dropping a secondary index on a virtual generated column is an in-place operation. For more information, see Section 15.1.24.9, “Secondary Indexes and Generated Columns”.

* When a `VIRTUAL` generated column is added to a table or modified, it is not ensured that data being calculated by the generated column expression is not out of range for the column. This can lead to inconsistent data being returned and unexpectedly failed statements. To permit control over whether validation occurs for such columns, `ALTER TABLE` supports `WITHOUT VALIDATION` and `WITH VALIDATION` clauses:

  + With `WITHOUT VALIDATION` (the default if neither clause is specified), an in-place operation is performed (if possible), data integrity is not checked, and the statement finishes more quickly. However, later reads from the table might report warnings or errors for the column if values are out of range.

  + With `WITH VALIDATION`, `ALTER TABLE` copies the table. If an out-of-range or any other error occurs, the statement fails. Because a table copy is performed, the statement takes longer.

  `WITHOUT VALIDATION` and `WITH VALIDATION` are permitted only with `ADD COLUMN`, `CHANGE COLUMN`, and `MODIFY COLUMN` operations. Otherwise, an `ER_WRONG_USAGE` error occurs.

* If expression evaluation causes truncation or provides incorrect input to a function, the `ALTER TABLE` statement terminates with an error and the DDL operation is rejected.

* An `ALTER TABLE` statement that changes the default value of a column *`col_name`* may also change the value of a generated column expression that refers to the column using *`col_name`*, which may change the value of a generated column expression that refers to the column using `DEFAULT(col_name)`. For this reason, `ALTER TABLE` operations that change the definition of a column cause a table rebuild if any generated column expression uses `DEFAULT()`.


#### 15.1.11.3 ALTER TABLE Examples

Begin with a table `t1` created as shown here:

```
CREATE TABLE t1 (a INTEGER, b CHAR(10));
```

To rename the table from `t1` to `t2`:

```
ALTER TABLE t1 RENAME t2;
```

To change column `a` from `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") to `TINYINT NOT NULL` (leaving the name the same), and to change column `b` from `CHAR(10)` to `CHAR(20)` as well as renaming it from `b` to `c`:

```
ALTER TABLE t2 MODIFY a TINYINT NOT NULL, CHANGE b c CHAR(20);
```

To add a new `TIMESTAMP` column named `d`:

```
ALTER TABLE t2 ADD d TIMESTAMP;
```

To add an index on column `d` and a `UNIQUE` index on column `a`:

```
ALTER TABLE t2 ADD INDEX (d), ADD UNIQUE (a);
```

To remove column `c`:

```
ALTER TABLE t2 DROP COLUMN c;
```

To add a new `AUTO_INCREMENT` integer column named `c`:

```
ALTER TABLE t2 ADD c INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ADD PRIMARY KEY (c);
```

We indexed `c` (as a `PRIMARY KEY`) because `AUTO_INCREMENT` columns must be indexed, and we declare `c` as `NOT NULL` because primary key columns cannot be `NULL`.

For `NDB` tables, it is also possible to change the storage type used for a table or column. For example, consider an `NDB` table created as shown here:

```
mysql> CREATE TABLE t1 (c1 INT) TABLESPACE ts_1 ENGINE NDB;
Query OK, 0 rows affected (1.27 sec)
```

To convert this table to disk-based storage, you can use the following `ALTER TABLE` statement:

```
mysql> ALTER TABLE t1 TABLESPACE ts_1 STORAGE DISK;
Query OK, 0 rows affected (2.99 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW CREATE TABLE t1\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t1` (
  `c1` int(11) DEFAULT NULL
) /*!50100 TABLESPACE ts_1 STORAGE DISK */
ENGINE=ndbcluster DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.01 sec)
```

It is not necessary that the tablespace was referenced when the table was originally created; however, the tablespace must be referenced by the `ALTER TABLE`:

```
mysql> CREATE TABLE t2 (c1 INT) ts_1 ENGINE NDB;
Query OK, 0 rows affected (1.00 sec)

mysql> ALTER TABLE t2 STORAGE DISK;
ERROR 1005 (HY000): Can't create table 'c.#sql-1750_3' (errno: 140)
mysql> ALTER TABLE t2 TABLESPACE ts_1 STORAGE DISK;
Query OK, 0 rows affected (3.42 sec)
Records: 0  Duplicates: 0  Warnings: 0
mysql> SHOW CREATE TABLE t2\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t2` (
  `c1` int(11) DEFAULT NULL
) /*!50100 TABLESPACE ts_1 STORAGE DISK */
ENGINE=ndbcluster DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.01 sec)
```

To change the storage type of an individual column, you can use `ALTER TABLE ... MODIFY [COLUMN]`. For example, suppose you create an NDB Cluster Disk Data table with two columns, using this `CREATE TABLE` statement:

```
mysql> CREATE TABLE t3 (c1 INT, c2 INT)
    ->     TABLESPACE ts_1 STORAGE DISK ENGINE NDB;
Query OK, 0 rows affected (1.34 sec)
```

To change column `c2` from disk-based to in-memory storage, include a `STORAGE MEMORY` clause in the column definition used by the `ALTER TABLE` statement, as shown here:

```
mysql> ALTER TABLE t3 MODIFY c2 INT STORAGE MEMORY;
Query OK, 0 rows affected (3.14 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

You can make an in-memory column into a disk-based column by using `STORAGE DISK` in a similar fashion.

Column `c1` uses disk-based storage, since this is the default for the table (determined by the table-level `STORAGE DISK` clause in the `CREATE TABLE` statement). However, column `c2` uses in-memory storage, as can be seen here in the output of [`SHOW CREATE TABLE`](show-create-table.html "15.7.7.12 SHOW CREATE TABLE Statement"):

```
mysql> SHOW CREATE TABLE t3\G
*************************** 1. row ***************************
       Table: t3
Create Table: CREATE TABLE `t3` (
  `c1` int(11) DEFAULT NULL,
  `c2` int(11) /*!50120 STORAGE MEMORY */ DEFAULT NULL
) /*!50100 TABLESPACE ts_1 STORAGE DISK */ ENGINE=ndbcluster DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.02 sec)
```

When you add an `AUTO_INCREMENT` column, column values are filled in with sequence numbers automatically. For `MyISAM` tables, you can set the first sequence number by executing `SET INSERT_ID=value` before `ALTER TABLE` or by using the `AUTO_INCREMENT=value` table option.

With `MyISAM` tables, if you do not change the `AUTO_INCREMENT` column, the sequence number is not affected. If you drop an `AUTO_INCREMENT` column and then add another `AUTO_INCREMENT` column, the numbers are resequenced beginning with 1.

When replication is used, adding an `AUTO_INCREMENT` column to a table might not produce the same ordering of the rows on the replica and the source. This occurs because the order in which the rows are numbered depends on the specific storage engine used for the table and the order in which the rows were inserted. If it is important to have the same order on the source and replica, the rows must be ordered before assigning an `AUTO_INCREMENT` number. Assuming that you want to add an `AUTO_INCREMENT` column to the table `t1`, the following statements produce a new table `t2` identical to `t1` but with an `AUTO_INCREMENT` column:

```
CREATE TABLE t2 (id INT AUTO_INCREMENT PRIMARY KEY)
SELECT * FROM t1 ORDER BY col1, col2;
```

This assumes that the table `t1` has columns `col1` and `col2`.

This set of statements also produces a new table `t2` identical to `t1`, with the addition of an `AUTO_INCREMENT` column:

```
CREATE TABLE t2 LIKE t1;
ALTER TABLE t2 ADD id INT AUTO_INCREMENT PRIMARY KEY;
INSERT INTO t2 SELECT * FROM t1 ORDER BY col1, col2;
```

Important

To guarantee the same ordering on both source and replica, *all* columns of `t1` must be referenced in the `ORDER BY` clause.

Regardless of the method used to create and populate the copy having the `AUTO_INCREMENT` column, the final step is to drop the original table and then rename the copy:

```
DROP TABLE t1;
ALTER TABLE t2 RENAME t1;
```


### 15.1.12 ALTER TABLESPACE Statement

```
ALTER [UNDO] TABLESPACE tablespace_name
  NDB only:
    {ADD | DROP} DATAFILE 'file_name'
    [INITIAL_SIZE [=] size]
    [WAIT]
  InnoDB and NDB:
    [RENAME TO tablespace_name]
  InnoDB only:
    [AUTOEXTEND_SIZE [=] 'value']
    [SET {ACTIVE | INACTIVE}]
    [ENCRYPTION [=] {'Y' | 'N'}]
  InnoDB and NDB:
    [ENGINE [=] engine_name]
  Reserved for future use:
    [ENGINE_ATTRIBUTE [=] 'string']
```

This statement is used with `NDB` and `InnoDB` tablespaces. It can be used to add a new data file to, or to drop a data file from an `NDB` tablespace. It can also be used to rename an NDB Cluster Disk Data tablespace, rename an `InnoDB` general tablespace, encrypt an `InnoDB` general tablespace, or mark an `InnoDB` undo tablespace as active or inactive.

The `UNDO` keyword is used with the `SET {ACTIVE | INACTIVE}` clause to mark an `InnoDB` undo tablespace as active or inactive. For more information, see Section 17.6.3.4, “Undo Tablespaces”.

The `ADD DATAFILE` variant enables you to specify an initial size for an `NDB` Disk Data tablespace using an `INITIAL_SIZE` clause, where *`size`* is measured in bytes; the default value is 134217728 (128 MB). You may optionally follow *`size`* with a one-letter abbreviation for an order of magnitude, similar to those used in `my.cnf`. Generally, this is one of the letters `M` (megabytes) or `G` (gigabytes).

On 32-bit systems, the maximum supported value for `INITIAL_SIZE` is 4294967296 (4 GB). (Bug #29186)

`INITIAL_SIZE` is rounded, explicitly, as for `CREATE TABLESPACE`.

Once a data file has been created, its size cannot be changed; however, you can add more data files to an `NDB` tablespace using additional `ALTER TABLESPACE ... ADD DATAFILE` statements.

When `ALTER TABLESPACE ... ADD DATAFILE` is used with `ENGINE = NDB`, a data file is created on each Cluster data node, but only one row is generated in the Information Schema `FILES` table. See the description of this table, as well as Section 25.6.11.1, “NDB Cluster Disk Data Objects”, for more information. `ADD DATAFILE` is not supported with `InnoDB` tablespaces.

Using `DROP DATAFILE` with `ALTER TABLESPACE` drops the data file '*`file_name`*' from an `NDB` tablespace. You cannot drop a data file from a tablespace which is in use by any table; in other words, the data file must be empty (no extents used). See Section 25.6.11.1, “NDB Cluster Disk Data Objects”. In addition, any data file to be dropped must previously have been added to the tablespace with `CREATE TABLESPACE` or `ALTER TABLESPACE`. `DROP DATAFILE` is not supported with `InnoDB` tablespaces.

`WAIT` is parsed but otherwise ignored. It is intended for future expansion.

The `ENGINE` clause, which specifies the storage engine used by the tablespace, is deprecated, since the tablespace storage engine is known by the data dictionary, making the `ENGINE` clause obsolete. In MySQL 9.5, it is supported in the following two cases only:

* ``` ALTER TABLESPACE tablespace_name ADD DATAFILE 'file_name' ENGINE={NDB|NDBCLUSTER}
  ```
* ```
  ALTER UNDO TABLESPACE tablespace_name SET {ACTIVE|INACTIVE}
      ENGINE=INNODB
  ```

You should expect the eventual removal of `ENGINE` from these statements as well, in a future version of MySQL.

`RENAME TO` operations are implicitly performed in autocommit mode, regardless of the value of `autocommit`.

A `RENAME TO` operation cannot be performed while `LOCK TABLES` or [`FLUSH TABLES WITH READ LOCK`](flush.html "15.7.8.3 FLUSH Statement") is in effect for tables that reside in the tablespace.

Exclusive metadata locks are taken on tables that reside in a general tablespace while the tablespace is renamed, which prevents concurrent DDL. Concurrent DML is supported.

The `CREATE TABLESPACE` privilege is required to rename an `InnoDB` general tablespace.

The `AUTOEXTEND_SIZE` option defines the amount by which `InnoDB` extends the size of a tablespace when it becomes full. The setting must be a multiple of 4MB. The default setting is 0, which causes the tablespace to be extended according to the implicit default behavior. For more information, see Section 17.6.3.9, “Tablespace AUTOEXTEND_SIZE Configuration”.

The `ENCRYPTION` clause enables or disables page-level data encryption for an `InnoDB` general tablespace or the `mysql` system tablespace.

A keyring plugin must be installed and configured before encryption can be enabled.

If the `table_encryption_privilege_check` variable is enabled, the `TABLE_ENCRYPTION_ADMIN` privilege is required to alter a general tablespace with an `ENCRYPTION` clause setting that differs from the `default_table_encryption` setting.

Enabling encryption for a general tablespace fails if any table in the tablespace belongs to a schema defined with `DEFAULT ENCRYPTION='N'`. Similarly, disabling encryption fails if any table in the general tablespace belongs to a schema defined with `DEFAULT ENCRYPTION='Y'`.

If an `ALTER TABLESPACE` statement executed on a general tablespace does not include an `ENCRYPTION` clause, the tablespace retains its current encryption status, regardless of the `default_table_encryption` setting.

When a general tablespace or the `mysql` system tablespace is encrypted, all tables residing in the tablespace are encrypted. Likewise, a table created in an encrypted tablespace is encrypted.

The `INPLACE` algorithm is used when altering the `ENCRYPTION` attribute of a general tablespace or the `mysql` system tablespace. The `INPLACE` algorithm permits concurrent DML on tables that reside in the tablespace. Concurrent DDL is blocked.

For more information, see Section 17.13, “InnoDB Data-at-Rest Encryption”.

The `ENGINE_ATTRIBUTE` option is used to specify tablespace attributes for primary storage engines. The option is reserved for future use.

The value assigned to this option is a string literal containing a valid JSON document or an empty string (''). Invalid JSON is rejected.

```
ALTER TABLESPACE ts1 ENGINE_ATTRIBUTE='{"key":"value"}';
```

`ENGINE_ATTRIBUTE` values can be repeated without error. In this case, the last specified value is used.

`ENGINE_ATTRIBUTE` values are not checked by the server, nor are they cleared when the table's storage engine is changed.

It is not permitted to alter an individual element of a JSON attribute value. You can only add or replace an attribute.


### 15.1.13 ALTER VIEW Statement

```
ALTER
    [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
    [MATERIALIZED] ...
    [DEFINER = user]
    [SQL SECURITY { DEFINER | INVOKER }]
    VIEW view_name [(column_list)]
    AS select_statement
    [WITH [CASCADED | LOCAL] CHECK OPTION]
```

This statement changes the definition of a view, which must exist. The syntax is similar to that for [`CREATE VIEW`](create-view.html "15.1.27 CREATE VIEW Statement") see Section 15.1.27, “CREATE VIEW Statement”). This statement requires the `CREATE VIEW` and `DROP` privileges for the view, and some privilege for each column referred to in the `SELECT` statement. `ALTER VIEW` is permitted only to the definer or users with the `SET_ANY_DEFINER` or `ALLOW_NONEXISTENT_DEFINER` privilege.

Materialized views is only supported on MySQL HeatWave. See Query Materalized Views to learn more.


### 15.1.14 CREATE DATABASE Statement

```
CREATE {DATABASE | SCHEMA} [IF NOT EXISTS] db_name
    [create_option] ...

create_option: [DEFAULT] {
    CHARACTER SET [=] charset_name
  | COLLATE [=] collation_name
  | ENCRYPTION [=] {'Y' | 'N'}
}
```

`CREATE DATABASE` creates a database with the given name. To use this statement, you need the `CREATE` privilege for the database. [`CREATE SCHEMA`](create-database.html "15.1.14 CREATE DATABASE Statement") is a synonym for [`CREATE DATABASE`](create-database.html "15.1.14 CREATE DATABASE Statement").

An error occurs if the database exists and you did not specify `IF NOT EXISTS`.

`CREATE DATABASE` is not permitted within a session that has an active [`LOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") statement.

Each *`create_option`* specifies a database characteristic. Database characteristics are stored in the data dictionary.

* The `CHARACTER SET` option specifies the default database character set. The `COLLATE` option specifies the default database collation. For information about character set and collation names, see Chapter 12, *Character Sets, Collations, Unicode*.

  To see the available character sets and collations, use the the `SHOW CHARACTER SET` and `SHOW COLLATION` statements, respectively. See Section 15.7.7.4, “SHOW CHARACTER SET Statement”, and Section 15.7.7.5, “SHOW COLLATION Statement”.

* The `ENCRYPTION` option defines the default database encryption, which is inherited by tables created in the database. The permitted values are `'Y'` (encryption enabled) and `'N'` (encryption disabled). If the `ENCRYPTION` option is not specified, the value of the `default_table_encryption` system variable defines the default database encryption. If the `table_encryption_privilege_check` system variable is enabled, the `TABLE_ENCRYPTION_ADMIN` privilege is required to specify a default encryption setting that differs from the `default_table_encryption` setting. For more information, see Defining an Encryption Default for Schemas and General Tablespaces.

A database in MySQL is implemented as a directory containing files that correspond to tables in the database. Because there are no tables in a database when it is initially created, the `CREATE DATABASE` statement creates only a directory under the MySQL data directory. Rules for permissible database names are given in Section 11.2, “Schema Object Names”. If a database name contains special characters, the name for the database directory contains encoded versions of those characters as described in Section 11.2.4, “Mapping of Identifiers to File Names”.

Creating a database directory by manually creating a directory under the data directory (for example, with **mkdir**) is unsupported in MySQL 9.5.

When you create a database, let the server manage the directory and the files in it. Manipulating database directories and files directly can cause inconsistencies and unexpected results.

MySQL has no limit on the number of databases. The underlying file system may have a limit on the number of directories.

You can also use the **mysqladmin** program to create databases. See Section 6.5.2, “mysqladmin — A MySQL Server Administration Program”.


### 15.1.15 CREATE EVENT Statement

```
CREATE
    [DEFINER = user]
    EVENT
    [IF NOT EXISTS]
    event_name
    ON SCHEDULE schedule
    [ON COMPLETION [NOT] PRESERVE]
    [ENABLE | DISABLE | DISABLE ON {REPLICA | SLAVE}]
    [COMMENT 'string']
    DO event_body

schedule: {
    AT timestamp [+ INTERVAL interval] ...
  | EVERY interval
    [STARTS timestamp [+ INTERVAL interval] ...]
    [ENDS timestamp [+ INTERVAL interval] ...]
}

interval:
    quantity {YEAR | QUARTER | MONTH | DAY | HOUR | MINUTE |
              WEEK | SECOND | YEAR_MONTH | DAY_HOUR | DAY_MINUTE |
              DAY_SECOND | HOUR_MINUTE | HOUR_SECOND | MINUTE_SECOND}
```

This statement creates and schedules a new event. The event does not run unless the Event Scheduler is enabled. For information about checking Event Scheduler status and enabling it if necessary, see Section 27.5.2, “Event Scheduler Configuration”.

`CREATE EVENT` requires the `EVENT` privilege for the schema in which the event is to be created. If the `DEFINER` clause is present, the privileges required depend on the *`user`* value, as discussed in Section 27.8, “Stored Object Access Control”.

The minimum requirements for a valid [`CREATE EVENT`](create-event.html "15.1.15 CREATE EVENT Statement") statement are as follows:

* The keywords `CREATE EVENT` plus an event name, which uniquely identifies the event in a database schema.

* An `ON SCHEDULE` clause, which determines when and how often the event executes.

* A `DO` clause, which contains the SQL statement to be executed by an event.

This is an example of a minimal [`CREATE EVENT`](create-event.html "15.1.15 CREATE EVENT Statement") statement:

```
CREATE EVENT myevent
    ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 HOUR
    DO
      UPDATE myschema.mytable SET mycol = mycol + 1;
```

The previous statement creates an event named `myevent`. This event executes once—one hour following its creation—by running an SQL statement that increments the value of the `myschema.mytable` table's `mycol` column by 1.

The *`event_name`* must be a valid MySQL identifier with a maximum length of 64 characters. Event names are not case-sensitive, so you cannot have two events named `myevent` and `MyEvent` in the same schema. In general, the rules governing event names are the same as those for names of stored routines. See Section 11.2, “Schema Object Names”.

An event is associated with a schema. If no schema is indicated as part of *`event_name`*, the default (current) schema is assumed. To create an event in a specific schema, qualify the event name with a schema using `schema_name.event_name` syntax.

The `DEFINER` clause specifies the MySQL account to be used when checking access privileges at event execution time. If the `DEFINER` clause is present, the *`user`* value should be a MySQL account specified as `'user_name'@'host_name'`, `CURRENT_USER`, or `CURRENT_USER()`. The permitted *`user`* values depend on the privileges you hold, as discussed in Section 27.8, “Stored Object Access Control”. Also see that section for additional information about event security.

If the `DEFINER` clause is omitted, the default definer is the user who executes the [`CREATE EVENT`](create-event.html "15.1.15 CREATE EVENT Statement") statement. This is the same as specifying `DEFINER = CURRENT_USER` explicitly.

Within an event body, the `CURRENT_USER` function returns the account used to check privileges at event execution time, which is the `DEFINER` user. For information about user auditing within events, see Section 8.2.23, “SQL-Based Account Activity Auditing”.

`IF NOT EXISTS` has the same meaning for `CREATE EVENT` as for `CREATE TABLE`: If an event named *`event_name`* already exists in the same schema, no action is taken, and no error results. (However, a warning is generated in such cases.)

The `ON SCHEDULE` clause determines when, how often, and for how long the *`event_body`* defined for the event repeats. This clause takes one of two forms:

* `AT timestamp` is used for a one-time event. It specifies that the event executes one time only at the date and time given by *`timestamp`*, which must include both the date and time, or must be an expression that resolves to a datetime value. You may use a value of either the `DATETIME` or `TIMESTAMP` type for this purpose. If the date is in the past, a warning occurs, as shown here:

  ```
  mysql> SELECT NOW();
  +---------------------+
  | NOW()               |
  +---------------------+
  | 2006-02-10 23:59:01 |
  +---------------------+
  1 row in set (0.04 sec)

  mysql> CREATE EVENT e_totals
      ->     ON SCHEDULE AT '2006-02-10 23:59:00'
      ->     DO INSERT INTO test.totals VALUES (NOW());
  Query OK, 0 rows affected, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Note
     Code: 1588
  Message: Event execution time is in the past and ON COMPLETION NOT
           PRESERVE is set. The event was dropped immediately after
           creation.
  ```

  `CREATE EVENT` statements which are themselves invalid—for whatever reason—fail with an error.

  You may use `CURRENT_TIMESTAMP` to specify the current date and time. In such a case, the event acts as soon as it is created.

  To create an event which occurs at some point in the future relative to the current date and time—such as that expressed by the phrase “three weeks from now”—you can use the optional clause `+ INTERVAL interval`. The *`interval`* portion consists of two parts, a quantity and a unit of time, and follows the syntax rules described in Temporal Intervals, except that you cannot use any units keywords that involving microseconds when defining an event. With some interval types, complex time units may be used. For example, “two minutes and ten seconds” can be expressed as `+ INTERVAL '2:10' MINUTE_SECOND`.

  You can also combine intervals. For example, `AT CURRENT_TIMESTAMP + INTERVAL 3 WEEK + INTERVAL 2 DAY` is equivalent to “three weeks and two days from now”. Each portion of such a clause must begin with `+ INTERVAL`.

* To repeat actions at a regular interval, use an `EVERY` clause. The `EVERY` keyword is followed by an *`interval`* as described in the previous discussion of the `AT` keyword. (`+ INTERVAL` is *not* used with `EVERY`.) For example, `EVERY 6 WEEK` means “every six weeks”.

  Although `+ INTERVAL` clauses are not permitted in an `EVERY` clause, you can use the same complex time units permitted in a `+ INTERVAL`.

  An `EVERY` clause may contain an optional `STARTS` clause. `STARTS` is followed by a *`timestamp`* value that indicates when the action should begin repeating, and may also use `+ INTERVAL interval` to specify an amount of time “from now”. For example, `EVERY 3 MONTH STARTS CURRENT_TIMESTAMP + INTERVAL 1 WEEK` means “every three months, beginning one week from now”. Similarly, you can express “every two weeks, beginning six hours and fifteen minutes from now” as `EVERY 2 WEEK STARTS CURRENT_TIMESTAMP

  + INTERVAL '6:15' HOUR_MINUTE`. Not specifying `STARTS` is the same as using `STARTS CURRENT_TIMESTAMP`—that is, the action specified for the event begins repeating immediately upon creation of the event.

  An `EVERY` clause may contain an optional `ENDS` clause. The `ENDS` keyword is followed by a *`timestamp`* value that tells MySQL when the event should stop repeating. You may also use `+ INTERVAL interval` with `ENDS`; for instance, `EVERY 12 HOUR STARTS CURRENT_TIMESTAMP + INTERVAL 30 MINUTE ENDS CURRENT_TIMESTAMP + INTERVAL 4 WEEK` is equivalent to “every twelve hours, beginning thirty minutes from now, and ending four weeks from now”. Not using `ENDS` means that the event continues executing indefinitely.

  `ENDS` supports the same syntax for complex time units as `STARTS` does.

  You may use `STARTS`, `ENDS`, both, or neither in an `EVERY` clause.

  If a repeating event does not terminate within its scheduling interval, the result may be multiple instances of the event executing simultaneously. If this is undesirable, you should institute a mechanism to prevent simultaneous instances. For example, you could use the `GET_LOCK()` function, or row or table locking.

The `ON SCHEDULE` clause may use expressions involving built-in MySQL functions and user variables to obtain any of the *`timestamp`* or *`interval`* values which it contains. You may not use stored functions or loadable functions in such expressions, nor may you use any table references; however, you may use `SELECT FROM DUAL`. This is true for both `CREATE EVENT` and `ALTER EVENT` statements. References to stored functions, loadable functions, and tables in such cases are specifically not permitted, and fail with an error (see Bug #22830).

Times in the `ON SCHEDULE` clause are interpreted using the current session `time_zone` value. This becomes the event time zone; that is, the time zone that is used for event scheduling and is in effect within the event as it executes. These times are converted to UTC and stored along with the event time zone internally. This enables event execution to proceed as defined regardless of any subsequent changes to the server time zone or daylight saving time effects. For additional information about representation of event times, see Section 27.5.4, “Event Metadata”. See also Section 15.7.7.20, “SHOW EVENTS Statement”, and Section 28.3.14, “The INFORMATION_SCHEMA EVENTS Table”.

Normally, once an event has expired, it is immediately dropped. You can override this behavior by specifying `ON COMPLETION PRESERVE`. Using `ON COMPLETION NOT PRESERVE` merely makes the default nonpersistent behavior explicit.

You can create an event but prevent it from being active using the `DISABLE` keyword. Alternatively, you can use `ENABLE` to make explicit the default status, which is active. This is most useful in conjunction with `ALTER EVENT` (see Section 15.1.3, “ALTER EVENT Statement”).

A third value may also appear in place of `ENABLE` or `DISABLE`; `DISABLE ON REPLICA` is set for the status of an event on a replica to indicate that the event was created on the replication source server and replicated to the replica, but is not executed on the replica. See Section 19.5.1.16, “Replication of Invoked Features”.

`DISABLE ON REPLICA` replaces `DISABLE ON SLAVE`, which is deprecated, and thus subject to removal in a future version of MySQL.

You may supply a comment for an event using a `COMMENT` clause. *`comment`* may be any string of up to 64 characters that you wish to use for describing the event. The comment text, being a string literal, must be surrounded by quotation marks.

The `DO` clause specifies an action carried by the event, and consists of an SQL statement. Nearly any valid MySQL statement that can be used in a stored routine can also be used as the action statement for a scheduled event. (See Section 27.10, “Restrictions on Stored Programs”.) For example, the following event `e_hourly` deletes all rows from the `sessions` table once per hour, where this table is part of the `site_activity` schema:

```
CREATE EVENT e_hourly
    ON SCHEDULE
      EVERY 1 HOUR
    COMMENT 'Clears out sessions table each hour.'
    DO
      DELETE FROM site_activity.sessions;
```

MySQL stores the `sql_mode` system variable setting in effect when an event is created or altered, and always executes the event with this setting in force, *regardless of the current server SQL mode when the event begins executing*.

A `CREATE EVENT` statement that contains an `ALTER EVENT` statement in its `DO` clause appears to succeed; however, when the server attempts to execute the resulting scheduled event, the execution fails with an error.

Note

Statements such as `SELECT` or `SHOW` that merely return a result set have no effect when used in an event; the output from these is not sent to the MySQL Monitor, nor is it stored anywhere. However, you can use statements such as [`SELECT ... INTO`](select.html "15.2.13 SELECT Statement") and [`INSERT INTO ... SELECT`](insert-select.html "15.2.7.1 INSERT ... SELECT Statement") that store a result. (See the next example in this section for an instance of the latter.)

The schema to which an event belongs is the default schema for table references in the `DO` clause. Any references to tables in other schemas must be qualified with the proper schema name.

As with stored routines, you can use compound-statement syntax in the `DO` clause by using the `BEGIN` and `END` keywords, as shown here:

```
delimiter |

CREATE EVENT e_daily
    ON SCHEDULE
      EVERY 1 DAY
    COMMENT 'Saves total number of sessions then clears the table each day'
    DO
      BEGIN
        INSERT INTO site_activity.totals (time, total)
          SELECT CURRENT_TIMESTAMP, COUNT(*)
            FROM site_activity.sessions;
        DELETE FROM site_activity.sessions;
      END |

delimiter ;
```

This example uses the `delimiter` command to change the statement delimiter. See Section 27.1, “Defining Stored Programs”.

More complex compound statements, such as those used in stored routines, are possible in an event. This example uses local variables, an error handler, and a flow control construct:

```
delimiter |

CREATE EVENT e
    ON SCHEDULE
      EVERY 5 SECOND
    DO
      BEGIN
        DECLARE v INTEGER;
        DECLARE CONTINUE HANDLER FOR SQLEXCEPTION BEGIN END;

        SET v = 0;

        WHILE v < 5 DO
          INSERT INTO t1 VALUES (0);
          UPDATE t2 SET s1 = s1 + 1;
          SET v = v + 1;
        END WHILE;
    END |

delimiter ;
```

There is no way to pass parameters directly to or from events; however, it is possible to invoke a stored routine with parameters within an event:

```
CREATE EVENT e_call_myproc
    ON SCHEDULE
      AT CURRENT_TIMESTAMP + INTERVAL 1 DAY
    DO CALL myproc(5, 27);
```

In MySQL 9.5, a `CREATE EVENT` statement can be prepared, but the statement text must not contain any placeholders (`?`). One way to get around this restriction is to assemble the text of the statement, prepare it, and execute it within a stored procedure; variable parts of the `CREATE EVENT` statement can be passed into the stored procedure as parameters. We demonstrate this in the following example, which assumes that there already exists a table `t` in database `d` created as shown here:

```
USE d;

CREATE TABLE t (
  c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  c2 VARCHAR(20),
  c3 INT
);
```

We wish to create an event that inserts rows into this table at intervals determined at creation time, similar to the event defined by the statement shown here:

```
CREATE EVENT e
  ON SCHEDULE EVERY interval SECOND
  STARTS CURRENT_TIMESTAMP + INTERVAL 10 SECOND
  ENDS CURRENT_TIMESTAMP + INTERVAL 2 MINUTE
  ON COMPLETION PRESERVE
  DO
    INSERT INTO d.t1 VALUES ROW(NULL, NOW(), FLOOR(RAND()*100));
```

We cannot use `?` as a placeholder for *`interval`*, but we can pass a parameter value to a stored procedure like this one:

```
delimiter |

CREATE PROCEDURE sp(n INT)
BEGIN
  SET @s1 = "CREATE EVENT e ON SCHEDULE EVERY ";
  SET @s2 = " SECOND
       STARTS CURRENT_TIMESTAMP + INTERVAL 10 SECOND
       ENDS CURRENT_TIMESTAMP + INTERVAL 2 MINUTE
       ON COMPLETION PRESERVE
       DO
       INSERT INTO d.t VALUES ROW(NULL, NOW(), FLOOR(RAND()*100))";

  SET @s = CONCAT(@s1, n, @s2);
  PREPARE ps FROM @s;
  EXECUTE ps;
  DEALLOCATE PREPARE ps;
END |

delimiter ;
```

```
mysql> TABLE t;
Empty set (0.00 sec)

mysql> CALL sp(5);
Query OK, 0 rows affected (0.01 sec)

# Wait 2 minutes...

mysql> TABLE t;
+----+---------------------+------+
| c1 | c2                  | c3   |
+----+---------------------+------+
|  1 | 2024-06-12 15:53:36 |   41 |
|  2 | 2024-06-12 15:53:41 |   84 |
|  3 | 2024-06-12 15:53:46 |   71 |
|  4 | 2024-06-12 15:53:51 |   78 |
|  5 | 2024-06-12 15:53:56 |   53 |
|  6 | 2024-06-12 15:54:01 |    6 |
|  7 | 2024-06-12 15:54:06 |   48 |
|  8 | 2024-06-12 15:54:11 |   98 |
|  9 | 2024-06-12 15:54:16 |   22 |
| 10 | 2024-06-12 15:54:21 |   88 |
| 11 | 2024-06-12 15:54:26 |   53 |
| 12 | 2024-06-12 15:54:31 |   75 |
| 13 | 2024-06-12 15:54:36 |   93 |
| 14 | 2024-06-12 15:54:41 |   13 |
| 15 | 2024-06-12 15:54:46 |   62 |
| 16 | 2024-06-12 15:54:51 |   47 |
| 17 | 2024-06-12 15:54:56 |   22 |
| 18 | 2024-06-12 15:55:01 |   47 |
| 19 | 2024-06-12 15:55:06 |   43 |
| 20 | 2024-06-12 15:55:11 |   50 |
| 21 | 2024-06-12 15:55:16 |   98 |
| 22 | 2024-06-12 15:55:21 |   15 |
| 23 | 2024-06-12 15:55:26 |   56 |
+----+---------------------+------+
23 rows in set (0.00 sec)
```

After invoking `sp` with the argument value `5`, as shown, and waiting 2 minutes until event `e` has completed its run, we can see that table `t` was updated every 5 seconds. Since `e` was created with `ON COMPLETION PRESERVE`, we can see it in Information Schema `EVENTS` table and verify that it was created as expected:

```
mysql> SELECT EVENT_NAME, EVENT_SCHEMA, EVENT_DEFINITION, EVENT_TYPE
     > FROM INFORMATION_SCHEMA.EVENTS WHERE EVENT_NAME='e'\G
*************************** 1. row ***************************
      EVENT_NAME: e
    EVENT_SCHEMA: d
EVENT_DEFINITION: INSERT INTO d.t VALUES ROW(NULL, NOW(), FLOOR(RAND()*100))
      EVENT_TYPE: RECURRING
1 row in set (0.00 sec)
```

If an event's definer has privileges sufficient to set global system variables (see Section 7.1.9.1, “System Variable Privileges”), the event can read and write global variables. As granting such privileges entails a potential for abuse, extreme care must be taken in doing so.

Generally, any statements that are valid in stored routines may be used for action statements executed by events. For more information about statements permissible within stored routines, see Section 27.2.1, “Stored Routine Syntax”. It is not possible to create an event as part of a stored routine or to create an event by another event.


### 15.1.16 CREATE FUNCTION Statement

The `CREATE FUNCTION` statement is used to create stored functions and loadable functions:

* For information about creating stored functions, see Section 15.1.21, “CREATE PROCEDURE and CREATE FUNCTION Statements”.

* For information about creating loadable functions, see Section 15.7.4.1, “CREATE FUNCTION Statement for Loadable Functions”.


### 15.1.17 CREATE JSON DUALITY VIEW Statement

```
CREATE [OR REPLACE]
    [ALGORITHM = {UNDEFINED | MERGE}]
    [DEFINER = user]
    [SQL SECURITY {DEFINER | INVOKER}]
    JSON [RELATIONAL] DUALITY VIEW
    [IF NOT EXISTS] [schema_name.]view_name
    AS json_duality_select_statement

json_duality_select_statement:
    SELECT json_duality_object_expression
    FROM [schema_name.]root_table_name [AS table_alias]

json_duality_object_expression:
    JSON_DUALITY_OBJECT(...)
```

This statement creates a JSON duality view named *`view_name`*. Using `OR REPLACE` causes any existing JSON duality view of that name to be replaced by a new JSON duality view having the same name. Specifying `IF NOT EXISTS` causes view creation to be attempted only if there is no existing JSON duality view with the same name, rather than returning an error.

JSON duality views use the same namespace as SQL views. This means that you cannot create a JSON duality view having the same name as an existing SQL view; it also means that you cannot create an SQL view with the same name as an existing JSON duality view. `CREATE OR REPLACE` does not work to replace an SQL view with a JSON duality view, or a JSON duality view with an SQL view.

`DEFINER` and `SQL SECURITY` work with this statement as they do for `CREATE VIEW`. For `ALGORITHM`, using `TEMPTABLE` returns an error.

The `RELATIONAL` keyword is optional, has no effect, and is omitted from our examples.

*`schema_name`*, if used with the view name, must be the name of an existing schema. If the schema name is omitted, the JSON duality view is created in the current schema; if no schema is currently selected and none is specified, the statement is rejected with an error. *`schema_name`* and *`view_name`* must conform to the rules for MySQL identifiers; see Section 11.2, “Schema Object Names”, as well as Section 11.2.1, “Identifier Length Limits”, for information about these rules.

The `WITH ... CHECK OPTION` clause works with `CREATE JSON DUALITY VIEW` as it does with `CREATE VIEW`. See the description of that statement for more information.

*`json_duality_select_statement`* selects a JSON object expression (*`json_duality_object_expression`*) constructed using columns from the table *`root_table_name`* in schema *`schema_name`*. If *`schema_name`* is omitted, MySQL assumes that the table is in the current schema; if no schema is specified and none is currently selected, the statement is rejected with an error. Both *`schema_name`* and *`root_table_name`* must follow the usual rules for MySQL identifiers.

*`json_duality_select_statement`* must contain one and only one `JSON_DUALITY_OBJECT()` expression and one `FROM` clause. Set operations (`UNION`, `INTERSECT`, `EXCEPT`) and common table expressions (`WITH`")) are not supported. The `FROM` clause must reference a single table. `WHERE`, `JOIN`, `GROUP BY`, `ORDER BY`, `HAVING`, `WINDOW`, and `LIMIT` clauses are not supported.

*`json_duality_object_expression`* is a value returned by `JSON_DUALITY_OBJECT()`. See the description of that function for information about its arguments.

The `JSON_DUALITY_OBJECT()` function returns a JSON duality object for use in `CREATE JSON DUALITY VIEW` or `ALTER JSON DUALITY VIEW`. Attempting to invoke it in any other context results in an error.

`JSON_DUALITY_OBJECT()` takes one or two arguments: an optional table annotations expression, and a set of key-value pairs in JSON object format.

Requirements:

* It must include a key named `_id` in the root object representing the primary key of the root table. Absence of this key results in an error. No sub-key may be named `_id`.

* All participating tables, including the root table and any tables referenced within *`nested_descendent_json_objects`* and *`singleton_descendent_json_object`*, must be base tables and have a primary key.

* The table projection must include the primary key of every participating table.

* Child tables being projected can be related to parent tables in one of two ways:

  + `PK - FK` relationship: If a child table is projected as *`singleton_descendent_json_object`*, the `WHERE` clause must enforce the format `child_table.PK = parent_table.FK`. If a child table is projected as *`nested_descendent_json_objects`*, the `WHERE` clause must enforce the format `child_table.FK = parent_table.PK`.

  + `PK - Any Column` relationship: If a child table is projected as *`singleton_descendent_json_object`*, the `WHERE` clause must enforce the format `child_table.PK = parent_table.any_column`. If a child table is projected as *`nested_descendent_json_objects`*, the `WHERE` clause must enforce the format `child_table.any_column = parent_table.PK`.

The complete syntax for the arguments to this function is shown here, with additional notes following:

```
table_annotations:
    WITH (table_annotation[, table_annotation]...)

table_annotation:
    INSERT | UPDATE | DELETE

json_duality_key_value_pairs:
    json_duality_key_value_pair[, json_duality_key_value_pair]...

json_duality_key_value_pair:
    key_name:value_expression

value_expression:
    column_name
    | (singleton_descendent_json_object)
    | (nested_descendent_json_objects)

singleton_descendent_json_object:
    SELECT json_duality_object_expression
    FROM child_table_name [AS table_alias]
    WHERE json_duality_join_condition

nested_descendent_json_objects:
    SELECT JSON_ARRAYAGG(json_duality_object_expression [json_constructor_null_clause])
    FROM child_table_name [AS table_alias]
    WHERE json_duality_join_condition

json_constructor_null_clause:
    NULL ON NULL | ABSENT ON NULL

json_duality_join_condition:
    [schema_name.]child_table_name.column_name
    = [schema_name.]parent_table_name.column_name

json_duality_object_expression:
    JSON_DUALITY_OBJECT(
        [table_annotations_expression] json_duality_key_value_pairs
    )
```

*`json_duality_key_value_pairs`* is a set of key-value pairs in *`key_name`*:*`value_expression`* format. There must be a key named `_id` in the root object, and it must correspond to a primary key column of the table being projected; sub-keys named `_id` are not allowed.

*`value_expression`* must be one of: a column name; an object returned by `JSON_DUALITY_OBJECT()` (singleton descendant); an object returned by `JSON_ARRAYAGG()` (nested descendant).

*`column_name`* must reference a valid column in the table that is being projected (*`root_table_name`* or *`current_table_name`*). The same *`column_name`* cannot be used more than once in a single invocation of `JSON_DUALITY_OBJECT()`. Functions and operators cannot be used with *`column_name`*. Columns of types `JSON`, `VECTOR`, and `GEOMETRY` (including all derivatives such as `POINT`, `LINESTRING`, and `POLYGON`) are not supported, nor are generated columns. The column having the key `_id` in the root table for *`json_duality_key_value_pairs`* must be a primary key of that table.

The *`singleton_descendent_json_object`* consists of a `SELECT` statement with a `FROM` clause. The `SELECT` list and `FROM` clause follow the same rules as those described for the top-level query in a [`CREATE JSON DUALITY VIEW`](create-json-duality-view.html "15.1.17 CREATE JSON DUALITY VIEW Statement") statement.

*`nested_descendent_json_objects`* selects a single expression (*`json_duality_object_expression`*) using `JSON_ARRAYAGG()`, which must contain a non-empty `JSON_DUALITY_OBJECT()`. The select list and `FROM` clause follow the same rules as those described for *`singleton_descendent_json_object`*. The optional *`json_constructor_null_clause`* specifies the behavior of this function when *`json_duality_object_expression`* evaluates to null. It takes either of the values `ABSENT ON NULL` or `NULL ON NULL` (the default). `NULL ON NULL` returns the JSON `null` value; `ABSENT ON NULL` causes the value to be omitted from the output JSON array.

*`singleton_descendent_json_object`* and *`nested_descendent_json_objects`* also support a `WHERE` clause. This must contain one expression only, having the form shown here:

```
[schema_name.]child_table_name.column_name
    = [schema_name.]parent_table_name.column_name
```

No types of conditions other than equality are supported in this `WHERE` clause. Multiple conditions using `AND` or `OR` operators are also not supported.

`JSON_DUALITY_OBJECT()` takes an optional *`table_annotations_expression`*. This expression consists of a comma-separated list that must include the annotation values `INSERT`, `UPDATE`, and `DELETE`, in any order. No annotation value may be listed more than once. The function returns a mapping between columns of *`table`* and the JSON collection defined by *`json_duality_key_value_pairs`*. The value used with each key can be one of three types:

* The name of a column in *`table`*. This must be the name of the column only, and cannot be an expression.

* A *`singleton_descendent_json_object`* which consists of a `SELECT` with a `FROM` clause. The `SELECT` list and `FROM` clause follow the same rules as those described for the top-level query in [`CREATE JSON DUALITY VIEW`](create-json-duality-view.html "15.1.17 CREATE JSON DUALITY VIEW Statement").

* A set of *`nested_descendent_json_objects`* selects an expression using `JSON_ARRAYAGG()`, which in turn contains `JSON_DUALITY_OBJECT()`.

If the table is projected multiple times, the set of columns projected must be consistent across all instances of the table projection.

See Section 27.7, “JSON Duality Views”, for more information and examples.


### 15.1.18 CREATE INDEX Statement

```
CREATE [UNIQUE | FULLTEXT | SPATIAL] INDEX index_name
    [index_type]
    ON tbl_name (key_part,...)
    [index_option]
    [algorithm_option | lock_option] ...

key_part: {col_name [(length)] | (expr)} [ASC | DESC]

index_option: {
    KEY_BLOCK_SIZE [=] value
  | index_type
  | WITH PARSER parser_name
  | COMMENT 'string'
  | {VISIBLE | INVISIBLE}
  | ENGINE_ATTRIBUTE [=] 'string'
  | SECONDARY_ENGINE_ATTRIBUTE [=] 'string'
}

index_type:
    USING {BTREE | HASH}

algorithm_option:
    ALGORITHM [=] {DEFAULT | INPLACE | COPY}

lock_option:
    LOCK [=] {DEFAULT | NONE | SHARED | EXCLUSIVE}
```

Normally, you create all indexes on a table at the time the table itself is created with [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement"). See Section 15.1.24, “CREATE TABLE Statement”. This guideline is especially important for `InnoDB` tables, where the primary key determines the physical layout of rows in the data file. `CREATE INDEX` enables you to add indexes to existing tables.

`CREATE INDEX` is mapped to an `ALTER TABLE` statement to create indexes. See Section 15.1.11, “ALTER TABLE Statement”. `CREATE INDEX` cannot be used to create a `PRIMARY KEY`; use `ALTER TABLE` instead. For more information about indexes, see Section 10.3.1, “How MySQL Uses Indexes”.

`InnoDB` supports secondary indexes on virtual columns. For more information, see Section 15.1.24.9, “Secondary Indexes and Generated Columns”.

When the `innodb_stats_persistent` setting is enabled, run the [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") statement for an `InnoDB` table after creating an index on that table.

The *`expr`* for a *`key_part`* specification can also take the form `(CAST json_expression AS type ARRAY)` to create a multi-valued index on a `JSON` column. See Multi-Valued Indexes.

An index specification of the form `(key_part1, key_part2, ...)` creates an index with multiple key parts. Index key values are formed by concatenating the values of the given key parts. For example `(col1, col2, col3)` specifies a multiple-column index with index keys consisting of values from `col1`, `col2`, and `col3`.

A *`key_part`* specification can end with `ASC` or `DESC` to specify whether index values are stored in ascending or descending order. The default is ascending if no order specifier is given.

`ASC` and `DESC` are not supported for `HASH` indexes, multi-valued indexes or `SPATIAL` indexes.

The following sections describe different aspects of the `CREATE INDEX` statement:

* Column Prefix Key Parts
* Functional Key Parts
* Unique Indexes
* Full-Text Indexes
* Multi-Valued Indexes
* Spatial Indexes
* Index Options
* Table Copying and Locking Options

#### Column Prefix Key Parts

For string columns, indexes can be created that use only the leading part of column values, using `col_name(length)` syntax to specify an index prefix length:

* Prefixes can be specified for `CHAR`, `VARCHAR`, `BINARY`, and `VARBINARY` key parts.

* Prefixes *must* be specified for `BLOB` and `TEXT` key parts. Additionally, `BLOB` and `TEXT` columns can be indexed only for `InnoDB`, `MyISAM`, and `BLACKHOLE` tables.

* Prefix *limits* are measured in bytes. However, prefix *lengths* for index specifications in [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement"), `ALTER TABLE`, and `CREATE INDEX` statements are interpreted as number of characters for nonbinary string types (`CHAR`, `VARCHAR`, `TEXT`) and number of bytes for binary string types (`BINARY`, `VARBINARY`, `BLOB`). Take this into account when specifying a prefix length for a nonbinary string column that uses a multibyte character set.

  Prefix support and lengths of prefixes (where supported) are storage engine dependent. For example, a prefix can be up to 767 bytes long for `InnoDB` tables that use the `REDUNDANT` or `COMPACT` row format. The prefix length limit is 3072 bytes for `InnoDB` tables that use the `DYNAMIC` or `COMPRESSED` row format. For `MyISAM` tables, the prefix length limit is 1000 bytes. The `NDB` storage engine does not support prefixes (see Section 25.2.7.6, “Unsupported or Missing Features in NDB Cluster”).

If a specified index prefix exceeds the maximum column data type size, `CREATE INDEX` handles the index as follows:

* For a nonunique index, either an error occurs (if strict SQL mode is enabled), or the index length is reduced to lie within the maximum column data type size and a warning is produced (if strict SQL mode is not enabled).

* For a unique index, an error occurs regardless of SQL mode because reducing the index length might enable insertion of nonunique entries that do not meet the specified uniqueness requirement.

The statement shown here creates an index using the first 10 characters of the `name` column (assuming that `name` has a nonbinary string type):

```
CREATE INDEX part_of_name ON customer (name(10));
```

If names in the column usually differ in the first 10 characters, lookups performed using this index should not be much slower than using an index created from the entire `name` column. Also, using column prefixes for indexes can make the index file much smaller, which could save a lot of disk space and might also speed up `INSERT` operations.

#### Functional Key Parts

A “normal” index indexes column values or prefixes of column values. For example, in the following table, the index entry for a given `t1` row includes the full `col1` value and a prefix of the `col2` value consisting of its first 10 characters:

```
CREATE TABLE t1 (
  col1 VARCHAR(10),
  col2 VARCHAR(20),
  INDEX (col1, col2(10))
);
```

Functional key parts that index expression values canalso be used in place of column or column prefix values. Use of functional key parts enables indexing of values not stored directly in the table. Examples:

```
CREATE TABLE t1 (col1 INT, col2 INT, INDEX func_index ((ABS(col1))));
CREATE INDEX idx1 ON t1 ((col1 + col2));
CREATE INDEX idx2 ON t1 ((col1 + col2), (col1 - col2), col1);
ALTER TABLE t1 ADD INDEX ((col1 * 40) DESC);
```

An index with multiple key parts can mix nonfunctional and functional key parts.

`ASC` and `DESC` are supported for functional key parts.

Functional key parts must adhere to the following rules. An error occurs if a key part definition contains disallowed constructs.

* In index definitions, enclose expressions within parentheses to distinguish them from columns or column prefixes. For example, this is permitted; the expressions are enclosed within parentheses:

  ```
  INDEX ((col1 + col2), (col3 - col4))
  ```

  This produces an error; the expressions are not enclosed within parentheses:

  ```
  INDEX (col1 + col2, col3 - col4)
  ```

* A functional key part cannot consist solely of a column name. For example, this is not permitted:

  ```
  INDEX ((col1), (col2))
  ```

  Instead, write the key parts as nonfunctional key parts, without parentheses:

  ```
  INDEX (col1, col2)
  ```

* A functional key part expression cannot refer to column prefixes. For a workaround, see the discussion of `SUBSTRING()` and `CAST()` later in this section.

* Functional key parts are not permitted in foreign key specifications.

For [`CREATE TABLE ... LIKE`](create-table-like.html "15.1.24.3 CREATE TABLE ... LIKE Statement"), the destination table preserves functional key parts from the original table.

Functional indexes are implemented as hidden virtual generated columns, which has these implications:

* Each functional key part counts against the limit on total number of table columns; see Section 10.4.7, “Limits on Table Column Count and Row Size”.

* Functional key parts inherit all restrictions that apply to generated columns. Examples:

  + Only functions permitted for generated columns are permitted for functional key parts.

  + Subqueries, parameters, variables, stored functions, and loadable functions are not permitted.

  For more information about applicable restrictions, see Section 15.1.24.8, “CREATE TABLE and Generated Columns”, and Section 15.1.11.2, “ALTER TABLE and Generated Columns”.

* The virtual generated column itself requires no storage. The index itself takes up storage space as any other index.

`UNIQUE` is supported for indexes that include functional key parts. However, primary keys cannot include functional key parts. A primary key requires the generated column to be stored, but functional key parts are implemented as virtual generated columns, not stored generated columns.

`SPATIAL` and `FULLTEXT` indexes cannot have functional key parts.

If a table contains no primary key, `InnoDB` automatically promotes the first `UNIQUE NOT NULL` index to the primary key. This is not supported for `UNIQUE NOT NULL` indexes that have functional key parts.

Nonfunctional indexes raise a warning if there are duplicate indexes. Indexes that contain functional key parts do not have this feature.

To remove a column that is referenced by a functional key part, the index must be removed first. Otherwise, an error occurs.

Although nonfunctional key parts support a prefix length specification, this is not possible for functional key parts. The solution is to use `SUBSTRING()` (or `CAST()`, as described later in this section). For a functional key part containing the `SUBSTRING()` function to be used in a query, the `WHERE` clause must contain `SUBSTRING()` with the same arguments. In the following example, only the second `SELECT` is able to use the index because that is the only query in which the arguments to `SUBSTRING()` match the index specification:

```
CREATE TABLE tbl (
  col1 LONGTEXT,
  INDEX idx1 ((SUBSTRING(col1, 1, 10)))
);
SELECT * FROM tbl WHERE SUBSTRING(col1, 1, 9) = '123456789';
SELECT * FROM tbl WHERE SUBSTRING(col1, 1, 10) = '1234567890';
```

Functional key parts enable indexing of values that cannot be indexed otherwise, such as `JSON` values. However, this must be done correctly to achieve the desired effect. For example, this syntax does not work:

```
CREATE TABLE employees (
  data JSON,
  INDEX ((data->>'$.name'))
);
```

The syntax fails because:

* The `->>` operator translates into `JSON_UNQUOTE(JSON_EXTRACT(...))`.

* `JSON_UNQUOTE()` returns a value with a data type of `LONGTEXT`, and the hidden generated column thus is assigned the same data type.

* MySQL cannot index `LONGTEXT` columns specified without a prefix length on the key part, and prefix lengths are not permitted in functional key parts.

To index the `JSON` column, you could try using the `CAST()` function as follows:

```
CREATE TABLE employees (
  data JSON,
  INDEX ((CAST(data->>'$.name' AS CHAR(30))))
);
```

The hidden generated column is assigned the `VARCHAR(30)` data type, which can be indexed. But this approach produces a new issue when trying to use the index:

* `CAST()` returns a string with the collation `utf8mb4_0900_ai_ci` (the server default collation).

* `JSON_UNQUOTE()` returns a string with the collation `utf8mb4_bin` (hard coded).

As a result, there is a collation mismatch between the indexed expression in the preceding table definition and the `WHERE` clause expression in the following query:

```
SELECT * FROM employees WHERE data->>'$.name' = 'James';
```

The index is not used because the expressions in the query and the index differ. To support this kind of scenario for functional key parts, the optimizer automatically strips `CAST()` when looking for an index to use, but *only* if the collation of the indexed expression matches that of the query expression. For an index with a functional key part to be used, either of the following two solutions work (although they differ somewhat in effect):

* Solution 1. Assign the indexed expression the same collation as `JSON_UNQUOTE()`:

  ```
  CREATE TABLE employees (
    data JSON,
    INDEX idx ((CAST(data->>"$.name" AS CHAR(30)) COLLATE utf8mb4_bin))
  );
  INSERT INTO employees VALUES
    ('{ "name": "james", "salary": 9000 }'),
    ('{ "name": "James", "salary": 10000 }'),
    ('{ "name": "Mary", "salary": 12000 }'),
    ('{ "name": "Peter", "salary": 8000 }');
  SELECT * FROM employees WHERE data->>'$.name' = 'James';
  ```

  The `->>` operator is the same as `JSON_UNQUOTE(JSON_EXTRACT(...))`, and `JSON_UNQUOTE()` returns a string with collation `utf8mb4_bin`. The comparison is thus case-sensitive, and only one row matches:

  ```
  +------------------------------------+
  | data                               |
  +------------------------------------+
  | {"name": "James", "salary": 10000} |
  +------------------------------------+
  ```

* Solution 2. Specify the full expression in the query:

  ```
  CREATE TABLE employees (
    data JSON,
    INDEX idx ((CAST(data->>"$.name" AS CHAR(30))))
  );
  INSERT INTO employees VALUES
    ('{ "name": "james", "salary": 9000 }'),
    ('{ "name": "James", "salary": 10000 }'),
    ('{ "name": "Mary", "salary": 12000 }'),
    ('{ "name": "Peter", "salary": 8000 }');
  SELECT * FROM employees WHERE CAST(data->>'$.name' AS CHAR(30)) = 'James';
  ```

  `CAST()` returns a string with collation `utf8mb4_0900_ai_ci`, so the comparison case-insensitive and two rows match:

  ```
  +------------------------------------+
  | data                               |
  +------------------------------------+
  | {"name": "james", "salary": 9000}  |
  | {"name": "James", "salary": 10000} |
  +------------------------------------+
  ```

Be aware that although the optimizer supports automatically stripping `CAST()` with indexed generated columns, the following approach does not work because it produces a different result with and without an index (Bug#27337092):

```
mysql> CREATE TABLE employees (
         data JSON,
         generated_col VARCHAR(30) AS (CAST(data->>'$.name' AS CHAR(30)))
       );
Query OK, 0 rows affected, 1 warning (0.03 sec)

mysql> INSERT INTO employees (data)
       VALUES ('{"name": "james"}'), ('{"name": "James"}');
Query OK, 2 rows affected, 1 warning (0.01 sec)
Records: 2  Duplicates: 0  Warnings: 1

mysql> SELECT * FROM employees WHERE data->>'$.name' = 'James';
+-------------------+---------------+
| data              | generated_col |
+-------------------+---------------+
| {"name": "James"} | James         |
+-------------------+---------------+
1 row in set (0.00 sec)

mysql> ALTER TABLE employees ADD INDEX idx (generated_col);
Query OK, 0 rows affected, 1 warning (0.03 sec)
Records: 0  Duplicates: 0  Warnings: 1

mysql> SELECT * FROM employees WHERE data->>'$.name' = 'James';
+-------------------+---------------+
| data              | generated_col |
+-------------------+---------------+
| {"name": "james"} | james         |
| {"name": "James"} | James         |
+-------------------+---------------+
2 rows in set (0.01 sec)
```

#### Unique Indexes

A `UNIQUE` index creates a constraint such that all values in the index must be distinct. An error occurs if you try to add a new row with a key value that matches an existing row. If you specify a prefix value for a column in a `UNIQUE` index, the column values must be unique within the prefix length. A `UNIQUE` index permits multiple `NULL` values for columns that can contain `NULL`.

If a table has a `PRIMARY KEY` or `UNIQUE NOT NULL` index that consists of a single column that has an integer type, you can use `_rowid` to refer to the indexed column in `SELECT` statements, as follows:

* `_rowid` refers to the `PRIMARY KEY` column if there is a `PRIMARY KEY` consisting of a single integer column. If there is a `PRIMARY KEY` but it does not consist of a single integer column, `_rowid` cannot be used.

* Otherwise, `_rowid` refers to the column in the first `UNIQUE NOT NULL` index if that index consists of a single integer column. If the first `UNIQUE NOT NULL` index does not consist of a single integer column, `_rowid` cannot be used.

#### Full-Text Indexes

`FULLTEXT` indexes are supported only for `InnoDB` and `MyISAM` tables and can include only `CHAR`, `VARCHAR`, and `TEXT` columns. Indexing always happens over the entire column; column prefix indexing is not supported and any prefix length is ignored if specified. See Section 14.9, “Full-Text Search Functions”, for details of operation.

#### Multi-Valued Indexes

`InnoDB` supports multi-valued indexes. A multi-valued index is a secondary index defined on a column that stores an array of values. A “normal” index has one index record for each data record (1:1). A multi-valued index can have multiple index records for a single data record (N:1). Multi-valued indexes are intended for indexing `JSON` arrays. For example, a multi-valued index defined on the array of zip codes in the following JSON document creates an index record for each zip code, with each index record referencing the same data record.

```
{
    "user":"Bob",
    "user_id":31,
    "zipcode":[94477,94536]
}
```

##### Creating multi-valued Indexes

You can create a multi-valued index in a `CREATE TABLE`, `ALTER TABLE`, or `CREATE INDEX` statement. This requires using [`CAST(... AS ... ARRAY)`](cast-functions.html#function_cast) in the index definition, which casts same-typed scalar values in a `JSON` array to an SQL data type array. A virtual column is then generated transparently with the values in the SQL data type array; finally, a functional index (also referred to as a virtual index) is created on the virtual column. It is the functional index defined on the virtual column of values from the SQL data type array that forms the multi-valued index.

The examples in the following list show the three different ways in which a multi-valued index `zips` can be created on an array `$.zipcode` on a `JSON` column `custinfo` in a table named `customers`. In each case, the JSON array is cast to an SQL data type array of `UNSIGNED` integer values.

* `CREATE TABLE` only:

  ```
  CREATE TABLE customers (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      custinfo JSON,
      INDEX zips( (CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)) )
      );
  ```

* `CREATE TABLE` plus `ALTER TABLE`:

  ```
  CREATE TABLE customers (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      custinfo JSON
      );

  ALTER TABLE customers ADD INDEX zips( (CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)) );
  ```

* `CREATE TABLE` plus `CREATE INDEX`:

  ```
  CREATE TABLE customers (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      custinfo JSON
      );

  CREATE INDEX zips ON customers ( (CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)) );
  ```

A multi-valued index can also be defined as part of a composite index. This example shows a composite index that includes two single-valued parts (for the `id` and `modified` columns), and one multi-valued part (for the `custinfo` column):

```
CREATE TABLE customers (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    custinfo JSON
    );

ALTER TABLE customers ADD INDEX comp(id, modified,
    (CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)) );
```

Only one multi-valued key part can be used in a composite index. The multi-valued key part may be used in any order relative to the other parts of the key. In other words, the `ALTER TABLE` statement just shown could have used `comp(id, (CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY), modified))` (or any other ordering) and still have been valid.

##### Using multi-valued Indexes

The optimizer uses a multi-valued index to fetch records when the following functions are specified in a `WHERE` clause:

* `MEMBER OF()`
* `JSON_CONTAINS()`
* `JSON_OVERLAPS()`

We can demonstrate this by creating and populating the `customers` table using the following `CREATE TABLE` and `INSERT` statements:

```
mysql> CREATE TABLE customers (
    ->     id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ->     modified DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    ->     custinfo JSON
    ->     );
Query OK, 0 rows affected (0.51 sec)

mysql> INSERT INTO customers VALUES
    ->     (NULL, NOW(), '{"user":"Jack","user_id":37,"zipcode":[94582,94536]}'),
    ->     (NULL, NOW(), '{"user":"Jill","user_id":22,"zipcode":[94568,94507,94582]}'),
    ->     (NULL, NOW(), '{"user":"Bob","user_id":31,"zipcode":[94477,94507]}'),
    ->     (NULL, NOW(), '{"user":"Mary","user_id":72,"zipcode":[94536]}'),
    ->     (NULL, NOW(), '{"user":"Ted","user_id":56,"zipcode":[94507,94582]}');
Query OK, 5 rows affected (0.07 sec)
Records: 5  Duplicates: 0  Warnings: 0
```

First we execute three queries on the `customers` table, one each using `MEMBER OF()`, `JSON_CONTAINS()`, and `JSON_OVERLAPS()`, with the result from each query shown here:

```
mysql> SELECT * FROM customers
    ->     WHERE 94507 MEMBER OF(custinfo->'$.zipcode');
+----+---------------------+-------------------------------------------------------------------+
| id | modified            | custinfo                                                          |
+----+---------------------+-------------------------------------------------------------------+
|  2 | 2019-06-29 22:23:12 | {"user": "Jill", "user_id": 22, "zipcode": [94568, 94507, 94582]} |
|  3 | 2019-06-29 22:23:12 | {"user": "Bob", "user_id": 31, "zipcode": [94477, 94507]}         |
|  5 | 2019-06-29 22:23:12 | {"user": "Ted", "user_id": 56, "zipcode": [94507, 94582]}         |
+----+---------------------+-------------------------------------------------------------------+
3 rows in set (0.00 sec)

mysql> SELECT * FROM customers
    ->     WHERE JSON_CONTAINS(custinfo->'$.zipcode', CAST('[94507,94582]' AS JSON));
+----+---------------------+-------------------------------------------------------------------+
| id | modified            | custinfo                                                          |
+----+---------------------+-------------------------------------------------------------------+
|  2 | 2019-06-29 22:23:12 | {"user": "Jill", "user_id": 22, "zipcode": [94568, 94507, 94582]} |
|  5 | 2019-06-29 22:23:12 | {"user": "Ted", "user_id": 56, "zipcode": [94507, 94582]}         |
+----+---------------------+-------------------------------------------------------------------+
2 rows in set (0.00 sec)

mysql> SELECT * FROM customers
    ->     WHERE JSON_OVERLAPS(custinfo->'$.zipcode', CAST('[94507,94582]' AS JSON));
+----+---------------------+-------------------------------------------------------------------+
| id | modified            | custinfo                                                          |
+----+---------------------+-------------------------------------------------------------------+
|  1 | 2019-06-29 22:23:12 | {"user": "Jack", "user_id": 37, "zipcode": [94582, 94536]}        |
|  2 | 2019-06-29 22:23:12 | {"user": "Jill", "user_id": 22, "zipcode": [94568, 94507, 94582]} |
|  3 | 2019-06-29 22:23:12 | {"user": "Bob", "user_id": 31, "zipcode": [94477, 94507]}         |
|  5 | 2019-06-29 22:23:12 | {"user": "Ted", "user_id": 56, "zipcode": [94507, 94582]}         |
+----+---------------------+-------------------------------------------------------------------+
4 rows in set (0.00 sec)
```

Next, we run `EXPLAIN` on each of the previous three queries:

```
mysql> EXPLAIN SELECT * FROM customers
    ->     WHERE 94507 MEMBER OF(custinfo->'$.zipcode');
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | customers | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    5 |   100.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM customers
    ->     WHERE JSON_CONTAINS(custinfo->'$.zipcode', CAST('[94507,94582]' AS JSON));
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | customers | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    5 |   100.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM customers
    ->     WHERE JSON_OVERLAPS(custinfo->'$.zipcode', CAST('[94507,94582]' AS JSON));
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | customers | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    5 |   100.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.01 sec)
```

None of the three queries just shown are able to use any keys. To solve this problem, we can add a multi-valued index on the `zipcode` array in the `JSON` column (`custinfo`), like this:

```
mysql> ALTER TABLE customers
    ->     ADD INDEX zips( (CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)) );
Query OK, 0 rows affected (0.47 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

When we run the previous `EXPLAIN` statements again, we can now observe that the queries can (and do) use the index `zips` that was just created:

```
mysql> EXPLAIN SELECT * FROM customers
    ->     WHERE 94507 MEMBER OF(custinfo->'$.zipcode');
+----+-------------+-----------+------------+------+---------------+------+---------+-------+------+----------+-------------+
| id | select_type | table     | partitions | type | possible_keys | key  | key_len | ref   | rows | filtered | Extra       |
+----+-------------+-----------+------------+------+---------------+------+---------+-------+------+----------+-------------+
|  1 | SIMPLE      | customers | NULL       | ref  | zips          | zips | 9       | const |    1 |   100.00 | Using where |
+----+-------------+-----------+------------+------+---------------+------+---------+-------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM customers
    ->     WHERE JSON_CONTAINS(custinfo->'$.zipcode', CAST('[94507,94582]' AS JSON));
+----+-------------+-----------+------------+-------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table     | partitions | type  | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-----------+------------+-------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | customers | NULL       | range | zips          | zips | 9       | NULL |    6 |   100.00 | Using where |
+----+-------------+-----------+------------+-------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.00 sec)

mysql> EXPLAIN SELECT * FROM customers
    ->     WHERE JSON_OVERLAPS(custinfo->'$.zipcode', CAST('[94507,94582]' AS JSON));
+----+-------------+-----------+------------+-------+---------------+------+---------+------+------+----------+-------------+
| id | select_type | table     | partitions | type  | possible_keys | key  | key_len | ref  | rows | filtered | Extra       |
+----+-------------+-----------+------------+-------+---------------+------+---------+------+------+----------+-------------+
|  1 | SIMPLE      | customers | NULL       | range | zips          | zips | 9       | NULL |    6 |   100.00 | Using where |
+----+-------------+-----------+------------+-------+---------------+------+---------+------+------+----------+-------------+
1 row in set, 1 warning (0.01 sec)
```

A multi-valued index can be defined as a unique key. If defined as a unique key, attempting to insert a value already present in the multi-valued index returns a duplicate key error. If duplicate values are already present, attempting to add a unique multi-valued index fails, as shown here:

```
mysql> ALTER TABLE customers DROP INDEX zips;
Query OK, 0 rows affected (0.55 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> ALTER TABLE customers
    ->     ADD UNIQUE INDEX zips((CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)));
ERROR 1062 (23000): Duplicate entry '[94507, ' for key 'customers.zips'
mysql> ALTER TABLE customers
    ->     ADD INDEX zips((CAST(custinfo->'$.zipcode' AS UNSIGNED ARRAY)));
Query OK, 0 rows affected (0.36 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

##### Characteristics of Multi-Valued Indexes

Multi-valued indexes have the additional characteristics listed here:

* DML operations that affect multi-valued indexes are handled in the same way as DML operations that affect a normal index, with the only difference being that there may be more than one insert or update for a single clustered index record.

* Nullability and multi-valued indexes:

  + If a multi-valued key part has an empty array, no entries are added to the index, and the data record is not accessible by an index scan.

  + If multi-valued key part generation returns a `NULL` value, a single entry containing `NULL` is added to the multi-valued index. If the key part is defined as `NOT NULL`, an error is reported.

  + If the typed array column is set to `NULL`, the storage engine stores a single record containing `NULL` that points to the data record.

  + `JSON` null values are not permitted in indexed arrays. If any returned value is `NULL`, it is treated as a JSON null and an Invalid JSON value error is reported.

* Because multi-valued indexes are virtual indexes on virtual columns, they must adhere to the same rules as secondary indexes on virtual generated columns.

* Index records are not added for empty arrays.

##### Limitations and Restrictions on Multi-valued Indexes

Multi-valued indexes are subject to the limitations and restrictions listed here:

* Only one multi-valued key part is permitted per multi-valued index. However, the [`CAST(... AS ... ARRAY)`](cast-functions.html#function_cast) expression can refer to multiple arrays within a `JSON` document, as shown here:

  ```
  CAST(data->'$.arr[*][*]' AS UNSIGNED ARRAY)
  ```

  In this case, all values matching the JSON expression are stored in the index as a single flat array.

* An index with a multi-valued key part does not support ordering and therefore cannot be used as a primary key. For the same reason, a multi-valued index cannot be defined using the `ASC` or `DESC` keyword.

* A multi-valued index cannot be a covering index.
* The maximum number of values per record for a multi-valued index is determined by the amount of data than can be stored on a single undo log page, which is 65221 bytes (64K minus 315 bytes for overhead), which means that the maximum total length of key values is also 65221 bytes. The maximum number of keys depends on various factors, which prevents defining a specific limit. Tests have shown a multi-valued index to permit as many as 1604 integer keys per record, for example. When the limit is reached, an error similar to the following is reported: ERROR 3905 (HY000): Exceeded max number of values per record for multi-valued index 'idx' by 1 value(s).

* The only type of expression that is permitted in a multi-valued key part is a `JSON` expression. The expression need not reference an existing element in a JSON document inserted into the indexed column, but must itself be syntactically valid.

* Because index records for the same clustered index record are dispersed throughout a multi-valued index, a multi-valued index does not support range scans or index-only scans.

* Multi-valued indexes are not permitted in foreign key specifications.

* Index prefixes cannot be defined for multi-valued indexes.
* Multi-valued indexes cannot be defined on data cast as `BINARY` (see the description of the `CAST()` function).

* Online creation of a multi-value index is not supported, which means the operation uses `ALGORITHM=COPY`. See Performance and Space Requirements.

* Character sets and collations other than the following two combinations of character set and collation are not supported for multi-valued indexes:

  1. The `binary` character set with the default `binary` collation

  2. The `utf8mb4` character set with the default `utf8mb4_0900_as_cs` collation.

* As with other indexes on columns of `InnoDB` tables, a multi-valued index cannot be created with `USING HASH`; attempting to do so results in a warning: This storage engine does not support the HASH index algorithm, storage engine default was used instead. (`USING BTREE` is supported as usual.)

#### Spatial Indexes

The `MyISAM`, `InnoDB`, `NDB`, and `ARCHIVE` storage engines support spatial columns such as `POINT` and `GEOMETRY`. (Section 13.4, “Spatial Data Types”, describes the spatial data types.) However, support for spatial column indexing varies among engines. Spatial and nonspatial indexes on spatial columns are available according to the following rules.

Spatial indexes on spatial columns have these characteristics:

* Available only for `InnoDB` and `MyISAM` tables. Specifying `SPATIAL INDEX` for other storage engines results in an error.

* An index on a spatial column *must* be a `SPATIAL` index. The `SPATIAL` keyword is thus optional but implicit for creating an index on a spatial column.

* Available for single spatial columns only. A spatial index cannot be created over multiple spatial columns.

* Indexed columns must be `NOT NULL`.
* Column prefix lengths are prohibited. The full width of each column is indexed.

* Not permitted for a primary key or unique index.

Nonspatial indexes on spatial columns (created with `INDEX`, `UNIQUE`, or `PRIMARY KEY`) have these characteristics:

* Permitted for any storage engine that supports spatial columns except `ARCHIVE`.

* Columns can be `NULL` unless the index is a primary key.

* The index type for a non-`SPATIAL` index depends on the storage engine. Currently, B-tree is used.

* Permitted for a column that can have `NULL` values only for `InnoDB`, `MyISAM`, and `MEMORY` tables.

#### Index Options

Following the key part list, index options can be given. An *`index_option`* value can be any of the following:

* `KEY_BLOCK_SIZE [=] value`

  For `MyISAM` tables, `KEY_BLOCK_SIZE` optionally specifies the size in bytes to use for index key blocks. The value is treated as a hint; a different size could be used if necessary. A `KEY_BLOCK_SIZE` value specified for an individual index definition overrides a table-level `KEY_BLOCK_SIZE` value.

  `KEY_BLOCK_SIZE` is not supported at the index level for `InnoDB` tables. See Section 15.1.24, “CREATE TABLE Statement”.

* *`index_type`*

  Some storage engines permit you to specify an index type when creating an index. For example:

  ```
  CREATE TABLE lookup (id INT) ENGINE = MEMORY;
  CREATE INDEX id_index ON lookup (id) USING BTREE;
  ```

  Table 15.1, “Index Types Per Storage Engine” shows the permissible index type values supported by different storage engines. Where multiple index types are listed, the first one is the default when no index type specifier is given. Storage engines not listed in the table do not support an *`index_type`* clause in index definitions.

  **Table 15.1 Index Types Per Storage Engine**

  <table summary="Permissible index types by storage engine."><col style="width: 20%"/><col style="width: 50%"/><thead><tr> <th>Storage Engine</th> <th>Permissible Index Types</th> </tr></thead><tbody><tr> <td><code>InnoDB</code></td> <td><code>BTREE</code></td> </tr><tr> <td><code>MyISAM</code></td> <td><code>BTREE</code></td> </tr><tr> <td><code>MEMORY</code>/<code>HEAP</code></td> <td><code>HASH</code>, <code>BTREE</code></td> </tr><tr> <td><code>NDB</code></td> <td><code>HASH</code>, <code>BTREE</code> (see note in text)</td> </tr></tbody></table>

  The *`index_type`* clause cannot be used for `FULLTEXT INDEX` specifications. Full-text index implementation is storage-engine dependent. Spatial indexes are implemented as R-tree indexes.

  If you specify an index type that is not valid for a given storage engine, but another index type is available that the engine can use without affecting query results, the engine uses the available type. The parser recognizes `RTREE` as a type name. This is permitted only for `SPATIAL` indexes.

  `BTREE` indexes are implemented by the `NDB` storage engine as T-tree indexes.

  Note

  For indexes on `NDB` table columns, the `USING` option can be specified only for a unique index or primary key. `USING HASH` prevents the creation of an ordered index; otherwise, creating a unique index or primary key on an `NDB` table automatically results in the creation of both an ordered index and a hash index, each of which indexes the same set of columns.

  For unique indexes that include one or more `NULL` columns of an `NDB` table, the hash index can be used only to look up literal values, which means that `IS [NOT] NULL` conditions require a full scan of the table. One workaround is to make sure that a unique index using one or more `NULL` columns on such a table is always created in such a way that it includes the ordered index; that is, avoid employing `USING HASH` when creating the index.

  If you specify an index type that is not valid for a given storage engine, but another index type is available that the engine can use without affecting query results, the engine uses the available type. The parser recognizes `RTREE` as a type name, but currently this cannot be specified for any storage engine.

  Note

  Use of the *`index_type`* option before the `ON tbl_name` clause is deprecated; expect support for use of the option in this position to be removed in a future MySQL release. If an *`index_type`* option is given in both the earlier and later positions, the final option applies.

  `TYPE type_name` is recognized as a synonym for `USING type_name`. However, `USING` is the preferred form.

  The following tables show index characteristics for the storage engines that support the *`index_type`* option.

  **Table 15.2 InnoDB Storage Engine Index Characteristics**

  <table summary="Index characteristics of the InnoDB storage engine."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col">Index Class</th> <th scope="col">Index Type</th> <th scope="col">Stores NULL VALUES</th> <th scope="col">Permits Multiple NULL Values</th> <th scope="col">IS NULL Scan Type</th> <th scope="col">IS NOT NULL Scan Type</th> </tr></thead><tbody><tr> <th scope="row">Primary key</th> <td><code>BTREE</code></td> <td>No</td> <td>No</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th scope="row">Unique</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th scope="row">Key</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th scope="row"><code>FULLTEXT</code></th> <td>N/A</td> <td>Yes</td> <td>Yes</td> <td>Table</td> <td>Table</td> </tr><tr> <th scope="row"><code>SPATIAL</code></th> <td>N/A</td> <td>No</td> <td>No</td> <td>N/A</td> <td>N/A</td> </tr></tbody></table>

  **Table 15.3 MyISAM Storage Engine Index Characteristics**

  <table summary="Index characteristics of the MyISAM storage engine."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col">Index Class</th> <th scope="col">Index Type</th> <th scope="col">Stores NULL VALUES</th> <th scope="col">Permits Multiple NULL Values</th> <th scope="col">IS NULL Scan Type</th> <th scope="col">IS NOT NULL Scan Type</th> </tr></thead><tbody><tr> <th scope="row">Primary key</th> <td><code>BTREE</code></td> <td>No</td> <td>No</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th scope="row">Unique</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th scope="row">Key</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th scope="row"><code>FULLTEXT</code></th> <td>N/A</td> <td>Yes</td> <td>Yes</td> <td>Table</td> <td>Table</td> </tr><tr> <th scope="row"><code>SPATIAL</code></th> <td>N/A</td> <td>No</td> <td>No</td> <td>N/A</td> <td>N/A</td> </tr></tbody></table>

  **Table 15.4 MEMORY Storage Engine Index Characteristics**

  <table summary="Index characteristics of the Memory storage engine."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col">Index Class</th> <th scope="col">Index Type</th> <th scope="col">Stores NULL VALUES</th> <th scope="col">Permits Multiple NULL Values</th> <th scope="col">IS NULL Scan Type</th> <th scope="col">IS NOT NULL Scan Type</th> </tr></thead><tbody><tr> <th scope="row">Primary key</th> <td><code>BTREE</code></td> <td>No</td> <td>No</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th scope="row">Unique</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th scope="row">Key</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th scope="row">Primary key</th> <td><code>HASH</code></td> <td>No</td> <td>No</td> <td>N/A</td> <td>N/A</td> </tr><tr> <th scope="row">Unique</th> <td><code>HASH</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th scope="row">Key</th> <td><code>HASH</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr></tbody></table>

  **Table 15.5 NDB Storage Engine Index Characteristics**

  <table summary="Index characteristics of the NDB storage engine."><col style="width: 15%"/><col style="width: 10%"/><col style="width: 15%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col">Index Class</th> <th scope="col">Index Type</th> <th scope="col">Stores NULL VALUES</th> <th scope="col">Permits Multiple NULL Values</th> <th scope="col">IS NULL Scan Type</th> <th scope="col">IS NOT NULL Scan Type</th> </tr></thead><tbody><tr> <th scope="row">Primary key</th> <td><code>BTREE</code></td> <td>No</td> <td>No</td> <td>Index</td> <td>Index</td> </tr><tr> <th scope="row">Unique</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th scope="row">Key</th> <td><code>BTREE</code></td> <td>Yes</td> <td>Yes</td> <td>Index</td> <td>Index</td> </tr><tr> <th scope="row">Primary key</th> <td><code>HASH</code></td> <td>No</td> <td>No</td> <td>Table (see note 1)</td> <td>Table (see note 1)</td> </tr><tr> <th scope="row">Unique</th> <td><code>HASH</code></td> <td>Yes</td> <td>Yes</td> <td>Table (see note 1)</td> <td>Table (see note 1)</td> </tr><tr> <th scope="row">Key</th> <td><code>HASH</code></td> <td>Yes</td> <td>Yes</td> <td>Table (see note 1)</td> <td>Table (see note 1)</td> </tr></tbody></table>

  Table note:

  1. `USING HASH` prevents creation of an implicit ordered index.

* `WITH PARSER parser_name`

  This option can be used only with `FULLTEXT` indexes. It associates a parser plugin with the index if full-text indexing and searching operations need special handling. `InnoDB` and `MyISAM` support full-text parser plugins. If you have a `MyISAM` table with an associated full-text parser plugin, you can convert the table to `InnoDB` using `ALTER TABLE`. See Full-Text Parser Plugins and Writing Full-Text Parser Plugins for more information.

* `COMMENT 'string'`

  Index definitions can include an optional comment of up to 1024 characters.

  The `MERGE_THRESHOLD` for index pages can be configured for individual indexes using the *`index_option`* `COMMENT` clause of the `CREATE INDEX` statement. For example:

  ```
  CREATE TABLE t1 (id INT);
  CREATE INDEX id_index ON t1 (id) COMMENT 'MERGE_THRESHOLD=40';
  ```

  If the page-full percentage for an index page falls below the `MERGE_THRESHOLD` value when a row is deleted or when a row is shortened by an update operation, `InnoDB` attempts to merge the index page with a neighboring index page. The default `MERGE_THRESHOLD` value is 50, which is the previously hardcoded value.

  `MERGE_THRESHOLD` can also be defined at the index level and table level using `CREATE TABLE` and `ALTER TABLE` statements. For more information, see Section 17.8.11, “Configuring the Merge Threshold for Index Pages”.

* `VISIBLE`, `INVISIBLE`

  Specify index visibility. Indexes are visible by default. An invisible index is not used by the optimizer. Specification of index visibility applies to indexes other than primary keys (either explicit or implicit). For more information, see Section 10.3.12, “Invisible Indexes”.

* The `ENGINE_ATTRIBUTE` and `SECONDARY_ENGINE_ATTRIBUTE` are used to specify index attributes for primary and secondary storage engines. The options are reserved for future use.

  The value assigned to this option is a string literal containing a valid JSON document or an empty string (''). Invalid JSON is rejected.

  ```
  CREATE INDEX i1 ON t1 (c1) ENGINE_ATTRIBUTE='{"key":"value"}';
  ```

  `ENGINE_ATTRIBUTE` and `SECONDARY_ENGINE_ATTRIBUTE` values can be repeated without error. In this case, the last specified value is used.

  `ENGINE_ATTRIBUTE` and `SECONDARY_ENGINE_ATTRIBUTE` values are not checked by the server, nor are they cleared when the table's storage engine is changed.

#### Table Copying and Locking Options

`ALGORITHM` and `LOCK` clauses may be given to influence the table copying method and level of concurrency for reading and writing the table while its indexes are being modified. They have the same meaning as for the `ALTER TABLE` statement. For more information, see Section 15.1.11, “ALTER TABLE Statement”

NDB Cluster supports online operations using the same `ALGORITHM=INPLACE` syntax used with the standard MySQL Server. See Section 25.6.12, “Online Operations with ALTER TABLE in NDB Cluster”, for more information.


### 15.1.19 CREATE LIBRARY Statement

```
CREATE LIBRARY [IF NOT EXISTS] [database.]library
    LANGUAGE language
    [COMMENT "comment_text"]
    AS code
```

This statement creates a library in the named database, if any. If no database is specified, the library is created in the current database. The library name may be any valid SQL identifier. `LANGUAGE` must be `JavaScript` or `Wasm` (case-insensitive).

`COMMENT` is optional. The text of the comment must be quoted.

*`code`* is a string consisting of JavaScript code, or Base64 or hexadecimal encoding of the compiled WebAssembly code, which is checked for validity at creation time. Invalid code causes the statement to be rejected with an error. The *`code`* string can be dollar-quoted or single-quoted; it can also be double-quoted as long as `ANSI_QUOTES` SQL mode is not set.

To execute `CREATE LIBRARY`, the user must have the `CREATE ROUTINE` privilege.

To use a library created within a stored program using this statement, the user must have the `EXECUTE` privilege. This is checked whenever a function or procedure using the library is created.

In the following example, the first statement creates a JavaScript library named `lib1` in the `jslib` database. The SELECT statement that follows it displays the row in the Information Schema `LIBRARIES` table corresponding to the library just created.

```
mysql> CREATE LIBRARY IF NOT EXISTS jslib.lib1 LANGUAGE JAVASCRIPT
    ->     AS $$
    $>       export function f(n) {
    $>         return n
    $>       }
    $>     $$;
Query OK, 0 rows affected (0.02 sec)

mysql> SELECT * FROM information_schema.LIBRARIES
    -> WHERE LIBRARY_SCHEMA='jslib'\G
*************************** 1. row ***************************
   LIBRARY_CATALOG: def
    LIBRARY_SCHEMA: jslib
      LIBRARY_NAME: lib1
LIBRARY_DEFINITION:
      export function f(n) {
        return n
      }

          LANGUAGE: JAVASCRIPT
           CREATED: 2024-12-16 16:36:44
      LAST_ALTERED: 2024-12-16 16:36:44
          SQL_MODE: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,
NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
           CREATOR: me@localhost
1 row in set (0.00 sec)
```

In the following example, the first statement creates a WebAssembly library named `lib1` in the `wasmlib` database. This example uses the Base64 encoding of the compiled WebAssembly code. The `SELECT` statement that follows it displays the row in the Information Schema `LIBRARIES` table corresponding to the library just created.

```
mysql> CREATE LIBRARY IF NOT EXISTS wasmlib.lib1 LANGUAGE WASM
AS 'AGFzbQEAAAABJwdgA39/fwF/YAAAYAF/AX9gAX8AYAN/fn8BfmAAAX9gBH9/f38BfwJGAhZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCXByb2NfZXhpdAADFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUABgMPDgEBAQMFAgEAAgQCAwIFBAUBcAEFBQUGAQGCAoICBggBfwFB0JEECweUAQcGbWVtb3J5AgANcHJpbnRfbWVzc2FnZQADGV9faW5kaXJlY3RfZnVuY3Rpb25fdGFibGUBAAZfc3RhcnQABBlfZW1zY3JpcHRlbl9zdGFja19yZXN0b3JlAA0XX2Vtc2NyaXB0ZW5fc3RhY2tfYWxsb2MADhxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50AA8JCgEAQQELBAIKCQsMAQcK9wwOAwABCwQAEAgLPgEBfxAIQbgJKAIAIgAEQANAIAAQBSAAKAI4IgANAAsLQbwJKAIAEAVBoAkoAgAQBUG8CSgCABAFQQAQAAALUwECfwJAIABFDQAgACgCTBogACgCFCAAKAIcRwRAIABBAEEAIAAoAiQRAAAaCyAAKAIEIgEgACgCCCICRg0AIAAgASACa6xBASAAKAIoEQQAGgsLYwEBf0HYCEHYCCgCACIAQQFrIAByNgIAQZAIKAIAIgBBCHEEQEGQCCAAQSByNgIAQX8PC0GUCEIANwIAQawIQbwIKAIAIgA2AgBBpAggADYCAEGgCCAAQcAIKAIAajYCAEEAC6YFAQZ/AkBBoAgoAgAiAgR/IAIFEAYNAUGgCCgCAAtBpAgoAgAiAWsgAEkEQEGQCEGACCAAQbQIKAIAEQAADwsCQAJAIABFQeAIKAIAQQBIcg0AIAAhAwNAIANBgAhqIgJBAWstAABBCkcEQCADQQFrIgMNAQwCCwtBkAhBgAggA0G0CCgCABEAACIBIANJDQIgACADayEAQaQIKAIAIQEMAQtBgAghAkEAIQMLAkAgAEGABE8EQCAABEAgASACIAD8CgAACwwBCyAAIAFqIQQCQCABIAJzQQNxRQRAAkAgAUEDcUUgAEVyDQADQCABIAItAAA6AAAgAkEBaiECIAFBAWoiAUEDcUUNASABIARJDQALCyAEQXxxIQUCQCAEQcAASQ0AIAEgBUFAaiIGSw0AA0AgASACKAIANgIAIAEgAigCBDYCBCABIAIoAgg2AgggASACKAIMNgIMIAEgAigCEDYCECABIAIoAhQ2AhQgASACKAIYNgIYIAEgAigCHDYCHCABIAIoAiA2AiAgASACKAIkNgIkIAEgAigCKDYCKCABIAIoAiw2AiwgASACKAIwNgIwIAEgAigCNDYCNCABIAIoAjg2AjggASACKAI8NgI8IAJBQGshAiABQUBrIgEgBk0NAAsLIAEgBU8NAQNAIAEgAigCADYCACACQQRqIQIgAUEEaiIBIAVJDQALDAELIARBBEkgAEEESXINACAEQQRrIQYDQCABIAItAAA6AAAgASACLQABOgABIAEgAi0AAjoAAiABIAItAAM6AAMgAkEEaiECIAFBBGoiASAGTQ0ACwsgASAESQRAA0AgASACLQAAOgAAIAJBAWohAiABQQFqIgEgBEcNAAsLC0GkCEGkCCgCACAAajYCACAAIANqIQELIAELtQIBA39B3AgoAgAaQYAIIQEDQCABIgBBBGohAUGAgoQIIAAoAgAiAmsgAnJBgIGChHhxQYCBgoR4Rg0ACwNAIAAiAUEBaiEAIAEtAAANAAsCQAJ/IAFBgAhrIgACf0HcCCgCAEEASARAIAAQBwwBCyAAEAcLIgEgAEYNABogAQsgAEcNAAJAQeAIKAIAQQpGDQBBpAgoAgAiAEGgCCgCAEYNAEGkCCAAQQFqNgIAIABBCjoAAAwBCyMAQRBrIgAkACAAQQo6AA8CQAJAQaAIKAIAIgEEfyABBRAGDQJBoAgoAgALQaQIKAIAIgFGDQBB4AgoAgBBCkYNAEGkCCABQQFqNgIAIAFBCjoAAAwBC0GQCCAAQQ9qQQFBtAgoAgARAABBAUcNACAALQAPGgsgAEEQaiQACwvYAgEHfyMAQSBrIgMkACADIAAoAhwiBDYCECAAKAIUIQUgAyACNgIcIAMgATYCGCADIAUgBGsiATYCFCABIAJqIQUgA0EQaiEBQQIhBwJ/AkACQAJAIAAoAjwgAUECIANBDGoQARAMBEAgASEEDAELA0AgBSADKAIMIgZGDQIgBkEASARAIAEhBAwECyABQQhBACAGIAEoAgQiCEsiCRtqIgQgBiAIQQAgCRtrIgggBCgCAGo2AgAgAUEMQQQgCRtqIgEgASgCACAIazYCACAFIAZrIQUgACgCPCAEIgEgByAJayIHIANBDGoQARAMRQ0ACwsgBUF/Rw0BCyAAIAAoAiwiATYCHCAAIAE2AhQgACABIAAoAjBqNgIQIAIMAQsgAEEANgIcIABCADcDECAAIAAoAgBBIHI2AgBBACAHQQJGDQAaIAIgBCgCBGsLIQEgA0EgaiQAIAELBABBAAsEAEIACxUAIABFBEBBAA8LQbAJIAA2AgBBfwsGACAAJAALEAAjACAAa0FwcSIAJAAgAAsEACMACwtPBwBBgAgLDFRoaXMgaXMgV0FTTQBBkAgLAQUAQZwICwECAEG0CAsOAwAAAAQAAADIBAAAAAQAQcwICwEBAEHcCAsF/////woAQaAJCwIQBA==';
mysql> SELECT * FROM information_schema.LIBRARIES
    -> WHERE LIBRARY_SCHEMA='wasmlib'\G
 *************************** 1. row ***************************
   LIBRARY_CATALOG: def
    LIBRARY_SCHEMA: wasmlib
      LIBRARY_NAME: lib1
LIBRARY_DEFINITION: AGFzbQEAAAABJwdgA39/fwF/YAAAYAF/AX9gAX8AYAN/fn8BfmAAAX9gBH9/f38BfwJGAhZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCXByb2NfZXhpdAADFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUABgMPDgEBAQMFAgEAAgQCAwIFBAUBcAEFBQUGAQGCAoICBggBfwFB0JEECweUAQcGbWVtb3J5AgANcHJpbnRfbWVzc2FnZQADGV9faW5kaXJlY3RfZnVuY3Rpb25fdGFibGUBAAZfc3RhcnQABBlfZW1zY3JpcHRlbl9zdGFja19yZXN0b3JlAA0XX2Vtc2NyaXB0ZW5fc3RhY2tfYWxsb2MADhxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50AA8JCgEAQQELBAIKCQsMAQcK9wwOAwABCwQAEAgLPgEBfxAIQbgJKAIAIgAEQANAIAAQBSAAKAI4IgANAAsLQbwJKAIAEAVBoAkoAgAQBUG8CSgCABAFQQAQAAALUwECfwJAIABFDQAgACgCTBogACgCFCAAKAIcRwRAIABBAEEAIAAoAiQRAAAaCyAAKAIEIgEgACgCCCICRg0AIAAgASACa6xBASAAKAIoEQQAGgsLYwEBf0HYCEHYCCgCACIAQQFrIAByNgIAQZAIKAIAIgBBCHEEQEGQCCAAQSByNgIAQX8PC0GUCEIANwIAQawIQbwIKAIAIgA2AgBBpAggADYCAEGgCCAAQcAIKAIAajYCAEEAC6YFAQZ/AkBBoAgoAgAiAgR/IAIFEAYNAUGgCCgCAAtBpAgoAgAiAWsgAEkEQEGQCEGACCAAQbQIKAIAEQAADwsCQAJAIABFQeAIKAIAQQBIcg0AIAAhAwNAIANBgAhqIgJBAWstAABBCkcEQCADQQFrIgMNAQwCCwtBkAhBgAggA0G0CCgCABEAACIBIANJDQIgACADayEAQaQIKAIAIQEMAQtBgAghAkEAIQMLAkAgAEGABE8EQCAABEAgASACIAD8CgAACwwBCyAAIAFqIQQCQCABIAJzQQNxRQRAAkAgAUEDcUUgAEVyDQADQCABIAItAAA6AAAgAkEBaiECIAFBAWoiAUEDcUUNASABIARJDQALCyAEQXxxIQUCQCAEQcAASQ0AIAEgBUFAaiIGSw0AA0AgASACKAIANgIAIAEgAigCBDYCBCABIAIoAgg2AgggASACKAIMNgIMIAEgAigCEDYCECABIAIoAhQ2AhQgASACKAIYNgIYIAEgAigCHDYCHCABIAIoAiA2AiAgASACKAIkNgIkIAEgAigCKDYCKCABIAIoAiw2AiwgASACKAIwNgIwIAEgAigCNDYCNCABIAIoAjg2AjggASACKAI8NgI8IAJBQGshAiABQUBrIgEgBk0NAAsLIAEgBU8NAQNAIAEgAigCADYCACACQQRqIQIgAUEEaiIBIAVJDQALDAELIARBBEkgAEEESXINACAEQQRrIQYDQCABIAItAAA6AAAgASACLQABOgABIAEgAi0AAjoAAiABIAItAAM6AAMgAkEEaiECIAFBBGoiASAGTQ0ACwsgASAESQRAA0AgASACLQAAOgAAIAJBAWohAiABQQFqIgEgBEcNAAsLC0GkCEGkCCgCACAAajYCACAAIANqIQELIAELtQIBA39B3AgoAgAaQYAIIQEDQCABIgBBBGohAUGAgoQIIAAoAgAiAmsgAnJBgIGChHhxQYCBgoR4Rg0ACwNAIAAiAUEBaiEAIAEtAAANAAsCQAJ/IAFBgAhrIgACf0HcCCgCAEEASARAIAAQBwwBCyAAEAcLIgEgAEYNABogAQsgAEcNAAJAQeAIKAIAQQpGDQBBpAgoAgAiAEGgCCgCAEYNAEGkCCAAQQFqNgIAIABBCjoAAAwBCyMAQRBrIgAkACAAQQo6AA8CQAJAQaAIKAIAIgEEfyABBRAGDQJBoAgoAgALQaQIKAIAIgFGDQBB4AgoAgBBCkYNAEGkCCABQQFqNgIAIAFBCjoAAAwBC0GQCCAAQQ9qQQFBtAgoAgARAABBAUcNACAALQAPGgsgAEEQaiQACwvYAgEHfyMAQSBrIgMkACADIAAoAhwiBDYCECAAKAIUIQUgAyACNgIcIAMgATYCGCADIAUgBGsiATYCFCABIAJqIQUgA0EQaiEBQQIhBwJ/AkACQAJAIAAoAjwgAUECIANBDGoQARAMBEAgASEEDAELA0AgBSADKAIMIgZGDQIgBkEASARAIAEhBAwECyABQQhBACAGIAEoAgQiCEsiCRtqIgQgBiAIQQAgCRtrIgggBCgCAGo2AgAgAUEMQQQgCRtqIgEgASgCACAIazYCACAFIAZrIQUgACgCPCAEIgEgByAJayIHIANBDGoQARAMRQ0ACwsgBUF/Rw0BCyAAIAAoAiwiATYCHCAAIAE2AhQgACABIAAoAjBqNgIQIAIMAQsgAEEANgIcIABCADcDECAAIAAoAgBBIHI2AgBBACAHQQJGDQAaIAIgBCgCBGsLIQEgA0EgaiQAIAELBABBAAsEAEIACxUAIABFBEBBAA8LQbAJIAA2AgBBfwsGACAAJAALEAAjACAAa0FwcSIAJAAgAAsEACMACwtPBwBBgAgLDFRoaXMgaXMgV0FTTQBBkAgLAQUAQZwICwECAEG0CAsOAwAAAAQAAADIBAAAAAQAQcwICwEBAEHcCAsF/////woAQaAJCwIQBA==
          LANGUAGE: WASM
           CREATED: 2025-10-22 15:42:12
      LAST_ALTERED: 2025-10-22 15:42:12
          SQL_MODE: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
   LIBRARY_COMMENT:
           CREATOR: me@localhost
```

In the following example, the first statement creates a WebAssembly library named `lib2` in the `wasmlib` database. This example uses the hexadecimal encoding of the compiled WebAssembly code. The `SELECT` statement that follows it displays the row in the Information Schema `LIBRARIES` table corresponding to the library just created.

```
mysql> CREATE LIBRARY IF NOT EXISTS wasmlib.lib2 LANGUAGE WASM
AS X'0061736d0100000001270760037f7f7f017f60000060017f017f60017f0060037f7e7f017e6000017f60047f7f7f7f017f02460216776173695f736e617073686f745f70726576696577310970726f635f65786974000316776173695f736e617073686f745f70726576696577310866645f77726974650006030f0e01010103050201000204020302050405017001050505060101820282020608017f0141d091040b07940107066d656d6f727902000d7072696e745f6d6573736167650003195f5f696e6469726563745f66756e6374696f6e5f7461626c650100065f73746172740004195f656d736372697074656e5f737461636b5f726573746f7265000d175f656d736372697074656e5f737461636b5f616c6c6f63000e1c656d736372697074656e5f737461636b5f6765745f63757272656e74000f090a010041010b04020a090b0c01070af70c0e0300010b040010080b3e01017f100841b80928020022000440034020001005200028023822000d000b0b41bc09280200100541a009280200100541bc09280200100541001000000b5301027f02402000450d00200028024c1a2000280214200028021c47044020004100410020002802241100001a0b2000280204220120002802082202460d002000200120026bac410120002802281104001a0b0b6301017f41d80841d808280200220041016b200072360200419008280200220041087104404190082000412072360200417f0f0b419408420037020041ac0841bc08280200220036020041a408200036020041a008200041c0082802006a36020041000ba60501067f024041a0082802002202047f20020510060d0141a0082802000b41a40828020022016b2000490440419008418008200041b4082802001100000f0b0240024020004541e008280200410048720d0020002103034020034180086a220241016b2d0000410a470440200341016b22030d010c020b0b419008418008200341b40828020011000022012003490d02200020036b210041a40828020021010c010b4180082102410021030b024020004180044f044020000440200120022000fc0a00000b0c010b200020016a2104024020012002734103714504400240200141037145200045720d000340200120022d00003a0000200241016a2102200141016a2201410371450d0120012004490d000b0b2004417c7121050240200441c000490d002001200541406a22064b0d0003402001200228020036020020012002280204360204200120022802083602082001200228020c36020c2001200228021036021020012002280214360214200120022802183602182001200228021c36021c2001200228022036022020012002280224360224200120022802283602282001200228022c36022c2001200228023036023020012002280234360234200120022802383602382001200228023c36023c200241406b2102200141406b220120064d0d000b0b200120054f0d01034020012002280200360200200241046a2102200141046a22012005490d000b0c010b20044104492000410449720d00200441046b21060340200120022d00003a0000200120022d00013a0001200120022d00023a0002200120022d00033a0003200241046a2102200141046a220120064d0d000b0b200120044904400340200120022d00003a0000200241016a2102200141016a22012004470d000b0b0b41a40841a40828020020006a360200200020036a21010b20010bb50201037f41dc082802001a418008210103402001220041046a21014180828408200028020022026b20027241808182847871418081828478460d000b03402000220141016a210020012d00000d000b0240027f20014180086b2200027f41dc082802004100480440200010070c010b200010070b22012000460d001a20010b2000470d00024041e008280200410a460d0041a408280200220041a008280200460d0041a408200041016a3602002000410a3a00000c010b230041106b220024002000410a3a000f0240024041a0082802002201047f20010510060d0241a0082802000b41a4082802002201460d0041e008280200410a460d0041a408200141016a3602002001410a3a00000c010b4190082000410f6a410141b4082802001100004101470d0020002d000f1a0b200041106a24000b0bd80201077f230041206b220324002003200028021c2204360210200028021421052003200236021c200320013602182003200520046b2201360214200120026a2105200341106a210141022107027f024002400240200028023c200141022003410c6a1001100c0440200121040c010b03402005200328020c2206460d0220064100480440200121040c040b2001410841002006200128020422084b22091b6a220420062008410020091b6b220820042802006a3602002001410c410420091b6a2201200128020020086b360200200520066b2105200028023c20042201200720096b22072003410c6a1001100c450d000b0b2005417f470d010b2000200028022c220136021c200020013602142000200120002802306a36021020020c010b2000410036021c2000420037031020002000280200412072360200410020074102460d001a200220042802046b0b2101200341206a240020010b040041000b040042000b1500200045044041000f0b41b0092000360200417f0b0600200024000b1000230020006b4170712200240020000b040023000b0b4f07004180080b0c54686973206973205741534d004190080b010500419c080b01020041b4080b0e0300000004000000c804000000040041cc080b01010041dc080b05ffffffff0a0041a0090b021004';
mysql> SELECT * FROM information_schema.LIBRARIES
    -> WHERE LIBRARY_SCHEMA='wasmlib' AND LIBRARY_NAME='lib2'\G
*************************** 1. row ***************************
   LIBRARY_CATALOG: def
    LIBRARY_SCHEMA: wasmlib
      LIBRARY_NAME: lib2
LIBRARY_DEFINITION:
          LANGUAGE: WASM
           CREATED: 2025-10-23 11:07:18
      LAST_ALTERED: 2025-10-23 11:07:18
          SQL_MODE: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
   LIBRARY_COMMENT:
           CREATOR: me@localhost
2 rows in set (0.000 sec)
```

See Section 27.3.8, “Using JavaScript Libraries”, as well as Section 27.3.9, “Using WebAssembly Libraries”, for more information and examples.


### 15.1.20 CREATE LOGFILE GROUP Statement

```
CREATE LOGFILE GROUP logfile_group
    ADD UNDOFILE 'undo_file'
    [INITIAL_SIZE [=] initial_size]
    [UNDO_BUFFER_SIZE [=] undo_buffer_size]
    [REDO_BUFFER_SIZE [=] redo_buffer_size]
    [NODEGROUP [=] nodegroup_id]
    [WAIT]
    [COMMENT [=] 'string']
    ENGINE [=] engine_name
```

This statement creates a new log file group named *`logfile_group`* having a single undo file named '*`undo_file`*'. A `CREATE LOGFILE GROUP` statement has one and only one `ADD UNDOFILE` clause. For rules covering the naming of log file groups, see Section 11.2, “Schema Object Names”.

Note

All NDB Cluster Disk Data objects share the same namespace. This means that *each Disk Data object* must be uniquely named (and not merely each Disk Data object of a given type). For example, you cannot have a tablespace and a log file group with the same name, or a tablespace and a data file with the same name.

There can be only one log file group per NDB Cluster instance at any given time.

The optional `INITIAL_SIZE` parameter sets the undo file's initial size; if not specified, it defaults to `128M` (128 megabytes). The optional `UNDO_BUFFER_SIZE` parameter sets the size used by the undo buffer for the log file group; The default value for `UNDO_BUFFER_SIZE` is `8M` (eight megabytes); this value cannot exceed the amount of system memory available. Both of these parameters are specified in bytes. You may optionally follow either or both of these with a one-letter abbreviation for an order of magnitude, similar to those used in `my.cnf`. Generally, this is one of the letters `M` (for megabytes) or `G` (for gigabytes).

Memory used for `UNDO_BUFFER_SIZE` comes from the global pool whose size is determined by the value of the `SharedGlobalMemory` data node configuration parameter. This includes any default value implied for this option by the setting of the `InitialLogFileGroup` data node configuration parameter.

The maximum permitted for `UNDO_BUFFER_SIZE` is 629145600 (600 MB).

On 32-bit systems, the maximum supported value for `INITIAL_SIZE` is 4294967296 (4 GB). (Bug #29186)

The minimum allowed value for `INITIAL_SIZE` is 1048576 (1 MB).

The `ENGINE` option determines the storage engine to be used by this log file group, with *`engine_name`* being the name of the storage engine. This must be `NDB` (or `NDBCLUSTER`). If `ENGINE` is not set, MySQL tries to use the engine specified by the `default_storage_engine` server system variable. In any case, if the engine is not specified as `NDB` or `NDBCLUSTER`, the `CREATE LOGFILE GROUP` statement appears to succeed but actually fails to create the log file group, as shown here:

```
mysql> CREATE LOGFILE GROUP lg1
    ->     ADD UNDOFILE 'undo.dat' INITIAL_SIZE = 10M;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> SHOW WARNINGS;
+-------+------+------------------------------------------------------------------------------------------------+
| Level | Code | Message                                                                                        |
+-------+------+------------------------------------------------------------------------------------------------+
| Error | 1478 | Table storage engine 'InnoDB' does not support the create option 'TABLESPACE or LOGFILE GROUP' |
+-------+------+------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)

mysql> DROP LOGFILE GROUP lg1 ENGINE = NDB;
ERROR 1529 (HY000): Failed to drop LOGFILE GROUP

mysql> CREATE LOGFILE GROUP lg1
    ->     ADD UNDOFILE 'undo.dat' INITIAL_SIZE = 10M
    ->     ENGINE = NDB;
Query OK, 0 rows affected (2.97 sec)
```

The fact that the `CREATE LOGFILE GROUP` statement does not actually return an error when a storage engine other than `NDB` is specified, but rather appears to succeed, is a known issue which we hope to address in a future version of NDB Cluster.

*`REDO_BUFFER_SIZE`*, `NODEGROUP`, `WAIT`, and `COMMENT` are parsed but ignored, and so have no effect in MySQL 9.5. These options are intended for future expansion.

When used with `ENGINE [=] NDB`, a log file group and associated undo log file are created on each Cluster data node. You can verify that the undo files were created and obtain information about them by querying the Information Schema `FILES` table. For example:

```
mysql> SELECT LOGFILE_GROUP_NAME, LOGFILE_GROUP_NUMBER, EXTRA
    -> FROM INFORMATION_SCHEMA.FILES
    -> WHERE FILE_NAME = 'undo_10.dat';
+--------------------+----------------------+----------------+
| LOGFILE_GROUP_NAME | LOGFILE_GROUP_NUMBER | EXTRA          |
+--------------------+----------------------+----------------+
| lg_3               |                   11 | CLUSTER_NODE=3 |
| lg_3               |                   11 | CLUSTER_NODE=4 |
+--------------------+----------------------+----------------+
2 rows in set (0.06 sec)
```

`CREATE LOGFILE GROUP` is useful only with Disk Data storage for NDB Cluster. See Section 25.6.11, “NDB Cluster Disk Data Tables”.


### 15.1.21 CREATE PROCEDURE and CREATE FUNCTION Statements

```
CREATE
    [DEFINER = user]
    PROCEDURE [IF NOT EXISTS] sp_name ([proc_parameter[,...]])
    [characteristic ...]
    [USING library_reference[, library_reference][, ...]]
    routine_body

CREATE
    [DEFINER = user]
    FUNCTION [IF NOT EXISTS] sp_name ([func_parameter[,...]])
    RETURNS type
    [characteristic ...] routine_body

proc_parameter:
    [ IN | OUT | INOUT ] param_name type

func_parameter:
    param_name type

type:
    Any valid MySQL data type

characteristic: {
    COMMENT 'string'
  | LANGUAGE {SQL | JAVASCRIPT }
  | [NOT] DETERMINISTIC
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA }
  | SQL SECURITY { DEFINER | INVOKER }
}

library_reference:
    [database.]library_name [[AS] alias]

routine_body:
    SQL routine | AS JavaScript statements
```

These statements are used to create a stored routine (a stored procedure or function). That is, the specified routine becomes known to the server. By default, a stored routine is associated with the default database. To associate the routine explicitly with a given database, specify the name as *`db_name.sp_name`* when you create it.

The `CREATE FUNCTION` statement is also used in MySQL to support loadable functions. See Section 15.7.4.1, “CREATE FUNCTION Statement for Loadable Functions”. A loadable function can be regarded as an external stored function. Stored functions share their namespace with loadable functions. See Section 11.2.5, “Function Name Parsing and Resolution”, for the rules describing how the server interprets references to different kinds of functions.

To invoke a stored procedure, use the `CALL` statement (see Section 15.2.1, “CALL Statement”). To invoke a stored function, refer to it in an expression. The function returns a value during expression evaluation.

`CREATE PROCEDURE` and `CREATE FUNCTION` require the `CREATE ROUTINE` privilege. If the `DEFINER` clause is present, the privileges required depend on the *`user`* value, as discussed in Section 27.8, “Stored Object Access Control”. If binary logging is enabled, `CREATE FUNCTION` might require the `SUPER` privilege, as discussed in Section 27.9, “Stored Program Binary Logging”.

By default, MySQL automatically grants the `ALTER ROUTINE` and `EXECUTE` privileges to the routine creator. This behavior can be changed by disabling the `automatic_sp_privileges` system variable. See Section 27.2.2, “Stored Routines and MySQL Privileges”.

The `DEFINER` and `SQL SECURITY` clauses specify the security context to be used when checking access privileges at routine execution time, as described later in this section.

If the routine name is the same as the name of a built-in SQL function, a syntax error occurs unless you use a space between the name and the following parenthesis when defining the routine or invoking it later. For this reason, avoid using the names of existing SQL functions for your own stored routines.

The `IGNORE_SPACE` SQL mode applies to built-in functions, not to stored routines. It is always permissible to have spaces after a stored routine name, regardless of whether `IGNORE_SPACE` is enabled.

`IF NOT EXISTS` prevents an error from occurring if there already exists a routine with the same name. This option is supported with both `CREATE FUNCTION` and `CREATE PROCEDURE`.

If a built-in function with the same name already exists, attempting to create a stored function with `CREATE FUNCTION ... IF NOT EXISTS` succeeds with a warning indicating that it has the same name as a native function; this is no different than when performing the same `CREATE FUNCTION` statement without specifying `IF NOT EXISTS`.

If a loadable function with the same name already exists, attempting to create a stored function using `IF NOT EXISTS` succeeds with a warning. This is the same as without specifying `IF NOT EXISTS`.

See Function Name Resolution, for more information.

The parameter list enclosed within parentheses must always be present. If there are no parameters, an empty parameter list of `()` should be used. Parameter names are not case-sensitive.

Each parameter is an `IN` parameter by default. To specify otherwise for a parameter, use the keyword `OUT` or `INOUT` before the parameter name.

Note

Specifying a parameter as `IN`, `OUT`, or `INOUT` is valid only for a `PROCEDURE`. For a `FUNCTION`, parameters are always regarded as `IN` parameters.

An `IN` parameter passes a value into a procedure. The procedure might modify the value, but the modification is not visible to the caller when the procedure returns. An `OUT` parameter passes a value from the procedure back to the caller. Its initial value is `NULL` within the procedure, and its value is visible to the caller when the procedure returns. An `INOUT` parameter is initialized by the caller, can be modified by the procedure, and any change made by the procedure is visible to the caller when the procedure returns.

For each `OUT` or `INOUT` parameter, pass a user-defined variable in the `CALL` statement that invokes the procedure so that you can obtain its value when the procedure returns. If you are calling the procedure from within another stored procedure or function, you can also pass a routine parameter or local routine variable as an `OUT` or `INOUT` parameter. If you are calling the procedure from within a trigger, you can also pass `NEW.col_name` as an `OUT` or `INOUT` parameter.

For information about the effect of unhandled conditions on procedure parameters, see Section 15.6.7.8, “Condition Handling and OUT or INOUT Parameters”.

Routine parameters cannot be referenced in statements prepared within the routine; see Section 27.10, “Restrictions on Stored Programs”.

The following example shows a simple stored procedure that, given a country code, counts the number of cities for that country that appear in the `city` table of the `world` database. The country code is passed using an `IN` parameter, and the city count is returned using an `OUT` parameter:

```
mysql> delimiter //

mysql> CREATE PROCEDURE citycount (IN country CHAR(3), OUT cities INT)
       BEGIN
         SELECT COUNT(*) INTO cities FROM world.city
         WHERE CountryCode = country;
       END//
Query OK, 0 rows affected (0.01 sec)

mysql> delimiter ;

mysql> CALL citycount('JPN', @cities); -- cities in Japan
Query OK, 1 row affected (0.00 sec)

mysql> SELECT @cities;
+---------+
| @cities |
+---------+
|     248 |
+---------+
1 row in set (0.00 sec)

mysql> CALL citycount('FRA', @cities); -- cities in France
Query OK, 1 row affected (0.00 sec)

mysql> SELECT @cities;
+---------+
| @cities |
+---------+
|      40 |
+---------+
1 row in set (0.00 sec)
```

The example uses the **mysql** client `delimiter` command to change the statement delimiter from `;` to `//` while the procedure is being defined. This enables the `;` delimiter used in the procedure body to be passed through to the server rather than being interpreted by **mysql** itself. See Section 27.1, “Defining Stored Programs”.

The `RETURNS` clause may be specified only for a `FUNCTION`, for which it is mandatory. It indicates the return type of the function, and the function body must contain a `RETURN value` statement. If the `RETURN` statement returns a value of a different type, the value is coerced to the proper type. For example, if a function specifies an `ENUM` or `SET` value in the `RETURNS` clause, but the `RETURN` statement returns an integer, the value returned from the function is the string for the corresponding `ENUM` member of set of `SET` members.

The following example function takes a parameter, performs an operation using an SQL function, and returns the result. In this case, it is unnecessary to use `delimiter` because the function definition contains no internal `;` statement delimiters:

```
mysql> CREATE FUNCTION hello (s CHAR(20))
    ->   RETURNS CHAR(50) DETERMINISTIC
    ->   RETURN CONCAT('Hello, ',s,'!');
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT hello('world');
+----------------+
| hello('world') |
+----------------+
| Hello, world!  |
+----------------+
1 row in set (0.00 sec)
```

Parameter types and function return types can be declared to use any valid data type. The `COLLATE` attribute can be used if preceded by a `CHARACTER SET` specification.

The *`routine_body`* consists of a valid SQL routine statement. This can be a simple statement such as `SELECT` or `INSERT`, or a compound statement written using `BEGIN` and `END`. Compound statements can contain declarations, loops, and other control structure statements. The syntax for these statements is described in Section 15.6, “Compound Statement Syntax”. In practice, stored functions tend to use compound statements, unless the body consists of a single `RETURN` statement.

The `AS` keyword is used to indicate that the routine body that follows is written in a language other than SQL; it immediately precedes the opening dollar-quoted delimiter or quotation mark of the routine body. See Section 27.3, “JavaScript Stored Programs”.

MySQL permits routines to contain DDL statements, such as `CREATE` and `DROP`. MySQL also permits stored procedures (but not stored functions) to contain SQL transaction statements such as `COMMIT`. Stored functions may not contain statements that perform explicit or implicit commit or rollback. Support for these statements is not required by the SQL standard, which states that each DBMS vendor may decide whether to permit them.

Statements that return a result set can be used within a stored procedure but not within a stored function. This prohibition includes `SELECT` statements that do not have an `INTO var_list` clause and other statements such as `SHOW`, `EXPLAIN`, and `CHECK TABLE`. For statements that can be determined at function definition time to return a result set, a `Not allowed to return a result set from a function` error occurs (`ER_SP_NO_RETSET`). For statements that can be determined only at runtime to return a result set, a `PROCEDURE %s can't return a result set in the given context` error occurs (`ER_SP_BADSELECT`).

`USE` statements within stored routines are not permitted. When a routine is invoked, an implicit `USE db_name` is performed (and undone when the routine terminates). The causes the routine to have the given default database while it executes. References to objects in databases other than the routine default database should be qualified with the appropriate database name.

For additional information about statements that are not permitted in stored routines, see Section 27.10, “Restrictions on Stored Programs”.

For information about invoking stored procedures from within programs written in a language that has a MySQL interface, see Section 15.2.1, “CALL Statement”.

MySQL stores the `sql_mode` system variable setting in effect when a routine is created or altered, and always executes the routine with this setting in force, *regardless of the current server SQL mode when the routine begins executing*.

The switch from the SQL mode of the invoker to that of the routine occurs after evaluation of arguments and assignment of the resulting values to routine parameters. If you define a routine in strict SQL mode but invoke it in nonstrict mode, assignment of arguments to routine parameters does not take place in strict mode. If you require that expressions passed to a routine be assigned in strict SQL mode, you should invoke the routine with strict mode in effect.

The `COMMENT` characteristic is a MySQL extension, and may be used to describe the stored routine. This information is displayed by the [`SHOW CREATE PROCEDURE`](show-create-procedure.html "15.7.7.11 SHOW CREATE PROCEDURE Statement") and [`SHOW CREATE FUNCTION`](show-create-function.html "15.7.7.9 SHOW CREATE FUNCTION Statement") statements.

The `LANGUAGE` characteristic indicates the language in which the routine is written. If the MLE component is not available (see Section 7.5.7, “Multilingual Engine Component (MLE)”")), the server ignores this characteristic, and only SQL routines are supported. If the MLE component is present, the server supports stored routines written in JavaScript (see Section 27.3, “JavaScript Stored Programs”), which require this to be specified using `LANGUAGE JAVASCRIPT`. Regardless of whether the MLE component is installed, when this characteristic is not supplied, the language used in the stored routine is assumed to be SQL.

A routine is considered “deterministic” if it always produces the same result for the same input parameters, and “not deterministic” otherwise. If neither `DETERMINISTIC` nor `NOT DETERMINISTIC` is given in the routine definition, the default is `NOT DETERMINISTIC`. To declare that a function is deterministic, you must specify `DETERMINISTIC` explicitly.

Assessment of the nature of a routine is based on the “honesty” of the creator: MySQL does not check that a routine declared `DETERMINISTIC` is free of statements that produce nondeterministic results. However, misdeclaring a routine might affect results or affect performance. Declaring a nondeterministic routine as `DETERMINISTIC` might lead to unexpected results by causing the optimizer to make incorrect execution plan choices. Declaring a deterministic routine as `NONDETERMINISTIC` might diminish performance by causing available optimizations not to be used.

If binary logging is enabled, the `DETERMINISTIC` characteristic affects which routine definitions MySQL accepts. See Section 27.9, “Stored Program Binary Logging”.

A routine that contains the `NOW()` function (or its synonyms) or `RAND()` is nondeterministic, but it might still be replication-safe. For `NOW()`, the binary log includes the timestamp and replicates correctly. `RAND()` also replicates correctly as long as it is called only a single time during the execution of a routine. (You can consider the routine execution timestamp and random number seed as implicit inputs that are identical on the source and replica.)

Several characteristics provide information about the nature of data use by the routine. In MySQL, these characteristics are advisory only. The server does not use them to constrain what kinds of statements a routine is permitted to execute.

* `CONTAINS SQL` indicates that the routine does not contain statements that read or write data. This is the default if none of these characteristics is given explicitly. Examples of such statements are `SET @x = 1` or `DO RELEASE_LOCK('abc')`, which execute but neither read nor write data.

* `NO SQL` indicates that the routine contains no SQL statements.

* `READS SQL DATA` indicates that the routine contains statements that read data (for example, `SELECT`), but not statements that write data.

* `MODIFIES SQL DATA` indicates that the routine contains statements that may write data (for example, `INSERT` or `DELETE`).

The `SQL SECURITY` characteristic can be `DEFINER` or `INVOKER` to specify the security context; that is, whether the routine executes using the privileges of the account named in the routine `DEFINER` clause or the user who invokes it. This account must have permission to access the database with which the routine is associated. The default value is `DEFINER`. The user who invokes the routine must have the `EXECUTE` privilege for it, as must the `DEFINER` account if the routine executes in definer security context.

The `DEFINER` clause specifies the MySQL account to be used when checking access privileges at routine execution time for routines that have the `SQL SECURITY DEFINER` characteristic.

If the `DEFINER` clause is present, the *`user`* value should be a MySQL account specified as `'user_name'@'host_name'`, `CURRENT_USER`, or `CURRENT_USER()`. The permitted *`user`* values depend on the privileges you hold, as discussed in Section 27.8, “Stored Object Access Control”. Also see that section for additional information about stored routine security.

If the `DEFINER` clause is omitted, the default definer is the user who executes the [`CREATE PROCEDURE`](create-procedure.html "15.1.21 CREATE PROCEDURE and CREATE FUNCTION Statements") or [`CREATE FUNCTION`](create-function.html "15.1.16 CREATE FUNCTION Statement") statement. This is the same as specifying `DEFINER = CURRENT_USER` explicitly.

Within the body of a stored routine that is defined with the `SQL SECURITY DEFINER` characteristic, the `CURRENT_USER` function returns the routine's `DEFINER` value. For information about user auditing within stored routines, see Section 8.2.23, “SQL-Based Account Activity Auditing”.

Consider the following procedure, which displays a count of the number of MySQL accounts listed in the `mysql.user` system table:

```
CREATE DEFINER = 'admin'@'localhost' PROCEDURE account_count()
BEGIN
  SELECT 'Number of accounts:', COUNT(*) FROM mysql.user;
END;
```

The procedure is assigned a `DEFINER` account of `'admin'@'localhost'` no matter which user defines it. It executes with the privileges of that account no matter which user invokes it (because the default security characteristic is `DEFINER`). The procedure succeeds or fails depending on whether invoker has the `EXECUTE` privilege for it and `'admin'@'localhost'` has the `SELECT` privilege for the `mysql.user` table.

Now suppose that the procedure is defined with the `SQL SECURITY INVOKER` characteristic:

```
CREATE DEFINER = 'admin'@'localhost' PROCEDURE account_count()
SQL SECURITY INVOKER
BEGIN
  SELECT 'Number of accounts:', COUNT(*) FROM mysql.user;
END;
```

The procedure still has a `DEFINER` of `'admin'@'localhost'`, but in this case, it executes with the privileges of the invoking user. Thus, the procedure succeeds or fails depending on whether the invoker has the `EXECUTE` privilege for it and the `SELECT` privilege for the `mysql.user` table.

By default, when a routine with the `SQL SECURITY DEFINER` characteristic is executed, MySQL Server does not set any active roles for the MySQL account named in the `DEFINER` clause, only the default roles. The exception is if the `activate_all_roles_on_login` system variable is enabled, in which case MySQL Server sets all roles granted to the `DEFINER` user, including mandatory roles. Any privileges granted through roles are therefore not checked by default when the `CREATE PROCEDURE` or `CREATE FUNCTION` statement is issued. For stored programs, if execution should occur with roles different from the default, the program body can execute `SET ROLE` to activate the required roles. This must be done with caution since the privileges assigned to roles can be changed.

The server handles the data type of a routine parameter, local routine variable created with `DECLARE`, or function return value as follows:

* Assignments are checked for data type mismatches and overflow. Conversion and overflow problems result in warnings, or errors in strict SQL mode.

* Only scalar values can be assigned. For example, a statement such as `SET x = (SELECT 1, 2)` is invalid.

* For character data types, if `CHARACTER SET` is included in the declaration, the specified character set and its default collation is used. If the `COLLATE` attribute is also present, that collation is used rather than the default collation.

  If `CHARACTER SET` and `COLLATE` are not present, the database character set and collation in effect at routine creation time are used. To avoid having the server use the database character set and collation, provide an explicit `CHARACTER SET` and a `COLLATE` attribute for character data parameters.

  If you alter the database default character set or collation, stored routines that are to use the new database defaults must be dropped and recreated.

  The database character set and collation are given by the value of the `character_set_database` and `collation_database` system variables. For more information, see Section 12.3.3, “Database Character Set and Collation”.

`CREATE PROCEDURE` and `CREATE FUNCTION` support a `USING` option for importing one or more JavaScript libraries, references to these being listed in a set of parentheses following the `USING` keyword. Each reference takes the form `[database.]library_name [[AS] alias]`, made up of the parts listed here:

* The name of the database or schema where the library is located, followed by a period character. This is optional; if not specified, the database in which the stored routine was created is used.

* The name of the libary.
* An optional alias for the library, preceded by an optional `AS` keyword. This can be used to indicate a namespace for library objects within the stored function or stored procedure.

Example:

```
mysql> CREATE LIBRARY IF NOT EXISTS jslib.lib1 LANGUAGE JAVASCRIPT
    ->     AS $$
    $>       export function f(n) {
    $>         return n
    $>       }
    $>     $$;
Query OK, 0 rows affected (0.02 sec)

mysql> CREATE LIBRARY IF NOT EXISTS jslib.lib2 LANGUAGE JAVASCRIPT
    ->     AS $$
    $>       export function g(n) {
    $>         return n * 2
    $>       }
    $>     $$;
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE FUNCTION foo(n INTEGER) RETURNS INTEGER LANGUAGE JAVASCRIPT
    ->     USING (jslib.lib1 AS mylib, jslib.lib2 AS yourlib)
    ->     AS $$
    $>       return mylib.f(n) + yourlib.g(n)
    $>     $$;
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT foo(8);
+--------+
| foo(8) |
+--------+
|     24 |
+--------+
1 row in set (0.00 sec)

mysql> SELECT * FROM information_schema.routines WHERE ROUTINE_NAME='foo'\G
*************************** 1. row ***************************
           SPECIFIC_NAME: foo
         ROUTINE_CATALOG: def
          ROUTINE_SCHEMA: jslib
            ROUTINE_NAME: foo
            ROUTINE_TYPE: FUNCTION
               DATA_TYPE: int
CHARACTER_MAXIMUM_LENGTH: NULL
  CHARACTER_OCTET_LENGTH: NULL
       NUMERIC_PRECISION: 10
           NUMERIC_SCALE: 0
      DATETIME_PRECISION: NULL
      CHARACTER_SET_NAME: NULL
          COLLATION_NAME: NULL
          DTD_IDENTIFIER: int
            ROUTINE_BODY: EXTERNAL
      ROUTINE_DEFINITION:
      return mylib.f(n) + otherlib.g(n)

           EXTERNAL_NAME: NULL
       EXTERNAL_LANGUAGE: JAVASCRIPT
         PARAMETER_STYLE: SQL
        IS_DETERMINISTIC: NO
         SQL_DATA_ACCESS: CONTAINS SQL
                SQL_PATH: NULL
           SECURITY_TYPE: DEFINER
                 CREATED: 2024-12-16 11:27:28
            LAST_ALTERED: 2024-12-16 11:27:28
                SQL_MODE: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
         ROUTINE_COMMENT:
                 DEFINER: me@localhost
    CHARACTER_SET_CLIENT: utf8mb4
    COLLATION_CONNECTION: utf8mb4_0900_ai_ci
      DATABASE_COLLATION: utf8mb4_0900_ai_ci
1 row in set (0.00 sec)
```

`USING` may be included in a `CREATE PROCEDURE` or `CREATE FUNCTION` statement only when the statement also includes an explicit `LANGUAGE=JAVASCRIPT` clause.

To use a given library in JavaScript procedure code, you must have the `EXECUTE` privilege on that library. This is checked, when executing a `CREATE FUNCTION` or `CREATE PROCEDURE` statement, for each library listed in the statement's `USING` clause.

`SQL SECURITY DEFINER` and `SQL SECURITY INVOKER` apply to libraries whether they have been imported directly or indirectly. In addition, the `automatic_sp_privileges` system variable applies to libraries just as it does to stored functions and stored procedures.

For information about creating JavaScript libraries which can be imported with `USING`, see Section 15.1.19, “CREATE LIBRARY Statement”. For additional information and examples, see also Section 27.3.8, “Using JavaScript Libraries”.


### 15.1.22 CREATE SERVER Statement

```
CREATE SERVER server_name
    FOREIGN DATA WRAPPER wrapper_name
    OPTIONS (option [, option] ...)

option: {
    HOST character-literal
  | DATABASE character-literal
  | USER character-literal
  | PASSWORD character-literal
  | SOCKET character-literal
  | OWNER character-literal
  | PORT numeric-literal
}
```

This statement creates the definition of a server for use with the `FEDERATED` storage engine. The `CREATE SERVER` statement creates a new row in the `servers` table in the `mysql` database. This statement requires the `SUPER` privilege.

The `server_name` should be a unique reference to the server. Server definitions are global within the scope of the server, it is not possible to qualify the server definition to a specific database. `server_name` has a maximum length of 64 characters (names longer than 64 characters are silently truncated), and is case-insensitive. You may specify the name as a quoted string.

The `wrapper_name` is an identifier and may be quoted with single quotation marks.

For each `option` you must specify either a character literal or numeric literal. Character literals are UTF-8, support a maximum length of 64 characters and default to a blank (empty) string. String literals are silently truncated to 64 characters. Numeric literals must be a number between 0 and 9999, default value is 0.

Note

The `OWNER` option is currently not applied, and has no effect on the ownership or operation of the server connection that is created.

The `CREATE SERVER` statement creates an entry in the `mysql.servers` table that can later be used with the `CREATE TABLE` statement when creating a `FEDERATED` table. The options that you specify are used to populate the columns in the `mysql.servers` table. The table columns are `Server_name`, `Host`, `Db`, `Username`, `Password`, `Port` and `Socket`.

For example:

```
CREATE SERVER s
FOREIGN DATA WRAPPER mysql
OPTIONS (USER 'Remote', HOST '198.51.100.106', DATABASE 'test');
```

Be sure to specify all options necessary to establish a connection to the server. The user name, host name, and database name are mandatory. Other options might be required as well, such as password.

The data stored in the table can be used when creating a connection to a `FEDERATED` table:

```
CREATE TABLE t (s1 INT) ENGINE=FEDERATED CONNECTION='s';
```

For more information, see Section 18.8, “The FEDERATED Storage Engine”.

`CREATE SERVER` causes an implicit commit. See Section 15.3.3, “Statements That Cause an Implicit Commit”.

`CREATE SERVER` is not written to the binary log, regardless of the logging format that is in use.


### 15.1.23 CREATE SPATIAL REFERENCE SYSTEM Statement

```
CREATE OR REPLACE SPATIAL REFERENCE SYSTEM
    srid srs_attribute ...

CREATE SPATIAL REFERENCE SYSTEM
    [IF NOT EXISTS]
    srid srs_attribute ...

srs_attribute: {
    NAME 'srs_name'
  | DEFINITION 'definition'
  | ORGANIZATION 'org_name' IDENTIFIED BY org_id
  | DESCRIPTION 'description'
}

srid, org_id: 32-bit unsigned integer
```

This statement creates a [spatial reference system](spatial-reference-systems.html "13.4.5 Spatial Reference System Support") (SRS) definition and stores it in the data dictionary, and requires the `CREATE_SPATIAL_REFERENCE_SYSTEM` privilege (or `SUPER`). The resulting data dictionary entry can be inspected using the `INFORMATION_SCHEMA` `ST_SPATIAL_REFERENCE_SYSTEMS` table.

SRID values must be unique, so if neither `OR REPLACE` nor `IF NOT EXISTS` is specified, an error occurs if an SRS definition with the given *`srid`* value already exists.

With `CREATE OR REPLACE` syntax, any existing SRS definition with the same SRID value is replaced, unless the SRID value is used by some column in an existing table. In that case, an error occurs. For example:

```
mysql> CREATE OR REPLACE SPATIAL REFERENCE SYSTEM 4326 ...;
ERROR 3716 (SR005): Can't modify SRID 4326. There is at
least one column depending on it.
```

To identify which column or columns use the SRID, use this query, replacing 4326 with the SRID of the definition you are trying to create:

```
SELECT * FROM INFORMATION_SCHEMA.ST_GEOMETRY_COLUMNS WHERE SRS_ID=4326;
```

With `CREATE ... IF NOT EXISTS` syntax, any existing SRS definition with the same SRID value causes the new definition to be ignored and a warning occurs.

SRID values must be in the range of 32-bit unsigned integers, with these restrictions:

* SRID 0 is a valid SRID but cannot be used with [`CREATE SPATIAL REFERENCE SYSTEM`](create-spatial-reference-system.html "15.1.23 CREATE SPATIAL REFERENCE SYSTEM Statement").

* If the value is in a reserved SRID range, a warning occurs. Reserved ranges are [0, 32767] (reserved by EPSG), [60,000,000, 69,999,999] (reserved by EPSG), and [2,000,000,000, 2,147,483,647] (reserved by MySQL). EPSG stands for the [European Petroleum Survey Group](http://epsg.org).

* Users should not create SRSs with SRIDs in the reserved ranges. Doing so runs the risk of the SRIDs conflicting with future SRS definitions distributed with MySQL, with the result that the new system-provided SRSs are not installed for MySQL upgrades or that the user-defined SRSs are overwritten.

Attributes for the statement must satisfy these conditions:

* Attributes can be given in any order, but no attribute can be given more than once.

* The `NAME` and `DEFINITION` attributes are mandatory.

* The `NAME` *`srs_name`* attribute value must be unique. The combination of the `ORGANIZATION` *`org_name`* and *`org_id`* attribute values must be unique.

* The `NAME` *`srs_name`* attribute value and `ORGANIZATION` *`org_name`* attribute value cannot be empty or begin or end with whitespace.

* String values in attribute specifications cannot contain control characters, including newline.

* The following table shows the maximum lengths for string attribute values.

  **Table 15.6 CREATE SPATIAL REFERENCE SYSTEM Attribute Lengths**

  <table summary="Maximum string attribute lengths for CREATE SPATIAL REFERENCE SYSTEM"><col style="width: 25%"/><col style="width: 50%"/><thead><tr> <th>Attribute</th> <th>Maximum Length (characters)</th> </tr></thead><tbody><tr> <td><code>NAME</code></td> <td>80</td> </tr><tr> <td><code>DEFINITION</code></td> <td>4096</td> </tr><tr> <td><code>ORGANIZATION</code></td> <td>256</td> </tr><tr> <td><code>DESCRIPTION</code></td> <td>2048</td> </tr></tbody></table>

Here is an example [`CREATE SPATIAL REFERENCE SYSTEM`](create-spatial-reference-system.html "15.1.23 CREATE SPATIAL REFERENCE SYSTEM Statement") statement. The `DEFINITION` value is reformatted across multiple lines for readability. (For the statement to be legal, the value actually must be given on a single line.)

```
CREATE SPATIAL REFERENCE SYSTEM 4120
NAME 'Greek'
ORGANIZATION 'EPSG' IDENTIFIED BY 4120
DEFINITION
  'GEOGCS["Greek",DATUM["Greek",SPHEROID["Bessel 1841",
  6377397.155,299.1528128,AUTHORITY["EPSG","7004"]],
  AUTHORITY["EPSG","6120"]],PRIMEM["Greenwich",0,
  AUTHORITY["EPSG","8901"]],UNIT["degree",0.017453292519943278,
  AUTHORITY["EPSG","9122"]],AXIS["Lat",NORTH],AXIS["Lon",EAST],
  AUTHORITY["EPSG","4120"]]';
```

The grammar for SRS definitions is based on the grammar defined in *OpenGIS Implementation Specification: Coordinate Transformation Services*, Revision 1.00, OGC 01-009, January 12, 2001, Section 7.2. This specification is available at <http://www.opengeospatial.org/standards/ct>.

MySQL incorporates these changes to the specification:

* Only the `<horz cs>` production rule is implemented (that is, geographic and projected SRSs).

* There is an optional, nonstandard `<authority>` clause for `<parameter>`. This makes it possible to recognize projection parameters by authority instead of name.

* The specification does not make `AXIS` clauses mandatory in `GEOGCS` spatial reference system definitions. However, if there are no `AXIS` clauses, MySQL cannot determine whether a definition has axes in latitude-longitude order or longitude-latitude order. MySQL enforces the nonstandard requirement that each `GEOGCS` definition must include two `AXIS` clauses. One must be `NORTH` or `SOUTH`, and the other `EAST` or `WEST`. The `AXIS` clause order determines whether the definition has axes in latitude-longitude order or longitude-latitude order.

* SRS definitions may not contain newlines.

If an SRS definition specifies an authority code for the projection (which is recommended), an error occurs if the definition is missing mandatory parameters. In this case, the error message indicates what the problem is. The projection methods and mandatory parameters that MySQL supports are shown in Table 15.7, “Supported Spatial Reference System Projection Methods” and Table 15.8, “Spatial Reference System Projection Parameters”.

The following table shows the projection methods that MySQL supports. MySQL permits unknown projection methods but cannot check the definition for mandatory parameters and cannot convert spatial data to or from an unknown projection. For detailed explanations of how each projection works, including formulas, see [EPSG Guidance Note 7-2](http://www.epsg.org/Portals/0/373-07-2.pdf).

**Table 15.7 Supported Spatial Reference System Projection Methods**

<table summary="Supported spatial reference system projection codes, names, and mandatory EPSG parameters."><col style="width: 10%"/><col style="width: 45%"/><col style="width: 35%"/><thead><tr> <th scope="col">EPSG Code</th> <th scope="col">Projection Name</th> <th scope="col">Mandatory Parameters (EPSG Codes)</th> </tr></thead><tbody><tr> <th scope="row">1024</th> <td>Popular Visualisation Pseudo Mercator</td> <td>8801, 8802, 8806, 8807</td> </tr><tr> <th scope="row">1027</th> <td>Lambert Azimuthal Equal Area (Spherical)</td> <td>8801, 8802, 8806, 8807</td> </tr><tr> <th scope="row">1028</th> <td>Equidistant Cylindrical</td> <td>8823, 8802, 8806, 8807</td> </tr><tr> <th scope="row">1029</th> <th>Equidistant Cylindrical (Spherical)</th> <th>8823, 8802, 8806, 8807</th> </tr><tr> <th scope="row">1041</th> <th>Krovak (North Orientated)</th> <th>8811, 8833, 1036, 8818, 8819, 8806, 8807</th> </tr><tr> <th scope="row">1042</th> <th>Krovak Modified</th> <th>8811, 8833, 1036, 8818, 8819, 8806, 8807, 8617, 8618, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035</th> </tr><tr> <th scope="row">1043</th> <th>Krovak Modified (North Orientated)</th> <th>8811, 8833, 1036, 8818, 8819, 8806, 8807, 8617, 8618, 1026, 1027, 1028, 1029, 1030, 1031, 1032, 1033, 1034, 1035</th> </tr><tr> <th scope="row">1051</th> <th>Lambert Conic Conformal (2SP Michigan)</th> <th>8821, 8822, 8823, 8824, 8826, 8827, 1038</th> </tr><tr> <th scope="row">1052</th> <th>Colombia Urban</th> <th>8801, 8802, 8806, 8807, 1039</th> </tr><tr> <th scope="row">9801</th> <th>Lambert Conic Conformal (1SP)</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th scope="row">9802</th> <th>Lambert Conic Conformal (2SP)</th> <th>8821, 8822, 8823, 8824, 8826, 8827</th> </tr><tr> <th scope="row">9803</th> <th>Lambert Conic Conformal (2SP Belgium)</th> <th>8821, 8822, 8823, 8824, 8826, 8827</th> </tr><tr> <th scope="row">9804</th> <th>Mercator (variant A)</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th scope="row">9805</th> <th>Mercator (variant B)</th> <th>8823, 8802, 8806, 8807</th> </tr><tr> <th scope="row">9806</th> <th>Cassini-Soldner</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th scope="row">9807</th> <th>Transverse Mercator</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th scope="row">9808</th> <th>Transverse Mercator (South Orientated)</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th scope="row">9809</th> <th>Oblique Stereographic</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th scope="row">9810</th> <th>Polar Stereographic (variant A)</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th scope="row">9811</th> <th>New Zealand Map Grid</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th scope="row">9812</th> <th>Hotine Oblique Mercator (variant A)</th> <th>8811, 8812, 8813, 8814, 8815, 8806, 8807</th> </tr><tr> <th scope="row">9813</th> <th>Laborde Oblique Mercator</th> <th>8811, 8812, 8813, 8815, 8806, 8807</th> </tr><tr> <th scope="row">9815</th> <th>Hotine Oblique Mercator (variant B)</th> <th>8811, 8812, 8813, 8814, 8815, 8816, 8817</th> </tr><tr> <th scope="row">9816</th> <th>Tunisia Mining Grid</th> <th>8821, 8822, 8826, 8827</th> </tr><tr> <th scope="row">9817</th> <th>Lambert Conic Near-Conformal</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th scope="row">9818</th> <th>American Polyconic</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th scope="row">9819</th> <th>Krovak</th> <th>8811, 8833, 1036, 8818, 8819, 8806, 8807</th> </tr><tr> <th scope="row">9820</th> <th>Lambert Azimuthal Equal Area</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th scope="row">9822</th> <th>Albers Equal Area</th> <th>8821, 8822, 8823, 8824, 8826, 8827</th> </tr><tr> <th scope="row">9824</th> <th>Transverse Mercator Zoned Grid System</th> <th>8801, 8830, 8831, 8805, 8806, 8807</th> </tr><tr> <th scope="row">9826</th> <th>Lambert Conic Conformal (West Orientated)</th> <th>8801, 8802, 8805, 8806, 8807</th> </tr><tr> <th scope="row">9828</th> <th>Bonne (South Orientated)</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th scope="row">9829</th> <th>Polar Stereographic (variant B)</th> <th>8832, 8833, 8806, 8807</th> </tr><tr> <th scope="row">9830</th> <th>Polar Stereographic (variant C)</th> <th>8832, 8833, 8826, 8827</th> </tr><tr> <th scope="row">9831</th> <th>Guam Projection</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th scope="row">9832</th> <th>Modified Azimuthal Equidistant</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th scope="row">9833</th> <th>Hyperbolic Cassini-Soldner</th> <th>8801, 8802, 8806, 8807</th> </tr><tr> <th scope="row">9834</th> <th>Lambert Cylindrical Equal Area (Spherical)</th> <th>8823, 8802, 8806, 8807</th> </tr><tr> <th scope="row">9835</th> <td>Lambert Cylindrical Equal Area</td> <td>8823, 8802, 8806, 8807</td> </tr></tbody></table>

The following table shows the projection parameters that MySQL recognizes. Recognition occurs primarily by authority code. If there is no authority code, MySQL falls back to case-insensitive string matching on the parameter name. For details about each parameter, look it up by code in the [EPSG Online Registry](https://www.epsg-registry.org).

**Table 15.8 Spatial Reference System Projection Parameters**

<table summary="Spatial reference system projection codes, fallback names, and EPSG names."><col style="width: 10%"/><col style="width: 45%"/><col style="width: 35%"/><thead><tr> <th scope="col">EPSG Code</th> <th scope="col">Fallback Name (Recognized by MySQL)</th> <th scope="col">EPSG Name</th> </tr></thead><tbody><tr> <th scope="row">1026</th> <th>c1</th> <th>C1</th> </tr><tr> <th scope="row">1027</th> <th>c2</th> <th>C2</th> </tr><tr> <th scope="row">1028</th> <th>c3</th> <th>C3</th> </tr><tr> <th scope="row">1029</th> <th>c4</th> <th>C4</th> </tr><tr> <th scope="row">1030</th> <th>c5</th> <th>C5</th> </tr><tr> <th scope="row">1031</th> <th>c6</th> <th>C6</th> </tr><tr> <th scope="row">1032</th> <th>c7</th> <th>C7</th> </tr><tr> <th scope="row">1033</th> <th>c8</th> <th>C8</th> </tr><tr> <th scope="row">1034</th> <th>c9</th> <th>C9</th> </tr><tr> <th scope="row">1035</th> <th>c10</th> <th>C10</th> </tr><tr> <th scope="row">1036</th> <th>azimuth</th> <th>Co-latitude of cone axis</th> </tr><tr> <th scope="row">1038</th> <th>ellipsoid_scale_factor</th> <th>Ellipsoid scaling factor</th> </tr><tr> <th scope="row">1039</th> <th>projection_plane_height_at_origin</th> <th>Projection plane origin height</th> </tr><tr> <th scope="row">8617</th> <th>evaluation_point_ordinate_1</th> <th>Ordinate 1 of evaluation point</th> </tr><tr> <th scope="row">8618</th> <th>evaluation_point_ordinate_2</th> <th>Ordinate 2 of evaluation point</th> </tr><tr> <th scope="row">8801</th> <th>latitude_of_origin</th> <th>Latitude of natural origin</th> </tr><tr> <th scope="row">8802</th> <th>central_meridian</th> <th>Longitude of natural origin</th> </tr><tr> <th scope="row">8805</th> <th>scale_factor</th> <th>Scale factor at natural origin</th> </tr><tr> <th scope="row">8806</th> <th>false_easting</th> <th>False easting</th> </tr><tr> <th scope="row">8807</th> <th>false_northing</th> <th>False northing</th> </tr><tr> <th scope="row">8811</th> <th>latitude_of_center</th> <th>Latitude of projection centre</th> </tr><tr> <th scope="row">8812</th> <th>longitude_of_center</th> <th>Longitude of projection centre</th> </tr><tr> <th scope="row">8813</th> <th>azimuth</th> <th>Azimuth of initial line</th> </tr><tr> <th scope="row">8814</th> <th>rectified_grid_angle</th> <th>Angle from Rectified to Skew Grid</th> </tr><tr> <th scope="row">8815</th> <th>scale_factor</th> <th>Scale factor on initial line</th> </tr><tr> <th scope="row">8816</th> <th>false_easting</th> <th>Easting at projection centre</th> </tr><tr> <th scope="row">8817</th> <th>false_northing</th> <th>Northing at projection centre</th> </tr><tr> <th scope="row">8818</th> <th>pseudo_standard_parallel_1</th> <th>Latitude of pseudo standard parallel</th> </tr><tr> <th scope="row">8819</th> <th>scale_factor</th> <th>Scale factor on pseudo standard parallel</th> </tr><tr> <th scope="row">8821</th> <th>latitude_of_origin</th> <th>Latitude of false origin</th> </tr><tr> <th scope="row">8822</th> <th>central_meridian</th> <th>Longitude of false origin</th> </tr><tr> <th scope="row">8823</th> <th>standard_parallel_1, standard_parallel1</th> <th>Latitude of 1st standard parallel</th> </tr><tr> <th scope="row">8824</th> <th>standard_parallel_2, standard_parallel2</th> <th>Latitude of 2nd standard parallel</th> </tr><tr> <th scope="row">8826</th> <th>false_easting</th> <th>Easting at false origin</th> </tr><tr> <th scope="row">8827</th> <th>false_northing</th> <th>Northing at false origin</th> </tr><tr> <th scope="row">8830</th> <th>initial_longitude</th> <th>Initial longitude</th> </tr><tr> <th scope="row">8831</th> <th>zone_width</th> <th>Zone width</th> </tr><tr> <th scope="row">8832</th> <th>standard_parallel</th> <th>Latitude of standard parallel</th> </tr><tr> <th scope="row">8833</th> <td>longitude_of_center</td> <td>Longitude of origin</td> </tr></tbody></table>


### 15.1.24 CREATE TABLE Statement

```
CREATE [TEMPORARY] TABLE [IF NOT EXISTS] tbl_name
    (create_definition,...)
    [table_options]
    [partition_options]

CREATE [TEMPORARY] TABLE [IF NOT EXISTS] tbl_name
    [(create_definition,...)]
    [table_options]
    [partition_options]
    [IGNORE | REPLACE]
    [AS] query_expression

CREATE [TEMPORARY] TABLE [IF NOT EXISTS] tbl_name
    { LIKE old_tbl_name | (LIKE old_tbl_name) }

create_definition: {
    col_name column_definition
  | {INDEX | KEY} [index_name] [index_type] (key_part,...)
      [index_option] ...
  | {FULLTEXT | SPATIAL} [INDEX | KEY] [index_name] (key_part,...)
      [index_option] ...
  | [CONSTRAINT [symbol]] PRIMARY KEY
      [index_type] (key_part,...)
      [index_option] ...
  | [CONSTRAINT [symbol]] UNIQUE [INDEX | KEY]
      [index_name] [index_type] (key_part,...)
      [index_option] ...
  | [CONSTRAINT [symbol]] FOREIGN KEY
      [index_name] (col_name,...)
      reference_definition
  | check_constraint_definition
}

column_definition: {
    data_type [NOT NULL | NULL] [DEFAULT {literal | (expr)} ]
      [VISIBLE | INVISIBLE]
      [AUTO_INCREMENT] [UNIQUE [KEY]] [[PRIMARY] KEY]
      [COMMENT 'string']
      [COLLATE collation_name]
      [COLUMN_FORMAT {FIXED | DYNAMIC | DEFAULT}]
      [ENGINE_ATTRIBUTE [=] 'string']
      [SECONDARY_ENGINE_ATTRIBUTE [=] 'string']
      [STORAGE {DISK | MEMORY}]
      [reference_definition]
      [check_constraint_definition]
  | data_type
      [COLLATE collation_name]
      [GENERATED ALWAYS] AS (expr)
      [VIRTUAL | STORED] [NOT NULL | NULL]
      [VISIBLE | INVISIBLE]
      [UNIQUE [KEY]] [[PRIMARY] KEY]
      [COMMENT 'string']
      [reference_definition]
      [check_constraint_definition]
}

data_type:
    (see Chapter 13, Data Types)

key_part: {col_name [(length)] | (expr)} [ASC | DESC]

index_type:
    USING {BTREE | HASH}

index_option: {
    KEY_BLOCK_SIZE [=] value
  | index_type
  | WITH PARSER parser_name
  | COMMENT 'string'
  | {VISIBLE | INVISIBLE}
  |ENGINE_ATTRIBUTE [=] 'string'
  |SECONDARY_ENGINE_ATTRIBUTE [=] 'string'
}

check_constraint_definition:
    [CONSTRAINT [symbol]] CHECK (expr) [[NOT] ENFORCED]

reference_definition:
    REFERENCES tbl_name (key_part,...)
      [MATCH FULL | MATCH PARTIAL | MATCH SIMPLE]
      [ON DELETE reference_option]
      [ON UPDATE reference_option]

reference_option:
    RESTRICT | CASCADE | SET NULL | NO ACTION | SET DEFAULT

table_options:
    table_option [[,] table_option] ...

table_option: {
    AUTOEXTEND_SIZE [=] value
  | AUTO_INCREMENT [=] value
  | AVG_ROW_LENGTH [=] value
  | [DEFAULT] CHARACTER SET [=] charset_name
  | CHECKSUM [=] {0 | 1}
  | [DEFAULT] COLLATE [=] collation_name
  | COMMENT [=] 'string'
  | COMPRESSION [=] {'ZLIB' | 'LZ4' | 'NONE'}
  | CONNECTION [=] 'connect_string'
  | {DATA | INDEX} DIRECTORY [=] 'absolute path to directory'
  | DELAY_KEY_WRITE [=] {0 | 1}
  | ENCRYPTION [=] {'Y' | 'N'}
  | ENGINE [=] engine_name
  | ENGINE_ATTRIBUTE [=] 'string'
  | INSERT_METHOD [=] { NO | FIRST | LAST }
  | KEY_BLOCK_SIZE [=] value
  | MAX_ROWS [=] value
  | MIN_ROWS [=] value
  | PACK_KEYS [=] {0 | 1 | DEFAULT}
  | PASSWORD [=] 'string'
  | ROW_FORMAT [=] {DEFAULT | DYNAMIC | FIXED | COMPRESSED | REDUNDANT | COMPACT}
  | START TRANSACTION
  | SECONDARY_ENGINE_ATTRIBUTE [=] 'string'
  | STATS_AUTO_RECALC [=] {DEFAULT | 0 | 1}
  | STATS_PERSISTENT [=] {DEFAULT | 0 | 1}
  | STATS_SAMPLE_PAGES [=] value
  | tablespace_option
  | UNION [=] (tbl_name[,tbl_name]...)
}

partition_options:
    PARTITION BY
        { [LINEAR] HASH(expr)
        | [LINEAR] KEY [ALGORITHM={1 | 2}] (column_list)
        | RANGE{(expr) | COLUMNS(column_list)}
        | LIST{(expr) | COLUMNS(column_list)} }
    [PARTITIONS num]
    [SUBPARTITION BY
        { [LINEAR] HASH(expr)
        | [LINEAR] KEY [ALGORITHM={1 | 2}] (column_list) }
      [SUBPARTITIONS num]
    ]
    [(partition_definition [, partition_definition] ...)]

partition_definition:
    PARTITION partition_name
        [VALUES
            {LESS THAN {(expr | value_list) | MAXVALUE}
            |
            IN (value_list)}]
        [[STORAGE] ENGINE [=] engine_name]
        [COMMENT [=] 'string' ]
        [DATA DIRECTORY [=] 'data_dir']
        [INDEX DIRECTORY [=] 'index_dir']
        [MAX_ROWS [=] max_number_of_rows]
        [MIN_ROWS [=] min_number_of_rows]
        [TABLESPACE [=] tablespace_name]
        [(subpartition_definition [, subpartition_definition] ...)]

subpartition_definition:
    SUBPARTITION logical_name
        [[STORAGE] ENGINE [=] engine_name]
        [COMMENT [=] 'string' ]
        [DATA DIRECTORY [=] 'data_dir']
        [INDEX DIRECTORY [=] 'index_dir']
        [MAX_ROWS [=] max_number_of_rows]
        [MIN_ROWS [=] min_number_of_rows]
        [TABLESPACE [=] tablespace_name]

tablespace_option:
    TABLESPACE tablespace_name [STORAGE DISK]
  | [TABLESPACE tablespace_name] STORAGE MEMORY

query_expression:
    SELECT ...   (Some valid select or union statement)
```

`CREATE TABLE` creates a table with the given name. You must have the `CREATE` privilege for the table.

By default, tables are created in the default database, using the `InnoDB` storage engine. An error occurs if the table exists, if there is no default database, or if the database does not exist.

MySQL has no limit on the number of tables. The underlying file system may have a limit on the number of files that represent tables. Individual storage engines may impose engine-specific constraints. `InnoDB` permits up to 4 billion tables.

For information about the physical representation of a table, see Section 15.1.24.1, “Files Created by CREATE TABLE”.

There are several aspects to the [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") statement, described under the following topics in this section:

* Table Name
* Temporary Tables
* Table Cloning and Copying
* Column Data Types and Attributes
* Indexes, Foreign Keys, and CHECK Constraints
* Table Options
* Table Partitioning

#### Table Name

* `tbl_name`

  The table name can be specified as *`db_name.tbl_name`* to create the table in a specific database. This works regardless of whether there is a default database, assuming that the database exists. If you use quoted identifiers, quote the database and table names separately. For example, write `` `mydb`.`mytbl` ``, not `` `mydb.mytbl` ``.

  Rules for permissible table names are given in Section 11.2, “Schema Object Names”.

* `IF NOT EXISTS`

  Prevents an error from occurring if the table exists. However, there is no verification that the existing table has a structure identical to that indicated by the `CREATE TABLE` statement.

#### Temporary Tables

You can use the `TEMPORARY` keyword when creating a table. A `TEMPORARY` table is visible only within the current session, and is dropped automatically when the session is closed. For more information, see Section 15.1.24.2, “CREATE TEMPORARY TABLE Statement”.

#### Table Cloning and Copying

* `LIKE`

  Use `CREATE TABLE ... LIKE` to create an empty table based on the definition of another table, including any column attributes and indexes defined in the original table:

  ```
  CREATE TABLE new_tbl LIKE orig_tbl;
  ```

  For more information, see Section 15.1.24.3, “CREATE TABLE ... LIKE Statement”.

* `[AS] query_expression`

  To create one table from another, add a `SELECT` statement at the end of the `CREATE TABLE` statement:

  ```
  CREATE TABLE new_tbl AS SELECT * FROM orig_tbl;
  ```

  For more information, see Section 15.1.24.4, “CREATE TABLE ... SELECT Statement”.

* `IGNORE | REPLACE`

  The `IGNORE` and `REPLACE` options indicate how to handle rows that duplicate unique key values when copying a table using a `SELECT` statement.

  For more information, see Section 15.1.24.4, “CREATE TABLE ... SELECT Statement”.

#### Column Data Types and Attributes

There is a hard limit of 4096 columns per table, but the effective maximum may be less for a given table and depends on the factors discussed in Section 10.4.7, “Limits on Table Column Count and Row Size”.

* `data_type`

  *`data_type`* represents the data type in a column definition. For a full description of the syntax available for specifying column data types, as well as information about the properties of each type, see Chapter 13, *Data Types*.

  + `AUTO_INCREMENT` applies only to integer types.

  + Character data types (`CHAR`, `VARCHAR`, the `TEXT` types, `ENUM`, `SET`, and any synonyms) can include `CHARACTER SET` to specify the character set for the column. `CHARSET` is a synonym for `CHARACTER SET`. A collation for the character set can be specified with the `COLLATE` attribute, along with any other attributes. For details, see Chapter 12, *Character Sets, Collations, Unicode*. Example:

    ```
    CREATE TABLE t (c CHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin);
    ```

    MySQL 9.5 interprets length specifications in character column definitions in characters. Lengths for `BINARY` and `VARBINARY` are in bytes.

  + For `CHAR`, `VARCHAR`, `BINARY`, and `VARBINARY` columns, indexes can be created that use only the leading part of column values, using `col_name(length)` syntax to specify an index prefix length. `BLOB` and `TEXT` columns also can be indexed, but a prefix length *must* be given. Prefix lengths are given in characters for nonbinary string types and in bytes for binary string types. That is, index entries consist of the first *`length`* characters of each column value for `CHAR`, `VARCHAR`, and `TEXT` columns, and the first *`length`* bytes of each column value for `BINARY`, `VARBINARY`, and `BLOB` columns. Indexing only a prefix of column values like this can make the index file much smaller. For additional information about index prefixes, see Section 15.1.18, “CREATE INDEX Statement”.

    Only the `InnoDB` and `MyISAM` storage engines support indexing on `BLOB` and `TEXT` columns. For example:

    ```
    CREATE TABLE test (blob_col BLOB, INDEX(blob_col(10)));
    ```

    If a specified index prefix exceeds the maximum column data type size, [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") handles the index as follows:

    - For a nonunique index, either an error occurs (if strict SQL mode is enabled), or the index length is reduced to lie within the maximum column data type size and a warning is produced (if strict SQL mode is not enabled).

    - For a unique index, an error occurs regardless of SQL mode because reducing the index length might enable insertion of nonunique entries that do not meet the specified uniqueness requirement.

  + `JSON` columns cannot be indexed. You can work around this restriction by creating an index on a generated column that extracts a scalar value from the `JSON` column. See Indexing a Generated Column to Provide a JSON Column Index, for a detailed example.

* `NOT NULL | NULL`

  If neither `NULL` nor `NOT NULL` is specified, the column is treated as though `NULL` had been specified.

  In MySQL 9.5, only the `InnoDB`, `MyISAM`, and `MEMORY` storage engines support indexes on columns that can have `NULL` values. In other cases, you must declare indexed columns as `NOT NULL` or an error results.

* `DEFAULT`

  Specifies a default value for a column. For more information about default value handling, including the case that a column definition includes no explicit `DEFAULT` value, see Section 13.6, “Data Type Default Values”.

  If the `NO_ZERO_DATE` or `NO_ZERO_IN_DATE` SQL mode is enabled and a date-valued default is not correct according to that mode, `CREATE TABLE` produces a warning if strict SQL mode is not enabled and an error if strict mode is enabled. For example, with `NO_ZERO_IN_DATE` enabled, `c1 DATE DEFAULT '2010-00-00'` produces a warning.

* `VISIBLE`, `INVISIBLE`

  Specify column visibility. The default is `VISIBLE` if neither keyword is present. A table must have at least one visible column. Attempting to make all columns invisible produces an error. For more information, see Section 15.1.24.10, “Invisible Columns”.

* `AUTO_INCREMENT`

  An integer column can have the additional attribute `AUTO_INCREMENT`. When you insert a value of `NULL` (recommended) or `0` into an indexed `AUTO_INCREMENT` column, the column is set to the next sequence value. Typically this is `value+1`, where *`value`* is the largest value for the column currently in the table. `AUTO_INCREMENT` sequences begin with `1`.

  To retrieve an `AUTO_INCREMENT` value after inserting a row, use the `LAST_INSERT_ID()` SQL function or the `mysql_insert_id()` C API function. See Section 14.15, “Information Functions”, and mysql_insert_id().

  If the `NO_AUTO_VALUE_ON_ZERO` SQL mode is enabled, you can store `0` in `AUTO_INCREMENT` columns as `0` without generating a new sequence value. See Section 7.1.11, “Server SQL Modes”.

  There can be only one `AUTO_INCREMENT` column per table, it must be indexed, and it cannot have a `DEFAULT` value. An `AUTO_INCREMENT` column works properly only if it contains only positive values. Inserting a negative number is regarded as inserting a very large positive number. This is done to avoid precision problems when numbers “wrap” over from positive to negative and also to ensure that you do not accidentally get an `AUTO_INCREMENT` column that contains `0`.

  For `MyISAM` tables, you can specify an `AUTO_INCREMENT` secondary column in a multiple-column key. See Section 5.6.9, “Using AUTO_INCREMENT”.

  To make MySQL compatible with some ODBC applications, you can find the `AUTO_INCREMENT` value for the last inserted row with the following query:

  ```
  SELECT * FROM tbl_name WHERE auto_col IS NULL
  ```

  This method requires that `sql_auto_is_null` variable is not set to 0. See Section 7.1.8, “Server System Variables”.

  For information about `InnoDB` and `AUTO_INCREMENT`, see Section 17.6.1.6, “AUTO_INCREMENT Handling in InnoDB”. For information about `AUTO_INCREMENT` and MySQL Replication, see Section 19.5.1.1, “Replication and AUTO_INCREMENT”.

* `COMMENT`

  A comment for a column can be specified with the `COMMENT` option, up to 1024 characters long. The comment is displayed by the [`SHOW CREATE TABLE`](show-create-table.html "15.7.7.12 SHOW CREATE TABLE Statement") and [`SHOW FULL COLUMNS`](show-columns.html "15.7.7.6 SHOW COLUMNS Statement") statements. It is also shown in the `COLUMN_COMMENT` column of the Information Schema `COLUMNS` table.

* `COLUMN_FORMAT`

  In NDB Cluster, it is also possible to specify a data storage format for individual columns of `NDB` tables using `COLUMN_FORMAT`. Permissible column formats are `FIXED`, `DYNAMIC`, and `DEFAULT`. `FIXED` is used to specify fixed-width storage, `DYNAMIC` permits the column to be variable-width, and `DEFAULT` causes the column to use fixed-width or variable-width storage as determined by the column's data type (possibly overridden by a `ROW_FORMAT` specifier).

  For `NDB` tables, the default value for `COLUMN_FORMAT` is `FIXED`.

  In NDB Cluster, the maximum possible offset for a column defined with `COLUMN_FORMAT=FIXED` is 8188 bytes. For more information and possible workarounds, see Section 25.2.7.5, “Limits Associated with Database Objects in NDB Cluster”.

  `COLUMN_FORMAT` currently has no effect on columns of tables using storage engines other than `NDB`. MySQL 9.5 silently ignores `COLUMN_FORMAT`.

* `ENGINE_ATTRIBUTE` and `SECONDARY_ENGINE_ATTRIBUTE` options are used to specify column attributes for primary and secondary storage engines. The options are reserved for future use.

  The value assigned to this option is a string literal containing a valid JSON document or an empty string (''). Invalid JSON is rejected.

  ```
  CREATE TABLE t1 (c1 INT ENGINE_ATTRIBUTE='{"key":"value"}');
  ```

  `ENGINE_ATTRIBUTE` and `SECONDARY_ENGINE_ATTRIBUTE` values can be repeated without error. In this case, the last specified value is used.

  `ENGINE_ATTRIBUTE` and `SECONDARY_ENGINE_ATTRIBUTE` values are not checked by the server, nor are they cleared when the table's storage engine is changed.

* `STORAGE`

  For `NDB` tables, it is possible to specify whether the column is stored on disk or in memory by using a `STORAGE` clause. `STORAGE DISK` causes the column to be stored on disk, and `STORAGE MEMORY` causes in-memory storage to be used. The `CREATE TABLE` statement used must still include a `TABLESPACE` clause:

  ```
  mysql> CREATE TABLE t1 (
      ->     c1 INT STORAGE DISK,
      ->     c2 INT STORAGE MEMORY
      -> ) ENGINE NDB;
  ERROR 1005 (HY000): Can't create table 'c.t1' (errno: 140)

  mysql> CREATE TABLE t1 (
      ->     c1 INT STORAGE DISK,
      ->     c2 INT STORAGE MEMORY
      -> ) TABLESPACE ts_1 ENGINE NDB;
  Query OK, 0 rows affected (1.06 sec)
  ```

  For `NDB` tables, `STORAGE DEFAULT` is equivalent to `STORAGE MEMORY`.

  The `STORAGE` clause has no effect on tables using storage engines other than `NDB`. The `STORAGE` keyword is supported only in the build of **mysqld** that is supplied with NDB Cluster; it is not recognized in any other version of MySQL, where any attempt to use the `STORAGE` keyword causes a syntax error.

* `GENERATED ALWAYS`

  Used to specify a generated column expression. For information about [generated columns](/doc/refman/8.4/en/glossary.html#glos_generated_column), see Section 15.1.24.8, “CREATE TABLE and Generated Columns”.

  [Stored generated columns](/doc/refman/8.4/en/glossary.html#glos_stored_generated_column) can be indexed. `InnoDB` supports secondary indexes on [virtual generated columns](/doc/refman/8.4/en/glossary.html#glos_virtual_generated_column). See Section 15.1.24.9, “Secondary Indexes and Generated Columns”.

#### Indexes, Foreign Keys, and CHECK Constraints

Several keywords apply to creation of indexes, foreign keys, and `CHECK` constraints. For general background in addition to the following descriptions, see Section 15.1.18, “CREATE INDEX Statement”, Section 15.1.24.5, “FOREIGN KEY Constraints”, and Section 15.1.24.6, “CHECK Constraints”.

* `CONSTRAINT symbol`

  The `CONSTRAINT symbol` clause may be given to name a constraint. If the clause is not given, or a *`symbol`* is not included following the `CONSTRAINT` keyword, MySQL automatically generates a constraint name, with the exception noted below. The *`symbol`* value, if used, must be unique per schema (database), per constraint type. A duplicate *`symbol`* results in an error. See also the discussion about length limits of generated constraint identifiers at Section 11.2.1, “Identifier Length Limits”.

  Note

  If the `CONSTRAINT symbol` clause is not given in a foreign key definition, or a *`symbol`* is not included following the `CONSTRAINT` keyword, MySQL automatically generates a constraint name.

  The SQL standard specifies that all types of constraints (primary key, unique index, foreign key, check) belong to the same namespace. In MySQL, each constraint type has its own namespace per schema. Consequently, names for each type of constraint must be unique per schema, but constraints of different types can have the same name.

* `PRIMARY KEY`

  A unique index where all key columns must be defined as `NOT NULL`. If they are not explicitly declared as `NOT NULL`, MySQL declares them so implicitly (and silently). A table can have only one `PRIMARY KEY`. The name of a `PRIMARY KEY` is always `PRIMARY`, which thus cannot be used as the name for any other kind of index.

  If you do not have a `PRIMARY KEY` and an application asks for the `PRIMARY KEY` in your tables, MySQL returns the first `UNIQUE` index that has no `NULL` columns as the `PRIMARY KEY`.

  In `InnoDB` tables, keep the `PRIMARY KEY` short to minimize storage overhead for secondary indexes. Each secondary index entry contains a copy of the primary key columns for the corresponding row. (See Section 17.6.2.1, “Clustered and Secondary Indexes”.)

  In the created table, a `PRIMARY KEY` is placed first, followed by all `UNIQUE` indexes, and then the nonunique indexes. This helps the MySQL optimizer to prioritize which index to use and also more quickly to detect duplicated `UNIQUE` keys.

  A `PRIMARY KEY` can be a multiple-column index. However, you cannot create a multiple-column index using the `PRIMARY KEY` key attribute in a column specification. Doing so only marks that single column as primary. You must use a separate `PRIMARY KEY(key_part, ...)` clause.

  If a table has a `PRIMARY KEY` or `UNIQUE NOT NULL` index that consists of a single column that has an integer type, you can use `_rowid` to refer to the indexed column in `SELECT` statements, as described in Unique Indexes.

  In MySQL, the name of a `PRIMARY KEY` is `PRIMARY`. For other indexes, if you do not assign a name, the index is assigned the same name as the first indexed column, with an optional suffix (`_2`, `_3`, `...`) to make it unique. You can see index names for a table using `SHOW INDEX FROM tbl_name`. See Section 15.7.7.24, “SHOW INDEX Statement”.

* `KEY | INDEX`

  `KEY` is normally a synonym for `INDEX`. The key attribute `PRIMARY KEY` can also be specified as just `KEY` when given in a column definition. This was implemented for compatibility with other database systems.

* `UNIQUE`

  A `UNIQUE` index creates a constraint such that all values in the index must be distinct. An error occurs if you try to add a new row with a key value that matches an existing row. For all engines, a `UNIQUE` index permits multiple `NULL` values for columns that can contain `NULL`. If you specify a prefix value for a column in a `UNIQUE` index, the column values must be unique within the prefix length.

  If a table has a `PRIMARY KEY` or `UNIQUE NOT NULL` index that consists of a single column that has an integer type, you can use `_rowid` to refer to the indexed column in `SELECT` statements, as described in Unique Indexes.

* `FULLTEXT`

  A `FULLTEXT` index is a special type of index used for full-text searches. Only the `InnoDB` and `MyISAM` storage engines support `FULLTEXT` indexes. They can be created only from `CHAR`, `VARCHAR`, and `TEXT` columns. Indexing always happens over the entire column; column prefix indexing is not supported and any prefix length is ignored if specified. See Section 14.9, “Full-Text Search Functions”, for details of operation. A `WITH PARSER` clause can be specified as an *`index_option`* value to associate a parser plugin with the index if full-text indexing and searching operations need special handling. This clause is valid only for `FULLTEXT` indexes. `InnoDB` and `MyISAM` support full-text parser plugins. See Full-Text Parser Plugins and Writing Full-Text Parser Plugins for more information.

* `SPATIAL`

  You can create `SPATIAL` indexes on spatial data types. Spatial types are supported only for `InnoDB` and `MyISAM` tables, and indexed columns must be declared as `NOT NULL`. See Section 13.4, “Spatial Data Types”.

* `FOREIGN KEY`

  MySQL supports foreign keys, which let you cross-reference related data across tables, and foreign key constraints, which help keep this spread-out data consistent. For definition and option information, see *`reference_definition`*, and *`reference_option`*.

  Partitioned tables employing the `InnoDB` storage engine do not support foreign keys. See Section 26.6, “Restrictions and Limitations on Partitioning”, for more information.

* `CHECK`

  The `CHECK` clause enables the creation of constraints to be checked for data values in table rows. See Section 15.1.24.6, “CHECK Constraints”.

* `key_part`

  + A *`key_part`* specification can end with `ASC` or `DESC` to specify whether index values are stored in ascending or descending order. The default is ascending if no order specifier is given.

  + Prefixes, defined by the *`length`* attribute, can be up to 767 bytes long for `InnoDB` tables that use the `REDUNDANT` or `COMPACT` row format. The prefix length limit is 3072 bytes for `InnoDB` tables that use the `DYNAMIC` or `COMPRESSED` row format. For `MyISAM` tables, the prefix length limit is 1000 bytes.

    Prefix *limits* are measured in bytes. However, prefix *lengths* for index specifications in [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement"), [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement"), and [`CREATE INDEX`](create-index.html "15.1.18 CREATE INDEX Statement") statements are interpreted as number of characters for nonbinary string types (`CHAR`, `VARCHAR`, `TEXT`) and number of bytes for binary string types (`BINARY`, `VARBINARY`, `BLOB`). Take this into account when specifying a prefix length for a nonbinary string column that uses a multibyte character set.

  + The *`expr`* for a *`key_part`* specification can take the form `(CAST json_path AS type ARRAY)` to create a multi-valued index on a `JSON` column. Multi-Valued Indexes, provides detailed information regarding creation of, usage of, and restrictions and limitations on multi-valued indexes.

* `index_type`

  Some storage engines permit you to specify an index type when creating an index. The syntax for the *`index_type`* specifier is `USING type_name`.

  Example:

  ```
  CREATE TABLE lookup
    (id INT, INDEX USING BTREE (id)
  ) ENGINE = MEMORY;
  ```

  The preferred position for `USING` is after the index column list. It can be given before the column list, but support for use of the option in that position is deprecated and you should expect it to be removed in a future MySQL release.

* `index_option`

  *`index_option`* values specify additional options for an index.

  + `KEY_BLOCK_SIZE`

    For `MyISAM` tables, `KEY_BLOCK_SIZE` optionally specifies the size in bytes to use for index key blocks. The value is treated as a hint; a different size could be used if necessary. A `KEY_BLOCK_SIZE` value specified for an individual index definition overrides the table-level `KEY_BLOCK_SIZE` value.

    For information about the table-level `KEY_BLOCK_SIZE` attribute, see Table Options.

  + `WITH PARSER`

    The `WITH PARSER` option can be used only with `FULLTEXT` indexes. It associates a parser plugin with the index if full-text indexing and searching operations need special handling. `InnoDB` and `MyISAM` support full-text parser plugins. If you have a `MyISAM` table with an associated full-text parser plugin, you can convert the table to `InnoDB` using `ALTER TABLE`.

  + `COMMENT`

    Index definitions can include an optional comment of up to 1024 characters.

    You can set the `InnoDB` `MERGE_THRESHOLD` value for an individual index using the `index_option` `COMMENT` clause. See Section 17.8.11, “Configuring the Merge Threshold for Index Pages”.

  + `VISIBLE`, `INVISIBLE`

    Specify index visibility. Indexes are visible by default. An invisible index is not used by the optimizer. Specification of index visibility applies to indexes other than primary keys (either explicit or implicit). For more information, see Section 10.3.12, “Invisible Indexes”.

  + `ENGINE_ATTRIBUTE` and `SECONDARY_ENGINE_ATTRIBUTE` options are used to specify index attributes for primary and secondary storage engines. The options are reserved for future use.

  For more information about permissible *`index_option`* values, see Section 15.1.18, “CREATE INDEX Statement”. For more information about indexes, see Section 10.3.1, “How MySQL Uses Indexes”.

* `reference_definition`

  For *`reference_definition`* syntax details and examples, see Section 15.1.24.5, “FOREIGN KEY Constraints”.

  `InnoDB` and `NDB` tables support checking of foreign key constraints. The columns of the referenced table must always be explicitly named. Both `ON DELETE` and `ON UPDATE` actions on foreign keys are supported. For more detailed information and examples, see Section 15.1.24.5, “FOREIGN KEY Constraints”.

  For other storage engines, MySQL Server parses and ignores the `FOREIGN KEY` syntax in `CREATE TABLE` statements.

  Important

  For users familiar with the ANSI/ISO SQL Standard, please note that no storage engine, including `InnoDB`, recognizes or enforces the `MATCH` clause used in referential integrity constraint definitions. Use of an explicit `MATCH` clause does not have the specified effect, and also causes `ON DELETE` and `ON UPDATE` clauses to be ignored. For these reasons, specifying `MATCH` should be avoided.

  The `MATCH` clause in the SQL standard controls how `NULL` values in a composite (multiple-column) foreign key are handled when comparing to a primary key. `InnoDB` essentially implements the semantics defined by `MATCH SIMPLE`, which permit a foreign key to be all or partially `NULL`. In that case, the (child table) row containing such a foreign key is permitted to be inserted, and does not match any row in the referenced (parent) table. It is possible to implement other semantics using triggers.

  Additionally, MySQL requires that the referenced columns be indexed for performance. However, `InnoDB` does not enforce any requirement that the referenced columns be declared `UNIQUE` or `NOT NULL`. The handling of foreign key references to nonunique keys or keys that contain `NULL` values is not well defined for operations such as `UPDATE` or `DELETE CASCADE`. You are advised to use foreign keys that reference only keys that are both `UNIQUE` (or `PRIMARY`) and `NOT NULL`.

  MySQL accepts “inline `REFERENCES` specifications” (as defined in the SQL standard) where the references are defined as part of the column specification. MySQL also accepts implicit references to the parent table's primary key. For more information, see Section 15.1.24.5, “FOREIGN KEY Constraints”, as well as Section 1.7.2.3, “FOREIGN KEY Constraint Differences”.

* `reference_option`

  For information about the `RESTRICT`, `CASCADE`, `SET NULL`, `NO ACTION`, and `SET DEFAULT` options, see Section 15.1.24.5, “FOREIGN KEY Constraints”.

#### Table Options

Table options are used to optimize the behavior of the table. In most cases, you do not have to specify any of them. These options apply to all storage engines unless otherwise indicated. Options that do not apply to a given storage engine may be accepted and remembered as part of the table definition. Such options then apply if you later use `ALTER TABLE` to convert the table to use a different storage engine.

* `ENGINE`

  Specifies the storage engine for the table, using one of the names shown in the following table. The engine name can be unquoted or quoted. The quoted name `'DEFAULT'` is recognized but ignored.

  <table summary="Storage engine names permitted for the ENGINE table option and a description of each engine."><col style="width: 25%"/><col style="width: 70%"/><thead><tr> <th>Storage Engine</th> <th>Description</th> </tr></thead><tbody><tr> <td><code>InnoDB</code></td> <td>Transaction-safe tables with row locking and foreign keys. The default storage engine for new tables. See Chapter 17, <i>The InnoDB Storage Engine</i>, and in particular Section 17.1, “Introduction to InnoDB” if you have MySQL experience but are new to <code>InnoDB</code>.</td> </tr><tr> <td><code>MyISAM</code></td> <td>The binary portable storage engine that is primarily used for read-only or read-mostly workloads. See Section 18.2, “The MyISAM Storage Engine”.</td> </tr><tr> <td><code>MEMORY</code></td> <td>The data for this storage engine is stored only in memory. See Section 18.3, “The MEMORY Storage Engine”.</td> </tr><tr> <td><code>CSV</code></td> <td>Tables that store rows in comma-separated values format. See Section 18.4, “The CSV Storage Engine”.</td> </tr><tr> <td><code>ARCHIVE</code></td> <td>The archiving storage engine. See Section 18.5, “The ARCHIVE Storage Engine”.</td> </tr><tr> <td><code>EXAMPLE</code></td> <td>An example engine. See Section 18.9, “The EXAMPLE Storage Engine”.</td> </tr><tr> <td><code>FEDERATED</code></td> <td>Storage engine that accesses remote tables. See Section 18.8, “The FEDERATED Storage Engine”.</td> </tr><tr> <td><code>HEAP</code></td> <td>This is a synonym for <code>MEMORY</code>.</td> </tr><tr> <td><code>MERGE</code></td> <td>A collection of <code>MyISAM</code> tables used as one table. Also known as <code>MRG_MyISAM</code>. See Section 18.7, “The MERGE Storage Engine”.</td> </tr><tr> <td><code>NDB</code></td> <td>Clustered, fault-tolerant, memory-based tables, supporting transactions and foreign keys. Also known as <code>NDBCLUSTER</code>. See Chapter 25, <i>MySQL NDB Cluster 9.5</i>.</td> </tr></tbody></table>

  By default, if a storage engine is specified that is not available, the statement fails with an error. You can override this behavior by removing `NO_ENGINE_SUBSTITUTION` from the server SQL mode (see Section 7.1.11, “Server SQL Modes”) so that MySQL allows substitution of the specified engine with the default storage engine instead. Normally in such cases, this is `InnoDB`, which is the default value for the `default_storage_engine` system variable. When `NO_ENGINE_SUBSTITUTION` is disabled, a warning occurs if the storage engine specification is not honored.

* `AUTOEXTEND_SIZE`

  Defines the amount by which `InnoDB` extends the size of the tablespace when it becomes full. The setting must be a multiple of 4MB. The default setting is 0, which causes the tablespace to be extended according to the implicit default behavior. For more information, see Section 17.6.3.9, “Tablespace AUTOEXTEND_SIZE Configuration”.

* `AUTO_INCREMENT`

  The initial `AUTO_INCREMENT` value for the table. In MySQL 9.5, this works for `MyISAM`, `MEMORY`, `InnoDB`, and `ARCHIVE` tables. To set the first auto-increment value for engines that do not support the `AUTO_INCREMENT` table option, insert a “dummy” row with a value one less than the desired value after creating the table, and then delete the dummy row.

  For engines that support the `AUTO_INCREMENT` table option in `CREATE TABLE` statements, you can also use `ALTER TABLE tbl_name AUTO_INCREMENT = N` to reset the `AUTO_INCREMENT` value. The value cannot be set lower than the maximum value currently in the column.

* `AVG_ROW_LENGTH`

  An approximation of the average row length for your table. You need to set this only for large tables with variable-size rows.

  When you create a `MyISAM` table, MySQL uses the product of the `MAX_ROWS` and `AVG_ROW_LENGTH` options to decide how big the resulting table is. If you don't specify either option, the maximum size for `MyISAM` data and index files is 256TB by default. (If your operating system does not support files that large, table sizes are constrained by the file size limit.) If you want to keep down the pointer sizes to make the index smaller and faster and you don't really need big files, you can decrease the default pointer size by setting the `myisam_data_pointer_size` system variable. (See Section 7.1.8, “Server System Variables”.) If you want all your tables to be able to grow above the default limit and are willing to have your tables slightly slower and larger than necessary, you can increase the default pointer size by setting this variable. Setting the value to 7 permits table sizes up to 65,536TB.

* `[DEFAULT] CHARACTER SET`

  Specifies a default character set for the table. `CHARSET` is a synonym for `CHARACTER SET`. If the character set name is `DEFAULT`, the database character set is used.

* `CHECKSUM`

  Set this to 1 if you want MySQL to maintain a live checksum for all rows (that is, a checksum that MySQL updates automatically as the table changes). This makes the table a little slower to update, but also makes it easier to find corrupted tables. The [`CHECKSUM TABLE`](checksum-table.html "15.7.3.3 CHECKSUM TABLE Statement") statement reports the checksum. (`MyISAM` only.)

* `[DEFAULT] COLLATE`

  Specifies a default collation for the table.

* `COMMENT`

  A comment for the table, up to 2048 characters long.

  You can set the `InnoDB` `MERGE_THRESHOLD` value for a table using the `table_option` `COMMENT` clause. See Section 17.8.11, “Configuring the Merge Threshold for Index Pages”.

  **Setting NDB_TABLE options.**

  The table comment in a `CREATE TABLE` that creates an `NDB` table or an `ALTER TABLE` statement which alters one can also be used to specify one to four of the `NDB_TABLE` options `NOLOGGING`, `READ_BACKUP`, `PARTITION_BALANCE`, or `FULLY_REPLICATED` as a set of name-value pairs, separated by commas if need be, immediately following the string `NDB_TABLE=` that begins the quoted comment text. An example statement using this syntax is shown here (emphasized text):

  ```
  CREATE TABLE t1 (
      c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      c2 VARCHAR(100),
      c3 VARCHAR(100) )
  ENGINE=NDB
  COMMENT="NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE";
  ```

  Spaces are not permitted within the quoted string. The string is case-insensitive.

  The comment is displayed as part of the output of `SHOW CREATE TABLE`. The text of the comment is also available as the TABLE_COMMENT column of the MySQL Information Schema `TABLES` table.

  This comment syntax is also supported with `ALTER TABLE` statements for `NDB` tables. Keep in mind that a table comment used with `ALTER TABLE` replaces any existing comment which the table might have had previously.

  Setting the `MERGE_THRESHOLD` option in table comments is not supported for `NDB` tables (it is ignored).

  For complete syntax information and examples, see Section 15.1.24.12, “Setting NDB Comment Options”.

* `COMPRESSION`

  The compression algorithm used for page level compression for `InnoDB` tables. Supported values include `Zlib`, `LZ4`, and `None`. The `COMPRESSION` attribute was introduced with the transparent page compression feature. Page compression is only supported with `InnoDB` tables that reside in file-per-table tablespaces, and is only available on Linux and Windows platforms that support sparse files and hole punching. For more information, see Section 17.9.2, “InnoDB Page Compression”.

* `CONNECTION`

  The connection string for a `FEDERATED` table.

  Note

  Older versions of MySQL used a `COMMENT` option for the connection string.

* `DATA DIRECTORY`, `INDEX DIRECTORY`

  For `InnoDB`, the `DATA DIRECTORY='directory'` clause permits creating tables outside of the data directory. The `innodb_file_per_table` variable must be enabled to use the `DATA DIRECTORY` clause. The full directory path must be specified, and known to `InnoDB`. For more information, see Section 17.6.1.2, “Creating Tables Externally”.

  When creating `MyISAM` tables, you can use the `DATA DIRECTORY='directory'` clause, the `INDEX DIRECTORY='directory'` clause, or both. They specify where to put a `MyISAM` table's data file and index file, respectively. Unlike `InnoDB` tables, MySQL does not create subdirectories that correspond to the database name when creating a `MyISAM` table with a `DATA DIRECTORY` or `INDEX DIRECTORY` option. Files are created in the directory that is specified.

  You must have the `FILE` privilege to use the `DATA DIRECTORY` or `INDEX DIRECTORY` table option.

  Important

  Table-level `DATA DIRECTORY` and `INDEX DIRECTORY` options are ignored for partitioned tables. (Bug #32091)

  These options work only when you are not using the `--skip-symbolic-links` option. Your operating system must also have a working, thread-safe `realpath()` call. See Section 10.12.2.2, “Using Symbolic Links for MyISAM Tables on Unix”, for more complete information.

  If a `MyISAM` table is created with no `DATA DIRECTORY` option, the `.MYD` file is created in the database directory. By default, if `MyISAM` finds an existing `.MYD` file in this case, it overwrites it. The same applies to `.MYI` files for tables created with no `INDEX DIRECTORY` option. To suppress this behavior, start the server with the `--keep_files_on_create` option, in which case `MyISAM` does not overwrite existing files and returns an error instead.

  If a `MyISAM` table is created with a `DATA DIRECTORY` or `INDEX DIRECTORY` option and an existing `.MYD` or `.MYI` file is found, `MyISAM` always returns an error, and does not overwrite a file in the specified directory.

  Important

  You cannot use path names that contain the MySQL data directory with `DATA DIRECTORY` or `INDEX DIRECTORY`. This includes partitioned tables and individual table partitions. (See Bug #32167.)

* `DELAY_KEY_WRITE`

  Set this to 1 if you want to delay key updates for the table until the table is closed. See the description of the `delay_key_write` system variable in Section 7.1.8, “Server System Variables”. (`MyISAM` only.)

* `ENCRYPTION`

  The `ENCRYPTION` clause enables or disables page-level data encryption for an `InnoDB` table. A keyring plugin must be installed and configured before encryption can be enabled. The `ENCRYPTION` clause can be specified when creating a table in an a file-per-table tablespace, or when creating a table in a general tablespace.

  The `ENCRYPTION` option is supported only by the `InnoDB` storage engine; thus it works only if the default storage engine is `InnoDB`, or if the `CREATE TABLE` statement also specifies `ENGINE=InnoDB`. Otherwise the statement is rejected with `ER_CHECK_NOT_IMPLEMENTED`.

  A table inherits the default schema encryption if an `ENCRYPTION` clause is not specified. If the `table_encryption_privilege_check` variable is enabled, the `TABLE_ENCRYPTION_ADMIN` privilege is required to create a table with an `ENCRYPTION` clause setting that differs from the default schema encryption. When creating a table in a general tablespace, table and tablespace encryption must match.

  Specifying an `ENCRYPTION` clause with a value other than `'N'` or `''` is not permitted when using a storage engine that does not support encryption.

  For more information, see Section 17.13, “InnoDB Data-at-Rest Encryption”.

* The `ENGINE_ATTRIBUTE` and `SECONDARY_ENGINE_ATTRIBUTE` options are used to specify table attributes for primary and secondary storage engines. The options are reserved for future use.

  The value assigned to either of these options must be a string literal containing a valid JSON document or an empty string (''). Invalid JSON is rejected.

  ```
  CREATE TABLE t1 (c1 INT) ENGINE_ATTRIBUTE='{"key":"value"}';
  ```

  `ENGINE_ATTRIBUTE` and `SECONDARY_ENGINE_ATTRIBUTE` values can be repeated without error. In this case, the last specified value is used.

  `ENGINE_ATTRIBUTE` and `SECONDARY_ENGINE_ATTRIBUTE` values are not checked by the server, nor are they cleared when the table's storage engine is changed.

* `INSERT_METHOD`

  If you want to insert data into a `MERGE` table, you must specify with `INSERT_METHOD` the table into which the row should be inserted. `INSERT_METHOD` is an option useful for `MERGE` tables only. Use a value of `FIRST` or `LAST` to have inserts go to the first or last table, or a value of `NO` to prevent inserts. See Section 18.7, “The MERGE Storage Engine”.

* `KEY_BLOCK_SIZE`

  For `MyISAM` tables, `KEY_BLOCK_SIZE` optionally specifies the size in bytes to use for index key blocks. The value is treated as a hint; a different size could be used if necessary. A `KEY_BLOCK_SIZE` value specified for an individual index definition overrides the table-level `KEY_BLOCK_SIZE` value.

  For `InnoDB` tables, `KEY_BLOCK_SIZE` specifies the page size in kilobytes to use for compressed `InnoDB` tables. The `KEY_BLOCK_SIZE` value is treated as a hint; a different size could be used by `InnoDB` if necessary. `KEY_BLOCK_SIZE` can only be less than or equal to the `innodb_page_size` value. A value of 0 represents the default compressed page size, which is half of the `innodb_page_size` value. Depending on `innodb_page_size`, possible `KEY_BLOCK_SIZE` values include 0, 1, 2, 4, 8, and 16. See Section 17.9.1, “InnoDB Table Compression” for more information.

  Oracle recommends enabling `innodb_strict_mode` when specifying `KEY_BLOCK_SIZE` for `InnoDB` tables. When `innodb_strict_mode` is enabled, specifying an invalid `KEY_BLOCK_SIZE` value returns an error. If `innodb_strict_mode` is disabled, an invalid `KEY_BLOCK_SIZE` value results in a warning, and the `KEY_BLOCK_SIZE` option is ignored.

  The `Create_options` column in response to `SHOW TABLE STATUS` reports the actual `KEY_BLOCK_SIZE` used by the table, as does `SHOW CREATE TABLE`.

  `InnoDB` only supports `KEY_BLOCK_SIZE` at the table level.

  `KEY_BLOCK_SIZE` is not supported with 32KB and 64KB `innodb_page_size` values. `InnoDB` table compression does not support these pages sizes.

  `InnoDB` does not support the `KEY_BLOCK_SIZE` option when creating temporary tables.

* `MAX_ROWS`

  The maximum number of rows you plan to store in the table. This is not a hard limit, but rather a hint to the storage engine that the table must be able to store at least this many rows.

  Important

  The use of `MAX_ROWS` with `NDB` tables to control the number of table partitions is deprecated. It remains supported in later versions for backward compatibility, but is subject to removal in a future release. Use PARTITION_BALANCE instead; see Setting NDB_TABLE options.

  The `NDB` storage engine treats this value as a maximum. If you plan to create very large NDB Cluster tables (containing millions of rows), you should use this option to insure that `NDB` allocates sufficient number of index slots in the hash table used for storing hashes of the table's primary keys by setting `MAX_ROWS = 2 * rows`, where *`rows`* is the number of rows that you expect to insert into the table.

  The maximum `MAX_ROWS` value is 4294967295; larger values are truncated to this limit.

* `MIN_ROWS`

  The minimum number of rows you plan to store in the table. The `MEMORY` storage engine uses this option as a hint about memory use.

* `PACK_KEYS`

  Takes effect only with `MyISAM` tables. Set this option to 1 if you want to have smaller indexes. This usually makes updates slower and reads faster. Setting the option to 0 disables all packing of keys. Setting it to `DEFAULT` tells the storage engine to pack only long `CHAR`, `VARCHAR`, `BINARY`, or `VARBINARY` columns.

  If you do not use `PACK_KEYS`, the default is to pack strings, but not numbers. If you use `PACK_KEYS=1`, numbers are packed as well.

  When packing binary number keys, MySQL uses prefix compression:

  + Every key needs one extra byte to indicate how many bytes of the previous key are the same for the next key.

  + The pointer to the row is stored in high-byte-first order directly after the key, to improve compression.

  This means that if you have many equal keys on two consecutive rows, all following “same” keys usually only take two bytes (including the pointer to the row). Compare this to the ordinary case where the following keys takes `storage_size_for_key + pointer_size` (where the pointer size is usually 4). Conversely, you get a significant benefit from prefix compression only if you have many numbers that are the same. If all keys are totally different, you use one byte more per key, if the key is not a key that can have `NULL` values. (In this case, the packed key length is stored in the same byte that is used to mark if a key is `NULL`.)

* `PASSWORD`

  This option is unused.

* `ROW_FORMAT`

  Defines the physical format in which the rows are stored.

  When creating a table with strict mode disabled, the storage engine's default row format is used if the specified row format is not supported. The actual row format of the table is reported in the `Row_format` column in response to [`SHOW TABLE STATUS`](show-table-status.html "15.7.7.39 SHOW TABLE STATUS Statement"). The `Create_options` column shows the row format that was specified in the `CREATE TABLE` statement, as does `SHOW CREATE TABLE`.

  Row format choices differ depending on the storage engine used for the table.

  For `InnoDB` tables:

  + The default row format is defined by `innodb_default_row_format`, which has a default setting of `DYNAMIC`. The default row format is used when the `ROW_FORMAT` option is not defined or when `ROW_FORMAT=DEFAULT` is used.

    If the `ROW_FORMAT` option is not defined, or if `ROW_FORMAT=DEFAULT` is used, operations that rebuild a table also silently change the row format of the table to the default defined by `innodb_default_row_format`. For more information, see Defining the Row Format of a Table.

  + For more efficient `InnoDB` storage of data types, especially `BLOB` types, use the `DYNAMIC`. See DYNAMIC Row Format for requirements associated with the `DYNAMIC` row format.

  + To enable compression for `InnoDB` tables, specify `ROW_FORMAT=COMPRESSED`. The `ROW_FORMAT=COMPRESSED` option is not supported when creating temporary tables. See Section 17.9, “InnoDB Table and Page Compression” for requirements associated with the `COMPRESSED` row format.

  + The row format used in older versions of MySQL can still be requested by specifying the `REDUNDANT` row format.

  + When you specify a non-default `ROW_FORMAT` clause, consider also enabling the `innodb_strict_mode` configuration option.

  + `ROW_FORMAT=FIXED` is not supported. If `ROW_FORMAT=FIXED` is specified while `innodb_strict_mode` is disabled, `InnoDB` issues a warning and assumes `ROW_FORMAT=DYNAMIC`. If `ROW_FORMAT=FIXED` is specified while `innodb_strict_mode` is enabled, which is the default, `InnoDB` returns an error.

  + For additional information about `InnoDB` row formats, see Section 17.10, “InnoDB Row Formats”.

  For `MyISAM` tables, the option value can be `FIXED` or `DYNAMIC` for static or variable-length row format. **myisampack** sets the type to `COMPRESSED`. See Section 18.2.3, “MyISAM Table Storage Formats”.

  For `NDB` tables, the default `ROW_FORMAT` is `DYNAMIC`.

* `START TRANSACTION`

  This is an internal-use table option, used to permit `CREATE TABLE ... SELECT` to be logged as a single, atomic transaction in the binary log when using row-based replication with a storage engine that supports atomic DDL. Only `BINLOG`, `COMMIT`, and `ROLLBACK` statements are permitted after `CREATE TABLE ... START TRANSACTION`. For related information, see Section 15.1.1, “Atomic Data Definition Statement Support”.

* `STATS_AUTO_RECALC`

  Specifies whether to automatically recalculate [persistent statistics](/doc/refman/8.4/en/glossary.html#glos_persistent_statistics) for an `InnoDB` table. The value `DEFAULT` causes the persistent statistics setting for the table to be determined by the `innodb_stats_auto_recalc` configuration option. The value `1` causes statistics to be recalculated when 10% of the data in the table has changed. The value `0` prevents automatic recalculation for this table; with this setting, issue an `ANALYZE TABLE` statement to recalculate the statistics after making substantial changes to the table. For more information about the persistent statistics feature, see Section 17.8.10.1, “Configuring Persistent Optimizer Statistics Parameters”.

* `STATS_PERSISTENT`

  Specifies whether to enable [persistent statistics](/doc/refman/8.4/en/glossary.html#glos_persistent_statistics) for an `InnoDB` table. The value `DEFAULT` causes the persistent statistics setting for the table to be determined by the `innodb_stats_persistent` configuration option. The value `1` enables persistent statistics for the table, while the value `0` turns off this feature. After enabling persistent statistics through a `CREATE TABLE` or `ALTER TABLE` statement, issue an `ANALYZE TABLE` statement to calculate the statistics, after loading representative data into the table. For more information about the persistent statistics feature, see Section 17.8.10.1, “Configuring Persistent Optimizer Statistics Parameters”.

* `STATS_SAMPLE_PAGES`

  The number of index pages to sample when estimating cardinality and other statistics for an indexed column, such as those calculated by [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement"). For more information, see Section 17.8.10.1, “Configuring Persistent Optimizer Statistics Parameters”.

* `TABLESPACE`

  The `TABLESPACE` clause can be used to create an `InnoDB` table in an existing general tablespace, a file-per-table tablespace, or the system tablespace.

  ```
  CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name
  ```

  The general tablespace that you specify must exist prior to using the `TABLESPACE` clause. For information about general tablespaces, see Section 17.6.3.3, “General Tablespaces”.

  The `tablespace_name` is a case-sensitive identifier. It may be quoted or unquoted. The forward slash character (“/”) is not permitted. Names beginning with “innodb_” are reserved for special use.

  To create a table in the system tablespace, specify `innodb_system` as the tablespace name.

  ```
  CREATE TABLE tbl_name ... TABLESPACE [=] innodb_system
  ```

  Using `TABLESPACE [=] innodb_system`, you can place a table of any uncompressed row format in the system tablespace regardless of the `innodb_file_per_table` setting. For example, you can add a table with `ROW_FORMAT=DYNAMIC` to the system tablespace using `TABLESPACE [=] innodb_system`.

  To create a table in a file-per-table tablespace, specify `innodb_file_per_table` as the tablespace name.

  ```
  CREATE TABLE tbl_name ... TABLESPACE [=] innodb_file_per_table
  ```

  Note

  If `innodb_file_per_table` is enabled, you need not specify `TABLESPACE=innodb_file_per_table` to create an `InnoDB` file-per-table tablespace. `InnoDB` tables are created in file-per-table tablespaces by default when `innodb_file_per_table` is enabled.

  The `DATA DIRECTORY` clause is permitted with `CREATE TABLE ... TABLESPACE=innodb_file_per_table` but is otherwise not supported for use in combination with the `TABLESPACE` clause. The directory specified in a `DATA DIRECTORY` clause must be known to `InnoDB`. For more information, see Using the DATA DIRECTORY Clause.

  Note

  Support for `TABLESPACE = innodb_file_per_table` and `TABLESPACE = innodb_temporary` clauses with [`CREATE TEMPORARY TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") is deprecated; expect it to be removed in a future version of MySQL.

  The `STORAGE` table option is employed only with `NDB` tables. `STORAGE` determines the type of storage used, and can be either of `DISK` or `MEMORY`.

  `TABLESPACE ... STORAGE DISK` assigns a table to an NDB Cluster Disk Data tablespace. `STORAGE DISK` cannot be used in `CREATE TABLE` unless preceded by `TABLESPACE` *`tablespace_name`*.

  For `STORAGE MEMORY`, the tablespace name is optional, thus, you can use `TABLESPACE tablespace_name STORAGE MEMORY` or simply `STORAGE MEMORY` to specify explicitly that the table is in-memory.

  See Section 25.6.11, “NDB Cluster Disk Data Tables”, for more information.

* `UNION`

  Used to access a collection of identical `MyISAM` tables as one. This works only with `MERGE` tables. See Section 18.7, “The MERGE Storage Engine”.

  You must have `SELECT`, `UPDATE`, and `DELETE` privileges for the tables you map to a `MERGE` table.

  Note

  Formerly, all tables used had to be in the same database as the `MERGE` table itself. This restriction no longer applies.

#### Table Partitioning

*`partition_options`* can be used to control partitioning of the table created with `CREATE TABLE`.

Not all options shown in the syntax for *`partition_options`* at the beginning of this section are available for all partitioning types. Please see the listings for the following individual types for information specific to each type, and see Chapter 26, *Partitioning*, for more complete information about the workings of and uses for partitioning in MySQL, as well as additional examples of table creation and other statements relating to MySQL partitioning.

Partitions can be modified, merged, added to tables, and dropped from tables. For basic information about the MySQL statements to accomplish these tasks, see Section 15.1.11, “ALTER TABLE Statement”. For more detailed descriptions and examples, see Section 26.3, “Partition Management”.

* `PARTITION BY`

  If used, a *`partition_options`* clause begins with `PARTITION BY`. This clause contains the function that is used to determine the partition; the function returns an integer value ranging from 1 to *`num`*, where *`num`* is the number of partitions. (The maximum number of user-defined partitions which a table may contain is 1024; the number of subpartitions—discussed later in this section—is included in this maximum.)

  Note

  The expression (*`expr`*) used in a `PARTITION BY` clause cannot refer to any columns not in the table being created; such references are specifically not permitted and cause the statement to fail with an error. (Bug #29444)

* `HASH(expr)`

  Hashes one or more columns to create a key for placing and locating rows. *`expr`* is an expression using one or more table columns. This can be any valid MySQL expression (including MySQL functions) that yields a single integer value. For example, these are both valid `CREATE TABLE` statements using `PARTITION BY HASH`:

  ```
  CREATE TABLE t1 (col1 INT, col2 CHAR(5))
      PARTITION BY HASH(col1);

  CREATE TABLE t1 (col1 INT, col2 CHAR(5), col3 DATETIME)
      PARTITION BY HASH ( YEAR(col3) );
  ```

  You may not use either `VALUES LESS THAN` or `VALUES IN` clauses with `PARTITION BY HASH`.

  `PARTITION BY HASH` uses the remainder of *`expr`* divided by the number of partitions (that is, the modulus). For examples and additional information, see Section 26.2.4, “HASH Partitioning”.

  The `LINEAR` keyword entails a somewhat different algorithm. In this case, the number of the partition in which a row is stored is calculated as the result of one or more logical `AND` operations. For discussion and examples of linear hashing, see Section 26.2.4.1, “LINEAR HASH Partitioning”.

* `KEY(column_list)`

  This is similar to `HASH`, except that MySQL supplies the hashing function so as to guarantee an even data distribution. The *`column_list`* argument is simply a list of 1 or more table columns (maximum: 16). This example shows a simple table partitioned by key, with 4 partitions:

  ```
  CREATE TABLE tk (col1 INT, col2 CHAR(5), col3 DATE)
      PARTITION BY KEY(col3)
      PARTITIONS 4;
  ```

  For tables that are partitioned by key, you can employ linear partitioning by using the `LINEAR` keyword. This has the same effect as with tables that are partitioned by `HASH`. That is, the partition number is found using the `&` operator rather than the modulus (see Section 26.2.4.1, “LINEAR HASH Partitioning”, and Section 26.2.5, “KEY Partitioning”, for details). This example uses linear partitioning by key to distribute data between 5 partitions:

  ```
  CREATE TABLE tk (col1 INT, col2 CHAR(5), col3 DATE)
      PARTITION BY LINEAR KEY(col3)
      PARTITIONS 5;
  ```

  The `ALGORITHM={1 | 2}` option is supported with `[SUB]PARTITION BY [LINEAR] KEY`. `ALGORITHM=1` causes the server to use the same key-hashing functions as MySQL 5.1; `ALGORITHM=2` means that the server employs the key-hashing functions implemented and used by default for new `KEY` partitioned tables in MySQL 5.5 and later. (Partitioned tables created with the key-hashing functions employed in MySQL 5.5 and later cannot be used by a MySQL 5.1 server.) Not specifying the option has the same effect as using `ALGORITHM=2`. This option is intended for use chiefly when upgrading or downgrading `[LINEAR] KEY` partitioned tables between MySQL 5.1 and later MySQL versions, or for creating tables partitioned by `KEY` or `LINEAR KEY` on a MySQL 5.5 or later server which can be used on a MySQL 5.1 server. For more information, see Section 15.1.11.1, “ALTER TABLE Partition Operations”.

  **mysqldump** writes this option encased in versioned comments.

  `ALGORITHM=1` is shown when necessary in the output of `SHOW CREATE TABLE` using versioned comments in the same manner as **mysqldump**. `ALGORITHM=2` is always omitted from `SHOW CREATE TABLE` output, even if this option was specified when creating the original table.

  You may not use either `VALUES LESS THAN` or `VALUES IN` clauses with `PARTITION BY KEY`.

* `RANGE(expr)`

  In this case, *`expr`* shows a range of values using a set of `VALUES LESS THAN` operators. When using range partitioning, you must define at least one partition using `VALUES LESS THAN`. You cannot use `VALUES IN` with range partitioning.

  Note

  For tables partitioned by `RANGE`, `VALUES LESS THAN` must be used with either an integer literal value or an expression that evaluates to a single integer value. In MySQL 9.5, you can overcome this limitation in a table that is defined using `PARTITION BY RANGE COLUMNS`, as described later in this section.

  Suppose that you have a table that you wish to partition on a column containing year values, according to the following scheme.

  <table summary="A table partitioning scheme based on a column containing year values, as described in the preceding text. The table lists partition numbers and corresponding range of years."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Partition Number:</th> <th>Years Range:</th> </tr></thead><tbody><tr> <td>0</td> <td>1990 and earlier</td> </tr><tr> <td>1</td> <td>1991 to 1994</td> </tr><tr> <td>2</td> <td>1995 to 1998</td> </tr><tr> <td>3</td> <td>1999 to 2002</td> </tr><tr> <td>4</td> <td>2003 to 2005</td> </tr><tr> <td>5</td> <td>2006 and later</td> </tr></tbody></table>

  A table implementing such a partitioning scheme can be realized by the `CREATE TABLE` statement shown here:

  ```
  CREATE TABLE t1 (
      year_col  INT,
      some_data INT
  )
  PARTITION BY RANGE (year_col) (
      PARTITION p0 VALUES LESS THAN (1991),
      PARTITION p1 VALUES LESS THAN (1995),
      PARTITION p2 VALUES LESS THAN (1999),
      PARTITION p3 VALUES LESS THAN (2002),
      PARTITION p4 VALUES LESS THAN (2006),
      PARTITION p5 VALUES LESS THAN MAXVALUE
  );
  ```

  `PARTITION ... VALUES LESS THAN ...` statements work in a consecutive fashion. `VALUES LESS THAN MAXVALUE` works to specify “leftover” values that are greater than the maximum value otherwise specified.

  `VALUES LESS THAN` clauses work sequentially in a manner similar to that of the `case` portions of a `switch ... case` block (as found in many programming languages such as C, Java, and PHP). That is, the clauses must be arranged in such a way that the upper limit specified in each successive `VALUES LESS THAN` is greater than that of the previous one, with the one referencing `MAXVALUE` coming last of all in the list.

* `RANGE COLUMNS(column_list)`

  This variant on `RANGE` facilitates partition pruning for queries using range conditions on multiple columns (that is, having conditions such as `WHERE a = 1 AND b < 10` or `WHERE a = 1 AND b = 10 AND c < 10`). It enables you to specify value ranges in multiple columns by using a list of columns in the `COLUMNS` clause and a set of column values in each `PARTITION ... VALUES LESS THAN (value_list)` partition definition clause. (In the simplest case, this set consists of a single column.) The maximum number of columns that can be referenced in the *`column_list`* and *`value_list`* is 16.

  The *`column_list`* used in the `COLUMNS` clause may contain only names of columns; each column in the list must be one of the following MySQL data types: the integer types; the string types; and time or date column types. Columns using `BLOB`, `TEXT`, `SET`, `ENUM`, `BIT`, or spatial data types are not permitted; columns that use floating-point number types are also not permitted. You also may not use functions or arithmetic expressions in the `COLUMNS` clause.

  The `VALUES LESS THAN` clause used in a partition definition must specify a literal value for each column that appears in the `COLUMNS()` clause; that is, the list of values used for each `VALUES LESS THAN` clause must contain the same number of values as there are columns listed in the `COLUMNS` clause. An attempt to use more or fewer values in a `VALUES LESS THAN` clause than there are in the `COLUMNS` clause causes the statement to fail with the error Inconsistency in usage of column lists for partitioning.... You cannot use `NULL` for any value appearing in `VALUES LESS THAN`. It is possible to use `MAXVALUE` more than once for a given column other than the first, as shown in this example:

  ```
  CREATE TABLE rc (
      a INT NOT NULL,
      b INT NOT NULL
  )
  PARTITION BY RANGE COLUMNS(a,b) (
      PARTITION p0 VALUES LESS THAN (10,5),
      PARTITION p1 VALUES LESS THAN (20,10),
      PARTITION p2 VALUES LESS THAN (50,MAXVALUE),
      PARTITION p3 VALUES LESS THAN (65,MAXVALUE),
      PARTITION p4 VALUES LESS THAN (MAXVALUE,MAXVALUE)
  );
  ```

  Each value used in a `VALUES LESS THAN` value list must match the type of the corresponding column exactly; no conversion is made. For example, you cannot use the string `'1'` for a value that matches a column that uses an integer type (you must use the numeral `1` instead), nor can you use the numeral `1` for a value that matches a column that uses a string type (in such a case, you must use a quoted string: `'1'`).

  For more information, see Section 26.2.1, “RANGE Partitioning”, and Section 26.4, “Partition Pruning”.

* `LIST(expr)`

  This is useful when assigning partitions based on a table column with a restricted set of possible values, such as a state or country code. In such a case, all rows pertaining to a certain state or country can be assigned to a single partition, or a partition can be reserved for a certain set of states or countries. It is similar to `RANGE`, except that only `VALUES IN` may be used to specify permissible values for each partition.

  `VALUES IN` is used with a list of values to be matched. For instance, you could create a partitioning scheme such as the following:

  ```
  CREATE TABLE client_firms (
      id   INT,
      name VARCHAR(35)
  )
  PARTITION BY LIST (id) (
      PARTITION r0 VALUES IN (1, 5, 9, 13, 17, 21),
      PARTITION r1 VALUES IN (2, 6, 10, 14, 18, 22),
      PARTITION r2 VALUES IN (3, 7, 11, 15, 19, 23),
      PARTITION r3 VALUES IN (4, 8, 12, 16, 20, 24)
  );
  ```

  When using list partitioning, you must define at least one partition using `VALUES IN`. You cannot use `VALUES LESS THAN` with `PARTITION BY LIST`.

  Note

  For tables partitioned by `LIST`, the value list used with `VALUES IN` must consist of integer values only. In MySQL 9.5, you can overcome this limitation using partitioning by `LIST COLUMNS`, which is described later in this section.

* `LIST COLUMNS(column_list)`

  This variant on `LIST` facilitates partition pruning for queries using comparison conditions on multiple columns (that is, having conditions such as `WHERE a = 5 AND b = 5` or `WHERE a = 1 AND b = 10 AND c = 5`). It enables you to specify values in multiple columns by using a list of columns in the `COLUMNS` clause and a set of column values in each `PARTITION ... VALUES IN (value_list)` partition definition clause.

  The rules governing regarding data types for the column list used in `LIST COLUMNS(column_list)` and the value list used in `VALUES IN(value_list)` are the same as those for the column list used in `RANGE COLUMNS(column_list)` and the value list used in `VALUES LESS THAN(value_list)`, respectively, except that in the `VALUES IN` clause, `MAXVALUE` is not permitted, and you may use `NULL`.

  There is one important difference between the list of values used for `VALUES IN` with `PARTITION BY LIST COLUMNS` as opposed to when it is used with `PARTITION BY LIST`. When used with `PARTITION BY LIST COLUMNS`, each element in the `VALUES IN` clause must be a *set* of column values; the number of values in each set must be the same as the number of columns used in the `COLUMNS` clause, and the data types of these values must match those of the columns (and occur in the same order). In the simplest case, the set consists of a single column. The maximum number of columns that can be used in the *`column_list`* and in the elements making up the *`value_list`* is 16.

  The table defined by the following `CREATE TABLE` statement provides an example of a table using `LIST COLUMNS` partitioning:

  ```
  CREATE TABLE lc (
      a INT NULL,
      b INT NULL
  )
  PARTITION BY LIST COLUMNS(a,b) (
      PARTITION p0 VALUES IN( (0,0), (NULL,NULL) ),
      PARTITION p1 VALUES IN( (0,1), (0,2), (0,3), (1,1), (1,2) ),
      PARTITION p2 VALUES IN( (1,0), (2,0), (2,1), (3,0), (3,1) ),
      PARTITION p3 VALUES IN( (1,3), (2,2), (2,3), (3,2), (3,3) )
  );
  ```

* `PARTITIONS num`

  The number of partitions may optionally be specified with a `PARTITIONS num` clause, where *`num`* is the number of partitions. If both this clause *and* any `PARTITION` clauses are used, *`num`* must be equal to the total number of any partitions that are declared using `PARTITION` clauses.

  Note

  Whether or not you use a `PARTITIONS` clause in creating a table that is partitioned by `RANGE` or `LIST`, you must still include at least one `PARTITION VALUES` clause in the table definition (see below).

* `SUBPARTITION BY`

  A partition may optionally be divided into a number of subpartitions. This can be indicated by using the optional `SUBPARTITION BY` clause. Subpartitioning may be done by `HASH` or `KEY`. Either of these may be `LINEAR`. These work in the same way as previously described for the equivalent partitioning types. (It is not possible to subpartition by `LIST` or `RANGE`.)

  The number of subpartitions can be indicated using the `SUBPARTITIONS` keyword followed by an integer value.

* Rigorous checking of the value used in `PARTITIONS` or `SUBPARTITIONS` clauses is applied and this value must adhere to the following rules:

  + The value must be a positive, nonzero integer.
  + No leading zeros are permitted.
  + The value must be an integer literal, and cannot not be an expression. For example, `PARTITIONS 0.2E+01` is not permitted, even though `0.2E+01` evaluates to `2`. (Bug #15890)

* `partition_definition`

  Each partition may be individually defined using a *`partition_definition`* clause. The individual parts making up this clause are as follows:

  + `PARTITION partition_name`

    Specifies a logical name for the partition.

  + `VALUES`

    For range partitioning, each partition must include a `VALUES LESS THAN` clause; for list partitioning, you must specify a `VALUES IN` clause for each partition. This is used to determine which rows are to be stored in this partition. See the discussions of partitioning types in Chapter 26, *Partitioning*, for syntax examples.

  + `[STORAGE] ENGINE`

    MySQL accepts a `[STORAGE] ENGINE` option for both `PARTITION` and `SUBPARTITION`. Currently, the only way in which this option can be used is to set all partitions or all subpartitions to the same storage engine, and an attempt to set different storage engines for partitions or subpartitions in the same table raises the error ERROR 1469 (HY000): The mix of handlers in the partitions is not permitted in this version of MySQL.

  + `COMMENT`

    An optional `COMMENT` clause may be used to specify a string that describes the partition. Example:

    ```
    COMMENT = 'Data for the years previous to 1999'
    ```

    The maximum length for a partition comment is 1024 characters.

  + `DATA DIRECTORY` and `INDEX DIRECTORY`

    `DATA DIRECTORY` and `INDEX DIRECTORY` may be used to indicate the directory where, respectively, the data and indexes for this partition are to be stored. Both the `data_dir` and the `index_dir` must be absolute system path names.

    The directory specified in a `DATA DIRECTORY` clause must be known to `InnoDB`. For more information, see Using the DATA DIRECTORY Clause.

    You must have the `FILE` privilege to use the `DATA DIRECTORY` or `INDEX DIRECTORY` partition option.

    Example:

    ```
    CREATE TABLE th (id INT, name VARCHAR(30), adate DATE)
    PARTITION BY LIST(YEAR(adate))
    (
      PARTITION p1999 VALUES IN (1995, 1999, 2003)
        DATA DIRECTORY = '/var/appdata/95/data'
        INDEX DIRECTORY = '/var/appdata/95/idx',
      PARTITION p2000 VALUES IN (1996, 2000, 2004)
        DATA DIRECTORY = '/var/appdata/96/data'
        INDEX DIRECTORY = '/var/appdata/96/idx',
      PARTITION p2001 VALUES IN (1997, 2001, 2005)
        DATA DIRECTORY = '/var/appdata/97/data'
        INDEX DIRECTORY = '/var/appdata/97/idx',
      PARTITION p2002 VALUES IN (1998, 2002, 2006)
        DATA DIRECTORY = '/var/appdata/98/data'
        INDEX DIRECTORY = '/var/appdata/98/idx'
    );
    ```

    `DATA DIRECTORY` and `INDEX DIRECTORY` behave in the same way as in the `CREATE TABLE` statement's *`table_option`* clause as used for `MyISAM` tables.

    One data directory and one index directory may be specified per partition. If left unspecified, the data and indexes are stored by default in the table's database directory.

    The `DATA DIRECTORY` and `INDEX DIRECTORY` options are ignored for creating partitioned tables if `NO_DIR_IN_CREATE` is in effect.

  + `MAX_ROWS` and `MIN_ROWS`

    May be used to specify, respectively, the maximum and minimum number of rows to be stored in the partition. The values for *`max_number_of_rows`* and *`min_number_of_rows`* must be positive integers. As with the table-level options with the same names, these act only as “suggestions” to the server and are not hard limits.

  + `TABLESPACE`

    May be used to designate an `InnoDB` file-per-table tablespace for the partition by specifying `` TABLESPACE `innodb_file_per_table` ``. All partitions must belong to the same storage engine.

    Placing `InnoDB` table partitions in shared `InnoDB` tablespaces is not supported. Shared tablespaces include the `InnoDB` system tablespace and general tablespaces.

* `subpartition_definition`

  The partition definition may optionally contain one or more *`subpartition_definition`* clauses. Each of these consists at a minimum of the `SUBPARTITION name`, where *`name`* is an identifier for the subpartition. Except for the replacement of the `PARTITION` keyword with `SUBPARTITION`, the syntax for a subpartition definition is identical to that for a partition definition.

  Subpartitioning must be done by `HASH` or `KEY`, and can be done only on `RANGE` or `LIST` partitions. See Section 26.2.6, “Subpartitioning”.

**Partitioning by Generated Columns**

Partitioning by generated columns is permitted. For example:

```
CREATE TABLE t1 (
  s1 INT,
  s2 INT AS (EXP(s1)) STORED
)
PARTITION BY LIST (s2) (
  PARTITION p1 VALUES IN (1)
);
```

Partitioning sees a generated column as a regular column, which enables workarounds for limitations on functions that are not permitted for partitioning (see Section 26.6.3, “Partitioning Limitations Relating to Functions”). The preceding example demonstrates this technique: `EXP()` cannot be used directly in the `PARTITION BY` clause, but a generated column defined using `EXP()` is permitted.


#### 15.1.24.1 Files Created by CREATE TABLE

For an `InnoDB` table created in a file-per-table tablespace or general tablespace, table data and associated indexes are stored in a .ibd file in the database directory. When an `InnoDB` table is created in the system tablespace, table data and indexes are stored in the ibdata\* files that represent the system tablespace. The `innodb_file_per_table` option controls whether tables are created in file-per-table tablespaces or the system tablespace, by default. The `TABLESPACE` option can be used to place a table in a file-per-table tablespace, general tablespace, or the system tablespace, regardless of the `innodb_file_per_table` setting.

For `MyISAM` tables, the storage engine creates data and index files. Thus, for each `MyISAM` table *`tbl_name`*, there are two disk files.

<table summary="The purpose of MyISAM table tbl_name disk files."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>File</th> <th>Purpose</th> </tr></thead><tbody><tr> <td><code><code>tbl_name</code>.MYD</code></td> <td>Data file</td> </tr><tr> <td><code><code>tbl_name</code>.MYI</code></td> <td>Index file</td> </tr></tbody></table>

Chapter 18, *Alternative Storage Engines*, describes what files each storage engine creates to represent tables. If a table name contains special characters, the names for the table files contain encoded versions of those characters as described in Section 11.2.4, “Mapping of Identifiers to File Names”.


#### 15.1.24.2 CREATE TEMPORARY TABLE Statement

You can use the `TEMPORARY` keyword when creating a table. A `TEMPORARY` table is visible only within the current session, and is dropped automatically when the session is closed. This means that two different sessions can use the same temporary table name without conflicting with each other or with an existing non-`TEMPORARY` table of the same name. (The existing table is hidden until the temporary table is dropped.)

`InnoDB` does not support compressed temporary tables. When `innodb_strict_mode` is enabled (the default), [`CREATE TEMPORARY TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") returns an error if `ROW_FORMAT=COMPRESSED` or `KEY_BLOCK_SIZE` is specified. If `innodb_strict_mode` is disabled, warnings are issued and the temporary table is created using a non-compressed row format. The `innodb_file_per-table` option does not affect the creation of `InnoDB` temporary tables.

`CREATE TABLE` causes an implicit commit, except when used with the `TEMPORARY` keyword. See Section 15.3.3, “Statements That Cause an Implicit Commit”.

`TEMPORARY` tables have a very loose relationship with databases (schemas). Dropping a database does not automatically drop any `TEMPORARY` tables created within that database.

To create a temporary table, you must have the `CREATE TEMPORARY TABLES` privilege. After a session has created a temporary table, the server performs no further privilege checks on the table. The creating session can perform any operation on the table, such as `DROP TABLE`, `INSERT`, `UPDATE`, or `SELECT`.

One implication of this behavior is that a session can manipulate its temporary tables even if the current user has no privilege to create them. Suppose that the current user does not have the `CREATE TEMPORARY TABLES` privilege but is able to execute a definer-context stored procedure that executes with the privileges of a user who does have `CREATE TEMPORARY TABLES` and that creates a temporary table. While the procedure executes, the session uses the privileges of the defining user. After the procedure returns, the effective privileges revert to those of the current user, which can still see the temporary table and perform any operation on it.

You cannot use `CREATE TEMPORARY TABLE ... LIKE` to create an empty table based on the definition of a table that resides in the `mysql` tablespace, `InnoDB` system tablespace (`innodb_system`), or a general tablespace. The tablespace definition for such a table includes a `TABLESPACE` attribute that defines the tablespace where the table resides, and the aforementioned tablespaces do not support temporary tables. To create a temporary table based on the definition of such a table, use this syntax instead:

```
CREATE TEMPORARY TABLE new_tbl SELECT * FROM orig_tbl LIMIT 0;
```

Note

Support for `TABLESPACE = innodb_file_per_table` and `TABLESPACE = innodb_temporary` clauses with [`CREATE TEMPORARY TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") is deprecated; expect it to be removed in a future version of MySQL.


#### 15.1.24.3 CREATE TABLE ... LIKE Statement

Use `CREATE TABLE ... LIKE` to create an empty table based on the definition of another table, including any column attributes and indexes defined in the original table:

```
CREATE TABLE new_tbl LIKE orig_tbl;
```

The copy is created using the same version of the table storage format as the original table. The `SELECT` privilege is required on the original table.

`LIKE` works only for base tables, not for views.

Important

You cannot execute `CREATE TABLE` or `CREATE TABLE ... LIKE` while a `LOCK TABLES` statement is in effect.

[`CREATE TABLE ... LIKE`](create-table.html "15.1.24 CREATE TABLE Statement") makes the same checks as `CREATE TABLE`. This means that if the current SQL mode is different from the mode in effect when the original table was created, the table definition might be considered invalid for the new mode and cause the statement to fail.

For `CREATE TABLE ... LIKE`, the destination table preserves generated column information from the original table.

For `CREATE TABLE ... LIKE`, the destination table preserves expression default values from the original table.

For `CREATE TABLE ... LIKE`, the destination table preserves `CHECK` constraints from the original table, except that all the constraint names are generated.

`CREATE TABLE ... LIKE` does not preserve any `DATA DIRECTORY` or `INDEX DIRECTORY` table options that were specified for the original table, or any foreign key definitions.

If the original table is a `TEMPORARY` table, `CREATE TABLE ... LIKE` does not preserve `TEMPORARY`. To create a `TEMPORARY` destination table, use `CREATE TEMPORARY TABLE ... LIKE`.

[`CREATE TABLE ... LIKE`](create-table-like.html "15.1.24.3 CREATE TABLE ... LIKE Statement") operations apply all `ENGINE_ATTRIBUTE` and `SECONDARY_ENGINE_ATTRIBUTE` values to the new table.


#### 15.1.24.4 CREATE TABLE ... SELECT Statement

You can create one table from another by adding a `SELECT` statement at the end of the `CREATE TABLE` statement:

```
CREATE TABLE new_tbl [AS] SELECT * FROM orig_tbl;
```

MySQL creates new columns for all elements in the `SELECT`. For example:

```
mysql> CREATE TABLE test (a INT NOT NULL AUTO_INCREMENT,
    ->        PRIMARY KEY (a), KEY(b))
    ->        ENGINE=InnoDB SELECT b,c FROM test2;
```

This creates an `InnoDB` table with three columns, `a`, `b`, and `c`. The `ENGINE` option is part of the `CREATE TABLE` statement, and should not be used following the `SELECT`; this would result in a syntax error. The same is true for other `CREATE TABLE` options such as `CHARSET`.

Notice that the columns from the `SELECT` statement are appended to the right side of the table, not overlapped onto it. Take the following example:

```
mysql> SELECT * FROM foo;
+---+
| n |
+---+
| 1 |
+---+

mysql> CREATE TABLE bar (m INT) SELECT n FROM foo;
Query OK, 1 row affected (0.02 sec)
Records: 1  Duplicates: 0  Warnings: 0

mysql> SELECT * FROM bar;
+------+---+
| m    | n |
+------+---+
| NULL | 1 |
+------+---+
1 row in set (0.00 sec)
```

For each row in table `foo`, a row is inserted in `bar` with the values from `foo` and default values for the new columns.

In a table resulting from [`CREATE TABLE ... SELECT`](create-table.html "15.1.24 CREATE TABLE Statement"), columns named only in the `CREATE TABLE` part come first. Columns named in both parts or only in the `SELECT` part come after that. The data type of `SELECT` columns can be overridden by also specifying the column in the `CREATE TABLE` part.

For storage engines that support both atomic DDL and foreign key constraints, creation of foreign keys is not permitted in [`CREATE TABLE ... SELECT`](create-table-select.html "15.1.24.4 CREATE TABLE ... SELECT Statement") statements when row-based replication is in use. Foreign key constraints can be added later using `ALTER TABLE`.

You can precede the `SELECT` by `IGNORE` or `REPLACE` to indicate how to handle rows that duplicate unique key values. With `IGNORE`, rows that duplicate an existing row on a unique key value are discarded. With `REPLACE`, new rows replace rows that have the same unique key value. If neither `IGNORE` nor `REPLACE` is specified, duplicate unique key values result in an error. For more information, see The Effect of IGNORE on Statement Execution.

You can also use a `VALUES` statement in the `SELECT` part of `CREATE TABLE ... SELECT`; the `VALUES` portion of the statement must include a table alias using an `AS` clause. To name the columns coming from `VALUES`, supply column aliases with the table alias; otherwise, the default column names `column_0`, `column_1`, `column_2`, ..., are used.

Otherwise, naming of columns in the table thus created follows the same rules as described previously in this section. Examples:

```
mysql> CREATE TABLE tv1
     >     SELECT * FROM (VALUES ROW(1,3,5), ROW(2,4,6)) AS v;
mysql> TABLE tv1;
+----------+----------+----------+
| column_0 | column_1 | column_2 |
+----------+----------+----------+
|        1 |        3 |        5 |
|        2 |        4 |        6 |
+----------+----------+----------+

mysql> CREATE TABLE tv2
     >     SELECT * FROM (VALUES ROW(1,3,5), ROW(2,4,6)) AS v(x,y,z);
mysql> TABLE tv2;
+---+---+---+
| x | y | z |
+---+---+---+
| 1 | 3 | 5 |
| 2 | 4 | 6 |
+---+---+---+

mysql> CREATE TABLE tv3 (a INT, b INT, c INT)
     >     SELECT * FROM (VALUES ROW(1,3,5), ROW(2,4,6)) AS v(x,y,z);
mysql> TABLE tv3;
+------+------+------+----------+----------+----------+
| a    | b    | c    |        x |        y |        z |
+------+------+------+----------+----------+----------+
| NULL | NULL | NULL |        1 |        3 |        5 |
| NULL | NULL | NULL |        2 |        4 |        6 |
+------+------+------+----------+----------+----------+

mysql> CREATE TABLE tv4 (a INT, b INT, c INT)
     >     SELECT * FROM (VALUES ROW(1,3,5), ROW(2,4,6)) AS v(x,y,z);
mysql> TABLE tv4;
+------+------+------+---+---+---+
| a    | b    | c    | x | y | z |
+------+------+------+---+---+---+
| NULL | NULL | NULL | 1 | 3 | 5 |
| NULL | NULL | NULL | 2 | 4 | 6 |
+------+------+------+---+---+---+

mysql> CREATE TABLE tv5 (a INT, b INT, c INT)
     >     SELECT * FROM (VALUES ROW(1,3,5), ROW(2,4,6)) AS v(a,b,c);
mysql> TABLE tv5;
+------+------+------+
| a    | b    | c    |
+------+------+------+
|    1 |    3 |    5 |
|    2 |    4 |    6 |
+------+------+------+
```

When selecting all columns and using the default column names, you can omit `SELECT *`, so the statement just used to create table `tv1` can also be written as shown here:

```
mysql> CREATE TABLE tv1 VALUES ROW(1,3,5), ROW(2,4,6);
mysql> TABLE tv1;
+----------+----------+----------+
| column_0 | column_1 | column_2 |
+----------+----------+----------+
|        1 |        3 |        5 |
|        2 |        4 |        6 |
+----------+----------+----------+
```

When using `VALUES` as the source of the `SELECT`, all columns are always selected into the new table, and individual columns cannot be selected as they can be when selecting from a named table; each of the following statements produces an error (`ER_OPERAND_COLUMNS`):

```
CREATE TABLE tvx
    SELECT (x,z) FROM (VALUES ROW(1,3,5), ROW(2,4,6)) AS v(x,y,z);

CREATE TABLE tvx (a INT, c INT)
    SELECT (x,z) FROM (VALUES ROW(1,3,5), ROW(2,4,6)) AS v(x,y,z);
```

Similarly, you can use a `TABLE` statement in place of the `SELECT`. This follows the same rules as with `VALUES`; all columns of the source table and their names in the source table are always inserted into the new table. Examples:

```
mysql> TABLE t1;
+----+----+
| a  | b  |
+----+----+
|  1 |  2 |
|  6 |  7 |
| 10 | -4 |
| 14 |  6 |
+----+----+

mysql> CREATE TABLE tt1 TABLE t1;
mysql> TABLE tt1;
+----+----+
| a  | b  |
+----+----+
|  1 |  2 |
|  6 |  7 |
| 10 | -4 |
| 14 |  6 |
+----+----+

mysql> CREATE TABLE tt2 (x INT) TABLE t1;
mysql> TABLE tt2;
+------+----+----+
| x    | a  | b  |
+------+----+----+
| NULL |  1 |  2 |
| NULL |  6 |  7 |
| NULL | 10 | -4 |
| NULL | 14 |  6 |
+------+----+----+
```

Because the ordering of the rows in the underlying `SELECT` statements cannot always be determined, `CREATE TABLE ... IGNORE SELECT` and `CREATE TABLE ... REPLACE SELECT` statements are flagged as unsafe for statement-based replication. Such statements produce a warning in the error log when using statement-based mode and are written to the binary log using the row-based format when using `MIXED` mode. See also [Section 19.2.1.1, “Advantages and Disadvantages of Statement-Based and Row-Based Replication”](replication-sbr-rbr.html "19.2.1.1 Advantages and Disadvantages of Statement-Based and Row-Based Replication").

[`CREATE TABLE ... SELECT`](create-table.html "15.1.24 CREATE TABLE Statement") does not automatically create any indexes for you. This is done intentionally to make the statement as flexible as possible. If you want to have indexes in the created table, you should specify these before the `SELECT` statement:

```
mysql> CREATE TABLE bar (UNIQUE (n)) SELECT n FROM foo;
```

For `CREATE TABLE ... SELECT`, the destination table does not preserve information about whether columns in the selected-from table are generated columns. The `SELECT` part of the statement cannot assign values to generated columns in the destination table.

For `CREATE TABLE ... SELECT`, the destination table does preserve expression default values from the original table.

Some conversion of data types might occur. For example, the `AUTO_INCREMENT` attribute is not preserved, and `VARCHAR` columns can become `CHAR` columns. Retrained attributes are `NULL` (or `NOT NULL`) and, for those columns that have them, `CHARACTER SET`, `COLLATION`, `COMMENT`, and the `DEFAULT` clause.

When creating a table with [`CREATE TABLE ... SELECT`](create-table-select.html "15.1.24.4 CREATE TABLE ... SELECT Statement"), make sure to alias any function calls or expressions in the query. If you do not, the `CREATE` statement might fail or result in undesirable column names.

```
CREATE TABLE artists_and_works
  SELECT artist.name, COUNT(work.artist_id) AS number_of_works
  FROM artist LEFT JOIN work ON artist.id = work.artist_id
  GROUP BY artist.id;
```

You can also explicitly specify the data type for a column in the created table:

```
CREATE TABLE foo (a TINYINT NOT NULL) SELECT b+1 AS a FROM bar;
```

For [`CREATE TABLE ... SELECT`](create-table.html "15.1.24 CREATE TABLE Statement"), if `IF NOT EXISTS` is given and the target table exists, nothing is inserted into the destination table, and the statement is not logged.

To ensure that the binary log can be used to re-create the original tables, MySQL does not permit concurrent inserts during [`CREATE TABLE ... SELECT`](create-table.html "15.1.24 CREATE TABLE Statement"). For more information, see Section 15.1.1, “Atomic Data Definition Statement Support”.

You cannot use `FOR UPDATE` as part of the `SELECT` in a statement such as [`CREATE TABLE new_table SELECT ... FROM old_table ...`](create-table-select.html "15.1.24.4 CREATE TABLE ... SELECT Statement"). If you attempt to do so, the statement fails.

[`CREATE TABLE ... SELECT`](create-table-select.html "15.1.24.4 CREATE TABLE ... SELECT Statement") operations apply `ENGINE_ATTRIBUTE` and `SECONDARY_ENGINE_ATTRIBUTE` values to columns only. Table and index `ENGINE_ATTRIBUTE` and `SECONDARY_ENGINE_ATTRIBUTE` values are not applied to the new table unless specified explicitly.


#### 15.1.24.5 FOREIGN KEY Constraints

MySQL supports foreign keys, which permit cross-referencing related data across tables, and foreign key constraints, which help keep the related data consistent.

A foreign key relationship involves a parent table that holds the initial column values, and a child table with column values that reference the parent column values. A foreign key constraint is defined on the child table.

The essential syntax for a defining a foreign key constraint in a `CREATE TABLE` or `ALTER TABLE` statement includes the following:

```
[CONSTRAINT [symbol]] FOREIGN KEY
    [index_name] (col_name, ...)
    REFERENCES tbl_name (col_name,...)
    [ON DELETE reference_option]
    [ON UPDATE reference_option]

reference_option:
    RESTRICT | CASCADE | SET NULL | NO ACTION | SET DEFAULT
```

Foreign key constraint usage is described under the following topics in this section:

* Identifiers
* Conditions and Restrictions
* Referential Actions
* Foreign Key Constraint Examples
* Adding Foreign Key Constraints
* Dropping Foreign Key Constraints
* Foreign Key Checks
* Locking
* Foreign Key Definitions and Metadata
* Foreign Key Errors

##### Identifiers

Foreign key constraint naming is governed by the following rules:

* The `CONSTRAINT` *`symbol`* value is used, if defined.

* If the `CONSTRAINT` *`symbol`* clause is not defined, or a symbol is not included following the `CONSTRAINT` keyword, a constraint name name is generated automatically.

  If the `CONSTRAINT` *`symbol`* clause is not defined, or a symbol is not included following the `CONSTRAINT` keyword, both `InnoDB` and `NDB` storage engines ignore `FOREIGN_KEY index_name`.

* The `CONSTRAINT symbol` value, if defined, must be unique in the database. A duplicate *`symbol`* results in an error similar to: ERROR 1005 (HY000): Can't create table 'test.fk1' (errno: 121).

* NDB Cluster stores foreign key names using the same lettercase with which they are created.

Table and column identifiers in a `FOREIGN KEY ... REFERENCES` clause can be quoted within backticks (`` ` ``). Alternatively, double quotation marks (`"`) can be used if the `ANSI_QUOTES` SQL mode is enabled. The `lower_case_table_names` system variable setting is also taken into account.

##### Conditions and Restrictions

Foreign key constraints are subject to the following conditions and restrictions:

* Parent and child tables must use the same storage engine, and they cannot be defined as temporary tables.

* Creating a foreign key constraint requires the `REFERENCES` privilege on the parent table.

* Corresponding columns in the foreign key and the referenced key must have similar data types. *The size and sign of fixed precision types such as `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") and `DECIMAL` - DECIMAL, NUMERIC") must be the same*. The length of string types need not be the same. For nonbinary (character) string columns, the character set and collation must be the same.

* MySQL supports foreign key references between one column and another within a table. (A column cannot have a foreign key reference to itself.) In these cases, a “child table record” refers to a dependent record within the same table.

* MySQL requires indexes on foreign keys and referenced keys so that foreign key checks can be fast and not require a table scan. In the referencing table, there must be an index where the foreign key columns are listed as the *first* columns in the same order. Such an index is created on the referencing table automatically if it does not exist. This index might be silently dropped later if you create another index that can be used to enforce the foreign key constraint. *`index_name`*, if given, is used as described previously.

* Previously, `InnoDB` allowed a foreign key to reference any index column or group of columns, even a non-unique index or partial index, an extension of standard SQL. This is still allowed for backwards compatibility, but is now deprecated; in addition, it must be enabled by setting `restrict_fk_on_non_standard_key`. If this is done, there must still be an index in the referenced table where the referenced columns are the *first* columns in the same order. Hidden columns that `InnoDB` adds to an index are also considered in such cases (see Section 17.6.2.1, “Clustered and Secondary Indexes”). You should expect support for use of nonstandard keys to be removed in a future version of MySQL, and migrate away from their use.

  `NDB` always requires an explicit unique key (or primary key) on any column referenced as a foreign key.

* Index prefixes on foreign key columns are not supported. Consequently, `BLOB` and `TEXT` columns cannot be included in a foreign key because indexes on those columns must always include a prefix length.

* `InnoDB` does not currently support foreign keys for tables with user-defined partitioning. This includes both parent and child tables.

  This restriction does not apply for `NDB` tables that are partitioned by `KEY` or `LINEAR KEY` (the only user partitioning types supported by the `NDB` storage engine); these may have foreign key references or be the targets of such references.

* A table in a foreign key relationship cannot be altered to use another storage engine. To change the storage engine, you must drop any foreign key constraints first.

* A foreign key constraint cannot reference a virtual generated column.

For information about how the MySQL implementation of foreign key constraints differs from the SQL standard, see Section 1.7.2.3, “FOREIGN KEY Constraint Differences”.

##### Referential Actions

When an `UPDATE` or `DELETE` operation affects a key value in the parent table that has matching rows in the child table, the result depends on the *referential action* specified by `ON UPDATE` and `ON DELETE` subclauses of the `FOREIGN KEY` clause. Referential actions include:

* `CASCADE`: Delete or update the row from the parent table and automatically delete or update the matching rows in the child table. Both `ON DELETE CASCADE` and `ON UPDATE CASCADE` are supported. Between two tables, do not define several `ON UPDATE CASCADE` clauses that act on the same column in the parent table or in the child table.

  If a `FOREIGN KEY` clause is defined on both tables in a foreign key relationship, making both tables a parent and child, an `ON UPDATE CASCADE` or `ON DELETE CASCADE` subclause defined for one `FOREIGN KEY` clause must be defined for the other in order for cascading operations to succeed. If an `ON UPDATE CASCADE` or `ON DELETE CASCADE` subclause is only defined for one `FOREIGN KEY` clause, cascading operations fail with an error.

  Note

  Cascaded foreign key actions do not activate triggers.

* `SET NULL`: Delete or update the row from the parent table and set the foreign key column or columns in the child table to `NULL`. Both `ON DELETE SET NULL` and `ON UPDATE SET NULL` clauses are supported.

  If you specify a `SET NULL` action, *make sure that you have not declared the columns in the child table as `NOT NULL`*.

* `RESTRICT`: Rejects the delete or update operation for the parent table. Specifying `RESTRICT` (or `NO ACTION`) is the same as omitting the `ON DELETE` or `ON UPDATE` clause.

* `NO ACTION`: A keyword from standard SQL. For `InnoDB`, this is equivalent to `RESTRICT`; the delete or update operation for the parent table is immediately rejected if there is a related foreign key value in the referenced table. `NDB` supports deferred checks, and `NO ACTION` specifies a deferred check; when this is used, constraint checks are not performed until commit time. Note that for `NDB` tables, this causes all foreign key checks made for both parent and child tables to be deferred.

* `SET DEFAULT`: This action is recognized by the MySQL parser, but both `InnoDB` and `NDB` reject table definitions containing `ON DELETE SET DEFAULT` or `ON UPDATE SET DEFAULT` clauses.

For storage engines that support foreign keys, MySQL rejects any `INSERT` or `UPDATE` operation that attempts to create a foreign key value in a child table if there is no matching candidate key value in the parent table.

For an `ON DELETE` or `ON UPDATE` that is not specified, the default action is always `NO ACTION`.

As the default, an `ON DELETE NO ACTION` or `ON UPDATE NO ACTION` clause that is specified explicitly does not appear in `SHOW CREATE TABLE` output or in tables dumped with **mysqldump**. `RESTRICT`, which is an equivalent non-default keyword, appears in [`SHOW CREATE TABLE`](show-create-table.html "15.7.7.12 SHOW CREATE TABLE Statement") output and in tables dumped with **mysqldump**.

For `NDB` tables, `ON UPDATE CASCADE` is not supported where the reference is to the parent table's primary key.

For `NDB` tables, `ON DELETE CASCADE` is not supported where the child table contains one or more columns of any of the `TEXT` or `BLOB` types. (Bug #89511, Bug #27484882)

`InnoDB` performs cascading operations using a depth-first search algorithm on the records of the index that corresponds to the foreign key constraint.

A foreign key constraint on a stored generated column cannot use `CASCADE`, `SET NULL`, or `SET DEFAULT` as `ON UPDATE` referential actions, nor can it use `SET NULL` or `SET DEFAULT` as `ON DELETE` referential actions.

A foreign key constraint on the base column of a stored generated column cannot use `CASCADE`, `SET NULL`, or `SET DEFAULT` as `ON UPDATE` or `ON DELETE` referential actions.

##### Foreign Key Constraint Examples

This simple example relates `parent` and `child` tables through a single-column foreign key:

```
CREATE TABLE parent (
    id INT NOT NULL,
    PRIMARY KEY (id)
) ENGINE=INNODB;

CREATE TABLE child (
    id INT,
    parent_id INT,
    INDEX par_ind (parent_id),
    FOREIGN KEY (parent_id)
        REFERENCES parent(id)
        ON DELETE CASCADE
) ENGINE=INNODB;
```

MySQL 9.5 supports inline `REFERENCE` clauses as well as implicit parent table primary keys, so the second `CREATE TABLE` statement can be rewritten as shown here:

```
CREATE TABLE child (
    id INT,
    parent_id INT NOT NULL REFERENCES parent ON DELETE CASCADE,
    INDEX par_ind (parent_id)
) ENGINE=INNODB;
```

This is a more complex example in which a `product_order` table has foreign keys for two other tables. One foreign key references a two-column index in the `product` table. The other references a single-column index in the `customer` table:

```
CREATE TABLE product (
    category INT NOT NULL, id INT NOT NULL,
    price DECIMAL,
    PRIMARY KEY(category, id)
)   ENGINE=INNODB;

CREATE TABLE customer (
    id INT NOT NULL,
    PRIMARY KEY (id)
)   ENGINE=INNODB;

CREATE TABLE product_order (
    no INT NOT NULL AUTO_INCREMENT,
    product_category INT NOT NULL,
    product_id INT NOT NULL,
    customer_id INT NOT NULL,

    PRIMARY KEY(no),
    INDEX (product_category, product_id),
    INDEX (customer_id),

    FOREIGN KEY (product_category, product_id)
      REFERENCES product(category, id)
      ON UPDATE CASCADE ON DELETE RESTRICT,

    FOREIGN KEY (customer_id)
      REFERENCES customer(id)
)   ENGINE=INNODB;
```

##### Adding Foreign Key Constraints

You can add a foreign key constraint to an existing table using the following `ALTER TABLE` syntax:

```
ALTER TABLE tbl_name
    ADD [CONSTRAINT [symbol]] FOREIGN KEY
    [index_name] (col_name, ...)
    REFERENCES tbl_name (col_name,...)
    [ON DELETE reference_option]
    [ON UPDATE reference_option]
```

The foreign key can be self referential (referring to the same table). When you add a foreign key constraint to a table using `ALTER TABLE`, *remember to first create an index on the column(s) referenced by the foreign key.*

##### Dropping Foreign Key Constraints

You can drop a foreign key constraint using the following `ALTER TABLE` syntax:

```
ALTER TABLE tbl_name DROP FOREIGN KEY fk_symbol;
```

If the `FOREIGN KEY` clause defined a `CONSTRAINT` name when you created the constraint, you can refer to that name to drop the foreign key constraint. Otherwise, a constraint name was generated internally, and you must use that value. To determine the foreign key constraint name, use [`SHOW CREATE TABLE`](show-create-table.html "15.7.7.12 SHOW CREATE TABLE Statement"):

```
mysql> SHOW CREATE TABLE child\G
*************************** 1. row ***************************
       Table: child
Create Table: CREATE TABLE `child` (
  `id` int DEFAULT NULL,
  `parent_id` int NOT NULL,
  KEY `par_ind` (`parent_id`),
  CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`)
  REFERENCES `parent` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

mysql> ALTER TABLE child DROP FOREIGN KEY `child_ibfk_1`;
```

Adding and dropping a foreign key in the same `ALTER TABLE` statement is supported for [`ALTER TABLE ... ALGORITHM=INPLACE`](alter-table.html "15.1.11 ALTER TABLE Statement"). It is not supported for [`ALTER TABLE ... ALGORITHM=COPY`](alter-table.html "15.1.11 ALTER TABLE Statement").

##### Foreign Key Checks

In MySQL, InnoDB and NDB tables support checking of foreign key constraints. Foreign key checking is controlled by the `foreign_key_checks` variable, which is enabled by default. Typically, you leave this variable enabled during normal operation to enforce referential integrity. The `foreign_key_checks` variable has the same effect on `NDB` tables as it does for `InnoDB` tables.

The `foreign_key_checks` variable is dynamic and supports both global and session scopes. For information about using system variables, see Section 7.1.9, “Using System Variables”.

Disabling foreign key checking is useful when:

* Dropping a table that is referenced by a foreign key constraint. A referenced table can only be dropped after `foreign_key_checks` is disabled. When you drop a table, constraints defined on the table are also dropped.

* Reloading tables in different order than required by their foreign key relationships. For example, **mysqldump** produces correct definitions of tables in the dump file, including foreign key constraints for child tables. To make it easier to reload dump files for tables with foreign key relationships, **mysqldump** automatically includes a statement in the dump output that disables `foreign_key_checks`. This enables you to import the tables in any order in case the dump file contains tables that are not correctly ordered for foreign keys. Disabling `foreign_key_checks` also speeds up the import operation by avoiding foreign key checks.

* Executing `LOAD DATA` operations, to avoid foreign key checking.

* Performing an `ALTER TABLE` operation on a table that has a foreign key relationship.

When `foreign_key_checks` is disabled, foreign key constraints are ignored, with the following exceptions:

* Recreating a table that was previously dropped returns an error if the table definition does not conform to the foreign key constraints that reference the table. The table must have the correct column names and types. It must also have indexes on the referenced keys. If these requirements are not satisfied, MySQL returns Error 1005 that refers to errno: 150 in the error message, which means that a foreign key constraint was not correctly formed.

* Altering a table returns an error (errno: 150) if a foreign key definition is incorrectly formed for the altered table.

* Dropping an index required by a foreign key constraint. The foreign key constraint must be removed before dropping the index.

* Creating a foreign key constraint where a column references a nonmatching column type.

Disabling `foreign_key_checks` has these additional implications:

* It is permitted to drop a database that contains tables with foreign keys that are referenced by tables outside the database.

* It is permitted to drop a table with foreign keys referenced by other tables.

* Enabling `foreign_key_checks` does not trigger a scan of table data, which means that rows added to a table while `foreign_key_checks` is disabled are not checked for consistency when `foreign_key_checks` is re-enabled.

##### Locking

MySQL extends metadata locks, as necessary, to tables that are related by a foreign key constraint. Extending metadata locks prevents conflicting DML and DDL operations from executing concurrently on related tables. This feature also enables updates to foreign key metadata when a parent table is modified. In earlier MySQL releases, foreign key metadata, which is owned by the child table, could not be updated safely.

If a table is locked explicitly with [`LOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements"), any tables related by a foreign key constraint are opened and locked implicitly. For foreign key checks, a shared read-only lock ([`LOCK TABLES READ`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements")) is taken on related tables. For cascading updates, a shared-nothing write lock ([`LOCK TABLES WRITE`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements")) is taken on related tables that are involved in the operation.

##### Foreign Key Definitions and Metadata

To view a foreign key definition, use `SHOW CREATE TABLE`:

```
mysql> SHOW CREATE TABLE child\G
*************************** 1. row ***************************
       Table: child
Create Table: CREATE TABLE `child` (
  `id` int DEFAULT NULL,
  `parent_id` int NOT NULL,
  KEY `par_ind` (`parent_id`),
  CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`)
  REFERENCES `parent` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

You can obtain information about foreign keys from the Information Schema `KEY_COLUMN_USAGE` table. An example of a query against this table is shown here:

```
mysql> SELECT TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME
       FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
       WHERE REFERENCED_TABLE_SCHEMA IS NOT NULL;
+--------------+------------+-------------+-----------------+
| TABLE_SCHEMA | TABLE_NAME | COLUMN_NAME | CONSTRAINT_NAME |
+--------------+------------+-------------+-----------------+
| test         | child      | parent_id   | child_ibfk_1    |
+--------------+------------+-------------+-----------------+
```

You can obtain information specific to `InnoDB` foreign keys from the `INNODB_FOREIGN` and `INNODB_FOREIGN_COLS` tables. Example queries are show here:

```
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FOREIGN \G
*************************** 1. row ***************************
      ID: test/child_ibfk_1
FOR_NAME: test/child
REF_NAME: test/parent
  N_COLS: 1
    TYPE: 1

mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_FOREIGN_COLS \G
*************************** 1. row ***************************
          ID: test/child_ibfk_1
FOR_COL_NAME: parent_id
REF_COL_NAME: id
         POS: 0
```

##### Foreign Key Errors

In the event of a foreign key error involving `InnoDB` tables (usually Error 150 in the MySQL Server), information about the latest foreign key error can be obtained by checking [`SHOW ENGINE INNODB STATUS`](show-engine.html "15.7.7.17 SHOW ENGINE Statement") output.

```
mysql> SHOW ENGINE INNODB STATUS\G
...
------------------------
LATEST FOREIGN KEY ERROR
------------------------
2018-04-12 14:57:24 0x7f97a9c91700 Transaction:
TRANSACTION 7717, ACTIVE 0 sec inserting
mysql tables in use 1, locked 1
4 lock struct(s), heap size 1136, 3 row lock(s), undo log entries 3
MySQL thread id 8, OS thread handle 140289365317376, query id 14 localhost root update
INSERT INTO child VALUES (NULL, 1), (NULL, 2), (NULL, 3), (NULL, 4), (NULL, 5), (NULL, 6)
Foreign key constraint fails for table `test`.`child`:
,
  CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `parent` (`id`) ON DELETE
  CASCADE ON UPDATE CASCADE
Trying to add in child table, in index par_ind tuple:
DATA TUPLE: 2 fields;
 0: len 4; hex 80000003; asc     ;;
 1: len 4; hex 80000003; asc     ;;

But in parent table `test`.`parent`, in index PRIMARY,
the closest match we can find is record:
PHYSICAL RECORD: n_fields 3; compact format; info bits 0
 0: len 4; hex 80000004; asc     ;;
 1: len 6; hex 000000001e19; asc       ;;
 2: len 7; hex 81000001110137; asc       7;;
...
```

Warning

If a user has table-level privileges for all parent tables, `ER_NO_REFERENCED_ROW_2` and `ER_ROW_IS_REFERENCED_2` error messages for foreign key operations expose information about parent tables. If a user does not have table-level privileges for all parent tables, more generic error messages are displayed instead (`ER_NO_REFERENCED_ROW` and `ER_ROW_IS_REFERENCED`).

An exception is that, for stored programs defined to execute with `DEFINER` privileges, the user against which privileges are assessed is the user in the program `DEFINER` clause, not the invoking user. If that user has table-level parent table privileges, parent table information is still displayed. In this case, it is the responsibility of the stored program creator to hide the information by including appropriate condition handlers.


#### 15.1.24.6 CHECK Constraints

`CREATE TABLE` permits the core features of table and column `CHECK` constraints, for all storage engines. `CREATE TABLE` permits the following `CHECK` constraint syntax, for both table constraints and column constraints:

```
[CONSTRAINT [symbol]] CHECK (expr) [[NOT] ENFORCED]
```

The optional *`symbol`* specifies a name for the constraint. If omitted, MySQL generates a name from the table name, a literal `_chk_`, and an ordinal number (1, 2, 3, ...). Constraint names have a maximum length of 64 characters. They are case-sensitive, but not accent-sensitive.

*`expr`* specifies the constraint condition as a boolean expression that must evaluate to `TRUE` or `UNKNOWN` (for `NULL` values) for each row of the table. If the condition evaluates to `FALSE`, it fails and a constraint violation occurs. The effect of a violation depends on the statement being executed, as described later in this section.

The optional enforcement clause indicates whether the constraint is enforced:

* If omitted or specified as `ENFORCED`, the constraint is created and enforced.

* If specified as `NOT ENFORCED`, the constraint is created but not enforced.

A `CHECK` constraint is specified as either a table constraint or column constraint:

* A table constraint does not appear within a column definition and can refer to any table column or columns. Forward references are permitted to columns appearing later in the table definition.

* A column constraint appears within a column definition and can refer only to that column.

Consider this table definition:

```
CREATE TABLE t1
(
  CHECK (c1 <> c2),
  c1 INT CHECK (c1 > 10),
  c2 INT CONSTRAINT c2_positive CHECK (c2 > 0),
  c3 INT CHECK (c3 < 100),
  CONSTRAINT c1_nonzero CHECK (c1 <> 0),
  CHECK (c1 > c3)
);
```

The definition includes table constraints and column constraints, in named and unnamed formats:

* The first constraint is a table constraint: It occurs outside any column definition, so it can (and does) refer to multiple table columns. This constraint contains forward references to columns not defined yet. No constraint name is specified, so MySQL generates a name.

* The next three constraints are column constraints: Each occurs within a column definition, and thus can refer only to the column being defined. One of the constraints is named explicitly. MySQL generates a name for each of the other two.

* The last two constraints are table constraints. One of them is named explicitly. MySQL generates a name for the other one.

As mentioned, MySQL generates a name for any `CHECK` constraint specified without one. To see the names generated for the preceding table definition, use `SHOW CREATE TABLE`:

```
mysql> SHOW CREATE TABLE t1\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t1` (
  `c1` int(11) DEFAULT NULL,
  `c2` int(11) DEFAULT NULL,
  `c3` int(11) DEFAULT NULL,
  CONSTRAINT `c1_nonzero` CHECK ((`c1` <> 0)),
  CONSTRAINT `c2_positive` CHECK ((`c2` > 0)),
  CONSTRAINT `t1_chk_1` CHECK ((`c1` <> `c2`)),
  CONSTRAINT `t1_chk_2` CHECK ((`c1` > 10)),
  CONSTRAINT `t1_chk_3` CHECK ((`c3` < 100)),
  CONSTRAINT `t1_chk_4` CHECK ((`c1` > `c3`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

The SQL standard specifies that all types of constraints (primary key, unique index, foreign key, check) belong to the same namespace. In MySQL, each constraint type has its own namespace per schema (database). Consequently, `CHECK` constraint names must be unique per schema; no two tables in the same schema can share a `CHECK` constraint name. (Exception: A `TEMPORARY` table hides a non-`TEMPORARY` table of the same name, so it can have the same `CHECK` constraint names as well.)

Beginning generated constraint names with the table name helps ensure schema uniqueness because table names also must be unique within the schema.

`CHECK` condition expressions must adhere to the following rules. An error occurs if an expression contains disallowed constructs.

* Nongenerated and generated columns are permitted, except columns with the `AUTO_INCREMENT` attribute and columns in other tables.

* Literals, deterministic built-in functions, and operators are permitted. A function is deterministic if, given the same data in tables, multiple invocations produce the same result, independently of the connected user. Examples of functions that are nondeterministic and fail this definition: `CONNECTION_ID()`, `CURRENT_USER()`, `NOW()`.

* Stored functions and loadable functions are not permitted.
* Stored procedure and function parameters are not permitted.
* Variables (system variables, user-defined variables, and stored program local variables) are not permitted.

* Subqueries are not permitted.

Foreign key referential actions (`ON UPDATE`, `ON DELETE`) are prohibited on columns used in `CHECK` constraints. Likewise, `CHECK` constraints are prohibited on columns used in foreign key referential actions.

`CHECK` constraints are evaluated for `INSERT`, `UPDATE`, `REPLACE`, `LOAD DATA`, and `LOAD XML` statements and an error occurs if a constraint evaluates to `FALSE`. If an error occurs, handling of changes already applied differs for transactional and nontransactional storage engines, and also depends on whether strict SQL mode is in effect, as described in Strict SQL Mode.

`CHECK` constraints are evaluated for `INSERT IGNORE`, `UPDATE IGNORE`, [`LOAD DATA ... IGNORE`](load-data.html "15.2.9 LOAD DATA Statement"), and [`LOAD XML ... IGNORE`](load-xml.html "15.2.10 LOAD XML Statement") statements and a warning occurs if a constraint evaluates to `FALSE`. The insert or update for any offending row is skipped.

If the constraint expression evaluates to a data type that differs from the declared column type, implicit coercion to the declared type occurs according to the usual MySQL type-conversion rules. See Section 14.3, “Type Conversion in Expression Evaluation”. If type conversion fails or results in a loss of precision, an error occurs.

Note

Constraint expression evaluation uses the SQL mode in effect at evaluation time. If any component of the expression depends on the SQL mode, different results may occur for different uses of the table unless the SQL mode is the same during all uses.

The Information Schema `CHECK_CONSTRAINTS` table provides information about `CHECK` constraints defined on tables. See Section 28.3.5, “The INFORMATION_SCHEMA CHECK_CONSTRAINTS Table”.


#### 15.1.24.7 Silent Column Specification Changes

In some cases, MySQL silently changes column specifications from those given in a `CREATE TABLE` or `ALTER TABLE` statement. These might be changes to a data type, to attributes associated with a data type, or to an index specification.

All changes are subject to the internal row-size limit of 65,535 bytes, which may cause some attempts at data type changes to fail. See Section 10.4.7, “Limits on Table Column Count and Row Size”.

* Columns that are part of a `PRIMARY KEY` are made `NOT NULL` even if not declared that way.

* Trailing spaces are automatically deleted from `ENUM` and `SET` member values when the table is created.

* MySQL maps certain data types used by other SQL database vendors to MySQL types. See Section 13.9, “Using Data Types from Other Database Engines”.

* If you include a `USING` clause to specify an index type that is not permitted for a given storage engine, but there is another index type available that the engine can use without affecting query results, the engine uses the available type.

* If strict SQL mode is not enabled, a `VARCHAR` column with a length specification greater than 65535 is converted to `TEXT`, and a `VARBINARY` column with a length specification greater than 65535 is converted to `BLOB`. Otherwise, an error occurs in either of these cases.

* Specifying the `CHARACTER SET binary` attribute for a character data type causes the column to be created as the corresponding binary data type: `CHAR` becomes `BINARY`, `VARCHAR` becomes `VARBINARY`, and `TEXT` becomes `BLOB`. For the `ENUM` and `SET` data types, this does not occur; they are created as declared. Suppose that you specify a table using this definition:

  ```
  CREATE TABLE t
  (
    c1 VARCHAR(10) CHARACTER SET binary,
    c2 TEXT CHARACTER SET binary,
    c3 ENUM('a','b','c') CHARACTER SET binary
  );
  ```

  The resulting table has this definition:

  ```
  CREATE TABLE t
  (
    c1 VARBINARY(10),
    c2 BLOB,
    c3 ENUM('a','b','c') CHARACTER SET binary
  );
  ```

To see whether MySQL used a data type other than the one you specified, issue a `DESCRIBE` or `SHOW CREATE TABLE` statement after creating or altering the table.

Certain other data type changes can occur if you compress a table using **myisampack**. See Section 18.2.3.3, “Compressed Table Characteristics”.


#### 15.1.24.8 CREATE TABLE and Generated Columns

`CREATE TABLE` supports the specification of generated columns. Values of a generated column are computed from an expression included in the column definition.

Generated columns are also supported by the `NDB` storage engine.

The following simple example shows a table that stores the lengths of the sides of right triangles in the `sidea` and `sideb` columns, and computes the length of the hypotenuse in `sidec` (the square root of the sums of the squares of the other sides):

```
CREATE TABLE triangle (
  sidea DOUBLE,
  sideb DOUBLE,
  sidec DOUBLE AS (SQRT(sidea * sidea + sideb * sideb))
);
INSERT INTO triangle (sidea, sideb) VALUES(1,1),(3,4),(6,8);
```

Selecting from the table yields this result:

```
mysql> SELECT * FROM triangle;
+-------+-------+--------------------+
| sidea | sideb | sidec              |
+-------+-------+--------------------+
|     1 |     1 | 1.4142135623730951 |
|     3 |     4 |                  5 |
|     6 |     8 |                 10 |
+-------+-------+--------------------+
```

Any application that uses the `triangle` table has access to the hypotenuse values without having to specify the expression that calculates them.

Generated column definitions have this syntax:

```
col_name data_type [GENERATED ALWAYS] AS (expr)
  [VIRTUAL | STORED] [NOT NULL | NULL]
  [UNIQUE [KEY]] [[PRIMARY] KEY]
  [COMMENT 'string']
```

`AS (expr)` indicates that the column is generated and defines the expression used to compute column values. `AS` may be preceded by `GENERATED ALWAYS` to make the generated nature of the column more explicit. Constructs that are permitted or prohibited in the expression are discussed later.

The `VIRTUAL` or `STORED` keyword indicates how column values are stored, which has implications for column use:

* `VIRTUAL`: Column values are not stored, but are evaluated when rows are read, immediately after any `BEFORE` triggers. A virtual column takes no storage.

  `InnoDB` supports secondary indexes on virtual columns. See Section 15.1.24.9, “Secondary Indexes and Generated Columns”.

* `STORED`: Column values are evaluated and stored when rows are inserted or updated. A stored column does require storage space and can be indexed.

The default is `VIRTUAL` if neither keyword is specified.

It is permitted to mix `VIRTUAL` and `STORED` columns within a table.

Other attributes may be given to indicate whether the column is indexed or can be `NULL`, or provide a comment.

Generated column expressions must adhere to the following rules. An error occurs if an expression contains disallowed constructs.

* Literals, deterministic built-in functions, and operators are permitted. A function is deterministic if, given the same data in tables, multiple invocations produce the same result, independently of the connected user. Examples of functions that are nondeterministic and fail this definition: `CONNECTION_ID()`, `CURRENT_USER()`, `NOW()`.

* Stored functions and loadable functions are not permitted.
* Stored procedure and function parameters are not permitted.
* Variables (system variables, user-defined variables, and stored program local variables) are not permitted.

* Subqueries are not permitted.
* A generated column definition can refer to other generated columns, but only those occurring earlier in the table definition. A generated column definition can refer to any base (nongenerated) column in the table whether its definition occurs earlier or later.

* The `AUTO_INCREMENT` attribute cannot be used in a generated column definition.

* An `AUTO_INCREMENT` column cannot be used as a base column in a generated column definition.

* If expression evaluation causes truncation or provides incorrect input to a function, the `CREATE TABLE` statement terminates with an error and the DDL operation is rejected.

If the expression evaluates to a data type that differs from the declared column type, implicit coercion to the declared type occurs according to the usual MySQL type-conversion rules. See Section 14.3, “Type Conversion in Expression Evaluation”.

If a generated column uses the `TIMESTAMP` data type, the setting for `explicit_defaults_for_timestamp` is ignored. In such cases, if this variable is disabled then `NULL` is not converted to `CURRENT_TIMESTAMP`. If the column is also declared as `NOT NULL`, attempting to insert `NULL` is explicitly rejected with `ER_BAD_NULL_ERROR`.

Note

Expression evaluation uses the SQL mode in effect at evaluation time. If any component of the expression depends on the SQL mode, different results may occur for different uses of the table unless the SQL mode is the same during all uses.

For [`CREATE TABLE ... LIKE`](create-table-like.html "15.1.24.3 CREATE TABLE ... LIKE Statement"), the destination table preserves generated column information from the original table.

For [`CREATE TABLE ... SELECT`](create-table-select.html "15.1.24.4 CREATE TABLE ... SELECT Statement"), the destination table does not preserve information about whether columns in the selected-from table are generated columns. The `SELECT` part of the statement cannot assign values to generated columns in the destination table.

Partitioning by generated columns is permitted. See Table Partitioning.

A foreign key constraint on a stored generated column cannot use `CASCADE`, `SET NULL`, or `SET DEFAULT` as `ON UPDATE` referential actions, nor can it use `SET NULL` or `SET DEFAULT` as `ON DELETE` referential actions.

A foreign key constraint on the base column of a stored generated column cannot use `CASCADE`, `SET NULL`, or `SET DEFAULT` as `ON UPDATE` or `ON DELETE` referential actions.

A foreign key constraint cannot reference a virtual generated column.

Triggers cannot use `NEW.col_name` or use `OLD.col_name` to refer to generated columns.

For `INSERT`, `REPLACE`, and `UPDATE`, if a generated column is inserted into, replaced, or updated explicitly, the only permitted value is `DEFAULT`.

A generated column in a view is considered updatable because it is possible to assign to it. However, if such a column is updated explicitly, the only permitted value is `DEFAULT`.

Generated columns have several use cases, such as these:

* Virtual generated columns can be used as a way to simplify and unify queries. A complicated condition can be defined as a generated column and referred to from multiple queries on the table to ensure that all of them use exactly the same condition.

* Stored generated columns can be used as a materialized cache for complicated conditions that are costly to calculate on the fly.

* Generated columns can simulate functional indexes: Use a generated column to define a functional expression and index it. This can be useful for working with columns of types that cannot be indexed directly, such as `JSON` columns; see Indexing a Generated Column to Provide a JSON Column Index, for a detailed example.

  For stored generated columns, the disadvantage of this approach is that values are stored twice; once as the value of the generated column and once in the index.

* If a generated column is indexed, the optimizer recognizes query expressions that match the column definition and uses indexes from the column as appropriate during query execution, even if a query does not refer to the column directly by name. For details, see Section 10.3.11, “Optimizer Use of Generated Column Indexes”.

Example:

Suppose that a table `t1` contains `first_name` and `last_name` columns and that applications frequently construct the full name using an expression like this:

```
SELECT CONCAT(first_name,' ',last_name) AS full_name FROM t1;
```

One way to avoid writing out the expression is to create a view `v1` on `t1`, which simplifies applications by enabling them to select `full_name` directly without using an expression:

```
CREATE VIEW v1 AS
SELECT *, CONCAT(first_name,' ',last_name) AS full_name FROM t1;

SELECT full_name FROM v1;
```

A generated column also enables applications to select `full_name` directly without the need to define a view:

```
CREATE TABLE t1 (
  first_name VARCHAR(10),
  last_name VARCHAR(10),
  full_name VARCHAR(255) AS (CONCAT(first_name,' ',last_name))
);

SELECT full_name FROM t1;
```


#### 15.1.24.9 Secondary Indexes and Generated Columns

`InnoDB` supports secondary indexes on virtual generated columns. Other index types are not supported. A secondary index defined on a virtual column is sometimes referred to as a “virtual index”.

A secondary index may be created on one or more virtual columns or on a combination of virtual columns and regular columns or stored generated columns. Secondary indexes that include virtual columns may be defined as `UNIQUE`.

When a secondary index is created on a virtual generated column, generated column values are materialized in the records of the index. If the index is a covering index (one that includes all the columns retrieved by a query), generated column values are retrieved from materialized values in the index structure instead of computed “on the fly”.

There are additional write costs to consider when using a secondary index on a virtual column due to computation performed when materializing virtual column values in secondary index records during `INSERT` and `UPDATE` operations. Even with additional write costs, secondary indexes on virtual columns may be preferable to generated *stored* columns, which are materialized in the clustered index, resulting in larger tables that require more disk space and memory. If a secondary index is not defined on a virtual column, there are additional costs for reads, as virtual column values must be computed each time the column's row is examined.

Values of an indexed virtual column are MVCC-logged to avoid unnecessary recomputation of generated column values during rollback or during a purge operation. The data length of logged values is limited by the index key limit of 767 bytes for `COMPACT` and `REDUNDANT` row formats, and 3072 bytes for `DYNAMIC` and `COMPRESSED` row formats.

Adding or dropping a secondary index on a virtual column is an in-place operation.

##### Indexing a Generated Column to Provide a JSON Column Index

As noted elsewhere, `JSON` columns cannot be indexed directly. To create an index that references such a column indirectly, you can define a generated column that extracts the information that should be indexed, then create an index on the generated column, as shown in this example:

```
mysql> CREATE TABLE jemp (
    ->     c JSON,
    ->     g INT GENERATED ALWAYS AS (c->"$.id"),
    ->     INDEX i (g)
    -> );
Query OK, 0 rows affected (0.28 sec)

mysql> INSERT INTO jemp (c) VALUES
     >   ('{"id": "1", "name": "Fred"}'), ('{"id": "2", "name": "Wilma"}'),
     >   ('{"id": "3", "name": "Barney"}'), ('{"id": "4", "name": "Betty"}');
Query OK, 4 rows affected (0.04 sec)
Records: 4  Duplicates: 0  Warnings: 0

mysql> SELECT c->>"$.name" AS name
     >     FROM jemp WHERE g > 2;
+--------+
| name   |
+--------+
| Barney |
| Betty  |
+--------+
2 rows in set (0.00 sec)

mysql> EXPLAIN SELECT c->>"$.name" AS name
     >    FROM jemp WHERE g > 2\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: jemp
   partitions: NULL
         type: range
possible_keys: i
          key: i
      key_len: 5
          ref: NULL
         rows: 2
     filtered: 100.00
        Extra: Using where
1 row in set, 1 warning (0.00 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1003
Message: /* select#1 */ select json_unquote(json_extract(`test`.`jemp`.`c`,'$.name'))
AS `name` from `test`.`jemp` where (`test`.`jemp`.`g` > 2)
1 row in set (0.00 sec)
```

(We have wrapped the output from the last statement in this example to fit the viewing area.)

When you use `EXPLAIN` on a `SELECT` or other SQL statement containing one or more expressions that use the `->` or `->>` operator, these expressions are translated into their equivalents using `JSON_EXTRACT()` and (if needed) `JSON_UNQUOTE()` instead, as shown here in the output from [`SHOW WARNINGS`](show-warnings.html "15.7.7.43 SHOW WARNINGS Statement") immediately following this `EXPLAIN` statement:

```
mysql> EXPLAIN SELECT c->>"$.name"
     > FROM jemp WHERE g > 2 ORDER BY c->"$.name"\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: jemp
   partitions: NULL
         type: range
possible_keys: i
          key: i
      key_len: 5
          ref: NULL
         rows: 2
     filtered: 100.00
        Extra: Using where; Using filesort
1 row in set, 1 warning (0.00 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1003
Message: /* select#1 */ select json_unquote(json_extract(`test`.`jemp`.`c`,'$.name')) AS
`c->>"$.name"` from `test`.`jemp` where (`test`.`jemp`.`g` > 2) order by
json_extract(`test`.`jemp`.`c`,'$.name')
1 row in set (0.00 sec)
```

See the descriptions of the `->` and `->>` operators, as well as those of the `JSON_EXTRACT()` and `JSON_UNQUOTE()` functions, for additional information and examples.

This technique also can be used to provide indexes that indirectly reference columns of other types that cannot be indexed directly, such as `GEOMETRY` columns.

It is also possible to create an index on a `JSON` column using the `JSON_VALUE()` function with an expression that can be used to optimize queries employing the expression. See the description of that function for more information and examples.

###### JSON columns and indirect indexing in NDB Cluster

It is also possible to use indirect indexing of JSON columns in MySQL NDB Cluster, subject to the following conditions:

1. `NDB` handles a `JSON` column value internally as a `BLOB`. This means that any `NDB` table having one or more JSON columns must have a primary key, else it cannot be recorded in the binary log.

2. The `NDB` storage engine does not support indexing of virtual columns. Since the default for generated columns is `VIRTUAL`, you must specify explicitly the generated column to which to apply the indirect index as `STORED`.

The **`CREATE TABLE`** statement used to create the table `jempn` shown here is a version of the `jemp` table shown previously, with modifications making it compatible with `NDB`:

```
CREATE TABLE jempn (
  a BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  c JSON DEFAULT NULL,
  g INT GENERATED ALWAYS AS (c->"$.id") STORED,
  INDEX i (g)
) ENGINE=NDB;
```

We can populate this table using the following `INSERT` statement:

```
INSERT INTO jempn (c) VALUES
  ('{"id": "1", "name": "Fred"}'),
  ('{"id": "2", "name": "Wilma"}'),
  ('{"id": "3", "name": "Barney"}'),
  ('{"id": "4", "name": "Betty"}');
```

Now `NDB` can use index `i`, as shown here:

```
mysql> EXPLAIN SELECT c->>"$.name" AS name
    ->           FROM jempn WHERE g > 2\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: jempn
   partitions: p0,p1,p2,p3
         type: range
possible_keys: i
          key: i
      key_len: 5
          ref: NULL
         rows: 3
     filtered: 100.00
        Extra: Using pushed condition (`test`.`jempn`.`g` > 2)
1 row in set, 1 warning (0.01 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Note
   Code: 1003
Message: /* select#1 */ select
json_unquote(json_extract(`test`.`jempn`.`c`,'$.name')) AS `name` from
`test`.`jempn` where (`test`.`jempn`.`g` > 2)
1 row in set (0.00 sec)
```

You should keep in mind that a stored generated column, as well as any index on such a column, uses `DataMemory`.


#### 15.1.24.10 Invisible Columns

MySQL 9.5 supports invisible columns. An invisible column is normally hidden to queries, but can be accessed if explicitly referenced.

As an illustration of when invisible columns may be useful, suppose that an application uses `SELECT *` queries to access a table, and must continue to work without modification even if the table is altered to add a new column that the application does not expect to be there. In a `SELECT *` query, the `*` evaluates to all table columns, except those that are invisible, so the solution is to add the new column as an invisible column. The column remains “hidden” from `SELECT *` queries, and the application continues to work as previously. A newer version of the application can refer to the invisible column if necessary by explicitly referencing it.

The following sections detail how MySQL treats invisible columns.

* DDL Statements and Invisible Columns
* DML Statements and Invisible Columns
* Invisible Column Metadata
* The Binary Log and Invisible Columns

##### DDL Statements and Invisible Columns

Columns are visible by default. To explicitly specify visibility for a new column, use a `VISIBLE` or `INVISIBLE` keyword as part of the column definition for `CREATE TABLE` or `ALTER TABLE`:

```
CREATE TABLE t1 (
  i INT,
  j DATE INVISIBLE
) ENGINE = InnoDB;
ALTER TABLE t1 ADD COLUMN k INT INVISIBLE;
```

To alter the visibility of an existing column, use a `VISIBLE` or `INVISIBLE` keyword with one of the `ALTER TABLE` column-modification clauses:

```
ALTER TABLE t1 CHANGE COLUMN j j DATE VISIBLE;
ALTER TABLE t1 MODIFY COLUMN j DATE INVISIBLE;
ALTER TABLE t1 ALTER COLUMN j SET VISIBLE;
```

A table must have at least one visible column. Attempting to make all columns invisible produces an error.

Invisible columns support the usual column attributes: `NULL`, `NOT NULL`, `AUTO_INCREMENT`, and so forth.

Generated columns can be invisible.

Index definitions can name invisible columns, including definitions for `PRIMARY KEY` and `UNIQUE` indexes. Although a table must have at least one visible column, an index definition need not have any visible columns.

An invisible column dropped from a table is dropped in the usual way from any index definition that names the column.

Foreign key constraints can be defined on invisible columns, and foreign key constraints can reference invisible columns.

`CHECK` constraints can be defined on invisible columns. For new or modified rows, violation of a `CHECK` constraint on an invisible column produces an error.

[`CREATE TABLE ... LIKE`](create-table-like.html "15.1.24.3 CREATE TABLE ... LIKE Statement") includes invisible columns, and they are invisible in the new table.

[`CREATE TABLE ... SELECT`](create-table-select.html "15.1.24.4 CREATE TABLE ... SELECT Statement") does not include invisible columns, unless they are explicitly referenced in the `SELECT` part. However, even if explicitly referenced, a column that is invisible in the existing table is visible in the new table:

```
mysql> CREATE TABLE t1 (col1 INT, col2 INT INVISIBLE);
mysql> CREATE TABLE t2 AS SELECT col1, col2 FROM t1;
mysql> SHOW CREATE TABLE t2\G
*************************** 1. row ***************************
       Table: t2
Create Table: CREATE TABLE `t2` (
  `col1` int DEFAULT NULL,
  `col2` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

If invisibility should be preserved, provide a definition for the invisible column in the [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") part of the [`CREATE TABLE ... SELECT`](create-table-select.html "15.1.24.4 CREATE TABLE ... SELECT Statement") statement:

```
mysql> CREATE TABLE t1 (col1 INT, col2 INT INVISIBLE);
mysql> CREATE TABLE t2 (col2 INT INVISIBLE) AS SELECT col1, col2 FROM t1;
mysql> SHOW CREATE TABLE t2\G
*************************** 1. row ***************************
       Table: t2
Create Table: CREATE TABLE `t2` (
  `col1` int DEFAULT NULL,
  `col2` int DEFAULT NULL /*!80023 INVISIBLE */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

Views can refer to invisible columns by explicitly referencing them in the `SELECT` statement that defines the view. Changing a column's visibility subsequent to defining a view that references the column does not change view behavior.

##### DML Statements and Invisible Columns

For `SELECT` statements, an invisible column is not part of the result set unless explicitly referenced in the select list. In a select list, the `*` and `tbl_name.*` shorthands do not include invisible columns. Natural joins do not include invisible columns.

Consider the following statement sequence:

```
mysql> CREATE TABLE t1 (col1 INT, col2 INT INVISIBLE);
mysql> INSERT INTO t1 (col1, col2) VALUES(1, 2), (3, 4);

mysql> SELECT * FROM t1;
+------+
| col1 |
+------+
|    1 |
|    3 |
+------+

mysql> SELECT col1, col2 FROM t1;
+------+------+
| col1 | col2 |
+------+------+
|    1 |    2 |
|    3 |    4 |
+------+------+
```

The first `SELECT` does not reference the invisible column `col2` in the select list (because `*` does not include invisible columns), so `col2` does not appear in the statement result. The second `SELECT` explicitly references `col2`, so the column appears in the result.

The statement [`TABLE t1`](table.html "15.2.16 TABLE Statement") produces the same output as the first `SELECT` statement. Since there is no way to specify columns in a `TABLE` statement, `TABLE` never displays invisible columns.

For statements that create new rows, an invisible column is assigned its implicit default value unless explicitly referenced and assigned a value. For information about implicit defaults, see Implicit Default Handling.

For `INSERT` (and `REPLACE`, for non-replaced rows), implicit default assignment occurs with a missing column list, an empty column list, or a nonempty column list that does not include the invisible column:

```
CREATE TABLE t1 (col1 INT, col2 INT INVISIBLE);
INSERT INTO t1 VALUES(...);
INSERT INTO t1 () VALUES(...);
INSERT INTO t1 (col1) VALUES(...);
```

For the first two `INSERT` statements, the `VALUES()` list must provide a value for each visible column and no invisible column. For the third `INSERT` statement, the `VALUES()` list must provide the same number of values as the number of named columns; the same is true when you use [`VALUES ROW()`](values.html "15.2.19 VALUES Statement") rather than `VALUES()`.

For `LOAD DATA` and `LOAD XML`, implicit default assignment occurs with a missing column list or a nonempty column list that does not include the invisible column. Input rows should not include a value for the invisible column.

To assign a value other than the implicit default for the preceding statements, explicitly name the invisible column in the column list and provide a value for it.

[`INSERT INTO ... SELECT *`](insert-select.html "15.2.7.1 INSERT ... SELECT Statement") and [`REPLACE INTO ... SELECT *`](replace.html "15.2.12 REPLACE Statement") do not include invisible columns because `*` does not include invisible columns. Implicit default assignment occurs as described previously.

For statements that insert or ignore new rows, or that replace or modify existing rows, based on values in a `PRIMARY KEY` or `UNIQUE` index, MySQL treats invisible columns the same as visible columns: Invisible columns participate in key value comparisons. Specifically, if a new row has the same value as an existing row for a unique key value, these behaviors occur whether the index columns are visible or invisible:

* With the `IGNORE` modifier, `INSERT`, `LOAD DATA`, and `LOAD XML` ignore the new row.

* `REPLACE` replaces the existing row with the new row. With the `REPLACE` modifier, `LOAD DATA` and `LOAD XML` do the same.

* [`INSERT ... ON DUPLICATE KEY UPDATE`](insert-on-duplicate.html "15.2.7.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") updates the existing row.

To update invisible columns for `UPDATE` statements, name them and assign a value, just as for visible columns.

##### Invisible Column Metadata

Information about whether a column is visible or invisible is available from the `EXTRA` column of the Information Schema `COLUMNS` table or `SHOW COLUMNS` output. For example:

```
mysql> SELECT TABLE_NAME, COLUMN_NAME, EXTRA
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = 'test' AND TABLE_NAME = 't1';
+------------+-------------+-----------+
| TABLE_NAME | COLUMN_NAME | EXTRA     |
+------------+-------------+-----------+
| t1         | i           |           |
| t1         | j           |           |
| t1         | k           | INVISIBLE |
+------------+-------------+-----------+
```

Columns are visible by default, so in that case, `EXTRA` displays no visibility information. For invisible columns, `EXTRA` displays `INVISIBLE`.

`SHOW CREATE TABLE` displays invisible columns in the table definition, with the `INVISIBLE` keyword in a version-specific comment:

```
mysql> SHOW CREATE TABLE t1\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t1` (
  `i` int DEFAULT NULL,
  `j` int DEFAULT NULL,
  `k` int DEFAULT NULL /*!80023 INVISIBLE */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

**mysqldump** uses `SHOW CREATE TABLE`, so they include invisible columns in dumped table definitions. They also include invisible column values in dumped data.

Reloading a dump file into an older version of MySQL that does not support invisible columns causes the version-specific comment to be ignored, which creates any invisible columns as visible.

##### The Binary Log and Invisible Columns

MySQL treats invisible columns as follows with respect to events in the binary log:

* Table-creation events include the `INVISIBLE` attribute for invisible columns.

* Invisible columns are treated like visible columns in row events. They are included if needed according to the `binlog_row_image` system variable setting.

* When row events are applied, invisible columns are treated like visible columns in row events.

* Invisible columns are treated like visible columns when computing writesets. In particular, writesets include indexes defined on invisible columns.

* The **mysqlbinlog** command includes visibility in column metadata.


#### 15.1.24.11 Generated Invisible Primary Keys

MySQL 9.5 supports generated invisible primary keys for any `InnoDB` table that is created without an explicit primary key. When the `sql_generate_invisible_primary_key` server system variable is set to `ON`, the MySQL server automatically adds a generated invisible primary key (GIPK) to any such table. This setting has no effect on tables created using any other storage engine than `InnoDB`.

By default, the value of `sql_generate_invisible_primary_key` is `OFF`, meaning that the automatic addition of GIPKs is disabled. To illustrate how this affects table creation, we begin by creating two identical tables, neither having a primary key, the only difference being that the first (table `auto_0`) is created with `sql_generate_invisible_primary_key` set to `OFF`, and the second (`auto_1`) after setting it to `ON`, as shown here:

```
mysql> SELECT @@sql_generate_invisible_primary_key;
+--------------------------------------+
| @@sql_generate_invisible_primary_key |
+--------------------------------------+
|                                    0 |
+--------------------------------------+
1 row in set (0.00 sec)

mysql> CREATE TABLE auto_0 (c1 VARCHAR(50), c2 INT);
Query OK, 0 rows affected (0.02 sec)

mysql> SET sql_generate_invisible_primary_key=ON;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @@sql_generate_invisible_primary_key;
+--------------------------------------+
| @@sql_generate_invisible_primary_key |
+--------------------------------------+
|                                    1 |
+--------------------------------------+
1 row in set (0.00 sec)

mysql> CREATE TABLE auto_1 (c1 VARCHAR(50), c2 INT);
Query OK, 0 rows affected (0.04 sec)
```

Compare the output of these [`SHOW CREATE TABLE`](show-create-table.html "15.7.7.12 SHOW CREATE TABLE Statement") statements to see the difference in how the tables were actually created:

```
mysql> SHOW CREATE TABLE auto_0\G
*************************** 1. row ***************************
       Table: auto_0
Create Table: CREATE TABLE `auto_0` (
  `c1` varchar(50) DEFAULT NULL,
  `c2` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)

mysql> SHOW CREATE TABLE auto_1\G
*************************** 1. row ***************************
       Table: auto_1
Create Table: CREATE TABLE `auto_1` (
  `my_row_id` bigint unsigned NOT NULL AUTO_INCREMENT /*!80023 INVISIBLE */,
  `c1` varchar(50) DEFAULT NULL,
  `c2` int DEFAULT NULL,
  PRIMARY KEY (`my_row_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)
```

Since `auto_1` had no primary key specified by the `CREATE TABLE` statement used to create it, setting `sql_generate_invisible_primary_key = ON` causes MySQL to add both the invisible column `my_row_id` to this table and a primary key on that column. Since `sql_generate_invisible_primary_key` was `OFF` at the time that `auto_0` was created, no such additions were performed on that table.

When a primary key is added to a table by the server, the column and key name is always `my_row_id`. For this reason, when enabling generated invisible primary keys in this way, you cannot create a table having a column named `my_row_id` unless the table creation statement also specifies an explicit primary key. (You are not required to name the column or key `my_row_id` in such cases.)

`my_row_id` is an invisible column, which means it is not shown in the output of `SELECT *` or `TABLE`; the column must be selected explicitly by name. See Section 15.1.24.10, “Invisible Columns”.

When GIPKs are enabled, a generated primary key cannot be altered other than to switch it between `VISIBLE` and `INVISIBLE`. To make the generated invisible primary key on `auto_1` visible, execute this `ALTER TABLE` statement:

```
mysql> ALTER TABLE auto_1 ALTER COLUMN my_row_id SET VISIBLE;
Query OK, 0 rows affected (0.02 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW CREATE TABLE auto_1\G
*************************** 1. row ***************************
       Table: auto_1
Create Table: CREATE TABLE `auto_1` (
  `my_row_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `c1` varchar(50) DEFAULT NULL,
  `c2` int DEFAULT NULL,
  PRIMARY KEY (`my_row_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.01 sec)
```

To make this generated primary key invisible again, issue `ALTER TABLE auto_1 ALTER COLUMN my_row_id SET INVISIBLE`.

A generated invisible primary key is always invisible by default.

Whenever GIPKs are enabled, you cannot drop a generated primary key if either of the following 2 conditions would result:

* The table is left with no primary key.
* The primary key is dropped, but not the primary key column.

The effects of `sql_generate_invisible_primary_key` apply to tables using the `InnoDB` storage engine only. You can use an `ALTER TABLE` statement to change the storage engine used by a table that has a generated invisible primary key; in this case, the primary key and column remain in place, but the table and key no longer receive any special treatment.

By default, GIPKs are shown in the output of `SHOW CREATE TABLE`, `SHOW COLUMNS`, and `SHOW INDEX`, and are visible in the Information Schema `COLUMNS` and `STATISTICS` tables. You can cause generated invisible primary keys to be hidden instead in such cases by setting the `show_gipk_in_create_table_and_information_schema` system variable to `OFF`. By default, this variable is `ON`, as shown here:

```
mysql> SELECT @@show_gipk_in_create_table_and_information_schema;
+----------------------------------------------------+
| @@show_gipk_in_create_table_and_information_schema |
+----------------------------------------------------+
|                                                  1 |
+----------------------------------------------------+
1 row in set (0.00 sec)
```

As can be seen from the following query against the `COLUMNS` table, `my_row_id` is visible among the columns of `auto_1`:

```
mysql> SELECT COLUMN_NAME, ORDINAL_POSITION, DATA_TYPE, COLUMN_KEY
    -> FROM INFORMATION_SCHEMA.COLUMNS
    -> WHERE TABLE_NAME = "auto_1";
+-------------+------------------+-----------+------------+
| COLUMN_NAME | ORDINAL_POSITION | DATA_TYPE | COLUMN_KEY |
+-------------+------------------+-----------+------------+
| my_row_id   |                1 | bigint    | PRI        |
| c1          |                2 | varchar   |            |
| c2          |                3 | int       |            |
+-------------+------------------+-----------+------------+
3 rows in set (0.01 sec)
```

After `show_gipk_in_create_table_and_information_schema` is set to `OFF`, `my_row_id` can no longer be seen in the `COLUMNS` table, as shown here:

```
mysql> SET show_gipk_in_create_table_and_information_schema = OFF;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @@show_gipk_in_create_table_and_information_schema;
+----------------------------------------------------+
| @@show_gipk_in_create_table_and_information_schema |
+----------------------------------------------------+
|                                                  0 |
+----------------------------------------------------+
1 row in set (0.00 sec)

mysql> SELECT COLUMN_NAME, ORDINAL_POSITION, DATA_TYPE, COLUMN_KEY
    -> FROM INFORMATION_SCHEMA.COLUMNS
    -> WHERE TABLE_NAME = "auto_1";
+-------------+------------------+-----------+------------+
| COLUMN_NAME | ORDINAL_POSITION | DATA_TYPE | COLUMN_KEY |
+-------------+------------------+-----------+------------+
| c1          |                2 | varchar   |            |
| c2          |                3 | int       |            |
+-------------+------------------+-----------+------------+
2 rows in set (0.00 sec)
```

The setting for `sql_generate_invisible_primary_key` is not replicated, and is ignored by replication applier threads. This means that the setting of this variable on the source has no effect on the replica. You can cause the replica to add a GIPK for tables replicated without primary keys on a given replication channel using `REQUIRE_TABLE_PRIMARY_KEY_CHECK = GENERATE` as part of a [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement.

GIPKs work with row-based replication of [`CREATE TABLE ... SELECT`](create-table-select.html "15.1.24.4 CREATE TABLE ... SELECT Statement"); the information written to the binary log for this statement in such cases includes the GIPK definition, and thus is replicated correctly. Statement-based replication of `CREATE TABLE ... SELECT` is not supported with `sql_generate_invisible_primary_key = ON`.

When creating or importing backups of installations where GIPKs are in use, it is possible to exclude generated invisible primary key columns and values. The `--skip-generated-invisible-primary-key` option for **mysqldump** causes GIPK information to be excluded in the program's output.


#### 15.1.24.12 Setting NDB Comment Options

* NDB_COLUMN Options
* NDB_TABLE Options

It is possible to set a number of options specific to NDB Cluster in the table comment or column comments of an `NDB` table. Table-level options for controlling read from any replica and partition balance can be embedded in a table comment using `NDB_TABLE`.

`NDB_COLUMN` can be used in a column comment to set the size of the blob parts table column used for storing parts of blob values by `NDB` to its maximum. This works for `BLOB`, `MEDIUMBLOB`, `LONGBLOB`, `TEXT`, `MEDIUMTEXT`, `LONGTEXT`, and `JSON` columns. A column comment can also be used to control the inline size of a blob column. `NDB_COLUMN` comments do not support `TINYBLOB` or `TINYTEXT` columns, since these have an inline part (only) of fixed size, and no separate parts to store elsewhere.

`NDB_TABLE` can be used in a table comment to set options relating to partition balance and whether the table is fully replicated, among others.

The remainder of this section describes these options and their use.

##### NDB_COLUMN Options

In NDB Cluster, a column comment in a `CREATE TABLE` or `ALTER TABLE` statement can also be used to specify an `NDB_COLUMN` option. `NDB` supports two column comment options `BLOB_INLINE_SIZE` and `MAX_BLOB_PART_SIZE`. Syntax for these options is shown here:

```
COMMENT 'NDB_COLUMN=speclist'

speclist := spec[,spec]

spec :=
    BLOB_INLINE_SIZE=value
  | MAX_BLOB_PART_SIZE[={0|1}]
```

`BLOB_INLINE_SIZE` specifies the number of bytes to be stored inline by the column; its expected value is an integer in the range 1 - 29980, inclusive. Setting a value greater than 29980 raises an error; setting a value less than 1 is allowed, but causes the default inline size for the column type to be used.

You should be aware that the maximum value for this option is actually the maximum number of bytes that can be stored in one row of an `NDB` table; every column in the row contributes to this total.

You should also keep in mind, especially when working with `TEXT` columns, that the value set by `MAX_BLOB_PART_SIZE` or `BLOB_INLINE_SIZE` represents column size in bytes. It does not indicate the number of characters, which varies according to the character set and collation used by the column.

To see the effects of this option, first create a table with two `BLOB` columns, one (`b1`) with no extra options, and another (`b2`) with a setting for `BLOB_INLINE_SIZE`, as shown here:

```
mysql> CREATE TABLE t1 (
    ->    a INT NOT NULL PRIMARY KEY,
    ->    b1 BLOB,
    ->    b2 BLOB COMMENT 'NDB_COLUMN=BLOB_INLINE_SIZE=8000'
    ->  ) ENGINE NDB;
Query OK, 0 rows affected (0.32 sec)
```

You can see the `BLOB_INLINE_SIZE` settings for the `BLOB` columns by querying the `ndbinfo.blobs` table, like this:

```
mysql> SELECT
    ->   column_name AS 'Column Name',
    ->   inline_size AS 'Inline Size',
    ->   part_size AS 'Blob Part Size'
    -> FROM ndbinfo.blobs
    -> WHERE table_name = 't1';
+-------------+-------------+----------------+
| Column Name | Inline Size | Blob Part Size |
+-------------+-------------+----------------+
| b1          |         256 |           2000 |
| b2          |        8000 |           2000 |
+-------------+-------------+----------------+
2 rows in set (0.01 sec)
```

You can also check the output from the **ndb_desc** utility, as shown here, with the relevant lines displayed using emphasized text:

```
$> ndb_desc -d test t1
-- t --
Version: 1
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 3
Number of primary keys: 1
Length of frm data: 945
Max Rows: 0
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
PartitionCount: 2
FragmentCount: 2
PartitionBalance: FOR_RP_BY_LDM
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
Table options: readbackup
HashMap: DEFAULT-HASHMAP-3840-2
-- Attributes --
a Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY
b1 Blob(256,2000,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_64_1
b2 Blob(8000,2000,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_64_2
-- Indexes --
PRIMARY KEY(a) - UniqueHashIndex
PRIMARY(a) - OrderedIndex
```

`BLOB_INLINE_SIZE` is not permitted with `TINYBLOB` columns, and causes a warning if used.

For `MAX_BLOB_PART_SIZE`, the `=` sign and the value following it are optional. Using any value other than 0 or 1 results in a syntax error.

The effect of using `MAX_BLOB_PART_SIZE` in a column comment is to set the blob part size of a `TEXT` or `BLOB` column to the maximum number of bytes supported for this by `NDB` (13948). This option can be applied to any blob column type supported by MySQL except `TINYBLOB` or `TINYTEXT` (`BLOB`, `MEDIUMBLOB`, `LONGBLOB`, `TEXT`, `MEDIUMTEXT`, `LONGTEXT`). Unlike `BLOB_INLINE_SIZE`, `MAX_BLOB_PART_SIZE` has no effect on `JSON` columns.

To see the effects of this option, we first run the following SQL statement in the **mysql** client to create a table with two `BLOB` columns, one (`c1`) with no extra options, and another (`c2`) with `MAX_BLOB_PART_SIZE`:

```
mysql> CREATE TABLE test.t2 (
    ->   p INT PRIMARY KEY,
    ->   c1 BLOB,
    ->   c2 BLOB COMMENT 'NDB_COLUMN=MAX_BLOB_PART_SIZE'
    -> ) ENGINE NDB;
Query OK, 0 rows affected (0.32 sec)
```

From the system shell, run the **ndb_desc** utility to obtain information about the table just created, as shown in this example:

```
$> ndb_desc -d test t2
-- t --
Version: 1
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 3
Number of primary keys: 1
Length of frm data: 324
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
FragmentCount: 2
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
HashMap: DEFAULT-HASHMAP-3840-2
-- Attributes --
p Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY
c1 Blob(256,2000,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_22_1
c2 Blob(256,13948,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_22_2
-- Indexes --
PRIMARY KEY(p) - UniqueHashIndex
PRIMARY(p) - OrderedIndex
```

Column information in the output is listed under `Attributes`; for columns `c1` and `c2` it is displayed here in emphasized text. For `c1`, the blob part size is 2000, the default value; for `c2`, it is 13948, as set by `MAX_BLOB_PART_SIZE`.

You can also query the `ndbinfo.blobs` table to see this, as shown here:

```
mysql> SELECT
    ->   column_name AS 'Column Name',
    ->   inline_size AS 'Inline Size',
    ->   part_size AS 'Blob Part Size'
    -> FROM ndbinfo.blobs
    -> WHERE table_name = 't2';
+-------------+-------------+----------------+
| Column Name | Inline Size | Blob Part Size |
+-------------+-------------+----------------+
| c1          |         256 |           2000 |
| c2          |         256 |          13948 |
+-------------+-------------+----------------+
2 rows in set (0.00 sec)
```

You can change the blob part size for a given blob column of an `NDB` table using an `ALTER TABLE` statement such as this one, and verifying the changes afterwards using [`SHOW CREATE TABLE`](show-create-table.html "15.7.7.12 SHOW CREATE TABLE Statement"):

```
mysql> ALTER TABLE test.t2
    ->    DROP COLUMN c1,
    ->     ADD COLUMN c1 BLOB COMMENT 'NDB_COLUMN=MAX_BLOB_PART_SIZE',
    ->     CHANGE COLUMN c2 c2 BLOB AFTER c1;
Query OK, 0 rows affected (0.47 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW CREATE TABLE test.t2\G
*************************** 1. row ***************************
       Table: t
Create Table: CREATE TABLE `t2` (
  `p` int(11) NOT NULL,
  `c1` blob COMMENT 'NDB_COLUMN=MAX_BLOB_PART_SIZE',
  `c2` blob,
  PRIMARY KEY (`p`)
) ENGINE=ndbcluster DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)

mysql> EXIT
Bye
```

The output of **ndb_desc** shows that the blob part sizes of the columns have been changed as expected:

```
$> ndb_desc -d test t2
-- t --
Version: 16777220
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 3
Number of primary keys: 1
Length of frm data: 324
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
FragmentCount: 2
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
HashMap: DEFAULT-HASHMAP-3840-2
-- Attributes --
p Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY
c1 Blob(256,13948,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_26_1
c2 Blob(256,2000,0) NULL AT=MEDIUM_VAR ST=MEMORY BV=2 BT=NDB$BLOB_26_2
-- Indexes --
PRIMARY KEY(p) - UniqueHashIndex
PRIMARY(p) - OrderedIndex
```

You can also see the change by running the query against `ndbinfo.blobs` again:

```
mysql> SELECT
    ->   column_name AS 'Column Name',
    ->   inline_size AS 'Inline Size',
    ->   part_size AS 'Blob Part Size'
    -> FROM ndbinfo.blobs
    -> WHERE table_name = 't2';
+-------------+-------------+----------------+
| Column Name | Inline Size | Blob Part Size |
+-------------+-------------+----------------+
| c1          |         256 |          13948 |
| c2          |         256 |           2000 |
+-------------+-------------+----------------+
2 rows in set (0.00 sec)
```

It is possible to set both `BLOB_INLINE_SIZE` and `MAX_BLOB_PART_SIZE` for a blob column, as shown in this `CREATE TABLE` statement:

```
mysql> CREATE TABLE test.t3 (
    ->   p INT NOT NULL PRIMARY KEY,
    ->   c1 JSON,
    ->   c2 JSON COMMENT 'NDB_COLUMN=BLOB_INLINE_SIZE=5000,MAX_BLOB_PART_SIZE'
    -> ) ENGINE NDB;
Query OK, 0 rows affected (0.28 sec)
```

Querying the `blobs` table shows us that the statement worked as expected:

```
mysql> SELECT
    ->   column_name AS 'Column Name',
    ->   inline_size AS 'Inline Size',
    ->   part_size AS 'Blob Part Size'
    -> FROM ndbinfo.blobs
    -> WHERE table_name = 't3';
+-------------+-------------+----------------+
| Column Name | Inline Size | Blob Part Size |
+-------------+-------------+----------------+
| c1          |        4000 |           8100 |
| c2          |        5000 |           8100 |
+-------------+-------------+----------------+
2 rows in set (0.00 sec)
```

You can also verify that the statement worked by checking the output of **ndb_desc**.

Changing a column's blob part size must be done using a copying `ALTER TABLE`; this operation cannot be performed online (see Section 25.6.12, “Online Operations with ALTER TABLE in NDB Cluster”).

For more information about how `NDB` stores columns of blob types, see String Type Storage Requirements.

##### NDB_TABLE Options

For an NDB Cluster table, the table comment in a `CREATE TABLE` or `ALTER TABLE` statement can also be used to specify an `NDB_TABLE` option, which consists of one or more name-value pairs, separated by commas if need be, following the string `NDB_TABLE=`. Complete syntax for names and values syntax is shown here:

```
COMMENT="NDB_TABLE=ndb_table_option[,ndb_table_option[,...]]"

ndb_table_option: {
    NOLOGGING={1 | 0}
  | READ_BACKUP={1 | 0}
  | PARTITION_BALANCE={FOR_RP_BY_NODE | FOR_RA_BY_NODE | FOR_RP_BY_LDM
                      | FOR_RA_BY_LDM | FOR_RA_BY_LDM_X_2
                      | FOR_RA_BY_LDM_X_3 | FOR_RA_BY_LDM_X_4}
  | FULLY_REPLICATED={1 | 0}
}
```

Spaces are not permitted within the quoted string. The string is case-insensitive.

The four `NDB` table options that can be set as part of a comment in this way are described in more detail in the next few paragraphs.

`NOLOGGING`: By default, `NDB` tables are logged, and checkpointed. This makes them durable to whole cluster failures. Using `NOLOGGING` when creating or altering a table means that this table is not redo logged or included in local checkpoints. In this case, the table is still replicated across the data nodes for high availability, and updated using transactions, but changes made to it are not recorded in the data node's redo logs, and its content is not checkpointed to disk; when recovering from a cluster failure, the cluster retains the table definition, but none of its rows—that is, the table is empty.

Using such nonlogging tables reduces the data node's demands on disk I/O and storage, as well as CPU for checkpointing CPU. This may be suitable for short-lived data which is frequently updated, and where the loss of all data in the unlikely event of a total cluster failure is acceptable.

It is also possible to use the `ndb_table_no_logging` system variable to cause any NDB tables created or altered while this variable is in effect to behave as though it had been created with the `NOLOGGING` comment. Unlike when using the comment directly, there is nothing in this case in the output of `SHOW CREATE TABLE` to indicate that it is a nonlogging table. Using the table comment approach is recommended since it offers per-table control of the feature, and this aspect of the table schema is embedded in the table creation statement where it can be found easily by SQL-based tools.

`READ_BACKUP`: Setting this option to 1 has the same effect as though `ndb_read_backup` were enabled; enables reading from any replica. Doing so greatly improves the performance of reads from the table at a relatively small cost to write performance. 1 is the default for `READ_BACKUP`, and the default for `ndb_read_backup` is `ON` (previously, read from any replica was disabled by default).

You can set `READ_BACKUP` for an existing table online, using an `ALTER TABLE` statement similar to one of those shown here:

```
ALTER TABLE ... ALGORITHM=INPLACE, COMMENT="NDB_TABLE=READ_BACKUP=1";

ALTER TABLE ... ALGORITHM=INPLACE, COMMENT="NDB_TABLE=READ_BACKUP=0";
```

For more information about the `ALGORITHM` option for `ALTER TABLE`, see Section 25.6.12, “Online Operations with ALTER TABLE in NDB Cluster”.

`PARTITION_BALANCE`: Provides additional control over assignment and placement of partitions. The following four schemes are supported:

1. `FOR_RP_BY_NODE`: One partition per node.

   Only one LDM on each node stores a primary partition. Each partition is stored in the same LDM (same ID) on all nodes.

2. `FOR_RA_BY_NODE`: One partition per node group.

   Each node stores a single partition, which can be either a primary replica or a backup replica. Each partition is stored in the same LDM on all nodes.

3. `FOR_RP_BY_LDM`: One partition for each LDM on each node; the default.

   This is the setting used if `READ_BACKUP` is set to 1.

4. `FOR_RA_BY_LDM`: One partition per LDM in each node group.

   These partitions can be primary or backup partitions.

5. `FOR_RA_BY_LDM_X_2`: Two partitions per LDM in each node group.

   These partitions can be primary or backup partitions.

6. `FOR_RA_BY_LDM_X_3`: Three partitions per LDM in each node group.

   These partitions can be primary or backup partitions.

7. `FOR_RA_BY_LDM_X_4`: Four partitions per LDM in each node group.

   These partitions can be primary or backup partitions.

`PARTITION_BALANCE` is the preferred interface for setting the number of partitions per table. Using `MAX_ROWS` to force the number of partitions is deprecated but continues to be supported for backward compatibility; it is subject to removal in a future release of MySQL NDB Cluster. (Bug #81759, Bug #23544301)

`FULLY_REPLICATED` controls whether the table is fully replicated, that is, whether each data node has a complete copy of the table. To enable full replication of the table, use `FULLY_REPLICATED=1`.

This setting can also be controlled using the `ndb_fully_replicated` system variable. Setting it to `ON` enables the option by default for all new `NDB` tables; the default is `OFF`. The `ndb_data_node_neighbour` system variable is also used for fully replicated tables, to ensure that when a fully replicated table is accessed, we access the data node which is local to this MySQL Server.

An example of a `CREATE TABLE` statement using such a comment when creating an `NDB` table is shown here:

```
mysql> CREATE TABLE t1 (
     >     c1 INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     >     c2 VARCHAR(100),
     >     c3 VARCHAR(100) )
     > ENGINE=NDB
     >
COMMENT="NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE";
```

The comment is displayed as part of the output of `SHOW CREATE TABLE`. The text of the comment is also available from querying the MySQL Information Schema `TABLES` table, as in this example:

```
mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
     > FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1"\G
*************************** 1. row ***************************
   TABLE_NAME: t1
 TABLE_SCHEMA: test
TABLE_COMMENT: NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE
1 row in set (0.01 sec)
```

This comment syntax is also supported with `ALTER TABLE` statements for `NDB` tables, as shown here:

```
mysql> ALTER TABLE t1 COMMENT="NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE";
Query OK, 0 rows affected (0.40 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

The `TABLE_COMMENT` column displays the comment that is required to re-create the table as it is following the `ALTER TABLE` statement, like this:

```
mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
    ->     FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1"\G
*************************** 1. row ***************************
   TABLE_NAME: t1
 TABLE_SCHEMA: test
TABLE_COMMENT: NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RP_BY_NODE
1 row in set (0.01 sec)
```

```
mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
     > FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1";
+------------+--------------+--------------------------------------------------+
| TABLE_NAME | TABLE_SCHEMA | TABLE_COMMENT                                    |
+------------+--------------+--------------------------------------------------+
| t1         | c            | NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE       |
| t1         | d            |                                                  |
+------------+--------------+--------------------------------------------------+
2 rows in set (0.01 sec)
```

Keep in mind that a table comment used with `ALTER TABLE` replaces any existing comment which the table might have.

```
mysql> ALTER TABLE t1 COMMENT="NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE";
Query OK, 0 rows affected (0.40 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SELECT TABLE_NAME, TABLE_SCHEMA, TABLE_COMMENT
     > FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME="t1";
+------------+--------------+--------------------------------------------------+
| TABLE_NAME | TABLE_SCHEMA | TABLE_COMMENT                                    |
+------------+--------------+--------------------------------------------------+
| t1         | c            | NDB_TABLE=PARTITION_BALANCE=FOR_RA_BY_NODE       |
| t1         | d            |                                                  |
+------------+--------------+--------------------------------------------------+
2 rows in set (0.01 sec)
```

You can also see the value of the `PARTITION_BALANCE` option in the output of **ndb_desc**. **ndb_desc** also shows whether the `READ_BACKUP` and `FULLY_REPLICATED` options are set for the table. See the description of this program for more information.


### 15.1.25 CREATE TABLESPACE Statement

```
CREATE [UNDO] TABLESPACE tablespace_name

  InnoDB and NDB:
    [ADD DATAFILE 'file_name']
    [AUTOEXTEND_SIZE [=] value]

  InnoDB only:
    [FILE_BLOCK_SIZE = value]
    [ENCRYPTION [=] {'Y' | 'N'}]

  NDB only:
    USE LOGFILE GROUP logfile_group
    [EXTENT_SIZE [=] extent_size]
    [INITIAL_SIZE [=] initial_size]
    [MAX_SIZE [=] max_size]
    [NODEGROUP [=] nodegroup_id]
    [WAIT]
    [COMMENT [=] 'string']

  InnoDB and NDB:
    [ENGINE [=] engine_name]

  Reserved for future use:
    [ENGINE_ATTRIBUTE [=] 'string']
```

This statement is used to create a tablespace. The precise syntax and semantics depend on the storage engine used. In standard MySQL releases, this is always an `InnoDB` tablespace. MySQL NDB Cluster also supports tablespaces using the `NDB` storage engine.

* Considerations for InnoDB
* Considerations for NDB Cluster
* Options
* Notes
* InnoDB Examples
* NDB Example

#### Considerations for InnoDB

`CREATE TABLESPACE` syntax is used to create general tablespaces or undo tablespaces. The `UNDO` keyword must be specified to create an undo tablespace.

A general tablespace is a shared tablespace. It can hold multiple tables, and supports all table row formats. General tablespaces can be created in a location relative to or independent of the data directory.

After creating an `InnoDB` general tablespace, use [`CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name`](create-table.html "15.1.24 CREATE TABLE Statement") or [`ALTER TABLE tbl_name TABLESPACE [=] tablespace_name`](alter-table.html "15.1.11 ALTER TABLE Statement") to add tables to the tablespace. For more information, see Section 17.6.3.3, “General Tablespaces”.

Undo tablespaces contain undo logs. Undo tablespaces can be created in a chosen location by specifying a fully qualified data file path. For more information, see Section 17.6.3.4, “Undo Tablespaces”.

#### Considerations for NDB Cluster

This statement is used to create a tablespace, which can contain one or more data files, providing storage space for NDB Cluster Disk Data tables (see Section 25.6.11, “NDB Cluster Disk Data Tables”). One data file is created and added to the tablespace using this statement. Additional data files may be added to the tablespace by using the `ALTER TABLESPACE` statement (see Section 15.1.12, “ALTER TABLESPACE Statement”).

Note

All NDB Cluster Disk Data objects share the same namespace. This means that *each Disk Data object* must be uniquely named (and not merely each Disk Data object of a given type). For example, you cannot have a tablespace and a log file group with the same name, or a tablespace and a data file with the same name.

A log file group of one or more `UNDO` log files must be assigned to the tablespace to be created with the `USE LOGFILE GROUP` clause. *`logfile_group`* must be an existing log file group created with [`CREATE LOGFILE GROUP`](create-logfile-group.html "15.1.20 CREATE LOGFILE GROUP Statement") (see Section 15.1.20, “CREATE LOGFILE GROUP Statement”). Multiple tablespaces may use the same log file group for `UNDO` logging.

When setting `EXTENT_SIZE` or `INITIAL_SIZE`, you may optionally follow the number with a one-letter abbreviation for an order of magnitude, similar to those used in `my.cnf`. Generally, this is one of the letters `M` (for megabytes) or `G` (for gigabytes).

`INITIAL_SIZE` and `EXTENT_SIZE` are subject to rounding as follows:

* `EXTENT_SIZE` is rounded up to the nearest whole multiple of 32K.

* `INITIAL_SIZE` is rounded *down* to the nearest whole multiple of 32K; this result is rounded up to the nearest whole multiple of `EXTENT_SIZE` (after any rounding).

Note

`NDB` reserves 4% of a tablespace for data node restart operations. This reserved space cannot be used for data storage.

The rounding just described is done explicitly, and a warning is issued by the MySQL Server when any such rounding is performed. The rounded values are also used by the NDB kernel for calculating `INFORMATION_SCHEMA.FILES` column values and other purposes. However, to avoid an unexpected result, we suggest that you always use whole multiples of 32K in specifying these options.

When `CREATE TABLESPACE` is used with `ENGINE [=] NDB`, a tablespace and associated data file are created on each Cluster data node. You can verify that the data files were created and obtain information about them by querying the Information Schema `FILES` table. (See the example later in this section.)

(See Section 28.3.15, “The INFORMATION_SCHEMA FILES Table”.)

#### Options

* `ADD DATAFILE`: Defines the name of a tablespace data file. This option is always required when creating an `NDB` tablespace; for `InnoDB`, it is required only when creating an undo tablespace. The `file_name`, including any specified path, must be quoted with single or double quotation marks. File names (not counting the file extension) and directory names must be at least one byte in length. Zero length file names and directory names are not supported.

  Because there are considerable differences in how `InnoDB` and `NDB` treat data files, the two storage engines are covered separately in the discussion that follows.

  **InnoDB data files.** An `InnoDB` tablespace supports only a single data file, whose name must include an `.ibd` extension.

  To place an `InnoDB` general tablespace data file in a location outside of the data directory, include a fully qualified path or a path relative to the data directory. Only a fully qualified path is permitted for undo tablespaces. If you do not specify a path, a general tablespace is created in the data directory. An undo tablespace created without specifying a path is created in the directory defined by the `innodb_undo_directory` variable. If `innodb_undo_directory` is not set, undo tablespaces are created in the data directory.

  To avoid conflicts with implicitly created file-per-table tablespaces, creating an `InnoDB` general tablespace in a subdirectory under the data directory is not supported. When creating a general tablespace or undo tablespace outside of the data directory, the directory must exist and must be known to `InnoDB` prior to creating the tablespace. To make a directory known to `InnoDB`, add it to the `innodb_directories` value or to one of the variables whose values are appended to the value of `innodb_directories`. `innodb_directories` is a read-only variable. Configuring it requires restarting the server.

  If the `ADD DATAFILE` clause is not specified when creating an `InnoDB` tablespace, a tablespace data file with a unique file name is created implicitly. The unique file name is a 128 bit UUID formatted into five groups of hexadecimal numbers separated by dashes (*`aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee`*). A file extension is added if required by the storage engine. An `.ibd` file extension is added for `InnoDB` general tablespace data files. In a replication environment, the data file name created on the replication source server is not the same as the data file name created on the replica.

  The `ADD DATAFILE` clause does not permit circular directory references when creating an `InnoDB` tablespace. For example, the circular directory reference (`/../`) in the following statement is not permitted:

  ```
  CREATE TABLESPACE ts1 ADD DATAFILE ts1.ibd 'any_directory/../ts1.ibd';
  ```

  An exception to this restriction exists on Linux, where a circular directory reference is permitted if the preceding directory is a symbolic link. For example, the data file path in the example above is permitted if *`any_directory`* is a symbolic link. (It is still permitted for data file paths to begin with '`../`'.)

  **NDB data files.** An `NDB` tablespace supports multiple data files which can have any legal file names; more data files can be added to an NDB Cluster tablespace following its creation by using an [`ALTER TABLESPACE`](alter-tablespace.html "15.1.12 ALTER TABLESPACE Statement") statement.

  An `NDB` tablespace data file is created by default in the data node file system directory—that is, the directory named `ndb_nodeid_fs/TS` under the data node's data directory (`DataDir`), where *`nodeid`* is the data node's `NodeId`. To place the data file in a location other than the default, include an absolute directory path or a path relative to the default location. If the directory specified does not exist, `NDB` attempts to create it; the system user account under which the data node process is running must have the appropriate permissions to do so.

  Note

  When determining the path used for a data file, `NDB` does not expand the `~` (tilde) character.

  When multiple data nodes are run on the same physical host, the following considerations apply:

  + You cannot specify an absolute path when creating a data file.

  + It is not possible to create tablespace data files outside the data node file system directory, unless each data node has a separate data directory.

  + If each data node has its own data directory, data files can be created anywhere within this directory.

  + If each data node has its own data directory, it may also be possible to create a data file outside the node's data directory using a relative path, as long as this path resolves to a unique location on the host file system for each data node running on that host.

* `FILE_BLOCK_SIZE`: This option—which is specific to `InnoDB` general tablespaces, and is ignored by `NDB`—defines the block size for the tablespace data file. Values can be specified in bytes or kilobytes. For example, an 8 kilobyte file block size can be specified as 8192 or 8K. If you do not specify this option, `FILE_BLOCK_SIZE` defaults to the `innodb_page_size` value. `FILE_BLOCK_SIZE` is required when you intend to use the tablespace for storing compressed `InnoDB` tables (`ROW_FORMAT=COMPRESSED`). In this case, you must define the tablespace `FILE_BLOCK_SIZE` when creating the tablespace.

  If `FILE_BLOCK_SIZE` is equal the `innodb_page_size` value, the tablespace can contain only tables having an uncompressed row format (`COMPACT`, `REDUNDANT`, and `DYNAMIC`). Tables with a `COMPRESSED` row format have a different physical page size than uncompressed tables. Therefore, compressed tables cannot coexist in the same tablespace as uncompressed tables.

  For a general tablespace to contain compressed tables, `FILE_BLOCK_SIZE` must be specified, and the `FILE_BLOCK_SIZE` value must be a valid compressed page size in relation to the `innodb_page_size` value. Also, the physical page size of the compressed table (`KEY_BLOCK_SIZE`) must be equal to `FILE_BLOCK_SIZE/1024`. For example, if `innodb_page_size=16K`, and `FILE_BLOCK_SIZE=8K`, the `KEY_BLOCK_SIZE` of the table must be 8. For more information, see Section 17.6.3.3, “General Tablespaces”.

* `USE LOGFILE GROUP`: Required for `NDB`, this is the name of a log file group previously created using [`CREATE LOGFILE GROUP`](create-logfile-group.html "15.1.20 CREATE LOGFILE GROUP Statement"). Not supported for `InnoDB`, where it fails with an error.

* `EXTENT_SIZE`: This option is specific to NDB, and is not supported by InnoDB, where it fails with an error. `EXTENT_SIZE` sets the size, in bytes, of the extents used by any files belonging to the tablespace. The default value is 1M. The minimum size is 32K, and theoretical maximum is 2G, although the practical maximum size depends on a number of factors. In most cases, changing the extent size does not have any measurable effect on performance, and the default value is recommended for all but the most unusual situations.

  An extent is a unit of disk space allocation. One extent is filled with as much data as that extent can contain before another extent is used. In theory, up to 65,535 (64K) extents may used per data file; however, the recommended maximum is 32,768 (32K). The recommended maximum size for a single data file is 32G—that is, 32K extents × 1 MB per extent. In addition, once an extent is allocated to a given partition, it cannot be used to store data from a different partition; an extent cannot store data from more than one partition. This means, for example that a tablespace having a single datafile whose `INITIAL_SIZE` (described in the following item) is 256 MB and whose `EXTENT_SIZE` is 128M has just two extents, and so can be used to store data from at most two different disk data table partitions.

  You can see how many extents remain free in a given data file by querying the Information Schema `FILES` table, and so derive an estimate for how much space remains free in the file. For further discussion and examples, see Section 28.3.15, “The INFORMATION_SCHEMA FILES Table”.

* `INITIAL_SIZE`: This option is specific to `NDB`, and is not supported by `InnoDB`, where it fails with an error.

  The `INITIAL_SIZE` parameter sets the total size in bytes of the data file that was specific using `ADD DATATFILE`. Once this file has been created, its size cannot be changed; however, you can add more data files to the tablespace using [`ALTER TABLESPACE ... ADD DATAFILE`](alter-tablespace.html "15.1.12 ALTER TABLESPACE Statement").

  `INITIAL_SIZE` is optional; its default value is 134217728 (128 MB).

  On 32-bit systems, the maximum supported value for `INITIAL_SIZE` is 4294967296 (4 GB).

* `AUTOEXTEND_SIZE`: Defines the amount by which `InnoDB` extends the size of the tablespace when it becomes full. The setting must be a multiple of 4MB. The default setting is 0, which causes the tablespace to be extended according to the implicit default behavior. For more information, see Section 17.6.3.9, “Tablespace AUTOEXTEND_SIZE Configuration”.

  Has no effect in any release of MySQL NDB Cluster, regardless of the storage engine used.

* `MAX_SIZE`: Currently ignored by MySQL; reserved for possible future use. Has no effect in any release of MySQL or MySQL NDB Cluster, regardless of the storage engine used.

* `NODEGROUP`: Currently ignored by MySQL; reserved for possible future use. Has no effect in any release of MySQL or MySQL NDB Cluster, regardless of the storage engine used.

* `WAIT`: Currently ignored by MySQL; reserved for possible future use. Has no effect in any release of MySQL or MySQL NDB Cluster, regardless of the storage engine used.

* `COMMENT`: Currently ignored by MySQL; reserved for possible future use. Has no effect in any release of MySQL or MySQL NDB Cluster, regardless of the storage engine used.

* The `ENCRYPTION` clause enables or disables page-level data encryption for an `InnoDB` general tablespace.

  If the `ENCRYPTION` clause is not specified, the `default_table_encryption` setting controls whether encryption is enabled. The `ENCRYPTION` clause overrides the `default_table_encryption` setting. However, if the `table_encryption_privilege_check` variable is enabled, the `TABLE_ENCRYPTION_ADMIN` privilege is required to use an `ENCRYPTION` clause setting that differs from the `default_table_encryption` setting.

  A keyring plugin must be installed and configured before an encryption-enabled tablespace can be created.

  When a general tablespace is encrypted, all tables residing in the tablespace are encrypted. Likewise, a table created in an encrypted tablespace is encrypted.

  For more information, see Section 17.13, “InnoDB Data-at-Rest Encryption”

* `ENGINE`: Defines the storage engine which uses the tablespace, where *`engine_name`* is the name of the storage engine. Currently, only the `InnoDB` storage engine is supported by standard MySQL 9.5 releases. MySQL NDB Cluster supports both `NDB` and `InnoDB` tablespaces. The value of the `default_storage_engine` system variable is used for `ENGINE` if the option is not specified.

* The `ENGINE_ATTRIBUTE` option is used to specify tablespace attributes for primary storage engines. The option is reserved for future use.

  The value assigned to this option must be a string literal containing a valid JSON document or an empty string (''). Invalid JSON is rejected.

  ```
  CREATE TABLESPACE ts1 ENGINE_ATTRIBUTE='{"key":"value"}';
  ```

  `ENGINE_ATTRIBUTE` values can be repeated without error. In this case, the last specified value is used.

  `ENGINE_ATTRIBUTE` values are not checked by the server, nor are they cleared when the table's storage engine is changed.

#### Notes

* For the rules covering the naming of MySQL tablespaces, see Section 11.2, “Schema Object Names”. In addition to these rules, the slash character (“/”) is not permitted, nor can you use names beginning with `innodb_`, as this prefix is reserved for system use.

* Creation of temporary general tablespaces is not supported.
* General tablespaces do not support temporary tables.
* The `TABLESPACE` option may be used with `CREATE TABLE` or `ALTER TABLE` to assign an `InnoDB` table partition or subpartition to a file-per-table tablespace. All partitions must belong to the same storage engine. Assigning table partitions to shared `InnoDB` tablespaces is not supported. Shared tablespaces include the `InnoDB` system tablespace and general tablespaces.

* General tablespaces support the addition of tables of any row format using [`CREATE TABLE ... TABLESPACE`](create-table.html "15.1.24 CREATE TABLE Statement"). `innodb_file_per_table` does not need to be enabled.

* `innodb_strict_mode` is not applicable to general tablespaces. Tablespace management rules are strictly enforced independently of `innodb_strict_mode`. If `CREATE TABLESPACE` parameters are incorrect or incompatible, the operation fails regardless of the `innodb_strict_mode` setting. When a table is added to a general tablespace using [`CREATE TABLE ... TABLESPACE`](create-table.html "15.1.24 CREATE TABLE Statement") or [`ALTER TABLE ... TABLESPACE`](alter-table.html "15.1.11 ALTER TABLE Statement"), `innodb_strict_mode` is ignored but the statement is evaluated as if `innodb_strict_mode` is enabled.

* Use `DROP TABLESPACE` to remove a tablespace. All tables must be dropped from a tablespace using `DROP TABLE` prior to dropping the tablespace. Before dropping an NDB Cluster tablespace you must also remove all its data files using one or more [`ALTER TABLESPACE ... DROP DATATFILE`](alter-tablespace.html "15.1.12 ALTER TABLESPACE Statement") statements. See Section 25.6.11.1, “NDB Cluster Disk Data Objects”.

* All parts of an `InnoDB` table added to an `InnoDB` general tablespace reside in the general tablespace, including indexes and `BLOB` pages.

  For an `NDB` table assigned to a tablespace, only those columns which are not indexed are stored on disk, and actually use the tablespace data files. Indexes and indexed columns for all `NDB` tables are always kept in memory.

* Similar to the system tablespace, truncating or dropping tables stored in a general tablespace creates free space internally in the general tablespace .ibd data file which can only be used for new `InnoDB` data. Space is not released back to the operating system as it is for file-per-table tablespaces.

* A general tablespace is not associated with any database or schema.

* [`ALTER TABLE ... DISCARD TABLESPACE`](alter-table.html "15.1.11 ALTER TABLE Statement") and [`ALTER TABLE ...IMPORT TABLESPACE`](alter-table.html "15.1.11 ALTER TABLE Statement") are not supported for tables that belong to a general tablespace.

* The server uses tablespace-level metadata locking for DDL that references general tablespaces. By comparison, the server uses table-level metadata locking for DDL that references file-per-table tablespaces.

* A generated or existing tablespace cannot be changed to a general tablespace.

* There is no conflict between general tablespace names and file-per-table tablespace names. The “/” character, which is present in file-per-table tablespace names, is not permitted in general tablespace names.

* **mysqldump** does not dump `InnoDB` [`CREATE TABLESPACE`](create-tablespace.html "15.1.25 CREATE TABLESPACE Statement") statements.

#### InnoDB Examples

This example demonstrates creating a general tablespace and adding three uncompressed tables of different row formats.

```
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' ENGINE=INNODB;

mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=REDUNDANT;

mysql> CREATE TABLE t2 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=COMPACT;

mysql> CREATE TABLE t3 (c1 INT PRIMARY KEY) TABLESPACE ts1 ROW_FORMAT=DYNAMIC;
```

This example demonstrates creating a general tablespace and adding a compressed table. The example assumes a default `innodb_page_size` value of 16K. The `FILE_BLOCK_SIZE` of 8192 requires that the compressed table have a `KEY_BLOCK_SIZE` of 8.

```
mysql> CREATE TABLESPACE `ts2` ADD DATAFILE 'ts2.ibd' FILE_BLOCK_SIZE = 8192 ENGINE=InnoDB;

mysql> CREATE TABLE t4 (c1 INT PRIMARY KEY) TABLESPACE ts2 ROW_FORMAT=COMPRESSED KEY_BLOCK_SIZE=8;
```

This example demonstrates creating a general tablespace without specifying the `ADD DATAFILE` clause, which is optional:

```
mysql> CREATE TABLESPACE `ts3` ENGINE=INNODB;
```

This example demonstrates creating an undo tablespace:

```
mysql> CREATE UNDO TABLESPACE undo_003 ADD DATAFILE 'undo_003.ibu';
```

#### NDB Example

Suppose that you wish to create an NDB Cluster Disk Data tablespace named `myts` using a datafile named `mydata-1.dat`. An `NDB` tablespace always requires the use of a log file group consisting of one or more undo log files. For this example, we first create a log file group named `mylg` that contains one undo long file named `myundo-1.dat`, using the `CREATE LOGFILE GROUP` statement shown here:

```
mysql> CREATE LOGFILE GROUP myg1
    ->     ADD UNDOFILE 'myundo-1.dat'
    ->     ENGINE=NDB;
Query OK, 0 rows affected (3.29 sec)
```

Now you can create the tablespace previously described using the following statement:

```
mysql> CREATE TABLESPACE myts
    ->     ADD DATAFILE 'mydata-1.dat'
    ->     USE LOGFILE GROUP mylg
    ->     ENGINE=NDB;
Query OK, 0 rows affected (2.98 sec)
```

You can now create a Disk Data table using a `CREATE TABLE` statement with the `TABLESPACE` and `STORAGE DISK` options, similar to what is shown here:

```
mysql> CREATE TABLE mytable (
    ->     id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ->     lname VARCHAR(50) NOT NULL,
    ->     fname VARCHAR(50) NOT NULL,
    ->     dob DATE NOT NULL,
    ->     joined DATE NOT NULL,
    ->     INDEX(last_name, first_name)
    -> )
    ->     TABLESPACE myts STORAGE DISK
    ->     ENGINE=NDB;
Query OK, 0 rows affected (1.41 sec)
```

It is important to note that only the `dob` and `joined` columns from `mytable` are actually stored on disk, due to the fact that the `id`, `lname`, and `fname` columns are all indexed.

As mentioned previously, when `CREATE TABLESPACE` is used with `ENGINE [=] NDB`, a tablespace and its associated data file are created on each NDB Cluster data node. You can verify that the data files were created and obtain information about them by querying the Information Schema `FILES` table, as shown here:

```
mysql> SELECT FILE_NAME, FILE_TYPE, LOGFILE_GROUP_NAME, STATUS, EXTRA
    ->     FROM INFORMATION_SCHEMA.FILES
    ->     WHERE TABLESPACE_NAME = 'myts';

+--------------+------------+--------------------+--------+----------------+
| file_name    | file_type  | logfile_group_name | status | extra          |
+--------------+------------+--------------------+--------+----------------+
| mydata-1.dat | DATAFILE   | mylg               | NORMAL | CLUSTER_NODE=5 |
| mydata-1.dat | DATAFILE   | mylg               | NORMAL | CLUSTER_NODE=6 |
| NULL         | TABLESPACE | mylg               | NORMAL | NULL           |
+--------------+------------+--------------------+--------+----------------+
3 rows in set (0.01 sec)
```

For additional information and examples, see Section 25.6.11.1, “NDB Cluster Disk Data Objects”.


### 15.1.26 CREATE TRIGGER Statement

```
CREATE
    [DEFINER = user]
    TRIGGER [IF NOT EXISTS] trigger_name
    trigger_time trigger_event
    ON tbl_name FOR EACH ROW
    [trigger_order]
    trigger_body

trigger_time: { BEFORE | AFTER }

trigger_event: { INSERT | UPDATE | DELETE }

trigger_order: { FOLLOWS | PRECEDES } other_trigger_name
```

This statement creates a new trigger. A trigger is a named database object that is associated with a table, and that activates when a particular event occurs for the table. The trigger becomes associated with the table named *`tbl_name`*, which must refer to a permanent table. You cannot associate a trigger with a `TEMPORARY` table or a view.

Trigger names exist in the schema namespace, meaning that all triggers must have unique names within a schema. Triggers in different schemas can have the same name.

`IF NOT EXISTS` prevents an error from occurring if a trigger having the same name, on the same table, exists in the same schema.

This section describes [`CREATE TRIGGER`](create-trigger.html "15.1.26 CREATE TRIGGER Statement") syntax. For additional discussion, see Section 27.4.1, “Trigger Syntax and Examples”.

`CREATE TRIGGER` requires the `TRIGGER` privilege for the table associated with the trigger. If the `DEFINER` clause is present, the privileges required depend on the *`user`* value, as discussed in Section 27.8, “Stored Object Access Control”. If binary logging is enabled, `CREATE TRIGGER` might require the `SUPER` privilege, as discussed in Section 27.9, “Stored Program Binary Logging”.

The `DEFINER` clause determines the security context to be used when checking access privileges at trigger activation time, as described later in this section.

*`trigger_time`* is the trigger action time. It can be `BEFORE` or `AFTER` to indicate that the trigger activates before or after each row to be modified.

Basic column value checks occur prior to trigger activation, so you cannot use `BEFORE` triggers to convert values inappropriate for the column type to valid values.

*`trigger_event`* indicates the kind of operation that activates the trigger. These *`trigger_event`* values are permitted:

* `INSERT`: The trigger activates whenever a new row is inserted into the table (for example, through `INSERT`, `LOAD DATA`, and `REPLACE` statements).

* `UPDATE`: The trigger activates whenever a row is modified (for example, through `UPDATE` statements).

* `DELETE`: The trigger activates whenever a row is deleted from the table (for example, through `DELETE` and `REPLACE` statements). `DROP TABLE` and `TRUNCATE TABLE` statements on the table do *not* activate this trigger, because they do not use `DELETE`. Dropping a partition does not activate `DELETE` triggers, either.

The *`trigger_event`* does not represent a literal type of SQL statement that activates the trigger so much as it represents a type of table operation. For example, an `INSERT` trigger activates not only for `INSERT` statements but also `LOAD DATA` statements because both statements insert rows into a table.

A potentially confusing example of this is the `INSERT INTO ... ON DUPLICATE KEY UPDATE ...` syntax: a `BEFORE INSERT` trigger activates for every row, followed by either an `AFTER INSERT` trigger or both the `BEFORE UPDATE` and `AFTER UPDATE` triggers, depending on whether there was a duplicate key for the row.

Note

Cascaded foreign key actions do not activate triggers.

It is possible to define multiple triggers for a given table that have the same trigger event and action time. For example, you can have two `BEFORE UPDATE` triggers for a table. By default, triggers that have the same trigger event and action time activate in the order they were created. To affect trigger order, specify a *`trigger_order`* clause that indicates `FOLLOWS` or `PRECEDES` and the name of an existing trigger that also has the same trigger event and action time. With `FOLLOWS`, the new trigger activates after the existing trigger. With `PRECEDES`, the new trigger activates before the existing trigger.

*`trigger_body`* is the statement to execute when the trigger activates. To execute multiple statements, use the `BEGIN ... END` compound statement construct. This also enables you to use the same statements that are permitted within stored routines. See Section 15.6.1, “BEGIN ... END Compound Statement”. Some statements are not permitted in triggers; see Section 27.10, “Restrictions on Stored Programs”.

Within the trigger body, you can refer to columns in the subject table (the table associated with the trigger) by using the aliases `OLD` and `NEW`. `OLD.col_name` refers to a column of an existing row before it is updated or deleted. `NEW.col_name` refers to the column of a new row to be inserted or an existing row after it is updated.

Triggers cannot use `NEW.col_name` or use `OLD.col_name` to refer to generated columns. For information about generated columns, see Section 15.1.24.8, “CREATE TABLE and Generated Columns”.

MySQL stores the `sql_mode` system variable setting in effect when a trigger is created, and always executes the trigger body with this setting in force, *regardless of the current server SQL mode when the trigger begins executing*.

The `DEFINER` clause specifies the MySQL account to be used when checking access privileges at trigger activation time. If the `DEFINER` clause is present, the *`user`* value should be a MySQL account specified as `'user_name'@'host_name'`, `CURRENT_USER`, or `CURRENT_USER()`. The permitted *`user`* values depend on the privileges you hold, as discussed in Section 27.8, “Stored Object Access Control”. Also see that section for additional information about trigger security.

If the `DEFINER` clause is omitted, the default definer is the user who executes the [`CREATE TRIGGER`](create-trigger.html "15.1.26 CREATE TRIGGER Statement") statement. This is the same as specifying `DEFINER = CURRENT_USER` explicitly.

MySQL takes the `DEFINER` user into account when checking trigger privileges as follows:

* At `CREATE TRIGGER` time, the user who issues the statement must have the `TRIGGER` privilege.

* At trigger activation time, privileges are checked against the `DEFINER` user. This user must have these privileges:

  + The `TRIGGER` privilege for the subject table.

  + The `SELECT` privilege for the subject table if references to table columns occur using `OLD.col_name` or `NEW.col_name` in the trigger body.

  + The `UPDATE` privilege for the subject table if table columns are targets of `SET NEW.col_name = value` assignments in the trigger body.

  + Whatever other privileges normally are required for the statements executed by the trigger.

Within a trigger body, the `CURRENT_USER` function returns the account used to check privileges at trigger activation time. This is the `DEFINER` user, not the user whose actions caused the trigger to be activated. For information about user auditing within triggers, see Section 8.2.23, “SQL-Based Account Activity Auditing”.

If you use `LOCK TABLES` to lock a table that has triggers, the tables used within the trigger are also locked, as described in LOCK TABLES and Triggers.

For additional discussion of trigger use, see Section 27.4.1, “Trigger Syntax and Examples”.


### 15.1.27 CREATE VIEW Statement

```
CREATE
    [OR REPLACE]
    [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
    [MATERIALIZED] ...
    [DEFINER = user]
    [SQL SECURITY { DEFINER | INVOKER }]
    VIEW view_name [(column_list)]
    AS select_statement
    [WITH [CASCADED | LOCAL] CHECK OPTION]

CREATE
    [ALGORITHM = {UNDEFINED | MERGE | TEMPTABLE}]
    [DEFINER = user]
    [SQL SECURITY { DEFINER | INVOKER }]
    [IF NOT EXISTS] VIEW view_name [(column_list)]
    AS select_statement
    [WITH [CASCADED | LOCAL] CHECK OPTION]
```

The `CREATE VIEW` statement creates a new view, or replaces an existing view if the `OR REPLACE` clause is given. If the view does not exist, [`CREATE OR REPLACE VIEW`](create-view.html "15.1.27 CREATE VIEW Statement") is the same as [`CREATE VIEW`](create-view.html "15.1.27 CREATE VIEW Statement"). If the view does exist, [`CREATE OR REPLACE VIEW`](create-view.html "15.1.27 CREATE VIEW Statement") replaces it.

Materialized views is only supported on MySQL HeatWave. See Query Materalized Views to learn more.

The *`select_statement`* is a `SELECT` statement that provides the definition of the view. (Selecting from the view selects, in effect, using the `SELECT` statement.) The *`select_statement`* can select from base tables or from other views. The `SELECT` statement can use a `VALUES` statement as its source, or can be replaced with a `TABLE` statement, as with [`CREATE TABLE ... SELECT`](create-table-select.html "15.1.24.4 CREATE TABLE ... SELECT Statement").

`IF NOT EXISTS` causes the view to be created if it does not already exist. If the view already exists and `IF NOT EXISTS` is specified, the statement is succeeds with a warning rather than an error; in this case, the view definition is not changed. For example:

```
mysql> CREATE VIEW v1 AS SELECT c1, c3 FROM t1;
Query OK, 0 rows affected (0.01 sec)

mysql> CREATE VIEW v1 AS SELECT c1, c3 FROM t1;
ERROR 1050 (42S01): Table 'v1' already exists
mysql> CREATE VIEW IF NOT EXISTS v1 AS SELECT c1, c3 FROM t1;
Query OK, 0 rows affected, 1 warning (0.01 sec)

mysql> SHOW WARNINGS;
+-------+------+---------------------------+
| Level | Code | Message                   |
+-------+------+---------------------------+
| Note  | 1050 | Table 'v1' already exists |
+-------+------+---------------------------+
1 row in set (0.00 sec)

mysql> SHOW CREATE VIEW v1\G
*************************** 1. row ***************************
                View: v1
         Create View: CREATE ALGORITHM=UNDEFINED DEFINER=`vuser`@`localhost` SQL
SECURITY DEFINER VIEW `v1` AS select `t1`.`c1` AS `c1`,`t1`.`c3` AS `c3` from `t1`
character_set_client: utf8mb4
collation_connection: utf8mb4_0900_ai_ci
1 row in set (0.00 sec)
```

`IF NOT EXISTS` and `OR REPLACE` are mutually exclusive and cannot be used together in the same `CREATE VIEW` statement. Attempting to do so causes the statement to be rejected with a syntax error.

For information about restrictions on view use, see Section 27.11, “Restrictions on Views”.

The view definition is “frozen” at creation time and is not affected by subsequent changes to the definitions of the underlying tables. For example, if a view is defined as `SELECT *` on a table, new columns added to the table later do not become part of the view, and columns dropped from the table result in an error when selecting from the view.

The `ALGORITHM` clause affects how MySQL processes the view. The `DEFINER` and `SQL SECURITY` clauses specify the security context to be used when checking access privileges at view invocation time. The `WITH CHECK OPTION` clause can be given to constrain inserts or updates to rows in tables referenced by the view. These clauses are described later in this section.

The `CREATE VIEW` statement requires the `CREATE VIEW` privilege for the view, and some privilege for each column selected by the `SELECT` statement. For columns used elsewhere in the `SELECT` statement, you must have the `SELECT` privilege. If the `OR REPLACE` clause is present, you must also have the `DROP` privilege for the view. If the `DEFINER` clause is present, the privileges required depend on the *`user`* value, as discussed in Section 27.8, “Stored Object Access Control”.

When a view is referenced, privilege checking occurs as described later in this section.

A view belongs to a database. By default, a new view is created in the default database. To create the view explicitly in a given database, use *`db_name.view_name`* syntax to qualify the view name with the database name:

```
CREATE VIEW test.v AS SELECT * FROM t;
```

Unqualified table or view names in the `SELECT` statement are also interpreted with respect to the default database. A view can refer to tables or views in other databases by qualifying the table or view name with the appropriate database name.

Within a database, base tables and views share the same namespace, so a base table and a view cannot have the same name.

Columns retrieved by the `SELECT` statement can be simple references to table columns, or expressions that use functions, constant values, operators, and so forth.

A view must have unique column names with no duplicates, just like a base table. By default, the names of the columns retrieved by the `SELECT` statement are used for the view column names. To define explicit names for the view columns, specify the optional *`column_list`* clause as a list of comma-separated identifiers. The number of names in *`column_list`* must be the same as the number of columns retrieved by the `SELECT` statement.

A view can be created from many kinds of `SELECT` statements. It can refer to base tables or other views. It can use joins, `UNION`, and subqueries. The `SELECT` need not even refer to any tables:

```
CREATE VIEW v_today (today) AS SELECT CURRENT_DATE;
```

The following example defines a view that selects two columns from another table as well as an expression calculated from those columns:

```
mysql> CREATE TABLE t (qty INT, price INT);
mysql> INSERT INTO t VALUES(3, 50);
mysql> CREATE VIEW v AS SELECT qty, price, qty*price AS value FROM t;
mysql> SELECT * FROM v;
+------+-------+-------+
| qty  | price | value |
+------+-------+-------+
|    3 |    50 |   150 |
+------+-------+-------+
```

A view definition is subject to the following restrictions:

* The `SELECT` statement cannot refer to system variables or user-defined variables.

* Within a stored program, the `SELECT` statement cannot refer to program parameters or local variables.

* The `SELECT` statement cannot refer to prepared statement parameters.

* Any table or view referred to in the definition must exist. If, after the view has been created, a table or view that the definition refers to is dropped, use of the view results in an error. To check a view definition for problems of this kind, use the `CHECK TABLE` statement.

* The definition cannot refer to a `TEMPORARY` table, and you cannot create a `TEMPORARY` view.

* You cannot associate a trigger with a view.
* Aliases for column names in the `SELECT` statement are checked against the maximum column length of 64 characters (not the maximum alias length of 256 characters).

`ORDER BY` is permitted in a view definition, but it is ignored if you select from a view using a statement that has its own `ORDER BY`.

For other options or clauses in the definition, they are added to the options or clauses of the statement that references the view, but the effect is undefined. For example, if a view definition includes a `LIMIT` clause, and you select from the view using a statement that has its own `LIMIT` clause, it is undefined which limit applies. This same principle applies to options such as `ALL`, `DISTINCT`, or `SQL_SMALL_RESULT` that follow the `SELECT` keyword, and to clauses such as `INTO`, `FOR UPDATE`, `FOR SHARE`, `LOCK IN SHARE MODE`, and `PROCEDURE`.

The results obtained from a view may be affected if you change the query processing environment by changing system variables:

```
mysql> CREATE VIEW v (mycol) AS SELECT 'abc';
Query OK, 0 rows affected (0.01 sec)

mysql> SET sql_mode = '';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT "mycol" FROM v;
+-------+
| mycol |
+-------+
| mycol |
+-------+
1 row in set (0.01 sec)

mysql> SET sql_mode = 'ANSI_QUOTES';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT "mycol" FROM v;
+-------+
| mycol |
+-------+
| abc   |
+-------+
1 row in set (0.00 sec)
```

The `DEFINER` and `SQL SECURITY` clauses determine which MySQL account to use when checking access privileges for the view when a statement is executed that references the view. The valid `SQL SECURITY` characteristic values are `DEFINER` (the default) and `INVOKER`. These indicate that the required privileges must be held by the user who defined or invoked the view, respectively.

If the `DEFINER` clause is present, the *`user`* value should be a MySQL account specified as `'user_name'@'host_name'`, `CURRENT_USER`, or `CURRENT_USER()`. The permitted *`user`* values depend on the privileges you hold, as discussed in Section 27.8, “Stored Object Access Control”. Also see that section for additional information about view security.

If the `DEFINER` clause is omitted, the default definer is the user who executes the [`CREATE VIEW`](create-view.html "15.1.27 CREATE VIEW Statement") statement. This is the same as specifying `DEFINER = CURRENT_USER` explicitly.

Within a view definition, the `CURRENT_USER` function returns the view's `DEFINER` value by default. For views defined with the `SQL SECURITY INVOKER` characteristic, `CURRENT_USER` returns the account for the view's invoker. For information about user auditing within views, see Section 8.2.23, “SQL-Based Account Activity Auditing”.

Within a stored routine that is defined with the `SQL SECURITY DEFINER` characteristic, `CURRENT_USER` returns the routine's `DEFINER` value. This also affects a view defined within such a routine, if the view definition contains a `DEFINER` value of `CURRENT_USER`.

MySQL checks view privileges like this:

* At view definition time, the view creator must have the privileges needed to use the top-level objects accessed by the view. For example, if the view definition refers to table columns, the creator must have some privilege for each column in the select list of the definition, and the `SELECT` privilege for each column used elsewhere in the definition. If the definition refers to a stored function, only the privileges needed to invoke the function can be checked. The privileges required at function invocation time can be checked only as it executes: For different invocations, different execution paths within the function might be taken.

* The user who references a view must have appropriate privileges to access it (`SELECT` to select from it, `INSERT` to insert into it, and so forth.)

* When a view has been referenced, privileges for objects accessed by the view are checked against the privileges held by the view `DEFINER` account or invoker, depending on whether the `SQL SECURITY` characteristic is `DEFINER` or `INVOKER`, respectively.

* If reference to a view causes execution of a stored function, privilege checking for statements executed within the function depend on whether the function `SQL SECURITY` characteristic is `DEFINER` or `INVOKER`. If the security characteristic is `DEFINER`, the function runs with the privileges of the `DEFINER` account. If the characteristic is `INVOKER`, the function runs with the privileges determined by the view's `SQL SECURITY` characteristic.

Example: A view might depend on a stored function, and that function might invoke other stored routines. For example, the following view invokes a stored function `f()`:

```
CREATE VIEW v AS SELECT * FROM t WHERE t.id = f(t.name);
```

Suppose that `f()` contains a statement such as this:

```
IF name IS NULL then
  CALL p1();
ELSE
  CALL p2();
END IF;
```

The privileges required for executing statements within `f()` need to be checked when `f()` executes. This might mean that privileges are needed for `p1()` or `p2()`, depending on the execution path within `f()`. Those privileges must be checked at runtime, and the user who must possess the privileges is determined by the `SQL SECURITY` values of the view `v` and the function `f()`.

The `DEFINER` and `SQL SECURITY` clauses for views are extensions to standard SQL. In standard SQL, views are handled using the rules for `SQL SECURITY DEFINER`. The standard says that the definer of the view, which is the same as the owner of the view's schema, gets applicable privileges on the view (for example, `SELECT`) and may grant them. MySQL has no concept of a schema “owner”, so MySQL adds a clause to identify the definer. The `DEFINER` clause is an extension where the intent is to have what the standard has; that is, a permanent record of who defined the view. This is why the default `DEFINER` value is the account of the view creator.

The optional `ALGORITHM` clause is a MySQL extension to standard SQL. It affects how MySQL processes the view. `ALGORITHM` takes three values: `MERGE`, `TEMPTABLE`, or `UNDEFINED`. For more information, see Section 27.6.2, “View Processing Algorithms”, as well as [Section 10.2.2.4, “Optimizing Derived Tables, View References, and Common Table Expressions with Merging or Materialization”](derived-table-optimization.html "10.2.2.4 Optimizing Derived Tables, View References, and Common Table Expressions with Merging or Materialization").

Some views are updatable. That is, you can use them in statements such as `UPDATE`, `DELETE`, or `INSERT` to update the contents of the underlying table. For a view to be updatable, there must be a one-to-one relationship between the rows in the view and the rows in the underlying table. There are also certain other constructs that make a view nonupdatable.

A generated column in a view is considered updatable because it is possible to assign to it. However, if such a column is updated explicitly, the only permitted value is `DEFAULT`. For information about generated columns, see Section 15.1.24.8, “CREATE TABLE and Generated Columns”.

The `WITH CHECK OPTION` clause can be given for an updatable view to prevent inserts or updates to rows except those for which the `WHERE` clause in the *`select_statement`* is true.

In a `WITH CHECK OPTION` clause for an updatable view, the `LOCAL` and `CASCADED` keywords determine the scope of check testing when the view is defined in terms of another view. The `LOCAL` keyword restricts the `CHECK OPTION` only to the view being defined. `CASCADED` causes the checks for underlying views to be evaluated as well. When neither keyword is given, the default is `CASCADED`.

For more information about updatable views and the `WITH CHECK OPTION` clause, see Section 27.6.3, “Updatable and Insertable Views”, and Section 27.6.4, “The View WITH CHECK OPTION Clause”.


### 15.1.28 DROP DATABASE Statement

```
DROP {DATABASE | SCHEMA} [IF EXISTS] db_name
```

`DROP DATABASE` drops all tables in the database and deletes the database. Be *very* careful with this statement! To use `DROP DATABASE`, you need the `DROP` privilege on the database. [`DROP SCHEMA`](drop-database.html "15.1.28 DROP DATABASE Statement") is a synonym for [`DROP DATABASE`](drop-database.html "15.1.28 DROP DATABASE Statement").

Important

When a database is dropped, privileges granted specifically for the database are *not* automatically dropped. They must be dropped manually. See Section 15.7.1.6, “GRANT Statement”.

`IF EXISTS` is used to prevent an error from occurring if the database does not exist.

If the default database is dropped, the default database is unset (the `DATABASE()` function returns `NULL`).

If you use `DROP DATABASE` on a symbolically linked database, both the link and the original database are deleted.

`DROP DATABASE` returns the number of tables that were removed.

The `DROP DATABASE` statement removes from the given database directory those files and directories that MySQL itself may create during normal operation. This includes all files with the extensions shown in the following list:

* `.BAK`
* `.DAT`
* `.HSH`
* `.MRG`
* `.MYD`
* `.MYI`
* `.cfg`
* `.db`
* `.ibd`
* `.ndb`

If other files or directories remain in the database directory after MySQL removes those just listed, the database directory cannot be removed. In this case, you must remove any remaining files or directories manually and issue the `DROP DATABASE` statement again. To keep this from happening, ensure that all tables in the database use a storage engine that supports atomic DDL (see Section 15.1.1, “Atomic Data Definition Statement Support”), such as `InnoDB`.

Dropping a database does not remove any `TEMPORARY` tables that were created in that database. `TEMPORARY` tables are automatically removed when the session that created them ends. See Section 15.1.24.2, “CREATE TEMPORARY TABLE Statement”.

You can also drop databases with **mysqladmin**. See Section 6.5.2, “mysqladmin — A MySQL Server Administration Program”.


### 15.1.29 DROP EVENT Statement

```
DROP EVENT [IF EXISTS] event_name
```

This statement drops the event named *`event_name`*. The event immediately ceases being active, and is deleted completely from the server.

If the event does not exist, the error ERROR 1517 (HY000): Unknown event '*`event_name`*' results. You can override this and cause the statement to generate a warning for nonexistent events instead using `IF EXISTS`.

This statement requires the `EVENT` privilege for the schema to which the event to be dropped belongs.


### 15.1.30 DROP FUNCTION Statement

The `DROP FUNCTION` statement is used to drop stored functions and loadable functions:

* For information about dropping stored functions, see Section 15.1.34, “DROP PROCEDURE and DROP FUNCTION Statements”.

* For information about dropping loadable functions, see Section 15.7.4.2, “DROP FUNCTION Statement for Loadable Functions”.


### 15.1.31 DROP INDEX Statement

```
DROP INDEX index_name ON tbl_name
    [algorithm_option | lock_option] ...

algorithm_option:
    ALGORITHM [=] {DEFAULT | INPLACE | COPY}

lock_option:
    LOCK [=] {DEFAULT | NONE | SHARED | EXCLUSIVE}
```

`DROP INDEX` drops the index named *`index_name`* from the table *`tbl_name`*. This statement is mapped to an `ALTER TABLE` statement to drop the index. See Section 15.1.11, “ALTER TABLE Statement”.

To drop a primary key, the index name is always `PRIMARY`, which must be specified as a quoted identifier because `PRIMARY` is a reserved word:

```
DROP INDEX `PRIMARY` ON t;
```

Indexes on variable-width columns of `NDB` tables are dropped online; that is, without any table copying. The table is not locked against access from other NDB Cluster API nodes, although it is locked against other operations on the *same* API node for the duration of the operation. This is done automatically by the server whenever it determines that it is possible to do so; you do not have to use any special SQL syntax or server options to cause it to happen.

`ALGORITHM` and `LOCK` clauses may be given to influence the table copying method and level of concurrency for reading and writing the table while its indexes are being modified. They have the same meaning as for the `ALTER TABLE` statement. For more information, see Section 15.1.11, “ALTER TABLE Statement”

MySQL NDB Cluster supports online operations using the same `ALGORITHM=INPLACE` syntax supported in the standard MySQL Server. See Section 25.6.12, “Online Operations with ALTER TABLE in NDB Cluster”, for more information.


### 15.1.32 DROP LIBRARY Statement

```
DROP LIBRARY [IF EXISTS] [database.]library
```

Drops the named JavaScript library. An optional database name may be specified; otherwise, the current database is assumed.

To execute this statement, the user must have the `ALTER ROUTINE` privilege. A library created by a user with the `SYSTEM_USER` privilege can be dropped only by a user having the same privilege.

See Section 27.3.8, “Using JavaScript Libraries”, for more information and examples.


### 15.1.33 DROP LOGFILE GROUP Statement

```
DROP LOGFILE GROUP logfile_group
    ENGINE [=] engine_name
```

This statement drops the log file group named *`logfile_group`*. The log file group must already exist or an error results. (For information on creating log file groups, see Section 15.1.20, “CREATE LOGFILE GROUP Statement”.)

Important

Before dropping a log file group, you must drop all tablespaces that use that log file group for `UNDO` logging.

The required `ENGINE` clause provides the name of the storage engine used by the log file group to be dropped. The only permitted values for *`engine_name`* are `NDB` and `NDBCLUSTER`.

`DROP LOGFILE GROUP` is useful only with Disk Data storage for NDB Cluster. See Section 25.6.11, “NDB Cluster Disk Data Tables”.


### 15.1.34 DROP PROCEDURE and DROP FUNCTION Statements

```
DROP {PROCEDURE | FUNCTION} [IF EXISTS] sp_name
```

These statements are used to drop a stored routine (a stored procedure or function). That is, the specified routine is removed from the server. (`DROP FUNCTION` is also used to drop loadable functions; see Section 15.7.4.2, “DROP FUNCTION Statement for Loadable Functions”.)

To drop a stored routine, you must have the `ALTER ROUTINE` privilege for it. (If the `automatic_sp_privileges` system variable is enabled, that privilege and `EXECUTE` are granted automatically to the routine creator when the routine is created and dropped from the creator when the routine is dropped. See Section 27.2.2, “Stored Routines and MySQL Privileges”.)

In addition, if the definer of the routine has the `SYSTEM_USER` privilege, the user dropping it must also have this privilege.

The `IF EXISTS` clause is a MySQL extension. It prevents an error from occurring if the procedure or function does not exist. A warning is produced that can be viewed with `SHOW WARNINGS`.

`DROP FUNCTION` is also used to drop loadable functions (see Section 15.7.4.2, “DROP FUNCTION Statement for Loadable Functions”).


### 15.1.35 DROP SERVER Statement

```
DROP SERVER [ IF EXISTS ] server_name
```

Drops the server definition for the server named `server_name`. The corresponding row in the `mysql.servers` table is deleted. This statement requires the `SUPER` privilege.

Dropping a server for a table does not affect any `FEDERATED` tables that used this connection information when they were created. See Section 15.1.22, “CREATE SERVER Statement”.

`DROP SERVER` causes an implicit commit. See Section 15.3.3, “Statements That Cause an Implicit Commit”.

`DROP SERVER` is not written to the binary log, regardless of the logging format that is in use.


### 15.1.36 DROP SPATIAL REFERENCE SYSTEM Statement

```
DROP SPATIAL REFERENCE SYSTEM
    [IF EXISTS]
    srid

srid: 32-bit unsigned integer
```

This statement removes a [spatial reference system](spatial-reference-systems.html "13.4.5 Spatial Reference System Support") (SRS) definition from the data dictionary. It requires the `CREATE_SPATIAL_REFERENCE_SYSTEM` privilege (or `SUPER`).

Example:

```
DROP SPATIAL REFERENCE SYSTEM 4120;
```

If no SRS definition with the SRID value exists, an error occurs unless `IF EXISTS` is specified. In that case, a warning occurs rather than an error.

If the SRID value is used by some column in an existing table, an error occurs. For example:

```
mysql> DROP SPATIAL REFERENCE SYSTEM 4326;
ERROR 3716 (SR005): Can't modify SRID 4326. There is at
least one column depending on it.
```

To identify which column or columns use the SRID, use this query:

```
SELECT * FROM INFORMATION_SCHEMA.ST_GEOMETRY_COLUMNS WHERE SRS_ID=4326;
```

SRID values must be in the range of 32-bit unsigned integers, with these restrictions:

* SRID 0 is a valid SRID but cannot be used with `DROP SPATIAL REFERENCE SYSTEM`.

* If the value is in a reserved SRID range, a warning occurs. Reserved ranges are [0, 32767] (reserved by EPSG), [60,000,000, 69,999,999] (reserved by EPSG), and [2,000,000,000, 2,147,483,647] (reserved by MySQL). EPSG stands for the [European Petroleum Survey Group](http://epsg.org).

* Users should not drop SRSs with SRIDs in the reserved ranges. If system-installed SRSs are dropped, the SRS definitions may be recreated for MySQL upgrades.


### 15.1.37 DROP TABLE Statement

```
DROP [TEMPORARY] TABLE [IF EXISTS]
    tbl_name [, tbl_name] ...
    [RESTRICT | CASCADE]
```

`DROP TABLE` removes one or more tables. You must have the `DROP` privilege for each table.

*Be careful* with this statement! For each table, it removes the table definition and all table data. If the table is partitioned, the statement removes the table definition, all its partitions, all data stored in those partitions, and all partition definitions associated with the dropped table.

Dropping a table also drops any triggers for the table.

`DROP TABLE` causes an implicit commit, except when used with the `TEMPORARY` keyword. See Section 15.3.3, “Statements That Cause an Implicit Commit”.

Important

When a table is dropped, privileges granted specifically for the table are *not* automatically dropped. They must be dropped manually. See Section 15.7.1.6, “GRANT Statement”.

If any tables named in the argument list do not exist, `DROP TABLE` behavior depends on whether the `IF EXISTS` clause is given:

* Without `IF EXISTS`, the statement fails with an error indicating which nonexisting tables it was unable to drop, and no changes are made.

* With `IF EXISTS`, no error occurs for nonexisting tables. The statement drops all named tables that do exist, and generates a `NOTE` diagnostic for each nonexistent table. These notes can be displayed with `SHOW WARNINGS`. See Section 15.7.7.43, “SHOW WARNINGS Statement”.

`IF EXISTS` can also be useful for dropping tables in unusual circumstances under which there is an entry in the data dictionary but no table managed by the storage engine. (For example, if an abnormal server exit occurs after removal of the table from the storage engine but before removal of the data dictionary entry.)

The `TEMPORARY` keyword has the following effects:

* The statement drops only `TEMPORARY` tables.
* The statement does not cause an implicit commit.
* No access rights are checked. A `TEMPORARY` table is visible only with the session that created it, so no check is necessary.

Including the `TEMPORARY` keyword is a good way to prevent accidentally dropping non-`TEMPORARY` tables.

The `RESTRICT` and `CASCADE` keywords do nothing. They are permitted to make porting easier from other database systems.

`DROP TABLE` is not supported with all `innodb_force_recovery` settings. See Section 17.20.3, “Forcing InnoDB Recovery”.


### 15.1.38 DROP TABLESPACE Statement

```
DROP [UNDO] TABLESPACE tablespace_name
```

This statement drops a tablespace that was previously created using `CREATE TABLESPACE`. It is supported by the `NDB` and `InnoDB` storage engines.

The `UNDO` keyword must be specified to drop an undo tablespace. Only undo tablespaces created using [`CREATE UNDO TABLESPACE`](create-tablespace.html "15.1.25 CREATE TABLESPACE Statement") syntax can be dropped. An undo tablespace must be in an `empty` state before it can be dropped. For more information, see Section 17.6.3.4, “Undo Tablespaces”.

`tablespace_name` is a case-sensitive identifier in MySQL.

For an `InnoDB` general tablespace, all tables must be dropped from the tablespace prior to a `DROP TABLESPACE` operation. If the tablespace is not empty, `DROP TABLESPACE` returns an error.

An `NDB` tablespace to be dropped must not contain any data files; in other words, before you can drop an `NDB` tablespace, you must first drop each of its data files using [`ALTER TABLESPACE ... DROP DATAFILE`](alter-tablespace.html "15.1.12 ALTER TABLESPACE Statement").

#### Notes

* A general `InnoDB` tablespace is not deleted automatically when the last table in the tablespace is dropped. The tablespace must be dropped explicitly using `DROP TABLESPACE tablespace_name`.

* A `DROP DATABASE` operation can drop tables that belong to a general tablespace but it cannot drop the tablespace, even if the operation drops all tables that belong to the tablespace. The tablespace must be dropped explicitly using `DROP TABLESPACE tablespace_name`.

* Similar to the system tablespace, truncating or dropping tables stored in a general tablespace creates free space internally in the general tablespace .ibd data file which can only be used for new `InnoDB` data. Space is not released back to the operating system as it is for file-per-table tablespaces.

#### InnoDB Examples

This example demonstrates how to drop an `InnoDB` general tablespace. The general tablespace `ts1` is created with a single table. Before dropping the tablespace, the table must be dropped.

```
mysql> CREATE TABLESPACE `ts1` ADD DATAFILE 'ts1.ibd' Engine=InnoDB;

mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) TABLESPACE ts1 Engine=InnoDB;

mysql> DROP TABLE t1;

mysql> DROP TABLESPACE ts1;
```

This example demonstrates dropping an undo tablespace. An undo tablespace must be in an `empty` state before it can be dropped. For more information, see Section 17.6.3.4, “Undo Tablespaces”.

```
mysql> DROP UNDO TABLESPACE undo_003;
```

#### NDB Example

This example shows how to drop an `NDB` tablespace `myts` having a data file named `mydata-1.dat` after first creating the tablespace, and assumes the existence of a log file group named `mylg` (see Section 15.1.20, “CREATE LOGFILE GROUP Statement”).

```
mysql> CREATE TABLESPACE myts
    ->     ADD DATAFILE 'mydata-1.dat'
    ->     USE LOGFILE GROUP mylg
    ->     ENGINE=NDB;
```

You must remove all data files from the tablespace using `ALTER TABLESPACE`, as shown here, before it can be dropped:

```
mysql> ALTER TABLESPACE myts
    ->     DROP DATAFILE 'mydata-1.dat';

mysql> DROP TABLESPACE myts;
```


### 15.1.39 DROP TRIGGER Statement

```
DROP TRIGGER [IF EXISTS] [schema_name.]trigger_name
```

This statement drops a trigger. The schema (database) name is optional. If the schema is omitted, the trigger is dropped from the default schema. `DROP TRIGGER` requires the `TRIGGER` privilege for the table associated with the trigger.

Use `IF EXISTS` to prevent an error from occurring for a trigger that does not exist. A `NOTE` is generated for a nonexistent trigger when using `IF EXISTS`. See Section 15.7.7.43, “SHOW WARNINGS Statement”.

Triggers for a table are also dropped if you drop the table.


### 15.1.40 DROP VIEW Statement

```
DROP VIEW [IF EXISTS]
    view_name [, view_name] ...
    [RESTRICT | CASCADE]
```

`DROP VIEW` removes one or more views. You must have the `DROP` privilege for each view. `DROP VIEW` works with SQL views (see Section 27.6, “Using Views”) as well as with JSON duality views (see Section 27.7, “JSON Duality Views”).

If any views named in the argument list do not exist, the statement fails with an error indicating by name which nonexisting views it was unable to drop, and no changes are made.

The `IF EXISTS` clause prevents an error from occurring for views that don't exist. When this clause is given, a `NOTE` is generated for each nonexistent view. See Section 15.7.7.43, “SHOW WARNINGS Statement”.

`RESTRICT` and `CASCADE`, if given, are parsed and ignored.


### 15.1.41 RENAME TABLE Statement

```
RENAME TABLE
    tbl_name TO new_tbl_name
    [, tbl_name2 TO new_tbl_name2] ...
```

`RENAME TABLE` renames one or more tables. You must have `ALTER` and `DROP` privileges for the original table, and `CREATE` and `INSERT` privileges for the new table.

For example, to rename a table named `old_table` to `new_table`, use this statement:

```
RENAME TABLE old_table TO new_table;
```

That statement is equivalent to the following `ALTER TABLE` statement:

```
ALTER TABLE old_table RENAME new_table;
```

`RENAME TABLE`, unlike [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement"), can rename multiple tables within a single statement:

```
RENAME TABLE old_table1 TO new_table1,
             old_table2 TO new_table2,
             old_table3 TO new_table3;
```

Renaming operations are performed left to right. Thus, to swap two table names, do this (assuming that a table with the intermediary name `tmp_table` does not already exist):

```
RENAME TABLE old_table TO tmp_table,
             new_table TO old_table,
             tmp_table TO new_table;
```

Metadata locks on tables are acquired in name order, which in some cases can make a difference in operation outcome when multiple transactions execute concurrently. See Section 10.11.4, “Metadata Locking”.

You can rename tables locked with a [`LOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") statement, provided that they are locked with a `WRITE` lock or are the product of renaming `WRITE`-locked tables from earlier steps in a multiple-table rename operation. For example, this is permitted:

```
LOCK TABLE old_table1 WRITE;
RENAME TABLE old_table1 TO new_table1,
             new_table1 TO new_table2;
```

This is not permitted:

```
LOCK TABLE old_table1 READ;
RENAME TABLE old_table1 TO new_table1,
             new_table1 TO new_table2;
```

With the transaction table locking conditions satisfied, the rename operation is done atomically; no other session can access any of the tables while the rename is in progress.

If any errors occur during a `RENAME TABLE`, the statement fails and no changes are made.

You can use `RENAME TABLE` to move a table from one database to another:

```
RENAME TABLE current_db.tbl_name TO other_db.tbl_name;
```

Using this method to move all tables from one database to a different one in effect renames the database (an operation for which MySQL has no single statement), except that the original database continues to exist, albeit with no tables.

Like `RENAME TABLE`, `ALTER TABLE ... RENAME` can also be used to move a table to a different database. Regardless of the statement used, if the rename operation would move the table to a database located on a different file system, the success of the outcome is platform specific and depends on the underlying operating system calls used to move table files.

If a table has triggers, attempts to rename the table into a different database fail with a Trigger in wrong schema (`ER_TRG_IN_WRONG_SCHEMA`) error.

An unencrypted table can be moved to an encryption-enabled database and vice versa. However, if the `table_encryption_privilege_check` variable is enabled, the `TABLE_ENCRYPTION_ADMIN` privilege is required if the table encryption setting differs from the default database encryption.

To rename `TEMPORARY` tables, `RENAME TABLE` does not work. Use [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") instead.

`RENAME TABLE` works for views, except that views cannot be renamed into a different database.

Any privileges granted specifically for a renamed table or view are not migrated to the new name. They must be changed manually.

`RENAME TABLE tbl_name TO new_tbl_name` changes internally generated foreign key constraint names and user-defined foreign key constraint names that begin with the string “*`tbl_name`*_ibfk_” to reflect the new table name. `InnoDB` interprets foreign key constraint names that begin with the string “*`tbl_name`*_ibfk_” as internally generated names.

Foreign key constraint names that point to the renamed table are automatically updated unless there is a conflict, in which case the statement fails with an error. A conflict occurs if the renamed constraint name already exists. In such cases, you must drop and re-create the foreign keys for them to function properly.

`RENAME TABLE tbl_name TO new_tbl_name` changes internally generated and user-defined `CHECK` constraint names that begin with the string “*`tbl_name`*_chk_” to reflect the new table name. MySQL interprets `CHECK` constraint names that begin with the string “*`tbl_name`*_chk_” as internally generated names. Example:

```
mysql> SHOW CREATE TABLE t1\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t1` (
  `i1` int(11) DEFAULT NULL,
  `i2` int(11) DEFAULT NULL,
  CONSTRAINT `t1_chk_1` CHECK ((`i1` > 0)),
  CONSTRAINT `t1_chk_2` CHECK ((`i2` < 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.02 sec)

mysql> RENAME TABLE t1 TO t3;
Query OK, 0 rows affected (0.03 sec)

mysql> SHOW CREATE TABLE t3\G
*************************** 1. row ***************************
       Table: t3
Create Table: CREATE TABLE `t3` (
  `i1` int(11) DEFAULT NULL,
  `i2` int(11) DEFAULT NULL,
  CONSTRAINT `t3_chk_1` CHECK ((`i1` > 0)),
  CONSTRAINT `t3_chk_2` CHECK ((`i2` < 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.01 sec)
```


### 15.1.42 TRUNCATE TABLE Statement

```
TRUNCATE [TABLE] tbl_name
```

`TRUNCATE TABLE` empties a table completely. It requires the `DROP` privilege. Logically, [`TRUNCATE TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement") is similar to a `DELETE` statement that deletes all rows, or a sequence of `DROP TABLE` and `CREATE TABLE` statements.

To achieve high performance, [`TRUNCATE TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement") bypasses the DML method of deleting data. Thus, it does not cause `ON DELETE` triggers to fire, it cannot be performed for `InnoDB` tables with parent-child foreign key relationships, and it cannot be rolled back like a DML operation. However, `TRUNCATE TABLE` operations on tables that use an atomic DDL-supported storage engine are either fully committed or rolled back if the server halts during their operation. For more information, see Section 15.1.1, “Atomic Data Definition Statement Support”.

Although `TRUNCATE TABLE` is similar to `DELETE`, it is classified as a DDL statement rather than a DML statement. It differs from `DELETE` in the following ways:

* Truncate operations drop and re-create the table, which is much faster than deleting rows one by one, particularly for large tables.

* Truncate operations cause an implicit commit, and so cannot be rolled back. See Section 15.3.3, “Statements That Cause an Implicit Commit”.

* Truncation operations cannot be performed if the session holds an active table lock.

* `TRUNCATE TABLE` fails for an `InnoDB` table or `NDB` table if there are any `FOREIGN KEY` constraints from other tables that reference the table. Foreign key constraints between columns of the same table are permitted.

* Truncation operations do not return a meaningful value for the number of deleted rows. The usual result is “0 rows affected,” which should be interpreted as “no information.”

* As long as the table definition is valid, the table can be re-created as an empty table with `TRUNCATE TABLE`, even if the data or index files have become corrupted.

* Any `AUTO_INCREMENT` value is reset to its start value. This is true even for `MyISAM` and `InnoDB`, which normally do not reuse sequence values.

* When used with partitioned tables, `TRUNCATE TABLE` preserves the partitioning; that is, the data and index files are dropped and re-created, while the partition definitions are unaffected.

* The `TRUNCATE TABLE` statement does not invoke `ON DELETE` triggers.

* Truncating a corrupted `InnoDB` table is supported.

`TRUNCATE TABLE` is treated for purposes of binary logging and replication as DDL rather than DML, and is always logged as a statement.

`TRUNCATE TABLE` for a table closes all handlers for the table that were opened with `HANDLER OPEN`.

`TRUNCATE TABLE` can be used with Performance Schema summary tables, but the effect is to reset the summary columns to 0 or `NULL`, not to remove rows. See Section 29.12.20, “Performance Schema Summary Tables”.

Truncating an `InnoDB` table that resides in a file-per-table tablespace drops the existing tablespace and creates a new one. If the tablespace was created with an earlier version and resides in an unknown directory, `InnoDB` creates the new tablespace in the default location and writes the following warning to the error log: The DATA DIRECTORY location must be in a known directory. The DATA DIRECTORY location will be ignored and the file will be put into the default datadir location. Known directories are those defined by the `datadir`, `innodb_data_home_dir`, and `innodb_directories` variables. To have `TRUNCATE TABLE` create the tablespace in its current location, add the directory to the `innodb_directories` setting before running `TRUNCATE TABLE`.
