### 6.5.3 mysqlcheck — A Table Maintenance Program

The  **mysqlcheck** client performs table maintenance: It checks, repairs, optimizes, or analyzes tables.

Each table is locked and therefore unavailable to other sessions while it is being processed, although for check operations, the table is locked with a `READ` lock only (see Section 15.3.6, “LOCK TABLES and UNLOCK TABLES Statements”, for more information about `READ` and `WRITE` locks). Table maintenance operations can be time-consuming, particularly for large tables. If you use the `--databases` or `--all-databases` option to process all tables in one or more databases, an invocation of **mysqlcheck** might take a long time. (This is also true for the MySQL upgrade procedure if it determines that table checking is needed because it processes tables the same way.)

 **mysqlcheck** must be used when the **mysqld** server is running, which means that you do not have to stop the server to perform table maintenance.

 **mysqlcheck** uses the SQL statements `CHECK TABLE`, `REPAIR TABLE`, `ANALYZE TABLE`, and `OPTIMIZE TABLE` in a convenient way for the user. It determines which statements to use for the operation you want to perform, and then sends the statements to the server to be executed. For details about which storage engines each statement works with, see the descriptions for those statements in Section 15.7.3, “Table Maintenance Statements”.

All storage engines do not necessarily support all four maintenance operations. In such cases, an error message is displayed. For example, if `test.t` is an `MEMORY` table, an attempt to check it produces this result:

```
$> mysqlcheck test t
test.t
note     : The storage engine for the table doesn't support check
```

If  **mysqlcheck** is unable to repair a table, see  Section 3.14, “Rebuilding or Repairing Tables or Indexes” for manual table repair strategies. This is the case, for example, for `InnoDB` tables, which can be checked with `CHECK TABLE`, but not repaired with  `REPAIR TABLE`.

Caution

It is best to make a backup of a table before performing a table repair operation; under some circumstances the operation might cause data loss. Possible causes include but are not limited to file system errors.

There are three general ways to invoke **mysqlcheck**:

```
mysqlcheck [options] db_name [tbl_name ...]
mysqlcheck [options] --databases db_name ...
mysqlcheck [options] --all-databases
```

If you do not name any tables following *`db_name`* or if you use the `--databases` or `--all-databases` option, entire databases are checked.

 **mysqlcheck** has a special feature compared to other client programs. The default behavior of checking tables ( `--check`) can be changed by renaming the binary. If you want to have a tool that repairs tables by default, you should just make a copy of **mysqlcheck** named **mysqlrepair**, or make a symbolic link to **mysqlcheck** named **mysqlrepair**. If you invoke **mysqlrepair**, it repairs tables.

The names shown in the following table can be used to change **mysqlcheck** default behavior.

