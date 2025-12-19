### 6.5.2 mysqladmin — A MySQL Server Administration Program

 **mysqladmin** is a client for performing administrative operations. You can use it to check the server's configuration and current status, to create and drop databases, and more.

Invoke  **mysqladmin** like this:

```
mysqladmin [options] command [command-arg] [command [command-arg]] ...
```

 **mysqladmin** supports the following commands. Some of the commands take an argument following the command name.

* `create db_name`

  Create a new database named *`db_name`*.
* `debug`

  Tells the server to write debug information to the error log. The connected user must have the `SUPER` privilege. Format and content of this information is subject to change.

  This includes information about the Event Scheduler. See Section 27.4.5, “Event Scheduler Status”.
* `drop db_name`

  Delete the database named *`db_name`* and all its tables.
* `extended-status`

  Display the server status variables and their values.
* `flush-hosts`

  Flush all information in the host cache. See Section 7.1.12.3, “DNS Lookups and the Host Cache”.
* `flush-logs [log_type ...]`

  Flush all logs.

  The  **mysqladmin flush-logs** command permits optional log types to be given, to specify which logs to flush. Following the `flush-logs` command, you can provide a space-separated list of one or more of the following log types: `binary`, `engine`, `error`, `general`, `relay`, `slow`. These correspond to the log types that can be specified for the [`FLUSH LOGS`](flush.html#flush-logs) SQL statement.
* `flush-privileges`

  Reload the grant tables (same as `reload`).
* `flush-status`

  Clear status variables.
* `flush-tables`

  Flush all tables.
* `kill id,id,...`

  Kill server threads. If multiple thread ID values are given, there must be no spaces in the list.

  To kill threads belonging to other users, the connected user must have the `CONNECTION_ADMIN` privilege (or the deprecated  `SUPER` privilege).
* `password new_password`

  Set a new password. This changes the password to *`new_password`* for the account that you use with  **mysqladmin** for connecting to the server. Thus, the next time you invoke **mysqladmin** (or any other client program) using the same account, you must specify the new password.

  Warning

  Setting a password using  **mysqladmin** should be considered *insecure*. On some systems, your password becomes visible to system status programs such as **ps** that may be invoked by other users to display command lines. MySQL clients typically overwrite the command-line password argument with zeros during their initialization sequence. However, there is still a brief interval during which the value is visible. Also, on some systems this overwriting strategy is ineffective and the password remains visible to **ps**. (SystemV Unix systems and perhaps others are subject to this problem.)

  If the *`new_password`* value contains spaces or other characters that are special to your command interpreter, you need to enclose it within quotation marks. On Windows, be sure to use double quotation marks rather than single quotation marks; single quotation marks are not stripped from the password, but rather are interpreted as part of the password. For example:

  ```
  mysqladmin password "my new password"
  ```

  The new password can be omitted following the `password` command. In this case, **mysqladmin** prompts for the password value, which enables you to avoid specifying the password on the command line. Omitting the password value should be done only if `password` is the final command on the  **mysqladmin** command line. Otherwise, the next argument is taken as the password.

  Caution

  Do not use this command used if the server was started with the `--skip-grant-tables` option. No password change is applied. This is true even if you precede the `password` command with `flush-privileges` on the same command line to re-enable the grant tables because the flush operation occurs after you connect. However, you can use **mysqladmin flush-privileges** to re-enable the grant tables and then use a separate **mysqladmin password** command to change the password.
* `ping`

  Check whether the server is available. The return status from  **mysqladmin** is 0 if the server is running, 1 if it is not. This is 0 even in case of an error such as `Access denied`, because this means that the server is running but refused the connection, which is different from the server not running.
* `processlist`

  Show a list of active server threads. This is like the output of the [`SHOW PROCESSLIST`](show-processlist.html "15.7.7.31 SHOW PROCESSLIST Statement") statement. If the `--verbose` option is given, the output is like that of [`SHOW FULL PROCESSLIST`](show-processlist.html "15.7.7.31 SHOW PROCESSLIST Statement"). (See Section 15.7.7.31, “SHOW PROCESSLIST Statement”.)
* `reload`

  Reload the grant tables.
* `refresh`

  Flush all tables and close and open log files.
* `shutdown`

  Stop the server.
* `start-replica`

  Start replication on a replica server.
* `start-slave`

  This is a deprecated alias for start-replica.
* `status`

  Display a short server status message.
* `stop-replica`

  Stop replication on a replica server.
* `stop-slave`

  This is a deprecated alias for stop-replica.
* `variables`

  Display the server system variables and their values.
* `version`

  Display version information from the server.

All commands can be shortened to any unique prefix. For example:

```
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

The  **mysqladmin status** command result displays the following values:

*  `Uptime`

  The number of seconds the MySQL server has been running.
* `Threads`

  The number of active threads (clients).
*  `Questions`

  The number of questions (queries) from clients since the server was started.
* `Slow queries`

  The number of queries that have taken more than `long_query_time` seconds. See  Section 7.4.5, “The Slow Query Log”.
* `Opens`

  The number of tables the server has opened.
* `Flush tables`

  The number of `flush-*`, `refresh`, and `reload` commands the server has executed.
* `Open tables`

  The number of tables that currently are open.

If you execute  **mysqladmin shutdown** when connecting to a local server using a Unix socket file, **mysqladmin** waits until the server's process ID file has been removed, to ensure that the server has stopped properly.

 **mysqladmin** supports the following options, which can be specified on the command line or in the `[mysqladmin]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see  Section 6.2.2.2, “Using Option Files”.

**Table 6.11 mysqladmin Options**

<table><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Option Name</th> <th>Description</th> </tr></thead><tbody><tr><td>--bind-address</td> <td>Use specified network interface to connect to MySQL Server</td> </tr><tr><td>--character-sets-dir</td> <td>Directory where character sets can be found</td> </tr><tr><td>--compress</td> <td>Compress all information sent between client and server</td> </tr><tr><td>--compression-algorithms</td> <td>Permitted compression algorithms for connections to server</td> </tr><tr><td>--connect-timeout</td> <td>Number of seconds before connection timeout</td> </tr><tr><td>--count</td> <td>Number of iterations to make for repeated command execution</td> </tr><tr><td>--debug</td> <td>Write debugging log</td> </tr><tr><td>--debug-check</td> <td>Print debugging information when program exits</td> </tr><tr><td>--debug-info</td> <td>Print debugging information, memory, and CPU statistics when program exits</td> </tr><tr><td>--default-auth</td> <td>Authentication plugin to use</td> </tr><tr><td>--default-character-set</td> <td>Specify default character set</td> </tr><tr><td>--defaults-extra-file</td> <td>Read named option file in addition to usual option files</td> </tr><tr><td>--defaults-file</td> <td>Read only named option file</td> </tr><tr><td>--defaults-group-suffix</td> <td>Option group suffix value</td> </tr><tr><td>--enable-cleartext-plugin</td> <td>Enable cleartext authentication plugin</td> </tr><tr><td>--force</td> <td>Continue even if an SQL error occurs</td> </tr><tr><td>--get-server-public-key</td> <td>Request RSA public key from server</td> </tr><tr><td>--help</td> <td>Display help message and exit</td> </tr><tr><td>--host</td> <td>Host on which MySQL server is located</td> </tr><tr><td>--login-path</td> <td>Read login path options from .mylogin.cnf</td> </tr><tr><td>--no-beep</td> <td>Do not beep when errors occur</td> </tr><tr><td>--no-defaults</td> <td>Read no option files</td> </tr><tr><td>--no-login-paths</td> <td>Do not read login paths from the login path file</td> </tr><tr><td>--password</td> <td>Password to use when connecting to server</td> </tr><tr><td>--password1</td> <td>First multifactor authentication password to use when connecting to server</td> </tr><tr><td>--password2</td> <td>Second multifactor authentication password to use when connecting to server</td> </tr><tr><td>--password3</td> <td>Third multifactor authentication password to use when connecting to server</td> </tr><tr><td>--pipe</td> <td>Connect to server using named pipe (Windows only)</td> </tr><tr><td>--plugin-dir</td> <td>Directory where plugins are installed</td> </tr><tr><td>--port</td> <td>TCP/IP port number for connection</td> </tr><tr><td>--print-defaults</td> <td>Print default options</td> </tr><tr><td>--protocol</td> <td>Transport protocol to use</td> </tr><tr><td>--relative</td> <td>Show the difference between the current and previous values when used with the --sleep option</td> </tr><tr><td>--server-public-key-path</td> <td>Path name to file containing RSA public key</td> </tr><tr><td>--shared-memory-base-name</td> <td>Shared-memory name for shared-memory connections (Windows only)</td> </tr><tr><td>--show-warnings</td> <td>Show warnings after statement execution</td> </tr><tr><td>--shutdown-timeout</td> <td>The maximum number of seconds to wait for server shutdown</td> </tr><tr><td>--silent</td> <td>Silent mode</td> </tr><tr><td>--sleep</td> <td>Execute commands repeatedly, sleeping for delay seconds in between</td> </tr><tr><td>--socket</td> <td>Unix socket file or Windows named pipe to use</td> </tr><tr><td>--ssl-ca</td> <td>File that contains list of trusted SSL Certificate Authorities</td> </tr><tr><td>--ssl-capath</td> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> </tr><tr><td>--ssl-cert</td> <td>File that contains X.509 certificate</td> </tr><tr><td>--ssl-cipher</td> <td>Permissible ciphers for connection encryption</td> </tr><tr><td>--ssl-crl</td> <td>File that contains certificate revocation lists</td> </tr><tr><td>--ssl-crlpath</td> <td>Directory that contains certificate revocation-list files</td> </tr><tr><td>--ssl-fips-mode</td> <td>Whether to enable FIPS mode on client side</td> </tr><tr><td>--ssl-key</td> <td>File that contains X.509 key</td> </tr><tr><td>--ssl-mode</td> <td>Desired security state of connection to server</td> </tr><tr><td>--ssl-session-data</td> <td>File that contains SSL session data</td> </tr><tr><td>--ssl-session-data-continue-on-failed-reuse</td> <td>Whether to establish connections if session reuse fails</td> </tr><tr><td>--tls-ciphersuites</td> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> </tr><tr><td>--tls-sni-servername</td> <td>Server name supplied by the client</td> </tr><tr><td>--tls-version</td> <td>Permissible TLS protocols for encrypted connections</td> </tr><tr><td>--user</td> <td>MySQL user name to use when connecting to server</td> </tr><tr><td>--verbose</td> <td>Verbose mode</td> </tr><tr><td>--version</td> <td>Display version information and exit</td> </tr><tr><td>--vertical</td> <td>Print query output rows vertically (one line per column value)</td> </tr><tr><td>--wait</td> <td>If the connection cannot be established, wait and retry instead of aborting</td> </tr><tr><td>--zstd-compression-level</td> <td>Compression level for connections to server that use zstd compression</td> </tr></tbody></table>

*  `--help`, `-?`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.
*  `--bind-address=ip_address`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On a computer having multiple network interfaces, use this option to select which interface to use for connecting to the MySQL server.
*  `--character-sets-dir=dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  The directory where character sets are installed. See Section 12.15, “Character Set Configuration”.
*  `--compress`, `-C`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compress all information sent between the client and the server if possible. See Section 6.2.8, “Connection Compression Control”.

  This option is deprecated. Expect it to be removed in a future version of MySQL. See Configuring Legacy Connection Compression.
*  `--compression-algorithms=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>

  The permitted compression algorithms for connections to the server. The available algorithms are the same as for the `protocol_compression_algorithms` system variable. The default value is `uncompressed`.

  For more information, see Section 6.2.8, “Connection Compression Control”.
*  `--connect-timeout=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-timeout=value</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>43200</code></td> </tr></tbody></table>

  The maximum number of seconds before connection timeout. The default value is 43200 (12 hours).
*  `--count=N`, `-c N`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--count=#</code></td> </tr></tbody></table>

  The number of iterations to make for repeated command execution if the  `--sleep` option is given.
*  `--debug[=debug_options]`, `-# [debug_options]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:o,/tmp/mysqladmin.trace</code></td> </tr></tbody></table>

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:o,/tmp/mysqladmin.trace`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.
*  `--debug-check`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-check</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.
*  `--debug-info`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Print debugging information and memory and CPU usage statistics when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.
*  `--default-auth=plugin`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  A hint about which client-side authentication plugin to use. See  Section 8.2.17, “Pluggable Authentication”.
*  `--default-character-set=charset_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-character-set=charset_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Use *`charset_name`* as the default character set. See  Section 12.15, “Character Set Configuration”.
*  `--defaults-extra-file=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--defaults-file=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--defaults-group-suffix=str`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=str</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysqladmin** normally reads the `[client]` and `[mysqladmin]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysqladmin** also reads the `[client_other]` and `[mysqladmin_other]` groups.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--enable-cleartext-plugin`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Enable the `mysql_clear_password` cleartext authentication plugin. (See Section 8.4.1.4, “Client-Side Cleartext Pluggable Authentication”.)
*  `--force`, `-f`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--force</code></td> </tr></tbody></table>

  Do not ask for confirmation for the `drop db_name` command. With multiple commands, continue even if an error occurs.
*  `--get-server-public-key`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>

  Request from the server the public key required for RSA key pair-based password exchange. This option applies to clients that authenticate with the `caching_sha2_password` authentication plugin. For that plugin, the server does not send the public key unless requested. This option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the `caching_sha2_password` plugin, see Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.
*  `--host=host_name`, `-h host_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>

  Connect to the MySQL server on the given host.
*  `--login-path=name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql\_config\_editor** utility. See Section 6.6.7, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--no-login-paths`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--no-login-paths</code></td> </tr></tbody></table>

  Skips reading options from the login path file.

  See  `--login-path` for related information.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--no-beep`, `-b`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--no-beep</code></td> </tr></tbody></table>

  Suppress the warning beep that is emitted by default for errors such as a failure to connect to the server.
*  `--no-defaults`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql\_config\_editor** utility. See Section 6.6.7, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--password[=password]`, `-p[password]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqladmin** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqladmin** should not prompt for one, use the `--skip-password` option.
*  `--password1[=pass_val]`

  The password for multifactor authentication factor 1 of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysql** prompts for one. If given, there must be *no space* between `--password1=` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqladmin** should not prompt for one, use the `--skip-password1` option.

   `--password1` and `--password` are synonymous, as are `--skip-password1` and `--skip-password`.
*  `--password2[=pass_val]`

  The password for multifactor authentication factor 2 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.
*  `--password3[=pass_val]`

  The password for multifactor authentication factor 3 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.
*  `--pipe`, `-W`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--pipe</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  On Windows, connect to the server using a named pipe. This option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.
*  `--plugin-dir=dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--plugin-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysqladmin** does not find it. See Section 8.2.17, “Pluggable Authentication”.
*  `--port=port_num`, `-P port_num`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--port=port_num</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>3306</code></td> </tr></tbody></table>

  For TCP/IP connections, the port number to use.
*  `--print-defaults`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--protocol=type</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[see text]</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>TCP</code></p><p class="valid-value"><code>SOCKET</code></p><p class="valid-value"><code>PIPE</code></p><p class="valid-value"><code>MEMORY</code></p></td> </tr></tbody></table>

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 6.2.7, “Connection Transport Protocols”.
*  `--relative`, `-r`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relative</code></td> </tr></tbody></table>

  Show the difference between the current and previous values when used with the `--sleep` option. This option works only with the `extended-status` command.
*  `--server-public-key-path=file_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--server-public-key-path=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` (deprecated) or `caching_sha2_password` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password` (deprecated), this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and `caching_sha2_password` plugins, see Section 8.4.1.3, “SHA-256 Pluggable Authentication”, and Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.
*  `--shared-memory-base-name=name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--shared-memory-base-name=name</code></td> </tr><tr><th>Platform Specific</th> <td>Windows</td> </tr></tbody></table>

  On Windows, the shared-memory name to use for connections made using shared memory to a local server. The default value is `MYSQL`. The shared-memory name is case-sensitive.

  This option applies only if the server was started with the `shared_memory` system variable enabled to support shared-memory connections.
*  `--show-warnings`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--show-warnings</code></td> </tr></tbody></table>

  Show warnings resulting from execution of statements sent to the server.
*  `--shutdown-timeout=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--shutdown-timeout=seconds</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>3600</code></td> </tr></tbody></table>

  The maximum number of seconds to wait for server shutdown. The default value is 3600 (1 hour).
*  `--silent`, `-s`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--silent</code></td> </tr></tbody></table>

  Exit silently if a connection to the server cannot be established.
*  `--sleep=delay`, `-i delay`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--sleep=delay</code></td> </tr></tbody></table>

  Execute commands repeatedly, sleeping for *`delay`* seconds in between. The `--count` option determines the number of iterations. If `--count` is not given, **mysqladmin** executes commands indefinitely until interrupted.
*  `--socket=path`, `-S path`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--socket={file_name|pipe_name}</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the  `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.
* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.
*  `--ssl-fips-mode={OFF|ON|STRICT}`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ssl-fips-mode={OFF|ON|STRICT}</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>STRICT</code></p></td> </tr></tbody></table>

  Controls whether to enable FIPS mode on the client side. The `--ssl-fips-mode` option differs from other `--ssl-xxx` options in that it is not used to establish encrypted connections, but rather to affect which cryptographic operations to permit. See  Section 8.8, “FIPS Support”.

  These  `--ssl-fips-mode` values are permitted:

  + `OFF`: Disable FIPS mode.
  + `ON`: Enable FIPS mode.
  + `STRICT`: Enable “strict” FIPS mode. ::: info Note

  If the OpenSSL FIPS Object Module is not available, the only permitted value for `--ssl-fips-mode` is `OFF`. In this case, setting `--ssl-fips-mode` to `ON` or `STRICT` causes the client to produce a warning at startup and to operate in non-FIPS mode.


  :::

  This option is deprecated. Expect it to be removed in a future version of MySQL.
*  `--tls-ciphersuites=ciphersuite_list`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--tls-ciphersuites=ciphersuite_list</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The permissible ciphersuites for encrypted connections that use TLSv1.3. The value is a list of one or more colon-separated ciphersuite names. The ciphersuites that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.
*  `--tls-sni-servername=server_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--tls-sni-servername=server_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  When specified, the name is passed to the `libmysqlclient` C API library using the `MYSQL_OPT_TLS_SNI_SERVERNAME` option of `mysql_options()`. The server name is not case-sensitive. To show which server name the client specified for the current session, if any, check the `Tls_sni_server_name` status variable.

  Server Name Indication (SNI) is an extension to the TLS protocol (OpenSSL must be compiled using TLS extensions for this option to function). The MySQL implementation of SNI represents the client-side only.
*  `--tls-version=protocol_list`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--tls-version=protocol_list</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><p class="valid-value"><code>TLSv1,TLSv1.1,TLSv1.2,TLSv1.3</code> (OpenSSL 1.1.1 or higher)</p><p class="valid-value"><code>TLSv1,TLSv1.1,TLSv1.2</code> (otherwise)</p></td> </tr></tbody></table>

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.
*  `--user=user_name`, `-u user_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--user=user_name,</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The user name of the MySQL account to use for connecting to the server.

  If you are using the `Rewriter` plugin, grant this user the `SKIP_QUERY_REWRITE` privilege.
*  `--verbose`, `-v`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Verbose mode. Print more information about what the program does.
*  `--version`, `-V`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--version</code></td> </tr></tbody></table>

  Display version information and exit.
*  `--vertical`, `-E`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--vertical</code></td> </tr></tbody></table>

  Print output vertically. This is similar to `--relative`, but prints output vertically.
*  `--wait[=count]`, `-w[count]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--wait</code></td> </tr></tbody></table>

  If the connection cannot be established, wait and retry instead of aborting. If a *`count`* value is given, it indicates the number of times to retry. The default is one time.
*  `--zstd-compression-level=level`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--zstd-compression-level=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr></tbody></table>

  The compression level to use for connections to the server that use the `zstd` compression algorithm. The permitted levels are from 1 to 22, with larger values indicating increasing levels of compression. The default `zstd` compression level is 3. The compression level setting has no effect on connections that do not use `zstd` compression.

  For more information, see Section 6.2.8, “Connection Compression Control”.
