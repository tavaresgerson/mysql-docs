### 6.5.5 `mysqlimport` — A Data Import Program

The `mysqlimport` client provides a command-line interface to the `LOAD DATA` SQL statement. Most options to `mysqlimport` correspond directly to clauses of `LOAD DATA` syntax. See Section 15.2.9, “LOAD DATA Statement”.

Invoke `mysqlimport` like this:

```
mysqlimport [options] db_name textfile1 [textfile2 ...]
```

For each text file named on the command line, `mysqlimport` strips any extension from the file name and uses the result to determine the name of the table into which to import the file's contents. For example, files named `patient.txt`, `patient.text`, and `patient` all would be imported into a table named `patient`.

`mysqlimport` supports the following options, which can be specified on the command line or in the `[mysqlimport]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see  Section 6.2.2.2, “Using Option Files”.

**Table 6.14 `mysqlimport` Options**

<table>
   <thead>
      <tr>
         <th>Option Name</th>
         <th>Description</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <td><code>--bind-address</code></td>
         <td>Use specified network interface to connect to MySQL Server</td>
      </tr>
      <tr>
         <td><code>--character-sets-dir</code></td>
         <td>Directory where character sets can be found</td>
      </tr>
      <tr>
         <td><code>--columns</code></td>
         <td>This option takes a comma-separated list of column names as its value</td>
      </tr>
      <tr>
         <td><code>--compress</code></td>
         <td>Compress all information sent between client and server</td>
      </tr>
      <tr>
         <td><code>--compression-algorithms</code></td>
         <td>Permitted compression algorithms for connections to server</td>
      </tr>
      <tr>
         <td><code>--debug</code></td>
         <td>Write debugging log</td>
      </tr>
      <tr>
         <td><code>--debug-check</code></td>
         <td>Print debugging information when program exits</td>
      </tr>
      <tr>
         <td><code>--debug-info</code></td>
         <td>Print debugging information, memory, and CPU statistics when program exits</td>
      </tr>
      <tr>
         <td><code>--default-auth</code></td>
         <td>Authentication plugin to use</td>
      </tr>
      <tr>
         <td><code>--default-character-set</code></td>
         <td>Specify default character set</td>
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
         <td><code>--defaults-group-suffix</code></td>
         <td>Option group suffix value</td>
      </tr>
      <tr>
         <td><code>--delete</code></td>
         <td>Empty the table before importing the text file</td>
      </tr>
      <tr>
         <td><code>--enable-cleartext-plugin</code></td>
         <td>Enable cleartext authentication plugin</td>
      </tr>
      <tr>
         <td><code>--fields-enclosed-by</code></td>
         <td>This option has the same meaning as the corresponding clause for <code>LOAD DATA</code></td>
      </tr>
      <tr>
         <td><code>--fields-escaped-by</code></td>
         <td>This option has the same meaning as the corresponding clause for <code>LOAD DATA</code></td>
      </tr>
      <tr>
         <td><code>--fields-optionally-enclosed-by</code></td>
         <td>This option has the same meaning as the corresponding clause for <code>LOAD DATA</code></td>
      </tr>
      <tr>
         <td><code>--fields-terminated-by</code></td>
         <td>This option has the same meaning as the corresponding clause for <code>LOAD DATA</code></td>
      </tr>
      <tr>
         <td><code>--force</code></td>
         <td>Continue even if an SQL error occurs</td>
      </tr>
      <tr>
         <td><code>--get-server-public-key</code></td>
         <td>Request RSA public key from server</td>
      </tr>
      <tr>
         <td><code>--help</code></td>
         <td>Display help message and exit</td>
      </tr>
      <tr>
         <td><code>--host</code></td>
         <td>Host on which MySQL server is located</td>
      </tr>
      <tr>
         <td><code>--ignore</code></td>
         <td>See the description for the <code>--replace</code> option</td>
      </tr>
      <tr>
         <td><code>--ignore-lines</code></td>
         <td>Ignore the first `N` lines of the data file</td>
      </tr>
      <tr>
         <td><code>--lines-terminated-by</code></td>
         <td>This option has the same meaning as the corresponding clause for <code>LOAD DATA</code></td>
      </tr>
      <tr>
         <td><code>--local</code></td>
         <td>Read input files locally from the client host</td>
      </tr>
      <tr>
         <td><code>--lock-tables</code></td>
         <td>Lock all tables for writing before processing any text files</td>
      </tr>
      <tr>
         <td><code>--login-path</code></td>
         <td>Read login path options from <code>.mylogin.cnf</code></td>
      </tr>
      <tr>
         <td><code>--low-priority</code></td>
         <td>Use <code>LOW_PRIORITY</code> when loading the table</td>
      </tr>
      <tr>
         <td><code>--no-defaults</code></td>
         <td>Read no option files</td>
      </tr>
      <tr>
         <td><code>--no-login-paths</code></td>
         <td>Do not read login paths from the login path file</td>
      </tr>
      <tr>
         <td><code>--password</code></td>
         <td>Password to use when connecting to server</td>
      </tr>
      <tr>
         <td><code>--password1</code></td>
         <td>First multifactor authentication password to use when connecting to server</td>
      </tr>
      <tr>
         <td><code>--password2</code></td>
         <td>Second multifactor authentication password to use when connecting to server</td>
      </tr>
      <tr>
         <td><code>--password3</code></td>
         <td>Third multifactor authentication password to use when connecting to server</td>
      </tr>
      <tr>
         <td><code>--pipe</code></td>
         <td>Connect to server using named pipe (Windows only)</td>
      </tr>
      <tr>
         <td><code>--plugin-dir</code></td>
         <td>Directory where plugins are installed</td>
      </tr>
      <tr>
         <td><code>--port</code></td>
         <td>TCP/IP port number for connection</td>
      </tr>
      <tr>
         <td><code>--print-defaults</code></td>
         <td>Print default options</td>
      </tr>
      <tr>
         <td><code>--protocol</code></td>
         <td>Transport protocol to use</td>
      </tr>
      <tr>
         <td><code>--replace</code></td>
         <td>The <code>--replace</code> and <code>--ignore</code> options control handling of input rows that duplicate existing rows on unique key values</td>
      </tr>
      <tr>
         <td><code>--server-public-key-path</code></td>
         <td>Path name to file containing RSA public key</td>
      </tr>
      <tr>
         <td><code>--shared-memory-base-name</code></td>
         <td>Shared-memory name for shared-memory connections (Windows only)</td>
      </tr>
      <tr>
         <td><code>--silent</code></td>
         <td>Produce output only when errors occur</td>
      </tr>
      <tr>
         <td><code>--socket</code></td>
         <td>Unix socket file or Windows named pipe to use</td>
      </tr>
      <tr>
         <td><code>--ssl-ca</code></td>
         <td>File that contains list of trusted SSL Certificate Authorities</td>
      </tr>
      <tr>
         <td><code>--ssl-capath</code></td>
         <td>Directory that contains trusted SSL Certificate Authority certificate files</td>
      </tr>
      <tr>
         <td><code>--ssl-cert</code></td>
         <td>File that contains X.509 certificate</td>
      </tr>
      <tr>
         <td><code>--ssl-cipher</code></td>
         <td>Permissible ciphers for connection encryption</td>
      </tr>
      <tr>
         <td><code>--ssl-crl</code></td>
         <td>File that contains certificate revocation lists</td>
      </tr>
      <tr>
         <td><code>--ssl-crlpath</code></td>
         <td>Directory that contains certificate revocation-list files</td>
      </tr>
      <tr>
         <td><code>--ssl-fips-mode</code></td>
         <td>Whether to enable FIPS mode on client side</td>
      </tr>
      <tr>
         <td><code>--ssl-key</code></td>
         <td>File that contains X.509 key</td>
      </tr>
      <tr>
         <td><code>--ssl-mode</code></td>
         <td>Desired security state of connection to server</td>
      </tr>
      <tr>
         <td><code>--ssl-session-data</code></td>
         <td>File that contains SSL session data</td>
      </tr>
      <tr>
         <td><code>--ssl-session-data-continue-on-failed-reuse</code></td>
         <td>Whether to establish connections if session reuse fails</td>
      </tr>
      <tr>
         <td><code>--tls-ciphersuites</code></td>
         <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td>
      </tr>
      <tr>
         <td><code>--tls-sni-servername</code></td>
         <td>Server name supplied by the client</td>
      </tr>
      <tr>
         <td><code>--tls-version</code></td>
         <td>Permissible TLS protocols for encrypted connections</td>
      </tr>
      <tr>
         <td><code>--use-threads</code></td>
         <td>Number of threads for parallel file-loading</td>
      </tr>
      <tr>
         <td><code>--user</code></td>
         <td>MySQL user name to use when connecting to server</td>
      </tr>
      <tr>
         <td><code>--verbose</code></td>
         <td>Verbose mode</td>
      </tr>
      <tr>
         <td><code>--version</code></td>
         <td>Display version information and exit</td>
      </tr>
      <tr>
         <td><code>--zstd-compression-level</code></td>
         <td>Compression level for connections to server that use <code>zstd</code> compression</td>
      </tr>
   </tbody>
</table>

*  `--help`, `-?`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.
*  `--bind-address=ip_address`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On a computer having multiple network interfaces, use this option to select which interface to use for connecting to the MySQL server.
*  `--character-sets-dir=dir_name`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  The directory where character sets are installed. See Section 12.15, “Character Set Configuration”.
*  `--columns=column_list`, `-c column_list`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>

  This option takes a list of comma-separated column names as its value. The order of the column names indicates how to match data file columns with table columns.
*  `--compress`, `-C`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compress all information sent between the client and the server if possible. See Section 6.2.8, “Connection Compression Control”.

  This option is deprecated. Expect it to be removed in a future version of MySQL. See Configuring Legacy Connection Compression.
*  `--compression-algorithms=value`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valid Values</th> <td><code>zlib</code><code>zstd</code><code>uncompressed</code></td> </tr></tbody></table>

  The permitted compression algorithms for connections to the server. The available algorithms are the same as for the `protocol_compression_algorithms` system variable. The default value is `uncompressed`.

  For more information, see Section 6.2.8, “Connection Compression Control”.
*  `--debug[=debug_options]`, `-# [debug_options]`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:o</code></td> </tr></tbody></table>

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:o`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.
*  `--debug-check`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--debug-check</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.
*  `--debug-info`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--debug-info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Print debugging information and memory and CPU usage statistics when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.
*  `--default-character-set=charset_name`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--default-character-set=charset_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Use `charset_name` as the default character set. See  Section 12.15, “Character Set Configuration”.
*  `--default-auth=plugin`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  A hint about which client-side authentication plugin to use. See  Section 8.2.17, “Pluggable Authentication”.
*  `--defaults-extra-file=file_name`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If `file_name` is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--defaults-file=file_name`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If `file_name` is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--defaults-group-suffix=str`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=str</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, `mysqlimport` normally reads the `[client]` and `[mysqlimport]` groups. If this option is given as `--defaults-group-suffix=_other`, `mysqlimport` also reads the `[client_other]` and `[mysqlimport_other]` groups.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--delete`, `-D`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--delete</code></td> </tr></tbody></table>

  Empty the table before importing the text file.