<table><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>Command</th> <th>Meaning</th> </tr></thead><tbody><tr> <td><span><strong>mysqlrepair</strong></span></td> <td>The default option is <code class="option">--repair</code></td> </tr><tr> <td><span><strong>mysqlanalyze</strong></span></td> <td>The default option is <code class="option">--analyze</code></td> </tr><tr> <td><span><strong>mysqloptimize</strong></span></td> <td>The default option is <code class="option">--optimize</code></td> </tr></tbody></table>

 **mysqlcheck** supports the following options, which can be specified on the command line or in the `[mysqlcheck]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see  Section 6.2.2.2, “Using Option Files”.

**Table 6.12 mysqlcheck Options**

<table><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Option Name</th> <th>Description</th> </tr></thead><tbody><tr><td>--all-databases</td> <td>Check all tables in all databases</td> </tr><tr><td>--all-in-1</td> <td>Execute a single statement for each database that names all the tables from that database</td> </tr><tr><td>--analyze</td> <td>Analyze the tables</td> </tr><tr><td>--auto-repair</td> <td>If a checked table is corrupted, automatically fix it</td> </tr><tr><td>--bind-address</td> <td>Use specified network interface to connect to MySQL Server</td> </tr><tr><td>--character-sets-dir</td> <td>Directory where character sets are installed</td> </tr><tr><td>--check</td> <td>Check the tables for errors</td> </tr><tr><td>--check-only-changed</td> <td>Check only tables that have changed since the last check</td> </tr><tr><td>--check-upgrade</td> <td>Invoke CHECK TABLE with the FOR UPGRADE option</td> </tr><tr><td>--compress</td> <td>Compress all information sent between client and server</td> </tr><tr><td>--compression-algorithms</td> <td>Permitted compression algorithms for connections to server</td> </tr><tr><td>--databases</td> <td>Interpret all arguments as database names</td> </tr><tr><td>--debug</td> <td>Write debugging log</td> </tr><tr><td>--debug-check</td> <td>Print debugging information when program exits</td> </tr><tr><td>--debug-info</td> <td>Print debugging information, memory, and CPU statistics when program exits</td> </tr><tr><td>--default-auth</td> <td>Authentication plugin to use</td> </tr><tr><td>--default-character-set</td> <td>Specify default character set</td> </tr><tr><td>--defaults-extra-file</td> <td>Read named option file in addition to usual option files</td> </tr><tr><td>--defaults-file</td> <td>Read only named option file</td> </tr><tr><td>--defaults-group-suffix</td> <td>Option group suffix value</td> </tr><tr><td>--enable-cleartext-plugin</td> <td>Enable cleartext authentication plugin</td> </tr><tr><td>--extended</td> <td>Check and repair tables</td> </tr><tr><td>--fast</td> <td>Check only tables that have not been closed properly</td> </tr><tr><td>--force</td> <td>Continue even if an SQL error occurs</td> </tr><tr><td>--get-server-public-key</td> <td>Request RSA public key from server</td> </tr><tr><td>--help</td> <td>Display help message and exit</td> </tr><tr><td>--host</td> <td>Host on which MySQL server is located</td> </tr><tr><td>--login-path</td> <td>Read login path options from .mylogin.cnf</td> </tr><tr><td>--medium-check</td> <td>Do a check that is faster than an --extended operation</td> </tr><tr><td>--no-defaults</td> <td>Read no option files</td> </tr><tr><td>--no-login-paths</td> <td>Do not read login paths from the login path file</td> </tr><tr><td>--optimize</td> <td>Optimize the tables</td> </tr><tr><td>--password</td> <td>Password to use when connecting to server</td> </tr><tr><td>--password1</td> <td>First multifactor authentication password to use when connecting to server</td> </tr><tr><td>--password2</td> <td>Second multifactor authentication password to use when connecting to server</td> </tr><tr><td>--password3</td> <td>Third multifactor authentication password to use when connecting to server</td> </tr><tr><td>--pipe</td> <td>Connect to server using named pipe (Windows only)</td> </tr><tr><td>--plugin-dir</td> <td>Directory where plugins are installed</td> </tr><tr><td>--port</td> <td>TCP/IP port number for connection</td> </tr><tr><td>--print-defaults</td> <td>Print default options</td> </tr><tr><td>--protocol</td> <td>Transport protocol to use</td> </tr><tr><td>--quick</td> <td>The fastest method of checking</td> </tr><tr><td>--repair</td> <td>Perform a repair that can fix almost anything except unique keys that are not unique</td> </tr><tr><td>--server-public-key-path</td> <td>Path name to file containing RSA public key</td> </tr><tr><td>--shared-memory-base-name</td> <td>Shared-memory name for shared-memory connections (Windows only)</td> </tr><tr><td>--silent</td> <td>Silent mode</td> </tr><tr><td>--skip-database</td> <td>Omit this database from performed operations</td> </tr><tr><td>--socket</td> <td>Unix socket file or Windows named pipe to use</td> </tr><tr><td>--ssl-ca</td> <td>File that contains list of trusted SSL Certificate Authorities</td> </tr><tr><td>--ssl-capath</td> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> </tr><tr><td>--ssl-cert</td> <td>File that contains X.509 certificate</td> </tr><tr><td>--ssl-cipher</td> <td>Permissible ciphers for connection encryption</td> </tr><tr><td>--ssl-crl</td> <td>File that contains certificate revocation lists</td> </tr><tr><td>--ssl-crlpath</td> <td>Directory that contains certificate revocation-list files</td> </tr><tr><td>--ssl-fips-mode</td> <td>Whether to enable FIPS mode on client side</td> </tr><tr><td>--ssl-key</td> <td>File that contains X.509 key</td> </tr><tr><td>--ssl-mode</td> <td>Desired security state of connection to server</td> </tr><tr><td>--ssl-session-data</td> <td>File that contains SSL session data</td> </tr><tr><td>--ssl-session-data-continue-on-failed-reuse</td> <td>Whether to establish connections if session reuse fails</td> </tr><tr><td>--tables</td> <td>Overrides the --databases or -B option</td> </tr><tr><td>--tls-ciphersuites</td> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> </tr><tr><td>--tls-sni-servername</td> <td>Server name supplied by the client</td> </tr><tr><td>--tls-version</td> <td>Permissible TLS protocols for encrypted connections</td> </tr><tr><td>--use-frm</td> <td>For repair operations on MyISAM tables</td> </tr><tr><td>--user</td> <td>MySQL user name to use when connecting to server</td> </tr><tr><td>--verbose</td> <td>Verbose mode</td> </tr><tr><td>--version</td> <td>Display version information and exit</td> </tr><tr><td>--write-binlog</td> <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td> </tr><tr><td>--zstd-compression-level</td> <td>Compression level for connections to server that use zstd compression</td> </tr></tbody></table>

*  `--help`, `-?`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.
*  `--all-databases`, `-A`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  Check all tables in all databases. This is the same as using the  `--databases` option and naming all the databases on the command line, except that the `INFORMATION_SCHEMA` and `performance_schema` databases are not checked. They can be checked by explicitly naming them with the  `--databases` option.
*  `--all-in-1`, `-1`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>

  Instead of issuing a statement for each table, execute a single statement for each database that names all the tables from that database to be processed.
*  `--analyze`, `-a`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>

  Analyze the tables.
*  `--auto-repair`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-repair</code></td> </tr></tbody></table>

  If a checked table is corrupted, automatically fix it. Any necessary repairs are done after all tables have been checked.
*  `--bind-address=ip_address`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On a computer having multiple network interfaces, use this option to select which interface to use for connecting to the MySQL server.
*  `--character-sets-dir=dir_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The directory where character sets are installed. See Section 12.15, “Character Set Configuration”.
*  `--check`, `-c`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--check</code></td> </tr></tbody></table>

  Check the tables for errors. This is the default operation.
