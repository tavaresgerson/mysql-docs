--- title: MySQL 8.4 Reference Manual :: 9.4.5.1 Making a Copy of a Database url: https://dev.mysql.com/doc/refman/8.4/en/mysqldump-copying-database.html order: 14 ---



#### 9.4.5.1 Making a Copy of a Database

```
$> mysqldump db1 > dump.sql
$> mysqladmin create db2
$> mysql db2 < dump.sql
```

Do not use  `--databases` on the  `mysqldump` command line because that causes `USE db1` to be included in the dump file, which overrides the effect of naming `db2` on the  `mysql` command line.


