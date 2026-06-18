## 4.4 Installation-Related Programs

The programs in this section are used when installing or upgrading MySQL.

### 4.4.1 comp_err — Compile MySQL Error Message File

`comp_err` creates the `errmsg.sys` file that is used by `mysqld` to determine the error messages to display for different error codes. `comp_err` normally is run automatically when MySQL is built. It compiles the `errmsg.sys` file from the text-format error information file located at `sql/share/errmsg-utf8.txt` in MySQL source distributions.

`comp_err` also generates the `mysqld_error.h`, `mysqld_ername.h`, and `sql_state.h` header files.

For more information about how error messages are defined, see the MySQL Internals Manual.

Invoke `comp_err` like this:

```sql
comp_err [options]
```

`comp_err` supports the following options.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--charset=dir_name`, `-C dir_name`

  <table frame="box" rules="all" summary="Properties for charset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--charset</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>../share/charsets</code></td> </tr></tbody></table>

  The character set directory. The default is `../sql/share/charsets`.

* `--debug=debug_options`, `-# debug_options`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug=options</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:O,/tmp/comp_err.trace</code></td> </tr></tbody></table>

  In debug builds, write a debugging log. A typical *`debug_options`* string is `d:t:O,file_name`. The default is `d:t:O,/tmp/comp_err.trace`.

  For non-debug builds, this option is non-functional and causes the program to exit with an explanatory message.

  Note

  The short form of this option is `-#`, using a literal `#` character.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Properties for debug-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

  Print some debugging information when the program exits.

* `--header-file=file_name`, `-H file_name`

  <table frame="box" rules="all" summary="Properties for header-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--header-file=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>mysqld_error.h</code></td> </tr></tbody></table>

  The name of the error header file. The default is `mysqld_error.h`.

* `--in-file=file_name`, `-F file_name`

  <table frame="box" rules="all" summary="Properties for in-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--in-file=path</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  The name of the input file that defines error messages. The default is `../sql/share/errmsg-utf8.txt`.

* `--name-file=file_name`, `-N file_name`

  <table frame="box" rules="all" summary="Properties for name-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--name-file=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>mysqld_ername.h</code></td> </tr></tbody></table>

  The name of the error name file. The default is `mysqld_ername.h`.

* `--out-dir=dir_name`, `-D dir_name`

  <table frame="box" rules="all" summary="Properties for out-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--out-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>../share/</code></td> </tr></tbody></table>

  The name of the output base directory. The default is `../sql/share/`.

* `--out-file=file_name`, `-O file_name`

  <table frame="box" rules="all" summary="Properties for out-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--out-file=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>errmsg.sys</code></td> </tr></tbody></table>

  The name of the output file. The default is `errmsg.sys`.

* `--state-file=file_name`, `-S file_name`

  <table frame="box" rules="all" summary="Properties for state-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--state-file=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>sql_state.h</code></td> </tr></tbody></table>

  The name for the SQLSTATE header file. The default is `sql_state.h`.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for charset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--charset</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>../share/charsets</code></td> </tr></tbody></table>0

  Display version information and exit.

### 4.4.2 mysql_install_db — Initialize MySQL Data Directory

Note

`mysql_install_db` is deprecated as of MySQL 5.7.6 because its functionality has been integrated into `mysqld`, the MySQL server. To initialize a MySQL installation, invoke `mysqld` with the `--initialize` or `--initialize-insecure` option. For more information, see Section 2.9.1, “Initializing the Data Directory”. You should expect `mysql_install_db` to be removed in a future MySQL release.

`mysql_install_db` handles initialization tasks that must be performed before the MySQL server, `mysqld`, is ready to use:

* It initializes the MySQL data directory and creates the system tables that it contains.

* It initializes the system tablespace and related data structures needed to manage `InnoDB` tables.

* It loads the server-side help tables.
* It installs the `sys` schema.
* It creates an administrative account. Older versions of `mysql_install_db` may create anonymous-user accounts.

#### Secure-by-Default Deployment

Current versions of `mysql_install_db` produce a MySQL deployment that is secure by default, with these characteristics:

* A single administrative account named `'root'@'localhost'` is created with a randomly generated password, which is marked expired.

* No anonymous-user accounts are created.
* No `test` database accessible by all users is created.

* `--admin-xxx` options are available to control characteristics of the administrative account.

* The `--random-password-file` option is available to control where the random password is written.

* The `--insecure` option is available to suppress random password generation.

If `mysql_install_db` generates a random administative password, it writes the password to a file and displays the file name. The password entry includes a timestamp to indicate when it was written. By default, the file is `.mysql_secret` in the home directory of the effective user running the script. `.mysql_secret` is created with mode 600 to be accessible only to the operating system user for whom it is created.

Important

When `mysql_install_db` generates a random password for the administrative account, it is necessary after `mysql_install_db` has been run to start the server, connect using the administrative account with the password written to the `.mysql_secret` file, and specify a new administrative password. Until this is done, the administrative account cannot be used for anything else. To change the password, you can use the `SET PASSWORD` statement (for example, with the **mysql** or **mysqladmin** client). After resetting the password, remove the `.mysql_secret` file; otherwise, if you run `mysql_secure_installation`, that command may see the file and expire the `root` password again as part of ensuring secure deployment.

#### Invocation Syntax

Change location to the MySQL installation directory and use this invocation syntax:

```sql
bin/mysql_install_db --datadir=path/to/datadir [other_options]
```

The `--datadir` option is mandatory. `mysql_install_db` creates the data directory, which must not already exist:

* If the data directory does already exist, you are performing an upgrade operation (not an install operation) and should run `mysqld_upgrade`, not `mysql_install_db`. See Section 4.4.7, “mysql_upgrade — Check and Upgrade MySQL Tables”.

* If the data directory does not exist but `mysql_install_db` fails, you must remove any partially created data directory before running `mysql_install_db` again.

Because the MySQL server, `mysqld`, must access the data directory when it runs later, you should either run `mysql_install_db` from the same system account used for running `mysqld`, or run it as `root` and specify the `--user` option to indicate the user name that `mysqld` runs under. It might be necessary to specify other options such as `--basedir` if `mysql_install_db` does not use the correct location for the installation directory. For example:

```sql
bin/mysql_install_db --user=mysql \
    --basedir=/opt/mysql/mysql \
    --datadir=/opt/mysql/mysql/data
```

Note

