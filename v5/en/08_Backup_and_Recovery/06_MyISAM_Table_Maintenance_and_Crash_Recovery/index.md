## 7.6 MyISAM Table Maintenance and Crash Recovery

[7.6.1 Using myisamchk for Crash Recovery](myisam-crash-recovery.html)

[7.6.2 How to Check MyISAM Tables for Errors](myisam-check.html)

[7.6.3 How to Repair MyISAM Tables](myisam-repair.html)

[7.6.4 MyISAM Table Optimization](myisam-optimization.html)

[7.6.5 Setting Up a MyISAM Table Maintenance Schedule](myisam-maintenance-schedule.html)

This section discusses how to use [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") to
check or repair `MyISAM` tables (tables that have
`.MYD` and `.MYI` files for
storing data and indexes). For general
[**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") background, see
[Section 4.6.3, “myisamchk — MyISAM Table-Maintenance Utility”](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility"). Other table-repair information can be
found at [Section 2.10.12, “Rebuilding or Repairing Tables or Indexes”](rebuilding-tables.html "2.10.12 Rebuilding or Repairing Tables or Indexes").

You can use [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") to check, repair, or
optimize database tables. The following sections describe how to
perform these operations and how to set up a table maintenance
schedule. For information about using [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility")
to get information about your tables, see
[Section 4.6.3.5, “Obtaining Table Information with myisamchk”](myisamchk-table-info.html "4.6.3.5 Obtaining Table Information with myisamchk").

Even though table repair with [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") is
quite secure, it is always a good idea to make a backup
*before* doing a repair or any maintenance
operation that could make a lot of changes to a table.

[**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") operations that affect indexes can
cause `MyISAM` `FULLTEXT`
indexes to be rebuilt with full-text parameters that are
incompatible with the values used by the MySQL server. To avoid
this problem, follow the guidelines in
[Section 4.6.3.1, “myisamchk General Options”](myisamchk-general-options.html "4.6.3.1 myisamchk General Options").

`MyISAM` table maintenance can also be done using
the SQL statements that perform operations similar to what
[**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") can do:

* To check `MyISAM` tables, use
  [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement").

* To repair `MyISAM` tables, use
  [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement").

* To optimize `MyISAM` tables, use
  [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement").

* To analyze `MyISAM` tables, use
  [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement").

For additional information about these statements, see
[Section 13.7.2, “Table Maintenance Statements”](table-maintenance-statements.html "13.7.2 Table Maintenance Statements").

These statements can be used directly or by means of the
[**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program") client program. One advantage of
these statements over [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") is that the
server does all the work. With [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility"), you
must make sure that the server does not use the tables at the same
time so that there is no unwanted interaction between
[**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") and the server.