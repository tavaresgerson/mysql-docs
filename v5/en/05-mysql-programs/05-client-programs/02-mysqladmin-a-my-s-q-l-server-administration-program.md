### 4.5.2 mysqladmin — A MySQL Server Administration Program

**mysqladmin** is a client for performing administrative operations. You can use it to check the server's configuration and current status, to create and drop databases, and more.

Invoke **mysqladmin** like this:

```sql
mysqladmin [options] command [command-arg] [command [command-arg]] ...
```

**mysqladmin** supports the following commands. Some of the commands take an argument following the command name.

* `create db_name`

  Create a new database named *`db_name`*.

* `debug`

  Tell the server to write debug information to the error log. The connected user must have the `SUPER` privilege. Format and content of this information is subject to change.

  This includes information about the Event Scheduler. See Section 23.4.5, “Event Scheduler Status”.

* `drop db_name`

  Delete the database named *`db_name`* and all its tables.

* `extended-status`

  Display the server status variables and their values.

* `flush-hosts`

  Flush all information in the host cache. See Section 5.1.11.2, “DNS Lookups and the Host Cache”.

* `flush-logs [log_type ...]`

  Flush all logs.

  The **mysqladmin flush-logs** command permits optional log types to be given, to specify which logs to flush. Following the `flush-logs` command, you can provide a space-separated list of one or more of the following log types: `binary`, `engine`, `error`, `general`, `relay`, `slow`. These correspond to the log types that can be specified for the `FLUSH LOGS` SQL statement.

* `flush-privileges`

  Reload the grant tables (same as `reload`).

* `flush-status`

  Clear status variables.

* `flush-tables`

  Flush all tables.

* `flush-threads`

  Flush the thread cache.

* `kill id,id,...`

  Kill server threads. If multiple thread ID values are given, there must be no spaces in the list.

  To kill threads belonging to other users, the connected user must have the `SUPER` privilege.

* `old-password new_password`

  This is like the `password` command but stores the password using the old (pre-4.1) password-hashing format. (See Section 6.1.2.4, “Password Hashing in MySQL”.)

  This command was removed in MySQL 5.7.5.

* `password new_password`

  Set a new password. This changes the password to *`new_password`* for the account that you use with **mysqladmin** for connecting to the server. Thus, the next time you invoke **mysqladmin** (or any other client program) using the same account, you must specify the new password.

  Warning

  Setting a password using **mysqladmin** should be considered *insecure*. On some systems, your password becomes visible to system status programs such as **ps** that may be invoked by other users to display command lines. MySQL clients typically overwrite the command-line password argument with zeros during their initialization sequence. However, there is still a brief interval during which the value is visible. Also, on some systems this overwriting strategy is ineffective and the password remains visible to **ps**. (SystemV Unix systems and perhaps others are subject to this problem.)

  If the *`new_password`* value contains spaces or other characters that are special to your command interpreter, you need to enclose it within quotation marks. On Windows, be sure to use double quotation marks rather than single quotation marks; single quotation marks are not stripped from the password, but rather are interpreted as part of the password. For example:

  ```sql
  mysqladmin password "my new password"
  ```

  The new password can be omitted following the `password` command. In this case, **mysqladmin** prompts for the password value, which enables you to avoid specifying the password on the command line. Omitting the password value should be done only if `password` is the final command on the **mysqladmin** command line. Otherwise, the next argument is taken as the password.

  Caution

  Do not use this command used if the server was started with the `--skip-grant-tables` option. No password change is applied. This is true even if you precede the `password` command with `flush-privileges` on the same command line to re-enable the grant tables because the flush operation occurs after you connect. However, you can use **mysqladmin flush-privileges** to re-enable the grant table and then use a separate **mysqladmin password** command to change the password.

* `ping`

  Check whether the server is available. The return status from **mysqladmin** is 0 if the server is running, 1 if it is not. This is 0 even in case of an error such as `Access denied`, because this means that the server is running but refused the connection, which is different from the server not running.