After `mysql_install_db` sets up the `InnoDB` system tablespace, changes to some tablespace characteristics require setting up a whole new instance. This includes the file name of the first file in the system tablespace and the number of undo logs. If you do not want to use the default values, make sure that the settings for the `innodb_data_file_path` and `innodb_log_file_size` configuration parameters are in place in the MySQL configuration file before running `mysql_install_db`. Also make sure to specify as necessary other parameters that affect the creation and location of `InnoDB` files, such as `innodb_data_home_dir` and `innodb_log_group_home_dir`.

If those options are in your configuration file but that file is not in a location that MySQL reads by default, specify the file location using the `--defaults-extra-file` option when you run `mysql_install_db`.

Note

If you have set a custom `TMPDIR` environment variable when performing the installation, and the specified directory is not accessible, `mysql_install_db` may fail. If so, unset `TMPDIR` or set `TMPDIR` to point to the system temporary directory (usually `/tmp`).

#### Administrative Account Creation

`mysql_install_db` creates an administrative account named `'root'@'localhost'` by default.

`mysql_install_db` provides options that enable you to control several aspects of the administrative account:

* To change the user or host parts of the account name, use `--login-path`, or `--admin-user` and `--admin-host`.

* `--insecure` suppresses generation of a random password.

* `--admin-auth-plugin` specifies the authentication plugin.

* `--admin-require-ssl` specifies whether the account must use SSL connections.

For more information, see the descriptions of those options.

`mysql_install_db` assigns `mysql.user` system table rows a nonempty `plugin` column value to set the authentication plugin. The default value is `mysql_native_password`. The value can be changed using the `--admin-auth-plugin` option.

#### Default my.cnf File

`mysql_install_db` creates no default `my.cnf` file.

Note

As of MySQL 5.7.18, `my-default.cnf` is no longer included in or installed by distribution packages.

With one exception, the settings in the default option file are commented and have no effect. The exception is that the file sets the `sql_mode` system variable to `NO_ENGINE_SUBSTITUTION,STRICT_TRANS_TABLES`. This setting produces a server configuration that results in errors rather than warnings for bad data in operations that modify transactional tables. See Section 5.1.10, “Server SQL Modes”.

#### Command Options

`mysql_install_db` supports the following options, which can be specified on the command line or in the `[mysql_install_db]` group of an option file. For information about option files used by MySQL programs, see Section 4.2.2.2, “Using Option Files”.

**Table 4.8 mysql_install_db Options**

<table frame="box" rules="all" summary="Command-line options available for mysql_install_db.">
  <col style="width: 35%"/>
  <col style="width: 64%"/>
  <thead>
    <tr>
      <th>Option Name</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>--admin-auth-plugin</code></td>
      <td>Administrative account authentication plugin</td>
    </tr>
    <tr>
      <td><code>--admin-host</code></td>
      <td>Administrative account name host part</td>
    </tr>
    <tr>
      <td><code>--admin-require-ssl</code></td>
      <td>Require SSL for administrative account</td>
    </tr>
    <tr>
      <td><code>--admin-user</code></td>
      <td>Administrative account name user part</td>
    </tr>
    <tr>
      <td><code>--basedir</code></td>
      <td>Path to base directory</td>
    </tr>
    <tr>
      <td><code>--builddir</code></td>
      <td>Path to build directory (for out-of-source builds)</td>
    </tr>
    <tr>
      <td><code>--datadir</code></td>
      <td>Path to data directory</td>
    </tr>
    <tr>
      <td><code>--defaults</code></td>
      <td>Read default option files</td>
    </tr>
    <tr>
      <td><code>--defaults-extra-file</code></td>
      <td>Read named option file in addition to usual option files</td>
    </tr>
    <tr>
      <td><code>--defaults-file</code></td>
      <td>Read only named option file</td>
    </tr>
    <tr>
      <td><code>--extra-sql-file</code></td>
      <td>Optional SQL file to execute during bootstrap</td>
    </tr>
    <tr>
      <td><code>--help</code></td>
      <td>Display help message and exit</td>
    </tr>
    <tr>
      <td><code>--insecure</code></td>
      <td>Do not generate administrative account random password</td>
    </tr>
    <tr>
      <td><code>--lc-messages</code></td>
      <td>Locale for error messages</td>
    </tr>
    <tr>
      <td><code>--lc-messages-dir</code></td>
      <td>Directory where error messages are installed</td>
    </tr>
    <tr>
      <td><code>--login-file</code></td>
      <td>File to read for login path information</td>
    </tr>
    <tr>
      <td><code>--login-path</code></td>
      <td>Read login path options from .mylogin.cnf</td>
    </tr>
    <tr>
      <td><code>--mysqld-file</code></td>
      <td>Path to mysqld binary</td>
    </tr>
    <tr>
      <td><code>--no-defaults</code></td>
      <td>Read no option files</td>
    </tr>
    <tr>
      <td><code>--random-password-file</code></td>
      <td>File in which to write administrative account random password</td>
    </tr>
    <tr>
      <td><code>--skip-sys-schema</code></td>
      <td>Do not install or upgrade the sys schema</td>
    </tr>
    <tr>
      <td><code>--srcdir</code></td>
      <td>For internal use</td>
    </tr>
    <tr>
      <td><code>--user</code></td>
      <td>Operating system user under which to execute mysqld</td>
    </tr>
    <tr>
      <td><code>--verbose</code></td>
      <td>Verbose mode</td>
    </tr>
    <tr>
      <td><code>--version</code></td>
      <td>Display version information and exit</td>
    </tr>
  </tbody>
