### 4.3.2 mysqld\_safe — MySQL Server Startup Script

[**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") is the recommended way to start a [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") server on Unix. [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") adds some safety features such as restarting the server when an error occurs and logging runtime information to an error log. A description of error logging is given later in this section.

Note

For some Linux platforms, MySQL installation from RPM or Debian packages includes systemd support for managing MySQL server startup and shutdown. On these platforms, [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") is not installed because it is unnecessary. For more information, see [Section 2.5.10, “Managing MySQL Server with systemd”](using-systemd.html "2.5.10 Managing MySQL Server with systemd").

One implication of the non-use of [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") on platforms that use systemd for server management is that use of `[mysqld_safe]` or `[safe_mysqld]` sections in option files is not supported and might lead to unexpected behavior.

[**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") tries to start an executable named [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). To override the default behavior and specify explicitly the name of the server you want to run, specify a [`--mysqld`](mysqld-safe.html#option_mysqld_safe_mysqld) or [`--mysqld-version`](mysqld-safe.html#option_mysqld_safe_mysqld-version) option to [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script"). You can also use [`--ledir`](mysqld-safe.html#option_mysqld_safe_ledir) to indicate the directory where [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") should look for the server.

Many of the options to [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") are the same as the options to [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). See [Section 5.1.6, “Server Command Options”](server-options.html "5.1.6 Server Command Options").

Options unknown to [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") are passed to [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") if they are specified on the command line, but ignored if they are specified in the `[mysqld_safe]` group of an option file. See [Section 4.2.2.2, “Using Option Files”](option-files.html "4.2.2.2 Using Option Files").

[**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") reads all options from the `[mysqld]`, `[server]`, and `[mysqld_safe]` sections in option files. For example, if you specify a `[mysqld]` section like this, [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") finds and uses the [`--log-error`](mysqld-safe.html#option_mysqld_safe_log-error) option:

```sql
[mysqld]
log-error=error.log
```

For backward compatibility, [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") also reads `[safe_mysqld]` sections, but to be current you should rename such sections to `[mysqld_safe]`.

[**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") accepts options on the command line and in option files, as described in the following table. For information about option files used by MySQL programs, see [Section 4.2.2.2, “Using Option Files”](option-files.html "4.2.2.2 Using Option Files").

**Table 4.6 mysqld\_safe Options**

<table frame="box" rules="all" summary="Command-line options available for mysqld_safe."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row"><a class="link" href="mysqld-safe.html#option_mysqld_safe_basedir">--basedir</a></th> <td>Path to MySQL installation directory</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqld-safe.html#option_mysqld_safe_core-file-size">--core-file-size</a></th> <td>Size of core file that mysqld should be able to create</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqld-safe.html#option_mysqld_safe_datadir">--datadir</a></th> <td>Path to data directory</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqld-safe.html#option_mysqld_safe_defaults-extra-file">--defaults-extra-file</a></th> <td>Read named option file in addition to usual option files</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqld-safe.html#option_mysqld_safe_defaults-file">--defaults-file</a></th> <td>Read only named option file</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqld-safe.html#option_mysqld_safe_help">--help</a></th> <td>Display help message and exit</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqld-safe.html#option_mysqld_safe_ledir">--ledir</a></th> <td>Path to directory where server is located</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqld-safe.html#option_mysqld_safe_log-error">--log-error</a></th> <td>Write error log to named file</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqld-safe.html#option_mysqld_safe_malloc-lib">--malloc-lib</a></th> <td>Alternative malloc library to use for mysqld</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqld-safe.html#option_mysqld_safe_mysqld">--mysqld</a></th> <td>Name of server program to start (in ledir directory)</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqld-safe.html#option_mysqld_safe_mysqld-safe-log-timestamps">--mysqld-safe-log-timestamps</a></th> <td>Timestamp format for logging</td> <td>5.7.11</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqld-safe.html#option_mysqld_safe_mysqld-version">--mysqld-version</a></th> <td>Suffix for server program name</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqld-safe.html#option_mysqld_safe_nice">--nice</a></th> <td>Use nice program to set server scheduling priority</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqld-safe.html#option_mysqld_safe_no-defaults">--no-defaults</a></th> <td>Read no option files</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqld-safe.html#option_mysqld_safe_open-files-limit">--open-files-limit</a></th> <td>Number of files that mysqld should be able to open</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqld-safe.html#option_mysqld_safe_pid-file">--pid-file</a></th> <td>Path name of server process ID file</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqld-safe.html#option_mysqld_safe_plugin-dir">--plugin-dir</a></th> <td>Directory where plugins are installed</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqld-safe.html#option_mysqld_safe_port">--port</a></th> <td>Port number on which to listen for TCP/IP connections</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqld-safe.html#option_mysqld_safe_skip-kill-mysqld">--skip-kill-mysqld</a></th> <td>Do not try to kill stray mysqld processes</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqld-safe.html#option_mysqld_safe_syslog">--skip-syslog</a></th> <td>Do not write error messages to syslog; use error log file</td> <td></td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="mysqld-safe.html#option_mysqld_safe_socket">--socket</a></th> <td>Socket file on which to listen for Unix socket connections</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqld-safe.html#option_mysqld_safe_syslog">--syslog</a></th> <td>Write error messages to syslog</td> <td></td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="mysqld-safe.html#option_mysqld_safe_syslog-tag">--syslog-tag</a></th> <td>Tag suffix for messages written to syslog</td> <td></td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="mysqld-safe.html#option_mysqld_safe_timezone">--timezone</a></th> <td>Set TZ time zone environment variable to named value</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqld-safe.html#option_mysqld_safe_user">--user</a></th> <td>Run mysqld as user having name user_name or numeric user ID user_id</td> <td></td> <td></td> </tr></tbody></table>

* [`--help`](mysqld-safe.html#option_mysqld_safe_help)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* [`--basedir=dir_name`](mysqld-safe.html#option_mysqld_safe_basedir)

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The path to the MySQL installation directory.

* [`--core-file-size=size`](mysqld-safe.html#option_mysqld_safe_core-file-size)

  <table frame="box" rules="all" summary="Properties for core-file-size"><tbody><tr><th>Command-Line Format</th> <td><code>--core-file-size=size</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  <table frame="box" rules="all" summary="Properties for core-file-size"><tbody><tr><th>Command-Line Format</th> <td><code>--core-file-size=size</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The size of the core file that [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") should be able to create. The option value is passed to **ulimit -c**.

* [`--datadir=dir_name`](mysqld-safe.html#option_mysqld_safe_datadir)

  <table frame="box" rules="all" summary="Properties for datadir"><tbody><tr><th>Command-Line Format</th> <td><code>--datadir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  <table frame="box" rules="all" summary="Properties for datadir"><tbody><tr><th>Command-Line Format</th> <td><code>--datadir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The path to the data directory.

* [`--defaults-extra-file=file_name`](mysqld-safe.html#option_mysqld_safe_defaults-extra-file)

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

  Read this option file in addition to the usual option files. If the file does not exist or is otherwise inaccessible, the server exits with an error. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory. This must be the first option on the command line if it is used.

  For additional information about this and other option-file options, see [Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-file=file_name`](mysqld-safe.html#option_mysqld_safe_defaults-file)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

  Use only the given option file. If the file does not exist or is otherwise inaccessible, the server exits with an error. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory. This must be the first option on the command line if it is used.

  For additional information about this and other option-file options, see [Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--ledir=dir_name`](mysqld-safe.html#option_mysqld_safe_ledir)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

  If [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") cannot find the server, use this option to indicate the path name to the directory where the server is located.

  As of MySQL 5.7.17, this option is accepted only on the command line, not in option files. On platforms that use systemd, the value can be specified in the value of `MYSQLD_OPTS`. See [Section 2.5.10, “Managing MySQL Server with systemd”](using-systemd.html "2.5.10 Managing MySQL Server with systemd").

* [`--log-error=file_name`](mysqld-safe.html#option_mysqld_safe_log-error)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

  Write the error log to the given file. See [Section 5.4.2, “The Error Log”](error-log.html "5.4.2 The Error Log").

* [`--mysqld-safe-log-timestamps`](mysqld-safe.html#option_mysqld_safe_mysqld-safe-log-timestamps)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

  This option controls the format for timestamps in log output produced by [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script"). The following list describes the permitted values. For any other value, [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") logs a warning and uses `UTC` format.

  + `UTC`, `utc`

    ISO 8601 UTC format (same as [`--log_timestamps=UTC`](server-system-variables.html#sysvar_log_timestamps) for the server). This is the default.

  + `SYSTEM`, `system`

    ISO 8601 local time format (same as [`--log_timestamps=SYSTEM`](server-system-variables.html#sysvar_log_timestamps) for the server).

  + `HYPHEN`, `hyphen`

    *`YY-MM-DD h:mm:ss`* format, as in [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") for MySQL 5.6.

  + `LEGACY`, `legacy`

    *`YYMMDD hh:mm:ss`* format, as in [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") prior to MySQL 5.6.

  This option was added in MySQL 5.7.11.

* [`--malloc-lib=[lib_name]`](mysqld-safe.html#option_mysqld_safe_malloc-lib)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

  The name of the library to use for memory allocation instead of the system `malloc()` library. As of MySQL 5.7.15, the option value must be one of the directories `/usr/lib`, `/usr/lib64`, `/usr/lib/i386-linux-gnu`, or `/usr/lib/x86_64-linux-gnu`. Prior to MySQL 5.7.15, any library can be used by specifying its path name, but there is a shortcut form to enable use of the `tcmalloc` library that is shipped with binary MySQL distributions for Linux in MySQL 5.7. It is possible for the shortcut form not to work under certain configurations, in which case you should specify a path name instead.

  Note

  As of MySQL 5.7.13, MySQL distributions no longer include a `tcmalloc` library.

  The [`--malloc-lib`](mysqld-safe.html#option_mysqld_safe_malloc-lib) option works by modifying the `LD_PRELOAD` environment value to affect dynamic linking to enable the loader to find the memory-allocation library when [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") runs:

  + If the option is not given, or is given without a value ([`--malloc-lib=`](mysqld-safe.html#option_mysqld_safe_malloc-lib)), `LD_PRELOAD` is not modified and no attempt is made to use `tcmalloc`.

  + Prior to MySQL 5.7.31, if the option is given as [`--malloc-lib=tcmalloc`](mysqld-safe.html#option_mysqld_safe_malloc-lib), [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") looks for a `tcmalloc` library in `/usr/lib` and then in the MySQL `pkglibdir` location (for example, `/usr/local/mysql/lib` or whatever is appropriate). If `tmalloc` is found, its path name is added to the beginning of the `LD_PRELOAD` value for [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). If `tcmalloc` is not found, [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") aborts with an error.

    As of MySQL 5.7.31, `tcmalloc` is not a permitted value for the [`--malloc-lib`](mysqld-safe.html#option_mysqld_safe_malloc-lib) option.

  + If the option is given as [`--malloc-lib=/path/to/some/library`](mysqld-safe.html#option_mysqld_safe_malloc-lib), that full path is added to the beginning of the `LD_PRELOAD` value. If the full path points to a nonexistent or unreadable file, [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") aborts with an error.

  + For cases where [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") adds a path name to `LD_PRELOAD`, it adds the path to the beginning of any existing value the variable already has.

  Note

  On systems that manage the server using systemd, [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") is not available. Instead, specify the allocation library by setting `LD_PRELOAD` in `/etc/sysconfig/mysql`.

  Linux users can use the `libtcmalloc_minimal.so` included in binary packages by adding these lines to the `my.cnf` file:

  ```sql
  [mysqld_safe]
  malloc-lib=tcmalloc
  ```

  Those lines also suffice for users on any platform who have installed a `tcmalloc` package in `/usr/lib`. To use a specific `tcmalloc` library, specify its full path name. Example:

  ```sql
  [mysqld_safe]
  malloc-lib=/opt/lib/libtcmalloc_minimal.so
  ```

* [`--mysqld=prog_name`](mysqld-safe.html#option_mysqld_safe_mysqld)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

  The name of the server program (in the `ledir` directory) that you want to start. This option is needed if you use the MySQL binary distribution but have the data directory outside of the binary distribution. If [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") cannot find the server, use the [`--ledir`](mysqld-safe.html#option_mysqld_safe_ledir) option to indicate the path name to the directory where the server is located.

  As of MySQL 5.7.15, this option is accepted only on the command line, not in option files. On platforms that use systemd, the value can be specified in the value of `MYSQLD_OPTS`. See [Section 2.5.10, “Managing MySQL Server with systemd”](using-systemd.html "2.5.10 Managing MySQL Server with systemd").

* [`--mysqld-version=suffix`](mysqld-safe.html#option_mysqld_safe_mysqld-version)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

  This option is similar to the [`--mysqld`](mysqld-safe.html#option_mysqld_safe_mysqld) option, but you specify only the suffix for the server program name. The base name is assumed to be [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). For example, if you use [`--mysqld-version=debug`](mysqld-safe.html#option_mysqld_safe_mysqld-version), [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") starts the [**mysqld-debug**](mysqld.html "4.3.1 mysqld — The MySQL Server") program in the `ledir` directory. If the argument to [`--mysqld-version`](mysqld-safe.html#option_mysqld_safe_mysqld-version) is empty, [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") uses [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") in the `ledir` directory.

  As of MySQL 5.7.15, this option is accepted only on the command line, not in option files. On platforms that use systemd, the value can be specified in the value of `MYSQLD_OPTS`. See [Section 2.5.10, “Managing MySQL Server with systemd”](using-systemd.html "2.5.10 Managing MySQL Server with systemd").

* [`--nice=priority`](mysqld-safe.html#option_mysqld_safe_nice)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

  Use the `nice` program to set the server's scheduling priority to the given value.

* [`--no-defaults`](mysqld-safe.html#option_mysqld_safe_no-defaults)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

  Do not read any option files. If program startup fails due to reading unknown options from an option file, [`--no-defaults`](mysqld-safe.html#option_mysqld_safe_no-defaults) can be used to prevent them from being read. This must be the first option on the command line if it is used.

  For additional information about this and other option-file options, see [Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--open-files-limit=count`](mysqld-safe.html#option_mysqld_safe_open-files-limit)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

  The number of files that [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") should be able to open. The option value is passed to **ulimit -n**.

  Note

  You must start [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") as `root` for this to function properly.

* [`--pid-file=file_name`](mysqld-safe.html#option_mysqld_safe_pid-file)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

  The path name that [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") should use for its process ID file.

  From MySQL 5.7.2 to 5.7.17, [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") has its own process ID file, which is always named `mysqld_safe.pid` and located in the MySQL data directory.

* [`--plugin-dir=dir_name`](mysqld-safe.html#option_mysqld_safe_plugin-dir)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

  The path name of the plugin directory.

* [`--port=port_num`](mysqld-safe.html#option_mysqld_safe_port)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

  The port number that the server should use when listening for TCP/IP connections. The port number must be 1024 or higher unless the server is started by the `root` operating system user.

* [`--skip-kill-mysqld`](mysqld-safe.html#option_mysqld_safe_skip-kill-mysqld)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

  Do not try to kill stray [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") processes at startup. This option works only on Linux.

* [`--socket=path`](mysqld-safe.html#option_mysqld_safe_socket)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

  The Unix socket file that the server should use when listening for local connections.

* [`--syslog`](mysqld-safe.html#option_mysqld_safe_syslog), [`--skip-syslog`](mysqld-safe.html#option_mysqld_safe_syslog)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

  [`--syslog`](mysqld-safe.html#option_mysqld_safe_syslog) causes error messages to be sent to `syslog` on systems that support the **logger** program. `--skip-syslog` suppresses the use of `syslog`; messages are written to an error log file.

  When `syslog` is used for error logging, the `daemon.err` facility/severity is used for all log messages.

  Using these options to control [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") logging is deprecated as of MySQL 5.7.5. Use the server [`log_syslog`](server-system-variables.html#sysvar_log_syslog) system variable instead. To control the facility, use the server [`log_syslog_facility`](server-system-variables.html#sysvar_log_syslog_facility) system variable. See [Section 5.4.2.3, “Error Logging to the System Log”](error-log-syslog.html "5.4.2.3 Error Logging to the System Log").

* [`--syslog-tag=tag`](mysqld-safe.html#option_mysqld_safe_syslog-tag)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

  For logging to `syslog`, messages from [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") and [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") are written with identifiers of `mysqld_safe` and `mysqld`, respectively. To specify a suffix for the identifiers, use [`--syslog-tag=tag`](mysqld-safe.html#option_mysqld_safe_syslog-tag), which modifies the identifiers to be `mysqld_safe-tag` and `mysqld-tag`.

  Using this option to control [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") logging is deprecated as of MySQL 5.7.5. Use the server [`log_syslog_tag`](server-system-variables.html#sysvar_log_syslog_tag) system variable instead. See [Section 5.4.2.3, “Error Logging to the System Log”](error-log-syslog.html "5.4.2.3 Error Logging to the System Log").

* [`--timezone=timezone`](mysqld-safe.html#option_mysqld_safe_timezone)

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

  Set the `TZ` time zone environment variable to the given option value. Consult your operating system documentation for legal time zone specification formats.

* [`--user={user_name|user_id}`](mysqld-safe.html#option_mysqld_safe_user)

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>0

  Run the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") server as the user having the name *`user_name`* or the numeric user ID *`user_id`*. (“User” in this context refers to a system login account, not a MySQL user listed in the grant tables.)

If you execute [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") with the [`--defaults-file`](mysqld-safe.html#option_mysqld_safe_defaults-file) or [`--defaults-extra-file`](mysqld-safe.html#option_mysqld_safe_defaults-extra-file) option to name an option file, the option must be the first one given on the command line or the option file is not used. For example, this command does not use the named option file:

```sql
mysql> mysqld_safe --port=port_num --defaults-file=file_name
```

Instead, use the following command:

```sql
mysql> mysqld_safe --defaults-file=file_name --port=port_num
```

The [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") script is written so that it normally can start a server that was installed from either a source or a binary distribution of MySQL, even though these types of distributions typically install the server in slightly different locations. (See [Section 2.1.5, “Installation Layouts”](installation-layouts.html "2.1.5 Installation Layouts").) [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") expects one of the following conditions to be true:

* The server and databases can be found relative to the working directory (the directory from which [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") is invoked). For binary distributions, [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") looks under its working directory for `bin` and `data` directories. For source distributions, it looks for `libexec` and `var` directories. This condition should be met if you execute [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") from your MySQL installation directory (for example, `/usr/local/mysql` for a binary distribution).

* If the server and databases cannot be found relative to the working directory, [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") attempts to locate them by absolute path names. Typical locations are `/usr/local/libexec` and `/usr/local/var`. The actual locations are determined from the values configured into the distribution at the time it was built. They should be correct if MySQL is installed in the location specified at configuration time.

Because [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") tries to find the server and databases relative to its own working directory, you can install a binary distribution of MySQL anywhere, as long as you run [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") from the MySQL installation directory:

```sql
cd mysql_installation_directory
bin/mysqld_safe &
```

If [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") fails, even when invoked from the MySQL installation directory, specify the [`--ledir`](mysqld-safe.html#option_mysqld_safe_ledir) and [`--datadir`](mysqld-safe.html#option_mysqld_safe_datadir) options to indicate the directories in which the server and databases are located on your system.

[**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") tries to use the **sleep** and **date** system utilities to determine how many times per second it has attempted to start. If these utilities are present and the attempted starts per second is greater than 5, [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") waits 1 full second before starting again. This is intended to prevent excessive CPU usage in the event of repeated failures. (Bug #11761530, Bug #54035)

When you use [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") to start [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") arranges for error (and notice) messages from itself and from [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") to go to the same destination.

There are several [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") options for controlling the destination of these messages:

* [`--log-error=file_name`](mysqld-safe.html#option_mysqld_safe_log-error): Write error messages to the named error file.

* [`--syslog`](mysqld-safe.html#option_mysqld_safe_syslog): Write error messages to `syslog` on systems that support the **logger** program.

* [`--skip-syslog`](mysqld-safe.html#option_mysqld_safe_syslog): Do not write error messages to `syslog`. Messages are written to the default error log file (`host_name.err` in the data directory), or to a named file if the [`--log-error`](mysqld-safe.html#option_mysqld_safe_log-error) option is given.

If none of these options is given, the default is [`--skip-syslog`](mysqld-safe.html#option_mysqld_safe_syslog).

When [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") writes a message, notices go to the logging destination (`syslog` or the error log file) and `stdout`. Errors go to the logging destination and `stderr`.

Note

Controlling [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") logging from [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") is deprecated as of MySQL 5.7.5. Use the server's native `syslog` support instead. For more information, see [Section 5.4.2.3, “Error Logging to the System Log”](error-log-syslog.html "5.4.2.3 Error Logging to the System Log").
