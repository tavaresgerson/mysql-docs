### 6.5.6 mysqlshow — Display Database, Table, and Column Information

The  **mysqlshow** client can be used to quickly see which databases exist, their tables, or a table's columns or indexes.

 **mysqlshow** provides a command-line interface to several SQL  `SHOW` statements. See  Section 15.7.7, “SHOW Statements”. The same information can be obtained by using those statements directly. For example, you can issue them from the  **mysql** client program.

Invoke  **mysqlshow** like this:

```
mysqlshow [options] [db_name [tbl_name [col_name]]]
```

* If no database is given, a list of database names is shown.
* If no table is given, all matching tables in the database are shown.
* If no column is given, all matching columns and column types in the table are shown.

The output displays only the names of those databases, tables, or columns for which you have some privileges.

If the last argument contains shell or SQL wildcard characters (`*`, `?`, `%`, or `_`), only those names that are matched by the wildcard are shown. If a database name contains any underscores, those should be escaped with a backslash (some Unix shells require two) to get a list of the proper tables or columns. `*` and `?` characters are converted into SQL `%` and `_` wildcard characters. This might cause some confusion when you try to display the columns for a table with a `_` in the name, because in this case,  **mysqlshow** shows you only the table names that match the pattern. This is easily fixed by adding an extra `%` last on the command line as a separate argument.

 **mysqlshow** supports the following options, which can be specified on the command line or in the `[mysqlshow]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see  Section 6.2.2.2, “Using Option Files”.

**Table 6.15 mysqlshow Options**

<table><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Option Name</th> <th>Description</th> </tr></thead><tbody><tr><td>--bind-address</td> <td>Use specified network interface to connect to MySQL Server</td> </tr><tr><td>--character-sets-dir</td> <td>Directory where character sets can be found</td> </tr><tr><td>--compress</td> <td>Compress all information sent between client and server</td> </tr><tr><td>--compression-algorithms</td> <td>Permitted compression algorithms for connections to server</td> </tr><tr><td>--count</td> <td>Show the number of rows per table</td> </tr><tr><td>--debug</td> <td>Write debugging log</td> </tr><tr><td>--debug-check</td> <td>Print debugging information when program exits</td> </tr><tr><td>--debug-info</td> <td>Print debugging information, memory, and CPU statistics when program exits</td> </tr><tr><td>--default-auth</td> <td>Authentication plugin to use</td> </tr><tr><td>--default-character-set</td> <td>Specify default character set</td> </tr><tr><td>--defaults-extra-file</td> <td>Read named option file in addition to usual option files</td> </tr><tr><td>--defaults-file</td> <td>Read only named option file</td> </tr><tr><td>--defaults-group-suffix</td> <td>Option group suffix value</td> </tr><tr><td>--enable-cleartext-plugin</td> <td>Enable cleartext authentication plugin</td> </tr><tr><td>--get-server-public-key</td> <td>Request RSA public key from server</td> </tr><tr><td>--help</td> <td>Display help message and exit</td> </tr><tr><td>--host</td> <td>Host on which MySQL server is located</td> </tr><tr><td>--keys</td> <td>Show table indexes</td> </tr><tr><td>--login-path</td> <td>Read login path options from .mylogin.cnf</td> </tr><tr><td>--no-defaults</td> <td>Read no option files</td> </tr><tr><td>--no-login-paths</td> <td>Do not read login paths from the login path file</td> </tr><tr><td>--password</td> <td>Password to use when connecting to server</td> </tr><tr><td>--password1</td> <td>First multifactor authentication password to use when connecting to server</td> </tr><tr><td>--password2</td> <td>Second multifactor authentication password to use when connecting to server</td> </tr><tr><td>--password3</td> <td>Third multifactor authentication password to use when connecting to server</td> </tr><tr><td>--pipe</td> <td>Connect to server using named pipe (Windows only)</td> </tr><tr><td>--plugin-dir</td> <td>Directory where plugins are installed</td> </tr><tr><td>--port</td> <td>TCP/IP port number for connection</td> </tr><tr><td>--print-defaults</td> <td>Print default options</td> </tr><tr><td>--protocol</td> <td>Transport protocol to use</td> </tr><tr><td>--server-public-key-path</td> <td>Path name to file containing RSA public key</td> </tr><tr><td>--shared-memory-base-name</td> <td>Shared-memory name for shared-memory connections (Windows only)</td> </tr><tr><td>--show-table-type</td> <td>Show a column indicating the table type</td> </tr><tr><td>--socket</td> <td>Unix socket file or Windows named pipe to use</td> </tr><tr><td>--ssl-ca</td> <td>File that contains list of trusted SSL Certificate Authorities</td> </tr><tr><td>--ssl-capath</td> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> </tr><tr><td>--ssl-cert</td> <td>File that contains X.509 certificate</td> </tr><tr><td>--ssl-cipher</td> <td>Permissible ciphers for connection encryption</td> </tr><tr><td>--ssl-crl</td> <td>File that contains certificate revocation lists</td> </tr><tr><td>--ssl-crlpath</td> <td>Directory that contains certificate revocation-list files</td> </tr><tr><td>--ssl-fips-mode</td> <td>Whether to enable FIPS mode on client side</td> </tr><tr><td>--ssl-key</td> <td>File that contains X.509 key</td> </tr><tr><td>--ssl-mode</td> <td>Desired security state of connection to server</td> </tr><tr><td>--ssl-session-data</td> <td>File that contains SSL session data</td> </tr><tr><td>--ssl-session-data-continue-on-failed-reuse</td> <td>Whether to establish connections if session reuse fails</td> </tr><tr><td>--status</td> <td>Display extra information about each table</td> </tr><tr><td>--tls-ciphersuites</td> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> </tr><tr><td>--tls-sni-servername</td> <td>Server name supplied by the client</td> </tr><tr><td>--tls-version</td> <td>Permissible TLS protocols for encrypted connections</td> </tr><tr><td>--user</td> <td>MySQL user name to use when connecting to server</td> </tr><tr><td>--verbose</td> <td>Verbose mode</td> </tr><tr><td>--version</td> <td>Display version information and exit</td> </tr><tr><td>--zstd-compression-level</td> <td>Compression level for connections to server that use zstd compression</td> </tr></tbody></table>

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
*  `--count`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--count</code></td> </tr></tbody></table>

  Show the number of rows per table. This can be slow for non-`MyISAM` tables.
*  `--debug[=debug_options]`, `-# [debug_options]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:o</code></td> </tr></tbody></table>

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:o`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.
*  `--debug-check`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-check</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.
*  `--debug-info`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Print debugging information and memory and CPU usage statistics when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.
*  `--default-character-set=charset_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-character-set=charset_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Use *`charset_name`* as the default character set. See  Section 12.15, “Character Set Configuration”.
*  `--default-auth=plugin`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  A hint about which client-side authentication plugin to use. See  Section 8.2.17, “Pluggable Authentication”.
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

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysqlshow** normally reads the `[client]` and `[mysqlshow]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysqlshow** also reads the `[client_other]` and `[mysqlshow_other]` groups.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--enable-cleartext-plugin`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Enable the `mysql_clear_password` cleartext authentication plugin. (See Section 8.4.1.4, “Client-Side Cleartext Pluggable Authentication”.)
*  `--get-server-public-key`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>

  Request from the server the RSA public key that it uses for key pair-based password exchange. This option applies to clients that connect to the server using an account that authenticates with the `caching_sha2_password` authentication plugin. For connections by such accounts, the server does not send the public key to the client unless requested. The option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not needed, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the `caching_sha2_password` plugin, see Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.