</table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--admin-auth-plugin=plugin_name`

  <table frame="box" rules="all" summary="Properties for admin-auth-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The authentication plugin to use for the administrative account. The default is `mysql_native_password`.

* `--admin-host=host_name`

  <table frame="box" rules="all" summary="Properties for admin-host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--admin-host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The host part to use for the adminstrative account name. The default is `localhost`. This option is ignored if `--login-path` is also specified.

* `--admin-require-ssl`

  <table frame="box" rules="all" summary="Properties for admin-require-ssl"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--admin-require-ssl</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Whether to require SSL for the administrative account. The default is not to require it. With this option enabled, the statement that `mysql_install_db` uses to create the account includes a `REQUIRE SSL` clause. As a result, the administrative account must use secure connections when connecting to the server.

* `--admin-user=user_name`

  <table frame="box" rules="all" summary="Properties for admin-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--admin-user=user_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The user part to use for the adminstrative account name. The default is `root`. This option is ignored if `--login-path` is also specified.

* `--basedir=dir_name`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The path to the MySQL installation directory.

* `--builddir=dir_name`

  <table frame="box" rules="all" summary="Properties for builddir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--builddir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  For use with `--srcdir` and out-of-source builds. Set this to the location of the directory where the built files reside.

* `--datadir=dir_name`

  <table frame="box" rules="all" summary="Properties for datadir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--datadir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The path to the MySQL data directory. Only the last component of the path name is created if it does not exist; the parent directory must already exist or an error occurs.

  Note

  The `--datadir` option is mandatory and the data directory must not already exist.

* `--defaults`

  <table frame="box" rules="all" summary="Properties for defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  This option causes `mysql_install_db` to invoke `mysqld` in such a way that it reads option files from the default locations. If given as `--no-defaults`, and `--defaults-file` or `--defaults-extra-file` is not also specified, `mysql_install_db` passes `--no-defaults` to `mysqld`, to prevent option files from being read. This may help if program startup fails due to reading unknown options from an option file.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  This option is passed by `mysql_install_db` to `mysqld`.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  This option is passed by `mysql_install_db` to `mysqld`.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--extra-sql-file=file_name`, `-f file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

  This option names a file containing additional SQL statements to be executed after the standard bootstrapping statements. Accepted statement syntax in the file is like that of the **mysql** command-line client, including support for multiple-line C-style comments and delimiter handling to enable definition of stored programs.

* `--insecure`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

  Do not generate a random password for the adminstrative account.

  If `--insecure` is *not* given, it is necessary after `mysql_install_db` has been run to start the server, connect using the administrative account with the password written to the `.mysql_secret` file, and specify a new administrative password. Until this is done, the administrative account cannot be used for anything else. To change the password, you can use the `SET PASSWORD` statement (for example, with the **mysql** or **mysqladmin** client). After resetting the password, remove the `.mysql_secret` file; otherwise, if you run `mysql_secure_installation`, that command may see the file and expire the `root` password again as part of ensuring secure deployment.

* `--lc-messages=name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

  The locale to use for error messages. The default is `en_US`. The argument is converted to a language name and combined with the value of `--lc-messages-dir` to produce the location for the error message file. See Section 10.12, “Setting the Error Message Language”.

* `--lc-messages-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

  The directory where error messages are located. The value is used together with the value of `--lc-messages` to produce the location for the error message file. See Section 10.12, “Setting the Error Message Language”.

* `--login-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

  The file from which to read the login path if the `--login-path=file_name` option is specified. The default file is `.mylogin.cnf`.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

  Read options from the named login path in the `.mylogin.cnf` login path file. The default login path is `client`. (To read a different file, use the `--login-file=name` option.) A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql_config_editor** utility. See Section 4.6.6, “mysql_config_editor — MySQL Configuration Utility”.

  If the `--login-path` option is specified, the user, host, and password values are taken from the login path and used to create the administrative account. The password must be defined in the login path or an error occurs, unless the `--insecure` option is also specified. In addition, with `--login-path`, any `--admin-host` and `--admin-user` options are ignored.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--mysqld-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

  The path name of the `mysqld` binary to execute. The option value must be an absolute path name or an error occurs.

  If this option is not given, `mysql_install_db` searches for `mysqld` in these locations:

  + In the `bin` directory under the `--basedir` option value, if that option was given.

  + In the `bin` directory under the `--srcdir` option value, if that option was given.

  + In the `bin` directory under the `--builddir` option value, if that option was given.

  + In the local directory and in the `bin` and `sbin` directories under the local directory.

  + In `/usr/bin`, `/usr/sbin`, `/usr/local/bin`, `/usr/local/sbin`, `/opt/local/bin`, `/opt/local/sbin`.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

  For behavior of this option, see the description of `--defaults`.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--random-password-file=file_name`

  <table frame="box" rules="all" summary="Properties for admin-auth-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

  The path name of the file in which to write the randomly generated password for the administrative account. The option value must be an absolute path name or an error occurs. The default is `$HOME/.mysql_secret`.

* `--skip-sys-schema`

  <table frame="box" rules="all" summary="Properties for admin-auth-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

  `mysql_install_db` installs the `sys` schema. The `--skip-sys-schema` option suppresses this behavior.

* `--srcdir=dir_name`

  <table frame="box" rules="all" summary="Properties for admin-auth-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

  For internal use. This option specifies the directory under which `mysql_install_db` looks for support files such as the error message file and the file for populating the help tables.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for admin-auth-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

  The system (login) user name to use for running `mysqld`. Files and directories created by `mysqld` are owned by this user. You must be the system `root` user to use this option. By default, `mysqld` runs using your current login name; files and directories that it creates are owned by you.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for admin-auth-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

  Verbose mode. Print more information about what the program does. You can use this option to see the `mysqld` command that `mysql_install_db` invokes to start the server in bootstrap mode.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for admin-auth-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--admin-auth-plugin=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

  Display version information and exit.

### 4.4.3 mysql\_plugin — Configure MySQL Server Plugins

Note

**mysql\_plugin** is deprecated as of MySQL 5.7.11 and removed in MySQL 8.0. Alternatives include loading plugins at server startup using the `--plugin-load` or `--plugin-load-add` option, or at runtime using the `INSTALL PLUGIN` statement.

The **mysql\_plugin** utility enables MySQL administrators to manage which plugins a MySQL server loads. It provides an alternative to manually specifying the `--plugin-load` option at server startup or using the `INSTALL PLUGIN` and `UNINSTALL PLUGIN` statements at runtime.

Depending on whether **mysql\_plugin** is invoked to enable or disable plugins, it inserts or deletes rows in the `mysql.plugin` table that serves as a plugin registry. (To perform this operation, **mysql\_plugin** invokes the MySQL server in bootstrap mode. This means that the server must not already be running.) For normal server startups, the server loads and enables plugins listed in `mysql.plugin` automatically. For additional control over plugin activation, use `--plugin_name` options named for specific plugins, as described in Section 5.5.1, “Installing and Uninstalling Plugins”.

Each invocation of **mysql\_plugin** reads a configuration file to determine how to configure the plugins contained in a single plugin library file. To invoke **mysql\_plugin**, use this syntax:

```sql
mysql_plugin [options] plugin {ENABLE|DISABLE}
```

*`plugin`* is the name of the plugin to configure. `ENABLE` or `DISABLE` (not case-sensitive) specify whether to enable or disable components of the plugin library named in the configuration file. The order of the *`plugin`* and `ENABLE` or `DISABLE` arguments does not matter.

For example, to configure components of a plugin library file named `myplugins.so` on Linux or `myplugins.dll` on Windows, specify a *`plugin`* value of `myplugins`. Suppose that this plugin library contains three plugins, `plugin1`, `plugin2`, and `plugin3`, all of which should be configured under **mysql\_plugin** control. By convention, configuration files have a suffix of `.ini` and the same base name as the plugin library, so the default configuration file name for this plugin library is `myplugins.ini`. The configuration file contents look like this:

```sql
myplugins
plugin1
plugin2
plugin3
```

The first line in the `myplugins.ini` file is the name of the library file, without any extension such as `.so` or `.dll`. The remaining lines are the names of the components to be enabled or disabled. Each value in the file should be on a separate line. Lines on which the first character is `'#'` are taken as comments and ignored.

To enable the plugins listed in the configuration file, invoke **mysql\_plugin** this way:

```sql
mysql_plugin myplugins ENABLE
```

To disable the plugins, use `DISABLE` rather than `ENABLE`.

An error occurs if **mysql\_plugin** cannot find the configuration file or plugin library file, or if **mysql\_plugin** cannot start the MySQL server.

**mysql\_plugin** supports the following options, which can be specified on the command line or in the `[mysqld]` group of any option file. For options specified in a `[mysqld]` group, **mysql\_plugin** recognizes the `--basedir`, `--datadir`, and `--plugin-dir` options and ignores others. For information about option files used by MySQL programs, see Section 4.2.2.2, “Using Option Files”.

**Table 4.9 mysql\_plugin Options**

<table frame="box" rules="all" summary="Command-line options available for mysql_plugin."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Option Name</th> <th>Description</th> </tr></thead><tbody><tr><td>--basedir</td> <td>The server base directory</td> </tr><tr><td>--datadir</td> <td>The server data directory</td> </tr><tr><td>--help</td> <td>Display help message and exit</td> </tr><tr><td>--my-print-defaults</td> <td>Path to my_print_defaults</td> </tr><tr><td>--mysqld</td> <td>Path to server</td> </tr><tr><td>--no-defaults</td> <td>Do not read configuration file</td> </tr><tr><td>--plugin-dir</td> <td>Directory where plugins are installed</td> </tr><tr><td>--plugin-ini</td> <td>The plugin configuration file</td> </tr><tr><td>--print-defaults</td> <td>Show configuration file defaults</td> </tr><tr><td>--verbose</td> <td>Verbose mode</td> </tr><tr><td>--version</td> <td>Display version information and exit</td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--basedir=dir_name`, `-b dir_name`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The server base directory.

