### 4.4.2 mysql\_install\_db — Initialize MySQL Data Directory

Note

**mysql\_install\_db** is deprecated as of MySQL 5.7.6 because its functionality has been integrated into **mysqld**, the MySQL server. To initialize a MySQL installation, invoke **mysqld** with the `--initialize` or `--initialize-insecure` option. For more information, see Section 2.9.1, “Initializing the Data Directory”. You should expect **mysql\_install\_db** to be removed in a future MySQL release.

**mysql\_install\_db** handles initialization tasks that must be performed before the MySQL server, **mysqld**, is ready to use:

* It initializes the MySQL data directory and creates the system tables that it contains.

* It initializes the system tablespace and related data structures needed to manage `InnoDB` tables.

* It loads the server-side help tables.
* It installs the `sys` schema.
* It creates an administrative account. Older versions of **mysql\_install\_db** may create anonymous-user accounts.

#### Secure-by-Default Deployment

Current versions of **mysql\_install\_db** produce a MySQL deployment that is secure by default, with these characteristics:

* A single administrative account named `'root'@'localhost'` is created with a randomly generated password, which is marked expired.

* No anonymous-user accounts are created.
* No `test` database accessible by all users is created.

* `--admin-xxx` options are available to control characteristics of the administrative account.

* The `--random-password-file` option is available to control where the random password is written.

* The `--insecure` option is available to suppress random password generation.

If **mysql\_install\_db** generates a random administative password, it writes the password to a file and displays the file name. The password entry includes a timestamp to indicate when it was written. By default, the file is `.mysql_secret` in the home directory of the effective user running the script. `.mysql_secret` is created with mode 600 to be accessible only to the operating system user for whom it is created.

Important

When **mysql\_install\_db** generates a random password for the administrative account, it is necessary after **mysql\_install\_db** has been run to start the server, connect using the administrative account with the password written to the `.mysql_secret` file, and specify a new administrative password. Until this is done, the administrative account cannot be used for anything else. To change the password, you can use the `SET PASSWORD` statement (for example, with the **mysql** or **mysqladmin** client). After resetting the password, remove the `.mysql_secret` file; otherwise, if you run **mysql\_secure\_installation**, that command may see the file and expire the `root` password again as part of ensuring secure deployment.

#### Invocation Syntax

Change location to the MySQL installation directory and use this invocation syntax:

```sql
bin/mysql_install_db --datadir=path/to/datadir [other_options]
```

The `--datadir` option is mandatory. **mysql\_install\_db** creates the data directory, which must not already exist:

* If the data directory does already exist, you are performing an upgrade operation (not an install operation) and should run **mysql\_upgrade**, not **mysql\_install\_db**. See Section 4.4.7, “mysql\_upgrade — Check and Upgrade MySQL Tables”.

* If the data directory does not exist but **mysql\_install\_db** fails, you must remove any partially created data directory before running **mysql\_install\_db** again.

Because the MySQL server, **mysqld**, must access the data directory when it runs later, you should either run **mysql\_install\_db** from the same system account used for running **mysqld**, or run it as `root` and specify the `--user` option to indicate the user name that **mysqld** runs under. It might be necessary to specify other options such as `--basedir` if **mysql\_install\_db** does not use the correct location for the installation directory. For example:

```sql
bin/mysql_install_db --user=mysql \
    --basedir=/opt/mysql/mysql \
    --datadir=/opt/mysql/mysql/data
```

Note

After **mysql\_install\_db** sets up the `InnoDB` system tablespace, changes to some tablespace characteristics require setting up a whole new instance. This includes the file name of the first file in the system tablespace and the number of undo logs. If you do not want to use the default values, make sure that the settings for the `innodb_data_file_path` and `innodb_log_file_size` configuration parameters are in place in the MySQL configuration file before running **mysql\_install\_db**. Also make sure to specify as necessary other parameters that affect the creation and location of `InnoDB` files, such as `innodb_data_home_dir` and `innodb_log_group_home_dir`.

If those options are in your configuration file but that file is not in a location that MySQL reads by default, specify the file location using the `--defaults-extra-file` option when you run **mysql\_install\_db**.

