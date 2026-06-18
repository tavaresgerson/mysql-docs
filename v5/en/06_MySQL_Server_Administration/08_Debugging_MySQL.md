## 5.8 Debugging MySQL

This section describes debugging techniques that assist efforts to track down problems in MySQL.

### 5.8.1 Debugging a MySQL Server

If you are using some functionality that is very new in MySQL, you can try to run `mysqld` with the `--skip-new` option (which disables all new, potentially unsafe functionality). See Section B.3.3.3, “What to Do If MySQL Keeps Crashing”.

If `mysqld` does not want to start, verify that you have no `my.cnf` files that interfere with your setup! You can check your `my.cnf` arguments with **mysqld --print-defaults** and avoid using them by starting with **mysqld --no-defaults ...**.

If `mysqld` starts to eat up CPU or memory or if it “hangs,” you can use **mysqladmin processlist status** to find out if someone is executing a query that takes a long time. It may be a good idea to run **mysqladmin -i10 processlist status** in some window if you are experiencing performance problems or problems when new clients cannot connect.

The command **mysqladmin debug** dumps some information about locks in use, used memory and query usage to the MySQL log file. This may help solve some problems. This command also provides some useful information even if you have not compiled MySQL for debugging!

If the problem is that some tables are getting slower and slower you should try to optimize the table with `OPTIMIZE TABLE` or **myisamchk**. See Chapter 5, *MySQL Server Administration*. You should also check the slow queries with `EXPLAIN`.

You should also read the OS-specific section in this manual for problems that may be unique to your environment. See Section 2.1, “General Installation Guidance”.

#### 5.8.1.1 Compiling MySQL for Debugging

If you have some very specific problem, you can always try to debug MySQL. To do this you must configure MySQL with the `-DWITH_DEBUG=1` option. You can check whether MySQL was compiled with debugging by doing: **mysqld --help**. If the `--debug` flag is listed with the options then you have debugging enabled. **mysqladmin ver** also lists the `mysqld` version as **mysql ... --debug** in this case.

If `mysqld` stops crashing when you configure it with the `-DWITH_DEBUG=1` CMake option, you probably have found a compiler bug or a timing bug within MySQL. In this case, you can try to add `-g` using the `CMAKE_C_FLAGS` and `CMAKE_CXX_FLAGS` CMake options and not use `-DWITH_DEBUG=1`. If `mysqld` dies, you can at least attach to it with **gdb** or use **gdb** on the core file to find out what happened.

When you configure MySQL for debugging you automatically enable a lot of extra safety check functions that monitor the health of `mysqld`. If they find something “unexpected,” an entry is written to `stderr`, which `mysqld_safe` directs to the error log! This also means that if you are having some unexpected problems with MySQL and are using a source distribution, the first thing you should do is to configure MySQL for debugging. If you believe that you have found a bug, please use the instructions at Section 1.5, “How to Report Bugs or Problems”.

In the Windows MySQL distribution, `mysqld.exe` is by default compiled with support for trace files.

#### 5.8.1.2 Creating Trace Files

If the `mysqld` server does not start or it crashes easily, you can try to create a trace file to find the problem.

To do this, you must have a `mysqld` that has been compiled with debugging support. You can check this by executing `mysqld -V`. If the version number ends with `-debug`, it is compiled with support for trace files. (On Windows, the debugging server is named **mysqld-debug** rather than `mysqld`.)

Start the `mysqld` server with a trace log in `/tmp/mysqld.trace` on Unix or `\mysqld.trace` on Windows:

```sql
$> mysqld --debug
```

On Windows, you should also use the `--standalone` flag to not start `mysqld` as a service. In a console window, use this command:

```sql
C:\> mysqld-debug --debug --standalone
```

After this, you can use the `mysql.exe` command-line tool in a second console window to reproduce the problem. You can stop the `mysqld` server with **mysqladmin shutdown**.

The trace file can become **very large**! To generate a smaller trace file, you can use debugging options something like this:

**mysqld --debug=d,info,error,query,general,where:O,/tmp/mysqld.trace**

This only prints information with the most interesting tags to the trace file.

If you file a bug, please add only those lines from the trace file to the bug report that indicate where something seems to go wrong. If you cannot locate the wrong place, open a bug report and upload the whole trace file to the report, so that a MySQL developer can take a look at it. For instructions, see Section 1.5, “How to Report Bugs or Problems”.

The trace file is made with the DBUG package by Fred Fish. See Section 5.8.3, “The DBUG Package”.

#### 5.8.1.3 Using WER with PDB to create a Windows crashdump

Program Database files (with suffix `pdb`) are included in the **ZIP Archive Debug Binaries & Test Suite** distribution of MySQL. These files provide information for debugging your MySQL installation in the event of a problem. This is a separate download from the standard MSI or Zip file.

Note

The PDB files are available in a separate file labeled "ZIP Archive Debug Binaries & Test Suite".

The PDB file contains more detailed information about `mysqld` and other tools that enables more detailed trace and dump files to be created. You can use these with **WinDbg** or Visual Studio to debug `mysqld`.

For more information on PDB files, see Microsoft Knowledge Base Article 121366. For more information on the debugging options available, see Debugging Tools for Windows.

To use WinDbg, either install the full Windows Driver Kit (WDK) or install the standalone version.

Important

The `.exe` and `.pdb` files must be an exact match (both version number and MySQL server edition) or WinDBG complains while attempting to load the symbols.

1. To generate a minidump `mysqld.dmp`, enable the `core-file` option under the [mysqld] section in `my.ini`. Restart the MySQL server after making these changes.

2. Create a directory to store the generated files, such as `c:\symbols`

3. Determine the path to your **windbg.exe** executable using the Find GUI or from the command line, for example: `dir /s /b windbg.exe` -- a common default is *C:\Program Files\Debugging Tools for Windows (x64)\windbg.exe*

4. Launch `windbg.exe` giving it the paths to `mysqld-debug.exe`, `mysqld.pdb`, `mysqld.dmp`, and the source code. Alternatively, pass in each path from the WinDbg GUI. For example:

   ```sql
   windbg.exe -i "C:\mysql-5.7.44-winx64\bin\"^
    -z "C:\mysql-5.7.44-winx64\data\mysqld.dmp"^
    -srcpath "E:\ade\mysql_archives\5.7\5.7.44\mysql-5.7.44"^
    -y "C:\mysql-5.7.44-winx64\bin;SRV*c:\symbols*http://msdl.microsoft.com/download/symbols"^
    -v -n -c "!analyze -vvvvv"
   ```

   Note

   The `^` character and newline are removed by the Windows command line processor, so be sure the spaces remain intact.

#### 5.8.1.4 Debugging mysqld under gdb

On most systems you can also start `mysqld` from **gdb** to get more information if `mysqld` crashes.

With some older **gdb** versions on Linux you must use `run --one-thread` if you want to be able to debug `mysqld` threads. In this case, you can only have one thread active at a time.

NPTL threads (the new thread library on Linux) may cause problems while running `mysqld` under **gdb**. Some symptoms are:

* `mysqld` hangs during startup (before it writes `ready for connections`).

* `mysqld` crashes during a `pthread_mutex_lock()` or `pthread_mutex_unlock()` call.

In this case, you should set the following environment variable in the shell before starting **gdb**:

```sql
LD_ASSUME_KERNEL=2.4.1
export LD_ASSUME_KERNEL
```

When running `mysqld` under **gdb**, you should disable the stack trace with `--skip-stack-trace` to be able to catch segfaults within **gdb**.

Use the `--gdb` option to `mysqld` to install an interrupt handler for `SIGINT` (needed to stop `mysqld` with `^C` to set breakpoints) and disable stack tracing and core file handling.

It is very hard to debug MySQL under **gdb** if you do a lot of new connections the whole time as **gdb** does not free the memory for old threads. You can avoid this problem by starting `mysqld` with `thread_cache_size` set to a value equal to `max_connections`

+ 1. In most cases just using `--thread_cache_size=5'` helps a lot!

If you want to get a core dump on Linux if `mysqld` dies with a SIGSEGV signal, you can start `mysqld` with the `--core-file` option. This core file can be used to make a backtrace that may help you find out why `mysqld` died:

```sql
$> gdb mysqld core
gdb>   backtrace full
gdb>   quit
```

See Section B.3.3.3, “What to Do If MySQL Keeps Crashing”.