* `processlist`

  Show a list of active server threads. This is like the output of the `SHOW PROCESSLIST` statement. If the `--verbose` option is given, the output is like that of `SHOW FULL PROCESSLIST`. (See Section 13.7.5.29, “SHOW PROCESSLIST Statement”.)

* `reload`

  Reload the grant tables.

* `refresh`

  Flush all tables and close and open log files.

* `shutdown`

  Stop the server.

* `start-slave`

  Start replication on a replica server.

* `status`

  Display a short server status message.

* `stop-slave`

  Stop replication on a replica server.

* `variables`

  Display the server system variables and their values.

* `version`

  Display version information from the server.

All commands can be shortened to any unique prefix. For example:

```sql
$> mysqladmin proc stat
+----+-------+-----------+----+---------+------+-------+------------------+
| Id | User  | Host      | db | Command | Time | State | Info             |
+----+-------+-----------+----+---------+------+-------+------------------+
| 51 | jones | localhost |    | Query   | 0    |       | show processlist |
+----+-------+-----------+----+---------+------+-------+------------------+
Uptime: 1473624  Threads: 1  Questions: 39487
Slow queries: 0  Opens: 541  Flush tables: 1
Open tables: 19  Queries per second avg: 0.0268
```

The **mysqladmin status** command result displays the following values:

* `Uptime`

  The number of seconds the MySQL server has been running.

* `Threads`

  The number of active threads (clients).

* `Questions`

  The number of questions (queries) from clients since the server was started.

* `Slow queries`

  The number of queries that have taken more than `long_query_time` seconds. See Section 5.4.5, “The Slow Query Log”.

* `Opens`

  The number of tables the server has opened.

* `Flush tables`

  The number of `flush-*`, `refresh`, and `reload` commands the server has executed.

* `Open tables`

  The number of tables that currently are open.

If you execute **mysqladmin shutdown** when connecting to a local server using a Unix socket file, **mysqladmin** waits until the server's process ID file has been removed, to ensure that the server has stopped properly.

