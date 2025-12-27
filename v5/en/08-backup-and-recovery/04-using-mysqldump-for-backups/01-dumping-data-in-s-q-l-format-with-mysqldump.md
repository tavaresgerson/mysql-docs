### 7.4.1 Dumping Data in SQL Format with mysqldump

This section describes how to use **mysqldump** to create SQL-format dump files. For information about reloading such dump files, see Section 7.4.2, “Reloading SQL-Format Backups”.

By default, **mysqldump** writes information as SQL statements to the standard output. You can save the output in a file:

```sql
$> mysqldump [arguments] > file_name
```

To dump all databases, invoke **mysqldump** with the `--all-databases` option:

```sql
$> mysqldump --all-databases > dump.sql
```

To dump only specific databases, name them on the command line and use the `--databases` option:

```sql
$> mysqldump --databases db1 db2 db3 > dump.sql
```

The `--databases` option causes all names on the command line to be treated as database names. Without this option, **mysqldump** treats the first name as a database name and those following as table names.

With `--all-databases` or `--databases`, **mysqldump** writes `CREATE DATABASE` and `USE` statements prior to the dump output for each database. This ensures that when the dump file is reloaded, it creates each database if it does not exist and makes it the default database so database contents are loaded into the same database from which they came. If you want to cause the dump file to force a drop of each database before recreating it, use the `--add-drop-database` option as well. In this case, **mysqldump** writes a `DROP DATABASE` statement preceding each `CREATE DATABASE` statement.

To dump a single database, name it on the command line:

```sql
$> mysqldump --databases test > dump.sql
```

In the single-database case, it is permissible to omit the `--databases` option:

```sql
$> mysqldump test > dump.sql
```

The difference between the two preceding commands is that without `--databases`, the dump output contains no `CREATE DATABASE` or `USE` statements. This has several implications:

* When you reload the dump file, you must specify a default database name so that the server knows which database to reload.

* For reloading, you can specify a database name different from the original name, which enables you to reload the data into a different database.

* If the database to be reloaded does not exist, you must create it first.

* Because the output contains no `CREATE DATABASE` statement, the `--add-drop-database` option has no effect. If you use it, it produces no `DROP DATABASE` statement.

To dump only specific tables from a database, name them on the command line following the database name:

```sql
$> mysqldump test t1 t3 t7 > dump.sql
```