If you are using **gdb** on Linux, you should install a `.gdb` file, with the following information, in your current directory:

```sql
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

Here is an example how to debug `mysqld`:

```sql
$> gdb /usr/local/libexec/mysqld
gdb> run
...
backtrace full # Do this when mysqld crashes
```

Include the preceding output in a bug report, which you can file using the instructions in Section 1.5, “How to Report Bugs or Problems”.

If `mysqld` hangs, you can try to use some system tools like `strace` or `/usr/proc/bin/pstack` to examine where `mysqld` has hung.

```sql
strace /tmp/log libexec/mysqld
```

If you are using the Perl `DBI` interface, you can turn on debugging information by using the `trace` method or by setting the `DBI_TRACE` environment variable.

#### 5.8.1.5 Using a Stack Trace

On some operating systems, the error log contains a stack trace if `mysqld` dies unexpectedly. You can use this to find out where (and maybe why) `mysqld` died. See Section 5.4.2, “The Error Log”. To get a stack trace, you must not compile `mysqld` with the `-fomit-frame-pointer` option to gcc. See Section 5.8.1.1, “Compiling MySQL for Debugging”.

A stack trace in the error log looks something like this:

```sql
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

```sql
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

In the latter case, you can use the **resolve\_stack\_dump** utility to determine where `mysqld` died by using the following procedure:

1. Copy the numbers from the stack trace to a file, for example `mysqld.stack`. The numbers should not include the surrounding square brackets:

   ```sql
   0x9da402
   0x6648e9
   0x7f1a5af000f0
   0x7f1a5a10f0f2
   0x7412cb
   0x688354
   0x688494
   0x67a170
   0x67f0ad
   0x67fdf8
   0x6811b6
   0x66e05e
   ```

2. Make a symbol file for the `mysqld` server:

   ```sql
   $> nm -n libexec/mysqld > /tmp/mysqld.sym
   ```

   If `mysqld` is not linked statically, use the following command instead:

   ```sql
   $> nm -D -n libexec/mysqld > /tmp/mysqld.sym
   ```

   If you want to decode C++ symbols, use the `--demangle`, if available, to **nm**. If your version of **nm** does not have this option, you must use the **c++filt** command after the stack dump has been produced to demangle the C++ names.

3. Execute the following command:

   ```sql
   $> resolve_stack_dump -s /tmp/mysqld.sym -n mysqld.stack
   ```

   If you were not able to include demangled C++ names in your symbol file, process the **resolve\_stack\_dump** output using **c++filt**:

   ```sql
   $> resolve_stack_dump -s /tmp/mysqld.sym -n mysqld.stack | c++filt
   ```

   This prints out where `mysqld` died. If that does not help you find out why `mysqld` died, you should create a bug report and include the output from the preceding command with the bug report.

   However, in most cases it does not help us to have just a stack trace to find the reason for the problem. To be able to locate the bug or provide a workaround, in most cases we need to know the statement that killed `mysqld` and preferably a test case so that we can repeat the problem! See Section 1.5, “How to Report Bugs or Problems”.

Newer versions of `glibc` stack trace functions also print the address as relative to the object. On `glibc`-based systems (Linux), the trace for an unexpected exit within a plugin looks something like:

```sql
plugin/auth/auth_test_plugin.so(+0x9a6)[0x7ff4d11c29a6]
```

To translate the relative address (`+0x9a6`) into a file name and line number, use this command:

```sql
$> addr2line -fie auth_test_plugin.so 0x9a6
auth_test_plugin
mysql-trunk/plugin/auth/test_plugin.c:65
```

The **addr2line** utility is part of the `binutils` package on Linux.

On Solaris, the procedure is similar. The Solaris `printstack()` already prints relative addresses:

```sql
plugin/auth/auth_test_plugin.so:0x1510
```

To translate, use this command:

```sql
$> gaddr2line -fie auth_test_plugin.so 0x1510
mysql-trunk/plugin/auth/test_plugin.c:88
```

Windows already prints the address, function name and line:

```sql
000007FEF07E10A4 auth_test_plugin.dll!auth_test_plugin()[test_plugin.c:72]
```

#### 5.8.1.6 Using Server Logs to Find Causes of Errors in mysqld

Note that before starting `mysqld` with the general query log enabled, you should check all your tables with **myisamchk**. See Chapter 5, *MySQL Server Administration*.

If `mysqld` dies or hangs, you should start `mysqld` with the general query log enabled. See Section 5.4.3, “The General Query Log”. When `mysqld` dies again, you can examine the end of the log file for the query that killed `mysqld`.

If you use the default general query log file, the log is stored in the database directory as `host_name.log` In most cases it is the last query in the log file that killed `mysqld`, but if possible you should verify this by restarting `mysqld` and executing the found query from the **mysql** command-line tools. If this works, you should also test all complicated queries that did not complete.

You can also try the command `EXPLAIN` on all `SELECT` statements that takes a long time to ensure that `mysqld` is using indexes properly. See Section 13.8.2, “EXPLAIN Statement”.

You can find the queries that take a long time to execute by starting `mysqld` with the slow query log enabled. See Section 5.4.5, “The Slow Query Log”.

If you find the text `mysqld restarted` in the error log (normally a file named `host_name.err`) you probably have found a query that causes `mysqld` to fail. If this happens, you should check all your tables with **myisamchk** (see Chapter 5, *MySQL Server Administration*), and test the queries in the MySQL log files to see whether one fails. If you find such a query, try first upgrading to the newest MySQL version. If this does not help, report a bug, see Section 1.5, “How to Report Bugs or Problems”.

If you have started `mysqld` with the `myisam_recover_options` system variable set, MySQL automatically checks and tries to repair `MyISAM` tables if they are marked as 'not closed properly' or 'crashed'. If this happens, MySQL writes an entry in the `hostname.err` file `'Warning: Checking table ...'` which is followed by `Warning: Repairing table` if the table needs to be repaired. If you get a lot of these errors, without `mysqld` having died unexpectedly just before, then something is wrong and needs to be investigated further. See Section 5.1.6, “Server Command Options”.

When the server detects `MyISAM` table corruption, it writes additional information to the error log, such as the name and line number of the source file, and the list of threads accessing the table. Example: `Got an error from thread_id=1, mi_dynrec.c:368`. This is useful information to include in bug reports.

It is not a good sign if `mysqld` did die unexpectedly, but in this case, you should not investigate the `Checking table...` messages, but instead try to find out why `mysqld` died.

#### 5.8.1.7 Making a Test Case If You Experience Table Corruption

The following procedure applies to `MyISAM` tables. For information about steps to take when encountering `InnoDB` table corruption, see Section 1.5, “How to Report Bugs or Problems”.

If you encounter corrupted `MyISAM` tables or if `mysqld` always fails after some update statements, you can test whether the issue is reproducible by doing the following:

1. Stop the MySQL daemon with **mysqladmin shutdown**.

2. Make a backup of the tables to guard against the very unlikely case that the repair does something bad.

3. Check all tables with **myisamchk -s database/\*.MYI**. Repair any corrupted tables with **myisamchk -r database/*`table`*.MYI**.

4. Make a second backup of the tables.
5. Remove (or move away) any old log files from the MySQL data directory if you need more space.

6. Start `mysqld` with the binary log enabled. If you want to find a statement that crashes `mysqld`, you should start the server with the general query log enabled as well. See Section 5.4.3, “The General Query Log”, and Section 5.4.4, “The Binary Log”.

7. When you have gotten a crashed table, stop the `mysqld` server.

8. Restore the backup.
9. Restart the `mysqld` server *without* the binary log enabled.

10. Re-execute the statements with **mysqlbinlog binary-log-file | mysql**. The binary log is saved in the MySQL database directory with the name `hostname-bin.NNNNNN`.

11. If the tables are corrupted again or you can get `mysqld` to die with the above command, you have found a reproducible bug. FTP the tables and the binary log to our bugs database using the instructions given in Section 1.5, “How to Report Bugs or Problems”. If you are a support customer, you can use the MySQL Customer Support Center (<https://www.mysql.com/support/>) to alert the MySQL team about the problem and have it fixed as soon as possible.

### 5.8.2 Debugging a MySQL Client

To be able to debug a MySQL client with the integrated debug package, you should configure MySQL with `-DWITH_DEBUG=1`. See Section 2.8.7, “MySQL Source-Configuration Options”.

Before running a client, you should set the `MYSQL_DEBUG` environment variable:

```sql
$> MYSQL_DEBUG=d:t:O,/tmp/client.trace
$> export MYSQL_DEBUG
```

This causes clients to generate a trace file in `/tmp/client.trace`.

If you have problems with your own client code, you should attempt to connect to the server and run your query using a client that is known to work. Do this by running **mysql** in debugging mode (assuming that you have compiled MySQL with debugging on):

```sql
$> mysql --debug=d:t:O,/tmp/client.trace
```

This provides useful information in case you mail a bug report. See Section 1.5, “How to Report Bugs or Problems”.

If your client crashes at some 'legal' looking code, you should check that your `mysql.h` include file matches your MySQL library file. A very common mistake is to use an old `mysql.h` file from an old MySQL installation with new MySQL library.

### 5.8.3 The DBUG Package

The MySQL server and most MySQL clients are compiled with the `DBUG` package originally created by Fred Fish. When you have configured MySQL for debugging, this package makes it possible to get a trace file of what the program is doing. See Section 5.8.1.2, “Creating Trace Files”.

This section summarizes the argument values that you can specify in debug options on the command line for MySQL programs that have been built with debugging support.

The `DBUG` package can be used by invoking a program with the `--debug[=debug_options]` or `-# [debug_options]` option. If you specify the `--debug` or `-#` option without a *`debug_options`* value, most MySQL programs use a default value. The server default is `d:t:i:o,/tmp/mysqld.trace` on Unix and `d:t:i:O,\mysqld.trace` on Windows. The effect of this default is:

