#### 9.4.5.1 Making a Copy of a Database

```
$> mysqldump db1 > dump.sql
$> mysqladmin create db2
$> mysql db2 < dump.sql
```

Do not use [`--databases`](mysqldump.html#option_mysqldump_databases) on
the [**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program") command line because that
causes `USE db1` to be included in the dump
file, which overrides the effect of naming
`db2` on the [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") command
line.