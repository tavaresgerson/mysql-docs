### 7.9.1 Debugging a MySQL Server

If you are using some functionality that is very new in MySQL, you
can try to run [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") with the
[`--skip-new`](server-options.html#option_mysqld_skip-new) option (which disables
all new, potentially unsafe functionality). See
[Section B.3.3.3, “What to Do If MySQL Keeps Crashing”](crashing.html "B.3.3.3 What to Do If MySQL Keeps Crashing").

If [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") does not want to start, verify that
you have no `my.cnf` files that interfere with
your setup! You can check your `my.cnf`
arguments with [**mysqld --print-defaults**](mysqld.html "6.3.1 mysqld — The MySQL Server") and
avoid using them by starting with [**mysqld --no-defaults
...**](mysqld.html "6.3.1 mysqld — The MySQL Server").

If [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") starts to eat up CPU or memory or if
it “hangs,” you can use [**mysqladmin
processlist status**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") to find out if someone is executing a
query that takes a long time. It may be a good idea to run
[**mysqladmin -i10 processlist status**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") in some
window if you are experiencing performance problems or problems
when new clients cannot connect.

The command [**mysqladmin debug**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") dumps some
information about locks in use, used memory and query usage to the
MySQL log file. This may help solve some problems. This command
also provides some useful information even if you have not
compiled MySQL for debugging!

If the problem is that some tables are getting slower and slower
you should try to optimize the table with
[`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") or
[**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility"). See
[Chapter 7, *MySQL Server Administration*](server-administration.html "Chapter 7 MySQL Server Administration"). You should also check the
slow queries with [`EXPLAIN`](explain.html "15.8.2 EXPLAIN Statement").

You should also read the OS-specific section in this manual for
problems that may be unique to your environment. See
[Section 2.1, “General Installation Guidance”](general-installation-issues.html "2.1 General Installation Guidance").