* `d`: Enable output for all debug macros
* `t`: Trace function calls and exits
* `i`: Add PID to output lines
* `o,/tmp/mysqld.trace`, `O,\mysqld.trace`: Set the debug output file.

Most client programs use a default *`debug_options`* value of `d:t:o,/tmp/program_name.trace`, regardless of platform.

Here are some example debug control strings as they might be specified on a shell command line:

```sql
--debug=d:t
--debug=d:f,main,subr1:F:L:t,20
--debug=d,input,output,files:n
--debug=d:t:i:O,\\mysqld.trace
```

For `mysqld`, it is also possible to change `DBUG` settings at runtime by setting the `debug` system variable. This variable has global and session values:

```sql
mysql> SET GLOBAL debug = 'debug_options';
mysql> SET SESSION debug = 'debug_options';
```

Changing the global `debug` value requires privileges sufficient to set global system variables. Changing the session `debug` value requires privileges sufficient to set restricted session system variables. See Section 5.1.8.1, “System Variable Privileges”.

The *`debug_options`* value is a sequence of colon-separated fields:

```sql
field_1:field_2:...:field_N
```

Each field within the value consists of a mandatory flag character, optionally preceded by a `+` or `-` character, and optionally followed by a comma-separated list of modifiers:

```sql
[+|-]flag[,modifier,modifier,...,modifier]
```

The following table describes the permitted flag characters. Unrecognized flag characters are silently ignored.

<table frame="all" summary="Descriptions of permitted debug_options flag characters.">
  <col style="width: 8%"/>
  <col style="width: 92%"/>
  <thead>
    <tr>
      <th>Flag*</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p> <code>d</code> </p>
      </td>
      <td>
        <p> Enable output from <code>DBUG_<em class="replaceable"><code>XXX</code></em></code> macros for the current state. May be followed by a list of keywords, which enables output only for the <code>DBUG</code> macros with that keyword. An empty list of keywords enables output for all macros. </p>
        <p> In MySQL, common debug macro keywords to enable are <code>enter</code>, <code>exit</code>, <code>error</code>, <code>warning</code>, <code>info</code>, and <code>loop</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <p> <code>D</code> </p>
      </td>
      <td>
        <p> Delay after each debugger output line. The argument is the delay, in tenths of seconds, subject to machine capabilities. For example, <code>D,20</code> specifies a delay of two seconds. </p>
      </td>
    </tr>
    <tr>
      <td>
        <p> <code>f</code> </p>
      </td>
      <td>
        <p> Limit debugging, tracing, and profiling to the list of named functions. An empty list enables all functions. The appropriate <code>d</code> or <code>t</code> flags must still be given; this flag only limits their actions if they are enabled. </p>
      </td>
    </tr>
    <tr>
      <td>
        <p> <code>F</code> </p>
      </td>
      <td>
        <p> Identify the source file name for each line of debug or trace output. </p>
      </td>
    </tr>
    <tr>
      <td>
        <p> <code>i</code> </p>
      </td>
      <td>
        <p> Identify the process with the PID or thread ID for each line of debug or trace output. </p>
      </td>
    </tr>
    <tr>
      <td>
        <p> <code>L</code> </p>
      </td>
      <td>
        <p> Identify the source file line number for each line of debug or trace output. </p>
      </td>
    </tr>
    <tr>
      <td>
        <p> <code>n</code> </p>
      </td>
      <td>
        <p> Print the current function nesting depth for each line of debug or trace output. </p>
      </td>
    </tr>
    <tr>
      <td>
        <p> <code>N</code> </p>
      </td>
      <td>
        <p> Number each line of debug output. </p>
      </td>
    </tr>
    <tr>
      <td>
        <p> <code>o</code> </p>
      </td>
      <td>
        <p> Redirect the debugger output stream to the specified file. The default output is <code>stderr</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <p> <code>O</code> </p>
      </td>
      <td>
        <p> Like <code>o</code>, but the file is really flushed between each write. When needed, the file is closed and reopened between each write. </p>
      </td>
    </tr>
    <tr>
      <td>
        <p> <code>a</code> </p>
      </td>
      <td>
        <p> Like <code>o</code>, but opens for append. </p>
      </td>
    </tr>
    <tr>
      <td>
        <p> <code>A</code> </p>
      </td>
      <td>
        <p> Like <code>O</code>, but opens for append. </p>
      </td>
    </tr>
    <tr>
      <td>
        <p> <code>p</code> </p>
      </td>
      <td>
        <p> Limit debugger actions to specified processes. A process must be identified with the <code>DBUG_PROCESS</code> macro and match one in the list for debugger actions to occur. </p>
      </td>
    </tr>
    <tr>
      <td>
        <p> <code>P</code> </p>
      </td>
      <td>
        <p> Print the current process name for each line of debug or trace output. </p>
      </td>
    </tr>
    <tr>
      <td>
        <p> <code>r</code> </p>
      </td>
      <td>
        <p> When pushing a new state, do not inherit the previous state's function nesting level. Useful when the output is to start at the left margin. </p>
      </td>
    </tr>
    <tr>
      <td>
        <p> <code>t</code> </p>
      </td>
      <td>
        <p> Enable function call/exit trace lines. May be followed by a list (containing only one modifier) giving a numeric maximum trace level, beyond which no output occurs for either debugging or tracing macros. The default is a compile time option. </p>
      </td>
    </tr>
    <tr>
      <td>
        <p> <code>T</code> </p>
      </td>
      <td>
        <p> Print the current timestamp for every line of output. </p>
      </td>
    </tr>
  </tbody>
</table>

The leading `+` or `-` character and trailing list of modifiers are used for flag characters such as `d` or `f` that can enable a debug operation for all applicable modifiers or just some of them:

* With no leading `+` or `-`, the flag value is set to exactly the modifier list as given.

* With a leading `+` or `-`, the modifiers in the list are added to or subtracted from the current modifier list.

The following examples show how this works for the `d` flag. An empty `d` list enabled output for all debug macros. A nonempty list enables output only for the macro keywords in the list.

These statements set the `d` value to the modifier list as given:

```sql
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

```sql
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

```sql
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

```sql
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

### 5.8.4 Tracing mysqld Using DTrace

5.8.4.1 mysqld DTrace Probe Reference

Support for DTrace is deprecated in MySQL 5.7 and is removed in MySQL 8.0.

The DTrace probes in the MySQL server are designed to provide information about the execution of queries within MySQL and the different areas of the system being utilized during that process. The organization and triggering of the probes means that the execution of an entire query can be monitored with one level of probes (`query-start` and `query-done`) but by monitoring other probes you can get successively more detailed information about the execution of the query in terms of the locks used, sort methods and even row-by-row and storage-engine level execution information.

The DTrace probes are organized so that you can follow the entire query process, from the point of connection from a client, through the query execution, row-level operations, and back out again. You can think of the probes as being fired within a specific sequence during a typical client connect/execute/disconnect sequence, as shown in the following figure.

