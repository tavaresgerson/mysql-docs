### 6.5.5 mysqlimport — A Data Import Program

The **mysqlimport** client provides a command-line interface to the `LOAD DATA` SQL statement. Most options to **mysqlimport** correspond directly to clauses of `LOAD DATA` syntax. See Section 15.2.9, “LOAD DATA Statement”.

Invoke **mysqlimport** like this:

```
mysqlimport [options] db_name textfile1 [textfile2 ...]
```

For each text file named on the command line, **mysqlimport** strips any extension from the file name and uses the result to determine the name of the table into which to import the file's contents. For example, files named `patient.txt`, `patient.text`, and `patient` all would be imported into a table named `patient`.

**mysqlimport** supports the following options, which can be specified on the command line or in the `[mysqlimport]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see Section 6.2.2.2, “Using Option Files”.

**Table 6.16 mysqlimport Options**

<table summary="Command-line options available for mysqlimport."><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th>--bind-address</th> <td>Use specified network interface to connect to MySQL Server</td> <td></td> <td></td> </tr><tr><th>--character-sets-dir</th> <td>Directory where character sets can be found</td> <td></td> <td></td> </tr><tr><th>--columns</th> <td>This option takes a comma-separated list of column names as its value</td> <td></td> <td></td> </tr><tr><th>--compress</th> <td>Compress all information sent between client and server</td> <td></td> <td>8.0.18</td> </tr><tr><th>--compression-algorithms</th> <td>Permitted compression algorithms for connections to server</td> <td>8.0.18</td> <td></td> </tr><tr><th>--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th>--debug-check</th> <td>Print debugging information when program exits</td> <td></td> <td></td> </tr><tr><th>--debug-info</th> <td>Print debugging information, memory, and CPU statistics when program exits</td> <td></td> <td></td> </tr><tr><th>--default-auth</th> <td>Authentication plugin to use</td> <td></td> <td></td> </tr><tr><th>--default-character-set</th> <td>Specify default character set</td> <td></td> <td></td> </tr><tr><th>--defaults-extra-file</th> <td>Read named option file in addition to usual option files</td> <td></td> <td></td> </tr><tr><th>--defaults-file</th> <td>Read only named option file</td> <td></td> <td></td> </tr><tr><th>--defaults-group-suffix</th> <td>Option group suffix value</td> <td></td> <td></td> </tr><tr><th>--delete</th> <td>Empty the table before importing the text file</td> <td></td> <td></td> </tr><tr><th>--enable-cleartext-plugin</th> <td>Enable cleartext authentication plugin</td> <td></td> <td></td> </tr><tr><th>--fields-enclosed-by</th> <td>This option has the same meaning as the corresponding clause for LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--fields-escaped-by</th> <td>This option has the same meaning as the corresponding clause for LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--fields-optionally-enclosed-by</th> <td>This option has the same meaning as the corresponding clause for LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--fields-terminated-by</th> <td>This option has the same meaning as the corresponding clause for LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--force</th> <td>Continue even if an SQL error occurs</td> <td></td> <td></td> </tr><tr><th>--get-server-public-key</th> <td>Request RSA public key from server</td> <td></td> <td></td> </tr><tr><th>--help</th> <td>Display help message and exit</td> <td></td> <td></td> </tr><tr><th>--host</th> <td>Host on which MySQL server is located</td> <td></td> <td></td> </tr><tr><th>--ignore</th> <td>See the description for the --replace option</td> <td></td> <td></td> </tr><tr><th>--ignore-lines</th> <td>Ignore the first N lines of the data file</td> <td></td> <td></td> </tr><tr><th>--lines-terminated-by</th> <td>This option has the same meaning as the corresponding clause for LOAD DATA</td> <td></td> <td></td> </tr><tr><th>--local</th> <td>Read input files locally from the client host</td> <td></td> <td></td> </tr><tr><th>--lock-tables</th> <td>Lock all tables for writing before processing any text files</td> <td></td> <td></td> </tr><tr><th>--login-path</th> <td>Read login path options from .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th>--low-priority</th> <td>Use LOW_PRIORITY when loading the table</td> <td></td> <td></td> </tr><tr><th>--no-defaults</th> <td>Read no option files</td> <td></td> <td></td> </tr><tr><th>--password</th> <td>Password to use when connecting to server</td> <td></td> <td></td> </tr><tr><th>--password1</th> <td>First multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th>--password2</th> <td>Second multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th>--password3</th> <td>Third multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th>--pipe</th> <td>Connect to server using named pipe (Windows only)</td> <td></td> <td></td> </tr><tr><th>--plugin-dir</th> <td>Directory where plugins are installed</td> <td></td> <td></td> </tr><tr><th>--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th>--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th>--protocol</th> <td>Transport protocol to use</td> <td></td> <td></td> </tr><tr><th>--replace</th> <td>The --replace and --ignore options control handling of input rows that duplicate existing rows on unique key values</td> <td></td> <td></td> </tr><tr><th>--server-public-key-path</th> <td>Path name to file containing RSA public key</td> <td></td> <td></td> </tr><tr><th>--shared-memory-base-name</th> <td>Shared-memory name for shared-memory connections (Windows only)</td> <td></td> <td></td> </tr><tr><th>--silent</th> <td>Produce output only when errors occur</td> <td></td> <td></td> </tr><tr><th>--socket</th> <td>Unix socket file or Windows named pipe to use</td> <td></td> <td></td> </tr><tr><th>--ssl-ca</th> <td>File that contains list of trusted SSL Certificate Authorities</td> <td></td> <td></td> </tr><tr><th>--ssl-capath</th> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> <td></td> <td></td> </tr><tr><th>--ssl-cert</th> <td>File that contains X.509 certificate</td> <td></td> <td></td> </tr><tr><th>--ssl-cipher</th> <td>Permissible ciphers for connection encryption</td> <td></td> <td></td> </tr><tr><th>--ssl-crl</th> <td>File that contains certificate revocation lists</td> <td></td> <td></td> </tr><tr><th>--ssl-crlpath</th> <td>Directory that contains certificate revocation-list files</td> <td></td> <td></td> </tr><tr><th>--ssl-fips-mode</th> <td>Whether to enable FIPS mode on client side</td> <td></td> <td>8.0.34</td> </tr><tr><th>--ssl-key</th> <td>File that contains X.509 key</td> <td></td> <td></td> </tr><tr><th>--ssl-mode</th> <td>Desired security state of connection to server</td> <td></td> <td></td> </tr><tr><th>--ssl-session-data</th> <td>File that contains SSL session data</td> <td>8.0.29</td> <td></td> </tr><tr><th>--ssl-session-data-continue-on-failed-reuse</th> <td>Whether to establish connections if session reuse fails</td> <td>8.0.29</td> <td></td> </tr><tr><th>--tls-ciphersuites</th> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> <td>8.0.16</td> <td></td> </tr><tr><th>--tls-version</th> <td>Permissible TLS protocols for encrypted connections</td> <td></td> <td></td> </tr><tr><th>--use-threads</th> <td>Number of threads for parallel file-loading</td> <td></td> <td></td> </tr><tr><th>--user</th> <td>MySQL user name to use when connecting to server</td> <td></td> <td></td> </tr><tr><th>--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th>--version</th> <td>Display version information and exit</td> <td></td> <td></td> </tr><tr><th>--zstd-compression-level</th> <td>Compression level for connections to server that use zstd compression</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

* `--help`, `-?`

  <table summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--bind-address=ip_address`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On a computer having multiple network interfaces, use this option to select which interface to use for connecting to the MySQL server.