*  `--enable-cleartext-plugin`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Enable the `mysql_clear_password` cleartext authentication plugin. (See Section 8.4.1.4, “Client-Side Cleartext Pluggable Authentication”.)
*  `--fields-terminated-by=...`, `--fields-enclosed-by=...`, `--fields-optionally-enclosed-by=...`, `--fields-escaped-by=...`

<table>
   <tbody>
      <tr>
         <th>Command-Line Format</th>
         <td><code>--fields-terminated-by=string</code></td>
      </tr>
      <tr>
         <th>Type</th>
         <td><code>String</code></td>
      </tr>
   </tbody>
</table>
<table>
   <tbody>
      <tr>
         <th>Command-Line Format</th>
         <td><code>--fields-enclosed-by=string</code></td>
      </tr>
      <tr>
         <th>Type</th>
         <td><code>String</code></td>
      </tr>
   </tbody>
</table>
<table>
   <tbody>
      <tr>
         <th>Command-Line Format</th>
         <td><code>--fields-optionally-enclosed-by=string</code></td>
      </tr>
      <tr>
         <th>Type</th>
         <td><code>String</code></td>
      </tr>
   </tbody>
</table>
<table>
   <tbody>
      <tr>
         <th>Command-Line Format</th>
         <td><code>--fields-escaped-by</code></td>
      </tr>
      <tr>
         <th>Type</th>
         <td><code>String</code></td>
      </tr>
   </tbody>
