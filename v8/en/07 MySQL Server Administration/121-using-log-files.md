#### 7.9.1.6 Using Server Logs to Find Causes of Errors in mysqld

Note that before starting  `mysqld` with the general query log enabled, you should check all your tables with `myisamchk`. See Chapter 7, *MySQL Server Administration*.

If  `mysqld` dies or hangs, you should start `mysqld` with the general query log enabled. See  Section 7.4.3, “The General Query Log”. When  `mysqld` dies again, you can examine the end of the log file for the query that killed  `mysqld`.

If you use the default general query log file, the log is stored in the database directory as `host_name.log` In most cases it is the last query in the log file that killed `mysqld`, but if possible you should verify this by restarting  `mysqld` and executing the found query from the  `mysql` command-line tools. If this works, you should also test all complicated queries that did not complete.

You can also try the command `EXPLAIN` on all `SELECT` statements that takes a long time to ensure that  `mysqld` is using indexes properly. See  Section 15.8.2, “EXPLAIN Statement”.

You can find the queries that take a long time to execute by starting  `mysqld` with the slow query log enabled. See  Section 7.4.5, “The Slow Query Log”.

If you find the text `mysqld restarted` in the error log (normally a file named `host_name.err`) you probably have found a query that causes `mysqld` to fail. If this happens, you should check all your tables with  `myisamchk` (see Chapter 7, *MySQL Server Administration*), and test the queries in the MySQL log files to see whether one fails. If you find such a query, try first upgrading to the newest MySQL version. If this does not help, report a bug, see Section 1.6, “How to Report Bugs or Problems”.

If you have started  `mysqld` with the `myisam_recover_options` system variable set, MySQL automatically checks and tries to repair `MyISAM` tables if they are marked as 'not closed properly' or 'crashed'. If this happens, MySQL writes an entry in the `hostname.err` file `'Warning: Checking table ...'` which is followed by `Warning: Repairing table` if the table needs to be repaired. If you get a lot of these errors, without  `mysqld` having died unexpectedly just before, then something is wrong and needs to be investigated further. See  Section 7.1.7, “Server Command Options”.

When the server detects `MyISAM` table corruption, it writes additional information to the error log, such as the name and line number of the source file, and the list of threads accessing the table. Example: `Got an error from thread_id=1, mi_dynrec.c:368`. This is useful information to include in bug reports.

It is not a good sign if  `mysqld` did die unexpectedly, but in this case, you should not investigate the `Checking table...` messages, but instead try to find out why  `mysqld` died.
