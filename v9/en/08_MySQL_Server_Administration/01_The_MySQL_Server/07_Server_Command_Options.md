### 7.1.7 Server Command Options

When you start the **mysqld** server, you can specify program options using any of the methods described in Section 6.2.2, “Specifying Program Options”. The most common methods are to provide options in an option file or on the command line. However, in most cases it is desirable to make sure that the server uses the same options each time it runs. The best way to ensure this is to list them in an option file. See Section 6.2.2.2, “Using Option Files”. That section also describes option file format and syntax.

**mysqld** reads options from the `[mysqld]` and `[server]` groups. **mysqld\_safe** reads options from the `[mysqld]`, `[server]`, `[mysqld_safe]`, and `[safe_mysqld]` groups. **mysql.server** reads options from the `[mysqld]` and `[mysql.server]` groups.

**mysqld** accepts many command options. For a brief summary, execute this command:

```
mysqld --help
```

To see the full list, use this command:

```
mysqld --verbose --help
```

Some of the items in the list are actually system variables that can be set at server startup. These can be displayed at runtime using the `SHOW VARIABLES` statement. Some items displayed by the preceding **mysqld** command do not appear in `SHOW VARIABLES` output; this is because they are options only and not system variables.

The following list shows some of the most common server options. Additional options are described in other sections:

* Options that affect security: See Section 8.1.4, “Security-Related mysqld Options and Variables”.

* SSL-related options: See Command Options for Encrypted Connections.

* Binary log control options: See Section 7.4.4, “The Binary Log”.
* Replication-related options: See Section 19.1.6, “Replication and Binary Logging Options and Variables”.

* Options for loading plugins such as pluggable storage engines: See Section 7.6.1, “Installing and Uninstalling Plugins”.

* Options specific to particular storage engines: See Section 17.14, “InnoDB Startup Options and System Variables” and Section 18.2.1, “MyISAM Startup Options”.

Some options control the size of buffers or caches. For a given buffer, the server might need to allocate internal data structures. These structures typically are allocated from the total memory allocated to the buffer, and the amount of space required might be platform dependent. This means that when you assign a value to an option that controls a buffer size, the amount of space actually available might differ from the value assigned. In some cases, the amount might be less than the value assigned. It is also possible that the server adjusts a value upward. For example, if you assign a value of 0 to an option for which the minimal value is 1024, the server sets the value to 1024.

Values for buffer sizes, lengths, and stack sizes are given in bytes unless otherwise specified.

Some options take file name values. Unless otherwise specified, the default file location is the data directory if the value is a relative path name. To specify the location explicitly, use an absolute path name. Suppose that the data directory is `/var/mysql/data`. If a file-valued option is given as a relative path name, it is located under `/var/mysql/data`. If the value is an absolute path name, its location is as given by the path name.

You can also set the values of server system variables at server startup by using variable names as options. To assign a value to a server system variable, use an option of the form `--var_name=value`. For example, `--sort_buffer_size=384M` sets the `sort_buffer_size` variable to a value of 384MB.

When you assign a value to a variable, MySQL might automatically correct the value to stay within a given range, or adjust the value to the closest permissible value if only certain values are permitted.

To restrict the maximum value to which a system variable can be set at runtime with the `SET` statement, specify this maximum by using an option of the form `--maximum-var_name=value` at server startup.

You can change the values of most system variables at runtime with the `SET` statement. See Section 15.7.6.1, “SET Syntax for Variable Assignment”.

Section 7.1.8, “Server System Variables”, provides a full description for all variables, and additional information for setting them at server startup and runtime. For information on changing system variables, see Section 7.1.1, “Configuring the Server”.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a short help message and exit. Use both the `--verbose` and `--help` options to see the full message.

* `--allow-suspicious-udfs`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  This option controls whether loadable functions that have only an `xxx` symbol for the main function can be loaded. By default, the option is off and only loadable functions that have at least one auxiliary symbol can be loaded; this prevents attempts at loading functions from shared object files other than those containing legitimate functions. See Loadable Function Security Precautions.

* `--ansi`

  <table frame="box" rules="all" summary="Properties for ansi"><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>

  Use standard (ANSI) SQL syntax instead of MySQL syntax. For more precise control over the server SQL mode, use the `--sql-mode` option instead. See Section 1.7, “MySQL Standards Compliance”, and Section 7.1.11, “Server SQL Modes”.

* `--basedir=dir_name`, `-b dir_name`

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>parent of mysqld installation directory</code></td> </tr></tbody></table>

  The path to the MySQL installation directory. This option sets the `basedir` system variable.

  The server executable determines its own full path name at startup and uses the parent of the directory in which it is located as the default `basedir` value. This in turn enables the server to use that `basedir` when searching for server-related information such as the `share` directory containing error messages.

* `--check-table-functions=value`

  <table frame="box" rules="all" summary="Properties for check-table-functions"><tbody><tr><th>Command-Line Format</th> <td><code>--check-table-functions=value</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ABORT</code></td> </tr><tr><th>Valid Values</th> <td><p><code>WARN</code></p><p><code>ABORT</code></p></td> </tr></tbody></table>

  When performing an upgade of the server, we scan the data dictionary for functions used in table constraints and other expressions, including `DEFAULT` expressions, partitioning expressions, and virtual columns. It is possible that a change in the behavior of the function causes it to raise an error in the new version of the server, where no such error occurred before in which case the table cannot be opened. This option provides a choice in how to handle such problems, according to which of the two values shown here is used:

  + `WARN`: Log a warning for each table that cannot be opened.

  + `ABORT`: Also logs a warning; in addition, the upgrade is stopped. This is the default. For a sufficiently high value of `--log-error-verbosity`, it also logs a note with a streamlined table definition listing only those expressions that potentially contain SQL functions.

  The default behaviour is to abort the upgrade, so that the user can fix the issue using the older version of the server, before upgrading to the newer one. Use `WARN` to continue the upgrade in interactive mode while reporting any issues.

