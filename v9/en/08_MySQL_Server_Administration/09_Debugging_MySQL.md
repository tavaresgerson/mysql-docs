## 7.9 Debugging MySQL

This section describes debugging techniques that assist efforts to track down problems in MySQL.


### 7.9.1 Debugging a MySQL Server

If you are using some functionality that is very new in MySQL, you can try to run **mysqld** with the `--skip-new` option (which disables all new, potentially unsafe functionality). See Section B.3.3.3, “What to Do If MySQL Keeps Crashing”.

If **mysqld** does not want to start, verify that you have no `my.cnf` files that interfere with your setup! You can check your `my.cnf` arguments with **mysqld --print-defaults** and avoid using them by starting with [**mysqld --no-defaults ...**](mysqld.html "6.3.1 mysqld — The MySQL Server").

If **mysqld** starts to eat up CPU or memory or if it “hangs,” you can use [**mysqladmin processlist status**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") to find out if someone is executing a query that takes a long time. It may be a good idea to run **mysqladmin -i10 processlist status** in some window if you are experiencing performance problems or problems when new clients cannot connect.

The command **mysqladmin debug** dumps some information about locks in use, used memory and query usage to the MySQL log file. This may help solve some problems. This command also provides some useful information even if you have not compiled MySQL for debugging!

If the problem is that some tables are getting slower and slower you should try to optimize the table with `OPTIMIZE TABLE` or **myisamchk**. See Chapter 7, *MySQL Server Administration*. You should also check the slow queries with `EXPLAIN`.

You should also read the OS-specific section in this manual for problems that may be unique to your environment. See Section 2.1, “General Installation Guidance”.


#### 7.9.1.1 Compiling MySQL for Debugging

If you have some very specific problem, you can always try to debug MySQL. To do this you must configure MySQL with the `-DWITH_DEBUG=1` option. You can check whether MySQL was compiled with debugging by doing: **mysqld --help**. If the `--debug` flag is listed with the options then you have debugging enabled. [**mysqladmin ver**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") also lists the **mysqld** version as **mysql ... --debug** in this case.

If **mysqld** stops crashing when you configure it with the `-DWITH_DEBUG=1` CMake option, you probably have found a compiler bug or a timing bug within MySQL. In this case, you can try to add `-g` using the `CMAKE_C_FLAGS` and `CMAKE_CXX_FLAGS` CMake options and not use `-DWITH_DEBUG=1`. If **mysqld** dies, you can at least attach to it with **gdb** or use **gdb** on the core file to find out what happened.

When you configure MySQL for debugging you automatically enable a lot of extra safety check functions that monitor the health of **mysqld**. If they find something “unexpected,” an entry is written to `stderr`, which **mysqld_safe** directs to the error log! This also means that if you are having some unexpected problems with MySQL and are using a source distribution, the first thing you should do is to configure MySQL for debugging. If you believe that you have found a bug, please use the instructions at Section 1.6, “How to Report Bugs or Problems”.

In the Windows MySQL distribution, `mysqld.exe` is by default compiled with support for trace files.


#### 7.9.1.2 Creating Trace Files

If the **mysqld** server does not start or it crashes easily, you can try to create a trace file to find the problem.

To do this, you must have a **mysqld** that has been compiled with debugging support. You can check this by executing `mysqld -V`. If the version number ends with `-debug`, it is compiled with support for trace files. (On Windows, the debugging server is named **mysqld-debug** rather than **mysqld**.)

Start the **mysqld** server with a trace log in `/tmp/mysqld.trace` on Unix or `\mysqld.trace` on Windows:

```
$> mysqld --debug
```

On Windows, you should also use the `--standalone` flag to not start **mysqld** as a service. In a console window, use this command:

```
C:\> mysqld-debug --debug --standalone
```

After this, you can use the `mysql.exe` command-line tool in a second console window to reproduce the problem. You can stop the **mysqld** server with **mysqladmin shutdown**.

The trace file can become **very large**! To generate a smaller trace file, you can use debugging options something like this:

[**mysqld --debug=d,info,error,query,general,where:O,/tmp/mysqld.trace**](mysqld.html "6.3.1 mysqld — The MySQL Server")

This only prints information with the most interesting tags to the trace file.

If you file a bug, please add only those lines from the trace file to the bug report that indicate where something seems to go wrong. If you cannot locate the wrong place, open a bug report and upload the whole trace file to the report, so that a MySQL developer can take a look at it. For instructions, see Section 1.6, “How to Report Bugs or Problems”.

The trace file is made with the `DBUG` package by Fred Fish. See Section 7.9.4, “The DBUG Package”.


#### 7.9.1.3 Using WER with PDB to create a Windows crashdump

Program Database files (with suffix `pdb`) are included in the **ZIP Archive Debug Binaries & Test Suite** distribution of MySQL. These files provide information for debugging your MySQL installation in the event of a problem. This is a separate download from the standard MSI or Zip file.

Note

The PDB files are available in a separate file labeled "ZIP Archive Debug Binaries & Test Suite".

The PDB file contains more detailed information about `mysqld` and other tools that enables more detailed trace and dump files to be created. You can use these with **WinDbg** or Visual Studio to debug **mysqld**.

For more information on PDB files, see [Microsoft Knowledge Base Article 121366](http://support.microsoft.com/kb/121366/). For more information on the debugging options available, see [Debugging Tools for Windows](http://www.microsoft.com/whdc/devtools/debugging/default.mspx).

To use WinDbg, either install the full Windows Driver Kit (WDK) or install the standalone version.

Important

The `.exe` and `.pdb` files must be an exact match (both version number and MySQL server edition); otherwise, or WinDBG complains while attempting to load the symbols.

1. To generate a minidump `mysqld.dmp`, enable the `core-file` option under the [mysqld] section in `my.ini`. Restart the MySQL server after making these changes.

2. Create a directory to store the generated files, such as `c:\symbols`

3. Determine the path to your **windbg.exe** executable using the Find GUI or from the command line, for example: `dir /s /b windbg.exe` -- a common default is *C:\Program Files\Debugging Tools for Windows (x64)\windbg.exe*

4. Launch `windbg.exe` giving it the paths to `mysqld.exe`, `mysqld.pdb`, `mysqld.dmp`, and the source code. Alternatively, pass in each path from the WinDbg GUI. For example:

   ```
   windbg.exe -i "C:\mysql-9.5.0-winx64\bin\"^
    -z "C:\mysql-9.5.0-winx64\data\mysqld.dmp"^
    -srcpath "E:\ade\mysql_archives\9.5\9.5.0\mysql-9.5.0"^
    -y "C:\mysql-9.5.0-winx64\bin;SRV*c:\symbols*http://msdl.microsoft.com/download/symbols"^
    -v -n -c "!analyze -vvvvv"
   ```

   Note

   The `^` character and newline are removed by the Windows command line processor, so be sure the spaces remain intact.


#### 7.9.1.4 Debugging mysqld under gdb

On most systems you can also start **mysqld** from **gdb** to get more information if **mysqld** crashes.

With some older **gdb** versions on Linux you must use `run --one-thread` if you want to be able to debug **mysqld** threads. In this case, you can only have one thread active at a time.

NPTL threads (the new thread library on Linux) may cause problems while running **mysqld** under **gdb**. Some symptoms are:

* **mysqld** hangs during startup (before it writes `ready for connections`).

* **mysqld** crashes during a `pthread_mutex_lock()` or `pthread_mutex_unlock()` call.

In this case, you should set the following environment variable in the shell before starting **gdb**:

```
LD_ASSUME_KERNEL=2.4.1
export LD_ASSUME_KERNEL
```

When running **mysqld** under **gdb**, you should disable the stack trace with `--skip-stack-trace` to be able to catch segfaults within **gdb**.

Use the `--gdb` option to **mysqld** to install an interrupt handler for `SIGINT` (needed to stop **mysqld** with `^C` to set breakpoints) and disable stack tracing and core file handling.

It is very hard to debug MySQL under **gdb** if you do a lot of new connections the whole time as **gdb** does not free the memory for old threads. You can avoid this problem by starting **mysqld** with `thread_cache_size` set to a value equal to `max_connections`

+ 1. In most cases just using `--thread_cache_size=5'` helps a lot!

If you want to get a core dump on Linux if **mysqld** dies with a SIGSEGV signal, you can start **mysqld** with the `--core-file` option. This core file can be used to make a backtrace that may help you find out why **mysqld** died:

```
$> gdb mysqld core
gdb>   backtrace full
gdb>   quit
```

See Section B.3.3.3, “What to Do If MySQL Keeps Crashing”.

If you are using **gdb** on Linux, you should install a `.gdb` file, with the following information, in your current directory:

```
set print sevenbit off
handle SIGUSR1 nostop noprint
handle SIGUSR2 nostop noprint
handle SIGWAITING nostop noprint
handle SIGLWP nostop noprint
handle SIGPIPE nostop
handle SIGALRM nostop
handle SIGHUP nostop
handle SIGTERM nostop noprint
```

Here is an example how to debug **mysqld**:

```
$> gdb /usr/local/libexec/mysqld
gdb> run
...
backtrace full # Do this when mysqld crashes
```

Include the preceding output in a bug report, which you can file using the instructions in Section 1.6, “How to Report Bugs or Problems”.

If **mysqld** hangs, you can try to use some system tools like `strace` or `/usr/proc/bin/pstack` to examine where **mysqld** has hung.

```
strace /tmp/log libexec/mysqld
```

If you are using the Perl `DBI` interface, you can turn on debugging information by using the `trace` method or by setting the `DBI_TRACE` environment variable.


#### 7.9.1.5 Using a Stack Trace

On some operating systems, the error log contains a stack trace if **mysqld** dies unexpectedly. You can use this to find out where (and maybe why) **mysqld** died. See Section 7.4.2, “The Error Log”. To get a stack trace, you must not compile **mysqld** with the `-fomit-frame-pointer` option to gcc. See Section 7.9.1.1, “Compiling MySQL for Debugging”.

A stack trace in the error log looks something like this:

```
mysqld got signal 11;
Attempting backtrace. You can use the following information
to find out where mysqld died. If you see no messages after
this, something went terribly wrong...

stack_bottom = 0x41fd0110 thread_stack 0x40000
mysqld(my_print_stacktrace+0x32)[0x9da402]
mysqld(handle_segfault+0x28a)[0x6648e9]
/lib/libpthread.so.0[0x7f1a5af000f0]
/lib/libc.so.6(strcmp+0x2)[0x7f1a5a10f0f2]
mysqld(_Z21check_change_passwordP3THDPKcS2_Pcj+0x7c)[0x7412cb]
mysqld(_ZN16set_var_password5checkEP3THD+0xd0)[0x688354]
mysqld(_Z17sql_set_variablesP3THDP4ListI12set_var_baseE+0x68)[0x688494]
mysqld(_Z21mysql_execute_commandP3THD+0x41a0)[0x67a170]
mysqld(_Z11mysql_parseP3THDPKcjPS2_+0x282)[0x67f0ad]
mysqld(_Z16dispatch_command19enum_server_commandP3THDPcj+0xbb7[0x67fdf8]
mysqld(_Z10do_commandP3THD+0x24d)[0x6811b6]
mysqld(handle_one_connection+0x11c)[0x66e05e]
```

If resolution of function names for the trace fails, the trace contains less information:

```
mysqld got signal 11;
Attempting backtrace. You can use the following information
to find out where mysqld died. If you see no messages after
this, something went terribly wrong...

stack_bottom = 0x41fd0110 thread_stack 0x40000
[0x9da402]
[0x6648e9]
[0x7f1a5af000f0]
[0x7f1a5a10f0f2]
[0x7412cb]
[0x688354]
[0x688494]
[0x67a170]
[0x67f0ad]
[0x67fdf8]
[0x6811b6]
[0x66e05e]
```

Newer versions of `glibc` stack trace functions also print the address as relative to the object. On `glibc`-based systems (Linux), the trace for an unexpected exit within a plugin looks something like:

```
plugin/auth/auth_test_plugin.so(+0x9a6)[0x7ff4d11c29a6]
```

To translate the relative address (`+0x9a6`) into a file name and line number, use this command:

```
$> addr2line -fie auth_test_plugin.so 0x9a6
auth_test_plugin
mysql-trunk/plugin/auth/test_plugin.c:65
```

The **addr2line** utility is part of the `binutils` package on Linux.

On Solaris, the procedure is similar. The Solaris `printstack()` already prints relative addresses:

```
plugin/auth/auth_test_plugin.so:0x1510
```

To translate, use this command:

```
$> gaddr2line -fie auth_test_plugin.so 0x1510
mysql-trunk/plugin/auth/test_plugin.c:88
```

Windows already prints the address, function name and line:

```
000007FEF07E10A4 auth_test_plugin.dll!auth_test_plugin()[test_plugin.c:72]
```


#### 7.9.1.6 Using Server Logs to Find Causes of Errors in mysqld

Note that before starting **mysqld** with the general query log enabled, you should check all your tables with **myisamchk**. See Chapter 7, *MySQL Server Administration*.

If **mysqld** dies or hangs, you should start **mysqld** with the general query log enabled. See Section 7.4.3, “The General Query Log”. When **mysqld** dies again, you can examine the end of the log file for the query that killed **mysqld**.

If you use the default general query log file, the log is stored in the database directory as `host_name.log` In most cases it is the last query in the log file that killed **mysqld**, but if possible you should verify this by restarting **mysqld** and executing the found query from the **mysql** command-line tools. If this works, you should also test all complicated queries that did not complete.

You can also try the command `EXPLAIN` on all `SELECT` statements that takes a long time to ensure that **mysqld** is using indexes properly. See Section 15.8.2, “EXPLAIN Statement”.

You can find the queries that take a long time to execute by starting **mysqld** with the slow query log enabled. See Section 7.4.5, “The Slow Query Log”.

If you find the text `mysqld restarted` in the error log (normally a file named `host_name.err`) you probably have found a query that causes **mysqld** to fail. If this happens, you should check all your tables with **myisamchk** (see Chapter 7, *MySQL Server Administration*), and test the queries in the MySQL log files to see whether one fails. If you find such a query, try first upgrading to the newest MySQL version. If this does not help, report a bug, see Section 1.6, “How to Report Bugs or Problems”.

If you have started **mysqld** with the `myisam_recover_options` system variable set, MySQL automatically checks and tries to repair `MyISAM` tables if they are marked as 'not closed properly' or 'crashed'. If this happens, MySQL writes an entry in the `hostname.err` file `'Warning: Checking table ...'` which is followed by `Warning: Repairing table` if the table needs to be repaired. If you get a lot of these errors, without **mysqld** having died unexpectedly just before, then something is wrong and needs to be investigated further. See Section 7.1.7, “Server Command Options”.

When the server detects `MyISAM` table corruption, it writes additional information to the error log, such as the name and line number of the source file, and the list of threads accessing the table. Example: `Got an error from thread_id=1, mi_dynrec.c:368`. This is useful information to include in bug reports.

It is not a good sign if **mysqld** did die unexpectedly, but in this case, you should not investigate the `Checking table...` messages, but instead try to find out why **mysqld** died.


#### 7.9.1.7 Making a Test Case If You Experience Table Corruption

The following procedure applies to `MyISAM` tables. For information about steps to take when encountering `InnoDB` table corruption, see Section 1.6, “How to Report Bugs or Problems”.

If you encounter corrupted `MyISAM` tables or if **mysqld** always fails after some update statements, you can test whether the issue is reproducible by doing the following:

1. Stop the MySQL daemon with [**mysqladmin shutdown**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program").

2. Make a backup of the tables to guard against the very unlikely case that the repair does something bad.

3. Check all tables with [**myisamchk -s database/\*.MYI**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility"). Repair any corrupted tables with [**myisamchk -r database/*`table`*.MYI**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility").

4. Make a second backup of the tables.
5. Remove (or move away) any old log files from the MySQL data directory if you need more space.

6. Start **mysqld** with the binary log enabled. If you want to find a statement that crashes **mysqld**, you should start the server with the general query log enabled as well. See Section 7.4.3, “The General Query Log”, and Section 7.4.4, “The Binary Log”.

7. When you have gotten a crashed table, stop the **mysqld** server.

8. Restore the backup.
9. Restart the **mysqld** server *without* the binary log enabled.

10. Re-execute the statements with [**mysqlbinlog binary-log-file | mysql**](mysqlbinlog.html "6.6.9 mysqlbinlog — Utility for Processing Binary Log Files"). The binary log is saved in the MySQL database directory with the name `hostname-bin.NNNNNN`.

11. If the tables are corrupted again or you can get **mysqld** to die with the above command, you have found a reproducible bug. FTP the tables and the binary log to our bugs database using the instructions given in Section 1.6, “How to Report Bugs or Problems”. If you are a support customer, you can use the MySQL Customer Support Center (<https://www.mysql.com/support/>) to alert the MySQL team about the problem and have it fixed as soon as possible.


### 7.9.2 Debugging a MySQL Client

To be able to debug a MySQL client with the integrated debug package, you should configure MySQL with `-DWITH_DEBUG=1`. See Section 2.8.7, “MySQL Source-Configuration Options”.

Before running a client, you should set the `MYSQL_DEBUG` environment variable:

```
$> MYSQL_DEBUG=d:t:O,/tmp/client.trace
$> export MYSQL_DEBUG
```

This causes clients to generate a trace file in `/tmp/client.trace`.

If you have problems with your own client code, you should attempt to connect to the server and run your query using a client that is known to work. Do this by running **mysql** in debugging mode (assuming that you have compiled MySQL with debugging on):

```
$> mysql --debug=d:t:O,/tmp/client.trace
```

This provides useful information in case you mail a bug report. See Section 1.6, “How to Report Bugs or Problems”.

If your client crashes at some 'legal' looking code, you should check that your `mysql.h` include file matches your MySQL library file. A very common mistake is to use an old `mysql.h` file from an old MySQL installation with new MySQL library.


### 7.9.3 The LOCK_ORDER Tool

The MySQL server is a multithreaded application that uses numerous internal locking and lock-related primitives, such as mutexes, rwlocks (including prlocks and sxlocks), conditions, and files. Within the server, the set of lock-related objects changes with implementation of new features and code refactoring for performance improvements. As with any multithreaded application that uses locking primitives, there is always a risk of encountering a deadlock during execution when multiple locks are held at once. For MySQL, the effect of a deadlock is catastrophic, causing a complete loss of service.

To enable detection of lock-acquisition deadlocks and enforcement that runtime execution is free of them, MySQL supports `LOCK_ORDER` tooling. This enables a lock-order dependency graph to be defined as part of server design, and server runtime checking to ensure that lock acquisition is acyclic and that execution paths comply with the graph.

This section provides information about using the `LOCK_ORDER` tool, but only at a basic level. For complete details, see the Lock Order section of the MySQL Server Doxygen documentation, available at https://dev.mysql.com/doc/index-other.html.

The `LOCK_ORDER` tool is intended for debugging the server, not for production use.

To use the `LOCK_ORDER` tool, follow this procedure:

1. Build MySQL from source, configuring it with the `-DWITH_LOCK_ORDER=ON` **CMake** option so that the build includes `LOCK_ORDER` tooling.

   Note

   With the `WITH_LOCK_ORDER` option enabled, MySQL builds require the **flex** program.

2. To run the server with the `LOCK_ORDER` tool enabled, enable the `lock_order` system variable at server startup. Several other system variables for `LOCK_ORDER` configuration are available as well.

3. For MySQL test suite operation, **mysql-test-run.pl** has a `--lock-order` option that controls whether to enable the `LOCK_ORDER` tool during test case execution.

The system variables described following configure operation of the `LOCK_ORDER` tool, assuming that MySQL has been built to include `LOCK_ORDER` tooling. The primary variable is `lock_order`, which indicates whether to enable the `LOCK_ORDER` tool at runtime:

* If `lock_order` is disabled (the default), no other `LOCK_ORDER` system variables have any effect.

* If `lock_order` is enabled, the other system variables configure which `LOCK_ORDER` features to enable.

Note

In general, it is intended that the `LOCK_ORDER` tool be configured by executing **mysql-test-run.pl** with the `--lock-order` option, and for **mysql-test-run.pl** to set `LOCK_ORDER` system variables to appropriate values.

All `LOCK_ORDER` system variables must be set at server startup. At runtime, their values are visible but cannot be changed.

Some system variables exist in pairs, such as `lock_order_debug_loop` and `lock_order_trace_loop`. For such pairs, the variables are distinguished as follows when the condition occurs with which they are associated:

* If the `_debug_` variable is enabled, a debug assertion is raised.

* If the `_trace_` variable is enabled, an error is printed to the logs.

**Table 7.13 LOCK_ORDER System Variable Summary**

<table frame="box" rules="all" summary="Reference for LOCK_ORDER system variables."><col style="width: 40%"/><col style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr><th scope="col">Variable Name</th> <th scope="col">Variable Type</th> <th scope="col">Variable Scope</th> </tr></thead><tbody><tr><th scope="row">lock_order</th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row">lock_order_debug_loop</th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row">lock_order_debug_missing_arc</th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row">lock_order_debug_missing_key</th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row">lock_order_debug_missing_unlock</th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row">lock_order_dependencies</th> <td>File name</td> <td>Global</td> </tr><tr><th scope="row">lock_order_extra_dependencies</th> <td>File name</td> <td>Global</td> </tr><tr><th scope="row">lock_order_output_directory</th> <td>Directory name</td> <td>Global</td> </tr><tr><th scope="row">lock_order_print_txt</th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row">lock_order_trace_loop</th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row">lock_order_trace_missing_arc</th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row">lock_order_trace_missing_key</th> <td>Boolean</td> <td>Global</td> </tr><tr><th scope="row">lock_order_trace_missing_unlock</th> <td>Boolean</td> <td>Global</td> </tr></tbody></table>

* `lock_order`

  <table frame="box" rules="all" summary="Properties for lock_order"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>lock_order</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Whether to enable the `LOCK_ORDER` tool at runtime. If `lock_order` is disabled (the default), no other `LOCK_ORDER` system variables have any effect. If `lock_order` is enabled, the other system variables configure which `LOCK_ORDER` features to enable.

  If `lock_order` is enabled, an error is raised if the server encounters a lock-acquisition sequence that is not declared in the lock-order graph.

* `lock_order_debug_loop`

  <table frame="box" rules="all" summary="Properties for lock_order_debug_loop"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order-debug-loop[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>lock_order_debug_loop</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Whether the `LOCK_ORDER` tool causes a debug assertion failure when it encounters a dependency that is flagged as a loop in the lock-order graph.

* `lock_order_debug_missing_arc`

  <table frame="box" rules="all" summary="Properties for lock_order_debug_missing_arc"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order-debug-missing-arc[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>lock_order_debug_missing_arc</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Whether the LOCK_ORDER tool causes a debug assertion failure when it encounters a dependency that is not declared in the lock-order graph.

* `lock_order_debug_missing_key`

  <table frame="box" rules="all" summary="Properties for lock_order_debug_missing_key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order-debug-missing-key[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>lock_order_debug_missing_key</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Whether the `LOCK_ORDER` tool causes a debug assertion failure when it encounters an object that is not properly instrumented with the Performance Schema.

* `lock_order_debug_missing_unlock`

  <table frame="box" rules="all" summary="Properties for lock_order_debug_missing_unlock"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order-debug-missing-unlock[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>lock_order_debug_missing_unlock</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Whether the `LOCK_ORDER` tool causes a debug assertion failure when it encounters a lock that is destroyed while still held.

* `lock_order_dependencies`

  <table frame="box" rules="all" summary="Properties for lock_order_dependencies"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order-dependencies=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>lock_order_dependencies</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>empty string</code></td> </tr></tbody></table>

  The path to the `lock_order_dependencies.txt` file that defines the server lock-order dependency graph.

  It is permitted to specify no dependencies. An empty dependency graph is used in this case.

* `lock_order_extra_dependencies`

  <table frame="box" rules="all" summary="Properties for lock_order_extra_dependencies"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order-extra-dependencies=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>lock_order_extra_dependencies</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>empty string</code></td> </tr></tbody></table>

  The path to a file containing additional dependencies for the lock-order dependency graph. This is useful to amend the primary server dependency graph, defined in the `lock_order_dependencies.txt` file, with additional dependencies describing the behavior of third party code. (The alternative is to modify `lock_order_dependencies.txt` itself, which is not encouraged.)

  If this variable is not set, no secondary file is used.

* `lock_order_output_directory`

  <table frame="box" rules="all" summary="Properties for lock_order_output_directory"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order-output-directory=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>lock_order_output_directory</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>empty string</code></td> </tr></tbody></table>

  The directory where the `LOCK_ORDER` tool writes its logs. If this variable is not set, the default is the current directory.

* `lock_order_print_txt`

  <table frame="box" rules="all" summary="Properties for lock_order_print_txt"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order-print-txt[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>lock_order_print_txt</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Whether the `LOCK_ORDER` tool performs a lock-order graph analysis and prints a textual report. The report includes any lock-acquisition cycles detected.

* `lock_order_trace_loop`

  <table frame="box" rules="all" summary="Properties for lock_order"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>lock_order</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

  Whether the `LOCK_ORDER` tool prints a trace in the log file when it encounters a dependency that is flagged as a loop in the lock-order graph.

* `lock_order_trace_missing_arc`

  <table frame="box" rules="all" summary="Properties for lock_order"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>lock_order</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

  Whether the `LOCK_ORDER` tool prints a trace in the log file when it encounters a dependency that is not declared in the lock-order graph.

* `lock_order_trace_missing_key`

  <table frame="box" rules="all" summary="Properties for lock_order"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>lock_order</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

  Whether the `LOCK_ORDER` tool prints a trace in the log file when it encounters an object that is not properly instrumented with the Performance Schema.

* `lock_order_trace_missing_unlock`

  <table frame="box" rules="all" summary="Properties for lock_order"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--lock-order[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>lock_order</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>3

  Whether the `LOCK_ORDER` tool prints a trace in the log file when it encounters a lock that is destroyed while still held.


### 7.9.4 The DBUG Package

The MySQL server and most MySQL clients are compiled with the `DBUG` package originally created by Fred Fish. When you have configured MySQL for debugging, this package makes it possible to get a trace file of what the program is doing. See Section 7.9.1.2, “Creating Trace Files”.

This section summarizes the argument values that you can specify in debug options on the command line for MySQL programs that have been built with debugging support.

The `DBUG` package can be used by invoking a program with the `--debug[=debug_options]` or `-# [debug_options]` option. If you specify the `--debug` or `-#` option without a *`debug_options`* value, most MySQL programs use a default value. The server default is `d:t:i:o,/tmp/mysqld.trace` on Unix and `d:t:i:O,\mysqld.trace` on Windows. The effect of this default is:

* `d`: Enable output for all debug macros
* `t`: Trace function calls and exits
* `i`: Add PID to output lines
* `o,/tmp/mysqld.trace`, `O,\mysqld.trace`: Set the debug output file.

Most client programs use a default *`debug_options`* value of `d:t:o,/tmp/program_name.trace`, regardless of platform.

Here are some example debug control strings as they might be specified on a shell command line:

```
--debug=d:t
--debug=d:f,main,subr1:F:L:t,20
--debug=d,input,output,files:n
--debug=d:t:i:O,\\mysqld.trace
```

For **mysqld**, it is also possible to change DBUG settings at runtime by setting the `debug` system variable. This variable has global and session values:

```
mysql> SET GLOBAL debug = 'debug_options';
mysql> SET SESSION debug = 'debug_options';
```

Changing the global `debug` value requires privileges sufficient to set global system variables. Changing the session `debug` value requires privileges sufficient to set restricted session system variables. See Section 7.1.9.1, “System Variable Privileges”.

The *`debug_options`* value is a sequence of colon-separated fields:

```
field_1:field_2:...:field_N
```

Each field within the value consists of a mandatory flag character, optionally preceded by a `+` or `-` character, and optionally followed by a comma-separated list of modifiers:

```
[+|-]flag[,modifier,modifier,...,modifier]
```

The following table describes the permitted flag characters. Unrecognized flag characters are silently ignored.

<table frame="all" summary="Descriptions of permitted debug_options flag characters."><col style="width: 8%"/><col style="width: 92%"/><thead><tr> <th><p> Flag </p></th> <th><p> Description </p></th> </tr></thead><tbody><tr> <td><p> <code>d</code> </p></td> <td><p> Enable output from <code>DBUG_<code>XXX</code></code> macros for the current state. May be followed by a list of keywords, which enables output only for the DBUG macros with that keyword. An empty list of keywords enables output for all macros. </p><p> In MySQL, common debug macro keywords to enable are <code>enter</code>, <code>exit</code>, <code>error</code>, <code>warning</code>, <code>info</code>, and <code>loop</code>. </p></td> </tr><tr> <td><p> <code>D</code> </p></td> <td><p> Delay after each debugger output line. The argument is the delay, in tenths of seconds, subject to machine capabilities. For example, <code>D,20</code> specifies a delay of two seconds. </p></td> </tr><tr> <td><p> <code>f</code> </p></td> <td><p> Limit debugging, tracing, and profiling to the list of named functions. An empty list enables all functions. The appropriate <code>d</code> or <code>t</code> flags must still be given; this flag only limits their actions if they are enabled. </p></td> </tr><tr> <td><p> <code>F</code> </p></td> <td><p> Identify the source file name for each line of debug or trace output. </p></td> </tr><tr> <td><p> <code>i</code> </p></td> <td><p> Identify the process with the PID or thread ID for each line of debug or trace output. </p></td> </tr><tr> <td><p> <code>L</code> </p></td> <td><p> Identify the source file line number for each line of debug or trace output. </p></td> </tr><tr> <td><p> <code>n</code> </p></td> <td><p> Print the current function nesting depth for each line of debug or trace output. </p></td> </tr><tr> <td><p> <code>N</code> </p></td> <td><p> Number each line of debug output. </p></td> </tr><tr> <td><p> <code>o</code> </p></td> <td><p> Redirect the debugger output stream to the specified file. The default output is <code>stderr</code>. </p></td> </tr><tr> <td><p> <code>O</code> </p></td> <td><p> Like <code>o</code>, but the file is really flushed between each write. When needed, the file is closed and reopened between each write. </p></td> </tr><tr> <td><p> <code>a</code> </p></td> <td><p> Like <code>o</code>, but opens for append. </p></td> </tr><tr> <td><p> <code>A</code> </p></td> <td><p> Like <code>O</code>, but opens for append. </p></td> </tr><tr> <td><p> <code>p</code> </p></td> <td><p> Limit debugger actions to specified processes. A process must be identified with the <code>DBUG_PROCESS</code> macro and match one in the list for debugger actions to occur. </p></td> </tr><tr> <td><p> <code>P</code> </p></td> <td><p> Print the current process name for each line of debug or trace output. </p></td> </tr><tr> <td><p> <code>r</code> </p></td> <td><p> When pushing a new state, do not inherit the previous state's function nesting level. Useful when the output is to start at the left margin. </p></td> </tr><tr> <td><p> <code>t</code> </p></td> <td><p> Enable function call/exit trace lines. May be followed by a list (containing only one modifier) giving a numeric maximum trace level, beyond which no output occurs for either debugging or tracing macros. The default is a compile time option. </p></td> </tr><tr> <td><p> <code>T</code> </p></td> <td><p> Print the current timestamp for every line of output. </p></td> </tr></tbody></table>

The leading `+` or `-` character and trailing list of modifiers are used for flag characters such as `d` or `f` that can enable a debug operation for all applicable modifiers or just some of them:

* With no leading `+` or `-`, the flag value is set to exactly the modifier list as given.

* With a leading `+` or `-`, the modifiers in the list are added to or subtracted from the current modifier list.

The following examples show how this works for the `d` flag. An empty `d` list enabled output for all debug macros. A nonempty list enables output only for the macro keywords in the list.

These statements set the `d` value to the modifier list as given:

```
mysql> SET debug = 'd';
mysql> SELECT @@debug;
+---------+
| @@debug |
+---------+
| d       |
+---------+
mysql> SET debug = 'd,error,warning';
mysql> SELECT @@debug;
+-----------------+
| @@debug         |
+-----------------+
| d,error,warning |
+-----------------+
```

A leading `+` or `-` adds to or subtracts from the current `d` value:

```
mysql> SET debug = '+d,loop';
mysql> SELECT @@debug;
+----------------------+
| @@debug              |
+----------------------+
| d,error,warning,loop |
+----------------------+

mysql> SET debug = '-d,error,loop';
mysql> SELECT @@debug;
+-----------+
| @@debug   |
+-----------+
| d,warning |
+-----------+
```

Adding to “all macros enabled” results in no change:

```
mysql> SET debug = 'd';
mysql> SELECT @@debug;
+---------+
| @@debug |
+---------+
| d       |
+---------+

mysql> SET debug = '+d,loop';
mysql> SELECT @@debug;
+---------+
| @@debug |
+---------+
| d       |
+---------+
```

Disabling all enabled macros disables the `d` flag entirely:

```
mysql> SET debug = 'd,error,loop';
mysql> SELECT @@debug;
+--------------+
| @@debug      |
+--------------+
| d,error,loop |
+--------------+

mysql> SET debug = '-d,error,loop';
mysql> SELECT @@debug;
+---------+
| @@debug |
+---------+
|         |
+---------+
```