* `--datadir=dir_name`, `-d dir_name`

  <table frame="box" rules="all" summary="Properties for datadir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--datadir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The server data directory.

* `--my-print-defaults=file_name`, `-b file_name`

  <table frame="box" rules="all" summary="Properties for my-print-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--my-print-defaults=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  The path to the **my\_print\_defaults** program.

* `--mysqld=file_name`, `-b file_name`

  <table frame="box" rules="all" summary="Properties for mysqld"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqld=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  The path to the `mysqld` server.

* `--no-defaults`, `-p`

  <table frame="box" rules="all" summary="Properties for no-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Do not read values from the configuration file. This option enables an administrator to skip reading defaults from the configuration file.

  With **mysql\_plugin**, this option need not be given first on the command line, unlike most other MySQL programs that support `--no-defaults`.

* `--plugin-dir=dir_name`, `-p dir_name`

  <table frame="box" rules="all" summary="Properties for plugin-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--plugin-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The server plugin directory.

* `--plugin-ini=file_name`, `-i file_name`

  <table frame="box" rules="all" summary="Properties for plugin-ini"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--plugin-ini=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  The **mysql\_plugin** configuration file. Relative path names are interpreted relative to the current directory. If this option is not given, the default is `plugin.ini` in the plugin directory, where *`plugin`* is the *`plugin`* argument on the command line.

* `--print-defaults`, `-P`

  <table frame="box" rules="all" summary="Properties for print-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

  Display the default values from the configuration file. This option causes **mysql\_plugin** to print the defaults for `--basedir`, `--datadir`, and `--plugin-dir` if they are found in the configuration file. If no value for a variable is found, nothing is shown.

  With **mysql\_plugin**, this option need not be given first on the command line, unlike most other MySQL programs that support `--print-defaults`.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

  Verbose mode. Print more information about what the program does. This option can be used multiple times to increase the amount of information.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

  Display version information and exit.

### 4.4.4 mysql\_secure\_installation — Improve MySQL Installation Security

This program enables you to improve the security of your MySQL installation in the following ways:

* You can set a password for `root` accounts.
* You can remove `root` accounts that are accessible from outside the local host.

* You can remove anonymous-user accounts.
* You can remove the `test` database (which by default can be accessed by all users, even anonymous users), and privileges that permit anyone to access databases with names that start with `test_`.

`mysql_secure_installation` helps you implement security recommendations similar to those described at Section 2.9.4, “Securing the Initial MySQL Account”.

Normal usage is to connect to the local MySQL server; invoke `mysql_secure_installation` without arguments:

```sql
mysql_secure_installation
```

When executed, `mysql_secure_installation` prompts you to determine which actions to perform.

The `validate_password` plugin can be used for password strength checking. If the plugin is not installed, `mysql_secure_installation` prompts the user whether to install it. Any passwords entered later are checked using the plugin if it is enabled.

Most of the usual MySQL client options such as `--host` and `--port` can be used on the command line and in option files. For example, to connect to the local server over IPv6 using port 3307, use this command:

```sql
mysql_secure_installation --host=::1 --port=3307
```

