### 13.1.11 CREATE DATABASE Statement

```sql
CREATE {DATABASE | SCHEMA} [IF NOT EXISTS] db_name
    [create_option] ...

create_option: [DEFAULT] {
    CHARACTER SET [=] charset_name
  | COLLATE [=] collation_name
}
```

[`CREATE DATABASE`](create-database.html "13.1.11 CREATE DATABASE Statement") creates a database with the given name. To use this statement, you need the [`CREATE`](privileges-provided.html#priv_create) privilege for the database. [`CREATE SCHEMA`](create-database.html "13.1.11 CREATE DATABASE Statement") is a synonym for [`CREATE DATABASE`](create-database.html "13.1.11 CREATE DATABASE Statement").

An error occurs if the database exists and you did not specify `IF NOT EXISTS`.

[`CREATE DATABASE`](create-database.html "13.1.11 CREATE DATABASE Statement") is not permitted within a session that has an active [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") statement.

Each *`create_option`* specifies a database characteristic. Database characteristics are stored in the `db.opt` file in the database directory. The `CHARACTER SET` option specifies the default database character set. The `COLLATE` option specifies the default database collation. For information about character set and collation names, see [Chapter 10, *Character Sets, Collations, Unicode*](charset.html "Chapter 10 Character Sets, Collations, Unicode").

To see the available character sets and collations, use the [`SHOW CHARACTER SET`](show-character-set.html "13.7.5.3 SHOW CHARACTER SET Statement") and [`SHOW COLLATION`](show-collation.html "13.7.5.4 SHOW COLLATION Statement") statements, respectively. See [Section 13.7.5.3, “SHOW CHARACTER SET Statement”](show-character-set.html "13.7.5.3 SHOW CHARACTER SET Statement"), and [Section 13.7.5.4, “SHOW COLLATION Statement”](show-collation.html "13.7.5.4 SHOW COLLATION Statement").

A database in MySQL is implemented as a directory containing files that correspond to tables in the database. Because there are no tables in a database when it is initially created, the [`CREATE DATABASE`](create-database.html "13.1.11 CREATE DATABASE Statement") statement creates only a directory under the MySQL data directory and the `db.opt` file. Rules for permissible database names are given in [Section 9.2, “Schema Object Names”](identifiers.html "9.2 Schema Object Names"). If a database name contains special characters, the name for the database directory contains encoded versions of those characters as described in [Section 9.2.4, “Mapping of Identifiers to File Names”](identifier-mapping.html "9.2.4 Mapping of Identifiers to File Names").

If you manually create a directory under the data directory (for example, with **mkdir**), the server considers it a database directory and it shows up in the output of [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement").

When you create a database, let the server manage the directory and the files in it. Manipulating database directories and files directly can cause inconsistencies and unexpected results.

MySQL has no limit on the number of databases. The underlying file system may have a limit on the number of directories.

You can also use the [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") program to create databases. See [Section 4.5.2, “mysqladmin — A MySQL Server Administration Program”](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program").