</table>

  These options have the same meaning as the corresponding clauses for  `LOAD DATA`. See Section 15.2.9, “LOAD DATA Statement”.
*  `--force`, `-f`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--force</code></td> </tr></tbody></table>

  Ignore errors. For example, if a table for a text file does not exist, continue processing any remaining files. Without `--force`, `mysqlimport` exits if a table does not exist.
*  `--get-server-public-key`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>

  Request from the server the public key required for RSA key pair-based password exchange. This option applies to clients that authenticate with the `caching_sha2_password` authentication plugin. For that plugin, the server does not send the public key unless requested. This option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the `caching_sha2_password` plugin, see Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.
*  `--host=host_name`, `-h host_name`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--host=host_name</code></td> </tr><tr><th>Type</th> <td><code>String</code></td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>

  Import data to the MySQL server on the given host. The default host is `localhost`.
*  `--ignore`, `-i`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--ignore</code></td> </tr></tbody></table>

  See the description for the `--replace` option.
*  `--ignore-lines=N`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--ignore-lines=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  Ignore the first *`N`* lines of the data file.
*  `--lines-terminated-by=...`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--lines-terminated-by=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  This option has the same meaning as the corresponding clause for  `LOAD DATA`. For example, to import Windows files that have lines terminated with carriage return/linefeed pairs, use `--lines-terminated-by="\r\n"`. (You might have to double the backslashes, depending on the escaping conventions of your command interpreter.) See Section 15.2.9, “LOAD DATA Statement”.
*  `--local`, `-L`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--local</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  By default, files are read by the server on the server host. With this option,  `mysqlimport` reads input files locally on the client host.

  Successful use of `LOCAL` load operations within  `mysqlimport` also requires that the server permits local loading;
