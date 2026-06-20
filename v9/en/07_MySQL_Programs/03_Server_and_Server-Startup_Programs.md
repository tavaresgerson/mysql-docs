## 6.3 Server and Server-Startup Programs

This section describes **mysqld**, the MySQL server, and several programs that are used to start the server.


### 6.3.1 mysqld — The MySQL Server

**mysqld**, also known as MySQL Server, is a single multithreaded program that does most of the work in a MySQL installation. It does not spawn additional processes. MySQL Server manages access to the MySQL data directory that contains databases and tables. The data directory is also the default location for other information such as log files and status files.

Note

Some installation packages contain a debugging version of the server named **mysqld-debug**. Invoke this version instead of **mysqld** for debugging support, memory allocation checking, and trace file support (see Section 7.9.1.2, “Creating Trace Files”).

When MySQL server starts, it listens for network connections from client programs and manages access to databases on behalf of those clients.

The **mysqld** program has many options that can be specified at startup. For a complete list of options, run this command:

```
mysqld --verbose --help
```

MySQL Server also has a set of system variables that affect its operation as it runs. System variables can be set at server startup, and many of them can be changed at runtime to effect dynamic server reconfiguration. MySQL Server also has a set of status variables that provide information about its operation. You can monitor these status variables to access runtime performance characteristics.

For a full description of MySQL Server command options, system variables, and status variables, see Section 7.1, “The MySQL Server”. For information about installing MySQL and setting up the initial configuration, see Chapter 2, *Installing MySQL*.


### 6.3.2 mysqld_safe — MySQL Server Startup Script

**mysqld_safe** is the recommended way to start a **mysqld** server on Unix. **mysqld_safe** adds some safety features such as restarting the server when an error occurs and logging runtime information to an error log. A description of error logging is given later in this section.

Note

For some Linux platforms, MySQL installation from RPM or Debian packages includes systemd support for managing MySQL server startup and shutdown. On these platforms, **mysqld_safe** is not installed because it is unnecessary. For more information, see Section 2.5.9, “Managing MySQL Server with systemd”.

One implication of the non-use of **mysqld_safe** on platforms that use systemd for server management is that use of `[mysqld_safe]` or `[safe_mysqld]` sections in option files is not supported and might lead to unexpected behavior.

**mysqld_safe** tries to start an executable named **mysqld**. To override the default behavior and specify explicitly the name of the server you want to run, specify a `--mysqld` or `--mysqld-version` option to **mysqld_safe**. You can also use `--ledir` to indicate the directory where **mysqld_safe** should look for the server.

Many of the options to **mysqld_safe** are the same as the options to **mysqld**. See Section 7.1.7, “Server Command Options”.

Options unknown to **mysqld_safe** are passed to **mysqld** if they are specified on the command line, but ignored if they are specified in the `[mysqld_safe]` group of an option file. See Section 6.2.2.2, “Using Option Files”.

**mysqld_safe** reads all options from the `[mysqld]`, `[server]`, and `[mysqld_safe]` sections in option files. For example, if you specify a `[mysqld]` section like this, **mysqld_safe** finds and uses the `--log-error` option:

```
[mysqld]
log-error=error.log
```

For backward compatibility, **mysqld_safe** also reads `[safe_mysqld]` sections, but to be current you should rename such sections to `[mysqld_safe]`.

**mysqld_safe** accepts options on the command line and in option files, as described in the following table. For information about option files used by MySQL programs, see Section 6.2.2.2, “Using Option Files”.

**Table 6.7 mysqld_safe Options**