**mysqladmin** supports the following options, which can be specified on the command line or in the `[mysqladmin]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see Section 4.2.2.2, “Using Option Files”.

**Table 4.14 mysqladmin Options**

<table frame="box" rules="all" summary="Command-line options available for mysqladmin."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_bind-address">--bind-address</a></th> <td>Use specified network interface to connect to MySQL Server</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_character-sets-dir">--character-sets-dir</a></th> <td>Directory where character sets can be found</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_compress">--compress</a></th> <td>Compress all information sent between client and server</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_connect-timeout">--connect-timeout</a></th> <td>Number of seconds before connection timeout</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_count">--count</a></th> <td>Number of iterations to make for repeated command execution</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_debug">--debug</a></th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_debug-check">--debug-check</a></th> <td>Print debugging information when program exits</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_debug-info">--debug-info</a></th> <td>Print debugging information, memory, and CPU statistics when program exits</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_default-auth">--default-auth</a></th> <td>Authentication plugin to use</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_default-character-set">--default-character-set</a></th> <td>Specify default character set</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_defaults-extra-file">--defaults-extra-file</a></th> <td>Read named option file in addition to usual option files</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_defaults-file">--defaults-file</a></th> <td>Read only named option file</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_defaults-group-suffix">--defaults-group-suffix</a></th> <td>Option group suffix value</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_enable-cleartext-plugin">--enable-cleartext-plugin</a></th> <td>Enable cleartext authentication plugin</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_force">--force</a></th> <td>Continue even if an SQL error occurs</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_get-server-public-key">--get-server-public-key</a></th> <td>Request RSA public key from server</td> <td>5.7.23</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_help">--help</a></th> <td>Display help message and exit</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_host">--host</a></th> <td>Host on which MySQL server is located</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_login-path">--login-path</a></th> <td>Read login path options from .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_no-beep">--no-beep</a></th> <td>Do not beep when errors occur</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_no-defaults">--no-defaults</a></th> <td>Read no option files</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_password">--password</a></th> <td>Password to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_pipe">--pipe</a></th> <td>Connect to server using named pipe (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_plugin-dir">--plugin-dir</a></th> <td>Directory where plugins are installed</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_port">--port</a></th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_print-defaults">--print-defaults</a></th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_protocol">--protocol</a></th> <td>Transport protocol to use</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_relative">--relative</a></th> <td>Show the difference between the current and previous values when used with the --sleep option</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_secure-auth">--secure-auth</a></th> <td>Do not send passwords to server in old (pre-4.1) format</td> <td></td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_server-public-key-path">--server-public-key-path</a></th> <td>Path name to file containing RSA public key</td> <td>5.7.23</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_shared-memory-base-name">--shared-memory-base-name</a></th> <td>Shared-memory name for shared-memory connections (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_show-warnings">--show-warnings</a></th> <td>Show warnings after statement execution</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_shutdown-timeout">--shutdown-timeout</a></th> <td>The maximum number of seconds to wait for server shutdown</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_silent">--silent</a></th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_sleep">--sleep</a></th> <td>Execute commands repeatedly, sleeping for delay seconds in between</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_socket">--socket</a></th> <td>Unix socket file or Windows named pipe to use</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_ssl">--ssl</a></th> <td>Enable connection encryption</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_ssl">--ssl-ca</a></th> <td>File that contains list of trusted SSL Certificate Authorities</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_ssl">--ssl-capath</a></th> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_ssl">--ssl-cert</a></th> <td>File that contains X.509 certificate</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_ssl">--ssl-cipher</a></th> <td>Permissible ciphers for connection encryption</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_ssl">--ssl-crl</a></th> <td>File that contains certificate revocation lists</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_ssl">--ssl-crlpath</a></th> <td>Directory that contains certificate revocation-list files</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_ssl">--ssl-key</a></th> <td>File that contains X.509 key</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_ssl">--ssl-mode</a></th> <td>Desired security state of connection to server</td> <td>5.7.11</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_ssl">--ssl-verify-server-cert</a></th> <td>Verify host name against server certificate Common Name identity</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_tls-version">--tls-version</a></th> <td>Permissible TLS protocols for encrypted connections</td> <td>5.7.10</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_user">--user</a></th> <td>MySQL user name to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_verbose">--verbose</a></th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_version">--version</a></th> <td>Display version information and exit</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_vertical">--vertical</a></th> <td>Print query output rows vertically (one line per column value)</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_wait">--wait</a></th> <td>If the connection cannot be established, wait and retry instead of aborting</td> <td></td> <td></td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On a computer having multiple network interfaces, use this option to select which interface to use for connecting to the MySQL server.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  The directory where character sets are installed. See Section 10.15, “Character Set Configuration”.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for compress"><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compress all information sent between the client and the server if possible. See Section 4.2.6, “Connection Compression Control”.

* `--connect-timeout=value`

  <table frame="box" rules="all" summary="Properties for connect-timeout"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-timeout=value</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>43200</code></td> </tr></tbody></table>

  The maximum number of seconds before connection timeout. The default value is 43200 (12 hours).

* `--count=N`, `-c N`

  <table frame="box" rules="all" summary="Properties for count"><tbody><tr><th>Command-Line Format</th> <td><code>--count=#</code></td> </tr></tbody></table>

  The number of iterations to make for repeated command execution if the `--sleep` option is given.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for debug"><tbody><tr><th>Command-Line Format</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:o,/tmp/mysqladmin.trace</code></td> </tr></tbody></table>

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:o,/tmp/mysqladmin.trace`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for debug-check"><tbody><tr><th>Command-Line Format</th> <td><code>--debug-check</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-info`

  <table frame="box" rules="all" summary="Properties for debug-info"><tbody><tr><th>Command-Line Format</th> <td><code>--debug-info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Print debugging information and memory and CPU usage statistics when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

  A hint about which client-side authentication plugin to use. See Section 6.2.13, “Pluggable Authentication”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

  Use *`charset_name`* as the default character set. See Section 10.15, “Character Set Configuration”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysqladmin** normally reads the `[client]` and `[mysqladmin]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysqladmin** also reads the `[client_other]` and `[mysqladmin_other]` groups.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

  Enable the `mysql_clear_password` cleartext authentication plugin. (See Section 6.4.1.6, “Client-Side Cleartext Pluggable Authentication”.)

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

  Do not ask for confirmation for the `drop db_name` command. With multiple commands, continue even if an error occurs.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

  Request from the server the public key required for RSA key pair-based password exchange. This option applies to clients that authenticate with the `caching_sha2_password` authentication plugin. For that plugin, the server does not send the public key unless requested. This option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the `caching_sha2_password` plugin, see Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  The `--get-server-public-key` option was added in MySQL 5.7.23.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

  Connect to the MySQL server on the given host.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--no-beep`, `-b`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

  Suppress the warning beep that is emitted by default for errors such as a failure to connect to the server.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqladmin** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 6.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqladmin** should not prompt for one, use the `--skip-password` option.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

  On Windows, connect to the server using a named pipe. This option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysqladmin** does not find it. See Section 6.2.13, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

  For TCP/IP connections, the port number to use.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 4.2.5, “Connection Transport Protocols”.