*  `--lock-tables`, `-l`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--lock-tables</code></td> </tr></tbody></table>

  Lock *all* tables for writing before processing any text files. This ensures that all tables are synchronized on the server.
*  `--login-path=name`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the `mysql_config_editor` utility.

*  `--no-login-paths`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--no-login-paths</code></td> </tr></tbody></table>

  Skips reading options from the login path file.

  See  `--login-path` for related information.

*  `--low-priority`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--low-priority</code></td> </tr></tbody></table>

  Use `LOW_PRIORITY` when loading the table. This affects only storage engines that use only table-level locking (such as `MyISAM`, `MEMORY`, and `MERGE`).
*  `--no-defaults`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the  `mysql_config_editor` utility. 

*  `--password[=password]`, `-p[password]`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, `mysqlimport` prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file.

  To explicitly specify that there is no password and that `mysqlimport` should not prompt for one, use the `--skip-password` option.
*  `--password1[=pass_val]`

  The password for multifactor authentication factor 1 of the MySQL account used for connecting to the server. The password value is optional. If not given, `mysqlimport` prompts for one. If given, there must be *no space* between `--password1=` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that `mysqlimport` should not prompt for one, use the `--skip-password1` option.

   `--password1` and `--password` are synonymous, as are `--skip-password1` and `--skip-password`.
*  `--password2[=pass_val]`

  The password for multifactor authentication factor 2 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.
*  `--password3[=pass_val]`

  The password for multifactor authentication factor 3 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.
*  `--pipe`, `-W`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--pipe</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  On Windows, connect to the server using a named pipe. This option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.
*  `--plugin-dir=dir_name`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--plugin-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but `mysqlimport` does not find it. See Section 8.2.17, “Pluggable Authentication”.
*  `--port=port_num`, `-P port_num`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--port=port_num</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>3306</code></td> </tr></tbody></table>

  For TCP/IP connections, the port number to use.
*  `--print-defaults`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--protocol=type</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[see text]</code></td> </tr><tr><th>Valid Values</th> <td><code>TCP</code><code>SOCKET</code><code>PIPE</code><code>MEMORY</code></td> </tr></tbody></table>

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 6.2.7, “Connection Transport Protocols”.
*  `--replace`, `-r`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--replace</code></td> </tr></tbody></table>

  The `--replace` and `--ignore` options control handling of input rows that duplicate existing rows on unique key values. If you specify `--replace`, new rows replace existing rows that have the same unique key value. If you specify `--ignore`, input rows that duplicate an existing row on a unique key value are skipped. If you do not specify either option, an error occurs when a duplicate key value is found, and the rest of the text file is ignored.