**Figure 5.1 DTrace Probe Sequence**

![Example of a DTrace probe sequence during a typical client connect, execute, disconnect sequence.](images/dtrace-groups.png)

Global information is provided in the arguments to the DTrace probes at various levels. Global information, that is, the connection ID and user/host and where relevant the query string, is provided at key levels (`connection-start`, `command-start`, `query-start`, and `query-exec-start`). As you go deeper into the probes, it is assumed either you are only interested in the individual executions (row-level probes provide information on the database and table name only), or that you intend to combine the row-level probes with the notional parent probes to provide the information about a specific query. Examples of this are given as the format and arguments of each probe are provided.

MySQL includes support for DTrace probes on these platforms:

* Solaris 10 Update 5 (Solaris 5/08) on SPARC, x86 and x86\_64 platforms

* OS X / macOS 10.4 and higher
* Oracle Linux 6 and higher with UEK kernel (as of MySQL 5.7.5)

Enabling the probes should be automatic on these platforms. To explicitly enable or disable the probes during building, use the `-DENABLE_DTRACE=1` or `-DENABLE_DTRACE=0` option to **CMake**.

If a non-Solaris platform includes DTrace support, building `mysqld` on that platform includes DTrace support.

#### Additional Resources

* For more information on DTrace and writing DTrace scripts, read the DTrace User Guide.

* For an introduction to DTrace, see the MySQL Dev Zone article Getting started with DTracing MySQL.

#### 5.8.4.1 mysqld DTrace Probe Reference

MySQL supports the following static probes, organized into groups of functionality.

**Table 5.5 MySQL DTrace Probes**

<table>
  <thead>
    <tr>
      <th>Group</th>
      <th>Probes</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Connection</td>
      <td><code>connection-start</code>, <code>connection-done</code></td>
    </tr>
    <tr>
      <td>Command</td>
      <td><code>command-start</code>, <code>command-done</code></td>
    </tr>
    <tr>
      <td>Query</td>
      <td><code>query-start</code>, <code>query-done</code></td>
    </tr>
    <tr>
      <td>Query Parsing</td>
      <td><code>query-parse-start</code>, <code>query-parse-done</code></td>
    </tr>
    <tr>
      <td>Query Cache</td>
      <td><code>query-cache-hit</code>, <code>query-cache-miss</code></td>
    </tr>
    <tr>
      <td>Query Execution</td>
      <td><code>query-exec-start</code>, <code>query-exec-done</code></td>
    </tr>
    <tr>
      <td>Row Level</td>
      <td><code>insert-row-start</code>, <code>insert-row-done</code></td>
    </tr>
    <tr>
      <td></td>
      <td><code>update-row-start</code>, <code>update-row-done</code></td>
    </tr>
    <tr>
      <td></td>
      <td><code>delete-row-start</code>, <code>delete-row-done</code></td>
    </tr>
    <tr>
      <td>Row Reads</td>
      <td><code>read-row-start</code>, <code>read-row-done</code></td>
    </tr>
    <tr>
      <td>Index Reads</td>
      <td><code>index-read-row-start</code>, <code>index-read-row-done</code></td>
    </tr>
    <tr>
      <td>Lock</td>
      <td><code>handler-rdlock-start</code>, <code>handler-rdlock-done</code></td>
    </tr>
    <tr>
      <td></td>
      <td><code>handler-wrlock-start</code>, <code>handler-wrlock-done</code></td>
    </tr>
    <tr>
      <td></td>
      <td><code>handler-unlock-start</code>, <code>handler-unlock-done</code></td>
    </tr>
    <tr>
      <td>Filesort</td>
      <td><code>filesort-start</code>, <code>filesort-done</code></td>
    </tr>
    <tr>
      <td>Statement</td>
      <td><code>select-start</code>, <code>select-done</code></td>
    </tr>
    <tr>
      <td></td>
      <td><code>insert-start</code>, <code>insert-done</code></td>
    </tr>
    <tr>
      <td></td>
      <td><code>insert-select-start</code>, <code>insert-select-done</code></td>
    </tr>
    <tr>
      <td></td>
      <td><code>update-start</code>, <code>update-done</code></td>
    </tr>
    <tr>
      <td></td>
      <td><code>multi-update-start</code>, <code>multi-update-done</code></td>
    </tr>
    <tr>
      <td></td>
      <td><code>delete-start</code>, <code>delete-done</code></td>
    </tr>
    <tr>
      <td></td>
      <td><code>multi-delete-start</code>, <code>multi-delete-done</code></td>
    </tr>
    <tr>
      <td>Network</td>
      <td><code>net-read-start</code>, <code>net-read-done</code>, <code>net-write-start</code>, <code>net-write-done</code></td>
    </tr>
    <tr>
      <td>Keycache</td>
      <td><code>keycache-read-start</code>, <code>keycache-read-block</code>, <code>keycache-read-done</code>, <code>keycache-read-hit</code>, <code>keycache-read-miss</code>, <code>keycache-write-start</code>, <code>keycache-write-block</code>, <code>keycache-write-done</code></td>
    </tr>
  </tbody>
</table>

Note

When extracting the argument data from the probes, each argument is available as `argN`, starting with `arg0`. To identify each argument within the definitions they are provided with a descriptive name, but you must access the information using the corresponding `argN` parameter.

##### 5.8.4.1.1 Connection Probes

The `connection-start` and `connection-done` probes enclose a connection from a client, regardless of whether the connection is through a socket or network connection.

```sql
connection-start(connectionid, user, host)
connection-done(status, connectionid)
```

* `connection-start`: Triggered after a connection and successful login/authentication have been completed by a client. The arguments contain the connection information:

  + `connectionid`: An `unsigned long` containing the connection ID. This is the same as the process ID shown as the `Id` value in the output from `SHOW PROCESSLIST`.

  + `user`: The username used when authenticating. The value is blank for the anonymous user.

  + `host`: The host of the client connection. For a connection made using Unix sockets, the value is blank.

* `connection-done`: Triggered just as the connection to the client has been closed. The arguments are:

  + `status`: The status of the connection when it was closed. A logout operation has a value of 0; any other termination of the connection has a nonzero value.

  + `connectionid`: The connection ID of the connection that was closed.

The following D script quantifies and summarizes the average duration of individual connections, and provides a count, dumping the information every 60 seconds:

```sql
#!/usr/sbin/dtrace -s


mysql*:::connection-start
{
  self->start = timestamp;
}

mysql*:::connection-done
/self->start/
{
  @ = quantize(((timestamp - self->start)/1000000));
  self->start = 0;
}

tick-60s
{
  printa(@);
}
```

When executed on a server with a large number of clients you might see output similar to this:

```sql
  1  57413                        :tick-60s

           value  ------------- Distribution ------------- count
              -1 |                                         0
               0 |@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 30011
               1 |                                         59
               2 |                                         5
               4 |                                         20
               8 |                                         29
              16 |                                         18
              32 |                                         27
              64 |                                         30
             128 |                                         11
             256 |                                         10
             512 |                                         1
            1024 |                                         6
            2048 |                                         8
            4096 |                                         9
            8192 |                                         8
           16384 |                                         2
           32768 |                                         1
           65536 |                                         1
          131072 |                                         0
          262144 |                                         1
524288 |                                         0
```

##### 5.8.4.1.2 Command Probes

The command probes are executed before and after a client command is executed, including any SQL statement that might be executed during that period. Commands include operations such as the initialization of the DB, use of the `COM_CHANGE_USER` operation (supported by the MySQL protocol), and manipulation of prepared statements. Many of these commands are used only by the MySQL client API from various connectors such as PHP and Java.

```sql
command-start(connectionid, command, user, host)
command-done(status)
```

* `command-start`: Triggered when a command is submitted to the server.

  + `connectionid`: The connection ID of the client executing the command.

  + `command`: An integer representing the command that was executed. Possible values are shown in the following table.