<table frame="box" rules="all" summary="Command-line options available for mysqld_safe."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Option Name</th> <th>Description</th> </tr></thead><tbody><tr><td>--basedir</td> <td>Path to MySQL installation directory</td> </tr><tr><td>--core-file-size</td> <td>Size of core file that mysqld should be able to create</td> </tr><tr><td>--datadir</td> <td>Path to data directory</td> </tr><tr><td>--defaults-extra-file</td> <td>Read named option file in addition to usual option files</td> </tr><tr><td>--defaults-file</td> <td>Read only named option file</td> </tr><tr><td>--help</td> <td>Display help message and exit</td> </tr><tr><td>--ledir</td> <td>Path to directory where server is located</td> </tr><tr><td>--log-error</td> <td>Write error log to named file</td> </tr><tr><td>--malloc-lib</td> <td>Alternative malloc library to use for mysqld</td> </tr><tr><td>--mysqld</td> <td>Name of server program to start (in ledir directory)</td> </tr><tr><td>--mysqld-safe-log-timestamps</td> <td>Timestamp format for logging</td> </tr><tr><td>--mysqld-version</td> <td>Suffix for server program name</td> </tr><tr><td>--nice</td> <td>Use nice program to set server scheduling priority</td> </tr><tr><td>--no-defaults</td> <td>Read no option files</td> </tr><tr><td>--open-files-limit</td> <td>Number of files that mysqld should be able to open</td> </tr><tr><td>--pid-file</td> <td>Path name of server process ID file</td> </tr><tr><td>--plugin-dir</td> <td>Directory where plugins are installed</td> </tr><tr><td>--port</td> <td>Port number on which to listen for TCP/IP connections</td> </tr><tr><td>--skip-kill-mysqld</td> <td>Do not try to kill stray mysqld processes</td> </tr><tr><td>--skip-syslog</td> <td>Do not write error messages to syslog; use error log file</td> </tr><tr><td>--socket</td> <td>Socket file on which to listen for Unix socket connections</td> </tr><tr><td>--syslog</td> <td>Write error messages to syslog</td> </tr><tr><td>--syslog-tag</td> <td>Tag suffix for messages written to syslog</td> </tr><tr><td>--timezone</td> <td>Set TZ time zone environment variable to named value</td> </tr><tr><td>--user</td> <td>Run mysqld as user having name user_name or numeric user ID user_id</td> </tr></tbody></table>

* `--help`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--basedir=dir_name`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The path to the MySQL installation directory.

* `--core-file-size=size`

  <table frame="box" rules="all" summary="Properties for core-file-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file-size=size</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The size of the core file that **mysqld** should be able to create. The option value is passed to **ulimit -c**.

  Note

  The `innodb_buffer_pool_in_core_file` variable can be used to reduce the size of core files on operating systems that support it. For more information, see Section 17.8.3.7, “Excluding or Including Buffer Pool Pages from Core Files”.

* `--datadir=dir_name`

  <table frame="box" rules="all" summary="Properties for datadir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--datadir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The path to the data directory.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  Read this option file in addition to the usual option files. If the file does not exist or is otherwise inaccessible, the server exits with an error. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory. This must be the first option on the command line if it is used.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  Use only the given option file. If the file does not exist or is otherwise inaccessible, the server exits with an error. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory. This must be the first option on the command line if it is used.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--ledir=dir_name`

  <table frame="box" rules="all" summary="Properties for ledir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ledir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  If **mysqld_safe** cannot find the server, use this option to indicate the path name to the directory where the server is located.

  This option is accepted only on the command line, not in option files. On platforms that use systemd, the value can be specified in the value of `MYSQLD_OPTS`. See Section 2.5.9, “Managing MySQL Server with systemd”.

* `--log-error=file_name`

  <table frame="box" rules="all" summary="Properties for log-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-error=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  Write the error log to the given file. See Section 7.4.2, “The Error Log”.

* `--mysqld-safe-log-timestamps`

  <table frame="box" rules="all" summary="Properties for mysqld-safe-log-timestamps"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqld-safe-log-timestamps=type</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>utc</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>system</code></p><p class="valid-value"><code>hyphen</code></p><p class="valid-value"><code>legacy</code></p></td> </tr></tbody></table>

  This option controls the format for timestamps in log output produced by **mysqld_safe**. The following list describes the permitted values. For any other value, **mysqld_safe** logs a warning and uses `UTC` format.

  + `UTC`, `utc`

    ISO 8601 UTC format (same as `--log_timestamps=UTC` for the server). This is the default.

  + `SYSTEM`, `system`

    ISO 8601 local time format (same as `--log_timestamps=SYSTEM` for the server).

  + `HYPHEN`, `hyphen`

    *`YY-MM-DD h:mm:ss`* format, as in **mysqld_safe** for MySQL 5.6.

  + `LEGACY`, `legacy`

    *`YYMMDD hh:mm:ss`* format, as in **mysqld_safe** prior to MySQL 5.6.