Note

If you have set a custom `TMPDIR` environment variable when performing the installation, and the specified directory is not accessible, **mysql\_install\_db** may fail. If so, unset `TMPDIR` or set `TMPDIR` to point to the system temporary directory (usually `/tmp`).

#### Administrative Account Creation

**mysql\_install\_db** creates an administrative account named `'root'@'localhost'` by default.

**mysql\_install\_db** provides options that enable you to control several aspects of the administrative account:

* To change the user or host parts of the account name, use `--login-path`, or `--admin-user` and `--admin-host`.

* `--insecure` suppresses generation of a random password.

* `--admin-auth-plugin` specifies the authentication plugin.

* `--admin-require-ssl` specifies whether the account must use SSL connections.

For more information, see the descriptions of those options.

**mysql\_install\_db** assigns `mysql.user` system table rows a nonempty `plugin` column value to set the authentication plugin. The default value is `mysql_native_password`. The value can be changed using the `--admin-auth-plugin` option.

#### Default my.cnf File

**mysql\_install\_db** creates no default `my.cnf` file.

Note

As of MySQL 5.7.18, `my-default.cnf` is no longer included in or installed by distribution packages.

With one exception, the settings in the default option file are commented and have no effect. The exception is that the file sets the `sql_mode` system variable to `NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES`. This setting produces a server configuration that results in errors rather than warnings for bad data in operations that modify transactional tables. See Section 5.1.10, “Server SQL Modes”.

#### Command Options

**mysql\_install\_db** supports the following options, which can be specified on the command line or in the `[mysql_install_db]` group of an option file. For information about option files used by MySQL programs, see Section 4.2.2.2, “Using Option Files”.

**Table 4.8 mysql\_install\_db Options**