<table summary="Possible command-start command values and a name and description for each.">
  <thead>
    <tr>
      <th>Value*</th>
      <th>Name*</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>00</th>
      <td>COM_SLEEP</td>
      <td>Internal thread state</td>
    </tr>
    <tr>
      <th>01</th>
      <td>COM_QUIT</td>
      <td>Close connection</td>
    </tr>
    <tr>
      <th>02</th>
      <td>COM_INIT_DB</td>
      <td>Select database (<code>USE ...</code>)</td>
    </tr>
    <tr>
      <th>03</th>
      <td>COM_QUERY</td>
      <td>Execute a query</td>
    </tr>
    <tr>
      <th>04</th>
      <td>COM_FIELD_LIST</td>
      <td>Get a list of fields</td>
    </tr>
    <tr>
      <th>05</th>
      <td>COM_CREATE_DB</td>
      <td>Create a database (deprecated)</td>
    </tr>
    <tr>
      <th>06</th>
      <td>COM_DROP_DB</td>
      <td>Drop a database (deprecated)</td>
    </tr>
    <tr>
      <th>07</th>
      <td>COM_REFRESH</td>
      <td>Refresh connection</td>
    </tr>
    <tr>
      <th>08</th>
      <td>COM_SHUTDOWN</td>
      <td>Shutdown server</td>
    </tr>
    <tr>
      <th>09</th>
      <td>COM_STATISTICS</td>
      <td>Get statistics</td>
    </tr>
    <tr>
      <th>10</th>
      <td>COM_PROCESS_INFO</td>
      <td>Get processes (<code>SHOW PROCESSLIST</code>)</td>
    </tr>
    <tr>
      <th>11</th>
      <td>COM_CONNECT</td>
      <td>Initialize connection</td>
    </tr>
    <tr>
      <th>12</th>
      <td>COM_PROCESS_KILL</td>
      <td>Kill process</td>
    </tr>
    <tr>
      <th>13</th>
      <td>COM_DEBUG</td>
      <td>Get debug information</td>
    </tr>
    <tr>
      <th>14</th>
      <td>COM_PING</td>
      <td>Ping</td>
    </tr>
    <tr>
      <th>15</th>
      <td>COM_TIME</td>
      <td>Internal thread state</td>
    </tr>
    <tr>
      <th>16</th>
      <td>COM_DELAYED_INSERT</td>
      <td>Internal thread state</td>
    </tr>
    <tr>
      <th>17</th>
      <td>COM_CHANGE_USER</td>
      <td>Change user</td>
    </tr>
    <tr>
      <th>18</th>
      <td>COM_BINLOG_DUMP</td>
      <td>Used by a replica or <strong>mysqlbinlog</strong> to initiate a binary log read</td>
    </tr>
    <tr>
      <th>19</th>
      <td>COM_TABLE_DUMP</td>
      <td>Used by a replica to get the source table information</td>
    </tr>
    <tr>
      <th>20</th>
      <td>COM_CONNECT_OUT</td>
      <td>Used by a replica to log a connection to the server</td>
    </tr>
    <tr>
      <th>21</th>
      <td>COM_REGISTER_SLAVE</td>
      <td>Used by a replica during registration</td>
    </tr>
    <tr>
      <th>22</th>
      <td>COM_STMT_PREPARE</td>
      <td>Prepare a statement</td>
    </tr>
    <tr>
      <th>23</th>
      <td>COM_STMT_EXECUTE</td>
      <td>Execute a statement</td>
    </tr>
    <tr>
      <th>24</th>
      <td>COM_STMT_SEND_LONG_DATA</td>
      <td>Used by a client when requesting extended data</td>
    </tr>
    <tr>
      <th>25</th>
      <td>COM_STMT_CLOSE</td>
      <td>Close a prepared statement</td>
    </tr>
    <tr>
      <th>26</th>
      <td>COM_STMT_RESET</td>
      <td>Reset a prepared statement</td>
    </tr>
    <tr>
      <th>27</th>
      <td>COM_SET_OPTION</td>
      <td>Set a server option</td>
    </tr>
    <tr>
      <th>28</th>
      <td>COM_STMT_FETCH</td>
      <td>Fetch a prepared statement</td>
    </tr>
  </tbody>
</table>

  + `user`: The user executing the command.

  + `host`: The client host.
* `command-done`: Triggered when the command execution completes. The `status` argument contains 0 if the command executed successfully, or 1 if the statement was terminated before normal completion.

The `command-start` and `command-done` probes are best used when combined with the statement probes to get an idea of overall execution time.

##### 5.8.4.1.3 Query Probes

The `query-start` and `query-done` probes are triggered when a specific query is received by the server and when the query has been completed and the information has been successfully sent to the client.

```sql
query-start(query, connectionid, database, user, host)
query-done(status)
```

* `query-start`: Triggered after the query string has been received from the client. The arguments are:

  + `query`: The full text of the submitted query.

  + `connectionid`: The connection ID of the client that submitted the query. The connection ID equals the connection ID returned when the client first connects and the `Id` value in the output from `SHOW PROCESSLIST`.

  + `database`: The database name on which the query is being executed.

  + `user`: The username used to connect to the server.

  + `host`: The hostname of the client.
* `query-done`: Triggered once the query has been executed and the information has been returned to the client. The probe includes a single argument, `status`, which returns 0 when the query is successfully executed and 1 if there was an error.

You can get a simple report of the execution time for each query using the following D script:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

dtrace:::BEGIN
{
   printf("%-20s %-20s %-40s %-9s\n", "Who", "Database", "Query", "Time(ms)");
}

mysql*:::query-start
{
   self->query = copyinstr(arg0);
   self->connid = arg1;
   self->db    = copyinstr(arg2);
   self->who   = strjoin(copyinstr(arg3),strjoin("@",copyinstr(arg4)));
   self->querystart = timestamp;
}

mysql*:::query-done
{
   printf("%-20s %-20s %-40s %-9d\n",self->who,self->db,self->query,
          (timestamp - self->querystart) / 1000000);
}
```

When executing the above script you should get a basic idea of the execution time of your queries:

```sql
$> ./query.d
Who                  Database             Query                                    Time(ms)
root@localhost       test                 select * from t1 order by i limit 10     0
root@localhost       test                 set global query_cache_size=0            0
root@localhost       test                 select * from t1 order by i limit 10     776
root@localhost       test                 select * from t1 order by i limit 10     773
root@localhost       test                 select * from t1 order by i desc limit 10 795
```

##### 5.8.4.1.4 Query Parsing Probes

The query parsing probes are triggered before the original SQL statement is parsed and when the parsing of the statement and determination of the execution model required to process the statement has been completed:

```sql
query-parse-start(query)
query-parse-done(status)
```

* `query-parse-start`: Triggered just before the statement is parsed by the MySQL query parser. The single argument, `query`, is a string containing the full text of the original query.

* `query-parse-done`: Triggered when the parsing of the original statement has been completed. The `status` is an integer describing the status of the operation. A `0` indicates that the query was successfully parsed. A `1` indicates that the parsing of the query failed.

For example, you could monitor the execution time for parsing a given query using the following D script:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

mysql*:::query-parse-start
{
   self->parsestart = timestamp;
   self->parsequery = copyinstr(arg0);
}

mysql*:::query-parse-done
/arg0 == 0/
{
   printf("Parsing %s: %d microseconds\n", self->parsequery,((timestamp - self->parsestart)/1000));
}

mysql*:::query-parse-done
/arg0 != 0/
{
   printf("Error parsing %s: %d microseconds\n", self->parsequery,((timestamp - self->parsestart)/1000));
}
```

In the above script a predicate is used on `query-parse-done` so that different output is generated based on the status value of the probe.

When running the script and monitoring the execution:

```sql
$> ./query-parsing.d
Error parsing select from t1 join (t2) on (t1.i = t2.i) order by t1.s,t1.i limit 10: 36 ms
Parsing select * from t1 join (t2) on (t1.i = t2.i) order by t1.s,t1.i limit 10: 176 ms
```

##### 5.8.4.1.5 Query Cache Probes

The query cache probes are fired when executing any query. The `query-cache-hit` query is triggered when a query exists in the query cache and can be used to return the query cache information. The arguments contain the original query text and the number of rows returned from the query cache for the query. If the query is not within the query cache, or the query cache is not enabled, then the `query-cache-miss` probe is triggered instead.

```sql
query-cache-hit(query, rows)
query-cache-miss(query)
```

* `query-cache-hit`: Triggered when the query has been found within the query cache. The first argument, `query`, contains the original text of the query. The second argument, `rows`, is an integer containing the number of rows in the cached query.

* `query-cache-miss`: Triggered when the query is not found within the query cache. The first argument, `query`, contains the original text of the query.

The query cache probes are best combined with a probe on the main query so that you can determine the differences in times between using or not using the query cache for specified queries. For example, in the following D script, the query and query cache information are combined into the information output during monitoring:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

