#### 4.5.1.1 mysql Client Options

**mysql** supports the following options, which can be specified on the command line or in the `[mysql]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see Section 4.2.2.2, “Using Option Files”.

**Table 4.13 mysql Client Options**

<table frame="box" rules="all" summary="Command-line options available for the mysql client."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_auto-rehash">--auto-rehash</a></th> <td>Enable automatic rehashing</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_auto-vertical-output">--auto-vertical-output</a></th> <td>Enable automatic vertical result set display</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_batch">--batch</a></th> <td>Do not use history file</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_binary-as-hex">--binary-as-hex</a></th> <td>Display binary values in hexadecimal notation</td> <td>5.7.19</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_binary-mode">--binary-mode</a></th> <td>Disable \r\n - to - \n translation and treatment of \0 as end-of-query</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_bind-address">--bind-address</a></th> <td>Use specified network interface to connect to MySQL Server</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_character-sets-dir">--character-sets-dir</a></th> <td>Directory where character sets are installed</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_column-names">--column-names</a></th> <td>Write column names in results</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_column-type-info">--column-type-info</a></th> <td>Display result set metadata</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_commands">--commands</a></th> <td>Enable or disable processing of local mysql client commands</td> <td>5.7.44-ndb-7.6.35</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_comments">--comments</a></th> <td>Whether to retain or strip comments in statements sent to the server</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_compress">--compress</a></th> <td>Compress all information sent between client and server</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_connect-expired-password">--connect-expired-password</a></th> <td>Indicate to server that client can handle expired-password sandbox mode</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_connect-timeout">--connect-timeout</a></th> <td>Number of seconds before connection timeout</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_database">--database</a></th> <td>The database to use</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_debug">--debug</a></th> <td>Write debugging log; supported only if MySQL was built with debugging support</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_debug-check">--debug-check</a></th> <td>Print debugging information when program exits</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_debug-info">--debug-info</a></th> <td>Print debugging information, memory, and CPU statistics when program exits</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_default-auth">--default-auth</a></th> <td>Authentication plugin to use</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_default-character-set">--default-character-set</a></th> <td>Specify default character set</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_defaults-extra-file">--defaults-extra-file</a></th> <td>Read named option file in addition to usual option files</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_defaults-file">--defaults-file</a></th> <td>Read only named option file</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_defaults-group-suffix">--defaults-group-suffix</a></th> <td>Option group suffix value</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_delimiter">--delimiter</a></th> <td>Set the statement delimiter</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_enable-cleartext-plugin">--enable-cleartext-plugin</a></th> <td>Enable cleartext authentication plugin</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_execute">--execute</a></th> <td>Execute the statement and quit</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_force">--force</a></th> <td>Continue even if an SQL error occurs</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_get-server-public-key">--get-server-public-key</a></th> <td>Request RSA public key from server</td> <td>5.7.23</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_help">--help</a></th> <td>Display help message and exit</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_histignore">--histignore</a></th> <td>Patterns specifying which statements to ignore for logging</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_host">--host</a></th> <td>Host on which MySQL server is located</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_html">--html</a></th> <td>Produce HTML output</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ignore-spaces">--ignore-spaces</a></th> <td>Ignore spaces after function names</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_init-command">--init-command</a></th> <td>SQL statement to execute after connecting</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_line-numbers">--line-numbers</a></th> <td>Write line numbers for errors</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_local-infile">--local-infile</a></th> <td>Enable or disable for LOCAL capability for LOAD DATA</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_login-path">--login-path</a></th> <td>Read login path options from .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_max-allowed-packet">--max-allowed-packet</a></th> <td>Maximum packet length to send to or receive from server</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_max-join-size">--max-join-size</a></th> <td>The automatic limit for rows in a join when using --safe-updates</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_named-commands">--named-commands</a></th> <td>Enable named mysql commands</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_net-buffer-length">--net-buffer-length</a></th> <td>Buffer size for TCP/IP and socket communication</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_no-auto-rehash">--no-auto-rehash</a></th> <td>Disable automatic rehashing</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_no-beep">--no-beep</a></th> <td>Do not beep when errors occur</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_no-defaults">--no-defaults</a></th> <td>Read no option files</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_one-database">--one-database</a></th> <td>Ignore statements except those for the default database named on the command line</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_pager">--pager</a></th> <td>Use the given command for paging query output</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_password">--password</a></th> <td>Password to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_pipe">--pipe</a></th> <td>Connect to server using named pipe (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_plugin-dir">--plugin-dir</a></th> <td>Directory where plugins are installed</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_port">--port</a></th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_print-defaults">--print-defaults</a></th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_prompt">--prompt</a></th> <td>Set the prompt to the specified format</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_protocol">--protocol</a></th> <td>Transport protocol to use</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_quick">--quick</a></th> <td>Do not cache each query result</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_raw">--raw</a></th> <td>Write column values without escape conversion</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_reconnect">--reconnect</a></th> <td>If the connection to the server is lost, automatically try to reconnect</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_safe-updates">--safe-updates</a>, <a class="link" href="mysql-command-options.html#option_mysql_safe-updates">--i-am-a-dummy</a></th> <td>Allow only UPDATE and DELETE statements that specify key values</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_secure-auth">--secure-auth</a></th> <td>Do not send passwords to server in old (pre-4.1) format</td> <td></td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_select-limit">--select-limit</a></th> <td>The automatic limit for SELECT statements when using --safe-updates</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_server-public-key-path">--server-public-key-path</a></th> <td>Path name to file containing RSA public key</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_shared-memory-base-name">--shared-memory-base-name</a></th> <td>Shared-memory name for shared-memory connections (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_show-warnings">--show-warnings</a></th> <td>Show warnings after each statement if there are any</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_sigint-ignore">--sigint-ignore</a></th> <td>Ignore SIGINT signals (typically the result of typing Control+C)</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_silent">--silent</a></th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_auto-rehash">--skip-auto-rehash</a></th> <td>Disable automatic rehashing</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_skip-column-names">--skip-column-names</a></th> <td>Do not write column names in results</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_skip-line-numbers">--skip-line-numbers</a></th> <td>Skip line numbers for errors</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_named-commands">--skip-named-commands</a></th> <td>Disable named mysql commands</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_pager">--skip-pager</a></th> <td>Disable paging</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_reconnect">--skip-reconnect</a></th> <td>Disable reconnecting</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_socket">--socket</a></th> <td>Unix socket file or Windows named pipe to use</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl</a></th> <td>Enable connection encryption</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-ca</a></th> <td>File that contains list of trusted SSL Certificate Authorities</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-capath</a></th> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-cert</a></th> <td>File that contains X.509 certificate</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-cipher</a></th> <td>Permissible ciphers for connection encryption</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-crl</a></th> <td>File that contains certificate revocation lists</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-crlpath</a></th> <td>Directory that contains certificate revocation-list files</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-key</a></th> <td>File that contains X.509 key</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-mode</a></th> <td>Desired security state of connection to server</td> <td>5.7.11</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_ssl">--ssl-verify-server-cert</a></th> <td>Verify host name against server certificate Common Name identity</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_syslog">--syslog</a></th> <td>Log interactive statements to syslog</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_table">--table</a></th> <td>Display output in tabular format</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_tee">--tee</a></th> <td>Append a copy of output to named file</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_tls-version">--tls-version</a></th> <td>Permissible TLS protocols for encrypted connections</td> <td>5.7.10</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_unbuffered">--unbuffered</a></th> <td>Flush the buffer after each query</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_user">--user</a></th> <td>MySQL user name to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_verbose">--verbose</a></th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_version">--version</a></th> <td>Display version information and exit</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_vertical">--vertical</a></th> <td>Print query output rows vertically (one line per column value)</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_wait">--wait</a></th> <td>If the connection cannot be established, wait and retry instead of aborting</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysql-command-options.html#option_mysql_xml">--xml</a></th> <td>Produce XML output</td> <td></td> <td></td> </tr></tbody></table>

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

  Request from the server the public key required for RSA key pair-based password exchange. This option applies to clients that authenticate with the `caching_sha2_password` authentication plugin. For that plugin, the server does not send the public key unless requested. This option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the `caching_sha2_password` plugin, see Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

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

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or `caching_sha2_password` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and `caching_sha2_password` plugins, see Section 6.4.1.5, “SHA-256 Pluggable Authentication”, and Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

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