* `--malloc-lib=[lib_name]`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

  The name of the library to use for memory allocation instead of the system `malloc()` library. The option value must be one of the directories `/usr/lib`, `/usr/lib64`, `/usr/lib/i386-linux-gnu`, or `/usr/lib/x86_64-linux-gnu`.

  The `--malloc-lib` option works by modifying the `LD_PRELOAD` environment value to affect dynamic linking to enable the loader to find the memory-allocation library when **mysqld** runs:

  + If the option is not given, or is given without a value (`--malloc-lib=`), `LD_PRELOAD` is not modified and no attempt is made to use `tcmalloc`.

  + Prior to MySQL 8.0.21, if the option is given as `--malloc-lib=tcmalloc`, **mysqld_safe** looks for a `tcmalloc` library in `/usr/lib`. If `tmalloc` is found, its path name is added to the beginning of the `LD_PRELOAD` value for **mysqld**. If `tcmalloc` is not found, **mysqld_safe** aborts with an error.

    As of MySQL 8.0.21, `tcmalloc` is not a permitted value for the `--malloc-lib` option.

  + If the option is given as `--malloc-lib=/path/to/some/library`, that full path is added to the beginning of the `LD_PRELOAD` value. If the full path points to a nonexistent or unreadable file, **mysqld_safe** aborts with an error.

  + For cases where **mysqld_safe** adds a path name to `LD_PRELOAD`, it adds the path to the beginning of any existing value the variable already has.

  Note

  On systems that manage the server using systemd, **mysqld_safe** is not available. Instead, specify the allocation library by setting `LD_PRELOAD` in `/etc/sysconfig/mysql`.

  Linux users can use the `libtcmalloc_minimal.so` library on any platform for which a `tcmalloc` package is installed in `/usr/lib` by adding these lines to the `my.cnf` file:

  ```
  [mysqld_safe]
  malloc-lib=tcmalloc
  ```

  To use a specific `tcmalloc` library, specify its full path name. Example:

  ```
  [mysqld_safe]
  malloc-lib=/opt/lib/libtcmalloc_minimal.so
  ```

* `--mysqld=prog_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

  The name of the server program (in the `ledir` directory) that you want to start. This option is needed if you use the MySQL binary distribution but have the data directory outside of the binary distribution. If **mysqld_safe** cannot find the server, use the `--ledir` option to indicate the path name to the directory where the server is located.

  This option is accepted only on the command line, not in option files. On platforms that use systemd, the value can be specified in the value of `MYSQLD_OPTS`. See Section 2.5.9, “Managing MySQL Server with systemd”.

* `--mysqld-version=suffix`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

  This option is similar to the `--mysqld` option, but you specify only the suffix for the server program name. The base name is assumed to be **mysqld**. For example, if you use `--mysqld-version=debug`, **mysqld_safe** starts the **mysqld-debug** program in the `ledir` directory. If the argument to `--mysqld-version` is empty, **mysqld_safe** uses **mysqld** in the `ledir` directory.

  This option is accepted only on the command line, not in option files. On platforms that use systemd, the value can be specified in the value of `MYSQLD_OPTS`. See Section 2.5.9, “Managing MySQL Server with systemd”.

* `--nice=priority`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

  Use the `nice` program to set the server's scheduling priority to the given value.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read. This must be the first option on the command line if it is used.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--open-files-limit=count`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

  The number of files that **mysqld** should be able to open. The option value is passed to **ulimit -n**.

  Note

  You must start **mysqld_safe** as `root` for this to function properly.