`mysql_secure_installation` supports the following options, which can be specified on the command line or in the `[mysql_secure_installation]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see Section 4.2.2.2, “Using Option Files”.

**Table 4.10 mysql_secure_installation Options**

<table frame="box" rules="all" summary="Command-line options available for mysql_secure_installation.">
  <col style="width: 31%"/>
  <col style="width: 56%"/>
  <col style="width: 12%"/>
  <thead>
    <tr>
      <th>Option Name</th>
      <th>Description</th>
      <th>Introduced</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>--defaults-extra-file</code></th>
      <td>Read named option file in addition to usual option files</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-file</code></th>
      <td>Read only named option file</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-group-suffix</code></th>
      <td>Option group suffix value</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--help</code></th>
      <td>Display help message and exit</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--host</code></th>
      <td>Host on which MySQL server is located</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-defaults</code></th>
      <td>Read no option files</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--password</code></th>
      <td>Accepted but always ignored. Whenever mysql_secure_installation is invoked, the user is prompted for a password, regardless</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--port</code></th>
      <td>TCP/IP port number for connection</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--print-defaults</code></th>
      <td>Print default options</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--protocol</code></th>
      <td>Transport protocol to use</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--socket</code></th>
      <td>Unix socket file or Windows named pipe to use</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl</code></th>
      <td>Enable connection encryption</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-ca</code></th>
      <td>File that contains list of trusted SSL Certificate Authorities</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-capath</code></th>
      <td>Directory that contains trusted SSL Certificate Authority certificate files</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cert</code></th>
      <td>File that contains X.509 certificate</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cipher</code></th>
      <td>Permissible ciphers for connection encryption</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crl</code></th>
      <td>File that contains certificate revocation lists</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crlpath</code></th>
      <td>Directory that contains certificate revocation-list files</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-key</code></th>
      <td>File that contains X.509 key</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-mode</code></th>
      <td>Desired security state of connection to server</td>
      <td>5.7.11</td>
    </tr>
    <tr>
      <th><code>--ssl-verify-server-cert</code></th>
      <td>Verify host name against server certificate Common Name identity</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tls-version</code></th>
      <td>Permissible TLS protocols for encrypted connections</td>
      <td>5.7.10</td>
    </tr>
    <tr>
      <th><code>--use-default</code></th>
      <td>Execute with no user interactivity</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--user</code></th>
      <td>MySQL user name to use when connecting to server</td>
      <td></td>
    </tr>
  </tbody>
</table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=str</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, `mysql_secure_installation` normally reads the `[client]` and `[mysql_secure_installation]` groups. If this option is given as `--defaults-group-suffix=_other`, `mysql_secure_installation` also reads the `[client_other]` and `[mysql_secure_installation_other]` groups.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>

  Connect to the MySQL server on the given host.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for no-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--password=password`, `-p password`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password=password</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  This option is accepted but ignored. Whether or not this option is used, `mysql_secure_installation` always prompts the user for a password.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for port"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--port=port_num</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>3306</code></td> </tr></tbody></table>

  For TCP/IP connections, the port number to use.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for print-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 4.2.5, “Connection Transport Protocols”.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 5.7.10.

* `--use-default`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

  Execute noninteractively. This option can be used for unattended installation operations.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

  The user name of the MySQL account to use for connecting to the server.

### 4.4.5 mysql_ssl_rsa_setup — Create SSL/RSA Files

This program creates the SSL certificate and key files and RSA key-pair files required to support secure connections using SSL and secure password exchange using RSA over unencrypted connections, if those files are missing. `mysql_ssl_rsa_setup` can also be used to create new SSL files if the existing ones have expired.

Note

`mysql_ssl_rsa_setup` uses the **openssl** command, so its use is contingent on having OpenSSL installed on your machine.

Another way to generate SSL and RSA files, for MySQL distributions compiled using OpenSSL, is to have the server generate them automatically. See Section 6.3.3.1, “Creating SSL and RSA Certificates and Keys using MySQL”.

Important

`mysql_ssl_rsa_setup` helps lower the barrier to using SSL by making it easier to generate the required files. However, certificates generated by `mysql_ssl_rsa_setup` are self-signed, which is not very secure. After you gain experience using the files created by `mysql_ssl_rsa_setup`, consider obtaining a CA certificate from a registered certificate authority.

Invoke `mysql_ssl_rsa_setup` like this:

```sql
mysql_ssl_rsa_setup [options]
```

Typical options are `--datadir` to specify where to create the files, and `--verbose` to see the **openssl** commands that `mysql_ssl_rsa_setup` executes.

`mysql_ssl_rsa_setup` attempts to create SSL and RSA files using a default set of file names. It works as follows:

1. `mysql_ssl_rsa_setup` checks for the **openssl** binary at the locations specified by the `PATH` environment variable. If **openssl** is not found, `mysql_ssl_rsa_setup` does nothing. If **openssl** is present, `mysql_ssl_rsa_setup` looks for default SSL and RSA files in the MySQL data directory specified by the `--datadir` option, or the compiled-in data directory if the `--datadir` option is not given.

2. `mysql_ssl_rsa_setup` checks the data directory for SSL files with the following names:

   ```sql
   ca.pem
   server-cert.pem
   server-key.pem
   ```

3. If any of those files are present, `mysql_ssl_rsa_setup` creates no SSL files. Otherwise, it invokes **openssl** to create them, plus some additional files:

   ```sql
   ca.pem               Self-signed CA certificate
   ca-key.pem           CA private key
   server-cert.pem      Server certificate
   server-key.pem       Server private key
   client-cert.pem      Client certificate
   client-key.pem       Client private key
   ```

   These files enable secure client connections using SSL; see Section 6.3.1, “Configuring MySQL to Use Encrypted Connections”.

4. `mysql_ssl_rsa_setup` checks the data directory for RSA files with the following names:

   ```sql
   private_key.pem      Private member of private/public key pair
   public_key.pem       Public member of private/public key pair
   ```

5. If any of these files are present, `mysql_ssl_rsa_setup` creates no RSA files. Otherwise, it invokes **openssl** to create them. These files enable secure password exchange using RSA over unencrypted connections for accounts authenticated by the `sha256_password` plugin; see Section 6.4.1.5, “SHA-256 Pluggable Authentication”.

For information about the characteristics of files created by `mysql_ssl_rsa_setup`, see Section 6.3.3.1, “Creating SSL and RSA Certificates and Keys using MySQL”.

At startup, the MySQL server automatically uses the SSL files created by `mysql_ssl_rsa_setup` to enable SSL if no explicit SSL options are given other than `--ssl` (possibly along with `ssl_cipher`). If you prefer to designate the files explicitly, invoke clients with the `--ssl-ca`, `--ssl-cert`, and `--ssl-key` options at startup to name the `ca.pem`, `server-cert.pem`, and `server-key.pem` files, respectively.

The server also automatically uses the RSA files created by `mysql_ssl_rsa_setup` to enable RSA if no explicit RSA options are given.

