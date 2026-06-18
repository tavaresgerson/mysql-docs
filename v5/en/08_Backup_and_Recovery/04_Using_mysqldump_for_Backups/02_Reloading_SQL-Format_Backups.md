### 7.4.2 Reloading SQL-Format Backups

To reload a dump file written by [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program")
that consists of SQL statements, use it as input to the
[**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client. If the dump file was created by
[**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") with the
[`--all-databases`](mysqldump.html#option_mysqldump_all-databases) or
[`--databases`](mysqldump.html#option_mysqldump_databases) option, it
contains [`CREATE DATABASE`](create-database.html "13.1.11 CREATE DATABASE Statement") and
[`USE`](use.html "13.8.4 USE Statement") statements and it is not
necessary to specify a default database into which to load the
data:

```sql
$> mysql < dump.sql
```

Alternatively, from within [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), use a
`source` command:

```sql
mysql> source dump.sql
```

If the file is a single-database dump not containing
[`CREATE DATABASE`](create-database.html "13.1.11 CREATE DATABASE Statement") and
[`USE`](use.html "13.8.4 USE Statement") statements, create the
database first (if necessary):

```sql
$> mysqladmin create db1
```

Then specify the database name when you load the dump file:

```sql
$> mysql db1 < dump.sql
```

Alternatively, from within [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), create the
database, select it as the default database, and load the dump
file:

```sql
mysql> CREATE DATABASE IF NOT EXISTS db1;
mysql> USE db1;
mysql> source dump.sql
```

Note

For Windows PowerShell users: Because the "<" character is
reserved for future use in PowerShell, an alternative approach
is required, such as using quotes `cmd.exe /c "mysql
< dump.sql"`.