* `--pid-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

  The path name that **mysqld** should use for its process ID file.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

  The path name of the plugin directory.

* `--port=port_num`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

  The port number that the server should use when listening for TCP/IP connections. The port number must be 1024 or higher unless the server is started by the `root` operating system user.

* `--skip-kill-mysqld`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

  Do not try to kill stray **mysqld** processes at startup. This option works only on Linux.

* `--socket=path`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>0

  The Unix socket file that the server should use when listening for local connections.

* `--syslog`, `--skip-syslog`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>1

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>2

  `--syslog` causes error messages to be sent to `syslog` on systems that support the **logger** program. `--skip-syslog` suppresses the use of `syslog`; messages are written to an error log file.

  When `syslog` is used for error logging, the `daemon.err` facility/severity is used for all log messages.

  Using these options to control **mysqld** logging is deprecated. To write error log output to the system log, use the instructions at Section 7.4.2.8, “Error Logging to the System Log”. To control the facility, use the server `log_syslog_facility` system variable.

* `--syslog-tag=tag`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>3

  For logging to `syslog`, messages from **mysqld_safe** and **mysqld** are written with identifiers of `mysqld_safe` and `mysqld`, respectively. To specify a suffix for the identifiers, use `--syslog-tag=tag`, which modifies the identifiers to be `mysqld_safe-tag` and `mysqld-tag`.

  Using this option to control **mysqld** logging is deprecated. Use the server `log_syslog_tag` system variable instead. See Section 7.4.2.8, “Error Logging to the System Log”.

* `--timezone=timezone`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>4

  Set the `TZ` time zone environment variable to the given option value. Consult your operating system documentation for legal time zone specification formats.

* `--user={user_name|user_id}`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>5

  Run the **mysqld** server as the user having the name *`user_name`* or the numeric user ID *`user_id`*. (“User” in this context refers to a system login account, not a MySQL user listed in the grant tables.)

If you execute **mysqld_safe** with the `--defaults-file` or `--defaults-extra-file` option to name an option file, the option must be the first one given on the command line or the option file is not used. For example, this command does not use the named option file:

```
mysql> mysqld_safe --port=port_num --defaults-file=file_name
```

Instead, use the following command:

```
mysql> mysqld_safe --defaults-file=file_name --port=port_num
```

The **mysqld_safe** script is written so that it normally can start a server that was installed from either a source or a binary distribution of MySQL, even though these types of distributions typically install the server in slightly different locations. (See Section 2.1.5, “Installation Layouts”.) **mysqld_safe** expects one of the following conditions to be true:

* The server and databases can be found relative to the working directory (the directory from which **mysqld_safe** is invoked). For binary distributions, **mysqld_safe** looks under its working directory for `bin` and `data` directories. For source distributions, it looks for `libexec` and `var` directories. This condition should be met if you execute **mysqld_safe** from your MySQL installation directory (for example, `/usr/local/mysql` for a binary distribution).

* If the server and databases cannot be found relative to the working directory, **mysqld_safe** attempts to locate them by absolute path names. Typical locations are `/usr/local/libexec` and `/usr/local/var`. The actual locations are determined from the values configured into the distribution at the time it was built. They should be correct if MySQL is installed in the location specified at configuration time.

Because **mysqld_safe** tries to find the server and databases relative to its own working directory, you can install a binary distribution of MySQL anywhere, as long as you run **mysqld_safe** from the MySQL installation directory:

```
cd mysql_installation_directory
bin/mysqld_safe &
```

If **mysqld_safe** fails, even when invoked from the MySQL installation directory, specify the `--ledir` and `--datadir` options to indicate the directories in which the server and databases are located on your system.

**mysqld_safe** tries to use the **sleep** and **date** system utilities to determine how many times per second it has attempted to start. If these utilities are present and the attempted starts per second is greater than 5, **mysqld_safe** waits 1 full second before starting again. This is intended to prevent excessive CPU usage in the event of repeated failures. (Bug #11761530, Bug #54035)

When you use **mysqld_safe** to start **mysqld**, **mysqld_safe** arranges for error (and notice) messages from itself and from **mysqld** to go to the same destination.

There are several **mysqld_safe** options for controlling the destination of these messages:

* `--log-error=file_name`: Write error messages to the named error file.

* `--syslog`: Write error messages to `syslog` on systems that support the **logger** program.

* `--skip-syslog`: Do not write error messages to `syslog`. Messages are written to the default error log file (`host_name.err` in the data directory), or to a named file if the `--log-error` option is given.

If none of these options is given, the default is `--skip-syslog`.

When **mysqld_safe** writes a message, notices go to the logging destination (`syslog` or the error log file) and `stdout`. Errors go to the logging destination and `stderr`.

Note

Controlling **mysqld** logging from **mysqld_safe** is deprecated. Use the server's native `syslog` support instead. For more information, see Section 7.4.2.8, “Error Logging to the System Log”.


### 6.3.3 mysql.server — MySQL Server Startup Script

MySQL distributions on Unix and Unix-like system include a script named **mysql.server**, which starts the MySQL server using **mysqld_safe**. It can be used on systems such as Linux and Solaris that use System V-style run directories to start and stop system services. It is also used by the macOS Startup Item for MySQL.

**mysql.server** is the script name as used within the MySQL source tree. The installed name might be different (for example, **mysqld** or **mysql**). In the following discussion, adjust the name **mysql.server** as appropriate for your system.

Note

For some Linux platforms, MySQL installation from RPM or Debian packages includes systemd support for managing MySQL server startup and shutdown. On these platforms, **mysql.server** and **mysqld_safe** are not installed because they are unnecessary. For more information, see Section 2.5.9, “Managing MySQL Server with systemd”.

To start or stop the server manually using the **mysql.server** script, invoke it from the command line with `start` or `stop` arguments:

```
mysql.server start
mysql.server stop
```

**mysql.server** changes location to the MySQL installation directory, then invokes **mysqld_safe**. To run the server as some specific user, add an appropriate `user` option to the `[mysqld]` group of the global `/etc/my.cnf` option file, as shown later in this section. (It is possible that you must edit **mysql.server** if you've installed a binary distribution of MySQL in a nonstandard location. Modify it to change location into the proper directory before it runs **mysqld_safe**. If you do this, your modified version of **mysql.server** may be overwritten if you upgrade MySQL in the future; make a copy of your edited version that you can reinstall.)

**mysql.server stop** stops the server by sending a signal to it. You can also stop the server manually by executing **mysqladmin shutdown**.

To start and stop MySQL automatically on your server, you must add start and stop commands to the appropriate places in your `/etc/rc*` files:

* If you use the Linux server RPM package (`MySQL-server-VERSION.rpm`), or a native Linux package installation, the **mysql.server** script may be installed in the `/etc/init.d` directory with the name `mysqld` or `mysql`. See Section 2.5.4, “Installing MySQL on Linux Using RPM Packages from Oracle”, for more information on the Linux RPM packages.

* If you install MySQL from a source distribution or using a binary distribution format that does not install **mysql.server** automatically, you can install the script manually. It can be found in the `support-files` directory under the MySQL installation directory or in a MySQL source tree. Copy the script to the `/etc/init.d` directory with the name **mysql** and make it executable:

  ```
  cp mysql.server /etc/init.d/mysql
  chmod +x /etc/init.d/mysql
  ```

  After installing the script, the commands needed to activate it to run at system startup depend on your operating system. On Linux, you can use **chkconfig**:

  ```
  chkconfig --add mysql
  ```

  On some Linux systems, the following command also seems to be necessary to fully enable the **mysql** script:

  ```
  chkconfig --level 345 mysql on
  ```

* On FreeBSD, startup scripts generally should go in `/usr/local/etc/rc.d/`. Install the `mysql.server` script as `/usr/local/etc/rc.d/mysql.server.sh` to enable automatic startup. The `rc(8)` manual page states that scripts in this directory are executed only if their base name matches the `*.sh` shell file name pattern. Any other files or directories present within the directory are silently ignored.

* As an alternative to the preceding setup, some operating systems also use `/etc/rc.local` or `/etc/init.d/boot.local` to start additional services on startup. To start up MySQL using this method, append a command like the one following to the appropriate startup file:

  ```
  /bin/sh -c 'cd /usr/local/mysql; ./bin/mysqld_safe --user=mysql &'
  ```

* For other systems, consult your operating system documentation to see how to install startup scripts.

**mysql.server** reads options from the `[mysql.server]` and `[mysqld]` sections of option files. For backward compatibility, it also reads `[mysql_server]` sections, but to be current you should rename such sections to `[mysql.server]`.

You can add options for **mysql.server** in a global `/etc/my.cnf` file. A typical `my.cnf` file might look like this:

```
[mysqld]
datadir=/usr/local/mysql/var
socket=/var/tmp/mysql.sock
port=3306
user=mysql

