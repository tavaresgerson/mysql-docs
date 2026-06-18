### 6.5.7 mysqlshow — Display Database, Table, and Column Information

The [**mysqlshow**](mysqlshow.html "6.5.7 mysqlshow — Display Database, Table, and Column Information") client can be used to quickly
see which databases exist, their tables, or a table's columns or
indexes.

[**mysqlshow**](mysqlshow.html "6.5.7 mysqlshow — Display Database, Table, and Column Information") provides a command-line interface
to several SQL [`SHOW`](show.html "15.7.7 SHOW Statements") statements.
See [Section 15.7.7, “SHOW Statements”](show.html "15.7.7 SHOW Statements"). The same information can be obtained
by using those statements directly. For example, you can issue
them from the [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") client program.

Invoke [**mysqlshow**](mysqlshow.html "6.5.7 mysqlshow — Display Database, Table, and Column Information") like this:

```
mysqlshow [options] [db_name [tbl_name [col_name]]]
```

* If no database is given, a list of database names is shown.
* If no table is given, all matching tables in the database
  are shown.

* If no column is given, all matching columns and column types
  in the table are shown.

The output displays only the names of those databases, tables,
or columns for which you have some privileges.

If the last argument contains shell or SQL wildcard characters
(`*`, `?`,
`%`, or `_`), only those names
that are matched by the wildcard are shown. If a database name
contains any underscores, those should be escaped with a
backslash (some Unix shells require two) to get a list of the
proper tables or columns. `*` and
`?` characters are converted into SQL
`%` and `_` wildcard
characters. This might cause some confusion when you try to
display the columns for a table with a `_` in
the name, because in this case, [**mysqlshow**](mysqlshow.html "6.5.7 mysqlshow — Display Database, Table, and Column Information")
shows you only the table names that match the pattern. This is
easily fixed by adding an extra `%` last on the
command line as a separate argument.

[**mysqlshow**](mysqlshow.html "6.5.7 mysqlshow — Display Database, Table, and Column Information") supports the following options,
which can be specified on the command line or in the
`[mysqlshow]` and `[client]`
groups of an option file. For information about option files
used by MySQL programs, see [Section 6.2.2.2, “Using Option Files”](option-files.html "6.2.2.2 Using Option Files").

**Table 6.18 mysqlshow Options**

<table frame="box" rules="all" summary="Command-line options available for mysqlshow."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th>
<th scope="col">Description</th>
<th scope="col">Introduced</th>
<th scope="col">Deprecated</th>
</tr></thead><tbody><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_bind-address">--bind-address</a></th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_character-sets-dir">--character-sets-dir</a></th>
<td>Directory where character sets can be found</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_compress">--compress</a></th>
<td>Compress all information sent between client and server</td>
<td></td>
<td>8.0.18</td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_compression-algorithms">--compression-algorithms</a></th>
<td>Permitted compression algorithms for connections to server</td>
<td>8.0.18</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_count">--count</a></th>
<td>Show the number of rows per table</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_debug">--debug</a></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_debug-check">--debug-check</a></th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_debug-info">--debug-info</a></th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_default-auth">--default-auth</a></th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_default-character-set">--default-character-set</a></th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_defaults-extra-file">--defaults-extra-file</a></th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_defaults-file">--defaults-file</a></th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_defaults-group-suffix">--defaults-group-suffix</a></th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_enable-cleartext-plugin">--enable-cleartext-plugin</a></th>
<td>Enable cleartext authentication plugin</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_get-server-public-key">--get-server-public-key</a></th>
<td>Request RSA public key from server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_help">--help</a></th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_host">--host</a></th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_keys">--keys</a></th>
<td>Show table indexes</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_login-path">--login-path</a></th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_no-defaults">--no-defaults</a></th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_password">--password</a></th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_password1">--password1</a></th>
<td>First multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_password2">--password2</a></th>
<td>Second multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_password3">--password3</a></th>
<td>Third multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_pipe">--pipe</a></th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_plugin-dir">--plugin-dir</a></th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_port">--port</a></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_print-defaults">--print-defaults</a></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_protocol">--protocol</a></th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_server-public-key-path">--server-public-key-path</a></th>
<td>Path name to file containing RSA public key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_shared-memory-base-name">--shared-memory-base-name</a></th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_show-table-type">--show-table-type</a></th>
<td>Show a column indicating the table type</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_socket">--socket</a></th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_ssl">--ssl-ca</a></th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_ssl">--ssl-capath</a></th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_ssl">--ssl-cert</a></th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_ssl">--ssl-cipher</a></th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_ssl">--ssl-crl</a></th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_ssl">--ssl-crlpath</a></th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_ssl-fips-mode">--ssl-fips-mode</a></th>
<td>Whether to enable FIPS mode on client side</td>
<td></td>
<td>8.0.34</td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_ssl">--ssl-key</a></th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_ssl">--ssl-mode</a></th>
<td>Desired security state of connection to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_ssl">--ssl-session-data</a></th>
<td>File that contains SSL session data</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_ssl">--ssl-session-data-continue-on-failed-reuse</a></th>
<td>Whether to establish connections if session reuse fails</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_status">--status</a></th>
<td>Display extra information about each table</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_tls-ciphersuites">--tls-ciphersuites</a></th>
<td>Permissible TLSv1.3 ciphersuites for encrypted connections</td>
<td>8.0.16</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_tls-version">--tls-version</a></th>
<td>Permissible TLS protocols for encrypted connections</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_user">--user</a></th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_verbose">--verbose</a></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_version">--version</a></th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlshow.html#option_mysqlshow_zstd-compression-level">--zstd-compression-level</a></th>
<td>Compression level for connections to server that use zstd compression</td>
<td>8.0.18</td>
<td></td>
</tr></tbody></table>

* [`--help`](mysqlshow.html#option_mysqlshow_help),
  `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>

  Display a help message and exit.

* [`--bind-address=ip_address`](mysqlshow.html#option_mysqlshow_bind-address)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>

  On a computer having multiple network interfaces, use this
  option to select which interface to use for connecting to
  the MySQL server.

* [`--character-sets-dir=dir_name`](mysqlshow.html#option_mysqlshow_character-sets-dir)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  The directory where character sets are installed. See
  [Section 12.15, “Character Set Configuration”](charset-configuration.html "12.15 Character Set Configuration").

* [`--compress`](mysqlshow.html#option_mysqlshow_compress),
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

* [`--compression-algorithms=value`](mysqlshow.html#option_mysqlshow_compression-algorithms)

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

* [`--count`](mysqlshow.html#option_mysqlshow_count)

  <table frame="box" rules="all" summary="Properties for count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--count</code></td>
</tr></tbody></table>

  Show the number of rows per table. This can be slow for
  non-`MyISAM` tables.

* [`--debug[=debug_options]`](mysqlshow.html#option_mysqlshow_debug),
  `-#
  [debug_options]`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--debug[=debug_options]</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">d:t:o</code></td>
</tr></tbody></table>

  Write a debugging log. A typical
  *`debug_options`* string is
  `d:t:o,file_name`.
  The default is `d:t:o`.

  This option is available only if MySQL was built using
  [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug). MySQL release
  binaries provided by Oracle are *not*
  built using this option.

* [`--debug-check`](mysqlshow.html#option_mysqlshow_debug-check)

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

* [`--debug-info`](mysqlshow.html#option_mysqlshow_debug-info)

  <table frame="box" rules="all" summary="Properties for debug-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--debug-info</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>

  Print debugging information and memory and CPU usage
  statistics when the program exits.

  This option is available only if MySQL was built using
  [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug). MySQL release
  binaries provided by Oracle are *not*
  built using this option.

* [`--default-character-set=charset_name`](mysqlshow.html#option_mysqlshow_default-character-set)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>0

  Use *`charset_name`* as the default
  character set. See [Section 12.15, “Character Set Configuration”](charset-configuration.html "12.15 Character Set Configuration").

* [`--default-auth=plugin`](mysqlshow.html#option_mysqlshow_default-auth)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>1

  A hint about which client-side authentication plugin to use.
  See [Section 8.2.17, “Pluggable Authentication”](pluggable-authentication.html "8.2.17 Pluggable Authentication").

* [`--defaults-extra-file=file_name`](mysqlshow.html#option_mysqlshow_defaults-extra-file)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>2

  Read this option file after the global option file but (on
  Unix) before the user option file. If the file does not
  exist or is otherwise inaccessible, an error occurs. If
  *`file_name`* is not an absolute path
  name, it is interpreted relative to the current directory.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-file=file_name`](mysqlshow.html#option_mysqlshow_defaults-file)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>3

  Use only the given option file. If the file does not exist
  or is otherwise inaccessible, an error occurs. If
  *`file_name`* is not an absolute path
  name, it is interpreted relative to the current directory.

  Exception: Even with
  [`--defaults-file`](option-file-options.html#option_general_defaults-file), client
  programs read `.mylogin.cnf`.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-group-suffix=str`](mysqlshow.html#option_mysqlshow_defaults-group-suffix)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>4

  Read not only the usual option groups, but also groups with
  the usual names and a suffix of
  *`str`*. For example,
  [**mysqlshow**](mysqlshow.html "6.5.7 mysqlshow — Display Database, Table, and Column Information") normally reads the
  `[client]` and
  `[mysqlshow]` groups. If this option is
  given as
  [`--defaults-group-suffix=_other`](mysqlshow.html#option_mysqlshow_defaults-group-suffix),
  [**mysqlshow**](mysqlshow.html "6.5.7 mysqlshow — Display Database, Table, and Column Information") also reads the
  `[client_other]` and
  `[mysqlshow_other]` groups.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--enable-cleartext-plugin`](mysqlshow.html#option_mysqlshow_enable-cleartext-plugin)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>5

  Enable the `mysql_clear_password` cleartext
  authentication plugin. (See
  [Section 8.4.1.4, “Client-Side Cleartext Pluggable Authentication”](cleartext-pluggable-authentication.html "8.4.1.4 Client-Side Cleartext Pluggable Authentication").)

* [`--get-server-public-key`](mysqlshow.html#option_mysqlshow_get-server-public-key)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>6

  Request from the server the RSA public key that it uses for
  key pair-based password exchange. This option applies to
  clients that connect to the server using an account that
  authenticates with the
  `caching_sha2_password` authentication
  plugin. For connections by such accounts, the server does
  not send the public key to the client unless requested. The
  option is ignored for accounts that do not authenticate with
  that plugin. It is also ignored if RSA-based password
  exchange is not needed, as is the case when the client
  connects to the server using a secure connection.

  If
  [`--server-public-key-path=file_name`](mysqlshow.html#option_mysqlshow_server-public-key-path)
  is given and specifies a valid public key file, it takes
  precedence over
  [`--get-server-public-key`](mysqlshow.html#option_mysqlshow_get-server-public-key).

  For information about the
  `caching_sha2_password` plugin, see
  [Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”](caching-sha2-pluggable-authentication.html "8.4.1.2 Caching SHA-2 Pluggable Authentication").

* [`--host=host_name`](mysqlshow.html#option_mysqlshow_host),
  `-h host_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>7

  Connect to the MySQL server on the given host.

* [`--keys`](mysqlshow.html#option_mysqlshow_keys),
  `-k`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>8

  Show table indexes.

* [`--login-path=name`](mysqlshow.html#option_mysqlshow_login-path)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>9

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

* [`--no-defaults`](mysqlshow.html#option_mysqlshow_no-defaults)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>0

  Do not read any option files. If program startup fails due
  to reading unknown options from an option file,
  [`--no-defaults`](mysqlshow.html#option_mysqlshow_no-defaults) can be used
  to prevent them from being read.

  The exception is that the `.mylogin.cnf`
  file is read in all cases, if it exists. This permits
  passwords to be specified in a safer way than on the command
  line even when
  [`--no-defaults`](mysqlshow.html#option_mysqlshow_no-defaults) is used. To
  create `.mylogin.cnf`, use the
  [**mysql\_config\_editor**](mysql-config-editor.html "6.6.7 mysql_config_editor — MySQL Configuration Utility") utility. See
  [Section 6.6.7, “mysql\_config\_editor — MySQL Configuration Utility”](mysql-config-editor.html "6.6.7 mysql_config_editor — MySQL Configuration Utility").

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--password[=password]`](mysqlshow.html#option_mysqlshow_password),
  `-p[password]`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>1

  The password of the MySQL account used for connecting to the
  server. The password value is optional. If not given,
  [**mysqlshow**](mysqlshow.html "6.5.7 mysqlshow — Display Database, Table, and Column Information") prompts for one. If given,
  there must be *no space* between
  [`--password=`](mysqlshow.html#option_mysqlshow_password) or
  `-p` and the password following it. If no
  password option is specified, the default is to send no
  password.

  Specifying a password on the command line should be
  considered insecure. To avoid giving the password on the
  command line, use an option file. See
  [Section 8.1.2.1, “End-User Guidelines for Password Security”](password-security-user.html "8.1.2.1 End-User Guidelines for Password Security").

  To explicitly specify that there is no password and that
  [**mysqlshow**](mysqlshow.html "6.5.7 mysqlshow — Display Database, Table, and Column Information") should not prompt for one, use
  the
  [`--skip-password`](mysqlshow.html#option_mysqlshow_password)
  option.

* [`--password1[=pass_val]`](mysqlshow.html#option_mysqlshow_password1)

  The password for multifactor authentication factor 1 of the
  MySQL account used for connecting to the server. The
  password value is optional. If not given,
  [**mysqlshow**](mysqlshow.html "6.5.7 mysqlshow — Display Database, Table, and Column Information") prompts for one. If given,
  there must be *no space* between
  [`--password1=`](mysqlshow.html#option_mysqlshow_password1) and the
  password following it. If no password option is specified,
  the default is to send no password.

  Specifying a password on the command line should be
  considered insecure. To avoid giving the password on the
  command line, use an option file. See
  [Section 8.1.2.1, “End-User Guidelines for Password Security”](password-security-user.html "8.1.2.1 End-User Guidelines for Password Security").

  To explicitly specify that there is no password and that
  [**mysqlshow**](mysqlshow.html "6.5.7 mysqlshow — Display Database, Table, and Column Information") should not prompt for one, use
  the
  [`--skip-password1`](mysqlshow.html#option_mysqlshow_password1)
  option.

  [`--password1`](mysqlshow.html#option_mysqlshow_password1) and
  [`--password`](mysqlshow.html#option_mysqlshow_password) are synonymous,
  as are
  [`--skip-password1`](mysqlshow.html#option_mysqlshow_password1)
  and
  [`--skip-password`](mysqlshow.html#option_mysqlshow_password).

* [`--password2[=pass_val]`](mysqlshow.html#option_mysqlshow_password2)

  The password for multifactor authentication factor 2 of the
  MySQL account used for connecting to the server. The
  semantics of this option are similar to the semantics for
  [`--password1`](mysqlshow.html#option_mysqlshow_password1); see the
  description of that option for details.

* [`--password3[=pass_val]`](mysqlshow.html#option_mysqlshow_password3)

  The password for multifactor authentication factor 3 of the
  MySQL account used for connecting to the server. The
  semantics of this option are similar to the semantics for
  [`--password1`](mysqlshow.html#option_mysqlshow_password1); see the
  description of that option for details.

* [`--pipe`](mysqlshow.html#option_mysqlshow_pipe),
  `-W`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>2

  On Windows, connect to the server using a named pipe. This
  option applies only if the server was started with the
  [`named_pipe`](server-system-variables.html#sysvar_named_pipe) system variable
  enabled to support named-pipe connections. In addition, the
  user making the connection must be a member of the Windows
  group specified by the
  [`named_pipe_full_access_group`](server-system-variables.html#sysvar_named_pipe_full_access_group)
  system variable.

* [`--plugin-dir=dir_name`](mysqlshow.html#option_mysqlshow_plugin-dir)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>3

  The directory in which to look for plugins. Specify this
  option if the
  [`--default-auth`](mysqlshow.html#option_mysqlshow_default-auth) option is
  used to specify an authentication plugin but
  [**mysqlshow**](mysqlshow.html "6.5.7 mysqlshow — Display Database, Table, and Column Information") does not find it. See
  [Section 8.2.17, “Pluggable Authentication”](pluggable-authentication.html "8.2.17 Pluggable Authentication").

* [`--port=port_num`](mysqlshow.html#option_mysqlshow_port),
  `-P port_num`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>4

  For TCP/IP connections, the port number to use.

* [`--print-defaults`](mysqlshow.html#option_mysqlshow_print-defaults)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>5

  Print the program name and all options that it gets from
  option files.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--protocol={TCP|SOCKET|PIPE|MEMORY}`](mysqlshow.html#option_mysqlshow_protocol)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>6

  The transport protocol to use for connecting to the server.
  It is useful when the other connection parameters normally
  result in use of a protocol other than the one you want. For
  details on the permissible values, see
  [Section 6.2.7, “Connection Transport Protocols”](transport-protocols.html "6.2.7 Connection Transport Protocols").

* [`--server-public-key-path=file_name`](mysqlshow.html#option_mysqlshow_server-public-key-path)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>7

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
  [`--server-public-key-path=file_name`](mysqlshow.html#option_mysqlshow_server-public-key-path)
  is given and specifies a valid public key file, it takes
  precedence over
  [`--get-server-public-key`](mysqlshow.html#option_mysqlshow_get-server-public-key).

  For `sha256_password`, this option applies
  only if MySQL was built using OpenSSL.

  For information about the `sha256_password`
  and `caching_sha2_password` plugins, see
  [Section 8.4.1.3, “SHA-256 Pluggable Authentication”](sha256-pluggable-authentication.html "8.4.1.3 SHA-256 Pluggable Authentication"), and
  [Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”](caching-sha2-pluggable-authentication.html "8.4.1.2 Caching SHA-2 Pluggable Authentication").

* [`--shared-memory-base-name=name`](mysqlshow.html#option_mysqlshow_shared-memory-base-name)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>8

  On Windows, the shared-memory name to use for connections
  made using shared memory to a local server. The default
  value is `MYSQL`. The shared-memory name is
  case-sensitive.

  This option applies only if the server was started with the
  [`shared_memory`](server-system-variables.html#sysvar_shared_memory) system
  variable enabled to support shared-memory connections.

* [`--show-table-type`](mysqlshow.html#option_mysqlshow_show-table-type),
  `-t`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>9

  Show a column indicating the table type, as in
  [`SHOW FULL
  TABLES`](show-tables.html "15.7.7.39 SHOW TABLES Statement"). The type is `BASE TABLE`
  or `VIEW`.

* [`--socket=path`](mysqlshow.html#option_mysqlshow_socket),
  `-S path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>0

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

* [`--ssl-fips-mode={OFF|ON|STRICT}`](mysqlshow.html#option_mysqlshow_ssl-fips-mode)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>1

  Controls whether to enable FIPS mode on the client side. The
  [`--ssl-fips-mode`](mysqlshow.html#option_mysqlshow_ssl-fips-mode) option
  differs from other
  `--ssl-xxx`
  options in that it is not used to establish encrypted
  connections, but rather to affect which cryptographic
  operations to permit. See [Section 8.8, “FIPS Support”](fips-mode.html "8.8 FIPS Support").

  These [`--ssl-fips-mode`](mysqlshow.html#option_mysqlshow_ssl-fips-mode)
  values are permitted:

  + `OFF`: Disable FIPS mode.
  + `ON`: Enable FIPS mode.
  + `STRICT`: Enable “strict”
    FIPS mode.

  Note

  If the OpenSSL FIPS Object Module is not available, the
  only permitted value for
  [`--ssl-fips-mode`](mysqlshow.html#option_mysqlshow_ssl-fips-mode) is
  `OFF`. In this case, setting
  [`--ssl-fips-mode`](mysqlshow.html#option_mysqlshow_ssl-fips-mode) to
  `ON` or `STRICT` causes
  the client to produce a warning at startup and to operate
  in non-FIPS mode.

  As of MySQL 8.0.34, this option is deprecated. Expect it to
  be removed in a future version of MySQL.

* [`--status`](mysqlshow.html#option_mysqlshow_status),
  `-i`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>2

  Display extra information about each table.

* [`--tls-ciphersuites=ciphersuite_list`](mysqlshow.html#option_mysqlshow_tls-ciphersuites)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>3

  The permissible ciphersuites for encrypted connections that
  use TLSv1.3. The value is a list of one or more
  colon-separated ciphersuite names. The ciphersuites that can
  be named for this option depend on the SSL library used to
  compile MySQL. For details, see
  [Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "8.3.2 Encrypted Connection TLS Protocols and Ciphers").

  This option was added in MySQL 8.0.16.

* [`--tls-version=protocol_list`](mysqlshow.html#option_mysqlshow_tls-version)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>4

  The permissible TLS protocols for encrypted connections. The
  value is a list of one or more comma-separated protocol
  names. The protocols that can be named for this option
  depend on the SSL library used to compile MySQL. For
  details, see
  [Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "8.3.2 Encrypted Connection TLS Protocols and Ciphers").

* [`--user=user_name`](mysqlshow.html#option_mysqlshow_user),
  `-u user_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>5

  The user name of the MySQL account to use for connecting to
  the server.

* [`--verbose`](mysqlshow.html#option_mysqlshow_verbose),
  `-v`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>6

  Verbose mode. Print more information about what the program
  does. This option can be used multiple times to increase the
  amount of information.

* [`--version`](mysqlshow.html#option_mysqlshow_version),
  `-V`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>7

  Display version information and exit.

* [`--zstd-compression-level=level`](mysqlshow.html#option_mysqlshow_zstd-compression-level)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>8

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