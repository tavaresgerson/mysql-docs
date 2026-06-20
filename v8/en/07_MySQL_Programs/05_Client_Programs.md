## 6.5 Client Programs

This section describes client programs that connect to the MySQL server.


### 6.5.1 mysql — The MySQL Command-Line Client

**mysql** is a simple SQL shell with input line editing capabilities. It supports interactive and noninteractive use. When used interactively, query results are presented in an ASCII-table format. When used noninteractively (for example, as a filter), the result is presented in tab-separated format. The output format can be changed using command options.

If you have problems due to insufficient memory for large result sets, use the `--quick` option. This forces **mysql** to retrieve results from the server a row at a time rather than retrieving the entire result set and buffering it in memory before displaying it. This is done by returning the result set using the `mysql_use_result()` C API function in the client/server library rather than `mysql_store_result()`.

Note

Alternatively, MySQL Shell offers access to the X DevAPI. For details, see MySQL Shell 8.0.

Using **mysql** is very easy. Invoke it from the prompt of your command interpreter as follows:

```
mysql db_name
```

Or:

```
mysql --user=user_name --password db_name
```

In this case, you'll need to enter your password in response to the prompt that **mysql** displays:

```
Enter password: your_password
```

Then type an SQL statement, end it with `;`, `\g`, or `\G` and press Enter.

Typing **Control+C** interrupts the current statement if there is one, or cancels any partial input line otherwise.

You can execute SQL statements in a script file (batch file) like this:

```
mysql db_name < script.sql > output.tab
```

On Unix, the **mysql** client logs statements executed interactively to a history file. See Section 6.5.1.3, “mysql Client Logging”.


#### 6.5.1.1 mysql Client Options

**mysql** supports the following options, which can be specified on the command line or in the `[mysql]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see Section 6.2.2.2, “Using Option Files”.

**Table 6.12 mysql Client Options**

<table frame="box" rules="all" summary="Command-line options available for the mysql client."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--authentication-oci-client-config-profile</th> <td>Name of the OCI profile defined in the OCI config file to use</td> <td>8.0.33</td> <td></td> </tr><tr><th scope="row">--auto-rehash</th> <td>Enable automatic rehashing</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-vertical-output</th> <td>Enable automatic vertical result set display</td> <td></td> <td></td> </tr><tr><th scope="row">--batch</th> <td>Do not use history file</td> <td></td> <td></td> </tr><tr><th scope="row">--binary-as-hex</th> <td>Display binary values in hexadecimal notation</td> <td></td> <td></td> </tr><tr><th scope="row">--binary-mode</th> <td>Disable \r\n - to - \n translation and treatment of \0 as end-of-query</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use specified network interface to connect to MySQL Server</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Directory where character sets are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--column-names</th> <td>Write column names in results</td> <td></td> <td></td> </tr><tr><th scope="row">--column-type-info</th> <td>Display result set metadata</td> <td></td> <td></td> </tr><tr><th scope="row">--commands</th> <td>Enable or disable processing of local mysql client commands</td> <td>8.0.43</td> <td></td> </tr><tr><th scope="row">--comments</th> <td>Whether to retain or strip comments in statements sent to the server</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compress all information sent between client and server</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Permitted compression algorithms for connections to server</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--connect-expired-password</th> <td>Indicate to server that client can handle expired-password sandbox mode</td> <td></td> <td></td> </tr><tr><th scope="row">--connect-timeout</th> <td>Number of seconds before connection timeout</td> <td></td> <td></td> </tr><tr><th scope="row">--database</th> <td>The database to use</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log; supported only if MySQL was built with debugging support</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Print debugging information when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Print debugging information, memory, and CPU statistics when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Authentication plugin to use</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Specify default character set</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Read named option file in addition to usual option files</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Read only named option file</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Option group suffix value</td> <td></td> <td></td> </tr><tr><th scope="row">--delimiter</th> <td>Set the statement delimiter</td> <td></td> <td></td> </tr><tr><th scope="row">--dns-srv-name</th> <td>Use DNS SRV lookup for host information</td> <td>8.0.22</td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Enable cleartext authentication plugin</td> <td></td> <td></td> </tr><tr><th scope="row">--execute</th> <td>Execute the statement and quit</td> <td></td> <td></td> </tr><tr><th scope="row">--fido-register-factor</th> <td>Multifactor authentication factors for which registration must be done</td> <td>8.0.27</td> <td>8.0.35</td> </tr><tr><th scope="row">--force</th> <td>Continue even if an SQL error occurs</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Request RSA public key from server</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Display help message and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--histignore</th> <td>Patterns specifying which statements to ignore for logging</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Host on which MySQL server is located</td> <td></td> <td></td> </tr><tr><th scope="row">--html</th> <td>Produce HTML output</td> <td></td> <td></td> </tr><tr><th scope="row">--ignore-spaces</th> <td>Ignore spaces after function names</td> <td></td> <td></td> </tr><tr><th scope="row">--init-command</th> <td>SQL statement to execute after connecting</td> <td></td> <td></td> </tr><tr><th scope="row">--line-numbers</th> <td>Write line numbers for errors</td> <td></td> <td></td> </tr><tr><th scope="row">--load-data-local-dir</th> <td>Directory for files named in LOAD DATA LOCAL statements</td> <td>8.0.21</td> <td></td> </tr><tr><th scope="row">--local-infile</th> <td>Enable or disable for LOCAL capability for LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Read login path options from .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--max-allowed-packet</th> <td>Maximum packet length to send to or receive from server</td> <td></td> <td></td> </tr><tr><th scope="row">--max-join-size</th> <td>The automatic limit for rows in a join when using --safe-updates</td> <td></td> <td></td> </tr><tr><th scope="row">--named-commands</th> <td>Enable named mysql commands</td> <td></td> <td></td> </tr><tr><th scope="row">--net-buffer-length</th> <td>Buffer size for TCP/IP and socket communication</td> <td></td> <td></td> </tr><tr><th scope="row">--network-namespace</th> <td>Specify network namespace</td> <td>8.0.22</td> <td></td> </tr><tr><th scope="row">--no-auto-rehash</th> <td>Disable automatic rehashing</td> <td></td> <td></td> </tr><tr><th scope="row">--no-beep</th> <td>Do not beep when errors occur</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Read no option files</td> <td></td> <td></td> </tr><tr><th scope="row">--oci-config-file</th> <td>Defines an alternate location for the Oracle Cloud Infrastructure CLI configuration file.</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--one-database</th> <td>Ignore statements except those for the default database named on the command line</td> <td></td> <td></td> </tr><tr><th scope="row">--pager</th> <td>Use the given command for paging query output</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Password to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>First multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Second multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Third multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Connect to server using named pipe (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-authentication-kerberos-client-mode</th> <td>Permit GSSAPI pluggable authentication through the MIT Kerberos library on Windows</td> <td>8.0.32</td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Directory where plugins are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--prompt</th> <td>Set the prompt to the specified format</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Transport protocol to use</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>Do not cache each query result</td> <td></td> <td></td> </tr><tr><th scope="row">--raw</th> <td>Write column values without escape conversion</td> <td></td> <td></td> </tr><tr><th scope="row">--reconnect</th> <td>If the connection to the server is lost, automatically try to reconnect</td> <td></td> <td></td> </tr><tr><th scope="row">--safe-updates, --i-am-a-dummy</th> <td>Allow only UPDATE and DELETE statements that specify key values</td> <td></td> <td></td> </tr><tr><th scope="row">--select-limit</th> <td>The automatic limit for SELECT statements when using --safe-updates</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Path name to file containing RSA public key</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Shared-memory name for shared-memory connections (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--show-warnings</th> <td>Show warnings after each statement if there are any</td> <td></td> <td></td> </tr><tr><th scope="row">--sigint-ignore</th> <td>Ignore SIGINT signals (typically the result of typing Control+C)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-auto-rehash</th> <td>Disable automatic rehashing</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-column-names</th> <td>Do not write column names in results</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-line-numbers</th> <td>Skip line numbers for errors</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-named-commands</th> <td>Disable named mysql commands</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-pager</th> <td>Disable paging</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-reconnect</th> <td>Disable reconnecting</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-system-command</th> <td>Disable system (\!) command</td> <td>8.0.40</td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Unix socket file or Windows named pipe to use</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>File that contains list of trusted SSL Certificate Authorities</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>File that contains X.509 certificate</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Permissible ciphers for connection encryption</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>File that contains certificate revocation lists</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Directory that contains certificate revocation-list files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Whether to enable FIPS mode on client side</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>File that contains X.509 key</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Desired security state of connection to server</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>File that contains SSL session data</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Whether to establish connections if session reuse fails</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--syslog</th> <td>Log interactive statements to syslog</td> <td></td> <td></td> </tr><tr><th scope="row">--system-command</th> <td>Enable or disable system (\!) command</td> <td>8.0.40</td> <td></td> </tr><tr><th scope="row">--table</th> <td>Display output in tabular format</td> <td></td> <td></td> </tr><tr><th scope="row">--tee</th> <td>Append a copy of output to named file</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Permissible TLS protocols for encrypted connections</td> <td></td> <td></td> </tr><tr><th scope="row">--unbuffered</th> <td>Flush the buffer after each query</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>MySQL user name to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Display version information and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--vertical</th> <td>Print query output rows vertically (one line per column value)</td> <td></td> <td></td> </tr><tr><th scope="row">--wait</th> <td>If the connection cannot be established, wait and retry instead of aborting</td> <td></td> <td></td> </tr><tr><th scope="row">--xml</th> <td>Produce XML output</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Compression level for connections to server that use zstd compression</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--authentication-oci-client-config-profile`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Introduced</th> <td>8.0.33</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Specify the name of the OCI configuration profile to use. If not set, the default profile is used.

* `--auto-rehash`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>

  Enable automatic rehashing. This option is on by default, which enables database, table, and column name completion. Use `--disable-auto-rehash` to disable rehashing. That causes **mysql** to start faster, but you must issue the `rehash` command or its `\#` shortcut if you want to use name completion.

  To complete a name, enter the first part and press Tab. If the name is unambiguous, **mysql** completes it. Otherwise, you can press Tab again to see the possible names that begin with what you have typed so far. Completion does not occur if there is no default database.

  Note

  This feature requires a MySQL client that is compiled with the **readline** library. Typically, the **readline** library is not available on Windows.

* `--auto-vertical-output`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>

  Cause result sets to be displayed vertically if they are too wide for the current window, and using normal tabular format otherwise. (This applies to statements terminated by `;` or `\G`.)

* `--batch`, `-B`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>

  Print results using tab as the column separator, with each row on a new line. With this option, **mysql** does not use the history file.

  Batch mode results in nontabular output format and escaping of special characters. Escaping may be disabled by using raw mode; see the description for the `--raw` option.

* `--binary-as-hex`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value (≥ 8.0.19)</th> <td><code>FALSE in noninteractive mode</code></td> </tr><tr><th>Default Value (≤ 8.0.18)</th> <td><code>FALSE</code></td> </tr></tbody></table>

  When this option is given, **mysql** displays binary data using hexadecimal notation (`0xvalue`). This occurs whether the overall output display format is tabular, vertical, HTML, or XML.

  `--binary-as-hex` when enabled affects display of all binary strings, including those returned by functions such as `CHAR()` and `UNHEX()`. The following example demonstrates this using the ASCII code for `A` (65 decimal, 41 hexadecimal):

  + `--binary-as-hex` disabled:

    ```
    mysql> SELECT CHAR(0x41), UNHEX('41');
    +------------+-------------+
    | CHAR(0x41) | UNHEX('41') |
    +------------+-------------+
    | A          | A           |
    +------------+-------------+
    ```

  + `--binary-as-hex` enabled:

    ```
    mysql> SELECT CHAR(0x41), UNHEX('41');
    +------------------------+--------------------------+
    | CHAR(0x41)             | UNHEX('41')              |
    +------------------------+--------------------------+
    | 0x41                   | 0x41                     |
    +------------------------+--------------------------+
    ```

  To write a binary string expression so that it displays as a character string regardless of whether `--binary-as-hex` is enabled, use these techniques:

  + The `CHAR()` function has a `USING charset` clause:

    ```
    mysql> SELECT CHAR(0x41 USING utf8mb4);
    +--------------------------+
    | CHAR(0x41 USING utf8mb4) |
    +--------------------------+
    | A                        |
    +--------------------------+
    ```

  + More generally, use `CONVERT()` to convert an expression to a given character set:

    ```
    mysql> SELECT CONVERT(UNHEX('41') USING utf8mb4);
    +------------------------------------+
    | CONVERT(UNHEX('41') USING utf8mb4) |
    +------------------------------------+
    | A                                  |
    +------------------------------------+
    ```

  As of MySQL 8.0.19, when **mysql** operates in interactive mode, this option is enabled by default. In addition, output from the `status` (or `\s`) command includes this line when the option is enabled implicitly or explicitly:

  ```
  Binary data as: Hexadecimal
  ```

  To disable hexadecimal notation, use `--skip-binary-as-hex`

* `--binary-mode`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>

  This option helps when processing **mysqlbinlog** output that may contain `BLOB` values. By default, **mysql** translates `\r\n` in statement strings to `\n` and interprets `\0` as the statement terminator. `--binary-mode` disables both features. It also disables all **mysql** commands except `charset` and `delimiter` in noninteractive mode (for input piped to **mysql** or loaded using the `source` command).

  (*MySQL 8.0.43 and later:*) `--binary-mode`, when enabled, causes the server to disregard any setting for `--commands` .

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On a computer having multiple network interfaces, use this option to select which interface to use for connecting to the MySQL server.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The directory where character sets are installed. See Section 12.15, “Character Set Configuration”.

* `--column-names`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

  Write column names in results.

* `--column-type-info`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

  Display result set metadata. This information corresponds to the contents of C API `MYSQL_FIELD` data structures. See C API Basic Data Structures.

* `--commands`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

  Whether to enable or disable processing of local **mysql** client commands. Setting this option to `FALSE` disables such processing, and has the effects listed here:

  + The following **mysql** client commands are disabled:

    - `charset` (`/C` remains enabled)

    - `clear`
    - `connect`
    - `edit`
    - `ego`
    - `exit`
    - `go`
    - `help`
    - `nopager`
    - `notee`
    - `nowarning`
    - `pager`
    - `print`
    - `prompt`
    - `query_attributes`
    - `quit`
    - `rehash`
    - `resetconnection`
    - `ssl_session_data_print`
    - `source`
    - `status`
    - `system`
    - `tee`
    - `\u` (`use` is passed to the server)

    - `warnings`
  + The `\C` and `delimiter` commands remain enabled.

  + The `--system-command` option is ignored, and has no effect.

  This option has no effect when `--binary-mode` is enabled.

  When `--commands` is enabled, it is possible to disable (only) the system command using the `--system-command` option.

  This option was added in MySQL 8.0.43.

* `--comments`, `-c`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

  Whether to strip or preserve comments in statements sent to the server. The default is `--skip-comments` (strip comments), enable with `--comments` (preserve comments).

  Note

  The **mysql** client always passes optimizer hints to the server, regardless of whether this option is given.

  Comment stripping is deprecated. Expect this feature and the options to control it to be removed in a future MySQL release.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

  Compress all information sent between the client and the server if possible. See Section 6.2.8, “Connection Compression Control”.

  As of MySQL 8.0.18, this option is deprecated. Expect it to be removed in a future version of MySQL. See Configuring Legacy Connection Compression.

* `--compression-algorithms=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

  The permitted compression algorithms for connections to the server. The available algorithms are the same as for the `protocol_compression_algorithms` system variable. The default value is `uncompressed`.

  For more information, see Section 6.2.8, “Connection Compression Control”.

  This option was added in MySQL 8.0.18.

* `--connect-expired-password`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

  Indicate to the server that the client can handle sandbox mode if the account used to connect has an expired password. This can be useful for noninteractive invocations of **mysql** because normally the server disconnects noninteractive clients that attempt to connect using an account with an expired password. (See Section 8.2.16, “Server Handling of Expired Passwords”.)

* `--connect-timeout=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

  The number of seconds before connection timeout. (Default value is `0`.)

* `--database=db_name`, `-D db_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

  The database to use. This is useful primarily in an option file.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:o,/tmp/mysql.trace`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Introduced</th> <td>8.0.33</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Introduced</th> <td>8.0.33</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

  Print debugging information and memory and CPU usage statistics when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Introduced</th> <td>8.0.33</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

  A hint about which client-side authentication plugin to use. See Section 8.2.17, “Pluggable Authentication”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Introduced</th> <td>8.0.33</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

  Use *`charset_name`* as the default character set for the client and connection.

  This option can be useful if the operating system uses one character set and the **mysql** client by default uses another. In this case, output may be formatted incorrectly. You can usually fix such issues by using this option to force the client to use the system character set instead.

  For more information, see Section 12.4, “Connection Character Sets and Collations”, and Section 12.15, “Character Set Configuration”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Introduced</th> <td>8.0.33</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Introduced</th> <td>8.0.33</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Introduced</th> <td>8.0.33</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysql** normally reads the `[client]` and `[mysql]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysql** also reads the `[client_other]` and `[mysql_other]` groups.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--delimiter=str`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Introduced</th> <td>8.0.33</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

  Set the statement delimiter. The default is the semicolon character (`;`).

* `--disable-named-commands`

  Disable named commands. Use the `\*` form only, or use named commands only at the beginning of a line ending with a semicolon (`;`). **mysql** starts with this option *enabled* by default. However, even with this option, long-format commands still work from the first line. See Section 6.5.1.2, “mysql Client Commands”.

* `--dns-srv-name=name`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Introduced</th> <td>8.0.33</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

  Specifies the name of a DNS SRV record that determines the candidate hosts to use for establishing a connection to a MySQL server. For information about DNS SRV support in MySQL, see Section 6.2.6, “Connecting to the Server Using DNS SRV Records”.

  Suppose that DNS is configured with this SRV information for the `example.com` domain:

  ```
  Name                     TTL   Class   Priority Weight Port Target
  _mysql._tcp.example.com. 86400 IN SRV  0        5      3306 host1.example.com
  _mysql._tcp.example.com. 86400 IN SRV  0        10     3306 host2.example.com
  _mysql._tcp.example.com. 86400 IN SRV  10       5      3306 host3.example.com
  _mysql._tcp.example.com. 86400 IN SRV  20       5      3306 host4.example.com
  ```

  To use that DNS SRV record, invoke **mysql** like this:

  ```
  mysql --dns-srv-name=_mysql._tcp.example.com
  ```

  **mysql** then attempts a connection to each server in the group until a successful connection is established. A failure to connect occurs only if a connection cannot be established to any of the servers. The priority and weight values in the DNS SRV record determine the order in which servers should be tried.

  When invoked with `--dns-srv-name`, **mysql** attempts to establish TCP connections only.

  The `--dns-srv-name` option takes precedence over the `--host` option if both are given. `--dns-srv-name` causes connection establishment to use the `mysql_real_connect_dns_srv()` C API function rather than `mysql_real_connect()`. However, if the `connect` command is subsequently used at runtime and specifies a host name argument, that host name takes precedence over any `--dns-srv-name` option given at **mysql** startup to specify a DNS SRV record.

  This option was added in MySQL 8.0.22.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for authentication-oci-client-config-profile"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-oci-client-config-profile=profileName</code></td> </tr><tr><th>Introduced</th> <td>8.0.33</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>9

  Enable the `mysql_clear_password` cleartext authentication plugin. (See Section 8.4.1.4, “Client-Side Cleartext Pluggable Authentication”.)

* `--execute=statement`, `-e statement`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>0

  Execute the statement and quit. The default output format is like that produced with `--batch`. See Section 6.2.2.1, “Using Options on the Command Line”, for some examples. With this option, **mysql** does not use the history file.

* `--fido-register-factor=value`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>1

  Note

  As of MySQL 8.0.35, this option is deprecated and subject to removal in a future MySQL release.

  The factor or factors for which FIDO device registration must be performed. This option value must be a single value, or two values separated by commas. Each value must be 2 or 3, so the permitted option values are `'2'`, `'3'`, `'2,3'` and `'3,2'`.

  For example, an account that requires registration for a 3rd authentication factor invokes the **mysql** client as follows:

  ```
  mysql --user=user_name --fido-register-factor=3
  ```

  An account that requires registration for a 2nd and 3rd authentication factor invokes the **mysql** client as follows:

  ```
  mysql --user=user_name --fido-register-factor=2,3
  ```

  If registration is successful, a connection is established. If there is an authentication factor with a pending registration, a connection is placed into pending registration mode when attempting to connect to the server. In this case, disconnect and reconnect with the correct `--fido-register-factor` value to complete the registration.

  Registration is a two step process comprising *initiate registration* and *finish registration* steps. The initiate registration step executes this statement:

  ```
  ALTER USER user factor INITIATE REGISTRATION
  ```

  The statement returns a result set containing a 32 byte challenge, the user name, and the relying party ID (see `authentication_fido_rp_id`).

  The finish registration step executes this statement:

  ```
  ALTER USER user factor FINISH REGISTRATION SET CHALLENGE_RESPONSE AS 'auth_string'
  ```

  The statement completes the registration and sends the following information to the server as part of the *`auth_string`*: authenticator data, an optional attestation certificate in X.509 format, and a signature.

  The initiate and registration steps must be performed in a single connection, as the challenge received by the client during the initiate step is saved to the client connection handler. Registration would fail if the registration step was performed by a different connection. The `--fido-register-factor` option executes both the initiate and registration steps, which avoids the failure scenario described above and prevents having to execute the [`ALTER USER`](alter-user.html "15.7.1.1 ALTER USER Statement") initiate and registration statements manually.

  The `--fido-register-factor` option is only available for the **mysql** client and MySQL Shell. Other MySQL client programs do not support it.

  For related information, see Using FIDO Authentication.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>2

  Continue even if an SQL error occurs.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>3

  Request from the server the public key required for RSA key pair-based password exchange. This option applies to clients that authenticate with the `caching_sha2_password` authentication plugin. For that plugin, the server does not send the public key unless requested. This option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the `caching_sha2_password` plugin, see Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.

* `--histignore`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>4

  A list of one or more colon-separated patterns specifying statements to ignore for logging purposes. These patterns are added to the default pattern list (`"*IDENTIFIED*:*PASSWORD*"`). The value specified for this option affects logging of statements written to the history file, and to `syslog` if the `--syslog` option is given. For more information, see Section 6.5.1.3, “mysql Client Logging”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>5

  Connect to the MySQL server on the given host.

  The `--dns-srv-name` option takes precedence over the `--host` option if both are given. `--dns-srv-name` causes connection establishment to use the `mysql_real_connect_dns_srv()` C API function rather than `mysql_real_connect()`. However, if the `connect` command is subsequently used at runtime and specifies a host name argument, that host name takes precedence over any `--dns-srv-name` option given at **mysql** startup to specify a DNS SRV record.

* `--html`, `-H`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>6

  Produce HTML output.

* `--ignore-spaces`, `-i`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>7

  Ignore spaces after function names. The effect of this is described in the discussion for the `IGNORE_SPACE` SQL mode (see Section 7.1.11, “Server SQL Modes”).

* `--init-command=str`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>8

  Single SQL statement to execute after connecting to the server. If auto-reconnect is enabled, the statement is executed again after reconnection occurs.

* `--line-numbers`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>9

  Write line numbers for errors. Disable this with `--skip-line-numbers`.

* `--load-data-local-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>0

  This option affects the client-side `LOCAL` capability for `LOAD DATA` operations. It specifies the directory in which files named in [`LOAD DATA LOCAL`](load-data.html "15.2.9 LOAD DATA Statement") statements must be located. The effect of `--load-data-local-dir` depends on whether `LOCAL` data loading is enabled or disabled:

  + If `LOCAL` data loading is enabled, either by default in the MySQL client library or by specifying `--local-infile[=1]`, the `--load-data-local-dir` option is ignored.

  + If `LOCAL` data loading is disabled, either by default in the MySQL client library or by specifying `--local-infile=0`, the `--load-data-local-dir` option applies.

  When `--load-data-local-dir` applies, the option value designates the directory in which local data files must be located. Comparison of the directory path name and the path name of files to be loaded is case-sensitive regardless of the case sensitivity of the underlying file system. If the option value is the empty string, it names no directory, with the result that no files are permitted for local data loading.

  For example, to explicitly disable local data loading except for files located in the `/my/local/data` directory, invoke **mysql** like this:

  ```
  mysql --local-infile=0 --load-data-local-dir=/my/local/data
  ```

  When both `--local-infile` and `--load-data-local-dir` are given, the order in which they are given does not matter.

  Successful use of `LOCAL` load operations within **mysql** also requires that the server permits local loading; see Section 8.1.6, “Security Considerations for LOAD DATA LOCAL”

  The `--load-data-local-dir` option was added in MySQL 8.0.21.

* `--local-infile[={0|1}]`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>1

  By default, `LOCAL` capability for `LOAD DATA` is determined by the default compiled into the MySQL client library. To enable or disable `LOCAL` data loading explicitly, use the `--local-infile` option. When given with no value, the option enables `LOCAL` data loading. When given as `--local-infile=0` or `--local-infile=1`, the option disables or enables `LOCAL` data loading.

  If `LOCAL` capability is disabled, the `--load-data-local-dir` option can be used to permit restricted local loading of files located in a designated directory.

  Successful use of `LOCAL` load operations within **mysql** also requires that the server permits local loading; see Section 8.1.6, “Security Considerations for LOAD DATA LOCAL”

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>2

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql_config_editor** utility. See Section 6.6.7, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--max-allowed-packet=value`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>3

  The maximum size of the buffer for client/server communication. The default is 16MB, the maximum is 1GB.

* `--max-join-size=value`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>4

  The automatic limit for rows in a join when using `--safe-updates`. (Default value is 1,000,000.)

* `--named-commands`, `-G`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>5

  Enable named **mysql** commands. Long-format commands are permitted, not just short-format commands. For example, `quit` and `\q` both are recognized. Use `--skip-named-commands` to disable named commands. See Section 6.5.1.2, “mysql Client Commands”.

* `--net-buffer-length=value`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>6

  The buffer size for TCP/IP and socket communication. (Default value is 16KB.)

* `--network-namespace=name`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>7

  The network namespace to use for TCP/IP connections. If omitted, the connection uses the default (global) namespace. For information about network namespaces, see Section 7.1.14, “Network Namespace Support”.

  This option was added in MySQL 8.0.22. It is available only on platforms that implement network namespace support.

* `--no-auto-rehash`, `-A`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>8

  This has the same effect as `--skip-auto-rehash`. See the description for `--auto-rehash`.

