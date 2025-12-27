### 7.4.2 Reloading SQL-Format Backups

To reload a dump file written by **mysqldump** that consists of SQL statements, use it as input to the **mysql** client. If the dump file was created by **mysqldump** with the `--all-databases` or `--databases` option, it contains `CREATE DATABASE` and `USE` statements and it is not necessary to specify a default database into which to load the data:

```sql
$> mysql < dump.sql
```

Alternatively, from within **mysql**, use a `source` command:

```sql
mysql> source dump.sql
```

If the file is a single-database dump not containing `CREATE DATABASE` and `USE` statements, create the database first (if necessary):

```sql
$> mysqladmin create db1
```

Then specify the database name when you load the dump file:

```sql
$> mysql db1 < dump.sql
```

Alternatively, from within **mysql**, create the database, select it as the default database, and load the dump file:

```sql
mysql> CREATE DATABASE IF NOT EXISTS db1;
mysql> USE db1;
mysql> source dump.sql
```

Note

For Windows PowerShell users: Because the "<" character is reserved for future use in PowerShell, an alternative approach is required, such as using quotes `cmd.exe /c "mysql < dump.sql"`.
