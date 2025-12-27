#### 5.8.1.2 Creating Trace Files

If the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") server does not start or it crashes easily, you can try to create a trace file to find the problem.

To do this, you must have a [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") that has been compiled with debugging support. You can check this by executing `mysqld -V`. If the version number ends with `-debug`, it is compiled with support for trace files. (On Windows, the debugging server is named [**mysqld-debug**](mysqld.html "4.3.1 mysqld — The MySQL Server") rather than [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").)

Start the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") server with a trace log in `/tmp/mysqld.trace` on Unix or `\mysqld.trace` on Windows:

```sql
$> mysqld --debug
```

On Windows, you should also use the [`--standalone`](server-options.html#option_mysqld_standalone) flag to not start [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") as a service. In a console window, use this command:

```sql
C:\> mysqld-debug --debug --standalone
```

After this, you can use the `mysql.exe` command-line tool in a second console window to reproduce the problem. You can stop the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") server with [**mysqladmin shutdown**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program").

The trace file can become **very large**! To generate a smaller trace file, you can use debugging options something like this:

[**mysqld --debug=d,info,error,query,general,where:O,/tmp/mysqld.trace**](mysqld.html "4.3.1 mysqld — The MySQL Server")

This only prints information with the most interesting tags to the trace file.

If you file a bug, please add only those lines from the trace file to the bug report that indicate where something seems to go wrong. If you cannot locate the wrong place, open a bug report and upload the whole trace file to the report, so that a MySQL developer can take a look at it. For instructions, see [Section 1.5, “How to Report Bugs or Problems”](bug-reports.html "1.5 How to Report Bugs or Problems").

The trace file is made with the DBUG package by Fred Fish. See [Section 5.8.3, “The DBUG Package”](dbug-package.html "5.8.3 The DBUG Package").
