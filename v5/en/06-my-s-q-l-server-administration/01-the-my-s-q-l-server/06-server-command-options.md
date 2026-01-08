### 5.1.6 Server Command Options

When you start the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") server, you can specify program options using any of the methods described in [Section 4.2.2, “Specifying Program Options”](program-options.html "4.2.2 Specifying Program Options"). The most common methods are to provide options in an option file or on the command line. However, in most cases it is desirable to make sure that the server uses the same options each time it runs. The best way to ensure this is to list them in an option file. See [Section 4.2.2.2, “Using Option Files”](option-files.html "4.2.2.2 Using Option Files"). That section also describes option file format and syntax.

[**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") reads options from the `[mysqld]` and `[server]` groups. [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") reads options from the `[mysqld]`, `[server]`, `[mysqld_safe]`, and `[safe_mysqld]` groups. [**mysql.server**](mysql-server.html "4.3.3 mysql.server — MySQL Server Startup Script") reads options from the `[mysqld]` and `[mysql.server]` groups.

An embedded MySQL server usually reads options from the `[server]`, `[embedded]`, and `[xxxxx_SERVER]` groups, where *`xxxxx`* is the name of the application into which the server is embedded.

[**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") accepts many command options. For a brief summary, execute this command:

```sql
mysqld --help
```

To see the full list, use this command:

```sql
mysqld --verbose --help
```

Some of the items in the list are actually system variables that can be set at server startup. These can be displayed at runtime using the [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") statement. Some items displayed by the preceding [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") command do not appear in [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") output; this is because they are options only and not system variables.

The following list shows some of the most common server options. Additional options are described in other sections:

* Options that affect security: See [Section 6.1.4, “Security-Related mysqld Options and Variables”](security-options.html "6.1.4 Security-Related mysqld Options and Variables").

* SSL-related options: See [Command Options for Encrypted Connections](connection-options.html#encrypted-connection-options "Command Options for Encrypted Connections").

* Binary log control options: See [Section 5.4.4, “The Binary Log”](binary-log.html "5.4.4 The Binary Log").
* Replication-related options: See [Section 16.1.6, “Replication and Binary Logging Options and Variables”](replication-options.html "16.1.6 Replication and Binary Logging Options and Variables").

* Options for loading plugins such as pluggable storage engines: See [Section 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").

* Options specific to particular storage engines: See [Section 14.15, “InnoDB Startup Options and System Variables”](innodb-parameters.html "14.15 InnoDB Startup Options and System Variables") and [Section 15.2.1, “MyISAM Startup Options”](myisam-start.html "15.2.1 MyISAM Startup Options").

Some options control the size of buffers or caches. For a given buffer, the server might need to allocate internal data structures. These structures typically are allocated from the total memory allocated to the buffer, and the amount of space required might be platform dependent. This means that when you assign a value to an option that controls a buffer size, the amount of space actually available might differ from the value assigned. In some cases, the amount might be less than the value assigned. It is also possible that the server adjusts a value upward. For example, if you assign a value of 0 to an option for which the minimal value is 1024, the server sets the value to 1024.

Values for buffer sizes, lengths, and stack sizes are given in bytes unless otherwise specified.

Some options take file name values. Unless otherwise specified, the default file location is the data directory if the value is a relative path name. To specify the location explicitly, use an absolute path name. Suppose that the data directory is `/var/mysql/data`. If a file-valued option is given as a relative path name, it is located under `/var/mysql/data`. If the value is an absolute path name, its location is as given by the path name.

You can also set the values of server system variables at server startup by using variable names as options. To assign a value to a server system variable, use an option of the form `--var_name=value`. For example, [`--sort_buffer_size=384M`](server-system-variables.html#sysvar_sort_buffer_size) sets the [`sort_buffer_size`](server-system-variables.html#sysvar_sort_buffer_size) variable to a value of 384MB.

When you assign a value to a variable, MySQL might automatically correct the value to stay within a given range, or adjust the value to the closest permissible value if only certain values are permitted.

To restrict the maximum value to which a system variable can be set at runtime with the [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statement, specify this maximum by using an option of the form `--maximum-var_name=value` at server startup.

You can change the values of most system variables at runtime with the [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statement. See [Section 13.7.4.1, “SET Syntax for Variable Assignment”](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment").

[Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables"), provides a full description for all variables, and additional information for setting them at server startup and runtime. For information on changing system variables, see [Section 5.1.1, “Configuring the Server”](server-configuration.html "5.1.1 Configuring the Server").

* [`--help`](server-options.html#option_mysqld_help), `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a short help message and exit. Use both the [`--verbose`](server-options.html#option_mysqld_verbose) and [`--help`](server-options.html#option_mysqld_help) options to see the full message.

* [`--allow-suspicious-udfs`](server-options.html#option_mysqld_allow-suspicious-udfs)

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  This option controls whether loadable functions that have only an `xxx` symbol for the main function can be loaded. By default, the option is off and only loadable functions that have at least one auxiliary symbol can be loaded; this prevents attempts at loading functions from shared object files other than those containing legitimate functions. See [Loadable Function Security Precautions](/doc/extending-mysql/5.7/en/adding-loadable-function.html#loadable-function-security).

* [`--ansi`](server-options.html#option_mysqld_ansi)

  <table frame="box" rules="all" summary="Properties for ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>

  Use standard (ANSI) SQL syntax instead of MySQL syntax. For more precise control over the server SQL mode, use the [`--sql-mode`](server-options.html#option_mysqld_sql-mode) option instead. See [Section 1.6, “MySQL Standards Compliance”](compatibility.html "1.6 MySQL Standards Compliance"), and [Section 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes").

* [`--basedir=dir_name`](server-system-variables.html#sysvar_basedir), [`-b dir_name`](server-system-variables.html#sysvar_basedir)

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>

  The path to the MySQL installation directory. This option sets the [`basedir`](server-system-variables.html#sysvar_basedir) system variable.

* [`--bootstrap`](server-options.html#option_mysqld_bootstrap)

  <table frame="box" rules="all" summary="Properties for bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bootstrap</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr></tbody></table>

  This option is used by the [**mysql\_install\_db**](mysql-install-db.html "4.4.2 mysql_install_db — Initialize MySQL Data Directory") program to create the MySQL privilege tables without having to start a full MySQL server.

  Note

  [**mysql\_install\_db**](mysql-install-db.html "4.4.2 mysql_install_db — Initialize MySQL Data Directory") is deprecated because its functionality has been integrated into [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), the MySQL server. Consequently, the [`--bootstrap`](server-options.html#option_mysqld_bootstrap) server option that [**mysql\_install\_db**](mysql-install-db.html "4.4.2 mysql_install_db — Initialize MySQL Data Directory") passes to [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") is also deprecated. To initialize a MySQL installation, invoke [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") with the [`--initialize`](server-options.html#option_mysqld_initialize) or [`--initialize-insecure`](server-options.html#option_mysqld_initialize-insecure) option. For more information, see [Section 2.9.1, “Initializing the Data Directory”](data-directory-initialization.html "2.9.1 Initializing the Data Directory"). Expect [**mysql\_install\_db**](mysql-install-db.html "4.4.2 mysql_install_db — Initialize MySQL Data Directory") and the [`--bootstrap`](server-options.html#option_mysqld_bootstrap) server option to be removed in a future release of MySQL.

  [`--bootstrap`](server-options.html#option_mysqld_bootstrap) is mutually exclusive with [`--daemonize`](server-options.html#option_mysqld_daemonize), [`--initialize`](server-options.html#option_mysqld_initialize), and [`--initialize-insecure`](server-options.html#option_mysqld_initialize-insecure).

  Global transaction identifiers (GTIDs) are not disabled when [`--bootstrap`](server-options.html#option_mysqld_bootstrap) is used. [`--bootstrap`](server-options.html#option_mysqld_bootstrap) was used (Bug
  #20980271). See [Section 16.1.3, “Replication with Global Transaction Identifiers”](replication-gtids.html "16.1.3 Replication with Global Transaction Identifiers").

  When the server operates in bootstap mode, some functionality is unavailable that limits the statements permitted in any file named by the [`init_file`](server-system-variables.html#sysvar_init_file) system variable. For more information, see the description of that variable. In addition, the [`disabled_storage_engines`](server-system-variables.html#sysvar_disabled_storage_engines) system variable has no effect.

* [`--character-set-client-handshake`](server-options.html#option_mysqld_character-set-client-handshake)

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Do not ignore character set information sent by the client. To ignore client information and use the default server character set, use [`--skip-character-set-client-handshake`](server-options.html#option_mysqld_character-set-client-handshake); this makes MySQL behave like MySQL 4.0.

* [`--chroot=dir_name`](server-options.html#option_mysqld_chroot), `-r dir_name`

  <table frame="box" rules="all" summary="Properties for chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  Put the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") server in a closed environment during startup by using the `chroot()` system call. This is a recommended security measure. Use of this option somewhat limits [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") and [`SELECT ... INTO OUTFILE`](select-into.html "13.2.9.1 SELECT ... INTO Statement").

* [`--console`](server-options.html#option_mysqld_console)

  <table frame="box" rules="all" summary="Properties for console"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--console</code></td> </tr><tr><th>Platform Specific</th> <td>Windows</td> </tr></tbody></table>

  (Windows only.) Write the error log to `stderr` and `stdout` (the console). [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") does not close the console window if this option is used.

  [`--console`](server-options.html#option_mysqld_console) takes precedence over [`--log-error`](server-options.html#option_mysqld_log-error) if both are given. (In MySQL 5.5 and 5.6, this is reversed: [`--log-error`](server-options.html#option_mysqld_log-error) takes precedence over [`--console`](server-options.html#option_mysqld_console) if both are given.)

* [`--core-file`](server-options.html#option_mysqld_core-file)

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

  When this option is used, write a core file if [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") dies; no arguments are needed (or accepted). The name and location of the core file is system dependent. On Linux, a core file named `core.pid` is written to the current working directory of the process, which for [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") is the data directory. *`pid`* represents the process ID of the server process. On macOS, a core file named `core.pid` is written to the `/cores` directory. On Solaris, use the **coreadm** command to specify where to write the core file and how to name it.

  For some systems, to get a core file you must also specify the [`--core-file-size`](mysqld-safe.html#option_mysqld_safe_core-file-size) option to [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script"). See [Section 4.3.2, “mysqld\_safe — MySQL Server Startup Script”](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script"). On some systems, such as Solaris, you do not get a core file if you are also using the [`--user`](server-options.html#option_mysqld_user) option. There might be additional restrictions or limitations. For example, it might be necessary to execute **ulimit -c unlimited** before starting the server. Consult your system documentation.

* [`--daemonize`](server-options.html#option_mysqld_daemonize)

  <table frame="box" rules="all" summary="Properties for daemonize"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemonize[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  This option causes the server to run as a traditional, forking daemon, permitting it to work with operating systems that use systemd for process control. For more information, see [Section 2.5.10, “Managing MySQL Server with systemd”](using-systemd.html "2.5.10 Managing MySQL Server with systemd").

  [`--daemonize`](server-options.html#option_mysqld_daemonize) is mutually exclusive with [`--bootstrap`](server-options.html#option_mysqld_bootstrap), [`--initialize`](server-options.html#option_mysqld_initialize), and [`--initialize-insecure`](server-options.html#option_mysqld_initialize-insecure).

* [`--datadir=dir_name`](server-system-variables.html#sysvar_datadir), `-h dir_name`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

  The path to the MySQL server data directory. This option sets the [`datadir`](server-system-variables.html#sysvar_datadir) system variable. See the description of that variable.

* [`--debug[=debug_options]`](server-options.html#option_mysqld_debug), `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

  If MySQL is configured with the [`-DWITH_DEBUG=1`](source-configuration-options.html#option_cmake_with_debug) **CMake** option, you can use this option to get a trace file of what [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") is doing. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:i:o,/tmp/mysqld.trace` on Unix and `d:t:i:O,\mysqld.trace` on Windows.

  Using [`-DWITH_DEBUG=1`](source-configuration-options.html#option_cmake_with_debug) to configure MySQL with debugging support enables you to use the [`--debug="d,parser_debug"`](server-options.html#option_mysqld_debug) option when you start the server. This causes the Bison parser that is used to process SQL statements to dump a parser trace to the server's standard error output. Typically, this output is written to the error log.

  This option may be given multiple times. Values that begin with `+` or `-` are added to or subtracted from the previous value. For example, [`--debug=T`](server-options.html#option_mysqld_debug) [`--debug=+P`](server-options.html#option_mysqld_debug) sets the value to `P:T`.

  For more information, see [Section 5.8.3, “The DBUG Package”](dbug-package.html "5.8.3 The DBUG Package").

* [`--debug-sync-timeout[=N]`](server-options.html#option_mysqld_debug-sync-timeout)

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

  Controls whether the Debug Sync facility for testing and debugging is enabled. Use of Debug Sync requires that MySQL be configured with the [`-DWITH_DEBUG=ON`](source-configuration-options.html#option_cmake_with_debug) **CMake** option (see [Section 2.8.7, “MySQL Source-Configuration Options”](source-configuration-options.html "2.8.7 MySQL Source-Configuration Options")). If Debug Sync is not compiled in, this option is not available. The option value is a timeout in seconds. The default value is 0, which disables Debug Sync. To enable it, specify a value greater than 0; this value also becomes the default timeout for individual synchronization points. If the option is given without a value, the timeout is set to 300 seconds.

  For a description of the Debug Sync facility and how to use synchronization points, see [MySQL Internals: Test Synchronization](/doc/internals/en/test-synchronization.html).

* [`--default-time-zone=timezone`](server-options.html#option_mysqld_default-time-zone)

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>3

  Set the default server time zone. This option sets the global [`time_zone`](server-system-variables.html#sysvar_time_zone) system variable. If this option is not given, the default time zone is the same as the system time zone (given by the value of the [`system_time_zone`](server-system-variables.html#sysvar_system_time_zone) system variable.

  The [`system_time_zone`](server-system-variables.html#sysvar_system_time_zone) variable differs from [`time_zone`](server-system-variables.html#sysvar_time_zone). Although they might have the same value, the latter variable is used to initialize the time zone for each client that connects. See [Section 5.1.13, “MySQL Server Time Zone Support”](time-zone-support.html "5.1.13 MySQL Server Time Zone Support").

* [`--defaults-extra-file=file_name`](server-options.html#option_mysqld_defaults-extra-file)

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory. This must be the first option on the command line if it is used.

  For additional information about this and other option-file options, see [Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-file=file_name`](server-options.html#option_mysqld_defaults-file)

  Read only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Note

  This must be the first option on the command line if it is used, except that if the server is started with the [`--defaults-file`](server-options.html#option_mysqld_defaults-file) and [`--install`](server-options.html#option_mysqld_install) (or [`--install-manual`](server-options.html#option_mysqld_install-manual)) options, [`--install`](server-options.html#option_mysqld_install) (or [`--install-manual`](server-options.html#option_mysqld_install-manual)) must be first.

  For additional information about this and other option-file options, see [Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-group-suffix=str`](server-options.html#option_mysqld_defaults-group-suffix)

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") normally reads the `[mysqld]` group. If this option is given as [`--defaults-group-suffix=_other`](server-options.html#option_mysqld_defaults-group-suffix), [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") also reads the `[mysqld_other]` group.

  For additional information about this and other option-file options, see [Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--des-key-file=file_name`](server-options.html#option_mysqld_des-key-file)

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>4

  Read the default DES keys from this file. These keys are used by the [`DES_ENCRYPT()`](encryption-functions.html#function_des-encrypt) and [`DES_DECRYPT()`](encryption-functions.html#function_des-decrypt) functions.

  Note

  The [`DES_ENCRYPT()`](encryption-functions.html#function_des-encrypt) and [`DES_DECRYPT()`](encryption-functions.html#function_des-decrypt) functions are deprecated in MySQL 5.7, are removed in MySQL 8.0, and should no longer be used. Consequently, [`--des-key-file`](server-options.html#option_mysqld_des-key-file) also is deprecated and is removed in MySQL 8.0.

* [`--disable-partition-engine-check`](server-options.html#option_mysqld_disable-partition-engine-check)

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>5

  Whether to disable the startup check for tables with nonnative partitioning.

  As of MySQL 5.7.17, the generic partitioning handler in the MySQL server is deprecated, and is removed in MySQL 8.0, when the storage engine used for a given table is expected to provide its own (“native”) partitioning handler. Currently, only the [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") and [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engines do this.

  Use of tables with nonnative partitioning results in an [`ER_WARN_DEPRECATED_SYNTAX`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_warn_deprecated_syntax) warning. In MySQL 5.7.17 through 5.7.20, the server automatically performs a check at startup to identify tables that use nonnative partitioning; for any that are found, the server writes a message to its error log. To disable this check, use the [`--disable-partition-engine-check`](server-options.html#option_mysqld_disable-partition-engine-check) option. In MySQL 5.7.21 and later, this check is *not* performed; in these versions, you must start the server with [`--disable-partition-engine-check=false`](server-options.html#option_mysqld_disable-partition-engine-check), if you wish for the server to check for tables using the generic partitioning handler (Bug #85830, Bug #25846957).

  Use of tables with nonnative partitioning results in an [`ER_WARN_DEPRECATED_SYNTAX`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_warn_deprecated_syntax) warning. Also, the server performs a check at startup to identify tables that use nonnative partitioning; for any found, the server writes a message to its error log. To disable this check, use the [`--disable-partition-engine-check`](server-options.html#option_mysqld_disable-partition-engine-check) option.

  To prepare for migration to MySQL 8.0, any table with nonnative partitioning should be changed to use an engine that provides native partitioning, or be made nonpartitioned. For example, to change a table to `InnoDB`, execute this statement:

  ```sql
  ALTER TABLE table_name ENGINE = INNODB;
  ```

* [`--early-plugin-load=plugin_list`](server-options.html#option_mysqld_early-plugin-load)

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>6

  This option tells the server which plugins to load before loading mandatory built-in plugins and before storage engine initialization. Early loading is supported only for plugins compiled with `PLUGIN_OPT_ALLOW_EARLY`. If multiple [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) options are given, only the last one applies.

  The option value is a semicolon-separated list of *`plugin_library`* and *`name`*`=`*`plugin_library`* values. Each *`plugin_library`* is the name of a library file that contains plugin code, and each *`name`* is the name of a plugin to load. If a plugin library is named without any preceding plugin name, the server loads all plugins in the library. With a preceding plugin name, the server loads only the named plugin from the libary. The server looks for plugin library files in the directory named by the [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) system variable.

  For example, if plugins named `myplug1` and `myplug2` are contained in the plugin library files `myplug1.so` and `myplug2.so`, use this option to perform an early plugin load:

  ```sql
  mysqld --early-plugin-load="myplug1=myplug1.so;myplug2=myplug2.so"
  ```

  Quotes surround the argument value because otherwise some command interpreters interpret semicolon (`;`) as a special character. (For example, Unix shells treat it as a command terminator.)

  Each named plugin is loaded early for a single invocation of [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") only. After a restart, the plugin is not loaded early unless [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) is used again.

  If the server is started using [`--initialize`](server-options.html#option_mysqld_initialize) or [`--initialize-insecure`](server-options.html#option_mysqld_initialize-insecure), plugins specified by [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) are not loaded.

  If the server is run with [`--help`](server-options.html#option_mysqld_help), plugins specified by [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) are loaded but not initialized. This behavior ensures that plugin options are displayed in the help message.

  `InnoDB` tablespace encryption relies on the MySQL Keyring for encryption key management, and the keyring plugin to be used must be loaded prior to storage engine initialization to facilitate `InnoDB` recovery for encrypted tables. For example, administrators who want the `keyring_file` plugin loaded at startup should use [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) with the appropriate option value (such as `keyring_file.so` on Unix and Unix-like systems or `keyring_file.dll` on Windows).

  Important

  In MySQL 5.7.11, the default [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) value is the name of the `keyring_file` plugin library file, causing that plugin to be loaded by default. In MySQL 5.7.12 and higher, the default [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) value is empty; to load the `keyring_file` plugin, you must explicitly specify the option with a value naming the `keyring_file` plugin library file.

  This change of default [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) value introduces an incompatibility for `InnoDB` tablespace encryption for upgrades from 5.7.11 to 5.7.12 or higher. Administrators who have encrypted `InnoDB` tablespaces must take explicit action to ensure continued loading of the keyring plugin: Start the server with an [`--early-plugin-load`](server-options.html#option_mysqld_early-plugin-load) option that names the plugin library file. For additional information, see [Section 6.4.4.1, “Keyring Plugin Installation”](keyring-plugin-installation.html "6.4.4.1 Keyring Plugin Installation").

  For information about `InnoDB` tablespace encryption, see [Section 14.14, “InnoDB Data-at-Rest Encryption”](innodb-data-encryption.html "14.14 InnoDB Data-at-Rest Encryption"). For general information about plugin loading, see [Section 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").

* [`--exit-info[=flags]`](server-options.html#option_mysqld_exit-info), `-T [flags]`

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>7

  This is a bitmask of different flags that you can use for debugging the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") server. Do not use this option unless you know *exactly* what it does!

* [`--external-locking`](server-options.html#option_mysqld_external-locking)

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>8

  Enable external locking (system locking), which is disabled by default. If you use this option on a system on which `lockd` does not fully work (such as Linux), it is easy for [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") to deadlock.

  To disable external locking explicitly, use `--skip-external-locking`.

  External locking affects only [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") table access. For more information, including conditions under which it can and cannot be used, see [Section 8.11.5, “External Locking”](external-locking.html "8.11.5 External Locking").

* [`--flush`](server-options.html#option_mysqld_flush)

  <table frame="box" rules="all" summary="Properties for allow-suspicious-udfs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-suspicious-udfs[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>9

  Flush (synchronize) all changes to disk after each SQL statement. Normally, MySQL does a write of all changes to disk only after each SQL statement and lets the operating system handle the synchronizing to disk. See [Section B.3.3.3, “What to Do If MySQL Keeps Crashing”](crashing.html "B.3.3.3 What to Do If MySQL Keeps Crashing").

  Note

  If [`--flush`](server-options.html#option_mysqld_flush) is specified, the value of [`flush_time`](server-system-variables.html#sysvar_flush_time) does not matter and changes to [`flush_time`](server-system-variables.html#sysvar_flush_time) have no effect on flush behavior.

* [`--gdb`](server-options.html#option_mysqld_gdb)

  <table frame="box" rules="all" summary="Properties for ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>0

  Install an interrupt handler for `SIGINT` (needed to stop [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") with `^C` to set breakpoints) and disable stack tracing and core file handling. See [Section 5.8.1.4, “Debugging mysqld under gdb”](using-gdb-on-mysqld.html "5.8.1.4 Debugging mysqld under gdb").

* [`--ignore-db-dir=dir_name`](server-options.html#option_mysqld_ignore-db-dir)

  <table frame="box" rules="all" summary="Properties for ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>1

  This option tells the server to ignore the given directory name for purposes of the [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement") statement or `INFORMATION_SCHEMA` tables. For example, if a MySQL configuration locates the data directory at the root of a file system on Unix, the system might create a `lost+found` directory there that the server should ignore. Starting the server with [`--ignore-db-dir=lost+found`](server-options.html#option_mysqld_ignore-db-dir) causes that name not to be listed as a database.

  To specify more than one name, use this option multiple times, once for each name. Specifying the option with an empty value (that is, as [`--ignore-db-dir=`](server-options.html#option_mysqld_ignore-db-dir)) resets the directory list to the empty list.

  Instances of this option given at server startup are used to set the [`ignore_db_dirs`](server-system-variables.html#sysvar_ignore_db_dirs) system variable.

  This option is deprecated in MySQL 5.7. With the introduction of the data dictionary in MySQL 8.0, it became superfluous and was removed in that version.

* [`--initialize`](server-options.html#option_mysqld_initialize)

  <table frame="box" rules="all" summary="Properties for ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>2

  This option is used to initialize a MySQL installation by creating the data directory and populating the tables in the `mysql` system database. For more information, see [Section 2.9.1, “Initializing the Data Directory”](data-directory-initialization.html "2.9.1 Initializing the Data Directory").

  This option limits the effects of, or is not compatible with, a number of other startup options for the MySQL server. Some of the most common issues of this sort are noted here:

  + We strongly recommend, when initializing the data directory with `--initialize`, that you specify no additional options other than [`--datadir`](server-system-variables.html#sysvar_datadir), other options used for setting directory locations such as [`--basedir`](server-system-variables.html#sysvar_basedir), and possibly [`--user`](server-options.html#option_mysqld_user), if required. Options for the running MySQL server can be specified when starting it once initialization has been completed and [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") has shut down. This also applies when using [`--initialize-insecure`](server-options.html#option_mysqld_initialize-insecure) instead of `--initialize`.

  + When the server is started with `--initialize`, some functionality is unavailable that limits the statements permitted in any file named by the [`init_file`](server-system-variables.html#sysvar_init_file) system variable. For more information, see the description of that variable. In addition, the [`disabled_storage_engines`](server-system-variables.html#sysvar_disabled_storage_engines) system variable has no effect.

  + The [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) option is ignored when used together with `--initialize`.

  + `--initialize` is mutually exclusive with [`--bootstrap`](server-options.html#option_mysqld_bootstrap) and [`--daemonize`](server-options.html#option_mysqld_daemonize).

  The items in the preceding list also apply when initializing the server using the [`--initialize-insecure`](server-options.html#option_mysqld_initialize-insecure) option.

* [`--initialize-insecure`](server-options.html#option_mysqld_initialize-insecure)

  <table frame="box" rules="all" summary="Properties for ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>3

  This option is used to initialize a MySQL installation by creating the data directory and populating the tables in the `mysql` system database. This option implies [`--initialize`](server-options.html#option_mysqld_initialize), and the same restrictions and limitations apply; for more information, see the description of that option, and [Section 2.9.1, “Initializing the Data Directory”](data-directory-initialization.html "2.9.1 Initializing the Data Directory").

  Warning

  This option creates a MySQL `root` user with an empty password, which is insecure. For this reason, do not use it in production without setting this password manually. See [Post-Initialization root Password Assignment](data-directory-initialization.html#data-directory-initialization-password-assignment "Post-Initialization root Password Assignment"), for information about how to do this.

* `--innodb-xxx`

  Set an option for the `InnoDB` storage engine. The `InnoDB` options are listed in [Section 14.15, “InnoDB Startup Options and System Variables”](innodb-parameters.html "14.15 InnoDB Startup Options and System Variables").

* [`--install [service_name]`](server-options.html#option_mysqld_install)

  <table frame="box" rules="all" summary="Properties for ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>4

  (Windows only) Install the server as a Windows service that starts automatically during Windows startup. The default service name is `MySQL` if no *`service_name`* value is given. For more information, see [Section 2.3.4.8, “Starting MySQL as a Windows Service”](windows-start-service.html "2.3.4.8 Starting MySQL as a Windows Service").

  Note

  If the server is started with the [`--defaults-file`](server-options.html#option_mysqld_defaults-file) and [`--install`](server-options.html#option_mysqld_install) options, [`--install`](server-options.html#option_mysqld_install) must be first.

* [`--install-manual [service_name]`](server-options.html#option_mysqld_install-manual)

  <table frame="box" rules="all" summary="Properties for ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>5

  (Windows only) Install the server as a Windows service that must be started manually. It does not start automatically during Windows startup. The default service name is `MySQL` if no *`service_name`* value is given. For more information, see [Section 2.3.4.8, “Starting MySQL as a Windows Service”](windows-start-service.html "2.3.4.8 Starting MySQL as a Windows Service").

  Note

  If the server is started with the [`--defaults-file`](option-file-options.html#option_general_defaults-file) and [`--install-manual`](server-options.html#option_mysqld_install-manual) options, [`--install-manual`](server-options.html#option_mysqld_install-manual) must be first.

* [`--language=lang_name, -L lang_name`](server-options.html#option_mysqld_language)

  <table frame="box" rules="all" summary="Properties for ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>6

  The language to use for error messages. *`lang_name`* can be given as the language name or as the full path name to the directory where the language files are installed. See [Section 10.12, “Setting the Error Message Language”](error-message-language.html "10.12 Setting the Error Message Language").

  [`--lc-messages-dir`](server-options.html#option_mysqld_lc-messages-dir) and [`--lc-messages`](server-options.html#option_mysqld_lc-messages) should be used rather than [`--language`](server-options.html#option_mysqld_language), which is deprecated (and handled as a synonym for [`--lc-messages-dir`](server-options.html#option_mysqld_lc-messages-dir)). You should expect the [`--language`](server-options.html#option_mysqld_language) option to be removed in a future release of MySQL.

* [`--large-pages`](server-options.html#option_mysqld_large-pages)

  <table frame="box" rules="all" summary="Properties for ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>7

  Some hardware/operating system architectures support memory pages greater than the default (usually 4KB). The actual implementation of this support depends on the underlying hardware and operating system. Applications that perform a lot of memory accesses may obtain performance improvements by using large pages due to reduced Translation Lookaside Buffer (TLB) misses.

  MySQL supports the Linux implementation of large page support (which is called HugeTLB in Linux). See [Section 8.12.4.3, “Enabling Large Page Support”](large-page-support.html "8.12.4.3 Enabling Large Page Support"). For Solaris support of large pages, see the description of the [`--super-large-pages`](server-options.html#option_mysqld_super-large-pages) option.

  [`--large-pages`](server-options.html#option_mysqld_large-pages) is disabled by default.

* [`--lc-messages=locale_name`](server-options.html#option_mysqld_lc-messages)

  <table frame="box" rules="all" summary="Properties for ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>8

  The locale to use for error messages. The default is `en_US`. The server converts the argument to a language name and combines it with the value of [`--lc-messages-dir`](server-options.html#option_mysqld_lc-messages-dir) to produce the location for the error message file. See [Section 10.12, “Setting the Error Message Language”](error-message-language.html "10.12 Setting the Error Message Language").

* [`--lc-messages-dir=dir_name`](server-options.html#option_mysqld_lc-messages-dir)

  <table frame="box" rules="all" summary="Properties for ansi"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ansi</code></td> </tr></tbody></table>9

  The directory where error messages are located. The server uses the value together with the value of [`--lc-messages`](server-options.html#option_mysqld_lc-messages) to produce the location for the error message file. See [Section 10.12, “Setting the Error Message Language”](error-message-language.html "10.12 Setting the Error Message Language").

* [`--local-service`](server-options.html#option_mysqld_local-service)

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>0

  (Windows only) A `--local-service` option following the service name causes the server to run using the `LocalService` Windows account that has limited system privileges. If both [`--defaults-file`](option-file-options.html#option_general_defaults-file) and `--local-service` are given following the service name, they can be in any order. See [Section 2.3.4.8, “Starting MySQL as a Windows Service”](windows-start-service.html "2.3.4.8 Starting MySQL as a Windows Service").

* [`--log-error[=file_name]`](server-options.html#option_mysqld_log-error)

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>1

  Write the error log and startup messages to this file. See [Section 5.4.2, “The Error Log”](error-log.html "5.4.2 The Error Log").

  If the option names no file, the error log file name on Unix and Unix-like systems is `host_name.err` in the data directory. The file name on Windows is the same, unless the [`--pid-file`](server-system-variables.html#sysvar_pid_file) option is specified. In that case, the file name is the PID file base name with a suffix of `.err` in the data directory.

  If the option names a file, the error log file has that name (with an `.err` suffix added if the name has no suffix), located under the data directory unless an absolute path name is given to specify a different location.

  On Windows, [`--console`](server-options.html#option_mysqld_console) takes precedence over [`--log-error`](server-options.html#option_mysqld_log-error) if both are given. In this case, the server writes the error log to the console rather than to a file. (In MySQL 5.5 and 5.6, this is reversed: [`--log-error`](server-options.html#option_mysqld_log-error) takes precedence over [`--console`](server-options.html#option_mysqld_console) if both are given.)

* [`--log-isam[=file_name]`](server-options.html#option_mysqld_log-isam)

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>2

  Log all `MyISAM` changes to this file (used only when debugging `MyISAM`).

* [`--log-raw`](server-options.html#option_mysqld_log-raw)

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>3

  Passwords in certain statements written to the general query log, slow query log, and binary log are rewritten by the server not to occur literally in plain text. Password rewriting can be suppressed for the general query log by starting the server with the [`--log-raw`](server-options.html#option_mysqld_log-raw) option. This option may be useful for diagnostic purposes, to see the exact text of statements as received by the server, but for security reasons is not recommended for production use.

  If a query rewrite plugin is installed, the [`--log-raw`](server-options.html#option_mysqld_log-raw) option affects statement logging as follows:

  + Without [`--log-raw`](server-options.html#option_mysqld_log-raw), the server logs the statement returned by the query rewrite plugin. This may differ from the statement as received.

  + With [`--log-raw`](server-options.html#option_mysqld_log-raw), the server logs the original statement as received.

  For more information, see [Section 6.1.2.3, “Passwords and Logging”](password-logging.html "6.1.2.3 Passwords and Logging").

* [`--log-short-format`](server-options.html#option_mysqld_log-short-format)

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>4

  Log less information to the slow query log, if it has been activated.

* [`--log-tc=file_name`](server-options.html#option_mysqld_log-tc)

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>5

  The name of the memory-mapped transaction coordinator log file (for XA transactions that affect multiple storage engines when the binary log is disabled). The default name is `tc.log`. The file is created under the data directory if not given as a full path name. This option is unused.

* [`--log-tc-size=size`](server-options.html#option_mysqld_log-tc-size)

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>6

  The size in bytes of the memory-mapped transaction coordinator log. The default and minimum values are 6 times the page size, and the value must be a multiple of the page size. (Before MySQL 5.7.21, the default size is 24KB.)

* [`--log-warnings[=level]`](server-options.html#option_mysqld_log-warnings), `-W [level]`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>7

  Note

  The [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity) system variable is preferred over, and should be used instead of, the [`--log-warnings`](server-options.html#option_mysqld_log-warnings) option or [`log_warnings`](server-system-variables.html#sysvar_log_warnings) system variable. For more information, see the descriptions of [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity) and [`log_warnings`](server-system-variables.html#sysvar_log_warnings). The [`--log-warnings`](server-options.html#option_mysqld_log-warnings) command-line option and [`log_warnings`](server-system-variables.html#sysvar_log_warnings) system variable are deprecated; expect them to be removed in a future release of MySQL.

  Whether to produce additional warning messages to the error log. This option is enabled by default. To disable it, use [`--log-warnings=0`](server-options.html#option_mysqld_log-warnings). Specifying the option without a *`level`* value increments the current value by 1. The server logs messages about statements that are unsafe for statement-based logging if the value is greater than 0. Aborted connections and access-denied errors for new connection attempts are logged if the value is greater than 1. See [Section B.3.2.9, “Communication Errors and Aborted Connections”](communication-errors.html "B.3.2.9 Communication Errors and Aborted Connections").

* [`--memlock`](server-options.html#option_mysqld_memlock)

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>8

  Lock the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") process in memory. This option might help if you have a problem where the operating system is causing [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") to swap to disk.

  [`--memlock`](server-options.html#option_mysqld_memlock) works on systems that support the `mlockall()` system call; this includes Solaris, most Linux distributions that use a 2.4 or higher kernel, and perhaps other Unix systems. On Linux systems, you can tell whether or not `mlockall()` (and thus this option) is supported by checking to see whether or not it is defined in the system `mman.h` file, like this:

  ```sql
  $> grep mlockall /usr/include/sys/mman.h
  ```

  If `mlockall()` is supported, you should see in the output of the previous command something like the following:

  ```sql
  extern int mlockall (int __flags) __THROW;
  ```

  Important

  Use of this option may require you to run the server as `root`, which, for reasons of security, is normally not a good idea. See [Section 6.1.5, “How to Run MySQL as a Normal User”](changing-mysql-user.html "6.1.5 How to Run MySQL as a Normal User").

  On Linux and perhaps other systems, you can avoid the need to run the server as `root` by changing the `limits.conf` file. See the notes regarding the memlock limit in [Section 8.12.4.3, “Enabling Large Page Support”](large-page-support.html "8.12.4.3 Enabling Large Page Support").

  You must not use this option on a system that does not support the `mlockall()` system call; if you do so, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") is very likely to exit as soon as you try to start it.

* [`--myisam-block-size=N`](server-options.html#option_mysqld_myisam-block-size)

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>9

  The block size to be used for `MyISAM` index pages.

* [`--no-defaults`](server-options.html#option_mysqld_no-defaults)

  Do not read any option files. If program startup fails due to reading unknown options from an option file, [`--no-defaults`](server-options.html#option_mysqld_no-defaults) can be used to prevent them from being read. This must be the first option on the command line if it is used.

  For additional information about this and other option-file options, see [Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--old-style-user-limits`](server-options.html#option_mysqld_old-style-user-limits)

  <table frame="box" rules="all" summary="Properties for bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bootstrap</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr></tbody></table>0

  Enable old-style user limits. (Before MySQL 5.0.3, account resource limits were counted separately for each host from which a user connected rather than per account row in the `user` table.) See [Section 6.2.16, “Setting Account Resource Limits”](user-resources.html "6.2.16 Setting Account Resource Limits").

* [`--partition[=value]`](server-options.html#option_mysqld_partition)

  <table frame="box" rules="all" summary="Properties for bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bootstrap</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr></tbody></table>1

  Enables or disables user-defined partitioning support in the MySQL Server.

  This option is deprecated in MySQL 5.7.16, and is removed from MySQL 8.0 because in MySQL 8.0, the partitioning engine is replaced by native partitioning, which cannot be disabled.

* `--performance-schema-xxx`

  Configure a Performance Schema option. For details, see [Section 25.14, “Performance Schema Command Options”](performance-schema-options.html "25.14 Performance Schema Command Options").

* [`--plugin-load=plugin_list`](server-options.html#option_mysqld_plugin-load)

  <table frame="box" rules="all" summary="Properties for bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bootstrap</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr></tbody></table>2

  This option tells the server to load the named plugins at startup. If multiple [`--plugin-load`](server-options.html#option_mysqld_plugin-load) options are given, only the last one applies. Additional plugins to load may be specified using [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) options.

  The option value is a semicolon-separated list of *`plugin_library`* and *`name`*`=`*`plugin_library`* values. Each *`plugin_library`* is the name of a library file that contains plugin code, and each *`name`* is the name of a plugin to load. If a plugin library is named without any preceding plugin name, the server loads all plugins in the library. With a preceding plugin name, the server loads only the named plugin from the libary. The server looks for plugin library files in the directory named by the [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) system variable.

  For example, if plugins named `myplug1` and `myplug2` are contained in the plugin library files `myplug1.so` and `myplug2.so`, use this option to perform an early plugin load:

  ```sql
  mysqld --plugin-load="myplug1=myplug1.so;myplug2=myplug2.so"
  ```

  Quotes surround the argument value because otherwise some command interpreters interpret semicolon (`;`) as a special character. (For example, Unix shells treat it as a command terminator.)

  Each named plugin is loaded for a single invocation of [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") only. After a restart, the plugin is not loaded unless [`--plugin-load`](server-options.html#option_mysqld_plugin-load) is used again. This is in contrast to [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement"), which adds an entry to the `mysql.plugins` table to cause the plugin to be loaded for every normal server startup.

  During the normal startup sequence, the server determines which plugins to load by reading the `mysql.plugins` system table. If the server is started with the [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) option, plugins registered in the `mysql.plugins` table are not loaded and are unavailable. [`--plugin-load`](server-options.html#option_mysqld_plugin-load) enables plugins to be loaded even when [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) is given. [`--plugin-load`](server-options.html#option_mysqld_plugin-load) also enables plugins to be loaded at startup that cannot be loaded at runtime.

  This option does not set a corresponding system variable. The output of [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") provides information about loaded plugins. More detailed information can be found in the Information Schema [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") table. See [Section 5.5.2, “Obtaining Server Plugin Information”](obtaining-plugin-information.html "5.5.2 Obtaining Server Plugin Information").

  For additional information about plugin loading, see [Section 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").

* [`--plugin-load-add=plugin_list`](server-options.html#option_mysqld_plugin-load-add)

  <table frame="box" rules="all" summary="Properties for bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bootstrap</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr></tbody></table>3

  This option complements the [`--plugin-load`](server-options.html#option_mysqld_plugin-load) option. [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) adds a plugin or plugins to the set of plugins to be loaded at startup. The argument format is the same as for [`--plugin-load`](server-options.html#option_mysqld_plugin-load). [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) can be used to avoid specifying a large set of plugins as a single long unwieldy [`--plugin-load`](server-options.html#option_mysqld_plugin-load) argument.

  [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) can be given in the absence of [`--plugin-load`](server-options.html#option_mysqld_plugin-load), but any instance of [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) that appears before [`--plugin-load`](server-options.html#option_mysqld_plugin-load) has no effect because [`--plugin-load`](server-options.html#option_mysqld_plugin-load) resets the set of plugins to load. In other words, these options:

  ```sql
  --plugin-load=x --plugin-load-add=y
  ```

  are equivalent to this option:

  ```sql
  --plugin-load="x;y"
  ```

  But these options:

  ```sql
  --plugin-load-add=y --plugin-load=x
  ```

  are equivalent to this option:

  ```sql
  --plugin-load=x
  ```

  This option does not set a corresponding system variable. The output of [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") provides information about loaded plugins. More detailed information can be found in the Information Schema [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") table. See [Section 5.5.2, “Obtaining Server Plugin Information”](obtaining-plugin-information.html "5.5.2 Obtaining Server Plugin Information").

  For additional information about plugin loading, see [Section 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").

* [`--plugin-xxx`](server-options.html#option_mysqld_plugin-xxx)

  Specifies an option that pertains to a server plugin. For example, many storage engines can be built as plugins, and for such engines, options for them can be specified with a `--plugin` prefix. Thus, the [`--innodb-file-per-table`](innodb-parameters.html#sysvar_innodb_file_per_table) option for `InnoDB` can be specified as [`--plugin-innodb-file-per-table`](innodb-parameters.html#sysvar_innodb_file_per_table).

  For boolean options that can be enabled or disabled, the `--skip` prefix and other alternative formats are supported as well (see [Section 4.2.2.4, “Program Option Modifiers”](option-modifiers.html "4.2.2.4 Program Option Modifiers")). For example, [`--skip-plugin-innodb-file-per-table`](innodb-parameters.html#sysvar_innodb_file_per_table) disables [`innodb-file-per-table`](innodb-parameters.html#sysvar_innodb_file_per_table).

  The rationale for the `--plugin` prefix is that it enables plugin options to be specified unambiguously if there is a name conflict with a built-in server option. For example, were a plugin writer to name a plugin “sql” and implement a “mode” option, the option name might be [`--sql-mode`](server-options.html#option_mysqld_sql-mode), which would conflict with the built-in option of the same name. In such cases, references to the conflicting name are resolved in favor of the built-in option. To avoid the ambiguity, users can specify the plugin option as `--plugin-sql-mode`. Use of the `--plugin` prefix for plugin options is recommended to avoid any question of ambiguity.

* [`--port=port_num`](server-options.html#option_mysqld_port), `-P port_num`

  <table frame="box" rules="all" summary="Properties for bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bootstrap</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr></tbody></table>4

  The port number to use when listening for TCP/IP connections. On Unix and Unix-like systems, the port number must be 1024 or higher unless the server is started by the `root` operating system user. Setting this option to 0 causes the default value to be used.

* [`--port-open-timeout=num`](server-options.html#option_mysqld_port-open-timeout)

  <table frame="box" rules="all" summary="Properties for bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bootstrap</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr></tbody></table>5

  On some systems, when the server is stopped, the TCP/IP port might not become available immediately. If the server is restarted quickly afterward, its attempt to reopen the port can fail. This option indicates how many seconds the server should wait for the TCP/IP port to become free if it cannot be opened. The default is not to wait.

* [`--print-defaults`](server-options.html#option_mysqld_print-defaults)

  Print the program name and all options that it gets from option files. Password values are masked. This must be the first option on the command line if it is used, except that it may be used immediately after [`--defaults-file`](server-options.html#option_mysqld_defaults-file) or [`--defaults-extra-file`](server-options.html#option_mysqld_defaults-extra-file).

  For additional information about this and other option-file options, see [Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--remove [service_name]`](server-options.html#option_mysqld_remove)

  <table frame="box" rules="all" summary="Properties for bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bootstrap</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr></tbody></table>6

  (Windows only) Remove a MySQL Windows service. The default service name is `MySQL` if no *`service_name`* value is given. For more information, see [Section 2.3.4.8, “Starting MySQL as a Windows Service”](windows-start-service.html "2.3.4.8 Starting MySQL as a Windows Service").

* [`--safe-user-create`](server-options.html#option_mysqld_safe-user-create)

  <table frame="box" rules="all" summary="Properties for bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bootstrap</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr></tbody></table>7

  If this option is enabled, a user cannot create new MySQL users by using the [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statement unless the user has the [`INSERT`](privileges-provided.html#priv_insert) privilege for the `mysql.user` system table or any column in the table. If you want a user to have the ability to create new users that have those privileges that the user has the right to grant, you should grant the user the following privilege:

  ```sql
  GRANT INSERT(user) ON mysql.user TO 'user_name'@'host_name';
  ```

  This ensures that the user cannot change any privilege columns directly, but has to use the [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statement to give privileges to other users.

* [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables)

  <table frame="box" rules="all" summary="Properties for bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bootstrap</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr></tbody></table>8

  This option affects the server startup sequence:

  + [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) causes the server not to read the grant tables in the `mysql` system database, and thus to start without using the privilege system at all. This gives anyone with access to the server *unrestricted access to all databases*.

    To cause a server started with [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) to load the grant tables at runtime, perform a privilege-flushing operation, which can be done in these ways:

    - Issue a MySQL [`FLUSH PRIVILEGES`](flush.html#flush-privileges) statement after connecting to the server.

    - Execute a [**mysqladmin flush-privileges**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") or [**mysqladmin reload**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") command from the command line.

    Privilege flushing might also occur implicitly as a result of other actions performed after startup, thus causing the server to start using the grant tables. For example, [**mysql\_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") flushes the privileges during the upgrade procedure.

  + [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) causes the server not to load certain other objects registered in the `mysql` system database:

    - Plugins installed using [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") and registered in the `mysql.plugin` system table.

      To cause plugins to be loaded even when using [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables), use the [`--plugin-load`](server-options.html#option_mysqld_plugin-load) or [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) option.

    - Scheduled events installed using [`CREATE EVENT`](create-event.html "13.1.12 CREATE EVENT Statement") and registered in the `mysql.event` system table.

    - Loadable functions installed using [`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions") and registered in the `mysql.func` system table.

  + [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) causes the [`disabled_storage_engines`](server-system-variables.html#sysvar_disabled_storage_engines) system variable to have no effect.

* [`--skip-host-cache`](server-options.html#option_mysqld_skip-host-cache)

  <table frame="box" rules="all" summary="Properties for bootstrap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bootstrap</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr></tbody></table>9

  Disable use of the internal host cache for faster name-to-IP resolution. With the cache disabled, the server performs a DNS lookup every time a client connects.

  Use of [`--skip-host-cache`](server-options.html#option_mysqld_skip-host-cache) is similar to setting the [`host_cache_size`](server-system-variables.html#sysvar_host_cache_size) system variable to 0, but [`host_cache_size`](server-system-variables.html#sysvar_host_cache_size) is more flexible because it can also be used to resize, enable, or disable the host cache at runtime, not just at server startup.

  Starting the server with [`--skip-host-cache`](server-options.html#option_mysqld_skip-host-cache) does not prevent runtime changes to the value of [`host_cache_size`](server-system-variables.html#sysvar_host_cache_size), but such changes have no effect and the cache is not re-enabled even if [`host_cache_size`](server-system-variables.html#sysvar_host_cache_size) is set larger than 0.

  For more information about how the host cache works, see [Section 5.1.11.2, “DNS Lookups and the Host Cache”](host-cache.html "5.1.11.2 DNS Lookups and the Host Cache").

* [`--skip-innodb`](innodb-parameters.html#option_mysqld_innodb)

  Disable the `InnoDB` storage engine. In this case, because the default storage engine is [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), the server cannot start unless you also use [`--default-storage-engine`](server-system-variables.html#sysvar_default_storage_engine) and [`--default-tmp-storage-engine`](server-system-variables.html#sysvar_default_tmp_storage_engine) to set the default to some other engine for both permanent and `TEMPORARY` tables.

  The `InnoDB` storage engine cannot be disabled, and the [`--skip-innodb`](innodb-parameters.html#option_mysqld_innodb) option is deprecated and has no effect. Its use results in a warning. Expect this option to be removed in a future release of MySQL.

* [`--skip-new`](server-options.html#option_mysqld_skip-new)

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>0

  This option disables (what used to be considered) new, possibly unsafe behaviors. It results in these settings: [`delay_key_write=OFF`](server-system-variables.html#sysvar_delay_key_write), [`concurrent_insert=NEVER`](server-system-variables.html#sysvar_concurrent_insert), [`automatic_sp_privileges=OFF`](server-system-variables.html#sysvar_automatic_sp_privileges). It also causes [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") to be mapped to [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") for storage engines for which [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") is not supported.

* [`--skip-partition`](server-options.html#option_mysqld_skip-partition)

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>1

  Disables user-defined partitioning. Partitioned tables can be seen using [`SHOW TABLES`](show-tables.html "13.7.5.37 SHOW TABLES Statement") or by querying the Information Schema [`TABLES`](information-schema-tables-table.html "24.3.25 The INFORMATION_SCHEMA TABLES Table") table, but cannot be created or modified, nor can data in such tables be accessed. All partition-specific columns in the Information Schema [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table") table display `NULL`.

  Since [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") removes table definition (`.frm`) files, this statement works on partitioned tables even when partitioning is disabled using the option. The statement, however, does not remove partition definitions associated with partitioned tables in such cases. For this reason, you should avoid dropping partitioned tables with partitioning disabled, or take action to remove orphaned `.par` files manually (if present).

  Note

  In MySQL 5.7, partition definition (`.par`) files are no longer created for partitioned `InnoDB` tables. Instead, partition definitions are stored in the `InnoDB` internal data dictionary. Partition definition (`.par`) files continue to be used for partitioned `MyISAM` tables.

  This option is deprecated in MySQL 5.7.16, and is removed from MySQL 8.0 because in MySQL 8.0, the partitioning engine is replaced by native partitioning, which cannot be disabled.

* [`--skip-show-database`](server-options.html#option_mysqld_skip-show-database)

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>2

  This option sets the [`skip_show_database`](server-system-variables.html#sysvar_skip_show_database) system variable that controls who is permitted to use the [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement") statement. See [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

* [`--skip-stack-trace`](server-options.html#option_mysqld_skip-stack-trace)

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>3

  Do not write stack traces. This option is useful when you are running [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") under a debugger. On some systems, you also must use this option to get a core file. See [Section 5.8, “Debugging MySQL”](debugging-mysql.html "5.8 Debugging MySQL").

* [`--slow-start-timeout=timeout`](server-options.html#option_mysqld_slow-start-timeout)

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>4

  This option controls the Windows service control manager's service start timeout. The value is the maximum number of milliseconds that the service control manager waits before trying to kill the windows service during startup. The default value is 15000 (15 seconds). If the MySQL service takes too long to start, you may need to increase this value. A value of 0 means there is no timeout.

* [`--socket=path`](server-options.html#option_mysqld_socket)

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>5

  On Unix, this option specifies the Unix socket file to use when listening for local connections. The default value is `/tmp/mysql.sock`. If this option is given, the server creates the file in the data directory unless an absolute path name is given to specify a different directory. On Windows, the option specifies the pipe name to use when listening for local connections that use a named pipe. The default value is `MySQL` (not case-sensitive).

* [`--sql-mode=value[,value[,value...]]`](server-options.html#option_mysqld_sql-mode)

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>6

  Set the SQL mode. See [Section 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes").

  Note

  MySQL installation programs may configure the SQL mode during the installation process. If the SQL mode differs from the default or from what you expect, check for a setting in an option file that the server reads at startup.

* [`--ssl`](server-options.html#option_mysqld_ssl), [`--skip-ssl`](server-options.html#option_mysqld_ssl)

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>7

  The [`--ssl`](server-options.html#option_mysqld_ssl) option specifies that the server permits but does not require encrypted connections. This option is enabled by default.

  [`--ssl`](server-options.html#option_mysqld_ssl) can be specified in negated form as [`--skip-ssl`](server-options.html#option_mysqld_ssl) or a synonym ([`--ssl=OFF`](server-options.html#option_mysqld_ssl), [`--disable-ssl`](server-options.html#option_mysqld_ssl)). In this case, the option specifies that the server does *not* permit encrypted connections, regardless of the settings of the `tls_xxx` and `ssl_xxx` system variables.

  For more information about configuring whether the server permits clients to connect using SSL and indicating where to find SSL keys and certificates, see [Section 6.3.1, “Configuring MySQL to Use Encrypted Connections”](using-encrypted-connections.html "6.3.1 Configuring MySQL to Use Encrypted Connections"), which also describes server capabilities for certificate and key file autogeneration and autodiscovery. Consider setting at least the [`ssl_cert`](server-system-variables.html#sysvar_ssl_cert) and [`ssl_key`](server-system-variables.html#sysvar_ssl_key) system variables on the server side and the [`--ssl-ca`](connection-options.html#option_general_ssl-ca) (or [`--ssl-capath`](connection-options.html#option_general_ssl-capath)) option on the client side.

* [`--standalone`](server-options.html#option_mysqld_standalone)

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>8

  Available on Windows only; instructs the MySQL server not to run as a service.

* [`--super-large-pages`](server-options.html#option_mysqld_super-large-pages)

  <table frame="box" rules="all" summary="Properties for character-set-client-handshake"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-set-client-handshake[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>9

  Standard use of large pages in MySQL attempts to use the largest size supported, up to 4MB. Under Solaris, a “super large pages” feature enables uses of pages up to 256MB. This feature is available for recent SPARC platforms. It can be enabled or disabled by using the [`--super-large-pages`](server-options.html#option_mysqld_super-large-pages) or [`--skip-super-large-pages`](server-options.html#option_mysqld_super-large-pages) option.

* [`--symbolic-links`](server-options.html#option_mysqld_symbolic-links), [`--skip-symbolic-links`](server-options.html#option_mysqld_symbolic-links)

  <table frame="box" rules="all" summary="Properties for chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>0

  Enable or disable symbolic link support. On Unix, enabling symbolic links means that you can link a `MyISAM` index file or data file to another directory with the `INDEX DIRECTORY` or `DATA DIRECTORY` option of the [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement. If you delete or rename the table, the files that its symbolic links point to also are deleted or renamed. See [Section 8.12.3.2, “Using Symbolic Links for MyISAM Tables on Unix”](symbolic-links-to-tables.html "8.12.3.2 Using Symbolic Links for MyISAM Tables on Unix").

  This option has no meaning on Windows.

* [`--sysdate-is-now`](server-options.html#option_mysqld_sysdate-is-now)

  <table frame="box" rules="all" summary="Properties for chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>1

  [`SYSDATE()`](date-and-time-functions.html#function_sysdate) by default returns the time at which it executes, not the time at which the statement in which it occurs begins executing. This differs from the behavior of [`NOW()`](date-and-time-functions.html#function_now). This option causes [`SYSDATE()`](date-and-time-functions.html#function_sysdate) to be a synonym for [`NOW()`](date-and-time-functions.html#function_now). For information about the implications for binary logging and replication, see the description for [`SYSDATE()`](date-and-time-functions.html#function_sysdate) in [Section 12.7, “Date and Time Functions”](date-and-time-functions.html "12.7 Date and Time Functions") and for `SET TIMESTAMP` in [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

* [`--tc-heuristic-recover={COMMIT|ROLLBACK}`](server-options.html#option_mysqld_tc-heuristic-recover)

  <table frame="box" rules="all" summary="Properties for chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>2

  The decision to use in a manual heuristic recovery.

  If a `--tc-heuristic-recover` option is specified, the server exits regardless of whether manual heuristic recovery is successful.

  On systems with more than one storage engine capable of two-phase commit, the `ROLLBACK` option is not safe and causes recovery to halt with the following error:

  ```sql
  [ERROR] --tc-heuristic-recover rollback
  strategy is not safe on systems with more than one 2-phase-commit-capable
  storage engine. Aborting crash recovery.
  ```

* [`--temp-pool`](server-options.html#option_mysqld_temp-pool)

  <table frame="box" rules="all" summary="Properties for chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>3

  This option is ignored except on Linux. On Linux, it causes most temporary files created by the server to use a small set of names, rather than a unique name for each new file. This works around a problem in the Linux kernel dealing with creating many new files with different names. With the old behavior, Linux seems to “leak” memory, because it is being allocated to the directory entry cache rather than to the disk cache.

  As of MySQL 5.7.18, this option is deprecated and is removed in MySQL 8.0.

* [`--transaction-isolation=level`](server-options.html#option_mysqld_transaction-isolation)

  <table frame="box" rules="all" summary="Properties for chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>4

  Sets the default transaction isolation level. The `level` value can be [`READ-UNCOMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-uncommitted), [`READ-COMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-committed), [`REPEATABLE-READ`](innodb-transaction-isolation-levels.html#isolevel_repeatable-read), or [`SERIALIZABLE`](innodb-transaction-isolation-levels.html#isolevel_serializable). See [Section 13.3.6, “SET TRANSACTION Statement”](set-transaction.html "13.3.6 SET TRANSACTION Statement").

  The default transaction isolation level can also be set at runtime using the [`SET TRANSACTION`](set-transaction.html "13.3.6 SET TRANSACTION Statement") statement or by setting the [`tx_isolation`](server-system-variables.html#sysvar_tx_isolation) (or, as of MySQL 5.7.20, [`transaction_isolation`](server-system-variables.html#sysvar_transaction_isolation)) system variable.

* [`--transaction-read-only`](server-options.html#option_mysqld_transaction-read-only)

  <table frame="box" rules="all" summary="Properties for chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>5

  Sets the default transaction access mode. By default, read-only mode is disabled, so the mode is read/write.

  To set the default transaction access mode at runtime, use the [`SET TRANSACTION`](set-transaction.html "13.3.6 SET TRANSACTION Statement") statement or set the [`tx_read_only`](server-system-variables.html#sysvar_tx_read_only) (or, as of MySQL 5.7.20, [`transaction_read_only`](server-system-variables.html#sysvar_transaction_read_only)) system variable. See [Section 13.3.6, “SET TRANSACTION Statement”](set-transaction.html "13.3.6 SET TRANSACTION Statement").

* [`--tmpdir=dir_name`](server-options.html#option_mysqld_tmpdir), `-t dir_name`

  <table frame="box" rules="all" summary="Properties for chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>6

  The path of the directory to use for creating temporary files. It might be useful if your default `/tmp` directory resides on a partition that is too small to hold temporary tables. This option accepts several paths that are used in round-robin fashion. Paths should be separated by colon characters (`:`) on Unix and semicolon characters (`;`) on Windows.

  [`--tmpdir`](server-options.html#option_mysqld_tmpdir) can be a non-permanent location, such as a directory on a memory-based file system or a directory that is cleared when the server host restarts. If the MySQL server is acting as a replica, and you are using a non-permanent location for [`--tmpdir`](server-options.html#option_mysqld_tmpdir), consider setting a different temporary directory for the replica using the [`slave_load_tmpdir`](replication-options-replica.html#sysvar_slave_load_tmpdir) system variable. For a replication replica, the temporary files used to replicate [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") statements are stored in this directory, so with a permanent location they can survive machine restarts, although replication can now continue after a restart if the temporary files have been removed.

  For more information about the storage location of temporary files, see [Section B.3.3.5, “Where MySQL Stores Temporary Files”](temporary-files.html "B.3.3.5 Where MySQL Stores Temporary Files").

* [`--user={user_name|user_id}`](server-options.html#option_mysqld_user), `-u {user_name|user_id}`

  <table frame="box" rules="all" summary="Properties for chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>7

  Run the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") server as the user having the name *`user_name`* or the numeric user ID *`user_id`*. (“User” in this context refers to a system login account, not a MySQL user listed in the grant tables.)

  This option is *mandatory* when starting [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") as `root`. The server changes its user ID during its startup sequence, causing it to run as that particular user rather than as `root`. See [Section 6.1.1, “Security Guidelines”](security-guidelines.html "6.1.1 Security Guidelines").

  To avoid a possible security hole where a user adds a [`--user=root`](server-options.html#option_mysqld_user) option to a `my.cnf` file (thus causing the server to run as `root`), [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") uses only the first [`--user`](server-options.html#option_mysqld_user) option specified and produces a warning if there are multiple [`--user`](server-options.html#option_mysqld_user) options. Options in `/etc/my.cnf` and `$MYSQL_HOME/my.cnf` are processed before command-line options, so it is recommended that you put a [`--user`](server-options.html#option_mysqld_user) option in `/etc/my.cnf` and specify a value other than `root`. The option in `/etc/my.cnf` is found before any other [`--user`](server-options.html#option_mysqld_user) options, which ensures that the server runs as a user other than `root`, and that a warning results if any other [`--user`](server-options.html#option_mysqld_user) option is found.

* [`--validate-user-plugins[={OFF|ON}]`](server-options.html#option_mysqld_validate-user-plugins)

  <table frame="box" rules="all" summary="Properties for chroot"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--chroot=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>8

  If this option is enabled (the default), the server checks each user account and produces a warning if conditions are found that would make the account unusable:

  + The account requires an authentication plugin that is not loaded.

  + The account requires the `sha256_password` authentication plugin but the server was started with neither SSL nor RSA enabled as required by this plugin.

  Enabling [`--validate-user-plugins`](server-options.html#option_mysqld_validate-user-plugins) slows down server initialization and [`FLUSH PRIVILEGES`](flush.html#flush-privileges). If you do not require the additional checking, you can disable this option at startup to avoid the performance decrement.

* [`--verbose`](server-options.html#option_mysqld_verbose), [`-v`](server-options.html#option_mysqld_verbose)

  Use this option with the [`--help`](server-options.html#option_mysqld_help) option for detailed help.

* [`--version`](server-options.html#option_mysqld_version), `-V`

  Display version information and exit.