* `--relative`, `-r`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>8

  Show the difference between the current and previous values when used with the `--sleep` option. This option works only with the `extended-status` command.

* `--show-warnings`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>9

  Show warnings resulting from execution of statements sent to the server.

* `--secure-auth`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

  Do not send passwords to the server in old (pre-4.1) format. This prevents connections except for servers that use the newer password format.

  As of MySQL 5.7.5, this option is deprecated; expect it to be removed in a future MySQL release. It is always enabled and attempting to disable it (`--skip-secure-auth`, `--secure-auth=0`) produces an error. Before MySQL 5.7.5, this option is enabled by default but can be disabled.

  Note

  Passwords that use the pre-4.1 hashing method are less secure than passwords that use the native password hashing method and should be avoided. Pre-4.1 passwords are deprecated and support for them was removed in MySQL 5.7.5. For account upgrade instructions, see Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql\_old\_password Plugin”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or `caching_sha2_password` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and `caching_sha2_password` plugins, see Section 6.4.1.5, “SHA-256 Pluggable Authentication”, and Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  The `--server-public-key-path` option was added in MySQL 5.7.23.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

  On Windows, the shared-memory name to use for connections made using shared memory to a local server. The default value is `MYSQL`. The shared-memory name is case-sensitive.

  This option applies only if the server was started with the `shared_memory` system variable enabled to support shared-memory connections.

* `--shutdown-timeout=value`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

  The maximum number of seconds to wait for server shutdown. The default value is 3600 (1 hour).

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

  Exit silently if a connection to the server cannot be established.

* `--sleep=delay`, `-i delay`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>5

  Execute commands repeatedly, sleeping for *`delay`* seconds in between. The `--count` option determines the number of iterations. If `--count` is not given, **mysqladmin** executes commands indefinitely until interrupted.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>6

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>7

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 5.7.10.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>8

  The user name of the MySQL account to use for connecting to the server.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>9

  Verbose mode. Print more information about what the program does.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for compress"><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

  Display version information and exit.

* `--vertical`, `-E`

  <table frame="box" rules="all" summary="Properties for compress"><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

  Print output vertically. This is similar to `--relative`, but prints output vertically.

* `--wait[=count]`, `-w[count]`

  <table frame="box" rules="all" summary="Properties for compress"><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

  If the connection cannot be established, wait and retry instead of aborting. If a *`count`* value is given, it indicates the number of times to retry. The default is one time.
