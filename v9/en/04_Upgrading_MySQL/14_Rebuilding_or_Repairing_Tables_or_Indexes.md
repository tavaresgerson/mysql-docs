## 3.14 Rebuilding or Repairing Tables or Indexes

This section describes how to rebuild or repair tables or indexes,
which may be necessitated by:

* Changes to how MySQL handles data types or character sets. For
  example, an error in a collation might have been corrected,
  necessitating a table rebuild to update the indexes for
  character columns that use the collation.

* Required table repairs or upgrades reported by
  [`CHECK TABLE`](check-table.html "15.7.3.2 CHECK TABLE Statement") or
  [**mysqlcheck**](mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program").

Methods for rebuilding a table include:

* [Dump and Reload Method](rebuilding-tables.html#rebuilding-tables-dump-reload "Dump and Reload Method")
* [ALTER TABLE Method](rebuilding-tables.html#rebuilding-tables-alter-table "ALTER TABLE Method")
* [REPAIR TABLE Method](rebuilding-tables.html#rebuilding-tables-repair-table "REPAIR TABLE Method")

### Dump and Reload Method

If you are rebuilding tables because a different version of
MySQL cannot handle them after a binary (in-place) upgrade or
downgrade, you must use the dump-and-reload method. Dump the
tables *before* upgrading or downgrading
using your original version of MySQL. Then reload the tables
*after* upgrading or downgrading.

If you use the dump-and-reload method of rebuilding tables only
for the purpose of rebuilding indexes, you can perform the dump
either before or after upgrading or downgrading. Reloading still
must be done afterward.

If you need to rebuild an `InnoDB` table
because a [`CHECK TABLE`](check-table.html "15.7.3.2 CHECK TABLE Statement") operation
indicates that a table upgrade is required, use
[**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program") to create a dump file and
[**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") to reload the file. If the
[`CHECK TABLE`](check-table.html "15.7.3.2 CHECK TABLE Statement") operation indicates
that there is a corruption or causes `InnoDB`
to fail, refer to [Section 17.20.3, “Forcing InnoDB Recovery”](forcing-innodb-recovery.html "17.20.3 Forcing InnoDB Recovery") for
information about using the
[`innodb_force_recovery`](innodb-parameters.html#sysvar_innodb_force_recovery) option to
restart `InnoDB`. To understand the type of
problem that [`CHECK TABLE`](check-table.html "15.7.3.2 CHECK TABLE Statement") may be
encountering, refer to the `InnoDB` notes in
[Section 15.7.3.2, “CHECK TABLE Statement”](check-table.html "15.7.3.2 CHECK TABLE Statement").

To rebuild a table by dumping and reloading it, use
[**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program") to create a dump file and
[**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") to reload the file:

```
mysqldump db_name t1 > dump.sql
mysql db_name < dump.sql
```

To rebuild all the tables in a single database, specify the
database name without any following table name:

```
mysqldump db_name > dump.sql
mysql db_name < dump.sql
```

To rebuild all tables in all databases, use the
[`--all-databases`](mysqldump.html#option_mysqldump_all-databases) option:

```
mysqldump --all-databases > dump.sql
mysql < dump.sql
```

### ALTER TABLE Method

To rebuild a table with [`ALTER
TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement"), use a “null” alteration; that is,
an [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") statement that
“changes” the table to use the storage engine that
it already has. For example, if `t1` is an
`InnoDB` table, use this statement:

```
ALTER TABLE t1 ENGINE = InnoDB;
```

If you are not sure which storage engine to specify in the
[`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") statement, use
[`SHOW CREATE TABLE`](show-create-table.html "15.7.7.12 SHOW CREATE TABLE Statement") to display the
table definition.

### REPAIR TABLE Method

The [`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement") method is only
applicable to `MyISAM`,
`ARCHIVE`, and `CSV` tables.

You can use [`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement") if the
table checking operation indicates that there is a corruption or
that an upgrade is required. For example, to repair a
`MyISAM` table, use this statement:

```
REPAIR TABLE t1;
```

[**mysqlcheck --repair**](mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program") provides command-line
access to the [`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement")
statement. This can be a more convenient means of repairing
tables because you can use the
[`--databases`](mysqlcheck.html#option_mysqlcheck_databases) or
[`--all-databases`](mysqlcheck.html#option_mysqlcheck_all-databases) option to
repair all tables in specific databases or all databases,
respectively:

```
mysqlcheck --repair --databases db_name ...
mysqlcheck --repair --all-databases
```