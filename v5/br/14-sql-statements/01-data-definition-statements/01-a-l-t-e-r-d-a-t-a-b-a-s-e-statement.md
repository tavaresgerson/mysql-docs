### 13.1.1 ALTER DATABASE Statement

```sql
ALTER {DATABASE | SCHEMA} [db_name]
    alter_option ...
ALTER {DATABASE | SCHEMA} db_name
    UPGRADE DATA DIRECTORY NAME

alter_option: {
    [DEFAULT] CHARACTER SET [=] charset_name
  | [DEFAULT] COLLATE [=] collation_name
}
```

[`ALTER DATABASE`](alter-database.html "13.1.1 ALTER DATABASE Statement") enables you to change the overall characteristics of a database. These characteristics are stored in the `db.opt` file in the database directory. This statement requires the [`ALTER`](privileges-provided.html#priv_alter) privilege on the database. [`ALTER SCHEMA`](alter-database.html "13.1.1 ALTER DATABASE Statement") is a synonym for [`ALTER DATABASE`](alter-database.html "13.1.1 ALTER DATABASE Statement").

The database name can be omitted from the first syntax, in which case the statement applies to the default database. An error occurs if there is no default database.

* [Character Set and Collation Options](alter-database.html#alter-database-charset "Character Set and Collation Options")
* [Upgrading from Versions Older than MySQL 5.1](alter-database.html#alter-database-upgrading "Upgrading from Versions Older than MySQL 5.1")

#### Character Set and Collation Options

The `CHARACTER SET` clause changes the default database character set. The `COLLATE` clause changes the default database collation. For information about character set and collation names, see [Chapter 10, *Character Sets, Collations, Unicode*](charset.html "Chapter 10 Character Sets, Collations, Unicode").

To see the available character sets and collations, use the [`SHOW CHARACTER SET`](show-character-set.html "13.7.5.3 SHOW CHARACTER SET Statement") and [`SHOW COLLATION`](show-collation.html "13.7.5.4 SHOW COLLATION Statement") statements, respectively. See [Section 13.7.5.3, “SHOW CHARACTER SET Statement”](show-character-set.html "13.7.5.3 SHOW CHARACTER SET Statement"), and [Section 13.7.5.4, “SHOW COLLATION Statement”](show-collation.html "13.7.5.4 SHOW COLLATION Statement").

A stored routine that uses the database defaults when the routine is created includes those defaults as part of its definition. (In a stored routine, variables with character data types use the database defaults if the character set or collation are not specified explicitly. See [Section 13.1.16, “CREATE PROCEDURE and CREATE FUNCTION Statements”](create-procedure.html "13.1.16 CREATE PROCEDURE and CREATE FUNCTION Statements").) If you change the default character set or collation for a database, any stored routines that are to use the new defaults must be dropped and recreated.

#### Upgrading from Versions Older than MySQL 5.1

The syntax that includes the `UPGRADE DATA DIRECTORY NAME` clause updates the name of the directory associated with the database to use the encoding implemented in MySQL 5.1 for mapping database names to database directory names (see [Section 9.2.4, “Mapping of Identifiers to File Names”](identifier-mapping.html "9.2.4 Mapping of Identifiers to File Names")). This clause is for use under these conditions:

* It is intended when upgrading MySQL to 5.1 or later from older versions.

* It is intended to update a database directory name to the current encoding format if the name contains special characters that need encoding.

* The statement is used by [**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program") (as invoked by [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables")).

For example, if a database in MySQL 5.0 has the name `a-b-c`, the name contains instances of the `-` (dash) character. In MySQL 5.0, the database directory is also named `a-b-c`, which is not necessarily safe for all file systems. In MySQL 5.1 and later, the same database name is encoded as `a@002db@002dc` to produce a file system-neutral directory name.

When a MySQL installation is upgraded to MySQL 5.1 or later from an older version,the server displays a name such as `a-b-c` (which is in the old format) as `#mysql50#a-b-c`, and you must refer to the name using the `#mysql50#` prefix. Use `UPGRADE DATA DIRECTORY NAME` in this case to explicitly tell the server to re-encode the database directory name to the current encoding format:

```sql
ALTER DATABASE `#mysql50#a-b-c` UPGRADE DATA DIRECTORY NAME;
```

After executing this statement, you can refer to the database as `a-b-c` without the special `#mysql50#` prefix.

Note

The `UPGRADE DATA DIRECTORY NAME` clause is deprecated in MySQL 5.7 and removed in MySQL 8.0. If it is necessary to convert MySQL 5.0 database or table names, a workaround is to upgrade a MySQL 5.0 installation to MySQL 5.1 before upgrading to MySQL 8.0.
