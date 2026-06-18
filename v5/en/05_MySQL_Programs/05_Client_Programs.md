## 4.5 Client Programs

This section describes client programs that connect to the MySQL server.

### 4.5.1 mysql — The MySQL Command-Line Client

**mysql** is a simple SQL shell with input line editing capabilities. It supports interactive and noninteractive use. When used interactively, query results are presented in an ASCII-table format. When used noninteractively (for example, as a filter), the result is presented in tab-separated format. The output format can be changed using command options.

If you have problems due to insufficient memory for large result sets, use the `--quick` option. This forces **mysql** to retrieve results from the server a row at a time rather than retrieving the entire result set and buffering it in memory before displaying it. This is done by returning the result set using the `mysql_use_result()` C API function in the client/server library rather than `mysql_store_result()`.

Note

Alternatively, MySQL Shell offers access to the X DevAPI. For details, see MySQL Shell 8.0.

Using **mysql** is very easy. Invoke it from the prompt of your command interpreter as follows:

```sql
mysql db_name
```

Or:

```sql
mysql --user=user_name --password db_name
```

In this case, you'll need to enter your password in response to the prompt that **mysql** displays:

```sql
Enter password: your_password
```

Then type an SQL statement, end it with `;`, `\g`, or `\G` and press Enter.

Typing **Control+C** interrupts the current statement if there is one, or cancels any partial input line otherwise.

You can execute SQL statements in a script file (batch file) like this:

```sql
mysql db_name < script.sql > output.tab
```

On Unix, the **mysql** client logs statements executed interactively to a history file. See Section 4.5.1.3, “mysql Client Logging”.

#### 4.5.1.1 mysql Client Options

**mysql** supports the following options, which can be specified on the command line or in the `[mysql]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see Section 4.2.2.2, “Using Option Files”.

**Table 4.13 mysql Client Options**

<table frame="box" rules="all" summary="Command-line options available for the mysql client.">
  <col style="width: 27%"/>
  <col style="width: 50%"/>
  <col style="width: 11%"/>
  <col style="width: 11%"/>
  <thead>
    <tr>
      <th>Option Name</th>
      <th>Description</th>
      <th>Introduced</th>
      <th>Deprecated</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>--auto-rehash</code></th>
      <td>Enable automatic rehashing</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--auto-vertical-output</code></th>
      <td>Enable automatic vertical result set display</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--batch</code></th>
      <td>Do not use history file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--binary-as-hex</code></th>
      <td>Display binary values in hexadecimal notation</td>
      <td>5.7.19</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--binary-mode</code></th>
      <td>Disable \r\n - to - \n translation and treatment of \0 as end-of-query</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--bind-address</code></th>
      <td>Use specified network interface to connect to MySQL Server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--character-sets-dir</code></th>
      <td>Directory where character sets are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--column-names</code></th>
      <td>Write column names in results</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--column-type-info</code></th>
      <td>Display result set metadata</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--commands</code></th>
      <td>Enable or disable processing of local mysql client commands</td>
      <td>5.7.44-ndb-7.6.35</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--comments</code></th>
      <td>Whether to retain or strip comments in statements sent to the server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--compress</code></th>
      <td>Compress all information sent between client and server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--connect-expired-password</code></th>
      <td>Indicate to server that client can handle expired-password sandbox mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--connect-timeout</code></th>
      <td>Number of seconds before connection timeout</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--database</code></th>
      <td>The database to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug</code></th>
      <td>Write debugging log; supported only if MySQL was built with debugging support</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-check</code></th>
      <td>Print debugging information when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-info</code></th>
      <td>Print debugging information, memory, and CPU statistics when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-auth</code></th>
      <td>Authentication plugin to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-character-set</code></th>
      <td>Specify default character set</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-extra-file</code></th>
      <td>Read named option file in addition to usual option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-file</code></th>
      <td>Read only named option file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-group-suffix</code></th>
      <td>Option group suffix value</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--delimiter</code></th>
      <td>Set the statement delimiter</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--enable-cleartext-plugin</code></th>
      <td>Enable cleartext authentication plugin</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--execute</code></th>
      <td>Execute the statement and quit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--force</code></th>
      <td>Continue even if an SQL error occurs</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--get-server-public-key</code></th>
      <td>Request RSA public key from server</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--help</code></th>
      <td>Display help message and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--histignore</code></th>
      <td>Patterns specifying which statements to ignore for logging</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--host</code></th>
      <td>Host on which MySQL server is located</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--html</code></th>
      <td>Produce HTML output</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ignore-spaces</code></th>
      <td>Ignore spaces after function names</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--init-command</code></th>
      <td>SQL statement to execute after connecting</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--line-numbers</code></th>
      <td>Write line numbers for errors</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--local-infile</code></th>
      <td>Enable or disable for LOCAL capability for LOAD DATA</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--login-path</code></th>
      <td>Read login path options from .mylogin.cnf</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--max-allowed-packet</code></th>
      <td>Maximum packet length to send to or receive from server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--max-join-size</code></th>
      <td>The automatic limit for rows in a join when using --safe-updates</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--named-commands</code></th>
      <td>Enable named mysql commands</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--net-buffer-length</code></th>
      <td>Buffer size for TCP/IP and socket communication</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-auto-rehash</code></th>
      <td>Disable automatic rehashing</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-beep</code></th>
      <td>Do not beep when errors occur</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-defaults</code></th>
      <td>Read no option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--one-database</code></th>
      <td>Ignore statements except those for the default database named on the command line</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--pager</code></th>
      <td>Use the given command for paging query output</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--password</code></th>
      <td>Password to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--pipe</code></th>
      <td>Connect to server using named pipe (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--plugin-dir</code></th>
      <td>Directory where plugins are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--port</code></th>
      <td>TCP/IP port number for connection</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--print-defaults</code></th>
      <td>Print default options</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--prompt</code></th>
      <td>Set the prompt to the specified format</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--protocol</code></th>
      <td>Transport protocol to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--quick</code></th>
      <td>Do not cache each query result</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--raw</code></th>
      <td>Write column values without escape conversion</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--reconnect</code></th>
      <td>If the connection to the server is lost, automatically try to reconnect</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--safe-updates, --i-am-a-dummy</code></th>
      <td>Allow only UPDATE and DELETE statements that specify key values</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--secure-auth</code></th>
      <td>Do not send passwords to server in old (pre-4.1) format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--select-limit</code></th>
      <td>The automatic limit for SELECT statements when using --safe-updates</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--server-public-key-path</code></th>
      <td>Path name to file containing RSA public key</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--shared-memory-base-name</code></th>
      <td>Shared-memory name for shared-memory connections (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--show-warnings</code></th>
      <td>Show warnings after each statement if there are any</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--sigint-ignore</code></th>
      <td>Ignore SIGINT signals (typically the result of typing Control+C)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--silent</code></th>
      <td>Silent mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-auto-rehash</code></th>
      <td>Disable automatic rehashing</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-column-names</code></th>
      <td>Do not write column names in results</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-line-numbers</code></th>
      <td>Skip line numbers for errors</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-named-commands</code></th>
      <td>Disable named mysql commands</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-pager</code></th>
      <td>Disable paging</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-reconnect</code></th>
      <td>Disable reconnecting</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--socket</code></th>
      <td>Unix socket file or Windows named pipe to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl</code></th>
      <td>Enable connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-ca</code></th>
      <td>File that contains list of trusted SSL Certificate Authorities</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-capath</code></th>
      <td>Directory that contains trusted SSL Certificate Authority certificate files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cert</code></th>
      <td>File that contains X.509 certificate</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cipher</code></th>
      <td>Permissible ciphers for connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crl</code></th>
      <td>File that contains certificate revocation lists</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crlpath</code></th>
      <td>Directory that contains certificate revocation-list files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-key</code></th>
      <td>File that contains X.509 key</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-mode</code></th>
      <td>Desired security state of connection to server</td>
      <td>5.7.11</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-verify-server-cert</code></th>
      <td>Verify host name against server certificate Common Name identity</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--syslog</code></th>
      <td>Log interactive statements to syslog</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--table</code></th>
      <td>Display output in tabular format</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tee</code></th>
      <td>Append a copy of output to named file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tls-version</code></th>
      <td>Permissible TLS protocols for encrypted connections</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--unbuffered</code></th>
      <td>Flush the buffer after each query</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--user</code></th>
      <td>MySQL user name to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--verbose</code></th>
      <td>Verbose mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--version</code></th>
      <td>Display version information and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--vertical</code></th>
      <td>Print query output rows vertically (one line per column value)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--wait</code></th>
      <td>If the connection cannot be established, wait and retry instead of aborting</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--xml</code></th>
      <td>Produce XML output</td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

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

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  When this option is given, **mysql** displays binary data using hexadecimal notation (`0xvalue`). This occurs whether the overall output display format is tabular, vertical, HTML, or XML.

  `--binary-as-hex` when enabled affects display of all binary strings, including those returned by functions such as `CHAR()` and `UNHEX()`. The following example demonstrates this using the ASCII code for `A` (65 decimal, 41 hexadecimal):

  + `--binary-as-hex` disabled:

    ```sql
    mysql> SELECT CHAR(0x41), UNHEX('41');
    +------------+-------------+
    | CHAR(0x41) | UNHEX('41') |
    +------------+-------------+
    | A          | A           |
    +------------+-------------+
    ```

  + `--binary-as-hex` enabled:

    ```sql
    mysql> SELECT CHAR(0x41), UNHEX('41');
    +------------------------+--------------------------+
    | CHAR(0x41)             | UNHEX('41')              |
    +------------------------+--------------------------+
    | 0x41                   | 0x41                     |
    +------------------------+--------------------------+
    ```

  To write a binary string expression so that it displays as a character string regardless of whether `--binary-as-hex` is enabled, use these techniques:

  + The `CHAR()` function has a `USING charset` clause:

    ```sql
    mysql> SELECT CHAR(0x41 USING utf8mb4);
    +--------------------------+
    | CHAR(0x41 USING utf8mb4) |
    +--------------------------+
    | A                        |
    +--------------------------+
    ```

  + More generally, use `CONVERT()` to convert an expression to a given character set:

    ```sql
    mysql> SELECT CONVERT(UNHEX('41') USING utf8mb4);
    +------------------------------------+
    | CONVERT(UNHEX('41') USING utf8mb4) |
    +------------------------------------+
    | A                                  |
    +------------------------------------+
    ```

  This option was added in MySQL 5.7.19.

* `--binary-mode`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>

  This option helps when processing **mysqlbinlog** output that may contain `BLOB` values. By default, **mysql** translates `\r\n` in statement strings to `\n` and interprets `\0` as the statement terminator. `--binary-mode` disables both features. It also disables all **mysql** commands except `charset` and `delimiter` in noninteractive mode (for input piped to **mysql** or loaded using the `source` command).

  (*NDB Cluster 7.6.35 and later:*) `--binary-mode`, when enabled, causes the server to disregard any setting for `--commands` .

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On a computer having multiple network interfaces, use this option to select which interface to use for connecting to the MySQL server.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The directory where character sets are installed. See Section 10.15, “Character Set Configuration”.

* `--column-names`

  <table frame="box" rules="all" summary="Properties for column-names"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--column-names</code></td> </tr></tbody></table>

  Write column names in results.

* `--column-type-info`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

  Display result set metadata. This information corresponds to the contents of C API `MYSQL_FIELD` data structures. See C API Basic Data Structures.

* `--commands`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

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

  This option was added in NDB Cluster 7.6.35.

* `--comments`, `-c`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

  Whether to strip or preserve comments in statements sent to the server. The default is `--skip-comments` (strip comments), enable with `--comments` (preserve comments).

  Note

  In MySQL 5.7, the **mysql** client always passes optimizer hints to the server, regardless of whether this option is given. To ensure that optimizer hints are not stripped if you are using an older version of the **mysql** client with a version of the server that understands optimizer hints, invoke **mysql** with the `--comments` option.

  Comment stripping is deprecated as of MySQL 5.7.20. You should expect this feature and the options to control it to be removed in a future MySQL release.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

  Compress all information sent between the client and the server if possible. See Section 4.2.6, “Connection Compression Control”.

* `--connect-expired-password`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

  Indicate to the server that the client can handle sandbox mode if the account used to connect has an expired password. This can be useful for noninteractive invocations of **mysql** because normally the server disconnects noninteractive clients that attempt to connect using an account with an expired password. (See Section 6.2.12, “Server Handling of Expired Passwords”.)

* `--connect-timeout=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

  The number of seconds before connection timeout. (Default value is `0`.)

* `--database=db_name`, `-D db_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

  The database to use. This is useful primarily in an option file.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:o,/tmp/mysql.trace`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

  Print debugging information and memory and CPU usage statistics when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>0

  A hint about which client-side authentication plugin to use. See Section 6.2.13, “Pluggable Authentication”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>1

  Use *`charset_name`* as the default character set for the client and connection.

  This option can be useful if the operating system uses one character set and the **mysql** client by default uses another. In this case, output may be formatted incorrectly. You can usually fix such issues by using this option to force the client to use the system character set instead.

  For more information, see Section 10.4, “Connection Character Sets and Collations”, and Section 10.15, “Character Set Configuration”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>2

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>3

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>4

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysql** normally reads the `[client]` and `[mysql]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysql** also reads the `[client_other]` and `[mysql_other]` groups.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--delimiter=str`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>5

  Set the statement delimiter. The default is the semicolon character (`;`).

* `--disable-named-commands`

  Disable named commands. Use the `\*` form only, or use named commands only at the beginning of a line ending with a semicolon (`;`). **mysql** starts with this option *enabled* by default. However, even with this option, long-format commands still work from the first line. See Section 4.5.1.2, “mysql Client Commands”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>6

  Enable the `mysql_clear_password` cleartext authentication plugin. (See Section 6.4.1.6, “Client-Side Cleartext Pluggable Authentication”.)

* `--execute=statement`, `-e statement`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>7

  Execute the statement and quit. The default output format is like that produced with `--batch`. See Section 4.2.2.1, “Using Options on the Command Line”, for some examples. With this option, **mysql** does not use the history file.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>8

  Continue even if an SQL error occurs.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for auto-rehash"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-rehash</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-auto-rehash</code></td> </tr></tbody></table>9

  Request from the server the public key required for RSA key pair-based password exchange. This option applies to clients that authenticate with the ``caching_sha2_password`` authentication plugin. For that plugin, the server does not send the public key unless requested. This option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the ``caching_sha2_password`` plugin, see Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  The `--get-server-public-key` option was added in MySQL 5.7.23.

* `--histignore`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>0

  A list of one or more colon-separated patterns specifying statements to ignore for logging purposes. These patterns are added to the default pattern list (`"*IDENTIFIED*:*PASSWORD*"`). The value specified for this option affects logging of statements written to the history file, and to `syslog` if the `--syslog` option is given. For more information, see Section 4.5.1.3, “mysql Client Logging”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>1

  Connect to the MySQL server on the given host.

* `--html`, `-H`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>2

  Produce HTML output.

* `--ignore-spaces`, `-i`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>3

  Ignore spaces after function names. The effect of this is described in the discussion for the `IGNORE_SPACE` SQL mode (see Section 5.1.10, “Server SQL Modes”).

* `--init-command=str`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>4

  SQL statement to execute after connecting to the server. If auto-reconnect is enabled, the statement is executed again after reconnection occurs.

* `--line-numbers`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>5

  Write line numbers for errors. Disable this with `--skip-line-numbers`.

* `--local-infile[={0|1}]`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>6

  By default, `LOCAL` capability for `LOAD DATA` is determined by the default compiled into the MySQL client library. To enable or disable `LOCAL` data loading explicitly, use the `--local-infile` option. When given with no value, the option enables `LOCAL` data loading. When given as `--local-infile=0` or `--local-infile=1`, the option disables or enables `LOCAL` data loading.

  Successful use of `LOCAL` load operations within **mysql** also requires that the server permits local loading; see Section 6.1.6, “Security Considerations for LOAD DATA LOCAL”

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>7

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--max-allowed-packet=value`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>8

  The maximum size of the buffer for client/server communication. The default is 16MB, the maximum is 1GB.

* `--max-join-size=value`

  <table frame="box" rules="all" summary="Properties for auto-vertical-output"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-vertical-output</code></td> </tr></tbody></table>9

  The automatic limit for rows in a join when using `--safe-updates`. (Default value is 1,000,000.)

* `--named-commands`, `-G`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>0

  Enable named **mysql** commands. Long-format commands are permitted, not just short-format commands. For example, `quit` and `\q` both are recognized. Use `--skip-named-commands` to disable named commands. See Section 4.5.1.2, “mysql Client Commands”.

* `--net-buffer-length=value`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>1

  The buffer size for TCP/IP and socket communication. (Default value is 16KB.)

* `--no-auto-rehash`, `-A`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>2

  This has the same effect as `--skip-auto-rehash`. See the description for `--auto-rehash`.

* `--no-beep`, `-b`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>3

  Do not beep when errors occur.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>4

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--one-database`, `-o`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>5

  Ignore statements except those that occur while the default database is the one named on the command line. This option is rudimentary and should be used with care. Statement filtering is based only on `USE` statements.

  Initially, **mysql** executes statements in the input because specifying a database *`db_name`* on the command line is equivalent to inserting `USE db_name` at the beginning of the input. Then, for each `USE` statement encountered, **mysql** accepts or rejects following statements depending on whether the database named is the one on the command line. The content of the statements is immaterial.

  Suppose that **mysql** is invoked to process this set of statements:

  ```sql
  DELETE FROM db2.t2;
  USE db2;
  DROP TABLE db1.t1;
  CREATE TABLE db1.t1 (i INT);
  USE db1;
  INSERT INTO t1 (i) VALUES(1);
  CREATE TABLE db2.t1 (j INT);
  ```

  If the command line is **mysql --force --one-database db1**, **mysql** handles the input as follows:

  + The `DELETE` statement is executed because the default database is `db1`, even though the statement names a table in a different database.

  + The `DROP TABLE` and `CREATE TABLE` statements are not executed because the default database is not `db1`, even though the statements name a table in `db1`.

  + The `INSERT` and `CREATE TABLE` statements are executed because the default database is `db1`, even though the `CREATE TABLE` statement names a table in a different database.

* `--pager[=command]`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>6

  Use the given command for paging query output. If the command is omitted, the default pager is the value of your `PAGER` environment variable. Valid pagers are **less**, **more**, **cat [> filename]**, and so forth. This option works only on Unix and only in interactive mode. To disable paging, use `--skip-pager`. Section 4.5.1.2, “mysql Client Commands”, discusses output paging further.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>7

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysql** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 6.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysql** should not prompt for one, use the `--skip-password` option.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>8

  On Windows, connect to the server using a named pipe. This option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for batch"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--batch</code></td> </tr></tbody></table>9

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysql** does not find it. See Section 6.2.13, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>0

  For TCP/IP connections, the port number to use.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>1

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--prompt=format_str`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>2

  Set the prompt to the specified format. The default is `mysql>`. The special sequences that the prompt can contain are described in Section 4.5.1.2, “mysql Client Commands”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>3

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 4.2.5, “Connection Transport Protocols”.

* `--quick`, `-q`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>4

  Do not cache each query result, print each row as it is received. This may slow down the server if the output is suspended. With this option, **mysql** does not use the history file.

  By default, **mysql** fetches all result rows before producing any output; while storing these, it calculates a running maximum column length from the actual value of each column in succession. When printing the output, it uses this maximum to format it. When `--quick` is specified, **mysql** does not have the rows for which to calculate the length before starting, and so uses the maximum length. In the following example, table `t1` has a single column of type `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") and containing 4 rows. The default output is 9 characters wide; this width is equal the maximum number of characters in any of the column values in the rows returned (5), plus 2 characters each for the spaces used as padding and the `|` characters used as column delimiters). The output when using the `--quick` option is 25 characters wide; this is equal to the number of characters needed to represent `-9223372036854775808`, which is the longest possible value that can be stored in a (signed) `BIGINT` column, or 19 characters, plus the 4 characters used for padding and column delimiters. The difference can be seen here:

  ```sql
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

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>5

  For tabular output, the “boxing” around columns enables one column value to be distinguished from another. For nontabular output (such as is produced in batch mode or when the `--batch` or `--silent` option is given), special characters are escaped in the output so they can be identified easily. Newline, tab, `NUL`, and backslash are written as `\n`, `\t`, `\0`, and `\\`. The `--raw` option disables this character escaping.

  The following example demonstrates tabular versus nontabular output and the use of raw mode to disable escaping:

  ```sql
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

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>6

  If the connection to the server is lost, automatically try to reconnect. A single reconnect attempt is made each time the connection is lost. To suppress reconnection behavior, use `--skip-reconnect`.

* `--safe-updates`, `--i-am-a-dummy`, `-U`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>7

  If this option is enabled, `UPDATE` and `DELETE` statements that do not use a key in the `WHERE` clause or a `LIMIT` clause produce an error. In addition, restrictions are placed on `SELECT` statements that produce (or are estimated to produce) very large result sets. If you have set this option in an option file, you can use `--skip-safe-updates` on the command line to override it. For more information about this option, see Using Safe-Updates Mode (--safe-updates)").

* `--secure-auth`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>8

  Do not send passwords to the server in old (pre-4.1) format. This prevents connections except for servers that use the newer password format.

  As of MySQL 5.7.5, this option is deprecated; expect it to be removed in a future MySQL release. It is always enabled and attempting to disable it (`--skip-secure-auth`, `--secure-auth=0`) produces an error. Before MySQL 5.7.5, this option is enabled by default but can be disabled.

  Note

  Passwords that use the pre-4.1 hashing method are less secure than passwords that use the native password hashing method and should be avoided. Pre-4.1 passwords are deprecated and support for them was removed in MySQL 5.7.5. For account upgrade instructions, see Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql\_old\_password Plugin”.

* `--select-limit=value`

  <table frame="box" rules="all" summary="Properties for binary-as-hex"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-as-hex</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>9

  The automatic limit for `SELECT` statements when using `--safe-updates`. (Default value is 1,000.)

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>0

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or ``caching_sha2_password`` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and ``caching_sha2_password`` plugins, see Section 6.4.1.5, “SHA-256 Pluggable Authentication”, and Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>1

  On Windows, the shared-memory name to use for connections made using shared memory to a local server. The default value is `MYSQL`. The shared-memory name is case-sensitive.

  This option applies only if the server was started with the `shared_memory` system variable enabled to support shared-memory connections.

* `--show-warnings`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>2

  Cause warnings to be shown after each statement if there are any. This option applies to interactive and batch mode.

* `--sigint-ignore`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>3

  Ignore `SIGINT` signals (typically the result of typing **Control+C**).

  Without this option, typing **Control+C** interrupts the current statement if there is one, or cancels any partial input line otherwise.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>4

  Silent mode. Produce less output. This option can be given multiple times to produce less and less output.

  This option results in nontabular output format and escaping of special characters. Escaping may be disabled by using raw mode; see the description for the `--raw` option.

* `--skip-column-names`, `-N`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>5

  Do not write column names in results. Use of this option causes the output to be right-aligned, as shown here:

  ```sql
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

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>6

  Do not write line numbers for errors. Useful when you want to compare result files that include error messages.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>7

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--syslog`, `-j`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>8

  This option causes **mysql** to send interactive statements to the system logging facility. On Unix, this is `syslog`; on Windows, it is the Windows Event Log. The destination where logged messages appear is system dependent. On Linux, the destination is often the `/var/log/messages` file.

  Here is a sample of output generated on Linux by using `--syslog`. This output is formatted for readability; each logged message actually takes a single line.

  ```sql
  Mar  7 12:39:25 myhost MysqlClient[20824]:
    SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
    DB_SERVER:'127.0.0.1', DB:'--', QUERY:'USE test;'
  Mar  7 12:39:28 myhost MysqlClient[20824]:
    SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
    DB_SERVER:'127.0.0.1', DB:'test', QUERY:'SHOW TABLES;'
  ```

  For more information, see Section 4.5.1.3, “mysql Client Logging”.

* `--table`, `-t`

  <table frame="box" rules="all" summary="Properties for binary-mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binary-mode</code></td> </tr></tbody></table>9

  Display output in table format. This is the default for interactive use, but can be used to produce table output in batch mode.

* `--tee=file_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

  Append a copy of output to the given file. This option works only in interactive mode. Section 4.5.1.2, “mysql Client Commands”, discusses tee files further.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 5.7.10.

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

  ```sql
  <field name="column_name">NULL</field>
  ```

  The output when `--xml` is used with **mysql** matches that of **mysqldump** `--xml`. See Section 4.5.4, “mysqldump — A Database Backup Program”, for details.

  The XML output also uses an XML namespace, as shown here:

  ```sql
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

#### 4.5.1.2 mysql Client Commands

**mysql** sends each SQL statement that you issue to the server to be executed. There is also a set of commands that **mysql** itself interprets. For a list of these commands, type `help` or `\h` at the `mysql>` prompt:

```sql
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

For server side help, type 'help contents'
```

If **mysql** is invoked with the `--binary-mode` option, all **mysql** commands are disabled except `charset` and `delimiter` in noninteractive mode (for input piped to **mysql** or loaded using the `source` command).

Each command has both a long and short form. The long form is not case-sensitive; the short form is. The long form can be followed by an optional semicolon terminator, but the short form should not.

The use of short-form commands within multiple-line `/* ... */` comments is not supported. Short-form commands do work within single-line `/*! ... */` version comments, as do `/*+ ... */` optimizer-hint comments, which are stored in object definitions. If there is a concern that optimizer-hint comments may be stored in object definitions so that dump files when reloaded with `mysql` would result in execution of such commands, either invoke **mysql** with the `--binary-mode` option or use a reload client other than **mysql**.

* `help [arg]`, `\h [arg]`, `\? [arg]`, `? [arg]`

  Display a help message listing the available **mysql** commands.

  If you provide an argument to the `help` command, **mysql** uses it as a search string to access server-side help from the contents of the MySQL Reference Manual. For more information, see Section 4.5.1.4, “mysql Client Server-Side Help”.

* `charset charset_name`, `\C charset_name`

  Change the default character set and issue a `SET NAMES` statement. This enables the character set to remain synchronized on the client and server if **mysql** is run with auto-reconnect enabled (which is not recommended), because the specified character set is used for reconnects.

* `clear`, `\c`

  Clear the current input. Use this if you change your mind about executing the statement that you are entering.

* `connect [db_name [host_name]]`, `\r [db_name [host_name]]`

  Reconnect to the server. The optional database name and host name arguments may be given to specify the default database or the host where the server is running. If omitted, the current values are used.

