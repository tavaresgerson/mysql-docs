### 6.5.2 mysqladmin — A MySQL Server Administration Program

[**mysqladmin**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") is a client for performing
administrative operations. You can use it to check the server's
configuration and current status, to create and drop databases,
and more.

Invoke [**mysqladmin**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") like this:

```
mysqladmin [options] command [command-arg] [command [command-arg]] ...
```

[**mysqladmin**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") supports the following commands.
Some of the commands take an argument following the command
name.

* `create db_name`

  Create a new database named
  *`db_name`*.

* `debug`

  Prior to MySQL 8.0.20, tell the server to write debug
  information to the error log. The connected user must have
  the [`SUPER`](privileges-provided.html#priv_super) privilege. Format
  and content of this information is subject to change.

  This includes information about the Event Scheduler. See
  [Section 27.4.5, “Event Scheduler Status”](events-status-info.html "27.4.5 Event Scheduler Status").

* `drop db_name`

  Delete the database named *`db_name`*
  and all its tables.

* `extended-status`

  Display the server status variables and their values.

* `flush-hosts`

  Flush all information in the host cache. See
  [Section 7.1.12.3, “DNS Lookups and the Host Cache”](host-cache.html "7.1.12.3 DNS Lookups and the Host Cache").

* `flush-logs [log_type
  ...]`

  Flush all logs.

  The [**mysqladmin flush-logs**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") command permits
  optional log types to be given, to specify which logs to
  flush. Following the `flush-logs` command,
  you can provide a space-separated list of one or more of the
  following log types: `binary`,
  `engine`, `error`,
  `general`, `relay`,
  `slow`. These correspond to the log types
  that can be specified for the [`FLUSH
  LOGS`](flush.html#flush-logs) SQL statement.

* `flush-privileges`

  Reload the grant tables (same as `reload`).

* `flush-status`

  Clear status variables.

* `flush-tables`

  Flush all tables.

* `flush-threads`

  Flush the thread cache.

* `kill
  id,id,...`

  Kill server threads. If multiple thread ID values are given,
  there must be no spaces in the list.

  To kill threads belonging to other users, the connected user
  must have the
  [`CONNECTION_ADMIN`](privileges-provided.html#priv_connection-admin) privilege
  (or the deprecated [`SUPER`](privileges-provided.html#priv_super)
  privilege).

* `password
  new_password`

  Set a new password. This changes the password to
  *`new_password`* for the account that
  you use with [**mysqladmin**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") for connecting to
  the server. Thus, the next time you invoke
  [**mysqladmin**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") (or any other client program)
  using the same account, you must specify the new password.

  Warning

  Setting a password using [**mysqladmin**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program")
  should be considered *insecure*. On
  some systems, your password becomes visible to system
  status programs such as **ps** that may be
  invoked by other users to display command lines. MySQL
  clients typically overwrite the command-line password
  argument with zeros during their initialization sequence.
  However, there is still a brief interval during which the
  value is visible. Also, on some systems this overwriting
  strategy is ineffective and the password remains visible
  to **ps**. (SystemV Unix systems and
  perhaps others are subject to this problem.)

  If the *`new_password`* value
  contains spaces or other characters that are special to your
  command interpreter, you need to enclose it within quotation
  marks. On Windows, be sure to use double quotation marks
  rather than single quotation marks; single quotation marks
  are not stripped from the password, but rather are
  interpreted as part of the password. For example:

  ```
  mysqladmin password "my new password"
  ```

  The new password can be omitted following the
  `password` command. In this case,
  [**mysqladmin**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") prompts for the password
  value, which enables you to avoid specifying the password on
  the command line. Omitting the password value should be done
  only if `password` is the final command on
  the [**mysqladmin**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") command line. Otherwise,
  the next argument is taken as the password.

  Caution

  Do not use this command used if the server was started
  with the
  [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) option.
  No password change is applied. This is true even if you
  precede the `password` command with
  `flush-privileges` on the same command
  line to re-enable the grant tables because the flush
  operation occurs after you connect. However, you can use
  [**mysqladmin flush-privileges**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") to
  re-enable the grant tables and then use a separate
  [**mysqladmin password**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") command to change
  the password.

* `ping`

  Check whether the server is available. The return status
  from [**mysqladmin**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") is 0 if the server is
  running, 1 if it is not. This is 0 even in case of an error
  such as `Access denied`, because this means
  that the server is running but refused the connection, which
  is different from the server not running.

* `processlist`

  Show a list of active server threads. This is like the
  output of the [`SHOW
  PROCESSLIST`](show-processlist.html "15.7.7.29 SHOW PROCESSLIST Statement") statement. If the
  [`--verbose`](mysqladmin.html#option_mysqladmin_verbose) option is
  given, the output is like that of
  [`SHOW FULL
  PROCESSLIST`](show-processlist.html "15.7.7.29 SHOW PROCESSLIST Statement"). (See
  [Section 15.7.7.29, “SHOW PROCESSLIST Statement”](show-processlist.html "15.7.7.29 SHOW PROCESSLIST Statement").)

* `reload`

  Reload the grant tables.

* `refresh`

  Flush all tables and close and open log files.

* `shutdown`

  Stop the server.

* `start-replica`

  Start replication on a replica server. Use this command from
  MySQL 8.0.26.

* `start-slave`

  Start replication on a replica server. Use this command
  before MySQL 8.0.26.

* `status`

  Display a short server status message.

* `stop-replica`

  Stop replication on a replica server. Use this command from
  MySQL 8.0.26.

* `stop-slave`

  Stop replication on a replica server. Use this command
  before MySQL 8.0.26.

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

The [**mysqladmin status**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") command result displays
the following values:

* [`Uptime`](server-status-variables.html#statvar_Uptime)

  The number of seconds the MySQL server has been running.

* `Threads`

  The number of active threads (clients).

* [`Questions`](server-status-variables.html#statvar_Questions)

  The number of questions (queries) from clients since the
  server was started.

* `Slow queries`

  The number of queries that have taken more than
  [`long_query_time`](server-system-variables.html#sysvar_long_query_time) seconds.
  See [Section 7.4.5, “The Slow Query Log”](slow-query-log.html "7.4.5 The Slow Query Log").

* `Opens`

  The number of tables the server has opened.

* `Flush tables`

  The number of `flush-*`,
  `refresh`, and `reload`
  commands the server has executed.

* `Open tables`

  The number of tables that currently are open.

If you execute [**mysqladmin shutdown**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") when
connecting to a local server using a Unix socket file,
[**mysqladmin**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") waits until the server's process
ID file has been removed, to ensure that the server has stopped
properly.

[**mysqladmin**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") supports the following options,
which can be specified on the command line or in the
`[mysqladmin]` and `[client]`
groups of an option file. For information about option files
used by MySQL programs, see [Section 6.2.2.2, “Using Option Files”](option-files.html "6.2.2.2 Using Option Files").

**Table 6.13 mysqladmin Options**

<table frame="box" rules="all" summary="Command-line options available for mysqladmin."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th>
<th scope="col">Description</th>
<th scope="col">Introduced</th>
<th scope="col">Deprecated</th>
</tr></thead><tbody><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_bind-address">--bind-address</a></th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_character-sets-dir">--character-sets-dir</a></th>
<td>Directory where character sets can be found</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_compress">--compress</a></th>
<td>Compress all information sent between client and server</td>
<td></td>
<td>8.0.18</td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_compression-algorithms">--compression-algorithms</a></th>
<td>Permitted compression algorithms for connections to server</td>
<td>8.0.18</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_connect-timeout">--connect-timeout</a></th>
<td>Number of seconds before connection timeout</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_count">--count</a></th>
<td>Number of iterations to make for repeated command execution</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_debug">--debug</a></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_debug-check">--debug-check</a></th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_debug-info">--debug-info</a></th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_default-auth">--default-auth</a></th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_default-character-set">--default-character-set</a></th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_defaults-extra-file">--defaults-extra-file</a></th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_defaults-file">--defaults-file</a></th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_defaults-group-suffix">--defaults-group-suffix</a></th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_enable-cleartext-plugin">--enable-cleartext-plugin</a></th>
<td>Enable cleartext authentication plugin</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_force">--force</a></th>
<td>Continue even if an SQL error occurs</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_get-server-public-key">--get-server-public-key</a></th>
<td>Request RSA public key from server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_help">--help</a></th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_host">--host</a></th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_login-path">--login-path</a></th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_no-beep">--no-beep</a></th>
<td>Do not beep when errors occur</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_no-defaults">--no-defaults</a></th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_password">--password</a></th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_password1">--password1</a></th>
<td>First multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_password2">--password2</a></th>
<td>Second multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_password3">--password3</a></th>
<td>Third multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_pipe">--pipe</a></th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_plugin-dir">--plugin-dir</a></th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_port">--port</a></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_print-defaults">--print-defaults</a></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_protocol">--protocol</a></th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_relative">--relative</a></th>
<td>Show the difference between the current and previous values when used with the --sleep option</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_server-public-key-path">--server-public-key-path</a></th>
<td>Path name to file containing RSA public key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_shared-memory-base-name">--shared-memory-base-name</a></th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_show-warnings">--show-warnings</a></th>
<td>Show warnings after statement execution</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_shutdown-timeout">--shutdown-timeout</a></th>
<td>The maximum number of seconds to wait for server shutdown</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_silent">--silent</a></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_sleep">--sleep</a></th>
<td>Execute commands repeatedly, sleeping for delay seconds in between</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_socket">--socket</a></th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_ssl">--ssl-ca</a></th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_ssl">--ssl-capath</a></th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_ssl">--ssl-cert</a></th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_ssl">--ssl-cipher</a></th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_ssl">--ssl-crl</a></th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_ssl">--ssl-crlpath</a></th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_ssl-fips-mode">--ssl-fips-mode</a></th>
<td>Whether to enable FIPS mode on client side</td>
<td></td>
<td>8.0.34</td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_ssl">--ssl-key</a></th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_ssl">--ssl-mode</a></th>
<td>Desired security state of connection to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_ssl">--ssl-session-data</a></th>
<td>File that contains SSL session data</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_ssl">--ssl-session-data-continue-on-failed-reuse</a></th>
<td>Whether to establish connections if session reuse fails</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_tls-ciphersuites">--tls-ciphersuites</a></th>
<td>Permissible TLSv1.3 ciphersuites for encrypted connections</td>
<td>8.0.16</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_tls-version">--tls-version</a></th>
<td>Permissible TLS protocols for encrypted connections</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_user">--user</a></th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_verbose">--verbose</a></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_version">--version</a></th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_vertical">--vertical</a></th>
<td>Print query output rows vertically (one line per column value)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_wait">--wait</a></th>
<td>If the connection cannot be established, wait and retry instead of aborting</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqladmin.html#option_mysqladmin_zstd-compression-level">--zstd-compression-level</a></th>
<td>Compression level for connections to server that use zstd compression</td>
<td>8.0.18</td>
<td></td>
</tr></tbody></table>

* [`--help`](mysqladmin.html#option_mysqladmin_help),
  `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>

  Display a help message and exit.

* [`--bind-address=ip_address`](mysqladmin.html#option_mysqladmin_bind-address)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>

  On a computer having multiple network interfaces, use this
  option to select which interface to use for connecting to
  the MySQL server.

* [`--character-sets-dir=dir_name`](mysqladmin.html#option_mysqladmin_character-sets-dir)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  The directory where character sets are installed. See
  [Section 12.15, “Character Set Configuration”](charset-configuration.html "12.15 Character Set Configuration").

* [`--compress`](mysqladmin.html#option_mysqladmin_compress),
  `-C`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--compress[={OFF|ON}]</code></td>
</tr><tr><th>Deprecated</th>
<td>8.0.18</td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">OFF</code></td>
</tr></tbody></table>

  Compress all information sent between the client and the
  server if possible. See
  [Section 6.2.8, “Connection Compression Control”](connection-compression-control.html "6.2.8 Connection Compression Control").

  As of MySQL 8.0.18, this option is deprecated. Expect it to
  be removed in a future version of MySQL. See
  [Configuring Legacy Connection Compression](connection-compression-control.html#connection-compression-legacy-configuration "Configuring Legacy Connection Compression").

* [`--compression-algorithms=value`](mysqladmin.html#option_mysqladmin_compression-algorithms)

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--compression-algorithms=value</code></td>
</tr><tr><th>Introduced</th>
<td>8.0.18</td>
</tr><tr><th>Type</th>
<td>Set</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">uncompressed</code></td>
</tr><tr><th>Valid Values</th>
<td><p class="valid-value"><code class="literal">zlib</code></p><p class="valid-value"><code class="literal">zstd</code></p><p class="valid-value"><code class="literal">uncompressed</code></p></td>
</tr></tbody></table>

  The permitted compression algorithms for connections to the
  server. The available algorithms are the same as for the
  [`protocol_compression_algorithms`](server-system-variables.html#sysvar_protocol_compression_algorithms)
  system variable. The default value is
  `uncompressed`.

  For more information, see
  [Section 6.2.8, “Connection Compression Control”](connection-compression-control.html "6.2.8 Connection Compression Control").

  This option was added in MySQL 8.0.18.

* [`--connect-timeout=value`](mysqladmin.html#option_mysqladmin_connect-timeout)

  <table frame="box" rules="all" summary="Properties for connect-timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-timeout=value</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">43200</code></td>
</tr></tbody></table>

  The maximum number of seconds before connection timeout. The
  default value is 43200 (12 hours).

* [`--count=N`](mysqladmin.html#option_mysqladmin_count),
  `-c N`

  <table frame="box" rules="all" summary="Properties for count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--count=#</code></td>
</tr></tbody></table>

  The number of iterations to make for repeated command
  execution if the [`--sleep`](mysqladmin.html#option_mysqladmin_sleep)
  option is given.

* [`--debug[=debug_options]`](mysqladmin.html#option_mysqladmin_debug),
  `-#
  [debug_options]`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--debug[=debug_options]</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">d:t:o,/tmp/mysqladmin.trace</code></td>
</tr></tbody></table>

  Write a debugging log. A typical
  *`debug_options`* string is
  `d:t:o,file_name`.
  The default is
  `d:t:o,/tmp/mysqladmin.trace`.

  This option is available only if MySQL was built using
  [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug). MySQL release
  binaries provided by Oracle are *not*
  built using this option.

* [`--debug-check`](mysqladmin.html#option_mysqladmin_debug-check)

  <table frame="box" rules="all" summary="Properties for debug-check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--debug-check</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using
  [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug). MySQL release
  binaries provided by Oracle are *not*
  built using this option.

* [`--debug-info`](mysqladmin.html#option_mysqladmin_debug-info)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>0

  Print debugging information and memory and CPU usage
  statistics when the program exits.

  This option is available only if MySQL was built using
  [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug). MySQL release
  binaries provided by Oracle are *not*
  built using this option.

* [`--default-auth=plugin`](mysqladmin.html#option_mysqladmin_default-auth)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>1

  A hint about which client-side authentication plugin to use.
  See [Section 8.2.17, “Pluggable Authentication”](pluggable-authentication.html "8.2.17 Pluggable Authentication").

* [`--default-character-set=charset_name`](mysqladmin.html#option_mysqladmin_default-character-set)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>2

  Use *`charset_name`* as the default
  character set. See [Section 12.15, “Character Set Configuration”](charset-configuration.html "12.15 Character Set Configuration").

* [`--defaults-extra-file=file_name`](mysqladmin.html#option_mysqladmin_defaults-extra-file)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>3

  Read this option file after the global option file but (on
  Unix) before the user option file. If the file does not
  exist or is otherwise inaccessible, an error occurs. If
  *`file_name`* is not an absolute path
  name, it is interpreted relative to the current directory.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-file=file_name`](mysqladmin.html#option_mysqladmin_defaults-file)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>4

  Use only the given option file. If the file does not exist
  or is otherwise inaccessible, an error occurs. If
  *`file_name`* is not an absolute path
  name, it is interpreted relative to the current directory.

  Exception: Even with
  [`--defaults-file`](option-file-options.html#option_general_defaults-file), client
  programs read `.mylogin.cnf`.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-group-suffix=str`](mysqladmin.html#option_mysqladmin_defaults-group-suffix)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>5

  Read not only the usual option groups, but also groups with
  the usual names and a suffix of
  *`str`*. For example,
  [**mysqladmin**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") normally reads the
  `[client]` and
  `[mysqladmin]` groups. If this option is
  given as
  [`--defaults-group-suffix=_other`](mysqladmin.html#option_mysqladmin_defaults-group-suffix),
  [**mysqladmin**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") also reads the
  `[client_other]` and
  `[mysqladmin_other]` groups.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--enable-cleartext-plugin`](mysqladmin.html#option_mysqladmin_enable-cleartext-plugin)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>6

  Enable the `mysql_clear_password` cleartext
  authentication plugin. (See
  [Section 8.4.1.4, “Client-Side Cleartext Pluggable Authentication”](cleartext-pluggable-authentication.html "8.4.1.4 Client-Side Cleartext Pluggable Authentication").)

* [`--force`](mysqladmin.html#option_mysqladmin_force),
  `-f`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>7

  Do not ask for confirmation for the `drop
  db_name` command. With
  multiple commands, continue even if an error occurs.

* [`--get-server-public-key`](mysqladmin.html#option_mysqladmin_get-server-public-key)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>8

  Request from the server the public key required for RSA key
  pair-based password exchange. This option applies to clients
  that authenticate with the
  `caching_sha2_password` authentication
  plugin. For that plugin, the server does not send the public
  key unless requested. This option is ignored for accounts
  that do not authenticate with that plugin. It is also
  ignored if RSA-based password exchange is not used, as is
  the case when the client connects to the server using a
  secure connection.

  If
  [`--server-public-key-path=file_name`](mysqladmin.html#option_mysqladmin_server-public-key-path)
  is given and specifies a valid public key file, it takes
  precedence over
  [`--get-server-public-key`](mysqladmin.html#option_mysqladmin_get-server-public-key).

  For information about the
  `caching_sha2_password` plugin, see
  [Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”](caching-sha2-pluggable-authentication.html "8.4.1.2 Caching SHA-2 Pluggable Authentication").

* [`--host=host_name`](mysqladmin.html#option_mysqladmin_host),
  `-h host_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>9

  Connect to the MySQL server on the given host.

* [`--login-path=name`](mysqladmin.html#option_mysqladmin_login-path)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>0

  Read options from the named login path in the
  `.mylogin.cnf` login path file. A
  “login path” is an option group containing
  options that specify which MySQL server to connect to and
  which account to authenticate as. To create or modify a
  login path file, use the
  [**mysql\_config\_editor**](mysql-config-editor.html "6.6.7 mysql_config_editor — MySQL Configuration Utility") utility. See
  [Section 6.6.7, “mysql\_config\_editor — MySQL Configuration Utility”](mysql-config-editor.html "6.6.7 mysql_config_editor — MySQL Configuration Utility").

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--no-beep`](mysqladmin.html#option_mysqladmin_no-beep),
  `-b`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>1

  Suppress the warning beep that is emitted by default for
  errors such as a failure to connect to the server.

* [`--no-defaults`](mysqladmin.html#option_mysqladmin_no-defaults)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>2

  Do not read any option files. If program startup fails due
  to reading unknown options from an option file,
  [`--no-defaults`](mysqladmin.html#option_mysqladmin_no-defaults) can be used
  to prevent them from being read.

  The exception is that the `.mylogin.cnf`
  file is read in all cases, if it exists. This permits
  passwords to be specified in a safer way than on the command
  line even when
  [`--no-defaults`](mysqladmin.html#option_mysqladmin_no-defaults) is used. To
  create `.mylogin.cnf`, use the
  [**mysql\_config\_editor**](mysql-config-editor.html "6.6.7 mysql_config_editor — MySQL Configuration Utility") utility. See
  [Section 6.6.7, “mysql\_config\_editor — MySQL Configuration Utility”](mysql-config-editor.html "6.6.7 mysql_config_editor — MySQL Configuration Utility").

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--password[=password]`](mysqladmin.html#option_mysqladmin_password),
  `-p[password]`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>3

  The password of the MySQL account used for connecting to the
  server. The password value is optional. If not given,
  [**mysqladmin**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") prompts for one. If given,
  there must be *no space* between
  [`--password=`](mysqladmin.html#option_mysqladmin_password) or
  `-p` and the password following it. If no
  password option is specified, the default is to send no
  password.

  Specifying a password on the command line should be
  considered insecure. To avoid giving the password on the
  command line, use an option file. See
  [Section 8.1.2.1, “End-User Guidelines for Password Security”](password-security-user.html "8.1.2.1 End-User Guidelines for Password Security").

  To explicitly specify that there is no password and that
  [**mysqladmin**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") should not prompt for one, use
  the
  [`--skip-password`](mysqladmin.html#option_mysqladmin_password)
  option.

* [`--password1[=pass_val]`](mysqladmin.html#option_mysqladmin_password1)

  The password for multifactor authentication factor 1 of the
  MySQL account used for connecting to the server. The
  password value is optional. If not given,
  [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") prompts for one. If given, there
  must be *no space* between
  [`--password1=`](mysqladmin.html#option_mysqladmin_password1) and the
  password following it. If no password option is specified,
  the default is to send no password.

  Specifying a password on the command line should be
  considered insecure. To avoid giving the password on the
  command line, use an option file. See
  [Section 8.1.2.1, “End-User Guidelines for Password Security”](password-security-user.html "8.1.2.1 End-User Guidelines for Password Security").

  To explicitly specify that there is no password and that
  [**mysqladmin**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") should not prompt for one, use
  the
  [`--skip-password1`](mysqladmin.html#option_mysqladmin_password1)
  option.

  [`--password1`](mysqladmin.html#option_mysqladmin_password1) and
  [`--password`](mysqladmin.html#option_mysqladmin_password) are
  synonymous, as are
  [`--skip-password1`](mysql-command-options.html#option_mysql_password1)
  and
  [`--skip-password`](mysql-command-options.html#option_mysql_password).

* [`--password2[=pass_val]`](mysqladmin.html#option_mysqladmin_password2)

  The password for multifactor authentication factor 2 of the
  MySQL account used for connecting to the server. The
  semantics of this option are similar to the semantics for
  [`--password1`](mysqladmin.html#option_mysqladmin_password1); see the
  description of that option for details.

* [`--password3[=pass_val]`](mysqladmin.html#option_mysqladmin_password3)

  The password for multifactor authentication factor 3 of the
  MySQL account used for connecting to the server. The
  semantics of this option are similar to the semantics for
  [`--password1`](mysqladmin.html#option_mysqladmin_password1); see the
  description of that option for details.

* [`--pipe`](mysqladmin.html#option_mysqladmin_pipe),
  `-W`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>4

  On Windows, connect to the server using a named pipe. This
  option applies only if the server was started with the
  [`named_pipe`](server-system-variables.html#sysvar_named_pipe) system variable
  enabled to support named-pipe connections. In addition, the
  user making the connection must be a member of the Windows
  group specified by the
  [`named_pipe_full_access_group`](server-system-variables.html#sysvar_named_pipe_full_access_group)
  system variable.

* [`--plugin-dir=dir_name`](mysqladmin.html#option_mysqladmin_plugin-dir)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>5

  The directory in which to look for plugins. Specify this
  option if the
  [`--default-auth`](mysqladmin.html#option_mysqladmin_default-auth) option is
  used to specify an authentication plugin but
  [**mysqladmin**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") does not find it. See
  [Section 8.2.17, “Pluggable Authentication”](pluggable-authentication.html "8.2.17 Pluggable Authentication").

* [`--port=port_num`](mysqladmin.html#option_mysqladmin_port),
  `-P port_num`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>6

  For TCP/IP connections, the port number to use.

* [`--print-defaults`](mysqladmin.html#option_mysqladmin_print-defaults)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>7

  Print the program name and all options that it gets from
  option files.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--protocol={TCP|SOCKET|PIPE|MEMORY}`](mysqladmin.html#option_mysqladmin_protocol)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>8

  The transport protocol to use for connecting to the server.
  It is useful when the other connection parameters normally
  result in use of a protocol other than the one you want. For
  details on the permissible values, see
  [Section 6.2.7, “Connection Transport Protocols”](transport-protocols.html "6.2.7 Connection Transport Protocols").

* [`--relative`](mysqladmin.html#option_mysqladmin_relative),
  `-r`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>9

  Show the difference between the current and previous values
  when used with the
  [`--sleep`](mysqladmin.html#option_mysqladmin_sleep) option. This
  option works only with the
  `extended-status` command.

* [`--server-public-key-path=file_name`](mysqladmin.html#option_mysqladmin_server-public-key-path)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>0

  The path name to a file in PEM format containing a
  client-side copy of the public key required by the server
  for RSA key pair-based password exchange. This option
  applies to clients that authenticate with the
  `sha256_password` or
  `caching_sha2_password` authentication
  plugin. This option is ignored for accounts that do not
  authenticate with one of those plugins. It is also ignored
  if RSA-based password exchange is not used, as is the case
  when the client connects to the server using a secure
  connection.

  If
  [`--server-public-key-path=file_name`](mysqladmin.html#option_mysqladmin_server-public-key-path)
  is given and specifies a valid public key file, it takes
  precedence over
  [`--get-server-public-key`](mysqladmin.html#option_mysqladmin_get-server-public-key).

  For `sha256_password`, this option applies
  only if MySQL was built using OpenSSL.

  For information about the `sha256_password`
  and `caching_sha2_password` plugins, see
  [Section 8.4.1.3, “SHA-256 Pluggable Authentication”](sha256-pluggable-authentication.html "8.4.1.3 SHA-256 Pluggable Authentication"), and
  [Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”](caching-sha2-pluggable-authentication.html "8.4.1.2 Caching SHA-2 Pluggable Authentication").

* [`--shared-memory-base-name=name`](mysqladmin.html#option_mysqladmin_shared-memory-base-name)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>1

  On Windows, the shared-memory name to use for connections
  made using shared memory to a local server. The default
  value is `MYSQL`. The shared-memory name is
  case-sensitive.

  This option applies only if the server was started with the
  [`shared_memory`](server-system-variables.html#sysvar_shared_memory) system
  variable enabled to support shared-memory connections.

* [`--show-warnings`](mysqladmin.html#option_mysqladmin_show-warnings)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>2

  Show warnings resulting from execution of statements sent to
  the server.

* [`--shutdown-timeout=value`](mysqladmin.html#option_mysqladmin_shutdown-timeout)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>3

  The maximum number of seconds to wait for server shutdown.
  The default value is 3600 (1 hour).

* [`--silent`](mysqladmin.html#option_mysqladmin_silent),
  `-s`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>4

  Exit silently if a connection to the server cannot be
  established.

* [`--sleep=delay`](mysqladmin.html#option_mysqladmin_sleep),
  `-i delay`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>5

  Execute commands repeatedly, sleeping for
  *`delay`* seconds in between. The
  [`--count`](mysqladmin.html#option_mysqladmin_count) option determines
  the number of iterations. If
  [`--count`](mysqladmin.html#option_mysqladmin_count) is not given,
  [**mysqladmin**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") executes commands indefinitely
  until interrupted.

* [`--socket=path`](mysqladmin.html#option_mysqladmin_socket),
  `-S path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>6

  For connections to `localhost`, the Unix
  socket file to use, or, on Windows, the name of the named
  pipe to use.

  On Windows, this option applies only if the server was
  started with the [`named_pipe`](server-system-variables.html#sysvar_named_pipe)
  system variable enabled to support named-pipe connections.
  In addition, the user making the connection must be a member
  of the Windows group specified by the
  [`named_pipe_full_access_group`](server-system-variables.html#sysvar_named_pipe_full_access_group)
  system variable.

* `--ssl*`

  Options that begin with `--ssl` specify
  whether to connect to the server using encryption and
  indicate where to find SSL keys and certificates. See
  [Command Options for Encrypted Connections](connection-options.html#encrypted-connection-options "Command Options for Encrypted Connections").

* [`--ssl-fips-mode={OFF|ON|STRICT}`](mysqladmin.html#option_mysqladmin_ssl-fips-mode)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>7

  Controls whether to enable FIPS mode on the client side. The
  [`--ssl-fips-mode`](mysqladmin.html#option_mysqladmin_ssl-fips-mode) option
  differs from other
  `--ssl-xxx`
  options in that it is not used to establish encrypted
  connections, but rather to affect which cryptographic
  operations to permit. See [Section 8.8, “FIPS Support”](fips-mode.html "8.8 FIPS Support").

  These [`--ssl-fips-mode`](mysqladmin.html#option_mysqladmin_ssl-fips-mode)
  values are permitted:

  + `OFF`: Disable FIPS mode.
  + `ON`: Enable FIPS mode.
  + `STRICT`: Enable “strict”
    FIPS mode.

  Note

  If the OpenSSL FIPS Object Module is not available, the
  only permitted value for
  [`--ssl-fips-mode`](mysqladmin.html#option_mysqladmin_ssl-fips-mode) is
  `OFF`. In this case, setting
  [`--ssl-fips-mode`](mysqladmin.html#option_mysqladmin_ssl-fips-mode) to
  `ON` or `STRICT` causes
  the client to produce a warning at startup and to operate
  in non-FIPS mode.

  As of MySQL 8.0.34, this option is deprecated. Expect it to
  be removed in a future version of MySQL.

* [`--tls-ciphersuites=ciphersuite_list`](mysqladmin.html#option_mysqladmin_tls-ciphersuites)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>8

  The permissible ciphersuites for encrypted connections that
  use TLSv1.3. The value is a list of one or more
  colon-separated ciphersuite names. The ciphersuites that can
  be named for this option depend on the SSL library used to
  compile MySQL. For details, see
  [Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "8.3.2 Encrypted Connection TLS Protocols and Ciphers").

  This option was added in MySQL 8.0.16.

* [`--tls-version=protocol_list`](mysqladmin.html#option_mysqladmin_tls-version)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>9

  The permissible TLS protocols for encrypted connections. The
  value is a list of one or more comma-separated protocol
  names. The protocols that can be named for this option
  depend on the SSL library used to compile MySQL. For
  details, see
  [Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "8.3.2 Encrypted Connection TLS Protocols and Ciphers").

* [`--user=user_name`](mysqladmin.html#option_mysqladmin_user),
  `-u user_name`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--compress[={OFF|ON}]</code></td>
</tr><tr><th>Deprecated</th>
<td>8.0.18</td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">OFF</code></td>
</tr></tbody></table>0

  The user name of the MySQL account to use for connecting to
  the server.

  If you are using the `Rewriter` plugin with
  MySQL 8.0.31 or later, you should grant this user the
  [`SKIP_QUERY_REWRITE`](privileges-provided.html#priv_skip-query-rewrite) privilege.

* [`--verbose`](mysqladmin.html#option_mysqladmin_verbose),
  `-v`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--compress[={OFF|ON}]</code></td>
</tr><tr><th>Deprecated</th>
<td>8.0.18</td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">OFF</code></td>
</tr></tbody></table>1

  Verbose mode. Print more information about what the program
  does.

* [`--version`](mysqladmin.html#option_mysqladmin_version),
  `-V`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--compress[={OFF|ON}]</code></td>
</tr><tr><th>Deprecated</th>
<td>8.0.18</td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">OFF</code></td>
</tr></tbody></table>2

  Display version information and exit.

* [`--vertical`](mysqladmin.html#option_mysqladmin_vertical),
  `-E`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--compress[={OFF|ON}]</code></td>
</tr><tr><th>Deprecated</th>
<td>8.0.18</td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">OFF</code></td>
</tr></tbody></table>3

  Print output vertically. This is similar to
  [`--relative`](mysqladmin.html#option_mysqladmin_relative), but prints
  output vertically.

* [`--wait[=count]`](mysqladmin.html#option_mysqladmin_wait),
  `-w[count]`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--compress[={OFF|ON}]</code></td>
</tr><tr><th>Deprecated</th>
<td>8.0.18</td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">OFF</code></td>
</tr></tbody></table>4

  If the connection cannot be established, wait and retry
  instead of aborting. If a *`count`*
  value is given, it indicates the number of times to retry.
  The default is one time.

* [`--zstd-compression-level=level`](mysqladmin.html#option_mysqladmin_zstd-compression-level)

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--compress[={OFF|ON}]</code></td>
</tr><tr><th>Deprecated</th>
<td>8.0.18</td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">OFF</code></td>
</tr></tbody></table>5

  The compression level to use for connections to the server
  that use the `zstd` compression algorithm.
  The permitted levels are from 1 to 22, with larger values
  indicating increasing levels of compression. The default
  `zstd` compression level is 3. The
  compression level setting has no effect on connections that
  do not use `zstd` compression.

  For more information, see
  [Section 6.2.8, “Connection Compression Control”](connection-compression-control.html "6.2.8 Connection Compression Control").

  This option was added in MySQL 8.0.18.