* `--chroot=dir_name`, `-r dir_name`

  <table frame="box" rules="all" summary="Properties for chroot"><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  Put the **mysqld** server in a closed environment during startup by using the `chroot()` system call. This is a recommended security measure. Use of this option somewhat limits `LOAD DATA` and `SELECT ... INTO OUTFILE`.

* `--console`

  <table frame="box" rules="all" summary="Properties for console"><tbody><tr><th>Command-Line Format</th> <td><code>--console</code></td> </tr><tr><th>Platform Specific</th> <td>Windows</td> </tr></tbody></table>

  (Windows only.) Cause the default error log destination to be the console. This affects log sinks that base their own output destination on the default destination. See Section 7.4.2, “The Error Log”. **mysqld** does not close the console window if this option is used.

  `--console` takes precedence over `--log-error` if both are given.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

  When this option is used, write a core file if **mysqld** dies; no arguments are needed (or accepted). The name and location of the core file is system dependent. On Linux, a core file named `core.pid` is written to the current working directory of the process, which for **mysqld** is the data directory. *`pid`* represents the process ID of the server process. On macOS, a core file named `core.pid` is written to the `/cores` directory. On Solaris, use the **coreadm** command to specify where to write the core file and how to name it.

  For some systems, to get a core file you must also specify the `--core-file-size` option to **mysqld\_safe**. See Section 6.3.2, “mysqld\_safe — MySQL Server Startup Script”. On some systems, such as Solaris, you do not get a core file if you are also using the `--user` option. There might be additional restrictions or limitations. For example, it might be necessary to execute **ulimit -c unlimited** before starting the server. Consult your system documentation.

  The `innodb_buffer_pool_in_core_file` variable can be used to reduce the size of core files on operating systems that support it. For more information, see Section 17.8.3.7, “Excluding or Including Buffer Pool Pages from Core Files”.

