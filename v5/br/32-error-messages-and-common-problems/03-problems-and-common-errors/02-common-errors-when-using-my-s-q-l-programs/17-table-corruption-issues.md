#### B.3.2.17 Table-Corruption Issues

If you have started [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") with the [`myisam_recover_options`](server-system-variables.html#sysvar_myisam_recover_options) system variable set, MySQL automatically checks and tries to repair `MyISAM` tables if they are marked as 'not closed properly' or 'crashed'. If this happens, MySQL writes an entry in the `hostname.err` file `'Warning: Checking table ...'` which is followed by `Warning: Repairing table` if the table needs to be repaired. If you get a lot of these errors, without [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") having died unexpectedly just before, then something is wrong and needs to be investigated further.

When the server detects `MyISAM` table corruption, it writes additional information to the error log, such as the name and line number of the source file, and the list of threads accessing the table. Example: `Got an error from thread_id=1, mi_dynrec.c:368`. This is useful information to include in bug reports.

See also [Section 5.1.6, “Server Command Options”](server-options.html "5.1.6 Server Command Options"), and [Section 5.8.1.7, “Making a Test Case If You Experience Table Corruption”](reproducible-test-case.html "5.8.1.7 Making a Test Case If You Experience Table Corruption").
