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

[`CREATE DATABASE`](create-database.html "15.1.14 CREATE DATABASE Statement") creates a database
with the given name. To use this statement, you need the
[`CREATE`](privileges-provided.html#priv_create) privilege for the database.
[`CREATE
SCHEMA`](create-database.html "15.1.14 CREATE DATABASE Statement") is a synonym for [`CREATE
DATABASE`](create-database.html "15.1.14 CREATE DATABASE Statement").

An error occurs if the database exists and you did not specify
`IF NOT EXISTS`.

[`CREATE DATABASE`](create-database.html "15.1.14 CREATE DATABASE Statement") is not permitted
within a session that has an active [`LOCK
TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") statement.

Each *`create_option`* specifies a database
characteristic. Database characteristics are stored in the data
dictionary.

* The `CHARACTER SET` option specifies the
  default database character set. The `COLLATE`
  option specifies the default database collation. For
  information about character set and collation names, see
  [Chapter 12, *Character Sets, Collations, Unicode*](charset.html "Chapter 12 Character Sets, Collations, Unicode").

  To see the available character sets and collations, use the
  the [`SHOW CHARACTER SET`](show-character-set.html "15.7.7.4 SHOW CHARACTER SET Statement") and
  [`SHOW COLLATION`](show-collation.html "15.7.7.5 SHOW COLLATION Statement") statements,
  respectively. See [Section 15.7.7.4, “SHOW CHARACTER SET Statement”](show-character-set.html "15.7.7.4 SHOW CHARACTER SET Statement"), and
  [Section 15.7.7.5, “SHOW COLLATION Statement”](show-collation.html "15.7.7.5 SHOW COLLATION Statement").

* The `ENCRYPTION` option defines the default
  database encryption, which is inherited by tables created in
  the database. The permitted values are `'Y'`
  (encryption enabled) and `'N'` (encryption
  disabled). If the `ENCRYPTION` option is not
  specified, the value of the
  [`default_table_encryption`](server-system-variables.html#sysvar_default_table_encryption)
  system variable defines the default database encryption. If
  the
  [`table_encryption_privilege_check`](server-system-variables.html#sysvar_table_encryption_privilege_check)
  system variable is enabled, the
  [`TABLE_ENCRYPTION_ADMIN`](privileges-provided.html#priv_table-encryption-admin)
  privilege is required to specify a default encryption setting
  that differs from the
  [`default_table_encryption`](server-system-variables.html#sysvar_default_table_encryption)
  setting. For more information, see
  [Defining an Encryption Default for Schemas and General Tablespaces](innodb-data-encryption.html#innodb-schema-tablespace-encryption-default "Defining an Encryption Default for Schemas and General Tablespaces").

A database in MySQL is implemented as a directory containing files
that correspond to tables in the database. Because there are no
tables in a database when it is initially created, the
[`CREATE DATABASE`](create-database.html "15.1.14 CREATE DATABASE Statement") statement creates
only a directory under the MySQL data directory. Rules for
permissible database names are given in
[Section 11.2, “Schema Object Names”](identifiers.html "11.2 Schema Object Names"). If a database name contains special
characters, the name for the database directory contains encoded
versions of those characters as described in
[Section 11.2.4, “Mapping of Identifiers to File Names”](identifier-mapping.html "11.2.4 Mapping of Identifiers to File Names").

Creating a database directory by manually creating a directory
under the data directory (for example, with
**mkdir**) is unsupported in MySQL
9.5.

When you create a database, let the server manage the directory
and the files in it. Manipulating database directories and files
directly can cause inconsistencies and unexpected results.

MySQL has no limit on the number of databases. The underlying file
system may have a limit on the number of directories.

You can also use the [**mysqladmin**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") program to
create databases. See [Section 6.5.2, “mysqladmin — A MySQL Server Administration Program”](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program").