*  `--check-only-changed`, `-C`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--check-only-changed</code></td> </tr></tbody></table>

  Check only tables that have changed since the last check or that have not been closed properly.
*  `--check-upgrade`, `-g`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--check-upgrade</code></td> </tr></tbody></table>

  Invoke  `CHECK TABLE` with the `FOR UPGRADE` option to check tables for incompatibilities with the current version of the server.
*  `--compress`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compress all information sent between the client and the server if possible. See Section 6.2.8, “Connection Compression Control”.

  This option is deprecated. Expect it to be removed in a future version of MySQL. See Configuring Legacy Connection Compression.
*  `--compression-algorithms=value`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>

  The permitted compression algorithms for connections to the server. The available algorithms are the same as for the `protocol_compression_algorithms` system variable. The default value is `uncompressed`.

  For more information, see Section 6.2.8, “Connection Compression Control”.
*  `--databases`, `-B`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--databases</code></td> </tr></tbody></table>

  Process all tables in the named databases. Normally, **mysqlcheck** treats the first name argument on the command line as a database name and any following names as table names. With this option, it treats all name arguments as database names.
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

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysqlcheck** normally reads the `[client]` and `[mysqlcheck]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysqlcheck** also reads the `[client_other]` and `[mysqlcheck_other]` groups.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--extended`, `-e`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--extended</code></td> </tr></tbody></table>

  If you are using this option to check tables, it ensures that they are 100% consistent but takes a long time.

  If you are using this option to repair tables, it runs an extended repair that may not only take a long time to execute, but may produce a lot of garbage rows also!
