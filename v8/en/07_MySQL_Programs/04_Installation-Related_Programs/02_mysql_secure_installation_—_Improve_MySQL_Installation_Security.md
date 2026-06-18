### 6.4.2 mysql\_secure\_installation — Improve MySQL Installation Security

This program enables you to improve the security of your MySQL
installation in the following ways:

* You can set a password for `root` accounts.
* You can remove `root` accounts that are
  accessible from outside the local host.

* You can remove anonymous-user accounts.
* You can remove the `test` database (which
  by default can be accessed by all users, even anonymous
  users), and privileges that permit anyone to access
  databases with names that start with
  `test_`.

[**mysql\_secure\_installation**](mysql-secure-installation.html "6.4.2 mysql_secure_installation — Improve MySQL Installation Security") helps you implement
security recommendations similar to those described at
[Section 2.9.4, “Securing the Initial MySQL Account”](default-privileges.html "2.9.4 Securing the Initial MySQL Account").

Normal usage is to connect to the local MySQL server; invoke
[**mysql\_secure\_installation**](mysql-secure-installation.html "6.4.2 mysql_secure_installation — Improve MySQL Installation Security") without arguments:

```
mysql_secure_installation
```

When executed, [**mysql\_secure\_installation**](mysql-secure-installation.html "6.4.2 mysql_secure_installation — Improve MySQL Installation Security")
prompts you to determine which actions to perform.

The `validate_password` component can be used
for password strength checking. If the plugin is not installed,
[**mysql\_secure\_installation**](mysql-secure-installation.html "6.4.2 mysql_secure_installation — Improve MySQL Installation Security") prompts the user
whether to install it. Any passwords entered later are checked
using the plugin if it is enabled.