*  `--host=host_name`, `-h host_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>

  Connect to the MySQL server on the given host.
*  `--keys`, `-k`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keys</code></td> </tr></tbody></table>

  Show table indexes.
*  `--login-path=name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql\_config\_editor** utility. See Section 6.6.7, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--no-login-paths`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--no-login-paths</code></td> </tr></tbody></table>

  Skips reading options from the login path file.

  See  `--login-path` for related information.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--no-defaults`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql\_config\_editor** utility. See Section 6.6.7, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--password[=password]`, `-p[password]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqlshow** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqlshow** should not prompt for one, use the `--skip-password` option.
*  `--password1[=pass_val]`

  The password for multifactor authentication factor 1 of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqlshow** prompts for one. If given, there must be *no space* between `--password1=` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqlshow** should not prompt for one, use the `--skip-password1` option.

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

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysqlshow** does not find it. See Section 8.2.17, “Pluggable Authentication”.
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
*  `--show-table-type`, `-t`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--show-table-type</code></td> </tr></tbody></table>

  Show a column indicating the table type, as in `SHOW FULL TABLES`. The type is `BASE TABLE` or `VIEW`.
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
  + `STRICT`: Enable “strict” FIPS mode. 
  
  ::: info Note

  If the OpenSSL FIPS Object Module is not available, the only permitted value for `--ssl-fips-mode` is `OFF`. In this case, setting `--ssl-fips-mode` to `ON` or `STRICT` causes the client to produce a warning at startup and to operate in non-FIPS mode.

  :::

  This option is deprecated. Expect it to be removed in a future version of MySQL.
*  `--status`, `-i`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--status</code></td> </tr></tbody></table>

  Display extra information about each table.
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
*  `--verbose`, `-v`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Verbose mode. Print more information about what the program does. This option can be used multiple times to increase the amount of information.
*  `--version`, `-V`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--version</code></td> </tr></tbody></table>

  Display version information and exit.
*  `--zstd-compression-level=level`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--zstd-compression-level=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr></tbody></table>

  The compression level to use for connections to the server that use the `zstd` compression algorithm. The permitted levels are from 1 to 22, with larger values indicating increasing levels of compression. The default `zstd` compression level is 3. The compression level setting has no effect on connections that do not use `zstd` compression.

  For more information, see Section 6.2.8, “Connection Compression Control”.