*  `--default-auth=plugin`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  A hint about which client-side authentication plugin to use. See  Section 8.2.17, “Pluggable Authentication”.
*  `--enable-cleartext-plugin`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Enable the `mysql_clear_password` cleartext authentication plugin. (See Section 8.4.1.4, “Client-Side Cleartext Pluggable Authentication”.)
*  `--fast`, `-F`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--fast</code></td> </tr></tbody></table>

  Check only tables that have not been closed properly.
*  `--force`, `-f`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--force</code></td> </tr></tbody></table>

  Continue even if an SQL error occurs.
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
*  `--medium-check`, `-m`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--medium-check</code></td> </tr></tbody></table>

  Do a check that is faster than an `--extended` operation. This finds only 99.99% of all errors, which should be good enough in most cases.
*  `--no-defaults`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql\_config\_editor** utility. See Section 6.6.7, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--optimize`, `-o`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--optimize</code></td> </tr></tbody></table>

  Optimize the tables.
*  `--password[=password]`, `-p[password]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqlcheck** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqlcheck** should not prompt for one, use the `--skip-password` option.
*  `--password1[=pass_val]`

  The password for multifactor authentication factor 1 of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqlcheck** prompts for one. If given, there must be *no space* between `--password1=` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqlcheck** should not prompt for one, use the `--skip-password1` option.

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

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysqlcheck** does not find it. See Section 8.2.17, “Pluggable Authentication”.
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
*  `--quick`, `-q`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--quick</code></td> </tr></tbody></table>

  If you are using this option to check tables, it prevents the check from scanning the rows to check for incorrect links. This is the fastest check method.

  If you are using this option to repair tables, it tries to repair only the index tree. This is the fastest repair method.
*  `--repair`, `-r`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--repair</code></td> </tr></tbody></table>

  Perform a repair that can fix almost anything except unique keys that are not unique.
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
*  `--silent`, `-s`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--silent</code></td> </tr></tbody></table>

  Silent mode. Print only error messages.
*  `--skip-database=db_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--skip-database=db_name</code></td> </tr></tbody></table>

  Do not include the named database (case-sensitive) in the operations performed by  **mysqlcheck**.
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
*  `--tables`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--tables</code></td> </tr></tbody></table>

  Override the  `--databases` or `-B` option. All name arguments following the option are regarded as table names.
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
*  `--use-frm`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--use-frm</code></td> </tr></tbody></table>

  For repair operations on `MyISAM` tables, get the table structure from the data dictionary so that the table can be repaired even if the `.MYI` header is corrupted.
*  `--user=user_name`, `-u user_name`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--user=user_name,</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The user name of the MySQL account to use for connecting to the server.
*  `--verbose`, `-v`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Verbose mode. Print information about the various stages of program operation.
*  `--version`, `-V`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--version</code></td> </tr></tbody></table>

  Display version information and exit.
*  `--write-binlog`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--write-binlog</code></td> </tr></tbody></table>

  This option is enabled by default, so that `ANALYZE TABLE`, `OPTIMIZE TABLE`, and `REPAIR TABLE` statements generated by  **mysqlcheck** are written to the binary log. Use `--skip-write-binlog` to cause `NO_WRITE_TO_BINLOG` to be added to the statements so that they are not logged. Use the `--skip-write-binlog` when these statements should not be sent to replicas or run when using the binary logs for recovery from backup.
*  `--zstd-compression-level=level`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--zstd-compression-level=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr></tbody></table>

  The compression level to use for connections to the server that use the `zstd` compression algorithm. The permitted levels are from 1 to 22, with larger values indicating increasing levels of compression. The default `zstd` compression level is 3. The compression level setting has no effect on connections that do not use `zstd` compression.

  For more information, see Section 6.2.8, “Connection Compression Control”.