* `--character-sets-dir=dir_name`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  The directory where character sets are installed. See Section 12.15, “Character Set Configuration”.

* `--columns=column_list`, `-c column_list`

  <table summary="Properties for columns"><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>

  This option takes a list of comma-separated column names as its value. The order of the column names indicates how to match data file columns with table columns.

* `--compress`, `-C`

  <table summary="Properties for compress"><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compress all information sent between the client and the server if possible. See Section 6.2.8, “Connection Compression Control”.

  As of MySQL 8.0.18, this option is deprecated. Expect it to be removed in a future version of MySQL. See Configuring Legacy Connection Compression.

* `--compression-algorithms=value`

  <table summary="Properties for compression-algorithms"><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>

  The permitted compression algorithms for connections to the server. The available algorithms are the same as for the `protocol_compression_algorithms` system variable. The default value is `uncompressed`.

  For more information, see Section 6.2.8, “Connection Compression Control”.

  This option was added in MySQL 8.0.18.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table summary="Properties for debug"><tbody><tr><th>Command-Line Format</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:o</code></td> </tr></tbody></table>

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:o`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-check`

  <table summary="Properties for debug-check"><tbody><tr><th>Command-Line Format</th> <td><code>--debug-check</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-info`

  <table summary="Properties for debug-info"><tbody><tr><th>Command-Line Format</th> <td><code>--debug-info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Print debugging information and memory and CPU usage statistics when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--default-character-set=charset_name`

  <table summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

  Use *`charset_name`* as the default character set. See Section 12.15, “Character Set Configuration”.