*  `--server-public-key-path=file_name`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--server-public-key-path=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` (deprecated) or `caching_sha2_password` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password` (deprecated), this option applies only if MySQL was built using OpenSSL.
*  `--shared-memory-base-name=name`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--shared-memory-base-name=name</code></td> </tr><tr><th>Platform Specific</th> <td>Windows</td> </tr></tbody></table>

  On Windows, the shared-memory name to use for connections made using shared memory to a local server. The default value is `MYSQL`. The shared-memory name is case-sensitive.

  This option applies only if the server was started with the `shared_memory` system variable enabled to support shared-memory connections.
*  `--silent`, `-s`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--silent</code></td> </tr></tbody></table>

  Silent mode. Produce output only when errors occur.
*  `--socket=path`, `-S path`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--socket={file_name|pipe_name}</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the  `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.
* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.
*  `--ssl-fips-mode={OFF|ON|STRICT}`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--ssl-fips-mode={OFF|ON|STRICT}</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr><tr><th>Valid Values</th> <td><code>OFF</code><code>ON</code><code>STRICT</code></td> </tr></tbody></table>

  Controls whether to enable FIPS mode on the client side. The `--ssl-fips-mode` option differs from other `--ssl-xxx` options in that it is not used to establish encrypted connections, but rather to affect which cryptographic operations to permit. See  Section 8.8, “FIPS Support”.

  These `--ssl-fips-mode` values are permitted:

  + `OFF`: Disable FIPS mode.
  + `ON`: Enable FIPS mode.
  + `STRICT`: Enable “strict” FIPS mode.
  
  ::: info Note

  If the OpenSSL FIPS Object Module is not available, the only permitted value for `--ssl-fips-mode` is `OFF`. In this case, setting `--ssl-fips-mode` to `ON` or `STRICT` causes the client to produce a warning at startup and to operate in non-FIPS mode.

  :::

  This option is deprecated. Expect it to be removed in a future version of MySQL.
*  `--tls-ciphersuites=ciphersuite_list`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--tls-ciphersuites=ciphersuite_list</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The permissible ciphersuites for encrypted connections that use TLSv1.3. The value is a list of one or more colon-separated ciphersuite names. The ciphersuites that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.
*  `--tls-sni-servername=server_name`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--tls-sni-servername=server_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  When specified, the name is passed to the `libmysqlclient` C API library using the `MYSQL_OPT_TLS_SNI_SERVERNAME` option of `mysql_options()`. The server name is not case-sensitive. To show which server name the client specified for the current session, if any, check the `Tls_sni_server_name` status variable.

  Server Name Indication (SNI) is an extension to the TLS protocol (OpenSSL must be compiled using TLS extensions for this option to function). The MySQL implementation of SNI represents the client-side only.
*  `--tls-version=protocol_list`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--tls-version=protocol_list</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>TLSv1,TLSv1.1,TLSv1.2,TLSv1.3</code> (OpenSSL 1.1.1 or higher)<code>TLSv1,TLSv1.1,TLSv1.2</code> (otherwise)</td> </tr></tbody></table>

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.
*  `--user=user_name`, `-u user_name`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--user=user_name,</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The user name of the MySQL account to use for connecting to the server.
*  `--use-threads=N`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--use-threads=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  Load files in parallel using *`N`* threads.
*  `--verbose`, `-v`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Verbose mode. Print more information about what the program does.
*  `--version`, `-V`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--version</code></td> </tr></tbody></table>

  Display version information and exit.
*  `--zstd-compression-level=level`

  <table><tbody><tr><th>Command-Line Format</th> <td><code>--zstd-compression-level=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr></tbody></table>

  The compression level to use for connections to the server that use the `zstd` compression algorithm. The permitted levels are from 1 to 22, with larger values indicating increasing levels of compression. The default `zstd` compression level is 3. The compression level setting has no effect on connections that do not use `zstd` compression.

  For more information, see Section 6.2.8, “Connection Compression Control”.

Here is a sample session that demonstrates use of `mysqlimport`:

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
