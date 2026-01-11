## 9.6 MyISAM Table Maintenance and Crash Recovery

9.6.1 Using myisamchk for Crash Recovery

9.6.2 How to Check MyISAM Tables for Errors

9.6.3 How to Repair MyISAM Tables

9.6.4 MyISAM Table Optimization

9.6.5 Setting Up a MyISAM Table Maintenance Schedule

This section discusses how to use **myisamchk** to check or repair `MyISAM` tables (tables that have `.MYD` and `.MYI` files for storing data and indexes). For general **myisamchk** background, see Section 6.6.4, “myisamchk — MyISAM Table-Maintenance Utility”. Other table-repair information can be found at Section 3.14, “Rebuilding or Repairing Tables or Indexes”.

You can use **myisamchk** to check, repair, or optimize database tables. The following sections describe how to perform these operations and how to set up a table maintenance schedule. For information about using **myisamchk** to get information about your tables, see Section 6.6.4.5, “Obtaining Table Information with myisamchk”.

Even though table repair with **myisamchk** is quite secure, it is always a good idea to make a backup *before* doing a repair or any maintenance operation that could make a lot of changes to a table.

**myisamchk** operations that affect indexes can cause `MyISAM` `FULLTEXT` indexes to be rebuilt with full-text parameters that are incompatible with the values used by the MySQL server. To avoid this problem, follow the guidelines in Section 6.6.4.1, “myisamchk General Options”.

`MyISAM` table maintenance can also be done using the SQL statements that perform operations similar to what **myisamchk** can do:

* To check `MyISAM` tables, use `CHECK TABLE`.

* To repair `MyISAM` tables, use `REPAIR TABLE`.

* To optimize `MyISAM` tables, use `OPTIMIZE TABLE`.

* To analyze `MyISAM` tables, use `ANALYZE TABLE`.

For additional information about these statements, see Section 15.7.3, “Table Maintenance Statements”.

These statements can be used directly or by means of the **mysqlcheck** client program. One advantage of these statements over **myisamchk** is that the server does all the work. With **myisamchk**, you must make sure that the server does not use the tables at the same time so that there is no unwanted interaction between **myisamchk** and the server.