dtrace:::BEGIN
{
   printf("%-20s %-20s %-40s %2s %-9s\n", "Who", "Database", "Query", "QC", "Time(ms)");
}

mysql*:::query-start
{
   self->query = copyinstr(arg0);
   self->connid = arg1;
   self->db    = copyinstr(arg2);
   self->who   = strjoin(copyinstr(arg3),strjoin("@",copyinstr(arg4)));
   self->querystart = timestamp;
   self->qc = 0;
}

mysql*:::query-cache-hit
{
   self->qc = 1;
}

mysql*:::query-cache-miss
{
   self->qc = 0;
}

mysql*:::query-done
{
   printf("%-20s %-20s %-40s %-2s %-9d\n",self->who,self->db,self->query,(self->qc ? "Y" : "N"),
          (timestamp - self->querystart) / 1000000);
}
```

When executing the script you can see the effects of the query cache. Initially the query cache is disabled. If you set the query cache size and then execute the query multiple times you should see that the query cache is being used to return the query data:

```sql
$> ./query-cache.d
root@localhost       test                 select * from t1 order by i limit 10     N  1072
root@localhost                            set global query_cache_size=262144       N  0
root@localhost       test                 select * from t1 order by i limit 10     N  781
root@localhost       test                 select * from t1 order by i limit 10     Y  0
```

##### 5.8.4.1.6 Query Execution Probes

The query execution probe is triggered when the actual execution of the query starts, after the parsing and checking the query cache but before any privilege checks or optimization. By comparing the difference between the start and done probes you can monitor the time actually spent servicing the query (instead of just handling the parsing and other elements of the query).

```sql
query-exec-start(query, connectionid, database, user, host, exec_type)
query-exec-done(status)
```

Note

The information provided in the arguments for `query-start` and `query-exec-start` are almost identical and designed so that you can choose to monitor either the entire query process (using `query-start`) or only the execution (using `query-exec-start`) while exposing the core information about the user, client, and query being executed.

* `query-exec-start`: Triggered when the execution of a individual query is started. The arguments are:

  + `query`: The full text of the submitted query.

  + `connectionid`: The connection ID of the client that submitted the query. The connection ID equals the connection ID returned when the client first connects and the `Id` value in the output from `SHOW PROCESSLIST`.

  + `database`: The database name on which the query is being executed.

  + `user`: The username used to connect to the server.

  + `host`: The hostname of the client.
  + `exec_type`: The type of execution. Execution types are determined based on the contents of the query and where it was submitted. The values for each type are shown in the following table.

    <table summary="exec_type values."><col style="width: 10%"/><col style="width: 90%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>Executed query from sql_parse, top-level query.</td> </tr><tr> <td>1</td> <td>Executed prepared statement</td> </tr><tr> <td>2</td> <td>Executed cursor statement</td> </tr><tr> <td>3</td> <td>Executed query in stored procedure</td> </tr></tbody></table>

* `query-exec-done`: Triggered when the execution of the query has completed. The probe includes a single argument, `status`, which returns 0 when the query is successfully executed and 1 if there was an error.

##### 5.8.4.1.7 Row-Level Probes

The `*row-{start,done}` probes are triggered each time a row operation is pushed down to a storage engine. For example, if you execute an `INSERT` statement with 100 rows of data, then the `insert-row-start` and `insert-row-done` probes are triggered 100 times each, for each row insert.

```sql
insert-row-start(database, table)
insert-row-done(status)

update-row-start(database, table)
update-row-done(status)

delete-row-start(database, table)
delete-row-done(status)
```

* `insert-row-start`: Triggered before a row is inserted into a table.

* `insert-row-done`: Triggered after a row is inserted into a table.

* `update-row-start`: Triggered before a row is updated in a table.

* `update-row-done`: Triggered before a row is updated in a table.

* `delete-row-start`: Triggered before a row is deleted from a table.

* `delete-row-done`: Triggered before a row is deleted from a table.

The arguments supported by the probes are consistent for the corresponding `start` and `done` probes in each case:

* `database`: The database name.
* `table`: The table name.
* `status`: The status; 0 for success or 1 for failure.

Because the row-level probes are triggered for each individual row access, these probes can be triggered many thousands of times each second, which may have a detrimental effect on both the monitoring script and MySQL. The DTrace environment should limit the triggering on these probes to prevent the performance being adversely affected. Either use the probes sparingly, or use counter or aggregation functions to report on these probes and then provide a summary when the script terminates or as part of a `query-done` or `query-exec-done` probes.

The following example script summarizes the duration of each row operation within a larger query:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

dtrace:::BEGIN
{
   printf("%-2s %-10s %-10s %9s %9s %-s \n",
          "St", "Who", "DB", "ConnID", "Dur ms", "Query");
}

mysql*:::query-start
{
   self->query = copyinstr(arg0);
   self->who   = strjoin(copyinstr(arg3),strjoin("@",copyinstr(arg4)));
   self->db    = copyinstr(arg2);
   self->connid = arg1;
   self->querystart = timestamp;
   self->rowdur = 0;
}

mysql*:::query-done
{
   this->elapsed = (timestamp - self->querystart) /1000000;
   printf("%2d %-10s %-10s %9d %9d %s\n",
          arg0, self->who, self->db,
          self->connid, this->elapsed, self->query);
}

mysql*:::query-done
/ self->rowdur /
{
   printf("%34s %9d %s\n", "", (self->rowdur/1000000), "-> Row ops");
}

mysql*:::insert-row-start
{
   self->rowstart = timestamp;
}

mysql*:::delete-row-start
{
   self->rowstart = timestamp;
}

mysql*:::update-row-start
{
   self->rowstart = timestamp;
}

mysql*:::insert-row-done
{
   self->rowdur += (timestamp-self->rowstart);
}

mysql*:::delete-row-done
{
   self->rowdur += (timestamp-self->rowstart);
}

mysql*:::update-row-done
{
   self->rowdur += (timestamp-self->rowstart);
}
```

Running the above script with a query that inserts data into a table, you can monitor the exact time spent performing the raw row insertion:

```sql
St Who        DB            ConnID    Dur ms Query
 0 @localhost test              13     20767 insert into t1(select * from t2)
                                        4827 -> Row ops
```

##### 5.8.4.1.8 Read Row Probes

The read row probes are triggered at a storage engine level each time a row read operation occurs. These probes are specified within each storage engine (as opposed to the `*row-start` probes which are in the storage engine interface). These probes can therefore be used to monitor individual storage engine row-level operations and performance. Because these probes are triggered around the storage engine row read interface, they may be hit a significant number of times during a basic query.

```sql
read-row-start(database, table, scan_flag)
read-row-done(status)
```

* `read-row-start`: Triggered when a row is read by the storage engine from the specified `database` and `table`. The `scan_flag` is set to 1 (true) when the read is part of a table scan (that is, a sequential read), or 0 (false) when the read is of a specific record.

* `read-row-done`: Triggered when a row read operation within a storage engine completes. The `status` returns 0 on success, or a positive value on failure.

##### 5.8.4.1.9 Index Probes

The index probes are triggered each time a row is read using one of the indexes for the specified table. The probe is triggered within the corresponding storage engine for the table.

```sql
index-read-row-start(database, table)
index-read-row-done(status)
```

* `index-read-row-start`: Triggered when a row is read by the storage engine from the specified `database` and `table`.

* `index-read-row-done`: Triggered when an indexed row read operation within a storage engine completes. The `status` returns 0 on success, or a positive value on failure.

##### 5.8.4.1.10 Lock Probes

The lock probes are called whenever an external lock is requested by MySQL for a table using the corresponding lock mechanism on the table as defined by the table's engine type. There are three different types of lock, the read lock, write lock, and unlock operations. Using the probes you can determine the duration of the external locking routine (that is, the time taken by the storage engine to implement the lock, including any time waiting for another lock to become free) and the total duration of the lock/unlock process.

```sql
handler-rdlock-start(database, table)
handler-rdlock-done(status)

handler-wrlock-start(database, table)
handler-wrlock-done(status)

handler-unlock-start(database, table)
handler-unlock-done(status)
```

* `handler-rdlock-start`: Triggered when a read lock is requested on the specified `database` and `table`.

* `handler-wrlock-start`: Triggered when a write lock is requested on the specified `database` and `table`.

* `handler-unlock-start`: Triggered when an unlock request is made on the specified `database` and `table`.