[mysql.server]
basedir=/usr/local/mysql
```

The **mysql.server** script supports the options shown in the following table. If specified, they *must* be placed in an option file, not on the command line. **mysql.server** supports only `start` and `stop` as command-line arguments.

**Table 6.8 mysql.server Option-File Options**

<table frame="box" rules="all" summary="Option-file options available for mysql.server."><col align="left" style="width: 20%"/><col align="left" style="width: 70%"/><col align="left" style="width: 10%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Type</th> </tr></thead><tbody><tr><th scope="row"><code>basedir</code></th> <td>Path to MySQL installation directory</td> <td>Directory name</td> </tr><tr><th scope="row"><code>datadir</code></th> <td>Path to MySQL data directory</td> <td>Directory name</td> </tr><tr><th scope="row"><code>pid-file</code></th> <td>File in which server should write its process ID</td> <td>File name</td> </tr><tr><th scope="row"><code>service-startup-timeout</code></th> <td>How long to wait for server startup</td> <td>Integer</td> </tr></tbody></table>

* `basedir=dir_name`

  The path to the MySQL installation directory.

* `datadir=dir_name`

  The path to the MySQL data directory.

* `pid-file=file_name`

  The path name of the file in which the server should write its process ID. The server creates the file in the data directory unless an absolute path name is given to specify a different directory.

  If this option is not given, **mysql.server** uses a default value of `host_name.pid`. The PID file value passed to **mysqld_safe** overrides any value specified in the `[mysqld_safe]` option file group. Because **mysql.server** reads the `[mysqld]` option file group but not the `[mysqld_safe]` group, you can ensure that **mysqld_safe** gets the same value when invoked from **mysql.server** as when invoked manually by putting the same `pid-file` setting in both the `[mysqld_safe]` and `[mysqld]` groups.

* `service-startup-timeout=seconds`

  How long in seconds to wait for confirmation of server startup. If the server does not start within this time, **mysql.server** exits with an error. The default value is 900. A value of 0 means not to wait at all for startup. Negative values mean to wait forever (no timeout).


### 6.3.4 mysqld_multi — Manage Multiple MySQL Servers

**mysqld_multi** is designed to manage several **mysqld** processes that listen for connections on different Unix socket files and TCP/IP ports. It can start or stop servers, or report their current status.

Note

For some Linux platforms, MySQL installation from RPM or Debian packages includes systemd support for managing MySQL server startup and shutdown. On these platforms, **mysqld_multi** is not installed because it is unnecessary. For information about using systemd to handle multiple MySQL instances, see Section 2.5.9, “Managing MySQL Server with systemd”.

**mysqld_multi** searches for groups named `[mysqldN]` in `my.cnf` (or in the file named by the `--defaults-file` option). *`N`* can be any positive integer. This number is referred to in the following discussion as the option group number, or *`GNR`*. Group numbers distinguish option groups from one another and are used as arguments to **mysqld_multi** to specify which servers you want to start, stop, or obtain a status report for. Options listed in these groups are the same that you would use in the `[mysqld]` group used for starting **mysqld**. (See, for example, Section 2.9.5, “Starting and Stopping MySQL Automatically”.) However, when using multiple servers, it is necessary that each one use its own value for options such as the Unix socket file and TCP/IP port number. For more information on which options must be unique per server in a multiple-server environment, see Section 7.8, “Running Multiple MySQL Instances on One Machine”.

To invoke **mysqld_multi**, use the following syntax:

```
mysqld_multi [options] {start|stop|reload|report} [GNR[,GNR] ...]
```

`start`, `stop`, `reload` (stop and restart), and `report` indicate which operation to perform. You can perform the designated operation for a single server or multiple servers, depending on the *`GNR`* list that follows the option name. If there is no list, **mysqld_multi** performs the operation for all servers in the option file.

Each *`GNR`* value represents an option group number or range of group numbers. The value should be the number at the end of the group name in the option file. For example, the *`GNR`* for a group named `[mysqld17]` is `17`. To specify a range of numbers, separate the first and last numbers by a dash. The *`GNR`* value `10-13` represents groups `[mysqld10]` through `[mysqld13]`. Multiple groups or group ranges can be specified on the command line, separated by commas. There must be no whitespace characters (spaces or tabs) in the *`GNR`* list; anything after a whitespace character is ignored.

This command starts a single server using option group `[mysqld17]`:

```
mysqld_multi start 17
```

This command stops several servers, using option groups `[mysqld8]` and `[mysqld10]` through `[mysqld13]`:

```
mysqld_multi stop 8,10-13
```

For an example of how you might set up an option file, use this command:

```
mysqld_multi --example
```

**mysqld_multi** searches for option files as follows:

* With `--no-defaults`, no option files are read.

  <table frame="box" rules="all" summary="Properties for no-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--no-defaults</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

* With `--defaults-file=file_name`, only the named file is read.

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=filename</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

* Otherwise, option files in the standard list of locations are read, including any file named by the `--defaults-extra-file=file_name` option, if one is given. (If the option is given multiple times, the last value is used.)

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=filename</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

For additional information about these and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

Option files read are searched for `[mysqld_multi]` and `[mysqldN]` option groups. The `[mysqld_multi]` group can be used for options to **mysqld_multi** itself. `[mysqldN]` groups can be used for options passed to specific **mysqld** instances.

The `[mysqld]` or `[mysqld_safe]` groups can be used for common options read by all instances of **mysqld** or **mysqld_safe**. You can specify a `--defaults-file=file_name` option to use a different configuration file for that instance, in which case the `[mysqld]` or `[mysqld_safe]` groups from that file are used for that instance.

**mysqld_multi** supports the following options.

* `--help`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--example`

  <table frame="box" rules="all" summary="Properties for example"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--example</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

  Display a sample option file.