* `--default-auth=plugin`

  <table summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

  A hint about which client-side authentication plugin to use. See Section 8.2.17, “Pluggable Authentication”.

* `--defaults-extra-file=file_name`

  <table summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysqlimport** normally reads the `[client]` and `[mysqlimport]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysqlimport** also reads the `[client_other]` and `[mysqlimport_other]` groups.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--delete`, `-D`

  <table summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

  Empty the table before importing the text file.

* `--enable-cleartext-plugin`

  <table summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

  Enable the `mysql_clear_password` cleartext authentication plugin. (See Section 8.4.1.4, “Client-Side Cleartext Pluggable Authentication”.)

* `--fields-terminated-by=...`, `--fields-enclosed-by=...`, `--fields-optionally-enclosed-by=...`, `--fields-escaped-by=...`

  <table summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

  <table summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

  <table summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

  These options have the same meaning as the corresponding clauses for `LOAD DATA`. See Section 15.2.9, “LOAD DATA Statement”.

* `--force`, `-f`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

  Ignore errors. For example, if a table for a text file does not exist, continue processing any remaining files. Without `--force`, **mysqlimport** exits if a table does not exist.

* `--get-server-public-key`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

  Request from the server the public key required for RSA key pair-based password exchange. This option applies to clients that authenticate with the `caching_sha2_password` authentication plugin. For that plugin, the server does not send the public key unless requested. This option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the `caching_sha2_password` plugin, see Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.

* `--host=host_name`, `-h host_name`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

  Import data to the MySQL server on the given host. The default host is `localhost`.

* `--ignore`, `-i`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

  See the description for the `--replace` option.

* `--ignore-lines=N`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

  Ignore the first *`N`* lines of the data file.

* `--lines-terminated-by=...`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

  This option has the same meaning as the corresponding clause for `LOAD DATA`. For example, to import Windows files that have lines terminated with carriage return/linefeed pairs, use `--lines-terminated-by="\r\n"`. (You might have to double the backslashes, depending on the escaping conventions of your command interpreter.) See Section 15.2.9, “LOAD DATA Statement”.

* `--local`, `-L`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

  By default, files are read by the server on the server host. With this option, **mysqlimport** reads input files locally on the client host.

  Successful use of `LOCAL` load operations within **mysqlimport** also requires that the server permits local loading; see Section 8.1.6, “Security Considerations for LOAD DATA LOCAL”

* `--lock-tables`, `-l`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>8

  Lock *all* tables for writing before processing any text files. This ensures that all tables are synchronized on the server.

* `--login-path=name`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>9

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql_config_editor** utility. See Section 6.6.7, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--low-priority`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

  Use `LOW_PRIORITY` when loading the table. This affects only storage engines that use only table-level locking (such as `MyISAM`, `MEMORY`, and `MERGE`).

* `--no-defaults`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql_config_editor** utility. See Section 6.6.7, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--password[=password]`, `-p[password]`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqlimport** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqlimport** should not prompt for one, use the `--skip-password` option.

* `--password1[=pass_val]`

  The password for multifactor authentication factor 1 of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqlimport** prompts for one. If given, there must be *no space* between `--password1=` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqlimport** should not prompt for one, use the `--skip-password1` option.

  `--password1` and `--password` are synonymous, as are `--skip-password1` and `--skip-password`.

* `--password2[=pass_val]`

  The password for multifactor authentication factor 2 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.

* `--password3[=pass_val]`

  The password for multifactor authentication factor 3 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.

