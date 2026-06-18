#### 9.4.5.2 Copy a Database from one Server to Another

On Server 1:

```
$> mysqldump --databases db1 > dump.sql
```

Copy the dump file from Server 1 to Server 2.

On Server 2:

```
$> mysql < dump.sql
```

Use of [`--databases`](mysqldump.html#option_mysqldump_databases) with the
[**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program") command line causes the dump file
to include [`CREATE DATABASE`](create-database.html "15.1.14 CREATE DATABASE Statement") and
[`USE`](use.html "15.8.4 USE Statement") statements that create the
database if it does exist and make it the default database for
the reloaded data.

Alternatively, you can omit
[`--databases`](mysqldump.html#option_mysqldump_databases) from the
[**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program") command. Then you need to create
the database on Server 2 (if necessary) and specify it as the
default database when you reload the dump file.

On Server 1:

```
$> mysqldump db1 > dump.sql
```

On Server 2:

```
$> mysqladmin create db1
$> mysql db1 < dump.sql
```

You can specify a different database name in this case, so
omitting [`--databases`](mysqldump.html#option_mysqldump_databases) from
the [**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program") command enables you to dump
data from one database and load it into another.