If the server is SSL-enabled, clients use SSL by default for the connection. To specify certificate and key files explicitly, use the `--ssl-ca`, `--ssl-cert`, and `--ssl-key` options to name the `ca.pem`, `client-cert.pem`, and `client-key.pem` files, respectively. However, some additional client setup may be required first because `mysql_ssl_rsa_setup` by default creates those files in the data directory. The permissions for the data directory normally enable access only to the system account that runs the MySQL server, so client programs cannot use files located there. To make the files available, copy them to a directory that is readable (but *not* writable) by clients:

* For local clients, the MySQL installation directory can be used. For example, if the data directory is a subdirectory of the installation directory and your current location is the data directory, you can copy the files like this:

  ```sql
  cp ca.pem client-cert.pem client-key.pem ..
  ```

* For remote clients, distribute the files using a secure channel to ensure they are not tampered with during transit.

If the SSL files used for a MySQL installation have expired, you can use `mysql_ssl_rsa_setup` to create new ones:

1. Stop the server.
2. Rename or remove the existing SSL files. You may wish to make a backup of them first. (The RSA files do not expire, so you need not remove them. `mysql_ssl_rsa_setup` sees that they exist and not overwrite them.)

3. Run `mysql_ssl_rsa_setup` with the `--datadir` option to specify where to create the new files.

4. Restart the server.

`mysql_ssl_rsa_setup` supports the following command-line options, which can be specified on the command line or in the `[mysql_ssl_rsa_setup]`, `[mysql_install_db]`, and `[mysqld]` groups of an option file. For information about option files used by MySQL programs, see Section 4.2.2.2, “Using Option Files”.

**Table 4.11 mysql_ssl_rsa_setup Options**

<table frame="box" rules="all" summary="Command-line options available for mysql_ssl_rsa_setup.">
  <col style="width: 35%"/>
  <col style="width: 64%"/>
  <thead>
    <tr>
      <th>Option Name</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>--datadir</code></td>
      <td>Path to data directory</td>
    </tr>
    <tr>
      <td><code>--help</code></td>
      <td>Display help message and exit</td>
    </tr>
    <tr>
      <td><code>--suffix</code></td>
      <td>Suffix for X.509 certificate Common Name attribute</td>
    </tr>
    <tr>
      <td><code>--uid</code></td>
      <td>Name of effective user to use for file permissions</td>
    </tr>
    <tr>
      <td><code>--verbose</code></td>
      <td>Verbose mode</td>
    </tr>
    <tr>
      <td><code>--version</code></td>
      <td>Display version information and exit</td>
    </tr>
  </tbody>
</table>

* `--help`, `?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--datadir=dir_name`

  <table frame="box" rules="all" summary="Properties for datadir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--datadir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The path to the directory that `mysql_ssl_rsa_setup` should check for default SSL and RSA files and in which it should create files if they are missing. The default is the compiled-in data directory.

* `--suffix=str`

  <table frame="box" rules="all" summary="Properties for suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--suffix=str</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The suffix for the Common Name attribute in X.509 certificates. The suffix value is limited to 17 characters. The default is based on the MySQL version number.

* `--uid=name`, `-v`

  <table frame="box" rules="all" summary="Properties for uid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--uid=name</code></td> </tr></tbody></table>

  The name of the user who should be the owner of any created files. The value is a user name, not a numeric user ID. In the absence of this option, files created by `mysql_ssl_rsa_setup` are owned by the user who executes it. This option is valid only if you execute the program as `root` on a system that supports the `chown()` system call.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Verbose mode. Produce more output about what the program does. For example, the program shows the **openssl** commands it runs, and produces output to indicate whether it skips SSL or RSA file creation because some default file already exists.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for version"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--version</code></td> </tr></tbody></table>

  Display version information and exit.

### 4.4.6 mysql_tzinfo_to_sql — Load the Time Zone Tables

The `mysql_tzinfo_to_sql` program loads the time zone tables in the `mysql` database. It is used on systems that have a zoneinfo database (the set of files describing time zones). Examples of such systems are Linux, FreeBSD, Solaris, and macOS. One likely location for these files is the `/usr/share/zoneinfo` directory (`/usr/share/lib/zoneinfo` on Solaris). If your system does not have a zoneinfo database, you can use the downloadable package described in Section 5.1.13, “MySQL Server Time Zone Support”.

`mysql_tzinfo_to_sql` can be invoked several ways:

```sql
mysql_tzinfo_to_sql tz_dir
mysql_tzinfo_to_sql tz_file tz_name
mysql_tzinfo_to_sql --leap tz_file
```

For the first invocation syntax, pass the zoneinfo directory path name to `mysql_tzinfo_to_sql` and send the output into the **mysql** program. For example:

```sql
mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root mysql
```

`mysql_tzinfo_to_sql` reads your system's time zone files and generates SQL statements from them. **mysql** processes those statements to load the time zone tables.

The second syntax causes `mysql_tzinfo_to_sql` to load a single time zone file *`tz_file`* that corresponds to a time zone name *`tz_name`*:

```sql
mysql_tzinfo_to_sql tz_file tz_name | mysql -u root mysql
```

If your time zone needs to account for leap seconds, invoke `mysql_tzinfo_to_sql` using the third syntax, which initializes the leap second information. *`tz_file`* is the name of your time zone file:

```sql
mysql_tzinfo_to_sql --leap tz_file | mysql -u root mysql
```

After running `mysql_tzinfo_to_sql`, it is best to restart the server so that it does not continue to use any previously cached time zone data.

### 4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables

Each time you upgrade MySQL, you should execute `mysqld_upgrade`, which looks for incompatibilities with the upgraded MySQL server:

* It upgrades the system tables in the `mysql` schema so that you can take advantage of new privileges or capabilities that might have been added.

* It upgrades the Performance Schema and `sys` schema.

* It examines user schemas.

If `mysqld_upgrade` finds that a table has a possible incompatibility, it performs a table check and, if problems are found, attempts a table repair. If the table cannot be repaired, see Section 2.10.12, “Rebuilding or Repairing Tables or Indexes” for manual table repair strategies.

`mysqld_upgrade` communicates directly with the MySQL server, sending it the SQL statements required to perform an upgrade.

Important

In MySQL 5.7.11, the default `--early-plugin-load` value is the name of the `keyring_file` plugin library file, causing that plugin to be loaded by default. In MySQL 5.7.12 and higher, the default `--early-plugin-load` value is empty; to load the `keyring_file` plugin, you must explicitly specify the option with a value naming the `keyring_file` plugin library file.