* `--log=file_name`

  <table frame="box" rules="all" summary="Properties for log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log=path</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>/var/log/mysqld_multi.log</code></td> </tr></tbody></table>

  Specify the name of the log file. If the file exists, log output is appended to it.

* `--mysqladmin=prog_name`

  <table frame="box" rules="all" summary="Properties for mysqladmin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqladmin=file</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  The **mysqladmin** binary to be used to stop servers.

* `--mysqld=prog_name`

  <table frame="box" rules="all" summary="Properties for mysqld"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqld=file</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  The **mysqld** binary to be used. Note that you can specify **mysqld_safe** as the value for this option also. If you use **mysqld_safe** to start the server, you can include the `mysqld` or `ledir` options in the corresponding `[mysqldN]` option group. These options indicate the name of the server that **mysqld_safe** should start and the path name of the directory where the server is located. (See the descriptions for these options in Section 6.3.2, “mysqld_safe — MySQL Server Startup Script”.) Example:

  ```
  [mysqld38]
  mysqld = mysqld-debug
  ledir  = /opt/local/mysql/libexec
  ```

* `--no-log`

  <table frame="box" rules="all" summary="Properties for no-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--no-log</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

  Print log information to `stdout` rather than to the log file. By default, output goes to the log file.

* `--password=password`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  The password of the MySQL account to use when invoking **mysqladmin**. Note that the password value is not optional for this option, unlike for other MySQL programs.