* `--daemonize`, `-D`

  <table frame="box" rules="all" summary="Properties for daemonize"><tbody><tr><th>Command-Line Format</th> <td><code>--daemonize[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  This option causes the server to run as a traditional, forking daemon, permitting it to work with operating systems that use systemd for process control. For more information, see Section 2.5.9, “Managing MySQL Server with systemd”.

  `--daemonize` is mutually exclusive with `--initialize` and `--initialize-insecure`.

  If the server is started using the `--daemonize` option and is not connected to a tty device, a default error logging option of `--log-error=""` is used in the absence of an explicit logging option, to direct error output to the default log file.

  `-D` is a synonym for `--daemonize`.

* `--datadir=dir_name`, `-h dir_name`

  <table frame="box" rules="all" summary="Properties for datadir"><tbody><tr><th>Command-Line Format</th> <td><code>--datadir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>datadir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The path to the MySQL server data directory. This option sets the `datadir` system variable. See the description of that variable.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

  If MySQL is configured with the `-DWITH_DEBUG=1` **CMake** option, you can use this option to get a trace file of what **mysqld** is doing. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:i:o,/tmp/mysqld.trace` on Unix and `d:t:i:O,\mysqld.trace` on Windows.

  Using `-DWITH_DEBUG=1` to configure MySQL with debugging support enables you to use the `--debug="d,parser_debug"` option when you start the server. This causes the Bison parser that is used to process SQL statements to dump a parser trace to the server's standard error output. Typically, this output is written to the error log.

  This option may be given multiple times. Values that begin with `+` or `-` are added to or subtracted from the previous value. For example, `--debug=T` `--debug=+P` sets the value to `P:T`.

  For more information, see Section 7.9.4, “The DBUG Package”.

* `--debug-sync-timeout[=N]`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

  Controls whether the Debug Sync facility for testing and debugging is enabled. Use of Debug Sync requires that MySQL be configured with the `-DWITH_DEBUG=ON` **CMake** option (see Section 2.8.7, “MySQL Source-Configuration Options”); otherwise, this option is not available. The option value is a timeout in seconds. The default value is 0, which disables Debug Sync. To enable it, specify a value greater than 0; this value also becomes the default timeout for individual synchronization points. If the option is given without a value, the timeout is set to 300 seconds.

  For a description of the Debug Sync facility and how to use synchronization points, see MySQL Internals: Test Synchronization.

* `--default-time-zone=timezone`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

  Set the default server time zone. This option sets the global `time_zone` system variable. If this option is not given, the default time zone is the same as the system time zone (given by the value of the `system_time_zone` system variable.

  The `system_time_zone` variable differs from `time_zone`. Although they might have the same value, the latter variable is used to initialize the time zone for each client that connects. See Section 7.1.15, “MySQL Server Time Zone Support”.

* `--defaults-extra-file=file_name`

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory. This must be the first option on the command line if it is used.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  Read only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, **mysqld** reads `mysqld-auto.cnf`.

  Note

  This must be the first option on the command line if it is used, except that if the server is started with the `--defaults-file` and `--install` (or `--install-manual`) options, `--install` (or `--install-manual`) must be first.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysqld** normally reads the `[mysqld]` group. If this option is given as `--defaults-group-suffix=_other`, **mysqld** also reads the `[mysqld_other]` group.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--early-plugin-load=plugin_list`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>3

  Note

  This option is deprecated, and starting the server with it produces a warning. This is part of an ongoing process to replace all MySQL plugins with MySQL components. If you have not already done so, you should migrate from any plugins you are using to the equivalent components where these are available; this applies especially to keyring plugins, all of which are now deprecated. For more information, see Section 8.4.5.1, “Keyring Components Versus Keyring Plugins”.

  This option tells the server which plugins to load before loading mandatory built-in plugins and before storage engine initialization. Early loading is supported only for plugins compiled with `PLUGIN_OPT_ALLOW_EARLY`. If multiple `--early-plugin-load` options are given, only the last one applies.

  The option value is a semicolon-separated list of *`plugin_library`* values, `name=plugin_library` values, or both. Each *`plugin_library`* is the name of a library file that contains plugin code, and each *`name`* is the name of a plugin to load. If a plugin library is named without any preceding plugin name, the server loads all plugins in the library. With a preceding plugin name, the server loads only the named plugin from the library. The server looks for plugin library files in the directory named by the `plugin_dir` system variable.

  For example, if plugins named `myplug1` and `myplug2` are contained in the plugin library files `myplug1.so` and `myplug2.so`, use this option to perform an early plugin load:

  ```
  mysqld --early-plugin-load="myplug1=myplug1.so;myplug2=myplug2.so"
  ```

  Quotes surround the argument value because otherwise some command interpreters interpret semicolon (`;`) as a special character. (For example, Unix shells treat it as a command terminator.)

  Each named plugin is loaded early for a single invocation of **mysqld** only. After a restart, the plugin is not loaded early unless `--early-plugin-load` is used again.

  If the server is started using `--initialize` or `--initialize-insecure`, plugins specified by `--early-plugin-load` are not loaded.

  If the server is run with `--help`, plugins specified by `--early-plugin-load` are loaded but not initialized. This behavior ensures that plugin options are displayed in the help message.

  `InnoDB` tablespace encryption relies on the MySQL Keyring for encryption key management, and the keyring plugin to be used must be loaded prior to storage engine initialization to facilitate `InnoDB` recovery for encrypted tables. For example, administrators who want the `keyring_okv` plugin loaded at startup should use `--early-plugin-load` with the appropriate option value (such as `keyring_okv.so` on Unix and Unix-like systems or `keyring_okv.dll` on Windows).

  For information about `InnoDB` tablespace encryption, see Section 17.13, “InnoDB Data-at-Rest Encryption”. For general information about plugin loading, see Section 7.6.1, “Installing and Uninstalling Plugins”.

  Note

  For MySQL Keyring, this option is used only when the keystore is managed with a keyring plugin. If keystore management uses a keyring component rather than a plugin, specify component loading using a manifest file; see Section 8.4.5.2, “Keyring Component Installation”.

* `--exit-info[=flags]`, `-T [flags]`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>4

  This is a bitmask of different flags that you can use for debugging the **mysqld** server. Do not use this option unless you know *exactly* what it does!

* `--external-locking`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>5

  Enable external locking (system locking), which is disabled by default. If you use this option on a system on which `lockd` does not fully work (such as Linux), it is easy for **mysqld** to deadlock.

  To disable external locking explicitly, use `--skip-external-locking`.

  External locking affects only `MyISAM` table access. For more information, including conditions under which it can and cannot be used, see Section 10.11.5, “External Locking”.

* `--flush`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>6

  Flush (synchronize) all changes to disk after each SQL statement. Normally, MySQL does a write of all changes to disk only after each SQL statement and lets the operating system handle the synchronizing to disk. See Section B.3.3.3, “What to Do If MySQL Keeps Crashing”.

  Note

  If `--flush` is specified, the value of `flush_time` does not matter and changes to `flush_time` have no effect on flush behavior.

* `--gdb`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>7

  Install an interrupt handler for `SIGINT` (needed to stop **mysqld** with `^C` to set breakpoints) and disable stack tracing and core file handling. See Section 7.9.1.4, “Debugging mysqld under gdb”.

  On Windows, this option also suppresses the forking that is used to implement the `RESTART` statement: Forking enables one process to act as a monitor to the other, which acts as the server. However, forking makes determining the server process to attach to for debugging more difficult, so starting the server with `--gdb` suppresses forking. For a server started with this option, `RESTART` simply exits and does not restart.

  In non-debug settings, `--no-monitor` may be used to suppress forking the monitor process.

* `--initialize`, `-I`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>8

  This option is used to initialize a MySQL installation by creating the data directory and populating the tables in the `mysql` system schema. For more information, see Section 2.9.1, “Initializing the Data Directory”.

  This option limits the effects of, or is not compatible with, a number of other startup options for the MySQL server. Some of the most common issues of this sort are noted here:

  + We strongly recommend, when initializing the data directory with `--initialize`, that you specify no additional options other than `--datadir`, other options used for setting directory locations such as `--basedir`, and possibly `--user`, if required. Options for the running MySQL server can be specified when starting it once initialization has been completed and **mysqld** has shut down. This also applies when using `--initialize-insecure` instead of `--initialize`.

  + When the server is started with `--initialize`, some functionality is unavailable that limits the statements permitted in any file named by the `init_file` system variable. For more information, see the description of that variable. In addition, the `disabled_storage_engines` system variable has no effect.

  + The `--ndbcluster` option is ignored when used together with `--initialize`.

  + `--initialize` is mutually exclusive with `--bootstrap` and `--daemonize`.

  The items in the preceding list also apply when initializing the server using the `--initialize-insecure` option.

* `--initialize-insecure`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>9

  This option is used to initialize a MySQL installation by creating the data directory and populating the tables in the `mysql` system schema. This option implies `--initialize`, and the same restrictions and limitations apply; for more information, see the description of that option, and Section 2.9.1, “Initializing the Data Directory”.

  Warning

  This option creates a MySQL `root` user with an empty password, which is insecure. For this reason, do not use it in production without setting this password manually. See Post-Initialization root Password Assignment, for information about how to do this.

* `--innodb-xxx`

  Set an option for the `InnoDB` storage engine. The `InnoDB` options are listed in Section 17.14, “InnoDB Startup Options and System Variables”.

* `--install [service_name]`

  <table frame="box" rules="all" summary="Properties for ansi"><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>0

  (Windows only) Install the server as a Windows service that starts automatically during Windows startup. The default service name is `MySQL` if no *`service_name`* value is given. For more information, see Section 2.3.3.8, “Starting MySQL as a Windows Service”.

  Note

  If the server is started with the `--defaults-file` and `--install` options, `--install` must be first.

* `--install-manual [service_name]`

  <table frame="box" rules="all" summary="Properties for ansi"><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>1

  (Windows only) Install the server as a Windows service that must be started manually. It does not start automatically during Windows startup. The default service name is `MySQL` if no *`service_name`* value is given. For more information, see Section 2.3.3.8, “Starting MySQL as a Windows Service”.

  Note

  If the server is started with the `--defaults-file` and `--install-manual` options, `--install-manual` must be first.

* `--large-pages`

  <table frame="box" rules="all" summary="Properties for ansi"><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>2

  Some hardware/operating system architectures support memory pages greater than the default (usually 4KB). The actual implementation of this support depends on the underlying hardware and operating system. Applications that perform a lot of memory accesses may obtain performance improvements by using large pages due to reduced Translation Lookaside Buffer (TLB) misses.

  MySQL supports the Linux implementation of large page support (which is called HugeTLB in Linux). See Section 10.12.3.3, “Enabling Large Page Support”. For Solaris support of large pages, see the description of the `--super-large-pages` option.

  `--large-pages` is disabled by default.

* `--lc-messages=locale_name`

  <table frame="box" rules="all" summary="Properties for ansi"><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>3

  The locale to use for error messages. The default is `en_US`. The server converts the argument to a language name and combines it with the value of `--lc-messages-dir` to produce the location for the error message file. See Section 12.12, “Setting the Error Message Language”.

* `--lc-messages-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for ansi"><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>4

  The directory where error messages are located. The server uses the value together with the value of `--lc-messages` to produce the location for the error message file. See Section 12.12, “Setting the Error Message Language”.

* `--local-service`

  <table frame="box" rules="all" summary="Properties for ansi"><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>5

  (Windows only) A `--local-service` option following the service name causes the server to run using the `LocalService` Windows account that has limited system privileges. If both `--defaults-file` and `--local-service` are given following the service name, they can be in any order. See Section 2.3.3.8, “Starting MySQL as a Windows Service”.

* `--log-diagnostic[=value]`

  <table frame="box" rules="all" summary="Properties for ansi"><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>6

  Set the name of the diagnostic log file to this value suffixed with `.diag` if the server is started with `--log-diagnostic-enable`; otherwise has no effect. The default diagnostic log file name is `host_name.diag`.

  For internal use only. Available only if the server was built using `-DWITH_LOG_DIAGNOSTIC`.

* `--log-diagnostic-enable[=value]`

  <table frame="box" rules="all" summary="Properties for ansi"><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>7

  Enable diagnostic logging.

  For internal use only. Available only if the server was built using `-DWITH_LOG_DIAGNOSTIC`.

* `--log-error[=file_name]`

  <table frame="box" rules="all" summary="Properties for ansi"><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>8

  Set the default error log destination to the named file. This affects log sinks that base their own output destination on the default destination. See Section 7.4.2, “The Error Log”.

  If the option names no file, the default error log destination on Unix and Unix-like systems is a file named `host_name.err` in the data directory. The default destination on Windows is the same, unless the `--pid-file` option is specified. In that case, the file name is the PID file base name with a suffix of `.err` in the data directory.

  If the option names a file, the default destination is that file (with an `.err` suffix added if the name has no suffix), located under the data directory unless an absolute path name is given to specify a different location.

  If error log output cannot be redirected to the error log file, an error occurs and startup fails.

  On Windows, `--console` takes precedence over `--log-error` if both are given. In this case, the default error log destination is the console rather than a file.

* `--log-isam[=file_name]`

  <table frame="box" rules="all" summary="Properties for ansi"><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>9

  Log all `MyISAM` changes to this file (used only when debugging `MyISAM`).

* `--log-raw`

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>parent of mysqld installation directory</code></td> </tr></tbody></table>0

  Passwords in certain statements written to the general query log, slow query log, and binary log are rewritten by the server not to occur literally in plain text. Password rewriting can be suppressed for the general query log by starting the server with the `--log-raw` option. This option may be useful for diagnostic purposes, to see the exact text of statements as received by the server, but for security reasons is not recommended for production use.

  If a query rewrite plugin is installed, the `--log-raw` option affects statement logging as follows:

  + Without `--log-raw`, the server logs the statement returned by the query rewrite plugin. This may differ from the statement as received.

  + With `--log-raw`, the server logs the original statement as received.

  For more information, see Section 8.1.2.3, “Passwords and Logging”.

* `--log-short-format`

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>parent of mysqld installation directory</code></td> </tr></tbody></table>1

  Log less information to the slow query log, if it has been activated.

* `--log-tc=file_name`

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>parent of mysqld installation directory</code></td> </tr></tbody></table>2

  The name of the memory-mapped transaction coordinator log file (for XA transactions that affect multiple storage engines when the binary log is disabled). The default name is `tc.log`. The file is created under the data directory if not given as a full path name. This option is unused.

* `--log-tc-size=size`

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>parent of mysqld installation directory</code></td> </tr></tbody></table>3

  The size in bytes of the memory-mapped transaction coordinator log. The default and minimum values are 6 times the page size, and the value must be a multiple of the page size.

* `--memlock`

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>parent of mysqld installation directory</code></td> </tr></tbody></table>4

  Lock the **mysqld** process in memory. This option might help if you have a problem where the operating system is causing **mysqld** to swap to disk.

  `--memlock` works on systems that support the `mlockall()` system call; this includes Solaris, most Linux distributions that use a 2.4 or higher kernel, and perhaps other Unix systems. On Linux systems, you can tell whether or not `mlockall()` (and thus this option) is supported by checking to see whether or not it is defined in the system `mman.h` file, like this:

  ```
  $> grep mlockall /usr/include/sys/mman.h
  ```

  If `mlockall()` is supported, you should see in the output of the previous command something like the following:

  ```
  extern int mlockall (int __flags) __THROW;
  ```

  Important

  Use of this option may require you to run the server as `root`, which, for reasons of security, is normally not a good idea. See Section 8.1.5, “How to Run MySQL as a Normal User”.

  On Linux and perhaps other systems, you can avoid the need to run the server as `root` by changing the `limits.conf` file. See the notes regarding the memlock limit in Section 10.12.3.3, “Enabling Large Page Support”.

  You must not use this option on a system that does not support the `mlockall()` system call; if you do so, **mysqld** is very likely to exit as soon as you try to start it.

* `--myisam-block-size=N`

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>parent of mysqld installation directory</code></td> </tr></tbody></table>5

  The block size to be used for `MyISAM` index pages.

* `--no-defaults`

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read. This must be the first option on the command line if it is used.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--no-monitor`

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>parent of mysqld installation directory</code></td> </tr></tbody></table>6

  (Windows only). This option suppresses the forking that is used to implement the `RESTART` statement: Forking enables one process to act as a monitor to the other, which acts as the server. For a server started with this option, `RESTART` simply exits and does not restart.

* `--performance-schema-xxx`

  Configure a Performance Schema option. For details, see Section 29.14, “Performance Schema Command Options”.

* `--plugin-load=plugin_list`

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>parent of mysqld installation directory</code></td> </tr></tbody></table>7

  This option tells the server to load the named plugins at startup. If multiple `--plugin-load` options are given, only the last one applies. Additional plugins to load may be specified using `--plugin-load-add` options.

  The option value is a semicolon-separated list of *`plugin_library`* and *`name`*`=`*`plugin_library`* values. Each *`plugin_library`* is the name of a library file that contains plugin code, and each *`name`* is the name of a plugin to load. If a plugin library is named without any preceding plugin name, the server loads all plugins in the library. With a preceding plugin name, the server loads only the named plugin from the library. The server looks for plugin library files in the directory named by the `plugin_dir` system variable.

  For example, if plugins named `myplug1` and `myplug2` are contained in the plugin library files `myplug1.so` and `myplug2.so`, use this option to perform an early plugin load:

  ```
  mysqld --plugin-load="myplug1=myplug1.so;myplug2=myplug2.so"
  ```

  Quotes surround the argument value because otherwise some command interpreters interpret semicolon (`;`) as a special character. (For example, Unix shells treat it as a command terminator.)

  Each named plugin is loaded for a single invocation of **mysqld** only. After a restart, the plugin is not loaded unless `--plugin-load` is used again. This is in contrast to `INSTALL PLUGIN`, which adds an entry to the `mysql.plugins` table to cause the plugin to be loaded for every normal server startup.

  During the normal startup sequence, the server determines which plugins to load by reading the `mysql.plugins` system table. If the server is started with the `--skip-grant-tables` option, plugins registered in the `mysql.plugins` table are not loaded and are unavailable. `--plugin-load` enables plugins to be loaded even when `--skip-grant-tables` is given. `--plugin-load` also enables plugins to be loaded at startup that cannot be loaded at runtime.

  This option does not set a corresponding system variable. The output of `SHOW PLUGINS` provides information about loaded plugins. More detailed information can be found in the Information Schema `PLUGINS` table. See Section 7.6.2, “Obtaining Server Plugin Information”.

  For additional information about plugin loading, see Section 7.6.1, “Installing and Uninstalling Plugins”.

* `--plugin-load-add=plugin_list`

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>parent of mysqld installation directory</code></td> </tr></tbody></table>8

  This option complements the `--plugin-load` option. `--plugin-load-add` adds a plugin or plugins to the set of plugins to be loaded at startup. The argument format is the same as for `--plugin-load`. `--plugin-load-add` can be used to avoid specifying a large set of plugins as a single long unwieldy `--plugin-load` argument.

  `--plugin-load-add` can be given in the absence of `--plugin-load`, but any instance of `--plugin-load-add` that appears before `--plugin-load` has no effect because `--plugin-load` resets the set of plugins to load. In other words, these options:

  ```
  --plugin-load=x --plugin-load-add=y
  ```

  are equivalent to this option:

  ```
  --plugin-load="x;y"
  ```

  But these options:

  ```
  --plugin-load-add=y --plugin-load=x
  ```

  are equivalent to this option:

  ```
  --plugin-load=x
  ```

  This option does not set a corresponding system variable. The output of `SHOW PLUGINS` provides information about loaded plugins. More detailed information can be found in the Information Schema `PLUGINS` table. See Section 7.6.2, “Obtaining Server Plugin Information”.

  For additional information about plugin loading, see Section 7.6.1, “Installing and Uninstalling Plugins”.

* `--plugin-xxx`

  Specifies an option that pertains to a server plugin. For example, many storage engines can be built as plugins, and for such engines, options for them can be specified with a `--plugin` prefix. Thus, the `--innodb-file-per-table` option for `InnoDB` can be specified as `--plugin-innodb-file-per-table`.

  For boolean options that can be enabled or disabled, the `--skip` prefix and other alternative formats are supported as well (see Section 6.2.2.4, “Program Option Modifiers”). For example, `--skip-plugin-innodb-file-per-table` disables `innodb-file-per-table`.

  The rationale for the `--plugin` prefix is that it enables plugin options to be specified unambiguously if there is a name conflict with a built-in server option. For example, were a plugin writer to name a plugin “sql” and implement a “mode” option, the option name might be `--sql-mode`, which would conflict with the built-in option of the same name. In such cases, references to the conflicting name are resolved in favor of the built-in option. To avoid the ambiguity, users can specify the plugin option as `--plugin-sql-mode`. Use of the `--plugin` prefix for plugin options is recommended to avoid any question of ambiguity.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>basedir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>parent of mysqld installation directory</code></td> </tr></tbody></table>9

  The port number to use when listening for TCP/IP connections. On Unix and Unix-like systems, the port number must be 1024 or higher unless the server is started by the `root` operating system user. Setting this option to 0 causes the default value to be used.

* `--port-open-timeout=num`

  <table frame="box" rules="all" summary="Properties for check-table-functions"><tbody><tr><th>Command-Line Format</th> <td><code>--check-table-functions=value</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ABORT</code></td> </tr><tr><th>Valid Values</th> <td><p><code>WARN</code></p><p><code>ABORT</code></p></td> </tr></tbody></table>0

  On some systems, when the server is stopped, the TCP/IP port might not become available immediately. If the server is restarted quickly afterward, its attempt to reopen the port can fail. This option indicates how many seconds the server should wait for the TCP/IP port to become free if it cannot be opened. The default is not to wait.

* `--print-defaults`

  Print the program name and all options that it gets from option files. Password values are masked. This must be the first option on the command line if it is used, except that it may be used immediately after `--defaults-file` or `--defaults-extra-file`.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--remove [service_name]`

  <table frame="box" rules="all" summary="Properties for check-table-functions"><tbody><tr><th>Command-Line Format</th> <td><code>--check-table-functions=value</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ABORT</code></td> </tr><tr><th>Valid Values</th> <td><p><code>WARN</code></p><p><code>ABORT</code></p></td> </tr></tbody></table>1

  (Windows only) Remove a MySQL Windows service. The default service name is `MySQL` if no *`service_name`* value is given. For more information, see Section 2.3.3.8, “Starting MySQL as a Windows Service”.

* `--safe-user-create`

  <table frame="box" rules="all" summary="Properties for check-table-functions"><tbody><tr><th>Command-Line Format</th> <td><code>--check-table-functions=value</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ABORT</code></td> </tr><tr><th>Valid Values</th> <td><p><code>WARN</code></p><p><code>ABORT</code></p></td> </tr></tbody></table>2

  If this option is enabled, a user cannot create new MySQL users by using the `GRANT` statement unless the user has the `INSERT` privilege for the `mysql.user` system table or any column in the table. If you want a user to have the ability to create new users that have those privileges that the user has the right to grant, you should grant the user the following privilege:

  ```
  GRANT INSERT(user) ON mysql.user TO 'user_name'@'host_name';
  ```

  This ensures that the user cannot change any privilege columns directly, but has to use the `GRANT` statement to give privileges to other users.

* `--skip-grant-tables`

  <table frame="box" rules="all" summary="Properties for check-table-functions"><tbody><tr><th>Command-Line Format</th> <td><code>--check-table-functions=value</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ABORT</code></td> </tr><tr><th>Valid Values</th> <td><p><code>WARN</code></p><p><code>ABORT</code></p></td> </tr></tbody></table>3

  This option affects the server startup sequence:

  + `--skip-grant-tables` causes the server not to read the grant tables in the `mysql` system schema, and thus to start without using the privilege system at all. This gives anyone with access to the server *unrestricted access to all databases*.

    Because starting the server with `--skip-grant-tables` disables authentication checks, the server also disables remote connections in that case by enabling `skip_networking`.

    To cause a server started with `--skip-grant-tables` to load the grant tables at runtime, perform a privilege-flushing operation, which can be done in these ways:

    - Issue a MySQL `FLUSH PRIVILEGES` statement after connecting to the server.

    - Execute a **mysqladmin flush-privileges** or **mysqladmin reload** command from the command line.

    Privilege flushing might also occur implicitly as a result of other actions performed after startup, thus causing the server to start using the grant tables. For example, the server flushes the privileges if it performs an upgrade during the startup sequence.

  + `--skip-grant-tables` disables failed-login tracking and temporary account locking because those capabilities depend on the grant tables. See Section 8.2.15, “Password Management”.

  + `--skip-grant-tables` causes the server not to load certain other objects registered in the data dictionary or the `mysql` system schema:

    - Scheduled events installed using `CREATE EVENT` and registered in the `events` data dictionary table.

    - Plugins installed using `INSTALL PLUGIN` and registered in the `mysql.plugin` system table.

      To cause plugins to be loaded even when using `--skip-grant-tables`, use the `--plugin-load` or `--plugin-load-add` option.

    - Loadable functions installed using `CREATE FUNCTION` and registered in the `mysql.func` system table.

    `--skip-grant-tables` does *not* suppress loading during startup of components.

  + `--skip-grant-tables` causes the `disabled_storage_engines` system variable to have no effect.

* `--skip-new`

  <table frame="box" rules="all" summary="Properties for check-table-functions"><tbody><tr><th>Command-Line Format</th> <td><code>--check-table-functions=value</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ABORT</code></td> </tr><tr><th>Valid Values</th> <td><p><code>WARN</code></p><p><code>ABORT</code></p></td> </tr></tbody></table>4

  This option disables (what used to be considered) new, possibly unsafe behaviors. It results in these settings: `delay_key_write=OFF`, `concurrent_insert=NEVER`, `automatic_sp_privileges=OFF`. It also causes `OPTIMIZE TABLE` to be mapped to `ALTER TABLE` for storage engines for which `OPTIMIZE TABLE` is not supported.

  This option is deprecated, and subject to removal in a future release.

* `--skip-show-database`

  <table frame="box" rules="all" summary="Properties for check-table-functions"><tbody><tr><th>Command-Line Format</th> <td><code>--check-table-functions=value</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ABORT</code></td> </tr><tr><th>Valid Values</th> <td><p><code>WARN</code></p><p><code>ABORT</code></p></td> </tr></tbody></table>5

  This option sets the `skip_show_database` system variable that controls who is permitted to use the `SHOW DATABASES` statement. See Section 7.1.8, “Server System Variables”.

* `--skip-stack-trace`

  <table frame="box" rules="all" summary="Properties for check-table-functions"><tbody><tr><th>Command-Line Format</th> <td><code>--check-table-functions=value</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ABORT</code></td> </tr><tr><th>Valid Values</th> <td><p><code>WARN</code></p><p><code>ABORT</code></p></td> </tr></tbody></table>6

  Do not write stack traces. This option is useful when you are running **mysqld** under a debugger. On some systems, you also must use this option to get a core file. See Section 7.9, “Debugging MySQL”.

* `--slow-start-timeout=timeout`

  <table frame="box" rules="all" summary="Properties for check-table-functions"><tbody><tr><th>Command-Line Format</th> <td><code>--check-table-functions=value</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ABORT</code></td> </tr><tr><th>Valid Values</th> <td><p><code>WARN</code></p><p><code>ABORT</code></p></td> </tr></tbody></table>7

  This option controls the Windows service control manager's service start timeout. The value is the maximum number of milliseconds that the service control manager waits before trying to kill the windows service during startup. The default value is 15000 (15 seconds). If the MySQL service takes too long to start, you may need to increase this value. A value of 0 means there is no timeout.

* `--socket=path`

  <table frame="box" rules="all" summary="Properties for check-table-functions"><tbody><tr><th>Command-Line Format</th> <td><code>--check-table-functions=value</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ABORT</code></td> </tr><tr><th>Valid Values</th> <td><p><code>WARN</code></p><p><code>ABORT</code></p></td> </tr></tbody></table>8

  On Unix, this option specifies the Unix socket file to use when listening for local connections. The default value is `/tmp/mysql.sock`. If this option is given, the server creates the file in the data directory unless an absolute path name is given to specify a different directory. On Windows, the option specifies the pipe name to use when listening for local connections that use a named pipe. The default value is `MySQL` (not case-sensitive).

* [`--sql-mode=value[,value[,value...]]`](server-options.html#option_mysqld_sql-mode)

  <table frame="box" rules="all" summary="Properties for check-table-functions"><tbody><tr><th>Command-Line Format</th> <td><code>--check-table-functions=value</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ABORT</code></td> </tr><tr><th>Valid Values</th> <td><p><code>WARN</code></p><p><code>ABORT</code></p></td> </tr></tbody></table>9

  Set the SQL mode. See Section 7.1.11, “Server SQL Modes”.

  Note

  MySQL installation programs may configure the SQL mode during the installation process.

  If the SQL mode differs from the default or from what you expect, check for a setting in an option file that the server reads at startup.

* `--standalone`

  <table frame="box" rules="all" summary="Properties for chroot"><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>0

  Available on Windows only; instructs the MySQL server not to run as a service.

* `--super-large-pages`

  <table frame="box" rules="all" summary="Properties for chroot"><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>1

  Standard use of large pages in MySQL attempts to use the largest size supported, up to 4MB. Under Solaris, a “super large pages” feature enables uses of pages up to 256MB. This feature is available for recent SPARC platforms. It can be enabled or disabled by using the `--super-large-pages` or `--skip-super-large-pages` option.

* `--symbolic-links`, `--skip-symbolic-links`

  <table frame="box" rules="all" summary="Properties for chroot"><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>2

  Enable or disable symbolic link support. On Unix, enabling symbolic links means that you can link a `MyISAM` index file or data file to another directory with the `INDEX DIRECTORY` or `DATA DIRECTORY` option of the `CREATE TABLE` statement. If you delete or rename the table, the files that its symbolic links point to also are deleted or renamed. See Section 10.12.2.2, “Using Symbolic Links for MyISAM Tables on Unix”.

  Note

  Symbolic link support, along with the `--symbolic-links` option that controls it, is deprecated; you should expect it to be removed in a future version of MySQL. In addition, the option is disabled by default. The related `have_symlink` system variable also is deprecated; expect it to be removed in a future version of MySQL.

  This option has no meaning on Windows.

* `--sysdate-is-now`

  <table frame="box" rules="all" summary="Properties for chroot"><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>3

  `SYSDATE()` by default returns the time at which it executes, not the time at which the statement in which it occurs begins executing. This differs from the behavior of `NOW()`. This option causes `SYSDATE()` to be a synonym for `NOW()`. For information about the implications for binary logging and replication, see the description for `SYSDATE()` in Section 14.7, “Date and Time Functions” and for `SET TIMESTAMP` in Section 7.1.8, “Server System Variables”.

* `--tc-heuristic-recover={COMMIT|ROLLBACK}`

  <table frame="box" rules="all" summary="Properties for chroot"><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>4

  The decision to use in a manual heuristic recovery.

  If a `--tc-heuristic-recover` option is specified, the server exits regardless of whether manual heuristic recovery is successful.

  On systems with more than one storage engine capable of two-phase commit, the `ROLLBACK` option is not safe and causes recovery to halt with the following error:

  ```
  [ERROR] --tc-heuristic-recover rollback
  strategy is not safe on systems with more than one 2-phase-commit-capable
  storage engine. Aborting crash recovery.
  ```

* `--transaction-isolation=level`

  <table frame="box" rules="all" summary="Properties for chroot"><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>5

  Sets the default transaction isolation level. The `level` value can be `READ-UNCOMMITTED`, `READ-COMMITTED`, `REPEATABLE-READ`, or `SERIALIZABLE`. See Section 15.3.7, “SET TRANSACTION Statement”.

  The default transaction isolation level can also be set at runtime using the `SET TRANSACTION` statement or by setting the `transaction_isolation` system variable.

* `--transaction-read-only`

  <table frame="box" rules="all" summary="Properties for chroot"><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>6

  Sets the default transaction access mode. By default, read-only mode is disabled, so the mode is read/write.

  To set the default transaction access mode at runtime, use the `SET TRANSACTION` statement or set the `transaction_read_only` system variable. See Section 15.3.7, “SET TRANSACTION Statement”.

* `--tmpdir=dir_name`, `-t dir_name`

  <table frame="box" rules="all" summary="Properties for chroot"><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>7

  The path of the directory to use for creating temporary files. It might be useful if your default `/tmp` directory resides on a partition that is too small to hold temporary tables. This option accepts several paths that are used in round-robin fashion. Paths should be separated by colon characters (`:`) on Unix and semicolon characters (`;`) on Windows.

  `--tmpdir` can be a non-permanent location, such as a directory on a memory-based file system or a directory that is cleared when the server host restarts. If the MySQL server is acting as a replica, and you are using a non-permanent location for `--tmpdir`, consider setting a different temporary directory for the replica using the `replica_load_tmpdir` system variable. For a replica, the temporary files used to replicate `LOAD DATA` statements are stored in this directory, so with a permanent location they can survive machine restarts, although replication can now continue after a restart if the temporary files have been removed.

  For more information about the storage location of temporary files, see Section B.3.3.5, “Where MySQL Stores Temporary Files”.

* `--upgrade=value`

  <table frame="box" rules="all" summary="Properties for chroot"><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>8

  This option controls whether and how the server performs an automatic upgrade at startup. Automatic upgrade involves two steps:

  + Step 1: Data dictionary upgrade.

    This step upgrades:

    - The data dictionary tables in the `mysql` schema. If the actual data dictionary version is lower than the current expected version, the server upgrades the data dictionary. If it cannot, or is prevented from doing so, the server cannot run.

    - The Performance Schema and `INFORMATION_SCHEMA`.

  + Step 2: Server upgrade.

    This step comprises all other upgrade tasks. If the existing installation data has a lower MySQL version than the server expects, it must be upgraded:

    - The system tables in the `mysql` schema (the remaining non-data dictionary tables).

    - The `sys` schema.
    - User schemas.

  For details about upgrade steps 1 and 2, see Section 3.4, “What the MySQL Upgrade Process Upgrades”.

  These `--upgrade` option values are permitted:

  + `AUTO`

    The server performs an automatic upgrade of anything it finds to be out of date (steps 1 and 2). This is the default action if `--upgrade` is not specified explicitly.

  + `NONE`

    The server performs no automatic upgrade steps during the startup process (skips steps 1 and 2). Because this option value prevents a data dictionary upgrade, the server exits with an error if the data dictionary is found to be out of date:

    ```
    [ERROR] [MY-013381] [Server] Server shutting down because upgrade is
    required, yet prohibited by the command line option '--upgrade=NONE'.
    [ERROR] [MY-010334] [Server] Failed to initialize DD Storage Engine
    [ERROR] [MY-010020] [Server] Data Dictionary initialization failed.
    ```

  + `MINIMAL`

    The server upgrades the data dictionary, the Performance Schema, and the `INFORMATION_SCHEMA`, if necessary (step 1). Note that following an upgrade with this option, Group Replication cannot be started, because system tables on which the replication internals depend are not updated, and reduced functionality might also be apparent in other areas.

  + `FORCE`

    The server upgrades the data dictionary, the Performance Schema, and the `INFORMATION_SCHEMA`, if necessary (step 1). In addition, the server forces an upgrade of everything else (step 2). Expect server startup to take longer with this option because the server checks all objects in all schemas.

    `FORCE` is useful to force step 2 actions to be performed if the server thinks they are not necessary. For example, you may believe that a system table is missing or has become damaged and want to force a repair.

  The following table summarizes the actions taken by the server for each option value.

  <table frame="box" rules="all" summary="Properties for chroot"><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>9

* `--user={user_name|user_id}`, `-u {user_name|user_id}`

  <table frame="box" rules="all" summary="Properties for console"><tbody><tr><th>Command-Line Format</th> <td><code>--console</code></td> </tr><tr><th>Platform Specific</th> <td>Windows</td> </tr></tbody></table>0

  Run the **mysqld** server as the user having the name *`user_name`* or the numeric user ID *`user_id`*. (“User” in this context refers to a system login account, not a MySQL user listed in the grant tables.)

  This option is *mandatory* when starting **mysqld** as `root`. The server changes its user ID during its startup sequence, causing it to run as that particular user rather than as `root`. See Section 8.1.1, “Security Guidelines”.

  To avoid a possible security hole where a user adds a `--user=root` option to a `my.cnf` file (thus causing the server to run as `root`), **mysqld** uses only the first `--user` option specified and produces a warning if there are multiple `--user` options. Options in `/etc/my.cnf` and `$MYSQL_HOME/my.cnf` are processed before command-line options, so it is recommended that you put a `--user` option in `/etc/my.cnf` and specify a value other than `root`. The option in `/etc/my.cnf` is found before any other `--user` options, which ensures that the server runs as a user other than `root`, and that a warning results if any other `--user` option is found.

* `--validate-config`

  <table frame="box" rules="all" summary="Properties for console"><tbody><tr><th>Command-Line Format</th> <td><code>--console</code></td> </tr><tr><th>Platform Specific</th> <td>Windows</td> </tr></tbody></table>1

  Validate the server startup configuration. If no errors are found, the server terminates with an exit code of 0. If an error is found, the server displays a diagnostic message and terminates with an exit code of 1. Warning and information messages may also be displayed, depending on the `log_error_verbosity` value, but do not produce immediate validation termination or an exit code of 1. For more information, see Section 7.1.3, “Server Configuration Validation”.

* `--validate-user-plugins[={OFF|ON}]`

  <table frame="box" rules="all" summary="Properties for console"><tbody><tr><th>Command-Line Format</th> <td><code>--console</code></td> </tr><tr><th>Platform Specific</th> <td>Windows</td> </tr></tbody></table>2

  If this option is enabled (the default), the server checks each user account and produces a warning if conditions are found that would make the account unusable:

  + The account requires an authentication plugin that is not loaded.

  + The account requires the `sha256_password` (deprecated) or `caching_sha2_password` authentication plugin but the server was started with neither SSL nor RSA enabled as required by the plugin.

  Enabling `--validate-user-plugins` slows down server initialization and `FLUSH PRIVILEGES`. If you do not require the additional checking, you can disable this option at startup to avoid the performance decrement.

* `--verbose`, `-v`

  Use this option with the `--help` option for detailed help.

* `--version`, `-V`

  Display version information and exit.
