### 14.10.1 Enabling File Formats

The [`innodb_file_format`](innodb-parameters.html#sysvar_innodb_file_format)
configuration option enables an `InnoDB` file
format for
[file-per-table](glossary.html#glos_file_per_table "file-per-table")
tablespaces.

`Barracuda` is the default
[`innodb_file_format`](innodb-parameters.html#sysvar_innodb_file_format) setting. In
earlier releases, the default file format was
`Antelope`.

Note

The [`innodb_file_format`](innodb-parameters.html#sysvar_innodb_file_format)
configuration option is deprecated and may be removed in a
future release. For more information, see
[Section 14.10, “InnoDB File-Format Management”](innodb-file-format.html "14.10 InnoDB File-Format Management").

You can set the value of
[`innodb_file_format`](innodb-parameters.html#sysvar_innodb_file_format) on the command
line when you start [`mysqld`](mysqld.html "4.3.1 mysqld — The MySQL Server"), or in the option
file (`my.cnf` on Unix,
`my.ini` on Windows). You can also change it
dynamically with a `SET GLOBAL` statement.

```sql
SET GLOBAL innodb_file_format=Barracuda;
```

#### Usage notes

* `InnoDB` file format settings do not apply to
  tables stored in [general
  tablespaces](general-tablespaces.html "14.6.3.3 General Tablespaces"). General tablespaces provide support for
  all row formats and associated features. For more information,
  see [Section 14.6.3.3, “General Tablespaces”](general-tablespaces.html "14.6.3.3 General Tablespaces").

* The [`innodb_file_format`](innodb-parameters.html#sysvar_innodb_file_format)
  setting is not applicable when using the `TABLESPACE
  [=] innodb_system` table option with
  [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") or
  [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") to store a
  `DYNAMIC` table in the system tablespace.

* The [`innodb_file_format`](innodb-parameters.html#sysvar_innodb_file_format)
  setting is ignored when creating tables that use the
  `DYNAMIC` row format. For more information,
  see [DYNAMIC Row Format](innodb-row-format.html#innodb-row-format-dynamic "DYNAMIC Row Format").