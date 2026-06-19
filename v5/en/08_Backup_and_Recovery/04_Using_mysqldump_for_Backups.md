## 7.4 Using mysqldump for Backups

This section describes how to use **mysqldump** to produce dump files, and how to reload dump files. A dump file can be used in several ways:

* As a backup to enable data recovery in case of data loss.
* As a source of data for setting up replicas.
* As a source of data for experimentation:

  + To make a copy of a database that you can use without changing the original data.

  + To test potential upgrade incompatibilities.

**mysqldump** produces two types of output, depending on whether the `--tab` option is given:

* Without `--tab`, **mysqldump** writes SQL statements to the standard output. This output consists of `CREATE` statements to create dumped objects (databases, tables, stored routines, and so forth), and `INSERT` statements to load data into tables. The output can be saved in a file and reloaded later using **mysql** to recreate the dumped objects. Options are available to modify the format of the SQL statements, and to control which objects are dumped.

* With `--tab`, **mysqldump** produces two output files for each dumped table. The server writes one file as tab-delimited text, one line per table row. This file is named `tbl_name.txt` in the output directory. The server also sends a `CREATE TABLE` statement for the table to **mysqldump**, which writes it as a file named `tbl_name.sql` in the output directory.


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


### 7.4.3 Dumping Data in Delimited-Text Format with mysqldump

This section describes how to use **mysqldump** to create delimited-text dump files. For information about reloading such dump files, see Section 7.4.4, “Reloading Delimited-Text Format Backups”.

If you invoke **mysqldump** with the `--tab=dir_name` option, it uses *`dir_name`* as the output directory and dumps tables individually in that directory using two files for each table. The table name is the base name for these files. For a table named `t1`, the files are named `t1.sql` and `t1.txt`. The `.sql` file contains a `CREATE TABLE` statement for the table. The `.txt` file contains the table data, one line per table row.

The following command dumps the contents of the `db1` database to files in the `/tmp` database:

```sql
$> mysqldump --tab=/tmp db1
```

The `.txt` files containing table data are written by the server, so they are owned by the system account used for running the server. The server uses `SELECT ... INTO OUTFILE` to write the files, so you must have the `FILE` privilege to perform this operation, and an error occurs if a given `.txt` file already exists.

The server sends the `CREATE` definitions for dumped tables to **mysqldump**, which writes them to `.sql` files. These files therefore are owned by the user who executes **mysqldump**.

It is best that `--tab` be used only for dumping a local server. If you use it with a remote server, the `--tab` directory must exist on both the local and remote hosts, and the `.txt` files are written by the server in the remote directory (on the server host), whereas the `.sql` files are written by **mysqldump** in the local directory (on the client host).

For **mysqldump --tab**, the server by default writes table data to `.txt` files one line per row with tabs between column values, no quotation marks around column values, and newline as the line terminator. (These are the same defaults as for `SELECT ... INTO OUTFILE`.)

To enable data files to be written using a different format, **mysqldump** supports these options:

* `--fields-terminated-by=str`

  The string for separating column values (default: tab).

* `--fields-enclosed-by=char`

  The character within which to enclose column values (default: no character).

* `--fields-optionally-enclosed-by=char`

  The character within which to enclose non-numeric column values (default: no character).

* `--fields-escaped-by=char`

  The character for escaping special characters (default: no escaping).

* `--lines-terminated-by=str`

  The line-termination string (default: newline).

Depending on the value you specify for any of these options, it might be necessary on the command line to quote or escape the value appropriately for your command interpreter. Alternatively, specify the value using hex notation. Suppose that you want **mysqldump** to quote column values within double quotation marks. To do so, specify double quote as the value for the `--fields-enclosed-by` option. But this character is often special to command interpreters and must be treated specially. For example, on Unix, you can quote the double quote like this:

```sql
--fields-enclosed-by='"'
```

On any platform, you can specify the value in hex:

```sql
--fields-enclosed-by=0x22
```

It is common to use several of the data-formatting options together. For example, to dump tables in comma-separated values format with lines terminated by carriage-return/newline pairs (`\r\n`), use this command (enter it on a single line):

```sql
$> mysqldump --tab=/tmp --fields-terminated-by=,
         --fields-enclosed-by='"' --lines-terminated-by=0x0d0a db1
```

Should you use any of the data-formatting options to dump table data, you must specify the same format when you reload data files later, to ensure proper interpretation of the file contents.


### 7.4.4 Reloading Delimited-Text Format Backups

For backups produced with **mysqldump --tab**, each table is represented in the output directory by an `.sql` file containing the `CREATE TABLE` statement for the table, and a `.txt` file containing the table data. To reload a table, first change location into the output directory. Then process the `.sql` file with **mysql** to create an empty table and process the `.txt` file to load the data into the table:

```sql
$> mysql db1 < t1.sql
$> mysqlimport db1 t1.txt
```

An alternative to using **mysqlimport** to load the data file is to use the `LOAD DATA` statement from within the **mysql** client:

```sql
mysql> USE db1;
mysql> LOAD DATA INFILE 't1.txt' INTO TABLE t1;
```

If you used any data-formatting options with **mysqldump** when you initially dumped the table, you must use the same options with **mysqlimport** or `LOAD DATA` to ensure proper interpretation of the data file contents:

```sql
$> mysqlimport --fields-terminated-by=,
         --fields-enclosed-by='"' --lines-terminated-by=0x0d0a db1 t1.txt
```

Or:

```sql
mysql> USE db1;
mysql> LOAD DATA INFILE 't1.txt' INTO TABLE t1
       FIELDS TERMINATED BY ',' FIELDS ENCLOSED BY '"'
       LINES TERMINATED BY '\r\n';
```


### 7.4.5 mysqldump Tips

This section surveys techniques that enable you to use **mysqldump** to solve specific problems:

* How to make a copy a database
* How to copy a database from one server to another
* How to dump stored programs (stored procedures and functions, triggers, and events)

* How to dump definitions and data separately


#### 7.4.5.1 Making a Copy of a Database

```sql
$> mysqldump db1 > dump.sql
$> mysqladmin create db2
$> mysql db2 < dump.sql
```

Do not use `--databases` on the **mysqldump** command line because that causes `USE db1` to be included in the dump file, which overrides the effect of naming `db2` on the **mysql** command line.


#### 7.4.5.2 Copy a Database from one Server to Another

On Server 1:

```sql
$> mysqldump --databases db1 > dump.sql
```

Copy the dump file from Server 1 to Server 2.

On Server 2:

```sql
$> mysql < dump.sql
```

Use of `--databases` with the **mysqldump** command line causes the dump file to include `CREATE DATABASE` and `USE` statements that create the database if it does exist and make it the default database for the reloaded data.

Alternatively, you can omit `--databases` from the **mysqldump** command. Then you need to create the database on Server 2 (if necessary) and to specify it as the default database when you reload the dump file.

On Server 1:

```sql
$> mysqldump db1 > dump.sql
```

On Server 2:

```sql
$> mysqladmin create db1
$> mysql db1 < dump.sql
```

You can specify a different database name in this case, so omitting `--databases` from the **mysqldump** command enables you to dump data from one database and load it into another.


#### 7.4.5.3 Dumping Stored Programs

Several options control how **mysqldump** handles stored programs (stored procedures and functions, triggers, and events):

* `--events`: Dump Event Scheduler events

* `--routines`: Dump stored procedures and functions

* `--triggers`: Dump triggers for tables

The `--triggers` option is enabled by default so that when tables are dumped, they are accompanied by any triggers they have. The other options are disabled by default and must be specified explicitly to dump the corresponding objects. To disable any of these options explicitly, use its skip form: `--skip-events`, `--skip-routines`, or `--skip-triggers`.


#### 7.4.5.4 Dumping Table Definitions and Content Separately

The `--no-data` option tells **mysqldump** not to dump table data, resulting in the dump file containing only statements to create the tables. Conversely, the `--no-create-info` option tells **mysqldump** to suppress `CREATE` statements from the output, so that the dump file contains only table data.

For example, to dump table definitions and data separately for the `test` database, use these commands:

```sql
$> mysqldump --no-data test > dump-defs.sql
$> mysqldump --no-create-info test > dump-data.sql
```

For a definition-only dump, add the `--routines` and `--events` options to also include stored routine and event definitions:

```sql
$> mysqldump --no-data --routines --events test > dump-defs.sql
```


#### 7.4.5.5 Using mysqldump to Test for Upgrade Incompatibilities

When contemplating a MySQL upgrade, it is prudent to install the newer version separately from your current production version. Then you can dump the database and database object definitions from the production server and load them into the new server to verify that they are handled properly. (This is also useful for testing downgrades.)

On the production server:

```sql
$> mysqldump --all-databases --no-data --routines --events > dump-defs.sql
```

On the upgraded server:

```sql
$> mysql < dump-defs.sql
```

Because the dump file does not contain table data, it can be processed quickly. This enables you to spot potential incompatibilities without waiting for lengthy data-loading operations. Look for warnings or errors while the dump file is being processed.

After you have verified that the definitions are handled properly, dump the data and try to load it into the upgraded server.

On the production server:

```sql
$> mysqldump --all-databases --no-create-info > dump-data.sql
```

On the upgraded server:

```sql
$> mysql < dump-data.sql
```

Now check the table contents and run some test queries.