* `--no-beep`, `-b`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>9

  Do not beep when errors occur.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>0

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql_config_editor** utility. See Section 6.6.7, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--one-database`, `-o`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>1

  Ignore statements except those that occur while the default database is the one named on the command line. This option is rudimentary and should be used with care. Statement filtering is based only on `USE` statements.

  Initially, **mysql** executes statements in the input because specifying a database *`db_name`* on the command line is equivalent to inserting [`USE db_name`](use.html "15.8.4 USE Statement") at the beginning of the input. Then, for each `USE` statement encountered, **mysql** accepts or rejects following statements depending on whether the database named is the one on the command line. The content of the statements is immaterial.

  Suppose that **mysql** is invoked to process this set of statements:

  ```
  DELETE FROM db2.t2;
  USE db2;
  DROP TABLE db1.t1;
  CREATE TABLE db1.t1 (i INT);
  USE db1;
  INSERT INTO t1 (i) VALUES(1);
  CREATE TABLE db2.t1 (j INT);
  ```

  If the command line is [**mysql --force --one-database db1**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client"), **mysql** handles the input as follows:

  + The `DELETE` statement is executed because the default database is `db1`, even though the statement names a table in a different database.

  + The `DROP TABLE` and `CREATE TABLE` statements are not executed because the default database is not `db1`, even though the statements name a table in `db1`.

  + The `INSERT` and `CREATE TABLE` statements are executed because the default database is `db1`, even though the `CREATE TABLE` statement names a table in a different database.

* `--pager[=command]`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>2

  Use the given command for paging query output. If the command is omitted, the default pager is the value of your `PAGER` environment variable. Valid pagers are **less**, **more**, **cat [> filename]**, and so forth. This option works only on Unix and only in interactive mode. To disable paging, use `--skip-pager`. Section 6.5.1.2, “mysql Client Commands”, discusses output paging further.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>3

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysql** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysql** should not prompt for one, use the `--skip-password` option.

* `--password1[=pass_val]`

  The password for multifactor authentication factor 1 of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysql** prompts for one. If given, there must be *no space* between `--password1=` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysql** should not prompt for one, use the `--skip-password1` option.

  `--password1` and `--password` are synonymous, as are `--skip-password1` and `--skip-password`.

* `--password2[=pass_val]`

  The password for multifactor authentication factor 2 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.

* `--password3[=pass_val]`

  The password for multifactor authentication factor 3 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>4

  On Windows, connect to the server using a named pipe. This option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--plugin-authentication-kerberos-client-mode=value`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>5

  On Windows, the `authentication_kerberos_client` authentication plugin supports this plugin option. It provides two possible values that the client user can set at runtime: `SSPI` and `GSSAPI`.

  The default value for the client-side plugin option uses Security Support Provider Interface (SSPI), which is capable of acquiring credentials from the Windows in-memory cache. Alternatively, the client user can select a mode that supports Generic Security Service Application Program Interface (GSSAPI) through the MIT Kerberos library on Windows. GSSAPI is capable of acquiring cached credentials previously generated by using the **kinit** command.

  For more information, see [Commands for Windows Clients in GSSAPI Mode](kerberos-pluggable-authentication.html#kerberos-usage-win-gssapi-client-commands).

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>6

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysql** does not find it. See Section 8.2.17, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>7

  For TCP/IP connections, the port number to use.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>8

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--prompt=format_str`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>9

  Set the prompt to the specified format. The default is `mysql>`. The special sequences that the prompt can contain are described in Section 6.5.1.2, “mysql Client Commands”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value (≥ 8.0.19)</th> <td><code>FALSE in noninteractive mode</code></td> </tr><tr><th>Default Value (≤ 8.0.18)</th> <td><code>FALSE</code></td> </tr></tbody></table>0

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 6.2.7, “Connection Transport Protocols”.

* `--quick`, `-q`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value (≥ 8.0.19)</th> <td><code>FALSE in noninteractive mode</code></td> </tr><tr><th>Default Value (≤ 8.0.18)</th> <td><code>FALSE</code></td> </tr></tbody></table>1

  Do not cache each query result, print each row as it is received. This may slow down the server if the output is suspended. With this option, **mysql** does not use the history file.

  By default, **mysql** fetches all result rows before producing any output; while storing these, it calculates a running maximum column length from the actual value of each column in succession. When printing the output, it uses this maximum to format it. When `--quick` is specified, **mysql** does not have the rows for which to calculate the length before starting, and so uses the maximum length. In the following example, table `t1` has a single column of type `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") and containing 4 rows. The default output is 9 characters wide; this width is equal the maximum number of characters in any of the column values in the rows returned (5), plus 2 characters each for the spaces used as padding and the `|` characters used as column delimiters). The output when using the `--quick` option is 25 characters wide; this is equal to the number of characters needed to represent `-9223372036854775808`, which is the longest possible value that can be stored in a (signed) `BIGINT` column, or 19 characters, plus the 4 characters used for padding and column delimiters. The difference can be seen here:

  ```
  $> mysql -t test -e "SELECT * FROM t1"
  +-------+
  | c1    |
  +-------+
  |   100 |
  |  1000 |
  | 10000 |
  |    10 |
  +-------+

  $> mysql --quick -t test -e "SELECT * FROM t1"
  +----------------------+
  | c1                   |
  +----------------------+
  |                  100 |
  |                 1000 |
  |                10000 |
  |                   10 |
  +----------------------+
  ```

* `--raw`, `-r`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value (≥ 8.0.19)</th> <td><code>FALSE in noninteractive mode</code></td> </tr><tr><th>Default Value (≤ 8.0.18)</th> <td><code>FALSE</code></td> </tr></tbody></table>2

  For tabular output, the “boxing” around columns enables one column value to be distinguished from another. For nontabular output (such as is produced in batch mode or when the `--batch` or `--silent` option is given), special characters are escaped in the output so they can be identified easily. Newline, tab, `NUL`, and backslash are written as `\n`, `\t`, `\0`, and `\\`. The `--raw` option disables this character escaping.

  The following example demonstrates tabular versus nontabular output and the use of raw mode to disable escaping:

  ```
  % mysql
  mysql> SELECT CHAR(92);
  +----------+
  | CHAR(92) |
  +----------+
  | \        |
  +----------+

  % mysql -s
  mysql> SELECT CHAR(92);
  CHAR(92)
  \\

  % mysql -s -r
  mysql> SELECT CHAR(92);
  CHAR(92)
  \
  ```

* `--reconnect`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value (≥ 8.0.19)</th> <td><code>FALSE in noninteractive mode</code></td> </tr><tr><th>Default Value (≤ 8.0.18)</th> <td><code>FALSE</code></td> </tr></tbody></table>3

  If the connection to the server is lost, automatically try to reconnect. A single reconnect attempt is made each time the connection is lost. To suppress reconnection behavior, use `--skip-reconnect`.

* `--safe-updates`, `--i-am-a-dummy`, `-U`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value (≥ 8.0.19)</th> <td><code>FALSE in noninteractive mode</code></td> </tr><tr><th>Default Value (≤ 8.0.18)</th> <td><code>FALSE</code></td> </tr></tbody></table>4

  If this option is enabled, `UPDATE` and `DELETE` statements that do not use a key in the `WHERE` clause or a `LIMIT` clause produce an error. In addition, restrictions are placed on `SELECT` statements that produce (or are estimated to produce) very large result sets. If you have set this option in an option file, you can use `--skip-safe-updates` on the command line to override it. For more information about this option, see Using Safe-Updates Mode (--safe-updates)").

* `--select-limit=value`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value (≥ 8.0.19)</th> <td><code>FALSE in noninteractive mode</code></td> </tr><tr><th>Default Value (≤ 8.0.18)</th> <td><code>FALSE</code></td> </tr></tbody></table>5

  The automatic limit for `SELECT` statements when using `--safe-updates`. (Default value is 1,000.)

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value (≥ 8.0.19)</th> <td><code>FALSE in noninteractive mode</code></td> </tr><tr><th>Default Value (≤ 8.0.18)</th> <td><code>FALSE</code></td> </tr></tbody></table>6

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or `caching_sha2_password` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and `caching_sha2_password` plugins, see Section 8.4.1.3, “SHA-256 Pluggable Authentication”, and Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value (≥ 8.0.19)</th> <td><code>FALSE in noninteractive mode</code></td> </tr><tr><th>Default Value (≤ 8.0.18)</th> <td><code>FALSE</code></td> </tr></tbody></table>7

  On Windows, the shared-memory name to use for connections made using shared memory to a local server. The default value is `MYSQL`. The shared-memory name is case-sensitive.

  This option applies only if the server was started with the `shared_memory` system variable enabled to support shared-memory connections.

* `--show-warnings`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value (≥ 8.0.19)</th> <td><code>FALSE in noninteractive mode</code></td> </tr><tr><th>Default Value (≤ 8.0.18)</th> <td><code>FALSE</code></td> </tr></tbody></table>8

  Cause warnings to be shown after each statement if there are any. This option applies to interactive and batch mode.

* `--sigint-ignore`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value (≥ 8.0.19)</th> <td><code>FALSE in noninteractive mode</code></td> </tr><tr><th>Default Value (≤ 8.0.18)</th> <td><code>FALSE</code></td> </tr></tbody></table>9

  Ignore `SIGINT` signals (typically the result of typing **Control+C**).

  Without this option, typing **Control+C** interrupts the current statement if there is one, or cancels any partial input line otherwise.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>0

  Silent mode. Produce less output. This option can be given multiple times to produce less and less output.

  This option results in nontabular output format and escaping of special characters. Escaping may be disabled by using raw mode; see the description for the `--raw` option.

* `--skip-column-names`, `-N`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>1

  Do not write column names in results. Use of this option causes the output to be right-aligned, as shown here:

  ```
  $> echo "SELECT * FROM t1" | mysql -t test
  +-------+
  | c1    |
  +-------+
  | a,c,d |
  | c     |
  +-------+
  $> echo "SELECT * FROM t1" | ./mysql -uroot -Nt test
  +-------+
  | a,c,d |
  |     c |
  +-------+
  ```

* `--skip-line-numbers`, `-L`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>2

  Do not write line numbers for errors. Useful when you want to compare result files that include error messages.

* `--skip-system-command`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>3

  Disables the `system` (`\!`) command. Equivalent to `--system-command=OFF`.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>4

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>5

  Controls whether to enable FIPS mode on the client side. The `--ssl-fips-mode` option differs from other `--ssl-xxx` options in that it is not used to establish encrypted connections, but rather to affect which cryptographic operations to permit. See Section 8.8, “FIPS Support”.

  These `--ssl-fips-mode` values are permitted:

  + `OFF`: Disable FIPS mode.
  + `ON`: Enable FIPS mode.
  + `STRICT`: Enable “strict” FIPS mode.

  Note

  If the OpenSSL FIPS Object Module is not available, the only permitted value for `--ssl-fips-mode` is `OFF`. In this case, setting `--ssl-fips-mode` to `ON` or `STRICT` causes the client to produce a warning at startup and to operate in non-FIPS mode.

  As of MySQL 8.0.34, this option is deprecated. Expect it to be removed in a future version of MySQL.

* `--syslog`, `-j`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>6

  This option causes **mysql** to send interactive statements to the system logging facility. On Unix, this is `syslog`; on Windows, it is the Windows Event Log. The destination where logged messages appear is system dependent. On Linux, the destination is often the `/var/log/messages` file.

  Here is a sample of output generated on Linux by using `--syslog`. This output is formatted for readability; each logged message actually takes a single line.

  ```
  Mar  7 12:39:25 myhost MysqlClient[20824]:
    SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
    DB_SERVER:'127.0.0.1', DB:'--', QUERY:'USE test;'
  Mar  7 12:39:28 myhost MysqlClient[20824]:
    SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
    DB_SERVER:'127.0.0.1', DB:'test', QUERY:'SHOW TABLES;'
  ```

  For more information, see Section 6.5.1.3, “mysql Client Logging”.

* `--system-command[={ON|OFF}]`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>7

  Enable or disable the `system` (`\!`) command. When this option is disabled, either by `--system-command=OFF` or by `--skip-system-command`, the `system` command is rejected with an error.

  (*MySQL 8.0.43 and later:*) `--commands`, when disabled (set to `FALSE`), causes the server to disregard any setting for this option.

* `--table`, `-t`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>8

  Display output in table format. This is the default for interactive use, but can be used to produce table output in batch mode.

* `--tee=file_name`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>9

  Append a copy of output to the given file. This option works only in interactive mode. Section 6.5.1.2, “mysql Client Commands”, discusses tee files further.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

  The permissible ciphersuites for encrypted connections that use TLSv1.3. The value is a list of one or more colon-separated ciphersuite names. The ciphersuites that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 8.0.16.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

* `--unbuffered`, `-n`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

  Flush the buffer after each query.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

  The user name of the MySQL account to use for connecting to the server.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

  Verbose mode. Produce more output about what the program does. This option can be given multiple times to produce more and more output. (For example, `-v -v -v` produces table output format even in batch mode.)

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

  Display version information and exit.

* `--vertical`, `-E`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

  Print query output rows vertically (one line per column value). Without this option, you can specify vertical output for individual statements by terminating them with `\G`.

* `--wait`, `-w`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

  If the connection cannot be established, wait and retry instead of aborting.

* `--xml`, `-X`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>8

  Produce XML output.

  ```
  <field name="column_name">NULL</field>
  ```

  The output when `--xml` is used with **mysql** matches that of **mysqldump** `--xml`. See Section 6.5.4, “mysqldump — A Database Backup Program”, for details.

  The XML output also uses an XML namespace, as shown here:

  ```
  $> mysql --xml -uroot -e "SHOW VARIABLES LIKE 'version%'"
  <?xml version="1.0"?>

  <resultset statement="SHOW VARIABLES LIKE 'version%'" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <row>
  <field name="Variable_name">version</field>
  <field name="Value">5.0.40-debug</field>
  </row>

  <row>
  <field name="Variable_name">version_comment</field>
  <field name="Value">Source distribution</field>
  </row>

  <row>
  <field name="Variable_name">version_compile_machine</field>
  <field name="Value">i686</field>
  </row>

  <row>
  <field name="Variable_name">version_compile_os</field>
  <field name="Value">suse-linux-gnu</field>
  </row>
  </resultset>
  ```

* `--zstd-compression-level=level`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>9

  The compression level to use for connections to the server that use the `zstd` compression algorithm. The permitted levels are from 1 to 22, with larger values indicating increasing levels of compression. The default `zstd` compression level is 3. The compression level setting has no effect on connections that do not use `zstd` compression.

  For more information, see Section 6.2.8, “Connection Compression Control”.

  This option was added in MySQL 8.0.18.


#### 6.5.1.2 mysql Client Commands

**mysql** sends each SQL statement that you issue to the server to be executed. There is also a set of commands that **mysql** itself interprets. For a list of these commands, type `help` or `\h` at the `mysql>` prompt:

```
mysql> help

List of all MySQL commands:
Note that all text commands must be first on line and end with ';'
?         (\?) Synonym for `help'.
clear     (\c) Clear the current input statement.
connect   (\r) Reconnect to the server. Optional arguments are db and host.
delimiter (\d) Set statement delimiter.
edit      (\e) Edit command with $EDITOR.
ego       (\G) Send command to mysql server, display result vertically.
exit      (\q) Exit mysql. Same as quit.
go        (\g) Send command to mysql server.
help      (\h) Display this help.
nopager   (\n) Disable pager, print to stdout.
notee     (\t) Don't write into outfile.
pager     (\P) Set PAGER [to_pager]. Print the query results via PAGER.
print     (\p) Print current command.
prompt    (\R) Change your mysql prompt.
quit      (\q) Quit mysql.
rehash    (\#) Rebuild completion hash.
source    (\.) Execute an SQL script file. Takes a file name as an argument.
status    (\s) Get status information from the server.
system    (\!) Execute a system shell command.
tee       (\T) Set outfile [to_outfile]. Append everything into given
               outfile.
use       (\u) Use another database. Takes database name as argument.
charset   (\C) Switch to another charset. Might be needed for processing
               binlog with multi-byte charsets.
warnings  (\W) Show warnings after every statement.
nowarning (\w) Don't show warnings after every statement.
resetconnection(\x) Clean session context.
query_attributes Sets string parameters (name1 value1 name2 value2 ...)
for the next query to pick up.
ssl_session_data_print Serializes the current SSL session data to stdout
or file.

For server side help, type 'help contents'
```

If **mysql** is invoked with the `--binary-mode` option, all **mysql** commands are disabled except `charset` and `delimiter` in noninteractive mode (for input piped to **mysql** or loaded using the `source` command). Beginning with MySQL 8.0.43, the `--commands` option can be used to enable or disable all commands except `/C`, `delimiter`, and `use`.

Each command has both a long and short form. The long form is not case-sensitive; the short form is. The long form can be followed by an optional semicolon terminator, but the short form should not.

The use of short-form commands within multiple-line `/* ... */` comments is not supported. Short-form commands do work within single-line `/*! ... */` version comments, as do `/*+ ... */` optimizer-hint comments, which are stored in object definitions. If there is a concern that optimizer-hint comments may be stored in object definitions so that dump files when reloaded with `mysql` would result in execution of such commands, either invoke **mysql** with the `--binary-mode` option or use a reload client other than **mysql**.

* `help [arg]`, `\h [arg]`, `\? [arg]`, `? [arg]`

  Display a help message listing the available **mysql** commands.

  If you provide an argument to the `help` command, **mysql** uses it as a search string to access server-side help from the contents of the MySQL Reference Manual. For more information, see Section 6.5.1.4, “mysql Client Server-Side Help”.

* `charset charset_name`, `\C charset_name`

  Change the default character set and issue a `SET NAMES` statement. This enables the character set to remain synchronized on the client and server if **mysql** is run with auto-reconnect enabled (which is not recommended), because the specified character set is used for reconnects.

* `clear`, `\c`

  Clear the current input. Use this if you change your mind about executing the statement that you are entering.

* `connect [db_name [host_name]]`, `\r [db_name [host_name]]`

  Reconnect to the server. The optional database name and host name arguments may be given to specify the default database or the host where the server is running. If omitted, the current values are used.

  If the `connect` command specifies a host name argument, that host takes precedence over any `--dns-srv-name` option given at **mysql** startup to specify a DNS SRV record.

* `delimiter str`, `\d str`

  Change the string that **mysql** interprets as the separator between SQL statements. The default is the semicolon character (`;`).

  The delimiter string can be specified as an unquoted or quoted argument on the `delimiter` command line. Quoting can be done with either single quote (`'`), double quote (`"`), or backtick (`` ` ``) characters. To include a quote within a quoted string, either quote the string with a different quote character or escape the quote with a backslash (`\`) character. Backslash should be avoided outside of quoted strings because it is the escape character for MySQL. For an unquoted argument, the delimiter is read up to the first space or end of line. For a quoted argument, the delimiter is read up to the matching quote on the line.

  **mysql** interprets instances of the delimiter string as a statement delimiter anywhere it occurs, except within quoted strings. Be careful about defining a delimiter that might occur within other words. For example, if you define the delimiter as `X`, it is not possible to use the word `INDEX` in statements. **mysql** interprets this as `INDE` followed by the delimiter `X`.

  When the delimiter recognized by **mysql** is set to something other than the default of `;`, instances of that character are sent to the server without interpretation. However, the server itself still interprets `;` as a statement delimiter and processes statements accordingly. This behavior on the server side comes into play for multiple-statement execution (see Multiple Statement Execution Support), and for parsing the body of stored procedures and functions, triggers, and events (see Section 27.1, “Defining Stored Programs”).

* `edit`, `\e`

  Edit the current input statement. **mysql** checks the values of the `EDITOR` and `VISUAL` environment variables to determine which editor to use. The default editor is **vi** if neither variable is set.

  The `edit` command works only in Unix.

* `ego`, `\G`

  Send the current statement to the server to be executed and display the result using vertical format.

* `exit`, `\q`

  Exit **mysql**.

* `go`, `\g`

  Send the current statement to the server to be executed.

* `nopager`, `\n`

  Disable output paging. See the description for `pager`.

  The `nopager` command works only in Unix.

* `notee`, `\t`

  Disable output copying to the tee file. See the description for `tee`.

* `nowarning`, `\w`

  Disable display of warnings after each statement.

* `pager [command]`, `\P [command]`

  Enable output paging. By using the `--pager` option when you invoke **mysql**, it is possible to browse or search query results in interactive mode with Unix programs such as **less**, **more**, or any other similar program. If you specify no value for the option, **mysql** checks the value of the `PAGER` environment variable and sets the pager to that. Pager functionality works only in interactive mode.

  Output paging can be enabled interactively with the `pager` command and disabled with `nopager`. The command takes an optional argument; if given, the paging program is set to that. With no argument, the pager is set to the pager that was set on the command line, or `stdout` if no pager was specified.

  Output paging works only in Unix because it uses the `popen()` function, which does not exist on Windows. For Windows, the `tee` option can be used instead to save query output, although it is not as convenient as `pager` for browsing output in some situations.

* `print`, `\p`

  Print the current input statement without executing it.

* `prompt [str]`, `\R [str]`

  Reconfigure the **mysql** prompt to the given string. The special character sequences that can be used in the prompt are described later in this section.

  If you specify the `prompt` command with no argument, **mysql** resets the prompt to the default of `mysql>`.

* `query_attributes name value [name value ...]`

  Define query attributes that apply to the next query sent to the server. For discussion of the purpose and use of query attributes, see Section 11.6, “Query Attributes”.

  The `query_attributes` command follows these rules:

  + The format and quoting rules for attribute names and values are the same as for the `delimiter` command.

  + The command permits up to 32 attribute name/value pairs. Names and values may be up to 1024 characters long. If a name is given without a value, an error occurs.

  + If multiple `query_attributes` commands are issued prior to query execution, only the last command applies. After sending the query, **mysql** clears the attribute set.

  + If multiple attributes are defined with the same name, attempts to retrieve the attribute value have an undefined result.

  + An attribute defined with an empty name cannot be retrieved by name.

  + If a reconnect occurs while **mysql** executes the query, **mysql** restores the attributes after reconnecting so the query can be executed again with the same attributes.

* `quit`, `\q`

  Exit **mysql**.

* `rehash`, `\#`

  Rebuild the completion hash that enables database, table, and column name completion while you are entering statements. (See the description for the `--auto-rehash` option.)

* `resetconnection`, `\x`

  Reset the connection to clear the session state. This includes clearing any current query attributes defined using the `query_attributes` command.

  Resetting a connection has effects similar to `mysql_change_user()` or an auto-reconnect except that the connection is not closed and reopened, and re-authentication is not done. See mysql_change_user(), and Automatic Reconnection Control.

  This example shows how `resetconnection` clears a value maintained in the session state:

  ```
  mysql> SELECT LAST_INSERT_ID(3);
  +-------------------+
  | LAST_INSERT_ID(3) |
  +-------------------+
  |                 3 |
  +-------------------+

  mysql> SELECT LAST_INSERT_ID();
  +------------------+
  | LAST_INSERT_ID() |
  +------------------+
  |                3 |
  +------------------+

  mysql> resetconnection;

  mysql> SELECT LAST_INSERT_ID();
  +------------------+
  | LAST_INSERT_ID() |
  +------------------+
  |                0 |
  +------------------+
  ```

* `source file_name`, `\. file_name`

  Read the named file and executes the statements contained therein. On Windows, specify path name separators as `/` or `\\`.

  Quote characters are taken as part of the file name itself. For best results, the name should not include space characters.

* `ssl_session_data_print [file_name]`

  Fetches, serializes, and optionally stores the session data of a successful connection. The optional file name and arguments may be given to specify the file to store serialized session data. If omitted, the session data is printed to `stdout`.

  If the MySQL session is configured for reuse, session data from the file is deserialized and supplied to the `connect` command to reconnect. When the session is reused successfully, the `status` command contains a row showing `SSL session reused: true` while the client remains reconnected to the server.

* `status`, `\s`

  Provide status information about the connection and the server you are using. If you are running with `--safe-updates` enabled, `status` also prints the values for the **mysql** variables that affect your queries.

* `system command`, `\! command`

  Execute the given command using your default command interpreter.

  Prior to MySQL 8.0.19, the `system` command works only in Unix. As of 8.0.19, it also works on Windows.

  In MySQL 8.0.40 and later, this command can be disabled by starting the client with `--system-command=OFF` or `--skip-system-command`.

* `tee [file_name]`, `\T [file_name]`

  By using the `--tee` option when you invoke **mysql**, you can log statements and their output. All the data displayed on the screen is appended into a given file. This can be very useful for debugging purposes also. **mysql** flushes results to the file after each statement, just before it prints its next prompt. Tee functionality works only in interactive mode.

  You can enable this feature interactively with the `tee` command. Without a parameter, the previous file is used. The `tee` file can be disabled with the `notee` command. Executing `tee` again re-enables logging.

* `use db_name`, `\u db_name`

  Use *`db_name`* as the default database.

* `warnings`, `\W`

  Enable display of warnings after each statement (if there are any).

Here are a few tips about the `pager` command:

* You can use it to write to a file and the results go only to the file:

  ```
  mysql> pager cat > /tmp/log.txt
  ```

  You can also pass any options for the program that you want to use as your pager:

  ```
  mysql> pager less -n -i -S
  ```

* In the preceding example, note the `-S` option. You may find it very useful for browsing wide query results. Sometimes a very wide result set is difficult to read on the screen. The `-S` option to **less** can make the result set much more readable because you can scroll it horizontally using the left-arrow and right-arrow keys. You can also use `-S` interactively within **less** to switch the horizontal-browse mode on and off. For more information, read the **less** manual page:

  ```
  man less
  ```

* The `-F` and `-X` options may be used with **less** to cause it to exit if output fits on one screen, which is convenient when no scrolling is necessary:

  ```
  mysql> pager less -n -i -S -F -X
  ```

* You can specify very complex pager commands for handling query output:

  ```
  mysql> pager cat | tee /dr1/tmp/res.txt \
            | tee /dr2/tmp/res2.txt | less -n -i -S
  ```

  In this example, the command would send query results to two files in two different directories on two different file systems mounted on `/dr1` and `/dr2`, yet still display the results onscreen using **less**.

You can also combine the `tee` and `pager` functions. Have a `tee` file enabled and `pager` set to **less**, and you are able to browse the results using the **less** program and still have everything appended into a file the same time. The difference between the Unix `tee` used with the `pager` command and the **mysql** built-in `tee` command is that the built-in `tee` works even if you do not have the Unix **tee** available. The built-in `tee` also logs everything that is printed on the screen, whereas the Unix **tee** used with `pager` does not log quite that much. Additionally, `tee` file logging can be turned on and off interactively from within **mysql**. This is useful when you want to log some queries to a file, but not others.

The `prompt` command reconfigures the default `mysql>` prompt. The string for defining the prompt can contain the following special sequences.

<table summary="prompt command options that are used to configure the mysql&gt; prompt."><col style="width: 15%"/><col style="width: 75%"/><thead><tr> <th>Option</th> <th>Description</th> </tr></thead><tbody><tr> <td><code>\C</code></td> <td>The current connection identifier</td> </tr><tr> <td><code>\c</code></td> <td>A counter that increments for each statement you issue</td> </tr><tr> <td><code>\D</code></td> <td>The full current date</td> </tr><tr> <td><code>\d</code></td> <td>The default database</td> </tr><tr> <td><code>\h</code></td> <td>The server host</td> </tr><tr> <td><code>\l</code></td> <td>The current delimiter</td> </tr><tr> <td><code>\m</code></td> <td>Minutes of the current time</td> </tr><tr> <td><code>\n</code></td> <td>A newline character</td> </tr><tr> <td><code>\O</code></td> <td>The current month in three-letter format (Jan, Feb, …)</td> </tr><tr> <td><code>\o</code></td> <td>The current month in numeric format</td> </tr><tr> <td><code>\P</code></td> <td>am/pm</td> </tr><tr> <td><code>\p</code></td> <td>The current TCP/IP port or socket file</td> </tr><tr> <td><code>\R</code></td> <td>The current time, in 24-hour military time (0–23)</td> </tr><tr> <td><code>\r</code></td> <td>The current time, standard 12-hour time (1–12)</td> </tr><tr> <td><code>\S</code></td> <td>Semicolon</td> </tr><tr> <td><code>\s</code></td> <td>Seconds of the current time</td> </tr><tr> <td><code>\T</code></td> <td>Print an asterisk (<code>*</code>) if the current session is inside a transaction block (from MySQL 8.0.28)</td> </tr><tr> <td><code>\t</code></td> <td>A tab character</td> </tr><tr> <td><code>\U</code></td> <td><p> Your full <code><em class="replaceable"><code>user_name</code></em>@<em class="replaceable"><code>host_name</code></em></code> account name </p></td> </tr><tr> <td><code>\u</code></td> <td>Your user name</td> </tr><tr> <td><code>\v</code></td> <td>The server version</td> </tr><tr> <td><code>\w</code></td> <td>The current day of the week in three-letter format (Mon, Tue, …)</td> </tr><tr> <td><code>\Y</code></td> <td>The current year, four digits</td> </tr><tr> <td><code>\y</code></td> <td>The current year, two digits</td> </tr><tr> <td><code>_</code></td> <td>A space</td> </tr><tr> <td><code>\ </code></td> <td>A space (a space follows the backslash)</td> </tr><tr> <td><code>\'</code></td> <td>Single quote</td> </tr><tr> <td><code>\"</code></td> <td>Double quote</td> </tr><tr> <td><code>\\</code></td> <td>A literal <code>\</code> backslash character</td> </tr><tr> <td><code>\<em class="replaceable"><code>x</code></em></code></td> <td><p> <em class="replaceable"><code>x</code></em>, for any “<em class="replaceable"><code>x</code></em>” not listed above </p></td> </tr></tbody></table>

You can set the prompt in several ways:

* *Use an environment variable.* You can set the `MYSQL_PS1` environment variable to a prompt string. For example:

  ```
  export MYSQL_PS1="(\u@\h) [\d]> "
  ```

* *Use a command-line option.* You can set the `--prompt` option on the command line to **mysql**. For example:

  ```
  $> mysql --prompt="(\u@\h) [\d]> "
  (user@host) [database]>
  ```

* *Use an option file.* You can set the `prompt` option in the `[mysql]` group of any MySQL option file, such as `/etc/my.cnf` or the `.my.cnf` file in your home directory. For example:

  ```
  [mysql]
  prompt=(\\u@\\h) [\\d]>\_
  ```

  In this example, note that the backslashes are doubled. If you set the prompt using the `prompt` option in an option file, it is advisable to double the backslashes when using the special prompt options. There is some overlap in the set of permissible prompt options and the set of special escape sequences that are recognized in option files. (The rules for escape sequences in option files are listed in Section 6.2.2.2, “Using Option Files”.) The overlap may cause you problems if you use single backslashes. For example, `\s` is interpreted as a space rather than as the current seconds value. The following example shows how to define a prompt within an option file to include the current time in `hh:mm:ss>` format:

  ```
  [mysql]
  prompt="\\r:\\m:\\s> "
  ```

* *Set the prompt interactively.* You can change your prompt interactively by using the `prompt` (or `\R`) command. For example:

  ```
  mysql> prompt (\u@\h) [\d]>_
  PROMPT set to '(\u@\h) [\d]>_'
  (user@host) [database]>
  (user@host) [database]> prompt
  Returning to default PROMPT of mysql>
  mysql>
  ```


#### 6.5.1.3 mysql Client Logging

The **mysql** client can do these types of logging for statements executed interactively:

* On Unix, **mysql** writes the statements to a history file. By default, this file is named `.mysql_history` in your home directory. To specify a different file, set the value of the `MYSQL_HISTFILE` environment variable.

* On all platforms, if the `--syslog` option is given, **mysql** writes the statements to the system logging facility. On Unix, this is `syslog`; on Windows, it is the Windows Event Log. The destination where logged messages appear is system dependent. On Linux, the destination is often the `/var/log/messages` file.

The following discussion describes characteristics that apply to all logging types and provides information specific to each logging type.

* How Logging Occurs
* Controlling the History File
* syslog Logging Characteristics

##### How Logging Occurs

For each enabled logging destination, statement logging occurs as follows:

* Statements are logged only when executed interactively. Statements are noninteractive, for example, when read from a file or a pipe. It is also possible to suppress statement logging by using the `--batch` or `--execute` option.

* Statements are ignored and not logged if they match any pattern in the “ignore” list. This list is described later.

* **mysql** logs each nonignored, nonempty statement line individually.

* If a nonignored statement spans multiple lines (not including the terminating delimiter), **mysql** concatenates the lines to form the complete statement, maps newlines to spaces, and logs the result, plus a delimiter.

Consequently, an input statement that spans multiple lines can be logged twice. Consider this input:

```
mysql> SELECT
    -> 'Today is'
    -> ,
    -> CURDATE()
    -> ;
```

In this case, **mysql** logs the “SELECT”, “'Today is'”, “,”, “CURDATE()”, and “;” lines as it reads them. It also logs the complete statement, after mapping `SELECT\n'Today is'\n,\nCURDATE()` to `SELECT 'Today is' , CURDATE()`, plus a delimiter. Thus, these lines appear in logged output:

```
SELECT
'Today is'
,
CURDATE()
;
SELECT 'Today is' , CURDATE();
```

**mysql** ignores for logging purposes statements that match any pattern in the “ignore” list. By default, the pattern list is `"*IDENTIFIED*:*PASSWORD*"`, to ignore statements that refer to passwords. Pattern matching is not case-sensitive. Within patterns, two characters are special:

* `?` matches any single character.
* `*` matches any sequence of zero or more characters.

To specify additional patterns, use the `--histignore` option or set the `MYSQL_HISTIGNORE` environment variable. (If both are specified, the option value takes precedence.) The value should be a list of one or more colon-separated patterns, which are appended to the default pattern list.

Patterns specified on the command line might need to be quoted or escaped to prevent your command interpreter from treating them specially. For example, to suppress logging for `UPDATE` and `DELETE` statements in addition to statements that refer to passwords, invoke **mysql** like this:

```
mysql --histignore="*UPDATE*:*DELETE*"
```

##### Controlling the History File

The `.mysql_history` file should be protected with a restrictive access mode because sensitive information might be written to it, such as the text of SQL statements that contain passwords. See Section 8.1.2.1, “End-User Guidelines for Password Security”. Statements in the file are accessible from the **mysql** client when the **up-arrow** key is used to recall the history. See Disabling Interactive History.

If you do not want to maintain a history file, first remove `.mysql_history` if it exists. Then use either of the following techniques to prevent it from being created again:

* Set the `MYSQL_HISTFILE` environment variable to `/dev/null`. To cause this setting to take effect each time you log in, put it in one of your shell's startup files.

* Create `.mysql_history` as a symbolic link to `/dev/null`; this need be done only once:

  ```
  ln -s /dev/null $HOME/.mysql_history
  ```

##### syslog Logging Characteristics

If the `--syslog` option is given, **mysql** writes interactive statements to the system logging facility. Message logging has the following characteristics.

Logging occurs at the “information” level. This corresponds to the `LOG_INFO` priority for `syslog` on Unix/Linux `syslog` capability and to `EVENTLOG_INFORMATION_TYPE` for the Windows Event Log. Consult your system documentation for configuration of your logging capability.

Message size is limited to 1024 bytes.

Messages consist of the identifier `MysqlClient` followed by these values:

* `SYSTEM_USER`

  The operating system user name (login name) or `--` if the user is unknown.

* `MYSQL_USER`

  The MySQL user name (specified with the `--user` option) or `--` if the user is unknown.

* `CONNECTION_ID`:

  The client connection identifier. This is the same as the `CONNECTION_ID()` function value within the session.

* `DB_SERVER`

  The server host or `--` if the host is unknown.

* `DB`

  The default database or `--` if no database has been selected.

* `QUERY`

  The text of the logged statement.

Here is a sample of output generated on Linux by using `--syslog`. This output is formatted for readability; each logged message actually takes a single line.

```
Mar  7 12:39:25 myhost MysqlClient[20824]:
  SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
  DB_SERVER:'127.0.0.1', DB:'--', QUERY:'USE test;'
Mar  7 12:39:28 myhost MysqlClient[20824]:
  SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
  DB_SERVER:'127.0.0.1', DB:'test', QUERY:'SHOW TABLES;'
```


#### 6.5.1.4 mysql Client Server-Side Help

```
mysql> help search_string
```

If you provide an argument to the `help` command, **mysql** uses it as a search string to access server-side help from the contents of the MySQL Reference Manual. The proper operation of this command requires that the help tables in the `mysql` database be initialized with help topic information (see Section 7.1.17, “Server-Side Help Support”).

If there is no match for the search string, the search fails:

```
mysql> help me

Nothing found
Please try to run 'help contents' for a list of all accessible topics
```

Use **help contents** to see a list of the help categories:

```
mysql> help contents
You asked for help about help category: "Contents"
For more information, type 'help <item>', where <item> is one of the
following categories:
   Account Management
   Administration
   Data Definition
   Data Manipulation
   Data Types
   Functions
   Functions and Modifiers for Use with GROUP BY
   Geographic Features
   Language Structure
   Plugins
   Storage Engines
   Stored Routines
   Table Maintenance
   Transactions
   Triggers
```

If the search string matches multiple items, **mysql** shows a list of matching topics:

```
mysql> help logs
Many help items for your request exist.
To make a more specific request, please type 'help <item>',
where <item> is one of the following topics:
   SHOW
   SHOW BINARY LOGS
   SHOW ENGINE
   SHOW LOGS
```

Use a topic as the search string to see the help entry for that topic:

```
mysql> help show binary logs
Name: 'SHOW BINARY LOGS'
Description:
Syntax:
SHOW BINARY LOGS
SHOW MASTER LOGS

Lists the binary log files on the server. This statement is used as
part of the procedure described in [purge-binary-logs], that shows how
to determine which logs can be purged.
```

```
mysql> SHOW BINARY LOGS;
+---------------+-----------+-----------+
| Log_name      | File_size | Encrypted |
+---------------+-----------+-----------+
| binlog.000015 |    724935 | Yes       |
| binlog.000016 |    733481 | Yes       |
+---------------+-----------+-----------+
```

The search string can contain the wildcard characters `%` and `_`. These have the same meaning as for pattern-matching operations performed with the `LIKE` operator. For example, `HELP rep%` returns a list of topics that begin with `rep`:

```
mysql> HELP rep%
Many help items for your request exist.
To make a more specific request, please type 'help <item>',
where <item> is one of the following
topics:
   REPAIR TABLE
   REPEAT FUNCTION
   REPEAT LOOP
   REPLACE
   REPLACE FUNCTION
```


#### 6.5.1.5 Executing SQL Statements from a Text File

The **mysql** client typically is used interactively, like this:

```
mysql db_name
```

However, it is also possible to put your SQL statements in a file and then tell **mysql** to read its input from that file. To do so, create a text file *`text_file`* that contains the statements you wish to execute. Then invoke **mysql** as shown here:

```
mysql db_name < text_file
```

If you place a `USE db_name` statement as the first statement in the file, it is unnecessary to specify the database name on the command line:

```
mysql < text_file
```

If you are already running **mysql**, you can execute an SQL script file using the `source` command or `\.` command:

```
mysql> source file_name
mysql> \. file_name
```

Sometimes you may want your script to display progress information to the user. For this you can insert statements like this:

```
SELECT '<info_to_display>' AS ' ';
```

The statement shown outputs `<info_to_display>`.

You can also invoke **mysql** with the `--verbose` option, which causes each statement to be displayed before the result that it produces.

**mysql** ignores Unicode byte order mark (BOM) characters at the beginning of input files. Previously, it read them and sent them to the server, resulting in a syntax error. Presence of a BOM does not cause **mysql** to change its default character set. To do that, invoke **mysql** with an option such as `--default-character-set=utf8mb4`.

For more information about batch mode, see Section 5.5, “Using mysql in Batch Mode”.


#### 6.5.1.6 mysql Client Tips

This section provides information about techniques for more effective use of **mysql** and about **mysql** operational behavior.

* Input-Line Editing
* Disabling Interactive History
* Unicode Support on Windows
* Displaying Query Results Vertically
* Using Safe-Updates Mode (--safe-updates)")
* Disabling mysql Auto-Reconnect
* mysql Client Parser Versus Server Parser

##### Input-Line Editing

**mysql** supports input-line editing, which enables you to modify the current input line in place or recall previous input lines. For example, the **left-arrow** and **right-arrow** keys move horizontally within the current input line, and the **up-arrow** and **down-arrow** keys move up and down through the set of previously entered lines. **Backspace** deletes the character before the cursor and typing new characters enters them at the cursor position. To enter the line, press **Enter**.

On Windows, the editing key sequences are the same as supported for command editing in console windows. On Unix, the key sequences depend on the input library used to build **mysql** (for example, the `libedit` or `readline` library).

Documentation for the `libedit` and `readline` libraries is available online. To change the set of key sequences permitted by a given input library, define key bindings in the library startup file. This is a file in your home directory: `.editrc` for `libedit` and `.inputrc` for `readline`.

For example, in `libedit`, **Control+W** deletes everything before the current cursor position and **Control+U** deletes the entire line. In `readline`, **Control+W** deletes the word before the cursor and **Control+U** deletes everything before the current cursor position. If **mysql** was built using `libedit`, a user who prefers the `readline` behavior for these two keys can put the following lines in the `.editrc` file (creating the file if necessary):

```
bind "^W" ed-delete-prev-word
bind "^U" vi-kill-line-prev
```

To see the current set of key bindings, temporarily put a line that says only `bind` at the end of `.editrc`. **mysql** shows the bindings when it starts.

##### Disabling Interactive History

The **up-arrow** key enables you to recall input lines from current and previous sessions. In cases where a console is shared, this behavior may be unsuitable. **mysql** supports disabling the interactive history partially or fully, depending on the host platform.

On Windows, the history is stored in memory. **Alt+F7** deletes all input lines stored in memory for the current history buffer. It also deletes the list of sequential numbers in front of the input lines displayed with **F7** and recalled (by number) with **F9**. New input lines entered after you press **Alt+F7** repopulate the current history buffer. Clearing the buffer does not prevent logging to the Windows Event Viewer, if the `--syslog` option was used to start **mysql**. Closing the console window also clears the current history buffer.

To disable interactive history on Unix, first delete the `.mysql_history` file, if it exists (previous entries are recalled otherwise). Then start **mysql** with the `--histignore="*"` option to ignore all new input lines. To re-enable the recall (and logging) behavior, restart **mysql** without the option.

If you prevent the `.mysql_history` file from being created (see Controlling the History File) and use `--histignore="*"` to start the **mysql** client, the interactive history recall facility is disabled fully. Alternatively, if you omit the `--histignore` option, you can recall the input lines entered during the current session.

##### Unicode Support on Windows

Windows provides APIs based on UTF-16LE for reading from and writing to the console; the **mysql** client for Windows is able to use these APIs. The Windows installer creates an item in the MySQL menu named `MySQL command line client - Unicode`. This item invokes the **mysql** client with properties set to communicate through the console to the MySQL server using Unicode.

To take advantage of this support manually, run **mysql** within a console that uses a compatible Unicode font and set the default character set to a Unicode character set that is supported for communication with the server:

1. Open a console window.
2. Go to the console window properties, select the font tab, and choose Lucida Console or some other compatible Unicode font. This is necessary because console windows start by default using a DOS raster font that is inadequate for Unicode.

3. Execute **mysql.exe** with the `--default-character-set=utf8mb4` (or `utf8mb3`) option. This option is necessary because `utf16le` is one of the character sets that cannot be used as the client character set. See Impermissible Client Character Sets.

With those changes, **mysql** uses the Windows APIs to communicate with the console using UTF-16LE, and communicate with the server using UTF-8. (The menu item mentioned previously sets the font and character set as just described.)

To avoid those steps each time you run **mysql**, you can create a shortcut that invokes **mysql.exe**. The shortcut should set the console font to Lucida Console or some other compatible Unicode font, and pass the `--default-character-set=utf8mb4` (or `utf8mb3`) option to **mysql.exe**.

Alternatively, create a shortcut that only sets the console font, and set the character set in the `[mysql]` group of your `my.ini` file:

```
[mysql]
default-character-set=utf8mb4   # or utf8mb3
```

##### Displaying Query Results Vertically

Some query results are much more readable when displayed vertically, instead of in the usual horizontal table format. Queries can be displayed vertically by terminating the query with \G instead of a semicolon. For example, longer text values that include newlines often are much easier to read with vertical output:

```
mysql> SELECT * FROM mails WHERE LENGTH(txt) < 300 LIMIT 300,1\G
*************************** 1. row ***************************
  msg_nro: 3068
     date: 2000-03-01 23:29:50
time_zone: +0200
mail_from: Jones
    reply: jones@example.com
  mail_to: "John Smith" <smith@example.com>
      sbj: UTF-8
      txt: >>>>> "John" == John Smith writes:

John> Hi.  I think this is a good idea.  Is anyone familiar
John> with UTF-8 or Unicode? Otherwise, I'll put this on my
John> TODO list and see what happens.

Yes, please do that.

Regards,
Jones
     file: inbox-jani-1
     hash: 190402944
1 row in set (0.09 sec)
```

##### Using Safe-Updates Mode (--safe-updates)

For beginners, a useful startup option is `--safe-updates` (or `--i-am-a-dummy`, which has the same effect). Safe-updates mode is helpful for cases when you might have issued an `UPDATE` or `DELETE` statement but forgotten the `WHERE` clause indicating which rows to modify. Normally, such statements update or delete all rows in the table. With `--safe-updates`, you can modify rows only by specifying the key values that identify them, or a `LIMIT` clause, or both. This helps prevent accidents. Safe-updates mode also restricts `SELECT` statements that produce (or are estimated to produce) very large result sets.

The `--safe-updates` option causes **mysql** to execute the following statement when it connects to the MySQL server, to set the session values of the `sql_safe_updates`, `sql_select_limit`, and `max_join_size` system variables:

```
SET sql_safe_updates=1, sql_select_limit=1000, max_join_size=1000000;
```

The `SET` statement affects statement processing as follows:

* Enabling `sql_safe_updates` causes `UPDATE` and `DELETE` statements to produce an error if they do not specify a key constraint in the `WHERE` clause, or provide a `LIMIT` clause, or both. For example:

  ```
  UPDATE tbl_name SET not_key_column=val WHERE key_column=val;

  UPDATE tbl_name SET not_key_column=val LIMIT 1;
  ```

* Setting `sql_select_limit` to 1,000 causes the server to limit all `SELECT` result sets to 1,000 rows unless the statement includes a `LIMIT` clause.

* Setting `max_join_size` to 1,000,000 causes multiple-table `SELECT` statements to produce an error if the server estimates it must examine more than 1,000,000 row combinations.

To specify result set limits different from 1,000 and 1,000,000, you can override the defaults by using the `--select-limit` and `--max-join-size` options when you invoke **mysql**:

```
mysql --safe-updates --select-limit=500 --max-join-size=10000
```

It is possible for `UPDATE` and `DELETE` statements to produce an error in safe-updates mode even with a key specified in the `WHERE` clause, if the optimizer decides not to use the index on the key column:

* Range access on the index cannot be used if memory usage exceeds that permitted by the `range_optimizer_max_mem_size` system variable. The optimizer then falls back to a table scan. See Limiting Memory Use for Range Optimization.

* If key comparisons require type conversion, the index may not be used (see Section 10.3.1, “How MySQL Uses Indexes”). Suppose that an indexed string column `c1` is compared to a numeric value using `WHERE c1 = 2222`. For such comparisons, the string value is converted to a number and the operands are compared numerically (see Section 14.3, “Type Conversion in Expression Evaluation”), preventing use of the index. If safe-updates mode is enabled, an error occurs.

As of MySQL 8.0.13, safe-updates mode also includes these behaviors:

* `EXPLAIN` with `UPDATE` and `DELETE` statements does not produce safe-updates errors. This enables use of `EXPLAIN` plus `SHOW WARNINGS` to see why an index is not used, which can be helpful in cases such as when a `range_optimizer_max_mem_size` violation or type conversion occurs and the optimizer does not use an index even though a key column was specified in the `WHERE` clause.

* When a safe-updates error occurs, the error message includes the first diagnostic that was produced, to provide information about the reason for failure. For example, the message may indicate that the `range_optimizer_max_mem_size` value was exceeded or type conversion occurred, either of which can preclude use of an index.

* For multiple-table deletes and updates, an error is produced with safe updates enabled only if any target table uses a table scan.

##### Disabling mysql Auto-Reconnect

If the **mysql** client loses its connection to the server while sending a statement, it immediately and automatically tries to reconnect once to the server and send the statement again. However, even if **mysql** succeeds in reconnecting, your first connection has ended and all your previous session objects and settings are lost: temporary tables, the autocommit mode, and user-defined and session variables. Also, any current transaction rolls back. This behavior may be dangerous for you, as in the following example where the server was shut down and restarted between the first and second statements without you knowing it:

```
mysql> SET @a=1;
Query OK, 0 rows affected (0.05 sec)

mysql> INSERT INTO t VALUES(@a);
ERROR 2006: MySQL server has gone away
No connection. Trying to reconnect...
Connection id:    1
Current database: test

Query OK, 1 row affected (1.30 sec)

mysql> SELECT * FROM t;
+------+
| a    |
+------+
| NULL |
+------+
1 row in set (0.05 sec)
```

The `@a` user variable has been lost with the connection, and after the reconnection it is undefined. If it is important to have **mysql** terminate with an error if the connection has been lost, you can start the **mysql** client with the `--skip-reconnect` option.

For more information about auto-reconnect and its effect on state information when a reconnection occurs, see Automatic Reconnection Control.

##### mysql Client Parser Versus Server Parser

The **mysql** client uses a parser on the client side that is not a duplicate of the complete parser used by the **mysqld** server on the server side. This can lead to differences in treatment of certain constructs. Examples:

* The server parser treats strings delimited by `"` characters as identifiers rather than as plain strings if the `ANSI_QUOTES` SQL mode is enabled.

  The **mysql** client parser does not take the `ANSI_QUOTES` SQL mode into account. It treats strings delimited by `"`, `'`, and `` ` `` characters the same, regardless of whether `ANSI_QUOTES` is enabled.

* Within `/*! ... */` and `/*+ ... */` comments, the **mysql** client parser interprets short-form **mysql** commands. The server parser does not interpret them because these commands have no meaning on the server side.

  If it is desirable for **mysql** not to interpret short-form commands within comments, a partial workaround is to use the `--binary-mode` option, which causes all **mysql** commands to be disabled except `\C` and `\d` in noninteractive mode (for input piped to **mysql** or loaded using the `source` command).


### 6.5.2 mysqladmin — A MySQL Server Administration Program

**mysqladmin** is a client for performing administrative operations. You can use it to check the server's configuration and current status, to create and drop databases, and more.

Invoke **mysqladmin** like this:

```
mysqladmin [options] command [command-arg] [command [command-arg]] ...
```

**mysqladmin** supports the following commands. Some of the commands take an argument following the command name.

* `create db_name`

  Create a new database named *`db_name`*.

* `debug`

  Prior to MySQL 8.0.20, tell the server to write debug information to the error log. The connected user must have the `SUPER` privilege. Format and content of this information is subject to change.

  This includes information about the Event Scheduler. See Section 27.4.5, “Event Scheduler Status”.

* `drop db_name`

  Delete the database named *`db_name`* and all its tables.

* `extended-status`

  Display the server status variables and their values.

* `flush-hosts`

  Flush all information in the host cache. See Section 7.1.12.3, “DNS Lookups and the Host Cache”.

* `flush-logs [log_type ...]`

  Flush all logs.

  The **mysqladmin flush-logs** command permits optional log types to be given, to specify which logs to flush. Following the `flush-logs` command, you can provide a space-separated list of one or more of the following log types: `binary`, `engine`, `error`, `general`, `relay`, `slow`. These correspond to the log types that can be specified for the [`FLUSH LOGS`](flush.html#flush-logs) SQL statement.

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

  To kill threads belonging to other users, the connected user must have the `CONNECTION_ADMIN` privilege (or the deprecated `SUPER` privilege).

* `password new_password`

  Set a new password. This changes the password to *`new_password`* for the account that you use with **mysqladmin** for connecting to the server. Thus, the next time you invoke **mysqladmin** (or any other client program) using the same account, you must specify the new password.

  Warning

  Setting a password using **mysqladmin** should be considered *insecure*. On some systems, your password becomes visible to system status programs such as **ps** that may be invoked by other users to display command lines. MySQL clients typically overwrite the command-line password argument with zeros during their initialization sequence. However, there is still a brief interval during which the value is visible. Also, on some systems this overwriting strategy is ineffective and the password remains visible to **ps**. (SystemV Unix systems and perhaps others are subject to this problem.)

  If the *`new_password`* value contains spaces or other characters that are special to your command interpreter, you need to enclose it within quotation marks. On Windows, be sure to use double quotation marks rather than single quotation marks; single quotation marks are not stripped from the password, but rather are interpreted as part of the password. For example:

  ```
  mysqladmin password "my new password"
  ```

  The new password can be omitted following the `password` command. In this case, **mysqladmin** prompts for the password value, which enables you to avoid specifying the password on the command line. Omitting the password value should be done only if `password` is the final command on the **mysqladmin** command line. Otherwise, the next argument is taken as the password.

  Caution

  Do not use this command used if the server was started with the `--skip-grant-tables` option. No password change is applied. This is true even if you precede the `password` command with `flush-privileges` on the same command line to re-enable the grant tables because the flush operation occurs after you connect. However, you can use **mysqladmin flush-privileges** to re-enable the grant tables and then use a separate **mysqladmin password** command to change the password.

* `ping`

  Check whether the server is available. The return status from **mysqladmin** is 0 if the server is running, 1 if it is not. This is 0 even in case of an error such as `Access denied`, because this means that the server is running but refused the connection, which is different from the server not running.

* `processlist`

  Show a list of active server threads. This is like the output of the [`SHOW PROCESSLIST`](show-processlist.html "15.7.7.29 SHOW PROCESSLIST Statement") statement. If the `--verbose` option is given, the output is like that of [`SHOW FULL PROCESSLIST`](show-processlist.html "15.7.7.29 SHOW PROCESSLIST Statement"). (See Section 15.7.7.29, “SHOW PROCESSLIST Statement”.)

* `reload`

  Reload the grant tables.

* `refresh`

  Flush all tables and close and open log files.

* `shutdown`

  Stop the server.

* `start-replica`

  Start replication on a replica server. Use this command from MySQL 8.0.26.

* `start-slave`

  Start replication on a replica server. Use this command before MySQL 8.0.26.

* `status`

  Display a short server status message.

* `stop-replica`

  Stop replication on a replica server. Use this command from MySQL 8.0.26.

* `stop-slave`

  Stop replication on a replica server. Use this command before MySQL 8.0.26.

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

The **mysqladmin status** command result displays the following values:

* `Uptime`

  The number of seconds the MySQL server has been running.

* `Threads`

  The number of active threads (clients).

* `Questions`

  The number of questions (queries) from clients since the server was started.

* `Slow queries`

  The number of queries that have taken more than `long_query_time` seconds. See Section 7.4.5, “The Slow Query Log”.

* `Opens`

  The number of tables the server has opened.

* `Flush tables`

  The number of `flush-*`, `refresh`, and `reload` commands the server has executed.

* `Open tables`

  The number of tables that currently are open.

If you execute **mysqladmin shutdown** when connecting to a local server using a Unix socket file, **mysqladmin** waits until the server's process ID file has been removed, to ensure that the server has stopped properly.

**mysqladmin** supports the following options, which can be specified on the command line or in the `[mysqladmin]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see Section 6.2.2.2, “Using Option Files”.

**Table 6.13 mysqladmin Options**

<table frame="box" rules="all" summary="Command-line options available for mysqladmin."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--bind-address</th> <td>Use specified network interface to connect to MySQL Server</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Directory where character sets can be found</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compress all information sent between client and server</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Permitted compression algorithms for connections to server</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--connect-timeout</th> <td>Number of seconds before connection timeout</td> <td></td> <td></td> </tr><tr><th scope="row">--count</th> <td>Number of iterations to make for repeated command execution</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Print debugging information when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Print debugging information, memory, and CPU statistics when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Authentication plugin to use</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Specify default character set</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Read named option file in addition to usual option files</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Read only named option file</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Option group suffix value</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Enable cleartext authentication plugin</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue even if an SQL error occurs</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Request RSA public key from server</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Display help message and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Host on which MySQL server is located</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Read login path options from .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--no-beep</th> <td>Do not beep when errors occur</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Read no option files</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Password to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>First multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Second multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Third multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Connect to server using named pipe (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Directory where plugins are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Transport protocol to use</td> <td></td> <td></td> </tr><tr><th scope="row">--relative</th> <td>Show the difference between the current and previous values when used with the --sleep option</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Path name to file containing RSA public key</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Shared-memory name for shared-memory connections (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--show-warnings</th> <td>Show warnings after statement execution</td> <td></td> <td></td> </tr><tr><th scope="row">--shutdown-timeout</th> <td>The maximum number of seconds to wait for server shutdown</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--sleep</th> <td>Execute commands repeatedly, sleeping for delay seconds in between</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Unix socket file or Windows named pipe to use</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>File that contains list of trusted SSL Certificate Authorities</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>File that contains X.509 certificate</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Permissible ciphers for connection encryption</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>File that contains certificate revocation lists</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Directory that contains certificate revocation-list files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Whether to enable FIPS mode on client side</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>File that contains X.509 key</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Desired security state of connection to server</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>File that contains SSL session data</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Whether to establish connections if session reuse fails</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Permissible TLS protocols for encrypted connections</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>MySQL user name to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Display version information and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--vertical</th> <td>Print query output rows vertically (one line per column value)</td> <td></td> <td></td> </tr><tr><th scope="row">--wait</th> <td>If the connection cannot be established, wait and retry instead of aborting</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Compression level for connections to server that use zstd compression</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On a computer having multiple network interfaces, use this option to select which interface to use for connecting to the MySQL server.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  The directory where character sets are installed. See Section 12.15, “Character Set Configuration”.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compress all information sent between the client and the server if possible. See Section 6.2.8, “Connection Compression Control”.

  As of MySQL 8.0.18, this option is deprecated. Expect it to be removed in a future version of MySQL. See Configuring Legacy Connection Compression.

* `--compression-algorithms=value`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>

  The permitted compression algorithms for connections to the server. The available algorithms are the same as for the `protocol_compression_algorithms` system variable. The default value is `uncompressed`.

  For more information, see Section 6.2.8, “Connection Compression Control”.

  This option was added in MySQL 8.0.18.

* `--connect-timeout=value`

  <table frame="box" rules="all" summary="Properties for connect-timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-timeout=value</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>43200</code></td> </tr></tbody></table>

  The maximum number of seconds before connection timeout. The default value is 43200 (12 hours).

* `--count=N`, `-c N`

  <table frame="box" rules="all" summary="Properties for count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--count=#</code></td> </tr></tbody></table>

  The number of iterations to make for repeated command execution if the `--sleep` option is given.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:o,/tmp/mysqladmin.trace</code></td> </tr></tbody></table>

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:o,/tmp/mysqladmin.trace`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for debug-check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-check</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-info`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

  Print debugging information and memory and CPU usage statistics when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

  A hint about which client-side authentication plugin to use. See Section 8.2.17, “Pluggable Authentication”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

  Use *`charset_name`* as the default character set. See Section 12.15, “Character Set Configuration”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysqladmin** normally reads the `[client]` and `[mysqladmin]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysqladmin** also reads the `[client_other]` and `[mysqladmin_other]` groups.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

  Enable the `mysql_clear_password` cleartext authentication plugin. (See Section 8.4.1.4, “Client-Side Cleartext Pluggable Authentication”.)

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

  Do not ask for confirmation for the `drop db_name` command. With multiple commands, continue even if an error occurs.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

  Request from the server the public key required for RSA key pair-based password exchange. This option applies to clients that authenticate with the `caching_sha2_password` authentication plugin. For that plugin, the server does not send the public key unless requested. This option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the `caching_sha2_password` plugin, see Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

  Connect to the MySQL server on the given host.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql_config_editor** utility. See Section 6.6.7, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--no-beep`, `-b`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

  Suppress the warning beep that is emitted by default for errors such as a failure to connect to the server.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql_config_editor** utility. See Section 6.6.7, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqladmin** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqladmin** should not prompt for one, use the `--skip-password` option.

* `--password1[=pass_val]`

  The password for multifactor authentication factor 1 of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysql** prompts for one. If given, there must be *no space* between `--password1=` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqladmin** should not prompt for one, use the `--skip-password1` option.

  `--password1` and `--password` are synonymous, as are `--skip-password1` and `--skip-password`.

* `--password2[=pass_val]`

  The password for multifactor authentication factor 2 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.

* `--password3[=pass_val]`

  The password for multifactor authentication factor 3 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

  On Windows, connect to the server using a named pipe. This option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysqladmin** does not find it. See Section 8.2.17, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

  For TCP/IP connections, the port number to use.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>8

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 6.2.7, “Connection Transport Protocols”.

* `--relative`, `-r`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>9

  Show the difference between the current and previous values when used with the `--sleep` option. This option works only with the `extended-status` command.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or `caching_sha2_password` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and `caching_sha2_password` plugins, see Section 8.4.1.3, “SHA-256 Pluggable Authentication”, and Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

  On Windows, the shared-memory name to use for connections made using shared memory to a local server. The default value is `MYSQL`. The shared-memory name is case-sensitive.

  This option applies only if the server was started with the `shared_memory` system variable enabled to support shared-memory connections.

* `--show-warnings`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

  Show warnings resulting from execution of statements sent to the server.

* `--shutdown-timeout=value`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

  The maximum number of seconds to wait for server shutdown. The default value is 3600 (1 hour).

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

  Exit silently if a connection to the server cannot be established.

* `--sleep=delay`, `-i delay`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>5

  Execute commands repeatedly, sleeping for *`delay`* seconds in between. The `--count` option determines the number of iterations. If `--count` is not given, **mysqladmin** executes commands indefinitely until interrupted.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>6

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>7

  Controls whether to enable FIPS mode on the client side. The `--ssl-fips-mode` option differs from other `--ssl-xxx` options in that it is not used to establish encrypted connections, but rather to affect which cryptographic operations to permit. See Section 8.8, “FIPS Support”.

  These `--ssl-fips-mode` values are permitted:

  + `OFF`: Disable FIPS mode.
  + `ON`: Enable FIPS mode.
  + `STRICT`: Enable “strict” FIPS mode.

  Note

  If the OpenSSL FIPS Object Module is not available, the only permitted value for `--ssl-fips-mode` is `OFF`. In this case, setting `--ssl-fips-mode` to `ON` or `STRICT` causes the client to produce a warning at startup and to operate in non-FIPS mode.

  As of MySQL 8.0.34, this option is deprecated. Expect it to be removed in a future version of MySQL.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>8

  The permissible ciphersuites for encrypted connections that use TLSv1.3. The value is a list of one or more colon-separated ciphersuite names. The ciphersuites that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 8.0.16.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>9

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

  The user name of the MySQL account to use for connecting to the server.

  If you are using the `Rewriter` plugin with MySQL 8.0.31 or later, you should grant this user the `SKIP_QUERY_REWRITE` privilege.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

  Verbose mode. Print more information about what the program does.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

  Display version information and exit.

* `--vertical`, `-E`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>3

  Print output vertically. This is similar to `--relative`, but prints output vertically.

* `--wait[=count]`, `-w[count]`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>4

  If the connection cannot be established, wait and retry instead of aborting. If a *`count`* value is given, it indicates the number of times to retry. The default is one time.

* `--zstd-compression-level=level`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>5

  The compression level to use for connections to the server that use the `zstd` compression algorithm. The permitted levels are from 1 to 22, with larger values indicating increasing levels of compression. The default `zstd` compression level is 3. The compression level setting has no effect on connections that do not use `zstd` compression.

  For more information, see Section 6.2.8, “Connection Compression Control”.

  This option was added in MySQL 8.0.18.


### 6.5.3 mysqlcheck — A Table Maintenance Program

The **mysqlcheck** client performs table maintenance: It checks, repairs, optimizes, or analyzes tables.

Each table is locked and therefore unavailable to other sessions while it is being processed, although for check operations, the table is locked with a `READ` lock only (see Section 15.3.6, “LOCK TABLES and UNLOCK TABLES Statements”, for more information about `READ` and `WRITE` locks). Table maintenance operations can be time-consuming, particularly for large tables. If you use the `--databases` or `--all-databases` option to process all tables in one or more databases, an invocation of **mysqlcheck** might take a long time. (This is also true for the MySQL upgrade procedure if it determines that table checking is needed because it processes tables the same way.)

**mysqlcheck** must be used when the **mysqld** server is running, which means that you do not have to stop the server to perform table maintenance.

**mysqlcheck** uses the SQL statements `CHECK TABLE`, `REPAIR TABLE`, `ANALYZE TABLE`, and `OPTIMIZE TABLE` in a convenient way for the user. It determines which statements to use for the operation you want to perform, and then sends the statements to the server to be executed. For details about which storage engines each statement works with, see the descriptions for those statements in Section 15.7.3, “Table Maintenance Statements”.

All storage engines do not necessarily support all four maintenance operations. In such cases, an error message is displayed. For example, if `test.t` is an `MEMORY` table, an attempt to check it produces this result:

```
$> mysqlcheck test t
test.t
note     : The storage engine for the table doesn't support check
```

If **mysqlcheck** is unable to repair a table, see Section 3.14, “Rebuilding or Repairing Tables or Indexes” for manual table repair strategies. This is the case, for example, for `InnoDB` tables, which can be checked with `CHECK TABLE`, but not repaired with `REPAIR TABLE`.

Caution

It is best to make a backup of a table before performing a table repair operation; under some circumstances the operation might cause data loss. Possible causes include but are not limited to file system errors.

There are three general ways to invoke **mysqlcheck**:

```
mysqlcheck [options] db_name [tbl_name ...]
mysqlcheck [options] --databases db_name ...
mysqlcheck [options] --all-databases
```

If you do not name any tables following *`db_name`* or if you use the `--databases` or `--all-databases` option, entire databases are checked.

**mysqlcheck** has a special feature compared to other client programs. The default behavior of checking tables (`--check`) can be changed by renaming the binary. If you want to have a tool that repairs tables by default, you should just make a copy of **mysqlcheck** named **mysqlrepair**, or make a symbolic link to **mysqlcheck** named **mysqlrepair**. If you invoke **mysqlrepair**, it repairs tables.

The names shown in the following table can be used to change **mysqlcheck** default behavior.

<table summary="Command names that can be used to change mysqlcheck default behavior."><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>Command</th> <th>Meaning</th> </tr></thead><tbody><tr> <td>mysqlrepair</td> <td>The default option is <code>--repair</code></td> </tr><tr> <td>mysqlanalyze</td> <td>The default option is <code>--analyze</code></td> </tr><tr> <td>mysqloptimize</td> <td>The default option is <code>--optimize</code></td> </tr></tbody></table>

**mysqlcheck** supports the following options, which can be specified on the command line or in the `[mysqlcheck]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see Section 6.2.2.2, “Using Option Files”.

**Table 6.14 mysqlcheck Options**

<table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--all-databases</th> <td>Check all tables in all databases</td> <td></td> <td></td> </tr><tr><th scope="row">--all-in-1</th> <td>Execute a single statement for each database that names all the tables from that database</td> <td></td> <td></td> </tr><tr><th scope="row">--analyze</th> <td>Analyze the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-repair</th> <td>If a checked table is corrupted, automatically fix it</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use specified network interface to connect to MySQL Server</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Directory where character sets are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--check</th> <td>Check the tables for errors</td> <td></td> <td></td> </tr><tr><th scope="row">--check-only-changed</th> <td>Check only tables that have changed since the last check</td> <td></td> <td></td> </tr><tr><th scope="row">--check-upgrade</th> <td>Invoke CHECK TABLE with the FOR UPGRADE option</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compress all information sent between client and server</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Permitted compression algorithms for connections to server</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interpret all arguments as database names</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Print debugging information when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Print debugging information, memory, and CPU statistics when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Authentication plugin to use</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Specify default character set</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Read named option file in addition to usual option files</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Read only named option file</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Option group suffix value</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Enable cleartext authentication plugin</td> <td></td> <td></td> </tr><tr><th scope="row">--extended</th> <td>Check and repair tables</td> <td></td> <td></td> </tr><tr><th scope="row">--fast</th> <td>Check only tables that have not been closed properly</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue even if an SQL error occurs</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Request RSA public key from server</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Display help message and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Host on which MySQL server is located</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Read login path options from .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--medium-check</th> <td>Do a check that is faster than an --extended operation</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Read no option files</td> <td></td> <td></td> </tr><tr><th scope="row">--optimize</th> <td>Optimize the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Password to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>First multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Second multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Third multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Connect to server using named pipe (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Directory where plugins are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Transport protocol to use</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>The fastest method of checking</td> <td></td> <td></td> </tr><tr><th scope="row">--repair</th> <td>Perform a repair that can fix almost anything except unique keys that are not unique</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Path name to file containing RSA public key</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Shared-memory name for shared-memory connections (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-database</th> <td>Omit this database from performed operations</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Unix socket file or Windows named pipe to use</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>File that contains list of trusted SSL Certificate Authorities</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>File that contains X.509 certificate</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Permissible ciphers for connection encryption</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>File that contains certificate revocation lists</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Directory that contains certificate revocation-list files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Whether to enable FIPS mode on client side</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>File that contains X.509 key</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Desired security state of connection to server</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>File that contains SSL session data</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Whether to establish connections if session reuse fails</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tables</th> <td>Overrides the --databases or -B option</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Permissible TLS protocols for encrypted connections</td> <td></td> <td></td> </tr><tr><th scope="row">--use-frm</th> <td>For repair operations on MyISAM tables</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>MySQL user name to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Display version information and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--write-binlog</th> <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Compression level for connections to server that use zstd compression</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--all-databases`, `-A`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  Check all tables in all databases. This is the same as using the `--databases` option and naming all the databases on the command line, except that the `INFORMATION_SCHEMA` and `performance_schema` databases are not checked. They can be checked by explicitly naming them with the `--databases` option.

* `--all-in-1`, `-1`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>

  Instead of issuing a statement for each table, execute a single statement for each database that names all the tables from that database to be processed.

* `--analyze`, `-a`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>

  Analyze the tables.

* `--auto-repair`

  <table frame="box" rules="all" summary="Properties for auto-repair"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-repair</code></td> </tr></tbody></table>

  If a checked table is corrupted, automatically fix it. Any necessary repairs are done after all tables have been checked.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On a computer having multiple network interfaces, use this option to select which interface to use for connecting to the MySQL server.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The directory where character sets are installed. See Section 12.15, “Character Set Configuration”.

* `--check`, `-c`

  <table frame="box" rules="all" summary="Properties for check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--check</code></td> </tr></tbody></table>

  Check the tables for errors. This is the default operation.

* `--check-only-changed`, `-C`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--all-databases</th> <td>Check all tables in all databases</td> <td></td> <td></td> </tr><tr><th scope="row">--all-in-1</th> <td>Execute a single statement for each database that names all the tables from that database</td> <td></td> <td></td> </tr><tr><th scope="row">--analyze</th> <td>Analyze the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-repair</th> <td>If a checked table is corrupted, automatically fix it</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use specified network interface to connect to MySQL Server</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Directory where character sets are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--check</th> <td>Check the tables for errors</td> <td></td> <td></td> </tr><tr><th scope="row">--check-only-changed</th> <td>Check only tables that have changed since the last check</td> <td></td> <td></td> </tr><tr><th scope="row">--check-upgrade</th> <td>Invoke CHECK TABLE with the FOR UPGRADE option</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compress all information sent between client and server</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Permitted compression algorithms for connections to server</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interpret all arguments as database names</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Print debugging information when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Print debugging information, memory, and CPU statistics when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Authentication plugin to use</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Specify default character set</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Read named option file in addition to usual option files</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Read only named option file</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Option group suffix value</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Enable cleartext authentication plugin</td> <td></td> <td></td> </tr><tr><th scope="row">--extended</th> <td>Check and repair tables</td> <td></td> <td></td> </tr><tr><th scope="row">--fast</th> <td>Check only tables that have not been closed properly</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue even if an SQL error occurs</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Request RSA public key from server</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Display help message and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Host on which MySQL server is located</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Read login path options from .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--medium-check</th> <td>Do a check that is faster than an --extended operation</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Read no option files</td> <td></td> <td></td> </tr><tr><th scope="row">--optimize</th> <td>Optimize the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Password to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>First multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Second multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Third multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Connect to server using named pipe (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Directory where plugins are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Transport protocol to use</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>The fastest method of checking</td> <td></td> <td></td> </tr><tr><th scope="row">--repair</th> <td>Perform a repair that can fix almost anything except unique keys that are not unique</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Path name to file containing RSA public key</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Shared-memory name for shared-memory connections (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-database</th> <td>Omit this database from performed operations</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Unix socket file or Windows named pipe to use</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>File that contains list of trusted SSL Certificate Authorities</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>File that contains X.509 certificate</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Permissible ciphers for connection encryption</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>File that contains certificate revocation lists</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Directory that contains certificate revocation-list files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Whether to enable FIPS mode on client side</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>File that contains X.509 key</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Desired security state of connection to server</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>File that contains SSL session data</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Whether to establish connections if session reuse fails</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tables</th> <td>Overrides the --databases or -B option</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Permissible TLS protocols for encrypted connections</td> <td></td> <td></td> </tr><tr><th scope="row">--use-frm</th> <td>For repair operations on MyISAM tables</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>MySQL user name to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Display version information and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--write-binlog</th> <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Compression level for connections to server that use zstd compression</td> <td>8.0.18</td> <td></td> </tr></tbody></table>0

  Check only tables that have changed since the last check or that have not been closed properly.

* `--check-upgrade`, `-g`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--all-databases</th> <td>Check all tables in all databases</td> <td></td> <td></td> </tr><tr><th scope="row">--all-in-1</th> <td>Execute a single statement for each database that names all the tables from that database</td> <td></td> <td></td> </tr><tr><th scope="row">--analyze</th> <td>Analyze the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-repair</th> <td>If a checked table is corrupted, automatically fix it</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use specified network interface to connect to MySQL Server</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Directory where character sets are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--check</th> <td>Check the tables for errors</td> <td></td> <td></td> </tr><tr><th scope="row">--check-only-changed</th> <td>Check only tables that have changed since the last check</td> <td></td> <td></td> </tr><tr><th scope="row">--check-upgrade</th> <td>Invoke CHECK TABLE with the FOR UPGRADE option</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compress all information sent between client and server</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Permitted compression algorithms for connections to server</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interpret all arguments as database names</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Print debugging information when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Print debugging information, memory, and CPU statistics when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Authentication plugin to use</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Specify default character set</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Read named option file in addition to usual option files</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Read only named option file</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Option group suffix value</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Enable cleartext authentication plugin</td> <td></td> <td></td> </tr><tr><th scope="row">--extended</th> <td>Check and repair tables</td> <td></td> <td></td> </tr><tr><th scope="row">--fast</th> <td>Check only tables that have not been closed properly</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue even if an SQL error occurs</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Request RSA public key from server</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Display help message and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Host on which MySQL server is located</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Read login path options from .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--medium-check</th> <td>Do a check that is faster than an --extended operation</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Read no option files</td> <td></td> <td></td> </tr><tr><th scope="row">--optimize</th> <td>Optimize the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Password to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>First multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Second multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Third multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Connect to server using named pipe (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Directory where plugins are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Transport protocol to use</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>The fastest method of checking</td> <td></td> <td></td> </tr><tr><th scope="row">--repair</th> <td>Perform a repair that can fix almost anything except unique keys that are not unique</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Path name to file containing RSA public key</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Shared-memory name for shared-memory connections (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-database</th> <td>Omit this database from performed operations</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Unix socket file or Windows named pipe to use</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>File that contains list of trusted SSL Certificate Authorities</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>File that contains X.509 certificate</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Permissible ciphers for connection encryption</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>File that contains certificate revocation lists</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Directory that contains certificate revocation-list files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Whether to enable FIPS mode on client side</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>File that contains X.509 key</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Desired security state of connection to server</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>File that contains SSL session data</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Whether to establish connections if session reuse fails</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tables</th> <td>Overrides the --databases or -B option</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Permissible TLS protocols for encrypted connections</td> <td></td> <td></td> </tr><tr><th scope="row">--use-frm</th> <td>For repair operations on MyISAM tables</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>MySQL user name to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Display version information and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--write-binlog</th> <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Compression level for connections to server that use zstd compression</td> <td>8.0.18</td> <td></td> </tr></tbody></table>1

  Invoke `CHECK TABLE` with the `FOR UPGRADE` option to check tables for incompatibilities with the current version of the server.

* `--compress`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--all-databases</th> <td>Check all tables in all databases</td> <td></td> <td></td> </tr><tr><th scope="row">--all-in-1</th> <td>Execute a single statement for each database that names all the tables from that database</td> <td></td> <td></td> </tr><tr><th scope="row">--analyze</th> <td>Analyze the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-repair</th> <td>If a checked table is corrupted, automatically fix it</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use specified network interface to connect to MySQL Server</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Directory where character sets are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--check</th> <td>Check the tables for errors</td> <td></td> <td></td> </tr><tr><th scope="row">--check-only-changed</th> <td>Check only tables that have changed since the last check</td> <td></td> <td></td> </tr><tr><th scope="row">--check-upgrade</th> <td>Invoke CHECK TABLE with the FOR UPGRADE option</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compress all information sent between client and server</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Permitted compression algorithms for connections to server</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interpret all arguments as database names</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Print debugging information when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Print debugging information, memory, and CPU statistics when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Authentication plugin to use</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Specify default character set</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Read named option file in addition to usual option files</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Read only named option file</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Option group suffix value</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Enable cleartext authentication plugin</td> <td></td> <td></td> </tr><tr><th scope="row">--extended</th> <td>Check and repair tables</td> <td></td> <td></td> </tr><tr><th scope="row">--fast</th> <td>Check only tables that have not been closed properly</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue even if an SQL error occurs</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Request RSA public key from server</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Display help message and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Host on which MySQL server is located</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Read login path options from .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--medium-check</th> <td>Do a check that is faster than an --extended operation</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Read no option files</td> <td></td> <td></td> </tr><tr><th scope="row">--optimize</th> <td>Optimize the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Password to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>First multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Second multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Third multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Connect to server using named pipe (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Directory where plugins are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Transport protocol to use</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>The fastest method of checking</td> <td></td> <td></td> </tr><tr><th scope="row">--repair</th> <td>Perform a repair that can fix almost anything except unique keys that are not unique</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Path name to file containing RSA public key</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Shared-memory name for shared-memory connections (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-database</th> <td>Omit this database from performed operations</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Unix socket file or Windows named pipe to use</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>File that contains list of trusted SSL Certificate Authorities</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>File that contains X.509 certificate</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Permissible ciphers for connection encryption</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>File that contains certificate revocation lists</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Directory that contains certificate revocation-list files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Whether to enable FIPS mode on client side</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>File that contains X.509 key</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Desired security state of connection to server</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>File that contains SSL session data</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Whether to establish connections if session reuse fails</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tables</th> <td>Overrides the --databases or -B option</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Permissible TLS protocols for encrypted connections</td> <td></td> <td></td> </tr><tr><th scope="row">--use-frm</th> <td>For repair operations on MyISAM tables</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>MySQL user name to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Display version information and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--write-binlog</th> <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Compression level for connections to server that use zstd compression</td> <td>8.0.18</td> <td></td> </tr></tbody></table>2

  Compress all information sent between the client and the server if possible. See Section 6.2.8, “Connection Compression Control”.

  As of MySQL 8.0.18, this option is deprecated. Expect it to be removed in a future version of MySQL. See Configuring Legacy Connection Compression.

* `--compression-algorithms=value`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--all-databases</th> <td>Check all tables in all databases</td> <td></td> <td></td> </tr><tr><th scope="row">--all-in-1</th> <td>Execute a single statement for each database that names all the tables from that database</td> <td></td> <td></td> </tr><tr><th scope="row">--analyze</th> <td>Analyze the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-repair</th> <td>If a checked table is corrupted, automatically fix it</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use specified network interface to connect to MySQL Server</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Directory where character sets are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--check</th> <td>Check the tables for errors</td> <td></td> <td></td> </tr><tr><th scope="row">--check-only-changed</th> <td>Check only tables that have changed since the last check</td> <td></td> <td></td> </tr><tr><th scope="row">--check-upgrade</th> <td>Invoke CHECK TABLE with the FOR UPGRADE option</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compress all information sent between client and server</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Permitted compression algorithms for connections to server</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interpret all arguments as database names</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Print debugging information when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Print debugging information, memory, and CPU statistics when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Authentication plugin to use</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Specify default character set</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Read named option file in addition to usual option files</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Read only named option file</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Option group suffix value</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Enable cleartext authentication plugin</td> <td></td> <td></td> </tr><tr><th scope="row">--extended</th> <td>Check and repair tables</td> <td></td> <td></td> </tr><tr><th scope="row">--fast</th> <td>Check only tables that have not been closed properly</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue even if an SQL error occurs</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Request RSA public key from server</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Display help message and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Host on which MySQL server is located</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Read login path options from .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--medium-check</th> <td>Do a check that is faster than an --extended operation</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Read no option files</td> <td></td> <td></td> </tr><tr><th scope="row">--optimize</th> <td>Optimize the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Password to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>First multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Second multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Third multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Connect to server using named pipe (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Directory where plugins are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Transport protocol to use</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>The fastest method of checking</td> <td></td> <td></td> </tr><tr><th scope="row">--repair</th> <td>Perform a repair that can fix almost anything except unique keys that are not unique</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Path name to file containing RSA public key</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Shared-memory name for shared-memory connections (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-database</th> <td>Omit this database from performed operations</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Unix socket file or Windows named pipe to use</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>File that contains list of trusted SSL Certificate Authorities</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>File that contains X.509 certificate</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Permissible ciphers for connection encryption</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>File that contains certificate revocation lists</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Directory that contains certificate revocation-list files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Whether to enable FIPS mode on client side</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>File that contains X.509 key</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Desired security state of connection to server</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>File that contains SSL session data</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Whether to establish connections if session reuse fails</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tables</th> <td>Overrides the --databases or -B option</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Permissible TLS protocols for encrypted connections</td> <td></td> <td></td> </tr><tr><th scope="row">--use-frm</th> <td>For repair operations on MyISAM tables</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>MySQL user name to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Display version information and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--write-binlog</th> <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Compression level for connections to server that use zstd compression</td> <td>8.0.18</td> <td></td> </tr></tbody></table>3

  The permitted compression algorithms for connections to the server. The available algorithms are the same as for the `protocol_compression_algorithms` system variable. The default value is `uncompressed`.

  For more information, see Section 6.2.8, “Connection Compression Control”.

  This option was added in MySQL 8.0.18.

* `--databases`, `-B`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--all-databases</th> <td>Check all tables in all databases</td> <td></td> <td></td> </tr><tr><th scope="row">--all-in-1</th> <td>Execute a single statement for each database that names all the tables from that database</td> <td></td> <td></td> </tr><tr><th scope="row">--analyze</th> <td>Analyze the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-repair</th> <td>If a checked table is corrupted, automatically fix it</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use specified network interface to connect to MySQL Server</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Directory where character sets are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--check</th> <td>Check the tables for errors</td> <td></td> <td></td> </tr><tr><th scope="row">--check-only-changed</th> <td>Check only tables that have changed since the last check</td> <td></td> <td></td> </tr><tr><th scope="row">--check-upgrade</th> <td>Invoke CHECK TABLE with the FOR UPGRADE option</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compress all information sent between client and server</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Permitted compression algorithms for connections to server</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interpret all arguments as database names</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Print debugging information when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Print debugging information, memory, and CPU statistics when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Authentication plugin to use</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Specify default character set</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Read named option file in addition to usual option files</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Read only named option file</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Option group suffix value</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Enable cleartext authentication plugin</td> <td></td> <td></td> </tr><tr><th scope="row">--extended</th> <td>Check and repair tables</td> <td></td> <td></td> </tr><tr><th scope="row">--fast</th> <td>Check only tables that have not been closed properly</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue even if an SQL error occurs</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Request RSA public key from server</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Display help message and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Host on which MySQL server is located</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Read login path options from .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--medium-check</th> <td>Do a check that is faster than an --extended operation</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Read no option files</td> <td></td> <td></td> </tr><tr><th scope="row">--optimize</th> <td>Optimize the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Password to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>First multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Second multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Third multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Connect to server using named pipe (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Directory where plugins are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Transport protocol to use</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>The fastest method of checking</td> <td></td> <td></td> </tr><tr><th scope="row">--repair</th> <td>Perform a repair that can fix almost anything except unique keys that are not unique</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Path name to file containing RSA public key</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Shared-memory name for shared-memory connections (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-database</th> <td>Omit this database from performed operations</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Unix socket file or Windows named pipe to use</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>File that contains list of trusted SSL Certificate Authorities</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>File that contains X.509 certificate</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Permissible ciphers for connection encryption</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>File that contains certificate revocation lists</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Directory that contains certificate revocation-list files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Whether to enable FIPS mode on client side</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>File that contains X.509 key</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Desired security state of connection to server</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>File that contains SSL session data</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Whether to establish connections if session reuse fails</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tables</th> <td>Overrides the --databases or -B option</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Permissible TLS protocols for encrypted connections</td> <td></td> <td></td> </tr><tr><th scope="row">--use-frm</th> <td>For repair operations on MyISAM tables</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>MySQL user name to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Display version information and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--write-binlog</th> <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Compression level for connections to server that use zstd compression</td> <td>8.0.18</td> <td></td> </tr></tbody></table>4

  Process all tables in the named databases. Normally, **mysqlcheck** treats the first name argument on the command line as a database name and any following names as table names. With this option, it treats all name arguments as database names.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--all-databases</th> <td>Check all tables in all databases</td> <td></td> <td></td> </tr><tr><th scope="row">--all-in-1</th> <td>Execute a single statement for each database that names all the tables from that database</td> <td></td> <td></td> </tr><tr><th scope="row">--analyze</th> <td>Analyze the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-repair</th> <td>If a checked table is corrupted, automatically fix it</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use specified network interface to connect to MySQL Server</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Directory where character sets are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--check</th> <td>Check the tables for errors</td> <td></td> <td></td> </tr><tr><th scope="row">--check-only-changed</th> <td>Check only tables that have changed since the last check</td> <td></td> <td></td> </tr><tr><th scope="row">--check-upgrade</th> <td>Invoke CHECK TABLE with the FOR UPGRADE option</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compress all information sent between client and server</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Permitted compression algorithms for connections to server</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interpret all arguments as database names</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Print debugging information when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Print debugging information, memory, and CPU statistics when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Authentication plugin to use</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Specify default character set</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Read named option file in addition to usual option files</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Read only named option file</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Option group suffix value</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Enable cleartext authentication plugin</td> <td></td> <td></td> </tr><tr><th scope="row">--extended</th> <td>Check and repair tables</td> <td></td> <td></td> </tr><tr><th scope="row">--fast</th> <td>Check only tables that have not been closed properly</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue even if an SQL error occurs</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Request RSA public key from server</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Display help message and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Host on which MySQL server is located</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Read login path options from .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--medium-check</th> <td>Do a check that is faster than an --extended operation</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Read no option files</td> <td></td> <td></td> </tr><tr><th scope="row">--optimize</th> <td>Optimize the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Password to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>First multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Second multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Third multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Connect to server using named pipe (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Directory where plugins are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Transport protocol to use</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>The fastest method of checking</td> <td></td> <td></td> </tr><tr><th scope="row">--repair</th> <td>Perform a repair that can fix almost anything except unique keys that are not unique</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Path name to file containing RSA public key</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Shared-memory name for shared-memory connections (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-database</th> <td>Omit this database from performed operations</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Unix socket file or Windows named pipe to use</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>File that contains list of trusted SSL Certificate Authorities</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>File that contains X.509 certificate</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Permissible ciphers for connection encryption</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>File that contains certificate revocation lists</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Directory that contains certificate revocation-list files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Whether to enable FIPS mode on client side</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>File that contains X.509 key</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Desired security state of connection to server</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>File that contains SSL session data</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Whether to establish connections if session reuse fails</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tables</th> <td>Overrides the --databases or -B option</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Permissible TLS protocols for encrypted connections</td> <td></td> <td></td> </tr><tr><th scope="row">--use-frm</th> <td>For repair operations on MyISAM tables</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>MySQL user name to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Display version information and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--write-binlog</th> <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Compression level for connections to server that use zstd compression</td> <td>8.0.18</td> <td></td> </tr></tbody></table>5

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:o`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-check`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--all-databases</th> <td>Check all tables in all databases</td> <td></td> <td></td> </tr><tr><th scope="row">--all-in-1</th> <td>Execute a single statement for each database that names all the tables from that database</td> <td></td> <td></td> </tr><tr><th scope="row">--analyze</th> <td>Analyze the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-repair</th> <td>If a checked table is corrupted, automatically fix it</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use specified network interface to connect to MySQL Server</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Directory where character sets are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--check</th> <td>Check the tables for errors</td> <td></td> <td></td> </tr><tr><th scope="row">--check-only-changed</th> <td>Check only tables that have changed since the last check</td> <td></td> <td></td> </tr><tr><th scope="row">--check-upgrade</th> <td>Invoke CHECK TABLE with the FOR UPGRADE option</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compress all information sent between client and server</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Permitted compression algorithms for connections to server</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interpret all arguments as database names</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Print debugging information when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Print debugging information, memory, and CPU statistics when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Authentication plugin to use</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Specify default character set</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Read named option file in addition to usual option files</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Read only named option file</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Option group suffix value</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Enable cleartext authentication plugin</td> <td></td> <td></td> </tr><tr><th scope="row">--extended</th> <td>Check and repair tables</td> <td></td> <td></td> </tr><tr><th scope="row">--fast</th> <td>Check only tables that have not been closed properly</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue even if an SQL error occurs</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Request RSA public key from server</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Display help message and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Host on which MySQL server is located</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Read login path options from .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--medium-check</th> <td>Do a check that is faster than an --extended operation</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Read no option files</td> <td></td> <td></td> </tr><tr><th scope="row">--optimize</th> <td>Optimize the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Password to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>First multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Second multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Third multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Connect to server using named pipe (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Directory where plugins are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Transport protocol to use</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>The fastest method of checking</td> <td></td> <td></td> </tr><tr><th scope="row">--repair</th> <td>Perform a repair that can fix almost anything except unique keys that are not unique</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Path name to file containing RSA public key</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Shared-memory name for shared-memory connections (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-database</th> <td>Omit this database from performed operations</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Unix socket file or Windows named pipe to use</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>File that contains list of trusted SSL Certificate Authorities</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>File that contains X.509 certificate</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Permissible ciphers for connection encryption</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>File that contains certificate revocation lists</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Directory that contains certificate revocation-list files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Whether to enable FIPS mode on client side</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>File that contains X.509 key</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Desired security state of connection to server</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>File that contains SSL session data</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Whether to establish connections if session reuse fails</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tables</th> <td>Overrides the --databases or -B option</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Permissible TLS protocols for encrypted connections</td> <td></td> <td></td> </tr><tr><th scope="row">--use-frm</th> <td>For repair operations on MyISAM tables</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>MySQL user name to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Display version information and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--write-binlog</th> <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Compression level for connections to server that use zstd compression</td> <td>8.0.18</td> <td></td> </tr></tbody></table>6

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-info`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--all-databases</th> <td>Check all tables in all databases</td> <td></td> <td></td> </tr><tr><th scope="row">--all-in-1</th> <td>Execute a single statement for each database that names all the tables from that database</td> <td></td> <td></td> </tr><tr><th scope="row">--analyze</th> <td>Analyze the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-repair</th> <td>If a checked table is corrupted, automatically fix it</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use specified network interface to connect to MySQL Server</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Directory where character sets are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--check</th> <td>Check the tables for errors</td> <td></td> <td></td> </tr><tr><th scope="row">--check-only-changed</th> <td>Check only tables that have changed since the last check</td> <td></td> <td></td> </tr><tr><th scope="row">--check-upgrade</th> <td>Invoke CHECK TABLE with the FOR UPGRADE option</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compress all information sent between client and server</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Permitted compression algorithms for connections to server</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interpret all arguments as database names</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Print debugging information when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Print debugging information, memory, and CPU statistics when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Authentication plugin to use</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Specify default character set</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Read named option file in addition to usual option files</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Read only named option file</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Option group suffix value</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Enable cleartext authentication plugin</td> <td></td> <td></td> </tr><tr><th scope="row">--extended</th> <td>Check and repair tables</td> <td></td> <td></td> </tr><tr><th scope="row">--fast</th> <td>Check only tables that have not been closed properly</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue even if an SQL error occurs</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Request RSA public key from server</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Display help message and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Host on which MySQL server is located</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Read login path options from .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--medium-check</th> <td>Do a check that is faster than an --extended operation</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Read no option files</td> <td></td> <td></td> </tr><tr><th scope="row">--optimize</th> <td>Optimize the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Password to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>First multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Second multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Third multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Connect to server using named pipe (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Directory where plugins are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Transport protocol to use</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>The fastest method of checking</td> <td></td> <td></td> </tr><tr><th scope="row">--repair</th> <td>Perform a repair that can fix almost anything except unique keys that are not unique</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Path name to file containing RSA public key</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Shared-memory name for shared-memory connections (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-database</th> <td>Omit this database from performed operations</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Unix socket file or Windows named pipe to use</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>File that contains list of trusted SSL Certificate Authorities</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>File that contains X.509 certificate</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Permissible ciphers for connection encryption</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>File that contains certificate revocation lists</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Directory that contains certificate revocation-list files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Whether to enable FIPS mode on client side</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>File that contains X.509 key</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Desired security state of connection to server</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>File that contains SSL session data</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Whether to establish connections if session reuse fails</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tables</th> <td>Overrides the --databases or -B option</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Permissible TLS protocols for encrypted connections</td> <td></td> <td></td> </tr><tr><th scope="row">--use-frm</th> <td>For repair operations on MyISAM tables</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>MySQL user name to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Display version information and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--write-binlog</th> <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Compression level for connections to server that use zstd compression</td> <td>8.0.18</td> <td></td> </tr></tbody></table>7

  Print debugging information and memory and CPU usage statistics when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--all-databases</th> <td>Check all tables in all databases</td> <td></td> <td></td> </tr><tr><th scope="row">--all-in-1</th> <td>Execute a single statement for each database that names all the tables from that database</td> <td></td> <td></td> </tr><tr><th scope="row">--analyze</th> <td>Analyze the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-repair</th> <td>If a checked table is corrupted, automatically fix it</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use specified network interface to connect to MySQL Server</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Directory where character sets are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--check</th> <td>Check the tables for errors</td> <td></td> <td></td> </tr><tr><th scope="row">--check-only-changed</th> <td>Check only tables that have changed since the last check</td> <td></td> <td></td> </tr><tr><th scope="row">--check-upgrade</th> <td>Invoke CHECK TABLE with the FOR UPGRADE option</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compress all information sent between client and server</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Permitted compression algorithms for connections to server</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interpret all arguments as database names</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Print debugging information when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Print debugging information, memory, and CPU statistics when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Authentication plugin to use</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Specify default character set</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Read named option file in addition to usual option files</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Read only named option file</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Option group suffix value</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Enable cleartext authentication plugin</td> <td></td> <td></td> </tr><tr><th scope="row">--extended</th> <td>Check and repair tables</td> <td></td> <td></td> </tr><tr><th scope="row">--fast</th> <td>Check only tables that have not been closed properly</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue even if an SQL error occurs</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Request RSA public key from server</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Display help message and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Host on which MySQL server is located</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Read login path options from .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--medium-check</th> <td>Do a check that is faster than an --extended operation</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Read no option files</td> <td></td> <td></td> </tr><tr><th scope="row">--optimize</th> <td>Optimize the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Password to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>First multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Second multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Third multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Connect to server using named pipe (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Directory where plugins are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Transport protocol to use</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>The fastest method of checking</td> <td></td> <td></td> </tr><tr><th scope="row">--repair</th> <td>Perform a repair that can fix almost anything except unique keys that are not unique</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Path name to file containing RSA public key</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Shared-memory name for shared-memory connections (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-database</th> <td>Omit this database from performed operations</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Unix socket file or Windows named pipe to use</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>File that contains list of trusted SSL Certificate Authorities</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>File that contains X.509 certificate</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Permissible ciphers for connection encryption</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>File that contains certificate revocation lists</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Directory that contains certificate revocation-list files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Whether to enable FIPS mode on client side</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>File that contains X.509 key</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Desired security state of connection to server</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>File that contains SSL session data</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Whether to establish connections if session reuse fails</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tables</th> <td>Overrides the --databases or -B option</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Permissible TLS protocols for encrypted connections</td> <td></td> <td></td> </tr><tr><th scope="row">--use-frm</th> <td>For repair operations on MyISAM tables</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>MySQL user name to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Display version information and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--write-binlog</th> <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Compression level for connections to server that use zstd compression</td> <td>8.0.18</td> <td></td> </tr></tbody></table>8

  Use *`charset_name`* as the default character set. See Section 12.15, “Character Set Configuration”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--all-databases</th> <td>Check all tables in all databases</td> <td></td> <td></td> </tr><tr><th scope="row">--all-in-1</th> <td>Execute a single statement for each database that names all the tables from that database</td> <td></td> <td></td> </tr><tr><th scope="row">--analyze</th> <td>Analyze the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-repair</th> <td>If a checked table is corrupted, automatically fix it</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use specified network interface to connect to MySQL Server</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Directory where character sets are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--check</th> <td>Check the tables for errors</td> <td></td> <td></td> </tr><tr><th scope="row">--check-only-changed</th> <td>Check only tables that have changed since the last check</td> <td></td> <td></td> </tr><tr><th scope="row">--check-upgrade</th> <td>Invoke CHECK TABLE with the FOR UPGRADE option</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compress all information sent between client and server</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Permitted compression algorithms for connections to server</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interpret all arguments as database names</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Print debugging information when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Print debugging information, memory, and CPU statistics when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Authentication plugin to use</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Specify default character set</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Read named option file in addition to usual option files</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Read only named option file</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Option group suffix value</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Enable cleartext authentication plugin</td> <td></td> <td></td> </tr><tr><th scope="row">--extended</th> <td>Check and repair tables</td> <td></td> <td></td> </tr><tr><th scope="row">--fast</th> <td>Check only tables that have not been closed properly</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue even if an SQL error occurs</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Request RSA public key from server</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Display help message and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Host on which MySQL server is located</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Read login path options from .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--medium-check</th> <td>Do a check that is faster than an --extended operation</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Read no option files</td> <td></td> <td></td> </tr><tr><th scope="row">--optimize</th> <td>Optimize the tables</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Password to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>First multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Second multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Third multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Connect to server using named pipe (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Directory where plugins are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Transport protocol to use</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>The fastest method of checking</td> <td></td> <td></td> </tr><tr><th scope="row">--repair</th> <td>Perform a repair that can fix almost anything except unique keys that are not unique</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Path name to file containing RSA public key</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Shared-memory name for shared-memory connections (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-database</th> <td>Omit this database from performed operations</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Unix socket file or Windows named pipe to use</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>File that contains list of trusted SSL Certificate Authorities</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>File that contains X.509 certificate</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Permissible ciphers for connection encryption</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>File that contains certificate revocation lists</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Directory that contains certificate revocation-list files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Whether to enable FIPS mode on client side</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>File that contains X.509 key</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Desired security state of connection to server</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>File that contains SSL session data</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Whether to establish connections if session reuse fails</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tables</th> <td>Overrides the --databases or -B option</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Permissible TLS protocols for encrypted connections</td> <td></td> <td></td> </tr><tr><th scope="row">--use-frm</th> <td>For repair operations on MyISAM tables</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>MySQL user name to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Display version information and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--write-binlog</th> <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Compression level for connections to server that use zstd compression</td> <td>8.0.18</td> <td></td> </tr></tbody></table>9

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysqlcheck** normally reads the `[client]` and `[mysqlcheck]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysqlcheck** also reads the `[client_other]` and `[mysqlcheck_other]` groups.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--extended`, `-e`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

  If you are using this option to check tables, it ensures that they are 100% consistent but takes a long time.

  If you are using this option to repair tables, it runs an extended repair that may not only take a long time to execute, but may produce a lot of garbage rows also!

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

  A hint about which client-side authentication plugin to use. See Section 8.2.17, “Pluggable Authentication”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

  Enable the `mysql_clear_password` cleartext authentication plugin. (See Section 8.4.1.4, “Client-Side Cleartext Pluggable Authentication”.)

* `--fast`, `-F`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

  Check only tables that have not been closed properly.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

  Continue even if an SQL error occurs.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

  Request from the server the public key required for RSA key pair-based password exchange. This option applies to clients that authenticate with the `caching_sha2_password` authentication plugin. For that plugin, the server does not send the public key unless requested. This option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the `caching_sha2_password` plugin, see Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

  Connect to the MySQL server on the given host.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql_config_editor** utility. See Section 6.6.7, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--medium-check`, `-m`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>0

  Do a check that is faster than an `--extended` operation. This finds only 99.99% of all errors, which should be good enough in most cases.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>1

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql_config_editor** utility. See Section 6.6.7, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--optimize`, `-o`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>2

  Optimize the tables.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>3

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqlcheck** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqlcheck** should not prompt for one, use the `--skip-password` option.

* `--password1[=pass_val]`

  The password for multifactor authentication factor 1 of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqlcheck** prompts for one. If given, there must be *no space* between `--password1=` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqlcheck** should not prompt for one, use the `--skip-password1` option.

  `--password1` and `--password` are synonymous, as are `--skip-password1` and `--skip-password`.

* `--password2[=pass_val]`

  The password for multifactor authentication factor 2 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.

* `--password3[=pass_val]`

  The password for multifactor authentication factor 3 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>4

  On Windows, connect to the server using a named pipe. This option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>5

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysqlcheck** does not find it. See Section 8.2.17, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>6

  For TCP/IP connections, the port number to use.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>7

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>8

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 6.2.7, “Connection Transport Protocols”.

* `--quick`, `-q`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>9

  If you are using this option to check tables, it prevents the check from scanning the rows to check for incorrect links. This is the fastest check method.

  If you are using this option to repair tables, it tries to repair only the index tree. This is the fastest repair method.

* `--repair`, `-r`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>0

  Perform a repair that can fix almost anything except unique keys that are not unique.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>1

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or `caching_sha2_password` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and `caching_sha2_password` plugins, see Section 8.4.1.3, “SHA-256 Pluggable Authentication”, and Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>2

  On Windows, the shared-memory name to use for connections made using shared memory to a local server. The default value is `MYSQL`. The shared-memory name is case-sensitive.

  This option applies only if the server was started with the `shared_memory` system variable enabled to support shared-memory connections.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>3

  Silent mode. Print only error messages.

* `--skip-database=db_name`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>4

  Do not include the named database (case-sensitive) in the operations performed by **mysqlcheck**.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>5

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>6

  Controls whether to enable FIPS mode on the client side. The `--ssl-fips-mode` option differs from other `--ssl-xxx` options in that it is not used to establish encrypted connections, but rather to affect which cryptographic operations to permit. See Section 8.8, “FIPS Support”.

  These `--ssl-fips-mode` values are permitted:

  + `OFF`: Disable FIPS mode.
  + `ON`: Enable FIPS mode.
  + `STRICT`: Enable “strict” FIPS mode.

  Note

  If the OpenSSL FIPS Object Module is not available, the only permitted value for `--ssl-fips-mode` is `OFF`. In this case, setting `--ssl-fips-mode` to `ON` or `STRICT` causes the client to produce a warning at startup and to operate in non-FIPS mode.

  As of MySQL 8.0.34, this option is deprecated. Expect it to be removed in a future version of MySQL.

* `--tables`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>7

  Override the `--databases` or `-B` option. All name arguments following the option are regarded as table names.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>8

  The permissible ciphersuites for encrypted connections that use TLSv1.3. The value is a list of one or more colon-separated ciphersuite names. The ciphersuites that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 8.0.16.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>9

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

* `--use-frm`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>0

  For repair operations on `MyISAM` tables, get the table structure from the data dictionary so that the table can be repaired even if the `.MYI` header is corrupted.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>1

  The user name of the MySQL account to use for connecting to the server.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>2

  Verbose mode. Print information about the various stages of program operation.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>3

  Display version information and exit.

* `--write-binlog`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>4

  This option is enabled by default, so that `ANALYZE TABLE`, `OPTIMIZE TABLE`, and `REPAIR TABLE` statements generated by **mysqlcheck** are written to the binary log. Use `--skip-write-binlog` to cause `NO_WRITE_TO_BINLOG` to be added to the statements so that they are not logged. Use the `--skip-write-binlog` when these statements should not be sent to replicas or run when using the binary logs for recovery from backup.

* `--zstd-compression-level=level`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>5

  The compression level to use for connections to the server that use the `zstd` compression algorithm. The permitted levels are from 1 to 22, with larger values indicating increasing levels of compression. The default `zstd` compression level is 3. The compression level setting has no effect on connections that do not use `zstd` compression.

  For more information, see Section 6.2.8, “Connection Compression Control”.

  This option was added in MySQL 8.0.18.


### 6.5.4 mysqldump — A Database Backup Program

The **mysqldump** client utility performs logical backups, producing a set of SQL statements that can be executed to reproduce the original database object definitions and table data. It dumps one or more MySQL databases for backup or transfer to another SQL server. The **mysqldump** command can also generate output in CSV, other delimited text, or XML format.

Tip

Consider using the MySQL Shell dump utilities, which provide parallel dumping with multiple threads, file compression, and progress information display, as well as cloud features such as Oracle Cloud Infrastructure Object Storage streaming, and MySQL HeatWave compatibility checks and modifications. Dumps can be easily imported into a MySQL Server instance or a MySQL HeatWave DB System using the MySQL Shell load dump utilities. Installation instructions for MySQL Shell can be found here.

* Performance and Scalability Considerations
* Invocation Syntax
* Option Syntax - Alphabetical Summary
* Connection Options
* Option-File Options
* DDL Options
* Debug Options
* Help Options
* Internationalization Options
* Replication Options
* Format Options
* Filtering Options
* Performance Options
* Transactional Options
* Option Groups
* Examples
* Restrictions

**mysqldump** requires at least the `SELECT` privilege for dumped tables, `SHOW VIEW` for dumped views, `TRIGGER` for dumped triggers, `LOCK TABLES` if the `--single-transaction` option is not used, `PROCESS` (as of MySQL 8.0.21) if the `--no-tablespaces` option is not used, and (as of MySQL 8.0.32) the `RELOAD` or `FLUSH_TABLES` privilege with `--single-transaction` if both `gtid_mode=ON` and `gtid_purged=ON|AUTO`. Certain options might require other privileges as noted in the option descriptions.

To reload a dump file, you must have the privileges required to execute the statements that it contains, such as the appropriate `CREATE` privileges for objects created by those statements.

**mysqldump** output can include `ALTER DATABASE` statements that change the database collation. These may be used when dumping stored programs to preserve their character encodings. To reload a dump file containing such statements, the `ALTER` privilege for the affected database is required.

Note

A dump made using PowerShell on Windows with output redirection creates a file that has UTF-16 encoding:

```
mysqldump [options] > dump.sql
```

However, UTF-16 is not permitted as a connection character set (see Impermissible Client Character Sets), so the dump file cannot be loaded correctly. To work around this issue, use the `--result-file` option, which creates the output in ASCII format:

```
mysqldump [options] --result-file=dump.sql
```

It is not recommended to load a dump file when GTIDs are enabled on the server (`gtid_mode=ON`), if your dump file includes system tables. **mysqldump** issues DML instructions for the system tables which use the non-transactional MyISAM storage engine, and this combination is not permitted when GTIDs are enabled.

#### Performance and Scalability Considerations

`mysqldump` advantages include the convenience and flexibility of viewing or even editing the output before restoring. You can clone databases for development and DBA work, or produce slight variations of an existing database for testing. It is not intended as a fast or scalable solution for backing up substantial amounts of data. With large data sizes, even if the backup step takes a reasonable time, restoring the data can be very slow because replaying the SQL statements involves disk I/O for insertion, index creation, and so on.

For large-scale backup and restore, a physical backup is more appropriate, to copy the data files in their original format so that they can be restored quickly.

If your tables are primarily `InnoDB` tables, or if you have a mix of `InnoDB` and `MyISAM` tables, consider using **mysqlbackup**, which is available as part of MySQL Enterprise. This tool provides high performance for `InnoDB` backups with minimal disruption; it can also back up tables from `MyISAM` and other storage engines; it also provides a number of convenient options to accommodate different backup scenarios. See Section 32.1, “MySQL Enterprise Backup Overview”.

**mysqldump** can retrieve and dump table contents row by row, or it can retrieve the entire content from a table and buffer it in memory before dumping it. Buffering in memory can be a problem if you are dumping large tables. To dump tables row by row, use the `--quick` option (or `--opt`, which enables `--quick`). The `--opt` option (and hence `--quick`) is enabled by default, so to enable memory buffering, use `--skip-quick`.

If you are using a recent version of **mysqldump** to generate a dump to be reloaded into a very old MySQL server, use the `--skip-opt` option instead of the `--opt` or `--extended-insert` option.

For additional information about **mysqldump**, see Section 9.4, “Using mysqldump for Backups”.

#### Invocation Syntax

There are in general three ways to use **mysqldump**—in order to dump a set of one or more tables, a set of one or more complete databases, or an entire MySQL server—as shown here:

```
mysqldump [options] db_name [tbl_name ...]
mysqldump [options] --databases db_name ...
mysqldump [options] --all-databases
```

To dump entire databases, do not name any tables following *`db_name`*, or use the `--databases` or `--all-databases` option.

To see a list of the options your version of **mysqldump** supports, issue the command **mysqldump** `--help`.

#### Option Syntax - Alphabetical Summary

**mysqldump** supports the following options, which can be specified on the command line or in the `[mysqldump]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see Section 6.2.2.2, “Using Option Files”.

**Table 6.15 mysqldump Options**

<table frame="box" rules="all" summary="Command-line options available for mysqldump."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--add-drop-database</th> <td>Add DROP DATABASE statement before each CREATE DATABASE statement</td> <td></td> <td></td> </tr><tr><th scope="row">--add-drop-table</th> <td>Add DROP TABLE statement before each CREATE TABLE statement</td> <td></td> <td></td> </tr><tr><th scope="row">--add-drop-trigger</th> <td>Add DROP TRIGGER statement before each CREATE TRIGGER statement</td> <td></td> <td></td> </tr><tr><th scope="row">--add-locks</th> <td>Surround each table dump with LOCK TABLES and UNLOCK TABLES statements</td> <td></td> <td></td> </tr><tr><th scope="row">--all-databases</th> <td>Dump all tables in all databases</td> <td></td> <td></td> </tr><tr><th scope="row">--allow-keywords</th> <td>Allow creation of column names that are keywords</td> <td></td> <td></td> </tr><tr><th scope="row">--apply-replica-statements</th> <td>Include STOP REPLICA prior to CHANGE REPLICATION SOURCE TO statement and START REPLICA at end of output</td> <td>8.0.26</td> <td></td> </tr><tr><th scope="row">--apply-slave-statements</th> <td>Include STOP SLAVE prior to CHANGE MASTER statement and START SLAVE at end of output</td> <td></td> <td>8.0.26</td> </tr><tr><th scope="row">--bind-address</th> <td>Use specified network interface to connect to MySQL Server</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Directory where character sets are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--column-statistics</th> <td>Write ANALYZE TABLE statements to generate statistics histograms</td> <td></td> <td></td> </tr><tr><th scope="row">--comments</th> <td>Add comments to dump file</td> <td></td> <td></td> </tr><tr><th scope="row">--compact</th> <td>Produce more compact output</td> <td></td> <td></td> </tr><tr><th scope="row">--compatible</th> <td>Produce output that is more compatible with other database systems or with older MySQL servers</td> <td></td> <td></td> </tr><tr><th scope="row">--complete-insert</th> <td>Use complete INSERT statements that include column names</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compress all information sent between client and server</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Permitted compression algorithms for connections to server</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--create-options</th> <td>Include all MySQL-specific table options in CREATE TABLE statements</td> <td></td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interpret all name arguments as database names</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Print debugging information when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Print debugging information, memory, and CPU statistics when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Authentication plugin to use</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Specify default character set</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Read named option file in addition to usual option files</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Read only named option file</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Option group suffix value</td> <td></td> <td></td> </tr><tr><th scope="row">--delete-master-logs</th> <td>On a replication source server, delete the binary logs after performing the dump operation</td> <td></td> <td>8.0.26</td> </tr><tr><th scope="row">--delete-source-logs</th> <td>On a replication source server, delete the binary logs after performing the dump operation</td> <td>8.0.26</td> <td></td> </tr><tr><th scope="row">--disable-keys</th> <td>For each table, surround INSERT statements with statements to disable and enable keys</td> <td></td> <td></td> </tr><tr><th scope="row">--dump-date</th> <td>Include dump date as "Dump completed on" comment if --comments is given</td> <td></td> <td></td> </tr><tr><th scope="row">--dump-replica</th> <td>Include CHANGE REPLICATION SOURCE TO statement that lists binary log coordinates of replica's source</td> <td>8.0.26</td> <td></td> </tr><tr><th scope="row">--dump-slave</th> <td>Include CHANGE MASTER statement that lists binary log coordinates of replica's source</td> <td></td> <td>8.0.26</td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Enable cleartext authentication plugin</td> <td></td> <td></td> </tr><tr><th scope="row">--events</th> <td>Dump events from dumped databases</td> <td></td> <td></td> </tr><tr><th scope="row">--extended-insert</th> <td>Use multiple-row INSERT syntax</td> <td></td> <td></td> </tr><tr><th scope="row">--fields-enclosed-by</th> <td>This option is used with the --tab option and has the same meaning as the corresponding clause for LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row">--fields-escaped-by</th> <td>This option is used with the --tab option and has the same meaning as the corresponding clause for LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row">--fields-optionally-enclosed-by</th> <td>This option is used with the --tab option and has the same meaning as the corresponding clause for LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row">--fields-terminated-by</th> <td>This option is used with the --tab option and has the same meaning as the corresponding clause for LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row">--flush-logs</th> <td>Flush MySQL server log files before starting dump</td> <td></td> <td></td> </tr><tr><th scope="row">--flush-privileges</th> <td>Emit a FLUSH PRIVILEGES statement after dumping mysql database</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue even if an SQL error occurs during a table dump</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Request RSA public key from server</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Display help message and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--hex-blob</th> <td>Dump binary columns using hexadecimal notation</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Host on which MySQL server is located</td> <td></td> <td></td> </tr><tr><th scope="row">--ignore-error</th> <td>Ignore specified errors</td> <td></td> <td></td> </tr><tr><th scope="row">--ignore-table</th> <td>Do not dump given table</td> <td></td> <td></td> </tr><tr><th scope="row">--include-master-host-port</th> <td>Include MASTER_HOST/MASTER_PORT options in CHANGE MASTER statement produced with --dump-slave</td> <td></td> <td>8.0.26</td> </tr><tr><th scope="row">--include-source-host-port</th> <td>Include SOURCE_HOST and SOURCE_PORT options in CHANGE REPLICATION SOURCE TO statement produced with --dump-replica</td> <td>8.0.26</td> <td></td> </tr><tr><th scope="row">--insert-ignore</th> <td>Write INSERT IGNORE rather than INSERT statements</td> <td></td> <td></td> </tr><tr><th scope="row">--lines-terminated-by</th> <td>This option is used with the --tab option and has the same meaning as the corresponding clause for LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row">--lock-all-tables</th> <td>Lock all tables across all databases</td> <td></td> <td></td> </tr><tr><th scope="row">--lock-tables</th> <td>Lock all tables before dumping them</td> <td></td> <td></td> </tr><tr><th scope="row">--log-error</th> <td>Append warnings and errors to named file</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Read login path options from .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--master-data</th> <td>Write the binary log file name and position to the output</td> <td></td> <td>8.0.26</td> </tr><tr><th scope="row">--max-allowed-packet</th> <td>Maximum packet length to send to or receive from server</td> <td></td> <td></td> </tr><tr><th scope="row">--mysqld-long-query-time</th> <td>Session value for slow query threshold</td> <td>8.0.30</td> <td></td> </tr><tr><th scope="row">--net-buffer-length</th> <td>Buffer size for TCP/IP and socket communication</td> <td></td> <td></td> </tr><tr><th scope="row">--network-timeout</th> <td>Increase network timeouts to permit larger table dumps</td> <td></td> <td></td> </tr><tr><th scope="row">--no-autocommit</th> <td>Enclose the INSERT statements for each dumped table within SET autocommit = 0 and COMMIT statements</td> <td></td> <td></td> </tr><tr><th scope="row">--no-create-db</th> <td>Do not write CREATE DATABASE statements</td> <td></td> <td></td> </tr><tr><th scope="row">--no-create-info</th> <td>Do not write CREATE TABLE statements that re-create each dumped table</td> <td></td> <td></td> </tr><tr><th scope="row">--no-data</th> <td>Do not dump table contents</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Read no option files</td> <td></td> <td></td> </tr><tr><th scope="row">--no-set-names</th> <td>Same as --skip-set-charset</td> <td></td> <td></td> </tr><tr><th scope="row">--no-tablespaces</th> <td>Do not write any CREATE LOGFILE GROUP or CREATE TABLESPACE statements in output</td> <td></td> <td></td> </tr><tr><th scope="row">--opt</th> <td>Shorthand for --add-drop-table --add-locks --create-options --disable-keys --extended-insert --lock-tables --quick --set-charset</td> <td></td> <td></td> </tr><tr><th scope="row">--order-by-primary</th> <td>Dump each table's rows sorted by its primary key, or by its first unique index</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Password to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>First multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Second multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Third multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Connect to server using named pipe (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-authentication-kerberos-client-mode</th> <td>Permit GSSAPI pluggable authentication through the MIT Kerberos library on Windows</td> <td>8.0.32</td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Directory where plugins are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Transport protocol to use</td> <td></td> <td></td> </tr><tr><th scope="row">--quick</th> <td>Retrieve rows for a table from the server a row at a time</td> <td></td> <td></td> </tr><tr><th scope="row">--quote-names</th> <td>Quote identifiers within backtick characters</td> <td></td> <td></td> </tr><tr><th scope="row">--replace</th> <td>Write REPLACE statements rather than INSERT statements</td> <td></td> <td></td> </tr><tr><th scope="row">--result-file</th> <td>Direct output to a given file</td> <td></td> <td></td> </tr><tr><th scope="row">--routines</th> <td>Dump stored routines (procedures and functions) from dumped databases</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Path name to file containing RSA public key</td> <td></td> <td></td> </tr><tr><th scope="row">--set-charset</th> <td>Add SET NAMES default_character_set to output</td> <td></td> <td></td> </tr><tr><th scope="row">--set-gtid-purged</th> <td>Whether to add SET @@GLOBAL.GTID_PURGED to output</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Shared-memory name for shared-memory connections (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--show-create-skip-secondary-engine</th> <td>Exclude SECONDARY ENGINE clause from CREATE TABLE statements</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--single-transaction</th> <td>Issue a BEGIN SQL statement before dumping data from server</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-add-drop-table</th> <td>Do not add a DROP TABLE statement before each CREATE TABLE statement</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-add-locks</th> <td>Do not add locks</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-comments</th> <td>Do not add comments to dump file</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-compact</th> <td>Do not produce more compact output</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-disable-keys</th> <td>Do not disable keys</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-extended-insert</th> <td>Turn off extended-insert</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-generated-invisible-primary-key</th> <td>Do not include generated invisible primary keys in dump file</td> <td>8.0.30</td> <td></td> </tr><tr><th scope="row">--skip-opt</th> <td>Turn off options set by --opt</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-quick</th> <td>Do not retrieve rows for a table from the server a row at a time</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-quote-names</th> <td>Do not quote identifiers</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-set-charset</th> <td>Do not write SET NAMES statement</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-triggers</th> <td>Do not dump triggers</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-tz-utc</th> <td>Turn off tz-utc</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Unix socket file or Windows named pipe to use</td> <td></td> <td></td> </tr><tr><th scope="row">--source-data</th> <td>Write the binary log file name and position to the output</td> <td>8.0.26</td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>File that contains list of trusted SSL Certificate Authorities</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>File that contains X.509 certificate</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Permissible ciphers for connection encryption</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>File that contains certificate revocation lists</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Directory that contains certificate revocation-list files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Whether to enable FIPS mode on client side</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>File that contains X.509 key</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Desired security state of connection to server</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>File that contains SSL session data</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Whether to establish connections if session reuse fails</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tab</th> <td>Produce tab-separated data files</td> <td></td> <td></td> </tr><tr><th scope="row">--tables</th> <td>Override --databases or -B option</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Permissible TLS protocols for encrypted connections</td> <td></td> <td></td> </tr><tr><th scope="row">--triggers</th> <td>Dump triggers for each dumped table</td> <td></td> <td></td> </tr><tr><th scope="row">--tz-utc</th> <td>Add SET TIME_ZONE='+00:00' to dump file</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>MySQL user name to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Display version information and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--where</th> <td>Dump only rows selected by given WHERE condition</td> <td></td> <td></td> </tr><tr><th scope="row">--xml</th> <td>Produce XML output</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Compression level for connections to server that use zstd compression</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

#### Connection Options

The **mysqldump** command logs into a MySQL server to extract information. The following options specify how to connect to the MySQL server, either on the same machine or a remote system.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On a computer having multiple network interfaces, use this option to select which interface to use for connecting to the MySQL server.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compress all information sent between the client and the server if possible. See Section 6.2.8, “Connection Compression Control”.

  As of MySQL 8.0.18, this option is deprecated. Expect it to be removed in a future version of MySQL. See Configuring Legacy Connection Compression.

* `--compression-algorithms=value`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>

  The permitted compression algorithms for connections to the server. The available algorithms are the same as for the `protocol_compression_algorithms` system variable. The default value is `uncompressed`.

  For more information, see Section 6.2.8, “Connection Compression Control”.

  This option was added in MySQL 8.0.18.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  A hint about which client-side authentication plugin to use. See Section 8.2.17, “Pluggable Authentication”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Enable the `mysql_clear_password` cleartext authentication plugin. (See Section 8.4.1.4, “Client-Side Cleartext Pluggable Authentication”.)

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>

  Request from the server the public key required for RSA key pair-based password exchange. This option applies to clients that authenticate with the `caching_sha2_password` authentication plugin. For that plugin, the server does not send the public key unless requested. This option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the `caching_sha2_password` plugin, see Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>

  Dump data from the MySQL server on the given host. The default host is `localhost`.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql_config_editor** utility. See Section 6.6.7, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqldump** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqldump** should not prompt for one, use the `--skip-password` option.

* `--password1[=pass_val]`

  The password for multifactor authentication factor 1 of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqldump** prompts for one. If given, there must be *no space* between `--password1=` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqldump** should not prompt for one, use the `--skip-password1` option.

  `--password1` and `--password` are synonymous, as are `--skip-password1` and `--skip-password`.

* `--password2[=pass_val]`

  The password for multifactor authentication factor 2 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.

* `--password3[=pass_val]`

  The password for multifactor authentication factor 3 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

  On Windows, connect to the server using a named pipe. This option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--plugin-authentication-kerberos-client-mode=value`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

  On Windows, the `authentication_kerberos_client` authentication plugin supports this plugin option. It provides two possible values that the client user can set at runtime: `SSPI` and `GSSAPI`.

  The default value for the client-side plugin option uses Security Support Provider Interface (SSPI), which is capable of acquiring credentials from the Windows in-memory cache. Alternatively, the client user can select a mode that supports Generic Security Service Application Program Interface (GSSAPI) through the MIT Kerberos library on Windows. GSSAPI is capable of acquiring cached credentials previously generated by using the **kinit** command.

  For more information, see [Commands for Windows Clients in GSSAPI Mode](kerberos-pluggable-authentication.html#kerberos-usage-win-gssapi-client-commands).

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysqldump** does not find it. See Section 8.2.17, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

  For TCP/IP connections, the port number to use.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 6.2.7, “Connection Transport Protocols”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or `caching_sha2_password` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and `caching_sha2_password` plugins, see Section 8.4.1.3, “SHA-256 Pluggable Authentication”, and Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

  Controls whether to enable FIPS mode on the client side. The `--ssl-fips-mode` option differs from other `--ssl-xxx` options in that it is not used to establish encrypted connections, but rather to affect which cryptographic operations to permit. See Section 8.8, “FIPS Support”.

  These `--ssl-fips-mode` values are permitted:

  + `OFF`: Disable FIPS mode.
  + `ON`: Enable FIPS mode.
  + `STRICT`: Enable “strict” FIPS mode.

  Note

  If the OpenSSL FIPS Object Module is not available, the only permitted value for `--ssl-fips-mode` is `OFF`. In this case, setting `--ssl-fips-mode` to `ON` or `STRICT` causes the client to produce a warning at startup and to operate in non-FIPS mode.

  As of MySQL 8.0.34, this option is deprecated. Expect it to be removed in a future version of MySQL.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>8

  The permissible ciphersuites for encrypted connections that use TLSv1.3. The value is a list of one or more colon-separated ciphersuite names. The ciphersuites that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 8.0.16.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>9

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

  The user name of the MySQL account to use for connecting to the server.

  If you are using the `Rewriter` plugin with MySQL 8.0.31 or later, you should grant this user the `SKIP_QUERY_REWRITE` privilege.

* `--zstd-compression-level=level`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

  The compression level to use for connections to the server that use the `zstd` compression algorithm. The permitted levels are from 1 to 22, with larger values indicating increasing levels of compression. The default `zstd` compression level is 3. The compression level setting has no effect on connections that do not use `zstd` compression.

  For more information, see Section 6.2.8, “Connection Compression Control”.

  This option was added in MySQL 8.0.18.

#### Option-File Options

These options are used to control which option files to read.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>3

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>4

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysqldump** normally reads the `[client]` and `[mysqldump]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysqldump** also reads the `[client_other]` and `[mysqldump_other]` groups.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>5

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql_config_editor** utility. See Section 6.6.7, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>6

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

#### DDL Options

Usage scenarios for **mysqldump** include setting up an entire new MySQL instance (including database tables), and replacing data inside an existing instance with existing databases and tables. The following options let you specify which things to tear down and set up when restoring a dump, by encoding various DDL statements within the dump file.

* `--add-drop-database`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>7

  Write a `DROP DATABASE` statement before each [`CREATE DATABASE`](create-database.html "15.1.12 CREATE DATABASE Statement") statement. This option is typically used in conjunction with the `--all-databases` or `--databases` option because no `CREATE DATABASE` statements are written unless one of those options is specified.

  Note

  In MySQL 8.0, the `mysql` schema is considered a system schema that cannot be dropped by end users. If `--add-drop-database` is used with `--all-databases` or with `--databases` where the list of schemas to be dumped includes `mysql`, the dump file contains a `` DROP DATABASE `mysql` `` statement that causes an error when the dump file is reloaded.

  Instead, to use `--add-drop-database`, use `--databases` with a list of schemas to be dumped, where the list does not include `mysql`.

* `--add-drop-table`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>8

  Write a `DROP TABLE` statement before each `CREATE TABLE` statement.

* `--add-drop-trigger`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>9

  Write a `DROP TRIGGER` statement before each [`CREATE TRIGGER`](create-trigger.html "15.1.22 CREATE TRIGGER Statement") statement.

* `--all-tablespaces`, `-Y`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>0

  Adds to a table dump all SQL statements needed to create any tablespaces used by an `NDB` table. This information is not otherwise included in the output from **mysqldump**. This option is currently relevant only to NDB Cluster tables.

* `--no-create-db`, `-n`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>1

  Suppress the `CREATE DATABASE` statements that are otherwise included in the output if the `--databases` or `--all-databases` option is given.

* `--no-create-info`, `-t`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>2

  Do not write `CREATE TABLE` statements that create each dumped table.

  Note

  This option does *not* exclude statements creating log file groups or tablespaces from **mysqldump** output; however, you can use the `--no-tablespaces` option for this purpose.

* `--no-tablespaces`, `-y`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>3

  This option suppresses all [`CREATE LOGFILE GROUP`](create-logfile-group.html "15.1.16 CREATE LOGFILE GROUP Statement") and [`CREATE TABLESPACE`](create-tablespace.html "15.1.21 CREATE TABLESPACE Statement") statements in the output of **mysqldump**.

* `--replace`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>4

  Write `REPLACE` statements rather than `INSERT` statements.

#### Debug Options

The following options print debugging information, encode debugging information in the dump file, or let the dump operation proceed regardless of potential problems.

* `--allow-keywords`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>5

  Permit creation of column names that are keywords. This works by prefixing each column name with the table name.

* `--comments`, `-i`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>6

  Write additional information in the dump file such as program version, server version, and host. This option is enabled by default. To suppress this additional information, use `--skip-comments`.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>7

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default value is `d:t:o,/tmp/mysqldump.trace`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>8

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-info`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>9

  Print debugging information and memory and CPU usage statistics when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--dump-date`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

  If the `--comments` option is given, **mysqldump** produces a comment at the end of the dump of the following form:

  ```
  -- Dump completed on DATE
  ```

  However, the date causes dump files taken at different times to appear to be different, even if the data are otherwise identical. `--dump-date` and `--skip-dump-date` control whether the date is added to the comment. The default is `--dump-date` (include the date in the comment). `--skip-dump-date` suppresses date printing.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

  Ignore all errors; continue even if an SQL error occurs during a table dump.

  One use for this option is to cause **mysqldump** to continue executing even when it encounters a view that has become invalid because the definition refers to a table that has been dropped. Without `--force`, **mysqldump** exits with an error message. With `--force`, **mysqldump** prints the error message, but it also writes an SQL comment containing the view definition to the dump output and continues executing.

  If the `--ignore-error` option is also given to ignore specific errors, `--force` takes precedence.

* `--log-error=file_name`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

  Log warnings and errors by appending them to the named file. The default is to do no logging.

* `--skip-comments`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

  See the description for the `--comments` option.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

  Verbose mode. Print more information about what the program does.

#### Help Options

The following options display information about the **mysqldump** command itself.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

  Display a help message and exit.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

  Display version information and exit.

#### Internationalization Options

The following options change how the **mysqldump** command represents character data with national language settings.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

  The directory where character sets are installed. See Section 12.15, “Character Set Configuration”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

  Use *`charset_name`* as the default character set. See Section 12.15, “Character Set Configuration”. If no character set is specified, **mysqldump** uses `utf8mb4`.

* `--no-set-names`, `-N`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>9

  Turns off the `--set-charset` setting, the same as specifying `--skip-set-charset`.

* `--set-charset`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>0

  Write [`SET NAMES default_character_set`](set-names.html "15.7.6.3 SET NAMES Statement") to the output. This option is enabled by default. To suppress the `SET NAMES` statement, use `--skip-set-charset`.

#### Replication Options

The **mysqldump** command is frequently used to create an empty instance, or an instance including data, on a replica server in a replication configuration. The following options apply to dumping and restoring data on replication source servers and replicas.

* `--apply-replica-statements`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>1

  From MySQL 8.0.26, use `--apply-replica-statements`, and before MySQL 8.0.26, use `--apply-slave-statements`. Both options have the same effect. For a replica dump produced with the `--dump-replica` or `--dump-slave` option, the options add a [`STOP REPLICA`](stop-replica.html "15.4.2.8 STOP REPLICA Statement") (or before MySQL 8.0.22, [`STOP SLAVE`](stop-slave.html "15.4.2.9 STOP SLAVE Statement")) statement before the statement with the binary log coordinates, and a [`START REPLICA`](start-replica.html "15.4.2.6 START REPLICA Statement") statement at the end of the output.

* `--apply-slave-statements`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>2

  Use this option before MySQL 8.0.26 rather than `--apply-replica-statements`. Both options have the same effect.

* `--delete-source-logs`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>3

  From MySQL 8.0.26, use `--delete-source-logs`, and before MySQL 8.0.26, use `--delete-master-logs`. Both options have the same effect. On a replication source server, the options delete the binary logs by sending a `PURGE BINARY LOGS` statement to the server after performing the dump operation. The options require the `RELOAD` privilege as well as privileges sufficient to execute that statement. The options automatically enable `--source-data` or `--master-data`.

* `--delete-master-logs`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>4

  Use this option before MySQL 8.0.26 rather than `--delete-source-logs`. Both options have the same effect.

* `--dump-replica[=value]`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>5

  From MySQL 8.0.26, use `--dump-replica`, and before MySQL 8.0.26, use `--dump-slave`. Both options have the same effect. The options are similar to `--source-data`, except that they are used to dump a replica server to produce a dump file that can be used to set up another server as a replica that has the same source as the dumped server. The options cause the dump output to include a `CHANGE REPLICATION SOURCE TO` statement (from MySQL 8.0.23) or [`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") statement (before MySQL 8.0.23) that indicates the binary log coordinates (file name and position) of the dumped replica's source. The `CHANGE REPLICATION SOURCE TO` statement reads the values of `Relay_Master_Log_File` and `Exec_Master_Log_Pos` from the [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") output and uses them for `SOURCE_LOG_FILE` and `SOURCE_LOG_POS` respectively. These are the replication source server coordinates from which the replica starts replicating.

  Note

  Inconsistencies in the sequence of transactions from the relay log which have been executed can cause the wrong position to be used. See Section 19.5.1.34, “Replication and Transaction Inconsistencies” for more information.

  `--dump-replica` or `--dump-slave` causes the coordinates from the source to be used rather than those of the dumped server, as is done by the `--source-data` or `--master-data` option. In addition, specifying this option causes the `--source-data` or `--master-data` option to be overridden, if used, and effectively ignored.

  Warning

  `--dump-replica` or `--dump-slave` should not be used if the server where the dump is going to be applied uses `gtid_mode=ON` and `SOURCE_AUTO_POSITION=1` or `MASTER_AUTO_POSITION=1`.

  The option value is handled the same way as for `--source-data`. Setting no value or 1 causes a [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") statement (from MySQL 8.0.23) or `CHANGE MASTER TO` statement (before MySQL 8.0.23) to be written to the dump. Setting 2 causes the statement to be written but encased in SQL comments. It has the same effect as `--source-data` in terms of enabling or disabling other options and in how locking is handled.

  `--dump-replica` or `--dump-slave` causes **mysqldump** to stop the replication SQL thread before the dump and restart it again after.

  `--dump-replica` or `--dump-slave` sends a [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") statement to the server to obtain information, so they require privileges sufficient to execute that statement.

  `--apply-replica-statements` and `--include-source-host-port` options can be used in conjunction with `--dump-replica` or `--dump-slave`.

* `--dump-slave[=value]`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>6

  Use this option before MySQL 8.0.26 rather than `--dump-replica`. Both options have the same effect.

* `--include-source-host-port`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>7

  From MySQL 8.0.26, use `--include-source-host-port`, and before MySQL 8.0.26, use `--include-master-host-port`. Both options have the same effect. The options add the `SOURCE_HOST` | `MASTER_HOST` and `SOURCE_PORT` | `MASTER_PORT` options for the host name and TCP/IP port number of the replica's source, to the `CHANGE REPLICATION SOURCE TO` statement (from MySQL 8.0.23) or [`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") statement (before MySQL 8.0.23) in a replica dump produced with the `--dump-replica` or `--dump-slave` option.

* `--include-master-host-port`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>8

  Use this option before MySQL 8.0.26 rather than `--include-source-host-port`. Both options have the same effect.

* `--source-data[=value]`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>9

  From MySQL 8.0.26, use `--source-data`, and before MySQL 8.0.26, use `--master-data`. Both options have the same effect. The options are used to dump a replication source server to produce a dump file that can be used to set up another server as a replica of the source. The options cause the dump output to include a `CHANGE REPLICATION SOURCE TO` statement (from MySQL 8.0.23) or [`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement") statement (before MySQL 8.0.23) that indicates the binary log coordinates (file name and position) of the dumped server. These are the replication source server coordinates from which the replica should start replicating after you load the dump file into the replica.

  If the option value is 2, the [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement") | `CHANGE MASTER TO` statement is written as an SQL comment, and thus is informative only; it has no effect when the dump file is reloaded. If the option value is 1, the statement is not written as a comment and takes effect when the dump file is reloaded. If no option value is specified, the default value is 1.

  `--source-data` and `--master-data` send a `SHOW MASTER STATUS` statement to the server to obtain information, so they require privileges sufficient to execute that statement. This option also requires the `RELOAD` privilege and the binary log must be enabled.

  `--source-data` and `--master-data` automatically turn off `--lock-tables`. They also turn on `--lock-all-tables`, unless `--single-transaction` also is specified, in which case, a global read lock is acquired only for a short time at the beginning of the dump (see the description for `--single-transaction`). In all cases, any action on logs happens at the exact moment of the dump.

  It is also possible to set up a replica by dumping an existing replica of the source, using the `--dump-replica` or `--dump-slave` option, which overrides `--source-data` and `--master-data` and causes them to be ignored.

* `--master-data[=value]`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>0

  Use this option before MySQL 8.0.26 rather than `--source-data`. Both options have the same effect.

* `--set-gtid-purged=value`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>1

  This option is for servers that use GTID-based replication (`gtid_mode=ON`). It controls the inclusion of a `SET @@GLOBAL.gtid_purged` statement in the dump output, which updates the value of `gtid_purged` on a server where the dump file is reloaded, to add the GTID set from the source server's `gtid_executed` system variable. `gtid_purged` holds the GTIDs of all transactions that have been applied on the server, but do not exist on any binary log file on the server. **mysqldump** therefore adds the GTIDs for the transactions that were executed on the source server, so that the target server records these transactions as applied, although it does not have them in its binary logs. `--set-gtid-purged` also controls the inclusion of a `SET @@SESSION.sql_log_bin=0` statement, which disables binary logging while the dump file is being reloaded. This statement prevents new GTIDs from being generated and assigned to the transactions in the dump file as they are executed, so that the original GTIDs for the transactions are used.

  If you do not set the `--set-gtid-purged` option, the default is that a `SET @@GLOBAL.gtid_purged` statement is included in the dump output if GTIDs are enabled on the server you are backing up, and the set of GTIDs in the global value of the `gtid_executed` system variable is not empty. A `SET @@SESSION.sql_log_bin=0` statement is also included if GTIDs are enabled on the server.

  You can either replace the value of `gtid_purged` with a specified GTID set, or add a plus sign (+) to the statement to append a specified GTID set to the GTID set that is already held by `gtid_purged`. The `SET @@GLOBAL.gtid_purged` statement recorded by **mysqldump** includes a plus sign (`+`) in a version-specific comment, such that MySQL adds the GTID set from the dump file to the existing `gtid_purged` value.

  It is important to note that the value that is included by **mysqldump** for the `SET @@GLOBAL.gtid_purged` statement includes the GTIDs of all transactions in the `gtid_executed` set on the server, even those that changed suppressed parts of the database, or other databases on the server that were not included in a partial dump. This can mean that after the `gtid_purged` value has been updated on the server where the dump file is replayed, GTIDs are present that do not relate to any data on the target server. If you do not replay any further dump files on the target server, the extraneous GTIDs do not cause any problems with the future operation of the server, but they make it harder to compare or reconcile GTID sets on different servers in the replication topology. If you do replay a further dump file on the target server that contains the same GTIDs (for example, another partial dump from the same origin server), any `SET @@GLOBAL.gtid_purged` statement in the second dump file fails. In this case, either remove the statement manually before replaying the dump file, or output the dump file without the statement.

  Before MySQL 8.0.32: Using this option with the `--single-transaction` option could lead to inconsistencies in the output. If `--set-gtid-purged=ON` is required, it can be used with `--lock-all-tables`, but this can prevent parallel queries while **mysqldump** is being run.

  If the `SET @@GLOBAL.gtid_purged` statement would not have the desired result on your target server, you can exclude the statement from the output, or (from MySQL 8.0.17) include it but comment it out so that it is not actioned automatically. You can also include the statement but manually edit it in the dump file to achieve the desired result.

  The possible values for the `--set-gtid-purged` option are as follows:

  `AUTO` :   The default value. If GTIDs are enabled on the server you are backing up and `gtid_executed` is not empty, `SET @@GLOBAL.gtid_purged` is added to the output, containing the GTID set from `gtid_executed`. If GTIDs are enabled, `SET @@SESSION.sql_log_bin=0` is added to the output. If GTIDs are not enabled on the server, the statements are not added to the output.

  `OFF` :   `SET @@GLOBAL.gtid_purged` is not added to the output, and `SET @@SESSION.sql_log_bin=0` is not added to the output. For a server where GTIDs are not in use, use this option or `AUTO`. Only use this option for a server where GTIDs are in use if you are sure that the required GTID set is already present in `gtid_purged` on the target server and should not be changed, or if you plan to identify and add any missing GTIDs manually.

  `ON` :   If GTIDs are enabled on the server you are backing up, `SET @@GLOBAL.gtid_purged` is added to the output (unless `gtid_executed` is empty), and `SET @@SESSION.sql_log_bin=0` is added to the output. An error occurs if you set this option but GTIDs are not enabled on the server. For a server where GTIDs are in use, use this option or `AUTO`, unless you are sure that the GTIDs in `gtid_executed` are not needed on the target server.

  `COMMENTED` :   Available from MySQL 8.0.17. If GTIDs are enabled on the server you are backing up, `SET @@GLOBAL.gtid_purged` is added to the output (unless `gtid_executed` is empty), but it is commented out. This means that the value of `gtid_executed` is available in the output, but no action is taken automatically when the dump file is reloaded. `SET @@SESSION.sql_log_bin=0` is added to the output, and it is not commented out. With `COMMENTED`, you can control the use of the `gtid_executed` set manually or through automation. For example, you might prefer to do this if you are migrating data to another server that already has different active databases.

#### Format Options

The following options specify how to represent the entire dump file or certain kinds of data in the dump file. They also control whether certain optional information is written to the dump file.

* `--compact`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>2

  Produce more compact output. This option enables the `--skip-add-drop-table`, `--skip-add-locks`, `--skip-comments`, `--skip-disable-keys`, and `--skip-set-charset` options.

* `--compatible=name`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>3

  Produce output that is more compatible with other database systems or with older MySQL servers. The only permitted value for this option is `ansi`, which has the same meaning as the corresponding option for setting the server SQL mode. See Section 7.1.11, “Server SQL Modes”.

* `--complete-insert`, `-c`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>4

  Use complete `INSERT` statements that include column names.

* `--create-options`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>5

  Include all MySQL-specific table options in the `CREATE TABLE` statements.

* `--fields-terminated-by=...`, `--fields-enclosed-by=...`, `--fields-optionally-enclosed-by=...`, `--fields-escaped-by=...`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>6

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>7

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>8

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>9

  These options are used with the `--tab` option and have the same meaning as the corresponding `FIELDS` clauses for `LOAD DATA`. See Section 15.2.9, “LOAD DATA Statement”.

* `--hex-blob`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>0

  Dump binary columns using hexadecimal notation (for example, `'abc'` becomes `0x616263`). The affected data types are `BINARY`, `VARBINARY`, `BLOB` types, `BIT`, all spatial data types, and other non-binary data types when used with the [`binary` character set](charset-binary-set.html "12.10.8 The Binary Character Set").

  The `--hex-blob` option is ignored when the `--tab` is used.

* `--lines-terminated-by=...`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>1

  This option is used with the `--tab` option and has the same meaning as the corresponding `LINES` clause for `LOAD DATA`. See Section 15.2.9, “LOAD DATA Statement”.

* `--quote-names`, `-Q`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>2

  Quote identifiers (such as database, table, and column names) within `` ` `` characters. If the `ANSI_QUOTES` SQL mode is enabled, identifiers are quoted within `"` characters. This option is enabled by default. It can be disabled with `--skip-quote-names`, but this option should be given after any option such as `--compatible` that may enable `--quote-names`.

* `--result-file=file_name`, `-r file_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>3

  Direct output to the named file. The result file is created and its previous contents overwritten, even if an error occurs while generating the dump.

  This option should be used on Windows to prevent newline `\n` characters from being converted to `\r\n` carriage return/newline sequences.

* `--show-create-skip-secondary-engine=value`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>4

  Excludes the `SECONDARY ENGINE` clause from `CREATE TABLE` statements. It does so by enabling the `show_create_table_skip_secondary_engine` system variable for the duration of the dump operation. Alternatively, you can enable the `show_create_table_skip_secondary_engine` system variable prior to using **mysqldump**.

  This option was added in MySQL 8.0.18. Attempting a **mysqldump** operation with the `--show-create-skip-secondary-engine` option on a release prior to MySQL 8.0.18 that does not support the `show_create_table_skip_secondary_engine` variable causes an error.

* `--tab=dir_name`, `-T dir_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>5

  Produce tab-separated text-format data files. For each dumped table, **mysqldump** creates a `tbl_name.sql` file that contains the [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") statement that creates the table, and the server writes a `tbl_name.txt` file that contains its data. The option value is the directory in which to write the files.

  Note

  This option should be used only when **mysqldump** is run on the same machine as the **mysqld** server. Because the server creates `*.txt` files in the directory that you specify, the directory must be writable by the server and the MySQL account that you use must have the `FILE` privilege. Because **mysqldump** creates `*.sql` in the same directory, it must be writable by your system login account.

  By default, the `.txt` data files are formatted using tab characters between column values and a newline at the end of each line. The format can be specified explicitly using the `--fields-xxx` and `--lines-terminated-by` options.

  Column values are converted to the character set specified by the `--default-character-set` option.

* `--tz-utc`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>6

  This option enables `TIMESTAMP` columns to be dumped and reloaded between servers in different time zones. **mysqldump** sets its connection time zone to UTC and adds `SET TIME_ZONE='+00:00'` to the dump file. Without this option, `TIMESTAMP` columns are dumped and reloaded in the time zones local to the source and destination servers, which can cause the values to change if the servers are in different time zones. `--tz-utc` also protects against changes due to daylight saving time. `--tz-utc` is enabled by default. To disable it, use `--skip-tz-utc`.

* `--xml`, `-X`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>7

  Write dump output as well-formed XML.

  **`NULL`, `'NULL'`, and Empty Values**: For a column named *`column_name`*, the `NULL` value, an empty string, and the string value `'NULL'` are distinguished from one another in the output generated by this option as follows.

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>8

  The output from the **mysql** client when run using the `--xml` option also follows the preceding rules. (See Section 6.5.1.1, “mysql Client Options”.)

  XML output from **mysqldump** includes the XML namespace, as shown here:

  ```
  $> mysqldump --xml -u root world City
  <?xml version="1.0"?>
  <mysqldump xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <database name="world">
  <table_structure name="City">
  <field Field="ID" Type="int(11)" Null="NO" Key="PRI" Extra="auto_increment" />
  <field Field="Name" Type="char(35)" Null="NO" Key="" Default="" Extra="" />
  <field Field="CountryCode" Type="char(3)" Null="NO" Key="" Default="" Extra="" />
  <field Field="District" Type="char(20)" Null="NO" Key="" Default="" Extra="" />
  <field Field="Population" Type="int(11)" Null="NO" Key="" Default="0" Extra="" />
  <key Table="City" Non_unique="0" Key_name="PRIMARY" Seq_in_index="1" Column_name="ID"
  Collation="A" Cardinality="4079" Null="" Index_type="BTREE" Comment="" />
  <options Name="City" Engine="MyISAM" Version="10" Row_format="Fixed" Rows="4079"
  Avg_row_length="67" Data_length="273293" Max_data_length="18858823439613951"
  Index_length="43008" Data_free="0" Auto_increment="4080"
  Create_time="2007-03-31 01:47:01" Update_time="2007-03-31 01:47:02"
  Collation="latin1_swedish_ci" Create_options="" Comment="" />
  </table_structure>
  <table_data name="City">
  <row>
  <field name="ID">1</field>
  <field name="Name">Kabul</field>
  <field name="CountryCode">AFG</field>
  <field name="District">Kabol</field>
  <field name="Population">1780000</field>
  </row>

  ...

  <row>
  <field name="ID">4079</field>
  <field name="Name">Rafah</field>
  <field name="CountryCode">PSE</field>
  <field name="District">Rafah</field>
  <field name="Population">92020</field>
  </row>
  </table_data>
  </database>
  </mysqldump>
  ```

#### Filtering Options

The following options control which kinds of schema objects are written to the dump file: by category, such as triggers or events; by name, for example, choosing which databases and tables to dump; or even filtering rows from the table data using a `WHERE` clause.

* `--all-databases`, `-A`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>9

  Dump all tables in all databases. This is the same as using the `--databases` option and naming all the databases on the command line.

  Note

  See the `--add-drop-database` description for information about an incompatibility of that option with `--all-databases`.

  Prior to MySQL 8.0, the `--routines` and `--events` options for **mysqldump** and **mysqlpump** were not required to include stored routines and events when using the `--all-databases` option: The dump included the `mysql` system database, and therefore also the `mysql.proc` and `mysql.event` tables containing stored routine and event definitions. As of MySQL 8.0, the `mysql.event` and `mysql.proc` tables are not used. Definitions for the corresponding objects are stored in data dictionary tables, but those tables are not dumped. To include stored routines and events in a dump made using `--all-databases`, use the `--routines` and `--events` options explicitly.

* `--databases`, `-B`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

  Dump several databases. Normally, **mysqldump** treats the first name argument on the command line as a database name and following names as table names. With this option, it treats all name arguments as database names. [`CREATE DATABASE`](create-database.html "15.1.12 CREATE DATABASE Statement") and `USE` statements are included in the output before each new database.

  This option may be used to dump the `performance_schema` database, which normally is not dumped even with the `--all-databases` option. (Also use the `--skip-lock-tables` option.)

  Note

  See the `--add-drop-database` description for information about an incompatibility of that option with `--databases`.

* `--events`, `-E`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

  Include Event Scheduler events for the dumped databases in the output. This option requires the `EVENT` privileges for those databases.

  The output generated by using `--events` contains `CREATE EVENT` statements to create the events.

* `--ignore-error=error[,error]...`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

  Ignore the specified errors. The option value is a list of comma-separated error numbers specifying the errors to ignore during **mysqldump** execution. If the `--force` option is also given to ignore all errors, `--force` takes precedence.

* `--ignore-table=db_name.tbl_name`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

  Do not dump the given table, which must be specified using both the database and table names. To ignore multiple tables, use this option multiple times. This option also can be used to ignore views.

* `--no-data`, `-d`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

  Do not write any table row information (that is, do not dump table contents). This is useful if you want to dump only the `CREATE TABLE` statement for the table (for example, to create an empty copy of the table by loading the dump file).

* `--routines`, `-R`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

  Include stored routines (procedures and functions) for the dumped databases in the output. This option requires the global `SELECT` privilege.

  The output generated by using `--routines` contains `CREATE PROCEDURE` and `CREATE FUNCTION` statements to create the routines.

* `--skip-generated-invisible-primary-key`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

  This option is available beginning with MySQL 8.0.30, and causes generated invisible primary keys to be excluded from the output. For more information, see Section 15.1.20.11, “Generated Invisible Primary Keys”.

* `--tables`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

  Override the `--databases` or `-B` option. **mysqldump** regards all name arguments following the option as table names.

* `--triggers`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

  Include triggers for each dumped table in the output. This option is enabled by default; disable it with `--skip-triggers`.

  To be able to dump a table's triggers, you must have the `TRIGGER` privilege for the table.

  Multiple triggers are permitted. **mysqldump** dumps triggers in activation order so that when the dump file is reloaded, triggers are created in the same activation order. However, if a **mysqldump** dump file contains multiple triggers for a table that have the same trigger event and action time, an error occurs for attempts to load the dump file into an older server that does not support multiple triggers. (For a workaround, see Downgrade Notes; you can convert triggers to be compatible with older servers.)

* `--where='where_condition'`, `-w 'where_condition'`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>9

  Dump only rows selected by the given `WHERE` condition. Quotes around the condition are mandatory if it contains spaces or other characters that are special to your command interpreter.

  Examples:

  ```
  --where="user='jimf'"
  -w"userid>1"
  -w"userid<1"
  ```

#### Performance Options

The following options are the most relevant for the performance particularly of the restore operations. For large data sets, restore operation (processing the `INSERT` statements in the dump file) is the most time-consuming part. When it is urgent to restore data quickly, plan and test the performance of this stage in advance. For restore times measured in hours, you might prefer an alternative backup and restore solution, such as MySQL Enterprise Backup for `InnoDB`-only and mixed-use databases.

Performance is also affected by the [transactional options](mysqldump.html#mysqldump-transaction-options "Transactional Options"), primarily for the dump operation.

* `--column-statistics`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

  Add `ANALYZE TABLE` statements to the output to generate histogram statistics for dumped tables when the dump file is reloaded. This option is disabled by default because histogram generation for large tables can take a long time.

* `--disable-keys`, `-K`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

  For each table, surround the `INSERT` statements with `/*!40000 ALTER TABLE tbl_name DISABLE KEYS */;` and `/*!40000 ALTER TABLE tbl_name ENABLE KEYS */;` statements. This makes loading the dump file faster because the indexes are created after all rows are inserted. This option is effective only for nonunique indexes of `MyISAM` tables.

* `--extended-insert`, `-e`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

  Write `INSERT` statements using multiple-row syntax that includes several `VALUES` lists. This results in a smaller dump file and speeds up inserts when the file is reloaded.

* `--insert-ignore`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

  Write [`INSERT IGNORE`](insert.html "15.2.7 INSERT Statement") statements rather than `INSERT` statements.

* `--max-allowed-packet=value`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

  The maximum size of the buffer for client/server communication. The default is 24MB, the maximum is 1GB.

  Note

  The value of this option is specific to **mysqldump** and should not be confused with the MySQL server's `max_allowed_packet` system variable; the server value cannot be exceeded by a single packet from **mysqldump**, regardless of any setting for the **mysqldump** option, even if the latter is larger.

* `--mysqld-long-query-time=value`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

  Set the session value of the `long_query_time` system variable. Use this option, which is available from MySQL 8.0.30, if you want to increase the time allowed for queries from **mysqldump** before they are logged to the slow query log file. **mysqldump** performs a full table scan, which means its queries can often exceed a global `long_query_time` setting that is useful for regular queries. The default global setting is 10 seconds.

  You can use `--mysqld-long-query-time` to specify a session value from 0 (meaning that every query from **mysqldump** is logged to the slow query log) to 31536000, which is 365 days in seconds. For **mysqldump**’s option, you can only specify whole seconds. When you do not specify this option, the server’s global setting applies to **mysqldump**’s queries.

* `--net-buffer-length=value`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

  The initial size of the buffer for client/server communication. When creating multiple-row `INSERT` statements (as with the `--extended-insert` or `--opt` option), **mysqldump** creates rows up to `--net-buffer-length` bytes long. If you increase this variable, ensure that the MySQL server `net_buffer_length` system variable has a value at least this large.

* `--network-timeout`, `-M`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

  Enable large tables to be dumped by setting `--max-allowed-packet` to its maximum value and network read and write timeouts to a large value. This option is enabled by default. To disable it, use `--skip-network-timeout`.

* `--opt`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

  This option, enabled by default, is shorthand for the combination of `--add-drop-table` `--add-locks` `--create-options` `--disable-keys` `--extended-insert` `--lock-tables` `--quick` `--set-charset`. It gives a fast dump operation and produces a dump file that can be reloaded into a MySQL server quickly.

  Because the `--opt` option is enabled by default, you only specify its converse, the `--skip-opt` to turn off several default settings. See the discussion of [`mysqldump` option groups](mysqldump.html#mysqldump-option-groups "Option Groups") for information about selectively enabling or disabling a subset of the options affected by `--opt`.

* `--quick`, `-q`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>9

  This option is useful for dumping large tables. It forces **mysqldump** to retrieve rows for a table from the server a row at a time rather than retrieving the entire row set and buffering it in memory before writing it out.

* `--skip-opt`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>00

  See the description for the `--opt` option.

#### Transactional Options

The following options trade off the performance of the dump operation, against the reliability and consistency of the exported data.

* `--add-locks`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>01

  Surround each table dump with [`LOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") and [`UNLOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") statements. This results in faster inserts when the dump file is reloaded. See Section 10.2.5.1, “Optimizing INSERT Statements”.

* `--flush-logs`, `-F`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>02

  Flush the MySQL server log files before starting the dump. This option requires the `RELOAD` privilege. If you use this option in combination with the `--all-databases` option, the logs are flushed *for each database dumped*. The exception is when using `--lock-all-tables`, `--source-data` or `--master-data`, or `--single-transaction`. In these cases, the logs are flushed only once, corresponding to the moment that all tables are locked by `FLUSH TABLES WITH READ LOCK`. If you want your dump and the log flush to happen at exactly the same moment, you should use `--flush-logs` together with `--lock-all-tables`, `--source-data` or `--master-data`, or `--single-transaction`.

* `--flush-privileges`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>03

  Add a `FLUSH PRIVILEGES` statement to the dump output after dumping the `mysql` database. This option should be used any time the dump contains the `mysql` database and any other database that depends on the data in the `mysql` database for proper restoration.

  Because the dump file contains a [`FLUSH PRIVILEGES`](flush.html#flush-privileges) statement, reloading the file requires privileges sufficient to execute that statement.

  Note

  For upgrades to MySQL 5.7 or higher from older versions, do not use `--flush-privileges`. For upgrade instructions in this case, see Section 3.5, “Changes in MySQL 8.0”.

* `--lock-all-tables`, `-x`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>04

  Lock all tables across all databases. This is achieved by acquiring a global read lock for the duration of the whole dump. This option automatically turns off `--single-transaction` and `--lock-tables`.

* `--lock-tables`, `-l`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>05

  For each dumped database, lock all tables to be dumped before dumping them. The tables are locked with `READ LOCAL` to permit concurrent inserts in the case of `MyISAM` tables. For transactional tables such as `InnoDB`, `--single-transaction` is a much better option than `--lock-tables` because it does not need to lock the tables at all.

  Because `--lock-tables` locks tables for each database separately, this option does not guarantee that the tables in the dump file are logically consistent between databases. Tables in different databases may be dumped in completely different states.

  Some options, such as `--opt`, automatically enable `--lock-tables`. If you want to override this, use `--skip-lock-tables` at the end of the option list.

* `--no-autocommit`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>06

  Enclose the `INSERT` statements for each dumped table within `SET autocommit = 0` and `COMMIT` statements.

* `--order-by-primary`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>07

  Dump each table's rows sorted by its primary key, or by its first unique index, if such an index exists. This is useful when dumping a `MyISAM` table to be loaded into an `InnoDB` table, but makes the dump operation take considerably longer.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>08

  On Windows, the shared-memory name to use for connections made using shared memory to a local server. The default value is `MYSQL`. The shared-memory name is case-sensitive.

  This option applies only if the server was started with the `shared_memory` system variable enabled to support shared-memory connections.

* `--single-transaction`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>09

  This option sets the transaction isolation mode to `REPEATABLE READ` and sends a [`START TRANSACTION`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") SQL statement to the server before dumping data. It is useful only with transactional tables such as `InnoDB`, because then it dumps the consistent state of the database at the time when [`START TRANSACTION`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") was issued without blocking any applications.

  The `RELOAD` or `FLUSH_TABLES` privilege is required with `--single-transaction` if both `gtid_mode=ON` and `gtid_purged=ON|AUTO`. This requirement was added in MySQL 8.0.32.

  When using this option, you should keep in mind that only `InnoDB` tables are dumped in a consistent state. For example, any `MyISAM` or `MEMORY` tables dumped while using this option may still change state.

  While a `--single-transaction` dump is in process, to ensure a valid dump file (correct table contents and binary log coordinates), no other connection should use the following statements: `ALTER TABLE`, `CREATE TABLE`, `DROP TABLE`, `RENAME TABLE`, `TRUNCATE TABLE`. A consistent read is not isolated from those statements, so use of them on a table to be dumped can cause the `SELECT` that is performed by **mysqldump** to retrieve the table contents to obtain incorrect contents or fail.

  The `--single-transaction` option and the `--lock-tables` option are mutually exclusive because [`LOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") causes any pending transactions to be committed implicitly.

  Before 8.0.32: Using `--single-transaction` together with the `--set-gtid-purged` option was not recommended; doing so could lead to inconsistencies in the output of **mysqldump**.

  To dump large tables, combine the `--single-transaction` option with the `--quick` option.

#### Option Groups

* The `--opt` option turns on several settings that work together to perform a fast dump operation. All of these settings are on by default, because `--opt` is on by default. Thus you rarely if ever specify `--opt`. Instead, you can turn these settings off as a group by specifying `--skip-opt`, then optionally re-enable certain settings by specifying the associated options later on the command line.

* The `--compact` option turns off several settings that control whether optional statements and comments appear in the output. Again, you can follow this option with other options that re-enable certain settings, or turn all the settings on by using the `--skip-compact` form.

When you selectively enable or disable the effect of a group option, order is important because options are processed first to last. For example, `--disable-keys` `--lock-tables` `--skip-opt` would not have the intended effect; it is the same as `--skip-opt` by itself.

#### Examples

To make a backup of an entire database:

```
mysqldump db_name > backup-file.sql
```

To load the dump file back into the server:

```
mysql db_name < backup-file.sql
```

Another way to reload the dump file:

```
mysql -e "source /path-to-backup/backup-file.sql" db_name
```

**mysqldump** is also very useful for populating databases by copying data from one MySQL server to another:

```
mysqldump --opt db_name | mysql --host=remote_host -C db_name
```

You can dump several databases with one command:

```
mysqldump --databases db_name1 [db_name2 ...] > my_databases.sql
```

To dump all databases, use the `--all-databases` option:

```
mysqldump --all-databases > all_databases.sql
```

For `InnoDB` tables, **mysqldump** provides a way of making an online backup:

```
mysqldump --all-databases --master-data --single-transaction > all_databases.sql
```

Or, in MySQL 8.0.26 and later:

```
mysqldump --all-databases --source-data --single-transaction > all_databases.sql
```

This backup acquires a global read lock on all tables (using `FLUSH TABLES WITH READ LOCK`) at the beginning of the dump. As soon as this lock has been acquired, the binary log coordinates are read and the lock is released. If long updating statements are running when the `FLUSH` statement is issued, the MySQL server may get stalled until those statements finish. After that, the dump becomes lock free and does not disturb reads and writes on the tables. If the update statements that the MySQL server receives are short (in terms of execution time), the initial lock period should not be noticeable, even with many updates.

For point-in-time recovery (also known as “roll-forward,” when you need to restore an old backup and replay the changes that happened since that backup), it is often useful to rotate the binary log (see Section 7.4.4, “The Binary Log”) or at least know the binary log coordinates to which the dump corresponds:

```
mysqldump --all-databases --master-data=2 > all_databases.sql
```

Or, in MySQL 8.0.26 and later:

```
mysqldump --all-databases --source-data=2 > all_databases.sql
```

Or:

```
mysqldump --all-databases --flush-logs --master-data=2 > all_databases.sql
```

Or, in MySQL 8.0.26 and later:

```
mysqldump --all-databases --flush-logs --source-data=2 > all_databases.sql
```

The `--source-data` or `--master-data` option can be used simultaneously with the `--single-transaction` option, which provides a convenient way to make an online backup suitable for use prior to point-in-time recovery if tables are stored using the `InnoDB` storage engine.

For more information on making backups, see Section 9.2, “Database Backup Methods”, and Section 9.3, “Example Backup and Recovery Strategy”.

* To select the effect of `--opt` except for some features, use the `--skip` option for each feature. To disable extended inserts and memory buffering, use `--opt` `--skip-extended-insert` `--skip-quick`. (Actually, `--skip-extended-insert` `--skip-quick` is sufficient because `--opt` is on by default.)

* To reverse `--opt` for all features except disabling of indexes and table locking, use `--skip-opt` `--disable-keys` `--lock-tables`.

#### Restrictions

**mysqldump** does not dump the `performance_schema` or `sys` schema by default. To dump any of these, name them explicitly on the command line. You can also name them with the `--databases` option. For `performance_schema`, also use the `--skip-lock-tables` option.

**mysqldump** does not dump the `INFORMATION_SCHEMA` schema.

**mysqldump** does not dump `InnoDB` [`CREATE TABLESPACE`](create-tablespace.html "15.1.21 CREATE TABLESPACE Statement") statements.

**mysqldump** does not dump the NDB Cluster `ndbinfo` information database.

**mysqldump** includes statements to recreate the `general_log` and `slow_query_log` tables for dumps of the `mysql` database. Log table contents are not dumped.

If you encounter problems backing up views due to insufficient privileges, see Section 27.9, “Restrictions on Views” for a workaround.


### 6.5.5 mysqlimport — A Data Import Program

The **mysqlimport** client provides a command-line interface to the [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement") SQL statement. Most options to **mysqlimport** correspond directly to clauses of `LOAD DATA` syntax. See Section 15.2.9, “LOAD DATA Statement”.

Invoke **mysqlimport** like this:

```
mysqlimport [options] db_name textfile1 [textfile2 ...]
```

For each text file named on the command line, **mysqlimport** strips any extension from the file name and uses the result to determine the name of the table into which to import the file's contents. For example, files named `patient.txt`, `patient.text`, and `patient` all would be imported into a table named `patient`.

**mysqlimport** supports the following options, which can be specified on the command line or in the `[mysqlimport]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see Section 6.2.2.2, “Using Option Files”.

**Table 6.16 mysqlimport Options**

<table frame="box" rules="all" summary="Command-line options available for mysqlimport."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--bind-address</th> <td>Use specified network interface to connect to MySQL Server</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Directory where character sets can be found</td> <td></td> <td></td> </tr><tr><th scope="row">--columns</th> <td>This option takes a comma-separated list of column names as its value</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compress all information sent between client and server</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Permitted compression algorithms for connections to server</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Print debugging information when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Print debugging information, memory, and CPU statistics when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Authentication plugin to use</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Specify default character set</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Read named option file in addition to usual option files</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Read only named option file</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Option group suffix value</td> <td></td> <td></td> </tr><tr><th scope="row">--delete</th> <td>Empty the table before importing the text file</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Enable cleartext authentication plugin</td> <td></td> <td></td> </tr><tr><th scope="row">--fields-enclosed-by</th> <td>This option has the same meaning as the corresponding clause for LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row">--fields-escaped-by</th> <td>This option has the same meaning as the corresponding clause for LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row">--fields-optionally-enclosed-by</th> <td>This option has the same meaning as the corresponding clause for LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row">--fields-terminated-by</th> <td>This option has the same meaning as the corresponding clause for LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row">--force</th> <td>Continue even if an SQL error occurs</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Request RSA public key from server</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Display help message and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Host on which MySQL server is located</td> <td></td> <td></td> </tr><tr><th scope="row">--ignore</th> <td>See the description for the --replace option</td> <td></td> <td></td> </tr><tr><th scope="row">--ignore-lines</th> <td>Ignore the first N lines of the data file</td> <td></td> <td></td> </tr><tr><th scope="row">--lines-terminated-by</th> <td>This option has the same meaning as the corresponding clause for LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row">--local</th> <td>Read input files locally from the client host</td> <td></td> <td></td> </tr><tr><th scope="row">--lock-tables</th> <td>Lock all tables for writing before processing any text files</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Read login path options from .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--low-priority</th> <td>Use LOW_PRIORITY when loading the table</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Read no option files</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Password to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>First multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Second multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Third multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Connect to server using named pipe (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Directory where plugins are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Transport protocol to use</td> <td></td> <td></td> </tr><tr><th scope="row">--replace</th> <td>The --replace and --ignore options control handling of input rows that duplicate existing rows on unique key values</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Path name to file containing RSA public key</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Shared-memory name for shared-memory connections (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Produce output only when errors occur</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Unix socket file or Windows named pipe to use</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>File that contains list of trusted SSL Certificate Authorities</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>File that contains X.509 certificate</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Permissible ciphers for connection encryption</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>File that contains certificate revocation lists</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Directory that contains certificate revocation-list files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Whether to enable FIPS mode on client side</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>File that contains X.509 key</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Desired security state of connection to server</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>File that contains SSL session data</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Whether to establish connections if session reuse fails</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Permissible TLS protocols for encrypted connections</td> <td></td> <td></td> </tr><tr><th scope="row">--use-threads</th> <td>Number of threads for parallel file-loading</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>MySQL user name to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Display version information and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Compression level for connections to server that use zstd compression</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On a computer having multiple network interfaces, use this option to select which interface to use for connecting to the MySQL server.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  The directory where character sets are installed. See Section 12.15, “Character Set Configuration”.

* `--columns=column_list`, `-c column_list`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>

  This option takes a list of comma-separated column names as its value. The order of the column names indicates how to match data file columns with table columns.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compress all information sent between the client and the server if possible. See Section 6.2.8, “Connection Compression Control”.

  As of MySQL 8.0.18, this option is deprecated. Expect it to be removed in a future version of MySQL. See Configuring Legacy Connection Compression.

* `--compression-algorithms=value`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>

  The permitted compression algorithms for connections to the server. The available algorithms are the same as for the `protocol_compression_algorithms` system variable. The default value is `uncompressed`.

  For more information, see Section 6.2.8, “Connection Compression Control”.

  This option was added in MySQL 8.0.18.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:o</code></td> </tr></tbody></table>

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:o`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for debug-check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-check</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-info`

  <table frame="box" rules="all" summary="Properties for debug-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Print debugging information and memory and CPU usage statistics when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

  Use *`charset_name`* as the default character set. See Section 12.15, “Character Set Configuration”.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

  A hint about which client-side authentication plugin to use. See Section 8.2.17, “Pluggable Authentication”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysqlimport** normally reads the `[client]` and `[mysqlimport]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysqlimport** also reads the `[client_other]` and `[mysqlimport_other]` groups.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--delete`, `-D`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

  Empty the table before importing the text file.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

  Enable the `mysql_clear_password` cleartext authentication plugin. (See Section 8.4.1.4, “Client-Side Cleartext Pluggable Authentication”.)

* `--fields-terminated-by=...`, `--fields-enclosed-by=...`, `--fields-optionally-enclosed-by=...`, `--fields-escaped-by=...`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

  These options have the same meaning as the corresponding clauses for `LOAD DATA`. See Section 15.2.9, “LOAD DATA Statement”.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

  Ignore errors. For example, if a table for a text file does not exist, continue processing any remaining files. Without `--force`, **mysqlimport** exits if a table does not exist.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

  Request from the server the public key required for RSA key pair-based password exchange. This option applies to clients that authenticate with the `caching_sha2_password` authentication plugin. For that plugin, the server does not send the public key unless requested. This option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the `caching_sha2_password` plugin, see Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

  Import data to the MySQL server on the given host. The default host is `localhost`.

* `--ignore`, `-i`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

  See the description for the `--replace` option.

* `--ignore-lines=N`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

  Ignore the first *`N`* lines of the data file.

* `--lines-terminated-by=...`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

  This option has the same meaning as the corresponding clause for `LOAD DATA`. For example, to import Windows files that have lines terminated with carriage return/linefeed pairs, use `--lines-terminated-by="\r\n"`. (You might have to double the backslashes, depending on the escaping conventions of your command interpreter.) See Section 15.2.9, “LOAD DATA Statement”.

* `--local`, `-L`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

  By default, files are read by the server on the server host. With this option, **mysqlimport** reads input files locally on the client host.

  Successful use of `LOCAL` load operations within **mysqlimport** also requires that the server permits local loading; see Section 8.1.6, “Security Considerations for LOAD DATA LOCAL”

* `--lock-tables`, `-l`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>8

  Lock *all* tables for writing before processing any text files. This ensures that all tables are synchronized on the server.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>9

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql_config_editor** utility. See Section 6.6.7, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--low-priority`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

  Use `LOW_PRIORITY` when loading the table. This affects only storage engines that use only table-level locking (such as `MyISAM`, `MEMORY`, and `MERGE`).

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql_config_editor** utility. See Section 6.6.7, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

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

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

  On Windows, connect to the server using a named pipe. This option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysqlimport** does not find it. See Section 8.2.17, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>5

  For TCP/IP connections, the port number to use.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>6

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>7

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 6.2.7, “Connection Transport Protocols”.

* `--replace`, `-r`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>8

  The `--replace` and `--ignore` options control handling of input rows that duplicate existing rows on unique key values. If you specify `--replace`, new rows replace existing rows that have the same unique key value. If you specify `--ignore`, input rows that duplicate an existing row on a unique key value are skipped. If you do not specify either option, an error occurs when a duplicate key value is found, and the rest of the text file is ignored.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>9

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or `caching_sha2_password` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and `caching_sha2_password` plugins, see Section 8.4.1.3, “SHA-256 Pluggable Authentication”, and Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>0

  On Windows, the shared-memory name to use for connections made using shared memory to a local server. The default value is `MYSQL`. The shared-memory name is case-sensitive.

  This option applies only if the server was started with the `shared_memory` system variable enabled to support shared-memory connections.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>1

  Silent mode. Produce output only when errors occur.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>2

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>3

  Controls whether to enable FIPS mode on the client side. The `--ssl-fips-mode` option differs from other `--ssl-xxx` options in that it is not used to establish encrypted connections, but rather to affect which cryptographic operations to permit. See Section 8.8, “FIPS Support”.

  These `--ssl-fips-mode` values are permitted:

  + `OFF`: Disable FIPS mode.
  + `ON`: Enable FIPS mode.
  + `STRICT`: Enable “strict” FIPS mode.

  Note

  If the OpenSSL FIPS Object Module is not available, the only permitted value for `--ssl-fips-mode` is `OFF`. In this case, setting `--ssl-fips-mode` to `ON` or `STRICT` causes the client to produce a warning at startup and to operate in non-FIPS mode.

  As of MySQL 8.0.34, this option is deprecated. Expect it to be removed in a future version of MySQL.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>4

  The permissible ciphersuites for encrypted connections that use TLSv1.3. The value is a list of one or more colon-separated ciphersuite names. The ciphersuites that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 8.0.16.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>5

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>6

  The user name of the MySQL account to use for connecting to the server.

* `--use-threads=N`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>7

  Load files in parallel using *`N`* threads.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>8

  Verbose mode. Print more information about what the program does.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>9

  Display version information and exit.

* `--zstd-compression-level=level`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

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


### 6.5.6 mysqlpump — A Database Backup Program

* mysqlpump Invocation Syntax
* mysqlpump Option Summary
* mysqlpump Option Descriptions
* mysqlpump Object Selection
* mysqlpump Parallel Processing
* mysqlpump Restrictions

The **mysqlpump** client utility performs logical backups, producing a set of SQL statements that can be executed to reproduce the original database object definitions and table data. It dumps one or more MySQL databases for backup or transfer to another SQL server.

Note

**mysqlpump** is deprecated as of MySQL 8.0.34; expect it to be removed in a future version of MySQL. You can use such MySQL programs as **mysqldump** and MySQL Shell to perform logical backups, dump databases, and similar tasks instead.

Tip

Consider using the MySQL Shell dump utilities, which provide parallel dumping with multiple threads, file compression, and progress information display, as well as cloud features such as Oracle Cloud Infrastructure Object Storage streaming, and MySQL HeatWave compatibility checks and modifications. Dumps can be easily imported into a MySQL Server instance or a MySQL HeatWave DB System using the MySQL Shell load dump utilities. Installation instructions for MySQL Shell can be found here.

**mysqlpump** features include:

* Parallel processing of databases, and of objects within databases, to speed up the dump process

* Better control over which databases and database objects (tables, stored programs, user accounts) to dump

* Dumping of user accounts as account-management statements (`CREATE USER`, `GRANT`) rather than as inserts into the `mysql` system database

* Capability of creating compressed output
* Progress indicator (the values are estimates)
* For dump file reloading, faster secondary index creation for `InnoDB` tables by adding indexes after rows are inserted

Note

**mysqlpump** uses MySQL features introduced in MySQL 5.7, and thus assumes use with MySQL 5.7 or higher.

**mysqlpump** requires at least the `SELECT` privilege for dumped tables, `SHOW VIEW` for dumped views, `TRIGGER` for dumped triggers, and `LOCK TABLES` if the `--single-transaction` option is not used. The `SELECT` privilege on the `mysql` system database is required to dump user definitions. Certain options might require other privileges as noted in the option descriptions.

To reload a dump file, you must have the privileges required to execute the statements that it contains, such as the appropriate `CREATE` privileges for objects created by those statements.

Note

A dump made using PowerShell on Windows with output redirection creates a file that has UTF-16 encoding:

```
mysqlpump [options] > dump.sql
```

However, UTF-16 is not permitted as a connection character set (see Section 12.4, “Connection Character Sets and Collations”), so the dump file cannot be loaded correctly. To work around this issue, use the `--result-file` option, which creates the output in ASCII format:

```
mysqlpump [options] --result-file=dump.sql
```

#### mysqlpump Invocation Syntax

By default, **mysqlpump** dumps all databases (with certain exceptions noted in mysqlpump Restrictions). To specify this behavior explicitly, use the `--all-databases` option:

```
mysqlpump --all-databases
```

To dump a single database, or certain tables within that database, name the database on the command line, optionally followed by table names:

```
mysqlpump db_name
mysqlpump db_name tbl_name1 tbl_name2 ...
```

To treat all name arguments as database names, use the `--databases` option:

```
mysqlpump --databases db_name1 db_name2 ...
```

By default, **mysqlpump** does not dump user account definitions, even if you dump the `mysql` system database that contains the grant tables. To dump grant table contents as logical definitions in the form of `CREATE USER` and `GRANT` statements, use the `--users` option and suppress all database dumping:

```
mysqlpump --exclude-databases=% --users
```

In the preceding command, `%` is a wildcard that matches all database names for the `--exclude-databases` option.

**mysqlpump** supports several options for including or excluding databases, tables, stored programs, and user definitions. See mysqlpump Object Selection.

To reload a dump file, execute the statements that it contains. For example, use the **mysql** client:

```
mysqlpump [options] > dump.sql
mysql < dump.sql
```

The following discussion provides additional **mysqlpump** usage examples.

To see a list of the options **mysqlpump** supports, issue the command **mysqlpump --help**.

#### mysqlpump Option Summary

**mysqlpump** supports the following options, which can be specified on the command line or in the `[mysqlpump]` and `[client]` groups of an option file. (Prior to MySQL 8.0.20, **mysqlpump** read the `[mysql_dump]` group rather than `[mysqlpump]`. As of 8.0.20, `[mysql_dump]` is still accepted but is deprecated.) For information about option files used by MySQL programs, see Section 6.2.2.2, “Using Option Files”.

**Table 6.17 mysqlpump Options**

<table frame="box" rules="all" summary="Command-line options available for mysqlpump."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--add-drop-database</th> <td>Add DROP DATABASE statement before each CREATE DATABASE statement</td> <td></td> <td></td> </tr><tr><th scope="row">--add-drop-table</th> <td>Add DROP TABLE statement before each CREATE TABLE statement</td> <td></td> <td></td> </tr><tr><th scope="row">--add-drop-user</th> <td>Add DROP USER statement before each CREATE USER statement</td> <td></td> <td></td> </tr><tr><th scope="row">--add-locks</th> <td>Surround each table dump with LOCK TABLES and UNLOCK TABLES statements</td> <td></td> <td></td> </tr><tr><th scope="row">--all-databases</th> <td>Dump all databases</td> <td></td> <td></td> </tr><tr><th scope="row">--bind-address</th> <td>Use specified network interface to connect to MySQL Server</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Directory where character sets are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--column-statistics</th> <td>Write ANALYZE TABLE statements to generate statistics histograms</td> <td></td> <td></td> </tr><tr><th scope="row">--complete-insert</th> <td>Use complete INSERT statements that include column names</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compress all information sent between client and server</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compress-output</th> <td>Output compression algorithm</td> <td></td> <td></td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Permitted compression algorithms for connections to server</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--databases</th> <td>Interpret all name arguments as database names</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Print debugging information when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Print debugging information, memory, and CPU statistics when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Authentication plugin to use</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Specify default character set</td> <td></td> <td></td> </tr><tr><th scope="row">--default-parallelism</th> <td>Default number of threads for parallel processing</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Read named option file in addition to usual option files</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Read only named option file</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Option group suffix value</td> <td></td> <td></td> </tr><tr><th scope="row">--defer-table-indexes</th> <td>For reloading, defer index creation until after loading table rows</td> <td></td> <td></td> </tr><tr><th scope="row">--events</th> <td>Dump events from dumped databases</td> <td></td> <td></td> </tr><tr><th scope="row">--exclude-databases</th> <td>Databases to exclude from dump</td> <td></td> <td></td> </tr><tr><th scope="row">--exclude-events</th> <td>Events to exclude from dump</td> <td></td> <td></td> </tr><tr><th scope="row">--exclude-routines</th> <td>Routines to exclude from dump</td> <td></td> <td></td> </tr><tr><th scope="row">--exclude-tables</th> <td>Tables to exclude from dump</td> <td></td> <td></td> </tr><tr><th scope="row">--exclude-triggers</th> <td>Triggers to exclude from dump</td> <td></td> <td></td> </tr><tr><th scope="row">--exclude-users</th> <td>Users to exclude from dump</td> <td></td> <td></td> </tr><tr><th scope="row">--extended-insert</th> <td>Use multiple-row INSERT syntax</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Request RSA public key from server</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Display help message and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--hex-blob</th> <td>Dump binary columns using hexadecimal notation</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Host on which MySQL server is located</td> <td></td> <td></td> </tr><tr><th scope="row">--include-databases</th> <td>Databases to include in dump</td> <td></td> <td></td> </tr><tr><th scope="row">--include-events</th> <td>Events to include in dump</td> <td></td> <td></td> </tr><tr><th scope="row">--include-routines</th> <td>Routines to include in dump</td> <td></td> <td></td> </tr><tr><th scope="row">--include-tables</th> <td>Tables to include in dump</td> <td></td> <td></td> </tr><tr><th scope="row">--include-triggers</th> <td>Triggers to include in dump</td> <td></td> <td></td> </tr><tr><th scope="row">--include-users</th> <td>Users to include in dump</td> <td></td> <td></td> </tr><tr><th scope="row">--insert-ignore</th> <td>Write INSERT IGNORE rather than INSERT statements</td> <td></td> <td></td> </tr><tr><th scope="row">--log-error-file</th> <td>Append warnings and errors to named file</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Read login path options from .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--max-allowed-packet</th> <td>Maximum packet length to send to or receive from server</td> <td></td> <td></td> </tr><tr><th scope="row">--net-buffer-length</th> <td>Buffer size for TCP/IP and socket communication</td> <td></td> <td></td> </tr><tr><th scope="row">--no-create-db</th> <td>Do not write CREATE DATABASE statements</td> <td></td> <td></td> </tr><tr><th scope="row">--no-create-info</th> <td>Do not write CREATE TABLE statements that re-create each dumped table</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Read no option files</td> <td></td> <td></td> </tr><tr><th scope="row">--parallel-schemas</th> <td>Specify schema-processing parallelism</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Password to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>First multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Second multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Third multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Directory where plugins are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Transport protocol to use</td> <td></td> <td></td> </tr><tr><th scope="row">--replace</th> <td>Write REPLACE statements rather than INSERT statements</td> <td></td> <td></td> </tr><tr><th scope="row">--result-file</th> <td>Direct output to a given file</td> <td></td> <td></td> </tr><tr><th scope="row">--routines</th> <td>Dump stored routines (procedures and functions) from dumped databases</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Path name to file containing RSA public key</td> <td></td> <td></td> </tr><tr><th scope="row">--set-charset</th> <td>Add SET NAMES default_character_set to output</td> <td></td> <td></td> </tr><tr><th scope="row">--set-gtid-purged</th> <td>Whether to add SET @@GLOBAL.GTID_PURGED to output</td> <td></td> <td></td> </tr><tr><th scope="row">--single-transaction</th> <td>Dump tables within single transaction</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-definer</th> <td>Omit DEFINER and SQL SECURITY clauses from view and stored program CREATE statements</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-dump-rows</th> <td>Do not dump table rows</td> <td></td> <td></td> </tr><tr><th scope="row">--skip-generated-invisible-primary-key</th> <td>Do not dump information about generated invisible primary keys</td> <td>8.0.30</td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Unix socket file or Windows named pipe to use</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>File that contains list of trusted SSL Certificate Authorities</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>File that contains X.509 certificate</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Permissible ciphers for connection encryption</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>File that contains certificate revocation lists</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Directory that contains certificate revocation-list files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Whether to enable FIPS mode on client side</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>File that contains X.509 key</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Desired security state of connection to server</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>File that contains SSL session data</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Whether to establish connections if session reuse fails</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Permissible TLS protocols for encrypted connections</td> <td></td> <td></td> </tr><tr><th scope="row">--triggers</th> <td>Dump triggers for each dumped table</td> <td></td> <td></td> </tr><tr><th scope="row">--tz-utc</th> <td>Add SET TIME_ZONE='+00:00' to dump file</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>MySQL user name to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--users</th> <td>Dump user accounts</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Display version information and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--watch-progress</th> <td>Display progress indicator</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Compression level for connections to server that use zstd compression</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

#### mysqlpump Option Descriptions

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--add-drop-database`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>

  Write a `DROP DATABASE` statement before each [`CREATE DATABASE`](create-database.html "15.1.12 CREATE DATABASE Statement") statement.

  Note

  In MySQL 8.0, the `mysql` schema is considered a system schema that cannot be dropped by end users. If `--add-drop-database` is used with `--all-databases` or with `--databases` where the list of schemas to be dumped includes `mysql`, the dump file contains a `` DROP DATABASE `mysql` `` statement that causes an error when the dump file is reloaded.

  Instead, to use `--add-drop-database`, use `--databases` with a list of schemas to be dumped, where the list does not include `mysql`.

* `--add-drop-table`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>

  Write a `DROP TABLE` statement before each `CREATE TABLE` statement.

* `--add-drop-user`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>

  Write a `DROP USER` statement before each `CREATE USER` statement.

* `--add-locks`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>

  Surround each table dump with [`LOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") and [`UNLOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") statements. This results in faster inserts when the dump file is reloaded. See Section 10.2.5.1, “Optimizing INSERT Statements”.

  This option does not work with parallelism because `INSERT` statements from different tables can be interleaved and [`UNLOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") following the end of the inserts for one table could release locks on tables for which inserts remain.

  `--add-locks` and `--single-transaction` are mutually exclusive.

* `--all-databases`, `-A`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  Dump all databases (with certain exceptions noted in mysqlpump Restrictions). This is the default behavior if no other is specified explicitly.

  `--all-databases` and `--databases` are mutually exclusive.

  Note

  See the `--add-drop-database` description for information about an incompatibility of that option with `--all-databases`.

  Prior to MySQL 8.0, the `--routines` and `--events` options for **mysqldump** and **mysqlpump** were not required to include stored routines and events when using the `--all-databases` option: The dump included the `mysql` system database, and therefore also the `mysql.proc` and `mysql.event` tables containing stored routine and event definitions. As of MySQL 8.0, the `mysql.event` and `mysql.proc` tables are not used. Definitions for the corresponding objects are stored in data dictionary tables, but those tables are not dumped. To include stored routines and events in a dump made using `--all-databases`, use the `--routines` and `--events` options explicitly.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On a computer having multiple network interfaces, use this option to select which interface to use for connecting to the MySQL server.

* `--character-sets-dir=path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The directory where character sets are installed. See Section 12.15, “Character Set Configuration”.

* `--column-statistics`

  <table frame="box" rules="all" summary="Properties for column-statistics"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--column-statistics</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Add `ANALYZE TABLE` statements to the output to generate histogram statistics for dumped tables when the dump file is reloaded. This option is disabled by default because histogram generation for large tables can take a long time.

* `--complete-insert`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

  Write complete `INSERT` statements that include column names.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

  Compress all information sent between the client and the server if possible. See Section 6.2.8, “Connection Compression Control”.

  As of MySQL 8.0.18, this option is deprecated. Expect it to be removed in a future version of MySQL. See Configuring Legacy Connection Compression.

* `--compress-output=algorithm`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

  By default, **mysqlpump** does not compress output. This option specifies output compression using the specified algorithm. Permitted algorithms are `LZ4` and `ZLIB`.

  To uncompress compressed output, you must have an appropriate utility. If the system commands **lz4** and **openssl zlib** are not available, MySQL distributions include **lz4_decompress** and **zlib_decompress** utilities that can be used to decompress **mysqlpump** output that was compressed using the `--compress-output=LZ4` and `--compress-output=ZLIB` options. For more information, see Section 6.8.1, “lz4_decompress — Decompress mysqlpump LZ4-Compressed Output”, and Section 6.8.3, “zlib_decompress — Decompress mysqlpump ZLIB-Compressed Output”.

* `--compression-algorithms=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

  The permitted compression algorithms for connections to the server. The available algorithms are the same as for the `protocol_compression_algorithms` system variable. The default value is `uncompressed`.

  For more information, see Section 6.2.8, “Connection Compression Control”.

  This option was added in MySQL 8.0.18.

* `--databases`, `-B`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

  Normally, **mysqlpump** treats the first name argument on the command line as a database name and any following names as table names. With this option, it treats all name arguments as database names. `CREATE DATABASE` statements are included in the output before each new database.

  `--all-databases` and `--databases` are mutually exclusive.

  Note

  See the `--add-drop-database` description for information about an incompatibility of that option with `--databases`.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:O,/tmp/mysqlpump.trace`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

  Print debugging information and memory and CPU usage statistics when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

  A hint about which client-side authentication plugin to use. See Section 8.2.17, “Pluggable Authentication”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

  Use *`charset_name`* as the default character set. See Section 12.15, “Character Set Configuration”. If no character set is specified, **mysqlpump** uses `utf8mb4`.

* `--default-parallelism=N`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>0

  The default number of threads for each parallel processing queue. The default is 2.

  The `--parallel-schemas` option also affects parallelism and can be used to override the default number of threads. For more information, see mysqlpump Parallel Processing.

  With `--default-parallelism=0` and no `--parallel-schemas` options, **mysqlpump** runs as a single-threaded process and creates no queues.

  With parallelism enabled, it is possible for output from different databases to be interleaved.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>1

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>2

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>3

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysqlpump** normally reads the `[client]` and `[mysqlpump]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysqlpump** also reads the `[client_other]` and `[mysqlpump_other]` groups.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defer-table-indexes`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>4

  In the dump output, defer index creation for each table until after its rows have been loaded. This works for all storage engines, but for `InnoDB` applies only for secondary indexes.

  This option is enabled by default; use `--skip-defer-table-indexes` to disable it.

* `--events`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>5

  Include Event Scheduler events for the dumped databases in the output. Event dumping requires the `EVENT` privileges for those databases.

  The output generated by using `--events` contains `CREATE EVENT` statements to create the events.

  This option is enabled by default; use `--skip-events` to disable it.

* `--exclude-databases=db_list`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>6

  Do not dump the databases in *`db_list`*, which is a list of one or more comma-separated database names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--exclude-events=event_list`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>7

  Do not dump the databases in *`event_list`*, which is a list of one or more comma-separated event names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--exclude-routines=routine_list`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>8

  Do not dump the events in *`routine_list`*, which is a list of one or more comma-separated routine (stored procedure or function) names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--exclude-tables=table_list`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>9

  Do not dump the tables in *`table_list`*, which is a list of one or more comma-separated table names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--exclude-triggers=trigger_list`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>0

  Do not dump the triggers in *`trigger_list`*, which is a list of one or more comma-separated trigger names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--exclude-users=user_list`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>1

  Do not dump the user accounts in *`user_list`*, which is a list of one or more comma-separated account names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--extended-insert=N`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>2

  Write `INSERT` statements using multiple-row syntax that includes several `VALUES` lists. This results in a smaller dump file and speeds up inserts when the file is reloaded.

  The option value indicates the number of rows to include in each `INSERT` statement. The default is 250. A value of 1 produces one `INSERT` statement per table row.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>3

  Request from the server the public key required for RSA key pair-based password exchange. This option applies to clients that authenticate with the `caching_sha2_password` authentication plugin. For that plugin, the server does not send the public key unless requested. This option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the `caching_sha2_password` plugin, see Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.

* `--hex-blob`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>4

  Dump binary columns using hexadecimal notation (for example, `'abc'` becomes `0x616263`). The affected data types are `BINARY`, `VARBINARY`, `BLOB` types, `BIT`, all spatial data types, and other non-binary data types when used with the [`binary` character set](charset-binary-set.html "12.10.8 The Binary Character Set").

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>5

  Dump data from the MySQL server on the given host.

* `--include-databases=db_list`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>6

  Dump the databases in *`db_list`*, which is a list of one or more comma-separated database names. The dump includes all objects in the named databases. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--include-events=event_list`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>7

  Dump the events in *`event_list`*, which is a list of one or more comma-separated event names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--include-routines=routine_list`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>8

  Dump the routines in *`routine_list`*, which is a list of one or more comma-separated routine (stored procedure or function) names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--include-tables=table_list`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>9

  Dump the tables in *`table_list`*, which is a list of one or more comma-separated table names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--include-triggers=trigger_list`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>0

  Dump the triggers in *`trigger_list`*, which is a list of one or more comma-separated trigger names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--include-users=user_list`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>1

  Dump the user accounts in *`user_list`*, which is a list of one or more comma-separated user names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--insert-ignore`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>2

  Write [`INSERT IGNORE`](insert.html "15.2.7 INSERT Statement") statements rather than `INSERT` statements.

* `--log-error-file=file_name`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>3

  Log warnings and errors by appending them to the named file. If this option is not given, **mysqlpump** writes warnings and errors to the standard error output.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>4

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql_config_editor** utility. See Section 6.6.7, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--max-allowed-packet=N`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>5

  The maximum size of the buffer for client/server communication. The default is 24MB, the maximum is 1GB.

* `--net-buffer-length=N`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>6

  The initial size of the buffer for client/server communication. When creating multiple-row `INSERT` statements (as with the `--extended-insert` option), **mysqlpump** creates rows up to *`N`* bytes long. If you use this option to increase the value, ensure that the MySQL server `net_buffer_length` system variable has a value at least this large.

* `--no-create-db`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>7

  Suppress any `CREATE DATABASE` statements that might otherwise be included in the output.

* `--no-create-info`, `-t`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>8

  Do not write `CREATE TABLE` statements that create each dumped table.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>9

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql_config_editor** utility. See Section 6.6.7, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--parallel-schemas=[N:]db_list`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>0

  Create a queue for processing the databases in *`db_list`*, which is a list of one or more comma-separated database names. If *`N`* is given, the queue uses *`N`* threads. If *`N`* is not given, the `--default-parallelism` option determines the number of queue threads.

  Multiple instances of this option create multiple queues. **mysqlpump** also creates a default queue to use for databases not named in any `--parallel-schemas` option, and for dumping user definitions if command options select them. For more information, see mysqlpump Parallel Processing.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>1

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqlpump** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqlpump** should not prompt for one, use the `--skip-password` option.

* `--password1[=pass_val]`

  The password for multifactor authentication factor 1 of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqlpump** prompts for one. If given, there must be *no space* between `--password1=` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqlpump** should not prompt for one, use the `--skip-password1` option.

  `--password1` and `--password` are synonymous, as are `--skip-password1` and `--skip-password`.

* `--password2[=pass_val]`

  The password for multifactor authentication factor 2 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.

* `--password3[=pass_val]`

  The password for multifactor authentication factor 3 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>2

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysqlpump** does not find it. See Section 8.2.17, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>3

  For TCP/IP connections, the port number to use.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>4

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>5

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 6.2.7, “Connection Transport Protocols”.

* `--replace`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>6

  Write `REPLACE` statements rather than `INSERT` statements.

* `--result-file=file_name`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>7

  Direct output to the named file. The result file is created and its previous contents overwritten, even if an error occurs while generating the dump.

  This option should be used on Windows to prevent newline `\n` characters from being converted to `\r\n` carriage return/newline sequences.

* `--routines`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>8

  Include stored routines (procedures and functions) for the dumped databases in the output. This option requires the global `SELECT` privilege.

  The output generated by using `--routines` contains `CREATE PROCEDURE` and `CREATE FUNCTION` statements to create the routines.

  This option is enabled by default; use `--skip-routines` to disable it.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>9

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or `caching_sha2_password` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and `caching_sha2_password` plugins, see Section 8.4.1.3, “SHA-256 Pluggable Authentication”, and Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.

* `--set-charset`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>0

  Write [`SET NAMES default_character_set`](set-names.html "15.7.6.3 SET NAMES Statement") to the output.

  This option is enabled by default. To disable it and suppress the `SET NAMES` statement, use `--skip-set-charset`.

* `--set-gtid-purged=value`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>1

  This option enables control over global transaction ID (GTID) information written to the dump file, by indicating whether to add a [`SET @@GLOBAL.gtid_purged`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") statement to the output. This option may also cause a statement to be written to the output that disables binary logging while the dump file is being reloaded.

  The following table shows the permitted option values. The default value is `AUTO`.

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>2

  The `--set-gtid-purged` option has the following effect on binary logging when the dump file is reloaded:

  + `--set-gtid-purged=OFF`: `SET @@SESSION.SQL_LOG_BIN=0;` is not added to the output.

  + `--set-gtid-purged=ON`: `SET @@SESSION.SQL_LOG_BIN=0;` is added to the output.

  + `--set-gtid-purged=AUTO`: `SET @@SESSION.SQL_LOG_BIN=0;` is added to the output if GTIDs are enabled on the server you are backing up (that is, if `AUTO` evaluates to `ON`).

* `--single-transaction`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>3

  This option sets the transaction isolation mode to `REPEATABLE READ` and sends a [`START TRANSACTION`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") SQL statement to the server before dumping data. It is useful only with transactional tables such as `InnoDB`, because then it dumps the consistent state of the database at the time when [`START TRANSACTION`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") was issued without blocking any applications.

  When using this option, you should keep in mind that only `InnoDB` tables are dumped in a consistent state. For example, any `MyISAM` or `MEMORY` tables dumped while using this option may still change state.

  While a `--single-transaction` dump is in process, to ensure a valid dump file (correct table contents and binary log coordinates), no other connection should use the following statements: `ALTER TABLE`, `CREATE TABLE`, `DROP TABLE`, `RENAME TABLE`, `TRUNCATE TABLE`. A consistent read is not isolated from those statements, so use of them on a table to be dumped can cause the `SELECT` that is performed by **mysqlpump** to retrieve the table contents to obtain incorrect contents or fail.

  `--add-locks` and `--single-transaction` are mutually exclusive.

* `--skip-definer`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>4

  Omit `DEFINER` and `SQL SECURITY` clauses from the `CREATE` statements for views and stored programs. The dump file, when reloaded, creates objects that use the default `DEFINER` and `SQL SECURITY` values. See Section 27.6, “Stored Object Access Control”.

* `--skip-dump-rows`, `-d`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>5

  Do not dump table rows.

* `--skip-generated-invisible-primary-key`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>6

  This option is available beginning with MySQL 8.0.30, and causes generated invisible primary keys (GIPKs) to be excluded from the dump. See Section 15.1.20.11, “Generated Invisible Primary Keys”, for more information about GIPKs and GIPK mode.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>7

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>8

  Controls whether to enable FIPS mode on the client side. The `--ssl-fips-mode` option differs from other `--ssl-xxx` options in that it is not used to establish encrypted connections, but rather to affect which cryptographic operations to permit. See Section 8.8, “FIPS Support”.

  These `--ssl-fips-mode` values are permitted:

  + `OFF`: Disable FIPS mode.
  + `ON`: Enable FIPS mode.
  + `STRICT`: Enable “strict” FIPS mode.

  Note

  If the OpenSSL FIPS Object Module is not available, the only permitted value for `--ssl-fips-mode` is `OFF`. In this case, setting `--ssl-fips-mode` to `ON` or `STRICT` causes the client to produce a warning at startup and to operate in non-FIPS mode.

  As of MySQL 8.0.34, this option is deprecated. Expect it to be removed in a future version of MySQL.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>9

  The permissible ciphersuites for encrypted connections that use TLSv1.3. The value is a list of one or more colon-separated ciphersuite names. The ciphersuites that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 8.0.16.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

* `--triggers`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

  Include triggers for each dumped table in the output.

  This option is enabled by default; use `--skip-triggers` to disable it.

* `--tz-utc`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

  This option enables `TIMESTAMP` columns to be dumped and reloaded between servers in different time zones. **mysqlpump** sets its connection time zone to UTC and adds `SET TIME_ZONE='+00:00'` to the dump file. Without this option, `TIMESTAMP` columns are dumped and reloaded in the time zones local to the source and destination servers, which can cause the values to change if the servers are in different time zones. `--tz-utc` also protects against changes due to daylight saving time.

  This option is enabled by default; use `--skip-tz-utc` to disable it.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

  The user name of the MySQL account to use for connecting to the server.

  If you are using the `Rewriter` plugin with MySQL 8.0.31 or later, you should grant this user the `SKIP_QUERY_REWRITE` privilege.

* `--users`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

  Dump user accounts as logical definitions in the form of `CREATE USER` and `GRANT` statements.

  User definitions are stored in the grant tables in the `mysql` system database. By default, **mysqlpump** does not include the grant tables in `mysql` database dumps. To dump the contents of the grant tables as logical definitions, use the `--users` option and suppress all database dumping:

  ```
  mysqlpump --exclude-databases=% --users
  ```

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

  Display version information and exit.

* `--watch-progress`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

  Periodically display a progress indicator that provides information about the completed and total number of tables, rows, and other objects.

  This option is enabled by default; use `--skip-watch-progress` to disable it.

* `--zstd-compression-level=level`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

  The compression level to use for connections to the server that use the `zstd` compression algorithm. The permitted levels are from 1 to 22, with larger values indicating increasing levels of compression. The default `zstd` compression level is 3. The compression level setting has no effect on connections that do not use `zstd` compression.

  For more information, see Section 6.2.8, “Connection Compression Control”.

  This option was added in MySQL 8.0.18.

#### mysqlpump Object Selection

**mysqlpump** has a set of inclusion and exclusion options that enable filtering of several object types and provide flexible control over which objects to dump:

* `--include-databases` and `--exclude-databases` apply to databases and all objects within them.

* `--include-tables` and `--exclude-tables` apply to tables. These options also affect triggers associated with tables unless the trigger-specific options are given.

* `--include-triggers` and `--exclude-triggers` apply to triggers.

* `--include-routines` and `--exclude-routines` apply to stored procedures and functions. If a routine option matches a stored procedure name, it also matches a stored function of the same name.

* `--include-events` and `--exclude-events` apply to Event Scheduler events.

* `--include-users` and `--exclude-users` apply to user accounts.

Any inclusion or exclusion option may be given multiple times. The effect is additive. Order of these options does not matter.

The value of each inclusion and exclusion option is a list of comma-separated names of the appropriate object type. For example:

```
--exclude-databases=test,world
--include-tables=customer,invoice
```

Wildcard characters are permitted in the object names:

* `%` matches any sequence of zero or more characters.

* `_` matches any single character.

For example, `--include-tables=t%,__tmp` matches all table names that begin with `t` and all five-character table names that end with `tmp`.

For users, a name specified without a host part is interpreted with an implied host of `%`. For example, `u1` and `u1@%` are equivalent. This is the same equivalence that applies in MySQL generally (see Section 8.2.4, “Specifying Account Names”).

Inclusion and exclusion options interact as follows:

* By default, with no inclusion or exclusion options, **mysqlpump** dumps all databases (with certain exceptions noted in mysqlpump Restrictions).

* If inclusion options are given in the absence of exclusion options, only the objects named as included are dumped.

* If exclusion options are given in the absence of inclusion options, all objects are dumped except those named as excluded.

* If inclusion and exclusion options are given, all objects named as excluded and not named as included are not dumped. All other objects are dumped.

If multiple databases are being dumped, it is possible to name tables, triggers, and routines in a specific database by qualifying the object names with the database name. The following command dumps databases `db1` and `db2`, but excludes tables `db1.t1` and `db2.t2`:

```
mysqlpump --include-databases=db1,db2 --exclude-tables=db1.t1,db2.t2
```

The following options provide alternative ways to specify which databases to dump:

* The `--all-databases` option dumps all databases (with certain exceptions noted in mysqlpump Restrictions). It is equivalent to specifying no object options at all (the default **mysqlpump** action is to dump everything).

  `--include-databases=%` is similar to `--all-databases`, but selects all databases for dumping, even those that are exceptions for `--all-databases`.

* The `--databases` option causes **mysqlpump** to treat all name arguments as names of databases to dump. It is equivalent to an `--include-databases` option that names the same databases.

#### mysqlpump Parallel Processing

**mysqlpump** can use parallelism to achieve concurrent processing. You can select concurrency between databases (to dump multiple databases simultaneously) and within databases (to dump multiple objects from a given database simultaneously).

By default, **mysqlpump** sets up one queue with two threads. You can create additional queues and control the number of threads assigned to each one, including the default queue:

* `--default-parallelism=N` specifies the default number of threads used for each queue. In the absence of this option, *`N`* is 2.

  The default queue always uses the default number of threads. Additional queues use the default number of threads unless you specify otherwise.

* `--parallel-schemas=[N:]db_list` sets up a processing queue for dumping the databases named in *`db_list`* and optionally specifies how many threads the queue uses. *`db_list`* is a list of comma-separated database names. If the option argument begins with `N:`, the queue uses *`N`* threads. Otherwise, the `--default-parallelism` option determines the number of queue threads.

  Multiple instances of the `--parallel-schemas` option create multiple queues.

  Names in the database list are permitted to contain the same `%` and `_` wildcard characters supported for filtering options (see mysqlpump Object Selection).

**mysqlpump** uses the default queue for processing any databases not named explicitly with a `--parallel-schemas` option, and for dumping user definitions if command options select them.

In general, with multiple queues, **mysqlpump** uses parallelism between the sets of databases processed by the queues, to dump multiple databases simultaneously. For a queue that uses multiple threads, **mysqlpump** uses parallelism within databases, to dump multiple objects from a given database simultaneously. Exceptions can occur; for example, **mysqlpump** may block queues while it obtains from the server lists of objects in databases.

With parallelism enabled, it is possible for output from different databases to be interleaved. For example, `INSERT` statements from multiple tables dumped in parallel can be interleaved; the statements are not written in any particular order. This does not affect reloading because output statements qualify object names with database names or are preceded by `USE` statements as required.

The granularity for parallelism is a single database object. For example, a single table cannot be dumped in parallel using multiple threads.

Examples:

```
mysqlpump --parallel-schemas=db1,db2 --parallel-schemas=db3
```

**mysqlpump** sets up a queue to process `db1` and `db2`, another queue to process `db3`, and a default queue to process all other databases. All queues use two threads.

```
mysqlpump --parallel-schemas=db1,db2 --parallel-schemas=db3
          --default-parallelism=4
```

This is the same as the previous example except that all queues use four threads.

```
mysqlpump --parallel-schemas=5:db1,db2 --parallel-schemas=3:db3
```

The queue for `db1` and `db2` uses five threads, the queue for `db3` uses three threads, and the default queue uses the default of two threads.

As a special case, with `--default-parallelism=0` and no `--parallel-schemas` options, **mysqlpump** runs as a single-threaded process and creates no queues.

#### mysqlpump Restrictions

**mysqlpump** does not dump the `performance_schema`, `ndbinfo`, or `sys` schema by default. To dump any of these, name them explicitly on the command line. You can also name them with the `--databases` or `--include-databases` option.

**mysqlpump** does not dump the `INFORMATION_SCHEMA` schema.

**mysqlpump** does not dump `InnoDB` [`CREATE TABLESPACE`](create-tablespace.html "15.1.21 CREATE TABLESPACE Statement") statements.

**mysqlpump** dumps user accounts in logical form using `CREATE USER` and `GRANT` statements (for example, when you use the `--include-users` or `--users` option). For this reason, dumps of the `mysql` system database do not by default include the grant tables that contain user definitions: `user`, `db`, `tables_priv`, `columns_priv`, `procs_priv`, or `proxies_priv`. To dump any of the grant tables, name the `mysql` database followed by the table names:

```
mysqlpump mysql user db ...
```


### 6.5.7 mysqlshow — Display Database, Table, and Column Information

The **mysqlshow** client can be used to quickly see which databases exist, their tables, or a table's columns or indexes.

**mysqlshow** provides a command-line interface to several SQL `SHOW` statements. See Section 15.7.7, “SHOW Statements”. The same information can be obtained by using those statements directly. For example, you can issue them from the **mysql** client program.

Invoke **mysqlshow** like this:

```
mysqlshow [options] [db_name [tbl_name [col_name]]]
```

* If no database is given, a list of database names is shown.
* If no table is given, all matching tables in the database are shown.

* If no column is given, all matching columns and column types in the table are shown.

The output displays only the names of those databases, tables, or columns for which you have some privileges.

If the last argument contains shell or SQL wildcard characters (`*`, `?`, `%`, or `_`), only those names that are matched by the wildcard are shown. If a database name contains any underscores, those should be escaped with a backslash (some Unix shells require two) to get a list of the proper tables or columns. `*` and `?` characters are converted into SQL `%` and `_` wildcard characters. This might cause some confusion when you try to display the columns for a table with a `_` in the name, because in this case, **mysqlshow** shows you only the table names that match the pattern. This is easily fixed by adding an extra `%` last on the command line as a separate argument.

**mysqlshow** supports the following options, which can be specified on the command line or in the `[mysqlshow]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see Section 6.2.2.2, “Using Option Files”.

**Table 6.18 mysqlshow Options**

<table frame="box" rules="all" summary="Command-line options available for mysqlshow."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--bind-address</th> <td>Use specified network interface to connect to MySQL Server</td> <td></td> <td></td> </tr><tr><th scope="row">--character-sets-dir</th> <td>Directory where character sets can be found</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compress all information sent between client and server</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Permitted compression algorithms for connections to server</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--count</th> <td>Show the number of rows per table</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Print debugging information when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Print debugging information, memory, and CPU statistics when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Authentication plugin to use</td> <td></td> <td></td> </tr><tr><th scope="row">--default-character-set</th> <td>Specify default character set</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Read named option file in addition to usual option files</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Read only named option file</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Option group suffix value</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Enable cleartext authentication plugin</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Request RSA public key from server</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Display help message and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Host on which MySQL server is located</td> <td></td> <td></td> </tr><tr><th scope="row">--keys</th> <td>Show table indexes</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Read login path options from .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Read no option files</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Password to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>First multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Second multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Third multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Connect to server using named pipe (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Directory where plugins are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Transport protocol to use</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Path name to file containing RSA public key</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Shared-memory name for shared-memory connections (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--show-table-type</th> <td>Show a column indicating the table type</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Unix socket file or Windows named pipe to use</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>File that contains list of trusted SSL Certificate Authorities</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>File that contains X.509 certificate</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Permissible ciphers for connection encryption</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>File that contains certificate revocation lists</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Directory that contains certificate revocation-list files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Whether to enable FIPS mode on client side</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>File that contains X.509 key</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Desired security state of connection to server</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>File that contains SSL session data</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Whether to establish connections if session reuse fails</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--status</th> <td>Display extra information about each table</td> <td></td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Permissible TLS protocols for encrypted connections</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>MySQL user name to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Display version information and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Compression level for connections to server that use zstd compression</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On a computer having multiple network interfaces, use this option to select which interface to use for connecting to the MySQL server.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  The directory where character sets are installed. See Section 12.15, “Character Set Configuration”.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compress all information sent between the client and the server if possible. See Section 6.2.8, “Connection Compression Control”.

  As of MySQL 8.0.18, this option is deprecated. Expect it to be removed in a future version of MySQL. See Configuring Legacy Connection Compression.

* `--compression-algorithms=value`

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.18</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>uncompressed</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>zlib</code></p><p class="valid-value"><code>zstd</code></p><p class="valid-value"><code>uncompressed</code></p></td> </tr></tbody></table>

  The permitted compression algorithms for connections to the server. The available algorithms are the same as for the `protocol_compression_algorithms` system variable. The default value is `uncompressed`.

  For more information, see Section 6.2.8, “Connection Compression Control”.

  This option was added in MySQL 8.0.18.

* `--count`

  <table frame="box" rules="all" summary="Properties for count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--count</code></td> </tr></tbody></table>

  Show the number of rows per table. This can be slow for non-`MyISAM` tables.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug[=debug_options]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:o</code></td> </tr></tbody></table>

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:o`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for debug-check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-check</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-info`

  <table frame="box" rules="all" summary="Properties for debug-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Print debugging information and memory and CPU usage statistics when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

  Use *`charset_name`* as the default character set. See Section 12.15, “Character Set Configuration”.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

  A hint about which client-side authentication plugin to use. See Section 8.2.17, “Pluggable Authentication”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysqlshow** normally reads the `[client]` and `[mysqlshow]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysqlshow** also reads the `[client_other]` and `[mysqlshow_other]` groups.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

  Enable the `mysql_clear_password` cleartext authentication plugin. (See Section 8.4.1.4, “Client-Side Cleartext Pluggable Authentication”.)

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

  Request from the server the RSA public key that it uses for key pair-based password exchange. This option applies to clients that connect to the server using an account that authenticates with the `caching_sha2_password` authentication plugin. For connections by such accounts, the server does not send the public key to the client unless requested. The option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not needed, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the `caching_sha2_password` plugin, see Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

  Connect to the MySQL server on the given host.

* `--keys`, `-k`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

  Show table indexes.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql_config_editor** utility. See Section 6.6.7, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql_config_editor** utility. See Section 6.6.7, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqlshow** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqlshow** should not prompt for one, use the `--skip-password` option.

* `--password1[=pass_val]`

  The password for multifactor authentication factor 1 of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqlshow** prompts for one. If given, there must be *no space* between `--password1=` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqlshow** should not prompt for one, use the `--skip-password1` option.

  `--password1` and `--password` are synonymous, as are `--skip-password1` and `--skip-password`.

* `--password2[=pass_val]`

  The password for multifactor authentication factor 2 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.

* `--password3[=pass_val]`

  The password for multifactor authentication factor 3 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

  On Windows, connect to the server using a named pipe. This option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysqlshow** does not find it. See Section 8.2.17, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

  For TCP/IP connections, the port number to use.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 6.2.7, “Connection Transport Protocols”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or `caching_sha2_password` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and `caching_sha2_password` plugins, see Section 8.4.1.3, “SHA-256 Pluggable Authentication”, and Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>8

  On Windows, the shared-memory name to use for connections made using shared memory to a local server. The default value is `MYSQL`. The shared-memory name is case-sensitive.

  This option applies only if the server was started with the `shared_memory` system variable enabled to support shared-memory connections.

* `--show-table-type`, `-t`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>9

  Show a column indicating the table type, as in [`SHOW FULL TABLES`](show-tables.html "15.7.7.39 SHOW TABLES Statement"). The type is `BASE TABLE` or `VIEW`.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

  Controls whether to enable FIPS mode on the client side. The `--ssl-fips-mode` option differs from other `--ssl-xxx` options in that it is not used to establish encrypted connections, but rather to affect which cryptographic operations to permit. See Section 8.8, “FIPS Support”.

  These `--ssl-fips-mode` values are permitted:

  + `OFF`: Disable FIPS mode.
  + `ON`: Enable FIPS mode.
  + `STRICT`: Enable “strict” FIPS mode.

  Note

  If the OpenSSL FIPS Object Module is not available, the only permitted value for `--ssl-fips-mode` is `OFF`. In this case, setting `--ssl-fips-mode` to `ON` or `STRICT` causes the client to produce a warning at startup and to operate in non-FIPS mode.

  As of MySQL 8.0.34, this option is deprecated. Expect it to be removed in a future version of MySQL.

* `--status`, `-i`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

  Display extra information about each table.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

  The permissible ciphersuites for encrypted connections that use TLSv1.3. The value is a list of one or more colon-separated ciphersuite names. The ciphersuites that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 8.0.16.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>5

  The user name of the MySQL account to use for connecting to the server.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>6

  Verbose mode. Print more information about what the program does. This option can be used multiple times to increase the amount of information.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>7

  Display version information and exit.

* `--zstd-compression-level=level`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>8

  The compression level to use for connections to the server that use the `zstd` compression algorithm. The permitted levels are from 1 to 22, with larger values indicating increasing levels of compression. The default `zstd` compression level is 3. The compression level setting has no effect on connections that do not use `zstd` compression.

  For more information, see Section 6.2.8, “Connection Compression Control”.

  This option was added in MySQL 8.0.18.


### 6.5.8 mysqlslap — A Load Emulation Client

**mysqlslap** is a diagnostic program designed to emulate client load for a MySQL server and to report the timing of each stage. It works as if multiple clients are accessing the server.

Invoke **mysqlslap** like this:

```
mysqlslap [options]
```

Some options such as `--create` or `--query` enable you to specify a string containing an SQL statement or a file containing statements. If you specify a file, by default it must contain one statement per line. (That is, the implicit statement delimiter is the newline character.) Use the `--delimiter` option to specify a different delimiter, which enables you to specify statements that span multiple lines or place multiple statements on a single line. You cannot include comments in a file; **mysqlslap** does not understand them.

**mysqlslap** runs in three stages:

1. Create schema, table, and optionally any stored programs or data to use for the test. This stage uses a single client connection.

2. Run the load test. This stage can use many client connections.

3. Clean up (disconnect, drop table if specified). This stage uses a single client connection.

Examples:

Supply your own create and query SQL statements, with 50 clients querying and 200 selects for each (enter the command on a single line):

```
mysqlslap --delimiter=";"
  --create="CREATE TABLE a (b int);INSERT INTO a VALUES (23)"
  --query="SELECT * FROM a" --concurrency=50 --iterations=200
```

Let **mysqlslap** build the query SQL statement with a table of two `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") columns and three `VARCHAR` columns. Use five clients querying 20 times each. Do not create the table or insert the data (that is, use the previous test's schema and data):

```
mysqlslap --concurrency=5 --iterations=20
  --number-int-cols=2 --number-char-cols=3
  --auto-generate-sql
```

Tell the program to load the create, insert, and query SQL statements from the specified files, where the `create.sql` file has multiple table creation statements delimited by `';'` and multiple insert statements delimited by `';'`. The `--query` file should contain multiple queries delimited by `';'`. Run all the load statements, then run all the queries in the query file with five clients (five times each):

```
mysqlslap --concurrency=5
  --iterations=5 --query=query.sql --create=create.sql
  --delimiter=";"
```

**mysqlslap** supports the following options, which can be specified on the command line or in the `[mysqlslap]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see Section 6.2.2.2, “Using Option Files”.

**Table 6.19 mysqlslap Options**

<table frame="box" rules="all" summary="Command-line options available for mysqlslap."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row">--auto-generate-sql</th> <td>Generate SQL statements automatically when they are not supplied in files or using command options</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-generate-sql-add-autoincrement</th> <td>Add AUTO_INCREMENT column to automatically generated tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-generate-sql-execute-number</th> <td>Specify how many queries to generate automatically</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-generate-sql-guid-primary</th> <td>Add a GUID-based primary key to automatically generated tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-generate-sql-load-type</th> <td>Specify the test load type</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-generate-sql-secondary-indexes</th> <td>Specify how many secondary indexes to add to automatically generated tables</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-generate-sql-unique-query-number</th> <td>How many different queries to generate for automatic tests</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-generate-sql-unique-write-number</th> <td>How many different queries to generate for --auto-generate-sql-write-number</td> <td></td> <td></td> </tr><tr><th scope="row">--auto-generate-sql-write-number</th> <td>How many row inserts to perform on each thread</td> <td></td> <td></td> </tr><tr><th scope="row">--commit</th> <td>How many statements to execute before committing</td> <td></td> <td></td> </tr><tr><th scope="row">--compress</th> <td>Compress all information sent between client and server</td> <td></td> <td>8.0.18</td> </tr><tr><th scope="row">--compression-algorithms</th> <td>Permitted compression algorithms for connections to server</td> <td>8.0.18</td> <td></td> </tr><tr><th scope="row">--concurrency</th> <td>Number of clients to simulate when issuing the SELECT statement</td> <td></td> <td></td> </tr><tr><th scope="row">--create</th> <td>File or string containing the statement to use for creating the table</td> <td></td> <td></td> </tr><tr><th scope="row">--create-schema</th> <td>Schema in which to run the tests</td> <td></td> <td></td> </tr><tr><th scope="row">--csv</th> <td>Generate output in comma-separated values format</td> <td></td> <td></td> </tr><tr><th scope="row">--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-check</th> <td>Print debugging information when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--debug-info</th> <td>Print debugging information, memory, and CPU statistics when program exits</td> <td></td> <td></td> </tr><tr><th scope="row">--default-auth</th> <td>Authentication plugin to use</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-extra-file</th> <td>Read named option file in addition to usual option files</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-file</th> <td>Read only named option file</td> <td></td> <td></td> </tr><tr><th scope="row">--defaults-group-suffix</th> <td>Option group suffix value</td> <td></td> <td></td> </tr><tr><th scope="row">--delimiter</th> <td>Delimiter to use in SQL statements</td> <td></td> <td></td> </tr><tr><th scope="row">--detach</th> <td>Detach (close and reopen) each connection after each N statements</td> <td></td> <td></td> </tr><tr><th scope="row">--enable-cleartext-plugin</th> <td>Enable cleartext authentication plugin</td> <td></td> <td></td> </tr><tr><th scope="row">--engine</th> <td>Storage engine to use for creating the table</td> <td></td> <td></td> </tr><tr><th scope="row">--get-server-public-key</th> <td>Request RSA public key from server</td> <td></td> <td></td> </tr><tr><th scope="row">--help</th> <td>Display help message and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--host</th> <td>Host on which MySQL server is located</td> <td></td> <td></td> </tr><tr><th scope="row">--iterations</th> <td>Number of times to run the tests</td> <td></td> <td></td> </tr><tr><th scope="row">--login-path</th> <td>Read login path options from .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row">--no-defaults</th> <td>Read no option files</td> <td></td> <td></td> </tr><tr><th scope="row">--no-drop</th> <td>Do not drop any schema created during the test run</td> <td></td> <td></td> </tr><tr><th scope="row">--number-char-cols</th> <td>Number of VARCHAR columns to use if --auto-generate-sql is specified</td> <td></td> <td></td> </tr><tr><th scope="row">--number-int-cols</th> <td>Number of INT columns to use if --auto-generate-sql is specified</td> <td></td> <td></td> </tr><tr><th scope="row">--number-of-queries</th> <td>Limit each client to approximately this number of queries</td> <td></td> <td></td> </tr><tr><th scope="row">--only-print</th> <td>Do not connect to databases. mysqlslap only prints what it would have done</td> <td></td> <td></td> </tr><tr><th scope="row">--password</th> <td>Password to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--password1</th> <td>First multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password2</th> <td>Second multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--password3</th> <td>Third multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th scope="row">--pipe</th> <td>Connect to server using named pipe (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--plugin-dir</th> <td>Directory where plugins are installed</td> <td></td> <td></td> </tr><tr><th scope="row">--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row">--post-query</th> <td>File or string containing the statement to execute after the tests have completed</td> <td></td> <td></td> </tr><tr><th scope="row">--post-system</th> <td>String to execute using system() after the tests have completed</td> <td></td> <td></td> </tr><tr><th scope="row">--pre-query</th> <td>File or string containing the statement to execute before running the tests</td> <td></td> <td></td> </tr><tr><th scope="row">--pre-system</th> <td>String to execute using system() before running the tests</td> <td></td> <td></td> </tr><tr><th scope="row">--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row">--protocol</th> <td>Transport protocol to use</td> <td></td> <td></td> </tr><tr><th scope="row">--query</th> <td>File or string containing the SELECT statement to use for retrieving data</td> <td></td> <td></td> </tr><tr><th scope="row">--server-public-key-path</th> <td>Path name to file containing RSA public key</td> <td></td> <td></td> </tr><tr><th scope="row">--shared-memory-base-name</th> <td>Shared-memory name for shared-memory connections (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row">--silent</th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row">--socket</th> <td>Unix socket file or Windows named pipe to use</td> <td></td> <td></td> </tr><tr><th scope="row">--sql-mode</th> <td>Set SQL mode for client session</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-ca</th> <td>File that contains list of trusted SSL Certificate Authorities</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-capath</th> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cert</th> <td>File that contains X.509 certificate</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-cipher</th> <td>Permissible ciphers for connection encryption</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crl</th> <td>File that contains certificate revocation lists</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-crlpath</th> <td>Directory that contains certificate revocation-list files</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-fips-mode</th> <td>Whether to enable FIPS mode on client side</td> <td></td> <td>8.0.34</td> </tr><tr><th scope="row">--ssl-key</th> <td>File that contains X.509 key</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-mode</th> <td>Desired security state of connection to server</td> <td></td> <td></td> </tr><tr><th scope="row">--ssl-session-data</th> <td>File that contains SSL session data</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--ssl-session-data-continue-on-failed-reuse</th> <td>Whether to establish connections if session reuse fails</td> <td>8.0.29</td> <td></td> </tr><tr><th scope="row">--tls-ciphersuites</th> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> <td>8.0.16</td> <td></td> </tr><tr><th scope="row">--tls-version</th> <td>Permissible TLS protocols for encrypted connections</td> <td></td> <td></td> </tr><tr><th scope="row">--user</th> <td>MySQL user name to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row">--verbose</th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row">--version</th> <td>Display version information and exit</td> <td></td> <td></td> </tr><tr><th scope="row">--zstd-compression-level</th> <td>Compression level for connections to server that use zstd compression</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--auto-generate-sql`, `-a`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Generate SQL statements automatically when they are not supplied in files or using command options.

* `--auto-generate-sql-add-autoincrement`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Add an `AUTO_INCREMENT` column to automatically generated tables.

* `--auto-generate-sql-execute-number=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  Specify how many queries to generate automatically.

* `--auto-generate-sql-guid-primary`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Add a GUID-based primary key to automatically generated tables.

* `--auto-generate-sql-load-type=type`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-load-type"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-load-type=type</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>mixed</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>read</code></p><p class="valid-value"><code>write</code></p><p class="valid-value"><code>key</code></p><p class="valid-value"><code>update</code></p><p class="valid-value"><code>mixed</code></p></td> </tr></tbody></table>

  Specify the test load type. The permissible values are `read` (scan tables), `write` (insert into tables), `key` (read primary keys), `update` (update primary keys), or `mixed` (half inserts, half scanning selects). The default is `mixed`.

* `--auto-generate-sql-secondary-indexes=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-secondary-indexes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-secondary-indexes=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr></tbody></table>

  Specify how many secondary indexes to add to automatically generated tables. By default, none are added.

* `--auto-generate-sql-unique-query-number=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-unique-query-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-unique-query-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>10</code></td> </tr></tbody></table>

  How many different queries to generate for automatic tests. For example, if you run a `key` test that performs 1000 selects, you can use this option with a value of 1000 to run 1000 unique queries, or with a value of 50 to perform 50 different selects. The default is 10.

* `--auto-generate-sql-unique-write-number=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-unique-write-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-unique-write-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>10</code></td> </tr></tbody></table>

  How many different queries to generate for `--auto-generate-sql-write-number`. The default is 10.

* `--auto-generate-sql-write-number=N`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

  How many row inserts to perform. The default is 100.

* `--commit=N`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

  How many statements to execute before committing. The default is 0 (no commits are done).

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

  Compress all information sent between the client and the server if possible. See Section 6.2.8, “Connection Compression Control”.

  As of MySQL 8.0.18, this option is deprecated. Expect it to be removed in a future version of MySQL. See Configuring Legacy Connection Compression.

* `--compression-algorithms=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

  The permitted compression algorithms for connections to the server. The available algorithms are the same as for the `protocol_compression_algorithms` system variable. The default value is `uncompressed`.

  For more information, see Section 6.2.8, “Connection Compression Control”.

  This option was added in MySQL 8.0.18.

* `--concurrency=N`, `-c N`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

  The number of parallel clients to simulate.

* `--create=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

  The file or string containing the statement to use for creating the table.

* `--create-schema=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

  The schema in which to run the tests.

  Note

  If the `--auto-generate-sql` option is also given, **mysqlslap** drops the schema at the end of the test run. To avoid this, use the `--no-drop` option as well.

* `--csv[=file_name]`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

  Generate output in comma-separated values format. The output goes to the named file, or to the standard output if no file is given.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:o,/tmp/mysqlslap.trace`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>0

  Print debugging information and memory and CPU usage statistics when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>1

  A hint about which client-side authentication plugin to use. See Section 8.2.17, “Pluggable Authentication”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>2

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>3

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>4

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysqlslap** normally reads the `[client]` and `[mysqlslap]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysqlslap** also reads the `[client_other]` and `[mysqlslap_other]` groups.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--delimiter=str`, `-F str`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>5

  The delimiter to use in SQL statements supplied in files or using command options.

* `--detach=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>6

  Detach (close and reopen) each connection after each *`N`* statements. The default is 0 (connections are not detached).

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>7

  Enable the `mysql_clear_password` cleartext authentication plugin. (See Section 8.4.1.4, “Client-Side Cleartext Pluggable Authentication”.)

* `--engine=engine_name`, `-e engine_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>8

  The storage engine to use for creating tables.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>9

  Request from the server the RSA public key that it uses for key pair-based password exchange. This option applies to clients that connect to the server using an account that authenticates with the `caching_sha2_password` authentication plugin. For connections by such accounts, the server does not send the public key to the client unless requested. The option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not needed, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the `caching_sha2_password` plugin, see Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>0

  Connect to the MySQL server on the given host.

* `--iterations=N`, `-i N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>1

  The number of times to run the tests.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>2

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql_config_editor** utility. See Section 6.6.7, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--no-drop`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>3

  Prevent **mysqlslap** from dropping any schema it creates during the test run.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>4

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql_config_editor** utility. See Section 6.6.7, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--number-char-cols=N`, `-x N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>5

  The number of `VARCHAR` columns to use if `--auto-generate-sql` is specified.

* `--number-int-cols=N`, `-y N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>6

  The number of `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") columns to use if `--auto-generate-sql` is specified.

* `--number-of-queries=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>7

  Limit each client to approximately this many queries. Query counting takes into account the statement delimiter. For example, if you invoke **mysqlslap** as follows, the `;` delimiter is recognized so that each instance of the query string counts as two queries. As a result, 5 rows (not 10) are inserted.

  ```
  mysqlslap --delimiter=";" --number-of-queries=10
            --query="use test;insert into t values(null)"
  ```

* `--only-print`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>8

  Do not connect to databases. **mysqlslap** only prints what it would have done.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>9

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqlslap** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqlslap** should not prompt for one, use the `--skip-password` option.

* `--password1[=pass_val]`

  The password for multifactor authentication factor 1 of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqlslap** prompts for one. If given, there must be *no space* between `--password1=` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqlslap** should not prompt for one, use the `--skip-password1` option.

  `--password1` and `--password` are synonymous, as are `--skip-password1` and `--skip-password`.

* `--password2[=pass_val]`

  The password for multifactor authentication factor 2 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.

* `--password3[=pass_val]`

  The password for multifactor authentication factor 3 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>0

  On Windows, connect to the server using a named pipe. This option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>1

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysqlslap** does not find it. See Section 8.2.17, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>2

  For TCP/IP connections, the port number to use.

* `--post-query=value`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>3

  The file or string containing the statement to execute after the tests have completed. This execution is not counted for timing purposes.

* `--post-system=str`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>4

  The string to execute using `system()` after the tests have completed. This execution is not counted for timing purposes.

* `--pre-query=value`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>5

  The file or string containing the statement to execute before running the tests. This execution is not counted for timing purposes.

* `--pre-system=str`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>6

  The string to execute using `system()` before running the tests. This execution is not counted for timing purposes.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>7

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>8

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 6.2.7, “Connection Transport Protocols”.

* `--query=value`, `-q value`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>9

  The file or string containing the `SELECT` statement to use for retrieving data.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>0

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or `caching_sha2_password` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and `caching_sha2_password` plugins, see Section 8.4.1.3, “SHA-256 Pluggable Authentication”, and Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>1

  On Windows, the shared-memory name to use for connections made using shared memory to a local server. The default value is `MYSQL`. The shared-memory name is case-sensitive.

  This option applies only if the server was started with the `shared_memory` system variable enabled to support shared-memory connections.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>2

  Silent mode. No output.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>3

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--sql-mode=mode`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>4

  Set the SQL mode for the client session.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>5

  Controls whether to enable FIPS mode on the client side. The `--ssl-fips-mode` option differs from other `--ssl-xxx` options in that it is not used to establish encrypted connections, but rather to affect which cryptographic operations to permit. See Section 8.8, “FIPS Support”.

  These `--ssl-fips-mode` values are permitted:

  + `OFF`: Disable FIPS mode.
  + `ON`: Enable FIPS mode.
  + `STRICT`: Enable “strict” FIPS mode.

  Note

  If the OpenSSL FIPS Object Module is not available, the only permitted value for `--ssl-fips-mode` is `OFF`. In this case, setting `--ssl-fips-mode` to `ON` or `STRICT` causes the client to produce a warning at startup and to operate in non-FIPS mode.

  As of MySQL 8.0.34, this option is deprecated. Expect it to be removed in a future version of MySQL.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>6

  The permissible ciphersuites for encrypted connections that use TLSv1.3. The value is a list of one or more colon-separated ciphersuite names. The ciphersuites that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 8.0.16.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>7

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>8

  The user name of the MySQL account to use for connecting to the server.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>9

  Verbose mode. Print more information about what the program does. This option can be used multiple times to increase the amount of information.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-load-type"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-load-type=type</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>mixed</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>read</code></p><p class="valid-value"><code>write</code></p><p class="valid-value"><code>key</code></p><p class="valid-value"><code>update</code></p><p class="valid-value"><code>mixed</code></p></td> </tr></tbody></table>0

  Display version information and exit.

* `--zstd-compression-level=level`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-load-type"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-load-type=type</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>mixed</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>read</code></p><p class="valid-value"><code>write</code></p><p class="valid-value"><code>key</code></p><p class="valid-value"><code>update</code></p><p class="valid-value"><code>mixed</code></p></td> </tr></tbody></table>1

  The compression level to use for connections to the server that use the `zstd` compression algorithm. The permitted levels are from 1 to 22, with larger values indicating increasing levels of compression. The default `zstd` compression level is 3. The compression level setting has no effect on connections that do not use `zstd` compression.

  For more information, see Section 6.2.8, “Connection Compression Control”.

  This option was added in MySQL 8.0.18.