* `handler-rdlock-done`: Triggered when a read lock request completes. The `status` is 0 if the lock operation succeeded, or `>0` on failure.

* `handler-wrlock-done`: Triggered when a write lock request completes. The `status` is 0 if the lock operation succeeded, or `>0` on failure.

* `handler-unlock-done`: Triggered when an unlock request completes. The `status` is 0 if the unlock operation succeeded, or `>0` on failure.

You can use arrays to monitor the locking and unlocking of individual tables and then calculate the duration of the entire table lock using the following script:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

mysql*:::handler-rdlock-start
{
   self->rdlockstart = timestamp;
   this->lockref = strjoin(copyinstr(arg0),strjoin("@",copyinstr(arg1)));
   self->lockmap[this->lockref] = self->rdlockstart;
   printf("Start: Lock->Read   %s.%s\n",copyinstr(arg0),copyinstr(arg1));
}

mysql*:::handler-wrlock-start
{
   self->wrlockstart = timestamp;
   this->lockref = strjoin(copyinstr(arg0),strjoin("@",copyinstr(arg1)));
   self->lockmap[this->lockref] = self->rdlockstart;
   printf("Start: Lock->Write  %s.%s\n",copyinstr(arg0),copyinstr(arg1));
}

mysql*:::handler-unlock-start
{
   self->unlockstart = timestamp;
   this->lockref = strjoin(copyinstr(arg0),strjoin("@",copyinstr(arg1)));
   printf("Start: Lock->Unlock %s.%s (%d ms lock duration)\n",
          copyinstr(arg0),copyinstr(arg1),
          (timestamp - self->lockmap[this->lockref])/1000000);
}

mysql*:::handler-rdlock-done
{
   printf("End:   Lock->Read   %d ms\n",
          (timestamp - self->rdlockstart)/1000000);
}

mysql*:::handler-wrlock-done
{
   printf("End:   Lock->Write  %d ms\n",
          (timestamp - self->wrlockstart)/1000000);
}

mysql*:::handler-unlock-done
{
   printf("End:   Lock->Unlock %d ms\n",
          (timestamp - self->unlockstart)/1000000);
}
```

When executed, you should get information both about the duration of the locking process itself, and of the locks on a specific table:

```sql
Start: Lock->Read   test.t2
End:   Lock->Read   0 ms
Start: Lock->Unlock test.t2 (25743 ms lock duration)
End:   Lock->Unlock 0 ms
Start: Lock->Read   test.t2
End:   Lock->Read   0 ms
Start: Lock->Unlock test.t2 (1 ms lock duration)
End:   Lock->Unlock 0 ms
Start: Lock->Read   test.t2
End:   Lock->Read   0 ms
Start: Lock->Unlock test.t2 (1 ms lock duration)
End:   Lock->Unlock 0 ms
Start: Lock->Read   test.t2
End:   Lock->Read   0 ms
```

##### 5.8.4.1.11 Filesort Probes

The filesort probes are triggered whenever a filesort operation is applied to a table. For more information on filesort and the conditions under which it occurs, see Section 8.2.1.14, “ORDER BY Optimization”.

```sql
filesort-start(database, table)
filesort-done(status, rows)
```

* `filesort-start`: Triggered when the filesort operation starts on a table. The two arguments to the probe, `database` and `table`, identify the table being sorted.

* `filesort-done`: Triggered when the filesort operation completes. Two arguments are supplied, the `status` (0 for success, 1 for failure), and the number of rows sorted during the filesort process.

An example of this is in the following script, which tracks the duration of the filesort process in addition to the duration of the main query:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

dtrace:::BEGIN
{
   printf("%-2s %-10s %-10s %9s %18s %-s \n",
          "St", "Who", "DB", "ConnID", "Dur microsec", "Query");
}

mysql*:::query-start
{
   self->query = copyinstr(arg0);
   self->who   = strjoin(copyinstr(arg3),strjoin("@",copyinstr(arg4)));
   self->db    = copyinstr(arg2);
   self->connid = arg1;
   self->querystart = timestamp;
   self->filesort = 0;
   self->fsdb = "";
   self->fstable = "";
}

mysql*:::filesort-start
{
  self->filesort = timestamp;
  self->fsdb = copyinstr(arg0);
  self->fstable = copyinstr(arg1);
}

mysql*:::filesort-done
{
   this->elapsed = (timestamp - self->filesort) /1000;
   printf("%2d %-10s %-10s %9d %18d Filesort on %s\n",
          arg0, self->who, self->fsdb,
          self->connid, this->elapsed, self->fstable);
}

mysql*:::query-done
{
   this->elapsed = (timestamp - self->querystart) /1000;
   printf("%2d %-10s %-10s %9d %18d %s\n",
          arg0, self->who, self->db,
          self->connid, this->elapsed, self->query);
}
```

Executing a query on a large table with an `ORDER BY` clause that triggers a filesort, and then creating an index on the table and then repeating the same query, you can see the difference in execution speed:

```sql
St Who        DB            ConnID       Dur microsec Query
 0 @localhost test              14           11335469 Filesort on t1
 0 @localhost test              14           11335787 select * from t1 order by i limit 100
 0 @localhost test              14          466734378 create index t1a on t1 (i)
 0 @localhost test              14              26472 select * from t1 order by i limit 100
```

##### 5.8.4.1.12 Statement Probes

The individual statement probes are provided to give specific information about different statement types. For the start probes the string of the query is provided as the only argument. Depending on the statement type, the information provided by the corresponding done probe can differ. For all done probes the status of the operation (`0` for success, `>0` for failure) is provided. For `SELECT`, `INSERT`, `INSERT ... (SELECT FROM ...)`, `DELETE`, and `DELETE FROM t1,t2` operations the number of rows affected is returned.

For `UPDATE` and `UPDATE t1,t2 ...` statements the number of rows matched and the number of rows actually changed is provided. This is because the number of rows actually matched by the corresponding `WHERE` clause, and the number of rows changed can differ. MySQL does not update the value of a row if the value already matches the new setting.

```sql
select-start(query)
select-done(status,rows)

insert-start(query)
insert-done(status,rows)

insert-select-start(query)
insert-select-done(status,rows)

update-start(query)
update-done(status,rowsmatched,rowschanged)

multi-update-start(query)
multi-update-done(status,rowsmatched,rowschanged)

delete-start(query)
delete-done(status,rows)

multi-delete-start(query)
multi-delete-done(status,rows)
```

* `select-start`: Triggered before a `SELECT` statement.

* `select-done`: Triggered at the end of a `SELECT` statement.

* `insert-start`: Triggered before a `INSERT` statement.

* `insert-done`: Triggered at the end of an `INSERT` statement.

* `insert-select-start`: Triggered before an `INSERT ... SELECT` statement.

* `insert-select-done`: Triggered at the end of an `INSERT ... SELECT` statement.

* `update-start`: Triggered before an `UPDATE` statement.

* `update-done`: Triggered at the end of an `UPDATE` statement.

* `multi-update-start`: Triggered before an `UPDATE` statement involving multiple tables.

* `multi-update-done`: Triggered at the end of an `UPDATE` statement involving multiple tables.

* `delete-start`: Triggered before a `DELETE` statement.

* `delete-done`: Triggered at the end of a `DELETE` statement.

* `multi-delete-start`: Triggered before a `DELETE` statement involving multiple tables.

* `multi-delete-done`: Triggered at the end of a `DELETE` statement involving multiple tables.

The arguments for the statement probes are:

* `query`: The query string.
* `status`: The status of the query. `0` for success, and `>0` for failure.

* `rows`: The number of rows affected by the statement. This returns the number rows found for `SELECT`, the number of rows deleted for `DELETE`, and the number of rows successfully inserted for `INSERT`.

* `rowsmatched`: The number of rows matched by the `WHERE` clause of an `UPDATE` operation.

* `rowschanged`: The number of rows actually changed during an `UPDATE` operation.

You use these probes to monitor the execution of these statement types without having to monitor the user or client executing the statements. A simple example of this is to track the execution times:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet

dtrace:::BEGIN
{
   printf("%-60s %-8s %-8s %-8s\n", "Query", "RowsU", "RowsM", "Dur (ms)");
}

mysql*:::update-start, mysql*:::insert-start,
mysql*:::delete-start, mysql*:::multi-delete-start,
mysql*:::multi-delete-done, mysql*:::select-start,
mysql*:::insert-select-start, mysql*:::multi-update-start
{
    self->query = copyinstr(arg0);
    self->querystart = timestamp;
}