`InnoDB` tablespace encryption requires that the keyring plugin to be used be loaded prior to `InnoDB` initialization, so this change of default `--early-plugin-load` value introduces an incompatibility for upgrades from 5.7.11 to 5.7.12 or higher. Administrators who have encrypted `InnoDB` tablespaces must take explicit action to ensure continued loading of the keyring plugin: Start the server with an `--early-plugin-load` option that names the plugin library file. For additional information, see Section 6.4.4.1, “Keyring Plugin Installation”.

Important

If you upgrade to MySQL 5.7.2 or later from a version older than 5.7.2, a change to the `mysql.user` table requires a special sequence of steps to perform an upgrade using `mysqld_upgrade`. For details, see Section 2.10.3, “Changes in MySQL 5.7”.

Note

On Windows, you must run `mysqld_upgrade` with administrator privileges. You can do this by running a Command Prompt as Administrator and running the command. Failure to do so may result in the upgrade failing to execute correctly.

Caution

You should always back up your current MySQL installation *before* performing an upgrade. See Section 7.2, “Database Backup Methods”.

Some upgrade incompatibilities may require special handling *before* upgrading your MySQL installation and running `mysqld_upgrade`. See Section 2.10, “Upgrading MySQL”, for instructions on determining whether any such incompatibilities apply to your installation and how to handle them.

Use `mysqld_upgrade` like this:

1. Ensure that the server is running.
2. Invoke `mysqld_upgrade` to upgrade the system tables in the `mysql` schema and check and repair tables in other schemas:

   ```sql
   mysql_upgrade [options]
   ```

3. Stop the server and restart it so that any system table changes take effect.

If you have multiple MySQL server instances to upgrade, invoke `mysqld_upgrade` with connection parameters appropriate for connecting to each of the desired servers. For example, with servers running on the local host on parts 3306 through 3308, upgrade each of them by connecting to the appropriate port:

```sql
mysql_upgrade --protocol=tcp -P 3306 [other_options]
mysql_upgrade --protocol=tcp -P 3307 [other_options]
mysql_upgrade --protocol=tcp -P 3308 [other_options]
```

For local host connections on Unix, the `--protocol=tcp` option forces a connection using TCP/IP rather than the Unix socket file.

By default, `mysqld_upgrade` runs as the MySQL `root` user. If the `root` password is expired when you run `mysqld_upgrade`, it displays a message telling you that your password is expired and that `mysqld_upgrade` failed as a result. To correct this, reset the `root` password to unexpire it and run `mysqld_upgrade` again. First, connect to the server as `root`:

```sql
$> mysql -u root -p
Enter password: ****  <- enter root password here
```

Reset the password using `ALTER USER`:

```sql
mysql> ALTER USER USER() IDENTIFIED BY 'root-password';
```

Then exit **mysql** and run `mysqld_upgrade` again:

```sql
$> mysql_upgrade [options]
```

Note

If you run the server with the `disabled_storage_engines` system variable set to disable certain storage engines (for example, `MyISAM`), `mysqld_upgrade` might fail with an error like this:

```sql
mysql_upgrade: [ERROR] 3161: Storage engine MyISAM is disabled
(Table creation is disallowed).
```

To handle this, restart the server with `disabled_storage_engines` disabled. Then you should be able to run `mysqld_upgrade` successfully. After that, restart the server with `disabled_storage_engines` set to its original value.

Unless invoked with the `--upgrade-system-tables` option, `mysqld_upgrade` processes all tables in all user schemas as necessary. Table checking might take a long time to complete. Each table is locked and therefore unavailable to other sessions while it is being processed. Check and repair operations can be time-consuming, particularly for large tables. Table checking uses the `FOR UPGRADE` option of the `CHECK TABLE` statement. For details about what this option entails, see Section 13.7.2.2, “CHECK TABLE Statement”.

`mysqld_upgrade` marks all checked and repaired tables with the current MySQL version number. This ensures that the next time you run `mysqld_upgrade` with the same version of the server, it can be determined whether there is any need to check or repair a given table again.

`mysqld_upgrade` saves the MySQL version number in a file named `mysql_upgrade_info` in the data directory. This is used to quickly check whether all tables have been checked for this release so that table-checking can be skipped. To ignore this file and perform the check regardless, use the `--force` option.

`mysqld_upgrade` checks `mysql.user` system table rows and, for any row with an empty `plugin` column, sets that column to `'mysql_native_password'` or `'mysql_old_password'` depending on the hash format of the `Password` column value.

Support for pre-4.1 password hashing and `mysql_old_password` has been removed, so `mysqld_upgrade` sets empty `plugin` values to `'mysql_native_password'` if the credentials use a hash format compatible with that plugin. Rows with a pre-4.1 password hash must be upgraded manually. For account upgrade instructions, see Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql\_old\_password Plugin”.

`mysqld_upgrade` does not upgrade the contents of the time zone tables or help tables. For upgrade instructions, see Section 5.1.13, “MySQL Server Time Zone Support”, and Section 5.1.14, “Server-Side Help Support”.

Unless invoked with the `--skip-sys-schema` option, `mysqld_upgrade` installs the `sys` schema if it is not installed, and upgrades it to the current version otherwise. An error occurs if a `sys` schema exists but has no `version` view, on the assumption that its absence indicates a user-created schema:

```sql
A sys schema exists with no sys.version view. If
you have a user created sys schema, this must be renamed for the
upgrade to succeed.
```

To upgrade in this case, remove or rename the existing `sys` schema first.

