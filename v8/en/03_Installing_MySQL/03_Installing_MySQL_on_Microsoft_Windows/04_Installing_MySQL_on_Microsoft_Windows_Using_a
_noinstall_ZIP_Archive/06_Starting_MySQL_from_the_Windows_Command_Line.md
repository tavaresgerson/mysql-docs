#### 2.3.4.6 Starting MySQL from the Windows Command Line

The MySQL server can be started manually from the command line.
This can be done on any version of Windows.

To start the [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") server from the command
line, you should start a console window (or “DOS
window”) and enter this command:

```
C:\> "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld"
```

The path to [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") may vary depending on the
install location of MySQL on your system.

You can stop the MySQL server by executing this command:

```
C:\> "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqladmin" -u root shutdown
```

Note

If the MySQL `root` user account has a
password, you need to invoke [**mysqladmin**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program")
with the `-p` option and supply the password
when prompted.

This command invokes the MySQL administrative utility
[**mysqladmin**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") to connect to the server and tell
it to shut down. The command connects as the MySQL
`root` user, which is the default
administrative account in the MySQL grant system.

Note

Users in the MySQL grant system are wholly independent from
any operating system users under Microsoft Windows.

If [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") doesn't start, check the error log
to see whether the server wrote any messages there to indicate
the cause of the problem. By default, the error log is located
in the `C:\Program Files\MySQL\MySQL Server
8.0\data` directory. It is the file with
a suffix of `.err`, or may be specified by
passing in the [`--log-error`](server-options.html#option_mysqld_log-error)
option. Alternatively, you can try to start the server with the
[`--console`](server-options.html#option_mysqld_console) option; in this case,
the server may display some useful information on the screen to
help solve the problem.

The last option is to start [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") with the
[`--standalone`](server-options.html#option_mysqld_standalone) and
[`--debug`](server-options.html#option_mysqld_debug) options. In this case,
[**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") writes a log file
`C:\mysqld.trace` that should contain the
reason why [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") doesn't start. See
[Section 7.9.4, “The DBUG Package”](dbug-package.html "7.9.4 The DBUG Package").

Use [**mysqld --verbose --help**](mysqld.html "6.3.1 mysqld — The MySQL Server") to display all
the options that [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") supports.