mysql*:::insert-done, mysql*:::select-done,
mysql*:::delete-done, mysql*:::multi-delete-done, mysql*:::insert-select-done
/ self->querystart /
{
    this->elapsed = ((timestamp - self->querystart)/1000000);
    printf("%-60s %-8d %-8d %d\n",
           self->query,
           0,
           arg1,
           this->elapsed);
    self->querystart = 0;
}

mysql*:::update-done, mysql*:::multi-update-done
/ self->querystart /
{
    this->elapsed = ((timestamp - self->querystart)/1000000);
    printf("%-60s %-8d %-8d %d\n",
           self->query,
           arg1,
           arg2,
           this->elapsed);
    self->querystart = 0;
}
```

When executed you can see the basic execution times and rows matches:

```sql
Query                                                        RowsU    RowsM    Dur (ms)
select * from t2                                             0        275      0
insert into t2 (select * from t2)                            0        275      9
update t2 set i=5 where i > 75                               110      110      8
update t2 set i=5 where i < 25                               254      134      12
delete from t2 where i < 5                                   0        0        0
```

Another alternative is to use the aggregation functions in DTrace to aggregate the execution time of individual statements together:

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet


mysql*:::update-start, mysql*:::insert-start,
mysql*:::delete-start, mysql*:::multi-delete-start,
mysql*:::multi-delete-done, mysql*:::select-start,
mysql*:::insert-select-start, mysql*:::multi-update-start
{
    self->querystart = timestamp;
}

mysql*:::select-done
{
        @statements["select"] = sum(((timestamp - self->querystart)/1000000));
}

mysql*:::insert-done, mysql*:::insert-select-done
{
        @statements["insert"] = sum(((timestamp - self->querystart)/1000000));
}

mysql*:::update-done, mysql*:::multi-update-done
{
        @statements["update"] = sum(((timestamp - self->querystart)/1000000));
}

mysql*:::delete-done, mysql*:::multi-delete-done
{
        @statements["delete"] = sum(((timestamp - self->querystart)/1000000));
}

tick-30s
{
        printa(@statements);
}
```

The script just shown aggregates the times spent doing each operation, which could be used to help benchmark a standard suite of tests.

```sql
 delete                                                            0
  update                                                            0
  insert                                                           23
  select                                                         2484

  delete                                                            0
  update                                                            0
  insert                                                           39
  select                                                        10744

  delete                                                            0
  update                                                           26
  insert                                                           56
  select                                                        10944

  delete                                                            0
  update                                                           26
  insert                                                         2287
  select                                                        15985
```

##### 5.8.4.1.13 Network Probes

The network probes monitor the transfer of information from the MySQL server and clients of all types over the network. The probes are defined as follows:

```sql
net-read-start()
net-read-done(status, bytes)
net-write-start(bytes)
net-write-done(status)
```

* `net-read-start`: Triggered when a network read operation is started.

* `net-read-done`: Triggered when the network read operation completes. The `status` is an `integer` representing the return status for the operation, `0` for success and `1` for failure. The `bytes` argument is an integer specifying the number of bytes read during the process.

* `net-start-bytes`: Triggered when data is written to a network socket. The single argument, `bytes`, specifies the number of bytes written to the network socket.

* `net-write-done`: Triggered when the network write operation has completed. The single argument, `status`, is an integer representing the return status for the operation, `0` for success and `1` for failure.

You can use the network probes to monitor the time spent reading from and writing to network clients during execution. The following D script provides an example of this. Both the cumulative time for the read or write is calculated, and the number of bytes. Note that the dynamic variable size has been increased (using the `dynvarsize` option) to cope with the rapid firing of the individual probes for the network reads/writes.

```sql
#!/usr/sbin/dtrace -s

#pragma D option quiet
#pragma D option dynvarsize=4m

dtrace:::BEGIN
{
   printf("%-2s %-30s %-10s %9s %18s %-s \n",
          "St", "Who", "DB", "ConnID", "Dur microsec", "Query");
}

mysql*:::query-start
{
   self->query = copyinstr(arg0);
   self->who   = strjoin(copyinstr(arg3),strjoin("@",copyinstr(arg4)));
   self->db    = copyinstr(arg2);
   self->connid = arg1;
   self->querystart = timestamp;
   self->netwrite = 0;
   self->netwritecum = 0;
   self->netwritebase = 0;
   self->netread = 0;
   self->netreadcum = 0;
   self->netreadbase = 0;
}

mysql*:::net-write-start
{
   self->netwrite += arg0;
   self->netwritebase = timestamp;
}

mysql*:::net-write-done
{
   self->netwritecum += (timestamp - self->netwritebase);
   self->netwritebase = 0;
}

mysql*:::net-read-start
{
   self->netreadbase = timestamp;
}

mysql*:::net-read-done
{
   self->netread += arg1;
   self->netreadcum += (timestamp - self->netreadbase);
   self->netreadbase = 0;
}

mysql*:::query-done
{
   this->elapsed = (timestamp - self->querystart) /1000000;
   printf("%2d %-30s %-10s %9d %18d %s\n",
          arg0, self->who, self->db,
          self->connid, this->elapsed, self->query);
   printf("Net read: %d bytes (%d ms) write: %d bytes (%d ms)\n",
               self->netread, (self->netreadcum/1000000),
               self->netwrite, (self->netwritecum/1000000));
}
```

When executing the above script on a machine with a remote client, you can see that approximately a third of the time spent executing the query is related to writing the query results back to the client.

```sql
St Who                            DB            ConnID       Dur microsec Query
 0 root@::ffff:198.51.100.108      test              31               3495 select * from t1 limit 1000000
Net read: 0 bytes (0 ms) write: 10000075 bytes (1220 ms)
```

##### 5.8.4.1.14 Keycache Probes

The keycache probes are triggered when using the index key cache used with the MyISAM storage engine. Probes exist to monitor when data is read into the keycache, cached key data is written from the cache into a cached file, or when accessing the keycache.

Keycache usage indicates when data is read or written from the index files into the cache, and can be used to monitor how efficient the memory allocated to the keycache is being used. A high number of keycache reads across a range of queries may indicate that the keycache is too small for size of data being accessed.

```sql
keycache-read-start(filepath, bytes, mem_used, mem_free)
keycache-read-block(bytes)
keycache-read-hit()
keycache-read-miss()
keycache-read-done(mem_used, mem_free)
keycache-write-start(filepath, bytes, mem_used, mem_free)
keycache-write-block(bytes)
keycache-write-done(mem_used, mem_free)
```

When reading data from the index files into the keycache, the process first initializes the read operation (indicated by `keycache-read-start`), then loads blocks of data (`keycache-read-block`), and then the read block is either matches the data being identified (`keycache-read-hit`) or more data needs to be read (`keycache-read-miss`). Once the read operation has completed, reading stops with the `keycache-read-done`.

Data can be read from the index file into the keycache only when the specified key is not already within the keycache.

* `keycache-read-start`: Triggered when the keycache read operation is started. Data is read from the specified `filepath`, reading the specified number of `bytes`. The `mem_used` and `mem_avail` indicate memory currently used by the keycache and the amount of memory available within the keycache.

* `keycache-read-block`: Triggered when the keycache reads a block of data, of the specified number of `bytes`, from the index file into the keycache.

* `keycache-read-hit`: Triggered when the block of data read from the index file matches the key data requested.

* `keycache-read-miss`: Triggered when the block of data read from the index file does not match the key data needed.

* `keycache-read-done`: Triggered when the keycache read operation has completed. The `mem_used` and `mem_avail` indicate memory currently used by the keycache and the amount of memory available within the keycache.

Keycache writes occur when the index information is updated during an `INSERT`, `UPDATE`, or `DELETE` operation, and the cached key information is flushed back to the index file.

* `keycache-write-start`: Triggered when the keycache write operation is started. Data is written to the specified `filepath`, reading the specified number of `bytes`. The `mem_used` and `mem_avail` indicate memory currently used by the keycache and the amount of memory available within the keycache.

* `keycache-write-block`: Triggered when the keycache writes a block of data, of the specified number of `bytes`, to the index file from the keycache.

* `keycache-write-done`: Triggered when the keycache write operation has completed. The `mem_used` and `mem_avail` indicate memory currently used by the keycache and the amount of memory available within the keycache.

