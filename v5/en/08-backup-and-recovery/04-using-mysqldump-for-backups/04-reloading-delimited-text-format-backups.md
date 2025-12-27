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
