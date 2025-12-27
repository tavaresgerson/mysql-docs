### 5.8.1 Debugging a MySQL Server

[5.8.1.1 Compiling MySQL for Debugging](compiling-for-debugging.html)

[5.8.1.2 Creating Trace Files](making-trace-files.html)

[5.8.1.3 Using WER with PDB to create a Windows crashdump](making-windows-dumps.html)

[5.8.1.4 Debugging mysqld under gdb](using-gdb-on-mysqld.html)

[5.8.1.5 Using a Stack Trace](using-stack-trace.html)

[5.8.1.6 Using Server Logs to Find Causes of Errors in mysqld](using-log-files.html)

[5.8.1.7 Making a Test Case If You Experience Table Corruption](reproducible-test-case.html)

If you are using some functionality that is very new in MySQL, you can try to run [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") with the [`--skip-new`](server-options.html#option_mysqld_skip-new) option (which disables all new, potentially unsafe functionality). See [Section B.3.3.3, “What to Do If MySQL Keeps Crashing”](crashing.html "B.3.3.3 What to Do If MySQL Keeps Crashing").

If [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") does not want to start, verify that you have no `my.cnf` files that interfere with your setup! You can check your `my.cnf` arguments with [**mysqld --print-defaults**](mysqld.html "4.3.1 mysqld — The MySQL Server") and avoid using them by starting with [**mysqld --no-defaults ...**](mysqld.html "4.3.1 mysqld — The MySQL Server").

If [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") starts to eat up CPU or memory or if it “hangs,” you can use [**mysqladmin processlist status**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") to find out if someone is executing a query that takes a long time. It may be a good idea to run [**mysqladmin -i10 processlist status**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") in some window if you are experiencing performance problems or problems when new clients cannot connect.

The command [**mysqladmin debug**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") dumps some information about locks in use, used memory and query usage to the MySQL log file. This may help solve some problems. This command also provides some useful information even if you have not compiled MySQL for debugging!

If the problem is that some tables are getting slower and slower you should try to optimize the table with [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") or [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility"). See [Chapter 5, *MySQL Server Administration*](server-administration.html "Chapter 5 MySQL Server Administration"). You should also check the slow queries with [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement").

You should also read the OS-specific section in this manual for problems that may be unique to your environment. See [Section 2.1, “General Installation Guidance”](general-installation-issues.html "2.1 General Installation Guidance").