Most of the usual MySQL client options such as
[`--host`](mysql-secure-installation.html#option_mysql_secure_installation_host) and
[`--port`](mysql-secure-installation.html#option_mysql_secure_installation_port) can be
used on the command line and in option files. For example, to
connect to the local server over IPv6 using port 3307, use this
command:

```
mysql_secure_installation --host=::1 --port=3307
```

[**mysql\_secure\_installation**](mysql-secure-installation.html "6.4.2 mysql_secure_installation — Improve MySQL Installation Security") supports the
following options, which can be specified on the command line or
in the `[mysql_secure_installation]` and
`[client]` groups of an option file. For
information about option files used by MySQL programs, see
[Section 6.2.2.2, “Using Option Files”](option-files.html "6.2.2.2 Using Option Files").

**Table 6.9 mysql\_secure\_installation Options**

<table frame="box" rules="all" summary="Command-line options available for mysql_secure_installation."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th>
<th scope="col">Description</th>
<th scope="col">Introduced</th>
<th scope="col">Deprecated</th>
</tr></thead><tbody><tr><th scope="row"><a class="link" href="option-file-options.html#option_general_defaults-extra-file">--defaults-extra-file</a></th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="option-file-options.html#option_general_defaults-file">--defaults-file</a></th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="option-file-options.html#option_general_defaults-group-suffix">--defaults-group-suffix</a></th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_help">--help</a></th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_host">--host</a></th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="option-file-options.html#option_general_no-defaults">--no-defaults</a></th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_password">--password</a></th>
<td>Accepted but always ignored. Whenever mysql_secure_installation is invoked, the user is prompted for a password, regardless</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_port">--port</a></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="option-file-options.html#option_general_print-defaults">--print-defaults</a></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_protocol">--protocol</a></th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_socket">--socket</a></th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl">--ssl-ca</a></th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl">--ssl-capath</a></th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl">--ssl-cert</a></th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl">--ssl-cipher</a></th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl">--ssl-crl</a></th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl">--ssl-crlpath</a></th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl-fips-mode">--ssl-fips-mode</a></th>
<td>Whether to enable FIPS mode on client side</td>
<td></td>
<td>8.0.34</td>
</tr><tr><th scope="row"><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl">--ssl-key</a></th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-mode</a></th>
<td>Desired security state of connection to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl">--ssl-session-data</a></th>
<td>File that contains SSL session data</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_ssl">--ssl-session-data-continue-on-failed-reuse</a></th>
<td>Whether to establish connections if session reuse fails</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_tls-ciphersuites">--tls-ciphersuites</a></th>
<td>Permissible TLSv1.3 ciphersuites for encrypted connections</td>
<td>8.0.16</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_tls-version">--tls-version</a></th>
<td>Permissible TLS protocols for encrypted connections</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_use-default">--use-default</a></th>
<td>Execute with no user interactivity</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-secure-installation.html#option_mysql_secure_installation_user">--user</a></th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr></tbody></table>

* [`--help`](mysql-secure-installation.html#option_mysql_secure_installation_help),
  `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>

  Display a help message and exit.

* [`--defaults-extra-file=file_name`](mysql-secure-installation.html#option_mysql_secure_installation_defaults-extra-file)

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-extra-file=file_name</code></td>
</tr><tr><th>Type</th>
<td>File name</td>
</tr></tbody></table>

  Read this option file after the global option file but (on
  Unix) before the user option file. If the file does not
  exist or is otherwise inaccessible, an error occurs. If
  *`file_name`* is not an absolute path
  name, it is interpreted relative to the current directory.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-file=file_name`](mysql-secure-installation.html#option_mysql_secure_installation_defaults-file)

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-file=file_name</code></td>
</tr><tr><th>Type</th>
<td>File name</td>
</tr></tbody></table>

  Use only the given option file. If the file does not exist
  or is otherwise inaccessible, an error occurs. If
  *`file_name`* is not an absolute path
  name, it is interpreted relative to the current directory.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-group-suffix=str`](mysql-secure-installation.html#option_mysql_secure_installation_defaults-group-suffix)

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-group-suffix=str</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr></tbody></table>

  Read not only the usual option groups, but also groups with
  the usual names and a suffix of
  *`str`*. For example,
  [**mysql\_secure\_installation**](mysql-secure-installation.html "6.4.2 mysql_secure_installation — Improve MySQL Installation Security") normally reads
  the `[client]` and
  `[mysql_secure_installation]` groups. If
  this option is given as
  [`--defaults-group-suffix=_other`](mysql-secure-installation.html#option_mysql_secure_installation_defaults-group-suffix),
  [**mysql\_secure\_installation**](mysql-secure-installation.html "6.4.2 mysql_secure_installation — Improve MySQL Installation Security") also reads the
  `[client_other]` and
  `[mysql_secure_installation_other]` groups.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--host=host_name`](mysql-secure-installation.html#option_mysql_secure_installation_host),
  `-h host_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--host</code></td>
</tr></tbody></table>

  Connect to the MySQL server on the given host.

* [`--no-defaults`](mysql-secure-installation.html#option_mysql_secure_installation_no-defaults)

  <table frame="box" rules="all" summary="Properties for no-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--no-defaults</code></td>
</tr></tbody></table>

  Do not read any option files. If program startup fails due
  to reading unknown options from an option file,
  [`--no-defaults`](mysql-secure-installation.html#option_mysql_secure_installation_no-defaults)
  can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf`
  file is read in all cases, if it exists. This permits
  passwords to be specified in a safer way than on the command
  line even when
  [`--no-defaults`](mysql-secure-installation.html#option_mysql_secure_installation_no-defaults)
  is used. To create `.mylogin.cnf`, use
  the [**mysql\_config\_editor**](mysql-config-editor.html "6.6.7 mysql_config_editor — MySQL Configuration Utility") utility. See
  [Section 6.6.7, “mysql\_config\_editor — MySQL Configuration Utility”](mysql-config-editor.html "6.6.7 mysql_config_editor — MySQL Configuration Utility").

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--password=password`](mysql-secure-installation.html#option_mysql_secure_installation_password),
  `-p password`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--password=password</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  This option is accepted but ignored. Whether or not this
  option is used, [**mysql\_secure\_installation**](mysql-secure-installation.html "6.4.2 mysql_secure_installation — Improve MySQL Installation Security")
  always prompts the user for a password.

* [`--port=port_num`](mysql-secure-installation.html#option_mysql_secure_installation_port),
  `-P port_num`

  <table frame="box" rules="all" summary="Properties for port"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--port=port_num</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">3306</code></td>
</tr></tbody></table>

  For TCP/IP connections, the port number to use.

* [`--print-defaults`](mysql-secure-installation.html#option_mysql_secure_installation_print-defaults)

  <table frame="box" rules="all" summary="Properties for print-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--print-defaults</code></td>
</tr></tbody></table>

  Print the program name and all options that it gets from
  option files.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--protocol={TCP|SOCKET|PIPE|MEMORY}`](mysql-secure-installation.html#option_mysql_secure_installation_protocol)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>0

  The transport protocol to use for connecting to the server.
  It is useful when the other connection parameters normally
  result in use of a protocol other than the one you want. For
  details on the permissible values, see
  [Section 6.2.7, “Connection Transport Protocols”](transport-protocols.html "6.2.7 Connection Transport Protocols").

* [`--socket=path`](mysql-secure-installation.html#option_mysql_secure_installation_socket),
  `-S path`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>1

  For connections to `localhost`, the Unix
  socket file to use, or, on Windows, the name of the named
  pipe to use.

  On Windows, this option applies only if the server was
  started with the [`named_pipe`](server-system-variables.html#sysvar_named_pipe)
  system variable enabled to support named-pipe connections.
  In addition, the connection must be a member of the Windows
  group specified by the
  [`named_pipe_full_access_group`](server-system-variables.html#sysvar_named_pipe_full_access_group)
  system variable.

* `--ssl*`

  Options that begin with `--ssl` specify
  whether to connect to the server using encryption and
  indicate where to find SSL keys and certificates. See
  [Command Options for Encrypted Connections](connection-options.html#encrypted-connection-options "Command Options for Encrypted Connections").

* [`--ssl-fips-mode={OFF|ON|STRICT}`](mysql-secure-installation.html#option_mysql_secure_installation_ssl-fips-mode)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>2

  Controls whether to enable FIPS mode on the client side. The
  [`--ssl-fips-mode`](mysql-secure-installation.html#option_mysql_secure_installation_ssl-fips-mode)
  option differs from other
  `--ssl-xxx`
  options in that it is not used to establish encrypted
  connections, but rather to affect which cryptographic
  operations to permit. See [Section 8.8, “FIPS Support”](fips-mode.html "8.8 FIPS Support").

  These
  [`--ssl-fips-mode`](mysql-secure-installation.html#option_mysql_secure_installation_ssl-fips-mode)
  values are permitted:

  + `OFF`: Disable FIPS mode.
  + `ON`: Enable FIPS mode.
  + `STRICT`: Enable “strict”
    FIPS mode.

  Note

  If the OpenSSL FIPS Object Module is not available, the
  only permitted value for
  [`--ssl-fips-mode`](mysql-secure-installation.html#option_mysql_secure_installation_ssl-fips-mode)
  is `OFF`. In this case, setting
  [`--ssl-fips-mode`](mysql-secure-installation.html#option_mysql_secure_installation_ssl-fips-mode)
  to `ON` or `STRICT`
  causes the client to produce a warning at startup and to
  operate in non-FIPS mode.

  As of MySQL 8.0.34, this option is deprecated. Expect it to
  be removed in a future version of MySQL.

* [`--tls-ciphersuites=ciphersuite_list`](mysql-secure-installation.html#option_mysql_secure_installation_tls-ciphersuites)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>3

  The permissible ciphersuites for encrypted connections that
  use TLSv1.3. The value is a list of one or more
  colon-separated ciphersuite names. The ciphersuites that can
  be named for this option depend on the SSL library used to
  compile MySQL. For details, see
  [Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "8.3.2 Encrypted Connection TLS Protocols and Ciphers").

  This option was added in MySQL 8.0.16.

* [`--tls-version=protocol_list`](mysql-secure-installation.html#option_mysql_secure_installation_tls-version)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>4

  The permissible TLS protocols for encrypted connections. The
  value is a list of one or more comma-separated protocol
  names. The protocols that can be named for this option
  depend on the SSL library used to compile MySQL. For
  details, see
  [Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "8.3.2 Encrypted Connection TLS Protocols and Ciphers").

* [`--use-default`](mysql-secure-installation.html#option_mysql_secure_installation_use-default)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>5

  Execute noninteractively. This option can be used for
  unattended installation operations.

* [`--user=user_name`](mysql-secure-installation.html#option_mysql_secure_installation_user),
  `-u user_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>6

  The user name of the MySQL account to use for connecting to
  the server.