* `--silent`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=filename</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

  Silent mode; disable warnings.

* `--tcp-ip`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=filename</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

  Connect to each MySQL server through the TCP/IP port instead of the Unix socket file. (If a socket file is missing, the server might still be running, but accessible only through the TCP/IP port.) By default, connections are made using the Unix socket file. This option affects `stop` and `report` operations.

* `--user=user_name`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=filename</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

  The user name of the MySQL account to use when invoking **mysqladmin**.

* `--verbose`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=filename</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

  Be more verbose.

* `--version`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=filename</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

  Display version information and exit.

Some notes about **mysqld_multi**:

* **Most important**: Before using **mysqld_multi** be sure that you understand the meanings of the options that are passed to the **mysqld** servers and *why* you would want to have separate **mysqld** processes. Beware of the dangers of using multiple **mysqld** servers with the same data directory. Use separate data directories, unless you *know* what you are doing. Starting multiple servers with the same data directory does *not* give you extra performance in a threaded system. See Section 7.8, “Running Multiple MySQL Instances on One Machine”.

  Important

  Make sure that the data directory for each server is fully accessible to the Unix account that the specific **mysqld** process is started as. *Do not* use the Unix *`root`* account for this, unless you *know* what you are doing. See Section 8.1.5, “How to Run MySQL as a Normal User”.

