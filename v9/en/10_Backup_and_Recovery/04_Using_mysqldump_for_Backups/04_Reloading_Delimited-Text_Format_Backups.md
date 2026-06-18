### 9.4.4 Reloading Delimited-Text Format Backups

For backups produced with [**mysqldump --tab**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program"),
each table is represented in the output directory by an
`.sql` file containing the
[`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") statement for the
table, and a `.txt` file containing the table
data. To reload a table, first change location into the output
directory. Then process the `.sql` file with
[**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") to create an empty table and process
the `.txt` file to load the data into the
table:

```
$> mysql db1 < t1.sql
$> mysqlimport db1 t1.txt
```

An alternative to using [**mysqlimport**](mysqlimport.html "6.5.5 mysqlimport — A Data Import Program") to load
the data file is to use the [`LOAD
DATA`](load-data.html "15.2.9 LOAD DATA Statement") statement from within the
[**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") client:

```
mysql> USE db1;
mysql> LOAD DATA INFILE 't1.txt' INTO TABLE t1;
```

If you used any data-formatting options with
[**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program") when you initially dumped the
table, you must use the same options with
[**mysqlimport**](mysqlimport.html "6.5.5 mysqlimport — A Data Import Program") or [`LOAD
DATA`](load-data.html "15.2.9 LOAD DATA Statement") to ensure proper interpretation of the data file
contents:

```
$> mysqlimport --fields-terminated-by=,
         --fields-enclosed-by='"' --lines-terminated-by=0x0d0a db1 t1.txt
```

Or:

```
mysql> USE db1;
mysql> LOAD DATA INFILE 't1.txt' INTO TABLE t1
       FIELDS TERMINATED BY ',' FIELDS ENCLOSED BY '"'
       LINES TERMINATED BY '\r\n';
```