<table frame="box" rules="all" summary="Command-line options available for mysql_install_db."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Option Name</th> <th>Description</th> </tr></thead><tbody><tr><td><a class="link" href="mysql-install-db.html#option_mysql_install_db_admin-auth-plugin">--admin-auth-plugin</a></td> <td>Administrative account authentication plugin</td> </tr><tr><td><a class="link" href="mysql-install-db.html#option_mysql_install_db_admin-host">--admin-host</a></td> <td>Administrative account name host part</td> </tr><tr><td><a class="link" href="mysql-install-db.html#option_mysql_install_db_admin-require-ssl">--admin-require-ssl</a></td> <td>Require SSL for administrative account</td> </tr><tr><td><a class="link" href="mysql-install-db.html#option_mysql_install_db_admin-user">--admin-user</a></td> <td>Administrative account name user part</td> </tr><tr><td><a class="link" href="mysql-install-db.html#option_mysql_install_db_basedir">--basedir</a></td> <td>Path to base directory</td> </tr><tr><td><a class="link" href="mysql-install-db.html#option_mysql_install_db_builddir">--builddir</a></td> <td>Path to build directory (for out-of-source builds)</td> </tr><tr><td><a class="link" href="mysql-install-db.html#option_mysql_install_db_datadir">--datadir</a></td> <td>Path to data directory</td> </tr><tr><td><a class="link" href="mysql-install-db.html#option_mysql_install_db_defaults">--defaults</a></td> <td>Read default option files</td> </tr><tr><td><a class="link" href="mysql-install-db.html#option_mysql_install_db_defaults-extra-file">--defaults-extra-file</a></td> <td>Read named option file in addition to usual option files</td> </tr><tr><td><a class="link" href="mysql-install-db.html#option_mysql_install_db_defaults-file">--defaults-file</a></td> <td>Read only named option file</td> </tr><tr><td><a class="link" href="mysql-install-db.html#option_mysql_install_db_extra-sql-file">--extra-sql-file</a></td> <td>Optional SQL file to execute during bootstrap</td> </tr><tr><td><a class="link" href="mysql-install-db.html#option_mysql_install_db_help">--help</a></td> <td>Display help message and exit</td> </tr><tr><td><a class="link" href="mysql-install-db.html#option_mysql_install_db_insecure">--insecure</a></td> <td>Do not generate administrative account random password</td> </tr><tr><td><a class="link" href="mysql-install-db.html#option_mysql_install_db_lc-messages">--lc-messages</a></td> <td>Locale for error messages</td> </tr><tr><td><a class="link" href="mysql-install-db.html#option_mysql_install_db_lc-messages-dir">--lc-messages-dir</a></td> <td>Directory where error messages are installed</td> </tr><tr><td><a class="link" href="mysql-install-db.html#option_mysql_install_db_login-file">--login-file</a></td> <td>File to read for login path information</td> </tr><tr><td><a class="link" href="mysql-install-db.html#option_mysql_install_db_login-path">--login-path</a></td> <td>Read login path options from .mylogin.cnf</td> </tr><tr><td><a class="link" href="mysql-install-db.html#option_mysql_install_db_mysqld-file">--mysqld-file</a></td> <td>Path to mysqld binary</td> </tr><tr><td><a class="link" href="mysql-install-db.html#option_mysql_install_db_no-defaults">--no-defaults</a></td> <td>Read no option files</td> </tr><tr><td><a class="link" href="mysql-install-db.html#option_mysql_install_db_random-password-file">--random-password-file</a></td> <td>File in which to write administrative account random password</td> </tr><tr><td><a class="link" href="mysql-install-db.html#option_mysql_install_db_skip-sys-schema">--skip-sys-schema</a></td> <td>Do not install or upgrade the sys schema</td> </tr><tr><td><a class="link" href="mysql-install-db.html#option_mysql_install_db_srcdir">--srcdir</a></td> <td>For internal use</td> </tr><tr><td><a class="link" href="mysql-install-db.html#option_mysql_install_db_user">--user</a></td> <td>Operating system user under which to execute mysqld</td> </tr><tr><td><a class="link" href="mysql-install-db.html#option_mysql_install_db_verbose">--verbose</a></td> <td>Verbose mode</td> </tr><tr><td><a class="link" href="mysql-install-db.html#option_mysql_install_db_version">--version</a></td> <td>Display version information and exit</td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--admin-auth-plugin=plugin_name`

  <table frame="box" rules="all" summary="Properties for admin-auth-plugin"><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The authentication plugin to use for the administrative account. The default is `mysql_native_password`.

* `--admin-host=host_name`

  <table frame="box" rules="all" summary="Properties for admin-host"><tbody><tr><th>Command-Line Format</th> <td><code>--admin-host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The host part to use for the adminstrative account name. The default is `localhost`. This option is ignored if `--login-path` is also specified.

* `--admin-require-ssl`

  <table frame="box" rules="all" summary="Properties for admin-require-ssl"><tbody><tr><th>Command-Line Format</th> <td><code>--admin-require-ssl</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Whether to require SSL for the administrative account. The default is not to require it. With this option enabled, the statement that **mysql\_install\_db** uses to create the account includes a `REQUIRE SSL` clause. As a result, the administrative account must use secure connections when connecting to the server.

* `--admin-user=user_name`

  <table frame="box" rules="all" summary="Properties for admin-user"><tbody><tr><th>Command-Line Format</th> <td><code>--admin-user=user_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The user part to use for the adminstrative account name. The default is `root`. This option is ignored if `--login-path` is also specified.

* `--basedir=dir_name`

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The path to the MySQL installation directory.

* `--builddir=dir_name`

  <table frame="box" rules="all" summary="Properties for builddir"><tbody><tr><th>Command-Line Format</th> <td><code>--builddir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  For use with `--srcdir` and out-of-source builds. Set this to the location of the directory where the built files reside.

* `--datadir=dir_name`

  <table frame="box" rules="all" summary="Properties for datadir"><tbody><tr><th>Command-Line Format</th> <td><code>--datadir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The path to the MySQL data directory. Only the last component of the path name is created if it does not exist; the parent directory must already exist or an error occurs.

  Note

  The `--datadir` option is mandatory and the data directory must not already exist.

* `--defaults`

  <table frame="box" rules="all" summary="Properties for defaults"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  This option causes **mysql\_install\_db** to invoke **mysqld** in such a way that it reads option files from the default locations. If given as `--no-defaults`, and `--defaults-file` or `--defaults-extra-file` is not also specified, **mysql\_install\_db** passes `--no-defaults` to **mysqld**, to prevent option files from being read. This may help if program startup fails due to reading unknown options from an option file.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  This option is passed by **mysql\_install\_db** to **mysqld**.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  This option is passed by **mysql\_install\_db** to **mysqld**.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--extra-sql-file=file_name`, `-f file_name`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

  This option names a file containing additional SQL statements to be executed after the standard bootstrapping statements. Accepted statement syntax in the file is like that of the **mysql** command-line client, including support for multiple-line C-style comments and delimiter handling to enable definition of stored programs.