`mysqld_upgrade` checks for partitioned `InnoDB` tables that were created using the generic partitioning handler and attempts to upgrade them to `InnoDB` native partitioning. (Bug #76734, Bug #20727344) You can upgrade such tables individually in the **mysql** client using the `ALTER TABLE ... UPGRADE PARTITIONING` SQL statement.

`mysqld_upgrade` supports the following options, which can be specified on the command line or in the `[mysql_upgrade]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see Section 4.2.2.2, “Using Option Files”.

**Table 4.12 mysql_upgrade Options**

<table frame="box" rules="all" summary="Command-line options available for mysql_upgrade.">
  <col style="width: 31%"/>
  <col style="width: 56%"/>
  <col style="width: 12%"/>
  <thead>
    <tr>
      <th>Option Name</th>
      <th>Description</th>
      <th>Introduced</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>--bind-address</code></th>
      <td>Use specified network interface to connect to MySQL Server</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--character-sets-dir</code></th>
      <td>Directory where character sets are installed</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--compress</code></th>
      <td>Compress all information sent between client and server</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug</code></th>
      <td>Write debugging log</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-check</code></th>
      <td>Print debugging information when program exits</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-info</code></th>
      <td>Print debugging information, memory, and CPU statistics when program exits</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-auth</code></th>
      <td>Authentication plugin to use</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-character-set</code></th>
      <td>Specify default character set</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-extra-file</code></th>
      <td>Read named option file in addition to usual option files</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-file</code></th>
      <td>Read only named option file</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-group-suffix</code></th>
      <td>Option group suffix value</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--force</code></th>
      <td>Force execution even if mysql_upgrade has already been executed for current MySQL version</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--help</code></th>
      <td>Display help message and exit</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--host</code></th>
      <td>Host on which MySQL server is located</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--login-path</code></th>
      <td>Read login path options from .mylogin.cnf</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--max-allowed-packet</code></th>
      <td>Maximum packet length to send to or receive from server</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--net-buffer-length</code></th>
      <td>Buffer size for TCP/IP and socket communication</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-defaults</code></th>
      <td>Read no option files</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--password</code></th>
      <td>Password to use when connecting to server</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--pipe</code></th>
      <td>Connect to server using named pipe (Windows only)</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--plugin-dir</code></th>
      <td>Directory where plugins are installed</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--port</code></th>
      <td>TCP/IP port number for connection</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--print-defaults</code></th>
      <td>Print default options</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--protocol</code></th>
      <td>Transport protocol to use</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--shared-memory-base-name</code></th>
      <td>Shared-memory name for shared-memory connections (Windows only)</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-sys-schema</code></th>
      <td>Do not install or upgrade sys schema</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--socket</code></th>
      <td>Unix socket file or Windows named pipe to use</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl</code></th>
      <td>Enable connection encryption</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-ca</code></th>
      <td>File that contains list of trusted SSL Certificate Authorities</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-capath</code></th>
      <td>Directory that contains trusted SSL Certificate Authority certificate files</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cert</code></th>
      <td>File that contains X.509 certificate</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cipher</code></th>
      <td>Permissible ciphers for connection encryption</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crl</code></th>
      <td>File that contains certificate revocation lists</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crlpath</code></th>
      <td>Directory that contains certificate revocation-list files</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-key</code></th>
      <td>File that contains X.509 key</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-mode</code></th>
      <td>Desired security state of connection to server</td>
      <td>5.7.11</td>
    </tr>
    <tr>
      <th><code>--ssl-verify-server-cert</code></th>
      <td>Verify host name against server certificate Common Name identity</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tls-version</code></th>
      <td>Permissible TLS protocols for encrypted connections</td>
      <td>5.7.10</td>
    </tr>
    <tr>
      <th><code>--upgrade-system-tables</code></th>
      <td>Update only system tables, not user schemas</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--user</code></th>
      <td>MySQL user name to use when connecting to server</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--verbose</code></th>
      <td>Verbose mode</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--version-check</code></th>
      <td>Check for proper server version</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--write-binlog</code></th>
      <td>Write all statements to binary log</td>
      <td></td>
    </tr>
  </tbody>
</table>


* `--help`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a short help message and exit.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On a computer having multiple network interfaces, use this option to select which interface to use for connecting to the MySQL server.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The directory where character sets are installed. See Section 10.15, “Character Set Configuration”.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compress all information sent between the client and the server if possible. See Section 4.2.6, “Connection Compression Control”.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug[=#]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:O,/tmp/mysql_upgrade.trace</code></td> </tr></tbody></table>

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:O,/tmp/mysql_upgrade.trace`.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for debug-check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-check</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>

  Print some debugging information when the program exits.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Properties for debug-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Print debugging information and memory and CPU usage statistics when the program exits.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  A hint about which client-side authentication plugin to use. See Section 6.2.13, “Pluggable Authentication”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for default-character-set"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-character-set=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Use *`charset_name`* as the default character set. See Section 10.15, “Character Set Configuration”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, `mysqld_upgrade` normally reads the `[client]` and `[mysql_upgrade]` groups. If this option is given as `--defaults-group-suffix=_other`, `mysqld_upgrade` also reads the `[client_other]` and `[mysql_upgrade_other]` groups.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--force`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

  Ignore the `mysql_upgrade_info` file and force execution even if `mysqld_upgrade` has already been executed for the current version of MySQL.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

  Connect to the MySQL server on the given host.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--max-allowed-packet=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

  The maximum size of the buffer for client/server communication. The default value is 24MB. The minimum and maximum values are 4KB and 2GB.

* `--net-buffer-length=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

  The initial size of the buffer for client/server communication. The default value is 1MB − 1KB. The minimum and maximum values are 4KB and 16MB.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, `mysqld_upgrade` prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 6.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that `mysqld_upgrade` should not prompt for one, use the `--skip-password` option.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

  On Windows, connect to the server using a named pipe. This option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but `mysqld_upgrade` does not find it. See Section 6.2.13, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

  For TCP/IP connections, the port number to use.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

  Print the program name and all options that it gets from option files.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 4.2.5, “Connection Transport Protocols”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

  On Windows, the shared-memory name to use for connections made using shared memory to a local server. The default value is `MYSQL`. The shared-memory name is case-sensitive.

  This option applies only if the server was started with the `shared_memory` system variable enabled to support shared-memory connections.

* `--skip-sys-schema`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

  By default, `mysqld_upgrade` installs the `sys` schema if it is not installed, and upgrades it to the current version otherwise. The `--skip-sys-schema` option suppresses this behavior.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>8

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 5.7.10.

* `--upgrade-system-tables`, `-s`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>9

  Upgrade only the system tables in the `mysql` schema, do not upgrade user schemas.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>0

  The user name of the MySQL account to use for connecting to the server. The default user name is `root`.

* `--verbose`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>1

  Verbose mode. Print more information about what the program does.

* `--version-check`, `-k`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>2

  Check the version of the server to which `mysqld_upgrade` is connecting to verify that it is the same as the version for which `mysqld_upgrade` was built. If not, `mysqld_upgrade` exits. This option is enabled by default; to disable the check, use `--skip-version-check`.

* `--write-binlog`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>3

  By default, binary logging by `mysqld_upgrade` is disabled. Invoke the program with `--write-binlog` if you want its actions to be written to the binary log.

  When the server is running with global transaction identifiers (GTIDs) enabled (`gtid_mode=ON`), do not enable binary logging by `mysqld_upgrade`.

