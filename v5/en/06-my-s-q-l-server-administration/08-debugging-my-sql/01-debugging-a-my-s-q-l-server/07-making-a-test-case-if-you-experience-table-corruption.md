#### 5.8.1.7 Making a Test Case If You Experience Table Corruption

The following procedure applies to [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") tables. For information about steps to take when encountering `InnoDB` table corruption, see [Section 1.5, “How to Report Bugs or Problems”](bug-reports.html "1.5 How to Report Bugs or Problems").

If you encounter corrupted [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") tables or if [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") always fails after some update statements, you can test whether the issue is reproducible by doing the following:

1. Stop the MySQL daemon with [**mysqladmin shutdown**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program").

2. Make a backup of the tables to guard against the very unlikely case that the repair does something bad.

3. Check all tables with [**myisamchk -s database/\*.MYI**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility"). Repair any corrupted tables with [**myisamchk -r database/*`table`*.MYI**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility").

4. Make a second backup of the tables.
5. Remove (or move away) any old log files from the MySQL data directory if you need more space.

6. Start [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") with the binary log enabled. If you want to find a statement that crashes [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), you should start the server with the general query log enabled as well. See [Section 5.4.3, “The General Query Log”](query-log.html "5.4.3 The General Query Log"), and [Section 5.4.4, “The Binary Log”](binary-log.html "5.4.4 The Binary Log").

7. When you have gotten a crashed table, stop the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") server.

8. Restore the backup.
9. Restart the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") server *without* the binary log enabled.

10. Re-execute the statements with [**mysqlbinlog binary-log-file | mysql**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files"). The binary log is saved in the MySQL database directory with the name `hostname-bin.NNNNNN`.

11. If the tables are corrupted again or you can get [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") to die with the above command, you have found a reproducible bug. FTP the tables and the binary log to our bugs database using the instructions given in [Section 1.5, “How to Report Bugs or Problems”](bug-reports.html "1.5 How to Report Bugs or Problems"). If you are a support customer, you can use the MySQL Customer Support Center (<https://www.mysql.com/support/>) to alert the MySQL team about the problem and have it fixed as soon as possible.