* `--pipe`, `-W`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

  On Windows, connect to the server using a named pipe. This option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--plugin-dir=dir_name`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysqlimport** does not find it. See Section 8.2.17, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>5

  For TCP/IP connections, the port number to use.

* `--print-defaults`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>6

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>7

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 6.2.7, “Connection Transport Protocols”.

* `--replace`, `-r`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>8

  The `--replace` and `--ignore` options control handling of input rows that duplicate existing rows on unique key values. If you specify `--replace`, new rows replace existing rows that have the same unique key value. If you specify `--ignore`, input rows that duplicate an existing row on a unique key value are skipped. If you do not specify either option, an error occurs when a duplicate key value is found, and the rest of the text file is ignored.

* `--server-public-key-path=file_name`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>9

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or `caching_sha2_password` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and `caching_sha2_password` plugins, see Section 8.4.1.3, “SHA-256 Pluggable Authentication”, and Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.

* `--shared-memory-base-name=name`

  <table summary="Properties for columns"><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>0

  On Windows, the shared-memory name to use for connections made using shared memory to a local server. The default value is `MYSQL`. The shared-memory name is case-sensitive.

  This option applies only if the server was started with the `shared_memory` system variable enabled to support shared-memory connections.

* `--silent`, `-s`

  <table summary="Properties for columns"><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>1

  Silent mode. Produce output only when errors occur.

* `--socket=path`, `-S path`

  <table summary="Properties for columns"><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>2

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table summary="Properties for columns"><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>3

  Controls whether to enable FIPS mode on the client side. The `--ssl-fips-mode` option differs from other `--ssl-xxx` options in that it is not used to establish encrypted connections, but rather to affect which cryptographic operations to permit. See Section 8.8, “FIPS Support”.

  These `--ssl-fips-mode` values are permitted:

  + `OFF`: Disable FIPS mode.
  + `ON`: Enable FIPS mode.
  + `STRICT`: Enable “strict” FIPS mode.

  Note

  If the OpenSSL FIPS Object Module is not available, the only permitted value for `--ssl-fips-mode` is `OFF`. In this case, setting `--ssl-fips-mode` to `ON` or `STRICT` causes the client to produce a warning at startup and to operate in non-FIPS mode.

  As of MySQL 8.0.34, this option is deprecated. Expect it to be removed in a future version of MySQL.

* `--tls-ciphersuites=ciphersuite_list`

  <table summary="Properties for columns"><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>4

  The permissible ciphersuites for encrypted connections that use TLSv1.3. The value is a list of one or more colon-separated ciphersuite names. The ciphersuites that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 8.0.16.

* `--tls-version=protocol_list`

  <table summary="Properties for columns"><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>5

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

* `--user=user_name`, `-u user_name`

  <table summary="Properties for columns"><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>6

  The user name of the MySQL account to use for connecting to the server.

* `--use-threads=N`

  <table summary="Properties for columns"><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>7

  Load files in parallel using *`N`* threads.

* `--verbose`, `-v`

  <table summary="Properties for columns"><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>8

  Verbose mode. Print more information about what the program does.

* `--version`, `-V`

  <table summary="Properties for columns"><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>9

  Display version information and exit.

* `--zstd-compression-level=level`

  <table summary="Properties for compress"><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

  The compression level to use for connections to the server that use the `zstd` compression algorithm. The permitted levels are from 1 to 22, with larger values indicating increasing levels of compression. The default `zstd` compression level is 3. The compression level setting has no effect on connections that do not use `zstd` compression.

  For more information, see Section 6.2.8, “Connection Compression Control”.

  This option was added in MySQL 8.0.18.

Here is a sample session that demonstrates use of **mysqlimport**:

```
$> mysql -e 'CREATE TABLE imptest(id INT, n VARCHAR(30))' test
$> ed
a
100     Max Sydow
101     Count Dracula
.
w imptest.txt
32
q
$> od -c imptest.txt
0000000   1   0   0  \t   M   a   x       S   y   d   o   w  \n   1   0
0000020   1  \t   C   o   u   n   t       D   r   a   c   u   l   a  \n
0000040
$> mysqlimport --local test imptest.txt
test.imptest: Records: 2  Deleted: 0  Skipped: 0  Warnings: 0
$> mysql -e 'SELECT * FROM imptest' test
+------+---------------+
| id   | n             |
+------+---------------+
|  100 | Max Sydow     |
|  101 | Count Dracula |
+------+---------------+
```