* Make sure that the MySQL account used for stopping the **mysqld** servers (with the **mysqladmin** program) has the same user name and password for each server. Also, make sure that the account has the `SHUTDOWN` privilege. If the servers that you want to manage have different user names or passwords for the administrative accounts, you might want to create an account on each server that has the same user name and password. For example, you might set up a common `multi_admin` account by executing the following commands for each server:

  ```
  $> mysql -u root -S /tmp/mysql.sock -p
  Enter password:
  mysql> CREATE USER 'multi_admin'@'localhost' IDENTIFIED BY 'multipass';
  mysql> GRANT SHUTDOWN ON *.* TO 'multi_admin'@'localhost';
  ```

  See Section 8.2, “Access Control and Account Management”. You have to do this for each **mysqld** server. Change the connection parameters appropriately when connecting to each one. Note that the host name part of the account name must permit you to connect as `multi_admin` from the host where you want to run **mysqld_multi**.

* The Unix socket file and the TCP/IP port number must be different for every **mysqld**. (Alternatively, if the host has multiple network addresses, you can set the `bind_address` system variable to cause different servers to listen to different interfaces.)

* The `--pid-file` option is very important if you are using **mysqld_safe** to start **mysqld** (for example, `--mysqld=mysqld_safe`) Every **mysqld** should have its own process ID file. The advantage of using **mysqld_safe** instead of **mysqld** is that **mysqld_safe** monitors its **mysqld** process and restarts it if the process terminates due to a signal sent using `kill -9` or for other reasons, such as a segmentation fault.

* You might want to use the `--user` option for **mysqld**, but to do this you need to run the **mysqld_multi** script as the Unix superuser (`root`). Having the option in the option file doesn't matter; you just get a warning if you are not the superuser and the **mysqld** processes are started under your own Unix account.

The following example shows how you might set up an option file for use with **mysqld_multi**. The order in which the **mysqld** programs are started or stopped depends on the order in which they appear in the option file. Group numbers need not form an unbroken sequence. The first and fifth `[mysqldN]` groups were intentionally omitted from the example to illustrate that you can have “gaps” in the option file. This gives you more flexibility.

```
# This is an example of a my.cnf file for mysqld_multi.
# Usually this file is located in home dir ~/.my.cnf or /etc/my.cnf

[mysqld_multi]
mysqld     = /usr/local/mysql/bin/mysqld_safe
mysqladmin = /usr/local/mysql/bin/mysqladmin
user       = multi_admin
password   = my_password

[mysqld2]
socket     = /tmp/mysql.sock2
port       = 3307
pid-file   = /usr/local/mysql/data2/hostname.pid2
datadir    = /usr/local/mysql/data2
language   = /usr/local/mysql/share/mysql/english
user       = unix_user1

[mysqld3]
mysqld     = /path/to/mysqld_safe
ledir      = /path/to/mysqld-binary/
mysqladmin = /path/to/mysqladmin
socket     = /tmp/mysql.sock3
port       = 3308
pid-file   = /usr/local/mysql/data3/hostname.pid3
datadir    = /usr/local/mysql/data3
language   = /usr/local/mysql/share/mysql/swedish
user       = unix_user2

[mysqld4]
socket     = /tmp/mysql.sock4
port       = 3309
pid-file   = /usr/local/mysql/data4/hostname.pid4
datadir    = /usr/local/mysql/data4
language   = /usr/local/mysql/share/mysql/estonia
user       = unix_user3

[mysqld6]
socket     = /tmp/mysql.sock6
port       = 3311
pid-file   = /usr/local/mysql/data6/hostname.pid6
datadir    = /usr/local/mysql/data6
language   = /usr/local/mysql/share/mysql/japanese
user       = unix_user4
```

See Section 6.2.2.2, “Using Option Files”.