* `--insecure`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

  Do not generate a random password for the adminstrative account.

  If `--insecure` is *not* given, it is necessary after **mysql\_install\_db** has been run to start the server, connect using the administrative account with the password written to the `.mysql_secret` file, and specify a new administrative password. Until this is done, the administrative account cannot be used for anything else. To change the password, you can use the `SET PASSWORD` statement (for example, with the **mysql** or **mysqladmin** client). After resetting the password, remove the `.mysql_secret` file; otherwise, if you run **mysql\_secure\_installation**, that command may see the file and expire the `root` password again as part of ensuring secure deployment.

* `--lc-messages=name`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

  The locale to use for error messages. The default is `en_US`. The argument is converted to a language name and combined with the value of `--lc-messages-dir` to produce the location for the error message file. See Section 10.12, “Setting the Error Message Language”.

* `--lc-messages-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

  The directory where error messages are located. The value is used together with the value of `--lc-messages` to produce the location for the error message file. See Section 10.12, “Setting the Error Message Language”.

* `--login-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

  The file from which to read the login path if the `--login-path=file_name` option is specified. The default file is `.mylogin.cnf`.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

  Read options from the named login path in the `.mylogin.cnf` login path file. The default login path is `client`. (To read a different file, use the `--login-file=name` option.) A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  If the `--login-path` option is specified, the user, host, and password values are taken from the login path and used to create the administrative account. The password must be defined in the login path or an error occurs, unless the `--insecure` option is also specified. In addition, with `--login-path`, any `--admin-host` and `--admin-user` options are ignored.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--mysqld-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

  The path name of the **mysqld** binary to execute. The option value must be an absolute path name or an error occurs.

  If this option is not given, **mysql\_install\_db** searches for **mysqld** in these locations:

  + In the `bin` directory under the `--basedir` option value, if that option was given.

  + In the `bin` directory under the `--srcdir` option value, if that option was given.

  + In the `bin` directory under the `--builddir` option value, if that option was given.

  + In the local directory and in the `bin` and `sbin` directories under the local directory.

  + In `/usr/bin`, `/usr/sbin`, `/usr/local/bin`, `/usr/local/sbin`, `/opt/local/bin`, `/opt/local/sbin`.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

  For behavior of this option, see the description of `--defaults`.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--random-password-file=file_name`

  <table frame="box" rules="all" summary="Properties for admin-auth-plugin"><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

  The path name of the file in which to write the randomly generated password for the administrative account. The option value must be an absolute path name or an error occurs. The default is `$HOME/.mysql_secret`.

* `--skip-sys-schema`

  <table frame="box" rules="all" summary="Properties for admin-auth-plugin"><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

  **mysql\_install\_db** installs the `sys` schema. The `--skip-sys-schema` option suppresses this behavior.

* `--srcdir=dir_name`

  <table frame="box" rules="all" summary="Properties for admin-auth-plugin"><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

  For internal use. This option specifies the directory under which **mysql\_install\_db** looks for support files such as the error message file and the file for populating the help tables.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for admin-auth-plugin"><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

  The system (login) user name to use for running **mysqld**. Files and directories created by **mysqld** are owned by this user. You must be the system `root` user to use this option. By default, **mysqld** runs using your current login name; files and directories that it creates are owned by you.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for admin-auth-plugin"><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

  Verbose mode. Print more information about what the program does. You can use this option to see the **mysqld** command that **mysql\_install\_db** invokes to start the server in bootstrap mode.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for admin-auth-plugin"><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

  Display version information and exit.