* `delimiter str`, `\d str`

  Change the string that **mysql** interprets as the separator between SQL statements. The default is the semicolon character (`;`).

  The delimiter string can be specified as an unquoted or quoted argument on the `delimiter` command line. Quoting can be done with either single quote (`'`), double quote (`"`), or backtick (`` ` ``) characters. To include a quote within a quoted string, either quote the string with a different quote character or escape the quote with a backslash (`\`) character. Backslash should be avoided outside of quoted strings because it is the escape character for MySQL. For an unquoted argument, the delimiter is read up to the first space or end of line. For a quoted argument, the delimiter is read up to the matching quote on the line.

  **mysql** interprets instances of the delimiter string as a statement delimiter anywhere it occurs, except within quoted strings. Be careful about defining a delimiter that might occur within other words. For example, if you define the delimiter as `X`, it is not possible to use the word `INDEX` in statements. **mysql** interprets this as `INDE` followed by the delimiter `X`.

  When the delimiter recognized by **mysql** is set to something other than the default of `;`, instances of that character are sent to the server without interpretation. However, the server itself still interprets `;` as a statement delimiter and processes statements accordingly. This behavior on the server side comes into play for multiple-statement execution (see Multiple Statement Execution Support), and for parsing the body of stored procedures and functions, triggers, and events (see Section 23.1, “Defining Stored Programs”).

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

* `quit`, `\q`

  Exit **mysql**.

* `rehash`, `\#`

  Rebuild the completion hash that enables database, table, and column name completion while you are entering statements. (See the description for the `--auto-rehash` option.)

* `resetconnection`, `\x`

  Reset the connection to clear the session state.

  Resetting a connection has effects similar to `mysql_change_user()` or an auto-reconnect except that the connection is not closed and reopened, and re-authentication is not done. See mysql\_change\_user(), and Automatic Reconnection Control.

  This example shows how `resetconnection` clears a value maintained in the session state:

  ```sql
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

* `status`, `\s`

  Provide status information about the connection and the server you are using. If you are running with `--safe-updates` enabled, `status` also prints the values for the **mysql** variables that affect your queries.

* `system command`, `\! command`

  Execute the given command using your default command interpreter.

  The `system` command works only in Unix.

* `tee [file_name]`, `\T [file_name]`

  By using the `--tee` option when you invoke **mysql**, you can log statements and their output. All the data displayed on the screen is appended into a given file. This can be very useful for debugging purposes also. **mysql** flushes results to the file after each statement, just before it prints its next prompt. Tee functionality works only in interactive mode.

  You can enable this feature interactively with the `tee` command. Without a parameter, the previous file is used. The `tee` file can be disabled with the `notee` command. Executing `tee` again re-enables logging.

* `use db_name`, `\u db_name`

  Use *`db_name`* as the default database.

* `warnings`, `\W`

  Enable display of warnings after each statement (if there are any).

Here are a few tips about the `pager` command:

* You can use it to write to a file and the results go only to the file:

  ```sql
  mysql> pager cat > /tmp/log.txt
  ```

  You can also pass any options for the program that you want to use as your pager:

  ```sql
  mysql> pager less -n -i -S
  ```

* In the preceding example, note the `-S` option. You may find it very useful for browsing wide query results. Sometimes a very wide result set is difficult to read on the screen. The `-S` option to **less** can make the result set much more readable because you can scroll it horizontally using the left-arrow and right-arrow keys. You can also use `-S` interactively within **less** to switch the horizontal-browse mode on and off. For more information, read the **less** manual page:

  ```sql
  man less
  ```

* The `-F` and `-X` options may be used with **less** to cause it to exit if output fits on one screen, which is convenient when no scrolling is necessary:

  ```sql
  mysql> pager less -n -i -S -F -X
  ```

* You can specify very complex pager commands for handling query output:

  ```sql
  mysql> pager cat | tee /dr1/tmp/res.txt \
            | tee /dr2/tmp/res2.txt | less -n -i -S
  ```

  In this example, the command would send query results to two files in two different directories on two different file systems mounted on `/dr1` and `/dr2`, yet still display the results onscreen using **less**.

You can also combine the `tee` and `pager` functions. Have a `tee` file enabled and `pager` set to **less**, and you are able to browse the results using the **less** program and still have everything appended into a file the same time. The difference between the Unix `tee` used with the `pager` command and the **mysql** built-in `tee` command is that the built-in `tee` works even if you do not have the Unix **tee** available. The built-in `tee` also logs everything that is printed on the screen, whereas the Unix **tee** used with `pager` does not log quite that much. Additionally, `tee` file logging can be turned on and off interactively from within **mysql**. This is useful when you want to log some queries to a file, but not others.

The `prompt` command reconfigures the default `mysql>` prompt. The string for defining the prompt can contain the following special sequences.

<table summary="prompt command options that are used to configure the mysql&gt; prompt."><col style="width: 15%"/><col style="width: 75%"/><thead><tr> <th>Option</th> <th>Description</th> </tr></thead><tbody><tr> <td><code>\C</code></td> <td>The current connection identifier</td> </tr><tr> <td><code>\c</code></td> <td>A counter that increments for each statement you issue</td> </tr><tr> <td><code>\D</code></td> <td>The full current date</td> </tr><tr> <td><code>\d</code></td> <td>The default database</td> </tr><tr> <td><code>\h</code></td> <td>The server host</td> </tr><tr> <td><code>\l</code></td> <td>The current delimiter</td> </tr><tr> <td><code>\m</code></td> <td>Minutes of the current time</td> </tr><tr> <td><code>\n</code></td> <td>A newline character</td> </tr><tr> <td><code>\O</code></td> <td>The current month in three-letter format (Jan, Feb, …)</td> </tr><tr> <td><code>\o</code></td> <td>The current month in numeric format</td> </tr><tr> <td><code>\P</code></td> <td>am/pm</td> </tr><tr> <td><code>\p</code></td> <td>The current TCP/IP port or socket file</td> </tr><tr> <td><code>\R</code></td> <td>The current time, in 24-hour military time (0–23)</td> </tr><tr> <td><code>\r</code></td> <td>The current time, standard 12-hour time (1–12)</td> </tr><tr> <td><code>\S</code></td> <td>Semicolon</td> </tr><tr> <td><code>\s</code></td> <td>Seconds of the current time</td> </tr><tr> <td><code>\t</code></td> <td>A tab character</td> </tr><tr> <td><code>\U</code></td> <td><p> Your full <code><em class="replaceable"><code>user_name</code></em>@<em class="replaceable"><code>host_name</code></em></code> account name </p></td> </tr><tr> <td><code>\u</code></td> <td>Your user name</td> </tr><tr> <td><code>\v</code></td> <td>The server version</td> </tr><tr> <td><code>\w</code></td> <td>The current day of the week in three-letter format (Mon, Tue, …)</td> </tr><tr> <td><code>\Y</code></td> <td>The current year, four digits</td> </tr><tr> <td><code>\y</code></td> <td>The current year, two digits</td> </tr><tr> <td><code>\_</code></td> <td>A space</td> </tr><tr> <td><code>\ </code></td> <td>A space (a space follows the backslash)</td> </tr><tr> <td><code>\'</code></td> <td>Single quote</td> </tr><tr> <td><code>\"</code></td> <td>Double quote</td> </tr><tr> <td><code>\\</code></td> <td>A literal <code>\</code> backslash character</td> </tr><tr> <td><code>\<em class="replaceable"><code>x</code></em></code></td> <td><p> <em class="replaceable"><code>x</code></em>, for any “<span class="quote"><em class="replaceable"><code>x</code></em>”</span> not listed above </p></td> </tr></tbody></table>

You can set the prompt in several ways:

* *Use an environment variable.* You can set the `MYSQL_PS1` environment variable to a prompt string. For example:

  ```sql
  export MYSQL_PS1="(\u@\h) [\d]> "
  ```

* *Use a command-line option.* You can set the `--prompt` option on the command line to **mysql**. For example:

  ```sql
  $> mysql --prompt="(\u@\h) [\d]> "
  (user@host) [database]>
  ```

* *Use an option file.* You can set the `prompt` option in the `[mysql]` group of any MySQL option file, such as `/etc/my.cnf` or the `.my.cnf` file in your home directory. For example:

  ```sql
  [mysql]
  prompt=(\\u@\\h) [\\d]>\\_
  ```

  In this example, note that the backslashes are doubled. If you set the prompt using the `prompt` option in an option file, it is advisable to double the backslashes when using the special prompt options. There is some overlap in the set of permissible prompt options and the set of special escape sequences that are recognized in option files. (The rules for escape sequences in option files are listed in Section 4.2.2.2, “Using Option Files”.) The overlap may cause you problems if you use single backslashes. For example, `\s` is interpreted as a space rather than as the current seconds value. The following example shows how to define a prompt within an option file to include the current time in `hh:mm:ss>` format:

  ```sql
  [mysql]
  prompt="\\r:\\m:\\s> "
  ```

* *Set the prompt interactively.* You can change your prompt interactively by using the `prompt` (or `\R`) command. For example:

  ```sql
  mysql> prompt (\u@\h) [\d]>\_
  PROMPT set to '(\u@\h) [\d]>\_'
  (user@host) [database]>
  (user@host) [database]> prompt
  Returning to default PROMPT of mysql>
  mysql>
  ```

#### 4.5.1.3 mysql Client Logging

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

```sql
mysql> SELECT
    -> 'Today is'
    -> ,
    -> CURDATE()
    -> ;
```

In this case, **mysql** logs the “SELECT”, “'Today is'”, “,”, “CURDATE()”, and “;” lines as it reads them. It also logs the complete statement, after mapping `SELECT\n'Today is'\n,\nCURDATE()` to `SELECT 'Today is' , CURDATE()`, plus a delimiter. Thus, these lines appear in logged output:

```sql
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

```sql
mysql --histignore="*UPDATE*:*DELETE*"
```

##### Controlling the History File

The `.mysql_history` file should be protected with a restrictive access mode because sensitive information might be written to it, such as the text of SQL statements that contain passwords. See Section 6.1.2.1, “End-User Guidelines for Password Security”. Statements in the file are accessible from the **mysql** client when the **up-arrow** key is used to recall the history. See Disabling Interactive History.

If you do not want to maintain a history file, first remove `.mysql_history` if it exists. Then use either of the following techniques to prevent it from being created again:

* Set the `MYSQL_HISTFILE` environment variable to `/dev/null`. To cause this setting to take effect each time you log in, put it in one of your shell's startup files.

* Create `.mysql_history` as a symbolic link to `/dev/null`; this need be done only once:

  ```sql
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

```sql
Mar  7 12:39:25 myhost MysqlClient[20824]:
  SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
  DB_SERVER:'127.0.0.1', DB:'--', QUERY:'USE test;'
Mar  7 12:39:28 myhost MysqlClient[20824]:
  SYSTEM_USER:'oscar', MYSQL_USER:'my_oscar', CONNECTION_ID:23,
  DB_SERVER:'127.0.0.1', DB:'test', QUERY:'SHOW TABLES;'
```

#### 4.5.1.4 mysql Client Server-Side Help

```sql
mysql> help search_string
```

If you provide an argument to the `help` command, **mysql** uses it as a search string to access server-side help from the contents of the MySQL Reference Manual. The proper operation of this command requires that the help tables in the `mysql` database be initialized with help topic information (see Section 5.1.14, “Server-Side Help Support”).

If there is no match for the search string, the search fails:

```sql
mysql> help me

Nothing found
Please try to run 'help contents' for a list of all accessible topics
```

Use **help contents** to see a list of the help categories:

```sql
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

```sql
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

```sql
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

```sql
mysql> SHOW BINARY LOGS;
+---------------+-----------+
| Log_name      | File_size |
+---------------+-----------+
| binlog.000015 |    724935 |
| binlog.000016 |    733481 |
+---------------+-----------+
```

The search string can contain the wildcard characters `%` and `_`. These have the same meaning as for pattern-matching operations performed with the `LIKE` operator. For example, `HELP rep%` returns a list of topics that begin with `rep`:

```sql
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

#### 4.5.1.5 Executing SQL Statements from a Text File

The **mysql** client typically is used interactively, like this:

```sql
mysql db_name
```

However, it is also possible to put your SQL statements in a file and then tell **mysql** to read its input from that file. To do so, create a text file *`text_file`* that contains the statements you wish to execute. Then invoke **mysql** as shown here:

```sql
mysql db_name < text_file
```

If you place a `USE db_name` statement as the first statement in the file, it is unnecessary to specify the database name on the command line:

```sql
mysql < text_file
```

If you are already running **mysql**, you can execute an SQL script file using the `source` command or `\.` command:

```sql
mysql> source file_name
mysql> \. file_name
```

Sometimes you may want your script to display progress information to the user. For this you can insert statements like this:

```sql
SELECT '<info_to_display>' AS ' ';
```

The statement shown outputs `<info_to_display>`.

You can also invoke **mysql** with the `--verbose` option, which causes each statement to be displayed before the result that it produces.

**mysql** ignores Unicode byte order mark (BOM) characters at the beginning of input files. Previously, it read them and sent them to the server, resulting in a syntax error. Presence of a BOM does not cause **mysql** to change its default character set. To do that, invoke **mysql** with an option such as `--default-character-set=utf8`.

For more information about batch mode, see Section 3.5, “Using mysql in Batch Mode”.

#### 4.5.1.6 mysql Client Tips

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

```sql
bind "^W" ed-delete-prev-word
bind "^U" vi-kill-line-prev
```

To see the current set of key bindings, temporarily put a line that says only `bind` at the end of `.editrc`. Then **mysql** shows the bindings when it starts.

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

3. Execute **mysql.exe** with the `--default-character-set=utf8` (or `utf8mb4`) option. This option is necessary because `utf16le` is one of the character sets that cannot be used as the client character set. See Impermissible Client Character Sets.

With those changes, **mysql** can use the Windows APIs to communicate with the console using UTF-16LE, and communicate with the server using UTF-8. (The menu item mentioned previously sets the font and character set as just described.)

To avoid those steps each time you run **mysql**, you can create a shortcut that invokes **mysql.exe**. The shortcut should set the console font to Lucida Console or some other compatible Unicode font, and pass the `--default-character-set=utf8` (or `utf8mb4`) option to **mysql.exe**.

Alternatively, create a shortcut that only sets the console font, and set the character set in the `[mysql]` group of your `my.ini` file:

```sql
[mysql]
default-character-set=utf8
```

##### Displaying Query Results Vertically

Some query results are much more readable when displayed vertically, instead of in the usual horizontal table format. Queries can be displayed vertically by terminating the query with \G instead of a semicolon. For example, longer text values that include newlines often are much easier to read with vertical output:

```sql
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

```sql
SET sql_safe_updates=1, sql_select_limit=1000, max_join_size=1000000;
```

The `SET` statement affects statement processing as follows:

* Enabling `sql_safe_updates` causes `UPDATE` and `DELETE` statements to produce an error if they do not specify a key constraint in the `WHERE` clause, or provide a `LIMIT` clause, or both. For example:

  ```sql
  UPDATE tbl_name SET not_key_column=val WHERE key_column=val;

  UPDATE tbl_name SET not_key_column=val LIMIT 1;
  ```

* Setting `sql_select_limit` to 1,000 causes the server to limit all `SELECT` result sets to 1,000 rows unless the statement includes a `LIMIT` clause.

* Setting `max_join_size` to 1,000,000 causes multiple-table `SELECT` statements to produce an error if the server estimates it must examine more than 1,000,000 row combinations.

To specify result set limits different from 1,000 and 1,000,000, you can override the defaults by using the `--select-limit` and `--max-join-size` options when you invoke **mysql**:

```sql
mysql --safe-updates --select-limit=500 --max-join-size=10000
```

It is possible for `UPDATE` and `DELETE` statements to produce an error in safe-updates mode even with a key specified in the `WHERE` clause, if the optimizer decides not to use the index on the key column:

* Range access on the index cannot be used if memory usage exceeds that permitted by the `range_optimizer_max_mem_size` system variable. The optimizer then falls back to a table scan. See Limiting Memory Use for Range Optimization.

* If key comparisons require type conversion, the index may not be used (see Section 8.3.1, “How MySQL Uses Indexes”). Suppose that an indexed string column `c1` is compared to a numeric value using `WHERE c1 = 2222`. For such comparisons, the string value is converted to a number and the operands are compared numerically (see Section 12.3, “Type Conversion in Expression Evaluation”), preventing use of the index. If safe-updates mode is enabled, an error occurs.

As of MySQL 5.7.25, safe-updates mode also includes these behaviors:

* `EXPLAIN` with `UPDATE` and `DELETE` statements does not produce safe-updates errors. This enables use of `EXPLAIN` plus `SHOW WARNINGS` to see why an index is not used, which can be helpful in cases such as when a `range_optimizer_max_mem_size` violation or type conversion occurs and the optimizer does not use an index even though a key column was specified in the `WHERE` clause.

* When a safe-updates error occurs, the error message includes the first diagnostic that was produced, to provide information about the reason for failure. For example, the message may indicate that the `range_optimizer_max_mem_size` value was exceeded or type conversion occurred, either of which can preclude use of an index.

* For multiple-table deletes and updates, an error is produced with safe updates enabled only if any target table uses a table scan.

##### Disabling mysql Auto-Reconnect

If the **mysql** client loses its connection to the server while sending a statement, it immediately and automatically tries to reconnect once to the server and send the statement again. However, even if **mysql** succeeds in reconnecting, your first connection has ended and all your previous session objects and settings are lost: temporary tables, the autocommit mode, and user-defined and session variables. Also, any current transaction rolls back. This behavior may be dangerous for you, as in the following example where the server was shut down and restarted between the first and second statements without you knowing it:

```sql
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

The **mysql** client uses a parser on the client side that is not a duplicate of the complete parser used by the `mysqld` server on the server side. This can lead to differences in treatment of certain constructs. Examples:

* The server parser treats strings delimited by `"` characters as identifiers rather than as plain strings if the `ANSI_QUOTES` SQL mode is enabled.

  The **mysql** client parser does not take the `ANSI_QUOTES` SQL mode into account. It treats strings delimited by `"`, `'`, and `` ` `` characters the same, regardless of whether `ANSI_QUOTES` is enabled.

* Within `/*! ... */` comments, the **mysql** client parser interprets short-form **mysql** commands. The server parser does not interpret them because these commands have no meaning on the server side.

  If it is desirable for **mysql** not to interpret short-form commands within comments, a partial workaround is to use the `--binary-mode` option, which causes all **mysql** commands to be disabled except `\C` and `\d` in noninteractive mode (for input piped to **mysql** or loaded using the `source` command).


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

<table frame="box" rules="all" summary="Command-line options available for mysqladmin.">
  <col style="width: 27%"/>
  <col style="width: 50%"/>
  <col style="width: 11%"/>
  <col style="width: 11%"/>
  <thead>
    <tr>
      <th>Option Name</th>
      <th>Description</th>
      <th>Introduced</th>
      <th>Deprecated</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>--bind-address</code></th>
      <td>Use specified network interface to connect to MySQL Server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--character-sets-dir</code></th>
      <td>Directory where character sets can be found</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--compress</code></th>
      <td>Compress all information sent between client and server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--connect-timeout</code></th>
      <td>Number of seconds before connection timeout</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--count</code></th>
      <td>Number of iterations to make for repeated command execution</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug</code></th>
      <td>Write debugging log</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-check</code></th>
      <td>Print debugging information when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-info</code></th>
      <td>Print debugging information, memory, and CPU statistics when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-auth</code></th>
      <td>Authentication plugin to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-character-set</code></th>
      <td>Specify default character set</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-extra-file</code></th>
      <td>Read named option file in addition to usual option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-file</code></th>
      <td>Read only named option file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-group-suffix</code></th>
      <td>Option group suffix value</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--enable-cleartext-plugin</code></th>
      <td>Enable cleartext authentication plugin</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--force</code></th>
      <td>Continue even if an SQL error occurs</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--get-server-public-key</code></th>
      <td>Request RSA public key from server</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--help</code></th>
      <td>Display help message and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--host</code></th>
      <td>Host on which MySQL server is located</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--login-path</code></th>
      <td>Read login path options from .mylogin.cnf</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-beep</code></th>
      <td>Do not beep when errors occur</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-defaults</code></th>
      <td>Read no option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--password</code></th>
      <td>Password to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--pipe</code></th>
      <td>Connect to server using named pipe (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--plugin-dir</code></th>
      <td>Directory where plugins are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--port</code></th>
      <td>TCP/IP port number for connection</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--print-defaults</code></th>
      <td>Print default options</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--protocol</code></th>
      <td>Transport protocol to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--relative</code></th>
      <td>Show the difference between the current and previous values when used with the --sleep option</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--secure-auth</code></th>
      <td>Do not send passwords to server in old (pre-4.1) format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--server-public-key-path</code></th>
      <td>Path name to file containing RSA public key</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--shared-memory-base-name</code></th>
      <td>Shared-memory name for shared-memory connections (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--show-warnings</code></th>
      <td>Show warnings after statement execution</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--shutdown-timeout</code></th>
      <td>The maximum number of seconds to wait for server shutdown</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--silent</code></th>
      <td>Silent mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--sleep</code></th>
      <td>Execute commands repeatedly, sleeping for delay seconds in between</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--socket</code></th>
      <td>Unix socket file or Windows named pipe to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl</code></th>
      <td>Enable connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-ca</code></th>
      <td>File that contains list of trusted SSL Certificate Authorities</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-capath</code></th>
      <td>Directory that contains trusted SSL Certificate Authority certificate files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cert</code></th>
      <td>File that contains X.509 certificate</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cipher</code></th>
      <td>Permissible ciphers for connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crl</code></th>
      <td>File that contains certificate revocation lists</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crlpath</code></th>
      <td>Directory that contains certificate revocation-list files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-key</code></th>
      <td>File that contains X.509 key</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-mode</code></th>
      <td>Desired security state of connection to server</td>
      <td>5.7.11</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-verify-server-cert</code></th>
      <td>Verify host name against server certificate Common Name identity</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tls-version</code></th>
      <td>Permissible TLS protocols for encrypted connections</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--user</code></th>
      <td>MySQL user name to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--verbose</code></th>
      <td>Verbose mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--version</code></th>
      <td>Display version information and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--vertical</code></th>
      <td>Print query output rows vertically (one line per column value)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--wait</code></th>
      <td>If the connection cannot be established, wait and retry instead of aborting</td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On a computer having multiple network interfaces, use this option to select which interface to use for connecting to the MySQL server.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  The directory where character sets are installed. See Section 10.15, “Character Set Configuration”.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compress all information sent between the client and the server if possible. See Section 4.2.6, “Connection Compression Control”.

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

  <table frame="box" rules="all" summary="Properties for debug-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--debug-info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Print debugging information and memory and CPU usage statistics when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

  A hint about which client-side authentication plugin to use. See Section 6.2.13, “Pluggable Authentication”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

  Use *`charset_name`* as the default character set. See Section 10.15, “Character Set Configuration”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysqladmin** normally reads the `[client]` and `[mysqladmin]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysqladmin** also reads the `[client_other]` and `[mysqladmin_other]` groups.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

  Enable the `mysql_clear_password` cleartext authentication plugin. (See Section 6.4.1.6, “Client-Side Cleartext Pluggable Authentication”.)

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

  Do not ask for confirmation for the `drop db_name` command. With multiple commands, continue even if an error occurs.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

  Request from the server the public key required for RSA key pair-based password exchange. This option applies to clients that authenticate with the ``caching_sha2_password`` authentication plugin. For that plugin, the server does not send the public key unless requested. This option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the ``caching_sha2_password`` plugin, see Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  The `--get-server-public-key` option was added in MySQL 5.7.23.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

  Connect to the MySQL server on the given host.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--no-beep`, `-b`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

  Suppress the warning beep that is emitted by default for errors such as a failure to connect to the server.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqladmin** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 6.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqladmin** should not prompt for one, use the `--skip-password` option.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

  On Windows, connect to the server using a named pipe. This option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysqladmin** does not find it. See Section 6.2.13, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

  For TCP/IP connections, the port number to use.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 4.2.5, “Connection Transport Protocols”.

* `--relative`, `-r`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>8

  Show the difference between the current and previous values when used with the `--sleep` option. This option works only with the `extended-status` command.

* `--show-warnings`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>9

  Show warnings resulting from execution of statements sent to the server.

* `--secure-auth`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

  Do not send passwords to the server in old (pre-4.1) format. This prevents connections except for servers that use the newer password format.

  As of MySQL 5.7.5, this option is deprecated; expect it to be removed in a future MySQL release. It is always enabled and attempting to disable it (`--skip-secure-auth`, `--secure-auth=0`) produces an error. Before MySQL 5.7.5, this option is enabled by default but can be disabled.

  Note

  Passwords that use the pre-4.1 hashing method are less secure than passwords that use the native password hashing method and should be avoided. Pre-4.1 passwords are deprecated and support for them was removed in MySQL 5.7.5. For account upgrade instructions, see Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql\_old\_password Plugin”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or ``caching_sha2_password`` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and ``caching_sha2_password`` plugins, see Section 6.4.1.5, “SHA-256 Pluggable Authentication”, and Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  The `--server-public-key-path` option was added in MySQL 5.7.23.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

  On Windows, the shared-memory name to use for connections made using shared memory to a local server. The default value is `MYSQL`. The shared-memory name is case-sensitive.

  This option applies only if the server was started with the `shared_memory` system variable enabled to support shared-memory connections.

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

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>7

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 5.7.10.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>8

  The user name of the MySQL account to use for connecting to the server.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>9

  Verbose mode. Print more information about what the program does.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

  Display version information and exit.

* `--vertical`, `-E`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

  Print output vertically. This is similar to `--relative`, but prints output vertically.

* `--wait[=count]`, `-w[count]`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

  If the connection cannot be established, wait and retry instead of aborting. If a *`count`* value is given, it indicates the number of times to retry. The default is one time.

### 4.5.3 mysqlcheck — A Table Maintenance Program

The **mysqlcheck** client performs table maintenance: It checks, repairs, optimizes, or analyzes tables.

Each table is locked and therefore unavailable to other sessions while it is being processed, although for check operations, the table is locked with a `READ` lock only (see Section 13.3.5, “LOCK TABLES and UNLOCK TABLES Statements”, for more information about `READ` and `WRITE` locks). Table maintenance operations can be time-consuming, particularly for large tables. If you use the `--databases` or `--all-databases` option to process all tables in one or more databases, an invocation of **mysqlcheck** might take a long time. (This is also true for the MySQL upgrade procedure if it determines that table checking is needed because it processes tables the same way.)

**mysqlcheck** must be used when the `mysqld` server is running, which means that you do not have to stop the server to perform table maintenance.

**mysqlcheck** uses the SQL statements `CHECK TABLE`, `REPAIR TABLE`, `ANALYZE TABLE`, and `OPTIMIZE TABLE` in a convenient way for the user. It determines which statements to use for the operation you want to perform, and then sends the statements to the server to be executed. For details about which storage engines each statement works with, see the descriptions for those statements in Section 13.7.2, “Table Maintenance Statements”.

All storage engines do not necessarily support all four maintenance operations. In such cases, an error message is displayed. For example, if `test.t` is an `MEMORY` table, an attempt to check it produces this result:

```sql
$> mysqlcheck test t
test.t
note     : The storage engine for the table doesn't support check
```

If **mysqlcheck** is unable to repair a table, see Section 2.10.12, “Rebuilding or Repairing Tables or Indexes” for manual table repair strategies. This is the case, for example, for `InnoDB` tables, which can be checked with `CHECK TABLE`, but not repaired with `REPAIR TABLE`.

Caution

It is best to make a backup of a table before performing a table repair operation; under some circumstances the operation might cause data loss. Possible causes include but are not limited to file system errors.

There are three general ways to invoke **mysqlcheck**:

```sql
mysqlcheck [options] db_name [tbl_name ...]
mysqlcheck [options] --databases db_name ...
mysqlcheck [options] --all-databases
```

If you do not name any tables following *`db_name`* or if you use the `--databases` or `--all-databases` option, entire databases are checked.

**mysqlcheck** has a special feature compared to other client programs. The default behavior of checking tables (`--check`) can be changed by renaming the binary. If you want to have a tool that repairs tables by default, you should just make a copy of **mysqlcheck** named **mysqlrepair**, or make a symbolic link to **mysqlcheck** named **mysqlrepair**. If you invoke **mysqlrepair**, it repairs tables.

The names shown in the following table can be used to change **mysqlcheck** default behavior.

<table summary="Command names that can be used to change mysqlcheck default behavior."><col style="width: 25%"/><col style="width: 75%"/><thead><tr> <th>Command</th> <th>Meaning</th> </tr></thead><tbody><tr> <td><strong>mysqlrepair</strong></td> <td>The default option is <code class="option">--repair</code></td> </tr><tr> <td><strong>mysqlanalyze</strong></td> <td>The default option is <code class="option">--analyze</code></td> </tr><tr> <td><strong>mysqloptimize</strong></td> <td>The default option is <code class="option">--optimize</code></td> </tr></tbody></table>

**mysqlcheck** supports the following options, which can be specified on the command line or in the `[mysqlcheck]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see Section 4.2.2.2, “Using Option Files”.

**Table 4.15 mysqlcheck Options**

<table frame="box" rules="all" summary="Command-line options available for mysqlcheck.">
  <col style="width: 27%"/>
  <col style="width: 50%"/>
  <col style="width: 11%"/>
  <col style="width: 11%"/>
  <thead>
    <tr>
      <th>Option Name</th>
      <th>Description</th>
      <th>Introduced</th>
      <th>Deprecated</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>--all-databases</code></th>
      <td>Check all tables in all databases</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--all-in-1</code></th>
      <td>Execute a single statement for each database that names all the tables from that database</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--analyze</code></th>
      <td>Analyze the tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--auto-repair</code></th>
      <td>If a checked table is corrupted, automatically fix it</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--bind-address</code></th>
      <td>Use specified network interface to connect to MySQL Server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--character-sets-dir</code></th>
      <td>Directory where character sets are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check</code></th>
      <td>Check the tables for errors</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check-only-changed</code></th>
      <td>Check only tables that have changed since the last check</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check-upgrade</code></th>
      <td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--compress</code></th>
      <td>Compress all information sent between client and server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--databases</code></th>
      <td>Interpret all arguments as database names</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug</code></th>
      <td>Write debugging log</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-check</code></th>
      <td>Print debugging information when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-info</code></th>
      <td>Print debugging information, memory, and CPU statistics when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-auth</code></th>
      <td>Authentication plugin to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-character-set</code></th>
      <td>Specify default character set</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-extra-file</code></th>
      <td>Read named option file in addition to usual option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-file</code></th>
      <td>Read only named option file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-group-suffix</code></th>
      <td>Option group suffix value</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--enable-cleartext-plugin</code></th>
      <td>Enable cleartext authentication plugin</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--extended</code></th>
      <td>Check and repair tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fast</code></th>
      <td>Check only tables that have not been closed properly</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fix-db-names</code></th>
      <td>Convert database names to 5.1 format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--fix-table-names</code></th>
      <td>Convert table names to 5.1 format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--force</code></th>
      <td>Continue even if an SQL error occurs</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--get-server-public-key</code></th>
      <td>Request RSA public key from server</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--help</code></th>
      <td>Display help message and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--host</code></th>
      <td>Host on which MySQL server is located</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--login-path</code></th>
      <td>Read login path options from .mylogin.cnf</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--medium-check</code></th>
      <td>Do a check that is faster than an --extended operation</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-defaults</code></th>
      <td>Read no option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--optimize</code></th>
      <td>Optimize the tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--password</code></th>
      <td>Password to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--pipe</code></th>
      <td>Connect to server using named pipe (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--plugin-dir</code></th>
      <td>Directory where plugins are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--port</code></th>
      <td>TCP/IP port number for connection</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--print-defaults</code></th>
      <td>Print default options</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--protocol</code></th>
      <td>Transport protocol to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--quick</code></th>
      <td>The fastest method of checking</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--repair</code></th>
      <td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--secure-auth</code></th>
      <td>Do not send passwords to server in old (pre-4.1) format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--server-public-key-path</code></th>
      <td>Path name to file containing RSA public key</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--shared-memory-base-name</code></th>
      <td>Shared-memory name for shared-memory connections (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--silent</code></th>
      <td>Silent mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-database</code></th>
      <td>Omit this database from performed operations</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--socket</code></th>
      <td>Unix socket file or Windows named pipe to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl</code></th>
      <td>Enable connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-ca</code></th>
      <td>File that contains list of trusted SSL Certificate Authorities</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-capath</code></th>
      <td>Directory that contains trusted SSL Certificate Authority certificate files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cert</code></th>
      <td>File that contains X.509 certificate</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cipher</code></th>
      <td>Permissible ciphers for connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crl</code></th>
      <td>File that contains certificate revocation lists</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crlpath</code></th>
      <td>Directory that contains certificate revocation-list files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-key</code></th>
      <td>File that contains X.509 key</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-mode</code></th>
      <td>Desired security state of connection to server</td>
      <td>5.7.11</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-verify-server-cert</code></th>
      <td>Verify host name against server certificate Common Name identity</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tables</code></th>
      <td>Overrides the --databases or -B option</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tls-version</code></th>
      <td>Permissible TLS protocols for encrypted connections</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--use-frm</code></th>
      <td>For repair operations on MyISAM tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--user</code></th>
      <td>MySQL user name to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--verbose</code></th>
      <td>Verbose mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--version</code></th>
      <td>Display version information and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--write-binlog</code></th>
      <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

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

  The directory where character sets are installed. See Section 10.15, “Character Set Configuration”.

* `--check`, `-c`

  <table frame="box" rules="all" summary="Properties for check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--check</code></td> </tr></tbody></table>

  Check the tables for errors. This is the default operation.

* `--check-only-changed`, `-C`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck.">
  <col style="width: 27%"/>
  <col style="width: 50%"/>
  <col style="width: 11%"/>
  <col style="width: 11%"/>
  <thead>
    <tr>
      <th>Option Name</th>
      <th>Description</th>
      <th>Introduced</th>
      <th>Deprecated</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>--all-databases</code></th>
      <td>Check all tables in all databases</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--all-in-1</code></th>
      <td>Execute a single statement for each database that names all the tables from that database</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--analyze</code></th>
      <td>Analyze the tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--auto-repair</code></th>
      <td>If a checked table is corrupted, automatically fix it</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--bind-address</code></th>
      <td>Use specified network interface to connect to MySQL Server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--character-sets-dir</code></th>
      <td>Directory where character sets are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check</code></th>
      <td>Check the tables for errors</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check-only-changed</code></th>
      <td>Check only tables that have changed since the last check</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check-upgrade</code></th>
      <td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--compress</code></th>
      <td>Compress all information sent between client and server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--databases</code></th>
      <td>Interpret all arguments as database names</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug</code></th>
      <td>Write debugging log</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-check</code></th>
      <td>Print debugging information when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-info</code></th>
      <td>Print debugging information, memory, and CPU statistics when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-auth</code></th>
      <td>Authentication plugin to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-character-set</code></th>
      <td>Specify default character set</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-extra-file</code></th>
      <td>Read named option file in addition to usual option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-file</code></th>
      <td>Read only named option file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-group-suffix</code></th>
      <td>Option group suffix value</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--enable-cleartext-plugin</code></th>
      <td>Enable cleartext authentication plugin</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--extended</code></th>
      <td>Check and repair tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fast</code></th>
      <td>Check only tables that have not been closed properly</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fix-db-names</code></th>
      <td>Convert database names to 5.1 format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--fix-table-names</code></th>
      <td>Convert table names to 5.1 format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--force</code></th>
      <td>Continue even if an SQL error occurs</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--get-server-public-key</code></th>
      <td>Request RSA public key from server</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--help</code></th>
      <td>Display help message and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--host</code></th>
      <td>Host on which MySQL server is located</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--login-path</code></th>
      <td>Read login path options from .mylogin.cnf</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--medium-check</code></th>
      <td>Do a check that is faster than an --extended operation</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-defaults</code></th>
      <td>Read no option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--optimize</code></th>
      <td>Optimize the tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--password</code></th>
      <td>Password to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--pipe</code></th>
      <td>Connect to server using named pipe (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--plugin-dir</code></th>
      <td>Directory where plugins are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--port</code></th>
      <td>TCP/IP port number for connection</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--print-defaults</code></th>
      <td>Print default options</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--protocol</code></th>
      <td>Transport protocol to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--quick</code></th>
      <td>The fastest method of checking</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--repair</code></th>
      <td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--secure-auth</code></th>
      <td>Do not send passwords to server in old (pre-4.1) format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--server-public-key-path</code></th>
      <td>Path name to file containing RSA public key</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--shared-memory-base-name</code></th>
      <td>Shared-memory name for shared-memory connections (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--silent</code></th>
      <td>Silent mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-database</code></th>
      <td>Omit this database from performed operations</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--socket</code></th>
      <td>Unix socket file or Windows named pipe to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl</code></th>
      <td>Enable connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-ca</code></th>
      <td>File that contains list of trusted SSL Certificate Authorities</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-capath</code></th>
      <td>Directory that contains trusted SSL Certificate Authority certificate files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cert</code></th>
      <td>File that contains X.509 certificate</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cipher</code></th>
      <td>Permissible ciphers for connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crl</code></th>
      <td>File that contains certificate revocation lists</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crlpath</code></th>
      <td>Directory that contains certificate revocation-list files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-key</code></th>
      <td>File that contains X.509 key</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-mode</code></th>
      <td>Desired security state of connection to server</td>
      <td>5.7.11</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-verify-server-cert</code></th>
      <td>Verify host name against server certificate Common Name identity</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tables</code></th>
      <td>Overrides the --databases or -B option</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tls-version</code></th>
      <td>Permissible TLS protocols for encrypted connections</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--use-frm</code></th>
      <td>For repair operations on MyISAM tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--user</code></th>
      <td>MySQL user name to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--verbose</code></th>
      <td>Verbose mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--version</code></th>
      <td>Display version information and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--write-binlog</code></th>
      <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

  Check only tables that have changed since the last check or that have not been closed properly.

* `--check-upgrade`, `-g`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck.">
  <col style="width: 27%"/>
  <col style="width: 50%"/>
  <col style="width: 11%"/>
  <col style="width: 11%"/>
  <thead>
    <tr>
      <th>Option Name</th>
      <th>Description</th>
      <th>Introduced</th>
      <th>Deprecated</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>--all-databases</code></th>
      <td>Check all tables in all databases</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--all-in-1</code></th>
      <td>Execute a single statement for each database that names all the tables from that database</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--analyze</code></th>
      <td>Analyze the tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--auto-repair</code></th>
      <td>If a checked table is corrupted, automatically fix it</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--bind-address</code></th>
      <td>Use specified network interface to connect to MySQL Server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--character-sets-dir</code></th>
      <td>Directory where character sets are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check</code></th>
      <td>Check the tables for errors</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check-only-changed</code></th>
      <td>Check only tables that have changed since the last check</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check-upgrade</code></th>
      <td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--compress</code></th>
      <td>Compress all information sent between client and server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--databases</code></th>
      <td>Interpret all arguments as database names</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug</code></th>
      <td>Write debugging log</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-check</code></th>
      <td>Print debugging information when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-info</code></th>
      <td>Print debugging information, memory, and CPU statistics when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-auth</code></th>
      <td>Authentication plugin to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-character-set</code></th>
      <td>Specify default character set</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-extra-file</code></th>
      <td>Read named option file in addition to usual option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-file</code></th>
      <td>Read only named option file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-group-suffix</code></th>
      <td>Option group suffix value</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--enable-cleartext-plugin</code></th>
      <td>Enable cleartext authentication plugin</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--extended</code></th>
      <td>Check and repair tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fast</code></th>
      <td>Check only tables that have not been closed properly</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fix-db-names</code></th>
      <td>Convert database names to 5.1 format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--fix-table-names</code></th>
      <td>Convert table names to 5.1 format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--force</code></th>
      <td>Continue even if an SQL error occurs</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--get-server-public-key</code></th>
      <td>Request RSA public key from server</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--help</code></th>
      <td>Display help message and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--host</code></th>
      <td>Host on which MySQL server is located</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--login-path</code></th>
      <td>Read login path options from .mylogin.cnf</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--medium-check</code></th>
      <td>Do a check that is faster than an --extended operation</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-defaults</code></th>
      <td>Read no option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--optimize</code></th>
      <td>Optimize the tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--password</code></th>
      <td>Password to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--pipe</code></th>
      <td>Connect to server using named pipe (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--plugin-dir</code></th>
      <td>Directory where plugins are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--port</code></th>
      <td>TCP/IP port number for connection</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--print-defaults</code></th>
      <td>Print default options</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--protocol</code></th>
      <td>Transport protocol to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--quick</code></th>
      <td>The fastest method of checking</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--repair</code></th>
      <td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--secure-auth</code></th>
      <td>Do not send passwords to server in old (pre-4.1) format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--server-public-key-path</code></th>
      <td>Path name to file containing RSA public key</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--shared-memory-base-name</code></th>
      <td>Shared-memory name for shared-memory connections (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--silent</code></th>
      <td>Silent mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-database</code></th>
      <td>Omit this database from performed operations</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--socket</code></th>
      <td>Unix socket file or Windows named pipe to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl</code></th>
      <td>Enable connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-ca</code></th>
      <td>File that contains list of trusted SSL Certificate Authorities</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-capath</code></th>
      <td>Directory that contains trusted SSL Certificate Authority certificate files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cert</code></th>
      <td>File that contains X.509 certificate</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cipher</code></th>
      <td>Permissible ciphers for connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crl</code></th>
      <td>File that contains certificate revocation lists</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crlpath</code></th>
      <td>Directory that contains certificate revocation-list files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-key</code></th>
      <td>File that contains X.509 key</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-mode</code></th>
      <td>Desired security state of connection to server</td>
      <td>5.7.11</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-verify-server-cert</code></th>
      <td>Verify host name against server certificate Common Name identity</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tables</code></th>
      <td>Overrides the --databases or -B option</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tls-version</code></th>
      <td>Permissible TLS protocols for encrypted connections</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--use-frm</code></th>
      <td>For repair operations on MyISAM tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--user</code></th>
      <td>MySQL user name to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--verbose</code></th>
      <td>Verbose mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--version</code></th>
      <td>Display version information and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--write-binlog</code></th>
      <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

  Invoke `CHECK TABLE` with the `FOR UPGRADE` option to check tables for incompatibilities with the current version of the server. This option automatically enables the `--fix-db-names` and `--fix-table-names` options.

* `--compress`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck.">
  <col style="width: 27%"/>
  <col style="width: 50%"/>
  <col style="width: 11%"/>
  <col style="width: 11%"/>
  <thead>
    <tr>
      <th>Option Name</th>
      <th>Description</th>
      <th>Introduced</th>
      <th>Deprecated</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>--all-databases</code></th>
      <td>Check all tables in all databases</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--all-in-1</code></th>
      <td>Execute a single statement for each database that names all the tables from that database</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--analyze</code></th>
      <td>Analyze the tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--auto-repair</code></th>
      <td>If a checked table is corrupted, automatically fix it</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--bind-address</code></th>
      <td>Use specified network interface to connect to MySQL Server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--character-sets-dir</code></th>
      <td>Directory where character sets are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check</code></th>
      <td>Check the tables for errors</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check-only-changed</code></th>
      <td>Check only tables that have changed since the last check</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check-upgrade</code></th>
      <td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--compress</code></th>
      <td>Compress all information sent between client and server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--databases</code></th>
      <td>Interpret all arguments as database names</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug</code></th>
      <td>Write debugging log</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-check</code></th>
      <td>Print debugging information when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-info</code></th>
      <td>Print debugging information, memory, and CPU statistics when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-auth</code></th>
      <td>Authentication plugin to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-character-set</code></th>
      <td>Specify default character set</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-extra-file</code></th>
      <td>Read named option file in addition to usual option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-file</code></th>
      <td>Read only named option file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-group-suffix</code></th>
      <td>Option group suffix value</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--enable-cleartext-plugin</code></th>
      <td>Enable cleartext authentication plugin</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--extended</code></th>
      <td>Check and repair tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fast</code></th>
      <td>Check only tables that have not been closed properly</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fix-db-names</code></th>
      <td>Convert database names to 5.1 format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--fix-table-names</code></th>
      <td>Convert table names to 5.1 format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--force</code></th>
      <td>Continue even if an SQL error occurs</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--get-server-public-key</code></th>
      <td>Request RSA public key from server</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--help</code></th>
      <td>Display help message and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--host</code></th>
      <td>Host on which MySQL server is located</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--login-path</code></th>
      <td>Read login path options from .mylogin.cnf</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--medium-check</code></th>
      <td>Do a check that is faster than an --extended operation</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-defaults</code></th>
      <td>Read no option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--optimize</code></th>
      <td>Optimize the tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--password</code></th>
      <td>Password to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--pipe</code></th>
      <td>Connect to server using named pipe (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--plugin-dir</code></th>
      <td>Directory where plugins are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--port</code></th>
      <td>TCP/IP port number for connection</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--print-defaults</code></th>
      <td>Print default options</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--protocol</code></th>
      <td>Transport protocol to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--quick</code></th>
      <td>The fastest method of checking</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--repair</code></th>
      <td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--secure-auth</code></th>
      <td>Do not send passwords to server in old (pre-4.1) format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--server-public-key-path</code></th>
      <td>Path name to file containing RSA public key</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--shared-memory-base-name</code></th>
      <td>Shared-memory name for shared-memory connections (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--silent</code></th>
      <td>Silent mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-database</code></th>
      <td>Omit this database from performed operations</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--socket</code></th>
      <td>Unix socket file or Windows named pipe to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl</code></th>
      <td>Enable connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-ca</code></th>
      <td>File that contains list of trusted SSL Certificate Authorities</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-capath</code></th>
      <td>Directory that contains trusted SSL Certificate Authority certificate files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cert</code></th>
      <td>File that contains X.509 certificate</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cipher</code></th>
      <td>Permissible ciphers for connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crl</code></th>
      <td>File that contains certificate revocation lists</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crlpath</code></th>
      <td>Directory that contains certificate revocation-list files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-key</code></th>
      <td>File that contains X.509 key</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-mode</code></th>
      <td>Desired security state of connection to server</td>
      <td>5.7.11</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-verify-server-cert</code></th>
      <td>Verify host name against server certificate Common Name identity</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tables</code></th>
      <td>Overrides the --databases or -B option</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tls-version</code></th>
      <td>Permissible TLS protocols for encrypted connections</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--use-frm</code></th>
      <td>For repair operations on MyISAM tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--user</code></th>
      <td>MySQL user name to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--verbose</code></th>
      <td>Verbose mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--version</code></th>
      <td>Display version information and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--write-binlog</code></th>
      <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

  Compress all information sent between the client and the server if possible. See Section 4.2.6, “Connection Compression Control”.

* `--databases`, `-B`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck.">
  <col style="width: 27%"/>
  <col style="width: 50%"/>
  <col style="width: 11%"/>
  <col style="width: 11%"/>
  <thead>
    <tr>
      <th>Option Name</th>
      <th>Description</th>
      <th>Introduced</th>
      <th>Deprecated</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>--all-databases</code></th>
      <td>Check all tables in all databases</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--all-in-1</code></th>
      <td>Execute a single statement for each database that names all the tables from that database</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--analyze</code></th>
      <td>Analyze the tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--auto-repair</code></th>
      <td>If a checked table is corrupted, automatically fix it</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--bind-address</code></th>
      <td>Use specified network interface to connect to MySQL Server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--character-sets-dir</code></th>
      <td>Directory where character sets are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check</code></th>
      <td>Check the tables for errors</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check-only-changed</code></th>
      <td>Check only tables that have changed since the last check</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check-upgrade</code></th>
      <td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--compress</code></th>
      <td>Compress all information sent between client and server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--databases</code></th>
      <td>Interpret all arguments as database names</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug</code></th>
      <td>Write debugging log</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-check</code></th>
      <td>Print debugging information when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-info</code></th>
      <td>Print debugging information, memory, and CPU statistics when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-auth</code></th>
      <td>Authentication plugin to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-character-set</code></th>
      <td>Specify default character set</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-extra-file</code></th>
      <td>Read named option file in addition to usual option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-file</code></th>
      <td>Read only named option file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-group-suffix</code></th>
      <td>Option group suffix value</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--enable-cleartext-plugin</code></th>
      <td>Enable cleartext authentication plugin</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--extended</code></th>
      <td>Check and repair tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fast</code></th>
      <td>Check only tables that have not been closed properly</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fix-db-names</code></th>
      <td>Convert database names to 5.1 format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--fix-table-names</code></th>
      <td>Convert table names to 5.1 format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--force</code></th>
      <td>Continue even if an SQL error occurs</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--get-server-public-key</code></th>
      <td>Request RSA public key from server</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--help</code></th>
      <td>Display help message and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--host</code></th>
      <td>Host on which MySQL server is located</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--login-path</code></th>
      <td>Read login path options from .mylogin.cnf</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--medium-check</code></th>
      <td>Do a check that is faster than an --extended operation</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-defaults</code></th>
      <td>Read no option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--optimize</code></th>
      <td>Optimize the tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--password</code></th>
      <td>Password to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--pipe</code></th>
      <td>Connect to server using named pipe (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--plugin-dir</code></th>
      <td>Directory where plugins are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--port</code></th>
      <td>TCP/IP port number for connection</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--print-defaults</code></th>
      <td>Print default options</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--protocol</code></th>
      <td>Transport protocol to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--quick</code></th>
      <td>The fastest method of checking</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--repair</code></th>
      <td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--secure-auth</code></th>
      <td>Do not send passwords to server in old (pre-4.1) format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--server-public-key-path</code></th>
      <td>Path name to file containing RSA public key</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--shared-memory-base-name</code></th>
      <td>Shared-memory name for shared-memory connections (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--silent</code></th>
      <td>Silent mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-database</code></th>
      <td>Omit this database from performed operations</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--socket</code></th>
      <td>Unix socket file or Windows named pipe to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl</code></th>
      <td>Enable connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-ca</code></th>
      <td>File that contains list of trusted SSL Certificate Authorities</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-capath</code></th>
      <td>Directory that contains trusted SSL Certificate Authority certificate files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cert</code></th>
      <td>File that contains X.509 certificate</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cipher</code></th>
      <td>Permissible ciphers for connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crl</code></th>
      <td>File that contains certificate revocation lists</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crlpath</code></th>
      <td>Directory that contains certificate revocation-list files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-key</code></th>
      <td>File that contains X.509 key</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-mode</code></th>
      <td>Desired security state of connection to server</td>
      <td>5.7.11</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-verify-server-cert</code></th>
      <td>Verify host name against server certificate Common Name identity</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tables</code></th>
      <td>Overrides the --databases or -B option</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tls-version</code></th>
      <td>Permissible TLS protocols for encrypted connections</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--use-frm</code></th>
      <td>For repair operations on MyISAM tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--user</code></th>
      <td>MySQL user name to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--verbose</code></th>
      <td>Verbose mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--version</code></th>
      <td>Display version information and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--write-binlog</code></th>
      <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

  Process all tables in the named databases. Normally, **mysqlcheck** treats the first name argument on the command line as a database name and any following names as table names. With this option, it treats all name arguments as database names.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck.">
  <col style="width: 27%"/>
  <col style="width: 50%"/>
  <col style="width: 11%"/>
  <col style="width: 11%"/>
  <thead>
    <tr>
      <th>Option Name</th>
      <th>Description</th>
      <th>Introduced</th>
      <th>Deprecated</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>--all-databases</code></th>
      <td>Check all tables in all databases</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--all-in-1</code></th>
      <td>Execute a single statement for each database that names all the tables from that database</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--analyze</code></th>
      <td>Analyze the tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--auto-repair</code></th>
      <td>If a checked table is corrupted, automatically fix it</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--bind-address</code></th>
      <td>Use specified network interface to connect to MySQL Server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--character-sets-dir</code></th>
      <td>Directory where character sets are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check</code></th>
      <td>Check the tables for errors</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check-only-changed</code></th>
      <td>Check only tables that have changed since the last check</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check-upgrade</code></th>
      <td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--compress</code></th>
      <td>Compress all information sent between client and server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--databases</code></th>
      <td>Interpret all arguments as database names</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug</code></th>
      <td>Write debugging log</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-check</code></th>
      <td>Print debugging information when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-info</code></th>
      <td>Print debugging information, memory, and CPU statistics when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-auth</code></th>
      <td>Authentication plugin to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-character-set</code></th>
      <td>Specify default character set</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-extra-file</code></th>
      <td>Read named option file in addition to usual option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-file</code></th>
      <td>Read only named option file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-group-suffix</code></th>
      <td>Option group suffix value</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--enable-cleartext-plugin</code></th>
      <td>Enable cleartext authentication plugin</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--extended</code></th>
      <td>Check and repair tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fast</code></th>
      <td>Check only tables that have not been closed properly</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fix-db-names</code></th>
      <td>Convert database names to 5.1 format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--fix-table-names</code></th>
      <td>Convert table names to 5.1 format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--force</code></th>
      <td>Continue even if an SQL error occurs</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--get-server-public-key</code></th>
      <td>Request RSA public key from server</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--help</code></th>
      <td>Display help message and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--host</code></th>
      <td>Host on which MySQL server is located</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--login-path</code></th>
      <td>Read login path options from .mylogin.cnf</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--medium-check</code></th>
      <td>Do a check that is faster than an --extended operation</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-defaults</code></th>
      <td>Read no option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--optimize</code></th>
      <td>Optimize the tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--password</code></th>
      <td>Password to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--pipe</code></th>
      <td>Connect to server using named pipe (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--plugin-dir</code></th>
      <td>Directory where plugins are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--port</code></th>
      <td>TCP/IP port number for connection</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--print-defaults</code></th>
      <td>Print default options</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--protocol</code></th>
      <td>Transport protocol to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--quick</code></th>
      <td>The fastest method of checking</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--repair</code></th>
      <td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--secure-auth</code></th>
      <td>Do not send passwords to server in old (pre-4.1) format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--server-public-key-path</code></th>
      <td>Path name to file containing RSA public key</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--shared-memory-base-name</code></th>
      <td>Shared-memory name for shared-memory connections (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--silent</code></th>
      <td>Silent mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-database</code></th>
      <td>Omit this database from performed operations</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--socket</code></th>
      <td>Unix socket file or Windows named pipe to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl</code></th>
      <td>Enable connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-ca</code></th>
      <td>File that contains list of trusted SSL Certificate Authorities</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-capath</code></th>
      <td>Directory that contains trusted SSL Certificate Authority certificate files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cert</code></th>
      <td>File that contains X.509 certificate</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cipher</code></th>
      <td>Permissible ciphers for connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crl</code></th>
      <td>File that contains certificate revocation lists</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crlpath</code></th>
      <td>Directory that contains certificate revocation-list files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-key</code></th>
      <td>File that contains X.509 key</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-mode</code></th>
      <td>Desired security state of connection to server</td>
      <td>5.7.11</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-verify-server-cert</code></th>
      <td>Verify host name against server certificate Common Name identity</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tables</code></th>
      <td>Overrides the --databases or -B option</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tls-version</code></th>
      <td>Permissible TLS protocols for encrypted connections</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--use-frm</code></th>
      <td>For repair operations on MyISAM tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--user</code></th>
      <td>MySQL user name to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--verbose</code></th>
      <td>Verbose mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--version</code></th>
      <td>Display version information and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--write-binlog</code></th>
      <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:o`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-check`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck.">
  <col style="width: 27%"/>
  <col style="width: 50%"/>
  <col style="width: 11%"/>
  <col style="width: 11%"/>
  <thead>
    <tr>
      <th>Option Name</th>
      <th>Description</th>
      <th>Introduced</th>
      <th>Deprecated</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>--all-databases</code></th>
      <td>Check all tables in all databases</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--all-in-1</code></th>
      <td>Execute a single statement for each database that names all the tables from that database</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--analyze</code></th>
      <td>Analyze the tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--auto-repair</code></th>
      <td>If a checked table is corrupted, automatically fix it</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--bind-address</code></th>
      <td>Use specified network interface to connect to MySQL Server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--character-sets-dir</code></th>
      <td>Directory where character sets are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check</code></th>
      <td>Check the tables for errors</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check-only-changed</code></th>
      <td>Check only tables that have changed since the last check</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check-upgrade</code></th>
      <td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--compress</code></th>
      <td>Compress all information sent between client and server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--databases</code></th>
      <td>Interpret all arguments as database names</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug</code></th>
      <td>Write debugging log</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-check</code></th>
      <td>Print debugging information when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-info</code></th>
      <td>Print debugging information, memory, and CPU statistics when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-auth</code></th>
      <td>Authentication plugin to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-character-set</code></th>
      <td>Specify default character set</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-extra-file</code></th>
      <td>Read named option file in addition to usual option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-file</code></th>
      <td>Read only named option file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-group-suffix</code></th>
      <td>Option group suffix value</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--enable-cleartext-plugin</code></th>
      <td>Enable cleartext authentication plugin</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--extended</code></th>
      <td>Check and repair tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fast</code></th>
      <td>Check only tables that have not been closed properly</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fix-db-names</code></th>
      <td>Convert database names to 5.1 format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--fix-table-names</code></th>
      <td>Convert table names to 5.1 format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--force</code></th>
      <td>Continue even if an SQL error occurs</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--get-server-public-key</code></th>
      <td>Request RSA public key from server</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--help</code></th>
      <td>Display help message and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--host</code></th>
      <td>Host on which MySQL server is located</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--login-path</code></th>
      <td>Read login path options from .mylogin.cnf</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--medium-check</code></th>
      <td>Do a check that is faster than an --extended operation</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-defaults</code></th>
      <td>Read no option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--optimize</code></th>
      <td>Optimize the tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--password</code></th>
      <td>Password to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--pipe</code></th>
      <td>Connect to server using named pipe (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--plugin-dir</code></th>
      <td>Directory where plugins are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--port</code></th>
      <td>TCP/IP port number for connection</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--print-defaults</code></th>
      <td>Print default options</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--protocol</code></th>
      <td>Transport protocol to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--quick</code></th>
      <td>The fastest method of checking</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--repair</code></th>
      <td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--secure-auth</code></th>
      <td>Do not send passwords to server in old (pre-4.1) format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--server-public-key-path</code></th>
      <td>Path name to file containing RSA public key</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--shared-memory-base-name</code></th>
      <td>Shared-memory name for shared-memory connections (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--silent</code></th>
      <td>Silent mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-database</code></th>
      <td>Omit this database from performed operations</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--socket</code></th>
      <td>Unix socket file or Windows named pipe to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl</code></th>
      <td>Enable connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-ca</code></th>
      <td>File that contains list of trusted SSL Certificate Authorities</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-capath</code></th>
      <td>Directory that contains trusted SSL Certificate Authority certificate files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cert</code></th>
      <td>File that contains X.509 certificate</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cipher</code></th>
      <td>Permissible ciphers for connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crl</code></th>
      <td>File that contains certificate revocation lists</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crlpath</code></th>
      <td>Directory that contains certificate revocation-list files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-key</code></th>
      <td>File that contains X.509 key</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-mode</code></th>
      <td>Desired security state of connection to server</td>
      <td>5.7.11</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-verify-server-cert</code></th>
      <td>Verify host name against server certificate Common Name identity</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tables</code></th>
      <td>Overrides the --databases or -B option</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tls-version</code></th>
      <td>Permissible TLS protocols for encrypted connections</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--use-frm</code></th>
      <td>For repair operations on MyISAM tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--user</code></th>
      <td>MySQL user name to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--verbose</code></th>
      <td>Verbose mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--version</code></th>
      <td>Display version information and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--write-binlog</code></th>
      <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-info`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck.">
  <col style="width: 27%"/>
  <col style="width: 50%"/>
  <col style="width: 11%"/>
  <col style="width: 11%"/>
  <thead>
    <tr>
      <th>Option Name</th>
      <th>Description</th>
      <th>Introduced</th>
      <th>Deprecated</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>--all-databases</code></th>
      <td>Check all tables in all databases</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--all-in-1</code></th>
      <td>Execute a single statement for each database that names all the tables from that database</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--analyze</code></th>
      <td>Analyze the tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--auto-repair</code></th>
      <td>If a checked table is corrupted, automatically fix it</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--bind-address</code></th>
      <td>Use specified network interface to connect to MySQL Server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--character-sets-dir</code></th>
      <td>Directory where character sets are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check</code></th>
      <td>Check the tables for errors</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check-only-changed</code></th>
      <td>Check only tables that have changed since the last check</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check-upgrade</code></th>
      <td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--compress</code></th>
      <td>Compress all information sent between client and server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--databases</code></th>
      <td>Interpret all arguments as database names</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug</code></th>
      <td>Write debugging log</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-check</code></th>
      <td>Print debugging information when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-info</code></th>
      <td>Print debugging information, memory, and CPU statistics when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-auth</code></th>
      <td>Authentication plugin to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-character-set</code></th>
      <td>Specify default character set</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-extra-file</code></th>
      <td>Read named option file in addition to usual option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-file</code></th>
      <td>Read only named option file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-group-suffix</code></th>
      <td>Option group suffix value</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--enable-cleartext-plugin</code></th>
      <td>Enable cleartext authentication plugin</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--extended</code></th>
      <td>Check and repair tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fast</code></th>
      <td>Check only tables that have not been closed properly</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fix-db-names</code></th>
      <td>Convert database names to 5.1 format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--fix-table-names</code></th>
      <td>Convert table names to 5.1 format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--force</code></th>
      <td>Continue even if an SQL error occurs</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--get-server-public-key</code></th>
      <td>Request RSA public key from server</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--help</code></th>
      <td>Display help message and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--host</code></th>
      <td>Host on which MySQL server is located</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--login-path</code></th>
      <td>Read login path options from .mylogin.cnf</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--medium-check</code></th>
      <td>Do a check that is faster than an --extended operation</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-defaults</code></th>
      <td>Read no option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--optimize</code></th>
      <td>Optimize the tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--password</code></th>
      <td>Password to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--pipe</code></th>
      <td>Connect to server using named pipe (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--plugin-dir</code></th>
      <td>Directory where plugins are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--port</code></th>
      <td>TCP/IP port number for connection</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--print-defaults</code></th>
      <td>Print default options</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--protocol</code></th>
      <td>Transport protocol to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--quick</code></th>
      <td>The fastest method of checking</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--repair</code></th>
      <td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--secure-auth</code></th>
      <td>Do not send passwords to server in old (pre-4.1) format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--server-public-key-path</code></th>
      <td>Path name to file containing RSA public key</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--shared-memory-base-name</code></th>
      <td>Shared-memory name for shared-memory connections (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--silent</code></th>
      <td>Silent mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-database</code></th>
      <td>Omit this database from performed operations</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--socket</code></th>
      <td>Unix socket file or Windows named pipe to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl</code></th>
      <td>Enable connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-ca</code></th>
      <td>File that contains list of trusted SSL Certificate Authorities</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-capath</code></th>
      <td>Directory that contains trusted SSL Certificate Authority certificate files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cert</code></th>
      <td>File that contains X.509 certificate</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cipher</code></th>
      <td>Permissible ciphers for connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crl</code></th>
      <td>File that contains certificate revocation lists</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crlpath</code></th>
      <td>Directory that contains certificate revocation-list files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-key</code></th>
      <td>File that contains X.509 key</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-mode</code></th>
      <td>Desired security state of connection to server</td>
      <td>5.7.11</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-verify-server-cert</code></th>
      <td>Verify host name against server certificate Common Name identity</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tables</code></th>
      <td>Overrides the --databases or -B option</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tls-version</code></th>
      <td>Permissible TLS protocols for encrypted connections</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--use-frm</code></th>
      <td>For repair operations on MyISAM tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--user</code></th>
      <td>MySQL user name to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--verbose</code></th>
      <td>Verbose mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--version</code></th>
      <td>Display version information and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--write-binlog</code></th>
      <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

  Print debugging information and memory and CPU usage statistics when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck.">
  <col style="width: 27%"/>
  <col style="width: 50%"/>
  <col style="width: 11%"/>
  <col style="width: 11%"/>
  <thead>
    <tr>
      <th>Option Name</th>
      <th>Description</th>
      <th>Introduced</th>
      <th>Deprecated</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>--all-databases</code></th>
      <td>Check all tables in all databases</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--all-in-1</code></th>
      <td>Execute a single statement for each database that names all the tables from that database</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--analyze</code></th>
      <td>Analyze the tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--auto-repair</code></th>
      <td>If a checked table is corrupted, automatically fix it</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--bind-address</code></th>
      <td>Use specified network interface to connect to MySQL Server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--character-sets-dir</code></th>
      <td>Directory where character sets are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check</code></th>
      <td>Check the tables for errors</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check-only-changed</code></th>
      <td>Check only tables that have changed since the last check</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check-upgrade</code></th>
      <td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--compress</code></th>
      <td>Compress all information sent between client and server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--databases</code></th>
      <td>Interpret all arguments as database names</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug</code></th>
      <td>Write debugging log</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-check</code></th>
      <td>Print debugging information when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-info</code></th>
      <td>Print debugging information, memory, and CPU statistics when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-auth</code></th>
      <td>Authentication plugin to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-character-set</code></th>
      <td>Specify default character set</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-extra-file</code></th>
      <td>Read named option file in addition to usual option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-file</code></th>
      <td>Read only named option file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-group-suffix</code></th>
      <td>Option group suffix value</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--enable-cleartext-plugin</code></th>
      <td>Enable cleartext authentication plugin</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--extended</code></th>
      <td>Check and repair tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fast</code></th>
      <td>Check only tables that have not been closed properly</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fix-db-names</code></th>
      <td>Convert database names to 5.1 format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--fix-table-names</code></th>
      <td>Convert table names to 5.1 format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--force</code></th>
      <td>Continue even if an SQL error occurs</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--get-server-public-key</code></th>
      <td>Request RSA public key from server</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--help</code></th>
      <td>Display help message and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--host</code></th>
      <td>Host on which MySQL server is located</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--login-path</code></th>
      <td>Read login path options from .mylogin.cnf</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--medium-check</code></th>
      <td>Do a check that is faster than an --extended operation</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-defaults</code></th>
      <td>Read no option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--optimize</code></th>
      <td>Optimize the tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--password</code></th>
      <td>Password to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--pipe</code></th>
      <td>Connect to server using named pipe (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--plugin-dir</code></th>
      <td>Directory where plugins are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--port</code></th>
      <td>TCP/IP port number for connection</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--print-defaults</code></th>
      <td>Print default options</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--protocol</code></th>
      <td>Transport protocol to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--quick</code></th>
      <td>The fastest method of checking</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--repair</code></th>
      <td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--secure-auth</code></th>
      <td>Do not send passwords to server in old (pre-4.1) format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--server-public-key-path</code></th>
      <td>Path name to file containing RSA public key</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--shared-memory-base-name</code></th>
      <td>Shared-memory name for shared-memory connections (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--silent</code></th>
      <td>Silent mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-database</code></th>
      <td>Omit this database from performed operations</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--socket</code></th>
      <td>Unix socket file or Windows named pipe to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl</code></th>
      <td>Enable connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-ca</code></th>
      <td>File that contains list of trusted SSL Certificate Authorities</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-capath</code></th>
      <td>Directory that contains trusted SSL Certificate Authority certificate files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cert</code></th>
      <td>File that contains X.509 certificate</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cipher</code></th>
      <td>Permissible ciphers for connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crl</code></th>
      <td>File that contains certificate revocation lists</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crlpath</code></th>
      <td>Directory that contains certificate revocation-list files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-key</code></th>
      <td>File that contains X.509 key</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-mode</code></th>
      <td>Desired security state of connection to server</td>
      <td>5.7.11</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-verify-server-cert</code></th>
      <td>Verify host name against server certificate Common Name identity</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tables</code></th>
      <td>Overrides the --databases or -B option</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tls-version</code></th>
      <td>Permissible TLS protocols for encrypted connections</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--use-frm</code></th>
      <td>For repair operations on MyISAM tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--user</code></th>
      <td>MySQL user name to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--verbose</code></th>
      <td>Verbose mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--version</code></th>
      <td>Display version information and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--write-binlog</code></th>
      <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

  Use *`charset_name`* as the default character set. See Section 10.15, “Character Set Configuration”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck.">
  <col style="width: 27%"/>
  <col style="width: 50%"/>
  <col style="width: 11%"/>
  <col style="width: 11%"/>
  <thead>
    <tr>
      <th>Option Name</th>
      <th>Description</th>
      <th>Introduced</th>
      <th>Deprecated</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>--all-databases</code></th>
      <td>Check all tables in all databases</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--all-in-1</code></th>
      <td>Execute a single statement for each database that names all the tables from that database</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--analyze</code></th>
      <td>Analyze the tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--auto-repair</code></th>
      <td>If a checked table is corrupted, automatically fix it</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--bind-address</code></th>
      <td>Use specified network interface to connect to MySQL Server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--character-sets-dir</code></th>
      <td>Directory where character sets are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check</code></th>
      <td>Check the tables for errors</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check-only-changed</code></th>
      <td>Check only tables that have changed since the last check</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check-upgrade</code></th>
      <td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--compress</code></th>
      <td>Compress all information sent between client and server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--databases</code></th>
      <td>Interpret all arguments as database names</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug</code></th>
      <td>Write debugging log</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-check</code></th>
      <td>Print debugging information when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-info</code></th>
      <td>Print debugging information, memory, and CPU statistics when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-auth</code></th>
      <td>Authentication plugin to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-character-set</code></th>
      <td>Specify default character set</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-extra-file</code></th>
      <td>Read named option file in addition to usual option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-file</code></th>
      <td>Read only named option file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-group-suffix</code></th>
      <td>Option group suffix value</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--enable-cleartext-plugin</code></th>
      <td>Enable cleartext authentication plugin</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--extended</code></th>
      <td>Check and repair tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fast</code></th>
      <td>Check only tables that have not been closed properly</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fix-db-names</code></th>
      <td>Convert database names to 5.1 format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--fix-table-names</code></th>
      <td>Convert table names to 5.1 format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--force</code></th>
      <td>Continue even if an SQL error occurs</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--get-server-public-key</code></th>
      <td>Request RSA public key from server</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--help</code></th>
      <td>Display help message and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--host</code></th>
      <td>Host on which MySQL server is located</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--login-path</code></th>
      <td>Read login path options from .mylogin.cnf</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--medium-check</code></th>
      <td>Do a check that is faster than an --extended operation</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-defaults</code></th>
      <td>Read no option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--optimize</code></th>
      <td>Optimize the tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--password</code></th>
      <td>Password to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--pipe</code></th>
      <td>Connect to server using named pipe (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--plugin-dir</code></th>
      <td>Directory where plugins are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--port</code></th>
      <td>TCP/IP port number for connection</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--print-defaults</code></th>
      <td>Print default options</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--protocol</code></th>
      <td>Transport protocol to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--quick</code></th>
      <td>The fastest method of checking</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--repair</code></th>
      <td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--secure-auth</code></th>
      <td>Do not send passwords to server in old (pre-4.1) format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--server-public-key-path</code></th>
      <td>Path name to file containing RSA public key</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--shared-memory-base-name</code></th>
      <td>Shared-memory name for shared-memory connections (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--silent</code></th>
      <td>Silent mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-database</code></th>
      <td>Omit this database from performed operations</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--socket</code></th>
      <td>Unix socket file or Windows named pipe to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl</code></th>
      <td>Enable connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-ca</code></th>
      <td>File that contains list of trusted SSL Certificate Authorities</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-capath</code></th>
      <td>Directory that contains trusted SSL Certificate Authority certificate files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cert</code></th>
      <td>File that contains X.509 certificate</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cipher</code></th>
      <td>Permissible ciphers for connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crl</code></th>
      <td>File that contains certificate revocation lists</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crlpath</code></th>
      <td>Directory that contains certificate revocation-list files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-key</code></th>
      <td>File that contains X.509 key</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-mode</code></th>
      <td>Desired security state of connection to server</td>
      <td>5.7.11</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-verify-server-cert</code></th>
      <td>Verify host name against server certificate Common Name identity</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tables</code></th>
      <td>Overrides the --databases or -B option</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tls-version</code></th>
      <td>Permissible TLS protocols for encrypted connections</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--use-frm</code></th>
      <td>For repair operations on MyISAM tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--user</code></th>
      <td>MySQL user name to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--verbose</code></th>
      <td>Verbose mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--version</code></th>
      <td>Display version information and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--write-binlog</code></th>
      <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck.">
  <col style="width: 27%"/>
  <col style="width: 50%"/>
  <col style="width: 11%"/>
  <col style="width: 11%"/>
  <thead>
    <tr>
      <th>Option Name</th>
      <th>Description</th>
      <th>Introduced</th>
      <th>Deprecated</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>--all-databases</code></th>
      <td>Check all tables in all databases</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--all-in-1</code></th>
      <td>Execute a single statement for each database that names all the tables from that database</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--analyze</code></th>
      <td>Analyze the tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--auto-repair</code></th>
      <td>If a checked table is corrupted, automatically fix it</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--bind-address</code></th>
      <td>Use specified network interface to connect to MySQL Server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--character-sets-dir</code></th>
      <td>Directory where character sets are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check</code></th>
      <td>Check the tables for errors</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check-only-changed</code></th>
      <td>Check only tables that have changed since the last check</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--check-upgrade</code></th>
      <td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--compress</code></th>
      <td>Compress all information sent between client and server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--databases</code></th>
      <td>Interpret all arguments as database names</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug</code></th>
      <td>Write debugging log</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-check</code></th>
      <td>Print debugging information when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-info</code></th>
      <td>Print debugging information, memory, and CPU statistics when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-auth</code></th>
      <td>Authentication plugin to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-character-set</code></th>
      <td>Specify default character set</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-extra-file</code></th>
      <td>Read named option file in addition to usual option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-file</code></th>
      <td>Read only named option file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-group-suffix</code></th>
      <td>Option group suffix value</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--enable-cleartext-plugin</code></th>
      <td>Enable cleartext authentication plugin</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--extended</code></th>
      <td>Check and repair tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fast</code></th>
      <td>Check only tables that have not been closed properly</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fix-db-names</code></th>
      <td>Convert database names to 5.1 format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--fix-table-names</code></th>
      <td>Convert table names to 5.1 format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--force</code></th>
      <td>Continue even if an SQL error occurs</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--get-server-public-key</code></th>
      <td>Request RSA public key from server</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--help</code></th>
      <td>Display help message and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--host</code></th>
      <td>Host on which MySQL server is located</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--login-path</code></th>
      <td>Read login path options from .mylogin.cnf</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--medium-check</code></th>
      <td>Do a check that is faster than an --extended operation</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-defaults</code></th>
      <td>Read no option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--optimize</code></th>
      <td>Optimize the tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--password</code></th>
      <td>Password to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--pipe</code></th>
      <td>Connect to server using named pipe (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--plugin-dir</code></th>
      <td>Directory where plugins are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--port</code></th>
      <td>TCP/IP port number for connection</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--print-defaults</code></th>
      <td>Print default options</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--protocol</code></th>
      <td>Transport protocol to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--quick</code></th>
      <td>The fastest method of checking</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--repair</code></th>
      <td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--secure-auth</code></th>
      <td>Do not send passwords to server in old (pre-4.1) format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--server-public-key-path</code></th>
      <td>Path name to file containing RSA public key</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--shared-memory-base-name</code></th>
      <td>Shared-memory name for shared-memory connections (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--silent</code></th>
      <td>Silent mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-database</code></th>
      <td>Omit this database from performed operations</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--socket</code></th>
      <td>Unix socket file or Windows named pipe to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl</code></th>
      <td>Enable connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-ca</code></th>
      <td>File that contains list of trusted SSL Certificate Authorities</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-capath</code></th>
      <td>Directory that contains trusted SSL Certificate Authority certificate files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cert</code></th>
      <td>File that contains X.509 certificate</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cipher</code></th>
      <td>Permissible ciphers for connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crl</code></th>
      <td>File that contains certificate revocation lists</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crlpath</code></th>
      <td>Directory that contains certificate revocation-list files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-key</code></th>
      <td>File that contains X.509 key</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-mode</code></th>
      <td>Desired security state of connection to server</td>
      <td>5.7.11</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-verify-server-cert</code></th>
      <td>Verify host name against server certificate Common Name identity</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tables</code></th>
      <td>Overrides the --databases or -B option</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tls-version</code></th>
      <td>Permissible TLS protocols for encrypted connections</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--use-frm</code></th>
      <td>For repair operations on MyISAM tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--user</code></th>
      <td>MySQL user name to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--verbose</code></th>
      <td>Verbose mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--version</code></th>
      <td>Display version information and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--write-binlog</code></th>
      <td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysqlcheck** normally reads the `[client]` and `[mysqlcheck]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysqlcheck** also reads the `[client_other]` and `[mysqlcheck_other]` groups.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--extended`, `-e`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  If you are using this option to check tables, it ensures that they are 100% consistent but takes a long time.

  If you are using this option to repair tables, it runs an extended repair that may not only take a long time to execute, but may produce a lot of garbage rows also!

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  A hint about which client-side authentication plugin to use. See Section 6.2.13, “Pluggable Authentication”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Enable the `mysql_clear_password` cleartext authentication plugin. (See Section 6.4.1.6, “Client-Side Cleartext Pluggable Authentication”.)

  This option was added in MySQL 5.7.10.

* `--fast`, `-F`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Check only tables that have not been closed properly.

* `--fix-db-names`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Convert database names to 5.1 format. Only database names that contain special characters are affected.

  This option is deprecated in MySQL 5.7.6; expect it to be removed in a future version of MySQL. If it is necessary to convert MySQL 5.0 database or table names, a workaround is to upgrade a MySQL 5.0 installation to MySQL 5.1 before upgrading to a more recent release.

* `--fix-table-names`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Convert table names to 5.1 format. Only table names that contain special characters are affected. This option also applies to views.

  This option is deprecated in MySQL 5.7.6; expect it to be removed in a future version of MySQL. If it is necessary to convert MySQL 5.0 database or table names, a workaround is to upgrade a MySQL 5.0 installation to MySQL 5.1 before upgrading to a more recent release.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Continue even if an SQL error occurs.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Request from the server the public key required for RSA key pair-based password exchange. This option applies to clients that authenticate with the ``caching_sha2_password`` authentication plugin. For that plugin, the server does not send the public key unless requested. This option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the ``caching_sha2_password`` plugin, see Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  The `--get-server-public-key` option was added in MySQL 5.7.23.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Connect to the MySQL server on the given host.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--medium-check`, `-m`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  Do a check that is faster than an `--extended` operation. This finds only 99.99% of all errors, which should be good enough in most cases.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--optimize`, `-o`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  Optimize the tables.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqlcheck** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 6.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqlcheck** should not prompt for one, use the `--skip-password` option.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  On Windows, connect to the server using a named pipe. This option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysqlcheck** does not find it. See Section 6.2.13, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  For TCP/IP connections, the port number to use.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 4.2.5, “Connection Transport Protocols”.

* `--quick`, `-q`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>

  If you are using this option to check tables, it prevents the check from scanning the rows to check for incorrect links. This is the fastest check method.

  If you are using this option to repair tables, it tries to repair only the index tree. This is the fastest repair method.

* `--repair`, `-r`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>

  Perform a repair that can fix almost anything except unique keys that are not unique.

* `--secure-auth`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>

  Do not send passwords to the server in old (pre-4.1) format. This prevents connections except for servers that use the newer password format.

  As of MySQL 5.7.5, this option is deprecated; expect it to be removed in a future MySQL release. It is always enabled and attempting to disable it (`--skip-secure-auth`, `--secure-auth=0`) produces an error. Before MySQL 5.7.5, this option is enabled by default but can be disabled.

  Note

  Passwords that use the pre-4.1 hashing method are less secure than passwords that use the native password hashing method and should be avoided. Pre-4.1 passwords are deprecated and support for them was removed in MySQL 5.7.5. For account upgrade instructions, see Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql\_old\_password Plugin”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or ``caching_sha2_password`` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and ``caching_sha2_password`` plugins, see Section 6.4.1.5, “SHA-256 Pluggable Authentication”, and Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  The `--server-public-key-path` option was added in MySQL 5.7.23.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>

  On Windows, the shared-memory name to use for connections made using shared memory to a local server. The default value is `MYSQL`. The shared-memory name is case-sensitive.

  This option applies only if the server was started with the `shared_memory` system variable enabled to support shared-memory connections.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>

  Silent mode. Print only error messages.

* `--skip-database=db_name`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>6

  Do not include the named database (case-sensitive) in the operations performed by **mysqlcheck**.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--tables`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>

  Override the `--databases` or `-B` option. All name arguments following the option are regarded as table names.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-in-1</code></td> </tr></tbody></table>

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 5.7.10.

* `--use-frm`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>

  For repair operations on `MyISAM` tables, get the table structure from the `.frm` file so that the table can be repaired even if the `.MYI` header is corrupted.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>

  The user name of the MySQL account to use for connecting to the server.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>

  Verbose mode. Print information about the various stages of program operation.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>

  Display version information and exit.

* `--write-binlog`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--analyze</code></td> </tr></tbody></table>

  This option is enabled by default, so that `ANALYZE TABLE`, `OPTIMIZE TABLE`, and `REPAIR TABLE` statements generated by **mysqlcheck** are written to the binary log. Use `--skip-write-binlog` to cause `NO_WRITE_TO_BINLOG` to be added to the statements so that they are not logged. Use the `--skip-write-binlog` when these statements should not be sent to replicas or run when using the binary logs for recovery from backup.

### 4.5.4 mysqldump — A Database Backup Program

The **mysqldump** client utility performs logical backups, producing a set of SQL statements that can be executed to reproduce the original database object definitions and table data. It dumps one or more MySQL databases for backup or transfer to another SQL server. The **mysqldump** command can also generate output in CSV, other delimited text, or XML format.

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

**mysqldump** requires at least the `SELECT` privilege for dumped tables, `SHOW VIEW` for dumped views, `TRIGGER` for dumped triggers, `LOCK TABLES` if the `--single-transaction` option is not used, and (as of MySQL 5.7.31) `PROCESS` if the `--no-tablespaces` option is not used. Certain options might require other privileges as noted in the option descriptions.

To reload a dump file, you must have the privileges required to execute the statements that it contains, such as the appropriate `CREATE` privileges for objects created by those statements.

**mysqldump** output can include `ALTER DATABASE` statements that change the database collation. These may be used when dumping stored programs to preserve their character encodings. To reload a dump file containing such statements, the `ALTER` privilege for the affected database is required.

Note

A dump made using PowerShell on Windows with output redirection creates a file that has UTF-16 encoding:

```sql
mysqldump [options] > dump.sql
```

However, UTF-16 is not permitted as a connection character set (see Impermissible Client Character Sets), so the dump file cannot be loaded correctly. To work around this issue, use the `--result-file` option, which creates the output in ASCII format:

```sql
mysqldump [options] --result-file=dump.sql
```

It is not recommended to load a dump file when GTIDs are enabled on the server (`gtid_mode=ON`), if your dump file includes system tables. **mysqldump** issues DML instructions for the system tables which use the non-transactional MyISAM storage engine, and this combination is not permitted when GTIDs are enabled.

#### Performance and Scalability Considerations

`mysqldump` advantages include the convenience and flexibility of viewing or even editing the output before restoring. You can clone databases for development and DBA work, or produce slight variations of an existing database for testing. It is not intended as a fast or scalable solution for backing up substantial amounts of data. With large data sizes, even if the backup step takes a reasonable time, restoring the data can be very slow because replaying the SQL statements involves disk I/O for insertion, index creation, and so on.

For large-scale backup and restore, a physical backup is more appropriate, to copy the data files in their original format that can be restored quickly:

* If your tables are primarily `InnoDB` tables, or if you have a mix of `InnoDB` and `MyISAM` tables, consider using the **mysqlbackup** command of the MySQL Enterprise Backup product. (Available as part of the Enterprise subscription.) It provides the best performance for `InnoDB` backups with minimal disruption; it can also back up tables from `MyISAM` and other storage engines; and it provides a number of convenient options to accommodate different backup scenarios. See Section 28.1, “MySQL Enterprise Backup Overview”.

**mysqldump** can retrieve and dump table contents row by row, or it can retrieve the entire content from a table and buffer it in memory before dumping it. Buffering in memory can be a problem if you are dumping large tables. To dump tables row by row, use the `--quick` option (or `--opt`, which enables `--quick`). The `--opt` option (and hence `--quick`) is enabled by default, so to enable memory buffering, use `--skip-quick`.

If you are using a recent version of **mysqldump** to generate a dump to be reloaded into a very old MySQL server, use the `--skip-opt` option instead of the `--opt` or `--extended-insert` option.

For additional information about **mysqldump**, see Section 7.4, “Using mysqldump for Backups”.

#### Invocation Syntax

There are in general three ways to use **mysqldump**—in order to dump a set of one or more tables, a set of one or more complete databases, or an entire MySQL server—as shown here:

```sql
mysqldump [options] db_name [tbl_name ...]
mysqldump [options] --databases db_name ...
mysqldump [options] --all-databases
```

To dump entire databases, do not name any tables following *`db_name`*, or use the `--databases` or `--all-databases` option.

To see a list of the options your version of **mysqldump** supports, issue the command **mysqldump --help**.

#### Option Syntax - Alphabetical Summary

**mysqldump** supports the following options, which can be specified on the command line or in the `[mysqldump]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see Section 4.2.2.2, “Using Option Files”.

**Table 4.16 mysqldump Options**

<table frame="box" rules="all" summary="Command-line options available for mysqldump.">
  <col style="width: 27%"/>
  <col style="width: 50%"/>
  <col style="width: 11%"/>
  <col style="width: 11%"/>
  <thead>
    <tr>
      <th>Option Name</th>
      <th>Description</th>
      <th>Introduced</th>
      <th>Deprecated</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>--add-drop-database</code></th>
      <td>Add DROP DATABASE statement before each CREATE DATABASE statement</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--add-drop-table</code></th>
      <td>Add DROP TABLE statement before each CREATE TABLE statement</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--add-drop-trigger</code></th>
      <td>Add DROP TRIGGER statement before each CREATE TRIGGER statement</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--add-locks</code></th>
      <td>Surround each table dump with LOCK TABLES and UNLOCK TABLES statements</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--all-databases</code></th>
      <td>Dump all tables in all databases</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--allow-keywords</code></th>
      <td>Allow creation of column names that are keywords</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--apply-slave-statements</code></th>
      <td>Include STOP SLAVE prior to CHANGE MASTER statement and START SLAVE at end of output</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--bind-address</code></th>
      <td>Use specified network interface to connect to MySQL Server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--character-sets-dir</code></th>
      <td>Directory where character sets are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--comments</code></th>
      <td>Add comments to dump file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--compact</code></th>
      <td>Produce more compact output</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--compatible</code></th>
      <td>Produce output that is more compatible with other database systems or with older MySQL servers</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--complete-insert</code></th>
      <td>Use complete INSERT statements that include column names</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--compress</code></th>
      <td>Compress all information sent between client and server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--create-options</code></th>
      <td>Include all MySQL-specific table options in CREATE TABLE statements</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--databases</code></th>
      <td>Interpret all name arguments as database names</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug</code></th>
      <td>Write debugging log</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-check</code></th>
      <td>Print debugging information when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-info</code></th>
      <td>Print debugging information, memory, and CPU statistics when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-auth</code></th>
      <td>Authentication plugin to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-character-set</code></th>
      <td>Specify default character set</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-extra-file</code></th>
      <td>Read named option file in addition to usual option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-file</code></th>
      <td>Read only named option file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-group-suffix</code></th>
      <td>Option group suffix value</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--delete-master-logs</code></th>
      <td>On a replication source server, delete the binary logs after performing the dump operation</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--disable-keys</code></th>
      <td>For each table, surround INSERT statements with statements to disable and enable keys</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--dump-date</code></th>
      <td>Include dump date as "Dump completed on" comment if --comments is given</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--dump-slave</code></th>
      <td>Include CHANGE MASTER statement that lists binary log coordinates of replica's source</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--enable-cleartext-plugin</code></th>
      <td>Enable cleartext authentication plugin</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--events</code></th>
      <td>Dump events from dumped databases</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--extended-insert</code></th>
      <td>Use multiple-row INSERT syntax</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fields-enclosed-by</code></th>
      <td>This option is used with the --tab option and has the same meaning as the corresponding clause for LOAD DATA</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fields-escaped-by</code></th>
      <td>This option is used with the --tab option and has the same meaning as the corresponding clause for LOAD DATA</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fields-optionally-enclosed-by</code></th>
      <td>This option is used with the --tab option and has the same meaning as the corresponding clause for LOAD DATA</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fields-terminated-by</code></th>
      <td>This option is used with the --tab option and has the same meaning as the corresponding clause for LOAD DATA</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--flush-logs</code></th>
      <td>Flush MySQL server log files before starting dump</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--flush-privileges</code></th>
      <td>Emit a FLUSH PRIVILEGES statement after dumping mysql database</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--force</code></th>
      <td>Continue even if an SQL error occurs during a table dump</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--get-server-public-key</code></th>
      <td>Request RSA public key from server</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--help</code></th>
      <td>Display help message and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--hex-blob</code></th>
      <td>Dump binary columns using hexadecimal notation</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--host</code></th>
      <td>Host on which MySQL server is located</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ignore-error</code></th>
      <td>Ignore specified errors</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ignore-table</code></th>
      <td>Do not dump given table</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--include-master-host-port</code></th>
      <td>Include MASTER_HOST/MASTER_PORT options in CHANGE MASTER statement produced with --dump-slave</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--insert-ignore</code></th>
      <td>Write INSERT IGNORE rather than INSERT statements</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--lines-terminated-by</code></th>
      <td>This option is used with the --tab option and has the same meaning as the corresponding clause for LOAD DATA</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--lock-all-tables</code></th>
      <td>Lock all tables across all databases</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--lock-tables</code></th>
      <td>Lock all tables before dumping them</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--log-error</code></th>
      <td>Append warnings and errors to named file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--login-path</code></th>
      <td>Read login path options from .mylogin.cnf</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--master-data</code></th>
      <td>Write the binary log file name and position to the output</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--max-allowed-packet</code></th>
      <td>Maximum packet length to send to or receive from server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--net-buffer-length</code></th>
      <td>Buffer size for TCP/IP and socket communication</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-autocommit</code></th>
      <td>Enclose the INSERT statements for each dumped table within SET autocommit = 0 and COMMIT statements</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-create-db</code></th>
      <td>Do not write CREATE DATABASE statements</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-create-info</code></th>
      <td>Do not write CREATE TABLE statements that re-create each dumped table</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-data</code></th>
      <td>Do not dump table contents</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-defaults</code></th>
      <td>Read no option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-set-names</code></th>
      <td>Same as --skip-set-charset</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-tablespaces</code></th>
      <td>Do not write any CREATE LOGFILE GROUP or CREATE TABLESPACE statements in output</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--opt</code></th>
      <td>Shorthand for --add-drop-table --add-locks --create-options --disable-keys --extended-insert --lock-tables --quick --set-charset</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--order-by-primary</code></th>
      <td>Dump each table's rows sorted by its primary key, or by its first unique index</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--password</code></th>
      <td>Password to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--pipe</code></th>
      <td>Connect to server using named pipe (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--plugin-dir</code></th>
      <td>Directory where plugins are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--port</code></th>
      <td>TCP/IP port number for connection</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--print-defaults</code></th>
      <td>Print default options</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--protocol</code></th>
      <td>Transport protocol to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--quick</code></th>
      <td>Retrieve rows for a table from the server a row at a time</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--quote-names</code></th>
      <td>Quote identifiers within backtick characters</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--replace</code></th>
      <td>Write REPLACE statements rather than INSERT statements</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--result-file</code></th>
      <td>Direct output to a given file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--routines</code></th>
      <td>Dump stored routines (procedures and functions) from dumped databases</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--secure-auth</code></th>
      <td>Do not send passwords to server in old (pre-4.1) format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--server-public-key-path</code></th>
      <td>Path name to file containing RSA public key</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--set-charset</code></th>
      <td>Add SET NAMES default_character_set to output</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--set-gtid-purged</code></th>
      <td>Whether to add SET @@GLOBAL.GTID_PURGED to output</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--shared-memory-base-name</code></th>
      <td>Shared-memory name for shared-memory connections (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--single-transaction</code></th>
      <td>Issue a BEGIN SQL statement before dumping data from server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-add-drop-table</code></th>
      <td>Do not add a DROP TABLE statement before each CREATE TABLE statement</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-add-locks</code></th>
      <td>Do not add locks</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-comments</code></th>
      <td>Do not add comments to dump file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-compact</code></th>
      <td>Do not produce more compact output</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-disable-keys</code></th>
      <td>Do not disable keys</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-extended-insert</code></th>
      <td>Turn off extended-insert</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-mysql-schema</code></th>
      <td>Do not drop the mysql schema</td>
      <td>5.7.36</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-opt</code></th>
      <td>Turn off options set by --opt</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-quick</code></th>
      <td>Do not retrieve rows for a table from the server a row at a time</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-quote-names</code></th>
      <td>Do not quote identifiers</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-set-charset</code></th>
      <td>Do not write SET NAMES statement</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-triggers</code></th>
      <td>Do not dump triggers</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-tz-utc</code></th>
      <td>Turn off tz-utc</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--socket</code></th>
      <td>Unix socket file or Windows named pipe to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl</code></th>
      <td>Enable connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-ca</code></th>
      <td>File that contains list of trusted SSL Certificate Authorities</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-capath</code></th>
      <td>Directory that contains trusted SSL Certificate Authority certificate files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cert</code></th>
      <td>File that contains X.509 certificate</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cipher</code></th>
      <td>Permissible ciphers for connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crl</code></th>
      <td>File that contains certificate revocation lists</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crlpath</code></th>
      <td>Directory that contains certificate revocation-list files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-key</code></th>
      <td>File that contains X.509 key</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-mode</code></th>
      <td>Desired security state of connection to server</td>
      <td>5.7.11</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-verify-server-cert</code></th>
      <td>Verify host name against server certificate Common Name identity</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tab</code></th>
      <td>Produce tab-separated data files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tables</code></th>
      <td>Override --databases or -B option</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tls-version</code></th>
      <td>Permissible TLS protocols for encrypted connections</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--triggers</code></th>
      <td>Dump triggers for each dumped table</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tz-utc</code></th>
      <td>Add SET TIME_ZONE='+00:00' to dump file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--user</code></th>
      <td>MySQL user name to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--verbose</code></th>
      <td>Verbose mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--version</code></th>
      <td>Display version information and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--where</code></th>
      <td>Dump only rows selected by given WHERE condition</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--xml</code></th>
      <td>Produce XML output</td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

#### Connection Options

The **mysqldump** command logs into a MySQL server to extract information. The following options specify how to connect to the MySQL server, either on the same machine or a remote system.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On a computer having multiple network interfaces, use this option to select which interface to use for connecting to the MySQL server.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compress all information sent between the client and the server if possible. See Section 4.2.6, “Connection Compression Control”.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  A hint about which client-side authentication plugin to use. See Section 6.2.13, “Pluggable Authentication”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduced</th> <td>5.7.10</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Enable the `mysql_clear_password` cleartext authentication plugin. (See Section 6.4.1.6, “Client-Side Cleartext Pluggable Authentication”.)

  This option was added in MySQL 5.7.10.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduced</th> <td>5.7.23</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>

  Request from the server the public key required for RSA key pair-based password exchange. This option applies to clients that authenticate with the ``caching_sha2_password`` authentication plugin. For that plugin, the server does not send the public key unless requested. This option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the ``caching_sha2_password`` plugin, see Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  The `--get-server-public-key` option was added in MySQL 5.7.23.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>

  Dump data from the MySQL server on the given host. The default host is `localhost`.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqldump** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 6.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqldump** should not prompt for one, use the `--skip-password` option.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for pipe"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--pipe</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  On Windows, connect to the server using a named pipe. This option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysqldump** does not find it. See Section 6.2.13, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

  For TCP/IP connections, the port number to use.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 4.2.5, “Connection Transport Protocols”.

* `--secure-auth`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

  Do not send passwords to the server in old (pre-4.1) format. This prevents connections except for servers that use the newer password format.

  As of MySQL 5.7.5, this option is deprecated; expect it to be removed in a future MySQL release. It is always enabled and attempting to disable it (`--skip-secure-auth`, `--secure-auth=0`) produces an error. Before MySQL 5.7.5, this option is enabled by default but can be disabled.

  Note

  Passwords that use the pre-4.1 hashing method are less secure than passwords that use the native password hashing method and should be avoided. Pre-4.1 passwords are deprecated and support for them was removed in MySQL 5.7.5. For account upgrade instructions, see Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql\_old\_password Plugin”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or ``caching_sha2_password`` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and ``caching_sha2_password`` plugins, see Section 6.4.1.5, “SHA-256 Pluggable Authentication”, and Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  The `--server-public-key-path` option was added in MySQL 5.7.23.

* `--skip-mysql-schema`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

  Do not drop the `mysql` schema when the dump file is restored. By default, the schema is dropped.

  This option was added in MySQL 5.7.36.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 5.7.10.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>8

  The user name of the MySQL account to use for connecting to the server.

#### Option-File Options

These options are used to control which option files to read.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>9

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysqldump** normally reads the `[client]` and `[mysqldump]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysqldump** also reads the `[client_other]` and `[mysqldump_other]` groups.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>3

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

#### DDL Options

Usage scenarios for **mysqldump** include setting up an entire new MySQL instance (including database tables), and replacing data inside an existing instance with existing databases and tables. The following options let you specify which things to tear down and set up when restoring a dump, by encoding various DDL statements within the dump file.

* `--add-drop-database`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>4

  Write a `DROP DATABASE` statement before each `CREATE DATABASE` statement. This option is typically used in conjunction with the `--all-databases` or `--databases` option because no `CREATE DATABASE` statements are written unless one of those options is specified.

* `--add-drop-table`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>5

  Write a `DROP TABLE` statement before each `CREATE TABLE` statement.

* `--add-drop-trigger`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>6

  Write a `DROP TRIGGER` statement before each `CREATE TRIGGER` statement.

* `--all-tablespaces`, `-Y`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>7

  Adds to a table dump all SQL statements needed to create any tablespaces used by an `NDB` table. This information is not otherwise included in the output from **mysqldump**. This option is currently relevant only to NDB Cluster tables, which are not supported in MySQL 5.7.

* `--no-create-db`, `-n`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>8

  Suppress the `CREATE DATABASE` statements that are otherwise included in the output if the `--databases` or `--all-databases` option is given.

* `--no-create-info`, `-t`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>9

  Do not write `CREATE TABLE` statements that create each dumped table.

  Note

  This option does *not* exclude statements creating log file groups or tablespaces from **mysqldump** output; however, you can use the `--no-tablespaces` option for this purpose.

* `--no-tablespaces`, `-y`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

  This option suppresses all `CREATE LOGFILE GROUP` and `CREATE TABLESPACE` statements in the output of **mysqldump**.

* `--replace`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

  Write `REPLACE` statements rather than `INSERT` statements.

#### Debug Options

The following options print debugging information, encode debugging information in the dump file, or let the dump operation proceed regardless of potential problems.

* `--allow-keywords`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

  Permit creation of column names that are keywords. This works by prefixing each column name with the table name.

* `--comments`, `-i`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

  Write additional information in the dump file such as program version, server version, and host. This option is enabled by default. To suppress this additional information, use `--skip-comments`.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default value is `d:t:o,/tmp/mysqldump.trace`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-info`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

  Print debugging information and memory and CPU usage statistics when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--dump-date`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

  If the `--comments` option is given, **mysqldump** produces a comment at the end of the dump of the following form:

  ```sql
  -- Dump completed on DATE
  ```

  However, the date causes dump files taken at different times to appear to be different, even if the data are otherwise identical. `--dump-date` and `--skip-dump-date` control whether the date is added to the comment. The default is `--dump-date` (include the date in the comment). `--skip-dump-date` suppresses date printing.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

  Ignore all errors; continue even if an SQL error occurs during a table dump.

  One use for this option is to cause **mysqldump** to continue executing even when it encounters a view that has become invalid because the definition refers to a table that has been dropped. Without `--force`, **mysqldump** exits with an error message. With `--force`, **mysqldump** prints the error message, but it also writes an SQL comment containing the view definition to the dump output and continues executing.

  If the `--ignore-error` option is also given to ignore specific errors, `--force` takes precedence.

* `--log-error=file_name`

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>9

  Log warnings and errors by appending them to the named file. The default is to do no logging.

* `--skip-comments`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduced</th> <td>5.7.10</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>0

  See the description for the `--comments` option.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduced</th> <td>5.7.10</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>1

  Verbose mode. Print more information about what the program does.

#### Help Options

The following options display information about the **mysqldump** command itself.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduced</th> <td>5.7.10</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>2

  Display a help message and exit.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduced</th> <td>5.7.10</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>3

  Display version information and exit.

#### Internationalization Options

The following options change how the **mysqldump** command represents character data with national language settings.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduced</th> <td>5.7.10</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>4

  The directory where character sets are installed. See Section 10.15, “Character Set Configuration”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduced</th> <td>5.7.10</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>5

  Use *`charset_name`* as the default character set. See Section 10.15, “Character Set Configuration”. If no character set is specified, **mysqldump** uses `utf8`.

* `--no-set-names`, `-N`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduced</th> <td>5.7.10</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>6

  Turns off the `--set-charset` setting, the same as specifying `--skip-set-charset`.

* `--set-charset`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduced</th> <td>5.7.10</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>7

  Write `SET NAMES default_character_set` to the output. This option is enabled by default. To suppress the `SET NAMES` statement, use `--skip-set-charset`.

#### Replication Options

The **mysqldump** command is frequently used to create an empty instance, or an instance including data, on a replica server in a replication configuration. The following options apply to dumping and restoring data on replication source and replica servers.

* `--apply-slave-statements`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduced</th> <td>5.7.10</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>8

  For a replica dump produced with the `--dump-slave` option, add a `STOP SLAVE` statement before the `CHANGE MASTER TO` statement and a `START SLAVE` statement at the end of the output.

* `--delete-master-logs`

  <table frame="box" rules="all" summary="Properties for enable-cleartext-plugin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enable-cleartext-plugin</code></td> </tr><tr><th>Introduced</th> <td>5.7.10</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>9

  On a source replication server, delete the binary logs by sending a `PURGE BINARY LOGS` statement to the server after performing the dump operation. This option requires the `RELOAD` privilege as well as privileges sufficient to execute that statement. This option automatically enables `--master-data`.

* `--dump-slave[=value]`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduced</th> <td>5.7.23</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>0

  This option is similar to `--master-data` except that it is used to dump a replication replica server to produce a dump file that can be used to set up another server as a replica that has the same source as the dumped server. It causes the dump output to include a `CHANGE MASTER TO` statement that indicates the binary log coordinates (file name and position) of the dumped replica's source. The `CHANGE MASTER TO` statement reads the values of `Relay_Master_Log_File` and `Exec_Master_Log_Pos` from the `SHOW SLAVE STATUS` output and uses them for `MASTER_LOG_FILE` and `MASTER_LOG_POS` respectively. These are the source server coordinates from which the replica should start replicating.

  Note

  Inconsistencies in the sequence of transactions from the relay log which have been executed can cause the wrong position to be used. See Section 16.4.1.32, “Replication and Transaction Inconsistencies” for more information.

  `--dump-slave` causes the coordinates from the source to be used rather than those of the dumped server, as is done by the `--master-data` option. In addition, specifiying this option causes the `--master-data` option to be overridden, if used, and effectively ignored.

  Warning

  This option should not be used if the server where the dump is going to be applied uses `gtid_mode=ON` and `MASTER_AUTOPOSITION=1`.

  The option value is handled the same way as for `--master-data` (setting no value or 1 causes a `CHANGE MASTER TO` statement to be written to the dump, setting 2 causes the statement to be written but encased in SQL comments) and has the same effect as `--master-data` in terms of enabling or disabling other options and in how locking is handled.

  This option causes **mysqldump** to stop the replica SQL thread before the dump and restart it again after.

  `--dump-slave` sends a `SHOW SLAVE STATUS` statement to the server to obtain information, so it requires privileges sufficient to execute that statement.

  In conjunction with `--dump-slave`, the `--apply-slave-statements` and `--include-master-host-port` options can also be used.

* `--include-master-host-port`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduced</th> <td>5.7.23</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>1

  For the `CHANGE MASTER TO` statement in a replica dump produced with the `--dump-slave` option, add `MASTER_HOST` and `MASTER_PORT` options for the host name and TCP/IP port number of the replica's source.

* `--master-data[=value]`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduced</th> <td>5.7.23</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>2

  Use this option to dump a source replication server to produce a dump file that can be used to set up another server as a replica of the source. It causes the dump output to include a `CHANGE MASTER TO` statement that indicates the binary log coordinates (file name and position) of the dumped server. These are the source server coordinates from which the replica should start replicating after you load the dump file into the replica.

  If the option value is 2, the `CHANGE MASTER TO` statement is written as an SQL comment, and thus is informative only; it has no effect when the dump file is reloaded. If the option value is 1, the statement is not written as a comment and takes effect when the dump file is reloaded. If no option value is specified, the default value is 1.

  `--master-data` sends a `SHOW MASTER STATUS` statement to the server to obtain information, so it requires privileges sufficient to execute that statement. This option also requires the `RELOAD` privilege and the binary log must be enabled.

  The `--master-data` option automatically turns off `--lock-tables`. It also turns on `--lock-all-tables`, unless `--single-transaction` also is specified, in which case, a global read lock is acquired only for a short time at the beginning of the dump (see the description for `--single-transaction`). In all cases, any action on logs happens at the exact moment of the dump.

  It is also possible to set up a replica by dumping an existing replica of the source, using the `--dump-slave` option, which overrides `--master-data` and causes it to be ignored if both options are used.

* `--set-gtid-purged=value`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduced</th> <td>5.7.23</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>3

  This option enables control over global transaction ID (GTID) information written to the dump file, by indicating whether to add a `SET @@GLOBAL.gtid_purged` statement to the output. This option may also cause a statement to be written to the output that disables binary logging while the dump file is being reloaded.

  The following table shows the permitted option values. The default value is `AUTO`.

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduced</th> <td>5.7.23</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>4

  A partial dump from a server that is using GTID-based replication requires the `--set-gtid-purged={ON|OFF}` option to be specified. Use `ON` if the intention is to deploy a new replication replica using only some of the data from the dumped server. Use `OFF` if the intention is to repair a table by copying it within a topology. Use `OFF` if the intention is to copy a table between replication topologies that are disjoint and for them to remain so.

  The `--set-gtid-purged` option has the following effect on binary logging when the dump file is reloaded:

  + `--set-gtid-purged=OFF`: `SET @@SESSION.SQL_LOG_BIN=0;` is not added to the output.

  + `--set-gtid-purged=ON`: `SET @@SESSION.SQL_LOG_BIN=0;` is added to the output.

  + `--set-gtid-purged=AUTO`: `SET @@SESSION.SQL_LOG_BIN=0;` is added to the output if GTIDs are enabled on the server you are backing up (that is, if `AUTO` evaluates to `ON`).

  Using this option with the `--single-transaction` option can lead to inconsistencies in the output. If `--set-gtid-purged=ON` is required, it can be used with `--lock-all-tables`, but this can prevent parallel queries while **mysqldump** is being run.

  It is not recommended to load a dump file when GTIDs are enabled on the server (`gtid_mode=ON`), if your dump file includes system tables. **mysqldump** issues DML instructions for the system tables which use the non-transactional MyISAM storage engine, and this combination is not permitted when GTIDs are enabled. Also be aware that loading a dump file from a server with GTIDs enabled, into another server with GTIDs enabled, causes different transaction identifiers to be generated.

#### Format Options

The following options specify how to represent the entire dump file or certain kinds of data in the dump file. They also control whether certain optional information is written to the dump file.

* `--compact`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduced</th> <td>5.7.23</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>5

  Produce more compact output. This option enables the `--skip-add-drop-table`, `--skip-add-locks`, `--skip-comments`, `--skip-disable-keys`, and `--skip-set-charset` options.

* `--compatible=name`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduced</th> <td>5.7.23</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>6

  Produce output that is more compatible with other database systems or with older MySQL servers. The value of *`name`* can be `ansi`, `mysql323`, `mysql40`, `postgresql`, `oracle`, `mssql`, `db2`, `maxdb`, `no_key_options`, `no_table_options`, or `no_field_options`. To use several values, separate them by commas. These values have the same meaning as the corresponding options for setting the server SQL mode. See Section 5.1.10, “Server SQL Modes”.

  This option does not guarantee compatibility with other servers. It only enables those SQL mode values that are currently available for making dump output more compatible. For example, `--compatible=oracle` does not map data types to Oracle types or use Oracle comment syntax.

* `--complete-insert`, `-c`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduced</th> <td>5.7.23</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>7

  Use complete `INSERT` statements that include column names.

* `--create-options`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduced</th> <td>5.7.23</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>8

  Include all MySQL-specific table options in the `CREATE TABLE` statements.

* `--fields-terminated-by=...`, `--fields-enclosed-by=...`, `--fields-optionally-enclosed-by=...`, `--fields-escaped-by=...`

  <table frame="box" rules="all" summary="Properties for get-server-public-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--get-server-public-key</code></td> </tr><tr><th>Introduced</th> <td>5.7.23</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>9

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>0

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>1

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>2

  These options are used with the `--tab` option and have the same meaning as the corresponding `FIELDS` clauses for `LOAD DATA`. See Section 13.2.6, “LOAD DATA Statement”.

* `--hex-blob`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>3

  Dump binary columns using hexadecimal notation (for example, `'abc'` becomes `0x616263`). The affected data types are `BINARY`, `VARBINARY`, `BLOB` types, `BIT`, all spatial data types, and other non-binary data types when used with the `binary` character set.

  The `--hex-blob` option is ignored when the `--tab` is used.

* `--lines-terminated-by=...`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>4

  This option is used with the `--tab` option and has the same meaning as the corresponding `LINES` clause for `LOAD DATA`. See Section 13.2.6, “LOAD DATA Statement”.

* `--quote-names`, `-Q`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>5

  Quote identifiers (such as database, table, and column names) within `` ` `` characters. If the `ANSI_QUOTES` SQL mode is enabled, identifiers are quoted within `"` characters. This option is enabled by default. It can be disabled with `--skip-quote-names`, but this option should be given after any option such as `--compatible` that may enable `--quote-names`.

* `--result-file=file_name`, `-r file_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>6

  Direct output to the named file. The result file is created and its previous contents overwritten, even if an error occurs while generating the dump.

  This option should be used on Windows to prevent newline `\n` characters from being converted to `\r\n` carriage return/newline sequences.

* `--tab=dir_name`, `-T dir_name`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>7

  Produce tab-separated text-format data files. For each dumped table, **mysqldump** creates a `tbl_name.sql` file that contains the `CREATE TABLE` statement that creates the table, and the server writes a `tbl_name.txt` file that contains its data. The option value is the directory in which to write the files.

  Note

  This option should be used only when **mysqldump** is run on the same machine as the `mysqld` server. Because the server creates `*.txt` files in the directory that you specify, the directory must be writable by the server and the MySQL account that you use must have the `FILE` privilege. Because **mysqldump** creates `*.sql` in the same directory, it must be writable by your system login account.

  By default, the `.txt` data files are formatted using tab characters between column values and a newline at the end of each line. The format can be specified explicitly using the `--fields-xxx` and `--lines-terminated-by` options.

  Column values are converted to the character set specified by the `--default-character-set` option.

* `--tz-utc`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>8

  This option enables `TIMESTAMP` columns to be dumped and reloaded between servers in different time zones. **mysqldump** sets its connection time zone to UTC and adds `SET TIME_ZONE='+00:00'` to the dump file. Without this option, `TIMESTAMP` columns are dumped and reloaded in the time zones local to the source and destination servers, which can cause the values to change if the servers are in different time zones. `--tz-utc` also protects against changes due to daylight saving time. `--tz-utc` is enabled by default. To disable it, use `--skip-tz-utc`.

* `--xml`, `-X`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host</code></td> </tr></tbody></table>9

  Write dump output as well-formed XML.

  **`NULL`, `'NULL'`, and Empty Values**: For a column named *`column_name`*, the `NULL` value, an empty string, and the string value `'NULL'` are distinguished from one another in the output generated by this option as follows.

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

  The output from the **mysql** client when run using the `--xml` option also follows the preceding rules. (See Section 4.5.1.1, “mysql Client Options”.)

  XML output from **mysqldump** includes the XML namespace, as shown here:

  ```sql
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

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

  Dump all tables in all databases. This is the same as using the `--databases` option and naming all the databases on the command line.

* `--databases`, `-B`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

  Dump several databases. Normally, **mysqldump** treats the first name argument on the command line as a database name and following names as table names. With this option, it treats all name arguments as database names. `CREATE DATABASE` and `USE` statements are included in the output before each new database.

  This option may be used to dump the `INFORMATION_SCHEMA` and `performance_schema` databases, which normally are not dumped even with the `--all-databases` option. (Also use the `--skip-lock-tables` option.)

* `--events`, `-E`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

  Include Event Scheduler events for the dumped databases in the output. This option requires the `EVENT` privileges for those databases.

  The output generated by using `--events` contains `CREATE EVENT` statements to create the events. However, these statements do not include attributes such as the event creation and modification timestamps, so when the events are reloaded, they are created with timestamps equal to the reload time.

  If you require events to be created with their original timestamp attributes, do not use `--events`. Instead, dump and reload the contents of the `mysql.event` table directly, using a MySQL account that has appropriate privileges for the `mysql` database.

* `--ignore-error=error[,error]...`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

  Ignore the specified errors. The option value is a list of comma-separated error numbers specifying the errors to ignore during **mysqldump** execution. If the `--force` option is also given to ignore all errors, `--force` takes precedence.

* `--ignore-table=db_name.tbl_name`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

  Do not dump the given table, which must be specified using both the database and table names. To ignore multiple tables, use this option multiple times. This option also can be used to ignore views.

* `--no-data`, `-d`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

  Do not write any table row information (that is, do not dump table contents). This is useful if you want to dump only the `CREATE TABLE` statement for the table (for example, to create an empty copy of the table by loading the dump file).

* `--routines`, `-R`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

  Include stored routines (procedures and functions) for the dumped databases in the output. This option requires the `SELECT` privilege for the `mysql.proc` table.

  The output generated by using `--routines` contains `CREATE PROCEDURE` and `CREATE FUNCTION` statements to create the routines. However, these statements do not include attributes such as the routine creation and modification timestamps, so when the routines are reloaded, they are created with timestamps equal to the reload time.

  If you require routines to be created with their original timestamp attributes, do not use `--routines`. Instead, dump and reload the contents of the `mysql.proc` table directly, using a MySQL account that has appropriate privileges for the `mysql` database.

* `--tables`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

  Override the `--databases` or `-B` option. **mysqldump** regards all name arguments following the option as table names.

* `--triggers`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>9

  Include triggers for each dumped table in the output. This option is enabled by default; disable it with `--skip-triggers`.

  To be able to dump a table's triggers, you must have the `TRIGGER` privilege for the table.

  Multiple triggers are permitted. **mysqldump** dumps triggers in activation order so that when the dump file is reloaded, triggers are created in the same activation order. However, if a **mysqldump** dump file contains multiple triggers for a table that have the same trigger event and action time, an error occurs for attempts to load the dump file into an older server that does not support multiple triggers. (For a workaround, see Section 2.11.3, “Downgrade Notes”; you can convert triggers to be compatible with older servers.)

* `--where='where_condition'`, `-w 'where_condition'`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

  Dump only rows selected by the given `WHERE` condition. Quotes around the condition are mandatory if it contains spaces or other characters that are special to your command interpreter.

  Examples:

  ```sql
  --where="user='jimf'"
  -w"userid>1"
  -w"userid<1"
  ```

#### Performance Options

The following options are the most relevant for the performance particularly of the restore operations. For large data sets, restore operation (processing the `INSERT` statements in the dump file) is the most time-consuming part. When it is urgent to restore data quickly, plan and test the performance of this stage in advance. For restore times measured in hours, you might prefer an alternative backup and restore solution, such as MySQL Enterprise Backup for `InnoDB`-only and mixed-use databases.

Performance is also affected by the transactional options, primarily for the dump operation.

* `--disable-keys`, `-K`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

  For each table, surround the `INSERT` statements with `/*!40000 ALTER TABLE tbl_name DISABLE KEYS */;` and `/*!40000 ALTER TABLE tbl_name ENABLE KEYS */;` statements. This makes loading the dump file faster because the indexes are created after all rows are inserted. This option is effective only for nonunique indexes of `MyISAM` tables.

* `--extended-insert`, `-e`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

  Write `INSERT` statements using multiple-row syntax that includes several `VALUES` lists. This results in a smaller dump file and speeds up inserts when the file is reloaded.

* `--insert-ignore`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

  Write `INSERT IGNORE` statements rather than `INSERT` statements.

* `--max-allowed-packet=value`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

  The maximum size of the buffer for client/server communication. The default is 24MB, the maximum is 1GB.

  Note

  The value of this option is specific to **mysqldump** and should not be confused with the MySQL server's `max_allowed_packet` system variable; the server value cannot be exceeded by a single packet from **mysqldump**, regardless of any setting for the **mysqldump** option, even if the latter is larger.

* `--net-buffer-length=value`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

  The initial size of the buffer for client/server communication. When creating multiple-row `INSERT` statements (as with the `--extended-insert` or `--opt` option), **mysqldump** creates rows up to `--net-buffer-length` bytes long. If you increase this variable, ensure that the MySQL server `net_buffer_length` system variable has a value at least this large.

* `--opt`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

  This option, enabled by default, is shorthand for the combination of `--add-drop-table` `--add-locks` `--create-options` `--disable-keys` `--extended-insert` `--lock-tables` `--quick` `--set-charset`. It gives a fast dump operation and produces a dump file that can be reloaded into a MySQL server quickly.

  Because the `--opt` option is enabled by default, you only specify its converse, the `--skip-opt` to turn off several default settings. See the discussion of `mysqldump` option groups for information about selectively enabling or disabling a subset of the options affected by `--opt`.

* `--quick`, `-q`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

  This option is useful for dumping large tables. It forces **mysqldump** to retrieve rows for a table from the server a row at a time rather than retrieving the entire row set and buffering it in memory before writing it out.

* `--skip-opt`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>8

  See the description for the `--opt` option.

#### Transactional Options

The following options trade off the performance of the dump operation, against the reliability and consistency of the exported data.

* `--add-locks`

  <table frame="box" rules="all" summary="Properties for password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>9

  Surround each table dump with `LOCK TABLES` and `UNLOCK TABLES` statements. This results in faster inserts when the dump file is reloaded. See Section 8.2.4.1, “Optimizing INSERT Statements”.

* `--flush-logs`, `-F`

  <table frame="box" rules="all" summary="Properties for pipe"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--pipe</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

  Flush the MySQL server log files before starting the dump. This option requires the `RELOAD` privilege. If you use this option in combination with the `--all-databases` option, the logs are flushed *for each database dumped*. The exception is when using `--lock-all-tables`, `--master-data`, or `--single-transaction`: In this case, the logs are flushed only once, corresponding to the moment that all tables are locked by `FLUSH TABLES WITH READ LOCK`. If you want your dump and the log flush to happen at exactly the same moment, you should use `--flush-logs` together with `--lock-all-tables`, `--master-data`, or `--single-transaction`.

* `--flush-privileges`

  <table frame="box" rules="all" summary="Properties for pipe"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--pipe</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

  Add a `FLUSH PRIVILEGES` statement to the dump output after dumping the `mysql` database. This option should be used any time the dump contains the `mysql` database and any other database that depends on the data in the `mysql` database for proper restoration.

  Because the dump file contains a `FLUSH PRIVILEGES` statement, reloading the file requires privileges sufficient to execute that statement.

  Note

  For upgrades to MySQL 5.7 or higher from older versions, do not use `--flush-privileges`. For upgrade instructions in this case, see Section 2.10.3, “Changes in MySQL 5.7”.

* `--lock-all-tables`, `-x`

  <table frame="box" rules="all" summary="Properties for pipe"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--pipe</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

  Lock all tables across all databases. This is achieved by acquiring a global read lock for the duration of the whole dump. This option automatically turns off `--single-transaction` and `--lock-tables`.

* `--lock-tables`, `-l`

  <table frame="box" rules="all" summary="Properties for pipe"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--pipe</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

  For each dumped database, lock all tables to be dumped before dumping them. The tables are locked with `READ LOCAL` to permit concurrent inserts in the case of `MyISAM` tables. For transactional tables such as `InnoDB`, `--single-transaction` is a much better option than `--lock-tables` because it does not need to lock the tables at all.

  Because `--lock-tables` locks tables for each database separately, this option does not guarantee that the tables in the dump file are logically consistent between databases. Tables in different databases may be dumped in completely different states.

  Some options, such as `--opt`, automatically enable `--lock-tables`. If you want to override this, use `--skip-lock-tables` at the end of the option list.

* `--no-autocommit`

  <table frame="box" rules="all" summary="Properties for pipe"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--pipe</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

  Enclose the `INSERT` statements for each dumped table within `SET autocommit = 0` and `COMMIT` statements.

* `--order-by-primary`

  <table frame="box" rules="all" summary="Properties for pipe"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--pipe</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

  Dump each table's rows sorted by its primary key, or by its first unique index, if such an index exists. This is useful when dumping a `MyISAM` table to be loaded into an `InnoDB` table, but makes the dump operation take considerably longer.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for pipe"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--pipe</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

  On Windows, the shared-memory name to use for connections made using shared memory to a local server. The default value is `MYSQL`. The shared-memory name is case-sensitive.

  This option applies only if the server was started with the `shared_memory` system variable enabled to support shared-memory connections.

* `--single-transaction`

  <table frame="box" rules="all" summary="Properties for pipe"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--pipe</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

  This option sets the transaction isolation mode to `REPEATABLE READ` and sends a `START TRANSACTION` SQL statement to the server before dumping data. It is useful only with transactional tables such as `InnoDB`, because then it dumps the consistent state of the database at the time when `START TRANSACTION` was issued without blocking any applications.

  The RELOAD or FLUSH\_TABLES privilege is required with `--single-transaction` if both gtid\_mode=ON and --set-gtid=purged=ON|AUTO. This requirement was added in MySQL 8.0.32.

  When using this option, you should keep in mind that only `InnoDB` tables are dumped in a consistent state. For example, any `MyISAM` or `MEMORY` tables dumped while using this option may still change state.

  While a `--single-transaction` dump is in process, to ensure a valid dump file (correct table contents and binary log coordinates), no other connection should use the following statements: `ALTER TABLE`, `CREATE TABLE`, `DROP TABLE`, `RENAME TABLE`, `TRUNCATE TABLE`. A consistent read is not isolated from those statements, so use of them on a table to be dumped can cause the `SELECT` that is performed by **mysqldump** to retrieve the table contents to obtain incorrect contents or fail.

  The `--single-transaction` option and the `--lock-tables` option are mutually exclusive because `LOCK TABLES` causes any pending transactions to be committed implicitly.

  Using `--single-transaction` together with the `--set-gtid-purged` option is not recommended; doing so can lead to inconsistencies in the output of **mysqldump**.

  To dump large tables, combine the `--single-transaction` option with the `--quick` option.

#### Option Groups

* The `--opt` option turns on several settings that work together to perform a fast dump operation. All of these settings are on by default, because `--opt` is on by default. Thus you rarely if ever specify `--opt`. Instead, you can turn these settings off as a group by specifying `--skip-opt`, then optionally re-enable certain settings by specifying the associated options later on the command line.

* The `--compact` option turns off several settings that control whether optional statements and comments appear in the output. Again, you can follow this option with other options that re-enable certain settings, or turn all the settings on by using the `--skip-compact` form.

When you selectively enable or disable the effect of a group option, order is important because options are processed first to last. For example, `--disable-keys` `--lock-tables` `--skip-opt` would not have the intended effect; it is the same as `--skip-opt` by itself.

#### Examples

To make a backup of an entire database:

```sql
mysqldump db_name > backup-file.sql
```

To load the dump file back into the server:

```sql
mysql db_name < backup-file.sql
```

Another way to reload the dump file:

```sql
mysql -e "source /path-to-backup/backup-file.sql" db_name
```

**mysqldump** is also very useful for populating databases by copying data from one MySQL server to another:

```sql
mysqldump --opt db_name | mysql --host=remote_host -C db_name
```

You can dump several databases with one command:

```sql
mysqldump --databases db_name1 [db_name2 ...] > my_databases.sql
```

To dump all databases, use the `--all-databases` option:

```sql
mysqldump --all-databases > all_databases.sql
```

For `InnoDB` tables, **mysqldump** provides a way of making an online backup:

```sql
mysqldump --all-databases --master-data --single-transaction > all_databases.sql
```

This backup acquires a global read lock on all tables (using `FLUSH TABLES WITH READ LOCK`) at the beginning of the dump. As soon as this lock has been acquired, the binary log coordinates are read and the lock is released. If long updating statements are running when the `FLUSH` statement is issued, the MySQL server may get stalled until those statements finish. After that, the dump becomes lock free and does not disturb reads and writes on the tables. If the update statements that the MySQL server receives are short (in terms of execution time), the initial lock period should not be noticeable, even with many updates.

For point-in-time recovery (also known as “roll-forward,” when you need to restore an old backup and replay the changes that happened since that backup), it is often useful to rotate the binary log (see Section 5.4.4, “The Binary Log”) or at least know the binary log coordinates to which the dump corresponds:

```sql
mysqldump --all-databases --master-data=2 > all_databases.sql
```

Or:

```sql
mysqldump --all-databases --flush-logs --master-data=2 > all_databases.sql
```

The `--master-data` and `--single-transaction` options can be used simultaneously, which provides a convenient way to make an online backup suitable for use prior to point-in-time recovery if tables are stored using the `InnoDB` storage engine.

For more information on making backups, see Section 7.2, “Database Backup Methods”, and Section 7.3, “Example Backup and Recovery Strategy”.

* To select the effect of `--opt` except for some features, use the `--skip` option for each feature. To disable extended inserts and memory buffering, use `--opt` `--skip-extended-insert` `--skip-quick`. (Actually, `--skip-extended-insert` `--skip-quick` is sufficient because `--opt` is on by default.)

* To reverse `--opt` for all features except index disabling and table locking, use `--skip-opt` `--disable-keys` `--lock-tables`.

#### Restrictions

**mysqldump** does not dump the `INFORMATION_SCHEMA`, `performance_schema`, or `sys` schema by default. To dump any of these, name them explicitly on the command line. You can also name them with the `--databases` option. For `INFORMATION_SCHEMA` and `performance_schema`, also use the `--skip-lock-tables` option.

**mysqldump** does not dump the NDB Cluster `ndbinfo` information database.

**mysqldump** does not dump `InnoDB` `CREATE TABLESPACE` statements.

**mysqldump** always strips the `NO_AUTO_CREATE_USER` SQL mode as `NO_AUTO_CREATE_USER` is not compatible with MySQL 8.0. It remains stripped even when importing back into MySQL 5.7, which means that stored routines could behave differently after restoring a dump if they rely upon this particular `sql_mode`. It is stripped as of **mysqldump** 5.7.24.

It is not recommended to restore from a dump made using **mysqldump** to a MySQL 5.6.9 or earlier server that has GTIDs enabled. See Section 16.1.3.6, “Restrictions on Replication with GTIDs”.

**mysqldump** includes statements to recreate the `general_log` and `slow_query_log` tables for dumps of the `mysql` database. Log table contents are not dumped.

If you encounter problems backing up views due to insufficient privileges, see Section 23.9, “Restrictions on Views” for a workaround.

### 4.5.5 mysqlimport — A Data Import Program

The **mysqlimport** client provides a command-line interface to the `LOAD DATA` SQL statement. Most options to **mysqlimport** correspond directly to clauses of `LOAD DATA` syntax. See Section 13.2.6, “LOAD DATA Statement”.

Invoke **mysqlimport** like this:

```sql
mysqlimport [options] db_name textfile1 [textfile2 ...]
```

For each text file named on the command line, **mysqlimport** strips any extension from the file name and uses the result to determine the name of the table into which to import the file's contents. For example, files named `patient.txt`, `patient.text`, and `patient` all would be imported into a table named `patient`.

**mysqlimport** supports the following options, which can be specified on the command line or in the `[mysqlimport]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see Section 4.2.2.2, “Using Option Files”.

**Table 4.17 mysqlimport Options**

<table frame="box" rules="all" summary="Command-line options available for mysqlimport.">
  <col style="width: 27%"/>
  <col style="width: 50%"/>
  <col style="width: 11%"/>
  <col style="width: 11%"/>
  <thead>
    <tr>
      <th>Option Name</th>
      <th>Description</th>
      <th>Introduced</th>
      <th>Deprecated</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>--bind-address</code></th>
      <td>Use specified network interface to connect to MySQL Server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--character-sets-dir</code></th>
      <td>Directory where character sets can be found</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--columns</code></th>
      <td>This option takes a comma-separated list of column names as its value</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--compress</code></th>
      <td>Compress all information sent between client and server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug</code></th>
      <td>Write debugging log</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-check</code></th>
      <td>Print debugging information when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-info</code></th>
      <td>Print debugging information, memory, and CPU statistics when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-auth</code></th>
      <td>Authentication plugin to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-character-set</code></th>
      <td>Specify default character set</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-extra-file</code></th>
      <td>Read named option file in addition to usual option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-file</code></th>
      <td>Read only named option file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-group-suffix</code></th>
      <td>Option group suffix value</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--delete</code></th>
      <td>Empty the table before importing the text file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--enable-cleartext-plugin</code></th>
      <td>Enable cleartext authentication plugin</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fields-enclosed-by</code></th>
      <td>This option has the same meaning as the corresponding clause for LOAD DATA</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fields-escaped-by</code></th>
      <td>This option has the same meaning as the corresponding clause for LOAD DATA</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fields-optionally-enclosed-by</code></th>
      <td>This option has the same meaning as the corresponding clause for LOAD DATA</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--fields-terminated-by</code></th>
      <td>This option has the same meaning as the corresponding clause for LOAD DATA</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--force</code></th>
      <td>Continue even if an SQL error occurs</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--get-server-public-key</code></th>
      <td>Request RSA public key from server</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--help</code></th>
      <td>Display help message and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--host</code></th>
      <td>Host on which MySQL server is located</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ignore</code></th>
      <td>See the description for the --replace option</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ignore-lines</code></th>
      <td>Ignore the first N lines of the data file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--lines-terminated-by</code></th>
      <td>This option has the same meaning as the corresponding clause for LOAD DATA</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--local</code></th>
      <td>Read input files locally from the client host</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--lock-tables</code></th>
      <td>Lock all tables for writing before processing any text files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--login-path</code></th>
      <td>Read login path options from .mylogin.cnf</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--low-priority</code></th>
      <td>Use LOW_PRIORITY when loading the table</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-defaults</code></th>
      <td>Read no option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--password</code></th>
      <td>Password to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--pipe</code></th>
      <td>Connect to server using named pipe (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--plugin-dir</code></th>
      <td>Directory where plugins are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--port</code></th>
      <td>TCP/IP port number for connection</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--print-defaults</code></th>
      <td>Print default options</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--protocol</code></th>
      <td>Transport protocol to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--replace</code></th>
      <td>The --replace and --ignore options control handling of input rows that duplicate existing rows on unique key values</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--secure-auth</code></th>
      <td>Do not send passwords to server in old (pre-4.1) format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--server-public-key-path</code></th>
      <td>Path name to file containing RSA public key</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--shared-memory-base-name</code></th>
      <td>Shared-memory name for shared-memory connections (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--silent</code></th>
      <td>Produce output only when errors occur</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--socket</code></th>
      <td>Unix socket file or Windows named pipe to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl</code></th>
      <td>Enable connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-ca</code></th>
      <td>File that contains list of trusted SSL Certificate Authorities</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-capath</code></th>
      <td>Directory that contains trusted SSL Certificate Authority certificate files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cert</code></th>
      <td>File that contains X.509 certificate</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cipher</code></th>
      <td>Permissible ciphers for connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crl</code></th>
      <td>File that contains certificate revocation lists</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crlpath</code></th>
      <td>Directory that contains certificate revocation-list files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-key</code></th>
      <td>File that contains X.509 key</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-mode</code></th>
      <td>Desired security state of connection to server</td>
      <td>5.7.11</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-verify-server-cert</code></th>
      <td>Verify host name against server certificate Common Name identity</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tls-version</code></th>
      <td>Permissible TLS protocols for encrypted connections</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--use-threads</code></th>
      <td>Number of threads for parallel file-loading</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--user</code></th>
      <td>MySQL user name to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--verbose</code></th>
      <td>Verbose mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--version</code></th>
      <td>Display version information and exit</td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On a computer having multiple network interfaces, use this option to select which interface to use for connecting to the MySQL server.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  The directory where character sets are installed. See Section 10.15, “Character Set Configuration”.

* `--columns=column_list`, `-c column_list`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>

  This option takes a list of comma-separated column names as its value. The order of the column names indicates how to match data file columns with table columns.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compress all information sent between the client and the server if possible. See Section 4.2.6, “Connection Compression Control”.

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

  <table frame="box" rules="all" summary="Properties for default-character-set"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-character-set=charset_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Use *`charset_name`* as the default character set. See Section 10.15, “Character Set Configuration”.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

  A hint about which client-side authentication plugin to use. See Section 6.2.13, “Pluggable Authentication”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysqlimport** normally reads the `[client]` and `[mysqlimport]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysqlimport** also reads the `[client_other]` and `[mysqlimport_other]` groups.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--delete`, `-D`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

  Empty the table before importing the text file.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

  Enable the `mysql_clear_password` cleartext authentication plugin. (See Section 6.4.1.6, “Client-Side Cleartext Pluggable Authentication”.)

  This option was added in MySQL 5.7.10.

* `--fields-terminated-by=...`, `--fields-enclosed-by=...`, `--fields-optionally-enclosed-by=...`, `--fields-escaped-by=...`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

  These options have the same meaning as the corresponding clauses for `LOAD DATA`. See Section 13.2.6, “LOAD DATA Statement”.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

  Ignore errors. For example, if a table for a text file does not exist, continue processing any remaining files. Without `--force`, **mysqlimport** exits if a table does not exist.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

  Request from the server the public key required for RSA key pair-based password exchange. This option applies to clients that authenticate with the ``caching_sha2_password`` authentication plugin. For that plugin, the server does not send the public key unless requested. This option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the ``caching_sha2_password`` plugin, see Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  The `--get-server-public-key` option was added in MySQL 5.7.23.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

  Import data to the MySQL server on the given host. The default host is `localhost`.

* `--ignore`, `-i`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

  See the description for the `--replace` option.

* `--ignore-lines=N`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

  Ignore the first *`N`* lines of the data file.

* `--lines-terminated-by=...`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

  This option has the same meaning as the corresponding clause for `LOAD DATA`. For example, to import Windows files that have lines terminated with carriage return/linefeed pairs, use `--lines-terminated-by="\r\n"`. (You might have to double the backslashes, depending on the escaping conventions of your command interpreter.) See Section 13.2.6, “LOAD DATA Statement”.

* `--local`, `-L`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

  By default, files are read by the server on the server host. With this option, **mysqlimport** reads input files locally on the client host.

  Successful use of `LOCAL` load operations within **mysqlimport** also requires that the server permits local loading; see Section 6.1.6, “Security Considerations for LOAD DATA LOCAL”

* `--lock-tables`, `-l`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

  Lock *all* tables for writing before processing any text files. This ensures that all tables are synchronized on the server.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>8

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--low-priority`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>9

  Use `LOW_PRIORITY` when loading the table. This affects only storage engines that use only table-level locking (such as `MyISAM`, `MEMORY`, and `MERGE`).

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqlimport** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 6.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqlimport** should not prompt for one, use the `--skip-password` option.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

  On Windows, connect to the server using a named pipe. This option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysqlimport** does not find it. See Section 6.2.13, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

  For TCP/IP connections, the port number to use.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>5

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>6

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 4.2.5, “Connection Transport Protocols”.

* `--replace`, `-r`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>7

  The `--replace` and `--ignore` options control handling of input rows that duplicate existing rows on unique key values. If you specify `--replace`, new rows replace existing rows that have the same unique key value. If you specify `--ignore`, input rows that duplicate an existing row on a unique key value are skipped. If you do not specify either option, an error occurs when a duplicate key value is found, and the rest of the text file is ignored.

* `--secure-auth`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>8

  Do not send passwords to the server in old (pre-4.1) format. This prevents connections except for servers that use the newer password format.

  As of MySQL 5.7.5, this option is deprecated;expect it to be removed in a future MySQL release. It is always enabled and attempting to disable it (`--skip-secure-auth`, `--secure-auth=0`) produces an error. Before MySQL 5.7.5, this option is enabled by default but can be disabled.

  Note

  Passwords that use the pre-4.1 hashing method are less secure than passwords that use the native password hashing method and should be avoided. Pre-4.1 passwords are deprecated and support for them was removed in MySQL 5.7.5. For account upgrade instructions, see Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql\_old\_password Plugin”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>9

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or ``caching_sha2_password`` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and ``caching_sha2_password`` plugins, see Section 6.4.1.5, “SHA-256 Pluggable Authentication”, and Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  The `--server-public-key-path` option was added in MySQL 5.7.23.

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

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>3

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 5.7.10.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>4

  The user name of the MySQL account to use for connecting to the server.

* `--use-threads=N`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>5

  Load files in parallel using *`N`* threads.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>6

  Verbose mode. Print more information about what the program does.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for columns"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--columns=column_list</code></td> </tr></tbody></table>7

  Display version information and exit.

Here is a sample session that demonstrates use of **mysqlimport**:

```sql
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

### 4.5.6 mysqlpump — A Database Backup Program

The **mysqlpump** client utility performs logical backups, producing a set of SQL statements that can be executed to reproduce the original database object definitions and table data. It dumps one or more MySQL databases for backup or transfer to another SQL server.

**mysqlpump** features include:

* Parallel processing of databases, and of objects within databases, to speed up the dump process

* Better control over which databases and database objects (tables, stored programs, user accounts) to dump

* Dumping of user accounts as account-management statements (`CREATE USER`, `GRANT`) rather than as inserts into the `mysql` system database

* Capability of creating compressed output
* Progress indicator (the values are estimates)
* For dump file reloading, faster secondary index creation for `InnoDB` tables by adding indexes after rows are inserted

**mysqlpump** requires at least the `SELECT` privilege for dumped tables, `SHOW VIEW` for dumped views, `TRIGGER` for dumped triggers, and `LOCK TABLES` if the `--single-transaction` option is not used. The `SELECT` privilege on the `mysql` system database is required to dump user definitions. Certain options might require other privileges as noted in the option descriptions.

To reload a dump file, you must have the privileges required to execute the statements that it contains, such as the appropriate `CREATE` privileges for objects created by those statements.

Note

A dump made using PowerShell on Windows with output redirection creates a file that has UTF-16 encoding:

```sql
mysqlpump [options] > dump.sql
```

However, UTF-16 is not permitted as a connection character set (see Section 10.4, “Connection Character Sets and Collations”), so the dump file does not load correctly. To work around this issue, use the `--result-file` option, which creates the output in ASCII format:

```sql
mysqlpump [options] --result-file=dump.sql
```

#### mysqlpump Invocation Syntax

By default, **mysqlpump** dumps all databases (with certain exceptions noted in mysqlpump Restrictions). To specify this behavior explicitly, use the `--all-databases` option:

```sql
mysqlpump --all-databases
```

To dump a single database, or certain tables within that database, name the database on the command line, optionally followed by table names:

```sql
mysqlpump db_name
mysqlpump db_name tbl_name1 tbl_name2 ...
```

To treat all name arguments as database names, use the `--databases` option:

```sql
mysqlpump --databases db_name1 db_name2 ...
```

By default, **mysqlpump** does not dump user account definitions, even if you dump the `mysql` system database that contains the grant tables. To dump grant table contents as logical definitions in the form of `CREATE USER` and `GRANT` statements, use the `--users` option and suppress all database dumping:

```sql
mysqlpump --exclude-databases=% --users
```

In the preceding command, `%` is a wildcard that matches all database names for the `--exclude-databases` option.

**mysqlpump** supports several options for including or excluding databases, tables, stored programs, and user definitions. See mysqlpump Object Selection.

To reload a dump file, execute the statements that it contains. For example, use the **mysql** client:

```sql
mysqlpump [options] > dump.sql
mysql < dump.sql
```

The following discussion provides additional **mysqlpump** usage examples.

To see a list of the options **mysqlpump** supports, issue the command **mysqlpump --help**.

#### mysqlpump Option Summary

**mysqlpump** supports the following options, which can be specified on the command line or in the `[mysqlpump]` and `[client]` groups of an option file. (Prior to MySQL 5.7.30, **mysqlpump** read the `[mysql_dump]` group rather than `[mysqlpump]`. As of 5.7.30, `[mysql_dump]` is still accepted but is deprecated.) For information about option files used by MySQL programs, see Section 4.2.2.2, “Using Option Files”.

**Table 4.18 mysqlpump Options**

<table frame="box" rules="all" summary="Command-line options available for mysqlpump.">
  <col style="width: 31%"/>
  <col style="width: 56%"/>
  <col style="width: 12%"/>
  <thead>
    <tr>
      <th>Option Name</th>
      <th>Description</th>
      <th>Introduced</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>--add-drop-database</code></th>
      <td>Add DROP DATABASE statement before each CREATE DATABASE statement</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--add-drop-table</code></th>
      <td>Add DROP TABLE statement before each CREATE TABLE statement</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--add-drop-user</code></th>
      <td>Add DROP USER statement before each CREATE USER statement</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--add-locks</code></th>
      <td>Surround each table dump with LOCK TABLES and UNLOCK TABLES statements</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--all-databases</code></th>
      <td>Dump all databases</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--bind-address</code></th>
      <td>Use specified network interface to connect to MySQL Server</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--character-sets-dir</code></th>
      <td>Directory where character sets are installed</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--complete-insert</code></th>
      <td>Use complete INSERT statements that include column names</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--compress</code></th>
      <td>Compress all information sent between client and server</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--compress-output</code></th>
      <td>Output compression algorithm</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--databases</code></th>
      <td>Interpret all name arguments as database names</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug</code></th>
      <td>Write debugging log</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-check</code></th>
      <td>Print debugging information when program exits</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-info</code></th>
      <td>Print debugging information, memory, and CPU statistics when program exits</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-auth</code></th>
      <td>Authentication plugin to use</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-character-set</code></th>
      <td>Specify default character set</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-parallelism</code></th>
      <td>Default number of threads for parallel processing</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-extra-file</code></th>
      <td>Read named option file in addition to usual option files</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-file</code></th>
      <td>Read only named option file</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-group-suffix</code></th>
      <td>Option group suffix value</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defer-table-indexes</code></th>
      <td>For reloading, defer index creation until after loading table rows</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--events</code></th>
      <td>Dump events from dumped databases</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--exclude-databases</code></th>
      <td>Databases to exclude from dump</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--exclude-events</code></th>
      <td>Events to exclude from dump</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--exclude-routines</code></th>
      <td>Routines to exclude from dump</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--exclude-tables</code></th>
      <td>Tables to exclude from dump</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--exclude-triggers</code></th>
      <td>Triggers to exclude from dump</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--exclude-users</code></th>
      <td>Users to exclude from dump</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--extended-insert</code></th>
      <td>Use multiple-row INSERT syntax</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--get-server-public-key</code></th>
      <td>Request RSA public key from server</td>
      <td>5.7.23</td>
    </tr>
    <tr>
      <th><code>--help</code></th>
      <td>Display help message and exit</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--hex-blob</code></th>
      <td>Dump binary columns using hexadecimal notation</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--host</code></th>
      <td>Host on which MySQL server is located</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--include-databases</code></th>
      <td>Databases to include in dump</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--include-events</code></th>
      <td>Events to include in dump</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--include-routines</code></th>
      <td>Routines to include in dump</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--include-tables</code></th>
      <td>Tables to include in dump</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--include-triggers</code></th>
      <td>Triggers to include in dump</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--include-users</code></th>
      <td>Users to include in dump</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--insert-ignore</code></th>
      <td>Write INSERT IGNORE rather than INSERT statements</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--log-error-file</code></th>
      <td>Append warnings and errors to named file</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--login-path</code></th>
      <td>Read login path options from .mylogin.cnf</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--max-allowed-packet</code></th>
      <td>Maximum packet length to send to or receive from server</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--net-buffer-length</code></th>
      <td>Buffer size for TCP/IP and socket communication</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-create-db</code></th>
      <td>Do not write CREATE DATABASE statements</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-create-info</code></th>
      <td>Do not write CREATE TABLE statements that re-create each dumped table</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-defaults</code></th>
      <td>Read no option files</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--parallel-schemas</code></th>
      <td>Specify schema-processing parallelism</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--password</code></th>
      <td>Password to use when connecting to server</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--plugin-dir</code></th>
      <td>Directory where plugins are installed</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--port</code></th>
      <td>TCP/IP port number for connection</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--print-defaults</code></th>
      <td>Print default options</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--protocol</code></th>
      <td>Transport protocol to use</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--replace</code></th>
      <td>Write REPLACE statements rather than INSERT statements</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--result-file</code></th>
      <td>Direct output to a given file</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--routines</code></th>
      <td>Dump stored routines (procedures and functions) from dumped databases</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--secure-auth</code></th>
      <td>Do not send passwords to server in old (pre-4.1) format</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--server-public-key-path</code></th>
      <td>Path name to file containing RSA public key</td>
      <td>5.7.23</td>
    </tr>
    <tr>
      <th><code>--set-charset</code></th>
      <td>Add SET NAMES default_character_set to output</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--set-gtid-purged</code></th>
      <td>Whether to add SET @@GLOBAL.GTID_PURGED to output</td>
      <td>5.7.18</td>
    </tr>
    <tr>
      <th><code>--single-transaction</code></th>
      <td>Dump tables within single transaction</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-definer</code></th>
      <td>Omit DEFINER and SQL SECURITY clauses from view and stored program CREATE statements</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--skip-dump-rows</code></th>
      <td>Do not dump table rows</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--socket</code></th>
      <td>Unix socket file or Windows named pipe to use</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl</code></th>
      <td>Enable connection encryption</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-ca</code></th>
      <td>File that contains list of trusted SSL Certificate Authorities</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-capath</code></th>
      <td>Directory that contains trusted SSL Certificate Authority certificate files</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cert</code></th>
      <td>File that contains X.509 certificate</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cipher</code></th>
      <td>Permissible ciphers for connection encryption</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crl</code></th>
      <td>File that contains certificate revocation lists</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crlpath</code></th>
      <td>Directory that contains certificate revocation-list files</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-key</code></th>
      <td>File that contains X.509 key</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-mode</code></th>
      <td>Desired security state of connection to server</td>
      <td>5.7.11</td>
    </tr>
    <tr>
      <th><code>--ssl-verify-server-cert</code></th>
      <td>Verify host name against server certificate Common Name identity</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tls-version</code></th>
      <td>Permissible TLS protocols for encrypted connections</td>
      <td>5.7.10</td>
    </tr>
    <tr>
      <th><code>--triggers</code></th>
      <td>Dump triggers for each dumped table</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tz-utc</code></th>
      <td>Add SET TIME_ZONE='+00:00' to dump file</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--user</code></th>
      <td>MySQL user name to use when connecting to server</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--users</code></th>
      <td>Dump user accounts</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--version</code></th>
      <td>Display version information and exit</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--watch-progress</code></th>
      <td>Display progress indicator</td>
      <td></td>
    </tr>
  </tbody>
</table>

#### mysqlpump Option Descriptions

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--add-drop-database`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>

  Write a `DROP DATABASE` statement before each `CREATE DATABASE` statement.

* `--add-drop-table`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>

  Write a `DROP TABLE` statement before each `CREATE TABLE` statement.

* `--add-drop-user`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>

  Write a `DROP USER` statement before each `CREATE USER` statement.

* `--add-locks`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>

  Surround each table dump with `LOCK TABLES` and `UNLOCK TABLES` statements. This results in faster inserts when the dump file is reloaded. See Section 8.2.4.1, “Optimizing INSERT Statements”.

  This option does not work with parallelism because `INSERT` statements from different tables can be interleaved and `UNLOCK TABLES` following the end of the inserts for one table could release locks on tables for which inserts remain.

  `--add-locks` and `--single-transaction` are mutually exclusive.

* `--all-databases`, `-A`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  Dump all databases (with certain exceptions noted in mysqlpump Restrictions). This is the default behavior if no other is specified explicitly.

  `--all-databases` and `--databases` are mutually exclusive.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On a computer having multiple network interfaces, use this option to select which interface to use for connecting to the MySQL server.

* `--character-sets-dir=path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The directory where character sets are installed. See Section 10.15, “Character Set Configuration”.

* `--complete-insert`

  <table frame="box" rules="all" summary="Properties for complete-insert"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--complete-insert</code></td> </tr></tbody></table>

  Write complete `INSERT` statements that include column names.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

  Compress all information sent between the client and the server if possible. See Section 4.2.6, “Connection Compression Control”.

* `--compress-output=algorithm`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

  By default, **mysqlpump** does not compress output. This option specifies output compression using the specified algorithm. Permitted algorithms are `LZ4` and `ZLIB`.

  To uncompress compressed output, you must have an appropriate utility. If the system commands **lz4** and **openssl zlib** are not available, as of MySQL 5.7.10, MySQL distributions include **lz4\_decompress** and **zlib\_decompress** utilities that can be used to decompress **mysqlpump** output that was compressed using the `--compress-output=LZ4` and `--compress-output=ZLIB` options. For more information, see Section 4.8.1, “lz4\_decompress — Decompress mysqlpump LZ4-Compressed Output”, and Section 4.8.5, “zlib\_decompress — Decompress mysqlpump ZLIB-Compressed Output”.

  Alternatives include the **lz4** and `openssl` commands, if they are installed on your system. For example, **lz4** can uncompress `LZ4` output:

  ```sql
  lz4 -d input_file output_file
  ```

  `ZLIB` output can be uncompresed like this:

  ```sql
  openssl zlib -d < input_file > output_file
  ```

* `--databases`, `-B`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

  Normally, **mysqlpump** treats the first name argument on the command line as a database name and any following names as table names. With this option, it treats all name arguments as database names. `CREATE DATABASE` statements are included in the output before each new database.

  `--all-databases` and `--databases` are mutually exclusive.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:O,/tmp/mysqlpump.trace`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

  Print debugging information and memory and CPU usage statistics when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

  A hint about which client-side authentication plugin to use. See Section 6.2.13, “Pluggable Authentication”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

  Use *`charset_name`* as the default character set. See Section 10.15, “Character Set Configuration”. If no character set is specified, **mysqlpump** uses `utf8`.

* `--default-parallelism=N`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

  The default number of threads for each parallel processing queue. The default is 2.

  The `--parallel-schemas` option also affects parallelism and can be used to override the default number of threads. For more information, see mysqlpump Parallel Processing.

  With `--default-parallelism=0` and no `--parallel-schemas` options, **mysqlpump** runs as a single-threaded process and creates no queues.

  With parallelism enabled, it is possible for output from different databases to be interleaved.

  Note

  Before MySQL 5.7.11, use of the `--single-transaction` option is mutually exclusive with parallelism. To use `--single-transaction`, disable parallelism by setting `--default-parallelism` to 0 and not using any instances of `--parallel-schemas`:

  ```sql
  mysqlpump --single-transaction --default-parallelism=0
  ```

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>0

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>1

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysqlpump** normally reads the `[client]` and `[mysqlpump]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysqlpump** also reads the `[client_other]` and `[mysqlpump_other]` groups.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defer-table-indexes`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>2

  In the dump output, defer index creation for each table until after its rows have been loaded. This works for all storage engines, but for `InnoDB` applies only for secondary indexes.

  This option is enabled by default; use `--skip-defer-table-indexes` to disable it.

* `--events`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>3

  Include Event Scheduler events for the dumped databases in the output. Event dumping requires the `EVENT` privileges for those databases.

  The output generated by using `--events` contains `CREATE EVENT` statements to create the events. However, these statements do not include attributes such as the event creation and modification timestamps, so when the events are reloaded, they are created with timestamps equal to the reload time.

  If you require events to be created with their original timestamp attributes, do not use `--events`. Instead, dump and reload the contents of the `mysql.event` table directly, using a MySQL account that has appropriate privileges for the `mysql` database.

  This option is enabled by default; use `--skip-events` to disable it.

* `--exclude-databases=db_list`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>4

  Do not dump the databases in *`db_list`*, which is a list of one or more comma-separated database names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--exclude-events=event_list`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>5

  Do not dump the databases in *`event_list`*, which is a list of one or more comma-separated event names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--exclude-routines=routine_list`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>6

  Do not dump the events in *`routine_list`*, which is a list of one or more comma-separated routine (stored procedure or function) names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--exclude-tables=table_list`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>7

  Do not dump the tables in *`table_list`*, which is a list of one or more comma-separated table names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--exclude-triggers=trigger_list`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>8

  Do not dump the triggers in *`trigger_list`*, which is a list of one or more comma-separated trigger names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--exclude-users=user_list`

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>9

  Do not dump the user accounts in *`user_list`*, which is a list of one or more comma-separated account names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--extended-insert=N`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>0

  Write `INSERT` statements using multiple-row syntax that includes several `VALUES` lists. This results in a smaller dump file and speeds up inserts when the file is reloaded.

  The option value indicates the number of rows to include in each `INSERT` statement. The default is 250. A value of 1 produces one `INSERT` statement per table row.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>1

  Request from the server the public key required for RSA key pair-based password exchange. This option applies to clients that authenticate with the ``caching_sha2_password`` authentication plugin. For that plugin, the server does not send the public key unless requested. This option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the ``caching_sha2_password`` plugin, see Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  The `--get-server-public-key` option was added in MySQL 5.7.23.

* `--hex-blob`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>2

  Dump binary columns using hexadecimal notation (for example, `'abc'` becomes `0x616263`). The affected data types are `BINARY`, `VARBINARY`, `BLOB` types, `BIT`, all spatial data types, and other non-binary data types when used with the `binary` character set.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>3

  Dump data from the MySQL server on the given host.

* `--include-databases=db_list`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>4

  Dump the databases in *`db_list`*, which is a list of one or more comma-separated database names. The dump includes all objects in the named databases. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--include-events=event_list`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>5

  Dump the events in *`event_list`*, which is a list of one or more comma-separated event names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--include-routines=routine_list`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>6

  Dump the routines in *`routine_list`*, which is a list of one or more comma-separated routine (stored procedure or function) names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--include-tables=table_list`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>7

  Dump the tables in *`table_list`*, which is a list of one or more comma-separated table names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--include-triggers=trigger_list`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>8

  Dump the triggers in *`trigger_list`*, which is a list of one or more comma-separated trigger names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--include-users=user_list`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>9

  Dump the user accounts in *`user_list`*, which is a list of one or more comma-separated user names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--insert-ignore`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>0

  Write `INSERT IGNORE` statements rather than `INSERT` statements.

* `--log-error-file=file_name`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>1

  Log warnings and errors by appending them to the named file. If this option is not given, **mysqlpump** writes warnings and errors to the standard error output.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>2

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--max-allowed-packet=N`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>3

  The maximum size of the buffer for client/server communication. The default is 24MB, the maximum is 1GB.

* `--net-buffer-length=N`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>4

  The initial size of the buffer for client/server communication. When creating multiple-row `INSERT` statements (as with the `--extended-insert` option), **mysqlpump** creates rows up to *`N`* bytes long. If you use this option to increase the value, ensure that the MySQL server `net_buffer_length` system variable has a value at least this large.

* `--no-create-db`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>5

  Suppress any `CREATE DATABASE` statements that might otherwise be included in the output.

* `--no-create-info`, `-t`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>6

  Do not write `CREATE TABLE` statements that create each dumped table.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>7

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--parallel-schemas=[N:]db_list`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>8

  Create a queue for processing the databases in *`db_list`*, which is a list of one or more comma-separated database names. If *`N`* is given, the queue uses *`N`* threads. If *`N`* is not given, the `--default-parallelism` option determines the number of queue threads.

  Multiple instances of this option create multiple queues. **mysqlpump** also creates a default queue to use for databases not named in any `--parallel-schemas` option, and for dumping user definitions if command options select them. For more information, see mysqlpump Parallel Processing.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>9

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqlpump** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 6.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqlpump** should not prompt for one, use the `--skip-password` option.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>0

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysqlpump** does not find it. See Section 6.2.13, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>1

  For TCP/IP connections, the port number to use.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>2

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>3

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 4.2.5, “Connection Transport Protocols”.

* `--replace`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>4

  Write `REPLACE` statements rather than `INSERT` statements.

* `--result-file=file_name`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>5

  Direct output to the named file. The result file is created and its previous contents overwritten, even if an error occurs while generating the dump.

  This option should be used on Windows to prevent newline `\n` characters from being converted to `\r\n` carriage return/newline sequences.

* `--routines`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>6

  Include stored routines (procedures and functions) for the dumped databases in the output. This option requires the `SELECT` privilege for the `mysql.proc` table.

  The output generated by using `--routines` contains `CREATE PROCEDURE` and `CREATE FUNCTION` statements to create the routines. However, these statements do not include attributes such as the routine creation and modification timestamps, so when the routines are reloaded, they are created with timestamps equal to the reload time.

  If you require routines to be created with their original timestamp attributes, do not use `--routines`. Instead, dump and reload the contents of the `mysql.proc` table directly, using a MySQL account that has appropriate privileges for the `mysql` database.

  This option is enabled by default; use `--skip-routines` to disable it.

* `--secure-auth`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>7

  Do not send passwords to the server in old (pre-4.1) format. This prevents connections except for servers that use the newer password format.

  This option is deprecated; expect it to be removed in a future MySQL release. It is always enabled and attempting to disable it (`--skip-secure-auth`, `--secure-auth=0`) produces an error.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>8

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or ``caching_sha2_password`` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and ``caching_sha2_password`` plugins, see Section 6.4.1.5, “SHA-256 Pluggable Authentication”, and Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  The `--server-public-key-path` option was added in MySQL 5.7.23.

* `--set-charset`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>9

  Write `SET NAMES default_character_set` to the output.

  This option is enabled by default. To disable it and suppress the `SET NAMES` statement, use `--skip-set-charset`.

* `--set-gtid-purged=value`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>0

  This option enables control over global transaction ID (GTID) information written to the dump file, by indicating whether to add a `SET @@GLOBAL.gtid_purged` statement to the output. This option may also cause a statement to be written to the output that disables binary logging while the dump file is being reloaded.

  The following table shows the permitted option values. The default value is `AUTO`.

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>1

  The `--set-gtid-purged` option has the following effect on binary logging when the dump file is reloaded:

  + `--set-gtid-purged=OFF`: `SET @@SESSION.SQL_LOG_BIN=0;` is not added to the output.

  + `--set-gtid-purged=ON`: `SET @@SESSION.SQL_LOG_BIN=0;` is added to the output.

  + `--set-gtid-purged=AUTO`: `SET @@SESSION.SQL_LOG_BIN=0;` is added to the output if GTIDs are enabled on the server you are backing up (that is, if `AUTO` evaluates to `ON`).

  This option was added in MySQL 5.7.18.

* `--single-transaction`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>2

  This option sets the transaction isolation mode to `REPEATABLE READ` and sends a `START TRANSACTION` SQL statement to the server before dumping data. It is useful only with transactional tables such as `InnoDB`, because then it dumps the consistent state of the database at the time when `START TRANSACTION` was issued without blocking any applications.

  When using this option, you should keep in mind that only `InnoDB` tables are dumped in a consistent state. For example, any `MyISAM` or `MEMORY` tables dumped while using this option may still change state.

  While a `--single-transaction` dump is in process, to ensure a valid dump file (correct table contents and binary log coordinates), no other connection should use the following statements: `ALTER TABLE`, `CREATE TABLE`, `DROP TABLE`, `RENAME TABLE`, `TRUNCATE TABLE`. A consistent read is not isolated from those statements, so use of them on a table to be dumped can cause the `SELECT` that is performed by **mysqlpump** to retrieve the table contents to obtain incorrect contents or fail.

  `--add-locks` and `--single-transaction` are mutually exclusive.

  Note

  Before MySQL 5.7.11, use of the `--single-transaction` option is mutually exclusive with parallelism. To use `--single-transaction`, disable parallelism by setting `--default-parallelism` to 0 and not using any instances of `--parallel-schemas`:

  ```sql
  mysqlpump --single-transaction --default-parallelism=0
  ```

* `--skip-definer`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>3

  Omit `DEFINER` and `SQL SECURITY` clauses from the `CREATE` statements for views and stored programs. The dump file, when reloaded, creates objects that use the default `DEFINER` and `SQL SECURITY` values. See Section 23.6, “Stored Object Access Control”.

* `--skip-dump-rows`, `-d`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>4

  Do not dump table rows.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>5

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>6

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 5.7.10.

* `--triggers`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>7

  Include triggers for each dumped table in the output.

  This option is enabled by default; use `--skip-triggers` to disable it.

* `--tz-utc`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>8

  This option enables `TIMESTAMP` columns to be dumped and reloaded between servers in different time zones. **mysqlpump** sets its connection time zone to UTC and adds `SET TIME_ZONE='+00:00'` to the dump file. Without this option, `TIMESTAMP` columns are dumped and reloaded in the time zones local to the source and destination servers, which can cause the values to change if the servers are in different time zones. `--tz-utc` also protects against changes due to daylight saving time.

  This option is enabled by default; use `--skip-tz-utc` to disable it.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>9

  The user name of the MySQL account to use for connecting to the server.

* `--users`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

  Dump user accounts as logical definitions in the form of `CREATE USER` and `GRANT` statements.

  User definitions are stored in the grant tables in the `mysql` system database. By default, **mysqlpump** does not include the grant tables in `mysql` database dumps. To dump the contents of the grant tables as logical definitions, use the `--users` option and suppress all database dumping:

  ```sql
  mysqlpump --exclude-databases=% --users
  ```

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

  Display version information and exit.

* `--watch-progress`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

  Periodically display a progress indicator that provides information about the completed and total number of tables, rows, and other objects.

  This option is enabled by default; use `--skip-watch-progress` to disable it.

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

```sql
--exclude-databases=test,world
--include-tables=customer,invoice
```

Wildcard characters are permitted in the object names:

* `%` matches any sequence of zero or more characters.

* `_` matches any single character.

For example, `--include-tables=t%,__tmp` matches all table names that begin with `t` and all five-character table names that end with `tmp`.

For users, a name specified without a host part is interpreted with an implied host of `%`. For example, `u1` and `u1@%` are equivalent. This is the same equivalence that applies in MySQL generally (see Section 6.2.4, “Specifying Account Names”).

Inclusion and exclusion options interact as follows:

* By default, with no inclusion or exclusion options, **mysqlpump** dumps all databases (with certain exceptions noted in mysqlpump Restrictions).

* If inclusion options are given in the absence of exclusion options, only the objects named as included are dumped.

* If exclusion options are given in the absence of inclusion options, all objects are dumped except those named as excluded.

* If inclusion and exclusion options are given, all objects named as excluded and not named as included are not dumped. All other objects are dumped.

If multiple databases are being dumped, it is possible to name tables, triggers, and routines in a specific database by qualifying the object names with the database name. The following command dumps databases `db1` and `db2`, but excludes tables `db1.t1` and `db2.t2`:

```sql
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

```sql
mysqlpump --parallel-schemas=db1,db2 --parallel-schemas=db3
```

**mysqlpump** sets up a queue to process `db1` and `db2`, another queue to process `db3`, and a default queue to process all other databases. All queues use two threads.

```sql
mysqlpump --parallel-schemas=db1,db2 --parallel-schemas=db3
          --default-parallelism=4
```

This is the same as the previous example except that all queues use four threads.

```sql
mysqlpump --parallel-schemas=5:db1,db2 --parallel-schemas=3:db3
```

The queue for `db1` and `db2` uses five threads, the queue for `db3` uses three threads, and the default queue uses the default of two threads.

As a special case, with `--default-parallelism=0` and no `--parallel-schemas` options, **mysqlpump** runs as a single-threaded process and creates no queues.

Note

Before MySQL 5.7.11, use of the `--single-transaction` option is mutually exclusive with parallelism. To use `--single-transaction`, disable parallelism by setting `--default-parallelism` to 0 and not using any instances of `--parallel-schemas`:

```sql
mysqlpump --single-transaction --default-parallelism=0
```

#### mysqlpump Restrictions

**mysqlpump** does not dump the `INFORMATION_SCHEMA`, `performance_schema`, `ndbinfo`, or `sys` schema by default. To dump any of these, name them explicitly on the command line. You can also name them with the `--databases` or `--include-databases` option.

**mysqlpump** does not dump `InnoDB` `CREATE TABLESPACE` statements.

**mysqlpump** dumps user accounts in logical form using `CREATE USER` and `GRANT` statements (for example, when you use the `--include-users` or `--users` option). For this reason, dumps of the `mysql` system database do not by default include the grant tables that contain user definitions: `user`, `db`, `tables_priv`, `columns_priv`, `procs_priv`, or `proxies_priv`. To dump any of the grant tables, name the `mysql` database followed by the table names:

```sql
mysqlpump mysql user db ...
```

### 4.5.7 mysqlshow — Display Database, Table, and Column Information

The **mysqlshow** client can be used to quickly see which databases exist, their tables, or a table's columns or indexes.

**mysqlshow** provides a command-line interface to several SQL `SHOW` statements. See Section 13.7.5, “SHOW Statements”. The same information can be obtained by using those statements directly. For example, you can issue them from the **mysql** client program.

Invoke **mysqlshow** like this:

```sql
mysqlshow [options] [db_name [tbl_name [col_name]]]
```

* If no database is given, a list of database names is shown.
* If no table is given, all matching tables in the database are shown.

* If no column is given, all matching columns and column types in the table are shown.

The output displays only the names of those databases, tables, or columns for which you have some privileges.

If the last argument contains shell or SQL wildcard characters (`*`, `?`, `%`, or `_`), only those names that are matched by the wildcard are shown. If a database name contains any underscores, those should be escaped with a backslash (some Unix shells require two) to get a list of the proper tables or columns. `*` and `?` characters are converted into SQL `%` and `_` wildcard characters. This might cause some confusion when you try to display the columns for a table with a `_` in the name, because in this case, **mysqlshow** shows you only the table names that match the pattern. This is easily fixed by adding an extra `%` last on the command line as a separate argument.

**mysqlshow** supports the following options, which can be specified on the command line or in the `[mysqlshow]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see Section 4.2.2.2, “Using Option Files”.

**Table 4.19 mysqlshow Options**

<table frame="box" rules="all" summary="Command-line options available for mysqlshow.">
  <col style="width: 27%"/>
  <col style="width: 50%"/>
  <col style="width: 11%"/>
  <col style="width: 11%"/>
  <thead>
    <tr>
      <th>Option Name</th>
      <th>Description</th>
      <th>Introduced</th>
      <th>Deprecated</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>--bind-address</code></th>
      <td>Use specified network interface to connect to MySQL Server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--character-sets-dir</code></th>
      <td>Directory where character sets can be found</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--compress</code></th>
      <td>Compress all information sent between client and server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--count</code></th>
      <td>Show the number of rows per table</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug</code></th>
      <td>Write debugging log</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-check</code></th>
      <td>Print debugging information when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-info</code></th>
      <td>Print debugging information, memory, and CPU statistics when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-auth</code></th>
      <td>Authentication plugin to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-character-set</code></th>
      <td>Specify default character set</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-extra-file</code></th>
      <td>Read named option file in addition to usual option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-file</code></th>
      <td>Read only named option file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-group-suffix</code></th>
      <td>Option group suffix value</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--enable-cleartext-plugin</code></th>
      <td>Enable cleartext authentication plugin</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--get-server-public-key</code></th>
      <td>Request RSA public key from server</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--help</code></th>
      <td>Display help message and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--host</code></th>
      <td>Host on which MySQL server is located</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--keys</code></th>
      <td>Show table indexes</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--login-path</code></th>
      <td>Read login path options from .mylogin.cnf</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-defaults</code></th>
      <td>Read no option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--password</code></th>
      <td>Password to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--pipe</code></th>
      <td>Connect to server using named pipe (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--plugin-dir</code></th>
      <td>Directory where plugins are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--port</code></th>
      <td>TCP/IP port number for connection</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--print-defaults</code></th>
      <td>Print default options</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--protocol</code></th>
      <td>Transport protocol to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--secure-auth</code></th>
      <td>Do not send passwords to server in old (pre-4.1) format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--server-public-key-path</code></th>
      <td>Path name to file containing RSA public key</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--shared-memory-base-name</code></th>
      <td>Shared-memory name for shared-memory connections (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--show-table-type</code></th>
      <td>Show a column indicating the table type</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--socket</code></th>
      <td>Unix socket file or Windows named pipe to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl</code></th>
      <td>Enable connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-ca</code></th>
      <td>File that contains list of trusted SSL Certificate Authorities</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-capath</code></th>
      <td>Directory that contains trusted SSL Certificate Authority certificate files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cert</code></th>
      <td>File that contains X.509 certificate</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cipher</code></th>
      <td>Permissible ciphers for connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crl</code></th>
      <td>File that contains certificate revocation lists</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crlpath</code></th>
      <td>Directory that contains certificate revocation-list files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-key</code></th>
      <td>File that contains X.509 key</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-mode</code></th>
      <td>Desired security state of connection to server</td>
      <td>5.7.11</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-verify-server-cert</code></th>
      <td>Verify host name against server certificate Common Name identity</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--status</code></th>
      <td>Display extra information about each table</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tls-version</code></th>
      <td>Permissible TLS protocols for encrypted connections</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--user</code></th>
      <td>MySQL user name to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--verbose</code></th>
      <td>Verbose mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--version</code></th>
      <td>Display version information and exit</td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On a computer having multiple network interfaces, use this option to select which interface to use for connecting to the MySQL server.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  The directory where character sets are installed. See Section 10.15, “Character Set Configuration”.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compress all information sent between the client and the server if possible. See Section 4.2.6, “Connection Compression Control”.

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

  <table frame="box" rules="all" summary="Properties for default-character-set"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--default-character-set=charset_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Use *`charset_name`* as the default character set. See Section 10.15, “Character Set Configuration”.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  A hint about which client-side authentication plugin to use. See Section 6.2.13, “Pluggable Authentication”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysqlshow** normally reads the `[client]` and `[mysqlshow]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysqlshow** also reads the `[client_other]` and `[mysqlshow_other]` groups.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Enable the `mysql_clear_password` cleartext authentication plugin. (See Section 6.4.1.6, “Client-Side Cleartext Pluggable Authentication”.)

  This option was added in MySQL 5.7.10.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Request from the server the RSA public key that it uses for key pair-based password exchange. This option applies to clients that connect to the server using an account that authenticates with the ``caching_sha2_password`` authentication plugin. For connections by such accounts, the server does not send the public key to the client unless requested. The option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not needed, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the ``caching_sha2_password`` plugin, see Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  The `--get-server-public-key` option was added in MySQL 5.7.23.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Connect to the MySQL server on the given host.

* `--keys`, `-k`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Show table indexes.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqlshow** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 6.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqlshow** should not prompt for one, use the `--skip-password` option.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On Windows, connect to the server using a named pipe. This option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysqlshow** does not find it. See Section 6.2.13, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  For TCP/IP connections, the port number to use.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 4.2.5, “Connection Transport Protocols”.

* `--secure-auth`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Do not send passwords to the server in old (pre-4.1) format. This prevents connections except for servers that use the newer password format.

  As of MySQL 5.7.5, this option is deprecated; expect it to be removed in a future MySQL release. It is always enabled and attempting to disable it (`--skip-secure-auth`, `--secure-auth=0`) produces an error. Before MySQL 5.7.5, this option is enabled by default but can be disabled.

  Note

  Passwords that use the pre-4.1 hashing method are less secure than passwords that use the native password hashing method and should be avoided. Pre-4.1 passwords are deprecated and support for them was removed in MySQL 5.7.5. For account upgrade instructions, see Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql\_old\_password Plugin”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or ``caching_sha2_password`` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and ``caching_sha2_password`` plugins, see Section 6.4.1.5, “SHA-256 Pluggable Authentication”, and Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  The `--server-public-key-path` option was added in MySQL 5.7.23.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On Windows, the shared-memory name to use for connections made using shared memory to a local server. The default value is `MYSQL`. The shared-memory name is case-sensitive.

  This option applies only if the server was started with the `shared_memory` system variable enabled to support shared-memory connections.

* `--show-table-type`, `-t`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Show a column indicating the table type, as in `SHOW FULL TABLES`. The type is `BASE TABLE` or `VIEW`.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--status`, `-i`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Display extra information about each table.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 5.7.10.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  The user name of the MySQL account to use for connecting to the server.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Verbose mode. Print more information about what the program does. This option can be used multiple times to increase the amount of information.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Display version information and exit.

### 4.5.8 mysqlslap — A Load Emulation Client

**mysqlslap** is a diagnostic program designed to emulate client load for a MySQL server and to report the timing of each stage. It works as if multiple clients are accessing the server.

Invoke **mysqlslap** like this:

```sql
mysqlslap [options]
```

Some options such as `--create` or `--query` enable you to specify a string containing an SQL statement or a file containing statements. If you specify a file, by default it must contain one statement per line. (That is, the implicit statement delimiter is the newline character.) Use the `--delimiter` option to specify a different delimiter, which enables you to specify statements that span multiple lines or place multiple statements on a single line. You cannot include comments in a file; **mysqlslap** does not understand them.

**mysqlslap** runs in three stages:

1. Create schema, table, and optionally any stored programs or data to use for the test. This stage uses a single client connection.

2. Run the load test. This stage can use many client connections.

3. Clean up (disconnect, drop table if specified). This stage uses a single client connection.

Examples:

Supply your own create and query SQL statements, with 50 clients querying and 200 selects for each (enter the command on a single line):

```sql
mysqlslap --delimiter=";"
  --create="CREATE TABLE a (b int);INSERT INTO a VALUES (23)"
  --query="SELECT * FROM a" --concurrency=50 --iterations=200
```

Let **mysqlslap** build the query SQL statement with a table of two `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") columns and three `VARCHAR` columns. Use five clients querying 20 times each. Do not create the table or insert the data (that is, use the previous test's schema and data):

```sql
mysqlslap --concurrency=5 --iterations=20
  --number-int-cols=2 --number-char-cols=3
  --auto-generate-sql
```

Tell the program to load the create, insert, and query SQL statements from the specified files, where the `create.sql` file has multiple table creation statements delimited by `';'` and multiple insert statements delimited by `';'`. The `--query` file has multiple queries delimited by `';'`. Run all the load statements, then run all the queries in the query file with five clients (five times each):

```sql
mysqlslap --concurrency=5
  --iterations=5 --query=query.sql --create=create.sql
  --delimiter=";"
```

**mysqlslap** supports the following options, which can be specified on the command line or in the `[mysqlslap]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see Section 4.2.2.2, “Using Option Files”.

**Table 4.20 mysqlslap Options**

<table frame="box" rules="all" summary="Command-line options available for mysqlslap.">
  <col style="width: 27%"/>
  <col style="width: 50%"/>
  <col style="width: 11%"/>
  <col style="width: 11%"/>
  <thead>
    <tr>
      <th>Option Name</th>
      <th>Description</th>
      <th>Introduced</th>
      <th>Deprecated</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><code>--auto-generate-sql</code></th>
      <td>Generate SQL statements automatically when they are not supplied in files or using command options</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--auto-generate-sql-add-autoincrement</code></th>
      <td>Add AUTO_INCREMENT column to automatically generated tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--auto-generate-sql-execute-number</code></th>
      <td>Specify how many queries to generate automatically</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--auto-generate-sql-guid-primary</code></th>
      <td>Add a GUID-based primary key to automatically generated tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--auto-generate-sql-load-type</code></th>
      <td>Specify the test load type</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--auto-generate-sql-secondary-indexes</code></th>
      <td>Specify how many secondary indexes to add to automatically generated tables</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--auto-generate-sql-unique-query-number</code></th>
      <td>How many different queries to generate for automatic tests</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--auto-generate-sql-unique-write-number</code></th>
      <td>How many different queries to generate for --auto-generate-sql-write-number</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--auto-generate-sql-write-number</code></th>
      <td>How many row inserts to perform on each thread</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--commit</code></th>
      <td>How many statements to execute before committing</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--compress</code></th>
      <td>Compress all information sent between client and server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--concurrency</code></th>
      <td>Number of clients to simulate when issuing the SELECT statement</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--create</code></th>
      <td>File or string containing the statement to use for creating the table</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--create-schema</code></th>
      <td>Schema in which to run the tests</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--csv</code></th>
      <td>Generate output in comma-separated values format</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug</code></th>
      <td>Write debugging log</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-check</code></th>
      <td>Print debugging information when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--debug-info</code></th>
      <td>Print debugging information, memory, and CPU statistics when program exits</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--default-auth</code></th>
      <td>Authentication plugin to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-extra-file</code></th>
      <td>Read named option file in addition to usual option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-file</code></th>
      <td>Read only named option file</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--defaults-group-suffix</code></th>
      <td>Option group suffix value</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--delimiter</code></th>
      <td>Delimiter to use in SQL statements</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--detach</code></th>
      <td>Detach (close and reopen) each connection after each N statements</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--enable-cleartext-plugin</code></th>
      <td>Enable cleartext authentication plugin</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--engine</code></th>
      <td>Storage engine to use for creating the table</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--get-server-public-key</code></th>
      <td>Request RSA public key from server</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--help</code></th>
      <td>Display help message and exit</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--host</code></th>
      <td>Host on which MySQL server is located</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--iterations</code></th>
      <td>Number of times to run the tests</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--login-path</code></th>
      <td>Read login path options from .mylogin.cnf</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-defaults</code></th>
      <td>Read no option files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--no-drop</code></th>
      <td>Do not drop any schema created during the test run</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--number-char-cols</code></th>
      <td>Number of VARCHAR columns to use if --auto-generate-sql is specified</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--number-int-cols</code></th>
      <td>Number of INT columns to use if --auto-generate-sql is specified</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--number-of-queries</code></th>
      <td>Limit each client to approximately this number of queries</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--only-print</code></th>
      <td>Do not connect to databases. mysqlslap only prints what it would have done</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--password</code></th>
      <td>Password to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--pipe</code></th>
      <td>Connect to server using named pipe (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--plugin-dir</code></th>
      <td>Directory where plugins are installed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--port</code></th>
      <td>TCP/IP port number for connection</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--post-query</code></th>
      <td>File or string containing the statement to execute after the tests have completed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--post-system</code></th>
      <td>String to execute using system() after the tests have completed</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--pre-query</code></th>
      <td>File or string containing the statement to execute before running the tests</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--pre-system</code></th>
      <td>String to execute using system() before running the tests</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--print-defaults</code></th>
      <td>Print default options</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--protocol</code></th>
      <td>Transport protocol to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--query</code></th>
      <td>File or string containing the SELECT statement to use for retrieving data</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--secure-auth</code></th>
      <td>Do not send passwords to server in old (pre-4.1) format</td>
      <td></td>
      <td>Yes</td>
    </tr>
    <tr>
      <th><code>--server-public-key-path</code></th>
      <td>Path name to file containing RSA public key</td>
      <td>5.7.23</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--shared-memory-base-name</code></th>
      <td>Shared-memory name for shared-memory connections (Windows only)</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--silent</code></th>
      <td>Silent mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--socket</code></th>
      <td>Unix socket file or Windows named pipe to use</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--sql-mode</code></th>
      <td>Set SQL mode for client session</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl</code></th>
      <td>Enable connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-ca</code></th>
      <td>File that contains list of trusted SSL Certificate Authorities</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-capath</code></th>
      <td>Directory that contains trusted SSL Certificate Authority certificate files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cert</code></th>
      <td>File that contains X.509 certificate</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-cipher</code></th>
      <td>Permissible ciphers for connection encryption</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crl</code></th>
      <td>File that contains certificate revocation lists</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-crlpath</code></th>
      <td>Directory that contains certificate revocation-list files</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-key</code></th>
      <td>File that contains X.509 key</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-mode</code></th>
      <td>Desired security state of connection to server</td>
      <td>5.7.11</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--ssl-verify-server-cert</code></th>
      <td>Verify host name against server certificate Common Name identity</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--tls-version</code></th>
      <td>Permissible TLS protocols for encrypted connections</td>
      <td>5.7.10</td>
      <td></td>
    </tr>
    <tr>
      <th><code>--user</code></th>
      <td>MySQL user name to use when connecting to server</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--verbose</code></th>
      <td>Verbose mode</td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <th><code>--version</code></th>
      <td>Display version information and exit</td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

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

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  How many row inserts to perform. The default is 100.

* `--commit=N`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  How many statements to execute before committing. The default is 0 (no commits are done).

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Compress all information sent between the client and the server if possible. See Section 4.2.6, “Connection Compression Control”.

* `--concurrency=N`, `-c N`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  The number of parallel clients to simulate.

* `--create=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  The file or string containing the statement to use for creating the table.

* `--create-schema=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  The schema in which to run the tests.

  Note

  If the `--auto-generate-sql` option is also given, **mysqlslap** drops the schema at the end of the test run. To avoid this, use the `--no-drop` option as well.

* `--csv[=file_name]`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Generate output in comma-separated values format. The output goes to the named file, or to the standard output if no file is given.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:o,/tmp/mysqlslap.trace`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Print debugging information and memory and CPU usage statistics when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  A hint about which client-side authentication plugin to use. See Section 6.2.13, “Pluggable Authentication”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysqlslap** normally reads the `[client]` and `[mysqlslap]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysqlslap** also reads the `[client_other]` and `[mysqlslap_other]` groups.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--delimiter=str`, `-F str`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  The delimiter to use in SQL statements supplied in files or using command options.

* `--detach=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Detach (close and reopen) each connection after each *`N`* statements. The default is 0 (connections are not detached).

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Enable the `mysql_clear_password` cleartext authentication plugin. (See Section 6.4.1.6, “Client-Side Cleartext Pluggable Authentication”.)

* `--engine=engine_name`, `-e engine_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  The storage engine to use for creating tables.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Request from the server the RSA public key that it uses for key pair-based password exchange. This option applies to clients that connect to the server using an account that authenticates with the ``caching_sha2_password`` authentication plugin. For connections by such accounts, the server does not send the public key to the client unless requested. The option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not needed, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the ``caching_sha2_password`` plugin, see Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  The `--get-server-public-key` option was added in MySQL 5.7.23.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Connect to the MySQL server on the given host.

* `--iterations=N`, `-i N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  The number of times to run the tests.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--no-drop`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Prevent **mysqlslap** from dropping any schema it creates during the test run.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--number-char-cols=N`, `-x N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  The number of `VARCHAR` columns to use if `--auto-generate-sql` is specified.

* `--number-int-cols=N`, `-y N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  The number of `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") columns to use if `--auto-generate-sql` is specified.

* `--number-of-queries=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Limit each client to approximately this many queries. Query counting takes into account the statement delimiter. For example, if you invoke **mysqlslap** as follows, the `;` delimiter is recognized so that each instance of the query string counts as two queries. As a result, 5 rows (not 10) are inserted.

  ```sql
  mysqlslap --delimiter=";" --number-of-queries=10
            --query="use test;insert into t values(null)"
  ```

* `--only-print`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Do not connect to databases. **mysqlslap** only prints what it would have done.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqlslap** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 6.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqlslap** should not prompt for one, use the `--skip-password` option.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  On Windows, connect to the server using a named pipe. This option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysqlslap** does not find it. See Section 6.2.13, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  For TCP/IP connections, the port number to use.

* `--post-query=value`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  The file or string containing the statement to execute after the tests have completed. This execution is not counted for timing purposes.

* `--post-system=str`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  The string to execute using `system()` after the tests have completed. This execution is not counted for timing purposes.

* `--pre-query=value`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  The file or string containing the statement to execute before running the tests. This execution is not counted for timing purposes.

* `--pre-system=str`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  The string to execute using `system()` before running the tests. This execution is not counted for timing purposes.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 4.2.5, “Connection Transport Protocols”.

* `--query=value`, `-q value`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  The file or string containing the `SELECT` statement to use for retrieving data.

* `--secure-auth`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  Do not send passwords to the server in old (pre-4.1) format. This prevents connections except for servers that use the newer password format.

  As of MySQL 5.7.5, this option is deprecated; expect it to be removed in a future MySQL release. It is always enabled and attempting to disable it (`--skip-secure-auth`, `--secure-auth=0`) produces an error. Before MySQL 5.7.5, this option is enabled by default but can be disabled.

  Note

  Passwords that use the pre-4.1 hashing method are less secure than passwords that use the native password hashing method and should be avoided. Pre-4.1 passwords are deprecated and support for them was removed in MySQL 5.7.5. For account upgrade instructions, see Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql\_old\_password Plugin”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or ``caching_sha2_password`` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and ``caching_sha2_password`` plugins, see Section 6.4.1.5, “SHA-256 Pluggable Authentication”, and Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  The `--server-public-key-path` option was added in MySQL 5.7.23.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  On Windows, the shared-memory name to use for connections made using shared memory to a local server. The default value is `MYSQL`. The shared-memory name is case-sensitive.

  This option applies only if the server was started with the `shared_memory` system variable enabled to support shared-memory connections.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Silent mode. No output.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--sql-mode=mode`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Set the SQL mode for the client session.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 5.7.10.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  The user name of the MySQL account to use for connecting to the server.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Verbose mode. Print more information about what the program does. This option can be used multiple times to increase the amount of information.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Display version information and exit.

