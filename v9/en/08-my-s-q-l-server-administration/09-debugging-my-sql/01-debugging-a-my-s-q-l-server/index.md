### 7.9.1 Debugging a MySQL Server

7.9.1.1 Compiling MySQL for Debugging

7.9.1.2 Creating Trace Files

7.9.1.3 Using WER with PDB to create a Windows crashdump

7.9.1.4 Debugging mysqld under gdb

7.9.1.5 Using a Stack Trace

7.9.1.6 Using Server Logs to Find Causes of Errors in mysqld

7.9.1.7 Making a Test Case If You Experience Table Corruption

If you are using some functionality that is very new in MySQL, you can try to run **mysqld** with the `--skip-new` option (which disables all new, potentially unsafe functionality). See Section B.3.3.3, “What to Do If MySQL Keeps Crashing”.

If **mysqld** does not want to start, verify that you have no `my.cnf` files that interfere with your setup! You can check your `my.cnf` arguments with **mysqld --print-defaults** and avoid using them by starting with **mysqld --no-defaults ...**.

If **mysqld** starts to eat up CPU or memory or if it “hangs,” you can use **mysqladmin processlist status** to find out if someone is executing a query that takes a long time. It may be a good idea to run **mysqladmin -i10 processlist status** in some window if you are experiencing performance problems or problems when new clients cannot connect.

The command **mysqladmin debug** dumps some information about locks in use, used memory and query usage to the MySQL log file. This may help solve some problems. This command also provides some useful information even if you have not compiled MySQL for debugging!

If the problem is that some tables are getting slower and slower you should try to optimize the table with `OPTIMIZE TABLE` or **myisamchk**. See Chapter 7, *MySQL Server Administration*. You should also check the slow queries with `EXPLAIN`.

You should also read the OS-specific section in this manual for problems that may be unique to your environment. See Section 2.1, “General Installation Guidance”.
