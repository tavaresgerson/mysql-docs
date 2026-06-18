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

[`ALTER DATABASE`](alter-database.html "15.1.2 ALTER DATABASE Statement") enables you to
change the overall characteristics of a database. These
characteristics are stored in the data dictionary. This statement
requires the [`ALTER`](privileges-provided.html#priv_alter) privilege on the
database. [`ALTER
SCHEMA`](alter-database.html "15.1.2 ALTER DATABASE Statement") is a synonym for [`ALTER
DATABASE`](alter-database.html "15.1.2 ALTER DATABASE Statement").

If the database name is omitted, the statement applies to the
default database. In that case, an error occurs if there is no
default database.

For any *`alter_option`* omitted from the
statement, the database retains its current option value, with the
exception that changing the character set may change the collation
and vice versa.

* [Character Set and Collation Options](alter-database.html#alter-database-charset "Character Set and Collation Options")
* [Encryption Option](alter-database.html#alter-database-encryption "Encryption Option")
* [Read Only Option](alter-database.html#alter-database-read-only "Read Only Option")

#### Character Set and Collation Options

The `CHARACTER SET` option changes the default
database character set. The `COLLATE` option
changes the default database collation. For information about
character set and collation names, see [Chapter 12, *Character Sets, Collations, Unicode*](charset.html "Chapter 12 Character Sets, Collations, Unicode").

To see the available character sets and collations, use the
[`SHOW CHARACTER SET`](show-character-set.html "15.7.7.3 SHOW CHARACTER SET Statement") and
[`SHOW COLLATION`](show-collation.html "15.7.7.4 SHOW COLLATION Statement") statements,
respectively. See [Section 15.7.7.3, “SHOW CHARACTER SET Statement”](show-character-set.html "15.7.7.3 SHOW CHARACTER SET Statement"), and
[Section 15.7.7.4, “SHOW COLLATION Statement”](show-collation.html "15.7.7.4 SHOW COLLATION Statement").

A stored routine that uses the database defaults when the routine
is created includes those defaults as part of its definition. (In
a stored routine, variables with character data types use the
database defaults if the character set or collation are not
specified explicitly. See [Section 15.1.17, “CREATE PROCEDURE and CREATE FUNCTION Statements”](create-procedure.html "15.1.17 CREATE PROCEDURE and CREATE FUNCTION Statements").) If
you change the default character set or collation for a database,
any stored routines that are to use the new defaults must be
dropped and recreated.

#### Encryption Option

The `ENCRYPTION` option, introduced in MySQL
8.0.16, defines the default database encryption, which is
inherited by tables created in the database. The permitted values
are `'Y'` (encryption enabled) and
`'N'` (encryption disabled).

The `mysql` system schema cannot be set to
default encryption. The existing tables within it are part of the
general `mysql` tablespace, which may be
encrypted. The `information_schema` contains only
views. It is not possible to create any tables within it. There is
nothing on the disk to encrypt. All tables in the
`performance_schema` use the
[`PERFORMANCE_SCHEMA`](performance-schema.html "Chapter 29 MySQL Performance Schema") engine, which is
purely in-memory. It is not possible to create any other tables in
it. There is nothing on the disk to encrypt.

Only newly created tables inherit the default database encryption.
For existing tables associated with the database, their encryption
remains unchanged. If the
[`table_encryption_privilege_check`](server-system-variables.html#sysvar_table_encryption_privilege_check)
system variable is enabled, the
[`TABLE_ENCRYPTION_ADMIN`](privileges-provided.html#priv_table-encryption-admin) privilege is
required to specify a default encryption setting that differs from
the value of the
[`default_table_encryption`](server-system-variables.html#sysvar_default_table_encryption) system
variable. For more information, see
[Defining an Encryption Default for Schemas and General Tablespaces](innodb-data-encryption.html#innodb-schema-tablespace-encryption-default "Defining an Encryption Default for Schemas and General Tablespaces").

#### Read Only Option

The `READ ONLY` option, introduced in MySQL
8.0.22, controls whether to permit modification of the database
and objects within it. The permitted values are
`DEFAULT` or `0` (not read only)
and `1` (read only). This option is useful for
database migration because a database for which `READ
ONLY` is enabled can be migrated to another MySQL
instance without concern that the database might be changed during
the operation.

With NDB Cluster, making a database read only on one
[**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") server is synchronized to other
[**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") servers in the same cluster, so that the
database becomes read only on all [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server")
servers.

The `READ ONLY` option, if enabled, is displayed
in the `INFORMATION_SCHEMA`
[`SCHEMATA_EXTENSIONS`](information-schema-schemata-extensions-table.html "28.3.32 The INFORMATION_SCHEMA SCHEMATA_EXTENSIONS Table") table. See
[Section 28.3.32, “The INFORMATION\_SCHEMA SCHEMATA\_EXTENSIONS Table”](information-schema-schemata-extensions-table.html "28.3.32 The INFORMATION_SCHEMA SCHEMATA_EXTENSIONS Table").

The `READ ONLY` option cannot be enabled for
these system schemas: `mysql`,
`information_schema`,
`performance_schema`.

In [`ALTER DATABASE`](alter-database.html "15.1.2 ALTER DATABASE Statement") statements, the
`READ ONLY` option interacts with other instances
of itself and with other options as follows:

* An error occurs if multiple instances of `READ
  ONLY` conflict (for example, `READ ONLY = 1
  READ ONLY = 0`).

* An [`ALTER DATABASE`](alter-database.html "15.1.2 ALTER DATABASE Statement") statement
  that contains only (nonconflicting) `READ
  ONLY` options is permitted even for a read-only
  database.

* A mix of (nonconflicting) `READ ONLY` options
  with other options is permitted if the read-only state of the
  database either before or after the statement permits
  modifications. If the read-only state both before and after
  prohibits changes, an error occurs.

  This statement succeeds whether or not the database is read
  only:

  ```
  ALTER DATABASE mydb READ ONLY = 0 DEFAULT COLLATE utf8mb4_bin;
  ```

  This statement succeeds if the database is not read only, but
  fails if it is already read only:

  ```
  ALTER DATABASE mydb READ ONLY = 1 DEFAULT COLLATE utf8mb4_bin;
  ```

Enabling `READ ONLY` affects all users of the
database, with these exceptions that are not subject to read-only
checks:

* Statements executed by the server as part of server
  initialization, restart, upgrade, or replication.

* Statements in a file named at server startup by the
  [`init_file`](server-system-variables.html#sysvar_init_file) system variable.

* `TEMPORARY` tables; it is possible to create,
  alter, drop, and write to `TEMPORARY` tables
  in a read-only database.

* NDB Cluster non-SQL inserts and updates.

Other than for the excepted operations just listed, enabling
`READ ONLY` prohibits write operations to the
database and its objects, including their definitions, data, and
metadata. The following list details affected SQL statements and
operations:

* The database itself:

  + [`CREATE DATABASE`](create-database.html "15.1.12 CREATE DATABASE Statement")
  + [`ALTER DATABASE`](alter-database.html "15.1.2 ALTER DATABASE Statement") (except to
    change the `READ ONLY` option)

  + [`DROP DATABASE`](drop-database.html "15.1.24 DROP DATABASE Statement")
* Views:

  + [`CREATE VIEW`](create-view.html "15.1.23 CREATE VIEW Statement")
  + [`ALTER VIEW`](alter-view.html "15.1.11 ALTER VIEW Statement")
  + [`DROP VIEW`](drop-view.html "15.1.35 DROP VIEW Statement")
  + Selecting from views that invoke functions with side
    effects.

  + Updating updatable views.
  + Statements that create or drop objects in a writable
    database are rejected if they affect metadata of a view in
    a read-only database (for example, by making the view
    valid or invalid).

* Stored routines:

  + [`CREATE PROCEDURE`](create-procedure.html "15.1.17 CREATE PROCEDURE and CREATE FUNCTION Statements")
  + [`DROP PROCEDURE`](drop-procedure.html "15.1.29 DROP PROCEDURE and DROP FUNCTION Statements")
  + [`CALL`](call.html "15.2.1 CALL Statement") (of procedures with
    side effects)

  + [`CREATE FUNCTION`](create-function.html "15.1.14 CREATE FUNCTION Statement")
  + [`DROP FUNCTION`](drop-function.html "15.1.26 DROP FUNCTION Statement")
  + [`SELECT`](select.html "15.2.13 SELECT Statement") (of functions with
    side effects)

  + For procedures and functions, read-only checks follow
    prelocking behavior. For
    [`CALL`](call.html "15.2.1 CALL Statement") statements, read-only
    checks are done on a per-statement basis, so if some
    conditionally executed statement writing to a read-only
    database does not actually execute, the call still
    succeeds. On the other hand, for a function called within
    a [`SELECT`](select.html "15.2.13 SELECT Statement"), execution of the
    function body happens in prelocked mode. As long as a some
    statement within the function writes to a read-only
    database, execution of the function fails with an error
    regardless of whether the statement actually executes.

* Triggers:

  + [`CREATE TRIGGER`](create-trigger.html "15.1.22 CREATE TRIGGER Statement")
  + [`DROP TRIGGER`](drop-trigger.html "15.1.34 DROP TRIGGER Statement")
  + Trigger invocation.
* Events:

  + [`CREATE EVENT`](create-event.html "15.1.13 CREATE EVENT Statement")
  + [`ALTER EVENT`](alter-event.html "15.1.3 ALTER EVENT Statement")
  + [`DROP EVENT`](drop-event.html "15.1.25 DROP EVENT Statement")
  + Event execution:

    - Executing an event in the database fails because that
      would change the last-execution timestamp, which is
      event metadata stored in the data dictionary. Failure
      of event execution also has the effect of causing the
      event scheduler to stop.

    - If an event writes to an object in a read-only
      database, execution of the event fails with an error,
      but the event scheduler is not stopped.

* Tables:

  + [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement")
  + [`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement")
  + [`CREATE INDEX`](create-index.html "15.1.15 CREATE INDEX Statement")
  + [`DROP INDEX`](drop-index.html "15.1.27 DROP INDEX Statement")
  + [`RENAME TABLE`](rename-table.html "15.1.36 RENAME TABLE Statement")
  + [`TRUNCATE TABLE`](truncate-table.html "15.1.37 TRUNCATE TABLE Statement")
  + [`DROP TABLE`](drop-table.html "15.1.32 DROP TABLE Statement")
  + [`DELETE`](delete.html "15.2.2 DELETE Statement")
  + [`INSERT`](insert.html "15.2.7 INSERT Statement")
  + [`IMPORT TABLE`](import-table.html "15.2.6 IMPORT TABLE Statement")
  + [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement")
  + [`LOAD XML`](load-xml.html "15.2.10 LOAD XML Statement")
  + [`REPLACE`](replace.html "15.2.12 REPLACE Statement")
  + [`UPDATE`](update.html "15.2.17 UPDATE Statement")
  + For cascading foreign keys where the child table is in a
    read-only database, updates and deletes on the parent are
    rejected even if the child table is not directly affected.

  + For a `MERGE` table such as
    `CREATE TABLE s1.t(i int) ENGINE MERGE UNION
    (s2.t, s3.t), INSERT_METHOD=...`, the following
    behavior applies:

    - Inserting into the `MERGE` table
      (`INSERT into s1.t`) fails if at
      least one of `s1`,
      `s2`, `s3` is read
      only, regardless of insert method. The insert is
      refused even if it would actually end up in a writable
      table.

    - Dropping the `MERGE` table
      (`DROP TABLE s1.t`) succeeds as long
      as `s1` is not read only. It is
      permitted to drop a `MERGE` table
      that refers to a read-only database.

An [`ALTER DATABASE`](alter-database.html "15.1.2 ALTER DATABASE Statement") statement blocks
until all concurrent transactions that have already accessed an
object in the database being altered have committed. Conversely, a
write transaction accessing an object in a database being altered
in a concurrent [`ALTER DATABASE`](alter-database.html "15.1.2 ALTER DATABASE Statement")
blocks until the [`ALTER DATABASE`](alter-database.html "15.1.2 ALTER DATABASE Statement") has
committed.

If the Clone plugin is used to clone a local or remote data
directory, the databases in the clone retain the read-only state
they had in the source data directory. The read-only state does
not affect the cloning process itself. If it is not desirable to
have the same database read-only state in the clone, the option
must be changed explicitly for the clone after the cloning process
has finished, using [`ALTER DATABASE`](alter-database.html "15.1.2 ALTER DATABASE Statement")
operations on the clone.

When cloning from a donor to a recipient, if the recipient has a
user database that is read only, cloning fails with an error
message. Cloning may be retried after making the database
writable.

`READ ONLY` is permitted for
[`ALTER DATABASE`](alter-database.html "15.1.2 ALTER DATABASE Statement"), but not for
[`CREATE DATABASE`](create-database.html "15.1.12 CREATE DATABASE Statement"). However, for a
read-only database, the statement produced by
[`SHOW CREATE DATABASE`](show-create-database.html "15.7.7.6 SHOW CREATE DATABASE Statement") does include
`READ ONLY=1` within a comment to indicate its
read-only status:

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

If the server executes a [`CREATE
DATABASE`](create-database.html "15.1.12 CREATE DATABASE Statement") statement containing such a comment, the server
ignores the comment and the `READ ONLY` option is
not processed. This has implications for
[**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program") and [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program"),
which use [`SHOW CREATE DATABASE`](show-create-database.html "15.7.7.6 SHOW CREATE DATABASE Statement") to
produce [`CREATE DATABASE`](create-database.html "15.1.12 CREATE DATABASE Statement") statements
in dump output:

* In a dump file, the [`CREATE
  DATABASE`](create-database.html "15.1.12 CREATE DATABASE Statement") statement for a read-only database contains
  the commented `READ ONLY` option.

* The dump file can be restored as usual, but because the server
  ignores the commented `READ ONLY` option, the
  restored database is *not* read only. If
  the database is to be read only after being restored, you must
  execute [`ALTER DATABASE`](alter-database.html "15.1.2 ALTER DATABASE Statement") manually
  to make it so.

Suppose that `mydb` is read only and you dump it
as follows:

```
$> mysqldump --databases mydb > mydb.sql
```

A restore operation later must be followed by
[`ALTER DATABASE`](alter-database.html "15.1.2 ALTER DATABASE Statement") if
`mydb` should still be read only:

```
$> mysql
mysql> SOURCE mydb.sql;
mysql> ALTER DATABASE mydb READ ONLY = 1;
```

MySQL Enterprise Backup is not subject to this issue. It backs up and restores a
read-only database like any other, but enables the `READ
ONLY` option at restore time if it was enabled at backup
time.

[`ALTER DATABASE`](alter-database.html "15.1.2 ALTER DATABASE Statement") is written to the
binary log, so a change to the `READ ONLY` option
on a replication source server also affects replicas. To prevent
this from happening, binary logging must be disabled prior to
execution of the [`ALTER DATABASE`](alter-database.html "15.1.2 ALTER DATABASE Statement")
statement. For example, to prepare for migrating a database
without affecting replicas, perform these operations:

1. Within a single session, disable binary logging and enable
   `READ ONLY` for the database:

   ```
   mysql> SET sql_log_bin = OFF;
   mysql> ALTER DATABASE mydb READ ONLY = 1;
   ```

2. Dump the database, for example, with
   [**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program") or [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program"):

   ```
   $> mysqldump --databases mydb > mydb.sql
   ```

3. Within a single session, disable binary logging and disable
   `READ ONLY` for the database:

   ```
   mysql> SET sql_log_bin = OFF;
   mysql> ALTER DATABASE mydb READ ONLY = 0;
   ```